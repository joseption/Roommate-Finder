import express, { Request, Response, NextFunction } from 'express';
import { isAuthenticated } from '../../middleware';
import { findUserById } from './services';
import db from '../../utils/db';
const router = express.Router();

// router.use(isAuthenticated); // ! Do this instead of adding isAuthenticated to every function

// ! Duplicate function? I dont think get requests are supposed to have a body ?
// router.get('/profile', async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const { userId } = req.body[0];
//     const user = await findUserById(userId);
//     delete user.password;
//     res.json(user);
//   } catch (err) {
//     next(err);
//   }
// });

// ! changed the duplicate function to work using query params
router.get('/profile', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.query;
    const user = await findUserById(userId);
    delete user.password;
    res.json(user);
  } catch (err) {
    next(err);
  }
});

// * added profile search functionality so people could search on partial text
router.get('/profileSearch', async (req: Request, res: Response) => {
  try {
    const { searchText } = req.query;
    const matches = await db.user.findMany({
      where: {
        email: {
          contains: searchText as string,
        },
      },
    });
    res.status(200).json(matches);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/Allprofiles', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await db.user.findMany();
    return res.json(users);
  } catch (err) {
    next(err);
  }
});

export default router;
