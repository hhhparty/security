# 传输层安全简明手册

## 介绍

该备忘单提供有关如何使用传输层安全性（TLS）为应用程序实施传输层保护的指南。正确实施后，TLS可以提供​​许多安全优势：

- 机密性-防止攻击者读取流量内容。
- 完整性-防止攻击者修改流量。
- 防止重放-防止攻击者重放针对服务器的请求。
- 身份验证-允许客户端验证它们是否已连接到真实服务器（请注意，除非使用客户端证书，否则不验证client的身份）。

TLS被许多其他协议借用，实现数据加密和完整性，并且有多种不同的应用方式。本文主要侧重于如何使用TLS保护通过HTTPS连接到Web应用程序的客户端。

### SSL与TLS

安全套接字层（SSL）是用于以HTTPS形式为HTTP通信提供加密的原始协议。SSL有两个公开发布的版本：版本2和版本3。这两个版本都有严重的加密漏洞，因此不应再使用。

由于[各种原因](http://tim.dierks.org/2014/05/security-standards-and-name-changes-in.html)，该协议的下一个版本（可能是SSL 3.1）被称为传输层安全性（TLS）1.0版。随后TLS版本1.1、1.2和1.3已发布。

术语“ SSL”，“ SSL / TLS”和“ TLS”经常互换使用，并且许多情况下使用“ SSL”指代更现代的TLS协议。该备忘单将使用术语“ TLS”，除非提及旧协议。

## 服务器配置

### 仅支持强协议

SSL协议具有许多弱点，因此在任何情况下均不应使用。通用Web应用程序应仅支持TLS 1.2和TLS 1.3，并且禁用所有其他协议。如果已知Web服务器必须使用不受支持的不安全浏览器（例如Internet Explorer 10）来支持旧版客户端，则可能有必要启用TLS 1.0来提供支持。

如果需要旧版协议，则应启用[“ TLS_FALLBACK_SCSV”扩展名](https://tools.ietf.org/html/rfc7507)，以防止对客户端进行降级攻击。

请注意，PCI DSS [禁止使用TLS 1.0等旧协议](https://www.pcisecuritystandards.org/documents/Migrating-from-SSL-Early-TLS-Info-Supp-v1_1.pdf)

### 仅支持强密码

TLS支持大量不同的密码学套件，它们提供不同级别的安全性。在可能的情况下，仅应启用GCM加密模式的密码。但是，如果有必要支持旧版客户端，则可能需要其他密码。

至少应始终禁用以下类型的 ciphers ：
- 空 ciphers
- 匿名 ciphers
- EXPORT ciphers

有关安全配置ciphers的完整详细信息，请参见 TLS Cipher String Cheat Sheet。

### 使用强Diffie-Hellman参数

如果使用使用临时Diffie-Hellman密钥交换的密码（由密码名称中的“ DHE”或“ EDH”字符串表示），则应使用足够安全的Diffie-Hellman参数（至少2048位）

以下命令可用于生成2048位参数：
```openssl dhparam 2048 -out dhparam2048.pem```



[Weak DH](https://weakdh.org/sysadmin.html) 网站提供了有关如何配置各种Web服务器以使用这些生成的参数的指南。

### 禁用压缩

应当禁用TLS压缩，以防止出现漏洞（绰号 [CRIME](https://threatpost.com/crime-attack-uses-compression-ratio-tls-requests-side-channel-hijack-secure-sessions-091312/77006/) ），这可能会允许攻击者恢复敏感信息（例如会话cookie）。

### 修补密码学库

除了SSL和TLS协议中的设计漏洞外，SSL和TLS的实现库中也存在大量历史漏洞，其中 [Heartbleed](http://heartbleed.com/) 是最著名的。因此，重要的是要确保这些库与最新的安全补丁保持最新。

### 测试服务器配置

加固服务器后，应对配置进行测试。[ [OWASP关于SSL/TLS测试的测试指南](https://owasp.org/www-project-web-security-testing-guide/stable/4-Web_Application_Security_Testing/09-Testing_for_Weak_Cryptography/01-Testing_for_Weak_SSL_TLS_Ciphers_Insufficient_Transport_Layer_Protection.html)一章。有关测试的更多信息。

有许多在线工具可用于快速验证服务器的配置，包括：
- [SSL Labs Server Test](https://www.ssllabs.com/ssltest)
- [CryptCheck](https://cryptcheck.fr/)
- [CypherCraft](https://www.cyphercraft.io/)
- [Hardenize](https://www.hardenize.com/)
- [ImmuniWeb](https://www.immuniweb.com/ssl/)
- [Observatory by Mozilla](https://observatory.mozilla.org)

此外，可以使用许多离线工具：

- [O-Saft - OWASP SSL advanced forensic tool](https://wiki.owasp.org/index.php/O-Saft)
- [CipherScan](https://github.com/mozilla/cipherscan)
- [CryptoLyzer](https://gitlab.com/coroner/cryptolyzer)
- [SSLScan - Fast SSL Scanner](https://github.com/rbsec/sslscan)
- [SSLyze](https://github.com/nabla-c0d3/sslyze)
- [testssl.sh - Testing any TLS/SSL encryption](https://testssl.sh)
- [tls-scan](https://github.com/prbinu/tls-scan)

## 证书

### 使用强密钥并保护它们

在私钥和相应证书的预期寿命内，用于生成密码密钥的私钥必须足够强。当前的最佳实践是选择至少2048位的密钥大小。有关密钥生存期和可比较的密钥强度的其他信息，可以在[此处](http://www.keylength.com/en/compare/)和[ NIST SP 800-57 ](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-57pt1r4.pdf)中找到。

还应该使用文件系统权限以及其他技术和管理控制措施防止私钥遭到未经授权的访问。

### 使用强密码学散列算法

证书应使用 SHA-512 或 SHA-256 作为哈希算法，而不是旧的MD5和SHA-1算法。老的算法具有许多加密漏洞，并且不被现代浏览器信任。

### 使用正确的域名

证书的域名（或主体）必须与提供证书的服务器的标准名称（qualified name）匹配。历史上，它存储在证书的```commonName```（CN）属性中。但是，现代版本的Chrome会忽略CN属性，并要求FQDN位于 ```subjectAlternativeName```（SAN）属性中。出于兼容性原因，证书应在CN中具有主FQDN，并在SAN中具有FQDN的完整列表。

此外，在创建证书时，应考虑以下因素：

- 考虑是否包含“ www”子域。
- 不要包含不合格的主机名。
- 不包括IP地址。
- 不要在面向外部的证书上包含内部域名。
  - 如果使用内部和外部FQDN均可访问服务器，请为它配置多个证书。

### 仔细考虑使用通配符证书

通配符证书可能很方便，但是它们违反了[最低特权的原则](https://wiki.owasp.org/index.php/Least_privilege)，因为单个证书对域的所有子域均有效（例如* .example.org）。在多个系统共享通配符证书的情况下，密钥可能存在于多个系统上，证书的私钥被泄露的可能性增加。此外，此密钥的价值大大提高，使其成为攻击者更具吸引力的目标。

有关使用通配符证书的问题非常复杂，还有[各种](https://blog.sean-wright.com/wildcard-certs-not-quite-the-star/)其他 [讨论](https://gist.github.com/joepie91/7e5cad8c0726fd6a5e90360a754fc568)。

在评估使用通配符证书的风险时，应考虑以下方面：

- 仅在真正需要的地方使用通配符证书，而不是为了方便。
 - 考虑使用[ACME]（https://en.wikipedia.org/wiki/Automated_Certificate_Management_Environment），以允许系统自动请求并更新自己的证书。
- 切勿对不同信任级别的系统使用通配符证书。
  - 两个VPN网关可以使用共享的通配符证书。
  - Web应用程序的多个实例可以共享证书。
  - VPN网关和公共网络服务器“不应”共享通配符证书。
  - 公共Web服务器和内部服务器“不应”共享通配符证书。
- 考虑使用执行TLS终止的反向代理服务器，以便仅在一个系统上存在通配符私钥。
- 应该保留所有共享证书的系统的列表，以便在证书过期或被破坏时对所有系统进行更新。
- 通过为子域（例如* .foo.example.org）或单独的域颁发通配符证书来限制通配符证书的范围。

### 为应用程序的用户群使用适当的证书颁发机构

为了受到用户的信任，证书必须由受信任的证书颁发机构（CA）签名。对于面向Internet的应用程序，这应该是众所周知的CA之一，并由操作系统和浏览器自动信任。

[LetsEncrypt](https://letsencrypt.org) CA提供免费的域验证的SSL证书，所有主要浏览器都信任该证书。因此，请考虑从CA购买证书是否有任何好处。

对于内部应用程序，可以使用内部CA。这意味着将不会暴露证书的FQDN（暴露给外部CA或在证书透明度列表中公开）。但是，只有导入并信任用于签名的内部CA证书的用户才能信任该证书。

### 使用CAA记录来限制可以颁发证书的CA

证书颁发机构授权（CAA）DNS记录可用于定义允许哪些CA颁发域证书。记录包含一个CA列表，该列表中未包括的任何CA都应拒绝颁发该域的证书。这可以帮助防止攻击者通过信誉较差的CA获得域的未经授权的证书。在将其应用于所有子域的情况下，从管理角度来看，它还可以通过限制CA管理员或开发人员可以使用的CA，并防止它们获得未经授权的通配符证书来使用。

### 始终提供所有需要的证书

为了验证证书的真实性，用户的浏览器必须检查用于签名的证书，并将其与系统信任的CA列表进行比较。在许多情况下，证书不是由根CA直接签名的，而是由中间CA签名的，中间CA又由根CA签名的。

如果用户不知道或不信任该中间CA，则即使用户信任最终的根CA，证书验证也会失败，因为他们无法在证书和根之间建立信任链。为了避免这种情况，应在主证书旁边提供任何中间证书。

### 考虑使用扩展验证证书

扩展验证（EV）证书声称可以提供更高级别的实体验证，因为它们执行检查请求者是否为合法的法人实体，而不是像普通的那样验证域名的所有权（或“域名已验证”）证书。可以有效地将其视为“此网站实际上是由Example Company Inc.经营”之间的区别。与“此域实际上是example.org”。

从历史上看，这些内容在浏览器中的显示方式有所不同，通常在地址栏中显示公司名称或绿色图标或背景。但是，从2019年开始，[Chrome]（https://groups.google.com/a/chromium.org/forum/m/#!msg/security-dev/h1bTcoTpfeI/jUTk1z7VAAAJ）和[Firefox]（https：/ /groups.google.com/forum/m/?fromgroups&hl=zh_CN/topic/firefox-dev/6wAg_PpnlY4）宣布将删除这些指标，因为他们认为EV证书不会提供任何其他保护。

EV证书的使用没有安全方面的缺点。但是，由于它们比域验证证书贵得多，因此应该进行评估以确定它们是否提供任何附加价值。

## 应用

### 对所有页面使用TLS

TLS应该用于所有页面，而不仅仅是登录页面之类的敏感页面。如果有任何页面不强制使用TLS，则这些页面可能使攻击者有机会嗅探敏感信息（例如会话令牌），或将恶意JavaScript注入响应中以对用户进行其他攻击。

对于面向公众的应用程序，让Web服务器侦听端口80上未加密的HTTP连接，然后立即使用永久重定向（HTTP 301）对其进行重定向，以便为手动输入以下内容的用户提供更好的体验可能是合适的域名。然后，[HTTP严格传输安全性（HSTS)](#use-http-strict-transport-security)标头应支持此标头，以防止将来它们通过HTTP访问站点。

### 不要混合TLS和非TLS内容

通过TLS可用的页面不应包含通过未加密的HTTP加载的任何资源（例如JavaScript或CSS）文件。这些未加密的资源可能使攻击者可以嗅探会话cookie或将恶意代码注入页面。现代浏览器还将阻止尝试通过未加密的HTTP将活动内容加载到安全页面中的尝试。

### 使用 “Secure” Cookie标志

所有cookie均应标记为“ [安全](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Cookies#Secure_and_HttpOnly_cookies)”属性，该属性指示浏览器仅通过加密的HTTPS发送它们连接，以防止未加密的HTTP连接监听到它们。即使网站不侦听HTTP（端口80），这一点也很重要，因为在中间攻击中执行主动攻击的攻击者可能在端口80上向用户提供一个欺骗的Web服务器，以窃取其Cookie。

### 防止缓存敏感数据

尽管TLS在传输过程中为数据提供了保护，但是一旦到达请求系统，它就不会为数据提供任何保护。这样，此信息可以存储在用户浏览器的缓存中，也可以存储在配置为执行TLS解密的任何拦截代理中。

在响应中返回敏感数据的地方，应使用HTTP标头指示浏览器和任何代理服务器不要缓存信息，以防止将其存储或返回给其他用户。这可以通过在响应中设置以下HTTP标头来实现：

```
Cache-Control: no-cache, no-store, must-revalidate
Pragma: no-cache
Expires: 0
```

### 使用HTTP严格传输安全性(HSTS)

HTTP严格传输安全性（HSTS）指示用户的浏览器始终通过HTTPS请求该站点，并且还防止用户绕过证书警告。有关实现HSTS的更多信息，请参见[HTTP严格传输安全性摘要]（HTTP_Strict_Transport_Security_Cheat_Sheet.md）。

### 考虑使用客户端证书

在典型配置中，TLS与服务器上的证书一起使用，以便客户端能够验证服务器的身份，并在服务器之间提供加密连接。但是，此方法有两个主要缺点：

- 服务器没有任何机制可以验证客户端的身份
- 能够获得该域有效证书的攻击者可以拦截该连接。
  - 企业最常使用的方法是在客户端系统上安装受信任的CA证书来执行TLS流量检查。

客户端证书通过要求客户端使用自己的证书向服务器证明其身份来解决这两个问题。这不仅可以提供对客户端身份的强身份验证，还可以防止中间方执行TLS解密，即使中间方在客户端系统上拥有受信任的CA证书也是如此。

由于许多问题，客户端证书很少在公共系统上使用：

- 颁发和管理客户端证书会带来大量的管理开销。
- 非技术用户可能难以安装客户端证书。
- 许多组织使用的TLS解密将导致客户端证书身份验证失败。

但是，对于高价值的应用程序或API，应该考虑使用它们，特别是在技术上复杂的用户数量很少或所有用户都属于同一组织的情况下。

### 考虑使用公钥固定

公钥固定可用于确保服务器证书不仅有效且受信任，而且还与服务器预期的证书匹配。通过利用验证过程中的弱点，破坏受信任的证书颁发机构或对客户端具有管理访问权限，这可以防止攻击者能够获得有效证书。

公钥固定已添加到HTTP公钥固定（HPKP）标准的浏览器中。但是，由于许多问题，它随后被弃用，不再推荐或[不受现代浏览器的支持]（https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Public -Key-Pins）。

但是，公钥固定仍然可以为移动应用程序，胖客户端和服务器到服务器的通信提供安全优势。在[Pinning Cheat Sheet]（Pinning_Cheat_Sheet.md）中将对此进行详细讨论。

## 相关文章

- OWASP - [TLS Cipher String Cheat Sheet](TLS_Cipher_String_Cheat_Sheet.md)
- OWASP - [Testing for SSL-TLS](https://owasp.org/www-project-web-security-testing-guide/stable/4-Web_Application_Security_Testing/09-Testing_for_Weak_Cryptography/01-Testing_for_Weak_SSL_TLS_Ciphers_Insufficient_Transport_Layer_Protection.html), and OWASP [Guide to Cryptography](https://wiki.owasp.org/index.php/Guide_to_Cryptography)
- OWASP - [Application Security Verification Standard (ASVS) - Communication Security Verification Requirements (V9)](https://github.com/OWASP/ASVS/blob/v4.0.1/4.0/en/0x17-V9-Communications.md)
- Mozilla - [Mozilla Recommended Configurations](https://wiki.mozilla.org/Security/Server_Side_TLS#Recommended_configurations)
- NIST - [SP 800-52 Rev. 1 Guidelines for the Selection, Configuration, and Use of Transport Layer Security (TLS) Implementations](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-52r2.pdf)
- NIST - [NIST SP 800-57 Recommendation for Key Management, Revision 3](http://csrc.nist.gov/publications/nistpubs/800-57/sp800-57_part1_rev3_general.pdf), [Public DRAFT](http://csrc.nist.gov/publications/PubsDrafts.html#SP-800-57-Part%203-Rev.1)
- NIST - [SP 800-95 Guide to Secure Web Services](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-95.pdf)
- IETF - [RFC 5280 Internet X.509 Public Key Infrastructure Certificate and Certificate Revocation List (CRL) Profile](https://tools.ietf.org/html/rfc5280)
- IETF - [RFC 2246 The Transport Layer Security (TLS) Protocol Version 1.0 (JAN 1999)](https://tools.ietf.org/html/rfc2246)
- IETF - [RFC 4346 The Transport Layer Security (TLS) Protocol Version 1.1 (APR 2006)](https://tools.ietf.org/html/rfc4346)
- IETF - [RFC 5246 The Transport Layer Security (TLS) Protocol Version 1.2 (AUG 2008)](https://tools.ietf.org/html/rfc5246)
- Bettercrypto - [Applied Crypto Hardening: HOWTO for secure crypto settings of the most common services)](https://bettercrypto.org)