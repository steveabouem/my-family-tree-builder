import axios from "axios";
import { User ,ChangePasswordValues } from "types";
import { APILoginResponse, APIRequestPayload, LoginRequestPayload } from "../../../shared";
import { baseUrl } from "./index";

export const submitLoginForm = async (values: Partial<User>): Promise<APIRequestPayload<APILoginResponse>> => {
  const currentUser = await axios.post<LoginRequestPayload, APIRequestPayload<APILoginResponse>>(`${baseUrl}/auth/login`, values);
  return currentUser;
};

export const submitRegistrationForm = async (values: Partial<User>): Promise<any> => {
  const currentSession = await axios.post(`${baseUrl}/auth/register`, values);

  return currentSession;
}

export const submitPasswordChangeForm = async (values: ChangePasswordValues): Promise<any> => {
  const res = await axios.post(`${baseUrl}/auth/password/change`, values);
  return res;
}
export const logout = async (): Promise<void> => {
  await axios.post(`${baseUrl}/auth/logout`);
  localStorage.clear();
  return;
}
export const validateRegistrationFields = (values: User): boolean => {
  return false;
}