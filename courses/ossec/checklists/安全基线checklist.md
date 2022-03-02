# 安全基线检查

## 容器及编排
- https://github.com/aquasecurity/kube-bench

- https://github.com/dev-sec/cis-docker-benchmark
- https://github.com/dev-sec/cis-kubernetes-benchmark

- https://github.com/neuvector/kubernetes-cis-benchmark
## 云
- https://github.com/toniblyx/prowler
  - perform AWS security best practices assessments, audits, incident response, continuous
- https://github.com/awslabs/aws-security-benchmark

## 主机
- https://github.com/Jsitech/JShielder
  - Hardening Script for Linux Servers/ Secure LAMP-LEMP Deployer/ CIS Benchmark
- https://github.com/major/cis-rhel-ansible
  - Ansible playbooks for CIS Benchmarks on RHEL/CentOS 6
- https://github.com/maldevel/blue-team
- https://github.com/chroblert/securitybaselinecheck

- https://github.com/finalduty/cis_benchmarks_audit
- https://github.com/aquasecurity/linux-bench
## 汇聚信息后台
- https://github.com/chroblert/AssetManage

## 企业做好安全基线的思路

基线管理，通常来自于3个原因：
- 合规性性要求，上级安全检查；
- 遇到安全事件，根源在基础安全配置。如登录策略未配置好导致账号可以爆破、敏感信息泄露、默认口令、开启了含有漏洞服务的端口。
- 做好基础的基线管理和系统加固可以在很多突发安全漏洞情况有足够的响应处理时间。

### 怎样做好基线配置管理
- 从整个安全工作来说，需要组织高层的支持，基线配置管理也同样需要;
- 安全运维人员需要跟业务、开发、运维一起讨论，定制一个适用的基础运维环境统一计划，使用相同版本的操作系统和应用软件（容器、框架）。
- 开发人员（包括外包开发）使用安全人员建议的操作系统版本定制开发。
- 运维人员使用分发软件（如：SaltStack、Puppet）统一做基线的配置修改。可以参考如下步骤：

#### 建立基线配置管理规划

- 了解组织现有资产情况（负责人是谁？现在运行的操作系统是什么版本，支持系统是什么版本？供应商是谁？是否还有开发或外包开发支持等）。
- 同业务、开发、运维一起讨论制定合理的版本统一化建议，对统一化的时间达成一致的共识，并寻求最高管理层的支持。
- 实施情况和实施效果跟绩效关联，明确基线的订制、实施、评审责任，有检查手段能够确认安全基线未能成功部署的原因，有奖惩措施会提高基线落实的效果。

#### 定制基础操作系统镜像
- 基础镜像包括选择那个版本的操作系统、如何进行分区，如何最小化安装
- 如何部署必须的工具软件（如杀毒，主机入侵检测、运维系统Agent等）
- 统一做好的基础操作系统镜像分发给开发作为基础的定制开发环境。

#### 制定基线配置模板
基线配置模板可以包含运维和安全2个部分：
- 运维部分如性能相关配置、稳定性相关配置、个性化配置。
  - 同一个应用（Tomcat、IIS、Apache等）可以做成一个统一的配置模板由SaltStack、Puppet进行分发。
  - 同时也可以做一份标准化配置脚本，在部分能分发的情况下也能统一基线配置。

- 安全的基线配置可以参考2个来源：
  - 工信部基线配置要求;
  - https://learn.cisecurity.org/benchmarks 的安全配置建议，内容很多。

#### 分发基线配置

- 分发基线配置最好和运维一起做，由运维支撑系统进行分发，可以加速效率。如果运维目前阶段还没有统一的分发管理系统，可单个用配置脚本完成，这样效率就很低。

#### 基线配置检查

基线配置检查有独立的商业产品可以支持，也可以使用运维管理系统进行检查。

#### 基线配置修订

每隔几年主流操作系统就会进行一次大版本的升级，商业版的操作系统也有可能供应商不在支持，需要建立基线修订的触发条件，满足什么情况下对基线进行修订，按照提前做好的修订流程修订基线配置。

### 基线管理配置的文档示例
同安全文档要求，分为3级文档，1级是指导规范，2级是具体操作要求，3级是结果和检查记录。

《安全基线技术规范》

其中框架分类可以参考CIS Benchmark的分类。

《XX基线配置》


检查记录可以在基线配置文档增加个符合选项。

