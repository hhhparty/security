# Vscode Plugin 开发

## 可以扩展什么？

下面是一些例子：
- 改变 vscode 的外观
- 增加自定义组件、views
- 生成 webview 显示使用html/css/js生成的自定义webpage
- 支持新的编程语言
- 支持调试一个特定运行时

更多复杂的扩展，可以参考 [Extension Capabilities Overview](https://code.visualstudio.com/api/extension-capabilities/overview)

## 如何构建扩展？

- [ GET STARTED ](https://code.visualstudio.com/api#get-started-articles) 提供了构建扩展的基本概念
- Extension Capabilities 讨论了 VS code的各种细节分类的 API，并指导你到更多细节话题。
- Language Extensions 解释了如何增加编程语言支持。
- TEsting and Publishing 包括了关于各种扩展开发的深度向导 


## Get Started

### First Extension

首先要安装 [Node.js](http://nodejs.cn/) 和 Git，然后安装 Yeoman 和 VScode Extension Generator。

``` shell
# 1.上node官网，安装 node.js

# 2.设置国内镜像
sudo npm install -g cnpm --registry=https://registry.npm.taobao.org 

# 3.安装Yeoman 和 VS code extension generator
sudo cnpm install -g yo generator-code

# 4.运行下列命令，生成一个typescript 或 javascript 项目。下面命令成功执行后，会进入一个命令行对话过程，用于生成基本项目结构。假设其中项目名为helloworld。
yo code

# 5.使用vscode 编辑项目 helloworld

# 6.在vscode中按F5，将编译和运行该插件。如果能看到右下角出现的提示helloworld。表示运行成功。
```

上面的Hello world 扩展做了3件事(在 package.json 中定义)：
- 注册 `onCommand` 这个激活事件（[Activation Event](https://code.visualstudio.com/api/references/activation-events)）：onCommand:helloworld.helloWorld，当用于运行Hello World命令时，此扩展就被激活。

- 使用 `contributes.commands` 贡献点 [Contribution Point](https://code.visualstudio.com/api/references/contribution-points) ，使命令 Hello World 能够在命令行中（Command Palette）使用，然后绑定它到命令ID `helloworld.helloWorld` .

- 使用 `commands.registerCommand` [VS Code API](https://code.visualstudio.com/api/references/vscode-api) 来绑定一个函数到注册的命令ID `helloworld.helloWorld`


写VScode 扩展时，理解这3个概念非常关键：
- Activation Events：当你的扩展被激活时加载的事件。
- Contribution Points：你在package.json 扩展清单中列出扩展vscode的静态生命。
- VS Code API：一个你可以在扩展code中引用的JavaScript API集合

通常，你的扩展将使用 Contribution Points 和 VS Code API的结合，来扩展 VS code 功能。[Extension Capabilities Overview](https://code.visualstudio.com/api/extension-capabilities/overview) 可以帮助你找到正确的 Contribution Point 和 VS Code API。

### 扩展文件结构

.
├── .vscode
│   ├── launch.json     // Config for launching and debugging the extension
│   └── tasks.json      // Config for build task that compiles TypeScript
├── .gitignore          // Ignore build output and node_modules
├── README.md           // Readable description of your extension's functionality
├── src
│   └── extension.ts    // Extension source code
├── package.json        // Extension manifest
├── tsconfig.json       // TypeScript configuration

配置文件包括：
- `lanuch.js`，用于配置VS code [调试](https://code.visualstudio.com/docs/editor/debugging)
- `task.json`，用于定义 VS code [tasks](https://code.visualstudio.com/docs/editor/tasks)
- `tsconfig.json` 负责 TypeScript [手册](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html)

#### 扩展清单

每个vs code extension 必须有一个 package.json 作为扩展清单。package.json 包含混合的Node.js fields，例如 scripts 和 devDependencies，以及 VS code specific fields，例如 publisher， activationEvents。