import { QueryTypes } from "sequelize";
import User from "../../models/User";
import { BaseMiddleware } from "../base/base.middleware";
import { DUserDTO } from "./user..definitions";
import bcrypt from "bcryptjs";
import { DUserRecord } from "../../controllers/user/User.definitions";

export class UserMiddleware extends BaseMiddleware<DUserRecord> {
  constructor() {
    super('users');
  }


  public create = async (values: DUserDTO): Promise<Partial<DUserDTO> | null> => {
    const hashedPassword = bcrypt.hashSync(values.password, this.salt);
    // TODO: implement search by name as user enter their last name. 
    // Does it make sense to offer them choices given the security aspect?
    const formattedValues = { ...values, related_to: [1], imm_family: 2, password: hashedPassword, created_at: new Date };
    const fieldsValid = await this.validateUserFields(formattedValues);
    let newUser = null;

    if (fieldsValid) {
      newUser = await User.create(formattedValues).catch((e) => { //TODO: Error typing and catch
        console.log(e); //TODO: LOGGING
        return null;
      });
      await newUser?.save();
      return { ...newUser?.dataValues, password: undefined };
    }
    return null;
  }

  // TODO: No any. fix typing, should related_to be added to the dto?
  public getUserData = async (id: number): Promise<any> => {
    const currentUser = await User.findByPk(id, { attributes: { exclude: ['id', 'password'] } });
    if (currentUser?.dataValues) {
      const relatedFamilies = await this.getRelatedFamilies(id);

      return ({ ...currentUser.dataValues, relatedTo: [...relatedFamilies] });
    }
  }

  public getByEmail = async (email: string): Promise<any> => {
    const currentUser = await User.findOne({ where: { email: email } });

    return (currentUser);
  }

  public getRelatedFamilies = async (id: number): Promise<any> => {
    const select = `
      SELECT id, name
      FROM families 
      WHERE JSON_CONTAINS(members, :id);
    `;

    const relatedFamilies = await this.dataBase.query(select, {
      type: QueryTypes.SELECT,
      replacements: { id: `${id}` }
    }).catch(() => false);

    return relatedFamilies;
  }
  // TODO: no any
  public getExtendedFamiliesDetails = async (id: number): Promise<any> => {
    const currentUser: DUserDTO = await this.getUserData(id)
      .catch((e) => {
        // TODO: logging
        console.log('ERROR', e);
      });
    console.log(currentUser.partner);

    const select = `
      SELECT * 
      FROM users user 
      JOIN families family ON family.id = user.imm_family 
      WHERE JSON_CONTAINS(family.members, :partner) ;
    `;

    const extendedFamilies = await this.dataBase.query(select, {
      type: QueryTypes.SELECT,
      replacements: { partner: `${currentUser.partner}` }
    }).catch(() => false);

    return extendedFamilies;

  }

  private validateUserFields = (values: DUserDTO): boolean => {
    console.log('RECEIVED VALUES: ', values);

    if (values.age < 0 || !values.age) {
      console.log('missing age'); //TODO: LOGGING
      return false;
    }

    if (!values?.assigned_ips?.length || !values.assigned_ips) {
      console.log('missing .'); //TODO: LOGGING
      return false;
    }

    if (!values.description) {
      console.log('missing description'); //TODO: LOGGING
      return false;
    }

    if (!values.first_name) {
      console.log('missing first_name'); //TODO: LOGGING
      return false;
    }

    if (!values.gender) {
      console.log('missing gender'); //TODO: LOGGING
      return false;
    }

    if (values.is_parent === null || values.is_parent === undefined) {
      // must be explicitly identified
      console.log('missing is_parent'); //TODO: LOGGING
      return false;
    }

    if (!values.email || !values.email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
      console.log('missing email'); //TODO: LOGGING
      return false;
    }

    if (!values.last_name) {
      console.log('missing last_name'); //TODO: LOGGING
      return false;
    }

    if (!values.imm_family) {
      console.log('missing imm_family'); //TODO: LOGGING
      return false;
    }

    if (!values.marital_status) {
      console.log('missing marital_status'); //TODO: LOGGING
      return false;
    }

    if (!values.password || values.password.length < 14) {
      console.log('missing password'); //TODO: LOGGING
      return false;
    }


    return true;
  }
}