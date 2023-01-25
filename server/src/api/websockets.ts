import { Socket } from 'socket.io';
import { frontendEnv } from 'middleware';
import { IncomingMessage, Server, ServerResponse } from 'node:http';

const SocketServer = require('socket.io').Server;

export const startSocketIO = (server: Server<typeof IncomingMessage, typeof ServerResponse>) => {
  const io = new SocketServer(server, {
    cors: {
      origin: frontendEnv.URL,
    }
  })
  
  io.on('connection', (socket: any) => {
    console.log('User connected', socket.id);
  
    socket.on('disconnect', () =>  {
      console.log('User disconnected', socket.id);
    });
  })
}