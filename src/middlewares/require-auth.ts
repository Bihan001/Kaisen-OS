import { Request, Response, NextFunction } from 'express';
import CustomError from '../errors/custom-error';
import admin from '../firebase-admin';
import User from '../models/user';

const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sessionCookie = req.cookies.session || '';
    // Verify the session cookie. In this case an additional check is added to detect
    // if the user's Firebase session was revoked, user deleted/disabled, etc.
    const decodedClaims = await admin.auth().verifySessionCookie(sessionCookie, true /** checkRevoked */);
    const user = await User.findById(decodedClaims.uid);
    req.user = user || undefined;
    next();
  } catch (err) {
    next(err);
  }
};

export default requireAuth;
