import { QueryTypes } from "sequelize";
import { DFTUserRecord } from "../../../controllers/FT/user/FT.user.definitions";
import FTUser from "../../../models/FT.user";
import { BaseService } from "../../base/base.service";
import { DFTUserDTO } from "./FT.user..definitions";
import bcrypt from "bcryptjs";
import { DFTFamDTO, DRelatedFamily } from "../family/FT.family.definitions";
import { DUserDTO } from "../../tracker/user/user.definitions";

export class FTUserService extends BaseService<DFTUserRecord> {
  constructor() {
    super('FTUsers');
  }


  public create = async (p_values: DFTUserDTO): Promise<Partial<DFTUserDTO> | null> => {
    const hashedPassword = bcrypt.hashSync(p_values.password, this.salt);
    // TODO: implement search by name as user enter their last name. 
    // Does it make sense to offer them choices given the security aspect?
    const formattedValues = { ...p_values, related_to: [1], imm_family: 2, password: hashedPassword, created_at: new Date };
    const fieldsValid = await this.validateFTUserFields(formattedValues);
    let newUser = null;

    if (fieldsValid) {
      newUser = await FTUser.create(formattedValues).catch((e) => { //TODO: Error typing and catch
        console.log(e); //TODO: LOGGING
        return null;
      });
    }

    return { ...newUser, password: undefined };
  }

  // TODO: No any. fix typing, should related_to be added to the dto?
  public getUserData = async (p_id: number): Promise<any> => {
    const currentUser = await FTUser.findByPk(p_id, { attributes: { exclude: ['id', 'password'] } });
    if (currentUser?.dataValues) {
      const relatedFamilies = await this.getRelatedFamilies(p_id);

      return ({ ...currentUser.dataValues, relatedTo: [...relatedFamilies] });
    }
  }

  public getRelatedFamilies = async (p_id: number): Promise<any> => {
    const select = `
      SELECT id, name
      FROM FTFams 
      WHERE JSON_CONTAINS(members, :id);
    `;

    const relatedFamilies = await this.dataBase.query(select, {
      type: QueryTypes.SELECT,
      replacements: { id: `${p_id}` }
    }).catch(() => false);

    return relatedFamilies;
  }
  // TODO: no any
  public getExtendedFamiliesDetails = async (p_id: number): Promise<any> => {
    const currentUser: DFTUserDTO = await this.getUserData(p_id)
      .catch((e) => {
        // TODO: logging
        console.log('ERROR', e);
      });
    console.log(currentUser.partner);

    // using user partner id
    // const select = `
    //   SELECT * 
    //   FROM FTUsers user 
    //   JOIN FTFams family ON family.id = user.imm_family 
    //   WHERE JSON_CONTAINS(family.members, :partner)) 
    // `;
    const select = `
      SELECT * 
      FROM FTUsers user 
      JOIN FTFams family ON family.id = user.imm_family 
      WHERE JSON_CONTAINS(family.members, :partner) ;
    `;

    const extendedFamilies = await this.dataBase.query(select, {
      type: QueryTypes.SELECT,
      replacements: { partner: `${currentUser.partner}` }
    }).catch(() => false);

    return extendedFamilies;

  }

  private validateFTUserFields = (p_values: DFTUserDTO): boolean => {
    if (p_values.age < 0 || !p_values.age) {
      console.log('missing age'); //TODO: LOGGING
      return false;
    }

    if (!p_values?.assigned_ips?.length || !p_values.assigned_ips) {
      console.log('missing .'); //TODO: LOGGING
      return false;
    }

    if (!p_values.description) {
      console.log('missing description'); //TODO: LOGGING
      return false;
    }

    if (!p_values.first_name) {
      console.log('missing first_name'); //TODO: LOGGING
      return false;
    }

    if (!p_values.gender) {
      console.log('missing gender'); //TODO: LOGGING
      return false;
    }

    if (p_values.is_parent === null || p_values.is_parent === undefined) {
      // must be explicitly identified
      console.log('missing is_parent'); //TODO: LOGGING
      return false;
    }

    if (!p_values.email || !p_values.email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
      console.log('missing email'); //TODO: LOGGING
      return false;
    }

    if (!p_values.last_name) {
      console.log('missing last_name'); //TODO: LOGGING
      return false;
    }

    if (!p_values.imm_family) {
      console.log('missing imm_family'); //TODO: LOGGING
      return false;
    }

    if (!p_values.marital_status) {
      console.log('missing marital_status'); //TODO: LOGGING
      return false;
    }

    if (!p_values.password || p_values.password.length < 14) {
      console.log('missing password'); //TODO: LOGGING
      return false;
    }


    return true;
  }
}

// // ME
// INSERT INTO FTUsers VALUES(1, 'Steve', 'Abouem', 40, 'sabo@cc', 'Admin', 2, 'Married', '123456789012', 1, 1, 1, '[]', 'Admin URL', 'Admin desc', 1, '[1, 2]', '2023-06-07', NULL);

// // JO
// INSERT INTO FTUsers VALUES(2, 'JOhane', 'Nouala', 33, 'j.n@cc', 'Spouse', 1, 'Married', '123456789012', 1, 0, 2, '[]', 'Spouse URL', 'Spouse desc', 2, '[1, 2]', '2023-06-07', NULL);

// // Abouem
// INSERT INTO FTFams VALUES(1, 'Abouem', 'Abouem URL', 10, 'Abouems DEsc', 1, 3, 4, 1, '[1]', 1, '2023-06-07', NULL);

// // Nouala
// INSERT INTO FTFams VALUES(2, 'Nouala', 'Nouala URL', 5, 'Noualas DEsc', 1, 5, 6, 2, '[2]', 2, '2023-06-07', NULL);

// INSERT INTO FTFams VALUES(3, 'Bouchard', 'Boucahrd URL', 2, 'Bouchard DEsc', 1, 10, 12, 10, '[1, 10]', 3, '2023-06-07', NULL);