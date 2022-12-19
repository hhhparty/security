# CAN-UTILS 介绍

## CAN 控制域网络协议家族（SocketCAN）

socketcan 包是一个CAN协议的linux实现。CAN是一种网络技术，用于车辆、嵌入式设备和自动化领域。SocketCAN 使用了Berkeley socket API，Linux network stack 和 CAN 设备驱动。CAN socket API 设计的类似于 TCP/IP 协议，允许编程者学习和使用。

socketCAN之前的一些产品的问题：
- 许多已有的can实现功能较少、面向硬件设备。
- 对于单个设备在一个时刻，这些程序的帧排队和高级支持仅是一个单一进程，类似于一个串行接口。
- 更换硬件接口往往需要更换驱动。

所以 socketcan 设计用于克服这些问题。这是一个提供了一个socket接口用户空间应用的协议族实现。他可以构建在linux网络层之上，能够使用所有的一提供的排队功能。socketcan是为带有linux 网络层服务的CAN控制器硬件寄存器提供的一个设备驱动，所以来自控制器的 can 帧可以传递给网络层并传递给CAN协议族模块，反之亦然。协议族模块提供了一个可注册的用于传输协议模块的API，所以任意传输协议数量可以动态加载或卸载。事实上，can 核心模块不能单独提供任何协议，在没有加载任何别的协议模块时也不能使用。多sockets可以在同时打开，在不同的或同一个协议模块上，并且他们在不同的或同一个can id上，能够监听/发送帧。使用同一个can id在同一个接口监听帧的多个 sockets，被同样的接收机制匹配CAN帧。应用程序希望使用特定传输协议通信的，例如ISO-TP，那就在打开这个socket时选择这个协议，然后可以读写应用数据字节流，不必要处理CAN-IDs 、帧等等。

## 概念
SocketCAN 主要的目的是提供一个构建在linux network layer上用户空间应用可用的 socket 接口。不同于通用的TCP/IPhe以太网网络，CAN 总线是种仅广播型媒体，没有MAC层寻址（不像以太网可以单播）。因此CAN-IDs必须在总线上被唯一确定。当设计一个CAN-ECU 网络时，CAN-IDs 被映射送给特定的ECU。因为这个原因，CAN-ID可以被认为是一种源地址。

### 接收列表
多应用的网络传输访问会导致不同应用可能对来自同一个CAN网络接口的同一个CAN-IDs感兴趣的问题。SocketCAN 核心模块，它实现了协议族CAN ，会提供几个高效率的接收列表来解决这个问题。如果，例如一个用户空间程序打开了一个CAN RAW socket，这个raw 协议模块自己从socketCAN core请求这个（或几个）CAN-IDs。

带有 can_rx_(un)register() 函数的特定的或所有已知 CAN 接口，可能执行CAN-IDs的订阅或取消订阅，通过SocketCAN Core。为了优化cpu占用率，接收列表被划分为每个设备几个特定的lists，设备对于给定的用例，匹配请求过滤器复杂性。

### 已发送帧的本地回环

数据交换应用可能运行在没有任何交换的同一个或不同的节点（除了对应的寻址信息）

         ___   ___   ___                   _______   ___
        | _ | | _ | | _ |                 | _   _ | | _ |
        ||A|| ||B|| ||C||                 ||A| |B|| ||C||
        |___| |___| |___|                 |_______| |___|
          |     |     |                       |       |
        -----------------(1)- CAN bus -(2)---------------

为了确保应用A在例子2中接收到与例子1中接收到同样信息，需要已发送的CAN frames的本地回环

The Linux network devices (by default) just can handle the
  transmission and reception of media dependent frames. Due to the
  arbitration on the CAN bus the transmission of a low prio CAN-ID
  may be delayed by the reception of a high prio CAN frame. To
  reflect the correct* traffic on the node the loopback of the sent
  data has to be performed right after a successful transmission. If
  the CAN network interface is not capable of performing the loopback for
  some reason the SocketCAN core can do this task as a fallback solution.
  See chapter 6.2 for details (recommended).

  The loopback functionality is enabled by default to reflect standard
  networking behaviour for CAN applications. Due to some requests from
  the RT-SocketCAN group the loopback optionally may be disabled for each
  separate socket. See sockopts from the CAN RAW sockets in chapter 4.1.

  * = you really like to have this when you're running analyser tools
      like 'candump' or 'cansniffer' on the (same) node.

  3.3 network problem notifications

  The use of the CAN bus may lead to several problems on the physical
  and media access control layer. Detecting and logging of these lower
  layer problems is a vital requirement for CAN users to identify
  hardware issues on the physical transceiver layer as well as
  arbitration problems and error frames caused by the different
  ECUs. The occurrence of detected errors are important for diagnosis
  and have to be logged together with the exact timestamp. For this
  reason the CAN interface driver can generate so called Error Message
  Frames that can optionally be passed to the user application in the
  same way as other CAN frames. Whenever an error on the physical layer
  or the MAC layer is detected (e.g. by the CAN controller) the driver
  creates an appropriate error message frame. Error messages frames can
  be requested by the user application using the common CAN filter
  mechanisms. Inside this filter definition the (interested) type of
  errors may be selected. The reception of error messages is disabled
  by default. The format of the CAN error message frame is briefly
  described in the Linux header file "include/uapi/linux/can/error.h".

## 使用 SocketCAN

类似于TCP/IP，你首先需要打开一个socket 用于在CAN 网络上通信。由于socketcan 实现了一个新的协议族，你需要传递 PF_CAN 作为第一个参数个socket系统调用。当前，有两种can协议选择，raw socket protocol 和 broadcast manager （BCN）。所以打开 一个socket，你可以这样写：
```c
s = socket(PF_CAN,SOCK_RAW,CAN_RAW);

s = socket(PF_CAN, SOCK_DGRAM, CAN_BCM);
```

成功生成socket后，可以使用bind系统调用绑定socket 到一个can接口。他与tcp/ip不同，因为寻址方式不同）。

绑定之后或连接socket之后，你可以使用read（）和write（）socket或使用send、sendto、sendmsg和recv*相应的操作。

下面还有CAN标准的socket选项
```c
struct can_frame {
            canid_t can_id;  /* 32 bit CAN_ID + EFF/RTR/ERR flags */
            __u8    can_dlc; /* frame payload length in byte (0 .. 8) */
            __u8    __pad;   /* padding */
            __u8    __res0;  /* reserved / padding */
            __u8    __res1;  /* reserved / padding */
            __u8    data[8] __attribute__((aligned(8)));
    };
```


## 参考

linux系统将设备分为3类：字符设备、块设备、网络设备。

字符设备：是指只能一个字节一个字节读写的设备，不能随机读取设备内存中的某一数据。字符设备按照字符流的方式被有序访问。字符设备是面向流的设备，常见的字符设备有鼠标、键盘、串口、控制台和LED设备等。

块设备：是指可以从设备的任意位置读取一定长度数据的设备。块设备包括硬盘、磁盘、U盘和SD卡等。

这两种类型的设备的根本区别在于它们是否可以被随机访问——换句话说就是，能否在访问设备时随意地从一个位置跳转到另一个位置。举个例子，键盘这种设备提供的就是一个数据流，当你敲入"fox" 这个字符串时，键盘驱动程序会按照和输入完全相同的顺序返回这个由三个字符组成的数据流。硬盘设备的驱动可能要求读取磁盘上任意块的内容，然后又转去读取别的块的内容，而被读取的块在磁盘上位置不一定要连续，所以说硬盘可以被随机访问，而不是以流的方式被访问，显然它是一个块设备。

每一个字符设备或块设备都在/dev目录下对应一个设备文件。linux用户程序通过设备文件（或称设备节点）来使用驱动程序操作字符设备和块设备。


linux网络设备驱动与字符设备和块设备有很大的不同。
1. 字符设备和块设备对应/dev下的一个设备文件。而网络设备不存在这样的设备文件。网络设备使用套接字socket访问，虽然也使用read,write系统调用，但这些调用只作用于软件对象。
2. 块设备只响应来自内核的请求，而网络驱动程序异步接收来自外部世界的数据包，并向内核请求发送到内核。

Linux内核中网络子系统的设计基于设备无关及协议无关思想。即无论什么网卡驱动、网络协议，都对应统一的驱动程序。

Linux网络协议栈层次有四层：
网络协议接口层
网络设备接口层
设备驱动功能层
网络设备媒介层


