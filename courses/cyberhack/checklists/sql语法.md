# SQL 语法


SQL结构化查询语言是访问数据库的标准查询工具。许多数据库都支持它。 

有关SQL的知识，可以参考： https://www.w3school.com.cn/sql/sql_syntax.asp

可以把 SQL 分为两个部分：数据操作语言 (DML) 和 数据定义语言 (DDL)。SQL (结构化查询语言)是用于执行查询的语法。但是 SQL 语言也包含用于更新、插入和删除记录的语法。

## 快速参考

https://www.w3school.com.cn/sql/sql_quickref.asp


## DML
SQL 是关系数据库的定义、操作、查询（DDL、DML、DCL）语言，在Web系统中很常见。SQL注入问题也是很多企业数据泄露事件的关键所在。

下面是一些SQL语法：

```SELECT 列名称 FROM 表名称```

```SELECT DISTINCT 列名称 FROM 表名称```

```UPDATE 表名称 SET 列名称 = 新值 WHERE 列名称 = 某值```

```INSERT INTO 表名称 VALUES (值1, 值2,....)```

```DELETE FROM 表名称 WHERE 列名称 = 值```

## DDL 

### create
```
CREATE DATABASE database_name


CREATE TABLE 表名称
(
列名称1 数据类型,
列名称2 数据类型,
列名称3 数据类型,
....
)
```

创建表时常见的约束有：
- NOT NULL
- UNIQUE
- PRIMARY KEY
- FOREIGN KEY
- CHECK
- DEFAULT

```
CREATE INDEX index_name
ON table_name (column_name)

CREATE UNIQUE INDEX index_name
ON table_name (column_name)
```

### drop

#### 删除 INDEX

- 用于 Microsoft SQLJet (以及 Microsoft Access) 的语法:
```DROP INDEX index_name ON table_name```

- 用于 MS SQL Server 的语法:
```DROP INDEX table_name.index_name```

- 用于 IBM DB2 和 Oracle 语法:

```DROP INDEX index_name```

- 用于 MySQL 的语法:

```ALTER TABLE table_name DROP INDEX index_name```


#### 删除表

DROP TABLE 语句用于删除表（表的结构、属性以及索引也会被删除）：
语法： ```DROP TABLE 表名称```

#### 删除数据库
语法：```DROP DATABASE 数据库名称```

### 清空数据

TRUNCATE TABLE 语句

如果我们仅仅需要除去表内的数据，但并不删除表本身，那请使用 TRUNCATE TABLE 命令（仅仅删除表格中的数据）：

```TRUNCATE TABLE 表名称```




### ALTER TABLE 语句

```
#ALTER TABLE 语句用于在已有的表中添加、修改或删除列。

ALTER TABLE table_name
ADD column_name datatype

#要删除表中的列，请使用下列语法：

ALTER TABLE table_name 
DROP COLUMN column_name

#注释：某些数据库系统不允许这种在数据库表中删除列的方式 (DROP COLUMN column_name)。
#要改变表中列的数据类型，请使用下列语法：

ALTER TABLE table_name
ALTER COLUMN column_name datatype
```

```
#SQL CREATE VIEW 语句
CREATE VIEW view_name AS
SELECT column_name(s)
FROM table_name
WHERE condition
```


### GRANT



SQL的GRANT 允许对象的创建者给某用户或某组或所有用户（PUBLIC）某些特定的权限．对象创建后，除了创建者外，除非创建者赋予（GRANT）权限，其他人没有访问对象的权限．一旦用户有某对象的权限，他就可以使用那个特权．不需要给创建者赋予（GRANT）对象的权限，创建者自动拥有对象的所有权限，包括删除它的权限．

SQL的GRANT — 赋予一个用户，一个组或所有用户访问权限
语法：```GRANT privilege [, ...] ON object [, ...] TO { PUBLIC | GROUP group | username }```

privilege 可能的权限有：
- SELECT 访问声明的表/视图的所有列/字段．
- INSERT 向声明的表中插入所有列字段．
- UPDATE 更新声明的表所有列/字段．
- DELETE 从声明的表中删除所有行．
- RULE 在表/视图上定义规则 （参见 CREATE RULE 语句）．
- ALL 赋予所有权限．

object 赋予权限的对象名．可能的对象是：
- table
- view
- sequence

PUBLIC 代表是所有用户的简写．
- GROUP group 将要赋予权限的组 group ．
- username 将要赋予权限的用户名．PUBLIC 是代表所有用户的简写．

输出：
- CHANGE 如果成功，返回此信息．
- ERROR: ChangeAcl: class "object" not found 如果所声明的对象不可用或不可能对声明的组或用户赋予权限．



## 5 SQL特殊字符

### 5.1 SQL语句后面的分号

某些数据库系统要求在每条 SQL 命令的末端使用分号。在我们的教程中不使用分号。

分号是在数据库系统中分隔每条 SQL 语句的标准方法，这样就可以在对服务器的相同请求中执行一条以上的语句。

如果您使用的是 MS Access 和 SQL Server 2000，则不必在每条 SQL 语句之后使用分号，不过某些数据库软件要求必须使用分号。



#### 5.1.1 行内注释
```
/* */
# 或：
-- ， #
# 例如：
SELECT * FROM users WHERE name='admin' --and pass='pass'
```

#### 5.1.2 允许查询链(语句分割符)
```
;
# 例如：
SELECT * FROM users; drop table users;
```

#### 5.1.3 字符串连接符
```
' 或 + 或 ||
# 使用char函数，将ASCII码转换为字符
char()

# 例如：
SELECT * FROM users WHERE name='+char(27) or 1=1

```

### 5.2 SQL 特殊语句

#### 5.2.1 UNION

使用 union 操作符可以将两个或多个 SELECT 语句的结果合并起来。

需要特别注意的是：
- union 合并中的每个 SELECT 语句的输出结果，必须在列的数量上是相同的。
- 第一个 SELECT 语句的第一列、第二列...的数据类型，必须匹配第二个、第三个... SELECT 语句的第一列、第二列...的数据类型。即每个对应列的数据类型都要相同。

```
SELECT First_Name from user_system_data UNION SELECT login_count FROM user_data;
```

#### 5.2.2 Joins

join 运算符用于合并两个或多个表的行，合并条件是对应列。

```
SELECT * FROM user_system_data UNION SELECT  login_count FROM user_data;

```

## CASE WHEN

CASE 有两种格式：
- 简单case函数
- case搜索函数

简单 case 函数：

```sql
CASE sex
WHEN '1' THEN '男'
WHEN '2' THEN '女'
ELSE '其他' 
```
搜索函数：

```sql
CASE WHEN sex = '1' THEN '男'
WHEN sex = '2' THEN '女'
ELSE '其他' END
```

这两种方式，可以实现相同的功能。简单Case函数的写法相对比较简洁，但是和Case搜索函数相比，功能方面会有些限制，比如写判断式。

需要注意的问题，Case函数只返回第一个符合条件的值，剩下的Case部分将会被自动忽略。例如下面的语句中的第二个when永远不会被执行。
```sql
CASE WHEN col_1 IN ( 'a', 'b') THEN '第一类'
WHEN col_1 IN ('a')       THEN '第二类'
ELSE'其他' END
```

### 示例

```sql
CREATE TABLE `table_a` (
  `id` INT(10) NOT NULL AUTO_INCREMENT,
  `country` VARCHAR(100) DEFAULT NULL,
  `population` INT(10) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=INNODB DEFAULT CHARSET=utf8;

INSERT INTO table_A (country,population) VALUES('中国',600);
INSERT INTO table_A (country,population) VALUES('美国',100);
INSERT INTO table_A (country,population) VALUES('加拿大',100);
INSERT INTO table_A (country,population) VALUES('英国',200);
INSERT INTO table_A (country,population) VALUES('法国',300);


SELECT 
    CASE country
        WHEN '中国'   THEN '亚洲'
        WHEN '印度'   THEN '亚洲'
        WHEN '日本'   THEN '亚洲'
        WHEN '美国'   THEN '北美洲'
        WHEN '加拿大'  THEN '北美洲'
        WHEN '墨西哥'  THEN '北美洲'
        ELSE '其他'
    END AS '洲',then
    SUM(population) AS '人口'
    ''
    FROM table_A
    GROUP BY CASE country
        WHEN '中国'   THEN '亚洲'
        WHEN '印度'   THEN '亚洲'
        WHEN '日本'   THEN '亚洲'
        WHEN '美国'   THEN '北美洲'
        WHEN '加拿大'  THEN '北美洲'
        WHEN '墨西哥'  THEN '北美洲'
        ELSE '其他' 
        END;

#判断工资的等级，并统计每一等级的人数。
```
···
