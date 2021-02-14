# ProxyChains

ProxyChains 是一个linux下的代理工具。它可以使任何程序经过它的代理连接网络，允许 TCP 和 DNS 通过代理隧道。支持 HTTP，SOCKS4，SOCKS5类型的代理服务器。

ProxyChains通过用户定义的代理列表强制连接指定的应用程序。它只会将当前的TCP连接转发至代理，而不是全局代理。
## 安装配置
ubuntu上安装```sudo apt install proxychians``` 可以安装proxychains3.

配置文件在 /etc/proxychains.conf，打开后在末尾添加你使用的代理。