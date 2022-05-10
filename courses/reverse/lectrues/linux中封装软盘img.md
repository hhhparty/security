Linux 下制作虚拟软盘镜像
3.5寸1.44M软盘结构：

    2面、80道/面、18扇区/道、512字节/扇区
    扇区总数=2面 X  80道/面 X  18扇区/道  =  2880扇区
    存储容量= 512字节/扇区X  2880扇区 =  1440 KB =1474560B

1. 创建虚拟软盘镜像文件
    下面三条命令中的任意一个可以建立一个虚拟的软盘镜像文件，结果完全一样：

    dd if=/dev/zero of=floppy.img bs=1474560 count=1
    dd if=/dev/zero of=floppy.img bs=512 count=2880
    dd if=/dev/zero of=floppy.img bs=1024 count=1440

2. 在软盘镜像文件上建立文件系统
    下面两条命令中的任意一个可在软盘镜像上建立文件系统，可根据需要选择相应的文件系统：

    mkfs.vfat floppy.img                /*建格式化为vfat文件系统*/
    mkfs.ext2 floppy.img                /*建格式化为ext2文件系统*/
    建立ext2文件系统时回询问： floppy.img is not a block special device. Proceed anyway? (y,n) y， 选y，回车。

3. 读写建立的软盘镜像
    首先将软盘镜像挂载在一个文件夹中，用下列命令建立一个文件夹floppy：

    mkdir floppy
    用下列命令将软盘镜像挂载到floppy文件夹：

    mount floppy.img floppy -o loop     /*是-o loop,而不是 -0 loop，而且一定是loop*/
    如果所用的系统不会自动识别文件系统的话 mount 命令要加上 -t 选项：

    mount floppy.img floppy -o loop -t vfat         /*如果软盘镜像为vfat文件系统*/
    mount floppy.img floppy -o loop -t ext2         /*如果软盘镜像为ext2文件系统*/
    然后就可以像操作普通文件夹那样对floppy文件夹进行操作了，如将 "kernel" 文件复制到里面：

    cp kernel floppy   
    查看其中的文件：
    ls floppy                                      /*  输出 "kernel"  */
    操作完以后用下列命令将其卸载：

    umount floppy.img
    这样前面的操作就已经完全写入虚拟软盘镜像文件中了。

如果在mount 步骤出现

mount: unknown filesystem type 'vfat'

的提示，则需要查看并重建

/lib/modules/2.6.xxx/modules.dep

使用用depmod重新生成modules.dep，重启

 