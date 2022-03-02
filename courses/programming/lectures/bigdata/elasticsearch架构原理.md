# ElasticSearch 架构原理

## 入门

### ES节点类型

主要分为2类：
#### Master node
  - 当某个节点启动后，使用Discovery机制找到集群中的其他节点，并建立连接，并从候选节点中找一个Master节点。
  - Discovery机制：discovery.seed_hosts["s201","s202","s203",...]
  - 候选Master：cluster.initial_master_nodes:["moe-es-node1","moe-es-node2",...]


主要职责：
- 管理索引：建立、删除、分配分片（shard）
- 维护meta data
- 管理集群节点状态
- 不负责数据写入和查询


#### DataNode node

ES集群中的主要职责：
- 数据写入
- 数据检索

内存要大。

### 分片和副本机制

#### 分片 shard
ES是一个分布式搜索Engine，索引 Index 数据也是分为若干部分，分布在不同的服务器节点中。

分布在不同节点中的索引就是分片 shard。

ES自动管理shard，不均匀时自动调整。

#### 副本 replica

为保证 Shard 高可用、容错性、ES会对shard 引入 replica 机制，每个 shard 都有对应的 replica shard。即每个shard有：
- Primary Shard
- Replica Shard

Primary 和 Replica 不在一个服务器节点上。

#### 创建索引时指定分片和副本

创建指定分片数量、副本数量的索引
```
PUT /moe_article
{
  "mappings": {
    "properties": {
    }
  },
  "settings": {
    "number_of_shards": 3,
    "number_of_replicas": 2
  }
}
```

假如有三台服务器节点
number_of_shards：3个主分片
number_of_replicas：2个副本

<image src="images/3nodes.awebp">

### 重要工作流程

#### 文档写入原理

<image src="images/es文档写入原理.awebp">
假如选择了Node2（DataNode）发送请求，此时Node2称为coordinating node（协调节点）
计算得到文档要写入的分片 shard = hash(routing) % number_of_primary_shards routing 是一个可变值，默认是文档的 _id
coordinating node会进行路由，将请求转发给其他DataNode（对应某个primary shard，假如主分片在Node1节点上）
Node1上的Primary Shard处理请求，写入数据到索引库中，并将数据同步到其他的Replica Shard中
Primary Shard 和 Replica Shard都保存完文档后，返回客户端。

#### ES检索原理

<image src="images/es检索原理.awebp">
假如选择了Node2，此时Node2称为coordinating node（协调节点）
协调节点（Coordinating Node）将查询请求广播到每一个数据节点，这些数据节点的分片会处理该查询请求。
每个分片进行数据查询，将符合条件的数据放在一个优先队列中，并将这些数据的文档ID、节点信息、分片信息返回给协调节点。
协调节点将所有的结果进行汇总，并进行全局排序。
协调节点向包含这些文档ID的分片发送get请求，对应的分片将文档数据返回给协调节点，最后协调节点将数据返回给客户端。

## ES应用场景

ElasticSearch 是当前流行的企业级搜索引擎，能够达到实时搜索，稳定，可靠，快速，安装使用方便，它提供了一个分布式多用户能力的全文搜索引擎。

### Elasticsearch的包含功能：
- 分布式的搜索引擎和数据分析引擎

搜索：百度，网站的站内搜索，IT系统的检索
数据分析：
电商网站，最近一周手机商品销量排名前10的商家有哪些；
新闻网站，最近1个月访问量排名前3的新闻版块是哪些

- 全文检索，结构化检索，数据分析

全文检索：我想搜索商品名称包含手机的商品，select * from products where product_name like "%手机%"
结构化检索：我想搜索商品分类为电子数码的商品都有哪些，select * from products where category_id='电子数码'

部分匹配、自动完成、搜索纠错、搜索推荐
数据分析：我们分析每一个商品分类下有多少个商品，select category_id,count(*) from products group by category_id

- 对海量数据进行近实时的处理

分布式：ES自动可以将海量数据分散到多台服务器上去存储和检索
海量数据的处理：分布式以后，就可以采用大量的服务器去存储和检索数据，自然而然就可以实现海量数据的处理了

近实时：检索个数据要花费1小时（这就不要近实时，离线批处理，batch-processing）；在秒级别对数据进行搜索和分析

跟分布式/海量数据相反的：lucene，单机应用，只能在单台服务器上使用，最多只能处理单台服务器可以处理的数据量

### Elasticsearch的适用场景
- 维基百科和百度百科，手机维基百科，全文检索，高亮，搜索推荐。
- The Guardian（国外新闻网站），类似搜狐新闻，用户行为日志（点击，浏览，收藏，评论）+社交网络数据（对某某新闻的相关看法），数据分析，给到每篇新闻文章的作者，让他知道他的文章的公众反馈（好，坏，热门，垃圾，鄙视，崇拜）

- Stack Overflow（国外的程序异常讨论论坛），IT问题，程序的报错，提交上去，有人会跟你讨论和回答，全文检索，搜索相关问题和答案，程序报错了，就会将报错信息粘贴到里面去，搜索有没有对应的答案

- GitHub（开源代码管理），搜索上千亿行代码。

- 电商网站，检索商品。

- 日志数据分析，logstash采集日志，ES进行复杂的数据分析（ELK技术，elasticsearch+logstash+kibana）

- 商品价格监控网站，用户设定某商品的价格阈值，当低于该阈值的时候，发送通知消息给用户，比如说订阅手机的监控，如果iphone的手机低于3000块钱，就通知我，我就去买

（8）BI系统，商业智能，Business Intelligence。比如说有个大型商场集团，BI，分析一下某某区域最近3年的用户消费金额的趋势以及用户群体的组成构成，产出相关的数张报表，**区，最近3年，每年消费金额呈现100%的增长，而且用户群体85%是高级白领，开一个新商场。ES执行数据分析和挖掘，Kibana进行数据可视化国内。

（9）国内：站内搜索（电商，招聘，门户，等等），IT OA系统搜索（OA，CRM，ERP，等等），数据分析（ES热门的一个使用场景）

作者：zwb_jianshu
链接：https://www.jianshu.com/p/8494ae9a53a7
来源：简书
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。