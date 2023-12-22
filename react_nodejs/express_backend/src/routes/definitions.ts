import { Cookie, Session } from "express-session";

export enum HTTPMethodEnum {
  get = 'get',
  post = 'post',
  put = 'put',
  patch = 'patch',
}

export interface DSessionUser {
  id: number;
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