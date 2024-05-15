---
title: "Value Semantics & Ownership in Mojo"
date: "2024-05-10"
tags:
    - mojo
    - programming language
    - ownership
---

I am not a professional in the field of programming language design, but c++ and rust are two
languages that I am kind of familiar with. And I know that the ownership/borrow-checking in rust is
a very good compile-time mechanism to prevent some common bugs. So I am curious about how mojo
handles the ownership of values.

Below are some of my findings about the value semantics and ownership in mojo. Some are from the
official manual, and some are from my own experiments[^1].

[^1]: The mojo version is `mojo 24.3.0 (9882e19d)` in the experiments.

`def` & `fn` follows the *value semantics* (in the sense that the original value is not affected by the function call). The difference is that in `def`, the arguments are
implicitly copied to get the ownership (however, the compiler may optimize it), while in `fn`, the arguments are passed with immutable
references (by default).

According to the manual of mojo, the `owned` keyword means that the ownership of the passed value is
given to the function. Unless the `^` is used, the compiler will try to call `__copyinit__`.

But it seems that there is an *undefined behavior* (or maybe it's just an unstable compiler feature)
of any side-effect (I'm not sure if this terminology is precise here) operations in the
`__copyinit__` and `__moveinit__`. For example, given these three types and functions:

```mojo
struct Copyable:
    var a: Int

    fn __init__(inout self, a: Int):
        self.a = a

    fn __copyinit__(inout self, other: Self):
        print("copyinit of Copyable")
        self.a = other.a

struct Movable:
    var a: Int

    fn __init__(inout self, a: Int):
        self.a = a

    fn __moveinit__(inout self, owned other: Self):
        print("moveinit of Movable")
        self.a = other.a

struct CopyMovable:
    var a: Int

    fn __init__(inout self, a: Int):
        self.a = a

    fn __copyinit__(inout self, other: Self):
        print("copyinit of CopyMovable")
        self.a = other.a

    fn __moveinit__(inout self, owned other: Self):
        print("moveinit of CopyMovable")
        self.a = other.a

def try_to_copy(c: Copyable):
    print("c.a:", c.a)

def try_to_move(m: Movable):
    print("m.a:", m.a)

# not like overloading very much, lol
def try_to_copy(cm: CopyMovable):
    print("cm.a:", cm.a)
```

The main code below will **NOT** show the printed content of `__copyinit__` and `__moveinit__`:

```mojo
def main():
    c = Copyable(1)
    try_to_copy(c)

    m = Movable(2)
    try_to_move(m^)

    cm = CopyMovable(3)
    try_to_copy(cm)
```

But if you change the `main` function to:

```mojo
def main():
    c = Copyable(1)
    try_to_copy(c)
    print(c.a)

    m = Movable(2)
    try_to_move(m^)

    cm = CopyMovable(3)
    try_to_copy(cm)
    print(cm.a)
```

which uses the copied value after the function call, the printed content of `__copyinit__` and
`__moveinit__` will show up. It seems that the compiler optimized the code.

To validate this guess, I tried to pass `--no-optimization` argument to the compiler. But the result
turned out to be just the same.

Thus, I also tried to add assignment after the function call:

```mojo
def main():
    c = Copyable(1)
    try_to_copy(c)

    m = Movable(2)
    try_to_move(m^)

    cm = CopyMovable(3)
    try_to_copy(cm)

    cm0 = cm
    cm1 = cm^
```

The result is as below:

```text
c.a: 1
m.a: 2
copyinit of CopyMovable
cm.a: 3
copyinit of CopyMovable
moveinit of CopyMovable
```

THREE PRINTED LINES! So compiler optimization indeed affects the behavior of the code.

Not sure if this is a *UB* or not, haven't found any related information in the manual. But there is
a [note](https://docs.modular.com/mojo/manual/lifecycle/life#move-constructor) in the manual that
says:

> A move constructor is not required to transfer ownership of a value. Unlike in Rust, transferring
> ownership is not always a move operation; the move constructors are only part of the
> implementation for how Mojo transfers ownership of a value. You can learn more in the section
> about ownership transfer.

Maybe some more investigation is needed. Not sure how the argument passing is implemented in the
compiler.

Also, I noticed [this issue](https://github.com/modularml/mojo/issues/1529), and tried to reproduce
the problem, I change the main function as follows:

```mojo
def main():
    cm = CopyMovable(3)
    try_to_copy(cm)

    cm0 = cm
    cm1 = cm
```

The output is

```text
copyinit of CopyMovable
cm.a: 3
copyinit of CopyMovable
```

Emmm, seems there are two copies, one is for argument-passing, and the other is for the first
assignment. The third copy/move just gone.

Then, I tried to use the `cm1` after the last assignment:

```mojo
def main():
    cm = CopyMovable(3)
    try_to_copy(cm)

    cm0 = cm
    cm1 = cm

    print(cm1.a)
```

```text
copyinit of CopyMovable
cm.a: 3
copyinit of CopyMovable
moveinit of CopyMovable
3
```

Yep, now as expected, the `__moveinit__` is called.

In conclusion, the `__copyinit__` and `__moveinit__` have erratic behaviors and the mojo compiler
really does a lot of optimizations on this. So maybe one should not rely on these two functions to
do some operations that have side effects (again, not sure if this terminology is precise here).

From my personal perspective, I think the ownership model in mojo is great, but not as explicit as
the `&mut`, `&` and move/clone/copy in rust. However, if some infrastructures of this ownership
model can be improved, it might be easier to use.
