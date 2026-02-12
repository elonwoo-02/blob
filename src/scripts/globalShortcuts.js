// 终端遮罩层节点，用于判断终端当前是否处于打开状态（Esc 时需要关闭）。
const overlay = document.getElementById('shortcut-overlay');

// 全局快捷键映射表：
// - 单键：k 打开终端，h 回到首页，t 回到页顶，m 切换主题
// - 序列键：先按 g，再按 b/a 跳转到 blog/about
// 以后改键位时只需要改这里，不需要改分发逻辑。
const SHORTCUTS = {
  terminalToggleKey: 'k',
  homeKey: 'h',
  backToTopKey: 't',
  themeToggleKey: 'm',
  sequencePrefix: 'g',
  sequenceTimeoutMs: 800,
  sequenceRoutes: {
    b: '/blog/',
    a: '/about/',
  },
};

// 记录当前序列键状态（例如按下 g 后等待下一键）。
let sequence = '';
// 序列键超时定时器，超时后自动清空序列状态，避免误触。
let sequenceTimer = null;

// 判断当前焦点是否在可编辑区域：
// 输入框/文本域/下拉框/可编辑元素中不响应全局快捷键，避免干扰用户输入。
const isEditableTarget = (target) => {
  if (!target) return false;
  const tag = target.tagName?.toLowerCase?.();
  return target.isContentEditable || ['input', 'textarea', 'select'].includes(tag);
};

// 通过全局事件通知 terminal 模块打开。
const openTerminal = () => {
  window.dispatchEvent(new CustomEvent('terminal:open'));
};

// 通过全局事件通知 terminal 模块关闭。
const closeTerminal = () => {
  window.dispatchEvent(new CustomEvent('terminal:close'));
};

// 尝试复用 Dock 现有 action（点击行为）来执行功能，
// 这样可保持与 Dock 内部逻辑一致，避免重复实现。
const triggerDockAction = (action) => {
  const trigger = document.querySelector(`[data-action="${action}"] a`);
  if (!trigger) return false;
  trigger.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
  return true;
};

// 关闭当前最上层活动窗（文章预览）：
// 由 Dock 内部监听 `dock:close-top-activity` 并执行统一关闭流程，
// 这样可以确保活动窗与 Dock item 状态同步移除。
const closeTopActivityWindow = () => {
  const before = document.querySelectorAll('.dock-activity-window:not(.hidden)').length;
  if (!before) return false;
  window.dispatchEvent(new CustomEvent('dock:close-top-activity'));
  const after = document.querySelectorAll('.dock-activity-window:not(.hidden)').length;
  return after < before;
};

// 主题切换兜底逻辑：
// 当 Dock action 不存在时，直接在这里切换 dark/light 并写入 localStorage。
const toggleTheme = () => {
  const savedTheme = window.localStorage.getItem('theme');
  const currentTheme = savedTheme === 'dark' || savedTheme === 'light'
    ? savedTheme
    : (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', nextTheme);
  window.localStorage.setItem('theme', nextTheme);
};

// 处理单键快捷键（非序列键）并返回是否已命中。
const runSingleKeyAction = (event, key) => {
  if (key === SHORTCUTS.terminalToggleKey) {
    event.preventDefault();
    openTerminal();
    return true;
  }

  if (key === SHORTCUTS.homeKey) {
    event.preventDefault();
    window.location.assign('/');
    return true;
  }

  if (key === SHORTCUTS.backToTopKey) {
    event.preventDefault();
    if (!triggerDockAction('back-to-top')) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    return true;
  }

  if (key === SHORTCUTS.themeToggleKey) {
    event.preventDefault();
    if (!triggerDockAction('theme-toggle')) {
      toggleTheme();
    }
    return true;
  }

  return false;
};

// 启动序列键监听窗口（例如按下 g 后等待下一键）。
const beginSequence = () => {
  sequence = SHORTCUTS.sequencePrefix;
  window.clearTimeout(sequenceTimer);
  sequenceTimer = window.setTimeout(() => {
    sequence = '';
  }, SHORTCUTS.sequenceTimeoutMs);
};

// 处理序列键第二段（例如 g + b / g + a）。
const runSequenceAction = (event, key) => {
  if (sequence !== SHORTCUTS.sequencePrefix) return false;

  const route = SHORTCUTS.sequenceRoutes[key];
  if (!route) return false;

  event.preventDefault();
  sequence = '';
  window.location.assign(route);
  return true;
};

// 全局键盘入口：
// 1) Esc：优先关闭活动窗与终端
// 2) 过滤组合键与输入场景
// 3) 分发单键与序列键
document.addEventListener('keydown', (event) => {
  const key = event.key.toLowerCase();

  // Esc 统一收口：先关活动窗，再关终端；任一关闭成功都阻止默认行为。
  if (key === 'escape') {
    const closedActivityWindow = closeTopActivityWindow();
    const closedTerminal = Boolean(overlay && !overlay.classList.contains('hidden'));
    if (closedTerminal) {
      closeTerminal();
    }
    if (closedActivityWindow || closedTerminal) {
      event.preventDefault();
    }
    return;
  }

  if (event.metaKey || event.ctrlKey || event.altKey) return;
  if (isEditableTarget(event.target)) return;

  // 单键命中后直接返回，避免继续进入序列键分支。
  if (runSingleKeyAction(event, key)) {
    return;
  }

  // 命中序列前缀时，仅更新状态并等待下一键。
  if (key === SHORTCUTS.sequencePrefix) {
    beginSequence();
    return;
  }

  runSequenceAction(event, key);
});
