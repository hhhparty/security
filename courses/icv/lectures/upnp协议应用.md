# UPnP 协议
UPnP， Universal Plug and Play，中文是 “通用即插即用”。

当某个主机加入网络时，行为模式与添加/删除设备类似。特别是当私有网络和公共网络交互时，私有网络的主机使用内部IP地址，无法被外部网络访问，为了实现外网访问则需要进行NAT将内网地址映射到某个公网地址。但是NAT设置需要手动配置端口映射，如果很多内部主机都需要访问，那么工作人员就要在一个NAT设备上为多个内部主机做人工分配不能冲突，为了解决人工分配的麻烦，UPnP协议就出现了。

只要NAT设备/路由器支持UPnP并开启。那么当我们主机向NAT设备发出端口映射请求时，NAT设备就可以自动为主机分配端口并进行端口映射，从而就可以被公网所访问。

UPnP典型应用场景是家用智能设备的互联、车内设备的互联、网络应用（如bitrorrent、emule 、ipfs、ethereum等P2P技术软件）

实现UPnP的必要条件：
- NAT网关需要支持UPnP功能，作为控制点，提供SSDP服务
- 操作系统支持UPnP功能，例如windows等
- 应用程序支持UPnP功能，如BT

## 基本概念

### 设备（Device）

UPnP网络中定义的设备具有很广泛的含义，各种各样的家电、电脑外设、智能设备、无线设备、个人电脑等等都可以称之为设备。一台UPnP设备可以是多个服务的载体或多个子设备的嵌套。

### 服务（Service）

在UPnP网络中，最小的控制单元就是服务。服务描述的是指设备在不同情况下的动作和设备的状态。例如，时钟服务可以表述为时间变化值、当前的时间值以及设置时间和读取时间两个活动，通过这些动作，就可以控制服务。例如，某智能音箱设备，它的服务可以是播放某个音频文件，暂停，继续等。

### 控制点（Control Point）

在UPnP网络中，控制点指的是可以发现并控制其他设备的控制设备。在UPnP网络中，设备可以和控制点合并，为同一台设备，同时具有设备的功能和控制点的功能，即可以作为设备提供服务，也可以作为控制点发现和控制其他设备。

### 组播的基本概念

    单播是主机间一对一的通讯模式，网络中的设备根据网络报文中包含的目的地址选择传输路径，将单播报文传送到指定的目的地，只对接收到的数据进行转发，不会进行复制。它能够针对每台主机及时的响应，现在的网页浏览全部都是采用单播模式。

    广播是主机间一对所有的通讯模式，设备会将报文发送到网络中的所有可能接收者。设备简单地将它收到的任何广播报文都复制并转发到除该报文到达的接口外的每个接口。广播处理流程简单，不用选择路径。

    组播是主机间一对多的通讯模式， 组播是一种允许一个或多个组播源发送同一报文到多个接收者的技术。组播源将一份报文发送到特定的组播地址，组播地址不同于单播地址，它并不属于特定某个主机，而是属于一组主机。一个组播地址表示一个群组，需要接收组播报文的接收者都加入这个群组。
### SSDP协议

简单服务发现协议（Simple Service Discovery Protocol：SSDP），是内建在HTTPU/HTTPMU里，定义如何让网络上有的服务被发现的协议。具体包括控制点如何发现网络上有哪些服务，以及这些服务的资讯，还有控制点本身宣告他提供哪些服务。该协议运用在UPnP工作流程的设备发现部分。


### SOAP协议

简单对象访问协议（Simple object Access Protocol：SOAP）定义如何使用xml与HTTP来执行远程过程调用（Remote Procedure Call）。包括控制点如何发送命令消息给设备，设备收到命令消息后如何发送响应消息给控制点。该协议运用在UPnP工作流程的设备控制部分。用来控制UPnP设备的统一消息格式，发送命令消息即可

### GENA协议

通用事件通知架构（Generic Event Notification Architecture：GENA）定义在控制点想要监听设备的某个服务状态变量的状况时，控制点如何传送订阅信息并如何接收这些信息，该协议运用在UPnP工作流程的事件订阅部分。本次利用并不涉及该协议，仅作了解。


1.首先控制点和设备都先获取IP地址后才能进行下一步的工作(DHCP协议)；

2.控制点首先要寻找整个网络上的UPnP设备，同时网络上的设备也要宣告自身的存在；

3.控制点要取得设备的描述，包括这些设备提供什么样的服务；在控制点发现设备存活后，会立即访问LOCATION字段中的URL获得设备信息。例如：

```SSDP
LOCATION:http://ssdf:49152/description.xml\r\n

```

4.控制点发出动作信息给设备；

5.控制点监听设备的状态，当状态改变时作出相应的处理动作；
## SSDP协议

UPnP规范下的SSDP协议（simple service discover protocol），是UPnP的核心。

SSDP使用固定的组播地址：239.255.255.250 和UDP端口 1900来监听设备请求。

SSDP的请求消息有两种类型：
- 服务通知，设备和服务使用此类通知消息声明自己的存在；即NOTIFY
- 查询请求，协议客户端用此请求查询某种类型的设备和服务。即M-SEARCH


### 设备查询

当客户端接入网络时，它可以向一个特定的多播地址的SSDP端口使用 M-SEARCH 方法发送 “ssdp:discover” 消息。当设备监听到这个保留的多播地址上由控制点发送消息的时候，设备将通过单播的方式直接响应到控制点的请求。

典型的设备查询请求消息格式：
```
M-SEARCH  * HTTP/1.1
S:uuid:ijklmnop-7dec-11d0-a765xxx
Host:239.255.255.250:1900
Man:"ssdp:discover"ST:ge:fridge
MX:3
```

响应消息应该包含服务的位置信息（Location 或 AL 头），ST和USN头。响应消息应该包含cache 控制消息。

典型的响应消息格式：
```
HTTP/1.1 200 OK
Cache-Control: max-age= seconds until advertisement expires
S: uuid:ijklmnop-7dec-11d0-a765-00a0c91e6bf6
Location: URL for UPnP description for root device
Cache-Control: no-cache="Ext",max-age=5000ST:ge:fridge // search targetUSN: uuid:abcdefgh-7dec-11d
```
### 设备通知消息

在设备加入网络时，它应当向一个特定的多播地址的 SSDP 端口使用 NOTIFY 方法发送 “ssdp:alive” 消息，以便宣布自己的存在，更新期限信息，更新位置信息。
#### ssdp:alive 消息

由于 UDP 协议是不可信的，设备应该定期发送它的公告消息。在设备加入网络时，它必须用 NOTIFY 方法发送一个多播传送请求。NOTIFY 方法发送的请求没有回应消息。

典型的设备通知消息格式如下：
```
NOTIFY * HTTP/1.1
HOST: 239.255.255.250:1900
CACHE-CONTROL: max-age = seconds until advertisement expires
LOCATION: URL for UPnP description for root device
NT: search target
NTS: ssdp:aliveUSN: advertisement UUID
```
#### ssdp:byebye消息

当一个设备计划从网络上卸载的时候，它也应当向一个特定的多播地址的 SSDP 端口使用 NOTIFY 方法发送 “ssdp:byebye” 消息。但是，即使没有发送 “ssdp:byebye” 消息，控制点也会根据 “ssdp:alive” 消息指定的超时值，将超时并且没有再次收到的 “ssdp:alive” 消息对应的设备认为是失效的设备。

典型的设备卸载消息格式如下：
```
NOTIFY * HTTP/1.1
HOST: 239.255.255.250:1900NT: search target
NTS: ssdp:byebye
USN: advertisement UUID
```

## UPnP 渗透利用

### 网络设备发现
- 在简单网络发现协议SSDP中，发现网络设备后，绘梨衣根据返回的响应去访问设备描述文件，即某个description.xml
  - 因为不校验返回报文地址和LOCATION地址是否相同，不校验是否与控制点在同一网络
  - 所以，可以利用此特性发现网络内设备存活。

### soap控制协议

很多控制点/路由器默认使用upnp,可以通过这个协议直接控制，在设备描述页面会有详细的解释，serviceType,action,argmunt,在作本地流量监控的时候以外发现XX智能音箱同样支持这个协议而且可以直接访问控制，那我们可以直接通过这个方式控制该音箱，例如播放任何资源的音频文件。

<SCPDURL>/xxx.xml</SCPDURL>是控制的详细描述文件动作和参数；

<serviceType>urn:schemas-upnp-org:service:xxx:1</serviceType>是服务类型。

首先我们伪造一下SSDP的discover
```python
import socket
MS = \
    'M-SEARCH * HTTP/1.1\r\n' \
    'HOST:239.255.255.250:1900\r\n' \
    'ST:upnp:rootdevice\r\n' \
    'MX:2\r\n' \
    'MAN:"ssdp:discover"\r\n' \
    '\r\n'

SOC = socket.socket(socket.AF_INET, socket.SOCK_DGRAM, socket.IPPROTO_UDP)
SOC.settimeout(2)
SOC.sendto(MS.encode('utf-8'), ('239.255.255.250', 1900))
try:
    while True:
        #SOC.sendto(MS.encode('utf-8'), ('239.255.255.250', 1900) )
        data, addr = SOC.recvfrom(8192)
        print (addr, data)
except:
    print("None")

```

某智能音箱-SCPD.xml

device.xml scpd.xml 通过soap的action进行执行操作例如播放音频文件。

POST /upnp/control/rendertransport1 HTTP/1.1

##这个url是service-type中的control-uri

HOST:192.168.132.167:49494

##目标设备的端口和IP

CONTENT-TYPE: text/xml; charset="utf-8"

USER-AGENT: OS/VERSION UPnP/2.0 product/version

SOAPACTION: "urn:schemas-upnp-org:service:AVTransport:1#SetAVTransportURI"

##SOAPACTION 必不可少的字段，后面是serviceType的值，服务和#动作

Content-Length: 517

```xml
<?xml version="1.0" encoding="utf-8" standalone="no"?>
<s:Envelope s:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/" xmlns:s="http://schemas.xmlsoap.org/soap/envelope/">
    <s:Body>
        <!-->action然后是参数，一个动作可以有多个参数<-->
        <u:SetAVTransportURI xmlns:u="urn:schemas-upnp-org:service:AVTransport:1">
                <InstanceID>0</InstanceID>
                <CurrentURI>https://v.qq.com/x/page/j1428plaitc.html</CurrentURI>
                <CurrentURIme taData>1</CurrentURIme taData>
        </u:SetAVTransportURI>

    </s:Body>
</s:Envelope>


当设置播放资源URL后执行播放动作：

POST /upnp/control/rendertransport1 HTTP/1.1

HOST:192.168.132.167:49494

CONTENT-TYPE: text/xml; charset="utf-8"

USER-AGENT: OS/VERSION UPnP/2.0 product/version

SOAPACTION: "urn:schemas-upnp-org:service:AVTransport:1#Play"

Content-Length: 386
```
<?xml version="1.0" encoding="utf-8" standalone="no"?>
<s:Envelope s:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/" xmlns:s="http://schemas.xmlsoap.org/soap/envelope/">
    <s:Body>
        <u:Play xmlns:u="urn:schemas-upnp-org:service:AVTransport:1">
            <InstanceID>0</InstanceID>
            <Speed>1</Speed>
        </u:Play>
    </s:Body>
</s:Envelope>
```
