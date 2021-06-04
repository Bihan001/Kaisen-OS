"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const wallpaperSchema = new mongoose_1.default.Schema({
    image: {
        type: String,
        required: true,
        trim: true,
    },
    thumbnail: {
        type: String,
        required: true,
        trim: true,
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
const Wallpaper = mongoose_1.default.model('Wallpaper', wallpaperSchema);
exports.default = Wallpaper;
