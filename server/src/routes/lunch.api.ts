import express from 'express';
import auth from '../middleware/auth';
import { IRoom, Room } from '../models/room.model';
import { User } from '../models/user.model';
import errorHandler from './error';
import { CLIENT_URL, DAILY_API_KEY } from '../utils/config';
import axios from 'axios';

const router = express.Router();

/***************************/
// Utility functions below
/***************************/
function findAvailableRoom(
  rooms: IRoom[],
  targetMax: number,
  uid: string
): IRoom | null {
  let resultRoom = null;
  for (const room of rooms) {
    // TODO: check if any participants belong to same group / are friends
    // check if room is not max & creator is not the same as current user
    if (room.participants.length < targetMax && room.creatorId !== uid) {
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
  // if user is matched or searching, do not find new match!
  if (user.matchStatus === 'matched' || user.matchStatus === 'searching')
    return errorHandler(res, 'User is currently matched or still searching.');

  const maxParticipants = req.body.maxParticipants || 2; // if no arg, default to 2
  const rooms = await Room.find({});
  const roomToJoin = findAvailableRoom(rooms, maxParticipants, userId);

  // if room available join, then join
  if (roomToJoin) {
    roomToJoin.participants.push(user.id);
    await roomToJoin.save();

    // defensively update everyone's status to matched
    for (const pid of roomToJoin.participants) {
      const participant = await User.findById(pid);
      if (!participant) continue;
      participant.matchStatus = 'matched';
      participant.roomId = roomToJoin.id;
      await participant.save();
    }

    const roomUrl = `${CLIENT_URL}/rooms/${roomToJoin._id}`;
    return res.status(200).json({
      message: 'Joining Existing Room.',
      roomId: roomToJoin._id,
      roomUrl,
    });
  }

  // else create a new room
  const newRoom = new Room({
    participants: [user.id],
    maxParticipants,
    creatorId: user.id,
  });
  await newRoom.save();
  // update user state
  user.matchStatus = 'searching';
  user.roomId = newRoom.id;
  await user.save();

  // create video room in daily api
  try {
    await axios({
      url: 'https://api.daily.co/v1/rooms',
      method: 'POST',
      timeout: 0,
      headers: {
        Authorization: `Bearer ${DAILY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      data: JSON.stringify({ name: newRoom.id }),
    });
  } catch (err) {
    console.log(err);
  }

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
  if (!roomId) return errorHandler(res, 'No Room ID provided.');

  const room = await Room.findById(roomId);
  if (!room) return errorHandler(res, 'Invalid Room ID provided.');

  // no one in room except
  if (room.participants.length <= 1)
    return res
      .status(200)
      .json({ message: 'Room is still empty.', fulfilled: false });

  const roomUrl = `${CLIENT_URL}/rooms/${room.id}`;
  return res.status(200).json({
    message: 'Room is ready. More than one person has joined.',
    fulfilled: true,
    roomUrl,
  });
});

/**
 * Cancel Match Search
 */
router.post('/cancel/:roomId', auth, async (req, res) => {
  const { userId } = req;
  const user = await User.findById(userId);
  if (!user) return errorHandler(res, 'User does not exist.');
  if (user.matchStatus === 'matched')
    return errorHandler(res, 'Unable to cancel: user matched already.');

  // reset anyways
  user.matchStatus = 'rest';
  user.roomId = null;
  await user.save();

  const roomId = req.params.roomId;
  if (!roomId) return errorHandler(res, 'No Room ID provided.');

  const room = await Room.findById(roomId);
  if (!room) return errorHandler(res, 'Invalid Room ID provided.');

  if (room.completed)
    return res
      .status(200)
      .json({ message: 'Unable to cancel: lunch already happened.' });

  // defensively update everyone's status
  for (const pid of room.participants) {
    const participant = await User.findById(pid);
    if (!participant) continue;
    participant.roomId = null;
    participant.matchStatus = 'rest';
    await participant.save();
  }

  // only delete room if user is creator
  if (room.creatorId === userId) {
    // delete daily room
    try {
      await axios({
        url: `https://api.daily.co/v1/rooms/${roomId}`,
        method: 'DELETE',
        timeout: 0,
        headers: {
          Authorization: `Bearer ${DAILY_API_KEY}`,
        },
      });
    } catch (err) {
      console.log(err);
    }

    await Room.findByIdAndDelete(roomId);
    return res
      .status(200)
      .json({ message: 'Room is now deleted, your search is cancelled.' });
  }

  return res
    .status(200)
    .json({ message: 'Room still exist, please cancel search on the client.' });
});

/**
 * Complete Match after video chat
 */
router.post('/complete/:roomId', auth, async (req, res) => {
  const { userId } = req;
  const user = await User.findById(userId);
  if (!user) return errorHandler(res, 'User does not exist.');
  if (user.matchStatus === 'searching')
    return errorHandler(res, 'Unable to complete: user is still searching.');

  // reset anyways
  user.matchStatus = 'rest';
  user.roomId = null;
  await user.save();

  const roomId = req.params.roomId;
  if (!roomId) return errorHandler(res, 'No Room ID. User status was reset.');

  let room;
  try {
    room = await Room.findById(roomId);
  } catch (err) {
    return errorHandler(res, 'Invalid Room ID. User status was reset.');
  }

  if (!room)
    return errorHandler(res, 'Invalid Room ID. User status was reset.');

  room.completed = true;
  await room.save();

  // set room to past lunches
  for (const pid of room.participants) {
    const participant = await User.findById(pid);
    if (!participant) continue;
    participant.pastLunches.push(roomId);
    participant.matchStatus = 'rest';
    participant.roomId = null;
    await participant.save();
  }

  // delete daily room
  try {
    await axios({
      url: `https://api.daily.co/v1/rooms/${roomId}`,
      method: 'DELETE',
      timeout: 0,
      headers: {
        Authorization: `Bearer ${DAILY_API_KEY}`,
      },
    });
  } catch (err) {
    console.log(err);
  }

  return res.status(200).json({ message: 'Room is completed now.' });
});

/* TESTING ENDPOINTS BELOW */
/* fetch all rooms in database */
router.get('/', (_, res) => {
  if (process.env.NODE_ENV !== 'development') {
    return errorHandler(res, 'Unauthorized request.');
  }

  return Room.find({})
    .then((result: IRoom[]) => res.status(200).json({ success: true, result }))
    .catch((e: Error) => errorHandler(res, e.message));
});

/* delete all rooms in database */
router.delete('/', (_, res) => {
  if (process.env.NODE_ENV !== 'development') {
    return errorHandler(res, 'Unauthorized request.');
  }

  return Room.deleteMany({})
    .then(() => res.status(200).json({ success: true }))
    .catch((e: Error) => errorHandler(res, e.message));
});

export default router;
