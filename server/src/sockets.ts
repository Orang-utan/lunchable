import { Socket } from 'socket.io';
import { verify } from 'jsonwebtoken';
import { JWT_SECRET } from './utils/config';

// const users: any = {};
// const socketToRoom: any = {};

// Add listeners for socket connections here. This should include authorization messages,
// as well as things like real-time chat. However, for basic mutations, prefer to use
// the HTTP API instead.

const onConnection = (socket: Socket): void => {
  console.log(`Socket ${socket.id} connected...`);

  // If a user is logged in, they should send an initial authorization message with their
  // bearer token, which can be initially validated here. Then, they are added to a room
  // corresponding to their verified user ID.
  //
  // Example (client code):
  // ```
  // socket.on("connect", () => {
  //  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6...";
  //  socket.emit("authorization", token);
  // });
  // ```
  //
  // The client should also handle "authorization" messages from the server, which provide
  // a status ("success" | "failure") and message fields.
  socket.on('authorization', async (token) => {
    try {
      const decoded = verify(token, JWT_SECRET);
      const payload = decoded as { userId: string };
      if (!payload || typeof payload.userId !== 'string') {
        throw Error('Invalid payload');
      }
      socket.join(payload.userId);
      console.log(
        `Socket ${socket.id} authenticated with token as ${payload.userId}`
      );
      socket.emit('authorization', {
        status: 'success',
        message: 'Socket successfully authorized with the server',
      });
    } catch (error) {
      console.log(`Socket ${socket.id} failed to authenticate`);
      socket.emit('authorization', {
        status: 'failure',
        message: 'Invalid authorization token',
      });
    }
  });
};

export default onConnection;
