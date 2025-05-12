import { List, Modal, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { getMessagesByConvoId, type Message } from '@src/db';
import { extractChatId } from '@src/utils';
import { useEffect, useState } from 'react';

export const Questions = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const [questions, setQuestions] = useState<Message[]>([]);
  const [sel, setSel] = useState<number>(0);

  const chatID = extractChatId(window.location.href);

  useEffect(() => {
    const openChat = (e: KeyboardEvent) => {
      if (e.key == 'Alt' && opened) {
        close();
        const target = document.querySelector(`div[data-message-id="${questions[sel]?.id}"]`);
        target?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    };

    const decreaseSelection = (e: KeyboardEvent) => {
      if (e.altKey && opened && e.key === 'Shift') {
        if (sel === 0) {
          setSel(questions.length - 1);
        } else {
          setSel(sel - 1);
        }
      }
    };

    window.addEventListener('keyup', openChat);
    window.addEventListener('keydown', decreaseSelection);
    return () => {
      window.removeEventListener('keyup', openChat);
      window.removeEventListener('keydown', decreaseSelection);
    };
  }, [opened, sel]);

  useEffect(() => {
    const getQuestions = async () => {
      if (chatID) {
        const q = await getMessagesByConvoId(chatID);
        setQuestions(q.filter(({ role }) => role === 'user'));
      }
    };
    getQuestions();
  }, [chatID]);

  const openOrMoveSelection = () => {
    if (opened) {
      if (sel > questions.length - 1) {
        setSel(0);
      } else {
        setSel(sel + 1);
      }
    } else {
      open();
    }
  };

  return (
    <>
      <div id="supergpt-questions-list" onClick={openOrMoveSelection} />
      <Modal withCloseButton={false} opened={opened} onClose={close} size="xl">
        <Modal.Header>
          <Title order={4}>Questions</Title>
        </Modal.Header>
        <Modal.Body>
          <List>
            {questions.map(({ content, id }, idx) => (
              <List.Item
                key={id}
                data-id={id}
                ref={idx === sel ? el => el?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }) : null}
                style={{
                  padding: '1rem',
                  border: idx === sel ? '1px solid #ffffff' : '1px solid #575757',
                  borderRadius: '10px',
                  margin: '0.75rem 0rem',
                }}>
                {content.slice(0, 90)}
              </List.Item>
            ))}
          </List>
        </Modal.Body>
      </Modal>
    </>
  );
};
