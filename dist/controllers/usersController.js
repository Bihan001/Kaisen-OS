"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveWallpaperForUser = exports.saveThemeForUser = exports.getAllThemes = exports.addTheme = exports.getAllWallpapers = exports.addWallpaper = exports.sessionLogout = exports.getProfile = exports.sessionLogin = exports.rootUserCheck = void 0;
const firebase_admin_1 = __importDefault(require("../firebase-admin"));
const user_1 = __importDefault(require("../models/user"));
const response_handler_1 = require("../utils/response-handler");
const catch_async_1 = __importDefault(require("../utils/catch-async"));
const custom_error_1 = __importDefault(require("../errors/custom-error"));
const wallpaper_1 = __importDefault(require("../models/wallpaper"));
const theme_1 = __importDefault(require("../models/theme"));
const fs_1 = __importDefault(require("fs"));
const uuidv4_1 = require("uuidv4");
const sharp_1 = __importDefault(require("sharp"));
const bucket = firebase_admin_1.default.storage().bucket();
const firebaseUpload = (localFile, remoteFile) => __awaiter(void 0, void 0, void 0, function* () {
    const randId = uuidv4_1.uuid();
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
        return Promise.resolve('https://firebasestorage.googleapis.com/v0/b/' +
            bucket.name +
            '/o/' +
            encodeURIComponent(file.name) +
            '?alt=media&token=' +
            randId);
    });
});
exports.rootUserCheck = catch_async_1.default((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(200).json(response_handler_1.SuccessResponse({}, 'Users Route is up and running!'));
}));
exports.sessionLogin = catch_async_1.default((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const idToken = req.body.idToken.toString();
    // Set session expiration to 10 days.
    const expiresIn = 60 * 60 * 24 * 10 * 1000;
    /*
      Create the session cookie. This will also verify the ID token in the process. The session cookie will have
      the same claims as the ID token. To only allow session cookie setting on recent sign-in, auth_time in ID token
      can be checked to ensure user  was recently signed in before creating a session cookie.
      */
    const sessionCookie = yield firebase_admin_1.default.auth().createSessionCookie(idToken, { expiresIn });
    const options = { maxAge: expiresIn, httpOnly: true };
    res.cookie('session', sessionCookie, options);
    const idResults = yield firebase_admin_1.default.auth().verifyIdToken(idToken, true);
    let user = yield firebase_admin_1.default.auth().getUser(idResults.uid);
    let chkUser = yield user_1.default.findById(idResults.uid);
    if (!chkUser) {
        chkUser = new user_1.default({ _id: idResults.uid, name: user.displayName, email: user.email, displayImage: user.photoURL });
        yield chkUser.save();
    }
    chkUser.populate('wallpaper');
    return res.status(200).json(response_handler_1.SuccessResponse(chkUser, 'User logged in'));
}));
exports.getProfile = catch_async_1.default((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.user)
        return res.status(200).json(response_handler_1.SuccessResponse({ user: req.user.populate('wallpaper') }));
    return res.status(200).json(response_handler_1.SuccessResponse({ user: req.user }));
}));
exports.sessionLogout = catch_async_1.default((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const sessionCookie = req.cookies.session || '';
    res.clearCookie('session');
    const decodedClaims = yield firebase_admin_1.default.auth().verifySessionCookie(sessionCookie);
    yield firebase_admin_1.default.auth().revokeRefreshTokens(decodedClaims.sub);
    return res.status(200).json(response_handler_1.SuccessResponse({}, 'User logged out'));
}));
exports.addWallpaper = catch_async_1.default((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const wallpapers = req.files;
    // @ts-ignore
    wallpapers.map((wallpaper) => __awaiter(void 0, void 0, void 0, function* () {
        const { path, filename, destination } = wallpaper;
        const imageUrl = destination + '/' + 'webp-' + filename;
        const compressedImageUrl = destination + '/' + 'compressed-webp-' + filename;
        let tmpArr = filename.split('.');
        tmpArr.pop();
        const fileNameWebp = tmpArr.join('.') + '.webp';
        yield sharp_1.default(path).resize(1920, 1080, { fit: 'cover' }).webp({ quality: 90 }).toFile(imageUrl);
        yield sharp_1.default(path).resize(200, 200, { fit: 'cover' }).webp({ quality: 2 }).toFile(compressedImageUrl);
        const imgDownloadUrl = yield firebaseUpload(imageUrl, `wallpapers/webp-${fileNameWebp}`);
        const compressedImgDownloadUrl = yield firebaseUpload(compressedImageUrl, `wallpapers/compressed-webp-${fileNameWebp}`);
        const newWallpaper = new wallpaper_1.default({
            image: imgDownloadUrl,
            thumbnail: compressedImgDownloadUrl,
        });
        yield newWallpaper.save();
        fs_1.default.unlink(imageUrl, () => {
            fs_1.default.unlink(compressedImageUrl, () => {
                fs_1.default.unlink(path, () => {
                    console.log('Added', fileNameWebp);
                });
            });
        });
    }));
    // const newWallpaper = new Wallpaper({ image: wallpaper });
    // await newWallpaper.save();
    return res.status(200).json(response_handler_1.SuccessResponse({}, 'Adding wallpapers, check console'));
}));
exports.getAllWallpapers = catch_async_1.default((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const wallpapers = yield wallpaper_1.default.find({});
    return res.status(200).json(response_handler_1.SuccessResponse(wallpapers, 'Fetched all wallpapers'));
}));
exports.addTheme = catch_async_1.default((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const color = req.body.color;
    if (!color)
        throw new custom_error_1.default('Color field required', 400);
    const newTheme = new theme_1.default({ color });
    yield newTheme.save();
    return res.status(200).json(response_handler_1.SuccessResponse(newTheme, 'Wallpaper added'));
}));
exports.getAllThemes = catch_async_1.default((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const themes = yield theme_1.default.find({});
    return res.status(200).json(response_handler_1.SuccessResponse(themes, 'Fetched all themes'));
}));
exports.saveThemeForUser = catch_async_1.default((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const themeId = req.params.id;
    if (!req.user)
        throw new custom_error_1.default('Not authenticated', 403);
    yield user_1.default.findByIdAndUpdate(req.user.id, { theme: themeId });
    return res.status(200).json(response_handler_1.SuccessResponse({}, 'Saved theme'));
}));
exports.saveWallpaperForUser = catch_async_1.default((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const wallpaperId = req.params.id;
    if (!req.user)
        throw new custom_error_1.default('Not authenticated', 403);
    yield user_1.default.findByIdAndUpdate(req.user.id, { wallpaper: wallpaperId });
    return res.status(200).json(response_handler_1.SuccessResponse({}, 'Saved wallpaper'));
}));
