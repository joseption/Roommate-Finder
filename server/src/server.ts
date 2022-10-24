import express, { Request, Response } from "express";
import {requireJWTAuthentication, AuthenticatedRequest} from "./middleware/auth"

const port = process.env.PORT || 8080;
const app = express();

app.use((req, res, next) => {
  // allow calling from different domains
  res.set("Access-Control-Allow-Origin", "*");
  // allow authorization header
  res.set("Access-Control-Allow-Headers", "authorization");
  next();
});

// Allow requests from anyone to the /public route.
app.get("/public", (req: Request, res: Response) => {
  console.log("public");
  // res.set("Access-Control-Allow-Origin", "*");
  res.json({ hello: "world" });
});

// Require authenticated requests to access the /private route.
app.get("/private", requireJWTAuthentication, (req: AuthenticatedRequest, res: Response) => {
  // jwtCheck adds a user property with the payload from a valid JWT
  console.log(req.user);
  return res.json({
    secrets: [
      `You're ${JSON.stringify(req.user)}`,
      "          ... I'm Batman!",
    ],
  });
});

// Start the express server.
app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});