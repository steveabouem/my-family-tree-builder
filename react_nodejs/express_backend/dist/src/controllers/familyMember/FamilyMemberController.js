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
const logger_1 = __importDefault(require("../../utils/logger"));
const services_1 = require("../../services");
class FamilyMemberController extends Base_controller_1.default {
    constructor() {
        super('family_trees');
    }
    createAll(members, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const service = new services_1.FamilyMemberService();
            try {
                const res = yield service.createRecords(members, userId);
                return res;
            }
            catch (e) {
                logger_1.default.error('Unable to bulk create members ', e);
            }
            return null;
        });
    }
}
exports.default = FamilyMemberController;
