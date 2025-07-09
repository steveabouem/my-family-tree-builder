import bcrypt from "bcryptjs";
import { APIFTLoginFields } from "./auth.definitions";
import User from "../../models/User";
import FTIP from "../../models/Ip";
import { APIUserDTO } from "../../controllers/user/user.definitions";

class AuthMiddleware { 
    verifyIp = async (currentIp?: string | string[]): Promise<boolean> => {
        if (!currentIp) {
            return false;
        }

        // ! -TOFIX: SQL BINDINGS
        const ip = FTIP.findOne({ where: { value: currentIp } });
        return !!ip;
    }

    verifyUser = async (values: APIFTLoginFields): Promise<Partial<APIUserDTO> | null> => {
        const currentUser = await User.findOne({ where: { email: values.email } });
        if (!currentUser) {
            return null;
        }

        const passwordValid = bcrypt.compareSync(values.password, currentUser.password);

        if (passwordValid) {
            console.log('User is verified', currentUser);

            return { ...currentUser.dataValues, password: '' };
        }

        return null
    }

}
export default AuthMiddleware;
