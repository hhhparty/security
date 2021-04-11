# SSLSCAN 

SSLSCAN 查询 SSL/TLS 服务（例如 https），报告下列内容，以帮助用户理解哪些参数是有漏洞的。
- 协议版本
- cipher suites
- key exchange
- 签名算法
- 在用证书

终端显示由不同颜色显示：
- 红色背景的输出：未加密，NULL cipher
- 红色文本：
  - 有缺陷的密码学方法（小于40bit的密钥）
  - 有问题的协议（sslv2，v3）
  - 有缺陷的证书签名算法，例如md5
- 黄色文本
  - 脆弱的cipher（小于56bit 或是 RC4算法）
  - 脆弱证书签名算法（sha-1)
- 紫色文本
  - 匿名cipher（ADH或AECDH)

## 原理
sslscan的原理
- ① sslscan通过创建多个https的连接来试探服务器支持的加密方式；
- ② 当使用https连接到服务器的时候，会交换双方所支持的加密方式，之后选择双发都能支持的方式进行通信；
- 如果https服务器配置不当，就会存在MITM攻击，攻击者就可以通过客户端支持的弱加密算法来欺骗服务器；
- 假如使用的是SSLV2的56位DES，当攻击者拦截并使用了这种加密流量过后，可能在很短时间之内就能够破解加密密钥。


## 常见的几种SSL/TLS漏洞及攻击方式


迄今为止，SSL/TLS已经阻止了基于SSL的无数次的网络攻击，本文介绍了SSL/TLS常见的几种漏洞以及过往的攻击方式，针对这些漏洞及攻击摒弃了老旧的加密算法，详细如下：


### Export 加密算法
Export是一种老旧的弱加密算法，是被美国法律标示为可出口的加密算法，其限制对称加密最大强度位数为40位，限制密钥交换强度为最大512位。这是一个现今被强制丢弃的算法。

### Downgrade（降级攻击）
降级攻击是一种对计算机系统或者通信协议的攻击，在降级攻击中，攻击者故意使系统放弃新式、安全性高的工作方式，反而使用为向下兼容而准备的老式、安全性差的工作方式，降级攻击常被用于中间人攻击，讲加密的通信协议安全性大幅削弱，得以进行原本不可能做到的攻击。 在现代的回退防御中，使用单独的信号套件来指示自愿降级行为，需要理解该信号并支持更高协议版本的服务器来终止协商，该套件是TLS_FALLBACK_SCSV(0x5600)

### MITM（中间人攻击）
MITM(Man-in-the-MiddleAttack) ，是指攻击者与通讯的两端分别创建独立的联系，并交换其所有收到的数据，使通讯的两端认为他们正在通过一个私密的连接与对方直接对话，但事实上整个对话都被攻击者完全控制，在中间人攻击中，攻击者可以拦截通讯双方的通话并插入新的内容。一个中间人攻击能成功的前提条件是攻击者能够将自己伪装成每个参与会话的终端，并且不被其他终端识破。

### BEAST（野兽攻击）
BEAST(CVE-2011-3389) BEAST是一种明文攻击，通过从SSL/TLS加密的会话中获取受害者的COOKIE值（通过进行一次会话劫持攻击），进而篡改一个加密算法的 CBC（密码块链）的模式以实现攻击目录，其主要针对TLS1.0和更早版本的协议中的对称加密算法CBC模式。

### RC4 加密算法
由于早期的BEAST野兽攻击而采用的加密算法，RC4算法能减轻野兽攻击的危害，后来随着客户端版本升级，有了客户端缓解方案（Chrome 和 Firefox 提供了缓解方案），野兽攻击就不是什么大问题了。同样这是一个现今被强制丢弃的算法。

### CRIME（罪恶攻击）
CRIME(CVE-2012-4929)，全称Compression Ratio Info-leak Made Easy，这是一种因SSL压缩造成的安全隐患，通过它可窃取启用数据压缩特性的HTTPS或SPDY协议传输的私密Web Cookie。在成功读取身份验证Cookie后，攻击者可以实行会话劫持和发动进一步攻击。

SSL 压缩在下述版本是默认关闭的： nginx 1.1.6及更高/1.0.9及更高（如果使用了 OpenSSL 1.0.0及更高）， nginx 1.3.2及更高/1.2.2及更高（如果使用较旧版本的 OpenSSL）。

如果你使用一个早期版本的 nginx 或 OpenSSL，而且你的发行版没有向后移植该选项，那么你需要重新编译没有一个 ZLIB 支持的 OpenSSL。这会禁止 OpenSSL 使用 DEFLATE 压缩方式。如果你禁用了这个，你仍然可以使用常规的 HTML DEFLATE 压缩。

### Heartbleed（心血漏洞）
Heartbleed(CVE-2014-0160) 是一个于2014年4月公布的 OpenSSL 加密库的漏洞，它是一个被广泛使用的传输层安全（TLS）协议的实现。无论是服务器端还是客户端在 TLS 中使用了有缺陷的 OpenSSL，都可以被利用该缺陷。由于它是因 DTLS 心跳扩展（RFC 6520）中的输入验证不正确（缺少了边界检查）而导致的，所以该漏洞根据“心跳”而命名。这个漏洞是一种缓存区超读漏洞，它可以读取到本不应该读取的数据。如果使用带缺陷的Openssl版本，无论是服务器还是客户端，都可能因此受到攻击。

### POODLE漏洞（卷毛狗攻击）
2014年10月14号由Google发现的POODLE漏洞，全称是Padding Oracle On Downloaded Legacy Encryption vulnerability，又被称为“贵宾犬攻击”（CVE-2014-3566），POODLE漏洞只对CBC模式的明文进行了身份验证，但是没有对填充字节进行完整性验证，攻击者窃取采用SSL3.0版加密通信过程中的内容，对填充字节修改并且利用预置填充来恢复加密内容，以达到攻击目的。

### TLS POODLE（TLS卷毛狗攻击）
TLS POODLE(CVE-2014-8730) 该漏洞的原理和POODLE漏洞的原理一致，但不是SSL3协议。由于TLS填充是SSLv3的一个子集，因此可以重新使用针对TLS的POODLE攻击。TLS对于它的填充格式是非常严格的，但是一些TLS实现在解密之后不执行填充结构的检查。即使使用TLS也不会容易受到POODLE攻击的影响。

### CCS
CCS(CVE-2014-0224) 全称openssl MITM CCS injection attack，Openssl 0.9.8za之前的版本、1.0.0m之前的以及1.0.1h之前的openssl没有适当的限制ChangeCipherSpec信息的处理，这允许中间人攻击者在通信之间使用0长度的主密钥。

### FREAK
FREAK(CVE-2015-0204) 客户端会在一个全安全强度的RSA握手过程中接受使用弱安全强度的出口RSA密钥，其中关键在于客户端并没有允许协商任何出口级别的RSA密码套件。

### Logjam
Logjam(CVE-2015-4000) 使用 Diffie-Hellman 密钥交换协议的 TLS 连接很容易受到攻击，尤其是DH密钥中的公钥强度小于1024bits。中间人攻击者可将有漏洞的 TLS 连接降级至使用 512 字节导出级加密。这种攻击会影响支持 DHE_EXPORT 密码的所有服务器。这个攻击可通过为两组弱 Diffie-Hellman 参数预先计算 512 字节质数完成，特别是 Apache 的 httpd 版本 2.1.5 到 2.4.7，以及 OpenSSL 的所有版本。

### DROWN（溺水攻击/溺亡攻击）
2016年3月发现的针对TLS的新漏洞攻击——DROWN（Decrypting RSA with Obsolete and Weakened eNcryption，CVE-2016-0800），也即利用过时的、弱化的一种RSA加密算法来解密破解TLS协议中被该算法加密的会话密钥。 具体说来，DROWN漏洞可以利用过时的SSLv2协议来解密与之共享相同RSA私钥的TLS协议所保护的流量。 DROWN攻击依赖于SSLv2协议的设计缺陷以及知名的Bleichenbacher攻击。

### 通常检查以下两点服务器的配置

服务器允许SSL2连接，需要将其关闭。
私钥同时用于允许SSL2连接的其他服务器。例如，Web服务器和邮件服务器上使用相同的私钥和证书，如果邮件服务器支持SSL2，即使web服务器不支持SSL2，攻击者可以利用邮件服务器来破坏与web服务器的TLS连接。
Openssl Padding Oracle
Openssl Padding Oracle(CVE-2016-2107) openssl 1.0.1t到openssl 1.0.2h之前没有考虑某些填充检查期间的内存分配，这允许远程攻击者通过针对AES CBC会话的padding-oracle攻击来获取敏感的明文信息。

### 强制丢弃的算法
aNULL 包含了非验证的 Diffie-Hellman 密钥交换，这会受到中间人（MITM）攻击
eNULL 包含了无加密的算法（明文）
EXPORT 是老旧的弱加密算法，是被美国法律标示为可出口的
RC4 包含的加密算法使用了已弃用的 ARCFOUR 算法
DES 包含的加密算法使用了弃用的数据加密标准（DES）
SSLv2 包含了定义在旧版本 SSL 标准中的所有算法，现已弃用
MD5 包含了使用已弃用的 MD5 作为哈希算法的所有算法