# macOS 风格 Dock 导航设计与实现文档

## 1. 目标

为 Astro + Tailwind CSS + daisyUI 博客实现一个固定悬浮在底部的 macOS 风格 Dock：

- 左侧：系统导航（首页 / 博客 / 关于）
- 中间：竖线分隔
- 右侧：动态打开项（最近访问文章）+ 固定外链（GitHub）
- 支持磨砂玻璃、悬停放大、Tooltip、3 秒自动隐藏、底部感应唤醒
- 支持点击 Dock 项目右上角关闭按钮移除项目

## 2. 组件结构

- `src/components/Dock.astro`
  - Dock 主容器
  - 负责左右分区布局、自动隐藏逻辑、动态打开项管理
- `src/components/DockItem.astro`
  - 单个图标项封装
  - 负责 tooltip、图标显示、放大动画、关闭按钮

## 3. 交互设计

1. 鼠标移入 Dock：
   - 立即显示 Dock
   - 清除隐藏计时器
2. 鼠标移出 Dock：
   - 启动 3 秒隐藏计时器
3. 鼠标靠近底部 100px：
   - 强制显示 Dock
4. 悬停图标：
   - `scale(1.3)` + 阴影增强
   - daisyUI tooltip 显示标题
5. 打开文章页：
   - 将当前页面记录到 `localStorage(dock-opened-items)`
   - 右侧动态区展示最近 5 条记录
6. 点击关闭按钮（✕）：
   - 立即从 Dock 视图移除该项

## 4. 样式要点

- 容器：`bg-black/55 + backdrop-blur-md + border-white/30 + shadow-2xl`
- 定位：`fixed bottom-0` + 水平居中
- 动画：`transform + opacity + transition-all`
- 分隔线：`h-8 w-px bg-white/40`
- 响应式：`md` 以上显示，移动端隐藏

## 5. 集成点

在 `src/layouts/BaseLayout.astro` 中插入：

- `import Dock from '../components/Dock.astro';`
- `<Dock pageTitle={pageTitle} currentPath={Astro.url.pathname} />`

这样所有页面共享同一套 Dock 行为。

## 6. 本地运行

```bash
npm run dev -- --host 0.0.0.0 --port 4321
```

访问 `http://127.0.0.1:4321` 可查看效果。
