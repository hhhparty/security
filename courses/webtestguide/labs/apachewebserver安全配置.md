# Apache web server 安全技巧

## DoS 攻击
DoS攻击是不能被根本制止的，但你可以做一些工作来缓解问题。

最常用的方法是使用防火墙或其他操作系统配置，例如，使用防火墙限制单一IP地址或网段同时连接的数量，当然这无法阻止DDoS。

下面有一些Apache HTTP server 配置设置，可以缓解DoS攻击。

- RequestReadTimeout 指令允许限制一个客户端发送请求的时间
- TimeOut 指令可以降低被攻击主机的影响。TimeOut可能会影响长期运行的CGI脚本，将其设置为尽可能小的秒数。
- KeepAliveTimeout 指令也可以降低DoS攻击影响。一些网站甚至通过设置```KeepAlive```关闭了保持活跃功能，但这也会降低性能。
- 由其他模块提供的各种 timeout-related 指令的值需要被检查。
- 指令 ``` LimitRequestBody, LimitRequestFields, LimitRequestFieldSize, LimitRequestLine, and LimitXMLRequestBody``` 应该仔细配置，限制由客户端输入引起资源消耗。
- 在操作系统支持下，确定你使用 ```AcceptFilter``` 指令来卸载请求处理部分。默认情况下Apache httpd是设置为 active，但可能要求你重新配置内核。
- 调节 ```MaxRequestWorkers``` 指令来在不耗尽资源情况下，运行服务器处理最大的并发连接数。
- 使用线程化的 mpm 可以允许处理更多的并发连接。而且， event mpm使用异步处理来避免为每一个连接分配一个线程。由于OpenSSL库的特性，event mpm当前不兼容于 mod ssl 和别的输入过滤器。
- 有一些第三方组建可以约束特定客户端行为，因此可以用于缓解DoS。


## Permissions on ServerRoot Directories
In typical operation, Apache is started by the root user, and it switches to the user defined by the User directive to serve hits. As is the case with any command that root executes, you must take care that it is protected from modification by non-root users. Not only must the files themselves be writeable only by root, but so must the directories, and parents of all directories. For example, if you choose to place ServerRoot in /usr/local/apache then it is suggested that you create that directory as root, with commands like these:

```shell
mkdir /usr/local/apache
cd /usr/local/apache
mkdir bin conf logs
chown 0 . bin conf logs
chgrp 0 . bin conf logs
chmod 755 . bin conf logs
```
It is assumed that /, /usr, and /usr/local are only modifiable by root. When you install the httpd executable, you should ensure that it is similarly protected:

cp httpd /usr/local/apache/bin
chown 0 /usr/local/apache/bin/httpd
chgrp 0 /usr/local/apache/bin/httpd
chmod 511 /usr/local/apache/bin/httpd

You can create an htdocs subdirectory which is modifiable by other users -- since root never executes any files out of there, and shouldn't be creating files in there.

If you allow non-root users to modify any files that root either executes or writes on then you open your system to root compromises. For example, someone could replace the httpd binary so that the next time you start it, it will execute some arbitrary code. If the logs directory is writeable (by a non-root user), someone could replace a log file with a symlink to some other system file, and then root might overwrite that file with arbitrary data. If the log files themselves are writeable (by a non-root user), then someone may be able to overwrite the log itself with bogus data.

## Server Side Includes
服务器端包含（SSI）给服务器管理员带来了几个潜在的安全风险。

The first risk is the increased load on the server. All SSI-enabled files have to be parsed by Apache, whether or not there are any SSI directives included within the files. While this load increase is minor, in a shared server environment it can become significant.

SSI files also pose the same risks that are associated with CGI scripts in general. Using the exec cmd element, SSI-enabled files can execute any CGI script or program under the permissions of the user and group Apache runs as, as configured in httpd.conf.

There are ways to enhance the security of SSI files while still taking advantage of the benefits they provide.

To isolate the damage a wayward SSI file can cause, a server administrator can enable suexec as described in the CGI in General section.

Enabling SSI for files with .html or .htm extensions can be dangerous. This is especially true in a shared, or high traffic, server environment. SSI-enabled files should have a separate extension, such as the conventional .shtml. This helps keep server load at a minimum and allows for easier management of risk.

Another solution is to disable the ability to run scripts and programs from SSI pages. To do this replace Includes with IncludesNOEXEC in the Options directive. Note that users may still use <--#include virtual="..." --> to execute CGI scripts if these scripts are in directories designated by a ScriptAlias directive.

## CGI in General
First of all, you always have to remember that you must trust the writers of the CGI scripts/programs or your ability to spot potential security holes in CGI, whether they were deliberate or accidental. CGI scripts can run essentially arbitrary commands on your system with the permissions of the web server user and can therefore be extremely dangerous if they are not carefully checked.

All the CGI scripts will run as the same user, so they have potential to conflict (accidentally or deliberately) with other scripts e.g. User A hates User B, so he writes a script to trash User B's CGI database. One program which can be used to allow scripts to run as different users is suEXEC which is included with Apache as of 1.2 and is called from special hooks in the Apache server code. Another popular way of doing this is with CGIWrap.

## Non Script Aliased CGI
Allowing users to execute CGI scripts in any directory should only be considered if:

You trust your users not to write scripts which will deliberately or accidentally expose your system to an attack.
You consider security at your site to be so feeble in other areas, as to make one more potential hole irrelevant.
You have no users, and nobody ever visits your server.

## Script Aliased CGI
Limiting CGI to special directories gives the admin control over what goes into those directories. This is inevitably more secure than non script aliased CGI, but only if users with write access to the directories are trusted or the admin is willing to test each new CGI script/program for potential security holes.

Most sites choose this option over the non script aliased CGI approach.

## Other sources of dynamic content
Embedded scripting options which run as part of the server itself, such as mod_php, mod_perl, mod_tcl, and mod_python, run under the identity of the server itself (see the User directive), and therefore scripts executed by these engines potentially can access anything the server user can. Some scripting engines may provide restrictions, but it is better to be safe and assume not.

## Dynamic content security
When setting up dynamic content, such as mod_php, mod_perl or mod_python, many security considerations get out of the scope of httpd itself, and you need to consult documentation from those modules. For example, PHP lets you setup Safe Mode, which is most usually disabled by default. Another example is Suhosin, a PHP addon for more security. For more information about those, consult each project documentation.

At the Apache level, a module named mod_security can be seen as a HTTP firewall and, provided you configure it finely enough, can help you enhance your dynamic content security.

## Protecting System Settings
To run a really tight ship, you'll want to stop users from setting up .htaccess files which can override security features you've configured. Here's one way to do it.

In the server configuration file, put
```
<Directory "/">
    AllowOverride None
</Directory>
```
This prevents the use of .htaccess files in all directories apart from those specifically enabled.

Note that this setting is the default since Apache 2.3.9.

## Protect Server Files by Default
One aspect of Apache which is occasionally misunderstood is the feature of default access. That is, unless you take steps to change it, if the server can find its way to a file through normal URL mapping rules, it can serve it to clients.

For instance, consider the following example:

```# cd /; ln -s / public_html```
```Accessing http://localhost/~root/```

This would allow clients to walk through the entire filesystem. To work around this, add the following block to your server's configuration:

```
<Directory "/">
    Require all denied
</Directory>
```
This will forbid default access to filesystem locations. Add appropriate Directory blocks to allow access only in those areas you wish. For example,

```
<Directory "/usr/users/*/public_html">
    Require all granted
</Directory>
<Directory "/usr/local/httpd">
    Require all granted
</Directory>
```
Pay particular attention to the interactions of Location and Directory directives; for instance, even if ```<Directory "/">``` denies access, a ```<Location "/">``` directive might overturn it.

Also be wary of playing games with the UserDir directive; setting it to something like ./ would have the same effect, for root, as the first example above. We strongly recommend that you include the following line in your server configuration files:

```UserDir disabled root```

## 检查你的日志 Watching Your Logs

apache server的标准日志主要有：
- security.log  
- error.log , 名字可能在主配置文件中的ErrorLog指令中被修改。是最为重要的log文件，存放了apache httpd发送的诊断信息，记录处理请求时发生的错误。这个日志应当是发生问题时，首先需要查看的地方。
- 模块日志，
- access.log，服务访问日志记录了所有被服务器处理的请求。其位置和内容被配置文件中的```CustomLog```指令所控制。


要及时了解发生了什么事情，你需要经常检查服务器日志。尽管日志文件仅报告了已经发生的事情，它也能让你理解当前系统面临何种攻击，以及检查当前必要的安全级别。

日志检查命令举例：

- 列出尝试渗透apche tomcat Source.jsp 的恶意形式（```jsp/ /jsp```）请求
```grep -c "/jsp/source.jsp?/jsp/ /jsp/source.jsp??" access_log```

- 列出10条最后被拒绝的客户端：
```grep "client denied" error_log | tail -n 10```

假设结果如下：
```
[Thu Jul 11 17:18:39 2002] [error] [client foo.example.com] client denied by server configuration: /usr/local/apache/htdocs/.htpasswd
```
上面的结果，仅报告了已经发生的事情，假如客户端已经能够访问 .htpasswd 文件，你可能会在 access.log 文件中，看到下列信息：

```
foo.example.com - - [12/Jul/2002:01:59:13 +0200] "GET /.htpasswd HTTP/1.1"
```
这也就意味着，你需要在服务器配置文件中加入如下的禁止命令：

```
<Files ".ht*">
    Require all denied
</Files>
```


## Merging of configuration sections
The merging of configuration sections is complicated and sometimes directive specific. Always test your changes when creating dependencies on how directives are merged.

For modules that don't implement any merging logic, such as mod_access_compat, the behavior in later sections depends on whether the later section has any directives from the module. The configuration is inherited until a change is made, at which point the configuration is replaced and not merged.

