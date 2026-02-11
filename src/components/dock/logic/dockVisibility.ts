// Auto-hide/auto-show behavior for the dock bar.
import { DOCK_CONSTANTS } from '../data/dockConstants.js';

export const createDockVisibility = (dock: HTMLElement) => {
  const { hideDelay, showBoundary } = DOCK_CONSTANTS;
  let hideTimer: number | undefined;
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

  const evaluate = () => {
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
    evaluate();
  });

  dock.addEventListener('pointerleave', () => {
    isHoveringDock = false;
    evaluate();
  });

  document.addEventListener('pointermove', (event) => {
    pendingPointerY = event.clientY;
    if (pointerRafId !== null) return;
    pointerRafId = requestAnimationFrame(() => {
      evaluate();
      pointerRafId = null;
    });
  });

  window.addEventListener('scroll', () => {
    isScrolling = true;
    window.clearTimeout(scrollTimer);
    scrollTimer = window.setTimeout(() => {
      isScrolling = false;
      evaluate();
    }, 180);
  }, { passive: true });

  scheduleHide();
};
