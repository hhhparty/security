# XML 和 DTD

拥有正确语法的 XML 被称为"形式良好"的 XML。通过 DTD 验证的XML是"合法"的 XML。
## xml
xml基本语法规则：
语法规则：
- XML 文档必须有一个根元素
- XML元素都必须有一个关闭标签
- XML 标签对大小写敏感
- XML 元素必须被正确的嵌套
- XML 属性值必须加引号

### XML 文档构建模块
所有的 XML 文档（以及 HTML 文档）均由以下简单的构建模块构成：
- 元素
- 属性
- 实体
- PCDATA
- CDATA

#### 实体

实体是用来定义普通文本的变量。实体引用是对实体的引用。
大多数同学都了解这个 HTML 实体引用："```&nbsp;```"。这个"无折行空格"实体在 HTML 中被用于在某个文档中插入一个额外的空格。

当文档被 XML 解析器解析时，实体就会被展开。

|实体引用|字符|
|-|-|
|```&lt;```|<|
|```&gt;```|>|
|```&amp;```|&|
|```&quot;```|"|
|```&apos;```|'|


#### PCDATA 

PCDATA 的意思是被解析的字符数据（parsed character data）。
可把字符数据想象为 XML 元素的开始标签与结束标签之间的文本。
PCDATA 是会被解析器解析的文本。这些文本将被解析器检查实体以及标记。
文本中的标签会被当作标记来处理，而实体会被展开。
不过，被解析的字符数据不应当包含任何 &、< 或者 > 字符；需要使用 ```&amp;```、```&lt; ```以及 ```&gt;``` 实体来分别替换它们。

#### CDATA
CDATA 的意思是字符数据（character data）。
CDATA 是不会被解析器解析的文本。在这些文本中的标签不会被当作标记来对待，其中的实体也不会被展开。

## DTD
DTD 的目的是定义 XML 文档的结构。它使用一系列合法的元素来定义文档结构：

DTD的意义
- 通过 DTD，您的每一个 XML 文件均可携带一个有关其自身格式的描述。
- 通过 DTD，独立的团体可一致地使用某个标准的 DTD 来交换数据。
- 而您的应用程序也可使用某个标准的 DTD 来验证从外部接收到的数据。
- 您还可以使用 DTD 来验证您自身的数据。

实例：

```xml
<?xml version="1.0"?>
<!DOCTYPE note [
<!ELEMENT note (to,from,heading,body)>
<!ELEMENT to (#PCDATA)>
<!ELEMENT from (#PCDATA)>
<!ELEMENT heading (#PCDATA)>
<!ELEMENT body (#PCDATA)>
]>
<note>
<to>Tove</to>
<from>Jani</from>
<heading>Reminder</heading>
<body>Don't forget me this weekend</body>
</note> 
```

以上 DTD 解释如下：
- !DOCTYPE note (第二行)定义此文档是 note 类型的文档。
- !ELEMENT note (第三行)定义 note 元素有四个元素："to、from、heading,、body"
- !ELEMENT to (第四行)定义 to 元素为 "#PCDATA" 类型
- !ELEMENT from (第五行)定义 from 元素为 "#PCDATA" 类型
- !ELEMENT heading (第六行)定义 heading 元素为 "#PCDATA" 类型
- !ELEMENT body (第七行)定义 body 元素为 "#PCDATA" 类型


### DTD 元素

在一个 DTD 中，元素通过元素声明来进行声明。

#### 声明一个元素
在 DTD 中，XML 元素通过元素声明来进行声明。元素声明使用下面的语法：
```<!ELEMENT element-name category>```
或
```<!ELEMENT element-name (element-content)> ```

#### 空元素
空元素通过类别关键词EMPTY进行声明：
```<!ELEMENT element-name EMPTY>```

实例:
```<!ELEMENT br EMPTY>```

XML example:
```<br /> ```

#### 只有 PCDATA 的元素
只有 PCDATA 的元素通过圆括号中的 #PCDATA 进行声明：
```<!ELEMENT element-name (#PCDATA)>  ```

实例:
```<!ELEMENT from (#PCDATA)> ```


#### 带有任何内容的元素
通过类别关键词 ANY 声明的元素，可包含任何可解析数据的组合：
```<!ELEMENT element-name ANY>```

实例:```<!ELEMENT note ANY> ```

#### 带有子元素（序列）的元素
带有一个或多个子元素的元素通过圆括号中的子元素名进行声明：
```<!ELEMENT element-name (child1)>```
或
```<!ELEMENT element-name (child1,child2,...)>```

实例:```<!ELEMENT note (to,from,heading,body)> ```

当子元素按照由逗号分隔开的序列进行声明时，这些子元素必须按照相同的顺序出现在文档中。在一个完整的声明中，子元素也必须被声明，同时子元素也可拥有子元素。"note" 元素的完整声明是：
```
<!ELEMENT note (to,from,heading,body)>
<!ELEMENT to (#PCDATA)>
<!ELEMENT from (#PCDATA)>
<!ELEMENT heading (#PCDATA)>
<!ELEMENT body (#PCDATA)> 
```

#### 声明只出现一次的元素
```<!ELEMENT element-name (child-name)>```

实例:
```<!ELEMENT note (message)> ```

上面的例子声明了：message 子元素必须出现一次，并且必须只在 "note" 元素中出现一次。

#### 声明最少出现一次的元素
```<!ELEMENT element-name (child-name+)>```

实例:```<!ELEMENT note (message+)> ```

上面的例子中的加号（+）声明了：message 子元素必须在 "note" 元素内出现至少一次。

#### 声明出现零次或多次的元素
```<!ELEMENT element-name (child-name*)>```

实例:```<!ELEMENT note (message*)> ```

上面的例子中的星号（*）声明了：子元素 message 可在 "note" 元素内出现零次或多次。

#### 声明出现零次或一次的元素
```<!ELEMENT element-name (child-name?)>```

实例:```<!ELEMENT note (message?)> ```

上面的例子中的问号(?)声明了：子元素 message 可在 "note" 元素内出现零次或一次。

#### 声明"非.../即..."类型的内容

实例:```<!ELEMENT note (to,from,header,(message|body))> ```

上面的例子声明了："note" 元素必须包含 "to" 元素、"from" 元素、"header" 元素，以及非 "message" 元素即 "body" 元素。

#### 声明混合型的内容

实例:```<!ELEMENT note (#PCDATA|to|from|header|message)*> ```

上面的例子声明了："note" 元素可包含出现零次或多次的 PCDATA、"to"、"from"、"header" 或者 "message"。

### DTD - 属性 

在 DTD 中，属性通过 ATTLIST 声明来进行声明。

#### 声明属性
属性声明使用下列语法：
```<!ATTLIST element-name attribute-name attribute-type attribute-value>```

DTD 实例:```<!ATTLIST payment type CDATA "check">```

XML 实例:```<payment type="check" /> ```

更多参考：https://www.runoob.com/dtd/dtd-attributes.html

### DTD - 实体 

实体是用于定义引用普通文本或特殊字符的快捷方式的变量。
实体引用是对实体的引用。
实体可在内部或外部进行声明。

#### 一个内部实体声明
语法
```<!ENTITY entity-name "entity-value"> ```

实例

DTD 实例:

```
<!ENTITY writer "Donald Duck.">
<!ENTITY copyright "Copyright runoob.com">
```

XML 实例：
```<author>&writer;&copyright;</author> ```

注意： 一个实体由三部分构成: 一个和号 (&), 一个实体名称, 以及一个分号 (;)。

#### 一个外部实体声明
语法
```<!ENTITY entity-name SYSTEM "URI/URL"> ```

实例

DTD 实例:
```
<!ENTITY writer SYSTEM "http://www.runoob.com/entities.dtd">
<!ENTITY copyright SYSTEM "http://www.runoob.com/entities.dtd">
```

XML example:```<author>&writer;&copyright;</author> ```


假如 DTD 位于 XML 源文件的外部，那么它应通过下面的语法被封装在一个 DOCTYPE 定义中：
```<!DOCTYPE root-element SYSTEM "filename"> ```

这个 XML 文档和上面的 XML 文档相同，但是拥有一个外部的 DTD: （点击打开该文件，并选择"查看源代码"命令。）

```xml
<?xml version="1.0"?>
<!DOCTYPE note SYSTEM "note.dtd">
<note>
  <to>Tove</to>
  <from>Jani</from>
  <heading>Reminder</heading>
  <body>Don't forget me this weekend!</body>
</note> 
```
这是包含 DTD 的 "note.dtd" 文件：
- <!ELEMENT note (to,from,heading,body)>
- <!ELEMENT to (#PCDATA)>
- <!ELEMENT from (#PCDATA)>
- <!ELEMENT heading (#PCDATA)>
- <!ELEMENT body (#PCDATA)> 
#### 内部参数化实体声明
```<!ENTITY % name "entity_value">	 ```     

INTERNAL (PARSED) PARAMETER ENTITY Declaration: Internal parameter entity references are used to declare entities existing only in the DTD.

entity_value:: any character that is not an '&', '%' or ' " ', a parameter entity reference ('%Name;'), an entity reference ('&Name;') or a Unicodeglossary character reference.

Note:
Note the use of external DTD examples above. Parameter entity references may not be used within markup in an internal DTDwell-formedness constraint.

#### 外部参数化实体声明
```xml
<!ENTITY % name SYSTEM "URI">
%name;

<!ENTITY % name PUBLIC "public_ID" "URI"">
%name;
```

External parameter entity references are used to link external DTDs. There are two types of external entities: private, and public. Private external entities are identified by the keyword SYSTEM, and are intended for use by a single author or group of authors. Public external entities are identified by the keyword PUBLIC and are intended for broad use.

URI: In practice, this is a URL where the external parameter entity can be found.
public_ID: This may be used by an XML processor to generate an alternate URI where the external parameter entity can be found. If it cannot be found at this URI, the XML processor must use the normal URI.
### DTD 验证 

使用 Internet Explorer 可根据某个 DTD 来验证您的 XML。

#### 通过 XML 解析器进行验证
当您试图打开某个 XML 文档时，XML 解析器有可能会产生错误。通过访问 parseError 对象，就可以取回引起错误的确切代码、文本甚至所在的行。
注意： load() 方法用于文件，而 loadXML() 方法用于字符串。
实例
```js
var xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
xmlDoc.async="false";
xmlDoc.validateOnParse="true";
xmlDoc.load("note_dtd_error.xml");

document.write("<br />Error Code: ");
document.write(xmlDoc.parseError.errorCode);
document.write("<br />Error Reason: ");
document.write(xmlDoc.parseError.reason);
document.write("<br />Error Line: ");
document.write(xmlDoc.parseError.line); 
```

#### 关闭验证
通过把 XML 解析器的 validateOnParse 设置为 "false"，就可以关闭验证。
实例
```js
var xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
xmlDoc.async="false";
xmlDoc.validateOnParse="false";
xmlDoc.load("note_dtd_error.xml");

document.write("<br />Error Code: ");
document.write(xmlDoc.parseError.errorCode);
document.write("<br />Error Reason: ");
document.write(xmlDoc.parseError.reason);
document.write("<br />Error Line: ");
document.write(xmlDoc.parseError.line);
```
#### 通用的 XML 验证器
[为了帮助您验证 XML 文件，我们创建了此 链接，这样你就可以验证任何 XML 文件了。](https://www.runoob.com/dom/dom-validate.html)


更多dtd内容：http://www.cheat-sheets.org/sites/xml.su/dtd.html
