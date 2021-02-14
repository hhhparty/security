# linux 环境变量
## 构成
Linux中环境变量可以简单的分成
- 用户自定义的环境变量
- 系统级别的环境变量。

用户级别环境变量定义文件：
- ~/.bashrc
- ~/.profile（部分系统为：~/.bash_profile）

系统级别环境变量定义文件：
- /etc/bashrc
- /etc/profile(部分系统为：/etc/bash_profile）
- /etc/environment


另外在用户环境变量中，系统会首先读取~/.bash_profile（或者~/.profile）文件，如果没有该文件则读取~/.bash_login，根据这些文件中内容再去读取~/.bashrc。

## 加载顺序

Linux加载环境变量的顺序如下：
- 1.系统环境变量 
 - 1.1 /etc/environment 
 - 1.2 /etc/profile
 - 1.3 /etc/bash.bashrc
 - 1.4 /etc/profile.d/**.sh 
- 2.用户自定义环境变量
 - ~/.profile
 - ~/.bashrc

从~/.profile文件中代码不难发现，/.profile文件只在用户登录的时候读取一次，而/.bashrc会在每次运行Shell脚本的时候读取一次。

## 小技巧
可以自定义一个环境变量文件，比如在某个项目下定义uusama.profile，在这个文件中使用export定义一系列变量，然后在~/.profile文件后面加上：sourc uusama.profile，这样你每次登陆都可以在Shell脚本中使用自己定义的一系列变量。

也可以使用alias命令定义一些命令的别名，比如alias rm="rm -i"（双引号必须），并把这个代码加入到~/.profile中，这样你每次使用rm命令的时候，都相当于使用rm -i命令，非常方便。

## Linux读取环境变量
读取环境变量的方法：

export命令显示当前系统定义的所有环境变量
echo $PATH命令输出当前的PATH环境变量的值

注：以冒号:分割不同的路径，使用export定义的时候可加双引号也可不加。