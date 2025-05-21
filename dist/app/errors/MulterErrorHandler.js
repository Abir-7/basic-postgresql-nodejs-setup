"use strict";
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
Object.defineProperty(exports, "__esModule", { value: true });
var config_1 = require("../config");
var multerErrorHandler = function (err) {
    var statusCode = 400;
    var message = "Multer Error";
    var errors = [];
    if (err.code === "LIMIT_FILE_SIZE") {
        var bytes = Number(config_1.appConfig.multer.file_size_limit);
        var megabytes = bytes / (1024 * 1024);
        errors.push({
            field: "",
            message: "File size exceeds the limit of ".concat(megabytes, " mb"),
        });
    }
    if (err.code === "LIMIT_FILE_COUNT") {
        errors.push({
            field: "",
            message: "You can upload a maximum of ".concat(config_1.appConfig.multer.max_file_number, " files"),
        });
    }
    return { statusCode: statusCode, message: message, errors: errors };
};
exports.default = multerErrorHandler;
