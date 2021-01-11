import express from 'express';
import auth from '../middleware/auth';
import { IRoom, Room } from '../models/room.model';
import { User, IUser } from '../models/user.model';
import errorHandler from './error';
import { CLIENT_URL, DAILY_API_KEY } from '../utils/config';
import axios from 'axios';

const router = express.Router();

/***************************/
// Utility functions below //
/***************************/

/**
 * @param rooms: list of all rooms
 * @param targetMax: max number of participants user desires
 * @param user: the user who is trying to find
 */
async function findAvailableRoom(
  rooms: IRoom[],
  targetMax: number,
  user: IUser
): Promise<IRoom | null> {
  let resultRoom = null;
  for (const room of rooms) {
    // check if creator is the same or target has been recached
    if (room.creatorId === user._id || room.participants.length >= targetMax)
      continue;
    // check if creator and user are in overlapping groups
    const creator = await User.findById(room.creatorId);
    if (!creator) continue;
    const creatorGroup = creator.groupBelongedTo;
    const userGroup = user.groupBelongedTo;
    const intersection = creatorGroup.filter((cGroup: string) =>
      userGroup.includes(cGroup)
    );
    if (intersection.length < 1) continue;

    // all check has passed, assign room and break!
    resultRoom = room;
    break;
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

  // TODO: implement anti trolling measures here

  const maxParticipants = req.body.maxParticipants || 2; // if no arg, default to 2
  const rooms = await Room.find({});
  const roomToJoin = await findAvailableRoom(rooms, maxParticipants, user);

  // compressed version to store in room
  const compressedUser = {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
  };

  // if room available join, then join
  if (roomToJoin) {
    roomToJoin.participants.push(compressedUser);
    await roomToJoin.save();

    // defensively update everyone's status to matched
    for (const { id: pid } of roomToJoin.participants) {
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
    participants: [compressedUser],
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
    axios({
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
    console.error(err);
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
  const roomUrl = `${CLIENT_URL}/rooms/${room.id}`;

  // no one in room except
  if (room.participants.length <= 1)
    return res
      .status(200)
      .json({ message: 'Room is still empty.', fulfilled: false, roomUrl });

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
  if (!roomId) return errorHandler(res, 'No Room ID provided. ');

  let room;
  try {
    room = await Room.findById(roomId);
    if (!room)
      return errorHandler(res, 'Invalid Room ID. User status was reset.');
  } catch (err) {
    return errorHandler(res, 'Invalid Room ID. User status was reset.');
  }

  if (room.completed)
    return res
      .status(200)
      .json({ message: 'Unable to cancel: lunch already happened.' });

  // defensively reset everyone's status
  for (const { id: pid } of room.participants) {
    const participant = await User.findById(pid);
    if (!participant) continue;
    participant.roomId = null;
    participant.matchStatus = 'rest';
    await participant.save();
  }

  // only delete room if user is creator
  // delete room on daily and database
  if (room.creatorId === userId) {
    try {
      axios({
        url: `https://api.daily.co/v1/rooms/${roomId}`,
        method: 'DELETE',
        timeout: 0,
        headers: {
          Authorization: `Bearer ${DAILY_API_KEY}`,
        },
      });
    } catch (err) {
      console.error(err);
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
  for (const { id: pid } of room.participants) {
    const participant = await User.findById(pid);
    if (!participant) continue;
    participant.pastLunches.push(roomId);
    participant.matchStatus = 'rest';
    participant.roomId = null;
    await participant.save();
  }

  // delete daily room
  try {
    axios({
      url: `https://api.daily.co/v1/rooms/${roomId}`,
      method: 'DELETE',
      timeout: 0,
      headers: {
        Authorization: `Bearer ${DAILY_API_KEY}`,
      },
    });
  } catch (err) {
    console.error(err);
  }

  return res.status(200).json({ message: 'Room is completed now.' });
});

/* TESTING ENDPOINTS BELOW (DISABLED IN PRODUCTION) */
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
