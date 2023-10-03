export enum HTTPMethodEnum {
  get = 'get',
  post = 'post',
  put = 'put',
  patch = 'patch',
}

export interface DSessionUser {
  id: number;
  type: string;
  token: string | null;
  ip?: string;
  ipIsValid?: number;
  email?: string;
  firstName?: string;
  lastName?: string;
}