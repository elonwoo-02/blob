import { readOpenedItems, readPanelState, writeOpenedItems, writePanelState } from './dockStorage';

type DockPayload = {
  pageTitle: string;
  currentPath: string;
};

type ActivityItem = {
  label: string;
  href: string;
  icon?: string;
};

const articleIcon = `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="3" width="16" height="18" rx="2" stroke="currentColor" stroke-width="1.8"/><path d="M8 8h8M8 12h8M8 16h6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`;

export const initDock = (selector = '#mac-dock') => {
  if (window.localStorage.getItem('dock-hidden') === '1') {
    document.documentElement.classList.add('dock-hidden');
  }

  const dock = document.querySelector(selector) as HTMLElement | null;
  if (!dock) return;

  const payload = JSON.parse(dock.dataset.dock || '{}') as DockPayload;
  const rightList = dock.querySelector('.dock-right') as HTMLElement | null;
  const activityLayer = document.querySelector('#dock-activity') as HTMLElement | null;
  const activityTemplate = document.querySelector('#dock-activity-template') as HTMLTemplateElement | null;

  const hideDelay = 3000;
  const showBoundary = 100;
  const windowPadding = 12;
  const minActivityWidth = 360;
  const minActivityHeight = 320;
  const baseZIndex = 70;
  const minimizeDuration = 180;
  const openDuration = 320;

  let hideTimer: number | undefined;
  let topZIndex = baseZIndex;
  let isScrolling = false;
  let scrollTimer: number | undefined;
  let pendingPointerY: number | null = null;
  let pointerRafId: number | null = null;
  let isHoveringDock = false;

  const setDockState = (state: 'visible' | 'hidden') => {
    if (dock.dataset.state === state) return;
    if (state === 'visible') {
      dock.style.transform = 'translateY(0)';
      dock.style.opacity = '1';
      dock.dataset.state = 'visible';
      return;
    }
    dock.style.transform = 'translateY(120%)';
    dock.style.opacity = '0';
    dock.dataset.state = 'hidden';
  };

  const clearHideTimer = () => {
    window.clearTimeout(hideTimer);
    hideTimer = undefined;
  };

  const scheduleHide = () => {
    if (hideTimer) return;
    hideTimer = window.setTimeout(() => {
      hideTimer = undefined;
      setDockState('hidden');
    }, hideDelay);
  };

  const evaluateDockVisibility = () => {
    if (isHoveringDock) {
      setDockState('visible');
      clearHideTimer();
      return;
    }
    if (isScrolling) {
      scheduleHide();
      return;
    }
    const isNearBoundary = pendingPointerY !== null && window.innerHeight - pendingPointerY <= showBoundary;
    if (isNearBoundary) {
      setDockState('visible');
      scheduleHide();
      return;
    }
    scheduleHide();
  };

  dock.addEventListener('pointerenter', () => {
    isHoveringDock = true;
    evaluateDockVisibility();
  });

  dock.addEventListener('pointerleave', () => {
    isHoveringDock = false;
    evaluateDockVisibility();
  });

  document.addEventListener('pointermove', (event) => {
    pendingPointerY = event.clientY;
    if (pointerRafId !== null) return;
    pointerRafId = requestAnimationFrame(() => {
      evaluateDockVisibility();
      pointerRafId = null;
    });
  });

  window.addEventListener('scroll', () => {
    isScrolling = true;
    window.clearTimeout(scrollTimer);
    scrollTimer = window.setTimeout(() => {
      isScrolling = false;
      evaluateDockVisibility();
    }, 180);
  }, { passive: true });

  const setLayerVisibility = () => {
    if (!activityLayer) return;
    const hasWindows = activityLayer.querySelectorAll('.dock-activity-window:not(.hidden)').length > 0;
    activityLayer.classList.toggle('hidden', !hasWindows);
    activityLayer.classList.toggle('is-visible', hasWindows);
    activityLayer.setAttribute('aria-hidden', hasWindows ? 'false' : 'true');
  };

  const bringToFront = (panel: HTMLElement) => {
    topZIndex += 1;
    panel.style.zIndex = `${topZIndex}`;
  };

  const positionPanel = (panel: HTMLElement) => {
    if (panel.dataset.positioned) return;
    requestAnimationFrame(() => {
      const rect = panel.getBoundingClientRect();
      const left = Math.max(windowPadding, (window.innerWidth - rect.width) / 2);
      const top = Math.max(windowPadding, (window.innerHeight - rect.height) / 2);
      panel.style.left = `${left}px`;
      panel.style.top = `${top}px`;
      panel.style.width = `${rect.width}px`;
      panel.style.height = `${rect.height}px`;
      panel.dataset.positioned = 'true';
    });
  };

  const restorePanelState = (panel: HTMLElement) => {
    const href = panel.dataset.href || '';
    const stored = readPanelState(href);
    if (!stored) return false;
    panel.style.left = `${stored.left}px`;
    panel.style.top = `${stored.top}px`;
    panel.style.width = `${stored.width}px`;
    panel.style.height = `${stored.height}px`;
    panel.dataset.positioned = 'true';
    return true;
  };

  const persistPanelState = (panel: HTMLElement) => {
    const href = panel.dataset.href || '';
    if (!href) return;
    const rect = panel.getBoundingClientRect();
    writePanelState(href, { left: rect.left, top: rect.top, width: rect.width, height: rect.height });
  };

  const hidePanel = (panel: HTMLElement) => {
    panel.classList.add('hidden');
    setLayerVisibility();
  };

  const revealPanel = (panel: HTMLElement) => {
    panel.classList.remove('hidden', 'dock-activity-minimized');
    bringToFront(panel);
    setLayerVisibility();
  };

  const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

  const createDockItem = (item: ActivityItem) => {
    const li = document.createElement('li');
    li.className = 'dock-item group relative';
    li.dataset.href = item.href;
    li.dataset.label = item.label;
    li.dataset.removable = 'true';

    const anchor = document.createElement('a');
    anchor.href = item.href;
    anchor.className = 'tooltip tooltip-top block';
    anchor.dataset.tip = item.label;
    anchor.setAttribute('aria-label', item.label);

    const iconWrap = document.createElement('span');
    iconWrap.className = 'dock-icon flex h-12 w-12 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-white shadow-lg transition-all duration-200 ease-out group-hover:scale-[1.2] group-hover:shadow-2xl';
    const icon = document.createElement('span');
    icon.className = 'h-6 w-6';
    icon.innerHTML = item.icon || '';
    iconWrap.append(icon);
    anchor.append(iconWrap);
    li.append(anchor);

    const close = document.createElement('button');
    close.type = 'button';
    close.className = 'dock-remove btn btn-xs btn-circle btn-error absolute -right-1 -top-1 hidden border-0 text-[10px] text-white group-hover:flex';
    close.setAttribute('aria-label', `关闭 ${item.label}`);
    close.title = `关闭 ${item.label}`;
    close.textContent = '×';
    close.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      const updatedItems = readOpenedItems().filter((openedItem) => openedItem.href !== item.href);
      writeOpenedItems(updatedItems);
      li.remove();
    });
    li.append(close);

    return li;
  };

  const buildActivityWindow = (item: ActivityItem) => {
    if (!activityLayer || !activityTemplate) return null;
    const fragment = activityTemplate.content.cloneNode(true) as DocumentFragment;
    const panel = fragment.querySelector('.dock-activity-window') as HTMLElement | null;
    const title = panel?.querySelector('.dock-activity-title') as HTMLElement | null;
    const frame = panel?.querySelector('.dock-activity-frame') as HTMLIFrameElement | null;
    if (!panel || !title || !frame) return null;

    panel.dataset.href = item.href || '';
    panel.dataset.label = item.label || '文章';
    panel.setAttribute('aria-labelledby', `dock-activity-title-${Date.now()}`);
    title.id = panel.getAttribute('aria-labelledby') || '';
    title.textContent = item.label || '文章';
    if (item.href) {
      frame.setAttribute('src', item.href);
    }
    bringToFront(panel);
    activityLayer.append(panel);
    if (!restorePanelState(panel)) {
      positionPanel(panel);
    }

    const resizeHandles = panel.querySelectorAll('.dock-activity-resize-handle');
    const titlebar = panel.querySelector('.dock-activity-titlebar');

    const closeButton = panel.querySelector('[data-action="close"]');
    const minimizeButton = panel.querySelector('[data-action="minimize"]');
    const openButton = panel.querySelector('[data-action="open"]');

    closeButton?.addEventListener('click', () => {
      if (panel.dataset.href) {
        removeDockItemByHref(panel.dataset.href);
      }
      panel.remove();
      setLayerVisibility();
    });

    minimizeButton?.addEventListener('click', () => {
      panel.classList.add('dock-activity-minimized');
      window.setTimeout(() => {
        panel.classList.add('hidden');
        panel.classList.remove('dock-activity-minimized', 'dock-activity-fullscreen');
        setLayerVisibility();
      }, minimizeDuration);
    });

    openButton?.addEventListener('click', () => {
      if (!panel.dataset.href) return;
      panel.classList.add('dock-activity-fullscreen');
      window.setTimeout(() => {
        window.location.assign(panel.dataset.href as string);
      }, openDuration);
    });

    const startDrag = (event: PointerEvent) => {
      if (panel.classList.contains('dock-activity-fullscreen')) return;
      if ((event.target as HTMLElement | null)?.closest('.dock-control')) return;
      event.preventDefault();
      bringToFront(panel);
      const rect = panel.getBoundingClientRect();
      const startX = event.clientX;
      const startY = event.clientY;
      const startLeft = rect.left;
      const startTop = rect.top;
      let latestX = startX;
      let latestY = startY;
      let rafId: number | null = null;

      const applyMove = () => {
        const deltaX = latestX - startX;
        const deltaY = latestY - startY;
        const nextLeft = clamp(
          startLeft + deltaX,
          windowPadding,
          window.innerWidth - rect.width - windowPadding,
        );
        const nextTop = clamp(
          startTop + deltaY,
          windowPadding,
          window.innerHeight - rect.height - windowPadding,
        );
        panel.style.left = `${nextLeft}px`;
        panel.style.top = `${nextTop}px`;
        rafId = null;
      };

      const handleMove = (moveEvent: PointerEvent) => {
        latestX = moveEvent.clientX;
        latestY = moveEvent.clientY;
        if (!rafId) {
          rafId = requestAnimationFrame(applyMove);
        }
      };

      const handleUp = () => {
        window.removeEventListener('pointermove', handleMove);
        window.removeEventListener('pointerup', handleUp);
        if (rafId) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
        persistPanelState(panel);
      };

      window.addEventListener('pointermove', handleMove);
      window.addEventListener('pointerup', handleUp);
    };

    const startResize = (event: PointerEvent) => {
      if (panel.classList.contains('dock-activity-fullscreen')) return;
      const direction = (event.target as HTMLElement | null)?.dataset.resize;
      if (!direction) return;
      event.preventDefault();
      bringToFront(panel);
      const rect = panel.getBoundingClientRect();
      const startX = event.clientX;
      const startY = event.clientY;
      const startLeft = rect.left;
      const startTop = rect.top;
      const startWidth = rect.width;
      const startHeight = rect.height;
      let latestX = startX;
      let latestY = startY;
      let rafId: number | null = null;

      const applyResize = () => {
        const deltaX = latestX - startX;
        const deltaY = latestY - startY;
        let nextWidth = startWidth;
        let nextHeight = startHeight;
        let nextLeft = startLeft;
        let nextTop = startTop;

        if (direction.includes('e')) {
          nextWidth = clamp(startWidth + deltaX, minActivityWidth, window.innerWidth - startLeft - windowPadding);
        }
        if (direction.includes('s')) {
          nextHeight = clamp(startHeight + deltaY, minActivityHeight, window.innerHeight - startTop - windowPadding);
        }
        if (direction.includes('w')) {
          const maxWidth = startWidth + (startLeft - windowPadding);
          nextWidth = clamp(startWidth - deltaX, minActivityWidth, maxWidth);
          nextLeft = clamp(startLeft + deltaX, windowPadding, startLeft + startWidth - minActivityWidth);
        }
        if (direction.includes('n')) {
          const maxHeight = startHeight + (startTop - windowPadding);
          nextHeight = clamp(startHeight - deltaY, minActivityHeight, maxHeight);
          nextTop = clamp(startTop + deltaY, windowPadding, startTop + startHeight - minActivityHeight);
        }

        panel.style.left = `${nextLeft}px`;
        panel.style.top = `${nextTop}px`;
        panel.style.width = `${nextWidth}px`;
        panel.style.height = `${nextHeight}px`;
        rafId = null;
      };

      const handleMove = (moveEvent: PointerEvent) => {
        latestX = moveEvent.clientX;
        latestY = moveEvent.clientY;
        if (!rafId) {
          rafId = requestAnimationFrame(applyResize);
        }
      };

      const handleUp = () => {
        window.removeEventListener('pointermove', handleMove);
        window.removeEventListener('pointerup', handleUp);
        if (rafId) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
        persistPanelState(panel);
      };

      window.addEventListener('pointermove', handleMove);
      window.addEventListener('pointerup', handleUp);
    };

    if (titlebar) {
      titlebar.addEventListener('pointerdown', startDrag);
    }
    resizeHandles.forEach((handle) => handle.addEventListener('pointerdown', startResize));
    panel.addEventListener('pointerdown', () => bringToFront(panel));

    return panel;
  };

  const openActivityWindow = (item: ActivityItem) => {
    if (!activityLayer) return;
    const existing = activityLayer.querySelector(`.dock-activity-window[data-href="${item.href}"]`) as HTMLElement | null;
    if (existing) {
      const isMinimized = existing.classList.contains('dock-activity-minimized');
      const isHidden = existing.classList.contains('hidden');
      const isVisible = !isHidden && !isMinimized;
      if (isVisible) {
        hidePanel(existing);
        return;
      }
      revealPanel(existing);
      return;
    }
    buildActivityWindow(item);
    setLayerVisibility();
  };

  const closeAllActivityWindows = () => {
    if (!activityLayer) return;
    activityLayer.querySelectorAll('.dock-activity-window').forEach((panel) => panel.remove());
    setLayerVisibility();
  };

  const removeDockItemByHref = (href: string) => {
    if (!href) return;
    const updatedItems = readOpenedItems().filter((openedItem) => openedItem.href !== href);
    writeOpenedItems(updatedItems);
    dock.querySelectorAll('.dock-item').forEach((item) => {
      if ((item as HTMLElement).dataset.href === href) {
        item.remove();
      }
    });
  };

  const addOpenedItem = (entry: ActivityItem) => {
    const normalizedHref = normalizeHref(entry.href);
    const normalizedEntry = { ...entry, href: normalizedHref };
    const deduped = [normalizedEntry, ...readOpenedItems().filter((item) => item.href !== normalizedHref)].slice(0, 5);
    writeOpenedItems(deduped);
    if (rightList && !rightList.querySelector(`.dock-item[data-href="${normalizedHref}"]`)) {
      rightList.prepend(createDockItem(normalizedEntry));
    }
  };

  const normalizeHref = (href: string) => {
    try {
      const url = new URL(href, window.location.origin);
      if (url.origin === window.location.origin) {
        return url.pathname;
      }
      return href;
    } catch {
      return href;
    }
  };

  const isSystemPath = ['/', '/blog/', '/about/'].includes(payload.currentPath);
  const isBlogPostPath = /^\/posts\/.+/.test(payload.currentPath);

  if (!isSystemPath && isBlogPostPath && payload.currentPath) {
    addOpenedItem({
      label: payload.pageTitle || document.title || '文章',
      href: payload.currentPath,
      icon: articleIcon,
    });
  }

  const finalOpenedItems = readOpenedItems();
  if (rightList && finalOpenedItems.length > 0) {
    const fragment = document.createDocumentFragment();
    finalOpenedItems.forEach((item) => {
      if (!rightList.querySelector(`.dock-item[data-href="${item.href}"]`)) {
        fragment.prepend(createDockItem(item));
      }
    });
    rightList.prepend(fragment);
  }

  dock.addEventListener('click', (event) => {
    const anchor = (event.target as HTMLElement | null)?.closest('.dock-item a') as HTMLAnchorElement | null;
    if (!anchor) return;
    const listItem = anchor.closest('.dock-item') as HTMLElement | null;
    if (!listItem || listItem.dataset.removable !== 'true') return;
    event.preventDefault();
    openActivityWindow({
      href: normalizeHref(anchor.getAttribute('href') || ''),
      label: listItem.dataset.label || '文章',
    });
  });

  activityLayer?.addEventListener('dblclick', (event) => {
    const panel = (event.target as HTMLElement | null)?.closest('.dock-activity-window') as HTMLElement | null;
    if (!panel?.dataset.href) return;
    window.location.assign(panel.dataset.href);
  });

  activityLayer?.addEventListener('click', (event) => {
    if ((event.target as HTMLElement | null)?.closest('.dock-activity-window')) return;
    if ((event.target as HTMLElement | null)?.closest('#mac-dock')) return;
    closeAllActivityWindows();
  });

  // Note: we only add items on post pages to avoid duplicates during navigation.

  dock.querySelectorAll('[data-action="back-to-top"]').forEach((item) => {
    item.querySelector('a')?.addEventListener('click', (event) => {
      event.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  dock.querySelectorAll('[data-action="theme-toggle"]').forEach((item) => {
    item.querySelector('a')?.addEventListener('click', (event) => {
      event.preventDefault();
      const savedTheme = window.localStorage.getItem('theme');
      const currentTheme = savedTheme === 'dark' || savedTheme === 'light'
        ? savedTheme
        : (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', nextTheme);
      window.localStorage.setItem('theme', nextTheme);
    });
  });

  scheduleHide();
};
