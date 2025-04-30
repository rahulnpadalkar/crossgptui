import { Flex, Button } from '@mantine/core';

export const PinConversation = () => {
  return (
    <Flex>
      <Button
        style={{
          borderRadius: '10px',
          backgroundColor: 'var(--mantine-button-background-color)',
          border: 'none',
          color: 'var(--mantine-color-text)',
        }}>
        📌 Pin This Conversation
      </Button>
    </Flex>
  );
};
