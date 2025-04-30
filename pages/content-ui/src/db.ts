import { Dexie } from 'dexie';
import type { EntityTable } from 'dexie';

export interface Message {
  id: string;
  convoId: string;
  role: string;
  content: string;
  convoTitle: string;
  created_at: number;
}

export interface Conversation {
  id: string;
  created_at: string;
  updated_at: string;
  title: string;
}

export interface Image {
  id: string;
  fileId: string;
  prompt: string;
  size: string;
  convoId: string;
  download_url: string;
  url_generated_at: string;
}

const db = new Dexie('ChatData') as Dexie & {
  messages: EntityTable<Message, 'id'>;
  conversations: EntityTable<Conversation, 'id'>;
  images: EntityTable<Image, 'id'>;
};

db.version(1).stores({
  messages: 'id, content, role, convoId, convoTitle',
  conversations: 'id, title, updated_at, created_at',
  images: 'id, fileId, prompt, size, convoId, download_url, url_generated_at',
});

export const getMessagessByPhrase = async (phrase: string) => {
  return await db.messages.filter(msg => msg.content.includes(phrase)).toArray();
};

export const updateDownloadURLForImage = async (
  id: string,
  url: string,
  convoId: string,
  fileId: string,
  size: string,
  prompt: string,
) => {
  return await db.images.put({
    id: id,
    download_url: url,
    url_generated_at: new Date().toString(),
    convoId,
    fileId,
    size,
    prompt,
  });
};

export const getAllMessages = async () => {
  return await db.messages.toArray();
};

export const getConvoById = async (id: string) => {
  const data = await db.conversations.get(id);
  return data;
};

export const getAllImages = async () => {
  return await db.images.toArray();
};

export const getMessagesByConvoId = async (id: string) => {
  const msgs = await db.messages.where('convoId').equals(id).toArray();
  return msgs.sort((m1, m2) => m1.created_at - m2.created_at);
};

export const getAllConversation = async () => {
  return await db.conversations.toArray();
};
