---
title: 'Postgres使用Sequelize-migration的小坑'
date: '2021-08-06'
excerpt: '最近在用Sequelize ORM 来操作PostgresSQL数据库，然后就用到了sequelize-cli来维护和追踪数据库的初始化。虽然这个工具很早就开发了，但是仍然存在一些坑。'
cover: 'https://i.loli.net/2021/09/10/UW9fS1XjQpNI8hw.png'
tags:
  - Sequelize
  - Postgres
---

> 最近在用 Sequelize ORM 来操作 PostgresSQL 数据库，然后就用到了 sequelize-cli 来维护和追踪数据库的初始化。虽然这个工具很早就开发了，但是仍然存在一些坑。

- 利用 Sequelize migration 在创建表时候注意一定不要使用驼峰命名的方式！不然会失败，并且不会报错。
- 利用 Sequelize seed 创建种子数据的时候，注意不要手动插入自增的主键！不然之后自增主键会出错。
- 利用 Sequelize seed 创建种子数据的时候，要手动插入 create_at 和 update_at，不然会出错。

### 表名要小写

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

这件事看出来，没有完美的工具，没有完美的技术，要多试错，多学习了解，并随时记录下来，才能够进步。
