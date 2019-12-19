# 0x2一小时Python编程入门（科学计算方向）

## 引言


计算机世界是一个神奇的世界！**她将一堆电路和一堆代码结合起来，极大丰富了人类的信息世界**，到目前为止仍在像宇宙大爆炸一样，不断地扩展着。

人们想进入或操纵这个计算机世界的各种器件，需要掌握一些工具，例如：键盘、鼠标，更为重要的是计算机编程语言。这就像人类的语言奠定了人类世界产生和文明发展的基础一样，计算机编程语言为计算机世界奠定了基础。

与人类语言的多样性类似，计算机编程语言也有很多种,目前最为流行的语言有Java、C、C++、Python等。

![2018年流行的计算机编程语言](images\0x00pythonbase\plwordscloud.jpg)

## Python简介

Python是著名的“龟叔”Guido van Rossum在1989年圣诞节期间，为了打发无聊的圣诞节而编写的一个编程语言。

过去10年中，Python在TIOBE排行榜上的热度不断上升。

![2018年TIOBE编程社区热度](images\0x00pythonbase\2018TIOBEcommunityindex.png)

数据来源：https://www.tiobe.com/tiobe-index/

### Python 语言的优点

Python: A programming language changes the world.
- Python与C或Java对比，有很好的的编程\部署、维护等方面的时间效率；
  + Python被称为：The PL of the Agile Era;
  + Less code means fewer errors, meaning the cost of identifying and eliminating these errors is also reduced.
  + 各种各样、成百上千的支持库提供了高质量的代码，这些代码可以简单的整合在一起，满足各种需求。
  + 非常完善的基础代码库，覆盖了网络、文件、GUI、数据库、文本等大量内容。
  + Python哲学：“优雅”、“明确”、“简单”,尽量写容易看明白的代码，尽量写少的代码

- Python是一种胶水语言；
  + 既可以整合自己的库，还可以使用其它语言的代码；
  + Python程序可以在任何安装了Python解释器的操作系统上；
  
- Python在各行业获得了巨大成功；
  + 过去20年，Python在工业、服务业、科学计算、大数据、机器学习等领域有长足发展；
  + 积极使用Python 的公司有Mozilla、Google、YouTube、Instagram、豆瓣、NASA...

### Python 语言的缺点

- 运行速度较慢；
- 代码不能加密。（不要高估自己写的代码真的有非常大的“商业价值”，大公司不愿意开源的普遍原因是代码质量较差。）
  
## Python解释器的安装

要开始学习Python编程，首先就得把Python解释器安装到你的电脑里。安装后Python解释器负责运行Python程序，它还是一个命令行交互环境、一个简单的集成开发环境。

安装介质的下载站点是：https://www.python.org/downloads/

- 在Mac上安装Python

如果你正在使用Mac，系统是OS X>=10.9，那么系统自带的Python版本是2.7。要安装最新的Python 3.7，可以从Python官网下载Python 3.7的安装程序，双击运行并安装；

- 在Linux上安装Python

如果你正在使用Linux，系统通常自带Python2.7以上版本；假定你有Linux系统管理经验，自行安装Python 3应该没有问题。

- 在Windows上安装Python

首先，根据你的Windows版本（64位还是32位）从Python的官方网站下载Python 3.x对应的安装程序；其次，请运行下载的EXE安装包，按提示完成安装过程。


## Python学习路线（面向机器学习基础）

有关Python的教程和书籍很多，难度都不大，但完整的学习周期大约要20-40学时。

对于有一定编程基础的同学，如何在1个小时内入门Python呢？

### 选择关键内容：
1. Python中的数据类型
  - 基础类型、列表、字典、集合、字符串  
2. Python中的运算符
3. Python中的控制流
4. Python中的函数
5. Python中的类
6. Python中的生成器
7. Python中的包装器

### 选择简易工具：

1. IPython
  - console、debugger、command line
2. Jupyter notebook


```python
# 第一个程序
"""先来一个
hello
world
"""
print("Hello World!")
```

    Hello World!
    


```python
name = input("请输入姓名：")

print("%s 同学，人生苦短，快用Python！" % name)
#另一种输出方式
print("{} 同学，人生苦短，快用Python！".format(name))
```

    请输入姓名：王大雷
    王大雷 同学，人生苦短，快用Python！
    王大雷 同学，人生苦短，快用Python！
    

## Python基本数据类型

下面用实例介绍Python中的：整数、浮点数、指数、复数、布尔值、字符串等基本类型。


```python
"""Python中的基本数据类型"""
a = 2           # integer
b = 5.0         # float
c = 8.3e5       # exponential
d = 1.5 + 0.5j  # complex
e = 4 > 5       # boolean
f = 'word'      # string

print(" a=%d,\n b=%.2f,\n c=%.3e,\n d=%r, \n e=%s,\n f=%10s" % (a,b,c,d,e,f))
#另一种输出方式
print(" a={},b={},c={},d={},e={},f={}".format(a,b,c,d,e,f))
```

结果如下：
```
a=2,
b=5.00,
c=8.300e+05,
d=(1.5+0.5j), 
e=False,
f=      word
a=2,b=5.0,c=830000.0,d=(1.5+0.5j),e=False,f=word
```    

## Python中的序列

序列是Python中最基本的数据结构。Python序列为其中的每个元素都分配一个数字 ——即它的位置，或索引，第一个索引是0，第二个索引是1，依此类推。我们可以使用索引引用数据。

Python有6个序列的内置类型，其中最常见的是列表、字典、元组、集合等。

序列都可以进行的操作包括索引，切片，加，乘，检查成员。此外，Python已经内置确定序列的长度以及确定最大和最小的元素的方法。这些操作非常有用，是今后我们使用Python时最常见的操作。


### 列表

列表是最常用的Python数据类型，它可以作为一个方括号内的逗号分隔值出现。

注意：列表的数据项不需要具有相同的类型。

下面举例说明列表的定义与使用：


```python
"""Python中列表的定义与使用"""
a = ['red', 'blue', 'green',]       # 定义列表a，并初始化a
print("a={}".format(a))
print(a[1:3])                      # 利用索引，进行切片
b = list(range(5))                 # 定义列表b, 并使用迭代器方法range() 初始化b
print("b={}".format(b))
a.append('yellow')                 # 使用append方法，在列表a中增加一个字符串
print("a={}".format( a))         

a.extend(b)                        # 将列表b，追加到列表a后面
print("a={}".format( a) )  
a.insert(1, 'yellow')              # 在指定位置插入新元素（成员）
print("a={}".format( a) )  

d = a.pop(2)  # 从列表中删除指定位置的元素（缺省时指最后）
print(d)
```

结果如下：
```

    a=['red', 'blue', 'green']
    ['blue', 'green']
    b=[0, 1, 2, 3, 4]
    a=['red', 'blue', 'green', 'yellow']
    a=['red', 'blue', 'green', 'yellow', 0, 1, 2, 3, 4]
    a=['red', 'yellow', 'blue', 'green', 'yellow', 0, 1, 2, 3, 4]
    
    'blue'
```

再举一个例子：

```python
b = list(range(5))   
c = [x**2 for x in b]            # 列表推导list comprehension
print("c={}".format(c))
d = [nu**2 for nu in b if nu < 3]  # 条件列表推导 conditioned list comprehension
print("d={}".format(d))
e = c[0]                           # 访问元素access element
print("e={}".format(e))
f = c[1:2]                         # 访问列表的一个切片 access a slice of the list
print("f={}".format(f))
g = c[-1]                          # 访问最后一个元素access last element
print("g={}".format(g))
h = ['re', 'bl'] + ['gr']          # 列表连接list concatenation
print("h={}".format(h))
i = ['re'] * 5                     # 生成一个内部元素全部相同的列表repeat a list
print("i={}".format(i))
j = ['re', 'bl'].index('re')       # 返回列表元素的索引returns index of 're'
print("j={}".format(j))
```

结果如下：
```
    c=[0, 1, 4, 9, 16]
    d=[0, 1, 4]
    e=0
    f=[1]
    g=16
    h=['re', 'bl', 'gr']
    i=['re', 're', 're', 're', 're']
    j=0
```    

再举一个例子：

```python
print(  're' in ['re', 'bl']  )    # 判断元素是否包含在列表中，true if 're' in list
print( 'fi' not in ['re', 'bl'] )  # 判断元素是否不包含在列表中，true if 'fi' not in list
s = sorted([3, 2,4,5, 1])
print(s)                           # 对列表进行排序returns sorted list
```

结果如下：
```

    True
    True
    [1, 2, 3, 4, 5]
```  

### 字典

字典是另一种可变容器模型，且可存储任意类型对象。

字典的每个键值(key=>value)对用冒号(:)分割，每个对之间用逗号(,)分割，整个字典包括在花括号({})中。

下面举例说明：


```python
"""Python中字典的定义与使用"""
a = {'red': 'rouge', 'blue': 'bleu'}         # 定义字典dictionary
b = a['red']                                 # 根据键值，获取内容translate item
print('red' in a)                                   # 若键在字典中，则返回True。true if dictionary a contains key 'red')
c = [value for key, value in a.items()]      # 循环获取字典中的全部内容loop through contents
print("c={}".format(c))
d = a.get('red')
d = a.get('yellow', 'no translation found')  # 返回键yellow指定的内容，若不存在则返回默认的内容return default
print("d={}".format(d))
a.setdefault('extra', []).append('cyan')     # 以默认值初始化新增键的内容 init key with default
print("a={}".format(a))
a.update({'green': 'vert', 'brown': 'brun'}) # 将另一个字典追加到字典a后面update dictionary by data from another one
print("a={}".format(a))
print( a.keys() )                            # 以列表形式返回所有的键 get list of keys
print( a.values() )                          # 以列表形式返回所有内容 get list of values

print( a.items() )                           # 以列表形式返回所有键和内容组成的元组 get list of key-value pairs
del a['red']                                 # 删除字典a中键red和相关联内容 delete key and associated with it value
print("a={}".format(a))
a.pop('blue')                                # 删除指定键并返回对应内容remove specified key and return the corresponding value
print("a={}".format(a))
```
结果如下：
```
    c=['rouge', 'bleu']
    d=no translation found
    a={'red': 'rouge', 'blue': 'bleu', 'extra': ['cyan']}
    a={'red': 'rouge', 'blue': 'bleu', 'extra': ['cyan'], 'green': 'vert', 'brown': 'brun'}
    dict_keys(['red', 'blue', 'extra', 'green', 'brown'])
    dict_values(['rouge', 'bleu', ['cyan'], 'vert', 'brun'])
    dict_items([('red', 'rouge'), ('blue', 'bleu'), ('extra', ['cyan']), ('green', 'vert'), ('brown', 'brun')])
    a={'blue': 'bleu', 'extra': ['cyan'], 'green': 'vert', 'brown': 'brun'}
    a={'extra': ['cyan'], 'green': 'vert', 'brown': 'brun'}
```  

### 元组

Python 的元组与列表类似，不同之处在于元组的元素不能修改。

元组使用小括号，列表使用方括号。

元组创建很简单，只需要在括号中添加元素，并使用逗号隔开即可。下面举例说明：


```python
"""Python中元组的定义与使用"""

tup1 = ('Google', 'Runoob', 1997, 2000)  # 定义元组
tup2 = (1, 2, 3, 4, 5 )
tup3 = "a", "b", "c", "d"   #  不需要括号也可以定义元组
print("tup1={}".format(tup1))
print("tup2={}".format(tup2))
print("tup3={}".format(tup3))
```
结果如下：
```
    tup1=('Google', 'Runoob', 1997, 2000)
    tup2=(1, 2, 3, 4, 5)
    tup3=('a', 'b', 'c', 'd')
```   

### 集合

集合（set）是一个无序的不重复元素序列。

可以使用大括号 { } 或者 set() 函数创建集合，注意：创建一个空集合必须用 set() 而不是 { }，因为 { } 是用来创建一个空字典。


```python
"""Python中集合的定义与使用"""

a = {1, 2, 3}                                # 初始化一个集合 initialize manually
print("a={}".format(a))
d = {1,1,1,1}
print(d)
b = set(range(5))                            # 使用迭代器生成集合 initialize from iteratable
print("b={}".format(b))
a.add(13)                                    # 向集合中增加元素add new element to set
print("a={}".format(a))
a.discard(13)                                # 从集合中删除元素 discard element from set
print("a={}".format(a))
a.update([21, 22,22, 23])                       # 向集合追加元素 update set with elements from iterable
print("a={}".format(a))
a.pop()                                      # 删除并返回任一个集合元素 remove and return an arbitrary set element
print("a={}".format(a))
2 in {1, 2, 3}                               # 若2在集合中，则返回True 。true if 2 in set
5 not in {1, 2, 3}                           # 若5不在集合中，则返回True。true if 5 not in set
print("a={}".format(a))
print("b={}".format(b))
print("a.issubset(b) = {}".format(a.issubset(b)))   # 测试集合a是否为集合b的子集 test whether every element in a is in b

print("a <= b 的结果：{}".format(a <= b))    # 使用 <= 判断a是否为b的子集
print("a.issuperset(b) = {}".format( a.issuperset(b) ))  # 测试集合a是否为集合b的超集
print("a >=  b 的结果：{}".format(a >= b))   # 使用 <= 判断a是否为b的超集
print("a.intersection(b)的结果：{}".format(a.intersection(b))) # 返回集合a与b的交集 return the intersection of two sets as a new set
print("a.difference(b)的结果：{}".format(a.difference(b)))     # 返回集合a-集合b，即a与b的差集。 return the difference of two or more sets as a new set
print("a - b 的结果：{}".format(a - b))      # difference in operator form
print("a.symmetric_difference(b) 的结果：{} ".format(a.symmetric_difference(b)))  # return the symmetric difference of two sets as a new set
print("a.union(b) 的结果：{} ".format(a.union(b)))         # 返回集合a与b的并集 return the union of sets as a new set
c = frozenset([1, 2, 3]) 
print("c ：{} ".format( c))  # 返回一个元素不可改变的集合 the same as set but immutable
c.add(4) 
```

结果如下：
```
    a={1, 2, 3}
    {1}
    b={0, 1, 2, 3, 4}
    a={1, 2, 3, 13}
    a={1, 2, 3}
    a={1, 2, 3, 21, 22, 23}
    a={2, 3, 21, 22, 23}
    a={2, 3, 21, 22, 23}
    b={0, 1, 2, 3, 4}
    a.issubset(b) = False
    a <= b 的结果：False
    a.issuperset(b) = False
    a >=  b 的结果：False
    a.intersection(b)的结果：{2, 3}
    a.difference(b)的结果：{21, 22, 23}
    a - b 的结果：{21, 22, 23}
    a.symmetric_difference(b) 的结果：{0, 1, 4, 21, 22, 23} 
    a.union(b) 的结果：{0, 1, 2, 3, 4, 21, 22, 23} 
    c ：frozenset({1, 2, 3}) 
    

```

### 字符串

字符串是 Python 中最常用的数据类型。我们可以使用引号( ' 或 " )来创建字符串。

创建字符串很简单，只要为变量分配一个值即可。


```python
"""Python中字符串的定义与使用
"""

a = 'red'                      # 定义一个字符串对象 assignment
print("a的内容：{}".format(a))
char = a[2]                    # 使用index访问单独字符access individual characters
print("char的内容：{}".format(char))
'red ' + 'blue'                # 字符串连接 string concatenation
print("'red ' + 'blue' ：{}".format('red ' + 'blue' ))
'1, 2, three'.split(',')       # 使用，对字符串进行切片。split string into list
print("'1, 2, three'.split(',') 的结果 ：{}".format('1, 2, three'.split(',')  ))
'.'.join(['1', '2', 'three'])  # 使用.作为连接符，将一个列表拼接为一个字符串 concatenate list into string
print("'.'.join(['1', '2', 'three'])的结果 ：{}".format('.'.join(['1', '2', 'three'])))
```

结果如下：
```
    a的内容：red
    char的内容：d
    'red ' + 'blue' ：red blue
    '1, 2, three'.split(',') 的结果 ：['1', ' 2', ' three']
    '.'.join(['1', '2', 'three'])的结果 ：1.2.three
```    

## Python的运算符

Python语言支持以下类型的运算符:

- 算术运算符
- 比较（关系）运算符
- 赋值运算符
- 逻辑运算符
- 位运算符
- 成员运算符
- 身份运算符
- 运算符优先级

下面举例说明：


```python
"""Python中的运算符"""

a = 2             # 定义与赋值assignment
a += 1            # 自增change and assign，类似的还有 (*=, /=)  
3 + 2             # addition
3 / 2             # integer (python2) or float (python3) division
3 // 2            # integer division
3 * 2             # multiplication
3 ** 2            # exponent
3 % 2             # remainder
abs(a)            # absolute value
1 == 1            # equal
2 > 1             # larger
2 < 1             # smaller
1 != 2            # not equal
1 != 2 and 2 < 3  # logical AND
1 != 2 or 2 < 3   # logical OR
not 1 == 2        # logical NOT
c = []
'a' in c          # test if a is in b
a is b            # test if objects point to the same memory (id)
```

结果如下：
```
    False
```


## Python的控制流

有3种控制流：顺序、选择、循环。这三种控制方式的复合，能够实现各种程序执行过程。


### Python中的选择控制


```python
"""Python中的选择控制流"""

# if/elif/else
a, b = 1, 2
if a + b == 3:
    print('True')
elif a + b > 1:
    print('False')
else:
    print('?')
```
结果如下：
```
    True
```   

### Python中的 for 循环控制


```python
"""Python中的 for 循环控制流"""

a = ['red', 'blue', 'green']
for color in a:
    print(color)

```

结果如下：
```
    red
    blue
    green
```    

### Python中的 while 循环控制


```python
"""Python中的 while 循环控制流"""
number = 1
while number < 10:
    print(number)
    number += 1

# break
number = 1
while True:
    print(number)
    number += 1
    if number > 10:
        break
```

结果如下：
```
    1
    2
    3
    4
    5
    6
    7
    8
    9
    1
    2
    3
    4
    5
    6
    7
    8
    9
    10
```   

### Python循环控制的中止


```python
# continue
for i in range(20):
    if i % 2 == 0:
        continue # break
    print(i)
```

结果如下：
```
    1
    3
    5
    7
    9
    11
    13
    15
    17
    19
```   

## Python中的函数

函数是组织好的，可重复使用的，用来实现单一，或相关联功能的代码段。

函数能提高应用的模块性，和代码的重复利用率。Python本身提供了许多内建函数，比如print()。

我们呢也可以自己创建函数，这被叫做用户自定义函数。


```python
"""Python中的函数"""

def myfunc(a1, a2):
    return a1 + a2

x = myfunc(10, 22)
print(x)
```

结果如下：
```
    32
```    

## Python中的类

类(Class)是一个面向对象概念，用来描述具有相同的属性和方法的对象的集合。它定义了该集合中每个对象所共有的属性和方法。对象是类的实例。

类中定义的函数，被称为类的**方法**；
类中定义的变量，被称为**类的属性或类变量**；
通过类定义的数据结构实例，被称为某类的**对象或实例**；


```python
"""Python中的类"""

class Point(object):
    def __init__(self, x):
        self.x = x
    def __call__(self):
        print(self.x)

x = Point(3)
```

## Python中的生成器

在 Python 中，使用了 yield 的函数被称为生成器（generator）。

跟普通函数不同的是，生成器是一个返回迭代器的函数，只能用于迭代操作，更简单点理解生成器就是一个迭代器。

在调用生成器运行的过程中，每次遇到 yield 时函数会暂停并保存当前所有的运行信息，返回 yield 的值, 并在下一次执行 next() 方法时从当前位置继续运行。

调用一个生成器函数，返回的是一个迭代器对象。


```python
"""Python中的生成器"""

def firstn(n):
    num = 0
    while num < n:
        yield num
        num += 1

x = [i for i in firstn(10)]
```

## Python中的装饰器（decorator）

假设我们要增强某个函数的功能，但又不修改原先函数的定义，这种在运行时动态增加功能的方式，称之为“装饰器”（Decorator）。

本质上，decorator就是一个返回函数的高阶函数。


```python
class myDecorator(object):
    def __init__(self, f):
        self.f = f
    def __call__(self):
        print("call")
        self.f()

@myDecorator
def my_funct():
    print('func')

my_funct()
```
结果如下：
```
    call
    func
```  

## IPython编程工具

IPython 是一个 python 的交互式 shell，比默认的python shell 好用得多，支持变量自动补全，自动缩进，支持 bash shell 命令，内置了许多很有用的功能和函数。

###  控制台命令（console）



```python
<object>?                   # Information about the object
<object>.<TAB>              # tab completion

# run scripts / profile / debug
%run myscript.py

%timeit range(1000)         # measure runtime of statement
%run -t  myscript.py        # measure script execution time

%prun <statement>           # run statement with profiler
%prun -s <key> <statement>  # sort by key, e.g. "cumulative" or "calls"
%run -p  myfile.py          # profile script

%run -d myscript.py         # run script in debug mode
%debug                      # jumps to the debugger after an exception
%pdb                        # run debugger automatically on exception

# examine history
%history
%history ~1/1-5  # lines 1-5 of last session

# run shell commands
!make  # prefix command with "!"

# clean namespace
%reset

# run code from clipboard
%paste
```

结果如下：
```
      File "<ipython-input-45-466d566329cd>", line 1
        <object>?                   # Information about the object
        ^
    SyntaxError: invalid syntax
```  


### debugger命令


```python

n               # execute next line
b 42            # set breakpoint in the main file at line 42
b myfile.py:42  # set breakpoint in 'myfile.py' at line 42
c               # continue execution
l               # show current position in the code
p data          # print the 'data' variable
pp data         # pretty print the 'data' variable
s               # step into subroutine
a               # print arguments that a function received
pp locals()     # show all variables in local scope
pp globals()    # show all variables in global scope
```

### command line命令


```python
ipython --pdb -- myscript.py argument1 --option1  # debug after exception
ipython -i -- myscript.py argument1 --option1     # console after finish
```
