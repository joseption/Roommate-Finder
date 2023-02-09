import db from '../../utils/db';

export async function blockedChat(userId: string, chatId: string) {
  return db.blocked.findUnique({
    where: {
      userId_chatId: {userId: userId, chatId: chatId}
    }
  });
}