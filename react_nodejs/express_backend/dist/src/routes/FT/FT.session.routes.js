"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const FT_session_service_1 = __importDefault(require("../../services/FT/session/FT.session.service"));
const FT_auth_service_1 = __importDefault(require("../../services/FT/auth/FT.auth.service"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const router = (0, express_1.Router)();
router.use((0, cookie_parser_1.default)());
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
// TODO: req, res typing
router.post('/get-data', (req, res) => {
    const ftSessionService = new FT_session_service_1.default();
    const sessionData = ftSessionService.getSessionData(req.body.data);
    res.json(sessionData);
});
router.post('/set-data', (req, res) => {
    // TODO: Kill session, send back the guest session default
    const ftSessionService = new FT_session_service_1.default();
    const sessionData = ftSessionService.setSession(req.body.data);
    res.json(sessionData);
});
exports.default = router;
