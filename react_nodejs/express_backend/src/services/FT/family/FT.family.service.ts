import { Op } from "sequelize";
import FTFam from "../../../models/FT.family";
import FTTree from "../../../models/FT.tree.";
import FTUser from "../../../models/FT.user";
import { BaseService } from "../../base/base.service";
import { DFamilyTreeUpdateDTO } from "../tree/FT.tree.definitions";
import { DFTFamDTO, DFTFamUpdateDTO } from "./FT.family.definitions";

export class FTFamilyService extends BaseService<DFTFamDTO> {
  constructor() {
    super('FTFams');
  }

  create = async (p_values: DFTFamDTO): Promise<boolean> => {
    const formattedValues = { ...p_values, created_at: new Date };
    const fieldsValid = await this.validateFTFamFields(formattedValues);

    if (fieldsValid) {
      await FTFam.create(formattedValues).catch((e) => { //TODO: Error typing and catch
        console.log(e); //TODO: LOGGING
        return false;
      });

      return true;
    }

    return false;
  }

  update = async (p_values: DFTFamUpdateDTO, p_id: number): Promise<boolean> => {
    const currentFamily = await FTFam.findOne({ where: { id: p_id }, attributes: { exclude: ['id'] } });
    if (currentFamily) {
      const formattedValues = await this.formatUpdateValues(p_values, p_id);

      await FTFam.update({ ...formattedValues }, { where: { id: p_id } })
        .catch(e => {
          console.log('Error updating: ', e);
          return false;
        });

      currentFamily.save();

      return true;
    }

    return false;
  }

  getFamily = async (p_id: number): Promise<FTFam | null> => {
    const fam = await this.getById(p_id);
    return fam;
  }

  linkToTree = async (p_id: number, p_tree: number): Promise<boolean> => {
    const currentFamily = await FTFam.findOne({ where: { id: p_id }, attributes: { exclude: ['id'] } });
    const currentTree = await FTTree.findOne({ where: { id: p_tree }, attributes: { exclude: ['id'] } });

    if (!currentFamily || !currentTree) {
      console.log('Tree or family do not exist'); // TODO: LOGGING AND SEND BACK TO FRONT IF NECESSARY
      return false
    } else {
      await currentFamily.update({ tree: p_tree });
      currentFamily.save();
      return true;
    }
  }

  getTree = async (p_id: number): Promise<number | undefined> => {
    const currentFamily = await FTFam.findOne({ where: { id: p_id }, attributes: { exclude: ['id'] } });
    if (currentFamily) {
      const tree = currentFamily.tree;
      return tree;
    }
    console.log('No Tree Found');

    return undefined;
  }

  getBulkData = async (p_ids: string): Promise<Partial<DFTFamDTO>[]> => {
    const parseIds = p_ids.split(',').map((id: string) => parseInt(id));
    const families: any = await FTFam.findAll({
      where: {
        id: {
          [Op.in]: parseIds
        }
      }
    });

    return families;
  }

  formatUpdateValues = async (p_values: DFTFamUpdateDTO, p_id: number): Promise<Partial<DFamilyTreeUpdateDTO> | undefined> => {
    const currentFamily = await FTFam.findOne({ where: { id: p_id }, attributes: { exclude: ['id'] } });
    let formattedValues = {};
    if (!currentFamily) {
      return;
    }

    if (p_values.members) {
      const familyMembers = JSON.parse(currentFamily?.FTFamMembers || '');
      const formattedMembers = JSON.stringify([...familyMembers, ...p_values.members]);
      formattedValues = { ...p_values, members: formattedMembers };
    }

    return ({ ...p_values, ...formattedValues, updated_at: new Date });
  }

  validateFTFamFields = async (p_values: DFTFamDTO): Promise<boolean> => {
    const currentUser = await FTUser.findOne({ where: { id: p_values.created_by }, attributes: { exclude: ['id'] } });

    if (currentUser?.FTUserImmediateFamily && currentUser?.last_name === p_values.name) {
      console.log("A nuclear family for user was already created");
      return false;
    }
    if (!p_values.created_at) {
      console.log('missing ceation date'); //TODO: LOGGING
      return false;
    }

    if (!p_values.created_by) {
      console.log('missing creating user'); //TODO: LOGGING
      return false;
    }

    if (!p_values.head_1) {
      console.log('missing head of family'); //TODO: LOGGING
      return false;
    }

    if (!p_values.name) {
      console.log('missing family name'); //TODO: LOGGING
      return false;
    }

    return true;
  }
}
