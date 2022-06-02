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

主要的芯片类型包括：
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

Loading segment 和 Loading offset 这两个选项在选择加载器为 “Binary file” 且 Process type 为“MetaPC” 时激活，用于手动设定将要导入的段（或认为是文件结构块）基址和段内偏移量。打开文件后，还可以在 edit-segments-rebase program中查看基址。

反汇编过程是一个复杂的过程，其中的一些设置可以通过 kernel options 设定，改进递归下降过程。绝大多数情况，不需要改动。

Process options 可以选择适用于选中Process Type的一些配置信息。只能为反汇编过程提供有限帮助，非常依赖用户选定的处理器模块，以及模块创建者的编程能力。

Options 用于帮助用户更好地控制文件加载过程。

