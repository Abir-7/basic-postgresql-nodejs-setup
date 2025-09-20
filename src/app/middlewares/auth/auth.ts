import { NextFunction, Request, Response } from "express";
import AppError from "../../errors/AppError";
import status from "http-status";
import { TUserRole } from "./auth.interface";

import { jsonWebToken } from "../../utils/jwt/jwt";
import { appConfig } from "../../config";

import { eq } from "drizzle-orm";
import { db } from "../../db/db";
import { User } from "../../db/schema/user.schema";
import { UserProfile } from "../../db/schema/userProfile.schema";
import { UserAuthentication } from "../../db/schema/user.authentication";

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
          id: User.id,
          email: User.email,
          role: User.role,
          isVerified: User.is_verified,
          profileFullName: UserProfile.full_name,
          profilePhone: UserProfile.phone,
          authToken: UserAuthentication.token,
          authOtp: UserAuthentication.otp,
          authExpDate: UserAuthentication.exp_date,
        })
        .from(User)
        .leftJoin(UserProfile, eq(User.id, UserProfile.user_id))
        .leftJoin(UserAuthentication, eq(User.id, UserAuthentication.user_id))
        .where(eq(User.id, decodedData.userId));

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
