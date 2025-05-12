import { createRoot } from 'react-dom/client';
import App from '@src/App';
// import tailwindcssOutput from '../dist/tailwind-output.css?inline';
// @ts-expect-error Because file doesn't exist before build
import styles from '@mantine/core/styles.css?inline';
// @ts-expect-error Because file doesn't exist before build
import customStyles from './custom.css?inline';
import { Index } from 'flexsearch';
import type { CSSVariablesResolver } from '@mantine/core';

import { MantineProvider } from '@mantine/core';
import { getAllMessages } from './db';
import { getTheme } from './utils';

const appendReactApp = () => {
  const root = document.createElement('div');
  root.id = 'chatgpt-better-ui';
  root.style.position = 'absolute';
  root.style.right = '0px';
  root.style.bottom = '0px';
  root.style.width = '100%';
  root.style.height = '100%';
  root.style.pointerEvents = 'none';

  document.body.append(root);

  const styleTag = document.createElement('style');
  styleTag.innerHTML = styles;

  const customCSS = document.createElement('style');
  customCSS.innerHTML = customStyles;

  document.head.appendChild(styleTag);
  document.head.appendChild(customCSS);

  const gptTheme = getTheme();

  const resolver: CSSVariablesResolver = theme => ({
    variables: {},
    light: {
      '--mantine-button-background-color': theme.colors.gray[3],
      '--mantine-text-selected': '#000',
      '--mantine-message-action-button': '#5d5d5d',
      '--mantine-hover-background': '#ececec',
      '--maintine-button-text': '#000',
      '--mantine-button-modal-bg-color': '#000',
      '--mantine-button-modal-color': '#fff',
      '--mantine-button-bg': '#000',
      '--mantine-button-text-color': '#fff',
      '--mantine-icon-color': '#fff',
    },
    dark: {
      '--mantine-button-background-color': '#ffffff12',
      '--mantine-text-selected': '#fff',
      '--mantine-subtext-muted': '#606060',
      '--mantine-title-muted': '#a8a8a8',
      '--mantine-hover-background': '#2f2f2f',
      '--mantine-message-action-button': '#f3f3f3',
      '--mantine-button-modal-bg-color': '#fff',
      '--mantine-button-modal-color': '#000',
      '--maintine-button-text': '#fff',
      '--mantine-button-bg': '#fff',
      '--mantine-button-text-color': '#000',
      '--mantine-icon-color': '#000',
    },
  });

  createRoot(root).render(
    <MantineProvider defaultColorScheme={gptTheme ?? 'dark'} cssVariablesResolver={resolver}>
      <App />
    </MantineProvider>,
  );

  const buildIndex = async () => {
    const allMsg = await getAllMessages();
    const idx = new Index({ tokenize: 'forward' });
    allMsg.forEach(m => idx.add(m.id, m.content));
  };
  buildIndex();
};

setTimeout(appendReactApp, 100);
