import BaseService from "../../base/base.service";
import { DUserDTO } from "./auth.definitions";

class AuthService extends BaseService {
  // TODO: axios response typing: Promise<Partial<DUserDTO | null>>
  public submitLoginForm = async (p_values: Partial<DUserDTO>): Promise<any> => {
    const currentUser = await this.request.post(`${this.APIBaseUrl}/auth/login`, p_values);
    return currentUser;
  };

  // TODO: create the front end common definition for a session and apply it here
  public submitRegistrationForm = async (p_values: Partial<DUserDTO>): Promise<any> => {
    const currentSession = await this.request.post(`${this.APIBaseUrl}/auth/register`, p_values);

    return currentSession;
  }

  public validateRegistrationFields = (p_values: DUserDTO): boolean => {
    return false;
  }
}

export default AuthService;
