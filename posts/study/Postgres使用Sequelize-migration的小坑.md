---
title: 'Postgres使用Sequelize-migration的小坑'
date: '2021-08-06'
excerpt: '最近在用Sequelize ORM 来操作PostgresSQL数据库，然后就用到了sequelize-cli来维护和追踪数据库的初始化。虽然这个工具很早就开发了，但是仍然存在一些坑。'
cover: 'https://i.loli.net/2021/09/10/UW9fS1XjQpNI8hw.png'
tags:
  - Sequelize
  - Postgres
---



> 最近在写个人网站的后端部分，需要操作数据库。在Node社区，Sequelize 无疑是社区中基于promise最流行的ORM（Object–relational mapping）。虽然官方文档可以让你照着葫芦画个瓢，但是有些细枝末节的问题，只有真正实践了才能够发现，并且很可能是文档忽略掉的。

### 分页需要注意

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



### 表名要小写

- 利用 Sequelize migration 在创建表时候注意一定不要使用驼峰命名的方式！不然会失败，并且不会报错。

当使用`npx sequelize-cli migration:generate --name=[name]`时，会在 `database/migrations` 目录下生成一个 migration 文件(`${timestamp}-[name].js`) 。里面内容如下:

```javascript
module.exports = {
  up: (queryInterface, Sequelize) => {
    ...
  },
  down: (queryInterface, Sequelize) => {
   	...
  }
};
```

在命令行执行`npx sequelize-cli db:migrate`的时候执行的时 up 对象方法的内容，相反执行`npx sequelize-cli db:migrate:undo` 执行 down 对象方法中的内容。

现在有一个需求就是创建一个中间表，用来描绘两个表之间多对多的关系。比如一个产品可以拥有多个标签，而一个标签可以有多个产品，因此我们需要一个产品标签表格专门存储各自的 key。我们利用 sequelize 的 migration 来初始化创建我们需要的表格如下：

```javascript
  up: async (queryInterface, Sequelize) => {
    try {
      const { INTEGER } = Sequelize;
      await queryInterface.createTable('productTags', {
          productTags_id: { type: INTEGER, autoIncrement: true, primaryKey: true }
      	});
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  },
```

以为这样就结束了？ 嘿嘿嘿，nonono

当我执行`npx sequelize-cli db:migrate` 之后，命令行 hanging 了，正常情况应该有类似下面这种输出,并退出执行界面。

```bash
$ npx sequelize-cli db:seed:all
Sequelize CLI [Node: 14.17.0, CLI: 6.2.0, ORM: 6.6.5]

Loaded configuration file "database\config.json".
Using environment "development".
== -demo: migrating =======
== -demo: migrated (0.012s)

Done in 0.89s.
```

然而终端却一直卡在这里，也不报错。

```bash
Sequelize CLI [Node: 12.14.1, CLI: 5.5.1, ORM: 5.21.3]
Loaded configuration file "config\sequelize_config.js".
Using environment "development".
== -demo: migrating =======
Created column...
```

把 stackoverflow 中的所有解决方法都试了一遍也无济于事。

后来，up 对象方法体里打印来检查问题到底出在哪里。发现就是执行到这一行代码停住了`await queryInterface.createTable('productTags', {productTags_id: { type: INTEGER, autoIncrement: true, primaryKey: true }});`

一开始我以为是关系或约束定义的有问题，结果巧然发现就是个命名的问题。

### Seed 数据插入

- 利用 Sequelize seed 创建种子数据的时候，注意不要手动插入自增的主键！不然之后自增主键会出错。
- 利用 Sequelize seed 创建种子数据的时候，要手动插入 create_at 和 update_at，不然会出错。

当使用`npx sequelize-cli seed:generate --name demo-tag`时，会在 `database/migrations` 目录下生成一个 migration 文件(`${timestamp}-[demo-tag].js`) 。

遇到的坑与解决方法如下：

```js
up: async (queryInterface, Sequelize) => {
    const { INTEGER } = Sequelize;
    const tagSeeds = [
      {
        // id:1  不用手动添加id，Sequelize会默认自动添加
        tag_name: 'JavaScript',
        tag_color: 'red',
        created_at: new Date(), // 即使设置了默认值，但也要在这里手动插入
        updated_at: new Date(), // 即使设置了默认值，但也要在这里手动插入
      },
      ...
    ];
   await queryInterface.bulkInsert('tag', tagSeeds);
  },
down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('tag', null, {});
    ...
},
```

总之，Sequelize 是给 JS 提供的一套便利操作数据库的工具，它的特性不仅可以让开发人员少些代码，抽象化数据模型，还能防止 SQL 注入，迁移工具等等。但是其中还是有很多细节上的问题还是需要开发人员灵活处理。



