# pwntools 教程

Pwntools 是一个用于编写exploits的工具。

Pwntools收集了很多常用的pwn代码，提供了半标准化的方式，使得我们可以不必总是拷贝粘贴类似`struct.unpack('>I',x)`代码，而是使用更加清晰的包装器，例如`pack` `p32` `p64`等功能来处理shellcode。 

对于Pwntools 2.0 ，有两个不同的模块：
- pwnlib 是干净的python module
- pwn 用于 CTFs 的工具箱
  - 从顶级pwnlib中引入了各种东西，使用`import pwn` 或 `from pwn import *` 就可以引用pwntools提供的任何东西
  - 在终端以原始模式调用 pwnlib.term.init() ，可以实现看起啦不是它的功能（：？）
  - 设置 pwnlib.contex.log_level 到 “info”
  - 尝试解析在 sys.argv 中的值
- 给定远程符号解析的内存解析工具 MemLeak、DynELF
- ELF 解析和补丁
- ROP gadget 发现和调用链构建。
- 丰富的 tubes 集合，用以包装各种IO，统一接口
- 切换本地exp到远程exp或使用ssh将本地exp变为 one-line change。

## 入门

为了让你初步认识 pwntool （To get your feet wet with pwntools)，下面是一个例子：

当我们写exp时，pwntools 通常需要引入：

```py
from pwn import *
```

### 建立连接

为了pwn某个challenge，我们需要与之对话，pwntools 使用 pwnlib.tubes 模块就能很简单的实现这一点。

这里它暴露了一个标准接口，可以与进程、sockets、serial ports 等等进行通话，

- 例如通过 pwnlib.tubes.remote 实现远程连接。

```py
>>> conn = remote('ftp.ubuntu.com',21)
>>> conn.recvline() # doctest: +ELLIPSIS
b'220 ...'
>>> conn.send(b'USER anonymous\r\n')
>>> conn.recvuntil(b' ', drop=True)
b'331'
>>> conn.recvline()
b'Please specify the password.\r\n'
>>> conn.close()
```

- 建立一个监听器也很容易，例如

```py
>>> l = listen()
>>> r = remote('localhost', l.lport)
>>> c = l.wait_for_connection()
>>> r.send(b'hello')
>>> c.recv()
b'hello'
```

- 与进程进行交互，使用 pwnlib.tubes.process

```py
>>> sh = process('/bin/sh')
>>> sh.sendline(b'sleep 3; echo hello world;')
>>> sh.recvline(timeout=1)
b''
>>> sh.recvline(timeout=5)
b'hello world\n'
>>> sh.close()
```

- 与程序交互

```py
>>> sh.interactive() # doctest: +SKIP
$ whoami
user
```

-  实现ssh交互，可以使用 pwnlib.tubes.ssh

```
>>> shell = ssh('bandit0', 'bandit.labs.overthewire.org', password='bandit0', port=2220)
>>> shell['whoami']
b'bandit0'
>>> shell.download_file('/etc/motd')
>>> sh = shell.run('sh')
>>> sh.sendline(b'sleep 3; echo hello world;') 
>>> sh.recvline(timeout=1)
b''
>>> sh.recvline(timeout=5)
b'hello world\n'
>>> shell.close()
```

### 打包整数  Packing integers
在编写exp的时候，常见的一项任务是转换整数的表示形式，例如把整数转换为字节序列。通常python处理这个使用`struct`.

pwntools 有更加简单的 pwnlib.util.packing ,不需要记解压的代码，

```py
>>> import struct
>>> p32(0xdeadbeef) == struct.pack('I', 0xdeadbeef)
True
>>> leet = unhex('37130000')
>>> u32(b'abcd') == struct.unpack('I', b'abcd')[0]
True
```

打包或拆包操作，可以用不同的比特数宽度对应的函数实现。

- p8()/u8(b'xxx')
- p32()/u32(b'ddd')

### 设置目标os的架构


```py
>>> asm('nop')
b'\x90'
>>> asm('nop', arch='arm')
b'\x00\xf0 \xe3'
```

也可以一次性的在全局 context 中设置，包括 os、字长、endianness。

```py
>>> context.arch      = 'i386'
>>> context.os        = 'linux'
>>> context.endian    = 'little'
>>> context.word_size = 32
```

还可以使用一个shorthand设置所有值：

```py
>>> asm('nop')
b'\x90'
>>> context(arch='arm', os='linux', endian='big', word_size=32)
>>> asm('nop')
b'\xe3 \xf0\x00'
```
### asm 函数
asm函数可以将给定的shellcode（汇编代码）进行汇编并返回其字节内容。

Arguments:
        shellcode(str): Assembler code to assemble.
        vma(int):       Virtual memory address of the beginning of assembly
        extract(bool):  Extract the raw assembly bytes from the assembled
                        file.  If :const:`False`, returns the path to an ELF file
                        with the assembly embedded.
        shared(bool):   Create a shared object.
        kwargs(dict):   Any attributes on :data:`.context` can be set, e.g.set
                        ``arch='arm'``.
    
    Examples:
    
        >>> asm("mov eax, SYS_select", arch = 'i386', os = 'freebsd')
        b'\xb8]\x00\x00\x00'
        >>> asm("mov eax, SYS_select", arch = 'amd64', os = 'linux')
        b'\xb8\x17\x00\x00\x00'
        >>> asm("mov rax, SYS_select", arch = 'amd64', os = 'linux')
        b'H\xc7\xc0\x17\x00\x00\x00'
        >>> asm("mov r0, #SYS_select", arch = 'arm', os = 'linux', bits=32)
        b'R\x00\xa0\xe3'
        >>> asm("mov #42, r0", arch = 'msp430')
        b'0@*\x00'
        >>> asm("la %r0, 42", arch = 's390', bits=64)
        b'A\x00\x00*'



### 设置日志详细度
```
>>> context.log_level = 'debug'
```

### 汇编和反汇编
你再也不需要从互联网上运行一些已经组装好的外壳代码了！pwnlib.asm 模块非常棒。

```py
>>> enhex(asm('mov eax, 0'))
'b800000000'
```

反汇编也很容易：

```py
>>> print(disasm(unhex('6a0258cd80ebf9')))
   0:   6a 02                   push   0x2
   2:   58                      pop    eax
   3:   cd 80                   int    0x80
   5:   eb f9                   jmp    0x0
```

然而，你大部分时间也不需要再写shellcode了，pwntools有一个 pwnlib.shellcraft 模块，可以加载有用的shellcodes。

假设我们想`setreui(getuid(),getuid()` 跟在 dup \`ing file descriptor 4 to \` 到 stdin，stdout, and stderr,然后在弹出一个shell。

```py
>>> enhex(asm(shellcraft.setreuid() + shellcraft.dupsh(4))) # doctest: +ELLIPSIS
'6a3158cd80...'
```

### 杂项工具
不需要再写别的 hexdump ，这要感谢 pwnlib.util.fiddling

在你的buffer中找到引起崩溃的 offsets ，可以使用 pwnlib.cyclic

```py
>>> cyclic(20)
b'aaaabaaacaaadaaaeaaa'
>>> # Assume EIP = 0x62616166 (b'faab' which is pack(0x62616166))  at crash time
>>> cyclic_find(b'faab')
120
```

### ELF 操作

停止硬编码，可以使用 pwnlib.elf 查看运行时。

```py 
>>> e = ELF('/bin/cat')
>>> print(hex(e.address)) #doctest: +SKIP
0x400000
>>> print(hex(e.symbols['write'])) #doctest: +SKIP
0x401680
>>> print(hex(e.got['write'])) #doctest: +SKIP
0x60b070
>>> print(hex(e.plt['write'])) #doctest: +SKIP
0x401680
```

你甚至可以patch 和存储这个文件

```py
>>> e = ELF('/bin/cat')
>>> e.read(e.address, 4)
b'\x7fELF'
>>> e.asm(e.address, 'ret')
>>> e.save('/tmp/quiet-cat')
>>> disasm(open('/tmp/quiet-cat','rb').read(1))
'   0:   c3                      ret'
```


## Tubes
Tubes 是pwntools提供的一组对 I/O 的包装器，用于满足各种 I/O 操作：
- 本地进程
- 远程TCP UDP 通信
- 经SSH的远程服务器进程
- 串口通信

本文介绍几个基本使用例子，更多内容可参考[详细文档](https://pwntools.readthedocs.org/en/latest/tubes.html)


### Basic IO / 基本 tubes

现实中，你希望的IO功能可能包括：
- 接收数据
- 发送数据
- 操作整数

pwntools 提供了实现这些功能的方法：

#### 接收数据
- recv(n) - Receive any number of available bytes
- recvline() - Receive data until a newline is encountered
- recvuntil(delim) - Receive data until a delimiter is found
- recvregex(pattern) - Receive data until a regex pattern is satisfied
- recvrepeat(timeout) - Keep receiving data until a timeout occurs
- clean() - Discard all buffered data

#### 发送数据

- send(data) - Sends data
- sendline(line) - Sends data plus a newline

#### 操作整数

- pack(int) - Sends a word-size packed integer
- unpack() - Receives and unpacks a word-size integer

### 进程和基本特性

#### process 对象
为了构建一个可与进程对话的 tube，你可以生成一个 process 对象，然后把它的名字交给目标代码。

```py
from pwn import *
io = process('sh')
io.sendline('echo Hello,world')
io.recvline()

```

如果需要提供命令行参数、环境变量、额外的选项等等，可以看[详细文档](https://pwntools.readthedocs.org/en/latest/tubes.html)

例如：
```py
from pwn import *

io = process(['sh','-c','echo $MYENV'],env={'MYENV':'MYVAL'})
io.recvline()

```

#### 读取二进制数据

可以使用 `recv` 接收一定数量的字节，或使用 `recvn` 获取确定数量的 block:

```py
from pwn import *

io = process(['sh','-c','echo A; sleep 1; echo B; sleep 1; echo C; sleep 1;echo DDD'])

io.recv()
# 'A\n'

io.recvn(4)
# 'B\nC\n'

hex(io.unpack())
# 0xa444444
```

### 交互sessions

当需要登录 game server 的shell时，可以非常容易的构建一个交互shell：

```py
from pwn import *
# Let's pretend we're uber 1337 and landed a shell.
io = process('sh')

# <exploit goes here>

io.interactive()
```

### 网络连接
利用 pwntools 生成网络连接也很容易，remote 对象用于建立连接，listen 对象用于等待建立连接。
#### 远程连接


```py
from pwn import *

io = remote('baidu.com',80)
io.send('GET /\r\n\n')
io.recvline()
```

如果需要指定协议信息：
```py
from pwn import *

dns = remote('8.8.8.8',53,typ='udp')
tcp6 = remote('google.com',80,fam='ipv6')

```
#### 监听 
监听连接，也很容易实现：
```py
from pwn import *
client = listen(8080).wait_for_connection()

```

#### secure shell

SSH 连接在pwntools中也很容易实现，注意这与之前process的方式很像：

```py
from pwn import *
session = ssh('bandit0','bandit.labs.overthewire.org',password='bandit0')
io = session.process('sh', env={"PS1":""})
io.sendline('echo Hello, world!')
io.recvline()
# 'Hello, world!\n'

```

### 串口通信
pwntools 还提供了一种串口tube：
```py
from pwn import *
io = serialtube('/dev/ttyUSB0',baudrate=115200)
```

## 工具
pwntools 提供了很多pwn的基础工具：
- Packing and Unpacking Integers
- 文件 IO
- Hashing and encoding：Base64, hashes, URL encoding, hex encoding, bit manipulation and hex dumping
- Pattern generation

### 工具函数
半数的pwntools都是工具函数（utility functions），这令我们不需要再像下面那样粘贴东西：
```py
import struct

def p(x):
    return struct.pack('I',x)

def u(x):
    return struct.unpack('I',x)[0]

1234 == u(p(1234))
```

取而代之，可以使用pwntools 中的wrappers：

```py
from pwn import * 
123 == unpack(pack(123))
```

### packing and unpacking integers
最常见的一件事就是处理数据为可用格式。pack 和 unpack 函数可以在全局设定 context 中定义 endian，bits，sign。

默认整数以4字节、little endian 存放（即pack）
```py
pack(1)
# '\x01\x00\x00\x00'

pack(-1)
# '\xff\xff\xff\xff'

pack(2**32 - 1)
# '\xff\xff\xff\xff'

pack(1, endian='big')
# '\x00\x00\x00\x01'

p16(1)
# '\x01\x00'

hex(unpack('AAAA'))
# '0x41414141'

hex(u16('AA'))
# '0x4141'
```

## exp 编写框架
官方给的示例如下：
```py

from pwn import *

context(arch = 'i386', os='linux',log_level='debug')

# 远程shell
r = remote('exploitme.example.com',31337)
# 本地进程
# r = process("./text")


# EXP CODE Goes Here
r.send(asm(shellcraft.sh()))
r.interactive()
```