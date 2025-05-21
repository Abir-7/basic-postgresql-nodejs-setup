"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.morganStream = void 0;
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
var winston_1 = require("winston");
var winston_daily_rotate_file_1 = __importDefault(require("winston-daily-rotate-file"));
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var env = process.env.NODE_ENV || "development";
var logDir = path_1.default.join(process.cwd(), "logs");
// Create logs directory if it doesn't exist
if (!fs_1.default.existsSync(logDir)) {
    fs_1.default.mkdirSync(logDir, { recursive: true });
}
var dailyRotateFileTransport = new winston_daily_rotate_file_1.default({
    filename: path_1.default.join(logDir, "%DATE%-app.log"),
    datePattern: "YYYY-MM-DD",
    zippedArchive: true,
    maxSize: "20m",
    maxFiles: "30d",
    level: "info",
    format: winston_1.format.combine(winston_1.format.timestamp(), winston_1.format.json()),
});
var errorFilter = (0, winston_1.format)(function (info) { return (info.level === "error" ? info : false); });
var exceptionHandlers = [
    new winston_daily_rotate_file_1.default({
        filename: path_1.default.join(logDir, "%DATE%-exceptions.log"),
        datePattern: "YYYY-MM-DD",
        zippedArchive: true,
        maxSize: "20m",
        maxFiles: "30d",
        format: winston_1.format.combine(errorFilter(), winston_1.format.timestamp(), winston_1.format.json()),
    }),
];
var rejectionHandlers = [
    new winston_daily_rotate_file_1.default({
        filename: path_1.default.join(logDir, "%DATE%-rejections.log"),
        datePattern: "YYYY-MM-DD",
        zippedArchive: true,
        maxSize: "20m",
        maxFiles: "30d",
        format: winston_1.format.combine(errorFilter(), winston_1.format.timestamp(), winston_1.format.json()),
    }),
];
var logger = (0, winston_1.createLogger)({
    level: env === "development" ? "debug" : "info",
    format: winston_1.format.combine(winston_1.format.timestamp({
        format: "YYYY-MM-DD HH:mm:ss",
    }), winston_1.format.errors({ stack: true }), winston_1.format.splat(), winston_1.format.json()),
    defaultMeta: { service: "your-service-name" },
    transports: [
        new winston_1.transports.Console({
            format: winston_1.format.combine(winston_1.format.colorize(), winston_1.format.printf(function (info) { return "".concat(info.timestamp, " ").concat(info.level, ": ").concat(info.message); })),
        }),
        dailyRotateFileTransport,
    ],
    exceptionHandlers: exceptionHandlers,
    rejectionHandlers: rejectionHandlers,
});
exports.morganStream = {
    write: function (message) {
        logger.info(message.trim());
    },
};
exports.default = logger;
