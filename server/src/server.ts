import cors from 'cors';
import express from 'express';
import http from 'http';
import socketio from 'socket.io';

import routes from './routes';
import onConnection from './sockets';

export const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// API Routes
app.use('/api', routes);

// Creating the HTTP server
export const server = http.createServer(app);

// Setting up socket server
export const io = new socketio.Server(server, { cors: { origin: true } });
io.on('connection', onConnection);
