# Pandas Tutorial

参考：
- https://pandas.pydata.org/pandas-docs/stable/user_guide/index.html
- https://www.pypandas.cn/docs/

主要内容：
- IO tools
- 索引和数据选择器
- 多索引和高级索引
- 合并、联接和连接
- 重塑和数据透视表
- 处理文本字符串
- 处理丢失数据
- 分类数据
- Nullable整型数据类型
- 可视化
- 计算工具
- 组操作
- 时间序列/日期方法
- 时间增量
- 样式
- 选项和设置
- 提高性能
- 稀疏数据结构
- FAQ
- 操作指南

## IO TOOLS

pandas的I/O API是一组read函数，比如pandas.read_csv()函数。这类函数可以返回pandas对象。相应的write函数是像DataFrame.to_csv()一样的对象方法。下面是一个方法列表，包含了这里面的所有readers函数和writer函数。

|Format|Type|Data|Description|Reader|Writer|
|-|-|-|-|-|-|
|text|CSV|read_csv|to_csv|
|text|JSON|read_json|to_json|
|text|HTML|read_html|to_html|
|text|Local|clipboard|read_clipboard|to_clipboard|
|binary|MS|Excel|read_excel|to_excel|
|binary|OpenDocument|read_excel||
|binary|HDF5|Format|read_hdf|to_hdf|
|binary|Feather|Format|read_feather|to_feather|
|binary|Parquet|Format|read_parquet|to_parquet|
|binary|Msgpack|read_msgpack|to_msgpack|
|binary|Stata|read_stata|to_stata|
|binary|SAS|read_sas||
|binary|Python|Pickle|Format|read_pickle|to_pickle|
|SQL|SQL|read_sql|to_sql|
|SQL|Google|Big|Query|read_gbq|to_gbq|

## 索引和数据选择器

Pandas对象中的轴标记信息有多种用途：

- 使用已知指标识别数据（即提供元数据），这对于分析，可视化和交互式控制台显示非常重要。
- 启用自动和显式数据对齐。
- 允许直观地获取和设置数据集的子集。

在本节中，我们将重点关注最后一点：即如何切片，切块，以及通常获取和设置pandas对象的子集。主要关注的是Series和DataFrame

### 索引的不同选择

