# Apache Web Server 2 SSL




mod_ssl 模块的配置在ssl.conf 中。


## 基本配置示例

你的SSL配置需要至少包含下列内容：

```conf
LoadModule ssl_module modules/mod_ssl.so

Listen 443
<VirtualHost *:443>
    ServerName www.example.com
    SSLEngine on
    SSLCertificateFile "/path/to/www.example.com.cert"
    SSLCertificateKeyFile "/path/to/www.example.com.key"
</VirtualHost>
```

## 密码套件和强制强安全

### 如何生成一个仅接受强加密的 SSL server ？

下列配置将开启仅使用最强的密码：
```SSLCipherSuite HIGH:!aNULL:!MD5```

下列配置，你可疑指定一个速度优化的密码（由mod_ssl 选择，提供给支持的客户端）

```
SSLCipherSuite RC4-SHA:AES128-SHA:HIGH:!aNULL:!MD5
SSLHonorCipherOrder on
```

### 如何生成一滩接受所有通用类型民吗的SSL server，但要求强密码来访问一个指定的URL?

显然，此时使用服务器级别的 SSLCipherSuite 限制密码到强密码是不合适的。然而 mod_ssl 可能需要被重配置，加入 Location 块，对每个目录给一个设置，而且可以自动化地强制一个SSL参数的重新协商，以满足新配置要求。

可以进行如下操作：
```
# be liberal in general
SSLCipherSuite ALL:!aNULL:RC4+RSA:+HIGH:+MEDIUM:+LOW:+EXP:+eNULL

<Location "/strong/area">
# but https://hostname/strong/area/ and below
# requires strong ciphers
SSLCipherSuite HIGH:!aNULL:!MD5
</Location>
```

## OSCP stapling 装订

在线证书状态协议 OSCP ，是一种用于判定服务器证书是否已经被撤销的机制（revoked）机制，而 OCSP Stapling 是在服务器中的一种特定形式，例如httpd 和 mod_ssl，为其证书维持着当前OCSP 响应，并发送这些OCSP响应给与服务器通信的客户端。

许多证书包含着一个OCSP 响应者的地址，OCSP响应者由颁发证书颁发机构维护。mod_ssl 可疑与响应者通信，获取一个签名的响应，该响应可疑被发送到客户端。

因为客户端从服务器获得证书的撤销状态，没有要求额外从客户端到证书授权机构的连接，OCSP 装订是一种较好的证书状态查询方式。这种方式不仅减少了访问，也避免了客户端访问记录暴露给证书授权机构，也使这一服务更可靠（不依赖于重部署的证书授权服务器）。

由于从服务器获得的响应可以被所有使用同一证书的客户端在同一响应有效时间内所重用，这对于服务器的负载要求是微小的。

一旦通用SSL支持被配置正确，启动 OCSP Stapling 通常仅要求对 httpd 配置进行非常少的修改。例如：

```
SSLUseStapling On
SSLStaplingCache "shmcb:logs/ssl_stapling(32768)"
```

上述配置指令被放在全局域种（不在某个虚拟主机定义种），无论别的全局SSL 配置指令被放在哪儿，例如：对正常开源的httpd builds在 ```conf/extra/httpd-ssl.conf``` ，对Ubuntu或Debian-bundled httpd而言在 ```/etc/apache2/mods-enabled/ssl.conf```。

## 客户认证和访问控制

### 如何强制客户端使用证书认证？

当你了解你所有的客户（如企业内部），你可疑要求一致的证书认证。你需要做的就是通过你自己的CA证书（ca.crt）生成签名的客户证书，然后用证书验证客户端。

```conf
# require a client certificate which has to be directly
# signed by our CA certificate in ca.crt
SSLVerifyClient require
SSLVerifyDepth 1
SSLCACertificateFile "conf/ssl.crt/ca.crt"
```

### 如何强制客户端对某个特定URL使用证书认证，但仍然允许任意客户端访问剩余的服务器资源？

你可以使用 mod_ssl 逐个目录重配置特性:

```
SSLVerifyClient none
SSLCACertificateFile "conf/ssl.crt/ca.crt"

<Location "/secure/area">
SSLVerifyClient require
SSLVerifyDepth 1
</Location>
```

### 如何仅允许有证书的客户访问特定url，所有客户可以访问剩余的服务器？

这里的关键在于检查客户证书，匹配你希望的那些。通常这意味着检查全部或部分的区分名（Distinguished Name ，DN),看是否存在一致的字符串。有两种防范实现这点：

```mod_auth_basic``` 或 ```SSLRequire```


```mod_auth_basic``` 方法通常要求当证书完全任意的，或当他们的DNs没有一般字段（通常时组织名等），这时，你要建立一个包含所有允许访问的客户的密码库，例如：

```
SSLVerifyClient      none
SSLCACertificateFile "conf/ssl.crt/ca.crt"
SSLCACertificatePath "conf/ssl.crt"

<Directory "/usr/local/apache2/htdocs/secure/area">
    SSLVerifyClient      require
    SSLVerifyDepth       5
    SSLOptions           +FakeBasicAuth
    SSLRequireSSL
    AuthName             "Snake Oil Authentication"
    AuthType             Basic
    AuthBasicProvider    file
    AuthUserFile         "/usr/local/apache2/conf/httpd.passwd"
    Require              valid-user
</Directory>
```

这个例子中的密码，使用DES加密字串“password”：
```
#httpd.passwd
/C=DE/L=Munich/O=Snake Oil, Ltd./OU=Staff/CN=Foo:xxj31ZMTZzkVA
/C=US/L=S.F./O=Snake Oil, Ltd./OU=CA/CN=Bar:xxj31ZMTZzkVA
/C=US/L=L.A./O=Snake Oil, Ltd./OU=Dev/CN=Quux:xxj31ZMTZzkVA
```

当你的客户是通用架构的所有部分，已编码进DN，你可以使用SSLRequire简单地匹配他们，例如：
```
SSLVerifyClient      none
SSLCACertificateFile "conf/ssl.crt/ca.crt"
SSLCACertificatePath "conf/ssl.crt"

<Directory "/usr/local/apache2/htdocs/secure/area">
  SSLVerifyClient      require
  SSLVerifyDepth       5
  SSLOptions           +FakeBasicAuth
  SSLRequireSSL
  SSLRequire       %{SSL_CLIENT_S_DN_O}  eq "Snake Oil, Ltd." \
               and %{SSL_CLIENT_S_DN_OU} in {"Staff", "CA", "Dev"}
</Directory>
```

### 如何要求来自内部网络的客户使用基本认证，而来自互联网的客户使用证书，使用强密码的https？此外，希望来自内部的客户使用明文http访问。

假设内部客户的IP范围是 192.168.1.0/24, 而你希望允许部分内部网站允许互联网访问，这部分网页在 /usr/local/apache2/htdocs/subarea。配置应该保留在HTTPS虚拟主机外部，一致它可以应用到HTTPS和HTTP。


```
SSLCACertificateFile "conf/ssl.crt/company-ca.crt"

<Directory "/usr/local/apache2/htdocs">
    #   Outside the subarea only Intranet access is granted
    Require              ip 192.168.1.0/24
</Directory>

<Directory "/usr/local/apache2/htdocs/subarea">
    #   Inside the subarea any Intranet access is allowed
    #   but from the Internet only HTTPS + Strong-Cipher + Password
    #   or the alternative HTTPS + Strong-Cipher + Client-Certificate
    
    #   If HTTPS is used, make sure a strong cipher is used.
    #   Additionally allow client certs as alternative to basic auth.
    SSLVerifyClient      optional
    SSLVerifyDepth       1
    SSLOptions           +FakeBasicAuth +StrictRequire
    SSLRequire           %{SSL_CIPHER_USEKEYSIZE} >= 128
    
    #   Force clients from the Internet to use HTTPS
    RewriteEngine        on
    RewriteCond          "%{REMOTE_ADDR}" "!^192\.168\.1\.[0-9]+$"
    RewriteCond          "%{HTTPS}" "!=on"
    RewriteRule          "." "-" [F]
    
    #   Allow Network Access and/or Basic Auth
    Satisfy              any
    
    #   Network Access Control
    Require              ip 192.168.1.0/24
    
    #   HTTP Basic Authentication
    AuthType             basic
    AuthName             "Protected Intranet Area"
    AuthBasicProvider    file
    AuthUserFile         "conf/protected.passwd"
    Require              valid-user
</Directory>
```

### 日志

mod_ssl 可以记录非常详细的调试信息，记载到 error_log 文件中。