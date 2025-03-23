/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";

import AppError from "../errors/AppError";

import { handleZodError } from "../errors/zodErrorHandler";

import { ZodError } from "zod";
import multer from "multer";
import multerErrorHandler from "../errors/MulterErrorHandler";
import logger from "../utils/logger";

export const globalErrorHandler = async (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Something went wrong!";
  let errors: any = [];

  if (err instanceof ZodError) {
    const zodError = handleZodError(err);
    statusCode = zodError.statusCode;
    message = zodError.message;
    errors = zodError.errors;
  } else if (err?.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Your session has expired. Please login again.";
    errors = [
      {
        path: "token",
        message: message,
      },
    ];
  } else if (err instanceof multer.MulterError) {
    const multerError = multerErrorHandler(err);
    statusCode = multerError.statusCode;
    message = multerError.message;
    errors = multerError.errors;
  } else if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    errors = [
      {
        path: "",
        message: err.message,
      },
    ];
  } else if (err instanceof Error) {
    message = err.message;
    errors = [
      {
        path: "",
        message: err.message,
      },
    ];
  }
  logger.error(message);
  res.status(statusCode).json({
    success: false,
    status: statusCode,
    message,
    errors: errors.length ? errors : undefined,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};
