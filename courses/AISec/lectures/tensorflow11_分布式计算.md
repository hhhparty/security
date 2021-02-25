# Tensorflow 11 分布式训练
> 参考：
> https://tensorflow.google.cn/guide/distributed_training?hl=ch
> https://zhuanlan.zhihu.com/p/35083779

`tf.distribute.Strategy` API 提供了多个处理单元的分布式训练抽象层。它的目标是允许用户使用现有的模型和训练代码，以最小改变来适应分布式训练。

`tf.distribute.Strategy` 可用于高级API 例如 Keras，也能用于分布的自定义循环。在TF2.0中，你可以使用eagerly执行`tf.distribute.Strategy`或使用`tf.function.tf.distribute.Strategy`的图执行`tf.distribute.Strategy`。

虽然分布式训练是本节重点，但也可以用于分布式评估和预测。

## `tf.distribute.Strategy` 策略类型


现支持的应用轴（axes）：
- 同步 vs 异步训练。这是通过数据并行进行分布式训练的两种常用方法。在同步训练中，所有工作进程都同步地对输入数据的不同片段进行训练，并且会在每一步中聚合梯度。在异步训练中，所有工作进程都独立训练输入数据并异步更新变量。通常情况下，同步训练通过 all-reduce 约实现，而异步训练通过参数服务器架构（parameter server architecture）实现。
- 硬件平台：将训练扩展到一台机器上的多个 GPU 或一个网络中的多台机器（每台机器拥有 0 个或多个 GPU），或扩展到 Cloud TPU 上。


tf2.2支持的六种可选策略：
- `tf.distribute.MirroredStrategy` 支持在一台机器的多个 GPU 上进行同步分布式训练。该策略会为每个 GPU 设备创建一个副本。模型中的每个变量都会在所有副本之间进行镜像。这些变量将共同形成一个名为 MirroredVariable 的单个概念变量。这些变量会通过应用相同的更新彼此保持同步。
-  `tf.distribute.experimental.TPUStrategy` 在张量处理单元 (TPU) 上运行 TensorFlow 训练。TPU 是 Google 的专用 ASIC，旨在显著加速机器学习工作负载。您可通过 Google Colab、TensorFlow Research Cloud 和 Cloud TPU 平台进行使用。
- `tf.distribute.experimental.MultiWorkerMirroredStrategy` 与 MirroredStrategy 非常相似。它实现了跨多个工作进程的同步分布式训练，而每个工作进程可能有多个 GPU。与 MirroredStrategy 类似，它也会跨所有工作进程在每个设备的模型中创建所有变量的副本。
- `tf.distribute.experimental.CentralStorageStrategy` 也执行同步训练。变量不会被镜像，而是放在 CPU 上，且运算会复制到所有本地 GPU 。如果只有一个 GPU，则所有变量和运算都将被放在该 GPU 上。
- `tf.distribute.experimental.ParameterServerStrategy` 支持在多台机器上进行参数服务器训练。在此设置中，有些机器会被指定为工作进程，有些会被指定为参数服务器。模型的每个变量都会被放在参数服务器上。计算会被复制到所有工作进程的所有 GPU 中。

除上述策略外，还有其他两种策略可能对使用 tf.distribute API 进行原型设计和调试有所帮助。
- 默认策略: 默认策略是一种分布式策略，当作用域内没有显式分布策略时就会出现。此策略会实现 tf.distribute.Strategy 接口，但只具有传递功能，不提供实际分布。例如，strategy.run(fn) 只会调用 fn。使用该策略编写的代码与未使用任何策略编写的代码完全一样。您可以将其视为“无运算”策略。
- tf.distribute.OneDeviceStrategy 是一种会将所有变量和计算放在单个指定设备上的策略。


下面将使用`tf.distribute.MirroredStrategy`，这是再一台机器上多GPU卡进行同时训练的图形内复制（in-graph replication）。它将会把所有模型的变量复制到每个处理器上，然后通过`all-reduce`整合所有处理器的梯度，并将整合的结果应用于所有副本中。

## 在 tf.keras.Model.fit 中使用 tf.distribute.Strategy
我们已将 tf.distribute.Strategy 集成到 tf.keras（TensorFlow 对 Keras API 规范的实现）。tf.keras 是用于构建和训练模型的高级 API。将该策略集成到 tf.keras 后端以后，您可以使用 model.fit 在 Keras 训练框架中无缝进行分布式训练。

您需要对代码进行以下更改：
- 创建一个合适的 tf.distribute.Strategy 实例。
- 将 Keras 模型、优化器和指标的创建转移到 strategy.scope 中。
  
我们支持所有类型的 Keras 模型：序贯模型、函数式模型和子类化模型。

下面是一段代码，执行该代码会创建一个非常简单的带有一个密集层的 Keras 模型：
```python
mirrored_strategy = tf.distribute.MirroredStrategy()

with mirrored_strategy.scope():
  model = tf.keras.Sequential([tf.keras.layers.Dense(1, input_shape=(1,))])

model.compile(loss='mse', optimizer='sgd')
```
在此示例中我们使用了 MirroredStrategy，因此我们可以在有多个 GPU 的机器上运行。strategy.scope() 会指示 Keras 使用哪个策略来进行分布式训练。我们可以通过在此作用域内创建模型/优化器/指标来创建分布式变量而非常规变量。设置完成后，您就可以像平常一样拟合模型。MirroredStrategy 负责将模型的训练复制到可用的 GPU 上，以及聚合梯度等。
```
dataset = tf.data.Dataset.from_tensors(([1.], [1.])).repeat(100).batch(10)
model.fit(dataset, epochs=2)
model.evaluate(dataset)
```
我们在这里使用了 tf.data.Dataset 来提供训练和评估输入。您还可以使用 Numpy 数组：
```
import numpy as np
inputs, targets = np.ones((100, 1)), np.ones((100, 1))
model.fit(inputs, targets, epochs=2, batch_size=10)
```

在上述两种情况（数据集或 Numpy）中，给定输入的每个批次都被平均分到了多个副本中。例如，如果对 2 个 GPU 使用 MirroredStrategy，大小为 10 的每个批次将被均分到 2 个 GPU 中，每个 GPU 每步会接收 5 个输入样本。如果添加更多 GPU，每个周期的训练速度就会更快。在添加更多加速器时通常需要增加批次大小，以便有效利用额外的计算能力。您还需要根据模型重新调整学习率。您可以使用 strategy.num_replicas_in_sync 获得副本数量。

```
# Compute global batch size using number of replicas.
BATCH_SIZE_PER_REPLICA = 5
global_batch_size = (BATCH_SIZE_PER_REPLICA *
                     mirrored_strategy.num_replicas_in_sync)
dataset = tf.data.Dataset.from_tensors(([1.], [1.])).repeat(100)
dataset = dataset.batch(global_batch_size)

LEARNING_RATES_BY_BATCH_SIZE = {5: 0.1, 10: 0.15}
learning_rate = LEARNING_RATES_BY_BATCH_SIZE[global_batch_size]
```


## tensorflow2.0分布式训练实战：基于parameterServer架构

>https://zhuanlan.zhihu.com/p/166117109
>https://tensorflow.google.cn/api_docs/python/tf/distribute/experimental/ParameterServerStrategy

### parameterServer

Parameter server 异步更新策略是指每个 GPU 或者 CPU 计算完梯度后，无需等待其他 GPU 或 CPU 的梯度计算（有时可以设置需要等待的梯度个数），就可立即更新整体的权值，然后同步此权值，即可进行下一轮计算。Tensorflow2.0之后支持的parameterServer架构只能使用高级API estimator来搭建，而且注明了是部分支持，但目前并未遇到什么问题。

> 联系： keras和estimator都属于对模型的封装，都会封装模型的训练流程的代码。都有分布式的支持，还有dataset的支持;
> 区别：estimator在1.0中就有，主要的封装抽象在模型训练流程，需要自行定义模型结构。keras则对层次的模型训练流程都进行的抽象。当然，也可以使用keras对层次的封装来定义模型结构送到estimator中去使用。
> 实战中：如果是tf1.0, 建议使用estimator，2.0以上建议使用keras API

TensorFlow 一般将任务分为两类 job：
- 一类叫参数服务器，parameter server，简称为 ps，用于汇总梯度并更新参数列表；
- 一类就是普通任务，称为 worker，用于执行具体的计算。
- 这就要求作为PS的节点需要具有较强的通信能力，而作为worker的节点具有强大的计算能力。

在tensorflow2.0中，还需要定义一个chief节点，其功能主要是组内节点的调度并保存模型参数等。其架构如下图所示：

<img src="images/tensorflow/parameterserverarch.jpg">

#### tensorflow2.0分布式代码实践

1 导入需要的库

```python
import tensorflow as tf
import tensorflow.keras as keras
import os
os.environ['CUDA_VISIBLE_DEVICES'] = '0,1' # 指定该代码文件的可见GPU为第一个和第二个
import numpy as np
print(tf.__version__)#查看tf版本
gpus=tf.config.list_physical_devices('GPU')
print(gpus)#查看有多少个可用的GPU
```

2 使用keras.dataset API导入fashion_mnist数据集

```python
fashion_mnist = tf.keras.datasets.fashion_mnist

(train_images, train_labels), (test_images, test_labels) = fashion_mnist.load_data()

# 向数组添加维度 -> 新的维度 == (28, 28, 1)
# 我们这样做是因为我们模型中的第一层是卷积层
# 而且它需要一个四维的输入 (批大小, 高, 宽, 通道).
# 批大小维度稍后将添加。
train_images = train_images[..., None]
test_images = test_images[..., None]

# 获取[0,1]范围内的图像。
train_images = train_images / np.float32(255)
test_images = test_images / np.float32(255)

```

3 estimator要求的数据切割


```python
dataset = tf.data.Dataset.from_tensor_slices((train_images,train_labels))
#查看切割后的数据：

iterator = dataset.make_one_shot_iterator()
one_element = iterator.get_next()
with tf.Session() as sess:
    for i in range(5):
        print(sess.run(one_element))
```

4 定义数据输入函数input_fn

```python
def input_fn(X,y,shuffle, batch_size):
    dataset = tf.data.Dataset.from_tensor_slices((X,y))
    if shuffle: 
        dataset = dataset.shuffle(buffer_size=100000)
    dataset = dataset.repeat()
    dataset = dataset.batch(batch_size)
    return dataset
```

Dataset的常用Transformation操作：

```
dataset = tf.data.Dataset.from_tensor_slices(np.array([1.0, 2.0, 3.0, 4.0, 5.0]))
dataset = dataset.map(lambda x: x * x) # 1.0, 4.0, 9.0, 16.0, 25.0
```