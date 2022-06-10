# IDA Pro
梯度下降算法为基础的交互式反汇编工具。


## 目录结构

为了升级IDA pro的高级功能，需要理解它的目录结构。

- cfg 目录，包含了各种配置文件。
  - ida基本配置文件 ida.cfg
  - GUI 配置文件 idagui.cfg
  - 文本模式用户界面配置文件 idatui.cfg

- idc 目录，包含了IDA 的内置脚本语言 IDC 所需的核心文件。
- ids 目录，包含了一些符号文件（ida语法中的ids文件）。
  - 这些文件用于描述可被加载到ida的二进制文件引用的共享库的内容。
  - 包含摘要信息，列出由一个指定库到处的所有项目，包含了描述某个函数所需的参数类型和数量的心、函数的返回地址与该函数调用约定有关的心。
- loaders 目录，包含了文件加载过程中用于识别和解析 PE 或 ELF 等已知文件格式的IDA扩展。
- plugins 目录，包含专门的插件。
- procs 目录，包含已经安装的支持的处理器模块。
  - 处理器模块为ida提供机器语言-汇编语言转换功能，并生成显示。
- sig 目录，包含IDA在各种模式匹配操作中利用的现有代码的签名。
  - 通过模式匹配，ida能够将代码序列确定为已知的库代码，从而节省大量分析时间。
  - 这些签名由ida的快速的库识别和鉴定技术（FLIRT）生成。
- til 目录，包含一些类型库信息。
  - IDA 通过这些信息记录特定于各种编译器库的数据结构的布局。

## 文件加载

IDA 加载文件是比较重要的步骤，涉及下列几个问题：
- 使用何种加载器（ldw）分析文件
- 处理器类型
- 处理器选项
- 加载段、加载偏移
- kernel analysis option1、2、3
- 其他选项
  - 加载选项
  - fill segment gaps
  - load resources
  - manual load
  - rename DLL entries

IDA 会对即将打开的文件生成一个可能的文件类型列表，列表中显示了最适合处理的加载器，例如：
- protable execute for 80386 PE （PE.dll)
- protable execute for  PE64
- MS-DOS executable
- Binary file，这种加载方式下，ida无法提取任何内存布局结构信息。
- ELF
- ELF64


处理器类型由诸多选择，默认是一个ida的metapc（反汇编所有的操作码）。通常IDA会分析合适的处理器，但是嵌入式系统分析则不一定能够识别，需要手动。

### 主要的芯片类型包括：
- ALPHA
- AMD
- AnalogAngstre
- Argonaut
- Atmel
- Cavium
- DEC
- Dalvik
- DSP group
- EFI
- Freescale
- Fujitsu
- Gameboy
- Hitachi
- Infineon
- Intel
- Java
- MIPS
- MOS
- Microchip
- Mitsubishi
- Motorola
- NEC
- Renesas
- PA-RISC
- PICxx
- SGS
- SPARC
- Samsung
- Siemens
- Sony
- TI
- Zilog

### Loading segment 和 Loading offset
Loading segment 和 Loading offset 这两个选项在选择加载器为 “Binary file” 且 Process type 为“MetaPC” 时激活，用于手动设定将要导入的段（或认为是文件结构块）基址和段内偏移量。打开文件后，还可以在 edit-segments-rebase program中查看基址。
### kernel options
反汇编过程是一个复杂的过程，其中的一些设置可以通过 kernel options 设定，改进递归下降过程。绝大多数情况，不需要改动。

#### Kernel options 1

- 

### Process options
Process options 可以选择适用于选中Process Type的一些配置信息。只能为反汇编过程提供有限帮助，非常依赖用户选定的处理器模块，以及模块创建者的编程能力。

### Options
Options 用于帮助用户更好地控制文件加载过程。

### 加载过程
点击OK关闭对话框后，才真正开始加载文件。用户可能还要输入一些额外的信息，以完成加载过程。例如：
- 使用 PDB 调试信息创建的 PE 文件。如果 ida 发现一个 pdb 文件（Program Database），她会显示下列消息：“IDA pro 已经确认输入文件链接有调试信息，你希望在本地符号存储去及microsoft symbol server 中寻找相应的pdb 文件么？”
- 分析恶意代码等模糊程序（被加壳或混淆）时候，加载器也会生成一些信息。模糊技术并不严格遵循文件格式规范，如果加载器希望处理结构完整的文件，这是就会造成问题。为此，PE 加载器会对导入表进行某种形式的验证，如果发现导入表没有根据约定进行格式化，ida 将显示下列消息：“导入的文件似乎遭到破坏。这说明该文件可能被压缩或巾帼修改，以阻止人们对其分析，如果你希望看到原始的导入文件，请取消选择 make imports section复选框，重新加载文件”

### IDA 数据库

IDA加载文件后，会形成一些分析记录文件，称为IDA数据库文件，主要有4个：
- .id0：二叉树数据库；
- .id1：包含描述每个程序字节的标记；
- .nam：包含与IDA 的 Names 窗口中显示的给定程序位置有关系的索引信息；
- .til：用于存储与一个给定数据库的本地类型定义有关的信息。

这些文件在IDA之外很难编辑。关闭项目时，可以将他们压缩为一个 idb 文件。人们常说的 ida 数据库其实是 idb 文件。

IDA 一旦创建了某个已加载文件的数据库，它就不再需要访问这个可执行文件了。除非想用ida集成的调试器调试这个可执行文件本身。这是一种安全特性，目前还没有见到利用 ida 数据库作为恶意软件的攻击向量。

本质上看，IDA 是一个数据库应用程序。分析可执行文件时，它自动创建和填充新的数据库，它提供的各种显示不过是数据库视图。IDA 强大之处在于，它包含各种可用于分析和操作数据库数据的工具。

### 创建 ida 数据库
这里涉及的模块有：
- 加载器
- 反汇编引擎
- 处理器模块

选定一个可执行文件并指定选项后，IDA 将开始创建数据库。IDA 的控制权将交给选定的加载器模块，主要工作包括：
- 从磁盘加载文件
- 解析它能够识别的任何文件头信息
- 选定一种合适的虚拟内存布局
- 对数据库进行配置
- 创建各种包含代码或数据的程序块
- 确定特定代码入口点
- 将控制权返还ida

这样看，IDA 加载器类似 OS 加载器。

加载完成后，IDA 的反汇编引擎接管控制权，一次穿一个地址给选定的处理器模块。

处理器模块的工作包括：
- 确定位于改地址的指令的类型、长度
- 从这个地址继续执行指令的位置（顺序、分支）
- 是否已经找到所有指令，若是则第二遍遍历指令列表
- 将每个指令转换为汇编语言并显示

之后，IDA 还会做额外的分析，以提取其他可能对人们有用的信息。在ida完成初步分析后，人可能会在数据库中发现下列信息：
- 编译器识别。
  - 这可以帮助我们了解二进制文件使用的函数调用约定；以及确定该二进制链接到哪些库。
  - 如果 IDA 能确定编译器，那么可以在输入文件中扫描该编译器使用的样本代码序列，然后将这些代码以彩色显示，以减少需要分析的代码数量。
- 函数参数和局部变量识别。
  - 对于每个已识别函数（其地址是某个指令的调用目标），IDA 会详细分析栈指针寄存器的行为，用于确定栈内的变量，并了解函数栈帧的布局。
  - 之后，IDA 会根据这些变量的用途（或为局部变量、或为参数）为他们自动命名；
- 数据类型信息
  - 利用对公共库函数及所需参数的了解，IDA 会在数据库中添加注释，指明这些函数提交参数的位置；
  - 这需要查阅各种api文档，大幅减少了人员时间。

### 关闭数据库
在关闭IDA 或打开新文件时，都会显示一个save database 对话框。

如果是第一次，ida 会用扩展名idb替换输入文件的扩展名。
- don't pack database 这个选项仅刷新4个数据库文件的更改，关闭桌面前部创建idb。不建议使用
- pack database（store） 打包数据库，但不压缩。创建idb后，4个数据库文件就会被删除。
- pack database（deflate）打包数据库，压缩。
- collect garbage 收集垃圾。这时会在关闭数据库前从数据库中删除无用的内存页面。

### 重新打开数据库
注意，IDA 经常会崩溃。为了防止这个问题，建议及时保存数据库。

IDA 所提供的数据库修复，不一定好用。

### FLIRT Signature File Database

Fast Library Identification and Recognition Technology , FLIRT 是IDA的内部符号识别器，可以搜索反汇编代码以定位、重命名和高亮显示已知的库程序。

参考：https://www.hex-rays.com/products/ida/tech/flirt/index.shtml

