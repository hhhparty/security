# WEB.XML 说明

## 基本结构
web.xml文件是整个Java web应用中最重要的配置文件，它必须放在WEB-INF目录中。 

在web应用开发中，涉及到web资源的配置都是在web.xml中进行的。 例如： 配置spring、springMVC等框架。

XML 元素不仅是大小写敏感的，而且它们还对出现在其他元素中的次序敏感。例如，XML头必须是文件中的第一项，DOCTYPE声明必须是第二项，而web- app元素必须是第三项。在web-app元素内，元素的次序也很重要。服务器不一定强制要求这种次序，但它们允许（实际上有些服务器就是这样做的）完全拒绝执行含有次序不正确的元素的Web应用。这表示使用非标准元素次序的web.xml文件是不可移植的。

下面的列表给出了所有可直接出现在web-app元素内的合法元素所必需的次序。例如，此列表说明servlet元素必须出现在所有servlet-mapping元素之前。请注意，所有这些元素都是可选的。因此，可以省略掉某一元素，但不能把它放于不正确的位置。

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!--定义头和根元素   部署描述符文件就像所有XML文件一样，必须以一个XML头开始。这个头声明可以使用的XML版本并给出文件的字符编码。-->

<web-app xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xmlns="http://java.sun.com/xml/ns/javaee"
          xsi:schemaLocation="http://java.sun.com/xml/ns/javaee http://java.sun.com/xml/ns/javaee/web-app_3_0.xsd" 
         id="WebApp_ID" version="3.0">
<!--DOCYTPE声明必须立即出现在此头之后。这个声明告诉服务器适用的servlet规范的版本（如2.2或2.3）并指定管理此文件其余部分内容的语法的DTD(Document Type Definition，文档类型定义)。所有部署描述符文件的顶层（根）元素为web-app。请注意，XML元素不像HTML，他们是大小写敏感的。因此，web-App和WEB-APP都是不合法的，web-app必须用小写。-->



    <!-- icon元素指出IDE和GUI工具用来表示Web应用的一个和两个图像文件的位置。 -->
    <icon></icon>
    
    <!-- display-name元素提供GUI工具可能会用来标记这个特定的Web应用的一个名称。 -->
    <display-name></display-name>
    
    <!-- description元素给出与此有关的说明性文本。 -->
    <description></description>
    
    <!-- context-param元素声明应用范围内的初始化参数 -->
    <context-param></context-param>
    
    <!-- filter 过滤器元素将一个名字与一个实现javax.servlet.Filter接口的类相关联。 -->
    <filter></filter>
    
    <!-- filter-mapping 一旦命名了一个过滤器，就要利用filter-mapping元素把它与一个或多个servlet或JSP页面相关联。 -->
    <filter-mapping></filter-mapping>
    
    <!-- listener 对事件监听程序的支持，事件监听程序在建立、修改和删除会话或servlet环境时得到通知。Listener元素指出事件监听程序类。 -->
    <listener></listener>
    
    <!-- servlet 在向servlet或JSP页面制定初始化参数或定制URL时，必须首先命名servlet或JSP页面。Servlet元素就是用来完成此项任务的。 -->
    <servlet></servlet>
    
    <!-- servlet-mapping 服务器一般为servlet提供一个缺省的URL：http://host/webAppPrefix/servlet/ServletName。但是，常常会更改这个URL，以便servlet可以访问初始化参数或更容易地处理相对URL。在更改缺省URL时，使用servlet-mapping元素。 -->
    <servlet-mapping></servlet-mapping>
    
    <!-- session-config 如果某个会话在一定时间内未被访问，服务器可以抛弃它以节省内存。可通过使用HttpSession的setMaxInactiveInterval方法明确设置单个会话对象的超时值，或者可利用session-config元素制定缺省超时值。 -->
    <session-config></session-config>
    
    <!-- mime-mapping 如果Web应用具有想到特殊的文件，希望能保证给他们分配特定的MIME类型，则mime-mapping元素提供这种保证。 -->
    <mime-mapping></mime-mapping>
    
    <!-- welcome-file-list元素指示服务器在收到引用一个目录名而不是文件名的URL时，使用哪个文件。 -->
    <welcome-file-list></welcome-file-list>
    
    <!-- error-page元素使得在返回特定HTTP状态代码时，或者特定类型的异常被抛出时，能够制定将要显示的页面。 -->
    <error-page></error-page>
    
    <!-- resource-env-ref元素声明与资源相关的一个管理对象。 -->
    <resource-env-ref></resource-env-ref>
    
    <!-- resource-ref元素声明一个资源工厂使用的外部资源。 -->
    <resource-ref></resource-ref>
    
    <!-- security-constraint元素制定应该保护的URL。它与login-config元素联合使用 -->
    <security-constraint></security-constraint>
    
    <!-- 用login-config元素来指定服务器应该怎样给试图访问受保护页面的用户授权。它与sercurity-constraint元素联合使用。 -->
    <login-config></login-config>

    <!-- security-role元素给出安全角色的一个列表，这些角色将出现在servlet元素内的security-role-ref元素的role-name子元素中。分别地声明角色可使高级IDE处理安全信息更为容易。 -->
    <security-role></security-role>

    <!-- env-entry元素声明Web应用的环境项。 -->
    <env-entry></env-entry>
    
    <!-- ejb-ref元素声明一个EJB的主目录的引用。 -->
    <ejb-ref></ejb-ref>
    
    <!-- ejb-local-ref元素声明一个EJB的本地主目录的应用。 -->
    <ejb-local-ref></ejb-local-ref>

</web-app>
```


## 路由：分配名称和定制的URL

在web.xml中完成的一个最常见的任务是对servlet或JSP页面给出名称和定制的URL。用servlet元素分配名称，使用servlet-mapping元素将定制的URL与刚分配的名称相关联。

### 分配名称

为了提供初始化参数，对servlet或JSP页面定义一个定制URL或分配一个安全角色，必须首先给servlet或JSP页面一个名称。可通过 servlet元素分配一个名称。最常见的格式包括servlet-name和servlet-class子元素

```
<servlet>
        <servlet-name>ServletName</servlet-name>
        <servlet-class>FullyQualifiedName</servlet-class>
</servlet>
<servlet-mapping>
        <servlet-name>ServletName</servlet-name>
        <url-pattern>URL</url-pattern>
</servlet-mapping>

```

这表示位于WEB-INF/classes/FullyQualifiedName的servlet已经得到了注册名ServletName。给 servlet一个名称具有两个主要的含义。首先，初始化参数。定制的URL模式以及其他定制通过此注册名而不是类名引用此servlet。其次,可在 URL而不是类名中使用此名称。因此，利用刚才给出的定义，URL http://host/webAppPrefix/servlet/ServletName 可用于 http://host/webAppPrefix/servlet/FullyQualifiedName的场所。

### 定义定制的URL

大多数服务器具有一个缺省的serlvet URL：http://host/webAppPrefix/servlet/packageName.ServletName。虽然在开发中使用这个URL很方便，但是我们常常会希望另一个URL用于部署。例如，可能会需要一个出现在Web应用顶层的URL（如，http: //host/webAppPrefix/Anyname），并且在此URL中没有servlet项。位于顶层的URL简化了相对URL的使用。此外，对许多开发人员来说，顶层URL看上去比更长更麻烦的缺省URL更简短。

事实上，有时需要使用定制的URL。比如，你可能想关闭缺省URL映射，以便更好地强制实施安全限制或防止用户意外地访问无初始化参数的servlet。如果你禁止了缺省的URL，那么你怎样访问servlet呢？这时只有使用定制的URL了。
为了分配一个定制的URL，可使用servlet-mapping元素及其servlet-name和url-pattern子元素。Servlet- name元素提供了一个任意名称，可利用此名称引用相应的servlet；url-pattern描述了相对于Web应用的根目录的URL。url- pattern元素的值必须以斜杠（/）起始。

下面给出一个简单的web.xml摘录，它允许使用URL http://host/webAppPrefix/UrlTest而不是http://host/webAppPrefix/servlet/Test或
http: //host/webAppPrefix/servlet/moreservlets.TestServlet。

```
<servlet>   
    <servlet-name>Test</servlet-name>   
    <servlet-class>moreservlets.TestServlet</servlet-class>   
</servlet>   
<!-- ... -->   
<servlet-mapping>   
    <servlet-name>Test</servlet-name>   
    <url-pattern>/UrlTest</url-pattern>   
</servlet-mapping>  
```