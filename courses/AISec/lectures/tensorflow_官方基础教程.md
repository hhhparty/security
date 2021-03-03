# Tensorflow  官方基础教程

> source : https://tensorflow.google.cn/tutorials/quickstart/beginner

## Quickstart for beginners

这个教程将介绍Keras：
- 建立图像分类的神经网络
- 训练这个网络
- 评估model准确性


```python
import tensorflow as tf

# Load and prepare MNIST dataset
# Convert the samples from integers to floating - point numbers:
mnist = tf.keras.datasets.mnist
(x_train , y_train) ,(x_test,y_test ) = mnist.load_data()
x_train , x_test = x_train/255.0 ,x_test / 255.0 # x取值为灰度像素值[0,255]

# 通过堆叠网络层，构建 tf.kears.Sequential 模型；

model = tf.keras.models.Sequential([
    tf.keras.layers.Flatten(input_shape=(28,28)), # 定义输入层，将多位数据扁平化为1维
    tf.keras.layers.Dense(128,activation = 'relu'),# 设置全连接层，使用relu激活函数
    tf.keras.layers.Dropout(0.2), # 设置训练剪枝比例，仿制过拟合
    tf.keras.layers.Dense(10,activation='softmax') # 10 分类问题，决定了输出的神经元数量; 对每个样本，model会返回一个logits 或 log-odds 评分向量，有多少个分类，该向量就有多少个元素；使用softmax将这些数值变得符合概率分布。
])

# 如果希望模型返回一个概率值，也可以选用下列方法
# probaility_model = tf.keras.Sequential([
#   model,
#   tf.keras.layers.Softmax()
# ])
# probability_model.compile(...)
# probability_model.fit(...)

# 选择优化器和损失函数
model.compile(optimizer='adam',loss=tf.keras.losses.SparseCategoricalCrossentropy(from_logits=False),metrics=['accuracy']) 

# 拟合数据，调整参数，最小化loss
model.fit(x_train,y_train,epochs=5)


# 使用验证集检查模型性能
model.evaluate(x_text,y_test,verbose=2)

```

说明：

使用 losses.SparseCategoricalCrossentropy 损失函数，将每个样本的logits向量转化为一个标量损失，如果样本已经被softmax处理，那么参数logits=False。

初始阶段，每个样本对应各个分类的概率约为1/10（随机的），上述损失函数的值SparseCategoricalCrossentropy 接近于 `- tf.math.log(1/10)` 值约为 -2.3


## Quickstart for experts

这个教程将介绍Keras：
- 建立图像分类的神经网络
- 训练这个网络
- 评估model准确性


```python
import tensorflow as tf
# 引入所需的网络层类，tf Model类
from tensorflow.keras.layers import Dense,Flatten,Conv2D
from tensorflow.keras import Model

# Load and prepare MNIST dataset
# Convert the samples from integers to floating - point numbers:
mnist = tf.keras.datasets.mnist
(x_train , y_train) ,(x_test,y_test ) = mnist.load_data()
x_train , x_test = x_train/255.0 ,x_test / 255.0 # x取值为灰度像素值[0,255]

# 增加一个数据维度
x_train = x_train[...,tf.newaxis].astype('float32')
x_test = x_test[...,tf.newaxis].astype('float32')

# 使用 tf.data 使数据划分为一个个的batch，并shuffle(洗牌)
train_ds = tf.data.Dataset.from_tensor_slices((x_train,y_train)).shuffle(10000).batch(32)
test_ds = tf.data.Dataset.from_tensor_slices((x_test,y_test)).shuffle(10000).batch(32)

# 使用keras 模型子类 api 构建 Keras 模型
class MyModel(Model):
    def __init__(self):
        super(MyModel,self).__init__()
        self.conv1 = Conv2D(32,3,activation='relu')
        self.flatten = Flatten()
        self.d1 = Dense(128,activate='relu')
        self.d2 = Dense(10,activate ='softmax')

    def call(self,x):
        x = self.conv1(x)
        x = self.flatten(x)
        x = self.d1(x)
        return self.d2(x)

# Create an instance of the model
model = MyModel()

# 选择训练过程中使用的优化器和损失函数
loss_object = tf.keras.losses.SparseCategoricalCrossentropy(from_logits = False)
optimizer = tf.keras.optimizers.Adam()

# 选择评价损失和准确性的矩阵。这个矩阵累计了各epochs的值，然后输出全局结果
train_loss = tf.keras.metrics.Mean(name="train_loss")
train_accuracy = tf.keras.metrics.SparseCategoricalAccuracy(name="train_accuracy")

test_loss = tf.keras.metrics.Mean(name="test_loss")
test_accuracy = tf.keras.metrics.SparseCategoricalAccuracy(name="test_accuracy")

# 使用tf.GradientTape 训练模型
@tf.function
def train_step(images,labels):
    with tf.GradientTape() as tape:
        predictions = model(images,training=True)
        loss = loss_object(labels,predictions)
    gradients = tape.gradient(loss,model.trainable_variables)
    optimizer.apply_gradients(zip(gradients,model.trainable_variables))

    train_loss(loss)
    train_accuracy(labels,predictions)

# 测试模型

@tf.function
def test_step(images,labels):
    predictions = model(images,training=False)
    t_loss = loss_object(labels,predictions)

    test_loss(t_loss)
    test_accuracy(lables,predictions)

# 执行
EPOCHS = 5

for epoch in range(EPOCHS):
    # 在每轮训练之前重置metrics
    train_loss.reset_states()
    train_accuracy.reset_states()
    test_loss.reset_states()
    test_accuracy.reset_states()

    for images,labels in train_ds:
        train_step(images,labels)

    for test_images,test_labels in test_ds:
        test_step(test_images,test_labels)
    
    print(
        f'Epoch {epoch +1}, '
        f'Loss: {train_loss.result()}, '
        f'Accuracy: {train_accuracy.result() * 100}, '
        f'Test Loss: {test_loss.result()}, '
        f'Test Accuracy: {test_accuracy.result() * 100}'
    )
