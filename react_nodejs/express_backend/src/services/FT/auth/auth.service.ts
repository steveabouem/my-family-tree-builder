import { DUserRecord } from "../../../controllers/tracker/User/User.definitions";
import { FTUserService } from "../user/FT.user.service";

class FTAuthService { // Not related to any entity, hence not extending the base. Auth is standalone
    authorized_ips: string[];

    constructor() {
        this.authorized_ips = ['1', '2']; //TODO: SET SERVICE TO GET USER IP
    }

    verifyUserIp = async (p_id: number): Promise<boolean> => {
        const familyMemberService = new FTUserService();
        // TODO: catch return false doesnt actually catch falty logic, 
        // just wrong syntax and maybe wrong typing. FIX
        const currentUser: DUserRecord = await familyMemberService.getById(p_id);
        return this.authorized_ips.includes(currentUser.authorizedIps);
    }

}
export default FTAuthService;
