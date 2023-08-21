import { DUserRecord } from "../../../controllers/tracker/User/User.definitions";
import { BaseService } from "../../base/base.service";
// import { FTUserService } from "../user/FT.user.service";
import db from "../../../db";
import FTIP from "../../../models/FT.ip";
import { DFTLoginFields } from "./FT.auth.definitions";
import FTUser from "../../../models/FT.user";
import bcrypt from "bcryptjs";
import { DFTUserDTO } from "../user/FT.user..definitions";

class FTAuthService extends BaseService<any> { // TODO: no any
    constructor() {
        super('FTIPs');
    }

    // verifyUserIp = async (id: number): Promise<boolean> => {
    //     const ftUserService = new FTUserService();
    //     // TODO: catch return false doesnt actually catch falty logic, 
    //     // just wrong syntax and maybe wrong typing. FIX
    //     const currentUser: DUserRecord = await ftUserService.getById(id);
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

    verifyUser = async (values: DFTLoginFields): Promise<Partial<DFTUserDTO> | null> => {
        const currentUser = await FTUser.findOne({ where: { email: values.email } });
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
export default FTAuthService;
