import { useEffect, useState } from 'react';
import { AddTags } from './AddTags';
import { ExpandCollapseButton } from './ExpandCollapse';
import { Search } from './modals/Search';
import { OrganizedWithTags } from './OrganizedWithTags';
import { PinnedChats } from './PinnedChats';
import { Images } from './modals/Images';
import { DownloadAction } from './modals/DownloadAudio';
import { ExportChat } from './ExportChat';
import { OrganizeFolders } from './modals/OrganizeFolders';
import { LabelChats } from './modals/LabelChats';
import { Questions } from './modals/Questions';

const chatRegex = /https:\/\/chatgpt\.com(?:\/g\/g-p-[a-z0-9-]+\/c|\/c)\/[a-z0-9-]+/;

const BASE_URL = 'https://app.supergpt.chat';

export default function App() {
  const [onChat, setOnChat] = useState<boolean>(false);
  const [paid, setPaid] = useState<boolean>(false);

  useEffect(() => {
    setInterval(isOnChatScreen, 500);
    setTimeout(isPaidUser, 2000);
  }, []);

  const isPaidUser = async () => {
    const { userEmail } = await chrome.storage.local.get('userEmail');

    const res = await fetch(`${BASE_URL}/user/valid`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: userEmail }),
    });
    const { valid } = await res.json();
    setPaid(valid ?? false);
  };

  const isOnChatScreen = () => {
    const currURL = window.location.href;
    const onChatScreen = chatRegex.test(currURL);
    if (onChatScreen) {
      setOnChat(true);
    } else {
      setOnChat(false);
    }
  };

  return (
    <div className="flex" style={{ justifyContent: 'flex-end' }}>
      <div
        className="flex flex-col"
        style={{ marginTop: '5rem', marginRight: '2rem', pointerEvents: 'auto', maxWidth: '17rem', width: '17rem' }}>
        {onChat && (
          <>
            <ExpandCollapseButton />
            <AddTags />
            <LabelChats />
            <PinnedChats withLimits={!paid} />
            <DownloadAction />
            <Questions />
          </>
        )}
        <OrganizeFolders withLimits={!paid} />
        <ExportChat withLimits={!paid} />
        <OrganizedWithTags withLimits={!paid} />
        <Images />
        <Search withLimits={!paid} />
      </div>
    </div>
  );
}
