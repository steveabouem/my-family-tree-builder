"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const { JWT } = process.env;
class FTSessionService extends base_service_1.BaseService {
    constructor(p_token) {
        super('FTSessions');
        this.setSessionToken = (p_session) => __awaiter(this, void 0, void 0, function* () {
            if (!JWT) {
                return null;
            }
            const encryptedSession = jsonwebtoken_1.default.sign(JSON.stringify(p_session), JWT, { expiresIn: '30mn' });
            this.token = encryptedSession;
            yield FT_session_1.default.create({ key: encryptedSession, createdAt: new Date }); // not sure yet if I will ever need this
            return encryptedSession;
        });
        this.getSessionObject = (p_keys) => {
            let sessionData = {};
            if (JWT) {
                try {
                    const sessionJWTObject = jsonwebtoken_1.default.verify(this.token, JWT);
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
            if (currentSession && JWT) {
                const existingValues = Object.assign({}, currentSession);
                currentSession = Object.assign(Object.assign({}, existingValues), p_session); //replace all session keys that were updated
                const newSessionKey = jsonwebtoken_1.default.sign(JSON.stringify(currentSession), JWT); // TODO: check how to maintain the same expiration time even as you update the session. ANd check refresh token
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
