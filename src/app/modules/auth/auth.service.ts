import { auth } from "./../../middlewares/auth/auth";
import status from "http-status";
import AppError from "../../errors/AppError";
import comparePassword from "../../utils/helper/comparePassword";
import isExpired from "../../utils/helper/isExpired";
import getExpiryTime from "../../utils/helper/getExpiryTime";
import getOtp from "../../utils/helper/getOtp";

import getHashedPassword from "../../utils/helper/getHashedPassword";
import { jsonWebToken } from "../../utils/jwt/jwt";
import { app_config } from "../../config";

import { eq, and } from "drizzle-orm";
import { db } from "../../db";

import { User } from "../../db/schema/user.schema";

import { UserAuthentication } from "../../db/schema/user.authentication";
import { publishJob } from "../../lib/rabbitMq/publisher";
import { UserProfile } from "../../db/schema/userProfile.schema";
import { IAuthData, TUserRole } from "../../middlewares/auth/auth.interface";

// Create user
const createUser = async (data: {
  email: string;
  full_name: string;
  password: string;
}) => {
  const hashed_password = await getHashedPassword(data.password);
  const otp = getOtp(5).toString();
  const exp_date = getExpiryTime(5);

  return await db.transaction(async (tx) => {
    // 1️⃣ Check if a user with this email exists
    const [existing_user] = await tx
      .select()
      .from(User)
      .where(eq(User.email, data.email))
      .limit(1);

    // 2️⃣ If exists and not verified, delete the old user and related data
    if (existing_user && !existing_user.is_verified) {
      await tx
        .delete(UserAuthentication)
        .where(eq(UserAuthentication.user_id, existing_user.id));
      await tx
        .delete(UserProfile)
        .where(eq(UserProfile.user_id, existing_user.id));
      await tx.delete(User).where(eq(User.id, existing_user.id));
    } else if (existing_user) {
      // If user exists and is verified, stop creation
      throw new Error("Email already in use.");
    }

    // 3️⃣ Insert new user
    const [created_user] = await tx
      .insert(User)
      .values({
        email: data.email,
        password: hashed_password,
      })
      .returning({ id: User.id, email: User.email });

    // 4️⃣ Insert profile
    await tx.insert(UserProfile).values({
      user_id: created_user.id,
      full_name: data.full_name,
    });

    // 5️⃣ Insert authentication
    await tx.insert(UserAuthentication).values({
      user_id: created_user.id,
      otp,
      exp_date: exp_date,
    });

    // 6️⃣ Send OTP email (using job)
    await publishJob("email_queue", {
      to: data.email,
      subject: "Email Verification Code",
      body: otp,
    });

    return {
      ...created_user,
      password: null,
    };
  });
};

// User login
const userLogin = async (login_data: { email: string; password: string }) => {
  const [user_data] = await db
    .select({
      id: User.id,
      email: User.email,
      password: User.password,
      role: User.role,
      is_verified: User.is_verified,
      is_blocked: User.is_blocked,
      is_deleted: User.is_deleted,
    })
    .from(User)
    .where(eq(User.email, login_data.email))
    .limit(1);

  if (!user_data) throw new AppError(status.UNAUTHORIZED, "Email not matched");
  if (
    !(await comparePassword(login_data.password, user_data.password as string))
  )
    throw new AppError(status.UNAUTHORIZED, "Password not match");
  if (!user_data.is_verified)
    throw new AppError(status.UNAUTHORIZED, "You are not verified.");
  if (user_data.is_blocked)
    throw new AppError(status.UNAUTHORIZED, "You are blocked.");
  if (user_data.is_deleted)
    throw new AppError(status.UNAUTHORIZED, "Account deleted.");

  const token_data = {
    user_role: user_data.role,
    user_email: user_data.email,
    user_id: user_data.id,
  };

  const access_token = jsonWebToken.generateToken(
    token_data as IAuthData,
    app_config.jwt.jwt_access_secret as string,
    app_config.jwt.jwt_access_expire
  );
  const refresh_token = jsonWebToken.generateToken(
    token_data as IAuthData,
    app_config.jwt.jwt_refresh_secret as string,
    app_config.jwt.jwt_refresh_expire
  );

  return {
    user_data: { ...user_data, password: undefined },
    access_token,
    refresh_token,
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
  // 1️⃣ Fetch user with authentication using LEFT JOIN
  const [result] = await db
    .select({
      user: User,
      auth: UserAuthentication,
    })
    .from(User)
    .leftJoin(UserAuthentication, eq(User.id, UserAuthentication.user_id))
    .where(eq(User.email, email));

  if (!result?.user) throw new AppError(status.BAD_REQUEST, "User not found.");

  console.log(result);

  const auth = result.auth;

  if (!auth) {
    throw new AppError(status.BAD_REQUEST, "User auth record not found.");
  }

  // 2️⃣ Check if previous OTP exists and is not expired
  if (auth.otp && auth.exp_date && !isExpired(auth.exp_date)) {
    throw new AppError(
      status.BAD_REQUEST,
      "Use your previous code. Code is still valid."
    );
  }

  // 3️⃣ Generate new OTP and expiry
  const otp = getOtp(5).toString();
  const exp_date = getExpiryTime(5);

  // 4️⃣ Update authentication
  await db.transaction(async (tx) => {
    await tx
      .update(UserAuthentication)
      .set({ otp, exp_date: exp_date })
      .where(eq(UserAuthentication.id, auth.id));
  });

  // 5️⃣ Send OTP via email
  await publishJob("email_queue", {
    to: email,
    subject: "Email Verification Code",
    body: `Your verification code is: ${otp}`,
  });

  return { message: "New OTP sent successfully" };
};

const forgotPasswordRequest = async (email: string) => {
  const expires_at = getExpiryTime(10);
  const otp = getOtp(4);
  const [profile] = await db
    .select({
      id: User.id,
      email: User.email,

      authId: UserAuthentication.id,
    })
    .from(User)
    .leftJoin(UserAuthentication, eq(User.id, UserAuthentication.user_id))
    .where(eq(User.email, email));

  if (!profile) throw new Error("Profile not found");

  const newAuthData = {
    otp: otp.toString(),
    exp_date: expires_at,
    need_to_reset_pass: false,
    token: null,
  };

  if (profile.authId) {
    await db
      .update(UserAuthentication)
      .set(newAuthData)
      .where(eq(UserAuthentication.id, profile.authId));
  }

  await publishJob("email_queue", {
    to: email,
    subject: "Reset Password Verification Code",
    body: otp.toString(),
  });

  return { message: "Code sent." };
};

const verifyReset = async (email: string, otp: string) => {
  const expDate = getExpiryTime(10);
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

  const token = jsonWebToken.generateToken(
    {
      user_email: user.email,
      user_id: user.id,
      user_role: user.role as TUserRole,
    },
    app_config.jwt.jwt_access_secret as string,
    "10m"
  );

  await db.transaction(async (tx) => {
    await tx
      .update(User)
      .set({
        need_to_reset_pass: true,
      })
      .where(eq(User.id, user.id));

    await tx
      .update(UserAuthentication)
      .set({
        otp: null,
        exp_date: expDate,
        token: token,
      })
      .where(eq(UserAuthentication.id, auth.id));
  });

  // Optionally return tokens
  return {
    message: "Reset request verified successfully",
  };
};

const resetPassword = async (
  token: string,
  userData: {
    new_password: string;
    confirm_password: string;
  }
) => {
  const { new_password, confirm_password } = userData;

  if (!token) {
    throw new AppError(
      status.BAD_REQUEST,
      "You are not allowed to reset password."
    );
  }

  if (new_password !== confirm_password) {
    throw new AppError(500, "Password not matched");
  }

  const { user_id } = jsonWebToken.decodeToken(token);
  console.log(user_id);
  const [userAuthData] = await db
    .select()
    .from(UserAuthentication)
    .where(eq(UserAuthentication.user_id, user_id));

  if ((userAuthData?.token as string) !== token) {
    throw new AppError(500, "Token not matched");
  }

  if (isExpired(userAuthData.exp_date)) {
    throw new AppError(500, "Token time expired.");
  }

  const hashedPassword = await getHashedPassword(new_password);

  await db
    .update(User)
    .set({ password: hashedPassword, need_to_reset_pass: false })
    .where(eq(User.id, user_id));

  await db
    .update(UserAuthentication)
    .set({ token: null, otp: null, exp_date: null })
    .where(eq(UserAuthentication.user_id, user_id));

  return { message: "Password reset success." };
};

const updatePassword = async (
  userId: string,
  passData: {
    new_password: string;
    confirm_password: string;
    old_password: string;
  }
) => {
  const { confirm_password, old_password, new_password } = passData;

  const [userData] = await db
    .select({ user_id: User.id, password: User.password })
    .from(User)
    .where(eq(User.id, userId));

  if (!userData) {
    throw new AppError(404, "User not found.");
  }

  const isMatch = await comparePassword(old_password, userData.password);
  if (!isMatch) {
    throw new AppError(400, "Old password not matched.");
  }

  if (new_password !== confirm_password) {
    throw new AppError(400, "Passwords do not match.");
  }

  const hashedPassword = await getHashedPassword(new_password);

  await db
    .update(User)
    .set({ password: hashedPassword, need_to_reset_pass: false })
    .where(eq(User.id, userData.user_id));

  return { message: "Password updated successfully." };
};

const getNewAccessToken = async (refreshToken: string) => {
  if (!refreshToken) {
    throw new AppError(status.UNAUTHORIZED, "Refresh token not found.");
  }
  const decoded = jsonWebToken.verifyJwt(
    refreshToken,
    app_config.jwt.jwt_refresh_secret as string
  );
  const { user_email, user_id, user_role } = decoded;

  if (user_email && user_id && user_role) {
    const jwt_payload = {
      user_email,
      user_id,
      user_role,
    };

    const access_token = jsonWebToken.generateToken(
      jwt_payload,
      app_config.jwt.jwt_access_secret as string,
      app_config.jwt.jwt_access_expire
    );

    return { access_token };
  } else {
    throw new AppError(status.UNAUTHORIZED, "You are unauthorized.");
  }
};
export const AuthService = {
  createUser,
  userLogin,
  verifyUser,
  forgotPasswordRequest,
  verifyReset,
  resetPassword,
  getNewAccessToken,
  updatePassword,
  resendCode,
};
