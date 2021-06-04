"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch((err) => next(err));
    };
};
