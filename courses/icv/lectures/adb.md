# ADB
## 模拟鼠标操作

`adb shell input mouse tap 980 700`


## 关闭或打开 selinux
在工程模式或用户debug版本中，可以设置 SELinux 成为permissive模式,临时关闭selinux的
- 关闭
`adb shell setenforce 0`
- 开启
`adb shell setenforce 1`

注意此方法重启后失效

查询当前权限状态命令：
`adb shell getenforce`

## 其他

https://technastic.com/adb-shell-commands-list/