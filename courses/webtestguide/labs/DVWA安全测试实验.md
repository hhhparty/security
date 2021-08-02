# DVWA 安全测试实验
## 安装

安装方式，推荐docker 安装。基本命令如下：
```
# 安装 & 运行：
docker run --rm -it -p 80:80 vulnerables/web-dvwa
```
## 1 Information Gathering

### 1.1 WSTG-INFO-01 Conduct Search Engine Discovery and Reconnaissance for Information Leakage

#### 官方网站信息
[DVWA](http://www.dvwa.co.uk/) is a PHP/MySQL web application that is damn vulnerable. Its main goals are to be an aid for security professionals to test their skills and tools in a legal environment, help web developers better understand the processes of securing web applications and aid teachers/students to teach/learn web application security in a class room environment.

#### 源码

sourcecode：https://github.com/ethicalhack3r/DVWA

### 1.2 WSTG-INFO-02 Fingerprint Web Server
#### 手动访问首页

请求：
```
GET http://10.10.10.135/dvwa HTTP/1.1
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:71.0) Gecko/20100101 Firefox/71.0
Pragma: no-cache
Cache-Control: no-cache
Content-Length: 0
Host: 10.10.10.135
```

响应：
```
HTTP/1.1 200 OK
Date: Sat, 09 May 2020 10:23:50 GMT
Server: Apache/2.2.14 (Ubuntu) mod_mono/2.4.3 PHP/5.3.2-1ubuntu4.30 with Suhosin-Patch proxy_html/3.0.1 mod_python/3.3.1 Python/2.6.5 mod_ssl/2.2.14 OpenSSL/0.9.8k Phusion_Passenger/4.0.38 mod_perl/2.0.4 Perl/v5.10.1
X-Powered-By: PHP/5.3.2-1ubuntu4.30
Set-Cookie: PHPSESSID=cp2agrn16kdcbg5u7835u2nop5; path=/
Expires: Tue, 23 Jun 2009 12:00:00 GMT
Cache-Control: no-cache, must-revalidate
Pragma: no-cache
Set-Cookie: security=low
Vary: Accept-Encoding
Content-Length: 1224
Content-Type: text/html;charset=utf-8
```

价值信息：
- Web服务器：Apache/2.2.14 (Ubuntu) mod_mono/2.4.3 PHP/5.3.2-1ubuntu4.30 with Suhosin-Patch proxy_html/3.0.1 mod_python/3.3.1 Python/2.6.5 mod_ssl/2.2.14 OpenSSL/0.9.8k Phusion_Passenger/4.0.38 mod_perl/2.0.4 Perl/v5.10.1
- php版本：php/5.3.2-lubuntu4.30
- cookie：PHPSESSID=cp2agrn16kdcbg5u7835u2nop5; path=/；security=low
- http访问
- http BASIC Auth

### 1.3 WSTG-INFO-03 Review Webserver Metafiles for Information Leakage

#### 使用OWASP-ZAP爬取

发现了以下RISK：
##### 目录浏览漏洞
http://10.10.10.135/dvwa/dvwa/ 可以看到项目的一个目录，里面有非常敏感的信息。

```
[DIR]	css/	10-Jul-2013 20:42	-	 
[DIR]	images/	10-Jul-2013 20:42	-	 
[DIR]	includes/	10-Jul-2013 20:42	-	 
[DIR]	js/	10-Jul-2013 20:42	-	 
```

##### X-Frame-Options 未设置漏洞

X-Frame-Options HTTP响应头是用来确认是否浏览器可以在frame或iframe标签中渲染一个页面，网站可以用这个头来保证他们的内容不会被嵌入到其它网站中，以来避免点击劫持。

在DVWA中未设置```x-frame-options:deny```，可能会造成clickjacking攻击。


##### Absence of Anti-CSRF Tokens

反CSRF令牌没有在HTML提交表单中出现。跨站请求伪造会诱骗用户发送请求到目标网站，以用户身份执行某个行为。主要问题是应用以重复方式使用了可预测的URL或表单，CSRF攻击会利用用户身份/网站对用户的信任。

##### CSP Scanner

略

##### Cookie 中没有http-only标记
服务器发送到浏览器等客户端的cookies，可能被各种脚本所读取。

##### Cookie 中没有设置 Samesite属性

该SameSite属性用于断言不应将cookie与跨站点请求一起发送。此功能允许服务器减轻跨站信息泄漏的风险。在某些情况下，它也可以用作防止跨站点请求伪造攻击。可以在三种不同的模式下配置此属性：
- Strict
- Lax
- None

DVWA security=low的Samesite未设置。这样会传递cookie给第三方。

##### Server Leaks Information via "X-Powered-By" HTTP Response Header Field(s)

```X-Powered-By: PHP/5.3.2-1ubuntu4.30```泄露了DVWA该应用使用的开发技术。

##### Web Browser XSS Protection Not Enabled

HTTP响应头中没有设置 ```X-XSS-Protection``` ，没有启动浏览器XSS保护机制。虽然这一设置并不能完全免除XSS但仍需要设置。

可以尝试下列值:
```X-XSS-Protection: 1; mode=block```

```X-XSS-Protection: 1; report=http://www.example.com/xss```

而不应该是：```X-XSS-Protection: 0```

##### X-Content-Type-Options Header Missing

The ```Anti-MIME-Sniffing``` header ```X-Content-Type-Options``` 没有设置为 'nosniff'.
老版本的IE、Chrome会执行对响应体部分的MIME-sniffing.

它阻止浏览器进行 MIME-type 嗅探。大多数浏览器现在都在执行此header.

所谓嗅探就是检查MIME类型，那么就可能解析文件头部的类型信息，如果在其中嵌入了脚本就会被执行。

### 1.4 WSTG-INFO-04 Enumerate Applications on Webserver 

浏览10.10.10.135，首页中列出了很多应用：

- OWASP WebGoat	
- OWASP WebGoat.NET
- OWASP ESAPI Java SwingSet Interactive
- OWASP Mutillidae II
- OWASP RailsGoat
- OWASP Bricks
- OWASP Security Shepherd
- Ghost
- Magical Code Injection Rainbow
- bWAPP
- Damn Vulnerable Web Application	
- OWASP Vicnum	
- OWASP 1-Liner
- Google Gruyere	
- Hackxor
- WackoPicko
- BodgeIt
- Cyclone
- Peruggia
- WordPress	
- OrangeHRM
- GetBoo
- GTD-PHP
- Yazd
- WebCalendar
- Gallery2
- Tiki Wiki
- Joomla
- AWStats
- OWASP ZAP-WAVE
- WAVSEP
- WIVET

为了提高速度，可以使用OWASP ZAP 或 burpsuite等扫描爬取工具进行隐藏应用的发现，枚举相关web servers上的所有的web应用。

隐藏域名的发现可能需要fuzz 文件的支持（域名字典）或正则式扩展。

### 1.5 WSTG-INFO-05 Review Webpage Comments and Metadata for Information Leakage

复查网页注释和元数据，发现任何可能的信息泄露。



### 1.6 WSTG-INFO-06 Identify Application Entry Points

- 理解如何构造请求，理解服务器给出的响应。

### 1.7 WSTG-INFO-07	Map Execution Paths Through Application	
### 1.8 WSTG-INFO-09	Fingerprint Web Application Framework	
### 1.9 WSTG-INFO-09	Fingerprint Web Application	
### 1.10 WSTG-INFO-10	Map Application Architecture


## 2 WSTG-CONF	Configuration and Deploy Management Testing	
### 2.1 WSTG-CONF-01	Test Network Infrastructure Configuration
使用了HTTP协议	
### 2.2 WSTG-CONF-02	Test Application Platform Configuration	
### 2.3 WSTG-CONF-03	Test File Extensions Handling for Sensitive Information	
### 2.4 WSTG-CONF-04	Backup and Unreferenced Files for Sensitive Information	
### 2.5 WSTG-CONF-05	Enumerate Infrastructure and Application Admin Interfaces	
### 2.6 WSTG-CONF-06	Test HTTP Methods	
### 2.7 WSTG-CONF-07	Test HTTP Strict Transport Security	
### 2.8 WSTG-CONF-08	Test RIA Cross Domain Policy	
### 2.9 WSTG-CONF-09	Test File Permission	
### 2.10 WSTG-CONF-10	Test for Subdomain Takeover	
### 2.11 WSTG-CONF-11	Test Cloud Storage	


## 3 WSTG-IDNT	Identity Management Testing	
### 3.1 WSTG-IDNT-01	Test Role Definitions	
### 3.2 WSTG-IDNT-02	Test User Registration Process	
### 3.3 WSTG-IDNT-03	Test Account Provisioning Process	
### 3.4 WSTG-IDNT-04	Testing for Account Enumeration and Guessable User Account	
### 3.5 WSTG-IDNT-05	Testing for Weak or Unenforced Username Policy	


## 4 WSTG-ATHN	Authentication Testing	
### 4.1 WSTG-ATHN-01	Testing for Credentials Transported over an Encrypted Channel	




#### 可暴力破解的登录验证源代码

##### security=low的版本：
```php
# 
<?php

if( isset( $_GET['Login'] ) ) {
    $user = $_GET['username'];    
    $pass = $_GET['password'];
    $pass = md5($pass);

    $qry = "SELECT * FROM `users` WHERE user='$user' AND password='$pass';";
    $result = mysql_query( $qry ) or die( '<pre>' . mysql_error() . '</pre>' );

    if( $result && mysql_num_rows( $result ) == 1 ) {
        // Get users details
        $i=0; // Bug fix.
        $avatar = mysql_result( $result, $i, "avatar" );

        // Login Successful
        echo "<p>Welcome to the password protected area " . $user . "</p>";
        echo '<img src="' . $avatar . '" />';
    } else {
        //Login failed
        echo "<pre><br>Username and/or password incorrect.</pre>";
    }

    mysql_close();
}

?>
```

##### security=meddle的版本：
```php
<?php

if( isset( $_GET[ 'Login' ] ) ) {

    // Sanitise username input
    $user = $_GET[ 'username' ];
    $user = mysql_real_escape_string( $user );//

    // Sanitise password input
    $pass = $_GET[ 'password' ];
    $pass = mysql_real_escape_string( $pass );
    $pass = md5( $pass );

    $qry = "SELECT * FROM `users` WHERE user='$user' AND password='$pass';";
    $result = mysql_query( $qry ) or die( '<pre>' . mysql_error() . '</pre>' );

    if( $result && mysql_num_rows($result) == 1 ) {
        // Get users details
        $i=0; // Bug fix.
        $avatar = mysql_result( $result, $i, "avatar" );

        // Login Successful
        echo "<p>Welcome to the password protected area " . $user . "</p>";
        echo '<img src="' . $avatar . '" />';
    } else {
        //Login failed
        echo "<pre><br>Username and/or password incorrect.</pre>";
    }

    mysql_close();
}

?>
```
上面代码中使用了php中的mysql_real_escape_string()，它转义 SQL 语句中使用的字符串中的特殊字符。受影响的字符包括：```\x00 \n \r \ ' " \x1a```。换句话说，这些字符将被转义，不能表示原义。可以防止一定的sql注入攻击。

##### security=high的版本：
```php
<?php

if( isset( $_GET[ 'Login' ] ) ) {

    // Sanitise username input
    $user = $_GET[ 'username' ];
    $user = stripslashes( $user );
    $user = mysql_real_escape_string( $user );

    // Sanitise password input
    $pass = $_GET[ 'password' ];
    $pass = stripslashes( $pass );
    $pass = mysql_real_escape_string( $pass );
    $pass = md5( $pass );

    $qry = "SELECT * FROM `users` WHERE user='$user' AND password='$pass';";
    $result = mysql_query($qry) or die('<pre>' . mysql_error() . '</pre>' );

    if( $result && mysql_num_rows( $result ) == 1 ) {
        // Get users details
        $i=0; // Bug fix.
        $avatar = mysql_result( $result, $i, "avatar" );

        // Login Successful
        echo "<p>Welcome to the password protected area " . $user . "</p>";
        echo '<img src="' . $avatar . '" />';
    } else {
        // Login failed
        sleep(3);
        echo "<pre><br>Username and/or password incorrect.</pre>";
        }

    mysql_close();
}

?>
```

代码中的 stripslashes() 函数将删除由 addslashes() 函数添加的反斜杠。该函数可用于清理从数据库中或者从 HTML 表单中取回的数据。


### 4.2 WSTG-ATHN-02	Testing for Default Credentials	
访问首页后，```Cookie: security=low; PHPSESSID=7heh9fgi56l0a1gutt88jdq4e2```

使用用户user登录：```Cookie: security=low; PHPSESSID=7heh9fgi56l0a1gutt88jdq4e2```

退出user后再次登录：```Cookie: security=low; PHPSESSID=7heh9fgi56l0a1gutt88jdq4e2```

使用
### 4.3 WSTG-ATHN-03	Testing for Weak Lock Out Mechanism	
### 4.4 WSTG-ATHN-04	Testing for Bypassing Authentication Schema	
### 4.5 WSTG-ATHN-05	Testing for Vulnerable Remember Password	
### 4.6 WSTG-ATHN-06	Testing for Browser Cache Weakness	
### 4.7 WSTG-ATHN-07	Testing for Weak Password Policy	
### 4.8 WSTG-ATHN-08	Testing for Weak Security Question Answer	
### 4.9 WSTG-ATHN-09	Testing for Weak Password Change or Reset Functionalities	
### 4.10 WSTG-ATHN-10	Testing for Weaker Authentication in Alternative Channel	
## 5 WSTG-ATHZ	Authorization Testing	
### 5.1 WSTG-ATHZ-01	Testing Directory Traversal - File Include

存在文件包含漏洞。

证据：在链接```http://10.10.10.135/dvwa/vulnerabilities/fi/?page=include.php```中，修改include.php为```../../../../../etc/passwd```，新链接为```http://10.10.10.135/dvwa/vulnerabilities/fi/?page=../../../../../etc/passwd```，可以显示内容。

#### High File Inclusion Source
```php
<?php
        
    $file = $_GET['page']; //The page we wish to display 

    // Only allow include.php
    if ( $file != "include.php" ) {
        echo "ERROR: File not found!";
        exit;
    }
        
?>
```
使用硬编码，防止注入。

#### Medium File Inclusion Source
```php
<?php

    $file = $_GET['page']; // The page we wish to display 

    // Bad input validation
    $file = str_replace("http://", "", $file);
    $file = str_replace("https://", "", $file);        
?>
```
这里通过替换路径中的http、https防止包含远程文件（恶意页面）。

#### Low File Inclusion Source
```php
<?php

    $file = $_GET['page']; //The page we wish to display 

?>
```

### 5.2 WSTG-ATHZ-02	Testing for Bypassing Authorization Schema	
### 5.3 WSTG-ATHZ-03	Testing for Privilege Escalation	
### 5.4 WSTG-ATHZ-04	Testing for Insecure Direct Object References	
## 6 WSTG-SESS	Session Management Testing	
### 6.1 WSTG-SESS-01	Testing for Bypassing Session Management Schema	

### 6.2 WSTG-SESS-02	Testing for Cookies Attributes	
### 6.3 WSTG-SESS-03	Testing for Session Fixation	
### 6.4 WSTG-SESS-04	Testing for Exposed Session Variables	
### 6.5 WSTG-SESS-05	Testing for Cross Site Request Forgery	

```GET http://10.10.10.135/dvwa/vulnerabilities/csrf/?password_new=123&password_conf=123&Change=Change HTTP/1.1```

上述链接能改修改用户密码。如果某个用户已经登录服务器，那么他已有了合法身份凭据。此时，攻击者通过发送邮件或图片，使用户在同一浏览器上点击此链接，那么合法身份凭证+修改密码链接两者结合，就可以在服务器器端修改用户口令。

#### High CSRF Source
```php
<?php
            
    if (isset($_GET['Change'])) {
    
        // Turn requests into variables
        $pass_curr = $_GET['password_current'];
        $pass_new = $_GET['password_new'];
        $pass_conf = $_GET['password_conf'];

        // Sanitise current password input
        $pass_curr = stripslashes( $pass_curr );
        $pass_curr = mysql_real_escape_string( $pass_curr );
        $pass_curr = md5( $pass_curr );
        
        // Check that the current password is correct
        $qry = "SELECT password FROM `users` WHERE user='admin' AND password='$pass_curr';";
        $result = mysql_query($qry) or die('<pre>' . mysql_error() . '</pre>' );

        if (($pass_new == $pass_conf) && ( $result && mysql_num_rows( $result ) == 1 )){
            $pass_new = mysql_real_escape_string($pass_new);
            $pass_new = md5($pass_new);

            $insert="UPDATE `users` SET password = '$pass_new' WHERE user = 'admin';";
            $result=mysql_query($insert) or die('<pre>' . mysql_error() . '</pre>' );
                        
            echo "<pre> Password Changed </pre>";        
            mysql_close();
        }
    
        else{        
            echo "<pre> Passwords did not match or current password incorrect. </pre>";            
        }

    }
?>
```
要求用户先输入当前密码才能更改密码，防止用户不知情下更改密码。

此外还验证了当前用户表中仅有一条admin记录，才允许改变密码。什么时候会有2条呢？

#### Medium CSRF Source
```php
<?php
            
    if (isset($_GET['Change'])) {
    
        // Checks the http referer header
        if ( eregi ( "127.0.0.1", $_SERVER['HTTP_REFERER'] ) ){
    
            // Turn requests into variables
            $pass_new = $_GET['password_new'];
            $pass_conf = $_GET['password_conf'];

            if ($pass_new == $pass_conf){
                $pass_new = mysql_real_escape_string($pass_new);
                $pass_new = md5($pass_new);

                $insert="UPDATE `users` SET password = '$pass_new' WHERE user = 'admin';";
                $result=mysql_query($insert) or die('<pre>' . mysql_error() . '</pre>' );
                        
                echo "<pre> Password Changed </pre>";        
                mysql_close();
            }
    
            else{        
                echo "<pre> Passwords did not match. </pre>";            
            }    

        }
        
    }
?>
```

函数 eregi() 不区分大小写的正则表达式匹配，```eregi ( string $pattern , string $string [, array &$regs ] ) : int```它和 ereg() 基本相同，只是在匹配字母字符时忽略大小写的区别。

在中等安全级别下，只有Refer为服务器本机时，才能接受更改。而refer表示当前浏览器上一次访问的网址，及从哪里来到当前网站的。这样防止用户点击非本站链接后访问本站，用户只有现在本站其它页面访问过，才能访问当前连接。

#### Low CSRF Source
```php

<?php
                
    if (isset($_GET['Change'])) {
    
        // Turn requests into variables
        $pass_new = $_GET['password_new'];
        $pass_conf = $_GET['password_conf'];


        if (($pass_new == $pass_conf)){
            $pass_new = mysql_real_escape_string($pass_new);
            $pass_new = md5($pass_new);

            $insert="UPDATE `users` SET password = '$pass_new' WHERE user = 'admin';";
            $result=mysql_query($insert) or die('<pre>' . mysql_error() . '</pre>' );
                        
            echo "<pre> Password Changed </pre>";        
            mysql_close();
        }
    
        else{        
            echo "<pre> Passwords did not match. </pre>";            
        }

    }
?>
```


### 6.6 WSTG-SESS-06	Testing for Logout Functionality	
### 6.7 WSTG-SESS-07	Test Session Timeout	
### 6.8 WSTG-SESS-08	Testing for Session Puzzling	
## 7 WSTG-INPV	Input Validation Testing	
### 7.1 WSTG-INPV-01	Testing for Reflected Cross Site Scripting	
### 7.2 WSTG-INPV-02	Testing for Stored Cross Site Scripting	
### 7.3 WSTG-INPV-03	Testing for HTTP Verb Tampering	
### 7.4 WSTG-INPV-04	Testing for HTTP Parameter pollution	
### 7.5 WSTG-INPV-05	Testing for SQL Injection	

#### Basic SQL injection

存在普通sql注入漏洞

##### High SQL Injection Source
```php
<?php    

if (isset($_GET['Submit'])) {

    // Retrieve data

    $id = $_GET['id'];
    $id = stripslashes($id);
    $id = mysql_real_escape_string($id);

    if (is_numeric($id)){

        $getid = "SELECT first_name, last_name FROM users WHERE user_id = '$id'";
        $result = mysql_query($getid) or die('<pre>' . mysql_error() . '</pre>' );

        $num = mysql_numrows($result);

        $i=0;

        while ($i < $num) {

            $first = mysql_result($result,$i,"first_name");
            $last = mysql_result($result,$i,"last_name");
            
            echo '<pre>';
            echo 'ID: ' . $id . '<br>First name: ' . $first . '<br>Surname: ' . $last;
            echo '</pre>';

            $i++;
        }
    }
}
?>
```
使用stripslashes($id)和mysql_real_escape_string($id)转义，防止危险字符输入。


##### Medium SQL Injection Source
```php

<?php

if (isset($_GET['Submit'])) {

    // Retrieve data

    $id = $_GET['id'];
    $id = mysql_real_escape_string($id);

    $getid = "SELECT first_name, last_name FROM users WHERE user_id = $id";

    $result = mysql_query($getid) or die('<pre>' . mysql_error() . '</pre>' );
    
    $num = mysql_numrows($result);

    $i=0;

    while ($i < $num) {

        $first = mysql_result($result,$i,"first_name");
        $last = mysql_result($result,$i,"last_name");
        
        echo '<pre>';
        echo 'ID: ' . $id . '<br>First name: ' . $first . '<br>Surname: ' . $last;
        echo '</pre>';

        $i++;
    }
}
?>
```
使用mysql_real_escape_string函数进行转义。

##### Low SQL Injection Source
```php
<?php    

if(isset($_GET['Submit'])){
    
    // Retrieve data
    
    $id = $_GET['id'];

    $getid = "SELECT first_name, last_name FROM users WHERE user_id = '$id'";
    $result = mysql_query($getid) or die('<pre>' . mysql_error() . '</pre>' );

    $num = mysql_numrows($result);

    $i = 0;

    while ($i < $num) {

        $first = mysql_result($result,$i,"first_name");
        $last = mysql_result($result,$i,"last_name");
        
        echo '<pre>';
        echo 'ID: ' . $id . '<br>First name: ' . $first . '<br>Surname: ' . $last;
        echo '</pre>';

        $i++;
    }
}
?>
```
#### Blind SQL Injection
存在盲注sql注入漏洞。

##### High SQL Injection (Blind) Source
```php
<?php    

if(isset($_GET['Submit'])){

    // Retrieve data

    $id = $_GET['id'];
    $id = stripslashes($id);
    $id = mysql_real_escape_string($id);

    if (is_numeric($id)) {

        $getid = "SELECT first_name, last_name FROM users WHERE user_id = '$id'";
        $result = mysql_query($getid); // Removed 'or die' to suppres mysql errors

        $num = @mysql_numrows($result); // The '@' character suppresses errors making the injection 'blind'

        $i=0;

        while ($i < $num) {

            $first = mysql_result($result,$i,"first_name");
            $last = mysql_result($result,$i,"last_name");
            
            echo '<pre>';
            echo 'ID: ' . $id . '<br>First name: ' . $first . '<br>Surname: ' . $last;
            echo '</pre>';

            $i++;
        }
    }
}
?>
```
##### Medium SQL Injection (Blind) Source
```php
<?php

if (isset($_GET['Submit'])) {

    // Retrieve data

    $id = $_GET['id'];
    $id = mysql_real_escape_string($id);

    $getid = "SELECT first_name, last_name FROM users WHERE user_id = $id";
    $result = mysql_query($getid); // Removed 'or die' to suppres mysql errors
    
    $num = @mysql_numrows($result); // The '@' character suppresses errors making the injection 'blind'

    $i=0;

    while ($i < $num) {

        $first=mysql_result($result,$i,"first_name");
        $last=mysql_result($result,$i,"last_name");
        
        echo '<pre>';
        echo 'ID: ' . $id . '<br>First name: ' . $first . '<br>Surname: ' . $last;
        echo '</pre>';

        $i++;
    }
}
?>
```
增加了字符串过滤函数 mysql_real_escape_string()
##### Low SQL Injection (Blind) Source
```php
<?php    

if (isset($_GET['Submit'])) {
    
    // Retrieve data
    
    $id = $_GET['id'];

    $getid = "SELECT first_name, last_name FROM users WHERE user_id = '$id'";
    $result = mysql_query($getid); // Removed 'or die' to suppres mysql errors

    $num = @mysql_numrows($result); // The '@' character suppresses errors making the injection 'blind'

    $i = 0;

    while ($i < $num) {

        $first = mysql_result($result,$i,"first_name");
        $last = mysql_result($result,$i,"last_name");
        
        echo '<pre>';
        echo 'ID: ' . $id . '<br>First name: ' . $first . '<br>Surname: ' . $last;
        echo '</pre>';

        $i++;
    }
}
?>
```

PHP 支持一个错误控制运算符：@。当将其放置在一个 PHP 表达式之前，该表达式可能产生的任何错误信息都被忽略掉。使用了@，页面不会报告mysql产生的错误信息。

#### 7.5.1 Oracle	
#### 7.5.2 MySQL	
#### 7.5.3 SQL Server	
#### 7.5.4 PostgreSQL	
#### 7.5.5 MS Access	
#### 7.5.6 NoSQL	
#### 7.5.7 ORM	
#### 7.5.8 Client Side	
### 7.6 WSTG-INPV-06	Testing for LDAP Injection	
### 7.7 WSTG-INPV-07	Testing for XML Injection	
### 7.8 WSTG-INPV-08	Testing for SSI Injection	
### 7.9 WSTG-INPV-09	Testing for XPath Injection	
### 7.10 WSTG-INPV-10	IMAP/SMTP Injection	
### 7.11 WSTG-INPV-11	Testing for Code Injection	
#### 7.11.1 Testing for Local File Inclusion	
#### 7.11.2 Tsting for Remote File Inclusion	
### 7.12 WSTG-INPV-12	Testing for Command Injection

存在命令注入漏洞。

High Command Execution Source
<?php

if( isset( $_POST[ 'submit' ] ) ) {

    $target = $_REQUEST["ip"];
    
    $target = stripslashes( $target );
    
    
    // Split the IP into 4 octects
    $octet = explode(".", $target);
    
    // Check IF each octet is an integer
    if ((is_numeric($octet[0])) && (is_numeric($octet[1])) && (is_numeric($octet[2])) && (is_numeric($octet[3])) && (sizeof($octet) == 4)  ) {
    
    // If all 4 octets are int's put the IP back together.
    $target = $octet[0].'.'.$octet[1].'.'.$octet[2].'.'.$octet[3];
    
    
        // Determine OS and execute the ping command.
        if (stristr(php_uname('s'), 'Windows NT')) { 
    
            $cmd = shell_exec( 'ping  ' . $target );
            echo '<pre>'.$cmd.'</pre>';
        
        } else { 
    
            $cmd = shell_exec( 'ping  -c 3 ' . $target );
            echo '<pre>'.$cmd.'</pre>';
        
        }
    
    }
    
    else {
        echo '<pre>ERROR: You have entered an invalid IP</pre>';
    }
    
    
}

?>

Medium Command Execution Source
<?php

if( isset( $_POST[ 'submit'] ) ) {

    $target = $_REQUEST[ 'ip' ];

    // Remove any of the charactars in the array (blacklist).
    $substitutions = array(
        '&&' => '',
        ';' => '',
    );

    $target = str_replace( array_keys( $substitutions ), $substitutions, $target );
    
    // Determine OS and execute the ping command.
    if (stristr(php_uname('s'), 'Windows NT')) { 
    
        $cmd = shell_exec( 'ping  ' . $target );
        echo '<pre>'.$cmd.'</pre>';
        
    } else { 
    
        $cmd = shell_exec( 'ping  -c 3 ' . $target );
        echo '<pre>'.$cmd.'</pre>';
        
    }
}

?>

Low Command Execution Source
<?php

if( isset( $_POST[ 'submit' ] ) ) {

    $target = $_REQUEST[ 'ip' ];

    // Determine OS and execute the ping command.
    if (stristr(php_uname('s'), 'Windows NT')) { 
    
        $cmd = shell_exec( 'ping  ' . $target );
        echo '<pre>'.$cmd.'</pre>';
        
    } else { 
    
        $cmd = shell_exec( 'ping  -c 3 ' . $target );
        echo '<pre>'.$cmd.'</pre>';
        
    }
    
}
?>




### 7.13 WSTG-INPV-13	Testing for Buffer overflow	
#### 7.13.1 Testing for Heap Overflow	
#### 7.13.2 Testing for Stack Overflow	
#### 7.13.3 Testing for Format String	
### 7.14 WSTG-INPV-14	Testing for Incubated Vulnerabilities	
### 7.15 WSTG-INPV-15	Testing for HTTP Splitting/Smuggling	
### 7.16 WSTG-INPV-16	Testing for HTTP Incoming Requests	
### 7.17 WSTG-INPV-17	Testing for Host Header Injection	
### 7.18 WSTG-INPV-18	Testing for Server Side Template Injection	
## 8 WSTG-ERRH	Error Handling	
### 8.1 WSTG-ERRH-01	Analysis of Error Codes	
### 8.2 WSTG-ERRH-02	Analysis of Stack Traces	
## 9 WSTG-CRYP	Cryptography	
### 9.1 WSTG-CRYP-01	Testing for Weak Cryptography	
### 9.2 WSTG-CRYP-02	Testing for Padding Oracle	
### 9.3 WSTG-CRYP-03	Testing for Sensitive Information Sent Via Unencrypted Channels	
### 9.4 WSTG-CRYP-04	Testing for Weak Encryption	
## 10 WSTG-BUSLOGIC	Business Logic Testing	
### 10.1 WSTG-BUSL-01	Test Business Logic Data Validation	
### 10.2 WSTG-BUSL-02	Test Ability to Forge Requests	
### 10.3 WSTG-BUSL-03	Test Integrity Checks	
### 10.4 WSTG-BUSL-04	Test for Process Timing	
### 10.5 WSTG-BUSL-05	Test Number of Times a Function Can be Used Limits	
### 10.6 WSTG-BUSL-06	Testing for the Circumvention of Work Flows	
### 10.7 WSTG-BUSL-07	Test Defenses Against Application Misuse	
### 10.8 WSTG-BUSL-08	Test Upload of Unexpected File Types	
### 10.9 WSTG-BUSL-09	Test Upload of Malicious Files	
## 11 WSTG-CLIENT	Client Side Testing	
### 11.1 WSTG-CLNT-01	Testing for DOM based Cross Site Scripting	
### 11.2 WSTG-CLNT-02	Testing for JavaScript Execution	
### 11.3 WSTG-CLNT-03	Testing for HTML Injection	
### 11.4 WSTG-CLNT-04	Testing for Client Side URL Redirect	
### 11.5 WSTG-CLNT-05	Testing for CSS Injection	
### 11.6 WSTG-CLNT-06	Testing for Client Side Resource Manipulation	
### 11.7 WSTG-CLNT-07	Test Cross Origin Resource Sharing	
### 11.8 WSTG-CLNT-08	Testing for Cross Site Flashing	
### 11.9 WSTG-CLNT-09	Testing for Clickjacking	
### 11.10 WSTG-CLNT-10	Testing WebSockets	
### 11.11 WSTG-CLNT-11	Test Web Messaging	
### 11.12 WSTG-CLNT-12	Test Local Storage	
### 11.13 WSTG-CLNT-13	Testing for Cross Site Script Inclusion

