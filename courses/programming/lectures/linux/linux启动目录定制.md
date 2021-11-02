# linux 启动目录定制

## 配置位置

相关配置文件：

/usr/share/applications目录中的 *.desktop文件

相关目录：

$HOME/.config/menus



/usr/share/desktop-directories

修改后一般要更新数据库：

updatedb, update-desktop-database

update-desktop-database和update-desktop-*系列程序都位于xdg-utils 包中

## 配置内容

以`/usr/share/desktop-directories/01-01-dns-analysis.directory`为例，文件中内容为:

```

[Desktop Entry]
Name=• DNS Analysis
Name[fr]=• Analyse DNS
Name[es]=• Análisis de DNS
Name[hr]=• Analiza DNSa
Name[de]=• DNS-Analyse
Name[it]=• Analisi DNS
Name[zh_CN]=• DNS 分析
Name[zh_HK]=• DNS 分析
Name[zh_TW]=• DNS 分析
Type=Directory
Icon=kali-info-gathering-trans
```

## [自定义 Xfce menu](https://wiki.xfce.org/howto/customize-menu)

这里描述了xfce 4.5或更高版本的菜单自定义方法，早期版本可以使用 the libxfce4menu GUI.

[LXMenuEditor](http://lxmed.sourceforge.net/) 是一个为lxde设计的图像化菜单编辑器，也可以用于xfce。 

[Menulibre](https://launchpad.net/menulibre) 是另一个可用的编辑器。

### 确定 xfdesktop 安装

xfdesktop 安装了一个 menu 文件 和多个 .desktop 文件，这些 .desktop 文件和其他非xfdesktop的 .desktop 文件共同定义 menu。 为了自定义你的菜单，你需要修改他们。

这里的方法描述了修改在 $XDG_CONFIG_HOME 变量中定义的 menu 文件。通常这个变量是空的，那么 `~/.config/menus/xfce-applications.menu` ，以及在你的home文件夹中的 .desktop 文件就是了。

### 拷贝 menu 文件

除非你想硬编码所有菜单文件，否则你可以在你的home目录下生成基于用户的配置。

- 生成 ~/.config/menus
`mkdir -p ~/.config/menus`

- 拷贝系统已安装的 menu 文件（通常在/usr/share/）到上面建立的文件夹中
`cp  /etc/xdg/menus/xfce-applications.menu ~/.config/menus`


#### menu 文件解析

```xml

<Menu>
    <Name>Xfce</Menu>
    <De>
</Menu>
```
    
### copy .desktop 文件

例如，拷贝web浏览器的 .desktop  文件到你的home目录中的 .local/share/applications 目录。很多系统中 `$prefix=/usr`

`cp /usr/share/applications/xfce4-web-browser.desktop ~/.local/share/applications`

### 隐藏 menu 实体

如果你想从所有menus中隐藏menu实体， 拷贝他们的 .desktop 文件，并编辑他们，增加一个 `NoDisplay=true` 行。

### 仅隐藏 root 实体

## kali菜单修改实践

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
