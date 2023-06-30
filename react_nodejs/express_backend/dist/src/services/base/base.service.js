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
exports.BaseService = void 0;
const sequelize_1 = require("sequelize");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const db_1 = __importDefault(require("../../db"));
/**
 * A service receives data of type D...Record and returns data of type D...DTO
 * All the sql queries amd business logic are handled inside the service, the controller is
 * simply a gateway for the express endpoint to go through to get the data requested
 */
class BaseService {
    constructor(table) {
        this.getDTOMapping = () => {
            // TODO: figure out how to map the generic type's keys to retur an object and use that as return getById and the likes
            // @ts-expect-error
            const keys = Object.keys({});
            console.log({ keys });
            const obj = {};
            for (const key of keys) {
                obj[key] = null; // Initialize each key with null value
            }
            console.log(obj);
            return obj;
        };
        this.dataBase = db_1.default;
        this.tableName = table;
        this.salt = bcryptjs_1.default.genSaltSync(8);
    }
    index(p_limit) {
        return __awaiter(this, void 0, void 0, function* () {
            // TODO: no any
            const select = `SELECT * FROM :tableName LIMIT :limit;`;
            const results = yield this.dataBase.query(select, {
                replacements: { tableName: this.tableName, limit: p_limit },
                type: sequelize_1.QueryTypes.SELECT
            });
            return results[0];
        });
    }
    getList(p_columns, p_where, p_joins, p_limit) {
        return __awaiter(this, void 0, void 0, function* () {
            let joins = '';
            let where = '';
            let limit = '';
            let selector = "*";
            if (p_where) {
                where = p_where;
            }
            if (p_columns) {
                selector = p_columns === null || p_columns === void 0 ? void 0 : p_columns.join(', ');
            }
            if (p_joins) {
                joins = p_joins.reduce((p_joinStatement, p_currentJoin) => {
                    return `${p_joinStatement} JOIN ${p_currentJoin.tableName} ON ${p_currentJoin.on}`;
                }, joins);
            }
            if (p_limit) {
                limit = `LIMIT ${p_limit}`;
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
    getById(p_id) {
        return __awaiter(this, void 0, void 0, function* () {
            // await this.dataBase.authenticate();
            // const select = `SELECT * FROM :tableName WHERE id = :id;`;
            // // TODO: no any
            // const record: any = await this.dataBase.query(select, {
            //   type: QueryTypes.SELECT,
            //   replacements: { tableName: this.tableName, id: p_id }
            // });
            // return record[0][0];
        });
    }
    disable(p_id, p_table) {
        return __awaiter(this, void 0, void 0, function* () {
            const update = `UPDATE :table SET active = false WHERE id = :id;`;
            // TODO: catch return false doesnt actually catch falty logic, 
            // just wrong syntax and maybe wrong typing. FIX
            yield this.dataBase.query(update, {
                type: sequelize_1.QueryTypes.UPDATE,
                replacements: { table: p_table, id: p_id }
            }).catch(() => false);
            return true;
        });
    }
}
exports.BaseService = BaseService;
