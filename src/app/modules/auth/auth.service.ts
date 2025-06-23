import status from "http-status";
import { myDataSource } from "../../db/database";
import AppError from "../../errors/AppError";
import comparePassword from "../../utils/helper/comparePassword";
import isExpired from "../../utils/helper/isExpired";

import { User } from "../users/user/user.entity";
import { UserAuthentication } from "../users/userAuthentication/user_authentication.entity";
import getExpiryTime from "../../utils/helper/getExpiryTime";
import getOtp from "../../utils/helper/getOtp";
import { sendEmail } from "../../utils/sendEmail";
import getHashedPassword from "../../utils/helper/getHashedPassword";
import { jsonWebToken } from "../../utils/jwt/jwt";
import { appConfig } from "../../config";
import { dispatchJob } from "../../rabbitMq/jobs";

const createUser = async (data: {
  email: string;
  fullName: string;
  password: string;
}) => {
  const userData = {
    email: data.email,
    password: await getHashedPassword(data.password),
  };

  const userProfile = {
    fullName: data.fullName,
  };
  const otp = getOtp(5).toString();
  const userAuthentication = {
    otp: otp,
    token: null,
    expDate: getExpiryTime(5),
  };

  const userRepo = myDataSource.getRepository(User);
  const createUser = userRepo.create({
    ...userData,
    userProfile: userProfile,
    authentication: userAuthentication,
  });
  const savedUser = await userRepo.save(createUser);

  // await sendEmail(
  //   data.email,
  //   "Email Verification Code",
  //   `Your code is: ${otp}`
  // );

  await dispatchJob({
    type: "email",
    data: {
      to: data.email,
      subject: "Verify your account",
      text: `Your OTP is ${otp}`,
    },
  });

  return { ...savedUser, authentication: {}, password: null };
};

const userLogin = async (loginData: { email: string; password: string }) => {
  const userData = await myDataSource.getRepository(User).findOne({
    where: { email: loginData.email },
    relations: ["userProfile", "authentication"],
  });
  console.log("object", userData);
  if (!userData) {
    throw new Error("Invalid credentials: email");
  }

  if (!(await comparePassword(loginData.password, userData.password))) {
    throw new Error("Invalid credentials: password");
  }

  if (!userData.isVerified) {
    throw new Error("You are not varified.");
  }

  if (userData.isBlocked) {
    throw new Error("You are blocked");
  }
  if (userData.isDeleted) {
    throw new Error("Account deleted");
  }

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
    userData,
    accessToken,
    refreshToken,
  };
};

const verifyUser = async (email: string, otp: string) => {
  const userRepo = myDataSource.getRepository(User);
  const user = await userRepo.findOne({
    where: { email },
  });

  if (!user) {
    throw new AppError(status.BAD_REQUEST, "User not found.");
  }

  const auth = user.authentication;

  if (!auth || !auth.otp || !auth.expDate) {
    throw new AppError(status.BAD_REQUEST, "No OTP request found.");
  }

  if (isExpired(auth.expDate)) {
    throw new AppError(status.BAD_REQUEST, "OTP has expired.");
  }

  if (auth.otp !== otp) {
    throw new AppError(status.BAD_REQUEST, "OTP is incorrect.");
  }

  if (user.isVerified) {
    user.needToResetPass = !user.isVerified;
  } else {
    user.isVerified = true;
  }

  auth.otp = null;
  auth.expDate = null;

  await userRepo.save(user);

  return {
    accessToken: "",
    refreshToken: "",
    user: { ...user, password: "" },
  };
};

const forgotPasswordRequest = async (email: string) => {};

const resendCode = async (email: string) => {
  const userRepo = myDataSource.getRepository(User);
  const authRepo = myDataSource.getRepository(UserAuthentication);
  const userData = await userRepo.findOne({ where: { email } });

  if (!userData || !userData.authentication) {
    throw new AppError(status.BAD_REQUEST, "User not found.");
  }

  const { authentication } = userData;

  if (!authentication.otp) {
    throw new AppError(status.BAD_REQUEST, "We can't send you code.");
  }

  if (!isExpired(authentication.expDate)) {
    throw new AppError(
      status.BAD_REQUEST,
      "Use your previous code. Code is still valid."
    );
  }

  const otp = getOtp(5);
  const expDate = getExpiryTime(5);

  const updatedAuth = await authRepo.preload({
    id: authentication.id,
    expDate,
    otp: otp.toString(),
  });
  if (!updatedAuth) {
    throw new AppError(status.BAD_REQUEST, "Failed to send code. Try again.");
  }

  await myDataSource.transaction(async (transactionalEntityManager) => {
    try {
      await sendEmail(email, "verification code", otp.toString());

      await transactionalEntityManager.save(UserAuthentication, updatedAuth);
    } catch (error) {
      throw new AppError(status.BAD_REQUEST, "Failed to send code. Try again.");
    }
  });
  return { message: "Code sent" };
};

const resetPassword = async (
  token: string,
  userData: {
    new_password: string;
    confirm_password: string;
  }
) => {};

const getNewAccessToken = async (refreshToken: string) => {};

const updatePassword = async (
  userId: string,
  passData: {
    new_password: string;
    confirm_password: string;
    old_password: string;
  }
) => {};

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
