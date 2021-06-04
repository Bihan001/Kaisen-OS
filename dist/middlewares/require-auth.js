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
const firebase_admin_1 = __importDefault(require("../firebase-admin"));
const user_1 = __importDefault(require("../models/user"));
const requireAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sessionCookie = req.cookies.session || '';
        // Verify the session cookie. In this case an additional check is added to detect
        // if the user's Firebase session was revoked, user deleted/disabled, etc.
        const decodedClaims = yield firebase_admin_1.default.auth().verifySessionCookie(sessionCookie, true /** checkRevoked */);
        const user = yield user_1.default.findById(decodedClaims.uid);
        req.user = user || undefined;
        next();
    }
    catch (err) {
        next(err);
    }
});
exports.default = requireAuth;
