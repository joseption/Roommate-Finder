import express, { Request, Response, NextFunction } from 'express';
import { isAuthenticated } from '../../middleware';
import db from '../../utils/db';
const router = express.Router();

// router.use(isAuthenticated);

export default router;
