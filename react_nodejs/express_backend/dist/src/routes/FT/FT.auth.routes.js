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
        else {
            p_res.json({ session: { TEST: true, ip } });
        }
    })
        .catch(e => {
        // TODO: catch return false doesnt actually catch falty logic, 
        // just wrong syntax and maybe wrong typing. FIX
        p_res.status(400);
        p_res.json({ session: null, message: 'Error: ' + e });
    });
    p_next();
});
// TODO: typing of req body for p_
router.post('/register', (p_req, p_res) => {
    const ip = p_req.headers['x-forwarded-for'] || p_req.socket.remoteAddress;
    const ftUserService = new FT_user_service_1.FTUserService();
    const formattedValues = Object.assign(Object.assign({}, p_req.body), { assigned_ips: [ip], created_at: new Date });
    processRegister(p_req)
        .then((session) => {
        p_res.status(200);
        p_res.json({ session });
    });
    ftUserService.create(formattedValues)
        .then((p_user) => {
        p_res.status(201);
        p_res.json(p_user);
    }).catch(e => {
        // TODO: catch return false doesnt actually catch falty logic, 
        // just wrong syntax and maybe wrong typing. FIX
        p_res.status(400);
        p_res.json('Error: ' + e);
    }); // TODO: handle redirect in client
});
// TODO: req, res typing
router.post('/login', (p_req, p_res) => {
    const authService = new FT_auth_service_1.default();
    console.log('SESSION STUFF', decodeURIComponent(p_req.cookies.FT.session));
    authService.verifyUser(p_req.body)
        .then((p_user) => {
        if (p_user) {
            p_res.status(200);
        }
        else {
            p_res.status(400);
        }
        p_res.json({ user: p_user, type: 'user' });
    });
});
router.get('/logout', (p_req, p_res) => {
    // TODO: do I need to reinitialize anything here?
});
exports.default = router;
// HELPERS
const processRegister = (p_req) => __awaiter(void 0, void 0, void 0, function* () {
    const ip = p_req.headers['x-forwarded-for'] || p_req.socket.remoteAddress;
    const ftUserService = new FT_user_service_1.FTUserService();
    const ftSessionService = new FT_session_service_1.default(p_req.cookies.FT);
    const formattedValues = Object.assign(Object.assign({}, p_req.body), { assigned_ips: [ip], created_at: new Date });
    // TODO: use ftuser service to match spouse's first and last name and return id here.
    // in the front, it will be some sort of dd that will use the ServiceWorker, and add the id to the form values
    const newUSer = yield ftUserService.create(formattedValues); // TODO: catch error
    if (newUSer) {
        const sessionToken = yield ftSessionService.setSessionToken(newUSer);
        const currentSession = yield ftSessionService.getSessionObject(['id', 'email', 'first_name', 'last_name', 'gender']);
        return Object.assign(Object.assign({}, currentSession), { type: 'user', token: sessionToken || '' });
    }
    else {
        return null;
    }
});
const processLogin = (p_req) => __awaiter(void 0, void 0, void 0, function* () {
    const ip = p_req.headers['x-forwarded-for'] || p_req.socket.remoteAddress;
    const ftUserService = new FT_user_service_1.FTUserService();
    const ftSessionService = new FT_session_service_1.default(p_req.cookies.FT);
    const currentUser = yield ftUserService.getById(p_req.cookies.FT.session.id);
    if (currentUser) {
        const sessionToken = yield ftSessionService.setSessionToken(currentUser);
        const currentSession = yield ftSessionService.getSessionObject(['id', 'email', 'first_name', 'last_name', 'gender']);
        return Object.assign(Object.assign({}, currentSession), { type: 'user', token: sessionToken || '' });
    }
    else {
        return null;
    }
});
