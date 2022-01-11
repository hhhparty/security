# frida

## 概念

Frida 是一个动态代码检测工具包，她运行您奖js片段或自己的库注入 windows、macos、ios、linux、android、qnx上的本机应用程序。

Frida 还提供了一些构建在 frida-api上的简单工具。

### Why？
- 假设有一个令人感兴趣的应用，但它仅使用于ios，你想与之交互但缺少依赖环境，例如它依赖于加密的网络协议，而wireshark无法解读，那么使用frida可以在api层面进行跟踪。
- 假设你正在构建一个部署在客户端的桌面app，但有些问题无法通过日志来发现，这时只需要使用frida并构建一个特定于app的工具，添加所需要的诊断（几行python），无需向客户发送新的自定义build。
- 你想构建以恶搞支持嗅探加密协议的wireshark，甚至可以操作函数调用来伪造网络条件。
- 内部应用程序需要使用一些呵呵测试，不会使用外来测试污染生产代码。

#### 为什么使用 python api，却使用js 调试逻辑？
Frida 核心使用C编写，并将QuickJS注入目标进程，在那里你的js可以完全访问内存、hook函数、在进程内部调用本机函数来执行。

有一个双向通信通道用于你的程序和目标进程内运行的js之间进行通信。

使用python 和js可以通过无风险的api进行快速开发，frida可以帮助你轻松捕获js中的错误并为你提供异常，而不是崩溃。
您可以直接从 C 中使用 Frida，在这个 C 核心之上有多种语言绑定，例如 Node.js、 Python、 Swift、 .NET、 Qml等。很容易为其他语言和环境构建额外的绑定.

## Quick Start

- `pip install frida-tools` 安装 frida
- `frida-trace -i "recv*" -i "read*" twitter`  注入twitter 进程， 枚举 twitter 共享库并挂钩所有名称以recv or  read 开头的函数。它还生成了一些样板脚本，用于在函数调用发生时检查它们。

