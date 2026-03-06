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
exports.updateUser = exports.login = exports.register = void 0;
const dayjs_1 = __importDefault(require("dayjs"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const sequelize_1 = require("sequelize");
const logger_1 = __importDefault(require("../utils/logger"));
const user_1 = require("./user");
const serviceHelpers_1 = require("./serviceHelpers");
const User_1 = __importDefault(require("../models/User"));
const toolkit_1 = require("../utils/toolkit");
const register = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    let buffer = null;
    const ip = userData.ip;
    const userImage = ((_a = userData.profile_url) === null || _a === void 0 ? void 0 : _a.replace(/^data:image\/\w+;base64,/, '')) || null;
    if (userImage) {
        logger_1.default.info('Processing img at registration');
        buffer = Buffer.from(userImage, 'base64');
    }
    const formattedValues = Object.assign(Object.assign({}, userData), { assigned_ips: [ip], created_at: (0, dayjs_1.default)(), profile_url: buffer });
    let response = {
        error: true,
        code: 500,
        payload: { email: '', userId: 0 }
    };
    const duplicate = yield (0, serviceHelpers_1.extractSingleDataValuesFrom)(User_1.default, { where: { email: { [sequelize_1.Op.eq]: userData.email } } });
    logger_1.default.info({ duplicate });
    if (duplicate) {
        response.error = true;
        logger_1.default.error('Email address is already in use', { duplicate });
        response.code = 400;
        return response;
    }
    response.addToSession = true;
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
const login = (_a) => __awaiter(void 0, [_a], void 0, function* ({ email, password }) {
    const payloadData = { email: '', userId: 0 };
    const response = (0, serviceHelpers_1.generateResponseData)(payloadData);
    try {
        const currentUser = yield User_1.default.findOne({ where: { email: { [sequelize_1.Op.eq]: email } } });
        if (!currentUser) {
            response.error = true;
            response.message = 'Unable to find user';
            logger_1.default.error('! login ! User not found');
            response.code = 400;
            return response;
        }
        const passwordIsValid = bcryptjs_1.default.compareSync(password, currentUser.password);
        if (passwordIsValid) {
            response.error = false;
            response.payload = {
                userId: currentUser.id,
                email: email,
                firstName: currentUser.first_name,
                lastName: currentUser.last_name,
            };
            response.addToSession = true;
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
const updateUser = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    const response = (0, serviceHelpers_1.generateResponseData)({});
    try {
        logger_1.default.info('RADY TO UPDAT UER');
        const { new_password, repeat_new_password, password, userId } = userData;
        const publicFields = ['email', 'first_name', 'last_name'];
        const user = yield User_1.default.findByPk(userId);
        let updateData = {};
        if (!user) {
            response.error = true;
            response.message = 'User not found';
            logger_1.default.error('Unable to reset password: user not found');
            response.code = 404;
            return response;
        }
        if (password && new_password && repeat_new_password) {
            const newPasswordIsVerified = bcryptjs_1.default.compareSync(password, user.password);
            const passwordIsValid = new_password === repeat_new_password;
            const newPasswordIsUnused = new_password !== password;
            logger_1.default.info('PASSWORD CHECK: ', { passwordIsValid, newPasswordIsVerified, newPasswordIsUnused });
            if (passwordIsValid && newPasswordIsVerified && newPasswordIsUnused) {
                updateData.password = bcryptjs_1.default.hashSync(new_password, (0, toolkit_1.addSeasoning)());
                logger_1.default.info('AFTER DATA UPDATE ', { updateData });
            }
            else {
                logger_1.default.error('Reset Password. Passwords not matching');
                response.error = true;
                response.code = 500;
                response.message = 'Invalid operation';
                return response;
            }
        }
        // @ts-ignore
        publicFields.forEach((field) => { if (userData[field])
            updateData[field] = userData[field]; });
        // update returns the updated user or null
        const updatedUser = yield user.update(updateData);
        if (updatedUser) {
            response.payload = {
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
exports.updateUser = updateUser;
