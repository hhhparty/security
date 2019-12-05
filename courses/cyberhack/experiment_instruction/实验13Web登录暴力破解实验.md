# 实验13 暴力破解http basic 认证

## 实验目的

通过实验，使学习者：
- 理解弱口令的危害；
- 掌握使用Burp suite intruder的基本方法；
- 掌握http basic auth的基本原理。

## 实验内容

- 打开或构建webgoat应用
- 使用burpsuite 攻击webgoat的http基本认证

## 实验步骤

### 启动 owasp bwa 靶机

步骤：
1. 启动 owasp bwa v1.2 虚拟机。
2. 以 root用户名登录，密码owaspbwa。
3. 在 owasp bwa 虚拟机中运行ifconfig，确认其的IP地址。下面以10.10.10.135为例。
4. 在 kali linux 虚拟机 或 windows中的浏览器上访问 http://10.10.10.135/
5. 进入打开Web页面的Training applications中的OWASP WebGoat

### 启动 kali 中的 Burpsuite
步骤：
1. 启动Burpsuite pro 2.1 ，查看器代理设置选项。

![proxy-options](images/burpsuite/proxy-options.png)

2. 打开 kali中浏览器，以firefox为例，设置其Preferences，找到 network proxy设置，点击 Settings，按burpsuite中选项情况设置连接。

![browser-proxy-setting](images/burpsuite/browser-proxy-setting.png)

3. 在burpsuite中Proxy启动中断，即“Intercept is on”，然后从kali访问 http://10.10.10.10.135/webgoat/attack

![proxy-op-01](images/burpsuite/proxy-op-01.png)

4. 点击 Forward，直到出现类似下图中的http请求。

![proxy-op-02](images/burpsuite/proxy-op-02.png)

5. 点右键，将这个请求发送到 Send to Intruder（或者点快捷键 Ctrl+I）

![intruder-target-01](images/burpsuite/intruder-target-01.png)

6. 在burp 的intruder的positions中设置注入位置参数。设置位置在Authorization：Basic 后的字段。

![intruder-positions-01](images/burpsuite/intruder-positions-01.png)

7. 设置burp intruder的payloads,首先选择payload type为"custom iterator"；然后设置“payload options”的Position 1，添加可能的用户名，并在下方Separator for position 1中设置为“:”

![intruder-payloads-01](images/burpsuite/intruder-payloads-01.png)

8. 设置“payload options”的Position 2，添加可能的密码。

![intruder-payloads-02](images/burpsuite/intruder-payloads-02.png)

9. 设置 payload processing，点击add，选择 Encode ，然后选择 Base64-encode。
![intruder-payloads-03](images/burpsuite/intruder-payloads-03.png)

10. 设置 payload Encoding。去除url编码中的= 、/ 、+。这些都是Base64中可能出现的字符。

![intruder-payloads-04](images/burpsuite/intruder-payloads-04.png)

11. 运行 start attack，启动 http basic auth 暴力破解攻击。
结果如下：
![intruder-result-01](images/burpsuite/intruder-result-01.png)

### 实验结论

上面的第8行，payload是d2ViZ29hdDp3ZWJnb2F0，获得响应码为200，说明这个载荷可用，经过Base64解码可知是webgoat:webgoat。