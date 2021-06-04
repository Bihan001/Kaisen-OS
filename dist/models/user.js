"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    _id: {
        // Firebase uid will be stored in _id
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
    },
    displayImage: {
        type: String,
        required: true,
        trim: true,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    lastOnline: {
        type: Date,
        default: Date.now,
    },
    wallpaper: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Wallpaper',
        default: null,
    },
    theme: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Theme',
    },
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
        },
    },
});
const User = mongoose_1.default.model('User', userSchema);
exports.default = User;
