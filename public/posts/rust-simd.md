---
title: "Playing with Portable SIMD in Rust"
date: "2024-05-29"
tags:
    - rust
    - programming language
    - SIMD
---

I am playing with Mojo language these days, and I am curious about how Rust handles (or will handle) the SIMD operations and APIs with `std::simd`. I know that there are several stable vectorization approaches in Rust, such as `std::arch`, and auto-vectorization by rustc. Also, there are a few crates that provide SIMD support. But I really want to know the on-going status of the portable SIMD support in Rust.

## Experimental Portable SIMD Support in Rust

The `std::arch` provides several low-level intrinsic-like functions for SIMD operations, and to use them, an `unsafe` block is required. But in the nightly channel of Rust, there is an experimental feature called [`std::simd`](https://doc.rust-lang.org/std/simd/index.html) that provides an abstraction over the SIMD operations.

Note that this feature is currently nightly-only, and the APIs might change in the future. All the code snippets in this post are tested on the `nightly-2024-05-28`, and the code can be found on [GitHub](https://github.com/JuniMay/playing-rust-simd). If anything here is wrong (e.g., the algorithm/benchmark metrices/usages/...), please [e-mail me](mailto:junimayerst@gmail.com) and let me know.

## Try Portable SIMD in Rust with Matmul

I came up with a very simple idea that I am going to write a matrix multiplication program in Rust and optimize it step-by-step with the portable SIMD (and other techniques), to see how much speedup will be provided by Rust (or the algorithms). So this post will also contains some matmul optimization tricks.

### Naive Matmul

Firstly, a very naive matmul is implemented, no cache and no parallelization:

```rust
fn matmul_naive(a: &[f32], b: &[f32], c: &mut [f32], m: usize, n: usize, k: usize) {
    for i in 0..m {
        for j in 0..n {
            for l in 0..k {
                c[i * n + j] += a[i * k + l] * b[l * n + j];
            }
        }
    }
}
```

This is so straightforward and no auto-vectorization will be performed by the rustc (check [compiler explorer](https://godbolt.org/z/8x41e7EKb)).

### Utilize Cache Locality

Just interchange the two inner loops and there will be a large performance boost:

```rust
fn matmul_loop_interchange(a: &[f32], b: &[f32], c: &mut [f32], m: usize, n: usize, k: usize) {
    for i in 0..m {
        for l in 0..k {
            for j in 0..n {
                c[i * n + j] += a[i * k + l] * b[l * n + j];
            }
        }
    }
}
```

To compare this two approaches, it's time to write a benchmark function (I did not use `cargo bench` here and just run the function in `main`):

```rust
fn benchmark<F>(
    f: F,
    num_iterations: usize,
    warmup_iterations: usize,
    m: usize,
    n: usize,
    k: usize,
) -> (f64, f64)
where
    F: Fn(&[f32], &[f32], &mut [f32], usize, usize, usize),
{
    let mut rng = rand::thread_rng();
    let a: Vec<f32> = (0..m * k).map(|_| rng.gen()).collect();
    let b: Vec<f32> = (0..k * n).map(|_| rng.gen()).collect();
    let mut c: Vec<f32> = vec![0.0; m * n];
    for _ in 0..warmup_iterations {
        f(&a, &b, &mut c, m, n, k);
    }
    let start = std::time::Instant::now();
    for _ in 0..num_iterations {
        f(&a, &b, &mut c, m, n, k);
    }
    let elapsed = start.elapsed();
    let time = elapsed.as_secs_f64() / num_iterations as f64;
    let gflops = 2.0 * m as f64 * n as f64 * k as f64 / time / 1e9;

    (time, gflops)
}
```

Note that the result matrix `c` is not cleared before each iteration, but it's fine for the benchmark. I wrote a test in the repo to check the correctness of the matmul functions, and it seems that this function is correct (again, if anything is wrong, please let me know).

Then just run the benchmark with `cargo run --release`, and the result is:

```text
Naive: 4.107321 s, 0.522843 GFLOPS
Loop interchange: 0.080529 s, 26.667317 GFLOPS
```

That is a lot. The compiler here actually auto-vectorized the inner loop (check [the output](https://godbolt.org/z/oWqs9aerY)).

### Re-Slicing and Iterator

Iterator is usually the idiomatic and performant way to iterate over a slice in Rust. There are multiple reasons:

1. Iterator can sometimes be more readable and concise.
2. With re-slicing, the compiler can optimize the bounds check away (see [Bounds Check Cookbook](https://github.com/Shnatsel/bounds-check-cookbook)).
3. Sometimes the compiler can vectorize the loop with iterator.

And the matrix multiplication can be simply converted to iterator:

```rust
fn matmul_iterator(a: &[f32], b: &[f32], c: &mut [f32], m: usize, n: usize, k: usize) {
    for i in 0..m {
        for l in 0..k {
            let a_il = a[i * k + l];
            let b_ln = &b[l * n..(l + 1) * n];
            let c_in = &mut c[i * n..(i + 1) * n];
            for (c_ij, b_lj) in c_in.iter_mut().zip(b_ln.iter()) {
                *c_ij += a_il * b_lj;
            }
        }
    }
}
```

This abstracts the inner loop to:

1. Take out a row from `b[l, 0..n]` and multiply it with a scalar `a[i, l]`.
2. Add the multiplied row to the result row `c[i, 0..n]`.

And the benchmark result is:

```text
Naive: 4.056953 s, 0.529334 GFLOPS
Loop interchange: 0.079351 s, 27.063070 GFLOPS
Iterator: 0.077885 s, 27.572328 GFLOPS
```

It is a little bit faster (of course, there can be some variance in the benchmark).

### Portable SIMD of Rust

Finally, there comes the portable SIMD. It is very simple to change the iterator into SIMD. But there might be some issues when the SIMD width is not the same as the data-to-process width. Here, I just re-slice the row and use `Simd::load_or_default` to mitigate the issue:

```rust
const SIMD_WIDTH: usize = 64;

fn matmul_simd(a: &[f32], b: &[f32], c: &mut [f32], m: usize, n: usize, k: usize) {
    for i in 0..m {
        for l in 0..k {
            let a_il = a[i * k + l];
            let b_ln = &b[l * n..(l + 1) * n];
            let c_row = &mut c[i * n..(i + 1) * n];

            let mut j = 0;
            while j < n {
                let c_ij = Simd::<f32, SIMD_WIDTH>::load_or_default(&c_row[j..]);
                let b_lj = Simd::<f32, SIMD_WIDTH>::load_or_default(&b_ln[j..]);
                let result = c_ij + b_lj * Simd::<f32, SIMD_WIDTH>::splat(a_il);
                // if the element is out of bounds, store_select will ignore it
                result.store_select(&mut c_row[j..], Mask::splat(true));
                j += SIMD_WIDTH;
            }
        }
    }
}
```

The benchmark results are as below:

```text
Naive: 4.199262 s, 0.511395 GFLOPS
Loop interchange: 0.079429 s, 27.036435 GFLOPS
Iterator: 0.078145 s, 27.480582 GFLOPS
SIMD: 0.077408 s, 27.742531 GFLOPS
```

A little bit faster, but not that much. The auto-vectorization of the compiler is really powerful (or I did not write the SIMD code in a good way).

### Using Rayon to Parallelize

There is a function in Mojo called `parallelize`, which can parallelize the computation given the number of works and workers. In Rust, `rayon` can be used to realize a similar functionality of data parallelism. However, the usage is quite different. The threads in `rayon` are managed implicitly (though there are several ways to control the thread pool), and the parallelization is done in a iterator-like way.

Of course, parallelizing is not quite relevant to SIMD, so here I just benchmarked the parallelized version of the matmul for fun:

```rust
fn matmul_parallelized(a: &[f32], b: &[f32], c: &mut [f32], m: usize, n: usize, k: usize) {
    c.par_chunks_mut(n)
        .take(m)
        .enumerate()
        .for_each(|(i, row)| {
            for l in 0..k {
                let a_il = a[i * k + l];
                let b_ln = &b[l * n..(l + 1) * n];

                let mut j = 0;

                let num_simd = n / SIMD_WIDTH;
                let num_scalar = n % SIMD_WIDTH;

                for _ in 0..num_simd {
                    // if using `load_or_default` and remove the upper boundary, the performance
                    // will be even worse than non-paralleled version
                    let c_ij = Simd::<f32, SIMD_WIDTH>::from_slice(&row[j..j + SIMD_WIDTH]);
                    let b_lj = Simd::<f32, SIMD_WIDTH>::from_slice(&b_ln[j..j + SIMD_WIDTH]);
                    let result = c_ij + b_lj * Simd::<f32, SIMD_WIDTH>::splat(a_il);
                    result.store_select(&mut row[j..j + SIMD_WIDTH], Mask::splat(true));
                    j += SIMD_WIDTH;
                }

                for _ in 0..num_scalar {
                    row[j] += a_il * b_ln[j];
                    j += 1;
                }
            }
        })
}
```

There is a strange behavior that if I use `load_or_default` in the parallelized version (just like the inner loop of the SIMD version), the performance will be even worse than the non-parallelized version. I am not sure why this happens. By inspecting the performance of the parallelized version, it seems that each threads consume more CPU time than the non-parallelized version. Maybe some complex boundary check or synchronization is introduced.

I also implemented a parallelized version with iterator, and utilize the auto-vectorization of the compiler instead of manually crafting the SIMD instructions. The performances of the two parallelized versions are quite similar:

```text
Naive: 4.001618 s, 0.536654 GFLOPS
Loop interchange: 0.079414 s, 27.041701 GFLOPS
Iterator: 0.078122 s, 27.488982 GFLOPS
SIMD: 0.077155 s, 27.833308 GFLOPS
Rayon threads: 12
Parallelized autovectorize: 0.010134 s, 211.905494 GFLOPS
Parallelized: 0.010197 s, 210.592738 GFLOPS
```

### Different SIMD Width

The code above uses a SIMD width of 64, which is the maximum width of the `Simd` type. I also tried to use a smaller width and see the performance (naive version is not included here):

`SIMD_WIDTH = 32`:

```text
Loop interchange: 0.079853 s, 26.892800 GFLOPS
Iterator: 0.078234 s, 27.449339 GFLOPS
SIMD width: 32
SIMD: 0.077860 s, 27.581333 GFLOPS
Rayon threads: 12
Parallelized autovectorize: 0.010616 s, 202.278883 GFLOPS
Parallelized: 0.010308 s, 208.336126 GFLOPS
```

`SIMD_WIDTH = 16`:

```text
Loop interchange: 0.080088 s, 26.814055 GFLOPS
Iterator: 0.078866 s, 27.229599 GFLOPS
SIMD width: 16
SIMD: 0.078391 s, 27.394493 GFLOPS
Rayon threads: 12
Parallelized autovectorize: 0.010272 s, 209.065782 GFLOPS
Parallelized: 0.010365 s, 207.185590 GFLOPS
```

`SIMD_WIDTH = 8`:

```text
Loop interchange: 0.080284 s, 26.748536 GFLOPS
Iterator: 0.080402 s, 26.709300 GFLOPS
SIMD width: 8
SIMD: 0.079524 s, 27.004323 GFLOPS
Rayon threads: 12
Parallelized autovectorize: 0.010328 s, 207.934910 GFLOPS
Parallelized: 0.011438 s, 187.753126 GFLOPS
```

The performance gap is not that large.

Again, this is no serious benchmark and I just want to roughly compare the performance of different SIMD widths. The performance can be influenced by many factors.

## Summary

It is quite interesting to write SIMD code in Rust. The portable SIMD exposes some *"safe"* (at least it no longer requires `unsafe` block) interfaces to the programmers, and together with Rust's type system and borrow checker, it is comfotable to write the SIMD code. However, the compiler's auto-vectorization is still powerful and sometimes can outperform the manually crafted SIMD code. So I believe that although portable SIMD is really elegant and powerful, the auto-vectorization is enough under most circumstances.

---

The code of this post can be found on [GitHub](https://github.com/JuniMay/playing-rust-simd) which also includes the matmul example of Mojo for comparison. If you have any questions or suggestions, please [e-mail me](mailto:junimayerst@gmail.com). Thanks for reading!
