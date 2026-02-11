---
title: 'Ubuntu22.04'
pubDate: 2022-07-01
description: '这是我 Astro 博客的第二篇文章。'
author: 'Elon Woo'
image:
    url: 'https://docs.astro.build/assets/rose.webp'
    alt: 'The Astro logo on a dark background with a pink glow.'
tags: ["astro", "blogging", "learning in public", "successes"]
likeCount: 7
shareCount: 2
docked: false
---

## 更换APT源

在Ubuntu 系统中，将 APT 源设置为国内镜像源可以提高软件包更新和下载速度，这里以阿里源为例。

### 1. 备份现有的源列表：

```
cd /etc/apt/
ls  // etc/apt/目录有个名为sources.list的文件
sudo cp sources.list sources.list.bak   // 备份
ls  // etc/apt/目录有个名为sources.list.bak的文件
```

### 2. 编辑 sources.list 文件：

使用以下命令打开 sources.list 文件：

```sudo vim sources.list```

### 3. 替换内容为阿里源：

删除文件原有内容

```
dG
````

根据Ubuntu 版本，将内容替换为对应的阿里源。以下是常见版本的源地址：

``` Ubuntu 22.04 (Jammy)
deb http://mirrors.aliyun.com/ubuntu/ jammy main restricted universe multiverse
deb http://mirrors.aliyun.com/ubuntu/ jammy-security main restricted universe multiverse
deb http://mirrors.aliyun.com/ubuntu/ jammy-updates main restricted universe multiverse
deb http://mirrors.aliyun.com/ubuntu/ jammy-backports main restricted universe multiverse
deb http://mirrors.aliyun.com/ubuntu/ jammy-proposed main restricted universe multiverse
```

``` Ubuntu 20.04 (Focal)
deb http://mirrors.aliyun.com/ubuntu/ focal main restricted universe multiverse
deb http://mirrors.aliyun.com/ubuntu/ focal-security main restricted universe multiverse
deb http://mirrors.aliyun.com/ubuntu/ focal-updates main restricted universe multiverse
deb http://mirrors.aliyun.com/ubuntu/ focal-backports main restricted universe multiverse
deb http://mirrors.aliyun.com/ubuntu/ focal-proposed main restricted universe multiverse
```

``` Ubuntu 18.04 (Bionic):
deb http://mirrors.aliyun.com/ubuntu/ bionic main restricted universe multiverse
deb http://mirrors.aliyun.com/ubuntu/ bionic-security main restricted universe multiverse
deb http://mirrors.aliyun.com/ubuntu/ bionic-updates main restricted universe multiverse
deb http://mirrors.aliyun.com/ubuntu/ bionic-backports main restricted universe multiverse
deb http://mirrors.aliyun.com/ubuntu/ bionic-proposed main restricted universe multiverse
```

### 4. 更新软件包索引：

// todo: 解释两个命令的意义
使用以下命令更新软件包索引并更新，定期执行该命令。

```sudo apt update & sudo apt upgrade```