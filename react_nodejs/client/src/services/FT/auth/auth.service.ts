import BaseService from "../../base/base.service";
import { DUserDTO } from "./auth.definitions";

class AuthService extends BaseService {
    // const submitLoginForm = ({ email, name, password }) => {
    //     return request.post('/login', { email, name, password });
    // };

    // const submitRegistrationForm = ({ email, name, password }) => {
    //     return request.post('api/register', { email, name, password });
    // };

    register = async(p_values: Partial<DUserDTO>): Promise<boolean> => {
        const success = await this.request.post(`${this.APIBaseUrl}/auth/register`, p_values);
        
        return !!success;
    }

    validateRegistrationFields = (p_values: DUserDTO): boolean => {
        return false;
    }
}

export default AuthService;
