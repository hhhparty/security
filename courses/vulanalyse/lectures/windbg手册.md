# WinDbg使用手册

> https://docs.microsoft.com/zh-cn/windows-hardware/drivers/debugger

## 基本介绍
### 准备工作
要使用Windbg，需要先完成以下工作：

#### 确定主机host和目标target。

调试器debugger运行在host上(下图左侧），想调试的代码在目标target上（下图右侧）。

<img src="images/windbg/targethost1.png" width="480">

右边可以是虚拟机。如果你的代码运行在low-level硬件，那么可以参考 https://docs.microsoft.com/zh-cn/windows-hardware/drivers/debugger/setting-up-network-debugging-of-a-virtual-machine-host

#### 确定类型：kernel-mode or user-mode

Kernel-mode 是处理器访问模式，特权模式，有权利访问任意位置。例如核心os功能、硬件设备驱动都工作在kernel层。

User-mode 应用程序、子系统工作层。

要调试驱动，需要考虑驱动是内核驱动还是用户模式驱动。Windows Driver Model(WDM)驱动和内核驱动框架（KMDF)都是内核模式驱动。User-Mode-Driver-Framework（UMDF）是用户模式驱动。

有时，可能两种都需要，或者很难决定单独使用哪一种。

取决于你想使用的那种模式，你需要以不同方法配置和使用debugger。

#### 选择你的调试器环境

windbg适应大多数环境，但有时可能要使用别的调试器，例如自动化控制台调试器、vs等。此时要设置调试环境。

#### 确定如何连接到目标和主机

典型的是通过以太网。但也支持别的方式。

#### 选择32bit or 64bit

这取决于target运行的windows系统。

#### 配置symbols

为了发挥windbg的优势，你需要加载正确的symbols。也就是windows api的各种帮助和结构体信息。
Typically, symbol files might contain:
- Global variables
- Local variables
- Function names and the addresses of their entry points
- Frame pointer omission (FPO) records
- Source-line numbers

其中每个项分别称为一个符号。 例如，单个符号文件 Myprogram.exe 可能包含几百个符号，包括全局变量和函数名以及数百个局部变量。 通常，软件公司会发布每个符号文件的两个版本：包含公共符号和私有符号的完整符号文件以及只包含公共符号的缩减文件。 

调试时，必须确保调试器能够访问与正在调试的目标关联的符号文件。 实时调试和调试崩溃转储文件都需要符号。 你必须获取要调试的代码的正确符号，并将这些符号加载到调试器中。

Windows 在扩展名为 .pdb 的文件中保留其符号。

编译器和链接器控制符号格式。 可视化C++链接器会将所有符号置于 .pdb 文件中。Windows 操作系统内置于两个版本中。 release或free或retail或零售内部版本的二进制文件相对较小，而debug或检查的生成版本具有更大的二进制文件，代码本身中的调试符号更多。 在 Windows 10 版本1803之前，debug版在 windows 的早期版本上可用。 其中每个生成都有自己的符号文件。 在 Windows 上调试目标时，必须使用与目标上的 Windows 生成匹配的符号文件。


The following table lists several of the directories which exist in a standard Windows symbol tree:
|Directory|	Contains Symbol Files for|
|-|-|
|ACM|Microsoft Audio Compression Manager files|
|COM|Executable files (.com)|
|CPL|Control Panel programs|
|DLL|Dynamic-link library files (.dll)|
|DRV|Driver files (.drv)|
|EXE|Executable files (.exe)|
|SCR|Screen-saver files|
|SYS|Driver files (.sys)|

##### 访问调试用的符号表
这是个复杂操作，特别是对内核调试。要求你知道你机器上所有产品的名字和版本。调试器必须定位与产品版本、服务补丁对应的每个符号文件。这会形成一个由很多目录组成的非常长的符号路径。简化操作时，可以把符号文件收集到一个symbol store，然后经过符号服务器访问。

Windows调试工具包含一个symbol store 生成工具，叫做SymStore。

调试 Windows 内核，驱动程序或应用程序之前，需要能够访问正确的符号文件。 获取 Windows 符号的官方方法是使用 Microsoft 符号服务器。 符号服务器根据需要为调试工具提供符号。 从符号服务器下载符号文件后，该文件将缓存在本地计算机上，以供快速访问。

可以连接到 Microsoft 符号服务器使用的一种简单的用法 .symfix （设置符号存储区路径） 命令。 有关完整详细信息，请参阅Microsoft 公共符号。

##### 具体操作
windbg访问符号需要两个文件(SYMSRV.DLL 和 SYMSTORE.EXE)所以添加主Path环境变量中它们的路径进去,即:你的windbg安装目录.操作方法:在桌面我的电脑点右键--属性--高级--环境变量,在系统变量列表框中找到“Path”双击,在变量值最后面加一个分号再把你的安装目录写上.点确定. 这一步是告诉windbg那两个文件放在什么地方.

新建一个环境变量_NT_SYMBOL_PATH 值为: SRV*c:\mysymbol* http://msdl.microsoft.com/download/symbols

可以查看官网地址：windbg项目地址

还有一种新的方法是：设置值为 cache*c:\mysymbol;srv*http://msdl.microsoft.com/download/symbols

这两个的不同点在于 第一个只能缓存符号服务器形式的符号文件，但是第二种可以缓存远程共享形式的符号文件。

操作方法:桌面我的电脑点右键--属性--高级--环境变量 ,点击新建,把上面的变量名和变量值填上.这一步的意思是说告诉windbg,我的符号文件存放在c:mysymbol中(当然其实里面什么也没有,甚至这个文件夹也不存在,不过没关系,系统找不到的话会给你创建一个,并在上面的网址中去帮你下载符号文件放在里面)

第四步 重启计算机，再运行运行windbg 打开一个exe文件或者附加到一个进程里去, 你会看到
Symbol search path is: SRV*c:\mysymbol* http://msdl.microsoft.com/download/symbols
打开c盘看到有一个新目录mysymbol,里面有windbg新下载的文件.

恭喜说明配置成功了.

#### 配置源代码

如果你的目标是调试自己的源代码，你需要设置一个源代码路径。

#### 熟悉debugger操作

#### 熟悉debugging 技术

#### 使用debugger参考命令

#### 使用debugging扩展

#### 了解相关windows 内核

#### review 额外的debugging资源


## 命令
### d* 显示指定内存内容
命令格式：
```
d{a|b|c|d|D|f|p|q|u|w|W} [Options] [Range] 
dy{b|d} [Options] [Range] 
d [Options] [Range]
 ```
The d* commands display the contents of memory in the given range.
### dg 根据指定的选择子（selector）显示段描述符

命令格式：```dg FirstSelector [LastSelector]```