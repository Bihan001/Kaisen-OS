import express, { Request, Response } from 'express';
import { rootFolderController, createFolderAtPath, getFolderAndParentsByPath } from '../controllers/foldersController';
const router = express.Router();

router.get('/', rootFolderController);

router.post('/createFolder', createFolderAtPath);

router.post('/getFolderAndParents', getFolderAndParentsByPath);

export default router;
