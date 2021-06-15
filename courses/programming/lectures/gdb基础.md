# GDB 基础
> 内容来源：https://www.tutorialspoint.com/gnu_debugger


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

### Windows 下的gdb

略

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

```
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

执行下列步骤：
- 编译该程序：`g++ -Wall -g crash.cc -o crash`；
- 设置core dump 文件大小为unlimited：`ulimit -c unlimited`；
- 然后执行该程序 `./crash` ， 会产生一个core文件，记录了程序发生错误时内存里相关信息；
- 执行`gdb ./crash core` ，加载可执行文件crash和core文件；