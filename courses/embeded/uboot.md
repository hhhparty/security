# U-Boot
## 电路板初始化流程
下面是为启动电路板的流程。它可以应用于 SPL 和U-Boot。SPL指的是第二个程序加载器。

在u-boot源代码包/arch/下，通常包含了面向架构的start.S文件。
例如：

- arch/arm/cpu/armv7/start.S
- arch/powerpc/cpu/mpc83xx/start.S
- arch/mips/cpu/start.S

执行这个文件将调用3个函数：
- lowlevel_init()
  - 目的：为执行到board_init()函数，而进行的必要的初始化
- board_init()
  - 目的：设置机器，准备执行board_init_r()函数
- board_init_r()
  - 目的：主要的执行和通用代码



## 下载和编译

### 下载：
git clone https://source.denx.de/u-boot/u-boot.git
或者
git clone https://github.com/u-boot/u-boot

git checkout v2020.10

### 编译：

#### 依赖安装

如果是给arm架构的处理器使用，那需要下载交叉编译的gcc

`sudo apt install gcc-arm-linux-gnueabi`

编译uboot依赖的库：

sudo apt-get install bc bison build-essential coccinelle \
  device-tree-compiler dfu-util efitools flex gdisk graphviz imagemagick \
  liblz4-tool libgnutls28-dev libguestfs-tools libncurses-dev \
  libpython3-dev libsdl2-dev libssl-dev lz4 lzma lzma-alone openssl \
  pkg-config python3 python3-asteval python3-coverage python3-filelock \
  python3-pkg-resources python3-pycryptodome python3-pyelftools \
  python3-pytest python3-pytest-xdist python3-sphinxcontrib.apidoc \
  python3-sphinx-rtd-theme python3-subunit python3-testtools \
  python3-virtualenv swig uuid-dev


如果有些板子要求先构建 arm trusted firmware，那么参考相应的 [board-specific doc](https://u-boot.readthedocs.io/en/latest/board/index.html)

#### 配置

在PC linux下为arm环境编译u-boot，需要先建立环境变量：CROSS_COMPILE

`export CROSS_COMPILE=arm-linux-gnueabi-`

u-boot不建议直接修改makefile和其他源文件，所以建立这个环境变量是官方推荐做法。

查看u-boot源码包目录下的configs/目录，里面包含了配置模版文件，命名规则：已维护的板子名称_deconfig。这些文件已经删掉了默认配置，所以你不能直接使用。生成对应的配置文件的方法是： make 板子名_defconfig

由于我们将在qemu 的vexpress-ca9下进行实验，所以可以考虑选择配置文件 vexpress_ca9x4_defconfig。

配置命令为`make vexpress_ca9x4_defconfig`，完成配置后，当然你也可以使用`make menuconfig`进行调整。 


默认情况下，构建过程在本地执行，目标文件会被存放在source目录下。

如果希望构建后的目标文件存放在指定目录下，可以设置参数O，例如：
```sh
export CROSS_COMPILE=arm-linux-gnueabi-
mkdir build
make O=/绝对路径/build distclean
make O=/绝对路径/build vexpress_ca9x4_defconfig

```

或者使用环境变量KBUILD_OUTPUT
```
export KBUILD_OUTPUT=/tmp/build
make distclean
make NAME_defconfig

```

还有些开发板的特定配置文件可能在供应商那里。另外还有些配置名称给出了更多细节，例如： TQM823L系统可带可不带有LCD支持，你可以在配置时进行选择，例如make TQM823L_defconfig 是不带LCD的，make TQM823L_LCD_defconfig 是带LCD支持的。

##### 没有预定义配置文件的情况
If the system board that you have is not listed, then you will need
to port U-Boot to your hardware platform. To do this, follow these
steps:

1.  Create a new directory to hold your board specific code. Add any
    files you need. In your board directory, you will need at least
    the "Makefile" and a "<board>.c".
2.  Create a new configuration file "include/configs/<board>.h" for
    your board.
3.  If you're porting U-Boot to a new CPU, then also create a new
    directory to hold your CPU specific code. Add any files you need.
4.  Run "make <board>_defconfig" with your new name.
5.  Type "make", and you should get a working "u-boot.srec" file
    to be installed on your target system.
6.  Debug and solve any problems that might arise.
    [Of course, this last step is much harder than it sounds.]

#### 构建
完成上面配置后，交叉编译前，确保设置环境变量。

`export CROSS_COMPILE=<compiler-prefix> make all`

编译参数可选：
- -j , 使用并行方式加速编译过程。 例如 -j$(nproc)
- O=dir ,生成所有的输出文件到某个目录下，包括 .config
- V=1,  详细模式


当完成make all 之后，会得到下列几个文件，这些文件应当存放在系统的根目录下：
- u-boot.bin 是一个raw 二进制镜像
- u-boot 是一个ELF二进制格式镜像
- u-boot.srec 是一个motorola S-Record 格式文件。

如果当前系统安装了qemu虚拟机，可以尝试运行。命令如下：` qemu-system-arm -M vexpress-a9 -m 512M -nographic -kernel u-boot` 

如果构建成功，就可以正常运行u-boot monitor命令了。

退出是按clt+a 然后再按x。



### 设备树编译
使用 CONFIG_OF_CONTROL 的板子，需要设备树编译器（dtc）。那些带有 CONFIG_PYLIBFDT 的需要 pylibfdt，一种python库，用于访问设备树数据。相应的版本被包含在 U-Boot 树中，在scripts/dtc 中。

为了使用这些系统版本，使用DTC参数，例如：DTC=/usr/bin/dtc make

In this case, dtc and pylibfdt are not built. The build checks that the version of dtc is new enough. It also makes sure that pylibfdt is present, if needed (see scripts_dtc in the Makefile).

Note that the Host tools are always built with the included version of libfdt so it is not possible to build U-Boot tools with a system libfdt, at present.


### link-time optimisation(LTO)

uboot 支持链接时优化
NO_LTO=1 make
### 安装
The process for installing U-Boot on the target device is device specific. Please, refer to the board specific documentation [Board-specific doc](https://u-boot.readthedocs.io/en/latest/board/index.html).


## 镜像格式
U-Boot能够启动的镜像格式有两种：
- 新uImage格式（FIT）：这个镜像格式给予Flattened Image Tree（FIT），类似扁平化的设备树。它允许带有多个组件（例如几个内核、ramdisks等等）的镜像。这些内容可以被SHA1 MD5 CRC32保护。
- 老uImage格式：老式镜像格式基于二进制文件，这个文件可以是任何东西，只要遵循一定的头部即可。具体可参考include/image.h，这个文件头定义了下列内容：
  - 目标OS
  - 目标CPU架构
  - 压缩类型
  - 加载地址
  - 入口点
  - 镜像名称
  - 镜像时间戳
  - 标记魔术字
  - CRC32 checksum值



## Linux 支持

尽管U-Boot 应当支持任何OS或独立应用，但它的主要目标总是基于Linux的。

U-Boot 包括很多功能特性，这些是Linux kernel中某些特定 boot loader 代码的一部分。此外，要使用的任何“initrd”映像都不再是一个大型Linux映像的一部分；相反，内核和“initrd”是独立的映像。此实现有几个目的：
- 同样的功能可被用于其他OS或单独的应用，例如使用压缩镜像可以减小flash内存的footprint
- 更容易移植到新linux内核版本，因为很多低级硬件相关代码由u-boot完成了。
- 同样的linux 内核镜像可使用不同的‘initrd’ 镜像。这就使测试更加容易了。

### 移植linux到基于u-boot的系统

U-Boot不能保存用于特定硬件的所有必要改动，也不能保存linux 设备驱动的配置。uboot不准备提供完整的linux虚拟机接口。

但是，你可以忽略所有的 boot loader 代码。

只需要确认你的面向机器的头文件（例如 include/asm-ppc/tqm8xx.h) 包含了Board Information 结构的相同定义

#### 配置linux内核
对于u-boot，这一步没有特殊要求，确保有目标系统的root设备即可（初始化的initial ramdisk，NFS）

#### 构建linux image
带U-Boot的镜像，通常的zImage或bzImage是不能使用的。如果使用最新的内核源码，可以使用uImage格式。许多老的内核可以使用pImage格式。

具体构建过程如下：
```
make xxx_defconfig
make oldconfig
make dep
make uImage
```

uImage 构建目标使用了一个特定工具（tools/mkimage）来包装带有头部信息和CRC32校验值的压缩linux内核镜像。

为使用u-boot，我们需要完成一下工作：
- 首先，构建一个标准的vmlinux 内核镜像（ELF 二进制格式）
- 转变该镜像为raw 二进制镜像
```
${CROSS_COMPILE}-objcopy -O binary \
				 -R .note -R .comment \
				 -S vmlinux linux.bin
```

- 压缩该镜像文件 `gzip -9 linux.bin`
- 为u-boot打包压缩镜像文件：
```
mkimage -A ppc -O linux -T kernel -C gzip \
		-a 0 -e 0 -n "Linux Kernel Image" \
		-d linux.bin.gz uImage
```

mkimage 也可以用于生成带uboot的ramdisk镜像，即可形成与linux内核独立的两部分，也可以合成一个文件。

mkimage会在原镜像基础上，增加一个64字节的头部，包含了目标架构信息、os、镜像类型、压缩方法等等。这个命令既可以用于查看已存在的uImage文件信息，也可以打包新的镜像。

`tools/mkimage -l image -l ==> list image header information`

还有一种替换形式构建镜像：
```
tools/mkimage -A arch -O os -T type -C comp -a addr -e ep \
		      -n name -d data_file image
```
说明：
	  -A ==> set architecture to 'arch'
	  -O ==> set operating system to 'os'
	  -T ==> set image type to 'type'
	  -C ==> set compression type 'comp'
	  -a ==> set load address to 'addr' (hex)
	  -e ==> set entry point to 'ep' (hex)
	  -n ==> set image name to 'name'
	  -d ==> use image data from 'datafile'

目前，所有的用于PowerPC的Linux 内核使用同样的加载地址（0x00000000），但是入口点地址对于不同的内核版本是不一样的：
- kernel 2.2.x 使用的入口点为 0x0000000C
- kernel 2.3.x 使用的入口点为 0x00000000

所以典型的构建一个U-Boot 镜像的调用如下：
```sh
tools/mkimage -n '2.4.4 kernel for TQM850L' \
-A ppc -O linux -T kernel -C gzip -a 0 -e 0 \
-d /opt/elsk/ppc_8xx/usr/src/linux-2.4.4/arch/powerpc/coffboot/vmlinux.gz \
examples/uImage.TQM850L
```
说明：
Image Name:   2.4.4 kernel for TQM850L
	Created:      Wed Jul 19 02:34:59 2000
	Image Type:   PowerPC Linux Kernel Image (gzip compressed)
	Data Size:    335725 Bytes = 327.86 kB = 0.32 MB
	Load Address: 0x00000000
	Entry Point:  0x00000000

为了验证镜像内容，可以使用下列命令
```
tools/mkimage -l examples/uImage.TQM850L
```

**注意：对于启动时间至关重要的嵌入式系统，您可以以速度换取内存，并安装一个未压缩的映像：这需要更多的Flash空间，但由于不需要解压缩，因此启动速度更快**

```
gunzip /opt/elsk/ppc_8xx/usr/src/linux-2.4.4/arch/powerpc/coffboot/vmlinux.gz

tools/mkimage -n '2.4.4 kernel for TQM850L' \
> -A ppc -O linux -T kernel -C none -a 0 -e 0 \
> -d /opt/elsk/ppc_8xx/usr/src/linux-2.4.4/arch/powerpc/coffboot/vmlinux \
> examples/uImage.TQM850L-uncompressed
```

类似地，当你的内核将用于一个初始化的ramdisk时，你可以构从ramdisk.image.gz文件建一个U-Boot镜像：
```
tools/mkimage -n 'Simple Ramdisk Image' \
	> -A ppc -O linux -T ramdisk -C gzip \
	> -d /LinuxPPC/images/SIMPLE-ramdisk.image.gz examples/simple-initrd
```
说明：
  Image Name:   Simple Ramdisk Image
	Created:      Wed Jan 12 14:01:50 2000
	Image Type:   PowerPC Linux RAMDisk Image (gzip compressed)
	Data Size:    566530 Bytes = 553.25 kB = 0.54 MB
	Load Address: 0x00000000
	Entry Point:  0x00000000

`dumpimage` 工具可以用于反汇编或列出被mkimage构建的镜像文件内容。

### 安装 linux 镜像

要通过串口接口下载一个U-boot镜像，你必须转换这个镜像为S-Record格式：
`objcopy -I binary -0 srec examples/image examples/image/srec`

由于objcopy命令不需要理解镜像内容，所以这个S-Record 文件是相对地址0x00000000的。为了把它加载到指定地址，你需要指定一个目标地址作为offset参数，例如：
```sh
# Example: install the image to address 0x40100000 (which on the TQM8xxL is in the first Flash bank):

=> erase 40100000 401FFFFF

.......... done
Erased 8 sectors

=> loads 40100000
## Ready for S-Record download ...
~>examples/image.srec
1 2 3 4 5 6 7 8 9 10 11 12 13 ...
...
15989 15990 15991 15992
[file transfer complete]
[connected]
## Start Addr = 0x00000000
```

你可使用`iminfo`命令检查是否下载成功，这包括了checksum验证。
```sh
=> imi 40100000

	## Checking Image at 40100000 ...
	   Image Name:	 2.2.13 for initrd on TQM850L
	   Image Type:	 PowerPC Linux Kernel Image (gzip compressed)
	   Data Size:	 335725 Bytes = 327 kB = 0 MB
	   Load Address: 00000000
	   Entry Point:	 0000000c
	   Verifying Checksum ... OK

```

### 启动 linux

`bootm`命令可用于启动一个存放在RAM或Flash中的应用。例如linux 内核镜像，bootargs环境变量的内容可以传递给内核作为参数。你可以检查和改变参数，使用`printev`和`setenv`命令。

```
=> printenv bootargs
	bootargs=root=/dev/ram

	=> setenv bootargs root=/dev/nfs rw nfsroot=10.0.0.2:/LinuxPPC nfsaddrs=10.0.0.99:10.0.0.2

	=> printenv bootargs
	bootargs=root=/dev/nfs rw nfsroot=10.0.0.2:/LinuxPPC nfsaddrs=10.0.0.99:10.0.0.2

	=> bootm 40020000
	## Booting Linux kernel at 40020000 ...
	   Image Name:	 2.2.13 for NFS on TQM850L
	   Image Type:	 PowerPC Linux Kernel Image (gzip compressed)
	   Data Size:	 381681 Bytes = 372 kB = 0 MB
	   Load Address: 00000000
	   Entry Point:	 0000000c
	   Verifying Checksum ... OK
	   Uncompressing Kernel Image ... OK
	Linux version 2.2.13 (wd@denx.local.net) (gcc version 2.95.2 19991024 (release)) #1 Wed Jul 19 02:35:17 MEST 2000
	Boot arguments: root=/dev/nfs rw nfsroot=10.0.0.2:/LinuxPPC nfsaddrs=10.0.0.99:10.0.0.2
	time_init: decrementer frequency = 187500000/60
	Calibrating delay loop... 49.77 BogoMIPS
	Memory: 15208k available (700k kernel code, 444k data, 32k init) [c0000000,c1000000]
	...
  ```

  如果你使用初始化ramdisk启动linux内核，你要传递内核和initrd镜像（PPBCOOT格式）内存地址给bootm命令。
  ```
=> imi 40100000 40200000

	## Checking Image at 40100000 ...
	   Image Name:	 2.2.13 for initrd on TQM850L
	   Image Type:	 PowerPC Linux Kernel Image (gzip compressed)
	   Data Size:	 335725 Bytes = 327 kB = 0 MB
	   Load Address: 00000000
	   Entry Point:	 0000000c
	   Verifying Checksum ... OK

	## Checking Image at 40200000 ...
	   Image Name:	 Simple Ramdisk Image
	   Image Type:	 PowerPC Linux RAMDisk Image (gzip compressed)
	   Data Size:	 566530 Bytes = 553 kB = 0 MB
	   Load Address: 00000000
	   Entry Point:	 00000000
	   Verifying Checksum ... OK

	=> bootm 40100000 40200000
	## Booting Linux kernel at 40100000 ...
	   Image Name:	 2.2.13 for initrd on TQM850L
	   Image Type:	 PowerPC Linux Kernel Image (gzip compressed)
	   Data Size:	 335725 Bytes = 327 kB = 0 MB
	   Load Address: 00000000
	   Entry Point:	 0000000c
	   Verifying Checksum ... OK
	   Uncompressing Kernel Image ... OK
	## Loading RAMDisk Image at 40200000 ...
	   Image Name:	 Simple Ramdisk Image
	   Image Type:	 PowerPC Linux RAMDisk Image (gzip compressed)
	   Data Size:	 566530 Bytes = 553 kB = 0 MB
	   Load Address: 00000000
	   Entry Point:	 00000000
	   Verifying Checksum ... OK
	   Loading Ramdisk ... OK
	Linux version 2.2.13 (wd@denx.local.net) (gcc version 2.95.2 19991024 (release)) #1 Wed Jul 19 02:32:08 MEST 2000
	Boot arguments: root=/dev/ram
	time_init: decrementer frequency = 187500000/60
	Calibrating delay loop... 49.77 BogoMIPS
	...
	RAMDISK: Compressed image found at block 0
	VFS: Mounted root (ext2 filesystem).

	bash#
  ```
### 启动linux 并传递一个flat设备树

首先，U-Boot必须使用合适的定义进行编译。查看https://github.com/u-boot/u-boot/README 的 Linux kernel Interface 章节了解细节。下面是一个例子，介绍了如何启动一个内核并传递更新的flat设备树：

```
=> print oftaddr
oftaddr=0x300000
=> print oft
oft=oftrees/mpc8540ads.dtb
=> tftp $oftaddr $oft
Speed: 1000, full duplex
Using TSEC0 device
TFTP from server 192.168.1.1; our IP address is 192.168.1.101
Filename 'oftrees/mpc8540ads.dtb'.
Load address: 0x300000
Loading: #
done
Bytes transferred = 4106 (100a hex)
=> tftp $loadaddr $bootfile
Speed: 1000, full duplex
Using TSEC0 device
TFTP from server 192.168.1.1; our IP address is 192.168.1.2
Filename 'uImage'.
Load address: 0x200000
Loading:############
done
Bytes transferred = 1029407 (fb51f hex)
=> print loadaddr
loadaddr=200000
=> print oftaddr
oftaddr=0x300000
=> bootm $loadaddr - $oftaddr
## Booting image at 00200000 ...
   Image Name:	 Linux-2.6.17-dirty
   Image Type:	 PowerPC Linux Kernel Image (gzip compressed)
   Data Size:	 1029343 Bytes = 1005.2 kB
   Load Address: 00000000
   Entry Point:	 00000000
   Verifying Checksum ... OK
   Uncompressing Kernel Image ... OK
Booting using flat device tree at 0x300000
Using MPC85xx ADS machine description
Memory CAM mapping: CAM0=256Mb, CAM1=256Mb, CAM2=0Mb residual: 0Mb
[snip]
```
## U-Boot Monitor 命令

go	- start application at address 'addr'
run	- run commands in an environment variable
bootm	- boot application image from memory
bootp	- boot image via network using BootP/TFTP protocol
bootz   - boot zImage from memory
tftpboot- boot image via network using TFTP protocol
	       and env variables "ipaddr" and "serverip"
	       (and eventually "gatewayip")
tftpput - upload a file via network using TFTP protocol
rarpboot- boot image via network using RARP/TFTP protocol
diskboot- boot from IDE devicebootd   - boot default, i.e., run 'bootcmd'
loads	- load S-Record file over serial line
loadb	- load binary file over serial line (kermit mode)
loadm   - load binary blob from source address to destination address
md	- memory display
mm	- memory modify (auto-incrementing)
nm	- memory modify (constant address)
mw	- memory write (fill)
ms	- memory search
cp	- memory copy
cmp	- memory compare
crc32	- checksum calculation
i2c	- I2C sub-system
sspi	- SPI utility commands
base	- print or set address offset
printenv- print environment variables
pwm	- control pwm channels
setenv	- set environment variables
saveenv - save environment variables to persistent storage
protect - enable or disable FLASH write protection
erase	- erase FLASH memory
flinfo	- print FLASH memory information
nand	- NAND memory operations (see doc/README.nand)
bdinfo	- print Board Info structure
iminfo	- print header information for application image
coninfo - print console devices and informations
ide	- IDE sub-system
loop	- infinite loop on address range
loopw	- infinite write loop on address range
mtest	- simple RAM test
icache	- enable or disable instruction cache
dcache	- enable or disable data cache
reset	- Perform RESET of the CPU
echo	- echo args to console
version - print monitor version
help	- print online help
?	- alias for 'help'


## References
- https://github.com/u-boot/u-boot/README
- https://u-boot.readthedocs.io/en/latest/build/gcc.html