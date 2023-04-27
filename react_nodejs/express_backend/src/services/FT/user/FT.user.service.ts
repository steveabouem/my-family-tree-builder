import { DFTUserRecord } from "../../../controllers/FT/user/FT.user.definitions";
import FTUser from "../../../models/FT.user";
import { BaseService } from "../../base/base.service";
import { DFTUserDTO } from "./FT.user..definitions";
import bcrypt from "bcryptjs";

export class FTUserService extends BaseService<DFTUserRecord> {
    constructor() {
        super('FTUsers');
    }


    create = async (p_values: DFTUserDTO): Promise<boolean> => {
        const hashedPassword = bcrypt.hashSync(p_values.password, this.salt);
        const formattedValues = { ...p_values, password: hashedPassword, created_at: new Date };
        const fieldsValid = await this.validateFTUserFields(formattedValues);

        if (fieldsValid) {
            await FTUser.create(formattedValues).catch((e) => { //TODO: Error typing and catch
                console.log(e); //TODO: LOGGING
                return false;
            });

            return true;
        }

        return false;
    }

    validateFTUserFields = (p_values: DFTUserDTO): boolean => {
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
            console.log('missing be'); //TODO: LOGGING
            return false;
        }

        if (!p_values.email || p_values.email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
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

    getRelatedFamilies = async (p_id: number): Promise<any> => {
        const currentUser = await FTUser.findByPk(p_id);
        if (currentUser) {
            const relatedFamilies = await currentUser.getFamilies;
            return relatedFamilies;
        }
    }


}

