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
const Base_controller_1 = __importDefault(require("../Base.controller"));
const logger_1 = __importDefault(require("../../utils/logger"));
const sequelize_1 = require("sequelize");
/**
// ?: Used to  manage session records, in case we dont use the default express-session (and session store)
**/
class SessionController extends Base_controller_1.default {
    constructor() {
        super('sessions');
    }
    getCurrent(req, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const response = { code: 500, authenticated: false, error: true };
            try {
                if ((_a = req.query) === null || _a === void 0 ? void 0 : _a.id) {
                    const sessionId = `${req.query.id}`;
                    //   @ts-ignore either find a way to use the store, or refactor migration
                    const currentSession = yield this.dataBase
                        .query("SELECT * FROM `Sessions` WHERE `sid` = :s limit 1", { replacements: { s: sessionId }, type: sequelize_1.QueryTypes.SELECT })
                        .catch((e) => {
                        logger_1.default.error('get current session: ', e);
                        response.error = true;
                        response.payload = 'Unable to find session' + e;
                        response.status = 400;
                        res.status(400);
                    });
                    res.status(200);
                    response.code = 200;
                    response.error = false;
                    if (currentSession === null || currentSession === void 0 ? void 0 : currentSession.length) {
                        response.current = currentSession[0];
                    }
                    else {
                        response.message = 'No existing session.';
                    }
                }
                else {
                    throw new Error('Missing mandatory parameters.');
                }
            }
            catch (e) {
                response.error = true;
                logger_1.default.error('Unable to retrieve session ', e);
                response.message = 'Unable to find session' + e;
                response.status = 400;
                res.status(400);
            }
            logger_1.default.info('current session', { response });
            return (response);
        });
    }
}
exports.default = SessionController;
