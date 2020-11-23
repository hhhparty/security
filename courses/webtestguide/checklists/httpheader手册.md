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