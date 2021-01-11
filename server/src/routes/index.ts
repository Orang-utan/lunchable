import express from 'express';

import lunches from './lunch.api';
import users from './user.api';
import groups from './group.api';

const router = express.Router();
router.use('/users', users);
router.use('/lunches', lunches);
router.use('/groups', groups);

export default router;
