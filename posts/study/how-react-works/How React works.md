---
title: React原理基础
date: 2022-10-13
excerpt: 简单梳理一下React核心原理基础，从JSX，到Fiber架构...
cover: /2022-10-13-00-48-21.png
tags:
- React
---

## JSX--React语法糖

好多人可能认为`JSX`是摸板字符串, 其实不然，通过一个小例子来看一下它到底是什么

```react
<div className='app'>
	<p style={{color: '#000000'}}>Hello world</p>
</div>
```

经过Babel编译之后

```JavaScript
"use strict";

/*#__PURE__*/React.createElement("div", {
  className: "app"
}, /*#__PURE__*/React.createElement("p", {
  style: {
    color: '#000000'
  }
}, "Hello world"));
```

可以看出，实际上，`JSX`等价于一次`React.createElement`调用， 而`React.createElement`是React的核心方法，用于构建虚拟DOM。

React选择使用`JSX`可以提升研发效率，并可这种类似于HTML标签语法可以极大程度上降低开发者的学习成本。

因此，`JSX`本质上就是Javascript的语法扩展，是构建React虚拟DOM的语法糖。


## 创建React DOM节点

`function createElement(type, config, children)`

- type: 用于表示节点类型，如 div, p
- config: 组件所有属性以键值对的形式存储的对象，如 {className: 'app'}
- children: 表示该节点内部嵌套对子节点对象

下面是`createElement`的[源码](https://github.com/facebook/react/blob/main/packages/react/src/ReactElement.js)


```JavaScript
/**
 * Create and return a new ReactElement of the given type.
 * See https://reactjs.org/docs/react-api.html#createelement
 */
export function createElement(type, config, children) {
  let propName;

  // Reserved names are extracted
  const props = {};

  let key = null;
  let ref = null;
  let self = null;
  let source = null;

  if (config != null) {
    if (hasValidRef(config)) {
      ref = config.ref;

      if (__DEV__) {
        warnIfStringRefCannotBeAutoConverted(config);
      }
    }
    if (hasValidKey(config)) {
      if (__DEV__) {
        checkKeyStringCoercion(config.key);
      }
      key = '' + config.key;
    }

    self = config.__self === undefined ? null : config.__self;
    source = config.__source === undefined ? null : config.__source;
    // Remaining properties are added to a new props object
    for (propName in config) {
      if (
        hasOwnProperty.call(config, propName) &&
        !RESERVED_PROPS.hasOwnProperty(propName)
      ) {
        props[propName] = config[propName];
      }
    }
  }

  // Children can be more than one argument, and those are transferred onto
  // the newly allocated props object.
  const childrenLength = arguments.length - 2;
  if (childrenLength === 1) {
    props.children = children;
  } else if (childrenLength > 1) {
    const childArray = Array(childrenLength);
    for (let i = 0; i < childrenLength; i++) {
      childArray[i] = arguments[i + 2];
    }
    if (__DEV__) {
      if (Object.freeze) {
        Object.freeze(childArray);
      }
    }
    props.children = childArray;
  }

  // Resolve default props
  if (type && type.defaultProps) {
    const defaultProps = type.defaultProps;
    for (propName in defaultProps) {
      if (props[propName] === undefined) {
        props[propName] = defaultProps[propName];
      }
    }
  }
  if (__DEV__) {
    if (key || ref) {
      const displayName =
        typeof type === 'function'
          ? type.displayName || type.name || 'Unknown'
          : type;
      if (key) {
        defineKeyPropWarningGetter(props, displayName);
      }
      if (ref) {
        defineRefPropWarningGetter(props, displayName);
      }
    }
  }
  return ReactElement(
    type,
    key,
    ref,
    self,
    source,
    ReactCurrentOwner.current,
    props,
  );
}

```

通过对源码的分析，发现它是一种数据处理层，用于格式化数据，把传入的参数值转换为React内部的操作对象，最终通过调用`ReactElement`来实现元素的创建。

1. 处理key，ref，self，source四个属性值
2. 遍历config，筛选加入props里的属性
3. 提取子元素，推入props.children
4. 格式化defaultProps



`function ReactElement(type, key, ref, self, source, owner, props)`

下面是`ReactElement`[源码](https://github.com/facebook/react/blob/513417d6951fa3ff5729302b7990b84604b11afa/packages/react/src/ReactElement.js#L148)

```JavaScript
/**
 * Factory method to create a new React element. This no longer adheres to
 * the class pattern, so do not use new to call it. Also, instanceof check
 * will not work. Instead test $$typeof field against Symbol.for('react.element') to check
 * if something is a React Element.
 *
 * @param {*} type
 * @param {*} props
 * @param {*} key
 * @param {string|object} ref
 * @param {*} owner
 * @param {*} self A *temporary* helper to detect places where `this` is
 * different from the `owner` when React.createElement is called, so that we
 * can warn. We want to get rid of owner and replace string `ref`s with arrow
 * functions, and as long as `this` and owner are the same, there will be no
 * change in behavior.
 * @param {*} source An annotation object (added by a transpiler or otherwise)
 * indicating filename, line number, and/or other information.
 * @internal
 */
const ReactElement = function(type, key, ref, self, source, owner, props) {
  const element = {
    // This tag allows us to uniquely identify this as a React Element
    $$typeof: REACT_ELEMENT_TYPE,

    // Built-in properties that belong on the element
    type: type,
    key: key,
    ref: ref,
    props: props,

    // Record the component responsible for creating this element.
    _owner: owner,
  };

  if (__DEV__) {
    // The validation flag is currently mutative. We put it on
    // an external backing store so that we can freeze the whole object.
    // This can be replaced with a WeakMap once they are implemented in
    // commonly used development environments.
    element._store = {};

    // To make comparing ReactElements easier for testing purposes, we make
    // the validation flag non-enumerable (where possible, which should
    // include every environment we run tests in), so the test framework
    // ignores it.
    Object.defineProperty(element._store, 'validated', {
      configurable: false,
      enumerable: false,
      writable: true,
      value: false,
    });
    // self and source are DEV only properties.
    Object.defineProperty(element, '_self', {
      configurable: false,
      enumerable: false,
      writable: false,
      value: self,
    });
    // Two elements created in two different places should be considered
    // equal for testing purposes and therefore we hide it from enumeration.
    Object.defineProperty(element, '_source', {
      configurable: false,
      enumerable: false,
      writable: false,
      value: source,
    });
    if (Object.freeze) {
      Object.freeze(element.props);
      Object.freeze(element);
    }
  }

  return element;
};
```

可以发现，`ReactElement`实际是对数据的组装，用于构建React element对象。

并且，通过$$typeof来标识这个对象是ReactElement，目的是为了预防XSS攻击，具体可以见Dan在2018年写的一篇文章[Why Do React Elements Have a $$typeof Property?]('https://overreacted.io/why-do-react-elements-have-typeof-property/')
> This tag allows us to uniquely identify this as a React Element
> $$typeof: REACT_ELEMENT_TYPE


而React element可以作为参数传入ReactDOM.render()函数当中，从而渲染成真实的DOM

`ReactDOM.render(element, container, [callback])`

- element: 需要渲染的元素(React element)
- container: 元素挂载的目标容器，真实DOM节点


## 虚拟DOM

https://reactjs.org/docs/faq-internals.html


> The virtual DOM (VDOM) is a programming concept where an ideal, or “virtual”, representation of a UI is kept in memory and synced with the “real” DOM by a library such as ReactDOM. This process is called reconciliation.



虚拟DOM的优势：

- 提升开发效率和体验
- 跨平台问题（多了一层描述性抽象层）
- 批量更新（如果用户操作比较快，多次更新可以被batch函数来集中合成处理，减少不必要的更新）


## Diff 算法逻辑拆分

- 分层对比
  - DOM节点之间的跨层级操作不常见，以同层级操作为主
- 类型一致才有继续Diff的必要性
- key属性尽可能重用同层级节点


## React Hooks

可以看这一篇文章[react-hooks]('https://ruoyu.life/blog/post/study/react-hooks')



- `setState`的异步批量更新

[Batching updates]('https://reactjs.org/docs/hooks-reference.html#batching-of-state-updates')

[Automatic batching]('https://github.com/reactwg/react-18/discussions/21')

讲多个`setState`塞进一个队列中，等时机成熟，再把起其合起来，针对最新state值走一次更新。 

[count+1, count+1, count+1] ===> count->[count+1] ===> count+1

**Direct updates**

```react
export default function App() {
  const [count, setCount] = React.useState(0);

  const directUpdate = () => {
    setCount(count + 1);
    setCount(count + 1); 
  };

  return (
    <div>
      <h1>{count}</h1> // 当第一次点击时候 count 从0 -> 1
      <button onClick={batchUpdate}>update</button>
    </div>
  );
}
```

**Functional updates**

```react
export default function App() {
  const [count, setCount] = React.useState(0);

  const functionalUpdate = () => {
    setCount(count + 1);
    setCount(count => count + 1); // 函数式更新可以拿到最新count值
  };

  return (
    <div>
      <h1>{count}</h1> // 当第一次点击时候 count 从0 -> 2
      <button onClick={batchUpdate}>update</button>
    </div>
  );
}
```


## Fiber 与 Stack reconciler

由于浏览器负责DOM的渲染工作，而Javascript线程又可以操作DOM，因此，JavaScript线程和浏览器渲染线程只能为互斥关系，当一个线程执行时，另一个只能挂起等待。

Stack reconciler 是一个同步的递归过程，如果虚拟DOM树层级很深，需要调和的时间会很长，这将意味着Javascript线程长时间霸占主线程，就会导致渲染卡顿。

所谓Fiber就是比线程还要精细对过程，可以在对渲染过程实现更精细的控制。Fiber实现增量渲染，可中断，可恢复与优先级

Diff的工作流：Reconciler -> Renderer

⬇

Fiber架构下的工作流：Scheduler -> Reconciler -> Renderer

React根据浏览器帧率，计算时间切片大小，结合当前时间对task进行切割，中断当前代码执行，给浏览器喘气的空间。

render主要分为三个阶段

1. initialization phase
2. render phase
3. commit phase

双缓冲模式可以帮助复用Fiber树，实现无缝转接。在初始化阶段创建的current树与workInProgress树作为一种双缓冲数据

当current树呈现用户面前，所有更新会由workInProgress接管，直到更新完，current指针被指向workInProgress。


Fiber是React核心算法重写，是React内部定义的一种数据结构。Fiber节点保存了组件更新的状态以及副作用。


> 扩展阅读

[React-fiber](https://github.com/acdlite/react-fiber-architecture)

[React Internals (Part 3) - Fiber Architecture](https://www.burhanuday.com/blog/2020/09/react-internals-fiber-architecture-280l)







