---
title: "On Some Design Details of RISC-V Vector Extension"
date: "2024-10-15"
tags:
    - RISC-V
    - SIMD
    - Vector Processor
---

This post is about several strange design decisions in RISC-V Vector Extension
(RVV) that I've found during my study. And I'm trying to understand the
rationale behind those decisions.

## Fractional LMUL

The first thought that came to my mind when I saw the fractional LMUL was "Why
do we need fractional LMUL when the vector length is configurable?" But after
some research on the ISA, I found that the fractional LMUL is actually a
brilliant idea to reduce the register pressure in some cases.

To my understanding, the fractional LMUL is mainly designed for widening and
narrowing operations. The source and destination vector operands might have
different *effective* element width (EEW) and *effective* LMUL (EMUL) while
`EEW/EMUL` is kept equal to `SEW/LMUL` (so that the result VLMAX will not be
affected) Also, there are mixed-width instructions like `vwsubu.wv` whose
operands have different EEWs and LMULs. If only `LMUL>=1` is allowed, these
instructions will require more vector registers in order to satisfy the VLMAX
constraint. With fractional LMUL, the number of required vector registers can be
reduced.

## RVV's Mask Register Layout

The mask register layout is the most confusing part of RVV to me. Current spec
uses `v0` as **THE** mask register, and only use the lowest part of `v0` in a
bit granularity as mask. This is very different from SVE, which uses a separate
mask register file, and SSE/AVX2, which place the mask in the corresponding lane
of the vector register.

I skimmed through previous discussion on the mask design, and found that there
was an alternative approach for the mask register layout. The alternative
approach defines MLEN as the mask element width, with `MLEN=SEW/LMUL`, so that
the mask elements can always be packed into a single vector register
(`VLMAX=VLEN*LMUL/SEW=VLEN/MLEN`). And as long as the `SEW/LMUL` ratio is not
changed, the mask mapping will remain the same. But if the ratio is changed, the
mask will no longer match the vector elements, additional compress/gather
instructions will be needed to convert the mask.

And it is worth mentioning that when `SEW=8` and `LMUL=8`, all bits in `v0` will
be used as mask, both in the current spec and the alternative approach. So when
it comes to the hardware design, the two approaches might not have significant
difference in terms of additional ports from the mask register. So what if we
use the same configuration for the mask register as the vector groups? Well,
then there will be a obvious problem for widening/narrowing instructions, even
if the ratio is kept the same.

Then how about using a separate mask register file? I do believe that is a good
idea to separate the masks from the vector registers, but that also means the
mask registers can hardly be used as vector registers, which might lead to a
waste of hardware resources. And when it comes to tasks like bit vector
manipulations, the current mask layout might be more efficient.

Additionally, there is
[a wiki page](https://github.com/riscv/riscv-v-spec/wiki/Features-deferred-to-V---64-bit-instruction-encoding)
in the RISC-V Vector GitHub repo that lists the features *deferred* to future 64
bit instruction encoding. If the mask register can be any vector register, and
more vector registers are added, the current mask layout might be more
reasonable.

## Conclusion

Fractional LMUL is a brilliant idea to reduce the register pressure in some
circumstances. And the mask register layout in RVV is a trade-off between
hardware efficiency and software friendliness. However, the current spec of RVV
seems to be a *compressed* version of a full-featured vector extension, and some
design decisions are very likely for backward compatibility.

---

## References

- [A simple Ordinal based mask encoding](https://github.com/riscv/riscv-v-spec/issues/435)
- [A Simple Ordinal Based Mask Encoding V1a](https://github.com/riscv/riscv-v-spec/issues/448)
- [MLEN=1 update](https://github.com/riscv/riscv-v-spec/commit/9a77e128b5e96ca984ad50b7cd9330c841321efb)
