import { APILoginResponse, APIRegistrationResponse } from "./auth.definitions";
import { Request } from "express";
import { AuthService } from "../../services";
import { APIRequestPayload } from "../controllers.definitions";
import BaseController from "../Base.controller";

class AuthController extends BaseController<any> { // ! -TOFIX: no any
    constructor() {
        super('');
    }

    public async register(req: Request<{}, { userData: any }, any, {}>): Promise<APIRequestPayload<APIRegistrationResponse | null>> {
        const service = new AuthService();
        return await service.register(req.body.userData);
    }

    // public async login(req: Request<{}, { email: string, password: string }, any, {}>): Promise<APIRequestPayload<APILoginResponse>> {
    //     const service = new AuthService();
    //     return await service.login(req.body);
    // }

    // public async logout(): Promise<APIRequestPayload<APILoginResponse>> {
    //     const service = new AuthService();
    //     return await service.logout();
    // }

    // public async changePassword(req: Request): Promise<APIRequestPayload<APILoginResponse>> {
    //     const service = new AuthService();
    //     return await service.changePassword(req.body);
    // }
}

export default AuthController;
