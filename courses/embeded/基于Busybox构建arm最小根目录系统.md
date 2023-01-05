# 基于 BusyBox 构建最小RootFS for arm

Busybox是一个通用UNIX工具的剪切版本，可用于生成最小的可执行环境。它适合与资源约束型设备。

## Prerequites

安装下面的前置依赖：
- apt-get install gcc-arm-linux-gnueabi
- apt-get install libncurses5-dev
- apt-get install gawk

## BusyBox
BusyBox 可以构建为两种形式：
- 一个单一的静态二进制文件，不需要外部库；
- 也可以构建为一个借助外部共享库的形式，例如GLIBC等等。这个设置可以在BusyBox Settings->Build Options-> Build BusyBox as a static binary(no shared libs)。

如果是选择第二种，那么在运行借助glibc的一些应用时就比较方便。

下面是常见的下载、安装、配置命令：

wget https://busybox.net/downloads/busybox-1.32.1.tar.bz2
tar -xjf busybox-1.32.1.tar.bz2
cd busybox-1.32.1/
make ARCH=arm CROSS_COMPILE=arm-linux-gnueabi- defconfig
make ARCH=arm CROSS_COMPILE=arm-linux-gnueabi- menuconfig

完成上面的配置后，我们可以编译和安装：
```sh
make ARCH=arm CROSS_COMPILE=arm-linux-gnueabi- 
make ARCH=arm CROSS_COMPILE=arm-linux-gnueabi- install CONFIG_PREFIX=/home/export/rootfs
```
## GLIBC
GLIBC 是[GNU C library ](http://www.gnu.org/software/libc/libc.html) 并且包含了常用的系统调用，是系统中可执行程序需要使用的必要内容。

下载、构建和安装glibc的命令如下：
```sh
wget http://ftp.gnu.org/gnu/libc/glibc-2.33.tar.xz
tar -xJf glibc-2.33.tar.xz
mkdir glibc-build
cd glibc-build/
../glibc-2.33/configure arm-linux-gnueabi --build=i686-pc-linux-gnu CXX=arm-linux-gnueabi-g++ --prefix= --enable-add-ons
make
make install install_root=/home/export/rootfs 
```

有些程序可能要求 libgcc_s.so，否则你会看到一些error：

error while loading shared libraries: libgcc_s.so.1: cannot open shared object file: No such file or directory 

libgcc_s.so.1 可以从你的arm-linux-gnueabi 安装中拷贝得来：

`cp /usr/lib/gcc-cross/arm-linux-gnueabi/4.7.3/libgcc_s.so.1 /home/export/rootfs/lib `

## 准备 RootFS

BusyBox和GLIBC完成交叉编译后，下面来生成 Root 文件系统的其余部分。
- 首先生成必要的根目录，例如

`mkdir proc sys dev etc/init.d usr/lib`

- 然后，使用mount /proc /sys 文件系统生成 /dev节点。这些可以在运行时，通过所谓的 /etc/init.d/rcS 来实现。在这个文件中加入下列内容：

```
#!bin/sh
mount -t proc none /proc
mount -t sysfs none /sys
echo /sbin/mdev > /proc/sys/kernel/hotplug
/sbin/mdev -s
```

之后，修改 etc/init.d/rcS的权限为可执行：`chmod +x etc/init.d/rcS`

现在，我们有了一个基本的busybox root 文件系统。

## DropBear （可选）

DropBear是一个小型的ssh server 和 client。

下载、构建、安装命令如下：
```
wget https://matt.ucc.asn.au/dropbear/releases/dropbear-2020.81.tar.bz2
tar -xjf dropbear-2020.81.tar.bz2
cd dropbear-2020.81
./configure --host=arm-linux-gnueabi --prefix=/ --disable-zlib CC=arm-linux-gnueabi-gcc LD=arm-linux-gnueabi-ld
make
make install DESTDIR=/home/export/rootfs
```

DropBear 要求RSA和DSS（数据签名标准）加密密钥来生成加密链接。通常可以在目标系统里完成，如果在host中有Dropbearkey的可执行程序，也可以在host中生成。

为生成你的keys，执行下列命令
```sh
mkdir /etc/dropbear
dropbearkey -t dss -f /etc/dropbear/dropbear_dss_host_key  
dropbearkey -t rsa -f /etc/dropbear/dropbear_rsa_host_key 
```
你可以要求用户名和口令来验证登陆凭据：

```
touch /etc/passwd
touch /etc/group
adduser root -u 0
```

除非有特别指定，root作为默认 /home/root为工作目录。然而它是不存在的，所以dorpbear将在登录成功后关闭连接。为了改变这个问题，可以在home目录下增加root子目录。

现在dropbear可以启动运行：dropbear

也就是说你可以远程登录你的ARM目标系统了。


如果你在登录后看到错误，例如“Server refused to allocate pty” check you have Device Drivers > Character devices > Legacy (BSD) PTY support enabled in your kernel. (Especially applicable to Beaglebone kernels)

或者，检查你是否已经mouted 了 /dev/pts文件系统（在mounted /dev 之后）

mkdir /dev/pts
mount -t devpts none /dev/pts

## openssh
由于dropbear安装没能成功，所以考虑使用openssh。

配合openssh的有三个内容：
- [zlib](http://www.zlib.net/)
- [openssl](http://www.openssl.org/source)
- [openssh](http://www.openssh.com/portable.html)

### zlib 安装

从[zlib](http://www.zlib.net/)下载相应版本，这里选择了 zlib-1.2.13.tar.gz。
```
# 建立存放目标文件的目录
mkdir -p arm/{install,source,share}
# 解压
tar -xvf zlib-1.2.13.tar.gz

cd zlib-1.2.13
# 清理环境
make clean all   
# 设置环境变量
export AR=arm-linux-gnueabi-ar            
export CC=arm-linux-gnueabi-gcc

# 配置
./configure --prefix=/home/leo/Downloads/arm/install/zlib --shared
# 编译
make ARCH=arm CROSS_COMPILE=arm-linux-gnueabi-     
# 安装
make ARCH=arm CROSS_COMPILE=arm-linux-gnueabi- install 
```
### openssl
不同版本的openssl编译时有所不同，1.1版本未能正确配置，故改用1.0.2

```
wget http://artfiles.org/openssl.org/source/old/1.0.2/openssl-1.0.2u.tar.gz
tar -xf openssl-1.0.2u.tar.gz
cd openssl-1.0.2u
make clean

# 配置
./Configure --prefix=/home/leo/Downloads/arm/install/openssl os/compiler:arm-linux-gnueabi- -fPIC no-asm shared
# 
make CROSS_COMPILE=arm-linux-gnueabi- ARCH=arm

make CROSS_COMPILE=arm-linux-gnueabi- ARCH=arm install
```
### openssh

```
wget https://mirrors.aliyun.com/pub/OpenBSD/OpenSSH/portable/openssh-8.2p1.tar.gz
tar xvf openssh-8.2p1.tar.gz 
cd openssh-8.2p1 
make clean

# 配置
./configure --host=arm-linux --with-libs --with-zlib=../arm/install/zlib --with-ssl-dir=../arm/install/openssl --disable-etc-default-login CC=arm-linux-gnueabi-gcc AR=arm-linux-gnueabi-ar 
# 编译
make CC=arm-linux-gnueabi-gcc AR=arm-linux-gnueabi-ar 

```


## ldconfig

ldconfig 用于配置动态链接器运行时绑定。它生成符号链接和一个对最近使用共享库的cache。当你构建了root文件系统并增加额外的共享库时，你需要运行ldconfig。

ldconfig 将在信任的目录下（/lib）搜索共项库。额外的搜索路径可以通过在ld.so.conf配置文件中增加。ldconfig 查找在 /etc/ld.so.conf文件中的配置文件，并当不能找到这个文件时生成一个warning文件。

解决这个warning 并扩展search范围的方法是包含 /usr/lib目录:
`echo /usr/lib > etc/ld.so.conf`

ldconfig 还将在 /etc/ld.so.cache 中生成cache。如果这个文件不存在，那么将自动生成。

最后，更新动态链接运行时绑定，执行下列命令：
`ldconfig -v`
-v 表示显示详细信息。

## 只读文件系统

如果将root文件系统建立在flash内存上，为了提高使用寿命，可能需要将rootfs安装为只读，或者将尽可能多的频繁写入文件（例如/var）移动到存储在RAM中的临时易失性文件系统。

下列是一个扩展的etc/init.d/rcS 文件：


```
#!bin/sh
mount -t proc none /proc
mount -t sysfs none /sys
mount -t tmpfs none /var
mount -t tmpfs none /dev
mkdir /dev/pts
mount -t devpts none /dev/pts
echo /sbin/mdev > /proc/sys/kernel/hotplug
/sbin/mdev -s
mkdir /var/log
syslogd
dropbear
```

syslogd 会写系统消息到 /var/log/messages 并且时一些你可能不想经常性的写到flash中的内容。在mounting /var 作为一个临时文件系统后，我们可以为syslogd 生成 /var/log 目录，用来存储这些消息。

## 启动arm开发板或arm虚拟机后的操作

下面操作假设已经正常启动arm开发板或qemu-arm虚拟机。

操作目标板:
确保目标板有以下目录，如果没有则新建：
/usr/local/bin
/usr/local/etc
/usr/local/libexec
/var/run
/var/empty/sshd

chown -R root.root /var/empty/sshd
chmod 744 /var/empty/sshd

将 openssh 目录下文件拷贝到开发板系统中，具体为：
scp、sftp、ssh 、ssh-add、ssh-agent、ssh-keygen、ssh-keyscan 共7个文件拷贝到开发板 /usr/local/bin
moduli、ssh_config、sshd_config 共3个文件拷贝到开发板 /usr/local/etc
sftp-server、ssh-keysign 共2个文件拷贝到开发板 /usr/local/libexec
sshd 拷贝到 /usr/sbin
chmod 777 /usr/sbin/sshd
libz.so.1.2.11 拷贝到开发板 /lib (必须放在/lib下，不然scp会找不到这个库)
然后建立软链接：
ln -s libz.so.1.2.11 libz.so.1

建立目录/etc/ssh/
生成key文件：
ssh-keygen -t rsa -f /etc/ssh/ssh_host_rsa_key -N ""
ssh-keygen -t dsa -f /etc/ssh/ssh_host_dsa_key -N ""
ssh-keygen -t ecdsa -f /etc/ssh/ssh_host_ecdsa_key -N ""
将生成的 ssh_host_rsa_key 、 ssh_host_dsa_key 和 ssh_host_ecdsa_key 拷贝到 /usr/local/etc
chmod 600 ssh_host_*
#如果开发板需要 ssh_host_key 的话，执行：
#ssh-keygen -t rsa1 -f /etc/ssh/ssh_host_key -N ""
## references
- 文本格式匹配修改工具 [gawk](https://www.gnu.org/software/gawk/)
- https://wiki.beyondlogic.org/index.php?title=Cross_Compiling_BusyBox_for_ARM
- [opessh交叉编译](https://www.cnblogs.com/klcf0220/p/15099171.html)