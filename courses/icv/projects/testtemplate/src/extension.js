const vscode = require('vscode');

/**
 * 插件被激活时，所有代码总入口
 * @param {*} context 插件上下文
 */

exports.activate = function(context) {
    console.log("Congratulations, vscode-plugin-demo has been activated.");
    context.subscriptions.push(vscode.commands.registerCommand('extension.sayHellow',function(){
        vscode.window.showInformationMessage('Hello World!');
    }));
};

/**
 * 插件被释放时触发
 */
exports.deactivate = function(){
    console.log('Your plugin has been dismissed. ');
};

