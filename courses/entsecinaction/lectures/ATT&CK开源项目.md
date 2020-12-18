# ATT&CK 开源项目介绍

## ATT&CK Navigator
这个项目对ATT&CK矩阵提供了基本的导航和标记，就像有些人用excel来表示ATT&CK矩阵一样。但是这个工具更为灵活，你可以在上面以可视化的方法进行做防御技术覆盖，检查防护差距；也可以在上面制定红队、蓝队计划；还有检测技术的覆盖度等等。


### 安装

#### 安装nodejs

Linux 上安装 Node.js, 直接使用已编译好的包
[Node 官网已经把 linux 下载版本](https://nodejs.org/en/download/)更改为已编译好的版本了，我们可以直接下载解压后使用：

```bash
# wget https://nodejs.org/dist/v10.9.0/node-v10.9.0-linux-x64.tar.xz    // 下载
# tar xf  node-v10.9.0-linux-x64.tar.xz       // 解压
# cd node-v10.9.0-linux-x64/                  // 进入解压目录
# ./bin/node -v                               // 执行node命令 查看版本
v10.9.0
```

解压文件的 bin 目录底下包含了 node、npm 等命令，我们可以使用 ln 命令来设置软连接：

```bash
ln -s /usr/software/nodejs/bin/npm   /usr/local/bin/ 
ln -s /usr/software/nodejs/bin/node   /usr/local/bin/
```
可选操作：配置nodejs的数据源为国内淘宝数据源。
```npm config set registry https://registry.npm.taobao.org```

```npm install -g cnpm --registry=https://registry.npm.taobao.org```

说明：使用第一种方式配置，继续使用npm命令进行操作时，会从淘宝数据源下载；如果使用第二种方式配置，则需要使用cnpm命令（在使用的时候将npm变成cnpm）
#### 安装angular

在命令行键入```npm install -g @angular/cli```或者`npm install -g @angular/cli@7.2.0`指定安装版本

根据实际安装位置设置到/usr/bin的连接：`sudo ln -s /usr/local/nodejs/lib/node_modules/@angular/cli/bin/ng /usr/bin`，使ng命令全局可用

安装成功后输入 `ng v`查看安装是否成功，若出现版本信息则说明安装成功

如果版本安装错误
`npm uninstall -g @angular/cli` 卸载之前的版本
`npm cache verify` 清理缓存，确保卸载干净
` ng v` ，若显示类似command not found的信息，则说明卸载完成
#### 开启防火墙
```sudo firewall-cmd --permanent  --add-port=4200/tcp```

```sudo firewall-cmd --reload```


#### 安装navigator  （Install and Run）
##### First time
- Navigate to the nav-app directory
- ```Run npm install```

- Serve application on local machine，Run ```ng serve``` within the nav-app directory
- Navigate to localhost:4200 in browser

##### Compile for use elsewhere
Run ng build within the nav-app directory
Copy files from nav-app/dist/ directory
Running the Navigator offline
Install the Navigator as per instructions above.
Follow instructions under loading content from local files to configure the Navigator to populate the matrix without an internet connection. For enterprise-attack, use this file. For mobile-attack, use this file. For pre-attack, use this file.
Common issues
If serving or compiling the application gives the warning Module not found: can't resolve 'fs', run the command npm run postinstall. The postinstall step usually runs automatically after npm install to patch the fs issue, but in some environments it must be run manually.

#### 使用
使用Navigator 在国内是困难的。需要下载CTI库。

下载后解压其中的Enterprise部分，放入 /nav-app/src/assets/enterprise-attack/ 中，然后修改/nav-app/src/assets/config.json中enterprise内容：

```json
{
    "versions": [
        {
            "name": "ATT&CK v8", 
            "domains": [
                {   
                    "name": "Enterprise", 
                    "data": ["assets/enterprise-attack/enterprise-attack.json"]
                },
                {   
                    "name": "Mobile", 
                    "data": ["https://raw.githubusercontent.com/mitre/cti/ATT%26CK-v8.1/mobile-attack/mobile-attack.json"]
                },
                {
                    "name": "ICS",
                    "data": ["https://raw.githubusercontent.com/mitre/cti/ATT%26CK-v8.1/ics-attack/ics-attack.json"]
                }
            ]
        },
        ...
```

然后在控制台中，进入nav-app目录，然后运行ng serve 命令：```leo@ubuntu:~/Downloads/attack-navigator-master/nav-app$ ng serve --host 0.0.0.0```

可能会报错:```Error from chokidar (/home/leo/Downloads/attack-navigator-master/nav-app/src/assets/enterprise-attack/relationship): Error: ENOSPC: System limit for number of file watchers reached, ...```


这就需要增加max_user_watches。先查看一下```cat /proc/sys/fs/inotify/max_user_watches ``` 发现是8192。

用下列命令临时修改为102400.

```bash
$ sudo sysctl fs.inotify.max_user_watches=102400
fs.inotify.max_user_watches = 1024000
$ sudo sysctl -p
```
永久增加限额，可以使用下列方法：
```bash
$ echo fs.inotify.max_user_watches=102400 | sudo tee -a /etc/sysctl.conf 
$ sudo sysctl -p

```

### 基本概念
CTI是威胁情报库（The Cyber Threat Intelligence Repository of ATT&CK and CAPEC catalogs），使用STIX 2.0 json 格式描述威胁情报。查看如何使用可以参考[python-stix2](https://github.com/oasis-open/cti-python-stix2).


#### STIX
结构化威胁信息表达式 Structured Threat Information Expression (STIX™) 是一种语言和序列化格式，用于交换网络安全威胁情报（CTI）.

STIX 使用了一致的机器可读的格式，有助于在组织间共享，有助于社区更好理解基于计算机的攻击，同时更好的支持应急响应，使之更有效更快捷。

STIX旨在提高多个能力，例如协作威胁分析、自动化威胁交换、自动化的检测和响应等等。

https://oasis-open.github.io/cti-documentation/

#### CAPEC
理解敌方如何攻击，在网络安全中是必要的。CAPEC通过提供一个综合的已知的敌方渗透攻击模式字典，可帮助分析人员、开发者、测试人员、教育人员加强理解和防护。

它有几个特点：
- 关注应用安全
- 枚举了各种漏洞系统的渗透方式
- 包括社会工程和供应链
- 与CWE相关联(Common Weakness Enumeration ) 
- 
- https://capec.mitre.org/