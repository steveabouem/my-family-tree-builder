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
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const base_middleware_1 = require("../base/base.middleware");
const User_1 = __importDefault(require("../../models/User"));
const Ip_1 = __importDefault(require("../../models/Ip"));
class FTAuthMiddleware extends base_middleware_1.BaseMiddleware {
    constructor() {
        super('ip_addresses');
        this.verifyIp = (currentIp) => __awaiter(this, void 0, void 0, function* () {
            if (!currentIp) {
                return false;
            }
            // ! -TOFIX: SQL BINDINGS
            const ip = Ip_1.default.findOne({ where: { value: currentIp } });
            return !!ip;
        });
        this.verifyUser = (values) => __awaiter(this, void 0, void 0, function* () {
            const currentUser = yield User_1.default.findOne({ where: { email: values.email } });
            if (!currentUser) {
                return null;
            }
            const passwordValid = bcryptjs_1.default.compareSync(values.password, currentUser.password);
            if (passwordValid) {
                console.log('User is verified', currentUser);
                return Object.assign(Object.assign({}, currentUser.dataValues), { password: '' });
            }
            return null;
        });
    }
}
exports.default = FTAuthMiddleware;
