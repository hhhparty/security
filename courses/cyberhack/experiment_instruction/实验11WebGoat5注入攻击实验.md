# 实验 11 Sql注入攻击1

## 实验目的

通过实验，使学习者：
- 理解注入攻击的基本原理
- 掌握使用工具实施注入攻击的方法
- 理解Web系统防御注入攻击的对策

## 实验内容

1.尝试对owasp bwa v1.2中的webgoat 5.4中的Injection Flaws —— Numeric SQL Injection进行SQL注入攻击。
2.尝试对owasp bwa v1.2中的webgoat 5.4中的Injection Flaws —— Log spoofing进行注入攻击。
3.尝试对owasp bwa v1.2中的webgoat 5.4中的Injection Flaws —— xpath injection进行注入攻击。
4.尝试对owasp bwa v1.2中的webgoat 5.4中的Injection Flaws —— String SQL Injection进行注入攻击。
5.尝试对owasp bwa v1.2中的webgoat 5.4中的Injection Flaws —— LAB:SQL Injection。

## 实验过程

### Numeric SQL Injection实验

1.启动 owasp bwa v1.2 虚拟机（启动后自动加载WebGoat 5.4 网站应用），查看其主机ip（下面以10.10.10.135为例）

2.启动 kali 2019虚拟机

3.在Kali 2019 虚拟机中打开设置了burpsuite proxy的浏览器firefox和Burp suite。

4.通过fireforx浏览器访问 webgoat 5.4 应用，链接为：http://10.10.10.135/WebGoat/attack，认证用户名webgoat，密码为webgoat；然后点击左侧导航Injection Flaws——Numeric SQL Injection。

![injectionflaws-numericsqlinjection-01](images/webgoat/injectionflaws-numericsqlinjection-01.png)

上图中可见，选择下拉选择框的地区，例如“Columbia”，然后点“Go！”，可见出现下方的天气信息。

5.设置BurpSuite中的proxy-Interrupt is on ，准备拦截访问请求；然后再次点击上一步中的“Go！”，在拦截到的请求参数中插入sql语句：
```
 or 1=1  
```
![injectionflaws-numericsqlinjection-02](images/webgoat/injectionflaws-numericsqlinjection-02.png)

6.点击burp suite proxy中的“Forward”，然后在浏览器中会发现下图结果：

![injectionflaws-numericsqlinjection-03](images/webgoat/injectionflaws-numericsqlinjection-03.png)

注入成功。

### Log Spoofing实验

1.启动 owasp bwa v1.2 虚拟机（启动后自动加载WebGoat 5.4 网站应用），查看其主机ip（下面以10.10.10.135为例）

2.通过任意浏览器访问 webgoat 5.4 应用，链接为：http://10.10.10.135/WebGoat/attack，认证用户名webgoat，密码为webgoat；然后点击左侧导航Injection Flaws——Log Spoofing。

![injectionflaws-logspoofing-01](images/webgoat/injectionflaws-logspoofing-01.png)

说明：图中灰色部分代表了服务器日志中的记录。日志是网站安全维护时要审查的重点，写入虚假日志会扰乱、迷惑维护人员开展工作。本题的目标是在输入框中键入含特殊字符的字符串，使日志文件（灰色部分）出现“Login Succeeded for username: admin”的记录。

3.在“user name：” 输入框后键入如下内容：
```
whor%0d%0aLogin Succeeded for username: admin
```
![injectionflaws-logspoofing-02](images/webgoat/injectionflaws-logspoofing-02.png)

注入成功。
> 这个例子仅是对日志欺骗的一个简单示例，实际的日志欺骗会复杂得多。

### XPATH注入攻击

1.启动 owasp bwa v1.2 虚拟机（启动后自动加载WebGoat 5.4 网站应用），查看其主机ip（下面以10.10.10.135为例）

2.通过任意浏览器访问 webgoat 5.4 应用，链接为：http://10.10.10.135/WebGoat/attack，认证用户名webgoat，密码为webgoat；然后点击左侧导航Injection Flaws——XPATH Injection。

阅读页面提示可知，网站提供了一个工资查询表单，键入用户名和口令会输出工资。如下图所示：
![injectionflaws-xpathinjection-01](images/webgoat/injectionflaws-xpathinjection-01.png)

如何查看其他人或所有人的信息呢？可以尝试注入攻击。一般情况下工资和员工信息存在数据库中，但这个例子中的信息存放在xml中。

3.在user name后的输入框中键入下面内容：
```
Mike' or '1'='1' or 'a'='a
```
4.在password输入框输入任意字符，例如“123”，之后提交，有下列结果：

![injectionflaws-xpathinjection-02](images/webgoat/injectionflaws-xpathinjection-02.png)

注入成功。

说明：
开发人员构造的xpath查询语句大致为：
```
//user[name/text()='Mike' and password/text()='test123']
```
注入后查询语句改为：
```
//user[name/text()='Mike' or '1'='1' or 'a'='a' and password/text()='123']
```

### String SQL Injection

1.启动 owasp bwa v1.2 虚拟机（启动后自动加载WebGoat 5.4 网站应用），查看其主机ip（下面以10.10.10.135为例）

2.通过任意浏览器访问 webgoat 5.4 应用，链接为：http://10.10.10.135/WebGoat/attack，认证用户名webgoat，密码为webgoat；然后点击左侧导航Injection Flaws——String SQL Injection。

![injectionflaws-stringsqli-01](images/webgoat/injectionflaws-stringsqli-01.png)

3.尝试进行下列sql注入，然后点击“Go！”
```
Your Name' or 1=1 or '1'='1
```
![injectionflaws-stringsqli-02](images/webgoat/injectionflaws-stringsqli-02.png)


### 综合SQL 注入

1.启动 owasp bwa v1.2 虚拟机（启动后自动加载WebGoat 5.4 网站应用），查看其主机ip（下面以10.10.10.135为例）

2.通过任意浏览器访问 webgoat 5.4 应用，链接为：http://10.10.10.135/WebGoat/attack，认证用户名webgoat，密码为webgoat；然后点击左侧导航Injection Flaws——LAB:SQL Injection。

3.尝试完成Stage 1。利用sql注入实现旁路认证。先试用表单，以Neville和任意密码login。可见“login failed”。

![injectionflaws-labsqlinjection-01](images/webgoat/injectionflaws-labsqlinjection-01.png)

4.启动Kali 2019 虚拟机中打开设置了burpsuite proxy的浏览器firefox和Burp suite。通过fireforx浏览器访问相关链接，并用burp suite拦截请求，在password参数值处进行sql注入。

注入内容可以如下：
```
123' or 1=1 or '1'='1
```
![injectionflaws-labsqlinjection-02](images/webgoat/injectionflaws-labsqlinjection-02.png)

5.注入完成后，点击浏览器页面上的“login”，可以看到第一阶段成功。

![injectionflaws-labsqlinjection-03](images/webgoat/injectionflaws-labsqlinjection-03.png)

6.第二阶段，使用参数化查询方式修改源代码，使其能够防御一般的sql注入攻击。

过程略

7.第三阶段，首先要在密码输入处进行注入，以Larry用户身份登录。

注入内容为：
```
123' or '1'='1
```

![injectionflaws-labsqlinjection-04](images/webgoat/injectionflaws-labsqlinjection-04.png)

![injectionflaws-labsqlinjection-05](images/webgoat/injectionflaws-labsqlinjection-05.png)

8.然后在选择点击 View Profile，并使用burp进行拦截。

![injectionflaws-labsqlinjection-06](images/webgoat/injectionflaws-labsqlinjection-06.png)

9.在 employee_id 参数处注入下面内容：
```
101 or 1=1 order by employee_id desc
```

![injectionflaws-labsqlinjection-07](images/webgoat/injectionflaws-labsqlinjection-07.png)

![injectionflaws-labsqlinjection-08](images/webgoat/injectionflaws-labsqlinjection-08.png)

注入成功。



## 实验结论