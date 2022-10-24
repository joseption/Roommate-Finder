import express, { Request, Response } from "express";
import {requireJWTAuthentication, AuthenticatedRequest} from "../middleware/auth"
const router = express.Router()

router.get("/private", requireJWTAuthentication, (req: AuthenticatedRequest, res: Response) => {
    // jwtCheck adds a user property with the payload from a valid JWT
    console.log(req.user);
    return res.json({
      secrets: [
        `You're ${JSON.stringify(req.user)}`,
        "          ... I'm Batman!",
      ],
    });
  });

  export default router;