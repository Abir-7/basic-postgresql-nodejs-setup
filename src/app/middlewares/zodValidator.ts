import { AnyZodObject, ZodError } from "zod";

import { NextFunction, Request, Response } from "express";

import catchAsync from "../utils/serverTools/catchAsync";

const zodValidator = (schema: AnyZodObject) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({ body: req.body });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return next(error);
      }
      return next(error);
    }
  });

export default zodValidator;
