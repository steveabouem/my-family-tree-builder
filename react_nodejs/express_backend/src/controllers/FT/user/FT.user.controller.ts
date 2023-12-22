import { DFTUserDTO } from "../../../middleware-classes/user/FT.user..definitions";
import { FTUserMiddleware } from "../../../middleware-classes/user/FT.user.middleware";
import BaseController from "../../Base.controller";
import { DFTUserRecord } from "./FT.user.definitions";


class FTUserController extends BaseController<DFTUserRecord> {
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

    create = async (user: DFTUserDTO): Promise<boolean> => {
        const userMiddleware = new FTUserMiddleware();
        // TODO: catch return false doesnt actually catch falty logic, 
        // just wrong syntax and maybe wrong typing. FIX
        console.log('NEW USER: ', user);

        await userMiddleware.create(user).catch(() => false);
        return true;
    }

}

export default FTUserController;