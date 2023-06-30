"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Base_controller_1 = __importDefault(require("../../Base.controller"));
class UserController extends Base_controller_1.default {
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
exports.default = UserController;
