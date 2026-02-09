import dayjs from "dayjs";
import bcrypt from "bcryptjs";
import { Op } from "sequelize";
import { AuthenticationResponse, LoginRequestPayload, UpdateUserRequestPayload } from "./types";
import { ServiceResponseWithPayload } from "./types";
import logger from "../utils/logger";
import { createUser } from "./user";
import { extractSingleDataValuesFrom, generateResponseData } from "./serviceHelpers";
import User from "../models/User";
import { addSeasoning } from "../utils/toolkit";

export const register = async (userData: any): Promise<ServiceResponseWithPayload<AuthenticationResponse | null>> => {
  let buffer = null;
  const ip = userData.ip;
  const userImage = userData.profile_url?.replace(/^data:image\/\w+;base64,/, '') || null;
  if (userImage) {
    buffer = Buffer.from(userImage, 'base64');
  }
  const formattedValues = { ...userData, assigned_ips: [ip], created_at: dayjs(), profile_url: buffer };
  let response: ServiceResponseWithPayload<AuthenticationResponse | null> = {
    error: true,
    code: 500,
    payload: { email: '', userId: 0 }
  };

  const duplicate = await extractSingleDataValuesFrom(User, { where: { email: { [Op.eq]: userData.email } } });
  logger.info({ duplicate });

  if (duplicate) {
    response.error = true;
    logger.error('Email address is already in use', { duplicate });
    response.code = 400;
    return response;
  }

  response.addToSession = true;

  const userResponse = await createUser(formattedValues);
  if (userResponse.code === 200) {
    logger.info('New user created ', userResponse);
  } else {
    logger.error('Unable to create new user: ', userResponse);
  }

  return userResponse;
};

export const login = async ({ email, password }: LoginRequestPayload): Promise<ServiceResponseWithPayload<AuthenticationResponse>> => {
  const payloadData = { email: '', userId: 0 };
  const response: ServiceResponseWithPayload<AuthenticationResponse> = generateResponseData(payloadData);

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
        email: email,
        firstName: currentUser.first_name,
        lastName: currentUser.last_name,
      };
      response.addToSession = true;
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

export const updateUser = async (userData: UpdateUserRequestPayload): Promise<ServiceResponseWithPayload<AuthenticationResponse>> => {
  const response: ServiceResponseWithPayload<AuthenticationResponse> = generateResponseData({});

  try {
    logger.info('RADY TO UPDAT UER')
    const { new_password, repeat_new_password, password, userId } = userData;
    const publicFields = ['email', 'first_name', 'last_name'];
    const user = await User.findByPk(userId);
    let updateData: any = {};

    if (!user) {
      response.error = true;
      response.message = 'User not found';
      logger.error('Unable to reset password: user not found');
      response.code = 404;

      return response;
    }
    if (password && new_password && repeat_new_password) {
      const newPasswordIsVerified = bcrypt.compareSync(password, user.password);
      const passwordIsValid = new_password === repeat_new_password;
      const newPasswordIsUnused = new_password !== password;
      logger.info('PASSWORD CHECK: ', { passwordIsValid, newPasswordIsVerified, newPasswordIsUnused })
      if (passwordIsValid && newPasswordIsVerified && newPasswordIsUnused) {
        updateData.password = bcrypt.hashSync(new_password, addSeasoning());
        logger.info('AFTER DATA UPDATE ', { updateData });
      } else {
        logger.error('Reset Password. Passwords not matching');
        response.error = true;
        response.code = 500;
        response.message = 'Invalid operation';

        return response;
      }

    }
    // @ts-ignore
    publicFields.forEach((field) => { if (userData[field]) updateData[field] = userData[field] });

    // update returns the updated user or null
    const updatedUser = await user.update(updateData);

    if (updatedUser) {
      response.payload = {
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
