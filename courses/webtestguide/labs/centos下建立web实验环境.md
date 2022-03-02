# 建立Centos Web实验环境
> https://upcloud.com/community/tutorials/installing-snort-on-centos/

## 安装 centos 7

## 安装 apache web server

```sudo yum -y install httpd```

设置为开机启动

```sudo systemctl enable httpd.service```


手动启动Apache

```systemctl start httpd.service```

在浏览器中输入IP地址即可验证是否启动成功

安装目录:
- Apache默认将网站的根目录指向```/var/www/html```
- 默认的主配置文件```/etc/httpd/conf/httpd.conf```
- 配置存储在的```/etc/httpd/conf.d/```目录


### Apache 配置

> 参考：https://httpd.apache.org/docs/2.4/configuring.html
#### 配置文件

- 主配置文件：```/etc/httpd/conf/httpd.conf``` 
- 其他配置文件，通过httpd.conf中的 ```Include```指令来包含。可疑使用通配符（wildcards）
- 更改配置文件后，需要重启服务器才可以重新加载配置。

- 也可以读取 mime 类型文档，这个文件名通过 ```TypeConfig```指令设置，默认为```mime.types```

##### 语法

- httpd 配置文件中一行一条指令，一行写不完使用 ```\``` 结尾后，换行续写。
- 指令的参数使用空格间隔，如果参数包括空白，那么你需要使用引号包含空白
- 指令大小写不敏感，但指令的参数通常大小写敏感。
- 以“#”开头的行是注释行，注释不能与指令同行。
- 定义变量，使用 ```Define```，也可以使用 shell环境变量，这时使用语法 ```$(VAR)```。shell环境变量仅有那些在服务器启动前被定义的可用在扩展组件中。定义环境变量可疑使用```SetEnv```。
- 配置文件一行的最大长度通常是16MiB，在.htccess 文件中，最大长度为 8190 字符。
- 可以使用 ```apachectl configtest```在运行服务器前 或 ```-t``` 命令行 进行配置文件测试
- 可疑使用 ```mod_info's -DDUMP_CONFIG``` 导出配置文件内容和环境变量。

#### 模块

apache web server（httpd） 是一个模块化服务器，这意味着仅有最基本的功能被包含在核心server中。扩展特性可通过调入 modules 启用。默认情况下，基本模块集被服务器在编译时引入。如果服务器编译时采用动态加载模块，那么模块可疑被分别编译，在任意时间使用 ```LoadModule``` 指令加载。然而，httpd必须重新编译来加载和移除模块

配置指令可以使用```Ifmodule```，根据条件包含特定模块。Ifmodule 不是必须的，而且它在某些情况下，可能会掩盖您缺少一个重要模块的事实。

使用```httpd -l```可查看当前已编译模块。使用```httpd -M```你可以看那些模块被动态加载.


### 指令的作用范围

放在主配置文件中的指令，作用范围是服务器全局。如果你希望仅对服务器一部分改变配置，你可以将指令放在``` <Directory>, <DirectoryMatch>, <Files>, <FilesMatch>, <Location>, <LocationMatch>``` 这些节标记中。他们可疑嵌套。

httpd可同步服务不同网站，即虚拟主机。指令可疑被放在```<VirtualHost>```节中，这样指令就只作用于特定的网站了。

Although most directives can be placed in any of these sections, some directives do not make sense in some contexts. For example, directives controlling process creation can only be placed in the main server context. To find which directives can be placed in which sections, check the Context of the directive. For further information, we provide details on How Directory, Location and Files sections work.

### .htaccess 文件

httpd通过放置在web树中的特定文件，可运行去中心化配置管理。这个特定文件通常被称为 .htaccess，也可以使用别的文件（在AccessFileName指令中定义）。

.htaccess 文件中的语法与主配置文件的语法相同。服务器管理员可以通过配置在主配置文件中```AllowOverride```中的指令，控制那些放置在.htaccess文件指令。


### 开启端口访问权限

centos7中使用firewalld防火墙。

默认情况下所有端口都是关闭的。

为了访问apache web server，需要开启端口，例如：

```
[leo@localhost ~]$ sudo firewall-cmd --zone=public --add-port=80/tcp --permanent
[sudo] password for leo: 

success
```

```
[leo@localhost ~]$ sudo firewall-cmd --zone=public --add-port=8080/tcp --permanent
[sudo] password for leo: 

success
```

```
[leo@localhost ~]$ sudo firewall-cmd --zone=public --add-port=443/tcp --permanent
[sudo] password for leo: 

success
```
重新加载firewall规则：
```sudo firewall-cmd --reload```

然后重新启动httpd: ``` sudo systemctl restart httpd.service```

安装成功后，使用浏览器访问服务器地址，可看到测试页。


### 安装 apache ssl 模块并启用ssl

#### 安装模块
```yum install -y mod_ssl openssl```

安装完毕后，会自动生成 /etc/httpd/conf.d/ssl.conf 文件，下文配置会用到！

#### 生成自签名证书

下面的命令可以被用来产生一个自签名的证书。

首先，生成2048位的加密私钥

```openssl genrsa -out server.key 2048```

然后，生成证书签名请求（CSR），这里需要填写许多信息，如国家，省市，公司等

```openssl req -new -key server.key -out server.csr```

最后，生成类型为X509的自签名证书。有效期设置3650天，即有效期为10年

```openssl x509 -req -days 3650 -in server.csr -signkey server.key -out server.crt```


创建证书后，将文件复制到对应的目录。

```cp server.crt /etc/pki/tls/certs/```
```cp server.key /etc/pki/tls/private/    ```    
```cp server.csr /etc/pki/tls/private/```

#### 配置Apache Web服务器

首先，修改下面的配置文件。仅需配置红色部分 SSLCertificateFile 和 SSLCertificateKeyFile


```
# vim /etc/httpd/conf.d/ssl.conf

#
# When we also provide SSL we have to listen to the 
# the HTTPS port in addition.
#
Listen 443 https

##
## SSL Virtual Host Context
##

<VirtualHost _default_:443>
# General setup for the virtual host, inherited from global configuration

DocumentRoot "/var/www/html/a.com"
ServerName www.a.com:443

### overwrite the following parameters ###
SSLCertificateFile /etc/pki/tls/certs/server.crt
SSLCertificateKeyFile /etc/pki/tls/private/server.key

### The following parameter does not need to be modified in case of a self-signed certificate. ###
### If you are using a real certificate, you may receive a certificate bundle. The bundle is added using the following parameters ###
SSLCertificateChainFile /etc/pki/tls/certs/example.com.ca-bundle
```


然后，重新启动httpd服务使更改生效
```systemctl restart httpd          // 或者  /etc/init.d/httpd restart```

Web服务器现在可以使用HTTPS

#### 强制Apache Web服务器始终使用https

如果由于某种原因，你需要站点的Web服务器都只使用HTTPS，此时就需要将所有HTTP请求(端口80)重定向到HTTPS(端口443)。 Apache Web服务器可以容易地做到这一点。

- 强制主站所有Web使用（全局站点）

如果要强制主站使用HTTPS，我们可以这样修改httpd配置文件：

```vim /etc/httpd/conf/httpd.conf```

修改以下内容：
```
ServerName www.example.com:80
Redirect permanent / https://www.example.com
```

重启Apache服务器，使配置生效：

```systemctl restart httpd```

- 强制虚拟主机（单个站点）

如果要强制单个站点在虚拟主机上使用HTTPS，对于HTTP可以按照下面进行配置：

```vim /etc/httpd/conf.d/httpd-vhosts.conf```

```
<VirtualHost *:80>
    ServerName www.a.com
    Redirect permanent / https://www.a.com/
</VirtualHost>
```

重启Apache服务器，使配置生效：

```systemctl restart httpd```

单个站点全部使用HTTPS，则 http://www.a.com 会强制重定向跳转到 https://www.a.com

 

一般情况下，由于浏览器会自动拦截https未被认证的网址，因此建议同时保留 http://www.a.com  和 https://www.a.com ，或者购买权威的认证服务，让用户浏览器信任https浏览访问。

## 安装 mysql

MySQL 被 Oracle 收购后，CentOS 的镜像仓库中提供的默认的数据库也变为了 MariaDB，如果想了解 MariaDB 和 CentOS 的区别，可以参考官网介绍，想用 MariaDB 的同学可以参考 MariaDB 安装指南。

在 CentOS 上安装 MySQL 差不多有四个步骤。
### 填写mysql源

根据自己的操作系统选择合适的[安装源](https://link.jianshu.com/?t=http://dev.mysql.com/downloads/repo/yum/)，和其他公司一样，总会让大家注册账号获取更新，注意是 Oracle 的账号，如果不想注册，下方有直接下载的地址，下载之后通过 ```rpm -Uvh``` 安装。

```
$wget 'https://dev.mysql.com/get/mysql57-community-release-el7-11.noarch.rpm'
$sudo rpm -Uvh mysql57-community-release-el7-11.noarch.rpm
$yum repolist all | grep mysql
```

### 选择安装版本
如果想安装最新版本的，直接使用 yum 命令即可

```$sudo yum install mysql-community-server```

如果想要安装 5.6 版本的，有2个方法。命令行支持 yum-config-manager 命令的话，可以使用如下命令：
```
$ sudo dnf config-manager --disable mysql57-community
$ sudo dnf config-manager --enable mysql56-community
$ yum repolist | grep mysql
```
或者直接修改 /etc/yum.repos.d/mysql-community.repo 这个文件

```
# Enable to use MySQL 5.6
[mysql56-community]
name=MySQL 5.6 Community Server
baseurl=http://repo.mysql.com/yum/mysql-5.6-community/el/7/$basearch/
enabled=1 #表示当前版本是安装
gpgcheck=1
gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-mysql

[mysql57-community]
name=MySQL 5.7 Community Server
baseurl=http://repo.mysql.com/yum/mysql-5.7-community/el/7/$basearch/
enabled=0 #默认这个是 1
gpgcheck=1
gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-mysql
```
通过设置 enabled 来决定安装哪个版本。

设置好之后使用 yum 安装即可。

### 启动mysql服务

```sudo service mysqld start```

```sudo systemctl start mysqld```


```sudo systemctl status mysqld```

服务安装好了，会自动设置临时密码 ，使用下列命令查看：

```sudo grep password /var/log/mysqld.log```

```mysql -uroot -p``` 后输入临时密码登录数据库。

输入下列命令更改mysql密码

```ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'Hardpwd@123';```

注意，mysql 8.0 必须设置强口令，而且不成功设置是不能继续的哦。

### MySQL 安全设置
5.7 以上版本在安装的时候就设置好了，不需要额外设置，但是 5.6 版本建议从安全角度完善下，在shell下运行官方脚本即可

```mysql_secure_installation```
会提示设置5个关键位置

设置 root 密码
禁止 root 账号远程登录
禁止匿名账号（anonymous）登录
删除测试库
是否确认修改

### 安装第三方组件


查看 yum 源中有哪些默认的组件：

``` yum --disablerepo=\* --enablerepo='mysql*-community*' list available```

### 修改字符编码

在/etc/my.cnf 中设置默认字符编码
```
[client]
default-character-set = utf8

[mysqld]
default-storage-engine = INNODB
character-set-server = utf8
collation-server = utf8_general_ci #不区分大小写
collation-server =  utf8_bin #区分大小写
collation-server = utf8_unicode_ci #比 utf8_general_ci 更准确
```


### 创建数据库和用户
```mysql
CREATE DATABASE <datebasename> CHARACTER SET utf8;
CREATE USER 'username'@'host' IDENTIFIED BY 'password';
GRANT privileges ON databasename.tablename TO 'username'@'host';
SHOW GRANTS FOR 'username'@'host';
REVOKE privilege ON databasename.tablename FROM 'username'@'host';
DROP USER 'username'@'host';
```

username：你将创建的用户名
host：指定该用户在哪个主机上可以登陆，如果是本地用户可用 localhost，如果想让该用户可以从任意远程主机登陆，可以使用通配符 %
password：该用户的登陆密码，密码可以为空，如果为空则该用户可以不需要密码登陆服务器
privileges：用户的操作权限，如 SELECT，INSERT，UPDATE 等，如果要授予所的权限则使用ALL
databasename：数据库名
tablename：表名，如果要授予该用户对所有数据库和表的相应操作权限则可用 * 表示，如 *.*

### MySQL 修改时间戳为服务器时间
mysql 中默认的时间戳是 UTC 时间，需要改为服务器时间的话官网提供了 3 种方式

$ mysql_tzinfo_to_sql tz_dir
$ mysql_tzinfo_to_sql tz_file tz_name
$ mysql_tzinfo_to_sql --leap tz_file
tz_dir 代表服务器时间数据库，CentOS 7 中默认的目录为 /usr/share/zoneinfo ，tz_name 为具体的时区。如果设置的时区需要闰秒，则使用 --leap，具体的用法如下：


$ mysql_tzinfo_to_sql /usr/share/zoneinfo | mysql -u root -p mysql
$ mysql_tzinfo_to_sql tz_file tz_name | mysql -u root mysql
$ mysql_tzinfo_to_sql --leap tz_file | mysql -u root mysql



## 安装配置 snort

### 安装依赖

```sudo yum install gcc flex bison zlib zlib-devel libpcap libpcap-devel pcre pcre-devel libdnet libdnet-devel tcpdump```

在安装snort的时候可能会报错：缺少libnghttp2.so.14()(64bit)
请尝试```sudo yum install epel-release -y```;```sudo yum install nghttp2```再次安装即可。

### 安装daq
```sudo yum install https://www.snort.org/downloads/snort/daq-2.0.6-1.centos7.x86_64.rpm```

### 安装snort

```sudo yum install https://www.snort.org/downloads/snort/snort-2.9.12-1.centos7.x86_64.rpm```

### 规则下载
Snort官方提供的三类规则：
- Community rules：无需注册or购买，可直接下载使用
- Registered rules：需要注册才可以下载（建议大家用这个，只需要注册即可,可以说是零成本）
- Subscriber rules：需要注册花钱购买

根据你下载的snort版本下载即可，这里我用的是最新版本即2.9.9.0，同样的对国内不是很友好，我已经上传至网盘。

tar -xvf snortrules-snapshot-<version>.tar.gz -C /etc/snort/rules


### 配置 snort

#### Configuring Snort to run in NIDS mode

首先更新共享库：```sudo ldconfig```

snort 在centos下安装在：
-  /usr/local/bin/snort 目录下

最好为其生成一个符号连接：```sudo ln -s /usr/local/bin/snort /usr/sbin/snort```

#### 设置用户名和文件夹结构

为了在centos上安全运行snort ，生成一个非特权用户和一个新的用户组。

```sudo groupadd snort```

```sudo useradd snort -r -s /sbin/nologin -c SNORT_IDS -g snort```


然后生成一个目录结构来存放snort配置。

```sudo mkdir -p /etc/snort/rules```

```sudo mkdir /var/log/snort```

```sudo mkdir /usr/local/lib/snort_dynamicrules```


设置目录权限

```bash
sudo chmod -R 5775 /etc/snortsudo 
chmod -R 5775 /etc/snort
sudo chmod -R 5775 /var/log/snort
sudo chmod -R 5775 /usr/local/lib/snort_dynamicrules
sudo chown -R snort:snort /etc/snort
sudo chown -R snort:snort /var/log/snort
sudo chown -R snort:snort /usr/local/lib/snort_dynamicrules
```

生成新文件，作为本地规则的白名单和黑名单：

```shell
sudo touch /etc/snort/rules/white_list.rules
sudo touch /etc/snort/rules/black_list.rules
sudo touch /etc/snort/rules/local.rules
```

如果使用源文件安装，那么使用下列命令从下载目录中拷贝出配置文件，如果使用yum安装则跳过下列命令。

```shell
sudo cp ~/snort_src/snort-2.9.12/etc/*.conf* /etc/snort
sudo cp ~/snort_src/snort-2.9.12/etc/*.map /etc/snort
```

下来你就可以下载检测规则，识别潜在威胁了。

### 使用社区规则

如果逆向快速测试snort，使用wget下载。

```wget https://www.snort.org/rules/community -O ~/community.tar.gz```


提取出规则，拷贝他们到配置文件夹。

```sudo tar -xvf ~/community.tar.gz -C ~/```

```sudo cp ~/community-rules/* /etc/snort/rules```

默认情况下，Snort在centos上希望找到一定量的不包含在社区规则集中不同规则文件。

```sudo sed -i 's/include \$RULE\_PATH/#include \$RULE\_PATH/' /etc/snort/snort.conf```

### 获取
