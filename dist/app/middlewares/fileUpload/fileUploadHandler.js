"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
var multer_1 = __importDefault(require("multer"));
var path_1 = __importDefault(require("path"));
var fs_1 = __importDefault(require("fs"));
var config_1 = require("../../config");
var logger_1 = __importDefault(require("../../utils/logger"));
// Allow only these file types
var allowedMimeTypes = [
    // Images
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "image/svg+xml",
    // Videos
    "video/mp4",
    "video/mpeg",
    "video/quicktime",
    "video/webm",
    // Audio
    "audio/mpeg", // .mp3
    "audio/wav", // .wav
    "audio/webm", // .webm audio
    "audio/ogg", // .ogg
    "audio/x-wav",
    "audio/x-m4a", // .m4a
    "audio/aac", // .aac
    // Documents
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "text/plain",
    // Archives
    "application/zip",
    "application/x-rar-compressed",
];
// Decide folder based on mimetype
var getFolder = function (mimetype) {
    if (mimetype.startsWith("image/"))
        return "images";
    if (mimetype.startsWith("video/"))
        return "videos";
    if (mimetype.startsWith("audio/"))
        return "audios";
    if (mimetype === "application/pdf")
        return "pdfs";
    if (mimetype.includes("msword") ||
        mimetype.includes("officedocument") ||
        mimetype === "text/plain")
        return "documents";
    return "others";
};
// Storage config
var storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        var folder = getFolder(file.mimetype);
        var uploadPath = path_1.default.join(process.cwd(), "uploads", folder);
        // Ensure folder exists
        fs_1.default.mkdirSync(uploadPath, { recursive: true });
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        var uniquePrefix = "".concat(Date.now(), "-").concat(Math.round(Math.random() * 1e9));
        var ext = path_1.default.extname(file.originalname);
        cb(null, "".concat(uniquePrefix).concat(ext));
    },
});
// File type filter
var fileFilter = function (req, file, cb) {
    logger_1.default.info("Uploading:".concat((file.originalname, file.mimetype)));
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(new Error("\u274C Unsupported file type: ".concat(file.mimetype)));
    }
};
// Export multer instance
exports.upload = (0, multer_1.default)({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: Number(config_1.appConfig.multer.file_size_limit) || 100 * 1024 * 1024, // 100MB default
        files: Number(config_1.appConfig.multer.max_file_number) || 5,
    },
});
