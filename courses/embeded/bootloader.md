# Bootloader

Bootloader 是在将 OS core 加载到内存并启动其运行的引导代码。

Monitor 比 Bootloader 的功能更多一些，兼有调试等功能。

主要功能：
- 初始化硬件设备
- 监理内存空间mapping
- 读取并导入 OS core 到内存
- 调用 OS core 第一行代码


常见嵌入式系统中，系统加电后，CPU会读取地址0x0处指令，这个地方通常存放了 Bootloader的第一条指令，由此启动。

Bootloader的执行分为2～3个阶段：
- stage1 
	- 基本硬件的初始化，包括设置CPU工作频率、时钟频率，屏蔽所有中断和清除指令和数据缓存；
	- 为加载stage2而准备RAM空间；
	- 将stage2从固态存储（flash）拷贝到ram；
	- 设置堆栈指针 sp，这主要是为常见的C函数调用做准备；
	- 跳转到stage2入口点。
- stage2
	- 初始化本阶段使用的硬件设备，最主要的是系统时钟和串口等；
	- 检测系统内存映射；
	- 将OS kernel 映像和根系统文件从flash拷贝到RAM，对于Linux kernel 映像一般拷贝到从0x30008000这个基址开始的大约1MB的内存中，在这之前空出32KB内存，是为了放置一些全局数据结构；
	- 为OS kernel 设置启动参数
	- 执行OS kernel 入口点指令，在跳转前需要满足条件：（1）CPU寄存器的设置 R0=0；R1=机器类型ID；R2=启动参数标记列表在RAM中的首地址；（2）CPU模式必须禁止中断；（3）CPU必须为SVC模式；（4）Cache和MMU设置：MMU必须关闭，指令Cache可以打开或关闭，数据Cache必须关闭。
- 之后的过程交给OS core，这时通常会看到“uncompressing linux......done"


## bootloader 分类

|boot loader 类型|具有 Monitor功能|描述|x86|ARM|PowerPC|
|-|-|-|-|-|-|
|LILO| 否| Linux 磁盘引导程序 |是|否|否|
|GRUB| 否| GNU 发布的 Linux 磁盘引导程序 |是|否|否|
|Loadin| 否| 从DOS引导Linux的 磁盘引导程序 |是|否|否|
|ROLO| 否| 从 ROM 引导 Linux 且不需要BIOS |是|否|否|
|Etherboot| 否| 通过以太网卡启动 Linux 系统的固件 |是|否|否|
|LinuxBIOS| 否| 完全替代BIOS的Linux 磁盘引导程序 |是|否|否|
|BLOB| 否| LART 等硬件平台的引导程序 |否|是|否|
|VM| 是| 主要为S3C2410 等三星处理器引导Linux  |否|是|否|
|U-Boot| 是| 通用引导程序 |是|是|是|
|RedBoot| 是| 基于eCos的引导程序  |是|是|是|

U-Boot的bootloader，是一个通用的引导程序，而且同时支持X86、ARM和PowerPC等多种处理器架构。U-Boot，全称 Universal Boot Loader，是遵循GPL条款的开放源码项目，是由德国DENX小组开发的用于多种嵌入式CPU的bootloader程序，对于Linux的开发，德国的u-boot做出了巨大的贡献，而且是开源的。其实，把u-boot可以理解为是一个小型的操作系统。


### U-Boot 结构

- board 目标板相关文件，主要包含SDRAM、FLASH驱动；
- common 独立于处理器体系结构的通用代码，如内存大小探测与故障检测；
- cpu 与处理器相关的文件。如mpc8xx子目录下含串口、网口、LCD驱动及中断初始化等文件；
- driver 通用设备驱动，如CFI FLASH驱动(目前对INTEL FLASH支持较好)
- doc U-Boot的说明文档；
- examples可在U-Boot下运行的示例程序；如hello_world.c,timer.c；
- include U-Boot头文件；尤其configs子目录下与目标板相关的配置头文件是移植过程中经常要修改的文件；
- lib_xxx 处理器体系相关的文件，如lib_ppc, lib_arm目录分别包含与PowerPC、ARM体系结构相关的文件；
- net 与网络功能相关的文件目录，如bootp,nfs,tftp；
- post 上电自检文件目录。尚有待于进一步完善；
- rtc RTC驱动程序；
- tools 用于创建U-Boot S-RECORD和BIN镜像文件的工具；


## Android 启动
Android系统在执行完上述Bootloader、Linux kernel启动过程后，即linux内核启动之后，会调用Android Init进程。Init进程是在用户空间执行的，它负责启动Android相关的服务和应用：
- 建立用户空间所需目录，如/dev,/proc
- 进入无限循环（监听），负责建立新的进程。




绝大多数进程都是Init进程的子进程。其中有两个重要的子进程是：
- Servicemanager
- zygote

### zygote

这个进程是Java世界的孵化器：
- 建立java runtime env
- 建立dalvik虚拟机
- 启动systemserver

基本顺序是：
- 1.先启动Dalvik虚拟机
- 2.加载一些必要系统资源和系统类（库）
- 3.进入监听状态
- 4.之后其他系统模块，例如 ApplicationMangerService（AMS）希望建立新进程时，只需要相zygote进程发出请求，zygote监听到请求后，会分裂（复制）新的进程，这个过程使用JNI 调用linux fork 函数创建进程。
- 5.新进程在出生时就有了自己的Dalvik虚拟机和系统资源。





## References
- [Uboot docs](https://u-boot.readthedocs.io/en/latest/)