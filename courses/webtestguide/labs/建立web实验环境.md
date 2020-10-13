# 建立web实验环境
> https://upcloud.com/community/tutorials/installing-snort-on-centos/


## 安装 centos 7

## 安装 apache web server

```sudo yum -y install httpd```

设置为开机启动

```sudo systemctl enable httpd.service```


手动启动Apache

```systemctl start httpd.service```

在浏览器中输入IP地址即可验证是否启动成功

安装目录:
- Apache默认将网站的根目录指向```/var/www/html```
- 默认的主配置文件```/etc/httpd/conf/httpd.conf```
- 配置存储在的```/etc/httpd/conf.d/```目录

### 开启端口访问权限

centos7中使用firewalld防火墙。

默认情况下所有端口都是关闭的。

为了访问apache web server，需要开启端口，例如：

```
[leo@localhost ~]$ sudo firewall-cmd --zone=public --add-port=80/tcp --permanent
[sudo] password for leo: 

success
```

```
[leo@localhost ~]$ sudo firewall-cmd --zone=public --add-port=8080/tcp --permanent
[sudo] password for leo: 

success
```

```
[leo@localhost ~]$ sudo firewall-cmd --zone=public --add-port=443/tcp --permanent
[sudo] password for leo: 

success
```

然后重新启动httpd: ``` sudo systemctl restart httpd.service```


## 安装配置 snort

### 安装依赖

```sudo yum install gcc flex bison zlib zlib-devel libpcap libpcap-devel pcre pcre-devel libdnet libdnet-devel tcpdump```

在安装snort的时候可能会报错：缺少libnghttp2.so.14()(64bit)
请尝试```sudo yum install epel-release -y```;```sudo yum install nghttp2```再次安装即可。

### 安装daq
```sudo yum install https://www.snort.org/downloads/snort/daq-2.0.6-1.centos7.x86_64.rpm```

### 安装snort

```sudo yum install https://www.snort.org/downloads/snort/snort-2.9.12-1.centos7.x86_64.rpm```

### 规则下载
Snort官方提供的三类规则：
- Community rules：无需注册or购买，可直接下载使用
- Registered rules：需要注册才可以下载（建议大家用这个，只需要注册即可,可以说是零成本）
- Subscriber rules：需要注册花钱购买

根据你下载的snort版本下载即可，这里我用的是最新版本即2.9.9.0，同样的对国内不是很友好，我已经上传至网盘。

tar -xvf snortrules-snapshot-<version>.tar.gz -C /etc/snort/rules


### 配置 snort

#### Configuring Snort to run in NIDS mode

首先更新共享库：```sudo ldconfig```

snort 在centos下安装在：
-  /usr/local/bin/snort 目录下

最好为其生成一个符号连接：```sudo ln -s /usr/local/bin/snort /usr/sbin/snort```

#### 设置用户名和文件夹结构

为了在centos上安全运行snort ，生成一个非特权用户和一个新的用户组。

```sudo groupadd snort```

```sudo useradd snort -r -s /sbin/nologin -c SNORT_IDS -g snort```


然后生成一个目录结构来存放snort配置。

```sudo mkdir -p /etc/snort/rules```

```sudo mkdir /var/log/snort```

```sudo mkdir /usr/local/lib/snort_dynamicrules```


设置目录权限

```bash
sudo chmod -R 5775 /etc/snortsudo 
chmod -R 5775 /etc/snort
sudo chmod -R 5775 /var/log/snort
sudo chmod -R 5775 /usr/local/lib/snort_dynamicrules
sudo chown -R snort:snort /etc/snort
sudo chown -R snort:snort /var/log/snort
sudo chown -R snort:snort /usr/local/lib/snort_dynamicrules
```

生成新文件，作为本地规则的白名单和黑名单：

```shell
sudo touch /etc/snort/rules/white_list.rules
sudo touch /etc/snort/rules/black_list.rules
sudo touch /etc/snort/rules/local.rules
```

如果使用源文件安装，那么使用下列命令从下载目录中拷贝出配置文件，如果使用yum安装则跳过下列命令。

```shell
sudo cp ~/snort_src/snort-2.9.12/etc/*.conf* /etc/snort
sudo cp ~/snort_src/snort-2.9.12/etc/*.map /etc/snort
```

下来你就可以下载检测规则，识别潜在威胁了。

### 使用社区规则

如果逆向快速测试snort，使用wget下载。

```wget https://www.snort.org/rules/community -O ~/community.tar.gz```


提取出规则，拷贝他们到配置文件夹。

```sudo tar -xvf ~/community.tar.gz -C ~/```

```sudo cp ~/community-rules/* /etc/snort/rules```

默认情况下，Snort在centos上希望找到一定量的不包含在社区规则集中不同规则文件。

```sudo sed -i 's/include \$RULE\_PATH/#include \$RULE\_PATH/' /etc/snort/snort.conf```

### 获取
