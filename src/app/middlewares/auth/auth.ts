import { NextFunction, Request, Response } from "express";
import AppError from "../../errors/AppError";
import status from "http-status";
import { TUserRole } from "../../interface/auth.interface";

import { jsonWebToken } from "../../utils/jwt/jwt";
import { appConfig } from "../../config";



// need to put this code in try catch
export const auth =
  (...userRole: TUserRole[]) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const tokenWithBearer = req.headers.authorization as string;

    if (!tokenWithBearer || !tokenWithBearer.startsWith("Bearer")) {
      return next(new AppError(status.UNAUTHORIZED, "You are not authorized"));
    }

    const token = tokenWithBearer.split(" ")[1];

    if (token === "null") {
      return next(new AppError(status.UNAUTHORIZED, "You are not authorized"));
    }

    const decodedData = jsonWebToken.verifyJwt(
      token,
      appConfig.jwt.jwt_access_secret as string
    );
    //! need to fetch from db
    const userData = { email: "sdsd", role: "ddd" };

    if (!userData) {
      return next(new AppError(status.UNAUTHORIZED, "You are not authorized"));
    }

    if (userRole.length && !userRole.includes(decodedData.userRole)) {
      return next(new AppError(status.UNAUTHORIZED, "You are not authorized"));
    }

    if (
      userData.role !== decodedData.userRole ||
      userData.email !== decodedData.userEmail
    ) {
      return next(new AppError(status.UNAUTHORIZED, "You are not authorized"));
    }
    req.user = decodedData;

    return next();
  };
