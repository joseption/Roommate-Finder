import { Chat } from '@prisma/client';

export function insertionSortLastMessage(chats: Chat[]) {
  for (let i = 0; i < chats.length; i++) {
    let key = chats[i];
    let j = i - 1;
    while (j >= 0 && chats[j].updatedAt < key.updatedAt) {
      chats[j + 1] = chats[j];
      j = j - 1;
    }
    chats[j + 1] = key;
  }
};