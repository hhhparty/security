# SOCAT

SOCAT 是一种用于linux的多用途转发工具（ relay tool）。

如果你需要一个高级的sysadmin 工具，那么socat就是一种，它允许两个位置（两种不相关数据信道）的双向数据传输。

socat 能够连接多种类型的信道，包括：
- 文件间
- 管道间 pipes
- 设备间
- sockets
- SSL sockets
- Proxy CONNEXT connections
- 文件描述符间（ stdin，etc）
- GNU 行编辑器（readline）
- programs
- 上述的任意两种

可以看 socat 是 netcat的高级版本，他们做相同的事情，但 socat 有更多复杂功能，例如允许多个客户端监听在同一个端口或重用连接。



## 应用场景（Why do we need socat？）

- TCP 端口转发 （one-shot or daemon)
- 额外的socksifier
- 攻击弱防火墙的工具
- Unix sockets 的 shell 接口
- IP6 转发
- 重定向 面向TCP程序到一个串行线路
- 在不同计算机上逻辑连接串行线路
- 为有网络连接的、运行中的客户端或服务器shell脚本，建立相对的安全环境（su 和 chroot）


## socat 实例的生命周期

通常socat实例的生命周期由4个阶段组成：
- Init 阶段：命令行选项被解析，并且日志系统被初始化。
- Open 阶段：socat 打开第一个地址，随后打开第二个地址。这些步骤通常是阻塞的，这样的话，特别是对于复杂地址类型（例如socks），连接请求或认证对话必须在下一步开始前完成。
- Transfer 阶段：socat 观察两个地址的流的读，并经过select()写文件描述符，并且，当数据在一侧可获得且可以被写到另一侧时，socat 读取它，并按需执行新一行字符转换，然后写数据到另一个流的写文件描述符，然后继续等待连接两侧的更多的数据。
- Close 阶段：当某个流遇到 EOF，则进入结束阶段。socat 传输 EOF 条件到另一流，例如：尝试关闭仅有的写流，给他一个优雅结束的机会。对于一个有timeout定时选项的socat实例，它将在timeout间隔期间继续传输数据在另一个方向，然后时间到了会结束所有剩下的信道并终止。如果等待期间遇到新的EOF，那就直接结束。


## 使用方法

socat 使用语法：
`socat [options] <address>  <address>`

说明：
- 地址不区分源或目的，因为 socat 建立的是双向的连接，一个地址代表一个字节流，理论上可读可写，但可能受限于具体的情况。
- 地址组成：1个地址类型keyword、0或多个要求的地址参数（使用冒号与keword间隔）、0或多个地址选项（使用逗号（,）区分）
- 地址类型keyword，指示了地址类型，例如 tcp4、open、exec等。有些keywords存在同义词，例如：`-` for STDIO，TCP for TCP4。keywords 是大小写不敏感的。对于一些特别的地址类型，keyword 可以省略，即地址以一个数字开头的被认为是FD（原始文件描述符）地址；如果是一个在第一个冒号或第一个逗号前的 `/` ，意味着 GOPEN（通用文件open）。
- 后面要求的数字和地址类型参数，取决于地址类型。例如：tcp4要求一个服务器规范（名字或地址）和端口规范（数字或服务名）。
- 0或多个地址选项，可能由每个地址给出。他们以某种方式影响着地址。选项由一个选项关键字或一个关键字加一个数字构成（使用等号=分割）。选项关键字是大小写无关的。为了过滤选项，每个选项是一个可选组的数字。
- 遵循上面规范的地址，成为单一地址规范。两个单一地址可以使用`!!`结合，形成一个信道的双类型地址。第一个地址用于读取数据，第二个地址用于写数据。

- 通常，地址以读/写模式打开，使用 -u或-U仅限制单向。

- 如果地址用`-` ，则表示 STDIO ，例如：`socat - TCP4:www.example.com:80` ，在STDIO 和TCP4 间建立连接

### 地址类型

####  `CREATE:<filename>` 

带creat() 的打开文件名，并使用这个文件描述用于写。这个地址类型要求只写上下文，因为一个有create的打开文件不能从其中读数据。filename 必须是有效的已存在或不存在路径。如果文件描述符是一个命名管道，那么create（）可能阻塞；如果文件名指定了一个socket ，将报告错误。

选项组：
- FD
- REG
- NAMED

有用的选项：
- mode
- user
- group
- unlink-early
- unlink-late
- append

#### EXEC：命令行

forks 一个子


### 示例：
- 建立标准输出与TCP4某个80服务之间的连接: `socat - TCP4:www.example.com:80`
- 用作 TCP 端口转发器 `socat TCP4-LISTEN:81 TCP4:192.168.1.10:80`。这里是将后面地址转发给81端口，这样访问81端口就可获得80的服务信息。
- 多连接使用fork 选项：`socat TCP4-LISTEN:81,fork , reuseaddr TCP4:TCP4:192.168.1.10:80`。这个例子使用 81 端口同时监听两个端口：（1）本地80和（2）远程192.168.1.10：80两个端口。


- 将可读文件输出到STDIO: `socat ./1.txt -` 或 `socat - ./1.txt`
- 将文件写入只写文件2.txt : `socat -u - ./1.txt` -u 表示单向

- 监听一个端口：`socat tcp-listen:localhost:2222  -` 你可以使用 `telnet localhost 2222`  然后就可以相互发数据了

## 实用用例

Socat 是一个很好的问题定位工具，很容易上手使用连接远程连接。实际上，我们使用socat可以连接mysql连接。下面显示一下连接web应用到远程mysql服务的例子，这个例子通过本地socket连接。

1.在远程mysql server 上，键入：
`socat tcp-listen:3307,reuseaddr,fork UNIX-CONNECT:/var/lib/mysql/mysql.sock &`

这个命令用socat 监听 3307端口。

2.在本地webserver，键入：
`socat UNIX-LISTEN:/var/lib/mysql/mysql.sock,fork,reuseaddr,unlink-early,user=mysql,group=mysql,mode=777 TCP:192.168.100.5:3307 &`

上面的命令连接了远程服务器 192.168.100.5：3307.

然而所有的通信将在unix socket /var/lib/mysql/mysql.sock上完成，并且它会出现在本地服务器上。


## references
- [EXAMPLES](http://www.dest-unreach.org/socat/doc/socat.html#EXAMPLES)
- [Getting started with socat](https://www.redhat.com/sysadmin/getting-started-socat)