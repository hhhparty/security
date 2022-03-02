# DUMP 

数据库表内容与文件的导入、导出操作

## mysql 导出数据
### 使用select ... into outfile 语句导出数据
当前数据库用户有os系统写文件权限时
```sql
mysql>SELECT * FROM some_table_name INTO OUTFILE '/tmp/文件名.' ;

mysql>SELECT * FROM some_table_name INTO OUTFILE '/tmp/文件名' FIELDS TERMINATED BY ',' ENCLOSED BY '"' LINES TERMINATED BY '\r\n';
```

导出结果为查询结果集内容。

说明：
- 文件名不能说已有文件，即不能覆盖。
- 需要权限
- 该文件可读，但所有者权限为mysql服务器所有。
### 使用 mysqldump 导出可用的sql脚本
```shell

mysqldump -u 用户名 -p 数据库名 > some-file-name

mysqldump -u 用户名 -p some_db_name some_table_name > some-file-name

mysqldump -u 用户名 -p --no-create-info --tab=/tmp some_db_name some_table_name > some-file-name
```


说明：
- --tab 指定导出文件的目录
- 目标文件必须为空


## mysql 导入数据

```
mysql -u 用户名 -p 数据库名 < 数据文件名

mysql  -u 用户名 -p 数据库名 | mysql -h 其它主机域名或ip地址 数据库名
```