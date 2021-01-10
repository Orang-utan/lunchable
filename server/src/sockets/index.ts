import socket from 'socket.io';
import schedule from 'node-schedule';
import { SocketBinding } from '../models/socket.model';

export const onConnection = (client: socket.Socket, io: socket.Server) => {
  console.log(`✅ Client ${client.id} Connected...`);

  // scheduler
  // minute, hour, day of month, month, day of week
  schedule.scheduleJob('* 12 * * *', function () {
    io.emit('newNotification', {
      title: "It's Lunchtime!",
      message: 'Open Lunchable to reconnect with a friend over lunch 🌟',
    });
  });

  client.on('bindUID', async (payload: any) => {
    console.log('Bind UID to Socket');
    const { _id: userId } = payload;
    const socketId = client.id;

    if (!userId) {
      console.error('Error: Invalid payload.');
      return;
    }

    const existingSocket = await SocketBinding.findOne({ userId });
    if (existingSocket) {
      existingSocket.socketId = socketId;
      await existingSocket.save();
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
