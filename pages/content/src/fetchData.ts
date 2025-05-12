import { isAfter } from 'date-fns';
import { getConversationById, getMessagesByConvoId, updateConversations, upsertImages, upsertMessages } from './db';

import type { Message, Conversation, Image } from './db';
import { SyncStatus, updateStatus } from './chatUtils';

const BACKEND_URL = 'https://chatgpt.com/backend-api';
const GIZMOS_URL = 'https://chatgpt.com/backend-api/gizmos/snorlax/sidebar?conversations_per_gizmo=20';

const ROLES = ['user', 'assistant'];

export const fetchAllConversations = async () => {
  const updatedConvos: string[] = [];
  const { authToken } = await chrome.storage.local.get('authToken');
  let pages = 10;
  let currPage = 0;
  try {
    while (currPage < pages) {
      const res = await fetch(`${BACKEND_URL}/conversations?offset=${currPage * 100}&limit=100&order=updated`, {
        headers: {
          Authorization: authToken,
        },
      });
      const { items, total } = await res.json();
      if (currPage === 0) {
        pages = total / 100;
      }
      const c = processConversations(items);
      for (let i = 0; i < c.length; i++) {
        const { updated_at, id } = c[i];
        let zeroMsgs = false;
        const convo = await getConversationById(id);
        if (convo) {
          const msgs = await getMessagesByConvoId(convo.id);
          if (msgs.length === 0) {
            zeroMsgs = true;
          }
        }

        if (!convo || zeroMsgs || isAfter(new Date(updated_at), new Date(convo.updated_at))) {
          updatedConvos.push(id);
          await updateConversations(c);
        }
      }
      currPage++;
    }
    await fetchMessages(updatedConvos);
    await fetchAllGizmos();
  } catch {
    updateStatus(SyncStatus.ERROR);
  }
};

const shouldFetchMessages = async (convoId: string, updated_at: string) => {
  const convo = await getConversationById(convoId);
  if (convo) {
    const msgs = await getMessagesByConvoId(convo.id);
    if (msgs.length === 0 || isAfter(new Date(updated_at), new Date(convo.updated_at))) {
      return true;
    } else {
      return false;
    }
  } else if (!convo) {
    return true;
  }
  return false;
};

const fetchAllGizmos = async () => {
  const { authToken } = await chrome.storage.local.get('authToken');
  const updatedConvos: string[] = [];
  let convos: any = [];
  const res = await fetch(GIZMOS_URL, {
    headers: {
      Authorization: authToken,
    },
  });
  const data = await res.json();
  const { items } = data;
  items.forEach(({ conversations }) => {
    const { items } = conversations;
    convos = convos.concat(items);
  });
  const c = processConversations(convos);
  for (let i = 0; i < c.length; i++) {
    if (await shouldFetchMessages(c[i].id, c[i].updated_at)) {
      updatedConvos.push(c[i].id);
      await updateConversations(c);
    }
  }
  await fetchMessages(updatedConvos);
};

export const fetchMessages = async (convoIds: string[]) => {
  const { authToken } = await chrome.storage.local.get('authToken');

  for (let i = 0; i < convoIds.length; i++) {
    const id = convoIds[i];
    const { title } = await getConversationById(id);
    const res = await fetch(`${BACKEND_URL}/conversation/${id}`, {
      headers: {
        Authorization: authToken,
      },
    });
    const { mapping } = await res.json();
    processMessages(mapping, id, title);
  }
};

const processMessages = async (map: Record<string, any>, convoId: string, convoTitle: string) => {
  const msgs: Message[] = [];
  const images: Image[] = [];
  Object.keys(map).forEach(id => {
    const { message, parent } = map[id];
    if (message) {
      const { author, content, create_time } = message;
      const { role } = author;
      const { content_type, parts } = content;
      if (content_type === 'text' && parts[0].trim() !== '' && ROLES.includes(role)) {
        msgs.push({ id, convoId, content: parts[0], role, convoTitle, created_at: create_time });
      }
      if (content_type === 'multimodal_text' && role === 'tool' && parts[0]['content_type'] === 'image_asset_pointer') {
        const { message } = map[parent];
        const { content } = message;
        const fileId = parts[0]['asset_pointer'].split('sediment://')[1];
        if (fileId) {
          images.push({
            id,
            fileId,
            size: parts[0]['size_bytes'],
            prompt: content['text'],
            convoId,
          });
        }
      }
    }
  });
  await upsertMessages(msgs);
  await upsertImages(images);
};

const processConversations = (items): Conversation[] => {
  return items.map(
    ({
      title,
      create_time,
      update_time,
      id,
    }: {
      title: string;
      create_time: string;
      update_time: string;
      id: string;
    }) => ({
      title,
      created_at: create_time,
      updated_at: update_time,
      id,
    }),
  );
};
