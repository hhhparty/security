# Makefile 课程

## 语法

```Makefile
Target: dependency 1, 2,3...
    （Tab）命令
```

- 目标（Target）：一般是指要编译的目标，也可以是一个动作
- 依赖：执行当前目标所要依赖的先决条件，可以包含其他目标、库、文件等等
- 命令：实现目标要执行的具体命令，可以没有也可以多条。

make命令在执行时会读取当前目录下的Makefile、makefile、GNUmakefile作为输入文件，按从上到下的顺序去解读，默认情况下会执行第一个目标。

```Makefile

a:
    echo "Hello Makefile"

b:
    echo "Hello second"

```

输出结果是：
```
└─$ make
echo "Hello Makefile"
Hello Makefile
```

make 命令选项：
- -f 可以指定除上述文件名之外的文件作为输入文件
- -v 显示版本号
- -n 只输出命令，但不执行，一般用来测试
- -s 只执行命令，但不显示具体命令；也可换用@作为抑制输出
- -w 显示执行前后的路径
- -C dir 指定makefile的目录
- 没有指定目标时，执行第一个目标
- 如果指定目标，则只执行目标下的命令
- -p 显示各种参数

## gcc g++ 编译流程

使用一个demo工程,包含下列文件：
- add.cpp
- add.h
- sub.cpp
- sub.h
- calc.c


```makefile
calc: add.o sub.o
        g++ -Wall calc.cpp  $^ -o $@

add.o: add.cpp
        g++ -c add.cpp -o $@

sub.o: sub.cpp
        g++ -c sub.cpp -o sub.o
```

执行过程如下：
```
$ make -n
g++ -c add.cpp -o add.o
g++ -c sub.cpp -o sub.o
g++ -Wall calc.cpp  add.o sub.o -o calc
```

从上面的例子可以看出，g++的编译流程：
- 预处理 `gcc -E main.cpp>main.ii` -E就是表示预处理、不编译不汇编不链接
- 编译 `gcc -S main.ii` 得到名为main.s的汇编文件；
- 汇编 `gcc -c main.s` 得到名为main.o的二进制文件
- 链接 `gcc -lstdc++ main.o` 得到a.out的二进制文件

-lstdc++ 表示直接生成可执行文件。

使用makefile后，大型项目可以首次编译时间很长，第二次就很快了，因为没有改动的不会再编译。

## makefile 的变量

- AS 汇编程序的名称，默认为 as
- CC C编译器名称，默认为cc
- CPP C预编译器名称，默认为cc -E
- CXX C++编译器，默认为 g++
- RM 文件删除程序名称 默认为 rm -f

自定义变量：
- 定义方法： `变量名 = 变量值`
- 使用方法： `$(变量名)`


特殊宏：
- $@ 表示当前target
- $^ 表示当前target 的所有依赖
- $< 表示当前target 的第一个依赖


```makefile
TARGET = calc
OBJECT = add.o \
         sub.o \

$(TARGET): calc.cpp $(OBJECT)
        g++ -Wall $^ -o $@

add.o: add.cpp
        g++ -c $^ -o $@

sub.o: sub.cpp
        g++ -c $^ -o sub.o

clean:
        rm -rf $(OBJECT) $(TARGET)

```

