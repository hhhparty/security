# Dynamic link library 

参考资料：https://docs.microsoft.com/en-us/windows/win32/dlls/dynamic-link-libraries

- 动态链接库介绍
- 动态链接库使用
- 动态链接库参考

## 动态链接库介绍

所谓动态调用，即一个模块仅需要在调用时或运行时引入所需信息、定位某个DLL函数的调用方式。动态链接与静态连接不同，静态链接是在运行前将一个库函数拷贝到调用者程序前的引入方式。

### 动态链接类型

在DLL中有两种调用函数的方法：
- load-time dynamic linking
  - 即显示调用某个DLL 函数
- run-time dynamic linking
  - 运行时，使用 LoadLibrary或LoadLibraryEx 函数调用DLL。
  - 这个种方式通常使用返回函数指针的GetProcAddress方法。

### DLLs 和 内存管理

每个调用DLL的进程，会将DLL映射到自己的虚拟地址空间，在过程调用DLL到虚拟地址后，它就可以调用“导出的DLL函数”了。

## DllMain entry point

DLLMain入口点是指一个DLL可选的入口。当系统启动或终止某个进程或线程时，它会使用该进程的第一个线程，调用每个已调用的DLL的入口点函数。使用LoadLibrary或FreeLibrary时，也会调用这个入口点函数。

语法：

```C++
BOOL WINAPI DllMain(
  _In_ HINSTANCE hinstDLL,
  _In_ DWORD     fdwReason,
  _In_ LPVOID    lpvReserved
);
```

参数：
- hinstDLL，DLL模块的句柄，DLL的基地址。
- fdwReason，指明为什么这个DLL入口点函数被调用，可能值为：
    - DLL_PROCESS_ATTACH 或 1，表示这个DLL被LoadLibrary调入虚拟地址空间并启用。
    - DLL_PROCESS_DETACH 或 0，表示这个DLL被卸载。
    - DLL_THREAD_ATTACH 或 2
    - DLL_THREAD_DETACH 或 3
- lpvReserved，保留参数。