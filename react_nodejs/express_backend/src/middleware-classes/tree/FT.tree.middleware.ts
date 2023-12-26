import winston from "winston";
import { DFamilyTreeDTO, DFamilyTreeUpdateDTO } from "./FT.tree.definitions";
import { BaseMiddleware } from "../base/base.middleware";
import Tree from "../../models/FT.tree.";
import { dateValid } from "../../utils/validators";

export class TreeMiddleware extends BaseMiddleware<DFamilyTreeDTO> {
  constructor() {
    super('Trees');
  }

  create = async (values: DFamilyTreeDTO): Promise<boolean> => {
    // TODO: creation date has a default value in models. I might possibly skip this formatting,
    //  and adjust the DTO to make the prop optional. leaving it for now as it makes validation simpler
    const formattedValues = { ...values, created_at: new Date, active: 1 };
    const valid = this.validateTreeFields(formattedValues);

    if (valid) {
      await Tree.create({ ...formattedValues })
        .catch((e: unknown) => {
    winston.log('error' ,  e);
          console.log('Error creating tree'); // TODO: LOGGING AND SEND BACK TO FRONT IF NECESSARY

          return false;
        });

      return true;
    } else {
      console.log('Fields are not valid');

      return false;
    }
  }

  getTree = async (id: number): Promise<Tree | null> => {
    const currentTree = await this.getById(id);
    return currentTree;
  }

  getFamilies = async (id: number): Promise<number[] | undefined> => {
    const currentTree = await Tree.findByPk(id, { attributes: { exclude: ['id'] } });
    if (currentTree) {

      const fams = currentTree.treeFAmilies;
      console.log({ fams });
      return JSON.parse(fams);
    }
    console.log('No tree matching');
    return undefined;

  }


  addFamily = async (id: number, family: number): Promise<boolean> => {
    const currentTree = await Tree.findByPk(id);

    if (currentTree) {
      const relatedFamilies = JSON.parse(currentTree.treeFAmilies);
      relatedFamilies.push(family);

      console.log({ relatedFamilies });

      await currentTree.update({ families: JSON.stringify(relatedFamilies) });
      await currentTree.save();

      return true;
    }

    return false;
  }

  removeFamily = async (family: number, id: number): Promise<boolean> => {
    const currentTree = await Tree.findOne({ where: { id: id }, attributes: { exclude: ['id'] } });

    if (currentTree) {
      const relatedFamilies = JSON.parse(currentTree.treeFAmilies).filter((id: number) => id != family);
      console.log({ relatedFamilies });

      await currentTree.update({ families: JSON.stringify(relatedFamilies) })
        .catch((e: unknown) => {
    winston.log('error' ,  e);
          // TODO: LOGGING
          console.log('Error while updating ', e);
        });
      currentTree.save();
      return true;
    } else {
      console.log('No tree found for update');
      return false;
    }
  }

  update = async (values: DFamilyTreeUpdateDTO, id: number): Promise<boolean> => {
    // TODO: once individual field validations are there, use it here
    // const valid = this.validateTreeFields(values);
    // if (valid) {

    const currentTree = await Tree.findByPk(id);
    const formattedValues = await this.formatUpdateValues(values, id);

    if (currentTree) {
      await currentTree?.update({ ...formattedValues }, { where: { id: id } })
        .catch((e: unknown) => {
    winston.log('error' ,  e);
          console.log('Error updating tree');
          return false;
        });
      currentTree?.save();
      console.log('Update completed');

      return true;
    }

    return false;
  }

  validateTreeFields = (values: DFamilyTreeUpdateDTO | DFamilyTreeDTO): boolean => {
    // TODO: you will need individual field validations, 
    // in order to validate any type of operation without worrying about required fields
    if (!values.created_at || !dateValid(values.created_at)) {
      console.log('Missing or incorrect creation date');
      return false;
    }

    if (!values.created_by) {
      console.log('Missing creator value');
      return false;
    }

    if (!values.name) {
      console.log('Missing name');
      return false;
    }

    if (values.public === undefined || values.public === null) {
      console.log('Missing public');
      return false;
    }

    if (!dateValid(values.updated_at)) {
      console.log('Incorrect update date');
      return false;
    }

    if (!values.active) {
      console.log('Missing active');
      return false;
    }

    return true;
  }

  // return type uses a partial here to not have to deal with the id property present in the update DTO
  formatUpdateValues = async (values: DFamilyTreeUpdateDTO, id: number): Promise<Partial<DFamilyTreeUpdateDTO> | undefined> => {
    const currentTree = await Tree.findOne({ where: { id: id }, attributes: { exclude: ['id'] } });
    let formattedValues = {};
    if (!currentTree) {
      return;
    }

    if (values.authorized_ips) {
      const treeIPs = JSON.parse(currentTree?.treeAuthorized_ips || '');
      const formattedIPs = JSON.stringify([...treeIPs, ...values.authorized_ips]);
      formattedValues = { ...values, authorized_ips: formattedIPs };
    }

    if (values.families) {
      const treeFamilies = JSON.parse(currentTree?.treeFAmilies || '');
      const formattedFamilies = JSON.stringify([...treeFamilies, ...values.families]);
      formattedValues = { ...values, families: formattedFamilies };
    }

    return ({ ...formattedValues, updated_at: new Date });
  }
}
