import BaseController from "../Base.controller";

class UserController {
    // TODO: set user for both below? should this be more ov a service task?
    setIPs: (p_ips: string[], p_userId: number) => Promise<boolean>;
    setIPAuthority: (p_auth: boolean, p_userId: number) => Promise<boolean>;

    constructor() {
        this.setIPs = async (p_ips: string[], p_userId: number): Promise<boolean> => {
            // TODO: sequelize query or raw sql (DECIDE WHICH IS STANDARD)
            return false;
        };

        this.setIPAuthority = async (p_auth: boolean, p_userId: number): Promise<boolean> => {
            // TODO: sequelize query or raw sql (DECIDE WHICH IS STANDARD)
            return false;
        };
    }
}

export default UserController;