# FRIDA

为开发人员、逆向工程师、安全研究者提供的动态装备工具箱。
## 概念

### hook是什么？

### Frida 是什么？

frida是平台原生app的Greasemonkey，说的专业一点，就是一种它是一个动态代码检测工具包，可以插入一些代码到原生app的内存空间去，（动态地监视和修改其行为），这些原生平台可以是Win、Mac、Linux、Android或者iOS。而且frida还是开源的。

Greasemonkey可能大家不明白，它其实就是firefox的一套插件体系，使用它编写的脚本可以直接改变firefox对网页的编排方式，实现想要的任何功能。而且这套插件还是外挂的，非常灵活机动。

frida也是一样的道理。

Frida 的核心是用 C 编写的，并将QuickJS 注入目标进程，在那里您的 JS 可以完全访问内存、挂钩函数甚至在进程内部调用本机函数来执行。有一个双向通信通道用于在您的应用程序和目标进程内运行的 JS 之间进行通信。

使用 Python 和 JS 可以通过无风险的 API 进行快速开发。Frida 可以帮助您轻松捕获 JS 中的错误并为您提供异常而不是崩溃。

不希望使用 Python 编写？没问题。你可以直接从 C 中使用 Frida，在这个 C 核心之上有多种语言绑定，例如 Node.js、 Python、 Swift、 .NET、 Qml等。很容易为其他语言和环境构建额外的绑定.

### frida 特性

- 探索一个应用的api调用过程，无论它是否使用了加密网络协议。
- 在客户站点上调试应用（即非源码、可调式版本），获取比普遍日志系统更丰富的日志信息，完成故障诊断。
- 操作函数调用，例如仿冒网络条件
- 对内部应用程序进行黑盒测试，防止外部测试代码污染内部程序。
  

动静态修改内存实现作弊一直是刚需，比如金山游侠，本质上frida做的跟它是一件事情。原则上是可以用frida把金山游侠，包括CheatEngine等“外挂”做出来的。

当然，现在已经不是直接修改内存就可以高枕无忧的年代了。大家也不要这样做，做外挂可是违法行为。

在逆向的工作上也是一样的道理，使用frida可以“看到”平时看不到的东西。出于编译型语言的特性，机器码在CPU和内存上执行的过程中，其内部数据的交互和跳转，对用户来讲是看不见的。当然如果手上有源码，甚至哪怕有带调试符号的可执行文件包，也可以使用gbd、lldb等调试器连上去看。

那如果没有呢？如果是纯黑盒呢？又要对app进行逆向和动态调试、甚至自动化分析以及规模化收集信息的话，**我们需要的是细粒度的流程控制和代码级的可定制体系，以及不断对调试进行动态纠正和可编程调试的框架，这就是frida。**

frida使用的是python、JavaScript等“胶水语言”也是它火爆的一个原因，可以迅速将逆向过程自动化，以及整合到现有的架构和体系中去，为你们发布“威胁情报”、“数据平台”甚至“AI风控”等产品打好基础。

frida的几个面向：
- 面向逆向工程
- 面向可编程调试
- 面向动态的instrumentation
- 面向快速开发新工具
- 可以用于脱壳


## 安装使用
### 安装
`pip install frida  -i https://pypi.tuna.tsinghua.edu.cn/simple/`
`pip install frida-tools  -i https://pypi.tuna.tsinghua.edu.cn/simple/`

进入python解释环境，运行
```
>>> import frida
>>> frida.__version__
'14.2.18'
```

可见是14.2.18版本。如果python版本与frida版本不兼容，则会出错。然后到 https://github.com/frida/frida/releases/tag/14.2.18 下去下载 frida-server：
用于pc端调试android代码，需要下载 frida-server-14.2.18-android-x86_64.xz
在手机端调试，需要下载 frida-server-14.2.18-android-arm.xz



### 试用
在windows pc上，编写下列程序
```python
"""Frida quick guide demo 1：frida_demo1.py

Before run this script , pl open notepad.exe firstly.
"""
import frida

def on_message(message,data):
    print("[on_message] message: ",message,"data:",data)

session = frida.attach("notepad.exe")
script = session.create_script("""
        rpc.exports.enumerateModules = function(){
            return Process.enumerateModules();
        }
    """)

script.on("message",on_message)
script.load()

print([m["name"] for m in script.exports.enumerate_modules()])
```

打开记事本程序。

在frida安装后，运行下列命令：
`python frida_demo1.py`

会在命令行下看到：
```
(base) PS E:\GitRepo\security\courses\mobilesec\demo> python .\frida_demo1.py
['notepad.exe', 'ntdll.dll', 'KERNEL32.DLL', 'KERNELBASE.dll', 'GDI32.dll', 'win32u.dll', 'gdi32full.dll', 'msvcp_win.dll', 'ucrtbase.dll', 'USER32.dll', 'combase.dll', 'RPCRT4.dll', 'shcore.dll', 'msvcrt.dll', 'COMCTL32.dll', 'IMM32.DLL', 'bcryptPrimitives.dll', 'ADVAPI32.dll', 'sechost.dll', 'kernel.appcore.dll', 'uxtheme.dll', 'clbcatq.dll', 'MrmCoreR.dll', 'SHELL32.dll', 'windows.storage.dll', 'Wldp.dll', 'shlwapi.dll', 'MSCTF.dll', 'OLEAUT32.dll', 'TextShaping.dll', 'efswrt.dll', 'MPR.dll', 'wintypes.dll', 'twinapi.appcore.dll', 'oleacc.dll', 'textinputframework.dll', 'CoreMessaging.dll', 'CoreUIComponents.dll', 'WS2_32.dll', 'ntmarta.dll', 'frida-agent.dll', 'CRYPT32.dll', 'ole32.dll', 'PSAPI.DLL', 'DNSAPI.dll', 'Secur32.dll', 'WINMM.dll', 'SSPICLI.DLL', 'IPHLPAPI.DLL', 'NSI.dll']
(base) PS E:\GitRepo\security\courses\mobilesec\demo>
```

### 试用2

编写一个简单的android app。

可以使用下列反编译看一下apk逆向结果。
- jadx： java反编译器
- jeb2：java反编译器
在android模拟器中


## Modes of Operation

通过强大的指令核心Gum，Frida 提供了动态指令


## 其它参考

- xposed 框架
- cydia 框架（android 5.0以下）