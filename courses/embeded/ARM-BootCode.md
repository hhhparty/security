# ARM Boot Code
这里涉及两种情况：
- 内核复位后立即运行的代码，在所谓的裸机系统上运行，即在不使用操作系统的情况下运行代码。这是首次启动芯片或系统时经常遇到的情况。

- 引导加载程序如何加载和运行Linux内核。

## 裸系统启动

When the core has been reset, it will commence execution at the location of the reset vector in the exception vector table (at either address 0x00000000 or 0xFFFF0000, see Table 11.3). The reset handler code must do some, or all of the following:

- 多核系统中，令非主核们睡眠， See [Booting SMP systems](https://developer.arm.com/documentation/den0013/d/Multi-core-processors/Booting-SMP-systems?lang=en).

- 初始化异常向量 exception vectors.

- 初始化内存系统，包括 MMU。

- 初始化核心 mode 堆栈和寄存器。

- 初始化所有关键的 I/O devices.

- 执行所有必要的 NEON 或 VFP 初始化。

- 使能中断

- 改变核心mode 或 state

- 接管/控制任何安全世界需要的 set-up.

- 调用 main() application.

首先要考虑的就是放置异常向量表，必须确定这个表中包含了有效的指令集，能够跳转到（branch）正确的异常handlers。


GNU汇编程序中的 `_start` 指令告诉链接器将代码定位在特定地址，并可用于将代码放置在向量表中。初始向量表将位于非易失性存储器中，并且可以包含分支到自指令（重置向量除外），因为此时不会出现异常。通常，重置向量包含ROM中引导代码的分支。ROM可以别名为异常向量的地址。然后，ROM写入将RAM映射到地址0的某个存储器重映射外围设备，并将实际异常向量表复制到RAM中。这意味着引导代码中处理重新映射的部分必须与位置无关，因为只能使用PC相对寻址。示例13.1显示了可以放在异常向量表中的典型代码示例。

