# DNS

## DNS 记录
DNS记录将域名与IP地址进行匹配，然后DNS记录将会自动绑定到区域文件中，这样就可以让正在连接的设备查找到域名的正确IP地址。

下面是一个区域文件中的记录示例：
```dns
; example.com [448369]
$TTL 86400
@   IN  SOA ns1.linode.com. admin.example.com. 2013062147 14400 14400 1209600 86400
@       NS  ns1.linode.com.
@       NS  ns2.linode.com.
@       NS  ns3.linode.com.
@       NS  ns4.linode.com.
@       NS  ns5.linode.com.
@           MX  10  mail.example.com.
@           A   12.34.56.78
mail        A   12.34.56.78
www         A   12.34.56.78
```

每个域的区域文件都包含：
- 域管理员邮件地址
- 域名服务器
- DNS记录

### A 记录 和AAA记录

一个A记录，将你的域或子域指向你的IP地址。

可用*表示所有子域，例如：
*.example.com   A   12.11.111.22

AAA记录与A记录相似，不过用于IPv6的IP地址。例如：

*.example.com   AAA  0123:1233:4444:abde:2233:eeff

### AXFR 记录
这种记录用于DNS复制的记录，它不用于普通区域文件，而是应用于slave-DNS服务器，主要是从master-DNS上复制区域文件。

### CAA 记录
DNS证书颁发机构CAA，使用DNS来允许域的持有者指定“哪些证书颁发机构能够为该域发放证书”。

### CNAME 记录
或称为规范名称记录（Canonical Name record），它将一个域或子域匹配到其它不同的域。通过CNAME记录，DNS查找则采用目标域的DNS解析作为别名的解析。

例如：
```
alias.com   CNAME   example.com
example.com     A       12.33.44.55
```

使用CNAME时，请求alias.com ，先找到 CNAME 条目，于是一个新的DNS查找就会启动，随后得到其ip地址。

注意：CNAME指向的目标应当有正常的A记录，不应将CNAME记录进行链接或循环。MX记录不能饮用CNAME定义的主机名。

### DKIM记录

或称为域名密钥确认邮件记录（Domainkeys identified mail record），它显示用于验证已经签署了DKIM协议的消息的公钥。这可以提高邮件可靠性。

示例：
```
selector1._domainkey.example.com    TXT     k=rsa;p=J83TBu224i086iK
```
DKIM 记录以文本记录作为实现。该记录必须是为子域创建的记录，它具有唯一对应于键的一个选择器，然后便是句点（.），紧跟着是_domainkey.example.com。其类型为 TXT，值则包含键的类型，后面跟着实际键值。
### MX 记录

或称为邮件交换记录（mail exchanger record）则为域或者子域进行邮件分发目的地的设置。

例如：
```
example.com     MX      10      mail.example.com.
mail.example.com    A   12.33.44.55

```

以上记录将example.com的邮件直接发送到mail.example.com服务器。目标域mail.example.com需要有自己的A记录。理想情况下，MX记录应指向同为其服务器主机名的域。

优先级是 MX 记录的另一个组成部分。这是记录类型和目标服务器之间写入的数字（在上例中为 10）。优先级允许您为特定域的邮件指定一个回退服务器（或多个服务器）。较低的数字代表较高的优先级。下面是具有两个回退邮件服务器的域的示例：
```
example.com         MX      10  mail_1.example.com
example.com         MX      20  mail_2.example.com
example.com         MX      30  mail_3.example.com
```
在此示例中，如果mail_1.example.com已关闭，则将传递邮件到mail_2.example.com。如果mail_2.example.com也是关闭，邮件将被发送到mail_3.example.com。

### NS 记录
或称为域名服务器记录 （Name server record），是为域或子域设置对应的域名服务器。你的主要域名服务器记录既可以在注册商处设置，也可以在你的区域文件中设置。

典型域名服务记录(至少需要2个记录)例如：
```
example.com     NS      ns1.linode.com.
example.com     NS      ns2.linode.com.
example.com     NS      ns3.linode.com.
example.com     NS      ns4.linode.com.
example.com     NS      ns5.linode.com.
```
您在注册商处指定的域名服务器随后会为您的域名提供区域文件。

您还可以为任何子域设置不同的域名服务器。子域 NS 记录在主域的区域文件中配置。例如，如果您使用的是 Linode 的域名服务器，则可以在 Linode 的区域文件中为子域mail.example.com配置单独的 NS 记录，如下所示：
```
mail.example.com    NS      ns1.nameserver.com
mail.example.com    NS      ns2.nameserver.com
```

在您的注册商处配置了主要域名服务器，接下来则在主域的区域文件中配置子域名服务器。NS 记录的顺序无关紧要。DNS 请求随机发送到不同的服务器，如果一个主机无法响应，将查询另外一个主机。

### PTR 记录

或称指针记录（Pointer record）将IP地址匹配至一个域或子域，它允许反向的DNS查询工作。它执行与A记录相反的操作，允许查找与指定IP相关的域名。

PTR 记录通常由您的主机服务提供商设置。它们不属于您域中的区域文件。

作为添加 PTR 记录的先决条件，您需要创建一个有效且实时的 A 或 AAAA 记录，将所需的域指向该 IP。

### SOA 记录

或称起始权限记录（start of authority record），给区域文件使用最初创建的主机名作为标签。接下来它列出了负责该域的人员的联系方式，以及各种样式数字。

典型示例:
```
@   IN  SOA ns1.linode.com. admin.example.com. 2013062147 14400 14400 1209600 86400
```
注意：管理电子邮件地址使用句点（.）而不是 @ 符号编写。

下面列出数字的含义：
- 序列号：此域的区域文件的修订号。它在文件更新时会发生变化。
- 刷新时间：辅助 DNS 服务器在检查更改之前保留区域文件的时间（以秒为单位）。
- 重试时间：辅助 DNS 服务器在重试传输失败的区域文件之前需要等待的时间。
- 过期时间：辅助 DNS 服务器无法自行更新时，当前区域文件副本失效之前所等待的时间。
- 最短 TTL：其他服务器应从该区域文件中保留缓存数据的最短时间。
- SOA 记录中提到的单个域名服务器被视为动态 DNS 的第一服务器，并且是将区域文件传播到所有其他域名服务器之前，区域文件就要被更改完成的所在。

SOA 记录中提到的单个域名服务器被视为动态 DNS 的第一服务器，并且是将区域文件传播到所有其他域名服务器之前，区域文件就要被更改完成的所在。
### SPF
SPF 记录或称发送方政策框架记录（Sender Policy Framework record），列出了域或子域所指定的邮件服务器。它有助于确定邮件服务器的合法性，并减少欺骗的可能性（当有人伪造电子邮件的标题，使其看起来像是来自您的域时）。垃圾邮件发送者有时会尝试这样做以绕过过滤器。

您域中的 SPF 记录告诉其他接收邮件服务器哪些外发服务器是有效的电子邮件来源，以便他们可以从您的域拒绝来自未授权服务器的欺骗邮件。一个非常基本的 SPF 记录如下所示：

example.com   TXT     "v=spf1 a ~all"
在 SPF 记录中，您应列出发送邮件的所有邮件服务器，然后排除所有其他邮件服务器。您的 SPF 记录将具有域或子域，类型（如果您的域名服务器支持，可选 TXT 或 SPF）和文本（以“v = spf1”开头，并包含 SPF 记录设置）。

如果您的 Linode 是您使用的唯一邮件服务器，您应该能使用上述的示例记录。使用该 SPF 记录，接收服务器将检查发送服务器的 IP 地址和example.com的 IP 地址。如果 IP 匹配，则检查通过。如果不是，则检查将“软失败”（即标记该消息，但不会因 SPF 检查失败而自动拒绝）。
注意：确保您的 SPF 记录不会太严格。如果您不小心排除了合法邮件服务器，其邮件可能会被标记为垃圾邮件。我们建议您访问 openspf.org 以了解 SPF 记录的工作原理，以及如何构建适用于您的设置的记录。他们给出的例子也很有帮助。
### SRV
SRV 记录或称服务记录（Service record）将运行在您的域或子域上的指定服务匹配到一个目标与。这允许您将特定服务（如即时消息）的流量定向到另一台服务器。典型的 SRV 记录如下所示：

_service._protocol.example.com  SRV     10      0       5060    service.example.com
下面分别解释 SRV 记录中的元素：

服务：服务名称必须以下划线（_）开头，随后紧跟句点（.）。该服务可能类似于_xmpp。
协议：协议的名称必须以下划线（_）开头，随后紧跟句点（.）。该协议可能类似于_tcp。
域：将接收此服务的原始流量的域名称。
优先级：第一个数字（上例中为 10）允许您设置目标服务器的优先级。您可以使用不同的优先级设置不同的目标，这令您可以拥有该服务的备用服务器（或多个服务器）。较低的数字具有较高的优先级。
权重：如果两个记录具有相同的优先级，则需要对比权重。
端口：运行服务的 TCP 或 UDP 端口。
目标：目标域或目标子域。此域必须具有解析为 IP 地址的 A 或 AAAA 记录。
SRV 记录的一个用途示例 —— 设置联合 VoIP。

文本
TXT记录或称文本记录（Text record），向因特网上的其他资源提供有关该域的信息。它是一种灵活的 DNS 记录类型，可根据具体内容提供多种用途。TXT 记录的一个常见用途是在域名服务器上创建 SPF 记录，而该记录本身不支持 SPF。另一个用途则是为邮件签名创建 DKIM 记录。
## 实践：自建dnsmasq DNS server

Dnsmasq 提供 DNS 缓存和 DHCP 服务功能。作为域名解析服务器(DNS)，dnsmasq可以通过缓存 DNS 请求来提高对访问过的网址的连接速度。作为DHCP 服务器，dnsmasq 可以用于为局域网电脑分配内网ip地址和提供路由。DNS和DHCP两个功能可以同时或分别单独实现。dnsmasq轻量且易配置，适用于个人用户或少于50台主机的网络。此外它还自带了一个 PXE 服务器。

主要功能：
- 作为本地DNS server 直接修改本地DNS的ip地址即可
- 应对ISP的DNS劫持（反DNS劫持），输入一个不存在的域名，正常的情况下浏览器是显示无法连接，DNS劫持会跳转到一个广告页面。先随便nslookup 一个不存在的域名，看看ISP商劫持的IP地址。

- 智能DNS加快解析速度，打开/etc/dnsmasq.conf文件，server=后面可以添加指定的DNS，例如国内外不同的网站使用不同的DNS。

### Dnsmasq安装

yum/apt install dnsmasq -y 
sudo systemctl start  dnsmasq.service

启动服务后，可 netstat -ano|grep 53查看默认端口是否启动。
### Dnsmasq配置

- Dnsmasq的配置文件是放在 /etc/dnsmasq.conf 中。


#### 防止不存在域名（NXDOMAIN）伪造（bogus）（即域名劫持）

为了防止域名劫持（即不相信最近域名服务器提供的解析结果），可设置 bogus-nxdomain 选项，令dnsmasq强行查询域名注册服务器获取相应内容。

DNS反劫持设置举例：
```
bogus-nxdomain=x.x.x.x
```
x.x.x.x是劫持域名的服务器地址，这一设置意味着不在相信该服务器。

将会被污染的域名发送到不会污染的域名服务器
```server=/talk.google.com/8.8.4.4```

#### 指定权威dns
```
#国内指定DNS
server=/cn/114.114.114.114
server=/taobao.com/114.114.114.114
server=/taobaocdn.com/114.114.114.114
#国外指定DNS
server=/google.com/223.5.5.5
```
server=/cn/表示所有的cn域名都使用114这个公共DNS，server=/taobao.com/表示所有的taobao.com域名都用114，223.5.5.5 是阿里云的公共DNS。

这些设置也可以放入系统提供的dns设置文件：/etc/resolv.conf中，设置方式略有不同而已。
#### 屏蔽网页广告

将指广告的URL指定127这个IP，就可以将网页上讨厌的广告给去掉了。
```
address=/ad.youku.com/127.0.0.1
address=/ad.iqiyi.com/127.0.0.1
```

#### 指定域名解析到特定的IP上

这个功能可以让你控制一些网站的访问，非法的DNS就经常把一些正规的网站解析到不正确IP上。

address=/freehao123.com/123.123.123.123

这个功能的代替方法是，设置本dns服务器linux系统提供/etc/hosts文件，将ip地址和域名按行写入即可达到相同目的。

dnsmasq的基本思路就是以host文件为A记录。

#### 内网DNS
首先将局域网中的所有的设备的本地DNS设置为已经安装Dnsmasq的服务器IP地址。

然后修改已经安装Dnsmasq的服务器Hosts文件：/etc/hosts，指定域名到特定的IP中。

例如想让局域网中的所有用户访问www.freehao123.com时跳转到192.168.0.2，添加：192.168.0.2 www.freehao123.com在Hosts文件中既可，整个过程也可以说是“DNS劫持”。
#### 配置 A 、 MX等记录

#修改A记录
address=/www.163.com/1.2.3.4

#修改mx记录
mx-host=126.com,m.126.com,10
mx-host=163.com,m.163.com,10

修改其它记录可参考配置文件中的注释。

#### 监听所有网卡
vim /etc/dnsmasq.conf
#监听所有网卡
bind-interfaces
### 小结

设置好后，可以用`dig 域名 A `等命令查询相关记录内容。

windows下也可以用nslookup 查询域名ip对应关系。