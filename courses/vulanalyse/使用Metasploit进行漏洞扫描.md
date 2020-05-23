# 使用 Metasploit 进行漏洞扫描

任何漏洞扫描工具都有较高的false positive 和 false negative rate。

MSF提供了如下扫描工具
## SMB_LOGIN 检查

一个常见的情况是你拥有一个有效的用户名和密码组合，并且想知道你还能在哪里使用它。这是SMB登录检查扫描仪非常有用的地方，因为它将连接到一系列主机，并确定用户名/密码组合是否可以访问目标。

注意，它可能会在事件日志里报告大量的失败。成功的访问会被记录，插入windows/smb/psexec exploit module（就像一个单独的工具），在这可以生成meterpreter sessions.

```shell
msf > use auxiliary/scanner/smb/smb_login
msf auxiliary(smb_login) > show options

Module options (auxiliary/scanner/smb/smb_login):

   Name              Current Setting  Required  Description
   ----              ---------------  --------  -----------
   ABORT_ON_LOCKOUT  false            yes       Abort the run when an account lockout is detected
   BLANK_PASSWORDS   false            no        Try blank passwords for all users
   BRUTEFORCE_SPEED  5                yes       How fast to bruteforce, from 0 to 5
   DB_ALL_CREDS      false            no        Try each user/password couple stored in the current database
   DB_ALL_PASS       false            no        Add all passwords in the current database to the list
   DB_ALL_USERS      false            no        Add all users in the current database to the list
   DETECT_ANY_AUTH   true             no        Enable detection of systems accepting any authentication
   PASS_FILE                          no        File containing passwords, one per line
   PRESERVE_DOMAINS  true             no        Respect a username that contains a domain name.
   Proxies                            no        A proxy chain of format type:host:port[,type:host:port][...]
   RECORD_GUEST      false            no        Record guest-privileged random logins to the database
   RHOSTS                             yes       The target address range or CIDR identifier
   RPORT             445              yes       The SMB service port (TCP)
   SMBDomain         .                no        The Windows domain to use for authentication
   SMBPass                            no        The password for the specified username
   SMBUser                            no        The username to authenticate as
   STOP_ON_SUCCESS   false            yes       Stop guessing when a credential works for a host
   THREADS           1                yes       The number of concurrent threads
   USERPASS_FILE                      no        File containing users and passwords separated by space, one pair per line
   USER_AS_PASS      false            no        Try the username as the password for all users
   USER_FILE                          no        File containing usernames, one per line
   VERBOSE           true             yes       Whether to print output for all attempts

msf auxiliary(smb_login) > set RHOSTS 192.168.1.0/24
RHOSTS => 192.168.1.0/24
msf auxiliary(smb_login) > set SMBUser victim
SMBUser => victim
msf auxiliary(smb_login) > set SMBPass s3cr3t
SMBPass => s3cr3t
msf auxiliary(smb_login) > set THREADS 50
THREADS => 50
msf auxiliary(smb_login) > run

[*] 192.168.1.100 - FAILED 0xc000006d - STATUS_LOGON_FAILURE
[*] 192.168.1.111 - FAILED 0xc000006d - STATUS_LOGON_FAILURE
[*] 192.168.1.114 - FAILED 0xc000006d - STATUS_LOGON_FAILURE
[*] 192.168.1.125 - FAILED 0xc000006d - STATUS_LOGON_FAILURE
[*] 192.168.1.116 - SUCCESSFUL LOGIN (Unix)
[*] Auxiliary module execution completed

msf auxiliary(smb_login) >
```

## 使用 NONE SCANNER 进行 VNC AUTHENTICATION 检查

MSF VNC AUTHENTICATION None Scanner 是一个辅助模块，这个工具会搜索 IP地址列表，检查哪个目标运行着 VNC server 且不需要密码。

好的admin会为每种访问设置密码，但总会有一些漏网之鱼。

使用```auxiliary/scanner/vnc/vnc_none_auth```

```shell
msf auxiliary(vnc_none_auth) > use auxiliary/scanner/vnc/vnc_none_auth
msf auxiliary(vnc_none_auth) > show options

Module options:

   Name     Current Setting  Required  Description
   ----     ---------------  --------  -----------
   RHOSTS                    yes       The target address range or CIDR identifier
   RPORT    5900             yes       The target port
   THREADS  1                yes       The number of concurrent threads

msf auxiliary(vnc_none_auth) > set RHOSTS 192.168.1.0/24
RHOSTS => 192.168.1.0/24
msf auxiliary(vnc_none_auth) > set THREADS 50
THREADS => 50
msf auxiliary(vnc_none_auth) > run

[*] 192.168.1.121:5900, VNC server protocol version : RFB 003.008
[*] 192.168.1.121:5900, VNC server security types supported : None, free access!
[*] Auxiliary module execution completed
```

## WMAP WEB SCANNER

WMAP 是一种功能丰富的 web app 漏洞扫描器，它起始于 SQLMap。它整合了 Metasploit 并允许我们在msf中执行web应用扫描。

使用步骤如下：
- 进入msf
- ```load wmap```
- ```help``` 查看帮助
- 使用```wmap_sites -a url```增加网站url
- 使用```wmap_sites -l```查看url中可能的targets
- 使用```wmap_targets -h```查看如何增加wmap_targets
- 根据上一步结果，设定目标``` wmap_targets -t http://172.16.194.172/mutillidae/index.php```
- 使用``` wmap_targets -l```查看目标列表
- 使用``` wmap_run -t ``` 列出可用于扫描的模块
- 使用```wmap_run -e``` 启动扫描
- 完成扫描后，使用```wmap_vulns -l```查看结果。
- 在msf下运行```vulns```可以查看详细情况。
```
msf > load wmap
.-.-.-..-.-.-..---..---.
| | | || | | || | || |-'
`-----'`-'-'-'`-^-'`-'
[WMAP 1.5.1] ===  et [  ] metasploit.com 2012
[*] Successfully loaded plugin: wmap

msf >  help

wmap Commands
=============

    Command       Description
    -------       -----------
    wmap_modules  Manage wmap modules
    wmap_nodes    Manage nodes
    wmap_run      Test targets
    wmap_sites    Manage sites
    wmap_targets  Manage targets
    wmap_vulns    Display web vulns

...snip...
```

## 编写自己的FUZZER

Fuzzer 是安全专家常用的工具，提供无效的或不希望出现的数据，用于注入被测系统的某个入口点。

由于MSF提供了非常完整的支持库，可以操作很多网络协议和数据，所以使用它来开发一个简单的fuzzer是一个好的主意。

具体内容:https://www.offensive-security.com/metasploit-unleashed/writing-simple-fuzzer/
