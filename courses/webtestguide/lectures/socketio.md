# Socket.io Get started

## 介绍
使用LAMP（PHP）构建聊天系统是非常困难的.而Sockets是传统解决实时聊天系统的架构的、提供双工信道的解决方案。

## web 框架

构建聊天应用，第一个目标是建立一个简单的HTML 页面，包括一个表单和一组消息。我们使用node.js web 框架 express来建立这个端点。

- 首先要安装Node.js
- 在自己的目录下新建一个目录 chat-example
- 在chat-example下，生成一个 package.json
```json
{
  "name": "socket-chat-example",
  "version": "0.0.1",
  "description": "my first socket.io app",
  "dependencies": {}
}
```
- `npm install express@4`
- create an index.js 用于启动我们的程序

```js
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);

app.get('/', (req, res) => {
  res.send('<h1>Hello world</h1>');
});

server.listen(3000, () => {
  console.log('listening on *:10000');
});
```
说明：Express 初始化app，是一个函数handler，你可以在用来作为 http server；定义路由 / 获得响应；使服务器监听10000。


- 运行 `node index.js` ，使用浏览器访问 http://host-ip:10000/ 能看到 Hello world。

- 为了防止混淆，我们生成一个index.html文件，并重构上面index.js的内容
```js
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});
```

index.html:
```html
<!DOCTYPE html>
<html>
  <head>
    <title>Socket.IO chat</title>
    <style>
      body { margin: 0; padding-bottom: 3rem; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }

      #form { background: rgba(0, 0, 0, 0.15); padding: 0.25rem; position: fixed; bottom: 0; left: 0; right: 0; display: flex; height: 3rem; box-sizing: border-box; backdrop-filter: blur(10px); }
      #input { border: none; padding: 0 1rem; flex-grow: 1; border-radius: 2rem; margin: 0.25rem; }
      #input:focus { outline: none; }
      #form > button { background: #333; border: none; padding: 0 1rem; margin: 0.25rem; border-radius: 3px; outline: none; color: #fff; }

      #messages { list-style-type: none; margin: 0; padding: 0; }
      #messages > li { padding: 0.5rem 1rem; }
      #messages > li:nth-child(odd) { background: #efefef; }
    </style>
  </head>
  <body>
    <ul id="messages"></ul>
    <form id="form" action="">
      <input id="input" autocomplete="off" /><button>Send</button>
    </form>
  </body>
</html>
```

## 集成 Socket.IO

Socket.IO由两部分构成：
- 服务器，整合了Node.js http server socket.io
- 客户端库，它们启动浏览器侧的socket.io-client

我们需要安装：`npm install socket.io`

这将自动安装依赖到package.json。

下面重构一下index.js

```js
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  console.log('a user connected');
});

server.listen(10000, () => {
  console.log('listening on *:10000');
});
```

修改index.html,在body中的尾部增加下列内容 ：
```html
<script src="/socket.io/socket.io.js"></script>
<script>
  var socket = io();
</script>
```
html中调用了socket.io-client,它暴露了一个io全局（还有端点 GET /socket.io/socket.io.js），然后连接。

如果你想使用客户端js文件的本地版本，可以在node_modules/socket.io/client-dist/socket.io.js找到他。

注意，上面在调用io()时，没有指定任何URL，因此默认尝试连接到服务该页面的主机。

重新运行 node index.js，会在用户访问时看到‘ a user connected.’

每个socket都可以产生一个特殊的disconnect事件：

```js
io.on('connection',(socket) =>{
    console.log('a user connected');
    socket.on('disconnect',()=>{
        console.log('user disconnected');
    });
});
```

然后你刷新几次，你会看到效果。

## emitting events

Socket.io的主要思想是你可以发送和接收任何你想要的事件，任何你想要的数据。凡是可以编码为json的对象，其二进制数据也支持。

当用户发送一些消息，服务器接收到它作为chat message event。在index.html中的脚本现在改为如下形式：

```html
<script src="/socket.io/socket.io.js"></script>
<script>
  var socket = io();

  var form = document.getElementById('form');
  var input = document.getElementById('input');

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    if (input.value) {
      socket.emit('chat message', input.value);
      input.value = '';
    }
  });
</script>
```

index.js增加chat message 事件：
```js
io.on('connection', (socket) => {
  socket.on('chat message', (msg) => {
    console.log('message: ' + msg);
  });
});
```

## 广播
下一步就是把消息广播给别的用户。

为了将一个事件送给任何人，socket.io 有一个io.emit()方法

`io.emit('some event', { someProperty: 'some value', otherProperty: 'other value' }); // This will emit the event to all connected sockets`

我们可疑使用 broadcast 标记

```js
io.on('connection', (socket) => {
  socket.broadcast.emit('hi');
});
```

在本例，为了简化，我们发送消息给每个人，包括sender。

```js
io.on('connection', (socket) => {
  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });
});
```

And on the client side when we capture a chat message event we’ll include it in the page. The total client-side JavaScript code now amounts to:

<script>
  var socket = io();

  var messages = document.getElementById('messages');
  var form = document.getElementById('form');
  var input = document.getElementById('input');

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    if (input.value) {
      socket.emit('chat message', input.value);
      input.value = '';
    }
  });

  socket.on('chat message', function(msg) {
    var item = document.createElement('li');
    item.textContent = msg;
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
  });
</script>

```

And that completes our chat application, in about 20 lines of code! This is what it looks like: