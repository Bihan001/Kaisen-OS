import express, { Request, Response } from 'express';
import admin from '../firebase-admin';
import User from '../models/user';
import { SuccessResponse, ErrorResponse } from '../utils/response-handler';
import catchAsync from '../utils/catch-async';
import CustomError from '../errors/custom-error';
import Wallpaper from '../models/wallpaper';
import Theme from '../models/theme';
import fs from 'fs';
import { uuid } from 'uuidv4';
import sharp from 'sharp';

const bucket = admin.storage().bucket();

const firebaseUpload = async (localFile: string, remoteFile: string) => {
  const randId = uuid();
  return bucket
    .upload(localFile, {
      destination: remoteFile,
      public: true,
      metadata: {
        metadata: {
          firebaseStorageDownloadTokens: randId,
        },
      },
    })
    .then((data) => {
      let file = data[0];
      return Promise.resolve(
        'https://firebasestorage.googleapis.com/v0/b/' +
          bucket.name +
          '/o/' +
          encodeURIComponent(file.name) +
          '?alt=media&token=' +
          randId
      );
    });
};

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
  const wallpapers = req.files;
  // @ts-ignore
  wallpapers.map(async (wallpaper) => {
    const { path, filename, destination } = wallpaper;

    const imageUrl = destination + '/' + 'webp-' + filename;
    const compressedImageUrl = destination + '/' + 'compressed-webp-' + filename;

    let tmpArr = filename.split('.');
    tmpArr.pop();
    const fileNameWebp = tmpArr.join('.') + '.webp';

    await sharp(path).resize(1920, 1080, { fit: 'cover' }).webp({ quality: 90 }).toFile(imageUrl);
    await sharp(path).resize(200, 200, { fit: 'cover' }).webp({ quality: 2 }).toFile(compressedImageUrl);

    const imgDownloadUrl = await firebaseUpload(imageUrl, `wallpapers/webp-${fileNameWebp}`);
    const compressedImgDownloadUrl = await firebaseUpload(
      compressedImageUrl,
      `wallpapers/compressed-webp-${fileNameWebp}`
    );

    const newWallpaper = new Wallpaper({
      image: imgDownloadUrl,
      thumbnail: compressedImgDownloadUrl,
    });

    await newWallpaper.save();

    fs.unlink(imageUrl, () => {
      fs.unlink(compressedImageUrl, () => {
        fs.unlink(path, () => {
          console.log('Added', fileNameWebp);
        });
      });
    });
  });
  // const newWallpaper = new Wallpaper({ image: wallpaper });
  // await newWallpaper.save();
  return res.status(200).json(SuccessResponse({}, 'Adding wallpapers, check console'));
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
