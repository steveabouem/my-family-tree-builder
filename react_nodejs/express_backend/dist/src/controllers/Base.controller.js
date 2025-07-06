"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const db_1 = __importDefault(require("../db"));
class BaseController {
    constructor(table) {
        this.dataBase = db_1.default;
        this.tableName = table;
        this.salt = bcryptjs_1.default.genSaltSync(8);
    }
}
exports.default = BaseController;
