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
const base_service_1 = require("../../base/base.service");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class FTSessionService extends base_service_1.BaseService {
    constructor() {
        super('FTSessions');
        this.setSession = (session) => __awaiter(this, void 0, void 0, function* () {
            // receives safe user profile (no pwd or other sensitive info) and signs it, returns it as header to be set as a token in front
            let signedUser = null;
            if (process.env.JWT_KEY) {
                signedUser = jsonwebtoken_1.default.sign({ session: JSON.stringify(session) }, process.env.JWT_KEY);
                // await FTSession.create({ key: encryptedSession, createdAt: new Date }); // not sure yet if I will ever need this
                console.log('PASS DETECTED: ', signedUser);
                return signedUser;
            }
            return signedUser;
        });
        this.getSessionData = (token, keys) => {
            let sessionData = {};
            if (process.env.JWT_KEY) {
                try {
                    const signedSessionJWT = jsonwebtoken_1.default.verify(token, process.env.JWT_KEY);
                    console.log('Session JSON: ', signedSessionJWT);
                    // @ts-ignore
                    const signedSessionJWTObject = JSON.parse(signedSessionJWT.session);
                    console.log('VaLUE OF OBJ: ', signedSessionJWTObject);
                    if (signedSessionJWTObject !== null) {
                        console.log('SIGNED SESSION OBJECT: ', signedSessionJWTObject);
                        if (keys) { // NOTE: If no key is provided, return all session (will most likely be used in the back)
                            // @ts-ignore
                            const sessionValues = JSON.parse(signedSessionJWTObject.session);
                            for (const sessionKey of keys) {
                                sessionData[sessionKey] = sessionValues[sessionKey];
                            }
                            return sessionData; // NOTE: I will have to ignore the jwt keys from the payload 
                        }
                        else {
                            console.log('sess data no keys ', signedSessionJWTObject);
                            return signedSessionJWTObject;
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
        // this.token = token; //stringified version of data to be hashed (no need if we always use the current user)
    }
}
exports.default = FTSessionService;
