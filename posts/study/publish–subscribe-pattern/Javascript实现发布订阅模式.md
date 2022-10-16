---
title: 发布订阅模式
date: 2022-10-15
excerpt: 发布订阅模式是软件架构中常见的设计模式。它可以有效降低系统底层组件之间的耦合程度
cover: /pub:sub-compressed.png
tags:
- Javascript
- Design Pattern
- Publish–subscribe pattern
---

> In software architecture, publish–subscribe is a messaging pattern where senders of messages, called publishers, do not program the messages to be sent directly to specific receivers, called subscribers, but instead categorize published messages into classes without knowledge of which subscribers, if any, there may be. Similarly, subscribers express interest in one or more classes and only receive messages that are of interest, without knowledge of which publishers, if any, there are. [wiki](https://en.wikipedia.org/wiki/Publish%E2%80%93subscribe_pattern)



## 组成部分🎛️

发布订阅模式主要有三个角色组成

🛖 发布订阅中心(broker)

🙋‍♂️ 发布者(publisher)

💁‍♂️ 订阅者(subscriber)

发布者与订阅者不直接进行通信，而是发布者将要发布的消息交由中心管理。订阅者也是根据自己的情况，按需订阅中心中的消息。

## 简单实现⭐
```JavaScript
class PubSub {
  constructor() {
    // save event and listener fn
    this.eventMap = {}
  }

  on(type, handler) {
    if (handler instanceof Function === false) {
      throw new Error('Handler should be a function')
    }

    if (!this.eventMap[type]) {
      this.eventMap[type] = []
    }

    this.eventMap[type].push(handler)
  }

  emit(type, ...params) {
    if (this.eventMap[type]) {
      this.eventMap[type].forEach(handler => {
        Promise.resolve()
          .then(() => {
            handler(...params)
          })
          .catch(e => console.error(e))
      })
    }
  }

  off(type, handler) {
    if (this.eventMap[type]) {
      this.eventMap[type].splice(this.eventMap[type].indexOf(handler), 1)
    }
  }
}

// publish center
const pubSub = new PubSub()

// subscriber
pubSub.on('log', (msg, type = 'log') => {
  console[type](msg)
})

// publisher
pubSub.emit('log', 'hello world', 'log')

console.log('first print')
```


## 优点👍

- 松耦合

发布者和订阅者不需要知道对方的存在。他们共同关注的主题才是焦点。
从订阅者视角来看，发布者就是一个黑盒子，他不需要知道发布者的内部是如何实现的，甚至依赖接入发布者的源码。

- 提升代码可测性

由于发布者与订阅者的解藕，模块化的组件极大降低了代码的复杂度

- 可扩展性

用户随意可以更改发布订阅代理架构、过滤器等而不影响底层组件


## 缺点👎

- 引入新模块，增加项目复杂度

对于小型系统而言，盲目的引用发布订阅模式带来资源浪费

- 消息交付问题（一致性）

比如，对于发布者而言，他很难断定所以订阅者是否还活着。如果订阅消息类型的记录器崩溃，任何依赖错误警告的服务都将不不会显示和记录错误消息。为保证消息交付，可以通过要求订阅者宣布消息已接收。