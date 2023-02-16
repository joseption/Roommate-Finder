import express, { Request, Response } from 'express';
import { isAuthenticated } from '../../middleware';
import db from '../../utils/db';
import { blockedChat } from './messagesHelper';
const router = express.Router();
import { env } from 'process';
import { getOAuth } from 'api/users/services';
import fetch from 'node-fetch';

// router.use(isAuthenticated);

// sending a message
router.post('/', async (req: Request, res: Response) => {
  try {
    // todo: replace userid in content with user from refresh token
    const { content, userId, chatId } = req.body;

    if (!content || !chatId) {
      return res.status(400).json('missing parameters');
    }
    const blocked = await blockedChat(chatId);
    if (!blocked) {
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
        latestMessage: newMessage.id as string, // * the content here really doesnt matter I'm just updating it so I can sort by updatedAt later
      },
    });

    // Send push notification to all chat users
    const fromUser = await db.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        first_name: true,
        last_name: true,
      }
    });

    const chatUsers = await db.chat.findUnique({
      where: {
        id: chatId
      },
      select: {
        users: true
      }
    });

    if (fromUser) {
      let auth = await getOAuth();
      if (auth && auth.Authorization) {
        for (let i = 0; i < chatUsers.users.length; i++) {
          if (chatUsers.users[i] !== userId) {
            const toUser = await db.user.findUnique({
              where: {
                id: chatUsers.users[i],
              },
              select: {
                push_token: true
              }
            });

            if (toUser.push_token) {
              let name = `${fromUser.first_name} ${fromUser.last_name}`;
              try {
                await fetch('https://fcm.googleapis.com/v1/projects/roomfin-37/messages:send', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: auth.Authorization,
                  },
                  body: JSON.stringify({
                    message: {
                      token: toUser.push_token,
                      android: {
                        data: {
                          experienceId: '@roomfin37/roomfin-37',
                          title: name,
                          message: content,
                          channelId: 'Messaging',
                          categoryId: 'New Message',
                          tag: chatId + "-" + new Date().getTime(), // Unique tag with DT
                        },
                      },
                    }
                  }),
                }).then(async ret => {
                  let res = JSON.parse(await ret.text());

                });
              }
              catch (e) {

              }
            }
          }
        }
      }
    }
    res.status(200).json(newMessage);
  }
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

router.get('/asc/:chatId', async (req: Request, res: Response) => {
  try {
    const { chatId } = req.params;
    const messages = await db.message.findMany({
      where: {
        chatId: chatId,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
    res.status(200).json(messages);
  } catch (err) {
    res.status(400).json(err);
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

router.post('/sendUpdatedPushNotification', async (req: Request, res: Response) => {
  try {
    const { message, title, tag, pushToken } = req.body;

    if (!title || !message || !tag || !pushToken) {
      return res.status(400).json('missing parameters');
    }

    try {
      const auth = await getOAuth();
      if (auth && auth.Authorization) {
        await fetch('https://fcm.googleapis.com/v1/projects/roomfin-37/messages:send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: auth.Authorization,
          },
          body: JSON.stringify({
            message: {
              token: pushToken,
              android: {
                data: {
                  title: title,
                  message: message,
                  channelId: 'Messaging',
                  categoryId: 'New Message',
                  tag: tag
                }
              }
            }
          }),
        })
      }
    }
    catch (e) {
      console.log(e);
    }

    res.status(200).json({message: "Success"});
  } catch (err) {
    res.status(500).json(err);
  }
});

export default router;
