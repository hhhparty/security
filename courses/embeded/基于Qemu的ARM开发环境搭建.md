# 基于QEMU的ARM 汇编编程环境搭建


- 安装编译工具
- 使用qemu模拟arm架构处理器

## QEMU 对arm的支持
QEMU 是一种通用、开源的机器模拟器和虚拟化工具。QEMU可以被用于各种用途，最常见的用途是“系统模拟”，它提供了一个对完整机器（CPU、Mem、模拟设备）的虚拟化模型，来运行guest OS。在这个模式下，CPU功能可以完全被模拟，或者它可以与类似 KVM、Xen、Hax 或Hypervisor等虚拟机一起工作。Qemu框架允许客户os直接运行在host cpu上。第二种使用方式，是使用QEMU作为 “用户模式模拟”，这时QEMU可以运行为某类CPU编译的程序，而这个程序可以在另一类CPU下编译。在第二种模式下，CPU是被模拟出来的。

- System emualtion
- User mode emulation

QEMU 提供了一些独立的命令行工具，例如：qemu-img 磁盘镜像工具，可以用来生成、转化和修改磁盘镜像文件。

目前QEMU支持的构建平台（OS）有：
- 支持的host 架构
- linux，mac，freebsd，netbsd，openbsd 等os
- windows os

### System emulation
这种情况是用qemu完成全系统模拟（相对于 user mode emulation），这里包括了与hypervisors的协同，例如KVM、Xen等

[详情参考](https://www.qemu.org/docs/master/system/index.html)

首先需要安装qemu-system-xxx架构，例如：
```
sudo apt install qemu-system-arm
sudo apt install qemu-system-x86-64
```

之后，如果已经准备好了镜像文件，例如linux.img
```
qemu-system-x86_64 linux.img
```
Linux系统就会启动运行。事实上，用户应该知道，上面的示例消除了使用x86_64特定默认值设置VM的复杂性，并假设第一个非交换机参数是带有引导扇区的PC兼容磁盘映像。对于非x86系统，我们模拟了广泛的机器类型，命令行通常在定义机器和引导行为时更加明确。您将在手册的QEMU System Emulator Targets部分找到更多示例命令行。

### 开发板支持

QEMU 构建了两类型的ARM Versatile Express 开发板家族：
- vexpress-a9，包括了Versatile Express motherboard 和coreTile Express A9x4 子板
- vexpress-a15，包括了Versatile Express motherboard 和coreTile Express A15x2 子板


更多查看 https://www.qemu.org/docs/master/system/arm/vexpress.html

为了使用qemu构建arm虚拟机，需要安装qemu-system-arm

```
sudo apt install qemu-system-arm


```

## 安装交叉编译工具
由于之后的OS系统和应用软件都是在ARM架构下执行，所以需要使用这一工具将各种软件的源代码编译链接为ARM指令二进制文件。

安装交叉编译工具，用于编译内核和待开发的应用程序源代码。

`sudo apt install gcc-arm-linux-gnueabi`

gcc-arm-linux-gnueabi 是面向arm架构的、linux下运行的、遵循嵌入式应用程序二进制接口的gnu编译工具。

安装好之后使用`dpkg -l gcc-arm-linux-gnueabi`验证一下。

默认的安装路径是在/usr/arm-linux-gnueabi  里面有三个子目录：
- bin
- include
- lib



后续的编译过程中，需要设置的环境变量通常有：
- ARCH=arm
- CROSS_COMPILE=arm-linux-gnueabi-
- GCC=arm-linux-gnueabi-gcc
- AR=arm-linux-gnueabi-ar

## 编译arm虚拟机所用的linux kernel
- 首先从 https://www.kernel.org/ 下载linux 内核，具体版本视个人需要。

例如：
```sh
wget https://cdn.kernel.org/pub/linux/kernel/v5.x/linux-5.4.224.tar.xz
xz -d linux-5.4.224.tar.xz
tar -xf llinux-5.4.224.tar
cd linux-5.4.224

#之后还可以安装一些库
sudo apt install fakeroot build-essential ncurses-dev xz-utils libssl-dev bc flex libelf-dev bison

```

- 之后，编译内核需要有配置文件，很多早期编译内核的文章建议从当前linux系统中拷贝一个出来做待编译。例如：
```
cp /boot/config-5.3.0-28-generic .config
```
但是这似乎不是最好的选择。qemu提供了vexpress支持，所以可以使用vexpress配置，命令如下：

```sh
cd linux-5.4.224
# 下面这一步非常重要，设定了当前交叉编译器、目标代码架构、内置的示例配置文件。不知道怎么裁剪内核的就用这个vexpress_defconfig。
make CROSS_COMPILE=arm-linux-gnueabi- ARCH=arm vexpress_defconfig
# 成功运行后，会在当前目录下出现 .config 文件
less .config
# 内容很多

```

对于初学者，建议使用`make CROSS_COMPILE=arm-linux-gnueabi- ARCH=arm vexpress_defconfig` 后续步骤也就省略了。

- 第三步（可选）使用menuconfig 进行内核裁剪。

`make menuconfig` 

不清楚怎么裁剪，就参考第二步的推荐。

- 第四步 编译内核

`make CROSS_COMPILE=arm-linux-gnueabi- ARCH=arm`

之后会有很多选择，可以按需要也可以按默认一路回车。最后得到内核文件在 arch/arm/boot/zImage。Qemu启动时需要这个文件。

如果没有执行步骤三，就参考第二步的推荐生成.config文件，之后再执行本步骤。

编译之后

- 第五步 编译设备树文件dts为dtb，执行下面两条命令：



`make CROSS_COMPILE=arm-linux-gnueabi- ARCH=arm defconfig`
`make CROSS_COMPILE=arm-linux-gnueabi- ARCH=arm  dtbs`

到这时，我们可以测试一下qemu加载内核的效果如何？运行下列命令：
没有安装qemu-system-arm的话，就使用 `apt install -y qemu-system-arm` 安装


` qemu-system-arm -M vexpress-a9 -m 512M -kernel ~/Downloads/linux-5.4.224/arch/arm/boot/zImage -dtb ~/Downloads/linux-5.4.224/arch/arm/boot/dts/vexpress-v2p-ca9.dtb -nographic -append "console=ttyAMA0"`

结果如下：
```sh
~/Downloads/linux-5.4.224$ qemu-system-arm -M vexpress-a9 -m 512M -kernel ~/Downloads/linux-5.4.224/arch/arm/boot/zImage -dtb ~/Downloads/linux-5.4.224/arch/arm/boot/dts/vexpress-v2p-ca9.dtb -nographic -append "console=ttyAMA0"

pulseaudio: set_sink_input_volume() failed
pulseaudio: Reason: Invalid argument
pulseaudio: set_sink_input_mute() failed
pulseaudio: Reason: Invalid argument

# 内核启动...
Booting Linux on physical CPU 0x0
Linux version 5.4.224 (leo@ubuntu) (gcc version 7.5.0 (Ubuntu/Linaro 7.5.0-3ubuntu1~18.04)) #1 SMP Fri Nov 11 06:38:01 PST 2022
# CPU 架构
CPU: ARMv7 Processor [410fc090] revision 0 (ARMv7), cr=10c5387d
CPU: PIPT / VIPT nonaliasing data cache, VIPT nonaliasing instruction cache
# CPU model 是ARM-Versatile Express-ca9
OF: fdt: Machine model: V2P-CA9
Memory policy: Data cache writeback
# DMA 内存地址 0x4c000000 8M
Reserved memory: created DMA memory pool at 0x4c000000, size 8 MiB
OF: reserved mem: initialized node vram@4c000000, compatible id shared-dma-pool

cma: Reserved 16 MiB at 0x7f000000
# 系统重启时，ARM架构CPU处于SVC（supervisor）mode下
# SVC mode：重启或当一个Supervisor Call 指令（SVC）被执行时的模式
CPU: All CPU(s) started in SVC mode.
percpu: Embedded 19 pages/cpu s45644 r8192 d23988 u77824
Built 1 zonelists, mobility grouping on.  Total pages: 130048
Kernel command line: console=ttyAMA0
printk: log_buf_len individual max cpu contribution: 4096 bytes
printk: log_buf_len total cpu_extra contributions: 12288 bytes
printk: log_buf_len min size: 16384 bytes
printk: log_buf_len: 32768 bytes
printk: early log buf free: 14876(90%)
Dentry cache hash table entries: 65536 (order: 6, 262144 bytes, linear)
Inode-cache hash table entries: 32768 (order: 5, 131072 bytes, linear)
mem auto-init: stack:off, heap alloc:off, heap free:off
Memory: 492104K/524288K available (7168K kernel code, 424K rwdata, 1716K rodata, 1024K init, 160K bss, 15800K reserved, 16384K cma-reserved)
SLUB: HWalign=64, Order=0-3, MinObjects=0, CPUs=4, Nodes=1
rcu: Hierarchical RCU implementation.
rcu: 	RCU event tracing is enabled.
rcu: 	RCU restricting CPUs from NR_CPUS=8 to nr_cpu_ids=4.
rcu: RCU calculated value of scheduler-enlistment delay is 10 jiffies.
rcu: Adjusting geometry for rcu_fanout_leaf=16, nr_cpu_ids=4
NR_IRQS: 16, nr_irqs: 16, preallocated irqs: 16
GIC CPU mask not found - kernel will fail to boot.
GIC CPU mask not found - kernel will fail to boot.
L2C: platform modifies aux control register: 0x02020000 -> 0x02420000
L2C: DT/platform modifies aux control register: 0x02020000 -> 0x02420000
L2C-310 enabling early BRESP for Cortex-A9
L2C-310 full line of zeros enabled for Cortex-A9
L2C-310 dynamic clock gating disabled, standby mode disabled
L2C-310 cache controller enabled, 8 ways, 128 kB
L2C-310: CACHE_ID 0x410000c8, AUX_CTRL 0x46420001
sched_clock: 32 bits at 24MHz, resolution 41ns, wraps every 89478484971ns
clocksource: arm,sp804: mask: 0xffffffff max_cycles: 0xffffffff, max_idle_ns: 1911260446275 ns
smp_twd: clock not found -2
Console: colour dummy device 80x30
Calibrating local timer... 94.34MHz.
Calibrating delay loop... 603.34 BogoMIPS (lpj=3016704)
pid_max: default: 32768 minimum: 301
Mount-cache hash table entries: 1024 (order: 0, 4096 bytes, linear)
Mountpoint-cache hash table entries: 1024 (order: 0, 4096 bytes, linear)
CPU: Testing write buffer coherency: ok
CPU0: Spectre v2: using BPIALL workaround
CPU0: thread -1, cpu 0, socket 0, mpidr 80000000
Setting up static identity map for 0x60100000 - 0x60100060
rcu: Hierarchical SRCU implementation.
smp: Bringing up secondary CPUs ...
smp: Brought up 1 node, 1 CPU
SMP: Total of 1 processors activated (603.34 BogoMIPS).
CPU: All CPU(s) started in SVC mode.
devtmpfs: initialized
VFP support v0.3: implementor 41 architecture 3 part 30 variant 9 rev 0
clocksource: jiffies: mask: 0xffffffff max_cycles: 0xffffffff, max_idle_ns: 19112604462750000 ns
futex hash table entries: 1024 (order: 4, 65536 bytes, linear)
NET: Registered protocol family 16
DMA: preallocated 256 KiB pool for atomic coherent allocations
cpuidle: using governor ladder
hw-breakpoint: debug architecture 0x4 unsupported.
Serial: AMBA PL011 UART driver
10009000.uart: ttyAMA0 at MMIO 0x10009000 (irq = 29, base_baud = 0) is a PL011 rev1
printk: console [ttyAMA0] enabled
1000a000.uart: ttyAMA1 at MMIO 0x1000a000 (irq = 30, base_baud = 0) is a PL011 rev1
1000b000.uart: ttyAMA2 at MMIO 0x1000b000 (irq = 31, base_baud = 0) is a PL011 rev1
1000c000.uart: ttyAMA3 at MMIO 0x1000c000 (irq = 32, base_baud = 0) is a PL011 rev1
OF: amba_device_add() failed (-19) for /smb@4000000/motherboard/iofpga@7,00000000/wdt@f000
OF: amba_device_add() failed (-19) for /memory-controller@100e0000
OF: amba_device_add() failed (-19) for /memory-controller@100e1000
OF: amba_device_add() failed (-19) for /watchdog@100e5000
irq: type mismatch, failed to map hwirq-75 for interrupt-controller@1e001000!
SCSI subsystem initialized
usbcore: registered new interface driver usbfs
usbcore: registered new interface driver hub
usbcore: registered new device driver usb
Advanced Linux Sound Architecture Driver Initialized.
clocksource: Switched to clocksource arm,sp804
NET: Registered protocol family 2
IP idents hash table entries: 8192 (order: 4, 65536 bytes, linear)
tcp_listen_portaddr_hash hash table entries: 512 (order: 0, 6144 bytes, linear)
TCP established hash table entries: 4096 (order: 2, 16384 bytes, linear)
TCP bind hash table entries: 4096 (order: 3, 32768 bytes, linear)
TCP: Hash tables configured (established 4096 bind 4096)
UDP hash table entries: 256 (order: 1, 8192 bytes, linear)
UDP-Lite hash table entries: 256 (order: 1, 8192 bytes, linear)
NET: Registered protocol family 1
RPC: Registered named UNIX socket transport module.
RPC: Registered udp transport module.
RPC: Registered tcp transport module.
RPC: Registered tcp NFSv4.1 backchannel transport module.
hw perfevents: enabled with armv7_cortex_a9 PMU driver, 1 counters available
workingset: timestamp_bits=30 max_order=17 bucket_order=0
squashfs: version 4.0 (2009/01/31) Phillip Lougher
jffs2: version 2.2. (NAND) © 2001-2006 Red Hat, Inc.
9p: Installing v9fs 9p2000 file system support
io scheduler mq-deadline registered
io scheduler kyber registered
drm-clcd-pl111 1001f000.clcd: assigned reserved memory node vram@4c000000
drm-clcd-pl111 1001f000.clcd: using device-specific reserved memory
drm-clcd-pl111 1001f000.clcd: initializing Versatile Express PL111
drm-clcd-pl111 1001f000.clcd: core tile graphics present
drm-clcd-pl111 1001f000.clcd: this device will be deactivated
Error: Driver 'vexpress-muxfpga' is already registered, aborting...
drm-clcd-pl111 10020000.clcd: initializing Versatile Express PL111
drm-clcd-pl111 10020000.clcd: DVI muxed to daughterboard 1 (core tile) CLCD
physmap-flash 40000000.flash: physmap platform flash device: [mem 0x40000000-0x43ffffff]
40000000.flash: Found 2 x16 devices at 0x0 in 32-bit bank. Manufacturer ID 0x000000 Chip ID 0x000000
Intel/Sharp Extended Query Table at 0x0031
Using buffer write method
physmap-flash 40000000.flash: physmap platform flash device: [mem 0x44000000-0x47ffffff]
40000000.flash: Found 2 x16 devices at 0x0 in 32-bit bank. Manufacturer ID 0x000000 Chip ID 0x000000
Intel/Sharp Extended Query Table at 0x0031
Using buffer write method
Concatenating MTD devices:
(0): "40000000.flash"
(1): "40000000.flash"
into device "40000000.flash"
physmap-flash 48000000.psram: physmap platform flash device: [mem 0x48000000-0x49ffffff]
smsc911x 4e000000.ethernet eth0: MAC Address: 52:54:00:12:34:56
isp1760 4f000000.usb: bus width: 32, oc: digital
isp1760 4f000000.usb: NXP ISP1760 USB Host Controller
isp1760 4f000000.usb: new USB bus registered, assigned bus number 1
isp1760 4f000000.usb: Scratch test failed.
isp1760 4f000000.usb: can't setup: -19
isp1760 4f000000.usb: USB bus 1 deregistered
usbcore: registered new interface driver usb-storage
rtc-pl031 10017000.rtc: registered as rtc0
mmci-pl18x 10005000.mmci: Got CD GPIO
mmci-pl18x 10005000.mmci: Got WP GPIO
mmci-pl18x 10005000.mmci: mmc0: PL181 manf 41 rev0 at 0x10005000 irq 25,26 (pio)
ledtrig-cpu: registered to indicate activity on CPUs
usbcore: registered new interface driver usbhid
usbhid: USB HID core driver
input: AT Raw Set 2 keyboard as /devices/platform/smb@4000000/smb@4000000:motherboard/smb@4000000:motherboard:iofpga@7,00000000/10006000.kmi/serio0/input/input0
aaci-pl041 10004000.aaci: ARM AC'97 Interface PL041 rev0 at 0x10004000, irq 24
aaci-pl041 10004000.aaci: FIFO 512 entries
oprofile: using arm/armv7-ca9
NET: Registered protocol family 17
9pnet: Installing 9P2000 support
Registering SWP/SWPB emulation handler
Error: Driver 'vexpress-muxfpga' is already registered, aborting...
drm-clcd-pl111 10020000.clcd: initializing Versatile Express PL111
drm-clcd-pl111 10020000.clcd: DVI muxed to daughterboard 1 (core tile) CLCD
Error: Driver 'vexpress-muxfpga' is already registered, aborting...
drm-clcd-pl111 10020000.clcd: initializing Versatile Express PL111
drm-clcd-pl111 10020000.clcd: DVI muxed to daughterboard 1 (core tile) CLCD
rtc-pl031 10017000.rtc: setting system clock to 2022-11-11T14:57:33 UTC (1668178653)
ALSA device list:
  #0: ARM AC'97 Interface PL041 rev0 at 0x10004000, irq 24
input: ImExPS/2 Generic Explorer Mouse as /devices/platform/smb@4000000/smb@4000000:motherboard/smb@4000000:motherboard:iofpga@7,00000000/10007000.kmi/serio1/input/input2
VFS: Cannot open root device "(null)" or unknown-block(0,0): error -6
Please append a correct "root=" boot option; here are the available partitions:
1f00          131072 mtdblock0 
 (driver?)
1f01           32768 mtdblock1 
 (driver?)
# 没发现根目录，所以报错了 
Kernel panic - not syncing: VFS: Unable to mount root fs on unknown-block(0,0)
CPU: 0 PID: 1 Comm: swapper/0 Not tainted 5.4.224 #1
Hardware name: ARM-Versatile Express
[<80110b48>] (unwind_backtrace) from [<8010c498>] (show_stack+0x10/0x14)
[<8010c498>] (show_stack) from [<80790b5c>] (dump_stack+0x94/0xa8)
[<80790b5c>] (dump_stack) from [<8078be7c>] (panic+0x110/0x310)
[<8078be7c>] (panic) from [<80a01704>] (mount_block_root+0x1e8/0x2d4)
[<80a01704>] (mount_block_root) from [<80a01934>] (mount_root+0x144/0x160)
[<80a01934>] (mount_root) from [<80a01aa0>] (prepare_namespace+0x150/0x198)
[<80a01aa0>] (prepare_namespace) from [<80790c44>] (kernel_init+0x8/0x114)
[<80790c44>] (kernel_init) from [<801010e8>] (ret_from_fork+0x14/0x2c)
Exception stack(0x9e493fb0 to 0x9e493ff8)
3fa0:                                     00000000 00000000 00000000 00000000
3fc0: 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000
3fe0: 00000000 00000000 00000000 00000000 00000013 00000000
---[ end Kernel panic - not syncing: VFS: Unable to mount root fs on unknown-block(0,0) ]---

```
上面因为没发现根目录，所以无法继续运行。


## 制作根文件系统

构建根文件系统的工具有若干，例如：
- busybox
- buildroot
- yocto

以Busybox 为例，它整合了许多通用UNIX 工具到单个小型可执行文件中。它为常用命令提供了最小的替代。这个系统在编译时，通常要进行配置，与内核编译配置类似。


内核启动后的最后一步是挂载根文件系统，然后执行文件系统里的指定程序，例如/etc/rc.local

如果没有文件系统，内核启动到最后就提示 ： panic....

方法如下：
- 下载busybox：https://www.busybox.net/

### Building busybox from source

```sh
tar -jxvf busybox-1.20.0.tar.bz2

cd busybox-1.20.0
# config busybox 注意一定要使用交叉编译工具 并且指定架构为arm
busybox-1.20.0$ make ARCH=arm CROSS_COMPILE=arm-linux-gnueabi- menuconfig
# 部分配置项说明（综合几篇介绍文章和实践，保持原默认即可）：
# 1. General Configuration —— Don't use /usr   选中，否则会覆盖/usr
# 2. Build Options —— Build BusyBox as a static binary(no shared libs) 选中。
# 3. Build Options —— Build with Large File Support 选中
# 4. Build Options —— Cross Compiler prefix 设置前面安装的交叉编译工具名称："arm-linux-gnueabi-"
# 5. Installation Options —— 设置make install 命令后的安装目标地址，可设置为 ./_install

busybox-1.20.0$ make ARCH=arm CROSS_COMPILE=arm-linux-gnueabi- 
# 常见错误很多，通常可以在 busybox-1.20.0/include/libbb.h 中加入 “#include <sys/resource.h>” 后可修复。
# 在 busybox 1.35 这些升级版本中就没有这项的缺失了。
# 成功后会生成可执行文件 busybox

# 设置了安装前缀后再执行
busybox-1.20.0$ make ARCH=arm CROSS_COMPILE=arm-linux-gnueabi- install
```
出现下面的样子表示成功:

```sh
--------------------------------------------------
You will probably need to make your busybox binary
setuid root to ensure all configured applets will
work properly.
--------------------------------------------------
```

查看_install 下目录：
```sh
~/Downloads/busybox-1.20.0$ ls _install/
bin  linuxrc  sbin  usr
# 在_install下创建全套的根目录结构
mkdir dev etc lib var proc tmp home root mnt sys
# 生成etc配置文件(busybox 有example/bootfloppy/etc/)
~/Downloads/busybox-1.20.0$ cp -rf examples/bootfloppy/etc/* _install/etc/
# 检查一下
ls _install/etc/init.d/rcS
_install/etc/init.d/rcS # 有就对了。

# 查看etc/inittab内容，描述了init进程如何被启动
less etc/inittab
::sysinit:/etc/init.d/rcS
::respawn:-/bin/sh #如果这里加上 -f root 则自动登录
tty2::askfirst:-/bin/sh
::ctrlaltdel:/bin/umount -a -r
```

init始终是内核启动的第一个用户态进程（其PID始终为1），它的正确位置（对Linux系统来说）是/sbin/init.如果内核找不到init，它就会试着运行/bin/sh，如果运行失败，系统的启动也会失败。

inittab 是被SYSTEM V 用来配置linux 初始化过程的文件。它定义了init进程的三种项目：
- the default runlevel
- what processes to start, monitor, and restart if they terminate
- what actions to take when the system enters a new runlevel


### 设置根目录
```sh
# 创建rootfs根目录
mkdir rootfs
# 把busybox-1.20.2中的文件复制到rootfs根目录下，主要是一些基本的命令
cp busybox-1.20/_install/*  -r rootfs/

# 把交叉编译工具链中的库文件复制到rootfs根目录的lib文件夹下
sudo cp -P /usr/arm-linux-gnueabi/lib/* rootfs/lib/
```
#### 制作根文件系统镜像
根文件系统镜像就相当于一个硬盘，就是把上面rootfs根目录中的所有文件复制到这个硬盘中。

安装qemu 
`sudo apt install qemu-system-arm` 

生成512M大小的磁盘镜像（生成一个全是0的数据文件）:
`qemu-img create -f raw disk.img 512M`

把硬盘镜像格式化为ext4文件系统
`mkfs -t ext4 ./disk.img`

将rootfs 根目录中的所有文件复制到磁盘镜像中，步骤有：
- 创建挂载点
- 挂载
- 复制文件
- 卸载。
```sh
mkdir tmpfs 
sudo mount -o loop ./disk.img tmpfs/  
sudo cp -r rootfs/* tmpfs/
sudo umount tmpfs
```

使用 `file disk.img` 检查。

## 利用 QEMU 启动 ARM 虚拟机

之前编译内核时，如果没有对kernel中的设备树进行编译，所以需要下面的步骤：
```sh
cd linux-5.4.224/
export ARCH=arm
export CROSS_COMPILE=arm-linux-gnueabi-
make defconfig
make dtbs # 或具体编译某个 make freescale/fsl-ls1046a-rdb.dtb
```

启动虚拟机
```sh
qemu-system-arm -M vexpress-a9 -m 512M -kernel ./linux-5.4.224/arch/arm/boot/zImage -dtb ./linux-5.4.224/arch/arm/boot/dts/vexpress-v2p-ca9.dtb -nographic -append "root=/dev/mmcblk0 rw console=ttyAMA0" -sd disk.img
```
说明
- -M vexpress-a9	模拟vexpress-a9板，可以使用-M ?参数来查询qemu支持的所有单板
- -m 512M	单板物理内存512M
- -kernel	~/qemu/zImage	指定内和镜像及路径
- -dtb ~/qemu/vexpress-v2p-ca9.dtb	指定单板的设备树文件
- -nographic	不使用图形界面，使用串口
- -append "console=ttyAMA0"	指定内核启动参数，串口设备使用ttyAMA0
- ttyAMA0是ARM体系结构上第一个串行端口的设备。如果您有一个带有串行控制台且运行Android或OpenELEC的基于ARM的电视盒，则可以使用ttyAMAn将控制台连接到它。

如果系统持续出现:can't open /dev/tty2: No such file or directory
can't open /dev/tty2: No such file or directory的报错，那么在命令行中输入 `mknod dev/null c 1 3` 即便被不断输出的内容截断也继续输入，指导输完此命令执行后，通常就会消失。或者可能需要执行 `chmod 777 /etc/init.d/rcS` 

### 编写helloworld并放到image中
```
mkdir -p ~/workspace/arm_hello
cd ~/workspace/arm_hello
vi helloworld.c

```
键入如下helloworld代码：

```c
#include <stdio.h> 
int main() 
{     
    printf("HelloWorld! \n");
    return 0; 
}
```
将这个源代码编译为arm下二进制可执行文件

`arm-linux-gnueabi-gcc helloworld.c -o hello`

查看：
`file hello`

确认为arm二进制后，通过kill命令停止之前启动qemu虚拟机

下面把 hello 拷贝到image文件中

```sh
sudo mount -o loop ./disk.img tmpfs/  
cp hello tmpfs/ 
sudo umount tmpfs

```

之后，再次启动虚拟机并执行hello程序。

```sh
 qemu-system-arm -M vexpress-a9 -m 512M -kernel ./linux-5.4.224/arch/arm/boot/zImage -dtb ./linux-5.4.224/arch/arm/boot/dts/vexpress-v2p-ca9.dtb -nographic -append "root=/dev/mmcblk0 rw console=ttyAMA0" -sd disk.img
WARNING: Image format was not specified for 'disk.img' and probing guessed raw.
         Automatically detecting the format is dangerous for raw images, write operations on block 0 will be restricted.
         Specify the 'raw' format explicitly to remove the restrictions.
pulseaudio: set_sink_input_volume() failed
pulseaudio: Reason: Invalid argument
pulseaudio: set_sink_input_mute() failed
pulseaudio: Reason: Invalid argument
Booting Linux on physical CPU 0x0
Linux version 5.4.224 (leo@ubuntu) (gcc version 7.5.0 (Ubuntu/Linaro 7.5.0-3ubuntu1~18.04)) #1 SMP Fri Nov 11 06:38:01 PST 2022
CPU: ARMv7 Processor [410fc090] revision 0 (ARMv7), cr=10c5387d
CPU: PIPT / VIPT nonaliasing data cache, VIPT nonaliasing instruction cache
OF: fdt: Machine model: V2P-CA9
Memory policy: Data cache writeback
Reserved memory: created DMA memory pool at 0x4c000000, size 8 MiB
OF: reserved mem: initialized node vram@4c000000, compatible id shared-dma-pool
cma: Reserved 16 MiB at 0x7f000000
CPU: All CPU(s) started in SVC mode.
percpu: Embedded 19 pages/cpu s45644 r8192 d23988 u77824
Built 1 zonelists, mobility grouping on.  Total pages: 130048
Kernel command line: root=/dev/mmcblk0 rw console=ttyAMA0
printk: log_buf_len individual max cpu contribution: 4096 bytes
printk: log_buf_len total cpu_extra contributions: 12288 bytes
printk: log_buf_len min size: 16384 bytes
printk: log_buf_len: 32768 bytes
printk: early log buf free: 14852(90%)
Dentry cache hash table entries: 65536 (order: 6, 262144 bytes, linear)
Inode-cache hash table entries: 32768 (order: 5, 131072 bytes, linear)
mem auto-init: stack:off, heap alloc:off, heap free:off
Memory: 492104K/524288K available (7168K kernel code, 424K rwdata, 1716K rodata, 1024K init, 160K bss, 15800K reserved, 16384K cma-reserved)
SLUB: HWalign=64, Order=0-3, MinObjects=0, CPUs=4, Nodes=1
rcu: Hierarchical RCU implementation.
rcu: 	RCU event tracing is enabled.
rcu: 	RCU restricting CPUs from NR_CPUS=8 to nr_cpu_ids=4.
rcu: RCU calculated value of scheduler-enlistment delay is 10 jiffies.
rcu: Adjusting geometry for rcu_fanout_leaf=16, nr_cpu_ids=4
NR_IRQS: 16, nr_irqs: 16, preallocated irqs: 16
GIC CPU mask not found - kernel will fail to boot.
GIC CPU mask not found - kernel will fail to boot.
L2C: platform modifies aux control register: 0x02020000 -> 0x02420000
L2C: DT/platform modifies aux control register: 0x02020000 -> 0x02420000
L2C-310 enabling early BRESP for Cortex-A9
L2C-310 full line of zeros enabled for Cortex-A9
L2C-310 dynamic clock gating disabled, standby mode disabled
L2C-310 cache controller enabled, 8 ways, 128 kB
L2C-310: CACHE_ID 0x410000c8, AUX_CTRL 0x46420001
sched_clock: 32 bits at 24MHz, resolution 41ns, wraps every 89478484971ns
clocksource: arm,sp804: mask: 0xffffffff max_cycles: 0xffffffff, max_idle_ns: 1911260446275 ns
smp_twd: clock not found -2
Console: colour dummy device 80x30
Calibrating local timer... 94.13MHz.
Calibrating delay loop... 534.52 BogoMIPS (lpj=2672640)
pid_max: default: 32768 minimum: 301
Mount-cache hash table entries: 1024 (order: 0, 4096 bytes, linear)
Mountpoint-cache hash table entries: 1024 (order: 0, 4096 bytes, linear)
CPU: Testing write buffer coherency: ok
CPU0: Spectre v2: using BPIALL workaround
CPU0: thread -1, cpu 0, socket 0, mpidr 80000000
Setting up static identity map for 0x60100000 - 0x60100060
rcu: Hierarchical SRCU implementation.
smp: Bringing up secondary CPUs ...
smp: Brought up 1 node, 1 CPU
SMP: Total of 1 processors activated (534.52 BogoMIPS).
CPU: All CPU(s) started in SVC mode.
devtmpfs: initialized
VFP support v0.3: implementor 41 architecture 3 part 30 variant 9 rev 0
clocksource: jiffies: mask: 0xffffffff max_cycles: 0xffffffff, max_idle_ns: 19112604462750000 ns
futex hash table entries: 1024 (order: 4, 65536 bytes, linear)
NET: Registered protocol family 16
DMA: preallocated 256 KiB pool for atomic coherent allocations
cpuidle: using governor ladder
hw-breakpoint: debug architecture 0x4 unsupported.
Serial: AMBA PL011 UART driver
10009000.uart: ttyAMA0 at MMIO 0x10009000 (irq = 29, base_baud = 0) is a PL011 rev1
printk: console [ttyAMA0] enabled
1000a000.uart: ttyAMA1 at MMIO 0x1000a000 (irq = 30, base_baud = 0) is a PL011 rev1
1000b000.uart: ttyAMA2 at MMIO 0x1000b000 (irq = 31, base_baud = 0) is a PL011 rev1
1000c000.uart: ttyAMA3 at MMIO 0x1000c000 (irq = 32, base_baud = 0) is a PL011 rev1
OF: amba_device_add() failed (-19) for /smb@4000000/motherboard/iofpga@7,00000000/wdt@f000
OF: amba_device_add() failed (-19) for /memory-controller@100e0000
OF: amba_device_add() failed (-19) for /memory-controller@100e1000
OF: amba_device_add() failed (-19) for /watchdog@100e5000
irq: type mismatch, failed to map hwirq-75 for interrupt-controller@1e001000!
SCSI subsystem initialized
usbcore: registered new interface driver usbfs
usbcore: registered new interface driver hub
usbcore: registered new device driver usb
Advanced Linux Sound Architecture Driver Initialized.
clocksource: Switched to clocksource arm,sp804
NET: Registered protocol family 2
IP idents hash table entries: 8192 (order: 4, 65536 bytes, linear)
tcp_listen_portaddr_hash hash table entries: 512 (order: 0, 6144 bytes, linear)
TCP established hash table entries: 4096 (order: 2, 16384 bytes, linear)
TCP bind hash table entries: 4096 (order: 3, 32768 bytes, linear)
TCP: Hash tables configured (established 4096 bind 4096)
UDP hash table entries: 256 (order: 1, 8192 bytes, linear)
UDP-Lite hash table entries: 256 (order: 1, 8192 bytes, linear)
NET: Registered protocol family 1
RPC: Registered named UNIX socket transport module.
RPC: Registered udp transport module.
RPC: Registered tcp transport module.
RPC: Registered tcp NFSv4.1 backchannel transport module.
hw perfevents: enabled with armv7_cortex_a9 PMU driver, 1 counters available
workingset: timestamp_bits=30 max_order=17 bucket_order=0
squashfs: version 4.0 (2009/01/31) Phillip Lougher
jffs2: version 2.2. (NAND) © 2001-2006 Red Hat, Inc.
9p: Installing v9fs 9p2000 file system support
io scheduler mq-deadline registered
io scheduler kyber registered
drm-clcd-pl111 1001f000.clcd: assigned reserved memory node vram@4c000000
drm-clcd-pl111 1001f000.clcd: using device-specific reserved memory
drm-clcd-pl111 1001f000.clcd: initializing Versatile Express PL111
drm-clcd-pl111 1001f000.clcd: core tile graphics present
drm-clcd-pl111 1001f000.clcd: this device will be deactivated
Error: Driver 'vexpress-muxfpga' is already registered, aborting...
drm-clcd-pl111 10020000.clcd: initializing Versatile Express PL111
drm-clcd-pl111 10020000.clcd: DVI muxed to daughterboard 1 (core tile) CLCD
physmap-flash 40000000.flash: physmap platform flash device: [mem 0x40000000-0x43ffffff]
40000000.flash: Found 2 x16 devices at 0x0 in 32-bit bank. Manufacturer ID 0x000000 Chip ID 0x000000
Intel/Sharp Extended Query Table at 0x0031
Using buffer write method
physmap-flash 40000000.flash: physmap platform flash device: [mem 0x44000000-0x47ffffff]
40000000.flash: Found 2 x16 devices at 0x0 in 32-bit bank. Manufacturer ID 0x000000 Chip ID 0x000000
Intel/Sharp Extended Query Table at 0x0031
Using buffer write method
Concatenating MTD devices:
(0): "40000000.flash"
(1): "40000000.flash"
into device "40000000.flash"
physmap-flash 48000000.psram: physmap platform flash device: [mem 0x48000000-0x49ffffff]
smsc911x 4e000000.ethernet eth0: MAC Address: 52:54:00:12:34:56
isp1760 4f000000.usb: bus width: 32, oc: digital
isp1760 4f000000.usb: NXP ISP1760 USB Host Controller
isp1760 4f000000.usb: new USB bus registered, assigned bus number 1
isp1760 4f000000.usb: Scratch test failed.
isp1760 4f000000.usb: can't setup: -19
isp1760 4f000000.usb: USB bus 1 deregistered
usbcore: registered new interface driver usb-storage
rtc-pl031 10017000.rtc: registered as rtc0
mmci-pl18x 10005000.mmci: Got CD GPIO
mmci-pl18x 10005000.mmci: Got WP GPIO
mmci-pl18x 10005000.mmci: mmc0: PL181 manf 41 rev0 at 0x10005000 irq 25,26 (pio)
ledtrig-cpu: registered to indicate activity on CPUs
usbcore: registered new interface driver usbhid
usbhid: USB HID core driver
input: AT Raw Set 2 keyboard as /devices/platform/smb@4000000/smb@4000000:motherboard/smb@4000000:motherboard:iofpga@7,00000000/10006000.kmi/serio0/input/input0
aaci-pl041 10004000.aaci: ARM AC'97 Interface PL041 rev0 at 0x10004000, irq 24
aaci-pl041 10004000.aaci: FIFO 512 entries
oprofile: using arm/armv7-ca9
NET: Registered protocol family 17
9pnet: Installing 9P2000 support
Registering SWP/SWPB emulation handler
mmc0: new SD card at address 4567
mmcblk0: mmc0:4567 QEMU! 512 MiB 
Error: Driver 'vexpress-muxfpga' is already registered, aborting...
drm-clcd-pl111 10020000.clcd: initializing Versatile Express PL111
drm-clcd-pl111 10020000.clcd: DVI muxed to daughterboard 1 (core tile) CLCD
Error: Driver 'vexpress-muxfpga' is already registered, aborting...
drm-clcd-pl111 10020000.clcd: initializing Versatile Express PL111
drm-clcd-pl111 10020000.clcd: DVI muxed to daughterboard 1 (core tile) CLCD
Error: Driver 'vexpress-muxfpga' is already registered, aborting...
drm-clcd-pl111 10020000.clcd: initializing Versatile Express PL111
drm-clcd-pl111 10020000.clcd: DVI muxed to daughterboard 1 (core tile) CLCD
rtc-pl031 10017000.rtc: setting system clock to 2022-11-11T16:40:34 UTC (1668184834)
ALSA device list:
  #0: ARM AC'97 Interface PL041 rev0 at 0x10004000, irq 24
input: ImExPS/2 Generic Explorer Mouse as /devices/platform/smb@4000000/smb@4000000:motherboard/smb@4000000:motherboard:iofpga@7,00000000/10007000.kmi/serio1/input/input2
Error: Driver 'vexpress-muxfpga' is already registered, aborting...
drm-clcd-pl111 10020000.clcd: initializing Versatile Express PL111
drm-clcd-pl111 10020000.clcd: DVI muxed to daughterboard 1 (core tile) CLCD
EXT4-fs (mmcblk0): mounted filesystem with ordered data mode. Opts: (null)
VFS: Mounted root (ext4 filesystem) on device 179:0.
Freeing unused kernel memory: 1024K
Run /sbin/init as init process
random: crng init done

Processing /etc/profile... Done

/ # ls
bin         helloworld  linuxrc     proc        sys         var
dev         home        lost+found  root        tmp
etc         lib         mnt         sbin        usr
/ # ./helloworld 
HelloWorld! 
/ # 

```

### bugfix

#### No user exists for uid 0
执行whoami 或其他需要用户权限的操作，系统反馈No user exists for uid 0。

如果出现标题所列问题，首先检查虚拟机中 /etc/passwd 是否存在，不存在创建文件，并键入内容:

```
vi /etc/passwd
# 键入如下内容
root:x:0:0:root:/root:/bin/sh
```

#### 如果系统持续出现:can't open /dev/tty2: No such file or directory
can't open /dev/tty2: No such file or directory的报错，那么在命令行中输入 `mknod dev/null c 1 3` 即便被不断输出的内容截断也继续输入，指导输完此命令执行后，通常就会消失。或者可能需要执行 `chmod 777 /etc/init.d/rcS` 


## 从源码编译qemu


```sh
wget https://download.qemu.org/qemu-7.2.0-rc0.tar.xz
tar xvJf qemu-7.2.0-rc0.tar.xz
cd qemu-7.2.0-rc0
./configure
make

```


## references
- [qemu official docs](https://www.qemu.org/docs/master/system/quickstart.html)
- [一步步教你：如何用Qemu来模拟ARM系统](https://zhuanlan.zhihu.com/p/340362172)
- [busybox getting started](https://busybox.net/FAQ.html#getting_started)
- [How to use busybox in linux](https://linuxhandbook.com/what-is-busybox/)
- [如何在 Linux 上使用 BusyBox](https://zhuanlan.zhihu.com/p/416119146)
- [BusyBox构建根文件系统](https://www.linuxidc.com/Linux/2015-08/121320.htm)
- [can't open /dev/tty2: No such file or directory](https://zhuanlan.zhihu.com/p/146462768#:~:text=can%27t%20open%20%2Fdev%2Ftty2%3A%20No%20such,file%20or%20directory%20%E5%90%AF%E5%8A%A8%E5%90%8E%E5%A6%82%E6%9E%9C%E9%81%87%E5%88%B0%E8%BF%99%E4%B8%AA%E9%94%99%E8%AF%AF%EF%BC%8C%E6%98%AF%E7%94%B1%E4%BA%8E%2Fdev%2F%E4%B8%8B%E6%B2%A1%E6%9C%89tty2%2F3%2F4%E5%AF%BC%E8%87%B4%E7%9A%84%E3%80%82%20%E8%A7%A3%E5%86%B3%E6%96%B9%E6%B3%95%E6%98%AF%E5%88%9B%E5%BB%BA%2Fdev%2Fnull%EF%BC%8C%E5%B9%B6%E5%B0%86tty2%2F3%2F4%E6%8C%87%E5%90%91Null%E3%80%82)
- https://blog.csdn.net/glorin/article/details/6423456
- [编译busybox，动态链接与静态链接的选择](https://blog.csdn.net/newnewman80/article/details/7971317)
- [用BusyBox制作Linux最小系统](https://www.cnblogs.com/wchonline/p/11417666.html)
- [Arm Versatile Express boards ](https://qemu.readthedocs.io/en/latest/system/arm/vexpress.html)


- https://blog.csdn.net/wxh0000mm/article/details/108234270
- https://blog.csdn.net/wxh0000mm/article/details/108234539
- https://so.csdn.net/so/search?q=qemu&t=blog&u=wxh0000mm