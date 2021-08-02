# PEB 结构

参考：https://docs.microsoft.com/en-us/windows/win32/api/winternl/ns-winternl-peb

PEB是windows 系统存放进程信息的结构体。

内容如下：
```c++
typedef struct _PEB {
    BYTE                          Reserved1[2];
    BYTE                          BeingDebugged;
    BYTE                          Reserved2[1];
    PVOID                         Reserved3[2]; //xp中PVOID为32位字指针
    PPEB_LDR_DATA                 Ldr;    //offset is  0x0c 或12
    PRTL_USER_PROCESS_PARAMETERS  ProcessParameters;
    PVOID                         Reserved4[3];
    PVOID                         AtlThunkSListPtr;
    PVOID                         Reserved5;
    ULONG                         Reserved6;
    PVOID                         Reserved7;
    ULONG                         Reserved8;
    ULONG                         AtlThunkSListPtr32;
    PVOID                         Reserved9[45];
    BYTE                          Reserved10[96];
    PPS_POST_PROCESS_INIT_ROUTINE PostProcessInitRoutine;
    BYTE                          Reserved11[128];
    PVOID                         Reserved12[1];
    ULONG                         SessionId;
} PEB, *PPEB;
```

64位系统中，这个结构体内容如下：
```c++
typedef struct _PEB {
    BYTE Reserved1[2];
    BYTE BeingDebugged;
    BYTE Reserved2[21];
    PPEB_LDR_DATA LoaderData;  // offset is 25 或 0x19
    PRTL_USER_PROCESS_PARAMETERS ProcessParameters;
    BYTE Reserved3[520];
    PPS_POST_PROCESS_INIT_ROUTINE PostProcessInitRoutine;
    BYTE Reserved4[136];
    ULONG SessionId;
} PEB;
```

## 内部成员

### BeingDebugged

Indicates whether the specified process is currently being debugged. The PEB structure, however, is an internal operating-system structure whose layout may change in the future. It is best to use the CheckRemoteDebuggerPresent function instead.

指示了该进程是否正在被调试。

对于PEB这一内部os结构而言，其成员布局很可能会改变，所以要判断是否正在被调试请考虑使用```CheckRemoteDebuggerPresent```。

### Ldr

A pointer to a PEB_LDR_DATA structure that contains information about the loaded modules for the process.
Ldr是一个指向 PEB_LDR_DATA 结构体的指针，这个结构体包含了为该进程导入的模块信息。例如有哪些dll。

### ProcessParameters

A pointer to an RTL_USER_PROCESS_PARAMETERS structure that contains process parameter information such as the command line.

进程参数指针，指向了 RTL_USER_PROCESS_PARAMETERS 结构体，该结构体包含了进程参数信息，例如命令行。

### SessionId

The Terminal Services session identifier associated with the current process.

当前的进程的终端服务会话标识符。

## PEB_LDR_DATA 结构体

微软docs版本：
```c++
typedef struct _PEB_LDR_DATA {
  BYTE       Reserved1[8];
  PVOID      Reserved2[3];
  LIST_ENTRY InMemoryOrderModuleList; //offset is 0x
} PEB_L
```

网上版本：
```c++
typedef struct _PEB_LDR_DATA
{
　ULONG Length; // +0x00
　BOOLEAN Initialized; // +0x04
　PVOID SsHandle; // +0x08
　LIST_ENTRY InLoadOrderModuleList; // +0x0c
　LIST_ENTRY InMemoryOrderModuleList; // +0x14
　LIST_ENTRY InInitializationOrderModuleList;// +0x1c
} PEB_LDR_DATA,*PPEB_LDR_DATA; // +0x24
```

### 成员 InMemoryOrderModuleList

The head of a doubly-linked list that contains the loaded modules for the process. Each item in the list is a pointer to an LDR_DATA_TABLE_ENTRY structure. For more information, see Remarks.

双链表头，这个链表中包含了已导入的modules。链表中的每个项目都是一个指向 LDR_DATA_TABLE_ENTRY 结构体的指针。

LIST_ENTRY 结构体定义如下：
```c++
typedef struct _LIST_ENTRY {
   struct _LIST_ENTRY *Flink;  //下一个entry的指针
   struct _LIST_ENTRY *Blink;  //前一个entry的指针
} LIST_ENTRY, *PLIST_ENTRY, *RESTRICTED_POINTER PRLIST_ENTRY;
```

### LDR_DATA_TABLE_ENTRY 结构体

The LDR_DATA_TABLE_ENTRY structure定义如下:

```c++
typedef struct _LDR_DATA_TABLE_ENTRY {
    PVOID Reserved1[2];
    LIST_ENTRY InMemoryOrderLinks; //
    PVOID Reserved2[2];
    PVOID DllBase;  
    PVOID EntryPoint; 
    PVOID Reserved3;
    UNICODE_STRING FullDllName;
    BYTE Reserved4[8];
    PVOID Reserved5[3];
    union {
        ULONG CheckSum;
        PVOID Reserved6;
    };
    ULONG TimeDateStamp;
} LDR_DATA_TABLE_ENTRY, *PLDR_DATA_TABLE_ENTRY;
```

- Minimum supported client:	Windows XP [desktop apps only]
- Minimum supported server:	Windows Server 2003 [desktop apps only]
- Header:	winternl.h