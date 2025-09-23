/* eslint-disable @typescript-eslint/no-unused-vars */
import status from "http-status";
import catchAsync from "../../utils/serverTools/catchAsync";
import sendResponse from "../../utils/serverTools/sendResponse";
import { AuthService } from "./auth.service";
import { app_config } from "../../config";

const createUser = catchAsync(async (req, res) => {
  const user_data = req.body;
  const result = await AuthService.createUser(user_data);

  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "User successfully created.Check your email for code.",
    data: result,
  });
});

const userLogin = catchAsync(async (req, res, next) => {
  const result = await AuthService.userLogin(req.body);

  res.cookie("refresh_token", result.refresh_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    //sameSite: "strict",
    maxAge: 365 * 24 * 60 * 60 * 1000, // 365 days in milliseconds
  });

  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "User login successfull",
    data: result,
  });
});

const verifyUser = catchAsync(async (req, res, next) => {
  const { email, otp } = req.body;
  const result = await AuthService.verifyUser(email, otp);

  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Verification successfull",
    data: result,
  });
});

const forgotPasswordRequest = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  const result = await AuthService.forgotPasswordRequest(email);

  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "A verification code is sent to your email.",
    data: result,
  });
});

const verifyReset = catchAsync(async (req, res, next) => {
  const { email, otp } = req.body;
  const result = await AuthService.verifyReset(email, otp);

  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Reset password req verified.",
    data: result,
  });
});
const resendCode = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  const result = await AuthService.resendCode(email);

  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "A verification code is sent to your email.",
    data: result,
  });
});

const resetPassword = catchAsync(async (req, res, next) => {
  const token_with_bearer = req.headers.authorization as string;
  const token = token_with_bearer.split(" ")[1];

  const result = await AuthService.resetPassword(token as string, req.body);

  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Password reset successfully",
    data: result,
  });
});

const getNewAccessToken = catchAsync(async (req, res) => {
  const refresh_token = req.cookies.refresh_token;
  const result = await AuthService.getNewAccessToken(refresh_token);
  sendResponse(res, {
    data: result,
    success: true,
    statusCode: status.OK,
    message: "New access-token is created.",
  });
});

const updatePassword = catchAsync(async (req, res) => {
  const { user_id } = req.user;

  const result = await AuthService.updatePassword(user_id, req.body);
  sendResponse(res, {
    data: result,
    success: true,
    statusCode: status.OK,
    message: "Password successfully updated",
  });
});

export const AuthController = {
  createUser,
  verifyUser,
  forgotPasswordRequest,
  verifyReset,
  resetPassword,
  resendCode,
  userLogin,
  getNewAccessToken,
  updatePassword,
};
