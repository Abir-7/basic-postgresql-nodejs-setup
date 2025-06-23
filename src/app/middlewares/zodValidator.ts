import { AnyZodObject, ZodError } from "zod";

import { NextFunction, Request, Response } from "express";

import { getRelativePath } from "./fileUpload/getRelativeFilePath";
import unlinkFile from "../utils/unlinkFiles";
import catchAsync from "../utils/catchAsync";

const zodValidator = (schema: AnyZodObject) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({ body: req.body });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        if (req.file?.path) {
          unlinkFile(getRelativePath(req.file?.path));
        }
        return next(error);
      }

      return next(error);
    }
  });

export default zodValidator;
