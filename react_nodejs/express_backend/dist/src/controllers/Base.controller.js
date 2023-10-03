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
Object.defineProperty(exports, "__esModule", { value: true });
const base_service_1 = require("../services/base/base.service");
class BaseController {
    constructor(table) {
        this.getList = (columns, where, joins, limit) => __awaiter(this, void 0, void 0, function* () {
            const records = yield this.baseService.getList(columns, where, joins, limit);
            return records;
        });
        this.getById = (id) => __awaiter(this, void 0, void 0, function* () {
            const result = yield this.baseService.getById(id);
            return result;
        });
        this.tableName = table;
        this.baseService = new base_service_1.BaseService(table);
    }
}
exports.default = BaseController;
