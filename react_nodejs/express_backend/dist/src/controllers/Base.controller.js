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
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../db"));
class BaseController {
    constructor(table) {
        this.dataBase = db_1.default;
        this.tableName = table;
        this.salt = bcryptjs_1.default.genSaltSync(8);
    }
    getList(columns, incomingWhere, incomingJoins, incomingLimit) {
        return __awaiter(this, void 0, void 0, function* () {
            let joins = '';
            let where = '';
            let limit = '';
            let selector = "*";
            if (where) {
                where = incomingWhere || '';
            }
            if (columns) {
                selector = columns === null || columns === void 0 ? void 0 : columns.join(', ');
            }
            if (joins) {
                joins = (incomingJoins === null || incomingJoins === void 0 ? void 0 : incomingJoins.reduce((joinStatement, currentJoin) => {
                    return `${joinStatement} JOIN ${currentJoin.tableName} ON ${currentJoin.on}`;
                }, joins)) || '';
            }
            if (limit) {
                limit = `LIMIT ${incomingLimit}`;
            }
            const select = `
                SELECT :selector
                FROM :tableName
                :joins
                :where
                :limit
                ;
            `;
            const results = yield this.dataBase.query(select, {
                type: sequelize_1.QueryTypes.SELECT,
                replacements: {
                    selector,
                    tableName: this.tableName,
                    joins,
                    where,
                    limit
                }
            });
            return results[0];
        });
    }
    getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const results = {}; // ! -TOFIX: no any
            return results;
        });
    }
    ;
}
exports.default = BaseController;
