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
exports.AuthService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const dayjs_1 = __importDefault(require("dayjs"));
const logger_1 = __importDefault(require("../../utils/logger"));
const UserController_1 = __importDefault(require("../../controllers/user/UserController"));
class AuthService {
    constructor() {
        this.userController = new UserController_1.default();
    }
    register(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            const ip = userData.ip;
            const formattedValues = Object.assign(Object.assign({}, userData), { assigned_ips: [ip], created_at: (0, dayjs_1.default)() });
            const response = {
                error: true,
                code: 500,
                payload: { authenticated: false, email: '', userId: 0, }
            };
            try {
                const duplicate = yield this.userController.getByEmail(userData.email);
                if (duplicate) {
                    response.error = true;
                    logger_1.default.error('Email address is already in use');
                    response.code = 400;
                    return response;
                }
                const newUser = yield this.userController.create(formattedValues);
                if (newUser) {
                    logger_1.default.info('New user created ', newUser);
                    response.error = false;
                    response.payload = {
                        userId: newUser.id || 0,
                        authenticated: true,
                        email: userData.email
                    };
                    response.code = 200;
                }
                else {
                    logger_1.default.error('Unable to create new user: ', { newUser });
                    response.code = 401;
                    response.message = 'Unable to create user';
                }
            }
            catch (e) {
                logger_1.default.error('Unable to register ', e);
                response.message = `Caught ERR ${e}`;
                response.code = 400;
            }
            return response;
        });
    }
    login({ email, password }) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = {
                code: 500, error: true, payload: {
                    authenticated: false,
                }
            };
            try {
                const currentUser = yield this.userController.getByEmail(email);
                if (!currentUser) {
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
    }
    logout() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = { code: 200, error: false, payload: {
                    authenticated: false, email: ''
                } };
            return response;
        });
    }
    changePassword(passwordData) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = {
                code: 500, error: true, payload: {
                    authenticated: false
                }
            };
            // try {
            //   const updatedUser = await this.userController.updatePassword(passwordData);
            //   logger.info('Return from update function: ', updatedUser);
            //   if (updatedUser) {
            //     response.payload = {
            //       authenticated: true,
            //       email: passwordData.email,
            //       firstName: passwordData.email,
            //       lastName: passwordData.email,
            //     };
            //     response.code = 200;
            //     response.error = false;
            //   } else {
            //     logger.error('Reset password: update function returned nothing');
            //     response.code = 500;
            //     response.message = 'Failed to update password';
            //   }
            // } catch (e: unknown) {
            //   response.error = true;
            //   response.code = 500;
            //   response.message = 'Invalid operation';
            //   logger.error('Unable to reset password. ', e);
            // }
            return response;
        });
    }
}
exports.AuthService = AuthService;
