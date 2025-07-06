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
exports.UserMiddleware = void 0;
const sequelize_1 = require("sequelize");
const User_1 = __importDefault(require("../../models/User"));
const base_middleware_1 = require("../base/base.middleware");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
class UserMiddleware extends base_middleware_1.BaseMiddleware {
    constructor() {
        super('users');
        this.create = (values) => __awaiter(this, void 0, void 0, function* () {
            const hashedPassword = bcryptjs_1.default.hashSync(values.password, this.salt);
            // ! -TOFIX: implement search by name as user enter their last name. 
            // Does it make sense to offer them choices given the security aspect?
            const formattedValues = Object.assign(Object.assign({}, values), { related_to: [1], password: hashedPassword, created_at: new Date });
            const fieldsValid = yield this.validateUserFields(formattedValues);
            let newUser = null;
            if (fieldsValid) {
                newUser = yield User_1.default.create(formattedValues).catch((e) => {
                    console.log(e); //TODO: LOGGING
                    return null;
                });
                yield (newUser === null || newUser === void 0 ? void 0 : newUser.save());
                return Object.assign(Object.assign({}, newUser === null || newUser === void 0 ? void 0 : newUser.dataValues), { password: undefined });
            }
            return null;
        });
        // ! -TOFIX: No any. fix typing, should related_to be added to the dto?
        this.getUserData = (id) => __awaiter(this, void 0, void 0, function* () {
            const currentUser = yield User_1.default.findByPk(id, { attributes: { exclude: ['id', 'password'] } });
            if (currentUser === null || currentUser === void 0 ? void 0 : currentUser.dataValues) {
                const relatedFamilies = yield this.getRelatedFamilies(id);
                return (Object.assign(Object.assign({}, currentUser.dataValues), { relatedTo: [...relatedFamilies] }));
            }
        });
        this.getByEmail = (email) => __awaiter(this, void 0, void 0, function* () {
            const currentUser = yield User_1.default.findOne({ where: { email: email } });
            return (currentUser);
        });
        this.getRelatedFamilies = (id) => __awaiter(this, void 0, void 0, function* () {
            const select = `
      SELECT id, name
      FROM families 
      WHERE JSON_CONTAINS(members, :id);
    `;
            const relatedFamilies = yield this.dataBase.query(select, {
                type: sequelize_1.QueryTypes.SELECT,
                replacements: { id: `${id}` }
            }).catch(() => false);
            return relatedFamilies;
        });
        // ! -TOFIX: no any
        this.getExtendedFamiliesDetails = (id) => __awaiter(this, void 0, void 0, function* () {
            const currentUser = yield this.getUserData(id)
                .catch((e) => {
                // ! -TOFIX: logging
                console.log('ERROR', e);
            });
            console.log(currentUser.partner);
            const select = `
      SELECT * 
      FROM users user 
      JOIN families family ON family.id = user.imm_family 
      WHERE JSON_CONTAINS(family.members, :partner) ;
    `;
            const extendedFamilies = yield this.dataBase.query(select, {
                type: sequelize_1.QueryTypes.SELECT,
                replacements: { partner: `${currentUser.partner}` }
            }).catch(() => false);
            return extendedFamilies;
        });
        this.validateUserFields = (values) => {
            var _a;
            console.log('RECEIVED VALUES: ', values);
            // if (values.age < 0 || !values.age) {
            //   return false;
            // }
            if (!((_a = values === null || values === void 0 ? void 0 : values.assigned_ips) === null || _a === void 0 ? void 0 : _a.length) || !values.assigned_ips) {
                console.log('missing .'); //TODO: LOGGING
                return false;
            }
            if (!values.description) {
                console.log('missing description'); //TODO: LOGGING
                return false;
            }
            if (!values.first_name) {
                console.log('missing first_name'); //TODO: LOGGING
                return false;
            }
            if (!values.gender) {
                console.log('missing gender'); //TODO: LOGGING
                return false;
            }
            if (values.is_parent === null || values.is_parent === undefined) {
                // must be explicitly identified
                console.log('missing is_parent'); //TODO: LOGGING
                return false;
            }
            if (!values.email || !values.email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
                console.log('missing email'); //TODO: LOGGING
                return false;
            }
            if (!values.last_name) {
                console.log('missing last_name'); //TODO: LOGGING
                return false;
            }
            // if (!values.imm_family) {
            //   console.log('missing imm_family'); //TODO: LOGGING
            //   return false;
            // }
            if (!values.marital_status) {
                console.log('missing marital_status'); //TODO: LOGGING
                return false;
            }
            if (!values.password || values.password.length < 14) {
                console.log('missing password'); //TODO: LOGGING
                return false;
            }
            return true;
        };
    }
}
exports.UserMiddleware = UserMiddleware;
