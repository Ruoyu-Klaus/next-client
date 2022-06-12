---
title: 'Java中的强引用，弱引用，软引用，虚引用'
date: 2022-06-10
excerpt: '在Java中，对象的引用被划分为四种强度级别，从而使程序能更加灵活地控制对象的生命周期，分别为强引用，弱引用，软引用，虚引用'
cover: 'https://raw.githubusercontent.com/Ruoyu-Klaus/pics/main/images/weakRefAfterSetNull.png'
tags:
- Java
---

> 在Java中，对象的引用被划分为四种强度级别，从而使程序能更加灵活地控制对象的生命周期，分别为强引用，弱引用，软引用，虚引用。

- 强引用 *Strong References*
- 弱引用 *Weak References*
- 软引用 *Soft References*
- 虚引用 *Phantom References*



### 强引用

这是最普遍的引用，是我们日常开发工作当中最常用的。任何一个对象拥有强引用都不会被垃圾回收机制回收，除非这个对象被赋值为null。

比如这里`ry`对象是对新创建的`Student`实例的强引用，由于它扔是活跃的，因此不会被垃圾回收机制收集。加入把`ry`赋值为`null`，则改对象就会被GC管理起来。
```java

Student ry = new Student();

ry = null;

```


### 弱引用

弱引用可以使引用对象被GC管理起来。弱引用需要通过如下方式声明。
如果 JVM 检测到一个只有弱引用的对象(即没有链接到任何对象对象的强引用或软引用) ，这个对象将被标记为垃圾收集。

```java

Student ry = new Student(); // ry目前是强引用

WeakReference<Student> weakRy = new WeakReference<Student>(ry); // 创建弱引用weakRy
 
ry = null; // 把ry强引用赋值为null，可以被GC检测，只要被检测就会被回收清除

ry = weakRy.get(); // 把对象重新强引用起来

```

在`ry` 被赋值为null之前

![setEqualsNullBefore](https://raw.githubusercontent.com/Ruoyu-Klaus/pics/main/images/weakRef.png)

在`ry` 被赋值为null之后

![setEqualsNullAfter](https://raw.githubusercontent.com/Ruoyu-Klaus/pics/main/images/weakRefAfterSetNull.png)



> 基于弱引用，又有两种不同程度上的引用方式

### 软引用

软引用同样也是可以被GC管理起来。软引用需要通过如下方式声明。
主要应用于对象缓存相关场景中。

```java

Student ry = new Student(); // ry目前是强引用

SoftReference<Student> softRy = new SoftReference<Student>(ry); // 创建软引用softRy
 
ry = null; // 把ry强引用赋值为null，可以被GC检测，但是只有当JVM内存不够的时候才会被清除

ry = softRy.get(); // 把对象重新强引用起来


```

### 虚引用
虚引用顾名思义就是假引用，创建虚引用必须要，放在一个引用队列中，可以通过如下方式来声明。

虚引用在任何时候都有可能会被GC清除。

因为它们实际上不返回对象本身，而只是帮助跟踪对象的内存存在。

```java

Student ry = new Student(); // ry目前是强引用

ReferenceQueue refQueue = new ReferenceQueue() // 创建一个引用队列

PhantomReference<Student> phantomRy = new PhantomReference<Student>(ry,refQueue); // 创建虚引用phantomRy
 
ry = null; // 把ry强引用赋值为null，可以被GC检测，但是只有当JVM内存不够的时候才会被清除

ry = phantom.get(); // 仍然为null

```


### 总结

在Java中有4种不同强度和级别的引用方式，从高到低依次为

强引用 -> 软引用 -> 弱引用 -> 虚引用

越低，越容易被垃圾管理机制回收清除