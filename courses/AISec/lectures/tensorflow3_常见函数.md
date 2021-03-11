# tensorflow 3 常见函数
> 声明：Tensorflow部分是学习北大曹老师Tensorflow2课程的笔记。


## 强制 tensor 转换为该数据类型

- tf.cast(张量名，dtype=数据类型)
## 计算张量维度上元素的最小值
- tf.reduce_min(张量名)
## 计算张量维度上的元素最大值
- tf.reduce_max(张量名)
## 计算张量沿指定维度（若不指定，则对所有轴进行操作）的平均值
- tf.reduce_mean(张量名,axis=操作轴)
## 计算张量沿着指定维度（若不指定，则对所有轴进行操作）的和
- tf.reduce_sum(张量名，axis=操作轴)


## 将带训练的参数进行标记
- 可以使用`tf.Variable()`将变量标记为“可训练”，被标记的变量会在反向传播中记录梯度信息。神经网络中训练中，常用该函数标记带训练参数。
- tf.Variable(初始值)
- w = tf.Variable(tf.random.normal([2,2],mean=0,stddev=1))

##  维度相同的张量之间，可以进行四则运算
  - tf.add(张量1，张量2)
  - tf.subtract(张量1，张量2)
  - tf.multiply(张量1，张量2)
  - tf.divide（(张量1，张量2)）
##  平方、次方、开方
  - tf.square, tf.pow, tf.sqrt
## 对于可矩阵相乘的张量，可进行矩阵乘
  - tf.matmul

## 特征、标签配对函数
- 特征、标签配对函数 `tf.data.Dataset.from_tensor_slices` 。切分传入张量的第一维度，生成输入特征、标签对，构建数据集 `data = tf.data.Dataset.from_tensor_slices((输入特征,标签))`

例如：
```python
features = tf.constant([12,23,10,17])
labels = tf.constant([0,1,1,0])
dataset = tf.data.Dataset.from_tensor_slices((features,labels))
print(dataset)
for e in dataset:
    print(e)
```
## 对函数的指定参数进行求导运算：
  - 需要使用`with tf.GradientType do t:` 结构，记录计算过程；
  - 使用gradient求出张量的梯度。 

```python

with tf.GradientTape() as tape:
    若干计算过程
grad = tape.gradient(函数，指定对谁求导)
```
例如：
```python
with tf.GradientTape() as tape: # 定义计算过程
    w = tf.Variable(tf.constant(3.0)) # 将带训练的参数进行标记
    loss = tf.pow(w,2) 
grad = tape.gradient(loss,w) # 求出张量 loss 对 w的梯度
print(grad)
```
## enumerate

enumerate 是 python 的内建函数，可遍历每个元素，组合为inde和元素，常在for中使用。
`for index,element in enumerate(seq):`

## one-hot

- 独热编码，在分类问题中，常用其做标签。
- 使用 tf.one_hot(带转换数据, depth=几分类)

例如：
```python
classes = 3
labels = tf.constant([1,0,2])
output = tf.one_hot(labels,depth=classes)
print(output)
```
结果如下：
```
[[0. 1. 0.]
 [1. 0. 0.]
 [0. 0. 1.], shape=(3,3),dtype=float32]
```

## 使输出符合概率分布  tf.nn.softmax

对于分类问题，神经网络计算得到的Y的数值，最后形成判断是以概率大小来确定分类的。但计算结果Y一般不符合概率分布，所以需要用下列公式进行调整:

$\frac{e^{y_i}}{\sum_{j=0}^n e^{y_i}}$ 

使各y值符合概率分布 即 $softmax(y_i) = 0 \leq y_i \leq 0,\sum y_i =1$。即`tf.nn.softmax()`

例如：
- 假设神经网络前置传播得到各分类值 `y = tf.constant([1.01，2.01,-0.66]) `
- 使用softmax调整其符合概率分布 `y_pro = tf.nn.softmax(y)`

## 参数自更新函数 assign_sub

- 参数首先要被设为 Variable 变量，才可自更新
- w.assign_sub(参数w要自减的内容)

例如：
```python
w = tf.Variable(4)
w.assign_sub(1) # w -= 1
print(w)
```

## 返回张量研指定维度最大值的索引 tf.argmax

- tf.argmax(张量名，axis=操作轴)

```python
import numpy as np
test = np.array([[1,2,3],[2,3,4],[5,4,3],[8,7,2]])

print(tf.argmax(test,axis=0)) #返回每一列最大值的索引
print(tf.argmax(test,axis=1)) #返回每一行最大值的索引
```
运行结果：
```
tf.Tensor([3,3,1],shape=(3,),dtype=int64)
tf.Tensor([2 2 0 0],shape=(4,),dtype=int64)
```

## tf.where（）

条件语句为真则返回A，否则返回B。

例如：
```python
a = tf.constant([1,2,3,1,1])
b = tf.constant([0,1,3,4,5])

c = tf.where(tf.greater(a,b),a,b) # 若 a>b ，返回 a 对应位置的元素，否则返回b对应位置的元素给c
print("c:",c)
```

结果是：`c: tf.Tensor([1 2 3 4 5],shape=(5,), dtype=int32)`

## np.random.RandomState.rand(维度)
返回一个[0,1)之间的随机数，若维度参数为空，则返回标量。

```python
import numpy as np

rdm = np.random.RandomState(seed=1)#seed=常数，可以使每次生成的随机数相同（仅为教学目的）
a = rdm.rand()#返回一个随机数标量
b = rdm.rand(2,3)#返回一个维度2*3的随机矩阵
print("a: ",a)
print("b: ",b)

# 结果如下：
a:  0.417022004702574
b:  [[7.20324493e-01 1.14374817e-04 3.02332573e-01]
 [1.46755891e-01 9.23385948e-02 1.86260211e-01]]
```

## np.vstack()
将两个数组接垂直方向叠加

```np.vstack(数组1，数组2)```

```python
import numpy as np
a = np.array([1,2,3])
b = np.array([4,5,6])
c = np.vstack((a,b))
print("c: \n",c)

#结果如下：
c: 
 [[1 2 3]
 [4 5 6]]
```

## np.mgrid[] .ravel()  np.c_[] 三个函数构成网格坐标点
- np.mgrid[起始值:结束值:步长, 起始值：结束值：步长，...] ，可以生成多个维度相同的等差序列。
- x.ravel() 将多维数组x变为一维数组，“把.前变量拉直”
- np.c_[数组1，数组2，...] 使返回的间隔数值点配对

```python
import numpy as np
x,y = np.mgrid[1:3:1,2:4:0.5] # 为了保持两个数维度相同，所以使用了x维度2和y维度4，形成了2*4的x和y。
grid = np.c_[x.ravel(),y.ravel()] # ravel()将x和y分别拉直为一维数组，然后c_[]将他们按位置进行配对。这就构成了网格坐标点
print("x:\n ",x)
print("y: \n",y)
print("grid:\n",grid)

#结果
x:
  [[1. 1. 1. 1.]
 [2. 2. 2. 2.]]
y: 
 [[2.  2.5 3.  3.5]
 [2.  2.5 3.  3.5]]
grid:
 [[1.  2. ]
 [1.  2.5]
 [1.  3. ]
 [1.  3.5]
 [2.  2. ]
 [2.  2.5]
 [2.  3. ]
 [2.  3.5]]
```
