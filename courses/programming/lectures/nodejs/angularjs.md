# AngualrJS 

AngularJS 扩展了HTML，使用了新的属性和表达式。可以构建一个单一页面应用（SPAs：Single Page Applications）。

实例：
```html
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<script src="https://cdn.staticfile.org/angular.js/1.4.6/angular.min.js"></script>
</head>
<body>

<div ng-app="">
  <p>名字 : <input type="text" ng-model="name"></p>
  <h1>Hello {{name}}</h1>
</div>

</body>
</html>
```

## 简介
AngularJS 通过指令扩展了 HTML，且通过 表达式 绑定数据到 HTML。

AngularJS 是一个 JavaScript 框架
AngularJS 是一个 JavaScript 框架。它是一个以 JavaScript 编写的库。

AngularJS 是以一个 JavaScript 文件形式发布的，可通过 script 标签添加到网页中：

`<script src="https://cdn.staticfile.org/angular.js/1.4.6/angular.min.js"></script>`

### AngularJS 扩展了 HTML
AngularJS 通过 ng-directives 扩展了 HTML。

`ng-app` 指令定义一个 AngularJS 应用程序。

`ng-model` 指令把元素值（比如输入域的值）绑定到应用程序。

`ng-bind` 指令把应用程序数据绑定到 HTML 视图。

```html
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<script src="https://cdn.staticfile.org/angular.js/1.4.6/angular.min.js"></script>
</head>
<body>
 
<div ng-app="">
    <p>名字 : <input type="text" ng-model="name"></p>
    <h1>Hello {{name}}</h1>
    <p ng-bind="name"></p>
</div>
 
</body>
</html>
```

实例讲解：

当网页加载完毕，AngularJS 自动开启。

ng-app 指令告诉 AngularJS，`<div>` 元素是 AngularJS 应用程序 的"所有者"。

ng-model 指令把输入域的值绑定到应用程序变量 name。

ng-bind 指令把应用程序变量 name 绑定到某个段落的 innerHTML。

### 什么是 AngularJS？
AngularJS 使得开发现代的单一页面应用程序（SPAs：Single Page Applications）变得更加容易。

AngularJS 把应用程序数据绑定到 HTML 元素。
AngularJS 可以克隆和重复 HTML 元素。
AngularJS 可以隐藏和显示 HTML 元素。
AngularJS 可以在 HTML 元素"背后"添加代码。
AngularJS 支持输入验证。
### AngularJS 指令
正如您所看到的，AngularJS 指令是以 ng 作为前缀的 HTML 属性。
- ng-app 指令初始化一个angularjs应用程序。它定义了AngularJS应用程序的根元素。这个质量在网页加载完毕时自动引导（初始化）应用程序。
- ng-init 指令初始化 AngularJS 应用程序数据（不常见，有控制器或模块来代替它）。
- ng-model 指令把html元素值（比如输入域的值）绑定到应用程序。
  - 还可以为应用程序数据提供类型验证（number，email，required）
  - 还可以为应用程序数据提供状态（invalid，dirty，touched，error）
  - 为html元素提供css类
  - 绑定HTML元素到html表单。
- ng-repeat 指令会重复一个Html元素。ng-repeat对集合中（数组）的每个向会克隆一次html元素。
- 自定义指令，可以使用 .directive 函数来添加。

```js
<div ng-app="" ng-init="firstName='John'">
 
<p>姓名为 <span ng-bind="firstName"></span></p>
 
</div>

//或
<div ng-app="" ng-init="names=['Jani','Hege','Kai']">
  <p>使用 ng-repeat 来循环数组</p>
  <ul>
    <li ng-repeat="x in names">
      {{ x }}
    </li>
  </ul>
</div>

//自定义指令
<body ng-app="myApp">

<runoob-directive></runoob-directive>

<script>
var app = angular.module("myApp", []);
app.directive("runoobDirective", function() {
    return {
        template : "<h1>自定义指令!</h1>"
    };
});
</script>

</body>

```



HTML5 允许扩展的（自制的）属性，以 data- 开头。
AngularJS 属性以 ng- 开头，但是您可以使用 data-ng- 来让网页对 HTML5 有效。
### AngularJS 表达式
AngularJS 表达式写在双大括号内：{{ expression }}。

AngularJS 表达式把数据绑定到 HTML，这与 ng-bind 指令有异曲同工之妙。

AngularJS 将在表达式书写的位置"输出"数据。

AngularJS 表达式 很像 JavaScript 表达式：它们可以包含文字、运算符和变量。

实例 {{ 5 + 5 }} 或 {{ firstName + " " + lastName }}

### AngularJS 应用
AngularJS 模块（Module） 定义了 AngularJS 应用。

AngularJS 控制器（Controller） 用于控制 AngularJS 应用。

ng-app指令指明了应用, ng-controller 指明了控制器。

```js
<div ng-app="myApp" ng-controller="myCtrl">
 
名: <input type="text" ng-model="firstName"><br>
姓: <input type="text" ng-model="lastName"><br>
<br>
姓名: {{firstName + " " + lastName}}
 
</div>
 
<script>
var app = angular.module('myApp', []);
app.controller('myCtrl', function($scope) {
    $scope.firstName= "John";
    $scope.lastName= "Doe";
});
</script>

```

AngularJS 模块定义应用:

AngularJS 模块
`var app = angular.module('myApp', []);`
AngularJS 控制器控制应用:

AngularJS 控制器
```js
app.controller('myCtrl', function($scope) {
    $scope.firstName= "John";
    $scope.lastName= "Doe";
});
```
在接下来的教程中你将学习到更多的应用和模块的知识。

## AngularJS 表达式
AngularJS 表达式写在双大括号内：{{ expression }}。

AngularJS 表达式把数据绑定到 HTML，这与 ng-bind 指令有异曲同工之妙。

AngularJS 将在表达式书写的位置"输出"数据。

AngularJS 表达式 很像 JavaScript 表达式：它们可以包含文字、运算符和变量。

实例 {{ 5 + 5 }} 或 {{ firstName + " " + lastName }}

## angularjs 模型



ng-model 指令用于绑定应用程序数据到 HTML 控制器(input, select, textarea)的值。

- 指令 ng-model 可以将输入域的值与AngularJS创建的变量绑定。
```html
<div ng-app="myApp" ng-controller="myCtrl">
    name : <input ng-mode="name">
</div>
<script>
    var app = angular.module('myApp',[]);
    app.controller('myCtrl',function($scope)){
        $scope.name = "John Doe";
    }
</script>
```

- 双向绑定，在修改输入域的值时， AngularJS 属性的值也将修改：

```html
<div ng-app="myApp" ng-controller="myCtrl">
    名字: <input ng-model="name">
    <h1>你输入了: {{name}}</h1>
</div>
```

- 验证用户输入：
```html
<form ng-app="" name="myForm">
    email: <input type="email" name="myAddress" ng-model="text">
    <span ng-show="myForm.myAddress.$error.email">It is a illegal email address</span>
</form>
```
以上实例中，提示信息会在 ng-show 属性返回 true 的情况下显示。

- 应用状态：ng-model 指令可以为应用数据提供状态值(invalid, dirty, touched, error):

```htm
<form ng-app="" name="myForm" ng-init="myText = 'test@runoob.com'">
 
Email:
<input type="email" name="myAddress" ng-model="myText" required>
<p>编辑邮箱地址，查看状态的改变。</p>
<h1>状态</h1>
<p>Valid: {{myForm.myAddress.$valid}} (如果输入的值是合法的则为 true)。</p>
<p>Dirty: {{myForm.myAddress.$dirty}} (如果值改变则为 true)。</p>
<p>Touched: {{myForm.myAddress.$touched}} (如果通过触屏点击则为 true)。</p>
```

- CSS 类：ng-model 指令基于它们的状态为 HTML 元素提供了 CSS 类：

```html
<style>
input.ng-invalid {
    background-color: lightblue;
}
</style>
<body>

<form ng-app="" name="myForm">
    输入你的名字:
    <input name="myAddress" ng-model="text" required>
</form>
```

ng-model 指令根据表单域的状态添加/移除以下类：

ng-empty
ng-not-empty
ng-touched
ng-untouched
ng-valid
ng-invalid
ng-dirty
ng-pending
ng-pristine

## AngularJS Scope(作用域)

Scope(作用域) 是应用在 HTML (视图) 和 JavaScript (控制器)之间的纽带。

Scope 是一个对象，有可用的方法和属性。

Scope 可应用在视图和控制器上。

如何使用Scope？ 当在angularjs创建控制器时，可以讲$scope 对象当作一个参数传递：
```html
<div ng-app="myApp" ng-controller="myCtrl">
<h1>{{carname}}</h1>

</div>
<script>
var app = angular.module('myApp', []);

app.controller('myCtrl', function($scope) {
    $scope.carname = "Volvo";
});
</script>
```

### scope 概述
Angularjs应用组成：
- view 视图，即html
- model 模型，当前视图中的可用的数据
- controller 控制器，即js函数，可添加活修改属性。

scope是一个js对象，也是模型，带有属性和方法。可在view和controller中使用。

```html
<div ng-app="myApp" ng-controller="myCtrl">
    <input ng-model="name">
    <h1>{{greeting}}</h1>
    <button ng-click='sayHello()'>点我</button>    
</div>
 
<script>
var app = angular.module('myApp', []);
app.controller('myCtrl', function($scope) {
    $scope.name = "Runoob";
    $scope.sayHello = function() {
        $scope.greeting = 'Hello ' + $scope.name + '!';
    };
});
</script>
```

### scope 作用范围
这一点很重要。大型项目中，html dom有很多作用域，这时需要指导使用的scope对应哪个作用域。

### 根作用域
所有的应用都有一个`$rootScope`，他可以作用在ng-app指令包含的所有html元素中。

`$rootScope` 可作用于整个应用中，是各个controller中scope的桥梁。用rootscope定义的值，可以在各个controller中使用。

```html
<div ng-app="myApp" ng-controller="myCtrl">

<h1>{{lastname}} 家族成员:</h1>

<ul>
    <li ng-repeat="x in names">{{x}} {{lastname}}</li>
</ul>

</div>

<script>
  var app = angular.module('myApp', []);

  app.controller('myCtrl', function($scope, $rootScope) {
      $scope.names = ["Emil", "Tobias", "Linus"];
      $rootScope.lastname = "Refsnes";
  });
</script>
```

## angularjs 控制器
控制器控制angularjs应用程序的数据。AngularJS 控制器是常规的 JavaScript 对象。

AngularJS 应用程序被控制器控制。

ng-controller 指令定义了应用程序控制器。

控制器是 JavaScript 对象，由标准的 JavaScript 对象的构造函数 创建。

```html
<div ng-app="myApp" ng-controller="myCtrl">

名: <input type="text" ng-model="firstName"><br>
姓: <input type="text" ng-model="lastName"><br>
<br>
姓名: {{firstName + " " + lastName}}

</div>

<script>
var app = angular.module('myApp', []);
app.controller('myCtrl', function($scope) {
    $scope.firstName = "John";
    $scope.lastName = "Doe";
});
</script>
```

应用解析：

AngularJS 应用程序由 ng-app 定义。应用程序在 `<div>` 内运行。

ng-controller="myCtrl" 属性是一个 AngularJS 指令。用于定义一个控制器。

myCtrl 函数是一个 JavaScript 函数。

AngularJS 使用$scope 对象来调用控制器。

在 AngularJS 中， $scope 是一个应用对象(属于应用变量和函数)。

控制器的 $scope （相当于作用域、控制范围）用来保存AngularJS Model(模型)的对象。

控制器在作用域中创建了两个属性 (firstName 和 lastName)。

ng-model 指令绑定输入域到控制器的属性（firstName 和 lastName）。

### controller 方法

```html
<div ng-app="myApp" ng-controller="personCtrl">

名: <input type="text" ng-model="firstName"><br>
姓: <input type="text" ng-model="lastName"><br>
<br>
姓名: {{fullName()}}

</div>

<script>
var app = angular.module('myApp', []);
app.controller('personCtrl', function($scope) {
    $scope.firstName = "John";
    $scope.lastName = "Doe";
    $scope.fullName = function() {
        return $scope.firstName + " " + $scope.lastName;
    }
});
</script>
```

### 外部文件中的控制器
在大型的应用程序中，通常是把控制器存储在外部文件中。

只需要把 `<script>` 标签中的代码复制到名为 personController.js 的外部文件中即可：

```html
<div ng-app="myApp" ng-controller="personCtrl">

First Name: <input type="text" ng-model="firstName"><br>
Last Name: <input type="text" ng-model="lastName"><br>
<br>
Full Name: {{firstName + " " + lastName}}

</div>

<script src="personController.js"></script>

```

## AngularJS 过滤器

过滤器可以使用一个管道字符`|` 添加到表达式和指令中。

Angular 过滤器：
- currency 格式化数字为货币格式
- filter 从数组项中选择一个子集
- lowercase 格式化字符串为小写
- orderBy 根据某个表达式排列数组
- uppercase 格式化字符串为大写。

### 表达式中添加过滤器
过滤器可以通过一个管道字符（|）和一个过滤器添加到表达式中。.

(下面的两个实例，我们将使用前面章节中提到的 person 控制器)

uppercase 过滤器将字符串格式化为大写：
```html
<div ng-app="myApp" ng-controller="personCtrl">

<p>姓名为 {{ lastName | uppercase }}</p>

</div>
```

```html
<div ng-app="myApp" ng-controller="costCtrl">

<input type="number" ng-model="quantity">
<input type="number" ng-model="price">

<p>总价 = {{ (quantity * price) | currency }}</p>

</div>

```

### 向指令添加过滤器
过滤器可以通过一个管道字符（|）和一个过滤器添加到指令中。

orderBy 过滤器根据表达式排列数组：
```html
<div ng-app="myApp" ng-controller="namesCtrl">

<ul>
  <li ng-repeat="x in names | orderBy:'country'">
    {{ x.name + ', ' + x.country }}
  </li>
</ul>

</div>
```
### 过滤输入
输入过滤器可以通过一个管道字符（|）和一个过滤器添加到指令中，该过滤器后跟一个冒号和一个模型名称。

filter 过滤器从数组中选择一个子集：
```html
<div ng-app="myApp" ng-controller="namesCtrl">

<p><input type="text" ng-model="test"></p>

<ul>
  <li ng-repeat="x in names | filter:test | orderBy:'country'">
    {{ (x.name | uppercase) + ', ' + x.country }}
  </li>
</ul>

</div>
```

### 自定义过滤器

```js

var app = angular.module('myApp', []);
app.controller('myCtrl', function($scope) {
    $scope.msg = "Runoob";
});

app.filter('reverse', function() { //可以注入依赖
    return function(text) {
        return text.split("").reverse().join("");
    }
});

```

## AngularJS 服务 （service）
angularjs中可以创建自己的服务，或使用内建服务。

什么是服务？在 AngularJS 中，服务是一个函数或对象，可在你的 AngularJS 应用中使用。

AngularJS 内建了30 多个服务。
```js
var app = angular.module('myApp', []);
app.controller('customersCtrl', function($scope, $location) {
    $scope.myUrl = $location.absUrl();
});
```
注意 $location 服务是作为一个参数传递到 controller 中。如果要使用它，需要在 controller 中定义。
### 为什么使用服务?
在很多服务中，比如 $location 服务，它可以使用 DOM 中存在的对象，类似 window.location 对象，但 window.location 对象在 AngularJS 应用中有一定的局限性。

AngularJS 会一直监控应用，处理事件变化， AngularJS 使用 $location 服务比使用 window.location 对象更好。

- `$location` 服务，它可以返回当前页面的 URL 地址。
- `$http` 是 AngularJS 应用中最常用的服务。 服务向服务器发送请求，应用响应服务器传送过来的数据。

```html
<html>
<head>
<meta charset="utf-8">
<script src="https://cdn.staticfile.org/angular.js/1.4.6/angular.min.js"></script>
</head>
<body>
<div ng-app="myApp" ng-controller="myCtrl"> 

<p>欢迎信息:</p>

<h1>{{myWelcome}}</h1>

</div>

<p> $http 服务向服务器请求信息，返回的值放入变量 "myWelcome" 中。</p>
<script>
var app = angular.module('myApp',[]);
app.controller('myCtrl',function($scope,$http){
    $http.get("welcome.htm").then(function (response){
        $scope.myWelcome = response.data;
    });
});
</script>

</body>
</html>

```

- `$timeout` 服务，AngularJS `$timeout` 服务对应了 JS `window.setTimeout` 函数。

```js
//两秒后显示信息:

var app = angular.module('myApp', []);
app.controller('myCtrl', function($scope, $timeout) {
    $scope.myHeader = "Hello World!";
    $timeout(function () {
        $scope.myHeader = "How are you today?";
    }, 2000);
});
```

- `$interval` 服务: AngularJS `$interval` 服务对应了 JS window.setInterval 函数。

```js
var app = angular.module('myApp', []);
app.controller('myCtrl', function($scope, $interval) {
    $scope.theTime = new Date().toLocaleTimeString();
    $interval(function () {
        $scope.theTime = new Date().toLocaleTimeString();
    }, 1000);
});
```

### 创建自定义服务
你可以创建自定义服务，链接到你的模块中：

创建名为hexafy 的服务:
```js
app.service('hexafy', function() {
    this.myFunc = function (x) {
        return x.toString(16);
    }
});
```
要使用自定义服务，需要在定义控制器的时候独立添加，设置依赖关系:

实例
使用自定义的的服务 hexafy 将一个数字转换为16进制数:
```js
app.controller('myCtrl', function($scope, hexafy) {
    $scope.hex = hexafy.myFunc(255);
});
```

### 过滤器中，使用自定义服务
当你创建了自定义服务，并连接到你的应用上后，你可以在控制器，指令，过滤器或其他服务中使用它。

在过滤器 myFormat 中使用服务 hexafy:
```js
app.filter('myFormat',['hexafy', function(hexafy) {
    return function(x) {
        return hexafy.myFunc(x);
    };
}]);
```
尝试一下在对象数组中获取值时你可以使用过滤器：

创建服务 hexafy:
```html
<ul>
<li ng-repeat="x in counts">{{x | myFormat}}</li>
</ul>
```

## AngularJS XMLHttpRequest

`$http` 是 angularjs 的一个核心服务，用于读取远程服务器的数据。

```js

// 简单的 GET 请求，可以改为 POST
$http({
    method: 'GET',
    url: '/someUrl'
}).then(function successCallback(response) {
        // 请求成功执行代码
    }, function errorCallback(response) {
        // 请求失败执行代码
});
```

简写方法：
```js
$http.get('/someUrl',config).then(successCallback,errorCallback);

$http.post('/someUrl',data,config).then(successCallback,errorCallback);
```
此外还有以下简写方法：
```
$http.get
$http.head
$http.post
$http.put
$http.delete
$http.jsonp
$http.patch
```

### 读取 JSON 文件

以下是存储在web服务器上的json文件：
https://www.runoob.com/try/angularjs/data/sites.php
```json

{
    "sites": [
        {
            "Name": "菜鸟教程",
            "Url": "www.runoob.com",
            "Country": "CN"
        },
        {
            "Name": "Google",
            "Url": "www.google.com",
            "Country": "USA"
        },
        {
            "Name": "Facebook",
            "Url": "www.facebook.com",
            "Country": "USA"
        },
        {
            "Name": "微博",
            "Url": "www.weibo.com",
            "Country": "CN"
        }
    ]
}
```

通用方法实例:

```js
var app= angular.module('myApp',[]);
app.controller('myCtrl',function($scope,$http){
    $http({method:'GET',
    url:'https://www.runoob.com/try/angularjs/data/sites.php'}).then(function successCallback(response){
        $scope.names = response.data.sites;
    }, function errorCallback(response){
        //some error handle code.
    })
})
```

## angularjs seclect 
AngularJS 可以使用数组或对象创建一个下拉列表选项。

选择框

### 使用 ng-options 创建选择框
在 AngularJS 中我们可以使用 ng-option 指令来创建一个下拉列表，列表项通过对象和数组循环输出，如下实例:

```html
<div ng-app="myApp" ng-controller="myCtrl">
 
<select ng-init="selectedName = names[0]" ng-model="selectedName" ng-options="x for x in names">
</select>
 
</div>
 
<script>
var app = angular.module('myApp', []);
app.controller('myCtrl', function($scope) {
    $scope.names = ["Google", "Runoob", "Taobao"];
});
</script>


```

## AngularJS 模块

模块定义了一个应用程序，踏实应用程序中不同部分的容器。
模块是应用控制器的容器。控制器通常属于一个模块。

常用angular.module创建模块：
```html
<div ng-app="myApp">

    </div>

<script>
    var app = angualr.module("myApp",[]);
</script>
```
myApp 参数对应了执行应用的html元素。
可以在angularjs应用中添加控制器，指令，过滤器。

### 添加控制器
```
app.controller("myCtrl",function($scope){
    $scope.firstName = "John";
    $scope.lastName = "Doe";
});
```

### 添加指令
```html
<div ng-app="myApp" runoob-directive></div>

<script>

var app = angular.module("myApp", []);

app.directive("runoobDirective", function() {
    return {
        template : "我在指令构造器中创建!"
    };
});
</script>
```

### 模块和控制器包含在 JS 文件中
通常 AngularJS 应用程序将模块和控制器包含在 JavaScript 文件中。

在以下实例中， "myApp.js" 包含了应用模块的定义程序， "myCtrl.js" 文件包含了控制器：

AngularJS 实例
```html
<!DOCTYPE html>
<html>
<script src="http://apps.bdimg.com/libs/angular.js/1.4.6/angular.min.js"></script>
<body>

<div ng-app="myApp" ng-controller="myCtrl">
{{ firstName + " " + lastName }}
</div>

<script src="myApp.js"></script>
<script src="myCtrl.js"></script>

</body>
</html>
```

在模块定义中 [] 参数用于定义模块的依赖关系。
中括号[]表示该模块没有依赖，如果有依赖的话会在中括号写上依赖的模块名字。

### 函数会影响到全局命名空间
JavaScript 中应避免使用全局函数。因为他们很容易被其他脚本文件覆盖。

AngularJS 模块让所有函数的作用域在该模块下，避免了该问题。

### 什么时候载入库?
对于 HTML 应用程序，通常建议把所有的脚本都放置在 `<body>` 元素的最底部。

这会提高网页加载速度，因为 HTML 加载不受制于脚本加载。

在我们的多个 AngularJS 实例中，您将看到 AngularJS 库是在文档的 `<head> `区域被加载。

在我们的实例中，AngularJS 在 `<head> `元素中被加载，因为对 angular.module 的调用只能在库加载完成后才能进行。

另一个解决方案是在 `<body>` 元素中加载 AngularJS 库，但是必须放置在您的 AngularJS 脚本前面：

## angularJS API

### angualrjs 全局 api
全局api用于执行常见任务的js函数集合，如：
- 比较对象
- 迭代对象
- 转换对象

全局api函数使用angular对象进行访问。

angular.lowercase (<angular1.7）
angular.$$lowercase()（angular1.7+）	转换字符串为小写
angular.uppercase() (<angular1.7）
angular.$$uppercase()（angular1.7+）	转换字符串为大写
angular.isString()	判断给定的对象是否为字符串，如果是返回 true。
angular.isNumber()	判断给定的对象是否为数字，如果是返回 true。

```html
<div ng-app="myApp" ng-controller="myCtrl">
<p>{{ x1 }}</p>
<p>{{ x2 }}</p>
</div>
 
<script>
var app = angular.module('myApp', []);
app.controller('myCtrl', function($scope) {
    $scope.x1 = "RUNOOB";
    $scope.x2 = angular.$$lowercase($scope.x1);
});
</script>
```

## angularjs bootstrap
AngularJS 的首选样式表是 Twitter Bootstrap， Twitter Bootstrap 是目前最受欢迎的前端框架。

Bootstrap
你可以在你的 AngularJS 应用中加入 Twitter Bootstrap，你可以在你的 `<head>`元素中添加如下代码:
```
<link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/bootstrap/3.3.4/css/bootstrap.min.css">
```
如果站点在国内，建议使用百度静态资源库的Bootstrap，代码如下：
```
<link rel="st`lesheet" href="//apps.bdimg.com/libs/bootstrap/3.3.4/css/bootstrap.min.css">
```
以下是一个完整的 HTML 实例, 使用了 AngularJS 指令和 Bootstrap 类。

```html
<!DOCTYPE html>
<html>
<link rel="stylesheet" href="http://apps.bdimg.com/libs/bootstrap/3.3.4/css/bootstrap.min.css">
<script src="http://apps.bdimg.com/libs/angular.js/1.4.6/angular.min.js"></script>
<body ng-app="myApp" ng-controller="userCtrl">

<div class="container">

<h3>Users</h3>

<table class="table table-striped">
  <thead><tr>
    <th>Edit</th>
    <th>First Name</th>
    <th>Last Name</th>
  </tr></thead>
  <tbody><tr ng-repeat="user in users">
    <td>
      <button class="btn" ng-click="editUser(user.id)">
      <span class="glyphicon glyphicon-pencil"></span>&nbsp;&nbsp;Edit
      </button>
    </td>
    <td>{{ user.fName }}</td>
    <td>{{ user.lName }}</td>
  </tr></tbody>
</table>

<hr>
<button class="btn btn-success" ng-click="editUser('new')">
  <span class="glyphicon glyphicon-user"></span> Create New User
</button>
<hr>

<h3 ng-show="edit">Create New User:</h3>
<h3 ng-hide="edit">Edit User:</h3>

<form class="form-horizontal">
<div class="form-group">
  <label class="col-sm-2 control-label">First Name:</label>
  <div class="col-sm-10">
    <input type="text" ng-model="fName" ng-disabled="!edit" placeholder="First Name">
  </div>
</div>
<div class="form-group">
  <label class="col-sm-2 control-label">Last Name:</label>
  <div class="col-sm-10">
    <input type="text" ng-model="lName" ng-disabled="!edit" placeholder="Last Name">
  </div>
</div>
<div class="form-group">
  <label class="col-sm-2 control-label">Password:</label>
  <div class="col-sm-10">
    <input type="password" ng-model="passw1" placeholder="Password">
  </div>
</div>
<div class="form-group">
  <label class="col-sm-2 control-label">Repeat:</label>
  <div class="col-sm-10">
    <input type="password" ng-model="passw2" placeholder="Repeat Password">
  </div>
</div>
</form>

<hr>
<button class="btn btn-success" ng-disabled="error || incomplete">
  <span class="glyphicon glyphicon-save"></span> Save Changes
</button>
</div>

<script src = "myUsers.js"></script>
</body>
</html>
```

### Bootstrap 类解析
```
元素	Bootstrap 类	定义
<div>	container	内容容器
<table>	table	表格
<table>	table-striped	带条纹背景的表格
<button>	btn	按钮
<button>	btn-success	成功按钮
<span>	glyphicon	字形图标
<span>	glyphicon-pencil	铅笔图标
<span>	glyphicon-user	用户图标
<span>	glyphicon-save	保存图标
<form>	form-horizontal	水平表格
<div>	form-group	表单组
<label>	control-label	控制器标签
<label>	col-sm-2	跨越 2 列
<div>	col-sm-10	跨越 10 列
```

## AngularJS 依赖注入
什么是依赖注入
wiki 上的解释是：依赖注入（Dependency Injection，简称DI）是一种软件设计模式，在这种模式下，一个或更多的依赖（或服务）被注入（或者通过引用传递）到一个独立的对象（或客户端）中，然后成为了该客户端状态的一部分。

该模式分离了客户端依赖本身行为的创建，这使得程序设计变得松耦合，并遵循了依赖反转和单一职责原则。与服务定位器模式形成直接对比的是，它允许客户端了解客户端如何使用该系统找到依赖

一句话 --- 没事你不要来找我，有事我会去找你。

AngularJS 提供很好的依赖注入机制。以下5个核心组件用来作为依赖注入：

### value 
一个简单js对象，用于向控制器传递值（配置阶段）
  
```js
// 定义一个模块
var mainApp = angular.module("mainApp", []);

// 创建 value 对象 "defaultInput" 并传递数据
mainApp.value("defaultInput", 5);
...

// 将 "defaultInput" 注入到控制器
mainApp.controller('CalcController', function($scope, CalcService, defaultInput) {
   $scope.number = defaultInput;
   $scope.result = CalcService.square($scope.number);
   
   $scope.square = function() {
      $scope.result = CalcService.square($scope.number);
   }
});
```

### factory
一个函数，用于返回 值。在service和controller需要时创建。通常使用factory函数来计算或返回值

```js
// 定义一个模块
var mainApp = angular.module("mainApp", []);

// 创建 factory "MathService" 用于两数的乘积 provides a method multiply to return multiplication of two numbers
mainApp.factory('MathService', function() {
   var factory = {};
   
   factory.multiply = function(a, b) {
      return a * b
   }
   return factory;
}); 

// 在 service 中注入 factory "MathService"
mainApp.service('CalcService', function(MathService){
   this.square = function(a) {
      return MathService.multiply(a,a);
   }
});
...
```

### service



### provider

angularjs通过provider创建一个service 、 factory等（配置阶段）。
provider中提供了一个factory 方法 get()，它用于返回 value/service/factory.
```js
// 定义一个模块
var mainApp = angular.module("mainApp", []);
...

// 使用 provider 创建 service 定义一个方法用于计算两数乘积
mainApp.config(function($provide) {
   $provide.provider('MathService', function() {
      this.$get = function() {
         var factory = {};  
         
         factory.multiply = function(a, b) {
            return a * b; 
         }
         return factory;
      };
   });
});
```
### constant
constant(常量)用来在配置阶段传递数值，注意这个常量在配置阶段是不可用的。

mainApp.constant("configParam", "constant value");

```js
var mainApp = angular.module("mainApp", []);
mainApp.value("defaultInput", 5);
 
mainApp.factory('MathService', function() {
    var factory = {};
 
    factory.multiply = function(a, b) {
        return a * b;
    }
    return factory;
});
 
mainApp.service('CalcService', function(MathService){
    this.square = function(a) {
        return MathService.multiply(a,a);
    }
});
 
mainApp.controller('CalcController', function($scope, CalcService, defaultInput) {
    $scope.number = defaultInput;
    $scope.result = CalcService.square($scope.number);
 
    $scope.square = function() {
        $scope.result = CalcService.square($scope.number);
    }
});
```

## AngularJS 路由
本章节我们将为大家介绍 AngularJS 路由。

AngularJS 路由允许我们通过不同的 URL 访问不同的内容。

通过 AngularJS 可以实现多视图的单页 Web 应用（single page web application，SPA）。

通常我们的 URL 形式为 http://runoob.com/first/page，但在单页 Web 应用中 AngularJS 通过 #! + 标记 实现，例如：

```html
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>AngularJS 路由实例 - 菜鸟教程</title>
<script src="https://cdn.bootcss.com/angular.js/1.7.0/angular.min.js"></script>
<script src="https://cdn.bootcss.com/angular.js/1.7.0/angular-route.min.js"></script>
</head>
<body ng-app='routingDemoApp'>
 
    <h2>AngularJS 路由应用</h2>
    <ul>
        <li><a href="#!/">首页</a></li>
        <li><a href="#!/computers">电脑</a></li>
        <li><a href="#!/printers">打印机</a></li>
        <li><a href="#!/blabla">其他</a></li>
    </ul>
     
    <div ng-view></div>
    <script>
        angular.module('routingDemoApp',['ngRoute'])
        .config(['$routeProvider', function($routeProvider){
            $routeProvider
            .when('/',{template:'这是首页页面'})
            .when('/computers',{template:'这是电脑分类页面'})
            .when('/printers',{template:'这是打印机页面'})
            .otherwise({redirectTo:'/'});
        }]);
    </script>
</body>
</html>
```

实例解析：

1、载入了实现路由的 js 文件：angular-route.js。

2、包含了 ngRoute 模块作为主应用模块的依赖模块。

`angular.module('routingDemoApp',['ngRoute'])`
3、使用 ngView 指令。

`<div ng-view></div>`
该 div 内的 HTML 内容会根据路由的变化而变化。

4、配置 $routeProvider，AngularJS $routeProvider 用来定义路由规则。
```
module.config(['$routeProvider', function($routeProvider){
    $routeProvider
        .when('/',{template:'这是首页页面'})
        .when('/computers',{template:'这是电脑分类页面'})
        .when('/printers',{template:'这是打印机页面'})
        .otherwise({redirectTo:'/'});
}]);
```

AngularJS 模块的 config 函数用于配置路由规则。通过使用 configAPI，我们请求把$routeProvider注入到我们的配置函数并且使用$routeProvider.whenAPI来定义我们的路由规则。

`$routeProvider `为我们提供了 when(path,object) & otherwise(object) 函数按顺序定义所有路由，函数包含两个参数:

第一个参数是 URL 或者 URL 正则规则。
第二个参数是路由配置对象。

### 路由设置对象
AngularJS 路由也可以通过不同的模板来实现。

`$routeProvider.when `函数的第一个参数是 URL 或者 URL 正则规则，第二个参数为路由配置对象。
路由配置对象语法规则如下：
```
$routeProvider.when(url, {
    template: string,
    templateUrl: string,
    controller: string, function 或 array,
    controllerAs: string,
    redirectTo: string, function,
    resolve: object<key, function>
});
```
参数说明：

- template:

如果我们只需要在 ng-view 中插入简单的 HTML 内容，则使用该参数：

`.when('/computers',{template:'这是电脑分类页面'})

- templateUrl:`

如果我们只需要在 ng-view 中插入 HTML 模板文件，则使用该参数：

$routeProvider.when('/computers', {
    templateUrl: 'views/computers.html',
});
以上代码会从服务端获取 views/computers.html 文件内容插入到 ng-view 中。

- controller:

function、string或数组类型，在当前模板上执行的controller函数，生成新的scope。

- controllerAs:

string类型，为controller指定别名。

- redirectTo:

重定向的地址。

- resolve:

指定当前controller所依赖的其他模块。