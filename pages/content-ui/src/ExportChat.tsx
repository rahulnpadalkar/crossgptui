import { Button, Modal, Select, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useEffect, useState } from 'react';
import { getConvoById, getMessagesByConvoId } from './db';
import type { Message } from './db';
import removeMd from 'remove-markdown';

const proLabels = ['JSON', 'Text', 'CSV', 'Markdown'];
const freeLabels = ['JSON', 'Text', '💰 CSV', '💰 Markdown'];

export const ExportChat = ({ withLimits }: { withLimits: boolean }) => {
  const [opened, { open, close }] = useDisclosure(false);

  const [type, setType] = useState<string>('CSV');
  const [convoId, setConvoId] = useState<string>('');

  const exportAsCSV = (messages: Message[]) => {
    const headers = 'Role, Message\n';
    let csvData = headers;
    messages.forEach(({ role, content }) => {
      const escapedContent = escape(content);
      const plainText = removeMd(escapedContent);
      csvData += `${role},${plainText}\n`;
    });
    return csvData;
  };

  const exportAsJSON = (messages: Message[]) => {
    const msgs = messages.map(({ content, role }) => ({ role, message: removeMd(content) }));
    return JSON.stringify(msgs, null, 2);
  };

  const exportAsText = (messages: Message[]) => {
    let data = '';
    messages.forEach(({ role, content }) => {
      data += `\n\n\n${role}: ${removeMd(content)}\n\n\n`;
    });
    return data;
  };

  const exportAsMD = (messages: Message[]) => {
    let data = '';
    messages.forEach(({ role, content }) => {
      data += `#${role}\n${content}\n\n`;
    });
    return data;
  };

  const exportChat = async () => {
    const { title } = await getConvoById(convoId);
    const msgs = await getMessagesByConvoId(convoId);
    let data = null;
    if (type === 'CSV') {
      data = exportAsCSV(msgs);
    } else if (type === 'JSON') {
      data = exportAsJSON(msgs);
    } else if (type === 'Text') {
      data = exportAsText(msgs);
    } else if (type === 'Markdown') {
      data = exportAsMD(msgs);
    } else {
      return;
    }
    if (data) {
      const blob = new Blob([data], {
        type: `${type === 'JSON' ? 'application' : 'text'}/${type === 'Text' ? 'plain' : type.toLowerCase()};charset=utf-8`,
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${title}.${type === 'Text' ? 'txt' : type === 'Markdown' ? 'md' : type.toLowerCase()}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const escape = (value: string) => {
    const str = String(value);
    if (/[",\n]/.test(str)) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  useEffect(() => {
    window.addEventListener('export-chat', e => {
      const { convoId } = e.detail;
      setConvoId(convoId);
    });
  }, [opened]);

  return (
    <>
      <div id="supergpt-export-chat-mdoal" onClick={open}></div>
      <Modal withCloseButton={false} onClose={close} opened={opened}>
        <Modal.Header>
          <Title order={4}>Export Chat</Title>
        </Modal.Header>
        <Modal.Body>
          <Select data={withLimits ? freeLabels : proLabels} value={type} onChange={e => e && setType(e)} />
          <Button variant="light" mt="md" onClick={exportChat}>
            Export
          </Button>
        </Modal.Body>
      </Modal>
    </>
  );
};
