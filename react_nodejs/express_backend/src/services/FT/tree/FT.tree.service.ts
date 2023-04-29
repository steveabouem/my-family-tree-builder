import FTFam from "../../../models/FT.family";
import FTTree from "../../../models/FT.tree.";
import { dateValid } from "../../../utils/FT/date.utils";
import { BaseService } from "../../base/base.service";
import { DFamilyTreeDTO, DFamilyTreeUpdateDTO } from "./FT.tree.definitions";

export class FTTreeService extends BaseService<DFamilyTreeDTO> {
    constructor() {
        super('FTTrees');
    }

    create = async (p_values: DFamilyTreeDTO): Promise<boolean> => {
        // TODO: creation date has a default value in models. I might possibly skip this formatting,
        //  and adjust the DTO to make the prop optional. leaving it for now as it makes validation simpler
        const formattedValues = { ...p_values, created_at: new Date, active: true };
        const valid = this.validateFTTreeFields(formattedValues);

        if (valid) {
            await FTTree.create({ ...formattedValues })
                .catch(e => {
                    console.log('Error creating tree'); // TODO: LOGGING AND SEND BACK TO FRONT IF NECESSARY

                    return false;
                });

            return true;
        } else {
            console.log('Fields are not valid');

            return false;
        }
    }

    getTree = async (p_id: number): Promise<FTTree | null> => {
        const currentTree = await this.getById(p_id);
        return currentTree;
    }

    getFamilies = async (p_tree: number): Promise<number[] | undefined> => {
        const currentTree = await FTTree.findByPk(p_tree);
        if (currentTree) {

            const fams = currentTree.FTTreeFAmilies;
            console.log({ fams });
            return JSON.parse(fams);
        }
        console.log('No tree matching');
        return undefined;

    }


    addFamily = async (p_tree: number, p_family: number): Promise<boolean> => {
        const currentTree = await FTTree.findByPk(p_tree);

        if (currentTree) {
            const relatedFamilies = JSON.parse(currentTree.FTTreeFAmilies);
            relatedFamilies.push(p_family);

            console.log({ relatedFamilies });

            await currentTree.update({ families: JSON.stringify(relatedFamilies) });
            await currentTree.save();

            return true;
        }

        return false;
    }

    removeFamily = async (p_family: number, p_id: number): Promise<boolean> => {
        const currentTree = await FTTree.findByPk(p_id);

        if (currentTree) {
            const relatedFamilies = JSON.parse(currentTree.FTTreeFAmilies).filter((id: number) => id != p_family);
            console.log({ relatedFamilies });

            await currentTree.update({ families: JSON.stringify(relatedFamilies) })
                .catch(e => {
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

    update = async (p_values: DFamilyTreeUpdateDTO, p_id: number): Promise<boolean> => {
        // TODO: once individual field validations are there, use it here
        // const valid = this.validateFTTreeFields(p_values);
        // if (valid) {

        const currentTree = await FTTree.findByPk(p_id);
        const formattedValues = await this.formatUpdateValues(p_values);

        if (currentTree) {
            await currentTree?.update({ ...formattedValues }, { where: { id: p_id } })
                .catch(e => {
                    console.log('Error updating tree');
                    return false;
                });
            currentTree?.save();
            console.log('Update completed');

            return true;
        }

        return false;
    }

    validateFTTreeFields = (p_values: DFamilyTreeUpdateDTO | DFamilyTreeDTO): boolean => {
        // TODO: you will need individual field validations, 
        // in order to validate any type of operation without worrying about required fields
        if (!p_values.created_at || !dateValid(p_values.created_at)) {
            console.log('Missing or incorrect creation date');
            return false;
        }

        if (!p_values.created_by) {
            console.log('Missing creator value');
            return false;
        }

        if (!p_values.name) {
            console.log('Missing name');
            return false;
        }

        if (p_values.public === undefined || p_values.public === null) {
            console.log('Missing public');
            return false;
        }

        if (!dateValid(p_values.updated_at)) {
            console.log('Incorrect update date');
            return false;
        }

        if (!p_values.active) {
            console.log('Missing active');
            return false;
        }

        return true;
    }

    // return type uses a partial here to not have to deal with the id property present in the update DTO
    formatUpdateValues = async (p_values: DFamilyTreeUpdateDTO): Promise<Partial<DFamilyTreeUpdateDTO> | undefined> => {
        const currentTree = await FTTree.findByPk(p_values?.id);
        let formattedValues = {};
        if (!currentTree) {
            return;
        }

        if (p_values.authorized_ips) {
            const treeIPs = JSON.parse(currentTree?.FTTreeAuthorized_ips || '');
            const formattedIPs = JSON.stringify([...treeIPs, ...p_values.authorized_ips]);
            formattedValues = { ...p_values, authorized_ips: formattedIPs };
        }

        if (p_values.families) {
            const treeFamilies = JSON.parse(currentTree?.FTTreeFAmilies || '');
            const formattedFamilies = JSON.stringify([...treeFamilies, ...p_values.families]);
            formattedValues = { ...p_values, families: formattedFamilies };
        }

        return ({ ...formattedValues, updated_at: new Date });
    }
}
