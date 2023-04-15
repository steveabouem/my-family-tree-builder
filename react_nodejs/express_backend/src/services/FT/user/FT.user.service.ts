import { DUserRecord } from "../../../controllers/tracker/User/User.definitions";
import { BaseService } from "../../base/base.service";
import { DFTUserDTO } from "./FT.user..definitions";

// TODO: I feel like the controlle should use a generic of the DTO and the service a generic of the record, somtheing like that
export class FTUserService extends BaseService<DUserRecord> {
    constructor() {
        super('FTUser');
    }


    create = async (p_member: DFTUserDTO): Promise<boolean> => {
        return false;
    }

    validateFamilyMemberFields = (p_values: DFTUserDTO): boolean => {
        console.log('ALL VALUES', Object.values(p_values));

        const memberHasAllValues = !Object.values(p_values).find((v: string | undefined) => !v);
        // TODO: throw errors properly back to the front
        if (!memberHasAllValues) {
            return false;
        }

        if (p_values.password.length < 14) {
            // TODO: throw errors properly back to the front
            return false;
        }


        return true;
    };
}
