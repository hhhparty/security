# Tensorflow 2 基本概念
> 声明：Tensorflow部分是学习北大曹老师Tensorflow2课程的笔记。
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



## 线程和队列
深度学习的模型训练过程往往需要大量的数据，而将这些数据一次性的读入和预处理需要大量的时间开销，所以通常采用队列与多线程的思想解决这个问题，而且TensorFlow为我们提供了完善的函数。

本文介绍了TensorFlow的线程和队列。在使用TensorFlow进行异步计算时，队列是一种强大的机制。正如TensorFlow中的其他组件一样，队列就是TensorFlow图中的节点。这是一种有状态的节点，就像变量一样：其他节点可以修改它的内容。具体来说，其他节点可以把新元素插入到队列后端(rear)，也可以把队列前端(front)的元素删除。

一个典型的输入结构：使用一个RandomShuffleQueue来作为模型训练的输入：
- 多个线程准备训练样本，并且把这些样本推入队列。
- 一个训练线程执行一个训练操作，此操作会从队列中移除最小批次的样本（mini-batches)。

TensorFlow的Session对象是可以支持多线程的，因此多个线程可以很方便地使用同一个会话（Session）并且并行地执行操作。然而，在Python程序实现这样的并行运算却并不容易。所有线程都必须能被同步终止，异常必须能被正确捕获并报告，会话终止的时候， 队列必须能被正确地关闭。

TensorFlow提供了两个类来帮助多线程的实现：tf.Coordinator和 tf.QueueRunner，通常来说这两个类必须被一起使用。Coordinator类用来同时停止多个工作线程并且向那个在等待所有工作线程终止的程序报告异常。QueueRunner类用来协调多个工作线程并将多个张量推入同一个队列中。

### 实现队列
在Python中是没有提供直接实现队列的函数的，所以通常会使用列表模拟队列。

而TensorFlow提供了整套实现队列的函数和方法，在TensorFlow中，队列和变量类似，都是计算图上有状态的节点。操作队列的函数主要有：
- `FIFOQueue()`：创建一个先入先出（FIFO）的队列
- `RandomShuffleQueue()`：创建一个随机出队的队列
- `PaddingFIFOQueue`: A FIFOQueue that supports batching variable-sized tensors by padding.
- `PriorityQueue`: A queue implementation that dequeues elements in prioritized order.

示例：
```python
import tensorflow as tf

q = tf.FIFOQueue(3,"int32")
init = q.enqueue_many(([0,1,2],)) # 初始化队列中的元素

x = q.dequeue() #出队
y = x + 1
q_inc = q.enqueue([y]) #入队

with tf.Session() as sess:
     init.run()
     for a in range(5):
          v,a = sess.run([x,q_inc])
          print(v)
#output
#0 
#1 
#2 
#1 
#2 
```


### Coordinator多线程协同
Coordinator类用来帮助多个线程协同工作，多个线程同步终止。 其主要方法有：

`should_stop()`：如果线程应该停止则返回True。
`request_stop(<exception>)`：请求该线程停止。
`join(<list of threads>)`：等待被指定的线程终止。

首先创建一个 Coordinator对象，然后建立一些使用Coordinator对象的线程。这些线程通常一直循环运行，每次循环前首先判断should_stop()是否返回True，如果是的话就停止。 任何线程都可以决定什么时候应该停止，它只需要调用request_stop()，同时其他线程的 should_stop()将会返回True，然后就都停下来。

假设有五个线程同时在工作，每个线程自身会先判断should_stop()的值，当其返回值为True时，则退出当前线程；如果为Flase，也继续该线程。此时如果线程3发出了request_stop()通知，则其它4个线程的should_stop()将全部变为True，然后线程4自身的should_stop()也将变为True，则退出了所有线程。

```python
import tensorflow as tf
import numpy as np
import time
import threading

def MyLoop(coord,worker_id):
     while not coord.should_stop():
          if np.random.rand()<0.09:
               print('stoping from id:',worker_id)
               coord.request_stop()
          else:
               print('working from id:',worker_id)
          time.sleep(1)

coord = tf.train.Coordinator()
#声明5个线程
threads=[threading.Thread(target=MyLoop,args=(coord,i,)) for i in range(5)]
#遍历五个线程
for t in threads:  
     t.start()
coord.join(threads)  
#output
#working from id: 0 
#working from id: 1 
#working from id: 2 
#working from id: 3 
#working from id: 4 
#stoping from id: 0
```

在第一轮遍历过程中，所有进程的should_stop()都为Flase，且随机数都大于等于0.09，所以依次打印了working from id: 0-5，再重新回到进程0时，出现了小于0.09的随机数，即进程0发出了request_stop()请求，进程1-4的should_stop()返回值全部为True（进程退出），也就无法进入while，进程0的should_stop()返回值也将为True（退出），五个进程全部退出。

### QueueRunner 多线程操作队列
QueueRunner类会创建一组线程， 这些线程可以重复的执行Enquene操作， 他们使用同一个Coordinator来处理线程同步终止。此外，一个QueueRunner会运行一个用于异常处理的closer thread，当Coordinator收到异常报告时，这个closer thread会自动关闭队列。

我们可以使用一个一个QueueRunner来实现上述结构。 首先建立一个TensorFlow图表，这个图表使用队列来输入样本，处理样本并将样本推入队列中，用training操作来移除队列中的样本。

前面说到了队列的操作，多线程协同的操作，在多线程协同的代码中让每一个线程打印自己的id编号，下面我们说下如何用多线程操作一个队列。

TensorFlow提供了队列tf.QueueRunner类处理多个线程操作同一队列，启动的线程由上面提到的tf.Coordinator类统一管理，常用的操作有：
- `QueueRunner()`：启动线程，第一个参数为线程需要操作的队列，第二个参数为对队列的操作，如enqueue_op，此时的enqueue_op = queue.enqueue()
- `add_queue_runner()`：在图中的一个集合中加QueueRunner，如果没有指定的合集的话，会被添加到tf.GraphKeys.QUEUE_RUNNERS合集
- `start_queue_runners()`：启动所有被添加到图中的线程

```python
import tensorflow as tf

#创建队列
queue = tf.FIFOQueue(100,'float')
#入队
enqueue_op = queue.enqueue(tf.random_normal([1]))
#启动5个线程，执行enqueue_op
qr = tf.train.QueueRunner( queue,[enqueue_op] * 5)
#添加线程到图
tf.train.add_queue_runner(qr)
#出队
out_tensor = queue.dequeue()

with tf.Session() as sess:
     coord = tf.train.Coordinator()
     threads = tf.train.start_queue_runners(sess=sess,coord=coord)
     for i in range(6):
          print(sess.run(out_tensor)[0])
     coord.request_stop()
     coord.join(threads)
#output
#-0.543751 
#-0.712543 
#1.32066 
#0.2471 
#0.313005 
#-2.16349
```

### 异常处理
通过 queue runners启动的线程不仅仅推送样本到队列。它们还捕捉和处理由队列产生的异常，包括OutOfRangeError异常，这个异常是用于报告队列被关闭。 使用Coordinator训练时在主循环中必须同时捕捉和报告异常。 下面是对上面训练循环的改进版本。

```python
try:
    for step in xrange(1000000):
        if coord.should_stop():
            break
        sess.run(train_op)
except Exception as e:
    # Report exceptions to the coordinator.
    coord.request_stop(e)
finally:
    # Terminate as usual. It is safe to call `coord.request_stop()` twice.
    coord.request_stop()
    coord.join(threads)
```

## 查看和指定设备

### 查看设备

```python
import os
from tensorflow.python.client import device_lib
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "99"
 
if __name__ == "__main__":
    print(device_lib.list_local_devices())
```

### 指定CPU或GPU进行计算

```
#使用CPU进行计算
with tf.device("/cpu:0"):
    a = tf.constant([1.0,2.0,3.0,4.0,5.0,6.0],shape=[2,3])
    b = tf.constant([1.0,2.0,3.0,4.0,5.0,6.0],shape=[3,2])
    c = tf.matmul(a,b)
    #查看计算时硬件的使用情况
    sess = tf.Session(config=tf.ConfigProto(log_device_placement=True))
    print(sess.run(c))
```

通过tf.device可以指定计算时使用的设备,0表示设备的个数，如果想要使用GPU进行计算，将CPU改成GPU即可。

### 查看tensor详细情况
```
#设置运行时候的参数
options = tf.RunOptions(output_partition_graphs=True)
metadata = tf.RunMetadata()
c_val = sess.run(c,options=options,run_metadata=metadata)
print(metadata.partition_graphs)
#关闭session
sess.close()
```