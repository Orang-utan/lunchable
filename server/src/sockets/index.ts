import socket from 'socket.io';
import { SocketBinding } from '../models/socket.model';

export const onConnection = (client: socket.Socket, server: socket.Server) => {
  console.log(`✅ Client ${client.id} Connected...`);
  console.log(server.encoder);

  client.on('bindUID', async (payload: any) => {
    console.log('Bind UID to Socket');
    const { _id: userId } = payload;
    const socketId = client.id;

    if (!userId) {
      console.log(payload);
      console.log('Error: Invalid payload.');
      return;
    }

    console.log('Created New Socket Binding');
    const newSocket = new SocketBinding({
      userId: userId,
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
