  const overlay = document.getElementById('shortcut-overlay');
  const terminalPanel = document.getElementById('terminal-panel');
  const terminalModal = document.querySelector('.shortcut-modal');
  const terminalTitlebar = document.querySelector('.shortcut-titlebar');
  const terminalInput = document.getElementById('terminal-input');
  const terminalOutput = document.getElementById('terminal-output');
  const closeButtons = document.querySelectorAll('[data-shortcut-close]');
  const titlebars = document.querySelectorAll('.shortcut-titlebar');
  const dock = document.querySelector('#mac-dock');

  let sequence = '';
  let sequenceTimer = null;
  const isEditableTarget = (target) => {
    if (!target) return false;
    const tag = target.tagName?.toLowerCase?.();
    return target.isContentEditable || ['input', 'textarea', 'select'].includes(tag);
  };
  const updateClock = () => {
    const now = new Date();
    const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    titlebars.forEach((bar) => bar.setAttribute('data-clock', time));
  };

  updateClock();
  window.setInterval(updateClock, 30000);
  const openOverlay = (panel) => {
    overlay?.classList.remove('hidden');
    overlay?.setAttribute('aria-hidden', 'false');
    panel?.classList.remove('hidden');
  };
  const closeOverlay = () => {
    overlay?.classList.add('hidden');
    overlay?.setAttribute('aria-hidden', 'true');
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
    if (!terminalOutput) return;
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
  const openTerminal = () => {
    openOverlay(terminalPanel);
    if (terminalOutput && terminalOutput.children.length === 0 && history.length) {
      pushLine('Last session:', 'dim');
      history.slice(-5).forEach((entry, index) => {
        const idx = history.length - 5 + index + 1;
        pushClickable(`${idx}. ${entry}`, entry);
      });
    }
    terminalInput?.focus();
  };

  // 统一交互引擎：将“拖拽移动 + 八方向缩放”合并到同一套 Pointer 事件流程。
  if (terminalModal) {
    const handles = terminalModal.querySelectorAll('.terminal-resize-handle');
    const minWidth = 420;
    const minHeight = 320;

    // 当前交互会话快照；为空表示没有活跃的拖拽/缩放过程。
    let interaction = null;
    // 保存最新指针位置，配合 requestAnimationFrame 做写入节流。
    let pointerX = 0;
    let pointerY = 0;
    let rafId = 0;

    // 在同一帧内只执行一次样式写入，降低高频 pointermove 带来的重排压力。
    const scheduleApply = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(() => {
        rafId = 0;
        applyInteraction();
      });
    };

    // 根据当前会话类型（drag/resize）计算位置与尺寸，并写入 DOM。
    const applyInteraction = () => {
      if (!interaction) return;

      const deltaX = pointerX - interaction.startX;
      const deltaY = pointerY - interaction.startY;

      if (interaction.mode === 'drag') {
        terminalModal.style.left = `${interaction.startLeft + deltaX}px`;
        terminalModal.style.top = `${interaction.startTop + deltaY}px`;
        terminalModal.style.transform = 'translate(0, 0)';
        return;
      }

      let nextWidth = interaction.startWidth;
      let nextHeight = interaction.startHeight;
      let nextLeft = interaction.startLeft;
      let nextTop = interaction.startTop;
      const dirs = interaction.dirFlags;

      if (dirs.e) {
        nextWidth = Math.max(minWidth, interaction.startWidth + deltaX);
      }
      if (dirs.s) {
        nextHeight = Math.max(minHeight, interaction.startHeight + deltaY);
      }
      if (dirs.w) {
        const next = Math.max(minWidth, interaction.startWidth - deltaX);
        nextLeft = interaction.startLeft + (interaction.startWidth - next);
        nextWidth = next;
      }
      if (dirs.n) {
        const next = Math.max(minHeight, interaction.startHeight - deltaY);
        nextTop = interaction.startTop + (interaction.startHeight - next);
        nextHeight = next;
      }

      terminalModal.style.left = `${nextLeft}px`;
      terminalModal.style.top = `${nextTop}px`;
      terminalModal.style.width = `${nextWidth}px`;
      terminalModal.style.height = `${nextHeight}px`;
      terminalModal.style.transform = 'translate(0, 0)';
    };

    // 结束当前交互：清理 rAF 与全局监听，释放 pointer capture。
    const endInteraction = (pointerId) => {
      if (!interaction || interaction.pointerId !== pointerId) return;
      if (rafId) {
        window.cancelAnimationFrame(rafId);
        rafId = 0;
      }
      terminalModal.releasePointerCapture?.(pointerId);
      interaction = null;
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
    };

    const onPointerMove = (event) => {
      if (!interaction || interaction.pointerId !== event.pointerId) return;
      pointerX = event.clientX;
      pointerY = event.clientY;
      scheduleApply();
    };

    const onPointerUp = (event) => {
      if (!interaction || interaction.pointerId !== event.pointerId) return;
      // 结束前做一次同步写入，避免最后一帧未刷新的位置差。
      pointerX = event.clientX;
      pointerY = event.clientY;
      applyInteraction();
      endInteraction(event.pointerId);
    };

    // 创建交互会话：drag 来自标题栏，resize 来自手柄。
    const beginInteraction = (event, mode, direction = '') => {
      if (event.button !== 0) return;
      event.preventDefault();
      if (mode === 'resize') {
        // 缩放手柄需要阻断冒泡，避免触发标题栏拖拽。
        event.stopPropagation();
      }

      const rect = terminalModal.getBoundingClientRect();
      pointerX = event.clientX;
      pointerY = event.clientY;
      interaction = {
        mode,
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        startLeft: rect.left,
        startTop: rect.top,
        startWidth: rect.width,
        startHeight: rect.height,
        dirFlags: {
          n: direction.includes('n'),
          s: direction.includes('s'),
          e: direction.includes('e'),
          w: direction.includes('w'),
        },
      };

      terminalModal.setPointerCapture?.(event.pointerId);
      window.addEventListener('pointermove', onPointerMove, { passive: true });
      window.addEventListener('pointerup', onPointerUp);
      window.addEventListener('pointercancel', onPointerUp);
    };

    if (terminalTitlebar) {
      terminalTitlebar.addEventListener('pointerdown', (event) => {
        beginInteraction(event, 'drag');
      });
    }

    handles.forEach((handle) => {
      handle.addEventListener('pointerdown', (event) => {
        beginInteraction(event, 'resize', handle.dataset.resize || '');
      });
    });
  }
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
  const showHelp = () => {
    pushLine('Commands:');
    pushLine('  help                 Show all commands', 'dim');
    pushLine('  help <cmd>            Show command usage', 'dim');
    pushLine('  home                 Go to Home', 'dim');
    pushLine('  blog                 Go to Blog', 'dim');
    pushLine('  about                Go to About', 'dim');
    pushLine('  bookmarks            Go to Bookmarks', 'dim');
    pushLine('  theme dark|light|auto Switch theme', 'dim');
    pushLine('  theme toggle          Toggle theme', 'dim');
    pushLine('  open <url>            Open a URL', 'dim');
    pushLine('  search <keyword>      Filter posts by keyword', 'dim');
    pushLine('  search tags <tag>     Filter posts by tag', 'dim');
    pushLine('  notes                Show quick notes', 'dim');
    pushLine('  notes add <text>      Add a note', 'dim');
    pushLine('  notes clear           Clear all notes', 'dim');
    pushLine('  draft <title>         New draft template', 'dim');
    pushLine('  post <title>          New post template', 'dim');
    pushLine('  links                Show common links', 'dim');
    pushLine('  export               Download terminal output', 'dim');
    pushLine('  toggle dock          Show/hide dock', 'dim');
    pushLine('  profile              Show profile info', 'dim');
    pushLine('  version              Show app version', 'dim');
    pushLine('  clear                Clear terminal output', 'dim');
    pushLine('  clear-history        Clear all command history', 'dim');
    pushLine('  !<n>                 Re-run history item', 'dim');
    pushLine('  reset-layout         Clear saved window layout', 'dim');
    pushLine('  reload               Reload current page', 'dim');
    pushLine('  status               Show page status', 'dim');
    pushLine('  exit                 Close terminal', 'dim');
  };
  const showHelpFor = (cmd) => {
    switch (cmd) {
      case 'help':
        pushLine('help [command] - show command list or usage', 'dim');
        break;
      case 'home':
        pushLine('home - go to Home', 'dim');
        break;
      case 'blog':
        pushLine('blog - go to Blog', 'dim');
        break;
      case 'about':
        pushLine('about - go to About', 'dim');
        break;
      case 'bookmarks':
        pushLine('bookmarks - go to Bookmarks', 'dim');
        break;
      case 'theme':
        pushLine('theme dark|light|auto|toggle - switch theme', 'dim');
        break;
      case 'open':
        pushLine('open <url> - open a URL', 'dim');
        break;
      case 'search':
        pushLine('search <keyword> - list matching posts', 'dim');
        pushLine('search tags <tag> - list posts by tag', 'dim');
        break;
      case 'notes':
        pushLine('notes - show quick notes', 'dim');
        pushLine('notes add <text> - add a note', 'dim');
        pushLine('notes clear - clear all notes', 'dim');
        break;
      case 'draft':
        pushLine('draft <title> - output draft template', 'dim');
        break;
      case 'post':
        pushLine('post <title> - output post template', 'dim');
        break;
      case 'links':
        pushLine('links - show common links', 'dim');
        break;
      case 'export':
        pushLine('export - download terminal output', 'dim');
        break;
      case 'toggle':
        pushLine('toggle dock - show/hide dock', 'dim');
        break;
      case 'profile':
        pushLine('profile - show profile info', 'dim');
        break;
      case 'version':
        pushLine('version - show app version', 'dim');
        break;
      case 'clear':
        pushLine('clear - clear terminal output', 'dim');
        break;
      case 'reset-layout':
        pushLine('reset-layout - clear saved window layout', 'dim');
        break;
      case 'reload':
        pushLine('reload - reload current page', 'dim');
        break;
      case 'status':
        pushLine('status - show location, theme, online', 'dim');
        break;
      case 'exit':
        pushLine('exit - close terminal', 'dim');
        break;
      default:
        pushLine(`No help for "${cmd}".`, 'dim');
        break;
    }
  };
  let lastSearchResults = [];
  const runSearch = async (keyword) => {
    if (!keyword) {
      pushLine('Usage: search <keyword>', 'error');
      return;
    }
    pushLine(`Searching for "${keyword}"...`, 'dim');
    try {
      const res = await fetch('/search.json');
      const data = await res.json();
      const items = Array.isArray(data.items) ? data.items : [];
      const needle = keyword.toLowerCase();
      const matches = items.filter((item) => {
        const title = (item.title || '').toLowerCase();
        const description = (item.description || '').toLowerCase();
        const tags = Array.isArray(item.tags) ? item.tags.join(' ').toLowerCase() : '';
        return title.includes(needle) || description.includes(needle) || tags.includes(needle);
      }).slice(0, 6);
      lastSearchResults = matches;
      if (!matches.length) {
        pushLine('No results.', 'dim');
        return;
      }
      matches.forEach((item) => {
        pushLine(`${item.title} -> ${item.url}`);
        if (item.description) {
          pushLine(`  ${item.description}`, 'dim');
        }
        if (Array.isArray(item.tags) && item.tags.length) {
          pushLine(`  #${item.tags.join(' #')}`, 'dim');
        }
      });
    } catch {
      lastSearchResults = [];
      pushLine('Search index not available.', 'error');
    }
  };
  const runTagSearch = async (tag) => {
    if (!tag) {
      pushLine('Usage: search tags <tag>', 'error');
      return;
    }
    pushLine(`Searching tag "${tag}"...`, 'dim');
    try {
      const res = await fetch('/search.json');
      const data = await res.json();
      const items = Array.isArray(data.items) ? data.items : [];
      const needle = tag.toLowerCase();
      const matches = items.filter((item) => {
        const tags = Array.isArray(item.tags) ? item.tags : [];
        return tags.some((t) => t.toLowerCase() === needle);
      }).slice(0, 8);
      lastSearchResults = matches;
      if (!matches.length) {
        pushLine('No results.', 'dim');
        return;
      }
      matches.forEach((item) => {
        pushLine(`${item.title} -> ${item.url}`);
        if (item.description) {
          pushLine(`  ${item.description}`, 'dim');
        }
        if (Array.isArray(item.tags) && item.tags.length) {
          pushLine(`  #${item.tags.join(' #')}`, 'dim');
        }
      });
    } catch {
      lastSearchResults = [];
      pushLine('Search index not available.', 'error');
    }
  };
  const notesKey = 'terminal-notes';
  const readNotes = () => JSON.parse(window.localStorage.getItem(notesKey) || '[]');
  const writeNotes = (notes) => {
    window.localStorage.setItem(notesKey, JSON.stringify(notes.slice(-100)));
  };
  const showNotes = () => {
    const notes = readNotes();
    if (!notes.length) {
      pushLine('No notes yet. Use: notes add <text>', 'dim');
      return;
    }
    pushLine('Notes:', 'dim');
    const startIndex = Math.max(0, notes.length - 10);
    notes.slice(-10).forEach((note, index) => {
      pushLine(`${startIndex + index + 1}. ${note}`, 'dim');
    });
  };
  const generateTemplate = (kind, title) => {
    const date = new Date().toISOString().slice(0, 10);
    const safeTitle = title || 'Untitled';
    const template = [
      '---',
      `title: ${safeTitle}`,
      `date: ${date}`,
      'description: ',
      'tags: []',
      '---',
      '',
      '# ' + safeTitle,
      '',
      kind === 'draft' ? '> Draft notes here.' : 'Write here.',
      '',
    ].join('\n');
    pushLine(template);
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(template).then(
        () => pushLine('Template copied to clipboard.', 'dim'),
        () => pushLine('Copy failed. Select and copy manually.', 'dim'),
      );
    }
  };
  const showLinks = () => {
    pushLine('Links:', 'dim');
    pushLine('Home -> /', 'dim');
    pushLine('Blog -> /blog/', 'dim');
    pushLine('About -> /about/', 'dim');
    pushLine('Tags -> /tags/', 'dim');
    pushLine('RSS -> /rss.xml', 'dim');
  };
  const exportOutput = () => {
    if (!terminalOutput) return;
    const lines = Array.from(terminalOutput.children).map((li) => li.textContent || '');
    if (!lines.length) {
      pushLine('Nothing to export.', 'dim');
      return;
    }
    const stamp = new Date().toISOString().replace(/[:.]/g, '-');
    const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `terminal-log-${stamp}.txt`;
    document.body.append(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    pushLine('Exported terminal output.', 'dim');
  };
  const toggleDock = () => {
    const root = document.documentElement;
    const isHidden = root.classList.toggle('dock-hidden');
    window.localStorage.setItem('dock-hidden', isHidden ? '1' : '0');
    if (dock) {
      dock.style.opacity = isHidden ? '0' : '';
    }
    pushLine(isHidden ? 'Dock hidden.' : 'Dock shown.', 'dim');
  };
  const showProfile = () => {
    pushLine('Profile:', 'dim');
    pushLine(`title: ${document.title}`, 'dim');
    pushLine(`origin: ${window.location.origin}`, 'dim');
    const theme = window.localStorage.getItem('theme') || 'light';
    pushLine(`theme: ${theme}`, 'dim');
  };
  const showVersion = () => {
    pushLine('App version:', 'dim');
    pushLine(`build: ${document.lastModified}`, 'dim');
    pushLine(`runtime: ${navigator.userAgent}`, 'dim');
  };
  closeButtons.forEach((btn) => {
    btn.addEventListener('click', closeOverlay);
  });
  overlay?.addEventListener('click', (event) => {
    if (event.target === overlay) closeOverlay();
  });
  document.addEventListener('click', (event) => {
    const trigger = event.target?.closest?.('[data-action="terminal"]');
    if (!trigger) return;
    event.preventDefault();
    openTerminal();
  });
  document.addEventListener('keydown', (event) => {
    const key = event.key;
    if (key === 'Escape' && !overlay?.classList.contains('hidden')) {
      event.preventDefault();
      closeOverlay();
      return;
    }

    if (event.metaKey || event.ctrlKey || event.altKey) return;
    if (isEditableTarget(event.target)) return;

    if (key === 'k' || key === 'K') {
      event.preventDefault();
      openTerminal();
      return;
    }

    if (key === 'h' || key === 'H') {
      event.preventDefault();
      navigateTo('/');
      return;
    }

    if (key === 'g' || key === 'G') {
      sequence = 'g';
      window.clearTimeout(sequenceTimer);
      sequenceTimer = window.setTimeout(() => {
        sequence = '';
      }, 800);
      return;
    }

    if (sequence === 'g') {
      if (key === 'b' || key === 'B') {
        event.preventDefault();
        sequence = '';
        navigateTo('/blog/');
        return;
      }
      if (key === 'a' || key === 'A') {
        event.preventDefault();
        sequence = '';
        navigateTo('/about/');
        return;
      }
    }
  });
  const elonBot = document.getElementById('elon-bot');
  if (elonBot && window.self !== window.top) {
    elonBot.classList.add('is-hidden');
    elonBot.setAttribute('aria-hidden', 'true');
  }
  const historyKey = 'terminal-history';
  const history = JSON.parse(window.localStorage.getItem(historyKey) || '[]');
  let historyIndex = -1;
  const commands = [
    'help',
    'home',
    'blog',
    'about',
    'bookmarks',
    'theme',
    'open',
    'search',
    'notes',
    'draft',
    'post',
    'links',
    'export',
    'toggle',
    'profile',
    'version',
    'clear',
    'reset-layout',
    'reload',
    'status',
    'exit',
    'clear-history',
  ];
  const completeInput = () => {
    const raw = terminalInput.value;
    const parts = raw.split(' ');
    if (parts.length === 0) return;
    const head = parts[0];
    if (!head) return;
    const matches = commands.filter((cmd) => cmd.startsWith(head));
    if (matches.length === 1) {
      parts[0] = matches[0];
      terminalInput.value = parts.join(' ');
    } else if (matches.length > 1) {
      pushLine(matches.join(' '), 'dim');
    }
  };
  terminalInput?.addEventListener('keydown', (event) => {
    if (event.key === 'Tab') {
      event.preventDefault();
      completeInput();
      return;
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (!history.length) return;
      historyIndex = Math.min(historyIndex + 1, history.length - 1);
      terminalInput.value = history[history.length - 1 - historyIndex];
      return;
    }
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (!history.length) return;
      historyIndex = Math.max(historyIndex - 1, -1);
      terminalInput.value = historyIndex === -1 ? '' : history[history.length - 1 - historyIndex];
      return;
    }
    if (event.key !== 'Enter') return;
    const raw = terminalInput.value.trim();
    if (!raw) {
      if (lastSearchResults.length) {
        navigateTo(lastSearchResults[0].url);
      }
      return;
    }
    const executeCommand = (command, argument) => {
      switch (command.toLowerCase()) {
        case 'help':
          if (argument) {
            showHelpFor(argument);
          } else {
            showHelp();
          }
          break;
        case 'home':
          navigateTo('/');
          break;
        case 'blog':
          navigateTo('/blog/');
          break;
        case 'about':
          navigateTo('/about/');
          break;
        case 'bookmarks':
          navigateTo('/bookmarks/');
          break;
        case 'theme':
          if (argument === 'dark' || argument === 'light' || argument === 'auto') {
            setThemeMode(argument);
            pushLine(`Theme set to ${argument}.`, 'dim');
          } else if (argument === 'toggle') {
            const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
            const next = currentTheme === 'dark' ? 'light' : 'dark';
            setThemeMode(next);
            pushLine(`Theme set to ${next}.`, 'dim');
          } else {
            pushLine('Usage: theme dark|light|auto|toggle', 'error');
          }
          break;
        case 'open':
          if (!argument) {
            pushLine('Usage: open <url>', 'error');
            break;
          }
          navigateTo(argument);
          break;
        case 'search':
          if (argument.startsWith('tags ')) {
            runTagSearch(argument.slice(5).trim());
          } else {
            runSearch(argument);
          }
          break;
        case 'notes': {
          const [sub, ...rest] = argument.split(' ');
          if (sub === 'add') {
            const note = rest.join(' ').trim();
            if (!note) {
              pushLine('Usage: notes add <text>', 'error');
              break;
            }
            const notes = readNotes();
            notes.push(note);
            writeNotes(notes);
            pushLine('Note saved.', 'dim');
            break;
          }
          if (sub === 'clear') {
            writeNotes([]);
            pushLine('Notes cleared.', 'dim');
            break;
          }
          showNotes();
          break;
        }
        case 'draft':
          generateTemplate('draft', argument);
          break;
        case 'post':
          generateTemplate('post', argument);
          break;
        case 'links':
          showLinks();
          break;
        case 'export':
          exportOutput();
          break;
        case 'toggle':
          if (argument === 'dock') {
            toggleDock();
          } else {
            pushLine('Usage: toggle dock', 'error');
          }
          break;
        case 'profile':
          showProfile();
          break;
        case 'version':
          showVersion();
          break;
        case 'clear':
          if (terminalOutput) terminalOutput.innerHTML = '';
          lastSearchResults = [];
          break;
        case 'reload':
          window.location.reload();
          break;
        case 'status': {
          const theme = window.localStorage.getItem('theme') || 'light';
          pushLine(`path: ${window.location.pathname}`, 'dim');
          pushLine(`theme: ${theme}`, 'dim');
          pushLine(`online: ${navigator.onLine ? 'yes' : 'no'}`, 'dim');
          break;
        }
        case 'reset-layout':
          Object.keys(window.localStorage).forEach((key) => {
            if (key.startsWith('dock:panel:')) {
              window.localStorage.removeItem(key);
            }
          });
          pushLine('Layout reset. Reopen panels to re-center.', 'dim');
          break;
        case 'clear-history':
          history.length = 0;
          window.localStorage.removeItem(historyKey);
          pushLine('History cleared.', 'dim');
          break;
        case 'exit':
          closeOverlay();
          break;
        default:
          pushLine(`Unknown command: ${command}`, 'error');
          pushLine('Type "help" to see available commands.', 'dim');
          break;
      }
    };
    if (raw.startsWith('!')) {
      const idx = Number(raw.slice(1));
      if (Number.isInteger(idx) && idx >= 1 && idx <= history.length) {
        const cmdToRun = history[idx - 1];
        terminalInput.value = '';
        pushLine(`$ ${cmdToRun}`, 'command');
        const [cmd, ...rest] = cmdToRun.split(' ');
        const arg = rest.join(' ').trim();
        executeCommand(cmd, arg);
        return;
      } else {
        pushLine('Usage: !<n> (n from 1 to history length)', 'error');
        return;
      }
    }
    history.push(raw);
    window.localStorage.setItem(historyKey, JSON.stringify(history.slice(-100)));
    historyIndex = -1;
    pushLine(`$ ${raw}`, 'command');
    terminalInput.value = '';
    const [cmd, ...rest] = raw.split(' ');
    const arg = rest.join(' ').trim();
    executeCommand(cmd, arg);
  });


