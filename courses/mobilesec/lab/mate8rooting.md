# Rooting huawei Mate 8

- 下载 [华为 Hsuite ](https://consumer.huawei.com/cn/support/hisuite/)并安装，这样pc才能访问mate8
- 在手机上设置“安全-更多-允许HDB连接访问”
- 在手机上，连续7次点击关于手机中的版本号，启动开发者模式，设置“允许usb调试”
- 确认 windows 设备管理器中有```Android Composite ADB Interface```、```Huawei HDB Interface```
等正确安装的信息
- 安装 ADB ，可以选择安装 Android studio，然后在选择安装sdk platform tools，其中包含ADB. WINDWOS10 下默认目录在C:\Users\leo\AppData\Local\Android\Sdk\platform-tools>
- 在shell下运行命令```adb start-server```启动，运行命令```adb devices -l```查看已连接设备。

```
PS C:\Users\leo\AppData\Local\Android\Sdk\platform-tools> .\adb.exe devices -l
List of devices attached
5LM0215C15000924       device product:NXT-AL10 model:HUAWEI_NXT_AL10 device:HWNXT transport_id:1
```

## 解锁
据说解锁要申请官方解锁码，华为已经停止这一政策。另有传言可淘宝购买。
> 申请唯一的解锁码，到华为解锁网站申请解锁码：地址： http://www.emui.com/plugin.php？id=unlock&mod=detail ，按照网站上的要求填写申请资料，如果你没有登录账号的话，会提示你进行登录的，按照页面提示填写“产品型号”“产品S/N号”“产品IMEI/MEID”“产品识别码”“验证码”然后提交，我们将获得“您的解锁码为：“661651177****149”，如长时间未收到解锁密码，请重新再试试。


下面尝试adb命令解锁bootloader。2012年起华为开始锁定bootloader，不解锁是无法刷入recovery的。

在拨号键盘输入”*#*#2846579#*#*“进入手机工程模式，选择“ProjectMenu”-》“2.单板基本信息的查询”-》“4.其他查询”在界面里我们可以找到我需要的“产品S/N号”和“产品IMEI/MEID”

在拨号键盘输入”*#*#1357946#*#*“可以直接得到“产品识别码”；

产品型号：HUAWEI NXT-AL10
产品S/N号：5LM0215C15000924
产品IMEI：A00000595277A3
产品识别码：15762975

通过某宝小店可以获得解锁码。这个技术原理暂时不清楚。

执行以下.\adb.exe start-server
```
PS C:\Users\leo\AppData\Local\Android\Sdk\platform-tools> .\adb.exe start-server
```

使用adb attach 设备：
```
PS C:\Users\leo\AppData\Local\Android\Sdk\platform-tools> .\adb.exe devices -l
List of devices attached
5LM0215C15000924       unauthorized transport_id:1
```

重启设备bootloader：
```
PS C:\Users\leo\AppData\Local\Android\Sdk\platform-tools> .\adb.exe reboot-bootloader
error: device unauthorized.
This adb server's $ADB_VENDOR_KEYS is not set
Try 'adb kill-server' if that seems wrong.
Otherwise check for a confirmation dialog on your device.
#注意手机上的提示，点确定。
PS C:\Users\leo\AppData\Local\Android\Sdk\platform-tools> .\adb.exe reboot-bootloader

```
检查设备：
```
PS C:\Users\leo\AppData\Local\Android\Sdk\platform-tools> .\fastboot.exe devices
5LM0215C15000924        fastboot
```

尝试解锁，解锁码为5164403103552454（因人而异）
```
PS C:\Users\leo\AppData\Local\Android\Sdk\platform-tools> .\fastboot.exe oem unlock 5164403103552454
                                                   (bootloader) The device will reboot and do factory reset...
OKAY [ 27.147s]
Finished. Total time: 27.154s
PS C:\Users\leo\AppData\Local\Android\Sdk\platform-tools>
```

幸运的化可以解锁成功，然后会恢复出厂设置。

这时候会弹出一个界面，有些警告，告诉你解锁风险。

音量键up，选择解锁栏，再按开机键，开始解锁。

接下来会弹出一个界面，还没看清楚就消失了，手机重启，开始恢复出厂设置（有先备份资料吗？），恢复结束后关机。再重启手机，会弹出一个警告界面，告知你解锁成功了，然后又关机。。。

再开机一次，现在手机解锁成功了。。。不确定有没有成功？还不放心，看看下一条。


## rooting

- 下载[magisk zip](https://magisk.download/)和magisk apk，把apk存到手机中。

- 下载[twrp.img](https://dl.twrp.me/)，具体选哪个需要根据型号选择。

- 使用usb连接手机，开启手机上usb调试(“Allow USB debugging”)，在PC上运行```adb reboot bootloader```，重启后进入bootloader.
- 设备进入 bootloader mode 后，在连接设备的PC端键入```fastboot flash recovery twrp-2.8.x.x-xxx.img``` 或 ```fastboot flash recovery_ramdisk twrp-2.8.x.x-xxx.img```，这里要用自己适用的twrp映像。

- 成功写入recovery后，在连接的PC端键入命令```fastboot reboot```，重启后要进入recovery。



经过几番尝试，我下载了twrp-3.0.2.0-next.img到twrp-3.4.0-next.img 共9 个第三方（twrp img），都不能进入recovery。上面的方法不能解决问题。

如果没有解锁，据说可以通过华为助手先降级emui8到emui5或emui4，然后考虑使用上述办法。

- 在windows pc上安装华为手机助手；
- 根据联机后指示在手机上也安装手机助手
- 在pc端手机助手首页的更新中能找到emui5的降级安装

如果解锁了，就不能使用华为助手降级了。

无奈下，我找了某宝上的root店，帮忙解决了。具体做法：
- 下载了一个update.zip包
- 进入fastboot模式：手机彻底关键，而后连接usb线到电脑，再同时按音量-和电源键10秒钟，进入fastboot.(这个模式之前我无法进入，不知道某宝工作人员怎么做的，我之前用的方法是按-和电源，看到机器人时会有错误报告。)


root后要求：
- 面具不要更新不要卸载（看来涉及到版本匹配）
- root后的手机 不要升级系统 不要恢复出厂
- 本店只负责root 软件、框架请自行安装。若root后自行安装不相容的软件和插件导致手机 出现问题不在本店售后范围之内  
