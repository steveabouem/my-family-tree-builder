import bcrypt from "bcryptjs";
import { DFTLoginFields } from "./auth.definitions";
import { DUserDTO } from "../user/user..definitions";
import { BaseMiddleware } from "../base/base.middleware";
import User from "../../models/User";
import FTIP from "../../models/Ip";

class FTAuthMiddleware extends BaseMiddleware<any> { // ! -TOFIX: no any
    constructor() {
        super('ip_addresses');
    }

    verifyIp = async (currentIp?: string | string[]): Promise<boolean> => {
        if (!currentIp) {
            return false;
        }

        // ! -TOFIX: SQL BINDINGS
        const ip = FTIP.findOne({ where: { value: currentIp } });
        return !!ip;
    }

    verifyUser = async (values: DFTLoginFields): Promise<Partial<DUserDTO> | null> => {
        const currentUser = await User.findOne({ where: { email: values.email } });
        if (!currentUser) {
            return null;
        }

        const passwordValid = bcrypt.compareSync(values.password, currentUser.password);

        if (passwordValid) {
            console.log('User is verified', currentUser);

            return { ...currentUser.dataValues, password: '' };
        }

        return null
    }

}
export default FTAuthMiddleware;
