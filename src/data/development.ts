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
    date: '2026-02-12',
    title: '',
    tag: 'Post',
    summary: '',
    details: [''],
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
