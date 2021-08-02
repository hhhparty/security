# Reconnaissance techiques 

> ATT&CK TA0034
> 对手正在尝试收集可用于计划未来行动的信息。侦察包括使对手主动或被动地收集可用于支持目标定位的信息的技术。此类信息可能包括受害组织，基础架构或员工/人员的详细信息。攻击者可以利用此信息来帮助攻击者生命周期的其他阶段，例如使用收集的信息来计划和执行“初始访问”，确定妥协后的目标的范围和优先级，或者推动和领导进一步的侦察工作。

## T1595 Active Scanning 主动扫描

>Active Scanning	Before compromising a victim, adversaries may execute active reconnaissance scans to gather information that can be used during targeting. Active scans are those where the adversary probes victim infrastructure via network traffic, as opposed to other forms of reconnaissance that do not involve direct interaction.


### .001 Scanning IP 扫描IP地址
>Scanning IP Blocks	Before compromising a victim, adversaries may scan victim IP blocks to gather information that can be used during targeting. Public IP addresses may be allocated to organizations by block, or a range of sequential addresses.

#### NMAP

常用命令：
```shell
# nmap一般扫描
nmap [options] target_ip/subnetmask

# nmap快速发现web服务
nmap -v -iR 10000 -P0 -p 80,443,8080,8088 #随机扫描10000台主机的80端口，这种方法可快速确定使用标准http服务端口的web server

# 查询某个域名下所有主机的ip地址，使用了host区域传送方法（AXFR）不一定支持。
host -l company.com | cut -d -f 4|nmap -v -iL
```

options说明: 
- -sV 服务版本 -sT TCP -sS SYN半连接 -sA ACK -sU UDP -sR RPC -sP icmp -sn 不检查端口 -T1-5 强度 -O os测试 -A 全面测试
- --host-timeout 18000 超时时间设置为18000ms
- --scan-delay 1000 报文时间间隔 1000ms
- -S 源ip地址 -e 网卡接口
- -iR 1000 随机选择1000台主机
- -P0 ip协议即icmp
- -oN 文件名 输出到文件，-oX xml文件 ，-oG filespec

#### MASSCAN
高速扫描器。

```shell
#扫描 some web ports on 10.x.x.x at 10kpps
masscan -p80,8000-8100 10.0.0.0/8 --rate=10000
 
# 列出与nmap兼容的选项
masscan --nmap

# 扫描banners，存到二进制文件
masscan -p80 10.0.0.0/8 --banners -oB <filename>

# 读取二进制文件扫描结果，转存内容到xml文件
masscan --open --banners --readscan <filename> -oX <savefile>

```

高级选项：
- --adapter-ip 指定发包的ip地址
- --adapter-port 指定发包端口
- --adapter-mac 指定发包mac地址
- --router-mac 指定网关mac地址
- --exclude IP 地址范围黑名单，不扫描的ip地址
- --excludefile
- --includefile，-iL
- --wait 发包间隔时间

#### 其它
- nbtscan
- hping3
- 

### .002 Vulnerability Scanning 漏洞扫描
>Vulnerability Scanning	Before compromising a victim, adversaries may scan victims for vulnerabilities that can be used during targeting. Vulnerability scans typically check if the configuration of a target host/application (ex: software and version) potentially aligns with the target of a specific exploit the adversary may seek to use.

漏洞扫描可以使用nessus in kali 和 awvs for win


## T1592 Gather Victim Host Information 收集目标主机信息
> Before compromising a victim, adversaries may gather information about the victim's hosts that can be used during targeting. Information about hosts may include a variety of details, including administrative data (ex: name, assigned IP, functionality, etc.) as well as specifics regarding its configuration (ex: operating system, language, etc.).


### .001 hardware
>Before compromising a victim, adversaries may gather information about the victim's host hardware that can be used during targeting. Information about hardware infrastructure may include a variety of details such as types and versions on specific hosts, as well as the presence of additional components that might be indicative of added defensive protections (ex: card/biometric readers, dedicated encryption hardware, etc.).
### .002 software
>Before compromising a victim, adversaries may gather information about the victim's host software that can be used during targeting. Information about installed software may include a variety of details such as types and versions on specific hosts, as well as the presence of additional components that might be indicative of added defensive protections (ex: antivirus, SIEMs, etc.).
### .003 firmware
>Before compromising a victim, adversaries may gather information about the victim's host firmware that can be used during targeting. Information about host firmware may include a variety of details such as type and versions on specific hosts, which may be used to infer more information about hosts in the environment (ex: configuration, purpose, age/patch level, etc.).
### .004 client configurations
>Before compromising a victim, adversaries may gather information about the victim's client configurations that can be used during targeting. Information about client configurations may include a variety of details and settings, including operating system/version, virtualization, architecture (ex: 32 or 64 bit), language, and/or time zone.
## T1589 Gather Victim Identity Information 收集目标身份信息
>Gather Victim Identity Information	Before compromising a victim, adversaries may gather information about the victim's identity that can be used during targeting. Information about identities may include a variety of details, including personal data (ex: employee names, email addresses, etc.) as well as sensitive details such as credentials.

### .001 Credentials 身份凭证
>Before compromising a victim, adversaries may gather credentials that can be used during targeting. Account credentials gathered by adversaries may be those directly associated with the target victim organization or attempt to take advantage of the tendency for users to use the same passwords across personal and business accounts.
### .002	Email Addresses	电子邮件地址
>Before compromising a victim, adversaries may gather email addresses that can be used during targeting. Even if internal instances exist, organizations may have public-facing email infrastructure and addresses for employees.
### .003 Employee Names	员工姓名
>Before compromising a victim, adversaries may gather employee names that can be used during targeting. Employee names be used to derive email addresses as well as to help guide other reconnaissance efforts and/or craft more-believable lures.

## T1590 Gather Victim Network Information	收集目标网络信息
>Before compromising a victim, adversaries may gather information about the victim's networks that can be used during targeting. Information about networks may include a variety of details, including administrative data (ex: IP ranges, domain names, etc.) as well as specifics regarding its topology and operations.
### .001	Domain Properties	域名属性
>Before compromising a victim, adversaries may gather information about the victim's network domain(s) that can be used during targeting. Information about domains and their properties may include a variety of details, including what domain(s) the victim owns as well as administrative data (ex: name, registrar, etc.) and more directly actionable information such as contacts (email addresses and phone numbers), business addresses, and name servers.
### .002	DNS	域名服务
>Before compromising a victim, adversaries may gather information about the victim's DNS that can be used during targeting. DNS information may include a variety of details, including registered name servers as well as records that outline addressing for a target’s subdomains, mail servers, and other hosts.
### .003	Network Trust Dependencies 网络信任依赖
>Before compromising a victim, adversaries may gather information about the victim's network trust dependencies that can be used during targeting. Information about network trusts may include a variety of details, including second or third-party organizations/domains (ex: managed service providers, contractors, etc.) that have connected (and potentially elevated) network access.
### .004	Network Topology 网络拓扑
>Before compromising a victim, adversaries may gather information about the victim's network topology that can be used during targeting. Information about network topologies may include a variety of details, including the physical and/or logical arrangement of both external-facing and internal network environments. This information may also include specifics regarding network devices (gateways, routers, etc.) and other infrastructure.
### .005	IP Addresses ip地址列表

Before compromising a victim, adversaries may gather the victim's IP addresses that can be used during targeting. Public IP addresses may be allocated to organizations by block, or a range of sequential addresses. Information about assigned IP addresses may include a variety of details, such as which IP addresses are in use. IP addresses may also enable an adversary to derive other details about a victim, such as organizational size, physical location(s), Internet service provider, and or where/how their publicly-facing infrastructure is hosted.
### .006	Network Security Appliances	网络安全设备与应用
Before compromising a victim, adversaries may gather information about the victim's network security appliances that can be used during targeting. Information about network security appliances may include a variety of details, such as the existence and specifics of deployed firewalls, content filters, and proxies/bastion hosts. Adversaries may also target information about victim network-based intrusion detection systems (NIDS) or other appliances related to defensive cybersecurity operations.

## T1591	Gather Victim Org Information 收集目标组织信息

Before compromising a victim, adversaries may gather information about the victim's organization that can be used during targeting. Information about an organization may include a variety of details, including the names of divisions/departments, specifics of business operations, as well as the roles and responsibilities of key employees.
### .001	Determine Physical Locations 物理位置

Before compromising a victim, adversaries may gather the victim's physical location(s) that can be used during targeting. Information about physical locations of a target organization may include a variety of details, including where key resources and infrastructure are housed. Physical locations may also indicate what legal jurisdiction and/or authorities the victim operates within.
### .002	Business Relationships 业务关系
Before compromising a victim, adversaries may gather information about the victim's business relationships that can be used during targeting. Information about an organization’s business relationships may include a variety of details, including second or third-party organizations/domains (ex: managed service providers, contractors, etc.) that have connected (and potentially elevated) network access. This information may also reveal supply chains and shipment paths for the victim’s hardware and software resources.

### .003	Identify Business Tempo	识别业务发展过程

Before compromising a victim, adversaries may gather information about the victim's business tempo that can be used during targeting. Information about an organization’s business tempo may include a variety of details, including operational hours/days of the week. This information may also reveal times/dates of purchases and shipments of the victim’s hardware and software resources.
### .004	Identify Roles	识别角色
Before compromising a victim, adversaries may gather information about identities and roles within the victim organization that can be used during targeting. Information about business roles may reveal a variety of targetable details, including identifiable information for key personnel as well as what data/resources they have access to.

## T1598	Phishing for Information 信息收集钓鱼

Before compromising a victim, adversaries may send phishing messages to elicit sensitive information that can be used during targeting. Phishing for information is an attempt to trick targets into divulging information, frequently credentials or other actionable information. Phishing for information is different from Phishing in that the objective is gathering data from the victim rather than executing malicious code.
### .001	Spearphishing Service 鱼叉式钓鱼服务
Before compromising a victim, adversaries may send spearphishing messages via third-party services to elicit sensitive information that can be used during targeting. Spearphishing for information is an attempt to trick targets into divulging information, frequently credentials or other actionable information. Spearphishing for information frequently involves social engineering techniques, such as posing as a source with a reason to collect information (ex: Establish Accounts or Compromise Accounts) and/or sending multiple, seemingly urgent messages.
### .002	Spearphishing Attachment	鱼叉式钓鱼附件
Before compromising a victim, adversaries may send spearphishing messages with a malicious attachment to elicit sensitive information that can be used during targeting. Spearphishing for information is an attempt to trick targets into divulging information, frequently credentials or other actionable information. Spearphishing for information frequently involves social engineering techniques, such as posing as a source with a reason to collect information (ex: Establish Accounts or Compromise Accounts) and/or sending multiple, seemingly urgent messages.
### .003	Spearphishing Link 鱼叉式链接

Before compromising a victim, adversaries may send spearphishing messages with a malicious link to elicit sensitive information that can be used during targeting. Spearphishing for information is an attempt to trick targets into divulging information, frequently credentials or other actionable information. Spearphishing for information frequently involves social engineering techniques, such as posing as a source with a reason to collect information (ex: Establish Accounts or Compromise Accounts) and/or sending multiple, seemingly urgent messages.
## T1597	Search Closed Sources 搜索相近的情报源

Before compromising a victim, adversaries may search and gather information about victims from closed sources that can be used during targeting. Information about victims may be available for purchase from reputable private sources and databases, such as paid subscriptions to feeds of technical/threat intelligence data. Adversaries may also purchase information from less-reputable sources such as dark web or cybercrime blackmarkets.
### .001	Threat Intel Vendors 威胁情报提供者
Before compromising a victim, adversaries may search private data from threat intelligence vendors for information that can be used during targeting. Threat intelligence vendors may offer paid feeds or portals that offer more data than what is publicly reported. Although sensitive details (such as customer names and other identifiers) may be redacted, this information may contain trends regarding breaches such as target industries, attribution claims, and successful TTPs/countermeasures.
### .002	Purchase Technical Data	购买技术数据
Before compromising a victim, adversaries may purchase technical information about victims that can be used during targeting. Information about victims may be available for purchase within reputable private sources and databases, such as paid subscriptions to feeds of scan databases or other data aggregation services. Adversaries may also purchase information from less-reputable sources such as dark web or cybercrime blackmarkets.
## T1596	Search Open Technical Databases	搜索开源技术数据库
Before compromising a victim, adversaries may search freely available technical databases for information about victims that can be used during targeting. Information about victims may be available in online databases and repositories, such as registrations of domains/certificates as well as public collections of network data/artifacts gathered from traffic and/or scans.

开源情报信息来源：
- cve
- exploit-db
- cx security
- cnvd
- cnnvd
- securitytracker
- github

情报工具：
- kali下的`searchsploit [options] term1 [term2] ... [termN]` 可直接搜索exploitdb
- gitminer
- git-all-secret
- mailsniper.ps1 获取outlook所有联系人

在线接口：
- [百度网站安全检测](https://anquan.baidu.com/product/secindex?industry=total) 

- [360webscan网站安全检测](https://webscan.360.cn/)

- www.webscan.cc
- sbd.ximcx.cn
- censys.io/certificates?q=example.com
- crt.sh/?q=%25.example


### .001	DNS/Passive DNS	
Before compromising a victim, adversaries may search DNS data for information about victims that can be used during targeting. DNS information may include a variety of details, including registered name servers as well as records that outline addressing for a target’s subdomains, mail servers, and other hosts.
### .002	WHOIS	
Before compromising a victim, adversaries may search public WHOIS data for information about victims that can be used during targeting. WHOIS data is stored by regional Internet registries (RIR) responsible for allocating and assigning Internet resources such as domain names. Anyone can query WHOIS servers for information about a registered domain, such as assigned IP blocks, contact information, and DNS nameservers.
### .003	Digital Certificates	
Before compromising a victim, adversaries may search public digital certificate data for information about victims that can be used during targeting. Digital certificates are issued by a certificate authority (CA) in order to cryptographically verify the origin of signed content. These certificates, such as those used for encrypted web traffic (HTTPS SSL/TLS communications), contain information about the registered organization such as name and location.
### .004	CDNs	
Before compromising a victim, adversaries may search content delivery network (CDN) data about victims that can be used during targeting. CDNs allow an organization to host content from a distributed, load balanced array of servers. CDNs may also allow organizations to customize content delivery based on the requestor’s geographical region.
### .005	Scan Databases	
Before compromising a victim, adversaries may search within public scan databases for information about victims that can be used during targeting. Various online services continuously publish the results of Internet scans/surveys, often harvesting information such as active IP addresses, hostnames, open ports, certificates, and even server banners.
## T1593	Search Open Websites/Domains	
Before compromising a victim, adversaries may search freely available websites and/or domains for information about victims that can be used during targeting. Information about victims may be available in various online sites, such as social media, new sites, or those hosting information about business operations such as hiring or requested/rewarded contracts.
### .001	Social Media	Before compromising a victim, adversaries may search social media for information about victims that can be used during targeting. Social media sites may contain various information about a victim organization, such as business announcements as well as information about the roles, locations, and interests of staff.
### .002	Search Engines	Before compromising a victim, adversaries may use search engines to collect information about victims that can be used during targeting. Search engine services typical crawl online sites to index context and may provide users with specialized syntax to search for specific keywords or specific types of content (i.e. filetypes).
## T1594	Search Victim-Owned Websites	
Before compromising a victim, adversaries may search websites owned by the victim for information that can be used during targeting. Victim-owned websites may contain a variety of details, including names of departments/divisions, physical locations, and data about key employees such as names, roles, and contact info (ex: Email Addresses). These sites may also have details highlighting business operations and relationships.

