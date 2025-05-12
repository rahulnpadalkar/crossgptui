import { Button, Select, Flex, Checkbox } from '@mantine/core';
import { useState } from 'react';
import { FaFileExport } from 'react-icons/fa';

const proLabels = ['JSON', 'Text', 'CSV', 'Markdown'];
const freeLabels = ['JSON', 'Text', '💰 CSV', '💰 Markdown'];

export const ExportFullChat = ({
  withLimits,
  exportChat,
}: {
  withLimits: boolean;
  exportChat: (onlyAnswers: boolean, type: string) => void;
}) => {
  const [type, setType] = useState<string>('Text');
  const [onlyAnswers, setOnlyAnswers] = useState(false);

  return (
    <Flex mb="md" mt="md" direction="column">
      <Flex direction="row" justify="center">
        <Select
          data={withLimits ? freeLabels : proLabels}
          value={type}
          onChange={e => e && setType(e)}
          style={{ flex: 3 }}
        />
        <Flex flex="1" style={{ marginLeft: '0.75rem' }}>
          <Button
            style={{ backgroundColor: 'var(--mantine-button-bg)', color: 'var(--mantine-button-text-color)' }}
            onClick={() => {
              exportChat(onlyAnswers, type);
            }}
            flex="1">
            <FaFileExport size="14" color="var(--mantine-icon-color)" style={{ marginRight: '0.5rem' }} />
            Export
          </Button>
        </Flex>
      </Flex>
      <Flex style={{ marginTop: '0.5rem' }}>
        <Checkbox
          checked={onlyAnswers}
          label="Export assistant answers only"
          flex="2"
          size="xs"
          onChange={e => setOnlyAnswers(e.currentTarget.checked)}
          style={{
            marginTop: '0.5rem',
            display: 'flex',
            flexDirection: 'row-reverse',
            alignContent: 'center',
            flexWrap: 'wrap',
          }}
        />
      </Flex>
    </Flex>
  );
};
