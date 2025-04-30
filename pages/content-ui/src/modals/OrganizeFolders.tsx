import { Button, Flex, Modal, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { OrganizedChats } from '@src/OrganizedChats';
import { OrganizeEdit } from '@src/OrganizeEdit';
import { UpSell } from '@src/Upsell';
import { useState } from 'react';
import { FaArrowRightLong } from 'react-icons/fa6';

export const OrganizeFolders = ({ withLimits }: { withLimits: boolean }) => {
  const [opened, { open, close }] = useDisclosure(false);
  const [edit, setEdit] = useState(false);

  return (
    <>
      <div id="supergpt-organize-folders-modal" onClick={open}></div>
      <Modal withCloseButton={false} opened={opened} onClose={close} size="xl" w="30rem">
        <Modal.Header>
          <Title order={4}>Organize Conversations</Title>
        </Modal.Header>
        <Modal.Body>
          {withLimits ? (
            <>
              <UpSell />
            </>
          ) : (
            <Flex direction="column">
              <Flex direction="row-reverse">
                <Button
                  onClick={() => setEdit(!edit)}
                  style={{
                    background: 'transparent',
                    color: 'var(--maintine-button-text)',
                  }}>
                  {edit ? 'Go Back' : 'Create Folders'}
                  <FaArrowRightLong size={18} style={{ marginLeft: '10px' }} />
                </Button>
              </Flex>
              <Flex>{edit ? <OrganizeEdit isOpened={opened} /> : <OrganizedChats isOpened={opened} />}</Flex>
              <Flex></Flex>
            </Flex>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};
