# Node.js 基本概念

Node.js 是运行在服务端的javascript。它是一个基于Chrome javascript 运行时的一个平台，是一个事件驱动I/O服务器端，基于google V8 引擎执行javascript。

## npm
npm是一个包管理工具，解决node.js代码部署的很多问题。
- 允许用户从npm服务器上下载第三方包到本地
- 允许用户从npm服务器上下载第三方命令程序到本地
- 允许用户将自己编写的包货命令行程序上传到npm服务器，供别人使用

升级方法
`sudo npm install npm -g`

### package.json
这个文件位于模块的目录下，用于定义包的属性。

name - 包名。

version - 包的版本号。

description - 包的描述。

homepage - 包的官网 url 。

author - 包的作者姓名。

contributors - 包的其他贡献者姓名。

dependencies - 依赖包列表。如果依赖包没有安装，npm 会自动将依赖包安装在 node_module 目录下。

repository - 包代码存放的地方的类型，可以是 git 或 svn，git 可在 Github 上。

main - main 字段指定了程序的主入口文件，require('moduleName') 就会加载这个文件。这个字段的默认值是模块根目录下面的 index.js。

keywords - 关键字

### 创建模块

package.json 文件在创建模块时必不可少，可以使用npm生产。

`npm init`

填写一些信息后就可以生成package.json

使用以下命令在 npm 资源库中注册用户（使用邮箱注册）：`npm adduser`

使用`npm publish` 发布模块。

## REPL 交互式解释器

Read Eval Print Loop 表示一个电脑环境，类似windows或linux的shell，可以输入命令并接受响应。

Node自带了交互式解释器，可以执行读取、执行、打印、循环等。

### 命令行中的下划线`_`变量

表示获取上一个表达式的运算结果。

## 回调函数

Node.js 异步编程的直接体现就是回调。异步编程依托回调实现，但有回调不代表就异步了。

回调函数在完成任务后就会被调用，Node使用了大量的callback，Node所有API都支持callback。

例如读取文件命令启动后，又去执行别的操作，当文件读取完了内容会作为回调函数的参数返回。这样没有I/O阻塞，提供了并发性能。

回调函数一般作为最后一个参数在函数中出现：

```js
function foo1(name,age,callback){}
function foo1(name,age,callback1,callback2){}
```

阻塞型代码：
```
var fs = require("fs");

var data = fs.readFileSync('input.txt');

console.log(data.toString());
console.log("程序执行结束!");
```

非阻塞代码
```
var fs = require("fs");

fs.readFile('input.txt', function (err, data) {
    if (err) return console.error(err);
    console.log(data.toString());
});

console.log("程序执行结束!");
```

## 事件循环

Node.js 是单进程单线程应用程序，但是v8引擎提供的异步执行回调接口，通过这些接口可以处理大量并发，所以性能很高。

Node.js 基本上所有事件机制都是用设计模式中观察者模式实现。

Node.js 单线程类似进入一个while（true）的事件循环，知道没有事件观察者退出，每个异步事件都生成一个事件观察者，如果有事件发生就调用该回调函数。

### 事件驱动程序

Node.js使用事件驱动模型，当webserver接收到请求，就把它关闭然后进行处理，然后去服务下一个web请求。这个请求完成，它被放回处理队列，当到达队列开头，这个结果会被返回给用户。

这个模型非常可靠且扩展性很强，因为webserver一直接受请求而不等待任何读写操作。这也称为非阻塞I/O，或事件驱动IO。

在事件驱动模型中，会生成一个主循环来监听事件，当检测到事件时触发回调函数。

<img src="images/event_loop.jpeg">

整个事件驱动的流程就是这么实现的，非常简洁。有点类似于观察者模式，事件相当于一个主题(Subject)，而所有注册到这个事件上的处理函数相当于观察者(Observer)。

Node.js 有多个内置的事件，我们可以通过引入 events 模块，并通过实例化 EventEmitter 类来绑定和监听事件，如下实例：

```
// 引入 events 模块
var events = require('events');
// 创建 eventEmitter 对象
var eventEmitter = new events.EventEmitter();
 
// 创建事件处理程序
var connectHandler = function connected() {
   console.log('连接成功。');
  
   // 触发 data_received 事件 
   eventEmitter.emit('data_received');
}
 
// 绑定 connection 事件处理程序
eventEmitter.on('connection', connectHandler);
 
// 使用匿名函数绑定 data_received 事件
eventEmitter.on('data_received', function(){
   console.log('数据接收成功。');
});
 
// 触发 connection 事件 
eventEmitter.emit('connection');
 
console.log("程序执行完毕。");
```

### Node 应用程序是如何工作的？
Node应用程序中，执行异步操作的函数讲回调函数作为最后一个参数，回调函数接收错误对象作为第一个参数。

var fs = require("fs");

fs.readFile('input.txt', function (err, data) {
   if (err){
      console.log(err.stack);
      return;
   }
   console.log(data.toString());
});
console.log("程序执行完毕");
以上程序中 fs.readFile() 是异步函数用于读取文件。 如果在读取文件过程中发生错误，错误 err 对象就会输出错误信息。

如果没发生错误，readFile 跳过 err 对象的输出，文件内容就通过回调函数输出。

执行以上代码，执行结果如下：

程序执行完毕
菜鸟教程官网地址：www.runoob.com
接下来我们删除 input.txt 文件，执行结果如下所示：

程序执行完毕
Error: ENOENT, open 'input.txt'
因为文件 input.txt 不存在，所以输出了错误信息。

## Node.js EventEmitter

Node.js 所有的异步IO操作在完成时都会发送一个事件到事件队列。许多兑现过都会分发事件：
- 一个net.Server 对象会在每次有新连接时触发一个事件
- 一个fs.readStream  对象会在文件被打开时触发一个事件

所有这些事件的对象都是 events.EventEmitter 的实例。

events 模块只提供了一个对象： events.EventEmitter。EventEmitter 的核心就是事件触发与事件监听器功能的封装。EventEmitter 对象如果在实例化时发生错误，会触发 error 事件。当添加新的监听器时，newListener 事件会触发，当监听器被移除时，removeListener 事件被触发。

你可以通过require("events");来访问该模块。

EventEmitter 的每个事件有一个事件名和若干个参数组成，事件名是一个字符串，通常有某个语义。对每个事件，EventEmitter支持若干的事件监听器。

当事件触发时，注册到这个事件的事件监听器被依次调用，事件参数作为回调函数参数传递。

EventEmitter 提供了多个属性，如 on 和 emit。on 函数用于绑定事件函数，emit 属性用于触发一个事件。接下来我们来具体看下 EventEmitter 的属性介绍。

- addListener(event,listener):为指定事件添加一个监听器到监听器数组的尾部。
- on(event, listener) 为指定事件注册一个监听器，接受一个字符串 event 和一个回调函数。
- once(event, listener) 为指定事件注册一个单次监听器，即 监听器最多只会触发一次，触发后立刻解除该监听器。
- removeListener(event, listener) 移除指定事件的某个监听器，监听器必须是该事件已经注册过的监听器。它接受两个参数，第一个是事件名称，第二个是回调函数名称。
- setMaxListeners(n)
默认情况下， EventEmitters 如果你添加的监听器超过 10 个就会输出警告信息。 setMaxListeners 函数用于改变监听器的默认限制的数量。
- listeners(event) 返回指定事件的监听器数组。
- emit(event, [arg1], [arg2], [...]) 按监听器的顺序执行执行每个监听器，如果事件有注册监听返回 true，否则返回 false。

error 事件

EventEmitter定义了一个特殊的事件error，它包含了错误的语义，遇到异常时会触发它。

当 error 被触发时，EventEmitter 规定如果没有响 应的监听器，Node.js 会把它当作异常，退出程序并输出错误信息。

我们一般要为会触发 error 事件的对象设置监听器，避免遇到错误后整个程序崩溃。

### 继承EventEmitter
大多数时候不直接使用它。

而是在对象中继承他。包括fs、net、http在内的，只要支持事件响应的核心模块都是EventEmitter的子类。

为什么要这样做呢？原因有亮点：
- 具有每个实体功能的对象实现事件符合语义，时间的监听和发生都应该是一个对象的方法。
- JavaScript的对象机制是基于原型的，支持部分多重继承，继承EventEmitter不会打乱对象原有的集成关系。

## Node.js Buffer
Javascript 语言自身只有字符串类型，没有二进制数据类型。

但处理TCP流或文件流时，必须使用二进制数据。因此Node.js中定一个一个Buffer类，用来创建一个专门存放二进制数据的缓存区。

在 Node.js 中，Buffer类是随Node内核一起发布的核心库。Buffer库为Nodejs带来一种存储原始数据的方法。可以让nodejs处理二进制数据。

每当需要在 Node.js 中处理I/O操作中移动的数据时，就有可能使用 Buffer 库。原始数据存储在 Buffer 类的实例中。一个 Buffer 类似于一个整数数组，但它对应于 V8 堆内存之外的一块原始内存。

在v6.0之前创建Buffer对象直接使用new Buffer()构造函数来创建对象实例，但是Buffer对内存的权限操作相比很大，可以直接捕获一些敏感信息，所以在v6.0以后，官方文档里面建议使用 Buffer.from() 接口去创建Buffer对象。

### Buffer 与字符编码

Buffer 实例一般用于表示编码字符的序列。比如 UTF-8，UCS2，Base64或16 进制编码的数据。通过使用显示的字符编码，就可以在Buffer 实例和普通js字串件进行交换。

```
const buf = Buffer.from('runn','ascii');
console.log(buf.toString('hex'));

```
Node.js 目前支持的字符编码包括：

ascii - 仅支持 7 位 ASCII 数据。如果设置去掉高位的话，这种编码是非常快的。

utf8 - 多字节编码的 Unicode 字符。许多网页和其他文档格式都使用 UTF-8 。

utf16le - 2 或 4 个字节，小字节序编码的 Unicode 字符。支持代理对（U+10000 至 U+10FFFF）。

ucs2 - utf16le 的别名。

base64 - Base64 编码。

latin1 - 一种把 Buffer 编码成一字节编码的字符串的方式。

binary - latin1 的别名。

hex - 将每个字节编码为两个十六进制字符。

### 创建Buffer类
Buffer 提供了以下 API 来创建 Buffer 类：

Buffer.alloc(size[, fill[, encoding]])： 返回一个指定大小的 Buffer 实例，如果没有设置 fill，则默认填满 0
Buffer.allocUnsafe(size)： 返回一个指定大小的 Buffer 实例，但是它不会被初始化，所以它可能包含敏感的数据
Buffer.allocUnsafeSlow(size)
Buffer.from(array)： 返回一个被 array 的值初始化的新的 Buffer 实例（传入的 array 的元素只能是数字，不然就会自动被 0 覆盖）
Buffer.from(arrayBuffer[, byteOffset[, length]])： 返回一个新建的与给定的 ArrayBuffer 共享同一内存的 Buffer。
Buffer.from(buffer)： 复制传入的 Buffer 实例的数据，并返回一个新的 Buffer 实例
Buffer.from(string[, encoding])： 返回一个被 string 的值初始化的新的 Buffer 实例

### 写入缓冲区

语法
`buf.write(string[,offset[,length]][,encoding])`

参数描述如下：

string - 写入缓冲区的字符串。

offset - 缓冲区开始写入的索引值，默认为 0 。

length - 写入的字节数，默认为 buffer.length

encoding - 使用的编码。默认为 'utf8' 。

根据 encoding 的字符编码写入 string 到 buf 中的 offset 位置。 length 参数是写入的字节数。 如果 buf 没有足够的空间保存整个字符串，则只会写入 string 的一部分。 只部分解码的字符不会被写入。

返回值
返回实际写入的大小。如果 buffer 空间不足， 则只会写入部分字符串。

### 从缓冲区读取数据
语法
读取 Node 缓冲区数据的语法如下所示：

`buf.toString([encoding[, start[, end]]])`

参数
参数描述如下：

encoding - 使用的编码。默认为 'utf8' 。

start - 指定开始读取的索引位置，默认为 0。

end - 结束位置，默认为缓冲区的末尾。

返回值
解码缓冲区数据并使用指定的编码返回字符串。

### 将 Buffer 转换为 JSON 对象
语法
将 Node Buffer 转换为 JSON 对象的函数语法格式如下：

buf.toJSON()
当字符串化一个 Buffer 实例时，JSON.stringify() 会隐式地调用该 toJSON()。

返回值
返回 JSON 对象。

### 缓冲区合并
语法
Node 缓冲区合并的语法如下所示：

Buffer.concat(list[, totalLength])
参数
参数描述如下：

list - 用于合并的 Buffer 对象数组列表。

totalLength - 指定合并后Buffer对象的总长度。

返回值
返回一个多个成员合并的新 Buffer 对象。
### 缓冲区比较
语法
Node Buffer 比较的函数语法如下所示, 该方法在 Node.js v0.12.2 版本引入：

buf.compare(otherBuffer);
参数
参数描述如下：

otherBuffer - 与 buf 对象比较的另外一个 Buffer 对象。

返回值
返回一个数字，表示 buf 在 otherBuffer 之前，之后或相同。

### 拷贝缓冲区
语法
Node 缓冲区拷贝语法如下所示：

buf.copy(targetBuffer[, targetStart[, sourceStart[, sourceEnd]]])
参数
参数描述如下：

targetBuffer - 要拷贝的 Buffer 对象。

targetStart - 数字, 可选, 默认: 0

sourceStart - 数字, 可选, 默认: 0

sourceEnd - 数字, 可选, 默认: buffer.length

返回值
没有返回值。

### 缓冲区裁剪
Node 缓冲区裁剪语法如下所示：

buf.slice([start[, end]])
参数
参数描述如下：

start - 数字, 可选, 默认: 0

end - 数字, 可选, 默认: buffer.length

返回值
返回一个新的缓冲区，它和旧缓冲区指向同一块内存，但是从索引 start 到 end 的位置剪切

### 缓冲区长度
语法
Node 缓冲区长度计算语法如下所示：

buf.length;
返回值
返回 Buffer 对象所占据的内存长度。

## Node.js Stream 

Stream 是一个抽象接口，Node中有很多对象实现了这个接口。例如http请求request对象就是一个stream，还有stdout。

Node.js Stream有四种类型：
- Readable 可读操作
- Writeable 可写操作
- Duplex 可读可写操作
- Transform 操作被写入数据，然后读出结果。

所有的 Stream 对象都是 EventEmitter 的实例。常用的事件有：

data - 当有数据可读时触发。

end - 没有更多的数据可读时触发。

error - 在接收和写入过程中发生错误时触发。

finish - 所有数据已被写入到底层系统时触发。


### 从流中读取数据

```js

var fs = require("fs");
var data = '';

// 创建可读流
var readerStream = fs.createReadStream('input.txt');

// 设置编码为 utf8。
readerStream.setEncoding('UTF8');

// 处理流事件 --> data, end, and error
readerStream.on('data', function(chunk) {
   data += chunk;
});

readerStream.on('end',function(){
   console.log(data);
});

readerStream.on('error', function(err){
   console.log(err.stack);
});

console.log("程序执行完毕");
```

### 写入流
```js
var fs = require("fs");
var data = '菜鸟教程官网地址：www.runoob.com';

// 创建一个可以写入的流，写入到文件 output.txt 中
var writerStream = fs.createWriteStream('output.txt');

// 使用 utf8 编码写入数据
writerStream.write(data,'UTF8');

// 标记文件末尾
writerStream.end();

// 处理流事件 --> finish、error
writerStream.on('finish', function() {
    console.log("写入完成。");
});

writerStream.on('error', function(err){
   console.log(err.stack);
});

console.log("程序执行完毕");
```

### 管道流

管道提供了一个输出流到输入流的机制。通常我们从一个流中获取数据并将数据传递到另一个流中。
```js
var fs = require("fs");

// 创建一个可读流
var readerStream = fs.createReadStream('input.txt');

// 创建一个可写流
var writerStream = fs.createWriteStream('output.txt');

// 管道读写操作
// 读取 input.txt 文件内容，并将内容写入到 output.txt 文件中
readerStream.pipe(writerStream);

console.log("程序执行完毕");
```

### 链式流
链式是通过连接输出流到另外一个流并创建多个流操作链的机制。链式流一般用于管道操作。

接下来我们就是用管道和链式来压缩和解压文件。

创建 compress.js 文件, 代码如下：
```js
var fs = require("fs");
var zlib = require('zlib');

// 压缩 input.txt 文件为 input.txt.gz
fs.createReadStream('input.txt')
  .pipe(zlib.createGzip())
  .pipe(fs.createWriteStream('input.txt.gz'));
  
console.log("文件压缩完成。");
```
代码执行结果如下：

$ node compress.js 
文件压缩完成。
执行完以上操作后，我们可以看到当前目录下生成了 input.txt 的压缩文件 input.txt.gz。

接下来，让我们来解压该文件，创建 decompress.js 文件，代码如下：
```js
var fs = require("fs");
var zlib = require('zlib');

// 解压 input.txt.gz 文件为 input.txt
fs.createReadStream('input.txt.gz')
  .pipe(zlib.createGunzip())
  .pipe(fs.createWriteStream('input.txt'));
  
console.log("文件解压完成。");
```

代码执行结果如下：

$ node decompress.js 
文件解压完成。

## Node.js 模块系统

为了让nodejs的文件可以互相调用，Node.js 提供了一个简单的模块系统。模块是node.js  应用程序的基本组成部分，文件和模块是一一对应的。一个node.js文件就是一个模块，可以使js代码、json或编译的c/c++扩展。

### 引入模块
```
var hello = require('./hello');
hello.world();
```
以上实例中，代码 require('./hello') 引入了当前目录下的 hello.js 文件（./ 为当前目录，node.js 默认后缀为 js）。

Node.js 提供了 exports 和 require 两个对象:
- 其中 exports 是模块公开的接口;
- require 用于从外部获取一个模块的接口，即所获取模块的 exports 对象。

接下来我们就来创建 hello.js 文件，代码如下：
```js
exports.world = function() {
  console.log('Hello World');
}
```

在以上示例中，hello.js 通过 exports 对象把world作为模块的访问接口，在main.js  中通过require('./hello') 夹在这个模块，然后就可以直接访问hellojs中的exports对象的成员函数了。


有时候，我们只是想把一个对象封装到模块中，格式如下：
```
module.exports = function(){
   ...
}
```
例如：
```js
//hello.js
function Hello(){
   var name;
   this.setNamet = function(thyName){
      name = thyName;
   };
   this.sayHello = function(){
      console.log("Hello " + name);
   };
};
module.exports = Hello;
```

这样，就可以直接获得这个对象了：

```js
//main.js
var Hello = require('./hello');
hello = new Hello();
hello.setName('BYvoid');
hello.sayHello();
```

模块接口的唯一变化，是使用 module.exports = Hello 代理了 exports.world = function(){}. 在外部引用该模块时，其接口兑现过就是要输出的 Hello 对象本身，而不是原先的 exports。

### 服务端的模块放在哪里？

我们已经在代码中使用了模块，例如：
```js
var http = require('http');

http.createServer(...);
```

Node.js 自带了一个 http 模块，所以可以在我们的代码中 require 它并返回给一个本地变量。本地变量就成了一个拥有所有 http 模块所提供公共方法的对象。

Node.js 有四类模块：
- 原生模块
- 3种文件模块

尽管 require 方法极其简单，但是内部的加载却是十分复杂的，其加载优先级也各自不同。

Node.js 的require 方法的文件查找策略如下：

<img src="images/nodejs-require.jpeg">

几个要点：
- 有线读取已缓存模块
- 优先原生模块（即便当前目录有同名文件，也不会加载）
- 未缓存的先进行缓存

require方法接受的参数：
- http、fs、path等原生模块
- ./mod或../mode 相对路径的文件模块
- /pathmodule/mod 绝对路径的文件模块
- mod 非原生的文件模块

在路径Y下执行require() 语句执行顺序：

```
1. 如果 X 是内置模块
   a. 返回内置模块
   b. 停止执行
2. 如果 X 以 '/' 开头
   a. 设置 Y 为文件根路径
3. 如果 X 以 './' 或 '/' or '../' 开头
   a. LOAD_AS_FILE(Y + X)
   b. LOAD_AS_DIRECTORY(Y + X)
4. LOAD_NODE_MODULES(X, dirname(Y))
5. 抛出异常 "not found"

LOAD_AS_FILE(X)
1. 如果 X 是一个文件, 将 X 作为 JavaScript 文本载入并停止执行。
2. 如果 X.js 是一个文件, 将 X.js 作为 JavaScript 文本载入并停止执行。
3. 如果 X.json 是一个文件, 解析 X.json 为 JavaScript 对象并停止执行。
4. 如果 X.node 是一个文件, 将 X.node 作为二进制插件载入并停止执行。

LOAD_INDEX(X)
1. 如果 X/index.js 是一个文件,  将 X/index.js 作为 JavaScript 文本载入并停止执行。
2. 如果 X/index.json 是一个文件, 解析 X/index.json 为 JavaScript 对象并停止执行。
3. 如果 X/index.node 是一个文件,  将 X/index.node 作为二进制插件载入并停止执行。

LOAD_AS_DIRECTORY(X)
1. 如果 X/package.json 是一个文件,
   a. 解析 X/package.json, 并查找 "main" 字段。
   b. let M = X + (json main 字段)
   c. LOAD_AS_FILE(M)
   d. LOAD_INDEX(M)
2. LOAD_INDEX(X)

LOAD_NODE_MODULES(X, START)
1. let DIRS=NODE_MODULES_PATHS(START)
2. for each DIR in DIRS:
   a. LOAD_AS_FILE(DIR/X)
   b. LOAD_AS_DIRECTORY(DIR/X)

NODE_MODULES_PATHS(START)
1. let PARTS = path split(START)
2. let I = count of PARTS - 1
3. let DIRS = []
4. while I >= 0,
   a. if PARTS[I] = "node_modules" CONTINUE
   b. DIR = path join(PARTS[0 .. I] + "node_modules")
   c. DIRS = DIRS + DIR
   d. let I = I - 1
5. return DIRS
```

### exports 和 module.exports 

如果要对外暴露属性和方法，就用exports

如果要暴露对象（类似 class），包含了很多属性和方法，就用 module.exports

## Node.js 函数

nodejs中，一个函数可以作为另一函数的参数。

可以先定义函数，然后传递；也可以在传递参数的地方直接定义函数（很常见）。这类似js。

```js
function say(word) {
  console.log(word);
}

function execute(someFunction, value) {
  someFunction(value);
}

execute(say, "Hello");
```

以上代码中，我们把 say 函数作为 execute 函数的第一个变量进行了传递。**这里传递的不是 say 的返回值，而是 say 本身！**

这样一来， say 就变成了execute 中的本地变量 someFunction ，execute 可以通过调用 someFunction() （带括号的形式）来使用 say 函数。

当然，因为 say 有一个变量， execute 在调用 someFunction 时可以传递这样一个变量。

### 匿名函数

我们可以把一个函数作为变量传递。但是我们不一定要绕这个"先定义，再传递"的圈子，我们可以直接在另一个函数的括号中定义和传递这个函数：

```js
function execute(someFunction, value) {
  someFunction(value);
}

execute(function(word){ console.log(word) }, "Hello");

```

我们在 execute 接受第一个参数的地方直接定义了我们准备传递给 execute 的函数。

用这种方式，我们甚至不用给这个函数起名字，这也是为什么它被叫做匿名函数 。

### 函数传递时如何让http服务器工作的？
我们再来看看我们简约而不简单的HTTP服务器：
```js
var http = require("http");

http.createServer(function(request, response) {
  response.writeHead(200, {"Content-Type": "text/plain"});
  response.write("Hello World");
  response.end();
}).listen(8888);
```

上面，我们给createServer 传递了一个匿名函数。它与下面的方法是一样的：
```js

var http = require("http");

function onRequest(request, response) {
  response.writeHead(200, {"Content-Type": "text/plain"});
  response.write("Hello World");
  response.end();
}

http.createServer(onRequest).listen(8888);
```

## Node.js 路由

服务器根据get、post等参数执行相应的代码。

我们需要的所有数据都包含在request对象中，该对象作为 onRequest() 回调函数的第一个参数传递。为解析它，需要url和qureystring两个node.js模块。

url.parse(string).pathname 可以获得域名（端口号）后的路径，但不包含？部分。

url.parse(string).query 可以获得包括？在内的路径后查询整体。

querystring.parse(queryString)["foo"],可以获得查询中key=“foo”对应的值。

querystring.parse()韩可以借些post中的参数。

例如：
```js
//server.js 文件代码：
var http = require("http");
var url = require("url");
 
function start() {
  function onRequest(request, response) {
    var pathname = url.parse(request.url).pathname;
    console.log("Request for " + pathname + " received.");
    response.writeHead(200, {"Content-Type": "text/plain"});
    response.write("Hello World");
    response.end();
  }
 
  http.createServer(onRequest).listen(8888);
  console.log("Server has started.");
}
 
exports.start = start;
```

现在，可以用url路径来区分不同请求了，以url路径为基准映射到处理程序上。

在我们构建的应用中，意味着来自/start和/upload的请求可以使用不同的代码来处理结果。稍后看如何整合。

下面先写一个路由：
```js
//route.js

function route(pathname){
   console.log("About to route a request for " + pathname);
}
exports.route =route;
```

上面代码没做什么事，我们先看如何把route和server整合起来。server应该知道route的存在并利用，但我们不通过硬编码方式绑定到服务器（会很痛苦），我们使用依赖注入方法松散添加路由到server：

```js
//server.js
var http = require('http');
var url = require('url');

function start(route){
   function onRequest(request,response){
      var pathname = url.parse(request.url).pathname;
      console.log("Reuqest for " + pathname + " received.");
      route(pathname);
      response.writeHead(200,{"Content-Type":"text/plain"});
      response.write("Hello World.");
      response.end();
   }
   http.createServer(onRequest).listen(8888);
   console.log("Server has started.");
}

exports.start = start;
```
同时相应地扩展 index.js 使得 route 函数可以被注入到 server 中。

```js

//index.js
var server = require('./server')
var router = require('./router')
server.start(router.route)
```

在这里，我们传递的函数还没做什么具体事。如果现在启动，即 `node index.js` ，随后请求一个url，会看到相应的输出信息。
```
//输出结果
xxx$ node index.js
Server has started.
Reuqest for / received.
About to route a request for /
Reuqest for /favicon.ico received.
About to route a request for /favicon.ico

```
## Node.js 全局变量

JS中有一个特殊对象，成为全局对象，他及所有属性都可以在程序的任何地方访问，及全局变量。

在浏览器JS中，通常 `window` 是全局对象，而 node.js 中的全局变量是 `global` , 其他所有全局变量都是  `global` 对象的属性。

在 Node.js 我们可以直接访问到 global 的属性，而不需要在应用中包含它。

### 全局对象与全局变量

global 最根本的作用是作为全局变量的宿主。按照 ECMAScript 的定义，满足以下条件的变量是全局变量：
- 在最外层定义的变量；
- 全局对象的属性；
- 隐式定义的变量（未定义直接赋值的变量）。

当你定义一个全局变量时，这个变量同时也会成为全局对象的属性，反之亦然。

需要注意的是，在 Node.js 中你不可能在最外层定义变量，因为所有用户代码都是属于当前模块的， 而模块本身不是最外层上下文。

注意： 最好不要使用 var 定义变量以避免引入全局变量，因为全局变量会污染命名空间，提高代码的耦合风险。


### __filename

`__filename` 表示当前正在执行的脚本的文件名。他将输出文件所在的位置的绝对路径，且和命令行参数所指定的文件名不一定相同。 如果在模块中，返回的值是模块文件的路径。

### __dirname
__dirname 表示当前执行脚本所在的目录。

### setTimeout(cb, ms)
setTimeout(cb, ms) 全局函数在指定的毫秒(ms)数后执行指定函数(cb)。：setTimeout() 只执行一次指定函数。

返回一个代表定时器的句柄值。

### clearTimeout(t)
clearTimeout( t ) 全局函数用于停止一个之前通过 setTimeout() 创建的定时器。 参数 t 是通过 setTimeout() 函数创建的定时器。

```js
//创建文件 main.js ，代码如下所示：

function printHello(){
   console.log( "Hello, World!");
}
// 两秒后执行以上函数
var t = setTimeout(printHello, 2000);

// 清除定时器
clearTimeout(t);
//之后，执行 main.js 文件，node main.js
```

### setInterval(cb, ms)
setInterval(cb, ms) 全局函数在指定的毫秒(ms)数后执行指定函数(cb)。

返回一个代表定时器的句柄值。可以使用 clearInterval(t) 函数来清除定时器。

setInterval() 方法会不停地调用函数，直到 clearInterval() 被调用或窗口被关闭。

### console
console 用于提供控制台标准输出，它是由 Internet Explorer 的 JScript 引擎提供的调试工具，后来逐渐成为浏览器的实施标准。

Node.js 沿用了这个标准，提供与习惯行为一致的 console 对象，用于向标准输出流（stdout）或标准错误流（stderr）输出字符。

console 方法
以下为 console 对象的方法:
1  console.log([data][, ...])
向标准输出流打印字符并以换行符结束。该方法接收若干 个参数，如果只有一个参数，则输出这个参数的字符串形式。如果有多个参数，则 以类似于C 语言 printf() 命令的格式输出。
2	console.info([data][, ...])
该命令的作用是返回信息性消息，这个命令与console.log差别并不大，除了在chrome中只会输出文字外，其余的会显示一个蓝色的惊叹号。
3	console.error([data][, ...])
输出错误消息的。控制台在出现错误时会显示是红色的叉子。
4	console.warn([data][, ...])
输出警告消息。控制台出现有黄色的惊叹号。
5	console.dir(obj[, options])
用来对一个对象进行检查（inspect），并以易于阅读和打印的格式显示。
6	console.time(label)
输出时间，表示计时开始。
7	console.timeEnd(label)
结束时间，表示计时结束。
8	console.trace(message[, ...])
当前执行的代码在堆栈中的调用路径，这个测试函数运行很有帮助，只要给想测试的函数里面加入 console.trace 就行了。
9	console.assert(value[, message][, ...])
用于判断某个表达式或变量是否为真，接收两个参数，第一个参数是表达式，第二个参数是字符串。只有当第一个参数为false，才会输出第二个参数，否则不会有任何结果。
console.log()：向标准输出流打印字符并以换行符结束。
console.log 接收若干 个参数，如果只有一个参数，则输出这个参数的字符串形式。如果有多个参数，则 以类似于C 语言 printf() 命令的格式输出。

### process
process 是一个全局变量，即 global 对象的属性。

它用于描述当前Node.js 进程状态的对象，提供了一个与操作系统的简单接口。通常在你写本地命令行程序的时候，少不了要 和它打交道。下面将会介绍 process 对象的一些最常用的成员方法。

1	exit
当进程准备退出时触发。
2	beforeExit
当 node 清空事件循环，并且没有其他安排时触发这个事件。通常来说，当没有进程安排时 node 退出，但是 'beforeExit' 的监听器可以异步调用，这样 node 就会继续执行。
3	uncaughtException
当一个异常冒泡回到事件循环，触发这个事件。如果给异常添加了监视器，默认的操作（打印堆栈跟踪信息并退出）就不会发生。
4	Signal 事件
当进程接收到信号时就触发。信号列表详见标准的 POSIX 信号名，如 SIGINT、SIGUSR1 等。

实例

```js
//main.js
process.on('exit',function(code){
   // 以下代码永远不会执行
   setTimeout(function(){
      console.log("该代码不会执行。");
   },0);
   console.log("退出码为：",code);

});
console.log("程序执行结束");
```


执行 main.js 文件，代码如下所示:
```
$ node main.js
程序执行结束
退出码为: 0
```

#### 退出状态码
退出状态码如下所示：

状态码	名称 & 描述
1	Uncaught Fatal Exception
有未捕获异常，并且没有被域或 uncaughtException 处理函数处理。
2	Unused
保留
3	Internal JavaScript Parse Error
JavaScript的源码启动 Node 进程时引起解析错误。非常罕见，仅会在开发 Node 时才会有。
4	Internal JavaScript Evaluation Failure
JavaScript 的源码启动 Node 进程，评估时返回函数失败。非常罕见，仅会在开发 Node 时才会有。
5	Fatal Error
V8 里致命的不可恢复的错误。通常会打印到 stderr ，内容为： FATAL ERROR
6	Non-function Internal Exception Handler
未捕获异常，内部异常处理函数不知为何设置为on-function，并且不能被调用。
7	Internal Exception Handler Run-Time Failure
未捕获的异常， 并且异常处理函数处理时自己抛出了异常。例如，如果 process.on('uncaughtException') 或 domain.on('error') 抛出了异常。
8	Unused
保留
9	Invalid Argument
可能是给了未知的参数，或者给的参数没有值。
10	Internal JavaScript Run-Time Failure
JavaScript的源码启动 Node 进程时抛出错误，非常罕见，仅会在开发 Node 时才会有。
12	Invalid Debug Argument
设置了参数--debug 和/或 --debug-brk，但是选择了错误端口。
128	Signal Exits
如果 Node 接收到致命信号，比如SIGKILL 或 SIGHUP，那么退出代码就是128 加信号代码。这是标准的 Unix 做法，退出信号代码放在高位。

#### Process 属性
Process 提供了很多有用的属性，便于我们更好的控制系统的交互：

序号.	属性 & 描述
1	stdout
标准输出流。
2	stderr
标准错误流。
3	stdin
标准输入流。
4	argv
argv 属性返回一个数组，由命令行执行脚本时的各个参数组成。它的第一个成员总是node，第二个成员是脚本文件名，其余成员是脚本文件的参数。
5	execPath
返回执行当前脚本的 Node 二进制文件的绝对路径。
6	execArgv
返回一个数组，成员是命令行下执行脚本时，在Node可执行文件与脚本文件之间的命令行参数。
7	env
返回一个对象，成员为当前 shell 的环境变量
8	exitCode
进程退出时的代码，如果进程优通过 process.exit() 退出，不需要指定退出码。
9	version
Node 的版本，比如v0.10.18。
10	versions
一个属性，包含了 node 的版本和依赖.
11	config
一个包含用来编译当前 node 执行文件的 javascript 配置选项的对象。它与运行 ./configure 脚本生成的 "config.gypi" 文件相同。
12	pid
当前进程的进程号。
13	title
进程名，默认值为"node"，可以自定义该值。
14	arch
当前 CPU 的架构：'arm'、'ia32' 或者 'x64'。
15	platform
运行程序所在的平台系统 'darwin', 'freebsd', 'linux', 'sunos' 或 'win32'
16	mainModule
require.main 的备选方法。不同点，如果主模块在运行时改变，require.main可能会继续返回老的模块。可以认为，这两者引用了同一个模块。


```js
//创建文件 main.js ，代码如下所示：

// 输出到终端
process.stdout.write("Hello World!" + "\n");

// 通过参数读取
process.argv.forEach(function(val, index, array) {
   console.log(index + ': ' + val);
});

// 获取执行路径
console.log(process.execPath);


// 平台信息
console.log(process.platform);
```
执行 main.js 文件，代码如下所示:
```
$ node main.js
Hello World!
0: node
1: /web/www/node/main.js
/usr/local/node/0.10.36/bin/node
darwin
```

#### 方法参考手册
Process 提供了很多有用的方法，便于我们更好的控制系统的交互：

序号	方法 & 描述
1	abort()
这将导致 node 触发 abort 事件。会让 node 退出并生成一个核心文件。
2	chdir(directory)
改变当前工作进程的目录，如果操作失败抛出异常。
3	cwd()
返回当前进程的工作目录
4	exit([code])
使用指定的 code 结束进程。如果忽略，将会使用 code 0。
5	getgid()
获取进程的群组标识（参见 getgid(2)）。获取到得时群组的数字 id，而不是名字。
注意：这个函数仅在 POSIX 平台上可用(例如，非Windows 和 Android)。
6	setgid(id)
设置进程的群组标识（参见 setgid(2)）。可以接收数字 ID 或者群组名。如果指定了群组名，会阻塞等待解析为数字 ID 。
注意：这个函数仅在 POSIX 平台上可用(例如，非Windows 和 Android)。
7	getuid()
获取进程的用户标识(参见 getuid(2))。这是数字的用户 id，不是用户名。
注意：这个函数仅在 POSIX 平台上可用(例如，非Windows 和 Android)。
8	setuid(id)
设置进程的用户标识（参见setuid(2)）。接收数字 ID或字符串名字。果指定了群组名，会阻塞等待解析为数字 ID 。
注意：这个函数仅在 POSIX 平台上可用(例如，非Windows 和 Android)。
9	getgroups()
返回进程的群组 iD 数组。POSIX 系统没有保证一定有，但是 node.js 保证有。
注意：这个函数仅在 POSIX 平台上可用(例如，非Windows 和 Android)。
10	setgroups(groups)
设置进程的群组 ID。这是授权操作，所以你需要有 root 权限，或者有 CAP_SETGID 能力。
注意：这个函数仅在 POSIX 平台上可用(例如，非Windows 和 Android)。
11	initgroups(user, extra_group)
读取 /etc/group ，并初始化群组访问列表，使用成员所在的所有群组。这是授权操作，所以你需要有 root 权限，或者有 CAP_SETGID 能力。
注意：这个函数仅在 POSIX 平台上可用(例如，非Windows 和 Android)。
12	kill(pid[, signal])
发送信号给进程. pid 是进程id，并且 signal 是发送的信号的字符串描述。信号名是字符串，比如 'SIGINT' 或 'SIGHUP'。如果忽略，信号会是 'SIGTERM'。
13	memoryUsage()
返回一个对象，描述了 Node 进程所用的内存状况，单位为字节。
14	nextTick(callback)
一旦当前事件循环结束，调用回调函数。
15	umask([mask])
设置或读取进程文件的掩码。子进程从父进程继承掩码。如果mask 参数有效，返回旧的掩码。否则，返回当前掩码。
16	uptime()
返回 Node 已经运行的秒数。
17	hrtime()
返回当前进程的高分辨时间，形式为 [seconds, nanoseconds]数组。它是相对于过去的任意事件。该值与日期无关，因此不受时钟漂移的影响。主要用途是可以通过精确的时间间隔，来衡量程序的性能。
你可以将之前的结果传递给当前的 process.hrtime() ，会返回两者间的时间差，用来基准和测量时间间隔。

## node.js 常用工具

util 也是一个node.js 核心模块，提供常用函数的集合，弥补核心js的功能不足。

使用方法：`const util = require('util');`

### util.callbackify
util.callbackify(original) 将 async 异步函数（或者一个返回值为 Promise 的函数）转换成遵循异常优先的回调风格的函数，例如将 (err, value) => ... 回调作为最后一个参数。 在回调函数中，第一个参数为拒绝的原因（如果 Promise 解决，则为 null），第二个参数则是解决的值。

```js
实例
const util = require('util');

async function fn() {
  return 'hello world';
}
const callbackFunction = util.callbackify(fn);

callbackFunction((err, ret) => {
  if (err) throw err;
  console.log(ret);
});
```
以上代码的输出结果为：
hello world


回调函数是异步执行的，并且有异常堆栈错误追踪。 如果回调函数抛出一个异常，进程会触发一个 'uncaughtException' 异常，如果没有被捕获，进程将会退出。

null 在回调函数中作为一个参数有其特殊的意义，如果回调函数的首个参数为 Promise 拒绝的原因且带有返回值，且值可以转换成布尔值 false，这个值会被封装在 Error 对象里，可以通过属性 reason 获取。

```js
function fn() {
  return Promise.reject(null);
}
const callbackFunction = util.callbackify(fn);

callbackFunction((err, ret) => {
  // 当 Promise 被以 `null` 拒绝时，它被包装为 Error 并且原始值存储在 `reason` 中。
  err && err.hasOwnProperty('reason') && err.reason === null;  // true
});
```
### util.inherits

util.inherits(constructor, superConstructor) 是一个实现对象间原型继承的函数。

JavaScript 的面向对象特性是基于原型的，与常见的基于类的不同。JavaScript 没有提供对象继承的语言级别特性，而是通过原型复制来实现的。

在这里我们只介绍 util.inherits 的用法，示例如下：

略

### util.inspect
util.inspect(object,[showHidden],[depth],[colors]) 是一个将任意对象转换 为字符串的方法，通常用于调试和错误输出。它至少接受一个参数 object，即要转换的对象。

showHidden 是一个可选参数，如果值为 true，将会输出更多隐藏信息。

depth 表示最大递归的层数，如果对象很复杂，你可以指定层数以控制输出信息的多 少。如果不指定depth，默认会递归 2 层，指定为 null 表示将不限递归层数完整遍历对象。 如果 colors 值为 true，输出格式将会以 ANSI 颜色编码，通常用于在终端显示更漂亮 的效果。

特别要指出的是，util.inspect 并不会简单地直接把对象转换为字符串，即使该对 象定义了 toString 方法也不会调用。

### util.isArray(object)
如果给定的参数 "object" 是一个数组返回 true，否则返回 false。
### util.isRegExp(object)
如果给定的参数 "object" 是一个正则表达式返回true，否则返回false。




### Promise
ECMAscript 6 原生提供了Promise 对象。Promise对象代表了将来要发生的事件，用来传递异步操作的消息。

Promise 对象有两个特点：
- 对象的状态不受外界影响。Promise对象代表一个异步操作，有三种状态：
  - pending ：初始状态，不是成功或失败
  - fulfilled：意味着操作成功完成。
  - rejected：意味着操作失败。
- 一旦状态改变，就不会再变，任何时候都可以得到这个结果。
  - Promise对象的改变，只有两种可能：
    - 从 pending 到 resolved
    - 从 pending 到 rejected
  - 只要上述情况发生，状态就凝固了，不会在变了，一直保持这个结果。这与事件不同，事件可以后续再改变状态。

只有异步操作的结果可以决定当前是哪一种状态，任何其他操作都无法改变这个状态，这也是Promise的名字由来。它的英语意思就是「承诺」，表示其他手段无法改变。

#### Promise 优缺点
有了 Promise 对象，就可以将异步操作以同步操作的流程表达出来，避免了层层嵌套的回调函数。此外，Promise 对象提供统一的接口，使得控制异步操作更加容易。

Promise 也有一些缺点。
- 首先，无法取消 Promise，一旦新建它就会立即执行，无法中途取消。
- 其次，如果不设置回调函数，Promise 内部抛出的错误，不会反应到外部。
- 第三，当处于 Pending 状态时，无法得知目前进展到哪一个阶段（刚刚开始还是即将完成）。

#### Promise 创建
要想创建一个 promise 对象、可以使用 new 来调用 Promise 的构造器来进行实例化。

下面是创建 promise 的步骤：
```
var promise = new Promise(function(resolve, reject) {
    // 异步处理
    // 处理结束后、调用resolve 或 reject
});
```
Promise 构造函数包含一个参数和一个带有 resolve（解析）和 reject（拒绝）两个参数的回调。在回调中执行一些操作（例如异步），如果一切都正常，则调用 resolve，否则调用 reject。

```js
var myFirstPromise = new Promise(function(resolve, reject){
    //当异步代码执行成功时，我们才会调用resolve(...), 当异步代码失败时就会调用reject(...)
    //在本例中，我们使用setTimeout(...)来模拟异步代码，实际编码时可能是XHR请求或是HTML5的一些API方法.
    setTimeout(function(){
        resolve("成功!"); //代码正常执行！
    }, 250);
});
 
myFirstPromise.then(function(successMessage){
    //successMessage的值是上面调用resolve(...)方法传入的值.
    //successMessage参数不一定非要是字符串类型，这里只是举个例子
    document.write("Yay! " + successMessage);
});
```

对于已经实例化过的 promise 对象可以调用 promise.then() 方法，传递 resolve 和 reject 方法作为回调。

promise.then() 是 promise 最为常用的方法。

`promise.then(onFulfilled, onRejected)`

promise简化了对error的处理，上面的代码我们也可以这样写：

`promise.then(onFulfilled).catch(onRejected)`

#### Promise Ajax
下面是一个用 Promise 对象实现的 Ajax 操作的例子。

实例
```js
function ajax(URL) {
    return new Promise(function (resolve, reject) {
        var req = new XMLHttpRequest(); 
        req.open('GET', URL, true);
        req.onload = function () {
        if (req.status === 200) { 
                resolve(req.responseText);
            } else {
                reject(new Error(req.statusText));
            } 
        };
        req.onerror = function () {
            reject(new Error(req.statusText));
        };
        req.send(); 
    });
}
var URL = "/try/ajax/testpromise.php"; 
ajax(URL).then(function onFulfilled(value){
    document.write('内容是：' + value); 
}).catch(function onRejected(error){
    document.write('错误：' + error); 
});
```


上面代码中，resolve 方法和 reject 方法调用时，都带有参数。它们的参数会被传递给回调函数。reject 方法的参数通常是 Error 对象的实例，而 resolve 方法的参数除了正常的值以外，还可能是另一个 Promise 实例，比如像下面这样。
```
var p1 = new Promise(function(resolve, reject){
  // ... some code
});
 
var p2 = new Promise(function(resolve, reject){
  // ... some code
  resolve(p1);
})
```
上面代码中，p1 和 p2 都是 Promise 的实例，但是 p2 的 resolve 方法将 p1 作为参数，这时 p1 的状态就会传递给 p2。如果调用的时候，p1 的状态是 pending，那么 p2 的回调函数就会等待 p1 的状态改变；如果 p1 的状态已经是 fulfilled 或者 rejected，那么 p2 的回调函数将会立刻执行。

#### Promise.prototype.then方法：链式操作
Promise.prototype.then 方法返回的是一个新的 Promise 对象，因此可以采用链式写法。

getJSON("/posts.json").then(function(json) {
  return json.post;
}).then(function(post) {
  // proceed
});
上面的代码使用 then 方法，依次指定了两个回调函数。第一个回调函数完成以后，会将返回结果作为参数，传入第二个回调函数。

如果前一个回调函数返回的是Promise对象，这时后一个回调函数就会等待该Promise对象有了运行结果，才会进一步调用。

getJSON("/post/1.json").then(function(post) {
  return getJSON(post.commentURL);
}).then(function(comments) {
  // 对comments进行处理
});
这种设计使得嵌套的异步操作，可以被很容易得改写，从回调函数的"横向发展"改为"向下发展"。

#### Promise.prototype.catch方法：捕捉错误
Promise.prototype.catch 方法是 Promise.prototype.then(null, rejection) 的别名，用于指定发生错误时的回调函数。

getJSON("/posts.json").then(function(posts) {
  // some code
}).catch(function(error) {
  // 处理前一个回调函数运行时发生的错误
  console.log('发生错误！', error);
});
Promise 对象的错误具有"冒泡"性质，会一直向后传递，直到被捕获为止。也就是说，错误总是会被下一个 catch 语句捕获。

getJSON("/post/1.json").then(function(post) {
  return getJSON(post.commentURL);
}).then(function(comments) {
  // some code
}).catch(function(error) {
  // 处理前两个回调函数的错误
});
Promise.all方法，Promise.race方法
Promise.all 方法用于将多个 Promise 实例，包装成一个新的 Promise 实例。

var p = Promise.all([p1,p2,p3]);
上面代码中，Promise.all 方法接受一个数组作为参数，p1、p2、p3 都是 Promise 对象的实例。（Promise.all 方法的参数不一定是数组，但是必须具有 iterator 接口，且返回的每个成员都是 Promise 实例。）

p 的状态由 p1、p2、p3 决定，分成两种情况。

（1）只有p1、p2、p3的状态都变成fulfilled，p的状态才会变成fulfilled，此时p1、p2、p3的返回值组成一个数组，传递给p的回调函数。
（2）只要p1、p2、p3之中有一个被rejected，p的状态就变成rejected，此时第一个被reject的实例的返回值，会传递给p的回调函数。
下面是一个具体的例子。

// 生成一个Promise对象的数组
var promises = [2, 3, 5, 7, 11, 13].map(function(id){
  return getJSON("/post/" + id + ".json");
});
 
Promise.all(promises).then(function(posts) {
  // ...  
}).catch(function(reason){
  // ...
});
Promise.race 方法同样是将多个 Promise 实例，包装成一个新的 Promise 实例。

var p = Promise.race([p1,p2,p3]);
上面代码中，只要p1、p2、p3之中有一个实例率先改变状态，p的状态就跟着改变。那个率先改变的Promise实例的返回值，就传递给p的返回值。

如果Promise.all方法和Promise.race方法的参数，不是Promise实例，就会先调用下面讲到的Promise.resolve方法，将参数转为Promise实例，再进一步处理。

#### Promise.resolve 方法，Promise.reject 方法
有时需要将现有对象转为Promise对象，Promise.resolve方法就起到这个作用。

var jsPromise = Promise.resolve($.ajax('/whatever.json'));
上面代码将 jQuery 生成 deferred 对象，转为一个新的 ES6 的 Promise 对象。

如果 Promise.resolve 方法的参数，不是具有 then 方法的对象（又称 thenable 对象），则返回一个新的 Promise 对象，且它的状态为fulfilled。

var p = Promise.resolve('Hello');
 
p.then(function (s){
  console.log(s)
});
// Hello
上面代码生成一个新的Promise对象的实例p，它的状态为fulfilled，所以回调函数会立即执行，Promise.resolve方法的参数就是回调函数的参数。

如果Promise.resolve方法的参数是一个Promise对象的实例，则会被原封不动地返回。

Promise.reject(reason)方法也会返回一个新的Promise实例，该实例的状态为rejected。Promise.reject方法的参数reason，会被传递给实例的回调函数。

var p = Promise.reject('出错了');
 
p.then(null, function (s){
  console.log(s)
});
// 出错了
上面代码生成一个Promise对象的实例，状态为rejected，回调函数会立即执行。


## Node.js 文件系统
Node.js 提供一组类似 UNIX（POSIX）标准的文件操作API。 Node 导入文件系统模块(fs)语法如下所示：

`var fs = require("fs")`

>可移植操作系统接口（英语：Portable Operating System Interface，缩写为POSIX）是IEEE为要在各种UNIX操作系统上运行软件，而定义API的一系列互相关联的标准的总称，其正式称呼为IEEE Std 1003，而国际标准名称为ISO/IEC 9945。此标准源于一个大约开始于1985年的项目。POSIX这个名称是由理查德·斯托曼（RMS）应IEEE的要求而提议的一个易于记忆的名称。它基本上是Portable Operating System Interface（可移植操作系统接口）的缩写，而X则表明其对Unix API的传承。
> Linux基本上逐步实现了POSIX兼容，但并没有参加正式的POSIX认证。微软的Windows NT声称部分实现了POSIX标准。
> 当前的POSIX主要分为四个部分：Base Definitions、System Interfaces、Shell and Utilities和Rationale。 [1] 


### 异步和同步
Node.js 文件系统（fs 模块）模块中的方法均有异步和同步版本，例如读取文件内容的函数有异步的 fs.readFile() 和同步的 fs.readFileSync()。

异步的方法函数最后一个参数为回调函数，回调函数的第一个参数包含了错误信息(error)。

建议大家使用异步方法，比起同步，异步方法性能更高，速度更快，而且没有阻塞。

#### 打开文件
语法
以下为在异步模式下打开文件的语法格式：

`fs.open(path, flags[, mode], callback)`

#### 获取文件信息
语法
以下为通过异步模式获取文件信息的语法格式：

`fs.stat(path, callback)`

#### 写入文件
语法
以下为异步模式下写入文件的语法格式：

`fs.writeFile(file, data[, options], callback)`

#### 读取文件
语法
以下为异步模式下读取文件的语法格式：

fs.read(fd, buffer, offset, length, position, callback)

#### 关闭文件
语法
以下为异步模式下关闭文件的语法格式：

fs.close(fd, callback)

#### 截取文件
语法
以下为异步模式下截取文件的语法格式：

fs.ftruncate(fd, len, callback)

#### 删除文件
语法
以下为删除文件的语法格式：

fs.unlink(path, callback)

#### 创建目录
语法
以下为创建目录的语法格式：

fs.mkdir(path[, options], callback)

#### 读取目录
语法
以下为读取目录的语法格式：

fs.readdir(path, callback)

#### 删除目录
语法
以下为删除目录的语法格式：

fs.rmdir(path, callback)

## Node.js RESTful API
什么是 REST？
REST即表述性状态传递（英文：Representational State Transfer，简称REST）是Roy Fielding博士在2000年他的博士论文中提出来的一种软件架构风格。

表述性状态转移是一组架构约束条件和原则。满足这些约束条件和原则的应用程序或设计就是RESTful。需要注意的是，REST是设计风格而不是标准。REST通常基于使用HTTP，URI，和XML（标准通用标记语言下的一个子集）以及HTML（标准通用标记语言下的一个应用）这些现有的广泛流行的协议和标准。REST 通常使用 JSON 数据格式。

### HTTP 方法
以下为 REST 基本架构的四个方法：
GET - 用于获取数据。

PUT - 用于更新或添加数据。

DELETE - 用于删除数据。

POST - 用于添加数据。

### RESTful Web Services
Web service是一个平台独立的，低耦合的，自包含的、基于可编程的web的应用程序，可使用开放的XML（标准通用标记语言下的一个子集）标准来描述、发布、发现、协调和配置这些应用程序，用于开发分布式的互操作的应用程序。

基于 REST 架构的 Web Services 即是 RESTful。

由于轻量级以及通过 HTTP 直接传输数据的特性，Web 服务的 RESTful 方法已经成为最常见的替代方法。可以使用各种语言（比如 Java 程序、Perl、Ruby、Python、PHP 和 Javascript[包括 Ajax]）实现客户端。

RESTful Web 服务通常可以通过自动客户端或代表用户的应用程序访问。但是，这种服务的简便性让用户能够与之直接交互，使用它们的 Web 浏览器构建一个 GET URL 并读取返回的内容。

### 创建 RESTful

首先，创建一个json数据资源文件 user.json:
```json
{
   "user1" : {
      "name" : "mahesh",
      "password" : "password1",
      "profession" : "teacher",
      "id": 1
   },
   "user2" : {
      "name" : "suresh",
      "password" : "password2",
      "profession" : "librarian",
      "id": 2
   },
   "user3" : {
      "name" : "ramesh",
      "password" : "password3",
      "profession" : "clerk",
      "id": 3
   }
}

```

基于以上数据，我们创建以下 RESTful API：

序号	URI	HTTP 方法	发送内容	结果
1	listUsers	GET	空	显示所有用户列表
2	addUser	POST	JSON 字符串	添加新用户
3	deleteUser	DELETE	JSON 字符串	删除用户
4	:id	GET	空	显示用户详细信息
获取用户列表：
以下代码，我们创建了 RESTful API listUsers，用于读取用户的信息列表， server.js 文件代码如下所示：

var express = require('express');
var app = express();
var fs = require("fs");

app.get('/listUsers', function (req, res) {
   fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, data) {
       console.log( data );
       res.end( data );
   });
})

var server = app.listen(8081, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("应用实例，访问地址为 http://%s:%s", host, port)

})
接下来执行以下命令：

$ node server.js 
应用实例，访问地址为 http://0.0.0.0:8081
在浏览器中访问 http://127.0.0.1:8081/listUsers，结果如下所示：

{
   "user1" : {
      "name" : "mahesh",
      "password" : "password1",
      "profession" : "teacher",
      "id": 1
   },
   "user2" : {
      "name" : "suresh",
      "password" : "password2",
      "profession" : "librarian",
      "id": 2
   },
   "user3" : {
      "name" : "ramesh",
      "password" : "password3",
      "profession" : "clerk",
      "id": 3
   }
}