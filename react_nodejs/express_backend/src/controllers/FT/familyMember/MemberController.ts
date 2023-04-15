// import { UserService } from "../../services/user/user.service";
// import BaseController from "../../../Base.controller";
// import { DUserRecord } from "../../../User/User.definitions";
// import { DFamilyMemberRecord } from "./Member.definitions";

// class FamilyMemberController extends BaseController<DFamilyMemberRecord> {
//     constructor() {
//         super('FTUser');
//     }


//     getUserData = async (p_memberId: number): Promise<DUserRecord> => {
//         const userService = new UserService();
//         const currentMember: DFamilyMemberRecord = await this.baseService.getById(p_memberId);
//         const user: DUserRecord = await userService.getById(currentMember.user_id);

//         return user;
//     }

//     getMemberAuthorizedIps = async (p_memberId: number): Promise<string[]> => {
//         const currentMember: DFamilyMemberRecord = await this.getById(p_memberId);
//         const authorizedIps = JSON.parse(currentMember.assigned_ip);

//         return authorizedIps;
//     }

// }

// export default FamilyMemberController;