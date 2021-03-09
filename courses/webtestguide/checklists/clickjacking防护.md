# Click Jacking 防护

Click Jacking 本质上是一种视觉欺骗，即在用户点击按钮之上覆盖了一层透明物，例如iframe、图片等。用户点击后，实际发生动作是iframe或图片的链接。

## frame busting
通过编写js代码，禁止iframe嵌套的方法。

常见的有：
```js
if (top.location != location){
    top.location = self.location;
}


```

说明：
- Location 对象包含有关当前 URL 的信息。Location 对象是 Window 对象的一个部分，可通过 window.location 属性来访问。
- windows.top 或top 返回最顶层的先辈窗口；top指最外层页面

## X-Frame-Options

一些浏览器支持X-Frame-Options头，它有3个可选的值
- DENY，拒绝加载任何frame页面
- SAMEORIGIN，只能加载同源域名下的页面；
- ALLOW-FROM origin

支持该头的浏览器：
- Opera10.50+
- safari 4+
- Chrome 4.1。249.1042+
- Firefox 3.6.9+
- IE 8+

## firefox “content security policy” 和 "noScript"扩展

这两者也能防止点击劫持。