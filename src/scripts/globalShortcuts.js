// 终端遮罩层：用于判断终端是否处于打开状态（Esc 时需要关闭）。
const overlay = document.getElementById('shortcut-overlay');

// 全局快捷键配置：
// - 单键：k 打开终端，h 回首页，t 回页顶，m 切换主题
// - 单键：b 跳转 Blog，a 跳转 About
const SHORTCUTS = {
  terminalToggleKey: 'k',
  homeKey: 'h',
  backToTopKey: 't',
  themeToggleKey: 'm',
  botToggleKey: 'p',
  blogKey: 'b',
  aboutKey: 'a',
};

const isEditableTarget = (target) => {
  if (!target) return false;
  const tag = target.tagName?.toLowerCase?.();
  return target.isContentEditable || ['input', 'textarea', 'select'].includes(tag);
};

const dispatchTerminal = (action) => {
  window.dispatchEvent(new CustomEvent(`terminal:${action}`));
};

const navigateTo = (path) => {
  window.location.assign(path);
};

const triggerDockAction = (action) => {
  const trigger = document.querySelector(`[data-action="${action}"] a`);
  if (!trigger) return false;
  trigger.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
  return true;
};

const closeTopActivityWindow = () => {
  const before = document.querySelectorAll('.dock-activity-window:not(.hidden)').length;
  if (!before) return false;
  window.dispatchEvent(new CustomEvent('dock:close-top-activity'));
  const after = document.querySelectorAll('.dock-activity-window:not(.hidden)').length;
  return after < before;
};

const toggleTheme = () => {
  const savedTheme = window.localStorage.getItem('theme');
  const currentTheme = savedTheme === 'dark' || savedTheme === 'light'
    ? savedTheme
    : (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', nextTheme);
  window.localStorage.setItem('theme', nextTheme);
};

const botStorageKey = 'bot-hidden';
const botElement = document.getElementById('elon-bot');

const applyBotVisibility = (hidden) => {
  if (!botElement) return;
  botElement.style.display = hidden ? 'none' : '';
  botElement.setAttribute('aria-hidden', hidden ? 'true' : 'false');
};

const toggleBot = () => {
  const nextHidden = window.localStorage.getItem(botStorageKey) !== '1';
  window.localStorage.setItem(botStorageKey, nextHidden ? '1' : '0');
  applyBotVisibility(nextHidden);
};

applyBotVisibility(window.localStorage.getItem(botStorageKey) === '1');

const singleKeyActionMap = {
  [SHORTCUTS.terminalToggleKey]: () => dispatchTerminal('open'),
  [SHORTCUTS.homeKey]: () => navigateTo('/'),
  [SHORTCUTS.backToTopKey]: () => {
    if (!triggerDockAction('back-to-top')) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  },
  [SHORTCUTS.themeToggleKey]: () => {
    if (!triggerDockAction('theme-toggle')) {
      toggleTheme();
    }
  },
  [SHORTCUTS.botToggleKey]: () => toggleBot(),
  [SHORTCUTS.blogKey]: () => navigateTo('/blog/'),
  [SHORTCUTS.aboutKey]: () => navigateTo('/about/'),
};

const runSingleKeyAction = (event, key) => {
  const handler = singleKeyActionMap[key];
  if (!handler) return false;
  event.preventDefault();
  handler();
  return true;
};

document.addEventListener('keydown', (event) => {
  const key = event.key.toLowerCase();

  if (key === 'escape') {
    const closedActivityWindow = closeTopActivityWindow();
    const closedTerminal = Boolean(overlay && !overlay.classList.contains('hidden'));
    if (closedTerminal) {
      dispatchTerminal('close');
    }
    if (closedActivityWindow || closedTerminal) {
      event.preventDefault();
    }
    return;
  }

  if (event.metaKey || event.ctrlKey || event.altKey) return;
  if (isEditableTarget(event.target)) return;

  if (runSingleKeyAction(event, key)) return;
});
