# Tensorflow 11 分布式训练
> 参考：
> https://tensorflow.google.cn/guide/distributed_training?hl=ch
> https://zhuanlan.zhihu.com/p/35083779

tf.distribute.Strategy是TensorFlow API，用于在多个GPU，多台机器或TPU之间分配培训。使用此API，您可以以最小的代码更改来分发现有模型和培训代码。

tf.distribute.Strategy 设计时考虑了以下主要目标：
- 易于使用并支持多个用户细分，包括研究人员，机器学习工程师等。
- 开箱即用地提供良好的性能。
- 轻松切换策略。

tf.distribute.Strategy可以与Keras之类的高级API一起使用，也可以用于分发自定义训练循环（以及通常使用TensorFlow进行的任何计算）。

在TensorFlow 2.x中，您可以Eager执行程序，也可以使用来在图形中执行程序tf.function。tf.distribute.Strategy打算同时支持这两种执行方式，但与`tf.function`配合使用效果最佳。仅建议将Eager模式用于调试目的，而不支持Eager模式TPUStrategy。尽管培训是本指南的重点，但该API也可以用于在不同平台上分发评估和预测。

您只需tf.distribute.Strategy很少改动即可使用代码，因为我们已将TensorFlow的基础组件更改为可感知策略。这包括变量，层，模型，优化器，指标，摘要和检查点。

`tf.distribute.Strategy` API 提供了多个处理单元的分布式训练抽象层。它的目标是允许用户使用现有的模型和训练代码，以最小改变来适应分布式训练。

`tf.distribute.Strategy` 可用于高级API 例如 Keras，也能用于分布的自定义循环。在TF2.0中，你可以使用eagerly执行`tf.distribute.Strategy`或使用`tf.function.tf.distribute.Strategy`的图执行`tf.distribute.Strategy`。

虽然分布式训练是本节重点，但也可以用于分布式评估和预测。

## `tf.distribute.Strategy` 策略类型


现支持的应用场景轴（axes）：
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

### ParameterServerStrategy

Parameter Server 训练是一种通用的数据并行方法，使模型训练可以扩展到多个机器。一个parameter server 训练集群由 workers 和 parameters servers构成。变量们将在 parameter server 中生成，而由 workers 在每一步中读取和更新。

TF2  parameter server 训练使用了一种基于架构的中心-协调器（central-coordinator），由`tf.distribute.experimental.coordinator.ClusterCoordinator` 类定义。

在这种实现中，worker 和 parameter server 任务运行 `tf.distribute.Server`s监听来自 coordinator 的任务。 这个 coordinator 生成 resouces，分派训练任务，写checkpoints，而且处理任务错误。

在coordinator的编程运行中，你将使用一个 ParameterServerStrategy 对象来定义一个学习步，并使用一个 `ClusterCoordinator` 来分派训练步到远程 workers。

下面使最简单的生成它们的方式：
```
strategy = tf.distribute.experimental.ParameterServerStrategy(
        tf.distribute.cluster_resolver.TFConfigClusterResolver(),
        variable_paritioner=variable_partitioner)
coordinator = tf.distribute.experimental.coordinator.ClusterCoordinator(strategy)
```

注意，如果使用`TFConfigClusterResolver`，你需要配置`TF_CONFIG`环境变量。这近似于`TF_CONFIG`在`MultiWorkerMirroredStrategy` 但有additional caveats。

在TF v1.x中，ParameterServerStrategy 仅在使用 estimator 的 `tf.compat.v1.distribute.experimental.ParameterServerStrategy` 时可用。



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

## Parameter Server Training

> source: https://tensorflow.google.cn/tutorials/distribute/parameter_server_training

tf的开发者相信这个架构和新的 `ClusterCoordinator`类提供了一种更灵活和简单的编程模型。

### ClusterCoordinator

ClusterCoordinator 类需要与 `tf.distribute.Strategy` 对象链接工作。`tf.distribute.Strategy` 对象被用于传递cluster信息，且被用于定义一个训练步，这如 `MirroredStrategy` 中的情况相同。ClusterCoordinator 对象分派这些训练步骤执行到远程workers。当前 ClusterCoordinator 仅与 `tf.distribute.experimental.ParameterServerStrategy` 一起工作。

由ClusterCoordinator对象提供的最重要的API是`schedule`。这个 schedule API 使 tf.function 入队，并立即返回一个 `RemoteValue`。这个队列化的函数将被分派到远程workers 的背景线程，而它的`RemoteValue`s 将被异步地填充。由于 Schedule 不要求 worker 指派，所以 tf.function 传递进来可被执行在任意可获得worker。如果worker 在它完成前变得不可用，那么这个函数将重新尝试让别的worker计算。因为函数执行的事实不是原子的，一个函数可以执行多次。

除了分派远程函数，ClusterCoordinator也用于生成所有workers上的数据集，并当某个worker返回失败时重建这些数据集。

### Tutorial Setup
`pip install -q portpicker`

```python
import multiprocessing
import os
import random
import portpicker
import tensorflow as tf
import tensorflow.keras as keras
import tensorflow.keras.layers.experimental.preprocessing as kpl
```
### Cluster Setup
如上所述，parameter server 训练 cluster，要求一个coordinator 运行你的训练程序任务，一个或多个workers 和 运行tf servers 任务的 parameter servers，例如：tf.distribute.Server。可能还需要一个评估任务（可以参考下面的 side-car 评估部分）。

- coordinator 任务需要直到所有别的tf servers的地址和端口，但不需要知道评估器的。
- workers 和 parameter servers 需要知道它们需要监听哪个端口。简单起见，我们在生成tf servers执行任务时，通常传递完整的cluster 信息。
- 评估任务不需要知道训练cluster的安装信息，他不应该尝试连接训练服务器。
- workers 和 parameter servers 应该有诸如 “worker” 和 “ps”的任务类型。coordinator 应当使用 “chief” 作为任务类型（历史原因）。

下面我们生成一个 in-process cluster，使得整个 parameter server训练可以在colab中运行起来。

#### in-process cluster
```python
def create_in_process_cluster(num_workers, num_ps):
    """Creates and starts local servers and returns the cluster_resolver."""
    worker_ports = [portpicker.pick_unused_port() for _ in range(num_workers)]
    ps_ports = [portpicker.pick_unused_port() for _ in range(num_ps)]

    cluster_dict = {}
    cluster_dict["worker"] = ["localhost:%s" % port for port in worker_ports]
    if num_ps > 0:
        cluster_dict["ps"] = ["localhost:%s" % port for port in ps_ports]

    cluster_spec = tf.train.ClusterSpec(cluster_dict)
    print(cluster_spec)
    # Workers need some inter_ops threads to work properly.
    worker_config = tf.compat.v1.ConfigProto()
    if multiprocessing.cpu_count() < num_workers + 1:
        worker_config.inter_op_parallelism_threads = num_workers + 1

    for i in range(num_workers):
        tf.distribute.Server(
            cluster_spec, job_name="worker", task_index=i, config=worker_config,
            protocol="grpc")

    for i in range(num_ps):
        tf.distribute.Server(
            cluster_spec, job_name="ps", task_index=i, protocol="grpc")

    cluster_resolver = tf.distribute.cluster_resolver.SimpleClusterResolver(cluster_spec, rpc_layer="grpc")
    return cluster_resolver

# Set the environment variable to allow reporting worker and ps failure to the
# coordinator. This is a workaround and won't be necessary in the future.
os.environ["GRPC_FAIL_FAST"] = "use_caller"

NUM_WORKERS = 3
NUM_PS = 2
cluster_resolver = create_in_process_cluster(NUM_WORKERS, NUM_PS)
```

### 使用自定义的迭代完成训练

使用`tf.distribute.Strategy`的自定义训练loop提供了更为灵活的定义训练迭代的方法。在当前tf2中的 parameter server 训练，仅自定义的训练循环是被支持的。这里我们呢使用了 `ParameterServerStrategy`来定义一个训练步，然后使用ClusterCoordinator 分派训练步的执行到远程workers。

#### 生成 ParameterServerStrategy

为写一个在自定义训练loop中的训练步，第一步是生成ParameterServerStrategy。

```python
#tf 2.4.1
variable_partitioner = (
    tf.distribute.experimental.partitioners.FixedShardsPartitioner(
        num_shards=NUM_PS))

strategy = tf.distribute.experimental.ParameterServerStrategy(
    cluster_resolver,
    variable_partitioner=variable_partitioner)

```
之后如果你可以生成一个model，定义一个数据集和一个step函数。

##### 设置data
首先我们写一个函数生成dataset，它会包含使用keras预处理层的预处理逻辑。我们将生成除dataset_fn之外的一些layers ，但是应用transformation 在 dataset_fn中。由于你要把dataset_fn包装在tf.function中. tf.function中不允许变量在其中生成。

```python
feature_vocab = [
    "avenger", "ironman", "batman", "hulk", "spiderman", "kingkong",
    "wonder_woman"
]
label_vocab = ["yes", "no"]

with strategy.scope():
  feature_lookup_layer = kpl.StringLookup(vocabulary=feature_vocab)

  label_lookup_layer = kpl.StringLookup(vocabulary=label_vocab,
                                        num_oov_indices=0,
                                        mask_token=None)

  raw_feature_input = keras.layers.Input(
      shape=(3,), dtype=tf.string, name="feature")
  feature_id_input = feature_lookup_layer(raw_feature_input)
  feature_preprocess_stage = keras.Model(
      {"features": raw_feature_input}, feature_id_input)

  raw_label_input = keras.layers.Input(
      shape=(1,), dtype=tf.string, name="label")
  label_id_input = label_lookup_layer(raw_label_input)
  label_preprocess_stage = keras.Model({"label": raw_label_input}, label_id_input)
```

未完


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