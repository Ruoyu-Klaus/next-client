---
title: 'Sequelize分页踩坑记'
date: '2021-09-05'
excerpt: 'Sequelize.js无疑是前端ORM中的主流。最近在利用其实现分页过程中出现了一点小问题。'
cover: 'https://i.loli.net/2021/09/09/1GakcsZi7jUMFOg.png'
tags:
  - Sequelize
---

`findAndCountAll`是 Sequelize 模型中一个常见的 Finder 方法，它结合了`findAll`和`count`方法。这对于做分页来说非常的方便。不过在使用过程中，遇到了一个小坑，导致了返回的`count`结果不准确。

如果在查询的语法中，关系表也要引入进来时候，就会导致 Sequezlize 计算数量错误。如

```js
const posts = Post.findAndCountAll({
    include: ['bg_admin','bg_tag' ]
});
const [rows = [{...},{...}], count = 4] = posts // count wrong number

```

这可能是因为合并查询，Sequelize 在计算合并表的过程中，造成了笛卡尔积。

一种解决方案就是在查询语法中加入`distinct: true` ，主动过滤掉与左联表相同的行数据，这样查出来的行数就和 count 保持一致。

还有一种思路就是给`Sequelize`实例新增一个 Hook。在 Gihub 的 issue 里面就有人提出过这个问题，下面是一个大哥给出的答案。

```js
// Add a permanent global hook to prevent unknowingly hitting this Sequelize bug:
//   https://github.com/sequelize/sequelize/issues/10557
sequelize.addHook('beforeCount', function (options) {
  if (this._scope.include && this._scope.include.length > 0) {
    options.distinct = true
    options.col =
      this._scope.col || options.col || `"${this.options.name.singular}".id`
  }

  if (options.include && options.include.length > 0) {
    options.include = null
  }
})
```

总之，Sequelize 是给 JS 提供的一套便利操作数据库的工具，它的特性不仅可以让开发人员少些代码，抽象化数据模型，还能防止 SQL 注入，迁移工具等等。但是其中还是有很多细节上的问题还是需要开发人员灵活处理。
