import express, { Request, Response } from 'express';
import admin from '../firebase-admin';
import User from '../models/user';
import { SuccessResponse, ErrorResponse } from '../utils/response-handler';
import catchAsync from '../utils/catch-async';
import CustomError from '../errors/custom-error';
import Wallpaper from '../models/wallpaper';
import Theme from '../models/theme';

export const rootUserCheck = catchAsync(async (req: Request, res: Response) => {
  res.status(200).json(SuccessResponse({}, 'Users Route is up and running!'));
});

export const sessionLogin = catchAsync(async (req: Request, res: Response) => {
  const idToken = req.body.idToken.toString();
  // Set session expiration to 10 days.
  const expiresIn = 60 * 60 * 24 * 10 * 1000;
  /* 
    Create the session cookie. This will also verify the ID token in the process. The session cookie will have 
    the same claims as the ID token. To only allow session cookie setting on recent sign-in, auth_time in ID token 
    can be checked to ensure user  was recently signed in before creating a session cookie. 
    */
  const sessionCookie = await admin.auth().createSessionCookie(idToken, { expiresIn });
  const options = { maxAge: expiresIn, httpOnly: true };
  res.cookie('session', sessionCookie, options);
  const idResults = await admin.auth().verifyIdToken(idToken, true);
  let user = await admin.auth().getUser(idResults.uid);
  let chkUser = await User.findById(idResults.uid);
  if (!chkUser) {
    chkUser = new User({ _id: idResults.uid, name: user.displayName, email: user.email, displayImage: user.photoURL });
    await chkUser.save();
  }
  chkUser.populate('wallpaper');
  return res.status(200).json(SuccessResponse(chkUser, 'User logged in'));
});

export const getProfile = catchAsync(async (req: Request, res: Response) => {
  if (req.user) return res.status(200).json(SuccessResponse({ user: req.user.populate('wallpaper') }));

  return res.status(200).json(SuccessResponse({ user: req.user }));
});

export const sessionLogout = catchAsync(async (req: Request, res: Response) => {
  const sessionCookie = req.cookies.session || '';
  res.clearCookie('session');
  const decodedClaims = await admin.auth().verifySessionCookie(sessionCookie);
  await admin.auth().revokeRefreshTokens(decodedClaims.sub);
  return res.status(200).json(SuccessResponse({}, 'User logged out'));
});

export const addWallpaper = catchAsync(async (req: Request, res: Response) => {
  const wallpaper: string = req.body.wallpaper;
  if (!wallpaper) throw new CustomError('Wallpaper field required', 400);
  const newWallpaper = new Wallpaper({ image: wallpaper });
  await newWallpaper.save();
  return res.status(200).json(SuccessResponse(newWallpaper, 'Wallpaper added'));
});

export const getAllWallpapers = catchAsync(async (req: Request, res: Response) => {
  const wallpapers = await Wallpaper.find({});
  return res.status(200).json(SuccessResponse(wallpapers, 'Fetched all wallpapers'));
});

export const addTheme = catchAsync(async (req: Request, res: Response) => {
  const color: string = req.body.color;
  if (!color) throw new CustomError('Color field required', 400);
  const newTheme = new Theme({ color });
  await newTheme.save();
  return res.status(200).json(SuccessResponse(newTheme, 'Wallpaper added'));
});

export const getAllThemes = catchAsync(async (req: Request, res: Response) => {
  const themes = await Theme.find({});
  return res.status(200).json(SuccessResponse(themes, 'Fetched all themes'));
});

export const saveThemeForUser = catchAsync(async (req: Request, res: Response) => {
  const themeId: string = req.params.id;
  if (!req.user) throw new CustomError('Not authenticated', 403);
  await User.findByIdAndUpdate(req.user.id, { theme: themeId });
  return res.status(200).json(SuccessResponse({}, 'Saved theme'));
});

export const saveWallpaperForUser = catchAsync(async (req: Request, res: Response) => {
  const wallpaperId: string = req.params.id;
  if (!req.user) throw new CustomError('Not authenticated', 403);
  await User.findByIdAndUpdate(req.user.id, { wallpaper: wallpaperId });
  return res.status(200).json(SuccessResponse({}, 'Saved wallpaper'));
});
