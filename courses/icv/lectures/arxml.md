# ARXML

Autosar 系统描述文件（arxml）是基于XML的文件格式，用于描述网络通信的元素集于autosar系统模版。

定义arxml时需要确定：
- Autosar 架构版本
- 总线类型（flexray channel A，flexray channel B，CAN，Ethernet）


使用autosar system description network explorer 创建一个arxml后，保存后再次编辑它：
- 顶层节点为System
- 二级节点为Cluster
  - 可设置名称、波特率
  - 可生成 ECUs
- 三级节点为Channel，例如CANChannel
  - ECUs挂载在channel下
- 四级节点为ECU
- 五级节点为Frame
  - 可设置名称、长度（bytes）
  - 可设置为标准帧、扩展帧
  - 帧中包含PDU



协议数据单元 PDU 代表在帧上传输的数据单元。他包含在协议栈中交换的有效负载和控制信息。根据pdu的应用和autosar版本，autosar模型可以区分不同类型的pdu。

常见PDU类型：
- signal-I-PDU
- N-PDU
- NM-PDU
- XCP-PDU
- General-Purpose-I——PDU（XCP）
- Multiplexed-I-PDU
- DCM-PDU


信号Signal
