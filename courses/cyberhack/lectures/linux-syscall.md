# Linux syscall references



## 随机命名

取决于不同的环境，syscall names 可能使用不同的命名规范。

内核头文件，例如 asm/unistd.h 使用类似 __NR_xxx 的命名，但是不提供实用代码。

c库头文件，例如 syscall.h 或 sys/syscall.h 使用类似 SYS_xxx 的命名，调用时使用 syscall(...) 。

不同的开发者，如内核开发人员喜欢使用__NR_xxx 的命名，c库开发人员喜欢使用 SYS_xxx 的命名。

在不同的架构平台中，名字也可能不同，例如ARM中常为 __ARM_NR_xxx 这类私有系统调用；还有少量的 __NR_arm_xxx 系统调用意味着他们有自定义的包装。

可以看到使用了中断，我们需要查一下 [系统调用参考（syscall reference）](http://syscalls.kernelgrok.com/) 或者参考 [filippo的linux syscall reference](https://filippo.io/linux-syscall-table/)。你也可以检查本地的 syscall.h 或  unistd.h。

在有些系统中可以在/usr/include/x86_64-linux-gnu/asm/下面找到 unistd_64.h等文件。 

## 调用惯例

|arch|	syscall |NR	|return	|arg0	|arg1	|arg2	|arg3	|arg4|	arg5|
|-|-|-|-|-|-|-|-|-|-|
|arm|	r7|r0	|r0	|r1|	r2|	r3|	r4|	r5|
|arm64|	x8|	x0|	x0|	x1|	x2|	x3|	x4|	x5|
|x86	|eax|	eax|	ebx|	ecx	|edx|	esi	|edi|	ebp|
|x86_64|	rax|	rax|	rdi	|rsi|	rdx	|r10	|r8	|r9|


64-bit SYSCALL saves rip to rcx, clears rflags.RF, then saves rflags to r11, then loads new ss, cs, and rip from previously programmed MSRs.

rflags gets masked by a value from another MSR (so CLD and CLAC are not needed). SYSCALL does not save anything on the stack and does not change rsp.

Registers on entry:
- rax  system call number
- rcx  return address
- r11  saved rflags (note: r11 is callee-clobbered register in C ABI)
- rdi  arg0
- rsi  arg1
- rdx  arg2
 * r10  arg3 (needs to be moved to rcx to conform to C ABI)
 * r8   arg4
 * r9   arg5
 * (note: r12-r15, rbp, rbx are callee-preserved in C ABI)

RAX -> system call number
RDI -> first argument
RSI -> second argument
RDX -> third argument
R10 -> fourth argument
R8 -> fifth argument
R9 -> sixth argument

Note that the registers RCX and R11 can be trashed by a call.

## Linux 系统调用过程

来源：https://www.binss.me/blog/the-analysis-of-linux-system-call/

Linux 分为用户态和内核态两种运行状态。普通进程，一般在用户态下工作，敏感操作（打开文件、写文件、分配内存）时会切换到内核态（需要检查权限、资源）。这种从用户态切换到内核态的机制就是系统调用。

系统调用的基本过程是：用户发起调用、切换到内核态、内核态操作完成、返回用户态继续运行。这也是用户态主动切换为内核态的唯一方式。程序异常、中断等方式进入内核态属于被动切换方式。

Linux 系统调用的详细定义可使用 `man syscalls` 查看，其中列出了 Linux kernel提供的系统调用API，例如open、read、close等等，他们都经过 glibc 的封装，也可以使用汇编代码调用。

x86系统的系统调用，经历了 `int` / `iret` 到 `syssenter` / `sysexit` ,再到 `syscall` /`sysret` 的演变。


### 基于 linux kernel 4.9.76 glibc 2.25.9 的分析

#### int/iret

很早期时，人们常用 int/iret 实现系统调用和返回。

例如：
```S
msg: 
    db "Hello World!",10


    global _start

section .text
_start:
        mov eax,0x4 
        mov ebx,1  
        mov ecx,msg  
        mov edx,13
        int 0x80
        mov  eax,1 
        mov ebx,0
        int 0x80
```

又例如：
```s
	global	_start
	section	.text

_start:

	; ssize_t write(int fd, const void *buf, size_t count)
	mov	rdi,1			; fd
	mov	rsi,hello_world		; buffer
	mov	rdx,hello_world_size 	; count
	mov	rax,1	 		; write(2)
	syscall

	; exit(result)
	mov	rdi,0			; result
	mov	rax,60			; exit(2)
	syscall

hello_world:	db "Hello World!",10
hello_world_size EQU $ - hello_world
```

说明：
- 系统调用是通过`int 0x80`来实现的
- eax寄存器中为调用的功能号
- ebx、ecx、edx、esi等等寄存器则依次为参数
- 对于类 Unix 系统，unistd.h 中所定义的接口通常都是大量针对系统调用的封装（英语：wrapper functions），如 fork、pipe 以及各种 I/O 原语（read、write、close 等等）。)
- 一般情况下Linux环境下该文件位于/usr/include/unistd.h
- 从 `/usr/include/asm/unistd.h` 中可以看到exit的功能号_NR_exit为1，write(_NR_write)功能号为4，因此第一个int 0x80调用之前eax寄存器值为4，ebx为文件描述符，stdout的文件描述符为1，ecx则为buffer的内存地址，edx为buffer长度。第二个int0x80之前eax为1表示调用exit，ebx为0表示返回0。

- 系统调用功能号: 这部分可以参考[System Call Number Definition](http://www.linfo.org/system_call_number.html); 以及http://asm.sourceforge.net/syscall.html#2

在 arch/x86/kernel/traps.c 的 trap_init 中，定义了各种 set_intr_gate / set_intr_gate_ist /set_system_intr_gate 。其中，set_system_intr_gate 用于在中断描述表 IDT 上设置系统调用门：

```C
#ifdef CONFIG_x86_32
    set_system_intr_gate(IA32_SYSCALL_VECTOR,entry_INT80_32);
    set_bit(IA32_SYSCALL_VECTOR, used_vectors);
#endif
```

- 根据 arch/x86/include/asm/irq_vectors.h, IA32_SYSCALL_VECTOR 值为0x80.
- 于是在调用 int 0x80 后，硬件根据向量号在 IDT 中找到对应的表项，即中断描述副；
- 之后，进行权限等级检查，若发现DPL=CPL=3，则允许调用。
- 然后，硬件将切换到内核栈（tss.ss0:tss.esp0)。
- 接着，根据中断描述副的 segment selector 在GDT/LDT 中找到对应的段描述符，从段描述符拿到段基址；
- 将段基址加载到CS，将 offset 加载到 eip
- 最后，硬件将寄存器 ss/sp/eflags/cs/ip/er ror code 依次压入堆栈。

> 注意：上述流程在 Intel SDM Vol. 2A INT n/INTO/INT 3-Call to Interrupt Procedure 中描述。

于是，从entry_INT80_32开始执行，其定义在 arch/x86/entry/entry_32.S:

```S
ENTRY(entry_INT80_32)
    ASM_CLAC
    pushl   %eax            /* pt_regs->orig_ax */
    SAVE_ALL pt_regs_ax=$-ENOSYS    /* save rest */

    /*
     * User mode is traced as though IRQs are on, and the interrupt gate
     * turned them off.
     */
    TRACE_IRQS_OFF

    movl    %esp, %eax
    call    do_int80_syscall_32
...
```

它将存在eax中的系统调用号压入堆栈中，然后调用 SAVE_ALL 将其他寄存器的值压入堆栈进行保存。例如：

```S
.macro SAVE_ALL pt_regs_ax=%eax
    cld
    PUSH_GS
    pushl   %fs
    pushl   %es
    pushl   %ds
    pushl   \pt_regs_ax
    pushl   %ebp
    pushl   %edi
    pushl   %esi
    pushl   %edx
    pushl   %ecx
    pushl   %ebx
    movl    $(__USER_DS), %edx
    movl    %edx, %ds
    movl    %edx, %es
    movl    $(__KERNEL_PERCPU), %edx
    movl    %edx, %fs
    SET_KERNEL_GS %edx
.endm
```

保存完毕后，关闭中断，将当前栈指针保存到 eax，调用 do_int80_syscall_32 => do_syscall_32_irqs_on， 该函数在 arch/x86/entry/common.c 中定义：

```c
static __always_inline void do_syscall_32_irqs_on(struct pt_regs *regs)
{
    struct thread_info *ti = current_thread_info();
    unsigned int nr = (unsigned int)regs->orig_ax;

#ifdef CONFIG_IA32_EMULATION
    current->thread.status |= TS_COMPAT;
#endif

    if (READ_ONCE(ti->flags) & _TIF_WORK_SYSCALL_ENTRY) {
        /*
         * Subtlety here: if ptrace pokes something larger than
         * 2^32-1 into orig_ax, this truncates it.  This may or
         * may not be necessary, but it matches the old asm
         * behavior.
         */
        nr = syscall_trace_enter(regs);
    }

    if (likely(nr < IA32_NR_syscalls)) {
        /*
         * It's possible that a 32-bit syscall implementation
         * takes a 64-bit parameter but nonetheless assumes that
         * the high bits are zero.  Make sure we zero-extend all
         * of the args.
         */
        regs->ax = ia32_sys_call_table[nr](
            (unsigned int)regs->bx, (unsigned int)regs->cx,
            (unsigned int)regs->dx, (unsigned int)regs->si,
            (unsigned int)regs->di, (unsigned int)regs->bp);
    }

    syscall_return_slowpath(regs);
}
```

这个函数的参数 regs(struct pt_regs 定义见 arch/x86/include/asm/ptrace.h )就是先前在 entry_INT80_32 依次被压入栈的寄存器值。这里先取出系统调用号，从系统调用表(ia32_sys_call_table) 中取出对应的处理函数，然后通过先前寄存器中的参数调用之。

系统调用表 ia32_sys_call_table 在 arch/x86/entry/syscall_32.c 中定义，但内容有点奇怪，看上去表的内容是 include 进来的：

```c
/* System call table for i386. */

#include <linux/linkage.h>
#include <linux/sys.h>
#include <linux/cache.h>
#include <asm/asm-offsets.h>
#include <asm/syscall.h>

#define __SYSCALL_I386(nr, sym, qual) extern asmlinkage long sym(unsigned long, unsigned long, unsigned long, unsigned long, unsigned long, unsigned long) ;
#include <asm/syscalls_32.h>
#undef __SYSCALL_I386

#define __SYSCALL_I386(nr, sym, qual) [nr] = sym,

extern asmlinkage long sys_ni_syscall(unsigned long, unsigned long, unsigned long, unsigned long, unsigned long, unsigned long);

__visible const sys_call_ptr_t ia32_sys_call_table[__NR_syscall_compat_max+1] = {
    /*
     * Smells like a compiler bug -- it doesn't work
     * when the & below is removed.
     */
    [0 ... __NR_syscall_compat_max] = &sys_ni_syscall,
#include <asm/syscalls_32.h>
};
```

到源代码的 arch/x86/include/asm 目录下找不到 syscall_32.h （不同系统不同)，但在编译kernel后的 arch/x86/include/generated/asm里发现它：

```c
__SYSCALL_I386(0, sys_restart_syscall, )
__SYSCALL_I386(1, sys_exit, )
#ifdef CONFIG_X86_32
__SYSCALL_I386(2, sys_fork, )
#else
__SYSCALL_I386(2, sys_fork, )
#endif
__SYSCALL_I386(3, sys_read, )
__SYSCALL_I386(4, sys_write, )
#ifdef CONFIG_X86_32
__SYSCALL_I386(5, sys_open, )
#else
__SYSCALL_I386(5, compat_sys_open, )
...
```

这说明 syscall_32.h 是在编译过程中动态生成的，请看脚本arch/x86/entry/syscalls/syscalltbl.sh，它读取了同目录下的 syscall_32.tbl ，为每一有效行都生成了 __SYSCALL_${abi}($nr, $real_entry, $qualifier) 结构。然后在宏 __SYSCALL_I386 的作用下形成了这样的定义：
```c
__visible const sys_call_ptr_t ia32_sys_call_table[__NR_syscall_compat_max+1] = {
   [0 ... __NR_syscall_compat_max] = &sys_ni_syscall,

   [0] = sys_restart_syscall,
   [1] = sys_exit,
   [2] = sys_fork,
   [3] = sys_read,
   [4] = sys_write,
   [5] = sys_open,
   ...
};
```

根据 [gcc 文档](https://gcc.gnu.org/onlinedocs/gcc/Designated-Inits.html) 这样的初始化方法在 ISO C99 中定义。是一种混淆做法。

上面例子中 eax为0x5 ，即调用号为 0x5，所以调用了 sys_open，操作在 fs/open.c 中定义：

```c
SYSCALL_DEFINE3(open, const char __user *, filename, int, flags, umode_t, mode)
{
    if (force_o_largefile())
        flags |= O_LARGEFILE;

    return do_sys_open(AT_FDCWD, filename, flags, mode);
}
```

宏 SYSCALL_DEFINE 3 及相关定义如下

```c
#define SYSCALL_DEFINE3(name, ...) SYSCALL_DEFINEx(3, _##name, __VA_ARGS__)

#define SYSCALL_DEFINEx(x, sname, ...)                \
        SYSCALL_METADATA(sname, x, __VA_ARGS__)       \
        __SYSCALL_DEFINEx(x, sname, __VA_ARGS__)

#define __SYSCALL_DEFINEx(x, name, ...)                                 \
        asmlinkage long sys##name(__MAP(x,__SC_DECL,__VA_ARGS__))       \
                __attribute__((alias(__stringify(SyS##name))));         \
                                                                        \
        static inline long SYSC##name(__MAP(x,__SC_DECL,__VA_ARGS__));  \
                                                                        \
        asmlinkage long SyS##name(__MAP(x,__SC_LONG,__VA_ARGS__));      \
                                                                        \
        asmlinkage long SyS##name(__MAP(x,__SC_LONG,__VA_ARGS__))       \
        {                                                               \
                long ret = SYSC##name(__MAP(x,__SC_CAST,__VA_ARGS__));  \
                __MAP(x,__SC_TEST,__VA_ARGS__);                         \
                __PROTECT(x, ret,__MAP(x,__SC_ARGS,__VA_ARGS__));       \
                return ret;                                             \
        }                                                               \
                                                                        \
        static inline long SYSC##name(__MAP(x,__SC_DECL,__VA_ARGS__))
```
SYSCALL_METADATA 保存了调用的基本信息，供调试程序跟踪使用( kernel 需开启 CONFIG_FTRACE_SYSCALLS )。

而 __SYSCALL_DEFINEx 用于拼接函数，函数名被拼接为 sys##_##open，参数也通过 __SC_DECL 拼接，最终得到展开后的定义：

```c
asmlinkage long sys_open(const char __user * filename, int flags, umode_t mode)
{
    if (force_o_largefile())
        flags |= O_LARGEFILE;

    return do_sys_open(AT_FDCWD, filename, flags, mode);
}
```
sys_open 是对 do_sys_open 的封装：

long do_sys_open(int dfd, const char __user *filename, int flags, umode_t mode)
{
    struct open_flags op;
    int fd = build_open_flags(flags, mode, &op);
    struct filename *tmp;

    if (fd)
        return fd;

    tmp = getname(filename);
    if (IS_ERR(tmp))
        return PTR_ERR(tmp);

    fd = get_unused_fd_flags(flags);
    if (fd >= 0) {
        struct file *f = do_filp_open(dfd, tmp, &op);
        if (IS_ERR(f)) {
            put_unused_fd(fd);
            fd = PTR_ERR(f);
        } else {
            fsnotify_open(f);
            fd_install(fd, f);
        }
    }
    putname(tmp);
    return fd;
}
getname 将处于用户态的文件名拷到内核态，然后通过 get_unused_fd_flags 获取一个没用过的文件描述符，然后 do_filp_open 创建 struct file ， fd_install 将 fd 和 struct file 绑定(task_struct->files->fdt[fd] = file)，然后返回 fd。

fd一直返回到 do_syscall_32_irqs_on ，被设置到 regs->ax (eax) 中。接着返回 entry_INT80_32 继续执行，最后执行 INTERRUPT_RETURN 。 INTERRUPT_RETURN 在 arch/x86/include/asm/irqflags.h 中定义为 iret ，负责恢复先前压栈的寄存器，返回用户态。系统调用执行完毕。

在目前主流的系统调用库(glibc) 中，int 0x80 只有在硬件不支持快速系统调用(sysenter / syscall)的时候才会调用，但目前的硬件都支持快速系统调用，所以为了能够看看 int 0x80 的效果，我们手撸汇编：

#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int main(){
    char * filename = "/tmp/test";
    char * buffer = malloc(80);
    memset(buffer, 0, 80);
    int count;
    __asm__ __volatile__("movl $0x5, %%eax\n\t"
                         "movl %1, %%ebx\n\t"
                         "movl $0, %%ecx\n\t"
                         "movl $0664, %%edx\n\t"
                         "int $0x80\n\t"
                         "movl %%eax, %%ebx\n\t"
                         "movl $0x3, %%eax\n\t"
                         "movl %2, %%ecx\n\t"
                         "movl $80, %%edx\n\t"
                         "int $0x80\n\t"
                         "movl %%eax, %0\n\t"
                         :"=m"(count)
                         :"g"(filename), "g"(buffer)
                         :"%eax", "%ebx", "%ecx", "%edx");
    printf("%d\n", count);
    printf("%s\n", buffer);
    free(buffer);
}
这段代码首先通过 int 0x80 调用系统调用 open 得到 fd (由 eax 返回)，再作为 read 的参数传入，从而读出了文件中的内容。但比较奇怪的是如果 buffer 存储在栈中 (buffer[80])，则调用 read 失败。只有将 buffer 作为全局变量或存储在堆中，才能调用成功。希望有知道的大大指点一下。

#### sysenter/sysexit

这一对方法是 32位 intel中提出的快速系统调用，和同期AMD的 syscall/sysret 机制类似。

之前，使用软中断（int80）实现系统调用速度很慢，于是 intel x86 cpu 自 Pentium II 后，开始支持此类方法。syscall 方法是将ring3 到 ring0，而 sysret 方法是从 ring0 到 ring3。其中，没有特权级别检查（CPL，DPL），也没有压栈操作，所以速度较快。

在 Intel SDM 中阐述了sysenter指令。首先 CPU 有一堆特殊的寄存器，名为 Model-Specific Register(MSR)，这些寄存器在操作系统运行过程中起着重要作用。对于这些寄存器，需要采用专门的指令 RDMSR 和 WRMSR 进行读写。

sysenter 用到了以下 MSR (定义在 arch/x86/include/asm/msr-index.h)：

- IA32_SYSENTER_CS(174H)：存放内核态处理代码的段选择符
- IA32_SYSENTER_EIP(175H)：存放内核态栈顶偏移量
- IA32_SYSENTER_ESP(176H)：存放内核态处理代码偏移量

当执行 sysenter 时，执行以下操作：

- 清除 FLAGS 的 VM 标志，确保在保护模式下运行
- 清除 FLAGS 的 IF 标志，屏蔽中断
- 加载 IA32_SYSENTER_ESP 的值到 esp
- 加载 IA32_SYSENTER_EIP 的值到 eip
- 加载 SYSENTER_CS_MSR 的值到 CS
- 将 SYSENTER_CS_MSR + 8 的值加载到 ss 。因为在GDT中， ss 就跟在 cs 后面
- 开始执行(cs:eip)指向的代码

这些 MSR 在 arch/x86/kernel/cpu/common.c 的 enable_sep_cpu 中初始化：

```c
void enable_sep_cpu(void)
{
    struct tss_struct *tss;
    int cpu;

    if (!boot_cpu_has(X86_FEATURE_SEP))
        return;

    cpu = get_cpu();
    tss = &per_cpu(cpu_tss, cpu);

    /*
     * We cache MSR_IA32_SYSENTER_CS's value in the TSS's ss1 field --
     * see the big comment in struct x86_hw_tss's definition.
     */

    tss->x86_tss.ss1 = __KERNEL_CS;
    wrmsr(MSR_IA32_SYSENTER_CS, tss->x86_tss.ss1, 0);

    wrmsr(MSR_IA32_SYSENTER_ESP,
          (unsigned long)tss + offsetofend(struct tss_struct, SYSENTER_stack),
          0);

    wrmsr(MSR_IA32_SYSENTER_EIP, (unsigned long)entry_SYSENTER_32, 0);

    put_cpu();
}
```

这里将 __KERNEL_CS 设置到 MSR_IA32_SYSENTER_CS 中，将 tss.SYSENTER_stack 地址设置到 MSR_IA32_SYSENTER_ESP 中，最后将内核入口点 entry_SYSENTER_32 的地址设置到 MSR_IA32_SYSENTER_EIP 中。

当用户程序进行系统调用时，实际上在用户态中最终会调用到 VDSO 中映射的 __kernel_vsyscall ，其定义位于 arch/x86/entry/vdso/vdso32/system_call.S：

```S
__kernel_vsyscall:
    CFI_STARTPROC
    pushl   %ecx
    CFI_ADJUST_CFA_OFFSET   4
    CFI_REL_OFFSET      ecx, 0
    pushl   %edx
    CFI_ADJUST_CFA_OFFSET   4
    CFI_REL_OFFSET      edx, 0
    pushl   %ebp
    CFI_ADJUST_CFA_OFFSET   4
    CFI_REL_OFFSET      ebp, 0

    #define SYSENTER_SEQUENCE   "movl %esp, %ebp; sysenter"
    #define SYSCALL_SEQUENCE    "movl %ecx, %ebp; syscall"

#ifdef CONFIG_X86_64
    /* If SYSENTER (Intel) or SYSCALL32 (AMD) is available, use it. */
    ALTERNATIVE_2 "", SYSENTER_SEQUENCE, X86_FEATURE_SYSENTER32, \
                      SYSCALL_SEQUENCE,  X86_FEATURE_SYSCALL32
#else
    ALTERNATIVE "", SYSENTER_SEQUENCE, X86_FEATURE_SEP
#endif

    /* Enter using int $0x80 */
    int $0x80
GLOBAL(int80_landing_pad)

    /*
     * Restore EDX and ECX in case they were clobbered.  EBP is not
     * clobbered (the kernel restores it), but its cleaner and
     * probably faster to pop it than to adjust ESP using addl.
     */
    popl    %ebp
    CFI_RESTORE     ebp
    CFI_ADJUST_CFA_OFFSET   -4
    popl    %edx
    CFI_RESTORE     edx
    CFI_ADJUST_CFA_OFFSET   -4
    popl    %ecx
    CFI_RESTORE     ecx
    CFI_ADJUST_CFA_OFFSET   -4
    ret
    CFI_ENDPROC

    .size __kernel_vsyscall,.-__kernel_vsyscall
    .previous
```

__kernel_vsyscall 首先将寄存器当前值压栈保存，因为这些寄存器以后要用作系统调用传参。然后填入参数，调用 sysenter

ALTERNATIVE_2 宏实际上是在做选择，如果支持 X86_FEATURE_SYSENTER32(Intel CPU) ，则执行 SYSENTER_SEQUENCE ，如果支持 X86_FEATURE_SYSCALL32(AMD CPU)，则执行 SYSCALL_SEQUENCE 。如果都不支持，那么啥都不干(???)。如果啥都没干，那么接着往下执行，即执行 int $0x80，退化到传统(legacy)方式进行系统调用。

注意 sysenter 指令会覆盖掉 esp ，因此 SYSENTER_SEQUENCE 中会将当前 esp 保存到 ebp 中。sysenter 同样会覆盖 eip ，但由于返回地址是固定的(__kernel_vsyscall 函数结尾)，因此无需保存。

前文提到过，执行了 sysenter 指令之后直接切换到内核态，同时寄存器也都设置好了：eip 被设置为 IA32_SYSENTER_EIP 即 entry_SYSENTER_32 的地址，其定义在arch/x86/entry/entry_32.S中：

```s
ENTRY(entry_SYSENTER_32)
    movl    TSS_sysenter_sp0(%esp), %esp
sysenter_past_esp:
    pushl   $__USER_DS      /* pt_regs->ss */
    pushl   %ebp            /* pt_regs->sp (stashed in bp) */
    pushfl              /* pt_regs->flags (except IF = 0) */
    orl $X86_EFLAGS_IF, (%esp)  /* Fix IF */
    pushl   $__USER_CS      /* pt_regs->cs */
    pushl   $0          /* pt_regs->ip = 0 (placeholder) */
    pushl   %eax            /* pt_regs->orig_ax */
    SAVE_ALL pt_regs_ax=$-ENOSYS    /* save rest */

    testl   $X86_EFLAGS_NT|X86_EFLAGS_AC|X86_EFLAGS_TF, PT_EFLAGS(%esp)
    jnz .Lsysenter_fix_flags
.Lsysenter_flags_fixed:

    /*
     * User mode is traced as though IRQs are on, and SYSENTER
     * turned them off.
     */
    TRACE_IRQS_OFF

    movl    %esp, %eax
    call    do_fast_syscall_32
...

/* arch/x86/kernel/asm-offsets_32.c */
/* Offset from the sysenter stack to tss.sp0 */
DEFINE(TSS_sysenter_sp0, offsetof(struct cpu_entry_area, tss.x86_tss.sp0) -
       offsetofend(struct cpu_entry_area, entry_stack_page.stack));
```

前文提到过，sysenter 会将 IA32_SYSENTER_ESP 加载到 esp 中，但 IA32_SYSENTER_ESP 保存的是 SYSENTER_stack 的地址，需要通过 TSS_sysenter_sp0 进行修正，指向进程的内核栈。

然后开始按照 pt_regs 的结构将相关寄存器中的值压入栈中，包括在 sysenter 前保存到 ebp 的用户态栈顶指针。由于 eip 无需保存，于是压入 0 用于占位。

最后调用 do_fast_syscall_32 ，该函数在 arch/x86/entry/common.c 中定义：

```c

/* Returns 0 to return using IRET or 1 to return using SYSEXIT/SYSRETL. */
__visible long do_fast_syscall_32(struct pt_regs *regs)
{
    /*
     * Called using the internal vDSO SYSENTER/SYSCALL32 calling
     * convention.  Adjust regs so it looks like we entered using int80.
     */

    unsigned long landing_pad = (unsigned long)current->mm->context.vdso +
        vdso_image_32.sym_int80_landing_pad;

    /*
     * SYSENTER loses EIP, and even SYSCALL32 needs us to skip forward
     * so that 'regs->ip -= 2' lands back on an int $0x80 instruction.
     * Fix it up.
     */
    regs->ip = landing_pad;

    enter_from_user_mode();

    local_irq_enable();

    /* Fetch EBP from where the vDSO stashed it. */
    if (
#ifdef CONFIG_X86_64
        /*
         * Micro-optimization: the pointer we're following is explicitly
         * 32 bits, so it can't be out of range.
         */
        __get_user(*(u32 *)&regs->bp,
                (u32 __user __force *)(unsigned long)(u32)regs->sp)
#else
        get_user(*(u32 *)&regs->bp,
             (u32 __user __force *)(unsigned long)(u32)regs->sp)
#endif
        ) {

        /* User code screwed up. */
        local_irq_disable();
        regs->ax = -EFAULT;
        prepare_exit_to_usermode(regs);
        return 0;   /* Keep it simple: use IRET. */
    }

    /* Now this is just like a normal syscall. */
    do_syscall_32_irqs_on(regs);

#ifdef CONFIG_X86_64
    /*
     * Opportunistic SYSRETL: if possible, try to return using SYSRETL.
     * SYSRETL is available on all 64-bit CPUs, so we don't need to
     * bother with SYSEXIT.
     *
     * Unlike 64-bit opportunistic SYSRET, we can't check that CX == IP,
     * because the ECX fixup above will ensure that this is essentially
     * never the case.
     */
    return regs->cs == __USER32_CS && regs->ss == __USER_DS &&
        regs->ip == landing_pad &&
        (regs->flags & (X86_EFLAGS_RF | X86_EFLAGS_TF)) == 0;
#else
    /*
     * Opportunistic SYSEXIT: if possible, try to return using SYSEXIT.
     *
     * Unlike 64-bit opportunistic SYSRET, we can't check that CX == IP,
     * because the ECX fixup above will ensure that this is essentially
     * never the case.
     *
     * We don't allow syscalls at all from VM86 mode, but we still
     * need to check VM, because we might be returning from sys_vm86.
     */
    return static_cpu_has(X86_FEATURE_SEP) &&
        regs->cs == __USER_CS && regs->ss == __USER_DS &&
        regs->ip == landing_pad &&
        (regs->flags & (X86_EFLAGS_RF | X86_EFLAGS_TF | X86_EFLAGS_VM)) == 0;
#endif
}
```
由于没有保存 eip，我们需要计算系统调用完毕后返回到用户态的地址：current->mm->context.vdso + vdso_image_32.sym_int80_landing_pad (即跳过 sym_int80_landing_pad 来到 __kernel_vsyscall 的结尾) 覆盖掉先前压栈的 0 。

接下来就和 int 0x80 的流程一样，通过 do_syscall_32_irqs_on 从系统调用表中找到相应的处理函数进行调用。完成后，如果都符合 sysexit 的要求，返回 1，否则返回 0 。

```S
...
    call    do_fast_syscall_32
    /* XEN PV guests always use IRET path */
    ALTERNATIVE "testl %eax, %eax; jz .Lsyscall_32_done", \
            "jmp .Lsyscall_32_done", X86_FEATURE_XENPV

/* Opportunistic SYSEXIT */
    TRACE_IRQS_ON           /* User mode traces as IRQs on. */
    movl    PT_EIP(%esp), %edx  /* pt_regs->ip */
    movl    PT_OLDESP(%esp), %ecx   /* pt_regs->sp */
1:  mov PT_FS(%esp), %fs
    PTGS_TO_GS
    popl    %ebx            /* pt_regs->bx */
    addl    $2*4, %esp      /* skip pt_regs->cx and pt_regs->dx */
    popl    %esi            /* pt_regs->si */
    popl    %edi            /* pt_regs->di */
    popl    %ebp            /* pt_regs->bp */
    popl    %eax            /* pt_regs->ax */

    /*
     * Restore all flags except IF. (We restore IF separately because
     * STI gives a one-instruction window in which we won't be interrupted,
     * whereas POPF does not.)
     */
    addl    $PT_EFLAGS-PT_DS, %esp  /* point esp at pt_regs->flags */
    btr $X86_EFLAGS_IF_BIT, (%esp)
    popfl

    /*
     * Return back to the vDSO, which will pop ecx and edx.
     * Don't bother with DS and ES (they already contain __USER_DS).
     */
    sti
    sysexit
```
根据 testl %eax, %eax; jz .Lsyscall_32_done ，如果 do_fast_syscall_32 的返回值(eax)为 0 ，表示不支持快速返回，于是跳转到 Lsyscall_32_done ，通过 iret 返回。否则继续执行下面代码，将内核栈中保存的值保存到相应寄存器中，然后通过 sysexit 返回。

注意这里将原有的 eip 设置到 edx、 esp 设置到 ecx ，这是因为根据 Intel SDM，sysexit 会用 edx 来设置 eip，用 ecx 来设置 esp ，从而指向先前用户空间的代码偏移和栈偏移。并加载 SYSENTER_CS_MSR+16 到 cs，加载 SYSENTER_CS_MSR+24 到 ss 。如此一来就回到了用户态的 __kernel_vsyscall 尾端。

##### 实验
我们通过 gdb 一个 C 程序来检验一下：
```S
#include <unistd.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <fcntl.h>

int main(int argc, char *argv[]){
    char buffer[80] = "/tmp/test";
    int fd = open(buffer, O_RDONLY);
    int size = read(fd, buffer, sizeof(buffer));
    close(fd);
}



$ gcc -m32 -g -static -o read read.c
$ file read
read: ELF 32-bit LSB executable, Intel 80386, version 1 (GNU/Linux), statically linked, for GNU/Linux 2.6.32, BuildID[sha1]=8a7f3d69d3e4c9582551934b0617ad78e492e48c, not stripped



[txt]
(gdb) disas
   0x0804888a <+14>:    push   %ecx
   0x0804888b <+15>:    sub    $0x70,%esp
   0x0804888e <+18>:    mov    %ecx,%eax
   0x08048890 <+20>:    mov    0x4(%eax),%eax
   0x08048893 <+23>:    mov    %eax,-0x6c(%ebp)
   0x08048896 <+26>:    mov    %gs:0x14,%eax
   0x0804889c <+32>:    mov    %eax,-0xc(%ebp)
   0x0804889f <+35>:    xor    %eax,%eax
   0x080488a1 <+37>:    movl   $0x706d742f,-0x5c(%ebp)
   0x080488a8 <+44>:    movl   $0x7365742f,-0x58(%ebp)
   0x080488af <+51>:    movl   $0x74,-0x54(%ebp)
   0x080488b6 <+58>:    lea    -0x50(%ebp),%edx
   0x080488b9 <+61>:    mov    $0x0,%eax
   0x080488be <+66>:    mov    $0x11,%ecx
   0x080488c3 <+71>:    mov    %edx,%edi
   0x080488c5 <+73>:    rep stos %eax,%es:(%edi)
   0x080488c7 <+75>:    sub    $0x8,%esp
   0x080488ca <+78>:    push   $0x0
   0x080488cc <+80>:    lea    -0x5c(%ebp),%eax
   0x080488cf <+83>:    push   %eax
   0x080488d0 <+84>:    call   0x806cf30 <open>
   0x080488d5 <+89>:    add    $0x10,%esp
   0x080488d8 <+92>:    mov    %eax,-0x64(%ebp)
   0x080488db <+95>:    sub    $0x4,%esp
   0x080488de <+98>:    push   $0x50
   0x080488e0 <+100>:   lea    -0x5c(%ebp),%eax
   0x080488e3 <+103>:   push   %eax
   0x080488e4 <+104>:   pushl  -0x64(%ebp)
   0x080488e7 <+107>:   call   0x806cfa0 <read>
   0x080488ec <+112>:   add    $0x10,%esp
   0x080488ef <+115>:   mov    %eax,-0x60(%ebp)
=> 0x080488f2 <+118>:   sub    $0xc,%esp
   0x080488f5 <+121>:   pushl  -0x64(%ebp)
   0x080488f8 <+124>:   call   0x806d150 <close>
   0x080488fd <+129>:   add    $0x10,%esp
   0x08048900 <+132>:   mov    $0x0,%eax
   0x08048905 <+137>:   mov    -0xc(%ebp),%edx
   0x08048908 <+140>:   xor    %gs:0x14,%edx
   0x0804890f <+147>:   je     0x8048916 <main+154>
   0x08048911 <+149>:   call   0x806ef90 <__stack_chk_fail>
   0x08048916 <+154>:   lea    -0x8(%ebp),%esp
   0x08048919 <+157>:   pop    %ecx
   0x0804891a <+158>:   pop    %edi
   0x0804891b <+159>:   pop    %ebp
   0x0804891c <+160>:   lea    -0x4(%ecx),%esp
   0x0804891f <+163>:   ret
End of assembler dump.
```

首先是 open ，将将参数 O_RDONLY (根据 #define O_RDONLY 0，值为 0x0 )，将 buffer 地址(eax) 压栈后调用系统调用 glibc 的 open 函数，disas 之：

```S
(gdb) disas 0x806cf30
Dump of assembler code for function open:
   0x0806cf30 <+0>:     cmpl   $0x0,%gs:0xc
   0x0806cf38 <+8>:     jne    0x806cf5f 
   0x0806cf3a <+0>:     push   %ebx
   0x0806cf3b <+1>:     mov    0x10(%esp),%edx
   0x0806cf3f <+5>:     mov    0xc(%esp),%ecx
   0x0806cf43 <+9>:     mov    0x8(%esp),%ebx
   0x0806cf47 <+13>:    mov    $0x5,%eax
   0x0806cf4c <+18>:    call   *0x80ea9f0
   0x0806cf52 <+24>:    pop    %ebx
   0x0806cf53 <+25>:    cmp    $0xfffff001,%eax
   0x0806cf58 <+30>:    jae    0x8070590 <__syscall_error>
   0x0806cf5e <+36>:    ret
   0x0806cf5f <+47>:    call   0x806ea80 <__libc_enable_asynccancel>
   0x0806cf64 <+52>:    push   %eax
   0x0806cf65 <+53>:    push   %ebx
   0x0806cf66 <+54>:    mov    0x14(%esp),%edx
   0x0806cf6a <+58>:    mov    0x10(%esp),%ecx
   0x0806cf6e <+62>:    mov    0xc(%esp),%ebx
   0x0806cf72 <+66>:    mov    $0x5,%eax
   0x0806cf77 <+71>:    call   *0x80ea9f0
   0x0806cf7d <+77>:    pop    %ebx
   0x0806cf7e <+78>:    xchg   %eax,(%esp)
   0x0806cf81 <+81>:    call   0x806eaf0 <__libc_disable_asynccancel>
   0x0806cf86 <+86>:    pop    %eax
   0x0806cf87 <+87>:    cmp    $0xfffff001,%eax
   0x0806cf8c <+92>:    jae    0x8070590 <__syscall_error>
   0x0806cf92 <+98>:    ret
End of assembler dump.
```

将压入栈中的参数保存到寄存器中，然后调用了 0x80ea9f0，用 x 查看该地址的值：
```sh
(gdb) x 0x80ea9f0
0x80ea9f0 <_dl_sysinfo>:        0xf7ffcc80
```
disas 之，发现来到了 __kernel_vsyscall ，并执行了sysenter指令：

```sh
(gdb) disas 0xf7ffcc80
Dump of assembler code for function __kernel_vsyscall:
   0xf7ffcc80 <+0>:     push   %ecx
   0xf7ffcc81 <+1>:     push   %edx
   0xf7ffcc82 <+2>:     push   %ebp
   0xf7ffcc83 <+3>:     mov    %esp,%ebp
   0xf7ffcc85 <+5>:     sysenter
   0xf7ffcc87 <+7>:     int    $0x80
   0xf7ffcc89 <+9>:     pop    %ebp
   0xf7ffcc8a <+10>:    pop    %edx
   0xf7ffcc8b <+11>:    pop    %ecx
   0xf7ffcc8c <+12>:    ret
End of assembler dump.
```

read 同理，只是有三个参数，需要 push 三次而已。

### syscall/sysret

前文提到过，在32位下 Intel 和 AMD 对快速系统调用指令的定义有分歧，一个使用 sysenter ，另一个使用 syscall 。但到了64位下，为啥都统一成 syscall 了呢？关于这个在网上也没有找到权威的答案，但在 64 位架构的开发上，Intel 和 AMD 选择了不同的道路：Intel搞出了一套全新的架构，名为安腾(IA-64)，这套架构性能完爆x86，这样用户为了更好的性能需要进行硬件换代，岂不是喜滋滋？然而这种做法在商业上取得了失败。因为 IA-64 架构虽然提高了性能，却不能向后兼容，即原来能在 x86 下跑的程序到新架构下就跑不了了，用户非常 angry 。AMD 就比较厚道，老老实实地做出了兼容 x86 的 x86_64 ，能够运行 32 位下的程序。于是农企日常翻身，逼得 Intel 反过来兼容 x86_64 架构，于是只能支持 AMD 标准中定义的 syscall 了。

这次我们直接从gdb出发，同样是之前的代码，只是这次编译成 64 位：
```S
(gdb) disas
Dump of assembler code for function main:
   0x00000000004009ae <+0>:     push   %rbp
   0x00000000004009af <+1>:     mov    %rsp,%rbp
   0x00000000004009b2 <+4>:     add    $0xffffffffffffff80,%rsp
   0x00000000004009b6 <+8>:     mov    %edi,-0x74(%rbp)
   0x00000000004009b9 <+11>:    mov    %rsi,-0x80(%rbp)
   0x00000000004009bd <+15>:    mov    %fs:0x28,%rax
   0x00000000004009c6 <+24>:    mov    %rax,-0x8(%rbp)
   0x00000000004009ca <+28>:    xor    %eax,%eax
   0x00000000004009cc <+30>:    movabs $0x7365742f706d742f,%rax
   0x00000000004009d6 <+40>:    mov    %rax,-0x60(%rbp)
   0x00000000004009da <+44>:    movq   $0x74,-0x58(%rbp)
   0x00000000004009e2 <+52>:    lea    -0x50(%rbp),%rdx
   0x00000000004009e6 <+56>:    mov    $0x0,%eax
   0x00000000004009eb <+61>:    mov    $0x8,%ecx
   0x00000000004009f0 <+66>:    mov    %rdx,%rdi
   0x00000000004009f3 <+69>:    rep stos %rax,%es:(%rdi)
   0x00000000004009f6 <+72>:    lea    -0x60(%rbp),%rax
   0x00000000004009fa <+76>:    mov    $0x0,%esi
   0x00000000004009ff <+81>:    mov    %rax,%rdi
   0x0000000000400a02 <+84>:    mov    $0x0,%eax
   0x0000000000400a07 <+89>:    callq  0x43e650 <open64>
   0x0000000000400a0c <+94>:    mov    %eax,-0x68(%rbp)
   0x0000000000400a0f <+97>:    lea    -0x60(%rbp),%rcx
   0x0000000000400a13 <+101>:   mov    -0x68(%rbp),%eax
   0x0000000000400a16 <+104>:   mov    $0x50,%edx
   0x0000000000400a1b <+109>:   mov    %rcx,%rsi
   0x0000000000400a1e <+112>:   mov    %eax,%edi
   0x0000000000400a20 <+114>:   callq  0x43e6b0 <read>
   0x0000000000400a25 <+119>:   mov    %eax,-0x64(%rbp)
=> 0x0000000000400a28 <+122>:   mov    -0x68(%rbp),%eax
   0x0000000000400a2b <+125>:   mov    %eax,%edi
   0x0000000000400a2d <+127>:   callq  0x43e900 <close>
   0x0000000000400a32 <+132>:   mov    $0x0,%eax
   0x0000000000400a37 <+137>:   mov    -0x8(%rbp),%rdx
   0x0000000000400a3b <+141>:   xor    %fs:0x28,%rdx
   0x0000000000400a44 <+150>:   je     0x400a4b <main+157>
   0x0000000000400a46 <+152>:   callq  0x442010 <__stack_chk_fail>
   0x0000000000400a4b <+157>:   leaveq
   0x0000000000400a4c <+158>:   retq
End of assembler dump.


(gdb) disas 0x43e650
Dump of assembler code for function open64:
   0x000000000043e650 <+0>:     cmpl   $0x0,0x28db65(%rip)        # 0x6cc1bc <__libc_multiple_threads>
   0x000000000043e657 <+7>:     jne    0x43e66d <open64+29>
   0x000000000043e659 <+0>:     mov    $0x2,%eax
   0x000000000043e65e <+5>:     syscall
   0x000000000043e660 <+7>:     cmp    $0xfffffffffffff001,%rax
   0x000000000043e666 <+13>:    jae    0x4436b0 <__syscall_error>
   0x000000000043e66c <+19>:    retq
   0x000000000043e66d <+29>:    sub    $0x8,%rsp
   0x000000000043e671 <+33>:    callq  0x441b70 <__libc_enable_asynccancel>
   0x000000000043e676 <+38>:    mov    %rax,(%rsp)
   0x000000000043e67a <+42>:    mov    $0x2,%eax
   0x000000000043e67f <+47>:    syscall
   0x000000000043e681 <+49>:    mov    (%rsp),%rdi
   0x000000000043e685 <+53>:    mov    %rax,%rdx
   0x000000000043e688 <+56>:    callq  0x441bd0 <__libc_disable_asynccancel>
   0x000000000043e68d <+61>:    mov    %rdx,%rax
   0x000000000043e690 <+64>:    add    $0x8,%rsp
   0x000000000043e694 <+68>:    cmp    $0xfffffffffffff001,%rax
   0x000000000043e69a <+74>:    jae    0x4436b0 <__syscall_error>
   0x000000000043e6a0 <+80>:    retq
End of assembler dump.
```
open64 定义在 glibc 的 sysdeps/posix/open64.c中：
```c
#include <fcntl.h>
#include <stdarg.h>
#include <sysdep-cancel.h>

/* Open FILE with access OFLAG.  If O_CREAT or O_TMPFILE is in OFLAG,
   a third argument is the file protection.  */
int
__libc_open64 (const char *file, int oflag, ...)
{
    int mode = 0;

    if (__OPEN_NEEDS_MODE (oflag))
    {
        va_list arg;
        va_start (arg, oflag);
        mode = va_arg (arg, int);
        va_end (arg);
    }

    if (SINGLE_THREAD_P)
        return __libc_open (file, oflag | O_LARGEFILE, mode);

    int oldtype = LIBC_CANCEL_ASYNC ();

    int result = __libc_open (file, oflag | O_LARGEFILE, mode);

    LIBC_CANCEL_RESET (oldtype);

    return result;
}
weak_alias (__libc_open64, __open64)
libc_hidden_weak (__open64)
weak_alias (__libc_open64, open64)
```
再看 __libc_open ，定义在 unix/sysv/linux/generic/open.c ：
```c
#include <errno.h>
#include <fcntl.h>
#include <stdarg.h>
#include <stdio.h>
#include <sysdep-cancel.h>

/* Open FILE with access OFLAG.  If O_CREAT or O_TMPFILE is in OFLAG,
   a third argument is the file protection.  */
int
__libc_open (const char *file, int oflag, ...)
{
    int mode = 0;

    if (__OPEN_NEEDS_MODE (oflag))
    {
        va_list arg;
        va_start (arg, oflag);
        mode = va_arg (arg, int);
        va_end (arg);
    }
    return SYSCALL_CANCEL (openat, AT_FDCWD, file, oflag, mode);
}
```

我们将宏展开：
```
SYSCALL_CANCEL(openat, AT_FDCWD, file, oflag, mode)
=> __SYSCALL_CALL(openat, AT_FDCWD, file, oflag, mode)
=> __SYSCALL_DISP(__SYSCALL, openat, AT_FDCWD, file, oflag, mode)
=> __SYSCALL_CONCAT(__SYSCALL, 4)(openat, AT_FDCWD, file, oflag, mode)
=> __SYSCALL_CONCAT_X(__SYSCALL, 4)(openat, AT_FDCWD, file, oflag, mode)
=> __SYSCALL5(openat, AT_FDCWD, file, oflag, mode)
=> INLINE_SYSCALL (openat, 4, AT_FDCWD, file, oflag, mode)
=> INTERNAL_SYSCALL (openat, _, 4, AT_FDCWD, file, oflag, mode)
=> INTERNAL_SYSCALL_NCS (__NR_openat, _, 4, AT_FDCWD, file, oflag, mode)
```

最终到达 INTERNAL_SYSCALL_NCS ：

```c
# define INTERNAL_SYSCALL_NCS(name, err, nr, args...) \
  ({                                          \
    unsigned long int resultvar;                          \
    LOAD_ARGS_##nr (args)                             \
    LOAD_REGS_##nr                                \
    asm volatile (                                \
    "syscall\n\t"                                 \
    : "=a" (resultvar)                                \
    : "0" (name) ASM_ARGS_##nr : "memory", REGISTERS_CLOBBERED_BY_SYSCALL);   \
    (long int) resultvar; })
```

LOAD_ARGS_##nr 负责把参数 args 展开，然后由 LOAD_REGS_##nr 设置到相应的寄存器中，因为 syscall 通过寄存器传参。最终调用 syscall 。

根据 Intel SDM，syscall 会将当前 rip 存到 rcx ，然后将 IA32_LSTAR 加载到 rip 。同时将 IA32_STAR[47:32] 加载到cs，IA32_STAR[47:32] + 8 加载到 ss (在 GDT 中，ss 就跟在 cs 后面)。

MSR IA32_LSTAR (MSR_LSTAR) 和 IA32_STAR (MSR_STAR) 在 arch/x86/kernel/cpu/common.c 的 syscall_init 中初始化：

```c
void syscall_init(void)
{
    wrmsr(MSR_STAR, 0, (__USER32_CS << 16) | __KERNEL_CS);
    wrmsrl(MSR_LSTAR, (unsigned long)entry_SYSCALL_64);

#ifdef CONFIG_IA32_EMULATION
    wrmsrl(MSR_CSTAR, (unsigned long)entry_SYSCALL_compat);
    /*
     * This only works on Intel CPUs.
     * On AMD CPUs these MSRs are 32-bit, CPU truncates MSR_IA32_SYSENTER_EIP.
     * This does not cause SYSENTER to jump to the wrong location, because
     * AMD doesnot allow SYSENTER in long mode (either 32- or 64-bit).
     */
    wrmsrl_safe(MSR_IA32_SYSENTER_CS, (u64)__KERNEL_CS);
    wrmsrl_safe(MSR_IA32_SYSENTER_ESP, 0ULL);
    wrmsrl_safe(MSR_IA32_SYSENTER_EIP, (u64)entry_SYSENTER_compat);
#else
    wrmsrl(MSR_CSTAR, (unsigned long)ignore_sysret);
    wrmsrl_safe(MSR_IA32_SYSENTER_CS, (u64)GDT_ENTRY_INVALID_SEG);
    wrmsrl_safe(MSR_IA32_SYSENTER_ESP, 0ULL);
    wrmsrl_safe(MSR_IA32_SYSENTER_EIP, 0ULL);
#endif

    /* Flags to clear on syscall */
    wrmsrl(MSR_SYSCALL_MASK,
           X86_EFLAGS_TF|X86_EFLAGS_DF|X86_EFLAGS_IF|
           X86_EFLAGS_IOPL|X86_EFLAGS_AC|X86_EFLAGS_NT);
}
```

可以看到 MSR_STAR 的第 32-47 位设置为 kernel mode 的 cs，48-63位设置为 user mode 的 cs。而 IA32_LSTAR 被设置为函数 entry_SYSCALL_64 的起始地址。

于是 syscall 时，跳转到 entry_SYSCALL_64 开始执行，其定义在 arch/x86/entry/entry_64.S：

```S
ENTRY(entry_SYSCALL_64)
    /*
     * Interrupts are off on entry.
     * We do not frame this tiny irq-off block with TRACE_IRQS_OFF/ON,
     * it is too small to ever cause noticeable irq latency.
     */
    SWAPGS_UNSAFE_STACK
    // KAISER 进内核态需要切到内核页表
    SWITCH_KERNEL_CR3_NO_STACK
    /*
     * A hypervisor implementation might want to use a label
     * after the swapgs, so that it can do the swapgs
     * for the guest and jump here on syscall.
     */
GLOBAL(entry_SYSCALL_64_after_swapgs)
    // 将用户栈偏移保存到 per-cpu 变量 rsp_scratch 中
    movq    %rsp, PER_CPU_VAR(rsp_scratch)
    // 加载内核栈偏移
    movq    PER_CPU_VAR(cpu_current_top_of_stack), %rsp

    TRACE_IRQS_OFF

    /* Construct struct pt_regs on stack */
    pushq   $__USER_DS          /* pt_regs->ss */
    pushq   PER_CPU_VAR(rsp_scratch)    /* pt_regs->sp */
    pushq   %r11                /* pt_regs->flags */
    pushq   $__USER_CS          /* pt_regs->cs */
    pushq   %rcx                /* pt_regs->ip */
    pushq   %rax                /* pt_regs->orig_ax */
    pushq   %rdi                /* pt_regs->di */
    pushq   %rsi                /* pt_regs->si */
    pushq   %rdx                /* pt_regs->dx */
    pushq   %rcx                /* pt_regs->cx */
    pushq   $-ENOSYS            /* pt_regs->ax */
    pushq   %r8             /* pt_regs->r8 */
    pushq   %r9             /* pt_regs->r9 */
    pushq   %r10                /* pt_regs->r10 */
    pushq   %r11                /* pt_regs->r11 */
    // 为r12-r15, rbp, rbx保留位置
    sub $(6*8), %rsp            /* pt_regs->bp, bx, r12-15 not saved */

    /*
     * If we need to do entry work or if we guess we will need to do
     * exit work, go straight to the slow path.
     */
    movq    PER_CPU_VAR(current_task), %r11
    testl   $_TIF_WORK_SYSCALL_ENTRY|_TIF_ALLWORK_MASK, TASK_TI_flags(%r11)
    jnz entry_SYSCALL64_slow_path

entry_SYSCALL_64_fastpath:
    /*
     * Easy case: enable interrupts and issue the syscall.  If the syscall
     * needs pt_regs, we will call a stub that disables interrupts again
     * and jumps to the slow path.
     */
    TRACE_IRQS_ON
    ENABLE_INTERRUPTS(CLBR_NONE)
#if __SYSCALL_MASK == ~0
    // 确保系统调用号没超过最大值，超过了则跳转到后面的符号 1 处进行返回
    cmpq    $__NR_syscall_max, %rax
#else
    andl    $__SYSCALL_MASK, %eax
    cmpl    $__NR_syscall_max, %eax
#endif
    ja  1f              /* return -ENOSYS (already in pt_regs->ax) */
    // 除系统调用外的其他调用都通过 rcx 来传第四个参数，因此将 r10 的内容设置到 rcx
    movq    %r10, %rcx

    /*
     * This call instruction is handled specially in stub_ptregs_64.
     * It might end up jumping to the slow path.  If it jumps, RAX
     * and all argument registers are clobbered.
     */
    // 调用系统调用表中对应的函数
    call    *sys_call_table(, %rax, 8)
.Lentry_SYSCALL_64_after_fastpath_call:
    // 将函数返回值压到栈中，返回时弹出
    movq    %rax, RAX(%rsp)
1:

    /*
     * If we get here, then we know that pt_regs is clean for SYSRET64.
     * If we see that no exit work is required (which we are required
     * to check with IRQs off), then we can go straight to SYSRET64.
     */
    DISABLE_INTERRUPTS(CLBR_NONE)
    TRACE_IRQS_OFF
    movq    PER_CPU_VAR(current_task), %r11
    testl   $_TIF_ALLWORK_MASK, TASK_TI_flags(%r11)
    jnz 1f

    LOCKDEP_SYS_EXIT
    TRACE_IRQS_ON       /* user mode is traced as IRQs on */
    movq    RIP(%rsp), %rcx
    movq    EFLAGS(%rsp), %r11
    RESTORE_C_REGS_EXCEPT_RCX_R11
    /*
     * This opens a window where we have a user CR3, but are
     * running in the kernel.  This makes using the CS
     * register useless for telling whether or not we need to
     * switch CR3 in NMIs.  Normal interrupts are OK because
     * they are off here.
     */
    SWITCH_USER_CR3
    movq    RSP(%rsp), %rsp
    USERGS_SYSRET64

1:
    /*
     * The fast path looked good when we started, but something changed
     * along the way and we need to switch to the slow path.  Calling
     * raise(3) will trigger this, for example.  IRQs are off.
     */
    TRACE_IRQS_ON
    ENABLE_INTERRUPTS(CLBR_NONE)
    SAVE_EXTRA_REGS
    movq    %rsp, %rdi
    call    syscall_return_slowpath /* returns with IRQs disabled */
    jmp return_from_SYSCALL_64

entry_SYSCALL64_slow_path:
    /* IRQs are off. */
    SAVE_EXTRA_REGS
    movq    %rsp, %rdi
    call    do_syscall_64       /* returns with IRQs disabled */

return_from_SYSCALL_64:
    RESTORE_EXTRA_REGS
    TRACE_IRQS_IRETQ        /* we're about to change IF */

    /*
     * Try to use SYSRET instead of IRET if we're returning to
     * a completely clean 64-bit userspace context.
     */
    movq    RCX(%rsp), %rcx
    movq    RIP(%rsp), %r11
    cmpq    %rcx, %r11          /* RCX == RIP */
    jne opportunistic_sysret_failed

    /*
     * On Intel CPUs, SYSRET with non-canonical RCX/RIP will #GP
     * in kernel space.  This essentially lets the user take over
     * the kernel, since userspace controls RSP.
     *
     * If width of "canonical tail" ever becomes variable, this will need
     * to be updated to remain correct on both old and new CPUs.
     */
    .ifne __VIRTUAL_MASK_SHIFT - 47
    .error "virtual address width changed -- SYSRET checks need update"
    .endif

    /* Change top 16 bits to be the sign-extension of 47th bit */
    shl $(64 - (__VIRTUAL_MASK_SHIFT+1)), %rcx
    sar $(64 - (__VIRTUAL_MASK_SHIFT+1)), %rcx

    /* If this changed %rcx, it was not canonical */
    cmpq    %rcx, %r11
    jne opportunistic_sysret_failed

    cmpq    $__USER_CS, CS(%rsp)        /* CS must match SYSRET */
    jne opportunistic_sysret_failed

    movq    R11(%rsp), %r11
    cmpq    %r11, EFLAGS(%rsp)      /* R11 == RFLAGS */
    jne opportunistic_sysret_failed

    /*
     * SYSCALL clears RF when it saves RFLAGS in R11 and SYSRET cannot
     * restore RF properly. If the slowpath sets it for whatever reason, we
     * need to restore it correctly.
     *
     * SYSRET can restore TF, but unlike IRET, restoring TF results in a
     * trap from userspace immediately after SYSRET.  This would cause an
     * infinite loop whenever #DB happens with register state that satisfies
     * the opportunistic SYSRET conditions.  For example, single-stepping
     * this user code:
     *
     *           movq   $stuck_here, %rcx
     *           pushfq
     *           popq %r11
     *   stuck_here:
     *
     * would never get past 'stuck_here'.
     */
    testq   $(X86_EFLAGS_RF|X86_EFLAGS_TF), %r11
    jnz opportunistic_sysret_failed

    /* nothing to check for RSP */

    cmpq    $__USER_DS, SS(%rsp)        /* SS must match SYSRET */
    jne opportunistic_sysret_failed

    /*
     * We win! This label is here just for ease of understanding
     * perf profiles. Nothing jumps here.
     */
syscall_return_via_sysret:
    /* rcx and r11 are already restored (see code above) */
    RESTORE_C_REGS_EXCEPT_RCX_R11
    /*
     * This opens a window where we have a user CR3, but are
     * running in the kernel.  This makes using the CS
     * register useless for telling whether or not we need to
     * switch CR3 in NMIs.  Normal interrupts are OK because
     * they are off here.
     */
    // KAISER 返回用户态需要切回用户页表
    SWITCH_USER_CR3
    /* 根据压栈的内容，恢复 rsp 为用户态的栈顶 */
    movq    RSP(%rsp), %rsp
    USERGS_SYSRET64

    // 无法快速返回，只能退化到 iret
opportunistic_sysret_failed:
    /*
     * This opens a window where we have a user CR3, but are
     * running in the kernel.  This makes using the CS
     * register useless for telling whether or not we need to
     * switch CR3 in NMIs.  Normal interrupts are OK because
     * they are off here.
     */
    SWITCH_USER_CR3
    SWAPGS
    jmp restore_c_regs_and_iret
END(entry_SYSCALL_64)

```

注意 syscall 不会保存栈指针，因此 handler 首先将当前用户态栈偏移 rsp 存到 per-cpu 变量 rsp_scratch 中，然后将 per-cpu 变量 cpu_current_top_of_stack ，即内核态的栈偏移加载到 rsp。

随后将各寄存器中的值压入内核态的栈中，包括：

```
rax system call number
rcx return address
r11 saved rflags (note: r11 is callee-clobbered register in C ABI)
rdi arg0
rsi arg1
rdx arg2
r10 arg3 (needs to be moved to rcx to conform to C ABI)
r8 arg4
r9 arg5
```

接着根据系统调用号从系统调用表(sys_call_table) 中找到相应的处理函数，如 sys_open ，进行调用。64位下系统调用定义在 arch/x86/entry/syscalls/syscall_64.tbl中，ABI 和 32 位不同。

如果一切顺利的话，最终通过 USERGS_SYSRET64 ，即 sysretq 返回。

### 总结
本文主要分析了Linux下的三种系统调用方式：int 0x80 ，sysenter 和 syscall 。

传统系统调用(int 0x80) 通过中断/异常实现，在执行 int 指令时，发生 trap。硬件找到在中断描述符表中的表项，在自动切换到内核栈 (tss.ss0 : tss.esp0) 后根据中断描述符的 segment selector 在 GDT / LDT 中找到对应的段描述符，从段描述符拿到段的基址，加载到 cs ，将 offset 加载到 eip。最后硬件将 ss / sp / eflags / cs / ip / error code 依次压到内核栈。返回时，iret 将先前压栈的 ss / sp / eflags / cs / ip 弹出，恢复用户态调用时的寄存器上下文。

sysenter 和 syscall 是为了加速系统调用所引入的新指令，通过引入新的 MSR 来存放内核态的代码和栈的段号和偏移量，从而实现快速跳转：

在调用 sysenter 时将 SYSENTER_CS_MSR 加载到 cs，将 SYSENTER_CS_MSR + 8 加载到 ss，将 IA32_SYSENTER_EIP 加载到 eip ，将 IA32_SYSENTER_ESP 加载到 esp ，整套切换到内核态。返回时，sysexit 将 IA32_SYSENTER_CS + 16 加载到 cs ，将 IA32_SYSENTER_CS + 24 加载到 cs ，而 eip 和 esp 分别从 edx 和 ecx 中加载，因此返回前应该将压栈的用户态 eip(计算出来的) 和 esp(调用前用户态保存到 ebp 进行传递) 设置到这两个寄存器中。

在调用 syscall 时，会自动将 rip 保存到 rcx ，然后将 IA32_LSTAR 加载到 rip 。同时将 `IA32_STAR[47:32]` 加载到 cs ，`IA32_STAR[47:32] + 8` 加载到 ss 。栈顶指针的切换会延迟到内核态系统调用入口点 entry_SYSCALL_64 后进行处理，将用户态栈偏移 rsp 存到 per-cpu 变量 rsp_scratch 中，然后将 per-cpu 变量 cpu_current_top_of_stack ，即内核态的栈偏移加载到 rsp。返回时，sysret 将 `IA32_STAR[63:48] `加载到 cs ，`IA32_STAR[63:48] + 8` 加载到 ss ，而 rip 从 rcx 中加载，因此返回前应该将压栈的用户态 rip 设置到 rcx 中。对于 rsp ，返回前根据先前压栈内容先设置为用户态 rsp。



## syscall for 32-bit reference

#ifndef _ASM_X86_UNISTD_32_H
#define _ASM_X86_UNISTD_32_H 1

#define __NR_restart_syscall 0
#define __NR_exit 1
#define __NR_fork 2
#define __NR_read 3
#define __NR_write 4
#define __NR_open 5
#define __NR_close 6
#define __NR_waitpid 7
#define __NR_creat 8
#define __NR_link 9
#define __NR_unlink 10
#define __NR_execve 11
#define __NR_chdir 12
#define __NR_time 13
#define __NR_mknod 14
#define __NR_chmod 15
#define __NR_lchown 16
#define __NR_break 17
#define __NR_oldstat 18
#define __NR_lseek 19
#define __NR_getpid 20
#define __NR_mount 21
#define __NR_umount 22
#define __NR_setuid 23
#define __NR_getuid 24
#define __NR_stime 25
#define __NR_ptrace 26
#define __NR_alarm 27
#define __NR_oldfstat 28
#define __NR_pause 29
#define __NR_utime 30
#define __NR_stty 31
#define __NR_gtty 32
#define __NR_access 33
#define __NR_nice 34
#define __NR_ftime 35
#define __NR_sync 36
#define __NR_kill 37
#define __NR_rename 38
#define __NR_mkdir 39
#define __NR_rmdir 40
#define __NR_dup 41
#define __NR_pipe 42
#define __NR_times 43
#define __NR_prof 44
#define __NR_brk 45
#define __NR_setgid 46
#define __NR_getgid 47
#define __NR_signal 48
#define __NR_geteuid 49
#define __NR_getegid 50
#define __NR_acct 51
#define __NR_umount2 52
#define __NR_lock 53
#define __NR_ioctl 54
#define __NR_fcntl 55
#define __NR_mpx 56
#define __NR_setpgid 57
#define __NR_ulimit 58
#define __NR_oldolduname 59
#define __NR_umask 60
#define __NR_chroot 61
#define __NR_ustat 62
#define __NR_dup2 63
#define __NR_getppid 64
#define __NR_getpgrp 65
#define __NR_setsid 66
#define __NR_sigaction 67
#define __NR_sgetmask 68
#define __NR_ssetmask 69
#define __NR_setreuid 70
#define __NR_setregid 71
#define __NR_sigsuspend 72
#define __NR_sigpending 73
#define __NR_sethostname 74
#define __NR_setrlimit 75
#define __NR_getrlimit 76
#define __NR_getrusage 77
#define __NR_gettimeofday 78
#define __NR_settimeofday 79
#define __NR_getgroups 80
#define __NR_setgroups 81
#define __NR_select 82
#define __NR_symlink 83
#define __NR_oldlstat 84
#define __NR_readlink 85
#define __NR_uselib 86
#define __NR_swapon 87
#define __NR_reboot 88
#define __NR_readdir 89
#define __NR_mmap 90
#define __NR_munmap 91
#define __NR_truncate 92
#define __NR_ftruncate 93
#define __NR_fchmod 94
#define __NR_fchown 95
#define __NR_getpriority 96
#define __NR_setpriority 97
#define __NR_profil 98
#define __NR_statfs 99
#define __NR_fstatfs 100
#define __NR_ioperm 101
#define __NR_socketcall 102
#define __NR_syslog 103
#define __NR_setitimer 104
#define __NR_getitimer 105
#define __NR_stat 106
#define __NR_lstat 107
#define __NR_fstat 108
#define __NR_olduname 109
#define __NR_iopl 110
#define __NR_vhangup 111
#define __NR_idle 112
#define __NR_vm86old 113
#define __NR_wait4 114
#define __NR_swapoff 115
#define __NR_sysinfo 116
#define __NR_ipc 117
#define __NR_fsync 118
#define __NR_sigreturn 119
#define __NR_clone 120
#define __NR_setdomainname 121
#define __NR_uname 122
#define __NR_modify_ldt 123
#define __NR_adjtimex 124
#define __NR_mprotect 125
#define __NR_sigprocmask 126
#define __NR_create_module 127
#define __NR_init_module 128
#define __NR_delete_module 129
#define __NR_get_kernel_syms 130
#define __NR_quotactl 131
#define __NR_getpgid 132
#define __NR_fchdir 133
#define __NR_bdflush 134
#define __NR_sysfs 135
#define __NR_personality 136
#define __NR_afs_syscall 137
#define __NR_setfsuid 138
#define __NR_setfsgid 139
#define __NR__llseek 140
#define __NR_getdents 141
#define __NR__newselect 142
#define __NR_flock 143
#define __NR_msync 144
#define __NR_readv 145
#define __NR_writev 146
#define __NR_getsid 147
#define __NR_fdatasync 148
#define __NR__sysctl 149
#define __NR_mlock 150
#define __NR_munlock 151
#define __NR_mlockall 152
#define __NR_munlockall 153
#define __NR_sched_setparam 154
#define __NR_sched_getparam 155
#define __NR_sched_setscheduler 156
#define __NR_sched_getscheduler 157
#define __NR_sched_yield 158
#define __NR_sched_get_priority_max 159
#define __NR_sched_get_priority_min 160
#define __NR_sched_rr_get_interval 161
#define __NR_nanosleep 162
#define __NR_mremap 163
#define __NR_setresuid 164
#define __NR_getresuid 165
#define __NR_vm86 166
#define __NR_query_module 167
#define __NR_poll 168
#define __NR_nfsservctl 169
#define __NR_setresgid 170
#define __NR_getresgid 171
#define __NR_prctl 172
#define __NR_rt_sigreturn 173
#define __NR_rt_sigaction 174
#define __NR_rt_sigprocmask 175
#define __NR_rt_sigpending 176
#define __NR_rt_sigtimedwait 177
#define __NR_rt_sigqueueinfo 178
#define __NR_rt_sigsuspend 179
#define __NR_pread64 180
#define __NR_pwrite64 181
#define __NR_chown 182
#define __NR_getcwd 183
#define __NR_capget 184
#define __NR_capset 185
#define __NR_sigaltstack 186
#define __NR_sendfile 187
#define __NR_getpmsg 188
#define __NR_putpmsg 189
#define __NR_vfork 190
#define __NR_ugetrlimit 191
#define __NR_mmap2 192
#define __NR_truncate64 193
#define __NR_ftruncate64 194
#define __NR_stat64 195
#define __NR_lstat64 196
#define __NR_fstat64 197
#define __NR_lchown32 198
#define __NR_getuid32 199
#define __NR_getgid32 200
#define __NR_geteuid32 201
#define __NR_getegid32 202
#define __NR_setreuid32 203
#define __NR_setregid32 204
#define __NR_getgroups32 205
#define __NR_setgroups32 206
#define __NR_fchown32 207
#define __NR_setresuid32 208
#define __NR_getresuid32 209
#define __NR_setresgid32 210
#define __NR_getresgid32 211
#define __NR_chown32 212
#define __NR_setuid32 213
#define __NR_setgid32 214
#define __NR_setfsuid32 215
#define __NR_setfsgid32 216
#define __NR_pivot_root 217
#define __NR_mincore 218
#define __NR_madvise 219
#define __NR_getdents64 220
#define __NR_fcntl64 221
#define __NR_gettid 224
#define __NR_readahead 225
#define __NR_setxattr 226
#define __NR_lsetxattr 227
#define __NR_fsetxattr 228
#define __NR_getxattr 229
#define __NR_lgetxattr 230
#define __NR_fgetxattr 231
#define __NR_listxattr 232
#define __NR_llistxattr 233
#define __NR_flistxattr 234
#define __NR_removexattr 235
#define __NR_lremovexattr 236
#define __NR_fremovexattr 237
#define __NR_tkill 238
#define __NR_sendfile64 239
#define __NR_futex 240
#define __NR_sched_setaffinity 241
#define __NR_sched_getaffinity 242
#define __NR_set_thread_area 243
#define __NR_get_thread_area 244
#define __NR_io_setup 245
#define __NR_io_destroy 246
#define __NR_io_getevents 247
#define __NR_io_submit 248
#define __NR_io_cancel 249
#define __NR_fadvise64 250
#define __NR_exit_group 252
#define __NR_lookup_dcookie 253
#define __NR_epoll_create 254
#define __NR_epoll_ctl 255
#define __NR_epoll_wait 256
#define __NR_remap_file_pages 257
#define __NR_set_tid_address 258
#define __NR_timer_create 259
#define __NR_timer_settime 260
#define __NR_timer_gettime 261
#define __NR_timer_getoverrun 262
#define __NR_timer_delete 263
#define __NR_clock_settime 264
#define __NR_clock_gettime 265
#define __NR_clock_getres 266
#define __NR_clock_nanosleep 267
#define __NR_statfs64 268
#define __NR_fstatfs64 269
#define __NR_tgkill 270
#define __NR_utimes 271
#define __NR_fadvise64_64 272
#define __NR_vserver 273
#define __NR_mbind 274
#define __NR_get_mempolicy 275
#define __NR_set_mempolicy 276
#define __NR_mq_open 277
#define __NR_mq_unlink 278
#define __NR_mq_timedsend 279
#define __NR_mq_timedreceive 280
#define __NR_mq_notify 281
#define __NR_mq_getsetattr 282
#define __NR_kexec_load 283
#define __NR_waitid 284
#define __NR_add_key 286
#define __NR_request_key 287
#define __NR_keyctl 288
#define __NR_ioprio_set 289
#define __NR_ioprio_get 290
#define __NR_inotify_init 291
#define __NR_inotify_add_watch 292
#define __NR_inotify_rm_watch 293
#define __NR_migrate_pages 294
#define __NR_openat 295
#define __NR_mkdirat 296
#define __NR_mknodat 297
#define __NR_fchownat 298
#define __NR_futimesat 299
#define __NR_fstatat64 300
#define __NR_unlinkat 301
#define __NR_renameat 302
#define __NR_linkat 303
#define __NR_symlinkat 304
#define __NR_readlinkat 305
#define __NR_fchmodat 306
#define __NR_faccessat 307
#define __NR_pselect6 308
#define __NR_ppoll 309
#define __NR_unshare 310
#define __NR_set_robust_list 311
#define __NR_get_robust_list 312
#define __NR_splice 313
#define __NR_sync_file_range 314
#define __NR_tee 315
#define __NR_vmsplice 316
#define __NR_move_pages 317
#define __NR_getcpu 318
#define __NR_epoll_pwait 319
#define __NR_utimensat 320
#define __NR_signalfd 321
#define __NR_timerfd_create 322
#define __NR_eventfd 323
#define __NR_fallocate 324
#define __NR_timerfd_settime 325
#define __NR_timerfd_gettime 326
#define __NR_signalfd4 327
#define __NR_eventfd2 328
#define __NR_epoll_create1 329
#define __NR_dup3 330
#define __NR_pipe2 331
#define __NR_inotify_init1 332
#define __NR_preadv 333
#define __NR_pwritev 334
#define __NR_rt_tgsigqueueinfo 335
#define __NR_perf_event_open 336
#define __NR_recvmmsg 337
#define __NR_fanotify_init 338
#define __NR_fanotify_mark 339
#define __NR_prlimit64 340
#define __NR_name_to_handle_at 341
#define __NR_open_by_handle_at 342
#define __NR_clock_adjtime 343
#define __NR_syncfs 344
#define __NR_sendmmsg 345
#define __NR_setns 346
#define __NR_process_vm_readv 347
#define __NR_process_vm_writev 348
#define __NR_kcmp 349
#define __NR_finit_module 350
#define __NR_sched_setattr 351
#define __NR_sched_getattr 352
#define __NR_renameat2 353
#define __NR_seccomp 354
#define __NR_getrandom 355
#define __NR_memfd_create 356
#define __NR_bpf 357
#define __NR_execveat 358
#define __NR_socket 359
#define __NR_socketpair 360
#define __NR_bind 361
#define __NR_connect 362
#define __NR_listen 363
#define __NR_accept4 364
#define __NR_getsockopt 365
#define __NR_setsockopt 366
#define __NR_getsockname 367
#define __NR_getpeername 368
#define __NR_sendto 369
#define __NR_sendmsg 370
#define __NR_recvfrom 371
#define __NR_recvmsg 372
#define __NR_shutdown 373
#define __NR_userfaultfd 374
#define __NR_membarrier 375
#define __NR_mlock2 376
#define __NR_copy_file_range 377
#define __NR_preadv2 378
#define __NR_pwritev2 379
#define __NR_pkey_mprotect 380
#define __NR_pkey_alloc 381
#define __NR_pkey_free 382
#define __NR_statx 383
#define __NR_arch_prctl 384
#define __NR_io_pgetevents 385
#define __NR_rseq 386
#define __NR_semget 393
#define __NR_semctl 394
#define __NR_shmget 395
#define __NR_shmctl 396
#define __NR_shmat 397
#define __NR_shmdt 398
#define __NR_msgget 399
#define __NR_msgsnd 400
#define __NR_msgrcv 401
#define __NR_msgctl 402
#define __NR_clock_gettime64 403
#define __NR_clock_settime64 404
#define __NR_clock_adjtime64 405
#define __NR_clock_getres_time64 406
#define __NR_clock_nanosleep_time64 407
#define __NR_timer_gettime64 408
#define __NR_timer_settime64 409
#define __NR_timerfd_gettime64 410
#define __NR_timerfd_settime64 411
#define __NR_utimensat_time64 412
#define __NR_pselect6_time64 413
#define __NR_ppoll_time64 414
#define __NR_io_pgetevents_time64 416
#define __NR_recvmmsg_time64 417
#define __NR_mq_timedsend_time64 418
#define __NR_mq_timedreceive_time64 419
#define __NR_semtimedop_time64 420
#define __NR_rt_sigtimedwait_time64 421
#define __NR_futex_time64 422
#define __NR_sched_rr_get_interval_time64 423
#define __NR_pidfd_send_signal 424
#define __NR_io_uring_setup 425
#define __NR_io_uring_enter 426
#define __NR_io_uring_register 427
#define __NR_open_tree 428
#define __NR_move_mount 429
#define __NR_fsopen 430
#define __NR_fsconfig 431
#define __NR_fsmount 432
#define __NR_fspick 433
#define __NR_pidfd_open 434
#define __NR_clone3 435
#define __NR_close_range 436
#define __NR_openat2 437
#define __NR_pidfd_getfd 438
#define __NR_faccessat2 439
#define __NR_process_madvise 440

## syscall for 64-bit reference

> source: https://filippo.io/linux-syscall-table/

指令： syscall
返回值：%rax

系统调用（syscall）通常在 entry point 列中以命名函数形式被实现，或者使用  `DEFINE_SYSCALLx(%name% macro.` 方式实现。

%rax	Name	Entry point	Implementation
0	read	sys_read	fs/read_write.c
1	write	sys_write	fs/read_write.c
2	open	sys_open	fs/open.c
3	close	sys_close	fs/open.c
4	stat	sys_newstat	fs/stat.c
5	fstat	sys_newfstat	fs/stat.c
6	lstat	sys_newlstat	fs/stat.c
7	poll	sys_poll	fs/select.c
8	lseek	sys_lseek	fs/read_write.c
9	mmap	sys_mmap	arch/x86/kernel/sys_x86_64.c
10	mprotect	sys_mprotect	mm/mprotect.c
11	munmap	sys_munmap	mm/mmap.c
12	brk	sys_brk	mm/mmap.c
13	rt_sigaction	sys_rt_sigaction	kernel/signal.c
14	rt_sigprocmask	sys_rt_sigprocmask	kernel/signal.c
15	rt_sigreturn	stub_rt_sigreturn	arch/x86/kernel/signal.c
16	ioctl	sys_ioctl	fs/ioctl.c
17	pread64	sys_pread64	fs/read_write.c
18	pwrite64	sys_pwrite64	fs/read_write.c
19	readv	sys_readv	fs/read_write.c
20	writev	sys_writev	fs/read_write.c
21	access	sys_access	fs/open.c
22	pipe	sys_pipe	fs/pipe.c
23	select	sys_select	fs/select.c
24	sched_yield	sys_sched_yield	kernel/sched/core.c
25	mremap	sys_mremap	mm/mmap.c
26	msync	sys_msync	mm/msync.c
27	mincore	sys_mincore	mm/mincore.c
28	madvise	sys_madvise	mm/madvise.c
29	shmget	sys_shmget	ipc/shm.c
30	shmat	sys_shmat	ipc/shm.c
31	shmctl	sys_shmctl	ipc/shm.c
32	dup	sys_dup	fs/file.c
33	dup2	sys_dup2	fs/file.c
34	pause	sys_pause	kernel/signal.c
35	nanosleep	sys_nanosleep	kernel/hrtimer.c
36	getitimer	sys_getitimer	kernel/itimer.c
37	alarm	sys_alarm	kernel/timer.c
38	setitimer	sys_setitimer	kernel/itimer.c
39	getpid	sys_getpid	kernel/sys.c
40	sendfile	sys_sendfile64	fs/read_write.c
41	socket	sys_socket	net/socket.c
42	connect	sys_connect	net/socket.c
43	accept	sys_accept	net/socket.c
44	sendto	sys_sendto	net/socket.c
45	recvfrom	sys_recvfrom	net/socket.c
46	sendmsg	sys_sendmsg	net/socket.c
47	recvmsg	sys_recvmsg	net/socket.c
48	shutdown	sys_shutdown	net/socket.c
    %rdi int fd   ; %rsi int how

49	bind	sys_bind	net/socket.c
50	listen	sys_listen	net/socket.c
51	getsockname	sys_getsockname	net/socket.c
52	getpeername	sys_getpeername	net/socket.c
53	socketpair	sys_socketpair	net/socket.c
54	setsockopt	sys_setsockopt	net/socket.c
55	getsockopt	sys_getsockopt	net/socket.c
56	clone	stub_clone	kernel/fork.c
57	fork	stub_fork	kernel/fork.c
58	vfork	stub_vfork	kernel/fork.c
59	execve	stub_execve	fs/exec.c
60	exit	sys_exit	kernel/exit.c
61	wait4	sys_wait4	kernel/exit.c
62	kill	sys_kill	kernel/signal.c
63	uname	sys_newuname	kernel/sys.c
64	semget	sys_semget	ipc/sem.c
65	semop	sys_semop	ipc/sem.c
66	semctl	sys_semctl	ipc/sem.c
67	shmdt	sys_shmdt	ipc/shm.c
68	msgget	sys_msgget	ipc/msg.c
69	msgsnd	sys_msgsnd	ipc/msg.c
70	msgrcv	sys_msgrcv	ipc/msg.c
71	msgctl	sys_msgctl	ipc/msg.c
72	fcntl	sys_fcntl	fs/fcntl.c
73	flock	sys_flock	fs/locks.c
74	fsync	sys_fsync	fs/sync.c
75	fdatasync	sys_fdatasync	fs/sync.c
76	truncate	sys_truncate	fs/open.c
77	ftruncate	sys_ftruncate	fs/open.c
78	getdents	sys_getdents	fs/readdir.c
79	getcwd	sys_getcwd	fs/dcache.c
80	chdir	sys_chdir	fs/open.c
81	fchdir	sys_fchdir	fs/open.c
82	rename	sys_rename	fs/namei.c
83	mkdir	sys_mkdir	fs/namei.c
84	rmdir	sys_rmdir	fs/namei.c
85	creat	sys_creat	fs/open.c
86	link	sys_link	fs/namei.c
87	unlink	sys_unlink	fs/namei.c
88	symlink	sys_symlink	fs/namei.c
89	readlink	sys_readlink	fs/stat.c
90	chmod	sys_chmod	fs/open.c
91	fchmod	sys_fchmod	fs/open.c
92	chown	sys_chown	fs/open.c
93	fchown	sys_fchown	fs/open.c
94	lchown	sys_lchown	fs/open.c
95	umask	sys_umask	kernel/sys.c
96	gettimeofday	sys_gettimeofday	kernel/time.c
97	getrlimit	sys_getrlimit	kernel/sys.c
98	getrusage	sys_getrusage	kernel/sys.c
99	sysinfo	sys_sysinfo	kernel/sys.c
100	times	sys_times	kernel/sys.c
101	ptrace	sys_ptrace	kernel/ptrace.c
102	getuid	sys_getuid	kernel/sys.c
103	syslog	sys_syslog	kernel/printk/printk.c
104	getgid	sys_getgid	kernel/sys.c
105	setuid	sys_setuid	kernel/sys.c
106	setgid	sys_setgid	kernel/sys.c
107	geteuid	sys_geteuid	kernel/sys.c
108	getegid	sys_getegid	kernel/sys.c
109	setpgid	sys_setpgid	kernel/sys.c
110	getppid	sys_getppid	kernel/sys.c
111	getpgrp	sys_getpgrp	kernel/sys.c
112	setsid	sys_setsid	kernel/sys.c
113	setreuid	sys_setreuid	kernel/sys.c
114	setregid	sys_setregid	kernel/sys.c
115	getgroups	sys_getgroups	kernel/groups.c
116	setgroups	sys_setgroups	kernel/groups.c
117	setresuid	sys_setresuid	kernel/sys.c
118	getresuid	sys_getresuid	kernel/sys.c
119	setresgid	sys_setresgid	kernel/sys.c
120	getresgid	sys_getresgid	kernel/sys.c
121	getpgid	sys_getpgid	kernel/sys.c
122	setfsuid	sys_setfsuid	kernel/sys.c
123	setfsgid	sys_setfsgid	kernel/sys.c
124	getsid	sys_getsid	kernel/sys.c
125	capget	sys_capget	kernel/capability.c
126	capset	sys_capset	kernel/capability.c
127	rt_sigpending	sys_rt_sigpending	kernel/signal.c
128	rt_sigtimedwait	sys_rt_sigtimedwait	kernel/signal.c
129	rt_sigqueueinfo	sys_rt_sigqueueinfo	kernel/signal.c
130	rt_sigsuspend	sys_rt_sigsuspend	kernel/signal.c
131	sigaltstack	sys_sigaltstack	kernel/signal.c
132	utime	sys_utime	fs/utimes.c
133	mknod	sys_mknod	fs/namei.c
134	uselib		fs/exec.c
135	personality	sys_personality	kernel/exec_domain.c
136	ustat	sys_ustat	fs/statfs.c
137	statfs	sys_statfs	fs/statfs.c
138	fstatfs	sys_fstatfs	fs/statfs.c
139	sysfs	sys_sysfs	fs/filesystems.c
140	getpriority	sys_getpriority	kernel/sys.c
141	setpriority	sys_setpriority	kernel/sys.c
142	sched_setparam	sys_sched_setparam	kernel/sched/core.c
143	sched_getparam	sys_sched_getparam	kernel/sched/core.c
144	sched_setscheduler	sys_sched_setscheduler	kernel/sched/core.c
145	sched_getscheduler	sys_sched_getscheduler	kernel/sched/core.c
146	sched_get_priority_max	sys_sched_get_priority_max	kernel/sched/core.c
147	sched_get_priority_min	sys_sched_get_priority_min	kernel/sched/core.c
148	sched_rr_get_interval	sys_sched_rr_get_interval	kernel/sched/core.c
149	mlock	sys_mlock	mm/mlock.c
150	munlock	sys_munlock	mm/mlock.c
151	mlockall	sys_mlockall	mm/mlock.c
152	munlockall	sys_munlockall	mm/mlock.c
153	vhangup	sys_vhangup	fs/open.c
154	modify_ldt	sys_modify_ldt	arch/x86/um/ldt.c
155	pivot_root	sys_pivot_root	fs/namespace.c
156	_sysctl	sys_sysctl	kernel/sysctl_binary.c
157	prctl	sys_prctl	kernel/sys.c
158	arch_prctl	sys_arch_prctl	arch/x86/um/syscalls_64.c
159	adjtimex	sys_adjtimex	kernel/time.c
160	setrlimit	sys_setrlimit	kernel/sys.c
161	chroot	sys_chroot	fs/open.c
162	sync	sys_sync	fs/sync.c
163	acct	sys_acct	kernel/acct.c
164	settimeofday	sys_settimeofday	kernel/time.c
165	mount	sys_mount	fs/namespace.c
166	umount2	sys_umount	fs/namespace.c
167	swapon	sys_swapon	mm/swapfile.c
168	swapoff	sys_swapoff	mm/swapfile.c
169	reboot	sys_reboot	kernel/reboot.c
170	sethostname	sys_sethostname	kernel/sys.c
171	setdomainname	sys_setdomainname	kernel/sys.c
172	iopl	stub_iopl	arch/x86/kernel/ioport.c
173	ioperm	sys_ioperm	arch/x86/kernel/ioport.c
174	create_module		NOT IMPLEMENTED
175	init_module	sys_init_module	kernel/module.c
176	delete_module	sys_delete_module	kernel/module.c
177	get_kernel_syms		NOT IMPLEMENTED
178	query_module		NOT IMPLEMENTED
179	quotactl	sys_quotactl	fs/quota/quota.c
180	nfsservctl		NOT IMPLEMENTED
181	getpmsg		NOT IMPLEMENTED
182	putpmsg		NOT IMPLEMENTED
183	afs_syscall		NOT IMPLEMENTED
184	tuxcall		NOT IMPLEMENTED
185	security		NOT IMPLEMENTED
186	gettid	sys_gettid	kernel/sys.c
187	readahead	sys_readahead	mm/readahead.c
188	setxattr	sys_setxattr	fs/xattr.c
189	lsetxattr	sys_lsetxattr	fs/xattr.c
190	fsetxattr	sys_fsetxattr	fs/xattr.c
191	getxattr	sys_getxattr	fs/xattr.c
192	lgetxattr	sys_lgetxattr	fs/xattr.c
193	fgetxattr	sys_fgetxattr	fs/xattr.c
194	listxattr	sys_listxattr	fs/xattr.c
195	llistxattr	sys_llistxattr	fs/xattr.c
196	flistxattr	sys_flistxattr	fs/xattr.c
197	removexattr	sys_removexattr	fs/xattr.c
198	lremovexattr	sys_lremovexattr	fs/xattr.c
199	fremovexattr	sys_fremovexattr	fs/xattr.c
200	tkill	sys_tkill	kernel/signal.c
201	time	sys_time	kernel/time.c
202	futex	sys_futex	kernel/futex.c
203	sched_setaffinity	sys_sched_setaffinity	kernel/sched/core.c
204	sched_getaffinity	sys_sched_getaffinity	kernel/sched/core.c
205	set_thread_area		arch/x86/kernel/tls.c
206	io_setup	sys_io_setup	fs/aio.c
207	io_destroy	sys_io_destroy	fs/aio.c
208	io_getevents	sys_io_getevents	fs/aio.c
209	io_submit	sys_io_submit	fs/aio.c
210	io_cancel	sys_io_cancel	fs/aio.c
211	get_thread_area		arch/x86/kernel/tls.c
212	lookup_dcookie	sys_lookup_dcookie	fs/dcookies.c
213	epoll_create	sys_epoll_create	fs/eventpoll.c
214	epoll_ctl_old		NOT IMPLEMENTED
215	epoll_wait_old		NOT IMPLEMENTED
216	remap_file_pages	sys_remap_file_pages	mm/fremap.c
217	getdents64	sys_getdents64	fs/readdir.c
218	set_tid_address	sys_set_tid_address	kernel/fork.c
219	restart_syscall	sys_restart_syscall	kernel/signal.c
220	semtimedop	sys_semtimedop	ipc/sem.c
221	fadvise64	sys_fadvise64	mm/fadvise.c
222	timer_create	sys_timer_create	kernel/posix-timers.c
223	timer_settime	sys_timer_settime	kernel/posix-timers.c
224	timer_gettime	sys_timer_gettime	kernel/posix-timers.c
225	timer_getoverrun	sys_timer_getoverrun	kernel/posix-timers.c
226	timer_delete	sys_timer_delete	kernel/posix-timers.c
227	clock_settime	sys_clock_settime	kernel/posix-timers.c
228	clock_gettime	sys_clock_gettime	kernel/posix-timers.c
229	clock_getres	sys_clock_getres	kernel/posix-timers.c
230	clock_nanosleep	sys_clock_nanosleep	kernel/posix-timers.c
231	exit_group	sys_exit_group	kernel/exit.c
232	epoll_wait	sys_epoll_wait	fs/eventpoll.c
233	epoll_ctl	sys_epoll_ctl	fs/eventpoll.c
234	tgkill	sys_tgkill	kernel/signal.c
235	utimes	sys_utimes	fs/utimes.c
236	vserver		NOT IMPLEMENTED
237	mbind	sys_mbind	mm/mempolicy.c
238	set_mempolicy	sys_set_mempolicy	mm/mempolicy.c
239	get_mempolicy	sys_get_mempolicy	mm/mempolicy.c
240	mq_open	sys_mq_open	ipc/mqueue.c
241	mq_unlink	sys_mq_unlink	ipc/mqueue.c
242	mq_timedsend	sys_mq_timedsend	ipc/mqueue.c
243	mq_timedreceive	sys_mq_timedreceive	ipc/mqueue.c
244	mq_notify	sys_mq_notify	ipc/mqueue.c
245	mq_getsetattr	sys_mq_getsetattr	ipc/mqueue.c
246	kexec_load	sys_kexec_load	kernel/kexec.c
247	waitid	sys_waitid	kernel/exit.c
248	add_key	sys_add_key	security/keys/keyctl.c
249	request_key	sys_request_key	security/keys/keyctl.c
250	keyctl	sys_keyctl	security/keys/keyctl.c
251	ioprio_set	sys_ioprio_set	fs/ioprio.c
252	ioprio_get	sys_ioprio_get	fs/ioprio.c
253	inotify_init	sys_inotify_init	fs/notify/inotify/inotify_user.c
254	inotify_add_watch	sys_inotify_add_watch	fs/notify/inotify/inotify_user.c
255	inotify_rm_watch	sys_inotify_rm_watch	fs/notify/inotify/inotify_user.c
256	migrate_pages	sys_migrate_pages	mm/mempolicy.c
257	openat	sys_openat	fs/open.c
258	mkdirat	sys_mkdirat	fs/namei.c
259	mknodat	sys_mknodat	fs/namei.c
260	fchownat	sys_fchownat	fs/open.c
261	futimesat	sys_futimesat	fs/utimes.c
262	newfstatat	sys_newfstatat	fs/stat.c
263	unlinkat	sys_unlinkat	fs/namei.c
264	renameat	sys_renameat	fs/namei.c
265	linkat	sys_linkat	fs/namei.c
266	symlinkat	sys_symlinkat	fs/namei.c
267	readlinkat	sys_readlinkat	fs/stat.c
268	fchmodat	sys_fchmodat	fs/open.c
269	faccessat	sys_faccessat	fs/open.c
270	pselect6	sys_pselect6	fs/select.c
271	ppoll	sys_ppoll	fs/select.c
272	unshare	sys_unshare	kernel/fork.c
273	set_robust_list	sys_set_robust_list	kernel/futex.c
274	get_robust_list	sys_get_robust_list	kernel/futex.c
275	splice	sys_splice	fs/splice.c
276	tee	sys_tee	fs/splice.c
277	sync_file_range	sys_sync_file_range	fs/sync.c
278	vmsplice	sys_vmsplice	fs/splice.c
279	move_pages	sys_move_pages	mm/migrate.c
280	utimensat	sys_utimensat	fs/utimes.c
281	epoll_pwait	sys_epoll_pwait	fs/eventpoll.c
282	signalfd	sys_signalfd	fs/signalfd.c
283	timerfd_create	sys_timerfd_create	fs/timerfd.c
284	eventfd	sys_eventfd	fs/eventfd.c
285	fallocate	sys_fallocate	fs/open.c
286	timerfd_settime	sys_timerfd_settime	fs/timerfd.c
287	timerfd_gettime	sys_timerfd_gettime	fs/timerfd.c
288	accept4	sys_accept4	net/socket.c
289	signalfd4	sys_signalfd4	fs/signalfd.c
290	eventfd2	sys_eventfd2	fs/eventfd.c
291	epoll_create1	sys_epoll_create1	fs/eventpoll.c
292	dup3	sys_dup3	fs/file.c
293	pipe2	sys_pipe2	fs/pipe.c
294	inotify_init1	sys_inotify_init1	fs/notify/inotify/inotify_user.c
295	preadv	sys_preadv	fs/read_write.c
296	pwritev	sys_pwritev	fs/read_write.c
297	rt_tgsigqueueinfo	sys_rt_tgsigqueueinfo	kernel/signal.c
298	perf_event_open	sys_perf_event_open	kernel/events/core.c
299	recvmmsg	sys_recvmmsg	net/socket.c
300	fanotify_init	sys_fanotify_init	fs/notify/fanotify/fanotify_user.c
301	fanotify_mark	sys_fanotify_mark	fs/notify/fanotify/fanotify_user.c
302	prlimit64	sys_prlimit64	kernel/sys.c
303	name_to_handle_at	sys_name_to_handle_at	fs/fhandle.c
304	open_by_handle_at	sys_open_by_handle_at	fs/fhandle.c
305	clock_adjtime	sys_clock_adjtime	kernel/posix-timers.c
306	syncfs	sys_syncfs	fs/sync.c
307	sendmmsg	sys_sendmmsg	net/socket.c
308	setns	sys_setns	kernel/nsproxy.c
309	getcpu	sys_getcpu	kernel/sys.c
310	process_vm_readv	sys_process_vm_readv	mm/process_vm_access.c
311	process_vm_writev	sys_process_vm_writev	mm/process_vm_access.c
312	kcmp	sys_kcmp	kernel/kcmp.c
313	finit_module	sys_finit_module	kernel/module.c

## 来自chromium 网站的系统调用表

x86_64 (64-bit)
Compiled from Linux 4.14.0 headers.

NR	syscall name	references	%rax	arg0 (%rdi)	arg1 (%rsi)	arg2 (%rdx)	arg3 (%r10)	arg4 (%r8)	arg5 (%r9)
0	read	man/ cs/	0x00	unsigned int fd	char *buf	size_t count	-	-	-
1	write	man/ cs/	0x01	unsigned int fd	const char *buf	size_t count	-	-	-
2	open	man/ cs/	0x02	const char *filename	int flags	umode_t mode	-	-	-
3	close	man/ cs/	0x03	unsigned int fd	-	-	-	-	-
4	stat	man/ cs/	0x04	const char *filename	struct __old_kernel_stat *statbuf	-	-	-	-
5	fstat	man/ cs/	0x05	unsigned int fd	struct __old_kernel_stat *statbuf	-	-	-	-
6	lstat	man/ cs/	0x06	const char *filename	struct __old_kernel_stat *statbuf	-	-	-	-
7	poll	man/ cs/	0x07	struct pollfd *ufds	unsigned int nfds	int timeout	-	-	-
8	lseek	man/ cs/	0x08	unsigned int fd	off_t offset	unsigned int whence	-	-	-
9	mmap	man/ cs/	0x09	?	?	?	?	?	?
10	mprotect	man/ cs/	0x0a	unsigned long start	size_t len	unsigned long prot	-	-	-
11	munmap	man/ cs/	0x0b	unsigned long addr	size_t len	-	-	-	-
12	brk	man/ cs/	0x0c	unsigned long brk	-	-	-	-	-
13	rt_sigaction	man/ cs/	0x0d	int	const struct sigaction *	struct sigaction *	size_t	-	-
14	rt_sigprocmask	man/ cs/	0x0e	int how	sigset_t *set	sigset_t *oset	size_t sigsetsize	-	-
15	rt_sigreturn	man/ cs/	0x0f	?	?	?	?	?	?
16	ioctl	man/ cs/	0x10	unsigned int fd	unsigned int cmd	unsigned long arg	-	-	-
17	pread64	man/ cs/	0x11	unsigned int fd	char *buf	size_t count	loff_t pos	-	-
18	pwrite64	man/ cs/	0x12	unsigned int fd	const char *buf	size_t count	loff_t pos	-	-
19	readv	man/ cs/	0x13	unsigned long fd	const struct iovec *vec	unsigned long vlen	-	-	-
20	writev	man/ cs/	0x14	unsigned long fd	const struct iovec *vec	unsigned long vlen	-	-	-
21	access	man/ cs/	0x15	const char *filename	int mode	-	-	-	-
22	pipe	man/ cs/	0x16	int *fildes	-	-	-	-	-
23	select	man/ cs/	0x17	int n	fd_set *inp	fd_set *outp	fd_set *exp	struct __kernel_old_timeval *tvp	-
24	sched_yield	man/ cs/	0x18	-	-	-	-	-	-
25	mremap	man/ cs/	0x19	unsigned long addr	unsigned long old_len	unsigned long new_len	unsigned long flags	unsigned long new_addr	-
26	msync	man/ cs/	0x1a	unsigned long start	size_t len	int flags	-	-	-
27	mincore	man/ cs/	0x1b	unsigned long start	size_t len	unsigned char * vec	-	-	-
28	madvise	man/ cs/	0x1c	unsigned long start	size_t len	int behavior	-	-	-
29	shmget	man/ cs/	0x1d	key_t key	size_t size	int flag	-	-	-
30	shmat	man/ cs/	0x1e	int shmid	char *shmaddr	int shmflg	-	-	-
31	shmctl	man/ cs/	0x1f	int shmid	int cmd	struct shmid_ds *buf	-	-	-
32	dup	man/ cs/	0x20	unsigned int fildes	-	-	-	-	-
33	dup2	man/ cs/	0x21	unsigned int oldfd	unsigned int newfd	-	-	-	-
34	pause	man/ cs/	0x22	-	-	-	-	-	-
35	nanosleep	man/ cs/	0x23	struct __kernel_timespec *rqtp	struct __kernel_timespec *rmtp	-	-	-	-
36	getitimer	man/ cs/	0x24	int which	struct __kernel_old_itimerval *value	-	-	-	-
37	alarm	man/ cs/	0x25	unsigned int seconds	-	-	-	-	-
38	setitimer	man/ cs/	0x26	int which	struct __kernel_old_itimerval *value	struct __kernel_old_itimerval *ovalue	-	-	-
39	getpid	man/ cs/	0x27	-	-	-	-	-	-
40	sendfile	man/ cs/	0x28	int out_fd	int in_fd	off_t *offset	size_t count	-	-
41	socket	man/ cs/	0x29	int	int	int	-	-	-
42	connect	man/ cs/	0x2a	int	struct sockaddr *	int	-	-	-
43	accept	man/ cs/	0x2b	int	struct sockaddr *	int *	-	-	-
44	sendto	man/ cs/	0x2c	int	void *	size_t	unsigned	struct sockaddr *	int
45	recvfrom	man/ cs/	0x2d	int	void *	size_t	unsigned	struct sockaddr *	int *
46	sendmsg	man/ cs/	0x2e	int fd	struct user_msghdr *msg	unsigned flags	-	-	-
47	recvmsg	man/ cs/	0x2f	int fd	struct user_msghdr *msg	unsigned flags	-	-	-
48	shutdown	man/ cs/	0x30	int	int	-	-	-	-
49	bind	man/ cs/	0x31	int	struct sockaddr *	int	-	-	-
50	listen	man/ cs/	0x32	int	int	-	-	-	-
51	getsockname	man/ cs/	0x33	int	struct sockaddr *	int *	-	-	-
52	getpeername	man/ cs/	0x34	int	struct sockaddr *	int *	-	-	-
53	socketpair	man/ cs/	0x35	int	int	int	int *	-	-
54	setsockopt	man/ cs/	0x36	int fd	int level	int optname	char *optval	int optlen	-
55	getsockopt	man/ cs/	0x37	int fd	int level	int optname	char *optval	int *optlen	-
56	clone	man/ cs/	0x38	unsigned long	unsigned long	int *	int *	unsigned long	-
57	fork	man/ cs/	0x39	-	-	-	-	-	-
58	vfork	man/ cs/	0x3a	-	-	-	-	-	-
59	execve	man/ cs/	0x3b	const char *filename	const char *const *argv	const char *const *envp	-	-	-
60	exit	man/ cs/	0x3c	int error_code	-	-	-	-	-
61	wait4	man/ cs/	0x3d	pid_t pid	int *stat_addr	int options	struct rusage *ru	-	-
62	kill	man/ cs/	0x3e	pid_t pid	int sig	-	-	-	-
63	uname	man/ cs/	0x3f	struct old_utsname *	-	-	-	-	-
64	semget	man/ cs/	0x40	key_t key	int nsems	int semflg	-	-	-
65	semop	man/ cs/	0x41	int semid	struct sembuf *sops	unsigned nsops	-	-	-
66	semctl	man/ cs/	0x42	int semid	int semnum	int cmd	unsigned long arg	-	-
67	shmdt	man/ cs/	0x43	char *shmaddr	-	-	-	-	-
68	msgget	man/ cs/	0x44	key_t key	int msgflg	-	-	-	-
69	msgsnd	man/ cs/	0x45	int msqid	struct msgbuf *msgp	size_t msgsz	int msgflg	-	-
70	msgrcv	man/ cs/	0x46	int msqid	struct msgbuf *msgp	size_t msgsz	long msgtyp	int msgflg	-
71	msgctl	man/ cs/	0x47	int msqid	int cmd	struct msqid_ds *buf	-	-	-
72	fcntl	man/ cs/	0x48	unsigned int fd	unsigned int cmd	unsigned long arg	-	-	-
73	flock	man/ cs/	0x49	unsigned int fd	unsigned int cmd	-	-	-	-
74	fsync	man/ cs/	0x4a	unsigned int fd	-	-	-	-	-
75	fdatasync	man/ cs/	0x4b	unsigned int fd	-	-	-	-	-
76	truncate	man/ cs/	0x4c	const char *path	long length	-	-	-	-
77	ftruncate	man/ cs/	0x4d	unsigned int fd	unsigned long length	-	-	-	-
78	getdents	man/ cs/	0x4e	unsigned int fd	struct linux_dirent *dirent	unsigned int count	-	-	-
79	getcwd	man/ cs/	0x4f	char *buf	unsigned long size	-	-	-	-
80	chdir	man/ cs/	0x50	const char *filename	-	-	-	-	-
81	fchdir	man/ cs/	0x51	unsigned int fd	-	-	-	-	-
82	rename	man/ cs/	0x52	const char *oldname	const char *newname	-	-	-	-
83	mkdir	man/ cs/	0x53	const char *pathname	umode_t mode	-	-	-	-
84	rmdir	man/ cs/	0x54	const char *pathname	-	-	-	-	-
85	creat	man/ cs/	0x55	const char *pathname	umode_t mode	-	-	-	-
86	link	man/ cs/	0x56	const char *oldname	const char *newname	-	-	-	-
87	unlink	man/ cs/	0x57	const char *pathname	-	-	-	-	-
88	symlink	man/ cs/	0x58	const char *old	const char *new	-	-	-	-
89	readlink	man/ cs/	0x59	const char *path	char *buf	int bufsiz	-	-	-
90	chmod	man/ cs/	0x5a	const char *filename	umode_t mode	-	-	-	-
91	fchmod	man/ cs/	0x5b	unsigned int fd	umode_t mode	-	-	-	-
92	chown	man/ cs/	0x5c	const char *filename	uid_t user	gid_t group	-	-	-
93	fchown	man/ cs/	0x5d	unsigned int fd	uid_t user	gid_t group	-	-	-
94	lchown	man/ cs/	0x5e	const char *filename	uid_t user	gid_t group	-	-	-
95	umask	man/ cs/	0x5f	int mask	-	-	-	-	-
96	gettimeofday	man/ cs/	0x60	struct __kernel_old_timeval *tv	struct timezone *tz	-	-	-	-
97	getrlimit	man/ cs/	0x61	unsigned int resource	struct rlimit *rlim	-	-	-	-
98	getrusage	man/ cs/	0x62	int who	struct rusage *ru	-	-	-	-
99	sysinfo	man/ cs/	0x63	struct sysinfo *info	-	-	-	-	-
100	times	man/ cs/	0x64	struct tms *tbuf	-	-	-	-	-
101	ptrace	man/ cs/	0x65	long request	long pid	unsigned long addr	unsigned long data	-	-
102	getuid	man/ cs/	0x66	-	-	-	-	-	-
103	syslog	man/ cs/	0x67	int type	char *buf	int len	-	-	-
104	getgid	man/ cs/	0x68	-	-	-	-	-	-
105	setuid	man/ cs/	0x69	uid_t uid	-	-	-	-	-
106	setgid	man/ cs/	0x6a	gid_t gid	-	-	-	-	-
107	geteuid	man/ cs/	0x6b	-	-	-	-	-	-
108	getegid	man/ cs/	0x6c	-	-	-	-	-	-
109	setpgid	man/ cs/	0x6d	pid_t pid	pid_t pgid	-	-	-	-
110	getppid	man/ cs/	0x6e	-	-	-	-	-	-
111	getpgrp	man/ cs/	0x6f	-	-	-	-	-	-
112	setsid	man/ cs/	0x70	-	-	-	-	-	-
113	setreuid	man/ cs/	0x71	uid_t ruid	uid_t euid	-	-	-	-
114	setregid	man/ cs/	0x72	gid_t rgid	gid_t egid	-	-	-	-
115	getgroups	man/ cs/	0x73	int gidsetsize	gid_t *grouplist	-	-	-	-
116	setgroups	man/ cs/	0x74	int gidsetsize	gid_t *grouplist	-	-	-	-
117	setresuid	man/ cs/	0x75	uid_t ruid	uid_t euid	uid_t suid	-	-	-
118	getresuid	man/ cs/	0x76	uid_t *ruid	uid_t *euid	uid_t *suid	-	-	-
119	setresgid	man/ cs/	0x77	gid_t rgid	gid_t egid	gid_t sgid	-	-	-
120	getresgid	man/ cs/	0x78	gid_t *rgid	gid_t *egid	gid_t *sgid	-	-	-
121	getpgid	man/ cs/	0x79	pid_t pid	-	-	-	-	-
122	setfsuid	man/ cs/	0x7a	uid_t uid	-	-	-	-	-
123	setfsgid	man/ cs/	0x7b	gid_t gid	-	-	-	-	-
124	getsid	man/ cs/	0x7c	pid_t pid	-	-	-	-	-
125	capget	man/ cs/	0x7d	cap_user_header_t header	cap_user_data_t dataptr	-	-	-	-
126	capset	man/ cs/	0x7e	cap_user_header_t header	const cap_user_data_t data	-	-	-	-
127	rt_sigpending	man/ cs/	0x7f	sigset_t *set	size_t sigsetsize	-	-	-	-
128	rt_sigtimedwait	man/ cs/	0x80	const sigset_t *uthese	siginfo_t *uinfo	const struct __kernel_timespec *uts	size_t sigsetsize	-	-
129	rt_sigqueueinfo	man/ cs/	0x81	pid_t pid	int sig	siginfo_t *uinfo	-	-	-
130	rt_sigsuspend	man/ cs/	0x82	sigset_t *unewset	size_t sigsetsize	-	-	-	-
131	sigaltstack	man/ cs/	0x83	const struct sigaltstack *uss	struct sigaltstack *uoss	-	-	-	-
132	utime	man/ cs/	0x84	char *filename	struct utimbuf *times	-	-	-	-
133	mknod	man/ cs/	0x85	const char *filename	umode_t mode	unsigned dev	-	-	-
134	uselib	man/ cs/	0x86	const char *library	-	-	-	-	-
135	personality	man/ cs/	0x87	unsigned int personality	-	-	-	-	-
136	ustat	man/ cs/	0x88	unsigned dev	struct ustat *ubuf	-	-	-	-
137	statfs	man/ cs/	0x89	const char * path	struct statfs *buf	-	-	-	-
138	fstatfs	man/ cs/	0x8a	unsigned int fd	struct statfs *buf	-	-	-	-
139	sysfs	man/ cs/	0x8b	int option	unsigned long arg1	unsigned long arg2	-	-	-
140	getpriority	man/ cs/	0x8c	int which	int who	-	-	-	-
141	setpriority	man/ cs/	0x8d	int which	int who	int niceval	-	-	-
142	sched_setparam	man/ cs/	0x8e	pid_t pid	struct sched_param *param	-	-	-	-
143	sched_getparam	man/ cs/	0x8f	pid_t pid	struct sched_param *param	-	-	-	-
144	sched_setscheduler	man/ cs/	0x90	pid_t pid	int policy	struct sched_param *param	-	-	-
145	sched_getscheduler	man/ cs/	0x91	pid_t pid	-	-	-	-	-
146	sched_get_priority_max	man/ cs/	0x92	int policy	-	-	-	-	-
147	sched_get_priority_min	man/ cs/	0x93	int policy	-	-	-	-	-
148	sched_rr_get_interval	man/ cs/	0x94	pid_t pid	struct __kernel_timespec *interval	-	-	-	-
149	mlock	man/ cs/	0x95	unsigned long start	size_t len	-	-	-	-
150	munlock	man/ cs/	0x96	unsigned long start	size_t len	-	-	-	-
151	mlockall	man/ cs/	0x97	int flags	-	-	-	-	-
152	munlockall	man/ cs/	0x98	-	-	-	-	-	-
153	vhangup	man/ cs/	0x99	-	-	-	-	-	-
154	modify_ldt	man/ cs/	0x9a	?	?	?	?	?	?
155	pivot_root	man/ cs/	0x9b	const char *new_root	const char *put_old	-	-	-	-
156	_sysctl	man/ cs/	0x9c	?	?	?	?	?	?
157	prctl	man/ cs/	0x9d	int option	unsigned long arg2	unsigned long arg3	unsigned long arg4	unsigned long arg5	-
158	arch_prctl	man/ cs/	0x9e	?	?	?	?	?	?
159	adjtimex	man/ cs/	0x9f	struct __kernel_timex *txc_p	-	-	-	-	-
160	setrlimit	man/ cs/	0xa0	unsigned int resource	struct rlimit *rlim	-	-	-	-
161	chroot	man/ cs/	0xa1	const char *filename	-	-	-	-	-
162	sync	man/ cs/	0xa2	-	-	-	-	-	-
163	acct	man/ cs/	0xa3	const char *name	-	-	-	-	-
164	settimeofday	man/ cs/	0xa4	struct __kernel_old_timeval *tv	struct timezone *tz	-	-	-	-
165	mount	man/ cs/	0xa5	char *dev_name	char *dir_name	char *type	unsigned long flags	void *data	-
166	umount2	man/ cs/	0xa6	?	?	?	?	?	?
167	swapon	man/ cs/	0xa7	const char *specialfile	int swap_flags	-	-	-	-
168	swapoff	man/ cs/	0xa8	const char *specialfile	-	-	-	-	-
169	reboot	man/ cs/	0xa9	int magic1	int magic2	unsigned int cmd	void *arg	-	-
170	sethostname	man/ cs/	0xaa	char *name	int len	-	-	-	-
171	setdomainname	man/ cs/	0xab	char *name	int len	-	-	-	-
172	iopl	man/ cs/	0xac	?	?	?	?	?	?
173	ioperm	man/ cs/	0xad	unsigned long from	unsigned long num	int on	-	-	-
174	create_module	man/ cs/	0xae	?	?	?	?	?	?
175	init_module	man/ cs/	0xaf	void *umod	unsigned long len	const char *uargs	-	-	-
176	delete_module	man/ cs/	0xb0	const char *name_user	unsigned int flags	-	-	-	-
177	get_kernel_syms	man/ cs/	0xb1	?	?	?	?	?	?
178	query_module	man/ cs/	0xb2	?	?	?	?	?	?
179	quotactl	man/ cs/	0xb3	unsigned int cmd	const char *special	qid_t id	void *addr	-	-
180	nfsservctl	man/ cs/	0xb4	?	?	?	?	?	?
181	getpmsg	man/ cs/	0xb5	?	?	?	?	?	?
182	putpmsg	man/ cs/	0xb6	?	?	?	?	?	?
183	afs_syscall	man/ cs/	0xb7	?	?	?	?	?	?
184	tuxcall	man/ cs/	0xb8	?	?	?	?	?	?
185	security	man/ cs/	0xb9	?	?	?	?	?	?
186	gettid	man/ cs/	0xba	-	-	-	-	-	-
187	readahead	man/ cs/	0xbb	int fd	loff_t offset	size_t count	-	-	-
188	setxattr	man/ cs/	0xbc	const char *path	const char *name	const void *value	size_t size	int flags	-
189	lsetxattr	man/ cs/	0xbd	const char *path	const char *name	const void *value	size_t size	int flags	-
190	fsetxattr	man/ cs/	0xbe	int fd	const char *name	const void *value	size_t size	int flags	-
191	getxattr	man/ cs/	0xbf	const char *path	const char *name	void *value	size_t size	-	-
192	lgetxattr	man/ cs/	0xc0	const char *path	const char *name	void *value	size_t size	-	-
193	fgetxattr	man/ cs/	0xc1	int fd	const char *name	void *value	size_t size	-	-
194	listxattr	man/ cs/	0xc2	const char *path	char *list	size_t size	-	-	-
195	llistxattr	man/ cs/	0xc3	const char *path	char *list	size_t size	-	-	-
196	flistxattr	man/ cs/	0xc4	int fd	char *list	size_t size	-	-	-
197	removexattr	man/ cs/	0xc5	const char *path	const char *name	-	-	-	-
198	lremovexattr	man/ cs/	0xc6	const char *path	const char *name	-	-	-	-
199	fremovexattr	man/ cs/	0xc7	int fd	const char *name	-	-	-	-
200	tkill	man/ cs/	0xc8	pid_t pid	int sig	-	-	-	-
201	time	man/ cs/	0xc9	__kernel_old_time_t *tloc	-	-	-	-	-
202	futex	man/ cs/	0xca	u32 *uaddr	int op	u32 val	const struct __kernel_timespec *utime	u32 *uaddr2	u32 val3
203	sched_setaffinity	man/ cs/	0xcb	pid_t pid	unsigned int len	unsigned long *user_mask_ptr	-	-	-
204	sched_getaffinity	man/ cs/	0xcc	pid_t pid	unsigned int len	unsigned long *user_mask_ptr	-	-	-
205	set_thread_area	man/ cs/	0xcd	?	?	?	?	?	?
206	io_setup	man/ cs/	0xce	unsigned nr_reqs	aio_context_t *ctx	-	-	-	-
207	io_destroy	man/ cs/	0xcf	aio_context_t ctx	-	-	-	-	-
208	io_getevents	man/ cs/	0xd0	aio_context_t ctx_id	long min_nr	long nr	struct io_event *events	struct __kernel_timespec *timeout	-
209	io_submit	man/ cs/	0xd1	aio_context_t	long	struct iocb * *	-	-	-
210	io_cancel	man/ cs/	0xd2	aio_context_t ctx_id	struct iocb *iocb	struct io_event *result	-	-	-
211	get_thread_area	man/ cs/	0xd3	?	?	?	?	?	?
212	lookup_dcookie	man/ cs/	0xd4	u64 cookie64	char *buf	size_t len	-	-	-
213	epoll_create	man/ cs/	0xd5	int size	-	-	-	-	-
214	epoll_ctl_old	man/ cs/	0xd6	?	?	?	?	?	?
215	epoll_wait_old	man/ cs/	0xd7	?	?	?	?	?	?
216	remap_file_pages	man/ cs/	0xd8	unsigned long start	unsigned long size	unsigned long prot	unsigned long pgoff	unsigned long flags	-
217	getdents64	man/ cs/	0xd9	unsigned int fd	struct linux_dirent64 *dirent	unsigned int count	-	-	-
218	set_tid_address	man/ cs/	0xda	int *tidptr	-	-	-	-	-
219	restart_syscall	man/ cs/	0xdb	-	-	-	-	-	-
220	semtimedop	man/ cs/	0xdc	int semid	struct sembuf *sops	unsigned nsops	const struct __kernel_timespec *timeout	-	-
221	fadvise64	man/ cs/	0xdd	int fd	loff_t offset	size_t len	int advice	-	-
222	timer_create	man/ cs/	0xde	clockid_t which_clock	struct sigevent *timer_event_spec	timer_t * created_timer_id	-	-	-
223	timer_settime	man/ cs/	0xdf	timer_t timer_id	int flags	const struct __kernel_itimerspec *new_setting	struct __kernel_itimerspec *old_setting	-	-
224	timer_gettime	man/ cs/	0xe0	timer_t timer_id	struct __kernel_itimerspec *setting	-	-	-	-
225	timer_getoverrun	man/ cs/	0xe1	timer_t timer_id	-	-	-	-	-
226	timer_delete	man/ cs/	0xe2	timer_t timer_id	-	-	-	-	-
227	clock_settime	man/ cs/	0xe3	clockid_t which_clock	const struct __kernel_timespec *tp	-	-	-	-
228	clock_gettime	man/ cs/	0xe4	clockid_t which_clock	struct __kernel_timespec *tp	-	-	-	-
229	clock_getres	man/ cs/	0xe5	clockid_t which_clock	struct __kernel_timespec *tp	-	-	-	-
230	clock_nanosleep	man/ cs/	0xe6	clockid_t which_clock	int flags	const struct __kernel_timespec *rqtp	struct __kernel_timespec *rmtp	-	-
231	exit_group	man/ cs/	0xe7	int error_code	-	-	-	-	-
232	epoll_wait	man/ cs/	0xe8	int epfd	struct epoll_event *events	int maxevents	int timeout	-	-
233	epoll_ctl	man/ cs/	0xe9	int epfd	int op	int fd	struct epoll_event *event	-	-
234	tgkill	man/ cs/	0xea	pid_t tgid	pid_t pid	int sig	-	-	-
235	utimes	man/ cs/	0xeb	char *filename	struct __kernel_old_timeval *utimes	-	-	-	-
236	vserver	man/ cs/	0xec	?	?	?	?	?	?
237	mbind	man/ cs/	0xed	unsigned long start	unsigned long len	unsigned long mode	const unsigned long *nmask	unsigned long maxnode	unsigned flags
238	set_mempolicy	man/ cs/	0xee	int mode	const unsigned long *nmask	unsigned long maxnode	-	-	-
239	get_mempolicy	man/ cs/	0xef	int *policy	unsigned long *nmask	unsigned long maxnode	unsigned long addr	unsigned long flags	-
240	mq_open	man/ cs/	0xf0	const char *name	int oflag	umode_t mode	struct mq_attr *attr	-	-
241	mq_unlink	man/ cs/	0xf1	const char *name	-	-	-	-	-
242	mq_timedsend	man/ cs/	0xf2	mqd_t mqdes	const char *msg_ptr	size_t msg_len	unsigned int msg_prio	const struct __kernel_timespec *abs_timeout	-
243	mq_timedreceive	man/ cs/	0xf3	mqd_t mqdes	char *msg_ptr	size_t msg_len	unsigned int *msg_prio	const struct __kernel_timespec *abs_timeout	-
244	mq_notify	man/ cs/	0xf4	mqd_t mqdes	const struct sigevent *notification	-	-	-	-
245	mq_getsetattr	man/ cs/	0xf5	mqd_t mqdes	const struct mq_attr *mqstat	struct mq_attr *omqstat	-	-	-
246	kexec_load	man/ cs/	0xf6	unsigned long entry	unsigned long nr_segments	struct kexec_segment *segments	unsigned long flags	-	-
247	waitid	man/ cs/	0xf7	int which	pid_t pid	struct siginfo *infop	int options	struct rusage *ru	-
248	add_key	man/ cs/	0xf8	const char *_type	const char *_description	const void *_payload	size_t plen	key_serial_t destringid	-
249	request_key	man/ cs/	0xf9	const char *_type	const char *_description	const char *_callout_info	key_serial_t destringid	-	-
250	keyctl	man/ cs/	0xfa	int cmd	unsigned long arg2	unsigned long arg3	unsigned long arg4	unsigned long arg5	-
251	ioprio_set	man/ cs/	0xfb	int which	int who	int ioprio	-	-	-
252	ioprio_get	man/ cs/	0xfc	int which	int who	-	-	-	-
253	inotify_init	man/ cs/	0xfd	-	-	-	-	-	-
254	inotify_add_watch	man/ cs/	0xfe	int fd	const char *path	u32 mask	-	-	-
255	inotify_rm_watch	man/ cs/	0xff	int fd	__s32 wd	-	-	-	-
256	migrate_pages	man/ cs/	0x100	pid_t pid	unsigned long maxnode	const unsigned long *from	const unsigned long *to	-	-
257	openat	man/ cs/	0x101	int dfd	const char *filename	int flags	umode_t mode	-	-
258	mkdirat	man/ cs/	0x102	int dfd	const char * pathname	umode_t mode	-	-	-
259	mknodat	man/ cs/	0x103	int dfd	const char * filename	umode_t mode	unsigned dev	-	-
260	fchownat	man/ cs/	0x104	int dfd	const char *filename	uid_t user	gid_t group	int flag	-
261	futimesat	man/ cs/	0x105	int dfd	const char *filename	struct __kernel_old_timeval *utimes	-	-	-
262	newfstatat	man/ cs/	0x106	int dfd	const char *filename	struct stat *statbuf	int flag	-	-
263	unlinkat	man/ cs/	0x107	int dfd	const char * pathname	int flag	-	-	-
264	renameat	man/ cs/	0x108	int olddfd	const char * oldname	int newdfd	const char * newname	-	-
265	linkat	man/ cs/	0x109	int olddfd	const char *oldname	int newdfd	const char *newname	int flags	-
266	symlinkat	man/ cs/	0x10a	const char * oldname	int newdfd	const char * newname	-	-	-
267	readlinkat	man/ cs/	0x10b	int dfd	const char *path	char *buf	int bufsiz	-	-
268	fchmodat	man/ cs/	0x10c	int dfd	const char * filename	umode_t mode	-	-	-
269	faccessat	man/ cs/	0x10d	int dfd	const char *filename	int mode	-	-	-
270	pselect6	man/ cs/	0x10e	int	fd_set *	fd_set *	fd_set *	struct __kernel_timespec *	void *
271	ppoll	man/ cs/	0x10f	struct pollfd *	unsigned int	struct __kernel_timespec *	const sigset_t *	size_t	-
272	unshare	man/ cs/	0x110	unsigned long unshare_flags	-	-	-	-	-
273	set_robust_list	man/ cs/	0x111	struct robust_list_head *head	size_t len	-	-	-	-
274	get_robust_list	man/ cs/	0x112	int pid	struct robust_list_head * *head_ptr	size_t *len_ptr	-	-	-
275	splice	man/ cs/	0x113	int fd_in	loff_t *off_in	int fd_out	loff_t *off_out	size_t len	unsigned int flags
276	tee	man/ cs/	0x114	int fdin	int fdout	size_t len	unsigned int flags	-	-
277	sync_file_range	man/ cs/	0x115	int fd	loff_t offset	loff_t nbytes	unsigned int flags	-	-
278	vmsplice	man/ cs/	0x116	int fd	const struct iovec *iov	unsigned long nr_segs	unsigned int flags	-	-
279	move_pages	man/ cs/	0x117	pid_t pid	unsigned long nr_pages	const void * *pages	const int *nodes	int *status	int flags
280	utimensat	man/ cs/	0x118	int dfd	const char *filename	struct __kernel_timespec *utimes	int flags	-	-
281	epoll_pwait	man/ cs/	0x119	int epfd	struct epoll_event *events	int maxevents	int timeout	const sigset_t *sigmask	size_t sigsetsize
282	signalfd	man/ cs/	0x11a	int ufd	sigset_t *user_mask	size_t sizemask	-	-	-
283	timerfd_create	man/ cs/	0x11b	int clockid	int flags	-	-	-	-
284	eventfd	man/ cs/	0x11c	unsigned int count	-	-	-	-	-
285	fallocate	man/ cs/	0x11d	int fd	int mode	loff_t offset	loff_t len	-	-
286	timerfd_settime	man/ cs/	0x11e	int ufd	int flags	const struct __kernel_itimerspec *utmr	struct __kernel_itimerspec *otmr	-	-
287	timerfd_gettime	man/ cs/	0x11f	int ufd	struct __kernel_itimerspec *otmr	-	-	-	-
288	accept4	man/ cs/	0x120	int	struct sockaddr *	int *	int	-	-
289	signalfd4	man/ cs/	0x121	int ufd	sigset_t *user_mask	size_t sizemask	int flags	-	-
290	eventfd2	man/ cs/	0x122	unsigned int count	int flags	-	-	-	-
291	epoll_create1	man/ cs/	0x123	int flags	-	-	-	-	-
292	dup3	man/ cs/	0x124	unsigned int oldfd	unsigned int newfd	int flags	-	-	-
293	pipe2	man/ cs/	0x125	int *fildes	int flags	-	-	-	-
294	inotify_init1	man/ cs/	0x126	int flags	-	-	-	-	-
295	preadv	man/ cs/	0x127	unsigned long fd	const struct iovec *vec	unsigned long vlen	unsigned long pos_l	unsigned long pos_h	-
296	pwritev	man/ cs/	0x128	unsigned long fd	const struct iovec *vec	unsigned long vlen	unsigned long pos_l	unsigned long pos_h	-
297	rt_tgsigqueueinfo	man/ cs/	0x129	pid_t tgid	pid_t pid	int sig	siginfo_t *uinfo	-	-
298	perf_event_open	man/ cs/	0x12a	struct perf_event_attr *attr_uptr	pid_t pid	int cpu	int group_fd	unsigned long flags	-
299	recvmmsg	man/ cs/	0x12b	int fd	struct mmsghdr *msg	unsigned int vlen	unsigned flags	struct __kernel_timespec *timeout	-
300	fanotify_init	man/ cs/	0x12c	unsigned int flags	unsigned int event_f_flags	-	-	-	-
301	fanotify_mark	man/ cs/	0x12d	int fanotify_fd	unsigned int flags	u64 mask	int fd	const char *pathname	-
302	prlimit64	man/ cs/	0x12e	pid_t pid	unsigned int resource	const struct rlimit64 *new_rlim	struct rlimit64 *old_rlim	-	-
303	name_to_handle_at	man/ cs/	0x12f	int dfd	const char *name	struct file_handle *handle	int *mnt_id	int flag	-
304	open_by_handle_at	man/ cs/	0x130	int mountdirfd	struct file_handle *handle	int flags	-	-	-
305	clock_adjtime	man/ cs/	0x131	clockid_t which_clock	struct __kernel_timex *tx	-	-	-	-
306	syncfs	man/ cs/	0x132	int fd	-	-	-	-	-
307	sendmmsg	man/ cs/	0x133	int fd	struct mmsghdr *msg	unsigned int vlen	unsigned flags	-	-
308	setns	man/ cs/	0x134	int fd	int nstype	-	-	-	-
309	getcpu	man/ cs/	0x135	unsigned *cpu	unsigned *node	struct getcpu_cache *cache	-	-	-
310	process_vm_readv	man/ cs/	0x136	pid_t pid	const struct iovec *lvec	unsigned long liovcnt	const struct iovec *rvec	unsigned long riovcnt	unsigned long flags
311	process_vm_writev	man/ cs/	0x137	pid_t pid	const struct iovec *lvec	unsigned long liovcnt	const struct iovec *rvec	unsigned long riovcnt	unsigned long flags
312	kcmp	man/ cs/	0x138	pid_t pid1	pid_t pid2	int type	unsigned long idx1	unsigned long idx2	-
313	finit_module	man/ cs/	0x139	int fd	const char *uargs	int flags	-	-	-
314	sched_setattr	man/ cs/	0x13a	pid_t pid	struct sched_attr *attr	unsigned int flags	-	-	-
315	sched_getattr	man/ cs/	0x13b	pid_t pid	struct sched_attr *attr	unsigned int size	unsigned int flags	-	-
316	renameat2	man/ cs/	0x13c	int olddfd	const char *oldname	int newdfd	const char *newname	unsigned int flags	-
317	seccomp	man/ cs/	0x13d	unsigned int op	unsigned int flags	void *uargs	-	-	-
318	getrandom	man/ cs/	0x13e	char *buf	size_t count	unsigned int flags	-	-	-
319	memfd_create	man/ cs/	0x13f	const char *uname_ptr	unsigned int flags	-	-	-	-
320	kexec_file_load	man/ cs/	0x140	int kernel_fd	int initrd_fd	unsigned long cmdline_len	const char *cmdline_ptr	unsigned long flags	-
321	bpf	man/ cs/	0x141	int cmd	union bpf_attr *attr	unsigned int size	-	-	-
322	execveat	man/ cs/	0x142	int dfd	const char *filename	const char *const *argv	const char *const *envp	int flags	-
323	userfaultfd	man/ cs/	0x143	int flags	-	-	-	-	-
324	membarrier	man/ cs/	0x144	int cmd	unsigned int flags	int cpu_id	-	-	-
325	mlock2	man/ cs/	0x145	unsigned long start	size_t len	int flags	-	-	-
326	copy_file_range	man/ cs/	0x146	int fd_in	loff_t *off_in	int fd_out	loff_t *off_out	size_t len	unsigned int flags
327	preadv2	man/ cs/	0x147	unsigned long fd	const struct iovec *vec	unsigned long vlen	unsigned long pos_l	unsigned long pos_h	rwf_t flags
328	pwritev2	man/ cs/	0x148	unsigned long fd	const struct iovec *vec	unsigned long vlen	unsigned long pos_l	unsigned long pos_h	rwf_t flags
329	pkey_mprotect	man/ cs/	0x149	unsigned long start	size_t len	unsigned long prot	int pkey	-	-
330	pkey_alloc	man/ cs/	0x14a	unsigned long flags	unsigned long init_val	-	-	-	-
331	pkey_free	man/ cs/	0x14b	int pkey	-	-	-	-	-
332	statx	man/ cs/	0x14c	int dfd	const char *path	unsigned flags	unsigned mask	struct statx *buffer	-
333	not implemented		0x14d						
334	not implemented		0x14e						
335	not implemented		0x14f						
336	not implemented		0x150						
337	not implemented		0x151						
338	not implemented		0x152						
339	not implemented		0x153						
340	not implemented		0x154						
341	not implemented		0x155						
342	not implemented		0x156						
343	not implemented		0x157						
344	not implemented		0x158						
345	not implemented		0x159						
346	not implemented		0x15a						
347	not implemented		0x15b						
348	not implemented		0x15c						
349	not implemented		0x15d						
350	not implemented		0x15e						
351	not implemented		0x15f						
352	not implemented		0x160						
353	not implemented		0x161						
354	not implemented		0x162						
355	not implemented		0x163						
356	not implemented		0x164						
357	not implemented		0x165						
358	not implemented		0x166						
359	not implemented		0x167						
360	not implemented		0x168						
361	not implemented		0x169						
362	not implemented		0x16a						
363	not implemented		0x16b						
364	not implemented		0x16c						
365	not implemented		0x16d						
366	not implemented		0x16e						
367	not implemented		0x16f						
368	not implemented		0x170						
369	not implemented		0x171						
370	not implemented		0x172						
371	not implemented		0x173						
372	not implemented		0x174						
373	not implemented		0x175						
374	not implemented		0x176						
375	not implemented		0x177						
376	not implemented		0x178						
377	not implemented		0x179						
378	not implemented		0x17a						
379	not implemented		0x17b						
380	not implemented		0x17c						
381	not implemented		0x17d						
382	not implemented		0x17e						
383	not implemented		0x17f						
384	not implemented		0x180						
385	not implemented		0x181						
386	not implemented		0x182						
387	not implemented		0x183						
388	not implemented		0x184						
389	not implemented		0x185						
390	not implemented		0x186						
391	not implemented		0x187						
392	not implemented		0x188						
393	not implemented		0x189						
394	not implemented		0x18a						
395	not implemented		0x18b						
396	not implemented		0x18c						
397	not implemented		0x18d						
398	not implemented		0x18e						
399	not implemented		0x18f						
400	not implemented		0x190						
401	not implemented		0x191						
402	not implemented		0x192						
403	not implemented		0x193						
404	not implemented		0x194						
405	not implemented		0x195						
406	not implemented		0x196						
407	not implemented		0x197						
408	not implemented		0x198						
409	not implemented		0x199						
410	not implemented		0x19a						
411	not implemented		0x19b						
412	not implemented		0x19c						
413	not implemented		0x19d						
414	not implemented		0x19e						
415	not implemented		0x19f						
416	not implemented		0x1a0						
417	not implemented		0x1a1						
418	not implemented		0x1a2						
419	not implemented		0x1a3						
420	not implemented		0x1a4						
421	not implemented		0x1a5						
422	not implemented		0x1a6						
423	not implemented		0x1a7						
424	not implemented		0x1a8						
425	io_uring_setup	man/ cs/	0x1a9	u32 entries	struct io_uring_params *p	-	-	-	-
426	io_uring_enter	man/ cs/	0x1aa	unsigned int fd	u32 to_submit	u32 min_complete	u32 flags	const void *argp	size_t argsz
427	not implemented		0x1ab						
428	not implemented		0x1ac						
429	not implemented		0x1ad						
430	not implemented		0x1ae						
431	not implemented		0x1af						
432	not implemented		0x1b0						
433	not implemented		0x1b1						
434	not implemented		0x1b2						
435	not implemented		0x1b3						
436	not implemented		0x1b4						
437	not implemented		0x1b5						
438	not implemented		0x1b6						
439	faccessat2	man/ cs/	0x1b7	int dfd	const char *filename	int mode	int flags	-	-
arm (32-bit/EABI)
Compiled from Linux 4.14.0 headers.

NR	syscall name	references	%r7	arg0 (%r0)	arg1 (%r1)	arg2 (%r2)	arg3 (%r3)	arg4 (%r4)	arg5 (%r5)
0	restart_syscall	man/ cs/	0x00	-	-	-	-	-	-
1	exit	man/ cs/	0x01	int error_code	-	-	-	-	-
2	fork	man/ cs/	0x02	-	-	-	-	-	-
3	read	man/ cs/	0x03	unsigned int fd	char *buf	size_t count	-	-	-
4	write	man/ cs/	0x04	unsigned int fd	const char *buf	size_t count	-	-	-
5	open	man/ cs/	0x05	const char *filename	int flags	umode_t mode	-	-	-
6	close	man/ cs/	0x06	unsigned int fd	-	-	-	-	-
7	not implemented		0x07						
8	creat	man/ cs/	0x08	const char *pathname	umode_t mode	-	-	-	-
9	link	man/ cs/	0x09	const char *oldname	const char *newname	-	-	-	-
10	unlink	man/ cs/	0x0a	const char *pathname	-	-	-	-	-
11	execve	man/ cs/	0x0b	const char *filename	const char *const *argv	const char *const *envp	-	-	-
12	chdir	man/ cs/	0x0c	const char *filename	-	-	-	-	-
13	not implemented		0x0d						
14	mknod	man/ cs/	0x0e	const char *filename	umode_t mode	unsigned dev	-	-	-
15	chmod	man/ cs/	0x0f	const char *filename	umode_t mode	-	-	-	-
16	lchown	man/ cs/	0x10	const char *filename	uid_t user	gid_t group	-	-	-
17	not implemented		0x11						
18	not implemented		0x12						
19	lseek	man/ cs/	0x13	unsigned int fd	off_t offset	unsigned int whence	-	-	-
20	getpid	man/ cs/	0x14	-	-	-	-	-	-
21	mount	man/ cs/	0x15	char *dev_name	char *dir_name	char *type	unsigned long flags	void *data	-
22	not implemented		0x16						
23	setuid	man/ cs/	0x17	uid_t uid	-	-	-	-	-
24	getuid	man/ cs/	0x18	-	-	-	-	-	-
25	not implemented		0x19						
26	ptrace	man/ cs/	0x1a	long request	long pid	unsigned long addr	unsigned long data	-	-
27	not implemented		0x1b						
28	not implemented		0x1c						
29	pause	man/ cs/	0x1d	-	-	-	-	-	-
30	not implemented		0x1e						
31	not implemented		0x1f						
32	not implemented		0x20						
33	access	man/ cs/	0x21	const char *filename	int mode	-	-	-	-
34	nice	man/ cs/	0x22	int increment	-	-	-	-	-
35	not implemented		0x23						
36	sync	man/ cs/	0x24	-	-	-	-	-	-
37	kill	man/ cs/	0x25	pid_t pid	int sig	-	-	-	-
38	rename	man/ cs/	0x26	const char *oldname	const char *newname	-	-	-	-
39	mkdir	man/ cs/	0x27	const char *pathname	umode_t mode	-	-	-	-
40	rmdir	man/ cs/	0x28	const char *pathname	-	-	-	-	-
41	dup	man/ cs/	0x29	unsigned int fildes	-	-	-	-	-
42	pipe	man/ cs/	0x2a	int *fildes	-	-	-	-	-
43	times	man/ cs/	0x2b	struct tms *tbuf	-	-	-	-	-
44	not implemented		0x2c						
45	brk	man/ cs/	0x2d	unsigned long brk	-	-	-	-	-
46	setgid	man/ cs/	0x2e	gid_t gid	-	-	-	-	-
47	getgid	man/ cs/	0x2f	-	-	-	-	-	-
48	not implemented		0x30						
49	geteuid	man/ cs/	0x31	-	-	-	-	-	-
50	getegid	man/ cs/	0x32	-	-	-	-	-	-
51	acct	man/ cs/	0x33	const char *name	-	-	-	-	-
52	umount2	man/ cs/	0x34	?	?	?	?	?	?
53	not implemented		0x35						
54	ioctl	man/ cs/	0x36	unsigned int fd	unsigned int cmd	unsigned long arg	-	-	-
55	fcntl	man/ cs/	0x37	unsigned int fd	unsigned int cmd	unsigned long arg	-	-	-
56	not implemented		0x38						
57	setpgid	man/ cs/	0x39	pid_t pid	pid_t pgid	-	-	-	-
58	not implemented		0x3a						
59	not implemented		0x3b						
60	umask	man/ cs/	0x3c	int mask	-	-	-	-	-
61	chroot	man/ cs/	0x3d	const char *filename	-	-	-	-	-
62	ustat	man/ cs/	0x3e	unsigned dev	struct ustat *ubuf	-	-	-	-
63	dup2	man/ cs/	0x3f	unsigned int oldfd	unsigned int newfd	-	-	-	-
64	getppid	man/ cs/	0x40	-	-	-	-	-	-
65	getpgrp	man/ cs/	0x41	-	-	-	-	-	-
66	setsid	man/ cs/	0x42	-	-	-	-	-	-
67	sigaction	man/ cs/	0x43	int	const struct old_sigaction *	struct old_sigaction *	-	-	-
68	not implemented		0x44						
69	not implemented		0x45						
70	setreuid	man/ cs/	0x46	uid_t ruid	uid_t euid	-	-	-	-
71	setregid	man/ cs/	0x47	gid_t rgid	gid_t egid	-	-	-	-
72	sigsuspend	man/ cs/	0x48	int unused1	int unused2	old_sigset_t mask	-	-	-
73	sigpending	man/ cs/	0x49	old_sigset_t *uset	-	-	-	-	-
74	sethostname	man/ cs/	0x4a	char *name	int len	-	-	-	-
75	setrlimit	man/ cs/	0x4b	unsigned int resource	struct rlimit *rlim	-	-	-	-
76	not implemented		0x4c						
77	getrusage	man/ cs/	0x4d	int who	struct rusage *ru	-	-	-	-
78	gettimeofday	man/ cs/	0x4e	struct __kernel_old_timeval *tv	struct timezone *tz	-	-	-	-
79	settimeofday	man/ cs/	0x4f	struct __kernel_old_timeval *tv	struct timezone *tz	-	-	-	-
80	getgroups	man/ cs/	0x50	int gidsetsize	gid_t *grouplist	-	-	-	-
81	setgroups	man/ cs/	0x51	int gidsetsize	gid_t *grouplist	-	-	-	-
82	not implemented		0x52						
83	symlink	man/ cs/	0x53	const char *old	const char *new	-	-	-	-
84	not implemented		0x54						
85	readlink	man/ cs/	0x55	const char *path	char *buf	int bufsiz	-	-	-
86	uselib	man/ cs/	0x56	const char *library	-	-	-	-	-
87	swapon	man/ cs/	0x57	const char *specialfile	int swap_flags	-	-	-	-
88	reboot	man/ cs/	0x58	int magic1	int magic2	unsigned int cmd	void *arg	-	-
89	not implemented		0x59						
90	not implemented		0x5a						
91	munmap	man/ cs/	0x5b	unsigned long addr	size_t len	-	-	-	-
92	truncate	man/ cs/	0x5c	const char *path	long length	-	-	-	-
93	ftruncate	man/ cs/	0x5d	unsigned int fd	unsigned long length	-	-	-	-
94	fchmod	man/ cs/	0x5e	unsigned int fd	umode_t mode	-	-	-	-
95	fchown	man/ cs/	0x5f	unsigned int fd	uid_t user	gid_t group	-	-	-
96	getpriority	man/ cs/	0x60	int which	int who	-	-	-	-
97	setpriority	man/ cs/	0x61	int which	int who	int niceval	-	-	-
98	not implemented		0x62						
99	statfs	man/ cs/	0x63	const char * path	struct statfs *buf	-	-	-	-
100	fstatfs	man/ cs/	0x64	unsigned int fd	struct statfs *buf	-	-	-	-
101	not implemented		0x65						
102	not implemented		0x66						
103	syslog	man/ cs/	0x67	int type	char *buf	int len	-	-	-
104	setitimer	man/ cs/	0x68	int which	struct __kernel_old_itimerval *value	struct __kernel_old_itimerval *ovalue	-	-	-
105	getitimer	man/ cs/	0x69	int which	struct __kernel_old_itimerval *value	-	-	-	-
106	stat	man/ cs/	0x6a	const char *filename	struct __old_kernel_stat *statbuf	-	-	-	-
107	lstat	man/ cs/	0x6b	const char *filename	struct __old_kernel_stat *statbuf	-	-	-	-
108	fstat	man/ cs/	0x6c	unsigned int fd	struct __old_kernel_stat *statbuf	-	-	-	-
109	not implemented		0x6d						
110	not implemented		0x6e						
111	vhangup	man/ cs/	0x6f	-	-	-	-	-	-
112	not implemented		0x70						
113	not implemented		0x71						
114	wait4	man/ cs/	0x72	pid_t pid	int *stat_addr	int options	struct rusage *ru	-	-
115	swapoff	man/ cs/	0x73	const char *specialfile	-	-	-	-	-
116	sysinfo	man/ cs/	0x74	struct sysinfo *info	-	-	-	-	-
117	not implemented		0x75						
118	fsync	man/ cs/	0x76	unsigned int fd	-	-	-	-	-
119	sigreturn	man/ cs/	0x77	?	?	?	?	?	?
120	clone	man/ cs/	0x78	unsigned long	unsigned long	int *	int *	unsigned long	-
121	setdomainname	man/ cs/	0x79	char *name	int len	-	-	-	-
122	uname	man/ cs/	0x7a	struct old_utsname *	-	-	-	-	-
123	not implemented		0x7b						
124	adjtimex	man/ cs/	0x7c	struct __kernel_timex *txc_p	-	-	-	-	-
125	mprotect	man/ cs/	0x7d	unsigned long start	size_t len	unsigned long prot	-	-	-
126	sigprocmask	man/ cs/	0x7e	int how	old_sigset_t *set	old_sigset_t *oset	-	-	-
127	not implemented		0x7f						
128	init_module	man/ cs/	0x80	void *umod	unsigned long len	const char *uargs	-	-	-
129	delete_module	man/ cs/	0x81	const char *name_user	unsigned int flags	-	-	-	-
130	not implemented		0x82						
131	quotactl	man/ cs/	0x83	unsigned int cmd	const char *special	qid_t id	void *addr	-	-
132	getpgid	man/ cs/	0x84	pid_t pid	-	-	-	-	-
133	fchdir	man/ cs/	0x85	unsigned int fd	-	-	-	-	-
134	bdflush	man/ cs/	0x86	?	?	?	?	?	?
135	sysfs	man/ cs/	0x87	int option	unsigned long arg1	unsigned long arg2	-	-	-
136	personality	man/ cs/	0x88	unsigned int personality	-	-	-	-	-
137	not implemented		0x89						
138	setfsuid	man/ cs/	0x8a	uid_t uid	-	-	-	-	-
139	setfsgid	man/ cs/	0x8b	gid_t gid	-	-	-	-	-
140	_llseek	man/ cs/	0x8c	?	?	?	?	?	?
141	getdents	man/ cs/	0x8d	unsigned int fd	struct linux_dirent *dirent	unsigned int count	-	-	-
142	_newselect	man/ cs/	0x8e	?	?	?	?	?	?
143	flock	man/ cs/	0x8f	unsigned int fd	unsigned int cmd	-	-	-	-
144	msync	man/ cs/	0x90	unsigned long start	size_t len	int flags	-	-	-
145	readv	man/ cs/	0x91	unsigned long fd	const struct iovec *vec	unsigned long vlen	-	-	-
146	writev	man/ cs/	0x92	unsigned long fd	const struct iovec *vec	unsigned long vlen	-	-	-
147	getsid	man/ cs/	0x93	pid_t pid	-	-	-	-	-
148	fdatasync	man/ cs/	0x94	unsigned int fd	-	-	-	-	-
149	_sysctl	man/ cs/	0x95	?	?	?	?	?	?
150	mlock	man/ cs/	0x96	unsigned long start	size_t len	-	-	-	-
151	munlock	man/ cs/	0x97	unsigned long start	size_t len	-	-	-	-
152	mlockall	man/ cs/	0x98	int flags	-	-	-	-	-
153	munlockall	man/ cs/	0x99	-	-	-	-	-	-
154	sched_setparam	man/ cs/	0x9a	pid_t pid	struct sched_param *param	-	-	-	-
155	sched_getparam	man/ cs/	0x9b	pid_t pid	struct sched_param *param	-	-	-	-
156	sched_setscheduler	man/ cs/	0x9c	pid_t pid	int policy	struct sched_param *param	-	-	-
157	sched_getscheduler	man/ cs/	0x9d	pid_t pid	-	-	-	-	-
158	sched_yield	man/ cs/	0x9e	-	-	-	-	-	-
159	sched_get_priority_max	man/ cs/	0x9f	int policy	-	-	-	-	-
160	sched_get_priority_min	man/ cs/	0xa0	int policy	-	-	-	-	-
161	sched_rr_get_interval	man/ cs/	0xa1	pid_t pid	struct __kernel_timespec *interval	-	-	-	-
162	nanosleep	man/ cs/	0xa2	struct __kernel_timespec *rqtp	struct __kernel_timespec *rmtp	-	-	-	-
163	mremap	man/ cs/	0xa3	unsigned long addr	unsigned long old_len	unsigned long new_len	unsigned long flags	unsigned long new_addr	-
164	setresuid	man/ cs/	0xa4	uid_t ruid	uid_t euid	uid_t suid	-	-	-
165	getresuid	man/ cs/	0xa5	uid_t *ruid	uid_t *euid	uid_t *suid	-	-	-
166	not implemented		0xa6						
167	not implemented		0xa7						
168	poll	man/ cs/	0xa8	struct pollfd *ufds	unsigned int nfds	int timeout	-	-	-
169	nfsservctl	man/ cs/	0xa9	?	?	?	?	?	?
170	setresgid	man/ cs/	0xaa	gid_t rgid	gid_t egid	gid_t sgid	-	-	-
171	getresgid	man/ cs/	0xab	gid_t *rgid	gid_t *egid	gid_t *sgid	-	-	-
172	prctl	man/ cs/	0xac	int option	unsigned long arg2	unsigned long arg3	unsigned long arg4	unsigned long arg5	-
173	rt_sigreturn	man/ cs/	0xad	?	?	?	?	?	?
174	rt_sigaction	man/ cs/	0xae	int	const struct sigaction *	struct sigaction *	size_t	-	-
175	rt_sigprocmask	man/ cs/	0xaf	int how	sigset_t *set	sigset_t *oset	size_t sigsetsize	-	-
176	rt_sigpending	man/ cs/	0xb0	sigset_t *set	size_t sigsetsize	-	-	-	-
177	rt_sigtimedwait	man/ cs/	0xb1	const sigset_t *uthese	siginfo_t *uinfo	const struct __kernel_timespec *uts	size_t sigsetsize	-	-
178	rt_sigqueueinfo	man/ cs/	0xb2	pid_t pid	int sig	siginfo_t *uinfo	-	-	-
179	rt_sigsuspend	man/ cs/	0xb3	sigset_t *unewset	size_t sigsetsize	-	-	-	-
180	pread64	man/ cs/	0xb4	unsigned int fd	char *buf	size_t count	loff_t pos	-	-
181	pwrite64	man/ cs/	0xb5	unsigned int fd	const char *buf	size_t count	loff_t pos	-	-
182	chown	man/ cs/	0xb6	const char *filename	uid_t user	gid_t group	-	-	-
183	getcwd	man/ cs/	0xb7	char *buf	unsigned long size	-	-	-	-
184	capget	man/ cs/	0xb8	cap_user_header_t header	cap_user_data_t dataptr	-	-	-	-
185	capset	man/ cs/	0xb9	cap_user_header_t header	const cap_user_data_t data	-	-	-	-
186	sigaltstack	man/ cs/	0xba	const struct sigaltstack *uss	struct sigaltstack *uoss	-	-	-	-
187	sendfile	man/ cs/	0xbb	int out_fd	int in_fd	off_t *offset	size_t count	-	-
188	not implemented		0xbc						
189	not implemented		0xbd						
190	vfork	man/ cs/	0xbe	-	-	-	-	-	-
191	ugetrlimit	man/ cs/	0xbf	?	?	?	?	?	?
192	mmap2	man/ cs/	0xc0	?	?	?	?	?	?
193	truncate64	man/ cs/	0xc1	const char *path	loff_t length	-	-	-	-
194	ftruncate64	man/ cs/	0xc2	unsigned int fd	loff_t length	-	-	-	-
195	stat64	man/ cs/	0xc3	const char *filename	struct stat64 *statbuf	-	-	-	-
196	lstat64	man/ cs/	0xc4	const char *filename	struct stat64 *statbuf	-	-	-	-
197	fstat64	man/ cs/	0xc5	unsigned long fd	struct stat64 *statbuf	-	-	-	-
198	lchown32	man/ cs/	0xc6	?	?	?	?	?	?
199	getuid32	man/ cs/	0xc7	?	?	?	?	?	?
200	getgid32	man/ cs/	0xc8	?	?	?	?	?	?
201	geteuid32	man/ cs/	0xc9	?	?	?	?	?	?
202	getegid32	man/ cs/	0xca	?	?	?	?	?	?
203	setreuid32	man/ cs/	0xcb	?	?	?	?	?	?
204	setregid32	man/ cs/	0xcc	?	?	?	?	?	?
205	getgroups32	man/ cs/	0xcd	?	?	?	?	?	?
206	setgroups32	man/ cs/	0xce	?	?	?	?	?	?
207	fchown32	man/ cs/	0xcf	?	?	?	?	?	?
208	setresuid32	man/ cs/	0xd0	?	?	?	?	?	?
209	getresuid32	man/ cs/	0xd1	?	?	?	?	?	?
210	setresgid32	man/ cs/	0xd2	?	?	?	?	?	?
211	getresgid32	man/ cs/	0xd3	?	?	?	?	?	?
212	chown32	man/ cs/	0xd4	?	?	?	?	?	?
213	setuid32	man/ cs/	0xd5	?	?	?	?	?	?
214	setgid32	man/ cs/	0xd6	?	?	?	?	?	?
215	setfsuid32	man/ cs/	0xd7	?	?	?	?	?	?
216	setfsgid32	man/ cs/	0xd8	?	?	?	?	?	?
217	getdents64	man/ cs/	0xd9	unsigned int fd	struct linux_dirent64 *dirent	unsigned int count	-	-	-
218	pivot_root	man/ cs/	0xda	const char *new_root	const char *put_old	-	-	-	-
219	mincore	man/ cs/	0xdb	unsigned long start	size_t len	unsigned char * vec	-	-	-
220	madvise	man/ cs/	0xdc	unsigned long start	size_t len	int behavior	-	-	-
221	fcntl64	man/ cs/	0xdd	unsigned int fd	unsigned int cmd	unsigned long arg	-	-	-
222	not implemented		0xde						
223	not implemented		0xdf						
224	gettid	man/ cs/	0xe0	-	-	-	-	-	-
225	readahead	man/ cs/	0xe1	int fd	loff_t offset	size_t count	-	-	-
226	setxattr	man/ cs/	0xe2	const char *path	const char *name	const void *value	size_t size	int flags	-
227	lsetxattr	man/ cs/	0xe3	const char *path	const char *name	const void *value	size_t size	int flags	-
228	fsetxattr	man/ cs/	0xe4	int fd	const char *name	const void *value	size_t size	int flags	-
229	getxattr	man/ cs/	0xe5	const char *path	const char *name	void *value	size_t size	-	-
230	lgetxattr	man/ cs/	0xe6	const char *path	const char *name	void *value	size_t size	-	-
231	fgetxattr	man/ cs/	0xe7	int fd	const char *name	void *value	size_t size	-	-
232	listxattr	man/ cs/	0xe8	const char *path	char *list	size_t size	-	-	-
233	llistxattr	man/ cs/	0xe9	const char *path	char *list	size_t size	-	-	-
234	flistxattr	man/ cs/	0xea	int fd	char *list	size_t size	-	-	-
235	removexattr	man/ cs/	0xeb	const char *path	const char *name	-	-	-	-
236	lremovexattr	man/ cs/	0xec	const char *path	const char *name	-	-	-	-
237	fremovexattr	man/ cs/	0xed	int fd	const char *name	-	-	-	-
238	tkill	man/ cs/	0xee	pid_t pid	int sig	-	-	-	-
239	sendfile64	man/ cs/	0xef	int out_fd	int in_fd	loff_t *offset	size_t count	-	-
240	futex	man/ cs/	0xf0	u32 *uaddr	int op	u32 val	const struct __kernel_timespec *utime	u32 *uaddr2	u32 val3
241	sched_setaffinity	man/ cs/	0xf1	pid_t pid	unsigned int len	unsigned long *user_mask_ptr	-	-	-
242	sched_getaffinity	man/ cs/	0xf2	pid_t pid	unsigned int len	unsigned long *user_mask_ptr	-	-	-
243	io_setup	man/ cs/	0xf3	unsigned nr_reqs	aio_context_t *ctx	-	-	-	-
244	io_destroy	man/ cs/	0xf4	aio_context_t ctx	-	-	-	-	-
245	io_getevents	man/ cs/	0xf5	aio_context_t ctx_id	long min_nr	long nr	struct io_event *events	struct __kernel_timespec *timeout	-
246	io_submit	man/ cs/	0xf6	aio_context_t	long	struct iocb * *	-	-	-
247	io_cancel	man/ cs/	0xf7	aio_context_t ctx_id	struct iocb *iocb	struct io_event *result	-	-	-
248	exit_group	man/ cs/	0xf8	int error_code	-	-	-	-	-
249	lookup_dcookie	man/ cs/	0xf9	u64 cookie64	char *buf	size_t len	-	-	-
250	epoll_create	man/ cs/	0xfa	int size	-	-	-	-	-
251	epoll_ctl	man/ cs/	0xfb	int epfd	int op	int fd	struct epoll_event *event	-	-
252	epoll_wait	man/ cs/	0xfc	int epfd	struct epoll_event *events	int maxevents	int timeout	-	-
253	remap_file_pages	man/ cs/	0xfd	unsigned long start	unsigned long size	unsigned long prot	unsigned long pgoff	unsigned long flags	-
254	not implemented		0xfe						
255	not implemented		0xff						
256	set_tid_address	man/ cs/	0x100	int *tidptr	-	-	-	-	-
257	timer_create	man/ cs/	0x101	clockid_t which_clock	struct sigevent *timer_event_spec	timer_t * created_timer_id	-	-	-
258	timer_settime	man/ cs/	0x102	timer_t timer_id	int flags	const struct __kernel_itimerspec *new_setting	struct __kernel_itimerspec *old_setting	-	-
259	timer_gettime	man/ cs/	0x103	timer_t timer_id	struct __kernel_itimerspec *setting	-	-	-	-
260	timer_getoverrun	man/ cs/	0x104	timer_t timer_id	-	-	-	-	-
261	timer_delete	man/ cs/	0x105	timer_t timer_id	-	-	-	-	-
262	clock_settime	man/ cs/	0x106	clockid_t which_clock	const struct __kernel_timespec *tp	-	-	-	-
263	clock_gettime	man/ cs/	0x107	clockid_t which_clock	struct __kernel_timespec *tp	-	-	-	-
264	clock_getres	man/ cs/	0x108	clockid_t which_clock	struct __kernel_timespec *tp	-	-	-	-
265	clock_nanosleep	man/ cs/	0x109	clockid_t which_clock	int flags	const struct __kernel_timespec *rqtp	struct __kernel_timespec *rmtp	-	-
266	statfs64	man/ cs/	0x10a	const char *path	size_t sz	struct statfs64 *buf	-	-	-
267	fstatfs64	man/ cs/	0x10b	unsigned int fd	size_t sz	struct statfs64 *buf	-	-	-
268	tgkill	man/ cs/	0x10c	pid_t tgid	pid_t pid	int sig	-	-	-
269	utimes	man/ cs/	0x10d	char *filename	struct __kernel_old_timeval *utimes	-	-	-	-
270	arm_fadvise64_64	man/ cs/	0x10e	?	?	?	?	?	?
271	pciconfig_iobase	man/ cs/	0x10f	long which	unsigned long bus	unsigned long devfn	-	-	-
272	pciconfig_read	man/ cs/	0x110	unsigned long bus	unsigned long dfn	unsigned long off	unsigned long len	void *buf	-
273	pciconfig_write	man/ cs/	0x111	unsigned long bus	unsigned long dfn	unsigned long off	unsigned long len	void *buf	-
274	mq_open	man/ cs/	0x112	const char *name	int oflag	umode_t mode	struct mq_attr *attr	-	-
275	mq_unlink	man/ cs/	0x113	const char *name	-	-	-	-	-
276	mq_timedsend	man/ cs/	0x114	mqd_t mqdes	const char *msg_ptr	size_t msg_len	unsigned int msg_prio	const struct __kernel_timespec *abs_timeout	-
277	mq_timedreceive	man/ cs/	0x115	mqd_t mqdes	char *msg_ptr	size_t msg_len	unsigned int *msg_prio	const struct __kernel_timespec *abs_timeout	-
278	mq_notify	man/ cs/	0x116	mqd_t mqdes	const struct sigevent *notification	-	-	-	-
279	mq_getsetattr	man/ cs/	0x117	mqd_t mqdes	const struct mq_attr *mqstat	struct mq_attr *omqstat	-	-	-
280	waitid	man/ cs/	0x118	int which	pid_t pid	struct siginfo *infop	int options	struct rusage *ru	-
281	socket	man/ cs/	0x119	int	int	int	-	-	-
282	bind	man/ cs/	0x11a	int	struct sockaddr *	int	-	-	-
283	connect	man/ cs/	0x11b	int	struct sockaddr *	int	-	-	-
284	listen	man/ cs/	0x11c	int	int	-	-	-	-
285	accept	man/ cs/	0x11d	int	struct sockaddr *	int *	-	-	-
286	getsockname	man/ cs/	0x11e	int	struct sockaddr *	int *	-	-	-
287	getpeername	man/ cs/	0x11f	int	struct sockaddr *	int *	-	-	-
288	socketpair	man/ cs/	0x120	int	int	int	int *	-	-
289	send	man/ cs/	0x121	int	void *	size_t	unsigned	-	-
290	sendto	man/ cs/	0x122	int	void *	size_t	unsigned	struct sockaddr *	int
291	recv	man/ cs/	0x123	int	void *	size_t	unsigned	-	-
292	recvfrom	man/ cs/	0x124	int	void *	size_t	unsigned	struct sockaddr *	int *
293	shutdown	man/ cs/	0x125	int	int	-	-	-	-
294	setsockopt	man/ cs/	0x126	int fd	int level	int optname	char *optval	int optlen	-
295	getsockopt	man/ cs/	0x127	int fd	int level	int optname	char *optval	int *optlen	-
296	sendmsg	man/ cs/	0x128	int fd	struct user_msghdr *msg	unsigned flags	-	-	-
297	recvmsg	man/ cs/	0x129	int fd	struct user_msghdr *msg	unsigned flags	-	-	-
298	semop	man/ cs/	0x12a	int semid	struct sembuf *sops	unsigned nsops	-	-	-
299	semget	man/ cs/	0x12b	key_t key	int nsems	int semflg	-	-	-
300	semctl	man/ cs/	0x12c	int semid	int semnum	int cmd	unsigned long arg	-	-
301	msgsnd	man/ cs/	0x12d	int msqid	struct msgbuf *msgp	size_t msgsz	int msgflg	-	-
302	msgrcv	man/ cs/	0x12e	int msqid	struct msgbuf *msgp	size_t msgsz	long msgtyp	int msgflg	-
303	msgget	man/ cs/	0x12f	key_t key	int msgflg	-	-	-	-
304	msgctl	man/ cs/	0x130	int msqid	int cmd	struct msqid_ds *buf	-	-	-
305	shmat	man/ cs/	0x131	int shmid	char *shmaddr	int shmflg	-	-	-
306	shmdt	man/ cs/	0x132	char *shmaddr	-	-	-	-	-
307	shmget	man/ cs/	0x133	key_t key	size_t size	int flag	-	-	-
308	shmctl	man/ cs/	0x134	int shmid	int cmd	struct shmid_ds *buf	-	-	-
309	add_key	man/ cs/	0x135	const char *_type	const char *_description	const void *_payload	size_t plen	key_serial_t destringid	-
310	request_key	man/ cs/	0x136	const char *_type	const char *_description	const char *_callout_info	key_serial_t destringid	-	-
311	keyctl	man/ cs/	0x137	int cmd	unsigned long arg2	unsigned long arg3	unsigned long arg4	unsigned long arg5	-
312	semtimedop	man/ cs/	0x138	int semid	struct sembuf *sops	unsigned nsops	const struct __kernel_timespec *timeout	-	-
313	vserver	man/ cs/	0x139	?	?	?	?	?	?
314	ioprio_set	man/ cs/	0x13a	int which	int who	int ioprio	-	-	-
315	ioprio_get	man/ cs/	0x13b	int which	int who	-	-	-	-
316	inotify_init	man/ cs/	0x13c	-	-	-	-	-	-
317	inotify_add_watch	man/ cs/	0x13d	int fd	const char *path	u32 mask	-	-	-
318	inotify_rm_watch	man/ cs/	0x13e	int fd	__s32 wd	-	-	-	-
319	mbind	man/ cs/	0x13f	unsigned long start	unsigned long len	unsigned long mode	const unsigned long *nmask	unsigned long maxnode	unsigned flags
320	get_mempolicy	man/ cs/	0x140	int *policy	unsigned long *nmask	unsigned long maxnode	unsigned long addr	unsigned long flags	-
321	set_mempolicy	man/ cs/	0x141	int mode	const unsigned long *nmask	unsigned long maxnode	-	-	-
322	openat	man/ cs/	0x142	int dfd	const char *filename	int flags	umode_t mode	-	-
323	mkdirat	man/ cs/	0x143	int dfd	const char * pathname	umode_t mode	-	-	-
324	mknodat	man/ cs/	0x144	int dfd	const char * filename	umode_t mode	unsigned dev	-	-
325	fchownat	man/ cs/	0x145	int dfd	const char *filename	uid_t user	gid_t group	int flag	-
326	futimesat	man/ cs/	0x146	int dfd	const char *filename	struct __kernel_old_timeval *utimes	-	-	-
327	fstatat64	man/ cs/	0x147	int dfd	const char *filename	struct stat64 *statbuf	int flag	-	-
328	unlinkat	man/ cs/	0x148	int dfd	const char * pathname	int flag	-	-	-
329	renameat	man/ cs/	0x149	int olddfd	const char * oldname	int newdfd	const char * newname	-	-
330	linkat	man/ cs/	0x14a	int olddfd	const char *oldname	int newdfd	const char *newname	int flags	-
331	symlinkat	man/ cs/	0x14b	const char * oldname	int newdfd	const char * newname	-	-	-
332	readlinkat	man/ cs/	0x14c	int dfd	const char *path	char *buf	int bufsiz	-	-
333	fchmodat	man/ cs/	0x14d	int dfd	const char * filename	umode_t mode	-	-	-
334	faccessat	man/ cs/	0x14e	int dfd	const char *filename	int mode	-	-	-
335	pselect6	man/ cs/	0x14f	int	fd_set *	fd_set *	fd_set *	struct __kernel_timespec *	void *
336	ppoll	man/ cs/	0x150	struct pollfd *	unsigned int	struct __kernel_timespec *	const sigset_t *	size_t	-
337	unshare	man/ cs/	0x151	unsigned long unshare_flags	-	-	-	-	-
338	set_robust_list	man/ cs/	0x152	struct robust_list_head *head	size_t len	-	-	-	-
339	get_robust_list	man/ cs/	0x153	int pid	struct robust_list_head * *head_ptr	size_t *len_ptr	-	-	-
340	splice	man/ cs/	0x154	int fd_in	loff_t *off_in	int fd_out	loff_t *off_out	size_t len	unsigned int flags
341	arm_sync_file_range	man/ cs/	0x155	?	?	?	?	?	?
341	sync_file_range2	man/ cs/	0x155	int fd	unsigned int flags	loff_t offset	loff_t nbytes	-	-
342	tee	man/ cs/	0x156	int fdin	int fdout	size_t len	unsigned int flags	-	-
343	vmsplice	man/ cs/	0x157	int fd	const struct iovec *iov	unsigned long nr_segs	unsigned int flags	-	-
344	move_pages	man/ cs/	0x158	pid_t pid	unsigned long nr_pages	const void * *pages	const int *nodes	int *status	int flags
345	getcpu	man/ cs/	0x159	unsigned *cpu	unsigned *node	struct getcpu_cache *cache	-	-	-
346	epoll_pwait	man/ cs/	0x15a	int epfd	struct epoll_event *events	int maxevents	int timeout	const sigset_t *sigmask	size_t sigsetsize
347	kexec_load	man/ cs/	0x15b	unsigned long entry	unsigned long nr_segments	struct kexec_segment *segments	unsigned long flags	-	-
348	utimensat	man/ cs/	0x15c	int dfd	const char *filename	struct __kernel_timespec *utimes	int flags	-	-
349	signalfd	man/ cs/	0x15d	int ufd	sigset_t *user_mask	size_t sizemask	-	-	-
350	timerfd_create	man/ cs/	0x15e	int clockid	int flags	-	-	-	-
351	eventfd	man/ cs/	0x15f	unsigned int count	-	-	-	-	-
352	fallocate	man/ cs/	0x160	int fd	int mode	loff_t offset	loff_t len	-	-
353	timerfd_settime	man/ cs/	0x161	int ufd	int flags	const struct __kernel_itimerspec *utmr	struct __kernel_itimerspec *otmr	-	-
354	timerfd_gettime	man/ cs/	0x162	int ufd	struct __kernel_itimerspec *otmr	-	-	-	-
355	signalfd4	man/ cs/	0x163	int ufd	sigset_t *user_mask	size_t sizemask	int flags	-	-
356	eventfd2	man/ cs/	0x164	unsigned int count	int flags	-	-	-	-
357	epoll_create1	man/ cs/	0x165	int flags	-	-	-	-	-
358	dup3	man/ cs/	0x166	unsigned int oldfd	unsigned int newfd	int flags	-	-	-
359	pipe2	man/ cs/	0x167	int *fildes	int flags	-	-	-	-
360	inotify_init1	man/ cs/	0x168	int flags	-	-	-	-	-
361	preadv	man/ cs/	0x169	unsigned long fd	const struct iovec *vec	unsigned long vlen	unsigned long pos_l	unsigned long pos_h	-
362	pwritev	man/ cs/	0x16a	unsigned long fd	const struct iovec *vec	unsigned long vlen	unsigned long pos_l	unsigned long pos_h	-
363	rt_tgsigqueueinfo	man/ cs/	0x16b	pid_t tgid	pid_t pid	int sig	siginfo_t *uinfo	-	-
364	perf_event_open	man/ cs/	0x16c	struct perf_event_attr *attr_uptr	pid_t pid	int cpu	int group_fd	unsigned long flags	-
365	recvmmsg	man/ cs/	0x16d	int fd	struct mmsghdr *msg	unsigned int vlen	unsigned flags	struct __kernel_timespec *timeout	-
366	accept4	man/ cs/	0x16e	int	struct sockaddr *	int *	int	-	-
367	fanotify_init	man/ cs/	0x16f	unsigned int flags	unsigned int event_f_flags	-	-	-	-
368	fanotify_mark	man/ cs/	0x170	int fanotify_fd	unsigned int flags	u64 mask	int fd	const char *pathname	-
369	prlimit64	man/ cs/	0x171	pid_t pid	unsigned int resource	const struct rlimit64 *new_rlim	struct rlimit64 *old_rlim	-	-
370	name_to_handle_at	man/ cs/	0x172	int dfd	const char *name	struct file_handle *handle	int *mnt_id	int flag	-
371	open_by_handle_at	man/ cs/	0x173	int mountdirfd	struct file_handle *handle	int flags	-	-	-
372	clock_adjtime	man/ cs/	0x174	clockid_t which_clock	struct __kernel_timex *tx	-	-	-	-
373	syncfs	man/ cs/	0x175	int fd	-	-	-	-	-
374	sendmmsg	man/ cs/	0x176	int fd	struct mmsghdr *msg	unsigned int vlen	unsigned flags	-	-
375	setns	man/ cs/	0x177	int fd	int nstype	-	-	-	-
376	process_vm_readv	man/ cs/	0x178	pid_t pid	const struct iovec *lvec	unsigned long liovcnt	const struct iovec *rvec	unsigned long riovcnt	unsigned long flags
377	process_vm_writev	man/ cs/	0x179	pid_t pid	const struct iovec *lvec	unsigned long liovcnt	const struct iovec *rvec	unsigned long riovcnt	unsigned long flags
378	kcmp	man/ cs/	0x17a	pid_t pid1	pid_t pid2	int type	unsigned long idx1	unsigned long idx2	-
379	finit_module	man/ cs/	0x17b	int fd	const char *uargs	int flags	-	-	-
380	sched_setattr	man/ cs/	0x17c	pid_t pid	struct sched_attr *attr	unsigned int flags	-	-	-
381	sched_getattr	man/ cs/	0x17d	pid_t pid	struct sched_attr *attr	unsigned int size	unsigned int flags	-	-
382	renameat2	man/ cs/	0x17e	int olddfd	const char *oldname	int newdfd	const char *newname	unsigned int flags	-
383	seccomp	man/ cs/	0x17f	unsigned int op	unsigned int flags	void *uargs	-	-	-
384	getrandom	man/ cs/	0x180	char *buf	size_t count	unsigned int flags	-	-	-
385	memfd_create	man/ cs/	0x181	const char *uname_ptr	unsigned int flags	-	-	-	-
386	bpf	man/ cs/	0x182	int cmd	union bpf_attr *attr	unsigned int size	-	-	-
387	execveat	man/ cs/	0x183	int dfd	const char *filename	const char *const *argv	const char *const *envp	int flags	-
388	userfaultfd	man/ cs/	0x184	int flags	-	-	-	-	-
389	membarrier	man/ cs/	0x185	int cmd	unsigned int flags	int cpu_id	-	-	-
390	mlock2	man/ cs/	0x186	unsigned long start	size_t len	int flags	-	-	-
391	copy_file_range	man/ cs/	0x187	int fd_in	loff_t *off_in	int fd_out	loff_t *off_out	size_t len	unsigned int flags
392	preadv2	man/ cs/	0x188	unsigned long fd	const struct iovec *vec	unsigned long vlen	unsigned long pos_l	unsigned long pos_h	rwf_t flags
393	pwritev2	man/ cs/	0x189	unsigned long fd	const struct iovec *vec	unsigned long vlen	unsigned long pos_l	unsigned long pos_h	rwf_t flags
394	pkey_mprotect	man/ cs/	0x18a	unsigned long start	size_t len	unsigned long prot	int pkey	-	-
395	pkey_alloc	man/ cs/	0x18b	unsigned long flags	unsigned long init_val	-	-	-	-
396	pkey_free	man/ cs/	0x18c	int pkey	-	-	-	-	-
397	statx	man/ cs/	0x18d	int dfd	const char *path	unsigned flags	unsigned mask	struct statx *buffer	-
398	not implemented		0x18e						
399	not implemented		0x18f						
400	not implemented		0x190						
401	not implemented		0x191						
402	not implemented		0x192						
403	clock_gettime64	man/ cs/	0x193	?	?	?	?	?	?
404	clock_settime64	man/ cs/	0x194	?	?	?	?	?	?
405	clock_adjtime64	man/ cs/	0x195	?	?	?	?	?	?
406	clock_getres_time64	man/ cs/	0x196	?	?	?	?	?	?
407	clock_nanosleep_time64	man/ cs/	0x197	?	?	?	?	?	?
408	timer_gettime64	man/ cs/	0x198	?	?	?	?	?	?
409	timer_settime64	man/ cs/	0x199	?	?	?	?	?	?
410	timerfd_gettime64	man/ cs/	0x19a	?	?	?	?	?	?
411	timerfd_settime64	man/ cs/	0x19b	?	?	?	?	?	?
412	utimensat_time64	man/ cs/	0x19c	?	?	?	?	?	?
413	pselect6_time64	man/ cs/	0x19d	?	?	?	?	?	?
414	ppoll_time64	man/ cs/	0x19e	?	?	?	?	?	?
415	not implemented		0x19f						
416	io_pgetevents_time64	man/ cs/	0x1a0	?	?	?	?	?	?
417	recvmmsg_time64	man/ cs/	0x1a1	?	?	?	?	?	?
418	mq_timedsend_time64	man/ cs/	0x1a2	?	?	?	?	?	?
419	mq_timedreceive_time64	man/ cs/	0x1a3	?	?	?	?	?	?
420	semtimedop_time64	man/ cs/	0x1a4	?	?	?	?	?	?
421	rt_sigtimedwait_time64	man/ cs/	0x1a5	?	?	?	?	?	?
422	futex_time64	man/ cs/	0x1a6	?	?	?	?	?	?
423	sched_rr_get_interval_time64	man/ cs/	0x1a7	?	?	?	?	?	?
424	not implemented		0x1a8						
425	io_uring_setup	man/ cs/	0x1a9	u32 entries	struct io_uring_params *p	-	-	-	-
426	io_uring_enter	man/ cs/	0x1aa	unsigned int fd	u32 to_submit	u32 min_complete	u32 flags	const void *argp	size_t argsz
427	not implemented		0x1ab						
428	not implemented		0x1ac						
429	not implemented		0x1ad						
430	not implemented		0x1ae						
431	not implemented		0x1af						
432	not implemented		0x1b0						
433	not implemented		0x1b1						
434	not implemented		0x1b2						
435	not implemented		0x1b3						
436	not implemented		0x1b4						
437	not implemented		0x1b5						
438	not implemented		0x1b6						
439	faccessat2	man/ cs/	0x1b7	int dfd	const char *filename	int mode	int flags	-	-
983041	ARM_breakpoint	man/ cs/	0xf0001	?	?	?	?	?	?
983042	ARM_cacheflush	man/ cs/	0xf0002	?	?	?	?	?	?
983043	ARM_usr26	man/ cs/	0xf0003	?	?	?	?	?	?
983044	ARM_usr32	man/ cs/	0xf0004	?	?	?	?	?	?
983045	ARM_set_tls	man/ cs/	0xf0005	?	?	?	?	?	?
arm64 (64-bit)
Compiled from Linux 4.14.0 headers.

NR	syscall name	references	%x8	arg0 (%x0)	arg1 (%x1)	arg2 (%x2)	arg3 (%x3)	arg4 (%x4)	arg5 (%x5)
0	io_setup	man/ cs/	0x00	unsigned nr_reqs	aio_context_t *ctx	-	-	-	-
1	io_destroy	man/ cs/	0x01	aio_context_t ctx	-	-	-	-	-
2	io_submit	man/ cs/	0x02	aio_context_t	long	struct iocb * *	-	-	-
3	io_cancel	man/ cs/	0x03	aio_context_t ctx_id	struct iocb *iocb	struct io_event *result	-	-	-
4	io_getevents	man/ cs/	0x04	aio_context_t ctx_id	long min_nr	long nr	struct io_event *events	struct __kernel_timespec *timeout	-
5	setxattr	man/ cs/	0x05	const char *path	const char *name	const void *value	size_t size	int flags	-
6	lsetxattr	man/ cs/	0x06	const char *path	const char *name	const void *value	size_t size	int flags	-
7	fsetxattr	man/ cs/	0x07	int fd	const char *name	const void *value	size_t size	int flags	-
8	getxattr	man/ cs/	0x08	const char *path	const char *name	void *value	size_t size	-	-
9	lgetxattr	man/ cs/	0x09	const char *path	const char *name	void *value	size_t size	-	-
10	fgetxattr	man/ cs/	0x0a	int fd	const char *name	void *value	size_t size	-	-
11	listxattr	man/ cs/	0x0b	const char *path	char *list	size_t size	-	-	-
12	llistxattr	man/ cs/	0x0c	const char *path	char *list	size_t size	-	-	-
13	flistxattr	man/ cs/	0x0d	int fd	char *list	size_t size	-	-	-
14	removexattr	man/ cs/	0x0e	const char *path	const char *name	-	-	-	-
15	lremovexattr	man/ cs/	0x0f	const char *path	const char *name	-	-	-	-
16	fremovexattr	man/ cs/	0x10	int fd	const char *name	-	-	-	-
17	getcwd	man/ cs/	0x11	char *buf	unsigned long size	-	-	-	-
18	lookup_dcookie	man/ cs/	0x12	u64 cookie64	char *buf	size_t len	-	-	-
19	eventfd2	man/ cs/	0x13	unsigned int count	int flags	-	-	-	-
20	epoll_create1	man/ cs/	0x14	int flags	-	-	-	-	-
21	epoll_ctl	man/ cs/	0x15	int epfd	int op	int fd	struct epoll_event *event	-	-
22	epoll_pwait	man/ cs/	0x16	int epfd	struct epoll_event *events	int maxevents	int timeout	const sigset_t *sigmask	size_t sigsetsize
23	dup	man/ cs/	0x17	unsigned int fildes	-	-	-	-	-
24	dup3	man/ cs/	0x18	unsigned int oldfd	unsigned int newfd	int flags	-	-	-
25	fcntl	man/ cs/	0x19	unsigned int fd	unsigned int cmd	unsigned long arg	-	-	-
26	inotify_init1	man/ cs/	0x1a	int flags	-	-	-	-	-
27	inotify_add_watch	man/ cs/	0x1b	int fd	const char *path	u32 mask	-	-	-
28	inotify_rm_watch	man/ cs/	0x1c	int fd	__s32 wd	-	-	-	-
29	ioctl	man/ cs/	0x1d	unsigned int fd	unsigned int cmd	unsigned long arg	-	-	-
30	ioprio_set	man/ cs/	0x1e	int which	int who	int ioprio	-	-	-
31	ioprio_get	man/ cs/	0x1f	int which	int who	-	-	-	-
32	flock	man/ cs/	0x20	unsigned int fd	unsigned int cmd	-	-	-	-
33	mknodat	man/ cs/	0x21	int dfd	const char * filename	umode_t mode	unsigned dev	-	-
34	mkdirat	man/ cs/	0x22	int dfd	const char * pathname	umode_t mode	-	-	-
35	unlinkat	man/ cs/	0x23	int dfd	const char * pathname	int flag	-	-	-
36	symlinkat	man/ cs/	0x24	const char * oldname	int newdfd	const char * newname	-	-	-
37	linkat	man/ cs/	0x25	int olddfd	const char *oldname	int newdfd	const char *newname	int flags	-
38	renameat	man/ cs/	0x26	int olddfd	const char * oldname	int newdfd	const char * newname	-	-
39	umount2	man/ cs/	0x27	?	?	?	?	?	?
40	mount	man/ cs/	0x28	char *dev_name	char *dir_name	char *type	unsigned long flags	void *data	-
41	pivot_root	man/ cs/	0x29	const char *new_root	const char *put_old	-	-	-	-
42	nfsservctl	man/ cs/	0x2a	?	?	?	?	?	?
43	statfs	man/ cs/	0x2b	const char * path	struct statfs *buf	-	-	-	-
44	fstatfs	man/ cs/	0x2c	unsigned int fd	struct statfs *buf	-	-	-	-
45	truncate	man/ cs/	0x2d	const char *path	long length	-	-	-	-
46	ftruncate	man/ cs/	0x2e	unsigned int fd	unsigned long length	-	-	-	-
47	fallocate	man/ cs/	0x2f	int fd	int mode	loff_t offset	loff_t len	-	-
48	faccessat	man/ cs/	0x30	int dfd	const char *filename	int mode	-	-	-
49	chdir	man/ cs/	0x31	const char *filename	-	-	-	-	-
50	fchdir	man/ cs/	0x32	unsigned int fd	-	-	-	-	-
51	chroot	man/ cs/	0x33	const char *filename	-	-	-	-	-
52	fchmod	man/ cs/	0x34	unsigned int fd	umode_t mode	-	-	-	-
53	fchmodat	man/ cs/	0x35	int dfd	const char * filename	umode_t mode	-	-	-
54	fchownat	man/ cs/	0x36	int dfd	const char *filename	uid_t user	gid_t group	int flag	-
55	fchown	man/ cs/	0x37	unsigned int fd	uid_t user	gid_t group	-	-	-
56	openat	man/ cs/	0x38	int dfd	const char *filename	int flags	umode_t mode	-	-
57	close	man/ cs/	0x39	unsigned int fd	-	-	-	-	-
58	vhangup	man/ cs/	0x3a	-	-	-	-	-	-
59	pipe2	man/ cs/	0x3b	int *fildes	int flags	-	-	-	-
60	quotactl	man/ cs/	0x3c	unsigned int cmd	const char *special	qid_t id	void *addr	-	-
61	getdents64	man/ cs/	0x3d	unsigned int fd	struct linux_dirent64 *dirent	unsigned int count	-	-	-
62	lseek	man/ cs/	0x3e	unsigned int fd	off_t offset	unsigned int whence	-	-	-
63	read	man/ cs/	0x3f	unsigned int fd	char *buf	size_t count	-	-	-
64	write	man/ cs/	0x40	unsigned int fd	const char *buf	size_t count	-	-	-
65	readv	man/ cs/	0x41	unsigned long fd	const struct iovec *vec	unsigned long vlen	-	-	-
66	writev	man/ cs/	0x42	unsigned long fd	const struct iovec *vec	unsigned long vlen	-	-	-
67	pread64	man/ cs/	0x43	unsigned int fd	char *buf	size_t count	loff_t pos	-	-
68	pwrite64	man/ cs/	0x44	unsigned int fd	const char *buf	size_t count	loff_t pos	-	-
69	preadv	man/ cs/	0x45	unsigned long fd	const struct iovec *vec	unsigned long vlen	unsigned long pos_l	unsigned long pos_h	-
70	pwritev	man/ cs/	0x46	unsigned long fd	const struct iovec *vec	unsigned long vlen	unsigned long pos_l	unsigned long pos_h	-
71	sendfile	man/ cs/	0x47	int out_fd	int in_fd	off_t *offset	size_t count	-	-
72	pselect6	man/ cs/	0x48	int	fd_set *	fd_set *	fd_set *	struct __kernel_timespec *	void *
73	ppoll	man/ cs/	0x49	struct pollfd *	unsigned int	struct __kernel_timespec *	const sigset_t *	size_t	-
74	signalfd4	man/ cs/	0x4a	int ufd	sigset_t *user_mask	size_t sizemask	int flags	-	-
75	vmsplice	man/ cs/	0x4b	int fd	const struct iovec *iov	unsigned long nr_segs	unsigned int flags	-	-
76	splice	man/ cs/	0x4c	int fd_in	loff_t *off_in	int fd_out	loff_t *off_out	size_t len	unsigned int flags
77	tee	man/ cs/	0x4d	int fdin	int fdout	size_t len	unsigned int flags	-	-
78	readlinkat	man/ cs/	0x4e	int dfd	const char *path	char *buf	int bufsiz	-	-
79	newfstatat	man/ cs/	0x4f	int dfd	const char *filename	struct stat *statbuf	int flag	-	-
80	fstat	man/ cs/	0x50	unsigned int fd	struct __old_kernel_stat *statbuf	-	-	-	-
81	sync	man/ cs/	0x51	-	-	-	-	-	-
82	fsync	man/ cs/	0x52	unsigned int fd	-	-	-	-	-
83	fdatasync	man/ cs/	0x53	unsigned int fd	-	-	-	-	-
84	sync_file_range	man/ cs/	0x54	int fd	loff_t offset	loff_t nbytes	unsigned int flags	-	-
85	timerfd_create	man/ cs/	0x55	int clockid	int flags	-	-	-	-
86	timerfd_settime	man/ cs/	0x56	int ufd	int flags	const struct __kernel_itimerspec *utmr	struct __kernel_itimerspec *otmr	-	-
87	timerfd_gettime	man/ cs/	0x57	int ufd	struct __kernel_itimerspec *otmr	-	-	-	-
88	utimensat	man/ cs/	0x58	int dfd	const char *filename	struct __kernel_timespec *utimes	int flags	-	-
89	acct	man/ cs/	0x59	const char *name	-	-	-	-	-
90	capget	man/ cs/	0x5a	cap_user_header_t header	cap_user_data_t dataptr	-	-	-	-
91	capset	man/ cs/	0x5b	cap_user_header_t header	const cap_user_data_t data	-	-	-	-
92	personality	man/ cs/	0x5c	unsigned int personality	-	-	-	-	-
93	exit	man/ cs/	0x5d	int error_code	-	-	-	-	-
94	exit_group	man/ cs/	0x5e	int error_code	-	-	-	-	-
95	waitid	man/ cs/	0x5f	int which	pid_t pid	struct siginfo *infop	int options	struct rusage *ru	-
96	set_tid_address	man/ cs/	0x60	int *tidptr	-	-	-	-	-
97	unshare	man/ cs/	0x61	unsigned long unshare_flags	-	-	-	-	-
98	futex	man/ cs/	0x62	u32 *uaddr	int op	u32 val	const struct __kernel_timespec *utime	u32 *uaddr2	u32 val3
99	set_robust_list	man/ cs/	0x63	struct robust_list_head *head	size_t len	-	-	-	-
100	get_robust_list	man/ cs/	0x64	int pid	struct robust_list_head * *head_ptr	size_t *len_ptr	-	-	-
101	nanosleep	man/ cs/	0x65	struct __kernel_timespec *rqtp	struct __kernel_timespec *rmtp	-	-	-	-
102	getitimer	man/ cs/	0x66	int which	struct __kernel_old_itimerval *value	-	-	-	-
103	setitimer	man/ cs/	0x67	int which	struct __kernel_old_itimerval *value	struct __kernel_old_itimerval *ovalue	-	-	-
104	kexec_load	man/ cs/	0x68	unsigned long entry	unsigned long nr_segments	struct kexec_segment *segments	unsigned long flags	-	-
105	init_module	man/ cs/	0x69	void *umod	unsigned long len	const char *uargs	-	-	-
106	delete_module	man/ cs/	0x6a	const char *name_user	unsigned int flags	-	-	-	-
107	timer_create	man/ cs/	0x6b	clockid_t which_clock	struct sigevent *timer_event_spec	timer_t * created_timer_id	-	-	-
108	timer_gettime	man/ cs/	0x6c	timer_t timer_id	struct __kernel_itimerspec *setting	-	-	-	-
109	timer_getoverrun	man/ cs/	0x6d	timer_t timer_id	-	-	-	-	-
110	timer_settime	man/ cs/	0x6e	timer_t timer_id	int flags	const struct __kernel_itimerspec *new_setting	struct __kernel_itimerspec *old_setting	-	-
111	timer_delete	man/ cs/	0x6f	timer_t timer_id	-	-	-	-	-
112	clock_settime	man/ cs/	0x70	clockid_t which_clock	const struct __kernel_timespec *tp	-	-	-	-
113	clock_gettime	man/ cs/	0x71	clockid_t which_clock	struct __kernel_timespec *tp	-	-	-	-
114	clock_getres	man/ cs/	0x72	clockid_t which_clock	struct __kernel_timespec *tp	-	-	-	-
115	clock_nanosleep	man/ cs/	0x73	clockid_t which_clock	int flags	const struct __kernel_timespec *rqtp	struct __kernel_timespec *rmtp	-	-
116	syslog	man/ cs/	0x74	int type	char *buf	int len	-	-	-
117	ptrace	man/ cs/	0x75	long request	long pid	unsigned long addr	unsigned long data	-	-
118	sched_setparam	man/ cs/	0x76	pid_t pid	struct sched_param *param	-	-	-	-
119	sched_setscheduler	man/ cs/	0x77	pid_t pid	int policy	struct sched_param *param	-	-	-
120	sched_getscheduler	man/ cs/	0x78	pid_t pid	-	-	-	-	-
121	sched_getparam	man/ cs/	0x79	pid_t pid	struct sched_param *param	-	-	-	-
122	sched_setaffinity	man/ cs/	0x7a	pid_t pid	unsigned int len	unsigned long *user_mask_ptr	-	-	-
123	sched_getaffinity	man/ cs/	0x7b	pid_t pid	unsigned int len	unsigned long *user_mask_ptr	-	-	-
124	sched_yield	man/ cs/	0x7c	-	-	-	-	-	-
125	sched_get_priority_max	man/ cs/	0x7d	int policy	-	-	-	-	-
126	sched_get_priority_min	man/ cs/	0x7e	int policy	-	-	-	-	-
127	sched_rr_get_interval	man/ cs/	0x7f	pid_t pid	struct __kernel_timespec *interval	-	-	-	-
128	restart_syscall	man/ cs/	0x80	-	-	-	-	-	-
129	kill	man/ cs/	0x81	pid_t pid	int sig	-	-	-	-
130	tkill	man/ cs/	0x82	pid_t pid	int sig	-	-	-	-
131	tgkill	man/ cs/	0x83	pid_t tgid	pid_t pid	int sig	-	-	-
132	sigaltstack	man/ cs/	0x84	const struct sigaltstack *uss	struct sigaltstack *uoss	-	-	-	-
133	rt_sigsuspend	man/ cs/	0x85	sigset_t *unewset	size_t sigsetsize	-	-	-	-
134	rt_sigaction	man/ cs/	0x86	int	const struct sigaction *	struct sigaction *	size_t	-	-
135	rt_sigprocmask	man/ cs/	0x87	int how	sigset_t *set	sigset_t *oset	size_t sigsetsize	-	-
136	rt_sigpending	man/ cs/	0x88	sigset_t *set	size_t sigsetsize	-	-	-	-
137	rt_sigtimedwait	man/ cs/	0x89	const sigset_t *uthese	siginfo_t *uinfo	const struct __kernel_timespec *uts	size_t sigsetsize	-	-
138	rt_sigqueueinfo	man/ cs/	0x8a	pid_t pid	int sig	siginfo_t *uinfo	-	-	-
139	rt_sigreturn	man/ cs/	0x8b	?	?	?	?	?	?
140	setpriority	man/ cs/	0x8c	int which	int who	int niceval	-	-	-
141	getpriority	man/ cs/	0x8d	int which	int who	-	-	-	-
142	reboot	man/ cs/	0x8e	int magic1	int magic2	unsigned int cmd	void *arg	-	-
143	setregid	man/ cs/	0x8f	gid_t rgid	gid_t egid	-	-	-	-
144	setgid	man/ cs/	0x90	gid_t gid	-	-	-	-	-
145	setreuid	man/ cs/	0x91	uid_t ruid	uid_t euid	-	-	-	-
146	setuid	man/ cs/	0x92	uid_t uid	-	-	-	-	-
147	setresuid	man/ cs/	0x93	uid_t ruid	uid_t euid	uid_t suid	-	-	-
148	getresuid	man/ cs/	0x94	uid_t *ruid	uid_t *euid	uid_t *suid	-	-	-
149	setresgid	man/ cs/	0x95	gid_t rgid	gid_t egid	gid_t sgid	-	-	-
150	getresgid	man/ cs/	0x96	gid_t *rgid	gid_t *egid	gid_t *sgid	-	-	-
151	setfsuid	man/ cs/	0x97	uid_t uid	-	-	-	-	-
152	setfsgid	man/ cs/	0x98	gid_t gid	-	-	-	-	-
153	times	man/ cs/	0x99	struct tms *tbuf	-	-	-	-	-
154	setpgid	man/ cs/	0x9a	pid_t pid	pid_t pgid	-	-	-	-
155	getpgid	man/ cs/	0x9b	pid_t pid	-	-	-	-	-
156	getsid	man/ cs/	0x9c	pid_t pid	-	-	-	-	-
157	setsid	man/ cs/	0x9d	-	-	-	-	-	-
158	getgroups	man/ cs/	0x9e	int gidsetsize	gid_t *grouplist	-	-	-	-
159	setgroups	man/ cs/	0x9f	int gidsetsize	gid_t *grouplist	-	-	-	-
160	uname	man/ cs/	0xa0	struct old_utsname *	-	-	-	-	-
161	sethostname	man/ cs/	0xa1	char *name	int len	-	-	-	-
162	setdomainname	man/ cs/	0xa2	char *name	int len	-	-	-	-
163	getrlimit	man/ cs/	0xa3	unsigned int resource	struct rlimit *rlim	-	-	-	-
164	setrlimit	man/ cs/	0xa4	unsigned int resource	struct rlimit *rlim	-	-	-	-
165	getrusage	man/ cs/	0xa5	int who	struct rusage *ru	-	-	-	-
166	umask	man/ cs/	0xa6	int mask	-	-	-	-	-
167	prctl	man/ cs/	0xa7	int option	unsigned long arg2	unsigned long arg3	unsigned long arg4	unsigned long arg5	-
168	getcpu	man/ cs/	0xa8	unsigned *cpu	unsigned *node	struct getcpu_cache *cache	-	-	-
169	gettimeofday	man/ cs/	0xa9	struct __kernel_old_timeval *tv	struct timezone *tz	-	-	-	-
170	settimeofday	man/ cs/	0xaa	struct __kernel_old_timeval *tv	struct timezone *tz	-	-	-	-
171	adjtimex	man/ cs/	0xab	struct __kernel_timex *txc_p	-	-	-	-	-
172	getpid	man/ cs/	0xac	-	-	-	-	-	-
173	getppid	man/ cs/	0xad	-	-	-	-	-	-
174	getuid	man/ cs/	0xae	-	-	-	-	-	-
175	geteuid	man/ cs/	0xaf	-	-	-	-	-	-
176	getgid	man/ cs/	0xb0	-	-	-	-	-	-
177	getegid	man/ cs/	0xb1	-	-	-	-	-	-
178	gettid	man/ cs/	0xb2	-	-	-	-	-	-
179	sysinfo	man/ cs/	0xb3	struct sysinfo *info	-	-	-	-	-
180	mq_open	man/ cs/	0xb4	const char *name	int oflag	umode_t mode	struct mq_attr *attr	-	-
181	mq_unlink	man/ cs/	0xb5	const char *name	-	-	-	-	-
182	mq_timedsend	man/ cs/	0xb6	mqd_t mqdes	const char *msg_ptr	size_t msg_len	unsigned int msg_prio	const struct __kernel_timespec *abs_timeout	-
183	mq_timedreceive	man/ cs/	0xb7	mqd_t mqdes	char *msg_ptr	size_t msg_len	unsigned int *msg_prio	const struct __kernel_timespec *abs_timeout	-
184	mq_notify	man/ cs/	0xb8	mqd_t mqdes	const struct sigevent *notification	-	-	-	-
185	mq_getsetattr	man/ cs/	0xb9	mqd_t mqdes	const struct mq_attr *mqstat	struct mq_attr *omqstat	-	-	-
186	msgget	man/ cs/	0xba	key_t key	int msgflg	-	-	-	-
187	msgctl	man/ cs/	0xbb	int msqid	int cmd	struct msqid_ds *buf	-	-	-
188	msgrcv	man/ cs/	0xbc	int msqid	struct msgbuf *msgp	size_t msgsz	long msgtyp	int msgflg	-
189	msgsnd	man/ cs/	0xbd	int msqid	struct msgbuf *msgp	size_t msgsz	int msgflg	-	-
190	semget	man/ cs/	0xbe	key_t key	int nsems	int semflg	-	-	-
191	semctl	man/ cs/	0xbf	int semid	int semnum	int cmd	unsigned long arg	-	-
192	semtimedop	man/ cs/	0xc0	int semid	struct sembuf *sops	unsigned nsops	const struct __kernel_timespec *timeout	-	-
193	semop	man/ cs/	0xc1	int semid	struct sembuf *sops	unsigned nsops	-	-	-
194	shmget	man/ cs/	0xc2	key_t key	size_t size	int flag	-	-	-
195	shmctl	man/ cs/	0xc3	int shmid	int cmd	struct shmid_ds *buf	-	-	-
196	shmat	man/ cs/	0xc4	int shmid	char *shmaddr	int shmflg	-	-	-
197	shmdt	man/ cs/	0xc5	char *shmaddr	-	-	-	-	-
198	socket	man/ cs/	0xc6	int	int	int	-	-	-
199	socketpair	man/ cs/	0xc7	int	int	int	int *	-	-
200	bind	man/ cs/	0xc8	int	struct sockaddr *	int	-	-	-
201	listen	man/ cs/	0xc9	int	int	-	-	-	-
202	accept	man/ cs/	0xca	int	struct sockaddr *	int *	-	-	-
203	connect	man/ cs/	0xcb	int	struct sockaddr *	int	-	-	-
204	getsockname	man/ cs/	0xcc	int	struct sockaddr *	int *	-	-	-
205	getpeername	man/ cs/	0xcd	int	struct sockaddr *	int *	-	-	-
206	sendto	man/ cs/	0xce	int	void *	size_t	unsigned	struct sockaddr *	int
207	recvfrom	man/ cs/	0xcf	int	void *	size_t	unsigned	struct sockaddr *	int *
208	setsockopt	man/ cs/	0xd0	int fd	int level	int optname	char *optval	int optlen	-
209	getsockopt	man/ cs/	0xd1	int fd	int level	int optname	char *optval	int *optlen	-
210	shutdown	man/ cs/	0xd2	int	int	-	-	-	-
211	sendmsg	man/ cs/	0xd3	int fd	struct user_msghdr *msg	unsigned flags	-	-	-
212	recvmsg	man/ cs/	0xd4	int fd	struct user_msghdr *msg	unsigned flags	-	-	-
213	readahead	man/ cs/	0xd5	int fd	loff_t offset	size_t count	-	-	-
214	brk	man/ cs/	0xd6	unsigned long brk	-	-	-	-	-
215	munmap	man/ cs/	0xd7	unsigned long addr	size_t len	-	-	-	-
216	mremap	man/ cs/	0xd8	unsigned long addr	unsigned long old_len	unsigned long new_len	unsigned long flags	unsigned long new_addr	-
217	add_key	man/ cs/	0xd9	const char *_type	const char *_description	const void *_payload	size_t plen	key_serial_t destringid	-
218	request_key	man/ cs/	0xda	const char *_type	const char *_description	const char *_callout_info	key_serial_t destringid	-	-
219	keyctl	man/ cs/	0xdb	int cmd	unsigned long arg2	unsigned long arg3	unsigned long arg4	unsigned long arg5	-
220	clone	man/ cs/	0xdc	unsigned long	unsigned long	int *	int *	unsigned long	-
221	execve	man/ cs/	0xdd	const char *filename	const char *const *argv	const char *const *envp	-	-	-
222	mmap	man/ cs/	0xde	?	?	?	?	?	?
223	fadvise64	man/ cs/	0xdf	int fd	loff_t offset	size_t len	int advice	-	-
224	swapon	man/ cs/	0xe0	const char *specialfile	int swap_flags	-	-	-	-
225	swapoff	man/ cs/	0xe1	const char *specialfile	-	-	-	-	-
226	mprotect	man/ cs/	0xe2	unsigned long start	size_t len	unsigned long prot	-	-	-
227	msync	man/ cs/	0xe3	unsigned long start	size_t len	int flags	-	-	-
228	mlock	man/ cs/	0xe4	unsigned long start	size_t len	-	-	-	-
229	munlock	man/ cs/	0xe5	unsigned long start	size_t len	-	-	-	-
230	mlockall	man/ cs/	0xe6	int flags	-	-	-	-	-
231	munlockall	man/ cs/	0xe7	-	-	-	-	-	-
232	mincore	man/ cs/	0xe8	unsigned long start	size_t len	unsigned char * vec	-	-	-
233	madvise	man/ cs/	0xe9	unsigned long start	size_t len	int behavior	-	-	-
234	remap_file_pages	man/ cs/	0xea	unsigned long start	unsigned long size	unsigned long prot	unsigned long pgoff	unsigned long flags	-
235	mbind	man/ cs/	0xeb	unsigned long start	unsigned long len	unsigned long mode	const unsigned long *nmask	unsigned long maxnode	unsigned flags
236	get_mempolicy	man/ cs/	0xec	int *policy	unsigned long *nmask	unsigned long maxnode	unsigned long addr	unsigned long flags	-
237	set_mempolicy	man/ cs/	0xed	int mode	const unsigned long *nmask	unsigned long maxnode	-	-	-
238	migrate_pages	man/ cs/	0xee	pid_t pid	unsigned long maxnode	const unsigned long *from	const unsigned long *to	-	-
239	move_pages	man/ cs/	0xef	pid_t pid	unsigned long nr_pages	const void * *pages	const int *nodes	int *status	int flags
240	rt_tgsigqueueinfo	man/ cs/	0xf0	pid_t tgid	pid_t pid	int sig	siginfo_t *uinfo	-	-
241	perf_event_open	man/ cs/	0xf1	struct perf_event_attr *attr_uptr	pid_t pid	int cpu	int group_fd	unsigned long flags	-
242	accept4	man/ cs/	0xf2	int	struct sockaddr *	int *	int	-	-
243	recvmmsg	man/ cs/	0xf3	int fd	struct mmsghdr *msg	unsigned int vlen	unsigned flags	struct __kernel_timespec *timeout	-
244	not implemented		0xf4						
245	not implemented		0xf5						
246	not implemented		0xf6						
247	not implemented		0xf7						
248	not implemented		0xf8						
249	not implemented		0xf9						
250	not implemented		0xfa						
251	not implemented		0xfb						
252	not implemented		0xfc						
253	not implemented		0xfd						
254	not implemented		0xfe						
255	not implemented		0xff						
256	not implemented		0x100						
257	not implemented		0x101						
258	not implemented		0x102						
259	not implemented		0x103						
260	wait4	man/ cs/	0x104	pid_t pid	int *stat_addr	int options	struct rusage *ru	-	-
261	prlimit64	man/ cs/	0x105	pid_t pid	unsigned int resource	const struct rlimit64 *new_rlim	struct rlimit64 *old_rlim	-	-
262	fanotify_init	man/ cs/	0x106	unsigned int flags	unsigned int event_f_flags	-	-	-	-
263	fanotify_mark	man/ cs/	0x107	int fanotify_fd	unsigned int flags	u64 mask	int fd	const char *pathname	-
264	name_to_handle_at	man/ cs/	0x108	int dfd	const char *name	struct file_handle *handle	int *mnt_id	int flag	-
265	open_by_handle_at	man/ cs/	0x109	int mountdirfd	struct file_handle *handle	int flags	-	-	-
266	clock_adjtime	man/ cs/	0x10a	clockid_t which_clock	struct __kernel_timex *tx	-	-	-	-
267	syncfs	man/ cs/	0x10b	int fd	-	-	-	-	-
268	setns	man/ cs/	0x10c	int fd	int nstype	-	-	-	-
269	sendmmsg	man/ cs/	0x10d	int fd	struct mmsghdr *msg	unsigned int vlen	unsigned flags	-	-
270	process_vm_readv	man/ cs/	0x10e	pid_t pid	const struct iovec *lvec	unsigned long liovcnt	const struct iovec *rvec	unsigned long riovcnt	unsigned long flags
271	process_vm_writev	man/ cs/	0x10f	pid_t pid	const struct iovec *lvec	unsigned long liovcnt	const struct iovec *rvec	unsigned long riovcnt	unsigned long flags
272	kcmp	man/ cs/	0x110	pid_t pid1	pid_t pid2	int type	unsigned long idx1	unsigned long idx2	-
273	finit_module	man/ cs/	0x111	int fd	const char *uargs	int flags	-	-	-
274	sched_setattr	man/ cs/	0x112	pid_t pid	struct sched_attr *attr	unsigned int flags	-	-	-
275	sched_getattr	man/ cs/	0x113	pid_t pid	struct sched_attr *attr	unsigned int size	unsigned int flags	-	-
276	renameat2	man/ cs/	0x114	int olddfd	const char *oldname	int newdfd	const char *newname	unsigned int flags	-
277	seccomp	man/ cs/	0x115	unsigned int op	unsigned int flags	void *uargs	-	-	-
278	getrandom	man/ cs/	0x116	char *buf	size_t count	unsigned int flags	-	-	-
279	memfd_create	man/ cs/	0x117	const char *uname_ptr	unsigned int flags	-	-	-	-
280	bpf	man/ cs/	0x118	int cmd	union bpf_attr *attr	unsigned int size	-	-	-
281	execveat	man/ cs/	0x119	int dfd	const char *filename	const char *const *argv	const char *const *envp	int flags	-
282	userfaultfd	man/ cs/	0x11a	int flags	-	-	-	-	-
283	membarrier	man/ cs/	0x11b	int cmd	unsigned int flags	int cpu_id	-	-	-
284	mlock2	man/ cs/	0x11c	unsigned long start	size_t len	int flags	-	-	-
285	copy_file_range	man/ cs/	0x11d	int fd_in	loff_t *off_in	int fd_out	loff_t *off_out	size_t len	unsigned int flags
286	preadv2	man/ cs/	0x11e	unsigned long fd	const struct iovec *vec	unsigned long vlen	unsigned long pos_l	unsigned long pos_h	rwf_t flags
287	pwritev2	man/ cs/	0x11f	unsigned long fd	const struct iovec *vec	unsigned long vlen	unsigned long pos_l	unsigned long pos_h	rwf_t flags
288	pkey_mprotect	man/ cs/	0x120	unsigned long start	size_t len	unsigned long prot	int pkey	-	-
289	pkey_alloc	man/ cs/	0x121	unsigned long flags	unsigned long init_val	-	-	-	-
290	pkey_free	man/ cs/	0x122	int pkey	-	-	-	-	-
291	statx	man/ cs/	0x123	int dfd	const char *path	unsigned flags	unsigned mask	struct statx *buffer	-
425	io_uring_setup	man/ cs/	0x1a9	u32 entries	struct io_uring_params *p	-	-	-	-
426	io_uring_enter	man/ cs/	0x1aa	unsigned int fd	u32 to_submit	u32 min_complete	u32 flags	const void *argp	size_t argsz
427	not implemented		0x1ab						
428	not implemented		0x1ac						
429	not implemented		0x1ad						
430	not implemented		0x1ae						
431	not implemented		0x1af						
432	not implemented		0x1b0						
433	not implemented		0x1b1						
434	not implemented		0x1b2						
435	not implemented		0x1b3						
436	not implemented		0x1b4						
437	not implemented		0x1b5						
438	not implemented		0x1b6						
439	faccessat2	man/ cs/	0x1b7	int dfd	const char *filename	int mode	int flags	-	-
x86 (32-bit)
Compiled from Linux 4.14.0 headers.

NR	syscall name	references	%eax	arg0 (%ebx)	arg1 (%ecx)	arg2 (%edx)	arg3 (%esi)	arg4 (%edi)	arg5 (%ebp)
0	restart_syscall	man/ cs/	0x00	-	-	-	-	-	-
1	exit	man/ cs/	0x01	int error_code	-	-	-	-	-
2	fork	man/ cs/	0x02	-	-	-	-	-	-
3	read	man/ cs/	0x03	unsigned int fd	char *buf	size_t count	-	-	-
4	write	man/ cs/	0x04	unsigned int fd	const char *buf	size_t count	-	-	-
5	open	man/ cs/	0x05	const char *filename	int flags	umode_t mode	-	-	-
6	close	man/ cs/	0x06	unsigned int fd	-	-	-	-	-
7	waitpid	man/ cs/	0x07	pid_t pid	int *stat_addr	int options	-	-	-
8	creat	man/ cs/	0x08	const char *pathname	umode_t mode	-	-	-	-
9	link	man/ cs/	0x09	const char *oldname	const char *newname	-	-	-	-
10	unlink	man/ cs/	0x0a	const char *pathname	-	-	-	-	-
11	execve	man/ cs/	0x0b	const char *filename	const char *const *argv	const char *const *envp	-	-	-
12	chdir	man/ cs/	0x0c	const char *filename	-	-	-	-	-
13	time	man/ cs/	0x0d	__kernel_old_time_t *tloc	-	-	-	-	-
14	mknod	man/ cs/	0x0e	const char *filename	umode_t mode	unsigned dev	-	-	-
15	chmod	man/ cs/	0x0f	const char *filename	umode_t mode	-	-	-	-
16	lchown	man/ cs/	0x10	const char *filename	uid_t user	gid_t group	-	-	-
17	break	man/ cs/	0x11	?	?	?	?	?	?
18	oldstat	man/ cs/	0x12	?	?	?	?	?	?
19	lseek	man/ cs/	0x13	unsigned int fd	off_t offset	unsigned int whence	-	-	-
20	getpid	man/ cs/	0x14	-	-	-	-	-	-
21	mount	man/ cs/	0x15	char *dev_name	char *dir_name	char *type	unsigned long flags	void *data	-
22	umount	man/ cs/	0x16	char *name	int flags	-	-	-	-
23	setuid	man/ cs/	0x17	uid_t uid	-	-	-	-	-
24	getuid	man/ cs/	0x18	-	-	-	-	-	-
25	stime	man/ cs/	0x19	__kernel_old_time_t *tptr	-	-	-	-	-
26	ptrace	man/ cs/	0x1a	long request	long pid	unsigned long addr	unsigned long data	-	-
27	alarm	man/ cs/	0x1b	unsigned int seconds	-	-	-	-	-
28	oldfstat	man/ cs/	0x1c	?	?	?	?	?	?
29	pause	man/ cs/	0x1d	-	-	-	-	-	-
30	utime	man/ cs/	0x1e	char *filename	struct utimbuf *times	-	-	-	-
31	stty	man/ cs/	0x1f	?	?	?	?	?	?
32	gtty	man/ cs/	0x20	?	?	?	?	?	?
33	access	man/ cs/	0x21	const char *filename	int mode	-	-	-	-
34	nice	man/ cs/	0x22	int increment	-	-	-	-	-
35	ftime	man/ cs/	0x23	?	?	?	?	?	?
36	sync	man/ cs/	0x24	-	-	-	-	-	-
37	kill	man/ cs/	0x25	pid_t pid	int sig	-	-	-	-
38	rename	man/ cs/	0x26	const char *oldname	const char *newname	-	-	-	-
39	mkdir	man/ cs/	0x27	const char *pathname	umode_t mode	-	-	-	-
40	rmdir	man/ cs/	0x28	const char *pathname	-	-	-	-	-
41	dup	man/ cs/	0x29	unsigned int fildes	-	-	-	-	-
42	pipe	man/ cs/	0x2a	int *fildes	-	-	-	-	-
43	times	man/ cs/	0x2b	struct tms *tbuf	-	-	-	-	-
44	prof	man/ cs/	0x2c	?	?	?	?	?	?
45	brk	man/ cs/	0x2d	unsigned long brk	-	-	-	-	-
46	setgid	man/ cs/	0x2e	gid_t gid	-	-	-	-	-
47	getgid	man/ cs/	0x2f	-	-	-	-	-	-
48	signal	man/ cs/	0x30	int sig	__sighandler_t handler	-	-	-	-
49	geteuid	man/ cs/	0x31	-	-	-	-	-	-
50	getegid	man/ cs/	0x32	-	-	-	-	-	-
51	acct	man/ cs/	0x33	const char *name	-	-	-	-	-
52	umount2	man/ cs/	0x34	?	?	?	?	?	?
53	lock	man/ cs/	0x35	?	?	?	?	?	?
54	ioctl	man/ cs/	0x36	unsigned int fd	unsigned int cmd	unsigned long arg	-	-	-
55	fcntl	man/ cs/	0x37	unsigned int fd	unsigned int cmd	unsigned long arg	-	-	-
56	mpx	man/ cs/	0x38	?	?	?	?	?	?
57	setpgid	man/ cs/	0x39	pid_t pid	pid_t pgid	-	-	-	-
58	ulimit	man/ cs/	0x3a	?	?	?	?	?	?
59	oldolduname	man/ cs/	0x3b	?	?	?	?	?	?
60	umask	man/ cs/	0x3c	int mask	-	-	-	-	-
61	chroot	man/ cs/	0x3d	const char *filename	-	-	-	-	-
62	ustat	man/ cs/	0x3e	unsigned dev	struct ustat *ubuf	-	-	-	-
63	dup2	man/ cs/	0x3f	unsigned int oldfd	unsigned int newfd	-	-	-	-
64	getppid	man/ cs/	0x40	-	-	-	-	-	-
65	getpgrp	man/ cs/	0x41	-	-	-	-	-	-
66	setsid	man/ cs/	0x42	-	-	-	-	-	-
67	sigaction	man/ cs/	0x43	int	const struct old_sigaction *	struct old_sigaction *	-	-	-
68	sgetmask	man/ cs/	0x44	-	-	-	-	-	-
69	ssetmask	man/ cs/	0x45	int newmask	-	-	-	-	-
70	setreuid	man/ cs/	0x46	uid_t ruid	uid_t euid	-	-	-	-
71	setregid	man/ cs/	0x47	gid_t rgid	gid_t egid	-	-	-	-
72	sigsuspend	man/ cs/	0x48	int unused1	int unused2	old_sigset_t mask	-	-	-
73	sigpending	man/ cs/	0x49	old_sigset_t *uset	-	-	-	-	-
74	sethostname	man/ cs/	0x4a	char *name	int len	-	-	-	-
75	setrlimit	man/ cs/	0x4b	unsigned int resource	struct rlimit *rlim	-	-	-	-
76	getrlimit	man/ cs/	0x4c	unsigned int resource	struct rlimit *rlim	-	-	-	-
77	getrusage	man/ cs/	0x4d	int who	struct rusage *ru	-	-	-	-
78	gettimeofday	man/ cs/	0x4e	struct __kernel_old_timeval *tv	struct timezone *tz	-	-	-	-
79	settimeofday	man/ cs/	0x4f	struct __kernel_old_timeval *tv	struct timezone *tz	-	-	-	-
80	getgroups	man/ cs/	0x50	int gidsetsize	gid_t *grouplist	-	-	-	-
81	setgroups	man/ cs/	0x51	int gidsetsize	gid_t *grouplist	-	-	-	-
82	select	man/ cs/	0x52	int n	fd_set *inp	fd_set *outp	fd_set *exp	struct __kernel_old_timeval *tvp	-
83	symlink	man/ cs/	0x53	const char *old	const char *new	-	-	-	-
84	oldlstat	man/ cs/	0x54	?	?	?	?	?	?
85	readlink	man/ cs/	0x55	const char *path	char *buf	int bufsiz	-	-	-
86	uselib	man/ cs/	0x56	const char *library	-	-	-	-	-
87	swapon	man/ cs/	0x57	const char *specialfile	int swap_flags	-	-	-	-
88	reboot	man/ cs/	0x58	int magic1	int magic2	unsigned int cmd	void *arg	-	-
89	readdir	man/ cs/	0x59	?	?	?	?	?	?
90	mmap	man/ cs/	0x5a	?	?	?	?	?	?
91	munmap	man/ cs/	0x5b	unsigned long addr	size_t len	-	-	-	-
92	truncate	man/ cs/	0x5c	const char *path	long length	-	-	-	-
93	ftruncate	man/ cs/	0x5d	unsigned int fd	unsigned long length	-	-	-	-
94	fchmod	man/ cs/	0x5e	unsigned int fd	umode_t mode	-	-	-	-
95	fchown	man/ cs/	0x5f	unsigned int fd	uid_t user	gid_t group	-	-	-
96	getpriority	man/ cs/	0x60	int which	int who	-	-	-	-
97	setpriority	man/ cs/	0x61	int which	int who	int niceval	-	-	-
98	profil	man/ cs/	0x62	?	?	?	?	?	?
99	statfs	man/ cs/	0x63	const char * path	struct statfs *buf	-	-	-	-
100	fstatfs	man/ cs/	0x64	unsigned int fd	struct statfs *buf	-	-	-	-
101	ioperm	man/ cs/	0x65	unsigned long from	unsigned long num	int on	-	-	-
102	socketcall	man/ cs/	0x66	int call	unsigned long *args	-	-	-	-
103	syslog	man/ cs/	0x67	int type	char *buf	int len	-	-	-
104	setitimer	man/ cs/	0x68	int which	struct __kernel_old_itimerval *value	struct __kernel_old_itimerval *ovalue	-	-	-
105	getitimer	man/ cs/	0x69	int which	struct __kernel_old_itimerval *value	-	-	-	-
106	stat	man/ cs/	0x6a	const char *filename	struct __old_kernel_stat *statbuf	-	-	-	-
107	lstat	man/ cs/	0x6b	const char *filename	struct __old_kernel_stat *statbuf	-	-	-	-
108	fstat	man/ cs/	0x6c	unsigned int fd	struct __old_kernel_stat *statbuf	-	-	-	-
109	olduname	man/ cs/	0x6d	struct oldold_utsname *	-	-	-	-	-
110	iopl	man/ cs/	0x6e	?	?	?	?	?	?
111	vhangup	man/ cs/	0x6f	-	-	-	-	-	-
112	idle	man/ cs/	0x70	?	?	?	?	?	?
113	vm86old	man/ cs/	0x71	?	?	?	?	?	?
114	wait4	man/ cs/	0x72	pid_t pid	int *stat_addr	int options	struct rusage *ru	-	-
115	swapoff	man/ cs/	0x73	const char *specialfile	-	-	-	-	-
116	sysinfo	man/ cs/	0x74	struct sysinfo *info	-	-	-	-	-
117	ipc	man/ cs/	0x75	unsigned int call	int first	unsigned long second	unsigned long third	void *ptr	long fifth
118	fsync	man/ cs/	0x76	unsigned int fd	-	-	-	-	-
119	sigreturn	man/ cs/	0x77	?	?	?	?	?	?
120	clone	man/ cs/	0x78	unsigned long	unsigned long	int *	int *	unsigned long	-
121	setdomainname	man/ cs/	0x79	char *name	int len	-	-	-	-
122	uname	man/ cs/	0x7a	struct old_utsname *	-	-	-	-	-
123	modify_ldt	man/ cs/	0x7b	?	?	?	?	?	?
124	adjtimex	man/ cs/	0x7c	struct __kernel_timex *txc_p	-	-	-	-	-
125	mprotect	man/ cs/	0x7d	unsigned long start	size_t len	unsigned long prot	-	-	-
126	sigprocmask	man/ cs/	0x7e	int how	old_sigset_t *set	old_sigset_t *oset	-	-	-
127	create_module	man/ cs/	0x7f	?	?	?	?	?	?
128	init_module	man/ cs/	0x80	void *umod	unsigned long len	const char *uargs	-	-	-
129	delete_module	man/ cs/	0x81	const char *name_user	unsigned int flags	-	-	-	-
130	get_kernel_syms	man/ cs/	0x82	?	?	?	?	?	?
131	quotactl	man/ cs/	0x83	unsigned int cmd	const char *special	qid_t id	void *addr	-	-
132	getpgid	man/ cs/	0x84	pid_t pid	-	-	-	-	-
133	fchdir	man/ cs/	0x85	unsigned int fd	-	-	-	-	-
134	bdflush	man/ cs/	0x86	?	?	?	?	?	?
135	sysfs	man/ cs/	0x87	int option	unsigned long arg1	unsigned long arg2	-	-	-
136	personality	man/ cs/	0x88	unsigned int personality	-	-	-	-	-
137	afs_syscall	man/ cs/	0x89	?	?	?	?	?	?
138	setfsuid	man/ cs/	0x8a	uid_t uid	-	-	-	-	-
139	setfsgid	man/ cs/	0x8b	gid_t gid	-	-	-	-	-
140	_llseek	man/ cs/	0x8c	?	?	?	?	?	?
141	getdents	man/ cs/	0x8d	unsigned int fd	struct linux_dirent *dirent	unsigned int count	-	-	-
142	_newselect	man/ cs/	0x8e	?	?	?	?	?	?
143	flock	man/ cs/	0x8f	unsigned int fd	unsigned int cmd	-	-	-	-
144	msync	man/ cs/	0x90	unsigned long start	size_t len	int flags	-	-	-
145	readv	man/ cs/	0x91	unsigned long fd	const struct iovec *vec	unsigned long vlen	-	-	-
146	writev	man/ cs/	0x92	unsigned long fd	const struct iovec *vec	unsigned long vlen	-	-	-
147	getsid	man/ cs/	0x93	pid_t pid	-	-	-	-	-
148	fdatasync	man/ cs/	0x94	unsigned int fd	-	-	-	-	-
149	_sysctl	man/ cs/	0x95	?	?	?	?	?	?
150	mlock	man/ cs/	0x96	unsigned long start	size_t len	-	-	-	-
151	munlock	man/ cs/	0x97	unsigned long start	size_t len	-	-	-	-
152	mlockall	man/ cs/	0x98	int flags	-	-	-	-	-
153	munlockall	man/ cs/	0x99	-	-	-	-	-	-
154	sched_setparam	man/ cs/	0x9a	pid_t pid	struct sched_param *param	-	-	-	-
155	sched_getparam	man/ cs/	0x9b	pid_t pid	struct sched_param *param	-	-	-	-
156	sched_setscheduler	man/ cs/	0x9c	pid_t pid	int policy	struct sched_param *param	-	-	-
157	sched_getscheduler	man/ cs/	0x9d	pid_t pid	-	-	-	-	-
158	sched_yield	man/ cs/	0x9e	-	-	-	-	-	-
159	sched_get_priority_max	man/ cs/	0x9f	int policy	-	-	-	-	-
160	sched_get_priority_min	man/ cs/	0xa0	int policy	-	-	-	-	-
161	sched_rr_get_interval	man/ cs/	0xa1	pid_t pid	struct __kernel_timespec *interval	-	-	-	-
162	nanosleep	man/ cs/	0xa2	struct __kernel_timespec *rqtp	struct __kernel_timespec *rmtp	-	-	-	-
163	mremap	man/ cs/	0xa3	unsigned long addr	unsigned long old_len	unsigned long new_len	unsigned long flags	unsigned long new_addr	-
164	setresuid	man/ cs/	0xa4	uid_t ruid	uid_t euid	uid_t suid	-	-	-
165	getresuid	man/ cs/	0xa5	uid_t *ruid	uid_t *euid	uid_t *suid	-	-	-
166	vm86	man/ cs/	0xa6	?	?	?	?	?	?
167	query_module	man/ cs/	0xa7	?	?	?	?	?	?
168	poll	man/ cs/	0xa8	struct pollfd *ufds	unsigned int nfds	int timeout	-	-	-
169	nfsservctl	man/ cs/	0xa9	?	?	?	?	?	?
170	setresgid	man/ cs/	0xaa	gid_t rgid	gid_t egid	gid_t sgid	-	-	-
171	getresgid	man/ cs/	0xab	gid_t *rgid	gid_t *egid	gid_t *sgid	-	-	-
172	prctl	man/ cs/	0xac	int option	unsigned long arg2	unsigned long arg3	unsigned long arg4	unsigned long arg5	-
173	rt_sigreturn	man/ cs/	0xad	?	?	?	?	?	?
174	rt_sigaction	man/ cs/	0xae	int	const struct sigaction *	struct sigaction *	size_t	-	-
175	rt_sigprocmask	man/ cs/	0xaf	int how	sigset_t *set	sigset_t *oset	size_t sigsetsize	-	-
176	rt_sigpending	man/ cs/	0xb0	sigset_t *set	size_t sigsetsize	-	-	-	-
177	rt_sigtimedwait	man/ cs/	0xb1	const sigset_t *uthese	siginfo_t *uinfo	const struct __kernel_timespec *uts	size_t sigsetsize	-	-
178	rt_sigqueueinfo	man/ cs/	0xb2	pid_t pid	int sig	siginfo_t *uinfo	-	-	-
179	rt_sigsuspend	man/ cs/	0xb3	sigset_t *unewset	size_t sigsetsize	-	-	-	-
180	pread64	man/ cs/	0xb4	unsigned int fd	char *buf	size_t count	loff_t pos	-	-
181	pwrite64	man/ cs/	0xb5	unsigned int fd	const char *buf	size_t count	loff_t pos	-	-
182	chown	man/ cs/	0xb6	const char *filename	uid_t user	gid_t group	-	-	-
183	getcwd	man/ cs/	0xb7	char *buf	unsigned long size	-	-	-	-
184	capget	man/ cs/	0xb8	cap_user_header_t header	cap_user_data_t dataptr	-	-	-	-
185	capset	man/ cs/	0xb9	cap_user_header_t header	const cap_user_data_t data	-	-	-	-
186	sigaltstack	man/ cs/	0xba	const struct sigaltstack *uss	struct sigaltstack *uoss	-	-	-	-
187	sendfile	man/ cs/	0xbb	int out_fd	int in_fd	off_t *offset	size_t count	-	-
188	getpmsg	man/ cs/	0xbc	?	?	?	?	?	?
189	putpmsg	man/ cs/	0xbd	?	?	?	?	?	?
190	vfork	man/ cs/	0xbe	-	-	-	-	-	-
191	ugetrlimit	man/ cs/	0xbf	?	?	?	?	?	?
192	mmap2	man/ cs/	0xc0	?	?	?	?	?	?
193	truncate64	man/ cs/	0xc1	const char *path	loff_t length	-	-	-	-
194	ftruncate64	man/ cs/	0xc2	unsigned int fd	loff_t length	-	-	-	-
195	stat64	man/ cs/	0xc3	const char *filename	struct stat64 *statbuf	-	-	-	-
196	lstat64	man/ cs/	0xc4	const char *filename	struct stat64 *statbuf	-	-	-	-
197	fstat64	man/ cs/	0xc5	unsigned long fd	struct stat64 *statbuf	-	-	-	-
198	lchown32	man/ cs/	0xc6	?	?	?	?	?	?
199	getuid32	man/ cs/	0xc7	?	?	?	?	?	?
200	getgid32	man/ cs/	0xc8	?	?	?	?	?	?
201	geteuid32	man/ cs/	0xc9	?	?	?	?	?	?
202	getegid32	man/ cs/	0xca	?	?	?	?	?	?
203	setreuid32	man/ cs/	0xcb	?	?	?	?	?	?
204	setregid32	man/ cs/	0xcc	?	?	?	?	?	?
205	getgroups32	man/ cs/	0xcd	?	?	?	?	?	?
206	setgroups32	man/ cs/	0xce	?	?	?	?	?	?
207	fchown32	man/ cs/	0xcf	?	?	?	?	?	?
208	setresuid32	man/ cs/	0xd0	?	?	?	?	?	?
209	getresuid32	man/ cs/	0xd1	?	?	?	?	?	?
210	setresgid32	man/ cs/	0xd2	?	?	?	?	?	?
211	getresgid32	man/ cs/	0xd3	?	?	?	?	?	?
212	chown32	man/ cs/	0xd4	?	?	?	?	?	?
213	setuid32	man/ cs/	0xd5	?	?	?	?	?	?
214	setgid32	man/ cs/	0xd6	?	?	?	?	?	?
215	setfsuid32	man/ cs/	0xd7	?	?	?	?	?	?
216	setfsgid32	man/ cs/	0xd8	?	?	?	?	?	?
217	pivot_root	man/ cs/	0xd9	const char *new_root	const char *put_old	-	-	-	-
218	mincore	man/ cs/	0xda	unsigned long start	size_t len	unsigned char * vec	-	-	-
219	madvise	man/ cs/	0xdb	unsigned long start	size_t len	int behavior	-	-	-
220	getdents64	man/ cs/	0xdc	unsigned int fd	struct linux_dirent64 *dirent	unsigned int count	-	-	-
221	fcntl64	man/ cs/	0xdd	unsigned int fd	unsigned int cmd	unsigned long arg	-	-	-
222	not implemented		0xde						
223	not implemented		0xdf						
224	gettid	man/ cs/	0xe0	-	-	-	-	-	-
225	readahead	man/ cs/	0xe1	int fd	loff_t offset	size_t count	-	-	-
226	setxattr	man/ cs/	0xe2	const char *path	const char *name	const void *value	size_t size	int flags	-
227	lsetxattr	man/ cs/	0xe3	const char *path	const char *name	const void *value	size_t size	int flags	-
228	fsetxattr	man/ cs/	0xe4	int fd	const char *name	const void *value	size_t size	int flags	-
229	getxattr	man/ cs/	0xe5	const char *path	const char *name	void *value	size_t size	-	-
230	lgetxattr	man/ cs/	0xe6	const char *path	const char *name	void *value	size_t size	-	-
231	fgetxattr	man/ cs/	0xe7	int fd	const char *name	void *value	size_t size	-	-
232	listxattr	man/ cs/	0xe8	const char *path	char *list	size_t size	-	-	-
233	llistxattr	man/ cs/	0xe9	const char *path	char *list	size_t size	-	-	-
234	flistxattr	man/ cs/	0xea	int fd	char *list	size_t size	-	-	-
235	removexattr	man/ cs/	0xeb	const char *path	const char *name	-	-	-	-
236	lremovexattr	man/ cs/	0xec	const char *path	const char *name	-	-	-	-
237	fremovexattr	man/ cs/	0xed	int fd	const char *name	-	-	-	-
238	tkill	man/ cs/	0xee	pid_t pid	int sig	-	-	-	-
239	sendfile64	man/ cs/	0xef	int out_fd	int in_fd	loff_t *offset	size_t count	-	-
240	futex	man/ cs/	0xf0	u32 *uaddr	int op	u32 val	const struct __kernel_timespec *utime	u32 *uaddr2	u32 val3
241	sched_setaffinity	man/ cs/	0xf1	pid_t pid	unsigned int len	unsigned long *user_mask_ptr	-	-	-
242	sched_getaffinity	man/ cs/	0xf2	pid_t pid	unsigned int len	unsigned long *user_mask_ptr	-	-	-
243	set_thread_area	man/ cs/	0xf3	?	?	?	?	?	?
244	get_thread_area	man/ cs/	0xf4	?	?	?	?	?	?
245	io_setup	man/ cs/	0xf5	unsigned nr_reqs	aio_context_t *ctx	-	-	-	-
246	io_destroy	man/ cs/	0xf6	aio_context_t ctx	-	-	-	-	-
247	io_getevents	man/ cs/	0xf7	aio_context_t ctx_id	long min_nr	long nr	struct io_event *events	struct __kernel_timespec *timeout	-
248	io_submit	man/ cs/	0xf8	aio_context_t	long	struct iocb * *	-	-	-
249	io_cancel	man/ cs/	0xf9	aio_context_t ctx_id	struct iocb *iocb	struct io_event *result	-	-	-
250	fadvise64	man/ cs/	0xfa	int fd	loff_t offset	size_t len	int advice	-	-
251	not implemented		0xfb						
252	exit_group	man/ cs/	0xfc	int error_code	-	-	-	-	-
253	lookup_dcookie	man/ cs/	0xfd	u64 cookie64	char *buf	size_t len	-	-	-
254	epoll_create	man/ cs/	0xfe	int size	-	-	-	-	-
255	epoll_ctl	man/ cs/	0xff	int epfd	int op	int fd	struct epoll_event *event	-	-
256	epoll_wait	man/ cs/	0x100	int epfd	struct epoll_event *events	int maxevents	int timeout	-	-
257	remap_file_pages	man/ cs/	0x101	unsigned long start	unsigned long size	unsigned long prot	unsigned long pgoff	unsigned long flags	-
258	set_tid_address	man/ cs/	0x102	int *tidptr	-	-	-	-	-
259	timer_create	man/ cs/	0x103	clockid_t which_clock	struct sigevent *timer_event_spec	timer_t * created_timer_id	-	-	-
260	timer_settime	man/ cs/	0x104	timer_t timer_id	int flags	const struct __kernel_itimerspec *new_setting	struct __kernel_itimerspec *old_setting	-	-
261	timer_gettime	man/ cs/	0x105	timer_t timer_id	struct __kernel_itimerspec *setting	-	-	-	-
262	timer_getoverrun	man/ cs/	0x106	timer_t timer_id	-	-	-	-	-
263	timer_delete	man/ cs/	0x107	timer_t timer_id	-	-	-	-	-
264	clock_settime	man/ cs/	0x108	clockid_t which_clock	const struct __kernel_timespec *tp	-	-	-	-
265	clock_gettime	man/ cs/	0x109	clockid_t which_clock	struct __kernel_timespec *tp	-	-	-	-
266	clock_getres	man/ cs/	0x10a	clockid_t which_clock	struct __kernel_timespec *tp	-	-	-	-
267	clock_nanosleep	man/ cs/	0x10b	clockid_t which_clock	int flags	const struct __kernel_timespec *rqtp	struct __kernel_timespec *rmtp	-	-
268	statfs64	man/ cs/	0x10c	const char *path	size_t sz	struct statfs64 *buf	-	-	-
269	fstatfs64	man/ cs/	0x10d	unsigned int fd	size_t sz	struct statfs64 *buf	-	-	-
270	tgkill	man/ cs/	0x10e	pid_t tgid	pid_t pid	int sig	-	-	-
271	utimes	man/ cs/	0x10f	char *filename	struct __kernel_old_timeval *utimes	-	-	-	-
272	fadvise64_64	man/ cs/	0x110	int fd	loff_t offset	loff_t len	int advice	-	-
273	vserver	man/ cs/	0x111	?	?	?	?	?	?
274	mbind	man/ cs/	0x112	unsigned long start	unsigned long len	unsigned long mode	const unsigned long *nmask	unsigned long maxnode	unsigned flags
275	get_mempolicy	man/ cs/	0x113	int *policy	unsigned long *nmask	unsigned long maxnode	unsigned long addr	unsigned long flags	-
276	set_mempolicy	man/ cs/	0x114	int mode	const unsigned long *nmask	unsigned long maxnode	-	-	-
277	mq_open	man/ cs/	0x115	const char *name	int oflag	umode_t mode	struct mq_attr *attr	-	-
278	mq_unlink	man/ cs/	0x116	const char *name	-	-	-	-	-
279	mq_timedsend	man/ cs/	0x117	mqd_t mqdes	const char *msg_ptr	size_t msg_len	unsigned int msg_prio	const struct __kernel_timespec *abs_timeout	-
280	mq_timedreceive	man/ cs/	0x118	mqd_t mqdes	char *msg_ptr	size_t msg_len	unsigned int *msg_prio	const struct __kernel_timespec *abs_timeout	-
281	mq_notify	man/ cs/	0x119	mqd_t mqdes	const struct sigevent *notification	-	-	-	-
282	mq_getsetattr	man/ cs/	0x11a	mqd_t mqdes	const struct mq_attr *mqstat	struct mq_attr *omqstat	-	-	-
283	kexec_load	man/ cs/	0x11b	unsigned long entry	unsigned long nr_segments	struct kexec_segment *segments	unsigned long flags	-	-
284	waitid	man/ cs/	0x11c	int which	pid_t pid	struct siginfo *infop	int options	struct rusage *ru	-
285	not implemented		0x11d						
286	add_key	man/ cs/	0x11e	const char *_type	const char *_description	const void *_payload	size_t plen	key_serial_t destringid	-
287	request_key	man/ cs/	0x11f	const char *_type	const char *_description	const char *_callout_info	key_serial_t destringid	-	-
288	keyctl	man/ cs/	0x120	int cmd	unsigned long arg2	unsigned long arg3	unsigned long arg4	unsigned long arg5	-
289	ioprio_set	man/ cs/	0x121	int which	int who	int ioprio	-	-	-
290	ioprio_get	man/ cs/	0x122	int which	int who	-	-	-	-
291	inotify_init	man/ cs/	0x123	-	-	-	-	-	-
292	inotify_add_watch	man/ cs/	0x124	int fd	const char *path	u32 mask	-	-	-
293	inotify_rm_watch	man/ cs/	0x125	int fd	__s32 wd	-	-	-	-
294	migrate_pages	man/ cs/	0x126	pid_t pid	unsigned long maxnode	const unsigned long *from	const unsigned long *to	-	-
295	openat	man/ cs/	0x127	int dfd	const char *filename	int flags	umode_t mode	-	-
296	mkdirat	man/ cs/	0x128	int dfd	const char * pathname	umode_t mode	-	-	-
297	mknodat	man/ cs/	0x129	int dfd	const char * filename	umode_t mode	unsigned dev	-	-
298	fchownat	man/ cs/	0x12a	int dfd	const char *filename	uid_t user	gid_t group	int flag	-
299	futimesat	man/ cs/	0x12b	int dfd	const char *filename	struct __kernel_old_timeval *utimes	-	-	-
300	fstatat64	man/ cs/	0x12c	int dfd	const char *filename	struct stat64 *statbuf	int flag	-	-
301	unlinkat	man/ cs/	0x12d	int dfd	const char * pathname	int flag	-	-	-
302	renameat	man/ cs/	0x12e	int olddfd	const char * oldname	int newdfd	const char * newname	-	-
303	linkat	man/ cs/	0x12f	int olddfd	const char *oldname	int newdfd	const char *newname	int flags	-
304	symlinkat	man/ cs/	0x130	const char * oldname	int newdfd	const char * newname	-	-	-
305	readlinkat	man/ cs/	0x131	int dfd	const char *path	char *buf	int bufsiz	-	-
306	fchmodat	man/ cs/	0x132	int dfd	const char * filename	umode_t mode	-	-	-
307	faccessat	man/ cs/	0x133	int dfd	const char *filename	int mode	-	-	-
308	pselect6	man/ cs/	0x134	int	fd_set *	fd_set *	fd_set *	struct __kernel_timespec *	void *
309	ppoll	man/ cs/	0x135	struct pollfd *	unsigned int	struct __kernel_timespec *	const sigset_t *	size_t	-
310	unshare	man/ cs/	0x136	unsigned long unshare_flags	-	-	-	-	-
311	set_robust_list	man/ cs/	0x137	struct robust_list_head *head	size_t len	-	-	-	-
312	get_robust_list	man/ cs/	0x138	int pid	struct robust_list_head * *head_ptr	size_t *len_ptr	-	-	-
313	splice	man/ cs/	0x139	int fd_in	loff_t *off_in	int fd_out	loff_t *off_out	size_t len	unsigned int flags
314	sync_file_range	man/ cs/	0x13a	int fd	loff_t offset	loff_t nbytes	unsigned int flags	-	-
315	tee	man/ cs/	0x13b	int fdin	int fdout	size_t len	unsigned int flags	-	-
316	vmsplice	man/ cs/	0x13c	int fd	const struct iovec *iov	unsigned long nr_segs	unsigned int flags	-	-
317	move_pages	man/ cs/	0x13d	pid_t pid	unsigned long nr_pages	const void * *pages	const int *nodes	int *status	int flags
318	getcpu	man/ cs/	0x13e	unsigned *cpu	unsigned *node	struct getcpu_cache *cache	-	-	-
319	epoll_pwait	man/ cs/	0x13f	int epfd	struct epoll_event *events	int maxevents	int timeout	const sigset_t *sigmask	size_t sigsetsize
320	utimensat	man/ cs/	0x140	int dfd	const char *filename	struct __kernel_timespec *utimes	int flags	-	-
321	signalfd	man/ cs/	0x141	int ufd	sigset_t *user_mask	size_t sizemask	-	-	-
322	timerfd_create	man/ cs/	0x142	int clockid	int flags	-	-	-	-
323	eventfd	man/ cs/	0x143	unsigned int count	-	-	-	-	-
324	fallocate	man/ cs/	0x144	int fd	int mode	loff_t offset	loff_t len	-	-
325	timerfd_settime	man/ cs/	0x145	int ufd	int flags	const struct __kernel_itimerspec *utmr	struct __kernel_itimerspec *otmr	-	-
326	timerfd_gettime	man/ cs/	0x146	int ufd	struct __kernel_itimerspec *otmr	-	-	-	-
327	signalfd4	man/ cs/	0x147	int ufd	sigset_t *user_mask	size_t sizemask	int flags	-	-
328	eventfd2	man/ cs/	0x148	unsigned int count	int flags	-	-	-	-
329	epoll_create1	man/ cs/	0x149	int flags	-	-	-	-	-
330	dup3	man/ cs/	0x14a	unsigned int oldfd	unsigned int newfd	int flags	-	-	-
331	pipe2	man/ cs/	0x14b	int *fildes	int flags	-	-	-	-
332	inotify_init1	man/ cs/	0x14c	int flags	-	-	-	-	-
333	preadv	man/ cs/	0x14d	unsigned long fd	const struct iovec *vec	unsigned long vlen	unsigned long pos_l	unsigned long pos_h	-
334	pwritev	man/ cs/	0x14e	unsigned long fd	const struct iovec *vec	unsigned long vlen	unsigned long pos_l	unsigned long pos_h	-
335	rt_tgsigqueueinfo	man/ cs/	0x14f	pid_t tgid	pid_t pid	int sig	siginfo_t *uinfo	-	-
336	perf_event_open	man/ cs/	0x150	struct perf_event_attr *attr_uptr	pid_t pid	int cpu	int group_fd	unsigned long flags	-
337	recvmmsg	man/ cs/	0x151	int fd	struct mmsghdr *msg	unsigned int vlen	unsigned flags	struct __kernel_timespec *timeout	-
338	fanotify_init	man/ cs/	0x152	unsigned int flags	unsigned int event_f_flags	-	-	-	-
339	fanotify_mark	man/ cs/	0x153	int fanotify_fd	unsigned int flags	u64 mask	int fd	const char *pathname	-
340	prlimit64	man/ cs/	0x154	pid_t pid	unsigned int resource	const struct rlimit64 *new_rlim	struct rlimit64 *old_rlim	-	-
341	name_to_handle_at	man/ cs/	0x155	int dfd	const char *name	struct file_handle *handle	int *mnt_id	int flag	-
342	open_by_handle_at	man/ cs/	0x156	int mountdirfd	struct file_handle *handle	int flags	-	-	-
343	clock_adjtime	man/ cs/	0x157	clockid_t which_clock	struct __kernel_timex *tx	-	-	-	-
344	syncfs	man/ cs/	0x158	int fd	-	-	-	-	-
345	sendmmsg	man/ cs/	0x159	int fd	struct mmsghdr *msg	unsigned int vlen	unsigned flags	-	-
346	setns	man/ cs/	0x15a	int fd	int nstype	-	-	-	-
347	process_vm_readv	man/ cs/	0x15b	pid_t pid	const struct iovec *lvec	unsigned long liovcnt	const struct iovec *rvec	unsigned long riovcnt	unsigned long flags
348	process_vm_writev	man/ cs/	0x15c	pid_t pid	const struct iovec *lvec	unsigned long liovcnt	const struct iovec *rvec	unsigned long riovcnt	unsigned long flags
349	kcmp	man/ cs/	0x15d	pid_t pid1	pid_t pid2	int type	unsigned long idx1	unsigned long idx2	-
350	finit_module	man/ cs/	0x15e	int fd	const char *uargs	int flags	-	-	-
351	sched_setattr	man/ cs/	0x15f	pid_t pid	struct sched_attr *attr	unsigned int flags	-	-	-
352	sched_getattr	man/ cs/	0x160	pid_t pid	struct sched_attr *attr	unsigned int size	unsigned int flags	-	-
353	renameat2	man/ cs/	0x161	int olddfd	const char *oldname	int newdfd	const char *newname	unsigned int flags	-
354	seccomp	man/ cs/	0x162	unsigned int op	unsigned int flags	void *uargs	-	-	-
355	getrandom	man/ cs/	0x163	char *buf	size_t count	unsigned int flags	-	-	-
356	memfd_create	man/ cs/	0x164	const char *uname_ptr	unsigned int flags	-	-	-	-
357	bpf	man/ cs/	0x165	int cmd	union bpf_attr *attr	unsigned int size	-	-	-
358	execveat	man/ cs/	0x166	int dfd	const char *filename	const char *const *argv	const char *const *envp	int flags	-
359	socket	man/ cs/	0x167	int	int	int	-	-	-
360	socketpair	man/ cs/	0x168	int	int	int	int *	-	-
361	bind	man/ cs/	0x169	int	struct sockaddr *	int	-	-	-
362	connect	man/ cs/	0x16a	int	struct sockaddr *	int	-	-	-
363	listen	man/ cs/	0x16b	int	int	-	-	-	-
364	accept4	man/ cs/	0x16c	int	struct sockaddr *	int *	int	-	-
365	getsockopt	man/ cs/	0x16d	int fd	int level	int optname	char *optval	int *optlen	-
366	setsockopt	man/ cs/	0x16e	int fd	int level	int optname	char *optval	int optlen	-
367	getsockname	man/ cs/	0x16f	int	struct sockaddr *	int *	-	-	-
368	getpeername	man/ cs/	0x170	int	struct sockaddr *	int *	-	-	-
369	sendto	man/ cs/	0x171	int	void *	size_t	unsigned	struct sockaddr *	int
370	sendmsg	man/ cs/	0x172	int fd	struct user_msghdr *msg	unsigned flags	-	-	-
371	recvfrom	man/ cs/	0x173	int	void *	size_t	unsigned	struct sockaddr *	int *
372	recvmsg	man/ cs/	0x174	int fd	struct user_msghdr *msg	unsigned flags	-	-	-
373	shutdown	man/ cs/	0x175	int	int	-	-	-	-
374	userfaultfd	man/ cs/	0x176	int flags	-	-	-	-	-
375	membarrier	man/ cs/	0x177	int cmd	unsigned int flags	int cpu_id	-	-	-
376	mlock2	man/ cs/	0x178	unsigned long start	size_t len	int flags	-	-	-
377	copy_file_range	man/ cs/	0x179	int fd_in	loff_t *off_in	int fd_out	loff_t *off_out	size_t len	unsigned int flags
378	preadv2	man/ cs/	0x17a	unsigned long fd	const struct iovec *vec	unsigned long vlen	unsigned long pos_l	unsigned long pos_h	rwf_t flags
379	pwritev2	man/ cs/	0x17b	unsigned long fd	const struct iovec *vec	unsigned long vlen	unsigned long pos_l	unsigned long pos_h	rwf_t flags
380	pkey_mprotect	man/ cs/	0x17c	unsigned long start	size_t len	unsigned long prot	int pkey	-	-
381	pkey_alloc	man/ cs/	0x17d	unsigned long flags	unsigned long init_val	-	-	-	-
382	pkey_free	man/ cs/	0x17e	int pkey	-	-	-	-	-
383	statx	man/ cs/	0x17f	int dfd	const char *path	unsigned flags	unsigned mask	struct statx *buffer	-
384	arch_prctl	man/ cs/	0x180	?	?	?	?	?	?
385	not implemented		0x181						
386	not implemented		0x182						
387	not implemented		0x183						
388	not implemented		0x184						
389	not implemented		0x185						
390	not implemented		0x186						
391	not implemented		0x187						
392	not implemented		0x188						
393	not implemented		0x189						
394	not implemented		0x18a						
395	not implemented		0x18b						
396	not implemented		0x18c						
397	not implemented		0x18d						
398	not implemented		0x18e						
399	not implemented		0x18f						
400	not implemented		0x190						
401	not implemented		0x191						
402	not implemented		0x192						
403	clock_gettime64	man/ cs/	0x193	?	?	?	?	?	?
404	clock_settime64	man/ cs/	0x194	?	?	?	?	?	?
405	clock_adjtime64	man/ cs/	0x195	?	?	?	?	?	?
406	clock_getres_time64	man/ cs/	0x196	?	?	?	?	?	?
407	clock_nanosleep_time64	man/ cs/	0x197	?	?	?	?	?	?
408	timer_gettime64	man/ cs/	0x198	?	?	?	?	?	?
409	timer_settime64	man/ cs/	0x199	?	?	?	?	?	?
410	timerfd_gettime64	man/ cs/	0x19a	?	?	?	?	?	?
411	timerfd_settime64	man/ cs/	0x19b	?	?	?	?	?	?
412	utimensat_time64	man/ cs/	0x19c	?	?	?	?	?	?
413	pselect6_time64	man/ cs/	0x19d	?	?	?	?	?	?
414	ppoll_time64	man/ cs/	0x19e	?	?	?	?	?	?
415	not implemented		0x19f						
416	io_pgetevents_time64	man/ cs/	0x1a0	?	?	?	?	?	?
417	recvmmsg_time64	man/ cs/	0x1a1	?	?	?	?	?	?
418	mq_timedsend_time64	man/ cs/	0x1a2	?	?	?	?	?	?
419	mq_timedreceive_time64	man/ cs/	0x1a3	?	?	?	?	?	?
420	semtimedop_time64	man/ cs/	0x1a4	?	?	?	?	?	?
421	rt_sigtimedwait_time64	man/ cs/	0x1a5	?	?	?	?	?	?
422	futex_time64	man/ cs/	0x1a6	?	?	?	?	?	?
423	sched_rr_get_interval_time64	man/ cs/	0x1a7	?	?	?	?	?	?
424	not implemented		0x1a8						
425	io_uring_setup	man/ cs/	0x1a9	u32 entries	struct io_uring_params *p	-	-	-	-
426	io_uring_enter	man/ cs/	0x1aa	unsigned int fd	u32 to_submit	u32 min_complete	u32 flags	const void *argp	size_t argsz
427	not implemented		0x1ab						
428	not implemented		0x1ac						
429	not implemented		0x1ad						
430	not implemented		0x1ae						
431	not implemented		0x1af						
432	not implemented		0x1b0						
433	not implemented		0x1b1						
434	not implemented		0x1b2						
435	not implemented		0x1b3						
436	not implemented		0x1b4						
437	not implemented		0x1b5						
438	not implemented		0x1b6						
439	faccessat2	man/ cs/	0x1b7	int dfd	const char *filename	int mode	int flags	-	-
Cross-arch Numbers
This shows the syscall numbers for (hopefully) the same syscall name across architectures. Consult the Random Names section for common gotchas.

syscall name	x86_64	arm	arm64	x86
ARM_breakpoint	-	983041	-	-
ARM_cacheflush	-	983042	-	-
ARM_set_tls	-	983045	-	-
ARM_usr26	-	983043	-	-
ARM_usr32	-	983044	-	-
_llseek	-	140	-	140
_newselect	-	142	-	142
_sysctl	156	149	-	149
accept	43	285	202	-
accept4	288	366	242	364
access	21	33	-	33
acct	163	51	89	51
add_key	248	309	217	286
adjtimex	159	124	171	124
afs_syscall	183	-	-	137
alarm	37	-	-	27
arch_prctl	158	-	-	384
arm_fadvise64_64	-	270	-	-
arm_sync_file_range	-	341	-	-
bdflush	-	134	-	134
bind	49	282	200	361
bpf	321	386	280	357
break	-	-	-	17
brk	12	45	214	45
capget	125	184	90	184
capset	126	185	91	185
chdir	80	12	49	12
chmod	90	15	-	15
chown	92	182	-	182
chown32	-	212	-	212
chroot	161	61	51	61
clock_adjtime	305	372	266	343
clock_adjtime64	-	405	-	405
clock_getres	229	264	114	266
clock_getres_time64	-	406	-	406
clock_gettime	228	263	113	265
clock_gettime64	-	403	-	403
clock_nanosleep	230	265	115	267
clock_nanosleep_time64	-	407	-	407
clock_settime	227	262	112	264
clock_settime64	-	404	-	404
clone	56	120	220	120
close	3	6	57	6
connect	42	283	203	362
copy_file_range	326	391	285	377
creat	85	8	-	8
create_module	174	-	-	127
delete_module	176	129	106	129
dup	32	41	23	41
dup2	33	63	-	63
dup3	292	358	24	330
epoll_create	213	250	-	254
epoll_create1	291	357	20	329
epoll_ctl	233	251	21	255
epoll_ctl_old	214	-	-	-
epoll_pwait	281	346	22	319
epoll_wait	232	252	-	256
epoll_wait_old	215	-	-	-
eventfd	284	351	-	323
eventfd2	290	356	19	328
execve	59	11	221	11
execveat	322	387	281	358
exit	60	1	93	1
exit_group	231	248	94	252
faccessat	269	334	48	307
faccessat2	439	439	439	439
fadvise64	221	-	223	250
fadvise64_64	-	-	-	272
fallocate	285	352	47	324
fanotify_init	300	367	262	338
fanotify_mark	301	368	263	339
fchdir	81	133	50	133
fchmod	91	94	52	94
fchmodat	268	333	53	306
fchown	93	95	55	95
fchown32	-	207	-	207
fchownat	260	325	54	298
fcntl	72	55	25	55
fcntl64	-	221	-	221
fdatasync	75	148	83	148
fgetxattr	193	231	10	231
finit_module	313	379	273	350
flistxattr	196	234	13	234
flock	73	143	32	143
fork	57	2	-	2
fremovexattr	199	237	16	237
fsetxattr	190	228	7	228
fstat	5	108	80	108
fstat64	-	197	-	197
fstatat64	-	327	-	300
fstatfs	138	100	44	100
fstatfs64	-	267	-	269
fsync	74	118	82	118
ftime	-	-	-	35
ftruncate	77	93	46	93
ftruncate64	-	194	-	194
futex	202	240	98	240
futex_time64	-	422	-	422
futimesat	261	326	-	299
get_kernel_syms	177	-	-	130
get_mempolicy	239	320	236	275
get_robust_list	274	339	100	312
get_thread_area	211	-	-	244
getcpu	309	345	168	318
getcwd	79	183	17	183
getdents	78	141	-	141
getdents64	217	217	61	220
getegid	108	50	177	50
getegid32	-	202	-	202
geteuid	107	49	175	49
geteuid32	-	201	-	201
getgid	104	47	176	47
getgid32	-	200	-	200
getgroups	115	80	158	80
getgroups32	-	205	-	205
getitimer	36	105	102	105
getpeername	52	287	205	368
getpgid	121	132	155	132
getpgrp	111	65	-	65
getpid	39	20	172	20
getpmsg	181	-	-	188
getppid	110	64	173	64
getpriority	140	96	141	96
getrandom	318	384	278	355
getresgid	120	171	150	171
getresgid32	-	211	-	211
getresuid	118	165	148	165
getresuid32	-	209	-	209
getrlimit	97	-	163	76
getrusage	98	77	165	77
getsid	124	147	156	147
getsockname	51	286	204	367
getsockopt	55	295	209	365
gettid	186	224	178	224
gettimeofday	96	78	169	78
getuid	102	24	174	24
getuid32	-	199	-	199
getxattr	191	229	8	229
gtty	-	-	-	32
idle	-	-	-	112
init_module	175	128	105	128
inotify_add_watch	254	317	27	292
inotify_init	253	316	-	291
inotify_init1	294	360	26	332
inotify_rm_watch	255	318	28	293
io_cancel	210	247	3	249
io_destroy	207	244	1	246
io_getevents	208	245	4	247
io_pgetevents_time64	-	416	-	416
io_setup	206	243	0	245
io_submit	209	246	2	248
io_uring_enter	426	426	426	426
io_uring_setup	425	425	425	425
ioctl	16	54	29	54
ioperm	173	-	-	101
iopl	172	-	-	110
ioprio_get	252	315	31	290
ioprio_set	251	314	30	289
ipc	-	-	-	117
kcmp	312	378	272	349
kexec_file_load	320	-	-	-
kexec_load	246	347	104	283
keyctl	250	311	219	288
kill	62	37	129	37
lchown	94	16	-	16
lchown32	-	198	-	198
lgetxattr	192	230	9	230
link	86	9	-	9
linkat	265	330	37	303
listen	50	284	201	363
listxattr	194	232	11	232
llistxattr	195	233	12	233
lock	-	-	-	53
lookup_dcookie	212	249	18	253
lremovexattr	198	236	15	236
lseek	8	19	62	19
lsetxattr	189	227	6	227
lstat	6	107	-	107
lstat64	-	196	-	196
madvise	28	220	233	219
mbind	237	319	235	274
membarrier	324	389	283	375
memfd_create	319	385	279	356
migrate_pages	256	-	238	294
mincore	27	219	232	218
mkdir	83	39	-	39
mkdirat	258	323	34	296
mknod	133	14	-	14
mknodat	259	324	33	297
mlock	149	150	228	150
mlock2	325	390	284	376
mlockall	151	152	230	152
mmap	9	-	222	90
mmap2	-	192	-	192
modify_ldt	154	-	-	123
mount	165	21	40	21
move_pages	279	344	239	317
mprotect	10	125	226	125
mpx	-	-	-	56
mq_getsetattr	245	279	185	282
mq_notify	244	278	184	281
mq_open	240	274	180	277
mq_timedreceive	243	277	183	280
mq_timedreceive_time64	-	419	-	419
mq_timedsend	242	276	182	279
mq_timedsend_time64	-	418	-	418
mq_unlink	241	275	181	278
mremap	25	163	216	163
msgctl	71	304	187	-
msgget	68	303	186	-
msgrcv	70	302	188	-
msgsnd	69	301	189	-
msync	26	144	227	144
munlock	150	151	229	151
munlockall	152	153	231	153
munmap	11	91	215	91
name_to_handle_at	303	370	264	341
nanosleep	35	162	101	162
newfstatat	262	-	79	-
nfsservctl	180	169	42	169
nice	-	34	-	34
oldfstat	-	-	-	28
oldlstat	-	-	-	84
oldolduname	-	-	-	59
oldstat	-	-	-	18
olduname	-	-	-	109
open	2	5	-	5
open_by_handle_at	304	371	265	342
openat	257	322	56	295
pause	34	29	-	29
pciconfig_iobase	-	271	-	-
pciconfig_read	-	272	-	-
pciconfig_write	-	273	-	-
perf_event_open	298	364	241	336
personality	135	136	92	136
pipe	22	42	-	42
pipe2	293	359	59	331
pivot_root	155	218	41	217
pkey_alloc	330	395	289	381
pkey_free	331	396	290	382
pkey_mprotect	329	394	288	380
poll	7	168	-	168
ppoll	271	336	73	309
ppoll_time64	-	414	-	414
prctl	157	172	167	172
pread64	17	180	67	180
preadv	295	361	69	333
preadv2	327	392	286	378
prlimit64	302	369	261	340
process_vm_readv	310	376	270	347
process_vm_writev	311	377	271	348
prof	-	-	-	44
profil	-	-	-	98
pselect6	270	335	72	308
pselect6_time64	-	413	-	413
ptrace	101	26	117	26
putpmsg	182	-	-	189
pwrite64	18	181	68	181
pwritev	296	362	70	334
pwritev2	328	393	287	379
query_module	178	-	-	167
quotactl	179	131	60	131
read	0	3	63	3
readahead	187	225	213	225
readdir	-	-	-	89
readlink	89	85	-	85
readlinkat	267	332	78	305
readv	19	145	65	145
reboot	169	88	142	88
recv	-	291	-	-
recvfrom	45	292	207	371
recvmmsg	299	365	243	337
recvmmsg_time64	-	417	-	417
recvmsg	47	297	212	372
remap_file_pages	216	253	234	257
removexattr	197	235	14	235
rename	82	38	-	38
renameat	264	329	38	302
renameat2	316	382	276	353
request_key	249	310	218	287
restart_syscall	219	0	128	0
rmdir	84	40	-	40
rt_sigaction	13	174	134	174
rt_sigpending	127	176	136	176
rt_sigprocmask	14	175	135	175
rt_sigqueueinfo	129	178	138	178
rt_sigreturn	15	173	139	173
rt_sigsuspend	130	179	133	179
rt_sigtimedwait	128	177	137	177
rt_sigtimedwait_time64	-	421	-	421
rt_tgsigqueueinfo	297	363	240	335
sched_get_priority_max	146	159	125	159
sched_get_priority_min	147	160	126	160
sched_getaffinity	204	242	123	242
sched_getattr	315	381	275	352
sched_getparam	143	155	121	155
sched_getscheduler	145	157	120	157
sched_rr_get_interval	148	161	127	161
sched_rr_get_interval_time64	-	423	-	423
sched_setaffinity	203	241	122	241
sched_setattr	314	380	274	351
sched_setparam	142	154	118	154
sched_setscheduler	144	156	119	156
sched_yield	24	158	124	158
seccomp	317	383	277	354
security	185	-	-	-
select	23	-	-	82
semctl	66	300	191	-
semget	64	299	190	-
semop	65	298	193	-
semtimedop	220	312	192	-
semtimedop_time64	-	420	-	420
send	-	289	-	-
sendfile	40	187	71	187
sendfile64	-	239	-	239
sendmmsg	307	374	269	345
sendmsg	46	296	211	370
sendto	44	290	206	369
set_mempolicy	238	321	237	276
set_robust_list	273	338	99	311
set_thread_area	205	-	-	243
set_tid_address	218	256	96	258
setdomainname	171	121	162	121
setfsgid	123	139	152	139
setfsgid32	-	216	-	216
setfsuid	122	138	151	138
setfsuid32	-	215	-	215
setgid	106	46	144	46
setgid32	-	214	-	214
setgroups	116	81	159	81
setgroups32	-	206	-	206
sethostname	170	74	161	74
setitimer	38	104	103	104
setns	308	375	268	346
setpgid	109	57	154	57
setpriority	141	97	140	97
setregid	114	71	143	71
setregid32	-	204	-	204
setresgid	119	170	149	170
setresgid32	-	210	-	210
setresuid	117	164	147	164
setresuid32	-	208	-	208
setreuid	113	70	145	70
setreuid32	-	203	-	203
setrlimit	160	75	164	75
setsid	112	66	157	66
setsockopt	54	294	208	366
settimeofday	164	79	170	79
setuid	105	23	146	23
setuid32	-	213	-	213
setxattr	188	226	5	226
sgetmask	-	-	-	68
shmat	30	305	196	-
shmctl	31	308	195	-
shmdt	67	306	197	-
shmget	29	307	194	-
shutdown	48	293	210	373
sigaction	-	67	-	67
sigaltstack	131	186	132	186
signal	-	-	-	48
signalfd	282	349	-	321
signalfd4	289	355	74	327
sigpending	-	73	-	73
sigprocmask	-	126	-	126
sigreturn	-	119	-	119
sigsuspend	-	72	-	72
socket	41	281	198	359
socketcall	-	-	-	102
socketpair	53	288	199	360
splice	275	340	76	313
ssetmask	-	-	-	69
stat	4	106	-	106
stat64	-	195	-	195
statfs	137	99	43	99
statfs64	-	266	-	268
statx	332	397	291	383
stime	-	-	-	25
stty	-	-	-	31
swapoff	168	115	225	115
swapon	167	87	224	87
symlink	88	83	-	83
symlinkat	266	331	36	304
sync	162	36	81	36
sync_file_range	277	-	84	314
sync_file_range2	-	341	-	-
syncfs	306	373	267	344
sysfs	139	135	-	135
sysinfo	99	116	179	116
syslog	103	103	116	103
tee	276	342	77	315
tgkill	234	268	131	270
time	201	-	-	13
timer_create	222	257	107	259
timer_delete	226	261	111	263
timer_getoverrun	225	260	109	262
timer_gettime	224	259	108	261
timer_gettime64	-	408	-	408
timer_settime	223	258	110	260
timer_settime64	-	409	-	409
timerfd_create	283	350	85	322
timerfd_gettime	287	354	87	326
timerfd_gettime64	-	410	-	410
timerfd_settime	286	353	86	325
timerfd_settime64	-	411	-	411
times	100	43	153	43
tkill	200	238	130	238
truncate	76	92	45	92
truncate64	-	193	-	193
tuxcall	184	-	-	-
ugetrlimit	-	191	-	191
ulimit	-	-	-	58
umask	95	60	166	60
umount	-	-	-	22
umount2	166	52	39	52
uname	63	122	160	122
unlink	87	10	-	10
unlinkat	263	328	35	301
unshare	272	337	97	310
uselib	134	86	-	86
userfaultfd	323	388	282	374
ustat	136	62	-	62
utime	132	-	-	30
utimensat	280	348	88	320
utimensat_time64	-	412	-	412
utimes	235	269	-	271
vfork	58	190	-	190
vhangup	153	111	58	111
vm86	-	-	-	166
vm86old	-	-	-	113
vmsplice	278	343	75	316
vserver	236	313	-	273
wait4	61	114	260	114
waitid	247	280	95	284
waitpid	-	-	-	7
write	1	4	64	4
writev	20	146	66	146



## Reference

https://0xax.gitbooks.io/linux-insides/content/SysCall/

https://blog.packagecloud.io/eng/2016/04/05/the-definitive-guide-to-linux-system-calls/

http://www.ibm.com/developerworks/cn/linux/kernel/l-k26ncpu/index.html

https://lwn.net/Articles/604287/

https://lwn.net/Articles/604515/

https://syscalls.w3challs.com/

https://www.cs.fsu.edu/~langley/CNT5605/2017-Summer/assembly-example/assembly.html

https://filippo.io/linux-syscall-table/