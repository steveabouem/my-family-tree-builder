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
const sequelize_1 = require("sequelize");
const base_service_1 = require("../../base/base.service");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const FT_session_1 = __importDefault(require("../../../models/FT.session"));
class FTSessionService extends base_service_1.BaseService {
    constructor(p_token) {
        super('FTSessions');
        this.setSessionToken = (p_session) => __awaiter(this, void 0, void 0, function* () {
            let encryptedSession = null;
            if (process.env.PASS) {
                encryptedSession = jsonwebtoken_1.default.sign({ session: JSON.stringify(p_session) }, process.env.PASS, { expiresIn: '1800' });
                this.token = encryptedSession;
                // await FTSession.create({ key: encryptedSession, createdAt: new Date }); // not sure yet if I will ever need this
                return encryptedSession;
            }
            return encryptedSession;
        });
        this.getSessionObject = (p_keys) => {
            let sessionData = {};
            if (process.env.PASS) {
                try {
                    const sessionJWTObject = jsonwebtoken_1.default.verify(this.token, process.env.PASS);
                    if (typeof sessionJWTObject === 'object' && sessionJWTObject !== null) {
                        if (p_keys) { // NOTE: If no key is provided, return all session (most likely used in the back)
                            for (const sessionKey of p_keys) {
                                sessionData[sessionKey] = sessionJWTObject[sessionKey];
                            }
                            return sessionData; // NOTE: I will have to ignore the jwt keys from the payload 
                        }
                        else {
                            return sessionJWTObject;
                        }
                    }
                    return null;
                    // TODO: typing
                }
                catch (e) {
                    console.log(`Token error: ${e}`);
                    return null;
                }
            }
            return null;
        };
        this.updateSessionObject = (p_session, p_keys) => __awaiter(this, void 0, void 0, function* () {
            let currentSession = this.getSessionObject(p_keys);
            if (currentSession && process.env.PASS) {
                const existingValues = Object.assign({}, currentSession);
                currentSession = Object.assign(Object.assign({}, existingValues), p_session); //replace all session keys that were updated
                const newSessionKey = jsonwebtoken_1.default.sign(JSON.stringify(currentSession), process.env.PASS); // TODO: check how to maintain the same expiration time even as you update the session. ANd check refresh token
                yield FT_session_1.default.update({ key: newSessionKey }, {
                    where: {
                        key: {
                            [sequelize_1.Op.eq]: this.token
                        }
                    }
                });
                return true;
            }
            return false;
        });
        this.token = p_token;
    }
}
exports.default = FTSessionService;
