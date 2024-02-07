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
const Base_controller_1 = __importDefault(require("../Base.controller"));
const dayjs_1 = __importDefault(require("dayjs"));
const UserController_1 = __importDefault(require("../user/UserController"));
const logger_1 = __importDefault(require("../../utils/logger"));
class AuthController extends Base_controller_1.default {
    constructor() {
        super('FTIPs');
    }
    register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = { error: true, status: 400, session: '' };
            const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
            const formattedValues = Object.assign(Object.assign({}, req.body), { assigned_ips: [ip], created_at: (0, dayjs_1.default)(), parent_2: 2 });
            try {
                const userController = new UserController_1.default();
                const duplicate = yield userController.getByEmail(req.body.email);
                if (duplicate) {
                    response.status = 400;
                    response.error = true;
                    response.data = 'Email address is already in use';
                    res.status(400);
                }
                const newUser = yield userController.create(formattedValues).catch(e => {
                    logger_1.default.error('! Auth.register !', e);
                    response.status = 400;
                    response.error = true;
                    response.data = 'Unable to create user';
                    res.status(400);
                });
                if (newUser) {
                    req.session.data = {
                        userId: newUser.id,
                        authenticated: true,
                        firstName: newUser.first_name,
                        lastName: newUser.last_name,
                        email: req.body.email
                    };
                    res.status(200);
                    response.error = false;
                    response.data = {
                        userId: newUser.id,
                        authenticated: true,
                        email: req.body.email
                    };
                    response.status = 200;
                    // console.log('SESSION TABLE', req.session);
                }
            }
            catch (e) {
                response.status = 400;
                response.message = `Caught ERR ${e}`;
                res.status(400);
            }
            // console.log('rEADY TO SEND: ', response);
            res.json(response);
        });
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = { error: true, status: 400, session: '' };
            try {
                const userController = new UserController_1.default();
                const currentUser = yield userController.getByEmail(req.body.email).catch(e => {
                    response.status = 400;
                    response.error = true;
                    response.data = 'Unable to find user';
                    res.status(400);
                });
                if (currentUser) {
                    const passwordIsValid = bcryptjs_1.default.compareSync(req.body.password, currentUser.password);
                    if (passwordIsValid) {
                        req.session.data = {
                            userId: currentUser.id,
                            firstName: currentUser.first_name,
                            lastName: currentUser.last_name,
                            authenticated: true,
                            email: req.body.email,
                        };
                        res.status(200);
                        response.error = false;
                        response.data = {
                            sessionId: req.sessionID,
                            userId: currentUser.id,
                            authenticated: true,
                            email: req.body.email,
                            firstName: currentUser.first_name,
                            lastName: currentUser.last_name,
                        };
                        response.status = 200;
                    }
                    else {
                        response.status = 400;
                        response.error = true;
                        response.data = 'Unable to authenticate user';
                        res.status(400);
                    }
                }
            }
            catch (e) {
                response.status = 400;
                response.message = `Login failed - ${e}`;
                res.status(400);
            }
            // console.log('rEADY TO SEND: ', response);
            res.json(response);
        });
    }
    logout(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = { error: true, status: 400, session: '' };
            req.session.destroy(() => { });
            res.status(200);
            response.error = false;
            response.data = {
                userId: 0,
                authenticated: false,
                email: req.body.email
            };
            response.status = 200;
            // console.log('RESPONSE: ', response);
            res.json(response);
        });
    }
}
exports.default = AuthController;
