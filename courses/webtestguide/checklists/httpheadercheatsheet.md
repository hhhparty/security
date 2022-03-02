# HTTP HEADER 手册
参考：https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers

## Request header

### Forbidden Header name

禁止头（属性）名，是HTTP header 中不能被程序修改的头部属性名称的列表。这些属性名所对应的值，仅能被浏览器修改。

被禁止修改的属性名包括3类：
- 自定义的```Sec-``` 以Sec为前缀的属性
- 自定义的```Proxy-``` 以Proxy-为前缀的属性
- 标准头属性

标准头属性包括：
- Accept-Charset
- Accept-Encoding
- Access-Control-Request-Headers
- Access-Control-Request-Method
- Connection
- Content-Length
- Cookie
- Cookie2
- Date
- DNT
- Expect
- Feature-Policy
- Host
- Keep-Alive
- Origin
- Referer
- TE
- Trailer
- Transfer-Encoding
- Upgrade
- Via

## x-
### x-www-form-urlencoded
服务器知道参数用符号&间隔，如果参数值中需要&，则必须对其进行编码。编码格式就是application/x-www-form-urlencoded（将键值对的参数用&连接起来，如果有空格，将空格转换为+加号；有特殊符号，将特殊符号转换为ASCII HEX值）。

application/x-www-form-urlencoded是浏览器默认的编码格式。对于Get请求，是将参数转换?key=value&key=value格式，连接到url后
### multipart/form-data

在开发者工具中可以看出multipart/form-data不会对参数编码，使用的boundary(分割线)，相当于&，boundary的值是----Web**AJv3。