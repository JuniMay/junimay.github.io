---
title: "A Glance at RISC-V Vector Extension"
date: "2024-09-05"
tags:
    - RISC-V
    - SIMD
    - Vector Processor
---

I've been exploring the basics of RISC-V Vector Extension (RVV) recently. My
main focus is understanding its core concepts and comparing it with other SIMD
architectures, especially in terms of compiler support. To that end, I've also
studied some basics of SVE for comparison.

During my study, I found RVV to be a highly flexible architecture that differs
significantly from NEON, AVX, SVE or other SIMD architectures. Additionally, the
compiler support for RVV is still in its early stages, which presents both
challenges and opportunities.

## Basics of RVV

Just like other ISA extensions of RISC-V, RVV is powerful but yet simple. The
current specification on the extension spans only 111 pages, making it fast to
go through the basics. Here are some key concepts and features of RVV.

### "Scalable" or "Dynamic" Vector

RVV might be regarded similar to SVE in ARM, as they both support scalable
vectors. However, RVV is more flexible than SVE.

The word "scalable" means that the vector length is not designated by the ISA
specification, but rather by the implementation. SVE allows the vector length to
be between 128 and 2048 bits, as long as it is a multiple of 128 bits. By doing
so, the hardware implementation, the ISA and the software can be decoupled. The
hardware vendor can choose a suitable vector length for the target application,
without worrying about the toolchain or the compatibliity with the existing
software.

In the sense of vendor-defined vector length, RVV is similar to SVE and can be
called as "scalable". However, RVV provides a more flexible configuration
interface for the vector length. The vector length of RVV can be configured by
the software at runtime, which is not supported by SVE. Because of that, RVV is
sometimes regarded as "dynamic"-length vector [^1].

### Basic Concepts of RVV

The flexbility of RVV introduces some new concepts, instructions and constants,
which actually made me confused at the beginning. Some of the basic concepts
are:

- `VLEN`: The implementation-defined size of vector registers.
- `ELEN`: The maximum element size supported by the implementation.
- Vector Register Grouping: Several vector registers can be grouped together to
  form a larger vector register, which enables an instruction to operate more
  elements at the same time.
- `LMUL`: The number of vector registers in a group. This multiplier can also
  be fractional. According to the specification, for non-frational `LMUL`, the
  implementation must support `LMUL` of 1, 2, 4, 8, and for fractional `LMUL`,
  the requirements is dependent on the minimum element size.
- `SEW`: The element size to be operated on.
- `VLMAX`: The maximum number of elements in a register group, given the current
  `LMUL` and `SEW`.
- `AVL`: Application Vector Length, which is the number of elements that the
  software wants to operate on.

There is also a CSR called `vl` that records the current vector length. After
reading some examples utilizing RVV, I found that there are actually two core
aspects that enable the flexibility of RVV:

1. `AVL` does not necessarily equal to `VLMAX`.
2. The vector length stored in `vl` does not necessarily equal to `AVL`.

This seems awkward at the beginning. To understand this, two questions need to
be answered:

1. How should the programmer (or the compiler) determine the `AVL`?
2. How is the vector length determined and why is it different from `AVL`?

As we have mentioned, `AVL` is the number of elements that the software
**WANTS** to operate on. So the most straightforward way is just using the
element count as the `AVL`.

Then it comes to the second question. How can the software pass the requirement
of vector length to the hardware? The `vset{i}vl{i}` instructions can be used to
set the vector length[^2]:

```asm
vsetvli rd, rs1, SEW, LMUL, ..
```

Where `rs1` is the source register that contains the `AVL`, `SEW` is the element
size, `LMUL` is the number of vector registers in a group. The hardware can
calculate `VLMAX` given the `SEW` and `LMUL`, and then compare it with the `AVL`
to determine the actual vector length:

- `vl = AVL` if `AVL <= VLMAX`
- `ceil(AVL / 2) <= vl <= VLMAX` if `AVL < (2 * VLMAX)`
- `vl = VLMAX` if `AVL > (2 * VLMAX)`

So now let's get back to the flexibility of RVV. We get a `vl` by telling the
hardware how much elements we want to process. And what's next? The `vl` may not
be what we want, so how do we proceed with the computation? Usually, when it
comes to vectorization, we use a mask to indicate the active elements in the
vector register. But in RVV, the mask is not necessary. Instead, we use the `vl`
to indicate the active elements, and more importantly, the steps of the loops.
Assume that we have `n` elements to process, here is a pseudo code for the
vectorized loop:

```plain
loop:
    vl = vsetvl n
    vector load
    ...
    vector computation
    ...
    vector store
    n = n - vl
    if n > 0 goto loop
exit:
    ...
```

This method is known as *stripmining*. It leverages RVV's dynamic vector length
(instead of a more general mask) to control the looping steps.

## A Compiler Perspective

There are already scalable vector support in LLVM with `vscale` and in MLIR with
types like `vector<[4] x i32>`. However, the scalable vectors are merely
compatible features -- they don't fully exploit RVV's dynamism.

The difficulty arises from the fact that there is an implicit state when vector
operations are performed. CSRs need to be accessed to determine how an
instruction executes. The C intrinsics of RVV requires the programmer to pass
`vl` as an explicit argument, and let the compiler to reduce the number of
`vset{i}vl{i}` instructions. Of course, current compilers like clang can do an excellent job
optimizing the manually crafted code, but it is still difficult to model the
runtime length of vectors in a general way, which makes it harder for high-level
optimizations.

There are some proposed or experimental methods in LLVM and MLIR to add support
for RVV.

- VP Intrinsics in LLVM: There is a set of
  [Vector Predication Intrinsics](https://llvm.org/docs/LangRef.html#vector-predication-intrinsics)
  in LLVM, together with
  [an experimental `get_vector_length` intrinsic](https://llvm.org/docs/LangRef.html#llvm-experimental-get-vector-length-intrinsic),
  which might be capable to model the dynamic vector length in RVV.
- An RVV dialect in MLIR: There is an implementation of RVV dialect in the
  [Buddy Compiler](https://github.com/buddy-compiler/buddy-mlir)
- Vector Predication in MLIR: A high-level modeling of vector predication in
  MLIR, also implemented in the Buddy Compiler, but inside the `vector_exp`
  dialect.
- Adding a new dynamic vector type `vector<?xi32>` in MLIR [^1]：This is also
  implemented in `vector_exp` dialect in the Buddy Compiler.

To me, the most elegant solution would be to introduce a new dynamic vector type
in MLIR, together with the `set_vl` operations which encloses all dynamic vector
operations inside its region [^3]:

```plain
func.func @vector_add(%in1: memref<?xi32>, %in2: memref<?xi32>, %out: memref<?xi32>) {
  %c0 = arith.constant 0 : index  
  %dim_size = memref.dim %in1, %c0 : memref<?xi32>
  vector.set_vl %dim_size : index {
    %vec_input1 = vector.load %in1[%c0] : memref<?xi32>, vector<?xi32>
    %vec_input2 = vector.load %in2[%c0] : memref<?xi32>, vector<?xi32>
    %vec_output = arith.addi %vec_input1, %vec_input2 : vector<?xi32>
    vector.store %vec_output %out[%c0] : memref<?xi32>, vector<?xi32>
 }
}
```

But this is currently just a proposal and is not upstreamed yet.

## Conclusion

RVV is really a flexible and powerful SIMD architecture. The dynamic vector
length and the strip mining method distinguish it from other SIMD architectures.
However, the compiler support for RVV is still maturing, and many challenges
remain. I hope that the compiler support for RVV can be improved in the future,
and I am looking forward to seeing further advancement in its application.

[^1]: See the discussion on the LLVM discourse: [\[RFC\] Dynamic Vector
Semantics for the MLIR Vector
Dialect](https://discourse.llvm.org/t/rfc-dynamic-vector-semantics-for-the-mlir-vector-dialect/75704/4)

[^2]: `vset{i}vl{i}` instruction also updates the `vtype`, and there are some
special cases when the operand of `vset{i}vl{i}` is `x0`. These details can be
found in the specification.

[^3]: This code snippet is from the discussion of the dynamic vector semantics.
