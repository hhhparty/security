# Windows 安全检查与应急响应 CHECKLIST

## 敏感内容及需要检查的目录
### 进程
### 自启动
HKEY_LOCAL_MACHINE\Software\Microsoft\Windows\CurrentVersion\Run
HKEY_LOCAL_MACHINE\Software\Microsoft\Windows\CurrentVersion\Runonce
HKEY_LOCAL_MACHINE\Software\Microsoft\Windows\CurrentVersion\policies\Explorer\Run
HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Run
HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\RunOnceHKLM\Software\Microsoft\Windows\CurrentVersion\RunonceEx
(ProfilePath)\Start Menu\Programs\Startup 启动项
msconfig 启动选项卡
gpedit.msc 组策略编辑器
开始>所有程序>启动
msconfig-启动
计划任务
C:\Windows\System32\Tasks\
C:\Windows\SysWOW64\Tasks\
C:\Windows\tasks\
schtasks
taskschd.msc
at
开始-设置-控制面板-任务计划
### 注册表项
HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows NT\CurrentVersion\ProfileList，
HKLM\SAM\Domains\Account\
hklm:\Software\Microsoft\Windows\CurrentVersion\policies\system
hklm:\Software\Microsoft\Active Setup\Installed Components
hklm:\Software\Microsoft\Windows\CurrentVersion\App Paths
hklm:\software\microsoft\windows nt\CurrentVersion\winlogon
hklm:\software\microsoft\security center\svc
hkcu:\Software\Microsoft\Windows\CurrentVersion\Explorer\TypedPaths
hkcu:\Software\Microsoft\Windows\CurrentVersion\explorer\RunMru
hklm:\Software\Microsoft\Windows\CurrentVersion\explorer\Startmenu
hklm:\System\CurrentControlSet\Control\Session Manager
hklm:\Software\Microsoft\Windows\CurrentVersion\explorer\ShellFolders
hklm:\Software\Microsoft\Windows\CurrentVersion\ShellExtensions\Approved
hklm:\System\CurrentControlSet\Control\Session Manager\AppCertDlls
hklm:\Software\Classes\exefile\shell\open\command
hklm:\BCD00000000
hklm:\system\currentcontrolset\control\lsa
hklm:\Software \Microsoft\Windows\CurrentVersion\Explorer\BrowserHelper Objectshklm:\Software\Wow6432Node\Microsoft\Windows\CurrentVersion\Explorer\Browser Helper
Objects
hkcu:\Software\Microsoft\Internet Explorer\Extensions
hklm:\Software\Microsoft\Internet Explorer\Extensions
hklm:\Software\Wow6432Node\Microsoft\Internet Explorer\Extensions
HKLM\Software\Microsoft\Windows\CurrentVersion\Run\
HKEY_CLASSES_ROOT\exefile\shell\open\command
#### 管理员注册记录
HKEY_LOCAL_MACHINE/SAM/SAM/Domains/Account/Users


### 服务
services.msc




### 浏览记录
C:\Documents and Settings\Administrator\Recent #用户打开或浏览过的文件的记录

C:\Documents and Settings\Default User\Recent

%UserProfile%\Recent

### 下载目录

### 回收站文件 
### 程序临时文件
c:\windows\temp\

### 历史文件记录
应用程序打开历史
搜索历史
### 快捷方式（LNK）
### 日志
系统日志，程序日志，安全日志
#### 服务器日志：
- FTP连接日志
- HTTPD事务日志
- %systemroot% 
- \system32\LogFiles\
- IIS日志默认存放在System32\LogFiles目录下，使用W3C扩展格式

## 检查

基本思路：留意文件日期、新增文件、可疑/异常文件、最近使用文件、浏览器下载文件

### 日志检查

#### 登录成功的所有事件：
```
LogParser.exe -i:EVT –o:DATAGRID “SELECT * FROM c:\Security.evtx where EventID=4624″
```
#### 指定登录时间范围的事件：
```
LogParser.exe -i:EVT –o:DATAGRID “SELECT * FROM c:\Security.evtx where TimeGenerated>’2018-06-19 23:32:11′ and TimeGenerated<’2018-06-20 23:34:00′ and EventID=4624″
```
#### 提取登录成功的用户名和IP：
```
LogParser.exe -i:EVT –o:DATAGRID “SELECT EXTRACT_TOKEN(Message,13,’ ‘) as EventType,TimeGenerated as LoginTime,EXTRACT_TOKEN(Strings,5,’|') as Username,EXTRACT_TOKEN(Message,38,’ ‘) as Loginip FROM c:\Security.evtx where EventID=4624″
```
#### 登录失败的所有事件：
```
LogParser.exe -i:EVT –o:DATAGRID “SELECT * FROM c:\Security.evtx where EventID=4625″
```
#### 提取登录失败用户名进行聚合统计：
```
LogParser.exe -i:EVT “SELECT EXTRACT_TOKEN(Message,13,’ ‘) as EventType,EXTRACT_TOKEN(Message,19,’ ‘) as user,count(EXTRACT_TOKEN(Message,19,’ ‘)) as Times,EXTRACT_TOKEN(Message,39,’ ‘) as Loginip FROM c:\Security.evtx where EventID=4625 GROUP BY Message”
```
#### 系统历史开关机记录：
```
LogParser.exe -i:EVT –o:DATAGRID “SELECT TimeGenerated,EventID,Message FROM c:\System.evtx
where EventID=6005 or EventID=6006″
```

### 用户账户
#### 思路

检查：新增用户、弱口令、管理员对应键值等

#### 打开账户管理工具
lusrmgr.msc 
#### 查看本地用户组 
net localgroup administrators

#### 隐藏/克隆帐号
##### 创建隐藏账号、删除账号

net user test$ 123456 /add

net user test$ /delete

##### 加入、移除出管理员组
net localgroup administrators test$ /add



LD_check
注册表-管理员键值：
HKEY_LOCAL_MACHINE/SAM/SAM/Domains/Account/Users
D盾查杀
日志-登录时间/用户名

#### 查看系统内所有用户账户
`wmic useraccout`

`wmic useraccount get name,fullname,sid`
#### 列出当前登录账户
net user 
#### 锁定账户

`wmic useraccount where name='someusername' set disabled=false`

#### 解锁账户
`wmic useraccount where name='someusername' set disabled=true`

### 获取回收站信息

```
FOR /f "skip=1 tokens=1,2 delims= " %c in ('wmic useraccount get name,sid') do dir /a /b C:$Recycle.Bin%d\ ^>%c.txt
$Recycler = (New-Object -ComObject Shell.Application).NameSpace(0xa);

foreach($file in $Recycler.items()){$file.path;$file.ExtendedProperty("{9B174B33-40FF-11D2-A27E-00C04FC30871} 2")+''+$file.name;$file.Type}
```

说明：
- wmic useraccount get name,sid 获取当前系统用户名和sid
- for /f 遍历获得的用户名和sid 然后将回收站中所有内容放到相应用户名.txt

**TODO** : 上面脚本 for /f 无法执行

### 系统信息
msinfo32
### 进程

思路：没有签名验证信息的进程、没有描述信息的进程进程的属主、进程的路径是否合法、CPU或内存资源占用长时间过高的进程


#### 查看进程及服务

msinfo32

tasklist /svc

wmic process > proc.csv

Get-WmiObject -Class Win32_Process

Get-WmiObject -Query "select * from win32_service where name='WinRM'" -ComputerName
Server01, Server02 | Format-List -Property PSComputerName, Name, ExitCode, Name, ProcessID,
StartMode, State, Status

wmic process get caption,commandline /value

wmic process where caption=”svchost.exe” get caption,commandline /value

wmic service get name,pathname,processid,startname,status,state /value

wmic process get CreationDate,name,processid,commandline,ExecutablePath /value

wmic process get name,processid,executablepath| findstr "7766"

### 端口

#### 查看网络端口开放状况及相关进程号
netstat -ano

#### TCP各种状态
CLOSED：无连接活动或正在进行
LISTEN：监听中等待连接
SYN_RECV：服务端接收了SYN
SYN_SENT：请求连接等待确认
ESTABLISHED：连接建立数据传输
FIN_WAIT1：请求中止连接，等待对方FIN
FIN_WAIT2：同意中止，请稍候
ITMED_WAIT：等待所有分组死掉
CLOSING：两边同时尝试关闭
TIME_WAIT：另一边已初始化一个释放
LAST_ACK：等待原来的发向远程TCP的连接中断请求的确认
CLOSE-WAIT：等待关闭连接



## 防护

### 审核策略
服务器上要打开审核策略