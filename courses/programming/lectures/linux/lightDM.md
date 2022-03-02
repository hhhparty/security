# LightDM

## 简介
LightDM是运行在Debian系列操作系统上的桌面显示管理器，它的全名是Light Display Manager，表面含义是轻量级桌面显示管理器。它是FreeDesktop工程的一部分。FreeDesktop是一个致力于Linux和其他类Unix上的X窗口系统的桌面环境之间的互操作性和基础技术共享的项目，由Red Hat公司的Havoc Pennington于2000年3月创立。官方网站是：https://www.freedesktop.org。最初的名称叫XDesktopGroup（X桌面工作组），其缩写"XDG"在现在的桌面开发的工作中仍然经常被用到。Ubuntu 16.04 LTS版本使用LightDM作为默认的窗口管理器。

## 配置

### 配置文件

lightDM配置由下列位置的文件提供：

```sh
/usr/share/lightdm/lightdm.conf.d/*.conf
/etc/lightdm/lightdm.conf.d/*.conf
/etc/lightdm/lightdm.conf
```

最新版的lightdm吧过时的配置节SeatDefaults替换为Seat:*。

系统提供的配置保存在/usr/share/lightdm/lightdm.conf.d/*.conf

系统管理员可以使用配置文件/etc/lightdm/lightdm.conf.d/*.conf和/etc/lightdm/lightdm.conf覆盖系统配置。举例来说，如果你想覆盖系统配置的默认会话配置（/usr/share/lightdm/lightdm.conf.d/50-ubuntu.conf提供），那么你可以新建一个文件/etc/lightdm/lightdm.conf.d/50-myconfig.conf，写入如下代码：

```
[Seat:*]
user-session=mysession
```

有一个示例配置文件展示了LightDM可能识别的所有的配置，它压缩保存在：/usr/share/doc/lightdm/lightdm.conf.gz。

这里还有一个额外的配置文件：/etc/lightdm/users.conf。但是如果AccountsService在你的系统上运行，那么这个配置文件将被忽略。如果你不确定配置文件是否已被忽略，可以运行：ps -aef | grep -i AccountsService。


## appearance
```
/usr/share/cherrytree/icons
/usr/share/framework2/data/msfweb/icons
/usr/share/system-config-printer/icons
/usr/share/firefox-esr/browser/chrome/icons
/usr/share/legion/images/icons
/usr/share/atril/icons
/usr/share/icons
/usr/share/mime/icons
/usr/share/oscanner/cqure/repeng/icons
/usr/share/apache2/icons
/usr/share/plasma/desktoptheme/kali/icons
/usr/share/colord/icons
```