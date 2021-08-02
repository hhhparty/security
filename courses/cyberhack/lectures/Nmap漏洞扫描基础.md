# 漏洞基础

## 1 基本概念

随着现代软件工业的发展，软件规模不断扩大，软件内部的逻辑也变得异常复杂。为了保证软件的质量，测试环节在软件生命周期中所占的地位已经得到了普遍重视。在一些著名的大型软件公司中，测试环节（QA）所耗费的资源甚至已经超过了开发。

即便如此，不论从理论上还是工程上都没有任何人敢声称能够彻底消灭软件中所有的逻辑缺陷——漏洞（vulnerability or bug）。

两类漏洞：
- 功能性逻辑缺陷（bug）
  - 影响软件的正常功能，例如，执行结果错误、图标显示错误等。
- 安全性逻辑缺陷（漏洞）
  - 通常情况下不影响软件的正常功能，但被攻击者成功利用后，有可能引起软件去执行额外的恶意代码。常见的漏洞包括软件中的缓冲区溢出漏洞、网站中的跨站脚本漏洞（XSS）、SQL 注入漏洞等。

利用漏洞进行攻击可以大致分为3个步骤：
- 漏洞挖掘
- 漏洞分析
- 漏洞利用

## 2 漏洞扫描

漏洞扫描用于发现操作系统、网络服务、应用软件等的漏洞。

下面介绍使用Nmap vulscan进行漏洞扫描

### 2.1 安装

在 https://github.com/scipag/vulscan 下载这个插件

然后在已安装nmap的目录下，找到scripts，将vulscan目录放于此。

### 2.2 使用命令
```
nmap -sV --script=vulscan/vulscan.nse 目标网站域名或ip地址
```

### 2.3 漏洞库数据

scipvuldb.csv – https://vuldb.com

cve.csv – http://cve.mitre.org

osvdb.csv – http://www.osvdb.org

securityfocus.csv – http://www.securityfocus.com/bid/

securitytracker.csv – http://www.securitytracker.com

xforce.csv – http://xforce.iss.net

expliotdb.csv – http://www.exploit-db.com

openvas.csv – http://www.openvas.org

默认会调用上述所有漏洞数据进行扫描，若仅想使用单一漏洞库可以使用下列参数：

```
# 使用--script-args vulscandb=你想指定的漏洞数据库
nmap -sV --script=vulscan/vulscan.nse --script-args=cve.csv 目标网站域名或ip地址
```

### 2.4 漏洞库升级

需要手动下载csv文件。

http://www.computec.ch/projekte/vulscan/download/cve.csv

http://www.computec.ch/projekte/vulscan/download/exploitdb.csv

http://www.computec.ch/projekte/vulscan/download/openvas.csv

http://www.computec.ch/projekte/vulscan/download/osvdb.csv

http://www.computec.ch/projekte/vulscan/download/scipvuldb.csv

http://www.computec.ch/projekte/vulscan/download/securityfocus.csv

http://www.computec.ch/projekte/vulscan/download/securitytracker.csv

http://www.computec.ch/projekte/vulscan/download/xforce.csv

### 2.5 其它

#### 2.5.1 版本检测功能
版本检测功能在于对软件版本和漏洞数据库的具体信息进行探测，关闭该功能可能会导致误报，减少漏报提高运行效率，你可以使用以下命令把该功能关闭：
```
--script-args vulscanversiondetection=0
```
#### 2.5.2 优先匹配功能
该功能在于对漏洞检测进行最优匹配扫描，可能会引起误报，但有利于对漏洞进行全面识别，使用以下命令开启该功能：
```
--script-args vulscanshowall=1
```

#### 2.5.3 交互模式
该功能可以涵盖所有端口的检测结果，使用以下命令开启该功能：
```
--script-args vulscaninteractive=1
```
## 3 BurpSuite

功能特性：
- Interception Proxy:旨在让用户控制发送到服务器的请求。
- Repeater:快速重复或修改指定请求的能力。
- Intruder:允许自动化自定义攻击和payload。
- Decoder:解码和编码不同格式的字符串URL,BASE64,HTML等等。
- Comparer: 高亮显示不同的请求或响应之间的不同处。
- Extender: 扩展Burp功能的API接口以及许多通过BApp商店免费提供的扩展。
- Spider and Discover Content feature:爬取web应用程序上的链接并且可以被用来动态枚举非显式链接的内容来寻找信息。
- Scanner (Pro Only): 检查web应用程序漏洞XSSSQLi代码注入文件包含等的自动扫描程序。   
