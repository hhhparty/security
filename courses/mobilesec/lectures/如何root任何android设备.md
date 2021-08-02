# 如何Root任何Android设备

翻译：https://www.xda-developers.com/root/

Rooting 是提升对Android系统的访问权限，即以root身份访问。root后有以下权力：
- 对于原先无法访问的/data, /system区内容，拥有root权限后就可以访问了；
- 此外还能运行完全不同类的第三方应用；
- 进行更深入的系统级修改；
- 设置代理，原先无法访问的设备功能或以新方式使用

Root后人们通常会安装自定义的recoveries，这可用于flash自定义的ROMS，kernels，和别的设备改动。

Root后，人们通常会安装强大、用途广泛的Xposed框架，这个框架可以轻松无损的修改设备网关。

通常，使用root权限是不安全的，但有像supersu之类的root代理程序，它仅向你选择的app授于root权限。

## Magisk Root

Magisk 可以root许多中Android设备，并打入标准通用的补丁。它有一套强大的通用无系统接口。

## Framaroot
许多设备可以使用Framaroot这个工具进行root，[点击查看兼容性](https://forum.xda-developers.com/apps/framaroot/framaroot-supported-devices-t2722980)。

## Towelroot

[Towelroot](https://www.xda-developers.com/breaking-geohot-roots-the-verizon-galaxy-s5-with-towelroot/)由XDA Recognized Developer geohot创建，也是一个Root工具，兼容大量设备。这个工具建立在黑客Pinkie Pie发现的Linux内核CVE-2014-3153之上，并且它涉及Futex子系统中的一个问题，进而造成提权。尽管它是专门为Galaxy S5的某些变体设计的，但它与大多数运行的未休补内核的设备兼容。

## CF-Auto-Root

由XDA高级认证开发者 Chainfire设计，CF-Auto-Root是一个面向新手的工具，也是一个面向希望于stock更接近的用户的工具。

事实上这个工具就是安装SuperSu到你的系统，然后使用它获取root权限。

## KingRoot
这个root工具，面向那些就想有root权限的人，不一定需要flash其他东西。它对Android 2.x 到 5.0 版本几乎所有设备有效。这个工具基于系统渗透。

最合适的root策略，应该是根据设备的 ROM 信息，开发由云端到你的设备的方法，使用root方法的最好之处在于它不会使KNOX跳闸，并且能完美关闭sony_ric。



# 刷机工具

## [SP flash TOOL](https://www.getdroidpro.com/sp-flash-tool-for-your-smartphones/)

如果你希望更改你android设备的OS，你需要一个flash工具来改变只读内存ROM。通过flashing你的设备，你将安装一个内存的kernel，它将加强你android设备。

做这些时，你要下载一个合适的flash工具，确保你的设备能够完全地重新编程。spflash tools就是个不错的工具。它可以修复变成砖的手机。可以安装原装rom或自定义恢复为任何自定义rom，它还支持所有的拥有mediatek（mtk）芯片的android设备。




