const handleEvent = async req => {
  if (req.requestHeaders) {
    console.log('Writing......');
    const headers = req.requestHeaders ?? [];
    const authHeader = headers.find(({ name }: { name: string }) => name === 'Authorization');
    if (authHeader) {
      await chrome.storage.local.set({ authToken: authHeader.value });
    }
  }
};

chrome.webRequest.onBeforeSendHeaders.addListener(
  req => {
    handleEvent(req);
  },
  { urls: ['*://*.chatgpt.com/backend-api/*'] },
  ['requestHeaders'],
);
