import { Request } from "express";
import multer, { FileFilterCallback } from "multer";
import path from "path";
import fs from "fs";
import { appConfig } from "../../config";

const allowedMimeTypes = [
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

const getFolder = (mimetype: string): string => {
  if (mimetype.startsWith("image/")) return "images";
  if (mimetype.startsWith("video/")) return "videos";
  if (mimetype === "application/pdf") return "pdfs";
  if (
    mimetype.startsWith("application/vnd.ms-excel") ||
    mimetype.startsWith("application/vnd.openxmlformats") ||
    mimetype.startsWith("application/msword") ||
    mimetype === "text/plain"
  )
    return "documents";
  return "others";
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folder = getFolder(file.mimetype);
    const uploadPath = path.join(process.cwd(), "uploads", folder);

    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniquePrefix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${uniquePrefix}${ext}`);
  },
});

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Unsupported file type: ${file.mimetype}`));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: Number(appConfig.multer.file_size_limit), // max size 100MB
    files: Number(appConfig.multer.max_file_number), // Maximum number of files allowed
  },
});
