import bcrypt from "bcryptjs";
import dayjs from "dayjs";
import logger from "../../utils/logger";
import { UserRegistrationData, UserLoginData, PasswordChangeData } from "./types";
import { APILoginResponse, APILogoutResponse, APIRegistrationResponse } from "../../controllers/auth/auth.definitions";
import { ServiceResponseWithPayload } from "../service.definitions";
import { UserService } from "../user";

export class AuthService {
  async register(userData: any): Promise<ServiceResponseWithPayload<APIRegistrationResponse | null>> {
    const ip = userData.ip;
    const formattedValues = { ...userData, assigned_ips: [ip], created_at: dayjs() };
    const userService = new UserService;
    const response: ServiceResponseWithPayload<APIRegistrationResponse | null> = {
      error: true,
      code: 500,
      payload: { authenticated: false, email: '', userId: 0, }
    };

    try {
      const duplicate = await userService.getUserByEmail(userData.email);
      if (duplicate) {
        response.error = true;
        logger.error('Email address is already in use');
        response.code = 400;
        return response;
      }

      const newUser = await userService.createUser(formattedValues);
      if (newUser) {
        logger.info('New user created ', newUser);
        response.error = false;
        response.payload = {
          userId: newUser.id || 0,
          authenticated: true,
          email: userData.email
        };
        response.code = 200;
      } else {
        logger.error('Unable to create new user: ', { newUser });
        response.code = 401;
        response.message = 'Unable to create user';
      }
    } catch (e: unknown) {
      logger.error('Unable to register ', e);
      response.message = `Caught ERR ${e}`;
      response.code = 400;
    }

    return response;
  }

  async login({ email, password }: { email: string, password: string }): Promise<ServiceResponseWithPayload<APILoginResponse>> {
    const response: ServiceResponseWithPayload<APILoginResponse> = {
      code: 500, error: true, payload: {
        authenticated: false,
      }
    };
    const userService = new UserService;

    try {
      const currentUser = await userService.getUserByEmail(email);
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
  }

  async logout(): Promise<ServiceResponseWithPayload<APILogoutResponse>> {
    const response: ServiceResponseWithPayload<APILogoutResponse> = { code: 200, error: false, payload: {
      authenticated: false, email: ''
    } };
    return response;
  }

  async changePassword(passwordData: PasswordChangeData): Promise<ServiceResponseWithPayload<APILoginResponse>> {
    const response: ServiceResponseWithPayload<APILoginResponse> = {
      code: 500, error: true, payload: {
        authenticated: false
      }
    };

    // try {
    //   const updatedUser = await userService.updatePassword(passwordData);
    //   logger.info('Return from update function: ', updatedUser);

    //   if (updatedUser) {
    //     response.payload = {
    //       authenticated: true,
    //       email: passwordData.email,
    //       firstName: passwordData.email,
    //       lastName: passwordData.email,
    //     };
    //     response.code = 200;
    //     response.error = false;
    //   } else {
    //     logger.error('Reset password: update function returned nothing');
    //     response.code = 500;
    //     response.message = 'Failed to update password';
    //   }
    // } catch (e: unknown) {
    //   response.error = true;
    //   response.code = 500;
    //   response.message = 'Invalid operation';
    //   logger.error('Unable to reset password. ', e);
    // }

    return response;
  }
} 