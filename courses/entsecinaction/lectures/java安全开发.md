# JAVA 安全开发

## 资源

- [Secure Coding Guidelines for Java SE](https://www.oracle.com/java/technologies/javase/seccodeguide.html)
- [oracle 推荐的Java安全开发最佳实践](https://www.java.com/en/security/developer-info.jsp)  

Java RIA Security Checklist
Java Security Resource Center
Java SE Security on the Oracle Technology Network (OTN)
Secure Coding Guidelines for the Java Programming Language
Java Applet and Web Start Code Signing

- [how-to-write-secure-php-code](https://www.wordfence.com/learn/how-to-write-secure-php-code/)
- [php security](https://www.php.net/manual/en/security.php)

- https://blog.risingstack.com/node-js-security-checklist/


## 阿里巴巴 JAVA 开发 安全规约

https://www.php.cn/java/java-alibaba-anquan.html

1. 【强制】隶属于用户个人的页面或者功能必须进行权限控制校验。

说明：防止没有做水平权限校验就可随意访问、操作别人的数据，比如查看、修改别人的订单。

2. 【强制】用户敏感数据禁止直接展示，必须对展示数据脱敏。

说明：查看个人手机号码会显示成:158****9119，隐藏中间 4 位，防止隐私泄露。

3. 【强制】用户输入的 SQL 参数严格使用参数绑定或者 METADATA 字段值限定，防止 SQL 注入，禁止字符串拼接 SQL 访问数据库。

4. 【强制】用户请求传入的任何参数必须做有效性验证。

说明：忽略参数校验可能导致：

  page size 过大导致内存溢出

  恶意 order by 导致数据库慢查询

  任意重定向

  SQL 注入

 反序列化注入

 正则输入源串拒绝服务 ReDoS

说明：Java 代码用正则来验证客户端的输入，有些正则写法验证普通用户输入没有问题，但是如果攻击人员使用的是特殊构造的字符串来验证，有可能导致死循环的效果。

5. 【强制】禁止向 HTML 页面输出未经安全过滤或未正确转义的用户数据。

6. 【强制】表单、 AJAX 提交必须执行 CSRF 安全过滤。

说明： CSRF(Cross - site request forgery) 跨站请求伪造是一类常见编程漏洞。对于存在CSRF 漏洞的应用/网站，攻击者可以事先构造好 URL ，只要受害者用户一访问，后台便在用户不知情情况下对数据库中用户参数进行相应修改。

7. 【强制】在使用平台资源，譬如短信、邮件、电话、下单、支付，必须实现正确的防重放限制，如数量限制、疲劳度控制、验证码校验，避免被滥刷、资损。

说明：如注册时发送验证码到手机，如果没有限制次数和频率，那么可以利用此功能骚扰到其

它用户，并造成短信平台资源浪费。

8. 【推荐】发贴、评论、发送即时消息等用户生成内容的场景必须实现防刷、文本内容违禁词过滤等风控策略。

---------------------
本文著作权归作者所有。
商业转载请联系作者获得授权，非商业转载请注明出处。
来源地址：https://www.php.cn/java/java-alibaba-anquan.html
来源：php中文网(www.php.cn)
© 版权声明：转载请附上博文链接！