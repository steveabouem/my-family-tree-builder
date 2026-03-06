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
exports.deleteUser = exports.updatePassword = exports.updateUser = exports.getProfileDetailsByUserId = exports.createUser = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const sequelize_1 = require("sequelize");
const sequelize_2 = require("sequelize");
const Role_1 = __importDefault(require("../models/Role"));
const FamilyMember_1 = __importDefault(require("../models/FamilyMember"));
const FamilyTree_1 = __importDefault(require("../models/FamilyTree"));
const logger_1 = __importDefault(require("../utils/logger"));
const User_1 = __importDefault(require("../models/User"));
const toolkit_1 = require("../utils/toolkit");
const serviceHelpers_1 = require("./serviceHelpers");
const createUser = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    const hashedPassword = bcryptjs_1.default.hashSync(userData.password, (0, toolkit_1.addSeasoning)());
    const defaultUserRole = yield Role_1.default.findOne({ where: { name: 'user' } });
    const payloadData = { email: '', userId: 0 };
    // @ts-ignore
    const response = (0, serviceHelpers_1.generateResponseData)(payloadData);
    if (!defaultUserRole) {
        logger_1.default.error('Unable to create new user: no default role available');
        return response;
    }
    const formattedValues = Object.assign(Object.assign({}, userData), { status: 1, password: hashedPassword, role_id: defaultUserRole.id, created_at: new Date });
    const fieldsValid = validateUserFields(formattedValues);
    const duplicate = yield (0, serviceHelpers_1.extractSingleDataValuesFrom)(User_1.default, { where: { email: userData.email } });
    if (duplicate) {
        logger_1.default.error('! User.create ! User already exists');
        return response;
    }
    if (fieldsValid) {
        const newUser = yield User_1.default.create(formattedValues);
        if (newUser) {
            response.code = 200;
            response.error = false;
            response.payload = { userId: newUser.id, email: newUser.email, firstName: newUser.first_name, lastName: newUser.last_name };
            response.addToSession = true;
            logger_1.default.info('New USer returns to session ', { response });
            return response;
        }
        else {
            logger_1.default.error('! User.create !', 'User wasn\'t created, unable to save');
        }
    }
    return response; //unchaged from init
});
exports.createUser = createUser;
const getProfileDetailsByUserId = (id) => __awaiter(void 0, void 0, void 0, function* () {
    let response = null;
    try {
        const user = yield User_1.default.findByPk(id, { attributes: { exclude: ['password', 'updated_at'] } });
        if (user === null || user === void 0 ? void 0 : user.dataValues) {
            const data = user.dataValues;
            const membersRecordsCount = yield FamilyMember_1.default.findAll({
                where: {
                    email: { [sequelize_2.Op.eq]: data.email }
                }
            });
            const nodeIds = [...membersRecordsCount.map(m => m.node_id)];
            const treesCount = yield FamilyTree_1.default.count({
                where: {
                    members: { [sequelize_2.Op.like]: `%${data.email}%` }
                }
            });
            logger_1.default.info('Retrieved user profile info', { treesCount, nodeIds, membersRecordsCount });
            response = {
                error: false,
                code: 200,
                payload: Object.assign(Object.assign({}, data), { membersRecordsCount: nodeIds.length, treesCount })
            };
        }
        else {
            logger_1.default.error('User not found: ', { id });
            response = {
                error: true,
                code: 500,
                payload: null
            };
        }
        return response;
    }
    catch (e) {
        logger_1.default.error('error ', e);
        return {
            error: true,
            code: 500,
            payload: null
        };
    }
});
exports.getProfileDetailsByUserId = getProfileDetailsByUserId;
const updateUser = (id, updateData) => __awaiter(void 0, void 0, void 0, function* () {
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
exports.updateUser = updateUser;
const updatePassword = (passwordData) => __awaiter(void 0, void 0, void 0, function* () {
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
                password: bcryptjs_1.default.hashSync(passwordData.newPassword, (0, toolkit_1.addSeasoning)())
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
exports.updatePassword = updatePassword;
const deleteUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
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
exports.deleteUser = deleteUser;
const validateUserFields = (values) => {
    // if (!values.dob) {
    //   logger.info('missing dob');
    //   logger.error('! User.validateUserFields ! missing dob');
    //   return false;
    // }
    // if (!values?.assigned_ips?.length || !values.assigned_ips) {
    //   logger.info('missing assigned IPs');
    //   logger.error('! User.validateUserFields ! missing assigned IPs.');
    //   return false;
    // }
    if (!values.first_name) {
        logger_1.default.info('missing first_name');
        logger_1.default.error('! User.validateUserFields ! missing first_name');
        return false;
    }
    if (!values.gender) {
        logger_1.default.info('missing gender');
        logger_1.default.error('! User.validateUserFields ! missing gender');
        return false;
    }
    if (!values.email) {
        logger_1.default.info('missing email');
        logger_1.default.error('! User.validateUserFields ! missing email');
        return false;
    }
    if (!values.last_name) {
        logger_1.default.info('missing last_name');
        logger_1.default.error('! User.validateUserFields ! missing last_name');
        return false;
    }
    // if (!values.marital_status) {
    //   logger.info('missing marital_status');
    //   logger.error('! User.validateUserFields ! missing marital_status');
    //   return false;
    // }
    if (!values.password) {
        logger_1.default.info('missing password');
        logger_1.default.error('! User.validateUserFields ! missing password');
        return false;
    }
    return true;
};
const getRelatedFamilies = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const relatedFamilies = await FamilyTree.count({
        //   where: {
        //     members: 
        //   }
        // }) // familytree service has something already
        // return relatedFamilies || [];
    }
    catch (e) {
        logger_1.default.error('Failed to get related families:', e);
        return [];
    }
});
const getExtendedFamiliesDetails = (id) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const currentUser = yield (0, exports.getProfileDetailsByUserId)(id);
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
