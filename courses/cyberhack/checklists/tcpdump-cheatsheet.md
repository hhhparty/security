# TCPDUMP CHEATSHEET

## Capture Tcpdump for ICMP:

`[root@CentOs]# tcpdump -i any icmp`


仅查看ICMP ECHO 

`[root@CentOs]# tcpdump -i any icmp[icmptype] == 8`


## 查看某个端口

` tcpdump port 5060`

`tcpdump port 5060 or port 5061 or port 5062`

```
tcpdump portrange 5060-5062

tcpdump -iany dst port 5060

#tcpdump -iany dst port 5060
```
## 查看主机

tcpdump host 192.168.1.80

 tcpdump -iany src host 192.168.2,100

 tcpdump -iany dst host 192.168.3.100

 tcpdump -any net 192.168.3.0/24

 tcpdump -n src net 192.168.3.0/24

 tcpdump -n dst net 192.168.3.0/24

## 仅抓取N个包


#tcpdump -c N

tcpdump greater N