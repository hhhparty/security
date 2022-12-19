# 混合编程

与硬件直接相关的用汇编；

## C/C++ 中嵌入汇编

格式：
```c
__asm [volatile]{
    instruction [: instruction...]
}
```

限制：
- 不能直接向寄存器赋值，程序跳转要使用 `B` 或 `BL` 指令；
- 在使用物理寄存器时，不要使用过于复杂的 C 表达式，避免物理寄存器冲突；
- R12 、R13 可能被编译器使用，用于存放中间结果，计算表达式值时可能把R0～R3、R12、R14 用于子程序调用，因此避免直接使用这些寄存器。

- 尽两使用 R4、R5、R6、R7、R8.

这种方法称为内联汇编，例子如下：
```c
void my_strcpy(char *src,char *dest)
{
    /* arm汇编实现拷贝 */
    __asm{
        loop:
                LDRB ch,[src] ,#1
                STRB ch,[dest],#1
                CMP ch,#0
                BNE loop
    }
}
int main(char *argc,char argv[])
{
    char *a = "hello world.";
    char b[64];
    my_strcpy(a,b);

}
```

## C/C+ 中调用汇编程序

方法：
- 将汇编中的label 声明为 export 类型
- C语言定义 extern function
- 遵循ATPCS（Arm Thumb Procedure Call Standards）

例子：
```S
    ; MyArm.s

    AREA myarm, CODE, READONLY
    ; 这里就不写 ENTRY 了，因为有C中的main作为入口
    EXPORT my_strcpy ;将my_strcpy作为可对外使用的一个入口声明出来。
my_strcpy
loop
    LDRB R4, [R0],#1 ;R0 作为传参数的寄存器，存放源字符串的地址
    CMP R4, #0 ;比较是否为'\0'结束
    BEQ over
    STRB R4, [R1],#1
    B loop
over
    END

```

```c
/*虽然汇编中没有定义参数，但默认使用R0～R3存放参数，R0存放第一个参数，R1存放第二个参数...,返回值被放入R0*/
export my_strcpy(char * src,char *dest);
int main(char *argc,char argv[])
{
    char *a = "hello world.";
    char b[64];
    my_strcpy(a,b);

}
```

## 汇编中调用C/C++
**这种情况是比较常见的，特别是bootloader中会常用这种方式。**


步骤：
- C语言定义函数
- 汇编程序 import 函数名
- BL 跳转到函数

例子：
```s
    AREA myARM , CODE, READONLY
    IMPORT cFun ;引入C函数名
    ENTRY
start
    MOV R0, #1
    MOV R1, #2
    MOV R2, #3
    BL cFun
    MOV R4, R0
    END
```

```c
int cFun(int a,int b,int c)
{
    return a+b+c;
}

```
