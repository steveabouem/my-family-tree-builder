import { DChangePasswordValues } from "pages/user/definitions";
import BaseService from "../base/base.service";
import { DUserDTO } from "@services/api.definitions";

class AuthService extends BaseService {
  // ! -TOFIX: axios response typing: Promise<Partial<DUserDTO | null>>
  public submitLoginForm = async (values: Partial<DUserDTO>): Promise<any> => {
    const currentUser = await this.request.post(`${this.APIBaseUrl}/auth/login`, values);
    return currentUser;
  };

  // ! -TOFIX: create the front end common definition for a session and apply it here AND NO ANY
  public submitRegistrationForm = async (values: Partial<DUserDTO>): Promise<any> => {
    const currentSession = await this.request.post(`${this.APIBaseUrl}/auth/register`, values);

    return currentSession;
  }

  public submitPasswordChangeForm = async(values: DChangePasswordValues): Promise<any> => {
    const res = await this.request.post(`${this.APIBaseUrl}/auth/password/change`, values);
    return res;
  }
  public logout = async (): Promise<void> => {
    await this.request.post(`${this.APIBaseUrl}/auth/logout`);
    localStorage.clear();
    return;
  }
  public validateRegistrationFields = (values: DUserDTO): boolean => {
    return false;
  }
}

export default AuthService;
