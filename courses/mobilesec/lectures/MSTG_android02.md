# OWASP 移动应用测试指南——Android 测试指南 02

本节主要介绍 Android 基本安全性测试

## Basic Android Testing Setup

在对Android apps有基本了解后，本节讨论建立一个安全测试环境，并描述基本的测试步骤。

我们可以在Windows、Linux、Mac os平台上构建这一环境。

### Host 设备

我们至少需要安装：
- [Android Studio](https://developer.android.com/studio/index.html)（带sdk） platform tools
- 一个 emulator
- 一个管理各种SDK版本和框架组件的app.

Android Studio 还附带了创建模拟器image的Android 虚拟设备(AVD)管理器app。

请确保你的系统上安装了最新的：
- [SDK工具](https://developer.android.com/studio/index.html#downloads)
- [SDK平台工具包](https://developer.android.com/studio/releases/platform-tools.html)

此外，如果打算使用包含本机库的app，要先安装:
-  [android ndk](https://developer.android.com/ndk) 来完成设置。

#### 安装 Android SDK

本地 Android SDK 安装通过 Android studio 进行管理。在 Android studio 中创建一个空项目，然后选择“工具->SDK manager”,以打开SDK Manager GUI。在“SDK 平台” 选项卡上，可以安装多个API级别的SDK。

将sdks安装在下列路径：

```
C:\Users\<username>\AppData\Local\Android\sdk
```

On Linux, you need to choose an SDK directory. /opt, /srv, and /usr/local are common choices.

#### 安装 Android NDK

Android NDK 包含多版本的 native 编译器和工具链。传统上，GCC和Clang编译器都支持，但目前按GCC支持截止到 NDK revision 14. 设备的架构和主机OS决定了NDK版本。默认工具链在NDK 的toolchain目录下。

除了选择正确的体系结构，还要定位本机api level指定的sysroot。sysroot是一个目录，包含了目标的系统头文件和库。Native API 因版本各异，可以在每个Android API 的可用sysroot目录找到所需。

#### 测试设备

为了能够进行动态分析，你需要一个 Android 设备才能在其上运行目标程序。原则上，你可以在没有真实 Android 设备的情况下进行测试，即仅使用模拟器，但速度非常慢，且模拟器无法给出真是结果。在真实设备上过程更流畅。

#### 在真实设备上测试

虽然任何物理设备都可用于测试，但有一些约束条件：
- 设备需要 root，这可能需要渗透或通过解锁bootloader。
- 使用 Android 物理设备时，需要在设备上启用开发人员模式
- 需要启用usb调试

开发人员选项从 Android 4.2 开始处于隐藏状态下，要激活需要按“关于电话”视图中的内部号码7次。

免费模拟器：
- Android Virtual Device（AVD)
  - 官方android 模拟器，建议使用
  - 支持GPS, SMS, MOTION SENSORS
  - ```./android avd```
- Android x86 

商用模拟器：
- Genymotion
- Corellium

有一些工具和VMs可用于在模拟器环境下测试app：
- MobSF
- Nathan

#### 获取特权访问

测试前推荐在真实设备上进行Rooting 。这样会拥有足够的控制权，允许你绕过一些限制，例如app沙盒。特权还允许你使用类似代码注入和功能hooking的技术。

Rooting是有风险的：
- 破坏设备保修条款
- 使设备 bricking
- 形成额外的安全风险

#### 使用Magisk进行rooting

### Android 设备端的推荐工具

有一些评估Android应用安全的工具推荐给大家：
- APK Extractor: App to extract APKs without root.
- Frida server: the dynamic instrumentation toolkit for developers, reverse-engineers, and security researchers.
- Drozer agent: Agent for drozer, the framework that allows you to search for security vulnerabilities in apps and devices. 
- Busybox:  Busybox combines multiple common Unix utilities into a small single executable. 

#### Xposed

Xposed 是一个用于改变系统和app行为，但不改动任何apks的框架。

从技术上看，它是zygote的扩展版本，在启动新进程时会导出用于允许java代码的api。在新实例化的app上下文中，运行java代码，可以解析、挂钩、覆盖属于该应用的java方法。xposed使用反射来检查和修改正在运行的apps。xposed不修改app的二进制文件，而是在内存中修改apps image。

如果要使用xposed，你需要首先将xposed框架安装在一个已rooted的设备上。请参考 [XDA-Developers Xposed framework hub](https://www.xda-developers.com/xposed-framework-hub/). 由于SafetyNet会检查到你安装xposed，我们推荐你使用 Magisk来安装Xposed。这样带有SafetyNet认证的app会更可能通过xposed进行测试。

除了xposed之外，还可以使用Frida。两个框架都很有价值。

还可以通过下列脚本将xposed安装在模拟器上：
```shell

#!/bin/sh
echo "Start your emulator with 'emulator -avd NAMEOFX86A8.0 -writable-system -selinux permissive -wipe-data'"
adb root && adb remount
adb install SuperSU\ v2.79.apk #binary can be downloaded from http://www.supersu.com/download
adb push root_avd-master/SuperSU/x86/su /system/xbin/su
adb shell chmod 0755 /system/xbin/su
adb shell setenforce 0
adb shell su --install
adb shell su --daemon&
adb push busybox /data/busybox #binary can be downloaded from https://busybox.net/
# adb shell "mount -o remount,rw /system && mv /data/busybox /system/bin/busybox && chmod 755 /system/bin/busybox && /system/bin/busybox --install /system/bin"
adb shell chmod 755 /data/busybox
adb shell 'sh -c "./data/busybox --install /data"'
adb shell 'sh -c "mkdir /data/xposed"'
adb push xposed8.zip /data/xposed/xposed.zip #can be downloaded from https://dl-xda.xposed.info/framework/
adb shell chmod 0755 /data/xposed
adb shell 'sh -c "./data/unzip /data/xposed/xposed.zip -d /data/xposed/"'
adb shell 'sh -c "cp /data/xposed/xposed/META-INF/com/google/android/*.* /data/xposed/xposed/"'
echo "Now adb shell and do 'su', next: go to ./data/xposed/xposed, make flash-script.sh executable and run it in that directory after running SUperSU"
echo "Next, restart emulator"
echo "Next, adb install XposedInstaller_3.1.5.apk"
echo "Next, run installer and then adb reboot"
echo "Want to use it again? Start your emulator with 'emulator -avd NAMEOFX86A8.0 -writable-system -selinux permissive'"
```

### Host 端的推荐工具

为了分析Android apps，你可以安装下列工具在host计算机上。

#### Adb（Android debug Bridge）

它是开发环境和android设备间的桥梁。利用它通过usb或wifi在仿真器或连接设备上测试程序。```adb devices -l```可以列出连接的设备。

```
$ adb devices -l
List of devices attached
090c285c0b97f748 device usb:1-1 product:razor model:Nexus_7 device:flo
emulator-5554    device product:sdk_google_phone_x86 model:Android_SDK_built_for_x86 device:generic_x86 transport_id:1
```

```adb shell``` 命令启动一个交互shell
```
$ adb forward tcp:<host port> tcp:<device port>
```

```adb forward``` 命令转发特定主机端口流量到连接设备的另一个端口上。

```$ adb forward tcp:<host port> tcp:<device port>```

```adb -s ```命令可以通过串口建立shell。
```
$ adb -s emulator-5554 shell
root@generic_x86:/ # ls
acct
cache
charger
config
...
```

#### Angr

Angr是一个python框架，用于分析二进制。它可用于静态或动态符号化（“concoli”）分析。换句话说，给定一个二进制文件和一个要求的状态，Angr将尝试达到那个状态，使用形式化方法（一种静态代码分析的方法）来发现一个而路径，也可以用暴力测试。

使用Angr通常能快速找到预想的状态，比人工测试速度快。Angr使用VEX中间语言进行操作，并带有ELF/ARM二进制文件的加载程序，因此非常适合处理native code，例如 native android binary。

#### Apktool

Apktool用来解压Android apk。仅使用标准app解压apk会使得一些文件无法读取，被编码为二进制的xml格式。

apktool会自动将android manifest 解码为基于文本的xml格式，并提取文件资源，还将.DEX文件反汇编为smali代码。

```
$ apktool d base.apk
I: Using Apktool 2.1.0 on base.apk
I: Loading resource table...
I: Decoding AndroidManifest.xml with resources...
I: Loading resource table from file: /Users/sven/Library/apktool/framework/1.apk
I: Regular manifest package...
I: Decoding file-resources...
I: Decoding values */* XMLs...
I: Baksmaling classes.dex...
I: Copying assets and libs...
I: Copying unknown files...
I: Copying original files...
$ cd base
$ ls -alh
total 32
drwxr-xr-x    9 sven  staff   306B Dec  5 16:29 .
drwxr-xr-x    5 sven  staff   170B Dec  5 16:29 ..
-rw-r--r--    1 sven  staff    10K Dec  5 16:29 AndroidManifest.xml
-rw-r--r--    1 sven  staff   401B Dec  5 16:29 apktool.yml
drwxr-xr-x    6 sven  staff   204B Dec  5 16:29 assets
drwxr-xr-x    3 sven  staff   102B Dec  5 16:29 lib
drwxr-xr-x    4 sven  staff   136B Dec  5 16:29 original
drwxr-xr-x  131 sven  staff   4.3K Dec  5 16:29 res
drwxr-xr-x    9 sven  staff   306B Dec  5 16:29 smali
```


#### Apkx

Apkx是一个python包装器，用于DEX转换和Java反编译。它能自动的抽取、转换和反编译apks。

#### Burp Suite

#### Drozer
这是一个Android 安全评估框架，可以用于研究安全漏洞。

#### Frida
Frida is a free and open-source dynamic code instrumentation toolkit that lets you execute snippets of JavaScript into your native apps. It was already introduced in the chapter "Tampering and Reverse Engineering" of the general testing guide.

#### House

这是一个面向android apps的运行时移动app分析工具集。

#### Magisk

一种root android 设备的工具。

#### MobSF
自动化全套移动应用渗透框架。

#### radare2

这是一个流行的开源逆向框架。

#### r2frida

r2frida是一个允许radare2连接到frida，有效融合逆向分析和动态instrumentation工具的项目。

## 基本测试操作

### 访问设备shell

测试一个app时，最经常要做的事情就是访问该设备的shell。本节我们来看如何访问设备的shell。

我们将：
- 通过usb远程访问设备shell
- 在设备上访问shell




