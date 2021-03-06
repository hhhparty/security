# 输入验证简明手册

## 介绍

本文着重于提供清晰，简单，可操作的指南，在应用中提供输入验证安全功能。

## 输入验证的目标

进行输入验证是为了确保只有正确形成的数据才能进入信息系统中的工作流，从而防止格式错误的数据保留在数据库中并触发各种下游组件的故障。输入验证应在数据流中尽早进行，最好是在从外部方收到数据后立即进行。

所有不可信来源的数据应接受输入验证，不仅包括来自Internet的Web前端输入，还包括来自供应商，合作伙伴，外包商或监管机构的后端输入。

输入验证不应用作为防止 XSS，SQL注入以及其他多种攻击的“主要”方法，但如果实施得当，可以大大降低多种攻击影响。

## 输入验证策略

输入验证应同时应用于“语法”和“语义”级别。

**语法**验证应强制使用结构化字段的正确语法（例如：SSN，日期，货币符号）。

**语义**验证应在特定业务环境中加强其值的正确性（例如，开始日期早于结束日期，价格在预期范围内）。

始终建议在处理用户（或攻击者）请求时尽早防止攻击。输入验证可用于检测未经授权的输入，然后再由应用程序对其进行处理。

## 实施输入验证

输入验证可以使用允许有效实施语法和语义正确性的任何编程技术来实现，例如：

- Web应用程序框架中固有的数据类型验证器（例如[Django验证器](https://docs.djangoproject.com/en/1.11/ref/validators/)，[Apache Commons验证器](https://commons.apache.org/proper/commons-validator/apidocs/org/apache/commons/validator/package-summary.html#doc.Usage.validator)等）。
- 针对[JSON Schema](http://json-schema.org/)和[XML Schema（XSD）](https://www.w3schools.com/xml/schema_intro.asp)进行验证，以这些格式进行输入。
- 带有严格异常处理的类型转换（例如Java中的```Integer.parseInt()```，Python中的```int()```）
- 检查数字参数和日期的最小和最大值范围，检查字符串的最小和最大长度。
- 少量字符串参数（例如，星期几）的允许值数组。
- 覆盖整个输入字符串```（^ ... $）```，并且不使用通配字符（例如```.```或```\S```）的正则表达式.

### 白名单vs黑名单

使用黑名单验证来尝试检测可能存在危险的字符和模式（例如撇号```'```，字符串'1 = 1'或```<script>```标签）是一个常见错误，但这是一个严重缺陷的方法，因为攻击者绕过此类过滤器很简单。

另外，此类过滤器经常会阻止合法的输入，例如“ O'Brian”，其中“'”字符是完全合法的。有关XSS过滤器规避的更多信息，请参见[此Wiki页面](https://owasp.org/www-community/xss-filter-evasion-cheatsheet)。

白名单验证适用于用户提供的所有输入字段。白名单验证涉及准确定义 IS 被授权，并且根据定义，所有其他内容均未被授权。

如果数据结构良好，例如日期，社会保险号，邮政编码，电子邮件地址等，那么开发人员应该能够定义一个非常强的验证模式，通常基于正则表达式来验证此类输入。

如果输入字段来自一组固定的选项（例如下拉列表或单选按钮），则输入验证应检查输入值是否为提供给用户的某个值。

### 验证自由格式的Unicode文本

由于需要将白名单中的字符相对较大的空间，自由格式的文本（尤其是带有Unicode字符的文本）被认为难以验证。

它也是自由格式的文本输入，突出了正确的上下文感知输出编码的重要性，并且很清楚地表明，输入验证不是反对跨站点脚本的主要保护措施。如果您的用户想要在其注释字段中键入“撇号”或小于号“ <”，则可能有完全正当的理由，并且应用程序的工作是在数据的整个生命周期中正确处理它。

自由格式文本输入的输入验证主要方法应为：

- **规范化**：确保所有文本均使用规范编码，并且不存在无效字符。
- **字符类别白名单**： Unicode允许将诸如“十进制数字”或“字母”之类的白名单列入白名单，这些类别不仅涵盖拉丁字母，而且涵盖全球使用的各种其他脚本（例如阿拉伯语，西里尔字母，CJK表意文字等）。
- **个人字符白名单：**如果您在名称中允许使用字母和表意文字，并且还希望对爱尔兰名称使用撇号“'”，但又不想允许使用整个标点符号类别。

参考文献：

- [Python中自由格式Unicode文本的输入验证](https://web.archive.org/web/20170717174432/https://ipsec.pl/python/2017/input-validation-free-form-unicode-text-python.html/)

### 常用表达

开发正则表达式可能会很复杂，并且远远超出了本备忘单的范围。

互联网上有很多有关如何编写正则表达式的资源，包括此[站点](https://www.regular-expressions.info/)和[OWASP验证正则表达式存储库](https://owasp.org/www-community/OWASP_Validation_Regex_Repository).

总之，输入验证应：

- 至少应用于所有输入数据。
- 定义允许的字符集。
- 定义数据的最小和最大长度（例如`{1,25}`）。

## 白名单正则表达式示例

验证美国邮政编码（5位数字加可选的-4）: ```^\d{5}(-\d{4})?$```

从下拉菜单中验证美国的州选择:

```
^(AA|AE|AP|AL|AK|AS|AZ|AR|CA|CO|CT|DE|DC|FM|FL|GA|GU|
HI|ID|IL|IN|IA|KS|KY|LA|ME|MH|MD|MA|MI|MN|MS|MO|MT|NE|
NV|NH|NJ|NM|NY|NC|ND|MP|OH|OK|OR|PW|PA|PR|RI|SC|SD|TN|
TX|UT|VT|VI|VA|WA|WV|WI|WY)$
```

**Java Regex使用示例：**

使用正则表达式验证参数“ zip”的示例。

```Java
private static final Pattern zipPattern = Pattern.compile("^\d{5}(-\d{4})?$");

public void doPost( HttpServletRequest request, HttpServletResponse response) {
  try {
      String zipCode = request.getParameter( "zip" );
      if ( !zipPattern.matcher( zipCode ).matches()  {
          throw new YourValidationException( "Improper zipcode format." );
      }
      // do what you want here, after its been validated ..
  } catch(YourValidationException e ) {
      response.sendError( response.SC_BAD_REQUEST, e.getMessage() );
  }
}
```


您还可以在各种开源软件包中预定义一些白名单验证器。例如：

- [Apache Commons Validator](http://commons.apache.org/proper/commons-validator/)

## 客户端vs服务器端验证

请注意，通过禁用JavaScript或使用Web代理的攻击者可以绕过客户端上执行的所有JavaScript输入验证。确保在客户端上执行的所有输入验证也在服务器上执行。

## 验证丰富的用户内容

验证用户提交的丰富内容非常困难。有关更多信息，请参见XSS速查表关于使用专为作业设计的库清理HTML标记。

## 防止XSS和内容安全策略

返回HTML页面时，所有受控制的用户数据都必须进行编码，以防止执行恶意数据（例如XSS）。例如，```<script>```将作为```&lt; script&gt;```返回。

编码类型特定于插入用户控制数据的页面的上下文。例如，HTML实体编码适合放置在HTML主体中的数据。但是，放置在脚本中的用户数据将需要JavaScript特定的输出编码。

有关XSS预防的详细信息，请参见 OWASP XSS预防速查表.

## 文件上传验证

许多网站允许用户上传文件，例如个人资料图片或更多。本节有助于安全地提供该功能。

检查文件上传备忘单。

### 上传验证

- 使用输入验证来确保上传的文件名使用预期的扩展名类型。
- 确保上传的文件不大于定义的最大文件大小。
- 如果网站支持ZIP文件上传，请先进行验证检查，然后再解压缩文件。检查包括目标路径，压缩级别，估计的解压缩大小。

### 上传存储

- 使用新的文件名将文件存储在OS上。不要使用任何用户控制的文本作为此文件名或临时文件名。
- 文件上传到网络后，建议重命名存储中的文件。例如，上载的文件名是**test.JPG**，将其重命名为**JAI1287uaisdjhf.JPG**，文件名是随机的。这样做的目的是为了防止直接文件访问和模糊的文件名来逃避过滤器的风险，例如```test.jpg; .asp或/../../../../../test.jpg ```。
- 应该对上传的文件进行恶意内容分析（反恶意软件，静态分析等）。
- 文件路径不能由客户端指定，应由服务器端决定。

### 已上传内容的公共服务

- 确保为已上传图片提供正确的内容类型（例如image / jpeg，application / x-xpinstall）

### 当心“特殊”文件

上传功能应使用白名单方法，仅允许特定的文件类型和扩展名。但是，重要的是要注意以下文件类型，如果允许，可能会导致安全漏洞：

- ```crossdomain.xml``` 或 ```clientaccesspolicy.xml```：允许在Flash，Java和Silverlight中加载跨域数据。如果在经过身份验证的网站上允许，则可能允许跨域数据盗窃和CSRF攻击。请注意，这可能会变得非常复杂，具体取决于所讨论的特定插件版本，因此最好只禁止名为“ crossdomain.xml”或“ clientaccesspolicy.xml”的文件。
- ```.htaccess```和```.htpasswd```：提供基于目录的服务器配置选项，不应允许。请参阅[HTACCESS文档](http://en.wikipedia.org/wiki/Htaccess)。
- 建议不要使用Web可执行脚本文件，例如```aspx, asp, css, swf, xhtml, rhtml, shtml, jsp, js, pl, php, cgi```。

### 图片上传验证

- 使用图像重写库来验证图像有效并剥离多余的内容。
- 根据从图像处理中检测到的图像内容类型，将存储的图像扩展名设置为有效的图像扩展名（不要信任上传文件中的标题）。
- 确保检测到的图像内容类型在已定义图像类型（jpg，png等）的列表内。

## 电子邮件地址验证

### 语法验证

电子邮件地址的格式由 [RFC 5321](https://tools.ietf.org/html/rfc5321#section-4.1.2) 定义，并且比大多数人意识到的要复杂得多。例如，以下内容均被视为有效的电子邮件地址：


- ```"><script>alert(1);</script>"@example.org```
- ```user+subaddress@example.org```
- ```user@[IPv6:2001:db8::1]```
- ```" "@example.org```


使用正则表达式正确解析电子邮件地址的有效性非常复杂，尽管有很多 [regex上公开可用的文档](https://tools.ietf.org/id/draft-seantek-mail-regexen-03.html#rfc.section.3)

最大的警告是，尽管RFC为电子邮件地址定义了一种非常灵活的格式，但是大多数现实世界中的实现（例如邮件服务器）使用的地址格式要受限制得多，这意味着它们将拒绝在技术上有效的地址。尽管从技术上讲它们可能是正确的，但是如果您的应用程序将无法实际向其发送电子邮件，则这些地址几乎没有用。

因此，验证电子邮件地址的最佳方法是执行一些基本的初始验证，然后将地址传递给邮件服务器，并在拒绝邮件时捕获异常。这意味着任何应用程序都可以确信其邮件服务器可以将电子邮件发送到其接受的任何地址。初始验证可以很简单：

- 电子邮件地址包含两部分，并用一个```@```符号分隔。
- 电子邮件地址不包含危险字符（例如反引号，单引号或双引号或空字节）。
  - 究竟哪些字符是危险的取决于地址的使用方式（在页面中回显，插入数据库等）。
- 域部分仅包含字母，数字，连字符（```-```）和句点（`.`）。
- 电子邮件地址的长度合理：
  - 本地部分（在@之前）不得超过63个字符。
  - 总长度不得超过254个字符。

### 语义验证

语义验证是关于确定电子邮件地址是否正确和合法。最常见的方法是向用户发送电子邮件，并要求他们单击电子邮件中的链接，或输入已发送给他们的代码。这提供了以下基本保证：

- 电子邮件地址正确。
- 该应用程序可以成功向其发送电子邮件。
- 用户有权访问邮箱。

发送给用户以证明所有权的链接应包含以下令牌：

- 至少32个字符。
- 使用[安全的随机性源]（Cryptographic_Storage_Cheat_Sheet.md＃secure-random-number-generation）生成。
- 一次性使用。
- 时间限制（例如，八个小时后到期）。

验证电子邮件地址的所有权后，应要求用户通过常规机制在应用程序上进行身份验证。

#### 一次性电子邮件地址

在某些情况下，用户在应用程序上注册时可能不希望提供其真实的电子邮件地址，而是提供了一个一次性电子邮件地址。这些是不需要用户进行身份验证的公用地址，通常用于减少用户的主电子邮件地址收到的垃圾邮件数量。

阻止一次性电子邮件地址几乎是不可能的，因为有大量的网站提供这些服务，并且每天都会创建新的域。有许多已知的一次性域的公开列表和商业列表，但是这些总是不完整的。

如果使用这些列表来阻止使用一次性电子邮件地址，则应该向用户显示一条消息，说明阻止它们的原因（尽管他们很可能只是搜索其他一次性提供商而不是提供其合法地址）。

如果必须禁用一次性电子邮件地址，则仅应允许从特定白名单的电子邮件提供商进行注册。但是，如果其中包括Google或Yahoo之类的公共提供商，则用户只需向其注册自己的可使用地址即可。

#### 子寻址

子地址允许用户在电子邮件地址的本地部分（在“ @”符号之前）指定_tag_，邮件服务器将忽略它。例如，如果该“ example.org”域支持子地址，则以下电子邮件地址是等效的：

- `user @ example.org`
- `user + site1 @ example.org`
- `user + site2 @ example.org`

许多邮件提供商（例如Microsoft Exchange）不支持子地址。尽管有很多其他提供商，但最著名的提供商是Gmail。

一些用户将为他们注册的每个网站使用不同的_tag_，因此，如果他们开始收到其中一个子地址的垃圾邮件，则可以识别出哪个网站泄漏或出售了其电子邮件地址。

因为它可以允许用户使用一个电子邮件地址注册多个帐户，所以某些站点可能希望通过去除“ +”和“ @”符号之间的所有内容来阻止子地址。通常不建议这样做，因为这表明网站所有者要么不知道子地址，要么希望防止用户在泄漏或出售电子邮件地址时对其进行标识。此外，可以通过使用[一次性电子邮件地址]（＃disposable-email-addresses）或简单地向受信任的提供商注册多个电子邮件帐户来略过它。