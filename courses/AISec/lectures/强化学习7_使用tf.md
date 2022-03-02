# 强化学习 7 使用tensorflow

## 使用tf2解决强化学习 “CartPole-V0”

> source : [tensorflow 官方教程](https://tensorflow.google.cn/tutorials/reinforcement_learning/actor_critic)

下面的教程演示了如何使用tensorflow实现AC方法，来训练 Open AI Gym “CartPole-V0”环境中的一个agent。


### Actor - Critic 方法

Actor-Critic 方法使时间差分学习方法（ temporal difference (TD) learning ），它表示独立于价值函数的策略函数。

策略函数（policy function）返回一个各个动作上的概率分布，agent可以基于给定state执行这些action。

价值函数（value function）决定了agent从某个给定state开始后一直按照某个特定策略执行action（直到终止状态）的总的期望收益。

在Actor-Critic方法中，策略被称为actor，它在给定的某个state下，提出一组可能的actions，而预期的价值函数被称为 critic，它用于评估基于给定策略的actor执行的acions。

在本教程中，Actor和Critic都使用一个有两个输出的神经网络来表示。

### CartPole-v0
当连续100次试验中，平均总报酬达到195分时，这个问题就被认为“解决了”。

### 安装

安装必要的packages 和 配置全局设置
`pip install -q gym`

```
# Install additional packages for visualization
sudo apt-get install -y xvfb python-opengl > /dev/null 2>&1
pip install -q pyvirtualdisplay > /dev/null 2>&1
pip install -q git+https://github.com/tensorflow/docs > /dev/null 2>&1

```

设置全局变量
```python
import collections
import gym
import numpy as np
import tensorflow as tf
import tqdm

from matplotlib import pyplot as plt
from tensorflow.keras import layers
from typing import Any, List, Sequence, Tuple


# Create the environment
env = gym.make("CartPole-v0")

# Set seed for experiment reproducibility
seed = 42
env.seed(seed)
tf.random.set_seed(seed)
np.random.seed(seed)

# Small epsilon value for stabilizing division operations
eps = np.finfo(np.float32).eps.item()
```

### Model
Actor和Critic 分别用一个神经网络模型来表示。我们目标是训练模型，基于某个策略$\pi$选择actions，然后使期望return最大化。

对于Cartpole-v0，有四个value表达state：cart position, cart-velocity, pole angle, pole velocity。Agent 有2个动作：推车向左（0）、向右（1）.

```python
class ActorCritic(tf.keras.Model):
    """Combined actor-critic network."""
    def __init__(self,num_actions:int,num_hidden_units:int):
        """Initialize"""
        super(ActorCritic,self).__init__()
        self.common = layers.Dense(num_hidden_units,activation='relu')
        self.actor = layers.Dense(num_actions)
        self.critic = layers.Dense(1)
    
    def call(self,inputs:tf.Tensor) -> Tuple[tf.Tensor,tf.Tensor]:
        x = self.common(inputs)
        return self.actor(x),self.critic(x)

num_actions = env.action_space.n #2
num_hidden_units = 128

model = ActorCritic(num_actions,num_hidden_units)

```

### Train
为了训练agent，可以执行下列步骤：
- 1 在环境上运行代理以收集每轮（episode）的训练数据。
- 2 计算每个时间步的预期收益。
- 3 计算组合演员-评论家模型的损失。
- 4 计算梯度并更新网络参数。
- 5 重复1-4，直到达到成功标准或最大发作次数。

#### 收集训练数据

强化学习中的数据来自于 agent 在环境中的活动。在每个时间步，model在一个环境状态下前进（前向传递），为了生成 action 概率，并基于模型权重参数化的当前策略，评论价值。

下一个action将从模型生成的 action 概率中采样，这会引起环境state的改变并生成reward。

这个过程由run_episode函数实现，它使用了tf操作，使其之后可编译为一个tf graph来加速训练。注意 tf.TensorArray 用于支持可变长度数组上 Tensor 迭代。

```python

# 包装 openai gym的 ‘env.step' 调用，作为在tf 函数中的一个运算。
# 这将使期在可调用tf graph中被包含。

def env_step(action:np.ndarray)->Tupe[np.ndarray,np.ndarray,np.ndarray]:
    """Returns state, reward and done flag give an action."""
    state,reward, done,_=env.step(action)
    return (state.astype(np.float32),
            np.array(reward,np.int32),
            np.array(done,np.int32))
def tf_env_step(action:tf.Tensor)->List[tf.Tensor]:
    return tf.numpy_function(env_step,[action],[tf.float32,tf.int32,tf.int32])

def run_episode(
        initial_state:tf.Tensor, 
        model:tf.keras.Model,
        max_steps:int) -> List[tf.Tensor]:
    """Runs a single episode to collect training data."""
    action_probs = tf.TensorArray(dtype=tf.float32,size=0,dynamic_size=True)
    values = tf.TensorArray(dtype=tf.float32,size=0,dynamic_size=True)
    rewards = tf.TensorArray(dtype=tf.int32,size=0,dynamic_size=True)

    initial_state_shape = initial_state.shape
    state = initial_state

    for t in tf.range(max_steps):
        # 转换 state为一个batched tensor（batch size =1）
        state = tf.expand_dims(state,0)
        # 运行模型，得到action 概率 和 critic value
        action_logits_t , value = model(state) # 执行call(x)
        # 从action 概率分布中采样下一个action
        action = tf.random.categorical(action_logits_t,1)# 从action_logits_t给定的所有类型概率分布数组的对数值中，随机抽取1个
        action_probs_t = tf.nn.softmax(action_logits_t)# 使其符合概率分布

        # 存储 critic values
        values = values.write(t,tf.squeeze(value))

        # 存储所选 action 的 log 概率
        action_probs = action_probs.write(t,action_probs_t[0,action])

        # 执行 action 获得下一个 state 和 reward
        state,reward,done = tf_env_step(action)
        state.set_shape(initial_state_shape)

        # 存储reward
        rewards = rewards.write(t,reward)
        # 达到终止状态则退出本轮
        if tf.cast(done,tf.bool):
            break
        action_probs = action_probs.stack()
        values = values.stack()
        rewards = rewards.stack()

        return action_probs, values,rewards
```

#### 计算期望returns
我们将一轮（episode）中每一个时间步t , $t \in [1,T]$获得的奖励序列 rewards，乘以一个衰减因子$\gamma$，得到期望returns的序列：

$G_t = \sum_{t=i}^T \gamma^{t-i}r_t$ 

由于 $\gamma \in (0,1)$ 所以rewards从当前时间步开始，越来也小。直觉上（Intuitively），预期收益意味着现在的好于之后的。在数学意义上，它为了确保rewards的总和收敛（converges）。

为了稳定训练，我们也标准化了returns的结果序列。

```python
def get_expected_return(
        rewards: tf.Tensor,
        gamma: float,
        standardize: bool = True) -> tf.Tensor:
    """计算每个时间步的期望收益"""

    n = tf.shape(rewards)[0]
    returns = tf.TensorArray(dtype=tf.float32,size=n)
    # 从rewards尾部开始，累计 reward 的和，构成 returns 序列
    rewards = tf.cast(rewards[::-1],dtype=tf.float32)
    discounted_sum = tf.constant(0.0)
    discounted_sum_shape = discounted_sum.shape
    for i in tf.range(n):
        reward = rewards[i]
        discounted_sum = reward + gamma * discounted_sum
        discounted_sum.set_shape(discounted_sum_shape)
        returns = returns.write(i,discounted_sum)
    returns = returns.stack()[::-1]

    if standardize:
        returns = ((returns - tf.math.reduce_mean(returns)) /
                    (tf.math.reduce_std(returns) + eps))
    return returns
```

#### actor-critic loss
由于我们呢使用一个混合actor-critic model，我们将使用损失函数作为actor和critic损失函数的组合：

$L = L_{actor}+L_{critic}$
##### Actor loss
我们基于 policy gradients with the critic 作为一个state依赖的baseline，然后计算单一样本（每个episode）估计。

$L_{actor} = -\sum_{t=1}^T log\pi_\theta (a_t|s_t)[G(s_t,a_t) - V_\theta^\pi(s_t)]$

其中：
- T：每轮的时间步数量，不同的episode可能不同
- $s_t$：时间步 t 的状态。
- $a_t$: 时间步 t 给定state s下选择的action
- $\pi_\theta$：由$\theta $参数化的策略函数（actor）
- $V_\theta^\pi$: 由$\theta $参数化的价值函数（critic）
- $G = G_t$：时间步t时，给定state，action 序对的期望收益。

由于我们希望将服从更高收益的actions的概率最大化，所以我们令损失函数前前加一个符号，当其最小时即可达到目标。

##### Advantage
在我们$L_{actor}$中的$G-V$部分，被称为advantage，它指出了特定state下一个action 比根据策略$\pi$随机选择该state下的一个action要好多少。

此外，如果没有critic，该算法将在特定状态下根据预期收益的尝试增加行动的概率，如果行动之间的相对概率保持不变，这可能不会有太大差别。



例如，假设给定状态的两个 actions 将产生相同的预期回报。如果没有批评者，算法会根据目标 $J$ 来提高这些行为的概率。当存在 critic 时，结果可能是没有任何优势 $G-V = 0$，因此在增加动作的概率方面也没有好处，算法会将梯度设置为零。

##### Critic loss

训练V，使其尽可能接近 G 可以被视为一个回归问题：

$L_{critic} = L_{\delta} (G,V_\theta ^\pi)$

其中$L_{\delta}$是 Huber loss，它对于异常值（outliers）比平方误差损失函数有更小的敏感性。
#### 代码
```python

huber_loss = tf.keras.losees.Huber(reduction=tf.keras.losses.Reduction.SUM)

def compute_loss(
        action_probs:tf.Tensor,
        values:tf.Tensor,
        returns:tf.Tensor)->tf.Tensor:
    """"""
    advantage = returns - values

    action_log_probs = tf.math.log(action_probs)
    actor_loss = -tf.math.reduce_sum(action_log_probs * advantage)

    critic_loss = huber_loss(values, returns)
    return actor_loss + critic_loss
```

##### 定义训练步来更新参数

我们将把上面所有步骤整合入一个训练步中，它会在每轮运行。所有的步骤会使损失函数在`tf.GradientTape`上下文中被执行，以实现自动化的差分。

我们使用 Adam 优化器来求参数梯度。

我们使用tf.function 上下文到train_step函数，使得它可能被编译到一个可调用的tf graph，这会又10倍的增速。

```python
optimizer = tf.keras.optimizers.Adam(learning_rate=0.01)

@tf.function
def train_step(
        initial_state:tf.Tensor,
        model: tf.keras.Model,
        optimizer:tf.keras.optimizers.Optimizer,
        gamma:float,
        max_steps_per_episode:int) -> tf.Tensor:
    """Runs a model trainning step """
    with tf.GradientTape() as tape:
        # 运行一轮model，收集训练数据
        action_probs,values,rewards = run_episode(
            initial_state,model,max_steps_per_episode)
        
        # 计算期望收益
        returns = get_expected_return(rewards,gamma)

        # 转换训练数据为适合的tf张量 shapes
        action_probs,values,returns = [tf.expand_dims(x,1) for x in [action_probs,values,returns]]
        # Calculating loss values to update our network
        loss = compute_loss(action_probs, values, returns)

    # Compute the gradients from the loss
    grads = tape.gradient(loss, model.trainable_variables)

    # Apply the gradients to the model's parameters
    optimizer.apply_gradients(zip(grads, model.trainable_variables))

    episode_reward = tf.math.reduce_sum(rewards)

    return episode_reward
```

##### 运行训练循环

我们通过运行训练步骤来执行训练，直到达到成功标准或最大epicode数。

我们用一个队列来记录每个 epicode 的 rewards 。一旦达到100次试用，最老的rewards将从队列的左（尾）端移除，最新的rewards将添加到队列的右（头）端。为了提高计算效率，还保留了rewards的连续总和。

根据您的运行时间，培训可以在不到一分钟内完成。

```python

%%time

max_episodes = 10000
max_steps_per_episode = 1000

# Cartpole-v0 is considered solved if average reward is >= 195 over 100 
# consecutive trials
reward_threshold = 195
running_reward = 0

# Discount factor for future rewards
gamma = 0.99

with tqdm.trange(max_episodes) as t:
  for i in t:
    initial_state = tf.constant(env.reset(), dtype=tf.float32)
    episode_reward = int(train_step(
        initial_state, model, optimizer, gamma, max_steps_per_episode))

    running_reward = episode_reward*0.01 + running_reward*.99

    t.set_description(f'Episode {i}')
    t.set_postfix(
        episode_reward=episode_reward, running_reward=running_reward)

    # Show average episode reward every 10 episodes
    if i % 10 == 0:
      pass # print(f'Episode {i}: average reward: {avg_reward}')

    if running_reward > reward_threshold:  
        break

print(f'\nSolved at episode {i}: average reward: {running_reward:.2f}!')
```

### Visualization
After training, it would be good to visualize how the model performs in the environment. You can run the cells below to generate a GIF animation of one episode run of the model. Note that additional packages need to be installed for OpenAI Gym to render the environment's images correctly in Colab.

```python
# Render an episode and save as a GIF file

from IPython import display as ipythondisplay
from PIL import Image
from pyvirtualdisplay import Display


display = Display(visible=0, size=(400, 300))
display.start()


def render_episode(env: gym.Env, model: tf.keras.Model, max_steps: int): 
  screen = env.render(mode='rgb_array')
  im = Image.fromarray(screen)

  images = [im]

  state = tf.constant(env.reset(), dtype=tf.float32)
  for i in range(1, max_steps + 1):
    state = tf.expand_dims(state, 0)
    action_probs, _ = model(state)
    action = np.argmax(np.squeeze(action_probs))

    state, _, done, _ = env.step(action)
    state = tf.constant(state, dtype=tf.float32)

    # Render screen every 10 steps
    if i % 10 == 0:
      screen = env.render(mode='rgb_array')
      images.append(Image.fromarray(screen))

    if done:
      break

  return images


# Save GIF image
images = render_episode(env, model, max_steps_per_episode)
image_file = 'cartpole-v0.gif'
# loop=0: loop forever, duration=1: play each frame for 1ms
images[0].save(
    image_file, save_all=True, append_images=images[1:], loop=0, duration=1)

import tensorflow_docs.vis.embed as embed
embed.embed_file(image_file)
```