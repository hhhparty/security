# PE文件结构

内容来源：
- https://docs.microsoft.com/en-us/windows/win32/debug/pe-format
- https://blog.csdn.net/reversalc/article/details/8022977



Windows OS下的可执行文件的结构和对象文件被称为Portable Execute PE 和 Common Object File Format (COFF) 文件。

## 一般概念

在PE文件结构介绍中，常出现的概念有：

### 地址
是“虚拟地址”而不是“物理地址”。为什么不是“物理地址”呢？因为数据在内存的位置经常在变，这样可以节省内存开支、避开错误的内存位置等的优势。同时用户并不需要知道具体的“真实地址”，因为系统自己会为程序准备好内存空间的（只要内存足够大）
### 镜像文件
包含以EXE文件为代表的“可执行文件”、以DLL文件为代表的“动态链接库”。为什么用“镜像”？这是因为他们常常被直接“复制”到内存，有“镜像”的某种意思。
### attribute certificate

A certificate that is used to associate verifiable statements with an image. A number of different verifiable statements can be associated with a file; one of the most useful ones is a statement by a software manufacturer that indicates what the message digest of the image is expected to be. A message digest is similar to a checksum except that it is extremely difficult to forge. Therefore, it is very difficult to modify a file to have the same message digest as the original file. The statement can be verified as being made by the manufacturer by using public or private key cryptography schemes. This document describes details about attribute certificates other than to allow for their insertion into image files.
### date/time stamp
A stamp that is used for different purposes in several places in a PE or COFF file. In most cases, the format of each stamp is the same as that used by the time functions in the C run-time library. For exceptions, see the descripton of IMAGE_DEBUG_TYPE_REPRO in Debug Type. If the stamp value is 0 or 0xFFFFFFFF, it does not represent a real or meaningful date/time stamp.
### file pointer
The location of an item within the file itself, before being processed by the linker (in the case of object files) or the loader (in the case of image files). In other words, this is a position within the file as stored on disk.
### linker
A reference to the linker that is provided with Microsoft Visual Studio.
### object file
A file that is given as input to the linker. The linker produces an image file, which in turn is used as input by the loader. The term "object file" does not necessarily imply any connection to object-oriented programming.
### reserved, must be 0
A description of a field that indicates that the value of the field must be zero for generators and consumers must ignore the field.
### RVA 相对虚拟地址
相对镜像基址的偏移位置。
Relative virtual address. In an image file, the address of an item after it is loaded into memory, with the base address of the image file subtracted from it. The RVA of an item almost always differs from its position within the file on disk (file pointer).
In an object file, an RVA is less meaningful because memory locations are not assigned. In this case, an RVA would be an address within a section (described later in this table), to which a relocation is later applied during linking. For simplicity, a compiler should just set the first RVA in each section to zero.
### section
The basic unit of code or data within a PE or COFF file. For example, all code in an object file can be combined within a single section or (depending on compiler behavior) each function can occupy its own section. With more sections, there is more file overhead, but the linker is able to link in code more selectively. A section is similar to a segment in Intel 8086 architecture. All the raw data in a section must be loaded contiguously. In addition, an image file can contain a number of sections, such as .tls or .reloc , which have special purposes.
### VA
virtual address. Same as RVA, except that the base address of the image file is not subtracted. The address is called a "VA" because Windows creates a distinct VA space for each process, independent of physical memory. For almost all purposes, a VA should be considered just an address. A VA is not as predictable as an RVA because the loader might not load the image at its preferred location.

## 32位与64位的区别

x86都是32位的，IA-64都是64位的。64位Windows需要做的只是修改PE格式的少数几个域。这种新的格式被称为PE32+。它并没有增加任何新域，仅从PE格式中删除了一个域。其余的改变就是简单地把某些域从32位扩展到64位。在大部分情况下，你都能写出同时适用于32位和64位PE文件的代码。

EXE文件与DLL文件的区别完全是语义上的。它们使用的是相同的PE格式。惟一的不同在于一个位，这个位用来指示文件应该作为EXE还是DLL。甚至DLL文件的扩展名也完全也是人为的。你可以给DLL一个完全不同的扩展名，例如.OCX控件和控制面板小程序（.CPL）都是DLL。


## PE文件结构概述

PE文件以一个头部开始，这个开头是MS-DOS 2.0兼容EXE头。
- MS-DOS 2.0 Compatible EXE Header
- unused
- OEM Identifier
  - OEM Information
  - Offset to PE Header
- MS-DOS 2.0 Stub Program and Relocation Table
- unused
- PE Header (aligned on 8-byte boundary)
- Section Headers
- Image Pages:
  - import info
  - export info
  - base relocations
  - resource info

下面是 Microsoft COFF object-module 的格式:
- Microsoft COFF Header
- Section Headers
- Raw Data:
  - code
  - data
  - debug info
  - relocations

## 文件头

The PE file header consists of a Microsoft MS-DOS stub, the PE signature, the COFF file header, and an optional header. 

### MS-DOS Stub (Image Only)
### Signature (Image Only)
### COFF File Header (Object and Image)
#### Machine Types
#### Characteristics
### Optional Header (Image Only)
#### Optional Header Standard Fields (Image Only)
#### Optional Header Windows-Specific Fields (Image Only)
#### Optional Header Data Directories (Image Only)
### Section Table (Section Headers)
#### Section Flags
#### Grouped Sections (Object Only)
### Other Contents of the File
#### Section Data
#### COFF Relocations (Object Only)
##### Type Indicators
#### COFF Line Numbers (Deprecated)
#### COFF Symbol Table
##### Symbol Name Representation
##### Section Number Values
##### Type Representation
##### Storage Class
#### Auxiliary Symbol Records
##### Auxiliary Format 1: Function Definitions
##### Auxiliary Format 2: .bf and .ef Symbols
##### Auxiliary Format 3: Weak Externals
##### Auxiliary Format 4: Files
##### Auxiliary Format 5: Section Definitions
##### COMDAT Sections (Object Only)
##### CLR Token Definition (Object Only)
#### COFF String Table
#### The Attribute Certificate Table (Image Only)
##### Certificate Data
#### Delay-Load Import Tables (Image Only)
##### The Delay-Load Directory Table
##### Attributes
##### Name
##### Module Handle
##### Delay Import Address Table
##### Delay Import Name Table
##### Delay Bound Import Address Table and Time Stamp
##### Delay Unload Import Address Table
### Special Sections
#### The .debug Section
##### Debug Directory (Image Only)
#### Debug Type
#### .debug$F (Object Only)
#### .debug$S (Object Only)
#### .debug$P (Object Only)
.debug$T (Object Only)
Linker Support for Microsoft Debug Information
#### The .drectve Section (Object Only)
#### The .edata Section (Image Only)
导出数据节，命名为.edata，包含了别的images可用的符号信息，别的images可通过动态连接访问。

导出的符号通常可在DLLs中发现，但DLLs也可以导入符号。

下面描述的表通常在文件中是连续出现的，出现顺序安装本文目录顺序，但这不是必须的。仅有导出目录表和导出地址表被要求按序数ordinal导出符号。一个序数ordinal是一种对外的访问方式，是可以直接使用的地址表索引值。The name pointer table, ordinal table, and export name table all exist to support use of export names.

- Export directory table：A table with just one row (unlike the debug directory). This table indicates the locations and sizes of the other export tables.
- Export address table：An array of RVAs of exported symbols. These are the actual addresses of the exported functions and data within the executable code and data sections. Other image files can import a symbol by using an index to this table (an ordinal) or, optionally, by using the public name that corresponds to the ordinal if a public name is defined.
- Name pointer table：An array of pointers to the public export names, sorted in ascending order.
- Ordinal table：An array of the ordinals that correspond to members of the name pointer table. The correspondence is by position; therefore, the name pointer table and the ordinal table must have the same number of members. Each ordinal is an index into the export address table.
- Export name table：A series of null-terminated ASCII strings. Members of the name pointer table point into this area. These names are the public names through which the symbols are imported and exported; they are not necessarily the same as the private names that are used within the image file.

当其它image文件使用name导入某个符号时，Win32 loader查询 Name Pointer Table 中匹配的名字。如果查到了匹配的名字，可在 ordinal table 中相应成员处找到相对应的序数ordinal，即 ordinal table 中的成员与 name pointer table中成员有相同的index值。找到的ordinal就是指向 export address table的index，它可以提供想要调用的符号的真实地址。每个导出符号可以通过一个ordinal来访问。

如果其它image文件通过ordinal导入某个符号，它不必在 name pointer table中找匹配的名字字符串。直接使用ordinal更有效率，然而，导出名字更容易记住，也不要求用户记住某个符号的表索引值index。

##### Export Directory Table
导出符号信息开始于导出目录表，它包含了用于解决该导入时的入口点的地址信息。

|Offset	|Size|	Field	|Description|
|-|-|-|-|
|0|4|Export Flags|Reserved, must be 0.|
|4|4|Time/Date Stamp|The time and date that the export data was created.|
|8|2|Major Version|The major version number. The major and minor version numbers can be set by the user.|
|10|2|Minor Version|The minor version number.|
|12|4|Name RVA|The address of the ASCII string that contains the name of the DLL. This address is relative to the image base.
|16|4 |Ordinal Base |The starting ordinal number for exports in this image. This field specifies the starting ordinal number for the export address table. It is usually set to 1.|
|20 |4 |Address Table Entries |The number of entries in the export address table.
|24 |4 |Number of Name Pointers |The number of entries in the name pointer table. This is also the number of entries in the ordinal table.|
|28 |4 |Export Address Table RVA |The address of the export address table, relative to the image base.|
|32 |4 |Name Pointer RVA |The address of the export name pointer table, relative to the image base. The table size is given by the Number of Name Pointers field. 
|36 |4 |Ordinal Table RVA |The address of the ordinal table, relative to the image base. |
##### Export Address Table
##### Export Name Pointer Table
##### Export Ordinal Table
##### Export Name Table
#### The .idata Section
Import Directory Table
Import Lookup Table
Hint/Name Table
Import Address Table
#### The .pdata Section
#### The .reloc Section (Image Only)
Base Relocation Block
Base Relocation Types
#### The .tls Section
The TLS Directory
TLS Callback Functions
#### The Load Configuration Structure (Image Only)
Load Configuration Directory
Load Configuration Layout
#### The .rsrc Section
Resource Directory Table
Resource Directory Entries
Resource Directory String
Resource Data Entry
#### The .cormeta Section (Object Only)
#### The .sxdata Section
### Archive (Library) File Format
#### Archive File Signature
#### Archive Member Headers
First Linker Member
Second Linker Member
Longnames Member
### Import Library Format
Import Header
Import Type
### Appendix A: Calculating Authenticode PE Image Hash
#### A.1 What is an Authenticode PE Image Hash?
#### A.2 What is Covered in an Authenticode PE Image Hash?
###References