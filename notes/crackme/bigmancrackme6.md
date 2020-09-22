# Bigman's Crackme 6

本篇记载了学习 4in1 撰写的分析  Bigman's Crackme 6 （序列号求解）的文章之后自己踩坑的过程。

## 脱壳
使用exeinfo工具查看原crackme.exe，能够看到加壳信息。

根据 4in1 的介绍，使用aspdie 去掉asp壳。

## 找分析点
我使用的是x64dbg，虽然没有什么插件，但感觉好于olldbg，毕竟不是一个时代的产品。

跟踪一下，发现了check按钮执行函数的点在[00401305]，这一点从IDA pro也可以得到印证。

## check函数分析

跟踪分析

- name存在[0012f904]

- 先建了4个64个双字（32bit）的00区
- 令[0012f4d0] = "%c%s"
- 令[0012f4ca] = "%s-%d"
- 令[0012F7D5] = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
- 调取```user32.GetDlgItemTextA```，获得输入的序列号，判断是否为空，为空结束。
  - 序列号存在堆栈[0012f7a5]
  - eax = length(serial)
- [12F5D5] = 存着序列号

- 令eax = 0x11cf ，edx=0x0000，ecx=序列号第1个字符（字节）值，然后用eax除以ecx。比较余数与23，相等则跳到4013d7；不相等就错了（不报告）。
  - 所以这里似乎是先要确定第一个字符x1，要满足：$0x11CF mod x1$ = 0x17，即余数为23。若能被24整数，即有0x11cf / 0x18 = 0xbd = 189，189离可打印ascii码太远，应该不是，所以就试试能被25整除...找起来好麻烦，写个穷举函数找吧。

```python

ul = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
ll = s.lower()

a = 0x11cf

for i in ul+ll:
    
    if a % ord(i) == 0x17:
        print(i)
```

结果有：H、Q、T、l

- 第一位序列号正确了，则开始取出name值，然后把name值的每一个字母取出，累加其ascii码值，并将其和存放在[0012f8f0]。然后跳到004013F5去处理name值。