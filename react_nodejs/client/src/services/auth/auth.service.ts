import BaseService from "../base/base.service";
import { DUserDTO } from "./auth.definitions";

class AuthService extends BaseService {
  // TODO: axios response typing: Promise<Partial<DUserDTO | null>>
  public submitLoginForm = async (values: Partial<DUserDTO>): Promise<any> => {
    const currentUser = await this.request.post(`${this.APIBaseUrl}/auth/login`, values);
    return currentUser;
  };

  // TODO: create the front end common definition for a session and apply it here AND NO ANY
  public submitRegistrationForm = async (values: Partial<DUserDTO>): Promise<any> => {
    const currentSession = await this.request.post(`${this.APIBaseUrl}/auth/register`, values);

    return currentSession;
  }

  public logout = async (): Promise<void> => {
    await this.request.post(`${this.APIBaseUrl}/auth/logout`);
    return;
  }
  public validateRegistrationFields = (values: DUserDTO): boolean => {
    return false;
  }
}

export default AuthService;
