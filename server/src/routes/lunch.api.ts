import express from 'express';
import auth from '../middleware/auth';
import { IRoom, Room } from '../models/room.model';
import { User } from '../models/user.model';
import errorHandler from './error';
import { CLIENT_URL } from '../utils/config';

const router = express.Router();

/***************************/
// Utility functions below
/***************************/
function findAvailableRoom(rooms: IRoom[], targetMax: number): IRoom | null {
  let resultRoom = null;
  for (const room of rooms) {
    // TODO: check if any participants belong to same group / are friends
    if (room.participants.length < targetMax) {
      resultRoom = room;
      break;
    }
  }

  return resultRoom;
}

/**
 * Find Lunch Matches
 */
router.post('/find', auth, async (req, res) => {
  const { userId } = req;
  const user = await User.findById(userId);
  if (!userId || !user) return errorHandler(res, 'User does not exist.');

  const maxParticipants = req.body.maxParticipants || 2; // if no arg, default to 2
  const rooms = await Room.find({});
  const roomToJoin = findAvailableRoom(rooms, maxParticipants);

  // if room available join, else create
  if (roomToJoin) {
    roomToJoin.participants.push(user.id);
    await roomToJoin.save();

    // TODO: frontend is not ready yet lol
    const roomUrl = `${CLIENT_URL}/rooms/${roomToJoin._id}`;

    return res.status(200).json({
      message: 'Joining Existing Room.',
      roomId: roomToJoin._id,
      roomUrl,
    });
  }

  const newRoom = new Room({
    participants: [user.id],
    maxParticipants,
    creatorId: user.id,
  });
  await newRoom.save();

  return res.status(200).json({
    message: 'No Available Rooms. Created New Room.',
    roomId: newRoom._id,
  });
});

/**
 * Get Status of Match
 */
router.get('/status/:roomId', auth, async (req, res) => {
  const { userId } = req;
  const user = await User.findById(userId);
  if (!user) return errorHandler(res, 'User does not exist.');

  const roomId = req.params.roomId;
  if (!roomId) return errorHandler(res, 'No Match ID provided.');

  const room = await Room.findById(roomId);
  if (!room) return errorHandler(res, 'Invalid Match ID provided.');

  // no one in room except
  if (room.participants.length <= 1)
    return res
      .status(200)
      .json({ message: 'Room is still empty.', completed: false });

  // TODO: frontend is not ready yet lol
  const roomUrl = `${CLIENT_URL}/rooms/${room.id}`;
  return res.status(200).json({
    message: 'Room is ready. More than one person has joined.',
    completed: true,
    roomUrl,
  });
});

/**
 * Cancel Match
 */
router.post('/cancel/:roomId', auth, async (req, res) => {
  const { userId } = req;
  const user = await User.findById(userId);
  if (!user) return errorHandler(res, 'User does not exist.');

  const roomId = req.params.roomId;
  if (!roomId) return errorHandler(res, 'No Room ID provided.');

  const room = await Room.findById(roomId);
  if (!room) return errorHandler(res, 'Invalid Room ID provided.');

  if (room.completed)
    return res
      .status(200)
      .json({ message: 'Cannot cancel room because lunch already happened.' });

  await Room.findByIdAndDelete(roomId);
  return res.status(200).json({ message: 'Match Cancelled' });
});

/**
 * Complete Match after video chat
 */
router.post('/complete/:roomId', auth, async (req, res) => {
  const { userId } = req;
  const user = await User.findById(userId);
  if (!user) return errorHandler(res, 'User does not exist.');

  const roomId = req.params.roomId;
  if (!roomId) return errorHandler(res, 'No Room ID provided.');

  const room = await Room.findById(roomId);
  if (!room) return errorHandler(res, 'Invalid Room ID provided.');

  room.completed = false;
  await room.save();

  // once room to past lunches
  for (const pid of room.participants) {
    const participant = await User.findById(pid);
    if (!participant) continue;
    participant.pastLunches.push(roomId);
    await participant.save();
  }

  return res.status(200).json({ message: 'Match Cancelled' });
});

/* TESTING ENDPOINTS BELOW (DELETE IN PRODUCTION) */
/* fetch all rooms in database */
router.get('/', (_, res) => {
  Room.find({})
    .then((result: IRoom[]) => res.status(200).json({ success: true, result }))
    .catch((e: Error) => errorHandler(res, e.message));
});

/* delete all rooms in database */
router.delete('/', (_, res) => {
  Room.deleteMany({})
    .then(() => res.status(200).json({ success: true }))
    .catch((e: Error) => errorHandler(res, e.message));
});

export default router;
