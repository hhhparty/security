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











## where


例如：要在文件中查找正则表达式匹配的行

``` more .\crebas.sql |where {$_  -match "^alter table .+;$"}```