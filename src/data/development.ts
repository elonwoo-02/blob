export interface TimelineEntry {
  date: string;
  title: string;
  tag: string;
  summary: string;
  details: string[];
}

export const androidTimeline: TimelineEntry[] = [
  {
    date: '2026-02-17',
    title: '添加一些导航组件',
    tag: 'Android',
    summary: '',
    details: ['新增Dock、Drawer和FabFlower组件'],
  },
];

export const markdownPostLayoutTimeline: TimelineEntry[] = [
  {
    date: '2026-02-21',
    title: '优化文章基础布局与宽度对齐',
    tag: 'Post',
    summary: '文章页主内容宽度与 BaseLayout 保持一致，修复展示混乱。',
    details: [
      '文章页面容器统一继承站点主容器宽度策略。',
      '修复文章布局错位与构建失败相关问题。',
      '优化内容阅读节奏与版面稳定性。',
    ],
  },
  {
    date: '2026-02-21',
    title: '加入章节导航与阅读辅助',
    tag: 'Post',
    summary: '文章页支持章节目录导航与阅读进度反馈。',
    details: [
      '桌面端展示右侧 TOC，移动端提供折叠目录。',
      '目录高亮与滚动定位联动。',
      '长文场景下阅读进度条可用。',
    ],
  },
];

export const baseLayoutTimeline: TimelineEntry[] = [
  {
    date: '2026-02-12',
    title: '设计 PlayBot 组件',
    tag: 'style',
    summary: '',
    details: [
      '使用 Rodin 将图片转换为 glb 文件，并使用 Spline 生成嵌入代码。',
      'PlayBot 在移动端不显示，在网页端由快捷键 P 控制出现或隐藏。',
    ],
  },
  {
    date: '2026-02-12',
    title: '重构 Terminal 模态框组件',
    tag: 'refector',
    summary: '',
    details: [
      '使用 Tailwind 重写组件。',
      '将 Terminal 的结构、样式和逻辑拆分到 terminal 目录。',
      '拖拽和缩放统一为 Pointer 事件交互，并通过 requestAnimationFrame 节流。',
    ],
  },
  {
    date: '2026-02-12',
    title: '优化快捷键',
    tag: 'BaseLayout',
    summary: '',
    details: [
      '实现全局快捷键逻辑。',
      '将快捷键重构为可配置映射，便于后续调整。',
    ],
  },
  {
    date: '2026-02-17',
    title: '添加背景色',
    tag: 'BaseLayout',
    summary: '',
    details: [
      '参考潘通2026年度色云舞白设置背景色。',
    ],
  },
  {
    date: '2026-02-21',
    title: '统一页面宽度控制入口',
    tag: 'Layout',
    summary: '移除页面内部宽度覆盖，统一由 BaseLayout 控制。',
    details: [
      'About 页面移除 .site-content 的 max-width 覆盖。',
      'Experience/Test/Timeline 移除局部 max-w 约束。',
      '各页面内容宽度策略一致化。',
    ],
  },
  {
    date: '2026-02-21',
    title: '全站默认宽度收窄至 6xl',
    tag: 'BaseLayout',
    summary: '默认内容宽度由 7xl 调整为 6xl，并同步 Footer 对齐。',
    details: [
      'BaseLayout 默认 contentWidth: 7xl -> 6xl。',
      'fallback 宽度同步改为 max-w-6xl。',
      'Footer 容器宽度与主容器一致。',
    ],
  },
  {
    date: '2026-02-21',
    title: '新增灵动岛消息组件',
    tag: 'UI',
    summary: '仿 iPhone 灵动岛形态实现全站消息入口。',
    details: [
      '新增顶部固定胶囊组件，支持收起与展开交互。',
      '使用 Astro 群岛架构挂载为独立交互岛屿。',
      '抽离消息总线，支持后续扩展系统消息与更新提醒。',
    ],
  },
  {
    date: '2026-02-21',
    title: '接入安装提示链路',
    tag: 'PWA',
    summary: '首次访问提示将网页安装为应用并支持安装状态感知。',
    details: [
      '接入 beforeinstallprompt 与 appinstalled 事件。',
      '首次访问提示一次，关闭后记忆不重复打扰。',
      'iOS 场景降级为“添加到主屏幕”引导。',
    ],
  },
  {
    date: '2026-02-21',
    title: 'AI 聊天终端接入（LangGraph）',
    tag: 'AI',
    summary: '在终端中接入 AI 聊天命令与服务端图编排。',
    details: [
      '新增 /api/ai/chat 路由并接入 LangGraph。',
      '支持 ai ask / ai history / ai reset / ai help 命令。',
      '会话历史持久化到 localStorage。',
    ],
  },
  {
    date: '2026-02-21',
    title: '开发环境兼容修复',
    tag: 'AI',
    summary: '解决 static 开发模式下 API 请求兼容问题。',
    details: [
      '为 Astro API 路由配置 prerender = false。',
      '开发环境优先走 GET 兜底请求，避免 POST 限制。',
    ],
  },
  {
    date: '2026-02-21',
    title: '模型参数兼容修复',
    tag: 'AI',
    summary: '适配 gpt-4o-mini-search-preview 的参数约束。',
    details: [
      '移除不兼容的 temperature 参数。',
      '继续读取 .env 中 OPENAI_MODEL 配置。',
    ],
  },
  {
    date: '2026-02-21',
    title: '流式稳定性修复',
    tag: 'AI',
    summary: '提高流式输出在不同运行时下的可用性。',
    details: [
      '流式失败时自动降级为 invoke 返回完整结果。',
      '本地与 Cloudflare Functions 路由保持一致逻辑。',
    ],
  },
];

export const indexTimeline: TimelineEntry[] = [
  {
    date: '2026-02-12',
    title: '搭建网页开发时间轴',
    tag: 'feat',
    summary: '',
    details: [
      '新增时间轴展示。',
      '抽离 TimelineSection.astro 与 development.ts。',
    ],
  },
  {
    date: '2026-02-17',
    title: '设计Hero组件',
    tag: 'feat',
    summary: '',
    details: [
      '新增Hero组件，展示头像和标签。',
      'TODO: 后续添加背景（古代建筑，浮动的数字0和1）。',
    ],
  },
];

export const aboutTimeline: TimelineEntry[] = [
  {
    date: '2026-02-12',
    title: '头像 3D 悬浮效果',
    tag: 'About',
    summary: '',
    details: [
      '将 About 页头像升级为 3D 悬浮交互组件。',
    ],
  },
];

export const blogTimeline: TimelineEntry[] = [
  {
    date: '2026-02-12',
    title: '博客热力图',
    tag: 'Blog',
    summary: '在博客页加入 GitHub 风格热力图。',
    details: [
      '绘制 7x53 活动格子。',
      '与文章列表并列展示。',
    ],
  },
];

export const bookmarksTimeline: TimelineEntry[] = [
  {
    date: '2026-02-12',
    title: '书签控制面板',
    tag: 'Bookmarks',
    summary: '构建书签面板，包含本地存储与即时清除按钮。',
    details: [
      '卡片网格布局配合空状态提示。',
      '保留收藏记录，便于后续管理。',
    ],
  },
];

export const experienceTimeline: TimelineEntry[] = [
  {
    date: '2026-02-21',
    title: '重构 Experience 页面结构',
    tag: 'Experience',
    summary: '将页面整理为 Hero + 分区内容 + 右侧目录的学术化版式。',
    details: [
      '统一 Research / Projects / Publications 的区块节奏。',
      '优化页面主栏与 TOC 栅格比例。',
    ],
  },
  {
    date: '2026-02-21',
    title: '移除头像并改造 Hero',
    tag: 'Hero',
    summary: 'Experience Hero 由双栏改为单栏文本，去除照片。',
    details: [
      '强化姓名与身份信息层级。',
      '保留研究兴趣卡片与操作按钮组。',
    ],
  },
  {
    date: '2026-02-21',
    title: '首屏占满 Hero',
    tag: 'Layout',
    summary: '未滚动时 Hero 占据主要可视区，增强首屏展示。',
    details: [
      '移动端采用 svh 最小高度策略。',
      '通过纵向分布让信息块更均衡。',
    ],
  },
  {
    date: '2026-02-21',
    title: '补充研究兴趣条目',
    tag: 'Content',
    summary: 'Research Interests 新增方向条目。',
    details: [
      '新增：Model Compression and Inference Optimization。',
    ],
  },
];
