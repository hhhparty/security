# RADAR2 Cheatsheet

首先要清楚：
- 每个字母都是有含义的，例如：w stands for write, p stands for print, …
- 每个命令都是字符的序列组合，例如：pdf stands for p: print, d: disassemble, f: function
- 每个命令都通过 ？ 查询帮助文档，例如：pdf?, ???, …


## 加载文件
- `r2 <some-bin-file-name>`  
- `r2 -d  <some-bin-file-name>`  调试模式打开文件。

```shell
$ rasm2 -a arm -b 32 -d  nop`
$ rabin2 -Ss /bin/ls  # list symbols and sections
$ rahash2 -a md5 /bin/ls
$ rafind2 -x deadbeef bin
$ ragg2
```

## 收集基本信息
- `-iI` 分析文件基本情况(文件格式、指令架构)
- `-ii` 分析导入表
- `-iE` 分析导出表
- `-it` 计算文件哈希值
- `rabin2 -I ./program — Binary info` 查看二进制文件信息，类似于r2 shell命令 `i` 
- `ii [q]`  查看Imports
- `?v sym.imp.func_name` 获取函数的PLT地址 — Get address of func_name@PLT
- `?v reloc.func_name `  获取函数的GOT地址— Get address of func_name@GOT
- `ie [q]` 获取入口点地址 — Get address of Entrypoint
- `iS`  获取某个节的权限 — Show sections with permissions (r/x/w)
- `i~canary` 检查是否有canary保护 — Check canaries
- `i~pic` 检查是否有pic保护 — Check if Position Independent Code
- `i~nx` 检查是否有nx保护— Check if compiled with NX
## 内存

- `dm` — Show memory maps
- `dmm` — List modules (libraries, binaries loaded in memory)
- `dmi [addr|libname] [symname]` — List symbols of target lib

## 搜索
Searching
- `e search.*` 编辑搜索配置，例如搜索范围 — Edit searching configuration
- `/?` 列出搜索子命令 — List search subcommands
- `/ string` 搜索内存或二进制中的字符串 — Search string in memory/binary
- `/R [?]` 搜索ROP gadgets — Search for ROP gadgets
- `/R/` 使用正则表达式搜索 ROP gadgets  — Search for ROP gadgets with a regular expressions

-  `/ yourstring` 在内存或binary中搜索字符串 
- 
show strings: iz
find writeable sections: iS | grep perm=..w
find executables sections: iS | grep perm=...x
find xref of a function: axt [offset|yourfunctioname]
list libc imports: is~imp.
generate cyclical pattern: ragg2 -P $SIZE -r
find offset of pattern: wopO $VALUE
change the deep of the rop-search: e search.roplen = 4
computing how far a symbol is from where you currently are: fd [offset|yourfunctioname]
find protections in binary:
i~canary for canaries
i~pic for Position Independent Code
i~nx for non-executable stack


## 文件分析
- `aaa` 分析程序中所有函数，分析前 radare2 识别不了函数，分析后就可以正常打印函数代码了（pdf 打印函数代码）
- `aa` 命令只分析主函数
- `afl` 列出文件中的函数
- `axt <function-name>`  列出指定函数的交叉引用情况。
- `afx` 查看调用函数


注意：交叉引用等需要先执行aaa或aa分析命令。

## 定位

- `s function` 跳转到函数名指定的位置/地址。

## GUI
- `VV` 进入图形化模式，使用 h j k l 进行上下移动，使用p/P切换图形模式，使用空格切换文本、图形模式。文本下可以使用 p 切换模式，小写的 vv 可以用来粗略浏览函数信息。

## 查看代码
- `pdf` 查看函数汇编代码
- `pd x` 打印汇编信息x条
- `pdc` 反汇编函数
- `px` 打印16进制数，默认从当前位置开始，参数控制打印的字节数。
## 改写指令
- `"wa xxx"` 修改汇编指令为 xxx

## 调试
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
- `dc` — Continue execution
- `dcu addr` – Continue execution until address
- `dcr` — Continue until ret (uses step over)
- `dbt [?]` — Display backtrace based on dbg.btdepth and dbg.btalgo
- `doo [args] `— Reopen in debugger mode with args
- `ds` — Step one instruction
- `dso` — Step over

## Visual Modes
- `pdf @ addr` — Print the assembly of a function in the given offset
- `V `— Visual mode, use p/P to toggle between different modes
- `VV` — Visual Graph mode, navigating through ASCII graphs
- `V!` — Visual panels mode. Very useful for exploitation

## 帮助查看
- `?` 查看帮助

## 字符串查找
查找字符串作为分析起点
- `iz`  列出所有字符串，配合grep等linux命令使用更佳。

- `ps @ <address>`  查看某地址处的字符串。
- `axt <address>` 查看引用该地址处op或data的语句。


## 设置
- 关闭分析线条：`e asm.lines = false`
- 设置写状态 ：`e io.cache=true`
- 设置搜索范围：`e search.in = dbg.maps`
## 反编译

r2提供了反编译器，可以安装各种支持的反编译器。


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

watcher：
```sh
# de <读、写、执行> <寄存器、内存> <寄存器名、内存地址>
# 例如：执行到 
```

### 插件

使用集成的包管理器你可以简化安装插件工作，最有趣的一点是原生 ghidra 反编译器、r2dec 反编译器和 frida 的集成。其他还有许多。
首先要初始化 r2pm :

`r2pm init`

之后要安装几个常用插件，例如：
- r2dec：可以输出伪C代码
- r2ghidra：
- r2frida


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

## rasm2 
这个命令（程序）用于汇编或反汇编文件、16进制字符串
```
$ rasm2 -h
Usage: rasm2 [-ACdDehLBvw] [-a arch] [-b bits] [-o addr] [-s syntax]
             [-f file] [-F fil:ter] [-i skip] [-l len] 'code'|hex|-
 -a [arch]    Set architecture to assemble/disassemble (see -L)
 -A           Show Analysis information from given hexpairs
 -b [bits]    Set cpu register size (8, 16, 32, 64) (RASM2_BITS)
 -c [cpu]     Select specific CPU (depends on arch)
 -C           Output in C format
 -d, -D       Disassemble from hexpair bytes (-D show hexpairs)
 -e           Use big endian instead of little endian
 -E           Display ESIL expression (same input as in -d)
 -f [file]    Read data from file
 -F [in:out]  Specify input and/or output filters (att2intel, x86.pseudo, ...)
 -h, -hh      Show this help, -hh for long
 -i [len]     ignore/skip N bytes of the input buffer
 -k [kernel]  Select operating system (linux, windows, darwin, ..)
 -l [len]     Input/Output length
 -L           List Asm plugins: (a=asm, d=disasm, A=analyze, e=ESIL)
 -o [offset]  Set start address for code (default 0)
 -O [file]    Output file name (rasm2 -Bf a.asm -O a)
 -p           Run SPP over input for assembly
 -s [syntax]  Select syntax (intel, att)
 -B           Binary input/output (-l is mandatory for binary input)
 -v           Show version information
 -w           What's this instruction for? describe opcode
 -q           quiet mode
 If '-l' value is greater than output length, output is padded with nops
 If the last argument is '-' reads from stdin
Environment:
 RASM2_NOPLUGINS  do not load shared plugins (speedup loading)
 R_DEBUG          if defined, show error messages and crash signal
```

常用： 
- `rasm2 -d <16进制数>` 将16进制数转换为指令，例如 `rasm2 -d 90` 会将90转为nop
- `rasm2 "<指令>"` 将指令转换为16进制数。
## Using radare2 to pwn things



### Emulation
initialize emulation: aei
deinitialize emulation: aed
emulate a whole function: aef
single-step: aes
Display
hexdump: pxw [len] [@ offset]
get offset of a symbol: ?v sym.main
disassemble a whole function: pdf @ [offset|yourfunctioname]
list functions: afl
get in which function an address is used: afi address~fcn
afi to get function information
~fcn to grep for “fcn”
append j to get a JSON output : ij, pdfj, /Rj …
calculus of offsets: ? 0x20 + 0x4028a0
Debugger
connecting the gdbserver r2 -D gdb -d [binary] gdb://[address:port] (full doc)
connecting the remote windbg r2 -D wind -d [binary] windbg://[pipe address] (full doc)
show registers: dr=
emuling strace: dcs*
disassemble at register reg: pd [len] @ [reg]
Misc
emulating socat: rarun2 program=./plzpwnme.exe listen=4444 You should really take a look at rarun2's manpage.
Feel free to tell us if you think that we missed something, and good luck for the Defcon CTF Quals!


## rabin2
最为常见的用法： `rabin2 -I <二进制文件名>`

命令选项：
- `-M` 显示Main symbol 的地址。
- `-R` 显示内存地址分布（Relocation）信息
- `-s` 显示 symbol
- `-S` 显示 sections
- `-z` 显示字符串