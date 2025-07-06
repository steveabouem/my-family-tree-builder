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
exports.UserService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const sequelize_1 = require("sequelize");
const User_1 = __importDefault(require("../../models/User"));
const Role_1 = __importDefault(require("../../models/Role"));
const logger_1 = __importDefault(require("../../utils/logger"));
class UserService {
    constructor() {
        this.salt = 10;
    }
    createUser(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            const hashedPassword = bcryptjs_1.default.hashSync(userData.password, this.salt);
            const defaultUserRole = yield Role_1.default.findOne({ where: { name: 'user' } });
            if (!defaultUserRole) {
                logger_1.default.error('Unable to create new user: no default role available');
                return null;
            }
            try {
                const formattedValues = Object.assign(Object.assign({}, userData), { related_to: [1], password: hashedPassword, role_id: defaultUserRole.id, created_at: new Date });
                const fieldsValid = this.validateUserFields(formattedValues);
                const duplicate = yield User_1.default.findOne({ where: { email: userData.email } });
                if (duplicate) {
                    logger_1.default.error('! User.create ! User already exists');
                    return null;
                }
                if (fieldsValid) {
                    const newUser = yield User_1.default.create(formattedValues);
                    if (newUser) {
                        yield newUser.save();
                        return newUser;
                    }
                    else {
                        logger_1.default.error('! User.create !', 'User wasn\'t created, unable to save');
                    }
                }
            }
            catch (e) {
                logger_1.default.error('Failed registration: ', e);
            }
            return null;
        });
    }
    getUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield User_1.default.findOne({ where: { email: email } });
            }
            catch (e) {
                logger_1.default.error('Failed to get user by email:', e);
                return null;
            }
        });
    }
    getUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield User_1.default.findByPk(id, { attributes: { exclude: ['id', 'password'] } });
            }
            catch (e) {
                logger_1.default.error('Failed to get user by id:', e);
                return null;
            }
        });
    }
    updateUser(id, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield User_1.default.findByPk(id);
                if (!user)
                    return null;
                yield user.update(updateData);
                return user;
            }
            catch (e) {
                logger_1.default.error('Failed to update user:', e);
                return null;
            }
        });
    }
    updatePassword(passwordData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const currentUser = yield User_1.default.findOne({ where: { email: passwordData.email } });
                if (!currentUser) {
                    logger_1.default.error('Reset Password. No matching user');
                    return null;
                }
                const newPasswordIsVerified = bcryptjs_1.default.compareSync(passwordData.password, currentUser.password);
                const passwordIsValid = passwordData.newPassword === passwordData.repeatNewPassword;
                const newPasswordIsUnused = passwordData.newPassword !== passwordData.password;
                if (passwordIsValid && newPasswordIsVerified && newPasswordIsUnused) {
                    const updatedUser = yield currentUser.update({
                        password: bcryptjs_1.default.hashSync(passwordData.newPassword, this.salt)
                    });
                    logger_1.default.info('password changed: ', updatedUser);
                    return updatedUser;
                }
                else {
                    logger_1.default.error('Reset Password. Passwords not matching');
                    return null;
                }
            }
            catch (e) {
                logger_1.default.error('Failed password change: ', e);
                return null;
            }
        });
    }
    deleteUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield User_1.default.findByPk(id);
                if (!user)
                    return false;
                yield user.destroy();
                return true;
            }
            catch (e) {
                logger_1.default.error('Failed to delete user:', e);
                return false;
            }
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
            console.log('missing assigned IPs');
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
        if (!values.marital_status) {
            console.log('missing marital_status');
            logger_1.default.error('! User.validateUserFields ! missing marital_status');
            return false;
        }
        if (!values.password) {
            console.log('missing password');
            logger_1.default.error('! User.validateUserFields ! missing password');
            return false;
        }
        return true;
    }
    getRelatedFamilies(id) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const select = `
        SELECT id, name
        FROM Families 
        WHERE JSON_CONTAINS(members, :id);
      `;
                const relatedFamilies = yield ((_a = User_1.default.sequelize) === null || _a === void 0 ? void 0 : _a.query(select, {
                    type: sequelize_1.QueryTypes.SELECT,
                    replacements: { id: `${id}` }
                }));
                return relatedFamilies || [];
            }
            catch (e) {
                logger_1.default.error('Failed to get related families:', e);
                return [];
            }
        });
    }
    getExtendedFamiliesDetails(id) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const currentUser = yield this.getUserById(id);
                if (!currentUser)
                    return [];
                const select = `
        SELECT * 
        FROM Users user 
        JOIN Families family ON family.id = user.imm_family 
        WHERE JSON_CONTAINS(family.members, :partner) ;
      `;
                const extendedFamilies = yield ((_a = User_1.default.sequelize) === null || _a === void 0 ? void 0 : _a.query(select, {
                    type: sequelize_1.QueryTypes.SELECT,
                }));
                return extendedFamilies || [];
            }
            catch (e) {
                logger_1.default.error('Failed to get extended families details:', e);
                return [];
            }
        });
    }
}
exports.UserService = UserService;
