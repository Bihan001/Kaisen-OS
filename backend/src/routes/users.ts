import express, { Request, Response } from 'express';

import { rootUserCheck, sessionLogin, getProfile, sessionLogout } from '../controllers/usersController';

const router = express.Router();

router.get('/', rootUserCheck);

router.get('/profile', getProfile);

router.post('/sessionLogin', sessionLogin);

router.post('/sessionLogout', sessionLogout);

export default router;
