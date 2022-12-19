# Linux kernel 内核选择

Linux Kernel 的稳定分支维护者 Greg Kroah-Hartman 近日在其个人博客上谈及了关于稳定内核版本的选择。
Kroah-Hartman 列出了推荐使用的内核版本列表，从优至劣排序如下：
- 选择使用自己喜欢的发行版所支持的内核
- 最新的稳定版本
- 最新的 LTS 版本
- 还在维护的老 LTS 版本

在适用性上，Kroah-Hartman 推荐：
- 笔记本电脑/台式机：最新的稳定版本
- 服务器：最新的稳定版本或最新的 LTS 版本
- 嵌入式设备：最新的 LTS 版本或更还在维护的老 LTS 版本

## 主流嵌入式操作系统（RTOS）有哪些

满足实时控制要求的嵌入式操作系统（RTOS）操作系统，以下介绍14种主流的RTOS，分别为μClinux、μC/OS-II、eCos、FreeRTOS、mbed OS、RTX、Vxworks、QNX、NuttX，而国产的嵌入式操作系统包括都江堰操作系统(djyos)、Alios Things、Huawei LiteOS、RT-Thread、SylixOS。