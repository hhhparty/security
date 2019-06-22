# docker的安装与使用

## centos 7 docker安装

### 前提条件检查

运行 uname -r 查看系统版本

docker要求centos 内核版本高于3.10.

### 安装docker

docker 软件包和依赖已经包含在centos-extras软件源里，安装命令：
```
yum -y install docker
```
需要root权限。

### 查看docker版本

```
docker version
```

### 启动docker

#### 方式1 

```
service docker start
```

#### 方式2 

```
systemctl start docer.service
ps aux| grep docker
```

### 建立docker用户和组

#### 创建用户及组

默认情况下，docker 命令会使用 Unix socket 与 Docker 引擎通讯。而只有 root 用户和 docker 组的用户才可以访问 Docker 引擎的 Unix socket。出于安全考虑，一般 Linux 系统上不会直接使用 root 用户。因此，更好地做法是将需要使用 docker 的用户加入 docker 用户组。

```
groupadd docker
useradd -g docker docker

```

#### 使用新创建的用户运行helloworld

切换用户到docker
```
su docker
```
> 可以从root修改docker密码后，再切换.

```
[docker@bigdata ~]$ docker run hello-world
```

如果出现“/usr/bin/docker-current: error pulling image configuration..."的报错，一般是无法连接到docker hub。使用root身份运行下列命令：

```
cat /etc/sysconfig/docker
```
在文件中添加以下内容：

--registry-mirror=http://f2d6cb40.m.daocloud.io

重启docker,即运行：service docker restart。

再次运行上述命令：docker run hello-world

### 安装你所需的镜像

使用 docker pull 命令。

#### 安装 mysql镜像

运行下列命令：
```
[docker@sma001 root]$ docker pull mysql:5.5
```
#### 安装fbctf

先安装git
```
yum install git

```
单容器安装

```
git clone https://github.com/facebook/fbctf
cd fbctf
source ./extra/lib.sh
quick_setup start_docker prod or quick_setup start_docker dev
```

多容器安装Multi-Container Docker Startup
From the system you wish to launch the platform, execute the following:
```
git clone https://github.com/facebook/fbctf
cd fbctf
source ./extra/lib.sh
quick_setup start_docker_multi prod or quick_setup start_docker_multi dev
```
### 查看本地已有镜像

运行命令：
```
docker image ls
```

镜像（Image）和容器（Container）的关系，就像是面向对象程序设计中的 类 和 实例 一样，镜像是静态的定义，容器是镜像运行时的实体。容器可以被创建、启动、停止、删除、暂停等。

### 运行容器

有了镜像后，我们就能够以这个镜像为基础启动并运行一个容器。

```
[docker@bigdata ~]$ docker run -it --rm mysql bash
```

-i：交互式操作，一个是 
-t 终端。我们这里打算进入 bash 执行一些命令并查看返回结果，因 此我们需要交互式终端。
--rm：这个参数是说容器退出后随之将其删除。默认情况下，为了排障需求，退出的容器并不会立即删除，除非手动 docker rm。我们这里只是随便执行个命令，看看结果，不需要排障和保留结果，因此使用 --rm 可以避免浪费空间。
centos ：这是指用centos  镜像为基础来启动容器。
bash：放在镜像名后的是命令，这里我们希望有个交互式 Shell，因此用的是 bash。

进入容器后，我们可以在 Shell 下操作，执行任何所需的命令。这里，我们执行了 cat /etc/os-release，这是 Linux 常用的查看当前系统版本的命令，从返回的结果可以看到容器内是 CentOS Linux 系统。
最后我们可以通过 exit 退出了这个容器

### 查看镜像、容器、数据卷所占用的空间

```
[docker@bigdata ~]$ docker system df
```

### 查看当前docker进程

```
docker ps: 查看当前运行的容器
docker ps -a:查看所有容器，包括停止的
```

标题含义：

CONTAINER ID:容器的唯一表示ID。
IMAGE:创建容器时使用的镜像。
COMMAND:容器最后运行的命令。
CREATED:创建容器的时间。
STATUS:容器状态。
PORTS:对外开放的端口。
NAMES:容器名。可以和容器ID一样唯一标识容器，同一台宿主机上不允许有同名容器存在，否则会冲突。

使用命令停止并删除这个容器就可以

```
docker kill 容器名

docker rm 容器名
```

### 运行容器

#### 使用命令运行容器

下面的例子是，以centos镜像启动一个容器，容器名是hadoop1，主机名是hadoop1，并且将基于容器的centos系统的/root/build目录与本地/home/docker/build共享。

```
[docker@bigdata ~]$ docker run -it -v /home/docker/build:/root/build --privileged -h hadoop1 --name hadoop1 centos /bin/bash
```
参数解释：

-v 表示基于容器的centos系统的/root/build目录与本地/home/hadoop/build共享；这可以很方便将本地文件上传到Docker内部的centos系统；
-h 指定主机名为hadoop1
–-name  指定容器名
/bin/bash  使用bash命令

### 在运行的容器中安装软件

刚安装的系统非常纯净，需要安装必备的软件，方法与普通系统一致。

可以上传软件到容器里面，例如将JDK上传到某个docker 中，然后将其移动到/home/docker/build文件夹下面，注意要使用root用户。

```
[root@bigdata docker]# mv jdk-8u73-linux-x64.tar.gz build/
```
然后，进入容器里面的/root/build文件夹下面进行查看
```
[root@hadoop1 /]# cd /root/build/
[root@hadoop1 build]# ls
```

### 保存镜像已安装自定义软件后的docker

保存镜像
基于已有的docker容器，做一新的dokcer image.
```
$ docker commit <container_id> <image_name>
```
