import { Button, Modal, Title, Flex, List, Text, Input, Popover, ColorPicker, Pill } from '@mantine/core';
import { FaHighlighter } from 'react-icons/fa6';
import { useDisclosure } from '@mantine/hooks';
import { useEffect, useState } from 'react';
import { getMessagesByConvoId, type Message } from '@src/db';
import { extractChatId } from '@src/utils';
import { IoChatbubbleEllipsesOutline } from 'react-icons/io5';

interface ColoredLabels {
  [key: string]: {
    name: string;
    color: string;
  };
}

interface Labels {
  name: string;
  color: string;
}

export const LabelChats = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const [msgs, setMsgs] = useState<Message[]>([]);
  const [annotations, setAnnotations] = useState<Labels[]>([]);
  const [currAnnotation, setCurrAnnotation] = useState<string>('');
  const [currAnnotationColor, setCurrAnnotationColor] = useState<string>('');
  const [newAnnotation, setNewAnnotation] = useState<string>('');
  const [newColor, setNewColor] = useState<string>('#000000');

  const [selectedAnn, setSelectedAnn] = useState<string>();

  const [taggedMsgs, setTaggedMsgs] = useState<ColoredLabels>({});
  const [choosenTags, setChoosenTags] = useState<Labels[]>([]);

  useEffect(() => {
    const allMessages = async () => {
      const convoId = extractChatId(window.location.href);
      if (convoId) {
        let msgs = await getMessagesByConvoId(convoId);
        msgs = msgs.filter(({ role }) => role === 'user');
        setMsgs(msgs);
      }
    };
    const getAllAnnotations = () => {
      const annotations = JSON.parse(localStorage.getItem('annotations') ?? 'null');
      if (annotations) {
        setAnnotations(annotations);
      }
    };

    const markAnnotations = () => {
      const markAnno = JSON.parse(localStorage.getItem('allAnnotations') ?? 'null');
      const chatId = extractChatId(window.location.href);
      if (markAnno && markAnno[chatId]) {
        const tags: Labels[] = [];
        setTaggedMsgs(markAnno[chatId]);
        Object.keys(markAnno[chatId]).forEach(k => {
          const a = markAnno[chatId][k];
          if (tags.findIndex(({ name }) => name === a.name) === -1) {
            tags.push(a);
          }
        });
        setChoosenTags(tags);
      } else {
        setTaggedMsgs({});
        setChoosenTags([]);
      }
      setSelectedAnn('');
    };
    window.addEventListener('update-annotations', markAnnotations);
    allMessages();
    getAllAnnotations();
    markAnnotations();
    return () => {
      window.removeEventListener('update-annotations', markAnnotations);
    };
  }, [opened]);

  const updateAnnotations = (id: string) => {
    setTaggedMsgs(prev => {
      const newTagged = { ...prev };
      if (newTagged[id] && newTagged[id].name === currAnnotation) {
        delete newTagged[id];
      } else {
        newTagged[id] = { name: currAnnotation, color: currAnnotationColor };
      }
      return newTagged;
    });
  };

  const addNewAnnotation = () => {
    setAnnotations([...annotations, { name: newAnnotation, color: newColor }]);
    localStorage.setItem('annotations', JSON.stringify([...annotations, { name: newAnnotation, color: newColor }]));
  };

  const saveAnnotations = () => {
    const anno = JSON.parse(localStorage.getItem('allAnnotations') ?? 'null');
    const chatId = extractChatId(window.location.href);
    if (anno) {
      anno[chatId] = taggedMsgs;
      localStorage.setItem('allAnnotations', JSON.stringify(anno));
    } else {
      localStorage.setItem('allAnnotations', JSON.stringify({ [chatId]: taggedMsgs }));
    }
    close();
  };

  const filterByAnnotations = (name: string) => {
    setSelectedAnn(name);
    const allChats = document.querySelectorAll('div.group\\/conversation-turn');
    const ids = Object.keys(taggedMsgs).filter(chatId => taggedMsgs[chatId].name === name);
    let hideNext = true;
    for (let i = 0; i < allChats.length; i++) {
      const c = allChats[i] as HTMLElement;
      const d = c.querySelector('div[data-message-id]');
      if (d) {
        const mId = d.getAttribute('data-message-id');
        if (mId && ids.includes(mId)) {
          hideNext = false;
          continue;
        }
        if (hideNext) {
          const a = c.closest('article');
          if (a) {
            a.style.display = 'none';
            hideNext = true;
          }
        }
        hideNext = true;
      }
    }
  };

  const clickOnAnn = (name: string) => {
    if (name === selectedAnn) {
      setSelectedAnn('');
      const allChats = document.querySelectorAll('div.group\\/conversation-turn');
      allChats.forEach(c => {
        const a = c.closest('article');
        if (a) {
          a.style.display = 'block';
        }
      });
    } else {
      filterByAnnotations(name);
    }
  };

  return (
    <>
      <Button
        onClick={open}
        variant="default"
        style={{ borderRadius: '10px', backgroundColor: 'var(--mantine-button-background-color)', border: 'none' }}>
        <FaHighlighter size="10" style={{ marginRight: '0.2rem' }} />
        Label Chats
      </Button>
      <Flex direction="column" style={{ marginTop: '0.5rem' }}>
        <Text style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>Created Labels</Text>
        <Flex>
          {choosenTags.map(({ name, color }) => (
            <Pill
              bg={color}
              key={name}
              style={{
                margin: '0 0.25rem',
                cursor: 'pointer',
                border: selectedAnn === name ? '2px solid white' : 'none',
              }}
              onClick={() => clickOnAnn(name)}>
              {name}
            </Pill>
          ))}
        </Flex>
      </Flex>
      <Modal opened={opened} onClose={close} withCloseButton={false} size="xl">
        <Modal.Header>
          <Title order={4}>Label Chats</Title>
        </Modal.Header>
        <Modal.Body>
          <Flex direction="column">
            <Flex direction="row">
              <Flex
                direction="column"
                flex="1"
                style={{ height: '30rem', maxHeight: '30rem', overflowY: 'auto', overflowX: 'hidden' }}>
                <List>
                  {msgs.map(({ content, id }) => (
                    <Flex
                      key={id}
                      onClick={() => updateAnnotations(id)}
                      align="center"
                      style={{
                        borderBottom: '1px solid #3e3e3e',
                        padding: '0.8rem',
                        cursor: 'pointer',
                        backgroundColor: taggedMsgs[id] ? taggedMsgs[id].color : 'transparent',
                      }}>
                      <IoChatbubbleEllipsesOutline size="16" style={{ marginRight: '0.5rem' }} />
                      <List.Item style={{ fontSize: '14px' }}>{content.slice(0, 40)}</List.Item>
                    </Flex>
                  ))}
                </List>
              </Flex>
              <Flex flex="1" direction="column">
                <Text size="lg" style={{ fontWeight: 'bold', marginLeft: '1rem' }}>
                  Annotations
                </Text>
                <Flex direction="column" style={{ padding: '0rem 0.5rem', marginTop: '0.5rem' }}>
                  <Flex>
                    <Input
                      placeholder="Name"
                      value={newAnnotation}
                      onChange={e => setNewAnnotation(e.currentTarget.value)}
                    />
                    <Button
                      onClick={addNewAnnotation}
                      style={{
                        background: 'var(--mantine-button-modal-bg-color)',
                        color: 'var(--mantine-button-modal-color)',
                        margin: '0 0.5rem',
                      }}>
                      Add
                    </Button>
                    <Popover width={300} position="bottom" withArrow>
                      <Popover.Target>
                        <Text
                          style={{
                            backgroundColor: newColor,
                            borderRadius: '10px',
                            fontSize: '12px',
                            padding: '0.2rem',
                            cursor: 'pointer',
                          }}>
                          {newColor}
                        </Text>
                      </Popover.Target>
                      <Popover.Dropdown>
                        <ColorPicker
                          onChange={setNewColor}
                          value={newColor}
                          format="hex"
                          swatches={[
                            '#2e2e2e',
                            '#868e96',
                            '#fa5252',
                            '#e64980',
                            '#be4bdb',
                            '#7950f2',
                            '#4c6ef5',
                            '#228be6',
                            '#15aabf',
                            '#12b886',
                            '#40c057',
                            '#82c91e',
                            '#fab005',
                            '#fd7e14',
                          ]}
                        />
                      </Popover.Dropdown>
                    </Popover>
                  </Flex>
                  <Flex mt="md">
                    {annotations.map(({ color, name }, i) => (
                      <Pill
                        key={i}
                        size="md"
                        style={{ cursor: 'pointer', margin: '0.5rem' }}
                        bg={color}
                        onClick={() => {
                          setCurrAnnotation(name);
                          setCurrAnnotationColor(color);
                        }}>
                        {name}
                      </Pill>
                    ))}
                  </Flex>
                </Flex>
              </Flex>
            </Flex>
            <Button
              onClick={saveAnnotations}
              variant="default"
              style={{
                marginTop: '0.5rem',
                borderRadius: '10px',
                backgroundColor: 'var(--mantine-button-background-color)',
                border: 'none',
              }}>
              Save
            </Button>
          </Flex>
        </Modal.Body>
      </Modal>
    </>
  );
};
