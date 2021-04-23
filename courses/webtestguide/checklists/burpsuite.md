# BurpSuite cheatsheet

> 内容取自：https://t0data.gitbooks.io/burpsuite
## 启动
- 原版启动
`java -jar /your_burpsuite_path/burpSuite.jar`

- cracked 启动

`java -noverify -javaagent:/opt/burpsuite2020/Burploader2020_x.jar -jar /opt/burpsuite2020/Burpsuite_Pro_v2020.6.jar`

- 设置JVM大小

`java -jar -Xmx2048M  /your_burpsuite_path/burpsuite.jar`

### 支持ipv6
Burp Suite是不支持IPv6地址进行数据通信的，这时在cmd控制台里就会抛出如下异常

java.net.SocketException: Permission denied
同时，浏览器访问时，也会出现异常

Burp proxy error: Permission denied: connect
当出现如上问题时，我们需要修改启动脚本，添加对IPv4的指定后，重启Burp Suite即可。

`java -jar -Xmx2048M  -Djava.net.preferIPv4Stack=true  /your_burpsuite_path/burpsuite.jar`
通过 -Djava.net.preferIPv4Stack=true参数的设置，告诉Java运行环境，使用IPv4协议栈进行数据通信，IPv6协议将会被禁止使用。 这个错误最常见于64位的windows操作系统上，使用了32位的JDK

## Burp Suite代理和浏览器设置
略
## 使用BurpSuite代理
Burp Proxy 是Burp Suite以用户驱动测试流程功能的核心，通过代理模式，可以让我们拦截、查看、修改所有在客户端和服务端之间传输的数据。

默认情况下，Burp Proxy只拦截请求的消息，普通文件请求如css、js、图片是不会被拦截的，你可以修改默认的拦截选项来拦截这些静态文件，当然，你也可以通过修改拦截的作用域、参数或者服务器端返回的关键字来控制Burp Proxy的消息拦截。

所有流经Burp Proxy的消息，都会在http history记录下来，我们可以通过历史选项卡，查看传输的数据内容，对交互的数据进行测试和验证。同时，对于拦截到的消息和历史消息，都可以通过右击弹出菜单，发送到Burp的其他组件，如Spider、Scanner、Repeater、Intruder、Sequencer、Decoder、Comparer、Extender，进行进一步的测试。

Burp Proxy的拦截功能主要由Intercept选项卡中的Forward、Drop、Interception is on/off、Action、Comment 以及Highlight构成，它们的功能分别是： Forward的功能是当你查看过消息或者重新编辑过消息之后，点击此按钮，将发送消息至服务器端。 Drop的功能是你想丢失当前拦截的消息，不再forward到服务器端。 Interception is on表示拦截功能打开，拦截所有通过Burp Proxy的请求数据；Interception is off表示拦截功能关闭，不再拦截通过Burp Proxy的所有请求数据。 Action的功能是除了将当前请求的消息传递到Spider、Scanner、Repeater、Intruder、Sequencer、Decoder、Comparer组件外，还可以做一些请求消息的修改，如改变GET或者POST请求方式、改变请求body的编码，同时也可以改变请求消息的拦截设置，如不再拦截此主机的消息、不再拦截此IP地址的消息、不再拦截此种文件类型的消息、不再拦截此目录的消息，也可以指定针对此消息拦截它的服务器端返回消息。

### 可选项配置Options
当我们打开可选项设置选项卡Options，从界面显示来看，主要包括以下几大板块:

#### 客户端请求消息拦截
拦截规则添加时，共包含4个输入项。Boolean opertor表示当前的规则与其他规则是与的方式（And）还是或的方式（Or）共存；Match type表示匹配类型，此处匹配类型可以基于域名、IP地址、协议、请求方法、URL、文件类型、参数, cookies, 头部或者内容, 状态码, MIME类型, HTML页面的title等。Match relationship表示此条规则是匹配还是不匹配Match condition输入的关键字。当我们输入这些信息，点击【OK】按钮，则规则即被保存。

如果Automatically fix missing的checkbox被选中，则表示在一次消息传输中，Burp Suite会自动修复丢失或多余的新行。比如说，一条被修改过的请求消息，如果丢失了头部结束的空行，Burp Suite会自动添加上；如果一次请求的消息体中，URl编码参数中包含任何新的换行，Burp Suite将会移除。此项功能在手工修改请求消息时，为了防止错误，有很好的保护效果。

如果Automatically update Content-Length的checkbox被选中，则当请求的消息被修改后，Content-Length消息头部也会自动被修改，替换为与之相对应的值。

#### 服务器端返回消息拦截
#### 服务器返回消息修改
服务器返回消息修改是指自动修改服务器端返回消息的相关设置项:
显示form表单中隐藏字段
高亮显示form表单中隐藏字段
使form表单中的disable字段生效，变成可输入域
移除输入域长度限制
移动JavaScript验证
移动所有的JavaScript
移除标签
转换https超链接为http链接
移除所有cookie中的安全标志
#### 正则表达式配置
此项配置主要用来自动替换请求消息和服务器端返回消息中的某些值和文本，它与前文的规则的不同之处还在于支持正则表达式语言。
#### 其他配置项

自上而下依次的功能是

指定使用HTTP/1.0协议与服务器进行通信 这项设置用于强制客户端采用HTTP/1.0协议与服务器进行通信，一般客户端使用的HTTP协议版本依赖于客户端浏览器，但某些服务器或者应用，必须使用HTTP/1.0协议，此时可勾选此项

指定使用HTTP/1.0协议反馈消息给客户端 目前所有的浏览器均支持HTTP/1.0协议和HTTP/1.1协议，强制指定HTTP/1.0协议主要用于显示浏览器的某些方面的特征，比如，阻止HTTP管道攻击。

设置返回消息头中的“Connection：close” 可用于某些情况下的阻止HTTP管道攻击。

请求消息头中脱掉Proxy-* 浏览器请求消息中，通常会携带代理服务器的相关信息，此选项主要用于清除消息头中的代理服务器信息。

解压请求消息中的压缩文件 某些应用在与服务器端进行交互时，会压缩消息体，勾选此选项，则Burp Suite 会自动解压消息体

解压返回消息中的压缩文件 大多数浏览器支持压缩的消息体，勾选此选项，则Burp Suite 会自动解压被服务器端压缩的消息体

禁用http://burp

允许通过DNS和主机名访问web接口 即允许通过域名或主机名访问Burp Suite

不在浏览器中显示Burp Suite错误 在我们使用Burp Suite时，如果发生了Burp Suite自身的错误，会在浏览器中显示，如果勾选了此项，则不会在浏览器中显示此类错误。

禁用日志到历史和网站地图中 此选项的作用是阻止记录日志到历史和网站地图，在某些情况下可能有用，比如说，通过上游服务器进行认证或者做正则表达式替换时，为了降低内存的消耗，减少日志的储存，你可以勾选此项。

拦截功能开始设置
这个选项主要用来配置intercept功能的生效方式，分为总是生效、 总是失效 、从上一次的Burp Suite中恢复设置3种方式。