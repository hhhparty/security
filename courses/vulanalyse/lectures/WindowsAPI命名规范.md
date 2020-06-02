# Windows API 命名规范


匈牙利命名法是一种编程时的命名规范。基本原则是：变量名＝属性＋类型＋对象描述。其中每一对象的名称都要求有明确含义，可以取对象名字全称或名字的一部分。命名要基于容易记忆容易理解的原则。目前在Windows程序开发和MFC程序开发中常用的命名规则是匈牙利命名法。下面就是HN命名法的一般规则。

## 属性部分
全局变量 g_
const常量 c_
c++类成员变量 m_
静态变量 s_

## 类型部分
指针 p
函数 fn
无效 v
句柄 h
长整型 l
布尔 b
浮点型(有时也指文件) f
双字 dw
字符串 sz
短整型 n
双精度浮点 d
计数 c（通常用cnt）
字符 ch（通常用c）
整型 i（通常用n）
字节 by
字 w
实型 r
无符号 u

## 描述部分
最大 Max
最小 Min
初始化 Init
临时变量 T（或Temp）
源对象 Src
目的对象 Dest


这里顺便写几个例子：
(1) hwnd ： h 是类型描述，表示句柄， wnd 是变量对象描述，表示窗口，所以 hwnd 表示窗口句柄；
(2) pfnEatApple ： pfn 是类型描述，表示指向函数的指针， EatApple 是变量对象描述，所以它表示
指向 EatApple 函数的函数指针变量。
(3) g_cch ： g_ 是属性描述，表示全局变量，c 和 ch 分别是计数类型和字符类型，一起表示变量类
型，这里忽略了对象描述，所以它表示一个对字符进行计数的全局变量。


## MFC、句柄、控件及结构的命名规范 

Windows类型 样本变量 MFC类 样本变量
HWND hWnd； CWnd* pWnd；
HDLG hDlg； CDialog* pDlg；
HDC hDC； CDC* pDC；
HGDIOBJ hGdiObj； CGdiObject* pGdiObj；
HPEN hPen； CPen* pPen；
HBRUSH hBrush； CBrush* pBrush；
HFONT hFont； CFont* pFont；
HBITMAP hBitmap； CBitmap* pBitmap；
HPALETTE hPaltte； CPalette* pPalette；
HRGN hRgn； CRgn* pRgn；
HMENU hMenu； CMenu* pMenu；
HWND hCtl； CState* pState；
HWND hCtl； CButton* pButton；
HWND hCtl； CEdit* pEdit；
HWND hCtl； CListBox* pListBox；
HWND hCtl； CComboBox* pComboBox；
HWND hCtl； CScrollBar* pScrollBar；
HSZ hszStr； CString pStr；
POINT pt； CPoint pt；
SIZE size； CSize size；
RECT rect； CRect rect；


一般前缀命名规范 前缀 类型实例
C 类或结构 CDocument，CPrintInfo
m_ 成员变量 m_pDoc，m_nCustomers


变量命名规范 前缀 类型 描述实例
ch char 8位字符 chGrade
ch TCHAR 如果_UNICODE定义，则为16位字符 chName
b BOOL 布尔值 bEnable
n int 整型（其大小依赖于操作系统） nLength
n UINT 无符号值（其大小依赖于操作系统） nHeight
w WORD 16位无符号值 wPos
l LONG 32位有符号整型 lOffset
dw DWORD 32位无符号整型 dwRange
p * 指针 pDoc
lp FAR* 远指针 lpszName
lpsz LPSTR 32位字符串指针 lpszName
lpsz LPCSTR 32位常量字符串指针 lpszName
lpsz LPCTSTR 如果_UNICODE定义，则为32位常量字符串指针 lpszName
h handle Windows对象句柄 hWnd
lpfn callback 指向CALLBACK函数的远指针


资源类型命名规范 前缀 符号类型实例 范围
IDR_ 不同类型的多个资源共享标识 IDR_MAIINFRAME 1～0x6FFF
IDD_ 对话框资源 IDD_SPELL_CHECK 1～0x6FFF
HIDD_ 对话框资源的Help上下文 HIDD_SPELL_CHECK 0x20001～0x26FF
IDB_ 位图资源 IDB_COMPANY_LOGO 1～0x6FFF
IDC_ 光标资源 IDC_PENCIL 1～0x6FFF
IDI_ 图标资源 IDI_NOTEPAD 1～0x6FFF
ID_ 来自菜单项或工具栏的命令 ID_TOOLS_SPELLING 0x8000～0xDFFF
HID_ 命令Help上下文 HID_TOOLS_SPELLING 0x18000～0x1DFFF
IDP_ 消息框提示 IDP_INVALID_PARTNO 8～0xDEEF
HIDP_ 消息框Help上下文 HIDP_INVALID_PARTNO 0x30008～0x3DEFF
IDS_ 串资源 IDS_COPYRIGHT 1～0x7EEF
IDC_ 对话框内的控件 IDC_RECALC 8～0xDEEF


Microsoft MFC宏命名规范 名称 类型
_AFXDLL 唯一的动态连接库（Dynamic Link Library，DLL）版本
_ALPHA 仅编译DEC Alpha处理器
_DEBUG 包括诊断的调试版本
_MBCS 编译多字节字符集
_UNICODE 在一个应用程序中打开Unicode
AFXAPI MFC提供的函数
CALLBACK 通过指针回调的函数


库标识符命名法 标识符 值和含义
u ANSI（N）或Unicode（U）
d 调试或发行：D = 调试；忽略标识符为发行。


静态库版本命名规范 库描述
NAFXCWD.LIB 调试版本：MFC静态连接库
NAFXCW.LIB 发行版本：MFC静态连接库
UAFXCWD.LIB 调试版本：具有Unicode支持的MFC静态连接库
UAFXCW.LIB 发行版本：具有Unicode支持的MFC静态连接库


动态连接库命名规范 名称类型
_AFXDLL 唯一的动态连接库（DLL）版本
WINAPI Windows所提供的函数


Windows.h中新的命名规范 类型 定义描述
WINAPI 使用在API声明中的FAR PASCAL位置，如果正在编写一个具有导出API人口点的DLL，则可以在自己的API中使用该类型
CALLBACK 使用在应用程序回叫例程，如窗口和对话框过程中的FAR PASCAL的位置
LPCSTR 与LPSTR相同，只是LPCSTR用于只读串指针，其定义类似（const char FAR*）
UINT 可移植的无符号整型类型，它是unsigned int的同义词
LRESULT 窗口程序返回值的类型
LPARAM 声明lParam所使用的类型，lParam是窗口程序的第四个参数
WPARAM 声明wParam所使用的类型，wParam是窗口程序的第三个参数
LPVOID 一般指针类型，与（void *）相同，可以用来代替LPSTR


匈牙利编程命名规则
匈牙利命名法包括与下列命名有关的约定：变量、函数、类型和常量、类。
（1）变量的匈牙利命名法。
应用匈牙利命名法，所有的变量名都应该以前缀+名字的形式出现。比如：

char* szName; //以0为结束符的符串，存储的是名字变量
BOOL bCanExit; //布尔型变量，能退出吗
DWORD dwMaxCount; //32位双字变量，最大记数
（2）函数的匈牙利命名法。
与变量的命名不同的是，函数的命名不带前缀，函数中每一个单词的开头字母都要大写。比如：

int ConvertNumber( int ix );
void ShowMessage( char* szMessage );
（3）类型和常量的匈牙利命名法。
所有的类型和常量命名都是大写字母，比如：

#define MAX_NUM 256
typedef unsigned char UCHAR;
（4）类的匈牙利命名法。
类的命名规则是在名称前面加上一个字母C，比如：

 class CMyClass
{
public:
 CMyClass();
 ~CMyClass();
 …
private:
 m_szName; 
 …
};
在对类的成员变量命名的时候，一般要在变量名前加上m_前缀。一般来说，最好按照此规则来编程，这样在以后读程序或者修改程序时，能够更快地了解变量的作用。

 

 

 