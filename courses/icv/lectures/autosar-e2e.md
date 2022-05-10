# Autosar E2E 协议

E2E 通信保护的概念旨在对安全相关数据交互应当在实时保护，在通信连接上防止错误的影响。使用E2E通信保护，在发送和接收放直接的错误检测，包括系统软件错误（例如发送或接收端底成通信协议引入的错误）以及由MCU硬件、通信外设、收发装置、通信线缆或通信基站等引发的随机硬件错误。

使用E2E通信保护机制，可以实时检测和处理底层软件和硬件发生的错误。

面向E2E通信保护的E2E监视保护机制，可以满足功能安全相关的通信到达ASIL-D需求。

E2E 通信保护提供的功能有：
- 在发送端通过增加控制数据，保护安全相关数据
- 在接收端通过对控制数据的验证，保护安全相关数据
- 给接收者提供检查结果，然后接收者必须给出充分的处理

为了提供解决灵活性和标准化问题的适当解决方案，AUTOSAR指定了一组灵活的E2E配置文件，以实现E2E通信保护机制的适当组合。每个指定的E2E配置文件（profile）都有一组固定的机制，以及用于在接收方配置协议头布局和状态评估的配置选项。

E2E Supervision 可以从通信中间层引用，例如从Adaptive Platform’s ARA，Classic Platform's RTE；也可以从非标准的其他软件提供。例如：非易失性内存管理器，本地IPCs，intra-ECU总线栈。

适当使用E2E监控来满足通信的特定安全要求取决于几个方面。指定的配置文件能够高概率地检测多种通信故障。然而使用特定的E2E配置文件需要用户证明所选配置文件为所考虑的用例提供了足够的错误检测能力（考虑各种因素，如硬件故障率、误码率、网络中的节点数、消息重复率、网关的使用、通信信道上的潜在软件故障），以及对检测到的故障的适当反应（例如，通过撤销重复消息、确定通信超时或通过启动安全反应对损坏的消息作出反应）。

## E2E profile 可指定的CRC计算方法

可以使用的CRC校验规则包括：
- CRC8: SAEJ1850
- CRC8H2F: CRC8 0x2F polynomial
- CRC16
- CRC32
- CRC32P4: CRC32 0x1F4ACFB13 polynomial
- CRC64: CRC-64-ECMA

对于各种规则 (CRC8, CRC8H2F, CRC16, CRC32, CRC32P4 and CRC64), 下列计算方法均可使用：
- 基于表的计算：快速执行，但有较大码长（ROM 表）
- 运行时计算：较慢的执行，但较小的码长（非ROM 表）
- 硬件支持的CRC计算：快速执行，较少的CPU时间。


## 术语与限定

E2E通信保护仅限于周期性或半周期性数据通信模式，其中接收器（订阅者）对数据的常规接收有期望，并且在通信丢失/超时或错误的情况下，它执行错误处理。

数据通信（Data communication） 在classic platform中被称为 sender/receiver；在Adaptive platform中被称为时间通信。


- Data ID：唯一标识message/data element/data的标识符。
- Source ID：唯一标识源 message/data element/data的标识符。
- Repetition ： 同样的消息被重复发送一次以上。
- Loss：消息未被接收。
- Delay：消息未能在预期时间内接收
- Insertion：未预料到的信息或额外的消息被插入。
- Masquerade：非认证的信息被接收者接受，作为认证的信息。
- Corruption：通信故障，改变了信息。
- Asymmetric information ：接收者收到了与发送者发送的不同的信息
- FTTI：错误容忍时间间隔，一个错误发生后可能引起危害的最大时间


### 限定
E2E 通信保护依赖于对所使用通信类型，从E2E视角，下列类型通信是有区别的：
- Signal based communication
- Service oriented communication with events
- Service oriented communication in Client/Server architecture
- Signal to Service Translation

通常，E2E保护机制的行为应当是一样的，但仍存在一定的不同.

E2E属于应用层协议，低层通信故障会导致消息无法送达接收者，例如：
- 以太网 FCS 
- IP header checksum
- UDP checksum
- SOME/IP header irregulations

### 应用于车域

E2E监视可应用于安全相关的汽车系统实现，通过车辆内分布在不同ECUs中的各种SW-Cs，并通过通信连接交互。监视也可以用于ECU内部通信，例如在内存分区中，进程间，在同一个微处理器中OSes/VMs，不同CPU间。

## 需求

- Implementation of E2E protocol shall fulfill ISO 26262
- E2E protocol shall provide different E2E profiles
- Each E2E profile shall use an appropriate subset of specific protection mechanisms
- Each E2E profile shall define a set of protection mechanisms and its behavior
- E2E Library shall call the CRC routines of CRC library
- CRC used in a E2E profile shall be different than the CRC used by the underlying physical communication protocol
- E2E protocol shall provide E2E Check status to the application
- SW-Cs shall tolerate a number of invalid/corrupted received data elements
- An E2E protection mechanism for inter-ECU communication of short to large data shall be provided

- E2E protocol shall support protected periodic/mixed periodic communication
- E2E protocol shall support protected non-periodic communication
- E2E protocol shall support dynamic restart of communication peers
- E2E protocol shall support variable length of transmitted data
- E2E protocol shall provide a timeout detection mechanism
- E2E protocol shall provide a detection mechanism for corrupted data
- E2E protocol shall provide a detection mechanism for masquerade or incorrect addressing
- E2E protocol shall provide a detection mechanism for repetition, insertion or incorrect sequence of data

- E2E protocol shall provide E2E overall state to the application

- Each E2E profile shall have a unique Profile ID

- The implementation of the E2E Supervision shall provide at least one of the E2E Profiles

## 功能规范

这部分定义了E2E监管的内部功能行为，包括：
- E2E头部布局的定义
- E2E头部生成方式
- E2E头部评估方式
- E2E状态机定义方式

### 通信保护概述

An important aspect of a communication protection mechanism is its standardization
and its flexibility for different purposes. This is resolved by having a set of E2E Profiles,
that define a combination of protection mechanisms, a message format, and a set of
configuration parameters.
Moreover, some E2E Profiles have standard E2E variants. An E2E variant is simply
a set of configuration options to be used with a given E2E Profile. For example, in
E2E Profile 1, the positions of CRC and counter are configurable. The E2E variant 1A
requires that CRC starts at bit 0 and counter starts at bit 8.
E2E communication protection works as follows:
• Sender: addition of control fields like CRC or counter to the transmitted data;
• Receiver: evaluation of the control fields from the received data, calculation of
control fields (e.g. CRC calculation on the received data), comparison of calculated control fields with an expected/received content.

Each E2E Profile has a specific set of control fields with a specific functional behavior
and with specific properties for the detection of communication faults.

### E2E Profiles概述

The E2E Profiles provide a consistent set of data protection mechanisms, designed to
protecting against the faults considered in the fault model.
Each E2E Profile provides an alternative way to protect the communication, by means
of different algorithms. However, E2E Profiles have similar interfaces and behavior.
Each E2E Profile uses a subset of the following data protection mechanisms:
1. A CRC, provided by CRC Supervision;
2. A Sequence Counter incremented at every transmission request, the value is
checked at receiver side for correct incrementation;
3. An Alive Counter incremented at every transmission request, the value checked
at the receiver side if it changes at all, but correct incrementation is not checked;
4. A specific ID for every port data element sent over a port or a specific ID for every message-group (global to system, where the system may contain potentially
several ECUs);
5. A specific ID for every source (e.g., client) of a data element or message group
6. A message type distinguishing between requests and responses in case of E2E
communication protection for methods
7. A message result distinguishing between normal and error responses in case of
E2E communication protection for methods
8. Timeout detection:
(a) Receiver communication timeout.
(b) Sender acknowledgement timeout.
Depending on the used communication and network stack, appropriate subsets of
these mechanisms are defined as E2E communication profiles.
Some of the above mechanisms are implemented in RTE, COM, and/or communication
stacks. However, to reduce or avoid an allocation of safety requirements to these
modules, they are not considered: E2E Supervision provides all mechanisms internally
(only with usage of CRC Supervision).
The E2E Profiles can be used for both inter and intra ECU communication. The E2E
Profiles were specified for specific communication infrastructure, such as CAN, CAN
FD, FlexRay, LIN, Ethernet.

Depending on the system, the user selects which E2E Profile is to be used, from the
E2E Profiles provided by E2E Supervision.

#### Error 检测

应当实现内部的对错误的检测机制，根据预先定义的e2e profile。

#### e2e profiles 常见类型


一些E2E配置是在不同配置下共享的通用数据类型。包括：
-  MessageType：
   -  STD_MESSAGETYPE_REQUEST 0
   -  STD_MESSAGETYPE_RESPONSE 1

-  MessageResult
   -  STD_MESSAGERESULT_OK 0
   -  STD_MESSAGERESULT_ERROR 1 

#### 一般功能

E2E 安全配置提供下列3种通用功能：
- 保护： 通过 E2E-header 实现 
- 转发：通过头部、允许已收到信息保留一些状态字段。主要的用例是 信号服务转译，例如一个 e2e保护的信号被收到，e2e-status被复制到下一个点。
- 检查：接收节点检查错误

##### 计数器功能

在接收端，通过比较当前接收数据中的counter和先前接收到数据的 counter，下列情况将被检测：
- 重复（对应于 Alive counter）
  - 未收到新数据
  - 数据重复
- OK
  - 计数器正常加1
  - 计数器增长大于1，且在允许范围内（允许数据一定程度丢失）
- Error（对应于sequence counter）
  - 计数器增加值超过允许范围

##### 超时检查

##### 循环冗余校验

### E2E profile 1

早期的profile，仅为了向下兼容。新的项目应当使用 Profile 11

Profile 1 提供以下机制：
- Counter 4bit 0～14 递增
- Timeout monitoring
  - 接收端使用非阻塞型读请求进行检查，由 E2E supervision提供，超时报告由E2E_P01CheckStatusType状态位反馈。
- Data ID
  - 16位，唯一数字，包含在 CRC中
  - data mode 为0，1，2时，Data ID 被发送，但不包含在CRC计算中。
  - data mode 为 3时
    - dataid 的高位字节的高几位不使用，由dataid限于12位
    - dataid 的高位字节的低几位不使用，由
- CRC计算

可以检测下列 faults or errors of faults ：
- counter
- 使用e2e-supervision进行标准和超时监控
- Data ID + CRC
- CRC

### E2E profile 2

早起profile。

提供以下机制：
- Sequence Number (Counter)
- Message Key used for CRC calculation (Data ID)
- Data ID + CRC
- Safety Code (CRC)

### E2E profile 4

provide the following control fields, transmitted at runtime together with the protected data: 
- Length 16bits
- Counter 16bits
- CRC 32bits
- Data ID 32bits

The E2E mechanisms can detect the following faults or effects of faults:
- Fault Main safety mechanisms
- Repetition of information Counter
- Loss of information Counter
- Delay of information Counter
- Insertion of information Data ID
- Masquerading Data ID, CRC
- Incorrect addressing Data ID
- Incorrect sequence of information Counter
- Corruption of information CRC
- Asymmetric information sent from a sender to multiple receivers
- CRC (to detect corruption at any of receivers)
- Information from a sender received by only a subset of the receivers
- Counter (loss on specific receivers)
- Blocking access to a communication channel Counter (loss or timeout)

### E2E profile 5

dProfile 5 shall provide the following control fields, transmitted at runtime together with the protected data: 
- Counter
- CRC
- Data ID 

The E2E mechanisms can detect the following faults or effects of faults:
Fault Main safety mechanisms
Repetition of information Counter
Loss of information Counter
Delay of information Counter
Insertion of information Data ID, CRC
Masquerading Data ID, CRC
Incorrect addressing Data ID
Incorrect sequence of information Counter
Corruption of information CRC
Asymmetric information sent from a sender to multiple receivers
CRC (to detect corruption at any of receivers)
Information from a sender received by only a subset of the receivers
Counter (loss on specific receivers)
Blocking access to a communication channel Counter (loss or timeout)

###  E2E Profile 6

Length, Counter, CRC, Data ID

The E2E mechanisms can detect the following faults or effects of faults:
Repetition of information Counter
Loss of information Counter
Delay of information Counter
Insertion of information Data ID
Masquerading Data ID, CRC
Incorrect addressing Data ID
Incorrect sequence of information Counter
Corruption of information CRC
Asymmetric information sent from a sender to
multiple receivers
CRC (to detect corruption at any of receivers)
Information from a sender received by only a
subset of the receivers
Counter (loss on specific receivers)
Blocking access to a communication channel Counter (loss or timeout)

### E2E profile 7

Length, Counter, CRC, Data ID

Fault Main safety mechanisms
Repetition of information Counter
Loss of information Counter
Delay of information Counter
Insertion of information Data ID, CRC
Masquerading Data ID, CRC
Incorrect addressing Data ID
Incorrect sequence of information Counter
Corruption of information CRC
Asymmetric information sent from a sender to
multiple receivers
CRC (to detect corruption at any of receivers)
Information from a sender received by only a
subset of the receivers
Counter (loss on specific receivers)
Blocking access to a communication channel Counter (loss or timeout)

### E2E profile 8
control fields：
- length 32bits
- counter 32bits
- crc 32bits
- dataid 32bits

The E2E mechanisms can detect the following faults or effects of faults:
Fault Main safety mechanisms
Repetition of information Counter
Loss of information Counter
Delay of information Counter
Insertion of information Data ID
Masquerading Data ID, CRC
Incorrect addressing Data ID
Incorrect sequence of information Counter
Corruption of information CRC
Asymmetric information sent from a sender to multiple receivers

CRC (to detect corruption at any of receivers)
Information from a sender received by only a subset of the receivers
Counter (loss on specific receivers)
Blocking access to a communication channel Counter (loss or timeout)


### E2E profile 11

### E2E profile 22

### E2E profile 44

控制字段：
- length 16bits
- counter 16bits
- crc 32 bits
- data id 32bits 系统内唯一

The E2E mechanisms can detect the following faults or effects of faults:
Fault Main safety mechanisms
Repetition of information Counter
Loss of information Counter
Delay of information Counter
Insertion of information Data ID
Masquerading Data ID, CRC
Incorrect addressing Data ID
Incorrect sequence of information Counter
Corruption of information CRC
Asymmetric information sent from a sender to multiple receivers
CRC (to detect corruption at any of receivers)
Information from a sender received by only a subset of the receivers
Counter (loss on specific receivers)
Blocking access to a communication channel(loss or timeout)
Counter (loss or timeout)

主要安全机制错误测试
信息计数器重复测试
信息计数器丢失测试
信息计数器延迟测试
信息Data ID 插入测试
Data ID 或 CRC 篡改测试
Data ID 寻址不正确测试
信息计数器顺序不正确测试
信息 CRC 错误测试
从一个发送者到多个接收者的不对称信息测试
CRC故障测试
部分接收者收到信息测试
特定接收者的计数器丢失测试
通信信道阻塞访问（丢包或超时）测试
计数器超时/丢失测试


### E2E profile 4m
控制字段：
- length 16bits
- counter 16bits
- crc 32bits
- data id 32bits
- message type 2bits
- message result 2bits
- source id 28bits


|fault |main safety mechanisms|
|-|-|
Repetition of information |Counter|
|Loss of information |Counter|
|Delay of information| Counter|
|Insertion of information| Data ID, Message type, Message Result,Source ID|
|Masquerading |Data ID, Message type, Message Result,Source ID, CRC|
|Incorrect addressing |Data ID, Message type, Message Result,Source ID|
|Incorrect sequence of information |Counter|
|Corruption of information |CRC|
|Asymmetric information sent from a sender to multiple receivers|CRC (to detect corruption at any of receivers)|
|Information from a sender received by only a subset of the receivers|Counter (loss on specific receivers)|
|Blocking access to a communication channel |Counter (loss or timeout)|

### E2E profile 8m