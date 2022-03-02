# GDB 简要教程

> 内容来自：https://linuxtools-rst.readthedocs.io/zh_CN/latest/tool/gdb.html
> 内容来源：https://www.tutorialspoint.com/gnu_debugger


GDB是一个由GNU开源组织发布的、UNIX/LINUX操作系统下的、基于命令行的、功能强大的程序调试工具。 对于一名Linux下工作的c++程序员，gdb是必不可少的工具。

程序中的语法错误几乎都可以由编译器诊断出来，很容易就能发现并解决；但是程序的逻辑错误无法通过编译器(如gcc)发现， 我们需要调试器实现问题的跟踪。

GNU symbolic debugger 简称GDB，是Linux平台下最常用的一种调试工具。GDB常以gdb命令形式在终端shell上使用，它有很多特性（选项）支持调试。

GDB 调试器可以支持 C，C++，Go，Obejctive-C，OpenCL，Ada等多种编程语言提供支持。实际场景中，GDB常用来调试unix-like系统中的 C和C++程序。很多IDE工具集成的调试器的能力都来自于GDB。

## GDB 是什么？
实际场景中解决逻辑错误最高效的方法，就是借助调试工具对程序进行调试。

所谓调试（Debug），就是让代码一步一步慢慢执行，跟踪程序的运行过程。比如，可以让程序停在某个地方，查看当前所有变量的值，或者内存中的数据；也可以让程序一次只执行一条或者几条语句，看看程序到底执行了哪些代码。

也就是说，通过调试程序，我们可以监控程序执行的每一个细节，包括变量的值、函数的调用过程、内存中数据、线程的调度等，从而发现隐藏的错误或者低效的代码。

常见的调试器有：
- Remote Debugger，这是VC、VS自带的调试器，与IDE无缝衔接。
- WinDbg，windows中的调试器，功能超过Remote Debugger，还有一个命令行版本cdb.exe
- LLDB，XCode自带的调试器
- GDB，Linux下使用最多的调试器，也有Windows 移植版。

### 安装gdb
如果命令行中运行`gdb -v` 命令，出现not found反馈，则可以通过下列命令安装：
- Redhat系列Linux：`sudo yum -y install gdb `
- Debian系列Linux：`sudo apt -y install gdb`

## 1 启动gdb

对于C/C++程序的调试，需要在编译前加上-g选项：
```
$g++ -g hello.cpp -o hello
```

1. 调试可执行文件：
```
$gdb hello
or
$gdb -tui hello
```
hello就是执行文件，一般在当前目录下。

2. 调试core文件

core是程序非法执行后core dump后产生的文件。

```
$gdb <program> <core dump file>

```

3. 调试服务程序

```
$gdb <program> <PID>
$gdb hello 11113
```
如果你的程序是一个服务程序，那么你可以指定这个服务程序运行时的进程ID。gdb会自动attach上去，并调试他。program应该在PATH环境变量中搜索得到。

## 2 gdb交互命令
启动gdb后，进入到交互模式，通过以下命令完成对程序的调试；注意高频使用的命令一般都会有缩写，熟练使用这些缩写命令能提高调试的效率；

### 2.1 运行
- `run`：简记为 r ，其作用是运行程序，当遇到断点后，程序会在断点处停止运行，等待用户输入下一步的命令。
    如果有参数文件，例如名为a，可以run < a,可以输入参数。
    
- `continue` （简写c ）：继续执行，到下一个断点处（或运行结束）
- `next`：（简写 n），单步跟踪程序，当遇到函数调用时，也不进入此函数体；此命令同 step 的主要区别是，step 遇到用户自定义的函数，将步进到函数中去运行，而 next 则直接调用函数，不会进入到函数体内。
- `step` （简写s）：单步调试如果有函数调用，则进入函数；与命令n不同，n是不进入调用的函数的
- `until`：当你厌倦了在一个循环体内单步跟踪时，这个命令可以运行程序直到退出循环体。
- `until+行号`： 运行至某行，不仅仅用来跳出循环
- `finish`： 运行程序，直到当前函数完成返回，并打印函数返回时的堆栈地址和返回值及参数值等信息。
- `call 函数(参数)`：调用程序中可见的函数，并传递“参数”，如：call gdb_test(55)
- `quit`：简记为 q ，退出gdb

### 2.2 设置断点

`break n` （简写b n）:在第n行处设置断点
（可以带上代码路径和代码名称： b OAGUPDATE.cpp:578）
`b fn1 if a＞b`：条件断点设置
`break func`（break缩写为b）：在函数func()的入口处设置断点，如：break cb_button
`delete 断点号n`：删除第n个断点
`disable 断点号n`：暂停第n个断点
`enable 断点号n`：开启第n个断点
`clear 行号n`：清除第n行的断点
`info b `（info breakpoints） ：显示当前程序的断点设置情况
`delete breakpoints`：清除所有断点.

### 2.3 查看源代码
`list` ：简记为 l ，其作用就是列出程序的源代码，默认每次显示10行。
`list 行号`：将显示当前文件以“行号”为中心的前后10行代码，如：list 12
`list 函数名`：将显示“函数名”所在函数的源代码，如：list main
`list` ：不带参数，将接着上一次 list 命令的，输出下边的内容。

### 2.4 打印表达式
`print 表达式`：简记为 p ，其中“表达式”可以是任何当前正在被测试程序的有效表达式，比如当前正在调试C语言的程序，那么“表达式”可以是任何C语言的有效表达式，包括数字，变量甚至是函数调用。
print a：将显示整数 a 的值
print ++a：将把 a 中的值加1,并显示出来
print name：将显示字符串 name 的值
print gdb_test(22)：将以整数22作为参数调用 gdb_test() 函数
print gdb_test(a)：将以变量 a 作为参数调用 gdb_test() 函数
display 表达式：在单步运行时将非常有用，使用display命令设置一个表达式后，它将在每次单步进行指令后，紧接着输出被设置的表达式及值。如： display a
watch 表达式：设置一个监视点，一旦被监视的“表达式”的值改变，gdb将强行终止正在被调试的程序。如： watch a
whatis ：查询变量或函数
info function： 查询函数
扩展info locals： 显示当前堆栈页的所有变量

### 2.5 查询运行信息
where/bt ：当前运行的堆栈列表；
bt backtrace 显示当前调用堆栈
up/down 改变堆栈显示的深度
set args 参数:指定运行时的参数
show args：查看设置好的参数
info program： 来查看程序的是否在运行，进程号，被暂停的原因。

### 2.6 分割窗口
layout：用于分割窗口，可以一边查看代码，一边测试：
layout src：显示源代码窗口
layout asm：显示反汇编窗口
layout regs：显示源代码/反汇编和CPU寄存器窗口
layout split：显示源代码和反汇编窗口
Ctrl + L：刷新窗口


### 

- ig ignore 让断点在前n次到达时都不停来。例如：ig 3 12，让编号为3的断点在前12次到达时都不停下来。
- cond condition，给断点加一个条件。例如 cond 2 i>3 , 2号断点只有在i>3时才起作用。
- commcommands，在某个断点处停下来后执行一段gdb命令，例如 comm 4，在断点4停下来后执行一段命令，输入这段命令后，就输入要执行的内容。
- wa watch，当变量或表达式的值发生时停下里，例如 wa i，当i的值发生变化时停下来。
- aw awatch，变量读写时都会停下来。aw i，当i被读写时都会停下来。
- rw rwatch，当变量被读的时候停下来。rw i，当i被读的时候停下来。



## 3 更强大的工具

### 3.1 cgdb
cgdb可以看作gdb的界面增强版,用来替代gdb的 gdb -tui。cgdb主要功能是在调试时进行代码的同步显示，这无疑增加了调试的方便性，提高了调试效率。界面类似vi，符合unix/linux下开发人员习惯;如果熟悉gdb和vi，几乎可以立即使用cgdb。




## 调试符号（symbols）

调试符号表（ Debugging Symbol Table）在已编译的二进制程序中将指令映射到它们对应的变量、函数、源代码行号。映射的形式可能如下所示：

`Program instruction ⇒ item name, item type, original file, line number defined.`

符号表可能嵌入到程序中，或作为独立文件存储。如果要调试程序，那么生成一个符号表是必要的。从符号表可以推断下列事实（符号表功能）：
- 符号表为某个程序的特定版本服务，如果程序改变了，则要生成新的符号表；
- 程序的debug builds通常比发布版的 retail builds更大且执行更慢；Debug builds 包含了 symbol table 和其它ancillary information。
- 如果你希望调试一个二进制程序，你不需要自己编译，但你必须要得到来自作者的调试表（ symbol table）。

为了让GDB能够读取 symbol table中的所有信息，我们需要使用带-g选项的gcc方法编译它。通常，我们编译自己的程序如下所示：
`gcc hello.c -o hello`, 为了生成symbol table，我们需要增加 -g 选项：`gcc -g hello.c -o hello`

## 常用命令
调试程序之前，需要先将源代码编译为可执行文件，使用追加调试信息的编译命令：`gcc -g myprogram.c` ，会得到一个可执行文件 a.out, 它包含了调试信息，可以在GDB中看到变量和函数名，而不是原始的内存地址（这不是开玩笑）。有了可执行文件，我们使用命令`gdb a.out` 打开它(导入)。

GDB提供了一大堆命令，而下面的命令是最常用的：
### 断点设置
- b main，表示在程序入口点设置断点；
- b 或 break ，表示在当前行设置一个断点；
- b N ，表示在第N行设置一个断点；
- b+N ，在当前行后面的第n行设置一个断点；
- b fn，在函数 "fn" 的起始点设置断点；
- d N 或 delete N，删除号码为 N 的断点；
- info break, 显示断点； 
- watch x==3，设置一个观察点，当条件（例如 x 等于3时）满足时程序暂停。观察点时非常适合检查没有在任何函数调用中中断的特定输入（例如myPtr != NULL ) 。
### 运行程序类
对于一个已导入的可执行文件，启动运行有3种方法：
- r ，运行程序，直到一个断点或错误时停止；
- r arg1 arg2 ，即向程序传递参数1 参数2并运行；
- r < file1 ，即运行程序，并将file1作为feed导入。

- c 或 continue，在某个断点或观察点中断后，恢复或继续运行程序，直到下一个断点或错误；
- f 或 finish，运行当前函数后暂停，如果你偶然进入某个函数，则可以通过f命令结束当前函数；
- u N ，运行程序，直到当前行之前的第 N 行;


#### 单步调试
- s 或 step ，运行程序的下一条指令，而不是行。如果下一条指令是一个函数调用，则会jump into 此函数，执行其第一条指令后暂停，step是一个深入了解程序细节的好命令;
- s N ， 运行程序的下面N行;

- n 或 next，类似s，但是不step into（进入functions调用），n运行当前程序直到下一行，然后暂停。如果当前行是一个函数，他将完整执行该函数后暂停。next命令是一个快速浏览代码执行过程的好命令。


### 查看或设置变量、堆栈类
在运行时查看和改变变量的值，是调试的关键部分。尝试向函数提供无效的输入，或者运行别的测试case来发现问题的root原因。典型地，当程序暂停时，你可以查看或设置变量。

- p var 或 print var, 打印变量"var"的当前值；
- set x=3 或 set x=y，设置变量x的值为3或y；

- display x ， 静态显示变量x的值，它会在每个step或pause后显示。如果你静态检查一个值时会比较有用。
- undisplay x，删除某个已经由display命令显示的变量的静态显示


### 调用函数
调用用户定义的或系统的函数。这是非常有用的功能，但是调用有问题的函数（buggy functions）时要警惕。
- call myfunction() 
- call myotherfunction(x)
- call strlen(mystring)
### 向后跟踪和改变帧（Backtrace and Changing Frames）

一个堆栈是当前函数调用（calls）的列表，它显示了你在程序中的位置。 一个帧（frame）存储了某个单一函数调用的细节，例如参数值。

- bt 或 backtrace，向后跟踪或打印当前函数堆栈，显示你在当前程序中的位置。如果 main 调用了函数 a(), 而 a 调用了 b(), b 调用了 c(), 那么 bt命令的结果如下：

```shell
c <= current location 
b 
a 
main 
```
- u 或 up，在函数stack中移动到上一个帧，即向上一个堆栈内级别（Goes up a level in the stack）。例如上例中，你在函数c中，那么执行 u 命令，可以移动到b或a中检查本地变量。
- d 或 down，在函数stack中移动到下一个帧，即向下一个堆栈内级别（Goes down a level in the stack）
- return ，从当前函数返回。

### Handling Signals

Signals 信号是在某个特定事件发生后的产生的消息，例如某个计时器或错误。GDB在遇到一个 signal时，可能会暂停，而你可能会希望忽略它。

- handle [signalname][action]
- handle SIGUSER1 nostop
- handle SIGUSR1 noprint
- handle SIGUSR1 ignore

上面的GDB指令将在信号到来时，调试器不暂停、不打印、忽略一定的 signal （SIGUSER1）

### 辅助和退出类
- q ，退出gdb
- help，帮助
- h breakpoints，列出帮助主题或获取特定主题的帮助（如breakpoints）

### 显示源代码
- l，显示源代码
- l 50 ， 显示当前行开始的50行代码；
- l myfunction，显示自己的函数。

## 初步实践

### 示例1
This example demonstrates how you would capture an error that is happening due to an exception raised while dividing by zero.

```c++
//A program to generate a core dump.
#include <iostream>
using namespace std;  

int divint(int, int);  
int main() 
{ 
   int x = 5, y = 2; 
   cout << divint(x, y); 
   
   x =3; y = 0; 
   cout << divint(x, y); 
   
   return 0; 
}  

int divint(int a, int b) 
{ 
   return a / b; 
}   
```

执行下列编译步骤：
- 编译该程序：`g++ -Wall -g crash.cc -o crash`；
- 设置core dump 文件大小为unlimited：`ulimit -c unlimited`；
- 然后执行该程序 `./crash` ， 会产生一个core文件，记录了程序发生错误时内存里相关信息；



执行下列调试步骤：
- `gdb ./crash` 启动调试 crash 
- `(gdb) r` 在调试器中运行程序，由于存在错误，所以在执行除数为0的语句时会停下来，信号量为SIGFPE。例如：

```shell
(gdb) r
Starting program: /home/leo/workspace/debug/demo02/crash1 

Program received signal SIGFPE, Arithmetic exception.
0x00005555555551c8 in divint (a=3, b=0) at crash1.cc:18
18		return a/b;

```

- `(gdb) l` , 显示程序停止处的语句(注意只有使用-g编译才能显示源代码)

```shell
(gdb) l
13		return 0;
14	}
15	
16	int divint(int a, int b)
17	{
18		return a/b;
19	}
(gdb) 
```

- `(gdb) where` 或 `(gdb) bt` 向后跟踪或打印当前函数堆栈，显示你在当前程序中的位置，也即显示当前哪条语句引发程序执行错误。
- `(gdb) up` 从stack trace 的默认级别0到级别1，例如：

```shell
(gdb) where
#0  0x00005555555551c8 in divint (a=3, b=0) at crash1.cc:18
#1  0x00005555555551a5 in main () at crash1.cc:11
(gdb) bt
#0  0x00005555555551c8 in divint (a=3, b=0) at crash1.cc:18
#1  0x00005555555551a5 in main () at crash1.cc:11
(gdb) up
#1  0x00005555555551a5 in main () at crash1.cc:11
11		cout << divint(x,y);
(gdb) bt
#0  0x00005555555551c8 in divint (a=3, b=0) at crash1.cc:18
#1  0x00005555555551a5 in main () at crash1.cc:11
(gdb) bt
#0  0x00005555555551c8 in divint (a=3, b=0) at crash1.cc:18
#1  0x00005555555551a5 in main () at crash1.cc:11
(gdb) 
```

- （可选）退出gdb后，执行`gdb ./crash core` ，加载可执行文件crash和core文件，这几乎等同于启动 gdb 并键入“r”命令.

### 示例2

编写如下c++源文件，命名为crash2.cc。

```c++
#include <iostream>  
using namespace std; 

void setint(int*, int); 
int main() 
{ 
   int a; 
   setint(&a, 10); 
   cout << a << endl; 
   
   int* b; 
   setint(b, 10); 
   cout << *b << endl; 
   
   return 0; 
} 

void setint(int* ip, int i)
{
   *ip = i; 
}
```

之后，编译可调试的可执行文件：`g++ -Wall -g ./crash2.cc -o crash2` , g++ 编译器会告警main函数中的指针变量b未被初始化。编译后运行程序：

```shell
./crash2
#以下为结果
10
zsh: segmentation fault  ./crash2

```

使用gdb进行调试:
- `gdb ./crash2`
- `(gdb) r`

结果如下：
```
(gdb) r
Starting program: /home/leo/workspace/debug/demo02/crash2 
10

Program received signal SIGSEGV, Segmentation fault.
0x00005555555551f7 in setint (ip=0x0, i=10) at ./crash2.cc:21
21		*ip = i;
```

可以看到形参指针ip为0x0，这是os不允许访问的位置。所以报了SIGSEGV。接着查看stack trace：

```
(gdb) bt
#0  0x00005555555551f7 in setint (ip=0x0, i=10) at ./crash2.cc:21
#1  0x00005555555551b5 in main () at ./crash2.cc:13
```

main函数调用setint（13行）,错误发生在setint中赋值语句（21行）。但为什么不能赋值？可以使用step into跟踪。

```
(gdb) r
The program being debugged has been started already.
Start it from the beginning? (y or n) y
Starting program: /home/leo/workspace/debug/demo02/crash2 

Breakpoint 1, main () at ./crash2.cc:9
9		setint(&a,10);
(gdb) n
10		cout << a << endl;
(gdb) s
10
13		setint(b,10);
(gdb) s
setint (ip=0x0, i=10) at ./crash2.cc:21
21		*ip = i;
1: ip = (int *) 0x0
2: *ip = <error: Cannot access memory at address 0x0>
3: ip = (int *) 0x0
(gdb) p *ip
Cannot access memory at address 0x0
(gdb) p ip
$10 = (int *) 0x0
(gdb) 

```

可见出错前的语句中，变量ip是“Cannot access memory at address 0x0”