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
exports.changePassword = exports.logout = exports.login = exports.register = void 0;
const dayjs_1 = __importDefault(require("dayjs"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const logger_1 = __importDefault(require("../utils/logger"));
const sequelize_1 = require("sequelize");
const user_1 = require("./user");
const serviceHelpers_1 = require("./serviceHelpers");
const User_1 = __importDefault(require("../models/User"));
//#region register
const register = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    const ip = userData.ip;
    const formattedValues = Object.assign(Object.assign({}, userData), { assigned_ips: [ip], created_at: (0, dayjs_1.default)() });
    let response = {
        error: true,
        code: 500,
        payload: { authenticated: false, email: '', userId: 0, }
    };
    const duplicate = yield (0, serviceHelpers_1.extractSingleDataValuesFrom)(User_1.default, { where: { email: { [sequelize_1.Op.eq]: userData.email } } });
    logger_1.default.info({ duplicate });
    if (duplicate) {
        response.error = true;
        logger_1.default.error('Email address is already in use', { duplicate });
        response.code = 400;
        return response;
    }
    const userResponse = yield (0, user_1.createUser)(formattedValues);
    if (userResponse.code === 200) {
        logger_1.default.info('New user created ', userResponse);
    }
    else {
        logger_1.default.error('Unable to create new user: ', userResponse);
    }
    return userResponse;
});
exports.register = register;
//#endregion
//#region login
const login = ({ email, password }) => __awaiter(void 0, void 0, void 0, function* () {
    const payloadData = { authenticated: false, email: '', userId: 0 };
    const response = (0, serviceHelpers_1.generateResponseData)(payloadData);
    try {
        const currentUser = yield User_1.default.findOne({ where: { email: { [sequelize_1.Op.eq]: email } } });
        if (!currentUser) {
            logger_1.default.info('Logging in user ', { currentUser });
            response.error = true;
            response.message = 'Unable to find user';
            logger_1.default.error('! login ! User not found');
            return response;
        }
        const passwordIsValid = bcryptjs_1.default.compareSync(password, currentUser.password);
        if (passwordIsValid) {
            response.error = false;
            response.payload = {
                userId: currentUser.id,
                authenticated: true,
                email: email,
                firstName: currentUser.first_name,
                lastName: currentUser.last_name,
            };
            response.code = 200;
        }
        else {
            response.error = true;
            logger_1.default.error('! login ! User authentication failed');
            response.message = 'Unable to authenticate user';
            response.code = 400;
        }
    }
    catch (e) {
        response.message = `Login failed - ${e}`;
        logger_1.default.error('! login !', e);
        response.code = 400;
    }
    return response;
});
exports.login = login;
//#endregion
//#region logout
const logout = () => __awaiter(void 0, void 0, void 0, function* () {
    const response = (0, serviceHelpers_1.generateResponseData)({
        authenticated: false, email: ''
    });
    return response;
});
exports.logout = logout;
//#endregion
//#region changePassword
const changePassword = (passwordData) => __awaiter(void 0, void 0, void 0, function* () {
    const response = (0, serviceHelpers_1.generateResponseData)({ authenticated: false });
    try {
        // The v2 user service expects passwordData to have: email, password (current), newPassword, repeatNewPassword
        const user = yield User_1.default.findOne({ where: { email: { [sequelize_1.Op.eq]: passwordData.email } } });
        if (!user) {
            response.error = true;
            response.message = 'User not found';
            logger_1.default.error('Unable to reset password: user not found');
            response.code = 404;
            return response;
        }
        // Compose the expected structure for updatePassword
        const updateData = {
            email: passwordData.email,
            password: passwordData.currentPassword,
            newPassword: passwordData.newPassword,
            repeatNewPassword: passwordData.newPassword // Assume confirmation is handled elsewhere or add a param if needed
        };
        // updatePassword returns the updated user or null
        const updatedUser = yield (0, user_1.updatePassword)(updateData);
        if (updatedUser) {
            response.payload = {
                authenticated: true,
                email: updatedUser.email,
                firstName: updatedUser.first_name,
                lastName: updatedUser.last_name,
                userId: updatedUser.id
            };
            response.code = 200;
            response.error = false;
        }
        else {
            logger_1.default.error('Reset password: update function returned nothing');
            response.code = 500;
            response.message = 'Failed to update password';
        }
    }
    catch (e) {
        response.error = true;
        response.code = 500;
        response.message = 'Invalid operation';
        logger_1.default.error('Unable to reset password. ', e);
    }
    return response;
});
exports.changePassword = changePassword;
//#endregion
