import express, { Request, Response } from 'express';
import { isAuthenticated } from '../../middleware';
import db from '../../utils/db';
const router = express.Router();

// router.use(isAuthenticated);

// Block a chat for user
router.post('/', async (req: Request, res: Response) => {
  try {
    const { chatId, userId, latestMessage, updatedAt } = req.body;
    const block = await db.blocked.create({
      data: {
        chatId: chatId,
        userId: userId,
        latestMessage: latestMessage,
        updatedAt: updatedAt,
      },
    });
    res.status(200).json(block);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Unblock a chat user
router.delete('/', async (req: Request, res: Response) => {
  try {
    const { userId, chatId } = req.body;

    const deleted = await db.blocked.delete({
      where: {
        userId_chatId: userId + chatId
      }
    })
    res.status(200).json(deleted)
  } catch (err) {
    res.status(500).json(err);
  }
});