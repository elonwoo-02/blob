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
    title: '接入移动端导航组件',
    tag: 'Android',
    summary: '为移动端补齐导航基础交互。',
    details: ['新增 Dock、Drawer 和 FabFlower 组件。'],
  },
  {
    date: '2026-02-18',
    title: '优化移动端交互节奏',
    tag: 'Mobile',
    summary: '打磨触控场景下的浮层与入口行为。',
    details: [
      '优化 Drawer 开合与遮罩响应。',
      '调整移动端 Dock 按钮布局与可触达性。',
    ],
  },
  {
    date: '2026-02-21',
    title: '补充移动端安装引导',
    tag: 'PWA',
    summary: '在移动端覆盖安装提示与降级指引。',
    details: [
      '支持 beforeinstallprompt 安装提示。',
      'iOS 场景提供“添加到主屏幕”引导。',
    ],
  },
];

export const markdownPostLayoutTimeline: TimelineEntry[] = [
  {
    date: '2026-02-18',
    title: '拆分文章布局组件壳',
    tag: 'Post',
    summary: '将文章页拆分为 PostShell 与内容子组件。',
    details: [
      '抽离 PostShell、PostHeader、PostContent。',
      '明确桌面主栏与侧栏目录结构。',
    ],
  },
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
    date: '2026-02-10',
    title: '重构 Terminal 模态框组件',
    tag: 'Refactor',
    summary: '统一终端结构并提升交互稳定性。',
    details: [
      '使用 Tailwind 重写组件。',
      '将结构、样式与逻辑拆分到 terminal 目录。',
      '拖拽和缩放统一为 Pointer 事件并做 raf 节流。',
    ],
  },
  {
    date: '2026-02-11',
    title: '优化全局快捷键系统',
    tag: 'BaseLayout',
    summary: '统一快捷键入口并提升可配置性。',
    details: ['实现全局快捷键逻辑。', '将快捷键重构为可配置映射。'],
  },
  {
    date: '2026-02-12',
    title: '设计 PlayBot 组件',
    tag: 'Style',
    summary: '为桌面端补充 3D 形象入口。',
    details: [
      '使用 Rodin + Spline 生成嵌入式 3D 展示。',
      '移动端默认隐藏，桌面端支持快捷键 P 显隐。',
    ],
  },
  {
    date: '2026-02-21',
    title: '确认站点颜色方案',
    tag: 'BaseLayout',
    summary: '确认全站采用统一配色基调，确保页面视觉一致性。',
    details: [
      '确认采用“云舞白”作为站点背景主色方向。',
      '站点主色策略统一由全局主题变量驱动。',
    ],
  },
  {
    date: '2026-02-18',
    title: 'AI 聊天终端接入 LangGraph',
    tag: 'AI',
    summary: '在终端中接入 AI 聊天命令与服务端图编排。',
    details: [
      '新增 /api/ai/chat 路由并接入 LangGraph。',
      '支持 ai ask / ai history / ai reset / ai help。',
      '会话历史持久化到 localStorage。',
    ],
  },
  {
    date: '2026-02-19',
    title: '修复开发环境 API 兼容',
    tag: 'AI',
    summary: '解决 static 开发模式下接口调用问题。',
    details: ['开发环境补充 GET 兜底路径。', '统一本地与函数路由行为。'],
  },
  {
    date: '2026-02-20',
    title: '适配模型参数约束',
    tag: 'AI',
    summary: '兼容 gpt-4o-mini-search-preview 请求参数。',
    details: ['移除不兼容的 temperature 参数。', '继续读取 .env 中 OPENAI_MODEL 配置。'],
  },
  {
    date: '2026-02-20',
    title: '增强流式输出稳定性',
    tag: 'AI',
    summary: '降低不同运行时下流式失败率。',
    details: ['流式失败时自动降级为完整返回。', '统一本地与 Cloudflare Functions 逻辑。'],
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
    title: '重写全站主题切换系统',
    tag: 'Theme',
    summary: '统一 light/dark/auto 主题入口并提升主题切换后文本可读性。',
    details: [
      '新增 themeManager，统一 Dock/快捷键/Terminal 的主题切换逻辑。',
      'BaseLayout 在首屏渲染前注入主题初始化，减少主题闪烁。',
      'global.css 引入主题语义色变量，统一背景与文字对比度策略。',
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
    title: '迁移 Dock 与 Icon 到 shared',
    tag: 'Refactor',
    summary: '统一共享组件目录并降低跨页面耦合。',
    details: [
      '将 dock 模块迁移到 src/components/shared/dock。',
      '将图标迁移到 src/components/shared/icons。',
      '全项目更新引用路径。',
    ],
  },
  {
    date: '2026-02-21',
    title: '增加兼容层保障升级无感',
    tag: 'Refactor',
    summary: '为历史路径补充 re-export，避免重构引发功能回退。',
    details: ['保留 legacy 入口并转发至新 shared 目录。', '确保旧引用场景仍可正常工作。'],
  },
];

export const indexTimeline: TimelineEntry[] = [
  {
    date: '2026-02-12',
    title: '搭建首页开发时间轴',
    tag: 'Index',
    summary: '首页接入按模块展示的开发里程碑。',
    details: ['新增时间轴展示。', '抽离 TimelineSection.astro 与 development.ts。'],
  },
  {
    date: '2026-02-14',
    title: '完成 Hero 首屏设计',
    tag: 'Hero',
    summary: '首页首屏建立身份展示与视觉锚点。',
    details: ['新增 Hero 组件展示头像与标签。', '统一首页首屏信息层级。'],
  },
  {
    date: '2026-02-21',
    title: '首页可见全站消息入口',
    tag: 'UI',
    summary: '首页接入灵动岛消息能力，展示安装与系统提示。',
    details: ['顶部固定消息入口与交互态统一。', '支持首次访问安装引导提示。'],
  },
];

export const aboutTimeline: TimelineEntry[] = [
  {
    date: '2026-02-12',
    title: '头像升级为 3D 悬浮效果',
    tag: 'About',
    summary: 'About 页头像引入立体悬浮交互。',
    details: ['将 About 页头像升级为 3D 组件。'],
  },
  {
    date: '2026-02-16',
    title: '补充简历多语言切换',
    tag: 'About',
    summary: '支持 Python / Go / 中文三种展示视图。',
    details: ['新增语言切换器与状态持久化。', '侧栏与主内容联动切换。'],
  },
  {
    date: '2026-02-20',
    title: '优化代码风简历布局',
    tag: 'Layout',
    summary: '强化编辑器风格排版与响应式表现。',
    details: ['完善左右栏网格与移动端断点。', '提升履历信息层级与可读性。'],
  },
];

export const blogTimeline: TimelineEntry[] = [
  {
    date: '2026-02-12',
    title: '接入博客热力图模块',
    tag: 'Blog',
    summary: '在博客页加入 GitHub 风格热力图。',
    details: ['绘制 7x53 活动格子。', '与文章列表并列展示。'],
  },
  {
    date: '2026-02-14',
    title: '实现三视图内容系统',
    tag: 'Blog',
    summary: '博客支持 Article / Moment / Note 三视图切换。',
    details: ['抽离 ArticleView、MomentView 与 NoteView。', '接入视图切换岛屿组件。'],
  },
  {
    date: '2026-02-16',
    title: '补充 Note 视图筛选能力',
    tag: 'Blog',
    summary: 'Note 视图支持标签筛选与空状态反馈。',
    details: ['支持标签路径匹配与一键清除过滤。', '补充无结果空状态提示。'],
  },
  {
    date: '2026-02-15',
    title: '完善 Drawer 侧栏能力',
    tag: 'Sidebar',
    summary: '侧栏整合统计、标签和导航入口。',
    details: ['新增博客统计信息展示。', '补充标签筛选与入口按钮。'],
  },
  {
    date: '2026-02-19',
    title: '修复移动端展示与抽屉交互',
    tag: 'Responsive',
    summary: '解决小屏场景下的抽屉和内容区错位问题。',
    details: ['优化移动端 Drawer 显隐行为。', '调整内容区宽度与滚动表现。'],
  },
];

export const experienceTimeline: TimelineEntry[] = [
  {
    date: '2026-02-19',
    title: '重构 Experience 页面结构',
    tag: 'Experience',
    summary: '整理为 Hero + 分区内容 + 右侧目录的学术化版式。',
    details: ['统一 Research / Projects / Publications 区块节奏。', '优化主栏与 TOC 栅格比例。'],
  },
  {
    date: '2026-02-20',
    title: '优化目录侧栏联动',
    tag: 'TOC',
    summary: '增强右侧目录在阅读过程中的导航作用。',
    details: ['补充吸顶目录组件。', '滚动时高亮当前章节。'],
  },
  {
    date: '2026-02-21',
    title: '移除头像并改造 Hero',
    tag: 'Hero',
    summary: 'Experience Hero 由双栏改为单栏文本并去除照片。',
    details: ['强化姓名与身份信息层级。', '保留研究兴趣卡片与操作按钮组。'],
  },
  {
    date: '2026-02-21',
    title: '首屏占满 Hero',
    tag: 'Layout',
    summary: '未滚动时 Hero 占据主要可视区，增强首屏展示。',
    details: ['移动端采用 svh 最小高度策略。', '通过纵向分布让信息块更均衡。'],
  },
  {
    date: '2026-02-21',
    title: '补充研究兴趣条目',
    tag: 'Content',
    summary: 'Research Interests 新增方向条目。',
    details: ['新增：Model Compression and Inference Optimization。'],
  },
];
