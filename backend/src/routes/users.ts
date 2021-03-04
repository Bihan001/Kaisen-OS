import express, { Request, Response } from 'express';

import { rootUserCheck, sessionLogin, getProfile, sessionLogout } from '../controllers/usersController';
import requireAuth from '../middlewares/require-auth';

const router = express.Router();

router.get('/', rootUserCheck);

router.get('/profile', requireAuth, getProfile);

router.post('/sessionLogin', sessionLogin);

router.post('/sessionLogout', sessionLogout);

export default router;
