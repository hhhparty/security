# AUTOSAR 厂商

autosar是目前汽车软件领域最重要的中间件，也是利润最丰厚的领域。

Autosar CP 需要厂家配合硬件芯片（MCU）做二次开发，通常是第三方来做，国际上为3巨头控制：
- Vector：可以配合所有MCU芯片
- ETAS：偏向瑞萨和NXP的MCU
- EB：偏向意法半导体和英飞凌，以及瑞萨

Autosar CP 与MCU捆绑，较难解耦。


Autosar AP 是为了Linux、QNX 等基于POSIX标准的OS进入汽车做的中间件，与高性能SoC配合密切，例如：
- Nvidia Orin
- 高通 SA8540P

国内Autosar 厂商：
- 东软睿驰
- 普华基础软件
  - 意法半导体ST芯片
- 经纬恒润
- 华为
- 斑马智行
- 超星未来
- 映驰科技
- 未动科技
- 零念科技
- 上海赫千
- 国汽智控
- 成都道伟


AUTOSAR核心成员有9家，分别为：宝马、博世、大陆、戴姆勒、福特、通用、PSA、丰田、大众。截止2022年3月，AUTOSAR现有核心成员单位9家，高级合作伙伴单位63家（可算1级会员），发展合作伙伴单位70家（可算2级会员），初级合作伙伴154家（可算3级会员）。9家核心公司主要负责AUTOSAR开发模式的筹划、管理和调控，也是AUTOSAR协议的发起人。高级合作伙伴需要与核心开发合作伙伴紧密合作，参与制定AUTOSAR标准，协同管理工作组。发展合作伙伴在核心会员成立的项目领导组的协调和监督下开展工作。每一级会员每年的年费有差别，提供的信息丰富程度和快捷程度有差异。基本上做汽车软件绕不开AUTOSAR，做域控制器也绕不开，有时候没法区分基础软件和Tier1。会员等级基本上和重视程度高度关联，与开发技术实力也基本是正相关的，没有加入AUTOSAR就做汽车软件的，有些不可思议。

国产AUTOSAR需要与国产芯片相互支持，也要有能力应对国际形势，因此出现了AUTOSEMO。中国汽车工业协会联合车企与软件企业于2019年12月决定组建中国汽车基础软件生态委员会AUTOSEMO，China Automotive Basic Software Ecosystem Committee，AUTOSEMO创始会员单位汇聚国内20家整车企业和汽车软件供应商，包括：中国一汽、一汽解放、东风汽车、广汽研究院、蔚来汽车、上汽零束、小鹏汽车、吉利汽车、长城汽车、长安汽车、北汽福田、东软睿驰、苏州挚途、万向钱潮、威迈斯、经纬恒润、上海拿森、上海重塑、北京地平线、中汽创智。这个委员会下属的ASF组，致力于定一个中间件的行业标准，就是AUTOSEMO Service Framework，简称就是ASF。目前AUTOSEMO的工作组已经发布了《中国汽车基础软件发展白皮书2.0》。