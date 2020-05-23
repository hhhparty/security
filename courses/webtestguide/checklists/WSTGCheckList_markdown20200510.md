# OWASP Web Security Testing CheckList

参考：https://github.com/owasp/wstg

针对Web应用的安全评估控制项列表：

## 1 Information Gathering

### 1.1 WSTG-INFO-01 Conduct Search Engine Discovery and Reconnaissance for Information Leakage

- 网络图表和配置;
- 管理员或关键人员的文档和邮件;
- 登录过程和用户名格式;
- 用户名、密码、私钥;
- 第三方、云服务配置文件;
- 错误消息内容; 
- 开发、测试、用户接受测试和阶段版本信息 


### 1.2 WSTG-INFO-02 Fingerprint Web Server

- 应用服务器类型和版本信息
- 相关公开漏洞信息

### 1.3 WSTG-INFO-03 Review Webserver Metafiles for Information Leakage
- 发现应用目录或文件夹路径的信息泄露问题；
- 生成一个需要免于爬虫发现的目录列表（敏感目录）

### 1.4 WSTG-INFO-04 Enumerate Applications on Webserver 
- 枚举相关web servers上的所有的web应用。

### 1.5 WSTG-INFO-05 Review Webpage Comments and Metadata for Information Leakage

- 复查网页注释和元数据，发现任何可能的信息泄露。

### 1.6 WSTG-INFO-06 Identify Application Entry Points

- 理解如何构造请求，理解服务器给出的响应。

### 1.7 WSTG-INFO-07	Map Execution Paths Through Application	
### 1.8 WSTG-INFO-09	Fingerprint Web Application Framework	
### 1.9 WSTG-INFO-09	Fingerprint Web Application	
### 1.10 WSTG-INFO-10	Map Application Architecture	
## 2 WSTG-CONF	Configuration and Deploy Management Testing	
### 2.1 WSTG-CONF-01	Test Network Infrastructure Configuration	
### 2.2 WSTG-CONF-02	Test Application Platform Configuration	
### 2.3 WSTG-CONF-03	Test File Extensions Handling for Sensitive Information	
### 2.4 WSTG-CONF-04	Backup and Unreferenced Files for Sensitive Information	
### 2.5 WSTG-CONF-05	Enumerate Infrastructure and Application Admin Interfaces	
### 2.6 WSTG-CONF-06	Test HTTP Methods	
### 2.7 WSTG-CONF-07	Test HTTP Strict Transport Security	
### 2.8 WSTG-CONF-08	Test RIA Cross Domain Policy	
### 2.9 WSTG-CONF-09	Test File Permission	
### 2.10 WSTG-CONF-10	Test for Subdomain Takeover	
### 2.11 WSTG-CONF-11	Test Cloud Storage	
## 3 WSTG-IDNT	Identity Management Testing	
### 3.1 WSTG-IDNT-01	Test Role Definitions	
### 3.2 WSTG-IDNT-02	Test User Registration Process	
### 3.3 WSTG-IDNT-03	Test Account Provisioning Process	
### 3.4 WSTG-IDNT-04	Testing for Account Enumeration and Guessable User Account	
### 3.5 WSTG-IDNT-05	Testing for Weak or Unenforced Username Policy	
## 4 WSTG-ATHN	Authentication Testing	
### 4.1 WSTG-ATHN-01	Testing for Credentials Transported over an Encrypted Channel	
### 4.2 WSTG-ATHN-02	Testing for Default Credentials	
### 4.3 WSTG-ATHN-03	Testing for Weak Lock Out Mechanism	
### 4.4 WSTG-ATHN-04	Testing for Bypassing Authentication Schema	
### 4.5 WSTG-ATHN-05	Testing for Vulnerable Remember Password	
### 4.6 WSTG-ATHN-06	Testing for Browser Cache Weakness	
### 4.7 WSTG-ATHN-07	Testing for Weak Password Policy	
### 4.8 WSTG-ATHN-08	Testing for Weak Security Question Answer	
### 4.9 WSTG-ATHN-09	Testing for Weak Password Change or Reset Functionalities	
### 4.10 WSTG-ATHN-10	Testing for Weaker Authentication in Alternative Channel	
## 5 WSTG-ATHZ	Authorization Testing	
### 5.1 WSTG-ATHZ-01	Testing Directory Traversal - File Include	
### 5.2 WSTG-ATHZ-02	Testing for Bypassing Authorization Schema	
### 5.3 WSTG-ATHZ-03	Testing for Privilege Escalation	
### 5.4 WSTG-ATHZ-04	Testing for Insecure Direct Object References	
## 6 WSTG-SESS	Session Management Testing	
### 6.1 WSTG-SESS-01	Testing for Bypassing Session Management Schema	
### 6.2 WSTG-SESS-02	Testing for Cookies Attributes	
### 6.3 WSTG-SESS-03	Testing for Session Fixation	
### 6.4 WSTG-SESS-04	Testing for Exposed Session Variables	
### 6.5 WSTG-SESS-05	Testing for Cross Site Request Forgery	
### 6.6 WSTG-SESS-06	Testing for Logout Functionality	
### 6.7 WSTG-SESS-07	Test Session Timeout	
### 6.8 WSTG-SESS-08	Testing for Session Puzzling	
## 7 WSTG-INPV	Input Validation Testing	
### 7.1 WSTG-INPV-01	Testing for Reflected Cross Site Scripting	
### 7.2 WSTG-INPV-02	Testing for Stored Cross Site Scripting	
### 7.3 WSTG-INPV-03	Testing for HTTP Verb Tampering	
### 7.4 WSTG-INPV-04	Testing for HTTP Parameter pollution	
### 7.5 WSTG-INPV-05	Testing for SQL Injection	
#### 7.5.1 Oracle	
#### 7.5.2 MySQL	
#### 7.5.3 SQL Server	
#### 7.5.4 PostgreSQL	
#### 7.5.5 MS Access	
#### 7.5.6 NoSQL	
#### 7.5.7 ORM	
#### 7.5.8 Client Side	
### 7.6 WSTG-INPV-06	Testing for LDAP Injection	
### 7.7 WSTG-INPV-07	Testing for XML Injection	
### 7.8 WSTG-INPV-08	Testing for SSI Injection	
### 7.9 WSTG-INPV-09	Testing for XPath Injection	
### 7.10 WSTG-INPV-10	IMAP/SMTP Injection	
### 7.11 WSTG-INPV-11	Testing for Code Injection	
#### 7.11.1 Testing for Local File Inclusion	
#### 7.11.2 Tsting for Remote File Inclusion	
### 7.12 WSTG-INPV-12	Testing for Command Injection	
### 7.13 WSTG-INPV-13	Testing for Buffer overflow	
#### 7.13.1 Testing for Heap Overflow	
#### 7.13.2 Testing for Stack Overflow	
#### 7.13.3 Testing for Format String	
### 7.14 WSTG-INPV-14	Testing for Incubated Vulnerabilities	
### 7.15 WSTG-INPV-15	Testing for HTTP Splitting/Smuggling	
### 7.16 WSTG-INPV-16	Testing for HTTP Incoming Requests	
### 7.17 WSTG-INPV-17	Testing for Host Header Injection	
### 7.18 WSTG-INPV-18	Testing for Server Side Template Injection	
## 8 WSTG-ERRH	Error Handling	
### 8.1 WSTG-ERRH-01	Analysis of Error Codes	
### 8.2 WSTG-ERRH-02	Analysis of Stack Traces	
## 9 WSTG-CRYP	Cryptography	
### 9.1 WSTG-CRYP-01	Testing for Weak Cryptography	
### 9.2 WSTG-CRYP-02	Testing for Padding Oracle	
### 9.3 WSTG-CRYP-03	Testing for Sensitive Information Sent Via Unencrypted Channels	
### 9.4 WSTG-CRYP-04	Testing for Weak Encryption	
## 10 WSTG-BUSLOGIC	Business Logic Testing	
### 10.1 WSTG-BUSL-01	Test Business Logic Data Validation	
### 10.2 WSTG-BUSL-02	Test Ability to Forge Requests	
### 10.3 WSTG-BUSL-03	Test Integrity Checks	
### 10.4 WSTG-BUSL-04	Test for Process Timing	
### 10.5 WSTG-BUSL-05	Test Number of Times a Function Can be Used Limits	
### 10.6 WSTG-BUSL-06	Testing for the Circumvention of Work Flows	
### 10.7 WSTG-BUSL-07	Test Defenses Against Application Misuse	
### 10.8 WSTG-BUSL-08	Test Upload of Unexpected File Types	
### 10.9 WSTG-BUSL-09	Test Upload of Malicious Files	
## 11 WSTG-CLIENT	Client Side Testing	
### 11.1 WSTG-CLNT-01	Testing for DOM based Cross Site Scripting	
### 11.2 WSTG-CLNT-02	Testing for JavaScript Execution	
### 11.3 WSTG-CLNT-03	Testing for HTML Injection	
### 11.4 WSTG-CLNT-04	Testing for Client Side URL Redirect	
### 11.5 WSTG-CLNT-05	Testing for CSS Injection	
### 11.6 WSTG-CLNT-06	Testing for Client Side Resource Manipulation	
### 11.7 WSTG-CLNT-07	Test Cross Origin Resource Sharing	
### 11.8 WSTG-CLNT-08	Testing for Cross Site Flashing	
### 11.9 WSTG-CLNT-09	Testing for Clickjacking	
### 11.10 WSTG-CLNT-10	Testing WebSockets	
### 11.11 WSTG-CLNT-11	Test Web Messaging	
### 11.12 WSTG-CLNT-12	Test Local Storage	
### 11.13 WSTG-CLNT-13	Testing for Cross Site Script Inclusion