import bcrypt from "bcryptjs";
import { QueryTypes } from "sequelize";
import BaseController from "../Base.controller";
import { DUserRecord, DUserDTO } from "./user.definitions";
import User from "../../models/User";
import logger from "../../utils/logger";
import Role from "../../models/Role";

class UserController extends BaseController<DUserRecord> {
  constructor() {
    super('Users');
  }

  public async create(values: DUserDTO): Promise<Partial<DUserDTO> | null> {
    const hashedPassword = bcrypt.hashSync(values.password, this.salt);
    const defaultUserRole = await Role.findOne({ where: { name: 'user' } });
    if (defaultUserRole) {
      try {
        // ! -TOFIX: implement search by name as user enter their last name. 
        // Does it make sense to offer them choices given the security aspect?
        const formattedValues = { ...values, related_to: [1], password: hashedPassword, role_id: defaultUserRole.id, created_at: new Date };
        const fieldsValid = await this.validateUserFields(formattedValues);
        const duplicate = await User.findOne({ where: { email: values.email } });
        let newUser = null;

        if (duplicate) {
          logger.error('! User.create ! User already exists');
          return null;
        }

        if (fieldsValid) {
          // @ts-ignore: partner needs to always be optional
          newUser = await User.create(formattedValues).catch((e) => { //TODO: Error typing and catch
            logger.error('! User.create !', e);
            return null;
          });

          if (newUser) {
            await newUser.save();
          } else {
            logger.error('! User.create !', 'User wasn\'t created, unable to save');
          }
          return { ...newUser?.dataValues, password: undefined };
        }
      } catch (e) {
        logger.error('Failed registration: ', e);
      }
    } else {
      logger.error('Unable to create new user: no default role available');
    }
    return null;
  }

  // ! -TOFIX: No any. fix typing, should related_to be added to the dto?
  public async getUserData(id: number): Promise<any> {
    const currentUser = await User.findByPk(id, { attributes: { exclude: ['id', 'password'] } });
    if (currentUser?.dataValues) {
      const relatedFamilies = await this.getRelatedFamilies(id);

      return ({ ...currentUser.dataValues, relatedTo: [...relatedFamilies] });
    }
  }

  public async getByEmail(email: string): Promise<any> {
    const currentUser = await User.findOne({ where: { email: email } });

    return (currentUser);
  }

  public async getRelatedFamilies(id: number): Promise<any> {
    const select = `
      SELECT id, name
      FROM Families 
      WHERE JSON_CONTAINS(members, :id);
    `;

    const relatedFamilies = await this.dataBase.query(select, {
      type: QueryTypes.SELECT,
      replacements: { id: `${id}` }
    }).catch(() => false);

    return relatedFamilies;
  }
  // ! -TOFIX: no any
  public async getExtendedFamiliesDetails(id: number): Promise<any> {
    const currentUser: DUserDTO = await this.getUserData(id)
      .catch((e) => {
        // ! -TOFIX: logging
        console.log('ERROR', e);
      });
    console.log(currentUser.partner);

    const select = `
      SELECT * 
      FROM Users user 
      JOIN Families family ON family.id = user.imm_family 
      WHERE JSON_CONTAINS(family.members, :partner) ;
    `;

    const extendedFamilies = await this.dataBase.query(select, {
      type: QueryTypes.SELECT,
      replacements: { partner: `${currentUser.partner}` }
    }).catch(() => false);

    return extendedFamilies;

  }

  public async updatePassword(values: { email: string; password: string; newPassword: string; repeatNewPassword: string; id: number }): Promise<boolean> {
    let completed = false;
    const currentUser = await User.findOne({ where: { email: values.email } })
      .catch(e => {
        logger.info('QUERY FAILSL ', e)
      });

    if (currentUser) {
      try {
        const newPasswordIsVerified = bcrypt.compareSync(values.password, currentUser.password);
        const passwordIsValid = values.newPassword === values.repeatNewPassword;
        const newPasswordIsUnused = values.newPassword !== values.password;

        if (passwordIsValid && newPasswordIsVerified && newPasswordIsUnused) {
          const updatedUser = await currentUser.update({ password: bcrypt.hashSync(values.newPassword, this.salt) })
            .catch((e: any) => {
              logger.error('Update user error', e);
            });
            logger.info('password changed: ', updatedUser)
          completed = true;
        } else {
          logger.error('Reset PAssword. Passwords not matching');
        }
      } catch (e) {
        logger.error('Failed password change: ', e);
      }
    } else {
      logger.error('Reset PAssword. No matching user');
    }

    return completed;
  }

  private validateUserFields(values: DUserDTO): boolean {
    console.log('RECEIVED VALUES: ', values);

    if (!values.dob) {
      console.log('missing dob');
      logger.error('! User.validateUserFields ! missing dob');
      return false;
    }

    if (!values?.assigned_ips?.length || !values.assigned_ips) {
      console.log('missing .');
      logger.error('! User.validateUserFields ! missing assigned IPs.');
      return false;
    }

    if (!values.description) {
      console.log('missing description');
      logger.error('! User.validateUserFields ! missing description');
      return false;
    }

    if (!values.first_name) {
      console.log('missing first_name');
      logger.error('! User.validateUserFields ! missing first_name');
      return false;
    }

    if (!values.gender) {
      console.log('missing gender');
      logger.error('! User.validateUserFields ! missing gender');
      return false;
    }

    if (values.is_parent === null || values.is_parent === undefined) {
      // must be explicitly identified
      console.log('missing is_parent');
      logger.error('! User.validateUserFields ! missing is_parent');
      return false;
    }

    if (!values.email) {
      console.log('missing email');
      logger.error('! User.validateUserFields ! missing email');
      return false;
    }

    if (!values.last_name) {
      console.log('missing last_name');
      logger.error('! User.validateUserFields ! missing last_name');
      return false;
    }

    // if (!values.imm_family) {
    //   console.log('missing imm_family');
    //   logger.error('! User.validateUserFields ! missing imm_family');
    //   return false;
    // }

    if (!values.marital_status) {
      console.log('missing marital_status');
      logger.error('! User.validateUserFields ! missing marital_status');
      return false;
    }

    if (!values.password || values.password.length < 14) {
      console.log('missing password');
      logger.error('! User.validateUserFields ! missing password');
      return false;
    }


    return true;
  }

}

export default UserController;