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

    // verifyUserIp = async (p_id: number): Promise<boolean> => {
    //     const ftUserService = new FTUserService();
    //     // TODO: catch return false doesnt actually catch falty logic, 
    //     // just wrong syntax and maybe wrong typing. FIX
    //     const currentUser: DUserRecord = await ftUserService.getById(p_id);
    //     return this.authorized_ips.includes(currentUser.authorizedIps);
    // }

    verifyIp = async (p_ip?: string | string[]): Promise<boolean> => {
        if (!p_ip) {
            return false;
        }

        // TODO: SQL BINDINGS
        const ip = FTIP.findOne({ where: { value: p_ip } });
        return !!ip;
    }

    verifyUser = async (p_values: DFTLoginFields): Promise<Partial<DFTUserDTO> | null> => {
        const currentUser = await FTUser.findOne({ where: { email: p_values.email } });
        if (!currentUser) {
            return null;
        }

        const passwordValid = bcrypt.compareSync(p_values.password, currentUser.password);
        if (passwordValid) {

            return { ...currentUser.dataValues, password: '' };
        }

        return null
    }

}
export default FTAuthService;
