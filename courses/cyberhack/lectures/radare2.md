# Radare2

一款免费/自由的工具链，用于简化多种低级别任务，例如电子取证、软件逆向、渗透、调试等等。它由一组库（可扩展）和程序组成，几乎可以用于各种编程语言。

主要功能特性：
- Batch, commandline, visual and panels interactive modes
- Embedded webserver with js scripting and webui
- Assemble and disassemble a large list of CPUs
- Runs on Windows and any other UNIX flavour out there
- Analyze and emulate code with ESIL
- Native debugger and GDB, WINDBG, QNX and FRIDA
- Navigate ascii-art control flow graphs
- Ability to patch binaries, modify code or data
- Search for patterns, magic headers, function signatures
- Easy to extend and modify
- Commandline, C API, script with r2pipe in any language



推荐从github获取安装最新版本

```
$ git clone https://github.com/radareorg/radare2
$ cd radare2 ; sys/install.sh
```

如果安装中遇到问题，可以尝试下面的指令
```
$ sudo make purge
$ rm -rf shlr/capstone
$ git clean -xdf
$ git reset --hard @~50
$ sys/install.sh
```


## 基本用例

Radare2 可以用于多种用途，可以从命令行、shell脚本调用独立的工具。

```shell
$ rasm2 -a arm -b 32 -d `rasm2 -a arm -b 32 nop`
$ rabin2 -Ss /bin/ls  # list symbols and sections
$ rahash2 -a md5 /bin/ls
$ rafind2 -x deadbeef bin
```

所有程序也可以指令形式在r2中被调用：
```
$ r2 -
> pa nop
90
> pad 90
nop
```

一些日常使用的通用命令如下：
```shell
$ r2 /bin/ls
> aaa    # analyze all the things
> is     # list symbols
> afl    # list functions found
> pdf    # disassemble function
> s <tab># seek to address
> v      # enter visual panels mode
```

### Debugger

通过 `r2` 打开的文件时，给定文件的URI所选定的IO层可以是任何形式，从本地文件、远程r2 shell、整个磁盘、其他进程的内存都可以。

为简化操作，标志 `-d` 用于 `dbg://` 这个uri来连接到一个进程读取它的内存镜像，改变寄存器和检查执行流。他是一个低级别的调试器，但不是替代 gdb或lldb。

```shell
$ r2 -d gdb://127.0.0.1
> ds          # step into
> dso         # step over
> dr=         # show registers in columns
> dbt         # show backtrace
> dsu entry0  # continue until entrypoint
> dr rax=33   # change value of register
> pxr@rsp     # inspect stack
> drr         # periscoped register values
```

### 插件

使用集成的包管理器你可以简化安装插件工作，最有趣的一点是原生 ghidra 反编译器、r2dec 反编译器和 frida 的集成。其他还有许多。

```shell
$ r2pm update
$ r2pm -i r2ghidra r2dec r2frida
```

### Frida

Frida 是非常流行的 in-process 调试跟踪工具。通过安装r2frida插件，它也可以在 r2 中使用。通过usb，tcp和别的读写进程内存，你可以附着或布设到一个本地或远程进程中。

代替使用frida，使用r2frida的一个主要优势是：尽管不依赖于python，你可以使用短命令，而不是键入多行的js代码。

- Access remote filesystems
- Modify filedescriptors
- Breakpoints (Like in DWARF)
- Load/Unload agent scripts as plugins
- Sybolicate from local bins, scripts or runtime info
- Supports macOS/iOS/Linux/Android/QNX/Windows

```shell
$ r2 frida:///bin/ls
> \dc         # continue the execution
> \dd         # list file descriptors
> \dm         # show process memory maps
> \dmm        # show modules mapped
> \dl foo.so  # load a shlib
> \dt write   # trace every call to 'write'
> \isa read   # find where's the read symbol located
> \ii         # list imports off the current module
> \dxc exit 0 # call 'exit' symbol with argument 0
```

### 文档

可以在 `r2` 中使用 `?` 来查询radare2的使用文档。

You can use the HUD mode to interactively browse all the commands inside r2 using this oneliner:


`r2 -Qc'?*~...' --`

### 常用命令
- `r2 <some-bin-file-name>`  

#### 基本信息
- `-iI` 分析文件基本情况(文件格式、指令架构)
- `-ii` 分析导入表
- `-iE` 分析导出表
- `-it` 计算文件哈希值

#### 文件分析
- `aaa` 分析程序中所有函数，分析前 radare2 识别不了函数，分析后就可以正常打印函数代码了（pdf 打印函数代码）
- `aa` 命令只分析主函数
- `afl` 列出文件中的函数
- `axt <function-name>`  列出指定函数的交叉引用情况。
- `afx` 查看调用函数


注意：交叉引用等需要先执行aaa或aa分析命令。

#### 定位

- `s function` 跳转到函数名指定的位置/地址。

#### GUI
- `VV` 进入图形化模式，使用 h j k l 进行上下移动，使用p/P切换图形模式，使用空格切换文本、图形模式。文本下可以使用 p 切换模式，小写的 vv 可以用来粗略浏览函数信息。

#### 查看代码
- `pdf` 查看函数汇编代码
- `pd x` 打印汇编信息x条
- `pdc` 反汇编函数
- `px` 打印16进制数，默认从当前位置开始，参数控制打印的字节数。
#### 改写指令
- `"wa xxx"` 修改汇编指令为 xxx

#### 调试
- `r2 -d 目标文件` 进入调试模式，输入 `!`在调试时可以看到感叹号
- `r2 -d 目标pid` attach 某个process 进入调试模式，输入 `!`在调试时可以看到感叹号
- `r2 -d -A 目标文件` 加载二进制文件并启动分析。
- 

- `db <function-name>` 在某个地址设置断点
- `dbi` 查看所有断点
- `dc` 运行二进制文件
- `dbt` 查看对战
- `drr` 转储寄存器内容
- `dpa <pid> `          Attach and select pid
- `dpf`                 Attach to pid like file fd // HACK
#### 帮助查看
- `?` 查看帮助

#### 字符串查找
查找字符串作为分析起点
- `iz`  列出所有字符串，配合grep等linux命令使用更佳。

- `ps @ <address>`  查看某地址处的字符串。
- `axt <address>` 查看引用该地址处op或data的语句。

#### 反编译

r2提供了反编译器，可以安装各种支持的反编译器。