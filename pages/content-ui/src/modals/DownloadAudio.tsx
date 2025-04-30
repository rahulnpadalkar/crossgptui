import { Button, Loader, Modal, Select, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { extractChatId } from '@src/utils';
import { useState } from 'react';

const DOWNLOAD_AUDIO = 'https://chatgpt.com/backend-api/synthesize';

export const DownloadAction = () => {
  const [opened, { open, close }] = useDisclosure(false);

  const [voice, setVoice] = useState<string>('Ember');
  const [loading, setLoading] = useState<boolean>(false);

  const downloadAudio = async () => {
    const { authToken } = await chrome.storage.local.get('authToken');
    const { audioMId } = await chrome.storage.local.get('audioMId');
    setLoading(true);
    const convoId = extractChatId(window.location.href);
    try {
      const res = await fetch(
        `${DOWNLOAD_AUDIO}?message_id=${audioMId}&conversation_id=${convoId}&voice=${voice.toLowerCase()}&format=mp3`,
        {
          headers: {
            Authorization: authToken,
          },
        },
      );
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = audioMId;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div id="supergpt-download-audio-modal" onClick={open}></div>
      <Modal size="md" opened={opened} onClose={close} withCloseButton={false}>
        <Modal.Header>
          <Title order={4}>Download Audio</Title>
        </Modal.Header>
        <Modal.Body>
          <Select
            label="Select voice"
            placeholder="Select something awesome.."
            value={voice}
            data={['Ember', 'Cove', 'Breeze', 'Maple', 'Vale', 'Juniper', 'Fathom', 'Orbit', 'Shade']}
            onChange={value => {
              setVoice(value ?? 'Ember');
            }}
          />
          {loading ? (
            <Loader type="dots" color="gray" />
          ) : (
            <Button variant="light" mt={10} onClick={downloadAudio}>
              Download Audio
            </Button>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};
