# Grub 2 配置

Grub 2 通过运行 `/etc/grub.d/folder` 目录下的脚本来建立配置文件 grub.cfg. 并且 /etc/default/grub这个文件也可以配置。

`update-grub`命令（手动或更新内核后）可以自动更新grub.cfg .这个命令会激活上面的脚本，并且会寻找系统中存在的操作系统和内核。一旦发现操作系统或内核，那么它们会被加入到 GRUB 2 的启动菜单当中。 

`update-grub` 相当于 `grub-mkconfig -o /boot/grub/grub.cfg`

使用下列命令可以知道 grub 安装在哪个区：
```
$ grub-probe -t device /boot/grub/
/dev/sda1
$ sudo grub-probe -t fs_uuid /boot/grub/
efa0f8fd-d69d-4931-8275-d25f8871511d
$ sudo grub-probe -t device /boot/grub/
/dev/sda1
$
$ df -h

```

## 用户设置 /etc/default/grub

/etc/default/grub 中为默认配置

/etc/default/grub.d 中还有配置。

## /usr/sbin 下有grub的脚本文件

 /usr/sbin$ ls grub-*
grub-install   grub-mkdevicemap  grub-probe   grub-set-default
grub-mkconfig  grub-mknetdir     grub-reboot  grub-setup
 在 /usr/sbin 目录下，以 grub- 开头的文件都是 脚本文件，并非二进制可执行文件。

很多预定义的变量包含在/usr/sbin/grub-mkconfig    这个文件中，用如下命令可以列出这些预定义的变量：

 

grep "export GRUB_DEFAULT" -A50 /usr/sbin/grub-mkconfig | grep GRUB_

 

/usr/sbin$ grep "export GRUB_DEFAULT" -A50 /usr/sbin/grub-mkconfig | grep GRUB_
export GRUB_DEFAULT \
  GRUB_HIDDEN_TIMEOUT \
  GRUB_HIDDEN_TIMEOUT_QUIET \
  GRUB_TIMEOUT \
  GRUB_DEFAULT_BUTTON \
  GRUB_HIDDEN_TIMEOUT_BUTTON \
  GRUB_TIMEOUT_BUTTON \
  GRUB_BUTTON_CMOS_ADDRESS \
  GRUB_BUTTON_CMOS_CLEAN \
  GRUB_DISTRIBUTOR \
  GRUB_CMDLINE_LINUX \
  GRUB_CMDLINE_LINUX_DEFAULT \
  GRUB_CMDLINE_XEN \
  GRUB_CMDLINE_XEN_DEFAULT \
  GRUB_CMDLINE_NETBSD \
  GRUB_CMDLINE_NETBSD_DEFAULT \
  GRUB_TERMINAL_INPUT \
  GRUB_TERMINAL_OUTPUT \
  GRUB_SERIAL_COMMAND \
  GRUB_DISABLE_LINUX_UUID \
  GRUB_DISABLE_RECOVERY \
  GRUB_VIDEO_BACKEND \
  GRUB_GFXMODE \
  GRUB_BACKGROUND \
  GRUB_THEME \
  GRUB_GFXPAYLOAD_LINUX \
  GRUB_DISABLE_OS_PROBER \
  GRUB_INIT_TUNE \
  GRUB_SAVEDEFAULT \
  GRUB_BADRAM


##  /etc/grub.d/ 中的脚本

在 /etc/grub.d/ 目录下的脚本，当 update-grub执行的时候，会被读取，并合并到 /boot/grub/grub.cfg   这个文件中。

grub.cfg文件中的 菜单条目的放置，是由 /etc/grub.d/   目录下的脚本运行的顺序来决定的。文件名以数字开头的的脚本会被先执行，并且数字小的先执行。比如10_linux 在20_memtest之前执行。而20_memtest   会在40_custom  之前执行。文件名以字母开头的（alphabetic）的脚本在数字命名的脚本之后运行。

 自定义的 启动菜单入口（menu entries）可以被添加到40_custom   这个文件中，或者单独创建一个文件。40_custom  中的菜单入口将会出现在启动菜单的最底部。一个以“06_”开头的自定义文件，将出现在 启动菜单的最顶部。

update-grub执行的时候，  /etc/grub.d/ 下的脚本会被执行。


### 脚本描述

- 00_header : 设置环境变量，比如系统文件位置、video设置、之前保存的入口。用户通常不需要改变该文件
- 05_debian_theme：用于设置grub2的背景图片，文本颜色、主题等。可参考[grub2/displays](https://help.ubuntu.com/community/Grub2/Displays)
- 10_linux : 识别 root device 中操作系统正在使用的内核，并未这些内核创建 menu entries。这个包含了相应的“recovery mode （恢复模式）”选项。在GRUB 1.99和之后的版本中， 在 启动主菜单页面，仅显示最新的内核。其他的内核被包含在了子启动菜单中（ submenu）。 更多submenu相关信息请参考Grub2/Submenus  。
- Note:对于早期的GRUB 2版本, 所有位于 boot目录的内核都包含在 main menu 中. 如果要减少显示的内核，那就要删除/boot文件夹下的旧内核，或者使用一个有效的的grub2自定义应用。

20_memtest86+

寻找 /boot/memtest86+.bin ，并且把它作为一个选项加入到 GRUB 2 启动菜单（boot menu）当中。当前没有任何方式可以从这个启动菜单当中去除这个“memtest86+”的入口。但是，可以通过去掉文件可执行权限，并运行update-grub的方式来禁止ofmemtest86+ 的显示：

sudo chmod -x /etc/grub.d/20_memtest86+
sudo update-grub
 

30_os-prober

这个脚本使用“os-prober” 去搜索linux和其他操作系统，并且把结果放置到GRUB 2 的菜单中。

这个文件包含如 Windows, Linux, OSX, 和 Hurd 这些操作系统的选项。
在这个文件中的一些变量，决定了 在/boot/grub/grub.cfg  文件中 和 GRUB 2 menu 中 最终被显示的某系名字的格式(format of the displayed names)。 熟悉基本脚本的用户可以改变这些变量，以达到改变 GRUB2菜单入口格式 的目的。

The user can insert an entry into /etc/default/grub which disables this script (seeConfiguring GRUB 2). Removing the executable bit from the file will also prevent it from searching for other operating systems.

By default os-prober ignores any disks that possess "dmraid" signatures, which can be listed via sudo dmraid -r -c (if installed).

If the script finds another Ubuntu/Linux operating system, it will attempt to use the titles contained in the10_linux section of that installation'sgrub.cfg file. If not found, the script will construct a menuentry from the actual boot information it locates.

40_custom 

这个文件是一个添加自定义启动菜单入口的模板。当执行 update-grub的时候，这个文件的内容会被加入到grub.cfg总。

The contents of this file, below the "exec tail -n +3 $0" line and the default comments, are imported directly into/boot/grub/grub.cfg without any changes.

As the comments at the top of the file state, add custom lines below those already contained in the40_custom file.

The file can be renamed or copied. The file must be executable to be incorporated into the GRUB 2 menu.
As mentioned in the introduction of this section, the name of the file determines the location of its contents in the GRUB 2 menu. As a general rule, if using numerals at the start it is advisable to allow the00_header and05_debian_theme scripts to be run before the first custom menu. These files contain no menuentries and thus will not interfere with a menuentry from a custom script with a lower priority.



## kali grub 主题修改实践

### /usr/sbin/grub-mkconfig 

该文件中，没有提及 kali 主题

### /etc/grub.d/05_debian_theme

该脚本其中有
```
if [ -e /usr/share/plymouth/themes/default.grub ]; then
            sed "s/^/${1}/" /usr/share/plymouth/themes/default.grub
        if [ -e /lib/plymouth/themes/default.grub ]; then
        。。。
```

没有指明kali，但试图测试有无`/usr/share/plymouth/themes/default.grub`等文件，事实上没有。

### /usr/share/plymouth/themes 目录

- link文件：debian-theme ，指向 `/usr/share/desktop-base/active-theme/plymouth` , 而该文件仍为link，指向 `/usr/share/plymouth/themes/kali`

#### /usr/share/plymouth/themes/kali 目录

其中含有多个图形文件。需要修改为cicv

### /usr/share/grub/themes/kali 目录

其中有kali图形文件，需要修改


### /etc/default/grub.d/kali-themes.cfg 文件
```
# Try to force a 16x9 mode first, then 16x10, then default
GRUB_GFXMODE="1280x720,1280x800,auto"
GRUB_THEME="/boot/grub/themes/kali/theme.txt"
# Add splash option to enable plymouth
if ! echo "$GRUB_CMDLINE_LINUX_DEFAULT" | grep -q splash; then
    GRUB_CMDLINE_LINUX_DEFAULT="$GRUB_CMDLINE_LINUX_DEFAULT splash"
fi
```

需要修改为

```
# Try to force a 16x9 mode first, then 16x10, then default
GRUB_GFXMODE="1280x720,1280x800,auto"
GRUB_THEME="/boot/grub/themes/cicv/theme.txt"
# Add splash option to enable plymouth
if ! echo "$GRUB_CMDLINE_LINUX_DEFAULT" | grep -q splash; then
    GRUB_CMDLINE_LINUX_DEFAULT="$GRUB_CMDLINE_LINUX_DEFAULT splash"
fi

```

并删除kali-theme.cfg


### /boot/grub/themes

需要修改。


