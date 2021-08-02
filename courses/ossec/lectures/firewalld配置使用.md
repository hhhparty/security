#  firewalld 配置使用

## 简介
centos 7 中默认是使用firewalld来管理netfilter子系统，不过底层调用的命令仍然是iptables等。

## 与iptables的关系

firewalld自身并不具备防火墙的功能，而是和iptables一样需要通过内核的netfilter来实现。也就是说 firewalld 和 iptables一样，他们的作用都是用于维护规则，而真正使用规则干活的是内核的netfilter，只不过firewalld和iptables的结构以及使用方法不一样罢了。

firewalld跟iptables比起来至少有两大好处：

- firewalld可以动态修改单条规则，而不需要像iptables那样，在修改了规则后必须得全部刷新才可以生效；
- firewalld在使用上要比iptables人性化很多，即使不明白“五张表五条链”而且对TCP/IP协议也不理解也可以实现大部分功能。
- firewalld跟iptables比起来，**每个服务都需要去设置才能放行，因为默认是拒绝**。而iptables里默认是每个服务是允许，需要拒绝的才去限制。


## 一个重要的概念：区域管理

firewalld将网卡对应到不同的区域（zone），zone 默认共有9个：
- block 
- dmz 
- drop 
- external 
- home 
- internal 
- public 
- trusted 
- work
 
不同的区域之间的差异是其对待数据包的默认行为不同，根据区域名字我们可以很直观的知道该区域的特征，在CentOS7系统中，默认区域被设置为public.


在最新版本的fedora（fedora21）当中随着 server 版和 workstation 版的分化则添加了两个不同的自定义 zone FedoraServer 和 FedoraWorkstation 分别对应两个版本。

通过将网络划分成不同的区域，制定出不同区域之间的访问控制策略来控制不同程序区域间传送的数据流。

例如，互联网是不可信任的区域，而内部网络是高度信任的区域。网络安全模型可以在安装，初次启动和首次建立网络连接时选择初始化。

### 不同区域的默认规则
该模型描述了主机所连接的整个网络环境的可信级别，并定义了新连接的处理方式。

有如下几种不同的初始化区域：

阻塞区域（block）：任何传入的网络数据包都将被阻止。
工作区域（work）：相信网络上的其他计算机，不会损害你的计算机。
家庭区域（home）：相信网络上的其他计算机，不会损害你的计算机。
公共区域（public）：不相信网络上的任何计算机，只有选择接受传入的网络连接。
隔离区域（DMZ）：隔离区域也称为非军事区域，内外网络之间增加的一层网络，起到缓冲作用。对于隔离区域，只有选择接受传入的网络连接。
信任区域（trusted）：所有的网络连接都可以接受。
丢弃区域（drop）：任何传入的网络连接都被拒绝。
内部区域（internal）：信任网络上的其他计算机，不会损害你的计算机。只有选择接受传入的网络连接。
外部区域（external）：不相信网络上的其他计算机，不会损害你的计算机。只有选择接受传入的网络连接。

注：FirewallD的默认区域是public。

###  配置文件

firewalld默认提供了九个zone配置文件：
- block.xml
- dmz.xml
- drop.xml
- external.xml
- home.xml
- internal.xml
- public.xml
- trusted.xml
- work.xml

他们都保存在“/usr/lib/firewalld/zones/”目录下。

默认情况下,在/etc/firewalld/zones下面只有一个public.xml。如果给另外一个zone做一些改动，并永久保存，那么会自动生成对应的配置文件.

比如给work zone增加一个端口：

```firewall-cmd --permanent --zone=work --add-port=1000/tcp```

此时就会生成一个 work.xml 的配置文件


#### 查看xx区域的永久配置文件

```cat /etc/firewalld/zones/xx.xml```

注意:防火墙配置文件也可以手动修改,修改后记得reload防火墙。

#### 配置方法
firewalld的配置方法主要有三种：
- firewall-config
- firewall-cmd
- 直接编辑xml文件，

其中 firewall-config是图形化工具，firewall-cmd是命令行工具。

#### firewalld默认配置文件

- ```/usr/lib/firewalld``` 是系统配置，尽量不要修改
- ```/etc/firewalld``` 用户配置地址
- 在 ```/usr/lib/firewalld/services/``` 目录中，还保存了另外一类配置文件，每个文件对应一项具体的网络服务，如 ssh 服务等. 与之对应的配置文件中记录了各项服务所使用的 tcp/udp 端口，在最新版本的 firewalld 中默认已经定义了 70+ 种服务供我们使用.

当默认提供的服务不够用或者需要自定义某项服务的端口时，我们需要将 service 配置文件放置在 ```/etc/firewalld/services/``` 目录中.service 配置的好处显而易见:
- 通过服务名字来管理规则更加人性化;
- 通过服务来组织端口分组的模式更加高效，如果一个服务使用了若干个网络端口，则服务的配置文件就相当于提供了到这些端口的规则管理的批量操作快捷方式。

例如：你服务器的ftp不使用默认端口，默认ftp的端口21改为1121,但想通过服务的方式操作防火墙。

- 1.复制模版到/etc,以便修改和调用

```cp /usr/lib/firewalld/services/ftp.xml /etc/firewalld/services/```

- 2.修改模版配置
```[root@zcwyou ~]# ```vim /etc/firewalld/services/ftp.xml```

- 3.在vim中把21改为1121

- 4.由于public为默认zone，所以要编辑public配置文件，在其中增加一行:

```vim /etc/firewalld/zones/public.xml```

在打开的文件中键入：

```<service name="ftp"/>```

- 5.重新加载防火墙配置

```[root@zcwyou ~]# firewall-cmd --reload```

又例如增加端口

<port protocol="tcp" port="8080"/>

## 常用命令

### 安装firewalld
```[root@zcwyou ~]# yum install firewalld firewall-config```

### 启动服务
```[root@zcwyou ~]# systemctl start firewalld```

### 开机自动启动服务
```[root@zcwyou ~]# systemctl enable firewalld```

### 查看状态
```[root@zcwyou ~]# systemctl status firewalld```

```[root@zcwyou ~]# firewall-cmd --state```

### 关闭服务
```[root@zcwyou ~]# systemctl stop firewalld```

### 取消开机启动
```[root@zcwyou ~]# systemctl disable firewalld```

### 弃用FirewallD防火墙，改用iptables 

你也可以关闭目前还不熟悉的FirewallD防火墙，而使用iptables,但不建议.

首先要删除firewalld。

```systemctl stop firewalld.service```

```systemctl disable firewalld.service``` #禁止firewall开机启动

然后安装iptables。

```[root@zcwyou ~]# yum install iptables-services```

```[root@zcwyou ~]# systemctl start iptables```

```[root@zcwyou ~]# systemctl enable iptables```

### 查看版本
```[root@zcwyou ~]# firewall-cmd --version```

### 查看帮助
```[root@zcwyou ~]# firewall-cmd --help```

### 显示状态
```[root@zcwyou ~]# firewall-cmd --state```

### 查看活动区域信息
```[root@zcwyou ~]# firewall-cmd --get-active-zones```

### 查看XX接口所属区域
```[root@zcwyou ~]# firewall-cmd --get-zone-of-interface=XX```

### 拒绝所有包
```[root@zcwyou ~]# firewall-cmd --panic-on```

### 取消拒绝状态
```[root@zcwyou ~]# firewall-cmd --panic-off```

### 查看是否拒绝
```[root@zcwyou ~]# firewall-cmd --query-panic```

### 查看firewalld是否开启
```[root@zcwyou ~]# systemctl is-enabled firewalld```

### 重启加载防火墙

以 root 身份输入以下命令，重新加载防火墙，并不中断用户连接，即不丢失状态信息：
```[root@zcwyou ~]# firewall-cmd --reload```

### 完全重启防火墙 

以 root 身份输入以下命令，重新加载防火墙并中断用户连接，即丢弃状态信息：
```[root@zcwyou ~]# firewall-cmd --complete-reload```

注意:通常在防火墙出现严重问题时，这个命令才会被使用。比如，防火墙规则是正确的，但却出现状态信息问题和无法建立连接。

```firewall-cmd --reload```与```firewall-cmd --complete-reload```两者的区别就是：

- 第一个无需断开连接，就是firewalld特性之一动态添加规则
- 第二个需要断开连接，类似重启服务

### 显示默认区域
```[root@zcwyou ~]# firewall-cmd --get-default-zone```

### 添加接口到区域

将接口添加到XX区域,如果不指定区域,则添加到默认区域
```[root@zcwyou ~]# firewall-cmd --zone=XX --add-interface=eth0```

永久生效再加上```--permanent``` 然后reload防火墙

### 设置默认区域，立即生效无需重启
```[root@zcwyou ~]# firewall-cmd --set-default-zone=XX```

### 查看XX区域打开的端口
```[root@zcwyou ~]# firewall-cmd --zone=XX --list-ports```

### 查看XX区域加载的服务
```[root@zcwyou ~]# firewall-cmd --zone=XX --list-services```

### 临时加一个端口到XX区域
```[root@zcwyou ~]# firewall-cmd --zone=XX --add-port=8080/tcp```

若要永久生效方法加参数--permanent

### 打开一个服务

类似于将端口可视化，服务需要在配置文件中添加，/etc/firewalld 目录下有services文件夹，查看其它的xml文件以及参考前面说方法.

```[root@zcwyou ~]# firewall-cmd --zone=work --add-service=smtp```

### 移除服务
```[root@zcwyou ~]# firewall-cmd --zone=work --remove-service=smtp```

### 显示支持的区域列表
```[root@zcwyou ~]# firewall-cmd --get-zones```

### 列出全部区域启用的特性
```[root@zcwyou ~]# firewall-cmd --list-all-zones```

### 显示XX区域详情
```[root@zcwyou ~]# firewall-cmd --zone=XX --list-all```

### 查看当前活跃区域
```[root@zcwyou ~]# firewall-cmd --get-active-zones```

### 设置XX接口所属区域
```[root@zcwyou ~]# firewall-cmd --get-zone-of-interface=XX```

### 查询YY区域中是否包含XX接口
```[root@zcwyou ~]# firewall-cmd --zone=YY --query-interface=XX```

### 删除指定XX网卡所在的zone(以YY为例)
```[root@zcwyou ~]# firewall-cmd --zone=YY --remove-interface=XX```

### 临时修改XX接口为YY区域

永久修改加参数--permanent

```[root@zcwyou ~]# firewall-cmd --zone=YY --change-interface=XX ```

### 控制端口 / 服务

#### 可以通过两种方式控制端口的开放：

- 一种是指定端口号
- 另一种是指定服务名。

虽然开放 http 服务就是开放了 80 端口，但是还是不能通过端口号来关闭，也就是说通过指定服务名开放的就要通过指定服务名关闭；

#### 通过指定端口号开放的就要通过指定端口号关闭。
例如：永久开启80端口

```firewall-cmd --zone=public --add-port=80/tcp --permanent ```

```systemctl restart firewalld.service```

#### 还有一个要注意

指定端口的时候一定要指定是什么协议，tcp 还是 udp。



### 富规则

```[root@zcwyou ~]# firewall-cmd --permanent --add-rich-rule="rule family="ipv4" source address="192.168.142.166" port protocol="tcp" port="5432" accept"```

```[root@zcwyou ~]# systemctl restart firewalld.service```


## firewalld服务管理

### 显示支持的服务
```[root@zcwyou ~]# firewall-cmd --get-services```

### 临时允许Samba服务通过600秒
```[root@zcwyou ~]# firewall-cmd --add-service=samba --timeout=600```

### 显示默认区域开启的服务,如果要查某区域,加参数--zone=XX
```[root@zcwyou ~]# firewall-cmd --list-services```

### 添加HTTP服务到内部区域（internal）,并保存到配置文件
```[root@zcwyou ~]# firewall-cmd --permanent --zone=internal --add-service=http```

### 在不改变状态的条件下重新加载防火墙
```[root@zcwyou ~]# firewall-cmd --reload```

### 开放mysql服务
```[root@zcwyou ~]# firewall-cmd --add-service=mysql```

### 阻止mysql服务
```[root@zcwyou ~]# firewall-cmd --remove-service=mysql```

### 端口管理，临时打开443/TCP端口,立即生效
```[root@zcwyou ~]# firewall-cmd --add-port=443/tcp```

### 永久打开3690/TCP端口
```[root@zcwyou ~]# firewall-cmd --permanent --add-port=3690/tcp```

### 永久打开端口需要reload一下，如果用了reload临时打开的端口就失效了
```[root@zcwyou ~]# firewall-cmd --reload```

### 查看防火墙所有区域的设置，包括添加的端口和服务
```[root@zcwyou ~]# firewall-cmd --list-all```

### 开放通过tcp访问3306
```[root@zcwyou ~]# firewall-cmd --add-port=3306/tcp```

### 阻止tcp80
```[root@zcwyou ~]# firewall-cmd --remove-port=80/tcp```

5.14 开放通过udp访问233
[root@zcwyou ~]# firewall-cmd --add-port=233/udp

5.15 查看开放的端口
[root@zcwyou ~]# firewall-cmd --list-ports

5.16 开放自定义的ssh端口号为12222  （--permanent参数可以将永久保存到配置文件）
[root@zcwyou ~]# firewall-cmd --add-port=12222/tcp --permanent

重启防火墙。永久打开端口需要reload一下，如果用了reload临时打开的端口就失效了
[root@zcwyou ~]# firewall-cmd --reload

5.16 添加端口范围
[root@zcwyou ~]# firewall-cmd --add-port=2000-4000/tcp

5.17 针对指定zone XX添加端口
[root@zcwyou ~]# firewall-cmd --permanent --zone=XX --add-port=443/tcp

## 管理区域中的对象

 6.1 获取永久支持的区域
[root@zcwyou ~]# firewall-cmd --permanent --get-zones

6.2 启用区域中的服务（此举将永久启用区域中的服务。如果未指定区域，将使用默认区域。）
firewall-cmd --permanent [--zone=] --add-service=

6.3 临时开放mysql服务,立即生效
[root@zcwyou ~]# firewall-cmd --add-service=mysql

6.4 public区域,添加httpd服务,并保存,但不会立即生效,需要reload防火墙
[root@zcwyou ~]# firewall-cmd --permanent --zone=public --add-service=httpd

6.5 public区域,禁用httpd服务,并保存,但不会立即生效,需要reload防火墙
[root@zcwyou ~]# firewall-cmd --permanent --zone=public --remove-service=httpd

 

7. 端口转发

端口转发可以将指定地址访问指定的端口时，将流量转发至指定地址的指定端口。

转发的目的如果不指定ip的话就默认为本机，如果指定了ip却没指定端口，则默认使用来源端口。

典型的做法:

1）NAT内网端口映射
2）SSH隧道转发数据

如果配置好端口转发之后不能用，可以检查下面两个问题：

比如我将 80 端口转发至 8080 端口，首先检查本地的 80 端口和目标的 8080 端口是否开放监听了

其次检查是否允许伪装 IP，没允许的话要开启伪装 IP

 

7.1 将80端口的流量转发至8080
[root@zcwyou ~]# firewall-cmd --add-forward-port=port=80:proto=tcp:toport=8080

7.2 将80端口的流量转发至192.168.0.1
[root@zcwyou ~]# firewall-cmd --add-forward-port=proto=80:proto=tcp:toaddr=192.168.1.0.1

7.3 将80端口的流量转发至192.168.0.1的8080端口
[root@zcwyou ~]# firewall-cmd --add-forward-port=proto=80:proto=tcp:toaddr=192.168.0.1:toport=8080

7.4 禁止区域的端口转发或者端口映射

firewall-cmd [--zone=] --remove-forward-port=port=[-]:proto= { :toport=[-] | :toaddr=| :toport=[-]:toaddr=}

7.5 查询区域的端口转发或者端口映射

firewall-cmd [--zone=] --query-forward-port=port=[-]:proto= { :toport=[-] | :toaddr=| :toport=[-]:toaddr=}

7.6 在区域中永久启用端口转发或映射

firewall-cmd --permanent [--zone=] --add-forward-port=port=[-]:proto= { :toport=[-] | :toaddr=| :toport=[-]:toaddr=}

端口可以映射到另一台主机的同一端口，也可以是同一主机或另一主机的不同端口。

端口号可以是一个单独的端口 或者是端口范围 。

协议可以为 tcp 或udp 。

目标端口可以是端口号 或者是端口范围 。

目标地址可以是 IPv4 地址。受内核限制，端口转发功能仅可用于IPv4。

7.7永久禁止区域的端口转发或者端口映射

firewall-cmd --permanent [--zone=] --remove-forward-port=port=[-]:proto= { :toport=[-] | :toaddr=| :toport=[-]:toaddr=}

7.8 查询区域的端口转发或者端口映射状态

firewall-cmd --permanent [--zone=] --query-forward-port=port=[-]:proto= { :toport=[-] | :toaddr=| :toport=[-]:toaddr=}

如果服务启用，此命令将有返回值。此命令没有输出信息。

7.9  将 home 区域的 ssh 服务转发到 127.0.0.2

[root@zcwyou ~]# firewall-cmd --permanent --zone=home --add-forward-port=port=22:proto=tcp:toaddr=127.0.0.2

 

8. 伪装 IP

8.1 检查是否允许伪装IP
[root@zcwyou ~]# firewall-cmd --query-masquerade

8.2 允许防火墙伪装IP
[root@zcwyou ~]# firewall-cmd --add-masquerade

8.3 禁止防火墙伪装IP
[root@zcwyou ~]# firewall-cmd --remove-masquerade

8.4 永久启用区域中的伪装
firewall-cmd --permanent [--zone=] --add-masquerade

此举启用区域的伪装功能。私有网络的地址将被隐藏并映射到一个公有IP。

这是地址转换的一种形式，常用于路由。由于内核的限制，伪装功能仅可用于IPv4。

8.5 临时禁用区域中的 IP 伪装
firewall-cmd [--zone=] --remove-masquerade

8.6 永久禁用区域中的伪装
firewall-cmd --permanent [--zone=] --remove-masquerade

8.7 查询区域中的伪装的永久状态
firewall-cmd --permanent [--zone=] --query-masquerade

如果服务启用，此命令将有返回值。此命令没有输出信息。

8.8 查询区域的伪装状态
firewall-cmd [--zone=] --query-masquerade

如果启用，此命令将有返回值。没有输出信息。

 

9. ICMP控制

9.1 获取永久选项所支持的ICMP类型列表
[root@zcwyou ~]# firewall-cmd --permanent --get-icmptypes

9.2 获取所有支持的ICMP类型
[root@zcwyou ~]# firewall-cmd --get-icmptypes

9.3 永久启用区域中的ICMP阻塞,需要reload防火墙,
firewall-cmd --permanent [--zone=] --add-icmp-block=

此举将启用选中的 Internet 控制报文协议 （ICMP） 报文进行阻塞。ICMP 报文可以是请求信息或者创建的应答报文或错误应答报文。

9.4 永久禁用区域中的ICMP阻塞,需要reload防火墙,
firewall-cmd --permanent [--zone=] --remove-icmp-block=

9.5 查询区域中的ICMP永久状态
firewall-cmd --permanent [--zone=] --query-icmp-block=

如果服务启用，此命令将有返回值。此命令没有输出信息。

阻塞公共区域中的响应应答报文:
[root@zcwyou ~]# firewall-cmd --permanent --zone=public --add-icmp-block=echo-reply

9.6 立即启用区域的 ICMP 阻塞功能
firewall-cmd [--zone=] --add-icmp-block=

此举将启用选中的 Internet 控制报文协议 （ICMP） 报文进行阻塞。 ICMP 报文可以是请求信息或者创建的应答报文，以及错误应答。

9.7 立即禁止区域的 ICMP 阻塞功能
firewall-cmd [--zone=] --remove-icmp-block=

9.8 查询区域的 ICMP 阻塞功能
firewall-cmd [--zone=] --query-icmp-block=

如果启用，此命令将有返回值。没有输出信息。

例: 阻塞区域的响应应答报文:
[root@zcwyou ~]# firewall-cmd --zone=public --add-icmp-block=echo-reply

 

10. 通过配置文件来使用Firewalld的方法

系统本身已经内置了一些常用服务的防火墙规则,存放在/usr/lib/firewalld/services/

注意!!!!!请勿编辑/usr/lib/firewalld/services/ ，只有 /etc/firewalld/services 的文件可以被编辑。

以下例子均以系统自带的public zone 为例子.

 

10.1 案例1: 如果想开放80端口供外网访问http服务,操作如下

Step1:将 http.xml复制到/etc/firewalld/services/下面,以服务形式管理防火墙,

系统会优先去读取 /etc/firewalld 里面的文件,读取完毕后,会去/usr/lib/firewalld/services/ 再次读取。为了方便修改和管理,强烈建议复制到/etc/firewalld

[root@zcwyou ~]# cp /usr/lib/firewalld/services/http.xml /etc/firewalld/services/

修改/etc/firewalld/zones/public.xml,加入http服务

vi /etc/firewalld/zones/public.xml

Public For use in public areas. You do not trust the other computers on networks to not harm your computer. Only selected incoming connections are accepted.

# 加入这行,要匹配 /etc/firewalld/services/文件夹下的文件名

以 root 身份输入以下命令，重新加载防火墙，并不中断用户连接，即不丢失状态信息：

[root@zcwyou ~]# firewall-cmd --reload

或者以 root 身份输入以下信息，重新加载防火墙并中断用户连接，即丢弃状态信息：

[root@zcwyou ~]# firewall-cmd --complete-reload

注意:通常在防火墙出现严重问题时，这个命令才会被使用。比如，防火墙规则是正确的，但却出现状态信息问题和无法建立连接。

10.2 案例2: SSH为非默认端口,要求能正常访问

[root@zcwyou ~]# cp /usr/lib/firewalld/services/ssh.xml /etc/firewalld/services/
[root@zcwyou ~]# vi /etc/firewalld/services/ssh.xml
把默认22修改为目前的SSH端口号

[root@zcwyou ~]# firewall-cmd --reload

10.3 案例3:修改区域配置文件只允许特定主机192.168.23.1连接SSH

[root@zcwyou ~]# cp /usr/lib/firewalld/services/ssh.xml /etc/firewalld/services/
[root@zcwyou ~]# vi /etc/firewalld/zones/public.xml

确保配置文件有以下内容

配置结束

重启防火墙后生效
[root@zcwyou ~]# firewall-cmd --reload

 

11. firewalld直接模式

对于最高级的使用，或 iptables 专家，FirewallD 提供了一个Direct接口，允许你给它传递原始 iptables 命令。

直接接口规则不是持久的，除非使用 --permanent。

直接选项主要用于使服务和应用程序能够增加规则。 规则不会被保存，在重新加载或者重启之后必须再次提交。传递的参数 与 iptables, ip6tables 以及 ebtables 一致。

选项 –direct 需要是直接选项的第一个参数。将命令传递给防火墙。参数 可以是 iptables, ip6tables 以及 ebtables 命令行参数。

firewall-cmd --direct --passthrough { ipv4 | ipv6 | eb }

11.1 为表增加一个新链 。

firewall-cmd --direct --add-chain { ipv4 | ipv6 | eb }

11.2 从表中删除链 。

firewall-cmd --direct --remove-chain { ipv4 | ipv6 | eb }

11.3 查询链是否存在与表如果是，返回0,否则返回1.

firewall-cmd --direct --query-chain { ipv4 | ipv6 | eb }

如果启用，此命令将有返回值。此命令没有输出信息。

11.4 获取用空格分隔的表中链的列表。

firewall-cmd --direct --get-chains { ipv4 | ipv6 | eb }

11.5 为表增加一条参数为 的链 ，优先级设定为 。

firewall-cmd --direct --add-rule { ipv4 | ipv6 | eb }

11.6 从表中删除带参数的链 。

firewall-cmd --direct --remove-rule { ipv4 | ipv6 | eb }

11.7 查询带参数的链 是否存在表中. 如果是，返回0,否则返回1.

firewall-cmd --direct --query-rule { ipv4 | ipv6 | eb }

如果启用，此命令将有返回值。此命令没有输出信息。

11.8 获取表中所有增加到链的规则，并用换行分隔。

firewall-cmd --direct --get-rules { ipv4 | ipv6 | eb }以iptables的命令允许端口号,重启生效

[root@zcwyou ~]# firewall-cmd --direct -add-rule ipv4 filter INPUT 0 -p tcp --dport 9000 -j ACCEPT
[root@zcwyou ~]# firewall-cmd --reload


12 添加富规则:

12.1 允许192.168.122.0/24主机所有连接。
[root@zcwyou ~]# firewall-cmd --add-rich-rule='rule family="ipv4" source address="192.168.122.0" accept'

12.2 每分钟允许2个新连接访问ftp服务。
[root@zcwyou ~]# firewall-cmd --add-rich-rule='rule service name=ftp limit value=2/m accept'

12.3 同意新的 IP v4 和 IP v6 连接 FT P ,并使用审核每分钟登录一次。
[root@zcwyou ~]# firewall-cmd --add-rich-rule='rule service name=ftp log limit value="1/m" audit accept'

12.4 允许来自192.168.122.0/24地址的新 IPv4连接连接TFTP服务,并且每分钟记录一次。
[root@zcwyou ~]# firewall-cmd --add-rich-rule='rule family="ipv4" source address="192.168.122.0/24" service name=ssh log prefix="ssh" level="notice" limit value="3/m" accept'

12.5 丢弃所有icmp包
[root@zcwyou ~]# firewall-cmd --permanent --add-rich-rule='rule protocol value=icmp drop'

12.6 当使用source和destination指定地址时,必须有family参数指定ipv4或ipv6。如果指定超时,规则将在指定的秒数内被激活,并在之后被自动移除。
[root@zcwyou ~]# firewall-cmd --add-rich-rule='rule family=ipv4 source address=192.168.122.0/24 reject' --timeout=10

12.7 拒绝所有来自2001:db8::/64子网的主机访问dns服务,并且每小时只审核记录1次日志。
[root@zcwyou ~]# firewall-cmd --add-rich-rule='rule family=ipv6 source address="2001:db8::/64" service name="dns" audit limit value="1/h" reject' --timeout=300

12.8 允许192.168.122.0/24网段中的主机访问ftp服务
[root@zcwyou ~]# firewall-cmd --permanent --add-rich-rule='rule family=ipv4 source address=192.168.122.0/24 service name=ftp accept'

12.9 转发来自ipv6地址1:2:3:4:6::TCP端口4011,到1:2:3:4:7的TCP端口4012

[root@zcwyou ~]# firewall-cmd --add-rich-rule='rule family="ipv6" source address="1:2:3:4:6::" forward-port to-addr="1::2:3:4:7" to-port="4012" protocol="tcp" port="4011"'

12.10 允许来自主机 192.168.0.14 的所有 IPv4 流量。
[root@zcwyou ~]# firewall-cmd --zone=public --add-rich-rule 'rule family="ipv4" source address=192.168.0.14 accept'

12.11 拒绝来自主机 192.168.1.10 到 22 端口的 IPv4 的 TCP 流量。
[root@zcwyou ~]# firewall-cmd --zone=public --add-rich-rule 'rule family="ipv4" source address="192.168.1.10" port port=22 protocol=tcp reject'

12.12 查看富规则
[root@zcwyou ~]# firewall-cmd --list-rich-rules

