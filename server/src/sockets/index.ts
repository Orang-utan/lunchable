import socket from 'socket.io';
import { SocketBinding } from '../models/socket.model';

export const onConnection = (client: socket.Socket, _: socket.Server) => {
  console.log(`✅ Client ${client.id} Connected...`);

  client.on('bindUID', async (payload: any) => {
    console.log('Bind UID to Socket');
    const { _id: userId } = payload;
    const socketId = client.id;

    if (!userId) {
      console.error('Error: Invalid payload.');
      return;
    }

    const newSocket = new SocketBinding({
      userId,
      socketId,
    });
    await newSocket.save();
  });

  client.on('unbindUID', async () => {
    console.log('Unbind UID to Socket');
    // clean up all stale binding
    await SocketBinding.deleteOne({
      socketId: client.id,
    });
  });

  client.on('disconnect', async () => {
    console.log(`🛑 Client ${client.id} Disconnected...`);
    // clean up all stale binding
    await SocketBinding.deleteOne({
      socketId: client.id,
    });
  });
};
