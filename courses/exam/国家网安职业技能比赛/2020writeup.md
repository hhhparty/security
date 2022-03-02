# 2020 全国信息安全与网络安全职业技能大赛河北省初赛 主要知识点


## 防火墙策略

- 永久开放必要的网络端口

```firewall-cmd--zone=public--add-port=80/tcp--permanent```

- 永久开放必要的网络服务

```firewall-cmd--zone=public--add-service=http--permanent```

- 修改firewalld的配置文件 /etc/firewall

```<port protocol="tcp" port="8080"/>```

- iptalbes 打开某个特定端口

```
iptables -A INPUT -p tcp --dport 22 -j ACCEPT
iptables -A OUTPUT -p tcp --sport 22 -j ACCEPT
iptables -A INPUT -p tcp --dport 3306 -j ACCEPT
```

- iptables 禁用某个IP访问

```iptables -A INPUT -p tcp -s 192.168.1.2 -j DROP```

- ufw放行端口

```sudo ufw allow 80```


- 其他
  - 可参考：https://blog.csdn.net/fox_wayen/article/details/90646533

## IDS

### 安装配置Snort

```./snort -d -h 192.168.1.0/24 -l ./log -c community1.rules```

可参考：https://www.cnblogs.com/thresh/p/12019466.html

#### 注意

若搭建snort时出现错误提示：
``` snort：error while loading shared libraries ： libsfbpf.so.0 :cannot open shared 0bject file : No such file or directory```

解决办法：```sudo ldconfig```

## 系统配置操作

### systemctl

- 使用systemctl关闭自启动 ： ```systemctlstopdocker```

- 启动服务：```systemctl start xxx.service```
- 关闭服务：```systemctl stop xxx.service```
- 重启服务：```systemctl restart xxx.service```
- 显示服务的状态：```systemctl status xxx.service```
- 在开机时启用服务：```systemctl enable xxx.service```
- 在开机时禁用服务：```systemctl disable xxx.service```
- 查看服务是否开机启动：```systemctl is-enabled xxx.service```
- 查看已启动的服务列表：```systemctl list-unit-files|grep enabled```
- 查看启动失败的服务列表：```systemctl --failed```

## NTP

同步时间: ```ntpdate cn.pool.ntp.org```

## 网站策略

禁止爬虫搜索，可设置网站根目录下 robots.txt 文件。在其中编写内容：

```user-agent:*disallow:/```

## Lynis 扫描系通

安装：```apt install lynis```

对系统进行全盘扫描： ```lynis --check-all```

可参考：https://www.cnblogs.com/daoyi/p/an-zhuang-shi-yonglynis-sao-miaoLinux-de-an-quan-l.html


## apache web server 配置

### 启用apache ssl模块

https://www.cnblogs.com/IT--Loding/p/6071855.html

### 关闭列目录

Options FollowSymLinks
Options -Indexes

### 隐藏版本号
```
#ServerTokens Full | OS | Minimal | Minor | Major | Prod
servertokens prod
```


### 关闭服务器签名
```
#Set to one of:  On | Off | EMail
serversignatureoff
```


## WAF

### 配置Modsecurity

可参考：https://www.freebuf.com/articles/web/43559.html

```warning.matchedphrase"etc/passwd"atargs:id.```

## 服务器

### 密码策略

- 修改密码复杂度

```password requisite pam_cracklib.so retry=3 difok=3 minlen=10 ucredit=-1 lcredit=-1 dcredit=-1 ocredit=-1```
 
- 修改密码周期

``` 
/etc/login.defspass_max_days90
/etc/login.defspass_min_days6
/etc/login.defspass_warn_age30
```

## SSH

### 在日志中发现暴力破解SSH的迹象

参考：https://zhuanlan.zhihu.com/p/90563371


```grep "Failed password" /var/log/secure|grep -E -o "(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)"|uniq -c | sort -nr ```


### pam配置SSH登录失败次数

编辑/etc/pam.d/sshd，添加：

```
auth required pam_tally2.so deny=3 unlock_time=600 even_deny_root root_unlock_time=1200
```


### 目录权限问题

/var/www/html 

/var/log/默认

drwxrwxr-x  10 root      syslog            4096 Oct 14 05:46 ./
drwxr-xr-x  14 root      root              4096 Oct 14 05:46 ../
-rw-r--r--   1 root      root             26666 Sep 25 14:53 alternatives.log
drwxr-x---   2 root      adm               4096 Oct 14 05:46 apache2/
drwxr-xr-x   2 root      root              4096 Oct 14 05:46 apt/
-rw-r-----   1 syslog    adm             137351 Oct 14 05:50 auth.log
-rw-r--r--   1 root      root             56751 Feb  3  2020 bootstrap.log
-rw-rw----   1 root      utmp            171648 Oct 14 05:50 btmp
drwxr-xr-x   2 root      root              4096 Jan 24  2020 dist-upgrade/
-rw-r--r--   1 root      root            607415 Oct 14 05:46 dpkg.log
-rw-r--r--   1 root      root              3703 Oct 14 05:35 ethcon.log
-rw-r--r--   1 root      root              3552 Sep 25 14:46 faillog
-rw-r--r--   1 root      root              5580 Oct 14 05:35 imageboot.log
drwxr-xr-x   3 root      root              4096 Sep 25 14:48 installer/
drwxr-sr-x+  4 root      systemd-journal   4096 Oct 14 05:35 journal/
-rw-r-----   1 syslog    adm              93421 Oct 14 05:35 kern.log
drwxr-xr-x   2 landscape landscape         4096 Sep 25 14:48 landscape/
-rw-rw-r--   1 root      utmp             32412 Oct 14 05:45 lastlog
drwxr-xr-x   2 root      root              4096 Nov 23  2018 lxd/
-rw-r-----   1 syslog    adm             149023 Oct 14 05:50 syslog
-rw-------   1 root      root              7104 Sep 25 14:46 tallylog
drwxr-x---   2 root      adm               4096 Sep 25 14:48 unattended-upgrades/
-rw-r--r--   1 root      root               277 Sep 25 14:49 update.txt
-rw-r--r--   1 root      root             74857 Sep 25 14:54 upgrade.txt
-rw-rw-r--   1 root      utmp              4992 Oct 14 05:45 wtmp


### 环境变量

配置当前会话超时10分钟自动退
```exporttmout=600```

## tripwire

安装配置:

https://www.howtoing.com/how-to-monitor-and-detect-modified-files-using-tripwire-on-ubuntu-1604

modified:"/var/log/apache2/access.log"

## 数据库相关

### 取消某个权限

```grant select on*.*to'inuser2'@'localhost'```

设置后刷新：
```flush privilege; ```
 
 
### 查询所有用户

```SELECT DISTINCT CONCAT('User: ''',user,'''@''',host,''';') AS query FROM mysql.user;```

### 查询用户权限

```show grants for  'inuser2'@'localhost';```
 
### mysql历史操作记录
 
```find / -name .mysql_history```

```/root/.mysql_history```






## 图片隐写

https://blog.csdn.net/attitudeisaltitude/article/details/81698719
https://www.cnblogs.com/cat47/p/11483478.html

使用Stegsolve File Format Analysis功能进行附加数据分析
使用16进制编辑器进行文件头修复


## logrotate.conf 设置日志存留时间
monthly rotate 6






