---
title: 'JavaScript之Promise'
date: '2021-08-01'
excerpt: '学习了解一下JS中通过Promise异步处理'
cover: 'https://s2.loli.net/2022/02/14/o24PNSgwmjGQnYy.png'
tags:
  - JavaScript
---


## What is a Promise?

> **MDN**
>
> A `Promise` is a proxy for a value not necessarily known when the promise is created. It allows you to associate handlers with an asynchronous action's eventual success value or failure reason.

A `Promise` is in one of these states:

- *pending*: initial state, neither fulfilled nor rejected.

- *fulfilled*: meaning that the operation completed successfully.

- *rejected*: meaning that the operation failed


## Promise chain

A pending promise can either be fulfilled with a value, or rejected with a reason (error). When either of these options happens, the associated handlers queued up by a promise's then method are called

![promise-chain](https://s2.loli.net/2022/02/14/wU6SCJWDnKayfY2.png)

> The methods `promise.then(),` `promise.catch(), and promise.finally()` are used to associate further action with a promise that becomes settled.

  链式加载

```js
function load(file) {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = file;
    script.onload = () => resolve(script);
    script.onerror = () => reject();
    document.body.appendChild(script);
  });
}
load("js/1.js")
.then(() => load("js/2.js"))
.then(() => <code here>);
```

使用promise封装定时器

```js
//封装定时器
//定时器为宏任务队列

function timeOut(delay=3000,callback){
    return new Promise(resolve=>{
        setTimeout(()=>callback(resolve),delay)
        //delay to trigger Promise return resolve to callback
    })
}

//--------------------------------------------
var timeInterval = (callback, delay = 60) => {
  let id = setInterval(() => callback(id), delay)
  }

timeInterval((id) => {
  let div = document.querySelector("div");
  let left = parseInt(window.getComputedStyle(div).left)
  div.style.left = left + 10 + 'px';
  if (left > 250) {
    clearInterval(id)
  }
})
```



#### 利用promise实现缓存加载

```js
//缓存后台数据，避免重复请求数据
//函数实际上也是对象，可以给这个函数对象添加cache属性,从而存储请求得到的数据
function query(name){
    const cache = query.cache || (query.cache=new Map());
    if (cache.has(name)){
        console.log('走了缓存');
        return Promise.resolve(cache.get(name))
    }
    return new Promise(resolve=>{
        resolve({[name]:"ruoyu"})})
    .then(value=>{
        cache.set(name,value);
        console.log('没走缓存')
        return value
    })
}
query("请求名").then(value=>console.log(value))

setTimeout(
    ()=>query("请求名")
        .then(value=>console.log(value))
    ,1000)

```

### Static method

[`Promise.all(iterable)`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all)

Wait for all promises to be resolved, or for any to be rejected.

If the returned promise resolves, it is resolved with an aggregating array of the values from the resolved promises ,in the same order as defined in the iterable of multiple promises.

If it rejects, it is rejected with the reason from the first promise in the iterable that was rejected.

[`Promise.allSettled(iterable)`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled)

Wait until all promises have settled (each may resolve or reject).

Returns a promise that resolves after all of the given promises have either resolved or rejected, with an array of objects that each describe the outcome of each promise.

[`Promise.race(iterable)`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/race)

Wait until any of the promises is resolved or rejected.

If the returned promise resolves, it is resolved with the value of the first promise in the iterable that resolved.

If it rejects, it is rejected with the reason from the first promise that was rejected.

[`Promise.reject(reason)`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/reject)

Returns a new `Promise` object that is rejected with the given reason.

[`Promise.resolve(value)`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/resolve)

Returns a new `Promise` object that is resolved with the given value. If the value is a thenable (i.e. has a `then` method), the returned promise will "follow" that thenable, adopting its eventual state; otherwise the returned promise will be fulfilled with the value.

### 实现promise队列

基本思路：通过上一次返回的promise来依次执行

```js
let promise = Promise.resolve(1);
promise.then(value=>{
  value += 1;
  console.log(value) //2
  return new Promise((resolve,reject)=>{
    setTimeout(()=>{
      resolve(value+1);
    },1000)
  })
}).then(value=>{
  console.log(value); //3
})
//先打印1，然后隔一秒之后再打印3
```

通过map方法实现promise队列

```js
function queue = (arr) {
  let promise = Promise.resolve();
  arr.map(item=>{
    promise = promise.then(_=>{
      return new Promise((resolve,reject)=>{
        setTimeout(()=>{
          console.log(item);
          resolve(item);
        },1000)
      })
    })
  })
}
queue([1,2,3,4,5]);
//每隔一秒输出数组中的值
```

通过reduce方法实现promise队列

```js
function sentQuery(items){
    items.reduce((promise,item)=>{
        return promise.then(_=>{
            return new Promise(resolve=>{
                setTimeout(()=>{
                    console.log(item)
                    resolve(item)
                },1000)
            })
        })
    },Promise.resolve())
}
sentQuery([1,2,3,4,5])

```

### 封装可利用队列请求模块

```js
//ajax
const ajax = function(url) {
  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest()
    xhr.open('GET', url)
    xhr.send()
    xhr.onload = function() {
      if (this.status === 200) {
        resolve(this.response)
      } else {
        reject(this)
      }
    }
  })
}
//队列处理
const queue = function(requests){
  requests.reduce((promise,request)=>{
    //每次request中ajax的promise状态改变之后再接下一个request
    return promise.then(request)
  },Promise.resolve())
};

let arr_req = ['url1','url2','url3'].map(v => () =>
      ajax(v).then(v => console.log('doing something with values'))//这里返回一个可被then方法接收的函数
    );
queue(arr_req)
```

### 简单实现axios

```js
class axios{
    options = {
      responseType: 'json',
    };
  constructor(method,url,data,options){
    this.method = method;
    this.url = url;
    this.data = data;
    this.options = Object.assign(this.options,options);
  };
  xhr(){
    return new Promise((resolve,reject)=>{
      let xhr = new XMLHttpRequest();
      xhr.open(this.method,this.url);
      xhr.responseType = this.options.responseType
      xhr.send(this.data);
      xhr.onload = function(){
        if(xhr.status===200){
          resolve(xhr.response);
        }else{
          reject(xhr.statusText);
        };
        xhr.onerror = function(err){
          reject(err);
        }
      }
    })  
  };
  static get(url,options){
    return new this('GET',url,null,options).xhr()
  };
  static post(url,data,options){
    return new this('POST',url,data,options).xhr();
  };
}
axios.get('http://localhost:5000/edu_policies').then(value=>console.log(value))
```



### Summarize

+ 在promise中代码与主线程中的优先级同步，但then方法之后的代码就会进入微任务队列等待主线程执行完毕后再执行。
+ `promise` 的 then、catch、finally的方法都是异步任务
+ 每次的 `then` 都是一个全新的 `promise`，默认 then 返回的 promise 状态是 fulfilled
+ promise.resolve可以resolve另一个待解决的promise

  
