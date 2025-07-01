import status from "http-status";
import AppError from "../../errors/AppError";
import comparePassword from "../../utils/helper/comparePassword";
import isExpired from "../../utils/helper/isExpired";
import getExpiryTime from "../../utils/helper/getExpiryTime";
import getOtp from "../../utils/helper/getOtp";
import { sendEmail } from "../../utils/sendEmail";
import getHashedPassword from "../../utils/helper/getHashedPassword";
import { jsonWebToken } from "../../utils/jwt/jwt";
import { appConfig } from "../../config";
import { dispatchJob } from "../../rabbitMq/jobs";

import { eq, and } from "drizzle-orm";
import { db } from "../../db/db";
import { users } from "../../db/schema/user.schema";
import { userProfile } from "../../db/schema/userProfile.schema";
import { userAuthentication } from "../../db/schema/user.authentication";

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
      .insert(users)
      .values({
        email: data.email,
        password: hashedPassword,
      })
      .returning({ id: users.id, email: users.email });

    // Insert profile
    await tx.insert(userProfile).values({
      userId: createdUser.id,
      fullName: data.fullName,
    });

    // Insert authentication
    await tx.insert(userAuthentication).values({
      userId: createdUser.id,
      otp,
      expDate,
    });

    // Send OTP email (using job)
    await dispatchJob({
      type: "email",
      data: {
        to: data.email,
        subject: "Verify your account",
        text: `Your OTP is ${otp}`,
      },
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
      id: users.id,
      email: users.email,
      password: users.password,
      role: users.role,
      isVerified: users.isVerified,
      isBlocked: users.isBlocked,
      isDeleted: users.isDeleted,
    })
    .from(users)
    .where(eq(users.email, loginData.email))
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
  const [user] = await db.select().from(users).where(eq(users.email, email));

  if (!user) {
    throw new AppError(status.BAD_REQUEST, "User not found.");
  }

  const [auth] = await db
    .select()
    .from(userAuthentication)
    .where(eq(userAuthentication.userId, user.id));

  if (!auth || !auth.otp || !auth.expDate) {
    throw new AppError(status.BAD_REQUEST, "No OTP request found.");
  }

  if (isExpired(auth.expDate)) {
    throw new AppError(status.BAD_REQUEST, "OTP has expired.");
  }

  if (auth.otp !== otp) {
    throw new AppError(status.BAD_REQUEST, "OTP is incorrect.");
  }

  await db.transaction(async (tx) => {
    await tx
      .update(users)
      .set({
        isVerified: true,
        needToResetPass: false,
      })
      .where(eq(users.id, user.id));

    await tx
      .update(userAuthentication)
      .set({
        otp: null,
        expDate: null,
      })
      .where(eq(userAuthentication.id, auth.id));
  });

  // Optionally return tokens
  return {
    message: "User verified successfully",
  };
};

const resendCode = async (email: string) => {
  const [user] = await db.select().from(users).where(eq(users.email, email));

  if (!user) {
    throw new AppError(status.BAD_REQUEST, "User not found.");
  }

  const [auth] = await db
    .select()
    .from(userAuthentication)
    .where(eq(userAuthentication.userId, user.id));

  if (!auth) {
    throw new AppError(status.BAD_REQUEST, "User auth record not found.");
  }

  if (!isExpired(auth.expDate)) {
    throw new AppError(
      status.BAD_REQUEST,
      "Use your previous code. Code is still valid."
    );
  }

  const otp = getOtp(5).toString();
  const expDate = getExpiryTime(5);

  await db.transaction(async (tx) => {
    await tx
      .update(userAuthentication)
      .set({ otp, expDate })
      .where(eq(userAuthentication.id, auth.id));

    await sendEmail(email, "Verification code", otp);
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
