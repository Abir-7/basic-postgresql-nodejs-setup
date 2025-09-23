/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";

import AppError from "../errors/AppError";

import { handleZodError } from "../errors/zodErrorHandler";

import { ZodError } from "zod";
import multer from "multer";
import multerErrorHandler from "../errors/MulterErrorHandler";
import logger from "../utils/serverTools/logger";

import { drizzleErrorHandler } from "../errors/drizzleErrorHandler";
import { DrizzleQueryError } from "drizzle-orm/errors";

export const globalErrorHandler = async (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let status_code = err.statusCode || 500;
  let message = err.message || "Something went wrong!";
  let errors: any = [];

  if (err instanceof ZodError) {
    const zodError = handleZodError(err);
    status_code = zodError.statusCode;
    message = zodError.message;
    errors = zodError.errors;
  }

  if (err instanceof DrizzleQueryError) {
    console.log(err.message);
    const zodError = drizzleErrorHandler(err.cause);
    status_code = zodError.statusCode;
    message = zodError.message;
    errors = zodError.errors;
  } else if (err?.name === "TokenExpiredError") {
    status_code = 401;
    message = "Your session has expired. Please login again.";
    errors = [
      {
        path: "token",
        message: message,
      },
    ];
  } else if (err instanceof multer.MulterError) {
    const multerError = multerErrorHandler(err);
    status_code = multerError.statusCode;
    message = multerError.message;
    errors = multerError.errors;
  } else if (err instanceof AppError) {
    status_code = err.statusCode;
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

  res.status(status_code).json({
    success: false,
    statusCode: status_code,
    message,
    errors: errors.length ? errors : undefined,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};
