import { Cookie, Session } from "express-session";
export interface DTableJoin {
    tableName: string;
    on: string;
}

// Augment express-session with a custom SessionData object
declare module "express-session" {
  interface SessionData {
    user_id: number;
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
  data?: unknown;
  message?: string
}