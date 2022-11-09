import express, { Request, Response } from "express";
const router = express.Router()
import db from '../../utils/db';
import {isAuthenticated} from '../../middleware';
import jwt  from "jsonwebtoken";

router.use(isAuthenticated);

router.get("/question", (req: Request, res: Response) => {
    try {
        const payload : payload = req.body[0];
        const Questions = db.question.findMany({
            select: {
                id: true,
                question_text: true,
                question_text_short: true,
                response: true,
                ResponsesOnUsers: {
                    where: {
                        userId: payload.userId,
                    },
                    select: {
                        responseId: true,
                        response: true
                    }
            }
            },
        })
        res.json(Questions)
    } catch (error) {
        res.status(500).json(error);
    }
});

export default router;