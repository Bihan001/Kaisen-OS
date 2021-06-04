"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorResponse = exports.SuccessResponse = void 0;
const custom_error_1 = __importDefault(require("../errors/custom-error"));
const SuccessResponse = (data, message) => ({
    success: true,
    status: 'success',
    message: message || 'Success',
    data,
});
exports.SuccessResponse = SuccessResponse;
const ErrorResponse = (err) => ({
    success: false,
    status: err instanceof custom_error_1.default && `${err.statusCode}`.startsWith('4') ? 'fail' : 'error',
    message: err.message,
    error: err,
});
exports.ErrorResponse = ErrorResponse;
