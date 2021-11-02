# systemd

> https://www.freedesktop.org/software/systemd/man/bootup.html


## 系统启动进程 bootup

### 描述

linux系统中的各个组件将在启动中被引入。 按下电源键之后，系统固件将启动最小化的硬件初始化， 并且通过一个 boot loader 来控制，例如 system-boot 或 grub。 他们存储在一个持久化的存储设备上。 

一般 boot loader 将从磁盘上或网络上调用 OS 内核。但在使用 EFI或别的类型的固件的系统上，固件可能直接调取内核。

内核（可选）mounts 一个内存文件系统，通常由 dracut 生成，来查找根文件系统。 如今，这个内存文件系统的实现通常是 一个initramfs ，一个压缩的归档，当内核启动时被提取到一个轻量级的基于tmpfs的内存文件。但是在过去，常规文件系统使用一个内存块设备（ramdisk），而且名字“intrd” 被用于描述两个概念。

这个启动loader或固件，会导入内核和initrd/initramfs 镜像到内存，并且内核将解析他作为一个文件系统。 systemd 可以被用于管理initrd中的服务，近似于一个真实系统。

在根文件系统被发现和mount 后，initrd 将控制权提交给存储在 root 文件系统中的 host‘s 系统管理器 systemd ，它负责探测所有剩余的硬件、mouting 必要的文件系统和 spanwning 所有的配置服务。

在关机时，系统管理器停止所有的服务，取消挂载所有的文件系统（detach 支持他的存储技术）然后跳回到 initrd 代码，卸载/分离根文件系统及驻留的存储。

最后一步是断电。

### system manager bootup

启动时，OS镜像上的系统管理负责初始化必要的文件系统、服务、驱动。


在 systemd 系统上，这个进程被划分为多个分离的步骤，这些步骤公开为 target unit。（参考 sytemd.target(5)）

启动过程是高度并行化的，因此到达特定目标单元的顺序不是确定型的，但仍遵循有限数量的排序结构。

当systemd 启动系统时，它会激活所有的 default.target 作为依赖项的单元。通常，default.target 只是 graphical.target 或 别名 multi-user.target， 具体取决系统是为图形用户界面配置还是仅为文本控制台配置。


The following chart is a structural overview of these well-known units and their position in the boot-up logic. The arrows describe which units are pulled in and ordered before which other units. Units near the top are started before units nearer to the bottom of the chart.



                             cryptsetup-pre.target veritysetup-pre.target
                                                  |
(various low-level                                v
 API VFS mounts:             (various cryptsetup/veritysetup devices...)
 mqueue, configfs,                                |    |
 debugfs, ...)                                    v    |
 |                                  cryptsetup.target  |
 |  (various swap                                 |    |    remote-fs-pre.target
 |   devices...)                                  |    |     |        |
 |    |                                           |    |     |        v
 |    v                       local-fs-pre.target |    |     |  (network file systems)
 |  swap.target                       |           |    v     v                 |
 |    |                               v           |  remote-cryptsetup.target  |
 |    |  (various low-level  (various mounts and  |  remote-veritysetup.target |
 |    |   services: udevd,    fsck services...)   |             |    remote-fs.target
 |    |   tmpfiles, random            |           |             |             /
 |    |   seed, sysctl, ...)          v           |             |            /
 |    |      |                 local-fs.target    |             |           /
 |    |      |                        |           |             |          /
 \____|______|_______________   ______|___________/             |         /
                             \ /                                |        /
                              v                                 |       /
                       sysinit.target                           |      /
                              |                                 |     /
       ______________________/|\_____________________           |    /
      /              |        |      |               \          |   /
      |              |        |      |               |          |  /
      v              v        |      v               |          | /
 (various       (various      |  (various            |          |/
  timers...)      paths...)   |   sockets...)        |          |
      |              |        |      |               |          |
      v              v        |      v               |          |
timers.target  paths.target   |  sockets.target      |          |
      |              |        |      |               v          |
      v              \_______ | _____/         rescue.service   |
                             \|/                     |          |
                              v                      v          |
                          basic.target         rescue.target    |
                              |                                 |
                      ________v____________________             |
                     /              |              \            |
                     |              |              |            |
                     v              v              v            |
                 display-    (various system   (various system  |
             manager.service     services        services)      |
                     |         required for        |            |
                     |        graphical UIs)       v            v
                     |              |            multi-user.target
emergency.service    |              |              |
        |            \_____________ | _____________/
        v                          \|/
emergency.target                    v
                              graphical.target

Target units that are commonly used as boot targets are emphasized. These units are good choices as goal targets, for example by passing them to the systemd.unit= kernel command line option (see systemd(1)) or by symlinking default.target to them.

timers.target is pulled-in by basic.target asynchronously. This allows timers units to depend on services which become only available later in boot.

### User manager startup
The system manager starts the user@uid.service unit for each user, which launches a separate unprivileged instance of systemd for each user — the user manager. Similarly to the system manager, the user manager starts units which are pulled in by default.target. The following chart is a structural overview of the well-known user units. For non-graphical sessions, default.target is used. Whenever the user logs into a graphical session, the login manager will start the graphical-session.target target that is used to pull in units required for the graphical session. A number of targets (shown on the right side) are started when specific hardware is available to the user.

    (various           (various         (various
     timers...)         paths...)        sockets...)    (sound devices)
         |                  |                 |               |
         v                  v                 v               v
   timers.target      paths.target     sockets.target    sound.target
         |                  |                 |
         \______________   _|_________________/         (bluetooth devices)
                        \ /                                   |
                         V                                    v
                   basic.target                          bluetooth.target
                         |
              __________/ \_______                      (smartcard devices)
             /                    \                           |
             |                    |                           v
             |                    v                      smartcard.target
             v            graphical-session-pre.target
 (various user services)          |                       (printers)
             |                    v                           |
             |       (services for the graphical session)     v
             |                    |                       printer.target
             v                    v
      default.target      graphical-session.target
### Bootup in the Initial RAM Disk (initrd)
The initial RAM disk implementation (initrd) can be set up using systemd as well. In this case, boot up inside the initrd follows the following structure.

systemd detects that it is run within an initrd by checking for the file /etc/initrd-release. The default target in the initrd is initrd.target. The bootup process begins identical to the system manager bootup (see above) until it reaches basic.target. From there, systemd approaches the special target initrd.target. Before any file systems are mounted, it must be determined whether the system will resume from hibernation or proceed with normal boot. This is accomplished by systemd-hibernate-resume@.service which must be finished before local-fs-pre.target, so no filesystems can be mounted before the check is complete. When the root device becomes available, initrd-root-device.target is reached. If the root device can be mounted at /sysroot, the sysroot.mount unit becomes active and initrd-root-fs.target is reached. The service initrd-parse-etc.service scans /sysroot/etc/fstab for a possible /usr/ mount point and additional entries marked with the x-initrd.mount option. All entries found are mounted below /sysroot, and initrd-fs.target is reached. The service initrd-cleanup.service isolates to the initrd-switch-root.target, where cleanup services can run. As the very last step, the initrd-switch-root.service is activated, which will cause the system to switch its root to /sysroot.

                                               : (beginning identical to above)
                                               :
                                               v
                                         basic.target
                                               |                                 emergency.service
                        ______________________/|                                         |
                       /                       |                                         v
                       |            initrd-root-device.target                    emergency.target
                       |                       |
                       |                       v
                       |                  sysroot.mount
                       |                       |
                       |                       v
                       |             initrd-root-fs.target
                       |                       |
                       |                       v
                       v            initrd-parse-etc.service
                (custom initrd                 |
                 services...)                  v
                       |            (sysroot-usr.mount and
                       |             various mounts marked
                       |               with fstab option
                       |              x-initrd.mount...)
                       |                       |
                       |                       v
                       |                initrd-fs.target
                       \______________________ |
                                              \|
                                               v
                                          initrd.target
                                               |
                                               v
                                     initrd-cleanup.service
                                          isolates to
                                    initrd-switch-root.target
                                               |
                                               v
                        ______________________/|
                       /                       v
                       |        initrd-udevadm-cleanup-db.service
                       v                       |
                (custom initrd                 |
                 services...)                  |
                       \______________________ |
                                              \|
                                               v
                                   initrd-switch-root.target
                                               |
                                               v
                                   initrd-switch-root.service
                                               |
                                               v
                                     Transition to Host OS
### System Manager Shutdown
System shutdown with systemd also consists of various target units with some minimal ordering structure applied:

                                  (conflicts with  (conflicts with
                                    all system     all file system
                                     services)     mounts, swaps,
                                         |           cryptsetup/
                                         |           veritysetup
                                         |          devices, ...)
                                         |                |
                                         v                v
                                  shutdown.target    umount.target
                                         |                |
                                         \_______   ______/
                                                 \ /
                                                  v
                                         (various low-level
                                              services)
                                                  |
                                                  v
                                            final.target
                                                  |
            _____________________________________/ \_________________________________
           /                         |                        |                      \
           |                         |                        |                      |
           v                         v                        v                      v
systemd-reboot.service   systemd-poweroff.service   systemd-halt.service   systemd-kexec.service
           |                         |                        |                      |
           v                         v                        v                      v
    reboot.target             poweroff.target            halt.target           kexec.target


Commonly used system shutdown targets are emphasized.

Note that systemd-halt.service(8), systemd-reboot.service, systemd-poweroff.service and systemd-kexec.service will transition the system and server manager (PID 1) into the second phase of system shutdown (implemented in the systemd-shutdown binary), which will unmount any remaining file systems, kill any remaining processes and release any other remaining resources, in a simple and robust fashion, without taking any service or unit concept into account anymore. At that point, regular applications and resources are generally terminated and released already, the second phase hence operates only as safety net for everything that couldn't be stopped or released for some reason during the primary, unit-based shutdown phase described above.

See Also
systemd(1), boot(7), systemd.special(7), systemd.target(5), systemd-halt.service(8), dracut(8)