import bcrypt from "bcryptjs";
import { QueryTypes } from "sequelize";
import User from "../../models/User";
import Role from "../../models/Role";
import logger from "../../utils/logger";
import { APIUserDTO } from "../../controllers/user/user.definitions";

export class UserService  {
  private salt = 10;

  async createUser(userData: any): Promise<User | null> {
    const hashedPassword = bcrypt.hashSync(userData.password, this.salt);
    const defaultUserRole = await Role.findOne({ where: { name: 'user' } });
    
    if (!defaultUserRole) {
      logger.error('Unable to create new user: no default role available');
      return null;
    }

    try {
      const formattedValues = { 
        ...userData, 
        related_to: [1], 
        password: hashedPassword, 
        role_id: defaultUserRole.id, 
        created_at: new Date 
      };
      
      const fieldsValid = this.validateUserFields(formattedValues);
      const duplicate = await User.findOne({ where: { email: userData.email } });

      if (duplicate) {
        logger.error('! User.create ! User already exists');
        return null;
      }

      if (fieldsValid) {
        const newUser = await User.create(formattedValues);
        if (newUser) {
          await newUser.save();
          
          return newUser;
        } else {
          logger.error('! User.create !', 'User wasn\'t created, unable to save');
        }
      }
    } catch (e) {
      logger.error('Failed registration: ', e);
    }
    
    return null;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    try {
      return await User.findOne({ where: { email: email } });
    } catch (e: unknown) {
      logger.error('Failed to get user by email:', e);
      return null;
    }
  }

  async getUserById(id: number): Promise<User | null> {
    try {
      return await User.findByPk(id, { attributes: { exclude: ['id', 'password'] } });
    } catch (e: unknown) {
      logger.error('Failed to get user by id:', e);
      return null;
    }
  }

  async updateUser(id: number, updateData: any): Promise<User | null> {
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

  async updatePassword(passwordData: any): Promise<User | null> {
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
          password: bcrypt.hashSync(passwordData.newPassword, this.salt) 
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

  async deleteUser(id: number): Promise<boolean> {
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

  validateUserFields(values: APIUserDTO): boolean {
    console.log('RECEIVED VALUES: ', values);

    if (!values.dob) {
      console.log('missing dob');
      logger.error('! User.validateUserFields ! missing dob');
      return false;
    }

    if (!values?.assigned_ips?.length || !values.assigned_ips) {
      console.log('missing assigned IPs');
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

    if (!values.marital_status) {
      console.log('missing marital_status');
      logger.error('! User.validateUserFields ! missing marital_status');
      return false;
    }

    if (!values.password) {
      console.log('missing password');
      logger.error('! User.validateUserFields ! missing password');
      return false;
    }

    return true;
  }

  async getRelatedFamilies(id: number): Promise<any> {
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

  async getExtendedFamiliesDetails(id: number): Promise<any> {
    try {
      const currentUser = await this.getUserById(id);
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
  }
} 