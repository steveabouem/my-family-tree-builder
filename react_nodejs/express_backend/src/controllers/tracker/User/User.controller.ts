import BaseController from "../../Base.controller";
import { DUserRecord } from "./User.definitions";

class UserController extends BaseController<DUserRecord> {

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

}

export default UserController;