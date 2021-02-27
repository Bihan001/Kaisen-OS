import express, { Request, Response } from 'express';
import catchAsync from '../utils/catch-async';
import { SuccessResponse } from '../utils/response-handler';

export const rootFileController = catchAsync(async (req: Request, res: Response) => {
  res.status(200).json(SuccessResponse({}, 'Files Route is up and running!'));
});
