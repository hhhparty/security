# Git 基本用法

## 概念

能区别 remote 、local、disk

## 方法一 适用于一个人的项目

1.在远端server 建一个repository，例如在github上建了一个名为abcd的repo；

2.使用 `git clone https://github.com/abcd` 拉取代码库到本地 （local）；

3.进入磁盘上的 abcd 目录，然后在里面进行编辑或修改，完成后使用 `git add .` 将磁盘上的文件加入到 local

4.使用 `git commit -m "message"` 将变更提交到local

5.使用 `git push origin master` 将local 提交到 remote

## 方法二 适合于标准多人项目开发

假设（初）：
- remote 当前有abcdk repository, 分支 main，状态 init;
- local 无;
- disk 无;

1.使用`git clone https://github.com/abcd` , 此后local/disk上会有abcd库的 main init；

2.为了便于多人协作和版本控制，local应当建立自己的branch 例如my-feature ，`git checkout -b my-feature`， 注意disk对branch这个概念无感，而local repository 则是将main 复制到 my-feature ，两者目前状态均为 init；

3.本地进行编辑或修改，修改后可以使用 `git diff` 查看改变前后的区别；

4.使用 `git add <文件名>` 将修改后的加入暂存区

5.使用 `git commit -m <message>` 将暂存区内容提交到local git repo，此时 local my-feature 分支的状态由 init 变为 update-1；

6.使用 `git push origin my-feature` 将 local 中的my-feature 分支提交给 remote abcd 库，此时remote 库中会出现my-feature 这个分支；

7.由于remote abcd库的main分支会不断变化，假设更改为 main-update，这是我们需要将my-feature 与main-update同步。这时本地要进行分支切换 `git checkout main`, 然后更新main，`git pull origin main`将remote 拉到本地；

8.然后切换分支`git checkout my-feature` ,然后将main中的更新同步到my-feature上，命令`git rebase main` 之后分支myfeature 状态为update-2，此时my-feature分支与main-update 结合了；

9.本地人工检查更改后是否可正常运行，如果代码有冲突需要自己手动解决，之后再次 add、commit，my-feature 分支状态变为update-3；

10.没问题后将local提交到remote `git push -f origin my-feature` ,这里是更改后的强推（覆盖），remote repp的分支my-feature 变为update-3 状态；

11.下面如有需要将 my-feature 合并到main，即进行new pull request （这是github上的操作），执行之后等待有权限执行合并的人审核；

12.审核后，特权账户则需要执行命令 `squash and merge` （github操作），目的是将分支所有改变合并为一个改变，然后commit到main，此时main状态为 main-update-2.

13.此后，如果remote上不需要my-feature 分支了，则可以使用 delete branch 删了它。

14.local如果要删除my-feature ，则先切换分支 `git checkout main`, 然后`git branch -D my-feature` 从local删掉

15.在local使用 `git pull origin main`将最新的main-update-2 下载到本地。

16.重复上述操作，完成代码管理。

