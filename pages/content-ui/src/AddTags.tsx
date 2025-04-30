import { Autocomplete, Button, Flex, Modal, Pill, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useEffect, useState } from 'react';
import { IoIosAddCircle } from 'react-icons/io';
import { extractChatId } from './utils';

export const AddTags = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const [tags, setTags] = useState<string[]>([]);
  const [val, setVal] = useState<string>('');
  const [allTags, setAllTags] = useState<string[]>([]);
  const convoTags = JSON.parse(localStorage.getItem('allConvoTags') ?? '{}');
  const currentConvoId = extractChatId(window.location.href);
  useEffect(() => {
    if (opened) {
      const tags = localStorage.getItem('allTags')?.split(',');
      if (convoTags[currentConvoId]) {
        setTags(convoTags[currentConvoId].split(','));
      }
      setAllTags(tags ?? []);
    }
  }, [opened]);

  return (
    <Flex my={10} direction="column">
      <Button
        onClick={open}
        style={{
          borderRadius: '10px',
          backgroundColor: 'var(--mantine-button-background-color)',
          border: 'none',
          color: 'var(--mantine-color-text)',
        }}>
        <IoIosAddCircle />
        Add Tags
      </Button>
      <Modal opened={opened} onClose={close} withCloseButton={false} bg="#141414">
        <Flex direction="column">
          <Title order={4}>Add Tags</Title>
          <div style={{ fontWeight: 'lighter' }}>Tags help grouping conversations easily.</div>
        </Flex>
        <Flex direction="column" mt={24}>
          <Autocomplete
            placeholder="Search or add a new tag"
            value={val}
            data={allTags}
            limit={5}
            defaultDropdownOpened={false}
            onOptionSubmit={e => {
              setTags([...tags, e]);
              setVal('');
            }}
            onChange={e => setVal(e)}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                setTags([...tags, val]);
                setVal('');
              }
            }}
          />
          <Flex direction="row" maw="100%" mt="md">
            {tags.length > 0 &&
              tags.map((t, i) => (
                <Pill
                  key={i}
                  mx={3}
                  withRemoveButton
                  onRemove={() => {
                    setTags([...tags.slice(0, i), ...tags.slice(i + 1)]);
                  }}>
                  {t}
                </Pill>
              ))}
          </Flex>
          <Button
            mt={24}
            onClick={() => {
              const uniqueTags = [...new Set([...allTags, ...tags])];
              localStorage.setItem('allTags', uniqueTags.join(','));
              convoTags[currentConvoId] = tags.join(',');
              localStorage.setItem('allConvoTags', JSON.stringify(convoTags));
              setVal('');
              setTags([]);
              close();
            }}>
            Add Tags
          </Button>
        </Flex>
      </Modal>
    </Flex>
  );
};
