# MONA USER GUIDE 

MONA as a plugin for immunity debugger, is used to find opcode.

## 常用命令

### 查找 pop pop ret
用Immunity Debugger附加上待调试的程序，这样的地址更具有通用性，不依赖操作系统。

在命令行输入```!mona rop```

生成结果在 C:\D\mona-master\output\c ，log data中有显示。

### 查找JMP ESP,CALL ESP, push esp;ret
命令：```!mona jmp -r esp```

### 计算SEH溢出长度

- 生成溢出字符串，命令：```!mona pattern_create 5000```

注：5000为字符串长度

使用该字符串尝试溢出，得到seh的值为:35744134

- 计算溢出长度，首先查找查找nseh偏移，命令```!mona pattern_offset 35744134```

nseh的偏移为：584，则seh handler的偏移：584 + 4 =588

### 汇编指令转机器码
命令：```!mona assemble/asm –s 汇编指令（多个指令用#分隔）```

