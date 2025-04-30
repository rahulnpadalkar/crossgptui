import { Flex, List, Button, Modal, Title, TextInput } from '@mantine/core';
import { useEffect, useState } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { FaSearch } from 'react-icons/fa';

export interface Questions {
  title: string;
  messageId: string;
}

let pristineResults: Questions[] = [];

export const QuestionsList = () => {
  const [questions, setQuestions] = useState<Questions[]>([]);
  const [opened, { open, close }] = useDisclosure(false);

  useEffect(() => {
    setTimeout(() => {
      const q: Questions[] = [];
      const questions = document.querySelectorAll('div[data-message-author-role="user"]');
      questions.forEach(ques => {
        q.push({ title: ques.textContent!, messageId: ques.getAttribute('data-message-id')! });
      });
      pristineResults = q;
      setQuestions(q);
    }, 3000);
  }, [opened]);

  const jumpToQuestion = (msgId: string) => {
    document.querySelector(`div[data-message-id="${msgId}"]`)?.scrollIntoView();
    close();
  };

  const filterResults = (phrase: string) => {
    if (phrase) {
      setQuestions(questions.filter(({ title }) => title.includes(phrase)));
    } else {
      setQuestions(pristineResults);
    }
  };

  return (
    <>
      <Button
        onClick={open}
        style={{
          backgroundColor: 'var(--mantine-button-background-color)',
          color: 'var(--mantine-text-color)',
          borderRadius: '10px',
        }}>
        Jump To Question
      </Button>
      <Modal opened={opened} onClose={close} size="xl" withCloseButton={false}>
        <Modal.Header>
          <Title order={4}>Questions List</Title>
        </Modal.Header>
        <Modal.Body>
          <Flex direction="column">
            <TextInput
              placeholder="Search.."
              rightSection={<FaSearch size="12" color="gray" />}
              onChange={e => filterResults(e.currentTarget.value)}
            />
            <List
              style={{ maxHeight: '30rem', height: '30rem', overflow: 'scroll' }}
              styles={{
                itemLabel: { whiteSpace: 'nowrap', overflow: 'hidden', width: '100%', textOverflow: 'ellipsis' },
                itemWrapper: { width: '100%' },
              }}>
              {questions.map(({ title, messageId }) => (
                <List.Item
                  key={messageId}
                  onClick={() => jumpToQuestion(messageId)}
                  style={{ margin: '1rem 0', cursor: 'pointer' }}
                  className="question">
                  {title}
                </List.Item>
              ))}
            </List>
          </Flex>
        </Modal.Body>
      </Modal>
    </>
  );
};
