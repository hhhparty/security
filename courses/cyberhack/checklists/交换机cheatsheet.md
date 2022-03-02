# 交换机 Cheatsheet

## 查看当前配置
ht706/Admin@ht706
```shell
#进入system view
sys

# 查看当前配置
display current-configuration
display current-configuration interface


# 查看接口信息
display interface
display interface brief
display interface g0/0/1

# 查看接口IP配置
display ip interface brief

# 查看stp协议
display stp brief

#查看vrrp协议
display vrrp brief


# 查看接口vlan划分
display vlan

# 查看路由表
display ip routing-table

# 查看arp连接信息
display arp

```

## 访问控制列表 ACL

交换机上的ACL使用包过滤技术实现，对三、四层协议中的IP和端口等信息进行过滤，不涉及应用层控制。

交换机支持的ACL类型：
- IP ACL，含IP,TCP,UDP,IGMP,ICMP等过滤；
- Ethernet ACL，过滤非IP协议，例如使用MAC Address。

交换机支持3种ACL：


## 设置镜像口

### huawei

#### 设定端口到端口的镜像
```shell
# 进入全局模式
# 指定g0/0/4为镜像口，命名为1
observe-port 1 interface g0/0/4

# 指定被监测口
int g0/0/5
port-mirroring to observe-port 1 outbound
# outbound指switch 到 server；inbound 指 server 到 switch
```
#### 设定虚拟机、VLAN到端口的镜像
```shell
# 进入全局模式
# 指定g0/0/4为镜像口，命名为1
observe-port 1 interface g0/0/4

# 指定被监测口
int vlan 20
mirroring to observe-port 1 inbound
# outbound指switch 到 server；inbound 指 server 到 switch
```
