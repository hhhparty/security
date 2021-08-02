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


## 基础知识

### 常用函数
#### encodeURI() decodeURI() 
encodeURI() 函数可把字符串作为 URI 进行编码。decodeURI() 函数可对 encodeURI() 函数编码过的 URI 进行解码。

- 该方法不会对 ASCII 字母和数字进行编码，也不会对这些 ASCII 标点符号进行编码： `- _ . ! ~ * ' ( )` 。

- 该方法的目的是对 URI 进行完整的编码，因此对以下在 URI 中具有特殊含义的 ASCII 标点符号，encodeURI() 函数是不会进行转义的：`;/?:@&=+$,#`
- 提示：如果 URI 组件中含有分隔符，比如 `?` 和 `#`，则应当使用 encodeURIComponent() 方法分别对各组件进行编码。

例如：
```
document.write(encodeURI("http://www.w3school.com.cn/My first/"))
document.write(encodeURI(",/?:@&=+$#"))
```
输出：
```
http://www.w3school.com.cn/My%20first/
,/?:@&=+$#
```

#### encodeURIComponent()  decodeURIComponent()
encodeURIComponent() 函数可把字符串作为 URI 组件进行编码。encodeURIComponent()函数使用将一个、两个、三个或四个字节表示字符的UTF-8编码的转义序列，来替换某些字符的每个实例来编码。decodeURIComponent() 函数可对 encodeURIComponent() 函数编码的 URI 进行解码。

- 该方法不会对 ASCII 字母和数字进行编码，也不会对这些 ASCII 标点符号进行编码： `- _ . ! ~ * ' ( ) `。

- 其他字符（比如` ：;/?:@&=+$,# `这些用于分隔 URI 组件的标点符号），都是由一个或多个十六进制的转义序列替换的。

提示：请注意 encodeURIComponent() 函数 与 encodeURI() 函数的区别之处，前者假定它的参数是 URI 的一部分（比如协议、主机名、路径或查询字符串）。因此 encodeURIComponent() 函数将转义用于分隔 URI 各个部分的标点符号。

例如：
```
document.write(encodeURIComponent("http://www.w3school.com.cn/p 1/"))

document.write(encodeURIComponent(",/?:@&=+$#"))
```
输出:
```
http%3A%2F%2Fwww.w3school.com.cn%2Fp%201%2F
%2C%2F%3F%3A%40%26%3D%2B%24%23
```


#### fromCharCode() 和 charCodeAt()

String.fromCharCode()将ascii码值转换为字符；

`String.charCodeAt(112)`为p。

charCodeAt()将字符转换为ascii码值

`'p'.charCodeAt()` 为112

#### parseInt(字符串，转换基数) 与 toString(基数)

parseInt() 函数可解析一个字符串，并返回一个整数。

parseInt(string, radix)
参数	描述
string	必需。要被解析的字符串。
radix	可选。表示要解析的数字的基数。该值介于 2 ~ 36 之间。

如果省略该参数或其值为 0，则数字将以 10 为基础来解析。如果它以 “0x” 或 “0X” 开头，将以 16 为基数。

如果该参数小于 2 或者大于 36，则 parseInt() 将返回 NaN。

```
parseInt("10");			//返回 10
parseInt("19",10);		//返回 19 (10+9)
parseInt("11",2);		//返回 3 (2+1)
parseInt("17",8);		//返回 15 (8+7)
parseInt("1f",16);		//返回 31 (16+15)
parseInt("010");		//未定：返回 10 或 8

parseInt("prompt",32)
867982141
(867982141).toString(32)
"prompt"
```
#### escape()  unescape() 

escape() 函数可对字符串进行编码，这样就可以在所有的计算机上读取该字符串。unescape() 函数可对通过 escape() 编码的字符串进行解码。

该方法不会对 ASCII 字母和数字进行编码，也不会对下面这些 ASCII 标点符号进行编码： `* @ - _ + . / `。其他所有的字符都会被转义序列替换。

```
<script type="text/javascript">

document.write(escape("Visit W3School!") + "<br />")
document.write(escape("?!=()#%&"))

</script>
```
输出：
```
Visit%20W3School%21
%3F%21%3D%28%29%23%25%26
```
#### replace 特殊用法
replace() 方法用于在字符串中用一些字符替换另一些字符，或替换一个与正则表达式匹配的子串。
参考：https://www.w3school.com.cn/jsref/jsref_replace.asp

语法：stringObject.replace(regexp/substr,replacement)

replacement 中的 $ 字符具有特定的含义。如下表所示，它说明从模式匹配得到的字符串将用于替换。

字符	替换文本
$1、$2、...、$99	与 regexp 中的第 1 到第 99 个子表达式相匹配的文本。
$&	与 regexp 相匹配的子串。
$`	位于匹配子串左侧的文本。
$'	位于匹配子串右侧的文本。
$$	直接量符号。

```
"123".replace('2','$`xss')
"11xss3"
"123".replace('2','$$xss')
"1$xss3"
"123".replace('2','$&xss')
"12xss3"
"123".replace('2','$nxss')
"1$nxss3"
"123".replace('2','$3xss')
"1$3xss3"
"123".replace('2','$300xss')
"1$300xss3"

"1111123333".replace('2','$`xss')
"1111111111xss3333"

"1111123333".replace("2","$'xss")
"111113333xss3333"

```