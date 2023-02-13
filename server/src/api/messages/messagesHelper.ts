import db from '../../utils/db';

export async function blockedChat(chatId: string) {
  const chat = await db.chat.findUnique({
    where: {
      id: chatId
    }
  });
  return chat.blocked;
}