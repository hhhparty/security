# Windbg  Tutorial

## symbol 设置

在windbg命令行下：
`.sympath C:\mysymbols;SRV*C:\symbols*http://msdl.microsoft.com/download/symbols`

先通过.sympath设置符号文件的目录。可以将testforme.pdb存放到设置好的符号目录C:\mysymbols。

SRV*C:\symbols*http://msdl.microsoft.com/download/symbols这标明将从http://msdl.microsoft.com/download/symbols下载微软的PE文件对应的符号文件，并且缓存到C:\symbols目录下。 你也可以通过File->Symbol Search Path查看符号目录设置（如下图），当然也可以在这里直接对符号目录进行设置。

## 基本命令

- `.reload` 命令重新加载模块的符号信息。
- `kv` 查看函数异常的调用栈