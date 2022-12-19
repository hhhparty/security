# Plymouth

Plymouth 是在booting 或shutting down过程中提供图像化splash的一种应用。

在ubuntu中，Plymouth是 /dev/console 的 owner，所以 booting 和 shutting down 过程中无人可以修改 /dev/console.

## 快速了解

- 使用 KMS （kernel mode setting）和 framebuffer 来设置 screen resolution
- 由3个组件组成：
  - A daemon （server） process ，called plymouthd，这个进程负责图形显示、动画和logging。
  - 一个客户端应用，成为plymouth，用于向daemon发送命令
  - A library libply.so to allow applications to be written to talk to the daemon. (The plymouth command is linked to libply.so for this reason).

- Supports themes. 
- Is scriptable (see package plymouth-theme-script)

- Runs at system startup and system shutdown:
  - Boot
    - plymouthd is generally started in the initramfs (see file /usr/share/initramfs-tools/scripts/init-top/plymouth)
    - plymouthd is stopped at the point the Display Manager is starting. (see Upstart job configuration file file /etc/init/plymouth-stop.conf).

  - Shutdown
    - plymouthd is started by Upstart (see Upstart job configuration file file /etc/init/plymouth.conf).

Writes a log to /var/log/boot.log.


## Options

### DAemon
plymoutd 运行在四种模式之一下，可以通过适当的命令行选项进行设置。

- --mode=boot
- --mode=shutdown
- --mode=suspend
- --mode=resume

这些选项，允许plymouth显示不同的内容，基于是否系统在启动或停止。

### Startup

plymouthd daemon 尝试在启动时读取下列文件 （它找到的第一个文件优先于其他的）

- General configuration
  - /etc/plymouth/plymouthd.conf
  - /lib/plymouth/plymouthd.defaults
- splash theme
  - /lib/plymouth/themes/default.plymouth


### splash theme

Contents of /lib/plymouth/themes/default.plymouth:

```
  [Plymouth Theme]
  Name=Ubuntu Logo
  Description=A theme that features a blank background with a logo.
  ModuleName=script

  [script]
  ImageDir=/lib/plymouth/themes/ubuntu-logo
  ScriptFile=/lib/plymouth/themes/ubuntu-logo/ubuntu-logo.script
```

This tells plymouthd to use the "script" splash plugin. This plugin allows the graphical splash experience to be scripted using Plymouths own scripting language (hence the name).

The "script" splash plugin exists as /lib/plymouth/script.so (source code: src/plugins/splash/script/script.c)

"ImageDir" tells plymouthd which directory contains the images used by the "Ubuntu Logo" theme.

"ScriptFile" is the full path to the Plymouth script which creates the splash experience.

## debian安装plymouth 美化开机动画

参考：https://wiki.debian.org/plymouth

- 首先，安装 plymouth 和 plymouth-themes: `sudo apt install plymouth plymouth-themes`
- 修改grub配置，`sudo vim /etc/default/grub` 

```conf
#确保有下列内容
GRUB_CMDLINE_LINUX_DEFAULT="quiet splash"
```
- 更新grub ：`sudo update-grub2`
- 查看可用theme：`sudo plymouth-set-default-themoe -l`，主题可以自己按照已有的theme目录内容进行修改。
- 设置主题:`sudo plymouth-set-default-theme -R softwares`，这一步会生成相应的 initrd.img，并自动替换/boot/grub下的文件。
- 重启查看效果。

动画效果主要由主题文件夹中的 sh文件定义。
