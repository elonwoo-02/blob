const overlay = document.getElementById('shortcut-overlay');

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

let sequence = '';
let sequenceTimer = null;

const isEditableTarget = (target) => {
  if (!target) return false;
  const tag = target.tagName?.toLowerCase?.();
  return target.isContentEditable || ['input', 'textarea', 'select'].includes(tag);
};

const openTerminal = () => {
  window.dispatchEvent(new CustomEvent('terminal:open'));
};

const closeTerminal = () => {
  window.dispatchEvent(new CustomEvent('terminal:close'));
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

const beginSequence = () => {
  sequence = SHORTCUTS.sequencePrefix;
  window.clearTimeout(sequenceTimer);
  sequenceTimer = window.setTimeout(() => {
    sequence = '';
  }, SHORTCUTS.sequenceTimeoutMs);
};

const runSequenceAction = (event, key) => {
  if (sequence !== SHORTCUTS.sequencePrefix) return false;

  const route = SHORTCUTS.sequenceRoutes[key];
  if (!route) return false;

  event.preventDefault();
  sequence = '';
  window.location.assign(route);
  return true;
};

document.addEventListener('keydown', (event) => {
  const key = event.key.toLowerCase();

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

  if (runSingleKeyAction(event, key)) {
    return;
  }

  if (key === SHORTCUTS.sequencePrefix) {
    beginSequence();
    return;
  }

  runSequenceAction(event, key);
});
