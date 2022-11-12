# ARM 编译器

- arm-none-eabi-gcc：ARM arch，no vendor,not target os, compiles with ARM EABI
- arm-none-linux-gnueabi-gcc：ARM arch，no vendor,生成linux os上的运行程序, compiles with GNU EABI
  - 主要用于基于ARM架构的Linux系统，==可用于编译 ARM 架构的 u-boot、Linux内核、Linux应用等==。arm-none-linux-gnueabi基于GCC，使用Glibc库，经过 Codesourcery 公司优化过推出的编译器。arm-none-linux-gnueabi-xxx 交叉编译工具的浮点运算非常优秀。一般ARM9、ARM11、Cortex-A 内核，带有 Linux 操作系统的会用到。

- arm-eabi-gcc：android ARM 编译器

- ARMCC ，arm公司的编译器。功能和 arm-none-eabi 类似，可以编译裸机程序（u-boot、kernel），但是不能编译 Linux 应用程序。armcc一般和ARM一起，Keil MDK、ADS、RVDS和DS-5中的编译器都是armcc，所以 armcc 编译器都是收费的）。

- arm-none-uclinuxeabi-gcc 和 arm-none-symbianelf-gcc
arm-none-uclinuxeabi 用于uCLinux，使用Glibc。
arm-none-symbianelf 用于symbian。


ABI 和 EABI
- ABI
二进制应用程序接口(Application Binary Interface (ABI) for the ARM Architecture)。在计算机中，应用二进制接口描述了应用程序（或者其他类型）和操作系统之间或其他应用程序的低级接口。

- EABI
嵌入式ABI。嵌入式应用二进制接口指定了文件格式、数据类型、使用、堆积组织优化和在一个嵌入式软件中的参数的标准约定。开发者使用自己的汇编语言也可以使用 EABI 作为与兼容的生成的汇编语言的接口。

ABI 和 EABI 两者主要区别是，ABI是计算机上的，EABI是嵌入式平台上（如ARM，MIPS等）


arm-linux-gnueabi-gcc 和 arm-linux-gnueabihf-gcc
两个交叉编译器分别适用于 armel 和 armhf 两个不同的架构，armel 和 armhf 这两种架构在对待浮点运算采取了不同的策略（有 fpu 的 arm 才能支持这两种浮点运算策略）。

其实这两个交叉编译器只不过是 gcc 的选项 -mfloat-abi 的默认值不同。gcc 的选项 -mfloat-abi 有三种值:

soft、softfp、hard（其中后两者都要求 arm 里有 fpu 浮点运算单元，soft 与后两者是兼容的，但 softfp 和 hard 两种模式互不兼容）：

soft： 不用fpu进行浮点计算，即使有fpu浮点运算单元也不用，而是使用软件模式。
softfp： armel架构（对应的编译器为 arm-linux-gnueabi-gcc ）采用的默认值，用fpu计算，但是传参数用普通寄存器传，这样中断的时候，只需要保存普通寄存器，中断负荷小，但是参数需要转换成浮点的再计算。
hard： armhf架构（对应的 arm-linux-gnueabihf-gcc ）采用的默认值，用fpu计算，传参数也用fpu中的浮点传，省去了转换，性能最好，但是中断负荷高。
————————————————
版权声明：本文为CSDN博主「ctrigger」的原创文章，遵循CC 4.0 BY-SA版权协议，转载请附上原文出处链接及本声明。
原文链接：https://blog.csdn.net/ctrigger/article/details/111149118