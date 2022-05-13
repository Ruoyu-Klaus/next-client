---
title: '如何利用TS的装饰器来实现单例模式'
date: '2022-05-12'
excerpt: '单例模式保证一个类仅有一个实例，并提供一个访问它的全局访问点。 当一个类用来控制其他共享资源资源时，可以考虑使用Singleton模式 - 例如ORM（对象关系映射器）或数据库连接。'
cover: 'https://raw.githubusercontent.com/Ruoyu-Klaus/pics/main/images/singleton-diagram.png'
tags:
- Typescript
- Singleton
- Decorator
---

# 如何利用TS的装饰器来实现单例模式

## 前言 
> 单例模式保证一个类仅有一个实例，并提供一个访问它的全局访问点。 当一个类用来控制其他共享资源资源时，可以考虑使用Singleton模式 - 例如ORM（对象关系映射器）或数据库连接。本文参考Trevor Atlas的一篇[文章](https://trevoratlas.com/posts/how-to-create-a-typescript-singleton-decorator) 


单例模式模式背后的基本思想是存储对类实例的引用，每次询问该类的新实例时都会返回该引用，而不是每次创建新实例。

## 原生Javascript中的实现
在聊Typescript以及装饰器之前，我们首先来看看原生Javascript是如何实现一个单例模式的。

可能在古老的Javascript代码中，你可能见过下面类似的东西：

下面代码使用了[IIFE](https://developer.mozilla.org/en-US/docs/Glossary/IIFE)模式，也就是我们所说的立即执行函数

```javascript
const Store = (function() {
    const data = [];

    function add(item) {
        data.push(item);
    }

    function get(id) {
        return data.find((d) => d.id === id);
    }

    return {
        add, get
    };
}());
```

当我们运行上述代码，`Store`将会被赋值一个包含`add`，`get`方法的对象。而且`Store`没办法直接读取`data`里面的数据。

这看起来很不错，不过仍然有那么点冗余并且由于是原生Javascript，并不能防止我们通过其他手段来破坏其规则。

而且，这样做代码的复用性也很差。当我们其他对象也想要实现一个单例时候，我们仍需要通过同样的代码实现一次。

## Typescript的做法

回到Typescript，我们通过class来做。

```typescript
class Store {
    private static instance: Store;
    private data: {id: number}[];
    private constructor() {}

    public static getInstance() {
        if (!Store.instance) {
            Store.instance = new Store();
        }
        return Store.instance;
    }

    public add(item: {id: number}) {
        this.data.push(item);
    }

    public get(id: number) {
        return this.data.find((d) => d.id === id);
    }
}

const store = new Store() // throws an Error: constructor of 'Store' is private

const store = Store.getInstance();
store.add({id: 1});
store.add({id: 2});
store.add({id: 3});

const anotherStore = Store.getInstance();
anotherStore.get(2); // returns `{id: 2}`!
```

与原生Javascript相比，Typescript的类型安全让我们在编译时期就能预防大部分类型的错误，而且代码也变得易读了。不过仍然有些冗余，我们仍需要手动写很多重复的代码当我们需要其他对象为单例的时候。

除此之外，另一个问题是我们必须使用我们定义的静态方法`getInstance`来获取实例。

## 更加“聪明”的Decorator

我们已经比较了原生Javascript和Typescript两种实现单例模式的方法，现在我们让我们的实现变得更加可复用。其中一个方法就是通过[decorator](https://www.typescriptlang.org/docs/handbook/decorators.html)来做。

首先，我们需要使用[Symbol](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol) 来创建一个唯一的key来表示我们单例类实例。之所以这么做是因为有可能会覆盖原类中的字段或方法名。

```typescript
export const SINGLETON_KEY = Symbol();
```

现在我们定义一个类型（与原class一致，并且新增`SINGLETON_KEY`字段表示该class的实例）

```typescript
export type Singleton<T extends new (...args: any[]) => any> = T & {
    [SINGLETON_KEY]: T extends new (...args: any[]) => infer I ? I : never
};
```

> 参考 [decorators and their syntax here](https://www.typescriptlang.org/docs/handbook/decorators.html)


下面代码中，`Singleton`方法接受一个参数`type`用来表示目标class。然后该方法返回一个[Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) 用来劫持`new`构建函数。[construct trap](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/construct)。本质上就是将原来的`constructor`替换为我们自己自定义实现的----既手动实例化它并存进`SINGLETON_KEY`中，如果`SINGLETON_KEY`中有，则返回这个实例。

```typescript
export const Singleton = <T extends new (...args: any[]) => any>(type: T) =>
    new Proxy(type, {
        // this will hijack the constructor
        construct(target: Singleton<T>, argsList, newTarget) {
            // we should skip the proxy for children of our target class
            if (target.prototype !== newTarget.prototype) {
                return Reflect.construct(target, argsList, newTarget);
            }
            // if our target class does not have an instance, create it
            if (!target[SINGLETON_KEY]) {
                target[SINGLETON_KEY] = Reflect.construct(target, argsList, newTarget);
            }
            // return the instance we created!
            return target[SINGLETON_KEY];
        }
    });
```

总的来看，大概代码就是这样：

```typescript
export const SINGLETON_KEY = Symbol();

export type Singleton<T extends new (...args: any[]) => any> = T & {
    [SINGLETON_KEY]: T extends new (...args: any[]) => infer I ? I : never
};

export const Singleton = <T extends new (...args: any[]) => any>(type: T) =>
    new Proxy(type, {
        // this will hijack the constructor
        construct(target: Singleton<T>, argsList, newTarget) {
            // we should skip the proxy for children of our target class
            if (target.prototype !== newTarget.prototype) {
                return Reflect.construct(target, argsList, newTarget);
            }
            // if our target class does not have an instance, create it
            if (!target[SINGLETON_KEY]) {
                target[SINGLETON_KEY] = Reflect.construct(target, argsList, newTarget);
            }
            // return the instance we created!
            return target[SINGLETON_KEY];
        }
    });
```

现在我们可以替换掉原来的实现，该用我们新定义的`Singleton`装饰器来实现。

> 注意⚠️：你需要在你的Typescript配置文件中enable experimental decorator这个功能


```typescript
// in tsconfig.json add the following
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
import {Singleton} from './Singleton';

@Singleton
class Store {
    private data: {id: number}[];

    public add(item: {id: number}) {
        this.data.push(item);
    }

    public get(id: number) {
        return this.data.find((d) => d.id === id);
    }
}

const myStore = new Store();
myStore.add({id: 1});
myStore.add({id: 2});
myStore.add({id: 3});

const anotherStore = new Store();
anotherStore.get(2); // returns `{id: 2}`!
```

## 最后

这种写法充分利用了Typescript的Decorator特性。当然，这只是单例模式实现的其中一种方式，但我认为这种方式让代码变得更加容易阅读，并且可以重复使用。