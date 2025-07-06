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
const Base_controller_1 = __importDefault(require("../Base.controller"));
const User_1 = __importDefault(require("../../models/User"));
const logger_1 = __importDefault(require("../../utils/logger"));
const Role_1 = __importDefault(require("../../models/Role"));
class UserController extends Base_controller_1.default {
    constructor() {
        super('Users');
    }
    create(values) {
        return __awaiter(this, void 0, void 0, function* () {
            const hashedPassword = bcryptjs_1.default.hashSync(values.password, this.salt);
            const defaultUserRole = yield Role_1.default.findOne({ where: { name: 'user' } });
            if (defaultUserRole) {
                try {
                    // ! -TOFIX: implement search by name as user enter their last name. 
                    // Does it make sense to offer them choices given the security aspect?
                    const formattedValues = Object.assign(Object.assign({}, values), { related_to: [1], password: hashedPassword, role_id: defaultUserRole.id, created_at: new Date });
                    const fieldsValid = yield this.validateUserFields(formattedValues);
                    const duplicate = yield User_1.default.findOne({ where: { email: values.email } });
                    let newUser = null;
                    if (duplicate) {
                        logger_1.default.error('! User.create ! User already exists');
                        return null;
                    }
                    if (fieldsValid) {
                        // @ts-ignore: partner needs to always be optional
                        newUser = yield User_1.default.create(formattedValues).catch((e) => {
                            logger_1.default.error('! User.create !', e);
                            return null;
                        });
                        if (newUser) {
                            yield newUser.save();
                        }
                        else {
                            logger_1.default.error('! User.create !', 'User wasn\'t created, unable to save');
                        }
                        return Object.assign(Object.assign({}, newUser === null || newUser === void 0 ? void 0 : newUser.dataValues), { password: undefined });
                    }
                }
                catch (e) {
                    logger_1.default.error('Failed registration: ', e);
                }
            }
            else {
                logger_1.default.error('Unable to create new user: no default role available');
            }
            return null;
        });
    }
    // ! -TOFIX: No any. fix typing, should related_to be added to the dto?
    getUserData(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentUser = yield User_1.default.findByPk(id, { attributes: { exclude: ['id', 'password'] } });
            if (currentUser === null || currentUser === void 0 ? void 0 : currentUser.dataValues) {
                const relatedFamilies = yield this.getRelatedFamilies(id);
                return (Object.assign(Object.assign({}, currentUser.dataValues), { relatedTo: [...relatedFamilies] }));
            }
        });
    }
    getByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentUser = yield User_1.default.findOne({ where: { email: email } });
            return (currentUser);
        });
    }
    getRelatedFamilies(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const select = `
      SELECT id, name
      FROM Families 
      WHERE JSON_CONTAINS(members, :id);
    `;
            const relatedFamilies = yield this.dataBase.query(select, {
                type: sequelize_1.QueryTypes.SELECT,
                replacements: { id: `${id}` }
            }).catch(() => false);
            return relatedFamilies;
        });
    }
    // ! -TOFIX: no any
    getExtendedFamiliesDetails(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentUser = yield this.getUserData(id)
                .catch((e) => {
                // ! -TOFIX: logging
                console.log('ERROR', e);
            });
            console.log(currentUser.partner);
            const select = `
      SELECT * 
      FROM Users user 
      JOIN Families family ON family.id = user.imm_family 
      WHERE JSON_CONTAINS(family.members, :partner) ;
    `;
            const extendedFamilies = yield this.dataBase.query(select, {
                type: sequelize_1.QueryTypes.SELECT,
                replacements: { partner: `${currentUser.partner}` }
            }).catch(() => false);
            return extendedFamilies;
        });
    }
    updatePassword(values) {
        return __awaiter(this, void 0, void 0, function* () {
            let completed = false;
            const currentUser = yield User_1.default.findOne({ where: { email: values.email } })
                .catch(e => {
                logger_1.default.info('QUERY FAILSL ', e);
            });
            if (currentUser) {
                try {
                    const newPasswordIsVerified = bcryptjs_1.default.compareSync(values.password, currentUser.password);
                    const passwordIsValid = values.newPassword === values.repeatNewPassword;
                    const newPasswordIsUnused = values.newPassword !== values.password;
                    if (passwordIsValid && newPasswordIsVerified && newPasswordIsUnused) {
                        const updatedUser = yield currentUser.update({ password: bcryptjs_1.default.hashSync(values.newPassword, this.salt) })
                            .catch((e) => {
                            logger_1.default.error('Update user error', e);
                        });
                        logger_1.default.info('password changed: ', updatedUser);
                        completed = true;
                    }
                    else {
                        logger_1.default.error('Reset PAssword. Passwords not matching');
                    }
                }
                catch (e) {
                    logger_1.default.error('Failed password change: ', e);
                }
            }
            else {
                logger_1.default.error('Reset PAssword. No matching user');
            }
            return completed;
        });
    }
    validateUserFields(values) {
        var _a;
        console.log('RECEIVED VALUES: ', values);
        if (!values.dob) {
            console.log('missing dob');
            logger_1.default.error('! User.validateUserFields ! missing dob');
            return false;
        }
        if (!((_a = values === null || values === void 0 ? void 0 : values.assigned_ips) === null || _a === void 0 ? void 0 : _a.length) || !values.assigned_ips) {
            console.log('missing .');
            logger_1.default.error('! User.validateUserFields ! missing assigned IPs.');
            return false;
        }
        if (!values.description) {
            console.log('missing description');
            logger_1.default.error('! User.validateUserFields ! missing description');
            return false;
        }
        if (!values.first_name) {
            console.log('missing first_name');
            logger_1.default.error('! User.validateUserFields ! missing first_name');
            return false;
        }
        if (!values.gender) {
            console.log('missing gender');
            logger_1.default.error('! User.validateUserFields ! missing gender');
            return false;
        }
        if (values.is_parent === null || values.is_parent === undefined) {
            // must be explicitly identified
            console.log('missing is_parent');
            logger_1.default.error('! User.validateUserFields ! missing is_parent');
            return false;
        }
        if (!values.email) {
            console.log('missing email');
            logger_1.default.error('! User.validateUserFields ! missing email');
            return false;
        }
        if (!values.last_name) {
            console.log('missing last_name');
            logger_1.default.error('! User.validateUserFields ! missing last_name');
            return false;
        }
        // if (!values.imm_family) {
        //   console.log('missing imm_family');
        //   logger.error('! User.validateUserFields ! missing imm_family');
        //   return false;
        // }
        if (!values.marital_status) {
            console.log('missing marital_status');
            logger_1.default.error('! User.validateUserFields ! missing marital_status');
            return false;
        }
        if (!values.password || values.password.length < 14) {
            console.log('missing password');
            logger_1.default.error('! User.validateUserFields ! missing password');
            return false;
        }
        return true;
    }
}
exports.default = UserController;
