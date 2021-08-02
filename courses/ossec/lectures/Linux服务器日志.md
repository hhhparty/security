# Linux 服务器日志

## 系统自带日志
Linux中系统相关的日志大多在 /var/log/ 中。

在 /var/log/ 中：
- boot.log 启动日志，含自启动服务。
- btmp 记录登录失败信息，二进制文件
  - 查看使用 ```last -f /var/log/btmp```
- cron 计划任务日志，每当cron任务被执行，就会在此记录一笔。
- dmesg 内存缓冲区信息（kernel ring buffer）。系统启动时信息记录。
- lastlog 记录所有用户的最近信息。二进制文件
  - 使用```lastlog```查看
- maillog 包含来自系统运行的mail日志信息
- message 包含整体系统信息，启动时间、mail、cron、daemon、kern、auth等均记录其中

- yum.log 记录yum安装软件包信息
- anaconda/ 包含安装CentOS/RHEL时候的日志。
- audit/ 包含audit daemon的审计日志，如果selinux开启，那就会记录selinux日志。
- sa/ 包含每日由sysstat软件包收集的日志
- cups cups打印服务运行日志
- secure 记录登录信息
- utmp 记录登录信息

## apache web server 日志

安装了apache web server，通常会创建 /var/log/httpd/ 目录。

apache服务器通常会建立两类日志：
- access logs
- error logs ，记录异常和错误

样例可参考：
- https://github.com/logpai/loghub/tree/master/Apache
- http://log-sharing.dreamhosters.com/


## 系统查阅小工具


- less
- tail
- uniq

### tail

如 ```tail -400f  demo.log``` 查看最后400行日志文件变化，等同于```tail -n 400 -f demo.log``` -f是实时的意思 

### last

last和lastb 可用于现实最近登录的用户

last向后查找文件 /var/log/wtmp中的内容，显示该文件创立后所有用户登录情况。

```last [-num | -n num] [-f file] [-t YYYYMMDDHHMMSS] [-R] [-adioxFw] [username..] [tty..]```

- -num |-n num指定输出记录的条数
- -f file 指定记录文件作为查询的log文件
- -t YYYYMMDDHHMMSS 显示指定时间之前的登录情况
- username 账户名称 tty 终端机编号

选项:
- -R 不显示登录系统或终端的主机名称或IP
- -a 将登录系统或终端的主机名过IP地址显示在最后一行
- -d 将IP地址转成主机名称
- -I 显示特定IP登录情况。
- -o 读取有linux-libc5应用编写的旧类型wtmp文件
- -x 显示系统关闭、用户登录和退出的历史
- -F 显示登录的完整时间
- -w 在输出中显示完整的用户名或域名

#### 举例
显示10条指定时间之前的记录：
```last -10 -t 20180425000000　```

显示10条并将ip地址转换为主机地址
```last -10 -d```

### grep

用于按模式查找文件内容。

#### 语法

Usage: ``` grep [OPTION]... PATTERNS [FILE]...```

例如：```grep -i 'hello world' menu.h main.c```


#### 样例

- ```grep 'INFO' demo.log```     #在文件demo.log中查找所有包行INFO的行

- ```grep -o 'order-fix.curr_id:\([0-9]\+\)' demo.log```    #-o选项只提取order-fix.curr_id:xxx的内容（而不是一整行），并输出到屏幕上

- ```grep -C 'ERROR' demo.log```   #输出文件demo.log中查找所有包行ERROR的行的数量

- ```grep -v 'ERROR' demo.log```   #查找不含"ERROR"的行


#### 帮助
模式可以包含多个按行分开的模式。

模式选择与解释：
-  -E, --extended-regexp     按正则式扩展模式
-  -F, --fixed-strings       模式是个字符串
-  -G, --basic-regexp        PATTERNS 是基本的正则表达式
-  -P, --perl-regexp         PATTERNS are Perl regular expressions
-  -e, --regexp=PATTERNS     use PATTERNS for matching
-  -f, --file=FILE           从文件获取模式
-  -i, --ignore-case         忽略大小写
-  -w, --word-regexp         仅匹配完整字符串
-  -x, --line-regexp         仅匹配完整行
-  -z, --null-data           a data line ends in 0 byte, not newline

其他选项 Miscellaneous:
-  -s, --no-messages         suppress error messages
-  -v, --invert-match        select non-matching lines，即反选
-  -V, --version             display version information and exit
-      --help                display this help text and exit

输出控制 Output control:
-  -m, --max-count=NUM       stop after NUM selected lines
-  -b, --byte-offset         print the byte offset with output lines
-  -n, --line-number         print line number with output lines
-      --line-buffered       flush output on every line
-  -H, --with-filename       print file name with output lines
-  -h, --no-filename         suppress the file name prefix on output
-      --label=LABEL         use LABEL as the standard input file name prefix
-  -o, --only-matching       仅显示命中信息（不显示所在行整行内容）
-  -q, --quiet, --silent     suppress all normal output
-      --binary-files=TYPE   assume that binary files are TYPE;
                            TYPE is 'binary', 'text', or 'without-match'
-  -a, --text                equivalent to --binary-files=text
-  -I                        equivalent to --binary-files=without-match
-  -d, --directories=ACTION  how to handle directories;
                            ACTION is 'read', 'recurse', or 'skip'
-  -D, --devices=ACTION      how to handle devices, FIFOs and sockets;
                            ACTION is 'read' or 'skip'
-  -r, --recursive           like --directories=recurse
-  -R, --dereference-recursive  likewise, but follow all symlinks
-      --include=GLOB        search only files that match GLOB (a file pattern)
-      --exclude=GLOB        skip files and directories matching GLOB
-      --exclude-from=FILE   skip files matching any file pattern from FILE
-      --exclude-dir=GLOB    skip directories that match GLOB
-  -L, --files-without-match  print only names of FILEs with no selected lines
-  -l, --files-with-matches  print only names of FILEs with selected lines
-  -c, --count               仅显示指定数量的行 print only a count of selected lines per FILE
-  -T, --initial-tab         make tabs line up (if needed)
-  -Z, --null                print 0 byte after FILE name

Context control:
-  -B, --before-context=NUM  print NUM lines of leading context
-  -A, --after-context=NUM   print NUM lines of trailing context
-  -C, --context=NUM         打印grep输出的行数 print NUM lines of output context
-  -NUM                      same as --context=NUM
-      --color[=WHEN],
-      --colour[=WHEN]       use markers to highlight the matching strings;
                            WHEN is 'always', 'never', or 'auto'
-  -U, --binary              do not strip CR characters at EOL (MSDOS/Windows)


如果文件名为 '-'，意思是从标准输入读取。

如果没有指定文件，则从当前目录递归读取。

退出状态为 0 时，表示有某一行被命中，返回1，表示没有一行命中。

如果有错误发生，且未使用 -q 参数，则会返回状态 2.


### sed

Linux sed 命令是利用脚本来处理文本文件。

sed 可依照脚本的指令来处理、编辑文本文件。

Sed 主要用来自动编辑一个或多个文件、简化对文件的反复操作、编写转换程序等。


#### 样例

- ```sed -e 4a\newLine testfile ``` 在testfile文件的第四行后添加一行，并将结果输出到标准输出，在命令行提示符下输入如下命令：


#### 帮助

语法: ```sed [-hnV][-e<script>][-f<script文件>][文本文件]```


参数说明：

- -e<script>或--expression=<script> 以选项中指定的script来处理输入的文本文件。
- -f<script文件>或--file=<script文件> 以选项中指定的script文件来处理输入的文本文件。
- -h或--help 显示帮助。
- -n或--quiet或--silent 仅显示script处理后的结果。
- -V或--version 显示版本信息。


动作说明：
- a ：新增， a 的后面可以接字串，而这些字串会在新的一行出现(目前的下一行)～
- c ：取代， c 的后面可以接字串，这些字串可以取代 n1,n2 之间的行！
- d ：删除，因为是删除啊，所以 d 后面通常不接任何咚咚；
- i ：插入， i 的后面可以接字串，而这些字串会在新的一行出现(目前的上一行)；
- p ：打印，亦即将某个选择的数据印出。通常 p 会与参数 sed -n 一起运行～
- s ：取代，可以直接进行取代的工作哩！通常这个 s 的动作可以搭配正规表示法！例如 1,20s/old/new/g 就是啦！

## 集成工具
### Graylog

Graylog 于 2011 年在德国创立，现在作为开源工具或商业解决方案提供。它被设计成一个集中式日志管理系统，接受来自不同服务器或端点的数据流，并允许你快速浏览或分析该信息。

Graylog 在系统管理员中有着良好的声誉，因为它易于扩展。大多数 Web 项目都是从小规模开始的，但它们可能指数级增长。Graylog 可以均衡后端服务网络中的负载，每天可以处理几 TB 的日志数据。

IT 管理员会发现 Graylog 的前端界面易于使用，而且功能强大。Graylog 是围绕仪表板的概念构建的，它允许你选择你认为最有价值的指标或数据源，并快速查看一段时间内的趋势。

当发生安全或性能事件时，IT 管理员希望能够尽可能地根据症状追根溯源。Graylog 的搜索功能使这变得容易。它有内置的容错功能，可运行多线程搜索，因此你可以同时分析多个潜在的威胁。

### Nagios

Nagios 始于 1999 年，最初是由一个开发人员开发的，现在已经发展成为管理日志数据最可靠的开源工具之一。当前版本的 Nagios 可以与运行 Microsoft Windows、Linux 或 Unix 的服务器集成。

它的主要产品是日志服务器，旨在简化数据收集并使系统管理员更容易访问信息。Nagios 日志服务器引擎将实时捕获数据，并将其提供给一个强大的搜索工具。通过内置的设置向导，可以轻松地与新端点或应用程序集成。

Nagios 最常用于需要监控其本地网络安全性的组织。它可以审核一系列与网络相关的事件，并帮助自动分发警报。如果满足特定条件，甚至可以将 Nagios 配置为运行预定义的脚本，从而允许你在人员介入之前解决问题。

作为网络审计的一部分，Nagios 将根据日志数据来源的地理位置过滤日志数据。这意味着你可以使用地图技术构建全面的仪表板，以了解 Web 流量是如何流动的。

### Elastic Stack (ELK Stack)

Elastic Stack，通常称为 ELK Stack，是需要筛选大量数据并理解其日志系统的组织中最受欢迎的开源工具之一（这也是我个人的最爱）。

它的主要产品由三个独立的产品组成：Elasticsearch、Kibana 和 Logstash.

顾名思义， Elasticsearch 旨在帮助用户使用多种查询语言和类型在数据集之中找到匹配项。速度是它最大的优势。它可以扩展成由数百个服务器节点组成的集群，轻松处理 PB 级的数据。

Kibana 是一个可视化工具，与 Elasticsearch 一起工作，允许用户分析他们的数据并构建强大的报告。当你第一次在服务器集群上安装 Kibana 引擎时，你会看到一个显示着统计数据、图表甚至是动画的界面。

ELK Stack 的最后一部分是 Logstash，它作为一个纯粹的服务端管道进入 Elasticsearch 数据库。你可以将 Logstash 与各种编程语言和 API 集成，这样你的网站和移动应用程序中的信息就可以直接提供给强大的 Elastic Stalk 搜索引擎中。

ELK Stack 的一个独特功能是，它允许你监视构建在 WordPress 开源网站上的应用程序。与跟踪管理日志和 PHP 日志的大多数开箱即用的安全审计日志工具相比，ELK Stack 可以筛选 Web 服务器和数据库日志。

糟糕的日志跟踪和数据库管理是导致网站性能不佳的最常见原因之一。没有定期检查、优化和清空数据库日志，不仅会降低站点的运行速度，还可能导致其完全崩溃。因此，ELK Stack 对于每个 WordPress 开发人员的工具包来说都是一个优秀的工具。

### LOGalyze

LOGalyze 是一个位于匈牙利的组织，它为系统管理员和安全专家构建开源工具，以帮助他们管理服务器日志，并将其转换为有用的数据点。其主要产品可供个人或商业用户免费下载。

LOGalyze 被设计成一个巨大的管道，其中多个服务器、应用程序和网络设备可以使用简单对象访问协议（SOAP）方法提供信息。它提供了一个前端界面，管理员可以登录界面来监控数据集并开始分析数据。

在 LOGalyze 的 Web 界面中，你可以运行动态报告，并将其导出到 Excel 文件、PDF 文件或其他格式。这些报告可以基于 LOGalyze 后端管理的多维统计信息。它甚至可以跨服务器或应用程序组合数据字段，借此来帮助你发现性能趋势。

LOGalyze 旨在不到一个小时内完成安装和配置。它具有预先构建的功能，允许它以法律所要求的格式收集审计数据。例如，LOGalyze 可以很容易地运行不同的 HIPAA 报告，以确保你的组织遵守健康法律并保持合规性。

### Fluentd

如果你所在组织的数据源位于许多不同的位置和环境中，那么你的目标应该是尽可能地将它们集中在一起。否则，你将难以监控性能并防范安全威胁。

Fluentd 是一个强大的数据收集解决方案，它是完全开源的。它没有提供完整的前端界面，而是作为一个收集层来帮助组织不同的管道。Fluentd 在被世界上一些最大的公司使用，但是也可以在较小的组织中实施。

Fluentd 最大的好处是它与当今最常用的技术工具兼容。例如，你可以使用 Fluentd 从 Web 服务器（如 Apache）、智能设备传感器和 MongoDB 的动态记录中收集数据。如何处理这些数据完全取决于你。

Fluentd 基于 JSON 数据格式，它可以与由卓越的开发人员创建的 500 多个插件一起使用。这使你可以将日志数据扩展到其他应用程序中，并通过最少的手工操作从中获得更好的分析。