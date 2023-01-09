import express, { Request, Response } from 'express';
import { isAuthenticated } from '../../middleware';
import db from '../../utils/db';
const router = express.Router();

//
// router.use(isAuthenticated);

router.get('/all', async (req: Request, res: Response) => {});
export default router;
