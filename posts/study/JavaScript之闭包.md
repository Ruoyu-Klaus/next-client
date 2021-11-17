---
title: 'JavaScript之闭包'
date: '2021-07-06'
excerpt: 'Test is the except'
cover: 'https://i.loli.net/2021/09/14/p2ouw8QqIBxJgcU.png'
tags:
  - JavaScript
---

## 什么是 `closure`?

A **closure** is the combination of a function bundled together (enclosed) with references to its surrounding state (the **lexical environment**).

根据 MDN 的定义，闭包就是说内部函数可以访问外部函数的作用域。每一个 Javascript 函数在被创建时都会形成闭包。

```js
function makeFunc() {
  var name = 'Mozilla'
  function displayName() {
    alert(name)
  }
  return displayName
}

var myFunc = makeFunc()
myFunc()
```

正如文档所说 _A closure is the combination of a function and the lexical environment within which that function was declared._ 因此当`makeFunc函数实例话给变量`myFunc`时，其内部的`displayName` 保留了它的语法环境包括变量`name`.

## 利用闭包使变量私有化

```js
var makeCounter = function () {
  var privateCounter = 0
  function changeBy(val) {
    privateCounter += val
  }
  return {
    increment: function () {
      changeBy(1)
    },

    decrement: function () {
      changeBy(-1)
    },

    value: function () {
      return privateCounter
    },
  }
}

var counter1 = makeCounter()
var counter2 = makeCounter()

alert(counter1.value()) // 0.

counter1.increment()
counter1.increment()
alert(counter1.value()) // 2.

counter1.decrement()
alert(counter1.value()) // 1.
alert(counter2.value()) // 0.
```

上述代码中，`makeCounter`语法环境被 `increment`, `decrement`和 `value`这三个函数共享，因此他们都能访问到父级作用域。

## Closure Scope Chain

Every closure has three scopes:

- Local Scope (Own scope)
- Outer Functions Scope
- Global Scope

```js
// global scope
var e = 10
function sum(a) {
  return function (b) {
    return function (c) {
      // outer functions scope
      return function (d) {
        // local scope
        return a + b + c + d + e
      }
    }
  }
}
console.log(sum(1)(2)(3)(4)) // log 20
```

## Var, Let , Const 作用域

anonymous function 会形成闭包作用域

```js
var num = 10
;(function () {
  var num = 1
  console.log(num) //1
})()
console.log(num) //10
```

let 和 const 形成块级作用域

```js
var num = 10
function letDeclare() {
  let num = 1
  console.log(num) //1
}
console.log(num) //10
```

> ### 在 for 循环中需要注意的地方：

如下列代表，使用 var 声明变量`item`，在 for 循环中触发`onfocus`事件后执行 dosomething 所传入的参数`item.help`实际上总是最后一个`item`的值。换句话说，事件函数形成的闭包环境为最后一次循环后`item`的值. **使用 var 声明时，通过 for 循环创建的三个闭包环境共享了`setupHelp`函数包含变量`item`的作用域** .

```js
function setupHelp() {
  var helpText = [
    { id: 'email', help: 'Your e-mail address' },
    { id: 'name', help: 'Your full name' },
    { id: 'age', help: 'Your age (you must be over 16)' },
  ]

  for (var i = 0; i < helpText.length; i++) {
    var item = helpText[i]
    document.getElementById(item.id).onfocus = dosomething(item.help)
  }
}
setupHelp() // only show age help
```

### 利用闭包实例

```js
function between(a, b) {
  return function (i) {
    return i >= a && i <= b
  }
}
var data = [1, 2, 3, 4, 5, 6, 7, 8, 9]
console.log(data.filter(between(3, 6)))
```

如果变量 left 在 click 事件的回调函数中，那么每一次点击都会创建一个新的作用域，变量 left 就会又从 1 开始。

因此把变量 left 放在外部作用域中，每次点击就会只参考外部作用域中的 left

```js
let btn = document.querySelector('button')
let bind = false
let left = 1
btn.addEventListener('click', function () {
  if (!bind) {
    bind = true
    // setInterval return a mark number
    var id = setInterval(function () {
      btn.style.left = left++ + 'px'
    }, 10)
  }
})
```

## Performance considerations

It is unwise to unnecessarily create functions within other functions if closures are not needed for a particular task, as it will negatively affect script performance both in terms of processing speed and memory consumption.

闭包特性中上级作用域会为函数保存数据，从而造成内存泄漏问题

```js
let divs = document.querySelectorAll('div')
divs.forEach(function (item) {
  item.addEventListener('click', function () {
    console.log(item.getAttribute('ry')) //item数据被保留
  })
})

//通过清除不需要的数据解决内存泄漏问题
let divs = document.querySelectorAll('div')
divs.forEach(function (item) {
  let ry = item.getAttribute('ry') // 只取需要的数据
  item.addEventListener('click', function () {
    console.log(ry) //只保留ry而不是整个item的数据
  })
  item = null //清除不需要的数据
})
```

when creating a new object/class, methods should normally be associated to the object's prototype rather than defined into the object constructor, because whenever the constructor is called, the methods would get reassigned (that is, for every object creation).

```js
function MyObject(name, message) {
  this.name = name.toString()
  this.getName = function () {
    return this.name
  }
}
// getName method 可以写入构造函数的原型中，这样避免再次构造时重新分配此方法浪费资源降低性能
function MyObject(name, message) {
  this.name = name.toString()
  MyObject.prototype.getName = function () {
    return this.name
  }
}
```

## Conclusion

- 全局环境变量不会被回收，能渗透到函数里（JS 特性）
- JS 中的所有函数都是闭包
- 只要函数被使用，同作用域下的数据就会被保留【包括构造函数】
- 块级作用域（let，const）全局作用域（var)
- 使用 var 声明时，通过 for 循环创建的闭包环境共享了父级函数同一个作用域，而使用 let 和 const 时每一个闭包则访问独立的块级变量
- 避免不必要的嵌套函数闭包
