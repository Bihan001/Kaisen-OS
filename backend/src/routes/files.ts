import express, { Request, Response } from 'express';
import { rootFileController } from '../controllers/filesController';
const router = express.Router();

router.get('/', rootFileController);

export default router;
