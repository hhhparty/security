# STIX

STIX 是OASIS OPEN 发布的一种威胁情报标准。

Structured Threat Information Expression (STIX) is a language for expressing cyber threat and observable information. This document defines concepts that apply across all of STIX and defines the overall structure of the STIX language.

## Overview

STIX 是一种定义网络威胁情报的分类的模式，以下列对象形式表达：

- STIX Objects
  - STIX Core Objects
    - STIX Domain Objects（SDO）
      - 是表达行为和结构的抽象对象，通常是在理解威胁landscape时或进行威胁分析后产生的。
    - STIX Cyber-observable Objects（SCO）
      - 是一种表达关于某个网络或主机所观察到的事实的对象，可用于或关联到更抽象情报来形成对一个威胁场景综合性的理解
    - STIX Relationship Objects（SRO）
      - 连接各SDO到一起，连接SCO到一起，并连接SDO和SCO到一起的对象，以形成一个更综合的威胁场景理解。
  - STIX Meta Objects
    - Extension Definition Objects
    - Language Content Objects
    - Marking Definition Objects


### 基于图的模型
STIX 是一个连接图。SDO 和 SCO定义了图的节点；SRO定义了边。基于图的语言遵循通用分析方法并允许灵活的、模块化的、结构化的和一致的CTI（Cyber Threat Intelligence）表达。

#### SDO

STIX 定义了一个SDO的集合：
- Attack Pattern 攻击模式
- Campaign
- Course of Action 
- Grouping
- Identity
- Indicator
- Infrastructure
- Intrusion Set
- Location
- Malware
- Malware Analysis
- Note 注释
- Observed Data 被观察数据
- Opinion
- Report
- Threat Actor
- Tool
- Vulnerability

每个对象对应一个CTI中的概念。

#### SCO

SCO是一个集合，用于刻画基于主机的和基于网络的信息。SCOs被SDOs用来提供支持各种上下文环境。例如，被观察数据SDO，表示了在一个特定时间被观察的原始数据。

SCO记录了一个网络或一个主机发生的事实，并且不捕获who、when、why。通过联系SCOs和SDOs，可以对当前威胁形势有更高层次的理解，可能提供了 who 和 why 特定威胁情报会对组织有关系。

例如，对于一个文件的信息，关于存在的文件、观察到的正在运行的进程或两个IP之间发生的网络流量的信息都可以作为SCO被捕获。

#### STIX Relationships

关系是在SDOs和SCOs的连接关系，或在SDO和SCO之间


## SDOs

### Attack Pattern

攻击模式是一种TTP类型，用于描述攻击者尝试入侵目标的方式。攻击模式用于对攻击进行分类，将某个具体的攻击概括位一般性分类，冰鞋提供关于攻击如何执行的详细信息。

例如：spear phising（鱼叉式钓鱼）是一种攻击模式，它是一种常见的攻击类型，攻击者发送定制的email给被害者，诱使他点击链接或打开附件并激活恶意代码。

攻击模式SDO包含了文本化描述和其他的外部定义的攻击分类（例如可参考 CAPEC）。

```json
//A generic attack pattern for spear phishing, referencing CAPEC
{
 "type": "attack-pattern",
 "spec_version": "2.1",
 "id": "attack-pattern--0c7b5b88-8ff7-4a4d-aa9d-feb398cd0061",
 "created": "2016-05-12T08:17:27.000Z",
 "modified": "2016-05-12T08:17:27.000Z",
 "name": "Spear Phishing",
 "description": "...",
 "external_references": [
 {
 "source_name": "capec",
 "external_id": "CAPEC-163"
 }
 ]
}
//A specific attack pattern for a particular form of spear phishing, referencing CAPEC
[
 {
 "type": "attack-pattern",
 "spec_version": "2.1",
 "id": "attack-pattern--7e33a43e-e34b-40ec-89da-36c9bb2cacd5",
 "created": "2016-05-12T08:17:27.000Z",
 "modified": "2016-05-12T08:17:27.000Z",
 "name": "Spear Phishing as Practiced by Adversary X",
 "description": "A particular form of spear phishing where the attacker claims that the
target had won a contest, including personal details, to get them to click on a link.",
 "external_references": [
 {
 "source_name": "capec",
 "external_id": "CAPEC-163"
 }
 ]
 },
 {
 "type": "relationship",
 "spec_version": "2.1",
 "id": "relationship--57b56a43-b8b0-4cba-9deb-34e3e1faed9e",
 "created": "2016-05-12T08:17:27.000Z",
 "modified": "2016-05-12T08:17:27.000Z",
 "relationship_type": "uses",
 "source_ref": "intrusion-set--0c7e22ad-b099-4dc3-b0df-2ea3f49ae2e6",
 "target_ref": "attack-pattern--7e33a43e-e34b-40ec-89da-36c9bb2cacd5"
 },
 {
 "type": "intrusion-set",
 "spec_version": "2.1",
 "id": "intrusion-set--0c7e22ad-b099-4dc3-b0df-2ea3f49ae2e6",
 "created": "2016-05-12T08:17:27.000Z",
 "modified": "2016-05-12T08:17:27.000Z",
 "name": "Adversary X"
 }
]
```