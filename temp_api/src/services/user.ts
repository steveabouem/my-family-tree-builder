import bcrypt from "bcryptjs";
import { QueryTypes } from "sequelize";

import Role from "../models/Role";
import logger from "../utils/logger";
import User from "../models/User";
import { APIUserDTO, ServiceResponseWithPayload, APIRegistrationResponse } from "./types";
import { addSeasoning } from "../utils/toolkit";
import { extractSingleDataValuesFrom, generateResponseData } from "./serviceHelpers";

export const createUser = async (userData: any): Promise<ServiceResponseWithPayload<APIRegistrationResponse | null>> => {
  const hashedPassword = bcrypt.hashSync(userData.password, addSeasoning());
  const defaultUserRole = await Role.findOne({ where: { name: 'user' } });
  const payloadData = { authenticated: false, email: '', userId: 0 };
  // @ts-ignore
  const response: ServiceResponseWithPayload<APIRegistrationResponse | null> = generateResponseData(payloadData);

  if (!defaultUserRole) {
    logger.error('Unable to create new user: no default role available');
    return response;
  }

  const formattedValues = {
    ...userData,
    related_to: [1],
    password: hashedPassword,
    role_id: defaultUserRole.id,
    created_at: new Date
  };

  const fieldsValid = validateUserFields(formattedValues);
  const duplicate = await extractSingleDataValuesFrom(User, { where: { email: userData.email } });

  if (duplicate) {
    logger.error('! User.create ! User already exists');
    return response;
  }

  if (fieldsValid) {
    const newUser = await User.create(formattedValues);
    
    if (newUser) {
      response.code = 200;
      response.error = false;
      response.payload = { authenticated: true, userId: newUser.id, email: newUser.email,sessionId: null };

      return response;
    } else {
      logger.error('! User.create !', 'User wasn\'t created, unable to save');
    }
  }

  return response; //unchaged from init
}

export const getUserById = async (id: number): Promise<ServiceResponseWithPayload<APIRegistrationResponse | null>> => {
  const response: ServiceResponseWithPayload<APIRegistrationResponse | null> = generateResponseData({ authenticated: false, email: '', userId: 0, sessionId: null});

  try {
    const user = await User.findByPk(id, { attributes: { exclude: ['id', 'password'] } });
  
    if (user) {
      response.payload = {
        authenticated: true,
        email: user?.email,
        userId: user.id,
        sessionId: ''
      }
    }
  
    return response;

  } catch(e) {
    logger.error('error ', e);
    return response;
  }
};

export const updateUser = async (id: number, updateData: any): Promise<User | null> => {
  try {
    const user = await User.findByPk(id);
    if (!user) return null;

    await user.update(updateData);
    return user;
  } catch (e: unknown) {
    logger.error('Failed to update user:', e);
    return null;
  }
}

export const updatePassword = async (passwordData: any): Promise<User | null> => {
  try {
    const currentUser = await User.findOne({ where: { email: passwordData.email } });
    if (!currentUser) {
      logger.error('Reset Password. No matching user');
      return null;
    }

    const newPasswordIsVerified = bcrypt.compareSync(passwordData.password, currentUser.password);
    const passwordIsValid = passwordData.newPassword === passwordData.repeatNewPassword;
    const newPasswordIsUnused = passwordData.newPassword !== passwordData.password;

    if (passwordIsValid && newPasswordIsVerified && newPasswordIsUnused) {
      const updatedUser = await currentUser.update({
        password: bcrypt.hashSync(passwordData.newPassword, addSeasoning())
      });
      logger.info('password changed: ', updatedUser);
      return updatedUser;
    } else {
      logger.error('Reset Password. Passwords not matching');
      return null;
    }
  } catch (e: unknown) {
    logger.error('Failed password change: ', e);
    return null;
  }
}

export const deleteUser = async (id: number): Promise<boolean> => {
  try {
    const user = await User.findByPk(id);
    if (!user) return false;

    await user.destroy();
    return true;
  } catch (e: unknown) {
    logger.error('Failed to delete user:', e);
    return false;
  }
}

const validateUserFields = (values: APIUserDTO): boolean => {
  if (!values.dob) {
    logger.info('missing dob');
    logger.error('! User.validateUserFields ! missing dob');
    return false;
  }

  if (!values?.assigned_ips?.length || !values.assigned_ips) {
    logger.info('missing assigned IPs');
    logger.error('! User.validateUserFields ! missing assigned IPs.');
    return false;
  }

  if (!values.description) {
    logger.info('missing description');
    logger.error('! User.validateUserFields ! missing description');
    return false;
  }

  if (!values.first_name) {
    logger.info('missing first_name');
    logger.error('! User.validateUserFields ! missing first_name');
    return false;
  }

  if (!values.gender) {
    logger.info('missing gender');
    logger.error('! User.validateUserFields ! missing gender');
    return false;
  }

  if (values.is_parent === null || values.is_parent === undefined) {
    logger.info('missing is_parent');
    logger.error('! User.validateUserFields ! missing is_parent');
    return false;
  }

  if (!values.email) {
    logger.info('missing email');
    logger.error('! User.validateUserFields ! missing email');
    return false;
  }

  if (!values.last_name) {
    logger.info('missing last_name');
    logger.error('! User.validateUserFields ! missing last_name');
    return false;
  }

  if (!values.marital_status) {
    logger.info('missing marital_status');
    logger.error('! User.validateUserFields ! missing marital_status');
    return false;
  }

  if (!values.password) {
    logger.info('missing password');
    logger.error('! User.validateUserFields ! missing password');
    return false;
  }

  return true;
}

const getRelatedFamilies = async (id: number): Promise<any> => {
  try {
    const select = `
        SELECT id, name
        FROM Families 
        WHERE JSON_CONTAINS(members, :id);
      `;

    const relatedFamilies = await User.sequelize?.query(select, {
      type: QueryTypes.SELECT,
      replacements: { id: `${id}` }
    });

    return relatedFamilies || [];
  } catch (e: unknown) {
    logger.error('Failed to get related families:', e);
    return [];
  }
}

const getExtendedFamiliesDetails = async (id: number): Promise<any> => {
  try {
    const currentUser = await getUserById(id);
    if (!currentUser) return [];

    const select = `
        SELECT * 
        FROM Users user 
        JOIN Families family ON family.id = user.imm_family 
        WHERE JSON_CONTAINS(family.members, :partner) ;
      `;

    const extendedFamilies = await User.sequelize?.query(select, {
      type: QueryTypes.SELECT,
    });

    return extendedFamilies || [];
  } catch (e: unknown) {
    logger.error('Failed to get extended families details:', e);
    return [];
  }
};