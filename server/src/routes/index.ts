import express from 'express';

import lunch from './lunch.api';
import users from './user.api';

const router = express.Router();
router.use('/users', users);
router.use('/lunches', lunch);

export default router;
