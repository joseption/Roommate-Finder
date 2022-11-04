import express, { Request, Response, NextFunction } from 'express';
import { isAuthenticated } from '../../middleware';
import { findUserById } from './services';
import db from '../../utils/db';
const router = express.Router();

router.get('/profile', isAuthenticated, async (req:Request, res:Response, next:NextFunction) => {
  try {
    const { userId } = req.body[0];
    const user = await findUserById(userId);
    delete user.password;
    res.json(user);
  } catch (err) {
    next(err);
  }
});

router.get('/profile', isAuthenticated, async (req:Request, res:Response, next:NextFunction) => {
  try {
    const { userId } = req.body[0];
    const user = await findUserById(userId);
    delete user.password;
    res.json(user);
  } catch (err) {
    next(err);
  }
});

router.get('/Allprofiles', isAuthenticated, async (req:Request, res:Response, next:NextFunction) => {
  try {
    return db.user.findMany();
  } catch (err) {
    next(err);
  }
});

export default router;
