import { DFTUserDTO } from "../../../services/FT/user/FT.user..definitions";
import { FTUserService } from "../../../services/FT/user/FT.user.service";
import BaseController from "../../Base.controller";
import { DFTUserRecord } from "./FT.user.definitions";


class FTUserController extends BaseController<DFTUserRecord> {
    // TODO: set user for both below? should this be more ov a service task?

    //      User model
    //          first_name: DataTypes.STRING,
    //          last_name: DataTypes.STRING,
    //          email: DataTypes.STRING,
    //          password: {
    //              type: DataTypes.STRING,
    //              set(value) {
    //                  this.setDataValue('password', hash(value));
    //              }
    //     },
    //      tasks: DataTypes.JSON,
    //      roles: DataTypes.JSON,
    //   }, {
    constructor() {
        super('Users');

    }

    create = async (p_user: DFTUserDTO): Promise<boolean> => {
        const userService = new FTUserService();
        // TODO: catch return false doesnt actually catch falty logic, 
        // just wrong syntax and maybe wrong typing. FIX
        console.log('NEW USER: ', p_user);

        await userService.create(p_user).catch(() => false);
        return true;
    }

}

export default FTUserController;