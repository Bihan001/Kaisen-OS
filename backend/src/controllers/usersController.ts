import express, { Request, Response } from 'express';
import admin from '../firebase-admin';
import User from '../models/user';
import { SuccessResponse, ErrorResponse } from '../utils/response-handler';
import catchAsync from '../utils/catch-async';

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
  return res.status(200).json(SuccessResponse(chkUser, 'User logged in'));
});

export const getProfile = catchAsync(async (req: Request, res: Response) => {
  return res.status(200).json(SuccessResponse({ user: req.user }));
});

export const sessionLogout = catchAsync(async (req: Request, res: Response) => {
  const sessionCookie = req.cookies.session || '';
  res.clearCookie('session');
  const decodedClaims = await admin.auth().verifySessionCookie(sessionCookie);
  await admin.auth().revokeRefreshTokens(decodedClaims.sub);
  return res.status(200).json(SuccessResponse({}, 'User logged out'));
});
