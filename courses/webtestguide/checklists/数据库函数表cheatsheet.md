
# 数据库函数表

## SQLite

https://sqlite.org/lang_corefunc.html

## Mysql
所有文档
https://dev.mysql.com/doc/

函数
https://dev.mysql.com/doc/refman/5.7/en/functions.html

## HSQLDB

http://hsqldb.org/web/hsqlDocsFrame.html

内置函数：
http://hsqldb.org/doc/2.0/guide/builtinfunctions-chapt.html

hsql数据库是一款纯Java编写的免费数据库，体积小，才563kb。仅一个hsqldb.jar文件就包括了数据库引擎，数据库驱动， 还有其他用户界面操作等内容。纯Java设计，又支持SQL99，SQL2003大部分的标准，所以也是作为商业应用程序展示的一种选择。


hsql数据库引擎有几种服务器模式：
- 常用的Server模式
- WebServer模式
- Servlet模式
- Standlone模式
- Memory-Only数据库。

最为常用的Server模式: 在hsqldb\lib 目录，即hsqldb jar文件所在目录下，运行```java -cp hsqldb.jar org.hsqldb.Server -database.0 db/mydb -dbname.0 xdb```，xdb相当于数据库别名，执行命令后后会在lib目录下生成一个db文件夹，将会在db文件夹下创建一个数据库mydb，别名（用于访问数据库）是xdb，如果存在mydb数据库，将会打开它。

- 在lib文件夹目录下运行数据库界面操作工具：```java -cp hsqldb.jar org.hsqldb.util.DatabaseManager```


## CASE WHEN

