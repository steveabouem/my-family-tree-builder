import { Session } from "express-session";
import { DFamilyTreeRecord } from "./familyTree/familyTree.definitions";
import { Response, Request } from "express";
export interface DTableJoin {
  tableName: string;
  on: string;
}

// Augment express-session with a custom SessionData object
declare module "express-session" {
  interface SessionData {
    id: number;
    authenticated: boolean;
  }
}

export enum HTTPMethodEnum {
  get = 'get',
  post = 'post',
  put = 'put',
  patch = 'patch',
}

export interface DSessionUser {
  userId: number;
  authenticated: boolean;
  ip?: string;
  ipIsValid?: number;
  email?: string;
  firstName?: string;
  lastName?: string;
  familyTree?: DFamilyTreeRecord;
}

export interface DSession {
  type: string;
  user: DSessionUser;
  session: Session;
}

/*
* Pass a generic type to the response.
* All controllers will use the json method from Express.
* The generic T will allow controll over whats sent back to the client: only the type defined by T will be acceptable as a response
* see https://stackoverflow.com/questions/62736335/typescript-and-express-js-change-res-json-response-type
*/
export interface DEndpointResponse {
  sessionId?: string;
  error: boolean;
  code: number;
  message?: string;
}


/*
* Pass a generic type to the response.
* All controllers will use the json method from Express.
* The generic T will allow controll over whats sent back to the client: only the type defined by T will be acceptable as a response
* see https://stackoverflow.com/questions/62736335/typescript-and-express-js-change-res-json-response-type
*/
export interface DRequestPayload<P> extends DEndpointResponse {
  payload?: P;
}

type Send<ResBody = any, T = Response<ResBody>> = (body?: ResBody) => T;

export interface DHelperResponse {
  error: boolean;
  data: unknown;
}