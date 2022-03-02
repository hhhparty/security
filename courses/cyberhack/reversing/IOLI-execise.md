# IOLI Reversing Execise

IOLI CRACKME v1.2  

Goal: Crack the executable files to accept any password.

## Level 0x00 Strings is your friend

```sh
file ./crackme0x00
./crackme0x00: ELF 32-bit LSB executable, Intel 80386, version 1 (SYSV), dynamically linked, interpreter /lib/ld-linux.so.2, for GNU/Linux 2.6.9, not stripped
                                 
$ rabin2 -I ./crackme0x00
arch     x86
baddr    0x8048000
binsz    7537
bintype  elf
bits     32
canary   false
class    ELF32
compiler GCC: (GNU) 3.4.6 (Gentoo 3.4.6-r2, ssp-3.4.6-1.0, pie-8.7.10)
crypto   false
endian   little
havecode true
intrp    /lib/ld-linux.so.2
laddr    0x0
lang     c
linenum  true
lsyms    true
machine  Intel 80386
maxopsz  16
minopsz  1
nx       true
os       linux
pcalign  0
pic      false
relocs   true
relro    partial
rpath    NONE
sanitiz  false
static   false
stripped false
subsys   linux
va       true                      

```

The challenge 比较简单，使用 linux下strings或r2 中的`iz`命令，都可以发现有一个特殊的字符串：250382

运行程序：
```sh
$ ./crackme0x00
IOLI Crackme Level 0x00
Password: 250382
Password OK :)
```

## level0x01 5274

先对文件做初步分析，例如使用 readelf 、file 、strings、rabin2 等查看。

下面使用`r2 -A ./crack0x01` 进入 r2后：

```S
[0x08048330]> ieq
0x08048330

[0x08048330]> afl~main
0x080482fc    1 6            sym.imp.__libc_start_main
0x080483e4    4 113          main
[0x08048330]> s main
[0x080483e4]> pdf
; DATA XREF from entry0 @ 0x8048347
┌ 113: int main (int argc, char **argv, char **envp);
│           ; var uint32_t var_4h @ ebp-0x4
│           ; var int32_t var_sp_4h @ esp+0x4
│           0x080483e4      55             push ebp
│           0x080483e5      89e5           mov ebp, esp
│           0x080483e7      83ec18         sub esp, 0x18
│           0x080483ea      83e4f0         and esp, 0xfffffff0
│           0x080483ed      b800000000     mov eax, 0
│           0x080483f2      83c00f         add eax, 0xf                ; 15
│           0x080483f5      83c00f         add eax, 0xf                ; 15
│           0x080483f8      c1e804         shr eax, 4
│           0x080483fb      c1e004         shl eax, 4
│           0x080483fe      29c4           sub esp, eax
│           0x08048400      c70424288504.  mov dword [esp], str.IOLI_Crackme_Level_0x01_n ; [0x8048528:4]=0x494c4f49 ; "IOLI Crackme Level 0x01\n" ; const char *format
│           0x08048407      e810ffffff     call sym.imp.printf         ; int printf(const char *format)
│           0x0804840c      c70424418504.  mov dword [esp], str.Password:_ ; [0x8048541:4]=0x73736150 ; "Password: " ; const char *format
│           0x08048413      e804ffffff     call sym.imp.printf         ; int printf(const char *format)
│           0x08048418      8d45fc         lea eax, [var_4h]
│           0x0804841b      89442404       mov dword [var_sp_4h], eax
│           0x0804841f      c704244c8504.  mov dword [esp], 0x804854c  ; [0x804854c:4]=0x49006425 ; const char *format
│           0x08048426      e8e1feffff     call sym.imp.scanf          ; int scanf(const char *format)
│           0x0804842b      817dfc9a1400.  cmp dword [var_4h], 0x149a
│       ┌─< 0x08048432      740e           je 0x8048442
│       │   0x08048434      c704244f8504.  mov dword [esp], str.Invalid_Password__n ; [0x804854f:4]=0x61766e49 ; "Invalid Password!\n" ; const char *format
│       │   0x0804843b      e8dcfeffff     call sym.imp.printf         ; int printf(const char *format)
│      ┌──< 0x08048440      eb0c           jmp 0x804844e
│      ││   ; CODE XREF from main @ 0x8048432
│      │└─> 0x08048442      c70424628504.  mov dword [esp], str.Password_OK_:__n ; [0x8048562:4]=0x73736150 ; "Password OK :)\n" ; const char *format
│      │    0x08048449      e8cefeffff     call sym.imp.printf         ; int printf(const char *format)
│      │    ; CODE XREF from main @ 0x8048440
│      └──> 0x0804844e      b800000000     mov eax, 0
│           0x08048453      c9             leave
└           0x08048454      c3             ret

```

可以看到，在上面语句中，显示提示输入密码，然后接收输入，然后比较，比较的语句是：`0x0804842b      817dfc9a1400.  cmp dword [var_4h], 0x149a`，0x149a 是个常数，变为十进制为5274。尝试直接运行 cracke0x01 ，在提示输入密码时输入5274，发现密码正确。

```sh
$ ./crackme0x01          
IOLI Crackme Level 0x01
Password: 5274
Password OK :)
```

## level0x02 ((10*9)+(123*4))^2

这个练习也比较简单，仍然使用 `r2` 打开

```S
[0x080483e6]> s main
[0x080483e4]> pdf
            ; DATA XREF from entry0 @ 0x8048347
┌ 144: int main (int argc, char **argv, char **envp);
│           ; var uint32_t var_ch @ ebp-0xc
│           ; var signed int var_8h @ ebp-0x8
│           ; var int32_t var_4h @ ebp-0x4
│           ; var int32_t var_sp_4h @ esp+0x4
│           0x080483e4      55             push ebp
│           0x080483e5      89e5           mov ebp, esp
│           0x080483e7      83ec18         sub esp, 0x18
│           0x080483ea      83e4f0         and esp, 0xfffffff0
│           0x080483ed      b800000000     mov eax, 0
│           0x080483f2      83c00f         add eax, 0xf                ; 15
│           0x080483f5      83c00f         add eax, 0xf                ; 15
│           0x080483f8      c1e804         shr eax, 4
│           0x080483fb      c1e004         shl eax, 4
│           0x080483fe      29c4           sub esp, eax
│           0x08048400      c70424488504.  mov dword [esp], str.IOLI_Crackme_Level_0x02_n ; [0x8048548:4]=0x494c4f49 ; "IOLI Crackme Level 0x02\n" ; const char *format
│           0x08048407      e810ffffff     call sym.imp.printf         ; int printf(const char *format)
│                                                                      ; int printf(NULL)
│           0x0804840c      c70424618504.  mov dword [esp], str.Password:_ ; [0x8048561:4]=0x73736150 ; "Password: " ; const char *format
│           0x08048413      e804ffffff     call sym.imp.printf         ; int printf(const char *format)
│                                                                      ; int printf(NULL)
│           0x08048418      8d45fc         lea eax, [var_4h]
│           0x0804841b      89442404       mov dword [var_sp_4h], eax
│           0x0804841f      c704246c8504.  mov dword [esp], 0x804856c  ; [0x804856c:4]=0x50006425 ; const char *format
│           0x08048426      e8e1feffff     call sym.imp.scanf          ; int scanf(const char *format)
│                                                                      ; int scanf(NULL)
│           0x0804842b      c745f85a0000.  mov dword [var_8h], 0x5a    ; 'Z' ; 90
│           0x08048432      c745f4ec0100.  mov dword [var_ch], 0x1ec   ; 492
│           0x08048439 b    8b55f4         mov edx, dword [var_ch]
│           0x0804843c      8d45f8         lea eax, [var_8h]
│           0x0804843f      0110           add dword [eax], edx
│           0x08048441      8b45f8         mov eax, dword [var_8h]
│           0x08048444      0faf45f8       imul eax, dword [var_8h]
│           0x08048448      8945f4         mov dword [var_ch], eax
│           0x0804844b      8b45fc         mov eax, dword [var_4h]
│           0x0804844e      3b45f4         cmp eax, dword [var_ch]
│       ┌─< 0x08048451      750e           jne 0x8048461               ; unlikely
│       │   0x08048453      c704246f8504.  mov dword [esp], str.Password_OK_:__n ; [0x804856f:4]=0x73736150 ; "Password OK :)\n" ; const char *format
│       │   0x0804845a      e8bdfeffff     call sym.imp.printf         ; int printf(const char *format)
│       │                                                              ; int printf(NULL)
│      ┌──< 0x0804845f      eb0c           jmp 0x804846d
│      ││   ; CODE XREF from main @ 0x8048451
│      │└─> 0x08048461      c704247f8504.  mov dword [esp], str.Invalid_Password__n ; [0x804857f:4]=0x61766e49 ; "Invalid Password!\n" ; const char *format
│      │    0x08048468      e8affeffff     call sym.imp.printf         ; int printf(const char *format)
│      │                                                               ; int printf(NULL)
│      │    ; CODE XREF from main @ 0x804845f
│      └──> 0x0804846d      b800000000     mov eax, 0
│           0x08048472      c9             leave                       ; esp
└           0x08048473      c3             ret
[0x080483e4]> 

```

观察中间指令地址 0x0804842b～0x0804844e ，这一段做了一系列运算，大致是 （90+492）*（90+492）=338724，然后将用户输入的密码作为整数与338724比较，相等则正确。

所以这里密码即为 338724。

##  Level 0x03: same password as in level 0x02

使用r2 查看 main函数：
```S
 0x080484cc      8d45fc         lea eax, [var_4h]
│           0x080484cf      89442404       mov dword [var_sp_4h], eax
│           0x080484d3      c70424348604.  mov dword [esp], 0x8048634  ; [0x8048634:4]=0x6425
│           0x080484da      e851feffff     call sym.imp.scanf          ; int scanf(const char *format)
│           0x080484df      c745f85a0000.  mov dword [var_8h], 0x5a    ; 'Z' ; 90
│           0x080484e6      c745f4ec0100.  mov dword [var_ch], 0x1ec   ; 492
│           0x080484ed      8b55f4         mov edx, dword [var_ch]
│           0x080484f0      8d45f8         lea eax, [var_8h]
│           0x080484f3      0110           add dword [eax], edx
│           0x080484f5      8b45f8         mov eax, dword [var_8h]
│           0x080484f8      0faf45f8       imul eax, dword [var_8h]
│           0x080484fc      8945f4         mov dword [var_ch], eax
│           0x080484ff      8b45f4         mov eax, dword [var_ch]
│           0x08048502      89442404       mov dword [var_sp_4h], eax
│           0x08048506      8b45fc         mov eax, dword [var_4h]
│           0x08048509      890424         mov dword [esp], eax
│           0x0804850c      e85dffffff     call sym.test

```

说明：
- 在 call sym.test 之前，计算了$(90+492)*(90+492)=338724$。

接下来看看sym.test

```S
[0x08048498]> s sym.test;pdf
            ; CALL XREF from main @ 0x804850c
┌ 42: sym.test (int32_t arg_8h, int32_t arg_ch);
│           ; arg int32_t arg_8h @ ebp+0x8
│           ; arg int32_t arg_ch @ ebp+0xc
│           0x0804846e      55             push ebp
│           0x0804846f      89e5           mov ebp, esp
│           0x08048471      83ec08         sub esp, 8
│           0x08048474      8b4508         mov eax, dword [arg_8h]
│           0x08048477      3b450c         cmp eax, dword [arg_ch]
│       ┌─< 0x0804847a      740e           je 0x804848a
│       │   0x0804847c      c70424ec8504.  mov dword [esp], str.LqydolgSdvvzrug_ ; [0x80485ec:4]=0x6479714c ; "Lqydolg#Sdvvzrug$"
│       │   0x08048483      e88cffffff     call sym.shift
│      ┌──< 0x08048488      eb0c           jmp 0x8048496
│      │└─> 0x0804848a      c70424fe8504.  mov dword [esp], str.SdvvzrugRN____ ; [0x80485fe:4]=0x76766453 ; "Sdvvzrug#RN$$$#=,"
│      │    0x08048491      e87effffff     call sym.shift
│      │    ; CODE XREF from sym.test @ 0x8048488
│      └──> 0x08048496      c9             leave
└           0x08048497      c3             ret

```

说明：
- 上面的代码首先比较了用户输入密码与338724，
- 如果相同，则跳到 0x804848a 处，然后调用 sym.shift；
- 如果不同，则跳到 0x8048496 处，然后调用 sym.shift.

sym.shift 做了一个转换：
- 若是户输入密码与338724相同，则将字符串"Lqydolg#Sdvvzrug$"，转换为“Invalid Password！”
- 若是户输入密码与338724不同，则将字符串"Sdvvzrug#RN$$$#=,"，转换为“Password OK!!! :)”


所以密码就是338724。


## level0x4
查看其中重要的函数 check：
```S
sym.check (int32_t arg_8h);
│           ; var int32_t var_dh @ ebp-0xd
│           ; var int32_t var_ch @ ebp-0xc
│           ; var int32_t var_8h @ ebp-0x8
│           ; var int32_t var_4h @ ebp-0x4
│           ; arg int32_t arg_8h @ ebp+0x8
│           ; var int32_t var_sp_4h @ esp+0x4
│           ; var int32_t var_sp_8h @ esp+0x8
│           0x08048484      55             push ebp
│           0x08048485      89e5           mov ebp, esp
│           0x08048487      83ec28         sub esp, 0x28
│           0x0804848a      c745f8000000.  mov dword [var_8h], 0
│           0x08048491      c745f4000000.  mov dword [var_ch], 0
│           ; CODE XREF from sym.check @ 0x80484f9
│       ┌─> 0x08048498      8b4508         mov eax, dword [arg_8h]
│       ╎   0x0804849b      890424         mov dword [esp], eax
│       ╎   0x0804849e      e8e1feffff     call sym.imp.strlen         ; size_t strlen(const char *s)
│       ╎   0x080484a3      3945f4         cmp dword [var_ch], eax
│      ┌──< 0x080484a6      7353           jae 0x80484fb
│      │╎   0x080484a8      8b45f4         mov eax, dword [var_ch]
│      │╎   0x080484ab      034508         add eax, dword [arg_8h]
│      │╎   0x080484ae      0fb600         movzx eax, byte [eax]
│      │╎   0x080484b1      8845f3         mov byte [var_dh], al
│      │╎   0x080484b4      8d45fc         lea eax, [var_4h]
│      │╎   0x080484b7      89442408       mov dword [var_sp_8h], eax
│      │╎   0x080484bb      c74424043886.  mov dword [var_sp_4h], 0x8048638 ; [0x8048638:4]=0x50006425
│      │╎   0x080484c3      8d45f3         lea eax, [var_dh]
│      │╎   0x080484c6      890424         mov dword [esp], eax
│      │╎   0x080484c9      e8d6feffff     call sym.imp.sscanf         ; int sscanf(const char *s, const char *format,   ...)
│      │╎   0x080484ce      8b55fc         mov edx, dword [var_4h]
│      │╎   0x080484d1      8d45f8         lea eax, [var_8h]
│      │╎   0x080484d4      0110           add dword [eax], edx
│      │╎   0x080484d6      837df80f       cmp dword [var_8h], 0xf
│     ┌───< 0x080484da      7518           jne 0x80484f4
│     ││╎   0x080484dc      c704243b8604.  mov dword [esp], str.Password_OK__n ; [0x804863b:4]=0x73736150 ; "Password OK!\n"
│     ││╎   0x080484e3      e8acfeffff     call sym.imp.printf         ; int printf(const char *format)
│     ││╎   0x080484e8      c70424000000.  mov dword [esp], 0
│     ││╎   0x080484ef      e8c0feffff     call sym.imp.exit           ; void exit(int status)
│     └───> 0x080484f4      8d45f4         lea eax, [var_ch]
│      │╎   0x080484f7      ff00           inc dword [eax]
│      │└─< 0x080484f9      eb9d           jmp 0x8048498
│      └──> 0x080484fb      c70424498604.  mov dword [esp], str.Password_Incorrect__n ; [0x8048649:4]=0x73736150 ; "Password Incorrect!\n"
│           0x08048502      e88dfeffff     call sym.imp.printf         ; int printf(const char *format)
│           0x08048507      c9             leave
└           0x08048508      c3             ret

```

通过逆向分析，可知该函数主要执行类似下列伪代码：
```py
var_8h = 0
for var_ch in range(0, len(input_password)):
    var_8h += int(input_password[var_ch])
    if var_8h == 15:
        print("Password OK!")
```
所以用户输入的密码应为一组数字，且和应为15，例如12345.

## level0x5
这个challenge 通过逆向分析，与上例类似，但它要求和必须为16，且又通过sym.parell函数检查了输入字符串末位是否为0 ，若为0 则正确，例如我们给一个密码：1234510 即满足条件。

> 在这个例子中，我尝试了r2 可视化模式下按C进入 cursor 模式 。

## level0x6

- 该Challenge 与 0x5类似，在 sym.check 中输入密码应全为数字字符，依次转换为数字后求和应为16；
- 然后在 sym.parrel,在该函数中将输入字符串转换为整数；例如“123451”转变为整数123451，
- 然后又在   sym.dummy 这个函数中将执行文件的环境变量字符串与“LOL” 进行比较，若环境变量中存在这个“LOL”，那么就通过了dummy的检查，否则认为无效。
- 回到 sym.parrel 函数，比较 “123451”的最后一位是否为0，若是则认为是正确的密码

综上，现在设置一个环境变量 LOLO=any value；然后输入密码 1234510 即可。

## level0x7

此例与上例有类似处：

main 函数的参数 arg_10 = ebp + 0x10，main 函数栈帧的 ebp+0x10 位置存放了指向环境变量的指针，即 ebp = 0xff9260c8;【ebp+0x10】= 0xff9266ca; 【0xff9266ca】=“环境变量字符串”。