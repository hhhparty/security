# ICV 网络安全最佳实践

参考：
- [Cybersecurity Best Practices for the Safety of Modern Vehicles,updated 2022](https://www.nhtsa.gov/sites/nhtsa.gov/files/2022-09/cybersecurity-best-practices-safety-modern-vehicles-2022-tag.pdf)

## 术语
- Safety-critical system 安全关键车辆控制系统：是可将控制输入应用于转向、油门或制动器的车辆系统。

Application Programming Interface (API) is an interface that defines interactions between two software entities. Usually, the goal of an API is to provide an abstraction layer that hides complexity while providing specified functionality.


Attack is an intentional action designed to cause harm.

Attack surface is the set of interfaces (the “attack vectors”) where an unauthorized user can try to inject or extract data from a system or modify a system’s behavior.

Attack vector refers to the interfaces or paths an attacker uses to exploit a vulnerability. For instance, an exploit may use an open IP port vulnerability on a variety of different attack vectors such as Wi-Fi, cellular networks, IP over Bluetooth, etc. Attack vectors enable attackers to exploit system vulnerabilities, including the human element.

Authentication is the process of verifying identity, especially a user, code creator or source of data.

Automotive refers to “of, relating to, or concerned with motor vehicles in general.”
Back-end servers are network-based computing resources that provide a variety of services to mobile devices such as cars and phones.

Binary image or firmware image refers to the sequence of bytes that comprises the software, both code and data, running on vehicle electronics.

Controller Area Network (CAN) is a dominant serial communication network protocol used for intra-vehicle communication.

Credential is some subset of cryptographic keys, username or password used to authenticate.

Cybersecurity is the measures taken to protect a computer or computer system against an attack.

Debug is the activity of discovering errors in software and hardware that leads to unspecified system functionality including erroneous behavior.

Digital signing is a mathematical technique that ensures message authenticity, integrity, and nonrepudiation. Signature validation proves to the recipient the sender’s identity, the message has not
been modified during transmission, and only the signing key holder could have generated the signature (given the key has not been compromised).

Electronic architecture is the general framework that provides power and communications for devices within a vehicle.

Electronic Control Unit (ECU) is an embedded system that provides a control function to a vehicle’s electrical system or subsystems through digital computing hardware and associated software.

Encryption is an operation that converts information to a form that is readable only to an authorized party. 

Exploit refers to an action that takes advantage of a vulnerability in order to cause unintended or unanticipated behavior to occur on computer software and/or hardware. An example of an exploit would be using a buffer overflow to execute privileged code on a target.

Firmware refers to compiled code and data running in an environment dominated by electrical, physical interfaces.

Global symmetric keys are symmetric cryptographic keys that are be applied to multiple, or an entire population of devices.

Incident is an occurrence that actually or potentially jeopardizes the confidentiality, integrity, or availability of an information system on a vehicle computing platform using an exploit.

Layered protections are internal cybersecurity protections that assume the compromise of other vehicle computing resources.

Over-the-Air (OTA) is a software update distribution method which uses wireless transmission.

Privilege separation is a technique in which computing resources are divided into parts which are limited to the specific privileges they require in order to perform a specific task.

Public Key Infrastructure (PKI) refers to a set of policies, processes, server platforms, software, and workstations used for the purpose of administering certificates and public-private key pairs, including the ability to issue, maintain, and revoke public key certificates.

Recovery is the timely restoration of systems or assets affected by cybersecurity incidents.

Safety-Critical Vehicle Control Systems are vehicle systems which can apply control inputs to steering, throttle or brake.

Software refers to the instructions and data that reside on an embedded system, such as an automotive electronic control system, that implements dedicated functions and manage system resources (e.g., system input/outputs to execute those functions). Software may take a variety of different forms. For example, in some cases “software” may refer to source code while in some cases it may take the form of a binary image consisting of a file system and compiled binary.

Spoofing refers to using a communications channel with the intent of misrepresenting the source of a message.

Service Set Identifier (SSID) is a string that functions as the name of a Wi-Fi network.

Telematics refers to the integration of telecommunications and informatics for intelligent applications in vehicles, such as fleet management.

Transport Layer Security (TLS) is a common set of cryptographic protocols used to secure communications over IP networks. TLS secures communications between web clients and servers.

Vulnerability is a weakness in a system or its associated networks, system security procedures,internal controls, or implementation that could be exploited to obtain unauthorized access to system resources. For instance, an open diagnostic port on an ECU is a vulnerability.

Whitelist-based filtering is a policy that uses a list of allowed messages to pass valid messages while not passing invalid messages.

Wi-Fi is a common name for a wireless local area network (WLAN) defined by IEEE 802.11


## 一般网络安全最佳实践

NHTSA的政策和研究侧重于实践和解决方案，这些做法和解决方案有望加强车辆的电子架构，以防止潜在的攻击，并帮助确保车辆系统采取适当和安全的行动，即使在攻击成功的情况下仍能发挥这类作用。

车辆网络安全的分层方法，是一种假设某些车辆系统可能受到威胁，但能降低攻击成功的概率并减轻未经授权的车辆系统访问后果的方法。

[G.1] 汽车行业应遵循美国国家标准与技术研究院（NIST）已明确的网络安全框架，该框架围绕“识别、保护、检测、响应和恢复”这五个主要功能构建，以建立一种全面和系统的方法，为车辆开发分层网络安全保护。

该方法应：
- 建立在基于风险的优先识别和保护安全关键车辆控制系统的基础上；
- 在可能和可行的情况下，消除安全关键车辆控制系统的风险源；
- 及时检测并快速响应现场潜在的车辆网络安全事件；
- 设计方法和流程，以便于事故发生时快速恢复；并且
- 通过有效的信息共享（如参与Auto ISAC），将方法制度化，以加快整个行业的经验教训（如漏洞共享）。

## 产品网络安全的领先地位
汽车行业供应商和制造商必须制定企业优先事项，培养一种准备好并能够应对与机动车辆和机动车辆设备相关的日益增长的网络安全挑战的文化。

从领导层到员工层强调网络安全的重要性，表明了有效管理网络安全风险的重要性，并将有助于组织在整个产品开发过程中更好地优先考虑网络安全。这一重点使积极主动的网络安全文化能够从组织内的领导职位中继承。此外，它有助于产品开发周期在设计阶段早期考虑网络安全保护。沿着这些线，


[G.2] 开发或集成车辆电子系统或软件的公司应优先考虑车辆网络安全，并通过以下方式证明执行管理层的承诺和责任：

[a] 在组织内分配专用资源，重点研究、调查、实施、测试和验证产品网络安全措施和漏洞；

[b] 通过与产品网络安全事项相关的组织级别，促进无缝和直接的沟通渠道；和

[c] 在车辆安全设计过程中，为车辆网络安全相关考虑事项提供独立的发言权。

## 具有明确网络安全考虑的车辆开发过程

网络安全考虑包括车辆的整个生命周期，包括概念、设计、制造、销售、使用、维护、转售和退役。

组织在设计保护方面具有更大的灵活性，并且在开发过程的早期就具有可以促进遏制和恢复解决方案的功能。

### 过程

[G.3]汽车行业应遵循基于系统工程方法的稳健产品开发流程，目标是设计无不合理安全风险的系统，包括来自潜在网络安全威胁和漏洞的系统。

### 风险评估

[G.4]该过程应包括适当的网络安全风险评估步骤（参考21434 15章节内容），并反映车辆整个生命周期的风险缓解。

[G.5]在评估风险时，应首先考虑车辆乘员和其他道路使用者的安全。

### 传感器漏洞风险

网络安全的一个新兴领域是车辆传感器数据的潜在操纵。制造商应谨慎考虑，除了传统的软件/固件修改外，车辆系统及其行为可能会受到传感器信号操纵的影响。

[G.6]制造商应考虑与传感器漏洞和潜在传感器信号操纵工作相关的风险，如GPS欺骗、路标修改、激光雷达/雷达干扰和欺骗、摄像机致盲和激发机器学习误报。

### 消除或缓解安全关键风险

[G.7]应通过设计将安全关键系统的任何不合理风险消除或减轻到可接受的水平，并且对存在不可避免和不必要风险的任何功能，应尽可能消除。

### 保护

[G.8]对于剩余功能和潜在风险，应设计和实施适合评估风险的分层保护。

这里的分层保护是一种内部网络安全保护，是假定其他车辆计算资源可能遭受入侵后的保护。

[G.9]应明确网络安全预期，并将其传达给支持预期保护的供应商。
ISO/SAE 21434 Clause 7 “Distributed Cybersecurity Activities” discusses customer-supplier relationships and various recommendations for how to manage cybersecurity risks among these entities, including the interactions, dependencies, and responsibilities between customers and suppliers for cybersecurity activities. 

### 车辆硬件和软件资产的库存和管理

[G.10] 供应商和车辆制造商应维护每个汽车ECU、每个组装车辆中使用的操作硬件和软件组件的数据库，以及车辆寿命期内应用的版本更新的历史记录。

[G.11] 制造商应跟踪与软件组件相关的足够详细信息，以便当发现与开源或现成软件相关的新识别漏洞时，制造商可以快速识别哪些ECU和特定车辆会受到其影响。


### 网络安全测试与漏洞识别

[G.12] 制造商应针对已知漏洞评估车辆ECU中使用的所有商用现成（off-the-shelf）和开源软件组件。

[G.13] 制造商还应进行产品网络安全测试，包括使用渗透测试，作为开发过程的一部分。

[G.14] 测试阶段应该雇佣合格的测试人员，他们不是开发团队的一部分，并且他们非常积极地识别漏洞。

[G.15] 应对网络安全测试期间评估的每个已知漏洞或识别的新漏洞进行漏洞分析。还应记录漏洞的处置以及如何管理漏洞的基本原理。



### 监测、遏制、补救

[G.16] 除了设计保护外，汽车行业还应建立快速的车辆网络安全事件检测和补救能力。

[G.17] 当检测到网络攻击时，此类能力应能够减轻车辆乘员和周围道路使用者的安全风险，并将车辆转换至最低风险状态，以适应识别的风险。


### 数据、文档、信息共享

[G.18]制造商应收集潜在攻击的信息，并通过AutoISAC和其他共享机制对这些信息进行分析并与业界共享。

[G.19]制造商应充分记录与车辆网络安全管理相关的任何行动、设计选择、分析、支持证据和变更。

[G.20]所有相关工作产品应可在稳健的文件版本控制系统中进行跟踪。

### 持续风险监测和评估

[G.21]公司应使用系统化和持续的流程，定期重新评估风险，并根据车辆网络安全状况的变化，适当更新流程和设计。

### 行业最佳实践

[G.22]应遵循安全软件开发的最佳实践，如NIST出版物32 33和ISO/SAE 21434所述。

- Black, P., Badger, M., Guttman, B., & Fong E., NISTIR 8151 Dramatically Reducing Software Vulnerabilities: Report to the White House Office of Science and Technology Policy. 
- Dodson D., Souppaya M., & Scarfone K., Mitigating the Risk of Software Vulnerabilities by Adopting a Secure Software Development Framework. 
- ISO/SAE 21434 clause 10 discusses software development practices.

由于网络安全的动态和不断发展的性质，汽车行业的成员必须了解基于或由SAE国际、ISO、Auto ISAC、NHTSA、网络安全基础设施安全局（CISA）、NIST、行业协会，工业协会，以及其他公认的标准制定机构。进一步地：

[G.23]制造商应通过公认的标准制定组织和Auto ISAC积极参与汽车行业特定的最佳实践和标准制定活动。

[G.24]随着未来风险的出现，行业应合作，以便利地制定缓解措施和最佳做法，以应对新的风险。

## 信息共享

2014年底，根据第13691号行政命令“促进私营部门网络安全信息共享”（EO 13691），35 NHTSA开始鼓励行业36创建AutoISAC。汽车行业于2015年底成立了Auto ISAC，并于2016年1月19日全面运营。Auto ISEC获得EO 13691的授权，以促进其成员之间的行业网络安全相关信息共享。包括NHTSA在内的政府实体不是Auto ISAC的成员。NHTSA不参与或访问Auto ISAC内发生的信息共享。

截至2022年初，Auto ISAC成员包括64个组织。

[G.25]强烈鼓励扩展汽车行业的成员（包括但不限于车辆制造商、汽车设备供应商、软件开发商、通信服务供应商、售后系统供应商和车队经理）：

[a] 加入Auto ISAC；

[b] 与Auto ISAC及时共享有关网络安全问题的信息，包括漏洞和情报信息。

[G.26]强烈鼓励Auto ISAC成员合作，迅速探索针对报告漏洞的遏制选项和对策，而不考虑对自身系统的影响。

## 安全漏洞报告程序

对于汽车行业的成员来说，让安全研究界和公众能够轻松地向他们报告信息是很重要的。漏洞报告程序可以帮助识别网络安全漏洞。这些计划在其他部门都很有效，将有利于汽车行业。

[G.27]汽车行业成员应制定自己的漏洞报告政策和机制。

ISO/SAE 21434’s [RQ-05-02] suggests the organization shall establish and maintain rules and processes regarding vulnerability disclosure. ISO/SAE 21434 also notes that the rules and processes regarding vulnerability disclosure can be specified in ISO 29147, Information Technology Security Techniques Vulnerability Disclosure.

ISO 标准中有29147 漏洞披露和30111 漏洞处理过程两个标准，国内有2020年发布的《网络产品安全漏洞管理规定》以及GB/T 30276-2020		信息安全技术 网络安全漏洞管理规范（参考了iso 29147 和 iso 30111）、GB/T 30279-2020		信息安全技术 网络安全漏洞分类分级指南、GB/T 28458-2020		信息安全技术 网络安全漏洞标识与描述规范、GB/T 34943-2017		C/C++语言源代码漏洞测试规范、GB/T 34944-2017		Java语言源代码漏洞测试规范、GB/T 34946-2017		C#语言源代码漏洞测试规范


## 4.5组织事件响应流程

不可能预测未来的所有攻击。因此，谨慎的做法是让组织、其流程和员工做好准备，以便在事故发生时有效处理事故。

[G.28]汽车行业成员应制定产品网络安全事件响应流程。该过程应包括：

[a] 记录在案的事件响应计划；

[b] 组织内明确的角色和职责；

[c] 明确标识的沟通渠道和组织外部的联系人，以及

[d] 保持这些信息 [G.28[a]-[c]]为最新的程序。

[G.29] 组织应制定指标，定期评估其响应过程的有效性。

[G.30] 组织应记录适用于其产品的每个已识别和报告的漏洞、漏洞或事件的详细信息。

[G.31] 应记录漏洞的性质以及如何管理漏洞的基本原理。

[G.32] 根据评估的风险，各组织应制定一项计划，以解决现场消费者自有车辆、已制造但尚未分配给经销商的车辆库存、交付给经销商但尚未销售给消费者的车辆以及未来产品和车辆上新发现的漏洞。

即使当一个新的漏洞可能不被认为是安全关键的，并且可能无法保证立即修复时，在新的软件发布周期内对已识别的漏洞应用已知的补救措施也是一种良好的做法。

此外，响应过程应包括尽快向Auto-ISAC45报告所有事件、漏洞和漏洞。这也建议尚未成为Auto ISAC成员的公司使用。【重述G.23【b】】

[G.33]任何事件也应报告给CISA/美国计算机

根据美国应急准备小组（US-CERT）

联邦事故通知指南46

[G.34]行业成员应定期开展并参与有组织的网络事件应对演习。

参加有组织的演习，测试组织的披露政策操作和事件响应流程的有效性。此外，它有助于根据经验教训进行适当的修订。

## 自我审计

文档和文档控制对于建立一个明确和受控的过程来管理软件和相关漏洞风险至关重要。

### 过程管理文件

[G.35]汽车行业应记录与其车辆网络安全风险管理流程相关的详细信息，以便于审计和问责。

[G.36]此外，此类文件应在相关产品的预期寿命内保存。

[G.37]文件应遵循稳健的版本控制协议49 50，并应随着新信息、数据和研究结果的可用而定期修订。

### 审查和审核

[G.38]汽车行业应制定程序，对其网络安全相关活动的管理和文件进行内部审查。

这些活动将有助于公司更好地了解其网络安全实践，并确定其流程可以从改进中受益的地方。

[G.39]汽车行业应考虑每年进行组织和产品网络安全审计。

审计报告的公开版本将向利益相关者和消费者提供信息，并有助于证明组织对产品网络安全的承诺。

## 教育

持续教育现有劳动力和教育未来劳动力是帮助行业改善机动车网络安全态势的关键步骤。

网络安全教育活动不应局限于当前的劳动力或技术人员，还应丰富未来的劳动力和非技术人员。NHTSA鼓励汽车行业与大学合作开发课程，以进一步提高在一系列实际安全应用中有用的技能，包括车辆网络安全领域。

[G.40]车辆制造商、供应商、大学和其他利益相关者应共同努力，帮助支持针对汽车网络安全领域的劳动力发展的教育工作。

## 售后市场/用户自有设备

由第三方设计和制造的用户拥有的设备可能会带来独特的网络安全挑战。

### 车辆制造商

汽车行业应考虑到消费者可能会将售后设备（如保险狗）和个人设备（如移动电话）带入车辆，并通过制造商提供的接口（蜂窝数据、IEEE 802.11 无线局域网[Wi-Fi]、蓝牙、USB、OBD-II端口等）。

[G.41]汽车行业应考虑用户自有或售后设备与车辆系统连接时可能带来的风险，并提供合理的保护。

[G.42]任何与第三方设备的连接都应经过认证，并提供适当的有限访问权限。

### 售后设备制造商

售后设备制造商应考虑其设备与可能影响生命安全的网络物理系统连接。尽管系统的主要目的可能与安全无关（例如，收集车队运行数据的远程信息处理设备），但取决于车辆系统架构，如果没有适当保护，该设备可以用作代理来影响车辆中安全关键系统的行为。售后设备可以连接到各种车辆类型，在接口的车辆侧具有不同级别的网络安全保护。因此

[G.43]售后设备制造商应对其产品采取强有力的网络安全保护措施。

## 可服务性（serviceability）

一辆普通的机动车在道路上行驶超过十年，需要定期维护和偶尔维修，才能在使用中安全运行。

[G.44]汽车行业应考虑个人和第三方对车辆部件和系统的可用性。

[G.45]汽车行业应提供强有力的车辆网络安全保护，不过度限制车主授权的其他第三方维修服务的访问。

NHTSA认识到第三方可服务性和网络安全之间的平衡并不一定容易实现。然而，网络安全不应成为限制可用性的理由。同样，可维护性不应限制强大的网络安全控制。

## 技术车辆网络安全最佳实践

以下技术车辆网络安全最佳实践基于NHTSA通过其内部应用研究以及与NHTSA和公众分享的利益相关者经验所学到的知识，介绍了各种基本保护技术。这些建议并没有形成保护汽车计算系统所需行动的详尽清单，所有项目可能不适用于每种情况。

### 生产设备中的开发人员/调试访问

软件开发人员将经常使用ECU，可能通过串行控制台、车辆Wi-Fi网络上的开放IP端口、开放调试端口实现ECU访问。然而

[T.1]如果没有可预见的操作原因，支持持续访问部署单元的ECU，则应限制或取消开发人员对ECU的访问。

[T.2]如果需要保持开发人员对ECU的访问，则应采取适当措施，保护任何开发用调试接口，限制授权特权用户的访问。

仅仅在物理上隐藏用于开发人员调试访问的连接器、迹线或引脚不应被视为一种充分的保护形式。

### 密码技术和证书

密码技术的适用性可以随着各种因素而变化。一个重要因素是计算创新。因此：

[T.3]对于预期应用，密码技术应是最新的且不过时的。

虽然选择适当的密码技术是一个重要的设计标准，但应该注意的是，实现环节通常决定了任何系统的安全性。

加密凭证有助于调解对车辆计算资源和后端服务器的访问。示例包括密码、公钥基础设施（PKI）证书和加密密钥。

[T.4]应保护提供对车辆计算平台的授权、更高级别访问的密码凭证，以防未经授权的泄露或修改。

[T.5]从单个车辆计算平台获得的任何凭证都不应提供对其他车辆的访问。

### 车辆诊断功能

车辆诊断功能提供实用工具，以支持车辆的维修和可用性；然而，如果设计和保护不当，它们可能会对车辆系统造成危害。

[T.6]诊断功能应尽可能局限于实现相关功能预期目的的特定车辆操作模式。

[T.7]诊断操作的设计应能消除或最小化在其预期用途之外被误用或滥用的潜在危险后果。

例如，可以禁用车辆单独制动器的诊断操作应被限制为仅在低速下运行。此外，可以禁止该诊断操作同时禁用所有制动器，和/或该诊断控制动作的持续时间可以是有时间限制的。

[T.8]应尽量减少使用全局对称密钥和自定义的密码技术进行诊断访问。

公钥加密技术比在多个车辆上有效的对称密钥更安全。

### 诊断工具

过去，研究人员对诊断工具进行了逆向工程，以获取身份验证密钥并执行敏感操作，如重新刷新固件。

[T.9]车辆和诊断工具制造商应通过提供适当的认证和访问控制来控制工具对可执行诊断操作和重新编程的车辆系统的访问。

### 车辆内部通信

关键安全信息是那些可能直接或间接影响安全关键车辆控制系统运行的信息。

[T.10]在可能的情况下，关键安全信号应以通过外部车辆接口无法访问的方式传输。

例如，为ECU的关键传感器提供专用传输机制将消除与CAN等通用数据总线上的欺骗信号相关的风险。分段通信总线还可以减轻将不安全的售后设备连接到车辆网络的潜在影响。

[T.11]通过共享和可能不安全的渠道传播关键信息应采用最佳实践，限制重播、完整性妥协和欺骗的可能性。物理和逻辑访问也应受到高度限制。

### 事件日志

车载网络和连接的服务产生的数据，可以支持检测未经授权的对车辆计算资源的访问。

[T.12]应创建和维护足以揭示网络安全攻击或成功破坏的性质的事件日志，并支持事件重建。
[T.13]应定期审查各个车辆汇总的此类日志，以评估网络攻击的潜在趋势。

### 进入车辆的无线路径

车辆系统的无线接口产生了新的攻击载体，可能被远程利用。未经授权的对车辆计算资源的无线访问可能会在没有适当控制的情况下迅速扩展到多辆车辆。
#### 无线接口

[T.14]制造商应将车辆无线接口外部的所有网络和系统视为不可信，并使用适当的技术来缓解潜在威胁。

#### 车辆架构设计中的分段和隔离技术

[T.15]应使用网络分段和隔离技术来限制无线连接的ECU和低级车辆控制系统之间的连接，尤其是那些控制安全关键功能的系统，如制动、转向、推进和动力管理。

具有边界控制的权限分离对于提高系统的安全性非常重要。逻辑和物理隔离技术可用于分离处理器、车辆网络和外部连接（视情况而定），以限制和控制从外部威胁向量到车辆网络物理特征的路径。

[T.16]应使用具有强大边界控制的网关，例如对不同网段之间的消息流进行严格的基于白名单的过滤，以确保网络之间的接口安全。

#### 网络端口、协议和服务

任何在互联网协议（IP）端口上侦听的软件都会打开一个可能被利用的攻击向量。诸如telnet、 dbus、和Android调试器等网络服务。解决与网络端口相关的潜在漏洞的建议做法包括：

[T.17]从生产车辆中消除不必要的互联网协议服务；

[T.18]将车辆ECU上网络服务的使用仅限于基本功能；和

[T.19]适当保护此类端口上的服务，以限制授权方使用。

#### 与后端服务器的通信

[T.20]制造商应在外部服务器和车辆之间的任何操作通信中使用适当的加密和认证方法。

#### 更改路由规则的能力

[T.21]制造商应规划并创建流程，以允许将网络路由规则的更改快速传播并应用到单个车辆、车辆子集或连接到网络的所有车辆。

### 软件更新/修改

汽车软件架构是分布式和复杂的，汽车行业长期以来一直具备更新汽车ECU固件的能力，以解决现场问题和系统升级。需要考虑和解决与未经授权使用这些机制相关的风险。

[T.22]汽车制造商应采用最先进的技术，限制授权和适当认证方修改固件的能力。

限制攻击者修改固件的能力使恶意软件安装在车辆上更具挑战性。数字签名技术的使用可以防止汽车ECU启动修改的/未经授权的并且可能损坏的固件映像。此外，采用签名技术的固件更新系统可以防止安装非授权来源的损坏性软件更新。


攻击者可以使用软件更新机制将较旧、更易受攻击的软件放置在目标设备上。这种做法称为固件版本回滚或降级攻击。

[T.23]制造商应采取措施限制固件版本回滚攻击。

### OTA软件更新

空中传送（OTA）是指使用无线传输的软件更新分发方法。在其车辆上设计并提供OTA软件更新功能的制造商应：

[T.24]总体上保持OTA更新、更新服务器、传输机制和更新过程的完整性。

[T.25]在设计安全措施时，应考虑与服务器受损、内部威胁、中间人攻击和协议漏洞相关的风险。


