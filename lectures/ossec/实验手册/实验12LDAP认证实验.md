# 实验 12 Linux中的LDAP统一认证实验

## 实验目的

掌握 Linux 中配置 LDAP统一认证的方法

## 实验内容

- LDAP server 安装与配置
- LDAP client 安装与配置
## 实验前提

- 准备好 ubuntu server 1604 虚拟机的克隆版本
- 编辑系统文件可以使用nano或vi工具

如果对vi/vim编辑器不熟悉，可以参考下图：
![vim-vi-workmodel](images/lab01/vim-vi-workmodel.png)

![vi-vim-cheat-sheet-sch](images/lab01/vi-vim-cheat-sheet-sch.gif)

## 实验步骤

### 一. LDAP server 安装与配置

0.使用ubuntu linux的原版快照（未安装ldap server即可），克隆一份ubuntu linux server。

1.安装LDAP及相关操作工具
```sudo apt install slapd ldap-utils```

在要求键入密码时，可以选择简单的“123456”.

后续配置过程执行```sudo  dpkg-reconfigure slapd```，可以参考实验10中步骤。

2.查看SLAP-CONFIG 目录信息树（ Directory Information Tree，DIT）.

目录树存放在/etc/ldap/slapd.d下。

使用下列命令查看slapd-config的目录信息树：
```sudo ldapsearch -Q -LLL -Y EXTERNAL -H ldapi:/// -b cn=config dn```

命令说明：
- -Q表示安静模式
- -LLL表示不带注释，以LDIF格式打印结果
- -Y EXTERNAL 表示使用 EXTERNAL SASL 模式
- -H ldapi:/// 表示LDAP URI
- -b cn=config dn 表示查询的基本dn

结果大致为：
```
dn: cn=config

dn: cn=module{0},cn=config

dn: cn=schema,cn=config

dn: cn={0}core,cn=schema,cn=config

dn: cn={1}cosine,cn=schema,cn=config

dn: cn={2}nis,cn=schema,cn=config

dn: cn={3}inetorgperson,cn=schema,cn=config

dn: olcBackend={0}mdb,cn=config

dn: olcDatabase={-1}frontend,cn=config

dn: olcDatabase={0}config,cn=config

dn: olcDatabase={1}mdb,cn=config

```

说明：
- cn=config: 全局设置（global settings）
- cn=module{0},cn=config: 一个动态的调用模块（a dynamically loaded module）
- cn=schema,cn=config: 包含硬编码的系统级模式（contains hard-coded system-level schema）
- cn={0}core,cn=schema,cn=config: 硬编码的核心模式（the hard-coded core schema）
- cn={1}cosine,cn=schema,cn=config: the cosine schema
- cn={2}nis,cn=schema,cn=config: the nis schema
- cn={3}inetorgperson,cn=schema,cn=config: the inetorgperson schema
- olcBackend={0}mdb,cn=config: the 'mdb' backend storage type
- olcDatabase={-1}frontend,cn=config: frontend database, default settings for other databases
- olcDatabase={0}config,cn=config: slapd 配置数据库 (cn=config)
- olcDatabase={1}mdb,cn=config: 你的数据库实例 (dc=example,dc=com)

使用下列命令查看我们配置的example.org中的信息：
```ldapsearch -x -LLL -H ldap:/// -b dc=example,dc=com dn```

结果大致为：
```
dn: dc=example,dc=com
dn: cn=admin,dc=example,dc=com
```

3.修改我们的LDAP数据库

为了使用LDAP进行认证，需要向这个数据库中加入一些信息，例如用户信息等。

我们下面尝试向库中增加：
- 一个名叫 Users 的节点，来存放用户
- 一个名叫 Groups 的节点，来存放工作组
- 一个名叫 ldap_group01 的组
- 一个名叫 ldap_user01 的用户

在ubuntu linux下执行下列操作：
```
cd ~
nano add_content.ldif
```
然后在打开的文本编辑器中键入如下内容（可以使用xshell 复制粘贴），然后保存 add_content.ldif文件。

```
dn: ou=Users,dc=example,dc=com
objectClass: organizationalUnit
ou: Users

dn: ou=Groups,dc=example,dc=com
objectClass: organizationalUnit
ou: Groups

dn: cn=ldapgroup01,ou=Groups,dc=example,dc=com
objectClass: posixGroup
cn: ldap_group01
gidNumber: 5000

dn: uid=ldapuser01,ou=Users,dc=example,dc=com
objectClass: inetOrgPerson
objectClass: posixAccount
objectClass: shadowAccount
uid: ldapuser01
sn: ldapuser01
givenName: ldapuser01
cn: ldapuser01
displayName: ldapuser01
uidNumber: 10000
gidNumber: 5000
userPassword: ldapuser01
gecos: ldapuser01
loginShell: /bin/bash
homeDirectory: /home/users/ldapuser01
```

> 注意：uid和gid的值不能与本地uid和gid冲突（即不能与/etc/passwd中的uid和/etc/group中的gid发生冲突。）我们这里使用了比较大的数字，就是为了和系统本身的uid和gid进行区分。

保存上述文件后，执行下列增加数据命令：

```ldapadd -x -D cn=admin,dc=example,dc=com -W -f add_content.ldif```

结果大致为：

```
Enter LDAP Password: 
adding new entry "ou=Users,dc=example,dc=com"

adding new entry "ou=Groups,dc=example,dc=com"

adding new entry "cn=miners,ou=Groups,dc=example,dc=com"

adding new entry "uid=john,ou=Users,dc=example,dc=com"
```

为了检查结果，可以键入下列命令：
```ldapsearch -x -LLL -b dc=example,dc=com 'uid=ldapuser01'```

结果如下：
```
dn: uid=ldapuser01,ou=Users,dc=example,dc=com
cn: ldapuser01
gidNumber: 5000
```

4.尝试修改slapd配置数据

执行下列命令：
```
cd ~
nano uid_index.ldif
```
在打开的文本编辑器中键入如下内容：
```
dn: olcDatabase={1}mdb,cn=config
add: olcDbIndex
olcDbIndex: mail eq,sub
```

> 说明：上述内容是要在配置数据库中加入检索属性（DbIndex）。

保存 uid_index.ldif文件后，执行下列命令：
```sudo ldapmodify -Q -Y EXTERNAL -H ldapi:/// -f uid_index.ldif```

然后，自行下列命令进行验证。
```sudo ldapsearch -Q -LLL -Y EXTERNAL -H ldapi:/// -b cn=config '(olcDatabase={1}mdb)' olcDbIndex```

可以看到如下结果：
```
dn: olcDatabase={1}mdb,cn=config
olcDbIndex: objectClass eq
olcDbIndex: cn,uid eq
olcDbIndex: uidNumber,gidNumber eq
olcDbIndex: member,memberUid eq
olcDbIndex: mail eq,sub
```

LDAP Authentication

在LDAP server启动后，可以在客户端上安装一些支持库来连接服务器。

在ubuntu中，客户端通常安装libnss-ldap包。执行下列命令安装：
```sudo apt install libnss-ldap```

### 二. LDAP client 安装与配置

1.使用ubuntu linux的原版快照（未安装ldap server即可），克隆一份ubuntu linux server。

2.运行下列命令安装客户端工具。
```
sudo apt install libnss-ldap
```
安装过程中，会提示输入一些配置。
- 要输入ldap server的ip地址，假设ldap server的ip地址为10.10.10.129，则设置为如下图所示情况：

<img src="images/lab12/ldapclient01.PNG" width="480" />

- 设置搜索base项为：```dc=example,dc=com```
- LDAP version to use :3 这项及接下来的几项设置按默认。
- 设置LDAP account for root为：cn=manager,dc=example,dc=com,如下图所示：

<img src="images/lab12/ldapclient02.PNG" width="480" />
- 设置根管理员密码，可简单设为123456.

之后等待安装完成。

3.如果上述过程出现问题，可以运行下列命令进行重新配置。
```sudo dpkg-reconfigure ldap-auth-config```

结果存放在```/etc/ldap.conf```中，如果你设置的ldap服务器要求一些配置选项没有列在这个文件中，那么你可以编辑这个文件。

4.为NSS配置LDAP特性文件。
```sudo auth-client-config -t nss -p lac_ldap```

5.令当前系统启用LDAP认证。可以执行下列操作：
```sudo pam-auth-update```

在弹出的对话框中，选择LDAP和其它别的你需要的认证方式（可以按默认）。

6.如果LDAP的 replication 已经在用，LDAP客户端需要参考多个服务器。在/etc/ldap.conf中，可能会看到下列信息：

```uri ldap://10.10.10.129 ldap://10.10.10.130```

>注：如果没有启动replication，则只有```uri ldap://10.10.10.129```

### 用户和组管理

1.在ldap服务器端，使用下列命令安装ldapscripts，它用于管理ldap目录，支持长字符串。
```sudo apt install ldapscripts```

安装完成后，在/etc/ldapscripts/ldapscripts.conf 编辑下列内容：
```
SERVER=localhost
BINDDN='cn=admin,dc=example,dc=com'
BINDPWDFILE="/etc/ldapscripts/ldapscripts.passwd"
SUFFIX='dc=example,dc=com'
GSUFFIX='ou=Groups'
USUFFIX='ou=Users'
MSUFFIX='ou=Machines'
GIDSTART=10000
UIDSTART=10000
MIDSTART=20000
```

2.现在生成ldapscripts.passwd文件来允许rootDN访问目录。
```
sudo sh -c "echo" -n '123456' > /etc/ldapscripts/ldapscripts.passwd"

sudo chmod 400 /etc/ldapscripts/ldapscripts.passwd
```

>上述命令中的123456是ldap数据库rootDN用户的密码，可以替换为自己希望的密码。

这个脚本可以帮助管理目录。下面是使用的例子：

3.生成一个新用户
```sudo ldapadduser  luser01```

这将生成一个uid为“luser01”的用户，并会生成用户主目录luser01

4.改变一个ldap目录的密码。
```sudo ldapsetpasswd luser01```
在出现的提示中键入密码。可以设为123456。

5.删除一个用户可以采用下列命令：
```sudo ldapdeleteuser luser01```

6.增加一个组可以使用下列命令：
```sudo ldapaddgroup lgroup01```

7.删除一个组可以使用下列命令：
```sudo ldapdeletegroup lgroup01```

8.向用户组添加用户，使用下列命令：
```sudo ldapaddusertogroup luser01 lgroup01```

9.从用户组移除用户，使用下列命令：
```sudo ldapdeleteusertogroup luser01 lgroup01```

10.增加、删除、修改用户属性可以使用ldapmodify命令：
```sudo ldapmodifyuser luser01```

11.ldapscripts有模板功能，要启用用户模板，请更改 /etc/ldapscripts/ldapscripts.conf：
```UTEMPLATE =“ / etc / ldapscripts / ldapadduser.template”```

/usr/share/doc/ldapscripts/examples目录中有示例模板。将ldapadduser.template.sample文件复制或重命名为 /etc/ldapscripts/ldapadduser.template：

```cp /usr/share/doc/ldapscripts/examples/ldapadduser.template.sample /etc/ldapscripts/ldapadduser.template```