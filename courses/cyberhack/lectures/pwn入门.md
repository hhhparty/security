# PWN 入门

PWN是一个黑客语法的俚语词，自"own"这个字引申出来的，这个词的含意在于，玩家在整个游戏对战中处在胜利的优势，或是说明竞争对手处在完全惨败的情形下，这个词习惯上在网络游戏文化主要用于嘲笑竞争对手在整个游戏对战中已经完全被击败（例如："You just got pwned!"）。

有一个非常著名的国际赛事叫做Pwn2Own，相信你现在已经能够理解这个名字的含义了，即通过打败对手来达到拥有的目的。

CTF中PWN题型通常会直接给定一个已经编译好的二进制程序（Windows下的EXE或者Linux下的ELF文件等），然后参赛选手通过对二进制程 序进行逆向分析和调试来找到利用漏洞，并编写利用代码，通过远程代码执行来达到溢出攻击的效果，最终拿到目标机器的shell夺取flag。


## 相关知识

### linux等OS命令

####  ```|```，Linux管道

可以将一个进程的标准输出作为另一个进程的标准输入。例如ls命令可用于查看当前目录下的文件列表，而grep命 令可用于匹配特定的字符，因此```ls | grep test```命令可用于列出当前目录下文件名包含test的文件。

#### ```file 文件名``` 查看文件属性

可以显示文件的类型、应用平台、版本、编译、解释等信息。


#### ```checksec 文件名```，查看程序防护

#### ```readelf -h 文件名```，查看文件头信息。
#### ```xxd ```显示二进制文件的内容
xxd的作用就是将一个文件以十六进制的形式显示出来。它还可以将十六进制转储转换回其原始二进制形式。

##### 常用参数：
-a ,它的作用是自动跳过空白内容，默认是关闭的
-c, 它的后面加上数字表示每行显示多少字节的十六进制数，默认是16字节
-g, 设定以几个字节为一块，默认为2字节
-l, 显示多少字节的内容
-s, 后面接【+-】和address.加号表示从地址处开始的内容，减号表示距末尾address开始的内容



##### 参考实例
使用-a参数，自动跳过空白，从0x200开始，输入文件:
```[root@linuxcool ~]# xxd -a -s +0x200 linuxcool.txt```

使用-a、-c参数，自动跳过空白，每行显示12字节，从0x200开始，输入文件:
```[root@linuxcool ~]# xxd -a -c 12 -s +0x200 linuxcool.txt```

使用-a、-c、-g参数，自动跳过空白，每行显示12字节，一个字节一块，显示512字节内容，从0x200开始，输入文件:
```[root@linuxcool ~]# xxd -a -c 12 -g 1 -l 512 -s +0x200 linuxcool.txt```

##### 与该功能相关的Linux命令：
readelf命令 – 显示elf格式文件的信息
rlogin命令 – 远端登入
named-checkconf命令 – named配置文件语法检查
xzcmp命令 – 比较xz压缩文件
mtoolstest命令 – 测试并显示mtools的相关设置
fstrim命令 – 回收已挂载的文件系统未使用的块
mdir命令 – 显示MS-DOS目录
inncheck命令 – 检查语法
namei命令 – 列出一个路径中所有的成分
objdump命令 – 查看目标文件构成的gcc工具

例如 ```xxd 文件名 | od -A x -t xlz 文件名```  完整显示二进制文件数据
#### ```od ``` 以8进制或其他格式导出文件


```od [-abcdfhilovx][-A <字码基数>][-j <字符数目>][-N <字符数目>][-s <字符串字符数>][-t <输出格式>][-w <每列字符数>][--help][--version][文件...]```

参数：
-a 　此参数的效果和同时指定"-ta"参数相同。
-A<字码基数> 　选择要以何种基数计算字码。
-b 　此参数的效果和同时指定"-toC"参数相同。
-c 　此参数的效果和同时指定"-tC"参数相同。
-d 　此参数的效果和同时指定"-tu2"参数相同。
-f 　此参数的效果和同时指定"-tfF"参数相同。
-h 　此参数的效果和同时指定"-tx2"参数相同。
-i 　此参数的效果和同时指定"-td2"参数相同。
-j<字符数目>或--skip-bytes=<字符数目> 　略过设置的字符数目。
-l 　此参数的效果和同时指定"-td4"参数相同。
-N<字符数目>或--read-bytes=<字符数目> 　到设置的字符数目为止。
-o 　此参数的效果和同时指定"-to2"参数相同。
-s<字符串字符数>或--strings=<字符串字符数> 　只显示符合指定的字符数目的字符串。
-t<输出格式>或--format=<输出格式> 　设置输出格式。
-v或--output-duplicates 　输出时不省略重复的数据。
-w<每列字符数>或--width=<每列字符数> 　设置每列的最大字符数。
-x 　此参数的效果和同时指定"-h"参数相同。

#### 查看GOT表：objdump
```objdump -g 文件名```
#### 下载远程目录中的程序：scp 

```scp -P 端口号 -p IP地址:路径/* ./```
#### 将文件内容作为输入并执行文件：cat payload文件 -| ./文件名

### Python基础
略

### gdb调试器
gdb是Linux下常用的一款命令行调试器，拥有十分强大的调试功能。

常用到的gdb命令如下：
- ```disas address``` ，对地址 address 处的指令进行反汇编，地址可以是函数名字。
- ```b *address``` ，对地址设置断点
- ```r``` ，运行被调试程序
- ```c``` ，让处于挂起的程序继续运行
- ```x``` address ，查看地址处存储的数据值
- ```ni``` ，执行 step over
- ```si``` ，执行 step in

我们经常会用到的gdb三个插件：peda，gef，pwndbg，但是这三个插件不能同时使用，如果三个都安装了，那么每次启动只能选择其中的一个。如果要使用另一个插件，就要手动修改一个gdb的初始化文件。

写一个选择插件的脚本：
```shell
#!/bin/bash
function Mode_change {
    name=$1
    gdbinitfile=~/.gdbinit    #这个路径按照你的实际情况修改
    # gdbinitfile=/root/Desktop/mode
    
    peda="source ~/peda/peda.py"   #这个路径按照你的实际情况修改
    gef="source ~/.gdbinit-gef.py"   #这个路径按照你的实际情况修改
    pwndbg="source /opt/pwndbg/gdbinit.py"   #这个路径按照你的实际情况修改
 
    sign=$(cat $gdbinitfile | grep -n "#this place is controled by user's shell")     
           #此处上面的查找内容要和你自己的保持一致
 
    pattern=":#this place is controled by user's shell"
    number=${sign%$pattern}
    location=$[number+2]
 
    parameter_add=${location}i
    parameter_del=${location}d
 
    message="TEST"
 
    if [ $name -eq "1" ];then
        sed -i "$parameter_del" $gdbinitfile
        sed -i "$parameter_add $peda" $gdbinitfile
        echo -e "Please enjoy the peda!\n"
    elif [ $name -eq "2" ];then
        sed -i "$parameter_del" $gdbinitfile
        sed -i "$parameter_add $gef" $gdbinitfile
        echo -e "Please enjoy the gef!\n"
    else
        sed -i "$parameter_del" $gdbinitfile
        sed -i "$parameter_add $pwndbg" $gdbinitfile
        echo -e "Please enjoy the pwndbg!\n"
    fi
    
}
 
echo -e "Please choose one mode of GDB?\n1.peda    2.gef    3.pwndbg"
 
read -p "Input your choice:" num
 
if [ $num -eq "1" ];then
    Mode_change $num
elif [ $num -eq "2" ];then
    Mode_change $num
elif [ $num -eq "3" ];then
    Mode_change $num
else
    echo -e "Error!\nPleasse input right number!"
fi
 
gdb $1 $2 $3 $4 $5 $6 $7 $8 $9
```

参考：https://blog.csdn.net/gatieme/article/details/63254211

### 汇编语言

略

### pwntools

pwntools 是一个CTF框架，用于开发渗透程序，使用python编写。

使用它恶意快速构建原型和开发，简单的编写渗透工具。

其中：
- pwn，是一个工具优化的ctf工具箱
- pwnlib，是一个常规的python库

一般kali中集成了此库。

文档参考：
- https://github.com/Gallopsled/pwntools-tutorial#readme
- https://docs.pwntools.com/en/latest/intro.html#tutorials

### 系统保护机制

操作系统提供了许多安全机制来尝试降低或阻止缓冲区溢出攻击带来的安全风险，包括DEP、ASLR等。在编写漏洞利用代码的时候，需要特别注意目标进程是否开启了DEP（Linux下对应NX）、ASLR（Linux下对应PIE）等机制，例如存在DEP（NX）的话就不能直接执行栈上的数据，存在ASLR的话各个系统调用的地址就是随机化的。

#### 检查方法

checksec是一个脚本软件，它是用来检查可执行文件属性，例如PIE, RELRO, PaX, Canaries, ASLR, Fortify Source等等属性。使用checksec既可以单独下载脚本，也可以使用gdb-peda插件中内嵌的命令。

源码参见：
- http://www.trapkit.de/tools/checksec.html
- https://github.com/slimm609/checksec.sh/

#### CANNARY(栈保护)
这个选项表示栈保护功能有没有开启。
栈溢出保护是一种缓冲区溢出攻击缓解手段，当函数存在缓冲区溢出攻击漏洞时，攻击者可以覆盖栈上的返回地址来让shellcode能够得到执行。当启用栈保护后，函数开始执行的时候会先往栈里插入cookie信息，当函数真正返回的时候会验证cookie信息是否合法，如果不合法就停止程序运行。攻击者在覆盖返回地址的时候往往也会将cookie信息给覆盖掉，导致栈保护检查失败而阻止shellcode的执行。在Linux中我们将cookie信息称为canary。
gcc在4.2版本中添加了-fstack-protector和-fstack-protector-all编译参数以支持栈保护功能，4.9新增了-fstack-protector-strong编译参数让保护的范围更广。
因此在编译时可以控制是否开启栈保护以及程度，例如：
- ```gcc -o test test.c ``` 默认情况下，不开启Canary保护
- ```gcc -fno-stack-protector -o test test.c``` 禁用栈保护
- ```gcc -fstack-protector -o test test.c``` 启用堆栈保护，不过只为局部变量中含有 char 数组的函数插入保护代码
- ```gcc -fstack-protector-all -o test test.c``` 启用堆栈保护，为所有函数插入保护代码

#### gdb的fortify检查

用于检查是否存在缓冲区溢出的错误。适用情形是程序采用大量的字符串或者内存操作函数，如memcpy，memset，stpcpy，strcpy，strncpy，strcat，strncat，sprintf，snprintf，vsprintf，vsnprintf，gets以及宽字符的变体。

_FORTIFY_SOURCE设为1，并且将编译器设置为优化1(gcc -O1)，以及出现上述情形，那么程序编译时就会进行检查但又不会改变程序功能

_FORTIFY_SOURCE设为2，有些检查功能会加入，但是这可能导致程序崩溃。

```gcc -D_FORTIFY_SOURCE=1``` 仅仅只会在编译时进行检查 (特别像某些头文件 #include <string.h>)

```gcc -D_FORTIFY_SOURCE=2 ```程序执行时也会有检查 (如果检查到缓冲区溢出，就终止程序)

#### DEP

NX即No-eXecute（不可执行）的意思，NX（DEP）的基本原理是将数据所在内存页标识为不可执行，当程序溢出成功转入shellcode时，程序会尝试在数据页面上执行指令，此时CPU就会抛出异常，而不是去执行恶意指令。

#### PIE（ASLR）
一般情况下NX（Windows平台上称其为DEP）和地址空间分布随机化（ASLR）会同时工作。

内存地址随机化机制（address space layout randomization)，有以下三种情况
- 0 - 表示关闭进程地址空间随机化。
- 1 - 表示将mmap的基址，stack和vdso页面随机化。
- 2 - 表示在1的基础上增加栈（heap）的随机化。

可以防范基于Ret2libc方式的针对DEP的攻击。ASLR和DEP配合使用，能有效阻止攻击者在堆栈上运行恶意代码。

Built as PIE：位置独立的可执行区域（position-independent executables）。这样使得在利用缓冲溢出和移动操作系统中存在的其他内存崩溃缺陷时采用面向返回的编程（return-oriented programming）方法变得难得多。

liunx下关闭PIE的命令如下：
```sudo -s echo 0 > /proc/sys/kernel/randomize_va_space```


gcc编译命令
- ```gcc -o test test.c``` // 默认情况下，不开启PIE
- ```gcc -fpie -pie -o test test.c``` // 开启PIE，此时强度为1
- ```gcc -fPIE -pie -o test test.c``` // 开启PIE，此时为最高强度2
- ```gcc -fpic -o test test.c``` // 开启PIC，此时强度为1，不会开启PIE
- ```gcc -fPIC -o test test.c``` // 开启PIC，此时为最高强度2，不会开启PIE.

PIE最早由RedHat的人实现，他在连接起上增加了-pie选项，这样使用-fPIE编译的对象就能通过连接器得到位置无关可执行程序。fPIE和fPIC有些不同。可以参考Gcc和Open64中的-fPIC选项.
gcc中的-fpic选项，使用于在目标机支持时，编译共享库时使用。编译出的代码将通过全局偏移表(Global Offset Table)中的常数地址访存，动态装载器将在程序开始执行时解析GOT表项(注意，动态装载器操作系统的一部分，连接器是GCC的一部分)。而gcc中的-fPIC选项则是针对某些特殊机型做了特殊处理，比如适合动态链接并能避免超出GOT大小限制之类的错误。而Open64仅仅支持不会导致GOT表溢出的PIC编译。
gcc中的-fpie和-fPIE选项和fpic及fPIC很相似，但不同的是，除了生成为位置无关代码外，还能假定代码是属于本程序。通常这些选项会和GCC链接时的-pie选项一起使用。fPIE选项仅能在编译可执行码时用，不能用于编译库。所以，如果想要PIE的程序，需要你除了在gcc增加-fPIE选项外，还需要在ld时增加-pie选项才能产生这种代码。即gcc -fpie -pie来编译程序。单独使用哪一个都无法达到效果。

#### RELRO
在Linux系统安全领域数据可以写的存储区就会是攻击的目标，尤其是存储函数指针的区域。 所以在安全防护的角度来说尽量减少可写的存储区域对安全会有极大的好处.

GCC, GNU linker以及Glibc-dynamic linker一起配合实现了一种叫做relro的技术: read only relocation。大概实现就是由linker指定binary的一块经过dynamic linker处理过 relocation之后的区域为只读.

设置符号重定向表格为只读或在程序启动时就解析并绑定所有动态符号，从而减少对GOT（Global Offset Table）攻击。RELRO为” Partial RELRO”，说明我们对GOT表具有写权限。
gcc编译：
```gcc -o test test.c``` // 默认情况下，是Partial RELRO

```gcc -z norelro -o test test.c``` // 关闭，即No RELRO

```gcc -z lazy -o test test.c``` // 部分开启，即Partial RELRO

```gcc -z now -o test test.c``` // 全部开启，即

#### 总结

各种安全选择的编译参数如下：
```NX：-z execstack / -z noexecstack (关闭 / 开启)```

```Canary：-fno-stack-protector /-fstack-protector / -fstack-protector-all (关闭 / 开启 / 全开启)```

```PIE：-no-pie / -pie (关闭 / 开启)```

```RELRO：-z norelro / -z lazy / -z now (关闭 / 部分开启 / 完全开启)```

