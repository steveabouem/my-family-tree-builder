import { DUserRecord } from "../../../controllers/tracker/User/User.definitions";
import { BaseMiddleware } from "../../base/base.middleware";
import { DUserDTO } from "./user.definitions";
import bcrypt from 'bcryptjs';

// TODO: I feel like the controlle should use a generic of the DTO and the middleware a generic of the record, somtheing like that
export class UserMiddleware extends BaseMiddleware<DUserRecord> {
    salt: string;
    constructor() {
        super('Users');
        this.salt = bcrypt.genSaltSync(8);
    }

    create = async (user: DUserDTO): Promise<boolean> => {
        //TODO:validations
        const hashedPwd = bcrypt.hashSync(user.password, this.salt);
        const values = { ...user, password: hashedPwd };
        const isUserValid = await
            console.log({ values, valid: this.validateUserFields(values) });

        const insert = `
            INSERT INTO ${this.tableName} ${Object.keys(values).join(', ')}
            VALUES ${[Object.values(values)].join(', ')}
        ;`;

        await this.dataBase.query(insert).catch(() => false);
        return true;
    }

    validateUserFields = (values: DUserDTO): boolean => {
        console.log('ALL VALUES', Object.values(values));

        const userHasAllValues = !Object.values(values).find((v: string | undefined) => !v);
        // TODO: throw errors properly back to the front
        if (!userHasAllValues) {
            return false;
        }

        if (values.password.length < 14) {
            // TODO: throw errors properly back to the front

        }


        return true;
    };
    // setIps = async (ips: [], id: number): Promise<boolean> {
    //     const user = this.getById(id);
    // }
}
