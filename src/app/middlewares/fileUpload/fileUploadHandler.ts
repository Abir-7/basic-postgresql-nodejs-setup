import { Request } from "express";
import multer, { FileFilterCallback } from "multer";
import path from "path";
import fs from "fs";
import { app_config } from "../../config";
import logger from "../../utils/serverTools/logger";

// Allow only these file types
const allowed_mime_types = [
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
const getFolder = (mimetype: string): string => {
  if (mimetype.startsWith("image/")) return "images";
  if (mimetype.startsWith("video/")) return "videos";
  if (mimetype.startsWith("audio/")) return "audios";
  if (mimetype === "application/pdf") return "pdfs";
  if (
    mimetype.includes("msword") ||
    mimetype.includes("officedocument") ||
    mimetype === "text/plain"
  )
    return "documents";
  return "others";
};

// Storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folder = getFolder(file.mimetype);
    const uploadPath = path.join(process.cwd(), "uploads", folder);

    // Ensure folder exists
    fs.mkdirSync(uploadPath, { recursive: true });

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniquePrefix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname);
    cb(null, `${uniquePrefix}${ext}`);
  },
});

// File type filter
const file_filter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  logger.info(`Uploading:${(file.originalname, file.mimetype)}`);
  if (allowed_mime_types.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`❌ Unsupported file type: ${file.mimetype}`));
  }
};

// Export multer instance
export const upload = multer({
  storage,
  fileFilter: file_filter,
  limits: {
    fileSize: Number(app_config.multer.file_size_limit) || 100 * 1024 * 1024, // 100MB default
    files: Number(app_config.multer.max_file_number) || 5,
  },
});
