import { DUserRecord } from "../../../controllers/tracker/User/User.definitions";
import { BaseService } from "../../base/base.service";
import { DUserDTO } from "./user.definitions";
import bcrypt from 'bcryptjs';

// TODO: I feel like the controlle should use a generic of the DTO and the service a generic of the record, somtheing like that
export class UserService extends BaseService<DUserRecord> {
    salt: string;
    constructor() {
        super('Users');
        this.salt = bcrypt.genSaltSync(10);
    }

    create = async (p_user: DUserDTO): Promise<boolean> => {
        //TODO:validations
        const hashedPwd = bcrypt.hashSync(p_user.password, this.salt);
        const values = { ...p_user, password: hashedPwd };
        const isUserValid = await
            console.log({ values, valid: this.validateUserFields(values) });

        const insert = `
            INSERT INTO ${this.tableName} ${Object.keys(values).join(', ')}
            VALUES ${[Object.values(values)].join(', ')}
        ;`;

        await this.dataBase.query(insert).catch(() => false);
        return true;
    }

    validateUserFields = (p_values: DUserDTO): boolean => {
        console.log('ALL VALUES', Object.values(p_values));

        const userHasAllValues = !Object.values(p_values).find((v: string | undefined) => !v);
        // TODO: throw errors properly back to the front
        if (!userHasAllValues) {
            return false;
        }

        if (p_values.password.length < 14) {
            // TODO: throw errors properly back to the front

        }


        return true;
    };
    // setIps = async (p_ips: [], p_id: number): Promise<boolean> {
    //     const user = this.getById(p_id);
    // }
}
