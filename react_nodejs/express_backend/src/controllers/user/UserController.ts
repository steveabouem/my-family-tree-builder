import bcrypt from "bcryptjs";
import { QueryTypes } from "sequelize";
import BaseController from "../Base.controller";
import { DUserRecord, DUserDTO } from "./User.definitions";
import User from "../../models/User";
import logger from "../../utils/logger";

class UserController extends BaseController<DUserRecord> {
    constructor() {
        super('Users');
    }

    public async create (values: DUserDTO): Promise<Partial<DUserDTO> | null>  {
        const hashedPassword = bcrypt.hashSync(values.password, this.salt);
        // TODO: implement search by name as user enter their last name. 
        // Does it make sense to offer them choices given the security aspect?
        const formattedValues = { ...values, related_to: [1], imm_family: 2, password: hashedPassword, created_at: new Date };
        // TODO: uncommen validation
        // const fieldsValid = await this.validateUserFields(formattedValues); 
        let newUser = null;

        // if (fieldsValid) {
            newUser = await User.create(formattedValues).catch((e) => { //TODO: Error typing and catch
                logger.log(e);
                return null;
            });
            await newUser?.save();
            return { ...newUser?.dataValues, password: undefined };
        // }
        return null;
    }

    // TODO: No any. fix typing, should related_to be added to the dto?
    public async getUserData (id: number): Promise<any> {
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
    // TODO: no any
    public async getExtendedFamiliesDetails(id: number): Promise<any> {
        const currentUser: DUserDTO = await this.getUserData(id)
            .catch((e) => {
                // TODO: logging
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

    private validateUserFields (values: DUserDTO): boolean {
        console.log('RECEIVED VALUES: ', values);
    
        if (values.age < 0 || !values.age) {
          console.log('missing age'); //TODO: LOGGING
          logger.error('missing age'); //TODO: LOGGING
          return false;
        }
    
        if (!values?.assigned_ips?.length || !values.assigned_ips) {
          console.log('missing .'); //TODO: LOGGING
          logger.error('missing .'); //TODO: LOGGING
          return false;
        }
    
        if (!values.description) {
          console.log('missing description'); //TODO: LOGGING
          logger.error('missing description'); //TODO: LOGGING
          return false;
        }
    
        if (!values.first_name) {
          console.log('missing first_name'); //TODO: LOGGING
          logger.error('missing first_name'); //TODO: LOGGING
          return false;
        }
    
        if (!values.gender) {
          console.log('missing gender'); //TODO: LOGGING
          logger.error('missing gender'); //TODO: LOGGING
          return false;
        }
    
        if (values.is_parent === null || values.is_parent === undefined) {
          // must be explicitly identified
          console.log('missing is_parent'); //TODO: LOGGING
          logger.error('missing is_parent'); //TODO: LOGGING
          return false;
        }
    
        if (!values.email || !values.email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
          console.log('missing email'); //TODO: LOGGING
          logger.error('missing email'); //TODO: LOGGING
          return false;
        }
    
        if (!values.last_name) {
          console.log('missing last_name'); //TODO: LOGGING
          logger.error('missing last_name'); //TODO: LOGGING
          return false;
        }
    
        if (!values.imm_family) {
          console.log('missing imm_family'); //TODO: LOGGING
          logger.error('missing imm_family'); //TODO: LOGGING
          return false;
        }
    
        if (!values.marital_status) {
          console.log('missing marital_status'); //TODO: LOGGING
          logger.error('missing marital_status'); //TODO: LOGGING
          return false;
        }
    
        if (!values.password || values.password.length < 14) {
          console.log('missing password'); //TODO: LOGGING
          logger.error('missing password'); //TODO: LOGGING
          return false;
        }
    
    
        return true;
      }

}

export default UserController;