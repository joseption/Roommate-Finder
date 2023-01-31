import express, { Request, Response } from 'express';
import { isAuthenticated } from '../../middleware';
import db from '../../utils/db';
const router = express.Router();

router.use(isAuthenticated);

// retreive all the matches for a user
router.get('/all', async (req: Request, res: Response) => {
  try {
    const { loggedInUserId } = req.body;
    const matches = await db.matches.findMany({
      where: {
        OR: [
          {
            userOneId: loggedInUserId,
          },
          {
            userTwoId: loggedInUserId,
          },
        ],
      },
    });
    res.status(200).json({ matches });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// create all the matches for a user thats completed the quiz
router.post('/create', async (req: Request, res: Response) => {
  try {
    //const { loggedInUserId } = req.body; why???? 
    const payload: payload = req.body[0];
    const loggedInUserId = payload.userId;
    const loggedInResponses = await db.responsesOnUsers.findMany({
      where: {
        userId: loggedInUserId,
      },
    });
    const everyoneElseResponses = await db.responsesOnUsers.findMany({
      where: {
        NOT: {
          userId: loggedInUserId,
        },
      },
    });
    const groupedResponses = everyoneElseResponses.reduce((acc: any, response) => {
      if (!acc[response.userId]) {
        acc[response.userId] = [];
      }
      acc[response.userId].push(response);
      return acc;
    }, {});

    const userIds = Object.keys(groupedResponses);
    const totalResponses = await db.response.count();

    let mySet = new Set();
    for (const response in loggedInResponses) {
      mySet.add(loggedInResponses[response]['responseId']);
    }

    for (const user in groupedResponses) {
      if (user !== loggedInUserId) {
        // calculate the percentage of responses that match
        let matchScore = 1.0;
        let numberInCommon = 0;
        for (const response in groupedResponses[user]) {
          if (mySet.has(groupedResponses[user][response]['responseId'])) {
            numberInCommon++;
          }
        }
        matchScore = (numberInCommon / totalResponses) * 100; // ! MATCH SCORE CURRENTLY OFF BECAUSE TOTALRESPONSES IS ACTUALLY 25 BUT QUIZ FRONTNEND HAS 5 QUESTIONS

        const upsertMatchScore = await db.matches.upsert({
          where: {
            userOneId_userTwoId: {
              userOneId: loggedInUserId,
              userTwoId: user,
            },
          },
          update: {
            matchPercentage: matchScore,
          },
          create: {
            userOneId: loggedInUserId,
            userTwoId: user,
            matchPercentage: matchScore,
          },
        });
      }
    }
    res.status(200).json({ message: 'Matches created' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
export default router;
