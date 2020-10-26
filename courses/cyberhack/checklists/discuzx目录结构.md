# Discuz!X 目录结构

discuz!目录结构 

|  --  admin.php  管理员入口
|  --  api.php  接口文件
|  --  category.php  分类入口
|  --  cp.php  个人资料设置入口
|  --  crossdomain.xml  FLASH跨域传输文件
|  --  favicon.ico  系统icon图标
|  --  forum.php  广场入口
|  --  group.php  群组入口
|  --  home.php  空间入口
|  --  index.php  首页入口
|  --  ivite.php 邀请处理文件
|  --  member.php  用户处理文件
|  --  misc.php  杂项处理文件
|  --  plugin.php  插件处理文件
|  --  portal.php  站点首页入口 同 index.php
|  --  robots.txt 搜索引擎蜘蛛限制配置文件
|  --  search.php 搜索入口文件
|  --  userapp.php 用户应用、游戏、漫游入口文件

| -- static  系统用到的图片包
| -- template  系统总模板目录
| -- uc_client  ucenter客户端程序
|  --  uc_server  FULL版本中ucenter服务端

| -- api  接口文件夹
| -- api -- db
| -- api -- db -- dbbak.php   接口调用中用到的数据库备份文件，内涵数据库类
| -- api -- javascript -- advertisemen.php   广告调用接口
| -- api -- javascript -- javascript.php   js调用接口
| -- api -- manyou 漫游平台调用接口文件夹
| -- api -- manyou -- class 漫游接口中需要用到的类的文件夹
| -- api -- manyou -- Manyou.php 漫游接口文件
| -- api -- manyou -- my.php 继承与manyou.php，用来执行更新用户资料的借口文件
| -- api -- mobile  移动手机设备接口文件夹，这个文件夹中包含了大量的用户手机浏览器客户端显示的模板和执行文件。
| -- api -- trade 在线支付平台接口文件夹，内涵支付宝，财付通等接口文件，本目录的文件需要FTP二进制上传。


| -- config   Discuz!x1的配置文件目录
| -- config  -- config_global.php   配置文件
| -- config  -- config_global_default.php   默认的配置文件
| -- config  -- config_ucenter.php  同步UCenter的配置文件
| -- config  -- config_ucenter_default.php  默认的UCenter配置文件

| -- data  程序总缓存目录
| -- data -- attachment  程序附件存放目录
| -- data -- attachment  --  swfupload  FLASH上传临时存放目录
| -- data -- attachment  --  album  相册图片附件存放目录
| -- data -- attachment  --  block  模块样式上传图片存放目录
| -- data -- attachment  --  category 分区版块图片上传存放目录
| -- data -- attachment  -- common  共有附件存放目录
| -- data -- attachment  --  forum  广场社区的附件存放目录
| -- data -- attachment  -- group  群组附件存放目录
| -- data -- attachment  -- image  图片附件存放目录
| -- data -- attachment  -- portal  首页使用到的附件存放目录
| -- data -- attachment  -- temp  各个类型的附件缓存目录
| -- data -- backup   系统备份存放目录
| -- data -- cache  **重要目录**，系统主要缓存目录，其内部存放的文件有：css样式文件、js缓存文件。(注：可能放置后门程序)
| -- data -- diy  **重要目录**，按首页(portal)、广场(forum)区分，存放所有diy过后的模板文件
| -- data -- diy -- forum  广场diy布局的缓存文件夹
| -- data -- diy -- portal  首页diy布局的缓存文件夹
| -- data -- ipdata  ip地址库
| -- data -- log  系统运行的log记录文件夹
| -- data -- plugindata  插件数据及语言包存放目录
| -- data -- request  用于包含的文件存放目录
| -- data -- sysdata
| -- data -- template **重要目录**，存放所有模板编译后生成的文件
| -- data -- threadcache  主题缓存
| -- data -- install.lock  安装后的文件锁，当有这个锁，将无法再次安装。
| -- data -- sendmail.lock  发送email的队列的锁文件
| -- data -- stat_setting.xml 统计设置
| -- data -- updatetime.lock  升级文件锁
| -- install  系统安装文件夹
| -- install -- images 安装时所有的图片文件均在此
| -- install -- include  在安装程序时所有用到的函数、变量、数据库类、语言包等存放目录
| -- install -- include  -- install_extvar.php  扩展变量默认设置文件
| -- install -- include  -- install_function.php  安装运行时的函数库
| -- install -- include  -- install_lang.php   安装运行时必须的语言包
| -- install -- include  -- install_mysql.php  安装运行时必须的mysql数据库类
| -- install -- include  -- install_var.php  安装运行时必须的默认变量
| -- install -- category.sql  分类版块使用到的数据库文件
| -- install -- category_data.sql  分类版块在安装时用到的演示数据
| -- install -- common_district.sql  中国省份及市区关系数据
| -- install --  forum_data.sql  广场的默认初始化数据
| -- install --  group_data.sql  群组的默认初始化数据
| -- install --  home_data.sql  个人空间的默认初始化数据
| -- install --  install.sql  系统必须的建表数据库总文件
| -- install --  install_data.sql  系统自带的默认初始化数据
| -- install --  makeinstall.php
| -- install --  portal_data.sql 首页的默认初始化数据
| -- install --  portal_portal_topic_content_1.xml  首页话题内容默认初始化数据xml格式文件
| -- install --  style.css  安装运行时必须的css样式表
| -- install --  update.php 系统数据库升级时用到的文件，二次开发时重要。

 


| -- source  系统运行的内核，最重要的部分
其下有7大文件夹，分别是admincp(管理员后台内核文件)，class(类库)，function(函数库)，include(被包含内核文件)，language(语言包)，module(程序块)，plugin(插件目录)

| -- source  -- admincp  管理员后台控制面板内核文件存放目录
| -- source  -- admincp -- admincp_addons.php  扩展中心内核文件
| -- source  -- admincp --  admincp_admingroup.php  管理员组内核文件
| -- source  -- admincp --  admincp_adv.php  后台广告管理内核文件
| -- source  -- admincp --  admincp_album.php  后台相册管理内核文件
| -- source  -- admincp --  admincp_albumcategory.php  相册分类管理内核文件
| -- source  -- admincp --  admincp_announce.php   公告管理内核文件
| -- source  -- admincp --  admincp_article.php  文章管理内核文件
| -- source  -- admincp --  admincp_attach.php  附件管理内核文件
| -- source  -- admincp --  admincp_block.php  模块管理内核文件
| -- source  -- admincp --  admincp_blockstyle.php  模块样式管理内核文件
| -- source  -- admincp --  admincp_blog.php   日志管理内核文件
| -- source  -- admincp --  admincp_blogcategory.php  日志分类管理内核文件
| -- source  -- admincp --  admincp_category.php  分类内核文件
| -- source  -- admincp --  admincp_checktools.php  文件验证工具
| -- source  -- admincp --  admincp_click.php  表态动作管理内核文件
| -- source  -- admincp --  admincp_comment.php  评论管理内核文件
| -- source  -- admincp --  admincp_counter.php  更新统计内核文件
| -- source  -- admincp --  admincp_cpanel.php  空间管理内核文件
| -- source  -- admincp --  admincp_credits.php  积分管理内核文件
| -- source  -- admincp --  admincp_db.php  数据库控制内核文件
| -- source  -- admincp --  admincp_district.php  地区层级内核文件
| -- source  -- admincp --  admincp_doing.php  记录管理内核文件
| -- source  -- admincp --  admincp_ec.php  电子商务、支付宝、财付通设置内核文件
| -- source  -- admincp --  admincp_faq.php  站点帮助文档管理内核文件
| -- source  -- admincp --  admincp_feed.php  feed事件管理内核文件
| -- source  -- admincp --  admincp_forums.php  广场版块管理内核文件
| -- source  -- admincp --  admincp_founder.php  后台管理团队设置内核文件
| -- source  -- admincp --  admincp_group.php  群组编辑设置内核文件
| -- source  -- admincp --  admincp_index.php  后台默认首页
| -- source  -- admincp --  admincp_login.php  管理后台登录入口内核文件
| -- source  -- admincp --  admincp_logs.php  管理系统日志记录内核文件
| -- source  -- admincp --  admincp_magics.php 魔法道具管理内核文件
| -- source  -- admincp --  admincp_main.php  后台管理外壳文件
| -- source  -- admincp --  admincp_manyou.php  漫游平台管理内核文件
| -- source  -- admincp --  admincp_medals.php  勋章管理内核文件
| -- source  -- admincp --  admincp_members.php  用户管理内核文件
| -- source  -- admincp --  admincp_menu.php  后台按钮内容对应表
| -- source  -- admincp --  admincp_misc.php  主题图章、在线图标等杂项管理内核文件
| -- source  -- admincp --  admincp_moderate.php  审核管理内核文件
| -- source  -- admincp --  admincp_perm.php
| -- source  -- admincp --  admincp_pic.php  图片管理内核文件
| -- source  -- admincp --  admincp_plugins.php  插件管理内核文件
| -- source  -- admincp --  admincp_portalcategory.php  首页分类管理内核文件
| -- source  -- admincp --  admincp_postsplit.php  分表管理内核文件
| -- source  -- admincp --  admincp_profilefield.php 用户扩展栏目管理内核文件
| -- source  -- admincp --  admincp_project.php  站点方案管理编辑内核文件
| -- source  -- admincp --  admincp_prune.php  批量删帖内核文件
| -- source  -- admincp -- admincp_quickquery.php  快捷的数据库语句存放文件
| -- source  -- admincp --  admincp_recyclebin.php  主题回收站管理内核文件
| -- source  -- admincp --  admincp_report.php  举报信息管理内核文件
| -- source  -- admincp --  admincp_runwizard.php  数据库导入导出执行文件
| -- source  -- admincp --  admincp_search.php  搜索控制内核文件
| -- source  -- admincp --  admincp_setting.php  系统设置编辑内核文件
| -- source  -- admincp --  admincp_share.php  分享管理内核文件
| -- source  -- admincp --  admincp_smilies.php  贴内表情管理内核文件
| -- source  -- admincp --  admincp_specialuser.php  明星会员管理内核文件
| -- source  -- admincp --  admincp_styles.php  风格模板管理内核文件
| -- source  -- admincp --  admincp_tasks.php  站点任务管理内核文件
| -- source  -- admincp --  admincp_templates.php  模板套系管理内核文件
| -- source  -- admincp --  admincp_threads.php  主题管理内核文件
| -- source  -- admincp --  admincp_threadsplit.php  主题管理内核文件
| -- source  -- admincp --  admincp_threadtypes.php  主题分类管理内核文件
| -- source  -- admincp --  admincp_tools.php  工具(缓存)等更新内核文件
| -- source  -- class  系统类库
| -- source  -- class  --  adv   广告控制类库
| -- source  -- class  --  adv  --  adv_blog.php  日志页广告
| -- source  -- class  --  adv  --  adv_couplebanner.php  广告拼接
| -- source  -- class  --  adv  --  adv_custom.php  自定义广告
| -- source  -- class  --  adv  --  adv_feed.php  feed页广告
| -- source  -- class  --  adv  --  adv_float.php
| -- source  -- class  --  adv  --  adv_footerbanner.php  站点底部广告
| -- source  -- class  --  adv  --  adv_headerbanner.php  站点头部广告
| -- source  -- class  --  adv  --  adv_intercat.php 分类处广告
| -- source  -- class  --  adv  --  adv_interthread.php 主题内广告
| -- source  -- class  --  adv  --  adv_subnavbanner.php  二级导航栏广告
| -- source  -- class  --  adv  --  adv_text.php  文本广告
| -- source  -- class  --  adv  --  adv_thread.php  主题页广告

| -- source  -- class  --  block  Diy模块组件类库
| -- source  -- class  --  block  --  block_activity.php  活动组件 - 高级自定义组件
| -- source  -- class  --  block  --  block_activity.php  活动组件 - 同城活动组件
| -- source  -- class  --  block  --  block_activitynew.php  活动组件 - 最新活动组件
| -- source  -- class  --  block  --  block_adv.php  广告组件
| -- source  -- class  --  block  --  block_album.php  高级自定义空间相册组件
| -- source  -- class  --  block  --  block_albumnew.php  空间相册(最新)组件
| -- source  -- class  --  block  --  block_albumspecified.php  指定相册组件
| -- source  -- class  --  block  --  block_announcement.php  公告组件
| -- source  -- class  --  block  --  block_article.php  高级自定义文章组件
| -- source  -- class  --  block  --  block_articlehot.php  热门文章组件
| -- source  -- class  --  block  --  block_articlenew.php  最新文章组件
| -- source  -- class  --  block  --  block_articlespecified.php  指定文章组件
| -- source  -- class  --  block  --  block_attachment.php  高级自定义附件组件
| -- source  -- class  --  block  --  block_attachmentdigest.php  精华附件组件
| -- source  -- class  --  block  --  block_attachmentnew.php  最新附件组件
| -- source  -- class  --  block  --  block_attachmentpic.php  图片附件组件
| -- source  -- class  --  block  --  block_banner.php  图片横幅组件
| -- source  -- class  --  block  --  block_blank.php  自定义html组件
| -- source  -- class  --  block  --  block_blog.php  高级自定义日志组件
| -- source  -- class  --  block  --  block_bloghot.php  热门日志组件
| -- source  -- class  --  block  --  block_blognew.php 最新日志组件
| -- source  -- class  --  block  --  block_blogspecified.php 指定日志组件
| -- source  -- class  --  block  --  block_category.php  分类组件
| -- source  -- class  --  block  --  block_doing.php  最新记录组件
| -- source  -- class  --  block  --  block_doinghot.php 热门记录组件
| -- source  -- class  --  block  --  block_doingnew.php 最新记录组件
| -- source  -- class  --  block  --  block_forum.php  广场版块组件
| -- source  -- class  --  block  --  block_forumtree.php  广场版块分类树组件
| -- source  -- class  --  block  --  block_friendlink.php  友情链接组件
| -- source  -- class  --  block  --  block_google.php  google组件
| -- source  -- class  --  block  --  block_group.php  高级自定义群组组件
| -- source  -- class  --  block  --  block_groupactivity.php 群组活动组件
| -- source  -- class  --  block  --  block_groupactivitycity.php  同城群组活动组件
| -- source  -- class  --  block  --  block_groupactivitynew.php  最新群组活动组件
| -- source  -- class  --  block  --  block_groupattachment.php  群组附件组件
| -- source  -- class  --  block  --  block_groupattachmentdigest.php  群组附件精华组件
| -- source  -- class  --  block  --  block_groupattachmentnew.php  最新群组附件组件
| -- source  -- class  --  block  --  block_groupattachmentpic.php  群组图片附件组件
| -- source  -- class  --  block  --  block_grouphot.php  热门群组组件
| -- source  -- class  --  block  --  block_groupnew.php  最新群组组件
| -- source  -- class  --  block  --  block_groupspecified.php 指定群组组件
| -- source  -- class  --  block  --  block_groupthread.php  群组主题组件
| -- source  -- class  --  block  --  block_groupthreadhot.php  热门群组主题组件
| -- source  -- class  --  block  --  block_groupthreadnew.php  最新群组主题组件
| -- source  -- class  --  block  --  block_groupthreadspecial.php  群组精华主题组件
| -- source  -- class  --  block  --  block_groupthreadspecified.php 指定群组话题组件
| -- source  -- class  --  block  --  block_grouptrade.php 高级自定义商品交易组件
| -- source  -- class  --  block  --  block_grouptradehot.php  热门商品组件
| -- source  -- class  --  block  --  block_grouptradenew.php  最新商品组件
| -- source  -- class  --  block  --  block_grouptradespecified.php  指定商品组件
| -- source  -- class  --  block  --  block_house.php  房产信息组件
| -- source  -- class  --  block  --  block_line.php  html分割线组件
| -- source  -- class  --  block  --  block_member.php  高级自定义用户组件
| -- source  -- class  --  block  --  block_membercredit.php  用户积分组件
| -- source  -- class  --  block  --  block_membernew.php  最新用户组件
| -- source  -- class  --  block  --  block_memberposts.php  发帖排行组件
| -- source  -- class  --  block  --  block_membershow.php 竞价排行组件
| -- source  -- class  --  block  --  block_memberspecified.php  指定用户组件
| -- source  -- class  --  block  --  block_pic.php  高级自定义图片附件调用组件
| -- source  -- class  --  block  --  block_pichot.php  热门图片附件组件
| -- source  -- class  --  block  --  block_picnew.php  最新图片附件组件
| -- source  -- class  --  block  --  block_picspecified.php  指定图片附件组件
| -- source  -- class  --  block  --  block_portalcategory.php 首页分类组件
| -- source  -- class  --  block  --  block_sort.php  分类信息组件
| -- source  -- class  --  block  --  block_stat.php  统计组件
| -- source  -- class  --  block  --  block_thread.php  高级自定义主题组件
| -- source  -- class  --  block  --  block_threaddigest.php  精华主题组件
| -- source  -- class  --  block  --  block_threadhot.php  热门主题组件
| -- source  -- class  --  block  --  block_threadnew.php  最新主题组件
| -- source  -- class  --  block  --  block_threadspecial.php  特殊主题帖组件
| -- source  -- class  --  block  --  block_threadspecified.php  指定主题帖组件
| -- source  -- class  --  block  --  block_threadstick.php  置顶帖组件
| -- source  -- class  --  block  --  block_topic.php  高级自定义话题组件
| -- source  -- class  --  block  --  block_topichot.php  热门话题组件
| -- source  -- class  --  block  --  block_topicnew.php  最新话题组件
| -- source  -- class  --  block  --  block_topicspecified.php  指定话题组件
| -- source  -- class  --  block  --  block_trade.php  高级自定义交易组件
| -- source  -- class  --  block  --  block_tradehot.php  热门交易组件
| -- source  -- class  --  block  --  block_tradenew.php  最新交易组件
| -- source  -- class  --  block  --  block_tradespecified.php  指定交易组件
| -- source  -- class  --  block  --  block_vedio.php  高级网络视频调用组件


| -- source  -- class  -- cache  缓存控制类库
| -- source  -- class  -- cache  --  cache_file.php  文件缓存控制类
| -- source  -- class  -- cache  --  cache_sql.php  数据库缓存读取与更新类

| -- source  -- class  -- magic  道具类库
| -- source  -- class  -- magic  --  magic_anonymouspost.php    帖子匿名卡
| -- source  -- class  -- magic  --  magic_attachsize.php 附件增容卡
| -- source  -- class  -- magic  --  magic_bump.php 提升卡
| -- source  -- class  -- magic  --  magic_call.php 点名卡
| -- source  -- class  -- magic  --  magic_checkonline.php 雷达卡
| -- source  -- class  -- magic  --  magic_close.php  沉默卡
| -- source  -- class  -- magic  --  magic_doodle.php 涂鸦板
| -- source  -- class  -- magic  --  magic_downdateline.php 时光机
| -- source  -- class  -- magic  --  magic_flicker.php 彩虹炫
| -- source  -- class  -- magic  --  magic_friendnum.php 好友增容卡
| -- source  -- class  -- magic  --  magic_highlight.php 主题变色卡
| -- source  -- class  -- magic  --  magic_hot.php 热点灯
| -- source  -- class  -- magic  --  magic_money.php 金钱卡
| -- source  -- class  -- magic  --  magic_namepost.php 帖子显身卡
| -- source  -- class  -- magic  --  magic_open.php 喧嚣卡
| -- source  -- class  -- magic  --  magic_repent.php 悔悟卡
| -- source  -- class  -- magic  --   magic_showip.php 窥视卡
| -- source  -- class  -- magic  --  magic_sofa.php 抢沙发
| -- source  -- class  -- magic  --  magic_stick.php 置顶卡
| -- source  -- class  -- magic  --  magic_thunder.php  雷鸣之声
| -- source  -- class  -- magic  --  magic_updateline.php  救生圈
| -- source  -- class  -- magic  --  magic_visit.php  互访卡
| -- source  -- class  --  task  站点任务类库
| -- source  -- class  --  task  --  task_avatar.php  头像任务
| -- source  -- class  --  task  --  task_blog.php  发表日志任务
| -- source  -- class  --  task  --  task_email.php  验证邮箱任务
| -- source  -- class  --  task  --  task_friend.php  添加好友任务
| -- source  -- class  --  task  --  task_gift.php  红包类任务
| -- source  -- class  --  task  --  task_member  会员类任务
| -- source  -- class  --  task  --  task_post  论坛帖子类任务
| -- source  -- class  --  task  --  task_profile  完善用户资料任务
| -- source  -- class  --  task  --  task_promotion.php  论坛推广任务


| -- source  -- class --  class_admincp.php  管理员后台面板类库
| -- source  -- class --  class_bbcode.php  论坛UBB解析类库
| -- source  -- class --  class_censor.php  词语过滤类库
| -- source  -- class --  class_chinese.php  中文编码类库
| -- source  -- class --  class_core.php  重要库文件，Discuz!X核心引擎，站点的入口和基础
| -- source  -- class --  class_credit.php  积分处理类库
| -- source  -- class --  class_eaccelerator.php  PHP加速模块
| -- source  -- class --  class_forumupload.php  广场附件上传类库
| -- source  -- class --  class_ftp.php   FTP操作类库
| -- source  -- class --  class_gifmerge.php   gif图片显示与处理类库
| -- source  -- class --  class_image.php  图片文件显示与处理类库
| -- source  -- class --  class_membersearch.php  用户资料及扩展信息搜索优化类库
| -- source  -- class --  class_memcache.php  memcache内存对象缓存系统操作类
| -- source  -- class --  class_seccode.php  验证码生成类库
| -- source  -- class --  class_sphinx.php  sphinx全文检索操作类
| -- source  -- class --  class_task.php  论坛任务类库
| -- source  -- class --  class_template.php  模板类库
| -- source  -- class --  class_tree.php  树级数据模型生成类库
| -- source  -- class --  class_upload.php  上传类
| -- source  -- class --  class_xcache.php  开源的 opcode 缓存器/优化器操作类
| -- source  -- class --  class_xml.php   xml文件操作类库
| -- source  -- class --  class_zip.php   压缩包操作类库


| -- source  -- function  系统函数库
| -- source  -- function  -- function_attachment.php  附件操作函数
| -- source  -- function  -- function_block.php  Diy模块操作函数
| -- source  -- function  -- function_blog.php  日志操作函数
| -- source  -- function  --  function_cache.php  缓存操作函数
| -- source  -- function  --  function_category.php  分类操作函数
| -- source  -- function  --  function_core.php  核心引擎操作函数
| -- source  -- function  --  function_debug.php  调试模式函数
| -- source  -- function  --  function_delete.php  内容删除操作函数
| -- source  -- function  --  function_discuzcode.php  Discuz!UBB代码函数
| -- source  -- function  --  function_ec_credit.php  商业交易积分控制函数
| -- source  -- function  --  function_editor.php  编辑器控制函数
| -- source  -- function  --  function_exif.php  大型照片Exif信息操作函数
| -- source  -- function  --  function_feed.php  feed事件控制函数
| -- source  -- function  --  function_forum.php  广场使用的函数
| -- source  -- function  --  function_forumlist.php  广场列表操作函数
| -- source  -- function  --  function_friend.php  用户好友操作控制函数
| -- source  -- function  --  function_group.php  群组控制函数
| -- source  -- function  --  function_home.php  个人空间控制函数
| -- source  -- function  --  function_image.php  图片操作函数
| -- source  -- function  --  function_importdata.php  导入数据控制函数
| -- source  -- function  --  function_login.php   登录操作函数
| -- source  -- function  --  function_magic.php   魔法道具控制函数
| -- source  -- function  --  function_mail.php  邮件控制函数
| -- source  -- function  --  function_membermerge.php  用户合并操作函数
| -- source  -- function  --  function_misc.php  杂项操作管理函数
| -- source  -- function  --  function_notification.php  系统通知操作函数
| -- source  -- function  --  function_portal.php  首页控制函数
| -- source  -- function  --  function_portalcp.php  首页控制面板函数
| -- source  -- function  --  function_post.php  发帖控制函数
| -- source  -- function  --  function_profile.php 用户资料项控制函数
| -- source  -- function  --  function_seccode.php  验证码控制函数
| -- source  -- function  --  function_share.php  分享信息控制函数
| -- source  -- function  --  function_space.php  个人空间函数
| -- source  -- function  --  function_spacecp.php  个人空间面板管理函数
| -- source  -- function  --  function_stat.php  统计函数
| -- source  -- function  --  function_sysmessage.php  系统消息控制函数，直接输出用于报错等
| -- source  -- function  --  function_task.php  系统任务操作函数
| -- source  -- function  --  function_threadsort.php  主题搜索及类别模板操作函数
| -- source  -- function  --  function_trade.php  社区交易控制函数
| -- source  -- function  --  function_userapp.php  涉及到用户应用操作函数，如获取用户名，uid，好友等
| -- source -- include  用于引用包含的文件夹
| -- source -- include -- cron 计划任务文件夹
| -- source -- include -- cron -- cron_announcement_daily.php  公告消息更新计划任务
| -- source -- include -- cron -- cron_birthday_daily.php  生日更新计划任务
| -- source -- include -- cron -- cron_cleanfeed.php  清理feed时间计划任务
| -- source -- include -- cron -- cron_cleannotification.php  清理通知计划任务
| -- source -- include -- cron -- cron_cleantrace.php  清理脚印和访问记录计划任务
| -- source -- include -- cron -- cron_cleanup_daily.php  清理并恢复到期禁言用户
| -- source -- include -- cron -- cron_cleanup_monthly.php  按月清理并恢复到期禁言用户
| -- source -- include -- cron -- cron_magic_daily.php  魔法道具计划任务
| -- source -- include -- cron -- cron_medal_daily.php  勋章操作计划任务
| -- source -- include -- cron -- cron_onlinetime_monthly.php  在线时间计划任务
| -- source -- include -- cron -- cron_promotion_hourly.php  删除论坛推广计划任务
| -- source -- include -- cron -- cron_secqaa_daily.php  验证问题计划任务
| -- source -- include -- cron -- cron_tag_daily.php  tag标签计划任务
| -- source -- include -- cron -- cron_threadexpiry_hourly.php   主题关闭计划任务
| -- source -- include -- cron -- cron_todaypost_daily.php 发帖量统计计划任务
| -- source -- include -- cron -- cron_viewlog.php  log日志记录计划任务

| -- source -- include -- misc  系统一些杂项内核文件
| -- source -- include -- misc -- misc_ajax.php   ajax内核文件
| -- source -- include -- misc -- misc_category.php  广场版块内核文件
| -- source -- include -- misc -- misc_counter.php  计数内核文件
| -- source -- include -- misc -- misc_debug.php  调试模式内核文件
| -- source -- include -- misc -- misc_emailcheck.php  email验证内核文件
| -- source -- include -- misc -- misc_forumselect.php  广场版块选择内核文件
| -- source -- include -- misc -- misc_inputpwd.php  密码输入验证内核文件
| -- source -- include -- misc -- misc_lostpasswd.php  密码丢失与取回内核文件
| -- source -- include -- misc -- misc_magicaward.php  魔法道具内核文件
| -- source -- include -- misc -- misc_promotion.php 推广任务内核文件
| -- source -- include -- misc -- misc_seccode.php  验证码内核文件
| -- source -- include -- misc -- misc_security.php  系统安全执行内核文件
| -- source -- include -- misc -- misc_sendmail.php  发送email内核文件
| -- source -- include -- misc -- misc_stat.php  统计内核文件
| -- source -- include -- misc -- misc_swfupload.php  FLASH上传内核文件

| -- source -- include -- modcp  前台管理面板使用到的文件
| -- source -- include -- modcp -- modcp_announcement.php  公告管理内核文件
| -- source -- include -- modcp -- modcp_forum.php  广场管理内核文件
| -- source -- include -- modcp -- modcp_forumaccess.php  广场是否有新主题内核文件
| -- source -- include -- modcp -- modcp_home.php  空间内核文件
| -- source -- include -- modcp -- modcp_log.php  日志内核文件
| -- source -- include -- modcp -- modcp_login.php  管理面板登录内核文件
| -- source -- include -- modcp -- modcp_member.php  用户管理内核文件
| -- source -- include -- modcp -- modcp_moderate.php  审核注册用户内核文件 
| -- source -- include -- modcp -- modcp_noperm.php
| -- source -- include -- modcp -- modcp_plugin.php  插件管理面板接口和操作内核文件
| -- source -- include -- modcp -- modcp_recyclebin.php  回收站内核文件
| -- source -- include -- modcp -- modcp_thread.php  主题管理内核文件


| -- source -- include -- portal  首页被用于包含的文件
| -- source -- include -- portal -- portal_blockclass.php  DIY拖拽模块
| -- source -- include -- portalcp -- portalcp_article.php  首页文章管理内核文件
| -- source -- include -- portalcp -- portalcp_block.php  模板管理内核文件
| -- source -- include -- portalcp -- portalcp_category.php  版块管理内核文件
| -- source -- include -- portalcp -- portalcp_comment.php  评论管理内核文件
| -- source -- include -- portalcp -- portalcp_diy.php  DIY管理内核文件
| -- source -- include -- portalcp -- portalcp_index.php  首页的管理首页文件
| -- source -- include -- portalcp -- portalcp_portalblock.php  首页模块
| -- source -- include -- portalcp -- portalcp_topic.php  首页话题管理内核文件
| -- source -- include -- portalcp -- portalcp_upload.php  上传管理内核文件


| -- source -- include -- post  发送主题使用到的文件
| -- source -- include -- post -- post_editpost.php   编辑主题内核文件
| -- source -- include -- post -- post_newreply.php  新回复内核文件
| -- source -- include -- post -- post_newthread.php 新主题内核文件
| -- source -- include -- post -- post_newtrade.php  新交易内核文件


| -- source -- include -- search 搜索使用到的文件
| -- source -- include -- search -- search_qihoo.php  奇虎搜索内核文件
| -- source -- include -- search -- search_sort.php  类别搜索内核文件
| -- source -- include -- search -- search_trade.php  交易搜索内核文件


| -- source -- include -- serverbusy.htm  系统繁忙报错静态页面

| -- source -- include -- space  空间使用到的文件
| -- source -- include -- space -- space_activity.php   空间活动内核文件
| -- source -- include -- space -- space_album.php  空间相册内核文件
| -- source -- include -- space -- space_blog.php  空间日志内核文件
| -- source -- include -- space -- space_debate.php  空间评论内核文件
| -- source -- include -- space -- space_doing.php  空间记录内核文件
| -- source -- include -- space -- space_favorite.php  空间收藏内核文件
| -- source -- include -- space -- space_friend.php  空间好友内核文件
| -- source -- include -- space -- space_group.php  空间群组内核文件
| -- source -- include -- space -- space_home.php  我的空间页面内核文件
| -- source -- include -- space -- space_index.php  空间首页内核文件
| -- source -- include -- space -- space_notice.php  空间通知内核文件
| -- source -- include -- space -- space_pm.php  空间留言短消息内核文件
| -- source -- include -- space -- space_poll.php  空间投票内核文件
| -- source -- include -- space -- space_profile.php  空间个人资料内核文件
| -- source -- include -- space -- space_reward.php  空间奖励和报酬内核文件
| -- source -- include -- space -- space_share.php  空间分享内核文件
| -- source -- include -- space -- space_thread.php  空间主题内核文件
| -- source -- include -- space -- space_top.php  空间顶部处理文件
| -- source -- include -- space -- space_trade.php  空间交易信息内核文件
| -- source -- include -- space -- space_videophoto.php  视频相册内核文件
| -- source -- include -- space -- space_wall.php  空间Diy内核文件
| -- source -- include -- spacecp  空间管理面板
| -- source -- include -- spacecp -- spacecp_album.php  相册管理面板
| -- source -- include -- spacecp -- spacecp_attentiongroup.php  关注组别管理面板
| -- source -- include -- spacecp -- spacecp_avatar.php  头像管理面板
| -- source -- include -- spacecp -- spacecp_blog.php  日志管理面板
| -- source -- include -- spacecp -- spacecp_class.php  空间分类管理面板
| -- source -- include -- spacecp -- spacecp_click.php  点击器管理面板
| -- source -- include -- spacecp -- spacecp_comment.php  评论管理面板
| -- source -- include -- spacecp -- spacecp_common.php  举报记录管理面板
| -- source -- include -- spacecp -- spacecp_credit.php  积分管理面板
| -- source -- include -- spacecp -- spacecp_credit_base.php  基础积分管理面板
| -- source -- include -- spacecp -- spacecp_credit_log.php  积分管理log记录管理面板
| -- source -- include -- spacecp -- spacecp_credit_usergroup.php  积分与用户组别管理面板
| -- source -- include -- spacecp -- spacecp_doing.php  空间记录管理面板
| -- source -- include -- spacecp -- spacecp_domain.php  空间子域名管理面板
| -- source -- include -- spacecp -- spacecp_eccredit.php  交易积分管理面板
| -- source -- include -- spacecp -- spacecp_favorite.php  收藏管理面板
| -- source -- include -- spacecp -- spacecp_feed.php  Feed事件管理面板
| -- source -- include -- spacecp -- spacecp_friend.php  好友管理面板
| -- source -- include -- spacecp -- spacecp_index.php  管理首页
| -- source -- include -- spacecp -- spacecp_invite.php  邀请管理面板
| -- source -- include -- spacecp -- spacecp_magic.php  魔法道具管理面板
| -- source -- include -- spacecp -- spacecp_plugin.php  插件管理面板
| -- source -- include -- spacecp -- spacecp_pm.php  留言及短消息管理面板
| -- source -- include -- spacecp -- spacecp_poke.php  实名认证与招呼的管理面板
| -- source -- include -- spacecp -- spacecp_privacy.php  通知管理面板
| -- source -- include -- spacecp -- spacecp_profile.php  用户资料管理面板
| -- source -- include -- spacecp -- spacecp_profilevalidate.php  用户资料验证的正则表达式
| -- source -- include -- spacecp -- spacecp_relatekw.php  官网关联文件
| -- source -- include -- spacecp -- spacecp_search.php  搜索管理面板
| -- source -- include -- spacecp -- spacecp_sendmail.php  发送email文件
| -- source -- include -- spacecp -- spacecp_share.php  分享管理面板
| -- source -- include -- spacecp -- spacecp_space.php  空间漫游管理面板
| -- source -- include -- spacecp -- spacecp_top.php 空间首先被执行的一些动作
| -- source -- include -- spacecp -- spacecp_upload.php  空间上传
| -- source -- include -- spacecp -- spacecp_userapp.php  认证动作
| -- source -- include -- spacecp -- spacecp_usergroup.php  用户组别处理文件
| -- source -- include -- spacecp -- spacecp_videophoto.php  视频相册处理文件

| -- source -- include -- table  用户编码和处理的文件
| -- source -- include -- table -- big5-unicode.table 
| -- source -- include -- table -- gb-big5.table
| -- source -- include -- table -- gb-unicode.table
 
| -- source -- include -- task  任务文件夹
| -- source -- include -- task -- task_invite.php  邀请任务
| -- source -- include -- task -- task_mod.php 任务处理模块
| -- source -- include -- task -- task_sample.php  完成任务模块

| -- source -- include -- thread  帖子主题相关文件
| -- source -- include -- thread -- thread_activity.php  主题邀请内核文件
| -- source -- include -- thread -- thread_debate.php  评论主题内核文件
| -- source -- include -- thread -- thread_pay.php  主题支付相关内核文件
| -- source -- include -- thread -- thread_poll.php  主题投票内核文件
| -- source -- include -- thread -- thread_printable.php  显示内核文件
| -- source -- include -- thread -- thread_reward.php  主题参与报酬内核文件
| -- source -- include -- thread -- thread_trade.php 主题交易内核文件


| -- source -- include -- topicadmin -- topicadmin_moderation.php  管理员话题鉴定


| -- source -- include -- userapp -- userapp_app.php  游戏应用添加
| -- source -- include -- userapp -- userapp_index.php  应用首页
| -- source -- include -- userapp -- userapp_manage.php  应用管理面板


| -- source -- language  语言包，以下语言包可以根据程序中使用到的具体情况在程序中搜索。
| -- source -- language -- adv -- lang_blog.php
| -- source -- language -- adv -- lang_couplebanner.php
| -- source -- language -- adv -- lang_custom.php
| -- source -- language -- adv -- lang_feed.php
| -- source -- language -- adv -- lang_float.php
| -- source -- language -- adv -- lang_footerbanner.php
| -- source -- language -- adv -- lang_headerbanner.php
| -- source -- language -- adv -- lang_intercat.php
| -- source -- language -- adv -- lang_interthread.php
| -- source -- language -- adv -- lang_subnavbanner.php
| -- source -- language -- adv -- lang_text.php
| -- source -- language -- adv -- lang_thread.php
| -- source -- language -- block -- lang_activitylist.php
| -- source -- language -- block -- lang_adv.php
| -- source -- language -- block -- lang_albumlist.php
| -- source -- language -- block -- lang_announcement.php
| -- source -- language -- block -- lang_articlelist.php
| -- source -- language -- block -- lang_attachmentlist.php
| -- source -- language -- block -- lang_banner.php
| -- source -- language -- block -- lang_blank.php
| -- source -- language -- block -- lang_bloglist.php
| -- source -- language -- block -- lang_categorylist.php
| -- source -- language -- block -- lang_doinglist.php
| -- source -- language -- block -- lang_forumlist.php
| -- source -- language -- block -- lang_forumstat.php
| -- source -- language -- block -- lang_forumtree.php
| -- source -- language -- block -- lang_friendlink.php
| -- source -- language -- block -- lang_google.php
| -- source -- language -- block -- lang_groupactivity.php
| -- source -- language -- block -- lang_groupattachment.php
| -- source -- language -- block -- lang_grouplist.php
| -- source -- language -- block -- lang_groupthread.php
| -- source -- language -- block -- lang_grouptrade.php
| -- source -- language -- block -- lang_houselist.php
| -- source -- language -- block -- lang_line.php
| -- source -- language -- block -- lang_memberlist.php
| -- source -- language -- block -- lang_piclist.php
| -- source -- language -- block -- lang_polllist.php
| -- source -- language -- block -- lang_portalcategory.php
| -- source -- language -- block -- lang_sortlist.php
| -- source -- language -- block -- lang_stat.php
| -- source -- language -- block -- lang_threadlist.php
| -- source -- language -- block -- lang_topiclist.php
| -- source -- language -- block -- lang_tradelist.php
| -- source -- language -- block -- lang_vedio.php
| -- source -- language -- forum -- index.htm
| -- source -- language -- forum -- lang_archiver.php
| -- source -- language -- forum -- lang_dz_feed.php
| -- source -- language -- forum -- lang_misc.php
| -- source -- language -- forum -- lang_modaction.php
| -- source -- language -- forum -- lang_seccode.php
| -- source -- language -- forum -- lang_swfupload.php
| -- source -- language -- forum -- lang_template.php
| -- source -- language -- forum -- lang_wap.php
| -- source -- language -- group -- lang_template.php
| -- source -- language -- home -- index.htm
| -- source -- language -- home -- lang_magic.php
| -- source -- language -- home -- lang_template.php
| -- source -- language -- lang_action.php
| -- source -- language -- lang_admincp.php
| -- source -- language -- lang_admincp_login.php
| -- source -- language -- lang_admincp_menu.php
| -- source -- language -- lang_admincp_msg.php
| -- source -- language -- lang_admincp_searchindex.php
| -- source -- language -- lang_blockclass.php
| -- source -- language -- lang_core.php
| -- source -- language -- lang_email.php
| -- source -- language -- lang_error.php
| -- source -- language -- lang_exif.php
| -- source -- language -- lang_feed.php
| -- source -- language -- lang_friend.php
| -- source -- language -- lang_message.php
| -- source -- language -- lang_notification.php
| -- source -- language -- lang_portalcp.php
| -- source -- language -- lang_space.php
| -- source -- language -- lang_spacecp.php
| -- source -- language -- lang_template.php
| -- source -- language -- magic -- lang_anonymouspost.php
| -- source -- language -- magic -- lang_attachsize.php
| -- source -- language -- magic -- lang_bump.php
| -- source -- language -- magic -- lang_call.php
| -- source -- language -- magic -- lang_checkonline.php
| -- source -- language -- magic -- lang_close.php
| -- source -- language -- magic -- lang_doodle.php
| -- source -- language -- magic -- lang_downdateline.php
| -- source -- language -- magic -- lang_flicker.php
| -- source -- language -- magic -- lang_friendnum.php
| -- source -- language -- magic -- lang_highlight.php
| -- source -- language -- magic -- lang_hot.php
| -- source -- language -- magic -- lang_money.php
| -- source -- language -- magic -- lang_namepost.php
| -- source -- language -- magic -- lang_open.php
| -- source -- language -- magic -- lang_repent.php
| -- source -- language -- magic -- lang_showip.php
| -- source -- language -- magic -- lang_sofa.php
| -- source -- language -- magic -- lang_stick.php
| -- source -- language -- magic -- lang_thunder.php
| -- source -- language -- magic -- lang_updateline.php
| -- source -- language -- magic -- lang_visit.php
| -- source -- language -- member -- index.htm
| -- source -- language -- member -- lang_template.php
| -- source -- language -- search -- lang_template.php
| -- source -- language -- task -- lang_avatar.php
| -- source -- language -- task -- lang_blog.php
| -- source -- language -- task -- lang_email.php
| -- source -- language -- task -- lang_friend.php
| -- source -- language -- task -- lang_gift.php
| -- source -- language -- task -- lang_member.php
| -- source -- language -- task -- lang_post.php
| -- source -- language -- task -- lang_profile.php
| -- source -- language -- task -- lang_promotion.php

| -- source -- module  系统运行模组
| -- source -- module -- category  分类模组
| -- source -- module -- category -- category_cache.php   分类缓存模组
| -- source -- module -- category -- category_index.php  分类首页模组
| -- source -- module -- category -- category_list.php  分类列表模组
| -- source -- module -- category -- category_misc.php  分类的杂项模组
| -- source -- module -- category -- category_my.php  我的分类模组
| -- source -- module -- category -- category_post.php  分类信息发布模组
| -- source -- module -- category -- category_threadmod.php  分类主题模块
| -- source -- module -- category -- category_view.php  分类查看模组

| -- source -- module -- forum  广场模组
| -- source -- module -- forum -- forum_ajax.php  广场ajax模组
| -- source -- module -- forum -- forum_announcement.php  广场公告消息显示模组
| -- source -- module -- forum -- forum_attachment.php  广场内部附件显示模组
| -- source -- module -- forum -- forum_forumdisplay.php  广场论坛版块模组
| -- source -- module -- forum -- forum_group.php  广场群组模组
| -- source -- module -- forum -- forum_image.php  广场图片模组
| -- source -- module -- forum -- forum_index.php  广场首页模组
| -- source -- module -- forum -- forum_misc.php  广场杂项模组
| -- source -- module -- forum -- forum_modcp.php  广场管理面板模组
| -- source -- module -- forum -- forum_post.php  广场发帖模组
| -- source -- module -- forum -- forum_redirect.php  广场版块重定向模组
| -- source -- module -- forum -- forum_relatekw.php  广场XML传递接口模组
| -- source -- module -- forum -- forum_relatethread.php  主题传递模组
| -- source -- module -- forum -- forum_rss.php  广场rss订阅
| -- source -- module -- forum -- forum_search.php  广场搜索
| -- source -- module -- forum -- forum_topicadmin.php  广场话题管理模组
| -- source -- module -- forum -- forum_trade.php  广场交易模组
| -- source -- module -- forum -- forum_viewthread.php  广场查看主题模组

| -- source -- module -- group  群组模组
| -- source -- module -- group -- group_index.php  群组首页

| -- source -- module -- home 空间模组
| -- source -- module -- home -- home_editor.php    空间编辑器模组
| -- source -- module -- home -- home_invite.php  空间邀请模组
| -- source -- module -- home -- home_magic.php  空间魔法道具模组
| -- source -- module -- home -- home_medal.php  空间勋章模组
| -- source -- module -- home -- home_misc.php  空间杂项模组
| -- source -- module -- home -- home_rss.php  空间订阅模组
| -- source -- module -- home -- home_space.php  空间首页模组
| -- source -- module -- home -- home_spacecp.php  空间管理面板模组
| -- source -- module -- home -- home_task.php  空间任务模组
| -- source -- module -- home -- home_userapp.php  空间用户游戏应用模组

| -- source -- module -- member 空间用户控制模组
| -- source -- module -- member -- member_activate.php  用户活动触发模组
| -- source -- module -- member -- member_clearcookies.php  用户cookie清理控制模组
| -- source -- module -- member -- member_emailverify.php 用户email验证核实模组
| -- source -- module -- member -- member_getpasswd.php  获取加密密码模组
| -- source -- module -- member -- member_groupexpiry.php  用户组到期控制模组
| -- source -- module -- member -- member_logging.php  用户登录模组
| -- source -- module -- member -- member_lostpasswd.php  丢失密码与找回控制模组
| -- source -- module -- member -- member_register.php  用户注册控制模组
| -- source -- module -- member -- member_regverify.php 用户认证核实模组
| -- source -- module -- member -- member_switchstatus.php  登录统计控制模组

| -- source -- module -- misc  杂项模组
| -- source -- module -- misc -- misc_error.php  杂项报错模组
| -- source -- module -- misc -- misc_faq.php  faq控制模组
| -- source -- module -- misc -- misc_initsys.php  初始化系统模组
| -- source -- module -- misc -- misc_invite.php  邀请参与话题、群组等模组
| -- source -- module -- misc -- misc_report.php  举报模组
| -- source -- module -- misc -- misc_seccode.php  验证码控制模组
| -- source -- module -- misc -- misc_secqaa.php  验证问答控制模组
| -- source -- module -- misc -- misc_swfupload.php  FLASH上传控制模组

| -- source -- module -- portal  首页模组
| -- source -- module -- portal -- portal_attachment.php  首页附件控制模组
| -- source -- module -- portal -- portal_block.php  首页模块模组
| -- source -- module -- portal -- portal_comment.php  首页评论模组
| -- source -- module -- portal -- portal_index.php  首页显示模组
| -- source -- module -- portal -- portal_list.php  首页列表模组
| -- source -- module -- portal -- portal_portalcp.php  首页控制面板模组
| -- source -- module -- portal -- portal_topic.php  首页话题模组
| -- source -- module -- portal -- portal_view.php  首页显示模组

| -- source -- module -- search  搜索模组
| -- source -- module -- search -- search_album.php  相册搜索模组
| -- source -- module -- search -- search_blog.php  日志搜索模组
| -- source -- module -- search -- search_forum.php  版块搜索模组
| -- source -- module -- search -- search_group.php  群组搜索模组
| -- source -- module -- search -- search_portal.php  首页搜索模组

| -- source -- plugin 插件文件夹
| -- source -- plugin -- myrepeats 自带插件(马甲插件范例)
| -- source -- plugin -- myrepeats -- admincp.inc.php    管理面板包含文件
| -- source -- plugin -- myrepeats -- discuz_plugin_myrepeats.xml    我的马甲插件安装配置XML文件
| -- source -- plugin -- myrepeats -- install.php  我的马甲插件安装执行文件
| -- source -- plugin -- myrepeats -- memcp.inc.php  前台管理面板包含文件
| -- source -- plugin -- myrepeats -- myrepeats.class.php  我的马甲内核类
| -- source -- plugin -- myrepeats -- switch.inc.php 
| -- source -- plugin -- myrepeats -- template -- index.htm
| -- source -- plugin -- myrepeats -- template -- memcp.htm  观前台管理面板模版文件
| -- source -- plugin -- myrepeats -- uninstall.php  我的马甲插件卸载执行文件


| -- source  --  discuz_version.php  系统版本号