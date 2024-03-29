# 动力电池管理系统 BMS

Battery Management System BMS，电动汽车动力电池包的低压管理系统。

## 位置

电池管理系统和动力电池一起组成电池包整体。

与电池管理系统有通信关系的两个部件：
- 整车控制器
- 充电机

电池管理系统功能：
- 通过CAN Bus 与电动汽车整车控制器通信，上报电池包状态参数，接收整车控制器指令，配合整车需要，确定功率输出。
- 监控整个电池包运行状态，保护电池包不受过放、过热等非正常运行状态的侵害。
- 充电过程中，与充电机交互，管理充电参数，监控充电过程正常完成。

BMS组成：
- 主控模块
  - 总电压采集
  - 总电流采集
  - 内外部通信
  - 故障记录
  - 故障决策
- 从控模块
  - 电压采集
  - 温度采集
  - 均衡控制

BMS的布局：
- 集中式布局
  - 所有组件放在一个盒体内
- 分布式布局
  - 一个主控盒、若干从控盒
  - 主要用于高压系统，电池串数多的，或者商用车上。


均衡功能，作为从板反作用于电池包，起到优化电池系统功能的一项能力需要多说一句。

均衡，分为主动均衡和被动均衡。
- 所谓主动均衡，是能量的转移，基于削峰填谷的理念。具体的实现形式多种多样，有用变压器将总能量部分的转移到电压偏低的电池上的，也有利用电容电感等储能器件，从电压高的电芯放出一部分能量，再充入电压低的电芯。
- 所谓被动均衡，是能量的消耗，把电压高的电芯接入电阻回路，让多出来的电量消耗在电阻上。

主动均衡，可以做到比较大的电流，均衡的效果比较明显；能量只是转移了一下，没有消失，是一种节能的工作方式。但主动均衡需要的变压器、电容、电感等器件，体积比较大，造价比较高，使得理论上具备优势的主动均衡策略至今还没有得到普遍的应用；

被动均衡，受电阻发热的限制，均衡电流无法做的太大，故而效果不是特别理想。但优势在于，体积小，系统结构简单，造价低。在产品要求不是特别高的场合，客户反而会选择被动均衡系统，以提高产品性价比。同时，通过每隔一段时间，对电芯进行维护，来解决均衡不充分造成的电池压差偏大问题。

## 动力电池包使用安全

1、正常使用过程中的安全问题

动力电池包的安全问题，从根本上说都是电池系统热失控问题。系统散热能力与系统生热能力不匹配，热量在系统内积累，电池温度上升，最终导致燃爆等恶略后果。

锂电池负极SEI膜，是在系统温度上升过程中，最先出现失效的结构，反应起始温度在90到100°左右。考虑电池的内外温差以及保留部分冗余设计，这就是我们的电池包工作温度上限一般设置在50到60°之间的原因。

正常使用中，防止热失控，一方面避免过多热量的产生和积累；另一方面，提高热管理水平，让电池在它最适合的温度环境下工作。

2、带来热失控风险的行为

在过高温度下使用

原因如前面所述，从锂电池负极SEI膜溶解开始，失去保护的负极与电解液反应放热，电解液分解放热，正极分解放热，这些热量积累起来，反应逐渐加剧，反应从一只单体蔓延到附近电芯，一个模组的反应，给整个电池箱内的电芯加热，这就是所谓热失控的过程。

在过低温度下使用

电池包都会标注一个使用温度范围，低于下限温度，电池也是无法正常工作的。低温放电，理论上没有跟热失控有明确关联，但低温造成电解质活性降低，导电能力变差，进而导致放电能力变差，就是我们所谓的放不出电来，车子没劲儿。如果是低温强行充电，则会造成负极析锂问题，容量会受到永久损伤不说，析出的锂积累在那里，是热失控的重要原因。

过大倍率使用

超过电芯允许能力的大倍率放电，系统热量不能及时散去，热量积累，逐渐加大了热失控的风险。同时，过大倍率的放电，使得正极材料的锂离子嵌入过程超速进行，造成正极晶格坍塌，容量永久性损失。

大倍率充电，使得锂离子通过SIE膜的速度低于锂离子向负极积聚的速度，出现锂单质在负极表面堆积现象，如果过程反复进行，锂枝晶不断生长，最终会刺破隔膜，造成内短路，引发热失控。

过充过放电

过充，充电截止电压超过了电芯的最高电压，造成正极活性材料晶格塌陷，锂离子脱嵌通道受阻，使内阻急剧升高，产生大量热；负极堆积了过量的锂单质，附着在负极表面，所谓析锂现象。正负极的反应过程都容易最终走向热失控。

过放，本来应该是锂离子从负极脱出，嵌入正极晶格，但负极没有那么多的正离子可以提供，使得负极的集流体铜排失去铜离子，铜离子游离在电解质中，附着在正极或者负极，都会造成整个系统的失效。

## BMS在热失控风险防范上的作用

1、BMS的已有功能

对于热失控风险的防范，BMS主要是起到监督作用，防止电池滥用发生。

温度，BMS有明确的工作温度阈值设置，针对充电，放电均有最高最低的温度限制，超过设置限制，系统不得开启或者必须降功率运行；

电压，针对过充过放风险，BMS设置有最高最低的充电和放电电压阈值，确保在触及电压阈值时，系统自动停止运行。

热管理，根据电池包的理想工作温度，命令冷却加热系统工作，防止过冷过热情况的出现。

消防，按照国标要求，商用车已经强制添加消防功能，系统出现消防风险，会采取报警和喷射灭火剂等措施。只是，当前的消防探测技术和算法都还没有得到充分发展，充分的发挥作用还需要一些时间。

2、BMS还在发展的功能

比如前文提到的一些状态估计SOH、SOF等，精确的状态估计，是动力电池恰当使用的前提，这方面的研究也在日益增多。

精确的温度反馈能力，理想的温度监测应该能够反映每颗电芯的实时温度，当前，由于技术和成本问题，还无法做到。

总结

动力电池安全是电动汽车推广的一个瓶颈，电池管理系统除了强化被动监控能力以外，加强均衡和热管理等主动作用于动力电池的能力，是除了加强电芯、模组等自身设计安全性以外，从本质上提高系统安全性的根本所在。
