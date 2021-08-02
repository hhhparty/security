# tensorflow 4 简单实例
> 声明：Tensorflow部分是学习北大曹老师Tensorflow2课程的笔记。
实现鸢尾花分类

## 基本思路
- 准备数据
  - 数据集读入
  - 数据集乱序
  - 生成训练集、测试集
  - 配成（输入特征，标签）对，每次读入一小撮（batch）
- 搭建网络
  - 定义神经网络中所有可训练参数
- 参数优化
  - 嵌套循环迭代，with结构更新参数，显示当前loss
- 测试结果
  - 计算当前参数前向传播后的准确率，显示当前ac
- acc/loss可视化

## 代码

```python
import tensorflow as tf
from sklearn import datasets
from matplotlib import pyplot as plt
import numpy as np

#数据集读入

x_data = datasets.load_iris().data
y_data = datasets.load_iris().target

# 数据集乱序(原数据是顺序的，不打乱会影响最后准确率)
np.random.seed(116)#使用相同的seed，打乱后的输入特征/标签仍是一一对应
np.random.shuffle(x_data)
np.random.seed(116)
np.random.shuffle(y_data)
tf.random.set_seed(116)

# 数据集分出永不相见的训练集和测试集，即没有交集
x_train = x_data[:-30]
y_train = y_data[:-30]
x_test = x_data[-30:]
y_test = y_data[-30:]

# 数据类型转换，否则后面矩阵相乘时会因数据类型不一致报错
x_train = tf.cast(x_train,tf.float32)
x_test = tf.cast(x_test,tf.float32)

# 配成[输入特征，标签]对，每次喂入一小撮（batch）
train_db = tf.data.Dataset.from_tensor_slices((x_train,y_train)).batch(32)
test_db = tf.data.Dataset.from_tensor_slices((x_test,y_test)).batch(32)

# 定义神经网络所需可训练参数，即w1，b1
# 这里只用一层：输入层、输出层.
# 输入节点4个，输出节点有3个，即4个输入特征，3种标签（3分类），所以w为4*3张量，b为3*1张量
w1 = tf.Variable(tf.random.truncated_normal([4,3],stddev=0.1,seed=1))
b1 = tf.Variable(tf.random.truncated_normal([3],stddev=0.1,seed=1))

# 定义超参
lr = 0.1 #学习率
train_loss_results = [] #将每轮的loss记录在此列表中，为后续画loss曲线提供数据。
test_acc = [] #将每轮的acc记录于此列表中
epoch = 500 #循环500轮
loss_all = 0 #每轮分4个step，loss_all记录4个step生成的loss的和

# 训练部分
# 嵌套循环迭代，with结构更新参数，显示当前loss
epoch = 30
for epoch in range(epoch):#数据集级别迭代
    for step,(x_train,y_train) in enumerate(train_db):#batch级别迭代
        with tf.GradientTape() as tape:#记录梯度信息
            #前向传播过程：计算y
            y = tf.matmul(x_train,w1) + b1
            y = tf.nn.softmax(y)
            y_ = tf.one_hot(y_train,depth=3)#将变迁值转换为独热编码格式，方便计算loss和acc
            
            #求总的损失函数值：计算loss_all
            loss = tf.reduce_mean(tf.square(y_ - y)) #采用均方误差函数MSE为损失函数
            loss_all += loss.numpy() 
        
        # 计算loss对各个参数的梯度
        grads = tape.gradient(loss,[w1,b1])#loss分别对w1，b1求偏导
        # 实现梯度更新
        w1.assign_sub(lr*grads[0])#参数自更新
        b1.assign_sub(lr*grads[1])

    print("Epoch {}, loss {}".format(epoch,loss_all/4)) # 因为有120组训练数据，每次batch喂入32组，batch级共循环4次，所以损失函数要除以4，求出每次step的平均loss。
    train_loss_results.append(loss_all /4) #将4个step的loss求平均记录在此列表中
    loss_all = 0 #loss_all归零，未记录下一个epoch的loss做准备

    # 测试部分
    # 计算当前参数前向传播后的准确率，显示当前acc
    total_correct,total_number = 0,0
    
    for x_test,y_test in test_db:
        #计算前向传播结果
        y = tf.matmul(x_test,w1) + b1 #y为预测结果
        y = tf.nn.softmax(y) #使y符合概率分布
        pred = tf.argmax(y,axis=1) #返回y中最大值的索引，即预测的分类
        pred = tf.cast(pred,dtype=y_test.dtype)
        correct = tf.cast(tf.equal(pred,y_test),dtype=tf.int32)
        correct = tf.reduce_sum(correct) #将每个batch的correct数加起来
        total_correct += int(correct) #将所有batch中的correct数加起来
        total_number += x_test.shape[0]
    # 总的准确率 = total_correct / total_number
    acc = total_correct / total_number
    test_acc.append(acc)
    print("test_acc : ",acc)

# acc可视化
plt.title("Acc Curve") # 图片标题
plt.xlabel("Epoch") #x轴名称
plt.ylabel("Acc") #y轴名称
plt.plot(test_acc,label="$Accurracy$") # 逐点画出test_acc值并连线
plt.legend()
plt.show()

# loss可视化
plt.title("Loss Function Curve") # 图片标题
plt.xlabel("Epoch") #x轴名称
plt.ylabel("Loss") #y轴名称
plt.plot(train_loss_results,label="$Loss$") # 逐点画出test_acc值并连线
plt.legend()
plt.show()
```
