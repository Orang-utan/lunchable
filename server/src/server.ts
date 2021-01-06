import cors from 'cors';
import express from 'express';
import http from 'http';
import socketio, { Socket } from 'socket.io';

import routes from './routes';

export const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// API Routes
app.use('/api', routes);

const users: any = {};
const socketToRoom: any = {};

// Creating the HTTP server
export const server = http.createServer(app);
// Setting up socket server
export const io = new socketio.Server(server, { cors: { origin: true } });

io.on('connection', (socket: Socket) => {
  console.log(`Socket ${socket.id} connected...`);

  socket.on('join room', (roomID) => {
    if (users[roomID]) {
      const length = users[roomID].length;
      if (length === 4) {
        socket.emit('room full');
        return;
      }
      users[roomID].push(socket.id);
    } else {
      users[roomID] = [socket.id];
    }
    socketToRoom[socket.id] = roomID;
    const usersInThisRoom = users[roomID].filter(
      (id: string) => id !== socket.id
    );

    socket.emit('all users', usersInThisRoom);
  });

  socket.on('sending signal', (payload) => {
    io.to(payload.userToSignal).emit('user joined', {
      signal: payload.signal,
      callerID: payload.callerID,
    });
  });

  socket.on('returning signal', (payload) => {
    io.to(payload.callerID).emit('receiving returned signal', {
      signal: payload.signal,
      id: socket.id,
    });
  });

  socket.on('disconnect', () => {
    const roomID = socketToRoom[socket.id];
    let room = users[roomID];
    if (room) {
      room = room.filter((id: string) => id !== socket.id);
      users[roomID] = room;
    }
    socket.broadcast.emit('user left', socket.id);
  });
});
