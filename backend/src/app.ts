import express, { Application, Request, Response, NextFunction } from 'express';
const app: Application = express();
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import CustomError from './errors/custom-error';
import { SuccessResponse, ErrorResponse } from './utils/response-handler';
import catchAsync from './utils/catch-async';
import filesRoute from './routes/files';
import foldersRoute from './routes/folders';
import usersRoute from './routes/users';

console.log(`Environment : ${process.env.NODE_ENV}`);

var whitelist = ['http://localhost:3000', 'https://kaisen-os.loca.lt'];

app.use(express.json(), cookieParser(), morgan('dev'));
app.use(
  cors({
    credentials: true,
    origin: (origin, callback) => {
      return callback(null, true);
    },
  })
);

app.get(
  '/',
  catchAsync(async (req: Request, res: Response) => {
    res.status(200).json(SuccessResponse({}, 'Kaisen OS Backend is up and running!'));
  })
);

app.use('/api/files', filesRoute);
app.use('/api/folders', foldersRoute);
app.use('/api/auth', usersRoute);

app.all('*', (req: Request, res: Response, next: NextFunction) => {
  const err = new CustomError('Non-existant route', 404);
  next(err);
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof CustomError) {
    return res.status(err.statusCode).json(ErrorResponse(err));
  }
  return res.status(500).json(ErrorResponse(err));
});

export default app;
