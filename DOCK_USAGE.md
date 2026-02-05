# macOS Dock 风格导航栏 - 完整使用指南

## 📋 项目概述

这是一个使用 Astro + Tailwind CSS 构建的高仿 macOS Dock 风格导航栏组件。该组件专为个人博客网站设计，提供了优雅的浮动导航体验和丰富的交互功能。

## ✨ 核心功能

### 1. 自动隐藏与显示
- **隐藏机制**：3 秒无操作后，Dock 栏自动向下滑出屏幕
- **显示机制**：鼠标移动到屏幕底部时，Dock 栏自动向上滑入
- **动画时长**：300ms 平滑过渡

### 2. 图标悬停效果
- **放大倍数**：1.3 倍
- **阴影增强**：从 `shadow-lg` 到 `shadow-2xl`
- **动画时长**：150ms，缓动为 `ease-out`

### 3. 工具提示
- **触发方式**：鼠标悬停在图标上
- **显示内容**：项目标签
- **样式**：深灰色背景 + 白色文字

### 4. 竖线分隔
- **位置**：左侧导航和右侧应用之间
- **默认样式**：半透明白色竖线
- **悬停效果**：发光蓝色渐变 + 光晕阴影

## 🚀 快速开始

### 基础使用

在您的 Astro 页面中导入并使用 Dock 组件：

```astro
---
import Dock from '@/components/Dock.astro';
---

<html>
  <body>
    <Dock />
  </body>
</html>
```

### 自定义导航项

```astro
---
import Dock from '@/components/Dock.astro';

const leftNav = [
  { id: 'home', title: '首页', link: '/', icon: '🏠' },
  { id: 'blog', title: '博客', link: '/blog', icon: '📝' },
  { id: 'projects', title: '项目', link: '/projects', icon: '💼' },
  { id: 'about', title: '关于', link: '/about', icon: '👤' },
];

const rightApps = [
  { id: 'github', title: 'GitHub', link: 'https://github.com/yourname', icon: '🐙', isExternal: true },
  { id: 'twitter', title: 'Twitter', link: 'https://twitter.com/yourname', icon: '𝕏', isExternal: true },
  { id: 'email', title: '邮件', link: 'mailto:your@email.com', icon: '✉️' },
];
---

<html>
  <body>
    <Dock leftNav={leftNav} rightApps={rightApps} />
  </body>
</html>
```

### 自定义隐藏延迟

```astro
---
import Dock from '@/components/Dock.astro';
---

<html>
  <body>
    <!-- 5 秒后隐藏 -->
    <Dock hideDelay={5000} />
  </body>
</html>
```

## 📁 文件结构

```
src/components/
├── Dock.astro          # Dock 主组件
└── DockItem.astro      # Dock 项目组件
```

## 🎨 设计特点

### 色彩方案
| 元素 | 颜色 | 用途 |
|------|------|------|
| 背景 | `rgba(0, 0, 0, 0.6)` | 半透明黑色基础 |
| 模糊 | `backdrop-blur-xl` | 玻璃态效果 |
| 边框 | `rgba(255, 255, 255, 0.1)` | 微妙的分隔线 |
| 强调色 | `#0084ff` | 蓝色（Apple 官方配色） |
| 文字 | `#ffffff` | 白色 |

### 尺寸规范
- **Dock 栏高度**：64px（包括底部间距）
- **图标尺寸**：48px × 48px
- **图标间距**：8px
- **竖线高度**：32px
- **圆角半径**：24px

## 🔧 Props 参数

### Dock 组件

```typescript
interface Props {
  leftNav?: NavItem[];      // 左侧导航项
  rightApps?: NavItem[];    // 右侧应用项
  hideDelay?: number;       // 隐藏延迟（毫秒，默认 3000）
}

interface NavItem {
  id: string;               // 唯一标识
  title: string;            // 标签文本
  link: string;             // 链接地址
  icon?: string;            // 图标（Emoji 或 URL）
  isActive?: boolean;       // 是否活跃
  isExternal?: boolean;     // 是否外部链接
}
```

## 🎯 交互流程

### 自动隐藏流程
```
用户离开 Dock 区域
    ↓
启动 3 秒计时器
    ↓
3 秒内未重新进入 Dock 区域
    ↓
Dock 栏向下滑出（300ms）
    ↓
Dock 栏隐藏（opacity: 0, pointerEvents: none）
```

### 自动显示流程
```
鼠标移动到屏幕底部 100px 区域
    ↓
检测到鼠标在 Dock 潜在位置
    ↓
Dock 栏向上滑入（300ms）
    ↓
Dock 栏显示（opacity: 1, pointerEvents: auto）
```

## 🛠️ 开发指南

### 修改隐藏延迟时间

在组件使用时传入 `hideDelay` 参数：

```astro
<Dock hideDelay={5000} />  <!-- 5 秒后隐藏 -->
```

### 修改颜色方案

编辑 `Dock.astro` 中的背景色：

```astro
<!-- 修改这一行 -->
<div class="... bg-black/60 ...">
```

### 修改图标放大倍数

编辑 `DockItem.astro` 中的 scale 类：

```astro
<!-- 修改 group-hover:scale-125 -->
class="... group-hover:scale-125 ..."
```

### 添加新的导航项

在使用 Dock 的页面中添加新项到 `leftNav` 或 `rightApps` 数组：

```astro
const leftNav = [
  { id: 'home', title: '首页', link: '/', icon: '🏠' },
  { id: 'blog', title: '博客', link: '/blog', icon: '📝' },
  // 添加新项
  { id: 'new', title: '新页面', link: '/new', icon: '✨' },
];
```

## 🌐 浏览器兼容性

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## 📝 最佳实践

### 1. 使用 Emoji 图标

Emoji 是最简单的方式来为 Dock 项目添加图标：

```astro
const leftNav = [
  { id: 'home', title: '首页', link: '/', icon: '🏠' },
  { id: 'blog', title: '博客', link: '/blog', icon: '📝' },
  { id: 'projects', title: '项目', link: '/projects', icon: '💼' },
];
```

### 2. 标记外部链接

对于外部链接，始终设置 `isExternal: true`：

```astro
const rightApps = [
  { id: 'github', title: 'GitHub', link: 'https://github.com', icon: '🐙', isExternal: true },
];
```

### 3. 响应式设计

Dock 栏在小屏幕上可能不适合。考虑在移动设备上隐藏它：

```astro
---
import Dock from '@/components/Dock.astro';
---

<html>
  <body>
    <div class="hidden md:block">
      <Dock />
    </div>
  </body>
</html>
```

## 🐛 常见问题

### Q: Dock 栏没有隐藏？
**A**: 检查是否在 3 秒内有鼠标操作。确保 `hideTimeout` 正确清除。

### Q: 图标悬停没有放大？
**A**: 确保 Tailwind CSS 已正确配置，检查 `group-hover:scale-125` 类是否生效。

### Q: 竖线分隔没有显示？
**A**: 检查 `rightApps` 数组是否为空。竖线只在有右侧应用项时显示。

### Q: 工具提示显示位置不对？
**A**: 调整 `-top-10` 和 `left-1/2 -translate-x-1/2` 的值来重新定位。

## 📚 相关资源

- [Astro 文档](https://docs.astro.build)
- [Tailwind CSS 文档](https://tailwindcss.com/docs)
- [macOS 设计指南](https://developer.apple.com/design/human-interface-guidelines/macos)

## 📝 更新日志

### v2.0.0 (2026-02-05)
- ✅ 迁移到 Astro 框架
- ✅ 增强的视觉效果
- ✅ 改进的交互逻辑
- ✅ 完整的文档

### v1.0.0 (2026-02-04)
- ✅ 初始版本发布
- ✅ 实现自动隐藏/显示功能
- ✅ 实现图标悬停放大效果
- ✅ 实现工具提示显示

## 📄 许可证

MIT License

---

**作者**: Manus AI  
**创建时间**: 2026-02-05  
**最后更新**: 2026-02-05
