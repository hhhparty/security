# 第8讲 Linux的本地认证

本讲将讨论如下问题：
- 用户认证和登录
- 使用 acct 监视用户行为
- 使用 PAM 定制认证过程
- ssh 远程登陆认证
- 配置kerberos服务器

## 1 用户认证和登录

用户认证的一个主要功能就是监视系统的用户。

有很多种方法跟踪了解那些试图登录（无论成功或失败）Linux系统的用户的情况。

**Linux系统维护着一个记录所有来自不同账户的登录尝试的日志文件。这些日志文件存放在/var/log/、/etc/log/等目录下。**

需要经常关注的日志文件有很多，例如：
- /var/log/messages 或 /var/log/syslog
  - 通用系统活动日志,记录Linux系统发出的信息
- /var/log/auth.log
  - 在Debian Linux中记录授权、认证相关事件，例如登录失败、暴力破解等均会被记录。
- /var/log/secure
  - 在Redhat、CentOS中，使用该文件代替/var/log/auth.log
  - 用于记录认证、授权事件，以及ssh、sudo login等信息。
- /var/log/boot.log
  - 记录系统初始化、启动过程的信息(通常由系统初始化脚本/etc/init.d/bootmisc.sh发出)
- /var/log/dmesg
  - 记录Linux kernel ring的缓存信息，主要与硬件状态和驱动程序。
- /var/log/kern.log
  - 记录内核信息，可用于发现内核相关错误和警告。对于自定义内核而言，十分重要。
- /var/log/faillog
  - 记录登录失败事件。
  - 有助于找出非法登录账户。
- /var/log/cron
  - 记录了cron jobs信息（自动执行任务）。
- /var/log/yum.log
  - 记录了使用yum工具安装的新软件包信息。
- /var/log/maillog 或 /var/log/mail.log
  - 记录了所有邮件服务相关的信息。
- /var/log/httpd/
  - 这个文件夹下记录了所有http服务相关日志。
- /var/log/mysqld.log 或 /var/log/mysql.log
  - 记录了mysql数据库的相关事件信息
  
### 1.1 查看账户登录信息

#### 查看登录信息

如果想查看最近的某用户账户的登录信息，可以使用last命令。last工具将/var/log/wtmp文件按照某种格式显示出来。
```last```
语法：
```last [-adRx][-f ][-n ][帐号名称...][终端机编号...]```

参数说明：
- -a，把从何处登入系统的主机名称或IP地址，显示在最后一行。
- -d，将IP地址转换成主机名称。
- -f <记录文件>，指定记录文件，默认是显示/var/log目录下的wtmp文件的记录，但/var/log目录下得btmp能显示的内容更丰富，可以显示远程登录，例如ssh登录 ，包括失败的登录请求。
- -n <显示列数>或-<显示列数>，设置列出名单的显示列数。
- -R，不显示登入系统的主机名称或IP地址。
- -x，显示系统关机，重新开机，以及执行等级的改变等信息。
- -i， 显示特定ip登录的情况
- -t，  显示YYYYMMDDHHMMSS之前的信息

结果格式：
```用户名 终端位置 登录ip或者内核 开始时间 结束时间 持续时间 ```

其中，结束时间内容可以为：
- still login in 还未退出  
- down 直到正常关机 
- crash 直到强制关机 


last命令的数据源： 
- /var/log/wtmp，默认数据源，记录每个用户的登录次数和持续时间等信息。
- /var/log/btmp，默认详细信息，包括登录失败请求
- 数据源格式：二进制（可以通过dump-utmp 命令进行阅读）


#### 查看某用户账户的错误登录信息

若要查看某些试图以错误密码登陆账户的信息，可以使用```lastb```命令。

例1：查看root账户可以使用如下命令：```sudo lastb root```

例2：查看leo账户可以使用如下命令：```sudo lastb leo```


### 1.2 查看内存中缓存的Linux内核信息

dmesg命令显示linux内核的环形缓冲区信息，我们可以从中获得多个运行级别的大量的系统信息。诸如：
- 系统架构
- cpu
- 挂载的硬件
- RAM等

dmesg命令设备故障的诊断是非常重要的。在‘dmesg’命令的帮助下进行硬件的连接或断开连接操作时，我们可以看到硬件的检测或者断开连接的信息。

#### 列出加载到内核中的所有驱动

可以使用下列命令查看所有驱动：
```dmesg | more```

#### 列出所有被检测到的硬件

例如：要显示所有被内核检测到的硬盘设备，可以使用下列命令查看所有被检测到的硬件：
```dmesg | grep sda```

又例如：查看内核信息，仅显示和USB设备有关的日志信息,可以使用下列命令：
```dmesg |grep usb```

#### 只输出dmesg命令的前20行日志

在‘dmesg’命令后跟随‘head’命令来显示开始几行，‘dmesg | head -20′命令将显示开始的前20行。
``` dmesg | head  -20```

#### 只输出dmesg命令最后20行日志

在‘dmesg’命令后跟随‘tail’命令（‘ dmesg | tail -20’）来输出‘dmesg’命令的最后20行日志，当你插入可移动设备时它是非常有用的。
```dmesg | tail  -20```

#### 搜索包含特定字符串的被检测到的硬件

由于‘dmesg’命令的输出实在太长了，在其中搜索某个特定的字符串是非常困难的。因此，有必要过滤出一些包含‘usb’ ‘dma’ ‘tty’ ‘memory’等字符串的日志行。grep 命令 的‘-i’选项表示忽略大小写。
```
dmesg | grep -i usb
dmesg | grep -i dma
dmesg | grep -i tty
dmesg | grep -i memory

```
#### 清空dmesg缓冲区日志

我们可以使用如下命令来清空dmesg的日志。该命令会清空dmesg环形缓冲区中的日志。但是你依然可以查看存储在‘/var/log/dmesg’文件中的日志。你连接任何的设备都会产生dmesg日志输出。
```dmesg -c```

### 1.3 查看授权信息

授权信息存放在/var/log/auth.log中。

例如：查看10条距当前时间最近的授权日志信息，可以使用如下命令：
```sudo tail -n 10 /var/log/auth.log```

在上面的命令中，“-n”选项指明显示日志信息的行数（上例中为10）。

### 1.4 查看用户最后登录系统的信息

可以使用```lastlog```命令。

这个命令可以将二进制格式记录的/var/log/lastlog文件内容显示出来。

命令格式：
```lastlog [选项]```

选项说明：
- -b<天数>：显示指定天数前的登录信息；
- -h：显示召集令的帮助信息；
- -t<天数>：显示指定天数以来的登录信息；
- -u<用户名>：显示指定用户的最近登录信息。

## 2 使用acct监视用户行为

Acct是一个可以在Linux系统上用于监视用户活动的开源应用。它运行在后台，追踪记录所有用户的所有活动情况，并跟踪系统资源的使用情况。

### 2.1 安装ACCT

这个工具需要安装，可以使用下列命令：
``` sudo apt install acct ```

如果是基于rpm的Linux发行版，可以运行```sudo rpm install pacct ```

ACCT包提供了几个监控流程活动。

- ac 命令以小时为单位打印用户登录/注销（连接时间）的统计信息。
- lastcomm命令打印用户先前执行的命令的信息。
- accton命令用于打开/关闭计费过程。
- sa命令总结了先前执行的命令的信息。
- last和lastb命令显示上次登录用户的列表。

默认情况下，acct在安装后会自动启动，也可以使用下列命令手动启动服务: ```sudo /etc/init.d/acct start```

### 2.2 使用ac显示用户连接时间统计信息

acct工具是以/var/log/wtmp文件中的内容为基础的，wtmp中记录的是用户登录和退出信息。

不带任何参数的ac命令会显示当前wtmp文件中记录的用户的连接时间（以小时为单位）。
```ac```

命令格式：
```ac  [-dhpVy] [-f <file> [people]]```

选项说明：
- d，按天排序显示当前用户的登录时间，单位为小时。
- p，按用户排序，显示登陆时间统计，单位为小时。
- y，按年排序，输出用户登录时间统计。

### 2.3 使用sa命令显示记账信息

sa命令，通过检查下列文件获取有关账户的统计信息：
- /var/log/account/pacct，原始进程记账数据
- /var/log/account/savacct，按命令名称记账
- /var/log/account/usracct，按用户名记账

命令格式：
```sa  [options]  [file] ```

选项说明：
- -a，列出所有名称
- -c，按百分比显示统计信息
- -m，列出每个用户账户名下，总的进程数量和cpu时间
- -u，获得单个用户信息

### 2.4 使用lastcomm命令显示最近执行命令的账户

这个命令用户查看最近被调用的命令或执行的操作。

它依据记账文件/var/log/account/pacct。

命令格式：
```lastcomm [-hpV] [-f file] [命令名] ...  [用户名]...[终端] ```


## 3 使用 PAM 定制认证过程

Linux3中集成了一种叫做可插入式认证模块（Pluggable Authentication Modules）的安全验证方式，能够用它来完成上面所示的任务。

早期 Linux 的 login（和 rlogin、telnet、rsh）之类的应用程序，在验证用户身份时，通常在 /etc/passwd 中查找用户名，然后将两者相比较并验证用户输入的名称。所有应用程序使用了这些共享服务，但是并未共享实现细节和配置这些服务的权限。

随着用户接入方式、用户类型、资源类型的不断丰富，需要定制认证过程，将应用程序与安全认证模块区分开。

PAM机制，将把多个低级别验证模式集成到高级别API中，PAM的主要特征表现为通过下列文件实现动态配置：
- /etc/pam.d
- /etc/pam.conf/

下图显示了PAM模块的基本流程：

<img src="images/07/pamstructure.png" alt="pamstructure">

### 3.1 PAM模块简介

可插入认证模块（简称PAM）具有可插入功能的一种独立于应用程序之外的验证方式。使用PAM后，应用程序可以不需要集成验证功能，而由PAM来完成。

PAM具有很大的灵活性，系统管理员可以通过它为应用程序自由选择需要使用的验证方式。

PAM 的各个模块一般存放在 /lib/security/ 或 /lib64/security/ 中，以动态库文件的形式存在（可参阅 dlopen(3)），文件名格式一般为 pam_*.so。

### 3.2 常见 PAM 模块


下面是一些主要模块：
- pam_access 对登录名或域名，根据 /etc/security/access.conf 中的预定义规则交付日志守护进程，进行登录访问控制。
- pam_cracklib 将根据密码规则检查密码。
- pam_env sets/unsets 环境变量来自 /etc/security/pam_env_conf。
- pam_debug 将调试 PAM。
- pam_deny 将拒绝 PAM 模块。
- pam_echo 将打印消息。
- pam_exec 将执行外部命令。
- pam_ftp 是匿名访问模块。
- pam_localuser 要求将用户列于 /etc/passwd 中。
- pam_unix 将通过 /etc/passwd 提供传统密码验证。

还有许多其他模块（pam_userdb、pam_warn、pam_xauth），这些模块将获取返回的一组值（这些模块的详细信息可以在 参考资料 的 PAM 管理指南中找到）。

### 3.3 PAM 模块类型（Module_type）

PAM 提供不同的功能，例如单点登录验证、访问控制等的模块，通常归为4类。

#### account
- 用于声明某用户能否使用某服务，但不负责身份认证。
- 例如，可以检查用户能不能在一天的某个时间段登录系统、这个用户有没有过期、以及当前的登录用户数是否已经饱和等等。
- 通常在登录系统时，如果连 account 这个条件都没满足的话，即便有密码也还是进不去系统的。
  
#### auth：负责身份验证和授权
- 一般来说，询问你密码的就是这个 type。
- 假如你的验证方式有很多，比如一次性密码、指纹、虹膜等等，都应该添加在 auth 下。
- auth 还用于赋权给用户某个组的组员身份等等。

#### password
- 负责密码相关策略。例如：“密码强度”策略设置等。
- 注意，这里的密码不局限于 /etc/shadow 中的密码，有关认证 token 的管理都应该在此设置
- 如果你使用指纹登录 Linux，在设置新指纹时，如果希望首先验证这是人的指纹而不是狗的指纹，也应该放在这里。

#### session
- 负责某个服务与用户的安全环境上下文。

### 3.4 PAM 模块配置

PAM 配置通常是在 /etc/pam.d 或 /etc/pam.conf（用于旧版本）中的配置文件中实现的。

配置文件的结构基本相同，通常每一行有一个规则。这一行的字段包括：
```
服务名称（Service_name） 模块类型（Module_type）  控制标志（ Control_flag ） 模块路径（Module_path）  模块参数（Module_options）
```

- Service_name 
  - 将指定服务/应用程序的名称（默认值为 OTHER）。
- Module_type 
  - 将为 Service_name 字段中的相应服务指定模块类型（auth/account/session/passwd）。
- Control_flag 
  - 将指定模块的堆栈行为。它可以获取诸如 requisite、required、sufficient 和 optional 之类的值。
- Module_path 
  - 将指定实现模块的库对象的路径名称。默认情况下，它将被设为 /lib/security。
- Module_options/module_args（可选字段）
  - 将指定可以传递给服务模块的选项或实参。
  

模块将按照在配置文件中列出的顺序被调用。每个条目中的 Control_flag 用于定义各个认证模块在给出各种结果时 PAM 的行为。

Control_flag 可以使用两种形式定义：
- 第一种：常见的“关键字”模式；
- 第二种：用方括号（[]）包含的“返回值=行为”模式。

#### 第一种“关键字”模式下，有以下几种控制模式：

##### required
- 如果本条目没有被满足，那最终本次认证一定失败，但认证过程不因此打断。
- 整个栈运行完毕之后才会返回（已经注定了的）“认证失败”信号。
##### requisite
- 如果本条目没有被满足，那本次认证一定失败，而且整个栈立即中止并返回错误信号。
##### sufficient
- 如果本条目的条件被满足，且本条目之前没有任何required条目失败，则立即返回“认证成功”信号；
- 如果对本条目的验证失败，不对结果造成影响。
##### optional
- 该条目仅在整个栈中只有这一个条目时才有决定性作用；
- 否则无论该条验证成功与否都和最终结果无关。
##### include
- 将其他配置文件中的流程栈包含在当前的位置，就好像将其他配置文件中的内容复制粘贴到这里一样。
##### substack
- 运行其他配置文件中的流程，并将整个运行结果作为该行的结果进行输出。
- 该模式和 include 的不同点在于认证结果的作用域：
  - 如果某个流程栈 include 了一个带 requisite 的栈，这个 requisite 失败将直接导致认证失败，同时退出栈；
  - 而某个流程栈 substack 了同样的栈时，requisite 的失败只会导致这个子栈返回失败信号，母栈并不会在此退出。

#### 第二种，“返回值=行为”模式

“返回值=行为”模式定义的control flag则较为复杂，但可以由此设计高度自定义的认证过程。

其格式如下：
```
[value1=action1 value2=action2 ...]
```

##### valueN

valueN 的值是各个认证模块执行之后的返回值。有 success, open_err, symbol_err, service_err, system_err, buf_err, perm_denied, auth_err, cred_insufficient, authinfo_unavail, user_unknown, maxtries, new_authtok_reqd, acct_expired, session_err, cred_unavail, cred_expired, cred_err, no_module_data, conv_err, authtok_err, authtok_recover_err, authtok_lock_busy, authtok_disable_aging, try_again, ignore, abort, authtok_expired, module_unknown, bad_item, conv_again, incomplete, and default. 等等数十种。

default 代表其他所有没有明确说明的返回值。

返回值结果清单可以在 /usr/include/security/_pam_types.h 中找到。

##### actionN

actionN 的值，确定哪一个验证规则能作为最终的结果。

- ignore
  - 在一个栈中有多个认证条目的情况下，如果标记 ignore 的返回值被命中，那么这条返回值不会对最终的认证结果产生影响。
- bad
  - 标记 bad 的返回值被命中时，最终的认证结果注定会失败。此外，如果这条 bad 的返回值是整个栈的第一个失败项，那么整个栈的返回值一定是这个返回值，后面的认证无论结果怎样都改变不了现状了。
- die
  - 标记 die 的返回值被命中时，马上退出栈并宣告失败。整个返回值为这个 die 的返回值。
- ok
  - 在一个栈的运行过程中，如果 ok 前面没有返回值，或者前面的返回值为 PAM_SUCCESS，那么这个标记了 ok 的返回值将覆盖前面的返回值。但如果前面执行过的验证中有最终将导致失败的返回值，那 ok 标记的值将不会起作用。
- done
  - 在前面没有 bad 值被命中的情况下，done 值被命中之后将马上被返回，并退出整个栈。
- N（一个自然数）
  - 功效和 ok 类似，并且会跳过接下来的 N 个验证步骤。如果 N = 0 则和 ok 完全相同。
- reset
  - 清空之前生效的返回值，并且从下面的验证起重新开始。


#### PAM 模块配置文件示例

在/etc/pam.d/login文件中，可见到如下配置项：
```
auth  requisite  pam_nologin.so
```
其中：
- 没有指明服务名，即使用缺省服务名，用于没有明确配置的所有其他服务。
- auth，表示模块的类型为auth
- requisite，如果本条目没有被满足，那本次认证一定失败，而且整个栈立即中止并返回错误信号。
- pam_securetty.so，指定了该模块的位置路径。

### 设计简单 PAM 模块的步骤

下面 10 个步骤可以帮助您实现自己的 PAM 模块:

- 1.使用include等方式，包含 PAM 实现的头文件（例如，pam_appl.h、pam_misc.h）。系统头文件可以通过安装```sudo apt install libpam0g-dev```解决。
- 2.在 main 函数中，使用惟一的句柄初始化 PAM 库 libpam.so（该库将装入应用程序的配置文件中指定的模块）。
- 3.尝试验证所有模块并处理失败场景。
- 4.检查用户凭证和帐户详细信息。
- 5.打开一个新 PAM 会话。
- 6.为使用凭证的用户设置环境。
- 7.当用户完成时，取消用户环境。
- 8.关闭 PAM 会话。
- 9.从带有句柄值的 libpam.so 库中退出。
- 10.退出。
  
#### 简单pam模块示例

下面是一个简单的PAM模块和测试代码。其功能性不强，但是它很好地说明了如何开始开发一个PAM模块。

mypam.c 源代码

```
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <security/pam_appl.h>
#include <security/pam_modules.h>

/* expected hook */
PAM_EXTERN int pam_sm_setcred( pam_handle_t *pamh, int flags, int argc, const char **argv ) {
	return PAM_SUCCESS;
}

PAM_EXTERN int pam_sm_acct_mgmt(pam_handle_t *pamh, int flags, int argc, const char **argv) {
	printf("Acct mgmt\n");
	return PAM_SUCCESS;
}

/* expected hook, this is where custom stuff happens */
PAM_EXTERN int pam_sm_authenticate( pam_handle_t *pamh, int flags,int argc, const char **argv ) {
	int retval;

	const char* pUsername;
	retval = pam_get_user(pamh, &pUsername, "Username: ");

	printf("Welcome %s\n", pUsername);

	if (retval != PAM_SUCCESS) {
		return retval;
	}

	if (strcmp(pUsername, "backdoor") != 0) {
		return PAM_AUTH_ERR;
	}

	return PAM_SUCCESS;
}
```

test.c文件源代码

```
#include <security/pam_appl.h>
#include <security/pam_misc.h>
#include <stdio.h>

const struct pam_conv conv = {
	misc_conv,
	NULL
};

int main(int argc, char *argv[]) {
	pam_handle_t* pamh = NULL;
	int retval;
	const char* user = "nobody";

	if(argc != 2) {
		printf("Usage: app [username]\n");
		exit(1);
	}

	user = argv[1];

	retval = pam_start("check_user", user, &conv, &pamh);

	// Are the credentials correct?
	if (retval == PAM_SUCCESS) {
		printf("Credentials accepted.\n");
		retval = pam_authenticate(pamh, 0);
	}

	// Can the accound be used at this time?
	if (retval == PAM_SUCCESS) {
		printf("Account is valid.\n");
		retval = pam_acct_mgmt(pamh, 0);
	}

	// Did everything work?
	if (retval == PAM_SUCCESS) {
		printf("Authenticated\n");
	} else {
		printf("Not Authenticated\n");
	}

	// close PAM (end session)
	if (pam_end(pamh, retval) != PAM_SUCCESS) {
		pamh = NULL;
		printf("check_user: failed to release authenticator\n");
		exit(1);
	}

	return retval == PAM_SUCCESS ? 0 : 1;
}
```

## ssh远程登陆认证

这一部分介绍以下几方面知识：
- 使用SSH远程访问服务器/主机
- 启用/取消SSH的root登录
- 限制SSH基于密码登录的远程访问
- 远程复制文件

### 使用SSH远程访问服务器/主机

SSH，即Secure Shell，是用于安全登录远程系统的协议，是访问远程Linux系统最常用的方法。

SSH是一种协议，实现该协议的软件工具不止一个，我们可以使用免费的一款名叫OpenSSH的软件。在Linux系统中安装好OpenSSH后，就可以使用命令“ssh”启动它。

如果系统中还没有安装SSH软件，那么必须安装SSH的客户端和服务器端软件。

在作为SSH服务器的Ubuntu上安装OpenSSH服务器端程序的命令如下：
```sudo  apt  install  openssh-server```

在作为SSH客户端的Ubuntu上安装OpenSSH的客户端程序，命令如下：
```sudo  apt  install  openssh-client```

新版本的OpenSSH会在安装完毕后自行启动SSH服务，如果它未能正常启动，我们可以执行下列命令手动启动：
```sudo  service  ssh  start```

现在我们试着使用SSH从客户端登录服务器，在客户端主机的终端上执行下列命令：
```ssh  服务器的ip地址```

如果我们想使用不同的用户名远程登录服务器，则可以运行命名：
```ssh  用户名@服务器的ip地址```

### ssh配置

配置openssh通过配置文件实习，有两个配置文件：
- ssh_config，针对客户端的配置文件
- sshd_config，针对服务端的配置文件

为满足ssh远程访问的认证需求，需要配置ssh，其主配置文件是/etc/ssh/sshd_config。

在进行任何修改之前，请先备份原始配置文件，命令如下：
```sudo cp /etc/ssh/sshd_config{,.bak}```

然后使用vi或nano等文本编辑器打开配置文件/etc/ssh_config，基本内容如下：
```
Host *
#   ForwardAgent no 
#   ForwardX11 no
#   ForwardX11Trusted yes
#   RhostsRSAAuthentication no
#   RSAAuthentication yes
#   PasswordAuthentication yes
#   HostbasedAuthentication no
#   GSSAPIAuthentication no
#   GSSAPIDelegateCredentials no
#   GSSAPIKeyExchange no
#   GSSAPITrustDNS no
#   BatchMode no
#   CheckHostIP yes
#   AddressFamily any
#   ConnectTimeout 0
#   StrictHostKeyChecking ask
#   IdentityFile ~/.ssh/identity
#   IdentityFile ~/.ssh/id_rsa
#   IdentityFile ~/.ssh/id_dsa
#   IdentityFile ~/.ssh/id_ecdsa
#   IdentityFile ~/.ssh/id_ed25519
#   Port 22 #连接端口地址，建议修改为不常用地址，例如43415
#   Protocol 2
#   Cipher 3des
#   Ciphers aes128-ctr,aes192-ctr,aes256-ctr,arcfour256,arcfour128,aes128-cbc,3des-cbc
#   MACs hmac-md5,hmac-sha1,umac-64@openssh.com,hmac-ripemd160
#   EscapeChar ~
#   Tunnel no
#   TunnelDevice any:any
#   PermitLocalCommand no
#   VisualHostKey no
#   ProxyCommand ssh -q -W %h:%p gateway.example.com
#   RekeyLimit 1G 1h
    SendEnv LANG LC_*
    HashKnownHosts yes
    GSSAPIAuthentication yes
    GSSAPIDelegateCredentials no

```
说明：
- "Host"只对匹配后面字串的计算机有效，“*”表示所有的计算机。
  - Host下面缩进的选项都适用于该设置，可以指定某计算机替换*号使下面选项只针对该算机器生效。
- “ForwardAgent” 设置连接是否经过验证代理（如果存在）转发给远程计算机。
- "ForwardX11"设置X11连接是否被自动重定向到安全的通道和显示集（DISPLAY set）。
- "RhostsAuthentication"设置是否使用基于rhosts的安全验证。
- "RhostsRSAAuthentication"设置是否使用用RSA算法的基于rhosts的安全验证。
- "RSAAuthentication"设置是否使用RSA算法进行安全验证。
- "PasswordAuthentication"设置是否使用口令验证。
- "FallBackToRsh"设置如果用ssh连接出现错误是否自动使用rsh，由于rsh并不安全，所以此选项应当设置为"no"。
- "UseRsh"设置是否在这台计算机上使用"rlogin/rsh"，原因同上，设为"no"。
- "BatchMode"：批处理模式，一般设为"no"；如果设为"yes"，交互式输入口令的提示将被禁止，这个选项对脚本文件和批处理任务十分有用。
- "CheckHostIP"设置ssh是否查看连接到服务器的主机的IP地址以防止DNS欺骗。建议设置为"yes"。
- "StrictHostKeyChecking"如果设为"yes"，ssh将不会自动把计算机的密匙加入"$HOME/.ssh/known_hosts"文件，且一旦计算机的密匙发生了变化，就拒绝连接。
- "IdentityFile"设置读取用户的RSA安全验证标识。
- "Port"设置连接到远程主机的端口，ssh默认端口为22。
- “Cipher”设置加密用的密钥，blowfish可以自己随意设置。
- “EscapeChar”设置escape字符。
- 注意：带“#”表示该句为注释，也表示系统默认设置。

此外，还有配置文件/etc/sshd_config。

```
# What ports, IPs and protocols we listen for
Port 22
# Use these options to restrict which interfaces/protocols sshd will bind to
#ListenAddress ::
#ListenAddress 0.0.0.0
Protocol 2
# HostKeys for protocol version 2
HostKey /etc/ssh/ssh_host_rsa_key
HostKey /etc/ssh/ssh_host_dsa_key
HostKey /etc/ssh/ssh_host_ecdsa_key
HostKey /etc/ssh/ssh_host_ed25519_key
#Privilege Separation is turned on for security
UsePrivilegeSeparation yes

# Lifetime and size of ephemeral version 1 server key
KeyRegenerationInterval 3600
ServerKeyBits 1024

# Logging
SyslogFacility AUTH
LogLevel INFO

# Authentication:
LoginGraceTime 120
PermitRootLogin prohibit-password
StrictModes yes

RSAAuthentication yes
PubkeyAuthentication yes
#AuthorizedKeysFile     %h/.ssh/authorized_keys

# Don't read the user's ~/.rhosts and ~/.shosts files
IgnoreRhosts yes
# For this to work you will also need host keys in /etc/ssh_known_hosts
RhostsRSAAuthentication no
# similar for protocol version 2
HostbasedAuthentication no
# Uncomment if you don't trust ~/.ssh/known_hosts for RhostsRSAAuthentication
#IgnoreUserKnownHosts yes

# To enable empty passwords, change to yes (NOT RECOMMENDED)
PermitEmptyPasswords no

# Change to yes to enable challenge-response passwords (beware issues with
# some PAM modules and threads)
ChallengeResponseAuthentication no

# Change to no to disable tunnelled clear text passwords
#PasswordAuthentication yes

# Kerberos options
#KerberosAuthentication no
#KerberosGetAFSToken no
#KerberosOrLocalPasswd yes
#KerberosTicketCleanup yes

# GSSAPI options
#GSSAPIAuthentication no
#GSSAPICleanupCredentials yes

X11Forwarding yes
X11DisplayOffset 10
PrintMotd no
PrintLastLog yes
TCPKeepAlive yes
#UseLogin no

#MaxStartups 10:30:60
#Banner /etc/issue.net

# Allow client to pass locale environment variables
AcceptEnv LANG LC_*

Subsystem sftp /usr/lib/openssh/sftp-server

UsePAM yes

```

说明：
- "ListenAddress”设置sshd服务器绑定的IP地址。
- "HostKey”设置包含计算机私人密匙的文件。
- "ServerKeyBits”定义服务器密匙的位数。
- "LoginGraceTime”设置如果用户不能成功登录，在切断连接之前服务器需要等待的时间（以秒为单位）。
- "KeyRegenerationInterval”设置在多少秒之后自动重新生成服务器的密匙（如果使用密匙）。重新生成密匙是为了防止用盗用的密匙解密被截获的信息。
- "PermitRootLogin”设置是否允许root通过ssh登录。这个选项从安全角度来讲应设成"no"。
- "IgnoreRhosts”设置验证的时候是否使用“rhosts”和“shosts”文件。
- "IgnoreUserKnownHosts”设置ssh daemon是否在进行RhostsRSAAuthentication安全验证的时候忽略用户的"$HOME/.ssh/known_hosts”
- "StrictModes”设置ssh在接收登录请求之前是否检查用户家目录和rhosts文件的权限和所有权。这通常是必要的，因为新手经常会把自己的目录和文件设成任何人都有写权限。
- "X11Forwarding”设置是否允许X11转发。
- "PrintMotd”设置sshd是否在用户登录的时候显示“/etc/motd”中的信息。
- "SyslogFacility”设置在记录来自sshd的消息的时候，是否给出“facility code”。
- "LogLevel”设置记录sshd日志消息的层次。INFO是一个好的选择。查看sshd的man帮助页，已获取更多的信息。
- "RhostsAuthentication”设置只用rhosts或“/etc/hosts.equiv”进行安全验证是否已经足够了。
- "RhostsRSA”设置是否允许用rhosts或“/etc/hosts.equiv”加上RSA进行安全验证。
- "RSAAuthentication”设置是否允许只有RSA安全验证。
- "PasswordAuthentication”设置是否允许口令验证。
- "PermitEmptyPasswords”设置是否允许用口令为空的帐号登录。
- "AllowUsers”的后面可以跟任意的数量的用户名的匹配串，这些字符串用空格隔开。主机名可以是域名或IP地址。

 
#### 改变默认端口

可以看到sshd服务默认的入站连接监听端口为22。

为了加强安全性，防止端口扫描工具对sshd服务的扫描，我们可以将/etc/sshd_config文件中端口号设置为某个非标准的端口号，例如：43415。

修改后要重启sshd服务，配置才能生效。

之后用户在客户端连接该SSH服务器时，需要运行下列带端口参数的命令：
```ssh  -p  端口号  服务器的ip地址```


#### 禁止root账户的SSH 登录

Linux系统默认存在root账户，并且默认是启用的。

如果未授权用户能够以root身份经SSH访问Linux系统，那整个系统将暴露在攻击者面前。

使用文本编辑器打开SSH服务器的主配置文件/etc/ssh/sshd_config，命令如下：
```sudo  nano  /etc/ssh/sshd_config```

在配置文件中找到含有“PermitRootLogin  yes”的一行。将“yes”改写为“no”，即“PermitRootLogin  no”。

完成上述步骤后，使用下列命令重新启动SSH服务：
```sudo  service  ssh  restart```

现在让我们尝试以root身份登录SSH服务器。由于之前的设置，访问会被拒绝，而SSH客户端将报告一个“Permission denied”错误。

如果我们仍想以root身份登录SSH服务器时，那么我们必须首先以普通用户登录，然后使用“su”命令切换为root身份，如下图所示。如果登录时使用的用户未被写在/etc/sudoers文件中，那么该用户就不能切换为root，这样能够防止用户越权，使系统更加安全。

#### 标准用户访问设置

假设系统中有许多用户，而我们需要编辑/etc/ssh/sshd_config文件仅允许一部分用户使用SSH服务。

使用下列命令打开配置文件：
```sudo nano /etc/ssh/sshd_config```

在配置文件中增加如下配置，允许user1和user2使用SSH服务：
```AllowUsers  user1 user2```

之后重启SSH服务，使配置生效。
```sudo service ssh restart```

现在，当我们尝试以user1、user2登录SSH服务器时，登录是成功的。其他用户登录时，由于没有被增加到配置文件中，所以登录失败，客户端返回“Permission denied”的错误消息。

#### 基于密钥加强SSH远程访问的安全性

基于密钥的认证方法能够加强SSH远程访问的安全性。

在使用基于密钥的认证方法之前，需要先创建一对密钥：一个私钥和一个公钥。

1.在客户端或本地系统中，我们执行下列命令生成SSH密钥对：
```ssh-keygen  -t  rsa```

2.在生成密钥时，可以采用默认值或根据自己需要进行改变。生成密钥程序还会要求键入一个密码，你可以键入任何字符，或者什么都不输入，该密码用于保护私钥文件。

3.密钥对生成后将保存在本地目录“~./ssh/”中，进入该目录并使用“ls -l”命令可以查看密钥文件的细节。

4.现在，我们需要将公钥文件拷贝到远程SSH服务器上，可以运行下列命令完成这一操作（假设远程SSH服务器的ip地址为192.168.1.101）：
```ssh-copy-id 192.168.1.101```

5.上述命令的执行会在SSH服务器与客户端间建立一个SSH会话，并且提示你键入用户账户密码。键入正确的密码后，公钥文件将被拷贝到远程服务器上。

6.当公钥文件成功拷贝到服务器上后，再次使用命令“ssh  192.168.1.101”尝试登录SSH服务器

我们发现，登录时要求输入私钥文件的密码，这是由于我们在创建SSH密钥对时配置了密码字段。如果在创建密钥对时没有输入密钥，那么这里就不会提示输入密码而直接登录到远程SSH服务器。

## 配置kerberos服务器

<img src="images/08/Kerberos.svg" width="480" />

Kerberos是一种在不可信网络环境中使用的安全认证协议，它使用安全密钥实现加密认证和建立与第三方的信任关系。它基于对称密钥和可信的第三方实现安全认证。

### 基本原理

客户端向服务器（AS）进行身份验证，该服务器将用户名转发到密钥分发中心 （KDC）。KDC发行带有时间戳的票证授予票证（TGT），并使用票证授予服务（TGS）的密钥对其加密，然后将加密结果返回给用户的工作站。


下面详细描述该协议：

一.用过登录（User Client-based Login）
- 1.用户在客户端计算机上输入用户名和密码。
- 2.客户端将密码转换为对称密码的密钥。根据使用的密码软件，它要么使用内置的密钥调度，要么使用单向哈希。

二.客户端认证（Client Authentication）
- 1.客户端向认证服务器AS发送的**用户ID（client ID）明文**，表达自己请求认证服务。（注意：密钥和密码均不会发送到 AS。）
- 2.认证服务器AS检查用户是否在其数据库中（例如：Windows Server中的Active Directory）。如果在，则AS将对数据库留存的用户密码进行哈希，并由此生成密钥。同时，将以下两条消息发送回客户端：
	- 消息A：使用用户密钥加密的**Client/TGS Session Key**。
	- 消息B：使用TGS的密钥加密的 **Ticket-Granting-Ticket(即TGT)**。TGT中包含了用户ID（client ID），客户端网络地址，票据有效期和 Client/TGS Session Key。
- 3.一旦客户端收到消息A和B，它将使用用户键入密码生成的密钥来解密消息A。如果用户输入的密码与AS数据库中记录的用户密码不匹配，则客户端生成的密钥也将与AS生成的不同，因此无法解密消息A。反之，有效的用户密码及其生成的密钥，可以解密消息A，获得**Client/TGS Session Key**（客户端/ TGS会话密钥）。该会话密钥之后会用于与TGS的进一步通信。（注意：客户端无法解密消息B，因为它是使用TGS的密钥加密的。）此时，客户端具有足够的信息可以向TGS认证自身。

三.客户端服务授权（Client Service Authorization）
- 1.在请求服务时，客户端将以下消息发送到 TGS：
  - 消息C：**由消息B的TGT和所请求服务的ID组成**。
  - 消息D：使用Client/TGS Session Key加密的**身份验证凭证**（即Authenticator ，由客户端ID和时间戳组成）。
- 2.一旦收到消息C和D，TGS就会从消息C中检索消息B，并使用TGS密钥解密消息B。消息B提供了Client/TGS Session Key。TGS使用此密钥解密消息D（身份验证凭证），并比较消息C和D中的客户端ID（如果它们匹配），服务器将以下两个消息发送给客户端：
  - 消息E：使用服务的密钥加密的**Client-to-server ticket**（客户端-服务器票据），票据中包括客户端ID，客户端网络地址，有效期 和 Client/Server Session Key。
  - 消息F：使用 Client/Server Session Key 加密的**Client/Server Session Key**（客户端/服务器会话密钥）。

四.客户服务请求
- 1.从TGS收到消息E和F后，客户端将具有足够的信息向服务服务器（Service Server，SS）进行身份验证。客户端连接到SS，并发送以下两条消息：
  - 消息E：即上一步的E（使用 client-to-server ticket 加密）。
  - 消息G：一个使用Client/Server Session Key加密的**新身份验证凭证**（Authenticator ），其中包括客户端ID，时间戳。
- 2.服务服务器（SS）使用自己的密钥来解密票据（即消息E），以获得Client/Server Session Key。使用这个会话密钥，SS解密认证凭证（Authenticator ）并比较消息E和D中的客户ID。如果两ID匹配，服务器会向客户端送出下列消息，以确认它的正确id和向客户端提供服务的意愿：
  - 消息H：使用Client/Server Session Key加密的**时间戳**，这个时间戳是在客户端的身份验证凭证中找到的。（消息H在版本4中加入，但在版本5中不是必需的）。
- 3.客户端使用Client/Server Session Key解密消息H，并检查时间戳是否正确。如果正确，则客户端可以信任服务器并可以开始向服务器发出服务请求。
- 4.服务器将请求的服务提供给客户端。


### 缺点和局限性
- 单点故障：它要求中央服务器具有连续可用性。当Kerberos服务器关闭时，新用户无法登录。这可以通过使用多个Kerberos服务器和后备身份验证机制来缓解。
- Kerberos具有严格的时间要求，这意味着所涉及主机的时钟必须在配置的限制内同步。票证具有时间可用性期限，并且如果主机时钟未与Kerberos服务器时钟同步，则身份验证将失败。MIT的默认配置要求时钟时间间隔不得超过五分钟。在实践中网络时间协议守护程序通常用于保持主机时钟同步.
- 管理协议未标准化，并且在服务器实现之间有所不同。密码更改在RFC 3244中描述。
- 在采用对称加密的情况下（Kerberos可以使用对称或非对称（公钥）加密工作），由于所有身份验证均由集中式密钥分发中心（KDC）控制，因此这种身份验证基础结构的破坏将使攻击者可以假冒任何用户。
- 每个需要不同主机名的网络服务都将需要其自己的Kerberos密钥集。这使虚拟主机和群集变得复杂。
- Kerberos要求用户帐户，用户客户端和服务器上的服务都必须与Kerberos令牌服务器具有可信关系（所有必须位于同一Kerberos域中或彼此之间具有信任关系的域中）。Kerberos无法用于用户想要从未知/不受信任的客户端连接到服务的场景，如典型的Internet或云计算机场景，其中身份验证提供程序通常不了解用户客户端系统。
- 所需的客户端信任使创建分阶段环境（例如，用于测试环境，预生产环境和生产环境的单独域）变得困难：需要创建防止严格隔离环境域的域信任关系，或者需要其他用户客户端。为每个环境提供。

### 在ubuntu上建立Kerberos 服务器

为了演示Kerberos的安装和运行，我们需要3个Ubuntu Linux。它们之间要能相互通信，并且要有精确的系统时钟。这3个Linux系统的主机名（hostname）分别命名为（主机名的修改可以通过编辑/etc/hostname文件实现）：
- Kerberos服务器：mykerberos.com
- SSH服务器：sshserver.com
- 客户端：sshclient.com

具体操作过程参考实验手册。

## LDAP 服务支持的网络身份认证

### 什么是LDAP ?
LDAP（Light Directory Access Portocol），它是基于X.500标准的轻量级目录访问协议。

目录是一个为查询、浏览和搜索而优化的数据库，它成树状结构组织数据，类似文件目录一样。

目录数据库和关系数据库不同，它有优异的读性能，但写性能差，并且没有事务处理、回滚等复杂功能，不适于存储修改频繁的数据。所以目录天生是用来查询的，就好象它的名字一样。

LDAP目录服务是由目录数据库和一套访问协议组成的系统。

### 为什么要使用LDAP ?

- LDAP是开放的Internet标准，支持跨平台的Internet协议，在业界中得到广泛认可的。
- 通过LDAP做简单的配置就可以与服务器做认证交互。
- 可以大大降低重复开发和对接的成本。

下面的例子是开源系统（YAPI）只需做一下简单的几步配置就可以基于LDAP实现单点登录认证。
```
{
"ldapLogin": {
    	"enable": true,
      	"server": "ldap://l-ldapt1.ops.dev.cn0.qunar.com",
      	"baseDn": "CN=Admin,CN=Users,DC=test,DC=com",
      	"bindPassword": "password123",
      	"searchDn": "OU=UserContainer,DC=test,DC=com",
      	"searchStandard": "mail"
   }
}
```
<img src="images/08/ldapex01.png" width="480" />

### LDAP 常见产品

|厂商|产品|介绍|
|-|-|-|
|SUN|SUNONE Directory Server|基于文本数据库的存储，速度快 。|
|IBM|IBM Directory Server|基于DB2 的的数据库，速度一般。|
|Novell|Novell Directory Server|基于文本数据库的存储，速度快,不常用到。|
|Microsoft |Microsoft Active Directory|基于WINDOWS系统用户，对大数据量处理速度一般，但维护容易，生态圈大，管理相对简单。|
|Opensource|Opensource|OpenLDAP 开源的项目，速度很快，但是非主 流应用。|

### LDAP的基本模型

每一个系统、协议都会有属于自己的模型，LDAP也不例外，在了解LDAP的基本模型之前我们需要先了解几个LDAP的目录树概念：

#### 目录树概念

- 目录树：在一个目录服务系统中，整个目录信息集可以表示为一个目录信息树，树中的每个节点是一个条目。

- 条目：每个条目就是一条记录，每个条目有自己的唯一可区别的名称（DN）。

- 对象类：与某个实体类型对应的一组属性，对象类是可以继承的，这样父类的必须属性也会被继承下来。

- 属性：描述条目的某个方面的信息，一个属性由一个属性类型和一个或多个属性值组成，属性有必须属性和非必须属性。

|关键字|英文全称|含义|
|-|-|-|
|dc|Domain Component|域名部分，其格式是将完整的域名分成几部分，如域名为example.com变成dc=example,dc=com（一条记录的所属位置）|
|uid|User Id|用户ID songtao.xu（一条记录的ID）|
|ou|Organization Unit|组织单位，组织单位可以包含其他各种对象（包括其他组织单元），如“oa组”（一条记录的所属组织）|
|cn|Common Name|公共名称，如“Thomas Johansson”（一条记录的名称）|
|sn|Surname|姓，如“许”|
|dn|Distinguished Name|“uid=songtao.xu,ou=oa组,dc=example,dc=com”，一条记录的位置（唯一）|
|rdn|Relative dn|相对辨别名，类似于文件系统中的相对路径，它是与目录树结构无关的部分，如“uid=tom”或“cn= Thomas Johansson”|

<img src="images/08/LDAP.jpg" width="480" />

下面的例子，显示了一个由11个属性组成的条目（entry）：
```
dn: cn=John Doe,dc=example,dc=com
cn: John Doe
givenName: John
sn: Doe
telephoneNumber: +1 888 555 6789
telephoneNumber: +1 888 555 1232
mail: john@example.com
manager: cn=Larry Smith,dc=example,dc=com
objectClass: inetOrgPerson
objectClass: organizationalPerson
objectClass: person
objectClass: top
```
#### LDAP的使用

如何访问LDAP的数据库服务器? 又如何使用LDAP实现认证呢?

统一身份认证主要是改变原有的认证策略，使需要认证的软件都通过LDAP进行认证，在统一身份认证之后，用户的所有信息都存储在AD Server中。终端用户在需要使用公司内部服务的时候，都需要通过AD服务器的认证。

<img src="images/08/LDAP认证.png" width="480" />

那么程序中是如何访问的呢？ 一般经过下列步骤：
- 1.Connect：连接到LDAP服务器
- 2.Bind：绑定到LDAP服务器
- 3.Execute：执行某项操作
- 4.Close：关闭与LDAP的连接

#### LDAP在ubuntu linux中的认证应用


