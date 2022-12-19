# DTB 文件

设备树（Device Tree ），是一种描述硬件的数据结构，起源于OpenFirmware。在Linux 2.6中，ARM架构的板级细节过多地硬编码在 arch/arm/plat-xxx和arch/arm/mach-xxx，采用DT后，许多硬件的细节直接传递给Linux，再不需要kernel中进行大量冗余编码。

DT 由一系列的命名节点node和属性property组成，而节点本身可包含字节点。属性，就是成对出现的key-value。

可描述信息包括：
- CPU的数量和类别
- 内存基地址和大小
- 总线和桥
- 外设连接
- 中断控制器和中断使用情况
- GPIO控制器和GPIO使用情况

 
它基本上就是画一棵电路板上CPU、总线、设备组成的树，Bootloader会将这棵树传递给内核，然后内核可以识别这棵树，并根据它展开出Linux内核中的platform_device、i2c_client、spi_device等设备。这些设备用到的内存、IRQ等资源，也被传递给了kernel，kernel会将这些资源绑定给展开的相应的设备。

## DT编译

DT文件的格式为DTS，包含的头文件格式为dtsi，dts 文件是一种人类可读的编码格式。

这个dts是 uboot 和 linux 不可读的，所以要编译，结果是 dtb 文件。

Linux 源码目录下scripts/dtc目录下包含了dtc工具的源码；或者可以自己安装编译工具 `sudo apt install device-tree-complier`。还有一个 fdtdump工具，可以反编译 dtb文件。

dtc工具的使用方法是：`dtc –I dts –O dtb –o xxx.dtb xxx.dts`，即可生成dts文件对应的dtb文件了。

### Linux 内核启动

早期linux内核里的设备信息（platform_device)和驱动信息（platform_driver)都是通过C硬编码到内核中，源文件都在 arch/arm/mach-xxx 或 plat-xxx 下。

例如我们移植Linux内核代码到FL2440开发板时，就会在设备文件arch/arm/mach-s3c2440/mach-smdk2440.c中作大量修改的，该文件就描述了开发板上所有的设备信息。

我们在编译Linux内核源码之后会生成zImage文件，该文件并不能直接被u-boot启动。之后需要使用u-boot里的mkimage工具生成uImage。

在将zImage转换成uImage文件后，我们在u-boot下就可以直接使用tftp 下载并通过bootm 命令启动Linux内核了。
 
U-Boot> tftp 30008000 linuxrom-s3c2440.bin && bootm 30008000
 
   在前些年我们玩ARM Linux时大多是使用的这种方法。但自从Linus大神发飙之后，ARM社区几乎“一夜”之间将 arch/arm/mach-xxx 或 arch/arm/plat-xxx的代码全部废除，并不再支持。这也就是使用像S3C2440这样的开发板，最高Linux内核版本只能到Linux-3.0的原因。而最新的内核中所有硬件信息都必须通过arch/arm/boot/dts中的DTS（Device Tree Source）文件来描述。这样如果S3C2440想要升级到更高版本的Linux话，就必须自己重写S3C2440的DTS文件，当然很少有人愿意为一个停产的CPU做这些无用功的。
 
设备树启动
 
   Linux-3.x之后的内核统一启用Device Tree机制之后，所有的设备硬件信息描述都会放到 arch/arm/boot/dts/ 路径下的 xxx.dts文件中描述。这些dts(Device Tree Source)文件并不是C代码，而是具有相应语法格式的源文件。在编译内核时，我们可以使用 make dtbs 命令编译生成相应开发板的dtb(Device Tree Blob)文件。因为这些源文件并不是C程序，所以不是用gcc来编译，而是由其相应的编译工具dtc（Device Tree Compiler）来编译。


## References

https://www.cnblogs.com/iot-yun/p/11403498.html