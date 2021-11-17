---
title: 'JavaScript之DOM相关'
date: '2021-07-11'
excerpt: '本次学习一下JavaScript之DOM相关'
cover: 'https://i.loli.net/2021/09/14/1M3ApqhxBTwgHjV.jpg'
tags:
  - JavaScript
---

### getElementsByTagName 与 querySelectorAll 的区别

- 使用 getElementsByTagName 返回的都是动态的集合
- 使用 querySelectorAll 返回的是静态集合

动态集合就是说当 DOM 节点发生改变之后，getElementsByTagName 所获取的结果也会随着着选取该节点的变化而变化。而 querySelectorAll 则相反。

```javascript
;<body>
  <div></div>
  <div></div>
</body>

const root = document.body

let querySelectorAll = document.querySelectorAll('div')
console.log(querySelectorAll.length) // 2
root.appendChild(document.createElement('div'))
console.log(querySelectorAll.length) //仍为2

let getElementsByTagName = document.getElementsByTagName('div')
console.log(getElementsByTagName.length) // 2
root.appendChild(document.createElement('div'))
console.log(getElementsByTagName.length) //3 每次动态添加元素都使getElementsByTagName发生了变化
```

### 获取属性 Attributes

- 使用 Attribute 操作时属性名称不区分大小写
- Attribute 值都为字符串类型，如需数值类型需要进行转换

| Method          | Des      |
| --------------- | -------- |
| getAttribute    | 获取属性 |
| setAttribute    | 设置属性 |
| removeAttribute | 删除属性 |
| hasAttribute    | 属性检测 |

Note: 大部分情况下可以通过属性该更改并可同步到特征集中。但是像 input 中的 value 属性需要通过特征方法如`setAttribute`更改可同步到特征集中。

```html
<input type="text" name="login" value="secret" />
<script>
  const login = document.querySelector(`[name='login']`)
  login.value = '12345'
  console.log(login.getAttribute('value')) // 'secret'
  //---------------------------------------------------
  login.setAttribute('value', '12345')
  console.log(login.value) // '12345'
</script>
```

#### 自定义属性

为避免属性重名，JS 提供了 dataset 接口，为属性添加 data-前缀

```html
<body>
  <h1 data-color="red">Hello world</h1>
</body>
<script>
  const h1 = document.querySelector('h1')
  console.log(h1.dataset.color) // 'red'
</script>
```

### 创建节点

通过 promise 加载 js/css 文件：

```js
function js(file) {
  return new Promise((resolve, reject) => {
    let js = document.createElement('script')
    js.type = 'text/javascript'
    js.src = file
    js.onload = resolve
    js.onerror = reject
    document.head.appendChild(js)
  })
}
function css(file) {
  return new Promise((resolve, reject) => {
    let css = document.createElement('link')
    css.rel = 'stylesheet'
    css.href = file
    css.onload = resolve
    css.onerror = reject
    document.head.appendChild(css)
  })
}
```

#### createDocumentFragment

```js
let fragment = document.createDocumentFragment()
```

使用 createDocumentFragment 可以创建虚拟的节点容器，不直接操作 DOM 性能更好

- 创建的节点的 parentNode 为 null
- 使用 createDocumentFragment 创建的节点来暂存文档节点
- createDocumentFragment 创建的节点添加到其他节点上时，会将子节点一并添加

```js
var element = document.getElementById('ul') // assuming ul exists
var fragment = document.createDocumentFragment()
var browsers = ['Firefox', 'Chrome', 'Opera', 'Safari', 'Internet Explorer']
browsers.forEach(function (browser) {
  var li = document.createElement('li')
  li.textContent = browser
  fragment.appendChild(li)
})
element.appendChild(fragment)

// https://developer.mozilla.org/en-US/docs/Web/API/Document/createDocumentFragment
```

#### cloneNode&importNode

使用 cloneNode 和 document.importNode 用于复制节点对象操作

cloneNode: 节点方法,参数为 true 时递归复制子节点即深拷贝.

```js
let container = document.querySelector('.container')
let newContainer = container.cloneNode(true)
```

importNode: 对象方法. 第一个参数为节点对象，第二个为 true 是递归复制. (部分 ie 浏览器不支持)

```js
let container = document.querySelector('.container')
let newContainer = document.importNode(container, true)
```

### 节点内容

#### innerHTML

inneHTML 用于向标签内添加 html 内容，同时触发浏览器的解析器重绘 DOM。会保留原标签

#### outerHTML

而 outerHTML 取代原来标签和内容反映到页面上，但在 JS 中还是保留原来的内容

### 节点管理

| Method      | Des                        |
| ----------- | -------------------------- |
| append      | 节点尾部添加新节点或字符串 |
| prepend     | 节点开始添加新节点或字符串 |
| before      | 节点前面添加新节点或字符串 |
| after       | 节点后面添加新节点或字符串 |
| replaceWith | 将节点替换为新节点或字符串 |

### 表单

#### 表单查找

- 使用 document.forms 获取表单集合
- 使用 form 的 name 属性获取指定 form 元素
- 针对 radio/checkbox 获取的表单项是一个集合

```html
<form action="" name="login">
  <input type="text" name="title" />
  <input type="text" name="password" value="secret" />
</form>
<script>
  console.log(document.forms.login.title) //  <input type="text" name="title" />
</script>
```

### class 的单独处理

| Method                  | Des                  |
| ----------------------- | -------------------- |
| node.classList.add      | 添加类名             |
| node.classList.remove   | 删除类名             |
| node.classList.toggle   | 切换类名（存删无添） |
| node.classList.contains | 类名检测             |

## 事件

具体事件对象参考https://developer.mozilla.org/en-US/docs/Web/API/Event#introduction

**对象绑定**

如果事件处理程序可以是对象，对象的 handleEvent 方法会做为事件处理程序执行。下面将元素的事件统一交由对象处理

```html
<div>hello world</div>
<script>
  const div = document.querySelector('h1')
  class Obj {
    handleEvent(e) {
      this[e.type](e)
    }
    click() {
      console.log('click')
    }
    mouseover() {
      console.log('mouseover')
    }
  }
  div.addEventListener('click', new Obj())
  div.addEventListener('mouseover', new Obj())
</script>
```

> 执行事件处理程序时，会产生当前事件相关信息的对象，即为事件对象。系统会自动做为参数传递给事件处理程序。

`event.currentTarget` 指代的是绑定事件的元素对象

`event.target`指代的是事件响应的对象或者是其后代, 即得到事件目标元素即最底层的产生事件的对象

阻止默认事件行为可以使用`event.preventDefault()`

阻止事件传播可以使用`event.stopPropagation()`

### 窗口事件

| Event Type          | Des                                                          |
| ------------------- | ------------------------------------------------------------ |
| window.onload       | 文档解析及外部资源加载后                                     |
| DOMContentLoaded    | 文档解析后不需要外部资源加载，只能使用 addEventListener 设置 |
| window.beforeunload | 文档刷新或关闭时                                             |
| window.unload       | 文档卸载时                                                   |
| scroll              | 页面滚动时                                                   |
