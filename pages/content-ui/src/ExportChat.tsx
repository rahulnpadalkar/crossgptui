import { Modal, Title, Tabs } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useEffect, useState } from 'react';
import { getConvoById, getMessagesByConvoId } from './db';
import type { Message } from './db';
import removeMd from 'remove-markdown';
import { ExportFullChat } from './ExportFullChat';
import { SelectedChatExport } from './SelectedChatExport';
import { pdf } from '@react-pdf/renderer';
import { MarkdownPdf } from './pdfFormat';

export interface ExportChatType {
  role: string;
  id: string;
  content: string;
}

export const ExportChat = ({ withLimits }: { withLimits: boolean }) => {
  const [opened, { open, close }] = useDisclosure(false);

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

  const exportAsPDF = async (messages: Message[]) => {
    let markdown = '';
    messages.forEach(({ content, role }) => (markdown += `###${role}\n${content}`));
    const blob = await pdf(<MarkdownPdf markdown={markdown} />).toBlob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'jsx-output.pdf';
    a.click();
    URL.revokeObjectURL(url);
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

  const exportChat = async (onlyAnswers: boolean, type: string) => {
    const { title } = await getConvoById(convoId);
    let msgs = await getMessagesByConvoId(convoId);
    if (onlyAnswers) {
      msgs = msgs.filter(({ role }) => role !== 'user');
    }
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

  const exportPartialChat = async (type: string, msgs: Message[]) => {
    const { title } = await getConvoById(convoId);
    let data = null;
    if (type === 'CSV') {
      data = exportAsCSV(msgs);
    } else if (type === 'JSON') {
      data = exportAsJSON(msgs);
    } else if (type === 'Text') {
      data = exportAsText(msgs);
    } else if (type === 'Markdown') {
      data = exportAsMD(msgs);
    } else if (type === 'PDF') {
      data = await exportAsPDF(msgs);
    } else {
      return;
    }
    if (data) {
      let blob = data;
      if (type !== 'PDF') {
        blob = new Blob([data], {
          type: `${type === 'JSON' ? 'application' : 'text'}/${type === 'Text' ? 'plain' : type.toLowerCase()};charset=utf-8`,
        });
      }
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

  return (
    <>
      <div id="supergpt-export-chat-mdoal" onClick={open}></div>
      <Modal withCloseButton={false} onClose={close} opened={opened} size="xl">
        <Modal.Header>
          <Title order={4}>Export Chat</Title>
        </Modal.Header>
        <Modal.Body>
          <Tabs variant="outline" radius="lg" defaultValue="full">
            <Tabs.List>
              <Tabs.Tab value="full">Export Full Chat</Tabs.Tab>
              <Tabs.Tab value="partial">Selected Chat Export</Tabs.Tab>
            </Tabs.List>
            <Tabs.Panel value="full">
              <ExportFullChat exportChat={exportChat} withLimits={withLimits} />
            </Tabs.Panel>
            <Tabs.Panel value="partial">
              <SelectedChatExport exportChat={exportPartialChat} withLimits={withLimits} convoId={convoId} />
            </Tabs.Panel>
          </Tabs>
        </Modal.Body>
      </Modal>
    </>
  );
};
