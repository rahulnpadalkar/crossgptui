import { Button, Flex, Text } from '@mantine/core';

export const UpSell = ({ limitText }: { limitText?: string }) => {
  return (
    <Flex direction="column" style={{ alignItems: 'center' }}>
      <Text>{limitText ? limitText : 'This is a Pro feature. Upgrade to pro to unlock this feature.'}</Text>
      <Button style={{ marginTop: '2rem' }} onClick={() => window.open('https://supergpt.chat/#pricing')}>
        Upgrade To Pro
      </Button>
    </Flex>
  );
};
