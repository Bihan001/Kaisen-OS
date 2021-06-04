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
exports.diagnoseFolder = exports.getFilesAndFolders = exports.createFolderAtPath = exports.createRootFolder = exports.getFolderAndParentsByPath = exports.getRootSubFolders = exports.rootFolderController = void 0;
const custom_error_1 = __importDefault(require("../errors/custom-error"));
const catch_async_1 = __importDefault(require("../utils/catch-async"));
const response_handler_1 = require("../utils/response-handler");
const folder_1 = __importDefault(require("../models/folder"));
const file_1 = __importDefault(require("../models/file"));
exports.rootFolderController = catch_async_1.default((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(200).json(response_handler_1.SuccessResponse({}, 'Folders Route is up and running!'));
}));
exports.getRootSubFolders = catch_async_1.default((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const rootFolder = yield folder_1.default.findById('root').populate('editableBy');
    if (!rootFolder)
        throw new custom_error_1.default('Root folder missing', 500);
    const childrenNames = rootFolder.children || [];
    var folderChildrenPaths = [];
    var fileChildrenPaths = [];
    childrenNames.map((name) => {
        if (name.includes('.'))
            fileChildrenPaths.push(`root#${name}`);
        else
            folderChildrenPaths.push(`root#${name}`);
    });
    //const childrenPaths: Array<string> = childrenNames.map((name) => `root#${name}`);
    var folderResultList = yield folder_1.default.find({ _id: { $in: folderChildrenPaths } }).populate('editableBy');
    folderResultList.push(rootFolder);
    var fileResultList = (yield file_1.default.find({ _id: { $in: fileChildrenPaths } }).populate('editableBy')) || [];
    return res.status(200).json(response_handler_1.SuccessResponse([...folderResultList, ...fileResultList]));
}));
exports.getFolderAndParentsByPath = catch_async_1.default((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const folderPaths = req.body.folderPaths;
    var files = [], folders = [];
    if (!folderPaths)
        throw new custom_error_1.default('folder paths array required', 400);
    folderPaths.map((path) => {
        if (path.includes('.'))
            files.push(path);
        else
            folders.push(path);
    });
    const folderResultList = yield folder_1.default.find({
        _id: { $in: folders },
    }).populate('editableBy');
    const fileResultList = yield file_1.default.find({
        _id: { $in: files },
    }).populate('editableBy');
    return res.status(200).json(response_handler_1.SuccessResponse([...folderResultList, ...fileResultList]));
}));
exports.createRootFolder = catch_async_1.default((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const folderCreator = req.body.folderCreator;
    const existingFolder = yield folder_1.default.findById('root');
    if (existingFolder)
        throw new custom_error_1.default('Root folder already exists', 400);
    const rootFolder = new folder_1.default({
        _id: 'root',
        name: 'root',
        path: 'root',
        editableBy: folderCreator || 'admin',
    });
    yield rootFolder.save();
    yield rootFolder.populate('editableBy').execPopulate();
    return res.status(200).json(response_handler_1.SuccessResponse({ rootFolder }, 'Root folder insertion successful'));
}));
exports.createFolderAtPath = catch_async_1.default((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body);
    const parentPath = req.body.parentPath;
    const folderName = req.body.folderName;
    const folderCreator = req.body.folderCreator;
    if (!parentPath || !folderName)
        throw new custom_error_1.default('Valid Path and name required', 400);
    const folderFormatCheck = /[!@#$%^&*()+\=\[\]{};':"\\|,.<>\/?]+/;
    if (folderFormatCheck.test(folderName))
        throw new custom_error_1.default('Folder name can only contain symbols - and _', 400);
    const newPath = `${parentPath}#${folderName}`;
    const existingFolder = yield folder_1.default.findById(newPath);
    if (existingFolder)
        throw new custom_error_1.default('Folder already exists', 400);
    const newFolder = new folder_1.default({
        _id: newPath,
        name: folderName,
        path: newPath,
        editableBy: folderCreator || 'admin',
    });
    yield newFolder.save();
    yield newFolder.populate('editableBy').execPopulate();
    let parentFolder = yield folder_1.default.findById(parentPath);
    if (!parentFolder)
        throw new custom_error_1.default('Parent path invalid', 400);
    if (!parentFolder.children)
        throw new custom_error_1.default('Parent path children undefined', 500);
    parentFolder.children.push(folderName);
    yield parentFolder.save();
    yield parentFolder.populate('editableBy').execPopulate();
    return res.status(200).json(response_handler_1.SuccessResponse({ parentFolder, newFolder }, 'Insertion successful'));
}));
exports.getFilesAndFolders = catch_async_1.default((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const folderPaths = req.body.folderPaths;
    const filePaths = req.body.filePaths;
    if (!folderPaths || !filePaths)
        throw new custom_error_1.default('folder paths array required', 400);
    const folderResultList = yield folder_1.default.find({ _id: { $in: folderPaths } }).populate('editableBy');
    const fileResultList = yield file_1.default.find({ _id: { $in: filePaths } }).populate('editableBy');
    return res.status(200).json(response_handler_1.SuccessResponse({ folderResultList, fileResultList }, 'Fetched files and folders'));
}));
exports.diagnoseFolder = catch_async_1.default((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const folderPath = req.body.folderPath;
    const presentFolder = yield folder_1.default.findById(folderPath);
    if (!presentFolder)
        throw new custom_error_1.default('Folder Not Found !', 400);
    let folderChildrenPaths;
    if (presentFolder.children !== undefined) {
        folderChildrenPaths = presentFolder.children.map((name) => {
            return folderPath + '#' + name;
        });
    }
    else
        folderChildrenPaths = [];
    let sanitizedChildrenArray = [];
    const promise = yield Promise.all(folderChildrenPaths.map((path) => __awaiter(void 0, void 0, void 0, function* () {
        let data;
        if (path.includes('.'))
            data = yield file_1.default.findById(path);
        else
            data = yield folder_1.default.findById(path);
        if (data != null)
            yield sanitizedChildrenArray.push(path);
    }))).then(() => __awaiter(void 0, void 0, void 0, function* () {
        const sanitizedFolder = yield folder_1.default.findByIdAndUpdate(folderPath, {
            children: sanitizedChildrenArray.map((path) => {
                let array = path.split('#');
                return array.pop();
            }),
        }, { new: true });
        if (sanitizedFolder) {
            yield sanitizedFolder.populate('editableBy').execPopulate();
            return res.status(200).json(response_handler_1.SuccessResponse(sanitizedFolder, 'Diagnose Completed !'));
        }
        throw new custom_error_1.default('Folder Not Found !', 400);
    }));
}));
