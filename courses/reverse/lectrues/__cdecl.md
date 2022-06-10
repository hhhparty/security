# 参数传递与命名约定

Microsoft C++ 编译器允许指定用于在函数和调用方之间传递参数和返回值的约定。 并非所有约定都在所有支持的平台上可用，某些约定使用平台特定的实现。 在大多数情况下，将忽略在特定平台上指定不支持的约定的关键字或编译器开关，并将使用平台默认约定。

在 x86 平台上，所有参数在传递时都扩大为 32 位。 返回值也将加宽到 32 位，并将通过 EAX 寄存器返回，但在 EDX:EAX 寄存器对中返回的 8 字节结构除外。 更大的结构将在 EAX 寄存器中作为指向隐藏返回结构的指针返回。 参数将从右到左推送到堆栈中。 不是 POD 的结构不会在寄存器中返回。

编译器将生成 prolog 和 epilog 代码来保存并还原 ESI、EDI、EBX 和 EBP 寄存器（如果在函数中使用了它们）。

## vc/c++ 编译器支持的调用约定

Visual C/C++ 编译器支持下列调用约定。

关键字	堆栈清理	参数传递
__cdecl	调用方	在堆栈上按相反顺序推送参数（从右到左）
__clrcall	不适用	按顺序将参数加载到 CLR 表达式堆栈上（从左到右）。
__stdcall	被调用方	在堆栈上按相反顺序推送参数（从右到左）
__fastcall	被调用方	存储在寄存器中，然后在堆栈上推送
__thiscall	被调用方	在堆栈上推送; this 存储在 ECX 中的指针
__vectorcall	被调用方	存储在寄存器中，然后按相反顺序在堆栈上推送（从右到左）

## __cdecl
__cdecl 是 C 和 C++ 程序的默认调用约定。 由于堆栈由调用方清理，因此它可以执行 vararg 函数。 __cdecl调用约定创建比__stdcall更大的可执行文件，因为它需要每个函数调用来包括堆栈清理代码。 以下列表显示此调用约定的实现。 修饰 __cdecl 符特定于 Microsoft。

|元素|	实现|
|-|-|
|参数传递顺序	|从右向左。|
|堆栈维护职责	|调用函数从堆栈中弹出自变量。|
|名称修饰约定	|下划线字符 (_) 作为名称的前缀，导出使用 C 链接的 __cdecl 函数时除外。|
|大小写转换约定	|不执行任何大小写转换。|


将 __cdecl 修饰符放在变量或函数名称之前。 由于 C 命名和调用约定是默认值，因此在 __cdecl x86 代码中使用的唯一时间是 /Gv 指定了 (vectorcall) 、 /Gz (stdcall) ，或 /Gr (fastcall) 编译器选项。 /Gd 编译器选项强制__cdecl调用约定。

在 ARM 和 x64 处理器上， __cdecl 接受但通常被编译器忽略。 按照 ARM 和 x64 上的约定，自变量将尽可能传入寄存器，后续自变量传递到堆栈中。 在 x64 代码中，用于 __cdecl 替代 /Gv 编译器选项并使用默认的 x64 调用约定。

对于非静态类函数，如果函数是超行定义的，则调用约定修饰符不必在超行定义中指定。 也就是说，对于类非静态成员方法，在定义时假定声明期间指定的调用约定。 给定此类定义：

```C++

struct CMyClass {
   void __cdecl mymethod();
};
```
此：
```C++

void CMyClass::mymethod() { return; }
```
等效于此：

```C++
void __cdecl CMyClass::mymethod() { return; }
```
为了与以前的版本兼容， cdecl 和 _cdecl 是一个同义词 __cdecl ，除非指定编译器选项 /Za (禁用语言扩展) 。

示例
在下面的示例中，将指示编译器对 system 函数使用 C 命名和调用约定。

C++

复制
// Example of the __cdecl keyword on function
int __cdecl system(const char *);
// Example of the __cdecl keyword on function pointer
typedef BOOL (__cdecl *funcname_ptr)(void * arg1, const char * arg2, DWORD flags, ...);


## __stdcall

__stdcall 调用约定用于调用 Win32 API 函数。 被调用方清理堆栈，因此编译器会生成 vararg 函数 __cdecl。 使用此调用约定的函数需要一个函数原型。 修饰 __stdcall 符特定于 Microsoft。

语法：`return-type __stdcall function-name[(argument-list)]`

|元素|实现|
|-|-|
|参数传递顺序|从右向左|
|参数传递约定|按值，除非传递指针或引用类型|
|堆栈维护职责|	调用的函数从堆栈中弹出自己的参数。|
|名称修饰约定|	) 前缀为名称的 _ 下划线 (。 名称后跟符号 (@) 后跟参数列表中的十进制) (字节数。 因此，声明为 int func( int a, double b ) 的函数按如下所示进行修饰：_func@12|
|大小写转换约定	|无|