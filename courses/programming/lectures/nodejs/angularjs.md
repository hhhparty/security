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

ng-init 指令初始化 AngularJS 应用程序变量。

```js
<div ng-app="" ng-init="firstName='John'">
 
<p>姓名为 <span ng-bind="firstName"></span></p>
 
</div>
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