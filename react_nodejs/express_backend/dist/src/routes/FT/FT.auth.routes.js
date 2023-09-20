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
router.use((req, res, next) => {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const authService = new FT_auth_service_1.default();
    authService.verifyIp(ip)
        .then((valid) => {
        if (!valid) {
            res.status(400);
            res.json({ ipIsValid: false });
        }
    })
        .catch(e => {
        // TODO: catch return false doesnt actually catch falty logic, 
        // just wrong syntax and maybe wrong typing. FIX
        res.status(400);
        res.json({ ipIsValid: false, message: e });
    });
    next();
});
// TODO: typing of req body for 
router.post('/register', (req, res) => {
    processRegister(req)
        .then((sessionData) => {
        res.set('Set-Cookie', `${sessionData === null || sessionData === void 0 ? void 0 : sessionData.token}`);
        res.set('httpOnly', 'true');
        res.status(200);
        res.json({ session: sessionData });
    })
        .catch(e => {
        // TODO: error handling and logging
        console.log('Register Error: ', e);
    });
});
// TODO: req, res typing
router.post('/login', (req, res) => {
    processLogin(req)
        .then((sessionData) => {
        res.set('Set-Cookie', `${sessionData === null || sessionData === void 0 ? void 0 : sessionData.token}`);
        res.set('httpOnly', 'true');
        res.status(200);
        res.json({ session: sessionData });
    });
});
router.get('/logout', (req, res) => {
    // TODO: Kill session, send back the guest session default
});
exports.default = router;
// HELPERS
const processRegister = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const ftUserService = new FT_user_service_1.FTUserService();
    const ftSessionService = new FT_session_service_1.default();
    const formattedValues = Object.assign(Object.assign({}, req.body), { assigned_ips: [ip], created_at: new Date });
    // TODO: use ftuser service to match spouse's first and last name and return id here.
    // in the front, it will be some sort of dd that will use the ServiceWorker, and add the id to the form values
    // This will go in the profile Selection, no need to crowd registration w it
    const duplicate = yield ftUserService.getByEmail(req.body.email);
    if (duplicate) {
        // TODO: throw error + logging
        return null;
    }
    const newUser = yield ftUserService.create(formattedValues).catch(e => console.log('Error creating U: ', e)); // TODO: catch error logging
    if (newUser) {
        console.log('NEW USER AFTER REG: ', newUser);
        const sessionToken = yield ftSessionService.setSession(newUser);
        return Object.assign(Object.assign({}, formattedValues), { password: '', type: 'user', token: sessionToken });
    }
    return null;
});
const processLogin = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const ftAuthService = new FT_auth_service_1.default();
    const verifiedUser = yield ftAuthService.verifyUser(req.body)
        .catch(e => {
        console.log('Error checking user'); //TODO: notify, and proper logging
    });
    if (verifiedUser) {
        console.log('User was verified succesfuly');
        const ftSessionService = new FT_session_service_1.default();
        const sessionToken = yield ftSessionService.setSession(verifiedUser);
        console.log('GOT TOKEN ', sessionToken);
        const currentSession = yield ftSessionService.getSessionData(sessionToken || '', ['id', 'email', 'first_name', 'last_name', 'gender']);
        return Object.assign(Object.assign({}, currentSession), { type: 'user', token: sessionToken });
    }
    else {
        return null;
    }
});
