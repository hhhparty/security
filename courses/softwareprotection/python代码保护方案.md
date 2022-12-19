# Python 代码保护方案

Python 代码的动态特性、开源特性，使得Python 代码很难做到很好的加密保护。保护手段可以通过法律和技术两方面展开。

## 法律保护

可以声明保留所有权利。即 All rights reserved.

也可以考虑使用开源协议 ，例如AGPL，基本上AGPL是限制最严的开源软件协议。

GPL：通用性公开许可证(General Public License，简称GPL)
规定：始终开放源代码，使用GPL协议程序的程序必须遵循GPL协议，即A包含或调用B，如果B为GPL协议，则A发布时也必须为GPL协议（强调A发布）
适用：GPL是针对传统的软件分发模式的商业模式(以微软为代表)
缺点：互联网公司（网络服务）则不受到影响（因为不发布软件就不用受到GPL限制，所以AGPL来了）

AGPL：Affero 通用公共许可协议
始终开放源代码，向社区提交修改
GPL加强版：最典型的例子就是一个Web应用程序如果使用了AGPL许可证，那么运行这个Web应用程序或其派生作品供他人访问时就需要以AGPL发布其源代码，除非购买商业许可。

## 技术保护

常见的保护方案：
- 发行 .pyc 文件，即编译后的二进制文件
- 代码混淆
- 使用py2exe
- 使用cython

### 发行 .pyc 文件

.pyc 文件是二机制的，不能直接看到源代码。

使用python 标准库 compileall 可以对src目录下所有文件进行编译为.pyc 文件。



基本步骤如下：
- 完成软件编写和测试，并把所有python源代码集中到src目录下
- 使用`python -m compileall <src路径>` 编译所有源代码
- 删除所有.py文件 `find <src path> -name '*.py' -type f -print -exec rm {} \;`
- 对项目包进行打包。

#### 特点
- 简单方便，提高了一点源码破解门槛；
- 平台兼容性好，.py 能在哪里运行，.pyc 就能在哪里运行。
- 解释器兼容性差，.pyc 只能在特定版本的解释器上运行；
- 有现成的反编译工具，破解成本低。python-uncompyle6 就是这样一款反编译工具，效果出众。

执行如下命令，即可将 .pyc 文件反编译为 .py 文件：

`$ uncompyle6 *compiled-python-file-pyc-or-pyo*`
### 代码混淆
基本思想：将源代码混淆到作者看着费劲的程度。

基本手段：
- 移除注释、文档
- 改变缩紧
- token中加入空格
- 重命名函数、类、变量
- 空白行加入无效代码

#### 方法一 使用oxyry进行混淆
pyob.oxyry.com在线混淆网站。

```py

# coding: utf-8class A(object):
    """    Description    """

    def __init__(self, x, y, default=None):
        self.z = x + y
        self.default = default

    def name(self):
        return 'No Name'def always():
    return Truenum = 1a = A(num, 999, 100)a.name()always()
```
混淆后：
```py
class A (object ):#line:4
    ""#line:7
    def __init__ (O0O0O0OO00OO000O0 ,OO0O0OOOO0000O0OO ,OO0OO00O00OO00OOO ,OO000OOO0O000OOO0 =None ):#line:9
        O0O0O0OO00OO000O0 .z =OO0O0OOOO0000O0OO +OO0OO00O00OO00OOO #line:10
        O0O0O0OO00OO000O0 .default =OO000OOO0O000OOO0 #line:11
    def name (O000O0O0O00O0O0OO ):#line:13
        return 'No Name'#line:14def always ():#line:17
    return True #line:18num =1 #line:21a =A (num ,999 ,100 )#line:22a .name ()#line:23always ()
```

混淆后的代码主要在注释、参数名称和空格上做了些调整，稍微带来了点阅读上的障碍。

#### 方法二：使用 pyobfuscate 库进行混淆

pyobfuscate 算是一个颇具年头的 Python 代码混淆库了，但却是“老当益壮”了。

对上述同样一段 Python 代码，经 pyobfuscate 混淆后效果如下：

```py
# coding: utf-8if 64 - 64: i11iIiiIiiif 65 - 65: O0 / iIii1I11I1II1 % OoooooooOO - i1IIiclass o0OO00 ( object ) :
 if 78 - 78: i11i . oOooOoO0Oo0O
 if 10 - 10: IIiI1I11i11
 if 54 - 54: i11iIi1 - oOo0O0Ooo
 if 2 - 2: o0 * i1 * ii1IiI1i % OOooOOo / I11i / Ii1I
 def __init__ ( self , x , y , default = None ) :
  self . z = x + y
  self . default = default
  if 48 - 48: iII111i % IiII + I1Ii111 / ooOoO0o * Ii1I
 def name ( self ) :
  return 'No Name'
  if 46 - 46: ooOoO0o * I11i - OoooooooOO
  if 30 - 30: o0 - O0 % o0 - OoooooooOO * O0 * OoooooooOOdef Oo0o ( ) :
 return True
 if 60 - 60: i1 + I1Ii111 - I11i / i1IIi
 if 40 - 40: oOooOoO0Oo0O / O0 % ooOoO0o + O0 * i1IIiI1Ii11I1Ii1i = 1Ooo = o0OO00 ( I1Ii11I1Ii1i , 999 , 100 )Ooo . name ( )Oo0o ( ) # dd678faae9ac167bc83abf78e5cb2f3f0688d3a3
```
相比于方法一，方法二的效果看起来更好些。除了类和函数进行了重命名、加入了一些空格，最明显的是插入了若干段无关的代码，变得更加难读了。

#### 特点

简单方便，提高了一点源码破解门槛；
兼容性好，只要源码逻辑能做到兼容，混淆代码亦能。
不足
只能对单个文件混淆，无法做到多个互相有联系的源码文件的联动混淆；
代码结构未发生变化，也能获取字节码，破解难度不大。


#### 方法3 使用pyarmor

？？


### 使用py2exe

py2exe 将python脚本转化为windows 可执行程序。原理是将源代码编译为.pyc，加上必要依赖，一起打包为可执行程序。最终发行为py2exe打包出的二机制文件。

方法步骤：
- 编写入口文件，例如一个helloworld.py
- 编写setup.py ，例如
```py
from distutils.core import setupimport py2exesetup(console=['hello.py'])
```
- 生成可执行文件 `python setup.py py2exe`

#### 特点

能够直接打包成 exe，方便分发和执行；
破解门槛比 .pyc 更高一些。

兼容性差，只能运行在 Windows 系统上；
生成的可执行文件内的布局是明确、公开的，可以找到源码对应的 .pyc 文件，进而反编译出源码。
### 使用cython

Cython 的主要目的是带来性能的提升，但是基于它的原理：将 .py/.pyx 编译为 .c 文件，再将 .c 文件编译为 .so(Unix) 或 .pyd(Windows)，其带来的另一个好处就是难以破解。

方法：
- 编写源文件，例如helloworld.py
- 编写setup.py

```py
from distutils.core import setupfrom Cython.Build import cythonizesetup(name='Hello World app',
     ext_modules=cythonize('hello.pyx'))
```
- 编译为 .c 再编译为.so或.pyd

`python setup.py build_ext --inplace`

执行 python -c "from hello import hello;hello()" 即可直接引用生成的二进制文件中的 hello() 函数。

#### 特点

生成的二进制 .so 或 .pyd 文件难以破解；
同时带来了性能提升。

兼容性稍差，对于不同版本的操作系统，可能需要重新编译；
虽然支持大多数 Python 代码，但如果一旦发现部分代码不支持，完善成本较高。

### 加密源代码并禁止生产pyc
:question:
TODO Lists：
- [x] 今天做的
- [ ] 明天做的

这个方法在于修改解释器，在其中加入密码计算方法。然后对发布版本进行加密。

参考：
- https://dev.to/richard_scott/encryption-for-protecting-python-source-code-4ckg

- https://mp.weixin.qq.com/s/EU-jv8Vq4Ntua4CJdWYvMQ