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

// Deploy Dummy Frontend
// Serving static files
if (process.env.NODE_ENV === 'production') {
  app.get('*', (_, res) => {
    res.send("👀 You've reached Lunchable's API server.");
  });
}

// Creating the HTTP server
export const server = http.createServer(app);
// Setting up socket server
export const io = new socketio.Server(server, { cors: { origin: true } });

io.on('connection', (socket: Socket) => {
  console.log(`Socket ${socket.id} connected...`);

  socket.on('disconnect', () => {
    socket.broadcast.emit('user left', socket.id);
  });
});
