# 逆向分析中常见的Windows api 函数

## winuser.h

### winprintfA

写格式化的数据到指定buffer。

winprintfA(LPTSTR buffer, LPCTSTR format_string，...)

格式字符串后面跟的参数数量和类型，取决于格式字符串的情况。例如格式字符串为“%c%s”，那么后面应该跟一个char类型和一个字符串类型（或字符数组）。

返回值为证书，如果成功返回值是存入缓冲区的字符数量（不计算最后的空字节）；如果失败，返回值为小于期望输出值。

## USER32.DLL 中的常见API 函数

USER32.DLL涉及很多用户窗体的API函数

- DestroyWindow  ord:141 rva: 00002010 ，清除一个窗口并导致一个WM_DESTROY消息
### GetWindowTextA  ord:347 rva: 00002014

获取窗口标题(或者按钮, 文本框)文本，成功时，返回字符串的长度。
### LoadCursorA  ord:407 rva: 00002018 ，   装载光标
- LoadIconA  ord:411 rva: 0000201C ，    装载图标
- MessageBoxA  ord:443 rva: 00002020 ，消息框
- PostQuitMessage  ord:477 rva: 00002024 ，  在消息队列里加入一条WM_QUIT消息
- DispatchMessageA  ord:148 rva: 00002028，向窗口过程分发消息, 窗口程序基本API之一
- GetMessageA  ord:296 rva: 0000202C ，获取窗口消息, 基本函数
- SetFocus  ord:555 rva: 00002030， 设置窗口焦点
- SetWindowTextA  ord:601 rva: 00002034， 设置窗口文本
- ShowWindow  ord:613 rva: 00002038，设置窗口显隐状态
- TranslateMessage  ord:637 rva: 0000203C， 翻译消息
- UpdateWindow  ord:651 rva: 00002040 ，刷新窗口
- DefWindowProcA  ord:131 rva: 00002044，消息默认处理函数, 基本函数之一
### CreateWindowExA  ord:88 rva: 00002048， 建立窗口
HWND CreateWindowEx(
DWORD DdwExStyle,        //窗口的扩展风格
LPCTSTR lpClassName,    //指向注册类名的指针
LPCTSTR lpWindowName,   //指向窗口名称的指针
DWORD dwStyle,          //窗口风格
int x,                  //窗口的水平位置
int y,                  //窗口的垂直位置
int nWidth,             //窗口的宽度
int nHeight,            //窗口的高度
HWND hWndParent,        //父窗口的句柄
HMENU hMenu,            //菜单的句柄或是子窗口的标识符
HINSTANCE hInstance,    //应用程序实例的句柄
LPVOID lpParam          //指向窗口的创建数据
);
### RegisterClassExA  ord:495 rva: 0000204C，注册类
### SendMessageA  ord:528 rva: 00002050，向窗口过程发送消息, 阻塞型函数
LRESULT SendMessageA(
  HWND   hWnd,
  UINT   Msg, //要发送的消息。
  WPARAM wParam,
  LPARAM lParam
);


## kernel32.dll中的常见api

- GetModuleHandleA  ord:273 rva: 00002000，获取模块句柄, 基本函数
- GetCommandLineA  ord:182 rva: 00002004，获取命令行指针
- ExitProcess  ord:117 rva: 00002008，退出进程


## Windows 消息

### wParam 和 lParam
在Windows的消息函数中，有两个非常熟悉的参数：wParam，lParam。这两个参数的字面意义对于现在的程序来说已经不重要了，因为它是16位系统的产物，为了保持程序的可移植性，就将它保存了下来。它的字面意义，w表示word，l表示long，对于32为系统来说，分别是无符号整数（unsigned int）和长整型（long），都是32位整数。所以，根据具体的消息解析参数即可，不用在乎其字面意义了。wParam 通常是一个与消息有关的常量值，也可能是窗口或控件的句柄。 lParam 通常是一个指向内存中数据的指针。