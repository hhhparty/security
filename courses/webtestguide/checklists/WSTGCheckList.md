# Testing CheckList

针对Web应用的安全评估控制项列表：

<table>
<thead>
    <tr>
    <th>Ref. No.</th>
    <th>Category</th>
    <th>Test Name</th>
    <th>Details</th>
	</tr>
</thead>
<tbody>
    <tr>
    <td><strong>4.1</strong></td>
    <td><strong>WSTG-INFO</strong></td>
    <td><strong>Information Gathering</strong></td>
    <td></td>
	</tr>
    <tr>
    <td>4.1.1</td>
    <td>WSTG-INFO-01</td>
    <td>Conduct Search Engine Discovery and Reconnaissance for Information Leakage</td>
	<td>
        <input type="checkbox"/>网络图表和配置;
        <input type="checkbox"/>管理员或关键人员的文档和邮件;
        <input type="checkbox"/>登录过程和用户名格式;
        <input type="checkbox"/>用户名、密码、私钥;
        <input type="checkbox"/>第三方、云服务配置文件;
        <input type="checkbox"/>错误消息内容; 
        <input type="checkbox"/>开发、测试、用户接受测试和阶段版本信息 
    </td>
	</tr>
    <tr>
    <td>4.1.2</td>
    <td>WSTG-INFO-02</td>
    <td>Fingerprint Web Server</td>
    <td>
        <input type="checkbox"/>应用服务器类型和版本信息;
        <input type="checkbox"/>相关公开漏洞信息。
    </td>
	</tr>
    <tr>
    <td>4.1.3</td>
    <td>WSTG-INFO-03</td>
    <td>Review Webserver Metafiles for Information Leakage</td>
    <td>
    <input type="checkbox"/>发现应用目录或文件夹路径的信息泄露问题；
    <input type="checkbox"/>生成一个需要免于爬虫发现的目录列表（敏感目录）
    </td>
	</tr>
    <tr>
    <td>4.1.4</td>
    <td>WSTG-INFO-04</td>
    <td>Enumerate Applications on Webserver</td>
    <td>
    <input type="checkbox"/>枚举相关web servers上的所有的web应用。
    </td>
	</tr>
    <tr>
    <td>4.1.5</td>
    <td>WSTG-INFO-05</td>
    <td>Review Webpage Comments and Metadata for Information Leakage</td>
    <td><input type="checkbox"/>复查网页注释和元数据，发现任何可能的信息泄露。
    </td>
	</tr>
    <tr>
    <td>4.1.6</td>
    <td>WSTG-INFO-06</td>
    <td>Identify Application Entry Points</td>
    <td>理解如何构造请求，理解服务器给出的响应。</td>
	</tr>
    <tr>
    <td>4.1.7</td>
    <td>WSTG-INFO-07</td>
    <td>Map Execution Paths Through Application</td>
    <td>    
    </td>
	</tr>
    <tr>
    <td>4.1.8</td>
    <td>WSTG-INFO-09</td>
    <td>Fingerprint Web Application Framework</td>
    <td></td>
	</tr>
    <tr>
    <td>4.1.9</td>
    <td>WSTG-INFO-09</td>
    <td>Fingerprint Web Application</td>
    <td></td>
	</tr>
    <tr>
    <td>4.1.10</td>
    <td>WSTG-INFO-10</td>
    <td>Map Application Architecture</td>
    <td></td>
	</tr>
    <tr>
    <td><strong>4.2</strong></td>
    <td><strong>WSTG-CONF</strong></td>
    <td><strong>Configuration and Deploy Management Testing</strong></td>
    <td></td>
	</tr>
    <tr>
    <td>4.2.1</td>
    <td>WSTG-CONF-01</td>
    <td>Test Network Infrastructure Configuration</td>
    <td></td>
	</tr>
    <tr>
    <td>4.2.2</td>
    <td>WSTG-CONF-02</td>
    <td>Test Application Platform Configuration</td>
    <td></td>
	</tr>
    <tr>
    <td>4.2.3</td>
    <td>WSTG-CONF-03</td>
    <td>Test File Extensions Handling for Sensitive Information</td>
    <td></td>
	</tr>
    <tr>
    <td>4.2.4</td>
    <td>WSTG-CONF-04</td>
    <td>Backup and Unreferenced Files for Sensitive Information</td>
    <td></td>
	</tr>
    <tr>
    <td>4.2.5</td>
    <td>WSTG-CONF-05</td>
    <td>Enumerate Infrastructure and Application Admin Interfaces</td>
    <td></td>
	</tr>
    <tr>
    <td>4.2.6</td>
    <td>WSTG-CONF-06</td>
    <td>Test HTTP Methods</td>
    <td></td>
	</tr>
    <tr>
    <td>4.2.7</td>
    <td>WSTG-CONF-07</td>
    <td>Test HTTP Strict Transport Security</td>
    <td></td>
	</tr>
    <tr>
    <td>4.2.8</td>
    <td>WSTG-CONF-08</td>
    <td>Test RIA Cross Domain Policy</td>
    <td></td>
	</tr>
    <tr>
    <td>4.2.9</td>
    <td>WSTG-CONF-09</td>
    <td>Test File Permission</td>
    <td></td>
	</tr>
    <tr>
    <td>4.2.10</td>
    <td>WSTG-CONF-10</td>
    <td>Test for Subdomain Takeover</td>
    <td></td>
	</tr>
    <tr>
    <td>4.2.11</td>
    <td>WSTG-CONF-11</td>
    <td>Test Cloud Storage</td>
    <td></td>
	</tr>
    <tr>
    <td><strong>4.3</strong></td>
    <td><strong>WSTG-IDNT</strong></td>
    <td><strong>Identity Management Testing</strong></td>
    <td></td>
	</tr>
    <tr>
    <td>4.3.1</td>
    <td>WSTG-IDNT-01</td>
    <td>Test Role Definitions</td>
    <td></td>
	</tr>
    <tr>
    <td>4.3.2</td>
    <td>WSTG-IDNT-02</td>
    <td>Test User Registration Process</td>
    <td></td>
	</tr>
    <tr>
    <td>4.3.3</td>
    <td>WSTG-IDNT-03</td>
    <td>Test Account Provisioning Process</td>
    <td></td>
	</tr>
    <tr>
    <td>4.3.4</td>
    <td>WSTG-IDNT-04</td>
    <td>Testing for Account Enumeration and Guessable User Account</td>
    <td></td>
	</tr>
    <tr>
    <td>4.3.5</td>
    <td>WSTG-IDNT-05</td>
    <td>Testing for Weak or Unenforced Username Policy</td>
    <td></td>
	</tr>
    <tr>
    <td><strong>4.4</strong></td>
    <td><strong>WSTG-ATHN</strong></td>
    <td><strong>Authentication Testing</strong></td>
    <td></td>
	</tr>
    <tr>
    <td>4.4.1</td>
    <td>WSTG-ATHN-01</td>
    <td>Testing for Credentials Transported over an Encrypted Channel</td>
    <td></td>
	</tr>
    <tr>
    <td>4.4.2</td>
    <td>WSTG-ATHN-02</td>
    <td>Testing for Default Credentials</td>
    <td></td>
	</tr>
    <tr>
    <td>4.4.3</td>
    <td>WSTG-ATHN-03</td>
    <td>Testing for Weak Lock Out Mechanism</td>
    <td></td>
	</tr>
    <tr>
    <td>4.4.4</td>
    <td>WSTG-ATHN-04</td>
    <td>Testing for Bypassing Authentication Schema</td>
    <td></td>
	</tr>
    <tr>
    <td>4.4.5</td>
    <td>WSTG-ATHN-05</td>
    <td>Testing for Vulnerable Remember Password</td>
    <td></td>
	</tr>
    <tr>
    <td>4.4.6</td>
    <td>WSTG-ATHN-06</td>
    <td>Testing for Browser Cache Weakness</td>
    <td></td>
	</tr>
    <tr>
    <td>4.4.7</td>
    <td>WSTG-ATHN-07</td>
    <td>Testing for Weak Password Policy</td>
    <td></td>
	</tr>
    <tr>
    <td>4.4.8</td>
    <td>WSTG-ATHN-08</td>
    <td>Testing for Weak Security Question Answer</td>
    <td></td>
	</tr>
    <tr>
    <td>4.4.9</td>
    <td>WSTG-ATHN-09</td>
    <td>Testing for Weak Password Change or Reset Functionalities</td>
    <td></td>
	</tr>
    <tr>
    <td>4.4.10</td>
    <td>WSTG-ATHN-10</td>
    <td>Testing for Weaker Authentication in Alternative Channel</td>
    <td></td>
	</tr>
    <tr>
    <td><strong>4.5</strong></td>
    <td><strong>WSTG-ATHZ</strong></td>
    <td><strong>Authorization Testing</strong></td>
    <td></td>
	</tr>
    <tr>
    <td>4.5.1</td>
    <td>WSTG-ATHZ-01</td>
    <td>Testing Directory Traversal - File Include</td>
    <td></td>
	</tr>
    <tr>
    <td>4.5.2</td>
    <td>WSTG-ATHZ-02</td>
    <td>Testing for Bypassing Authorization Schema</td>
    <td></td>
	</tr>
    <tr>
    <td>4.5.3</td>
    <td>WSTG-ATHZ-03</td>
    <td>Testing for Privilege Escalation</td>
    <td></td>
	</tr>
    <tr>
    <td>4.5.4</td>
    <td>WSTG-ATHZ-04</td>
    <td>Testing for Insecure Direct Object References</td>
    <td></td>
	</tr>
    <tr>
    <td><strong>4.6</strong></td>
    <td><strong>WSTG-SESS</strong></td>
    <td><strong>Session Management Testing</strong></td>
    <td></td>
	</tr>
    <tr>
    <td>4.6.1</td>
    <td>WSTG-SESS-01</td>
    <td>Testing for Bypassing Session Management Schema</td>
    <td></td>
	</tr>
    <tr>
    <td>4.6.2</td>
    <td>WSTG-SESS-02</td>
    <td>Testing for Cookies Attributes</td>
    <td></td>
	</tr>
    <tr>
    <td>4.6.3</td>
    <td>WSTG-SESS-03</td>
    <td>Testing for Session Fixation</td>
    <td></td>
	</tr>
    <tr>
    <td>4.6.4</td>
    <td>WSTG-SESS-04</td>
    <td>Testing for Exposed Session Variables</td>
    <td></td>
	</tr>
    <tr>
    <td>4.6.5</td>
    <td>WSTG-SESS-05</td>
    <td>Testing for Cross Site Request Forgery</td>
    <td></td>
	</tr>
    <tr>
    <td>4.6.6</td>
    <td>WSTG-SESS-06</td>
    <td>Testing for Logout Functionality</td>
    <td></td>
	</tr>
    <tr>
    <td>4.6.7</td>
    <td>WSTG-SESS-07</td>
    <td>Test Session Timeout</td>
    <td></td>
	</tr>
    <tr>
    <td>4.6.8</td>
    <td>WSTG-SESS-08</td>
    <td>Testing for Session Puzzling</td>
    <td></td>
	</tr>
    <tr>
    <td><strong>4.7</strong></td>
    <td><strong>WSTG-INPV</strong></td>
    <td><strong>Input Validation Testing</strong></td>
    <td></td>
	</tr>
    <tr>
    <td>4.7.1</td>
    <td>WSTG-INPV-01</td>
    <td>Testing for Reflected Cross Site Scripting</td>
    <td></td>
	</tr>
    <tr>
    <td>4.7.2</td>
    <td>WSTG-INPV-02</td>
    <td>Testing for Stored Cross Site Scripting</td>
    <td></td>
	</tr>
    <tr>
    <td>4.7.3</td>
    <td>WSTG-INPV-03</td>
    <td>Testing for HTTP Verb Tampering</td>
    <td></td>
	</tr>
    <tr>
    <td>4.7.4</td>
    <td>WSTG-INPV-04</td>
    <td>Testing for HTTP Parameter pollution</td>
    <td></td>
	</tr>
    <tr>
    <td>4.7.5</td>
    <td>WSTG-INPV-05</td>
    <td>Testing for SQL Injection</td>
    <td></td>
	</tr>
    <tr>
    <td>4.7.5.1</td>
    <td></td>
    <td>Oracle</td>
    <td></td>
	</tr>
    <tr>
    <td>4.7.5.2</td>
    <td></td>
    <td>MySQL</td>
    <td></td>
	</tr>
    <tr>
    <td>4.7.5.3</td>
    <td></td>
    <td>SQL Server</td>
    <td></td>
	</tr>
    <tr>
    <td>4.7.5.4</td>
    <td></td>
    <td>PostgreSQL</td>
    <td></td>
	</tr>
    <tr>
    <td>4.7.5.5</td>
    <td></td>
    <td>MS Access</td>
    <td></td>
	</tr>
    <tr>
    <td>4.7.5.6</td>
    <td></td>
    <td>NoSQL</td>
    <td></td>
	</tr>
    <tr>
    <td>4.7.5.7</td>
    <td></td>
    <td>ORM</td>
    <td></td>
	</tr>
    <tr>
    <td>4.7.5.8</td>
    <td></td>
    <td>Client Side</td>
    <td></td>
	</tr>
    <tr>
    <td>4.7.6</td>
    <td>WSTG-INPV-06</td>
    <td>Testing for LDAP Injection</td>
    <td></td>
	</tr>
    <tr>
    <td>4.7.7</td>
    <td>WSTG-INPV-07</td>
    <td>Testing for XML Injection</td>
    <td></td>
	</tr>
    <tr>
    <td>4.7.8</td>
    <td>WSTG-INPV-08</td>
    <td>Testing for SSI Injection</td>
    <td></td>
	</tr>
    <tr>
    <td>4.7.9</td>
    <td>WSTG-INPV-09</td>
    <td>Testing for XPath Injection</td>
    <td></td>
	</tr>
    <tr>
    <td>4.7.10</td>
    <td>WSTG-INPV-10</td>
    <td>IMAP/SMTP Injection</td>
    <td></td>
	</tr>
    <tr>
    <td>4.7.11</td>
    <td>WSTG-INPV-11</td>
    <td>Testing for Code Injection</td>
    <td></td>
	</tr>
    <tr>
    <td>4.7.11.1</td>
    <td></td>
    <td>Testing for Local File Inclusion</td>
    <td></td>
	</tr>
    <tr>
    <td>4.7.11.2</td>
    <td></td>
    <td>Testing for Remote File Inclusion</td>
    <td></td>
	</tr>
    <tr>
    <td>4.7.12</td>
    <td>WSTG-INPV-12</td>
    <td>Testing for Command Injection</td>
    <td></td>
	</tr>
    <tr>
    <td>4.7.13</td>
    <td>WSTG-INPV-13</td>
    <td>Testing for Buffer overflow</td>
    <td></td>
	</tr>
    <tr>
    <td>4.7.13.1</td>
    <td></td>
    <td>Testing for Heap Overflow</td>
    <td></td>
	</tr>
    <tr>
    <td>4.7.13.2</td>
    <td></td>
    <td>Testing for Stack Overflow</td>
    <td></td>
	</tr>
    <tr>
    <td>4.7.13.3</td>
    <td></td>
    <td>Testing for Format String</td>
    <td></td>
	</tr>
    <tr>
    <td>4.7.14</td>
    <td>WSTG-INPV-14</td>
    <td>Testing for Incubated Vulnerabilities</td>
    <td></td>
	</tr>
    <tr>
    <td>4.7.15</td>
    <td>WSTG-INPV-15</td>
    <td>Testing for HTTP Splitting/Smuggling</td>
    <td></td>
	</tr>
    <tr>
    <td>4.7.16</td>
    <td>WSTG-INPV-16</td>
    <td>Testing for HTTP Incoming Requests</td>
    <td></td>
	</tr>
    <tr>
    <td>4.7.17</td>
    <td>WSTG-INPV-17</td>
    <td>Testing for Host Header Injection</td>
    <td></td>
	</tr>
    <tr>
    <td>4.7.18</td>
    <td>WSTG-INPV-18</td>
    <td>Testing for Server Side Template Injection</td>
    <td></td>
	</tr>
    <tr>
    <td><strong>4.8</strong></td>
    <td><strong>WSTG-ERRH</strong></td>
    <td><strong>Error Handling</strong></td>
    <td></td>
	</tr>
    <tr>
    <td>4.8.1</td>
    <td>WSTG-ERRH-01</td>
    <td>Analysis of Error Codes</td>
    <td></td>
	</tr>
    <tr>
    <td>4.8.2</td>
    <td>WSTG-ERRH-02</td>
    <td>Analysis of Stack Traces</td>
    <td></td>
	</tr>
    <tr>
    <td><strong>4.9</strong></td>
    <td><strong>WSTG-CRYP</strong></td>
    <td><strong>Cryptography</strong></td>
    <td></td>
	</tr>
    <tr>
    <td>4.9.1</td>
    <td>WSTG-CRYP-01</td>
    <td>Testing for Weak Cryptography</td>
    <td></td>
	</tr>
    <tr>
    <td>4.9.2</td>
    <td>WSTG-CRYP-02</td>
    <td>Testing for Padding Oracle</td>
    <td></td>
	</tr>
    <tr>
    <td>4.9.3</td>
    <td>WSTG-CRYP-03</td>
    <td>Testing for Sensitive Information Sent Via Unencrypted Channels</td>
    <td></td>
	</tr>
    <tr>
    <td>4.9.4</td>
    <td>WSTG-CRYP-04</td>
    <td>Testing for Weak Encryption</td>
    <td></td>
	</tr>
    <tr>
    <td><strong>4.10</strong></td>
    <td><strong>WSTG-BUSLOGIC</strong></td>
    <td><strong>Business Logic Testing</strong></td>
    <td></td>
	</tr>
    <tr>
    <td>4.10.1</td>
    <td>WSTG-BUSL-01</td>
    <td>Test Business Logic Data Validation</td>
    <td></td>
	</tr>
    <tr>
    <td>4.10.2</td>
    <td>WSTG-BUSL-02</td>
    <td>Test Ability to Forge Requests</td>
    <td></td>
	</tr>
    <tr>
    <td>4.10.3</td>
    <td>WSTG-BUSL-03</td>
    <td>Test Integrity Checks</td>
    <td></td>
	</tr>
    <tr>
    <td>4.10.4</td>
    <td>WSTG-BUSL-04</td>
    <td>Test for Process Timing</td>
    <td></td>
	</tr>
    <tr>
    <td>4.10.5</td>
    <td>WSTG-BUSL-05</td>
    <td>Test Number of Times a Function Can be Used Limits</td>
    <td></td>
	</tr>
    <tr>
    <td>4.10.6</td>
    <td>WSTG-BUSL-06</td>
    <td>Testing for the Circumvention of Work Flows</td>
    <td></td>
	</tr>
    <tr>
    <td>4.10.7</td>
    <td>WSTG-BUSL-07</td>
    <td>Test Defenses Against Application Misuse</td>
    <td></td>
	</tr>
    <tr>
    <td>4.10.8</td>
    <td>WSTG-BUSL-08</td>
    <td>Test Upload of Unexpected File Types</td>
    <td></td>
	</tr>
    <tr>
    <td>4.10.9</td>
    <td>WSTG-BUSL-09</td>
    <td>Test Upload of Malicious Files</td>
    <td></td>
	</tr>
    <tr>
    <td><strong>4.11</strong></td>
    <td><strong>WSTG-CLIENT</strong></td>
    <td><strong>Client Side Testing</strong></td>
    <td></td>
	</tr>
    <tr>
    <td>4.11.1</td>
    <td>WSTG-CLNT-01</td>
    <td>Testing for DOM based Cross Site Scripting</td>
    <td></td>
	</tr>
    <tr>
    <td>4.11.2</td>
    <td>WSTG-CLNT-02</td>
    <td>Testing for JavaScript Execution</td>
    <td></td>
	</tr>
    <tr>
    <td>4.11.3</td>
    <td>WSTG-CLNT-03</td>
    <td>Testing for HTML Injection</td>
    <td></td>
	</tr>
    <tr>
    <td>4.11.4</td>
    <td>WSTG-CLNT-04</td>
    <td>Testing for Client Side URL Redirect</td>
    <td></td>
	</tr>
    <tr>
    <td>4.11.5</td>
    <td>WSTG-CLNT-05</td>
    <td>Testing for CSS Injection</td>
    <td></td>
	</tr>
    <tr>
    <td>4.11.6</td>
    <td>WSTG-CLNT-06</td>
    <td>Testing for Client Side Resource Manipulation</td>
    <td></td>
	</tr>
    <tr>
    <td>4.11.7</td>
    <td>WSTG-CLNT-07</td>
    <td>Test Cross Origin Resource Sharing</td>
    <td></td>
	</tr>
    <tr>
    <td>4.11.8</td>
    <td>WSTG-CLNT-08</td>
    <td>Testing for Cross Site Flashing</td>
    <td></td>
	</tr>
    <tr>
    <td>4.11.9</td>
    <td>WSTG-CLNT-09</td>
    <td>Testing for Clickjacking</td>
    <td></td>
	</tr>
    <tr>
    <td>4.11.10</td>
    <td>WSTG-CLNT-10</td>
    <td>Testing WebSockets</td>
    <td></td>
	</tr>
    <tr>
    <td>4.11.11</td>
    <td>WSTG-CLNT-11</td>
    <td>Test Web Messaging</td>
    <td></td>
	</tr>
    <tr>
    <td>4.11.12</td>
    <td>WSTG-CLNT-12</td>
    <td>Test Local Storage</td>
    <td></td>
	</tr>
    <tr>
    <td>4.11.13</td>
    <td>WSTG-CLNT-13</td>
    <td>Testing for Cross Site Script Inclusion</td>
    <td></td>
	</tr>
</tbody>
</table>
