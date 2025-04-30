import { Button } from '@mantine/core';
import { useEffect, useState } from 'react';
import { RiCollapseVerticalFill, RiExpandVerticalFill } from 'react-icons/ri';

export const ExpandCollapseButton = () => {
  const [expand, setExpand] = useState(true);

  useEffect(() => {
    document.addEventListener('keydown', e => {
      const isCmd = e.metaKey;
      const isB = e.key.toLowerCase() === 'b';

      if (isCmd && isB) {
        applyAction();
      }
    });
  }, []);

  const getButton = () => {
    if (expand) {
      return (
        <div className="flex flex-row items-center" style={{ color: 'var(--mantine-color-text)' }}>
          <RiCollapseVerticalFill color="'var(--mantine-color-text)'" /> Collapse All
        </div>
      );
    }
    return (
      <div className="flex flex-row items-center" style={{ color: 'var(--mantine-color-text)' }}>
        <RiExpandVerticalFill color="'var(--mantine-color-text)'" /> Expand All
      </div>
    );
  };

  const applyAction = () => {
    setExpand(prev => {
      const expand = !prev;
      const allBtns = document.querySelectorAll<HTMLButtonElement>('button.collapse-chat');
      allBtns.forEach(btn => {
        if (
          (btn.classList.contains('collapsed') && expand === false) ||
          (btn.classList.contains('expanded') && expand === true)
        ) {
          return;
        } else {
          btn.click();
        }
      });
      return expand;
    });
  };

  return (
    <>
      <Button
        onClick={applyAction}
        variant="default"
        style={{ borderRadius: '10px', backgroundColor: 'var(--mantine-button-background-color)', border: 'none' }}>
        {getButton()}
      </Button>
    </>
  );
};
