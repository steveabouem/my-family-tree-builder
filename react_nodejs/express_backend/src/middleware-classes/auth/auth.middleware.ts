import bcrypt from "bcryptjs";
import { DFTLoginFields } from "./auth.definitions";
import { DUserDTO } from "../user/user..definitions";
import { BaseMiddleware } from "../base/base.middleware";
import User from "../../models/User";
import FTIP from "../../models/Ip";

class FTAuthMiddleware extends BaseMiddleware<any> { // TODO: no any
    constructor() {
        super('ip_addresses');
    }

    // verifyUserIp = async (id: number): Promise<boolean> => {
    //     const userMiddleware = new UserMiddleware();
    //     // TODO: catch return false doesnt actually catch falty logic, 
    //     // just wrong syntax and maybe wrong typing. FIX
    //     const currentUser: DUserRecord = await userMiddleware.getById(id);
    //     return this.authorized_ips.includes(currentUser.authorizedIps);
    // }

    verifyIp = async (currentIp?: string | string[]): Promise<boolean> => {
        if (!currentIp) {
            return false;
        }

        // TODO: SQL BINDINGS
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
