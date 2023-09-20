import BaseService from "../../base/base.service";
import { DUserDTO } from "./auth.definitions";

class AuthService extends BaseService {
  // TODO: axios response typing: Promise<Partial<DUserDTO | null>>
  public submitLoginForm = async (values: Partial<DUserDTO>): Promise<any> => {
    // console.log('Submitted values', values);

    //     const formattedValues = {
    //       ...values, 
    //       age: Number(values.age),
    //       is_parent: boolean;
    //       gender: number; // 1: M; 2:F
    //       assigned_ips: string[];
    //       profile_url: string;
    //       description: string;
    //       imm_family: number;
    //       related_to: number[];
    //       sessionToken?: string;
    // }
    const currentUser = await this.request.post(`${this.APIBaseUrl}/auth/login`, values);
    return currentUser;
  };

  // TODO: create the front end common definition for a session and apply it here AND NO ANY
  public submitRegistrationForm = async (values: Partial<DUserDTO>): Promise<any> => {
    const currentSession = await this.request.post(`${this.APIBaseUrl}/auth/register`, values);

    return currentSession;
  }

  public validateRegistrationFields = (values: DUserDTO): boolean => {
    return false;
  }
}

export default AuthService;
