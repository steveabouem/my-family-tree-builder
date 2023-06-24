export enum HTTPMethodEnum {
  get = 'get',
  post = 'post',
  put = 'put',
  patch = 'patch',
}

export interface DSessionUser {
  type: string;
  token: string;
  ip?: string;
  ipIsValid?: boolean;
  id?: number;
  email?: string;
  firstName?: string;
  lastName?: string;
}