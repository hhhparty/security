# RSA 

## 约定
- 使用 X 或 m 表示未加密数据，即明文。
- 使用 Y 或 c 表示加密后数据，即密文。
- 使用 PK 表示公钥。
- 使用 SK 表示私钥。


## 算法原理

### 生成密钥对
- 1.准备两个大质数p和q，求出模数$n=p \times q$
- 2.求出欧拉函数$\varPhi(p,q)=(p-1)(q-1)$
- 3.求出e，e是$\varPhi(p,q)$的互质数，且$1<e<n$
- 4.求出d，$d*e \equiv 1(mod \space \varPhi(p,q)*i),i=1,2,3,4...$

### 加密过程
公钥PK=(e,n)
$Y = X ^e \space mod \space n$

```python
Y = pow(X,e,n)
```
#### python实现

```python
from Crypto.Util.number import *
import gmpy2

m = 'flag is abc'
hex_m = int(m.encode("hex"),16)

p = getPrime(500)
q = getPrime(500)
n = p*q
e = gmpy2.mpz(65537)
phi = (p-1)*(q-1)
d = gmpy2.invert(e,phi)

c = pow(hex_m,e,n)
print("Plain text is:",m)
print("Encrypted text is: ",c)
```

### 解密过程
私钥SK=(d,n)

$X = Y^d \space mod \space n$
```python
X = pow(Y,d,n)
```
#### python 实现解密

```python
import binascii
import gmpy2

n = gmpy2.mpz(83208298995174604174773590298203639360540024871256126892889661345742403314929861939100492666605647316646576486526217457006376842280)

#使用工具yafu分解n得到p和q。
p = gmpy2.mpz(780900790334269659443297956843)
q = gmpy2.mpz(1034526559407993507734818408829)
e = gmpy2.mpz(65537)
c = gmpy2.mpz(534280240)

phi = (p-1)*(q-1)
d = gmpy2.invert(e,phi)
m = pow(c,d,n)
print(hex(m))
print("Plain text is: ",binascii.unhexlify(hex(m)[2:].strip("L")))

```

### dp和dq
dp = d % (p-1)

dq = d % (q-1)

dp和dq可用于快速解密。

## RSA 破解
### 当p和q相差过大或过小是

因为n=p*q，若p和q的值相差较小，或者较大，都会造成n更容易分解。

例如，代码为
```python
p=getPrime(512)
q=gmpy2.next_prime(p)
n=p*q
```
此时，p，g很接近，可以使用yafu工具直接分解。

yafu运行后，将```factor(n)```作为输入，回车提交后即可开始运算。

或者使用网站http://factordb.com/ 查询已分解过的n。

### 当给出的多对公钥，共用了一个素数因子时
此时，可以尝试公约数分解。

例如，题目可能为：
```
p1=getPrime(512)
p2=getPrime(512)
q=getPrime(512)
n1=p1*q
n2=p2*q
```
所以当题目给了多个n，并且发现n无法分解，可以尝试是否有公约数。

#### 求公约数

求公约数可以使用欧几里得辗转相除法，实现python脚本如下
```python
def gcd(a, b):   #求最大公约数
    if a < b:
        a, b = b, a
    while b != 0:
        temp = a % b
        a = b
        b = temp
    return a
```
用例
```python
def gcd(a, b):   #求最大公约数
    if a < b:
        a, b = b, a
    while b != 0:
        temp = a % b
        a = b
        b = temp
    return a

n1=0x6c9fb4bf11344e4c818be178e3d3db352797099f929e4ba8fa86d9c4ce3d8f71e3daa8c795b67dc2dabe1e1608836904386c364ecec759c27eaa83eb93710003d4cc848e558f7b11372405c5787b60eca627372767455a5fcf30cb6c157ca5a6267d63ffa16fe49e7433136a47945de2219f46a35f2b6a58196057c602e72a0b
n2=0x46733cc071bdee0d178fb32836a6b0a2f145a681df47d31ea9d9fc5b5fa0cc7ddbcd34531aefeace9840fc890f7a111f73593c9a41886b9a6f91cde3e6f9c71821a8ad877de51f78094599209746e80635c5625459ad7ba14f926b74875c8980a9436d6bbd54e1d9da72ae200383516098c04e24f58b23b4a8142cef0c931a55
print(gcd(n1,n2))
```

使用欧几里得辗转相除得到共有的因子，然后n1和n2除以这个因子，即可得到另一个素数因子。即p1和p2。


### 已知PK={e,n}，求私钥 SK={d,n}

```python
import gmpy2
d = gmpy2.invert(e,(p-1)(q-1))
```

## CTF中有关RSA破解问题

### 已知p，q，e，求d

- 安装gmpy2库
- 使用脚本求出d

```python
import gmpy2
from Crypto.Util import number
p = 473398607161
q = 4511491
e = 17
d = gmpy2.invert(e,(p-1)*(q-1))
print (d)
```

### 已知p，q，e，密文c，求明文m

- 求解 ```d = gmpy2.invert(e,(p-1)*(q-1))```
- 求解```m=pow(c,d,n)```

### 已知n，e，密文c，求明文m
- 分解n，可参考
  - yafu.exe
  - http://factordb.com
  - http://atool.org/quality_factor.php

- 求$d=gmpy2.invert(e,(p-1)*(q-1))$
- 求解```m=pow(c,d,n)```

### 已知PK，密文c，求明文c
- 分解PK为e和n
  - 从public.pem或public.pub文件中提取e和n，可以使用openssl等工具
  - public.pcap或public.ppc文件，需要使用wireshark解读
  - 或是利用github上的rsa-wiener-attack尝试
- 计算d
- 计算m

### 已知e，n，$dp=d\%(p-1)$，$dq=d\%(q-1)$，求m

-  求出```InvQ=gmpy2.invert(q,p)```
-  求出```mp = pow(c,dp,p)```
-  求出 ```mq = pow(c,dq,q)```
-  求出```m = (((mp-mq)*InvQ) % p)*q+mq```


### 已知dp，n，e，密文c，求明文m
已知：
- c ≡ m^e mod n
- m ≡ c^d mod n
- ϕ(n) = (p−1)∗(q−1)
- d∗e ≡ 1 mod ϕ(n)
- dp ≡ d mod (p−1)

由上面可得：

- dp∗e ≡ d∗e mod (p−1)
- d∗e = k∗(p−1)+dp∗ed∗e≡1 mod ϕ(n)

我们将式1带入式2可以得到
- k∗(p−1)+dp∗e≡1 mod (p−1)∗(q−1)
故此可以得到
- k2∗(p−1)∗(q−1)+1=k1∗(p−1)+dp∗e

变换一下
- (p−1)∗[k2∗(q−1)−k1]+1=dp∗e

因为：dp < p−1
可以得到: e > k2∗(q−1)−k1
我们假设: x = k2∗(q−1)−k1
可以得到x的范围为: (0,e)
因此有: x∗(p−1)+1 = dp∗e
那么我们可以遍历 x∈(0,e) 求出p-1.

求的方法也很简单，遍历65537种可能，其中肯定有一个p可以被n整除那么求出p和q，即可利用: 

ϕ(n)=(p−1)∗(q−1)d∗e≡1 mod ϕ(n)

推出 d ≡ 1∗e−1 mod ϕ(n)

注：这里的-1为逆元，不是倒数的那个-1

实现1
```python
import gmpy2
import binascii

def getd(n,e,dp):
    for i in range(1,e):
        if (dp*e-1)%i == 0:
            if n%(((dp*e-1)/i)+1)==0:
                p=((dp*e-1)/i)+1
                q=n/(((dp*e-1)/i)+1)
                phi = (p-1)*(q-1)
                d = gmpy2.invert(e,phi)%phi
                return d

dp=0x7f1344a0b8d2858492aaf88d692b32c23ef0d2745595bc5fe68de384b61c03e8fd054232f2986f8b279a0105b7bee85f74378c7f5f35c3fd505e214c0738e1d9
n=0x5eee1b4b4f17912274b7427d8dc0c274dc96baa72e43da36ff39d452ff6f2ef0dc6bf7eb9bdab899a6bb718c070687feff517fcf5377435c56c248ad88caddad6a9cefa0ca9182daffcc6e48451d481f37e6520be384bedb221465ec7c95e2434bf76568ef81e988039829a2db43572e2fe57e5be0dc5d94d45361e96e14bd65
e=0x10001
c=0x510fd8c3f6e21dfc0764a352a2c7ff1e604e1681a3867480a070a480f722e2f4a63ca3d7a92b862955ab4be76cde43b51576a128fba49348af7a6e34b335cfdbda8e882925b20503762edf530d6cd765bfa951886e192b1e9aeed61c0ce50d55d11e343c78bb617d8a0adb7b4cf3b913ee85437191f1136e35b94078e68bee8d


d=getd(n,e,dp)
m=pow(c,d,n)
print (binascii.unhexlify(hex(m)[2:]))
```
实现2
```python
import gmpy2 as gp
e = 65537
n = gp.mpz(248254007851526241177721526698901802985832766176221609612258877371620580060433101538328030305219918697643619814200930679612109885533801335348445023751670478437073055544724280684733298051599167660303645183146161497485358633681492129668802402065797789905550489547645118787266601929429724133167768465309665906113)
dp = gp.mpz(905074498052346904643025132879518330691925174573054004621877253318682675055421970943552016695528560364834446303196939207056642927148093290374440210503657)

c = gp.mpz(140423670976252696807533673586209400575664282100684119784203527124521188996403826597436883766041879067494280957410201958935737360380801845453829293997433414188838725751796261702622028587211560353362847191060306578510511380965162133472698713063592621028959167072781482562673683090590521214218071160287665180751)

for x in range(1, e):
    if(e*dp%x==1):
        p=(e*dp-1)//x+1
        if(n%p!=0):
            continue
        q=n//p
        phin=(p-1)*(q-1)
        d=gp.invert(e, phin)
        m=gp.powmod(c, d, n)
        if(len(hex(m)[2:])%2==1):
            continue
        print('--------------')
        print(m)
        print(hex(m)[2:])
        print(bytes.fromhex(hex(m)[2:]))

```
### 已知c1、c2、e1、e1、n 的情况

```python
from gmpy2 import *
import libnum

n=22708078815885011462462049064339185898712439277226831073457888403129378547350292420267016551819052430779004755846649044001024141485283286483130702616057274698473611149508798869706347501931583117632710700787228016480127677393649929530416598686027354216422565934459015161927613607902831542857977859612596282353679327773303727004407262197231586324599181983572622404590354084541788062262164510140605868122410388090174420147752408554129789760902300898046273909007852818474030770699647647363015102118956737673941354217692696044969695308506436573142565573487583507037356944848039864382339216266670673567488871508925311154801
e1=11187289
e2=9647291
s = gcdext(e1, e2)
s1 = s[1]
s2 = -s[2]

c1=22322035275663237041646893770451933509324701913484303338076210603542612758956262869640822486470121149424485571361007421293675516338822195280313794991136048140918842471219840263536338886250492682739436410013436651161720725855484866690084788721349555662019879081501113222996123305533009325964377798892703161521852805956811219563883312896330156298621674684353919547558127920925706842808914762199011054955816534977675267395009575347820387073483928425066536361482774892370969520740304287456555508933372782327506569010772537497541764311429052216291198932092617792645253901478910801592878203564861118912045464959832566051361
c2=18702010045187015556548691642394982835669262147230212731309938675226458555210425972429418449273410535387985931036711854265623905066805665751803269106880746769003478900791099590239513925449748814075904017471585572848473556490565450062664706449128415834787961947266259789785962922238701134079720414228414066193071495304612341052987455615930023536823801499269773357186087452747500840640419365011554421183037505653461286732740983702740822671148045619497667184586123657285604061875653909567822328914065337797733444640351518775487649819978262363617265797982843179630888729407238496650987720428708217115257989007867331698397
e2=9647291
c2 = invert(c2, n)
m = (pow(c1,s1,n) * pow(c2 , s2 , n)) % n
print (m)
print (libnum.n2s(m))
```

### 加密因子e 与 $\varPhi(p,q)=(p-1)(q-1)$ 不互素

假设题目给出两组公钥n,e以及第一组、第二组加密后的密文

```
('n1=', '0xbf510b8e2b169fbce366eb15a4f6c71b370f02f2108c7feb482234a386185bce1a740fa6498e04edbdf2a639e320619d9f39d3e740ebaf578af0426bc3e851001a1d599108a08725347f6680a7f5581a32d91505023701872c3df723e8de9f201d3b17059bebff944b915045870d757eb6d6d009eb4561cc7e4b89968e4433a9L')
('e1=', '0x15d6439c6')
('c1=', '0x43e5cc4c99c3040aef2ccb0d4c45266f6b75cd7f9f1be105766689283f0886061c9cd52ac2b2b6c1b7d250c2079f354ca9b988db5556336201f3b5e489916b3b60b80c34bef8f608d7471fafaf14bee421b60630f42c5cc813356e786ff10e5efa334b8a73b7ea06afa6043f33be6a31010d306ba60516243add65c183da843aL')
('n2=', '0xba85d38d1bfc3fb281927c9246b5b771ac3344ca9fe1c2d9c793a886bffb5c84558f4a578cd5ba9e777a4e08f66d0cabe05b9aa2ae8d075778b5fbfff318a7f9b6f22e2eff6f79d8c1148941b3974f3e83a4a4f1520ad42336eddc572ec7ea04766eb798b2f1b1b52009b3eeea7741b2c55e3c7c11c5cf6a4e204c6b0d312f49L')
('e2=', '0x2c09848c6')
('c2=', '0x79ec6350649377f69b475eca83a7d9d5356a1d62e29933e9c8e2b19b4b23626a581037aba3be6d7f73d5bed049350e41c1ed4cdc3e10ee34ec576ef3449be2f7d930c759612e1c23c4db71d0e5185a80b548031e3857dd93eca4af017fcd25895fcc4e8a2b36c1dd36b8cd9cc9200e2879f025928fe346e2cfae5200e66de6ccL')
```
首先用公约数分解可以分解得到n1、n2的因子p1,q1和p2，q2;

但是发现e和φ(n)是不互为素数的，所以我们无法求出私钥d。

解题公式推导：
- $gcd(e1,(p-1)*(q1-1))$
- $gcd(e1,(p-1)*(q2-1))$

得到结果79858

也就是说，e和φ(n)不互素且具有公约数79858
- 首先我们发现n1、n2可以用公约数分解出p、q；
- 但是由于e与φ(n)不互素，所以我们无法求解得到私钥d；
- 只有当他们互素时，才能保证e的逆元d唯一存在。

公式推导过程参考博客
https://blog.csdn.net/chenzzhenguo/article/details/94339659


- 下面进行等式运算，来找到解题思路。还是要求逆元，则要找到与φ(n)互素的数。

- $gcd(e,\varPhi(n))= b$
- $ed \equiv 1 \space mod \space \varPhi(n)$
- $e = a * b$
- $abd \equiv 1 \space mod \space \varPhi(n)$
- $mab \equiv c \space mod \space n$
- $cbd \equiv mabbd \equiv mb \space mod \space n$

我们已知b=79858
从上面的推算，可得a与φ(n)互素，于是可唯一确定bd
于是求出bd
gmpy2.invert(a,φ(n))
然后想到bd/b，求出d，然后求明文。可是，经测试求出的是乱码，这个d不是我们想要的

- 想一下，给两组数据，应该有两组数据的作用，据上面的结论，我们可以得到一个同余式组
- $res_1 \equiv m^{79858} \space mod \space n_1$
- $res_2 \equiv m^{79858} \space mod \space n_2$
- 进一步推导：$res_1 \equiv m^{79858} \space mod \space p$
- $res_1 \equiv m^{79858} \space mod \space q_1$
- $res_2 \equiv m^{79858} \space mod \space q_2$

可以计算出特解m
```m=solve_crt([m1,m2,m3], [q1,q2,p])```
我们想到模n1,n2不行那模q1*q2呢，
这里res可取特值m

- $res \equiv m^{79858} \space mod \space q_1q_2$

那么问题就转化为求一个新的rsa题目
e=79858，经计算发现此时e与φ(n)=(q1-1)(q2-1)，还是有公因数2。
那么，我们参照上述思路，可得出m^2，此时直接对m开方即可。

- $c \equiv m^e \space mod \space q_1q_2$
- $e = 2*39929$
- $2*39929*d \equiv 1 \space mod \space q_1q_2$
- $m^2 \equiv c^{2d} \space mod \space q_1q_2$

实现脚本：
```python
#!/usr/bin/env python
# -*- coding:utf-8 -*-
import gmpy2
import binascii


def gcd(a, b):
    if a < b:
        a, b = b, a
    while b != 0:
        temp = a % b
        a = b
        b = temp
    return a

n1=0xbf510b8e2b169fbce366eb15a4f6c71b370f02f2108c7feb482234a386185bce1a740fa6498e04edbdf2a639e320619d9f39d3e740ebaf578af0426bc3e851001a1d599108a08725347f6680a7f5581a32d91505023701872c3df723e8de9f201d3b17059bebff944b915045870d757eb6d6d009eb4561cc7e4b89968e4433a9
n2=0xba85d38d1bfc3fb281927c9246b5b771ac3344ca9fe1c2d9c793a886bffb5c84558f4a578cd5ba9e777a4e08f66d0cabe05b9aa2ae8d075778b5fbfff318a7f9b6f22e2eff6f79d8c1148941b3974f3e83a4a4f1520ad42336eddc572ec7ea04766eb798b2f1b1b52009b3eeea7741b2c55e3c7c11c5cf6a4e204c6b0d312f49

p=gcd(n1,n2)
q1=n1//p
q2=n2//p



c1=0x43e5cc4c99c3040aef2ccb0d4c45266f6b75cd7f9f1be105766689283f0886061c9cd52ac2b2b6c1b7d250c2079f354ca9b988db5556336201f3b5e489916b3b60b80c34bef8f608d7471fafaf14bee421b60630f42c5cc813356e786ff10e5efa334b8a73b7ea06afa6043f33be6a31010d306ba60516243add65c183da843a
c2=0x79ec6350649377f69b475eca83a7d9d5356a1d62e29933e9c8e2b19b4b23626a581037aba3be6d7f73d5bed049350e41c1ed4cdc3e10ee34ec576ef3449be2f7d930c759612e1c23c4db71d0e5185a80b548031e3857dd93eca4af017fcd25895fcc4e8a2b36c1dd36b8cd9cc9200e2879f025928fe346e2cfae5200e66de6cc
e1 =0x15d6439c6
e2 =0x2c09848c6

#print(gcd(e1,(p-1)*(q1-1)))
#print(gcd(e2,(p-1)*(q2-1)))


e1=e1//gcd(e1,(p-1)*(q1-1))
e2=e2//gcd(e2,(p-1)*(q2-1))


phi1=(p-1)*(q1-1);phi2=(p-1)*(q2-1)
d1=gmpy2.invert(e1,phi1)
d2=gmpy2.invert(e2,phi2)
f1=pow(c1,d1,n1)
f2=pow(c2,d2,n2)


def GCRT(mi, ai):
    curm, cura = mi[0], ai[0]
    for (m, a) in zip(mi[1:], ai[1:]):
        d = gmpy2.gcd(curm, m)
        c = a - cura
        K = c // d * gmpy2.invert(curm // d, m // d)
        cura += curm * K
        curm = curm * m // d
        cura %= curm
    return (cura % curm, curm)


f3,lcm = GCRT([n1,n2],[f1,f2])
n3=q1*q2
c3=f3%n3
phi3=(q1-1)*(q2-1)

d3=gmpy2.invert(39929,phi3)#39929是79858//gcd((q1-1)*(q2-1),79858) 因为新的e和φ(n)还是有公因数2
m3=pow(c3,d3,n3)

if gmpy2.iroot(m3,2)[1] == 1:
    flag=gmpy2.iroot(m3,2)[0]
    print(binascii.unhexlify(hex(flag)[2:].strip("L")))
```

### 公钥n由多个素数因子组成

题目如下
```
('n=', '0xf1b234e8a03408df4868015d654dcb931f038ef4fc0be8658c9b951ee6c60d23689a1bfb151e74df0910fa1cf8a542282a65')
('e=', '0x10001')
('c=', '0x22fda6137013bac19754f78e8d9658498017f05a4b0814f2af97dc2c60fdc433d2949ea27b13337961ef3c4cf27452ad3c95')
```

因为这题的公钥n是由四个素数相乘得来的，
其中四个素数的值相差较小，或者较大，都会造成n更容易分解的结果

例如出题如下
```
p=getPrime(100)
q=gmpy2.next_prime(p)
r=gmpy2.next_prime(q)
s=gmpy2.next_prime(r)
n=p*q*r*s
```
因为p、q、r、s十分接近，所以可以使用yafu直接分解.

公钥n由多素数相乘解题脚本
```python
import binascii
import gmpy2
p=1249559655343546956371276497499
q=1249559655343546956371276497489
r=1249559655343546956371276497537
s=1249559655343546956371276497423
e=0x10001
c=0x22fda6137013bac19754f78e8d9658498017f05a4b0814f2af97dc2c60fdc433d2949ea27b13337961ef3c4cf27452ad3c95
n=p*q*r*s

phi=(p-1)*(q-1)*(r-1)*(s-1)
d=gmpy2.invert(e,phi)
m=pow(c,d,n)
print(binascii.unhexlify(hex(m)[2:].strip("L")))
```

### 小明文攻击

小明文攻击是基于低加密指数的，主要分成两种情况。

#### 明文过小，导致明文的e次方仍然小于n
```
('n=', '0xad03794ef170d81aad370dccb7b92af7d174c10e0ae9ddc99b7dc5f93af6c65b51cc9c40941b002c7633caf8cd50e1b73aa942c8488d46c0032064306de388151814982b6d35b4e2a62dd647f527b31b4f826c36848dc52999574a8694460e1b59b4e96bda1341d3ba5f991f0000a56004d47681ecfd37a5e64bd198617f8dadL')
('e=', '0x3')
('c=', '0x10652cdf6f422470ea251f77L')
```

这种情况直接对密文e次开方，即可得到明文

解题脚本
```
import binascii
import gmpy2
n=0xad03794ef170d81aad370dccb7b92af7d174c10e0ae9ddc99b7dc5f93af6c65b51cc9c40941b002c7633caf8cd50e1b73aa942c8488d46c0032064306de388151814982b6d35b4e2a62dd647f527b31b4f826c36848dc52999574a8694460e1b59b4e96bda1341d3ba5f991f0000a56004d47681ecfd37a5e64bd198617f8dad
e=0x3
c=0x10652cdf6f422470ea251f77

m=gmpy2.iroot(c, 3)[0]
print(binascii.unhexlify(hex(m)[2:].strip("L")))
```
#### 明文的三次方虽然比n大，但是大不了多少
```
('n=', '0x9683f5f8073b6cd9df96ee4dbe6629c7965e1edd2854afa113d80c44f5dfcf030a18c1b2ff40575fe8e222230d7bb5b6dd8c419c9d4bca1a7e84440a2a87f691e2c0c76caaab61492db143a61132f584ba874a98363c23e93218ac83d1dd715db6711009ceda2a31820bbacaf1b6171bbaa68d1be76fe986e4b4c1b66d10af25L')
('e=', '0x3')
('c=', '0x8541ee560f77d8fe536d48eab425b0505e86178e6ffefa1b0c37ccbfc6cb5f9a7727baeb3916356d6fce3205cd4e586a1cc407703b3f709e2011d7b66eaaeea9e381e595b4d515c433682eb3906d9870fadbffd0695c0168aa26447f7a049c260456f51e937ce75b74e5c3c2bd7709b981898016a3a18f15ae99763ff40805aaL')
```

爆破即可，每次加上一个n
```
i = 0
while 1:
    res = iroot(c+i*n,3)
    if(res[1] == True):
        print res
        break
    print "i="+str(i)
    i = i+1
```
完整脚本
```
import binascii
import gmpy2

n=0x9683f5f8073b6cd9df96ee4dbe6629c7965e1edd2854afa113d80c44f5dfcf030a18c1b2ff40575fe8e222230d7bb5b6dd8c419c9d4bca1a7e84440a2a87f691e2c0c76caaab61492db143a61132f584ba874a98363c23e93218ac83d1dd715db6711009ceda2a31820bbacaf1b6171bbaa68d1be76fe986e4b4c1b66d10af25
e=0x3
c=0x8541ee560f77d8fe536d48eab425b0505e86178e6ffefa1b0c37ccbfc6cb5f9a7727baeb3916356d6fce3205cd4e586a1cc407703b3f709e2011d7b66eaaeea9e381e595b4d515c433682eb3906d9870fadbffd0695c0168aa26447f7a049c260456f51e937ce75b74e5c3c2bd7709b981898016a3a18f15ae99763ff40805aa

i = 0
while 1:
    res = gmpy2.iroot(c+i*n,3)
    if(res[1] == True):
        m=res[0]
        print(binascii.unhexlify(hex(m)[2:].strip("L")))
        break
    print "i="+str(i)
    i = i+1
```

### 低加密指数广播攻击
如果选取的加密指数较低，并且使用了相同的加密指数给一个接受者的群发送相同的信息，那么可以进行广播攻击得到明文。
这个识别起来比较简单，一般来说都是给了三组加密的参数和明密文，其中题目很明确地能告诉你这三组的明文都是一样的，并且e都取了一个较小的数字。

```
('n=', '0x683fe30746a91545a45225e063e8dc64d26dbf98c75658a38a7c9dfd16dd38236c7aae7de5cbbf67056c9c57817fd3da79dc4955217f43caefde3b56a46acf5dL', 'e=', '0x7', 'c=', '0x673c72ace143441c07cba491074163c003f1a550eab56b1255e5ea9fa2bbd68fd6a9ccb48db9fd66d5dfc6a55c79cad3d9de53f700a1e3c2a29731dc56ba43cdL')
('n=', '0xa39292e6ad271bb6a2d1345940dfab8001a53d28bc7468f285d2873d784004c2653549c589dae91c6d8238977ff1c4bea4f17d424a0fc4d5587661cc7dde3a77L', 'e=', '0x7', 'c=', '0x6111357d180d966a495f38566ebe4ea51fa0d54159b22bbd443cde9387687d87c08638483b39221883453a5ad09f6a0e3726b214e8e333037d178a3d0f125343L')
('n=', '0x52c32366d84d34564a5fdc1650fc401c41ad2a63a2d6ef57c32c7887bb25da9d42c0acfb887c6334c938839c9a43aca93b2c7468915d1846576f92c342046d1fL', 'e=', '0x7', 'c=', '0x26cd2225c0229b6a3f1d1d685e53d114aa3d792737d040fbc14189336ac12fb780872792b0c0b259847badffd1427897ede0d60247aa5e79633f27ccb43e7cc2L')
解题脚本
import binascii,gmpy2

n =  [
0x683fe30746a91545a45225e063e8dc64d26dbf98c75658a38a7c9dfd16dd38236c7aae7de5cbbf67056c9c57817fd3da79dc4955217f43caefde3b56a46acf5d,
0xa39292e6ad271bb6a2d1345940dfab8001a53d28bc7468f285d2873d784004c2653549c589dae91c6d8238977ff1c4bea4f17d424a0fc4d5587661cc7dde3a77,
0x52c32366d84d34564a5fdc1650fc401c41ad2a63a2d6ef57c32c7887bb25da9d42c0acfb887c6334c938839c9a43aca93b2c7468915d1846576f92c342046d1f
]
c =  [
0x673c72ace143441c07cba491074163c003f1a550eab56b1255e5ea9fa2bbd68fd6a9ccb48db9fd66d5dfc6a55c79cad3d9de53f700a1e3c2a29731dc56ba43cd,
0x6111357d180d966a495f38566ebe4ea51fa0d54159b22bbd443cde9387687d87c08638483b39221883453a5ad09f6a0e3726b214e8e333037d178a3d0f125343,
0x26cd2225c0229b6a3f1d1d685e53d114aa3d792737d040fbc14189336ac12fb780872792b0c0b259847badffd1427897ede0d60247aa5e79633f27ccb43e7cc2
]
def CRT(mi, ai):
    assert(reduce(gmpy2.gcd,mi)==1)
    assert (isinstance(mi, list) and isinstance(ai, list))
    M = reduce(lambda x, y: x * y, mi)
    ai_ti_Mi = [a * (M / m) * gmpy2.invert(M / m, m) for (m, a) in zip(mi, ai)]
    return reduce(lambda x, y: x + y, ai_ti_Mi) % M
e=0x7
m=gmpy2.iroot(CRT(n, c), e)[0]
print(binascii.unhexlify(hex(m)[2:].strip("L")))
```

### 低解密指数攻击
场景介绍
主要利用的是私钥d很小，表现形式一般是e很大
```
n = 9247606623523847772698953161616455664821867183571218056970099751301682205123115716089486799837447397925308887976775994817175994945760278197527909621793469
e = 27587468384672288862881213094354358587433516035212531881921186101712498639965289973292625430363076074737388345935775494312333025500409503290686394032069
```
攻击脚本
github上有开源的攻击代码https://github.com/pablocelayes/rsa-wiener-attack

求解得到私钥d

```
def rational_to_contfrac (x, y):
    ''' 
    Converts a rational x/y fraction into
    a list of partial quotients [a0, ..., an] 
    '''
    a = x//y
    if a * y == x:
        return [a]
    else:
        pquotients = rational_to_contfrac(y, x - a * y)
        pquotients.insert(0, a)
        return pquotients
def convergents_from_contfrac(frac):    
    '''
    computes the list of convergents
    using the list of partial quotients 
    '''
    convs = [];
    for i in range(len(frac)):
        convs.append(contfrac_to_rational(frac[0:i]))
    return convs

def contfrac_to_rational (frac):
    '''Converts a finite continued fraction [a0, ..., an]
     to an x/y rational.
     '''
    if len(frac) == 0:
        return (0,1)
    elif len(frac) == 1:
        return (frac[0], 1)
    else:
        remainder = frac[1:len(frac)]
        (num, denom) = contfrac_to_rational(remainder)
        # fraction is now frac[0] + 1/(num/denom), which is 
        # frac[0] + denom/num.
        return (frac[0] * num + denom, num)

def egcd(a,b):
    '''
    Extended Euclidean Algorithm
    returns x, y, gcd(a,b) such that ax + by = gcd(a,b)
    '''
    u, u1 = 1, 0
    v, v1 = 0, 1
    while b:
        q = a // b
        u, u1 = u1, u - q * u1
        v, v1 = v1, v - q * v1
        a, b = b, a - q * b
    return u, v, a

def gcd(a,b):
    '''
    2.8 times faster than egcd(a,b)[2]
    '''
    a,b=(b,a) if a<b else (a,b)
    while b:
        a,b=b,a%b
    return a

def modInverse(e,n):
    '''
    d such that de = 1 (mod n)
    e must be coprime to n
    this is assumed to be true
    '''
    return egcd(e,n)[0]%n

def totient(p,q):
    '''
    Calculates the totient of pq
    '''
    return (p-1)*(q-1)

def bitlength(x):
    '''
    Calculates the bitlength of x
    '''
    assert x >= 0
    n = 0
    while x > 0:
        n = n+1
        x = x>>1
    return n


def isqrt(n):
    '''
    Calculates the integer square root
    for arbitrary large nonnegative integers
    '''
    if n < 0:
        raise ValueError('square root not defined for negative numbers')

    if n == 0:
        return 0
    a, b = divmod(bitlength(n), 2)
    x = 2**(a+b)
    while True:
        y = (x + n//x)//2
        if y >= x:
            return x
        x = y


def is_perfect_square(n):
    '''
    If n is a perfect square it returns sqrt(n),

    otherwise returns -1
    '''
    h = n & 0xF; #last hexadecimal "digit"

    if h > 9:
        return -1 # return immediately in 6 cases out of 16.

    # Take advantage of Boolean short-circuit evaluation
    if ( h != 2 and h != 3 and h != 5 and h != 6 and h != 7 and h != 8 ):
        # take square root if you must
        t = isqrt(n)
        if t*t == n:
            return t
        else:
            return -1

    return -1

def hack_RSA(e,n):
    frac = rational_to_contfrac(e, n)
    convergents = convergents_from_contfrac(frac)

    for (k,d) in convergents:
        #check if d is actually the key
        if k!=0 and (e*d-1)%k == 0:
            phi = (e*d-1)//k
            s = n - phi + 1
            # check if the equation x^2 - s*x + n = 0
            # has integer roots
            discr = s*s - 4*n
            if(discr>=0):
                t = is_perfect_square(discr)
                if t!=-1 and (s+t)%2==0:
                    print("\nHacked!")
                    return d

def main():
    n = 9247606623523847772698953161616455664821867183571218056970099751301682205123115716089486799837447397925308887976775994817175994945760278197527909621793469
    e = 27587468384672288862881213094354358587433516035212531881921186101712498639965289973292625430363076074737388345935775494312333025500409503290686394032069
    d=hack_RSA(e,n)
    print ("d=")
    print (d)

if __name__ == '__main__':
    main()
```

### 共模攻击

场景介绍
识别：若干次加密，e不同，n相同，m相同。就可以在不分解n和求d的前提下，解出明文m。
```
('n=', '0xc42b9d872f8ecf90b4832199771bbd8d9bafb213747d905a644baa42144f316dc224e7914f8a5d361eeab930adf5ea7fbe1416e58b3fae34ca7e6d2a3145e04af02cf5a4f14539fff032bccd7bb9cf85b12d7d36dbc870b57e11aa5704304d08eff685fe4ccd707e308dfac6a1167d79199ffa9396c4f2efb4770256253d1407L')
('e1=', '0xc21000af014a98b2455dec479L')
('e2=', '0x9935842d63b75899ddd81b467L')
('c1=', '0xc0204d515a275954bbc8390d80efa1cca3bb29724ed7ba18f861913e28b6400298603b920d484284ad9c1c175587496300355395cb06b32603e779ec9b97f7eea6bb0de42c54f7f60e6e1171496efef0de8048e6074658084d080bd346db426888084e6dd45cb89b283247443de75328d47f9bd64adbd9be86043c6d13c7ed41L')
('c2=', '0xc4053ed3455c15174e5699ab6eb09b830a98b79e92e7518b713e828faca4d6d02306a65a8ec70893ca8a56943a7074e6de8649f099164cad33b8ca93fce1656f0712b990cce06642250c52a80d19c2afa94a4e158139028ac89c811e6be8d7b6984b6c1edcdd752e4955e3a6f1ab38cf2edb4474a80e03d6c313eb8ebf4e98ccL')
```

推导过程
首先，两个加密指数互质：
gcd(e1,e2)=1

即存在s1、s2使得：
s1+*e1+s2*e2=1

又因为：
c1≡m^e1 mod n
c2≡m mod n

代入化简可得：
c1^s1 * c2^s2 ≡ m mod n

即可求出明文
公式的python实现如下
```
def egcd(a, b):
    if a == 0:
      return (b, 0, 1)
    else:
      g, y, x = egcd(b % a, a)
      return (g, x - (b // a) * y, y)
def modinv(a, m):
    g, x, y = egcd(a, m)
    if g != 1:
      raise Exception('modular inverse does not exist')
    else:
      return x % m
s = egcd(e1, e2)
s1 = s[1]
s2 = s[2]
if s1<0:
   s1 = - s1
   c1 = modinv(c1, n)
elif s2<0:
   s2 = - s2
   c2 = modinv(c2, n)
m=(pow(c1,s1,n)*pow(c2,s2,n)) % n
```

完整解题脚本

```
import sys
import binascii
sys.setrecursionlimit(1000000)
def egcd(a, b):
    if a == 0:
      return (b, 0, 1)
    else:
      g, y, x = egcd(b % a, a)
      return (g, x - (b // a) * y, y)
def modinv(a, m):
    g, x, y = egcd(a, m)
    if g != 1:
      raise Exception('modular inverse does not exist')
    else:
      return x % m

c1=0xc0204d515a275954bbc8390d80efa1cca3bb29724ed7ba18f861913e28b6400298603b920d484284ad9c1c175587496300355395cb06b32603e779ec9b97f7eea6bb0de42c54f7f60e6e1171496efef0de8048e6074658084d080bd346db426888084e6dd45cb89b283247443de75328d47f9bd64adbd9be86043c6d13c7ed41
n=0xc42b9d872f8ecf90b4832199771bbd8d9bafb213747d905a644baa42144f316dc224e7914f8a5d361eeab930adf5ea7fbe1416e58b3fae34ca7e6d2a3145e04af02cf5a4f14539fff032bccd7bb9cf85b12d7d36dbc870b57e11aa5704304d08eff685fe4ccd707e308dfac6a1167d79199ffa9396c4f2efb4770256253d1407
e1=0xc21000af014a98b2455dec479
c2=0xc4053ed3455c15174e5699ab6eb09b830a98b79e92e7518b713e828faca4d6d02306a65a8ec70893ca8a56943a7074e6de8649f099164cad33b8ca93fce1656f0712b990cce06642250c52a80d19c2afa94a4e158139028ac89c811e6be8d7b6984b6c1edcdd752e4955e3a6f1ab38cf2edb4474a80e03d6c313eb8ebf4e98cc
e2=0x9935842d63b75899ddd81b467

s = egcd(e1, e2)
s1 = s[1]
s2 = s[2]

if s1<0:
   s1 = - s1
   c1 = modinv(c1, n)
elif s2<0:
   s2 = - s2
   c2 = modinv(c2, n)
m=(pow(c1,s1,n)*pow(c2,s2,n)) % n
print(m)
print (binascii.unhexlify(hex(m)[2:].strip("L")))
```
### Stereotyped messages攻击
场景介绍
```
('n=', '0xf85539597ee444f3fcad07142ecf6eaae5320301244a7cedc50b2beed7e60ffa11ccf28c1a590fb81346fb16b0cecd046a1f63f0bf93185c109b8c93068ec02fL')
('e=', '0x3')
('c=', '0xa75c3c8a19ed9c911d851917e442a8e7b425e4b7f92205ca532a2ab0f5abe6cb86d164cc61374877f9e88e7bca606b43c79f1d59deadfcc68c3db52e5fc42f0L')
('m=', '0x666c6167206973203a746573743132313131313131313131313133343536000000000000000000L')
```
给了明文的高位，可以尝试使用Stereotyped messages攻击
我们需要使用sage实现该算法
可以安装SageMath
或者在线网站https://sagecell.sagemath.org/

攻击脚本
```
e = 0x3
b=0x666c6167206973203a746573743132313131313131313131313133343536000000000000000000
n = 0xf85539597ee444f3fcad07142ecf6eaae5320301244a7cedc50b2beed7e60ffa11ccf28c1a590fb81346fb16b0cecd046a1f63f0bf93185c109b8c93068ec02f
c=0xa75c3c8a19ed9c911d851917e442a8e7b425e4b7f92205ca532a2ab0f5abe6cb86d164cc61374877f9e88e7bca606b43c79f1d59deadfcc68c3db52e5fc42f0
kbits=72
PR.<x> = PolynomialRing(Zmod(n))
f = (x + b)^e-c
x0 = f.small_roots(X=2^kbits, beta=1)[0]
print "x: %s" %hex(int(x0))
```
可以求解出m的低位

### Factoring with high bits known攻击
场景介绍
```
('n=', '0xb50193dc86a450971312d72cc8794a1d3f4977bcd1584a20c31350ac70365644074c0fb50b090f38d39beb366babd784d6555d6de3be54dad3e87a93a703abddL')
('p=', '0xd7e990dec6585656512c841ac932edaf048184bac5ebf9967000000000000000L')
('e=', '0x3')
('c=', '0x428a95e5712e8aa22f6d4c39ee5ec85f422608c2f141abf22799c1860a5e343068ab55dfb5c99a7085714f4ce8950e85d8ed0a11fce3516cf66a641dca8321eeL')
```
题目给出p的高位

攻击脚本
该后门算法依赖于Coppersmith partial information attack算法, sage实现该算法


```
p = 0xd7e990dec6585656512c841ac932edaf048184bac5ebf9967000000000000000
n = 0xb50193dc86a450971312d72cc8794a1d3f4977bcd1584a20c31350ac70365644074c0fb50b090f38d39beb366babd784d6555d6de3be54dad3e87a93a703abdd

kbits = 60
PR.<x> = PolynomialRing(Zmod(n))
f = x + p
x0 = f.small_roots(X=2^kbits, beta=0.4)[0]
print "x: %s" %hex(int(x0))
p = p+x0
print "p: ", hex(int(p))
assert n % p == 0
q = n/int(p)
print "q: ", hex(int(q))
```
其中kbit是未知的p的低位位数
x0为求出来的p低位

### Partial Key Exposure Attack
场景介绍
```
('n=', '0x56a8f8cbc72ff68e67c72718bd16d7e98150aea08780f6c4f532d20ca3c92a0fb07c959e008cbcbeac744854bc4203eb9b2996e9cf630133bc38952a2c17c27dL')
('d&((1<<256)-1)=', '0x594b6c9631c4987f588399f22466b51fc48ed449b8aae0309b5736ef0b741893')
('e=', '0x3')
('c=', '0xca2841cbc52c8307e0f2c48f8b14bc0846ece4111453362e6aee4b81f44f2a14df1c58836d4937f3b868148140ee36e9a7e910dd84c2dc869ead47711412038L')
```
题目给出一组公钥n,e以及加密后的密文
给私钥d的低位

攻击脚本
记N=pq为n比特RSA模数,e和d分别为加解密指数,ν为p和q低位相同的比特数,即p≡qmod2ν且p≠qmod2v+1.
1998年,Boneh、Durfee和Frankel首先提出对RSA的部分密钥泄露攻击:当ν=1,e较小且d的低n/4比特已知时,存在关于n的多项式时间算法分解N.
2001年R.Steinfeld和Y.Zheng指出,当ν较大时,对RSA的部分密钥泄露攻击实际不可行.

当ν和e均较小且解密指数d的低n/4比特已知时,存在关于n和2v的多项式时间算法分解N.

```
def partial_p(p0, kbits, n):
    PR.<x> = PolynomialRing(Zmod(n))
    nbits = n.nbits()

    f = 2^kbits*x + p0
    f = f.monic()
    roots = f.small_roots(X=2^(nbits//2-kbits), beta=0.3)  # find root < 2^(nbits//2-kbits) with factor >= n^0.3
    if roots:
        x0 = roots[0]
        p = gcd(2^kbits*x0 + p0, n)
        return ZZ(p)

def find_p(d0, kbits, e, n):
    X = var('X')

    for k in xrange(1, e+1):
        results = solve_mod([e*d0*X - k*X*(n-X+1) + k*n == X], 2^kbits)
        for x in results:
            p0 = ZZ(x[0])
            p = partial_p(p0, kbits, n)
            if p:
                return p


if __name__ == '__main__':
    n =0x56a8f8cbc72ff68e67c72718bd16d7e98150aea08780f6c4f532d20ca3c92a0fb07c959e008cbcbeac744854bc4203eb9b2996e9cf630133bc38952a2c17c27d 
    e = 0x3
    d = 0x594b6c9631c4987f588399f22466b51fc48ed449b8aae0309b5736ef0b741893
    beta = 0.5
    epsilon = beta^2/7

    nbits = n.nbits()
    kbits = 255
    d0 = d & (2^kbits-1)
    print "lower %d bits (of %d bits) is given" % (kbits, nbits)

    p = find_p(d0, kbits, e, n)
    print "found p: %d" % p
    q = n//p
    print hex(d)
    print hex(inverse_mod(e, (p-1)*(q-1)))
```
kbits是私钥d泄露的位数255

### Padding Attack
场景介绍
```
('n=', '0xb33aebb1834845f959e05da639776d08a344abf098080dc5de04f4cbf4a1001dL')
('e=', '0x3')
('c1=pow(hex_flag,e,n)', '0x3aa5058306947ff46b0107b062d75cf9e497cdb1f120d02eaeca30f76492c550L')
('c2=pow(hex_flag+1,e,n)', '0x6a645739f25380a5e5b263ff5e5b4b9324381f6408a11fdaab0488209145fb3eL')
```
原理参考
https://www.anquanke.com/post/id/158944

意思很简单
1.pow(mm, e) != pow(mm, e, n)
2.利用rsa加密m+padding
值得注意的是，e=3，padding可控
那么我们拥有的条件只有
n,e,c,padding
所以这里的攻击肯定是要从可控的padding入手了

攻击脚本
```
import gmpy
def getM2(a,b,c1,c2,n,e):
    a3 = pow(a,e,n)
    b3 = pow(b,e,n)
    first = c1-a3*c2+2*b3
    first = first % n
    second = e*b*(a3*c2-b3)
    second = second % n
    third = second*gmpy.invert(first,n)
    third = third % n
    fourth = (third+b)*gmpy.invert(a,n)
    return fourth % n
e=0x3
a=1
b=-1
c1=0x3aa5058306947ff46b0107b062d75cf9e497cdb1f120d02eaeca30f76492c550
c2=0x6a645739f25380a5e5b263ff5e5b4b9324381f6408a11fdaab0488209145fb3e
padding2=1
n=0xb33aebb1834845f959e05da639776d08a344abf098080dc5de04f4cbf4a1001d
m = getM2(a,b,c1,c2,n,e)-padding2
print hex(m)
```
通过上面介绍的那篇文章的推导过程我们可以知道
a等于1
b=padding1-padding2
这边我们的padding1是第一个加密的明文与明文的差，本题是0
padding2是第二个加密的明文与明文的差，本题是1
所以b是-1
我们这边是用的那篇文章的Related Message Attack

### RSA LSB Oracle Attack
场景介绍
参考博客https://www.sohu.com/a/243246344_472906
适用情况：可以选择密文并泄露最低位。
在一次RSA加密中，明文为m，模数为n，加密指数为e，密文为c。
我们可以构造出c'=((2^e)c)%n=((2^e)(m^e))%n=((2m)^e)%n， 因为m的两倍可能大于n，所以经过解密得到的明文是 m'=(2m)%n 。
我们还能够知道 m' 的最低位lsb 是1还是0。
因为n是奇数，而2m是偶数，所以如果lsb 是0，说明(2m)%n 是偶数，没有超过n，即m < n/2.0，反之则m > n/2.0 。
举个例子就能明白2%3=2 是偶数，而4%3=1 是奇数。
以此类推，构造密文c"=(4^e)c)%n 使其解密后为m"=(4m)%n ，判断m" 的奇偶性可以知道m 和 n/4 的大小关系。
所以我们就有了一个二分算法，可以在对数时间内将m的范围逼近到一个足够狭窄的空间。

攻击脚本
```
def brute_flag(encrypted_flag, n, e):

    flag_count = n_count = 1
    flag_lower_bound = 0
    flag_upper_bound = n
    ciphertext = encrypted_flag
    mult = 1
    while flag_upper_bound > flag_lower_bound + 1:
        sh.recvuntil("input your option:")
        sh.sendline("D")
        ciphertext = (ciphertext * pow(2, e, n)) % n
        flag_count *= 2
        n_count = n_count * 2 - 1

        print("bit = %d" % mult)
        mult += 1


        sh.recvuntil("Your encrypted message:")
        sh.sendline(str(ciphertext))

        data=sh.recvline()[:-1]
        if(data=='The plain of your decrypted message is even!'):
            flag_upper_bound = n * n_count / flag_count
        else:
            flag_lower_bound = n * n_count / flag_count
            n_count += 1
    return flag_upper_bound
```

## 参考
文本内容多来自于 https://xz.aliyun.com/t/6459