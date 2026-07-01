import bcrypt from "bcryptjs";
import { Op } from "sequelize";

import logger from "../utils/logger";
import { APIUserDTO, ServiceResponseWithPayload, AuthenticationResponse, ProfileDataResponseV2 } from "./types";
import { extractSingleDataValuesFrom, generateResponseData, scramble } from "./serviceHelpers";
import { Collaborator, FamilyTree, User, FamilyMember } from "../models";
import { associationAliases } from "../associations";

export const createUser = async (userData: any): Promise<ServiceResponseWithPayload<AuthenticationResponse | null>> => {
  const hashedPassword = scramble(userData.password);
  const payloadData = { email: '', userId: 0 };
  // @ts-ignore
  const response: ServiceResponseWithPayload<AuthenticationResponse | null> = generateResponseData(payloadData);

  const formattedValues = {
    ...userData,
    status: 1,
    password: hashedPassword,
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
      response.payload = { userId: newUser.id, email: newUser.email, firstName: newUser.first_name, lastName: newUser.last_name };
      response.addToSession = true;
      logger.info('New USer returns to session ', { response });

      return response;
    } else {
      logger.error('! User.create !', 'User wasn\'t created, unable to save');
    }
  }

  return response; //unchaged from init
};

export const getProfileDetailsByUserId = async (id: number): Promise<ServiceResponseWithPayload<ProfileDataResponseV2 | null>> => {
  let response: ServiceResponseWithPayload<ProfileDataResponseV2 | null> | null = null;

  try {
    const user = await User.findByPk(id, { attributes: { exclude: ['password', 'updated_at'] } });

    if (user?.dataValues) {
      const data = user.dataValues;
      const membersRecords = await FamilyMember.findAll({
        where: {
          [Op.or]: [
            {email: { [Op.eq]: data.email }},// user might have been invited and not have confirmed yet
            {user_id: { [Op.eq]: data.id}},
          ]
        }
      });
      const userTrees = await FamilyTree.findAll({
       where: {created_by_id: {[Op.eq]:  data.id}},
        include: [
          { model: Collaborator, as: associationAliases.treeCollaborators, where: { user_id: data.id }, required: false },
          {
            model: FamilyMember, as: associationAliases.treeMembers, where: {
              [Op.or]: [
                { user_id: data.id },
                { email: data?.email || 'N/A' }, //email not always available
              ]
            }, required: false
          },
        ],
        subQuery: false
      });

      logger.info('Retrieved user profile info', { userTrees, membersRecordsCount: membersRecords });

      response = {
        error: false,
        code: 200,
        payload: {
          ...data,
          membersRecords,
          userTrees
        }
      };
    } else {
      logger.error('User not found: ', { id });
      response = {
        error: true,
        code: 500,
        payload: null
      };
    }

    return response;
  } catch (e) {
    logger.error('error ', e);
    return {
      error: true,
      code: 500,
      payload: null
    };
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
        password: scramble(passwordData.newPassword)
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

  if (!values.password) {
    logger.info('missing password');
    logger.error('! User.validateUserFields ! missing password');
    return false;
  }

  return true;
}

const getRelatedFamilies = async (id: number): Promise<any> => {
  try {
    // const relatedFamilies = await FamilyTree.count({
    //   where: {
    //     members: 
    //   }
    // }) // familytree service has something already
    // return relatedFamilies || [];
  } catch (e: unknown) {
    logger.error('Failed to get related families:', e);
    return [];
  }
}
