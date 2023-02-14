import express, { Request, Response } from 'express';
import { isAuthenticated } from '../../middleware';
import db from '../../utils/db';
import { blockedChat } from 'api/messages/messagesHelper';
import { mutedChat } from './notificationsHelper';
const router = express.Router();

// router.use(isAuthenticated);

// send a notification
router.post('/', async (req: Request, res: Response) => {
  try {
    const { userId, chatId } = req.body;
    const userBlockedChat = await blockedChat(chatId);
    const userMutedChat = await mutedChat(chatId, userId);
    if (!userBlockedChat && !userMutedChat) {
      await db.notification.create({
        data: {
          userId: userId as string,
          chatId: chatId as string,
        }
      });
    }
    res.status(200).json({});
  } catch (err) {
    res.status(500).json(err);
  }
});

// get all notifications for a user
router.get('/', async (req: Request, res: Response) => {
  try {
    const { userId, chatId } = req.query;
    const notifCount = await db.notification.count({
      where: {
        userId: userId as string,
        chatId: chatId as string,
      }
    });
    res.status(200).json(notifCount);
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
