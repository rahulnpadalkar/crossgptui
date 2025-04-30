import { Flex, Text } from '@mantine/core';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Tree, getBackendOptions } from '@minoru/react-dnd-treeview';
import { TiFolder, TiFolderOpen } from 'react-icons/ti';
import { IoChatbubbleEllipsesOutline } from 'react-icons/io5';
import { useEffect, useState } from 'react';
import type { NodeData } from './OrganizeEdit';

export const OrganizedChats = ({ isOpened }: { isOpened: boolean }) => {
  const [treeData, setTreeData] = useState<NodeData[]>([]);

  useEffect(() => {
    if (isOpened) {
      async function loadTreeData() {
        const { folderData } = await chrome.storage.local.get('folderData');
        const { structure } = JSON.parse(folderData);
        if (structure) {
          setTreeData(JSON.parse(structure));
        }
      }
      loadTreeData();
    }
  }, [isOpened]);

  const onItemClick = ({ convoId, droppable }, onToggle) => {
    if (droppable) {
      onToggle();
    } else {
      window.location.href = `https://chatgpt.com/c/${convoId}`;
    }
  };

  return (
    <>
      <Flex style={{ maxHeight: '30rem', height: '30rem', overflowY: 'auto', overflowX: 'hidden', width: '100%' }}>
        {treeData.length === 0 ? (
          <Text style={{ fontWeight: 'bold', fontSize: '14px' }}>No folders / subfolders created.</Text>
        ) : (
          <DndProvider backend={HTML5Backend} options={getBackendOptions()}>
            <Tree
              tree={treeData}
              rootId={0}
              classes={{
                container: 'supergpt-tree-container',
              }}
              onDrop={() => {}}
              render={(node, { isOpen, onToggle, depth }) => (
                <Flex style={{ alignItems: 'center' }}>
                  <span
                    style={{
                      flex: '1',
                      display: 'flex',
                      flexDirection: 'row',
                      fontSize: '16px',
                      alignItems: 'center',
                      padding: '0.5rem',
                      marginLeft: `${depth * 8}px `,
                      cursor: 'pointer',
                    }}
                    onClick={() => onItemClick(node, onToggle)}>
                    {node.droppable ? (
                      isOpen ? (
                        <TiFolderOpen size={22} style={{ marginRight: '10px' }} />
                      ) : (
                        <TiFolder size={22} style={{ marginRight: '10px' }} />
                      )
                    ) : (
                      <IoChatbubbleEllipsesOutline size={20} style={{ marginRight: '10px' }} />
                    )}
                    {node.text}
                  </span>
                </Flex>
              )}
            />
          </DndProvider>
        )}
      </Flex>
    </>
  );
};
