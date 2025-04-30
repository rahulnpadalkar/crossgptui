import { Button, Flex, Input, List } from '@mantine/core';
import { useEffect, useState } from 'react';
import { getAllConversation } from './db';
import type { Conversation } from './db';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Tree, getBackendOptions } from '@minoru/react-dnd-treeview';
import { TiFolder, TiFolderOpen } from 'react-icons/ti';
import { IoChatbubbleEllipsesOutline } from 'react-icons/io5';
import { ImCancelCircle } from 'react-icons/im';

export interface NodeData {
  id: number;
  parent: number;
  droppable: boolean;
  text: string;
}

export const OrganizeEdit = ({ isOpened }: { isOpened: boolean }) => {
  const [treeData, setTreeData] = useState<NodeData[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [idx, setIdx] = useState<number>(0);
  const [folder, setFolder] = useState<string>('');
  const [fConvos, setFConvos] = useState<Conversation[]>([]);

  useEffect(() => {
    if (isOpened) {
      async function updateData() {
        const convos = await getAllConversation();
        setConversations(convos);
        setFConvos(convos);
        const { folderData } = await chrome.storage.local.get('folderData');
        const data = JSON.parse(folderData);
        setIdx(data.startIdx);
        if (data && data.structure) {
          setTreeData(JSON.parse(data.structure));
        } else {
          setTreeData([{ id: 1, parent: 0, droppable: true, text: 'Uncategorized' }]);
        }
      }
      updateData();
    }
  }, [isOpened]);

  const addFolder = async () => {
    const newTreeData = [...treeData, { id: idx + 1, parent: 0, droppable: true, text: folder }];
    setTreeData(newTreeData);
    setIdx(idx + 1);
    await chrome.storage.local.set({
      folderData: JSON.stringify({ startIdx: idx + 1, structure: JSON.stringify(newTreeData) }),
    });
  };

  const handleDrop = async (newTreeData: NodeData[]) => {
    setTreeData(newTreeData);
    await chrome.storage.local.set({
      folderData: JSON.stringify({ startIdx: idx, structure: JSON.stringify(newTreeData) }),
    });
  };

  const removeFromTree = async (node: NodeData) => {
    const { id: removeId } = node;
    const newTreeData = treeData.filter(({ id, parent }) => ![id, parent].includes(removeId));
    setTreeData(newTreeData);
    await chrome.storage.local.set({
      folderData: JSON.stringify({ startIdx: idx, structure: JSON.stringify(newTreeData) }),
    });
  };

  return (
    <Flex direction="column" w="100%">
      <Flex style={{ maxHeight: '30rem' }}>
        <Flex style={{ flexDirection: 'column' }} flex="1">
          <Flex style={{ marginBottom: '0.5rem' }}>
            <Input
              w="100%"
              placeholder="Search conversation"
              onChange={e => {
                if (e.currentTarget.value.trim()) {
                  setFConvos(conversations.filter(({ title }) => title.includes(e.currentTarget.value)));
                } else {
                  setFConvos(conversations);
                }
              }}
            />
          </Flex>
          <List style={{ overflowX: 'hidden', overflowY: 'auto', flexDirection: 'column', flex: '1' }}>
            {fConvos.map(({ title, id }, i) => (
              <List.Item
                key={i}
                style={{
                  padding: '0.75rem',
                  cursor: 'pointer',
                  fontSize: '15px',
                  borderBottom: '1px solid #3e3e3e',
                }}
                onClick={async () => {
                  const newTreeData = [
                    ...treeData,
                    { id: idx + 1, parent: 1, droppable: false, text: title, convoId: id },
                  ];
                  await chrome.storage.local.set({
                    folderData: JSON.stringify({ startIdx: idx + 1, structure: JSON.stringify(newTreeData) }),
                  });
                  setTreeData(newTreeData);
                  setIdx(idx + 1);
                }}>
                <span style={{ display: 'flex', alignItems: 'center' }}>
                  <IoChatbubbleEllipsesOutline size={18} style={{ marginRight: '10px' }} />
                  {title}
                </span>
              </List.Item>
            ))}
          </List>
        </Flex>
        <Flex flex="1" style={{ flexDirection: 'column', padding: '0rem 1rem' }}>
          <Flex>
            <Input placeholder="Folder Name.." flex="1" onChange={e => setFolder(e.currentTarget.value)} />
            <Button
              onClick={addFolder}
              style={{
                background: 'var(--mantine-button-modal-bg-color)',
                color: 'var(--mantine-button-modal-color)',
                marginLeft: '1rem',
                marginBottom: '1rem',
              }}>
              + Add Folder
            </Button>
          </Flex>
          <Flex style={{ width: '100%', height: '100%', maxHeight: '30rem', overflowY: 'auto', overflowX: 'hidden' }}>
            <DndProvider backend={HTML5Backend} options={getBackendOptions()}>
              <Tree
                tree={treeData}
                rootId={0}
                classes={{
                  container: 'supergpt-tree-container',
                }}
                onDrop={handleDrop}
                render={(node, { isOpen, onToggle, depth }) => (
                  <Flex style={{ alignItems: 'center' }}>
                    <span
                      style={{
                        flex: '1',
                        display: 'flex',
                        flexDirection: 'row',
                        fontSize: '15px',
                        alignItems: 'center',
                        padding: '0.5rem',
                        marginLeft: `${depth * 5}px `,
                      }}
                      onClick={onToggle}>
                      {node.droppable ? (
                        isOpen ? (
                          <TiFolderOpen size={18} style={{ marginRight: '10px' }} />
                        ) : (
                          <TiFolder size={18} style={{ marginRight: '10px' }} />
                        )
                      ) : (
                        <IoChatbubbleEllipsesOutline size={18} style={{ marginRight: '10px' }} />
                      )}
                      {node.text}
                    </span>
                    {node.text !== 'Uncategorized' && (
                      <ImCancelCircle
                        size={14}
                        onClick={() => removeFromTree(node as NodeData)}
                        style={{ cursor: 'pointer' }}
                      />
                    )}
                  </Flex>
                )}
              />
            </DndProvider>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};
