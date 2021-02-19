# tensorflow 6 搭建网络

## 用tensorflow api :tf.keras 搭建网络

### 六步法
- import
- train,test
- model = tf.keras.models.Sequential 走一遍前向传播
  - 带有跳连的非顺序网络结构，需要自建模型类
- model.compile
- model.fit
- model.summary

#### tf.keras.models.Sequential 构建网络

用于搭建上层输出就是下层输入的网络结构。

例如：
- 拉直层：tf.keras.layers.Flatten()
- 全连接层：tf.keras.layers.Dense(神经元个数，activation="激活函数", kernel_regularizer=正则化方法)
  - 激活函数可以选择：'relu','softmax','sigmoid','tanh'
  - 正则化函数kernel_regularizer可以选择：tf.keras.regularizers.l1(), tf.keras.regularizers.l2()
- 卷积层：tf.keras.layers.Conv2D(filters=卷积核个数，kernel_size=卷积核尺寸，strides=卷积步长，padding=“valid” 或“same”)
- LSTM层：tf.keras.layers.LSTM()

代码实例：
```python
import tensorflow as tf

model = tf.keras.models.Sequential([
    tf.keras.layers.Dense(3,activation='softmax',kernel_regularizer=tf.keras.regularizers.l2())
])
```

#### 自建网络类实现有跳连的网络
class MyModel(Model)

```python

class MyModel(Model)
    def __init__(self):
        super(MyModel,self).__init__()
        定义网络结构块
    def call(self,x):
        调用网络结构块，实现前向传播
        return y

model = MyModel()
```

实例：
```python
from tensorflow.keras.layers import Dense
from tensorflow.keras.layers import Model

class IrisModel(Model)
    def __init__(self):
        super(IrisModel,self).__init__()
        #定义网络结构块
        self.d1 = Dense(3,activation='sigmoid',kernel_regularizer=tf.keras.regularizers.l2())

    def call(self,x):
        #调用网络结构块，实现前向传播
        y = self.d1(x)
        return y

model = IrisModel()
```
#### model.compile(optimizer=优化器，loss=损失函数，metrics=['准确率']) 设置优化器、损失函数和评价

优化器选择：
- 'sgd' 或 tf.keras.optimizers.SGD(lr=学习率, momentum=动量参数)
- 'adagrad' 或 tf.keras.optimizers.Adagrad(lr=学习率)
- 'adadelta' 或 tf.keras.optimizers.Adadelta(lr=学习率)
- 'adam' 或  tf.keras.optimizers.Adam(lr=学习率,beta_1 = 0.9,beta_2=0.999)

loss可选：
- 'mse' 或 tf.keras.losses.MeanSquaredError()
- 'sparse_categorical_crossentropy' 或 tf.keras.losses.SparseCategoricalCrossentropy(from_logits=False)
  - from_logits询问预测结果y为原始输出还是经过了概率分布处理，True 表示没有处理为概率分布；False 表示经过了概率分布。
  - 如果模型正确，但输出结果与不使用学习器（随机猜测）得到的结果一致，那么可能是因为from_logits未设置正确。

Metrics 用于设定评测指标。可以选：
- 'accuracy' ： 真值y_和预测值y都是数值，如y_ = [1],y=[1]
- 'categorical_accuracy': 真值y_和预测值y都是独热编码（概率分布），如y_ = [0，1，0],y=[0.25，0.69，0.05]
- 'sparse_categorical_accuracy'：真值y_是数值，预测值y是独热编码（概率分布），如y_ = [1],y=[0.25，0.69，0.05]

代码实例：
```python
import tensorflow as tf

...
model.compile(optimizer=tf.keras.optimizers.SGD(lr=0.1),
    loss=tf.keras.losses.SparseCategoricalCrossentropy(from_logits=False),
    metrics=['sparse_categorical_accuracy'])

```

#### model.fit() 执行训练过程
model.fit函数的参数：
- 训练集的输入特征
- 训练集的标签
- batch_size=
- epochs=
- validation_data=(测试集的输入特征，测试集的标签)
- validation_split=从训练集划分多少比例给测试集
- validation_freq=多少次epoch，验证测试一次

代码实例：
```python
import tensorflow as tf
...
model.fit(x_train,y_train,batch_size=32,epochs=500,validation_split=0.2,validation_freq=20)

```
#### model.summary 打印网络结构 和统计

代码实例：
```python
import tensorflow as tf
...
model.summary()
```

## MNIST 数据集

导入数据：
```python
mnist = tf.keras.datasets.mnist
(x_train,y_train) ,(x_test,y_test) = mnist.load_data()
```

作为输入特征，输入神经网络时，将数据拉伸为一维数组：

```tf.keras.layers.Flatten()```

绘制灰度图：
```
plt.imshow(x_train[0],cmap='gray')
plt.show()
```
打印第一个特征，0表示纯黑色，255表示纯白色
```
print("x_train[0]:\n",x_train[0])
```

打印标签:
```
print("x_train[0]:\n",x_train[0])
```

打印测试集形状：
```
print("x_test.shape:",x_test.shape)
```
结果是：（10000，28，28）

完整代码：
```python
import tensorflow as tf
from matplotlib import pyplot as plt

mnist = tf.keras.datasets.mnist
(x_train, y_train), (x_test, y_test) = mnist.load_data()

# 可视化训练集输入特征的第一个元素
plt.imshow(x_train[0], cmap='gray')  # 绘制灰度图
plt.show()

# 打印出训练集输入特征的第一个元素
print("x_train[0]:\n", x_train[0])
# 打印出训练集标签的第一个元素
print("y_train[0]:\n", y_train[0])

# 打印出整个训练集输入特征形状
print("x_train.shape:\n", x_train.shape)
# 打印出整个训练集标签的形状
print("y_train.shape:\n", y_train.shape)
# 打印出整个测试集输入特征的形状
print("x_test.shape:\n", x_test.shape)
# 打印出整个测试集标签的形状
print("y_test.shape:\n", y_test.shape)
```

