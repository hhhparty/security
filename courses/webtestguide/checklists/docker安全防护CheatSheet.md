# Docker 安全简明手册

## 介绍

Docker是最流行的容器化技术。正确使用后，与直接在主机上运行应用程序相比，它可以提高安全级别。另一方面，某些错误的配置可能导致安全级别降低，甚至引入新的漏洞。

本备忘单的目的是提供易于使用的常见安全性错误和良好做法的列表，以帮助您保护Docker容器。

## 规则

### 规则#0-保持主机和Docker最新安全更新

为了防止已知的容器逃逸漏洞（通常会升级为root /管理员权限），修补Docker Engine和Docker Machine至关重要。

此外，容器（与虚拟机不同）与主机共享内核，因此在容器内执行的内核漏洞利用将直接攻击主机内核。例如，在良好绝缘的容器内执行的内核特权升级漏洞利用（例如[Dirty COW](https://github.com/scumjr/dirtycow-vdso)将导致对主机的根访问。

### 规则#1-不要公开Docker守护进程套接字（甚至不公开给容器）

Docker socket ```/var/run/docker.sock``` 是Docker正在侦听的UNIX套接字。这是Docker API的主要入口点。此套接字的所有者是root。向某人授予访问权限等同于向您的主机提供不受限制的root访问权限。

**请勿启用 tcp Docker守护程序套接字。**如果您使用`-H tcp：//0.0.0.0：XXX`或类似来运行docker守护程序，则您将暴露对Docker守护程序未经加密和未经身份验证的直接访问。如果确实确实需要这样做，则应确保它安全。检查如何执行此操作[遵循Docker官方文档](https://docs.docker.com/engine/reference/commandline/dockerd/#daemon-socket-option).

**请勿将```/var/run/docker.sock ```暴露给其他容器**。如果您使用`-v /var/run/docker.sock：// var / run / docker.sock`或类似的文件运行docker镜像，则应该对其进行更改。请记住，以只读方式安装套接字不是解决方案，而只会使其难以利用。docker-compose文件中的等效内容如下所示：

```yaml
volumes:
- "/var/run/docker.sock:/var/run/docker.sock"
```

### 规则#2-设置用户

配置容器以使用非特权用户是防止特权升级攻击的最佳方法。可以通过以下三种不同方式来完成此操作：

1.在运行时，使用docker run命令的-u选项，例如：

``
docker run -u 4000 alpine
```

2.在构建期间。在Dockerfile中简单添加用户并使用它。例如：

```
FROM alpine
RUN groupadd -r myuser && useradd -r -g myuser myuser
<HERE DO WHAT YOU HAVE TO DO AS A ROOT USER LIKE INSTALLING PACKAGES ETC.>
USER myuser
```

3.在 [Docker守护程序](https://docs.docker.com/engine/security/userns-remap/#enable-userns-remap-on-the-daemon) 中启用用户名称空间支持（`--userns-remap = default`）。守护进程）

可在[Docker官方文档]（https://docs.docker.com/engine/security/userns-remap/）上找到有关此主题的更多信息。

在kubernetes中，可以使用runAsNonRoot字段在[安全上下文]（https://kubernetes.io/docs/tasks/configure-pod-container/security-context/）中进行配置，例如：

```yaml
kind: ...
apiVersion: ...
metadata:
  name: ...
spec:
  ...
  containers:
  - name: ...
    image: ....
    securityContext:
          ...
          runAsNonRoot: true
          ...
```

作为Kubernetes集群管理员，您可以使用[Pod安全策略]（https://kubernetes.io/docs/concepts/policy/pod-security-policy/）对其进行配置。

### 规则#3-限制功能（仅授予容器所需的特定功能）

[Linux内核功能](http://man7.org/linux/man-pages/man7/capabilities.7.html)是一组特权，可以由特权使用。Docker默认情况下仅运行一部分功能。
您可以更改它并删除某些功能（使用`--cap-drop`来加固您的docker容器，或者根据需要添加某些功能（使用`-cap-add`）。

请记住不要使用带有--privileged标志的容器-这会将所有Linux内核功能添加到容器中。

最安全的设置是删除所有功能“ --cap-drop all”，然后仅添加所需的功能。例如：

```docker run --cap-drop all --cap-add CHOWN alpine```

**请记住：不要运行带有-privileged**标志的容器！

在kubernetes中，可以使用“capabilities”字段在 Security Context（https://kubernetes.io/docs/tasks/configure-pod-container/security-context/）中进行配置，例如：

```yaml
kind: ...
apiVersion: ...
metadata:
  name: ...
spec:
  ...
  containers:
  - name: ...
    image: ....
    securityContext:
          ...
          capabilities:
            drop:
              - all
            add:
              - CHOWN
          ...
```

作为Kubernetes集群管理员，您可以使用[Pod安全策略]（https://kubernetes.io/docs/concepts/policy/pod-security-policy/）对其进行配置。

### 规则\＃4-添加–no-new-privileges标志

始终使用`--security-opt = no-new-privileges`运行docker镜像，以防止使用`setuid`或`setgid`二进制文件升级权限。

在kubernetes中，可以使用[allowPrivilegeEscalation]字段在[安全上下文]（https://kubernetes.io/docs/tasks/configure-pod-container/security-context/）中进行配置，例如：

```yaml
kind: ...
apiVersion: ...
metadata:
  name: ...
spec:
  ...
  containers:
  - name: ...
    image: ....
    securityContext:
          ...
          allowPrivilegeEscalation: false
          ...
```

作为Kubernetes集群管理员，您可以使用[Pod安全策略]（https://kubernetes.io/docs/concepts/policy/pod-security-policy/）参考Kubernetes文档对其进行配置。

### 规则\＃5-禁用容器间通信（--icc = false）

默认情况下，容器间通信（icc）是启用的-这意味着所有容器都可以彼此通信（使用[`docker0`桥接网络]（https://docs.docker.com/v17.09/engine/userguide/联网/ default_network /容器通信/容器间#communication））。
可以通过运行带有`--icc = false`标志的docker daemon来禁用它。
如果禁用了icc（icc = false），则需要使用```--link = CONTAINER_NAME_or_ID：ALIAS```选项告诉哪些容器可以通信。
请参阅[Docker文档-容器通信]（https://docs.docker.com/v17.09/engine/userguide/networking/default_network/container-communication/#communication-between-containers）中的更多内容

在Kubernetes中，可以使用[网络策略]（https://kubernetes.io/docs/concepts/services-networking/network-policies/）。

### 规则#6-使用Linux安全模块（seccomp，AppArmor或SELinux）

**首先，请不要禁用默认的安全配置文件！**

考虑使用安全配置文件，例如[seccomp]（https://docs.docker.com/engine/security/seccomp/）或[AppArmor]（https://docs.docker.com/engine/security/apparmor/）。

可以在[安全上下文文档]（https://kubernetes.io/docs/tasks/configure-pod-container/security-context/）和[Kubernetes API文档]（https： //kubernetes.io/docs/reference/generated/kubernetes-api/v1.18/#securitycontext-v1-core）

### 规则#7-限制资源（内存，CPU，文件描述符，进程，重新启动）

避免DoS攻击的最佳方法是限制资源。您可以限制[内存]（https://docs.docker.com/config/containers/resource_constraints/#memory），[CPU]（https://docs.docker.com/config/containers/resource_constraints/#cpu） ，最大重新启动次数（`--restart = on-failure：<number_of_restarts>`），最大文件描述符数量（`--ulimit nofile = <number>`）和最大进程数（`--ulimit nproc = <number>`）。

[检查文档以获取有关ulimit的更多详细信息]（https://docs.docker.com/engine/reference/commandline/run/#set-ulimits-in-container---ulimit）

您也可以在Kubernetes中执行此操作：[将内存资源分配给容器和Pod]（https://kubernetes.io/docs/tasks/configure-pod-container/assign-memory-resource/），[将CPU资源分配给容器和豆荚]（https://kubernetes.io/docs/tasks/configure-pod-container/assign-cpu-resource/）和[将扩展资源分配给容器
]（https://kubernetes.io/docs/tasks/configure-pod-container/extended-resource/）

### 规则#8-将文件系统和卷设置为只读

**使用`--read-only`标志运行带有只读文件系统的容器**。例如：

```docker run --read-only alpine sh -c 'echo "whatever" > /tmp'```

如果容器内的应用程序必须暂时保存某些内容，则将`--read`标志与`--tmpfs`结合使用，如下所示：

```docker run --read-only --tmpfs /tmp alpine sh -c 'echo "whatever" > /tmp/file'```

docker-compose文件中的等效项为：

```yaml
version: "3"
services:
  alpine:
    image: alpine
    read_only: true
```

在[安全上下文]（https://kubernetes.io/docs/tasks/configure-pod-container/security-context/）中kubernetes中的等效项将是：

```yaml
kind: ...
apiVersion: ...
metadata:
  name: ...
spec:
  ...
  containers:
  - name: ...
    image: ....
    securityContext:
          ...
          readOnlyRootFilesystem: true
          ...
```

此外，如果仅为了读取而安装了该卷，则将它们安装为只读。
可以通过将`：ro`附加到`-v`来完成：

```
docker run -v volume-name:/path/in/container:ro alpine
```

或者使用`--mount`选项：

```
docker run --mount source=volume-name,destination=/path/in/container,readonly alpine
```

### 规则#9-使用静态分析工具

要检测具有已知漏洞的容器-使用静态分析工具扫描图像。

- Free
    - [Clair](https://github.com/coreos/clair)
    - [Trivy](https://github.com/knqyf263/trivy)
- Commercial
    - [Snyk](https://snyk.io/) **(open source and free option available)**
    - [anchore](https://anchore.com/opensource/) **(open source and free option available)**
    - [Aqua Security's MicroScanner](https://github.com/aquasecurity/microscanner) **(free option available for rate-limited number of scans)**
    - [JFrog XRay](https://jfrog.com/xray/)
    - [Qualys](https://www.qualys.com/apps/container-security/)

To detect misconfigurations in Kubernetes:

- [kubeaudit](https://github.com/Shopify/kubeaudit)
- [kubesec.io](https://kubesec.io/)
- [kube-bench](https://github.com/aquasecurity/kube-bench)

To detect misconfigurations in Docker:

- [inspec.io](https://www.inspec.io/docs/reference/resources/docker/)
- [dev-sec.io](https://dev-sec.io/baselines/docker/)

### 规则\＃10-将日志记录级别至少设置为INFO

默认情况下，Docker守护程序配置为具有“ info”的基本日志记录级别，如果不是这种情况，请将Docker守护程序日志级别设置为“ info”。基本原理：设置适当的日志级别，将Docker守护程序配置为记录您稍后要查看的事件。基本日志级别为“ info”及更高级别将捕获除调试日志以外的所有日志。直到且除非有必要，否则您不应在“调试”日志级别运行docker daemon。

要在docker-compose中配置日志级别：

```docker-compose --log-level info up```

### 规则\＃11-在构建时清理Dockerfile

通过编写Dockerfile时的一些最佳实践可以避免许多问题。在构建流水线中添加安全标签作为步骤，可以避免很多麻烦。一些值得检查的问题是：

-确保指定了“ USER”指令
-确保固定基本映像版本
-确保已固定OS软件包的版本
-避免使用`ADD`代替`COPY`
-避免使用“ apt / apk升级”
-避免在RUN指令中进行卷曲重击

参考文献：

-[DevSec上的Docker基准]（https://dev-sec.io/baselines/docker/）
-[使用Docker命令行]（https://docs.docker.com/engine/reference/commandline/cli/）
-[docker-compose CLI概述]（https://docs.docker.com/compose/reference/overview/）
-[配置日志记录驱动程序]（https://docs.docker.com/config/containers/logging/configure/）
-[查看容器或服务的日志]（https://docs.docker.com/config/containers/logging/）
-[Dockerfile安全最佳实践]（https://cloudberry.engineering/article/dockerfile-security-best-practices/）

##相关项目

[OWASP Docker前10名]（https://github.com/OWASP/Docker-Security）