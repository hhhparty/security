# 调试Explorer.exe的两种办法

参考：
- [用OllyDBG调试Explorer.exe的两种办法](http://bbs.pediy.com/showthread.php?t=74872) 

- [ Debugging with the Shell](http://msdn.microsoft.com/en-us/library/cc144064(VS.85).aspx)

## windows xp 下使用od调试

### 第一种 使用取消关机组合键
打开OD菜单：File -> Open，选择Windows目录下的Explorer.exe，打开之后，OD将会自动中断在入口点，这时在系统中会存在2个Explorer.exe进程，一个在od下，一个不在。 

接下来从“开始”菜单或者“任务管理器”中选择“关机”，系统弹出关机对话框。 

此时很关键了，要在按住CTRL+ALT+SHIFT三个键的同时，点击“取消”按钮，注意：必须是同时才有效，即先按下三个键，然后再点击。屏幕会在短暂的灰屏后重新亮起，原来的Explorer.exe已经被关闭，但是被OD调试的那个还在，如下图：

之后你会发现桌面和任务栏都不见了，但不用担心，这是正常的，你原来打开的所有应用程序都还健康地活着，在OD下需要的断点，然后按F9运行，这时的Explorer就像普通进程一样开始运行，可以被OD任意调试了。

按下CTRL+ALT+SHIFT三个键表示什么意思呢？我也不知道，在Google上也没找到，要是有谁知道的，请一定要告诉我。 

### 第二种：修改注册表
注册表```HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Explorer``` 键下新建一个DWORD值为1，修改之后如下图：
 


这个值的意思是让Windows中的桌面和任务栏使用一个单独的Explorer.exe进程，而其它的文件浏览等操作则使用另外一个Explorer.exe进程。修改后进行注销再重新登录，使修改生效。之后就和第一种方法一样了，操作OD菜单：File -> Open，选择Windows目录下的Explorer.exe，在OD下需要的断点，按F9运行，用被OD调试的这个Explorer.exe进行文件浏览等，当触发了断点后就会被断下。

如果用IDA创建了系统DLL的MAP文件，还可以用OD插件LoadMapEx加载到OD中，这样在OD中也能看到MS的调试符号，会把系统对Explorer.exe的调用流程看得更清楚。以Gdi32.dll中的StretchDIBits函数为例，在Explorer.exe中下了StretchDIBits断点后，当该断点被触发时，从我机器上的CallStack窗口可以看到这样的流程：Shell32 -> User32 -> Gdi32.StretchDIBits。如下图：

 

总结: 这两种方法比较，尽管第一种方法感觉有点酷，不过从稳定性方面考虑，个人还是推荐第二种方法。

## windows 7 下调试 exploer
同windows xp中的第一种类似。
- 先在x64dbg中打开windows文件夹下的exploer.exe，并按一次F9运行到入口点；
- 使用process exploer工具查看当前系统运行的exploer.exe有2个。
- 在process中将调试器之外打开的exploer全部kill
- 在调试器中点击“运行到用户代码”，直到自己需要的地方。


## 双机调试

这个方法同调试windows内核。