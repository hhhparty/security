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