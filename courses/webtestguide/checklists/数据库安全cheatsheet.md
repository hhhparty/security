# 数据库安全手册

内容来源：OWASP Database Security Cheat Sheet。

这篇Cheat sheet 给出了一些关于安全配置和使用SQL或非SQL数据库的建议。在没有专门的DBA时，推荐管理数据的应用开发者使用。本文不涉及SQL注入防护。

## 连接到数据库

为了防止恶意或非法用户对数据库进行连接，后台数据库应尽量被隔离起来。具体怎么做依赖于系统和网络架构。下面的一些选项可以用户保护：
- 禁用网络（TCP）访问，要求所有访问经过本地socket文件或命名管道连接。
- 配置数据库，仅绑定到localhost
- 使用防火墙规则，限制仅特定主机可以经网络访问（白名单）
- 将应用服务器和数据服务器分别放在不同的DMZ区。

所有基于web的数据库管理配置工具，也应当按照上述类似方式进行保护，例如phpMyAdmin。

当一个应用运行在不可信系统时，例如胖客户端，应当总是通过一个API连接后台，这样可以加强恰当的访问控制和限制。应当总是避免从一个胖客户端直接连接后台数据库。

### 传输层保护

许多数据库的默认配置，允许未加密网络连接。尽管有一些数据库会加密初始的认证（例如SQL SERVER），但后续的流量不会被加密，这意味着所有敏感信息将以明文在网络中传输。下列步骤可用于保护未加密流量：

- 配置数据库，仅允许加密的连接；
- 在数据库服务器上一个可信的数字证书；
- 使用带现代密码算法（AES-GCM或ChaCha20）的 TLSv1.2+ 配置客户应用进行连接；
- 配置客户应用来验证这些数字证书是否正确。

OWASP CHEAT SHEET中的传输层保护和TLS 加密字符串 章节包含了更多的详细信息。

## 认证

数据库应当总是配置必要的认证过程，包括从本地服务器连接。数据库账户应当：
- 使用强的或唯一的口令来保护；
- 每个用户由单一应用或服务使用；
- 配置最小特权（下面详细讨论）。

任何系统都有其自己的用户账户，通常的账户管理过程应当遵循，包括：
- 对账户进行规范性复查，确认其目前仍然有必要存在；
- 规范的复查权限；
- 当某个应用不再使用时，删除其用户账户；
- 当员工离职或有理由相信他们不可信时，更改口令。

对于Microsoft sql server，考虑使用 Windows or Integrated-Authentication，它使用现有的windows账户而不是sqlserver 账户。这也去除了存储再应用中存储机密的需求，因为它将使用windows用户机密凭据连接。 Windows Native Authentication Plugins未mysql提供了近似的功能。


### 存储数据库密令

数据库登录密令不应当存放在应用的源代码中，特别是未加密的数据库访问口令。数据库口令应当存放在一个配置文件中，并满足：
- 在Webroot之外；
- 有正确的访问权限，以便仅可由必要的用户读取；
- 不能签入源代码库。

如果允许，应当加密或者使用内置的安全功能保护数据库口令，例如ASP.net 对 web.config 加密。

## 权限

数据访问权限分配应当基于最小特权原则，例如账户应当仅有最小的必要的权限。根据数据库中可用的功能，可以在多个逐步细化的级别上应用此功能。接下来的步骤应当遵循（绝大多数情况都可用）：
- 不要使用内建的 ```root```,```sa``` 或 ```SYS``` 账户；
- 不要在数据库实例上授权管理员账户权限；
- 仅允许白名单列表中的账户访问。常见为 ```localhost``` 或某个应用的地址；
- 仅授予用户有必要访问的数据库的访问授权，开发、UAT、产品环境应当分别使用独立的数据库和账户；
- 仅在数据库上授权必要的权限。很多应用仅使用```select```, ```update```和```delete```权限；这些账号不应当是数据库管理员，否则会导致提权漏洞（privilege escalation）；

对于安全敏感的某些关键应用，可能要采取更加精细的权限设计，包括：
- 表级的许可
- 列级的许可
- 行级的许可
- 阻拦对当前表的访问，仅对用户开放受限制的视图。

## 数据库配置和加固

承载数据库服务器的操作系统，必须与其它服务器一样得到安全加固，即基于一定的安全基线，例如 [CIS Benchmarks](https://www.cisecurity.org/cis-benchmarks/) 或者 [Microsoft Securtiy Baselines](https://docs.microsoft.com/en-us/windows/security/threat-protection/windows-security-baselines)


数据库应用应该被正确的配置和加固。下面的一些原则应当在任何数据库应用或平台中被采用：
- 安装任何需要的安全更新和补丁；
- 删除任何默认账户和数据库；
- 将数据库主文件和事务日志分别存放在不同的磁盘上；
- 配置一个规范的数据库备份，确保备份使用了恰当的权限和恰当的加密。

对于特定的数据库软件，接下来给出了一些建议，以区别于上面的通用建议：

### Microsoft SQL server

- 禁用 ```xp_cmdshell```,```xp_dirtree```和其它不需要的存储过程；
- 禁用通用语言运行时 CLR 执行；
- 禁用SQL Browser service；
- 禁用混合模式认证，除非必须；
- 确保样本数据库 Northwind 和 AdventrueWorks 数据库被删除；
- 查看微软关于[加固SQL server的文档](https://docs.microsoft.com/en-us/sql/relational-databases/security/securing-sql-server)

### Mysql 和 MariaDB

- 运行 ```mysql_secure_installation``` 脚本，删除默认数据库和账户
- 对所有用户都禁用 ```FILE``` 权限，防止他们读或写文件
- 查阅 [Oracle MySQL](https://dev.mysql.com/doc/refman/8.0/en/security-guidelines.html) 和 [MariraDB](https://mariadb.com/kb/en/library/securing-mariadb/) 加固指南。

### PostgreSQL

- 查看 [PostgreSQL 服务器安装和操作文档](https://www.postgresql.org/docs/12/runtime.html)，以及别的[安全文档](https://www.postgresql.org/docs/7.0/security.htm)

### MongoDB

See the [MongoDB security checklist](https://docs.mongodb.com/manual/administration/security-checklist/).

### Redis

See the [Redis security guide](https://redis.io/topics/security).
