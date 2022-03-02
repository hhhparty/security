# Android 调试桥 (adb)

Android 调试桥 (adb) 是一种功能多样的命令行工具，可让您与设备进行通信。adb 命令可用于执行各种设备操作（例如安装和调试应用），并提供对 Unix shell（可用来在设备上运行各种命令）的访问权限。它是一种客户端-服务器程序，包括以下三个组件：

- 客户端：用于发送命令。客户端在开发计算机上运行。您可以通过发出 adb 命令从命令行终端调用客户端。
- 守护程序 (adbd)：用于在设备上运行命令。守护程序在每个设备上作为后台进程运行。
- 服务器：用于管理客户端与守护程序之间的通信。服务器在开发机器上作为后台进程运行。

adb 包含在 Android SDK 平台工具软件包中。您可以使用 SDK [管理器](https://developer.android.google.cn/studio/intro/update?hl=zh-cn#sdk-manager)下载此软件包，该管理器会将其安装在 android_sdk/platform-tools/ 下。或者，如果您需要独立的 Android SDK 平台工具软件包，也可以[点击此处](https://developer.android.google.cn/studio/releases/platform-tools?hl=zh-cn)进行下载。



## adb 的工作原理
当您启动某个 adb 客户端时，该客户端会先检查是否有 adb 服务器进程正在运行。如果没有，它会启动服务器进程。服务器在启动后会与本地 TCP 端口 5037 绑定，并监听 adb 客户端发出的命令 - 所有 adb 客户端均通过端口 5037 与 adb 服务器通信。

然后，服务器会与所有正在运行的设备建立连接。它通过扫描 5555 到 5585 之间（该范围供前 16 个模拟器使用）的奇数号端口查找模拟器。服务器一旦发现 adb 守护程序 (adbd)，便会与相应的端口建立连接。请注意，每个模拟器都使用一对按顺序排列的端口 - 用于控制台连接的偶数号端口和用于 adb 连接的奇数号端口。例如：

模拟器 1，控制台：5554
模拟器 1，adb：5555
模拟器 2，控制台：5556
模拟器 2，adb：5557
依此类推

如上所示，在端口 5555 处与 adb 连接的模拟器与控制台监听端口为 5554 的模拟器是同一个。

服务器与所有设备均建立连接后，您便可以使用 adb 命令访问这些设备。由于服务器管理与设备的连接，并处理来自多个 adb 客户端的命令，因此您可以从任意客户端（或从某个脚本）控制任意设备。

### 在设备上启用 adb 调试
如要在通过 USB 连接的设备上使用 adb，您必须在设备的系统设置中启用 USB 调试（位于开发者选项下）。如需在通过 WLAN 连接的设备上使用 adb，请参阅通过 WLAN 连接到设备。

在搭载 Android 4.2 及更高版本的设备上，“开发者选项”屏幕默认情况下处于隐藏状态。如需将其显示出来，请依次转到设置 > 关于手机，然后点按版本号七次。返回上一屏幕，在底部可以找到开发者选项。

在某些设备上，“开发者选项”屏幕所在的位置或名称可能有所不同。

现在，您已经可以通过 USB 连接设备。您可以通过从 android_sdk/platform-tools/ 目录执行 adb devices 验证设备是否已连接。如果已连接，您将看到设备名称以“设备”形式列出。

>注意：当您连接搭载 Android 4.2.2 或更高版本的设备时，系统会显示一个对话框，询问您是否接受允许通过此计算机进行调试的 RSA 密钥。这种安全机制可以保护用户设备，因为它可以确保只有在您能够解锁设备并确认对话框的情况下才能执行 USB 调试和其他 adb 命令。

## push

当我们需要更改系统应用时，编译完系统的应用，会adb push新生成的apk到/system/app下

有时提示文件目录是read-only，我们会adb remount将system分区重新挂载，但是有时会提示：
remount failed: Operation not permitted

此问题解决的方法如下：

1.确保电脑连接上设备了，命令如下：

`adb devices`
2.进入控制台，命令如下：

`adb shell`
3.进入shell后，是当前的user用户，需进入超级用户(有些设备中su命令被禁止，只能将手机root后才行)，命令如下

`# su`

4.设置system分区的挂载，命令如下：
`# mount -o rw,remount -t yaffs2 /dev/block/mtdblock3 /system`

说明：
- `mount -o rw,remount`即以读写模式重新挂载;
- `-t`指定档案系统的型态，通常不指定，mount 会自动选择正确的型态。此处指定为yaffs2。
- /dev/block/mtdblock3 这是一个示例挂载点，具体的情况要根据已有的mount确定，例如在adb shell下运行mount，查看已挂载到system的是什么？又例如： `# mount -o rw,remount /dev/block/sda6 /system`


YAFFS（Yet Another Flash File System）是由Aleph One公司所发展出来的NAND flash 嵌入式文件系统。。mount 会自动选择正确的型态。YAFFS（Yet Another Flash File System）是由Aleph One公司所发展出来的NAND flash 嵌入式文件系统。
在YAFFS中，最小存储单位为一个页（Page），文件内的数据是存储在固定512 bytes的页中，每一页亦会有一个对应的16 bytes的Spare(OOB,Out-Of-Band)。YAFFS采用树形结构（Tree Node Structure），由多个树节点（Tree Node，Tnode）所组成，树节点又分成内部节点（Internal Tnode）与底层树节点(Lowest Level Tree node)，其中内部节点由8个指针（Pointers）所组成，底层树节点由16个入口（Entries）所组成，其时间复杂度（Time Complexity）相当于O(log N)，故地址转换时间较迅速。一旦闪存（Flash Memory）挂载（mount）之时，YAFFS会为每个文件在RAM中创建一棵树, 并随时提供Chunk（即Page, 由yaffs_Object所配置），可是 YAFFS并未完全实现耗损平均技术（wear-leveling）算法，因此还是会造成部分的块（Block）过度访问。
YAFFS在将数据（Data）写入闪存时会运行垃圾回收（Garbage Collection），YAFFS 垃圾回收分成两种模式：主动模式（Aggressive Mode）及被动模式（Passive Mode）, 而且找寻脏块（Dirtiest Block）（最多Invalid Chunk）及查找空块（Empty Block）都是通过线性搜索（Linear Search）的方式（JFFS2是Link List的方式）。YAFFS2不再使用非全页编程（Partial Page Programming）（YAFFS仍使用）。


5.修改system分区的权限未可读可写，命令如下：
`# chmod 777 /system`

6.退出，这时就有系统目录的读写权限了，可以执行adb remount或使用adb push 把文件push到系统目录中，或者删除系统文件。


或者还有一种方式：

1.在电脑终端，将设备root，但是有些设备是无法进行的：

`#adb root`

2.进行remount，重新挂载分区：

`#adb remount`

3.后面可进行push操作。


### push 证书

Android7.0之后，CA证书不在/system/etc/security/cacerts/中的。仍不被信任。不正确导入证书会出现问题：“该证书并非来自可信的授权中心”。按照网上那些老文章，都是导出一个Burp/Charles证书之后，adb push到模拟器，然后修改后缀为crt直接安全，这种方式在Android 6及之前的版本可用，从Android 7.0开始，Android更改了信任用户安装的证书的默认行为，应用程序仅信任系统级CA。这样就导致安装证书后，如果尝试通过Burp或者Charlse代理访问https网站，系统会提示“该证书并非来自可信的授权中心”。

解决方案
我们可以将Burp或者Charles的证书作为系统级别的信任证书安装。建议重新生产burp证书并重启burp后再导出。系统级别的受信任证书以特殊格式存储在/system/etc/security/cacerts文件夹中。我们可以将Burp的证书写入此位置。
导出Burp的证书后，使用openssl来做一些改动：
- 在burpsuite的proxy的options中，点击Import/export CA certificate——Export——Certificate in DER format ，即选择der格式，生成一个der格式证书，命名为PortSwiggerCA.der
- 改变证书格式：`openssl x509 -inform DER -in PortSwiggerCA.der -out PortSwiggerCA.pem`，可以得到PortSwiggerCA.pem
- 计算签名hash值：`openssl x509 -inform PEM -subject_hash_old -in PortSwiggerCA.pem|head -1`，可以得到一个签名hash值，例如 9a5ba575。
- 将证书名改为签名值：`mv PortSwiggerCA.pem 9a5ba575.0`
-  运行`.\nox_adb.exe push .\tmp\9a5ba575.0 /system/etc/security/cacerts/`将证书拷入可信证书的根目录中。注意这里如果没有权限，可参考上面mount方法，以rw模式重新挂载。
- 修改权限 `adb shell chmod 644 /system/etc/security/cacerts/9a5ba575。0`
