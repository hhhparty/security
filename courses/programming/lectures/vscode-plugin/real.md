# Extension Guides

了解了Hello World中蕴含的基本概念后，[现在开始](https://code.visualstudio.com/api/extension-guides/overview)做真实世界的vscode extension 开发。

## Overview

Guides 或 Samples：
- [VS Code API](https://code.visualstudio.com/api/references/vscode-api)
- [Contribution Points](https://code.visualstudio.com/api/references/contribution-points)

- Additional [VS Code Extensions samples repo.](https://github.com/microsoft/vscode-extension-samples)
- [Language Extensions samples](https://code.visualstudio.com/api/language-extensions/overview)

## 命令

VScode中，命令触发行为。如果你已经配置了一个keybinding，那你就可以使用命令了。命令常用于将扩展的功能展现给用户、绑定VS code的UI行为、实现内部逻辑。

VScode 包含大量的[内建命令](https://code.visualstudio.com/api/references/commands)，可以用来与editor交互、控制UI、或执行后台操作。许多扩展也会将其核心功能作为命令暴露给用户。

### 程序化执行命令

`vscode.commands.executeCommand` API 可以程序化的执行一个命令。

例如：`editor.action.addCommentLine`命令，可以对当前选定的行添加comments。
```ts
import * as vscode from 'vscode';

function commentLine() {
  vscode.commands.executeCommand('editor.action.addCommentLine');
}
```
有的命令带有参数，以控制其行为。命令还有返回值。例如：类似API的命令 `vscode.executeDefinitionProvider` 在给定位置查询文档中的定义，他需要一个文档URI和位置作为参数，并返回一个定义列表。

```ts
import * as vscode from 'vscode';

async function printDefinitionsForActiveEditor() {
  const activeEditor = vscode.window.activeTextEditor;
  if (!activeEditor) {
    return;
  }

  const definitions = await vscode.commands.executeCommand<vscode.Location[]>(
    'vscode.executeDefinitionProvider',
    activeEditor.document.uri,
    activeEditor.selection.active
  );

  for (const definition of definitions) {
    console.log(definition);
  }
}
```

想找到有用的命令，可以参看：
- [Browse the keyboard shortcuts](https://code.visualstudio.com/docs/getstarted/keybindings)
- [Look through VS Code's built-in advanced commands api](https://code.visualstudio.com/api/references/commands)

### 命令 URIs

Commands URIs是一个可以执行命令的URI，它们可以用作悬停文本、完成项详细信息或 web 视图内部的可点击链接。

命令URIs 使用后跟命令名的命令模式，例如， 命令`editor.action.addCommentLine` 的命令URIs是 `command:editor.action.addCommentLine` 。这里有一个悬停 provider 来在当前活跃text 编辑器当前行中显示一个link。

```ts
import * as vscode from 'vscode';

export function activate(context:vscode.ExtensionContext){
    vscode.languages.registerHoverProvider(
        'javascript',
        new (class implements vscode.HoverProvider{
            providerHover(
                _document:vscode.TextDocument,
                _position: vscode.Position,
                _token: vscode.CancellationToken
            ): vscode.ProviderResult<vscode.Hover>{
                const commentCommandUri = vscode.Uri.parse(`command:editor.action.addCommentLine`);
                const contents = new vscode.MarkdownString(`[Add comment](${commentCommandUri})`);

                // To enable command URIs in Markdown content, you must set the `isTrusted` flag.
                // When creating trusted Markdown string, make sure to properly sanitize all the
                // input content so that only expected command URIs can be executed
                contents.isTrusted = true;

                return new vscode.Hover(contents);
            }
        })()
    );
}
```

上面的代码中，被传递的命令参数为JSON数组，已经使用URI编码。

下面的例子使用 `git.stage` 命令来处在当前文档时，生成一个悬浮link。

```ts
import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
  vscode.languages.registerHoverProvider(
    'javascript',
    new (class implements vscode.HoverProvider {
      provideHover(
        document: vscode.TextDocument,
        _position: vscode.Position,
        _token: vscode.CancellationToken
      ): vscode.ProviderResult<vscode.Hover> {
        const args = [{ resourceUri: document.uri }];
        const stageCommandUri = vscode.Uri.parse(
          `command:git.stage?${encodeURIComponent(JSON.stringify(args))}`
        );
        const contents = new vscode.MarkdownString(`[Stage file](${stageCommandUri})`);
        contents.isTrusted = true;
        return new vscode.Hover(contents);
      }
    })()
  );
}
```

你可以通过设置`WebviewOptions`里的`enableCommandUris`， 当webview生成时，在webviews中启用命令URIs。

### 生成新的命令

#### 注册一个命令

`vscode.commands.registerCommand` 在你的扩展里，会绑定了一个命令的ID到一个handler 函数。

 ```ts
import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext){
  const command = 'myExtension.sayHello';
  const commandHandler = (name:string = 'world') => {
    console.log('Hello ${name}!!!');
  };
  context.subscriptions.push(vscode.commands.registerCommand(command,commandHandler));
}
 ```

`myExtension.sayHello` 命令一执行， 这个 handler 函数就会被调用。使用 `executeCommand` 可以通过VS Code UI 或通过一个key绑定，使其可编程。

#### 生成一个面向用户的命令

`vscode.commands.registerCommand` 仅仅绑定了一个命令ID到一个handler函数。为了使这个命令可以暴露在Command Palette 中，它应该是可被用户发现的。你需要在你的扩展清单文件`package.json`中一个对应的命令 contribution 

```json
{
  "contributes":[
    {
      "command":"myExtention.sayHello",
      "title":"Say Hello"
    }
  ]
}

```

这个命令的 contribution 告诉 vscode 你的扩展提供了一个命令，也使你可以在ui中显示。现在我们的命令将显示在命令框中。

我们还需要调用 `registerCommand` 来绑定这个command id 到 hanlder，这意味着如果用户从命令框选择了 `myExtension.sayHello` 命令，但我们的扩展还没有被激活，那么将不发生任何事。为了防止这一点，扩展必须为所有面向用户的命令注册一个 `onCommandactivationEvent`

```json
{
  "activationEvents":[
    "onCommand:myExtension.sayHello"
  ]
}
```

现在，当用户第一次调用命令 `myExtension.sayHello` 命令或通过keybinding，扩展将可以被激活并且 registerCommand 将绑定 myExtension.sayHello 到正确的 hanlder。

## Color theme

色彩可视在vscode用户界面落在两个范畴：
- workbench colors
- syntax colors

## 文件图标主体

vscode显示icons

## webview API

Webview API 允许扩展生成自定义的views，构建复杂的、原来vscode不具有的用户交互。

可以把webview看作一个vscode中的iframe，它可以render各种html内容。它与扩展通信使用消息传递。

VSCode API用例：
- window.createWebviewPanel
- window.registerWebviewPanelSerializer

使用webview之前，需要考虑一下几个问题：
- 这个功能真的需要建立在VScode中么？还是作为一个独立的应用？
- webview是唯一实现你功能的方式么？你可以使用标准vscode apis代替么？
- 你的webview增加了足够的用户价值来证明他的高度资源消耗么？

记住，你做了一件事，但不意味着你应该做这件事。