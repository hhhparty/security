# Websocket 

## 基本概念
Websocket 是HTML5 中提出的一种在单个TCP连接上进行全双工通信的协议。

WebSocket 使得客户端和服务器之间的数据交换变得更加简单，允许服务端主动向客户端推送数据。在 WebSocket API 中，浏览器和服务器只需要完成一次握手，两者之间就直接可以创建持久性的连接，并进行双向数据传输。

在 WebSocket API 中，浏览器和服务器只需要做一个握手的动作，然后，浏览器和服务器之间就形成了一条快速通道。两者之间就直接可以数据互相传送。

现在，很多网站为了实现推送技术，所用的技术都是 Ajax 轮询。轮询是在特定的的时间间隔（如每1秒），由浏览器对服务器发出HTTP请求，然后由服务器返回最新的数据给客户端的浏览器。这种传统的模式带来很明显的缺点，即浏览器需要不断的向服务器发出请求，然而HTTP请求可能包含较长的头部，其中真正有效的数据可能只是很小的一部分，显然这样会浪费很多的带宽等资源。

HTML5 定义的 WebSocket 协议，能更好的节省服务器资源和带宽，并且能够更实时地进行通讯。

<img src="images/websocket/ws.png">

浏览器通过 JavaScript 向服务器发出建立 WebSocket 连接的请求，连接建立以后，客户端和服务器端就可以通过 TCP 连接直接交换数据。

当你获取 Web Socket 连接后，你可以通过 send() 方法来向服务器发送数据，并通过 onmessage 事件来接收服务器返回的数据。

以下 API 用于创建 WebSocket 对象。

`var Socket = new WebSocket(url,[protocl])`

### WebSocket 属性

以下是 WebSocket 对象的属性。假定我们使用了以上代码创建了 Socket 对象：

- Socket.readyState	只读属性 readyState 表示连接状态，可以是以下值：

0 - 表示连接尚未建立。1 - 表示连接已建立，可以进行通信。2 - 表示连接正在进行关闭。3 - 表示连接已经关闭或者连接不能打开。

- Socket.bufferedAmount	只读属性 bufferedAmount 已被 send() 放入正在队列中等待传输，但是还没有发出的 UTF-8 文本字节数。

### WebSocket 事件
以下是 WebSocket 对象的相关事件。假定我们使用了以上代码创建了 Socket 对象：

事件	事件处理程序	描述
open	Socket.onopen	连接建立时触发
message	Socket.onmessage	客户端接收服务端数据时触发
error	Socket.onerror	通信发生错误时触发
close	Socket.onclose	连接关闭时触发
### WebSocket 方法
以下是 WebSocket 对象的相关方法。假定我们使用了以上代码创建了 Socket 对象：

方法	描述
Socket.send()	
使用连接发送数据

Socket.close()	
关闭连接

### 实例
为了建立一个 WebSocket 连接，客户端浏览器首先要向服务器发起一个 HTTP 请求，这个请求和通常的 HTTP 请求不同，包含了一些附加头信息，其中附加头信息"Upgrade: WebSocket"表明这是一个申请协议升级的 HTTP 请求，服务器端解析这些附加的头信息然后产生应答信息返回给客户端，客户端和服务器端的 WebSocket 连接就建立起来了，双方就可以通过这个连接通道自由的传递信息，并且这个连接会持续存在直到客户端或者服务器端的某一方主动的关闭连接。

#### 客户端的 HTML 和 JavaScript
目前大部分浏览器支持 WebSocket() 接口，你可以在以下浏览器中尝试实例： Chrome, Mozilla, Opera 和 Safari。

websocket_demo1.html 文件内容：

```html

<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <title>websocket demo</title>
        <script type="text/javascript">
            function WebSocketTest()
            {
                if("WebSocket" in window)
                {
                    alert("当前浏览器支持 WebSocket！");
                    
                    // open a websocket
                    var ws = new WebSocket("ws://localhost:10000/echo");
                    ws.onopen=function()
                    {
                        // Web Socket connected，using send() forward data.
                        ws.send("some data, such as abcde 12345");
                        alert("数据发送中...");
                    };

                    ws.onmessage = function(event)
                    {
                        var received_msg = event.data;
                        alert("Data is received.");
                    };

                    ws.onclose = function()
                    {
                        alert("Connect is closed.");
                    }

                }
                else
                {
                    //浏览器不支持websocket
                    alert("当前浏览器不支持websocket");
                }
            }
        </script>
    </head>
    <body>
        <div id="sse">
            <a href="javascript:WebSocketTest()">测试 WebSocket...</a>
        </div>
    </body>
</html>
```
#### 服务器端
在执行以上程序前，我们需要创建一个支持 WebSocket 的服务。从 pywebsocket 下载 mod_pywebsocket ,或者使用 git 命令下载：