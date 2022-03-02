# CSRF

Cross site request forgery 

当黑客Jack能够猜出受害者Bob完成某项Web操作时，所需要的全部参数和数值时，Jack伪造出一个url，这个请求能够执行Jack希望Bob来执行的动作，例如把Bob邮箱中所有邮件转发给Jack，或者给Jack充值。接着，Jack将这个url通过邮件或其他方法发送给Bob，诱骗Bob点击这个连接（执行请求）、完成Jack的意图，这就是CSRF.

- 所谓跨站，指的是在这个安全事件中，有jack所使用的evil server、Bob所使用 victim client 和 Bob访问的某个 web server 等多个site。伪造的请求由Jack 发给Bob，Bob在发给Web server。
- 所谓伪造，不言而喻，Bob无意间执行了自己不知情的请求，即Jack伪造的请求。

## 攻击生效条件

- 攻击者完全掌握伪造请求的各参数信息；
- 攻击者能够有效向受害者提供伪造请求；
- 受害者执行请求时完全无知；
- 执行请求的Web server 未做针对性安全防护。


## 示例

### DVWA Low CSRF Source
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

从上面代码可以看出，构造修改密码的请求表单里，只需提交两次相同的password即可，这显然任何攻击者都可以伪造。了解到这个请求的构造方法后，黑客完全可以结合已知的用户名，如admin或bob，构造如下请求url：

`http://10.10.10.134/dvwa/vulnerabilities/csrf/?password_new=jackpassword&password_conf=jackpassword&Change=Change`

诱骗用户登录系统后执行，即可修改密码，攻击者即可使用新密码登录。

### Medium CSRF Source
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
从上面代码可以看出，服务器收到请求后，验证了请求头referer是否为web server 的IP，这里实验环境是127.0.0.1.这个验证机制的逻辑是，申请更改密码的人，首先要访问web server 某个页面，然后再申请改密码操作。但这种过滤过于简单，攻击者完全可以构造一个http请求头来完成修改referer内容。不过这里很简单，eregi只是验证HTTP_REFERE中包含一个 "127.0.0.1" 字符串即可，那么可以构造一个页面命名为 "127.0.0.1"，例如：

``http://10.10.10.134/127.0.0.1/?password_new=jackpassword&password_conf=jackpassword&Change=Change`

然后发送钓鱼邮件受害者，诱骗受害点击即可。

### High CSRF Source
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

高级的防护思路是，用户必须键入原有密码，这一般是攻击者所不知情的。但这里的代码可能存在sql注入漏洞。使用 `SELECT password FROM users WHERE user='admin' AND password='' or '1'='1` 可以绕过。

