import { Request, Response, NextFunction } from 'express';

export default (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch((err: Error) => next(err));
  };
};
