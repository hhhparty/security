# README

**一阴一阳谓之道**


这个项目，希望将结合现有的开源AI化网络攻击与开源AI化网络安全防御，形成博弈的双方，以攻促防，以防促攻。

## 攻击侧

### v0.1

- OS：
  - Ubuntu server 1604( named “attack_server”)
- Project：
  - DeepEXP
  - GyoiThon
  - Metasploit-framework
  - Burpsuite
  - OWASP-ZAP
  - NMAP


## 防御侧
- OS:
  - Ubuntu server 1604( named “defense_server”)
- Project
  - WAF: [VeryNginx](https://github.com/alexazhou/VeryNginx) 或 [Modsecurity](https://github.com/SpiderLabs/ModSecurity)（部署可参考freebuf.com/articles/web/224473.html）
  - IDS：snort
  - 端点保护：
  - 蜜罐：
  - SIEM
  - ELK
  - 防病毒：CLAWAV
  - 态势感知
  - 构建基于Nginx、OpenResty等的网关系统
  - 资产探查，例如tophant/ARL(Asset Reconnaissance Lighthouse)资产侦察灯塔系统
  - 整体平台：[SeMF](https://gitee.com/gy071089/SecurityManageFramwork)
  

## 参考

- https://github.com/13o-bbr-bbq/machine_learning_security
  - Source codes about machine learning and security.
- https://github.com/wtsxDev/Machine-Learning-for-Cyber-Security
  - A curated list of amazingly awesome tools and resources related to the use of machine learning for cyber security.
- https://github.com/jivoi/awesome-ml-for-cybersecurity
  - A curated list of amazingly awesome tools and resources related to the use of machine learning for cyber security.
- https://github.com/Trusted-AI/adversarial-robustness-toolbox
  - 对抗性鲁棒性工具集（ART）是用于机器学习安全性的Python库。ART提供的工具可 帮助开发人员和研究人员针对以下方面捍卫和评估机器学习模型和应用程序： 逃逸，数据污染，模型提取和推断的对抗性威胁。
- https://github.com/faizann24/Using-machine-learning-to-detect-malicious-URLs
  - This Repo is based on https://github.com/faizann24/Using-machine-learning-to-detect-malicious-URLs http://fsecurify.com/using-machine-learning-detect-malicious-urls/
- https://github.com/hongriSec/AI-Machine-Learning-Security
  - 红日安全Web安全小组致力于AI机器学习，主要研究机器学习算法、AI模型、渗透测试工具
- https://github.com/ANSSI-FR/SecuML
  - SecuML is a Python tool that aims to foster the use of Machine Learning in Computer Security. It is distributed under the GPL2+ license.
- https://github.com/cylance/IntroductionToMachineLearningForSecurityPros
- https://github.com/enaqx/awesome-pentest
- [甲方开源工具清单](https://blog.csdn.net/qq_23936389/article/details/106846358)