---
title: 'Javascript中关于loops异步操作'
date: 2022-03-17
excerpt: 对于`async`和`await`的一般用法是比较容易理解的，但是当在循环中尝试使用`await`事情就会变得有点复杂。
cover: 'https://raw.githubusercontent.com/Ruoyu-Klaus/pics/main/images/Javascript%E4%B8%AD%E5%85%B3%E4%BA%8Eloops%E5%BC%82%E6%AD%A5%E6%93%8D%E4%BD%9C.png'
tags:
- Javascript
- Async 
---

# Javascript中关于loops异步操作

> 对于`async`和`await`的一般用法是比较容易理解的，但是当在循环中尝试使用`await`事情就会变得有点复杂。


### 预备知识

1. [Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)相关方法
2. [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
2. [`async`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function)和[`await`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function)


### 准备数据

首先我们先准备一组假数据，假如现在有一组部门列表，每个部门中存放着当前人员列表如下

```javascript
const sectors = {
	a:['Bob'],
	b:['Tom'],
	c:['Lee']
}
```

当我们想要得到某一部门的所有人员时我们可以创建一个方法来获取

```javascript
const getSectorPeople = sector => sectors[sector]

getSectorPeople("a")  // ['bob']

```

一般我们的数据时存储在远程服务器的，现在我们通过`promise`来模拟一下远程请求

```javascript
const getSectorPeople = sector => new Promise(resolve => setTimeout(resolve,1000)).then(_=> sectors[sector])

getSectorPeople("a").then(people=> console.log(people)) // ['bob']

```

当我们分别获取这三个部门的人员时我们可以这样

```javascript

const getEachSectorPeople = async _ => {

	console.log("start")
	
	const sectorA = await getSectorPeople("a") // ['bob']
	
	const sectorB = await getSectorPeople("b") // ['Tom']
	
	const sectorC = await getSectorPeople("c") // ['Lee']

	console.log("end")

}
console.log(1)
getEachSectorPeople()
console.log(2)
```
实行结果如下图

![Screenshot 2022-04-24 at 22.00.28](https://raw.githubusercontent.com/Ruoyu-Klaus/pics/main/images/asyncSequence.png)

嗯～看起来符合我们的预期。如果数据量很大（部门很多）的时候，这种手动one by one的方式显得不太明智，那我们就要用循环。


### 普通循环(for、for-of、while)

还是使用之前的代码，假设我们有一个部门数组，通过for loop的方式把每个部门的人员打印出来

```javascript

const sectors = ["a","b","c"]
const getEachSectorPeople = async _ => {

	console.log("start")
	
for(let i=0; i<sectors.length; i++){
	const people = await getSectorPeople(sectors[i])
	console.log(people)
}
	console.log("end")
}
console.log(1)
getEachSectorPeople()
console.log(2)
```
实行结果如下图

![Screenshot 2022-04-24 at 22.00.28](https://raw.githubusercontent.com/Ruoyu-Klaus/pics/main/images/asyncSequence.png)

同样符合我们的预期。不过从代码的可读性来说，普通的`for`循环看起来确实又些臃肿，并且容易出错---比如变量`i`作用域问题，循环次数出错等等。

### 回调循环(map、filter、forEach、reduce)



既然普通的`for`循环那么不尽人意，那就用`forEach`来试试

```javascript
const sectors = ["a","b","c"]

const getEachSectorPeople = _ => {
  console.log('start')
  const sectors = ['a', 'b', 'c']
  sectors.forEach(async sector => {
    console.log(await getSectorPeople(sector))
  })

  console.log('end')
}

console.log(1)
getEachSectorPeople()
console.log(2)
```

结果如下

![Screenshot 2022-04-25 at 09.33.06](https://raw.githubusercontent.com/Ruoyu-Klaus/pics/main/images/sequece-forEach-async.png)

发现这并不符合我们的预期，方法`getEachSectorPeople`中的执行似乎没有被await关键字等待`promise`的结果，而是直接执行`forEach`之后的语句

当主线程的语句执行完之后，才把所有部门人员信息几乎**同时**打印出来

⚠️这里有一个关键词：几乎*同时*

如何理解？

我们看下`forEach`的底层逻辑

```javascript
const forEach = function(fn){
  for(let i=0; i<this.length; i++){
    fn(this[i], i)
  }   
}
```

可以看出传入进来的callback函数`fn`直接在循环体内立即执行了。因此，在`fn`方法体中的同步代码就会立即执行，而`await`修饰的代码进入pending状态

由于数据量不是很大，并且我们setTimeout等待时间都是1s，因此每次循环中的异步代码几乎是同时进入pending状态的，然后1s后同时resolve结束

然而，在现实情景中，每个请求响应时间不可能都一样。因此加入请求**b**部门的响应要比**a**的响应时间要快，**c**部门最慢，那么结果就有可能是这样的

```javascript
1
start
end
2
['Tom'] // b部门
['Bob'] // a部门
['Less'] // c部门
```

这种方式使得无法控制每一次结果顺序。因此，不建议在`forEach`中使用异步代码

#### `map`中的异步

假如无论那个请求时间或长或短，我们就想要等最后一个请求结果返回时候获得所有结果，可以用`map`方法和`Promise.all`方法，具体如下

```javascript
const sectors = {
  a: ['Bob'],
  b: ['Tom'],
  c: ['Lee'],
}

const getSectorPeople = (sector, i) =>
  new Promise(resolve => setTimeout(resolve, i)).then(_ => sectors[sector])


const getEachSectorPeople = _ => {
  console.log('start')
  const sectors = ['a', 'b', 'c']
  const promises = sectors.map(async (sector, i) => {
    console.log('inside forEach')
    return await getSectorPeople(sector, 3000 / (i + 1))
  })
  Promise.all(promises).then(people => console.log(people))

  console.log('end')
}

console.log(1)
getEachSectorPeople()
console.log(2)
```

结果如下

![Screenshot 2022-04-25 at 13.31.51](https://raw.githubusercontent.com/Ruoyu-Klaus/pics/main/images/map-async.png)



我们可以看到无论部门`a`返回要等待多久，我们还是一起按照列表循环的顺序拿到了所有部门的数据，相当于是并行操作所有的promise

在异常处理方面，可以根据业务需要选择`Promise.all`或者`Promise.allSettled`，前者是只要有一个请求出现了异常，整个promises列表就会返回失败，后者是兼容了成功和失败。



#### 在`reduce`中表现如何呢？

假如我们要计算所有部门的人数总和，代码如下

```javascript 
const sectors = {
  a: ['Bob'],
  b: ['Tom'],
  c: ['Lee'],
}

const getSectorPeople = (sector, i) =>
  new Promise(resolve => setTimeout(resolve, i)).then(_ => sectors[sector])


const getEachSectorPeople = async _ => {
  console.log('start')
  const sectors = ['a', 'b', 'c']
  const totalNumberOfPeople = await sectors.reduce(async (sum, sector, i) => {
    const people = await getSectorPeople(sector, 3000 / (i + 1))
    return sum + people.length
  }, 0)
  console.log(totalNumberOfPeople)

  console.log('end')
}
getEachSectorPeople()
```


![Screenshot 2022-04-25 at 15.55.45](https://raw.githubusercontent.com/Ruoyu-Klaus/pics/main/images/reduce-async.png)

结果出人意料，出现了奇怪的东西`object Promise1`

仔细思考就会发现，在第一次迭代中，`sum`值为0，然后`sum + 1 = 1`，但是返回的实际上是一个`promise`，而在javascript中，将`promise`转化为字符串[object Promise]然后再加1，就成了这个`[object Promise]1`

所以，我们需要手动的处理一下这个每次迭代中`sum`这个promise对象

```javascript
const getEachSectorPeople = async _ => {
  console.log('start')
  const sectors = ['a', 'b', 'c']
  const totalNumberOfPeople = await sectors.reduce(async (sum, sector, i) => {
    const resolvedSum = await sum
    const people = await getSectorPeople(sector, 3000 / (i + 1))
    return resolvedSum + people.length
  }, 0)
  console.log(totalNumberOfPeople)

  console.log('end')
}
```

最终也得到了期望的结果，然而却增加了等待时间

因为每一次迭代中，都要`await`出结果后才进入下一轮迭代，因此，时长是累积增加的

一种简单的解决思路是先通过`map`和`Promise.all`并行获取所有数据，然后再通过`reduce`方法计算总数




### 总结



- 如果想要按照顺序来执行异步代码，可以考虑使用普通`for`，不带callback的那种
- 建议不要在`forEach`中使用异步代码
- 可以使用`map`和`Promise.all`来并行执行异步代码

