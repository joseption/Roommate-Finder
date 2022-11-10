import express, { Request, Response } from "express";
const router = express.Router()

import {isAuthenticated} from '../../middleware';

router.get("/private", isAuthenticated, (req: Request, res: Response) => {
    return res.json({
        "MSG": "protected route"
    });
});

export default router;