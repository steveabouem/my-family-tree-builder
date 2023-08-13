// import { UserService } from "../../services/user/user.service";
// import BaseController from "../../Base.controller";
// import { DUserRecord } from "../../tracker/User/User.definitions";

// class FamilyMemberController extends BaseController<DFamilyMemberRecord> {
//     constructor() {
//         super('FTUser');
//     }


//     getUserData = async (memberId: number): Promise<DUserRecord> => {
//         const userService = new UserService();
//         const currentMember: DFamilyMemberRecord = await this.baseService.getById(memberId);
//         const user: DUserRecord = await userService.getById(currentMember.user_id);

//         return user;
//     }

//     getMemberAuthorizedIps = async (memberId: number): Promise<string[]> => {
//         const currentMember: DFamilyMemberRecord = await this.getById(memberId);
//         const authorizedIps = JSON.parse(currentMember.assigned_ip);

//         return authorizedIps;
//     }

// }

// export default FamilyMemberController;