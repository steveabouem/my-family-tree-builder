import dayjs from "dayjs";
import bcrypt from "bcryptjs";
import { APILoginResponse, APILogoutResponse, APIRegistrationResponse, LoginRequestPayload, PasswordChangeRequestPayload } from "./types";
import { ServiceResponseWithPayload } from "./types";
import logger from "../utils/logger";
import { Op } from "sequelize";
import { createUser, getUserByEmail, updatePassword } from "./user";
import { generateResponseData } from "./serviceHelpers";
import User from "../models/User";

export const register = async (userData: any): Promise<ServiceResponseWithPayload<APIRegistrationResponse | null>> => {
  const ip = userData.ip;
  const formattedValues = { ...userData, assigned_ips: [ip], created_at: dayjs() };
  let response: ServiceResponseWithPayload<APIRegistrationResponse | null> = {
    error: true,
    code: 500,
    payload: { authenticated: false, email: '', userId: 0, }
  };

  const duplicate = await getUserByEmail(userData.email);
  if (duplicate) {
    response.error = true;
    logger.error('Email address is already in use');
    response.code = 400;
    return response;
  }

  const userResponse = await createUser(formattedValues);
  if (userResponse.code === 200) {
    logger.info('New user created ', userResponse);
  } else {
    logger.error('Unable to create new user: ', userResponse);
  }

  return userResponse;
};

export const login = async ({ email, password }: LoginRequestPayload): Promise<ServiceResponseWithPayload<APILoginResponse>> => {
  const payloadData = { authenticated: false, email: '', userId: 0 };
  const response: ServiceResponseWithPayload<APILoginResponse> = generateResponseData(payloadData);

  try {
    const currentUser = await User.findOne({ where: { email: { [Op.eq]: email } } })

    if (!currentUser) {
      response.error = true;
      response.message = 'Unable to find user';
      logger.error('! login ! User not found');
      return response;
    }
    const passwordIsValid = bcrypt.compareSync(password, currentUser.password);
    if (passwordIsValid) {
      response.error = false;
      response.payload = {
        userId: currentUser.id,
        authenticated: true,
        email: email,
        firstName: currentUser.first_name,
        lastName: currentUser.last_name,
      }
      response.code = 200;
    } else {
      response.error = true;
      logger.error('! login ! User authentication failed');
      response.message = 'Unable to authenticate user';
      response.code = 400;
    }
  } catch (e: unknown) {
    response.message = `Login failed - ${e}`;
    logger.error('! login !', e);
    response.code = 400;
  }
  return response;
};

export const logout = async (): Promise<ServiceResponseWithPayload<APILogoutResponse>> => {
  const response: ServiceResponseWithPayload<APILogoutResponse> = generateResponseData({
    authenticated: false, email: ''
  });

  return response;
};

export const changePassword = async (passwordData: PasswordChangeRequestPayload): Promise<ServiceResponseWithPayload<APILoginResponse>> => {
  const response: ServiceResponseWithPayload<APILoginResponse> = generateResponseData({ authenticated: false });
  try {
    // The v2 user service expects passwordData to have: email, password (current), newPassword, repeatNewPassword
    const user = await User.findOne({ where: { email: { [Op.eq]: passwordData.email } } })

    if (!user) {
      response.error = true;
      response.message = 'User not found';
      logger.error('Unable to reset password: user not found');
      response.code = 404;
      return response;
    }
    // Compose the expected structure for updatePassword
    const updateData = {
      email: passwordData.email,
      password: passwordData.currentPassword,
      newPassword: passwordData.newPassword,
      repeatNewPassword: passwordData.newPassword // Assume confirmation is handled elsewhere or add a param if needed
    };
    // updatePassword returns the updated user or null
    const updatedUser = await updatePassword(updateData);
    if (updatedUser) {
      response.payload = {
        authenticated: true,
        email: updatedUser.email,
        firstName: updatedUser.first_name,
        lastName: updatedUser.last_name,
        userId: updatedUser.id
      };
      response.code = 200;
      response.error = false;
    } else {
      logger.error('Reset password: update function returned nothing');
      response.code = 500;
      response.message = 'Failed to update password';
    }
  } catch (e: unknown) {
    response.error = true;
    response.code = 500;
    response.message = 'Invalid operation';
    logger.error('Unable to reset password. ', e);
  }
  return response;
};
