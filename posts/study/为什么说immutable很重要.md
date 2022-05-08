---
title: '为什么说immutable很重要'
date: '2022-02-06'
excerpt: '在编程中，immutability这个词非常重要。今天我们聊一下它在React中(a javascript library for building UI)为什么重要，以及怎么保证immutability。'
cover: 'https://raw.githubusercontent.com/Ruoyu-Klaus/pics/main/images/mutate_object.png'
tags:
  - Immutability
  - Immutable
  - JavaScript
  - React
---




## 什么是immutability？

相信大家对immutability这一个词都不陌生。在wiki中有这样一段定义

> In [object-oriented](https://en.wikipedia.org/wiki/Object-oriented_computer_programming) and [functional](https://en.wikipedia.org/wiki/Functional_programming) programming, an **immutable object** (unchangeable[[1]](https://en.wikipedia.org/wiki/Immutable_object#cite_note-1) object) is an [object](https://en.wikipedia.org/wiki/Object_(computer_science)) whose state cannot be modified after it is created.

当一个对象被认为是immutability的，它在创建之后就不能被改变其结构或数据。例如，在Javascript中，所有基础类型都是immutable的，比如number，1就是1，一旦创建完之后就不会被改变。

```js
let one = 1
one = 2
```

有人可能会有上述疑问，说你看这不改变啦么。**注意**，这里只是把`2`这个值重新赋值给了`one`，改变的实际上是变量`one`所储存的值，但`1`还是`1`，不可能从字面上把它篡改为`2`。

那么对于引用类型而言呢？

比如Javascript中对object和array类型，他们都是mutable的，也就是说，它们在被创建之后也有可能会被任意更改。这会对程序造成很多意料之外的side-effect。比如，

```js
let cat = {
		name:'Lager'
}
let dog = cat
dog.name = 'Cola'

console.log(cat) // { name:'Cola' }
console.log(dog) // { name:'Cola' }

// 即使使用了const 关键字来定义变量，也不能保证其对象或数组是immutable的
const vector3 = [1,1,1]
const copyOfVector3 = vector3
vector3[0] = 0

console.log(vector3) // [0,1,1]
console.log(copyOfVector3) // [0,1,1]
```

和你预想的一样，`cat`是一个mutable的对象，当`cat`赋值给了`dog`等于共享了一样的引用地址。如果`dog`中的数据或结构发生变化，`cat`也会同样发生改变，这并不是我们想要的。



## 为什么要immutability？

- immutability是线程安全的（thread-safety）

在多线程的程序中，任意线程immutable的数据就不怕被其他线程改变。

- immutability更可靠并易于追踪维护

在一个复杂的系统中，如果一个数据是mutable的，存在很多异步任务。如果不加以控制，那么它可能会在任意地方被随意修改。从重构角度来说，这种“隐形”式的修改让程序变得难以阅读和维护。



### Immutability in React | Redux

在React中，props，state是一个对象。它存储了组件所需的数据。默认情况下，如果父组件发生了更新渲染，子组件也会被重新渲染，或者一个组件内部state发生了改变也会触发组件重新渲染。常用的一种React优化性能手段是将组件变为pure component，使之只会根据props和自身state的变化而re-render，不会被父组件的re-render影响。

那么React 是如何比较前后数据从而决定是否更新DOM呢？最直接的就是比较前后两者的引用地址是否一致`preState === CurState`。你或许知道，React和Redux通常警告不建议直接mutate props or state。如果你这么做了，React很难去比较前后数据是否发生了变化。假如通过mutate地方式去更新，因为引用同一个内存地址，前后永远相等，并不会触发DOM节点的重新渲染。

![mutate-object](https://raw.githubusercontent.com/Ruoyu-Klaus/pics/main/images/mutate_object.png)

你会许会想，为什么不直接通过递归的方式进行深比较呢？确实，这种方式可以帮助程序理解数据是否确实发生了变化，但是这种代价是巨额的。对于引用地址的比较，它的时间复杂度是O(1)，也就是说无论数据量有多大，它都可以通过一次计算得出结论。而通过递归的方式深比较，它的时间复杂度便是线性增长的，也就是O(n)。因此，从性能角度出发，我们更喜欢reference check。



## 怎么确保immutability？



- 通过ES6最新扩展符（spread operator）

```js
const cat = { name: "Larger" }
const renamedCat = {...cat, name: "Bob"}

console.log(cat) // { name: "Larger" }
console.log(renamedCat) // { name: "Bob" }
console.log(renamedCat === cat) // false

```

使用扩展符（...）可以快速地将其他对象数据插入新创建的对象当中。

> 不过需要注意⚠️，扩展语法仅仅对一层深度的数据有效。如果是多层级嵌套的结构，需要在每一层分别使用扩展语法保证其复制一个对象而不是重复引用它。

- 数组高级方法map/filter/reduce

```js
const vector3 = [1,1,1]
const copiedVector3 = vector3.map(item=>item+1)

console.log(vector3) // [1,1,1]
console.log(copiedVector3) // [2,2,2]
console.log(vector3 === copiedVector3) // false

```



上述方法对于结构简单的数据来说非常方便，但是如果层级变深，就需要递归每一个层级，让代码变得不易阅读。因此最好的可以使用第三方库来完成这部分的工作。

- 使用第三方库（immer/immutable）

```js
import produce from 'immer'

const cat = { name: "Larger", hobbies: ['eat', 'sleep'] }

const newCat = produce(cat, draft=> { draft.hobbies.push('play') })

console.log(cat) // { name: "Larger", hobbies: ['eat', 'sleep'] }
console.log(newCat) // { name: "Larger", hobbies: ['eat', 'sleep', 'play'] }
console.log(newCat === cat) // false

```



参考资料

[understanding-immutability-in-javascrip](https://css-tricks.com/understanding-immutability-in-javascript/#:~:text=Immutable%20data%20cannot%20change%20its,will%20always%20be%20a%20frog)

[what-is-immutability](https://daveceddia.com/react-redux-immutability-guide/#what-is-immutability)

[Immutable Update Patterns](https://redux.js.org/usage/structuring-reducers/immutable-update-patterns)