import BaseController from "../../Base.controller";
import { DUserRecord } from "./User.definitions";

class UserController extends BaseController<DUserRecord> {
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

    // create = async (p_user: DUserDTO): Promise<boolean> => {
    //     const userService = new UserService();
    //     // TODO: catch return false doesnt actually catch falty logic, 
    //     // just wrong syntax and maybe wrong typing. FIX
    //     console.log('NEW USER: ', p_user);

    //     await userService.create(p_user).catch(() => false);
    //     return true;
    // }

}

export default UserController;