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
const express_1 = require("express");
const FT_auth_service_1 = __importDefault(require("../../services/FT/auth/FT.auth.service"));
const FT_user_service_1 = require("../../services/FT/user/FT.user.service");
const FT_session_service_1 = __importDefault(require("../../services/FT/session/FT.session.service"));
const router = (0, express_1.Router)();
router.use((p_req, p_res, p_next) => {
    const ip = p_req.headers['x-forwarded-for'] || p_req.socket.remoteAddress;
    const authService = new FT_auth_service_1.default();
    authService.verifyIp(ip)
        .then((valid) => {
        if (!valid) {
            p_res.status(400);
            p_res.json({ ipIsValid: false });
        }
    })
        .catch(e => {
        // TODO: catch return false doesnt actually catch falty logic, 
        // just wrong syntax and maybe wrong typing. FIX
        p_res.status(400);
        p_res.json({ ipIsValid: false, message: e });
    });
    p_next();
});
// TODO: typing of req body for p_
router.post('/register', (p_req, p_res) => {
    processRegister(p_req)
        .then((sessionData) => {
        p_res.set('Set-Cookie', `session=${sessionData === null || sessionData === void 0 ? void 0 : sessionData.token}`);
        p_res.set('httpOnly', 'true');
        p_res.status(200);
        p_res.json({ session: sessionData });
    });
});
// TODO: req, res typing
router.post('/login', (p_req, p_res) => {
    processLogin(p_req)
        .then((sessionData) => {
        p_res.set('Set-Cookie', `session=${sessionData === null || sessionData === void 0 ? void 0 : sessionData.token}`);
        p_res.set('httpOnly', 'true');
        p_res.status(200);
        p_res.json({ session: sessionData });
    });
});
router.get('/logout', (p_req, p_res) => {
    // TODO: Kill session, send back the guest session default
});
exports.default = router;
// HELPERS
const processRegister = (p_req) => __awaiter(void 0, void 0, void 0, function* () {
    const ip = p_req.headers['x-forwarded-for'] || p_req.socket.remoteAddress;
    const ftUserService = new FT_user_service_1.FTUserService();
    const ftSessionService = new FT_session_service_1.default(p_req.body.sessionToken);
    const formattedValues = Object.assign(Object.assign({}, p_req.body), { assigned_ips: [ip], created_at: new Date });
    // TODO: use ftuser service to match spouse's first and last name and return id here.
    // in the front, it will be some sort of dd that will use the ServiceWorker, and add the id to the form values
    const newUser = yield ftUserService.create(formattedValues); // TODO: catch error
    if (newUser) {
        const sessionToken = yield ftSessionService.setSessionToken(newUser);
        const currentSession = yield ftSessionService.getSessionObject(['id', 'email', 'first_name', 'last_name', 'gender']);
        return Object.assign(Object.assign({}, currentSession), { type: 'user', token: sessionToken });
    }
    return null;
});
const processLogin = (p_req) => __awaiter(void 0, void 0, void 0, function* () {
    const ftAuthService = new FT_auth_service_1.default();
    const verifiedUser = yield ftAuthService.verifyUser(p_req.body)
        .catch(e => {
        console.log('Error checking user'); //TODO: notify, and proper logging
    });
    if (verifiedUser) {
        const ftSessionService = new FT_session_service_1.default(p_req.body.sessionToken);
        const sessionToken = yield ftSessionService.setSessionToken(verifiedUser);
        const currentSession = yield ftSessionService.getSessionObject(['id', 'email', 'first_name', 'last_name', 'gender']);
        return Object.assign(Object.assign({}, currentSession), { type: 'user', token: sessionToken });
    }
    else {
        return null;
    }
});
