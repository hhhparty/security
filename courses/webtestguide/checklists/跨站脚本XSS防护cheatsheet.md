# 跨站脚本防护 Cheat Sheet

内容取自：[OWASP Cross Site Scripting Prevention](nodejs%20security%20checklist.mdhttps://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)

## 介绍

攻击者利用XSS漏洞可以窃取Cookies、Session Token、其它敏感信息、或者修改网页，其危害十分严重，几乎每年都被列入Web安全TOP 10 威胁之中。本文介绍了一个简单的主动式模型，通过对输出进行转义或编码来防止XSS攻击。尽管大量的XSS攻击形式多样，但只要遵循一些简单的规则，就可以有效防御此类攻击。

反射型（reflected）XSS 或是存储型（stored）XSS，都可以在服务器端执行恰当的验证和转义予以定位识别。基于DOM的XSS也可以使用一些特殊的规则子集进行识别。

## 主动XSS防护模型

我们可以将HTML页面当成一个带有插槽（slot）的模板。这些插槽用于存放不受信任的数据。这些插槽涵盖了开发人员希望放置不受信任的数据的绝大多数常见位置。不允许将不受信任的数据放在HTML的其他位置。换句话说，这是一个“白名单”模型，它拒绝所有未明确允许的内容。

给定浏览器解析HTML的方式，每个不同类型的插槽有略微不同的安全规则。当你将不受信任的数据存放在插槽中时，需要采取一些步骤来保证数据不会脱离插槽而进入代码执行环境中。在某种程度上，这种方法将HTML文档当作参数化的数据库查询一样对待，即数据保存在特定位置，并且通过转义与代码上下文隔离。

下面的内容列举了OWASP提供的最常见的插槽类型，以及将不可信数据安全地放入其中的规则。这些方法已经过众多的XSS攻击向量以及常见浏览器的大量安全测试，OWASP认为这些规则是安全的。当然，在使用之前，开发人员和安全人员还应慎重的综合考虑。尤其是在浏览器解析各种字符时，在正确的上下文中，许多无害的字符可能变得有问题。

###





## References
-  [XSS Filter Evasion Cheat Sheet](https://owasp.org/www-community/xss-filter-evasion-cheatsheet)

- [DOM BASED XSS PROTECTION CHEATSHEET](https://cheatsheetseries.owasp.org/cheatsheets/DOM_based_XSS_Prevention_Cheat_Sheet.html)