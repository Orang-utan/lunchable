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
    if (room.participants.length < targetMax && !room.completed) {
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
  if (!user) return errorHandler(res, 'User does not exist.');

  const maxParticipants = req.body.maxParticipants || 2; // if no arg, default to 2
  const rooms = await Room.find({});
  const roomToJoin = findAvailableRoom(rooms, maxParticipants);

  // if room available join, else create
  if (roomToJoin) {
    roomToJoin.participants.push(user.id);
    if (roomToJoin.participants.length + 1 >= roomToJoin.maxParticipants) {
      // TODO: if max capacity reached notify creator via socket notification
    }
    await roomToJoin.save();

    // update user
    user.pastLunches.push(roomToJoin.id);
    await user.save();

    return res
      .status(200)
      .json({ message: 'Joined Existing Room.', roomId: roomToJoin._id });
  }

  const newRoom = new Room({
    participants: [user.id],
    maxParticipants,
    creatorId: user.id,
  });
  await newRoom.save();

  // update user
  user.pastLunches.push(newRoom.id);
  await user.save();

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
  const roomUrl = `${CLIENT_URL}/lunch/${room.id}`;
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

  return res.status(200).json({ message: 'Match Cancelled' });
});

/* TESTING ENDPOINTS BELOW (DELETE IN PRODUCTION) */
/* fetch all rooms in database */
router.get('/', (_, res) => {
  Room.find({})
    .then((result) => res.status(200).json({ success: true, result }))
    .catch((e) => errorHandler(res, e));
});

/* delete all rooms in database */
router.delete('/', (_, res) => {
  Room.deleteMany({})
    .then(() => res.status(200).json({ success: true }))
    .catch((e) => errorHandler(res, e));
});

export default router;