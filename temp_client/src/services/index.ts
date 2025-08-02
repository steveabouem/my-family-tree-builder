import * as user from "./user";
import * as auth from "./auth";
import * as familyTree from "./familyTree";
import * as session from "./session";

export const service = {
  auth,
  familyTree,
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
export {endpoints}