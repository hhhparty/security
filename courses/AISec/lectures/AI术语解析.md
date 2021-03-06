# AI 术语解析

## 梯度

### 梯度饱和

梯度饱和常常是和激活函数相关的，比如sigmod和tanh就属于典型容易进入梯度饱和区的函数，即自变量进入某个区间后，梯度变化会非常小，表现在图上就是函数曲线进入某些区域后，越来越趋近一条直线，梯度变化很小，梯度饱和会导致训练过程中梯度变化缓慢，从而造成模型训练缓慢

### 梯度消失 vanishing gradient problem

在神经网络中，当前面隐藏层的学习速率低于后面隐藏层的学习速率，即随着隐藏层数目的增加，分类准确率反而下降了。这种现象叫做消失的梯度问题。

例如，对于图所示的含有3个隐藏层的神经网络，梯度消失问题发生时，靠近输出层的hidden layer 3的权值更新相对正常，但是靠近输入层的hidden layer1的权值更新会变得很慢，导致靠近输入层的隐藏层权值几乎不变，扔接近于初始化的权值。这就导致hidden layer 1 相当于只是一个映射层，对所有的输入做了一个函数映射，这时此深度神经网络的学习就等价于只有后几层的隐藏层网络在学习。

### 梯度爆炸
梯度爆炸的情况是：当初始的权值过大，靠近输入层的hidden layer 1的权值变化比靠近输出层的hidden layer 3的权值变化更快，就会引起梯度爆炸的问题。在深层网络或循环神经网络中，误差梯度可在更新中累积，变成非常大的梯度，然后导致网络权重的大幅更新，并因此使网络变得不稳定。在极端情况下，权重的值变得非常大，以至于溢出，导致 NaN 值。网络层之间的梯度（值大于 1.0）重复相乘导致的指数级增长会产生梯度爆炸。

如何确定是否出现梯度爆炸？
- 模型无法从训练数据中获得更新（如低损失）。
- 模型不稳定，导致更新过程中的损失出现显著变化。
- 训练过程中，模型损失变成 NaN。


#### 如何修复梯度爆炸问题？
有很多方法可以解决梯度爆炸问题，本节列举了一些最佳实验方法。
- 重新设计网络模型。在深度神经网络中，梯度爆炸可以通过重新设计层数更少的网络来解决。使用更小的批尺寸对网络训练也有好处。另外也许是学习率的原因，学习率过大导致的问题，减小学习率。在循环神经网络中，训练过程中在更少的先前时间步上进行更新（沿时间的截断反向传播，truncated Backpropagation through time）可以缓解梯度爆炸问题。
- 使用 ReLU 激活函数。在深度多层感知机神经网络中，梯度爆炸的发生可能是因为激活函数，如之前很流行的 Sigmoid 和 Tanh 函数。使用 ReLU 激活函数可以减少梯度爆炸。采用 ReLU 激活函数是最适合隐藏层的新实践。
- 使用长短期记忆网络。 在循环神经网络中，梯度爆炸的发生可能是因为某种网络的训练本身就存在不稳定性，如随时间的反向传播本质上将循环网络转换成深度多层感知机神经网络。使用长短期记忆（LSTM）单元和相关的门类型神经元结构可以减少梯度爆炸问题。采用 LSTM 单元是适合循环神经网络的序列预测的最新最好实践。
- 使用梯度截断（Gradient Clipping）。 在非常深且批尺寸较大的多层感知机网络和输入序列较长的 LSTM 中，仍然有可能出现梯度爆炸。如果梯度爆炸仍然出现，你可以在训练过程中检查和限制梯度的大小。这就是梯度截断。
- 使用权重正则化（Weight Regularization）。如果梯度爆炸仍然存在，可以尝试另一种方法，即检查网络权重的大小，并惩罚产生较大权重值的损失函数。该过程被称为权重正则化，通常使用的是 L1 惩罚项（权重绝对值）或 L2 惩罚项（权重平方）。

 