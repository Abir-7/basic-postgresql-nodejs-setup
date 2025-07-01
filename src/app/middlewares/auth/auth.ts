import { NextFunction, Request, Response } from "express";
import AppError from "../../errors/AppError";
import status from "http-status";
import { TUserRole } from "./auth.interface";

import { jsonWebToken } from "../../utils/jwt/jwt";
import { appConfig } from "../../config";

import { eq } from "drizzle-orm";
import { db } from "../../db/db";
import { users } from "../../db/schema/user.schema";
import { userProfile } from "../../db/schema/userProfile.schema";
import { userAuthentication } from "../../db/schema/user.authentication";

export const auth =
  (...userRole: TUserRole[]) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tokenWithBearer = req.headers.authorization as string;

      if (!tokenWithBearer || !tokenWithBearer.startsWith("Bearer")) {
        return next(
          new AppError(status.UNAUTHORIZED, "You are not authorized")
        );
      }

      const token = tokenWithBearer.split(" ")[1];

      if (token === "null") {
        return next(
          new AppError(status.UNAUTHORIZED, "You are not authorized")
        );
      }

      const decodedData = jsonWebToken.verifyJwt(
        token,
        appConfig.jwt.jwt_access_secret as string
      );

      // Fetch user with profile and authentication via LEFT JOIN
      const [userData] = await db
        .select({
          id: users.id,
          email: users.email,
          role: users.role,
          isVerified: users.isVerified,
          profileFullName: userProfile.fullName,
          profilePhone: userProfile.phone,
          authToken: userAuthentication.token,
          authOtp: userAuthentication.otp,
          authExpDate: userAuthentication.expDate,
        })
        .from(users)
        .leftJoin(userProfile, eq(users.id, userProfile.userId))
        .leftJoin(userAuthentication, eq(users.id, userAuthentication.userId))
        .where(eq(users.id, decodedData.userId));

      if (!userData) {
        return next(
          new AppError(status.UNAUTHORIZED, "You are not authorized")
        );
      }

      if (userRole.length && !userRole.includes(decodedData.userRole)) {
        return next(
          new AppError(status.UNAUTHORIZED, "You are not authorized")
        );
      }

      if (
        userData.role !== decodedData.userRole ||
        userData.email !== decodedData.userEmail
      ) {
        return next(
          new AppError(status.UNAUTHORIZED, "You are not authorized")
        );
      }

      req.user = decodedData;

      return next();
    } catch (error) {
      return next(new AppError(status.UNAUTHORIZED, "You are not authorized"));
    }
  };
