# SQL Injection 测试用例


## 思路

### 判断注入点

可以关注一下地方：
- 搜索框
- 注册框
- 登录框

#### 搜索框

搜索框可能用到语句有：

```SELECT p.*, pac.all_cities FROM {p}_page AS p left join {p}_page_all_cities pac on p.page_id=pac.page_id and p.lang=pac.lang left join {p}_page_all_provinces pap  on p.page_id=pap.page_id and p.lang=pap.lang WHERE p.[lang] = N'2' AND p.[hidden] = N'0' AND p.[parent_id] =14  And ( p.[title] like N'%sql%' )  And (p.[pri4]=N'1' Or p.[pri5]=N'1' Or p.[pri6]=N'1' Or p.[sec1]=N'1' Or p.[sec2]=N'1' Or p.[sec3]=N'1' Or p.[sec4]=N'1' Or p.[sec5]=N'1' Or p.[sec6]=N'1')  And ( wholeyear=N'1'  Or year1m9=N'1' Or  wholeyear=N'1'  Or year2m1=N'1')  ORDER BY  wholeyear```

上面用到了预编译，有些程序员会毫无安全意识的不使用，使用字符串硬连接，这时就会有注入形成。

## 初步尝试

使用下列进行初步尝试，页面不报错或有不同反馈都可能预示着注入的可能。
- ```1 or 1=1```
- ```1' or '1'='1```
- ```1" or "1"="1```
- ```" or 1=1 or  version() "``` 
- ```" and ord(mid(version(),1,1))>51)"``` 返回正常（没变化）说明是4.0以上版本，可以用union查询。

## 尝试特殊字符


- ```/* */```，行内注释
- ```--```，行注释
- ```#```，行注释
- ```;``` 语句分隔符，可用于构建查询链
- ```'```，单引号，用于包含字符串
- ```+```, 加号用于连接字符串
- ```||```, 用于连接字符串
- ```Char()```， 转化为字符串函数


## 特殊语句

### union
union语句用来将两个或多个select语句的结果结合起来。即对结果做并操作。

注意，使用union时：
- 各个查询语句的结果中，列的数量必须相同；
- 第一个select语句的第一列的数据类型，必须匹配后续所有查询语句的第一列的数据类型；
- 上述要求对所有列有效。

```select first_name from user_system_data union select login_count from user_data;```

union所有的语法也允许重复值。


### joins

join运算用于基于一个关联的列，来连接（组合）两个或多个表。

```select * from user_data INNER JOIN user_data_tan ON user_data.userid=user_data_tan.userid;```


## 盲注

盲注就是通过询问数据库真或假问题，基于应用响应判断答案是真是假的方法。这种方法常用于那些使用通用错误提示的web系统是否有sql注入漏洞，并对有问题的加以利用。

### 基于内容的注入

例如有url``` https://my-shop.com?article=4```是可得到200响应的, 其中的article=4可能是一个sql查询条件，那么我们可以构造一个url，进行测试：```https://my-shop.com?article=4 and 1=1```

- 如果两个url产生的浏览器返回结果相同，那么就可以初步确定有盲注漏洞。

- 如果产生了“page not found”响应，那么可能是盲注方法不对，可以尝试```https://my-shop.com?article=4 and 1=2```,这时没任何响应说明存在盲注，因为语句可被接受，且因条件为假未返回结果。

在确定有盲注可能性之后，构造复杂的语句，猜测信息，例如：

- 猜测数据库版本：```https://my-shop.com?article=4 AND substring(database_version(),1,1) = 2``` 




### 基于时间的注入

与上面不同的是，服务器对于提交的测试sql不会有明确的有区别的响应，那么我们可以根据不同语句的执行响应时间来进行判断。

比较简单的办法是：```sleep()```函数的使用。

例如：```https://my-shop.com?article=4 ; sleep(4)```

