# Anti Debug

## 错误的反汇编

通常我们使用 objdum、IDA pro、radare 等等反汇编工具对二进制进行反汇编，但有些情况objdump类的工具无法正确解析指令流。

### Jump into 指令中间

假设有下面的代码：
```s
start:
        jmp label+1
label:
        DB 0x90
        mov eax,0xf001
```

上面的代码还不是所谓的"trick"，就可以很明显地说明这个问题。在label后面跟了一个单字节的操作码 0x90 （nop），而 jmp label+1 这种跳转到指令中间的情况对 objdump 是没有能力去更深层理解的。

```s
objdump -d -M intel anti01
anti01: file format elf32-i386

08048080 <start>:
 8048080: e9 01 00 00 00 jmp 8048086 <label+0x1>
08048085 <label>:
 8048085: e9 b8 01 f0 00 jmp 8f48242 <__bss_start+0xeff1b6>

```

从上面的解析结果可以看到 objdump 不会跟踪 jmp ，只是线性的解析这些代码,所以我们的mov指令被隐藏了。

正确的解读应当是：
```s
Disassembly of section .text:
08048080 <start>:
 8048080: e9 01 00 00 00 jmp 8048086 <label+0x1>
08048085 <label>:
 8048085: 90 nop
 8048086: b8 01 f0 00 00 mov eax,0xf001
```

#### 如何绕过（circumvent）这个问题？

为了能够使用 objdump ，我们必须手动的替代 0xE9 。当然，这仅能帮助反汇编过程。如果文件有 checksum 过程的话，在执行程序时会有问题。

更好的选择时使用类似 bastard， ida pro，或者其他可以做控制流分析的工具。例如，使用 lida 反汇编上面代码时，结果如下：

```s
---- section .text ----:
08048080 E9 01 00 00 00 jmp Label_08048086
 ; (08048086)
 ; (near + 0x1)
08048085 DB E9
Label_08048086:
08048086 B8 01 F0 00 00 mov eax, 0xF001
 ; xref ( 08048080 )
```

所以，使用正确的工具可以有效解决这类问题。

### 运行时计算目的地址

另一种可以糊弄反汇编工具的 trick，是在运行时计算跳转地址。为实现这一点，代码会当前 EIP ，然后加上某个偏移来找到目的地址。
- 为了获取EIP，通常使用 call + pop 技术实现，因为call指令存放了当前eip存放到stack中，而没有人会阻止我们使用pop将它弹到某个寄存器中；
- 下面是一个比刚才更高级一些的例子：

```s
; ----------------------------------------------------------------------------
    call earth+1
Return:
                ; x instructions or random bytes here   xb
earth:          ; earth = Return + x
    xor eax, eax    ; align disassembly, using single byte opcode 1b
    pop eax         ; start of function: get return address ( Return ) 1b
                    ; y instructions or random bytes here yb
    add eax, x+2+y+2+1+1+z      ; x+y+z+6 2b
    push eax        ; 1b
    ret         ; 1b
                ; z instructions or random bytes here zb
 ; Code:
                ; !! Code Continues Here !!
; ---------------------------------------------------------------------------- 
```

下面是一个实现例子，我们使用一个字节的 x 和 z，防止它占用太多的字节。

代码部分我们选择了3个nops，它们在输出上很容易看到：

```s
; ----------------------------------------------------------------------------
; antia.s
    call earth+1
earth: DB 0xE9      ; 1 <--- pushed return address,
                    ; E9 is opcode for jmp to disalign disassembly
    pop eax ; 1 hidden
    nop ; 1
    add eax, 9 ; 2 hidden
    push eax ; 1 hidden
    ret ; 1 hidden

    DB 0xE9         ; 1 opcode for jmp to misalign disassembly
Code:               ; code continues here <--- pushed return address + 9
    nop
    nop
    nop
    ret
; ----------------------------------------------------------------------------
```

我们使用 `nasm -f elf antia.s` 来生成目标文件。 在这个例子里，objdump 当然要被糊弄。

```
# objdump -d antia.o
antia.o: file format elf32-i386
```

Disassembly of section .text:

```s
00000000 <earth-0x5>:
 0: e8 01 00 00 00 call 6 <earth+0x1>
00000005 <earth>:
 5: e9 58 90 05 09 jmp 9059062 <earth+0x905905d>
 a: 00 00 add %al,(%eax)
 c: 00 50 c3 add %dl,0xffffffc3(%eax)
 f: e9 90 90 90 c3 jmp c39090a4 <earth+0xc390909f> 
```

我们的代码（3 nops）被隐藏在地址 0xf 之后。但不仅如此，我们的EIP计算过程完全被 objdump 隐藏了。

下面我们看看 IDA 的输出：

```s
.text:08000000 ; Segment permissions: Read/Execute
.text:08000000 _text segment para public 'CODE' use32
.text:08000000 assume cs:_text
.text:08000000 ;org 8000000h
.text:08000000 assume es:nothing, ss:nothing, ds:_text,
.text:08000000 fs:nothing, gs:nothing
.text:08000000 dd 1E8h
.text:08000004 ; -------------------------------------------------------------
.text:08000004 add cl, ch
.text:08000006 pop eax
.text:08000007 nop
.text:08000008 add eax, 9
.text:0800000D push eax
.text:0800000E retn
.text:0800000E ; ------------------------------------------------------------- 
.text:0800000F dd 909090E9h
.text:08000013 ; -------------------------------------------------------------
.text:08000013 retn
.text:08000013 _text ends
.text:08000013
.text:08000013
.text:08000013 end 
```

看起来，IDA 不喜欢 call + 1 指令。但是 ida pro 毕竟显示了 eip 计算的代码。

我们把这个同样的文件放到lida这个工具里，可以看到下面的代码：

```s
---- section .text ----:
08048080 E8 01 00 00 00 call Function_08048086
 ; (08048086) ; (near + 0x1)
08048085 DB E9
Function_08048086:
08048086 58 pop eax ; xref
 ;( 08048080 )
08048087 90 nop
08048088 05 09 00 00 00 add eax, 0x9
0804808D 50 push eax
0804808E C3 ret
0804808F E9 90 90 90 C3 jmp CB951124
 ;(near - 0x3C6F6F70)
08048094 DB 00, 54, 68, 65, 20, 4E, 65, 74, 77, 69, 64, 65, 20, 41, 73, 73
```

看起来更好一些。直到ret指令，Lida 都如实反汇编了我们的代码。但是在最后一部分（3个nop）处也出现了问题，机会没有反汇编工具可以告诉我们ret指令后的正确解析结果。

#### 如何绕过这种 trick ？
这种情况几乎没有自动的方法可用，或者说自动工具不是100%准确。有可能反汇编工具在模拟执行后才可能有正确的汇编结果。

现实中，这不是一个大问题，当我们使用交互式反汇编工具就可以告诉工具代码从何处开始。所以，这种技术只能称之为 anti-disassembling 技术。

## 检查断点

Silvio Cesare在其 “Linux Anti Debugging Techniques - Fooling the Debugger.”（1999） 中提到的第一种技术，是很容易被绕过的。

例如：
```c
// -- antibreakpoint.c --
void foo()
{
 printf("Hello\n");
}
int main()
{
 if ((*(volatile unsigned *)((unsigned)foo) & 0xff) == 0xcc) {
    printf("BREAKPOINT\n");
    exit(1);
 }
 foo();
}
// -- EOF -- 
```

如前文描述，gdb 设置断点是通过在某个想中断的位置上填入一个 int 3 指令码（0xCC）。所以，某个程序检查有没有 0xCC 是很容易的，如果有就如上面代码所示会打印出 “BREAKPOINT” 。


```sh
# gdb ./x
GNU gdb 6.0-2
Copyright 2003 Free Software Foundation, Inc.
GDB is free software, covered by the GNU General Public License, and you are
welcome to change it and/or distribute copies of it under certain conditions.
Type "show copying" to see the conditions.
There is absolutely no warranty for GDB. Type "show warranty" for details.
This GDB was configured as "i586-linux-gnu"...Using host libthread_db library "/
lib/tls/libthread_db.so.1".
gdb> bp foo
Breakpoint 1 at 0x804838c
gdb> run
BREAKPOINT
Program exited with code 01.
```

### 如何绕过这个 trick ？
现实中，当然不会输出 “BREAKPOINT” ，而是直接退出程序，以防止调试。
这种trick的原理就是在执行代码前检查是否指令码是否存在 0xCC，如果存在就退出程序或执行特定操作。但是检查工作一般不会是全部地址都检查，而是像上面的代码一样，只检查是否在foo入口处设置断点。假设foo函数指令如下：

```s
0804838c <foo>:
 804838c: 55 push ebp
 804838d: 89 e5 mov ebp,esp
 804838f: 83 ec 08 sub esp,0x8
 8048392: 83 ec 0c sub esp,0xc
 8048395: 68 c8 84 04 08 push 0x80484c8
 804839a: e8 0d ff ff ff call 80482ac <_init+0x38>
 804839f: 83 c4 10 add esp,0x10
 80483a2: c9 leave
 80483a3: c3 ret
```

绕过这个anti-debug的trick是很容易的，只要断点不设置在 0804838c 处，就不会被检查到有调试。

如果程序中设置了对所有地址范围的 0xCC （INT 3） 检查，那么你还可以使用 [ICEBP 指令（0xF1）](http://www.rcollins.org/secrets/opcodes/ICEBP.html)来进行中断，操作时可能需要使用 16 进制编辑器或gdb等工具写入某个地址处。

## 检查 debugging

```c
// -- antiptrace.c --
int main()
{
 if (ptrace(PTRACE_TRACEME, 0, 1, 0) < 0) {
    printf("DEBUGGING... Bye\n");
    return 1;
 }
 printf("Hello\n");
 return 0;
}
// -- EOF -- 
```

上面这个程序通过对自己设置debugging request，来检查是否允许调试。假设现在这个程序被 gdb 调试，那么就会导致 ptrace() 失败，因为只能有一个调试器。一旦调用失败那就说明该程序在被调试。

### 如果绕过这个 trick ？
#### 方法一：
显然，这种检查仅仅适用于使用ptrace作为基础调试器的调试器，例如gdb。而任何不使用 ptrace() 的调试器都可以调试这个程序。此外，可以 patch/wrap ptrace（），这是更高级的一种方法。较为容易的方法是使用 nop 指令替换调用 ptrace() 的指令，使其不能自己调用ptrace或不能检查。为了实现这一点，我们需要找到 ptrace() 在哪里检查？如果可执行文件没有使用 -s 选项（-s 删除所有符号表和重定位信息）进行编译，那么找到相关内容是比较容易的。例如：

```
# objdump -t test_debug | grep ptrace
080482c0 F *UND* 00000075 ptrace@@GLIBC_2.0 
```

所以 ptrace 在 0x080482c0 处被调用，可以使用下面方式查看调用指令：

```
# objdump -d -M intel test_debug |grep 80482c0
 80482c0: ff 25 04 96 04 08 jmp ds:0x8049604
 80483d4: e8 e7 fe ff ff call 80482c0 <_init+0x28>
```

既然找到了何处调用 ptrace ，我们只需要阻止调用就可以了。

但如果使用了 -s 选项编译可执行文件怎么办呢？ 那么 objdump 就不能显示上面的结果（找不到了），我们可以使用 gdb来处理：

```sh
# gdb test_debug
GNU gdb 6.0-2
Copyright 2003 Free Software Foundation, Inc.
GDB is free software, covered by the GNU General Public License, and you are
welcome to change it and/or distribute copies of it under certain conditions.
Type "show copying" to see the conditions.
There is absolutely no warranty for GDB. Type "show warranty" for details.
This GDB was configured as "i586-linux-gnu"...Using host libthread_db
library "/lib/tls/libthread_db.so.1".
gdb> bp ptrace
Breakpoint 1 at 0x80482c0
gdb> run
Breakpoint 1 at 0x400e02f0
___________________________
_______________________________________________________________________________
 eax:00000000 ebx:40143218 ecx:00000001 edx:4014449C eflags:00200246
 esi:BFFFF5E4 edi:BFFFF570 esp:BFFFF53C ebp:BFFFF558 eip:400E02F0
 cs:0073 ds:007B es:007B fs:0000 gs:0033 ss:007B o d I t s Z a P c
[007B:BFFFF53C]---------------------------------------------------------[stack]
BFFFF56C : C4 A9 00 40 18 32 14 40 - 00 00 00 00 70 F5 FF BF ...@.2.@....p...
BFFFF55C : A0 BE 03 40 01 00 00 00 - E4 F5 FF BF EC F5 FF BF ...@............
BFFFF54C : 00 00 00 00 00 00 00 00 - 40 44 01 40 B8 F5 FF BF ........@D.@....
BFFFF53C : D9 83 04 08 00 00 00 00 - 00 00 00 00 01 00 00 00 ................
[007B:BFFFF5E4]---------------------------------------------------------[ data]
BFFFF5E4 : 8A F7 FF BF 00 00 00 00 - B1 F7 FF BF C0 F7 FF BF ................
BFFFF5F4 : D3 F7 FF BF E4 F7 FF BF - F7 F7 FF BF 0B F8 FF BF ................
[0073:400E02F0]---------------------------------------------------------[ code]
0x400e02f0 <ptrace>: push %ebp
0x400e02f1 <ptrace+1>: mov %esp,%ebp
0x400e02f3 <ptrace+3>: sub $0x10,%esp
0x400e02f6 <ptrace+6>: mov %edi,0xfffffffc(%ebp)
0x400e02f9 <ptrace+9>: mov 0x8(%ebp),%edi
0x400e02fc <ptrace+12>: mov 0xc(%ebp),%ecx
------------------------------------------------------------------------------
Breakpoint 1, 0x400e02f0 in ptrace () from /lib/tls/libc.so.6
```

如上面，我们在 ptrace() 上设置了断点，现在键入 `pret`  返回调试

```
gdb> prêt
_______________________________________________________________________________
 eax:FFFFFFFF ebx:40143218 ecx:FFFFFFFF edx:FFFFFF00 eflags:00200246
 esi:BFFFF5E4 edi:BFFFF570 esp:BFFFF540 ebp:BFFFF558 eip:080483D9
 cs:0073 ds:007B es:007B fs:0000 gs:0033 ss:007B o d I t s Z a P c
[007B:BFFFF540]---------------------------------------------------------[stack]
BFFFF570 : 18 32 14 40 00 00 00 00 - 70 F5 FF BF B8 F5 FF BF .2.@....p.......
BFFFF560 : 01 00 00 00 E4 F5 FF BF - EC F5 FF BF C4 A9 00 40 ...............@
BFFFF550 : 00 00 00 00 40 44 01 40 - B8 F5 FF BF A0 BE 03 40 ....@D.@.......@
BFFFF540 : 00 00 00 00 00 00 00 00 - 01 00 00 00 00 00 00 00 ................
[007B:BFFFF5E4]---------------------------------------------------------[ data]
BFFFF5E4 : 8A F7 FF BF 00 00 00 00 - B1 F7 FF BF C0 F7 FF BF ................
BFFFF5F4 : D3 F7 FF BF E4 F7 FF BF - F7 F7 FF BF 0B F8 FF BF ................
[0073:080483D9]---------------------------------------------------------[ code]
0x80483d9 <main+29>: add $0x10,%esp
0x80483dc <main+32>: test %eax,%eax
0x80483de <main+34>: jns 0x80483fa <main+62> 
0x80483e0 <main+36>: sub $0xc,%esp
0x80483e3 <main+39>: push $0x80484e8
0x80483e8 <main+44>: call 0x80482e0
------------------------------------------------------------------------------
0x080483d9 in main () 
```

从这里，我们也可以看到我们在哪里执行，ptrace() 的返回地址。现在我们可以patch 这个文件，nop out 这条jns 指令，或改变eax寄存器的值。

```
gdb> set $eax=0
gdb> c
everything ok
Program exited with code 016.
_______________________________________________________________________________
No registers.
gdb> 
```

#### 方法二

还有一种绕过方法，是自己写一个 ptrace() 函数，仅执行返回0操作的函数。同时在 LD_PRELOAD 环境变量中设置，令可执行文件指向自己的 ptrace() 函数。

例如： 首先我们设计一个测试用的可执行文件，它采用了上面的反调试技术：

```c
// -- antiptrace.c --
int main()
{
 if (ptrace(0,0,1,0) < 0) {
 printf("DEBUGGER PRESENT!\n");
 exit(1);
 }
 printf("Hello World!\n");
}
// -- EOF --
```

编译它：`gcc antiptrace.c -o antiptrace`

接下来，我们使用一个简单的 ptrace 函数来代替隐含的系统ptrace：

```c
// -- ptrace.c --
int ptrace(int i, int j, int k, int l)
{
 printf(" PTRACE CALLED!\n");
}
// -- EOF -- 
```

将其编译为一个库：
`gcc -shared ptrace.c -o ptrace.so`

如果我们直接运行 antiptrace ：

```
# ./antiptrace
Hello World!
```

使用 gdb 加载并运行：

```
# gdb ./antiptrace
GNU gdb 6.0-2
Copyright 2003 Free Software Foundation, Inc.
GDB is free software, covered by the GNU General Public License, and you are
welcome to change it and/or distribute copies of it under certain conditions.
Type "show copying" to see the conditions.
There is absolutely no warranty for GDB. Type "show warranty" for details.
This GDB was configured as "i586-linux-gnu"...Using host libthread_db
library "/lib/tls/libthread_db.so.1".
gdb> run
DEBUGGER PRESENT!
Program exited with code 01.
gdb>
```

现在，我们设置系统环境变量，让他调用我们自己的ptrace 函数：

```
(gdb) set environment LD_PRELOAD ./ptrace.so
(gdb) run
Starting program: /home/leo/workspace/r2test/antidebug/antiptrace 
 PTRACE CALLED!
Hello World!
[Inferior 1 (process 1633) exited normally]
(gdb) 
```

可见，原调试检查机制失效了。

## References
Schallner, M. Beginners Guide to Basic Linux Anti Anti Debugging Techniques  May 2006
Cesare, S., Linux Anti Debugging Techniques - Fooling the Debugger. 1999.
mammon_, et al., bastard - The Bastard Disassembly Environment. 2002.
Datarescue, IDA Pro - Disassembler and Debugger. 2004.
Schallner, M., lida - Linux Interactive DisAssembler. 2004.
Mammon, Mammons Tales, in Assembly Programming Journal. 2004.
Unknown, LinIce - Linux Debugger, http://www.linice.com/.
Unknown, The Dude, http://the-dude.sourceforge.net/. 