import express, { Request, Response } from 'express';
import { isAuthenticated } from '../../middleware';
import db from '../../utils/db';
import { Chat } from '@prisma/client';
const router = express.Router();

router.use(isAuthenticated);

// todo: verify how to extract userId from logged in user from faiz.
// * For now just include userId from query params
// access a chat. searches for chat between 2 users and returns it. Creates it if it doesnt exist
router.post('/', async (req: Request, res: Response) => {
  try {
    const { userIdOne, userIdTwo } = req.body;
    
    if (userIdOne === userIdTwo) {
      return res.status(400).json({Error: "Cannot chat with yourself"});
    }

    // validate users exist
    const userOne = await db.user.findUnique({
      where: {
        id: userIdOne as string,
      },
    });
    const userTwo = await db.user.findUnique({
      where: {
        id: userIdTwo as string,
      },
    });
    const chatExists = await db.chat.findFirst({
      where: {
        users: {
          hasEvery: [userIdOne as string, userIdTwo as string],
        },
        isGroupChat: false,
      },
    });
    if (!userOne || !userTwo) {
      return res.status(400).json({Error: "User does not exist"});
    }
    // if chat already exists just return it
    if (chatExists) {
      return res.status(200).json(chatExists);
    }
    const chat = await db.chat.create({
      data: {
        chatName: 'sender',
        isGroupChat: false,
        users: [userIdOne as string, userIdTwo as string],
        latestMessage: '',
      },
    });
    res.status(200).json(chat);
  } catch (err) {
    res.status(400).json(err);
  }
});

// get all chats for a logged in user, sorted by newest
router.get('/', async (req: Request, res: Response) => {
  try {
    // const { userId } = req.query;
    const payload: payload = req.body[0];
    const userId = payload.userId;
    const chats = await db.chat.findMany({
      where: {
        users: {
          has: userId as string,
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });
    return res.status(200).json(chats);
  } catch (err) {
    res.status(400).json(err);
  }
});

// create a group
router.post('/group', async (req: Request, res: Response) => {
  try {
    // todo: verify how users would come from the frontend. Do I need to parse it with JSON.parse?
    const { chatName, userId, users } = req.body;
    if (!chatName || !users) {
      return res.status(400).json('Missing parameters');
    }
    users.push(userId);
    if (users.length < 2) {
      return res.status(400).json('Group must have at least 2 people');
    }

    const group = await db.chat.create({
      data: {
        isGroupChat: true,
        chatName: chatName as string,
        users: users,
        latestMessage: '',
        groupAdmin: userId as string,
      },
    });
    res.status(200).json(group);
  } catch (err) {
    res.status(400).json(err);
  }
});

// rename group
router.put('/renameGroup', async (req: Request, res: Response) => {
  try {
    if (!req.body.chatName || !req.body.chatId) {
      return res.status(400).json('missing parameters');
    }
    const updatedGroup = await db.chat.update({
      where: {
        id: req.body.chatId,
      },
      data: {
        chatName: req.body.chatName,
      },
    });
    res.status(200).json(updatedGroup);
  } catch (err) {
    res.status(400).json(err);
  }
});

// add user to group
// todo: analyze how this array of users is going to come in from client. Might cause issues later if I'm using stringify wrong
router.put('/addToGroup', async (req: Request, res: Response) => {
  try {
    const { users, chatId } = req.body;

    if (!users || !chatId) {
      return res.status(400).json('missing parameters');
    }
    const updatedGroup = await db.chat.update({
      where: {
        id: chatId,
      },
      data: {
        users: {
          push: users,
        },
      },
    });
    res.status(200).json(updatedGroup);
  } catch (err) {
    res.status(400).json(err);
  }
});

// remove user from group
router.put('/removeFromGroup', async (req: Request, res: Response) => {
  try {
    // * prisma doesnt natively support removing froma scalar list
    const { usersToRemove, chatId } = req.body;
    if (!usersToRemove || !chatId) {
      return res.status(400).json('Missing parameters');
    }
    const getUsers = await db.chat.findFirst({
      where: {
        id: chatId,
      },
      select: {
        users: true,
      },
    });

    const { users } = getUsers;
    const newUsers = users.filter((user) => {
      if (!usersToRemove.includes(user)) {
        return true;
      }
    });
    const newGroup = await db.chat.update({
      where: {
        id: chatId as string,
      },
      data: {
        users: newUsers,
      },
    });
    res.status(200).json(newGroup);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.delete('/delete/:chatId', async (req: Request, res: Response) => {
  try {
    const { chatId } = req.params;
    await db.message.deleteMany({
      where: {
        chatId,
      },
    });
    await db.chat.delete({
      where: {
        id: chatId,
      },
    });
    return res.status(202).json('Chat deleted');
  } catch (err) {
    return res.status(500).json({ Error: err.message });
  }
});


// given a chatId return info on the chat /chats/chatId
// * honestly didnt need this in my original design but added just incase front end might need it
router.get('/:chatId', async (req: Request, res: Response) => {
  try {
    const { chatId } = req.params;
    const chatInfo = await db.chat.findFirst({
      where: {
        id: chatId as string,
      },
    });
    return res.status(200).json(chatInfo);
  } catch (err) {
    res.status(400).json(err);
  }
});

// block a chat
router.put('/block', async (req: Request, res: Response) => {
  try {
    const { chatId, userId } = req.body;
    let chat = await db.chat.findUnique({
      where: {
        id: chatId as string,
      },
    });
    if (!chat.blocked) {
      chat = await db.chat.update({
        data: {
          blocked: userId as string,
        },
        where: {
          id: chatId,
        },
      });
      await db.notification.deleteMany({
        where: {
          chatId: chatId,
        },
      });
      res.status(200).json(chat);
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// unblock a chat
router.put('/unblock', async (req: Request, res: Response) => {
  try {
    const { chatId, userId }: { chatId: string; userId: string } = req.body;
    let chat = await db.chat.findUnique({
      where: {
        id: chatId as string,
      },
    });
    if (chat.blocked && chat.blocked === userId) {
      chat = await db.chat.update({
        data: {
          blocked: null,
        },
        where: {
          id: chatId,
        },
      });
      res.status(200).json(chat);
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// mute a chat
router.put('/mute', async (req: Request, res: Response) => {
  try {
    const { chatId, userId } = req.body;
    let chat = await db.chat.findUnique({
      where: {
        id: chatId as string,
      }
    });
    if (!chat.blocked && !chat.muted.includes(userId)) {
      chat = await db.chat.update({
        data: {
          muted: {
            push: userId
          },
        },
        where: {
          id: chatId,
        }
      });
      await db.notification.deleteMany({
        where: {
          userId: userId,
          chatId: chatId,
        }
      })
      res.status(200).json(chat);
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// unmute a chat
router.put('/unmute', async (req: Request, res: Response) => {
  try {
    const { chatId, userId }: { chatId: string, userId: string} = req.body;
    let chat = await db.chat.findUnique({
      where: {
        id: chatId as string,
      }
    });
    if (chat.muted.length > 0) {
      chat.muted = chat.muted.filter((user) => user !== userId);
      chat = await db.chat.update({
        data: {
          muted: chat.muted,
        },
        where: {
          id: chatId,
        }
      });
    }
    res.status(200).json(chat);
  } catch (err) {
    res.status(500).json(err);
  }
});

export default router;
