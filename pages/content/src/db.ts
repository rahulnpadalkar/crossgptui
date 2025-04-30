import type { EntityTable } from 'dexie';
import { Dexie } from 'dexie';

export interface Conversation {
  id: string;
  created_at: string;
  updated_at: string;
  title: string;
}

export interface Message {
  id: string;
  convoId: string;
  role: string;
  content: string;
  convoTitle: string;
  created_at: number;
}

export interface Image {
  id: string;
  fileId: string;
  prompt: string;
  size: string;
  convoId: string;
}

const db = new Dexie('ChatData') as Dexie & {
  conversations: EntityTable<Conversation, 'id'>;
  messages: EntityTable<Message, 'id'>;
  images: EntityTable<Image, 'id'>;
};

db.version(1).stores({
  conversations: 'id, created_at, updated_at, title',
  messages: 'id, content, role, convoId, convoTitle, created_at',
  images: 'id, fileId, prompt, size, convoId',
});

export const updateConversations = async (items: Conversation[]) => {
  await db.conversations.bulkPut(items);
};

export const deleteAllMessagesFromConvo = async (id: string) => {
  await db.messages.where('convoId').equals(id).delete();
};

export const getAllConversationIds = async () => {
  const convos = await db.conversations.toArray();
  return convos.map(({ id }) => id);
};

export const upsertMessages = async (msgs: Message[]) => {
  await db.messages.bulkPut(msgs);
};

export const upsertImages = async (images: Image[]) => {
  await db.images.bulkPut(images);
};

export const getConversationById = async (id: string) => {
  return await db.conversations.get(id);
};

export const getMessagesByConvoId = async (id: string) => {
  return await db.messages.where('convoId').equals(id).toArray();
};
