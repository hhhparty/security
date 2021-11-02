
# kali菜单修改简单操作指南

三个组成部分：
- menu文件 ： /etc/xdg/menus/applications-merged/kali-applications.menu
- directory文件
  - 每个menu项，对应一个directory 文件，例如 information gathering 对应 01-info-gathering.directory，位置在 /usr/share/desktop-directories/01-info-gathering.directory   
- desktop 文件
  - 每个显示在菜单里的应用均有一个desktop文件
  - 例如nmap位置在：/usr/share/applications/kali-nmap.desktop


注意：
- 同步改变下列三类文件后，会立即看到效果。
- 如果没效果，可以使用`xfdesktop --reload` 或 `killall -HUP xfdesktop`


### menu 文件
/etc/xdg/menus/applications-merged 为 kali 的 menu 文件，改变该文件保存后，会立即生效。

这个文件定义顶级菜单。顶级菜单一般都是 directory 类型。
### directory 文件
位于
/usr/share/desktop-directories/

每个menu项一个.directory  文件

这个文件定义二级菜单。
### application 目录项

位于
/usr/share/applications/

每个文件定义了应用的菜单。


这个文件即程序的可视化launcher ，也可以使用`exo-desktop-item-edit --create-new ~/.local/share/applications/` 生成。
