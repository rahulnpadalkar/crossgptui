import { fetchMessages } from './fetchData';

export const addCustomListeners = () => {
  window.addEventListener('force-fetch-messages', async e => {
    const { convoId } = e.detail;
    await fetchMessages([convoId]);
    window.dispatchEvent(new CustomEvent('force-fetch-messages-completed', { detail: { convoId } }));
  });
};
