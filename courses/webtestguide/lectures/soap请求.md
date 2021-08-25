# SOAP 请求


## 使用burp或owasp代理

请求头：
```
POST http://172.128.11.220:22224/WebGoat/services/SoapRequest HTTP/1.1

Content-Type: application/soap+xml
Content-Length: 247
Cookie: JSESSIONID=79A3E8D9CA5F04FD1C42CB900F181700; acopendivids=swingset,jotto,phpbb2,redmine; acgroupswithpersist=nada
SOAPAction: 
Host: 172.128.11.220:22224
```

表单内容：
```
<?xml version="1.0"?><soap:Envelope  xmlns:soap="http://www.w3.org/2003/05/soap-envelope"><soap:Body xmlns:m="http://172.128.11.220:22224/WebGoat/services/SoapRequest"><m:getFirstName><id>11111</id></m:getFirstName></soap:Body></soap:Envelope>
```

注意：
- soap版本1.1 和1.2 不同，具体使用哪种查看wsdl文件。上例使用了1.2
- v1.2版本中，要求在头部加入SOAPAction，具体值查看wsdl文件
- 所用方法getFirstName查看binding中暴露的operation，所用参数查看对应的message
- soap请求所用的xml格式要求严谨，需要仔细查看。

## 使用curl

### 访问wsdl文件

`curl --cookie "BEEFHOOK=oxkYEgUa2ouIcHKKzz7wXpVudnmiOeoVXCwDRxiiwVgnhLa9N2KlfLaAkRWOfXO0ouqsviLtsDFTRS29; JSESSIONID=C544A4B5011789D87494E72CB1F7E30B" http://172.128.11.220:22224/WebGoat/services/SoapRequest?wsdl`


### 构造请求



curl -H "Content-Type:application/soap+xml" -H "Content-Length:250" -H "SOAPAction: "  --cookie "BEEFHOOK=oxkYEgUa2ouIcHKKzz7wXpVudnmiOeoVXCwDRxiiwVgnhLa9N2KlfLaAkRWOfXO0ouqsviLtsDFTRS29; JSESSIONID=C544A4B5011789D87494E72CB1F7E30B" -d "<?xml version="1.0"?><soap:Envelope  xmlns:soap="http://www.w3.org/2003/05/soap-envelope"  >  <soap:Body xmlns:m="http://172.128.11.220:22224/WebGoat/services/SoapRequest"><m:getFirstName><id>1</id></m:getFirstName></soap:Body></soap:Envelope>" http://172.128.11.220:22224/WebGoat/services/SoapRequest


使用上述命令返回超时。

## 上例所用WSDL

```XML
<wsdl:definitions xmlns:apachesoap="http://xml.apache.org/xml-soap" xmlns:impl="http://localhost:8080/WebGoat/services/SoapRequest" xmlns:intf="http://localhost:8080/WebGoat/services/SoapRequest" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/" xmlns:wsdl="http://schemas.xmlsoap.org/wsdl/" xmlns:wsdlsoap="http://schemas.xmlsoap.org/wsdl/soap/" xmlns:xsd="http://www.w3.org/2001/XMLSchema" targetNamespace="http://localhost:8080/WebGoat/services/SoapRequest">
    <!-- WSDL created by Apache Axis version: 1.2
    Built on May 03, 2005 (02:20:24 EDT) -->
    <wsdl:message name="getCreditCardRequest">
        <wsdl:part name="id" type="xsd:int"/>
    </wsdl:message>
    <wsdl:message name="getLoginCountRequest">
        <wsdl:part name="id" type="xsd:int"/>
    </wsdl:message>
    <wsdl:message name="getCreditCardResponse">
        <wsdl:part name="getCreditCardReturn" type="xsd:string"/>
    </wsdl:message>
    <wsdl:message name="getFirstNameResponse">
    <   wsdl:part name="getFirstNameReturn" type="xsd:string"/>
    </wsdl:message>
    <wsdl:message name="getLoginCountResponse">
        <wsdl:part name="getLoginCountReturn" type="xsd:string"/>
    </wsdl:message>
    <wsdl:message name="getFirstNameRequest">
        <wsdl:part name="id" type="xsd:int"/>
    </wsdl:message>
    <wsdl:message name="getLastNameResponse">
    <wsdl:part name="getLastNameReturn" type="xsd:string"/>
    </wsdl:message>
    <wsdl:message name="getLastNameRequest">
    <wsdl:part name="id" type="xsd:int"/>
    </wsdl:message>
    <wsdl:portType name="SoapRequest">
        <wsdl:operation name="getFirstName" parameterOrder="id">
            <wsdl:input message="impl:getFirstNameRequest" name="getFirstNameRequest"/>
            <wsdl:output message="impl:getFirstNameResponse" name="getFirstNameResponse"/>
        </wsdl:operation>
    <wsdl:operation name="getLastName" parameterOrder="id">
    <wsdl:input message="impl:getLastNameRequest" name="getLastNameRequest"/>
    <wsdl:output message="impl:getLastNameResponse" name="getLastNameResponse"/>
    </wsdl:operation>
    <wsdl:operation name="getCreditCard" parameterOrder="id">
    <wsdl:input message="impl:getCreditCardRequest" name="getCreditCardRequest"/>
    <wsdl:output message="impl:getCreditCardResponse" name="getCreditCardResponse"/>
    </wsdl:operation>
    <wsdl:operation name="getLoginCount" parameterOrder="id">
    <wsdl:input message="impl:getLoginCountRequest" name="getLoginCountRequest"/>
    <wsdl:output message="impl:getLoginCountResponse" name="getLoginCountResponse"/>
    </wsdl:operation>
    </wsdl:portType>
    <wsdl:binding name="SoapRequestSoapBinding" type="impl:SoapRequest">
        <wsdlsoap:binding style="rpc" transport="http://schemas.xmlsoap.org/soap/http"/>
        <wsdl:operation name="getFirstName">
            <wsdlsoap:operation soapAction=""/>
            <wsdl:input name="getFirstNameRequest">
                <wsdlsoap:body encodingStyle="http://schemas.xmlsoap.org/soap/encoding/" namespace="http://lessons.webgoat.owasp.org" use="encoded"/>
            </wsdl:input>
            <wsdl:output name="getFirstNameResponse">
                <wsdlsoap:body encodingStyle="http://schemas.xmlsoap.org/soap/encoding/" namespace="http://localhost:8080/WebGoat/services/SoapRequest" use="encoded"/>
            </wsdl:output>
        </wsdl:operation>
    <wsdl:operation name="getLastName">
    <wsdlsoap:operation soapAction=""/>
    <wsdl:input name="getLastNameRequest">
    <wsdlsoap:body encodingStyle="http://schemas.xmlsoap.org/soap/encoding/" namespace="http://lessons.webgoat.owasp.org" use="encoded"/>
    </wsdl:input>
    <wsdl:output name="getLastNameResponse">
    <wsdlsoap:body encodingStyle="http://schemas.xmlsoap.org/soap/encoding/" namespace="http://localhost:8080/WebGoat/services/SoapRequest" use="encoded"/>
    </wsdl:output>
    </wsdl:operation>
    <wsdl:operation name="getCreditCard">
    <wsdlsoap:operation soapAction=""/>
    <wsdl:input name="getCreditCardRequest">
    <wsdlsoap:body encodingStyle="http://schemas.xmlsoap.org/soap/encoding/" namespace="http://lessons.webgoat.owasp.org" use="encoded"/>
    </wsdl:input>
    <wsdl:output name="getCreditCardResponse">
    <wsdlsoap:body encodingStyle="http://schemas.xmlsoap.org/soap/encoding/" namespace="http://localhost:8080/WebGoat/services/SoapRequest" use="encoded"/>
    </wsdl:output>
    </wsdl:operation>
    <wsdl:operation name="getLoginCount">
    <wsdlsoap:operation soapAction=""/>
    <wsdl:input name="getLoginCountRequest">
    <wsdlsoap:body encodingStyle="http://schemas.xmlsoap.org/soap/encoding/" namespace="http://lessons.webgoat.owasp.org" use="encoded"/>
    </wsdl:input>
    <wsdl:output name="getLoginCountResponse">
    <wsdlsoap:body encodingStyle="http://schemas.xmlsoap.org/soap/encoding/" namespace="http://localhost:8080/WebGoat/services/SoapRequest" use="encoded"/>
    </wsdl:output>
    </wsdl:operation>
    </wsdl:binding>
    <wsdl:service name="SoapRequestService">
    <wsdl:port binding="impl:SoapRequestSoapBinding" name="SoapRequest">
    <wsdlsoap:address location="http://localhost:8080/WebGoat/services/SoapRequest"/>
    </wsdl:port>
    </wsdl:service>
</wsdl:definitions>
```