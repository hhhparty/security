# NODE.JS SECURITY CHECKLIST

参考：
- https://medium.com/@nodepractices/were-under-attack-23-node-js-security-best-practices-e33c146cb87d

未读：
- https://github.com/goldbergyoni/nodebestpractices/tree/security-best-practices-section#-65-collection-of-common-generic-security-best-practices-15-items
- https://github.com/nodesecurity/eslint-plugin-security
- https://blog.risingstack.com/node-js-security-checklist/
- https://expressjs.com/en/advanced/best-practice-security.html
- https://cheatsheetseries.owasp.org/cheatsheets/Nodejs_security_cheat_sheet.html

## 代码安全
- 拥抱 linter（检查代码风格/错误的小工具，作用是提高代码质量） 安全规则 Embrace linter security rules。具体的可参考https://github.com/nodesecurity/eslint-plugin-security
- 当进程崩溃时使用显示设置来避免DoS攻击。Avoid DOS attacks by explicitly setting when a process should crash
- 验证输入的JSON模式。 Validate incoming JSON schemas。
- 避免使用Javascript中的eval语句。Avoid JavaScript eval statements
- 删除或者转义 HTML, JS 和 CSS输出。 Escape HTML, JS and CSS output
## 架构/组件安全
- 使用中间件限制并发请求数量 Limit concurrent requests using a middleware
- 使用ORM/ODM库，防止查询注入漏洞 Prevent query injection vulnerabilities with ORM/ODM libraries
- 使用反向代理或中间件限制载荷大小。 Limit payload size using a reverse-proxy or a middleware

## 配置安全
- 从配置文件中去掉机密信息，或者使用一些可靠的包加密这些机密信息。 Extract secrets from config files or use packages to encrypt them.

- 调整 HTTP 响应头，加强安全性。Adjust the HTTP response headers for enhanced security



- 以非root用户运行 Node.js。Run Node.js as non-root user

- 防止邪恶的 RegEx 重载您的单个线程执行。 Prevent evil RegEx from overloading your single thread execution

- 避免使用变量加载模块。 Avoid module loading using a variable

- 在沙盒中运行不安全的代码 Run unsafe code in a sandbox

- 当有子进程工作时要特别注意。 Take extra care when working with child processes

- 隐藏来自客户端的错误细节 Hide error details from clients

- 修改会话中间件的设置。Modify session middleware settings

- 防止npm注册秘密被公开

## 运维安全

- 经常性的、自动化的检查脆弱性依赖。Constantly and automatically inspect for vulnerable dependencies

## 访问控制

- 支持带黑名单的 JWT 令牌。Support blacklisting JWT tokens
- 避免使用 node.js 加密库来托管密码，使用Bcrypt。 Avoid using the Node.js crypto library for handling passwords, use Bcrypt
- 限制每个用户的输入请求。Limit the allowed login requests of each user
- 为npm或yarn配置双因子验证 Configure 2FA for npm or Yarn
- 防止对授权机制的暴力攻击。