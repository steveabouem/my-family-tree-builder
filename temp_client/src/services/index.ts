import AuthService from "./auth/auth.service";
import FamilyTreeService from "./familyTree/familyTree.service";
import UserService from "./user/user.service";
import SessionService from "./session/session.service";

const service = {
  auth: AuthService,
  familyTree: FamilyTreeService,
  user: UserService,
  session: SessionService,
};

 const endpoints = {
  auth: {index: '/connect'},
  trees: {index: '/trees/index', getById: '/trees/?id=:id', new: '/trees/new'},
  members: {index: '/members/index', getById: '/members?id=:id', new: '/members/new'},
  users: {index: '/users/index', getById: '/users?id=:id', new: '/users/new'},
  sessions: {get: '/?id=:id', update: '/update'}
};
export {service};
export {endpoints}