# Docker 应用笔记

## mongodb

1.安装 centos 虚拟机系统

2.安装 docker

```sudo yum install docker```

之后重启系统后，可能需要每次使用docker前运行:

```sudo systemctl start docker.service```

3.pull mongo

```sudo docker search mongo```

```sudo docker pull mongo```


4.运行mongo

``` docker run -d -p 27017:27017 --name mongodb -e MONGO_INITDB_ROOT_USERNAME=admin -e MONGO_INITDB_ROOT_PASSWORD=mongoadmin mongo:4.1.6```

```docker run -it --restart=always --name mongo-express --link mongodb:mongo-db -d -p 8081:8081 -e ME_CONFIG_OPTIONS_EDITORTHEME="3024-night" -e ME_CONFIG_BASICAUTH_USERNAME="mongoexpress" -e ME_CONFIG_BASICAUTH_PASSWORD="mongoexpress" -e ME_CONFIG_MONGODB_ADMINUSERNAME="mongoadmin" -e ME_CONFIG_MONGODB_ADMINPASSWORD="mongoadmin" mongo-express```

先创建```mkdir -p ~/docker/mongo/conf && mkdir -p ~/docker/mongo/data```，准备将mongo 容器中的数据挂载到这个目录中。

可以先查看一下mongo docker中数据目录和配置目录，一般为/data/db和/etc/mongod.conf.orig

docker run --name some-mysql -v ~/docker/mongodb/conf:/etc/mongod.conf.orig -d mongo

```docker run -d -p 27017:27017 -v ~/docker/mongodb/conf:/etc  -v ~/docker/mongodb/data:/data/db mongo mongod --auth```

```sudo docker run --name mongodbserver -p 27017:27017 --mount type=bind,src=~/docker/mongodb/conf,dst=/data/configdb --mount type=bind,src=~/docker/mongodb/data, dst=/data/db --restart=on-failure:3 -d mongo```

```docker run --name mongodb -v ~/docker/mongo:/data/db -p 27017:27017 -d mongo```

```sudo docker run --rm -itd --name mongo -h 10.10.10.132  -p 27017:27017 mongo --auth```

运行后会出现一串hash数。

5.查看进程

```sudo docker ps |grep mongo```

6.添加用户和密码，并尝试连接

```sudo docker exec -it mongo mongo admin```

运行上述命令后会出现一个“>”提示符。然后再运行下列命令：
```
# 创建一个名为 admin，密码为 123456 的用户。
>  db.createUser({ user:'admin',pwd:'123456',roles:[ { role:'userAdminAnyDatabase', db: 'admin'}]});
# 尝试使用上面创建的用户信息进行连接。
> db.auth('admin', '123456')
```

结果显示“Successful”和“1”，表示成功建立用户和登录成功。

7.查看dbs
```> show dbs```

8.切换到某个dbs
```> use local```

9.显示collections
```> show collections```

10.查看某个collection的内容
```> db.startup_log.find()```

11.配置外部文件

在centos宿主机中建立mongo.conf文件
```vi ~/docker/mongo.conf```

内容：
```
# mongod.conf

# for documentation of all options, see:
#   http://docs.mongodb.org/manual/reference/configuration-options/

# Where and how to store data.
storage:
  dbPath: /var/lib/mongodb
  journal:
    enabled: true
#  engine:
#  mmapv1:
#  wiredTiger:

# where to write logging data.
systemLog:
  destination: file
  logAppend: true
  path: /var/log/mongodb/mongod.log

# network interfaces
net:
  port: 27017
  bindIp: 0.0.0.0


# how the process runs
processManagement:
  timeZoneInfo: /usr/share/zoneinfo

#security:

#operationProfiling:

#replication:

#sharding:

## Enterprise-Only Options:

#auditLog:

#snmp:
```

```docker run --name mongoserver  -v ~/docker/mongo.conf:/etc/mongo.conf.orig -d mongo```

## 删除所有已停容器

```docker ps -q | xargs docker rm```