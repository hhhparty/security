# Linux 安全加固

## 防rookit

### 禁用LKM

为了防止knark、adore等LKM rookit


- （治标）临时方法：
```shell
echo 1>/proc/sys/kernel/modules/disabled

# 或者
sysctl -w kernel.modules_disabled=1

```

然后，编辑/etc/sysctl.conf文件，写入相关项。防止重启动时失效。

上面的方法在拿到root后，还是可以装载内核rootkit重启后开启LKM的。

- 治本，编译内核时去掉LKM支持

```shell
make config
Loadable module support?
找到Enable loadable module support ...选择n
```

如果机器需要经常变更驱动，那么治本的方法可能不适用；否则可以在系统建立之初使用这个方法。


## 限制 /dev/mem

新版本Linux默认都不再使用/dev/kmem这个文件，查看/boot目录下的config文件确保CONFIG_DEVKMEM设置为“n”；

```shell
cat config-`uname -r` |grep DEVKMEM 
```