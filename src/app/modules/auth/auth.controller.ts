import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AuthServices } from "./auth.services";
import config from "../../config";

const signInUser = catchAsync(async (req, res) => {
  const result = await AuthServices.signInUserIntoDB(req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User registered successfully",
    data: result,
  });
});
const logInUser = catchAsync(async (req, res) => {
  const { accessToken, refreshToken, result } =
    await AuthServices.loginUserIntoDB(req.body);

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: config.node_env === "production",
  });

  res.json({
    success: true,
    statusCode: httpStatus.OK,
    message: "User logged in successfully",
    token: accessToken,
    data: result,
  });
});
const forgotPassword = catchAsync(async (req, res) => {
  const result = await AuthServices.forgotPasswordService(req.body.email);
  res.json({
    success: true,
    statusCode: httpStatus.OK,
    message: "Reset Password Email send successfully",
    data: result
  });
});

const resetPassword = catchAsync(async (req, res) => {
  const accessToken = req.headers.authorization;
  const result = await AuthServices.resetPasswordService(req.body.email, req.body.newPassword, accessToken as string);
  res.json({
    success: true,
    statusCode: httpStatus.OK,
    message: "Reset password is successful",
    data: result
  });
});

export const authController = {
  signInUser,
  logInUser,
  forgotPassword,
  resetPassword
};
