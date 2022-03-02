# Kali 2021.1 安装配置过程

## 安装kali 

选择图形安装，large模式安装。

## 安装nessus 

- 从https://zh-cn.tenable.com/products/nessus/nessus-essentials 下载面向kali的试用版，例如Nessus-8.13.1-debian6_amd64.deb
- 拷贝到kali Downloads目录下
- 安装：`sudo dpkg -i Nessus-8.13.1-debian6_amd64.deb`
- 运行：`sudo systemctl start nessus.service`
- 访问：浏览器中打开 https://localhost:8834 


### 破解使用
- 在浏览器中访问 https://localhost:8834
- 初始化扫描器，选择 Managed Scanner→Managed by Tenable.sc，点击 Continue。
- 现在会要求新建账号，自己记住账号密码；
- 等待初始化完成。完成后登陆进去是没有扫描界面的。

- 接下来获取插件包。kali中默认把nessus安装在/OPT目录下，现在进入目录，执行以下操作，复制并记录challenge code：`sudo /opt/nessus/sbin/nessuscli fetch --challenge`

- 访问上面输出的网址https://plugins.nessus.org/v2/offline.php，把challenge code填入第一个框
- 接下来获取第二个框的激活码，访问网站https://zh-cn.tenable.com/products/nessus/nessus-essentials，姓名随便写，邮箱写真实邮箱，用来接受激活码.点击注册后，过大约一分钟左右，邮箱收到邮件，找到激活码，复制.
- 把激活码贴到第二个框，点submit：
- 注册成功后网页返回更新包的下载链接，在浏览器输入上述链接就可以下载最新插件包：

- 注册包下载完成后，执行更新操作：`sudo /opt/nessus/sbin/nessuscli update all-2.0.tar.gz`

- 安装license，将“You can copy the following license and paste it into the Nessus console to proceed:” 提示下的pubkey内容拷贝到 /opt/nessus/nessus.license下，然后`sudo /opt/nessus/sbin/nessuscli fetch --register-offline nessus.license`

到现在为止，nessus安装完成，但只支持16个IP，接下来进行破解，修改两个文件，没有的话创建一下，再改成下面的内容。
```
export PLUGIN_SET="202004281428" #设置一下本次安装的时间

sudo cat >/opt/nessus/lib/nessus/plugins/plugin_feed_info.inc<<EOF
PLUGIN_SET = ${PLUGIN_SET};
PLUGIN_FEED = "ProfessionalFeed (Direct)";

PLUGIN_FEED_TRANSPORT = "Tenable Network Security Lightning";
EOF
```

```
cat >/opt/nessus/var/nessus/plugin_feed_info.inc<<EOF
PLUGIN_SET = ${PLUGIN_SET};
PLUGIN_FEED = "ProfessionalFeed (Direct)";

PLUGIN_FEED_TRANSPORT = "Tenable Network Security Lightning";
EOF
```


重启nessus
`systemctl restart nessusd.service`

修改上面两个文件是用来把16个IP的家庭版转化成无限制的专业版的，windows平台破解方法同。

注：每次更新完后，上述两个文件都会变回家庭版的配置（因为我们是通过下载家庭版的插件包来进行离线更新的），所以原本是破解的，一更新就又变限制版了，需要重新改成上面的内容。
进行定期自动更新脚本
自己在安装目录下新建一个文件夹nessus-update，以后下载的插件包都放在这里，自动更新脚本也放这里。


设置crontab计划任务，每个月跑一次更新