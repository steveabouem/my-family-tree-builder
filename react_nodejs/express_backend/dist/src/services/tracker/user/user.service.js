"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const base_service_1 = require("../../base/base.service");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
// TODO: I feel like the controlle should use a generic of the DTO and the service a generic of the record, somtheing like that
class UserService extends base_service_1.BaseService {
    constructor() {
        super('Users');
        this.create = (p_user) => __awaiter(this, void 0, void 0, function* () {
            //TODO:validations
            const hashedPwd = bcryptjs_1.default.hashSync(p_user.password, this.salt);
            const values = Object.assign(Object.assign({}, p_user), { password: hashedPwd });
            const isUserValid = yield console.log({ values, valid: this.validateUserFields(values) });
            const insert = `
            INSERT INTO ${this.tableName} ${Object.keys(values).join(', ')}
            VALUES ${[Object.values(values)].join(', ')}
        ;`;
            yield this.dataBase.query(insert).catch(() => false);
            return true;
        });
        this.validateUserFields = (p_values) => {
            console.log('ALL VALUES', Object.values(p_values));
            const userHasAllValues = !Object.values(p_values).find((v) => !v);
            // TODO: throw errors properly back to the front
            if (!userHasAllValues) {
                return false;
            }
            if (p_values.password.length < 14) {
                // TODO: throw errors properly back to the front
            }
            return true;
        };
        this.salt = bcryptjs_1.default.genSaltSync(8);
    }
}
exports.UserService = UserService;
