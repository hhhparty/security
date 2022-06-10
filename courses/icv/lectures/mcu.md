# MCU 

## 主要MCU厂商

### 国内 
- 北京兆易创新 gigadevice
- 中颖电子 sino wealth
- 华润微电子 cr micro
- 上海华大半导体 cec HDSC
- 上海复旦微电子 FUDAN MICRO
- 深圳国民技术 nation
- 上海贝岭 HDSC shanghai belling
- 海尔集成电路 haier
- 青岛东软载波 eastsoft essemi
- 深圳中微半导体 cmsemicon
- 上海晟矽半导体 sinmcu
- 杭州士兰微电子 silan
- 希格玛微电子 sigma micro
- 深圳汇春科技 yspring tech
- 珠海卓荣集团（建荣） appotech
- 苏州华芯微电子 H-sun
- 龙芯 loongson
- 紫光同芯 tongxin micro
- 杭州中天微 C SKY
- 上海灵动微电子 MM32 MCU
- 珠海欧比特控制工程 rbita 欧比特
- 南京沁恒微电子 WCH
- 北京君正 MM32 MCU
- 深圳jin
### 国外
- 日本renesas 瑞萨
- 荷兰恩智浦（nxp）
- 美国微芯科技 microchip
- 韩国三星 samsung
- 瑞士意法半导体 st 
- 德国英飞凌 infineon
- 美国德州仪器 TI
- 美国赛普拉斯 cypress
- 每个芯科 silicon lab
- 日本东芝 toshiba
- 美国 ixys
- 挪威 nordic
- 美国高通 qualcomm
- 日本富士通 fujitsu
- 美国超威半导体 AMD
- 美国美满科技 Marvell


## 网关芯片
## 英飞凌 TC275

[TC275](https://www.infineon.com/cms/en/product/microcontroller/32-bit-tricore-microcontroller/32-bit-tricore-aurix-tc2xx/aurix-family-tc27xt/)


AURIX™  is Infineon's brand new family of microcontrollers . Its innovative multicore architecture, based on up to three independent 32-bit TriCore CPUs, has been designed to meet the highest safety standards, while simultaneously increasing performance significantly.  Equipped with a triple TriCore with 200 MHz, 4MB of Flash memory  and a Powerful Generic Timer Module (GTM), the TC27xT series aim for a reduced complexity, best-in-class power consumption and significant cost savings.

key features：
Triple TriCore™ with 200MHz and DSP functionality (three high performance 32-bit super-scalar TriCore™ V1.6.1 CPUs running at 200 MHz in the full automotive temperature range)
Up to 4MB Flash w/ ECC protection (dedicated closely coupled memory areas per core)
Up to 472 KB RAM w/ ECC protection
64x DMA channels
6 diff.ch. Delta-Sigma ADC
8x 12-bit fast ADC with up to 60 analog input channels
Sensor interfaces : 10xSENT, 3xPSI5, 1xPSI5S 
State of the art connectivity : 1xEthernet 100 Mbit , 1x FlexRay ,  4xCAN FD,4xASCLIN, 4xQSPI , 1xI²C  , 2xMSC, I²S emulation 
LQFP-176 package
LFBGA-292 package 
ambient Temperaure range -40°...+150°
Programmable HSM  (Hardware Security Module)* Optional
Single voltage supply 5V or 3.3V

System benefits:
Diverse Lockstep architecture to reduce development effort for ASIL-D systems
High integration for reduced complexity and significant cost savings
Delta-sigma analog-to-digital converters for fast and accurate measurements
Innovative single supply concept for best-in-class power consumption and cost savings in external supply
Scalability in terms of performance, packages, memory and peripherals for flexibility across platform concepts
Available as single and lockstep core
Latest connectivity CAN FD (flexible data rate)     
Scalable safety from QM to ASIL D for Industrial and Automotive Applications
Hot package options for extended temperature range

Most innovative safety:
Diverse Lockstep Core with clock  delay 
Redundant and diverse timer modules ( GTM, CCU6 , GPT12)
Access permission system
Safety management unit ( SMU )
Direct Memory Access ( DMA ) 
I/O, clock, voltage monitor
Developed and documented following ISO 26262 to support safety requirements up to ASIL-D
AUTOSAR  V3.2 and V4.x 


Safety applications:

Air bag System      
Chassis domain control  
Braking  
Pixel lighting  
Scable EPS solution    
Full feature sensor fusion 
Multi-purpose camera     
Active suspension control system 
Automotive 24 GHz radar system 
Highly integrated automotive 77 GHz radar chipset 
Sensor fusions 


### MPC574xB/C/G MCUs for automotive and industrial control and gateway

[MPC574xB/C/G 官方资源地址](https://www.nxp.com/products/processors-and-microcontrollers/power-architecture/mpc5xxx-microcontrollers/ultra-reliable-mpc57xx-mcus/ultra-reliable-mpc574xb-c-g-mcus-for-automotive-and-industrial-control-and-gateway:MPC574xB-C-G)

The MPC574xB/C/G family of MCUs (eg. MPC5746C, MPC5748G) provides a highly integrated, safe and secure single-chip solution for next-generation central body control, gateway and industrial applications.

- Enhanced low-power capabilities provide Increased functionality with more efficient operation
- Hardware security module protects ECUs against various attack scenarios
- Functional safety support simplifies compliance for automotive safety systems targeting ISO 26262 and higher-end ASIL levels
- Comprehensive development tools simplify and accelerate system design
- Complimentary S32 Design studio IDE with automotive-grade Software Development Kit (SDK)
- Autosar MCAL and OS in a 3rd party ecosystem
- Various Evaluation boards available to get started

#### Security
- Hardware Security Module (HSMv2)
- Password and Device Security (PASS and TDM) supporting advanced censorship and life-cycle management
- One Fault Collection and Control Unit (FCCU) to collect faults and issue interrupts

#### Device boundary scan
Device/board boundary Scan testing supported with per Joint Test Action Group (JTAG) of IEEE (IEEE 1149.1) and 1149.7 (cJTAG)


## 电源管理

### NXP 33903/4/5

[NXP 33903/4/5](https://www.nxp.com.cn/docs/en/data-sheet/MC33903-MC33904-MC33905.pdf)

The 33903/4/5 is the second generation family of the System Basis Chip (SBC). It combines several features and enhances present module designs. The device works as an advanced power management unit for the MCU with additional integrated circuits such as sensors and CAN transceivers. It has a built-in enhanced high-speed CAN interface (ISO11898-2 and -5) with local and bus failure diagnostics, protection, and fail-safe operation modes. The SBC may include zero, one or two LIN 2.1 interfaces with LIN output pin switches. It includes up to four wake-up input pins that can also be configured as output drivers for flexibility. This device is powered by SMARTMOS technology.

This device implements multiple Low-power (LP) modes, with very low-current consumption. In addition, the device is part of a family concept where pin compatibility adds versatility to module design.

The 33903/4/5 also implements an innovative and advanced fail-safe state machine and concept solution.

## CAN 收发器

### NXP TJA1051

[NXP TJA1051](https://www.nxp.com/products/interfaces/can-transceivers/can-with-flexible-data-rate/high-speed-can-transceiver:TJA1051)

The TJA1051 is a high-speed CAN transceiver that provides an interface between a Controller Area Network (CAN) protocol controller and the physical two-wire CAN bus. The transceiver is designed for high-speed CAN applications in the automotive industry, providing differential transmit and receive capability to (a microcontroller with) a CAN protocol controller.

The TJA1051 belongs to the third generation of high-speed CAN transceivers from NXP Semiconductors, offering significant improvements over first- and second-generation devices such as the TJA1050. It offers improved ElectroMagnetic Compatibility (EMC) and ElectroStatic Discharge (ESD) performance, and also features:

Ideal passive behavior to the CAN bus when the supply voltage is off
TJA1051T/3 and TJA1051TK/3 can be interfaced directly to microcontrollers with supply voltages from 3 V to 5 V。

