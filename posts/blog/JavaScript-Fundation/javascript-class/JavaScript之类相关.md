---
title: 'JavaScript之类相关'
date: '2021-07-14'
excerpt: '本次学习一下JavaScript类相关的知识'
cover: '![](2022-10-28-21-35-19.png)'
tags:
  - JavaScript
---

### JavaScript 中的类 Class

类的本质是函数，是一种语法糖

```js
class User {}
console.log(typeof User) //function
```

在类中添加原型方法

```js
class User {
  constructor(name) {
    this.name = name
  }
  getName() {
    console.log(this.name)
  }
}
```

相当于

```js
function User(name) {
  this.name = name
}
User.prototype.getName = function () {
  console.log(this.name)
}
```

### 类与构造函数差异

- 构造函数中的方法都要在实例上重新创建一边，占用内存。而类是直接定义在`prototype`属性上面

- 类定义的方法不能遍历

- 类不存在变量提升

### 静态属性和方法只能通过类原型来调用

使用静态方法批量生产对象

```js
var data = [
  {
    1990: 794362.7682,
    code: 'GB',
    name: 'United Kingdom',
    change: -10,
    region: 'EU',
  },
  {
    1990: 71303.67987,
    code: 'SE',
    name: 'Sweden',
    change: -20,
    region: 'EU',
  },
]

class EU {
  constructor(data) {
    this.model = data
  }
  get change() {
    return this.model.change
  }
  static create(data) {
    // data = JSON.parse(JSON.stringify(data));
    return data.map(item => new EU(item))
  }
  static maxChange(data) {
    return data.sort((a, b) => {
      return Math.abs(b.change) - Math.abs(a.change)
    })[0]
  }
  static totalEmission(data) {
    return data.reduce((acc, cur) => {
      return acc['1990'] + cur['1990']
    })
  }
}
var EUs = EU.create(data)
```

> 静态属性和方法也是可以被继承的。
>
> 静态方法中的`this`指向的是类，而不是实例

### 访问器

`getter` 和 `setter` 可以用来管理属性，防止属性被随意修改

声明方法：方法前加`get` or `set`

```js
class User {
  constructor() {
    this.name = name
  }
  get name() {
    return this.name
  }
}
let user1 = new User('ruoyu')
//使用访问器时不需要加括号
console.log(user1.name) // 'ruoyu'
```

### 属性保护

1. 可以通过`_<name>` 命名方式来告知此属性是私有属性，但此方式只是一种公认的提示，本身并不能防止属性的修改。

2. 通过`symbol`来保护属性，比如:

   ```js
   const AGE = Symbol('age')
   class User {
     _name = 'ruoyu'
     constructor(age) {
       this[AGE] = age
     }
   }
   let user1 = new User(19)
   console.log(user1) // {_name: "ruoyu", Symbol(age): 19}
   ```

3. 通过`WeakMap()`键值对集

   ```js
   const _age = new WeakMap()
   class User {
     constructor(name) {
       this.name = name
       _age.set(this, { age: 18, password: 123 })
     }
   }
   let user1 = new User('ruoyu')
   //属性并不会暴露在外部，除非使用get访问器
   console.log(user1) // {name:'ruoyu'}
   console.log(_age) //WeakMap {User => {age:18,pasword:123}}
   ```

### `extends`继承 与`Super` 关键字

ES6 中可以使用关键字`extends`来实现继承

```js
class Parent {
  constructor(name) {
    this.name = name
  }
}
class Son extends Parent {
  constructor(name) {
    super(name)
  }
}
```

1. 子类必须在 constructor 方法中调用 super 方法，否则新建实例时会报错

2. 在子类的构造函数中，只有调用 super 之后，才可以使用 this 关键字，否则会报错，这是因为子类实例的构建是基于父类实例的，只有 super 方法才能调用父类实例。

3. ES6 的继承机制实质是先将父类实例对象的属性和方法加到 this 上面（所以必须先调用 super 方法），然后再用子类的构造函数修改 this。

4. Object.getPrototypeOf（）方法可以用来从子类上获取父类，可以使用这个方法判断一个类是否继承了另一个类

super 一直指向当前对象, 在继承关系中，如果想要使用父类中的属性方法，可以使用`super`关键字来指向当前对象。

下面通过普通方法来模拟`super`

```js
let user = {
  name: 'user',
  show() {
    return this.name
  },
}
let spawn = {
  __proto__: user,
  name: 'spawn',
  show() {
    return this.__proto__.show.call(this)
  },
}
console.log(spwan.show()) // 'spawn'
```

`super`关键词相当于一颗语法糖

```js
//上述代码中spwan中的show方法可以简写成：
show(){
	return super.show();
}
```

**Note**: `super`关键词只能在类或对象的方法中使用

在继承父类构造者中，可以使用`super()`方法来调用父类中的构造函数.

```js
class Parent {
  constructor(name) {
    this.name = name
  }
}
class Son extends Parent {
  constructor(name) {
    super(name)
  }
}
```

原理剖析:

```js
function Parent(name) {
  this.name = name
}
function Son(...args) {
  Parent.apply(this, args)
}
Son.prototype = Object.create(Parent.prototype)
Son.prototype.constructor = Son
```

### `new`操作符发生了什么事情

1. 创建一个空对象
2. 将构造函数的作用域赋值给新对象
3. 执行构造函数中的代码（为新对象添加属性）
4. 返回新对象
