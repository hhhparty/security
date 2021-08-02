# SHELL 编程

## Quickstart
### 什么是Shell脚本？
Shell脚本（英语：Shell script）是一种电脑程序与文本文件，内容由一连串的shell命令组成，经由Unix Shell直译其内容后运作。被当成是一种脚本语言来设计，其运作方式与直译语言相当，由Unix shell扮演命令行解释器的角色，在读取shell script之后，依序运行其中的shell命令，之后输出结果。利用Shell script可以进行系统管理，文件操作等。

在Unix及所有的类Unix系统中，如Linux、FreeBSD等操作系统，都存在Shell Script。依照Unix shell的各种不同类型，Shell script也有各种不同方言。在DOS、OS/2、Microsoft Windows中的批处理文件，跟shell script有类似的功能。

一个简单的示例：
```shell
#!/bin/sh
cd ~
mkdir shell_tut
cd shell_tut
for ((i=0;i<10;i++)); do
    touch test_$i.txt
done
```
实例解析：
第1行：指定脚本解释器，这里是用/bin/sh做解释器的
第2行：切换到当前用户的home目录
第3行：创建一个目录shell_tut
第4行：切换到shell_tut目录
第5行：循环条件，一共循环10次
第6行：创建一个test_1…10.txt文件
第7行：循环体结束

### 环境

shell编程跟java、php编程一样，只要有一个能编写代码的文本编辑器和一个能解释执行的脚本解释器就可以了。

当前主流的操作系统都支持shell编程，本文档所述的shell编程是指Linux下的shell，讲的基本都是POSIX标准下的功能，所以，也适用于Unix及BSD（如Mac OS）。

- Linux，Linux默认安装就带了shell解释器。
- Mac OS，Mac OS不仅带了sh、bash这两个最基础的解释器，还内置了ksh、csh、zsh等不常用的解释器。
- Windows上的模拟器，windows出厂时没有内置shell解释器，需要自行安装，为了同时能用grep, awk, curl等工具，最好装一个cygwin或者mingw来模拟linux环境。
  - cygwin
  - mingw

### 脚本解释器

#### sh

即Bourne shell，POSIX（Portable Operating System Interface）标准的shell解释器，它的二进制文件路径通常是/bin/sh，由Bell Labs开发。

#### bash
Bash是Bourne shell的替代品，属GNU Project，二进制文件路径通常是/bin/bash。业界通常混用bash、sh、和shell，比如你会经常在招聘运维工程师的文案中见到：熟悉Linux Bash编程，精通Shell编程。

在CentOS里，/bin/sh是一个指向/bin/bash的符号链接:
```
[root@centosraw ~]# ls -l /bin/*sh
-rwxr-xr-x. 1 root root 903272 Feb 22 05:09 /bin/bash
-rwxr-xr-x. 1 root root 106216 Oct 17  2012 /bin/dash
lrwxrwxrwx. 1 root root      4 Mar 22 10:22 /bin/sh -> bash
```
但在Mac OS上不是，/bin/sh和/bin/bash是两个不同的文件，尽管它们的大小只相差100字节左右:
```
iMac:~ wuxiao$ ls -l /bin/*sh
-r-xr-xr-x  1 root  wheel  1371648  6 Nov 16:52 /bin/bash
-rwxr-xr-x  2 root  wheel   772992  6 Nov 16:52 /bin/csh
-r-xr-xr-x  1 root  wheel  2180736  6 Nov 16:52 /bin/ksh
-r-xr-xr-x  1 root  wheel  1371712  6 Nov 16:52 /bin/sh
-rwxr-xr-x  2 root  wheel   772992  6 Nov 16:52 /bin/tcsh
-rwxr-xr-x  1 root  wheel  1103984  6 Nov 16:52 /bin/zsh
```

#### 高级编程语言
理论上讲，只要一门语言提供了解释器（而不仅是编译器），这门语言就可以胜任脚本编程，常见的解释型语言都是可以用作脚本编程的，如：Perl、Tcl、Python、PHP、Ruby。Perl是最老牌的脚本编程语言了，Python这些年也成了一些linux发行版的预置解释器。

编译型语言，只要有解释器，也可以用作脚本编程，如C shell是内置的（/bin/csh），Java有第三方解释器Jshell，Ada有收费的解释器AdaScript。

如下是一个PHP Shell Script示例（假设文件名叫test.php）：
```shell
#!/usr/bin/php
<?php
for ($i=0; $i < 10; $i++) {
    echo $i . "\n";
}
```
执行：

```/usr/bin/php test.php```
或者：
```
chmod +x test.php
./test.php
```
#### 如何选择shell编程语言
##### 熟悉 vs 陌生
如果你已经掌握了一门编程语言（如PHP、Python、Java、JavaScript），建议你就直接使用这门语言编写脚本程序，虽然某些地方会有点啰嗦，但你能利用在这门语言领域里的经验（单元测试、单步调试、IDE、第三方类库）。

新增的学习成本很小，只要学会怎么使用shell解释器（Jshell、AdaScript）就可以了。

##### 简单 vs 高级
如果你觉得自己熟悉的语言（如Java、C）写shell脚本实在太啰嗦，你只是想做一些备份文件、安装软件、下载数据之类的事情，学着使用sh，bash会是一个好主意。

shell只定义了一个非常简单的编程语言，所以，如果你的脚本程序复杂度较高，或者要操作的数据结构比较复杂，那么还是应该使用Python、Perl这样的脚本语言，或者是你本来就已经很擅长的高级语言。因为sh和bash在这方面很弱，比如说：
- 它的函数只能返回字串，无法返回数组
- 它不支持面向对象，你无法实现一些优雅的设计模式
- 它是解释型的，一边解释一边执行，连PHP那种预编译都不是，如果你的脚本包含错误(例如调用了不存在的函数)，只要没执行到这一行，就不会报错
#### 环境兼容性
如果你的脚本是提供给别的用户使用，使用sh或者bash，你的脚本将具有最好的环境兼容性，perl很早就是linux标配了，python这些年也成了一些linux发行版的标配，至于mac os，它默认安装了perl、python、ruby、php、java等主流编程语言。

### 第一个shell脚本
#### 编写
打开文本编辑器，新建一个文件，扩展名为sh（sh代表shell），扩展名并不影响脚本执行，见名知意就好，如果你用php写shell 脚本，扩展名就用php好了。

输入一些代码，第一行一般是这样：
```
#!/bin/bash
#!/usr/bin/php
```
"#!"是一个约定的标记，它告诉系统这个脚本需要什么解释器来执行。

#### 运行
运行Shell脚本有两种方法：

作为可执行程序
```
chmod +x test.sh
./test.sh
```
注意，一定要写成./test.sh，而不是test.sh，运行其它二进制的程序也一样，直接写test.sh，linux系统会去PATH里寻找有没有叫test.sh的，而只有/bin, /sbin, /usr/bin，/usr/sbin等在PATH里，你的当前目录通常不在PATH里，所以写成test.sh是会找不到命令的，要用./test.sh告诉系统说，就在当前目录找。

通过这种方式运行bash脚本，第一行一定要写对，好让系统查找到正确的解释器。

这里的"系统"，其实就是shell这个应用程序（想象一下Windows Explorer），但我故意写成系统，是方便理解，既然这个系统就是指shell，那么一个使用/bin/sh作为解释器的脚本是不是可以省去第一行呢？是的。

#### 作为解释器参数
这种运行方式是，直接运行解释器，其参数就是shell脚本的文件名，如：
```
/bin/sh test.sh
/bin/php test.php
```
这种方式运行的脚本，不需要在第一行指定解释器信息，写了也没用。

