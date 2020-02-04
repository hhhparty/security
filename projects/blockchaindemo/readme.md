# Readme

本示例项目旨在学习区块链技术。完全参考：
- https://zhuanlan.zhihu.com/p/31479937
- https://hackernoon.com/learn-blockchains-by-building-one-117428612f46

## 概念

### 区块链
区块链是不可变的、有序的、记录的链。记录也成为区块。区块内可以包含交易记录、文件或其他数据。这些数据都是由哈希值链接在一起。

每个区块有：
- an index
- a timestamp in Unix time
- a list of transactions
- a proof of work (more on that later)
- the hash of the previous Block

```python
#Example of a Block in our Blockchain
block = {
    'index': 1,
    'timestamp': 1506057125.900785,
    'transactions': [
        {
            'sender': "8527147fe1f5426f9dd545de4b27ee00",
            'recipient': "a77f5cdfa2934df3954a5c7c7da5df1f",
            'amount': 5,
        }
    ],
    'proof': 324984774000,
    'previous_hash': "2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824"
}
```

每个新区块都包含上一个区块的哈希。这一重要概念使得区块链的不可变性成为可能：如果攻击者篡改了链中的前序区块，所有的后续区块的哈希都是错的。

### 工作量证明

PoW算法的目标是尽可能难以计算，但很容易证明。

下面给出一个非常简单的例子来帮助理解。

不妨规定某整数 x 乘以另一个 y 的哈希必须以 0结尾。也就是 hash(x * y) = ac23dc...0。就这个例子而言，不妨将令 x = 5。Python 实现如下：
```python
from hashlib import sha256
x = 5
y = 0  # We don't know what y should be yet...
while sha256(f'{x*y}'.encode()).hexdigest()[-1] != "0":
    y += 1
print(f'The solution is y = {y}')
```

解就是 y = 21。因为这样得到的哈希的结尾是 0：

```python
hash(5 * 21) = 1253e9373e...5e3600155e860
```

比特币的工作量证明算法是 Hashcash , 与上面的例子很类似。矿工们争相求解这个算法，以便创建新块。总体而言，难度大小取决于要在字符串中找到多少特定字符。矿工给出答案的报酬就是在交易中得到比特币。

## 实现步骤

- 首先要创建blockchain.py文件中的 Blockchain 类的多个方法。
- 实现 Blockchain 类的基本的工作量证明算法proof_of_work()，这个算法（PoW）表述了区块链中的新区块是如何被创建或挖出来的。
  - PoW是符合特定规则的数字，从计算角度看，这个数字难以查找，易于证明。
  - 例如：寻找数字p，当它和前一个区块的证明一起求哈希时，该哈希开头是四个0。

- 建立http应用，将 Blockchain 用作 API。
  - 使用django命令```django-admin startproject blockchaindem```建立项目blockchaindemo。
  - 使用django命令```django-admin startapp demo```建立一个应用，命名为demo。
  - 编写urls.py、views.py、forms.py templates等内容，使这个web应用能够通过提交表单建立新交易。
- 挖矿端设计实现
  - 计算工作量证明
  - 奖励矿工
  - 将区块加入到链中
- 和 Blockchain 交互
  - 可以用简洁又古老的 cURL 或者 Postman 来通过网络用 API 和区块链交互。
- 建立共识

### 共识

区块链的核心之一是去中心化，建立共识机制。即在网络中不只一个节点，所有节点都有相同的状态，完备的信息。

- 首先要让节点知道所在网络中存在所有的邻居节点。每个节点都应保存其他节点的信息。
  - 可以使用url标识节点，使用集合保证添加节点是幂等运算。
  - 建立算法解决冲突，即使每个节点的链与其他链相互一致。
    - 可以简单使用最长有效链（最老的链）最有权威