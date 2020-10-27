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

#### SQL 基础
SQL 是关系数据库的定义、操作、查询（DDL、DML、DCL）语言，在Web系统中很常见。SQL注入问题也是很多企业数据泄露事件的关键所在。

下面是一些SQL语法：

```SELECT 列名称 FROM 表名称```

```SELECT DISTINCT 列名称 FROM 表名称```

```UPDATE 表名称 SET 列名称 = 新值 WHERE 列名称 = 某值```

```INSERT INTO 表名称 VALUES (值1, 值2,....)```

```DELETE FROM 表名称 WHERE 列名称 = 值```

```
CREATE DATABASE database_name


CREATE TABLE 表名称
(
列名称1 数据类型,
列名称2 数据类型,
列名称3 数据类型,
....
)
```

创建表时常见的约束有：
- NOT NULL
- UNIQUE
- PRIMARY KEY
- FOREIGN KEY
- CHECK
- DEFAULT

```
CREATE INDEX index_name
ON table_name (column_name)

CREATE UNIQUE INDEX index_name
ON table_name (column_name)
```

```
# SQL DROP INDEX 语句
# 用于 Microsoft SQLJet (以及 Microsoft Access) 的语法:
DROP INDEX index_name ON table_name
# 用于 MS SQL Server 的语法:
DROP INDEX table_name.index_name
# 用于 IBM DB2 和 Oracle 语法:
DROP INDEX index_name
# 用于 MySQL 的语法:
ALTER TABLE table_name DROP INDEX index_name


#SQL DROP TABLE 语句
# DROP TABLE 语句用于删除表（表的结构、属性以及索引也会被删除）：

DROP TABLE 表名称

#SQL DROP DATABASE 语句
#DROP DATABASE 语句用于删除数据库：

DROP DATABASE 数据库名称

#SQL TRUNCATE TABLE 语句
#如果我们仅仅需要除去表内的数据，但并不删除表本身，那请使用 TRUNCATE TABLE 命令（仅仅删除表格中的数据）：

TRUNCATE TABLE 表名称
```

```
#ALTER TABLE 语句
#ALTER TABLE 语句用于在已有的表中添加、修改或删除列。

ALTER TABLE table_name
ADD column_name datatype

#要删除表中的列，请使用下列语法：

ALTER TABLE table_name 
DROP COLUMN column_name

#注释：某些数据库系统不允许这种在数据库表中删除列的方式 (DROP COLUMN column_name)。
#要改变表中列的数据类型，请使用下列语法：

ALTER TABLE table_name
ALTER COLUMN column_name datatype
```

```
#SQL CREATE VIEW 语句
CREATE VIEW view_name AS
SELECT column_name(s)
FROM table_name
WHERE condition
```

第一题，Try to retrieve the department of the employee Bob Franco.，键入sql语句：```select department from employees where first_name='Bob' and last_name='Franco'```

第二题，Try to change the department of Tobi Barnett to 'Sales'. 键入sql语句：```UPDATE employees SET department='Sales' where first_name='Tobi' and last_name='Barnett'```

第三题，try to modify the scheme by adding the column "phone" (varchar(20)) to the table "employees". :键入下列语句：
```ALTER TABLE employees ADD phone varchar(20);```



SQL的GRANT 允许对象的创建者给某用户或某组或所有用户（PUBLIC）某些特定的权限．对象创建后，除了创建者外，除非创建者赋予（GRANT）权限，其他人没有访问对象的权限．一旦用户有某对象的权限，他就可以使用那个特权．不需要给创建者赋予（GRANT）对象的权限，创建者自动拥有对象的所有权限，包括删除它的权限．

SQL的GRANT — 赋予一个用户，一个组或所有用户访问权限
语法：```GRANT privilege [, ...] ON object [, ...] TO { PUBLIC | GROUP group | username }```

privilege 可能的权限有：
- SELECT 访问声明的表/视图的所有列/字段．
- INSERT 向声明的表中插入所有列字段．
- UPDATE 更新声明的表所有列/字段．
- DELETE 从声明的表中删除所有行．
- RULE 在表/视图上定义规则 （参见 CREATE RULE 语句）．
- ALL 赋予所有权限．

object 赋予权限的对象名．可能的对象是：
- table
- view
- sequence

PUBLIC 代表是所有用户的简写．
- GROUP group 将要赋予权限的组 group ．
- username 将要赋予权限的用户名．PUBLIC 是代表所有用户的简写．

输出：
- CHANGE 如果成功，返回此信息．
- ERROR: ChangeAcl: class "object" not found 如果所声明的对象不可用或不可能对声明的组或用户赋予权限．


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