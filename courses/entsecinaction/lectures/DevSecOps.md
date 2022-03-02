# DevSecOps

Gartner 2012年创建了这个概念。核心理念是：安全是整个IT团队（设计、开发、测试、运维、安全等团队）所有成员的责任，需要贯穿整个业务生命周期的每一个环节。“每个人都对安全负责”，安全工作前置，糅合嵌入开发流程体系。

在DevSecOps方法指导下的新一代应用开发流程中，应用的安全检测不再仅仅依靠传统的黑盒测试和白盒测试,安全测试方法将出现多样化，交互式的灰盒测试(iast)将会逐步流行，而且将会成为提高漏洞检出率和降低漏洞误报率的重要环节。

安全能力渗透范围将会扩大，在传统的sdl中，安全能力仅仅集中在编码阶段的白盒检测和测试阶段的黑盒检测，虽然绝大多数的安全问题都在这两个环节发现，但是从软件安全修复成本来看，这并不是很好的方案。如果能够在安全需求分析阶段就能够将尽可能的考虑到所有的安全风险问题，并给出相应的威胁模型和解决方案，那么后续软件修复的成本将会大大的降低。

<img src="images/devsecops/devsecops思想.png">

在 DevOps 中，每个人都必须专注于用户，以持续集成和持续交付（CI/CD）的方式快速满足用户的需求。但是传统上，安全团队专注于以安全为中心的目标，以使组织符合信息安全法规，并降低应用被网络攻击的风
险。如果安全性阻碍了 CI/CD 交付的速度，那么它将影响以业务为中心的软件生产模型的成功。这就是安全性需要成为 DevOps 团队不可或缺一环的原因。无论是安全中融合 DevOps 的概念，还是在 DevOps 中包含安全，目标都是以 DevOps 的速度交付安全的软件产品。DevSecOps 的实践方式没有统一的硬性规定。但是，建立流程模型将主导下一步选择工具和技术以实施流程的步骤。随着安全成为 DevOps 周期的组成部分，有一种说法将其称为连续安全保障管道。这一持续的安全管道，帮助我们构建了一个流程模型以指导组织实施DevSecOps。

SDL 将逐步走向自动化(DevSecOps)，安全检测工具将不再零散分布，而是在一个平台中集中管理和编排，安全检测更趋向于自动化。

## 基本思路

- 需求分析阶段，进行威胁建模和制定解决方案
- 编码阶段，进行安全检测额代码安全检测
- 测试阶段，进行白、灰、黑等多种测试
- 应用上线阶段，持续监测风险

<img src="images/devsecops/软件开发安全流程.png">

DevSecOps 为 DevOps 生态系统提供以下关键服务 :
<img src="images/devsecops/DevOps生态系统关键服务.png">

### 安全设计

安全设计可确保 DevOps 团队开发的产品和服务符合安全最佳实践、法规、标准和法律，并实现数据隐私和保护。这部分工作重点在详细分析安全需求并进行适当设计。此外，威胁建模也是一项重要工作，其目的在于在编码阶段实施控制。例如，实施控制以防止 Web 应用程序出现 SANS 25 和 OWASP Top 10 漏洞。

高级威胁建模对于关键业务系统预测可能面临的威胁来源，并提前考虑预防和应对措施至关重要。安全编码是开发实践中重要的一环，通过遵循已建立的威胁模型来降低与安全相关的脆弱性、漏洞数量和集成错误。安全编码涉及输入验证、会话管理、用户凭证验证、用户访问控制、数据保护和隐私、日志记录、API 安全性、检测安全性错误配置等方面。

### 安全测试

安全测试是 DevSecOps 实践的关键部分，软件程序经过各种方法的测试以保证质量。安全测试不仅应涉及软件程序，还应关注端到端管道、实时生产系统、软件基础设施、数据库以及中间件，以降低任一环节的安全攻击风险。在安全测试方面，它与传统的手动测试方法有所不同，尽可能采用自动化是其核心要求。

安全团队必须与开发和测试人员合作，测试软件程序的漏洞，例如 SANS 25 和 OWASP Top 10，以确保软件应用遵循了安全要求和质量要求。通常情况下，需要依赖 CI/CD 管道自动执行这些测试过程，并且必须在代码部署至实际生产环境之前通过所有必要的测试用例（涉及功能性和安全性）。

静态应用安全测试（SAST）是分析软件模块的源代码以检测常见的安全缺陷和配置错误所遵循的常见方法。开发人员和安全团队必须合作，将源代码分析集成到集成开发环境（IDE）设置中，在该集成开发环境中进行编码以开发软件模块。

同样，动态应用安全测试（DAST）和交互式应用安全测试（IAST）主要致力于在发布给生产环境之前，从使用方的角度检测软件应用程序。开发人员，测试人员和安全团队必须共同协作，以自动方式在 DevOps 管道中实施这些强制性测试工作。

至于剩余的两个方面：安全监控和风险管理，并不特定用于 DevSecOps，而是软件开发中通常遵循的安全原则，这些原则可以帮助 DevSecOps 提升完整性。

### 安全监控

安全监控的重点是对软件基础设施和应用程序中产生的日志进行实时和脱机分析，以了解已发生的攻击事件从而发现漏洞，并向安全团队发出警报，以响应安全事件或漏洞。当需要调查关键安全事件时，可对取证工作提供支持。

### 安全风险管理

风险管理通过采取安全控制措施来分析和缓解安全风险。在 DevSecOps 中，风险管理必须协同其他工作，以 DevOps 的速度提供支撑，而避免阻碍流程。对 DevSecOps 来说，轻量级方法或快速风险评估（RRA）通常比传统方法更可取。将组织风险管理流程调整为 DevOps，并尽可能在将应用软件发布到生产环境之前解决所有适用的威胁。可采用一些广泛使用的威胁建模方法，例如 STRIDE（伪装，篡改，抵赖，信息泄露，拒绝服务，提升权限）和 DREAD（潜在损失，可复现性，可利用性，受影响的用户，可发现性），量化将易受攻击的软件发布到实际生产环境中给组织带来的风险。


## DevSecOps 成熟度模型

DevSecOps 国内相关的标准已在制定的过程中，尚未正式发布施行。美国总务管理局（U.S. General Services Administration，GSA）在早先发布了框架性文件《DevSecOps 指南》，其中描述了DevSecOps 平台的成熟度模型。

该成熟度模型从 DevSecOps 平台总体考虑事项、镜像管理、日志监控和告警、补丁管理、平台治理、变更管理、应用开发测试和运营、应用部署、帐户权限凭据和机密管理、可用性和性能管理、网络管理、操作流程权限、备份和数据生命周期管理、协议和财务管理等维度全面地定义了 DevSecOps 实践中所涉及工作的成熟度评价标准。

以下是 GSA 对 DevSecOps 的描述“成功的 DevSecOps 团队工作具有可重复性、低冗余、高协作性和分散集体努力的特点；为了最有效地实现这一点，自动化和可审计性优先于人工主观决策。”

针对该模型中最有代表性的 DevSecOps 平台总体考虑事项方面，其成熟度描述如下：

总体的 DevSecOps 平台考虑事项：
- 描述
  - 本部分围绕 DevSecOps 平台本身的整体性质，捕获进入环境的工作流和从环境发布的软件。
- 成熟度模型
  - 级别 1（不被视作 DevSecOps 平台）: 该平台的特点是依赖人工，状态不透明，团队协作不标准化，并且在每个项目的基础上进行异构配置。
  - 级别 2: 应用程序开发人员有一个管道，他们可以使用该管道来部署已考虑安全性并且对运营可见的软件。进入该平台的方式可能是手动或不可预测的。部署和运维操作的步骤可能需要人工操作或评估。
  - 级别 3: 应用程序开发人员在平台上有一个清晰的、自助的入口，并且能够通过自动化在生产环境部署和运行符合安全性的代码。平台服务集中在其基础设施和管道实现中。

##  DevSecOps 安全工具

DevSecOps 安全工具金字塔
<img src="images/devsecops/DevSecOps 安全工具金字塔.png">

DevSecOps 中的应用安全管理和保障能力依赖不同的安全工具能力互相作用、叠加、协作而实现，DevSecOps 安全工具金字塔描述了安全工具所属的不同层次。安全工具之间的边界有时会模糊不清，因为单一的安全工具可以实现多种类别的安全能力。

DevSecOps 安全工具金字塔描述了一组层次结构，金字塔底部的工具是基础工具，随着组织 DevSecOps 实践成熟度的提高，组织可能会希望使用金字塔中较高的一些更先进的方法。

金字塔中的安全工具分层与组织的 DevSecOps 成熟度分级没有直接关系，仅使用低层次的安全工具也可以完成高等级的 DevSecOps 实践成熟度，反之亦然。金字塔中的工具分层与该工具的普适性、侵入性、易用性等因素相关。普适性强、侵入性低、易用性高的安全工具更适合作为底层基础优先引入，普适性弱、侵入性高、易用性低的工具则适合作为进阶工具帮助 DevSecOps 实践变得更加完善且深入。

### CARTA（Continuous Adaptive Risk and Trust Assessment，持续自适应风险与信任评估）

CARTA 由 Gartner 在 2018 年十大安全技术趋势中首次提出，在 2019 年再次被列入十大安全项目，也是Gartner 主推的一种应对当前及未来安全趋势先进战略方法。CARTA 强调对风险和信任的评估分析，这个分析的过程就是一个权衡的过程，告别传统安全门式允许 / 阻断的处置方式，旨在通过动态智能分析来评估用户行为，放弃追求完美的安全，不能要求零风险，不要求 100% 信任，寻求一种 0 和 1 之间的风险与信任的平衡。CARTA 战略是一个庞大的体系，其包括大数据、AI、机器学习、自动化、行为分析、威胁检测、安全防护、安全评估等方面，集主流技术与一体打造出一个自适应自判断安全防护平台。

CARTA 跟 DevSecOps 的趋势一致，将安全左移至开发阶段，并最终集成在整个生命周期中，完成敏捷化的自适应风险和信任评估。因此 CARTA 已逐渐从单纯的生产环境实践方法，融合进 DevSecOps 的体系之中。

### 应用安全性测试即服务（ASTaaS）

随着应用开发环境的开放化以及云服务日趋成熟，更轻量级的 ASTaaS 逐渐开始被接受。在 ASTaaS 上，使用者通常仅需按需付费来对应用程序执行安全测试，而不必再分别购买昂贵的私有化安全设备。该服务通常是静态和动态分析，渗透测试，应用程序编程接口（API）测试，风险评估等安全功能的组合。ASTaaS 通常用于移动和 Web 应用程序。

ASTaaS 的发展动力主要来自云应用程序的使用，在云应用程序中，用于测试的资源更易于配置。有数据表明，全球在公共云计算上的支出预计将从 2015 年的 670 亿美元增加到 2020 年的 1620 亿美元。

### 应用安全测试编排（ASTO）
应用安全测试编排（Application Security Testing Orchestration，ASTO）由 Gartner 首次提出，目前该技术和工具还处于较为初始的阶段。其目标是对生态系统中运行的所有不同的应用安全测试工具进行集中、协调的管理和报告。ASTO 综合管理 SAST/SCA/IAST/DAST 等各种安全工具的检测能力，完善与开发工具链条的集成与自动化能力，提供安全能力编排方案。用户自定义编排安全检测的手段、工具与其它安全产品的自动化集成响应。


### 模糊测试
模糊测试（fuzz testing）是一种介于完全的手工渗透测试与完全的自动化测试之间的安全性测试类型。能够在一项产品投入市场使用之前对潜在的应当被阻断的攻击路径进行提示。从执行过程来说，模糊测试的执行过程很简单，大致如下：
- 准备好随机或者半随机方式生成的数据；
- 将准备好的数据导入被测试的系统；
- 用程序打开文件检测被测试系统的状态；
- 根据被测系统的状态判断是否存在潜在的漏洞

### 容器安全

容器安全是保护云原生环境免受漏洞和主动攻击威胁所需的安全工具。容器安全工具可完全集成到构建和部署管道中，提供针对容器镜像的漏洞管理功能，实现并强制实施合规性。容器安全工具能保护容器的完整性，这包括从其承载的应用到其所依赖的基础架构等全部内容。通常而言，组织拥有持续的容器安全包含以下方面：
- 保护容器管道和应用
- 保护容器部署环境和基础架构
- 整合企业安全工具，遵循或增强现有的安全策略

### 运行时应用自保护（RASP）

运行时应用自保护 (RASP) 是一种嵌入到应用程序或应用程序运行时环境的安全技术，在应用层检查请求，实时检测并阻断攻击。

RASP 产品通常包含以下功能 :
- 通常在应用程序上下文中进行解包和检查应用程序请求。
- 产品可以在多个执行点分析完整的请求，执行监控和阻止，有时甚至更改请求以去除恶意内容。
- 完整的功能可通过 RESTful API 访问。
- 防止所有类型的应用程序攻击，并确定攻击是否会成功。
- 查明漏洞所在的模块，还有特定的代码行。
- 仪表盘功能和使用情况报告。

### 软件组成分析（SCA）

SCA 工具检查软件，以确定软件中所有组件和库的来源。SCA 工具在识别和发现常见和流行组件（尤其是开源组件）中的漏洞方面非常有效。但是，它们通常不会检测内部自定义开发组件的漏洞。

SCA 工具在查找通用和流行的库和组件（尤其是开放源代码部分）方面最为有效。它们的工作原理是将代码中的已知模块与已知漏洞库进行比较。SCA 工具查找具有已知漏洞并已记录漏洞的组件，并且通常会提示使用者组件是否过时或有可用的补丁修补程序。

为了进行比较，几乎所有 SCA 工具都使用 NVVD 或 CVE 作为已知漏洞的来源。许多商业 SCA 产品还使用VulnDB 等商业漏洞数据库作为来源。SCA 工具可以在源代码，字节码，二进制编码或某种组合上运行。在知识产权保护的影响下，基于不同软件授权许可证书的风险检测，正成为新的技术关注点。SCA 可以对不同软件组件的授权许可进行分析，避免潜在的法律风险。

### 交互式应用安全测试（IAST）

IAST 曾被 Gartner 多次列为十大安全技术。IAST 工具结合了 SAST 和 DAST 技术的优点。IAST 可以模拟验证代码中的已知漏洞是否可以真的在运行的环境中被利用。

IAST 工具利用对应用程序流和数据流的了解来创建高级攻击方案，并递归地使用动态分析结果：在执行动态扫描时，该工具将基于应用程序对测试用例的响应方式来了解有关应用程序的知识。一些工具将使用这些知识来创建其他测试用例，然后可以为更多的测试用例产生更多的知识，依此类推。IAST 工具擅于减少误报数，并且可以很完美地使用在敏捷和 DevOps 环境。在这些环境中，传统的独立 DAST 和 SAST 工具在开发周期中可能会占用大量时间，而 IAST 几乎不会对原有应用生产效率产生任何影响。


### PTE 自动化渗透测试

自动化渗透测试是近年来逐渐被关注的一项新技术，其目的是用自动化测试的方式实现以往只有依靠白帽子人工完成的渗透测试工作，以提高漏洞检测效率，降低检测成本。这一类工具是随着机器学习等 AI 技术的发展而产生并成熟的。自动化渗透测试工具可以将白帽子在大量渗透过程中积累的实战经验转化为机器可存储、识别、处理的结构化经验，并且在测试过程中借助 AI 算法自我迭代，自动化地完成逻辑推理决策，以贴近实际人工渗透的方式，对给定目标进行从信息收集到漏洞利用的完整测试过程。

### EDR

端点检测与响应 (Endpoint Detection & Response，EDR) 是一种主动的安全方法，可以实时监控端点，并搜索渗透到公司防御系统中的威胁。 这是一种新兴的技术，可以更好地了解端点上发生的事情，提供关于攻击的上下文和详细信息。 EDR 服务可以让你知道攻击者是否及何时进入你的网络，并在攻击发生时检测攻击路径ーー帮助你在记录的时间内对事件作出反应。

### 静态应用安全测试（SAST）

SAST 又称白盒测试，测试人员可以在其中了解有关被测代码的信息，包括体系结构图、常规漏洞、不安全编码等内容。SAST 工具可以发现源代码中可能导致安全漏洞的脆弱点，还可以通过 IDE 插件形式与集成开发环境结合，实时检测代码漏洞问题，漏洞发现更及时，使得修复成本更低。

源代码分析器可以在未编译的代码上运行，以检查缺陷，覆盖赋值越界、、输入验证、竞争条件、路径遍历、指针和引用等。部分 SAST 工具也可以用二进制和字节码分析器对已构建和已编译的代码执行相同的操作，但这实际上已进入 SCA 和 DAST 的范畴。

### 移动应用安全测试（MAST）

MAST 工具融合了静态，动态和取证分析。它们执行的功能与传统的静态和动态分析器类似。MAST 工具具有专门针对移动应用程序问题的独特功能，例如越狱检测、伪造 WI-FI 链接测试、证书的处理和验证、防止数据泄漏等。

### 动态应用安全测试（DAST）

DAST 工具又称黑盒测试，与 SAST 工具相对应。测试人员无需具备编程能力，无需了解应用程序的内部逻辑结构，也无须了解代码细节。DAST 不区分测试对象的实现语言，采用攻击特征库来做漏洞发现与验证。

DAST 工具针对编译后的可执行程序运行，以检测界面、请求、响应、脚本（即 JavaScript）、数据注入、会话、身份验证等问题。除了可以扫描应用程序本身之外，还可以扫描发现第三方开源组件、第三方框架的漏洞。

### WAF

WAF 即 Web 应用防火墙（Web Application Firewall），是通过执行一系列针对 HTTP 和 HTTPS 的安全策略，来专门对 Web 应用，提供保护的一类产品。WAF 初期是基于规则防护的防护设备；基于规则的防护，可以提供各种 Web 应用的安全规则，WAF 生产商去维护这个规则库，并实时为其更新，用户按照这些规则，可以对应用进行全方面的保护。

在这几年 WAF 领域出现了很多新的技术，譬如通过数据建模学习企业自身业务，从而阻拦与其业务特征不匹配的请求；或者使用智能语音分析引擎，从语音本质去了解。除可阻断针对利用已知漏洞的攻击外，还可防止部分通过未知漏洞的攻击。

### IDS/IPS

入 侵 检 测 系 统（instruction detection system，IDS）、 入 侵 防 御 系 统（ instruction prevention system，IPS）是两类传统的安全保障产品，主要用于应对网络安全系统中的黑客攻击事件。

IDS 是依照一定的安全策略，对网络、系统的运行状况进行监视，尽可能发现各种攻击企图、攻击行为或者攻击结果，以保证网络系统资源的机密性、完整性和可用性。

IPS 能够监视网络或网络设备的网络资料传输行为，能够即时的中断、调整或隔离一些不正常或是具有伤害性的网络行为。

由于这两种产品的技术和形态有高度的一致性，因此这里放到同一个分类中阐述。IPS 和 IDS 工具已经非常成熟，甚至可以称为古老。但由于其拥有实时检测和响应的特点，在生产系统中有着高度的实用性，因此现如今依旧是在线应用的网络保护中十分必要的一环。

---

## 案例

> 内容来自：https://www.freebuf.com/articles/es/259762.html

### 理想汽车白盒检测
<img src="images/devsecops/理想汽车devsecops案例-分布式白盒系统拓扑图.jpg">

上图所示的理想汽车内部在用的自研白盒系统(apollo)拓扑图，目前第三方方面支持三种方式接入分布式白盒系统。第一种方式是直接登陆web平台进行任务提交操作，第二种是通过jenkins piplines方式，将白盒引擎能力集成到pipline流水线中，第三种是直接通过客户端程序提交任务到master节点。

#### apollo工作流程介绍
apollo白盒引擎采用redis-sentinel作为消息队列，worker集群中的节点通过抢占方法获取任务信息(似乎应该优化下)，节点获得任务信息后将会通过远程共享磁盘获取到待检测源码包，启动对应分析引擎进行自动化白盒审计分析，审计任务完成后，结果数据将会被存储到mysql主服务器中，通过数据同步，将数据同步到从服务器中，master节点通过读操作从从服务器上读取相关到任务数据信息(包括漏洞信息，任务信息等)，渲染到web前端展示。

分布式白盒系统架构图

<img src="images/devsecops/理想汽车devsecops案例-分布式白盒系统架构图.jpg">

以上是分布式白盒检测系统的整体架构。web前端技术部分主要包括vue，elementUI及echart.

#### 功能模块
Apollo分布式白盒检测系统实现了一些必要的一些后端交互，如用户管理交互，作业管理交互，漏洞审计交互，项目创建交互，以及对引擎检出的数据进行了相对友好的可视化展示。
##### 首页-可视化模块

首页针对以往检测的项目信息进行可视化分析展示，基本信息展示方面，除了总项目数，总代码行数，总风险数等信息外，我们还展示了总的万行代码漏洞率，用于评估现阶段企业内部的代码安全性。为了使得展示效果比较友好，以及避免泄漏企业内部的一些敏感信息，上图可视化展示的数据均为测试数据。下面简要的介绍下图表内容的含义。第一个图表展示了本年度，从一月份到十二月份每个月的漏洞检出情况，以及漏洞修复情况(红色为漏洞数趋势图，绿色为漏洞修复数趋势图)相关的研发负责人可据此来评估各个项目组的月度及年度的代码安全性，代码安全性数据可作为评估研发工程师研发能力的一部分，加入到绩效考核之中。

##### 项目管理模块
项目管理模块主要实现了项目创建，项目列表展示，项目详情展示三个部分的内容。

首先介绍下项目管理模块的作用，项目管理模块的主要作用就是为了方便对devsecops流程的管控，详细点说就是将需求分析，威胁模型构建，防护规避方案，项目安全检测的进展，漏洞详情信息以项目为单位进行呈现，方便相关的研发负责人对于当前的项目组的代码安全性有一个比较全面的了解。

针对项目创建方面，我们提供了两种方式，一种是手动添加方式，另一种是项目管理平台(如jira)自动拉取项目信息的方式。手动创建方式可能对于自动化方面会收到一些影响，但是考虑到并非所有公司、所有的项目组都喜欢用项目管理平台，所以，要全面落地devsecops，提供手动创建项目还是很有必要的。

关于威胁建模方面，如果是手动创建项目的话，我们会要求创建者给出当前项目的当前版本的功能模块信息，然后后端知识库将会根据这些给定的功能模块信息，会自动化的构建当前项目版本的威胁模型信息，并提供相应的风险规避方案(如下图所示)

在项目详情信息对最下方是项目流程信息展示，在这里，我们将展示当前项目版本安全检测推进的情况。

初定主要分为这几个流程节点:项目创建,威胁建模，白盒检测(包含组件安全检测)，灰盒检测，黑盒检测，上线。

##### 作业管理模块
作业管理模块主要实现了作业提交，作业信息展示，作业报表生成三个方面的功能。

1、作业详情展示
作业详情信息里我们将会展示当前作业检出结果的概要信息(包括文件数，代码行数，万行代码漏洞率，漏洞总数，各个等级漏洞的总数，以及任务开始和结束的时间)，另外我们还会在任务结束后通过邮件的形式给相关的负责人发送一份检出的结果报告，以方面相关负责人知晓白盒任务的大致的检测情况。

2、邮件通知
3、作业报表

作业结束后，我们会对作业检出结果进行统计分析，然后通过echart进行数据可视化展示，并使用selenium对报表页面进行自动化快照截取，最后以邮件形式发送给相关的负责人。

整个作业的流程大致如下:获取任务、执行白盒检测、数据分析可视化、快照截取、邮件发送、结束。另外，其他人员如果希望获得一份作业的报表信息的话，也可以通过手动点击报告生成按钮，选择期望生成的报表格式，进行作业报表的生成。

漏洞管理模块主要实现了漏洞审计及漏洞多条件查询两个方面的功能，以满足代码审计同学日常的代码审计工作。提供的漏洞条件查询方式，包括作业编号，项目编号，漏洞等级，检测模式(sca,白盒,灰盒，黑盒),状态(未确认，已确认，未修复，已修复),漏洞类型。通过检索作业编号即可以获取该作业下检测出的所有漏洞信息，搭配其他条件，即可找到期望找到的漏洞信息。漏洞详情信息方面我们会给出详细的漏洞发生原理，危害性，然后给出具有说服力的证明信息(包括sink点，source点，数据流信息)以证明我们分析的可靠性。在漏洞详情信息展示下方即为当前漏洞的处理进度情况。相关的审计人员在对漏洞进行二次评估之后，可以对漏洞的状态信息进行修改，以推进漏洞处理的进度。

目前apollo白盒引擎方面已支持200个java应用漏洞检测规则，涵盖98%java类型漏洞。

#### DevSecOps自动化

##### 将静态代码检测嵌入devops。
静态代码检测和devsecops结合主要有四种方式：
- 第一种是webhook方式，即监控git的push操作，对push上来的代码进行增量扫描检测；
- 第二种方式则是在piplines中集成客户端脚本，在项目进行编译打包时候，对源代码进行安全性分析。目前apollo引擎支持源码分析及jar包分析。源码分析方面，通过客户端程序将源代码直接打包到apollo远程源码缓存磁盘中，由后端apollo白盒引擎进行代码属性图构建，以及漏洞分析检测。jar包分析方面，客户端程序将上传打包生成对jar包到后端apollo白盒引擎进行风险检测。
- 第三种方式是在jenkins上建立一个定时任务，定时针对目标项目进行静态代码安全性检测。
- 第四种方式是由apollo方面通过约定的时间点主动拉取项目分支代码进行检测。

就devsecops建立早期而言，二、三、四相对来说比较容易落地，而实际操作来说，三、四应该是主要对落地方案。

##### 与jira项目管理平台进行对接(将威胁建模嵌入到devops中)
这是我们一直在沟通和完善的一个点。有句古话说得好，上医治未病，如果能够在开发前期就规避掉95%的问题，那么后续用于漏洞修复的成本将会大大降低。我们的主要思路是在项目版本创建的时候，由项目管理人员发布项目启动的issue，在issue中单独创建一个key，包含当前项目版本将要实现的功能模块，devsecops管理平台这边通过监控项目issue信息，提取相关功能模块信息列表，然后将这个列表作为输入，自动化构建威胁模型，并根据威胁建模分析，自动化给出风险规避方案，最后以邮件形式通知到相关的项目研发负责人。这样项目研发成员在开发过程中针对安全问题规避方面就会有法可依。


#### DevSecOps白盒引擎实现
白盒检测方面，我们主要基于两款自研白盒引擎进行检测，一款基于代码属性图(cpg)，我们内部叫apollo，另一款基于字节码分，我们内部叫hades。关于hades方面，此前demo版本已经开源(https://github.com/zsdlove/hades)，而且我在git仓库的readme中已经做过详细的说明了，这里就不做过多的介绍了。而基于代码属性图的漏洞检测方案，相信有做过白盒引擎的应该多少都会了解一些，该理论最早应该是由Fabian Yamaguchi在其一篇学术论文中提出的《Modeling and Discovering Vulnerabilities with Code Property Graphs》，讲的是如何将源代码抽象成属性图结构以及如何基于这个属性图进行漏洞的挖掘，该理论给予笔者关于白盒方面的引擎开发相当大的启发。难得的是，为了让外界对这套理论有更好的了解，其还开源了c/c++部分的检测引擎，感兴趣的话，各位可以去学习了解下，github地址是:https://github.com/ShiftLeftSecurity/joern。

那么基于cpg图查询方案的源代码风险检测到底是怎么做的呢？按我的理解来说，总的可以分三个阶段：
- 第一阶段是ast信息提取，这部分，需要对源代码进行第一阶段的抽象处理，即将源代码抽象为ast。一般来说，这部分不需要自己实现，而且也不建议各位自己实现，只需要找到相应的ast解析库即可。这里给个建议，java方面的话可以使用javaparser来提取,c/c++方面可利用eclipse的CDT库来进行解析。
- 下面我们来讲下第二阶段要做的事情，在第一阶段中，我们已经获得了一个ast列表，基于这个ast列表，我们在第二阶段要做的事情是对每一个函数进行过程内的cfg(control flow graph)和eog(evalution order graph)，以及基于cfg遍历和eog遍历的dfg(data flow graph)的构建。cfg和eog两个图很像，都可以理解为针对程序执行路径的描述，按我的理解是，cfg一般是将一组线性执行顺序的表达式合并为一个block，各个block之间通相应的条件分支关系连接在一起，而eog是描述过程内的各个语句以及表达式之间的求值计算关系的，两者可以用来进行后续的数据流分析，但是一般来说，eog会更适合做数据流分析，因为它是直接描述每个表达式之间的求值关系的，而cfg的话，我们还需要考虑到block和block之间的一些数据流传递关系。当然，这只是我个人的观点，如有错误，敬请斧正。关于数据流，如果真的要展开来讲的话，是一个大篇幅，这里我就分享下我在分析处理的过程中遇到的一些问题，以及我的一些解决问题的想法。我们知道直接的赋值肯定是一种数据流的关系，但是一个复杂结构的过程中不仅仅是只有简单的变量赋值的，比如数组成员的存取，再比如枚举器取值，这些也是可能影响数据流传递的中间因素。举个例子来说:
  
```
enumeration headers=request.getheaders();

String header=headers.getelement();
```
这里getelement()和header是直接的赋值关系，他们是可以被认为是数据流关系，但是headers和getelement是什么关系？求值关系。这种情况我们实际在处理的时候也应该认为是一种数据流的关系，否则的话，getelement之前的数据流边就断了。

关于frontend部分，shiftleft方面给出了一个架构图，可以参考学习一下：

<img src="images/devsecops/shiftleft-frontend架构图.png">

其中cpg2scpg应该就是将ast构成点基本图升级为带有cfg边和dfg边点scpg，即第二个level的cpg。

shiftleft将这个过程用一个金字塔模型进行描述:

<img src="images/devsecops/cpg-pyramid.jpeg">

这部分似乎在之前的图的上层加入了两个新图，即服务依赖图和组件依赖图，以丰富原有的cpg。不过按照我的理解，这个针对漏洞漏洞分析最有用，也是最实用的应该是下面这个层状结构：
- ming flaws
- DFG
- CFG/EOG
- AST

只要我们能够构建起一个比较完整的数据流图，那么后续的漏洞分析就基本没问题了。而关于过程间的数据流分析。在前面，我们针对每一个函数进行了eog的构建，此时，各个过程内的eog之间是没有任何联系的。如果我们需要进行过程间的数据流分析，那么我们就需要进行进一步的分析处理。那么这里首先第一个问题就要抛出来了，如何将所调用的函数和具体的函数的声明信息联系在一起呢？我们知道，每个函数都会有一个自己的函数签名信息的，所谓签名，就是你的一种身份凭证，所以，我们只要将函数调用节点和函数声明节点的函数签名比对一下就可以建立起函数调用节点和函数声明节点之间的关系了，当然，要做过程间的数据流分析，还需要对形参节点和实参节点进行映射关联，即将两者进行数据流边连接。

#### 基于cpg方案的java漏洞挖掘实战
基于以上理论，让我们来实践下基于cpg方案的java代码漏洞挖掘。apollo使用neo4j作为存储cpg的数据库，所以以下讲解均在neo4j web控制台上进行，使用的是neo4j自带的cypher查询语言。

1、过程内漏洞挖掘
首先我们知道，白盒审计主要关注三个方面，第一个是污点传入的地方(也就是所谓的source点)，第二个是污点沉降的地方(也就是所谓的sink点)，第三个是从source点到sink点之间的数据流路径。如果这三个点都满足，那么我们就认为sink点处是可能存在风险点的。当然，为了降低误报，通常我们还会检查下，污点经source点流到sink点的过程中是否经过了一些净化函数。

下面我们使用apollo白盒引擎对benchmark java漏洞靶场中的一个sql注入漏洞进行检测，看看效果如何。

靶场源码如下:

```
package org.owasp.benchmark.testcode;

import java.io.IOException;
import org.owasp.benchmark.testcode.Test;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet(value="/sqli-00/BenchmarkTest00008")
public class BenchmarkTest00008 extends HttpServlet {
	
	private static final long serialVersionUID = 1L;
	
	@Override
	public void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doPost(request, response);
	}

	@Override
	public void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// some code
		response.setContentType("text/html;charset=UTF-8");
		
		String param = request.getHeader("BenchmarkTest00008");

		// URL Decode the header value since req.getHeader() doesn't. Unlike req.getParameter().
		param = java.net.URLDecoder.decode(param, "UTF-8");

		String sql = "{call " + param + "}";
		try {
			java.sql.Connection connection = org.owasp.benchmark.helpers.DatabaseHelper.getSqlConnection();
			java.sql.CallableStatement statement = connection.prepareCall( sql );
		    java.sql.ResultSet rs = statement.executeQuery();
            org.owasp.benchmark.helpers.DatabaseHelper.printResults(rs, sql, response);

		} catch (java.sql.SQLException e) {
			if (org.owasp.benchmark.helpers.DatabaseHelper.hideSQLErrors) {
        		response.getWriter().println(
"Error processing request."
);
        		return;
        	}
			else throw new ServletException(e);
		}
	}
	
}
```

这里我们先确定一下sink点和source点信息。我们已知souce点为getHeader函数，它的函数签名是javax.servlet.http.HttpServletRequest.getHeader。我们可以将这两个信息作为约束条件，查找出满足条件的source节点，下面是cypher查询语法：

```
MATCH sourcenodes=(source{name:"getHeader",fqn:"javax.servlet.http.HttpServletRequest.getHeader"}) RETURN sourcenodes limit 25
```

sink点定位语法类似：

```
MATCH sinknodes=(sink{name:"prepareCall",argumentIndex:0,fqn:"java.sql.Connection.prepareCall"}) RETURN sinknodes limit 25
```

ok，我们已经找到了source点以及sink点，下面我们来看看是否存在一条数据流路径连接source点和sink点。我们使用如下查询语法：
```
MATCH p=(source{name:"getHeader",fqn:"javax.servlet.http.HttpServletRequest.getHeader"})-[r:DFG*1..]->()<-[r2:ARGUMENTS]-(sink{name:"prepareCall",argumentIndex:0,fqn:"java.sql.Connection.prepareCall"})  RETURN p
```

简单解释下该条cypher语法的含义。p代表路径，source点和sink点用于定位，”-[r:DFG*1..]->()<-[r2:ARGUMENTS]-“这个部分语句采用夹逼查询方式，查询是否存在一个节点满足以下两个条件：

1)污点处存在1或多个单位长度边到该节点。

2)该节点将作为sink点函数的一个参数，参数索引位置是0。

下面是查询出来的路径信息:
<img src="images/devsecops/理想汽车白盒检测案例路径示意图.png">

很明显，getheader和prepare之间是存在数据流路径的，那么我们有理由认为这个sql注入漏洞是存在的。

据此我们可以得出一条通用的漏洞查询语句

MATCH p=(source{name:”source_name”,fqn:"source_fqn"})-[:EOG|DFG*]->()<-[r2:ARGUMENTS]-(sink{name:"sink_name",argumentIndex:0,fqn:"sink_fqn"}) RETURN p limit 1
2、过程间漏洞挖掘
我们把上例中的benchmark漏洞靶场修改以下，将source点和sink点分开到两个文件中，如下所示：

文件BenchmarkTest00008.java

package org.owasp.benchmark.testcode;
import java.io.IOException;
import org.owasp.benchmark.testcode.Test;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
@WebServlet(value="/sqli-00/BenchmarkTest00008")
public class BenchmarkTest00008 extends HttpServlet {
	
	private static final long serialVersionUID = 1L;
	
	@Override
	public void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doPost(request, response);
	}

	@Override
	public void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// some code
		response.setContentType("text/html;charset=UTF-8");
		
		String param = request.getHeader("BenchmarkTest00008");

		// URL Decode the header value since req.getHeader() doesn't. Unlike req.getParameter().
		param = java.net.URLDecoder.decode(param, "UTF-8");
		String sql = "{call " + param + "}";
		Test.runexec(sql);
	}
	
}
Test.java文件

package org.owasp.benchmark.testcode;
import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
public class Test {
	@Override
	public static void runexec(String sql){	
		try {
			java.sql.Connection connection = org.owasp.benchmark.helpers.DatabaseHelper.getSqlConnection();
			java.sql.CallableStatement statement = connection.prepareCall( sql );
		    java.sql.ResultSet rs = statement.executeQuery();
            org.owasp.benchmark.helpers.DatabaseHelper.printResults(rs, sql, response);

		} catch (java.sql.SQLException e) {
			if (org.owasp.benchmark.helpers.DatabaseHelper.hideSQLErrors) {
        		response.getWriter().println(
"Error processing request."
);
        		return;
        	}
			else throw new ServletException(e);
		}
	}
}
简要说明一下，在BenchmarkTest00008.java文件中，函数dopost中传入污点getheader，污点经过数据流传播，进入到过程Test.runexec。在Test.runexec过程中，将传入的参数作为sql语句，进行sql查询，并且没有过滤操作。

下面我们验证下是否是否还能够查询出sink点到source之间的路径信息

我们还是使用之前的语句进行查询

MATCH p=(source{name:"getHeader",fqn:"javax.servlet.http.HttpServletRequest.getHeader"})-[r:DFG*1..]->()<-[r2:ARGUMENTS]-(sink{name:"prepareCall",argumentIndex:0,fqn:"java.sql.Connection.prepareCall"}) RETURN p
查询结果：

1609751802_5ff2dcfaf1a2ba0987be3.png!small

没有问题，还是能够得到原来的结果。那么过程间漏洞查询是如何实现的呢？在构建cpg阶段进行过程间数据流分析。我们知道每一个函数都有一个函数签名，我们自己将函数调用处函数的签名和函数声明处的函数签名进行比对就可以将两个过程进行关联，然后我们在基于此对相应的数据流节点进行连接即可，即将形参与实参进行连接，这样我们就能够进行过程间的数据流跟踪分析了。

六、业界主流白盒是怎么做的呢？
我们来分析下简单分析下codeql的一个规则实例：

import java
import semmle.code.java.dataflow.FlowSources
import SqlInjectionLib
import DataFlow::PathGraph

string getSourceLocation(DataFlow::PathNode sink){
    result=sink.getNode().getLocation().toString()
}

string getSinkLocation(DataFlow::PathNode source){
    result=source.getNode().getLocation().toString()
}

from QueryInjectionSink query, DataFlow::PathNode source, DataFlow::PathNode sink
where queryTaintedBy(query, source, sink)
select query, source, sink, "Query might include code from $@.", source.getNode(), "this user input"
这里QueryInjectionFlowConfig对sink点和source点进行了配置，相当于我们上面的source点和sink点的定位语句。

private class QueryInjectionFlowConfig extends TaintTracking::Configuration {
  QueryInjectionFlowConfig() { this = "SqlInjectionLib::QueryInjectionFlowConfig" }

  override predicate isSource(DataFlow::Node src) { src instanceof RemoteFlowSource }

  //override predicate isSink(DataFlow::Node sink) { sink instanceof SqlInjectionSink }
  override predicate isSink(DataFlow::Node sink) { sink instanceof QueryInjectionSink }

  override predicate isSanitizer(DataFlow::Node node) {
    node.getType() instanceof PrimitiveType or
    node.getType() instanceof BoxedType or
    node.getType() instanceof NumberType
  }
}
跟进queryTaintedBy看看，

predicate queryTaintedBy(
  QueryInjectionSink query, DataFlow::PathNode source, DataFlow::PathNode sink
) {
  exists(QueryInjectionFlowConfig conf | conf.hasFlowPath(source, sink) and sink.getNode() = query)
}
这里调用QueryInjectionFlowConfig这个规则配置类的hasflowpath函数查询source点到sink点之间是否存在数据流路径。

那么我们进一步跟进hasflowpath函数，

predicate hasFlowPath(PathNode source, PathNode sink) { flowsTo(source, sink, _, _, this) }
跟进flowto

private predicate flowsTo(
  PathNode flowsource, PathNodeSink flowsink, Node source, Node sink, Configuration configuration
) {
  flowsource.isSource() and
  flowsource.getConfiguration() = configuration and
  flowsource.getNode() = source and
  (flowsource = flowsink or pathSuccPlus(flowsource, flowsink)) and
  flowsink.getNode() = sink
}
跟进pathsuccplus函数，

private predicate pathSuccPlus(PathNode n1, PathNode n2) = fastTC(pathSucc/2)(n1, n2)
这里用的是一个codeql语法中的一个快速传递闭包语法，作用类似我们刚才的cypher语法中的DFG*1..，即查询是否存在1或多个单位边长路径连接source点到sink点。看来英雄所见略同，哈哈，当然，apollo白盒引擎还有long way to go。

七、后续一些想法
1、分布式构建图数据库。

单个节点构建cpg的话，相对比较缓慢，或许可以将源代码文件分发给多个节点进行构建，或许可将构建时间尽可能控制在10s之内？

2、增量检测。我的理解是，就代码安全审查的角度来说，增量扫描并不是只对新增加/修改的代码进行检测，因为白盒审计过程中需要对完整对数据流进行跟踪，而增量代码中并不能够提供完整的数据流，无法无法确定漏洞的存在与否，正确的做法应该是先对原本的分析信息(such as cpg)进行缓存，然后单独对修改或增加的源码文件进行cpg子图构建，将其融合到原来的cpg中，然后针对融合后的cpg进行重新检测，这样做的好处是可以避免因全量构建cpg而浪费大量的时间。

八、Join US
1、精通编译原理。

2、精通python，java，go，c，c++中的一种或以上编程语言，并具备良好的编码风格和团队协作能力。

3、熟悉cpg方案，并且有落地经验者优先。

4、熟悉分布式架构，精通web全栈开发者优先。

九、CONTACT WITH ME

747289639@qq.com(微信同)

by 郑斯碟

理想汽车DevSecOps负责人