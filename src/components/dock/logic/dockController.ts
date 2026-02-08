// Dock orchestration: wiring store, visibility, actions, and activity windows.
import { createDockStore } from '../data/dockStore.js';
import { createDockVisibility } from './dockVisibility.js';
import { createActivityManager } from './dockActivity.js';
import { bindDockActions } from './dockActions.js';
import { normalizeHref } from '../data/dockUtils.js';

type DockPayload = {
  pageTitle: string;
  currentPath: string;
};

const articleIcon = `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="3" width="16" height="18" rx="2" stroke="currentColor" stroke-width="1.8"/><path d="M8 8h8M8 12h8M8 16h6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`;

type DockInitOptions = {
  storagePrefix?: string;
};

export const initDock = (selector = '#mac-dock', options: DockInitOptions = {}) => {
  if (window.localStorage.getItem('dock-hidden') === '1') {
    document.documentElement.classList.add('dock-hidden');
  }

  const dock = document.querySelector(selector) as HTMLElement | null;
  if (!dock) return;

  const payload = JSON.parse(dock.dataset.dock || '{}') as DockPayload;
  const rightList = dock.querySelector('.dock-right') as HTMLElement | null;
  const activityLayer = document.querySelector('#dock-activity') as HTMLElement | null;
  const activityTemplate = document.querySelector('#dock-activity-template') as HTMLTemplateElement | null;

  const storagePrefix = options.storagePrefix || dock.dataset.storagePrefix || 'dock';
  const emit = (name: string, detail?: Record<string, unknown>) => {
    dock.dispatchEvent(new CustomEvent(name, { detail, bubbles: true }));
  };

  const store = createDockStore(rightList, {
    storagePrefix,
    onAdd: (item) => emit('dock:add', { item }),
    onRemove: (href) => emit('dock:remove', { href }),
  });
  const activity = createActivityManager(dock, activityLayer, activityTemplate, store.removeItem, {
    storagePrefix,
    callbacks: {
      onOpen: (item) => emit('dock:open', { item }),
      onClose: (href) => emit('dock:close', { href }),
      onMinimize: (href) => emit('dock:minimize', { href }),
    },
  });

  createDockVisibility(dock);
  bindDockActions(dock);

  const isSystemPath = ['/', '/blog/', '/about/'].includes(payload.currentPath);
  const isBlogPostPath = /^\/posts\/.+/.test(payload.currentPath);

  if (!isSystemPath && isBlogPostPath && payload.currentPath) {
    store.addItem({
      label: payload.pageTitle || document.title || '文章',
      href: payload.currentPath,
      icon: articleIcon,
    });
  }

  store.renderItems(store.getItems());

  dock.addEventListener('click', (event) => {
    const anchor = (event.target as HTMLElement | null)?.closest('.dock-item a') as HTMLAnchorElement | null;
    if (!anchor) return;
    const listItem = anchor.closest('.dock-item') as HTMLElement | null;
    if (!listItem || listItem.dataset.removable !== 'true') return;
    event.preventDefault();
    activity.open({
      href: normalizeHref(anchor.getAttribute('href') || ''),
      label: listItem.dataset.label || '文章',
    });
  });
};
