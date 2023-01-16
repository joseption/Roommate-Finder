import { VerifySudo } from "api/auth/services";
import express, { Request, Response } from "express";
const router = express.Router()
import {isAuthenticated} from '../../middleware';
import { AddQuestion, AddResponse, GetSurveyQuestionsAndResponses, RemoveQuestion, RemoveResponse, UserAnswer, VerifyResponse, VerifySetup } from "./services";
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
            return res.status(422).json({"Error": "Missing questionId or responseId"});
        }
        const payload : payload = req.body[0];
        if(!await VerifyResponse(questionId, responseId)){
            return res.status(422).json({"Error": "Invalid responseId for questionId"});
        }
        if(!await UserAnswer(payload.userId, questionId, responseId))
        {
            return res.status(400).json({"Error": "Failed to update/add user response"});
        }
        else{
            res.status(200).json({
                'msg':'Updated/created user response.'});
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

        const { question_text } = req.body;
        if (!question_text) {
            return res.status(422).json({"Error": "Missing question_text"});
        }
        const data = await AddQuestion(question_text);
        if(!data)
        {
            return res.status(400).json({"Error": "Failed to add question"});
        }
        else{
            res.status(200).json({
                'id': data.id,
                'msg':'Added question.'});
        }
        
    } catch (error) {
        
        res.status(500).json(error);
    }
});

router.post("/utils/remove/question", async (req: Request, res: Response) => {
    try {
        const payload : payload = req.body[0];
       
        if(!VerifySudo(payload.userId))
        {
            return res.status(400).json({"Error": "Only super users are allowed this function."});
        }

        const { id } = req.body;
        if (!id) {
            return res.status(422).json({"Error": "Missing question id"});
        }
        const data = await RemoveQuestion(id)
        if(!data)
        {
            return res.status(400).json({"Error": "Failed to remove question"});
        }
        else{
            res.status(200).json({
                'question_text': data.question_text,
                'msg':'Removed question and its responses.'});
        }
        
    } catch (error) {
        res.status(500).json(error);
    }
});

router.post("/utils/add/response", async (req: Request, res: Response) => {
    try {
        const payload : payload = req.body[0];
       
        if(!VerifySudo(payload.userId))
        {
            return res.status(400).json({"Error": "Only super users are allowed this function."});
        }
        const { question_id , response } = req.body;
        if (!question_id || !response) {
            return res.status(422).json({"Error": "Missing question_id or response"});
        }
        if(!await AddResponse(response, question_id))
        {
            return res.status(400).json({"Error": "Failed to add response"});
        }
        else{
            res.status(200).json({
                'msg':'Added reponse.'});
        }
        
    } catch (error) {
        res.status(500).json(error);
    }
});

router.post("/utils/remove/response", async (req: Request, res: Response) => {
    try {
        const payload : payload = req.body[0];
       
        if(!VerifySudo(payload.userId))
        {
            return res.status(400).json({"Error": "Only super users are allowed this function."});
        }
        const { id } = req.body;
        if (!id) {
            return res.status(422).json({"Error": "Missing response id"});
        }
        if(!await RemoveResponse(id))
        {
            return res.status(400).json({"Error": "Failed to remove response"});
        }
        else{
            res.status(200).json({
                'msg':'Removed reponse.'});
        }
        
    } catch (error) {
        res.status(500).json(error);
    }
});

router.get("/verify", async (req: Request, res: Response) => {
    try {
        const payload : payload = req.body[0];
        const userId = payload.userId;
        await VerifySetup(userId);
        res.status(200).json({"msg":"setup complete"});
    } catch (error) {
        res.status(500).json(error);
    }
});

export default router;