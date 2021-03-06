---
title: '数据库命名的坑'
date: '2021-08-04'
excerpt: '对于基础不扎实或者不太熟悉数据库的前端同学，可能在使用过程中会遇到各种各样的问题。比如如何正确选取字段名称。'
cover: 'https://i.loli.net/2021/09/08/U1ujyFPVQsvcaz2.png'
tags:
  - Postgres
---



前段时间，我在写后端相关的内容，需要使用数据库。在Postgres，我成功的创建了名为`user`的表，并插入了一条数据。但是很奇怪，用`psql`选取该`SELECT * FROM user`表时，却始终打印不出来我存的数据。百思不得其解。

![unable find user](https://i.loli.net/2021/09/08/U1ujyFPVQsvcaz2.png)

最后发现是因为**`user`是 postgreSQL 的保留字段**，要想访问就必须使用双引号来正确引用该表，如`SELECT * FROM "user"`。

当然不建议使用保留字段来作为表名或者字段名。因此，下次再创建表或者字段的时候一定要多加注意，提前查阅该数据库默认的保留字段----[Postgres Keywords](https://www.postgresql.org/docs/current/sql-keywords-appendix.html)

这里列举一个通用的命名规范仅供参考

表名:

- 26 个英文字母和 0-9 的自然数加上下划线`_`组成，命名简洁明确，多个单词用下划线`_`分隔

- 全部小写命名，禁止出现大写

- 禁止使用数据库关键字，如：name，time ，datetime，password 等

- 表名称不应该取得太长（一般不超过三个英文单词）

- 表的名称一般使用名词或者动宾短语

- 用单数形式表示名称，例如，使用 employee，而不是 employees

列名:

- 26 个英文字母和 0-9 的自然数加上下划线`_`组成，命名简洁明确，多个单词用下划线`_`分隔

- 全部小写命名，禁止出现大写

- 字段必须填写描述信息

- 禁止使用数据库关键字，如：name，time ，datetime password 等

- 字段名称一般采用名词或动宾短语

- 采用字段的名称必须是易于理解，一般不超过三个英文单词

- 在命名表的列时，不要重复表的名称
- 不要在列的名称中包含数据类型

- 字段命名使用完整名称，禁止缩写
