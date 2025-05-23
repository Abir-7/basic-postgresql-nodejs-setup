import status from "http-status";
import { myDataSource } from "../../db/database";
import AppError from "../../errors/AppError";
import comparePassword from "../../utils/helper/comparePassword";
import isExpired from "../../utils/helper/isExpired";
import logger from "../../utils/logger";
import { User } from "../users/user/user.entity";
import { UserAuthentication } from "../users/userAuthentication/user_authentication.entity";
import getExpiryTime from "../../utils/helper/getExpiryTime";
import getOtp from "../../utils/helper/getOtp";
import { sendEmail } from "../../utils/sendEmail";

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

  if (isExpired(userData.authentication.expDate)) {
    throw new Error("You are not varified.");
  } else {
    logger.info("You have time");
  }

  if (!userData.isVerified) {
    throw new Error("You are not varified.");
  }

  return;
};

const verifyUser = async (email: string, otp: string) => {
  let updatedUserRepo;
  let updatedAuthRepo;
  const userRepo = myDataSource.getRepository(User);
  const authRepo = myDataSource.getRepository(UserAuthentication);
  const userData = await userRepo.findOne({
    where: { email: email },
  }); // you don't need to mention relation if "eager" is true in user repo

  if (!userData) {
    throw new AppError(status.BAD_REQUEST, "User not found.");
  }

  if (userData.id && userData.isVerified === false) {
    if (
      userData &&
      userData?.authentication.expDate &&
      isExpired(userData?.authentication.expDate)
    ) {
      throw new AppError(status.BAD_REQUEST, "Time is Expired.");
    } else {
      if (userData.authentication.otp === otp) {
        updatedUserRepo = await userRepo.preload({
          id: userData.id,
          //field to update
          isVerified: true,
        });
        updatedAuthRepo = await authRepo.preload({
          id: userData.authentication.id,
          // data that you want to save
          otp: null,
          expDate: null,
        });

        if (!updatedAuthRepo || !updatedUserRepo) {
          throw new AppError(
            status.BAD_REQUEST,
            "Failed to verify. Try again."
          );
        }
        await authRepo.save(updatedAuthRepo);
        await userRepo.save(updatedUserRepo);
      } else {
        throw new AppError(status.BAD_REQUEST, "Code not matched.");
      }
    }
  } else {
    // other logic

    if (userData.isVerified && userData.needToResetPass) {
      console.log("other logic");
    } else {
      throw new AppError(status.BAD_REQUEST, "Suspecious activities.");
    }
  }

  return {
    accessToken: "",
    refreshToken: "",
    user: { ...updatedUserRepo, password: "" },
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
  userLogin,
  verifyUser,
  forgotPasswordRequest,
  resetPassword,
  getNewAccessToken,
  updatePassword,
  resendCode,
};
