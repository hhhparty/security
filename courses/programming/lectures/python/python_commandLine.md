# 命令行

## click

### Setuptools Integration
写命令行工具，最好把它们写成使用setuptools分发的模块。

原因有三：
- 传统方法（写```if __name__ == "__main__" ...```）的一个问题是，python解析器调用第一个模块会有不正确的名字，即不是其文件名而是```__main__```，这个问题看起来小，但实际上很大。
- 不是每个平台上都容易执行。Unix-like 系统下可以在首行增加```#!/usr/bin/env python```，但在windows上，需要环境变量中设置python解析器，并且关联后缀.py。
- 主要问题在于命令脚本是Python模块时有效。如果你的应用程序太大，你想开始使用一个包，你会遇到问题。

#### 将脚本与setuptools绑定

这个绑定需要此脚本为一个python package，而且有一个 setup.py 文件。

假如文件目录如下：
- yourscript.py
- setup.py


而yourscript.py内容如下：
```python
import click

@click.command()
def cli():
    """Example script."""
    click.echo('Hello World!')
```

setup.py内容如下：
```python
from setuptools import setup

setup(
    name='yourscript',
    version='0.1',
    py_modules=['yourscript'],
    install_requires=[
        'Click',
    ],
    entry_points='''
        [console_scripts]
        yourscript=yourscript:cli
    ''',
)
```

奇妙的地方在 ```entry_points```参数中。在```console_scripts```下面的每一行标识一个控制台脚本。“=”左边是要生成的脚本名字，右边是import 路径，“：”表示Click命令。

#### 测试脚本

为执行这个脚本，你要生成一个虚拟环境并安装你的package：
```shell
virtualenv venv
. venv/bin/activate
pip install --editable
```
之后，你的命令就可以用了，例如：
```
yourscript
Hellow World！
```

#### Packeges 中的脚本

如果你的脚本变大了，而且你想把这个脚本放到一个Python package中，所需的变化是很小的。假设目录结构如下：
```
yourpackage/
    __init__.py
    main.py
    utils.py
    scripts/
        __init__.py
        yourscript.py
```

在这里，setup.py中不再使用 py_modules， 你可以使用 packages 和setuptools的自动包发现功能。此外，推荐包含别的包数据。下面是修改setup.py后的例子。

```python
from setuptools import setup,find_packages

setup(
    name='yourpackage',
    version='0.1',
    packages=find_packages(),
    include_package_data=True,
    install_requires=[
        'Click',
    ],
    entry_points='''
        [console_scripts]
        yourscript=yourpackage.scripts.yourscript:cli
    ''',
)
```

#### 多命令

假设目录结构如下
```
clicktest\
    manage\
        manage.py
        __init__.py
        commands\
            __init__.py
            cmd_testa.py
            cmd_testb.py
    setup.py
```

命令cmd_testa与cmd_testb的脚本：
```python
# cmd_testa.py
from manage.manage import pass_environment
import click

@click.command("testa",short_help="Run test A")
@pass_environment
def cli(ctx):
    print("Run test A...")
    ctx.log("Run as testa")

```

```python
# cmd_testb.py
from manage.manage import pass_environment
import click

@click.command("testa",short_help="Run test B")
@pass_environment
def cli(ctx):
    print("Run test B...")
    ctx.log("Run as testb")

```

manage.py中建立命令发现与返回命令列表的自定义多命令集成类:
```python
# manage.py
import os
import click
import sys

CONTEXT_SETTINGS = dict(auto_envvar_prefix="MANAGE")

class Environment():
    def __init__(self):
        self.verbose = False
        self.home = os.getcwd()
    def log(self,msg,*args):
        """Logs a message to stderr."""
        if args:
            msg %= args
        click.echo(msg,file=sys.stderr)
        
    def vlog(self,msg,*args):
        """Logs a message to stderr if verbose is enabled."""
        if self.verbose:
            self.log(msg,*args)
            
pass_environment = click.make_pass_decorator(Environment,ensure=True)
cmd_folder = os.path.join(os.path.dirname(__file__), 'commands')

class AlphaCLI(click.MultiCommand):

    def list_commands(self, ctx):
        rv = []
        for filename in os.listdir(cmd_folder):
            if filename.endswith(".py") and filename.startswith("cmd_"):
                rv.append(filename[4:-3])
        rv.sort()
        return rv

    def get_command(self, ctx, name):
        try:
            mod = __import__("manage.commands.{}".format(name),None,None,["cli"])
        except ImportError:
            return None
        return mod.cli
            
  
@click.command(cls=AlphaCLI, context_settings=CONTEXT_SETTINGS)
@click.option("-v", "--verbose", is_flag=True, help="Enables verbose mode.")
@pass_environment
def cli(ctx, verbose):
    """HDH_ALPHA mangement command line interface."""
    ctx.verbose = verbose
    
```

在最外层建立setuptools型的安装文件setup.py
```python

# setup.py
from setuptools import setup,find_packages

setup(
    name = "manage",
    version="0.1",
    packages=find_packages(),
    include_package_data = True,
    install_requires = ["click"],
    entry_points="""
        [console_scripts]
        manage=manage.manage:cli
    """
)

```

安装与执行：
```shell
cd clicktest
pip install -e .

manage 
manage testa
```

