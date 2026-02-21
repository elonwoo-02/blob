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
      const savedTheme = window.localStorage.getItem('theme');
      const currentTheme = savedTheme === 'dark' || savedTheme === 'light'
        ? savedTheme
        : (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', nextTheme);
      window.localStorage.setItem('theme', nextTheme);
    });
  });
};
