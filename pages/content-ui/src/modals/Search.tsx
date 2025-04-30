import { Input, Modal, Title, Flex, Highlight, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { getMessagessByPhrase } from '@src/db';
import type { Message } from '@src/db';
import { UpSell } from '@src/Upsell';
import { useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';

const AROUND_LENGTH = 50;

const SearchItem = ({
  text,
  phrase,
  title,
  msgId,
  convoId,
}: {
  text: string;
  phrase: string;
  title: string;
  msgId: string;
  convoId: string;
}) => {
  const [t, setT] = useState(text);
  useEffect(() => {
    const i = text.indexOf(phrase);
    const start = Math.max(0, i - AROUND_LENGTH);
    const end = Math.min(text.length, i + phrase.length + AROUND_LENGTH);
    setT('...' + text.slice(start, end) + '...');
  }, []);

  const openMessage = () => {
    localStorage.setItem('highlightDetails', JSON.stringify({ msgId, word: phrase }));
    window.location.href = `https://chatgpt.com/c/${convoId}?mid=${msgId}`;
  };

  return (
    <Flex
      style={{ margin: '0.5rem 0.25rem', borderRadius: '10px', cursor: 'pointer' }}
      direction="column"
      className="supergpt-search-result"
      p="sm"
      onClick={openMessage}>
      <Text color="var(--mantine-title-muted)">{title}</Text>
      <Highlight highlight={phrase} c="var(--mantine-subtext-muted)" style={{ fontSize: '14px' }}>
        {t}
      </Highlight>
    </Flex>
  );
};

export const Search = ({ withLimits }: { withLimits: boolean }) => {
  const [opened, { open, close }] = useDisclosure(false);
  const [searchRes, setSearchRes] = useState<Message[]>([]);
  const [phrase, setPhrase] = useState<string>('');

  useEffect(() => {
    setSearchRes([]);
  }, [opened]);

  const search = async (phrase: string) => {
    if (phrase.length < 3) {
      setSearchRes([]);
    } else {
      const res = await getMessagessByPhrase(phrase);
      setSearchRes(res);
    }
  };

  return (
    <>
      <div id="supergpt-search-modal" onClick={open}></div>
      <Modal opened={opened} onClose={close} withCloseButton={false} size="xl">
        <Modal.Header>
          <Title order={3}>Search</Title>
        </Modal.Header>
        <Modal.Body>
          <Flex direction="column">
            <Flex direction="column">
              <Input
                rightSection={<FaSearch size="12" color="gray" />}
                onChange={e => {
                  setPhrase(e.currentTarget.value);
                }}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    setSearchRes([]);
                    search(phrase);
                  }
                }}
              />
              <Flex>
                <Text color="var(--mantine-subtext-muted)" style={{ fontSize: '14px' }} flex="2">
                  Please enter minimum 3 characters and press enter to search.
                </Text>
                <Text color="var(--mantine-subtext-muted)" style={{ fontSize: '14px', textAlign: 'end' }} flex="1">
                  {searchRes.length} Results
                </Text>
              </Flex>
            </Flex>
            <Flex direction="column" mah="25rem" h="25rem" style={{ overflowY: 'auto', overflowX: 'hidden' }} py="lg">
              {searchRes.length > 0 && withLimits
                ? searchRes
                    .slice(0, 10)
                    .map(({ content, convoTitle, id, convoId }, i) => (
                      <SearchItem
                        text={content}
                        key={i}
                        phrase={phrase}
                        title={convoTitle}
                        msgId={id}
                        convoId={convoId}
                      />
                    ))
                : searchRes.map(({ content, convoTitle, id, convoId }, i) => (
                    <SearchItem
                      text={content}
                      key={i}
                      phrase={phrase}
                      title={convoTitle}
                      msgId={id}
                      convoId={convoId}
                    />
                  ))}
              {searchRes.length > 0 && withLimits && (
                <>
                  <UpSell limitText="Upgrade to Pro version to look at all results." />
                </>
              )}
            </Flex>
          </Flex>
        </Modal.Body>
      </Modal>
    </>
  );
};
