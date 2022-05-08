---
title: 'JavaScript中的函数'
date: '2021-07-08'
excerpt: '本次学习一下JavaScript中的函数'
cover: 'https://i.loli.net/2021/09/15/mhKaPD5AepnINB9.jpg'
tags:
  - JavaScript
---

## 函数声明与优先级

```js
//全局匿名函数
var add = function (num) {
  return --num
}

//全局标准声明
function add(num) {
  return ++num
}

//全局标准声明优先级高于赋值声明, 因此输出：2
console.log(add(3)) //2
//全局声明函数优先级会被提升，但是变量匿名函数优先级不会提升
```

## 函数参数

形参数量大于实参时，没有传参的形参值为 undefined

实参数量大于形参时，多于的实参将忽略并不会报错

在函数内部，arguments 变量为所有参数的集合

当然也可以使用 rest paramter 把参数展开

```js
let restParam = function (...args) {
  console.log(args) //为所有参数的集合
}
```

### 使用函数解析模版字符串

```js
//使用函数来解析标签字符串，第一个参数是字符串值的数组，其余的参数为标签变量。
function tepStr(str, ...values) {
  console.log(str) //["博客", ":", "", raw: Array(3)]
  console.log(values) //["王小明", "www.ruoyu.life"]
}
let name = '王小明',
  url = 'www.ruoyu.life'
tepStr`博客${name}:${url}`
```

### 利用 set：搜索记录实例

```js
function SearchList() {
  this.data = new Set()
  this.show = function () {
    let ul = document.querySelector('ul')
    ul.innerHTML = ''
    this.data.forEach(word => {
      ul.innerHTML += `<li>${word}</li>`
    })
  }
  this.keyword = function (word) {
    this.data.add(word)
  }
}
// SearchList.prototype.keyword = function(word){
//         this.data.add(word);
//     }
var sl = new SearchList()
var input = document.querySelector('[name="ry"]')
input.addEventListener('blur', function () {
  sl.keyword(this.value)
  sl.show()
})
```

## this 指向问题

```js
//使用箭头函数this寻找父级作用域的对象.
//使用普通函数this指代当前作用域的对象.
let demo = {
  age: 20,
  getAgeByArrow: () => {
    //这里this指代父级作用域也就是window
    console.log(this)
    console.log(this.age) //cannot read name
  },
  getAge: function () {
    //而这里指代当前调用它的对象
    console.log(this.age)
  },
}
// demo.getAge()
```

### DOM 事件中的 this

```js
let Dom = {
  name: 'wangruoyu',
  fakeHandler(e) {
    console.log('fake')
  },
  handleEvent(event) {
    console.log(event)
  },

  // addEventListener第二个参数若为函数，则这个函数可以传递一个event参数，event.target指代当前事件的对象.
  //自动找对象中的handleEvent方法
  event() {
    let btn = document.querySelector('button')
    btn.addEventListener('click', this)
    btn.addEventListener('click', this.fakeHandler)
  },
}
Dom.event()
```

## 利用 bind | apply | call 绑定对象

```js
// 使用call方法改变this指向，下列实例中，通过call方法，给obj对象增加了一个值为“wangruoyu”的name属性.
function User(name, age) {
  this.name = name
  this.age = age
}
let obj = { url: 'ry.com' }
//通过继承构造函数User来创建新对象
User.call(obj, 'wangruoyu', '20')
// console.log(obj)

// 使用call,apply方法会立即执行构造函数中的内容.
function User_call(arg1, arg2) {
  // console.log(this,arg1,arg2);
}
let obj2 = { url2: 'zz.com' }
User_call.call(obj2)
User_call.apply(obj2)
// call与apply的区别是在于传递参数.
// >>>call传递参数一个一个传，而apply为数组.比如：
User_call.call(obj2, 'arg1', 'arg2')
User_call.apply(obj2, ['arg1', 'arg2'])

// console.clear()
// Math.max只能一个一个传递参数，下列使用展开语法和apply方法来获取数组中的最大值.
// let arr = [1,2,4,5,6];
// let aa = Math.max(...arr);
// let bb = Math.max.apply(Math,arr)
// console.log(aa,bb)
// ------------------------------------------------
// bind方法不会立刻执行，会得到一个新的函数。
// bind 是复制函数形为会返回新函数
function BindMethod() {
  return this
}
let newA = BindMethod.bind(obj)
//使用bind方法将BindMethod中的this指向了obj这个对象
// console.log(newA())
```

### 利用 bind 实例

```js
//Practice
//改变目标元素背景颜色
function ChangeColor(ele) {
  this.ele = ele
  this.color = function () {
    let colorSets = []
    for (var i = 0; i <= 2; i++) {
      colorSets.push(Math.floor(Math.random() * 255))
    }
    return colorSets.join(',')
  }
  this.run = function () {
    setInterval(
      function () {
        let color = `rgb(${this.color()})`
        this.ele.style.backgroundColor = color
      }.bind(this),
      2000
    ) //利用bind把对象绑定到setinterval作用域中
  }
}
let body = new ChangeColor(document.body)
body.run()
```
