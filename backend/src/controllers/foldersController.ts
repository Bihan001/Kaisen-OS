import express, { Request, Response } from 'express';
import { Document } from 'mongoose';
import CustomError from '../errors/custom-error';
import catchAsync from '../utils/catch-async';
import { SuccessResponse, ErrorResponse } from '../utils/response-handler';
import Folder from '../models/folder';
import File from '../models/file';

interface FolderInterface extends Document {
  children?: Array<string>;
}

export const rootFolderController = catchAsync(async (req: Request, res: Response) => {
  res.status(200).json(SuccessResponse({}, 'Folders Route is up and running!'));
});

export const getRootSubFolders = catchAsync(async (req: Request, res: Response) => {
  const rootFolder: FolderInterface | null = await Folder.findById('root');
  if (!rootFolder) throw new CustomError('Root folder missing', 500);
  const childrenNames: Array<string> = rootFolder.children || [];
  var folderChildrenPaths: Array<string> = [];
  var fileChildrenPaths: Array<string> = [];
  childrenNames.map((name) => {
    if (name.includes('.')) fileChildrenPaths.push(`root#${name}`);
    else folderChildrenPaths.push(`root#${name}`);
  });
  //const childrenPaths: Array<string> = childrenNames.map((name) => `root#${name}`);
  var folderResultList = await Folder.find({ _id: { $in: folderChildrenPaths } }).populate('editableBy');
  folderResultList.push(rootFolder);
  var fileResultList = (await File.find({ _id: { $in: fileChildrenPaths } }).populate('editableBy')) || [];
  return res.status(200).json(SuccessResponse([...folderResultList, ...fileResultList]));
});

export const getFolderAndParentsByPath = catchAsync(async (req: Request, res: Response) => {
  const folderPaths: string[] = req.body.folderPaths;
  var files: Array<string> = [],
    folders: Array<string> = [];
  if (!folderPaths) throw new CustomError('folder paths array required', 400);
  folderPaths.map((path) => {
    if (path.includes('.')) files.push(path);
    else folders.push(path);
  });
  const folderResultList = await Folder.find({
    _id: { $in: folders },
  }).populate('editableBy');
  const fileResultList = await File.find({
    _id: { $in: files },
  }).populate('editableBy');
  return res.status(200).json(SuccessResponse([...folderResultList, ...fileResultList]));
});

export const createRootFolder = catchAsync(async (req: Request, res: Response) => {
  const folderCreator: string = req.body.folderCreator;
  const existingFolder = await Folder.findById('root');
  if (existingFolder) throw new CustomError('Root folder already exists', 400);
  const rootFolder = new Folder({
    _id: 'root',
    name: 'root',
    path: 'root',
    editableBy: folderCreator || 'admin',
  });
  await rootFolder.save();
  await rootFolder.populate('editableBy').execPopulate();
  return res.status(200).json(SuccessResponse({ rootFolder }, 'Root folder insertion successful'));
});

export const createFolderAtPath = catchAsync(async (req: Request, res: Response) => {
  const parentPath: string = req.body.parentPath;
  const folderName: string = req.body.folderName;
  const folderCreator: string = req.body.folderCreator;
  if (!parentPath || !folderName) throw new CustomError('Valid Path and name required', 400);
  const folderFormatCheck = /[!@#$%^&*()+\=\[\]{};':"\\|,.<>\/?]+/;
  if (folderFormatCheck.test(folderName)) throw new CustomError('Folder name can only contain symbols - and _', 400);
  const newPath = `${parentPath}#${folderName}`;
  const existingFolder = await Folder.findById(newPath);
  if (existingFolder) throw new CustomError('Folder already exists', 400);
  const newFolder = new Folder({
    _id: newPath,
    name: folderName,
    path: newPath,
    editableBy: folderCreator || 'admin',
  });
  await newFolder.save();
  await newFolder.populate('editableBy').execPopulate();
  let parentFolder: FolderInterface | null = await Folder.findById(parentPath);
  if (!parentFolder) throw new CustomError('Parent path invalid', 400);
  if (!parentFolder.children) throw new CustomError('Parent path children undefined', 500);
  parentFolder.children.push(folderName);
  await parentFolder.save();
  await parentFolder.populate('editableBy').execPopulate();
  return res.status(200).json(SuccessResponse({ parentFolder, newFolder }, 'Insertion successful'));
});
