import express, { Request, Response } from "express";
//add routes here... 
import publicRoute from './routes/public';
import privateRoute from './routes/private';

const port = process.env.PORT || 8080;
const app = express();

app.use((req, res, next) => {
  // allow calling from different domains
  res.set("Access-Control-Allow-Origin", "*");
  // allow authorization header
  res.set("Access-Control-Allow-Headers", "authorization");
  next();
});

app.get("/", (req: Request, res: Response) => {
  console.log("/");
  // res.set("Access-Control-Allow-Origin", "*");
  res.json({ BRUH: "IP ADDRESS LOGGED AND REPORTED TO ADMIN" });
});

//use routes here
app.use(publicRoute)
app.use(privateRoute)

// Start the express server.
app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});