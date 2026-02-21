import { toggleThemePreference } from "../../../../scripts/theme/themeManager.ts";

// Bind click actions for non-navigation dock items.
export const bindDockActions = (dock: HTMLElement) => {
  dock.querySelectorAll('[data-action="back-to-top"]').forEach((item) => {
    item.querySelector('a')?.addEventListener('click', (event) => {
      event.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  dock.querySelectorAll('[data-action="theme-toggle"]').forEach((item) => {
    item.querySelector('a')?.addEventListener('click', (event) => {
      event.preventDefault();
      toggleThemePreference();
    });
  });
};
