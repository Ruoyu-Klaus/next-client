---
title: '如何在React中正确使用Debounce函数'
date: '2022-11-16'
excerpt: '函数内的局部变量在每次调用后过期。在React中如果一个函数组件重新执行，要如何正确处理Debounce函数，以保证指向的都是同一个引用，使其按预期工作？'
slug: 'use-debounce-in-react'
cover: /2022-10-06-12-23-41.png.png
tags:
- React
- Debounce
---

最近在做一个项目需要实现前端实时搜索功能。通常来说，我们会监听搜索框 `onChange` 事件，通过事件的回调函数实时获取用户输入的值，然后我们用这个值去过滤数据，从而引发试图重新渲染。

然而，如果用户每次输入一次，`onChange` 事件被触发一次，频繁地触发，任务栈中就会堆积大量回调函数，并且UI视图会频繁地渲染，影响性能。如果回调函数中有发送 API 请求，那无疑对服务器也是一种压力。

幸运的是，我们有防抖--`debounce` 技术来解决这种问题。


## 什么是 debounce ？

> Bounce 这个术语来源于电子业。当你按下手柄🎮上的一个按钮🔘，第一个信号📶很快地就传递到芯片。但在你手指松开之前，仍然会有多个信号传递到芯片。为了缓解这种情况发生，每当芯片接收到信号开始处理的时候，在几毫秒这之后的几次信号都会被芯片忽略不处理。


早在2011年，Twitter 网站就被报出一个严重的性能问题，就是当用户滑动的时候，页面变得异常卡顿，甚至无响应。这是因为 `scroll` 事件会短时间内轻而易举地被触发成百上千次，也就会短时间内执行成百上千个开销较大的回调函数。

在浏览器里，我们希望可能会被频繁促发的事件如 `resize`, `scroll`, `onChange` 等可以被有效地减少起处理次数。`debounce` 技术可以让函数在再次运行之前强制等待一段时间。

`debounce` 函数实际上就是一个高阶函数HOF。它主要接受两个核心参数，第一个参数就是我们需要”控制“触发频率的函数，第二个参数是二次触发需要等待的间隔时间。

简易版实现 `debounce`

```JavaScript
function debounce(func, timeout = 200){
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => { func.apply(this, args); }, timeout);
  };
}

```

> Lodash version of Debounce function

```JavaScript
function debounce(func, wait, options) {
  let lastArgs,
    lastThis,
    maxWait,
    result,
    timerId,
    lastCallTime

  let lastInvokeTime = 0
  let leading = false
  let maxing = false
  let trailing = true

  // Bypass `requestAnimationFrame` by explicitly setting `wait=0`.
  const useRAF = (!wait && wait !== 0 && typeof root.requestAnimationFrame === 'function')

  if (typeof func !== 'function') {
    throw new TypeError('Expected a function')
  }
  wait = +wait || 0
  if (isObject(options)) {
    leading = !!options.leading
    maxing = 'maxWait' in options
    maxWait = maxing ? Math.max(+options.maxWait || 0, wait) : maxWait
    trailing = 'trailing' in options ? !!options.trailing : trailing
  }

  function invokeFunc(time) {
    const args = lastArgs
    const thisArg = lastThis

    lastArgs = lastThis = undefined
    lastInvokeTime = time
    result = func.apply(thisArg, args)
    return result
  }

  function startTimer(pendingFunc, wait) {
    if (useRAF) {
      root.cancelAnimationFrame(timerId)
      return root.requestAnimationFrame(pendingFunc)
    }
    return setTimeout(pendingFunc, wait)
  }

  function cancelTimer(id) {
    if (useRAF) {
      return root.cancelAnimationFrame(id)
    }
    clearTimeout(id)
  }

  function leadingEdge(time) {
    // Reset any `maxWait` timer.
    lastInvokeTime = time
    // Start the timer for the trailing edge.
    timerId = startTimer(timerExpired, wait)
    // Invoke the leading edge.
    return leading ? invokeFunc(time) : result
  }

  function remainingWait(time) {
    const timeSinceLastCall = time - lastCallTime
    const timeSinceLastInvoke = time - lastInvokeTime
    const timeWaiting = wait - timeSinceLastCall

    return maxing
      ? Math.min(timeWaiting, maxWait - timeSinceLastInvoke)
      : timeWaiting
  }

  function shouldInvoke(time) {
    const timeSinceLastCall = time - lastCallTime
    const timeSinceLastInvoke = time - lastInvokeTime

    // Either this is the first call, activity has stopped and we're at the
    // trailing edge, the system time has gone backwards and we're treating
    // it as the trailing edge, or we've hit the `maxWait` limit.
    return (lastCallTime === undefined || (timeSinceLastCall >= wait) ||
      (timeSinceLastCall < 0) || (maxing && timeSinceLastInvoke >= maxWait))
  }

  function timerExpired() {
    const time = Date.now()
    if (shouldInvoke(time)) {
      return trailingEdge(time)
    }
    // Restart the timer.
    timerId = startTimer(timerExpired, remainingWait(time))
  }

  function trailingEdge(time) {
    timerId = undefined

    // Only invoke if we have `lastArgs` which means `func` has been
    // debounced at least once.
    if (trailing && lastArgs) {
      return invokeFunc(time)
    }
    lastArgs = lastThis = undefined
    return result
  }

  function cancel() {
    if (timerId !== undefined) {
      cancelTimer(timerId)
    }
    lastInvokeTime = 0
    lastArgs = lastCallTime = lastThis = timerId = undefined
  }

  function flush() {
    return timerId === undefined ? result : trailingEdge(Date.now())
  }

  function pending() {
    return timerId !== undefined
  }

  function debounced(...args) {
    const time = Date.now()
    const isInvoking = shouldInvoke(time)

    lastArgs = args
    lastThis = this
    lastCallTime = time

    if (isInvoking) {
      if (timerId === undefined) {
        return leadingEdge(lastCallTime)
      }
      if (maxing) {
        // Handle invocations in a tight loop.
        timerId = startTimer(timerExpired, wait)
        return invokeFunc(lastCallTime)
      }
    }
    if (timerId === undefined) {
      timerId = startTimer(timerExpired, wait)
    }
    return result
  }
  debounced.cancel = cancel
  debounced.flush = flush
  debounced.pending = pending
  return debounced
}
```


## 在 React 中使用 debounce

首先，利用一个简易 Demo 来演示一个实时搜索过滤列表的例子

```react
import { useState, useRef } from "react";

const fruits = ["apple", "banana", "grape", "strawberry", "watermelon"];

export default function App() {
  const [query, setQuery] = useState("");
  const renderCount = useRef(0);

  let filteredFruits = fruits;
  if (query !== "") {
    filteredFruits = fruits.filter((fruit) => {
      return fruit.toLowerCase().includes(query.toLowerCase());
    });
  }
  const changeHandler = (event) => {
    setQuery(event.target.value);
  };

  renderCount.current += 1;

  return (
    <div>
      <div>render count: {renderCount.current}</div>
      <input
        onChange={changeHandler}
        type="text"
        placeholder="Type a query..."
      />
      {filteredFruits.map((fruit) => (
        <div key={fruit}>{fruit}</div>
      ))}
    </div>
  );
}


```

每当你输入一个字符的时候，`query` 就会被重新负值，引发组件重新渲染。 例如让你输入 `apple` 的时候，相当于组件要render五次。如果组件复杂，数据量庞大，则对性能有这不小的负影响。

因此，`debounce` 技术可以帮助我们减少用户输入引发重新渲染的次数。

这里为了使用方便，我们直接使用 [`lodash`](https://lodash.com/) 提供的 `debounce` 函数。

`debounce` 函数接受回调参数函数，并返回该函数的 `debounce` 版本。

```JavaScript
import debounce from 'lodash.debounce';
const debouncedCallback = debounce(callback, waitTime);
```

当 `debouncedCallback` 函数被连续触发多次时候， 它只会在 `waitTime` 之后才会执行最后一次的触发。

然而，直接使用会有一个问题，就是我们需要保持每次组件重新渲染时候， `debouncedCallback` 要保持是同一个版本（同一个引用），不然，每一次渲染都会重新生成一个 `debouncedCallback` 函数，从而引发一些问题。 

比如，为了能够实时拿到用户输入的值，把 `<input>` 做为一个受控组件。触发 `onChange` 我们应该立即重新赋值 `value`， 然而又不想立即执行一个发请求的函数。这时候如果我们仅仅将该发送请求的函数用 `debounce` 包裹起来，并不会起作用。代码如下：

```react

import { useState, useRef, useMemo } from "react";
import { debounce } from "lodash";
const fruits = ["apple", "banana", "grape", "strawberry", "watermelon"];

export default function App() {
  const [query, setQuery] = useState("");
  const [value, setValue] = useState("");
  const renderCount = useRef(0);

  let filteredFruits = fruits;
  if (query !== "") {
    filteredFruits = fruits.filter((fruit) => {
      return fruit.toLowerCase().includes(query.toLowerCase());
    });
  }

  const doSomething = (query) => {
    console.log(query); // ⚠️ run ever render 
    // do something here like HTTP request
  };

  const debouncedSearchFn = debounce(doSomething, 1000);

  const changeHandler = (event) => {
    setValue(event.target.value);
    debouncedSearchFn(event.target.value);
  };

  renderCount.current += 1;

  return (
    <div>
      <div>render count: {renderCount.current}</div>
      <input
        onChange={changeHandler}
        type="text"
        placeholder="Type a query..."
        value={value}
      />
      {filteredFruits.map((fruit) => (
        <div key={fruit}>{fruit}</div>
      ))}
    </div>
  );
}
```

换句话说，当组件重新渲染时， `debouncedSearchFn` 重新生成了一个新的函数。由于作用域的不同，因此每次生成的新函数各自执行，会在 window 上重新注册一个计时器，从而表现为失效。

幸运的是，react 提供了两个hooks `useMemo`, `useCallback` 可以帮助解决这个问题。如果依赖项没有发生变化，z即使组件重新渲染，它们仍保留上一次re-render的实例。

```JavaScript
// 这里用 useMemo 来举例
const debouncedSearchFn = useMemo(()=>debounce(doSomething, 1000),[]);
const changeHandler = (event) => {
  setValue(event.target.value);
  debouncedSearchFn(event.target.value);
};
```

可以神奇地发现，`debounce` 生效了。我们在不影响 `<input>` 重新渲染的同时，限制了 `doSomething` 方法的执行。


## Caveat

1. 记得在组件卸载的时候取消 `debounce` 函数的执行(lodash的debounce函数提供了cancel方法)

```JavaScript
useEffect(() => {
  return () => {
    debouncedHandler.cancel();
  }
}, []);
```

2. 即使是非受控组件，也可以利用 `useMemo`, `useCallback` 防止每次render重复创建 `debounce` 实例




## 扩展阅读

- [Debouncing and Throttling Explained Through Example](https://css-tricks.com/debouncing-throttling-explained-examples/)

- [what-is-rendering](https://felixgerschau.com/react-rerender-components/#what-is-rendering)

