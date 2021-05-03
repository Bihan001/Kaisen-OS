import express, { Request, Response } from 'express';
import { Document } from 'mongoose';
import File from '../models/file';
import Folder from '../models/folder';
import catchAsync from '../utils/catch-async';
import { SuccessResponse } from '../utils/response-handler';
import CustomError from '../errors/custom-error';
import admin from '../firebase-admin';

interface FolderInterface extends Document {
  children?: Array<string>;
}
interface FileInterface extends Document {
  content?: String;
}
export const rootFileController = catchAsync(async (req: Request, res: Response) => {
  res.status(200).json(SuccessResponse({}, 'Files Route is up and running!'));
});

export const getFile = catchAsync(async (req: Request, res: Response) => {
  const filePath: string = req.body.path;
  if (!filePath) throw new CustomError('File path required', 400);
  const file = await File.findById(filePath).populate('editableBy');
  return res.status(200).json(SuccessResponse(file));
});

export const createFile = catchAsync(async (req: Request, res: Response) => {
  const parentPath: string = req.body.parentPath;
  const fileName: string = req.body.fileName;
  const fileType: string = req.body.fileType;
  const fileSize: string = req.body.fileSize;
  const fileContent: string = req.body.fileContent;
  const fileCreator: string = req.body.fileCreator;
  if (!parentPath || !fileName || !fileType || isNaN(+fileSize))
    throw new CustomError('Valid path, name, type and size required', 400);
  const folderFormatCheck = /[!@#$%^&*()+\=\[\]{};':"\\|,.<>\/?]+/;
  if (folderFormatCheck.test(fileName)) throw new CustomError('File name can only contain symbols - and _', 400);
  const newPath = `${parentPath}#${fileName}.${fileType}`;
  const existingFile = await File.findById(newPath);
  if (existingFile) throw new CustomError('File already exists', 400);
  const newFile = new File({
    _id: newPath,
    name: fileName,
    type: fileType,
    size: fileSize,
    content: fileContent || '',
    path: newPath,
    editableBy: fileCreator || 'admin',
  });
  await newFile.save();
  await newFile.populate('editableBy').execPopulate();
  let parentFolder: FolderInterface | null = await Folder.findById(parentPath);
  if (!parentFolder) throw new CustomError('Parent path invalid', 400);
  if (!parentFolder.children) throw new CustomError('Parent path children undefined', 500);
  parentFolder.children.push(`${fileName}.${fileType}`);
  await parentFolder.save();
  await parentFolder.populate('editableBy').execPopulate();
  return res.status(200).json(SuccessResponse({ parentFolder, newFile }, 'Creation successful'));
});

export const updateFileContent = catchAsync(async (req: Request, res: Response) => {
  const path: string = req.body.path;
  const fileContent: string = req.body.fileContent;
  if (!path || !fileContent) throw new CustomError('Valid path and content required', 400);
  const existingFile: FileInterface | null = await File.findByIdAndUpdate(
    path,
    { content: fileContent },
    { new: true }
  );
  if (!existingFile) throw new CustomError('Cannot find file', 400);
  // existingFile.content = fileContent;
  // await existingFile.save();
  res.status(200).json(SuccessResponse(existingFile, 'Updation successfull'));
});

export const deleteFilesAndFolders = catchAsync(async (req: Request, res: Response) => {
  const paths: Array<string> = req.body.paths;
  const names: Array<string> = req.body.names;
  if (!paths || !names) throw new CustomError('Paths and names array should be present', 400);
  if (paths.length === 0) throw new CustomError('Paths array cannot be empty', 400);
  const tmpArr = paths[0].split('#');
  if (tmpArr.length === 0) throw new CustomError('Paths array should be valid', 400);
  tmpArr.pop();
  const parentPath = tmpArr.join('#');
  const parentFolder: FolderInterface | null = await Folder.findById(parentPath);
  if (!parentFolder) throw new CustomError('Parent folder not present', 500);
  parentFolder.children = parentFolder.children?.filter((name) => !names.includes(name));
  await parentFolder.save();
  const pathsRegex = paths.map((path) => new RegExp(path, 'i'));
  await Folder.deleteMany({ _id: { $in: pathsRegex } });
  const files: Array<FileInterface> = await File.find({ _id: { $in: pathsRegex } });
  const fileUrls = files.map((file) => file.content);
  await File.deleteMany({ _id: { $in: pathsRegex } });
  res.status(200).json(SuccessResponse({}, 'Deletion successfull'));
});
