---
title: 浅入常见React Hooks
date: 2022-10-04
excerpt: 对于刚开始学习React的新手开发者来说，React各种更新机制和hooks很难上手，本次我们就简要梳理一下日常开发中常见的hooks
cover: /2022-10-06-12-23-41.png
tags:
- React
- React hooks
---


## 什么是React？解决了什么问题？

在介绍常用React hooks之前，我们首先要了解一下什么是React，它能解决什么问题？

> React 是一个声明性的、高效的、灵活的JavaScript库，用于构建用户界面。

通过官网的定义可以拆分成两点

1. 是基于Javascript的库
2. 它用于构建用户界面，也就是UI


在说明React解决的问题之前，我们先了解一下React出现之前的前端领域是什么样子的。

在前端的原始时期也就是2000年左右，当时整个阶段技术比较粗糙，页面没有什么交互行为，基本都是静态的网站。

再往后Ajax的到来，标志着前端整体进入了工业化时代。前端页面可以通过异步的形式向后端发起网络请求，而不需要重新加载整个页面。前端页面可以将获取的数据动态的插入到DOM节点中。在当时，由于各大浏览器厂商恶性竞争，之间没有达成统一的规范和标准，这导致开发者为了满足不同平台要实现多套代码，因此Jquery诞生了，它使JavaScript与DOM的交互接口变得简单，隐藏了不同的浏览器不兼容的实现，减少开发过程中的跨浏览器问题。

然而，通过Jquery直接操作DOM是一件十分消耗性能的一件事，如果一个页面需要频繁的更新数据，那么页面渲染性能就会降低，速度变慢，也使得代码变得臃肿难以维护。随着业务体量的不断增加，开发者们开始注意到架构设计模式的重要性。诞生了如MVC、MVP、MVVM等架构设计模式。它们共同目的就是将视图与数据分离开，增加代码的可读性和可维护性。基于上述架构设计模式，诞生了如今三大框架Angular、React以及Vue。

React本质上是单向数据流的库，由自身状态的变化驱动视图变化，它的核心就是一个函数`UI = fn(state)`。

```react
const App = state => `
  <div id='App'>
    <h1>Count: ${state.count}</h1>
  </div>
`
document.body.innerHTML = App({ count: 5 })
```

因此，作为构建用户界面的JavaScript库，React主要帮助我们去管理更新视图（通过虚拟节点减少不必要的DOM操作性能开支）。而开发者只用关心核心状态的管理。总的来说，使用React，开发者可以将精力放在model层，而view层则由它自身来完成。


## 函数组件与hooks

起初，函数组件是用来以更简洁地方式书写无状态的组件，相比类组件，它减少了大量verbose的代码。

然而，开发者逐渐发现类组件在实际开发过程中存在以下问题

1. 类组件的状态逻辑很难在组件之间被复用，尽管有高阶组件、Render Props这类技艺来解决此类问题，但是这种模式在一定程度上几乎重构了组件以及造成了包裹地狱（一层套一层）
2. 类组件变得复杂难以让人理解。比如在同一个方法中可能嵌套大量不想干的逻辑，以及监听事件。
3. 类组件写法冗余，不利于新手开发者学习，并且体积也相对较大，热更新也变得不稳定。

基于上述问题React hooks诞生了，它使得函数式组件有了类似于类组件的能力（维护自身状态，发送请求，绑定事件等等）


> Hooks是允许您从函数组件“钩入”React状态及生命周期等特性的函数。Hook不能在class组件中使用——这使得你不使用 class也能使用React。

### useState

我们用`useState`来创建和更新组件内部的状态。如何理解状态`state`？假如React为一个函数方程式`nX + m = y`，其中x是自变量，y为因变量，也就是说y会随着x值的变化而变化。那么`state`就是自变量x。

基本用法举例
- useState接受一个参数，用来表示该state的初始值
- useState返回一个长度为2的数组，索引第一位是当前状态，第二位是一个可以更新该状态的函数
- 这里我们创建一个初始值为0的count，此时页面渲染Current Count: 0
- 当我们点击add按钮，则触发setCount函数，执行我们传入的一个更新方法，即将当前count值加一
- React监测到组件自身状态发生了变化，页面重新被渲染，此时页面为Current Count: 1

```react
function Counter() {

  const [count, setCount] = useState(0);

  return (
    <div>
       <p>Current Count: {count}</p>
       <button onClick={()=>setCount(count=> count + 1)}>Add</button>
    </div>
  )
}
```


### useReducer

进阶版的`useState`，引入Redux的概念，把多个state合并为一个state进行操作更新。

基本用法举例
- useReducer第一个参数接受一个reducer函数，该函数用来表示状态更新的规则
- 它的第二个参数用来指定state初始值
- 第三个参数接受一个init函数，可以惰性初始化state的值
- useReducer返回一个长度为2的数组，索引第一位是当前状态，第二位是一个可以出触发状态更新的函数
- 当点击add按钮，触发dispatch函数，执行类型为increment的更新规则
- 当点击tax按钮，触发dispatch函数，除了类型之外，可以额外传入payload对象作为消费数据，用于状态更新

```react
const initialState = {count: 0, tax:0};

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return {...state, count: state.count + 1};
    case 'calculateTax':
      const { income } = action.payload;
      return {...state, tax: income * 0.1};
    default:
      return state;
  }
}
function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <>
      Count: {state.count}
      Tax: {state.tax}
      <button onClick={() => dispatch({type: 'increment'})}>Add</button>
      <button onClick={() => dispatch({type: 'calculateTax',payload: {income:1}})}>Tax</button>
    </>
  );
}
```



### useContext

在一个典型的React应用中，数据是通过props属性自上而下（由父及子）进行传递的。然而，这种传递方式对于一些需要多个子孙组件消费的数据而言是极其繁琐的。Context提供了一种在组件之间共享此类值的方式，而不必显式地通过组件树的逐层传递 props。

useContext可以用于在组件内消费一个context，当context的值发生了变化，该组件就会重新render


```react
const themes = {
  light: {
    background: "#eeeeee"
  },
  dark: {
    background: "#222222"
  }
};

const ThemeContext = React.createContext(themes.light);

function App() {
  return (
    <ThemeContext.Provider value={themes.dark}>
      <Toolbar />
    </ThemeContext.Provider>
  );
}

function Toolbar(props) {
  return (
    <div>
      <ThemedButton />
    </div>
  );
}

function ThemedButton() {
  const theme = useContext(ThemeContext);
  
  return <button style={{ background: theme.background }}>Button</button>;
}
```

-----



*如果说`useState`是自变量x，那么`useMemo`，`useCallback`，`useEffect`，可以理解为因变量y。*


### useMemo

`useMemo`可以作为性能优化的手段之一，它有助于避免每次渲染时都进行高开销的计算。

基本用法举例
- useMemo接受两个参数，第一个参数是一个函数，第二个为一个依赖项数组
- 只有当依赖项数组里的值发生了变化，才会重新执行我们传入的第一个函数
- 传入的函数可以理解为一个高性能开销的方法
- useMemo返回一个值，这个值等于传入它第一个函数参数的返回值

```react
function Counter({income}) {

  const [count, setCount] = useState(0);
  // 如果说渲染时传入的income值与上一次相同，那么就不会重新计算tax，直接返回上一次缓存下来的值
  const tax = useMemo(()=> income * 0.1 , [income])

  return (
    <div>
       <p>Current Count: {count}</p>
       <p>Current tax: {tax}</p>
       <button onClick={()=>setCount(count=> count + 1)}>Add</button>
    </div>
  )
}
```


### useCallback

`useCallback`与`useMemo`类似，它返回的是一个函数。

useCallback(fn, deps) 相当于 useMemo(() => fn, deps)

```react
function Counter({income}) {
  // 如果说渲染时传入的income值与上一次相同，那么就不会重新计算tax，直接返回上一次缓存下来的值
  const taxCallback = useCallback(()=> income * 0.1 , [income])

  return (
    <div>
       <p>Current tax: {taxCallback()}</p>
    </div>
  )
}
```


### useEffect

在函数式编程领域中，如果一个函数固定的输入一定会产生固定的输出，我们可以称之为这个函数为纯函数。
那么与之相对的，如果固定的输入不一定得到相同的输出，或者说可能对函数外部产生影响，我们称之为这个函数是有副作用的。

`useEffect`就是一个可以完成副作用操作的函数。

数据获取、设置订阅、设置定时器、记录日志以及改变DOM都是副作用的操作。

使用`useEffect`完成副作用操作。赋值给`useEffect`的函数会在组件渲染到屏幕之后执行。

为了防止内存泄露，`useEffect`赋值的函数可以返回一个清除函数，该函数会在组件卸载前执行。比如清除定时器，取消订阅，移除DOM事件等。

默认情况下，effect赋值的函数会在每轮组件渲染完成后执行。我们可以给`useEffect`传递第二个参数，它是effect的依赖项数组。

当依赖项数组里的值发生了变化，才会重新执行我们传入的第一个函数，这和`useCallback`与`useMemo`类似。

如果想执行只运行一次的 effect（仅在组件挂载和卸载时执行），可以传递一个空数组（[]）作为第二个参数。这就告诉 React你的effect不依赖于props或state中的任何值，所以它永远都不需要重复执行。

```react
function Counter({income}) {

  const [count, setCount] = useState(0);
  // 使用浏览器API更新页面标题
  useEffect(()=>{
    document.title = count
  }, [count])

  return (
    <div>
       <p>Current Count: {count}</p>
       <button onClick={()=>setCount(count=> count + 1)}>Add</button>
    </div>
  )
}
```


### useRef

如果说前面所说的`useState`、`useEffect`、`useMemo`等更新会触发UI视图的更新。`uesRef`可以让我们在自变量与视图之间、因变量与视图之间、自变量与因变量之间做一些事情。

它可以很方便地保存任何可变值，其类似于在class中使用实例字段的方式。

当ref对象内容发生变化时，`useRef`并不会通知你。变更`.current`属性也不会引发组件重新渲染。

更新ref对象的值可能是一个有副作用的操作。

`useRef`主要有两个实用场景

1. 存储可变变量

```react
const Timer = () => {
  const intervalRef = useRef();

  useEffect(() => {
    const id = setInterval(() => {
      console.log('hello, world')
    }, 1000);

    intervalRef.current = id;
    return () => clearInterval(intervalRef.current);
  });

  const handleCancel = () => clearInterval(intervalRef.current);

  return (
    <>
      <button onClick={handleCancel}>Clear</button>
    </>
  );
}
```


2. 访问DOM节点

```react
const CustomTextInput = () => {
  const textInput = useRef();

  focusTextInput = () => textInput.current.focus();

  return (
    <>
      <input type="text" ref={textInput} />
      <button onClick={focusTextInput}>Focus the text input</button>
    </>
  );
}
```


------

Reference


- https://reactjs.org/docs/thinking-in-react.html
- https://reactjs.org/docs/hooks-reference.html
- https://www.kn8.lt/blog/ui-is-a-function-of-data/
