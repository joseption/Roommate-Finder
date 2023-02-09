import express, { Request, Response } from 'express';
import { isAuthenticated } from '../../middleware';
import db from '../../utils/db';
const router = express.Router();
import payload from '../../global'
import { blockedChat } from './messagesHelper';

// router.use(isAuthenticated);

// sending a message
router.post('/', async (req: Request, res: Response) => {
  try {
    // todo: replace userid in content with user from refresh token
    const { content, sender, receiver, chatId } = req.body;

    if (!content || !chatId) {
      return res.status(400).json('missing parameters');
    }
    const newMessage = await db.message.create({
      data: {
        userId: sender as string, // * the sender of the message
        copyOfUserId: sender as string,
        content: content as string,
        chatId: chatId as string,
      },
    });
    const receiverBlockedChat = await blockedChat(receiver, chatId);
    if (!receiverBlockedChat) {
      await db.message.create({
        data: {
          userId: sender as string, // * the sender of the message
          copyOfUserId: receiver as string, // * the receiver of the message
          content: content as string,
          chatId: chatId as string,
          messageReference: newMessage.id as string,
        },
      });
    }
    // update latest message in chat
    await db.chat.update({
      where: {
        id: chatId as string,
      },
      data: {
        latestMessage: newMessage.id as string, // * the content here really doesnt matter I'm just updating it so I can sort by updatedAt later
      },
    });
    res.status(200).json(newMessage);
  } catch (err) {
    res.status(500).json(err);
  }
});

// given a messageId return whats in that message
// * didnt really have a use from my original design. Added it in case front end wants to do something with lastMessage column in chat
router.get('/getMessage', async (req: Request, res: Response) => {
  try {
    const { messageId } = req.query;
    const message = await db.message.findFirst({
      where: {
        id: messageId as string,
      },
    });
    res.status(200).json(message);
  } catch (err) {
    res.status(500).json(err);
  }
});

// fetch all messages in a given chat for a user
router.get('/:chatId/:userId', async (req: Request, res: Response) => {
  try {
    const { chatId, userId } = req.params;
    const messages = await db.message.findMany({
      where: {
        chatId: chatId,
        copyOfUserId: userId,
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
