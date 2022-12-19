# ARM 汇编语言

来源：https://developer.arm.com/documentation/den0013/d/Introduction-to-Assembly-Language


详细的ARM汇编语言可以参考 ARM Compiler Toolchain Assembler Reference or the ARM Architecture Reference Manual.

## ARM 汇编与其他汇编的区别

ARM 处理器是 RISC 处理器，不是 CISC，所以与 x86 富指令的处理器汇编语言不同。CISC 指令做复杂操作用一条指令时， RISC 指令可能需要多条才能完成。RISC 的通用目的指令数量更少，成本和功耗也较低。

ARM 核心有更多的通用目的寄存器，许多指令在单个cycle内完成，它有简单的寻址模式，其中所有的加载/存储地址都可以从寄存器内容和指令字段中确定。

ARM 不能直接对内存进行数据处理，为了增加一个内存数据的值，必须将它调入寄存器中，在寄存器中做加法，然后在写回内存中去。 指令集架构（ISA）包括将移位与算术或逻辑运算相结合的指令、用于优化程序循环的自动递增和自动递减寻址模式、实现高效堆栈和堆操作的加载和存储多条指令，以及几乎所有指令的块复制能力和条件执行。

象 x86 （但不像 68K），arm指令集典型的有2 或 3个操作数个数，第一个操作数通常指代目的操作数（放结果）。ARM 指令通常对寄存器作为操作数没有限制。

## ARM 指令集

ARMv7 是32位的处理器架构，word长为32，DW为64、HW为16。他也是一种load/store架构，即处理器指令进操作通用寄存器里的值。仅有 load 和store指令可以访问内存，即 `LDR` 和 `STR` 。

ARM 处理器中通常有两类指令集：
- ARM（32-bit 指令集）：original arm instruction set。
- Thumb：首次出现于ARM7TDMI 处理器，包含了16位指令，给更小程序以便利。目前，Cortex-A系列，支持 Thumb-2 技术，它扩展了Thumb，提供了16位与32位指令集混合使用。性能类似于arm，代码大小类似于thumb。


程序必须在编译时，明确指定编译为arm state 或 thumb state。thumb 代码默认为16位。
早期的arm 处理器，系统包含着编译为arm state 和 thumb state的代码。


在 CPSR寄存器的T位（D5），显示当前指令位 arm （T=0）或是 thumb（T=1）

The .W (32-bit) and .N (16-bit) width specifiers can be used to force a particular encoding (if such an encoding exists), for example:
```s

  BCS.W   label   ; forces 32-bit instruction even for a short branch

  B.N     label   ; faults if label out of range for 16-bit instruction
```

## 编译器

### GNU Assmebler

[the GNU Assembler Manual](http://sourceware.org/binutils/docs/as/index.html)。

或者在本地找gnutools/doc 或/gcc-doc，可以发现相关gnu assembler文档。

gnu tool通常会有一些前缀来表明其特性，例如： arm-none-eabi-gcc，是用于使用ARM EABI的裸金属系统。

- 汇编ARM汇编语言源代码的最简单方法如下：
```
arm-none-eabi-as -g -o filename.o filename.s
```
选项-g，要求汇编器包含debug信息，输出到输出文件。

得到二进制文件*.o之后，那么可以使用下列命令进行连接：
```
arm-none-eabi-ld -o filename.elf filename.o
```

复杂的汇编、连接过程可以定义make文件进行处理。

debugger 可以使用：
- arm-none-eabi-gdb 
- arm-none-eabi-insight

### GNU 汇编语法

GNU 汇编器可以导出不同类型处理器架构以及非arm标准的目标。它与arm toolchain 有语法不同。GNU assembler 对所有处理器架构使用了相同语法。

汇编语言每行一句，有不同部分组成：
`label:instruction @ comment`

说明：
- label：实际表示当前指令的地址，后续程序引用方便。
- instruction：指令可以是arm指令或汇编指令（伪指令）。伪指令包括控制sections、alignment、生成数据等等。
- 每行的 @ 符号可被认为是一个注视或忽略字符串，C风格的注释 /* */也可以使用

如果入口点（entry point）没有在源代码中明确指定，那么链接时要明确给出。

### sections
可执行代码至少要有一个section，默认为 .text
- 代码默认在 .text section
- 数据可以存放在 .data setction；
- 只读静态变量放在 .rodata
- 使用0初始化的数据可以放在 .bss
- The Block Started by Symbol (bss) segment defines the space for uninitialized static data.

### 汇编指令

汇编指令都以 . 开始。在GNU文档中有汇编指令的完整文档，下面是一个常用子集：
- `.align` 这个汇编指令会在.data section 里添加0值，或在 .text 里增加NOP指令，使得下一个位置正好处在一个字的边界（armv7默认为32）
- `.align n` 表示对齐 2^n 个位置（插入2^n 个0或nop）。

- `.ascii "string"` 在明确指定的目标文件中插入字符串，没有一个NUL字符将结束。


- `.asciiz` 与 `.ascii` 相似，但额外跟一个NUL字符（一个字节的0）

- `.byte expression`, `.hword expression`, `.word expression`
Inserts a byte, halfword, or word value into the object file. Multiple values can be specified using commas as separators. The synonyms .2byte and .4byte can also be used.

- `.data`
Causes the following statements to be placed in the data section of the final executable.

- `.end`
Marks the end of this source code file. The assembler does not process anything in the file after this point.

- `.equsymbol, expression`
Sets the value of symbol to expression. The "=" symbol and .set have the same effect.

- `.externsymbol`
Indicates that symbol is defined in another source code file.

- `.globalsymbol`
Tells the assembler that symbol is to be made globally visible to other source files and to the linker.

- `.include "filename"`
Inserts the contents of filename into the current source file and is typically used to include header files containing shared definitions.

- `.text`
This switches the destination of following statements into the text section of the final output object file. Assembly instructions must always be in the text section.

For reference, Table 4.1 shows common assembler directives alongside GNU and ARM tools. Not all directives are listed, and in some cases there is not a 100% correspondence between them.

Table 4.1. Comparison of syntax

|GNU Assembler	|armasm	|Description|
|-|-|-|
|@|;|Comment|
|#&	|#0x	|An immediate hex value|
|.if|	IFDEF, IF	|Conditional (not 100% equivalent)|
|.else|	ELSE|	|
|.elseif|	ELSEIF|	|
|.endif|	ENDIF|	|
|.ltorg	|LTORG	||
|\|	:OR:|	OR|
|&|	:AND:|	AND|
|<<	|:SHL:	|Shift Left|
|>>	|:SHR:	|Shift Right|
|.macro|	MACRO|	Start macro definition|
|.endm	|ENDM	|End macro definition|
|.include|	INCLUDE|	GNU Assembler requires "filename"|
|.word	|DCD|	A data word|
|.short	|DCW|	|
|.long	|DCD|	|
|.byte	|DCB|	|
|.req	|RN	||
|.global|	IMPORT, EXPORT|	|
|.equ	|EQU|	|


### 表达式

汇编指令和伪指令通常要求一个整数运算符。可以用一个可计算的表达式表示。典型的可以用十进制、0x十六进制、0b二机制或单引号引起来的字符。

数学或逻辑表达式也可以用来生成一个静态值。

### GNU 工具命名习惯
- 通用寄存器：R0～R15
- Stack pointer register: SP (R13).
- Frame pointer register: FP (R11).
- Link register: LR (R14).
- Program counter: PC (R15).
- Program Status Register flags: xPSR, xPSR_all, xPSR_f, xPSR_x, xPSR_ctl, xPSR_fs, xPSR_fx, xPSR_f, xPSR_cs, xPSR_cf, xPSR_cx (where x = C current or S saved). See Program Status Registers.

[Application Binary Interfaces](https://developer.arm.com/documentation/den0013/d/Application-Binary-Interfaces?lang=en) describes how all of the registers are assigned a role within the procedure call standard and how the GNU Assembler lets you refer to the registers using their Procedure Call Standard (PCS) names. See Table 15.1.

### armv8中增加的指令

With the introduction of the ARMv8-A architecture a number of changes have been made to the ARMv7 ISA to provide backward compatibility. The following instructions have been added to the ARMv7 ISA.

Instruction	Description
LDA	Load-Acquire Word
LDAB	Load-Acquire Byte
LDAEX	Load-Acquire Exclusive Word
LDAEXB	Load-Acquire Exclusive Byte
LDAEXD	Load-Acquire Exclusive Double
LDAEXH	Load-Acquire Exclusive Halfword
LDAH	Load-Acquire Halfword
STL	Store-Release Word
STLB	Store-Release Byte
STLEX	Store-Release Exclusive Word
STLEXB	Store-Release Exclusive Byte
STLEXD	Store-Release Exclusive Double
STLEXH	Store-Release Exclusive Halfword
STLH	Store-Release Halfword
### ARM/Thumb Unified Assembly Language Instructions


## References

- [Arm A-profile A32/T32 Instruction Set Architecture](https://developer.arm.com/documentation/ddi0597/2022-09/?lang=en)
- [Arm A64 Instruction Set Architecture](https://developer.arm.com/documentation/ddi0596/2021-12/?lang=en)
- https://developer.arm.com/documentation/den0013/d/Introduction-to-Assembly-Language
- [GNU Assembler Manual](http://sourceware.org/binutils/docs/as/index.html) 

[The interworking of arm state and thumb state ](https://developer.arm.com/documentation/den0013/d/Introduction-to-Assembly-Language/Interworking?lang=en)

测试用例显示示例：
第n步：XXX测试


