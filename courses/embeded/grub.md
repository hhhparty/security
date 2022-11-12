# GRUB2
> source : [GNU GRUB Manual 2.06](https://www.gnu.org/software/grub/manual/grub/html_node/index.html)

GRUB 是一种多系统引导管理器，可以引导linux、windows。

## What is Grub？

作为系统引导管理器，他是计算机启动后运行的第一个程序，负责加载、传输控制到OS core，直到完成core的加载。后续过程会交给os core来完成，例如系统初始化等等。

X86架构下，Grub和LILO等都是系统引导管理器，windows还有 NTLoader。PowerPC架构下，常见的为 Yaboot等。

Grub的特点在于它是一个多重OS启动管理器，由GRandUnified Bootloader 派生而来，最初有Erich Stefan Boleyn设计。

主流Linux发行版Fedora、Redhat、Centos等基于RPM包的系统默认使用了GRUB，Debian使用GRUB、Slackware等使用LILO。从趋势上看，GRUB有取代LILO的可能。

GRUB有LInux版本和windows版本。

## 命名约定
`(fd0)` 括号内为设备名称，fd表示floppy disk，0 表示驱动号，这个表达式表示了grub要使用整个floppy disk。

`(hd0,msdos2)` hd意味着hard disk drive，0表示drive号，第一块硬盘；msdos表示分区模式，2表示分区号。分区号从1开始计数，不是从0。这个表达式表示第1块硬盘的第二个分区。这里grub使用了磁盘的一个分区，而不是整个磁盘。

`(hd1,msdos1,bsd1)` bsd a 分区在第2块磁盘的第一个pc slice上。

当然，使用GRUB真实访问磁盘或分区时，需要使用设备特定的命令，类似`set root=(fd0)` 或 `parttool (hd0,msdos3) hidden-` 为了帮助你查找哪个数字指示这你希望的分区，grub command-line 选项有参数自动扩展。例如，你仅需要写 `set root=(` 然后按TAB，grub就会显示磁盘、分区或文件的名字。

注意grub不区分IDE 和 SCSI，他们都是从0开始计数，不涉及磁盘类型。通常，任何IDE drive 号是小于任一个SCSI硬盘号，尽管这也不一定。

如何指定一个文件？
`(hd0,msdos1)/vmlinuz` 表示了文件名为vmlinuz
## 安装GRUB

### 安装软件包
Fedora：`rpm -ivh grub*.rpm`

slackware:`installpkg grub*.tgz`

源码安装：
```sh
tar -zxvf grub*.tar.gz
cd grub-xxx
./configure
make
make install
# 测试安装成功
grub
grub-install
```
### 配置中的安装
grub-install 命令是将之前安装的软件包内的文件放到/boot/grub中，这是一个必要的环节。换句话说，在完成grub软件包安装之后，进入到了grub配置，配置中也要进行一些安装。

首先查看磁盘（标识），例如是/dev/hda or /dev/hdb等等。
`fdisk -l`

一般有/dev/hda的对hda操作，安装命令如下： `grub-install /dev/hda` 之后会进入`(fd0) /dev/fd0` 等等。

值得注意的是，如果有一个/boot分区，应该用下列方法安装：
`grub-install --root-directory=//boot /dev/hda` 

### 设定GRUB的/boot分区并写入MBR（主启动记录）。

仅完成grub软件包安装、配置grub到/boot还不够，还要把grub写入mbr。如果没有这一步，启动可能重写mbr，安装及配置就无效了。所以这一步也很关键。

```sh
#进入grub命令行
[root@localhost ~]# grub
grub> 
#查找/boot/grub/stage1
grub>find /boot/grub/stage1
(hd0,6)

grub>root (hd0,6)
# 把grub 写到mbr上
grub>setup(hd0)
```
说明：hd0表示磁盘0；fd0表示软驱

### grub 配置文件的menu.lst写法

不配置menu.lst就只能使用命令行引导os启动。配置后可以选择启动。

menu.lst 位于/boot/grub目录中，即/boot/grub/menu.lst文件，如果没有可以新建一个，之后再将该文件的软连接 `ln -s menu.lst grub.conf` 

