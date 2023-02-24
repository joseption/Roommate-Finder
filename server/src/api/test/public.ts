import express, { Request, Response } from "express";
const router = express.Router()

router.get("/public", (req: Request, res: Response) => {
    // res.set("Access-Control-Allow-Origin", "*");
    res.json({ hello: "world" });
});

export default router;