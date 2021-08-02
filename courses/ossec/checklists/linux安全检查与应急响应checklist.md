# Linux 安全检查与应急响应 CHECKLIST

## 日志
###  linux系统日志
/var/log/wtmp  #用户登录记录与系统启动日志 即使用last查看到的内容

/var/log/uptime #记录用户登录时间

/var/log/lastlog #记录用户最后登录信息，即使用lastlog查看到的内容来源

/var/log/secure #记录登录系统存取数据的文件，可能包含爆破失败的信息

/var/log/cron #与定时任务相关的日志信息

/var/log/message #系统启动后的各种信息和错误信息 用tail -f监控

/var/log/auth.log #系统授权信息，包括用户登录和使用权限，例如sudo执行某命令成功或失败都会记录

/var/log/user.log #记录所有等级用户信息的日志

/var/log/cron #记录crontab命令是否被正确执行的日志

/var/log/xferlog 或 vsftpd.log  #ftp日志

/var/log/failog #记录系统不成功的账号信息

### 用户执行记录

~/.bash_history

### 

## 常用命令

### 文件操作

#### 按时间顺序列出可疑文件列表

ls -alt /tmp

#### 倒序显示文件内容

tail -n 行数 文件名 #显示完就退出

tail -n 行数 文件名 -f #监控当前文件追加内容的变化

#### 查找72小时内新增文件

find / -ctime -2

find /etc/ /usr/bin/ /usr/sbin/ /bin/ /usr/local/bin/ -type f -mtime 0

#### 查找24小时内被修改的JSP文件

find ./ -mtime 0 -name "*.jsp"

#### 查找权限为777的文件

find / *.jsp -perm 4777


#### 用户列表文件
/etc/passwd
#### 口令hash文件
/etc/shadow

#### 查看爆破失败的IP地址

`sudo grep 'Failed' /var/log/secure | awk '{print $11}' |sort |uniq -c |sort -nr`

说明：
- $11表示第11个字符串（以空格等字符串划分间隔），secure格式中第11个字串是ip地址
- uniq 是一个报告或忽略重复行的命令 -c表示显示重复次数

#### 查看登录成功的IP
`sudo grep 'Accepted' /var/log/secure | awk '{print $11}' |sort |uniq -c |sort -nr |more

#### 标记重复的行
uniq #用于检查及删除文本文件中重复出现的行列，一般与 sort 命令结合使用。

-c或--count 在每列旁边显示该行重复出现的次数。
-d或--repeated 仅显示重复出现的行列。
-f<栏位>或--skip-fields=<栏位> 忽略比较指定的栏位。
-s<字符位置>或--skip-chars=<字符位置> 忽略比较指定的字符。
-u或--unique 仅显示出一次的行列。
-w<字符位置>或--check-chars=<字符位置> 指定要比较的字符。


#### 输出日志中所有包含error等关键字的行数

`grep -c 'ERROR' demo.log` 

-c指只打印匹配的行数



### 用户

#### 查看当前用户
显示谁登陆过
who /var/run/utmp

显示哪些用户登录系统及当前活动
w 

#### 查看开关机、用户登录退出日志
last

#### 最后登录信息
lastlog

#### 查看登录成功的日期、用户、IP地址
`grep 'Accepted' /var/log/secure* | awk '{print $1,$2,$3,$9,$11}'`

#### 查看爆破用的字典
`grep 'Failed password' /var/log/secure* | awk '{print $9}'|sort|uniq -c`

#### 查看当前登录用户
users

### 进程

#### 显示打开的文件
lsof #显示所有

lsof -i:1677 #查看制订端口对应的程序

lsof -p 进程号 #查看某个pid进程

lsof -g gid 查看某个文件关联的lib文件

#### 显示进程
ps aux # 显示其他用户启动的进程（a）查看系统中属于自己的进程(x） 启动这个进程的用户和它启动的时间（u）

pstree #显示进程树

strace -f -p 1235 #跟踪进程pid为1235的进程

#### 服务端口
netstat # -a 所有 -p 显示pid -n 不解析 -t tcp -u udp -l 监听端口 -e 扩展信息 -c 连续监听 -F显示转发信息base -o 显示计时器





### 检查内容

#### 是否包含IP内容
```
strings /usr/bin/.sshd |egrep '[1-9]{1,3}\.[1-9]{1,3}\.[1-9]{1,3}\.'

```
#### 自启动内容可能存在的位置

~/.bashrc
~/.profile
rc.local
/etc/init.d 其中的开机启动项
/etc/init.d/rc.local
/etc/rc.local
/etc/cron*

chkconfig


`chkconfig --list |grep "3:on|5:on"`

#### 计划任务
crontab -l
crontab /etc/cron*
crontab -u root -l
cat /etc/crontab
ls /etc/cron.*/var/spool/cron/*
/etc/crontab
/etc/cron.d/*
/etc/cron.daily/*
/etc/cron.hourly/*
/etc/cron.monthly/*
/etc/cron.weekly/
/etc/anacrontab
/var/spool/anacron/*
/var/log/cron*
