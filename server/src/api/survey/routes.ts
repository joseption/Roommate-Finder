import express, { Request, Response } from "express";
const router = express.Router()
import db from '../../utils/db';
import {isAuthenticated} from '../../middleware';

router.get("/Questions", isAuthenticated, (req: Request, res: Response) => {
    return res.json(
        db.question.findMany({
            select: {
                id: true,
                question_text: true,
                question_text_short: true,
                is_filter: true,
                response_id: true,
                response: true,
            },
        })
    );
});

export default router;