# openssl 工具

OpenSSL 是一个密码学工具套件，实现了SSL和TLS的网络协议以及相关安全标准。

它包含了各种密码学工具，可用于
- 生成和管理私钥、公钥、参数
- 公钥密码学操作
- 生成x.509证书，CSR， CRLs
- 计算消息摘要
- 加密和解密
- SSL/TLS客户端和服务器测试
- 处理S/MIME签名的获加密的邮件
- 时间戳请求，生成和验证

openssl提供了非常多的命令，每个命令还有很多参数。

下列伪命令可以输出所有标准命令的列表：
- list-standard-commands
- list-message-digest-commands
- list-cipher-commands
- list-cipher-algorithms 
- list-message-digest-algorithms
- list-public-key-algorithms


例如：```openssl list-standard-commands```

```openssl command [command_options] [command_args]```

## 标准命令

- asn1parse Parse an ASN.1 sequence.

- ca  证书授权管理      Certificate Authority (CA) Management.

- ciphers 密码套件描述确定  Cipher Suite Description Determination.

- cms   密码学消息语法    CMS (Cryptographic Message Syntax) utility

- crl   证书撤销列表    Certificate Revocation List (CRL) Management.

- crl2pkcs7 CRL to PKCS#7 Conversion.

- dgst 消息摘要计算   Message Digest Calculation.

- dh   DH参数管理     Diffie-Hellman Parameter Management.  Obsoleted by dhparam.

- dhparam 生成和管理Diffie-Hellman参数  Generation and Management of Diffie-Hellman Parameters.
         Superseded by genpkey and pkeyparam

- dsa  DSA（一种签名算法）数据管理     DSA Data Management.

- dsaparam  DSA Parameter Generation and Management. Superseded by genpkey
          and pkeyparam

- ec  椭圆曲线密钥处理   EC (Elliptic curve) key processing

- ecparam 椭圆曲线参数操作和生成  EC parameter manipulation and generation

- enc  使用密码学方法编码     Encoding with Ciphers.

- engine 引擎信息和操作   Engine (loadble module) information and manipulation.

- errstr 错误数到错误字符的转换   Error Number to Error String Conversion.

- gendh  生成DH参数   Generation of Diffie-Hellman Parameters.  Obsoleted by dhparam.

- gendsa 根据参数生成DSA私钥 ，被genpkey和pkey取代  Generation of DSA Private Key from Parameters. Superseded by  genpkey and pkey

- genpkey 生成私钥或参数  Generation of Private Key or Parameters.

- genrsa 生成RSA私钥，被genpkey取代   Generation of RSA Private Key. Superceded by genpkey.

- nseq  生成或检查一个netscape证书序列    Create or examine a netscape certificate sequence

- ocsp   在线证书状态协议工具   Online Certificate Status Protocol utility.

- passwd 生成hashed口令   Generation of hashed passwords.

- pkcs12    PKCS#12 Data Management.

- pkcs7     PKCS#7 Data Management.

- pkey      Public and private key management.

- pkeyparam Public key algorithm parameter management.

- pkeyutl   Public key algorithm cryptographic operation utility.

- rand      Generate pseudo-random bytes.

- req  PKCS#10 x.509 证书签名请求 （CSR) 管理     PKCS#10 X.509 Certificate Signing Request (CSR) Management.

- rsa       RSA key management.

- rsautl    RSA utility for signing, verification, encryption, and decryption. Superseded by  pkeyutl

- s_client  This implements a generic SSL/TLS client which can establish a transparent connection to a remote server speaking SSL/TLS.  It's intended for testing purposes only and provides only rudimentary interface functionality but internally uses mostly all functionality of the OpenSSL ssl library.

- s_server  This implements a generic SSL/TLS server which accepts connections from remote clients speaking SSL/TLS. It's intended for testing purposes only and provides only rudimentary interface functionality but internally uses mostly all functionality of the OpenSSL ssl library.  It provides both an own command line oriented protocol for testing SSL functions and a simple HTTP response facility to emulate an SSL/TLS-aware   webserver.

- s_time    SSL Connection Timer.

- sess_id   SSL Session Data Management.

- smime     S/MIME mail processing.

- speed     Algorithm Speed Measurement.

- spkac     SPKAC printing and generating utility

- ts        Time Stamping Authority tool (client/server)

- verify    X.509 Certificate Verification.

- version   OpenSSL Version Information.

- x509      X.509 Certificate Data Management.

## MESSAGE DIGEST COMMANDS
- md2       MD2 Digest

- md5       MD5 Digest

- mdc2      MDC2 Digest

- rmd160    RMD-160 Digest

- sha       SHA Digest

- sha1      SHA-1 Digest


- sha224    SHA-224 Digest

- sha256    SHA-256 Digest

- sha384    SHA-384 Digest

- sha512    SHA-512 Digest

## ENCODING AND CIPHER COMMANDS
- base64    Base64 Encoding

- bf bf-cbc bf-cfb bf-ecb bf-ofb      Blowfish Cipher

- cast cast-cbc      CAST Cipher

- cast5-cbc cast5-cfb cast5-ecb cast5-ofb      CAST5 Cipher

- des des-cbc des-cfb des-ecb des-ede des-ede-cbc des-ede-cfb des-ede-ofb
- des-ofb       DES Cipher

- des3 desx des-ede3 des-ede3-cbc des-ede3-cfb des-ede3-ofb        Triple-DES Cipher

- idea idea-cbc idea-cfb idea-ecb idea-ofb       IDEA Cipher

- rc2 rc2-cbc rc2-cfb rc2-ecb rc2-ofb       RC2 Cipher

- rc4       RC4 Cipher

- rc5 rc5-cbc rc5-cfb rc5-ecb rc5-ofb         RC5 Cipher

## PASS PHRASE ARGUMENTS
- Several commands accept password arguments, typically using -passin and
- -passout for input and output passwords respectively. These allow the
- password to be obtained from a variety of sources. Both of these options
- take a single argument whose format is described below. If no password
- argument is given and a password is required then the user is prompted to
- enter one: this will typically be read from the current terminal with
- echoing turned off.

- pass:password
-           the actual password is password. Since the password is visible
-           to utilities (like 'ps' under Unix) this form should only be
-           used where security is not important.

- env:var   obtain the password from the environment variable var. Since
-           the environment of other processes is visible on certain
-           platforms (e.g. ps under certain Unix OSes) this option should
-           be used with caution.

- file:pathname
-           the first line of pathname is the password. If the same
-           pathname argument is supplied to -passin and -passout arguments
-           then the first line will be used for the input password and the
-           next line for the output password. pathname need not refer to a
-           regular file: it could for example refer to a device or named
-           pipe.

- fd:number read the password from the file descriptor number. This can be
-           used to send the data via a pipe for example.

- stdin     read the password from standard input.


