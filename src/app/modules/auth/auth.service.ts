import status from "http-status";
import AppError from "../../errors/AppError";
import comparePassword from "../../utils/helper/comparePassword";
import isExpired from "../../utils/helper/isExpired";
import getExpiryTime from "../../utils/helper/getExpiryTime";
import getOtp from "../../utils/helper/getOtp";

import getHashedPassword from "../../utils/helper/getHashedPassword";
import { jsonWebToken } from "../../utils/jwt/jwt";
import { appConfig } from "../../config";

import { eq, and } from "drizzle-orm";
import { db } from "../../db/db";

import { publishJob } from "../../rabbitMq/publisher";
import { User } from "../../db/schema/user.schema";
import { UserProfile } from "../../db/schema/userProfile.schema";
import { UserAuthentication } from "../../db/schema/user.authentication";

// Create user
const createUser = async (data: {
  email: string;
  fullName: string;
  password: string;
}) => {
  const hashedPassword = await getHashedPassword(data.password);
  const otp = getOtp(5).toString();
  const expDate = getExpiryTime(5);

  return await db.transaction(async (tx) => {
    // Insert user
    const [createdUser] = await tx
      .insert(User)
      .values({
        email: data.email,
        password: hashedPassword,
      })
      .returning({ id: User.id, email: User.email });

    // Insert profile
    await tx.insert(UserProfile).values({
      user_id: createdUser.id,
      full_name: data.fullName,
    });

    // Insert authentication
    await tx.insert(UserAuthentication).values({
      user_id: createdUser.id,
      otp,
      exp_date: expDate,
    });

    // Send OTP email (using job)
    await publishJob("email_queue", {
      to: data.email,
      subject: "Email Verification Code",
      body: otp.toString(),
    });

    return {
      ...createdUser,
      password: null,
      authentication: {},
    };
  });
};

// User login
const userLogin = async (loginData: { email: string; password: string }) => {
  const [userData] = await db
    .select({
      id: User.id,
      email: User.email,
      password: User.password,
      role: User.role,
      isVerified: User.is_verified,
      isBlocked: User.is_blocked,
      isDeleted: User.is_deleted,
    })
    .from(User)
    .where(eq(User.email, loginData.email))
    .limit(1);

  if (!userData)
    throw new AppError(status.UNAUTHORIZED, "Invalid credentials: email");
  if (!(await comparePassword(loginData.password, userData.password as string)))
    throw new AppError(status.UNAUTHORIZED, "Invalid credentials: password");
  if (!userData.isVerified)
    throw new AppError(status.UNAUTHORIZED, "You are not verified.");
  if (userData.isBlocked)
    throw new AppError(status.UNAUTHORIZED, "You are blocked.");
  if (userData.isDeleted)
    throw new AppError(status.UNAUTHORIZED, "Account deleted.");

  const tokenData = {
    userRole: userData.role,
    userEmail: userData.email,
    userId: userData.id,
  };

  const accessToken = jsonWebToken.generateToken(
    tokenData,
    appConfig.jwt.jwt_access_secret as string,
    appConfig.jwt.jwt_access_exprire
  );
  const refreshToken = jsonWebToken.generateToken(
    tokenData,
    appConfig.jwt.jwt_refresh_secret as string,
    appConfig.jwt.jwt_refresh_exprire
  );

  return {
    userData: { ...userData, password: undefined },
    accessToken,
    refreshToken,
  };
};

const verifyUser = async (email: string, otp: string) => {
  const [user] = await db.select().from(User).where(eq(User.email, email));

  if (!user) {
    throw new AppError(status.BAD_REQUEST, "User not found.");
  }

  const [auth] = await db
    .select()
    .from(UserAuthentication)
    .where(eq(UserAuthentication.user_id, user.id));

  if (!auth || !auth.otp || !auth.exp_date) {
    throw new AppError(status.BAD_REQUEST, "No OTP request found.");
  }

  if (isExpired(auth.exp_date)) {
    throw new AppError(status.BAD_REQUEST, "OTP has expired.");
  }

  if (auth.otp !== otp) {
    throw new AppError(status.BAD_REQUEST, "OTP is incorrect.");
  }

  await db.transaction(async (tx) => {
    await tx
      .update(User)
      .set({
        is_verified: true,
        need_to_reset_pass: false,
      })
      .where(eq(User.id, user.id));

    await tx
      .update(UserAuthentication)
      .set({
        otp: null,
        exp_date: null,
      })
      .where(eq(UserAuthentication.id, auth.id));
  });

  // Optionally return tokens
  return {
    message: "User verified successfully",
  };
};

const resendCode = async (email: string) => {
  const [user] = await db.select().from(User).where(eq(User.email, email));

  if (!user) {
    throw new AppError(status.BAD_REQUEST, "User not found.");
  }

  const [auth] = await db
    .select()
    .from(UserAuthentication)
    .where(eq(UserAuthentication.user_id, user.id));

  if (!auth) {
    throw new AppError(status.BAD_REQUEST, "User auth record not found.");
  }

  if (!isExpired(auth.exp_date)) {
    throw new AppError(
      status.BAD_REQUEST,
      "Use your previous code. Code is still valid."
    );
  }

  const otp = getOtp(5).toString();
  const expDate = getExpiryTime(5);

  await db.transaction(async (tx) => {
    await tx
      .update(UserAuthentication)
      .set({ otp, exp_date: expDate })
      .where(eq(UserAuthentication.id, auth.id));
  });

  await publishJob("email_queue", {
    to: email,
    subject: "Email Verification Code",
    body: otp.toString(),
  });

  return { message: "Code sent" };
};

const forgotPasswordRequest = async (email: string) => {};
const resetPassword = async (
  token: string,
  userData: {
    new_password: string;
    confirm_password: string;
  }
) => {};
const updatePassword = async (
  userId: string,
  passData: {
    new_password: string;
    confirm_password: string;
    old_password: string;
  }
) => {};

const getNewAccessToken = async (refreshToken: string) => {};
export const AuthService = {
  createUser,
  userLogin,
  verifyUser,
  forgotPasswordRequest,
  resetPassword,
  getNewAccessToken,
  updatePassword,
  resendCode,
};
