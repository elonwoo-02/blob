import { initTerminalInteraction } from './terminalInteraction.js';
import { initTerminalCommands } from './terminalCommands.js';

const overlay = document.getElementById('shortcut-overlay');
const terminalPanel = document.getElementById('terminal-panel');
const terminalModal = document.querySelector('.shortcut-modal');
const terminalTitlebar = document.querySelector('.shortcut-titlebar');
const terminalInput = document.getElementById('terminal-input');
const terminalOutput = document.getElementById('terminal-output');
const titlebars = document.querySelectorAll('.shortcut-titlebar');
const dock = document.querySelector('#mac-dock');

const updateClock = () => {
  const now = new Date();
  const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  titlebars.forEach((bar) => bar.setAttribute('data-clock', time));
};

const openOverlay = (panel) => {
  overlay?.classList.add('flex');
  overlay?.classList.remove('hidden');
  overlay?.setAttribute('aria-hidden', 'false');
  panel?.classList.add('flex');
  panel?.classList.remove('hidden');
};

const closeOverlay = () => {
  overlay?.classList.remove('flex');
  overlay?.classList.add('hidden');
  overlay?.setAttribute('aria-hidden', 'true');
  terminalPanel?.classList.remove('flex');
  terminalPanel?.classList.add('hidden');
};

const navigateTo = (path) => {
  window.location.assign(path);
};

const pushLine = (text, type = 'output') => {
  if (!terminalOutput) return;
  const li = document.createElement('li');
  li.textContent = text;
  li.classList.add(type);
  terminalOutput.append(li);
  terminalOutput.scrollTop = terminalOutput.scrollHeight;
};

const pushClickable = (label, command) => {
  if (!terminalOutput || !terminalInput) return;
  const li = document.createElement('li');
  li.classList.add('dim');
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.textContent = label;
  btn.addEventListener('click', () => {
    terminalInput.value = command;
    terminalInput.focus();
  });
  li.append(btn);
  terminalOutput.append(li);
  terminalOutput.scrollTop = terminalOutput.scrollHeight;
};

const getPreferredTheme = () =>
  window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

const setThemeMode = (mode) => {
  const resolved = mode === 'auto' ? getPreferredTheme() : mode;
  document.documentElement.setAttribute('data-theme', resolved);
  window.localStorage.setItem('theme', mode);
};

const themeMedia = window.matchMedia('(prefers-color-scheme: dark)');
themeMedia.addEventListener('change', () => {
  if (window.localStorage.getItem('theme') === 'auto') {
    setThemeMode('auto');
  }
});

updateClock();
window.setInterval(updateClock, 30000);

// Pointer drag/resize behavior is isolated in terminalInteraction.
initTerminalInteraction(terminalModal, terminalTitlebar);

// Command parsing/execution is isolated in terminalCommands.
const commandRuntime = initTerminalCommands({
  terminalInput,
  terminalOutput,
  dock,
  closeOverlay,
  navigateTo,
  setThemeMode,
  pushLine,
});

const openTerminal = () => {
  openOverlay(terminalPanel);
  const history = commandRuntime.getHistory();
  // Show last session commands only for a fresh output panel.
  if (terminalOutput && terminalOutput.children.length === 0 && history.length) {
    pushLine('Last session:', 'dim');
    history.slice(-5).forEach((entry, index) => {
      const idx = history.length - 5 + index + 1;
      pushClickable(`${idx}. ${entry}`, entry);
    });
  }
  terminalInput?.focus();
};

overlay?.addEventListener('click', (event) => {
  if (event.target === overlay) closeOverlay();
});

// Dock button and global shortcuts both emit/open terminal through this flow.
document.addEventListener('click', (event) => {
  const trigger = event.target?.closest?.('[data-action="terminal"]');
  if (!trigger) return;
  event.preventDefault();
  openTerminal();
});

window.addEventListener('terminal:open', openTerminal);
window.addEventListener('terminal:close', closeOverlay);
