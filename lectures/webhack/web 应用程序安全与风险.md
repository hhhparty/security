# Web 应用程序安全与风险

本讲介绍以下内容：

- web 应用的发展历程
- web 系统的特点
- 常见的web漏洞
- web系统的核心安全问题
- web安全的最新发展趋势

## Web应用程序的发展历程

- 早期，WWW仅由Web站点构成，这些站点大多为静态网页，所含的隐私信息很少。多数站点不验证用户身份的合法性。

此时的web攻击主要是获得网站编辑权限，实现网页篡改。

- 如今，WWWW上的Web应用程序功能强大，支持注册于登录、很多网站存储了大量隐私信息，安全至关重要。

针对当前Web系统的攻击多种多样，以获取隐私信息为主，甚至通过控制web系统进而控制后台服务器的操作系统。

## Web 应用的常见功能与特点

- 社交
- 购物
- 金融
- 搜索
- 邮件
- ...

- 开发技术简单，所见即所得
- 统一的客户端（浏览器），使其更为通用
- 基于http、html、JavaScript等标准技术

## web 应用程序安全

> 参考 owasp top10 2017 中文文档


攻击者可以通过应用程序中许多不同的路径方法去危害您的业务或者企业组织。每种路径方法都代表了一种风险，这些风险可能会，也可能不会严重到值得您去关注。

![web应用安全风险示意图](images/01/web应用安全风险示意图.png)

有时，这些路径方法很容易被发现并利用，但有的则非常困难。同样，所造成的危害有可能无关紧要，也可能导致破产。为了确定您企业的风险，可以结合其产生的技术影响和对企业的业务影响，去评估威胁来源、攻击向量和安全漏洞的可能性。总之，这些因素决定了全部的风险。

OWASP 统计了十大Web安全威胁（2017版）：
![owasptop102017](images/01/owasptop102017.png)

### A1:2017 - 注入

将不受信任的数据作为命令或查询的一部分发送到解析器时，会产生诸如SQL注入、NoSQL注入、OS注入和LDAP注入的注入缺陷。攻击者的恶意数据可以诱使解析器在没有适当授权的情况下执行非预
期命令或访问数据。

#### 应用描述

几乎任何数据源都能成为注入载体，包括环境变量、所有类型的用户、参数、外部和内部Web服务。当攻击者可
以向解释器发送恶意数据时，注入漏洞产生。
#### 普遍性
注入漏洞十分普遍，尤其是在遗留代码中。注入漏洞通常能在SQL、LDAP、XPath或是NoSQL查询语句、OS命令、XML解析器、SMTP包头、表达式语句及ORM查询语句中找到。

注入漏洞很容易通过代码审查发现。扫描器和模糊测试工具可以帮助攻击者找到这些漏洞。

#### 业务影响
注入能导致数据丢失、破坏或泄露给无授权方，缺乏可审计性或是拒绝服务。注入有时甚至能导致主机被完全接管。您的应用和数据需要受到保护，以避免对业务造成影响。
#### 脆弱的web应用

应用程序脆弱吗？
当您的应用在如下时点时，是脆弱的并易受到攻击：
- 用户提供的数据没有经过应用程序的验证、过滤或净化。
- 动态查询语句或非参数化的调用，在没有上下文感知转义的情况下，被用于解释器。
- 在ORM搜索参数中使用了恶意数据，这样搜索就获得包含敏感或未授权的数据。
- 恶意数据直接被使用或连接，诸如SQL语句或命令在动态查询语句、命令或存储过程中包含结构和恶意数据。


一些常见的注入，包括：SQL、OS命令、ORM、LDAP和表达式语言（EL）或OGNL注入。所有解释器的概念都是相同的。代码评审是最有效的检测应用程序的注入风险的办法之一，紧随其后的是对所有参数、字段、头、cookie、JSON和XML数据输入的彻底的DAST扫描。组织可以将SAST和DAST工具添加到CI/CD过程中，以便于在生产部署之前对现有或新检查的代码进行注入问题的预警。

#### 如何防止？
防止注入漏洞需要将数据与命令语句、查询语句分隔开来。
- 最佳选择是使用安全的API，完全避免使用解释器，或提供参数化界面的接口，或迁移到ORM或实体框架。
- 注意：当参数化时，存储过程仍然可以引入SQL注入，如果PL/SQL或T-SQL将查询和数据连接在一起，或者执行带有立即执行或exec()的恶意数据。
- 使用正确的或“白名单”的具有恰当规范化的输入验证方法同样会有助于防止注入攻击，但这不是一个完整的防御，因为许多应用程序在输入中需要特殊字符，例如文本区域或移动应用程序的API。
- 对于任何剩余的动态查询，可以使用该解释器的特定转义语法转义特殊字符。OWASP的Java Encoder和类似的库提供了这样的转义例程。
- 注意：SQL结构，比如：表名、列名等无法转义，因此用户提供的结构名是非常危险的。这是编写软件中的一个常见问题。
- 在查询中使用LIMIT和其他SQL控件，以防止在SQL注入时大量地泄露记录。

#### 攻击案例场景

场景#1：应用程序在下面存在脆弱性的SQL语句的构造中使用不可信数据：
```
String query = "SELECT * FROM accounts WHERE custID='" + request.getParameter("id") + "'“;
```

场景#2：同样的，框架应用的盲目信任，仍然可能导致查询语句的漏洞。（例如：Hibernate查询语言（HQL））：
```
Query HQLQuery = session.createQuery("FROM accounts WHERE custID='" + request.getParameter("id") + "'");

```
在这两个案例中，攻击者在浏览器中将“id”参数的值修改成： 
```
’or’1’=’1。
```
例如：
```
http://example.com/app/accountView?id=' or '1'='1
```
这样查询语句的意义就变成了从accounts表中返回所有的记录。更危险的攻击可能导致数据被篡改甚至是存储过程被调用。

#### 参考资料

• OWASP Proactive Controls: Parameterize Queries
• OWASP ASVS: V5 Input Validation and Encoding
• OWASP Testing Guide: SQL Injection，Command Injection,ORM injection
• OWASP Cheat Sheet: Injection Prevention https://www.owasp.org/index.php/Injection_Prevention_Cheat_Sheet
• OWASP Cheat Sheet: SQL Injection Prevention https://www.owasp.org/index.php/SQL_Injection_Prevention_Cheat_Sheet
• OWASP Cheat Sheet: Injection Prevention in Java
• OWASP Cheat Sheet: Query Parameterization
• OWASP Automated Threats to Web Applications –OAT-014

OWASP Web Testing Environment (WTE)  可下载虚拟机环境 http://appseclive.org/downloads/
If you’re curious about application testing (web and API), then WTE offers you a complete, ready-to-use environment to start learning and start breaking. From the start, there have been a few design goals:Easy for users to keep updated；Easy for project lead to keep updated；Easy to produce releases (more on this later)；Focused on just application security – not general pen testing

### A2:2017-失效的身份认证

通常，通过错误使用应用程序的身份认证和会话管理功能，攻击者能够破译密码、密钥或会话令牌，
或者利用其它开发缺陷来暂时性或永久性冒充其他用户的身份。

### A3:2017-敏感数据泄露

许多Web应用程序和API都无法正确保护敏感数据，例如：财务数据、医疗数据和PII数据。攻击者可
以通过窃取或修改未加密的数据来实施信用卡诈骗、身份盗窃或其他犯罪行为。未加密的敏感数据
容易受到破坏，因此，我们需要对敏感数据加密，这些数据包括：传输过程中的数据、存储的数据
以及浏览器的交互数据。

### A4:2017-XML 外部实体（XXE）

许多较早的或配置错误的XML处理器评估了XML文件中的外部实体引用。攻击者可以利用外部实体窃
取使用URI文件处理器的内部文件和共享文件、监听内部扫描端口、执行远程代码和实施拒绝服务攻
击。

### A5:2017-失效的访问控制

未对通过身份验证的用户实施恰当的访问控制。攻击者可以利用这些缺陷访问未经授权的功能或数
据，例如：访问其他用户的帐户、查看敏感文件、修改其他用户的数据、更改访问权限等。

### A6:2017-安全配置错误

安全配置错误是最常见的安全问题，这通常是由于不安全的默认配置、不完整的临时配置、开源云
存储、错误的 HTTP 标头配置以及包含敏感信息的详细错误信息所造成的。因此，我们不仅需要对所
有的操作系统、框架、库和应用程序进行安全配置，而且必须及时修补和升级它们。

### A7:2017-跨站脚本（XSS）

当应用程序的新网页中包含不受信任的、未经恰当验证或转义的数据时，或者使用可以创建 HTML或
JavaScript 的浏览器 API 更新现有的网页时，就会出现 XSS 缺陷。XSS 让攻击者能够在受害者的浏览器
中执行脚本，并劫持用户会话、破坏网站或将用户重定向到恶意站点。

### A8:2017-不安全的反序列化

不安全的反序列化会导致远程代码执行。即使反序列化缺陷不会导致远程代码执行，攻击者也可以利用它们来执行攻击，包括：重播攻击、注入攻击和特权升级攻击。

### A9:2017-使用含有已知漏洞的组件

组件（例如：库、框架和其他软件模块）拥有和应用程序相同的权限。如果应用程序中含有已知漏洞的组件被攻击者利用，可能会造成严重的数据丢失或服务器接管。同时，使用含有已知漏洞的组件的应用程序和API可能会破坏应用程序防御、造成各种攻击并产生严重影响。

### A10:2017-不足的日志记录和监控

不足的日志记录和监控，以及事件响应缺失或无效的集成，使攻击者能够进一步攻击系统、保持持续性或转向更多系统，以及篡改、提取或销毁数据。大多数缺陷研究显示，缺陷被检测出的时间超过200天，且通常通过外部检测方检测，而不是通过内部流程或监控检测。