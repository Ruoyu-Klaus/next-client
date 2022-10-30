---
title: 'Next.js如何在页面跳转之间做CSS过渡？'
date: '2021-12-06'
excerpt: '最近在开发个人博客项目的时候使用了Next.js框架，期间遇到不少小问题。我打算把这些小问题都记录下来，以免之后再次遇到，同时也分享给大家我的一些思路经供参考。'
cover: '![](2022-10-28-21-23-11.png)' 
tags:
  - Next.js
  - JavaScript
---

### Next.js 简介

React 是 SPA 单页面应用，对于性能和 SEO 来说不是很友好，而 Next.js 是基于 React 的一个框架。它具有一个直观的基于页面的路由系统。并且支持页面的预渲染，静态生成 (SSG) 和服务器端渲染 (SSR) 。它还集成了 serverless API 路由、Sass、build-in CSS、webpack5（v10，v11）等等工具。因此，对于开发者来说使用起来简明、方便。能够快速的做出一套 SSR 应用。

### \_app.js

在讲如何实现页面之间过渡效果之前，有必要先了解一下\_app.js 在 Next.js 中的作用。

\_app.js 是 Next.js 开始渲染每一个页面的入口文件。也就是说，每个页面在被渲染到客户端之前，都要经过这个文件。因此，我们可以从这个地方入手，在各个页面切换之间做点事情。

```react
class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props
    return <Component {...pageProps} />
  }
}
```

### Layout 组件

可以通过 layout 组件来完成这项任务。在 page 目录外面新建一个 layout 目录， 然后在该目录下新建一个 index.js 文件。该文件包含了页面之间共用的 Header、Footer 等组件以及从 props 里传进来被渲染的 Children。在 Next.js 中使用 layout 组件不仅可以能够保证页面状态的持久性，如输入值、scroll 位置等。还可以利用这一特性实现页面之间跳转的过渡效果。

```react
function MyLayout({ children }) {
  return (
    <>
      <Header/>
      <main>
        {children}
      </main>
      <Footer />
    </>
  );
}
export default MyLayout;
```

当然，你可以直接引用该 layout 组件到\_app.js 当中，但我不建议这样做，因为这样很不灵活，外面整个应用都只能用这一种布局方式，并且如果要使用嵌套的 layout 就会别的很麻烦。

为了解决这个问题，可以通过给 page 中添加一个新的属性。如`getLayout`函数。这个函数接受一个参数为 page，也就是我们 layout 组件的 Children。然后再该 page 中使用我们的`MyLayout`组件，并返回出去。

```react
export default function Home(){
    ...
}
Home.getLayout = function getLayout(page) {
  return (
    <MyLayout>
      {page}
    </MyLayout>
  )
}
```

然后再回到\_app.js，提取传入进来的 Component 的属性`getLayout`，注意防止空指针。具体使用如下

```react
function MyApp({ Component, pageProps }) {
  const getLayout = Component.getLayout || (page => page);
  return (
      <>
      	{getLayout(<Component {...pageProps} />)}
      </>
  );
}
```

### 引入 CSS 过渡规则

回到 Layout.js，新加一个 state 来存储当前的 children，并让 props 传入进来的 children 设为初始默认值。然后让它只渲染 state 存的`layoutChildren`

```react

function MyLayout({ children }) {
const [layoutChildren,setLayoutChildren] = useState(children)

  return (
    <>
      <Header/>
      <main>
        {layoutChildren}
      </main>
      <Footer />
    </>
  );
}
export default MyLayout;
```

接着，再新加一个 state 用来控制我们元素的 className，从而动态加入 CSS-moudule 样式。

```react
function MyLayout({ children }) {

const [layoutChildren,setLayoutChildren] = useState(children)
const [transitionStage, setTransitionStage] = useState("");
  return (
    <>
      <Header/>
      <main className={`${styles.main} ${styles[transitionStage]}`} >
        {layoutChildren}
      </main>
      <Footer />
    </>
  );
}
export default MyLayout;
```

新建一个 CSS 或 Sass 文件，举一个简单的淡入的例子

```css
.main {
  opacity: 0;
  transition: opacity 1s ease-in;
}
.fadeIn {
  opacity: 1;
}
```

引入该 css-module 文件之后，我们利用 useEffect 在页面首次被渲染的时候切换到`fadeIn`状态，并在 children 改变的时候移除`fadeIn`

```react
import styles from '../styles/Layout_module_css'

...

useEffect(() => {
  setTransitionStage("fadeIn");
}, []);

useEffect(() => {
  if(children !== displayChildren) setTransitionStage("");
}, [children,displayChildren,setTransitionStage]);

```

关键的地方来了，可以监听`onTransitionEnd`全局事件来判断我们上一个 transition 是否已经结束。该事件已经被 Reactd 的`SyntheticEvent`封装过，需要注意使用驼峰式而是不是传统 HTML 的小写格式。

在事件内部，我们通过判断当前`transitionStage`是否处于初始状态，如果是，便载入新 children 并把`transitionStage`重新设置为`fadeIn`

```react
// Layout.js
const onTransitionEndHandler = () => {
    if(transitionStage === ""){
        setDisplayChildren(children);
        setTransitionStage("fadeIn");
    }
}
...
 <main onTransitionEnd={onTransitionEndHandler} className={`${styles.main} ${styles[transitionStage]}`} >
        {layoutChildren}
 </main>
...
```

完整 Demo

```react
function MyLayout({ children }) {

const [layoutChildren,setLayoutChildren] = useState(children)
const [transitionStage, setTransitionStage] = useState("");

useEffect(() => {
  setTransitionStage("fadeIn");
}, []);

useEffect(() => {
  if(children !== displayChildren) setTransitionStage("");
}, [children,displayChildren,setTransitionStage]);

const onTransitionEndHandler = () => {
    if(transitionStage === ""){
        setDisplayChildren(children);
        setTransitionStage("fadeIn");
    }
}
  return (
    <>
      <Header/>
      <main onTransitionEnd={onTransitionEndHandler} className={`${styles.main} 			     ${styles[transitionStage]}`} >
          {layoutChildren}
      </main>
      <Footer />
    </>
  );
}
export default MyLayout;
```

