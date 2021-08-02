# PHP函数参考

https://www.w3school.com.cn/php/index.asp


## PHP Filesystem 函数


### file_put_contents() 函数


file_put_contents() 函数把一个字符串写入文件中。与依次调用 fopen()，fwrite() 以及 fclose() 功能一样。

```file_put_contents(file,data,mode,context)```

- file 必需。规定要写入数据的文件。如果文件不存在，则创建一个新文件。
- data 可选。规定要写入文件的数据。可以是字符串、数组或数据流。
- mode 可选。规定如何打开/写入文件。可能的值：
  - ```FILE_USE_INCLUDE_PATH```
  - ```FILE_APPEND```
  - ```LOCK_EX```
- context 可选。规定文件句柄的环境。context 是一套可以修改流的行为的选项。若使用 null，则忽略。

例子
```php
<?php
echo file_put_contents("test.txt","Hello World. Testing!");
?>
```

### sqli类函数

mysqli_affected_rows()	返回前一个 Mysql 操作的受影响行数。
mysqli_autocommit()	打开或关闭自动提交数据库修改功能。
mysqli_change_user()	更改指定数据库连接的用户。
mysqli_character_set_name()	返回数据库连接的默认字符集。
mysqli_close()	关闭先前打开的数据库连接。
mysqli_commit()	提交当前事务。
mysqli_connect_errno()	返回最后一次连接调用的错误代码。
mysqli_connect_error()	返回上一次连接错误的错误描述。
mysqli_connect()	打开到 Mysql 服务器的新连接。
mysqli_data_seek()	调整结果指针到结果集中的一个任意行。
mysqli_debug()	执行调试操作。
mysqli_dump_debug_info()	转储调试信息到日志中。
mysqli_errno()	返回最近的函数调用产生的错误代码。
mysqli_error_list()	返回最近的函数调用产生的错误列表。
mysqli_error()	返回字符串描述的最近一次函数调用产生的错误代码。
mysqli_fetch_all()	抓取所有的结果行并且以关联数据，数值索引数组，或者两者皆有的方式返回结果集。
mysqli_fetch_array()	以一个关联数组，数值索引数组，或者两者皆有的方式抓取一行结果。
mysqli_fetch_assoc()	以一个关联数组方式抓取一行结果。
mysqli_fetch_field_direct()	以对象返回结果集中单字段的元数据。
mysqli_fetch_field()	以对象返回结果集中的下一个字段。
mysqli_fetch_fields()	返回代表结果集中字段的对象数组。
mysqli_fetch_lengths()	返回结果集中当前行的列长度。
mysqli_fetch_object()	以对象返回结果集的当前行。
mysqli_fetch_row()	从结果集中抓取一行并以枚举数组的形式返回它。
mysqli_field_count()	返回最近一次查询获取到的列的数目。
mysqli_field_seek()	设置字段指针到特定的字段开始位置。
mysqli_field_tell()	返回字段指针的位置。
mysqli_free_result()	释放与某个结果集相关的内存。
mysqli_get_charset()	返回字符集对象。
mysqli_get_client_info()	返回字符串类型的 Mysql 客户端版本信息。
mysqli_get_client_stats()	返回每个客户端进程的统计信息。
mysqli_get_client_version()	返回整型的 Mysql 客户端版本信息。
mysqli_get_connection_stats()	返回客户端连接的统计信息。
mysqli_get_host_info()	返回 MySQL 服务器主机名和连接类型。
mysqli_get_proto_info()	返回 MySQL 协议版本。
mysqli_get_server_info()	返回 MySQL 服务器版本。
mysqli_get_server_version()	返回整型的 MySQL 服务器版本信息。
mysqli_info()	返回最近一次执行的查询的检索信息。
mysqli_init()	初始化 mysqli 并且返回一个由 mysqli_real_connect() 使用的资源类型。
mysqli_insert_id()	返回最后一次查询中使用的自动生成 id。
mysql_kill()	请求服务器终结某个 MySQL 线程。
mysqli_more_results()	检查一个多语句查询是否还有其他查询结果集。
mysqli_multi_query()	在数据库上执行一个或多个查询。
mysqli_next_result()	从 mysqli_multi_query() 中准备下一个结果集。
mysqli_num_fields()	返回结果集中的字段数。
mysqli_num_rows()	返回结果集中的行数。
mysqli_options()	设置选项。
mysqli_ping()	Ping 一个服务器连接，或者如果那个连接断了尝试重连。
mysqli_prepare()	准备一条用于执行的 SQL 语句。
mysqli_query()	在数据库上执行查询。
mysqli_real_connect()	打开一个到 Mysql 服务端的新连接。
mysqli_real_escape_string()	转义在 SQL 语句中使用的字符串中的特殊字符。

下列字符受影响：
```
\x00
\n
\r
\
'
"
\x1a
```


mysqli_real_query()	执行 SQL 查询。
mysqli_reap_async_query()	返回异步查询的结果。
mysqli_refresh()	刷新表或缓存，或者重置复制服务器信息。
mysqli_rollback()	回滚当前事务。
mysqli_select_db()	改变连接的默认数据库。
mysqli_set_charset()	设置默认客户端字符集。
mysqli_set_local_infile_default()	清除用户为 load local infile 命令定义的处理程序。
mysqli_set_local_infile_handler()	设置 LOAD DATA LOCAL INFILE 命令执行的回调函数。
mysqli_sqlstate()	返回前一个 Mysql 操作的 SQLSTATE 错误代码。
mysqli_ssl_set()	使用 SSL 建立安装连接。
mysqli_stat()	返回当前系统状态。
mysqli_stmt_init()	初始化一条语句并返回一个由 mysqli_stmt_prepare() 使用的对象。
mysqli_store_result()	传输最后一个查询的结果集。
mysqli_thread_id()	返回当前连接的线程 ID。
mysqli_thread_safe()	返回是否设定了线程安全。
mysqli_use_result()	初始化一个结果集的取回。
mysqli_warning_count()	返回连接中最后一次查询的警告数量。


### string类函数

函数	描述
addcslashes()	返回在指定的字符前添加反斜杠的字符串。
addslashes()	返回在预定义的字符前添加反斜杠的字符串。
bin2hex()	把 ASCII 字符的字符串转换为十六进制值。
chop()	删除字符串右侧的空白字符或其他字符。
chr()	从指定的 ASCII 值返回字符。
chunk_split()	把字符串分割为一系列更小的部分。
convert_cyr_string()	把字符串由一种 Cyrillic 字符集转换为另一种。
convert_uudecode()	解码 uuencode 编码字符串。
convert_uuencode()	使用 uuencode 算法对字符串进行编码。
count_chars()	返回有关字符串中所用字符的信息。
crc32()	计算字符串的 32 位 CRC。
crypt()	单向的字符串加密法（hashing）。
echo()	输出一个或多个字符串。
explode()	把字符串打散为数组。
fprintf()	把格式化的字符串写入到指定的输出流。
get_html_translation_table()	返回由 htmlspecialchars() 和 htmlentities() 使用的翻译表。
hebrev()	把希伯来文本转换为可见文本。
hebrevc()	把希伯来文本转换为可见文本，并把新行（\n）转换为 <br>。
hex2bin()	把十六进制值的字符串转换为 ASCII 字符。
html_entity_decode()	把 HTML 实体转换为字符。
htmlentities()	把字符转换为 HTML 实体。
htmlspecialchars_decode()	把一些预定义的 HTML 实体转换为字符。
htmlspecialchars()	把一些预定义的字符转换为 HTML 实体。
implode()	返回由数组元素组合成的字符串。
join()	implode() 的别名。
lcfirst()	把字符串的首字符转换为小写。
levenshtein()	返回两个字符串之间的 Levenshtein 距离。
localeconv()	返回本地数字及货币格式信息。
ltrim()	移除字符串左侧的空白字符或其他字符。
md5()	计算字符串的 MD5 散列。
md5_file()	计算文件的 MD5 散列。
metaphone()	计算字符串的 metaphone 键。
money_format()	返回格式化为货币字符串的字符串。
nl_langinfo()	返回特定的本地信息。
nl2br()	在字符串中的每个新行之前插入 HTML 换行符。
number_format()	以千位分组来格式化数字。
ord()	返回字符串中第一个字符的 ASCII 值。
parse_str()	把查询字符串解析到变量中。
print()	输出一个或多个字符串。
printf()	输出格式化的字符串。
quoted_printable_decode()	把 quoted-printable 字符串转换为 8 位字符串。
quoted_printable_encode()	把 8 位字符串转换为 quoted-printable 字符串。
quotemeta()	引用元字符。
rtrim()	移除字符串右侧的空白字符或其他字符。
setlocale()	设置地区信息（地域信息）。
sha1()	计算字符串的 SHA-1 散列。
sha1_file()	计算文件的 SHA-1 散列。
similar_text()	计算两个字符串的相似度。
soundex()	计算字符串的 soundex 键。
sprintf()	把格式化的字符串写入变量中。
sscanf()	根据指定的格式解析来自字符串的输入。
str_getcsv()	把 CSV 字符串解析到数组中。
str_ireplace()	替换字符串中的一些字符（对大小写不敏感）。
str_pad()	把字符串填充为新的长度。
str_repeat()	把字符串重复指定的次数。
str_replace()	替换字符串中的一些字符（对大小写敏感）。
str_rot13()	对字符串执行 ROT13 编码。
str_shuffle()	随机地打乱字符串中的所有字符。
str_split()	把字符串分割到数组中。
str_word_count()	计算字符串中的单词数。
strcasecmp()	比较两个字符串（对大小写不敏感）。
strchr()	查找字符串在另一字符串中的第一次出现。（strstr() 的别名。）
strcmp()	比较两个字符串（对大小写敏感）。
strcoll()	比较两个字符串（根据本地设置）。
strcspn()	返回在找到某些指定字符的任何部分之前，在字符串中查找的字符数。
strip_tags()	剥去字符串中的 HTML 和 PHP 标签。
stripcslashes()	删除由 addcslashes() 函数添加的反斜杠。
stripslashes()	删除由 addslashes() 函数添加的反斜杠。
stripos()	返回字符串在另一字符串中第一次出现的位置（对大小写不敏感）。
stristr()	查找字符串在另一字符串中第一次出现的位置（大小写不敏感）。
strlen()	返回字符串的长度。
strnatcasecmp()	使用一种"自然排序"算法来比较两个字符串（对大小写不敏感）。
strnatcmp()	使用一种"自然排序"算法来比较两个字符串（对大小写敏感）。
strncasecmp()	前 n 个字符的字符串比较（对大小写不敏感）。
strncmp()	前 n 个字符的字符串比较（对大小写敏感）。
strpbrk()	在字符串中查找一组字符的任何一个字符。
strpos()	返回字符串在另一字符串中第一次出现的位置（对大小写敏感）。
strrchr()	查找字符串在另一个字符串中最后一次出现。
strrev()	反转字符串。
strripos()	查找字符串在另一字符串中最后一次出现的位置（对大小写不敏感）。
strrpos()	查找字符串在另一字符串中最后一次出现的位置（对大小写敏感）。
strspn()	返回在字符串中包含的特定字符的数目。
strstr()	查找字符串在另一字符串中的第一次出现（对大小写敏感）。
strtok()	把字符串分割为更小的字符串。
strtolower()	把字符串转换为小写字母。
strtoupper()	把字符串转换为大写字母。
strtr()	转换字符串中特定的字符。
substr()	返回字符串的一部分。
substr_compare()	从指定的开始位置（二进制安全和选择性区分大小写）比较两个字符串。
substr_count()	计算子串在字符串中出现的次数。
substr_replace()	把字符串的一部分替换为另一个字符串。
trim()	移除字符串两侧的空白字符和其他字符。
ucfirst()	把字符串中的首字符转换为大写。
ucwords()	把字符串中每个单词的首字符转换为大写。
vfprintf()	把格式化的字符串写到指定的输出流。
vprintf()	输出格式化的字符串。
vsprintf()	把格式化字符串写入变量中。
wordwrap()	打断字符串为指定数量的字串