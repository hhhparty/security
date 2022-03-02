# Electron Process Model

Electron 继承了Chromium的多进程架构，这使它的框架非常类似于现代浏览器。本文介绍了Electron的概念。

## 为什么不采用单一进程？
web浏览器是极其复杂的（incredibly complicated）应用。除了主要功能为显示网页外，他们有非常多的其他责任，例如管理多个windows 或 tabs 并调用 3rd 扩展。

## 多进程模型

Chrome team 令每个tab 可以在自己的进程中 render，限制错误或恶意代码在一个web page中，防止它们伤害整个app。

一个单独的浏览器进程控制这些进程，同时应用生命周期作为一个整体。下图显示了chrome comic 模型：

<img src="images/chromecomicmultiprocess.png">

Electron 应用的结构很像上图。作为一个应用开发者，你控制2类进程：
- main ： 类似 chrome's own browser
- renderer : render process outlined above

## The Main Process
每个 Electron app 有一个main process， 扮演着应用的入口点。主进程运行在 Node.js 环境，意味着他有能力 require modules 且使用所有的 node.js APIs.

### Window management

主进程的主要目的：使用 `BrowserWindow` module 生成和管理应用窗口。

每个 `BrowserWindow` 实例生成一个应用窗口，它在另一个 renderer 进程中启动一个web page。你可以在 main 进程中使用该窗口的 `webContent` 对象与这个renderer 进程交互它的web 内容。

```js
//main.js

const { BrowserWindow } = require('electron')

const win = new BrowserWindow({ width: 800, height: 1500 })
win.loadURL('https://github.com')

const contents = win.webContents
console.log(contents)
```

Note: A renderer process is also created for web embeds such as the BrowserView module. The `webContents` object is also accessible for embedded web content.

Because the BrowserWindow module is an EventEmitter , you can also add handlers for various user events.

When the `BrowserWindow` instance is destroyed, the corresponding renderer process gets terminated as well.

### 应用生命周期

The main 进程也控制着你的应用生命周期，通过 Electron's app 模块。

这个模块提供了更大的事件集合和方法集合，你可以用来增加自定义应用行为。
```js
//main.js
// quitting the app when no windows are open on non-macOS platforms
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})
```

### Native APIs

为了扩展 Electron的特性，使其超越一个 chromium wrapper for web contents，主进程也增加了自定义的APIs，实现与用户os交互。 Electron 提供了各种modules，控制原生桌面功能，例如菜单、对话框和icons。

For a full list of Electron's main process modules, check out our [API documentation](https://www.electronjs.org/docs/latest/api/app).


## The renderer process

每个 Electron app 为每个打开的 `BrowserWindow` （和每个web embed） 分配一个单独的 renderer 进程。如其名字，一个 renderer 负责渲染web内容。运行在renderer 进程中的代码应当根据web 标准执行动作（至少如chromium 要求的）。

因此，所有在单独浏览器窗口中的用户接口和 app 功能应当使用同一种工具和范式编写。

尽管表达每个web 标准超出了本文档范围，最基本的解释为：
- 一个 HTML 文档作为renderer 进程的入口点
- UI 风格通过CSS添加
- 可执行的 js 代码可以通过 script 元素加入

此外，the renderer 进程不直接访问 require 或别的 node.js APIs。为了直接包含 NPM modules 到 renderer中，你必须使用同样的bundler 工具链，例如 webpack 或 parcel。

注意： Renderer 进程可能在一个完整的 node.js 环境中被孵化。历史上，这一点是默认的，但现在为了安全被禁用了。

你可能奇怪，如果这些功能仅能从main进程访问，那么你的renderer进程用户接口如何能与node.js 交互，以及与 Electron's 原生桌面功能交互？事实上，没有直接的方式来import electron‘s 内容脚本。

### Preload scripts

Preload 脚本包含了一个renderer进程的 web content 开始加载之前的执行代码。这类脚本在这个 renderer 上下文中运行，但是被授予更多权限来访问 Node.js APIs.

一个 preload 脚本可以附到主进程上，在 中执行的代码，`BrowserWindow` 构造器的 `webPreferences` 选项中。

```js
//main.js
const {BrowserWindow} = require('electron')
//
const win = new BrowserWindow({
    webPreferences:{
        preload: 'path/to/preload.js'
    }
})
```

因为 preload 脚本与这些 renderers 共享了一个全局 Window 接口，而且可以访问 Node.js APIs，通过在windows中提供各类APIs来用于增强你的 renderer 。

尽管 preload scripts 与其附着的renderer 共享 widnow global ， 你不能从preload 脚本直接附着任何变量到window，因为默认情况下 `contextIsolation。`

```js
//preload.js
window.myAPI = {
    desktop:true
}
```

```js
//renderer.js
console.log(window.myAPI)
// => undefined
```

上下文隔离（Context Isolation）意味着 preload 脚本与rendere的主世界相互隔离，以避免泄漏任何限制的APIs到你的web content‘s 代码。

代替地，使用 contextBridge 模块来安全实现：
 
```js
//preload.js
const { contextBridge } = require('electron')

contextBridge.exposeInMainWorld('myAPI',{
    desktop:true
})
```

```js
//renderer.js

console.log(window.myAPI)
// => {desktop:true}
```

这个特性非常有用，主要有两个目的：
- 通过暴漏 `ipcRenderer` helpers 给 the renderer，你可以使用进程间通信（IPC）从renderer来触发主进程任务。反之亦然（vice-versa）
- If you're developing an Electron wrapper for an existing web app hosted on a remote URL, you can add custom properties onto the renderer's window global that can be used for desktop-only logic on the web client's side.
