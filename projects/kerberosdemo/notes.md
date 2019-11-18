# Python module: socketserver

socketserver in Lib/socketserver.py

## 4个同步处理请求的实体类

这个模块有4个具体服务器类：
- TCPServer(server_address, RequestHandlerClass, bind_and_activate=True)
- UDPServer(server_address, RequestHandlerClass, bind_and_activate=True)
- UnixStreamServer(server_address, RequestHandlerClass, bind_and_activate=True)
- UnixDatagramServer(server_address, RequestHandlerClass, bind_and_activate=True)
  
它们都采用同步方式处理请求，每个请求必须在下一个请求开始前被完成。

它们不适于处理每个请求需要很长时间才能完成的情况，这些“长期请求”可能是因为它要求更多的计算，或是因为它返回过多的数据，而客户端处理能力过慢。针对这一问题的解决方案是为每个请求生成一个单独的进程或线程，这种处理可以参考ForkingMixIn 和 ThreadingMixIn 两个mix-in 类，它们俩能处理异步行为。

### TCPServer 类

socketserver.TCPServer(server_address, RequestHandlerClass, bind_and_activate=True)

继承自BaseServer。用于Internet TCP 协议，提供了client 和 server端的连续数据流通信。
  
如果其属性 ```bind_and_activate = True```，构造器自动尝试调用```server_bind()``` 和```server_activate()```

其他参数，传递给基类 BaseServer。

### UDPServer 类

socketserver.UDPServer(server_address, RequestHandlerClass, bind_and_activate=True)

继承自BaseServer，用于数据报通信（UDP），即一些离散的数据包，没有顺序，可能丢失。

参数同TCPServer。

### UnixStreamServer 类 和 UnixDatagramServer类

分别继承自 TCPServer 和 UDPServer 。这两个类很少用，与TCPServer 和 UDPServer类似，但用于Unix域中的sockets。

### Server 生成步骤

生成一个 server，要求以下步骤：

- 1.必须先通过生成一个 BaseRequestHandler 类的子类，来生成一个request handler类，并且重载（override）它的 handle() 方法，这个方法将处理入站请求；
- 2.必须生成某个服务器类的实例对象，传递给它服务器地址和request handler类。推荐在with语句种使用server；
- 3.调用服务器对象的 handle_request() 或 serve_forever() 方法，来处理一个或多个请求；
- 4.最后，调用 server_close() 方法来结束这个socket，如果在with语句种使用server，就不必显示调用这个函数了。

### 线程化

如果继承了 ThreadingMinin 类来实现线程化连接行为，你需要显示声明当发生突然关闭时的线程的行为。

ThreadingMinin 类定义了一个属性：daemon_threads。它指示着是否服务器将等待线程结束。如果你希望线程有自主地行为，你应该显示设置这个标志。它默认是False，意思是直到所有由ThreadingMinin 生成的线程退出时，这个服务器才退出。

这些类有同样的外部方法和属性，无论是为那种协议实现的。


## 异步处理请求的类

- class socketserver.ForkingMixIn
- class socketserver.ThreadingMixIn

使用这两个Min-in类，可以生成 forking 或 threading 版本的服务器。

例如：
```
class ThreadingUDPServer(ThreadingMixIn, UDPServer):
    pass
```
Min-in类必须放在继承的第一位置，因为它重载了一个服务器类的方法。

下面提到的 ForkingMixIn 和 the Forking 类，仅在支持fork()方法的POSIX 平台上可用：
- socketserver.ForkingMixIn.server_close() ，等所有子进程都完毕时才结束，除非socketserver.ForkingMixIn.block_on_close 属性为 false.
- socketserver.ThreadingMixIn.server_close() 等到所有非daemon线程结束才关闭服务器，除非socketserver.ThreadingMixIn.block_on_close 属性为 false.通过设置ThreadingMixIn.daemon_threads 为 True来使用 daemonic 的线程，可以不用等到所有线程结束就结束。

下面这些类都使用了 mix-in类被预定义在socketserver 模块中：
- class socketserver.ForkingTCPServer
- class socketserver.ForkingUDPServer
- class socketserver.ThreadingTCPServer
- class socketserver.ThreadingUDPServer

### 应用

为实现一个服务，你必须继承BaseRequestHandler生成一个类，并重定义 handle() 方法.

你可以将你的request handler类与某个服务器类结合，这样来运行各种版本的服务。

Request handler类必须区分数据报或流服务（datagram or stream services）。可以使用该 hanlder的子类 StreamRequestHandler or DatagramRequestHandler来隐式区分。

### 注意

如果服务在内存中包含着可被不同请求修改的状态，那么使用一个 forking 服务器就是没有意义的。因为在子进程中的修改，不能影响在父进程中的初始状态，而且不能传递给其他子进程。此时，你可以使用一个 threading server，但你可能不得不使用锁来保护共享数据的完整性。

另一方面，如果你建立一个HTTP server，其所有数据存储在外部，例如一个文件系统中。那么当一个“长期”请求正在被处理时，同步类将基本上将使服务变得像个聋子。这里一个threading 或 forking 服务器将是正确选择。

有些情况下，同步处理部分请求可能是合适或需要的，但要在一个forked子服务中完成操作取决于请求数据。这可能要在request handler类的handle()方法中，使用一个同步服务器并且完成一个显示的fork来实现。

Another approach to handling multiple simultaneous requests in an environment that supports neither threads nor fork() (or where these are too expensive or inappropriate for the service) is to maintain an explicit table of partially finished requests and to use selectors to decide which request to work on next (or whether to handle a new incoming request). This is particularly important for stream services where each client can potentially be connected for a long time (if threads or subprocesses cannot be used). See asyncore for another way to manage this.

