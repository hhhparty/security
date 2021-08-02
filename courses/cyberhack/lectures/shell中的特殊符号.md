# Linux Shell 中的特殊符号

## `#`

- `#`是注释作用;
- `#!` 后跟命令，一般放在文件头，表示该文件应当由何种命令解释执行，例如`#!/usr/bin/python`
- 在参数替换 `echo ${PATH#*:}` 这里不表示注释。
- 在$()中数制转换时, 不表示注释，例如 `echo $((2#101011))`

## `;`

命令行分隔符, 可以在一行中写多个命令. echo hello; echo there

## `;;`

终止 case 选项.

例如：
```shell
case “$variable” in
abc) echo “\$variable = abc”;;
xyz) echo “\$variable = xyz”;;
esac
```

## `.`
隐藏文件前缀
- `.` 命令等价于 `source`
- `. `表示当前目录 
- `..` 表示上一级目录
- 正则表达式中,`.`作为单个字符匹配

## `"`, `'`

- 双引号中可以引用变量, 而单引号中不行, 它们的作用是组织特殊字符.

## `\`

转义字符

## `/`

- 文件名分隔符
- 除法操作
 

## ` (即键盘 Esc 下边的特殊符号)

- 后置引用
- 命令替换

## `:`

- 空命令, 等价于 “NOP”
- 也可被认为是 shell 内建命令 true 作用相同, 例如: 死循环

```shell

while :
do
  echo ”1”
done
```
等价于：

```shell
while true
do
  echo “1”
done
```

- 在 if/then 语句中做占位符:
```shell
if condition
then :  # 什么都不做, 引出分支

else

  do other thing

fi
```
- 在一个 2 元命令中提供一个占位符.

- 在和 >(重定向操作符)一起使用时, 清空文件, 并没有修改文件的权限, 例如: (如果文件不存在, 将会创建文件) ，例如：`: > data.log` 等同于 `cat /dev/null > data.log`


## `!`

取反操作符 != 不等于

## `*`
- 万能匹配符, 正则表达式中
- 数学乘法
- `**` 幂运算

## `?`

- 测试操作
- 正则表达式中, `?` 匹配任意单个字符

## `$`

- 变量符号
- 正则表达式中 行结束符
- `${}` 参数替换
- `$*`,`$@` 位置参数
- `$?` 退出状态
- `$$` 进程ID

## `()`

- 命令组, (a=hello; echo $a), 在 () 中的命令列表将作为一个子 shell 来运行. 在() 中的变量, 由于在子shell中, 所以对于脚本剩下的部分是不可用的.
- 数组初始化: array=(element1, element2, element3)

## `{xxx,yyy,zzz}`

大括号扩展。例如 `cat {file1,file2,file3} > combined_file`, 将file1,file2,file3合并在一起并重定向到commbined_file中. 大括号中不能有空格.

## `{}`

- 代码块. 事实上, 这个结构创建了一个匿名的函数. 但是与函数不同的是, 在其中声明的变量, 对于脚本的其他部分的代码来说还是可见的.

```shell
# 代码块中的内容, 外部访问, I/O重定向
   1:  #!/bin/bash
   2:  
   3:  File=/etc/fstab
   4:  
   5:  # 在这个代码块中的变量, 外部也可以访问
   6:  {
   7:  read line1
   8:  read line2
   9:  } < $File
  10:  
  11:  echo "First line in $File is"
  12:  echo "$line1"
  13:  echo
  14:  echo "Second line in $File is"
  15:  echo "$line2"
  16:  
  17:  exit 0
# 将一个代码块的结果保存到文件
```

 
## `{}\;`

- 路径名, 一般都是在 find 命令中使用, 注意; 用来结束find 命令序列的 –exec

## `[]`

- 数组元素, 例如 array[1]=abc
- 字符范围, 在正则表达式中使用

## `[[]]`

- 表达式本身放在 [] 里
 

## `(())`

数学计算扩展

## 重定向符 `>&`  `>>&` `>>`  `<`

- `scriptname > filename ` 重定向脚本的输出到文件中, 覆盖原有内容
- `command &> filename` 重定向 stdout 和 stderr 到文件中
- `command >&2` 重定向 stdout 和 stderr
- `scriptname >> filename` 重定向脚本输出到文件中, 添加到文件尾端, 如果没有文件, 则创建这个文件.

## `<<` `<<<`

重定向
- `<<` 用在“here document”,
- `<<<` 用在“here string”

### Here Document

Shell 有一种特殊形式的重定向叫做“Here Document”，目前没有统一的翻译，你可以将它理解为“嵌入文档”“内嵌文档”“立即文档”。

所谓文档，就是命令需要处理的数据或者字符串；所谓嵌入，就是把数据和代码放在一起，而不是分开存放（比如将数据放在一个单独的文件中）。有时候命令需要处理的数据量很小，将它放在一个单独的文件中有点“大动干戈”，不如直接放在代码中来得方便。

Here Document 的基本用法为：
```
command <<END
    document
END
```
command是 Shell 命令，```<<END```是开始标志，```END```是结束标志，document是输入的文档（也就是一行一行的字符串）。

这种写法告诉 Shell 把 document 部分作为命令需要处理的数据，直到遇见终止符`END`为止（终止符`END`不会被读取）。

注意，终止符`END`必须独占一行，并且要定顶格写。

分界符（终止符）可以是任意的字符串，由用户自己定义，比如 `END`、`MARKER` 等。分界符可以出现在正常的数据流中，只要它不是顶格写的独立的一行，就不会被作为结束标志。

【实例1】cat 命令一般是从文件中读取内容，并将内容输出到显示器上，借助 Here Document，cat 命令可以从键盘上读取内容。

```shell
[mozhiyan@localhost ~]$ cat <<END
> Shell教程
> http://c.biancheng.net/shell/
> 已经进行了三次改版
> END

#下面是执行结果
Shell教程
http://c.biancheng.net/shell/
已经进行了三次改版
<是第二层命令提示符。
```

正文中也可以出现结束标志END，只要它不是独立的一行，并且不顶格写，就没问题。
```shell
[mozhiyan@localhost ~]$ cat <<END
> END可以出现在行首
> 出现在行尾的END
> 出现在中间的END也是允许的
> END

#下面是结果
END可以出现在行首
出现在行尾的END
出现在中间的END也是允许的
```

【实例2】在脚本文件中使用 Here Document，并将 document 中的内容转换为大写。
```shell
#!/bin/bash
#在脚本文件中使用立即文档
tr a-z A-Z <<END
one two three
Here Document
END
```

将代码保存到 test.sh 并运行，结果为：
ONE TWO THREE
HERE DOCUMENT
忽略命令替换

默认情况下，正文中出现的变量和命令也会被求值或运行，Shell 会先将它们替换以后再交给 command，请看下面的例子：
```shell
[mozhiyan@localhost ~]$ name=C语言中文网
[mozhiyan@localhost ~]$ url=http://c.biancheng.net
[mozhiyan@localhost ~]$ age=7
[mozhiyan@localhost ~]$ cat <<END
> ${name}已经${age}岁了，它的网址是 ${url}
> END
```
结果如下：
C语言中文网已经7岁了，它的网址是 http://c.biancheng.net

你可以将分界符用单引号或者双引号包围起来使 Shell 替换失效：
```shell
[mozhiyan@localhost ~]$ name=C语言中文网
[mozhiyan@localhost ~]$ url=http://c.biancheng.net
[mozhiyan@localhost ~]$ age=7
[mozhiyan@localhost ~]$ cat <<'END'  #使用单引号包围
> ${name}已经${age}岁了，它的网址是 ${url}
> END
${name}已经${age}岁了，它的网址是 ${url}
忽略制表符
默认情况下，行首的制表符也被当做正文的一部分。
#!/bin/bash
cat <<END
    Shell教程
    http://c.biancheng.net/shell/
    已经进行了三次改版
END
```

将代码保存到 test.sh 并运行，结果如下：
    Shell教程
    http://c.biancheng.net/shell/
    已经进行了三次改版

这里的制表符仅仅是为了格式对齐，我们并不希望它作为正文的一部分，为了达到这个目的，你可以在`<<`和`END`之间增加`-`，请看下面的代码：

```shell
#!/bin/bash
#增加了减号-
cat <<-END
    Shell教程
    http://c.biancheng.net/shell/
    已经进行了三次改版
END
```

这次的运行结果为：
Shell教程
http://c.biancheng.net/shell/
已经进行了三次改版

### Here String 
Here String 是 Here Document 的一个变种，它的用法如下：
`command <<< string`

command 是 Shell 命令，string 是字符串（它只是一个普通的字符串，并没有什么特别之处）。

这种写法告诉 Shell 把 string 部分作为命令需要处理的数据。例如，将小写字符串转换为大写：
`[mozhiyan@localhost ~]$ tr a-z A-Z <<< one`

结果为：`ONE`

Here String 对于这种发送较短的数据到进程是非常方便的，它比 Here Document 更加简洁。

一个单词不需要使用引号包围，但如果 string 中带有空格，则必须使用双引号或者单引号包围，如下所示：
```shell
[mozhiyan@localhost ~]$ tr a-z A-Z <<< "one two three"
ONE TWO THREE
```

双引号和单引号是有区别的，双引号会解析其中的变量（当然不写引号也会解析），单引号不会，请看下面的代码：
```shell
[mozhiyan@localhost ~]$ var=two
[mozhiyan@localhost ~]$ tr a-z A-Z <<<"one $var there"
ONE TWO THERE
[mozhiyan@localhost ~]$ tr a-z A-Z <<<'one $var there'
ONE $VAR THERE
[mozhiyan@localhost ~]$ tr a-z A-Z <<<one${var}there
ONETWOTHERE
```

有了引号的包围，Here String 还可以接收多行字符串作为命令的输入，如下所示：
```shell
[mozhiyan@localhost ~]$ tr a-z A-Z <<<"one two there
> four five six
> seven eight"
ONE TWO THERE
FOUR FIVE SIX
SEVEN EIGHT
```

## `\<`, `\>`

正则表达式中的单词边界 `grep ‘\<the\>' testfile`

## `|`

管道, 分析前边命令的输出, 并将输出作为后边命令的输入

## `>|`

强制重定向

##  `||`

逻辑或

## `&`

- 后台运行命令, 一个命令后边跟一个`&`, 将表示在后台运行

```shell
   1:  #!/bin/bash
   2:  
   3:  for i in 1 2 3 4 5 6 7 8 9 10
   4:  do
   5:      echo -n "$i"
   6:  done&
```

注意, for 循环的最后一个 done&
## `&&`

逻辑与