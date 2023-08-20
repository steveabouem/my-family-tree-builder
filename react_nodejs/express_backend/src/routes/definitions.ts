export enum HTTPMethodEnum {
  get = 'get',
  post = 'post',
  put = 'put',
  patch = 'patch',
}

export interface DSessionUser {
  type: string;
  token: string | null;
  ip?: string;
  ipIsValid?: number;
  id?: number;
  email?: string;
  firstName?: string;
  lastName?: string;
}