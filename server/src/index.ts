import './utils/config';
import db from './utils/database';
import { app } from './server';
import http from 'http';
import socketio, { Socket } from 'socket.io';
import { onConnection } from './sockets/index';
import { initializeAdmin } from './loader';

const main = async () => {
  // listen for termination
  process.on('SIGTERM', () => process.exit());
  await db.open();

  // initialize data
  initializeAdmin();

  // Creating the HTTP server
  const server = http.createServer(app);
  const port = process.env.PORT || 5000;

  server.listen(port, () => {
    console.log(`🚀 Listening on port ${port}`);
    console.log('  Press Ctrl+C to stop\n');
  });

  // Setting up socket server
  const io = new socketio.Server(server, { cors: { origin: true } });
  io.on('connection', (socket: Socket) => onConnection(socket, io));
};

main();
