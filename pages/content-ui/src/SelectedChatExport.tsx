import { Flex, Checkbox, Button, Select, List, Text } from '@mantine/core';
import { useEffect, useState } from 'react';
import { getMessagesByConvoId } from './db';
import type { Message } from './db';
const proLabels = ['JSON', 'Text', 'CSV', 'Markdown'];
const freeLabels = ['JSON', 'Text', '💰 CSV', '💰 Markdown'];
import { FaRobot, FaUser, FaFileExport } from 'react-icons/fa';
import { ForceRefreshConvo } from './ForceRefreshConvo';

export const SelectedChatExport = ({
  withLimits,
  convoId,
  exportChat,
}: {
  withLimits: boolean;
  convoId: string;
  exportChat: (type: string, exportThese: Message[]) => void;
}) => {
  const [type, setType] = useState<string>('Text');
  const [msgs, setMsgs] = useState<Message[]>([]);
  const [selected, setSelected] = useState<Message[]>([]);
  const [refresh, setRefresh] = useState<boolean>(true);

  useEffect(() => {
    if (refresh) {
      const getMessages = async () => {
        const allMessages = await getMessagesByConvoId(convoId);
        setMsgs(allMessages);
        setRefresh(false);
      };
      getMessages();
    }
  }, [convoId, refresh]);

  const toggleSelection = (sId: string, selection: boolean, msg: Message) => {
    if (!selection) {
      const idx = selected.findIndex(({ id }) => id === sId);
      if (idx === -1) return;
      setSelected([...selected.slice(0, idx), ...selected.slice(idx + 1)]);
    } else {
      setSelected([...selected, msg]);
    }
  };

  const toggleExportSelection = e => {
    if (e.currentTarget.checked) {
      setSelected(msgs.filter(({ role }) => role === 'assistant'));
    } else {
      setSelected([]);
    }
  };

  return (
    <Flex style={{ flexDirection: 'column' }}>
      <Flex direction="row" justify="center" mb="md" mt="md">
        <Select data={withLimits ? freeLabels : proLabels} value={type} onChange={e => e && setType(e)} flex="2" />
        <Button
          style={{
            marginLeft: '0.75rem',
            backgroundColor: 'var(--mantine-button-bg)',
            color: 'var(--mantine-button-text-color)',
          }}
          onClick={() => {
            exportChat(type, selected);
          }}
          flex="1">
          <FaFileExport color="black" size="14" style={{ marginRight: '0.5rem' }} /> Export
        </Button>
      </Flex>
      <Flex style={{ flexDirection: 'row-reverse', margin: '0.5rem 0rem' }}>
        <Checkbox label="Export assistant responses only" size="xs" onChange={e => toggleExportSelection(e)} />
      </Flex>
      <Flex flex="4" style={{ padding: '0rem 0.5rem', maxHeight: '25rem', height: '25rem', overflowY: 'auto' }}>
        <List>
          {msgs.map(msg => (
            <Flex style={{ flexDirection: 'row', margin: '0.5rem 0rem', alignItems: 'center' }} key={msg.id}>
              <Checkbox
                checked={selected.findIndex(({ id }) => id === msg.id) === -1 ? false : true}
                onChange={e => toggleSelection(msg.id, e.currentTarget.checked, msg)}
                size="xs"
                style={{ marginRight: '1rem' }}
              />
              {msg.role === 'user' ? (
                <FaUser size="15" style={{ marginRight: '0.5rem' }} />
              ) : (
                <FaRobot size="18" style={{ marginRight: '0.5rem' }} />
              )}
              <List.Item>
                <Text style={{ fontSize: '14px' }}>{msg.content.slice(0, 80)}</Text>
              </List.Item>
            </Flex>
          ))}
        </List>
      </Flex>
      <ForceRefreshConvo convoId={convoId} onSyncComplete={() => setRefresh(true)} />
    </Flex>
  );
};
