# UFW 防火墙

UFW（Uncomplicated Firewall）简化了iptables的操作。

## 查看配置
快速了解ufw的配置方法是查看其配置文件：`more /etc/default/ufw` 。

或者使用 grep 过滤掉空行和注释：
```bash
secneo@ubuntu:~$ grep -v '^#\|^$' /etc/default/ufw
IPV6=yes
DEFAULT_INPUT_POLICY="DROP"
DEFAULT_OUTPUT_POLICY="ACCEPT"
DEFAULT_FORWARD_POLICY="DROP"
DEFAULT_APPLICATION_POLICY="SKIP"
MANAGE_BUILTINS=no
IPT_SYSCTL=/etc/ufw/sysctl.conf
IPT_MODULES="nf_conntrack_ftp nf_nat_ftp nf_conntrack_netbios_ns"
secneo@ubuntu:~$ 
```

正如你所看到的，默认策略是丢弃输入但允许输出。允许你接受特定的连接的其它规则是需要单独配置的。

## 基本命令

### 语法
ufw 命令的基本语法如下所示，但是这个概要并不意味着你只需要输入 ufw 就行，而是一个告诉你需要哪些参数的快速提示。

`ufw [--dry-run] [options] [rule syntax]`

说明：
- `--dry-run`表示 ufw 不会运行你指定的命令，但会显示给你如果执行后的结果。但是它会显示假如更改后的整个规则集，因此你要做有好多行输出的准备。

### 查看配置

```
$ sudo ufw status
Status: active
To                         Action      From
--                         ------      ----
22                         ALLOW       192.168.0.0/24
9090                       ALLOW       Anywhere
9090 (v6)                  ALLOW       Anywhere (v6)
```

### 允许或拒绝访问
你可以使用以下命令轻松地通过端口号允许和拒绝连接：

```bash
$ sudo ufw allow 80         <== 允许 http 访问
$ sudo ufw deny 25              <== 拒绝 smtp 访问
```

或者，你可以命令中直接使用服务的名称。
```
$ sudo ufw allow http
Rule added
Rule added (v6)
$ sudo ufw allow https
Rule added
Rule added (v6)
```
### 查看端口号和服务名称之间的联系

你可以查看 /etc/services 文件来找到端口号和服务名称之间的联系。
```bash
$ grep 80/ /etc/services
http            80/tcp          www             # WorldWideWeb HTTP
socks           1080/tcp                        # socks proxy server
socks           1080/udp
http-alt        8080/tcp        webcache        # WWW caching service
http-alt        8080/udp
amanda          10080/tcp                       # amanda backup services
amanda          10080/udp
canna           5680/tcp                        # cannaserver
```


### 更改后，再次检查状态来查看是否生效
```
$ sudo ufw status
Status: active
To                         Action      From
--                         ------      ----
22                         ALLOW       192.168.0.0/24
9090                       ALLOW       Anywhere
80/tcp                     ALLOW       Anywhere         <==
443/tcp                    ALLOW       Anywhere         <==
9090 (v6)                  ALLOW       Anywhere (v6)
80/tcp (v6)                ALLOW       Anywhere (v6)    <==
443/tcp (v6)               ALLOW       Anywhere (v6)    <==
```

### ufw 规则

ufw 遵循的规则存储在 /etc/ufw 目录中。注意，你需要 root 用户访问权限才能查看这些文件，每个文件都包含大量规则。

```
$ ls -ltr /etc/ufw
total 48
-rw-r--r-- 1 root root 1391 Aug 15  2017 sysctl.conf
-rw-r----- 1 root root 1004 Aug 17  2017 after.rules
-rw-r----- 1 root root  915 Aug 17  2017 after6.rules
-rw-r----- 1 root root 1130 Jan  5  2018 before.init
-rw-r----- 1 root root 1126 Jan  5  2018 after.init
-rw-r----- 1 root root 2537 Mar 25  2019 before.rules
-rw-r----- 1 root root 6700 Mar 25  2019 before6.rules
drwxr-xr-x 3 root root 4096 Nov 12 08:21 applications.d
-rw-r--r-- 1 root root  313 Mar 18 17:30 ufw.conf
-rw-r----- 1 root root 1711 Mar 19 10:42 user.rules
-rw-r----- 1 root root 1530 Mar 19 10:42 user6.rules
```

本文前面所作的更改，为 http 访问添加了端口 80 和为 https 访问添加了端口 443，在 user.rules 和 user6.rules 文件中看起来像这样：

```
# grep " 80 " user*.rules
user6.rules:### tuple ### allow tcp 80 ::/0 any ::/0 in
user6.rules:-A ufw6-user-input -p tcp --dport 80 -j ACCEPT
user.rules:### tuple ### allow tcp 80 0.0.0.0/0 any 0.0.0.0/0 in
user.rules:-A ufw-user-input -p tcp --dport 80 -j ACCEPT
You have new mail in /var/mail/root
# grep 443 user*.rules
user6.rules:### tuple ### allow tcp 443 ::/0 any ::/0 in
user6.rules:-A ufw6-user-input -p tcp --dport 443 -j ACCEPT
user.rules:### tuple ### allow tcp 443 0.0.0.0/0 any 0.0.0.0/0 in
user.rules:-A ufw-user-input -p tcp --dport 443 -j ACCEPT
```

### 阻止来自一个 IP 地址的连接
使用 ufw，你还可以使用以下命令轻松地阻止来自一个 IP 地址的连接：
```
$ sudo ufw deny from 208.176.0.50
Rule added
```

status 命令将显示更改：

```
$ sudo ufw status verbose
Status: active
Logging: on (low)
Default: deny (incoming), allow (outgoing), disabled (routed)
New profiles: skip
To                         Action      From
--                         ------      ----
22                         ALLOW IN    192.168.0.0/24
9090                       ALLOW IN    Anywhere
80/tcp                     ALLOW IN    Anywhere
443/tcp                    ALLOW IN    Anywhere
Anywhere                   DENY IN     208.176.0.50             <== new
9090 (v6)                  ALLOW IN    Anywhere (v6)
80/tcp (v6)                ALLOW IN    Anywhere (v6)
443/tcp (v6)               ALLOW IN    Anywhere (v6)

```