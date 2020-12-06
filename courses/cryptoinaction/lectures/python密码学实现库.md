# Python 密码学实现库

## gmpy2

一个基于C编码的python 扩展模块，支持高精度运算（multiple-precision arithmetic）。
gmpy2支持：
- GMP for integer and rational arithmetic Home page: http://gmplib.org

- MPIR is based on the GMP library but adds support for Microsoft’s Visual Studio compiler. It is used to create the Windows binaries. Home page: http://www.mpir.org
- MPFR for correctly rounded real floating-point arithmetic Home page: http://www.mpfr.org
- MPC for correctly rounded complex floating-point arithmetic。 Home page: http://mpc.multiprecision.org
- Generalized Lucas sequences and primality tests are based on the following code: mpz_lucas: http://sourceforge.net/projects/mpzlucas/  mpz_prp: http://sourceforge.net/projects/mpzprp/


### 指南

mpz类型与python内置的 int/long 类型兼容，但是在大值计算时快很多。性能的转换点会有所不同，但可以低至 20 到 40 位。提供了多种附加的整数函数。

```
>>> import gmpy2
>>> from gmpy2 import mpz,mpq,mpfr,mpc
>>> mpz(99) * 43
mpz(4257)
>>> pow(mpz(99), 37, 59)
mpz(18)
>>> gmpy2.isqrt(99)
mpz(9)
>>> gmpy2.isqrt_rem(99)
(mpz(9), mpz(18))
>>> gmpy2.gcd(123,27)
mpz(3)
>>> gmpy2.lcm(123,27)
mpz(1107)
```

mpq类型与分数（fractions）兼容.
```
>>>mpq(3,7)/7
mpq(3,49)
>>> mpq(45,3) * mpq(11,8)
mpq(165,8)
```

gmpy2最重要的特性是基于MPFR和MPC库，支持正确的任意精度实数和附属算式。单精度点内容用于控制异常条件。例如，除数为零可以返回无限或异常。

```python
>>> mpfr(1)/7
mpfr('0.14285714285714285')
>>> gmpy2.get_context().precision=200
>>> mpfr(1)/7
mpfr('0.1428571428571428571428571428571428571428571428571428571428571',200)
>>> gmpy2.get_context()
context(precision=200, real_prec=Default, imag_prec=Default,
        round=RoundToNearest, real_round=Default, imag_round=Default,
        emax=1073741823, emin=-1073741823,
        subnormalize=False,
        trap_underflow=False, underflow=False,
        trap_overflow=False, overflow=False,
        trap_inexact=False, inexact=True,
        trap_invalid=False, invalid=False,
        trap_erange=False, erange=False,
        trap_divzero=False, divzero=False,
        trap_expbound=False,
        allow_complex=False)
>>> mpfr(1)/0
mpfr('inf')
>>> gmpy2.get_context().trap_divzero=True
>>> mpfr(1)/0
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
gmpy2.DivisionByZeroError: 'mpfr' division by zero in division
>>> gmpy2.get_context()
context(precision=200, real_prec=Default, imag_prec=Default,
        round=RoundToNearest, real_round=Default, imag_round=Default,
        emax=1073741823, emin=-1073741823,
        subnormalize=False,
        trap_underflow=False, underflow=False,
        trap_overflow=False, overflow=False,
        trap_inexact=False, inexact=True,
        trap_invalid=False, invalid=False,
        trap_erange=False, erange=False,
        trap_divzero=True, divzero=True,
        trap_expbound=False,
        allow_complex=False)
>>> gmpy2.sqrt(mpfr(-2))
mpfr('nan')
>>> gmpy2.get_context().allow_complex=True
>>> gmpy2.get_context().precision=53
>>> gmpy2.sqrt(mpfr(-2))
mpc('0.0+1.4142135623730951j')
>>>
>>> gmpy2.set_context(gmpy2.context())
>>> with gmpy2.local_context() as ctx:
...   print(gmpy2.const_pi())
...   ctx.precision+=20
...   print(gmpy2.const_pi())
...   ctx.precision+=20
...   print(gmpy2.const_pi())
...
3.1415926535897931
3.1415926535897932384628
3.1415926535897932384626433831
>>> print(gmpy2.const_pi())
3.1415926535897931
>>>
```
### 素性测试

```
gmpy2.is_prime(n) #概率性素性测试
```
### 大数分解

下面来一段大数分解的代码：
```python
from gmpy2 import *
import time
start=time.clock()
n = mpz(63281217910257742583918406571)
x = mpz(2)
y = x**2 + 1
for i in range(n):
    p = gcd(y-x,n)
    if p != 1:
        print(p)
        break
    else:
        y=(((y**2+1)%n)**2+1)%n
        x=(x**2+1)%n
end=time.clock()
print(end-start)
```
### gmpy2常见函数使用
#### 初始化大整数

import gmpy2
gmpy2.mpz(909090)

result:mpz(909090)

#### 求大整数a,b的最大公因数

import gmpy2
gmpy2.gcd(6,18)

result:mpz(6)

#### 求大整数x模m的逆元y
```
import gmpy2
#4*6 ≡ 1 mod 23
gmpy2.invert(4,23)
```
result:mpz(6)

#### 检验大整数是否为偶数

import gmpy2
gmpy2.is_even(6)

result:True

-----------
import gmpy2
gmpy2.is_even(7)

result:False

#### 检验大整数是否为奇数

import gmpy2
gmpy2.is_odd(6)

result:False

-----------
import gmpy2
gmpy2.is_odd(7)

result:True

#### 检验大整数是否为素数

import gmpy2
gmpy2.is_prime(5)

result:True

#### 求大整数x开n次根

import gmpy2
gmpy2.iroot(81,2)

result:(mpz(9),True)

#### 求整数x的y次幂模m取余

import gmpy2
#2^4 mod 5 
gmpy2.powmod(2,4,15)

result:mpz(1)