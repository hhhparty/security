# apktool 简要教程

A tool for reverse engineering Android apk files。
## 特性
- 反汇编资源为接近的原形式，包括resources.arsc, classes.dex, 9.png. and XMLs
- Rebuilding decoded resources back to binary APK/JAR
- Organizing and handling APKs that depend on framework resources
- Smali Debugging (Removed in 2.1.0 in favor of IdeaSmali)
- Helping with repetitive tasks

## 安装

apktool依赖java jdk 1.8，运行`java --version` 查看，确认为1.8或更高版本。

在[官方站点](https://ibotpeaches.github.io/Apktool/)下载运行脚本和apktool.jar 。

## Links of Interest
- XDA Thread - For those who wish to communicate on XDA-Developers for community support
- Smali Project - Smali Project is the tool used in the disassembling of .dex files
- Gitter #apktool - Gitter Channel for support, bugs and discussions
- Libera.chat #apktool - IRC Channel for support, bugs and discussions

## [基本用法](https://ibotpeaches.github.io/Apktool/documentation/)

### apk介绍

apk与zip文件类似，只是多包含一些资源和汇编后的java代码。

使用unzip解压apk，也可以得到一些文件，但一些文件不可读，即解码不正确。

### 反编译选项 d 或 decode

`apktool d test.apk -o outdir`

### build选项 b 或 build
`apktool b foo.jar.out -o new.apk`


### frameworks 

Frameworks 既可以从if，也可以从install-framework安装。此外还有两个参数：
- `-p, --frame-path <dir>` 存储框架文件到 dir
- `-t, --tag <tag>` 标记框架使用`<tag>`


`apktool if framework-res.apk`
I: Framework installed to: 1.apk 
// pkgId of framework-res.apk determines number (which is 0x01)

`apktool if com.htc.resources.apk`
I: Framework installed to: 2.apk 
// pkgId of com.htc.resources is 0x02

`apktool if com.htc.resources.apk -t htc`
I: Framework installed to: 2-htc.apk 
// pkgId-tag.apk

`apktool if framework-res.apk -p foo/bar`
I: Framework installed to: foo/bar/1.apk

`apktool if framework-res.apk -t baz -p foo/bar`
I: Framework installed to: foo/bar/1-baz.apk


