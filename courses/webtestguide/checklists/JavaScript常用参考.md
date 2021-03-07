# Javascript CheatSheet

## 资源
https://portswigger.net/web-security/cross-site-scripting/cheat-sheet

https://owasp.org/www-community/xss-filter-evasion-cheatsheet

https://xz.aliyun.com/t/1126/

https://github.com/swisskyrepo/PayloadsAllTheThings

[正则表达式](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Regular_Expressions)

js中的正则表达式有两种形式：
- 使用一个正则表达式字面量，其由包含在斜杠之间的模式组成 ，例如：`var re = /ab+c/;`；
  - 斜杠结束后还可能跟随正则表达式标志。
- 或者调用RegExp对象的构造函数,例如：`var re = new RegExp("ab+c");` 

正则表达式标志
标志	描述
g	全局搜索。
i	不区分大小写搜索。
m	多行搜索。
s	允许 . 匹配换行符。
u	使用unicode码的模式进行匹配。
y	执行“粘性(sticky)”搜索,匹配从目标字符串的当前位置开始。

## html

- [mozilla developer entity](https://developer.mozilla.org/zh-CN/docs/Glossary/Entity)
- [w3c entity](https://www.w3school.com.cn/tags/html_ref_entities.html)