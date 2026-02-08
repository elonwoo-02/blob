export interface DockEntry {
  label: string;
  href: string;
  icon: string;
}

export interface PanelState {
  left: number;
  top: number;
  width: number;
  height: number;
}

const openedItemsKey = 'dock-opened-items';

export const readOpenedItems = (): DockEntry[] => {
  return JSON.parse(window.localStorage.getItem(openedItemsKey) || '[]');
};

export const writeOpenedItems = (items: DockEntry[]) => {
  window.localStorage.setItem(openedItemsKey, JSON.stringify(items));
};

export const readPanelState = (href: string): PanelState | null => {
  if (!href) return null;
  const stored = window.localStorage.getItem(`dock:panel:${href}`);
  if (!stored) return null;
  try {
    return JSON.parse(stored) as PanelState;
  } catch {
    return null;
  }
};

export const writePanelState = (href: string, state: PanelState) => {
  if (!href) return;
  window.localStorage.setItem(`dock:panel:${href}`, JSON.stringify(state));
};
