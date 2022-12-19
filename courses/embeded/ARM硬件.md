# ARM 硬件


芯片手册中很多的内容，如CPU、外设、协议都与硬件引脚、地址、协议有关。

学习步骤：
- 先了解ARM的手册
  - cortex-A、cortex-M programmer‘s guide，例如介绍NEON的部分

- 了解计算芯片文档
  - 了解芯片各个功能模块
  - 通过手册、框图了解
- 了解存储芯片文档、外设文档
  - 例如atmel eeprom 
- 了解通信协议

## ARM Cortex-A8

从手册上可以看到这个架构的芯片分为：
- CPU core
- 系统外围
- 连接
- 多媒体
- 存储接口
- 电源管理

从使用角度看，CPU 的引脚或功能可以分为：
- GPIO类 （可直连的引脚部分）
- 协议通信类（UART、USB、IIC、SPI）
- 控制器和转换器类
  - 中断等


 ### CPU 
 #### NEON
 ARM NEON 可以提升计算机视觉等计算密集型程序的性能，编译器可以将 C/C++ 代码自动转换为 NEON 指令。

 NEON 指令可参考：
 - ARM programmer's guide
 - https://zhuanlan.zhihu.com/p/441686632
#### SIMD
单指令多数据（Single Instruction Multiple Data）

单指令多数据流，能够复制多个操作数，并把它们打包在大型寄存器的一组指令集。

### 系统外围

#### RTC
实时时钟
#### PLL
Phase Locked Loop：相回锁

#### PWM
脉冲宽度调制，用于稳压等工作。

#### Watch Dog timer
看门狗。由于电磁脉冲的干扰，导致程序不能达到预期效果（跑飞了）。使用看门狗的时钟，给程序的执行状况进行记录和监控，一旦跑飞则复位。
#### DMA
数据存储访问，实现内存与外设的直接数据交换。
#### Keypad
按钮
#### ADC
模拟数字转换。

### 连接

#### USB Host/OTG

#### UART
通用异步收发接口。一种通用的串行总结。

#### IIC

#### SPI

#### Modem IF

#### GPIO

#### Audio IF

#### Storage IF

### 多媒体

#### Camera IF/MIPI CSI
#### 编解码器 codec/decodec
#### 2D/3D graphic engine
#### TV out /HDMI
#### JPEG
#### LCD
### 存储接口

#### SRAM
#### SROM
#### OneNand
#### SLC/MLC Nand
#### DDR


### 电源

#### clock gating
#### power gating
#### frequency scaling

