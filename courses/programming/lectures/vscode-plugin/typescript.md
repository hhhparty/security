# typescript
## es6 类
```ts
class Person_es6{
    name:string;
    age:number;
    constructor(n:string,a:number){
        this.name = n;
        this.age = a;
    }
    run():void{
        console.log(this.name + " is running...(es6 version)");
    }
    getName():string{
        return this.name;
    }
    setName(n:string):void{
        this.name = n;
    }
}

let p_es6 = new Person_es6('Wo',30);
p_es6.run();
p_es6.setName('Heng');
console.log(p_es6.getName());
```

### 继承
- 需要使用extends 和 super 

```ts
class Child_es6 extends Person_es6{
    constructor(n:string,a:number){
        super(n,a);
    }
}

let c1_es6 = new Child_es6('小明名',3);
c1_es6.run();
```

### 几种种修饰符

- public：类内、子类、类外都可见
- protected：类内、子类可见；类外不可见
- private：类内可见；子类及类外不可见


- static 静态方法或属性修饰符，使用类名调用

### 多态
父类定义了方法，但不实现；子类继承后实现。

### 抽象类和抽象方法

使用 `abstract` 修饰的类和方法，必须在派生 `extends` 类中去定义。

抽象类无法直接实例化。


## es5 类

### 定义类
```ts
// 基本定义方式
.name + "在工作。。。");
}function Person(name,age){
    this.name = name;
    this.age = age;

    this.run=function(){
        alert(this.name+"跑步中...")
    }
}



//通过原型链扩展属性和方法
Person.prototype.genda = "male";
Person.prototype.work = function(){
    alert(this
//注意：原型链上的方法和属性可以在各个实例中共享



//下面是给类增加静态方法
Person.getInfo = function(){
    console.log("信息待录入...");
}

```

### 生成对象

```ts
//实例化
let p = new Person();
alert(p.name, p.age)


//实例中不能调用静态方法，只能使用类调用静态方法.
Person.getInfo();

```
### 类的继承

#### 继承方法一：对象冒充

```ts
function Male(){
    Person.call(this);//对象冒充方式继承Person
}
let m = new Male();
m.run();//继承Person中的run方法。
m.work();//此句会报错，因为对象冒充方法不能使用原型链上的方法和属性。
```
#### 继承方法二：原型链继承

```ts
function Female(){

}
//继承
Female.prototype = new Person();
//这种方式，既可以继承类定义中的方法和属性，也可以继承原型链上的方法和属性。
// 但是这种方式，不能在实例化时给父类传参数。
```
#### 继承方法三：原型链+对象冒充

```ts
function Child(name,age){
    Person.call(this,name,age);
}
Child.prototype = new Person(); 
//或 
Child.prototype = Person.prototype;

let c = new Child('小明',10);
```

这种方法既可以使用父类的参数，也可以使用原型链。


## 接口
### 使用接口定义属性
```ts

interface FullName{
    firstName:string;
    lastName:string;
}

class Person1{
    private name:FullName;
    constructor(f:string,l:string){
        // 注意下面的形式
        this.name = {firstName:f,lastName:l};
    }
    printName(){
        console.log(this.name.firstName + '--' + this.name.lastName);
    }
}
let pn = new Person1('Leo','Lee');
pn.printName();
```

