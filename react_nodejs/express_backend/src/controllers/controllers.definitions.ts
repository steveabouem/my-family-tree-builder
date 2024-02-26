import { Session } from "express-session";
import { DFamilyTreeRecord } from "./familyTree/familyTree.definitions";
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
  familyTree?:  DFamilyTreeRecord;
}

export interface DSession {
  type: string;
  user: DSessionUser;
  session: Session;
}

export interface DEndpointResponse {
  status: number,
  session: string,
  error: boolean;
  payload?: unknown;
  message?: string
}