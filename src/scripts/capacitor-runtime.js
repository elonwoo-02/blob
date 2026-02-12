import { App } from '@capacitor/app';

// Capacitor-only runtime helpers:
// - Android back button handling
// - Link rewriting for file/android_asset deployments
const isCapacitor = typeof window !== 'undefined' && !!window.Capacitor;

if (isCapacitor) {
  const EXIT_CONFIRM_WINDOW_MS = 1800;
  let lastBackPressAt = 0;
  let backToastTimer = null;

  const showExitToast = () => {
    let toast = document.getElementById('app-back-exit-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'app-back-exit-toast';
      toast.setAttribute('role', 'status');
      toast.setAttribute('aria-live', 'polite');
      toast.textContent = '\u518d\u8fd4\u56de\u4e00\u6b21\u9000\u51fa\u5e94\u7528';
      Object.assign(toast.style, {
        position: 'fixed',
        left: '50%',
        bottom: '28px',
        transform: 'translateX(-50%)',
        zIndex: '9999',
        pointerEvents: 'none',
        background: 'rgba(0, 0, 0, 0.78)',
        color: '#fff',
        borderRadius: '999px',
        padding: '8px 14px',
        fontSize: '13px',
        lineHeight: '1.2',
        opacity: '0',
        transition: 'opacity 180ms ease',
      });
      document.body.appendChild(toast);
    }

    toast.style.opacity = '1';
    if (backToastTimer) {
      window.clearTimeout(backToastTimer);
    }
    backToastTimer = window.setTimeout(() => {
      toast.style.opacity = '0';
    }, 1200);
  };

  // Only enable back-button handling when running from file-like origins.
  const isFileLike =
    window.location.protocol === 'file:' ||
    window.location.origin === 'null' ||
    window.location.href.includes('/android_asset/');

  if (isFileLike) {
    App.addListener('backButton', ({ canGoBack }) => {
      if (canGoBack) {
        window.history.back();
      } else {
        const now = Date.now();
        if (now - lastBackPressAt <= EXIT_CONFIRM_WINDOW_MS) {
          App.exitApp();
          return;
        }

        lastBackPressAt = now;
        showExitToast();
      }
    });
  }

  // Compute base path for android_asset and file-like deployments.
  const rootBase = (() => {
    const href = window.location.href;
    const marker = '/android_asset/public/';
    const markerIndex = href.indexOf(marker);
    if (markerIndex >= 0) {
      return href.slice(0, markerIndex + marker.length);
    }
    if (window.location.origin && window.location.origin !== 'null') {
      return `${window.location.origin}/`;
    }
    return href.replace(/[^/]*$/, '');
  })();

  // Normalize routes to index.html for Capacitor file routing.
  const toIndexPath = (rawPath) => {
    let normalized = rawPath.startsWith('/') ? rawPath.slice(1) : rawPath;
    if (!normalized) return 'index.html';
    if (normalized.endsWith('/')) return `${normalized}index.html`;
    if (!/\.[a-z0-9]+$/i.test(normalized)) return `${normalized}/index.html`;
    return normalized;
  };

  // Rewrite only internal paths; preserve anchors and external protocols.
  const rewriteHref = (href) => {
    if (!href) return href;
    if (href.startsWith('#')) return href;
    if (/^(https?:|mailto:|tel:|sms:)/i.test(href)) return href;
    if (href.startsWith('/')) {
      return `${rootBase}${toIndexPath(href)}`;
    }
    return href;
  };

  // Rewrite existing links at load time.
  document.querySelectorAll('a[href]').forEach((link) => {
    const href = link.getAttribute('href');
    const rewritten = rewriteHref(href);
    if (rewritten && rewritten !== href) {
      link.setAttribute('href', rewritten);
    }
  });

  // Ensure SPA-like navigation uses rewritten hrefs.
  document.addEventListener('click', (event) => {
    const anchor = event.target?.closest?.('a[href]');
    if (!anchor) return;
    const href = anchor.getAttribute('href');
    const rewritten = rewriteHref(href);
    if (rewritten && rewritten !== href) {
      event.preventDefault();
      window.location.href = rewritten;
    }
  });
}
