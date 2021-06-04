"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = express_1.default();
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const custom_error_1 = __importDefault(require("./errors/custom-error"));
const response_handler_1 = require("./utils/response-handler");
const files_1 = __importDefault(require("./routes/files"));
const folders_1 = __importDefault(require("./routes/folders"));
const users_1 = __importDefault(require("./routes/users"));
console.log(`Environment : ${process.env.NODE_ENV}`);
var whitelist = ['http://localhost:3000', 'https://kaisen-os.loca.lt'];
app.use(express_1.default.json(), cookie_parser_1.default(), morgan_1.default('dev'));
app.use(cors_1.default({
    credentials: true,
    origin: (origin, callback) => {
        return callback(null, true);
    },
}));
// app.get(
//   '/',
//   catchAsync(async (req: Request, res: Response) => {
//     res.status(200).json(SuccessResponse({}, 'Kaisen OS Backend is up and running!'));
//   })
// );
app.use('/api/files', files_1.default);
app.use('/api/folders', folders_1.default);
app.use('/api/auth', users_1.default);
if (process.env.NODE_ENV === 'production') {
    app.use(express_1.default.static('client/build'));
    const path = require('path');
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}
// All middlewares goes above this
app.all('*', (req, res, next) => {
    const err = new custom_error_1.default('Non-existant route', 404);
    next(err);
});
app.use((err, req, res, next) => {
    if (err instanceof custom_error_1.default) {
        return res.status(err.statusCode).json(response_handler_1.ErrorResponse(err));
    }
    return res.status(500).json(response_handler_1.ErrorResponse(err));
});
exports.default = app;
