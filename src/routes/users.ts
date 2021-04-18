import express, { Request, Response } from 'express';

import * as usersController from '../controllers/usersController';
import requireAuth from '../middlewares/require-auth';

const router = express.Router();

router.get('/', usersController.rootUserCheck);

router.get('/profile', requireAuth, usersController.getProfile);

router.post('/sessionLogin', usersController.sessionLogin);

router.post('/sessionLogout', usersController.sessionLogout);

router.get('/getAllWallpapers', usersController.getAllWallpapers);

router.get('/getAllThemes', usersController.getAllThemes);

router.post('/addWallpaper', usersController.addWallpaper);

router.post('/addTheme', usersController.addTheme);

router.put('/saveTheme/:id', requireAuth, usersController.saveThemeForUser);

router.put('/saveWallpaper/:id', requireAuth, usersController.saveWallpaperForUser);

export default router;
