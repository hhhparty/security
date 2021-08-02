# Linux日志查阅与分析

## Linux 日志分类
### 查看连接事件日志

`/var/log/wtmp` 记录一个用户每次进入和退出事件, `/var/run/utmp` 记录当前登录的每个用户

- 使用`who`查询当前登录每个账户，缺省输出用户名，终端类型，登录日期，远程主机。例如`who /var/log/wtmp` 将报告从wtmp文件创建或删改以来的每一次登录记录。

- 使用`w`查看utmp文件并显示当前系统中每个用户和它所运行的进程。
- 使用`users`打印当前用户和关联的登录会话，如果一个用户有多个会话，那么会该用户名会显示多次。
- 使用`last`命令从后向前搜索wtmp从wtmp文件创建或删改以来的登录过的用户。
- 使用`ac`命令根据/var/log/wtmp文件中的登录进入和退出来报告用户连接的时间（小时），```ac```显示总时间，```ac -d```显示每天连接时间，`ac -p`显示每个用户连接总时间。

### 最近成功登录事件和最后一次不成功登录日志 `/var/log/lastlog`。

以root使用`lastlog`命令来检查某个特定用户上次登录的时间，输出格式为“登录名、端口号（tty）和上次登录时间”。`lastlog -u 102`将uid=102的用户显示出来，`last -t 7`标识显示上一周的报告。

### 进程统计日志
可以发现每个用户执行了哪些命令，有助于跟踪入侵者。但进程日志必须激活启动才可用。

- 使用`touch some_log_filename`, `accton some_log_filename`命令启动进程统计。
- 启动后，可以使用`lastcomm`命令检测系统何时执行了何种操作，包括命令名、用户、tty、命令花费的CPU时间和一个时间戳。

- 使用`accton`可以关闭统计。
- 使用`sa`命令报告、清理、维护进程统计文件。`sa` 会读取启动了的某进程统计日志，如some_log_filename，还会将其压缩到摘要文件`/var/log/savacct` 和 `/var/log/usracct` 中。

### syslog 日志

支持Syslog设备的日志函数会使用syslog记录事件。Syslog设备主要有守护进程`/etc/syslogd`和配置文件`/etc/syslog.conf`。多数syslog信息被写到`/var/adm`或`/var/log/messages.*`中

### 错误日志 `/var/log/messages` 
### http web 传输日志 `access-log`
### 用户命令日志 `acct/pacct`
### 失败记录日志 `/var/log/btmp`
###  modem 活动记录日志 `aculog`
### sudo命令日志 `sudolog`
### su命令日志 `sulog`
###  `xferlog` FTP 会话日志

## 查看命令

### 文本型的日志查看
Linux查看命令有多种：tail，head，cat，tac，more

####  tail 命令
`tail [ -f ] [ -c Number | -n Number | -m Number | -b Number | -k Number ] [ File ]`

参数：
- -f 循环读取
- -q 不显示处理信息
- -v 显示详细的处理信息
- -c Number 从 Number 字节位置读取指定文件
- -n Number 从 Number 行位置读取指定文件
- -m Number 从 Number 多字节字符位置读取指定文件，比方你的文件假设包括中文字，假设指定-c参数，可能导致截断，但使用-m则会避免该问题
- -b Number 从 Number 表示的512字节块位置读取指定文件。
- -k Number 从 Number 表示的1KB块位置读取指定文件。

上述命令中，都涉及到number，假设不指定，默认显示10行。Number前面可使用正负号，表示该偏移从顶部还是从尾部開始计算。

应用：
 命令	含义
 tail -f test.log	查看实时日志
 tail -100f test.log	查看最后100行日志记录
 tail -n 10 test.log	查询日志尾部最后10行的日志
 tail -n  10 test.log	查询10行之后的所有日志
 tail -fn 100 test.log	循环实时查看最后100行记录

#### head 命令
功能跟tail是相反的，tail是查看后多少行日志

命令	含义
 head -n 10 test.log	查询日志文件中的前10行日志
 head -n -10 test.log	查询日志文件除了最后10行的其他所有日志

#### cat 命令
功能
 - 一次显示整个文件。 cat filename
 - 创建一个文件。 cat > filename
 - 将几个文件合并为一个文件。 cat file1 file2 > file

参数：
- -n 由1开始对所有输出的行数编号
- -b 和-n相似，只不过对于空白行不编号
- -s 当遇到有连续两行以上的空白行，就代换为一行的空白行
- -c<数目> 显示的字节数
- -n<行数> 显示行数

应用
- cat test.log | tail -n 1000 #输出test.log 文件最后1000行

2）cat -n test.log |grep “debug” #得到关键日志的行号

3）cat filename | tail -n  3000 | head -n 1000 #从第3000行开始，显示1000行。即显示3000~3999行

4）cat filename| head -n 3000 | tail -n  1000 #显示1000行到3000行

5）cat -n textfile1 > textfile2 #把 textfile1 的档案内容加上行号后输入 textfile2 这个档案里

6）cat -b textfile1 textfile2 >> textfile3 #把 textfile1 和 textfile2 的档案内容加上行号（空白行不加）之后将内容附加到 textfile3 里

7）cat error.log | grep -C 5 ‘nick’ 显示file文件里匹配foo字串那行以及上下5行
 cat error.log | grep -B 5 ‘nick’ 显示foo及前5行
 cat error.log | grep -A 5 ‘nick’ 显示foo及后5行

#### tac 命令
功能
 tac是将cat反写过来，它的功能跟cat相反，cat是由第一行到最后一行连续显示，而tac是由最后一行到第一行反向显示。

####  more 命令
功能
 类似cat，不过以一页一页形式显示。基本指令按空白键（space）往下一页显示，按返回键（back）往上一页显示，还有字符搜索功能（与vi相似）

参数
- -num 一次显示的行数

2）-d 提示使用者，在画面下方显示 [Press space to continue, ‘q’ to quit.] ，如果使用者按错键，则会显示 [Press ‘h’ for instructions.] 而不是 ‘哔’ 声

3）-l 取消遇见特殊字元 ^L 时会暂停的功能

4）-f 计算行数时，以实际上的行数，而非自动换行过后的行数

5）-p 不以卷动的方式显示每一页，而是先清除萤幕后再显示内容

6）-c 跟 -p 相似，不同的是先显示内容再清除其他旧资料

7）-s 当遇到有连续两行以上的空白行，就代换为一行的空白行

8）-u 不显示下引号 （根据环境变数 TERM 指定的 terminal 而有所不同）

9） /pattern 在每个文档显示前搜寻该字串（pattern），然后从该字串之后开始显示

10） num 从第 num 行开始显示

应用
 如果我们查找的日志很多,打印在屏幕上不方便查看, 使用more和less命令,
 如: cat -n test.log |grep “条件” |more     这样就分页打印了,通过点击空格键翻页

命令	含义
 more -s test.log	逐页显示日志，如有连续两行以上空白行则以一行空白行显示
 more  20 test.log	从第 20 行开始显示日志内容

####  grep 命令
功能：
 上面几个命令都是用在查找文件方便，而在查找文件时，我们往往需要通过某些关键字查找，grep命令就可以帮助我们实现快速查找。

**参数:  **
 [options]主要参数：
 －c：只输出匹配行的计数。
 －I：不区分大 小写(只适用于单字符)。
 －h：查询多文件时不显示文件名。
 －l：查询多文件时只输出包含匹配字符的文件名。
 －n：显示匹配行及 行号。
 －s：不显示不存在或无匹配文本的错误信息。
 －v：显示不包含匹配文本的所有行。
 pattern正则表达式主要参数：
 ： 忽略正则表达式中特殊字符的原有含义。
 ^：匹配正则表达式的开始行。
 $: 匹配正则表达式的结束行。
 <：从匹配正则表达 式的行开始。

 ：到匹配正则表达式的行结束。
 [ ]：单个字符，如[A]即A符合要求 。
 [ - ]：范围，如[A-Z]，即A、B、C一直到Z都符合要求 。
 。：所有的单个字符。
 

：有字符，长度可以为0。
操作：
 1、或操作
 grep -E ‘123|abc’ filename  // 找出文件（filename）中包含123或者包含abc的行
 egrep ‘123|abc’ filename    // 用egrep同样可以实现
 awk ‘/123|abc/’ filename   // awk 的实现方式

2、与操作
 grep pattern1 files | grep pattern2 ：显示既匹配 pattern1 又匹配 pattern2 的行。

3、其他操作
 grep -i pattern files ：不区分大小写地搜索。默认情况区分大小写，
 grep -l pattern files ：只列出匹配的文件名，
 grep -L pattern files ：列出不匹配的文件名，
 grep -w pattern files ：只匹配整个单词，而不是字符串的一部分（如匹配‘magic’，而不是‘magical’），
 grep -C number pattern files ：匹配的上下文分别显示[number]行，

应用
- more joint.log | grep ‘60007746’ #根据某退货号查询日志

很多时候，我们都需要看到上下几行的日志，可以通过加相关参数实现。

2）more joint.log | grep -5 ‘60007746’ #打印匹配行的前后5行

3）more joint.log | grep -C 5 ‘60007746’ #打印匹配行的前后5行

4）more joint.log | grep -A 5 ‘60007746’ #打印匹配行的后5行

5）more joint.log | grep -B 5 ‘60007746’ #打印匹配行的前5行

6）cat -n umltech-scan |grep ‘reqBody’ #在日志文件中查找某个字符串:cat -n 日志文件 |grep ‘查找内容’,如果内容太多可以通过后面加more,通过空格查看下一页

7）cat -n umltech-scan |grep ‘reqBody’>/test #将按条件查询到的日志内容保存到文件中:cat -n 日志文件|grep ‘查找内容’ >保存位置

#### sed
应用
 sed -n ‘5,10p’ filename 这样你就可以只查看文件的第5行到第10行。

sed -n ‘/2018-02-06 15:05:38/,/2018-02-06 15:20:38/p’ umltech-scan
 按时间段查询日志:sed -n ‘/开始时间/,/结束时间/p’ umltech-scan,时间格式为"yyyy-mm-dd hh:mm:ss"

#### vi
应用
 查找文件内容关键字方法：
 先 执行命令>：  vi      filename
 然后输入>:   /查找字符串
 按n查找下一个，按N（大写）查找上一个

#### ag：
ag：比grep、ack更快的递归搜索文件内容

安装：sudo apt-get install silversearcher-ag
 RHEL7+
 rpm -Uvh http://download.fedoraproject.org/pub/epel/7/x86_64/e/epel-release-7-5.noarch.rpm
 yum install the_silver_searcher

RHEL7－
 wget ftp://ftp.pbone.net/mirror/ftp5.gwdg.de/pub/opensuse/repositories/utilities/CentOS_6/x86_64/the_silver_searcher-0.14-1.1.x86_64.rpm
 rpm -ivh the_silver_searcher-0.14-1.1.x86_64.rpm

使用
 命令行使用
 ag HelloWorld

ag HelloWorld path/to/search

ag -g  类似于 find . -name 

ag -i PATTERN： 忽略大小写搜索含PATTERN文本

ag -A PATTERN：搜索含PATTERN文本，并显示匹配内容之后的n行文本，例如：ag -A 5  abc会显示搜索到的包含abc的行以及它之后5行的文本信息。

ag -B PATTERN：搜索含PATTERN文本，并显示匹配内容之前的n行文本

ag -C PATTERN：搜索含PATTERN文本，并同时显示匹配内容以及它前后各n行文本的内容。

ag --ignore-dir 


：忽略某些文件目录进行搜索。

ag -w PATTERN： 全匹配搜索，只搜索与所搜内容完全匹配的文本。

ag --java PATTERN： 在java文件中搜索含PATTERN的文本。

ag --xml PATTERN：在XML文件中搜索含PATTERN的文本。

man ag：使用方法请查看帮助：
### 二进制型日志查看

- 使用`who`查询当前登录每个账户，缺省输出用户名，终端类型，登录日期，远程主机。例如`who /var/log/wtmp` 将报告从wtmp文件创建或删改以来的每一次登录记录。
- 使用`w`查看utmp文件并显示当前系统中每个用户和它所运行的进程。
- 使用`users`打印当前用户和关联的登录会话，如果一个用户有多个会话，那么会该用户名会显示多次。
- 使用`last`命令从后向前搜索wtmp从wtmp文件创建或删改以来的登录过的用户。
- 使用`ac`命令根据/var/log/wtmp文件中的登录进入和退出来报告用户连接的时间（小时），```ac```显示总时间，```ac -d```显示每天连接时间，`ac -p`显示每个用户连接总时间。