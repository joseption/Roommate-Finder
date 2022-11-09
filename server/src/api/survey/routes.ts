import { VerifySudo } from "api/auth/services";
import express, { Request, Response } from "express";
const router = express.Router()
import {isAuthenticated} from '../../middleware';
import { GetSurveyQuestionsAndResponses, UserAnswer } from "./services";
router.use(isAuthenticated);

router.get("/info", async (req: Request, res: Response) => {
    try {
        const payload : payload = req.body[0];
        res.status(200).json(await GetSurveyQuestionsAndResponses(payload.userId))
    } catch (error) {
        res.status(500).json(error);
    }
});

//updates or creates user response for a certain question. 
router.post("/response", async (req: Request, res: Response) => {
    try {
        const { questionId, responseId } = req.body;

        if (!questionId || !responseId) {
            return res.status(400).json('missing parameters');
        }
        const payload : payload = req.body[0];

        if(!await UserAnswer(payload.userId, questionId, responseId))
        {
            return res.status(400).json('Failed to update/create.')
        }
        else{
            res.status(200).json('updated/created user response.')
        }
    } catch (error) {
        res.status(500).json(error);
    }
});

router.post("/utils/add/question", async (req: Request, res: Response) => {
    try {
        const payload : payload = req.body[0];
        if(!VerifySudo(payload.userId))
        {
            return res.status(400).json({"Error": "Only super users are allowed this function."});
        }

    } catch (error) {
        res.status(500).json(error);
    }
});

export default router;