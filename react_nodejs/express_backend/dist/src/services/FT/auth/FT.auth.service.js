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
const base_service_1 = require("../../base/base.service");
const FT_ip_1 = __importDefault(require("../../../models/FT.ip"));
const FT_user_1 = __importDefault(require("../../../models/FT.user"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
class FTAuthService extends base_service_1.BaseService {
    constructor() {
        super('FTIPs');
        // verifyUserIp = async (p_id: number): Promise<boolean> => {
        //     const ftUserService = new FTUserService();
        //     // TODO: catch return false doesnt actually catch falty logic, 
        //     // just wrong syntax and maybe wrong typing. FIX
        //     const currentUser: DUserRecord = await ftUserService.getById(p_id);
        //     return this.authorized_ips.includes(currentUser.authorizedIps);
        // }
        this.verifyIp = (p_ip) => __awaiter(this, void 0, void 0, function* () {
            if (!p_ip) {
                return false;
            }
            // TODO: SQL BINDINGS
            const ip = FT_ip_1.default.findOne({ where: { value: p_ip } });
            return !!ip;
        });
        this.verifyUser = (p_values) => __awaiter(this, void 0, void 0, function* () {
            console.log('HERE HERE HERE');
            const currentUser = yield FT_user_1.default.findOne({ where: { email: p_values.email } });
            if (!currentUser) {
                return null;
            }
            const passwordValid = bcryptjs_1.default.compareSync(p_values.password, currentUser.password);
            if (passwordValid) {
                return Object.assign(Object.assign({}, currentUser.dataValues), { password: '' });
            }
            return null;
        });
    }
}
exports.default = FTAuthService;
