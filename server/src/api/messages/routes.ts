import express, { Request, Response } from 'express';
import { isAuthenticated } from '../../middleware';
import db from '../../utils/db';
const router = express.Router();

// router.use(isAuthenticated);

// sending a message
router.post('/', async (req: Request, res: Response) => {
  try {
    // todo: replace userid in content with user from refresh token
    const { content, userId, chatId } = req.body;

    if (!content || !chatId) {
      return res.status(400).json('missing parameters');
    }
    const newMessage = await db.message.create({
      data: {
        userId: userId as string, // * the sender of the message
        content: content as string,
        chatId: chatId as string,
      },
    });
    // update latest message in chat
    await db.chat.update({
      where: {
        id: chatId as string,
      },
      data: {
        latestMessage: newMessage.id as string,
      },
    });
    res.status(200).json(newMessage);
  } catch (err) {
    res.status(500).json(err);
  }
});

// fetch all messages in a given chat
router.get('/:chatId', async (req: Request, res: Response) => {
  try {
    const { chatId } = req.params;
    const messages = await db.message.findMany({
      where: {
        chatId: chatId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    res.status(200).json(messages);
  } catch (err) {
    res.status(400).json(err);
  }
});

export default router;
