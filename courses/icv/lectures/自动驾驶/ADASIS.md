# ADASIS

ADASIS（高级驾驶员辅助系统接口规范 Advanced Driver Assistance Systems Interface Specification），ADASIS定义了地图在ADAS中的数据模型及传输方式，以CAN作为传输通道。

当前版本 v3.0

> Advanced Driver Assistance Systems need to access and use map data, vehicle position, speed, as well as other data in order to improve the performance of these applications and/or to enable new functionalities e.g. automated driving. However, navigation map databases are inaccessible to applications outside of the navigation system and are stored in the proprietary format of the navigation system. ADASIS is providing the solution.

广义说也是一个组织，2001年5月，来自欧洲汽车行业的汽车制造商、车载系统开发商以及图商联合起来成立了ADASIS Forum，制定地图与ADAS系统之间的通信协议，也就是ADASIS。ADASIS Forum作为制定ADAS Horizon的实施标准以及统一的地图数据接口的国际组织，成员包括了几乎全部整车厂和全球知名导航系统制造商、ADAS厂商、地图数据库厂商。

## 高精地图

高静地图不仅有高精度的坐标，还有准确的道路形状，每个车道的坡度、曲率、航向、高程、侧倾。

## ADASIS Horizon
ADASIS Horizon是传递车辆前方部分道路网及其特征的地图数据的一种方式，它使用当前车辆位置和车辆通过道路网的可能路径建立了车辆通过道路网的层级式路径集合。 此外，ADASIS Horion还提供道路的几何形状信息并且将这些属性赋给了车辆的可能路径。ADAS Horizon可以进行序列化，并通过车辆通信网络传输。