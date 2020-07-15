# Android 系统

## Android 概述

虽然Android系统非常庞大且错综复杂，需要具备全面的技术栈，但整体架构设计清晰。Android底层内核空间以Linux Kernel作为基石，上层用户空间由Native系统库、虚拟机运行环境、框架层组成，通过系统调用(Syscall)连通系统的内核空间与用户空间。对于用户空间主要采用C++和Java代码编写，通过JNI技术打通用户空间的Java层和Native层(C++/C)，从而连通整个系统。

为了能让大家整体上大致了解Android系统涉及的知识层面，先来看一张Google官方提供的经典分层架构图，从下往上依次分为Linux内核、HAL、系统Native库和Android运行时环境、Java框架层以及应用层这5层架构，其中每一层都包含大量的子模块或子系统。

<img src="images/android01/android-stack.png" width="480">

上图采用静态分层方式的架构划分，众所周知，程序代码是死的，系统运转是活的，各模块代码运行在不同的进程(线程)中，相互之间进行着各种错终复杂的信息传递与交互流，从这个角度来说此图并没能体现Android整个系统的内部架构、运行机理，以及各个模块之间是如何衔接与配合工作的。

为了更深入地掌握Android整个架构思想以及各个模块在Android系统所处的地位与价值，计划以Android系统启动过程为主线，以进程的视角来诠释Android M系统全貌，全方位的深度剖析各个模块功能，争取各个击破。这样才能犹如庖丁解牛，解决、分析问题则能游刃有余。

## Android架构

Google提供的5层架构图很经典，但为了更进一步透视Android系统架构，本文更多的是以进程的视角，以分层的架构来诠释Android系统的全貌，阐述Android内部的环环相扣的内在联系。

系统启动架构图
<img src="images/android01/android-boot.jpg" width="480">

图解： Android系统启动过程由上图从下往上的一个过程是由Boot Loader引导开机，然后依次进入 -> Kernel -> Native -> Framework -> App，接来下简要说说每个过程。

### Loader层

Boot ROM: 当手机处于关机状态时，长按Power键开机，引导芯片开始从固化在ROM里的预设代码开始执行，然后加载引导程序到RAM；

Boot Loader：这是启动Android系统之前的引导程序，主要是检查RAM，初始化硬件参数等功能。

### Linux内核层
Android平台的基础是Linux内核，比如ART虚拟机最终调用底层Linux内核来执行功能。Linux内核的安全机制为Android提供相应的保障，也允许设备制造商为内核开发硬件驱动程序。

#### 启动Kernel的swapper进程(pid=0)

该进程又称为idle进程, 系统初始化过程Kernel由无到有开创的第一个进程, 用于初始化进程管理、内存管理，加载Display,Camera Driver，Binder Driver等相关工作。

#### 启动kthreadd进程（pid=2）
这是Linux系统的内核进程，会创建内核工作线程kworkder，软中断线程ksoftirqd，thermal等内核守护进程。kthreadd进程是所有内核进程的鼻祖。

### 硬件抽象层 (HAL)
硬件抽象层 (HAL) 提供标准接口，HAL包含多个库模块，其中每个模块都为特定类型的硬件组件实现一组接口，比如WIFI/蓝牙模块，当框架API请求访问设备硬件时，Android系统将为该硬件加载相应的库模块。

### Native层（ Android Runtime & 系统库）
每个应用都在其自己的进程中运行，都有自己的虚拟机实例。ART通过执行DEX文件可在设备运行多个虚拟机，DEX文件是一种专为Android设计的字节码格式文件，经过优化，使用内存很少。ART主要功能包括：预先(AOT)和即时(JIT)编译，优化的垃圾回收(GC)，以及调试相关的支持。

这里的Native系统库主要包括init孵化来的用户空间的守护进程、HAL层以及开机动画等。启动init进程(pid=1),是Linux系统的用户进程，init进程是所有用户进程的鼻祖。

#### init 进程

init进程是一个由内核启动的用户级进程。内核自行启动（载入内存，开始运行，初始化设备驱动和数据结构）后，系统就通过启动一个用户级程序 init 方式来完成引导。

init进程的pid=1，大部分的服务都由它来启动，主要有3方面工作：
- 解析 init.rc 初始化脚本文件
- 初始化属性服务（property service）。
- 进入无限 for 循环，建立子进程，对关键服务的异常进行重启和异常处理。
  - init进程会孵化出ueventd、logd、healthd、installd、adbd、lmkd等用户守护进程；
  - init进程还启动servicemanager(binder服务管家)、bootanim(开机动画)等重要服务
  - init进程孵化出Zygote进程，Zygote进程是Android系统的第一个Java进程(即虚拟机进程)，Zygote是所有Java进程的父进程，Zygote进程本身是由init进程孵化而来的。


##### 初始化脚本init.rc 

init.rc 是一个系统自定义的脚本，其中操作包括：
- 启动一些系统开启需要启动的service的deamons（承载service的程序）
- 指定不同service在不同的用户或用户组下运行
- 修改设置全局的属性服务
- 注册一些动作和命令在特定的时间执行

##### 属性服务

类似于windows上的注册表，通过键值方式存储信息。例如：
- 内存映射
- 关键配置
- 网络接口配置
- 系统服务开关
- 安全配置
- 。。。

```shell
(base) PS C:\Users\leo\Downloads\root_tools\ADB> .\adb.exe shell
HWNXT:/ $ getprop |grep dns
[hw.wifi.dns_stat]: [15,5,27,1,113]
[hw.wifipro.dns_err_count]: [4,0,0,0,0,0]
[hw.wifipro.dns_fail_count]: [18]

HWNXT:/ $ getprop |grep service
[bastet.service.enable]: [true]
[drm.service.enabled]: [true]
[hwservicemanager.ready]: [true]
[init.svc.dpeservice]: [running]
[init.svc.gnss_service]: [running]
[init.svc.hal_gnss_service_1]: [running]
[init.svc.hisupl_service]: [running]
[init.svc.hwservicemanager]: [running]
[init.svc.logcat_service]: [stopped]
[init.svc.logctl_service]: [stopped]
[init.svc.mediacomm@2.0-service]: [running]
[init.svc.nfc_hal_ext_service]: [running]
[init.svc.restart_logcat_service]: [stopped]
[init.svc.servicemanager]: [running]
[init.svc.vndservicemanager]: [running]
[persist.service.hdb.enable]: [true]
[persist.service.tm2.tofile]: [false]
[ro.config.hw_smartcardservice]: [true]
[ro.hdmi.service]: [false]
[ro.property_service.version]: [2]
[ro.tui.service]: [true]
[ro.vr_display.service]: [true]
[service.bootanim.exit]: [1]
[service.sf.present_timestamp]: [1]
[system_init.hwextdeviceservice]: [1]

HWNXT:/ $ getprop |grep network
[gsm.network.type]: [Unknown,Unknown]
[ro.check.modem_network]: [true]
[ro.config.full_network_support]: [true]
[ro.config.networkmode_hide_dyn]: [true]
[ro.telephony.default_network]: [8]
HWNXT:/ $

```

#### 服务管理进程 ServiceManager

ServiceManager 在init进程启动后启动，用来管理系统中的Service，例如 Input Method Service，Activity Manager Service...

ServiceManager 有两个重要的方法：
- add_service
- check_service

系统服务通过add_service方法注册到 ServiceManager中，使用时通过check_service检查是否存在。

ServiceManager 主要做3件事：
- 打开 /dev/binder 设备，并在内存中映射一定的空间，例如128KB
- 通知binder设备，把自己变成context_manager
- 进入循环，不停读取binder设备，查看是否有对service的请求，若有就调用svcmgr_handler 回调处理请求

### Framework层


#### Zygote进程

zygote是由init进程通过解析init.rc文件后fork生成的，Zygote进程主要包含：
- 加载ZygoteInit类，注册Zygote Socket服务端套接字
加载虚拟机
- 提前加载类preloadClasses
- 提前加载资源preloadResouces

##### Android Fork
Fork函数继承于linux内核，一个进程，包括代码、数据、资源等都可以通过fork创建一个与原进程完全相同的进程，两个进程可以做相同的事，也可以赋予不同的数据或资源做不同的事。
#### System Server进程

是由Zygote进程fork而来，System Server是Zygote孵化的第一个进程，System Server负责启动和管理整个Java framework，包含:
- ActivityManager
- WindowManager
- PackageManager
- PowerManager等服务。

#### Media Server进程

是由init进程fork而来，负责启动和管理整个C++ framework，包含AudioFlinger，Camera Service等服务。

#### ADB进程

ADB是Android Debugging Bridge的简称，是google提供在pc端管理android设备的工具，采用c/s模式，分为3个部分：
- ADB client，运行在pc上，是各种操作命令。
- ADB server，运行在PC上的后台
- ADB daemon，运行在手机或模拟器后台。


#### 存储类守护进程 Vold

Vold是Volume Daemon，即存储类守护进程。它负责系统的CDROM, usb, MMC卡等扩展存储的挂载任务。支持热插拔。

Vold处理过程大致分为3个部分：
- 创建链接
  - 接收驱动信息，把信息传给应用层；接收应用层命令完成相应功能
  - vold socket，负责vold与应用层的信息传递
  - 访问udev的socket层，负责vold与底层的信息传递
- 引导
- 事件处理


### App层

Zygote进程孵化出的第一个App进程是Launcher，这是用户看到的桌面App；

Zygote进程还会创建Browser，Phone，Email等App进程，每个App至少运行在一个进程上。

所有的App进程都是由Zygote进程fork生成的。

### Syscall && JNI
Native与Kernel之间有一层系统调用(SysCall)层，见[Linux系统调用(Syscall)原理](http://gityuan.com/2016/05/21/syscall/);

Java层与Native(C/C++)层之间的纽带JNI，见[Android JNI原理分析](http://gityuan.com/2016/05/28/android-jni/)。

## 通信方式

无论是Android系统，还是各种Linux衍生系统，各个组件、模块往往运行在各种不同的进程和线程内，这里就必然涉及进程/线程之间的通信。

对于IPC(Inter-Process Communication, 进程间通信)，Linux现有：
- 管道
- 消息队列
- 共享内存
- 套接字（通用，但效率不高，开销较大）
- 信号量
- 信号等这些IPC机制
- Android 的 Binder IPC机制

- Android OS中的Zygote进程的IPC采用的是Socket机制
- 在上层system server、media server以及上层App之间更多的是采用Binder IPC方式来完成跨进程间的通信。
- 对于Android上层架构中，很多时候是在同一个进程的线程之间需要相互通信，例如同一个进程的主线程与工作线程之间的通信，往往采用的Handler消息机制。

想深入理解Android内核层架构，必须先深入理解Linux现有的IPC机制；对于Android上层架构，则最常用的通信方式是Binder、Socket、Handler，当然也有少量其他的IPC方式，比如杀进程Process.killProcess()采用的是signal方式。下面说说Binder、Socket、Handler：

### Binder
Binder作为Android系统提供的一种IPC机制，无论从系统开发还是应用开发，都是Android系统中最重要的组成，也是最难理解的一块知识点，想了解为什么Android要采用Binder作为IPC机制？ 可查看我在知乎上的回答。深入了解Binder机制，最好的方法便是阅读源码，借用Linux鼻祖Linus Torvalds曾说过的一句话：Read The Fucking Source Code。下面简要说说Binder IPC原理。

#### Binder IPC原理

Binder通信采用c/s架构，从组件视角来说，包含Client、Server、ServiceManager以及binder驱动，其中ServiceManager用于管理系统中的各种服务。

<img src="images/android01/binderipc通信原理图.jpg">

想进一步了解Binder，可查看[Binder系列—开篇](http://gityuan.com/2015/10/31/binder-prepare/)，Binder系列花费了13篇文章的篇幅，从源码角度出发来讲述Driver、Native、Framework、App四个层面的整个完整流程。根据有些读者反馈这个系列还是不好理解，这个binder涉及的层次跨度比较大，知识量比较广，建议大家先知道binder是用于进程间通信，有个大致概念就可以先去学习系统基本知识，等后面有一定功力再进一步深入研究Binder机制。

### Socket
Socket通信方式也是C/S架构，比Binder简单很多。在Android系统中采用Socket通信方式的主要有：

- zygote：用于孵化进程，system_server创建进程是通过socket向zygote进程发起请求；
- installd：用于安装App的守护进程，上层PackageManagerService很多实现最终都是交给它来完成；
- lmkd：lowmemorykiller的守护进程，Java层的LowMemoryKiller最终都是由lmkd来完成；
- adbd：这个也不用说，用于服务adb；
- logcatd:这个不用说，用于服务logcat；
- vold：即volume Daemon，是存储类的守护进程，用于负责如USB、Sdcard等存储设备的事件处理。

还有很多，这里不一一列举，Socket方式更多的用于Android framework层与native层之间的通信。Socket通信方式相对于binder比较简单，这里省略。

### Handler
Binder/Socket用于进程间通信，而Handler消息机制用于同进程的线程间通信，Handler消息机制是由一组MessageQueue、Message、Looper、Handler共同组成的，为了方便且称之为Handler消息机制。

有人可能会疑惑，为何Binder/Socket用于进程间通信，能否用于线程间通信呢？

答案是肯定的，对于两个具有独立地址空间的进程通信都可以，当然也能用于共享内存空间的两个线程间通信，这就好比杀鸡用牛刀。

接着可能还有人会疑惑，那handler消息机制能否用于进程间通信？

答案是不能，Handler只能用于共享内存地址空间的两个线程间通信，即同进程的两个线程间通信。很多时候，Handler是工作线程向UI主线程发送消息，即App应用中只有主线程能更新UI，其他工作线程往往是完成相应工作后，通过Handler告知主线程需要做出相应地UI更新操作，Handler分发相应的消息给UI主线程去完成，如下图：

<img src="images/android01/handler_thread_commun.jpg">


由于工作线程与主线程共享地址空间，即Handler实例对象mHandler位于线程间共享的内存堆上，工作线程与主线程都能直接使用该对象，只需要注意多线程的同步问题。工作线程通过mHandler向其成员变量MessageQueue中添加新Message，主线程一直处于loop()方法内，当收到新的Message时按照一定规则分发给相应的handleMessage()方法来处理。所以说，Handler消息机制用于同进程的线程间通信，其核心是线程间共享内存空间，而不同进程拥有不同的地址空间，也就不能用handler来实现进程间通信。

上图只是Handler消息机制的一种处理流程，是不是只能工作线程向UI主线程发消息呢? 其实不然，可以是UI线程向工作线程发送消息，也可以是多个工作线程之间通过handler发送消息。更多关于Handler消息机制文章：

- [Android消息机制-Handler(framework篇)](http://gityuan.com/2015/12/26/handler-message-framework/)
- [Android消息机制-Handler(native篇)](http://gityuan.com/2015/12/27/handler-message-native/)
- [Android消息机制3-Handler(实战)](http://gityuan.com/2016/01/01/handler-message-usage/)


要理解framework层源码，掌握这3种基本的进程/线程间通信方式是非常有必要，当然Linux还有不少其他的IPC机制，比如共享内存、信号、信号量，在源码中也有体现，如果想全面彻底地掌握Android系统，还是需要对每一种IPC机制都有所了解。

列举一下Android系统的核心知识点概览：

<img src="images/android01/android_os.png">




## 系统启动

<img src="images/android01/android-booting.jpg">

### Android系统启动-概述

Android系统中极其重要进程：init, zygote, system_server, servicemanager 进程.

- init进程	Linux系统中用户空间的第一个进程, Init.main
- zygote进程	所有Ａpp进程的父进程, ZygoteInit.main
- system_server进程(上篇)	系统各大服务的载体, forkSystemServer过程
- system_server进程(下篇)	系统各大服务的载体, SystemServer.main
- servicemanager进程	binder服务的大管家, 守护进程循环运行在binder_loop
- app进程	通过Process.start启动App进程, ActivityThread.main

再来看看守护进程(也就是进程名一般以d为后缀，比如logd，此处d是指daemon的简称), 下面介绍部分守护进程：

- debuggerd
- installd
- lmkd
- logd




## android 分区

分区是逻辑层存储单元用来区分设备内部的永久性存储结构。

不同厂商、不同版本所用的分区布局可能不同。

### Android系统分区介绍

hboot——系统开机引导类似电脑BIOS，这块刷错手机就会变成砖
radio——通讯模块、基带、WIFI、Bluetooth等衔接硬件的驱动软件
recovery——系统故障时负责恢复
boot——Linux嵌入式系统内核
system——系统文件、应用
cache——系统运行时产生的缓存
userdata——用户使用APP产生的缓存数据

### Android 版本

- Android 5（Lollipop，棒棒糖）
- Android 6（Marshmallow，棉花糖）
- Android 7（Nougat，牛轧糖）
- Android 8（Oreo，奥利奥）

