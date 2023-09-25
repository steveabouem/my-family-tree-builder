// import { UserMiddleware } from "../../middlewares/user/user.middleware";
// import BaseController from "../../Base.controller";
// import { DUserRecord } from "../../tracker/User/User.definitions";

// class FamilyMemberController extends BaseController<DFamilyMemberRecord> {
//     constructor() {
//         super('FTUser');
//     }


//     getUserData = async (memberId: number): Promise<DUserRecord> => {
//         const userMiddleware = new UserMiddleware();
//         const currentMember: DFamilyMemberRecord = await this.baseMiddleware.getById(memberId);
//         const user: DUserRecord = await userMiddleware.getById(currentMember.user_id);

//         return user;
//     }

//     getMemberAuthorizedIps = async (memberId: number): Promise<string[]> => {
//         const currentMember: DFamilyMemberRecord = await this.getById(memberId);
//         const authorizedIps = JSON.parse(currentMember.assigned_ip);

//         return authorizedIps;
//     }

// }

// export default FamilyMemberController;