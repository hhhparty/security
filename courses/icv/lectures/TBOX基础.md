# TBOX 基础

本文以 NXP S32K148-T-BOX 为例，建立对TBOX 的基本认知。

NXP S32K148-T-BOX 的MCU是 S32K148。有 LQFP-144 针 和 LQFP-176针两类，默认 144.

S32K 是一个 AEC-Q100 的，基于32-bit Arm Cortex-M4F 和 Cortex-M0+ 的MCUs家族。

## 基本知识

### ARM Cortex-M

ARM cortex-m 是一组 32bit RISC ARM 处理器核心。这些核心经过优化，适用于低成本、节能型集成电路，目前已经集成到数百亿的消费者设备中。

它既可以作为微控制器的主要组件，也可以嵌入别的芯片中。

Cortex-M 家族由 Cortex-M0, Cortex-M0+, Cortex-M1, Cortex-M3, Cortex-M4, Cortex-M7, Cortex-M23, Cortex-M33, Cortex-M35P, Cortex-M55等构成。

Cortex-M4 / M7 / M33 / M35P / M55 等核心，拥有 FPU 选项，有时称为：Cortex-Mx with FPU or "Cortex-MxF"。

### ARM Thumb 

为了提高编译代码的密度，自 ARM 7 TDMI（其中的T就表示Thumb） 之后的ARM处理器，均含有 Thumb指令集。这是一组紧凑的16位编码，大多数 Thumb 指令直接映射到普通的ARM指令。

Thumb-2 技术在2003年发布的ARM1156内核中引入。它扩展了 Thumb 有限的16位指令集，增加了32位指令，使指令集更广。

### CAN与CANFD

### SECoC

### CAN、LIN 基础芯片

用于作为CAN和LIN的物理层处理，是高速CAN / CAN FD，双LIN收发器。

例如：UJA113x系统基础芯片（SBC）是 Buck/boost HS-CAN/双LIN系统基础芯片。它包含一个完全集成的buck和boost转换器，以及最新一代汽车电子控制单元（ECU）中常见的一些功能。它直接与CAN和LIN总线连接，为微控制器供电，处理输入和输出信号，并支持故障安全功能，包括看门狗和可通过非易失性存储器配置的高级“跛行回家”功能。

### 通信接口

- 多路 CAN with CAN-FD
- 多路 UART(2 reused as LIN via SBC-UJA113x)
– 1或多路 100M-base TX1 automotive ethernet via TJA1101
– 1或多路 I2S audio codec extend with SGTL500 and support AVB evaluation
### RTC chip
Real Time Clock 它跟踪当前时间并在电子系统中保持准确的时间。它基本上就像一个依靠电池运行并保持当前时间的钟表，即使在主电源关闭时也是如此。
### QSPI
SPI 协议包括：
- 标准spi，3线，标准SPI通常是4根信号线：CLK、CS、MOSI、MISO，数据线全双工。
- Dual spi，4线，它只是针对SPI Flash而言，不是针对所有SPI外设。对于SPI Flash，全双工并不常用，因此扩展了mosi和miso的用法，让它们工作在半双工，用以加倍数据传输。也就是对于Dual SPI Flash，可以发送一个命令字节进入dual mode，这样mosi变成SIO0（serial io 0），mosi变成SIO1（serial io 1）,这样一个时钟周期内就能传输2个bit数据，加倍了数据传输。
- Queued spi 6线。类似的，还可以扩展，与也是针对SPI Flash，Qual SPI Flash增加了两根I/O线（SIO2,SIO3），目的是一个时钟内传输4个bit 而QSPI就是Queued SPI的简写。

### PWN 
PWM，英文名Pulse Width Modulation，是脉冲宽度调制缩写，它是通过对一系列脉冲的宽度进行调制，等效出所需要的波形（包含形状以及幅值），对模拟信号电平进行数字编码，也就是说通过调节占空比的变化来调节信号、能量等的变化，占空比就是指在一个周期内，信号处于高电平的时间占据整个信号周期的百分比，例如方波的占空比就是50%.

那么如果要实现PWM信号输出如何输出呢？可以直接通过芯片内部模块输出PWM信号，前提是这个I/O口要有集成模块，只需要简单几步操作即可，这种自带有PWM输出的功能模块在程序设计更简便，同时数据更精确。

### USB
在最新版本的USB2.0接口标准中 ，USB1.1是12Mbps，新的USB2.0标准将USB接口速度划分为三类 ，分别是：
- HS：传输速率在25Mbps-400 Mbps （最大480 Mbps）的High-speed接口（简称HS） ；
- FS：传输速率在500Kbps-10Mbps（最大12Mbps）的Full-speed接口（简称FS）；
- LS：传输速率在10kbps-400 100kbps （最大1.5Mbps）的Low-speed接口（简称LS）。

### 存储

通常为 8MB左右的 QSPI NOR FLASH memory ，例如 MX25L6433F 芯片。

### 功能模块

- UART BLE 模块
- UART GPS 模块
- UART 4G 模块

### 传感器

- 用户按钮
- 压力传感器输入
- 电位计
- 3轴加速
- 独立 RTC 芯片
- 23-pin ECU 连接器
  - ADC 输入
  - HS PWM 输出
  - PWM 输入捕捉
  - CAN bus
  - LIN bus
  - 100M-base TX1 车载以太网

### 电源

3.3v or 5V

### CAN 收发器

例如：nxp 的 TJA1044，TJA1044 是 Mantis 系列高速 CAN 收发器的一部分。它提供了控制器局域网 (CAN) 协议控制器和物理两线 CAN 总线之间的接口。该收发器专为汽车行业的高速 CAN 应用而设计，为（带有）CAN 协议控制器的微控制器提供差分发送和接收能力。TJA1044 提供针对 12 V 汽车应用优化的功能集，与 NXP 的第一代和第二代 CAN 收发器（如 TJA1040）相比有显着改进，并具有出色的电磁兼容性 (EMC) 性能。

### ECU 连接器

23-pin ECU 连接器，路由各类CAN/LIN/ENET bus ，扩展 2X HS 输出，2x PWM 输入捕捉，2路模拟输入，使其能够作为GP-ECU

### LQFP
Low profile Quad Flat Package，即薄型QFP，是日本电子机械工业会对QFP外形规格所做的重新制定，根据封装本体厚度分为：
- QFP 2.0-3.6mm 厚
- LQFP 1.4mm 厚
- TQFP 1.0mm 厚

QFP：Quad Flat Package 四方扁平式技术，芯片引脚间距很小，管教很细，适合超大规模集成电路。使用这种封装外形尺寸小，寄生参数小，适合高频应用。该技术主要适合用SMT 表面贴装技术在PCB上安装布线。

### 软件部分

开发板SDK
GPS/BLE/4G 通信模块
audio 编码模块驱动API
测试代码
CAN/LIN/UART/I2C 通信驱动 API 和测试代码
FreeRTOS and LwIP based ENET TCP/IP stack 和 demo project
BSP 及test project
T-BOX 参考设计demo codes
other document

### BSP

Board Support Package 板级支持包。嵌入式硬件工程师负责设计硬件，画出PCB图，工厂会根据PCB图生产出对应的电路板。一个嵌入式系统光有电路板是不够的，还要有对应的软件支持，软件开发的前提是首先使板子正常稳定的工作，然后再在其上编写对应的应用软件以实现其特有的功能。其中使板子正常稳定的工作的代码就属于板级支持包。

BSP功能：
- Bringup：使板子上的操作系统能够正常稳定工作，从而提供一个稳定的开发调试环境，这个过程叫做点亮板子。
- 上个阶段中，板子的CPU和基本的器件已经能正常工作，这个阶段中将使能所有的外设，并为后面要开发的应用程序提供对应的软件控制接口。这个过程的实质是对应的操作系统下驱动开发的过程，需要掌握硬件工作的原理，操作系统的相关知识。
- 嵌入式系统是一个具有专一功能的系统，其上所有的硬件，软件都应该为这一功能服务。第二个阶段结束的时候，板子上所有的设备都已经可以正常使用了。这个阶段的任务就是开发应用程序来实现某种特定的功能，应用程序中会使用第二阶段提供的软件接口控制板子上的设备来完成这一功能。
## 基本组成

### T-Box 硬件基本组成

- MCU ，例如 NXP S32K148 系列
- Flash ，例如：8MB QSPI Flash
- 通信接口，一般包括：
  - 3路以上 CAN 接口
  - 2路以上 LIN 接口
  - 1路以上 ENET 接口
- 音频解码器
- GPS 模块
- BLE 模块
- 4G 无线通信模块
- 3轴加速传感器
- 独立 RTC

### T-Box 软件基本组成

- SDK
  - OS
  - OSIF
  - 中间件
    - 通用的：USB，LIN，SDHC，NFC，ZipWire，CAN，FR，TCP/IP
    - Safety：sCST，sPTLib
    - Motor Control：AMMClib
    - Misc：Audio，Touch Sensing，AVB
  - 低级驱动
  - 头文件
  - 处理器专业UI配置文件
  - Start-up/编译链接文件
- BSP layer
  - BSP API
- 应用软件
  - T-Box 应用
  - GP-ECU 应用
  - BSP test应用