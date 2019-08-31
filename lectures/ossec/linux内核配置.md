# Linux 内核配置

## 引言

多数情况下，普通用户不必编译和配置内核。

安装更新只需要通过：apt、yum等工具即可完成。

但没有一个Linux发行套件能够提供完全符合用户要求的Linux内核，所以针对不同计算机的特殊需求，重新配置和编译内核就在所难免。

但如果你想拥有自己的、精简的、安全加固的内核，那么就需要配置和编译内核了。

我们学习这部分知识的目的是：理解内核配置，深入认知Linux系统的安全策略。



## 创建 USB 启动盘

下面我们尝试建立一个Linux USB启动盘，最小启动盘大小位10MB。

这个USB的文件系统格式为 ext2、ext3或vfat。

### 具体操作

要创建ubuntu server USB启动盘，我们需要执行如下命令：


1.查看usb盘是否能被发现。运行下列命令：
```sudo fdisk -l```

![fdisk](images/lab02/fdisk.png)

从上图可知，设备/dev/sdb即为usb盘，而我们要使用的分区是/dev/sdb1。

2.格式化U盘。

由于启动盘需要为ext2/3或vfat格式，所以建议使用diskgenius windows下工具对u盘进行格式化。

diskgenius下载地址：http://www.diskgenius.cn/download.php

使用方法很简单，但操作前必须谨慎。

在linux下可以运行下列命令：
```sudo mkfs -t ext3 /dev/sdb1```

注意，如果是虚拟机中运行，上述过程可能会失败。

3.安装syslinux
```sudo apt install syslinux```

> syslinux是一个功能强大的引导加载程序，而且兼容各种介质。它的目的是简化首次安装Linux的时间，并建立修护或其它特殊用途的启动盘。它的安装很简单，一旦安装syslinux好之后，sysLinux启动盘就可以引导各种基于DOS的工具，以及MS-DOS/Windows或者任何其它操作系统。不仅支持采用BIOS结构的主板，而且从6.0版也开始支持采用EFI结构的新型主板。

4.首先，执行下述命令在USB存储设备上安装syslinux的启动引导程序 ：
```syslinux /dev/sdb1 ```

5.现在，分别为boot.iso文件和USB存储设备创建挂载点：
```mkdir /mnt/isoboot /mnt/diskboot ```
1. 下一步，把boot.iso文件挂载到为它创建的挂载点上：
```mount –o loop boot.iso /mnt/isoboot ```
其中，“-o loop”选项用于创建一个伪设备，使其像块设备一样工作。该命令可以将文件视为块设备。
4. 接下来，将USB存储设备挂载到为它创建的挂载点上：
```mount /dev/sdb1 /mnt/diskboot ```
5. boot.iso和USB存储设备挂载成功之后，将isolinux中的所有文件从boot.iso复制到USB存储设备上：
```cp /mnt/isoboot/isolinux/* /mnt/diskboot ```
6. 接下来，运行如下命令，将boot.iso中的isolinux.cfg文件拷贝为USB存储设备上的syslinux.cfg文件：
```grep –v local /mnt/isoboot/isolinux/isolinux.cfg > /mnt/diskboot/syslinux.cfg ```
7. 完成上述命令后，卸载boot.iso和 USB存储设备：
```umount /mnt/isoboot /mnt/diskboot ```
8. 现在，重新启动系统。尝试使用USB启动盘，以验证它能否用来启动系统。


## 下载、编译内核

1.获取linux内核，并解压。

有多种方法：
- 从 https://www.kernel.org/ 下载
- 针对不同的 Linux 发行版，从其源代码树上下载针对性的内核。


我们已经将linux-5.2.11下载到leo用户下的Downloads中，名为linux-5.2.11.tar.xz。

使用下列命令解压：
```
tar -xvf linux-5.2.11.tar.xz
```

2.安装编译工具:
- build-essential , 编译基础包
- gcc ，编译器
- libncurses5-dev ，ncurses开发包
- binutils-multiarch
- alien , Program that converts between rpm, dpkg, slp, and tgz file formats.
- ncurses-dev ,GNU Ncurses 是一个允许用户编写基于文本的用户界面（TUI）的编程库。许多基于文本的游戏都是使用这个库创建的。 
- flex ,快速 lexical 分析器
- bison , 包括 bison 和 yacc 这两个程序，用于GNU编译工具包的语法生成，以一系列规则, 分析文本文件结构，这个库通常没有什么用处，但是POSIX 需要它。

执行下列命令：
```
sudo apt install build-essential gcc libncurses5-dev alien ncurses-dev flex
```
安装过程中，需要两次确认回车。

3.进入linux-5.2.11目录
```cd ~\Downloads\linux-5.2.11```

4.运行下列命令，准备配置Linux内核。
```make menuconfig```

会弹出下列窗口:

![makemenuconfig](images/lab02/makemenuconfig.png)

可以根据提示进行适当的配置（增选、减选），然后保存。