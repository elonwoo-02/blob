---
title: "我常使用的 Git 命令与应用场景"
pubDate: 2025-09-18
description: "以加西亚·马尔克斯的笔触，记录我日常最常用的 Git 命令与它们各自的场景。"
author: "Elog"
image:
  url: ""
  alt: "Terminal window on a dark background."
tags: ["git", "workflow", "tools", "devlog"]
likeCount: 0
shareCount: 0
docked: false
---

在我那间终端微微发热的房间里，Git 像一支迟早会开口的笔，记录着每一次修改的潮汐：它不是记忆本身，而是给记忆一个可以返回的港口。下面是我最常用的一组命令与它们各自的应用场景，我把它们写成一份简短的清单，像一封不紧不慢的信。

## 1) 观察：我现在站在哪

当我不确定脚下的地是干是湿时，总会先看看：

```bash
git status -sb
```

- **场景**：开始工作前、提交前、切换分支前。
- **作用**：快速确认当前分支、是否有未提交变更，以及是否落后于远端。

## 2) 选择：我只带走要提交的那部分

我习惯把提交分成小块，好让未来的自己读得懂当时的意图。

```bash
git add .
git add -p
```

- **场景**：完成一个小功能、修复一个小问题。
- **作用**：`git add -p` 可以把同一文件中的变化拆分成更干净的提交。

## 3) 叙述：为这次变化起一个好名字

```bash
git commit -m "feat: add terminal command panel"
```

- **场景**：每次提交都要写清楚目的。
- **作用**：让历史读起来像一条清晰的路径，而不是杂乱的足迹。

## 4) 对比：我和过去有何不同

```bash
git diff
git diff --staged
```

- **场景**：提交前确认改动；复盘为什么出现 Bug。
- **作用**：理解改动的范围和影响。

## 5) 时间倒流：撤销一次不该发生的改变

```bash
git restore path/to/file
git restore --staged path/to/file
```

- **场景**：改错文件、加入了不该加入的内容。
- **作用**：不污染历史，只回到上一个清晰的时刻。

## 6) 暂存：给未完成的工作一个抽屉

```bash
git stash push -m "wip: dock polish"
git stash pop
```

- **场景**：突然需要切换分支修复紧急问题。
- **作用**：把现场暂时收好，回来时继续。

## 7) 同步：和远处的自己对齐

```bash
git fetch origin
git pull --rebase
git push origin main
```

- **场景**：上线前、合并前、每日的第一件事。
- **作用**：避免无谓的合并噪声，让历史更平顺。

## 8) 历史：追溯某一刻的来由

```bash
git log --oneline --graph --decorate -20
git blame path/to/file
```

- **场景**：想知道“为什么会这样写”。
- **作用**：`log` 看演进，`blame` 找责任。

## 9) 重写：让历史像故事而不是草稿

```bash
git rebase -i HEAD~5
```

- **场景**：提交过多、想合并或重命名。
- **作用**：把杂乱的片段整理成一段可以讲述的脉络。

> 这一行命令像潮水回收海滩上的脚印：它不否认曾经走过，而是把它们排成一条更好读的路。

## 10) 分支：为一个想法留一条岔路

```bash
git switch -c feature/terminal
git switch main
```

- **场景**：开始一个新功能或试验。
- **作用**：把不确定的探索和稳定的主线隔开。

---

这些命令之所以常用，不是因为它们复杂，而是因为它们像日常生活中的杯子、门、钥匙，早晚都要用到。只要你愿意把每一次变化写清楚、放整齐，Git 就会在某个夜晚替你记住那段潮湿的时间，等你回头时仍能看见它。 
