import { NextFunction, Request, Response } from "express";
import AppError from "../../errors/AppError";
import status from "http-status";
import { TUserRole } from "./auth.interface";

import { jsonWebToken } from "../../utils/jwt/jwt";
import { app_config } from "../../config";

import { eq } from "drizzle-orm";
import { db } from "../../db";
import { User } from "../../db/schema/user.schema";

import { UserAuthentication } from "../../db/schema/user.authentication";
import { UserProfile } from "../../db/schema/userProfile.schema";

export const auth =
  (...user_role: TUserRole[]) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const token_with_bearer = req.headers.authorization as string;

      if (!token_with_bearer || !token_with_bearer.startsWith("Bearer")) {
        return next(
          new AppError(status.UNAUTHORIZED, "You are not authorized")
        );
      }

      const token = token_with_bearer.split(" ")[1];

      if (token === "null") {
        return next(
          new AppError(status.UNAUTHORIZED, "You are not authorized")
        );
      }

      const decoded_data = jsonWebToken.verifyJwt(
        token,
        app_config.jwt.jwt_access_secret as string
      );

      // Fetch user with profile and authentication via LEFT JOIN
      const [user_data] = await db
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
        .where(eq(User.id, decoded_data.user_id));

      if (!user_data) {
        return next(
          new AppError(status.UNAUTHORIZED, "You are not authorized")
        );
      }

      if (user_role.length && !user_role.includes(decoded_data.user_role)) {
        return next(
          new AppError(status.UNAUTHORIZED, "You are not authorized")
        );
      }

      if (
        user_data.role !== decoded_data.user_role ||
        user_data.email !== decoded_data.user_email
      ) {
        return next(
          new AppError(status.UNAUTHORIZED, "You are not authorized")
        );
      }

      req.user = decoded_data;

      return next();
    } catch (error) {
      return next(new AppError(status.UNAUTHORIZED, "You are not authorized"));
    }
  };
