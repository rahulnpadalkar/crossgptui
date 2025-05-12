export enum SyncStatus {
  SYNCED,
  SYNCING,
  ERROR,
}

export const updateStatus = (status: SyncStatus) => {
  const synced = document.querySelector('#supergpt-search-synced');
  const sync = document.querySelector('#supergpt-search-sync');
  const error = document.querySelector('#supergpt-sync-error');
  if (status === SyncStatus.SYNCED) {
    if (synced && sync) {
      synced.classList.remove('supergpt-hide');
      synced.classList.add('supergpt-show');
      sync.classList.add('supergpt-hide');
      sync.classList.remove('supergpt-show');
    }
  } else if (status === SyncStatus.ERROR) {
    if (sync && error) {
      sync.classList.add('supergpt-hide');
      sync.classList.remove('supergpt-show');
      error.classList.remove('supergpt-hide');
      error.classList.add('supergpt-show');
    }
  }
};

export const extractChatId = (text: string) => {
  const match = text.match(/\/c\/([a-zA-Z0-9-]{20,})/);
  return match ? match[1] : 0;
};

export const getTheme = () => {
  const gptTheme = localStorage.getItem('theme');
  if (gptTheme === 'system') {
    const theme = window.matchMedia('(prefers-color-scheme: dark)');
    if (theme.matches) {
      return 'dark';
    }
    return 'light';
  }
  return gptTheme;
};
