# Basic Math

## 幂运算
使用Python pow函数可以计算幂运算：
$x^y = pow(x,y)$
## 求余运算
还可以计算幂运算后求余：
$x^y mod  z = pow(x,y,z) $

## 同余运算

两个整数a,b，它们除以整数M所得的余数相等。
## 模运算

在信息学竞赛中，当答案过于庞大的时候，我们经常会使用到模运算(Modulo Operation)来缩小答案的范围，以便输出计算得出的答案。

### 商、余数的定义
给定一个正整数p，任意一个整数n，那么一定存在等式：$n = k \times p +r$。

其中，$k,r \in Z, 0 \le r \lt p$。

则称 $k$ 为 $n$ 除以 $p$ 的商，$r$ 为 $n$ 除以 $p$ 的余数。

对于正整数 $p,a,b$，定义如下运算：
- 取模运算：$a \% p$或a mod p，表示a除以p的余数。
- 模p加法：$(a+b)\% p$，其结果是 a+b 算术和除以 p 的余数。
- 模p减法：$(a-b)\% p$，其结果是 a-b 算术差除以 p 的余数。
- 模p乘法：$(a \times b)\% p$，其结果是 a*b 算术积除以 p 的余数。
- 同余式：正整数 a，b 对 p 取模，他们的余数相同，记作：$a \equiv b (mod \space p)$

说明：$n \% p$得到的结果的正负由被除数 n 决定，与 p 无关。例如：$7 \% 4 = 3 , -7 \% 4 =-3，-7 \% -4 = -3$

#### 运算规则
模运算与基本四则运算有些相似，但是除法除外。其规则如下：
(a + b) % p = (a % p + b % p) % p
(a - b) % p = (a % p - b % p) % p
(a * b) % p = (a % p * b % p) % p
a ^ b % p = ((a % p) ^ b) % p

##### 结合律
((a + b) % p + c) = (a + (b + c) % p) % p
((a * b) % p * c) = (a * (b * c) % p) % p
#### 交换律
(a + b) % p = (b + a) % p
(a * b) % p = (b * a) % p
##### 分配律
(a + b) % p = (a % p + b % p) % p
((a + b) % p * c) % p = ((a * c) % p + (b * c) % p
##### 重要定理
若 a ≡ b (mod p)，则对于任意的 c，都有(a + c) ≡ (b + c) (mod p)
若 a ≡ b (mod p)，则对于任意的 c，都有(a * c) ≡ (b * c) (mod p)
若 a ≡ b (mod p)，c ≡ d (mod p)，则
(a + c) ≡ (b + d) (mod p)
(a - c) ≡ (b - d) (mod p)
(a * c) ≡ (b * d) (mod p)
(a / c) ≡ (b / d) (mod p)

### 逆元

模运算的除法运算规则与普通四则运算不同，那么当 a/b 的中间运算结果过大怎么办？

使用逆元可以很好解决这一问题。

#### 逆元的定义
逆元是指在数学领域群G中任意一个元 a，都在G中有唯一的逆元$a'$，具有性质 $a · a' = a' · a = e$ ( · 为该群中定义的运算)。其中，e为该群的单位元。

逆元其实是加法中的相反数以及乘法中的倒数的拓展思想。

在模运算中，单位元便是1。

a mod p的逆元便是可以使 $a * a' \space mod \space p = 1$ 的最小a'。

#### 使用方法
因为 b' 为 b 的逆元，b * b' mod p = 1；

所以 (a / b) mod p = (a * b') mod p ，但要求a | b；

这样我们便可以应用 (a * b) % p = (a % p * b % p) % p 这一条性质缩小中间运算结果了。

> 注：a | b 是什么意思？

#### 求逆元的方法
- 枚举法；
- 利用拓展欧几里得算法求解同余方程；
- 费马小定理。

##### 枚举法
枚举1到p - 1的整数bi，若b * bi % p = 1，则bi即为b mod p的乘法逆元。

为什么只枚举到p - 1呢？
- 如果枚举到 p，那么显然 b * p % p = 0;；
- 如果枚举到 p + k ( 0 < k < p)，那么有 b * (p + k) % p = b * p % p + b * k % p = b * k % p，这样就返回了枚举1到p - 1的情况；
- 如果枚举到 p + k ( k > p)，同第二种情况。

##### 拓展欧几里得(Extend - Eculid)

求最小整数x、y，使 x * a + y * b = gcd(a , b)；

>注：gcd(a,b)表示a与b的最大公约数。

类似这样的问题便可以使用拓展欧几里得来求解。

由欧几里得定理可知gcd(a , b) = gcd(b , a % b) (假设 a > b)，

所以有x' * b + y' * (a % b) = gcd(a , b)，假设已经求得 x' 和 y'，那么有 ：

∵ x' * b + y' * ( a % b) = gcd(a , b) and a % b = a - [a / b] * b

∴ x' * b + y' * ( a - [a / b] * b) = gcd(a , b)

∴ y' * a + (x' - y' * [a / b]) * b = gcd(a , b)

如此这个问题便可以递归的求解了。

（显然如果b = 0的话，那么x = 1，y = 0）

那么求解 b' 使得 b * b‘ mod p = 1 这个问题便可以转化为：

求最小整数 b'、k，使得 b' * b + k * p = 1；

##### 费马小定理(Fermat's little theorem)
假如 p 是质数，那么 a ^ (p-1) ≡ 1 (mod p) 。

推论： b ^ (p - 2) % p 即为 b mod p 的乘法逆元。

> 注意：需要b、p互质才可以使用逆元法，如果b、p不互质的话只能用(a / b) % p = (a % (b * p)) / b 来尝试解决问题了。

但是在信息竞赛中一般给出的模数均为质数，例如10 ^ 9 + 7 。
## 模逆运算

## 欧几里得

## 扩展欧几里得

## 中国剩余定理