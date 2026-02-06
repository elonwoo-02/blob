macOS 风格 Dock 栏设计文档

# 1. 概述

为个人博客网站开发一个高度仿真的 macOS 风格 Dock 栏导航组件，采用组件化设计，macOS和命令行风格。

该组件固定悬浮在屏幕底部，具备磨砂玻璃质感、分区导航、图标交互动画以及智能自动隐藏功能。

# 2. 技术栈

框架: Astro (v5.x)

样式: Tailwind CSS (v4.x)

组件库: daisyUI (v5.x)

交互: 原生 JavaScript + CSS Transitions

# 3. 核心功能设计

## 3.1 视觉效果

- 磨砂玻璃 (Frosted Glass): 使用 backdrop-blur-md 和半透明背景色 (bg-white/20 或 bg-black/20) 实现。

- 布局分区:

  - 左侧: 固定系统导航（如首页、博客、关于）。

  - 中竖线: 视觉分隔符。

  - 右侧: 动态内容（如最近打开的文章、GitHub 链接等），支持添加和删除。

- 终端简约风: 图标采用简洁的 SVG 设计，配色方案支持terminal风格的深色/浅色模式适配。

## 3.2 交互逻辑

- 图标悬停 (Hover Effect):

  - 使用 hover:scale-125 实现平滑放大。

  - 结合 daisyUI 的 tooltip 显示标题。

- 自动隐藏 (Auto-hide):

  - 触发条件: 鼠标离开 Dock 区域 3 秒后自动向下平移隐藏。

  - 唤醒条件: 鼠标移动至屏幕底部感应区（底部 20px）时自动向上弹出。

- 实现方式: CSS transform: translateY() 配合 JavaScript setTimeout 和事件监听。

# 4. 组件结构

- Dock.astro: 主容器组件，处理布局和隐藏逻辑。

- DockItem.astro: 单个图标组件，处理悬停效果和 Tooltip。

# 5. 开发计划

- 基础样式搭建: 实现容器的磨砂效果和响应式布局。

- 图标组件封装: 优化 DockItem，集成 daisyUI 的 Tooltip。

- 隐藏逻辑实现: 编写客户端脚本处理鼠标交互。

- 内容集成: 在 BaseLayout.astro 中配置导航数据。

# 6. 交互细节

- 鼠标进入 Dock 项目

  - 图标放大至 1.3 倍

  - 阴影增强

  - 显示工具提示

  - 重置隐藏计时器

- 鼠标离开 Dock 项目

 - 图标缩小回原大小

 - 阴影恢复

 - 隐藏工具提示

 - 启动 3 秒隐藏计时器

- 鼠标移至屏幕底部

  - 检测鼠标在底部 100px 区域

  - 立即显示 Dock 栏

  - 清除隐藏计时器

- 点击 Dock 项目

  - 导航到指定链接

  - 外部链接在新标签页打开

  - 内部链接在当前标签页打开

- 点击左栏Dock项目的叉号：该项目从Dock中消失

- 等等功能