# SecOC

作为一种车载网络安全通信协议，Security Onboard Communication，简称SecOC。

SecOC是在AUTOSAR软件包中添加的信息安全组件（组件位置及可应用的通讯方式如下图所示），该Feature增加了加解密运算、秘钥管理、新鲜值管理和分发等一系列的功能和新要求。SecOC模块在PDU级别上为关键数据提供有效可行的身份验证机制。认证机制与当前的AUTOSAR通信系统无缝集成，同时对资源消耗的影响应尽可能小，以便可为旧系统提供附加保护。该规范主要使用带有消息认证码（MAC）的对称认证方法。与不对称方法相比，它们使用更小的密钥实现了相同级别的安全性，并且可以在软件和硬件中紧凑高效地实现。但是，规范提供了两种方法必要的抽象级别，因此对称和非对称身份验证方法都可使用。


<img src="images/secoc/secoc概念.jpg">



## 车载网络安全技术
|层次|保护和访问限制|威胁检测|攻击响应|漏洞修复|
|-|-|-|-|-|
|V2X互联安全|设备认证、PKI、传输加密|IDS 数据记录、流量历史、深度检查|IPS 流量控制、消息过滤、深度检查|OTA 在线升级|
|车辆架构|架构的物理和逻辑隔离、网关防火墙|IDS 数据记录、流量历史、深度检查|IPS 流量控制、消息过滤、深度检查|OTA 在线升级|
|网络通信|SecOC、豹纹数据加密诊断刷写安全机制、以太网安全通信机制（VACL、ACL、MACsec、IPSec、TLS、DTLS）|IDS 数据记录、流量历史、深度检查|IPS 流量控制、消息过滤、深度检查|OTA 在线升级|
|ECU及接口|系统和存储分区、调试接口禁用、安全启动、刷写、存储|IDS 数据记录、流量历史、深度检查|IPS 流量控制、消息过滤、深度检查|OTA 在线升级|

SecOC 涉及数据访问与保护


## 数据保护

造成数据传输发生问题的原因包括：
- 系统错误
  - 硬件相关错误
    - 寄存器错误
    - 。。。
  - 软件相关错误
    - RTE 错误
    - 。。。
- 攻击
  - 针对数据的攻击，例如窃听、篡改、损坏
  - 针对协议的攻击，例如重放、端口扫描、畸形协议、DoS

数据保护的方法：
- 校验
  - CRC
  - 签名
- 计数
  - Counter
  - 全局时间
- 加密
  - 对称
  - 非对称
- 过滤
  - 防火墙

### checksum+counter

- counter：发送一次报文+1，几乎不定义错误场景
- checksum：
  - 异或校验
  - 奇偶校验
  - crc校验

常见的 CRC 类型：
- 8-bit CRC 
  - 8-bit SAE J1850 CRC
  - 8-bit 0x2F pilynomial CRC
- 16-bit CRC
  - 16-bit CCITT-FALSE CRC16
  - 16-bit 0x8005 polynomial CRC
- 32-bit CRC
  - 32-bit Ethernet CRC 
  - 32-bit 0xF4ACFB13 polynomial CRC
- 64-bit CRC 
  - 64-bit ECMA polynomial CRC

例如：
CRC result width： 8 bits
- polynomial：0x1Dh
- initial value：0xFFh
- input data reflected: No
- result data reflected: No
- XOR value: 0xFFh
- Check: 0x4Bh
- Magic check: C4h

### E2E
场景1：SWC1-1 发送数据到 SWC-2，依次发送了counter 为 1，2，3，之后 SW-1 发送counter 为4 的报文给 SWC-3，之后再次给 SWC-2报文 5，6。这里报文的counter 有跳跃，不连续。

场景2: SWC1 以20ms周期发送请求，COM 以40ms周期发送报文，那么SWC-2收到的信息就会有重复2次。

场景3: SWC1 以40ms周期发送请求，COM 以20ms周期发送报文。

接收方如何判读？

#### counter
针对发送请求，最大值为14.
- 引入 MaxDeltaCounter ，设置允许counter计数器跳变的最大值，若接收方发现当前counter和上一counter的差，超过了MaxDeltaCounter，则认为不合理。
- 引入UB （update bit），SWC-1 每次发送消息后，RTE会将UB置1，底层COM口发送消息后，UB置0。这意味着，RTE会在UB=1时发数，而UB=0时不会将SWC-1的消息转发。即便SWC-1 不断发送重复数据，通过UB设置，可以防止重放。

#### CRC
E2E 采用了多种CRC类型，且会多次使用。

还会在计算时采用Data ID，类似密钥，2字节，有4种使用模式：
- BOTH：2个字节参与计算
- ALT：根据Counter奇偶计算不同字节
- LOW：只计算低字节
- NIBBLE：只使用12bit；高字节会发送到总线；低字节只参与计算。

#### profile
即配置方式。

在autosar 标准中，E2E profile 号有：1，2，4，4m，5，6，7，7m，8，11，22，44等类型，还有一些变体（Variant）。

#### variants
即标准profile 的变体。

#### E2E 库

由多种profile构成。

对E2E 的调用，可以有三种形式：
- wrapper
- callouts
- transformer

不同的库调用方法，反映了不同位置序列化数据的方式。

## SecOC

### MAC （消息校验）

基于AES-128 的CMAC算法。

### DATA-ID
同E2E， 128bit
但使用方法单一

### Key 
128位

### FV 新鲜度值

- single counter
- timestamp
- multiple freshness counters
  - 截取
  - 完整

#### secoc multiple freshness counters（truncated freshness value）
SecOC 包括4 类节点：发送节点、接收节点；主节点和从节点。

- freshness value： 新鲜度数值，作用于发送节点和接收节点
- synchronization message：同步消息，作用域主节点和从节点

##### freshness value
从MSB（最高位）到LSB（最低位），SecOC Freshness value 包括：Trip Counter + Reset Counter + Message Counter （即 MsgCntUpper+MsgCntLower）+Reset Flag。其长度被称为SecOC Freshness value length。

特别地，MsgCntLower+Reset ，又被称为SecOC Freshness value Txlength 部分。

##### synchronization message

synchronization message这部分从MSB（最高位）到LSB（最低位）由 Trip Counter + Reset Counter + Authenticator 构成。

##### counter 计数规则

- TripCnt ：
  - 增长条件：（1）当FV管理master ECU 启动；（2）On wakeup；（3）On reset；（4）当电源状态变化为：IG-OFF=>IG-ON", 每次加1.
  - 初始条件：在TripCnt达到最大值时，MsgCnt增长条件形成。
  - 初始值：FV managment master ECU ：1；Slave ECU：0.
  - 计数长度：TripCnt 长度最大24位。
  - 达到最大值时会重置；


- RstCnt
  - 增长条件：每个固定时间间隔（ResetCycle）加1.
  - 初始条件：TripCnt增加或初始化时。
  - 初始值：FV managment master ECU ：1；Slave ECU：0.
  - 计数长度：TripCnt 长度最大24位。
  - 达到最大值时会维持最大值；

- MsgCnt
  - 增长条件：每个消息传递加1.
  - 初始条件：在RstCnt增长或初始化时。
  - 初始值：Slave ECU：0.
  - 计数长度：MsgCntLength max 24位。、
  - 达到最大值时会维持最大值；

MsgCnt 依赖于 RstCnt ，RstCnt 依赖于 TripCnt，TripCnt 依赖点火（循环）。

主节点会给从节点分发 TripCnt 和 RstCnt，从节点反馈MsgCnt。

- Latest value：最新的值，来自于主节点的同步信息
- Previous value：先前的值，成功发送和成功接收
- receive value：接收的值


## checksum+counter 、E2E、SecOC 对比

相似点：
- 附加校验码来保证数据正确性，附加counter 保证消息的更新
- 不实现加密功能，数据可以被窃听
- 可选多种算法、策略

差异点：
- 由于存在密钥，secoc更难被破解，防攻击能力更强；
- 由于e2e是针对swc，secoc针对COM，e2e发现错误的面更广
- 三类方法的校验码的算法，counter 的策略有很大差异。

自定义内容举例：
- data id：可以使用can id  or 单独定义id
- e2e校验数据的序列化方式：填充、对齐、排序、大小端；是否与报文中字节一致
- secoc的密钥：分发、更新、丢失、密钥转换
- 同时应用checksum+counter，secoc ，e2e

## 附录

### SAE J1850 bus 协议
> http://www.interfacebus.com/Automotive_SAE_J1850_Bus.html


该总线协议用于车载网络诊断和数据共享应用。这类总线有两种：
- 41.6Kbps Pulse width modulated （PWM）的2线差分方法（two wire differential approach)
- 10.4 Kbps Variable Pulse Width (VPW) 单线方法（single wire approach）。单线方法最大线长 35米，32个节点。


特性：
A high resides between 4.25 volts and 20 volts, a low is any thing below 3.5 volts. High and low values are sent as bit symbols (not single bits).
Symbols times are 64uS and 128uS for the single wire approach.
The bus uses a weak pull-down, the driver needs to pull the bus high, high signals are considered dominant.
A passive logic 1 is sent as a 128uS low level, an active logic 1 is sent as a 64uS high.
A passive logic 0 is sent as a 64uS low level, an active logic 0 is sent as a 128uS high.
The J1850 protocol uses CSMA/CR arbitration. The frame consists of a Start Of Frame [SOF], which is high for 200uS.
The Header byte follows the SOF and is one byte long. The data follows the header byte.
The one byte CRC [Cyclic Redundancy Check] follows the data field.
After the CRC an End Of Data [EOD] symbol is sent. The EOD is sent as a 200uS low pulse.


J1850 传输信号格式：SOF+Header+Data+CRC+EOD+IFR+CRC+EOF

现实中，J1850 常见于 OBDII 连接器中。
