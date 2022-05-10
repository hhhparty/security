# Intro of Linux Assembly Language

## Assemblers 
我们主要使用的汇编工具：
- GNU Assembler，命令为`as`,它是gcc 包的一个部分。语法通常参考 AT&T syntax。
- NASM，它使用了 Intel 语法，与GNU的有所区别，例如：**两操作数指令 GNU 编译器将源操作数放在前面，而NASM将目的操作数放在前面。**
- 注意，相同功能的汇编指令，使用上面两种Assembler产生的输出是相同的机器码，这不同于编译器产生的输出是不可预测的。这是因为汇编指令仅是机器指令的助记符。

例如：要将AX寄存器内容存放到BX寄存器中

- GNU Assembler / AT&T Syntax
```S
mov %ax,%bx
```

- NASM / Intel Syntax
```S
mov bx,ax
```
上面两种经过汇编器汇编后，产生的机器码都是 `0x6689c3`

汇编器还有很多：
- Microsoft Assembler （MASM），源文件后缀名为 .asm 目标文件 obj 
- Turibo Assembler



## Assembler Cmd-Line Syntax

为了汇编 AT&T 语法的源程序,以x.s为例 (后缀名为 .s, 这是unix自定义的汇编语言文件后缀)，我们使用下列方法汇编它：
` as -a --gstabs -o x.o x.s`

说明：
- -o 指定目标文件，例如机器码文件，它是 Assembler 的主要输出。
- -a 告诉Assembler在屏幕上显示源代码、机器码和段偏移（segment offset），以便观察纠错。
- -gstabs 告诉 Assembler 提取x.o中的符号表， 即所有labels的地址列表。可用于调试器，在这个例子中主要是 gdb 或 ddd。

如果使用 Intel 语法，那么命令需要换为：
` nasm -f elf -o x.o -l x.l x.s`

说明：
- -f 选项告诉Assembler，设置 x.o 文件，以便后面根据它构建可ELF执行文件；
- -l 选项与as命令的-a命令类似，但将其输出到x.l中
- -o 选项表示目标文件确定

## 示例程序

下面是一个简单的数组求和程序：

首先是AT&T Syntax 版本：

```s
# AT&T Syntax Assemble Language Source Code
# sum of the elements of an array
.data       # start of data segment
x:  
    .long 1
    .long 5
    .long 2
    .long 18
sum:
    .long 0

.text       #start of code segment

.globl _start

_start:
    movl $4, %eax       #eax will serve as a counter for the number of words left to be summed.
    movl $0, %ebx       #ebx will store the sum
    movl $x, %ecx       #ecx will point to the current element to be summed.

top:
    addl (%ecx), %ebx
    addl $4, %ecx       #mov pointer to next element
    decl %eax           #decrement counter
    jnz top             #if cnt not 0,then loop again

done:
    movl %ebx, sum      #done, store result in "sum"

```


下面是Intel语法的版本：

```s
; Intel Syntax Assemble Language Source Code
; sum of the elements of an array
SECTION .data       ;start of data segment
global x
x:  
    dd 1
    dd 5
    dd 2
    dd 18
sum:
    dd 0

SECTION .text       ; start of code segment

    mov eax,4       ; eax will serve as a counter for the number of words left to be summed.
    mov ebx,0       ; ebx will store the sum
    mov ecx,x       ; ecx will point to the current element to be summed.

top:
    add ebx,[ecx]
    add ecx,4       ; mov pointer to next element
    dec eax           ; decrement counter
    jnz top             ; if cnt not 0,then loop again

done:
    movl [sum], ebx      ; done, store result in "sum"

```

## 16位/8位/字符串操作

## 链接到一个可执行文件中

根据上面的例子，我们可以使用 Linker `ld` 命令，将 .o 文件链接到可执行文件中。
`ld -o x x.o`



## References

- https://heather.cs.ucdavis.edu/~matloff/50/LinuxAssembly.html
- https://www.mit.edu/afs.new/athena/system/rhlinux/redhat-6.2-docs/HOWTOS/other-formats/pdf/Assembly-HOWTO.pdf
- Unix tutorial: http://heather.cs.ucdavis.edu/~matloff/unix.html
- Linux installation guide: http://heather.cs.ucdavis.edu/~matloff/linux.html
- Linux assembly language Web page: http://linuxassembly.org/
- full as manual: http://www.gnu.org/manual/gas-2.9.1/html_mono/as.html (contains full list of directives, - register names, etc.; op code names are same as Intel syntax, except for suffixes, e.g. `'l' in ``movl'')
- NASM assembler home page: http://nasm.2y.net/
- my tutorials on debugging, featuring my slide show, using ddd: http://heather.cs.ucdavis.edu/~matloff/debug.html
- the ALD debugger: http://ellipse.mcs.drexel.edu/ald.html
- the Intel2gas syntax converter: http://www.niksula.cs.hut.fi/~mtiihone/intel2gas/