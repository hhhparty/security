# PHP 代码样例

## 连接数据库

### mysql
```PHP
<?php
    $mysql_server_name = "localhost";
    $mysql_username = "root";
    $mysql_password = "";
    $mysql_database = "php_mysql";

    //connect to db
    $conn = mysql_connect($mysql_server_name,$mysql_username,$mysql_password);
    mysql_query("set names 'gbk'");//显示中文

    $id = $_GET['id'];//HTTP GET 参数id中获取值

    $strsql = "select * from userinfo where id=".$id."";
    //exec sql 
    mysql_select_db($mysql_database,$conn);
    $result = mysql_query($strsql,$conn);
    //get query result
    $row = mysql_fetch_row($result);

     echo '<font face="verdana">';
    echo '<table border="1" cellpadding="1" cellspacing="2">';

    // 显示字段名称
    echo "\n<tr>\n";
    for ($i=0; $i<mysql_num_fields($result); $i++)
    {
      echo '<td><b>'.
      mysql_field_name($result, $i);
      echo "</b></td>\n";
    }
    echo "</tr>\n";
    // 定位到第一条记录
    mysql_data_seek($result, 0);
    // 循环取出记录
    while ($row=mysql_fetch_row($result))
    {
      echo "<tr>\n";
      for ($i=0; $i<mysql_num_fields($result); $i++ )
      {
        echo '<td bgcolor="#00FF00">';
        echo "$row[$i]";
        echo '</td>';
      }
      echo "</tr>\n";
    }
    
    echo "</table>\n";
    echo "</font>";
    // 释放资源
    mysql_free_result($result);
    // 关闭连接
    mysql_close();
?>
```