# 会话管理 CHEAT SHEET

## 介绍

**Web身份验证，会话管理和访问控制**：

Web会话是与同一用户关联的网络HTTP请求和响应事务的序列。现代复杂Web应用程序需要在多个请求期间保留每个用户的信息或状态，会话提供了建立变量的能力（例如访问权限和本地化设置），这些变量将在会话持续时间内应用于用户与Web应用程序的每次交互。

在第一个用户请求之后，Web应用程序可以创建会话来跟踪匿名用户。一个示例是保持用户语言首选项。此外，一旦用户通过身份验证，Web应用程序将使用会话。这确保了能够在任何后续请求上标识用户的能力，以及能够应用安全访问控制，对用户私人数据的授权访问以及增加应用程序的可用性。因此，当前的Web应用程序可以提供身份验证之前和之后的会话功能。

建立了经过身份验证的会话后，会话ID（或令牌（token））临时等同于应用程序使用的最强的身份验证方法，例如用户名和 口令（password），密码短语（passphrases），一次性密码（OTP），基于客户端的数字证书，智能卡或生物识别技术（例如指纹或视网膜）。请参阅OWASP [认证备忘单]（Authentication_Cheat_Sheet.md）。

HTTP是无状态协议（[RFC2616](https://www.ietf.org/rfc/rfc2616.txt) 第5节），其中每个请求和响应对均独立于其他Web交互。因此，为了介绍会话的概念，需要实现会话管理功能，该功能将Web应用程序中通常可用的身份验证和访问控制（或授权）模块链接在一起：

<img src="images/sessionmgr/Session_Management_Cheat_Sheet_Diagram.png">


会话ID或令牌（token）将用户身份验证凭据（credentials）（以用户会话的形式）绑定到用户HTTP流量和Web应用程序实施的适当访问控制。现代Web应用程序中这三个组件（身份验证，会话管理和访问控制）的复杂性，以及其实现和绑定都由Web开发人员掌握的事实（因为Web开发框架并未在这些模块之间提供严格的关系），使得安全会话管理模块的实施非常困难。

会话ID的披露、捕获、预测、暴力或固定将导致会话劫持（或劫持）攻击，攻击者能够在网络应用程序中完全模拟受害者用户。攻击者可以执行两种类型的会话劫持攻击，有针对性的或通用的。
- 在有针对性的攻击中，攻击者的目标是模拟特定（或特权）Web应用程序的受害者用户。
- 对于一般攻击，攻击者的目标是模拟Web应用程序中的任何有效或合法用户（或以该身份获得访问）。

## 会话ID属性

为了保持身份验证状态并跟踪用户在Web应用程序中的进度，应用程序为用户提供了一个“会话标识符”（会话ID或令牌（token）），该会话标识符在会话创建时分配，并由用户共享和交换会话期间的Web应用程序（在每个HTTP请求中发送）。会话ID是一个“name=value”对。

为了实现安全的会话ID，标识符（ID或token）的生成必须满足以下属性。

### 会话ID名称指纹

会话ID所使用的名称不应具有极强的描述性，也不应提供有关ID的目的和含义的不必要的详细信息。

最常见的Web应用程序开发框架使用的会话ID名称 可以[can be easily fingerprinted](https://wiki.owasp.org/index.php/Category:OWASP_Cookies_Database)，例如PHPSESSID（PHP），JSESSIONID （J2EE），CFID和CFTOKEN（ColdFusion），ASP.NET_SessionId（ASP .NET）等。因此，会话ID名称会公开Web应用程序使用的技术和编程语言。

建议将Web开发框架的默认会话ID名称更改为通用名称，例如`id`。

### 会话ID长度

会话ID值必须足够长，至少为128位（16字节），以防止暴力攻击。攻击者可以在其中遍历整个ID值范围并验证有效会话的存在。


**注意**：

- 基于下一节“会话ID熵”的假设，提供128位会话ID长度作为参考。但是，此数字不应视为绝对最小值，因为其他实施因素可能会影响其强度。
- 例如，有一些众所周知的实现，例如[Microsoft ASP.NET session IDs](https://docs.microsoft.com/en-us/dotnet/api/system.web.sessionstate.sessionidmanager?redirectedfrom=MSDN&view=netframework-4.7.2)：“ * .ASP.NET会话标识符是一个随机生成的数字，编码为24个字符的字符串，由从a到z的小写字符和从0到5的数字组成。”
- 它可以提供非常好的有效熵，因此可以考虑足够长的时间以避免猜测或蛮力攻击。

### 会话ID熵

会话ID值必须是不可预测的（足够随机），以防止猜测攻击，其中攻击者能够通过统计分析技术猜测或预测有效会话的ID。为此，必须使用良好的[CSPRNG]（https://en.wikipedia.org/wiki/Cryptographically_secure_pseudorandom_number_generator）（加密安全的伪随机数生成器）。

会话ID值必须至少提供“ 64位”熵（如果使用了良好的[PRNG]（https://en.wikipedia.org/wiki/Pseudorandom_number_generator），则该值估计为长度的一半）会话ID）。

此外，随机会话ID是不够的。它也必须唯一以避免重复的ID。当前会话ID空间中不能已经存在随机会话ID。

**注意**：

- 会话ID熵确实受到其他外部因素和难以衡量的因素的影响，例如Web应用程序通常具有的并发活动会话的数量，绝对会话过期超时，攻击者每秒可以猜测的会话ID数量以及目标Web应用程序可以支持等。
- 如果使用的会话ID的熵为“ 64位”，则假设攻击者每秒可以尝试10,000次猜测，并且在100,000个有效同时会话中，则攻击者至少需要292年才能成功猜测出有效的会话ID。 Web应用程序。
- 更多信息 [here](https://owasp.org/www-community/vulnerabilities/Insufficient_Session-ID_Length).

### 会话ID内容（或值）

会话ID的内容（或值）必须没有意义，以防止信息泄露攻击，其中攻击者能够解码ID的内容并提取用户，会话或Web应用程序内部工作的详细信息。

会话ID必须仅是客户端的标识符，并且其值不得包含敏感信息（或[PII](https://en.wikipedia.org/wiki/Personally_identifiable_information))。

与会话ID相关联的含义和业务或应用程序逻辑必须存储在服务器端，尤其是存储在会话对象中或会话管理数据库或存储库中。

存储的信息可以包括客户端IP地址，用户代理，电子邮件，用户名，用户ID，角色，特权级别，访问权限，语言首选项，帐户ID，当前状态，上次登录，会话超时和其他内部会话细节。如果会话对象和属性包含敏感信息，例如信用卡号，则需要适当地加密和保护会话管理存储库。

建议通过使用诸如SHA256之类的加密哈希函数来创建具有加密强度的会话ID。

## 会话管理实施

会话管理实现定义了将在用户和Web应用程序之间使用的交换机制，以共享并连续交换会话ID。HTTP中有多种机制可用于维护Web应用程序中的会话状态，例如cookie（标准HTTP标头），URL参数（URL重写– [RFC2396](https://www.ietf.org/rfc/rfc2396.txt)），GET请求的URL参数，POST请求的主体参数（例如隐藏的表单字段（HTML表单）或专有的HTTP标头）。

首选的会话ID交换机制应允许定义高级令牌（token）属性，例如令牌（token）到期日期和时间，或精细的使用约束。这就是为什么cookie（RFC [2109](https://www.ietf.org/rfc/rfc2109.txt) & [2965](https://www.ietf.org/rfc/rfc2965.txt) & [6265](https://www.ietf.org/rfc/rfc6265.txt)）是使用最广泛的会话ID交换机制之一，提供其他方法无法提供的高级功能。

使用特定的会话ID交换机制（例如URL中包含ID的机制）可能会泄露会话ID（在Web链接和日志，Web浏览器历史记录和书签，Referer标头或搜索引擎中）以及促进其他攻击，例如操纵ID或 [session fixation attacks](http://www.acrossecurity.com/papers/session_fixation.pdf).。

### 内置会话管理实现

Web开发框架（例如J2EE，ASP .NET，PHP等）提供了自己的会话管理功能和相关的实现。建议使用这些内置框架，而不是从头开始构建一个家庭框架，因为它们已在全球范围内的多个Web环境中使用，并且已经过Web应用程序安全性和开发社区的长期测试。

但是，请注意，这些框架过去也曾存在漏洞和弱点，因此始终建议使用可用的最新版本，该版本可能修复所有众所周知的漏洞，并查看和更改默认配置以增强功能。通过遵循本文档中描述的建议来保证其安全性。

会话管理机制用来临时保存会话ID的存储功能或存储库必须是安全的，以保护会话ID免受本地或远程意外泄露或未经授权的访问。

### 使用与接受的会话ID交换机制

Web应用程序应使用cookie进行会话ID交换管理。如果用户通过其他交换机制（例如URL参数）提交会话ID，则Web应用程序应避免将其作为防御策略的一部分来接受以停止会话固定。

**注意**：

- 即使Web应用程序使用cookie作为其默认会话ID交换机制，它也可能接受其他交换机制。
- 因此，在处理和管理会话ID时，需要通过彻底测试来确认Web应用程序当前接受的所有不同机制，并将接受的会话ID跟踪机制限制为cookie。
- 过去，如果满足某些条件（例如，识别不支持cookie或不接受cookie的web客户端），则某些Web应用程序使用URL参数，甚至从cookie切换为URL参数（通过自动URL重写）。用户隐私问题）。

### 传输层安全

为了保护会话ID交换免受网络流量中的主动窃听和被动泄露，必须使用加密的HTTPS（TLS）连接。这一点不仅限于交换用户凭据（credentials）的身份验证过程，而是应当覆盖整个Web会话，

此外，必须使用`Secure` [cookie attribute](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies#Secure_and_HttpOnly_cookies) 以确保仅通过加密通道交换会话ID 。加密通信通道的使用还可以保护会话免受某些会话固定攻击的攻击，在攻击中，攻击者可以拦截和操纵网络流量，以将会话ID注入（或修复）受害者的网络浏览器（请参阅[here](https://media.blackhat.com/bh-eu-11/Raul_Siles/BlackHat_EU_2011_Siles_SAP_Session-Slides.pdf) and [here](https://media.blackhat.com/bh-eu-11/Raul_Siles/BlackHat_EU_2011_Siles_SAP_Session-WP.pdf)).

以下最佳做法集中于保护会话ID（特别是在使用cookie时），以及帮助在Web应用程序中集成HTTPS：

- 不要将给定的会话从HTTP切换到HTTPS，反之亦然，因为这将通过网络以明文形式公开会话ID。
  - 重定向到HTTPS时，请确保在重定向发生后**设置或重新生成Cookie。
- 请勿在同一页面或同一域中混合使用加密和未加密的内容（HTML页面，图像，CSS，JavaScript文件等）。
- 尽可能避免提供来自同一主机的公共未加密内容和私有加密内容。如果需要不安全的内容，请考虑将其托管在单独的不安全域上。
- 实施 [HTTP Strict Transport Security (HSTS)](HTTP_Strict_Transport_Security_Cheat_Sheet.md)以实施HTTPS连接。

请参阅OWASP [Transport Layer Protection Cheat Sheet](Transport_Layer_Protection_Cheat_Sheet.md)，以获取有关安全实施TLS的更多常规指导。

需要强调的是，TLS不能防止会话ID预测，暴力破解，客户端篡改或固定；但是，它确实提供了有效的保护，以防止攻击者在中间攻击中通过一名男子拦截或窃取会话ID。

## Cookie

基于cookie的会话ID交换机制以cookie属性的形式提供了多种安全功能，可用于保护会话ID的交换：

### 安全属性

“Secure” cookie属性指示Web浏览器仅通过加密的HTTPS（SSL / TLS）连接发送cookie。必须使用此会话保护机制，以防止通过MitM（中间人）攻击泄露会话ID。它确保攻击者不能简单地从Web浏览器流量中捕获会话ID。

如果未设置“Secure” Cookie，则强制Web应用程序仅使用HTTPS进行通信（即使在Web应用程序主机中关闭了端口TCP / 80，HTTP时）也无法防止会话ID泄露。可能被欺骗以通过未加密的HTTP连接公开会话ID。攻击者可以拦截和操纵受害用户的流量，并向Web应用程序注入HTTP未加密的引用，这将迫使Web浏览器以明文形式提交会话ID。

例如在响应中加入：
```set-cookie: secure```
另请参阅：[SecureFlag](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies#Secure_and_HttpOnly_cookies)

### HttpOnly属性

“ HttpOnly” cookie属性指示Web浏览器不允许脚本（例如JavaScript或VBscript）通过DOM document.cookie对象访问cookie。必须使用此会话ID保护，以防止通过XSS攻击窃取会话ID。
```set-cookie: secure; HttpOnly;```

请参阅OWASP [XSS（跨站点脚本）预防速查表]（Cross_Site_Scripting_Prevention_Cheat_Sheet.md）。

另请参阅：[HttpOnly](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies#Secure_and_HttpOnly_cookies)
### SameSite属性

SameSite允许服务器定义cookie属性，从而使浏览器无法将cookie与跨站点请求一起发送。主要目标是减轻跨域信息泄漏的风险，并提供针对跨站点请求伪造攻击的某种保护。

另请参阅：[SameSite](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies#SameSite_cookies)

```set-cookie:  secure; HttpOnly; SameSite=Strict```

### 域和路径属性

[`Domain` cookie attribute](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie#Directives) 指示网络浏览器仅将Cookie发送到指定的域，然后所有子域。如果未设置该属性，则默认情况下，cookie仅发送到原始服务器。 [`Path` cookie attribute](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie#Directives) 指示网络浏览器仅将Cookie发送到指定目录或Web应用程序中的子目录（或路径或资源）。如果未设置该属性，则默认情况下将仅针对请求的资源和设置cookie的目录（或路径）发送cookie。

建议对这两个属性使用狭窄或受限制的范围。这样，不应设置“Domain”属性（仅将Cookie限制在原始服务器上），而应将“路径”属性设置为尽可能限制使用会话ID的Web应用程序路径。



将“ Domain”属性设置为过于宽松的值（例如“ example.com”），攻击者就可以对不同主机和属于同一域的Web应用程序之间的会话ID发起攻击，这就是跨子域Cookie。例如，“ www.example.com”中的漏洞可能允许攻击者从“ secure.example.com”中访问会话ID。

此外，建议不要在同一域上混合使用不同安全级别的Web应用程序。一个Web应用程序中的漏洞将使攻击者可以使用允许的“ Domain”属性（例如“ example.com”）为同一域上的另一个Web应用程序设置会话ID，该技术可以使用在[session fixation attacks](http://www.acrossecurity.com/papers/session_fixation.pdf)中.

尽管“Path”属性允许使用同一主机上的不同路径隔离不同Web应用程序之间的会话ID，但强烈建议不要在同一主机上运行不同的Web应用程序（尤其是来自不同安全级别或范围的Web应用程序）。这些应用程序可以使用其他方法来访问会话ID，例如`document.cookie` 对象。此外，任何Web应用程序都可以为该主机上的任何路径设置Cookie。

```set-cookie: DUP=Q=r6cs-2_tA0P4H8lLs9P_ww2&T=407737507&A=2&IG=0CED49B7ECC947E48C3335EA6C49468E; domain=.bing.com; path=/search; secure; HttpOnly; SameSite=None```

Cookies容易受到DNS欺骗、劫持、中毒攻击的攻击，攻击者可以在其中操纵DNS解析来强制Web浏览器公开给定主机或域的会话ID。

### Expire和Max-Age属性

基于cookie的会话管理机制可以使用两种类型的cookie，即非持久（或会话）cookie和持久性cookie。如果Cookie出现[`Max-Age`]（https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie#Directives）（优先于`Expires`）或[`Expires`]（https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie#Directives）属性，该属性将被视为永久性Cookie，并将存储在磁盘上通过网络浏览器直到到期时间为止。

通常，用于在身份验证后跟踪用户的会话管理功能会使用非持久cookie。如果当前的Web浏览器实例关闭，这将迫使会话从客户端消失。因此，强烈建议使用非持久性cookie进行会话管理，以使会话ID不会长时间保留在Web客户端缓存中，攻击者可以从中获取该ID。

- 通过确保敏感信息在需求持续时间内不是持久性/加密/不按需要存储的，确保不包含敏感信息
- 确保无法通过Cookie操作进行未经授权的活动
- 确保设置了安全标记，以防止以非安全方式通过“电线”意外传输
- 确定应用程序代码中的所有状态转换是否正确检查cookie并强制使用
- 如果敏感数据保留在cookie中，请确保对整个cookie进行加密
- 定义应用程序正在使用的所有cookie，它们的名称以及需要它们的原因

## HTML5 Web存储API

Web超文本应用技术工作组（WHATWG）将HTML5 Web存储API（本地存储）和会话存储（SessionStorage）描述为用于在客户端存储名称/值对的机制。

与HTTP cookie不同，`localStorage`和`sessionStorage`的内容不会在浏览器的请求或响应内自动共享，而是用于存储客户端的数据。

### localStorage API

#### 范围

从相同来源加载的页面可以访问使用 `localStorage`  API存储的数据，这些来源定义为方案（https：//），主机（example.com），端口（443）。和域/领域（“ example.com”）。
这提供了对该数据的类似访问，就像通过在cookie上使用“安全”标志所实现的一样，这意味着无法通过“ http”检索从“ https”存储的数据。由于可能会从不同的窗口/线程进行并发访问，因此使用localStorage存储的数据可能会遇到共享访问问题（例如竞争条件），因此应视为非锁定（[Web Storage API规范]（https：// html.spec.whatwg.org/multipage/webstorage.html#the-localstorage-attribute））。

#### 持续时间

使用 `localStorage`  API存储的数据将在浏览会话中保持不变，从而延长了其他系统用户可以访问的时间范围。

#### 离线访问

这些标准不要求对 `localStorage` 数据进行静态加密，这意味着可以直接从磁盘访问此数据。

#### 用例

WHATWG建议对需要跨窗口或选项卡，跨多个会话访问的数据使用“ localStorage”，并且出于性能原因，可能需要在其中存储大量（兆字节）数据。

### sessionStorage API

#### 范围

sessionStorage API将数据存储在调用它的窗口上下文中，这意味着选项卡1无法访问从选项卡2存储的数据。
同样，与 `localStorage` API一样，使用`sessionStorage` API存储的数据也可以从相同来源加载的页面访问，这些来源定义为方案 (`https://`), host (`example.com`), port (`443`) and domain/realm (`example.com`).。
这提供了对该数据的类似访问，就像通过在cookie上使用“安全”标志所实现的一样，这意味着无法通过“ http”检索从“ https”存储的数据。

#### 持续时间

`sessionStorage`  API仅在当前浏览会话持续时间内存储数据。关闭选项卡后，该数据将不再可检索。如果浏览器选项卡被重用或保持打开状态，则不一定阻止访问。数据也可能会保留在内存中，直到发生垃圾回收事件为止。

#### 离线访问

这些标准不要求对“ sessionStorage”数据进行静态加密，这意味着可以直接从磁盘访问此数据。

#### 用例

WHATWG建议对与工作流程的一个实例相关的数据使用“ sessionStorage”，例如，机票预订的详细信息，但是可以在其他选项卡中同时执行多个工作流程。窗口/选项卡绑定的性质将防止数据在单独的选项卡中的工作流之间泄漏。

### 安全风险

通常，不应将安全或敏感数据持久存储在浏览器数据存储中，因为这可能会导致共享系统上的信息泄漏。因为Web存储机制是API，所以它还允许从注入的脚本进行访问，这使其安全性不如应用了“ httponly”标志的cookie。
尽管可以将工作流特定的数据存储在“ sessionStorage”中，以供特定的选项卡/窗口在重新加载时使用，但Web存储API应该被视为不安全的存储。因此，如果业务解决方案要求使用“ localStorage”或“ sessionStorage”来存储敏感数据，则该解决方案应加密数据并应用重播保护。

由于可能会通过XSS攻击访问Web Storage API，因此应使用非持久性cookie存储会话标识符，并使用适当的标志来防止[insecure access](Transport_Layer_Protection_Cheat_Sheet.md) (`Secure`), [XSS](Cross_Site_Scripting_Prevention_Cheat_Sheet.md) (`HttpOnly`) and [CSRF](Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.md) issues (`SameSite`).。

### 参考
- [Web Storage APIs](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API)
- [LocalStorage API](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
- [SessionStorage API](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage)
- [WHATWG Web Storage Spec](https://html.spec.whatwg.org/multipage/webstorage.html#webstorage)


## 会话ID生命周期


### 会话ID的生成和验证：宽松而严格的会话管理

与会话固定漏洞相关的Web应用程序有两种会话管理机制，宽松的和严格的。允许机制允许Web应用程序最初接受用户设置的任何会话ID值均为有效，从而为其创建一个新会话，而严格机制则强制Web应用程序仅接受由Web应用程序先前生成的会话ID值。 Web应用程序。

会话令牌（token）应尽可能由Web服务器处理，或由加密安全的随机数生成器生成。

尽管当今使用的最普遍的机制是严格的机制（更安全，[PHP defaults to permissive](https://wiki.php.net/rfc/session-use-strict-mode)）。开发人员必须确保在某些情况下Web应用程序不使用许可机制。Web应用程序永远不应接受从未生成的会话ID，并且在接收到该会话ID的情况下，它们应生成并向用户提供新的有效会话ID。此外，应将这种情况检测为可疑活动，并应生成警报。

### 与其他任何用户输入一样管理会话ID

与Web应用程序处理的任何其他用户输入一样，会话ID必须被视为不受信任，并且必须进行彻底的验证和验证。根据所使用的会话管理机制，将在GET或POST参数，URL或HTTP标头（例如cookie）中接收会话ID。如果Web应用程序在处理无效的会话ID值之前未验证并过滤掉它们，则有可能被利用来利用其他Web漏洞，例如，如果会话ID存储在关系数据库中，则是SQL注入；如果会话ID是会话ID，则它们是持久XSS Web应用程序将存储并反映回去。

###在任何特权级别更改后更新会话ID

在关联的用户会话中进行任何特权级别更改之后，Web应用程序必须更新或重新生成会话ID。强制重新生成会话ID的最常见情况是在身份验证过程中，因为用户的特权级别从未身份验证（或匿名）状态更改为已身份验证状态。还必须考虑其他常见情况，例如密码更改，权限更改或Web应用程序中从常规用户角色切换为管理员角色。对于所有这些Web应用程序关键页面，必须忽略先前的会话ID，必须将新的会话ID分配给针对关键资源收到的每个新请求，并且必须销毁旧的或先前的会话ID。

最常见的Web开发框架提供了用于更新会话ID的会话功能和方法，例如“ request.getSession（true）”和“ HttpSession.invalidate（）”（J2EE），“ Session.Abandon（）”和“ Response”。 Cookies.Add（new ...）`（ASP .NET）或`session_start（）`和`session_regenerate_id（true）`（PHP）。

会话ID的重新生成是强制性的，以防止[会话固定攻击]（http://www.acrossecurity.com/papers/session_fixation.pdf），攻击者在攻击者的用户Web浏览器上设置会话ID，而不是收集受害者的会话与大多数其他基于会话的攻击一样，ID，并且独立于使用HTTP或HTTPS。此保护减轻了其他基于Web的漏洞的影响，这些漏洞也可用于发起会话固定攻击，例如HTTP响应拆分或XSS（请参阅[here]（https://media.blackhat.com/bh-eu-11 /Raul_Siles/BlackHat_EU_2011_Siles_SAP_Session-Slides.pdf）和[此处]（https://media.blackhat.com/bh-eu-11/Raul_Siles/BlackHat_EU_2011_Siles_SAP_Session-WP.pdf））。

一项补充建议是在身份验证之前和之后使用不同的会话ID或令牌（token）名称（或会话ID集），以便Web应用程序可以跟踪匿名用户和经过身份验证的用户，而无需暴露或绑定用户会话之间的风险。两种状态。

###使用多个Cookie时的注意事项

如果Web应用程序使用cookie作为会话ID交换机制，并且为给定会话设置了多个cookie，则web应用程序必须在允许访问用户会话之前验证所有cookie（并在它们之间建立关系）。

Web应用程序通过HTTP设置用户Cookie的预身份验证以跟踪未身份验证（或匿名）用户非常普遍。用户在Web应用程序中进行身份验证后，便会通过HTTPS设置新的身份验证后安全cookie，并在cookie和用户会话之间建立绑定。如果Web应用程序未同时验证两个cookie是否都通过了身份验证的会话，则攻击者可以利用未经身份验证的预身份验证cookie来访问经过身份验证的用户会话（请参阅[here]（https://media.blackhat.com/bh -eu-11 / Raul_Siles / BlackHat_EU_2011_Siles_SAP_Session-Slides.pdf）和[此处]（https://media.blackhat.com/bh-eu-11/Raul_Siles/BlackHat_EU_2011_Siles_SAP_Session-WP.pdf））。

Web应用程序应尽量避免在同一Web应用程序中为不同的路径或域范围使用相同的cookie名称，因为这会增加解决方案的复杂性并可能导致范围界定问题。

##会话过期

为了最大程度地减少攻击者可以通过活动会话发起攻击并劫持它们的时间，必须为每个会话设置过期超时，从而确定会话将保持活动状态的时间。Web应用程序的会话到期不足会增加其他基于会话的攻击的可能性，因为攻击者能够重用有效的会话ID并劫持关联的会话，因此该会话必须仍然处于活动状态。

会话间隔越短，攻击者使用有效会话ID的时间就越短。会话到期超时值必须根据Web应用程序的目的和性质进行相应设置，并兼顾安全性和可用性，以便用户可以舒适地完成Web应用程序中的操作而不会使其会话频繁过期。

空闲超时值和绝对超时值都高度依赖于Web应用程序及其数据的重要性。对于高价值应用程序，常见的空闲超时范围是2-5分钟，对于低风险应用程序，则是15-30分钟。绝对超时取决于用户通常使用该应用程序多长时间。如果打算由办公室工作人员使用该应用程序一整天，则适当的绝对超时范围可能在4到8个小时之间。

当会话到期时，Web应用程序必须采取主动措施以使客户端和服务器双方的会话均无效。从安全角度来看，后者是最相关且最强制的。

对于大多数会话交换机制，使会话ID无效的客户端操作是基于清除令牌（token）值的。例如，要使cookie无效，建议为会话ID提供一个空（或无效）值，并将“ Expires”（或“ Max-Age”）属性设置为过去的日期（以防持久化） Cookie正在使用）：`Set-Cookie：id =; Expires =星期五，2005年5月17日星期五18:45:00 GMT`

为了关闭服务器端的会话并使会话无效，必须使用会话管理机制提供的功能和方法，使Web应用程序在会话过期或用户主动注销时采取主动措施。如HttpSession.invalidate（）（J2EE），Session.Abandon（）（ASP .NET）或session_destroy（）/ unset（）（PHP）一样。

###自动会话过期

＃＃＃＃ 空闲超时

所有会话均应实现空闲或不活动超时。此超时时间定义会话在会话中没有活动的情况下将保持活动状态的时间量，在自Web应用程序收到的给定会话ID的最后一个HTTP请求以来，在定义的空闲时间段内关闭会话并使会话无效。

空闲超时限制了攻击者猜测和使用另一个用户的有效会话ID的机会。但是，如果攻击者能够劫持给定的会话，则空闲超时不会限制攻击者的操作，因为攻击者可以定期在该会话上生成活动，以使会话保持较长时间处于活动状态。

会话超时管理和过期必须在服务器端强制执行。如果使用客户端强制会话超时，例如使用会话令牌（token）或其他客户端参数来跟踪时间参考（例如，自登录时间以来的分钟数），则攻击者可能会操纵这些超时时间来延长会话持续时间。

####绝对超时

无论会话活动如何，所有会话均应实现绝对超时。此超时时间定义了会话可以活动的最大时间，自给定会话最初由Web应用程序创建以来，会话在定义的绝对时间段内关闭并使会话无效。使会话无效后，用户被迫在Web应用程序中再次（重新）身份验证并建立新的会话。

绝对会话限制了攻击者可以使用被劫持的会话并假冒受害用户的时间。

####更新超时

或者，Web应用程序可以实现一个附加的更新超时，此后在用户会话的中间，并且独立于会话活动以及空闲超时，自动更新会话ID。

自从最初创建会话以来经过了一段特定的时间后，Web应用程序可以为用户会话重新生成新的ID，并尝试在客户端上进行设置或续订。在客户端知道新的ID并开始使用它之前，先前的会话ID值将在一段时间内仍然有效，并带有一个安全间隔。那时，当客户端在当前会话内切换到新ID时，应用程序会使先前的ID无效。

此方案最大程度地减少了可能由攻击者获得的给定会话ID值的时间量，即使受害者用户会话仍处于活动状态，该时间也可以重用于劫持用户会话。尽管每次更新超时到期，用户会话仍保持活动状态并在合法客户端上打开，尽管其相关的会话ID值会在会话持续时间内定期透明地更新。因此，更新超时是对空闲超时和绝对超时的补充，特别是当绝对超时值随着时间的推移而显着扩展时（例如，保持用户会话长时间打开是应用程序的要求）。

根据实现方式的不同，可能存在一种竞争状况，其中具有仍然有效的先前会话ID的攻击者在更新超时刚刚到期之后立即在受害用户之前发送请求，并首先获得更新的会话ID的值。至少在这种情况下，受害用户可能会意识到攻击，因为其会话将不再有效，因为她的会话将突然终止。

###手动会话到期

Web应用程序应提供允许安全意识的用户在完成使用Web应用程序后主动关闭其会话的机制。

####注销按钮

Web应用程序必须提供一个可见且易于访问的注销（注销，退出或关闭会话）按钮，该按钮在Web应用程序标题或菜单上可用，并且可以从每个Web应用程序资源和页面访问，以便用户可以在以下位置手动关闭会话：任何时间。如* Session_Expiration *部分中所述，Web应用程序必须至少在服务器端使会话无效。

**注意**：不幸的是，并非所有的Web应用程序都能使用户关闭当前会话。因此，客户端的增强功能使认真的用户可以通过努力地关闭会话来保护会话。

### Web内容缓存

即使会话已经关闭，也有可能通过Web浏览器缓存访问会话内交换的私有数据或敏感数据。因此，Web应用程序必须对通过HTTP和HTTPS交换的所有Web流量使用限制性缓存指令，例如[`Cache-Control`]（https://developer.mozilla.org/en-US/docs/Web/HTTP / Headers / Cache-Control）和[`Pragma`]（https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Pragma）HTTP标头，和/或所有或（至少）敏感网页。

独立于Web应用程序定义的缓存策略，如果允许缓存Web应用程序内容，则永远不要缓存会话ID，因此强烈建议使用`Cache-Control：no-cache =“ Set-Cookie，Set -Cookie2“`指令，以允许网络客户端缓存会话ID之外的所有内容（请参阅[here]（https://stackoverflow.com/a/41352418））。

##用于会话管理的其他客户端防御

Web应用程序可以通过客户端上的其他对策来补充先前描述的会话管理防御。客户端保护（通常以JavaScript检查和验证的形式）不是防弹的，很容易被熟练的攻击者击败，但是可以引入入侵者必须绕过的另一层防御。

###初始登录超时

Web应用程序可以使用登录页面中的JavaScript代码来评估和测量自页面加载和授予会话ID以来的时间。如果在特定时间段后尝试登录尝试，则客户端代码可以通知用户已超过最大登录时间并重新加载了登录页面，从而获取了新的会话ID。

这种额外的保护机制试图强制更新会话ID的预身份验证，从而避免了下一个受害者使用同一台计算机重复使用先前使用（或手动设置）的会话ID的情况，例如，在会话固定攻击中。

###在Web浏览器窗口上强制会话注销关闭事件

Web应用程序可以使用JavaScript代码捕获所有Web浏览器选项卡或窗口的关闭（甚至返回）事件，并在关闭Web浏览器之前采取适当的措施关闭当前会话，以模拟用户已通过注销手动关闭了会话按钮。

###禁用Web浏览器跨标签会话

一旦用户登录并建立会话以强制针对同一Web应用程序打开新的Web浏览器选项卡或窗口，则Web应用程序便可以使用JavaScript代码。Web应用程序不希望允许多个Web浏览器选项卡或窗口共享同一会话。因此，应用程序试图强制Web浏览器不要在它们之间同时共享相同的会话ID。

**注意**：如果通过cookie交换会话ID，则无法实现此机​​制，因为cookie被所有Web浏览器选项卡/窗口共享。

###自动客户端注销

Web应用程序可在所有（或关键）页面中使用JavaScript代码在空闲超时到期后自动注销客户端会话，例如，通过将用户重定向到注销页面（与前面提到的注销按钮使用的资源相同） 。

使用客户端代码增强服务器端空闲超时功能的好处是，用户可以看到会话由于不活动而结束，或者甚至可以通过倒数计时器提前通知会话即将终止和警告消息。这种用户友好的方法有助于避免由于服务器端静默过期的会话而导致需要大量输入数据的网页丢失工作。

##会话攻击检测

###会话ID猜测和暴力检测

如果攻击者试图猜测或暴力破解有效的会话ID，则他需要使用来自单个（或一组）IP地址的不同会话ID针对目标Web应用程序启动多个顺序请求。此外，如果攻击者试图分析会话ID的可预测性（例如使用统计分析），则他需要针对目标Web应用程序从单个（或一组）IP地址启动多个顺序请求，以收集新的有效会话ID。

Web应用程序必须能够基于收集（或使用）不同会话ID的次数来检测这两种情况，并警告和/或阻止有问题的IP地址。

###检测会话ID异常

Web应用程序应专注于检测与会话ID相关的异常，例如其操作。OWASP [AppSensor Project]（https://owasp.org/www-project-appsensor/）提供了一种框架和方法，可在Web应用程序中实现内置的入侵检测功能，该功能专注于检测异常和意外行为。检测点和响应动作的形式。有时不使用外部保护层，而是仅从Web应用程序内部提供业务逻辑详细信息和高级智能，在该Web应用程序中可以建立多个与会话相关的检测点，例如在修改或删除现有Cookie时，可以使用新的Cookie添加时，将重用另一个用户的会话ID，或者在会话中间用户位置或User-Agent更改时。

###将会话ID绑定到其他用户属性

为了检测（并在某些情况下防止）用户的不良行为和会话劫持，强烈建议将会话ID绑定到其他用户或客户端属性，例如客户端IP地址，User-Agent或客户端的数字证书。如果Web应用程序在已建立的会话中间检测到这些不同属性之间的任何更改或异常，则这是会话操纵和劫持尝试的很好指示，并且此简单事实可用于警告和/或终止可疑会话。 。

尽管Web应用程序不能使用这些属性来信任地防御会话攻击，但它们显着提高了Web应用程序的检测（和保护）功能。但是，熟练的攻击者可以通过共享相同的网络（在NAT环境中，如Wi-Fi热点在NAT环境中很常见）或使用相同的出站Web代理（在Internet中很常见）来重用分配给受害者用户的相同IP地址，从而绕过这些控制。公司环境），或通过手动修改其User-Agent使其与受害用户完全一样。

###记录会话生命周期：监视会话ID的创建，使用和销毁

Web应用程序应通过包含有关会话的整个生命周期的信息来增强其日志记录功能。特别是，建议记录与会话相关的事件，例如会话ID的创建，更新和销毁，以及有关登录和注销操作中其用法的详细信息，会话中特权级别的更改，超时到期，无效会话活动（在检测到时）以及会话期间的关键业务操作。

日志详细信息可能包括时间戳，源IP地址，请求的Web目标资源（并参与会话操作），HTTP标头（包括User-Agent和Referer），GET和POST参数，错误代码和消息，用户名（或用户ID）以及会话ID（Cookie，URL，GET，POST…）。

诸如会话ID之类的敏感数据不应包含在日志中，以保护会话日志免受会话ID本地或远程泄露或未经授权的访问。但是，必须记录某些特定于会话的信息，以便将日志条目与特定会话相关联。建议记录会话ID的盐值哈希值，而不是记录会话ID本身，以便在不暴露会话ID的情况下允许特定于会话的日志关联。

特别是，Web应用程序必须彻底保护允许管理所有当前活动会话的管理界面。支持人员通常通过模拟用户并像用户一样查看Web应用程序来解决会话相关问题，甚至解决一般问题。

会话日志成为主要的Web应用程序入侵检测数据源之一，并且当检测到（一个或多个）攻击时，入侵防护系统还可以使用会话日志自动终止会话和/或禁用用户帐户。如果实施了主动保护，则也必须记录这些防御措施。

###同步会话登录

由Web应用程序设计决定要确定是否允许来自同一用户的多个同时登录来自相同或不同的客户端IP地址。如果Web应用程序不想允许同时进行的会话登录，则它必须在每个新的身份验证事件之后采取有效的措施，隐式终止先前可用的会话，或者（通过旧的，新的或两个会话）向用户询问必须进行的会话。保持活跃。

建议Web应用程序添加用户功能，该功能允许您随时检查活动会话的详细信息，监视并提醒用户并发登录，提供用户功能以手动远程终止会话以及通过记录来跟踪帐户活动历史记录（日志）多个客户端详细信息，例如IP地址，用户代理，登录日期和时间，空闲时间等。

##会话管理WAF保护

在某些情况下，Web应用程序源代码不可用或无法修改，或者实现上述多个安全建议和最佳实践所需的更改意味着对Web应用程序体系结构进行了完全重新设计，因此无法轻松实现在短期内。

在这些情况下，或者为了补充Web应用程序防御，并以保持Web应用程序尽可能安全的目标，建议使用外部防护，例如Web Application Firewall（WAF），可以减轻已经描述的会话管理威胁。

Web应用程序防火墙提供了针对基于会话的攻击的检测和保护功能。一方面，对于WAF来说，强制在cookie上使用安全属性（例如`Secure`和`HttpOnly`标志），对所有Web应用程序响应在`Set-Cookie`标头上应用基本重写规则是微不足道的。设置了一个新的cookie。

另一方面，可以实现更高级的功能，以允许WAF跟踪会话以及相应的会话ID，并应用各种保护以防止会话固定（通过在特权更改时在客户端更新会话ID）被检测到），强制执行粘性会话（通过验证会话ID和其他客户端属性（例如IP地址或User-Agent）之间的关系）或管理会话过期（通过强制客户端和Web应用程序完成会话） 。

开源ModSecurity WAF，加上OWASP [核心规则集]（https://owasp.org/www-project-modsecurity-core-rule-set/），提供了检测和应用安全cookie属性的能力，以及针对这些问题的对策会话固定攻击和会话跟踪功能来强制执行粘性会话。