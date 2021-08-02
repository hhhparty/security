# WSGI 

WSGI 即 Python Web Server Gateway Interface，它作为Python语言定义的Web服务器和Web应用程序或框架之间的一种简单而通用的接口。

WSGI是一个规范，描述了 Web server 如何与 web application 交互、web application 如何处理请求。该规范的具体描述在 [PEP3333](https://www.python.org/dev/peps/pep-3333/). PEP3333 标准是 PEP333 的升级版。

## 原始关系和目标

Python系得web 应用框架现在很多了，例如：Zope, Quixote, Webware, SkunkWeb, PSO, and Twisted Web 更多的可参考[here](https://wiki.python.org/moin/WebProgramming)。但新手选择这些框架时，限于可用的webservers。

比较来看，尽管Java也有很多可选的web应用框架，java的 servlet api 使得使用任何java web框架编写的应用可以运行在支持servlet API的任何的web server上。

类似Servlet的api，在python web servers中也是需要的，无论是那些用python写的还是嵌入python的，或是经过网关协议（例如CGI,FastCGI）调用python的web server，都可以利用这种API，将web server 与 web 框架分离，使用户自由选择适合的部分框架或server。

PEP3333旨在定义一个衔接web servers 和 web applications 或框架的、简单的、通用的接口，即the Python Web Server Gateway Interface (WSGI).

但仅有WSGI标准是不足以解决现有服务器和框架的问题的，server 和 framework 作者和维护人员必须真的实现WSGI。为了推广WSGI，它必须简单、易于实现。

简便一词对 framework 作者和 web server 作者是不同的。WSGI 向框架作者表达了一个绝对的 "no frills"（没装饰）的接口，因为像响应对象和cookie处理这样的繁杂事物只会妨碍现有框架对这些问题的处理。同样，WSGI的目标是促进现有服务器和应用程序或框架的轻松互连，而不是创建新的Web框架。

还要注意，此目标使WSGI不需要任何已部署的Python版本中尚不可用的东西。因此，本规范未提议或不需要新的标准库模块，并且WSGI中的任何内容都不需要大于2.2.2的Python版本。（但是，对于将来的Python版本，在标准库提供的Web服务器中包括对此接口的支持将是一个好主意。）

除了易于实现现有和将来的框架和服务器之外，还应该易于创建请求预处理器，响应后处理器以及其他基于WSGI的“中间件”组件，这些组件看起来像对其包含服务器的应用程序，同时充当服务器为其包含的应用程序。

如果中间件既简单又健壮，并且WSGI在服务器和框架中广泛可用，则它允许使用一种全新的Python Web应用程序框架：一个由松散耦合的WSGI中间件组件组成的框架。实际上，现有框架的作者甚至可以选择重构以这种方式提供的框架现有服务，从而变得更像WSGI所使用的库，而不再像单片框架那样。然后，这将使应用程序开发人员可以为特定功能选择“同类最佳”组件，而不必致力于单个框架的所有优缺点。

当然，在撰写本文时，这一天无疑是遥不可及的。同时，对于WSGI来说，将任何框架与任何服务器一起使用是足够的短期目标。

最后，应该提到的是，当前版本的WSGI没有规定用于“部署”与Web服务器或服务器网关一起使用的应用程序的任何特定机制。目前，这必须由服务器或网关实现定义。在足够数量的服务器和框架实现了WSGI以提供具有不同部署要求的现场经验之后，可能有必要创建另一个PEP，以描述WSGI服务器和应用程序框架的部署标准。


## 规格概述
WSGI接口具有两个方面：
- “服务器”或“网关”端
- 以及“应用程序”或“框架”端。

服务器端调用应用程序端提供的可调用对象。该对象的提供方式具体取决于服务器或网关。假定某些服务器或网关将要求应用程序的部署者编写一个简短的脚本来创建服务器或网关的实例，并为其提供应用程序对象。其他服务器和网关可能使用配置文件或其他机制来指定应从何处导入或以其他方式获取应用程序对象。

除了“纯”服务器/网关和应用程序/框架外，还可以创建实现本规范两面的“中间件”组件。这些组件充当其所包含的服务器的应用程序，并且充当所包含的应用程序的服务器，并且可以用于提供扩展的API，内容转换，导航和其他有用的功能。

在整个说明书中，我们将使用术语“a callable”来表示“一个有`__call__` 方法的函数、方法、类、实例。由服务器，网关或实现可调用对象的应用程序，来选择适合其需要的合适的实现技术。相反，正在调用可调用对象的服务器，网关或应用程序，必须不依赖于向其提供的某种可调用对象。可调用对象仅被调用，而不是向上自省的（introspected upon）。

## 字符串类型

通常，HTTP处理字节，意味着本标准最有可能处理的是字节数据。

然而，字节的内容经常是某种文本化的解释，在Python种，字符串是最常使用的存放文本的对象。

不同Python版本和实现种，字符串是Unicode而不是字节型的，这就要求我们在可用的API和正确转换Http种的字节与文本找到一个平衡，特别是对支持porting code的、有不同的str类型的Python实现。

WSGI 因此定义了两类 "string":
- “native" 字符串（总是使用名为str的类型实现）用于request/response 头和元数据；
- “Bytestrings”（Python3使用bytes类型实现，其它使用str实现）用于requests和responses body数据，例如POST和PUT 输入数据和HTML page输出。

但是请不要感到困惑：即使Python的str类型实际上是“幕后的” Unicode ，本地字符串的内容仍必须可以通过Latin-1编码转换为字节！可参考 [Unicode问题](https://www.python.org/dev/peps/pep-3333/#unicode-issues)

在本文中看到“字符串”一词时，它指的是“本地”字符串，即str类型的对象，无论它是在内部实现为字节还是Unicode。在您看到对“ bytestring”的引用时，应将其理解为“ 在Python 3下为bytes类型的对象，在Python 2下为str类型的对象”。

## 应用、框架侧

应用对象是一个简单的可调用对象，可以接收两个参数。object 这个词不要错误理解为要求一个真实的对象实例：即含有`__call__`的某个函数、方法、类、实例。应用对象可以被调用多次，作为虚拟的所有服务器、网关将产生这些重复的请求。


下面是两个应用对象的例子，一个是函数，另一个是类：

```python

HELLO_WORLD = b"Hello world!\n"

def simple_app(environ, start_response):
    """Simplest possible application object"""
    status = '200 OK'
    response_headers = [('Content-type', 'text/plain')]
    start_response(status, response_headers)
    return [HELLO_WORLD]

class AppClass:
    """Produce the same output, but using a class

    (Note: 'AppClass' is the "application" here, so calling it
    returns an instance of 'AppClass', which is then the iterable
    return value of the "application callable" as required by
    the spec.

    If we wanted to use *instances* of 'AppClass' as application
    objects instead, we would have to implement a '__call__'
    method, which would be invoked to execute the application,
    and we would need to create an instance for use by the
    server or gateway.
    """

    def __init__(self, environ, start_response):
        self.environ = environ
        self.start = start_response

    def __iter__(self):
        status = '200 OK'
        response_headers = [('Content-type', 'text/plain')]
        self.start(status, response_headers)
        yield HELLO_WORLD
```

## 服务器、网关侧

服务器或网关会在每次接到HTTP 客户端的请求时，调用可调用的应用。为了解释这一点，这里有一个简单的CGI网关。注意，这只是一个含有有限的错误处理的简单例子。

```python
import os, sys

enc, esc = sys.getfilesystemencoding(), 'surrogateescape'

def unicode_to_wsgi(u):
    # Convert an environment variable to a WSGI "bytes-as-unicode" string
    return u.encode(enc, esc).decode('iso-8859-1')

def wsgi_to_bytes(s):
    return s.encode('iso-8859-1')

def run_with_cgi(application):
    environ = {k: unicode_to_wsgi(v) for k,v in os.environ.items()}
    environ['wsgi.input']        = sys.stdin.buffer
    environ['wsgi.errors']       = sys.stderr
    environ['wsgi.version']      = (1, 0)
    environ['wsgi.multithread']  = False
    environ['wsgi.multiprocess'] = True
    environ['wsgi.run_once']     = True

    if environ.get('HTTPS', 'off') in ('on', '1'):
        environ['wsgi.url_scheme'] = 'https'
    else:
        environ['wsgi.url_scheme'] = 'http'

    headers_set = []
    headers_sent = []

    def write(data):
        out = sys.stdout.buffer

        if not headers_set:
             raise AssertionError("write() before start_response()")

        elif not headers_sent:
             # Before the first output, send the stored headers
             status, response_headers = headers_sent[:] = headers_set
             out.write(wsgi_to_bytes('Status: %s\r\n' % status))
             for header in response_headers:
                 out.write(wsgi_to_bytes('%s: %s\r\n' % header))
             out.write(wsgi_to_bytes('\r\n'))

        out.write(data)
        out.flush()

    def start_response(status, response_headers, exc_info=None):
        if exc_info:
            try:
                if headers_sent:
                    # Re-raise original exception if headers sent
                    raise exc_info[1].with_traceback(exc_info[2])
            finally:
                exc_info = None     # avoid dangling circular ref
        elif headers_set:
            raise AssertionError("Headers already set!")

        headers_set[:] = [status, response_headers]

        # Note: error checking on the headers should happen here,
        # *after* the headers are set.  That way, if an error
        # occurs, start_response can only be re-called with
        # exc_info set.

        return write

    result = application(environ, start_response)
    try:
        for data in result:
            if data:    # don't send headers until body appears
                write(data)
        if not headers_sent:
            write('')   # send headers now if body was empty
    finally:
        if hasattr(result, 'close'):
            result.close()
```

## 中间件：兼顾两侧的组件

有些单一对象，既可以对某些应用而言扮演服务器的角色，也可以对某些服务器而言扮演应用角色。这种中间件组件可以执行下列功能：
- 在相应地重写`environ`之后，可以基于目标URL将请求路由到其他应用程序对象。
- 允许多个应用程序或框架在同一过程中并行运行
- 通过在网络上转发请求和响应，实现负载平衡和远程处理
- 执行内容后处理，例如应用XSL样式表。

通常，中间件的存在对接口的“服务器/网关”和“应用程序/框架”双方都是透明的，并且不需要任何特殊支持。希望将中间件合并到应用程序中的用户将中间件组件简单地提供给服务器，就好像它是一个应用程序一样，并且将中间件组件配置为调用该应用程序，就好像中间件组件是服务器一样。当然，中间件包装的“应用程序”实际上可能是包装另一个应用程序的另一个中间件组件，依此类推，从而创建了所谓的“中间件堆栈”。

在大多数情况下，中间件必须符合WSGI的服务器端和应用程序端的限制和要求。但是，在某些情况下，对中间件的要求比对“纯”服务器或应用程序的要求更为严格，这些要点将在规范中予以说明。

下面是一个使用 piglatin.py 将text/plain转换为pig latin的中间件例子：

```python
from piglatin import piglatin

class LatinIter:

    """Transform iterated output to piglatin, if it's okay to do so

    Note that the "okayness" can change until the application yields
    its first non-empty bytestring, so 'transform_ok' has to be a mutable
    truth value.
    """

    def __init__(self, result, transform_ok):
        if hasattr(result, 'close'):
            self.close = result.close
        self._next = iter(result).__next__
        self.transform_ok = transform_ok

    def __iter__(self):
        return self

    def __next__(self):
        if self.transform_ok:
            return piglatin(self._next())   # call must be byte-safe on Py3
        else:
            return self._next()

class Latinator:

    # by default, don't transform output
    transform = False

    def __init__(self, application):
        self.application = application

    def __call__(self, environ, start_response):

        transform_ok = []

        def start_latin(status, response_headers, exc_info=None):

            # Reset ok flag, in case this is a repeat call
            del transform_ok[:]

            for name, value in response_headers:
                if name.lower() == 'content-type' and value == 'text/plain':
                    transform_ok.append(True)
                    # Strip content-length if present, else it'll be wrong
                    response_headers = [(name, value)
                        for name, value in response_headers
                            if name.lower() != 'content-length'
                    ]
                    break

            write = start_response(status, response_headers, exc_info)

            if transform_ok:
                def write_latin(data):
                    write(piglatin(data))   # call must be byte-safe on Py3
                return write_latin
            else:
                return write

        return LatinIter(self.application(environ, start_latin), transform_ok)


# Run foo_app under a Latinator's control, using the example CGI gateway
from foo_app import foo_app
run_with_cgi(Latinator(foo_app)
```

## 标准细节

