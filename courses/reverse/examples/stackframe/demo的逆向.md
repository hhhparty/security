# Demo逆向分析

## 使用winxpsp3 vc6编译链接


link选项卡中 Project 选项：
```
kernel32.lib user32.lib gdi32.lib winspool.lib comdlg32.lib advapi32.lib shell32.lib ole32.lib oleaut32.lib uuid.lib odbc32.lib odbccp32.lib  kernel32.lib user32.lib gdi32.lib winspool.lib comdlg32.lib advapi32.lib shell32.lib ole32.lib oleaut32.lib uuid.lib odbc32.lib odbccp32.lib /nologo /subsystem:console /incremental:no /pdb:"Release/stackframe.pdb" /machine:I386 /out:"Release/stackframe.exe" 
```
## _cdecl 系统调用
VC6 Project C/C++选项卡中 Project选项：

- _cdecl:
```
/nologo /ML /W3 /GX /O2 /D "WIN32" /D "NDEBUG" /D "_CONSOLE" /D "_MBCS" /Fp"Release/stackframe.pch" /YX /Fo"Release/" /Fd"Release/" /FD /c 
```

```s
.text:00401000 ; =============== S U B R O U T I N E =======================================
.text:00401000
.text:00401000
.text:00401000 sub_401000      proc near               ; CODE XREF: _main+8↓p
.text:00401000
.text:00401000 arg_0           = dword ptr  4
.text:00401000 arg_4           = dword ptr  8
.text:00401000 arg_8           = dword ptr  0Ch                ; 这里在_fastcall调用约定中没有
.text:00401000 arg_C           = dword ptr  10h                ; 这里在_fastcall调用约定中没有
.text:00401000
.text:00401000                 mov     eax, [esp+arg_C]    
.text:00401004                 mov     ecx, [esp+arg_8]
.text:00401008                 mov     edx, [esp+arg_4]
.text:0040100C                 push    eax
.text:0040100D                 mov     eax, [esp+4+arg_0]
.text:00401011                 push    ecx
.text:00401012                 push    edx
.text:00401013                 push    eax
.text:00401014                 push    offset aWDXDYDZD ; "w=%d,x=%d,y=%d,z=%d"
.text:00401019                 call    _printf
.text:0040101E                 add     esp, 14h
.text:00401021                 retn                 ; 这里与_stdcall、fastcall 调用约定不同
.text:00401021 sub_401000      endp
.text:00401021
.text:00401021 ; ---------------------------------------------------------------------------
.text:00401022                 align 10h
.text:00401030
.text:00401030 ; =============== S U B R O U T I N E =======================================
.text:00401030
.text:00401030
.text:00401030 ; int __cdecl main(int argc, const char **argv, const char **envp)
.text:00401030 _main           proc near               ; CODE XREF: start+AF↓p
.text:00401030
.text:00401030 argc            = dword ptr  4
.text:00401030 argv            = dword ptr  8
.text:00401030 envp            = dword ptr  0Ch
.text:00401030
.text:00401030                 push    3
.text:00401032                 push    2
.text:00401034                 push    1                   ; 这里在_fastcall调用约定不同
.text:00401036                 push    32h ; '2'           ; 这里在_fastcall调用约定不同
.text:00401038                 call    sub_401000
.text:0040103D                 add     esp, 10h            ;  这里在_stdcall、fastcall调用约定中没有
.text:00401040                 retn
.text:00401040 _main           endp
```


## stdcall
VC6 Project C/C++选项卡中 Project选项：



- _stdcall:在_cdecl基础上增加 /Gz
```
/nologo /Gz /ML /W3 /GX /O2 /D "WIN32" /D "NDEBUG" /D "_CONSOLE" /D "_MBCS" /Fp"Release/stackframe.pch" /YX /Fo"Release/" /Fd"Release/" /FD /c 
```

```s
.text:00401000 ; =============== S U B R O U T I N E =======================================
.text:00401000
.text:00401000
.text:00401000 sub_401000      proc near               ; CODE XREF: _main+8↓p
.text:00401000
.text:00401000 arg_0           = dword ptr  4
.text:00401000 arg_4           = dword ptr  8
.text:00401000 arg_8           = dword ptr  0Ch
.text:00401000 arg_C           = dword ptr  10h
.text:00401000
.text:00401000                 mov     eax, [esp+arg_C]
.text:00401004                 mov     ecx, [esp+arg_8]
.text:00401008                 mov     edx, [esp+arg_4]
.text:0040100C                 push    eax
.text:0040100D                 mov     eax, [esp+4+arg_0]
.text:00401011                 push    ecx
.text:00401012                 push    edx
.text:00401013                 push    eax
.text:00401014                 push    offset aWDXDYDZD ; "w=%d,x=%d,y=%d,z=%d"
.text:00401019                 call    _printf
.text:0040101E                 add     esp, 14h      ; 这里与_cdecl调用约定不同，因为stdcall的函数自己负责清理堆栈
.text:00401021                 retn    10h
.text:00401021 sub_401000      endp
.text:00401021
.text:00401021 ; ---------------------------------------------------------------------------
.text:00401024                 align 10h
.text:00401030
.text:00401030 ; =============== S U B R O U T I N E =======================================
.text:00401030
.text:00401030
.text:00401030 ; int __cdecl main(int argc, const char **argv, const char **envp)
.text:00401030 _main           proc near               ; CODE XREF: start+AF↓p
.text:00401030
.text:00401030 argc            = dword ptr  4
.text:00401030 argv            = dword ptr  8
.text:00401030 envp            = dword ptr  0Ch
.text:00401030
.text:00401030                 push    3
.text:00401032                 push    2
.text:00401034                 push    1
.text:00401036                 push    32h ; '2'
.text:00401038                 call    sub_401000
.text:0040103D                 retn                    
.text:0040103D _main           endp
```


## fastcall

- fastcall: 在_cdecl基础上增加 /Gr
```
/nologo /Gr /ML /W3 /GX /O2 /D "WIN32" /D "NDEBUG" /D "_CONSOLE" /D "_MBCS" /Fp"Release/stackframe.pch" /YX /Fo"Release/" /Fd"Release/" /FD /c 
```

```s
.text:00401000 ; =============== S U B R O U T I N E =======================================
.text:00401000
.text:00401000
.text:00401000 sub_401000      proc near               ; CODE XREF: _main+E↓p
.text:00401000
.text:00401000 arg_0           = dword ptr  4
.text:00401000 arg_4           = dword ptr  8
.text:00401000
.text:00401000                 mov     eax, [esp+arg_4]
.text:00401004                 push    eax
.text:00401005                 mov     eax, [esp+4+arg_0]
.text:00401009                 push    eax
.text:0040100A                 push    edx
.text:0040100B                 push    ecx
.text:0040100C                 push    offset aWDXDYDZD ; "w=%d,x=%d,y=%d,z=%d"
.text:00401011                 call    _printf
.text:00401016                 add     esp, 14h
.text:00401019                 retn    8
.text:00401019 sub_401000      endp
.text:00401019
.text:00401019 ; ---------------------------------------------------------------------------
.text:0040101C                 align 10h
.text:00401020
.text:00401020 ; =============== S U B R O U T I N E =======================================
.text:00401020
.text:00401020
.text:00401020 ; int __cdecl main(int argc, const char **argv, const char **envp)
.text:00401020 _main           proc near               ; CODE XREF: start+AF↓p
.text:00401020
.text:00401020 argc            = dword ptr  4
.text:00401020 argv            = dword ptr  8
.text:00401020 envp            = dword ptr  0Ch
.text:00401020
.text:00401020                 push    3
.text:00401022                 push    2
.text:00401024                 mov     edx, 1
.text:00401029                 mov     ecx, 32h ; 
.text:0040102E                 call    sub_401000
.text:00401033                 retn
.text:00401033 _main           endp
```