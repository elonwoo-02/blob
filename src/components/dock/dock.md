# Dock 组件说明

## 元信息
- **适用范围**：`src/components/dock` 目录下的 Dock 组件体系。
- **运行环境**：Astro (v5.x) + Tailwind CSS (v4.x) + daisyUI (v5.x)。
- **入口文件**：`ui/Dock.astro`（UI）与 `logic/dockController.ts`（行为逻辑）。
- **初始化方式**：页面加载时调用 `initDock()` 完成事件绑定与渲染。

## 功能概览
- **左右栏 Dock**：左侧为固定功能入口，右侧为“最近打开文章”入口。
- **右栏去重**：点击文章后只加入一次，按路径去重并保持最近优先。
- **活动窗口**：点击右栏条目打开活动窗口（iframe），支持拖拽、缩放、最小化、关闭。
- **可见性控制**：靠近底部显示，离开或滚动后延迟隐藏。
- **快捷动作**：回到顶部、主题切换、外部链接等。

## 样式风格
- **Mac Dock 质感**：半透明黑底 + 背景模糊 + 圆角 + 轻量阴影。
- **图标放大**：Hover 时图标轻微放大，保持视觉动效一致。
- **活动窗口**：灰白渐变标题栏 + 轻薄阴影 + 轻量开窗动画。

## 原始设计文档要点（来自根目录 `dock.md`）
### 概述
- 目标：为个人博客构建高度仿真的 macOS 风格 Dock 栏导航组件。
- 视觉：磨砂玻璃质感、分区导航、图标交互动画、智能自动隐藏。

### 技术栈
- 框架：Astro (v5.x)
- 样式：Tailwind CSS (v4.x)
- 组件库：daisyUI (v5.x)
- 交互：原生 JavaScript + CSS Transitions

### 视觉与布局
- 磨砂玻璃：`backdrop-blur-md` + 半透明背景（如 `bg-black/20`）。
- 布局分区：
  - 左侧：固定系统导航（首页、博客、关于等）。
  - 中竖线：视觉分隔符。
  - 右侧：动态内容（最近文章、外链等），支持增删。
- 图标风格：简洁 SVG，适配深色/浅色主题。

### 交互逻辑
- Hover 放大：`hover:scale-125` + tooltip。
- 自动隐藏：
  - 鼠标离开 Dock 区域约 3 秒隐藏。
  - 鼠标靠近屏幕底部感应区（约 20px）自动显示。
- 实现方式：`transform: translateY()` + `setTimeout` + 事件监听。

### 交互细节
- 鼠标进入：图标放大、阴影增强、显示 tooltip、重置隐藏计时器。
- 鼠标离开：图标复位、阴影恢复、隐藏 tooltip、启动隐藏计时器。
- 鼠标移至屏幕底部：立即显示 Dock、清除隐藏计时器。
- 点击条目：站内在当前页打开；外链在新标签页打开。

## 实现要点
- **数据持久化**：右栏条目与活动窗口位置使用 `localStorage` 存储。
- **路径归一化**：通过 `normalizeHref` 统一相对/绝对路径，避免重复项。
- **事件绑定**：
  - Dock 点击：仅对右栏 `data-removable="true"` 的条目触发活动窗口。
  - 可见性：`pointermove` + `scroll` 统一判断显示/隐藏。
- **窗口行为**：
  - 打开：若已存在则切换显示；否则创建新窗口。
  - 最小化：缩放并隐藏；再次点击恢复。
  - 关闭：移除窗口，并同步右栏条目。

## 接口与配置清单
### 关键 DOM 约定
- Dock 容器：`#mac-dock`
- 活动窗口层：`#dock-activity`
- 活动窗口模板：`#dock-activity-template`

### 关键入口函数
- `initDock(selector = '#mac-dock')`
  - 功能：初始化 Dock 行为与右栏条目。
  - 位置：`logic/dockController.ts`

### 接口签名
```ts
export const initDock: (selector?: string) => void;
```

### 常量配置（默认值以实现为准）
- `data/dockConstants.ts`
  - `hideDelay`：自动隐藏延迟。
  - `showBoundary`：靠近底部显示的阈值。
  - `windowPadding`：活动窗口的边界留白。
  - `minActivityWidth/Height`：活动窗口最小尺寸。
  - `baseZIndex`：活动窗口初始层级。
  - `minimizeDuration` / `openDuration`：动画/跳转延迟。

### 配置默认值表
| 配置项 | 默认值 | 含义 |
| --- | --- | --- |
| `hideDelay` | `3000` | Dock 自动隐藏延迟（ms） |
| `showBoundary` | `100` | 距离底部显示阈值（px） |
| `windowPadding` | `12` | 活动窗口边界留白（px） |
| `minActivityWidth` | `360` | 活动窗口最小宽度（px） |
| `minActivityHeight` | `320` | 活动窗口最小高度（px） |
| `baseZIndex` | `70` | 活动窗口初始层级 |
| `minimizeDuration` | `180` | 最小化动画时长（ms） |
| `openDuration` | `320` | 打开跳转延迟（ms） |

## 约束与边界
- **iframe 限制**：若目标页面设置 `X-Frame-Options` 或 CSP，活动窗口将无法加载。
- **同源策略**：站外页面通常无法在 iframe 内加载或交互。
- **并发窗口**：当前设计允许多窗口存在，但不建议同时打开过多。
- **路径规则**：仅 `^/posts/.+` 被视为文章页并加入右栏。

## 使用示例
### 在布局中引入 Dock（UI）
```astro
---
import Dock from '../components/dock/ui/Dock.astro';
---

<Dock pageTitle={Astro.props.pageTitle} currentPath={Astro.url.pathname} />
```

### 手动初始化（如需）
默认由 `Dock.astro` 自行引入并执行 `initDock()`，一般无需手动调用。

## 结构划分
```
dock/
  ui/               # 纯展示层（Astro 组件）
    Dock.astro
    DockItem.astro
    DockActivityLayer.astro
    items/          # 单个 DockItem 组件（静态配置）
  logic/            # 交互与行为逻辑
    dockController.ts
    dockVisibility.ts
    dockActions.ts
    dockActivity.ts
  data/             # 数据与持久化
    dockStore.ts
    dockStorage.ts
    dockUtils.ts
    dockConstants.ts
  dock.md           # 当前说明文件
```

## 外部依赖组件
以下组件不归 Dock 目录管理，但被 Dock 直接引用或联动：
- `src/components/terminal/TerminalModal.astro`
  - 用途：终端弹窗（Modal）。
  - 关系：由 `ui/Dock.astro` 引入并渲染，Dock 仅负责触发与展示位置，不负责其内部逻辑。

## Dock Items 说明
以下描述面向用户与开发者，涵盖交互语义、行为与实现位置。

### 左栏固定入口
- **Home**
  - 用户行为：返回首页。
  - 实现：`ui/items/DockHomeItem.astro`
  - 细节：站内跳转，参与系统路径识别（不会加入右栏）。
- **Blog**
  - 用户行为：进入博客列表。
  - 实现：`ui/items/DockBlogItem.astro`
  - 细节：站内跳转，属于系统路径。
- **About**
  - 用户行为：进入关于页。
  - 实现：`ui/items/DockAboutItem.astro`
  - 细节：站内跳转，属于系统路径。
- **Bookmarks**
  - 用户行为：进入书签页。
  - 实现：`ui/items/DockBookmarksItem.astro`
  - 细节：站内跳转，属于系统路径。
- **Terminal**
  - 用户行为：打开终端模态框。
  - 实现：`ui/items/DockTerminalItem.astro`
  - 细节：通过 `action="terminal"` 标记，Dock 控制器以动作触发，不走外链或活动窗。
- **GitHub**
  - 用户行为：打开外部 GitHub 主页。
  - 实现：`ui/items/DockGitHubItem.astro`
  - 细节：`external={true}`，走新标签页外链逻辑（由 `DockItem` 处理）。
- **Bot**
  - 用户行为：预留入口（目前指向 `/`）。
  - 实现：`ui/items/DockBotItem.astro`
  - 细节：可替换为机器人页或聊天入口；当前不参与右栏逻辑。

### 左栏快捷动作
- **Top**
  - 用户行为：平滑回到顶部。
  - 实现：`ui/items/DockBackToTopItem.astro` + `logic/dockActions.ts`
  - 细节：`action="back-to-top"`，阻止默认跳转，通过 `window.scrollTo` 实现。
- **切换主题**
  - 用户行为：在浅色/深色间切换并持久化。
  - 实现：`ui/items/DockThemeToggleItem.astro` + `logic/dockActions.ts`
  - 细节：`action="theme-toggle"`，读取/写入 `localStorage` 的 `theme`。
- **RSS 订阅**
  - 用户行为：打开 `/rss.xml`。
  - 实现：`ui/items/DockRssLinkItem.astro`
  - 细节：外链行为，`external={true}`。

### 右栏动态入口（最近文章）
- **文章条目**
  - 用户行为：点击打开活动窗口（内容预览 iframe），再次点击可切换显示/隐藏。
  - 实现：`data/dockStore.ts` 负责渲染/去重，`logic/dockActivity.ts` 管理窗口。
  - 细节：
    - 去重规则：基于 `normalizeHref` 归一化后的路径。
    - 仅文章页加入：由 `logic/dockController.ts` 判断 `^/posts/.+` 且非系统路径。
    - 上限数量：默认保留最近 5 条（可在 `dockStore.ts` 调整）。

## 关键入口
- **UI 入口**：`ui/Dock.astro`
- **逻辑入口**：`logic/dockController.ts`
- **统一导出**：`index.ts`

## 右栏条目生命周期（文章条目）
1. **创建触发**：文章页加载时（`/posts/*`），`dockController` 判断为文章路径。
2. **数据归一化**：`normalizeHref` 统一 href，避免相对/绝对导致的重复。
3. **写入持久化**：`dockStore.addItem` 将条目写入 `localStorage`（`dock-opened-items`）。
4. **渲染入 DOM**：右栏只插入不存在的条目，避免重复渲染。
5. **点击打开**：触发 `dockActivity.open` 创建或唤醒活动窗口。
6. **最小化/关闭**：
   - 最小化：窗口隐藏但保留条目（可再次点击恢复）。
   - 关闭：移除窗口与对应条目，同时更新存储。
7. **刷新恢复**：页面刷新时，`dockStore.getItems()` 读取并渲染右栏。

## 事件流（关键交互）
- **Dock 显示/隐藏**
  - `pointermove` / `pointerenter` / `pointerleave` → `dockVisibility.evaluate`
  - `scroll` → 触发短暂延迟后隐藏
  - 输出：`dock` 元素 `transform/opacity` 变化
- **右栏点击（文章条目）**
  - `dock` 捕获点击 → `dockController` 判断 `data-removable="true"`
  - 调用 `activity.open`
  - 若窗口已存在：切换显示/隐藏；否则创建
- **关闭/最小化**
  - `close`：同步删除条目与窗口
  - `minimize`：窗口视觉隐藏但保留条目

## 可配置参数（常量）
位于 `data/dockConstants.ts`：
- `hideDelay`：隐藏延迟
- `showBoundary`：靠近底部显示阈值
- `windowPadding`：活动窗口边界留白
- `minActivityWidth/Height`：活动窗口最小尺寸
- `baseZIndex`：活动窗口初始层级
- `minimizeDuration` / `openDuration`：动画/跳转延迟

## 常见扩展建议
- **扩展系统路径**：在 `dockController.ts` 的 `isSystemPath` 列表中添加。
- **右栏条目上限**：在 `dockStore.ts` 的 `slice(0, 5)` 调整。
- **活动窗口默认尺寸**：修改 `dockConstants.ts` 或 `dockActivity.ts` 初始定位逻辑。

## 故障排查 / 常见问题
- **Dock 不显示**
  - 检查页面是否包含 `#mac-dock`。
  - 检查 `dock-hidden` 是否被写入 `localStorage`。
  - 检查 `Dock.astro` 是否正确引入 `initDock`。
- **右栏条目重复**
  - 确认 `normalizeHref` 是否返回一致路径。
  - 确认 `dockStore.addItem` 是否被重复触发（仅文章页应触发一次）。
- **点击右栏无活动窗口**
  - 检查 `DockActivityLayer.astro` 是否渲染。
  - 检查 `#dock-activity-template` 是否存在。
  - 检查是否有 JS 报错中断初始化。
- **活动窗口内容为空**
  - 检查 `href` 是否可访问。
  - 若为站内页面，确认路径未被路由重写影响。

## 性能注意事项
- **事件节流**：`pointermove` 使用 `requestAnimationFrame`，避免高频触发导致卡顿。
- **DOM 更新**：右栏渲染采用去重与局部插入，避免全量重绘。
- **localStorage**：读写频率较低，但仍建议避免在高频交互中直接写入。
- **iframe 负载**：活动窗口加载页面存在额外渲染开销，避免同时打开过多窗口。

## 变更记录
- `2026-02-08`：整理文档结构，补充接口与约束、故障排查与性能注意事项。

## 依赖说明与兼容矩阵
### 关键依赖
- `astro`：^5.17.1
- `tailwindcss`：^4.1.18
- `daisyui`：^5.5.17
- `@tailwindcss/vite`：^4.1.18

### 兼容性建议
| 依赖 | 建议版本 | 说明 |
| --- | --- | --- |
| `astro` | `^5.x` | 当前组件使用 Astro 5 语法与加载方式 |
| `tailwindcss` | `^4.x` | 样式类基于 Tailwind 4 |
| `daisyui` | `^5.x` | Tooltip 与按钮样式依赖 daisyUI 5 |

## API 变更策略 / 弃用策略
### 变更策略
- **语义化变更**：行为或交互逻辑变动需在文档中注明，并在 `变更记录` 中记录日期与影响范围。
- **向后兼容优先**：对外接口（如 `initDock` 签名、DOM 约定、数据结构）保持兼容，除非明确标记为破坏性变更。
- **配置变更透明化**：`dockConstants.ts` 的默认值变更必须同步更新“配置默认值表”。

### 弃用策略
- **弃用公告**：标记为 `Deprecated` 的接口至少保留一个版本周期。
- **过渡期支持**：弃用项在过渡期内保留行为，文档中提示替代方案。
- **移除标准**：移除前必须在 `变更记录` 中注明时间点与替代建议。

### 版本号规则
采用语义化版本 `MAJOR.MINOR.PATCH`：
- **MAJOR**：破坏性变更（接口/行为不兼容）。
- **MINOR**：向后兼容的新功能或新配置项。
- **PATCH**：不影响外部行为的修复与文档更新。
