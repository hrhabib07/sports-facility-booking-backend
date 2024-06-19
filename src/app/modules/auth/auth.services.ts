import httpStatus from "http-status";
import AppError from "../../errors/appError";
import { User } from "../users/user.model";
import { TUserLogin, TUserSignIn } from "./auth.interface";
import jwt, { JwtPayload } from "jsonwebtoken";
import { isPasswordMatch } from "./auth.utils";
import config from "../../config";
import { sendEmail } from "../../utils/sendEmail";
import bcrypt from 'bcrypt';

const signInUserIntoDB = async (payload: TUserSignIn) => {
  // check if user Exist
  const doesUserExist = await User.findOne({ email: payload.email });
  if (doesUserExist) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "user already exist with this email",
    );
  }

  const result = await User.create(payload);
  return result;
};

const loginUserIntoDB = async (payload: TUserLogin) => {
  const existingUser = await User.findOne({ email: payload.email }).select(
    "+password",
  );
  if (!existingUser) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "user does not exist with this email",
    );
  }

  const isMatched = await isPasswordMatch(
    payload.password,
    existingUser.password,
  );
  if (!isMatched) {
    throw new AppError(httpStatus.BAD_REQUEST, "invalid password");
  }

  const jwtPayload = {
    email: existingUser.email,
    role: existingUser.role,
  };
  // crate jwt token
  const accessToken = jwt.sign(jwtPayload, config.jwt_access_secret as string, {
    expiresIn: config.jwt_access_expires_in,
  });
  const refreshToken = jwt.sign(
    jwtPayload,
    config.jwt_refresh_secret as string,
    { expiresIn: config.jwt_refresh_expires_in },
  );

  const loggedInUser = await User.findOne({ email: payload.email });
  return {
    accessToken,
    refreshToken,
    result: loggedInUser,
  };
};

const forgotPasswordService = async (email: string) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "You are not a registered User")
  }
  const accessToken = jwt.sign({ email }, config.jwt_access_secret as string, { expiresIn: '10m' });

  const resetPasswordUrl = `${config.forgot_password_url}?email=${email}&token=${accessToken}`;

  sendEmail(email, resetPasswordUrl);
  console.log(resetPasswordUrl);
};

const resetPasswordService = async (email: string, newPassword: string, accessToken: string) => {
  // check if the user exist 
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "You are not a registered User")
  }
  const decoded: JwtPayload = jwt.verify(accessToken, config.jwt_access_secret as string) as JwtPayload;
  if (email !== decoded?.email) {
    throw new AppError(httpStatus.FORBIDDEN, "Your email is not valid");
  };
  const hashedNewPassword = await bcrypt.hash(newPassword, Number(config.salt_round));

  const result = await User.findOneAndUpdate({ email }, { password: hashedNewPassword }, { new: true });
  return result;
}



export const AuthServices = {
  signInUserIntoDB,
  loginUserIntoDB,
  forgotPasswordService,
  resetPasswordService
};
