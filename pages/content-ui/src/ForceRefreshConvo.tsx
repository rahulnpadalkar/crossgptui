import { Flex, Text } from '@mantine/core';
import { useEffect, useState } from 'react';

export const ForceRefreshConvo = ({ convoId, onSyncComplete }: { convoId: string; onSyncComplete: () => void }) => {
  const [sync, setSync] = useState(false);

  const forceRefresh = async () => {
    setSync(true);
    window.dispatchEvent(new CustomEvent('force-fetch-messages', { detail: { convoId } }));
  };

  const syncComplete = () => {
    setSync(false);
    onSyncComplete();
  };

  useEffect(() => {
    window.addEventListener('force-fetch-messages-completed', syncComplete);
    return () => {
      window.removeEventListener('force-fetch-messages-completed', syncComplete);
    };
  }, []);

  return (
    <Flex>
      <Flex style={{ fontSize: '14px', marginTop: '0.75rem' }}>
        Missing chat messages?{' '}
        {sync ? (
          <Text style={{ fontSize: '14px', marginLeft: '0.25rem' }}>🔄 Hold on..Syncing chat</Text>
        ) : (
          <Text
            style={{ cursor: 'pointer', textDecoration: 'underline', fontSize: '14px', marginLeft: '0.25rem' }}
            onClick={forceRefresh}>
            Click here to resync messages.
          </Text>
        )}
      </Flex>
    </Flex>
  );
};
