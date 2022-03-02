# Jinja 2 

Jinja 是一种快速、可表达、可扩展的模版引擎。模版中的特殊占位符使用近python风格编写。然后将数据传递给模版，完成最终的渲染。

## Jinja API

### 基本概念

这里介绍几个最基本的API：
- `Environment()`
- `render()`
- `get_template()`

Jinja使用一个中央话的对象，称为模版 Enviroment。这个类的实例用于存储配置和全局对象。这些对象被用于从文件系统或别的位置调取 templates。你还可以使用 Temlate类从字符串生成模版。

很多应用在初始化应用时，生成一个 Environment 对象，并且使用它调取 templates。也有使用多个 Environment 对象的例子。

最简单的配置 Jinja 读取 templates 的方式是使用PackageLoader 。

```python
from jinja2 import Environment,PackageLoader,select_autoescape

env = Environment( loader=PackageLoader("yourapp"),
    autoescape=select_autoescape()
)

```

上面的代码会生成一个使用loader的 template environment 。loader 会在yourapp 这个python package中（或yourapp.py python 模型邻近处）查找 templates 文件夹。这个loader 仅要求 yourapp是可导入的（importable），他会为你找出文件夹的绝对路径。

说明：
- yourapp 指的是当前python路径下名为 yourapp.py 文件，或名为 yourapp 的 python package（文件夹名为yourapp，且里面包含 `__init__.py`）
- 在 yourapp 同一目录中应包含名为 templates 的文件夹。
- 在templates文件夹中的文件被视为模版。

不同的 loader 可以以不同方式调取模版。可参考 [loaders](https://jinja.palletsprojects.com/en/3.0.x/api/#loaders)，也可以自己写一个loader。

- To load a template from environment, call `get_template()` method, which returns the loaded `Template`.

`tempate = env.get_template("mytemplate.html")`

- To render it with some variables, call the `render()` method. 

`print(template.render(the="variables",go="here"))`

使用模版 loader ，而不是传递strings 给 Template 或 Environment.from_string() 有许多好处，即易用还可以启用模版继承。

Jinja将来可能会因为安全考虑，令autoescaping默认启动，但还是鼓励用户明确声明autoescaping。

### 高级 API

High level API is the API you will use in the app to load and render Jinja templates.

Low level API is only useful if you want to dig deeper into Jinja or develop extensions.

#### Class jinja2.Environment()

The core component of Jinja is Environment.

Here are the possible initialization parameters:
- `block_start_string` , block的起始标记，默认为 {%
- `block_end_string` , block的终止标记，默认为 %}
- `variable_start_string`, 变量的起始标记，默认为 {{
- `variable_end_string`, 变量的终止标记，默认为 }}
- ...