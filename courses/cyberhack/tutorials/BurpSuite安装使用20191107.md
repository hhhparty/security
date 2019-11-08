# BurpSuite安装与使用

##  1 BurpSuite pro 2.1 破解版的安装


操作步骤：
1. 安装 vmware workstation 。
2. 安装 kali  虚拟机.
   以 2019.02为例,下载地址：https://mirrors.neusoft.edu.cn/kali-images/kali-2019.2/kali-linux-2019.2-amd64.iso

3. 下载 BurpSuite_pro_v2.1.rar包 ，百度网盘地址链接：https://pan.baidu.com/s/1t47Tw11fw8Riu6h0sABAsA 提取码：wyex 。假设下载并解压到~/Downloads/BurpSuite_pro_v2.1目录下

4. 建立工作目录，复制文件，允许文件运行
```
mkdir /usr/local/BurpSuite_pro_v2.1

cp ~/Downloads/BurpSuite_pro_v2.1/*.* /usr/local/BurpSuite_pro_v2.1/

chmod 755 /usr/local/BurpSuite_pro_v2.1/*.*

```
> BurpSuite_pro_v2.1中有两个jar包，运行条件是jre 11.0以上，burpsuite_pro_v2.1.jar是主文件，burpsuite_pro_v2.1_BurpHelper.jar是破解文件。

5. 改变kali中原有的 /usr/bin/burpsuite 命令
```
mv /usr/bin/burpsuite{,.old}

ln -s /usr/local/BurpSuite_pro_v2.1/burpsuite_pro_v2.1_BurpHelper.jar /usr/bin/burpsuite 
```

6. 运行burpsuite

```
burpsuite
```
7. 设置破解对象

主要是设置中间一行的BurpSuite Jar：
<img src="images/burpsuite/破解界面.png" width="480" alt="破解界面" />

然后点击 Run，之后点击 I accept，接受协议开始使用。

8. 查看主界面

<img src="images/burpsuite/main.png" width="480" alt="main界面" />


##  2 使用Burpsuite proxy 截获http请求

步骤：
1. 启动Burpsuite pro 2.1 ，查看器代理设置选项。

![proxy-options](images/burpsuite/proxy-options.png)

2. 打开 kali中浏览器，以firefox为例，设置其Preferences，找到 network proxy设置，点击 Settings，按burpsuite中选项情况设置连接。

![browser-proxy-setting](images/burpsuite/browser-proxy-setting.png)

3. 在burpsuite中Proxy启动中断，即“Intercept is on”，然后从kali访问某个链接，例如 http://10.10.10.10.135/webgoat/attack

![proxy-op-01](images/burpsuite/proxy-op-01.png)

4. 点击 Forward，直到出现类似下图中的http请求。

![proxy-op-02](images/burpsuite/proxy-op-02.png)

5. 对于感兴趣的请求，可以右键点击请求原文，将当前请求发送到其它burp模块。

![proxy-op-04](images/burpsuite/proxy-op-04.png)