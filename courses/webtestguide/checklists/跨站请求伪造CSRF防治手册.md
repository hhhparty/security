# CSRF 防治手册

内容取自：[Cross-Site Request Forgery Prevention Cheat Sheet](https://github.com/OWASP/CheatSheetSeries/blob/master/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.md)

## 介绍

CSRF 是一种类型的攻击，它发生在某个恶意网站、邮件、博客、即时消息或程序利用或通过某个已经通过某个受信任完整认证的用户（victim）的浏览器执行一个意外活动时。一个CSRF攻击能够成功，是因为浏览器请求自动地包含了所有cookies（包含会话cookies)。因此，如果一个用户已经成功登录了某个网站，那么这个网站不能区别使用同一浏览器的是用户请求还是伪造请求？

CSRF攻击的影响，取决于脆弱漏洞的严重程度和用户权限的大小。例如，攻击者可能会

