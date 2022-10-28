---
title: 'Java函数式接口'
date: 2022-04-30
excerpt: Java一直以来是OO语言，而Lambda是Java8中的新特性，它用来表示函数接口的实现，一个函数式接口可以拥有多个默认方法。
cover: '![](2022-10-28-21-08-59.png)'
tags:
- Java
- Functional Interface
---


# Java函数式接口

### 函数式接口是什么？

有且只有一个抽象方法的接口被称为函数式接口，函数式接口适用于函数式编程的场景，Lambda就是Java中函数式编程的体现，可以使用Lambda表达式创建一个函数式接口的对象，一定要确保接口中有且只有一个抽象方法，这样Lambda才能顺利的进行推导。


### 常用的函数式接口

1. Supplier%3CT%3E 指定接口的泛型是什么，那么接口get方法就会返回什么类型。适用于提供数据的场景，对应下列代码

```java
public static void printString(Supplier<String> string){
	System.out.println(string.get());
}
```



2.  Consumer<T>用于接受消费指定泛型数据， 除此之外，Consumer 接口有个默认方法andThen可以把两个Consumer接口组合在一起消费，顺序->谁写在前面谁先被消费

```java
public static void main(String[] args) {
	Consumer<String> consumer1 = s-> System.out.println(s.split(",")[0]);
	Consumer<String> consumer2 = s-> System.out.println(s.split(",")[1]);

	consumeString(consumer1,consumer2);  // nihao\n ruoyu
}

public static void consumeString(Consumer<String> consumer1, Consumer<String> consumer2){
	consumer1.andThen(consumer2).accept("nihao,ruoyu");
}
```



3. Predicate<T>对某种类型数据进行判断，返回一个布尔值。包含一个抽象方法boolean test(T t)

- Predicate接口有个默认方法`and`可以连接多个判断条件，有false则false。
pre1.and(pre2).test(s)

- Predicate默认方法`or`可连接多个判断条件，有true则true。
pre1.or(pre2).test(s)

- Predicate默认方法`negate`取反。
pre1.negate().test(s)

```java
public static void main(String[] args) {
	System.out.println(isPositive(1));  // true
}

public static boolean isPositive(Integer targetNumber){
	Predicate<Integer> predicate = number -> number >= 0;
		return predicate.test(targetNumber);
}
```



4. Function<T,R>可以对数据类型进行转换，提供一个参数，然后返回一个结果

```java
public static void main(String[] args) {
	printStringLength("nihao"); // 5
}

public static void printStringLength(String string){
	Function<String, Integer> function = String::length;
	System.out.println(function.apply(string));
}
```



  - Function<接口有个默认方法`andThen`可以把两个Function接口组合在一起，先执行第一个function表达式，然后把结果作为参数传给下一个function表达式

```java
public static void main(String[] args) {
	printFirstCharWithSameLength("nihao");
}

public static void printFirstCharWithSameLength(String string) {
  Function<String, Integer> function1 = String::length;
  Function<Integer, String> function2 = 
    length -> String.join("",Collections.nCopies(length, string.substring(0, 1)));
  
  System.out.println(function1.andThen(function2).apply(string));
}
```


  - Function<接口有个默认方法`compose`可和`andThen`执行顺序相反。



### 自定义函数式接口

`@FunctionalInterface`注解用来表示该接口是函数式接口，并且又且有一个抽象方法，否则就会报错

下面就自定义了一个`Checker`接口，类似于`Predicate`


```java
@FunctionalInterface
interface Checker<T>{
    boolean check(T t);
}
```>)