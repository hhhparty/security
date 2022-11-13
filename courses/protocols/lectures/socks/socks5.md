# SOCKS5 

SOCKS 是一种在client 和server间使用 proxy server 进行包交换的互联网协议。SOCKS5 IETF 1996 年正式发布。SOCKS5 是一种代理协议，是明文传输的，它的诞生是为了穿过防火墙而设计的，让合法用户通过防火墙访问内部网络。SOCKS 协议位于会话层。

工作关系如下：

web browser socks5 client <——> socks5 proxy server + relay server <——> Internet remote server

这里可以看到，socks5 包括两个服务器，一个是 代理服务器，另一个是转发服务器。它可以分别放在两个位置，也可以放在一个位置。




## 工作过程

设置了SOCKS5代理的浏览器，在访问服务器时会有下列过程。

假设socks5端口设置为7582：
- 1.浏览器向 socks5 proxy server 发起 tcp 连接请求；
- 2.browser 与 socks5 proxy server 进行协商，包括协议版本、认证方式，成功后继续进行；
- 3.socks5 请求阶段：协商成功后，browser 向 socks5 发送 request，包括 remote server ip 和 port信息。
- 4.socks5 relay 阶段（转发）：收到请求后，解析请求内容，然后向 remote server 建立tcp 连接。
- 5.数据传输阶段：browser 向socks5传输数据，socks5 转发给remote server，之后socks5 proxy 将remote server的响应发回给browser。

### 具体分析
####  首先是握手阶段
  - 客户端发送的报文包含：1字节的协议版本ver（socks5 为 0x05）、1字节的支持认证的方法数量nmethods、1~255字节的methods（nmethods为多少，这里就有多少个字节。）

|ver|nmethods|methods|
|-|-|-|
|1 字节|1 B|1~255 B|

RFC 预定义 methods：
X’00’ NO AUTHENTICATION REQUIRED
X’01’ GSSAPI
X’02’ USERNAME/PASSWORD
X’03’ to X’7F’ IANA ASSIGNED
X’80’ to X’FE’ RESERVED FOR PRIVATE METHODS
X’FF’ NO ACCEPTABLE METHODS

例如使用wireshark 查看 tcp包下有Data（4 bytes）：05020001。

socks5 proxy server 需要选中一个method 返回给 browser client，格式如下：
|ver|method|
|-|-|
|1 Byte|1 Byte|


- 当browser client 收到 0x00 时，会跳过认证阶段直接进入请求阶段；
- 当收到0xFF时，则直接断开连接。
- 收到其他值，进入认证阶段。例如 02 进入用户名和口令验证。

#### 协商子阶段——认证

如果需要认证，client 会向 socks5 发起一个认证请求，假设为0x02型认证，则：

|ver|ULEN|UNAME|PLEN|PASSWD|
|-|-|-|-|-|
|1 Byte|1 Byte|1~255 Bytes|1 Byte|1~255 Bytes|

ver 版本
ulen 用户名长度
uname 用户名字节数据
plen 口令长度
passwd 口令数据

例如：bigbyto/123456为 0x01076269676279746f06313233343536

socks5服务器收到客户端的认证请求后，解析内容，验证信息是否合法，然后给客户端响应结果。响应格式如下:
|ver|STATUS|
|-|-|
|1 Byte|1 Byte|


STATUS 如果为 0x00 表示认证成功；否则失败。失败后，连接会断开。


### 请求阶段
顺利通过协商阶段后，客户端向socks5服务器发起请求细节，格式如下:

|VER | CMD |  RSV  | ATYP | DST.ADDR | DST.PORT |
|-|-|-|-|-|-|
| 1  |  1  | X'00' |  1   | Variable |    2     |


- VER 版本号，socks5的值为0x05
- CMD
  - 0x01表示CONNECT请求
  - 0x02表示BIND请求
  - 0x03表示UDP转发
- RSV 保留字段，值为0x00
- ATYP 目标地址类型，DST.ADDR的数据对应这个字段的类型。
  - 0x01表示IPv4地址，DST.ADDR为4个字节
  - 0x03表示域名，DST.ADDR是一个可变长度的域名
  - 0x04表示IPv6地址，DST.ADDR为16个字节长度
- DST.ADDR 一个可变长度的值
- DST.PORT 目标端口，固定2个字节

浏览器希望连接远程服务器的信息就是在这个报文里体现。

socks5 proxy 会在接受请求后对client有一个响应：
socks5服务器收到客户端的请求后，需要返回一个响应，结构如下


|VER | REP |  RSV  | ATYP | BND.ADDR | BND.PORT |
|-|-|-|-|-|-|
| 1  |  1  | X'00' |  1   | Variable |    2     |


- VER socks版本，这里为0x05
- REP Relay field,内容取值如下
  - X’00’ succeeded
  - X’01’ general SOCKS server failure
  - X’02’ connection not allowed by ruleset
  - X’03’ Network unreachable
  - X’04’ Host unreachable
  - X’05’ Connection refused
  - X’06’ TTL expired
  - X’07’ Command not supported
  - X’08’ Address type not supported
  - X’09’ to X’FF’ unassigned
- RSV 保留字段
- ATYPE 同请求的ATYPE
- BND.ADDR 服务绑定的地址
- BND.PORT 服务绑定的端口DST.PORT


BND.ADDR和BND.PORT值得特别关注一下，可能有朋友在这里会产生困惑，返回的地址和端口是用来做什么的呢？

可以发现在图中socks5既充当socks服务器，又充当relay服务器。实际上这两个是可以被拆开的，当我们的socks5 server和relay server不是一体的，就需要告知客户端relay server的地址，这个地址就是BND.ADDR和BND.PORT。

当我们的relay server和socks5 server是同一台服务器时，BND.ADDR和BND.PORT的值全部为0即可。
### 转发阶段


socks5 服务器接收到client请求后，解析内容，做如下处置：
- 如果是 udp 请求，直接转发；
- 如果是 tcp 请求，socks5 relay server 向 Internet remote server 建立 tcp 连接。之后把客户端请求发给remote server。

