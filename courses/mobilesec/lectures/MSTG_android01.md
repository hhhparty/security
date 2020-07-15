# OWASP 移动应用测试指南——Android 测试指南 01

首先从以下方面讨论android平台：
- android 安全架构
- android 应用程序结构
- 进程间通信
- android 应用发布
- android 应用攻击面

## android 安全架构

android系统的基本情况，查看文档《android系统.md》

Android 应用程序通常用 Java 编写并编译为 Dalvik 字节码，这与传统的 Java 字节码有些不同。首选将Java代码编译为.class文件，然后使用该工具将 JVM 字节码转换为 Dalvik.dex 格式来创建 Dalvik 字节码。

<img src="images/owaspmatg_android01/java_vs_dalvik.png">

Android 在 Android Runtime （ART）上运行此字节码。ART 是Android 原始运行的Dalvik虚拟机的后继者。Dalvik和ART之间的主要区别在字节码的执行方式。

在Dalvik中，字节码在执行时被转换为机器码，这个过程称为即时（JIT）编译。JIT编译会对性能产生不利影响。因为每次运行都要编译，为了提高性能，ART引入了提前编译AOT，即首次执行时预编译。

### Android 用户和群组

即时Android基于Linux，它也无法像其他Linux一样实现用户账户。在Android中，Linux内核向沙盒应用程序提供了多用户支持：除少数例外，每个应用程序都像在单独的Linux用户下运行，与其他应用app和操作系统的其余部分有效隔离。

文件```system/core/include/private/android_filesystem_config.h```包含系统进程分配给的预定义用户和组的列表。安装其他应用程序时，会添加其他应用程序的UID（用户id）。

Android 7.0 定义了以下系统用户：
- AID_ROOT 0
- AID_SYSTEM 1000
- AID_SHELL 2000
- AID_APP 10000

### Android 设备加密
Android 支持 Android 2.3.4 (API LEVEL 10)中的设备加密，此后发生了一些大变化。google 要求所有运行Android 6（api level 23）或更高版本的设备都必须支持存储加密。

#### 全盘加密 

Android 5.0（api level 21） 及更高版本支持全盘加密。使用受用户设备密码保护的单个密钥来加密和解密 userdata 分区。现在这种加密已被弃用，且应尽可能使用基于文件的加密。

全盘加密有一些缺点，例如用户为输入解锁密码，重启后无法接听电话或报警。

#### 基于文件的加密

Android 7（api level 24）支持基于文件的加密。使用不同的密钥对不同文件进行加密，以便独立解密他们。支持这种加密的设备也支持直接启动。Direct Boot 使设备可以访问报警、辅助功能，即便用户未解锁设备也可以。


#### Adiantum

AES 在大多数 Android上用于存储加密。

AES被广泛使用，甚至最新的处理器上都有专用指令来提供硬件加速的加密和解密操作。例如带有密码学扩展的ARMv8、具有AES-NI扩展的x86.当然也有低端处理器没有这类指令，例如ARM Cortex-A7，就没有硬件加速的AES。

Adiantum 是Google工程师设计的密码结构，用于填补那些不能以至少50MB/s速度运行AES的设备的缺憾。 Adiantum 仅依赖于加法、旋转和异或，低端处理器使用 Adiantum 可以比使用AES加密速度快4倍。解密速度快5倍。

Adiantum 构成：
- NH，一个哈希函数
- Poly1305 ，一个消息验证码
- XChaCha12，一个流密码
- AES-256，AES单词调用

只要XChaCha12和AES-256是安全的，Adiantum 就是安全的。Adiantum适用于Android 9（api level 28）或更高版本。

#### Android 安全强化

Android 包含很多不同功能，使恶意代码程序难以脱离其沙盒。由于应用程序可以在设备上有效运行代码，因此即时无法信任应用程序本身，也可以安全执行此操作。

下面列举了防止应用程序滥用漏洞而采取的一些缓解措施：

##### SELinux

增强安全性Linux，使用强制访问控制MAC，进一步锁定哪些进程应该具有访问哪些资源的权力。每个资源都有一个标签，标签的形式定义了哪些用户可以对其执行何种类型的操作。

通过遵循最低特权原则，更容易控制访问。

##### ASLR、KASLR、PIE、DEP

Android 4.1（API LEVEL 15)以来，地址空间布局随机化（ASLR)就已经成为android的一部分，它是防止缓冲区溢出攻击的标准保护措施，可确保应用程序和操作系统都加载到随机内存地址中，很难为特定的内存区域或库获取正确地址。

Andorid 8.0（api level 26）为内核实现了这种保护（KASLR).仅当可以将应用加载到内存中的随机位置时，才能使用ASLR保护，这由应用程序的位置独立可执行标志（即PIE)指示。

Andorid 5（api level 21) 之后，不再支持未启用PIE的 native 库。

DEP也是防止代码在堆栈和堆上执行，防止缓冲区溢出漏洞。


##### SECCOMP

Andorid 应用程序可以包含用C或C++编写的本机代码。这些编译的二进制文件可以通过Java Native Interface(JNI) 绑定与Android Runtime 通信，也可以通过系统调用与 OS通信。

由于系统调用直接与内核通信，因此它们是攻击者的主要目标。

Android 8（API LEVEL 26) 引入了对所有基于 Zygote 的进程（即用户应用程序）的安全计算（SECCOMP)过滤器。这些过滤器将可用的系统调用限制为通过仿生暴漏的系统调用。

## Android 上的应用

Android app 通过 Android 框架与系统服务交互，Android 框架提供高级Java API 的抽象层。这些服务大多数通过常规Java方法调用，并转换为对在后台运行的系统服务的IPC调用。

系统服务示例包括：
- 连接（wifi, bluetooth, nfc)
- files
- cameras
- gps
- microphone

新Android版本会更改API规范。

值得注意的版本：

- Android 4.2 (API level 16) in November 2012 (introduction of SELinux)
- Android 4.3 (API level 18) in July 2013 (SELinux became enabled by default)
- Android 4.4 (API level 19) in October 2013 (several new APIs and ART introduced)
- Android 5.0 (API level 21) in November 2014 (ART used by default and many other features added)
- Android 6.0 (API level 23) in October 2015 (many new features and improvements, including granting; detailed permissions setup at runtime rather than all or nothing during installation)
- Android 7.0 (API level 24-25) in August 2016 (new JIT compiler on ART)
- Android 8.0 (API level 26-27) in August 2017 (a lot of security improvements)
- Android 9 (API level 28) in August 2018 (restriction of background usage of mic or camera, introduction of lockdown mode, default HTTPS for all apps)
- Android 10 (API level 29) in September 2019 (notification bubbles, project Mainline)


### 普通应用程序的 Linux UID/ GID

Android 利用 Linux 用户管理来隔离应用程序。这种方法不同于传统Linux的用户管理。传统Linux中，多个应用程序通常由同一用户运行。

Android 为每个应用程序创建一个唯一的UID，并在单独的进程中运行该程序。因此每个应用都只能访问自己的资源，此保护由Linux内核强制执行。

应用程序的UID通常在 10000到99999之间。Android 应用程序会根据 UID 收到用户名，例如使用UID 10188 的应用使用用户名 u0_a188。如果允许一个app请求被授予，相应的组ID被增加到 app进程中。例如，某个应用的用户ID属于10188，它属于组ID 2003(inet).那么这个组关联的 android.permission.INTERNET 权限。


### 应用程序沙箱

app在Android应用程序沙箱中执行，与其他应用和Android系统本身其他程序分开，这增加了安全性。

安装新的应用后，Android将创建一个以该应用程序包命名的新目录，它将导致下列路径：```/data/data/[package-name]```。这个目录包含了app数据。

Linux 目录权限设置该路径为可读、仅该应用uid可写。

<img src="images/owaspmatg_android01/sandbox01.png">

可以通过查看```/data/data```目录下的文件系统权限来验证这一点。例如可以看到：

```
drwx------  4 u0_a97              u0_a97              4096 2017-01-18 14:27 com.android.calendar
drwx------  6 u0_a120             u0_a120             4096 2017-01-19 12:54 com.android.chrome
```

希望应用共享沙箱的开发者可以不用沙箱。当两个应用使用相同的证书签名，并显示共享相同的用户id（它们的 AndroidManifest.xml 文件中具有 sharedUserId）时，每个应用程序可以访问彼此的数据目录。

### 受精卵 Zygote

Zygote 这个进程在 Android initialization 时启动。Zygote是一个启动apps的系统服务。它作为基本进程，包含了apps需要的核心库。一旦启动，zygote进程打开 socket ```/dev/socket/zygote``` ，并监听从本地客户端来的连接。当它收到一个连接，他就forks 一个新的进程，然后调用和执行 app代码。

### 应用生命周期

Android中，一个app的生命周期由os控制。当启动应用程序组件并且同一应用尚未运行其他任何组件时，将创建一个新的Linux进程。

当不在需要后者或需要回收而运行其他更重要的app时，Android可能会终止该过程。终止进程的决定主要与用户与进程交互的状态有关。

通常进程可以处于四种状态之一：
- 前台进程，（屏幕顶端运行的活动或正在运行的 BroadcastReceiver）
- 可见过程，用户意识到的过程
- 服务过程，托管启动的服务，用户不可见。
- 缓存进程，当前不需要的进程。


### 应用套件（app bundles）

Android app可以以两种形式提供：
- android package kit ，即apk
- android app bundle ，即.aab

Android app bundle 提供了应用程序所需的所有资源，但推迟了apk的生成及其向 google play的签名。最好用bundletool命令将其打为apk包。

```bundletool build-apks --bundle=/MyApp/my_app.aab --output=/MyApp/my_app.apks```

APK是签名的二进制文件，其中包含了几个模块中的应用程序代码。其中的基本模块，包含了应用程序的核心。可以用各种模块扩展。

如果向生成签名的apks，可以使用下列命令：

```shell
$ bundletool build-apks --bundle=/MyApp/my_app.aab --output=/MyApp/my_app.apks
--ks=/MyApp/keystore.jks
--ks-pass=file:/MyApp/keystore.pwd
--ks-key-alias=MyKeyAlias
--key-pass=file:/MyApp/key.pwd
```

### Android manifest（清单文件）

每个app都有一个manifest文件，以二进制xml格式嵌入内容。标准名称是 AndroidMainfest.xml。它位于APK文件的根目录中。

它描述了app的：
- 结构
- 组件（活动、服务、内容提供者、意图接收者）
- 请求的权限
- 常规app元数据（如图标、版本号、主题）
- 兼容的api（最小、目标和最大sdk版本）
- 可以选用的存储类型（内部和外部）

下面是示例：

```xml
<manifest
    package="com.owasp.myapplication"
    android:versionCode="0.1" >

    <uses-sdk android:minSdkVersion="12"
        android:targetSdkVersion="22"
        android:maxSdkVersion="25" />

    <uses-permission android:name="android.permission.INTERNET" />

    <provider
        android:name="com.owasp.myapplication.MyProvider"
        android:exported="false" />

    <receiver android:name=".MyReceiver" >
        <intent-filter>
            <action android:name="com.owasp.myapplication.myaction" />
        </intent-filter>
    </receiver>

    <application
        android:icon="@drawable/ic_launcher"
        android:label="@string/app_name"
        android:theme="@style/Theme.Material.Light" >
        <activity
            android:name="com.owasp.myapplication.MainActivity" >
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
            </intent-filter>
        </activity>
    </application>
</manifest>
```


### App 组件

Android apps 有多个高层组件构成：
- Activites
- Fragments
- Intents
- Broadcast receivers
- Content providers and services

所有这些元素由Android os提供，可以从APIs中获取预先定义的形式。

#### Activities

Activities 构成app任何可见部分。每个屏幕只有一个activity，因此有三个不同屏幕的app，可以实现3个不同的活动。通过扩展Activity类来声明活动。它们包含所有的用户界面元素：fragment、view、layout。

每个activity都要在清单文件中声明。

```xml
<activity android:name="ActivityName"> </activity>

```

活动也有其生命周期，需要监视系统处理。活动可以处于下列状态：
- active
- paused
- stopped
- inactive

这些状态由android os管理。活动可以实现下列事件管理器：
- onCreate
- onSaveInstanceState
- onStart
- onResume
- onRestoreInstanceState
- onPause
- onStop
- onRestart
- onDestroy

#### Fragment

Fragment 代表活动中的行为或用户界面的一部分。Android 3.0（api level 11）引入了 Fragment 。

Fragment 旨在封装界面的各个部分，以促进重用和适应不同尺寸的屏幕。Fragment 是自治的，包含自己所需的组件，例如布局、按钮等。但它们必须与 Activity 集成在一起才有用，即 Fragment 不能单独存在。它们有自己的生命周期，与实施它们的生命周期紧密相关。

由于 Fragment 有自己的生命周期，因此 Fragment 类包含可以重新定义和扩展的事件管理器，这些事件管理器包括：
- onAttach
- onCreate
- onDestroy
- onDetach
- ...

```java
public class MyFragment extends Fragment {
    ...
}
```

Fragment 不需要在manifest文件中声明，因为它取决于 Activity。管理Fragments可以用FragmentManager类，便于查、增、删、改 Fragment。


#### IPC 进程间通信

每个Android 进程都有自己的沙盒地址空间。进程间通信功能允许app安全交换信号和数据。Android 的 IPC 不再依赖Linux IPC，而是基于 Binder（OpenBinder的自定义实现），大多数 Android 系统服务和所有高级IPC服务都依赖于Binder。

Binder 代表很多不同的事物：
- Binder driver: kernel-level driver
- Binder Protocol: low-level ioctl-based protocol used to communicate with the binder driver
- IBinder Interface: a well-defined behavior that Binder objects implement
- Binder object: generic implementation of the IBinder interface
- Binder service: implementation of the Binder object; for example, location service, and sensor service
- Binder client: an object using the Binder service


Binder 框架包含一个c/s通信模型。要使用IPC，app会在代理对象中调用IPC方法。代理对象透明地将调用参数编组到一个包中，并将十五发送到 Binder 服务器，该服务器已实现为字符驱动程序 /dev/biner。 服务器拥有一个用于处理传入请求的线程池，将消息传递到目标对象。从客户端app的角度来看，所有这些都似乎是常规方法调用，所有繁重工作由 binder 框架完成。

<img src="images/owaspmatg_android01/binder.jpg">

允许其他应用程序绑定到它们的服务称为绑定服务。这些服务必须为客户端提供IBinder接口。开发人员使用Android接口描述符语言（AIDL）为远程服务编写接口。

Servicemanager是一个系统守护进程，它管理系统服务的注册和查找。它维护一个 name/Binder 列表。在 android.os.ServiceManger中，服务使用 addService 添加，使用 getService 方法根据服务name获取。

```java
public static IBinder getService(String name) {
        try {
            IBinder service = sCache.get(name);
            if (service != null) {
                return service;
            } else {
                return getIServiceManager().getService(name);
            }
        } catch (RemoteException e) {
            Log.e(TAG, "error in getService", e);
        }
        return null;
    }
```

可以使用 service list 命令查询所有系统服务列表。

```
$ adb shell service list
Found 99 services:
0 carrier_config: [com.android.internal.telephony.ICarrierConfigLoader]
1 phone: [com.android.internal.telephony.ITelephony]
2 isms: [com.android.internal.telephony.ISms]
3 iphonesubinfo: [com.android.internal.telephony.IPhoneSubInfo]
```

#### Intents

Intents 消息传递是建立在 Binder 之上的异步通信框架。这个框架允许点对点和发布-订阅消息传递。一个 Intent 是一个消息对象，能够用于从别的app组件请求一个action。尽管 Intents 有多种方式为内部组件间的通信提供方便，但基本的方式有3种：

- Starting an activity
- Starting a service
- Delivering a brodcast

有两种 Intents，下面是显示 intent，它使用完全限定类名，命名了将要启动的组件：
```java
Intent intent = new Intent(this, myActivity.myClass);
```

隐式intent，使用uri命名启动的组件：

```java
Intent intent = new Intent(Intent.MY_ACTION, Uri.parse("https://www.owasp.org"));
```

一个 intent 过滤器是定义在 android manifest 文件中的一个表达式，它指定了希望接收到的 intent的类型。例如，通过为某个activity声明一个intent filter，你可以使其他应用程序以某种意图直接启动你的活动。

下面使由os发出的几个intents：
- ACTION_CAMERA_BUTTON
- ACTION_MEDIA_EJECT
- ACTION_NEW_OUTGOING_CALL
- ACTION_TIMEZONE_CHANGED

为了安全和隐私，本地广播管理器用于在某个app中发送和接收 intents，而无需将其发送到os的其余部分。这对于确保敏感数据不离开app边界很有用。

#### broadcast manager

广播接收器是允许app从其他app和os接收到通知的组件。有了广播管理器，app可以对事件做出反应。它们常用于更新界面、启动服务、更新内容、通知用户等。

有两种方法使系统知道广播接收器，一种是在Android manifest文件中声明，指定广播接收器与intent filter的关联，指示接收器监听的动作。

```
<receiver android:name=".MyReceiver" >
    <intent-filter>
        <action android:name="com.owasp.myapplication.MY_ACTION" />
    </intent-filter>
</receiver>
```

#### content provider

Android 使用 SQLite作为数据的永久存储。它提供了完整的 API:
- Cursor
- ContentValues
- SQLiteOpenHelper
- ContentProvider
- ContentResolver
- etc

SQLite 不作为单独进行运行，它作为app的一部分。默认情况下，一个数据库属于一个给定的app，且只有这个app能访问。

Content Provider 也提供了一种抽象数据源（包括数据库和文件）的强大机制，还提供了一种标准搞笑的机制在应用程序之间共享数据。

Content Provider通过URI寻址方案实现。

#### 服务

服务是 Android OS 组件（基于Service 类），它们在后台执行任务（数据处理、启动intent和broadcast），而无需提供用户界面。服务旨在长期运行进程。它们的系统优先级低于活动应用程序的优先级，但高于非活动应用程序的优先级。因此，他们不太可能在系统需要资源时被杀死，并且可以将它们配置为在有足够资源可用时自动重新启动。

注意，服务，像activities一样，在主app线程中被执行。一个服务不产生自己的线程，也不运行在单独进程中，除非你指定它。

#### 权限 permission

由于Android app安装在沙箱中，并且最初无法访问用户信息和系统组件（如摄像头），因此android为系统提供了针对该应用程序可以请求的某些任务的一组预定义权限。

在 android 6.0（api level 23）之前，安装时会授予app请求的所有权限，从api level 23开始，用户必须在应用执行期间批准一些权限请求。

#### 保护等级 protection levels

Android 权限根据其提供的保护级别进行排名，分为4类：
- normal：低级保护等级。它使应用程序可以访问隔离的应用程序级功能，而对其他app、user、os的风险最小。它是默认的保护等级。
- dangerous：此权限允许该应用执行可能影响用户隐私或用户设备正常操作的操作。用户决定app是否具有此权限。
- signature：仅当使用与声明许可的app相同的证书对发出请求的app进行签名时，才可授予该许可。如果签名匹配，则自动授予权限。
- systemorsignature，此权限仅授予嵌入在系统映像中或使用声明该权限的app签名的同一证书签名的app。

##### 申请权限

App可以使用```<uses-permission/>```,将申请请求写在类似下面的清单文件中

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.permissions.sample" ...>

    <uses-permission android:name="android.permission.RECEIVE_SMS" />
    <application>...</application>
</manifest>
```

##### 声明权限

Apps 可以暴露特性和内容给其他的已安装在系统中的app。为了限制对它自己组件的访问，它可以使用任意的android预定义权限或自定义权限。自定义权限的声明可以使用```<permission>```，下面是一个例子：

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.permissions.sample" ...>

    <permission
    android:name="com.permissions.sample.ACCESS_USER_INFO"
    android:protectionLevel="signature" />
    <application>...</application>
</manifest>
```
上面的代码定义了一个新的权限，名字为com.permissions.sample.ACCESS_USER_INFO，保护级别为Signature。凡具有相同开发者证书的应用，均可访问受此权限保护的任何组件。

##### 在android组件上执行权限

Android 组件使用权限机制保护自己的接口。权限可以在activities、services 和 broadcast receivers 上执行，通过在 Android Manifest.xml中添加属性```android:permission``` 给相应的组件标签：

```
<receiver
    android:name="com.permissions.sample.AnalyticsReceiver"
    android:enabled="true"
    android:permission="com.permissions.sample.ACCESS_USER_INFO">
    ...
</receiver>
```

content provider 有些不同，它们支持另一套许可：
- reading：```android:readPermission```
- writing:```android:writePermission```
- 使用uri访问content provider

- ```android:writePermission```, ```android:readPermission```: the developer can set separate permissions for reading or writing.
- ```android:permission```: general permission that will control reading and writing to the content provider.
- ```android:grantUriPermissions```: "true" if the content provider can be accessed with a content URI (the access temporarily bypasses the restrictions of other permissions), and "false" otherwise.

### 签名和发布

开发好应用后，下一步就是发布。在将应用添加到app store中前，必须对其进行签名。加密的签名用于验证标记，由开发者设置。它定义了应用作者，确保了app在发布后不能被修改。

#### 签名过程

在开发中，apps使用自动生成的证书进行签名。这个证书是不安全且仅用于调试。许多app stores不接受这类证书用于发布签名。因此需要有更多安全特性的证书。

在Andorid设备上安装应用后，程序包管理器将确保已使用相应app中包含的证书对app进行签名。如果证书公钥与用在设备上签署某个其他apk的密钥相匹配，则新的apk可能会与先前存在的apk共享一个uid。这促进了某个app供应商多个app之间的交互。

#### apk签名方案

Android 支持三种app签名方案。

从Android 9（api level 28）开始可以使用：
- APK Signature Scheme v3 (v3 scheme)
- APK Signature Scheme v2 (v2 scheme) 
- JAR signing (v1 scheme). 

从Android 7（api level 24）起，可以使用：
- APK Signature Scheme v2 (v2 scheme) 
- JAR signing (v1 scheme)

##### JAR 签名（v1 scheme）

app签名原始版本，实现了将已签名APK作为标准签名JAR，这个JAR包含所有在META-INF/MANIFEST.MF中的所有条目。

所有文件必须用一个通用的证书签名。

这个模式不能保护apk的某些部分，例如ZIP 元数据。

本方案的缺点是APK验证程序需要在app签名前处理不受信任的数据结构，并且验证程序会丢弃数据结构未涵盖的数据。同样，APK验证程序必须解压缩所有压缩文件，这样会占用大量时间和内存。



##### APK签名方案（v2）

使用APK签名方案，可以对完整APK进行哈希处理和签名，然后创建一个apk签名块并将其插入apk中。在验证期间，v2方案检查整个apk文件的签名。这种apk验证，速度快，并提供了更全面的保护以防止被修改。v2方案签名验证过程如下图所示：

<img src="images/owaspmatg_android01/apk-validation-process.png">

##### APK 签名方案（v3）
v3 apk签名块格式与v2相同。v3将有关受支持的sdk版本和旋转证明结构的新添加到apk签名块。

<img src="images/owaspmatg_android01/apk-validation-process-v3-scheme.png">

#### 创建证书

Android 使用 public/private 证书对Android app（.apk)进行签名。证书一一堆信息。密钥是其中最重要的信息。

Public证书包含用户的公用密钥；Private证书包含用户的私钥。

证书是唯一的，不能重新生成，丢失将无法回复。如果证书丢失，app创建者可以新建一对证书。

在Android SDK中，使用```keytool```命令，可以创建密钥对，例如：

```$ keytool -genkey -alias myDomain -keyalg RSA -keysize 2048 -validity 7300 -keystore myKeyStore.jks -storepass myStrongPassword```

#### 对某个app进行签名

签名过程（signature）的目标是将app文件(.apk)与开发人员的public key进行关联（加密计算）。

- 开发人员计算了APK文件的hash值（使用消息验证算法计算出hash值）；
- 然后使用字节的私钥对其进行加密（密码学上这应该是数字签名，而不是为敏感数据加密）；
- 第三方可以通过作者公钥解密（验证签名），验证hash值与解密结果是否一致。

许多IDE集成了app签名过程。

#### zipalign

这个工具用于在发布app前整理apk文件。这个工具整理所有未压缩的数据，例如图片、原始文件、4字节boundaries，以帮助app运行时时的内存管理。

注意：zipalign 用在签名之前。

#### 发布app

Android 生态是开发的，可以从任意位置发布。最有名的地方是google play。


## Android app 攻击面

Android app 攻击面由app的所有组件组成，包括发布应用程序和支持其功能的所有辅助材料。

如果Android app 不具备下列条件，可能易受攻击：

- 通过IPC通信或URL方案验证所有输入
- 验证用户在输入字段中的所有输入
- 验证WebView中加载的内容
- 与后端服务器安全通信或容易受到server与mobile app之间的中间人攻击
- 安全存储所有本地数据，或从存储中加载不受信任的数据
- 保护自己不受已破坏环境、重新打包、其他本地攻击影响（防逆向和篡改）
