"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleZodError = void 0;
var handleZodError = function (err) {
    var statusCode = 400;
    var message = "Validation failed!";
    // Map through Zod error issues and format them
    var errors = err.errors.map(function (e) { return ({
        message: e.message,
        path: e.path.join("."),
    }); });
    return { statusCode: statusCode, message: message, errors: errors };
};
exports.handleZodError = handleZodError;
