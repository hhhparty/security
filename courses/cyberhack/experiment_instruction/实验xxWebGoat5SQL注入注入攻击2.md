# 实验13 SQL注入注入攻击2

## 实验目的

- 掌握SQL注入修改数据、增加记录、删除记录的方法

## 实验内容

完成Webgoat 5.4中Injection Flaws的下列攻击实验：
- Modify Data with SQL Injection
- Add Data with SQL Injection
- Database Backdoors
- Blind Numeric SQL Injection
- Blind String SQL Injection



## 实验步骤

### Modify Data with SQL Injection

1.打开webgoat5.4 Injection Flaws——Modify Data with SQL Injection 网页。这个页面可以通过键入用户id，例如jsmith，点击“Go！”后，会显示其工资水平。

![injectionflaws-mdwsqli-01](images/webgoat/injectionflaws-mdwsqli-01.png)

```
jsmith' ; update users salary='30000' where userid = 'jsmith 
```


## 实验结论