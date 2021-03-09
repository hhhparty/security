# TCPDUMP 分析流量

## 安装
`sudo yum install -y tcpdump`

## 抓包
- 列出可用网络接口：`sudo tcpdump -D` 
- 抓取某个网卡的流量：`sudo tcpdump -i eth0`
- 抓取5个包后停止：`sudo tcpdump -i eth0 -c 5`

- 显示IP地址和端口号：`sudo tcpdump -i eth0 -n -nn`

## 过滤
- 显示icmp包 `sudo tcpdump -i eth0 -c 20 icmp`
- 仅查看与指定host相关流量：`sudo tcpdump -i eth0 -c 20 host some_host_ip`
- 仅显示80端口流量： `sudo tcpdump -i eth0 -c 20 -nn port 80`
- 仅查看指定host发出的流量：`sudo tcpdump -i eth0 -c 20 src some_host_ip`
- 仅查看指定host流入的流量：`sudo tcpdump -i eth0 -c 20 dst some_host_ip`
- 多条件筛选: `sudo tcpdump -i eth0 -c 20 dst some_host_ip and (port 80 or port 8080)`


## 检查数据包内容
选择 -A 打印数据包为ascii值
选择 -X 以16进制打印出数据报文内容

## 保存\读取数据包
`sudo tcpdump -i any -c 10 -nn port 80 -w webserver.pcap`

`sudo tcpdump -r webserver.pcap -nn src some_ip`
