// TimelineEntry 表示时间轴一条记录的结构
export interface TimelineEntry {
  date: string;
  title: string;
  tag: string;
  summary: string;
  details: string[];
}

// 网页布局
export const baseLayoutTimeline: TimelineEntry[] = [
  {
    date: '2026-02-12',
    title: '设计PlayBot组件',
    tag: 'BaseLayout',
    summary: '',
    details: [
      '使用Rodin将图片转为.glb文件，使用Spline生成嵌入代码。',
      'PlayBot不在手机端显示，在网页端由快捷键P控制出现或消失。'
    ],
  },
  {
    date: '2026-02-12',
    title: '重构Terminal模态框组件',
    tag: 'BaseLayout',
    summary: '',
    details: [
      '使用Tailwind重新书写组件代码。',
      '将 Terminal 结构、样式、逻辑分离到 terminal 目录（.astro/.css/.js）。',
      '拖拽与缩放统一为 Pointer 事件交互引擎，并用 requestAnimationFrame 节流。',
      '将拖拽与缩放功能，命令功能独立。',
    ],
  },
  {
    date: '2026-02-12',
    title: '优化快捷键',
    tag: 'BaseLayout',
    summary: '',
    details: [
      '实现全局的快捷键逻辑：H-主页，B-博客，A-关于，T-回到页顶，K-终端，M-切换主题，G-转到页面',
      '快捷键再做成“可配置映射表”（比如把 H、g+b、g+a 抽成常量），方便后续改键位',
    ],
  },
];

// 首页时间轴数据：突出首页模块的建设历程
export const indexTimeline: TimelineEntry[] = [
  {
    date: '2026-02-08',
    title: '英雄区初步框架',
    tag: 'index',
    summary: '在首页搭建带有雷达徽章与终端输出的控制台英雄区。',
    details: [
      '用翡翠边框卡片与模拟终端日志定调整体视觉。',
      '确保主英雄区在宽屏与移动端都能保持布局稳定。',
    ],
  },
  {
    date: '2026-02-12',
    title: '搭建网页开发时间轴',
    tag: 'index',
    summary: '',
    details: [
      '仿照Tailwind Components搭建时间轴。',
      '重构时间轴组件，组件化设计：TimelineSection.astro, developmentTimeline.ts。'
    ],
  },
];

// About 页面时间轴数据：记录头像与视觉相关迭代
export const aboutTimeline: TimelineEntry[] = [
  {
    date: '2026-02-12',
    title: '简历照片 3D 悬浮',
    tag: 'About',
    summary: '',
    details: [
      '将 About 页的头像升级为 3D 悬浮 Tailwind 组件，以新的 hover 结构替代静态头像。',
    ],
  },
];

// Blog 页面时间轴数据：展示博客模块的内容演进
export const blogTimeline: TimelineEntry[] = [
  {
    date: '2026-02-12',
    title: '博客热力图',
    tag: 'Blog',
    summary: '在博客页引入 GitHub 风格热力图展示发布节奏。',
    details: [
      '绘制 7×53 的活动格子，用深浅色表示提交频次。',
      '将组件放在抽屉布局内，与置顶文章和阅读列表并列。',
    ],
  },
];

// Bookmarks 页面时间轴数据：记录收藏面板的功能调整
export const bookmarksTimeline: TimelineEntry[] = [
  {
    date: '2026-02-12',
    title: '书签控制面板',
    tag: 'Bookmarks',
    summary: '构建书签面板，内含本地存储与即时清除按钮。',
    details: [
      '卡片网格配合清除按钮与空状态提示。',
      '保留收藏记录，便于后续查阅策略。',
    ],
  },
];
