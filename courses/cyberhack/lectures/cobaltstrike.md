# Colbat Strike

https://www.cobaltstrike.com/support
## 概念
一个专业化的工具最费解的是其中的专业名次。
- beacon 大意为实施攻击用的 payload，需要在victim上运行的，然后用于控制目标。Beacon中含有基于windows命名管道和TCP scokets的通信方式，可方便进入victim网络，进行主机发现和横向移动。然后抓取token，密码hash，CA，kerberos票据等等。
- artifact 大意为利用cs构造的渗透工具
- listener 意为bind或接听reverse的监听器，负责与beacon通信
- malleable c2 profile c2扩展文件，用于改变通信指标和payload形式，改变beacon形态。github上的malleable-c2-profiles里的crimeware可使beacon变得像某种恶意软件。
- payload staging 分阶段投放payload
- stager 分阶段投放payload的工具
- system profiler 一个web应用，或指一个探针
- 武器化，意为将一个payload与一个office文档或一个exp组合，成为一个artifact。



## Team Infrastructure
3类server
### Staging servers
- Host client-side attacks and initial callbacks
- Initial privilege escalation + install persistence
- Expect these servers to get caught ... quickliy

### Long Hual Servers
- Low and slow persistent callbacks
- Pass accesses to post-exploitation as needed

### Post-Exploitation Servers

- post-exp and lateral movement


## Scaling Red Options

### 目标单元 Target Cells
- 对在特定网络上的目标可以响应
- 获得访问，post-exp 活动和横向扩展
- 维持完成这些任务的本地架构

### 访问管理单元 Access Management Cell
- 控制所有网络的访问
- 获取访问和接受来自cells的访问
- 按需传递、通过访问到目标cells
- 为持久化回调   维持全局架构

## listener

### payload staging 分阶段传输 payload

payload是攻击执行的内容，通常分为2部分：
- payload stage：payload主体。
- payload stager： 一个手工编写的小工具，例如一小段汇编指令，常用于下载payload stage、将其注入内存、传达执行命令等。

所谓staging 就是讲payload分阶段的过程。因为实际环境对payload有诸多限制，所以分阶段往往是必要的。

CS中的payload staging 项目在attacks-packages 和attacks-web driver-by 选项下。使用什么样的stager取决于攻击使用的payload。例如，HTTP beacon 有一个 http stager，dns beacon哟一个dns txt记录stager。当然，不是所有的payload都有stager。

如果你不需要payload 分段，通过在你的c2扩展文件中把host_stage选项设置为false，就可以关闭staging。这种方式有助于反溯源，因为开启staging，任何人都能连到你的服务器上，或请求一个payload，或分析它的内容，从而获取更多你的相关信息。

cs4.0后的版本，post-exp和横向移动行为都避免使用stager，尽量使用完整的payload。

### HTTP BEACON 和 HTTPS BEACON

默认情况下，这两个beacon通过get请求下载任务，通过post请求回传数据。也可以通过c2扩展文件来控制payload的行为和流量指标。

通过listener的增加按钮可以增加listener设置。
- name：自定义的一个简明名称
- payload：Beacon HTTP或HTTPS
- HTTP Hosts：设置一个或多个回连的主机
- http host（stager）：仅当需要与显示的stager配对时，才设置此主机地址
- profile：可以选择一个c2扩展文件的变体。通过一个c2文件变体，指定多个配置文件的变量。使用变体文件后，你设置的每个HTTP或HTTPs监听器会有不同的网络流量指标。
- HTTP PORT(c2)：设置你的HTTP Beacon回连端口。
- HTTP PORT(BIND)：设置你的http beacon payload web 服务器绑定的端口。如果你要设置端口弯曲重定向器（例如，接受来自80的或443的端口连接，但将连接路由到teamserver另一个端口上），那么这个会有用。

重定向器：位于你的目标网络和你的teamserver之间。任何发到重定向器的请求或连接，将发到你的teamserver上。通过重定向器，可为你的beacon payload 提供多个回连主机，还能提高安全性（避免溯源）。

### DNS beacon
一个很好的功能。这个payload使用DNS请求来将Beacon返回给你。这些DNS请求，将你的teamserver作为权威DNS服务器，然后向teamserver发送请求。teamserver发回的响应告诉beacon休眠还是连接到teamserver下载文件。


## Beacon



Beacon 是用于高级攻击建模的CS的payload。使用Beacon通过HTTP,HTTPS,DNS等出入网络。你也可以通过在windows 命名管道上的p2p beacons 控制某个主机进出网络。

Beacon是灵活且支持异步或交互通信的。异步通信较慢，交换通信是实时的。

### Beacon's command

 Beacon's commands and provides background on which commands inject into remote processes, which commands spawn jobs, and which commands rely on cmd.exe or powershell.exe.

 API-only
These commands are built into Beacon and rely on Win32 APIs to meet their objectives.

cd
cp
connect
download
drives
exit
getprivs
getuid
inline-execute
jobkill
kill
link
ls
make_token
mkdir
mv
ps
pwd
rev2self
rm
rportfwd
rportfwd_local
setenv
socks
steal_token
unlink
upload

House-keeping Commands
The following commands are built into Beacon and exist to configure Beacon or perform house-keeping actions. Some of these commands (e.g., clear, downloads, help, mode, note) do not generate a task for Beacon to execute.

argue
blockdlls
cancel
checkin
clear
downloads
help
jobs
mode dns
mode dns-txt
mode dns6
note
powershell-import
ppid
sleep
socks stop
spawnto

Inline Execute (BOF)
The following commands are implemented as internal Beacon Object Files. A Beacon Object File is a compiled C program, written to a certain convention, that executes within a Beacon session. The capability is cleaned up after it finishes running.

dllload
elevate svc-exe
elevate uac-token-duplication
getsystem
jump psexec
jump psexec64
jump psexec_psh
kerberos_ccache_use
kerberos_ticket_purge
kerberos_ticket_use
net domain
reg query
reg queryv
remote-exec psexec
remote-exec wmi
runasadmin uac-cmstplua
runasadmin uac-token-duplication
timestomp

The network interface resolution within the portscan and covertvpn dialogs uses a Beacon Object File too.

OPSEC Advice: Beacon Object Files use RWX memory by default. Set the startrwx/userwx hints in Malleable C2's process-inject block to change the initial or final memory permissions.

Post-Exploitation Jobs (Fork&Run)
Many Beacon post-exploitation features spawn a process and inject a capability into that process. Some people call this pattern fork&run. Beacon does this for a number of reasons: (i) this protects the agent if the capability crashes. (ii) historically, this scheme makes it seamless for an x86 Beacon to launch x64 post-exploitation tasks. This was critical as Beacon didn't have an x64 build until 2016. (iii) Some features can target a specific remote process. This allows the post-ex action to occur within different contexts without the need to migrate or spawn a payload in that other context. And (iv) this design decision keeps a lot of clutter (threads, suspicious content) generated by your post-ex action out of your Beacon process space. Here are the features that use this pattern:

Fork&Run Only

chromedump
covertvpn
dcsync
execute-assembly
hashdump
logonpasswords
mimikatz
net *
portscan
powerpick
pth
ssh
ssh-key

Target Explicit Process Only

browserpivot
psinject

Fork&Run or Target Explicit Process

desktop
keylogger
printscreen
screenshot
screenwatch

OPSEC Advice: Use the spawnto command to change the process Beacon will launch for its post-exploitation jobs. The default is rundll32.exe (you probably don’t want that). The ppid command will change the parent process these jobs are run under as well. The blockdlls command will stop userland hooking for some security products. Malleable C2's process-inject block gives a lot of control over the process injection process. Malleable C2's post-ex block has several OPSEC options for these post-ex DLLs themselves. For features that have an explicit injection option, consider injecting into your current Beacon process. Cobalt Strike detects and acts on self-injection different from remote injection.

Process Execution
These commands spawn a new process:

execute
run
runas
runu

OPSEC Advice: The ppid command will change the parent process of commands run by execute. The ppid command does not affect runas or runu.

Process Execution (cmd.exe)
The shell command depends on cmd.exe. Use run to run a command and get output without cmd.exe

The pth command relies on cmd.exe to pass a token to Beacon via a named pipe. The command pattern to pass this token is an indicator some host-based security products look for. Read How to Pass-the-Hash with Mimikatz for instructions on how to do this manually.

Process Execution (powershell.exe)
The following commands launch powershell.exe to perform some task on your behalf.

jump winrm
jump winrm64
powershell
remote-exec winrm

OPSEC Advice: Use the ppid command to change the parent process powershell.exe is run under. Use the POWERSHELL_COMMAND Aggressor Script hook to change the format of the PowerShell command and its arguments. The jump winrm, jump winrm64, and powershell [when a script is imported] commands deal with PowerShell content that is too large to fit in a single command-line. To get around this, these features host a script on a self-contained web server within your Beacon session. Use the POWERSHELL_DOWNLOAD_CRADLE Aggressor Script hook to shape the download cradle used to download these scripts.

Process Injection (Remote)
The post-exploitation job commands (previously mentioned) rely on process injection too. The other commands that inject into a remote process are:

dllinject
dllload
inject
shinject

OPSEC Advice: Malleable C2's process-inject block gives a lot of control over the process injection process.

Process Injection (Spawn&Inject)
These commands spawn a temporary process and inject a payload or shellcode into it:

elevate uac-token-duplication
shspawn
spawn
spawnas
spawnu
spunnel
spunnel_local

OPSEC Advice: Use the spawnto command to set the temporary process to use. The ppid command sets a parent process for most of these commands. The blockdlls command will block userland hooks from some security products. Malleable C2's process-inject block gives a lot of control over the process injection process. Malleable C2's stage block provides options to adjust Beacon's in-memory evasion options.

Service Creation
The following internal Beacon commands create a service (either on the current host or a remote target) to run a command. These commands use Win32 APIs to create and manipulate services.

elevate svc-exe
jump psexec
jump psexec64
jump psexec_psh
remote-exec psexec

OPSEC Advice: These commands use a service name that consists of random letters and numbers by default. The Aggressor Script PSEXEC_SERVICE hook allows you to change this behavior. Each of these commands (excepting jump psexec_psh and remote-exec psexec) generate a service EXE and upload it to the target. Cobalt Strike's built-in service EXE spawns rundll32.exe [with no arguments], injects a payload into it, and exits. This is done to allow immediate cleanup of the executable. Use the Artifact Kit to change the content and behaviors of the generated EXE.

## Aggressor Script
https://www.cobaltstrike.com/aggressor-script/index.html


## reference
https://mp.weixin.qq.com/s/FIz4-xk093jGN3TOECAgqQ