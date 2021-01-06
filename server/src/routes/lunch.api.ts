import express from 'express';
import auth from '../middleware/auth';
import { IRoom, Room } from '../models/room.model';
import { User } from '../models/user.model';
import errorHandler from './error';

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
  if (!user) return errorHandler(res, 'User does not exist.');

  // if no arg, default to 2
  const maxParticipants = req.body.maxParticipants || 2;
  const rooms = await Room.find({});
  const roomToJoin = findAvailableRoom(rooms, maxParticipants);

  // if room available join, else create
  if (roomToJoin) {
    roomToJoin.participants.push(user.id);
    await roomToJoin.save();
    // TODO: if max capacity reached notify creator
    return res
      .status(200)
      .json({ message: 'Match Found', roomId: roomToJoin._id });
  }

  const newRoom = new Room({
    participants: [user.id],
    maxParticipants,
    creatorId: user.id,
  });

  await newRoom.save();
  return res.status(200).json({
    message: 'No Available Rooms. Created a Room.',
    roomId: newRoom._id,
  });
});

/**
 * Cancel Match
 */
router.post('/cancel', auth, (req, res) => {
  return res.status(200).json({ message: 'Match Cancelled' });
});

/**
 * Get Status of Match
 */
router.post('/status', auth, (req, res) => {
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
