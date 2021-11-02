# Plymouth

Plymouth 是在booting 或shutting down过程中提供图像化splash的一种应用。

在ubuntu中，Plymouth是 /dev/console 的 owner，所以 booting 和 shutting down 过程中无人可以修改 /dev/console.

## 快速了解

- 使用 KMS （kernel mode setting）和 framebuffer 来设置 screen resolution
- 由3个组件组成：
  - A daemon （server） process ，called plymouthd，这个进程负责图形显示、动画和logging。
  - 一个客户端应用，成为plymouth，用于向daemon发送命令
  - A library libply.so to allow applications to be written to talk to the daemon. (The plymouth command is linked to libply.so for this reason).

- Supports themes. 
- Is scriptable (see package plymouth-theme-script)

- Runs at system startup and system shutdown:
  - Boot
    - plymouthd is generally started in the initramfs (see file /usr/share/initramfs-tools/scripts/init-top/plymouth)
    - plymouthd is stopped at the point the Display Manager is starting. (see Upstart job configuration file file /etc/init/plymouth-stop.conf).

  - Shutdown
    - plymouthd is started by Upstart (see Upstart job configuration file file /etc/init/plymouth.conf).

Writes a log to /var/log/boot.log.


## Options

### DAemon
plymoutd 运行在四种模式之一下，可以通过适当的命令行选项进行设置。

- --mode=boot
- --mode=shutdown
- --mode=suspend
- --mode=resume

这些选项，允许plymouth显示不同的内容，基于是否系统在启动或停止。

### Startup

plymouthd daemon 尝试在启动时读取下列文件 （它找到的第一个文件优先于其他的）

- General configuration
  - /etc/plymouth/plymouthd.conf
  - /lib/plymouth/plymouthd.defaults
- splash theme
  - /lib/plymouth/themes/default.plymouth


### splash theme

Contents of /lib/plymouth/themes/default.plymouth:

```
  [Plymouth Theme]
  Name=Ubuntu Logo
  Description=A theme that features a blank background with a logo.
  ModuleName=script

  [script]
  ImageDir=/lib/plymouth/themes/ubuntu-logo
  ScriptFile=/lib/plymouth/themes/ubuntu-logo/ubuntu-logo.script
```

This tells plymouthd to use the "script" splash plugin. This plugin allows the graphical splash experience to be scripted using Plymouths own scripting language (hence the name).

The "script" splash plugin exists as /lib/plymouth/script.so (source code: src/plugins/splash/script/script.c)

"ImageDir" tells plymouthd which directory contains the images used by the "Ubuntu Logo" theme.

"ScriptFile" is the full path to the Plymouth script which creates the splash experience.

## TEST

### 测试 plymouth 可以运行在 initramfs

1. Add "break=init" to the kernel command-line and boot.

2. Chroot to the real filesystem:
    chroot /root
Some warning messages will be displayed, but can be ignored:
    bash: cannot set terminal process group (-1): Inappropriate ioctl for device
    bash: no job control in this shell
3. Start the daemon:
    plymouthd --tty=`tty` --mode=boot --kernel-command-line="quiet splash"
4. Check the daemon is running
    plymouth --ping && echo plymouth is running || echo plymouth NOT running
5. Tell the daemon to display the splash screen:
    plymouth show-splash

If this works, to exit the splash screen you'll have to type the following "blind" (and not that backspace won't work, but CONTROL-c will):

  `plymouth exit`
To shutdown your system:

Remount the disk read-only:
    `mount -oremount,ro /`

Power off the system.

Note that "shutdown -h now or "halt" cannot be used since Upstart is not running in this scenario.

Checking Plymouth Can Run Early in Boot
Add "init=/bin/sh" to the kernel command-line and boot.

A warning message will be displayed, but can be ignored:
    /bin/sh: 0: can't access tty: job control turned off
Start the daemon:
    plymouthd --tty=`tty` --mode=boot --kernel-command-line="quiet splash"
Check the daemon is running
    plymouth --ping && echo plymouth is running || echo plymouth NOT running
Tell the daemon to display the splash screen:
    plymouth show-splash
If this works, to exit the splash screen you'll have to type the following "blind" (and not that backspace won't work, but CONTROL-c will):

  `plymouth exit`
To shutdown your system:

Flush any pending data:
    sync;sync;sync
Remount disk read-only:
    mount -oremount,ro /
Power off the system.
Note that "shutdown -h now or "halt" cannot be used since Upstart is not running in this scenario.

### Running Plymouth "post-boot"
You can experiment with Plymouth after your system has booted. To start the Plymouth daemon:

Boot system and login as usual
(i) [RECOMMENDED] Install plymouth-x11 package (allows you to see the boot screen in an X11 window)

`sudo apt-get install plymouth-x11`

Start a terminal (such as gnome-terminal)

Start the Plymouth daemon by running the following:
sudo plymouthd --debug --tty=`tty` --no-daemon

Plymouth is now running, so we can have some fun:

To check if Plymouth really is running:

sudo plymouth --ping && echo plymouth is running || echo plymouth NOT running

To show a message on our "boot" screen
Start another gnome-terminal terminal/tab

Run the following to show the Plymouth window:

`sudo plymouth show-splash`

Display a message
sudo plymouth message --text="hello world"

A slightly more useful example
Show the splash screen
sudo plymouth show-splash

Stop the graphical progress indicator
sudo plymouth pause-progress

Display a message
sudo plymouth message --text="pausing boot - press 'c' or space bar to continue"

Wait for the user to type either 'c', 'C' or space (no return required)
sudo plymouth watch-keystroke --keys="cC " --command="tee /tmp/c_key_pressed"

Change the on-screen message
sudo plymouth message --text="resuming boot"

Resume the graphical progress indicator
sudo plymouth unpause-progress

Note that when you run the "show-splash" command, two windows pop up. This is because Plymouth simulates a dual-monitor setup.

To stop the Plymouth daemon:

sudo plymouth --quit

Debugging
Warning /!\ This section is for advanced users only.

Toggling to Traditional Text-based Boot
If you want to see the text-based boot messages (which use the Plymouth "details" plugin, press the ESCAPE key at any point when Plymouth is running. Note that the ESCAPE key acts as a toggle, so you can keep switching between graphical and text mode as required.

To have the boot start in "text mode" as early as possible, remove "splash" from the kernel command-line in grub.

To make the change permanent, update /etc/default/grub and run "sudo update-grub".


Updating the grub configuration manually is a potentially dangerous operation and can result in a machine that fails to boot without intervention. Do not attempt it unless you understand exactly what you are doing.

Enabling Debugging
You can set Plymouth to overlay internal debug messages (which will also be logged to a file) by adding the following command-line option to grub:

plymouth:debug

For example, if you are running Ubuntu Natty (11.04) or Oneiric (11.10):

Power on system.
Hold down the CONTROL key until the Grub boot menu appears.

Type "e" to edit the default kernel command-line.

Use the arrow keys to go to the end of the line which starts "linux /boot/vmlinuz ...".

Add a space character, followed by "plymouth:debug".
Notes:

If you're interested in the overall boot, you may wish to remove the "quiet" keyword too)

Type CONTROL+x to boot

Once the system has booted, you can view all the Plymouth debug output in file var/log/plymouth-debug.log.

For older releases such as Maverick (10.10), hold down the SHIFT key rather than the CONTROL key to access the grub boot menu.

Notes:

If you are using the live CD, the process is slightly different:
Power on system
Hold down the SHIFT key until ISOLINUX "boot:" prompt appears
Type, "live plymouth:debug"

Plymouth Logs
Plymouth will log all output sent to the console to a file. By default, the data is logged to file /var/log/boot.log. If Plymouth is running in debug mode, debug messages are logged to /var/log/plymouth-debug.log.

Note that plymouthd buffers all messages until told that the disk partition on which the logs are to be written (in other words the partition containing /var/log/) is writeable.

The Upstart job /etc/init/plymouth-log.conf is used to accomplish this by calling:


  plymouth update-root-fs --read-write
Tips
Take care if you add "console=" options to your kernel command line since plymouthd will honour those over its own

"--tty=TTY" option!

Additional
"plymouth ask-question"
Used to prompt the user for an answer, echoing the answer text as it is typed. The answer is by default echoed to stdout to allow it to be piped to another command which expects to read the password on its stdin. Example:


  plymouth ask-question --prompt "what is your name? " |\
    command-to-process-answer --read-from-stdin
Similar functionality is provided by a combination of "plymouth message" and "plymouth watch-keystroke".

"plymouth ask-for-password"
Used to prompt the user for a password securely (password text is not echoed). The password the user enters is by default echoed to stdout to allow it to be piped to another command which expects to read the password on its stdin. Example:


  plymouth ask-for-password --prompt "specify password: " |\
    command-to-read-password-and-do-secret-things --read-from-stdin
Special FSCK messages
The Ubuntu Plymouth theme supports a "special" message that allows mountall to display fsck progress messages ("fsck is 20% complete"). You can make use of this functionality by using a special message format:


  sudo plymouth --update=fsck:sda1:27
This will display a message like:


  Checking disk 1 of 1 (27% complete)
See Also
BootGraphicsArchitecture

