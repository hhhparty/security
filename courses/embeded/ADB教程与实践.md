# ADB 教程与实践

## 建立访问
### 通过usb访问手机

前提条件：
- Android手机端要打开开发者选项-运行adb调试类的开关，在访问时还有一次弹窗确认。

步骤：
- 发现连接状态：`adb devices` ，如果有会显示有设备，且给出一个 serial number 

```
└─$ adb devices                  
List of devices attached
4KXNW18223013637	device
```
- 使用 serial num连接设备并进入shell `adb -s 4KXNW18223013637 shell` 
- 这时手机侧会弹出一个提出，要求授权确认
- 如果确认，那么就进入系统shell了。、

```sh
└─$ adb -s 4KXNW18223013637 shell
HWFIG-H:/ $ pwd
/
HWFIG-H:/ $ ls
ls: ./fstab.zram1536m: Permission denied
ls: ./modem_log: Permission denied

```

### 通过网络访问手机


## 控制命令
下面继续以上面的设备为例

### 锁定手机/屏幕

`adb -s 4KXNW18223013637  shell input keyevent 26`

### 解锁手机

`adb -s 4KXNW18223013637  shell input keyevent 82`

### 输入口令并回车

`adb -s 4KXNW18223013637  shell input text 123456 && adb -s 4KXNW18223013637 shell input  keyevent 66`

### 重启
adb shell reboot  //重启

### 关机
adb shell reboot -p  //关机

## 系统设置

### 蓝牙

查看蓝牙信息状态
```sh
adb shell dumpsys bluetooth_manager       

Bluetooth Status
  enabled: false
  state: OFF
  address: ******:01:A3:C9
  name: FIG-AL00

Bluetooth never enabled!

Bluetooth crashed 0 times

0 BLE appsregistered

Bluetooth Service not connected
```

获取蓝牙开关状态
└─$ adb shell settings get global bluetooth_on
0

0表示关闭，1表示打开。


adb shell service call bluetooth_manager 6 //打开蓝牙
adb shell service call bluetooth_manager 9 //关闭蓝牙

获取蓝牙MAC地址

adb shell settings get secure bluetooth_address

04:79:70:01:A3:C9
### wifi

adb shell svc wifi enable  //打开wifi
adb shell svc wifi disable  //关闭wifi
打开wifi设置界面
adb shell am start -a android.intent.action.MAIN -n com.android.settings/.wifi.WifiSettings

### 连接时保持亮屏 设置
svc power stayon [true|false|usb|ac|wireless]

参数解释：
true: 任何情况下均保持亮屏
false:任何情况下均不保持亮屏（经过设定的时间后自动黑屏）
usb, ac, wireless：设置其中之一时，仅在这一种情况下才保持亮屏


## 模拟操作

### 模拟按键操作

adb shell input text 12345 输入12345

adb shell input keyevent 111 //关闭软键盘(其实是按下ESC，111=KEYCODE_ESCAPE)
更多按键代码，在这里
https://developer.android.com/reference/android/view/KeyEvent.html

### 模拟滑动触屏操作
adb shell input touchscreen swipe 330 880 330 380 //向上滑
adb shell input touchscreen swipe 630 880 330 880 //向左滑
adb shell input touchscreen swipe 330 880 630 880 //向右滑
adb shell input touchscreen swipe 330 380 330 880 //向下滑

### 模拟鼠标操作
adb shell input mouse tap 100 500
100是x，500是y。
原点在屏幕左上角。

## 运行程序

### 拨打电话
adb shell am start -a android.intent.action.CALL -d tel:10010
打开网站
adb shell am start -a android.intent.action.VIEW -d  http://google.com

### 启动APP
adb shell am start -n com.package.name/com.package.name.MainActivity
adb shell am start -n com.package.name/.MainActivity
```
$ adb shell monkey -p com.android.contacts -c android.intent.category.LAUNCHER 1
Events injected: 1
## Network stats: elapsed time=16ms (0ms mobile, 0ms wifi, 16ms not connected)
```
## 硬件高级调节

### 信息查看

查看设备序列号
`adb get-serialno`

└─$ adb get-serialno              
4KXNW18223013637

查看CPU温度
先查看有哪些温度区域thermal zone
$ adb shell ls sys/class/thermal/

查看某个CPU温度
 cat /sys/class/thermal/thermal_zone0/temp                                                                                                
25800

CPU设置
查看当前手机可用的governor
$ cat /sys/devices/system/cpu/cpu0/cpufreq/scaling_available_governors                                                                     
userspace interactive performance
锁定CPU为最大频率


## 刷机

重启手机，进入recovery或bootloader模式
adb reboot recovery //恢复模式
adb reboot bootloader  //刷机模式。不同手机，命令不同，要试一下。
adb reboot-bootloader
adb reboot boot loader


进入 fastboot 模式。
 adb  reboot  fastboot
    或
关机，然后同时按住 增加音量 和 电源 键开机

## 调试

抓取开机日志
adb wait-for-device && adb shell logcat -v threadtime | tee mybootup.log

查看日志
adb logcat

关闭/重启adb服务进程
adb kill-server
adb start-server

从本地复制文件到设备，或者反之
adb push test.zip /sdcard/  //从本地复制文件到设备
adb pull /sdcard/abc.zip  ~/  //从设备复制文件到本地
显示已经安装的APP的包名
adb shell pm list packages
安装、删除APP
adb install abc.apk //第一次安装。如果手机上已经有此app,则会报错。
adb install -r abc.apk //如果已经安装过，保留原app的数据
adb -s 11223344 install abc.apk  //当多个安卓连接到电脑时，安装到指定一台安卓上
adb uninstall com.example.appname
查看apk的版本（无需解压）
aapt dump badging abcd.apk |grep version
捕获键盘操作
adb shell getevent -ltr 
查看屏幕分辨率 dpi
wm density
wm size
设置：

wm density 240
立刻生效