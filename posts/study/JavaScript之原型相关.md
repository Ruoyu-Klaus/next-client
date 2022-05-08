---
title: 'JavaScript之原型相关'
date: '2021-07-17'
excerpt: '本次来学习一下JavaScript之原型相关。所有对象都是对象的实例'
cover: 'https://i.loli.net/2021/10/08/u4L25SBVMs1jQU9.png'
tags:
  - JavaScript
---

## JavaScript: 所有对象都是对象的实例

> JavaScript only has one construct: objects. ----MDN

### 什么是原型链？

> When trying to access a property of an object, **the property will not only be sought on the object but on the prototype of the object,** the prototype of the prototype, and so on until either a property with a matching name is found or the end of the prototype chain is reached.

### `prototype` vs `__proto__`

```js
new Foo().__proto__ === Foo.prototype
new Foo().prototype === undefined
var b = new Foo(20)
var c = new Foo(30)
```

Constructor function Foo also has its own `__proto__` which is Function.prototype

`__proto__` is the actual object that is used in the lookup chain to resolve methods, etc. `prototype` is the object that is used to build `__proto__` when you create an object with `new`

![inherit](https://i.loli.net/2021/10/08/PXG1obNQCjERWlz.png)

**`__proto__` 不是对象属性，理解为`prototype` 的 `getter/setter` 实现，是一个非标准定义** `__proto__` 内部使用`getter/setter` 控制值，所以只允许对象或 null.

因此，可以使用 `Object.setPrototypeOf` 与`Object.getProttoeypOf` 替代 `__proto__`

## 常见操作

### 通过原型创造对象

```js 
function Foo() {
  this.show = function() {
    return "show method";
  };
}
let obj1 = new Foo();
console.log(obj1 instanceof Foo) // true

let obj2 = new obj1.constructor();
console.log(obj2 instanceof Foo) //true

let obj3 = Object.getPrototypeOf(obj1).constructor;
console.log(obj3 === Foo)  //true
```

### 设置原型链 `Object.setPrototype`

```js
let foo = {
  name: 'ruoyu',
  show() {
    return 'show method'
  },
}
let a = {}
Object.setPrototypeOf(a, foo)
console.log(a.name) // 'ruoyu'
console.log(a.show()) // 'show method'
```

上述代码中`a`利用`setPrototyoeOf`继承了`foo`对象中的方法和属性

### 原型检测

`instanceof` 检测构造函数的 `prototype` 属性是否出现在某个实例对象的原型链上.

```js
let a = new Foo()
console.log(a instanceof Foo) //true
```

`isPrototypeOf`检测一个实例对象是否在另一个实例对象的原型链中

```js
function Foo() {
  this.show = function () {
    return 'show method'
  }
}
let a = new Foo()
let b = new Foo()
Object.setPrototypeOf(a, b)
console.log(a.isPrototypeOf(b)) //false
console.log(b.isPrototypeOf(a)) //true
```

### 属性遍历

使用`in` 检测原型链上是否存在属性，使用 `hasOwnProperty` 只检测当前对象

使用 `for/in` 遍历时同时会遍历原型上的属性

### `Object.create` 使用

创建一个新对象时使用现有对象做为新对象的原型对象，第二个可选参数设置新对象的属性

```js
function Foo() {
  this.show = function () {
    return 'show method'
  }
}
let a = new Foo()
let b = Object.create(a, {
  name: { value: 'ruoyu' },
})
console.log(b) // Foo {name: "ruoyu"}
console.log(b.show()) // 'show method'
```

Conclusion:

`prototype` 构造函数的原型属性

`Object.create` 创建对象时指定原型

`Object.setPrototypeOf` 设置对象原型

### 添加原型方法避免内存占用

```js
function Foo(name) {
  this.name = name
}
Foo.prototype.getName = function () {
  return this.name
}
let a = new Foo('ruoyu')
let b = new Foo('wang')

console.log(a.getName == b.getName) //true
//
function fun(name) {
  this.name = name
  this.getName = function () {
    console.log(this.name)
  }
}
const a = new fun('a')
const b = new fun('b')

console.log(a.getName == b.getName) //false
```

使用 Objcet.assgin 给原型添加方法

```js
function Foo(name) {
  this.name = name
}
Object.assgin(Foo.prototype, {
  getName: function () {
    return this.name
  },
})
```

### 原型的继承

```js
function Foo(name) {
  this.name = name
}
Object.assign(Foo.prototype, {
  getName: function () {
    return this.name
  },
  name: 'ruoyu',
})
function Sub(age) {
  this.age = age
  this.show = function () {
    return `${this.name} is ${(this, age)} years old.`
  }
}
Sub.prototype = Object.create(Foo.prototype) //继承方法和属性
Sub.prototype.constructor = Sub //保留构建者
console.log(new Sub(18).getName()) // ruoyu
console.log(new Sub(18).show()) // ruoyu is 18 years old.
```

### 原型方法重写

```js
function Person(name) {
  this.name = name
}
Person.prototype.getName = function () {
  console.log(this.name + ' calls parent method')
}

function User(name) {
  this.name = name
}
User.prototype = Object.create(Person.prototype)
User.prototype.constructor = User
User.prototype.getName = function () {
  Person.prototype.getName.call(this) //可以调用父级同名方法
  console.log(this.name + ' calls new method') // 新方法
}
new User('ruoyu').getName()
// ruoyu calls parent method
// ruoyu calls new method
```

### call | apply 在构造函数中的应用

```js
function Foo(name) {
  this.name = name
}
function Fake(name) {
  Foo.call(this, name)
}
console.log(new Fake('ruoyu')) // {name:ruoyu}
```

## Conclusion

- 如果对象本身不存在属性或方法将到原型上查找

- 使用原型可以解决，通过构建函数创建对象时复制多个函数造成的内存占用问题

- 原型包含 `constructor` 属性，指向构造函数

- 所有函数的原型默认是 `Object`的实例，所以可以使用`toString/toValues/isPrototypeOf` 等方法的原因

- 原型中保存引用类型会造成对象共享属性，所以一般只会在原型中定义方法

- 如果对象和原型中属性重叠，则对象中的属性优先级高于原型中的属性
