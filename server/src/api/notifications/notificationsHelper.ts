import db from '../../utils/db';

export async function mutedChat(chatId: string, userId: string) {
  const chat = await db.chat.findUnique({
    where: {
      id: chatId,
    }
  });
  return chat.muted.includes(userId);
}