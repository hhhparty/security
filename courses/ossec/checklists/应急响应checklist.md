# 应急响应 CHECKLIST

## 应急响应内容
- web 入侵：网页挂马、网页篡改、上传webshell、黑链、暗链等；
- 主机入侵：病毒、后门、系统异常、RDP爆破、SSH爆破、主机漏洞利用、数据库入侵
- 网络入侵：DDOS、DNS劫持、HTTP劫持、ARP欺骗等
- 路由器、交换机异常

## 常见入侵征兆

- CPU超常规运行、内存超常规占用、磁盘空间异常变化
- 异常界面
- 异常网络连接
- 异常账号
- 异常文件
- 安全设备告警等。

## 分析流程
- 初判攻击类型
- 初判攻击时间
- 文件分析
  - 特征分析：可疑IP、时间特征、状态特征
- 进程分析
- 系统分析
- 日志分析
  - 可疑IP
  - 可疑特征
  - 状态过滤
- 关联分析
- 推理
  - 确定攻击手段和攻击者
  - 溯源与攻击过程还原
- 总结

## 工具
- https://github.com/theLSA/hack-er-tools
- https://github.com/Bypass007/emergency-Response-Notes

## 可疑特征

### 域名

.ru 俄罗斯，.us 美国

#### 易申请难最终的域名

.ws .cc  .pw .bz .su .bw .gw .ms .mz

#### 动态域名提供商

很多...

#### DGA 域名

### 敏感目录与文件

#### 中间件及Web容器日志默认位置

##### IIS: 
C:\\WINDOWS\system32\Logfiles

##### apache
/usr/local
c:/apache/logs

##### tomcat
conf/logging.properties
logs/catalina.xx.log
logs/catalina.xx.log
logs/host-manager.xx.log
logs/localhost.xx.log
logs/manager.xx.log
主要记录系统启、关闭日志、管理日志和异常信息
##### weblogic
domain_name/servers/server_name/logs/
server_name.log：server启停日志
access.log：安装在该server之上的应用http访问日志
##### jboss
LOG4J配置默认Deploy/conf/
如jboss/server/default/conf/jboss-log4j.xml


#### 数据库文件
##### mysql 日志
###### 错误日志，默认开启
hostname.err 
###### 查询日志记录所有操作，默认关闭
general_log_file 

###### 慢查询日志，记录执行超时的查询语句
slow_query_log_file 
###### 事务日志
ib_logfile0 
###### 二进制日志 记录修改数据或可能一起改变的语句
log_bin
mysql-bin.00001
##### mysql 其它文件
mysql\lib\plugin目前下的异常文件

##### mssqlserver日志
exec xp_readerrorlog
object Explorer-management-SQL logs-view-logs
###### SQLSERVER 2008
R2\MSSQL10_50.MSSQLSERVER\MSSQL\Log\ERRORLOG


### webshell检查脚本
方法：
- D盾工具检查
- 其它webshell扫描工具

下面是一个手动扫描命令

```shell
find /var/www/ -name "*.php" |xargs egrep 'assert|phpspy|c99sh|milw0rm|eval|(gunerpress|
(base64_decoolcode|spider_bc|shell_exec|passthru|($_\POST[|eval
(str_rot13|.chr(|${"_P|eval($_R|file_put_contents(.*$_|base64_decode'
```


```shell
find ./ -name "*.php" |xargs egrep "phpspy|c99sh|milw0rm|eval(gunerpress|eval(base64_decoolcode|spider_bc))" > /tmp/php.txt

grep -r –include=*.php  '[^a-z]eval($_POST' . > /tmp/eval.txt

grep -r –include=*.php  'file_put_contents(.*$_POST[.*]);' . > /tmp/file_put_contents.txt

find ./ -name "*.php" -type f -print0 | xargs -0 egrep “(phpspy|c99sh|milw0rm|eval(gzuncompress(base64_decoolcode|eval(base64_decoolcode|spider_bc|gzinflate)” | awk -F: '{print $1}' | sort | uniq
```

### 数据库排查


## 常用手工命令

### 查询多个文件名
```
find / -name "hostname.err" -or -name "general_log_file" -or -name "*slow*log*" -or -name "ib_logfile0"`

find . -type f -iname "Test.class" -o -iname "Test$"*  

find . -type f \( -name "*Test.class" -o -name  "Test$"* \)
```

### 近期更改查询
查找最近一天被修改的PHP文件
`find -mtime -1 -type f -name *.php`

### 批量更改web文件权限

`find -type f -name *.php -exec chmod 444 {} ;`

`find ./ -type d -exec chmod 555 {} ;`

### mysql控制台查询

```
show global variables like "%log%";
show global variables like "%gene%";

show master status;

systemmore /mydata/data/stu18_slow.log;

show binary logs;
show master logs;
show processlist;
```
