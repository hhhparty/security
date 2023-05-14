# VUE 

VUE或vuejs是一款用于构建用户界面的Javascript框架。它基于HTML、CSS、Javascript构建。并且提供了一套声明式、组件化的编程模式，帮助你快速开发用户界面。

## first demo
```html
<!--单页面应用 index.js -->

<script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>

<div id="app">{{ message }}</div>

<script>
  const { createApp } = Vue
  
  createApp({
    data() {
      return {
        message: 'Hello Vue!'
      }
    }
  }).mount('#app')
</script>
```
上面的例子用到了vue的几个组成：
- 引入vue包
- 建立元素，并绑定数据
- 按照vue语法建立script脚本

上面的例子，介绍了Vue的两个核心功能：
- 声明式渲染
- 响应性
### 声明式渲染
vue基于标准HTML扩展一套模版语法，使得我们可以声明式描述最终输出的html和js状态之间的关系。
### 响应性
vue会自动跟踪js状态并在其发生变化时响应式地更新DOM


### 单页面应用（SPA）

控制整个页面、获取新数据、无需重新加载的前提下处理页面切换。

Vue提供了核心功能库（一个js框架）和全面的工具链支持，包括：
- 客户端路由
- 快速构建工具
- IDE
- 浏览器开发工具
- TypeScript支持
- 测试工具





## 语法

### el 设置挂载点

**vue 实例的作用范围在挂载点元素内，元素标签外不受影响。**

el 用来设置挂载，例如
- `el:"#app"` 挂载（选择）id为app的元素，影响仅限于内部
- `el:".app"` 挂载（选择）class为app的元素，影响仅限于内部
- `el:"div"`  挂载（选择）tagname为div的元素，影响仅限于内部

## 数据对象 data

vue实例所需的数据都在data中。

例如：
```html
<html>
<head>
<title>hello</title>
</head>
<body>
  <div id="app">
    {{message}}
  </div>

<script>
var app = new Vue({
  el:"#app",
  data:{
    message:"ni hao",
    school:{
      name:"wang wu",
      tel:"123123123"
    },
    campus:["北"，"上","广"]
  }
})

</script>
</body>
</html>
```

要点：
- vue中用到的数据定义在data中
- data中可以写复杂类型数据
- 渲染复杂类型数据时，遵守js语法即可。

### vue指令
vue使用v开头的指令来实现功能。例如 v-text v-html v-on v show v if v bind

#### v-text

- v-text 指令，用于设置标签的文本值。它会完整填充标签内文本。
  - 如果想部分替换内容，可以使用差值表达式，只替换{{}}内的数据。

```vue
<h2 v-text="message"></h2> 

<h2>nihao {{message}}</h2>
```

#### v-html

设置标签的innerHtml

如果是html结构语句，会解析。

```
<div id="app2">
    <p v-html="content"></p>
</div>


<script>
  var app2 = new Vue({
        el:"#app2",
        data:{
            content:"<a href='http://www.baidu.com'>百度一下</a>"
        }
    })
</script>
```

#### v-on

为元素绑定事件
事件名不用写on
@表示简写v-on


例如：
```vue
<input type="button" value="事件绑定" v-on:click="foo"/>
<input type="button" value="事件绑定" @click="foo"/>
<input type="button" value="事件绑定" v-on:monseenter="方法名"/>
<input type="button" value="事件绑定" v-on:dblclick="方法名"/>

<script>
  var app = new Vue(){
    el:"#app",
    methods:{
      foo:function(){
        //逻辑
      }
    }
  }
</script>
```

vue前端开发中，大多数时候不直接用dom实现页面内容变更，而是通过修改data来改变页面。

通过this关键字，可以提取出调用方法的元素所加载的数据。

```vue
 <div id="app2">
        <p v-html="content"></p>
        <input type="button" value="点击计数" @click="add">计数值：{{count}}</input>
    </div>
<script>
var app2 = new Vue({
  el:"#app2",
  data:{
      content:"<a href='http://www.baidu.com'>百度一下</a>",
      count:0
  },
  methods:{
      add:function(){
          this.count += 1
      }
  }
})
</script>
```


#### v-show
根据表达式值，显示或隐藏内容。通过操作display样式显示元素或不显示。
```vue

<div id="app">
<img src="address" v-show="true">
<img src="address" v-show="isShow">
<img src="address" v-show="age>=18">
</div>

<script>
var app = new Vue({
  el:"#app",
  data:{
    isShow:false,
    age:16
  }
})
</script>
```

#### v-if

根据表达式的逻辑值，令元素在DOM中出现或移除。它操作的不是元素的样式，而是DOM。

频繁切换的元素，可以使用 v-show，而不希望该元素出现在html中的使用v-if，性能上v-if 消耗大。


#### v-bind

设置元素属性，例如：class、value、src、title等等

语法：
`v-bind:属性名="属性值"`
简化：
`:属性名="属性值"`


如果动态修改class，建议使用对象方式，而不是三元表达式。
```html
建议方式：
<input type="button" v-bind:class="{active:isActive}" value="属性绑定测试" @click="toggleActive"></input>
不建议：
<input type="button" v-bind:class="isActive?'active':''" value="属性绑定测试" @click="toggleActive"></input>
``` 

