import { Flex, Title } from '@mantine/core';
import { useEffect, useState } from 'react';
import { extractChatId } from './utils';

export interface PinnedChats {
  messageId: string;
  text: string;
}

export const PinnedChats = ({ withLimits }: { withLimits: boolean }) => {
  const [pChats, setPChats] = useState<PinnedChats[]>([]);
  const updatePins = () => {
    const currentConvoId = extractChatId(window.location.href);
    const chats: PinnedChats[] = [];
    const pinnedChats = JSON.parse(localStorage.getItem('pinnedChats') ?? '{}');
    if (pinnedChats[currentConvoId]) {
      const pinned = pinnedChats[currentConvoId];
      Object.keys(pinned).forEach(k => {
        chats.push({ text: pinned[k]['text'], messageId: pinned[k]['messageId'] });
      });
      setPChats(chats);
    } else {
      setPChats([]);
    }
  };

  useEffect(() => {
    updatePins();
  }, []);

  const jumpToChat = (mId: string) => {
    document.querySelector(`div[data-message-id="${mId}"]`)?.scrollIntoView();
  };

  return (
    <Flex>
      <button id="update-pins" onClick={updatePins}></button>
      <Flex direction="column" mt={10}>
        <Title order={5}>📌 Pinned Chats {withLimits && `(${pChats.length}/2)`}</Title>
        <Flex direction="column">
          {withLimits
            ? pChats.slice(0, 2).map(({ text, messageId }, i) => (
                <Flex
                  className="supergpt-pinned-chat"
                  key={i}
                  style={{ cursor: 'pointer' }}
                  onClick={() => jumpToChat(messageId)}
                  m="0.2rem"
                  fz="14px">
                  {text} .........
                </Flex>
              ))
            : pChats.map(({ text, messageId }, i) => (
                <Flex
                  className="supergpt-pinned-chat"
                  key={i}
                  style={{ cursor: 'pointer' }}
                  onClick={() => jumpToChat(messageId)}
                  m="0.2rem"
                  fz="14px">
                  {text} .........
                </Flex>
              ))}
        </Flex>
      </Flex>
    </Flex>
  );
};
