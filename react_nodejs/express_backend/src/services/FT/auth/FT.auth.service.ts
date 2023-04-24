import { DUserRecord } from "../../../controllers/tracker/User/User.definitions";
import { BaseService } from "../../base/base.service";
// import { FTUserService } from "../user/FT.user.service";
import db from "../../../db";

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
        const select = `SELECT *FROM FTIPs where value = '228.247.168.47';`
        const result = await this.dataBase.query(select);

        return !!result[0].length;
    }

}
export default FTAuthService;
