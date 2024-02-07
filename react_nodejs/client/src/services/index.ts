import AuthService from "./auth/auth.service";
import FamilyTreeService from "./familyTree/familyTree.service";
import UserService from "./user/user.service";
import SessionService from "./session/session.service";

const service = {
  auth: AuthService,
  familyTree: FamilyTreeService,
  user: UserService,
  sessio: SessionService,
};
export default service;