import dayjs from "dayjs";
import { APIRegistrationResponse } from "../../controllers/auth/auth.definitions";
import { ServiceResponseWithPayload } from "../../services/service.definitions";
import logger from "../../utils/logger";
import { createUser, getUserByEmail } from "./user";

export const registerV2 = async(userData: any): Promise<ServiceResponseWithPayload<APIRegistrationResponse | null>> => {
    const ip = userData.ip;
    const formattedValues = { ...userData, assigned_ips: [ip], created_at: dayjs() };
    const response: ServiceResponseWithPayload<APIRegistrationResponse | null> = {
      error: true,
      code: 500,
      payload: { authenticated: false, email: '', userId: 0, }
    };

    try {
      const duplicate = await getUserByEmail(userData.email);
      if (duplicate) {
        response.error = true;
        logger.error('Email address is already in use');
        response.code = 400;
        return response;
      }

      const newUser = await createUser(formattedValues);
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
  };