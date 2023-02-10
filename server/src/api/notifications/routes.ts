import express, { Request, Response } from 'express';
import { isAuthenticated } from '../../middleware';
import db from '../../utils/db';
import { blockedChat } from 'api/messages/messagesHelper';
const router = express.Router();

// router.use(isAuthenticated);

// send a notification
router.post('/', async (req: Request, res: Response) => {
  try {
    const { userId, chatId } = req.body;
    const userBlockedChat = await blockedChat(userId, chatId);
    if (!userBlockedChat) {
      await db.notification.create({
        data: {
          userId: userId as string,
          chatId: chatId as string,
        }
      });
    }
    res.status(200);
  } catch (err) {
    res.status(500).json(err);
  }
});

// delete all notifications for a given chat
router.delete('/', async (req: Request, res: Response) => {
  try {
    const { userId, chatId } = req.body;
    const deleted = await db.notification.deleteMany({
      where: {
        userId: userId as string,
        chatId: chatId as string,
      }
    });
    res.status(200).json(deleted)
  } catch (err) {
    res.status(500).json(err);
  }
});

export default router;
