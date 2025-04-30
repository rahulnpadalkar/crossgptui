import { Button, Flex, Modal, Pill, Table, Title, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useEffect, useState } from 'react';
import { getConvoById } from './db';
import { difference } from 'lodash';
import { format } from 'date-fns';
import { UpSell } from './Upsell';

export interface Convo {
  title: string;
  lastUpdated: string;
  id: string;
}

export const OrganizedWithTags = ({ withLimits }: { withLimits: boolean }) => {
  const [opened, { open, close }] = useDisclosure(false);
  const [tagsToIds, setTagsToIds] = useState<Record<string, string[]>>({});
  const [allTags, setAlltags] = useState<string[]>([]);
  const [rows, setRows] = useState<Convo[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  useEffect(() => {
    const sTags = localStorage.getItem('allTags');
    if (sTags) {
      setAlltags(sTags.split(','));
    }
    const allConvoTags = JSON.parse(localStorage.getItem('allConvoTags') ?? '{}');
    const tagsToConvoIds: Record<string, string[]> = {};
    Object.keys(allConvoTags).forEach(key => {
      const tagsForConvo = allConvoTags[key].split(',');
      tagsForConvo.forEach((t: string) => {
        if (tagsToConvoIds[t]) {
          tagsToConvoIds[t].push(key);
        } else {
          tagsToConvoIds[t] = [key];
        }
      });
    });
    setTagsToIds(tagsToConvoIds);
  }, [opened]);

  const toggleSelection = async (n: string) => {
    let chats: Convo[] = [];
    if (selectedTags.includes(n)) {
      const newTags = selectedTags.filter(t => t !== n);
      let selectedConvos: string[] = [];
      newTags.forEach(t => {
        selectedConvos = selectedConvos.concat(tagsToIds[t]);
      });
      const removed = difference(tagsToIds[n], selectedConvos);
      chats = rows.filter(({ id }) => !removed.includes(id));
      setRows(chats);
      setSelectedTags(newTags);
    } else {
      setSelectedTags([...selectedTags, n]);
      for (let i = 0; i < tagsToIds[n].length; i++) {
        const convoId = tagsToIds[n][i];
        if (rows.findIndex(({ id }) => id === convoId) === -1) {
          const data = await getConvoById(convoId);
          if (data) {
            chats.push({ title: data?.title, lastUpdated: data?.updated_at, id: convoId });
          }
        }
      }
      setRows([...rows, ...chats]);
    }
  };

  return (
    <>
      <Flex>
        <div onClick={open} id="open-category-chat"></div>
      </Flex>
      <Modal opened={opened} onClose={close} size="xl" withCloseButton={false}>
        <Modal.Header>
          <Title order={3}>Manage Chat</Title>
        </Modal.Header>
        <Modal.Body>
          {withLimits ? (
            <>
              <UpSell />
            </>
          ) : (
            <>
              <Flex
                direction="row"
                style={{
                  width: '100%',
                  maxWidth: '100%',
                  flexWrap: 'wrap',
                  display: 'flex',
                  height: '3rem',
                  maxHeight: '3rem',
                  overflowY: 'auto',
                }}>
                {allTags.length == 0 ? (
                  <Text
                    style={{
                      fontWeight: 'bold',
                      fontSize: '14px',
                      flex: '1',
                      alignContent: 'center',
                      justifyContent: 'center',
                    }}>
                    No tags created yet.
                  </Text>
                ) : (
                  allTags.map((t, i) => (
                    <Pill
                      mx={5}
                      my={5}
                      key={i}
                      onClick={() => toggleSelection(t)}
                      style={{
                        backgroundColor: selectedTags.includes(t)
                          ? '#03a9f4'
                          : 'var(--mantine-button-background-color)',
                        color: selectedTags.includes(t) ? 'var(--mantine-text-selected)' : 'var(--mantine-text-color)',
                        cursor: 'pointer',
                      }}>
                      {t}
                    </Pill>
                  ))
                )}
              </Flex>
              <Flex direction="column" mt="sm">
                <Table>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Td>Chat Title</Table.Td>
                      <Table.Td>Last Updated</Table.Td>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {rows.length > 0 &&
                      rows.map(({ title, lastUpdated, id }, i) => (
                        <Table.Tr key={i}>
                          <Table.Td>{title}</Table.Td>
                          <Table.Td>{format(new Date(lastUpdated), 'PPpp')}</Table.Td>
                          <Table.Td>
                            <Button
                              onClick={() => (window.location.href = `https://chatgpt.com/c/${id}`)}
                              variant="light">
                              Open Chat
                            </Button>
                          </Table.Td>
                        </Table.Tr>
                      ))}
                  </Table.Tbody>
                </Table>
              </Flex>
            </>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};
