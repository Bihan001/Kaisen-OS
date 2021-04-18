import express, { Request, Response } from 'express';
import * as filesController from '../controllers/filesController';
import requireAuth from '../middlewares/require-auth';
const router = express.Router();

router.get('/', filesController.rootFileController);

router.post('/createFile', filesController.createFile);

router.post('/getFile', requireAuth, filesController.getFile);

router.post('/updateFile', requireAuth, filesController.updateFileContent);

router.post('/deleteFilesAndFolders', requireAuth, filesController.deleteFilesAndFolders);

export default router;
