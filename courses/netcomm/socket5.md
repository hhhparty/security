# SOCKET 5

协议标准 SOCKS Protocol Version 5 [RFC1928](https://tools.ietf.org/html/rfc1928) ,  Username/Password Authentication for SOCKS V5 [RFC1929](https://tools.ietf.org/html/rfc1929)

## 介绍
防火墙用于隔离内部网络和外部网络。典型防火墙系统作为应用层网关，提供了受控的TELNET, FTP,SMTP访问。随着更为复杂的协议用于全局信息发现，我们需要提供一个通用的协议框架来透明地、安全地穿透防火墙。同时，也需要一种尽可能细粒度的方式实现这种传输的强认证机制。

这种需要来自于各种组织之间c/s关系的实现，以及需要被控制和强认证的场景。SOCKS 协议第5版提供了一种为TCP和UDP域之间C/S应用的框架，方便且安全地使用网络防火墙服务。该协议是一种介于应用层和传输层之间的概念化“shim-layer”，它不提供网络层网关服务，例如转发ICMP消息。

### TCP 客户端的过程

#### 建立连接
当一个TCP客户端希望建立与某个通过防火墙才能连接的目标时，它必须打开一个TCP连接到 SOCKS 服务器系统的正确的 SOCKS 端口。SOCKS 服务传统上工作在TCP 1080端口。如果连接请求成功了，客户端将进入一个认证协商过程，使用选定的认证方法，发出延迟请求。SOCKS 服务器评估这个请求，或建立连接或拒绝它。

说明：在RFC1928中，除非声明，下面出现在8位字节中（octets）的包格式报文中的十进制数字，表示了对应字段的长度。每个给定的8位字节必须指定一个数字，语法 X'hh' 用于表示一个八位字节的值。如果使用‘Variable’ ，表示该字段由另一个关联字段（长度字段）或另一个数据类型字段指定了字节长度。

客户端连接服务器，并发送version identifier / method selection message:

|VER|NMETHODS|METHODS|
|-|-|-|
|1|1|1 to 255|

- VER 字段被设置为 X'05'，表示协议版本。
- NMETHODS字段包含了在 METHOD字段中存放的八位字节的数量。
- METHOD字段最多可以有255个字节。

服务器会从METHODS中选择一个，并发送 method selection message给客户端。


|VER|METHOD|
|-|-|
|1|1|

假如选定的METHOD是 X'FF', 不是客户端可接受的方法，那么这个客户端必须关闭此连接。

为METHOD当前定义的值有：
- X'00' 非认证请求
- X'01' GSSAPI
- X'02' USERNAME/PASSWORD
- X'03' to X'7F' IANA ASSIGNED
- X'80' to X'FE' RESERVED FOR PRIVATE METHODS
- X'FF' 不可接受的方法

#### 方法细节协商
之后客户端和服务器进入一个 method-specific sub-negotiation.

具体细节取决于不同的方法。

新可用方法的开发者可以联系IANA要求一个METHOD 号。已经分派的方法号文档应当参考当前方法号和它们对应的协议。

兼容实现必须支持GSSAPI，并应当支持USERNAME/PASSWORD认证方法。

### REQUESTS

一旦某个方法的子协商过程完成，客户端将发送请求细节。如果协商定下的方法包括用于完整性校验或信任校验目的的封装，这个请求必须封装在这个方法的封装中。

SOCKS请求的格式如下：

|VER|CMD|RSV|ATYP|DST.ADDR|DST.PORT|
|-|-|-|-|-|-|
|1|1|X'00'|1|Variable|2|

其中：
- VER 为 X'05'
- CMD
  - CONNECT X'01'
  - BIND  X'02'
  - UDP ASSOCIATE X'03'
- RSV  RESERVED
- ATYP 后续地址的地址类型
  - IP V4 地址：X'01'
  - DOMAINNAME: X'03'
  - IP V6 地址： X'04'
- DST.ADDR  希望的目的地址
- DST.PORT  希望的目的端口


SOCKS服务器通常会根据源地址和目标地址评估请求，并根据请求类型返回一条或多条回复消息。

### 地址

在一个地址字段中，ATYP字段制定了包含在这个字段中的地址类型：

- X'01' 地址是ip v4，有4个八位字节长；
- X'03' 地址包含了完整的域名。
- X'04' 地址为ip v6

### 响应

一旦客户端建立了与服务器的连接，SOCKS 请求消息就会被客户端发出，并且完成认证协商。服务器评估请求并返回响应，格式如下：

|VER|REP|RSV|ATYP|BND.ADDR|BND.PORT|
|-|-|-|-|-|-|
|1|1|X'00'|1|Variable|2|

其中：
- VER 协议号 X'05'
- REP 响应字段
  - X'00' 成功
  - X'01' 通用 SOCKS server failure
  - X'02' connection not allowed by ruleset
  - X'03' Network unreachable
  - X'04' Host unreachable
  - X'05' Connection refused
  - X'06' TTL expired
  - X'07' Command not supported
  - X'08' Address type not supported
  - X'09' to X'FF' unassigned
- RSV    RESERVED
- ATYP   address type of following address
  - IP V4 地址：X'01'
  - 域名：X'03'
  - IP V6 地址：X'04'
- BND.ADDR 服务器已绑定的地址
- BND.PORT 服务已绑定的端口

被标记的字段 RESERVED(RSV) 必须设置为 X'00'

#### connect

   In the reply to a CONNECT, BND.PORT contains the port number that the
   server assigned to connect to the target host, while BND.ADDR
   contains the associated IP address.  The supplied BND.ADDR is often
   different from the IP address that the client uses to reach the SOCKS
   server, since such servers are often multi-homed.  It is expected
   that the SOCKS server will use DST.ADDR and DST.PORT, and the
   client-side source address and port in evaluating the CONNECT
   request.

#### BIND

   The BIND request is used in protocols which require the client to
   accept connections from the server.  FTP is a well-known example,
   which uses the primary client-to-server connection for commands and
   status reports, but may use a server-to-client connection for
   transferring data on demand (e.g. LS, GET, PUT).

   It is expected that the client side of an application protocol will
   use the BIND request only to establish secondary connections after a
   primary connection is established using CONNECT.  In is expected that
   a SOCKS server will use DST.ADDR and DST.PORT in evaluating the BIND
   request.

   Two replies are sent from the SOCKS server to the client during a
   BIND operation.  The first is sent after the server creates and binds
   a new socket.  The BND.PORT field contains the port number that the
   SOCKS server assigned to listen for an incoming connection.  The
   BND.ADDR field contains the associated IP address.  The client will
   typically use these pieces of information to notify (via the primary
   or control connection) the application server of the rendezvous
   address.  The second reply occurs only after the anticipated incoming
   connection succeeds or fails.

In the second reply, the BND.PORT and BND.ADDR fields contain the
   address and port number of the connecting host.

UDP ASSOCIATE

   The UDP ASSOCIATE request is used to establish an association within
   the UDP relay process to handle UDP datagrams.  The DST.ADDR and
   DST.PORT fields contain the address and port that the client expects
   to use to send UDP datagrams on for the association.  The server MAY
   use this information to limit access to the association.  If the
   client is not in possesion of the information at the time of the UDP
   ASSOCIATE, the client MUST use a port number and address of all
   zeros.

   A UDP association terminates when the TCP connection that the UDP
   ASSOCIATE request arrived on terminates.

   In the reply to a UDP ASSOCIATE request, the BND.PORT and BND.ADDR
   fields indicate the port number/address where the client MUST send
   UDP request messages to be relayed.

Reply Processing

   When a reply (REP value other than X'00') indicates a failure, the
   SOCKS server MUST terminate the TCP connection shortly after sending
   the reply.  This must be no more than 10 seconds after detecting the
   condition that caused a failure.

   If the reply code (REP value of X'00') indicates a success, and the
   request was either a BIND or a CONNECT, the client may now start
   passing data.  If the selected authentication method supports
   encapsulation for the purposes of integrity, authentication and/or
   confidentiality, the data are encapsulated using the method-dependent
   encapsulation.  Similarly, when data arrives at the SOCKS server for
   the client, the server MUST encapsulate the data as appropriate for
   the authentication method in use.

7.  Procedure for UDP-based clients

   A UDP-based client MUST send its datagrams to the UDP relay server at
   the UDP port indicated by BND.PORT in the reply to the UDP ASSOCIATE
   request.  If the selected authentication method provides
   encapsulation for the purposes of authenticity, integrity, and/or
   confidentiality, the datagram MUST be encapsulated using the
   appropriate encapsulation.  Each UDP datagram carries a UDP request
   header with it:

   
      +----+------+------+----------+----------+----------+
      |RSV | FRAG | ATYP | DST.ADDR | DST.PORT |   DATA   |
      +----+------+------+----------+----------+----------+
      | 2  |  1   |  1   | Variable |    2     | Variable |
      +----+------+------+----------+----------+----------+

     The fields in the UDP request header are:

          o  RSV  Reserved X'0000'
          o  FRAG    Current fragment number
          o  ATYP    address type of following addresses:
             o  IP V4 address: X'01'
             o  DOMAINNAME: X'03'
             o  IP V6 address: X'04'
          o  DST.ADDR       desired destination address
          o  DST.PORT       desired destination port
          o  DATA     user data

   When a UDP relay server decides to relay a UDP datagram, it does so
   silently, without any notification to the requesting client.
   Similarly, it will drop datagrams it cannot or will not relay.  When
   a UDP relay server receives a reply datagram from a remote host, it
   MUST encapsulate that datagram using the above UDP request header,
   and any authentication-method-dependent encapsulation.

   The UDP relay server MUST acquire from the SOCKS server the expected
   IP address of the client that will send datagrams to the BND.PORT
   given in the reply to UDP ASSOCIATE.  It MUST drop any datagrams
   arriving from any source IP address other than the one recorded for
   the particular association.

   The FRAG field indicates whether or not this datagram is one of a
   number of fragments.  If implemented, the high-order bit indicates
   end-of-fragment sequence, while a value of X'00' indicates that this
   datagram is standalone.  Values between 1 and 127 indicate the
   fragment position within a fragment sequence.  Each receiver will
   have a REASSEMBLY QUEUE and a REASSEMBLY TIMER associated with these
   fragments.  The reassembly queue must be reinitialized and the
   associated fragments abandoned whenever the REASSEMBLY TIMER expires,
   or a new datagram arrives carrying a FRAG field whose value is less
   than the highest FRAG value processed for this fragment sequence.
   The reassembly timer MUST be no less than 5 seconds.  It is
   recommended that fragmentation be avoided by applications wherever
   possible.

   Implementation of fragmentation is optional; an implementation that
   does not support fragmentation MUST drop any datagram whose FRAG
   field is other than X'00'.

   The programming interface for a SOCKS-aware UDP MUST report an
   available buffer space for UDP datagrams that is smaller than the
   actual space provided by the operating system:

          o  if ATYP is X'01' - 10+method_dependent octets smaller
          o  if ATYP is X'03' - 262+method_dependent octets smaller
          o  if ATYP is X'04' - 20+method_dependent octets smaller

8.  Security Considerations

   This document describes a protocol for the application-layer
   traversal of IP network firewalls.  The security of such traversal is
   highly dependent on the particular authentication and encapsulation
   methods provided in a particular implementation, and selected during
   negotiation between SOCKS client and SOCKS server.

   Careful consideration should be given by the administrator to the
   selection of authentication methods.
