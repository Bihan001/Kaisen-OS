import express, { Request, Response } from 'express';

import * as foldersController from '../controllers/foldersController';
import requireAuth from '../middlewares/require-auth';

const router = express.Router();

router.get('/', foldersController.rootFolderController);

router.post('/createRoot', requireAuth, foldersController.createRootFolder);

router.get('/getRootSubFolders', requireAuth, foldersController.getRootSubFolders);

// Add the requireAuth middleware here when required, currently removed for debugging from postman
router.post('/createFolder', requireAuth, foldersController.createFolderAtPath);

router.post('/getFolderAndParents', requireAuth, foldersController.getFolderAndParentsByPath);

router.post('/getFilesAndFolders', requireAuth, foldersController.getFilesAndFolders);

export default router;
