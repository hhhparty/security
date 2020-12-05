# CSRF 防治手册

内容取自：[Cross-Site Request Forgery Prevention Cheat Sheet](https://github.com/OWASP/CheatSheetSeries/blob/master/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.md)

## 介绍

CSRF 是一种类型的攻击，它发生在某个恶意网站、邮件、博客、即时消息或程序利用或通过某个已经通过某个受信任完整认证的用户（victim）的浏览器执行一个意外活动时。一个CSRF攻击能够成功，是因为浏览器请求自动地包含了所有cookies（包含会话cookies)。因此，如果一个用户已经成功登录了某个网站，那么这个网站不能区别使用同一浏览器的是用户请求还是伪造请求？

CSRF攻击的影响，取决于脆弱漏洞的严重程度和用户权限的大小。例如，攻击者可能会窃取资金、修改密码等。
## 基本原则
简单来看，下列原则应该可用于防御CSRF：
- 检查你的框架中是否有内建的CSRF防护并使用它；
  - 如果你使用的框架没有内建的CSRF防护，那需要自己增加CSRF tokens到所有的状态改变请求中（即那些在网站上执行动作的请求）。
- 对于会话cookie，总是使用同站cookie属性；
- 至少实现一种纵深防御机制：
  - 使用自定义请求头
  - 使用标准请求头，并验证来源
  - 使用两阶段提交cookies
- 对于敏感操作，考虑实现基于用户交互的保护机制；
- 记住任何XSS攻击会击败所有的CSRF缓解技术；
- 不要在状态改变操作请求中使用GET方法，如果你非要这样做那么必须有阻止CSRF的机制。

## 基于Token的缓解措施

这种缓解CSRF的方式最为流行、最常用。它既可以被做成有状态的（synchronizer token pattern），也可以被做成无状态的（encrypted or hashed based token pattern）。


### 使用内置的或已存在的CSRF保护实现

同步器凭证（Synchronizer token）防御已经在很多框架中实现了。强烈推荐仔细研究你所用的框架，使用同步器凭证防护CSRF攻击，在你使用自定义的凭证生成系统前将其作为默认选项。

务必在使用这些内建的CSRF保护前，进行正确配置（例如密钥管理和凭证管理），以便生成tokens来保护CSRF漏洞。

其它实现的CSRF防护还有：

- For Java: OWASP [CSRF Guard](https://owasp.org/www-project-csrfguard/) or [Spring Security](https://docs.spring.io/spring-security/site/docs/3.2.0.CI-SNAPSHOT/reference/html/csrf.html)
- For PHP and Apache: [CSRFProtector Project](https://owasp.org/www-project-csrfprotector/)
- For AngularJS: [Cross-Site Request Forgery (XSRF) Protection](https://docs.angularjs.org/api/ng/service/http#cross-site-request-forgery-xsrf-protection)
- [.NET已经内建了防护机制](https://docs.microsoft.com/en-us/aspnet/core/security/anti-request-forgery?view=aspnetcore-2.1)

下面讨论以下防护机制：
- 同步器 token 模式
- 基于加密的 token 模式
- 基于 HMAC 的 token 模式

### 同步器凭证模式

CSRF tokens 应该在服务器端生成，可以每个用户会话生成一次，或者每个请求生成一次。为每个请求生成一个令牌更为安全，但是这可能导致可用性的降低，例如浏览器“返回”操作将失效。

当一个请求由客户端发起，服务器端组件必须验证在请求中是否存在 token ，以及 token 的有效性。如果没有 token 或者其值与用户会话中的不匹配，那么：
- 这个请求就要被拒绝；
- 用户会话也需要被终止；
- 该事件应当被记入日志并标记为潜在的CSRF攻击。

CSRF tokens 应该是：
- 每个用户会话都是唯一的；
- 加密的；
- 不可预测的（使用安全方法生成的大的随机数）

注意：**CSRF tokens 不应当使用cookie传递。**

CSRF token 可以加在隐藏字段、http头中，也可以使用在表单中、AJAX调用中。需要确定的是，token 不能再服务器日志中记录（泄露），也不可以暴露在URL中。GET请求中的CSRF token会在几个位置被发现，例如浏览器历史、日志文件、监控类的网络应用。

可行的方法如下：
```html
<form action="/transfer.do" method="post">
    <input type="hidden" name="CSRFToken" value="OWY4NmQwODE4ODRjN2Q2NTlhMmZlYWEwYzU1YWQwMTVhM2JmNGYxYjJiMGI4MjJjZDE1ZDZMGYwMGEwOA==">
    [...]
</form>
```

相比上面在表单中使用隐藏字段的方法，使用JavaScript在自定义的HTTP请求头中插入CSRF token，被认为是更为安全的方法。


### 基于加密的 token 模式

加密 token 模式利用了加密，而不是使用token验证比较。这种方法更适于不想在服务器端维持任何状态的情况。

服务器根据用户会话 ID 和时间戳（放重放），使用仅在服务器端可获取的唯一密钥，来生成加密的 token。对于加密算法的选择，推荐使用 AES-256 with GCM 模式 或 GCM-SIV 加密方法。而 ECB 模式强烈不建议使用。如果你想使用别的块加密算法，可以参考 [OWASP cryptographic storage cheatsheet](https://github.com/OWASP/CheatSheetSeries/blob/master/cheatsheets/Cryptographic_Storage_Cheat_Sheet.md) 和 [wikipedia cipher mode](https://en.wikipedia.org/wiki/Block_cipher_mode_of_operation)。


加密的token返回到客户端，并嵌入在表单中的隐藏字段、自定义请求头、AJAX请求参数。一旦服务器接收到客户端请求，服务器就要验证是否存在这一个token，并使用对称key解密 token值。

如果token不能被解密，那么以为着这是一种入侵，请求需要被阻挡并记录下来，用于调试或事件响应；如果token解密后结果中的用户的会话ID和时间戳与服务器端原生成的匹配，那么说明未发生CSRF。需要比较会话ID中用户ID是否未当前登录的用户ID，还要比较会话ID 中时间戳是否超时。

在 [密钥管理手册](https://github.com/OWASP/CheatSheetSeries/blob/master/cheatsheets/Key_Management_Cheat_Sheet.md#key-management-lifecycle-best-practices) 中包含了一些管理密钥的最佳实践。


### 基于 HMAC 的token 模式

基于 HMAC 的模式也适用于不想维护任何状态的服务器。基于 HMAC 的 CSRF 防护模式类似于加密的CSRF防护机制，仅有一点不同：
- 它适用强的HMAC函数（sha-256 或更强）代替了加密函数，以生成token。
- token的组成由 HMAC 和时间戳两部分构成。

下面是使用基于HMAC的CSRF防护模式的正确步骤：
- 生成 token
  - 使用密钥 k，生成 $HMAC(session ID + timestamp)$ ，并追加同一 timestamp 值，共同形成你的CSRF token。
- 引用 token （HMAC+timestamp）
  -在隐藏字段、请求头、AJAX请求体参数中 引用上面生成的token。
- 验证token
  - 服务器接收到请求后，使用同样的密钥k（参数是来自请求的会话ID和在接收到的token中的时间戳）重新生成 token。如果在接收到的 token中的 HMAC 值和这个重新生成的HMAC值相匹配，那么验证时间戳是否超时，如果两者都验证成功，那么这个请求可以被认为是合法的、可被执行的。否则，应当拒绝请求并记录为CSRF攻击。

在 [密钥管理手册](https://github.com/OWASP/CheatSheetSeries/blob/master/cheatsheets/Key_Management_Cheat_Sheet.md#key-management-lifecycle-best-practices) 中包含了一些管理 HMAC 密钥的最佳实践。

## 纵深防护技术

### 同源 cookie 属性

```SameSite```是一个cookie属性，类似于```HTTPOnly, Secure```等，目的是缓解CSRF攻击。这个属性能够帮助浏览器判断是否在跨站请求中发送cookies。

```SameSite```属性可选的值有：
- Lax
  - 默认值，提供了一种安全和可用性的平衡。此时，网站希望在用户从外部链接访问该网站，并维护用户已登录会话状态。
  - 仅顶级导航适用于设置Lax模式，允许跨站请求，并且要使用安全的http方法。
- Strict
  - 阻止在跨站请求发送cookies。

- None

例如：使用Strict选项，一个github上已登录用户，想通过其它论坛或邮件里的GitHub私有库链接访问github是不被允许的。github不会接受这个会话cookie，用户不能访问此项目。

又例如，一个银行网站不会允许任何事务处理页，被外部某个站点所链接访问。使用Strict选项是非常必要的。

使用这个属性的cookie实例：

```HTTP
Set-Cookie: JSESSIONID=xxxxx; SameSite=Strict
Set-Cookie: JSESSIONID=xxxxx; SameSite=Lax
```

所有的桌面浏览器和几乎所有的移动端浏览器都支持 SameSite 属性。注意，最新的Chrome（>80）目前声称将默认设置```SameSite=Strict``` ，firefox 和 edge 也计划使用这个模式。

重要提示，这个属性应该作为一个额外的防护机制被实现。该属性保护了使用浏览器的用户。有两种方法可以绕过它。这个属性不能替代CSRF token，相反，它应该与 CSRF token 共存，使保护更加鲁棒。

### 使用标准头验证源

这种保护机制有两个步骤，他们都依赖于检查 HTTP 请求头的值。
- 检查请求源来自哪里（source origin）？即检查``` Origin``` 或 ```Referer``` 头
- 检查请求将要去哪里（target origin）？即检查```Host```

在服务器端，我们呢验证是否它们使匹配的。如果是同源请求，我们视请求为合法的；否则，作为跨站请求，视为非法的。

这些头的可靠性来自于这样一个事实：它们不能被编程更改（例如：使用带有XSS漏洞的JavaScript），因为它们属于禁止的头列表中，这意味着只有浏览器可以设置它们。

#### 检查 Source Origin

检查 Origin 和 Referer 属性值验证 Source Origin。

- 首先检查 Origin 属性值，如果Origin存在，验证其值是否与 target origin 匹配。与Referer 属性不同，Origin 会出现在由HTTPs url 发起的HTTP 请求中。

- 如果 Origin 属性不存在，检查 Referer中的的 hostname 是否与 target origin 匹配。这种CSRF防护方法也常见于处理未授权的请求，例如在建立会话状态前的请求，要求保持跟踪一个同步的token。

在上面两种情况中，要确定 target origin 检查是足够强壮的（要求完整匹配，而不是部分）。例如，如果你的网站是 example.org ，要求确定 example.org.attacker.com 不能通过检查。

- 如果 Origin 和 Referer 均不存在，不能断定安全性，你可以接受或阻止该请求，但建议阻止。或者，你可以记录日志，监控其行为。

#### 检查 Target Origin

可能你会认为检查 target origin是比较简单的，但事实上大多不是。

你可能首先考虑的是从请求的url中抓取 target origin（例如：hostname 和 port）。但应用服务器经常位于一个或多个代理之后，而源url是与应用服务器接收到的是不同的。如果你的应用服务器能直接被用户访问，那么其请求中的url才是真正的target origin。

如果应用服务器位于代理之后，那么有下列选项可供选择：
- 配置你的应用，用于简单获知他的 target origin。
  - 既然是你的应用，你可以找到 target origin 并在某些服务器配置实体中设置值。因为实在服务器端定义，所以这可能是最为安全的方式。但是如果你的应用被部署在多个地方（例如：dev，test，QA，production，etc），那么可能在维护时可能会有问题。在每个地方都设置正确的值时很困难的，但是如果你使用某种中心化的配置并使你部署的服务器实例自动抓取这个值，那么就很棒了。（注意，中心化的部署中心需要保证安全）

- 使用```Host```属性值
  - 如果你倾向于不配置每个实例，而是令应用找到自己的target，我们推荐使用 Headers 中的 Host 家族。```Host``` 头部属性的目的使保存请求的 target origin，但是如果你的应用服务器位于某个代理之后，那么Host 属性值可能会改变。改变的```Host```头将于 source origin 不匹配。
- 使用 ```X-Forwarded-Host``` 头值
  - 为了避免代理对```Host```值的影响，一些代理会使用```X-Forwarded-Host```保存代理接收到的原始Host头值。许多代理都会进行这种操作。

上面的方法，在请求头中存在 ```Origin Referer Host X-Forwarded-Host```等头部属性时有效，但有时请求中不包含这些内容，而且不使用这些头的原因大多是合法的，例如：用户隐私保护、浏览器节省带宽和简化处理等。下面是一些不使用这些头属性的情况：

- Internet Explorer 11 does not add the Origin header on a CORS request across sites of a trusted zone. The Referer header will remain the only indication of the UI origin. See the following references in Stack Overflow here and here.
- In an instance following a 302 redirect cross-origin, Origin is not included in the redirected request because that may be considered sensitive information that should not be sent to the other origin.
- There are some privacy contexts where Origin is set to "null" For example, see the following here.
- Origin header is included for all cross origin requests but for same origin requests, in most browsers it is only included in POST/DELETE/PUT Note: Although it is not ideal, many developers use GET requests to do state changing operations.
- Referer header is no exception. There are multiple use cases where referrer header is omitted as well (1, 2, 3, 4 and 5). Load balancers, proxies and embedded network devices are also well known to strip the referrer header due to privacy reasons in logging them.


通常情况下，只有一小部分流量属于上述类别（1-2%），没有企业希望失去这些流量。在因特网上使用的一种流行的技术使这种技术更有用，就是如果Origin/Referer与您配置的域列表相匹配，则接受请求“或”一个Null 值（[示例](http://homakov.blogspot.com/2012/04/playing-with-referer-origin-disquscom.html)）。空值用于覆盖上面提到的不发送这些头的边缘情况）。请注意，攻击者可以利用这一点，但人们更喜欢使用这种技术作为深度防御措施，因为部署它所涉及的工作量很小。

### 双提交 cookie （Double cookie submit）

如果在服务器端维护CSRF token存在问题，可替换的防护方法是使用双提交cookie技术。这种技术简化了实现，而且是无状态的。

基本思想：发送一个随机数，它既作为一个cookie值也作为一个请求参数，服务器验证是否该cookie值和请求值是匹配的。当用户访问网站时，网站首先生成一个强加密的伪随机数值，它不同于session id，把它设为一个发给用户的机器的cookie值。接下来，网站请求每个事务时都将此cookie值作为附加隐藏部分携带（或作为请求参数，或作为请求头）。如果在服务器端每次请求的该值与原始值相匹配，那么就认为请求是合法的。否则，是非法请求。


因为子域可以写cookies到父域，又因为cookies可以经明文HTTP连接在域中被设置，所以只要能确保子域完全安全且仅通过HTTPS访问就可以保障两次cookies提交技术能有效防护csrf攻击。

为了加强这个方案的安全性，要在加密的cookie中加入token，而不是在认证cookie中加入token（因为认证cookies通常在子域间共享），然后在服务器端，将解密cookie后得到的token与隐藏字段（或请求参数，又或AJAX调用的请求头）中包含的token是否一致。这一步验证工作能有效，是因为子域在没有加密密钥的情况下，不能正确改写加密cookie。

还有类似的一个方法是，仅在服务器端使用有密钥的HMAC生成一个token，然后将其值放入cookie中。这与把token放入cookie再加密类似。基于HMAC的方法所需的计算力更小。无论使用加密或HMAC，攻击者不能在没有服务器端密钥的情况下，重新生成cookie值中的token。

#### 带 __Host- 前缀的 cookie
还有一种能够建立CSRF防护解决方案，就是使用Cookie前缀。如果cookie有 ```__Host-``` 前缀，例如```Set-Cookie:__Host-token=RANDOM; path=/; Secure```，那么这个cookie：
- 不能被任何子域所改写；
- 必须有```/```路径;
- 必须标记为Secure，例如，不能经未加密的HTTP发送。

目前，cookie前缀被几乎所有的主流浏览器所接受，除了 IE。


查看 [Mozilla Developer Network](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie#Directives) and [IETF Draft](https://tools.ietf.org/html/draft-west-cookie-prefixes-05) 了解更多相关信息。


### 使用自定义的请求头

增加CSRF tokens，双提交cookie和值，加密的token，或别的防护机制会造成频繁的UI的改变，使其更加复杂或引起新问题。有一种替代方案特别适合使用AJAX或API端点的技术，即使用自定义的请求头。

这种防护依赖同源策略（SOP），SOP限制了仅有JavaScript能够用于增加一个自定义的Header，且仅在他的origin中。默认情况下，浏览器不允许Javascript发出带自定义头部的跨站请求。

如果你的系统适用这种方案，那么你可以在服务器端验证是否存在自定义的请求头和其值，以防止CSRF攻击。这种方法有两个好处，一是它不需要修改UI，二是不需要服务器端状态，特别适用于REST 服务。你可以增加自己需要的自定义头和值。

这种技术明显有利于AJAX调用，但你仍然需要使用token来保护```<form>```标记。而且，跨源资源共享（CORS） 配置也应当健壮有效（来自其它域的自定义请求头应当触发一个预置的CORS检查）。

### 基于CSRF防护的用户交互

上面所有的技术都不要求任何用户交互，但有时更为简单或更正确的方式是在事务中引入用户参与，以防止未授权操作，例如经CSRF伪造或别的攻击。接下来有一些用户参与的例子，如果实现正确的话，可作为强的CSRF防护手段。

- 再认证（使用密码或更强）
- 一次性token
- CAPTCHA 验证码

这些非常强的CSRF防护手段，可能会给用户体验造成大的影响。这些技术通常仅应用在关键操作中（例如，密码修改、钱款交易、等等）。

## Login CSRF
许多开发者常常忽视登录表单中的CSRF漏洞，他们假设 CSRF 不适用于登录表单，因为用户在这个阶段尚未被认证。然而这种假设是不对的，此时 CSRF 攻击仍可能发生，即便用户未认证，但是影响和风险是不同的。

For example, if an attacker uses CSRF to authenticate a victim on a shopping website using the attacker's account, and the victim then enters their credit card information, an attacker may be able to purchase items using the victim's stored card details. For more information about login CSRF and other risks, see section 3 of this paper.

Login CSRF can be mitigated by creating pre-sessions (sessions before a user is authenticated) and including tokens in login form. You can use any of the techniques mentioned above to generate tokens. Remember that pre-sessions cannot be transitioned to real sessions once the user is authenticated - the session should be destroyed and a new one should be made to avoid session fixation attacks. This technique is described in Robust Defenses for Cross-Site Request Forgery section 4.1.

If sub-domains under your master domain are not trusted in your threat model, it is difficult to mitigate login CSRF. A strict subdomain and path level referrer header validation can be used in these cases for mitigating CSRF on login forms to an extent.


### Java 参考例子

The following JEE web filter provides an example reference for some of the concepts described in this cheatsheet. It implements the following stateless mitigations (OWASP CSRFGuard, cover a stateful approach).

- Verifying same origin with standard headers
- Double submit cookie
- SameSite cookie attribute

Please note that it only acts a reference sample and is not complete (for example: it doesn't have a block to direct the control flow when origin and referrer header check succeeds nor it has a port/host/protocol level validation for referrer header). Developers are recommended to build their complete mitigation on top of this reference sample. Developers should also implement standard authentication or authorization checks before checking for CSRF.

Full source is located here and provides a runnable POC.

### JavaScript Guidance for Auto-inclusion of CSRF tokens as an AJAX Request header

The following guidance considers GET, HEAD and OPTIONS methods are safe operations. Therefore GET, HEAD, and OPTIONS method AJAX calls need not be appended with a CSRF token header. However, if the verbs are used to perform state changing operations, they will also require a CSRF token header (although this is bad practice, and should be avoided).

The POST, PUT, PATCH, and DELETE methods, being state changing verbs, should have a CSRF token attached to the request. The following guidance will demonstrate how to create overrides in JavaScript libraries to have CSRF tokens included automatically with every AJAX request for the state changing methods mentioned above.
#### Storing the CSRF Token Value in the DOM

A CSRF token can be included in the <meta> tag as shown below. All subsequent calls in the page can extract the CSRF token from this <meta> tag. It can also be stored in a JavaScript variable or anywhere on the DOM. However, it is not recommended to store it in cookies or browser local storage.

The following code snippet can be used to include a CSRF token as a <meta> tag:

```<meta name="csrf-token" content="{{ csrf_token() }}">```

The exact syntax of populating the content attribute would depend on your web application's backend programming language.

### Overriding Defaults to Set Custom Header

Several JavaScript libraries allow for overriding default settings to have a header added automatically to all AJAX requests.
#### XMLHttpRequest (Native JavaScript)

XMLHttpRequest's open() method can be overridden to set the anti-csrf-token header whenever the open() method is invoked next. The function csrfSafeMethod() defined below will filter out the safe HTTP methods and only add the header to unsafe HTTP methods.

This can be done as demonstrated in the following code snippet:
```
<script type="text/javascript">
    var csrf_token = document.querySelector("meta[name='csrf-token']").getAttribute("content");
    function csrfSafeMethod(method) {
        // these HTTP methods do not require CSRF protection
        return (/^(GET|HEAD|OPTIONS)$/.test(method));
    }
    var o = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(){
        var res = o.apply(this, arguments);
        var err = new Error();
        if (!csrfSafeMethod(arguments[0])) {
            this.setRequestHeader('anti-csrf-token', csrf_token);
        }
        return res;
    };
 </script>
```
#### AngularJS

AngularJS allows for setting default headers for HTTP operations. Further documentation can be found at AngularJS's documentation for $httpProvider.
```
<script>
    var csrf_token = document.querySelector("meta[name='csrf-token']").getAttribute("content");

    var app = angular.module("app", []);

    app.config(['$httpProvider', function ($httpProvider) {
        $httpProvider.defaults.headers.post["anti-csrf-token"] = csrf_token;
        $httpProvider.defaults.headers.put["anti-csrf-token"] = csrf_token;
        $httpProvider.defaults.headers.patch["anti-csrf-token"] = csrf_token;
        // AngularJS does not create an object for DELETE and TRACE methods by default, and has to be manually created.
        $httpProvider.defaults.headers.delete = {
            "Content-Type" : "application/json;charset=utf-8",
            "anti-csrf-token" : csrf_token
        };
        $httpProvider.defaults.headers.trace = {
            "Content-Type" : "application/json;charset=utf-8",
            "anti-csrf-token" : csrf_token
        };
      }]);
 </script>
```
This code snippet has been tested with AngularJS version 1.7.7.
#### Axios

Axios allows us to set default headers for the POST, PUT, DELETE and PATCH actions.
```
<script type="text/javascript">
    var csrf_token = document.querySelector("meta[name='csrf-token']").getAttribute("content");

    axios.defaults.headers.post['anti-csrf-token'] = csrf_token;
    axios.defaults.headers.put['anti-csrf-token'] = csrf_token;
    axios.defaults.headers.delete['anti-csrf-token'] = csrf_token;
    axios.defaults.headers.patch['anti-csrf-token'] = csrf_token;

    // Axios does not create an object for TRACE method by default, and has to be created manually.
    axios.defaults.headers.trace = {}
    axios.defaults.headers.trace['anti-csrf-token'] = csrf_token
</script>
```
This code snippet has been tested with Axios version 0.18.0.
#### JQuery

JQuery exposes an API called $.ajaxSetup() which can be used to add the anti-csrf-token header to the AJAX request. API documentation for $.ajaxSetup() can be found here. The function csrfSafeMethod() defined below will filter out the safe HTTP methods and only add the header to unsafe HTTP methods.

You can configure jQuery to automatically add the token to all request headers by adopting the following code snippet. This provides a simple and convenient CSRF protection for your AJAX based applications:
```
<script type="text/javascript">
    var csrf_token = $('meta[name="csrf-token"]').attr('content');

    function csrfSafeMethod(method) {
        // these HTTP methods do not require CSRF protection
        return (/^(GET|HEAD|OPTIONS)$/.test(method));
    }

    $.ajaxSetup({
        beforeSend: function(xhr, settings) {
            if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader("anti-csrf-token", csrf_token);
            }
        }
    });
</script>
```
This code snippet has been tested with jQuery version 3.3.1.
## References
CSRF
- [OWASP Cross-Site Request Forgery (CSRF)](https://owasp.org/www-community/attacks/csrf)
- [PortSwigger Web Security Academy](https://portswigger.net/web-security/csrf)
- [Mozilla Web Security Cheat Sheet](https://infosec.mozilla.org/guidelines/web_security#csrf-prevention)
- [Common CSRF Prevention Misconceptions](https://www.nccgroup.trust/us/about-us/newsroom-and-events/blog/2017/september/common-csrf-prevention-misconceptions/)
- [Robust Defenses for Cross-Site Request Forgery](https://seclab.stanford.edu/websec/csrf/csrf.pdf)
