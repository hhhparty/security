# cookie 与 cookie control
## cookie


### http-only

服务器响应中使用```Set-Cookie```设置。使用此选项用于消除客户端脚本访问cookie。可用于防止常见的XSS攻击，设置方法例如：```Set-Cookie: `=``[; ``=``]` `[; expires=``][; domain=``]` `[; path=``][; secure][; HttpOnly]` ``` 
### samesite
使用 SameSite 属性明确 Cookie 的使用。Samesite有三个可选值：
- strict
- lax
- none


Strict最为严格，完全禁止第三方 Cookie，跨站点时，任何情况下都不会发送 Cookie。换言之，只有当前网页的 URL 与请求目标一致，才会带上 Cookie。这个规则过于严格，可能造成非常不好的用户体验。比如，当前网页有一个 GitHub 链接，用户点击跳转就不会带有 GitHub 的 Cookie，跳转过去总是未登陆状态。

Lax规则稍稍放宽，大多数情况也是不发送第三方 Cookie，但是导航到目标网址的 Get 请求除外。导航到目标网址的 GET 请求，只包括三种情况：链接，预加载请求，GET 表单。详见下表。

|请求类型|	示例|	无samesite设置时|设置Samesite=Lax时|
|-|-|-|-|
|链接|	```<a href="..."></a>```|	发送 Cookie	|发送 Cookie|
|预加载	|```<link rel="prerender" href="..."/>```|	发送 Cookie	|发送 Cookie|
|GET 表单	|```<form method="GET" action="...">```|	发送 Cookie|	发送 Cookie|
|POST 表单|```	<form method="POST" action="...">	```|发送 Cookie	|不发送|
|iframe	|```<iframe src="..."></iframe>```|	发送 Cookie	|不发送|
|AJAX	|```$.get("...")```	|发送 Cookie|	不发送|
|Image	|```<img src="...">```|	发送 Cookie|	不发送|


None限制最为宽松，可以使用 None 来明确指明支持在第三方上下文中发送 Cookie。

设置了Strict或Lax以后，基本就杜绝了 CSRF 攻击。当然，前提是用户浏览器支持 SameSite 属性。

## cookie-control
- no-cache: 告诉浏览器、缓存服务器，不管本地副本是否过期，使用资源副本前，一定要到源服务器进行副本有效性校验。
- must-revalidate：告诉浏览器、缓存服务器，本地副本过期前，可以使用本地副本；本地副本一旦过期，必须去源服务器进行有效性校验。
- 