# Tensorflow 1
> 声明：Tensorflow部分是学习北大曹老师Tensorflow2课程的笔记。


## 人工智能的三个学派

- 行为主义：基于控制论，构建感知-动作控制系统。
  - 控制论、如平衡、行走、避障等
- 符号主义：基于算数逻辑表达式，求解问题时先把问题描述为表达式，在求解表达式。
  - 可用公式描述、实现理性思维，如专家系统。
- 连接主义：仿生学、模仿神经元连接关系
  - 仿脑神经元连接，实现感性思维，如神经网络。

用计算机仿出神经网络连接关系，让计算机具备感性思维：
- 准备数据：采集大量(特征,标签)数据
- 搭建网络：搭建神经网络结构
- 优化参数：训练网络获取最佳参数（反传）
- 应用网络：将网络保存为模型，输入新数据，输出分类或预测结果（前传）。

## 鸢尾花分类例子

用神经网络实现鸢尾花分类。设$Y = wX + b$，w为权重向量，X为输入，Y为预测值，Y_为真值。

使用梯度下降法求损失函数极值：
- 目的：找到一组参数w和b，使损失函数最小（例如，可使用$MSE(Y,Y_) = \frac{\sum_{k=0}^n(Y-Y_)^2}{n}$

梯度下降法，更新参数w和b的计算式为：
- $w_{t+1} = w_t - lr*\frac{\partial loss}{\partial w_t}$
- $b_{t+1} = b - lr*\frac{\partial loss}{\partial b_t}$
- $w_{t+1}*x +b_{t+1} \rightarrow y$

其中学习率$lr$是一个超参，需要人为设置一个合适值：
- 过大时，梯度可能在最小值附近来回震荡，无法收敛。
- 过小时，收敛过程十分缓慢。


### 反向传播

反向传播，从后向前，逐层求损失函数对每层神经元参数的偏导数，迭代更新所有参数。

通过梯度下降求参函数，计算参数，例如通过下列函数
- $w_{t+1} = w_t - lr*\frac{\partial loss}{\partial w_t}$

下列代码可执行一个简单的反向传播求参数w的例子：
```python
import tensorflow as tf

w = tf.Variable(tf.constant(5,dtype=tf.float32))
lr = 0.2
epoch = 40

for epoch in range(epoch):
    #需要一个上下文管理器（context manager）来连接需要计算梯度的函数和变量，方便求解同时也提升效率。
    #指明需要计算梯度的变量为loss，即让
    with tf.GradientTape() as tape:
        loss = tf.square(w+1)
    #指定loss对w求梯度。
    grads = tape.gradient(loss,w)
    #.assign_sub对变狼做自减，即：w -= lr*grads
    w.assign_sub(lr*grads)
    print("After %s epoch,w is %f, loss is %f" % (epoch,w.numpy(),loss))

```

在TensorFlow 1.x静态图时代，我们知道每个静态图都有两部分，一部分是前向图，另一部分是反向图。反向图就是用来计算梯度的，用在整个训练过程中。而TensorFlow 2.0默认是eager模式，每行代码顺序执行，没有了构建图的过程（也取消了control_dependency的用法）。但也不能每行都计算一下梯度吧？计算量太大，也没必要。因此，需要一个上下文管理器（context manager）来连接需要计算梯度的函数和变量，方便求解同时也提升效率。

默认情况下GradientTape的资源在调用gradient函数后就被释放，再次调用就无法计算了。所以如果需要多次计算梯度，需要开启persistent=True属性，例如：with tf.GradientTape(persistent=True) as tap.