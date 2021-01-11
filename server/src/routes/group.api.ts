import express from 'express';
import auth from '../middleware/auth';
import { Group, IGroup } from '../models/group.model';
import { User } from '../models/user.model';
import errorHandler from './error';

const router = express.Router();

/* admin group creation */
router.post('/create', auth, async (req, res) => {
  const { userId } = req;
  const user = await User.findById(userId);
  if (!userId || !user) return errorHandler(res, 'User does not exist.');
  if (user.role !== 'admin') return errorHandler(res, 'Unauthorizied request.');

  const { groupName } = req.body;
  const { groupCode } = req.body;

  const newGroup = new Group({ groupName, groupCode });
  await newGroup.save();

  return res.status(200).json({ message: 'Group created succesfully.' });
});

/* TESTING ENDPOINTS BELOW (DISABLED IN PRODUCTION) */
/* fetch all users in database */
router.get('/', (_, res) => {
  if (process.env.NODE_ENV !== 'development') {
    return errorHandler(res, 'Unauthorized request.');
  }

  return Group.find({})
    .then((result: IGroup[]) => res.status(200).json({ success: true, result }))
    .catch((e: Error) => errorHandler(res, e.message));
});

/* delete all users in database */
router.delete('/', (_, res) => {
  if (process.env.NODE_ENV !== 'development') {
    return errorHandler(res, 'Unauthorized request.');
  }

  return Group.deleteMany({})
    .then(() => res.status(200).json({ success: true }))
    .catch((e: Error) => errorHandler(res, e.message));
});

export default router;
