import { compare, hash } from 'bcrypt';
import express from 'express';
import auth from '../middleware/auth';
import { Room } from '../models/room.model';
import { Feedback } from '../models/feedback.model';
import { IUser, User } from '../models/user.model';
import { SocketBinding } from '../models/socket.model';
import { CLIENT_URL } from '../utils/config';
import errorHandler from './error';
import {
  generateAccessToken,
  generateRefreshToken,
  validateRefreshToken,
} from './user.util';

const router = express.Router();
const saltRounds = 10;

/* account signup endpoint */
router.post('/signup', async (req, res) => {
  const { firstName } = req.body;
  const { lastName } = req.body;
  const { email } = req.body;
  const { password } = req.body;

  if (await User.findOne({ email })) {
    return errorHandler(res, 'User already exists.');
  }

  // hash + salt password
  return hash(password, saltRounds, (err: Error, hashedPassword) => {
    if (err) {
      return errorHandler(res, err.message);
    }

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    return newUser
      .save()
      .then(() => res.status(200).json({ success: true }))
      .catch((e) => errorHandler(res, e.message));
  });
});

/* acccount login endpoint */
router.post('/login', async (req, res) => {
  const { email } = req.body;
  const { password } = req.body;

  const user = await User.findOne({ email });
  // user does not exist
  if (!user) return errorHandler(res, 'User does not exist.');

  return compare(password, user.password, (err, result) => {
    if (err) return errorHandler(res, err.message);

    if (result) {
      // password matched
      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);

      return Promise.all([accessToken, refreshToken]).then((tokens) =>
        res.status(200).json({
          success: true,
          accessToken: tokens[0],
          refreshToken: tokens[1],
        })
      );
    }

    // wrong password
    return errorHandler(res, 'User email or password is incorrect.');
  });
});

/** account jwt token refresh */
router.post('/refreshToken', (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return errorHandler(res, 'No token provided.');
  }

  return validateRefreshToken(refreshToken)
    .then((tokenResponse: IUser) => generateAccessToken(tokenResponse))
    .then((accessToken: string) => {
      res.status(200).json({
        success: true,
        accessToken,
      });
    })
    .catch((err: { code: string; message: string }) => {
      if (err.code) {
        return errorHandler(res, err.message, err.code);
      }
      return errorHandler(res, err.message);
    });
});

/** get my info */
router.get('/me', auth, (req, res) => {
  const { userId } = req;

  return User.findById(userId)
    .select('firstName lastName email _id matchStatus roomId')
    .then((user: any) => {
      if (!user) return errorHandler(res, 'User does not exist.');
      const roomUrl = `${CLIENT_URL}/rooms/${user.roomId}`;
      return res
        .status(200)
        .json({ success: true, data: { roomUrl, ...user._doc } });
    })
    .catch((err: Error) => errorHandler(res, err.message));
});

/**
 * get and maintain past lunches
 * */
router.get('/past-lunches', auth, async (req, res) => {
  const { userId } = req;
  const user = await User.findById(userId);
  if (!userId || !user) return errorHandler(res, 'User does not exist.');

  const foundRooms = await Room.find()
    .where('_id')
    .in(user.pastLunches)
    .select('_id participants timestamp creatorId')
    .exec();

  // maintain user past lunchees
  // delete from past lunch if not found in room collection
  let cleanedLunches = [];
  for (const room of foundRooms) {
    if (user.pastLunches.includes(room._id)) {
      cleanedLunches.push(room._id);
    }
  }

  user.pastLunches = cleanedLunches;
  await user.save();

  return res
    .status(200)
    .json({ message: 'Past Lunches found succesfully.', lunches: foundRooms });
});

/**
 * posting feedback
 */
router.post('/feedback', auth, async (req, res) => {
  const { userId } = req;
  const user = await User.findById(userId);
  if (!userId || !user) return errorHandler(res, 'User does not exist.');
  const { feedback } = req.body;

  try {
    const newFeedback = new Feedback({ creatorId: userId, feedback });
    await newFeedback.save();
  } catch (err) {
    return errorHandler(res, 'Invalid feedback.');
  }

  return res.status(200).json({ message: 'Feedback posted succesfully.' });
});

/**
 *  TODO: get lunch statistics
 *  # matches in past week, # of minutes spent
 */
router.get('/statistics', auth, async (_, res) => {
  return res.status(200).json({ matches: 8, minutesSpent: 124 });
});

/**
 * get number of people online now
 * note: just count number of socket bindings
 */
router.get('/online', auth, async (_, res) => {
  const number = await SocketBinding.countDocuments();
  return res.status(200).json({ onlineUsers: number });
});

/* TESTING ENDPOINTS BELOW (DISABLED IN PRODUCTION) */
/* fetch all users in database */
router.get('/', (_, res) => {
  if (process.env.NODE_ENV !== 'development') {
    return errorHandler(res, 'Unauthorized request.');
  }

  return User.find({})
    .then((result: IUser[]) => res.status(200).json({ success: true, result }))
    .catch((e: Error) => errorHandler(res, e.message));
});

/* delete all users in database */
router.delete('/', (_, res) => {
  if (process.env.NODE_ENV !== 'development') {
    return errorHandler(res, 'Unauthorized request.');
  }

  return User.deleteMany({})
    .then(() => res.status(200).json({ success: true }))
    .catch((e: Error) => errorHandler(res, e.message));
});

export default router;
