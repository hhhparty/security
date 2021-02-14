# Tensorflow 2 基本概念

## Eager Execution

TensorFlow 的 Eager Execution 是一种命令式编程环境，可立即评估运算，无需构建计算图：运算会返回具体的值，而非构建供稍后运行的计算图。这样能使您轻松入门 TensorFlow 并调试模型，同时也减少了样板代码。要跟随本指南进行学习，请在交互式 python 解释器中运行以下代码示例。

```python
import os
import tensorflow as tf
import cProfile
#在 Tensorflow 2.0 中，默认启用 Eager Execution。
tf.executing_eagerly()

#现在您可以运行 TensorFlow 运算，结果将立即返回：
x = [[2.]]
m = tf.matmul(x, x)
print("hello, {}".format(m))
```
结果如下：
hello, [[4.]]

更多参考：https://tensorflow.google.cn/guide/eager?hl=zh-cn

## tensorflow 数据类型（dtype）
- tf.int32
- tf.float32
- tf.float64
- tf.bool
  - tf.constant(True)
- tf.string
  - tf.constant("Hello,world")
## 张量
- 张量是具有统一类型（称为 dtype）的多维数组。
- 可以在 tf.dtypes.DType 中查看所有支持的 dtypes。

如果您熟悉 NumPy，就会知道张量与 np.arrays 有一定的相似性。

就像 Python 数值和字符串一样，所有张量都是不可变的：永远无法更新张量的内容，只能创建新的张量。

### 创建基本张量

- 下面是一个“标量”（或称“0 秩”张量）。标量包含单个值，但没有“轴”。

```python
# This will be an int32 tensor by default; see "dtypes" below.
rank_0_tensor = tf.constant(4)
print(rank_0_tensor)

# 结果为：
tf.Tensor(4, shape=(), dtype=int32)
```

- “向量”（或称“1 秩”张量）就像一个值的列表。向量有 1 个轴：

```
# Let's make this a float tensor.
rank_1_tensor = tf.constant([2.0, 3.0, 4.0])
print(rank_1_tensor)

tf.Tensor([2. 3. 4.], shape=(3,), dtype=float32)
```

- “矩阵”（或称“2 秩”张量）有 2 个轴：

```python
# If we want to be specific, we can set the dtype (see below) at creation time
rank_2_tensor = tf.constant([[1, 2],
                             [3, 4],
                             [5, 6]], dtype=tf.float16)
print(rank_2_tensor)
```
结果如下：
```
tf.Tensor(
[[1. 2.]
 [3. 4.]
 [5. 6.]], shape=(3, 2), dtype=float16)
```
可以通过shape判断张量的维数，逗号分开几个数字就是几维。

还可以使用numpy的函数创建张量（tensor）：
```python
# 生成全为0 的张量
a = tf.zeroes(2)
a = tf.zeros([2,3])

# 生成全是1的 3*4 张量
b = tf.ones([3,4])

# 生成指定值9的张量
c = tf.fill([2,2],9)


#生成符合正态分布的随机数
d = tf.random.normal([2,2],mean=0.6,stddev=1)

#生成更为集中的正态分布随机数
e = tf.random.truncated_normal([2,2],mean=0.5,stddev=1)

# 生成在[minval,maxval)区间中的均匀分布随机数 
f = tf.random.uniform(维度n,minval=最小值, maxval=最大值)
```
truncated_normal 生成的随机数 $x \in (\mu -2\delta,\mu +2\delta)$ 
注：标准差$\delta = \sqrt{\frac{\sum_{i=1}^n(x_i-\hat{x})^2}{n}}$


## TensorFlow 变量
TensorFlow 变量是用于表示程序处理的共享持久状态的推荐方法。

变量通过 tf.Variable 类进行创建和跟踪。tf.Variable 表示张量，对它执行运算可以改变其值。利用特定运算可以读取和修改此张量的值。更高级的库（如 tf.keras）使用 tf.Variable 来存储模型参数。

```python
import tensorflow as tf

# 创建变量
# 要创建变量，请提供一个初始值。tf.Variable 与初始值的 dtype 相同。


my_tensor = tf.constant([[1.0, 2.0], [3.0, 4.0]])
my_variable = tf.Variable(my_tensor)

# Variables can be all kinds of types, just like tensors
bool_variable = tf.Variable([False, False, False, True])
complex_variable = tf.Variable([5 + 4j, 6 + 1j])
```

变量与张量的定义方式和操作行为都十分相似，实际上，它们都是 tf.Tensor 支持的一种数据结构。与张量类似，变量也有 dtype 和形状，并且可以导出至 NumPy。

```python
print("Shape: ",my_variable.shape)
print("DType: ",my_variable.dtype)
print("As NumPy: ", my_variable.numpy)
```

结果如下：
```python
Shape:  (2, 2)
DType:  <dtype: 'float32'>
As NumPy:  <bound method BaseResourceVariable.numpy of <tf.Variable 'Variable:0' shape=(2, 2) dtype=float32, numpy=
array([[1., 2.],
       [3., 4.]], dtype=float32)>>

```

大部分张量运算在变量上也可以按预期运行，不过变量无法重构形状。

更多参考：https://tensorflow.google.cn/guide/variable?hl=zh-cn

