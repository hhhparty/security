# Metasploit-Framework

## MSF Install

For metasploit-framework 6.x：

1.`git clone https://github.com/rapid7/metasploit-framework.git`

2.`mv metasploit-framework /opt/` 然后`cd /opt/metasploit-framework/`

3.安装ruby: `sudo apt-get install ruby`

4.安装bundle: `sudo gem install bundle`

5.安装各种依赖: `sudo bundle install`

如果正常，会出现下列类似内容：

```
Bundle complete! 17 Gemfile dependencies, 174 gems now installed.
Use `bundle info [gemname]` to see where a bundled gem is installed.
Post-install message from openssl-cmac:
Thanks for installing!

```
6.执行`./msfconsole`，可以看到：

```
       =[ metasploit v6.0.29-dev-8eb75b0                  ]
+ -- --=[ 2097 exploits - 1127 auxiliary - 357 post       ]
+ -- --=[ 592 payloads - 45 encoders - 10 nops            ]
+ -- --=[ 7 evasion                                       ]

Metasploit tip: Use help <command> to learn more 
about any command

msf6 > 
```
7.安装开发环境需要的一些支持

```sudo apt install -y git autoconf build-essential libpcap-dev libpq-dev zlib1g-dev libsqlite3-dev```

8.安装postgresql，运行命令```sudo apt install -y postgresql postgresql-contrib postgresql-client```

启动 `sudo service postgresql start && sudo update-rc.d postgresql enable`

注意： 不要使用root启动服务。


运行命令`sudo systemctl status postgresql`查看服务是否启动。若启动则登录默认创建的postgres账户：

```bash
$ sudo su postgres
# 启动postgresql shell
$ psql
psql (9.5.24)
Type "help" for help.

postgres=# 
# \q 以退出，输入 \? 获取帮助。例如查看现有的所有表，输入\l

#建议修改postgres用户密码
# ALTER USER postgres WITH PASSWORD 'my_password';
# 或者使用\password postgres 
# 可先用弱口令123456作为测试例

```

9.初始化msfdb，运行`./msfdb`

这里可能会有问题。例如出现报错：“PG::ConnectionBad: FATAL:  password authentication failed for user "msf" FATAL:  password authentication failed for user "msf"... ”。

起初，我认为是msfdb（ruby程序）不对，将kali2020.1中的msfdb(shell脚本)拷贝到当前环境，还是出现这个问题。依次排查发现是执行db:migrate时无法认证。之后又认为是登录数据库的口令不对，查代码发现`DB_USER` msf 的口令`DB_PASS`是在msfdb执行时随机生成的32位数的base64编码，后被记录与`config/database.yaml`中。

如果抛开msfdb脚本，单纯使用Postgresql 的shell 登录命令：`psql -h localhost -U msf `，然后交互输入口令可以登录；如果不使用交互方式登录，则应使用`PGPASSWORD=口令 psql -h localhost -U msf` （crapy!）。

执行发生错误的命令是`bundle exec rake db:migrate`, 作用是将所有未实施的迁移任务都实施到目标数据库上。在已经生成config/database.yml后，可以通过db:migrate任务来避免直接使用SQL来操作数据库。rake会以任务形式执行 lib/tasks/databases.rake 。

后来查看了 https://github.com/rapid7/metasploit-framework/issues/9696 ，尝试将 config/database.yml 手动复制到 ~/.msf4/中，再次运行`sudo msfdb init`获得成功。看来是由于所用的msfdb脚本没有将配置文件拷贝到 ~/.msf4/下造成的。在脚本中加入一条`cp config/database.yml ~/.msf4/database.yml` 来缓解这个问题吧。


至此，metasploit-framework 6.x 安装完毕. 更多可以参考 https://github.com/rapid7/metasploit-framework/wiki/Setting-Up-a-Metasploit-Development-Environment#set-up-postgresql


### 可能发生的问题
#### 没有安装 gem

RubyGems is a sophisticated package manager for Ruby。

首先到 https://rubygems.org/pages/download 下载 gem。

然后，Unpack into a directory and cd there

最后，Install with: `sudo ruby setup.rb` (you may need admin/root privilege)

#### ruby 版本过低
例如：metasploit-framework-6.0.29 requires ruby version >= 2.5, which is incompatible with the current version.


```bash
sudo apt install gnupg2

#Install GPG keys:
gpg2 --recv-keys 409B6B1796C275462A1703113804BB82D39DC0E3 7D2BAF1CF37B13E2069D6956105BD0E739499BDB

# 说明：在 http://keyserver.ubuntu.com/ 搜索 rvm，可以找到 pub key 409B6B1796C275462A1703113804BB82D39DC0E3。

#或者可用下列命令
#gpg --keyserver hkp://keys.gnupg.net --recv-keys 409B6B1796C275462A1703113804BB82D39DC0E3 7D2BAF1CF37B13E2069D6956105BD0E739499BDB




#In case you encounter an issues or want to know more, check security
#Install RVM:
curl -sSL https://get.rvm.io | bash -s stable

#如上面命令出现报错：可使用 sudo vi /etc/hosts 在hosts文件中加入一行：199.232.28.133 raw.githubusercontent.com，之后再执行。

#For installing RVM with default Ruby and Rails in one command, run:

curl -sSL https://get.rvm.io | bash -s stable --rails
```

然后运行`rvm list known`查看已知ruby版本，然后运行 `rvm install 2.7`，提示输入口令，之后完成ruby升级。此ruby版本会安装在rvm/rubies目录下，而不是系统目录下。

如果要移动rvm命令到sudo安全路径下，例如：/usr/local/bin，那么：

```bash
mv rvm /usr/local

vim ~/.bash_profile 
# 进入后修改rvm相关的路径

vim ~/.bashrc
# 进入后修改rvm相关的路径

vim .profile
# 进入后修改rvm相关的路径
vim ~/.mkshrc
# 进入后修改rvm相关的路径
vim ~/.zlogin
# 进入后修改rvm相关的路径
```
之后重新打开一个bash shell。然后再编辑`sudo vim /etc/sudoers`，再secure_path中加入`:/usr/local/rvm/script/rvm:/usr/local/rvm/bin`

```
Defaults        secure_path="/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/snap/bin:/usr/local/rvm/script/rvm:/usr/local/rvm/bin"
```

之后`sudo rvm install 2.7`。

之后再将/usr/local/rvm/rubies/ruby-2.7.2/bin 加入 /etc/sudoers中的secure_path。

### 运行 bundle install 但无法执行


如果无法执行，可以考虑在bundle文件中修改文件内容. 例如：将 `#!/usr/bin/ruby23` 修改为 `#!//usr/local/rvm/rubies/ruby-2.7.2/bin/ruby`.

### 运行 bundle install 可执行但发生网络超时error

由于metasploit-framework 使用 Gemfile定义了安装详情，而其中默认的source无法在国内访问，所以需要改变原source内容为：
```source 'https://gems.ruby-china.com'```。此外，还需要运行下列命令，修改gem sources：```$ gem sources --add https://gems.ruby-china.com/ --remove https://rubygems.org/```。bundle 镜像也可以运行命令配置：```sudo bundle config mirror.https://rubygems.org https://gems.ruby-china.com```。

### 运行 bundle install 时发生ERROR: Failed to build gem native extension

#### checking for pg_config... no

缺少 postgresql相关支持，尝试安装下列组件：
```
sudo apt update
sudo apt install libpq-dev
gem install pg
```

#### fatal error: pcap.h: No such file or directory

缺少libpcap-dev和pcaprub，运行下列命令安装：

```bash
sudo apt install libpcap-dev
gem install pcaprub
```