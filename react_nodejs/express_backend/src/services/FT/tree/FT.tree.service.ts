import FTFam from "../../../models/FT.family";
import FTTree from "../../../models/FT.tree.";
import { dateValid } from "../../../utils/FT/date.utils";
import { BaseService } from "../../base/base.service";
import { DFamilyTreeDTO } from "./FT.tree.definitions";

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
            console.log('Fields are valid');
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

    getFamilies = async (p_tree: number): Promise<FTFam[] | undefined> => {
        const currentTree = await FTTree.findByPk(p_tree);
        if (currentTree) {

            const fams = currentTree?.getFams();
            console.log({ fams });
            return fams;
        }
        console.log('No tree matching');
        return undefined;

    }

    validateFTTreeFields = (p_values: DFamilyTreeDTO): boolean => {
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
}
