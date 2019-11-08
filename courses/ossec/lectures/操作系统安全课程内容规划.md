# 操作系统安全课程介绍

## 教学目标

1.掌握操作系安全的基本概念、原理和安全防护方法；
2.培养学生 Windows/Linux 等服务器管理和系统安全运维的能力；
3.理解操作系统漏洞分析的基本方法，掌握修复漏洞/缺陷的基本方法。

## 教学内容

- 操作系统安全概述（基本概念、主要风险、总体安全策略）
- Linux内核安全配置
- 文件系统安全
- 本地访问认证
- 远程访问认证
- 网络安全配置
- 软件安全配置
- 安全工具应用

## Linux的安全问题

1. 安全策略
2. 口令保护
3. 配置服务器安全
4. 校验介质完整性
5. 使用LUKS磁盘加密
6. 使用Nmap扫描linux
   
## 配置安全且优化Linux内核

## 本地文件系统安全

1. 访问控制列表
2. LDAP服务器配置
3. 运维方面
    - 锁定系统重要文件
    - 文件权限检查和修改
    - /tmp 、/var/tmp 、/dev/shm安全设定 

## Linux本地认证

1. 用户认证和日志记录
2. 限制用户登录能力
3. 使用acct监视用户行为
4. 定义用户授权控制
5. 运维方面
    - 删除特殊的用户和用户组
    - 关闭不必要的服务
    - 密码安全策略
    - 合理使用su sudo命令
    - 删减系统登陆欢迎信息
    - 禁止control-alt-delete键盘关闭命令

## Linux远程认证

1. 使用ssh登录
2. 禁止root登录ssh
3. 基于密钥加密ssh远程访问
4. 建立kerberos服务器
5. 运维方面
    - 远程登陆取消telnet ，采用ssh
    - 合理使用shell历史命令
    - 启用 tcp wrappers 防火墙

## 网络安全

1. 管理tcp/ip网络
2. 使用iptables
3. 阻止地址伪装
4. 拦截入站流量
5. 配置tcp wrapper
6. 运维方面
    - 网络实时流量检测工具iftop
    - 网络流量监控与分析工具 Ntop和Ntopng
    - 网络性能评估工具 iperf
    - 网络探测和安全审核工具 nmap

## 软件安全
1. 运维方面
    - 软件自动升级工具 yum、apt
    - yum的特点
## 后门检测
1. 运维
    - rookit后门检测工具 chkrootkit
    - rookit后门检测工具 RKHunter

## 安全工具

1. Linux的sXid工具
2. PortSentry
3. Squid
4. OpenSSL
5. Tripwire
6. Shorewall

## Linux安全发行版

1. kali linux
2. pfSense
3. DEFT
4. NST
5. Helix

## 修补bash漏洞

## 安全监控和日志

1. 使用Logcheck
2. 使用Glances监控系统
3. 使用MultiTail监控日志
4. 使用系统工具Whowatch
5. stat
6. lsof
7. strace
8. lynis

## 服务器受攻击后的处理过程

运维角度：
1. 一般思路
2. 检查并锁定可疑账户
3. 检查系统日志
4. 检查并关闭可疑进程
5. 检查文件系统完好性

## 一次攻击后的分析
运维角度：
1. 现象
2. 初步分析
3. 断网分析系统
4. 攻击溯源
5. 查找攻击原因
6. 揭开谜团
7. 回复网站

## 数据安全

运维角度：
1. 数据镜像软件DRBD
2. 数据恢复软件extundelete
