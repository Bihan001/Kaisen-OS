"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config({ path: process.env.NODE_ENV === 'production' ? 'prod.env' : 'dev.env' });
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("./app"));
// Variables
const PORT = process.env.PORT || 5000;
//Connection
if (process.env.MONGODB_URI) {
    mongoose_1.default
        .connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
        .then(() => console.log('Connected to MongoDB'))
        .catch((err) => console.log('Database Connection Error: ', err.message));
}
else {
    throw new Error('MONGODB_URI not defined');
}
app_1.default.listen(PORT, () => console.log('Server is running at ' + PORT));
