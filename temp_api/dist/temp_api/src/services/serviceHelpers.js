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
exports.extractGroupDataValuesFrom = exports.extractSingleDataValuesFrom = exports.generateResponseData = void 0;
const generateResponseData = (data) => {
    return {
        error: true,
        code: 500,
        payload: data
    };
};
exports.generateResponseData = generateResponseData;
// TODO: THIS FILE IS POLLUTED BY ANYs
/**
 * extract the dataValues property of any Sequelize Model that a service function would need
 * @param bindings
 * @param entity
 * @returns
 */
function extractSingleDataValuesFrom(entity, bindings) {
    return __awaiter(this, void 0, void 0, function* () {
        const record = yield entity.findOne(bindings);
        if (record === null || record === void 0 ? void 0 : record.dataValues) {
            return record.dataValues;
        }
        return null;
    });
}
exports.extractSingleDataValuesFrom = extractSingleDataValuesFrom;
function extractGroupDataValuesFrom(entity, bindings) {
    return __awaiter(this, void 0, void 0, function* () {
        const records = yield entity.findAll(bindings);
        if (records === null || records === void 0 ? void 0 : records.length) {
            return records.map((r) => r.dataValues);
        }
        return null;
    });
}
exports.extractGroupDataValuesFrom = extractGroupDataValuesFrom;
