"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFilesAndFolders = exports.updateFileContent = exports.createFile = exports.getFile = exports.rootFileController = void 0;
const file_1 = __importDefault(require("../models/file"));
const folder_1 = __importDefault(require("../models/folder"));
const catch_async_1 = __importDefault(require("../utils/catch-async"));
const response_handler_1 = require("../utils/response-handler");
const custom_error_1 = __importDefault(require("../errors/custom-error"));
exports.rootFileController = catch_async_1.default((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(200).json(response_handler_1.SuccessResponse({}, 'Files Route is up and running!'));
}));
exports.getFile = catch_async_1.default((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filePath = req.body.path;
    if (!filePath)
        throw new custom_error_1.default('File path required', 400);
    const file = yield file_1.default.findById(filePath).populate('editableBy');
    return res.status(200).json(response_handler_1.SuccessResponse(file));
}));
exports.createFile = catch_async_1.default((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parentPath = req.body.parentPath;
    const fileName = req.body.fileName;
    const fileType = req.body.fileType;
    const fileSize = req.body.fileSize;
    const fileContent = req.body.fileContent;
    const fileCreator = req.body.fileCreator;
    if (!parentPath || !fileName || !fileType || isNaN(+fileSize))
        throw new custom_error_1.default('Valid path, name, type and size required', 400);
    const folderFormatCheck = /[!@#$%^&*()+\=\[\]{};':"\\|,.<>\/?]+/;
    if (folderFormatCheck.test(fileName))
        throw new custom_error_1.default('File name can only contain symbols - and _', 400);
    const newPath = `${parentPath}#${fileName}.${fileType}`;
    const existingFile = yield file_1.default.findById(newPath);
    if (existingFile)
        throw new custom_error_1.default('File already exists', 400);
    const newFile = new file_1.default({
        _id: newPath,
        name: fileName,
        type: fileType,
        size: fileSize,
        content: fileContent || '',
        path: newPath,
        editableBy: fileCreator || 'admin',
    });
    yield newFile.save();
    yield newFile.populate('editableBy').execPopulate();
    let parentFolder = yield folder_1.default.findById(parentPath);
    if (!parentFolder)
        throw new custom_error_1.default('Parent path invalid', 400);
    if (!parentFolder.children)
        throw new custom_error_1.default('Parent path children undefined', 500);
    parentFolder.children.push(`${fileName}.${fileType}`);
    yield parentFolder.save();
    yield parentFolder.populate('editableBy').execPopulate();
    return res.status(200).json(response_handler_1.SuccessResponse({ parentFolder, newFile }, 'Creation successful'));
}));
exports.updateFileContent = catch_async_1.default((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const path = req.body.path;
    const fileContent = req.body.fileContent;
    if (!path || !fileContent)
        throw new custom_error_1.default('Valid path and content required', 400);
    const existingFile = yield file_1.default.findByIdAndUpdate(path, { content: fileContent }, { new: true });
    if (!existingFile)
        throw new custom_error_1.default('Cannot find file', 400);
    // existingFile.content = fileContent;
    // await existingFile.save();
    res.status(200).json(response_handler_1.SuccessResponse(existingFile, 'Updation successfull'));
}));
exports.deleteFilesAndFolders = catch_async_1.default((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const paths = req.body.paths;
    const names = req.body.names;
    if (!paths || !names)
        throw new custom_error_1.default('Paths and names array should be present', 400);
    if (paths.length === 0)
        throw new custom_error_1.default('Paths array cannot be empty', 400);
    const tmpArr = paths[0].split('#');
    if (tmpArr.length === 0)
        throw new custom_error_1.default('Paths array should be valid', 400);
    tmpArr.pop();
    const parentPath = tmpArr.join('#');
    const parentFolder = yield folder_1.default.findById(parentPath);
    if (!parentFolder)
        throw new custom_error_1.default('Parent folder not present', 500);
    parentFolder.children = (_a = parentFolder.children) === null || _a === void 0 ? void 0 : _a.filter((name) => !names.includes(name));
    yield parentFolder.save();
    const pathsRegex = paths.map((path) => new RegExp(path, 'i'));
    yield folder_1.default.deleteMany({ _id: { $in: pathsRegex } });
    const files = yield file_1.default.find({ _id: { $in: pathsRegex } });
    const fileUrls = files.map((file) => file.content);
    yield file_1.default.deleteMany({ _id: { $in: pathsRegex } });
    res.status(200).json(response_handler_1.SuccessResponse({}, 'Deletion successfull'));
}));
