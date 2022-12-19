# linux-headers

Linux-headers 是一个提供了Linux kernel 头文件的包。它是linux kernel 的一部分，可以单独存在。

Linux-headers 的作用是：
- 展现了内部内核组件之间的接口
- 展现了userspace 和 kernel 的接口
- 例如：sys-libs/glibc 这样的包依赖于kernel-headers。

安装方法：
```sh
#可能需要增加关键的更新源
sudo apt update
sudo apt upgrade -y
sudo apt install linux-headers-`uname -r`
```