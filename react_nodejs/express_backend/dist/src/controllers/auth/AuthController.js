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
const Base_controller_1 = __importDefault(require("../Base.controller"));
const services_1 = require("../../services");
class AuthController extends Base_controller_1.default {
    constructor() {
        super('');
    }
    register(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const service = new services_1.AuthService();
            return yield service.register(req.body.userData);
        });
    }
    login(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const service = new services_1.AuthService();
            return yield service.login(req.body);
        });
    }
    logout() {
        return __awaiter(this, void 0, void 0, function* () {
            const service = new services_1.AuthService();
            return yield service.logout();
        });
    }
    changePassword(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const service = new services_1.AuthService();
            return yield service.changePassword(req.body);
        });
    }
}
exports.default = AuthController;
