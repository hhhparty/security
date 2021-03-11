# PHP 小手册

## 常用函数

### 字符转义函数

#### mysql_real_escape_string() 

函数转义 SQL 语句中使用的字符串中的特殊字符。

下列字符受影响：`\x00 \n \r \ ' " \x1a`

如果成功，则该函数返回被转义的字符串。如果失败，则返回 false。

语法: `mysql_real_escape_string(string,connection)`
参数	描述
string	必需。规定要转义的字符串。
connection	可选。规定 MySQL 连接。如果未规定，则使用上一个连接。


### 字符串

#### stripos(string,find,start)：
函数查找字符串在另一字符串中第一次出现的位置,不区分大小写。
### 正则匹配
#### eregi(string pattern, string string)：
检查string中是否含有pattern（不区分大小写），如果有返回True，反之False。