import { ActionIcon, Button, Flex, Image, Loader, Modal, SimpleGrid, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { getAllImages, updateDownloadURLForImage } from '@src/db';
import { differenceInMinutes } from 'date-fns';
import { useEffect, useState } from 'react';
import { IoRefresh } from 'react-icons/io5';

const GPTImage = ({ download_url, id, convoId }: { download_url: string; id: string; convoId: string }) => {
  const downloadImage = async () => {
    const response = await fetch(download_url);
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = id;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    URL.revokeObjectURL(blobUrl);
  };

  const jumpToMessage = () => {
    window.location.href = `https://chatgpt.com/c/${convoId}?mid=${id}`;
  };

  return (
    <Flex style={{ justifyContent: 'center', alignItems: 'center' }} key={id} direction="column">
      <Image radius="md" src={download_url} w={200} height={200} />
      <Flex p="0.5rem">
        <Button variant="light" onClick={downloadImage} mx="0.5rem">
          Download
        </Button>
        <Button variant="light" onClick={jumpToMessage}>
          Open In Chat
        </Button>
      </Flex>
    </Flex>
  );
};

export const Images = () => {
  const [images, setImages] = useState<any[]>([]);
  const [opened, { open, close }] = useDisclosure(false);
  const [loading, setLoading] = useState(true);

  async function loadImages(force: boolean = false) {
    const images = [];
    const imgs = await getAllImages();
    const { authToken } = await chrome.storage.local.get('authToken');
    for (let i = 0; i < imgs.length; i++) {
      const { convoId, fileId, prompt, id, download_url, url_generated_at, size } = imgs[i];
      if (
        !force &&
        download_url &&
        url_generated_at &&
        differenceInMinutes(new Date(), new Date(url_generated_at)) < 360
      ) {
        images.push({ prompt, download_url, id, convoId });
      } else {
        setLoading(true);
        const res = await fetch(
          `https://chatgpt.com/backend-api/conversation/${convoId}/attachment/${fileId}/download`,
          {
            headers: {
              Authorization: authToken,
            },
          },
        );
        const { download_url } = await res.json();
        await updateDownloadURLForImage(id, download_url, convoId, fileId, size, prompt);
        images.push({ prompt, download_url, id, convoId });
      }
    }
    setImages(images);
    setLoading(false);
  }

  useEffect(() => {
    if (opened) {
      loadImages();
    }
  }, [opened]);

  return (
    <>
      <div id="supergpt-media-gallery-modal" onClick={open}></div>
      <Modal opened={opened} onClose={close} withCloseButton={false} size="70rem">
        <Modal.Header>
          <Title order={3} flex="1">
            Media Gallery
          </Title>
          <ActionIcon>
            <IoRefresh
              size={14}
              onClick={() => {
                loadImages(true);
              }}
            />
          </ActionIcon>
        </Modal.Header>
        <Modal.Body>
          <SimpleGrid cols={4}>
            {!loading && images.length > 0
              ? images.map(({ id, download_url, convoId }) => (
                  <GPTImage id={id} download_url={download_url} convoId={convoId} key={id} />
                ))
              : Array(6)
                  .fill(1)
                  .map((_, i) => <Loader type="dots" color="gray" key={i} />)}
          </SimpleGrid>
        </Modal.Body>
      </Modal>
    </>
  );
};
