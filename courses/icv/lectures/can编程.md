# CAN 编程

## linux 下使用can-util 和 pcan
下面默认使用pcan，kali应该是预装了pcan模块。
0.可以使用下列命令查看pcan模块的安装情况

```sh
└─$ lsmod |grep ^peak 
#结果：
peak_usb               53248  0

#此外还可观察：
grep PEAK_ /boot/config-`uname -r`
#结果：
CONFIG_CAN_PEAK_PCIEFD=m
CONFIG_CAN_PEAK_PCI=m
CONFIG_CAN_PEAK_PCIEC=y
CONFIG_CAN_PEAK_PCMCIA=m
CONFIG_CAN_PEAK_USB=m

# 如果是虚拟can
$ sudo modprobe vcan
$ sudo ip link add dev vcan0 type vcan
# 如果出现 RTNETLINK answers: Operation not supported 错误，去先尝试执行 sudo modprobe can 或者 sudo modprobe vcan。modprobe - Add and remove modules from the Linux Kernel
```


1.接上pcan后，使用 `ip link show` 命令查看can接口卡是否接上？

```
$ ip link show

can0: <NOARP,ECHO> mtu 16 qdisc pfifo_fast state DOWN mode DEFAULT group default qlen 10
    link/can 
```

2.设置波特率后，启用can接口

`sudo ip link set can0 type can biterate 125000`

`sudo ip link set can0 up`

3.安装 can-utils
`sudo apt install can-utils`

4.使用can-util命令发送数据

```
Usage: cansend <device> <can_frame>.

<can_frame>:
 <can_id>#{data}          for 'classic' CAN 2.0 data frames
 <can_id>#R{len}          for 'classic' CAN 2.0 data frames
 <can_id>##<flags>{data}  for CAN FD frames

<can_id>:
 3 (SFF) or 8 (EFF) hex chars
{data}:
 0..8 (0..64 CAN FD) ASCII hex-values (optionally separated by '.')
{len}:
 an optional 0..8 value as RTR frames can contain a valid dlc field
<flags>:
 a single ASCII Hex value (0 .. F) which defines canfd_frame.flags

Examples:
  5A1#11.2233.44556677.88 / 123#DEADBEEF / 5AA# / 123##1 / 213##311223344 /
  1F334455#1122334455667788 / 123#R / 00000123#R3
```
`$ cansend can0 123#1122334455667788`

说明：
- 123 为 id 表示 0x123
- 数据为 [ 0x11, 0x22, 0x33, 0x44, 0x55, 0x66, 0x77, 0x88 ]。注意值总是被认为是16进制。

5.如果希望显示所有接收到的消息，可以使用如下命令：
`$ candump can0`

```sh
└─$ candump --help                                                          1 ⨯
candump: invalid option -- '-'
candump - dump CAN bus traffic.

Usage: candump [options] <CAN interface>+
  (use CTRL-C to terminate candump)

Options:
         -t <type>   (timestamp: (a)bsolute/(d)elta/(z)ero/(A)bsolute w date)
         -H          (read hardware timestamps instead of system timestamps)
         -c          (increment color mode level)
         -i          (binary output - may exceed 80 chars/line)
         -a          (enable additional ASCII output)
         -S          (swap byte order in printed CAN data[] - marked with '`' )
         -s <level>  (silent mode - 0: off (default) 1: animation 2: silent)
         -l          (log CAN-frames into file. Sets '-s 2' by default)
         -L          (use log file format on stdout)
         -n <count>  (terminate after reception of <count> CAN frames)
         -r <size>   (set socket receive buffer to <size>)
         -D          (Don't exit if a "detected" can device goes down.
         -d          (monitor dropped CAN frames)
         -e          (dump CAN error frames in human-readable format)
         -x          (print extra message infos, rx/tx brs esi)
         -T <msecs>  (terminate after <msecs> without any reception)

Up to 16 CAN interfaces with optional filter sets can be specified
on the commandline in the form: <ifname>[,filter]*

Filters:
  Comma separated filters can be specified for each given CAN interface:
    <can_id>:<can_mask>
         (matches when <received_can_id> & mask == can_id & mask)
    <can_id>~<can_mask>
         (matches when <received_can_id> & mask != can_id & mask)
    #<error_mask>
         (set error frame filter, see include/linux/can/error.h)
    [j|J]
         (join the given CAN filters - logical AND semantic)

CAN IDs, masks and data content are given and expected in hexadecimal values.
When the can_id is 8 digits long the CAN_EFF_FLAG is set for 29 bit EFF format.
Without any given filter all data frames are received ('0:0' default filter).

Use interface name 'any' to receive from all CAN interfaces.

Examples:
candump -c -c -ta can0,123:7FF,400:700,#000000FF can2,400~7F0 can3 can8

candump -l any,0~0,#FFFFFFFF
         (log only error frames but no(!) data frames)
candump -l any,0:0,#FFFFFFFF
         (log error frames and also all data frames)
candump vcan2,12345678:DFFFFFFF
         (match only for extended CAN ID 12345678)
candump vcan2,123:7FF
         (matches CAN ID 123 - including EFF and RTR frames)
candump vcan2,123:C00007FF
         (matches CAN ID 123 - only SFF and non-RTR frames)

```


## how-to-use-socketcan-with-c-in-linux

### 标准can 帧结构
下面是 socketcan中使用的CAN帧结构：

```c
struct can_frame {
    canid_t can_id;  // 32-bit CAN_ID + EFF/RTR/ERR flags
    __u8    can_dlc; // Number of bytes used in data (0..8)
    __u8    __pad;   // Padding
    __u8    __res0;  // Reserved/padding
    __u8    __res1;  // Reserved/padding
    __u8    data[8] __attribute__((aligned(8))); // Data
};
```

- [0-28]: 第一个部分时 32位的的 CAN identifier（11 bits or 29 bits）
- [29]  ：Error frame flag
  - 0 表示 data frame
  - 1 表示 error frame
- [30] : 远程传输请求标志
  - 1 表示远程
  - 0 表示非远程
- [31] :帧格式标志位 
  - 0 表示标准帧 11bit
  - 1 表示扩展帧 29bit
- padding ：允许数据对齐到64bit 边界。允许用户定义自己的结构体和共用体，以便于访问数据（广播 casting）。例如你可以访问所有8bytes数据作为一个单一的 64bit值。
- 注意：can_id 结构不直接映射到一个CAN消息的任意域里的比特位。

### CANFD 帧结构

```c
struct canfd_frame {
    canid_t can_id;  /* 32 bit CAN_ID + EFF/RTR/ERR flags */
    __u8    len;     /* frame payload length in byte (0 .. 64) */
    __u8    flags;   /* additional flags for CAN FD */
    __u8    __res0;  /* reserved / padding */
    __u8    __res1;  /* reserved / padding */
    __u8    data[64] __attribute__((aligned(8)));
};
```

说明：
- canfd_frame结构没有一个 can_dlc 元素来指定字节数，它使用了len来指定；
- read（）系统调用，将从内核CAN buffer 传递一个can_frame 或一个 canfd_frame 结构给用户空间。
- 数据被在内部缓存，意味着对于虚拟接口，你可能会在执行 write、pause，然后使用 read读回刚才写入的值，而不必启用别的进程或线程。


### libsocketcan

这是一个 Linux 库，提供了一些用户态功能来控制socketcan接口。它提供的功能有：
- `can_set_bitrate()`
- `can_do_start()`
- `can_do_stop()`

注意：尽管libsocketcan 看似对物理CAN接口工作很好，但是在使用虚拟can接口时有些问题。特别是例如can_get_state()这样的函数，看似表现不好。

你可以安装`libsocketcan`在linux机器上，通过下列方法：
```
git clone https://git.pengutronix.de/git/tools/libsocketcan


~$ cd libsocketcan
~/libsocketcan$ ./autogen.sh
~/libsocketcan$ ./configure
~/libsocketcan$ make
```

之后，应该会：
- 在/usr/local/lib下，存在libsocketcan.a ；
- 在/usr/local/include/下，有头文件 libsocketcan.h 


## References
- [How To Use SocketCAN With C++ In Linux](https://blog.mbedded.ninja/programming/operating-systems/linux/how-to-use-socketcan-with-c-in-linux/)

- https://www.kernel.org/doc/Documentation/networking/can.txt is a great page detailing with the Linux C API for SocketCAN, including code examples and use cases.

- The can-utils package source code can be found at https://github.com/linux-can/can-utils. This has great C code examples on how to read and write messages to the SocketCAN interface.