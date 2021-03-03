import express, { Request, Response } from 'express';
import { Document } from 'mongoose';
import CustomError from '../errors/custom-error';
import catchAsync from '../utils/catch-async';
import { SuccessResponse, ErrorResponse } from '../utils/response-handler';
import Folder from '../models/folder';

interface FolderInterface extends Document {
  children?: Array<string>;
}

export const rootFolderController = catchAsync(async (req: Request, res: Response) => {
  res.status(200).json(SuccessResponse({}, 'Folders Route is up and running!'));
});

export const getFolderAndParentsByPath = catchAsync(async (req: Request, res: Response) => {
  const folderPaths: string[] = req.body.folderPaths;
  if (!folderPaths) throw new CustomError('folder paths array required', 400);
  const folderResultList = await Folder.find({ _id: { $in: folderPaths } });
  return res.status(200).json(SuccessResponse(folderResultList));
});

export const createFolderAtPath = catchAsync(async (req: Request, res: Response) => {
  const parentPath: string = req.body.parentPath;
  const folderName: string = req.body.folderName;
  if(parentPath!=='' && folderName!=='root')
  {
    const folderCreator: string = '';
    if (!parentPath || !folderName) throw new CustomError('Valid Path and name required', 400);
    let newPath = `${parentPath}#${folderName}`;
    const existingFolder = await Folder.findById(newPath);
    if (existingFolder) throw new CustomError('Folder already exists', 400);
    const newFolder = new Folder({
      _id: newPath,
      name: folderName,
      path: newPath,
      editableBy: 'admins',
    });
    await newFolder.save();
    let parentFolder: FolderInterface | null = await Folder.findById(parentPath);
    if (!parentFolder) throw new CustomError('Parent path invalid', 400);
    if (!parentFolder.children) throw new CustomError('Parent path children undefined', 500);
    parentFolder.children.push(newPath);
    await parentFolder.save();
    return res.status(200).json(SuccessResponse({}, 'Insertion successful'));
  }
  else
  {
    const newFolder = new Folder({
      _id: 'root',
      name: folderName,
      path: 'root',
      editableBy: 'admins',
    });
    await newFolder.save();
    return res.status(200).json(SuccessResponse({}, 'Insertion successful'));
  }
 
});
