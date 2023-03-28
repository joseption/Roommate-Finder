import express, { Request, Response } from 'express';
//add routes here...
import publicRoute from './test/public';
import privateRoute from './test/private';
import survey from './survey/routes';
import auth from './auth/routes';
import users from './users/routes';
import chats from './chats/routes';
import messages from './messages/routes';
import notifications from './notifications/routes';
import listings from './listings/routes';
import matches from './matches/routes';
import bodyParser from 'body-parser';
import { startSocketIO } from './websockets';
import { Socket } from 'socket.io';

const port = process.env.PORT || 8080;
const app = express();
const twilio = require('twilio');
app.use(bodyParser.json({ limit: '10mb' }));
const cors = require('cors');
app.use(cors());

app.use((req, res, next) => {
  // allow calling from different domains
  res.set('Access-Control-Allow-Origin', '*');
  // allow authorization header
  res.set('Access-Control-Allow-Headers', 'authorization');
  next();
});

app.get('/', (req: Request, res: Response) => {
  // res.set("Access-Control-Allow-Origin", "*");
  res.json({ BRUH: 'IP ADDRESS LOGGED AND REPORTED TO ADMIN' });
});

// middleware
app.use(express.json());

//use routes here
app.post('/sms', async (req: Request, res: Response) => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const client = twilio(accountSid, authToken);
  await client.messages
    .create({
      body: 'Here is the link to Roomfin: https://play.google.com/store/apps/details?id=com.roomfin&hl=en&gl=US',
      from: process.env.TWILIO_PHONE_NUMBER,
      to: req.body.phoneNumber,
    })
    .then((message: any) => {
      console.log(message.sid, `message sent to ${req.body.phoneNumber} with sid: ${message.sid}`);
    })
    .catch((err: any) => {
      res.status(500).json({Error: err.message})
    });
  res.status(200).json({ message: 'Message sent' });
});

app.use(publicRoute);
app.use(privateRoute);
app.use('/auth', auth);
app.use('/users', users);
app.use('/chats', chats);
app.use('/messages', messages);
app.use('/notifications', notifications);
app.use('/listings', listings);
app.use('/survey', survey);
app.use('/matches', matches);
// Start the express server.
const server = app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});

startSocketIO(server);
