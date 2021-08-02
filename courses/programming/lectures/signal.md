# SIGNAL 信号

## 概念

Linux SIGNAL 其实就是一个软件中断。例如按下 ctrl+c 就是发了一个硬件中断，终端驱动程序将其解释为一个SIGINT信号，记在当前进程PCB中（即将一个SIGINT信号传给该进程）。

## 信号的种类

使用`kill -l` 可以查看信号类型。

- 非可靠信号：1-31号信号，信号可能丢失；
- 可靠信号：34-64号信号，信号不可能丢失。


- SIGHUP：1号信号，Hangup detected on controlling terminal or death of controlling process（在控制终端上挂起信号，或让进程结束），ation：term
- SIGINT：2号信号，Interrupt from keyboard（键盘输入中断，ctrl + c ），action：term
- SIGQUIT：3号信号，Quit from keyboard（键盘输入退出，ctrl+ | ），action：core，产生core dump文件
- SIGABRT：6号信号，Abort signal from abort(3)（非正常终止，double free），action：core
- SIGKILL：9号信号，Kill signal（杀死进程信号），action：term，该信号不能被阻塞、忽略、自定义处理
- SIGSEGV：11号信号，Invalid memory reference（无效的内存引用，解引用空指针、内存越界访问），action：core
- SIGPIPE：13号信号，Broken pipe: write to pipe with no readers（管道中止: 写入无人读取的管道，会导致管道破裂），action：term
- SIGCHLD：17号信号，Child stopped or terminated（子进程发送给父进程的信号，但该信号为忽略处理的）
- SIGSTOP：19号信号，Stop process（停止进程），action：stop
- SIGTSTP：20号信号，Stop typed at terminal（终端上发出的停止信号，ctrl + z），action：stop

具体的信号采取的动作和详细信息可查看：man 7 signal

## 信号的产生

### 硬件产生

例如：键盘上输出 ctrl+c ctrl+z ctrl+|

### 软件产生

#### kill函数
```c
#include <sys/types.h>
#include <signal.h>
int kill(pid_t pid, int sig);
```

参数解释：
- pid：进程号
- sig：要发送的信号值
- 返回值：成功返回0，失败返回-1，并设置错误

#### kill命令
`kill -[信号] pid `

#### abort
```c
void abort(void); /*收到6号信号，谁调用该函数，谁就收到6号信号SIGABRT*/
```

#### alarm
```c
/*告诉内核在seconds秒内给进程发送 14号 SIGALRM信号，该信号默认处理动作为终止当前进程。*/
unsigned int alarm(unsigned int seconds);
```

## 信号的注册
信号注册的过程是一个位图合一个sigqueue队列。

<img src="images/linux/signal注册.png">

可分为：
- 可靠信号注册
- 不可靠信号注册。