# GCC

- History and features of GCC
- Basic skill of using GCC
- Basic optimization of GCC
- Principle of how the complier works.


## Reference

- Peter van der lin Expert C Programming Deep Secrets
- An Introduction to GCC
- http://gcc.gnc.org

## History and Features of GCC

世上第一个免费软件 Gnu c compiler, 原作者为 Richard Stallman , GNU 项目(1984)的奠基人.

Gcc is the most inmport tools in the development of free software.

GCC不仅可以支持C,还可以支持Fortran,ADA,Java,Objective-C等等.

当前的GCC由CGG Steering Committee组织推动. 

### Features

- GCC is a portable compiler(可移植的编译器),支持pc,dsp,64bit cpu, microcontroller, GCC可以编译其自己.容易应用在多种系统下.
- GCC is not only a native compiler, but also a cross-complier an programe(跨平台的),可以从某个使用GCC的平台编译出其他不同系统的可执行文件. 例如从pc上编译嵌入式的可执行程序.
- GCC has multiple language frontends for parsing different languages. GCC有多个语言前端,可以用于解析不同的语言.
- GCC has modular design,allowing support for new languages and architectures to be added. 可以为新的语言和架构设计支持.
- GCC is free software, distributed under the GNU General Public License.


C programming is a craft that takes years to perfect.


## 基础使用

### 使用GCC编译 c 代码

#### 编译单个源文件
假设源文件为:
```c
//hello.c
#include <stdio.h>

int main(void)
{
    print("hhds");
    printf("Hello world.\n")
    return 0;
}
```

对于初学者,可以使用下列命令,由源代码hello.c 编程出可执行文件hello
```shell
gcc -Wall hello.c -o hello
```

说明:
- -W 表示显示Warning
- -all 表示显示所有的信息
- -o 输出结果命名, 如果不写这个选项和文件名,则gcc会输出可执行文件 a.out

#### 编译多个源文件

假设有main.c hello.c hello.h 等文件, gcc编译多个文件时不需要写.h文件:

```shell
gcc -Wall main.c hello.c -o hello
```

说明:
- #include “” 指的是首先查找当前目录,然后查找系统头文件目录(一般为/usr/include or /usr/local/include/),如果自己编写了某些头文件,那么应当使用#include “”.
- #include <> 指仅在系统头文件目录中找头文件.

#### 显示更多信息

使用-v选项,可以显示更多详情.
```shell
gcc -Wall -v hello.c -o hello
```
#### 独立编译文件

很多程序多是由多个文件构成的,当我们仅修改其中一个文件时,而不愿重新编译所有文件时,我们需要将编译分成两个阶段:
- 编译,生成目标文件
- 链接,生成可执行文件,即连接器ld实现.

```shell
# first stage:
gcc -Wall -c main.c

# second stage:
gcc main.o hello.o -o hello
```

说明:
- -c选项, 表示执行编译过程,生成目标文件,主文件名同待编译的文件名,扩展名为.o

**链接时需要注意链接顺序. 类Unix系统中,编译器和链接器常常在命令行中从左到右的搜索额外的函数,所以包含某个函数定义的文件应当出现在调用该函数的文件的后边.** 很多现代编译器和链接器会搜索所有的对象文件,而不必关注顺序,但是并不是所有的编译器都这么做,所以最好遵循定义在后,调用在前的顺序. 特别是报告“undefined reference”某个函数时.


在大型项目中,修改了某个文件后,仅需要编译该文件,然后将所有文件再链接一次即可,这可以加速build过程. 当然, 也可以使用make 等集成型工具. 类似于 Ant, Maven for Java. 这类工具会自动比较目标文件的时间戳是否比源文件的时间戳更新, 更新的才会编译并链接.


#### 链接外部库

库是已预编译的对象文件集合, 可以链接进自己的程序, 常用于提供某些系统功能, 例如数学、加密等功能.

- 典型的静态库(static libraries)使用 .a (for unix-like) 或 .lib ( for windows) 型的归档文件.
  - .a文件是由工具 GNU ar 生成的, 链接器会解析其中的函数.
  - 标准系统库常存放于 `/usr/lib` , `/lib` ,`/urs/local/lib` , `/usr/include`, `/usr/local/include`, `/usr/lib64`中.


- 典型的动态库(dynamic libraries)使用 .so (for unix-lie) 或 .dll( for windows) 型的归档文件.


假设 main.c 使用了库 libm.a 中函数, libm.a 存放路径为 /usr/lib/libm.a , 那么可以使用下列命令:

```shell
gcc -Wall main.c /usr/lib/libm.a -o calc
# 或者
gcc -Wall main.c -lm -o calc 

# 或者
gcc -Wall main.c -I /some-headers-path/ -L /some-libs-path -o calc
```

说明:
- 包含库文件,首先要在自己的程序中 `#include` 正确的头文件. 如果不包含则可能发生警告或使用异常. 包含时应使用相对路径,避免迁移后发生错误.
- -l, 表示链接的简短表示.
- -m, 表示标准数学库.
- -I dir, 表示 Add directory to include search path
- -L dir, 表示 Add directory to library search path
- 命令行中,包含函数定义的文件,要放在其他使用该函数的文件的右边.

对于设置库的目录,还有一些系统级的方法. 即在环境变量中定义库的路径,例如在 .bash_profile 文件中设置 LIBRARY_PATH , C_INCLUDE_PATH, CPLUS_INCLUDE 等. 例如:

```
export C_INCLUDE_PATH=$C_INCLUDE_PATH:/usr/local/include/
export CPLUS_INCLUDE_PATH=$CPLUS_INCLUDE_PATH:/usr/local/include/
```

最佳方法是使用 -I 和 -L.

#### 使用 ar 生成和查看库文件

GNU ar工具可以将一组对象文件打包进一个归档文件,也就是一个库文件.

```shell
# 生成一个库文件
ar cr libName.a file1.o file2.o ... filen.o 

# 查看库文件内容
ar t libName.a
```

使用库生成可执行文件时,需要将库文件放在使用它的文件之后:
```shell
gcc -Wall main.c libName.a -o calc

# 或者使用-L加路径
gcc -Wall main.c -L . -o calc
```

#### 动态库

外部库通常有两种类型:
- static libraries, 调用者在链接后,生成的可执行文件将包含静态库中所有的内容,无论某些函数是否被真的使用.
  - 常见以 .a 或 .lib 结尾的库
- shared/dynamic libraries, 调用者在链接后, 可执行文件仅包含内容的地址, 在执行时根据地址调用具体内容, 所以可执行文件占用更少的空间.
  - 常见以 .so 或 .dll 结尾的库
  - 可执行文件链接动态库时, 在可执行文件中仅包含了一个表(导入表),而不是库中对象文件的可执行机器码.
  - 在执行可执行文件时, 动态库的机器码会被操作系统从硬盘上拷贝到内存中, 这个过程就是dynamic linking.
  - 动态链接可以使可执行文件更小、节省磁盘空间, 这是因为一个库可以为多个程序所共享.
  - 很多os提供了虚拟内存机制,允许一个共享库在内存中的物理拷贝, 可被多个应用程序所共用,这将大幅减少内存消耗.
  - 动态库在更新后,不需要重新编译可执行文件,因为动态库的接口并未改变.

由于动态库(共享库)有很多优势,所以GCC会默认优先使用动态库(例如有lib1.a 和 lib1.so,会优先使用lib1.so).

当可执行文件启动时, 他的loader function 必须能够找到动态库,然后调入内存. 常见搜索方式:
- 默认搜索的路径是一个预定义的系统路径,例如: `/usr/lib`.
- 环境变量 `LD_LIBRARY_PATH` 可用于设置搜索路径. 在windows下一般不用设置,因为dll常位于path内. 这个方法是比较常用的.

#### 编译时对 C 语言标准的选择

默认情况下, gcc 编译器程序使用c的GNU 方言, 引用为 GNU C. 但是这个GNU C 包含了C语言官方的 ANSI/ISO 标准, 还有一些别的有用的GNU extensions, 例如嵌入型函数, 可变数组等. 

绝大多数 ANSI/ISO 程序可以在 GNU C 下编译, 反过来却不大行. 例如 Linux 内核就使用了很多 GNU C 特性, 只能用GNU C编译.

为了控制这个行为, 可以使用选项:
- -ansi 该选项可用于设定编译器仅使用标准C编译方式生成目标代码.
- -pedantic, 该选项表示严格限制选用标准,例如`gcc -Wall -ansi -pedantic demo.c -o demo` 即严格使用ANSI标准.
- -std , 这个选项可以用来设置C语言标准.
  - -std=89 or -std=iso9899:1990 , 表示最早的ANSI/ISO C语言标准.
  - -std=iso9899:199409 , 表示一个1994年的版本.
  - -std=c99 或 -std=iso9899:1999 , 这个是比较稳定的较新标准. 


示例:
```c
//demo1.c
#include <stdio.h>

int main(void)
{
    const char asm[] = "6502";
    printf("The string is %s.\n", asm);
    return 0;
}
```
上面代码中的asm不是ANSI C中的关键字,但是GNU C中的关键字, 所以使用`gcc -Wall demo1.c -o demo1`会报错. 而使用`gcc -Wall -ansi demo1.c -o demo1` 就会正常生成可执行代码.

再看一个例子:
```c
//demo2.c
#include <math.h>
#include <stdio.h>

int main(void)
{
    printf("The value of pi is %f.\n", M_PI);
    return 0;
}
```

上面代码中的M_PI不是ANSI C中的宏, 所以使用老版本的gcc命令 `gcc -Wall -ansi demo2.c -o demo2` 就会出错. 使用`gcc -Wall demo2.c -o demo2`会正常生成可执行代码. 当前很多使用了llvm的gcc编译器,也包含了M_PI宏,所以使用第一个命令也可以得到正确结果.

还有一种方法,可以使用 ANSI 并追加宏定义: `gcc -Wall -ansi demo2.c -D_GNU_SOURCE pi.c -o demo2`.

#### -Wall选项的含义
-Wall选项包含了很多含义,包括下列内容:
- -Wcomment, 显示Warning: 注释是否嵌套了,C不允许嵌套注释. 即`/* ... */`中不能再有`/* ... */`.
- -Wformat, 显示Warning: scanf 或 printf 中是否存在格式化输入输出错误.
- -Wunused, 显示Warning: 有未使用的变量.
- -Wimplicit, 显示Warning: 有未声明的变量或函数.
- -Wreturn-type, 显示Warning: 没有设置返回值.


如何注释含有注释的一大段代码呢? 可以使用宏定义#if 0 ... #endif:
```c
int main()
{
    ...
#if 0
    /* some comments...*/
    printf("%d",i);
    /* some comments...*/
#endif
    ...

}
```

还有一些编译警告选项是-Wall不包含的,包括:
- -Wconversion
- -Wshadow
- -Wcast-qual
- -Wwrite-strings
- -Wtraditional

这些选项一般初学者不需要,但若生成正式发布版本程序,可以追加用于检查各种问题.

#### 预处理器(preprocessor)

GNU Cpreprocessor cpp 是GCC的一个包,他会在编译代码之前,将宏定义的内容在源文件中自动展开.

例如: 
```C
#define MAX 1024

int i;

i = MAX * 2;
```

又例如条件编译`#ifdef ... #endif`:
```c
/* demo.c */
#include <stdio.h>

int main(void)
{
#ifdef TEST
    printf("TEST mode...\n");
#endif
    printf("Begin running...\n");
    return 0;

}
```

上面的条件编译块中的语句会在下列命令行编译命令执行后生效:
```shell
gcc -Wall -DTEST demo.c -o demo
```

说明:
- -D, 表示在命令行中定义宏. 后面跟着TEST(缺省值,表示TEST=1). 还可以写为`-D TEST=1`. 如果不写-DTEST是不会编译条件编译块中的内容. 完整的在命令行中定义某个宏并赋值的格式为`-DNAME=VALUE`.


其他重要选项:
- **可以执行`cpp -dM /dev/null` 显示GCC所有预定义的宏.**
- -E, 使用这个选项可以直接输出预处理结果而不编译. 可用于查看一些复杂的宏定义结果. 例如`gcc -E demo.c`.
- -save-temps, 用于保存临时结果, 例如执行`gcc -Wall -save-temps demo.c -o demo`会生成:
  - demo.i 文件,显示预处理结果;
  - demo.s 文件,显示汇编指令;
  - demo.o 文件,编译但未链接的目标文件.


#### 用于调试的编译

通常可执行文件中不包含对源程序的引用信息, 这降低了文件大小、加速了执行速度,但是不利于调试. GCC 提供了 -g 调试选项在目标文件和可执行文件中存储额外的调试信息. 

调试信息可以根据机器码信息来跟踪程序错误, 它也允许调试器跟踪可执行程序, 例如GNU Debugger gdb. 

在命令行中加入调试选项 -g, 可以存储的调试信息包含:
- 函数和变量的名称;
- 所有对函数和变量的引用;
- 对应的源代码行号等

这些信息会包含在目标文件或可执行文件的一个符号表中(symbol table).

如果某个程序意外的退出执行, os会写一个core 文件(core dump文件),通常命名为 `core`, 它包含了程序crash时的程序内存状态. 结合 -g 产生的符号表信息, core文件可以用于查找程序停止的源代码行号, 以及这一点的变量值. 这对于软件开发和调试非常有用,甚至在投产后(inthefield).

例如:
```C
/*  null.c   */
int a(int* p);

int main(void)
{
    int* p = 0;
    return a(p);
}
int a(int* p)
{
    int y = *p;
    return y;
}
```

说明:
- 对指针p赋值为 0 (内核地址)是不被允许的. 而且在未检查p是否为空前就将其指向的值赋给y也是不对的. 所以执行 null会报告 Segmentation fault.
- 注意, 虽然上面执行出错,但未生成core (dump)文件, 原因是os为了节约空间, 往往禁用了core dump文件产生.

我们使用命令 `ulimit -c` 查看可用core文件大小, 若值为0则表示OS当前禁止生成core文件. 为了生成 core 文件, 我们先执行命令 `ulimit -c unlimited` 取消限制, 然后再运行 `gcc -Wall -g null.c`, 然后执行`./a.out`, 之后会发现有错误提示:  Segmentation fault: 11 (core dumped), 同时在当前执行目录产生一个core.数字文件, 例如core.2297 .
- 使用 `gdb a.out core.2297` 可以开始调试错误. 下面使一些gdb命令示例:
  - `(gdb)print p` 可以打印变量 p 的当前值.
  - `backtrace` 可以显示调用关系.

#### 编译优化(Compiling with Optimization)

编译器应当能够CPU特性、用户设定、安全需求进行编译优化. GCC是一种可以调优的编译器, 它提供了大量的提升执行速度、降低文件大小的优化选项. 优化是一个复杂过程, 对于每个源代码中的高级命令, 通常有多种可能的机器代码组合, 它们都可能实现正确的运行结果. 编译器必须考虑哪种组合最符合需求. 通常, 不同的CPU需要不同的机器码, 它们使用不能互相兼容的汇编和机器语言. 不同的机器指令执行时的耗时不同, 而且执行过程不同也会造成结果的不同, GCC会将这些问题统一考虑, 并生成一个最高效的可执行文件. 这一点在嵌入式、实时系统中尤为重要. 



优化可以分为两个层次: source-level 和 Machine-level.

##### Source Level
仅发生在源代码层次, 独立于CPU, 不需要知道硬件架构和指令. 有两类常见的优化源码级技术:

- 共用子表达式消除 Common Subexpression Elimination(CSE) : CSE 指通过重用已经计算得到的结果, 在源代码中使用更少的指令来计算表达式值. 当优化器被打开时, CSE 将自动执行. 它是一种功能强大的工具, 因为它增加了执行速度且减少了代码大小.
- 函数内嵌 Function Inlining(FL) : 函数调用额外开销(function call overhead , 例如堆栈操作)是不可避免的,如果某个函数频繁被调用则会有过多的额外开销. 如果某个函数被频繁调用且代码量不大, 不如直接将其嵌入调用者(使被调用函数为内嵌函数), 从而减少调用时的堆栈操作开销, 这个技术就是FL. 
- Loop Unrolling : 需要注意的是,优化时总是存在**Speed-Space 的权衡(tradeoffs)**, 因为并不是所有的技术都像CSE一样既减少耗时又减少空间,所以存在一个速度和空间的权衡. 在权衡时, 有一种优化技术值得关注, 即**Loop Unrolling**. 我们知道在一个循环中, 每执行一次循环就会判断一次循环条件(end of loop), 如果能大量减少循环条件的判断次数将有效减少代码执行时间. Loop Unrolling 就是这样一种技术, 它会提高速度但会增加代码大小. 使用选项 `-funroll-loops` 可以启动该优化.


CSE的示例:
```c
x = cos(v) * (1+sin(u/2))+sin(w)*(1-sin(u/2));
```
其中的`sin(u/2)` 可以使用`t=sin(u/2); x = cos(v) * (1+t)+sin(w)*(1-t)` 表示.

FL的示例:

```c
/* 一个小函数 */
double sq(double x)
{
    return (x*x);
}

/* caller */
sum = 0.0;
for(i=0; i<1000000; i++)
{
    sum += sq(i+0.5);
}
```
上面的编程方式可以改为下列采用FL技术的代码:

```c
/* 方式1 */
sum = 0.0;
for(i=0; i<1000000; i++)
{
    t = i*0.5;
    sum += t * t;
}
```

```c
/* 方式2 */
inline double sq(double x)
{
    return (x*x);
}

/* caller */
sum = 0.0;
for(i=0; i<1000000; i++)
{
    sum += sq(i+0.5);
}
```

类似这种转变, GCC会在优化选项开启后自动执行.


Loop-Unrolling示例:
```c
for(i=0;i<8;i++>)
{
    y[i] = i;
}
```
可以替换为下列代码,会明显提速:
```c
y[0] = 0;
y[1] = 1;
y[2] = 2;
...
```

##### Machine-Level

最低级(机器级)的优化是 **Scheduling**, 这时编译器决定每条指令的顺序. 许多CPUs允许在别的指令执行完毕前, 开始执行一个或多个新指令, 这些CPUs还支持 Pipelining, 即多指令并行执行在同一个CPU上. 当 scheduling 开启时, 指令必须被排列好, 以便后面指令执行前,前面的指令的结果是可用的, 并允许最大化的并行执行. Scheduling 提升了可执行文件的速度且不增加文件大小, 但是它要求更多的内存和更多的编译时间(因为其复杂性).

##### 优化等级

为了控制编译时间和编译器内存消耗, 以及兼顾可执行文件的速度和空间, GCC提供了一组通用的优化等级, 还有一些独立选项用于特定的优化类型.

- 在命令行中, 可以使用选项 `-OLEVEL` 设定优化等级, 这里的 LEVEL 可以取值为 0~3. 
- 请注意, 优化等级越高, 其代价也越高. 代价包括编译时间更长, debug难度更高, 机器代码复杂度更高, 编译器内存消耗更高.
- 最常使用的优化选项是 `-O0` 即不优化, 可用于调试;
- `-O2`是构建开发和部署代码时常用选项;
- `-O3`是一些高质量软件使用的编译优化选项, 例如apache.

示例:
```c
#include <stdio.h>

double powern(double d, unsigned n)
{
    double x = 1.0;
    unsigned j;
    for(j=1;j<=n;j++)
    {
        x *= d;
    }
    return x;
}
int main(void)
{
    double sum = 0.0;
    unsigned i;
    for(i=1;i<=100000000; i++)
    {
        sum += powern(i,i%5);
    }
    printf("sum = %g\n",sum);
    return 0;
}
```

使用命令编译:`gcc -Wall -O0 test.c -o O0` , 然后使用命令 `time ./o0` 计算执行时间(主要看用户态user的耗时).

再使用命令编译:`gcc -Wall -O1 test.c -o O1` , 然后使用命令 `time ./o1` 计算执行时间.

再使用命令编译:`gcc -Wall -O2 test.c -o O2` , 然后使用命令 `time ./o2` 计算执行时间.

再使用命令编译:`gcc -Wall -O3 test.c -o O3` , 然后使用命令 `time ./o3` 计算执行时间.

需要注意的是, 执行速度并不是LEVEL越高速度越快, 还可能出现一些异常. 

#### 优化和调试

优化和调试存在一定的矛盾, 但是GCC可以既使用优化选项,而且使用调试选项 `-g`. 其他编译器往往不允许这样. 当优化和调试选项同时启用时, 调试器(gdb)会重新排列指令, 例如临时变量通常会被消除, 且语句执行顺序会被改变. 

事实上, 调试时最好不用优化选项. 但是当一个程序意外的崩溃, 任何调试信息都会比没有任何调试信息有价值.  所以GCC推荐在优化时使用-g选项.

在优化时, 优化器会执行一个过程以检查所有的变量和他们的初始值, 这可参考为 data-flow analysis. 这个过程会为别的优化策略的构建一个基础, 例如指令scheduling. 数据流分析还有一个作用(side-effect)是帮助你发现未初始化的变量.

GCC 通常会检查出很多未优化的变量, 它使用随机化的优化方式,所以可能会错过一些复杂的情况或错误的报警. 所以最好将代码写的清楚简洁, 而不要使用奇技淫巧.

### 使用GCC编译 C++ 代码

GCC提供的GNU C++编译器是一个真正的C++编译器, 它直接将C++转化为汇编代码, 而不像有些编译器将C++代码转化为C代码之后再转化为汇编代码. GNU C++编译器支持更好的错误报告, 调试和优化.

编译一个C++程序的过程与编译一个C程序的过程相同, 但使用的命令是 `g++` , 而不再是 `gcc`. GCC g++ 的 C++ 前端有许多与gcc相同的选项, 同时还有一些不同的额外选项支持C++代码编译.

使用C++编写的程序的目标文件必须由 g++ 链接, 这是为了提供正确的 C++库. 如果使用 gcc 链接 C++ 目标文件, 会产生 undefined reference errors. 这是因为C与C++的命名空间不同, C没有命名空间.

示例:
```c++
// hello.cc is a demo of C++ program.
#include <iostream>
int main()
{
    std::cout << "Hello, world." << std::endl; //std::表示一个命名空间.
    return 0;
}
```

编译链接命令:`g++ -Wall hello.cc -o hello` 正确输出可执行文件, 而gcc却不行.

## 编译器的工作原理

编译是一个多阶段的过程, 使用了编译器本身及其他很多工具. 完整的工具集被称为一个toolchain.

当gcc命令执行时, 由以下过程组成:
- preprocessing (to expand macros and included header files)
  - 这一步执行的是 `cpp demo.c > demo.i` demo.i 中保存着扩展后的全部源代码.
- Compliation ( from source code to assembly language)
  - 这一步执行的是 `gcc -Wall -S demo.i` , -S 会生成汇编代码文件 demo.s, 这也是最复杂的一步.
- Assembly ( from assembly language to machine code)
  - 这一步执行的是 `as demo.s -o demo.o` 
- Linking (to create the final executable)
  - 这一步执行的是 `gcc demo.o`, 将外部库的执行代码与demo.o中的放在一起. 这里的gcc是一个集成命令, 包含了ld等多个命令.

g++ 与 gcc 的过程类似.

## 其他辅助工具

### file 命令

当一个源文件被编译为目标文件或可执行文件时, 编译时所采用的选项是不明确的. `file` 命令可以查看一个目标文件或可执行文件的内容, 并判断它的特性.

说明:
- ELF, “Executable and Linking Format”标准的可执行文件的内部格式, 它是unix-like系统中的常见可执行文件格式. 还有别的可执行文件格式,例如COFF(Common Object File Format) , COFF常用于较老的操作系统,如DOS.

- LSB(低位在前), 使用 Least Significant Byte first word-ordering 为某个平台进行编译, 例如 Intel 和 AMD x86
- MSB(高位在前)
- not stripped, 表示包含符号表.

### nm 命令
`nm` 命令可用于显示一个可执行文件中的符号表

例如:
```shell
$ nm hello
0000000100000000 T __mh_execute_header
0000000100000f50 T _hello
0000000100000f20 T _main
                 U _printf
                 U dyld_stub_binder
```

说明:
- T 表示后面的符号是在目标文件中被定义的;
- U 表示后面的符号围在目标文件中定义, 其定义应当来自链接过程,即由外部库提供定义.

使用 `nm` 命令可以检查一个库是否包含某个函数的定义, 通过检查某个函数符号名前面是否有 `T` 即可知晓.

在 GNU Binutils 手册中可以找到 nm 命令完整解释.

### strip 命令
可执行文件包含一个符号表, 这个表可以使用 `strip` 命令删除.

例如:
```shell
$ nm hello
0000000100000000 T __mh_execute_header
                 U _printf
                 U dyld_stub_binder
```


### ldd 命令

一个程序使用共享库(动态库)编译时, 它需要动态调用库中代码. `ldd` 命令可以检查一个可执行文件, 显示它需要使用的共享库列表. 这些库作为可执行文件的依赖项.

```shell
gcc -Wall hello.c
ldd a.out
```

ldd 命令也可用于检查共享库本身, 跟踪共享库依赖链.

### time 命令

用于计算可执行文件的执行时间.

```shell
time demo
```

### gprof 工具

GNU profiler gprof 是一个可用于评估程序性能的工具. 它可以记录调用每个函数的数量, 以及每个函数调用消耗的时间.

如果要加速程序,就是要优化哪些消耗时间长的函数.


示例文件collatz.c :
```c
#include <stdio.h>
/* Computes the length of Collatz sequences, as a demo demonstrates the usage of two tools: gprof and gcov. */

unsigned int step(unsigned int x)
{
    if(x%2 ==0){
        return (x/2);
    }
    else
    {
        return (3*x+1);
    }

}

unsigned int nseq(unsigned int x0)
{
    unsigned int i =1,x;
    if(x0 ==1 || x0 ==0)
        return i;
    x = step(x0);
    while(x != 1 && x!=0)
    {
        x = step(x);
        i++;
    }
    return i;
}

int main(void)
{
    unsigned int i, m=0,im=0;
    for(i=1;i<500000;i++)
    {
        unsigned int k = nseq(i);
        if(k>m)
        {
            m =k;
            im = i;
            printf("sequence length = %u for %u\n",m,im);
        }
    }
    return 0;
}
```

编译: `gcc -Wall -pg collatz.c -o collatz`

说明:
- -pg , 选项表示启用 mcount 指令,用于计算各组成部分的时间.
- 编译完成后会生成gmon.out文件


执行命令: `gprof collatz` , 计算代码各部分的执行时间并显示统计信息.

### gcov 工具

GNU 覆盖度测试工具 gcov 可以分析程序执行时每行的次数, 可以用于找到没有用的代码, 或在测试过程中被标记的代码.

当然在有限的测试中, 有些代码区域可能无法被触发或真的很少被调用. 

示例代码cov.c :

```c
#include <stdio.h>
/* A demo demonstrates the usage of tool: gcov. */

int main(void)
{
    int i;
    for(i=1;i<10;i++)
    {
        if(i%3 == 0)
            printf("%d is divisible by 3\n",i);
        if(i%11 == 0)
            printf("%d is divisible by 11\n",i);
    }
    return 0;
}
```

编译代码: `gcc -Wall -fprofile-arcs -ftest-coverage cov.c`

说明:
- -fprofile-arcs , 表示
- -ftest-coverage , 表示
- 编译后会生成cov.gcno文件, cov.gcno文件.

然后执行`gcov cov.c`, 查看代码执行覆盖度, 会生成cov.c.gcov文件,这个文件中的第一列是每行的执行次数. 如果有5个#号,即#####表示语句从未被执行过.

