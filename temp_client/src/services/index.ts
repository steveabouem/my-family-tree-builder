import AuthService from "./auth/auth.service";
import FamilyTreeService from "./familyTree/familyTree.service";
import * as user from "./user/user.service";
import * as session from "./session/session.service";

const service = {
  auth: AuthService,
  familyTree: FamilyTreeService,
  user,
  session,
};

 const endpoints = {
  auth: {index: '/connect'},
  trees: {index: '/trees/index', getById: '/trees/?id=:id', new: '/trees/new'},
  members: {index: '/members/index', getById: '/members?id=:id', new: '/members/new'},
  users: {index: '/users/index', getById: '/users?id=:id', new: '/users/new'},
  sessions: {get: '/?id=:id', update: '/update'}
};

export const baseUrl = process.env['API_BASE_URL'];
export {service};
export {endpoints}