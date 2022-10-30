---
title: 'Linux基础使用手册总结'
date: '2021-10-01'
excerpt: '在这个时代，软件开发工程师可能不懂什么是React，什么是SpringBoot，但绝对不可能不知道什么是Linux。本文总结了Linux的常用知识点，涵盖常用命令。'
cover: 'https://raw.githubusercontent.com/Ruoyu-Klaus/pics/main/images/linux_bash.jpeg'
tags:
  - Linux
---

# 一、什么是Linux？

> Linux is a family of open-source Unix-like operating systems based on the Linux kernel, an operating system kernel first released on September 17, 1991, by Linus Torvalds.

- Linux一般用来做服务器端的操作系统。
- 大部分嵌入式设备（机顶盒、物联网、智能家居、手机、数字电视）也使用Linux系统。
- Linux简史：[https://dev.to/rupendra/a-brief-history-of-linux-3lcm](https://dev.to/rupendra/a-brief-history-of-linux-3lcm)
- Linux主要指内核（[https://www.kernel.org/](https://www.kernel.org/)），发行版是在内核基础上进行了包装。
- Linux主要发行版：Ubuntu、RedHat、CentOS、Debain、Fedora、SuSe、OpenSUSE

### 为什么学Linux？

1. 可以做Linux运维
2. 嵌入式开发--运行稳定，低成本、可裁剪
3. Python、人工智能、JavaEE，web项目部署的基础

## 主要学习内容？

1. 怎么创建文件夹、保存文件、控制文件权限、运行程序、安装程序等等
2. 虚拟机的使用
3. 线程管理、内存管理等

- 虚拟机的安装与使用

> 虚拟机实际上就是一款软件用来虚拟出来一台计算机，并占用真实电脑的配置比如部分硬盘和内存容量。目前流行的虚拟机软件有VMware(VMWare ACE）、Virtual Box和Virtual PC，它们都能在Windows系统上虚拟出多个计算机。

虚拟机网络连接三种模式

1. 桥接模式：虚拟系统可以和外部系统通信，属于局域网中同一个网段，但是容易出现IP冲突。
2. NAT模式：虚拟机和主机直接形成一个独立相互通信的网络，然后虚拟机通过主机IP代理进入外部的局域网。
3. 主机模式：独立的系统，与外部网络无关。

安装vmware-tools：

[https://blog.csdn.net/dengjin20104042056/article/details/106396644](https://blog.csdn.net/dengjin20104042056/article/details/106396644)

## Linux目录结构

> 在Linux的世界里，一切皆为文件

```
Linux的目录为树状结构，最上层也就是根目录为`/`

/bin (/usr/bin、/usr/local/bin)
是Binary的缩写，这个目录存放最经常使用的命令

/sbin (/usr/sbin、/usr/local/sbin)
s为super，在这里存放系统管理员使用的系统管理程序

/home
存放用户的主目录，每一个用户都会有一个自己的目录，目录名一般以用户名为命名

/root
系统管理员的主目录

/lib
Linux开机所需要的最基本的动态连接共享库，类似于Windows的DDL文件

/etc
所有系统管理需要的配置文件和子目录，比如mysql数据库my.conf

/usr
程序目录，用户很多应用程序和文件都放在这个目录下，类似于Windows的program files目录

/usr/local
用户级程序目录

/opt
通常为主机额外安装软件的目录。一般为大型

/boot
存放启动Linux时候使用的一些核心文件，包括连接和镜像文件

/dev
类似于Windows的设备管理器，把所有的硬件用文件形式存储

/media
Linux系统会自动识别一些设备，如U盘，识别后把其设备挂载到这个目录下

/mnt
临时挂载其他文件系统

/opt
通常为主机额外安装软件的目录。一般为大型软件或服务程序的安装目录。

/var
目录通常放置一些增量或者经常修改的文件，比如日志文件。

```

# 二、常用命令

## **ls**

```
-l ：列出长数据串，包含文件的属性与权限数据等
-a ：列出全部的文件，连同隐藏文件（开头为.的文件）一起列出来（常用）
-d ：仅列出目录本身，而不是列出目录的文件数据
-h ：将文件容量以较易读的方式（GB，kB等）列出来
-R ：连同子目录的内容一起列出（递归列出），等于该目录下的所有文件都会显示出来

eg：
列表展示
ls -l
显示隐藏文件
ls -a
列表展示并以k为单位显示大小
ls -lh
```

## 2.grep

该命令常用于分析一行的信息，若当中有我们所需要的信息，就将该行显示出来，该命令通常与管道命令一起使用，用于对一些命令的输出进行筛选加工等等，它的简单语法为

```
grep [-acinv] [--color=auto] '查找字符串' filename
-a ：将binary文件以text文件的方式查找数据
-c ：计算找到‘查找字符串’的次数
-i ：忽略大小写的区别，即把大小写视为相同
-v ：反向选择，即显示出没有‘查找字符串’内容的那一行

# 取出文件/a.text中包含hellworld的行，并把找到的关键字加上颜色
grep -i --color=auto 'helloworld' /a.txt
# 把ls -l的输出中包含字母file（不区分大小写）的内容输出
ls -l | grep -i file
```

## 3.find

find是一个基于查找的功能非常强大的命令。

```
find [PATH] [option] [action]

# 与时间有关的选项：
-mtime n : n为数字，意思为在n天之前的“一天内”被更改过的文件；
-mtime +n : 列出在n天之前（不含n天本身）被更改过的文件名；
-mtime -n : 列出在n天之内（含n天本身）被更改过的文件名；
-newer file : 列出比file还要新的文件名
# eg：
find /root -mtime 0 # 在当前目录下查找今天之内有改动的文件

# 与用户或用户组名有关的选项：
-user name : 列出文件所有者为name的文件
-group name : 列出文件所属用户组为name的文件
-uid n : 列出文件所有者为用户ID为n的文件
-gid n : 列出文件所属用户组为用户组ID为n的文件
# eg：
find /home/ljianhui -user ljianhui # 在目录/home/ljianhui中找出所有者为ljianhui的文件

# 与文件权限及名称有关的选项：
-name filename ：找出文件名为filename的文件
-size [+-]SIZE ：找出比SIZE还要大（+）或小（-）的文件
-tpye TYPE ：查找文件的类型为TYPE的文件，TYPE的值主要有：一般文件（f)、设备文件            （b、c）、目录（d）、连接文件（l）、socket（s）、FIFO管道文件（p）；
-perm mode ：查找文件权限刚好等于mode的文件，mode用数字表示，如0755；
-perm -mode ：查找文件权限必须要全部包括mode权限的文件，mode用数字表示
-perm +mode ：查找文件权限包含任一mode的权限的文件，mode用数字表示
# eg
find / -name passwd # 查找文件名为passwd的文件
find . -perm 0755 # 查找当前目录中文件权限的0755的文件
find . -size +12k # 查找当前目录中大于12KB的文件，注意c表示byte
```

locate

利用locate索引数据库，快速查找文件

执行前需要更新数据库

```
updatedb
loacte 文件名
```

## 4.cp

复制命令，也可以把多个文件一次性地复制到一个目录下

```
-a ：将文件的特性一起复制
-p ：连同文件的属性一起复制，而非使用默认方式，与-a相似，常用于备份
-i ：若目标文件已经存在时，在覆盖时会先询问操作的进行
-r ：递归持续复制，用于目录的复制行为
-u ：目标文件与源文件有差异时才会复制

eg:
cp -a file1 file2 #连同文件的所有特性把文件file1复制成文件file2
cp file1 file2 file3 dir #把文件file1、file2、file3复制到目录dir中
```

## 5.mv

移动文件、目录或更名

```
-f ：force强制的意思，如果目标文件已经存在，不会询问而直接覆盖
-i ：若目标文件已经存在，就会询问是否覆盖
-u ：若目标文件已经存在，且比目标文件新，才会更新

eg:
mv file1 file2 file3 dir # 把文件file1、file2、file3移动到目录dir中
mv file1 file2 # 把文件file1重命名为file2
```

## 6.ps

用于将某个时间点的进程运行情况选取下来并输出，process。

```
-A ：所有的进程均显示出来
-a ：显示所有进程包括其他用户的进程
-u ：有效用户的相关进程
-x ：显示后台进程运行的参数
-l ：较长，较详细地将PID的信息列出
-f ：做一个更为完整的输出，显示全格式
-e ：显示所有进程

eg:
ps -ef | grep java # 列出和java有关的进程
ps -aux # 查看系统所有的进程数据截断command列
ps -aef # 查看系统所有的进程数据包括command列
ps -lA # 查看系统所有的进程数据
ps axjf # 查看连同一部分进程树状态
```

> 与ps类似的还有top指令，用户动态的监控进程

```
-d [秒数] # 指定每隔几秒刷新一次。默认3秒
-i       # 使top不显示任何闲置或者僵死进程
-p [pid] # 指定进程ID来监控某个进程状态

eg：
top -d 3

P   按CUP使用率排序
M   按照内存使用排序
N   按照PID排序
u   输出用户名查看指定用户进程
k   输入PID杀死特定进程
```

## 7.rm

```
-f ：就是force的意思，忽略不存在的文件，不会出现警告消息
-i ：互动模式，在删除前会询问用户是否操作
-r ：递归删除，最常用于目录删除，它是一个非常危险的参数，无法复原
-d : 表示删除目录，只能删除空文件夹

eg:
rm -d a    # 删除文件夹a
rm -rf dir # 强制删除目录dir中的所有文件
```

## 8.kill

```
-l : 列出全部的信号信息名称。

常见信号：
1：SIGHUP，重新加载进程
2：SIGINT，相当于输入ctrl+c，中断一个程序的进行
9：SIGKILL，强制中断一个进程
15：SIGTERM，以正常的结束进程方式来终止进程
17：SIGSTOP，相当于输入ctrl+z，暂停一个进程的进行

eg：
kill -KILL <pid>  # 强行杀死一个进程
kill -1 <pid> # 重新加载一个进程

```

## 9.killall

杀死一个指定名字的所有进程

```
killall [options] [name]

-e | --exact ： 进程需要和名字完全相符
-I | --ignore-case ：忽略大小写
-g | --process-group ：结束进程组
-i | --interactive ：结束之前询问
-l | --list ：列出所有的信号名称
-q | --quite ：进程没有结束时，不输出任何信息
-r | --regexp ：将进程名模式解释为扩展的正则表达式。
-s | --signal ：发送指定信号
-u | --user ：结束指定用户的进程
-v | --verbose ：显示详细执行过程
-w | --wait ：等待所有的进程都结束

eg：
killall -e firefox # 杀死名为filrfox的进程
killall -HUP syslogd # 重新启动syslogd
```

## 10.tar

可以把多个文件打包为一个包，也或者将改包解压

```
-c ： 新建打包文件
-x ： 解压打包文件
-v ： 处理过程中打印文件名信息
-f filename： 跟上需要处理的文件名
-t ： 列出包内的内容
-r ： 追加文件到包中
-C dir：后面指定压缩、解压的目录
-j ：通过bzip2的支持进行压缩/解压缩
-z ：通过gzip的支持进行压缩/解压缩

eg：
tar -cvf aAndb.tar a.txt b.txt # 将a.txt和b.txt打包名为aAndb.tar包
tar -xvf all.tar # 解压all.tar包到当前目录
tar -tf all.tar # 列出all.tar包中的所有文件
tar -cvzf aAndb.tar a.txt b.txt # 将a.txt和b.txt打包并压缩为aAndb.tar包

gzip 文件1    # 压缩文件1
gunzip 文件2  # 解压文件2
```

## 11.echo

输出内容、环境变量到控制台

```
echo $PATH
echo $HOSTNAME
```

## 12.less

less指令用来分屏查看文件内容，功能于more类似，但是比more 更强大，可以按需加载内容，对显示大文件具较高的效率

```
less 1.txt

space      # 键盘space 向下翻页
pagedown   # 键盘pagedown 向下翻页
pageup     # 键盘pageup 向上翻页
/[字符串]   # 查找字符串功能。之后按n：向下查找.N：向上查找
q          # 推出less
```

## 监控文件内容

```
tail -f 文件1
```

## 软连接的创建

```
ln -s a/text.txt text_softlink
```

## 重定向指令 >

把原本的输出内容重定向到目标文件下，会把原来内容覆盖

```
ls -l > 文件1        # 把列表内容写入文件1中
echo "Hello" > 文件2 # 把Hello写入文件2中
```

## 追加指令 >>

把原本输出内容追加到目标文件下

```
cat 文件1 >> 文件2 # 把文件1的内容追加到文件2中
```

## 关机重启命令

```
shutdown -h now   # 立刻关机
shutdown -r now   # 立刻重启
halt              # 关机
reboot            # 立刻重启
sync              # 把内存数据同步到磁盘
```

## 时间日期类

```
date            # 显示当前时间
date +%Y        # 显示当前年份
date +%m        # 显示当前月份
date +%d        # 显示当前那天
date "+%Y-%m-%d %H:%M:%S"     # 显示当年月日时分秒

cal             # 显示当前月份日历
cal 2021        # 显示年历
```

# 三、Vi与Vim

> Linux系统内置了vi文本编辑器，类似于Windows下的记事本

> Vim具有程序编程能力，相当于vi的升级版，可以识别语法的正确性，错误跳转。代码补全等功能。

## 常用的三种模式：

### 正常模式

以vim打开一个档案就可以进入正常模式。在这个模式中，可以使用方向键来移动光标，可以使用删除字符或删除整行来处理内容，可以使用复制粘贴来处理文件数据。

```
yy    # 拷贝当前行
2yy   # 拷贝当前下面的2行
p     # 粘贴当前拷贝内容
dd    # 删除当前行
4dd   # 删除当前下面4行
/word # 查找文件中的内容如：word 并按 n 查找下一个
gg    # 快速定位道文件首行
G     # 快速定位文件尾行
u     # 撤销
10 shift+g # 快速将光标移动到10行
```

### 插入模式

按下i，I，o，O，a，A，r，R任何一个字母之后会进入编辑模式。一般按i就行。

### 命令行模式

输入esc，再输入：进入命令行模式，在这个模式中，可以提供相关指令，完成读取、存盘、替换、离开vim、显示行号等。

```
:wq         # 保存并推出
:q          # 推出
:q!         # 强制对出并且不保存
:set nu     #显示行号
:set nonu   #取消显示行号

```

# 四、用户管理

> Linux系统是一个多用户多任务的操作系统，每个用户必须属于一个组，不能独立于组外。在Linux中每个文件有所有者、所在组、其他组的概念。

```
cat /etc/group  # 查看所有组
cat /etc/passwd # 查看所有用户
```

## 切换用户

```
su - [用户名]
```

## 添加\删除用户

```
-c 备注 加上备注。并会将此备注文字加在/etc/passwd中的第5项字段中
-d 用户主文件夹。指定用户登录所进入的目录，并赋予用户对该目录的的完全控制权
-e 有效期限。指定帐号的有效期限。格式为YYYY-MM-DD，将存储在/etc/shadow
-f 缓冲天数。限定密码过期后多少天，将该用户帐号停用
-g 主要组。设置用户所属的主要组
-G 次要组。设置用户所属的次要组，可设置多组
-M 强制不创建用户主文件夹
-m 强制建立用户主文件夹，并将/etc/skel/当中的文件复制到用户的根目录下
-p 密码。输入该帐号的密码
-s shell。用户登录所使用的shell
-u uid。指定帐号的标志符user id，简称uid

useradd [用户名]
useradd -d [指定目录] [用户名]    # 在指定目录下创建用户

passwd [用户名]  # 设定指定用户密码

userdel [用户名]  # 删除指定用户并保留目录
userdel -r [用户名]  # 删除指定用户并删除目录
```

## 添加\删除组

```
# 添加组
groupadd [组名]

# 删除组
groupdel [组名]

# 添加用户到组
useradd -g [用户组] [用户名]

# 修改用户组
usermod -g [用户组] [用户名]

# 改变用户登录的初始目录,注意，用户需要拥有进入新目录的权限。
usermod -d [目录名] [用户名]
```

## 改变文件所有者

```
-R 目录下子文件递归生效

eg:
chown [用户名] [文件名\目录名]
chown [用户名]:[组名] [文件\目录名]

```

## 修改文件所在的组

```
-R 目录下子文件递归生效

chgrp [组名] [文件名]
```

# 五、运行级别

```
0 : 关机
1 : 单用户【找回丢失密码】
2 : 多用户状态没有网络服务
3 : 多用户状态有网络服务
4 : 系统未使用保留给客户
5 : 图形界面
6 : 系统重启

常用运行级别 3 和 4

```

切换运行级别

```
init 【0123456】
```

# 六、权限管理

## rwx权限



![rwx-graph](https://raw.githubusercontent.com/Ruoyu-Klaus/pics/main/images/download.png)



## 修改文件权限【chmod】

> 通过chmod指令，可以修改文件或者目录的权限。

第一种方式： +、-、= 变更权限

u：所有者 g：所有组 o：其他人 a:所有人

```
# 变更所有者权限为rwx，所有组为rx，其他组为x
chmod u=rwx,g=rx,o=x [文件\目录名]

# 给其他组添加w权限
chmod o+w [文件\目录名]

# 给所有人移除x权限
chmod a-x [文件\目录名]
```

第二种方式：利用数字变更权限

r=4 w=2 x=1 rwx=4+2+1=7

```
# 变更所有者权 限为rwx，所有组权限为rw，其他组为x
chmod 761 [文件\目录名]
```

# 七、任务调度

## crond任务

> 任务调度：是指系统在某个时间执行的特定的命令或者程序

> 任务调度分类：

> 1. 系统工作，比如扫描病毒

> 2. 个人用户工作，比如mysql数据库的备份

### 基本语法

```
-e   # 编辑crontab定时任务
-l   # 查询crontab任务
-r   # 删除当前用户所有crontab任务

crontab [选项]
```

### 任务调度时间参数

![cron-paramters](https://raw.githubusercontent.com/Ruoyu-Klaus/pics/main/images/word-image-77.png)

```
*/1 * * * * ls -hl /etc/passwd
```

## at定时任务

> 1. at命令是一次性定时计划任务，执行完一个任务后便不再执行此任务了。at的守护进程atd会以后台模式运行，检查job队列来进行。

> 2. 默认情况下，atd守护进程没60s检查一次job队列，若有job会检查job运行时间，如果时间于当前时间匹配，则运行此job。

> 3. at命令在使用时候一定要保证atd进程的启动。

### 基本语法

```
at [选项] [时间]

atq              # 列出队列中的任务
atrm [job编号]    # 删除队列中的任务
```

ctrl + d 二次结束at命令的输入



# 八、磁盘分区与挂载

## Linux磁盘分区与目录关系

> Linux采用一种载入的方法，把磁盘中的一个分区和一个目录联系起来。

![partition-directory](https://raw.githubusercontent.com/Ruoyu-Klaus/pics/main/images/Screenshot_20201019_162958.png)

```
# 查看所有设备挂载情况
lsblk
lsblk -f

# 查看磁盘分区使用情况
df -h
# 查看特定目录中文件磁盘空间使用情况
du -ah
```

## 磁盘分区、格式化、挂载流程

### 磁盘分区

```
fdisk /dev/sdb  # 对磁盘sdb进行分区

-m # 显示命令列表
-p # 显示磁盘分区
-n # 新增分区
-d # 删除分区
-w # 写入并退出
```

### 磁盘格式化

```
mkfs -t ext4 /dev/sdb1 # 对磁盘某一分区进行格式化
```

### 挂载与卸载

```
mount [磁盘分区目录] [系统目录] # 将一个分区与一个目录联系起来
umount [磁盘分区目录] [系统目录] # 卸载分区与目录的联系

# 用命令mount挂载系统重启后会失效，因此想要永久生效需要修改文件

vim /etc/fstab

```

# 九、网络环境配置

Windows中查看网络配置指令（ipconfig）

Linux中查看网络配置指令（ifconfig）

## 自动分配ip地址

> 本地DHCP服务开启后将可用的ip地址自动分配给虚拟机。

NAT网络配置

> 虚拟机的ip地址与主机适配器vmnet8的ip地址要在同一个网段，保证它们互相直接能够ping通。



## 指定Linux本地ip地址

例如Centos7.1

```
vim /etc/sysconfig/network-scripts/ifcfg-ens33

DEVICE     接口名（设备,网卡）
USERCTL    [yes|no]（非root用户是否可以控制该设备）
BOOTPROTO  IP的配置方法[none|static|bootp|dhcp]（引导时不使用协议|静态分配IP|BOOTP协议|DHCP协议）
HWADDR     MAC地址
ONBOOT     系统启动的时候网络接口是否有效（yes/no）
TYPE       网络类型（通常是Ethemet）
NETMASK    网络掩码
IPADDR     IP地址
IPV6INIT   IPV6是否有效（yes/no）
GATEWAY    默认网关IP地址
BROADCAST  广播地址
NETWORK    网络地址

#######################设置静态地址例子######################

TYPE="Ethernet"
PROXY_METHOD="none"
BROWSER_ONLY="no"
#BOOTPROTO="dhcp"
DEFROUTE="yes"
IPV4_FAILURE_FATAL="no"
IPV6INIT="yes"
IPV6_AUTOCONF="yes"
IPV6_DEFROUTE="yes"
IPV6_FAILURE_FATAL="no"
IPV6_ADDR_GEN_MODE="stable-privacy"
NAME="ens33"
UUID="ac9b66bf-74fb-4bda-b89f-c66ff84c9571"
DEVICE="ens33"
#ONBOOT="yes"

#static assignment
NM_CONTROLLED=no #表示该接口将通过该配置文件进行设置，而不是通过网络管理器进行管理
ONBOOT=yes #开机启动
BOOTPROTO=static #静态IP
IPADDR=192.168.59.134 #本机地址
NETMASK=255.255.255.0 #子网掩码
GATEWAY=192.168.59.2 #默认网关
DNS1=8.8.8.8
DNS2=8.8.4.4

```

设置完成后可以重启网络服务或者重启系统

```
service network restart
# 或者
reboot
```

## 设置主机名与host映射

查看主机名指令：

```
hostname
```

修改文件设置主机名:

```
vim /etc/hostname
```

Windows下设置host映射文件:

```
C:\Windows\System32\drivers\hosts
```

Linux设置host映射文件：

```
vim /etc/hosts
```

## 4.主机名解析机制（hosts，DNS）

- 浏览器先检查缓存中有没有该域名解析IP地址。
- 如果没有，就检查DNS解析器缓存。（一般来说，当电脑第一次成功访问某网站后，在一段时间内，浏览器或者操作系统会缓存它的IP地址到本机中）
  - ipconfig /displaydns //查看DNS域名解析器缓存
  - ipconfig /flushdns //手动清理DNS缓存
- 如果没有，就检查系统中hosts文件中有没有对应的域名IP映射。
- 如果没有，则到DNS域名服务商来进行解析。



## 5.监控系统网络状态(netstat)

```
-an # 按照一定顺序排列输出
-p  # 显示按个进程在调用

netstat -anp
```

# 十、服务（Service）管理

> 服务本质就是进程，但是是运行在后台的，通常都会监听某一个端口，等待其他程序的请求，比如mysqld、sshd、防火墙等。因此有称为守护进程。

- service 管理指令

```
service [服务名] [start|stop|restart|reload|status]
```

```
# 查看service指令管理的服务
ls -lh /etc/init.d
```

- systemctl 管理

systemctl指令管理的服务在/usr/lib/systemd/system 查看

```
systemctl [start|stop|restart|reload|status] [服务名]
```

```
# 查看systemctl指令管理的服务
systemctl list-unit-files

# 设置服务开机启动
systemctl enable [服务名]
# 关闭服务开机启动
systemctl disable [服务名]
# 检查服务是否开机自启
systemctl is-enabled [服务名]
```