# WSDL
WSDL（网络服务描述语言，Web Services Description Language）是一门基于 XML 的语言，用于描述 Web Services 以及如何对它们进行访问。

WSDL 指网络服务描述语言
WSDL 使用 XML 编写
WSDL 是一种 XML 文档
WSDL 用于描述网络服务
WSDL 也可用于定位网络服务
WSDL 还不是 W3C 标准

在 2001 年 3 月，WSDL 1.1 被 IBM、微软作为一个 W3C 记录（W3C note）提交到有关 XML 协议的 W3C XML 活动，用于描述网络服务。

（W3C 记录仅供讨论。一项 W3C 记录的发布并不代表它已被 W3C 或 W3C 团队亦或任何 W3C 成员认可。） 在 2002 年 7 月，W3C 发布了第一个 WSDL 1.2 工作草案。

## WSDL 文档

WSDL 文档仅仅是一个简单的 XML 文档。它包含一系列描述某个 web service 的定义。

### WSDL 文档结构

WSDL 文档是利用这些主要的元素来描述某个 web service 的：

|元素| 	定义|
|-|-|
|`<portType>`| 	web service 执行的操作|
|`<message>`| 	web service 使用的消息|
|`<types>`| 	web service 使用的数据类型|
|`<binding>`| 	web service 使用的通信协议|

一个 WSDL 文档的主要结构是类似这样的：
```xml
<definitions>
    <types>
    definition of types........
    </types>

    <message>
    definition of a message....
    </message>

    <portType>
    definition of a port.......
    </portType>

    <binding>
    definition of a binding....
    </binding>
</definitions>
```

WSDL 文档可包含其它的元素，比如 extension 元素，以及一个 service 元素，此元素可把若干个 web services 的定义组合在一个单一的 WSDL 文档中。


## WSDL 端口

WSDL 端口可描述由某个 web service 提供的界面（合法操作）。

`<portType>` 元素是最重要的 WSDL 元素。它可描述一个 web service、可被执行的操作，以及相关的消息。

端口定义了指向某个 web service 的连接点。可以把该元素比作传统编程语言中的一个函数库（或一个模块、或一个类），而把每个操作比作传统编程语言中的一个函数。

### 操作类型

请求-响应是最普通的操作类型，不过 WSDL 定义了四种类型：

|类型 |	定义|
|-|-|
|One-way 	|此操作可接受消息，但不会返回响应。|
|Request-response |	此操作可接受一个请求并会返回一个响应|
|Solicit-response |	此操作可发送一个请求，并会等待一个响应。|
|Notification |	此操作可发送一条消息，但不会等待响应。|

#### One-Way 操作

一个 one-way 操作的例子：
```
<message name="newTermValues">
   <part name="term" type="xs:string"/>
   <part name="value" type="xs:string"/>
</message>

<portType name="glossaryTerms">
   <operation name="setTerm">
      <input name="newTerm" message="newTermValues"/>
   </operation>
</portType >
```

在这个例子中，端口 "glossaryTerms" 定义了一个名为 "setTerm" 的 one-way 操作。

这个 "setTerm" 操作可接受新术语表项目消息的输入，这些消息使用一条名为 "newTermValues" 的消息，此消息带有输入参数 "term" 和 "value"。不过，没有为这个操作定义任何输出。

#### Request-Response 操作

一个 request-response 操作的例子：
```xml
<message name="getTermRequest">
   <part name="term" type="xs:string"/>
</message>

<message name="getTermResponse">
   <part name="value" type="xs:string"/>
</message>

<portType name="glossaryTerms">
  <operation name="getTerm">
    <input message="getTermRequest"/>
    <output message="getTermResponse"/>
  </operation>
</portType>
```
在这个例子中，端口 "glossaryTerms" 定义了一个名为 "getTerm" 的 request-response 操作。

"getTerm" 操作会请求一个名为 "getTermRequest" 的输入消息，此消息带有一个名为 "term" 的参数，并将返回一个名为 "getTermResponse" 的输出消息，此消息带有一个名为 "value" 的参数。

## WSDL 绑定

WSDL 绑定可为 web service 定义消息格式和协议细节。

### 绑定到 SOAP

一个 请求 - 响应 操作的例子：
```xml
<message name="getTermRequest">
   <part name="term" type="xs:string" />
</message>

<message name="getTermResponse">
   <part name="value" type="xs:string" />
</message>

<portType name="glossaryTerms">
  <operation name="getTerm">
      <input message="getTermRequest" />
      <output message="getTermResponse" />
  </operation>
</portType>

<binding type="glossaryTerms" name="b1">
<soap:binding style="document"
transport="http://schemas.xmlsoap.org/soap/http" />
  <operation>
    <soap:operation
     soapAction="http://example.com/getTerm" />
    <input>
      <soap:body use="literal" />
    </input>
    <output>
      <soap:body use="literal" />
    </output>
  </operation>
</binding>
```
binding 元素有两个属性 - name 属性和 type 属性。

name 属性定义 binding 的名称，而 type 属性指向用于 binding 的端口，在这个例子中是 "glossaryTerms" 端口。

soap:binding 元素有两个属性 - style 属性和 transport 属性。

style 属性可取值 "rpc" 或 "document"。在这个例子中我们使用 document。transport 属性定义了要使用的 SOAP 协议。在这个例子中我们使用 HTTP。

operation 元素定义了每个端口提供的操作符。

对于每个操作，相应的 SOAP 行为都需要被定义。同时您必须如何对输入和输出进行编码。在这个例子中我们使用了 "literal"。

## WSDL与UDDI

UDDI 是一种目录服务，企业可以使用它对 Web services 进行注册和搜索。

UDDI，英文为 "Universal Description, Discovery and Integration"，可译为“通用描述、发现与集成服务”。

UDDI 是一个独立于平台的框架，用于通过使用 Internet 来描述服务，发现企业，并对企业服务进行集成。

    UDDI 指的是通用描述、发现与集成服务
    UDDI 是一种用于存储有关 web services 的信息的目录。
    UDDI 是一种由 WSDL 描述的 web services 界面的目录。
    UDDI 经由 SOAP 进行通信
    UDDI 被构建入了微软的 .NET 平台

UDDI 使用 W3C 和 IETF* 的因特网标准，比如 XML、HTTP 和 DNS 协议。

UDDI 使用 WSDL 来描述到达 web services 的界面

此外，通过采用 SOAP，还可以实现跨平台的编程特性，大家知道，SOAP 是 XML 的协议通信规范，可在 W3C 的网站找到相关的信息。


UDDI 的好处

任何规模的行业或企业都能得益于 UDDI。

在 UDDI 之前，还不存在一种 Internet 标准，可以供企业为它们的企业和伙伴提供有关其产品和服务的信息。也不存在一种方法，来集成到彼此的系统和进程中。

UDDI 规范帮助我们解决的问题：

    使得在成百万当前在线的企业中发现正确的企业成为可能
    定义一旦首选的企业被发现后如何启动商业
    扩展新客户并增加对目前客户的访问
    扩展销售并延伸市场范围
    满足用户驱动的需要，为在全球 Internet 经济中快速合作的促进来清除障碍

##  WSDL 1.2 语法

描述于 W3C 工作草案的完整 WSDL 1.2 语法已列在下面：
```
<wsdl:definitions name="nmtoken"? targetNamespace="uri">

    <import namespace="uri" location="uri"/> *
	
    <wsdl:documentation .... /> ?

    <wsdl:types> ?
        <wsdl:documentation .... /> ?
        <xsd:schema .... /> *
    </wsdl:types>

    <wsdl:message name="ncname"> *
        <wsdl:documentation .... /> ?
        <part name="ncname" element="qname"? type="qname"?/> *
    </wsdl:message>

    <wsdl:portType name="ncname"> *
        <wsdl:documentation .... /> ?
        <wsdl:operation name="ncname"> *
            <wsdl:documentation .... /> ?
            <wsdl:input message="qname"> ?
                <wsdl:documentation .... /> ?
            </wsdl:input>
            <wsdl:output message="qname"> ?
                <wsdl:documentation .... /> ?
            </wsdl:output>
            <wsdl:fault name="ncname" message="qname"> *
                <wsdl:documentation .... /> ?
            </wsdl:fault>
        </wsdl:operation>
    </wsdl:portType>

    <wsdl:serviceType name="ncname"> *
        <wsdl:portType name="qname"/> +
    </wsdl:serviceType>

    <wsdl:binding name="ncname" type="qname"> *
        <wsdl:documentation .... /> ?
        <-- binding details --> *
        <wsdl:operation name="ncname"> *
            <wsdl:documentation .... /> ?
            <-- binding details --> *
            <wsdl:input> ?
                <wsdl:documentation .... /> ?
                <-- binding details -->
            </wsdl:input>
            <wsdl:output> ?
                <wsdl:documentation .... /> ?
                <-- binding details --> *
            </wsdl:output>
            <wsdl:fault name="ncname"> *
                <wsdl:documentation .... /> ?
                <-- binding details --> *
            </wsdl:fault>
        </wsdl:operation>
    </wsdl:binding>

    <wsdl:service name="ncname" serviceType="qname"> *
        <wsdl:documentation .... /> ?
        <wsdl:port name="ncname" binding="qname"> *
            <wsdl:documentation .... /> ?
            <-- address details -->
        </wsdl:port>
    </wsdl:service>

</wsdl:definitions>

```