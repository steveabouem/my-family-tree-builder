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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const FT_user_middleware_1 = require("../../middleware-classes/user/FT.user.middleware");
const Base_controller_1 = __importDefault(require("../Base.controller"));
class FTUserController extends Base_controller_1.default {
    constructor() {
        super('Users');
    }
}
_a = FTUserController;
FTUserController.create = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const userMiddleware = new FT_user_middleware_1.FTUserMiddleware();
    // TODO: catch return false doesnt actually catch falty logic, 
    // just wrong syntax and maybe wrong typing. FIX
    console.log('NEW USER: ', user);
    yield userMiddleware.create(user).catch(() => false);
    return true;
});
exports.default = FTUserController;
