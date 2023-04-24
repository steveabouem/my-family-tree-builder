import { DFTUserRecord } from "../../../controllers/FT/user/FT.user.definitions";
import { BaseService } from "../../base/base.service";
import { DFTUserDTO } from "./FT.user..definitions";

// TODO: I feel like the controlle should use a generic of the DTO and the service a generic of the record, somtheing like that
export class FTUserService extends BaseService<DFTUserRecord> {
    constructor() {
        super('FTUser');
    }


    create = async (p_member: DFTUserDTO): Promise<boolean> => {
        const formattedMemberInfo = { ...p_member, created_at: new Date().toUTCString() };

        const insert = `
        INSERT INTO FTUsers 
        (${Object.keys(formattedMemberInfo).join(', ')}) 
        VALUES (${Object.values(formattedMemberInfo).join(', ')});`

        const result = await this.dataBase.query(insert)
            .catch((e) => { //TODO: Error typing and catch
                console.log(e); //TODO: LOGGING
                return false;
            });
        console.log({ results: result, insert });

        return true;
    }

    validateFTUserFields = (p_values: DFTUserDTO): boolean => {
        const ftUserHasAllValues = !Object.values(p_values).find((v: string | undefined) => !v);
        // TODO: throw errors properly back to the front
        if (!ftUserHasAllValues) {
            return false;
        }

        if (p_values.password.length < 14) {
            // TODO: throw errors properly back to the front
            return false;
        }

        return true;
    };
}

