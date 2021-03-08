import express, { Request, Response } from 'express';
import * as filesController from '../controllers/filesController';
const router = express.Router();

router.get('/', filesController.rootFileController);

router.post('/createFile', filesController.createFile);

router.post('/getFile', filesController.getFile);

router.post('/deleteFilesAndFolders', filesController.deleteFilesAndFolders);

export default router;
