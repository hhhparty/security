
# UDS 

统一诊断服务 (Unified diagnostic services ， UDS)

UDS 由 iso-14229 系列标准定义。iso 14229-1 定义了诊断服务，不涉及网路及发现，只有应用层的内容。而iso-14229-3则定义了uds在can总线上的实现。

诊断通信过程：
- 诊断仪发送诊断请求 request
- ecu给出诊断响应 response
- uds为不同诊断功能的request 和 response 定义了同意的内容和格式。

## Diagnostic request 格式

可分为两类：
- 拥有sub-function的
  - sid 表示诊断命令的意义
  - sub-function 表示诊断服务的具体操作（启动、停止、查询）
  - parameter 根据不同的诊断服务，有不同的格式。
 
|service ID（1byte）|sub-function（1byte）|parameter|

- 没有sub-function的

|service ID（1byte）|parameter|

其实，sub-function严格说是7bit，最高位用于抑制正响应（suppress positive response ， spr），如果这个bit被置1，则ECU不会给出正响应（pr），如果这个为被置0，则ecu会给出正响应。目的是告诉ecu不要发不必要的response，从而节约通信资源。

## Diagnostic response 格式

分为positive 和 negtive 两类。 
- positive 以为诊断仪发过来的诊断请求被置行了
- negative response 意味着ecu因某种原因无法执行诊断仪发过来的请求。原因在报文中。

### positive Response 报文格式：
|Response SID（1bytes）|Sub-function（3bytes）|Parameter|

- Response SID = SID + 0x40
- sub-function 视情而定

### negtive Response 报文

|0x7F|被拒绝的SID（1byte）|无法被执行的原因|

原因代码：
- 0x10 General reject
- 0x11 Service not supported
- 0x12 Sub-function not supported
- 0x13 Incorrect message length or invalid format
- 0x14 response too long
- 0x21 busy repeat request
- 0x22 conditions not correct
- 0x24 request sequence error
- 0x25 no response from sub-net component
- 0x26 failure prevents execution of requested action
- 0x31 request out of range
- 0x33 security access denied
- 0x35 invalid key
- 0x36 exceeded number of attempts
- 0x38-0x4f reserved by extended data link security document
- 0x70 upload /donwload not accepted
- 0x71 transfer data suspended
- 0x72 general progamming failure
- 0x73 wrong block sequence counter
- 0x78 request correctly received ,but response is pending
- 0x7e sub-function not supported in active session
- 0x7f service not supported in active session.
