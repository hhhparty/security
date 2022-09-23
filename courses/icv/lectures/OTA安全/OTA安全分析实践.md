# OTA 安全分析实践

## Tesla OTA 安全分析
来源：
https://www.pentestpartners.com/security-blog/reverse-engineering-the-tesla-firmware-update-process/

Tesla Model S 如何升级它的固件？在逆向分析其显示和仪表盘时有何发现？

### CID VCM 软件架构

CID 是一个大型复杂系统，比一般ECU都要复杂。它的操作系统是全版本的ubuntu。

在内核中，我们看到了自定义的元素，例如 Harman Redbend， 这个kernel 由 Linaro 工具链构建。

为了符合开源软件的使用要求/法律要求，Tesla 公开了内核源代码的一部分。然而这对逆向意义不大，因为这只是一小部分内容。

### Bootloading the VCM
这类似于许多Tegra 设备。

BPMP（Boot and Power Management Processor）是Tegra SoC的第二个处理器。他是一个ARM7 处理器，且执行了一个存储在ROM中的只读bootloader。为了测试它，我们关闭了Tegra 的主处理器。

当BPMP ROM 引导加载程序从NOR 闪存读取一段数据时，会提供大量信息，这称为 BCT （Boot configuration Table）。信息包括下列内容：
- 内存中几个bootloaders的地址
- 从哪里导入bootloader 进入 SDRAM
- 在SDRAM中的bootloader 入口点
- 连接到系统的SDRAM 的配置信息

BPMP 在拷贝bootloader第一部分到SDRAM后开始执行。这时，我们没有打开Tegra主芯片的开关。

bootloader第一阶段可被称为 QUICKBOOT ，他的大小大约是 56KiBytes。很明显他使用了 AES-CMAC 消息验证码。可以在U-boot的[开源bootloader ](https://github.com/u-boot/u-boot/commit/b149c4c399b111cec1ff7505ca9fabbeeb4fe394)中的字符串中找到“AES-CMAC Xor” 。

<img src="images/tesla/stringsfrom1stagebootloader.webp">


一个猜测是这个bootloader 是基于 U-boot，但是特定的加密算法是被Nvidia 编写，因此Nvidia可以在其他地方自由使用。

当第一阶段bootloader正确启动这个SoC时，主处理器加电启动。第二阶段的bootloader 然后会加载，允许主芯片运行。

当我们解压并运行这个内核时，我们发现这个第二阶段bootloader 是非常简单的。我们不能看到任何加密保护的痕迹。看起来没有给予任何广泛使用的bootloaders，所以我们猜他是自定义的。

大致遵循了（Loosely following）Android bootimg 格式，内核映像由一个文件内核和ramdisk组成。

有一个脚本名为/sbin/init-stage-0.sh 会在内核启动后就运行起来。他的主要目的是通过mounting NAND flash 分区来构建系统完整的功能。

### NOR flash
在NOR flash中，发现了 BCT，第一阶段和第二阶段bootloader，内核。

<img src="images/tesla/layoutofnorflashoncid.webp">

我们发现很多的分区被镜像到主分区和恢复分区。

### NAND flash

- /usr/filesystem
这里以Sqaushfs 文件系统存储， /usr/filesystem 包含了二进制和脚本，它们是只读不能改的。通常在低资源嵌入式系统中，SquashFS 是压缩的只读的文件系统，占用较小的flash 存储空间。 

- /var/
该目录包含了logs，是一个笑的 128 MB 的 ext4 文件系统

- /home/
这个目录被安排在剩下的flash空间下，ext4文件系统，存储了更急文件和 短期临时（transient） 数据。

/var和/home 其实覆盖在只读文件系统上，只允许读取/写入少数几个目录，意味着大多数文件系统都是只读的。


### Dual - Bank 固件

在初始化ROM bootloader 运行后，bootloading 进程有两个镜像选择：

- ROM bootloader ： 仅一个单一拷贝可获得，他不可改变也不大可能失效，除非有严重的（catastrophic）硬件故障。
- stage1_primary 和 stage1_recovery ： 这个stage1会被ROM bootloader 顺序地选中加载运行。如果第一个stage1_primary运行失败了会运行这第二个stage1_recovery。两个bootloaders 看起来几乎一样，除了在内存中的位置不一样。
- stage2_primary 和 stage2_recovery，此处运行的引导加载程序由运行的 stage1 引导加载程序决定。同样，这两个引导加载程序看起来几乎相同，除了内存中的位置
- kernel_a/kernel_b – 这两个内核在启动参数方面非常不同
- 系统启动时可以挂载 online/offline usr分区

下面是两个kernel 的启动参数：

<img src="images/tesla/kernel启动参数.png">

init-stage-0.sh 脚本读取 thispartid 的值，并加载两个 /usr/squashfs 分区之一。如果一个损坏，另一个可以用来恢复。

我们还可以看到 AppArmor 正常启用。这种强制访问控制系统允许内核将二进制文件限制在有限的资源集中。Ubuntu 默认启用此功能。特斯拉的配置看起来是标准的。


### 安全启动

Tegra 支持安全启动，但是他相关的文档和代码示例看起来很零散。在开发者论坛中，关于如何实现它存在一些困难，这在高端处理中很常见。

我们无法验证安全启动的使用程度，但我们确实发现了几件事：

- BCT 的签名由 ROM 引导加载程序通过内部存储的密钥进行验证。这称为 SBK。AES-CMAC 是 BCT 的一部分并经过验证。这是对称加密——如果发现密钥，就可以生成有效的 BCT。我们无法确定 SBK 是每个设备/车辆唯一的，还是更大的群体通用的。我们需要访问多辆汽车来确定这一点。或者，仅在内部存储公钥，Tegra 可以使用公钥加密。即使发现了公钥，仍然无法生成正确签名的 BCT 图像。这是对称密钥的更强大的替代方案。据我们估计，软件支持在 2015 年之前没有到位 - 在部署 Tesla CID 之后。


- 第一阶段引导加载程序执行第二阶段引导加载程序的 AES-CMAC。我们无法确定此处使用了哪个密钥，但 Tegra 文档表明也可以使用 SBK。

- 第二阶段引导加载程序只执行内核的 CRC。如果信任链被破坏，攻击者可能会在此阶段将恶意内核加载到设备上。

### 用户空间软件
CID 启动后进入用户空间。

一系列 Qt 二进制文件呈现 CID 的用户界面。我们只对这些进行了非常有限的逆向工程。8 个字符的 PIN 保护 CID 上的服务菜单，该菜单似乎每天都在变化，由 CID 实施。

Shell 脚本在车辆中实现了大量的功能。逆向工程很容易，因为这些是人类可读的文本文件。

### 固件更新机制
我们观察到多种固件更新机制。

从车辆到特斯拉系统的 VPN 连接是所有机制的核心。我们没有观察到任何其他形式的传输加密；来自 CID 的所有请求都是使用未加密的 HTTP 发出的。

我们看到了以下更新机制：

- Shell 脚本——看起来像一个遗留系统，但与后来的更新程序二进制机制有很多共同之处。
- 更新二进制——一个大型的多调用二进制轮询更新，下载它们，并可以将它们应用到系统中。
- 内核/引导加载程序——内核和引导加载程序由特定的二进制文件更新。
- 地图 – VPN 连接用于下载地图数据
- 传统 ECU——通过 CAN 网关将固件更新从 CID 分发到 ECU，使用了一个复杂的过程。
- 用于 Wi-Fi 模块和蜂窝调制解调器的 USB 固件。
我们在下面考虑每一个。

下面具体看一个：
#### VPN 连接

CID 负责连接 Tesla 服务器的OpenVPN。每辆车的密钥和证书会用于建立这个VPN连接。车辆的VIN 是证书的subject。

<img src="images/tesla/VPNkey例子.png">

我们能够通过本地访问 CID 从文件系统中提取这些密钥，然后在另一台机器上使用它们连接到 Tesla 专用网络。这些密钥于 2018 年 5 月 31日到期。如果它们此后没有通过固件更新进行更新，则似乎没有后备机制。

安全配置VPN后，中间人攻击就不可能拦截或篡改通信了。

VPN 可以通过wifi或蜂窝网建立连接，Tesla车对WIFI有较好的支持，为了降低成本。

连接VPN时，自动建立了许多路由：
- 32.0.0/16
- 33.0.0/16
- 224.0.0/24
- 232.75.0/24
- 232.79.0/24


根据特斯拉漏洞赏金的条款，对这些范围进行了全端口扫描，只发现了少数主机：
- vn.teslamotors.com – 车辆数据和状态、用于访问诊断和 IC SSH 的安全令牌更新
- vn.teslamotors.com – 固件下载和更新
- Firmware-bundles.vn.teslamotors.com – 已失效的固件更新服务器
- vn.teslamotors.com – 地图数据和更新

根据先前有关特斯拉安全的报告，VPN 密钥存储在连接到网关的大 SD 卡上。通过移除 SD 卡，这些可以很容易地恢复。被测车辆不是这种情况；在这里，它们存储在 CID 中 VCM 上的 NAND 闪存上。

<img src="images/tesla/tesla固件服务器.webp">


<img src="images/tesla/来自tesla固件服务器的json响应.webp">

### shell 脚本加固更新


我们在 Tesla 文件系统上发现了一种传统的固件更新机制，使用一系列 shell 脚本来执行更新。它提供了许多有用的信息，即使它不再可操作（没有返回有效的下载 URL）。


#### 握手固件下载
通过 Tesla VPN，shell 脚本 /local/bin/do-firmware-handshake 获取并安装固件更新。

该脚本可以通过多个来源/方式启动：
- 定期使用 upstart 事件管理器
- （虽然在操作中没有看到）响应了名为“firmware-handshake”的upstart事件
- 手动（虽然未观察到，但在文件的注释中注明了）

该脚本从high-level获取并应用更新，如下所示。

该脚本使用哨兵（sentinel）文件检查是否正在进行现有升级。

用于解压升级包并安装它的 shell 脚本会检查“unpack.sh”脚本是否正在运行。如果正在进行升级，则 Do-firmware-handshake 退出，因为更新已经在进行中。

如果哨兵文件少于 20 分钟，可以假设网关正在处理升级并且 do-hardware-handshake 退出。因此，不对网关执行主动检查以查看它是否被占用。如果超过 20 分钟，则假定网关更新已挂起，并且握手过程继续。

要查看 VPN 是否已连接，脚本会检查接口 tun0 是否存在。如果 VPN 未连接，脚本会等待 30 秒再试一次。没有主动尝试建立 VPN 隧道——另一个外部进程执行此操作。

一旦VPN 连接建立后，脚本会与下列url建立一个连接：`http://firmware.vn.teslamotors.com:4567/vehicles/<VIN>/handshake`。

可以看到下列数据：

`vehicle_hardware_configuration_string` 这个字符串– 从 “Hardware IDs” 获得, 这是一个逗号分隔的字符串，描述车辆的配置，由网关存储。另一个shell脚本 /usr/local/bin/vehicle_hardware_configuration_string, 生成此字符串。格式如下：

`gtw:6,bms:41,di:22,pm:22,thc:3319968,dcdc:33619968,chgvi:50397184platform_release` 这个字符串可以从 /etc/swver, 读出，这是一个运行在CID 上的软件版本。

然后服务器会返回一个JSON 字符串，通常包含以下内容：
- Firmware_download_url – the location of the file we will be downloading
- Firmware_download_file_md5 – the MD5 checksum of the file we will be downloading
- Download_status_url – a URL to post back the status of the upgrade
- Vehicle_job_status_url
- Unpack_size – size of the unpacked firmware file
- Install_size – size required to install the firmware file


我们发现仍然可以提出这些请求并接收响应。至关重要的是，我们发现可以使用 VPN 为另一辆车请求任何 VIN。

我们惊讶地发现，JSON 响应不是像 jq 这样强大的解决方案，而是使用 awk、gsub 和 split 手动解析的。然后对这些字段进行一些基本的完整性检查。

为了表明升级已经开始，download_status_url 存储在哨兵文件中。

通过对该文件发出 HTTP HEAD 请求，然后检查firmware_download_url 文件的大小。我们认为这是一种奇怪的机制，因为它可以简单地在 JSON 响应中传输。在获得的所有响应中，firmware_download_url 指向服务器firmware-bundles.vn.teslamotors.com。尽管是通过握手过程发出的，但没有一个链接起作用。

使用 JSON 响应中的 unpack_size 和 install_size，对闪存文件系统上的空闲空间执行基本检查。

为防止 CID 休眠 60 分钟，CID 上运行的 Web API 会向4035端口发出请求。

现在下载文件。它作为一个部分下载，而不会以任何方式分块或拆分。如果它不是预期的大小，则再次尝试下载。无法绕过这种情况，否则脚本可能会陷入无限循环。

对于测试期间获得的示例firmware_download_url，这些文件只能通过Tesla VPN 下载。

然后根据预期值检查文件的 md5 校验和。如果文件不匹配，则进一步尝试下载文件。

下载文件后，系统会通过 CID 屏幕上的弹出窗口提示用户进行升级。另一个 名为/usr/local/bin/get-response 的 shell 脚本执行此操作。它向在端口 4070 上的 CID 上运行的 Web API 发出请求，并等待一个小时以获得响应。

如果用户接受更新，下载的文件将移动到 /home/tesla/dropbox，准备安装。

### USB 更新
使用 USB 记忆棒（stick），也可以将更新文件放入 /home/tesla/dropbox。Shell 脚本 /usr/local/bin/usb-upgrade 执行此操作。

该脚本在文件夹 /toinstall 中查找文件，文件名格式为：

`ui_full_package_*_<代码>_pedigree_v*.tar.gz`

使用下表，从车辆的 VIN 号查找 `<code>`：

<img src="images/tesla/由USB更新时certain-vins被获取.webp">


上面的表，显示了有一些开发样车被预制在了程序里。

如果 CID 上的软件的当前版本不在此文件名中，则该文件将复制到保管箱然后安装。由于检查是幼稚的并且忽略了实际版本，这将允许固件升级和降级发生。

脚本中似乎存在漏洞。如果脚本中不存在车辆的 VIN，则返回的 `<code>` 会是空白。这会导致以下形式的文件匹配：

ui_full_package_*__pedigree_v*.tar.gz

在 USB 记忆棒上的给定文件夹中，攻击者似乎可以放置精心制作的固件更新文件并执行任意代码。我们尝试了很多次，但无法触发它。另一个安全控制是阻止调用脚本，但我们无法确定它是什么。

### Dropbox 安装

脚本 unpack.sh ，位置在 /local/bin，而安装包放在 /home/tesla/dropbox 文件夹中。这个脚本描述了过程冰有不少的注释。

尽管是自定义的，这个安装包的格式是非常简单的，攻击者很容易重新生成。

对于脚本描述的过程，概括来看，过程如下：
- 检查提供的文件名以及文件是否存在
- 另一个脚本（/usr/local/bin/car-is-parked）执行这个检查车辆是否处在“parked” 状态。在CID的4035端口上，会产生一个http请求到一个web api来检查这个车是否在“park”， car-is-parked 脚本包含了检查速度为0的功能，但是没有调用。

- 脚本等待5分钟并再次检查车辆是否静止。
- 为了防止CID随眠20分钟，接下来会有一个web api发送请求到4035.
- 使用工具程序 mktemp，在 /home/tesla/unpack.tmp-XXXXX 中创建一个临时目录。
- tar文件被压缩到临时目录中

检查是否存在4个文件：
- 包名
- 包的版本号
- 包中文件的 md5sums
- tar.gz – 与包关联的文件

该进程不检查它是否存在，但它期望文件“install.sh”存在。

为了检查文件的完整性，文件 md5sums 被提供给工具 md5sum。这不会增加安全性，纯粹是完整性检查。

将名称、版本和 data.tar.gz 作为参数传递，执行文件 install.sh。为了最终控制软件包的功能，install.sh 可以执行 root 用户通常可以执行的任何操作。

install.sh 文件可以包含任意命令，并且整个过程以 root 身份运行。为了取得控制权，攻击者可以将有效的升级包放入dropbox中，对 CID 或 IC 执行任意操作。

我们看到的升级脚本中的注释表明，这个过程并不健全并且存在问题：

<img src="images/tesla/升级脚本中的注释.webp">

这种机制远非安全，在 VPN 提供的传输加密之外几乎没有保护。这可能是它被弃用的主要原因。

我们不知道为什么它仍然存在于系统中。开发人员可能担心删除众多脚本之一可能会导致意想不到的后果。

### 升级程序更新

我们认为这是更新固件的正常机制。它是一个包含大量功能的大型单体二进制文件。幸运的是，静态链接（即，所有代码都编译到其中）和调试构建（它包含通常会被剥离的字符串和函数名）来加速了逆向工程的进程。

<img src="images/tesla/staticlinkedwithdebuginformation.webp">

通过更改二进制文件的名称来激活，更新程序可以采用几种不同的“个性化”方式。每一个都可以打开一个命令 port 和一个HTTP port，监听设备的所有接口。

- ic-updater – IC 的更新程序。为命令打开端口 28493，并将 21576 作为 Web 服务器监听口。
- cid-updater – CID 的更新程序。为命令打开端口 25956，并将 20564 作为 Web 服务器监听口。
- gwxfer – 用于将文件传输到网关，gwxfer shell 脚本的二进制替换。
- sm-updater – 不清楚“sm”指的是什么。这可能是工厂使用的东西，因为二进制文件的其余部分都引用了“sitemaster”。
- ethdeploy – 似乎是一种将软件包部署到车辆内其他设备的方法
- upackager – 与网关相关，为 release.tgz（ECU 更新）和 internal.dat（车辆配置）和 vhcs（车辆配置字符串）获取参数

<img src="images/tesla/不同个性化的不同命名.webp">

根据以哪个名称开头，二进制文件的行为有所不同；这包括它执行的服务、它使用的路径和技术。该代码引用了存储个性超过 330 次的变量。

为了便于根据个性判断代码何时出现偏差，0 对应 IC，1 对应 CID，5 对应 SM。

<img src="images/tesla/不同个性化命令和http对应端口.webp">


将更新程序作为“cluster”运行，系统旨在与多个设备（CID 和 IC）一起工作。通过 VPN 连接并下载固件，CID 充当master。在代码中称为“relay”，然后使用 command/HTTP 端口将固件分发到 IC。

更新程序在启动时执行某些任务，例如检查当前系统、出站连接到固件服务器（称为“握手”）以及启动命令和 Web 服务器。

<img src="images/tesla/基于个性化的代码条件执行过程.webp">

尽管可以看到一些errors，这可能是因为在 QEMU 中运行的原因。二进制程序开启了两个监听服务。

<img src="images/tesla/在模拟器中运行ic更新程序.webp">


二进制文件在初始化期间执行自身的 sha512 哈希。我们惊讶地发现，虽然 sha512 输出了 64 个字节，但只保留了前 8 个字节。这意味着可以使用蛮力找到哈希冲突。

<img src="images/tesla/hash-self执行二进制sha512哈希.webp">

截断的sha512哈希输出
<img src="images/tesla/截断的sha512哈希输出.webp">

文件正常sha512sum

<img src="images/tesla/文件正常sha512sum.webp">

稍后，当向固件更新服务器发出请求时，此哈希将用作 User-Agent 字符串的一部分。

<img src="images/tesla/hash被放入请求中.webp">

攻击者可以在运行替代恶意软件时报告预期的 sha512 哈希，尽管这意味着服务器可以确定哪个版本的更新程序正在使用中。它不是针对恶意行为的有力保护。

由定时器或按需执行，更新程序可以处理缓冲区中的一系列命令。它们可以通过 cid-updater 或打开的命令端口输入，允许特斯拉以太网网络上的其他设备执行操作。

以下是任务“fwheartbeat”以 1 小时间隔启动并调用函数 start_regular_timer 的示例：


<img src="images/tesla/fwhearbeat 添加到计时器上.webp">

通过调用函数do_after_e_ms，也可以在一段固定的时间之后运行一个命令。以下是重新启动固件下载的示例：

<img src="images/tesla/经过一段时间后正在下载重新启动.png">

这些命令由字符串引用，可以采用许多值，存储在一个大数组中。

<img src="images/tesla/命令数组.webp">

使用不同的参数，命令“install”和“patch”最终都会调用函数 do_install。

与交互式命令处理器一样，进程的命令端口提供使用提示和其他帮助。

<img src="images/tesla/Example of the ic-updater being asked to serve a file over HTTP.webp">

Downloading the served file over HTTP:
<img src="images/tesla/Downloading the served file over HTTP.webp">

Current status reported over command port

<img src="images/tesla/Current status reported over command port.webp">

需要会话令牌来保护 IC 和 CID 之间的命令。这每天更改一次，并通过 VPN 从 Tesla 服务器同步。如果攻击者能够嗅探 IC 和 CID 之间的连接，则攻击者可以拦截此令牌，并使用它来发送自己的命令。

我们能够将二进制文件置于开发模式。完成此操作后，包括签名检查在内的大部分安全功能都被禁用了。
<img src="images/tesla/开发模式导致签名检查被跳过.webp">


该二进制文件包含大量功能。从高层次上看，最重要的过程如下：

- 握手: 向特斯拉服务器发送包含车辆详细信息的请求并接收响应以对车辆执行操作的过程。
- 基于握手下载和解密各种固件更新文件
- 将下载和解密的固件更新文件（称为 patches（完整固件更新）、bsdiff40（binary difs）或 Redbend deltas（proprietary binary diffs））安装到离线闪存分区中
- Relay: 将固件从 CID 复制到 IC
- Redeploy: 将固件的离线部分复制到在线，以进行恢复 其他功能包含在二进制文件中，但未使用。

### 握手
与 shell 脚本 update 类似，有关车辆的数据使用 VIN 作为key，被送到远程服务器，该服务器会响应任何可用的更新。

对固件服务器的 POST 请求由函数 do_handshake 发出。要从文件连接，这需要固件服务器相关配置（包括服务器名称、端口和路径）。

<img src="images/tesla/configforhandshakerequest.webp">

这里比在shell脚本版本中的更为复杂，包含在POST请求中的数据包括下列内容：
- Vehicle VIN – retrieved and cached from the gateway rather than read from a file. Sent in the path of the request.
- VHCS (vehicle hardware configuration string) – a string based on hwids.txt recovered from the gateway (generated using function fetch_vhcs). Sent as a POST parameter.
- Current firmware signature – read using the function read_firmware_signatures. Reads the firmware signature from the last 40 bytes of the memory partition holding the /usr/ partition. Sent base64 encoded as a POST parameter.

<img src="images/tesla/POST请求中的格式字符串.webp">

函数 request_HTTP 发出 POST 请求。它只能发出 HTTP 请求，不能发出 HTTPS 请求。升级程序的二进制文件根本没有 TLS 功能，这意味着握手总是以明文方式进行，依赖于 Tesla VPN 的安全性。

函数 tun0_is_up 检查 VPN 连接。这里的实现似乎很幼稚，只是检查设备 tun0 是否存在。控制 CID 的攻击者可以在不知道升级程序二进制文件的情况下建立自己的 VPN。

升级程序二进制文件本身似乎没有任何功能来建立 VPN 连接。虽然无法确定是哪一个，但这必须由外部进程执行。

服务器对 HTTP POST 请求给出 JSON 响应。通常，如果请求格式不对或内容不正确，则不会给出响应。

<img src="images/tesla/典型的握手响应.webp">

函数 handle_handshake_download 来处理JSON 响应。

在握手响应中，存在10余个字段。单独的 fields 可能从 JSON copy_handshake_var_at 中获得，他可以根据field name 反馈。在这个函数中，至少有35个不同的字段名，有72处引用了这些名字。

<img src="images/tesla/multiplecallstofindfieldsinthejsonresponse.webp">

这意味着Tesla的固件升级机制是非常复杂的。我们虽然正在测试，但很少看到这些领域被使用。

这是从函数 do_install 中的握手响应中读取的 md5 哈希的示例。

<img src="images/tesla/从响应中读取字段firmware_download_file_md5.webp">

然后调用函数 handshake_is_actionable。如果正在下载、已在 CID 上暂存、正在中继到 IC 或正在安装升级，则握手将被阻止采取行动。

不握手的原因：
<img src="images/tesla/不握手的原因.png">

如果可以进行握手，则调用函数initial_handshake_install。握手响应存储在文件中以供以后处理，并将命令添加到队列中。


### 下载

要下载的文件的握手响应中可以包含三个不同的字段：

- Firmware_download_url – 常规更新，根据 shell 脚本方法
- Bsdiff40_download_url – 使用开源解决方案的二进制差异
- Rbdlt_download_url – 专有的 Redbend deltas

使用 HTTP，它们似乎都以类似的方式下载。这是一个示例网址：

<img src="images/tesla/示例网站.webp">

我们注意到这些 URL 的几个有趣特征：

- 为响应每个握手请求而生成，并且显然是唯一的
- 收到握手响应后，有效期始终为两周。
- 出现 HMAC（散列消息验证码）以检查请求其余部分的完整性。
- 下载它们的服务器可从公共 Internet 获得，无需建立 VPN 连接。

由于期限限制（expiry）和 HMAC，我们无法猜测或暴力破解其他固件下载链接。

值得注意的是，由于下载是在公共互联网上使用 HTTP（无加密）执行的，因此存在拦截和篡改的风险。

字段 firmware_download_file_md5 检查下载的完整性。虽然哈希是通过安全 VPN 下载的，但文件是通过公共 Internet 下载的。如果攻击者篡改了下载，MD5 哈希很可能不再匹配。

Wi-Fi 或蜂窝连接可用于执行下载。另一个字段 wifi_wait_until 将允许在有限的时间内通过 Wi-Fi 进行下载。我们认为这是为了避免通过蜂窝连接下载的成本，同时允许它们进行必要的更新。

从固件握手响应中可以看出，有一些关于密码学的字段：

<img src="images/tesla/The crypto key for a firmware download over open Internet.webp">

Salsa20 - 一种轻量级算法 - 可用于加密下载的更新文件。函数decrypt_and_save_file 实现解密。

握手响应通过 VPN 发送整个 256 位密钥，因此应保持安全，防止通过 Internet 下载的固件被拦截。

我们看到的所有下载文件都是加密的。应该可以发送未加密的文件，但我们没有看到任何证据。

### 安装

可以更新系统的许多不同方面：
- /usr 分区
- kernal
- bootloader 引导加载程序


/usr 分区更新涉及更新程序二进制文件中的大部分功能。系统为此分为在线和离线 usr 分区。在每一点上，它们都被当作原始内存设备（例如，/dev/mmcblock0p1）来处理，尽管它们被称为 usr，而不是被挂载的文件系统。“usr”是指存储设备的只读方面。

一般来说，似乎大多数固件更新都应用于离线分区。然后可以将在离线分区中所做的更改复制回在线分区，或直接从离线分区运行。

为了从脱机分区执行更改，会发生以下情况：

- 对离线分区所做的更改（使用 patch、bsdiff 或 Redbend）
- 检查在线和离线分区的签名以确保正确应用补丁。
- 离线分区挂载为/newusr；然后可以执行 /newusr/deploy/ 的内容


将更改从离线复制到在线时会发生以下情况：
- 对离线分区进行了更改（使用 patch、bsdiff 或 Redbend）
- 检查在线和离线分区的签名以确保正确应用补丁。
- 更新然后“重新部署”固件，这涉及将引导加载程序、内核和 usr 分区复制到在线分区。

将更改应用到脱机分区意味着系统可以在固件更新时继续运行。这似乎与恢复分区的概念背道而驰，因为它们首先被覆盖。由于使用了多个校验和和签名，汽车应该很难变砖。

从传递的参数可以看出，更新程序二进制文件通过对上述示例更新程序进行系统调用来对内核和引导加载程序进行更新。


选择 cid/ic/sm-udpate_sample
<img src="images/tesla/选择 cid-ic-sm-udpate_sample.webp">

调用 *-update_sample
<img src="images/tesla/调用-update_sample.webp">

应用更改的方法可能会有所不同。

### Conventional full update

tar.gz 文件被下载、解压，并运行一个 shell 脚本来执行更改，几乎与上面的 shell 脚本固件更新相同。

### Bsdiff 固件更新
通过 HTTP 下载、解密然后安装，一些固件更新是 bsdiff 二进制差异文件。

函数 patch_from_bsdiff40_to_offline_dev 应用更新。

patch_from_bsdiff40_to_offline_dev 函数overview：
<img src="images/tesla/Overview of patch_from_bsdiff40_to_offline_dev function.webp">




/this ，总体来看，执行以下操作：

- 检查下载的文件是否为 BSDIFF40 格式。
- 使用静态链接的 bzip 函数开始处理 BSDIFF40 文件
- 确定哪些闪存存储库是脱机 usr（未使用）存储库。
- 在整个脱机 usr 分区上应用二进制差异

在原始闪存级别运行，该进程完全不知道文件系统或其中包含的文件。在应用更新之前，它要求 /usr 分区未修改。整个分区是只读的且没有问题对。为确保起点符合预期，在应用更新之前执行签名检查。

### Redbend 固件更新
Tesla CID 可以使用 Redbend 执行更新，作为 bsdiff 的替代方案。这将获取并应用包含当前固件和新固件之间差异的更新文件（“增量”）。虽然它也出现在 Android 手机中，但 Redbend 的营销材料表明它专门针对汽车。

从更新程序中的字符串看来，使用的技术称为 vRM 或 vRapid Mobile。没有详细的技术信息，但在 Internet 上的某些位置提到了这一点。

UPI 或更新安装程序是在 cid-update 中运行的软件。UPG 或更新生成器是另一种创建已部署更新的软件。

更新程序的 Redbend 部分没有下载更新的功能。这仅由 Tesla 代码处理。


Redbend的大量RB_ 前缀函数:

<img src="images/tesla/Redbend的大量RB_ 前缀函数.webp">


DP 文件（Delta package）可以包含多个单独的更新，由 UPI 处理。这些文件有一个 CRC32 校验和，在 Redbend 软件中称为“签名”。这是一个不正确的术语；CRC 仅对非恶意完整性保护有用，对恶意操作无效。


正在使用的RedbendvRM版本

<img src="images/tesla/正在使用的RedbendvRM版本.webp">

应用于系统的 Redbend 和 bsdiff40 更改之间几乎没有实际差异。

### Relay

CID 设计为作为主机，向握手服务器发出请求，下载更新，应用它们，并将它们“Relay” 到 IC。


<img src="images/tesla/ic-updater将拒绝执行握手.webp">


我们相信有几种不同的中继方法，包括发送整个离线 /usr 分区，在 CID 上的 HTTP 服务器上提供单个文件，并请求 IC 下载它们。

在 IC 之前，CID 更新固件。在我们的测试期间，对 CID 的更新没有进行（我们不知道为什么）。没有看到将更新转发到 IC 的过程，因此我们努力确定它是如何工作的。

### 重新部署

一旦更改应用到脱机闪存分区，更新程序将 “redeploy” 固件。在它重新启动设备之前，这似乎将引导加载程序和内核（使用 cid-update_sample 二进制文件）和 /usr 分区复制到在线分区。

与中继一样，我们在测试期间没有观察到这一点，因为 CID 或 IC 都不会接受更新。

### Kernel/bootloader 更新

名为 cid-update_sample 的实用程序可用于更新设备的引导加载程序和内核。我们发现这个文件的命名很奇怪，但是它在其他几个位置被引用。

与主更新程序二进制文件不同，这对 CID 和 IC 没有多重个性.尽管它具有不同的名称，但两个设备上都存在相同的文件。


在模拟器中运行cid-update_sample二进制文件
<img src="images/tesla/在模拟器中运行cid-update_sample二进制文件.webp">


有两个地方调用 cid-update_sample 二进制文件：
- 一个名为 /usr/local/bin/qber 的 shell 脚本会更新 BCT 以及主要阶段 1 和主要阶段 2 引导加载程序。该脚本似乎没有从其他任何地方调用，但可以从下载的固件更新中调用。
- 从 cid-update 或 ic-updater 内部。

有趣的是，这个二进制文件可以执行 BCT 的部分更新。我们在帮助提示中“仅更新 SDRAM 和设备时序”中注意到了这一点。

SBK是存储在 Tegra SoC 内部的 AES 密钥。它对 BCT 中的大部分数据进行签名。签名数据包括 SDRAM 和设备timing（时序）。必须使用 SBK 对文件进行签名以更改 SDRAM 和设备时序。

我们在 /usr/deploy 文件夹中找到了一个示例 BCT 文件。它不包含任何签名或引导加载程序数据，仅包含 SDRAM 和设备时序。

我们得出结论，cid-update_sample 必须检索当前 BCT，合并新的 SDRAM 和设备时序，并对数据重新签名。这意味着二进制文件必须能够访问 SoC 内的 SBK，或者包含它的副本。我们需要做进一步的逆向工程来确认这一点。


更新中的BCT文件不包含所有签名数据

<img src="images/tesla/更新中的BCT文件不包含所有签名数据.webp">



### 地图更新
Mapping 数据由 CID 存储在外部 microSD 卡上。VPN 连接可用于定期更新它。

脚本 /usr/local/bin/nav-sync-and-apply-map-patch.sh 和 nav-apply-map-patch.sh 执行更新它们的机制。

整体来看，它们执行以下任务：
- 确保汽车处于唤醒状态且 15 分钟内不休眠
- 使用 rsync 从 URL ( rsync://filesync.vn.teslamotors.com/mapdata/patches ) 下载更新。Rsync 是一种文件同步工具，可用于通过缓慢或不可靠的网络链接有效地将更改传输到大型数据集。
- 更新包是 tar 文件，之后解压到 SD 卡上。


我们没有看到完整性保护或真实性检查的迹象。

在所有区域，都没有访问控制或身份验证来访问数据，任何拥有有效 VPN 密钥的人都可以下载整个地图数据集。

尽管其他固件的更新程序已经从 shell 脚本转移到已编译的二进制文件中，但地图更新程序仍保留为 shell 脚本。

### 通过网关进行传统 ECU 更新

集成到 CID 中的 Tesla 网关与许多 IVI 架构相类似，具有运行 media/UI 组件的更高功率系统，耦合到功率较低的网关，后者又连接到 CAN 总线。该网关阻止 IVI 注入 CAN 总线。

通过限制网关的功能，可以限制代码的攻击面和复杂性。两者都可能提高安全性。

一般而言，大多数车辆倾向于具有额外的 CAN 网关，将 CAN 总线彼此分开，例如传动系统与车身系统。Tesla CID 中的网关是车辆中唯一的 CAN 网关，也执行此功能。

该网关具有 2MiByte 的集成闪存，有一个 MPC5668G 微控制器。它专用于汽车网关应用，采用 PowerPC 架构的 e200z6 内核。

我们惊讶地发现该器件有完整的数据表和参考手册。这对于汽车专用微控制器来说是不寻常的。

以太网交换机将网关连接到 CID VCM、IC 和诊断端口。这些实体使用各种 UDP 和 TCP 协议进行通信，并且都分配有 IP 地址。

连接到外部 CAN 收发器的是网关上的多个 CAN 接口。还有一个LIN接口。

在CID的主板上，网关直接连接全尺寸SD卡。

在检查我们获得的固件升级时，我们发现网关运行自定义版本的 FreeRTOS。一个小而简单的实时操作系统，它包括线程/任务、互斥体、信号量等功能。常见于汽车应用中。

网关上运行的固件接受通过 UDP 端口 3500 传输的文件。这些传输由 Perl 脚本 /usr/local/bin/gwxfer 或 CID 上的更新程序二进制文件执行。我们在系统上没有发现 Perl 的其他用途。


Perl gwxfer 脚本
<img src="images/tesla/Perl gwxfer script.webp">

此服务没有身份验证。SD 卡存储了发送到网关的所有文件。

常规传输的文件：
- dat ： 车辆配置，启用或禁用某些选项。向网关发送和从网关接收。
- tgz ：包含 CAN 连接 ECU 更新的压缩文件。
- img ：传输到网关，以执行 ECU 更新的替代固件。

internal.dat 的一部分：
<img src="images/tesla/Part of internaldat.webp">

在尝试启用/禁用车辆上的某些功能时，我们无法修改 internal.dat 文件。网关似乎很可能向各个 ECU 发出请求以建立汽车的功能。

UDP 端口 1050 接受某些命令，例如发送/接收 CAN 消息、触发更新等，并且也是开放的。

总体来看，ECU更新流程：

- 使用前面提到的其他固件更新机制之一，CID 下载更新包。

- 更新 ECU 需要两个文件。一个是包含所有单个 ECU 更新的存档，称为“Release.tgz”，另一个是 Noboot.img，它是用于更新其他 ECU 的网关的特定固件。

- 多种机制构建一个 release.tgz 文件。

- 一个“premastered”的版本是第一个版本。无需预处理，此更新将从固件服务器下载并直接应用于 ECU。

- 第二个使用“seeding”。固件更新机制将单个 ECU 更新文件下载到“seed”目录中，然后根据需要更新的 ECU 创建自定义 release.tgz。我们认为这样做的目的可能是减少网关在“update”模式下花费的时间。

- 使用脚本/二进制 gwxfer，文件被传输到网关并直接存储到 SD 卡上。


升级过程中 SD 卡的内容
<img src="images/tesla/Contents of SD card during upgrade.webp">


存储在普通网关固件中的公钥检查 noboot.img 的签名。

当命令发送到网关时，noboot.img 被重命名为 boot.img。boot.img 被复制到 RAM 的 0x40000000 并在网关重新启动时执行。

（我们发现使用 gwxfer 的网关不会直接接受名为“boot.img”的文件——我们试图绕过签名验证）

noboot.img 中包含网关的非常少的正常功能。当网关处于更新模式时，车辆基本上停止运行。我们无法移动车辆。


noboot.img 中的字符串
<img src="images/tesla/Strings from inside the nobootimg.webp">

最近 release.tgz 文件的内容
<img src="images/tesla/Contents of a recent releasetgz file.webp">


noboot.img 中的代码解压缩 Release.tgz 文件，该文件揭示了以下内容：

- 一系列 .hex 文件,用于单个 ECU 的升级
- 包含 .hex 文件列表及其版本的清单文件
- 包含带有签名的文件的 CRC32 的元数据文件

Manifest file：

<img src="images/tesla/Manifest file.webp">


Signed_metadata_map.tsv：
<img src="images/tesla/Signed_metadata_maptsv.webp">



再一次，使用存储在网关固件中的公钥，网关似乎会检查每个文件的 CRC32 和签名。

命名 ECU 的二进制固件包含 .hex 文件。

对 ECU 进行编程时会发生以下情况：
- 为了确保更新安全，执行了规定的操作（例如，使用主接触器断开电池）
- 使用 UDS 安全访问命令，解锁 ECU
- 通过 UDS 发送固件
- 重启ECU

通过直接写入闪存而不是使用 UDS，网关也可以自行更新。文件名是 gtw.hex。


来自网关固件的字符串

<img src="images/tesla/Strings from the gateway firmware.webp">

更新是按顺序进行的。我们观察到的两个固件更新都更新了相同的 ECU，这似乎是车辆中的大部分。我们无法确定是否进行了部分更新。

默认情况下，车辆周围的 ECU 通过 CAN 接口不接受固件更新。它们必须通过 UDS 安全访问通过 CAN 解锁。在固件更新期间，嗅探了几个 UDS 安全访问传输。

我们发现一些 ECU，即 IC，正在使用静态种子/密钥对。其他人似乎正在使用不同的种子。我们没有尝试从单个 ECU 中收集种子来衡量它们随机性的质量。

在 noboot.img 中，有几段代码似乎处理不同的 UDS 种子/密钥算法，但我们无法弄清楚它如何确定给定 ECU 使用哪一个。

发送到 ECU 的固件文件似乎没有任何特定的验证。这可能是由 ECU 本身执行的。

根据对 .hex 文件的分析，没有文件签名。可以使用熵分析来识别数字签名。它们几乎总是高熵。


RCCM 固件的熵
<img src="images/tesla/RCCM 固件的熵.png">

DSP固件的熵

<img src="images/tesla/DSP固件的熵.png">

GTW 固件的熵 – 注意显示可疑密钥/签名材料的尖峰

<img src="images/tesla/GTW 固件的熵.png">


noboot.img 的熵显示高峰值——可能是用于检查签名的公钥

<img src="images/tesla/nobootimg的熵显示高峰值.png">

在以前的 ECU 更新期间，研究发现只执行了 CRC32 检查。这使得该过程容易受到攻击，因为它允许将恶意固件加载到网关上，然后再加载到其他 ECU 上。

似乎有些问题仍然存在。

SD 卡没有完整性保护或签名。攻击者可以修改内容，这可能具有安全问题，例如检查时间到使用时间 (TOCTOU) 漏洞，其中固件签名得到验证，攻击者修改固件，并将其加载到一个ECU。这可能很难利用。

UDS 安全访问用于更新各个 ECU。安全访问是一种简单的质询/响应算法。进入可以执行某些操作的模式会发生以下情况：

- 网关从 ECU 请求种子
- ECU发送种子
- 网关使用算法将种子转换为正确的密钥
- 密钥被发送回 ECU 以启用安全操作
- 通过网关加载到 ECU 的固件

为了防止重放攻击，种子应该是随机的并且有足够的长度。在特斯拉上，ECU 在几种情况下以固定的种子值响应。值得注意的是，这发生在 FPGA 或电源管理微控制器——仪表组中的设备上。

通常以下一项或多项，用于将种子转换为密钥的算法因 ECU 而异：
- 按位异或
- 按位移位
- 混合位
- AES加密（对称加密，双方都知道密钥）
- RSA 加密（非对称加密，ECU 只知道公钥，更新程序知道私钥）

观察种子/密钥对通常会使前三种方法易于逆向工程。所需的对数从几对到数十或数百不等。

由于无法从加密数据中确定密钥，因此 AES 加密通常可以防止攻击者拦截通信。但是，仍然存在可以直接从端点恢复密钥的风险——无论是 ECU 还是对其进行编程的设备。

由于大多数 ECU 是具有集成闪存的微控制器，因此 AES 密钥可以存储在内部，从而防止读取不重要的内容。要以这种方式获取 AES 密钥，攻击者可能不得不竭尽全力。

RSA 加密仅在 ECU 上放置一个公钥。攻击者不可能在没有访问私钥的情况下生成种子/密钥对，即使他们恢复了这一点。这为对称加密增加了额外的安全性。这似乎是 ECU 中比较少见的机制。

编程设备的安全性等同于所有这些方法。攻击者可以恢复算法、AES 密钥或 RSA 私钥（如果他们可以访问），从而激活 ECU 上的 UDS。

传统汽车诊断和编程工具已使用各种技术来确保自身安全：

- 限制向受信任方分发软件（尽管现在这在很大程度上是无效的，因为复制的软件通过 Internet 传播）
- 限制性许可，包括在线激活和硬件加密狗
- 使用硬件加密狗执行种子/密钥转换
- 使用在线服务远程生成种子/密钥对

由于这些技术，攻击 UDS 安全访问种子/密钥算法变得更加困难。

但特斯拉不一样。传统上，可以严格控制的特定笔记本电脑或设备已被经销商或车库用于执行诊断和编程。

特斯拉升级是远程执行的。网关必须实现对车辆中所有 ECU 执行 UDS 安全访问的方法，因为编程设备必须在网关本身中实现。

这使得攻击者很容易得手，恢复和逆向工程。然而，这仍然是一个非常耗时的过程，尤其是考虑到车辆拥有大量的 ECU。

即使种子/密钥过程被认为是安全的，UDS 的整个过程也不应该被认为是安全的，不能完全不受 CAN 总线上的主动攻击者的攻击。网关使用 UDS 解锁设备后，没有什么可以阻止攻击者与设备进行交互。这可以让他们执行代码、读回固件并将他们自己的固件写入设备。

尽管网关会检查 ECU 的单个 .hex 文件的加密签名，但几乎没有证据表明 ECU 会对通过 UDS 发送给它们的固件执行签名检查。

ECU，尤其是更基本的 ECU，很少进行任何固件签名检查。作为固件更新过程的一部分，通常只执行基本检查，例如 CRC 或简单的模块校验和。

### Wi-Fi 和蜂窝调制解调器 USB 固件更新
通过 USB 连接到 CID 中的 VCM，Wi-Fi 模块和蜂窝调制解调器也通过此通道接收更新。

### 无线模块
/usr/local/bin 中的一系列工具和脚本更新了 Parrot FC6050W Wi-Fi 模块。

如果固件更新是通过 shell 脚本方法执行的，则调用脚本 new-pflasher，为加载程序、安装程序和最后的应用程序提供几个参数。然后这个脚本调用二进制 new-pflasher-core。

如果固件更新由二进制更新程序执行，则 pflasher-core 二进制文件直接从函数 do_upgrade_parrot 中调用。

当我们检查位于 /usr/deploy/ 中的固件文件时，我们没有发现任何 Tesla 特定功能。我们也找不到模块的任何通用固件。


Parrot Wi-Fi 模块固件文件
<img src="images/tesla/ParrotWi-Fi模块固件文件.webp">

### 蜂窝调制解调器
无论用于更新调制解调器的机制如何，都会调用 shell 脚本 /usr/local/bin/sierra-update。这调用了将固件发送到调制解调器的二进制 SwiFirmwareDownloadUMTS。

我们在 /usr/deploy/sierra/ 中找到了蜂窝调制解调器的固件。这是两个 .cwe 文件


调制解调器固件文件
<img src="images/tesla/Themodemfirmwarefiles.webp">


与 Wi-Fi 模块一样，我们找不到任何迹象表明该固件具有任何特定的 Tesla 功能。



### 有趣的发现
在调查固件更新机制时，我们发现了许多其他有趣的点。

#### 远程功能启用
为了启用autopilot，shell 脚本 enable-autopilot-after-purchase.sh 更新网关 internal.dat。

我们认为这表明功能可以远程启用和禁用。

Internal.dat 中没有包含范围或电池信息，因此我们无法确定特斯拉如何远程更改这些信息。


启用自动驾驶仪的 shell 脚本

<img src="images/tesla/启用自动驾驶仪的 shell 脚本.webp">

#### 安全令牌更新
必须知道安全令牌——每天通过 VPN 从特斯拉的服务器下载——才能访问诊断程序、以 root 身份登录或在 CID 和 IC 之间发送命令。


curl命令获取安全令牌
<img src="images/tesla/Curl command to obtain security token.webp">


当前安全令牌发布到服务器以获取下一个安全令牌。这可以防止拥有有效 VPN 密钥的人获得任何汽车的令牌。

#### 升级策略
名称范围从“INDIFFERENT”到“SUICIDE_BOMBER”，更新程序二进制文件中有一个升级策略列表，这些策略似乎是重试下载和用户界面上的提示的策略。


<img src="images/tesla/升级策略.webp">

#### 大量使用 Shell 脚本
/usr/local/bin 目录中有 85 个 shell 脚本实现各种功能。

CID 仍然使用其中的许多，尽管其中一些功能已转移到二进制文件中。

许多shell脚本中的一些:
<img src="images/tesla/Some of the many shell scripts.webp">



由于这些脚本中的许多都被大量评论，您可以对它们的功能有一个有趣的了解。

### 进一步的工作
我们只真正看到了特斯拉在这里能做的一小部分。我们最大的障碍是缺乏备件——如果我们有备用 CID，我们可以进行更详细的逆向工程。

仍有待调查的领域：

- 我们还没有探索很多驱动 CID UI 的 Qt 二进制文件。它们包含连接到服务器的功能，包括每日服务菜单 PIN 码算法。
- 我们无法确定特斯拉如何远程更改某些功能（例如，车辆的续航里程）。
- 在我们检查的系统的任何方面，我们都没有发现任何关于被盗车辆跟踪、远程切断或 eCall 的证据。我们很想知道这是如何处理的。
- 我们测试的车辆中没有 Autopilot 模块，在 CID 上也很少提及它。 Autopilot可能会采用额外的安全措施来保护它所包含的重要知识产权。