# CPlus Programming in Linux

下面以具体例子为切入点，示例程序有下列文件：
- main.cpp
- hello.cpp
- factorial.cpp
- functions.h

```cpp
// main.cpp

#include <iostream>

using namespace std;

#include "functions.h"

int main(){
   print_hello();
   cout << endl;
   cout << "The factorial of 5 is " << factorial(5) << endl;
   return 0;
}
```

```cpp
//hello.cpp

The code given below is for hello.cpp source file −

#include <iostream>

using namespace std;

#include "functions.h"

void print_hello(){
   cout << "Hello World!";
}
```

```cpp
//factorial.cpp
#include "functions.h"

int factorial(int n){
   
   if(n!=1){
      return(n * factorial(n-1));
   } else return 1;
}
```

```
//functions.h

void print_hello();
int factorial(int n);
```
为了编译上面的一组代码，通常会见到有下列的编译指令：
`gcc  main.cpp hello.cpp factorial.cpp -o hello`

但如果真去执行，会发现大量的报错，特别是网上很多人百思不得其解的问题"undefined reference std..."：
```sh
main.cpp:(.text+0x11): undefined reference to `std::basic_ostream<char, std::char_traits<char> >& std::endl<char, std::char_traits<char> >(std::basic_ostream<char, std::char_traits<char> >&)'
/usr/bin/ld: main.cpp:(.text+0x1b): undefined reference to `std::cout'
```

Fix 这个问题的办法就是，编译c++要使用g++，即使用下列方法：

`g++  main.cpp hello.cpp factorial.cpp -o hello`


上面的例子仅有4个文件，真正的项目可能包含上百个文件，而且编译的顺序我们使用了从右到左的方式去指定，但是文件很多时，顺序是更复杂的。

所以我们需要用make工具。


## Make

### makefile

#### Macros

make 程序允许使用宏，宏在一个makefile中使用 “=” 对。例子如下：

```makefile
MACROS  = -me
PSROFF  = groff -Tps
DITROFF = groff -Tdvi
CFLAGS  = -O -systype bsd43
LIBS    = "-lncurses -lm -lsdl"
MYFACE  = ":*)"
```


##### 特别的宏
有一些特定的宏已经被预定义，包括：
- `$@` 指代被操作的文件名
- `$?` 指代变更的依赖的名字
-  `$<` 表示在当前行动引入的相关文件的名字
-  `$*` 表示target和依赖文件共同的前缀
-  使用`make -p` 可以打印默认的宏定义，例如 CC 或 CFLAGS

`$@`: 规则中的目标集合，在模式规则中，如果有多个目标的话，“ $@”表示匹配模式中定义的目标集合。
`$<`：依赖文件集合中的第一个文件，如果依赖文件是以模式(即“ %” )定义的，那么“ `$<`”就是符合模式的一系列的文件集合
`$^`：所有依赖文件的集合，使用空格分开，如果在依赖文件中有多个重复的文件，会去除重复的依赖文件，只保留一份。
`$%`：当目标是函数库的时候表示规则中的目标成员名，如果目标不是函数库文件，那么其值为空。
`$?`：所有比目标新的依赖目标集合，以空格分开。
`$+`：和“ $^”类似，但是当依赖文件存在重复的话不会去除重复的依赖文件。

结合上面的例子，Makefile文件如下：
```makefile

hello: main.cpp hello.cpp factorial.cpp
    $(CC) $(CFLAGS) $?  $(LDFLAGS) -o $@
```

说明：
- `$@` 表示了 hello
- `$?` 表示了所有变更的源文件

通常，隐含规则是用于从 cpp文件构建目标文件时使用的，例如：

```Makefile
.cpp.o:
    $(CC) $(CFLAGS) -c $<
```

##### 常用默认宏

Sr.No	Variables & Description
1	 AR  Archive-maintaining program; default is `ar'.  
2	  AS    Program to compiling assembly files; default is `as'.  
3	  CC    Program to compiling C programs; default is `cc'.  
4	  CO    Program to checking out files from RCS; default is `co'.  
5	  CXX    Program to compiling C++ programs; default is `g++'.  
6	  CPP    Program to running the C preprocessor, with results to standard output; default is `$(CC) -E'.  
7	  FC    Program to compiling or preprocessing Fortran and Ratfor programs; default is `f77'.  
8	  GET    Program to extract a file from SCCS; default is `get'.   
9	  LEX    Program to use to turn Lex grammars into source code; default is `lex'.  
10	  YACC    Program to use to turn Yacc grammars into source code; default is `yacc'.    
11	LINT    Program to use to run lint on source code; default is `lint'.  
12	  M2C    Program to use to compile Modula-2 source code; default is `m2c'.  
13	  PC    Program for compile Pascal programs; default is `pc'.    
14	  MAKEINFO    Program to convert a Texinfo source file into an Info file; default is `makeinfo'.
15	TEX  Program to make TeX dvi files from TeX source; default is `tex'.  
16	  TEXI2DVI    Program to make TeX dvi files from Texinfo source; default is `texi2dvi'.  
17	  WEAVE    Program to translate Web into TeX; default is `weave'.    
18	  CWEAVE    Program to translate C Web into TeX; default is `cweave'.  
19	  TANGLE    Program to translate Web into Pascal; default is `tangle'.  
20	  CTANGLE    Program to translate C Web into C; default is `ctangle'.  
21	  RM    Command to remove a file; default is `rm -f'.   

#### 变量

变量定义使用 `变量名  :=  内容`



#### 一些常用参数

Here is a table of variables whose values are additional arguments for the programs above. The default values for all of these is the empty string, unless otherwise noted.    

Sr.No.	Variables & Description
1	  ARFLAGS    Flags to give the archive-maintaining program; default is `rv'.  
2	  ASFLAGS    Extra flags to give to the assembler when explicitly invoked on a `.s' or `.S' file.  
3	  CFLAGS    Extra flags to give to the C compiler.  
4	  CXXFLAGS    Extra flags to give to the C compiler.  
5	  COFLAGS    Extra flags to give to the RCS co program.  
6	  CPPFLAGS    Extra flags to give to the C preprocessor and programs, which use it (such as C and Fortran compilers).  
7	  FFLAGS    Extra flags to give to the Fortran compiler.  
8	  GFLAGS    Extra flags to give to the SCCS get program.  
9	  LDFLAGS    Extra flags to give to compilers when they are supposed to invoke the linker, `ld'.  
10	  LFLAGS    Extra flags to give to Lex.  
11	  YFLAGS    Extra flags to give to Yacc.  
12	  PFLAGS    Extra flags to give to the Pascal compiler.  
13	  RFLAGS    Extra flags to give to the Fortran compiler for Ratfor programs.  
14	  LINTFLAGS    Extra flags to give to lint.

你可以取消所有隐含规则中使用的变量，例如使用`-R` 或 `--no-builtin-variables`  选项。

你也可以在命令行中定义宏例如：

`make CPP=/home/courses/xxxx/xxxx`


#### 自定义参数

其语法是：
`<target ...> : <variable-assignment>`


`<target ...> : overide <variable-assignment>`


`<variable-assignment>`可以是前面讲过的各种赋值表达式，如“=”、“:=”、“+=”或是“？=”。第二个语法是针对于make命令行带入的变量，或是系统环境变量。

这个特性非常的有用，当我们设置了这样一个变量，这个变量会作用到由这个目标所引发的所有的规则中去。如：
```makefile
prog : CFLAGS = -g
prog : prog.o foo.o bar.o
$(CC) $(CFLAGS) prog.o foo.o bar.o


prog.o : prog.c
$(CC) $(CFLAGS) prog.c


foo.o : foo.c
$(CC) $(CFLAGS) foo.c


bar.o : bar.c
$(CC) $(CFLAGS) bar.c
```

在这个示例中，不管全局的$(CFLAGS)的值是什么，在prog目标，以及其所引发的所有规则中（prog.o foo.o bar.o的规则），$(CFLAGS)的值都是“-g”

- `?=` 例如：`FOO ?= bar`其含义是，如果FOO没有被定义过，那么变量FOO的值就是“bar”，如果FOO先前被定义过，那么这条语将什么也不做，其等价于：


#### 在makefile中定义依赖

常见的一个最终二进制文件将依赖于各种源代码和头文件。
```makefile
hello: main.o factorial.o hello.o
   $(CC) main.o factorial.o hello.o -o hello
```
上面的例子显示了要生成hello文件，需要依赖 main.o factorial.o hello.o。如果hello不存在或者这里面有任意一个依赖文件发生了变化，make都会重新创建hello。

同时，我们还需要告诉make如何生成  .o 文件。因此需要做下列定义：

```Makefile
main.o: main.cpp functions.h
   $(CC) -c main.cpp

factorial.o: factorial.cpp functions.h
   $(CC) -c factorial.cpp

hello.o: hello.cpp functions.h
   $(CC) -c hello.cpp
```

#### 定义规则

makefile中target通用的语法：
```
target [target...] : [dependent...]
    [command...]
```

上面的例子中，在方括号里的参数是可选的，ellipsis省略号意味着一或多个。注意，在命令前需要使用tab进行缩进。


语义是非常简单的：
- 当你说"make target"时，make会找到target规则并应用；
- 如果有任何依赖的时间戳较target的时间戳更新，那么就执行下面的命令，期间完成宏的替换
- 如果任何依赖需要被构建，那么将递归生成recursion。

#### 清理

make 在遇到错误时，应当执行一个错误清理的终结动作，例如：

```makefile
clean:
    -rm *.o *~ core paper
```

说明：Make 忽略以破折号（dash）开头的命令行的返回状态。

Make 会回显命令行，显示发生了什么。又是你可能想关闭一些显示，可以如下操作：
```Makefile
install:
   @echo You must be root to install.
```

```sh
$ make install
You must be root to install.
```

- make all 表示编译所有的东西，以至你可以在安装应用前做本地测试。
- make install 表示按照正确的步骤安装应用
- make clean 表示清空应用，删除可执行文件、临时文件、目标文件。

#### Makefile 隐藏规则

该命令应适用于我们从源代码x.cpp构建可执行文件x的所有情况。这可以说是一个隐含的规则：

```makefile
.cpp:
   $(CC) $(CFLAGS) $@.cpp $(LDFLAGS) -o $@
```

这条隐含规则说了如果从 x.c 编译出 x，即运行对 x.c 运行 cc，并输出x。这条规则是隐藏的，因为没有特定目标被显示。它可以用于所有案例。

别的通用的构建目标文件的隐含规则有：
```makefile
.cpp.o:
   $(CC) $(CFLAGS) -c $<

#alternatively

.cpp.o:
   $(CC) $(CFLAGS) -c $*.cpp
```

#### 在makefile中定义自定义的前缀

Make可以在相应的.c文件上使用cc-c自动创建.o文件。这些规则内置于make中，您可以利用这一优势缩短Makefile。如果只在Makefile的依赖行中指明当前目标所依赖的.h文件，make将知道已经需要相应的.cfile。您不必包含编译器的命令。

```makefile
OBJECTS = main.o hello.o factorial.o
hello: $(OBJECTS)
   cc $(OBJECTS) -o hello
hellp.o: functions.h

main.o: functions.h 
factorial.o: functions.h 
```

Make 使用一个特定的目标，名为 .SUFFIXES 来允许你定义自己的前缀。例如，参考下面给出的依赖线：
```
.SUFFIXES: .foo .bar
```

上面的语句，告诉 make 你讲使用特定的前缀来生成自己的规则。

### makefile 指令

GNU make支持下列指令：

#### 条件指令

- `ifeq` 指令开始条件，并指定条件。它包含两个参数，用逗号分隔并用括号包围。对两个参数执行变量替换，然后对它们进行比较。如果两个参数匹配，则遵循ifeq后面的makefile行；否则它们被忽略。
- `ifdef`指令开始条件，并指定条件。它包含单个参数。如果给定的参数为真，则条件变为真。

- `ifndef`指令开始条件，并指定条件。它包含单个参数。如果给定的参数为假，则条件变为真。

- 如果前一个条件失败，`else`指令将导致遵守以下行。在上述示例中，这意味着无论何时不使用第一替代链接命令，都使用第二替代链接命令。在条件中包含`else`是可选的。

- `endif`指令结束条件。每个条件必须以`endif`结尾。


条件指令的语法：

```
条件指令
   text if true
endif

# 或者
conditional-directive
   text-if-true
else
   text-if-false
endif

```

示例：

```Makefile
ifeq (arg1, arg2)
ifeq 'arg1' 'arg2'
ifeq "arg1" "arg2"
ifeq "arg1" 'arg2'
ifeq 'arg1' "arg2" 

#相反地
ifneq (arg1, arg2)
ifneq 'arg1' 'arg2'
ifneq "arg1" "arg2"
ifneq "arg1" 'arg2'
ifneq 'arg1' "arg2" 
```

例子：
```Makefile
libs_for_gcc = -lgnu
normal_libs =

foo: $(objects)
ifeq ($(CC),gcc)
   $(CC) -o foo $(objects) $(libs_for_gcc)
else
   $(CC) -o foo $(objects) $(normal_libs)
endif
```

#### include 指令

include 指令允许make悬挂读取当前makefile，在继续进行前转而读取一到多个其他的makefiles。在makefile文件中，这个指令是一行，类似：

```
include filenames...

```

文件名可能包含shell 文件名模式。行前的扩展空格是允许和被忽略的，但是不允许使用tab。例如你有3个mk文件，a.mk,b.mk,c.mk，$(bar)，然后

例如：
```makefile

include foo *.mk $(bar)
#等于
include foo a.mk b.mk c.mk bish bash
```

#### override 指令

如果用命令参数设置了变量，则忽略makefile中的普通赋值。如果您想在makefile中设置变量，即使它是用命令参数设置的，也可以使用override指令，该指令如下


## References

- https://blog.csdn.net/weixin_38391755/article/details/80380786