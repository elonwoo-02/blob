# Blog页面布局 - 视觉说明

## 默认状态（Sidebar打开）

```
┌─────────────────────────────────────────────────────────────┐
│                        浏览器视口                             │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│           ┌──────────────────────────────────┐              │
│           │   blog-wrapper (flex center)     │              │
│           ├─────────────────┬────────────────┤              │
│           │                 │                │              │
│           │ Sidebar (320px) │ Main-Content   │              │
│           │   - Heatmap     │  (max-w-2xl)   │              │
│           │   - Tags        │  - Articles    │              │
│           │   - Stats       │  - Moments     │              │
│           │                 │                │              │
│           │  width: 320px   │  width: auto   │              │
│           │  flex-shrink-0  │  min-w-0       │              │
│           ├─────────────────┼────────────────┤              │
│           │   ← 整体居中 →   │                │              │
│           └─────────────────┴────────────────┘              │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### 尺寸计算
- Sidebar: 320px (固定)
- Main-content section: 42rem (max-w-2xl = 640px)
- **总宽度**: 320px + 640px = 960px
- **相对viewport**: 居中显示（flex justify-center）

---

## 隐藏状态（Sidebar关闭）

```
┌─────────────────────────────────────────────────────────────┐
│                        浏览器视口                             │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│                 ┌──────────────────────────┐                │
│                 │   blog-wrapper           │                │
│                 ├────────────┬─────────────┤                │
│                 │            │             │                │
│  Sidebar hidden │Sidebar(0px)│Main-Content │                │
│  (overflow)     │ (hidden)    │  (expand)   │                │
│                 │            │             │                │
│                 │width: 0    │width: auto  │                │
│                 │overflow:   │section:     │                │
│                 │hidden      │42rem+320px  │                │
│                 ├────────────┼─────────────┤                │
│                 │   ← 重新居中 →            │                │
│                 └────────────┴─────────────┘                │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### 尺寸计算
- Sidebar: 0px (隐藏，width: 0 + overflow: hidden)
- Main-content section: 42rem + 320px = 960px
- **总宽度**: 960px (保持不变)
- **相对viewport**: 重新居中显示（自动调整）

---

## 关键变化点

### 1. Sidebar收缩动画
```
宽度: 320px ──[500ms transition]──> 0px
margin-right: 0 ──[500ms transition]──> -320px
```

### 2. Main-content自动扩展
```
因为flex布局，当sidebar宽度变为0时，
main-content自动占据释放的空间
```

### 3. Section宽度动态调整
```
打开状态:   max-width: 42rem (640px)
关闭状态:   max-width: calc(42rem + 320px) = 960px
```

### 4. 整体重新居中
```
由于blog-wrapper使用 flex justify-center，
当内部元素宽度变化时，自动重新居中
```

---

## 代码流程图

```
用户点击 DrawerToggle 按钮
    ↓
dispatchEvent('toggle-drawer')
    ↓
BlogDrawerSidebar 监听事件
    ↓
toggleDrawer() 函数执行
    ↓
┌─────────────────────────────────────────┐
│ if (isOpen) {                           │
│   sidebar.width = "320px"               │
│   sidebar.marginRight = "0"             │
│   dispatchEvent(drawer-state-changed)   │
│ } else {                                │
│   sidebar.width = "0"                   │
│   sidebar.marginRight = "-320px"        │
│   dispatchEvent(drawer-state-changed)   │
│ }                                       │
└─────────────────────────────────────────┘
    ↓
blog.astro 监听 drawer-state-changed
    ↓
调整 section.maxWidth
    ↓
500ms CSS transition 完成动画
    ↓
最终状态（Sidebar隐藏或显示）
```

---

## 元素层次结构

```
BaseLayout
├── blog-wrapper (flex justify-center)
│   ├── BlogDrawerSidebar
│   │   └── drawer-content
│   │       ├── drawer-header
│   │       └── drawer-body
│   │           ├── BlogHeatmapSection
│   │           └── BlogTagSection
│   │
│   └── main-content (relative)
│       ├── DrawerToggle (absolute)
│       └── [ArticleView or MomentView]
│           └── section (max-w-2xl mx-auto)
│               └── 文章列表 / 动态列表
└── [其他BaseLayout内容]
```

---

## 样式优先级

1. **Sidebar宽度变化**（最重要）
   - 直接通过 JavaScript style 属性修改
   - 优先级: 1000 (inline style)

2. **Transition动画**
   - CSS transition 属性控制
   - 平滑过渡效果

3. **Flex布局**（自动调整）
   - flex 容器自动重新计算子元素空间
   - Main-content 自动扩展或缩小

4. **Section宽度调整**（跟随动画）
   - JavaScript 修改 maxWidth
   - 与 Sidebar 动画同时发生（500ms）

---

## 性能考虑

- ✅ 使用 CSS transition（GPU加速）
- ✅ 使用 flex 布局（现代浏览器高效）
- ✅ 避免重排（reflow）- 只修改影响布局的属性
- ✅ 事件委托 - JavaScript 监听全局事件

---

## 浏览器支持

| 特性 | Chrome | Firefox | Safari | Edge |
|------|--------|---------|--------|------|
| Flexbox | ✅ | ✅ | ✅ | ✅ |
| CSS Transition | ✅ | ✅ | ✅ | ✅ |
| CustomEvent | ✅ | ✅ | ✅ | ✅ |
| overflow: hidden | ✅ | ✅ | ✅ | ✅ |

所有现代浏览器均完全支持。

