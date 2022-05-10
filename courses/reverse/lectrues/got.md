# Global Offset Table

> https://maskray.me/blog/2021-08-29-all-about-global-offset-table

GOT 全局偏移表。这是 linker 为 外部符号填充的实际偏移表。而PLT（Procedure Linkage Table）程序链接表，要么在 .got.plt节获取地址并跳转，要么无法从.got.plt获取地址时，触发 linker 寻找所需地址。

All about Global Offset Table
Symbol address
In an executable or shared object (called a component in ELF), a text section may need the absolute virtual address of a symbol (e.g. a function or a variable). The reference arises from an address taken operation or a PLT entry. The address may be:

a link-time constant
the load base plus a link-time constant
dependent on runtime computation by ld.so
Link-time constant
For the first case, this component must be a position-dependent executable: a link-time address equals its virtual address at run-time. The text section can hold the absolute virtual address directly or use a PC-relative addressing.

1
2
3
4
5
6
# i386
movl    var, %eax         # R_386_32

# riscv64
lui     a0, %hi(var)      # R_RISCV_HI20
lw      a0, %lo(var)(a0)  # R_RISCV_LO12_I
(For a FDPIC ABI for MMU-less Linux, the compiler may add an offset to the FDPIC register instead.)

Load base plus constant
For the second case, this component is either a position-independent executable or a shared object. The difference between the link-time addresses of two symbols equals their virtual address difference at run-time. The first byte of the program image, the ELF header, is loaded at the load base. The text section can get the current program counter, then add the distance from PC to the symbol (PC-relative address), to compute the run-time virtual address.

1
2
3
4
5
6
# x86_64
movl    var(%rip), %eax      # R_X86_64_PC32

# aarch64
adrp    x8, var              # R_AARCH64_ADR_PREL_PG_HI21
ldr     w0, [x8, :lo12:var]  # R_AARCH64_LDST32_ABS_LO12_NC
Runtime computation by ld.so
For the third case, we need help from the runtime loader (abbreviated as ld.so). The linker emits a dynamic relocation to let the runtime loader perform a symbol lookup to determine the associated symbol value at runtime.

The symbol is either potentially defined in another component or is a STT_GNU_IFUNC symbol. See GNU indirect function for STT_GNU_IFUNC.

If the text section holds the address which is relocated by the dynamic relocation, this is called text relocations.

More commonly, the address is stored in the Global Offset Table (abbreviated as GOT). The compiler emits code which uses position-independent addressing to extract the absolute virtual address from GOT. The relocations (e.g. R_AARCH64_ADR_GOT_PAGE, R_X86_64_REX_GOTPCRELX) are called GOT-generating. The linker will create entries in the Global Offset Table.

1
2
3
4
5
6
7
8
9
10
# aarch64
adrp    x8, :got:var              # R_AARCH64_ADR_GOT_PAGE
ldr     x8, [x8, :got_lo12:var]   # R_AARCH64_LD64_GOT_LO12_NC
ldr     w0, [x8]

# x86_64
# var@GOTPCREL = &got(var) - rip
# var@GOTPCREL(%rip): load the GOT entry
movq    var@GOTPCREL(%rip), %rax  # R_X86_64_REX_GOTPCRELX
movl    (%rax), %eax
Global Offset Table
The Global Offset Table (usually consists of .got and .got.plt) holds the symbol addresses which are referenced by text sections. The table holds link-time constant entries and entries which are relocated by a dynamic relocation.

.got.plt holds symbol addresses used by PLT entries. .got holds everything else.

Why do we need a GOT entry for a link-time constant? Well, at compile time it is probably undecided whether the entry may resolve to another component. The compiler may emit a GOT-generating relocation and use an indirection in a conservative manner. At link time the linker may find that the value is a constant.

Life of a .got.plt entry
TODO: link to my future article about PLT.

Life of a .got entry
Compiler behavior
Defined symbols
Defined symbols generally belong to the first and second cases. However, on ELF, a non-local default visibility symbol in a shared object is preemptible by default. For -fpic code, the third case is used: since such a definition may be interposed by another definition at runtime, the compiler conservatively uses GOT indirection.

1
2
int var;
int foo() { return var; }
1
2
3
4
5
6
# -fno-pic or -fpie
movl    var(%rip), %eax  # R_X86_64_PC32

# -fpic
movq    var@GOTPCREL(%rip), %rax  # R_X86_64_REX_GOTPCRELX
movl    (%rax), %eax
Using the C/C++ internal linkage (static, unnamed namespace) or protected/hidden visibility can avoid the indirection for -fpic.

See Copy relocations, canonical PLT entries and protected visibility for why GCC protected data uses (unneeded) indirection.

Undefined symbols
If the symbol has the default visibility, the definition may be in a different component. For position independent code (-fpie and -fpic), the compiler uses GOT indirection conservatively.

1
2
extern int ext_var;
int foo() { return ext_var; }
1
2
movq    ext_var@GOTPCREL(%rip), %rax
movl    (%rax), %eax
For position dependent code (-fno-pic), traditionally the compiler optimizes for statically linked executables and uses direct addressing (usually absolute relocations). How does it work if the symbol is actually defined in a shared object? To avoid text relocations, there are copy relocations and canonical PLT entries. It essentially changes the third case (symbol lookup) to the first two cases. See Copy relocations, canonical PLT entries and protected visibility for details.

If the symbol has a non-default visibility, the definition must be defined in the component. The compiler can safely assume the address is either a link-time constant or the load base plus a constant.

1
2
3
__attribute__((visibility("hidden")))
extern int ext_hidden_var;
int foo() { return ext_hidden_var; }
1
movl    ext_hidden_var(%rip), %eax
Linker behavior
A GOT-generating relocation references a symbol. When the linker sees such a referenced symbol for the first time, it reserves an entry in GOT. For subsequent GOT-generating relocations referencing the same symbol, the linker just reuses this entry. The address of the GOT entry is insignificant.

Technically the linker can use multiple entries for one symbol. It just wastes space for the majority of cases, but some awful ABIs do use multi-GOT, e.g. mips and ppc32.

The entry needs a dynamic relocation or is a link-time constant.

1
2
3
4
5
6
if (preemptible)
  emit an R_*_GLOB_DAT  // the third case
else if (!pic || is_shn_abs)
  link-time constant  // the first case
else
  emit a relative relocation  // the second case
ld.so behavior
An R_*_GLOB_DAT relocation is identical to an absolute relocation of the word size (e.g. R_AARCH64_ABS64, R_X86_64_64). ld.so performs a symbol lookup and fills the location with the virtual address.

GOT optimization
GOT indirection to PC-relative
When the symbol associated to a GOT entry is non-preemptible, the third case effectively becomes the first or the second case. The code sequence nevertheless has a load from the GOT entry. Why don't we optimize the code sequence?

Some psABI (Processor Specific Application Binary Interface) documents do define such an optimization.

For example, x86-64's R_X86_64_REX_GOTPCRELX optimization does the following transformation:

1
2
3
4
5
6
7
# input
movq    var@GOTPCREL(%rip), %rax  # R_X86_64_REX_GOTPCRELX
movl    (%rax), %eax

# output
leaq    var(%rip), %rax
movl    (%rax), %eax
PowerPC64 ELFv2's TOC-indirect to TOC-relative optimization:

1
2
3
4
5
6
7
8
9
10
11
12
# input
addis 3, 2, .LC0@toc@ha  # R_PPC64_TOC16_HA
ld    3, .LC0@toc@l(3)   # R_PPC64_TOC16_LO_DS, load the address from a .toc entry
ld/lwa 3, 0(3)           # load the value from the address

.section .toc,"aw",@progbits
.LC0: .tc var[TC],var

# output
addis 3,2,var@toc@ha     # this may be relaxed to a nop,
addi  3,3,var@toc@l      # then this becomes addi 3,2,var@toc
ld/lwa 3, 0(3)           # load the value from the address
We have a pair of R_PPC64_TOC16_HA and R_PPC64_TOC16_LO_DS relocations. Instruction rewriting is safe because the relocation types provide a strong guarantee: interleaved instructions cannot use intermediate values of the modified register.

On Mach-O, ld64's arm64 port defines some GOT optimization as well.

1
2
3
4
5
6
7
8
9
10
11
.globl _main
.p2align 2
_main:
Lloh0:
  adrp x8, _C@GOTPAGE
Lloh1:
  ldr x8, [x8, _C@GOTPAGEOFF]
Lloh2:
  ldr w0, [x8]

  .loh AdrpLdrGotLdr Lloh0, Lloh1, Lloh2
For a regular adrp+ldr+ldr code sequence loading the value of a variable through GOT indirection, either the first two instructions (adrp+ldr) can be optimized (computing the GOT address by PC-relative), or the three instructions can be optimized as a whole (load the variable directly via LDR (literal)).

LC_LINKER_OPTIMIZATION_HINT may be related to the fact that Mach-O supports only 16 relocation types. The relocation types cannot encode more information. On ELF, there are plethora of relocation types and a separate section would not be needed.

Combining .got and .got.plt
The x86-64 psABI defines another optimization: if a symbol needs both a .got entry (R_X86_64_GLOB_DAT; address taking) and a .got.plt entry (R_X86_64_JUMP_SLOT), the two entries can be combined into one.

R_X86_64_GLOB_DAT, like R_X86_64_64, is always eagerly resolved by ld.so. For eager binding PLT, an R_X86_64_JUMP_SLOT is identical to an R_X86_64_GLOB_DAT. The existence of R_X86_64_GLOB_DAT means an eager symbol lookup exists, regardless of what we do with R_X86_64_JUMP_SLOT. Therefore, the two entries can be combined and one single R_X86_64_GLOB_DAT used.

In GNU ld, the new entry is added to .plt.got, a section similar to .got. Yes, the section has a weird name. Technically the original .got section can be reused for the purpose, but GNU ld just somehow uses .plt.got.

ld.lld does not implement this optimization: https://bugs.llvm.org/show_bug.cgi?id=32938. I think the optimization has low value but high linker complexity.

DT_MIPS_LOCAL_GOTNO and DT_MIPS_SYMTABNO-DT_MIPS_GOTSYM
As stated previously, some GOT entries are for non-preemptible symbols. For -pie and -shared links, they need relative relocations. Recording R_MIPS_RELATIVE relocations is bit expensive, so mips optimizes them out by reordering GOT entries to the start. The linker emits DT_MIPS_LOCAL_GOTNO the linker applies relative relocation operations on the first DT_MIPS_LOCAL_GOTNO GOT entries.

A regular REL format relocation costs 2 words. mips does micro optimization here again by using just one word for DT_MIPS_SYMTABNO-DT_MIPS_GOTSYM GOT entries which are otherwise relocated by R_MIPS_JUMP_SLOT.

Optimizing the Performance of Dynamically-Linked Programs mentions that IRIX implemented a further optimization called Quickstart. If shared libraries used at the run-time are the same as thosed used at link time and all libraries are mapped into the preassigned locations (like System V release 3 static shared libraries), symbol lookup can be skipped. Other systems do not seem to implement Quickstart. Such prelink schemes appear to be a bad idea with the focus on security, e.g. Address Space Layout Randomization (2003).

Hey, this seems clever, isn't it? No, it's awful.

There is a more useful technique which can speed up symbol lookup: DT_GNU_HASH. Both mips and DT_GNU_HASH sort the dynamic symbol table, but in a different way, so DT_GNU_HASH is incompatible on mips. To overcome this shortcoming, some folks added DT_MIPS_XHASH support to binutils and glibc. Their scheme adds another table to the GNU hash table, giving back some space they saved.

Sorry to be blunt, but let me add more arguments why mips was shortsighted. Relative relocations have a much better size saving technique: DT_RELR. If an R_X86_64_REX_GOTPCRELX like GOT optimization technique is used, many non-preemptible GOT entries will not be needed at all.

If someone tries to add DT_MIPS_XHASH support to LLVM, I'd definitely be sad.

To future architectures, GOT optimization is somewhat useful. When designing relocation types, make sure GOT optimization can be retroactively added.

The aarch64 ABI is trying to add GOT optimization. Adding new relocation types require bleeding edge toolchain support, while overloading old GOT-generating relocations needs to be careful with the semantics. Instruction rewriting can easily break the program if not careful.

More about the linker-loader protocol
_GLOBAL_OFFSET_TABLE_
GNU ld defines the symbol relative to the Global Offset Table.

The aarch64, arm, mips, ppc, and riscv ports define the symbol at the start of .got.
The x86 port defines the symbol at the start of .got.plt.
Code can use the symbol to access GOT entries.

IMO only ancient (badly designed) architectures reference _GLOBAL_OFFSET_TABLE_ directly. Modern architectures use operand modifiers.

1
2
3
4
5
6
7
8
9
10
11
# i386
call    __x86.get_pc_thunk.ax
addl    $_GLOBAL_OFFSET_TABLE_, %eax  # eax = &.got.plt
movl    var@GOT(%eax), %eax           # var@GOT = &got(var) - &.got.plt
movl    (%eax), %eax                  # load the GOT entry

# sparc64
sethi   %hi(_GLOBAL_OFFSET_TABLE_-4), %l7
call    __sparc_get_pc_thunk.l7
add    %l7, %lo(_GLOBAL_OFFSET_TABLE_+4), %l7
ldx     [%l7+var], %g1
With GOT optimization, a GOT entry can be suppressed. If _GLOBAL_OFFSET_TABLE_ is referenced directly, the linker needs to define it even if it is otherwise unused.

_GLOBAL_OFFSET_TABLE_[0]
SunOS 4.x introduced dynamic shared library support. It stored the link-time address of __DYNAMIC at __GLOBAL_OFFSET_TABLE_[0].

In 1993, Paul Kranenburg (pk) added shared library support to NetBSD flavored a.out binary format. NetBSD followed the _DYNAMIC at _GLOBAL_OFFSET_TABLE_[0] scheme. Some ports used two underscores.

In the same year, FreeBSD ported the NetBSD ld and rtld code.

In 1995, Roland McGrath added shared library support to glibc. glibc followed the _DYNAMIC (one dash instead of two) at _GLOBAL_OFFSET_TABLE_[0] scheme. glibc ported this hack (to find the load address of the loader) to more architectures. See Build glibc with LLD 13 for details.

.got.plt[1...2]
TODO: link to my future article about PLT.

DT_PLTGOT is defined as the address of .got.plt.

The linker reserves the first 3 entries of .got.plt. .plt usually starts with a header which calls .got.plt[2] with an argument .got.plt[1] and other arch-specific arguments.

ld.so puts a descriptor into .got.plt[1] and the address of the lazy PLT resolver into .got.plt[2]. The lazy PLT resolver identifies the caller object with the descriptor and uses other arguments to figure out the to-be-called function.

PT_GNU_RELRO
.got and .got.plt have the SHF_WRITE flag. Traditionally they are always writable, which is considered bad from the security perspective. GNU invented the PT_GNU_RELRO program header.

The idea is that .got only contains relocations which should be eagerly resolved. With -z relro, the linker places .got into PT_GNU_RELRO. At runtime, after ld.so resolved relocations for an object, it calls mprotect(relro_start, relro_size, PROT_READ) to mark the .got region read-only. This is sometimes called "partial RELRO".

(I reported https://sourceware.org/bugzilla/show_bug.cgi?id=24769 that GNU ld's riscv port doesn't implement partial RELRO correctly.)

With -z relro -z now, the linker additionally places .got.plt into PT_GNU_RELRO. At runtime, ld.so resolves .got.plt relocations eagerly and then calls mprotect. This scheme disables lazy binding PLT. It is sometimes called "full RELRO". When the program has many R_*_JUMP_SLOT relocations, there may be significant startup slowdown.

In 2006, c0ntex introduced GOT hijacking attack in How to hijack the Global Offset Table with pointers for root shells.

Non-address GOT entries
GOT has some reserved entries at the start of .got and .got.plt. Most remaining entries are symbol addresses. The rest are tls_index objects (module ID and offset from dtv[m] to the symbol for general-dynamic/local-dynamic TLS models), TLS descriptors, and TP offsets.

PowerPC64 ELFv2 TOC
TODO: Move this to a future PowerPC64 article.

Somehow PowerPC64 ELFv2 decided to reinvent GOT. They call it TOC (table of contents).

1
2
3
extern int var0;
extern int var1;
int foo() { return var0 + var1; }
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
  addis 3, 2, .LC0@toc@ha
  addis 4, 2, .LC1@toc@ha
  ld 3, .LC0@toc@l(3)
  ld 4, .LC1@toc@l(4)
  lwz 3, 0(3)
  lwz 4, 0(4)
  add 3, 4, 3
  extsw 3, 3
  blr

.section .toc,"aw",@progbits
.LC0:
  .tc var0[TC],var0
.LC1:
  .tc var1[TC],var1
While with .got .o files do not reference .got directly, the TOC scheme makes .toc explicit in .o files. Therefore the TOC layout is under control of the compiler and presumably the compiler can leverage better information to optimize the layout for locality. Well, I disagree with this point. The compiler does not know the global information. A linker is better placed to do such link-time optimization.

Let's look at a jump table example.

1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
void puts(const char *);
struct A {
  void foo(int a) {
    switch (a) {
    case 0: puts("0"); break;
    case 1: puts("1"); puts("1"); break;
    case 2: puts("2"); break;
    case 3: puts("3"); puts("4"); break;
    case 4: puts("4"); break;
    case 5: puts("5"); puts("5"); break;
    case 6: puts("6"); break;
    }
  }
  int a;
};
void foo(A x) { x.foo(x.a); }
If A::foo is not optimized out, Clang emits:

1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
.section .text._ZN1A3fooEi,"axG",@progbits,_ZN1A3fooEi,comdat
  ...
  addis 4, 2, .LC0@toc@ha
  ld 4, .LC0@toc@l(4)
  ...
.LBB1_2:
  ...
.LBB1_3:
  ...

.section .rodata._ZN1A3fooEi,"aG",@progbits,_ZN1A3fooEi,comdat
.p2align 2
.LJTI1_0:
  .long   .LBB1_2-.LJTI1_0
  .long   .LBB1_3-.LJTI1_0
  ...

.section .toc,"aw",@progbits
.LC0:
  .tc .LJTI0_0[TC],.LJTI0_0
An .toc entry (not in a group) incorrectly references .rodata._ZN1A3fooEi in a COMDAT group. This violates an ELF specification rule when .rodata._ZN1A3fooEi is non-prevailing and therefore discarded:

A symbol table entry with STB_LOCAL binding that is defined relative to one of a group's sections, and that is contained in a symbol table section that is not part of the group, must be discarded if the group members are discarded. References to this symbol table entry from outside the group are not allowed.

Unfortunately this is difficult to fix. We cannot place .toc in the group. If we do, loading the address of a weak/global symbol in a COMDAT will break similarly.

1
2
3
4
5
6
7
8
9
10
.text
  addis 3,2,.LC0@toc@ha

.section .data.rel.ro.foo,"aGw",foo,comdat
.globl foo
foo:

.section .toc,"aGw",@progbits,foo,comdat  # if we use a COMDAT group
.LC0:
  .tc foo[TC],foo
GNU ld works around the issue by garbage collecting .toc entries. Reliance on garbage collection for correctness is a bad design. For ld.lld, I simply let ld.lld to ignore a .toc relocation referencing a discarded symbol. D63182

Well, the above can be fixed by changing .LC0 to a hidden/internal visibility STB_GLOBAL symbol, but we will get a useless symbol in .symtab. So PowerPC64 ELFv2's .toc is prettier than ppc32 .got2, but that is the pot calling the kettle black.

Text relocations
In "Runtime computation", I mentioned that GOT is not the only approach allowing addresses dependent on runtime computation. The text relocation technique is another. The name is derived from the fact that dynamic relocations apply to text sections.

Traditionally code and read-only data is placed in the same segment, which is called the text segment. The linker uses the criterion !(sh_flags & SHF_WRITE) to check whether a dynamic relocation is a text relocation. When the output needs text relocations, the linker adds a flag DF_TEXTREL.

Linker/loader developers often frowned upon text relocations. In https://lore.kernel.org/lkml/CAFP8O3LZ3ZtpkF=RdyDyyXn40oYeDkqgY6NX7YRsBWeVnmPv1A@mail.gmail.com/, I collected some evidence.

Runtime pseudo relocations
On x86, the MinGW runtime supports runtime pseudo relocations, which are conceptually the same as text relocations.

Misc
Myth: Position-dependent code doesn't use GOT.

Not true. To avoid copy relocations and canonical PLT entries, GOT indirection can be used. See -fno-direct-access-external-data in the copy relocations article. That said, the option is not common yet.

There is a way to convert a symbol lookup (the third case in the very beginning) to the first two cases.

Position-dependent code typically uses direct access relocations to reference a symbol. If the symbol is not defined by the executable,

Appendix
On Windows, an undefined symbol is by default similar to a protected visibility symbol on ELF. Direct access is used.

1
2
3
// Like __attribute__((visibility("protected"))) on ELF.
extern int ext_var;
int foo() { return ext_var; }
1
movl    var(%rip), %eax
__declspec(dllimport) enables __imp_$name which is like an unconditional GOT entry.

1
2
__declspec(dllimport) extern int ext_var;
int foo() { return ext_var; }
1
2
3
# x86_64
movq    __imp_ext_var(%rip), %rax
movl    (%rax), %eax
To avoid explicit __declspec(dllimport), MinGW invented .rdata$.refptr.var. This is like an enabled-by-default clang -fno-direct-access-external-data. var can be defined in the same linked image or another DLL.

1
2
3
4
5
6
7
8
  movq    .refptr.var(%rip), %rax
  movl    (%rax), %eax

# IMAGE_SCN_LNK_COMDAT with selection kind IMAGE_COMDAT_SELECT_ANY
.section        .rdata$.refptr.var,"dr",discard,.refptr.var
.globl .refptr.var
.refptr.var:
  .quad var