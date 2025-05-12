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
