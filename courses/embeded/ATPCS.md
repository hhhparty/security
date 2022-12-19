# Arm Thumb Procedure Call Standards

The Arm architecture places few restrictions on how general purpose registers are used. To recap, integer registers and floating-point registers are general purpose registers. However, if you want your code to interact with code that is written by someone else, or with code that is produced by a compiler, then you need to agree rules for register usage. For the Arm architecture, these rules are called the Procedure Call Standard, or PCS.

The PCS specifies:

- 哪些寄存器用于向函数传递参数Which registers are used to pass arguments into the function.
- 那些寄存器用于返回函数值（给调用者）Which registers are used to return a value to the function doing the calling, known as the caller.
- 那些寄存器可以在被调用函数中使用？Which registers the function being called, which is known as the callee, can corrupt.
- 那些寄存器不能在被调用函数中使用？Which registers the callee cannot corrupt.
Consider a function foo(), being called from main():

:question: