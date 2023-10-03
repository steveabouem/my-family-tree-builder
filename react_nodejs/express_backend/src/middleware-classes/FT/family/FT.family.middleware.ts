import { Op } from "sequelize";
import FTFam from "../../../models/FT.family";
import FTTree from "../../../models/FT.tree.";
import FTUser from "../../../models/FT.user";
import { BaseMiddleware } from "../../base/base.middleware";
import { DFamilyTreeUpdateDTO } from "../tree/FT.tree.definitions";
import { DFTFamDTO, DFTFamUpdateDTO } from "./FT.family.definitions";

export class FTFamilyMiddleware extends BaseMiddleware<DFTFamDTO> {
  constructor() {
    super('FTFams');
  }

  create = async (values: DFTFamDTO): Promise<boolean> => {
    const formattedValues = { ...values, created_at: new Date };
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

  update = async (values: DFTFamUpdateDTO, id: number): Promise<boolean> => {
    const currentFamily = await FTFam.findOne({ where: { id: id }, attributes: { exclude: ['id'] } });
    if (currentFamily) {
      const formattedValues = await this.formatUpdateValues(values, id);

      await FTFam.update({ ...formattedValues }, { where: { id: id } })
        .catch(e => {
          console.log('Error updating: ', e);
          return false;
        });

      currentFamily.save();

      return true;
    }

    return false;
  }

  getFamily = async (id: number): Promise<FTFam | null> => {
    const fam = await this.getById(id);
    return fam;
  }

  linkToTree = async (id: number, tree: number): Promise<boolean> => {
    const currentFamily = await FTFam.findOne({ where: { id: id }, attributes: { exclude: ['id'] } });
    const currentTree = await FTTree.findOne({ where: { id: tree }, attributes: { exclude: ['id'] } });

    if (!currentFamily || !currentTree) {
      console.log('Tree or family do not exist'); // TODO: LOGGING AND SEND BACK TO FRONT IF NECESSARY
      return false
    } else {
      await currentFamily.update({ tree: tree });
      currentFamily.save();
      return true;
    }
  }

  getTree = async (id: number): Promise<number | undefined> => {
    const currentFamily = await FTFam.findOne({ where: { id }, attributes: { exclude: ['id'] } });
    if (currentFamily) {
      const tree = currentFamily.tree;
      return tree;
    }
    console.log('No Tree Found');

    return undefined;
  }

  getBulkData = async (ids: string): Promise<Partial<DFTFamDTO>[]> => {
    const parseIds = ids.split(',').map((id: string) => parseInt(id));
    const families: any = await FTFam.findAll({
      where: {
        id: {
          [Op.in]: parseIds
        }
      }
    });

    return families;
  }

  formatUpdateValues = async (values: DFTFamUpdateDTO, id: number): Promise<Partial<DFamilyTreeUpdateDTO> | undefined> => {
    const currentFamily = await FTFam.findOne({ where: { id: id }, attributes: { exclude: ['id'] } });
    let formattedValues = {};
    if (!currentFamily) {
      return;
    }

    if (values.members) {
      const familyMembers = JSON.parse(currentFamily?.FTFamMembers || '');
      const formattedMembers = JSON.stringify([...familyMembers, ...values.members]);
      formattedValues = { ...values, members: formattedMembers };
    }

    return ({ ...values, ...formattedValues, updated_at: new Date });
  }

  validateFTFamFields = async (values: DFTFamDTO): Promise<boolean> => {
    const currentUser = await FTUser.findOne({ where: { id: values.created_by }, attributes: { exclude: ['id'] } });

    if (currentUser?.FTUserImmediateFamily && currentUser?.last_name === values.name) {
      console.log("A nuclear family for user was already created");
      return false;
    }
    if (!values.created_at) {
      console.log('missing ceation date'); //TODO: LOGGING
      return false;
    }

    if (!values.created_by) {
      console.log('missing creating user'); //TODO: LOGGING
      return false;
    }

    if (!values.head_1) {
      console.log('missing head of family'); //TODO: LOGGING
      return false;
    }

    if (!values.name) {
      console.log('missing family name'); //TODO: LOGGING
      return false;
    }

    return true;
  }
}
