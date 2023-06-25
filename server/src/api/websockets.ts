import { frontendEnv, webfrontendEnv } from 'middleware';
import { IncomingMessage, Server, ServerResponse } from 'node:http';

const SocketServer = require('socket.io').Server;



export const startSocketIO = (server: Server<typeof IncomingMessage, typeof ServerResponse>) => {
  const io = new SocketServer(server, {
    cors: {
      origin: [frontendEnv.URL, webfrontendEnv.URL, "https://api.roomfin.com", "https://roommate-finder-production-b646.up.railway.app", "https://www.roomfin.com", "http://localhost:3000"],
      pingTimeout: 60000,
    },
  });

  io.on('connection', (socket: any) => {
    socket.on('setup', (userData: any) => {
      socket.join(userData);
      socket.emit('connected');
    });
    socket.on('join_room', (data: any) => {
      socket.join(data);
      console.log('user joined room', data);
    });

    socket.on('create_chat', (data: any) => {
      if (!data || data.users.length === 0) return;
      socket.nsp.to(data.users[0].id).emit('receive_chat', data);
    })

    socket.on('send_message', (data: any) => {
      socket.nsp.to(data.chatId).emit('receive_message', data);
    });

    socket.on('send_typing', (data: any) => {
      socket.to(data.chatId).emit('receive_typing', data);
    });

    socket.on('send_block', (data: any) => {
      socket.to(data.chatId).emit('receive_block', data);
    });

    socket.on('send_notification', (data: any) => {
      socket.to(data.chatId).emit('receive_notification', data);
    });

    socket.on('join chat', (room: any) => {
      socket.join(room);
      console.log('user joined room', room);
      socket.emit('connected');
    });
    socket.on('new message', (newMessageReceived: any) => {
      let chat = newMessageReceived.chatId;
      if (!chat) return console.log('Chat does not exist');
      socket.broadcast.to(chat).emit('message received', newMessageReceived);
    });
    socket.on('send block', (chatId: string) => {
      console.log("block received");
      socket.emit('block received', chatId);
    });
    socket.on('send unblock', (chatId: string) => {
      console.log('unblock received');
      socket.emit('unblock received', chatId);
    });
    socket.on('online', ()=>{
      // Keep alive
    })
  });
};
