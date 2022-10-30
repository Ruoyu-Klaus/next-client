---
title: 'JavaScript之对象相关'
date: '2021-07-12'
excerpt: '本次学习一下JavaScript之对象相关'
cover: '![](2022-10-28-21-33-04.png)'
tags:
  - JavaScript
---

### 前言

> JavaScript 中有八种数据类型。有七种原始类型. 对象和函数、数组一样是引用类型，即复制只会复制引用地址

```js
let obj1 = { name: 'wang' }
let obj2 = obj1
console.log(obj1 === obj2) //true
```

### 对象的解构

```js
// Object Deconstruction
let web = { name: 'wang', age: 22 }
//把name赋值给变量w
let { name: w, gender = 'male' } = web
console.log(w) //'wang'

// Rest parameters 展开语法
let web_new = { ...web, gender: 'male', name: 'zhu' }
console.log(web_new)
console.log(web)

// Object Deconstruction for function
function createElement(option = {}) {
  //若右值不为空则取右值即参数option对象
  //默认option为空对象，因此取默认赋值
  let {
    width = 200,
    height = 200,
    backgroundColor = 'red',
    parentElement = 'body',
  } = option
  const div = document.createElement('div')
  const container = document.querySelector(parentElement)
  div.style.width = width + 'px'
  div.style.height = height + 'px'
  div.style.backgroundColor = backgroundColor
  container.appendChild(div)
}
createElement({ backgroundColor: 'blue' })
```

### 对象值类型转换

- 如果声明需要字符串类型，调用顺序为 `toString > valueOf`
- 如果场景需要数值类型，调用顺序为 `valueOf > toString`
- 声明不确定时使用 `default` ，大部分对象的 `default` 会当数值使用

```js
//在对象内部自定义转换
let obj = {
  name: 'string',
  num: 1,
  valueOf: function () {
    console.log('valueOf')
    return this.num
  },
  toString: function () {
    console.log('toString')
    return this.name
  },
}
console.log(obj + 1) //valueOf    2
console.log('this is ' + obj) //toString   this is string
```

### 检测属性

`hasOwnProperty`检测对象自身是否包含指定的属性，不检测原型链上继承的属性。

```js
let obj = { name: 'wangruoyu' }
console.log(obj.hasOwnProperty('name')) //true
```

使用`in`可以检测原型链上继承的属性

```js
let obj1 = { name: 'wangruoyu' }
let obj2 = {
  age: 18,
}

//设置obj2为obj1的新原型
Object.setPrototypeOf(obj1, obj2)
console.log(obj1) // {name:'wangruoyu'}

console.log('age' in obj1) //true
console.log(obj1.hasOwnProperty('age')) //false
```

### Object.assign 右侧合并

```js
// Object assign
function createElement_2(params) {
  let options = {
    width: 200,
    height: 200,
    backgroundColor: 'red',
    parentElement: 'body',
  }
  //偏向右侧的合并 类似于sql中的RIGHT JOIN
  options = Object.assign(options, params)
  return JSON.stringify(options, null, 2)
}
console.log(createElement_2({ width: 400 }))
```

### 对象的拷贝

由于对象是引用类型，因此直接复制操作实质是复制 reference 而不是值

下面通过几种方法来实现深浅拷贝：

#### Light-weight copy

```js
// Duplicate object by for in
let obj = { name: 'wangruoyu' }
function copyObj(obj) {
  let newObj = {}
  for (const key in obj) {
    newObj[key] = obj[key]
  }
  return newObj
}

// Duplicate object by assign
function copyObject(obj) {
  let newObj = Object.assign({}, obj)
  return newObj
}

// Duplicate object by rest parameter
var copyWeb = { ...web }
```

#### Deep Duplication

```js
// Duplicate for Mutiple Deep Object
let deepObj = {
  user: 'wang',
  info: {
    age: 22,
    gender: 'male',
  },
  arr: [10, 20, 30, 40, 50],
}
//对于复杂结构的对象，浅拷贝方式会有问题
//像info,arr键中的值仍共享一个内存地址,如果变更则彼此都受牵连

var copyDeepObj = {}
for (let key in deepObj) {
  copyDeepObj[key] = deepObj[key]
}
copyDeepObj.arr[0] = 0
console.log(copyDeepObj.arr) // [0,20,30,40,50]
console.log(deepObj.arr) //[0,20,30,40,50]

//利用函数递归进行对象深拷贝
function copyDeepObject(deepObj) {
  var newObj = deepObj instanceof Array ? [] : {}
  for (const key in deepObj) {
    newObj[key] =
      typeof deepObj[key] == 'object'
        ? copyDeepObject(deepObj[key])
        : deepObj[key]
  }
  return newObj
}
```

### 属性封装和保护

#### 利用闭包保护属性

```js
function Infor(name, age) {
  let data = { name, age }
  this.getAge = function () {
    return data.age
  }
}
let std = new Infor('wang', 19)
console.log(std.getAge()) // 19
```

#### 获取/修改属性特征

| Attributes   | Description                                                                                                                              | Default   |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------- | --------- |
| configurable | whether can use delete property, change property attributes,edit getter or setter                                                        | true      |
| enumerable   | if this property shows up during enumeration of the properties on the corresponding object. Such as for/in, for/of or Object.keys() etc. | true      |
| writable     | whether the property can be changed                                                                                                      | true      |
| value        | The value associated with the property                                                                                                   | undefined |

```js
const a = {
  name: 'wang',
  age: 20,
}
// Get property
var property = JSON.stringify(Object.getOwnPropertyDescriptors(a), null, 2)
// Edit property
Object.defineProperty(a, 'age', {
  value: '22',
  writable: false,
  enumerable: false,
  configurable: false,
})
// Mutiple editing
Object.defineProperties(b, {
  name: {
    value: 'wang',
    writable: false,
    enumerable: false,
    configurable: false,
  },
  age: {
    writable: false,
    enumerable: false,
    configurable: false,
  },
})

// Prevent adding a new property to the Object
Object.preventExtensions(a)
console.log(Object.isExtensible(a)) //false

// Seal Object (unabele to 'add,delete,redefine' properties)
Object.seal(a)
console.log(Object.isSealed(a)) // true

// Freeze Object(unabele to 'add,delete,redefine,enumerate')
Object.freeze(a)
console.log(Object.isFrozen(a)) // true
```

#### 访问器 getter & setter

属性只能在访问器和普通属性任选其一，不能共同存在

```js
// Use set/get syntax to protect data
var setData = {
  data: { name: 'wang', age: 19 },
  set age(age) {
    if (typeof age !== 'number' || age < 1 || age > 100) {
      throw new Error('wrong type of age')
    } else {
      return (this.data.age = age)
    }
  },
  get age() {
    return this.data.age
  },
}
setData.age = 10
console.log(setData.age) //10
```

利用访问器来储存和获取 token into localStorage

```js
// token in localStorage
let Request = {
  set token(content) {
    localStorage.setItem('token', content)
  },
  get token() {
    var token = localStorage.getItem('token')
    if (!token) {
      alert('please, log in ')
    }
    return token
  },
}
Request.token = 'wwqeawdafaf'
console.log(Request.token) //'wwqeawdafaf'
```

利用 Symbol 来是封装属性不能被外界访问，利用访问器控制可访问的数据

```js
const DATA = Symbol()
class Infor {
  constructor(name, age) {
    this[DATA] = { name, age }
  }
  get name() {
    return this[DATA].name
  }
  set name(value) {
    this.this[DATA] = value
  }
}
let ls = new Infor('wang', 18)
console.log(ls) //只能修改和访问name
```

### 代理拦截

代理（拦截器）是对象的访问控制，`setter/getter` 是对单个对象属性的控制，而代理是对整个对象的控制。

- 读写属性时代码更简洁
- 对象的多个属性控制统一交给代理完成
- 严格模式下 `set` 必须返回布尔值

```js
var gf = { name: "zuomeng",age:22 };
var proxy = new Proxy(gf, {
    get(obj, property) {
        return obj[property];
    },
    set(obj, property, value) {
        obj[property] = value;
        return true
    }
})

/proxy.name = "wang";
console.log(proxy.name) // wang
```

代理函数

```js
function factorial(num) {
  return num == 1 ? 1 : num * factorial(num - 1)
}
let func_proxy = new Proxy(factorial, {
  apply(func, obj, args) {
    console.log(func) // factorial(num){...}
    console.log(obj) //{test:"test result"}
    console.log(args) // [3]
    console.time('Time')
    var result = func.apply(obj, args)
    console.log(result) // 6
    console.timeEnd('Time')
  },
})
func_proxy.apply({ test: 'test result' }, [3])
```

利用代理截取字符串

```js
const stringDot = {
  get(target, key) {
    const title = target[key].title
    const len = 8
    return title.length > len ? title.substr(0, len) + '.'.repeat(3) : title
  },
}
const news = [
  {
    title: '这是一个伤不起的标题',
    category: '政治',
  },
  {
    title: '没有这个的标题',
    category: '社会',
  },
  {
    title: '我想成为一个独一无二的好标题',
    category: '经济',
  },
]

const stringDotProxy = new Proxy(news, stringDot)
for (let index in lessons) {
  console.log(stringDotProxy[index])
}
```

### 双向绑定

#### 利用代理绑定

```js
// Two-way-binding
function View() {
  let proxy = new Proxy(
    {},
    {
      get(obj, property) {},
      set(obj, property, value) {
        console.log(obj) // {}
        console.log(property)
        console.log(value)
        document.querySelectorAll(`[v-model ="${property}"]`).forEach(item => {
          item.value = value
        })
        document.querySelectorAll(`[v-bind ="${property}"]`).forEach(item => {
          item.innerHTML = value
        })
        return true
      },
    }
  )
  this.init = function () {
    const els = document.querySelectorAll('[v-model]')
    els.forEach(item => {
      item.addEventListener('keyup', function () {
        //使用代理压入属性与值
        proxy[this.getAttribute('v-model')] = this.value
      })
      // 清除item 避免内存泄漏
      item = null
    })
  }
}
new View().init()
```

普通类函数绑定

```js
class MutualBinding {
  constructor(property) {
    this.property = property
  }
  init() {
    document.querySelectorAll(`[v-model ="${this.property}"]`).forEach(item => {
      let self = this
      item.addEventListener('keyup', function () {
        self.binder(this.value)
      })
    })
  }
  binder(value) {
    document.querySelectorAll(`[v-model ="${this.property}"]`).forEach(item => {
      item.value = value
    })
    document.querySelectorAll(`[v-bind ="${this.property}"]`).forEach(item => {
      item.innerHTML = value
    })
  }
}
var eles = document.querySelectorAll('[v-model]')

new MutualBinding('content').init()
new MutualBinding('title').init()
```

#### 代理表单验证

```html
<style>
  body {
    padding: 50px;
    background: #34495e;
  }
  input {
    border: solid 10px #ddd;
    height: 30px;
  }
  .error {
    border: solid 10px red;
  }
</style>
<body>
  <input type="text" validate rule="max:12,min:3" />
  <input type="text" validate rule="max:3,isNumber" />
</body>
<script>
  'use strict'
  //验证处理类
  class Validate {
    max(value, len) {
      return value.length <= len
    }
    min(value, len) {
      return value.length >= len
    }
    isNumber(value) {
      return /^\d+$/.test(value)
    }
  }

  //代理工厂
  function makeProxy(target) {
    return new Proxy(target, {
      get(target, key) {
        return target[key]
      },
      set(target, key, el) {
        const rule = el.getAttribute('rule')
        const validate = new Validate()
        let state = rule.split(',').every(rule => {
          const info = rule.split(':')
          return validate[info[0]](el.value, info[1])
        })
        el.classList[state ? 'remove' : 'add']('error')
        return true
      },
    })
  }

  const nodes = makeProxy(document.querySelectorAll('[validate]'))
  nodes.forEach((item, i) => {
    item.addEventListener('keyup', function () {
      nodes[i] = this
    })
  })
</script>
```

### Conclusion

- 对象是属性和方法的集合即封装
- 将复杂功能隐藏在内部，只开放给外部少量方法，更改对象内部的复杂逻辑不会对外部调用造成影响即抽象
- 继承是通过代码复用减少冗余代码
- 根据不同形态的对象产生不同结果即多态
