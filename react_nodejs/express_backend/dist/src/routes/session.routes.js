"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = __importDefault(require("../middleware-classes/auth/auth.middleware"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const winston_1 = __importDefault(require("winston"));
const SessionController_1 = __importDefault(require("../controllers/session/SessionController"));
const RequestHelper_1 = __importDefault(require("./RequestHelper"));
const router = (0, express_1.Router)();
router.use((0, cookie_parser_1.default)());
router.use((req, res, next) => {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const authMiddleware = new auth_middleware_1.default();
    authMiddleware.verifyIp(ip)
        .then((valid) => {
        if (!valid) {
            res.status(400);
            res.json({ ipIsValid: false });
        }
    })
        .catch((e) => {
        winston_1.default.log('error', e);
        // ! -TOFIX: catch return false doesnt actually catch falty logic, 
        // just wrong syntax and maybe wrong typing. FIX
        res.status(400);
        res.json({ ipIsValid: false, message: e });
        return;
    });
    next();
});
// ! -TOFIX: req, res typing
router.get('/', (req, res) => {
    const helper = new RequestHelper_1.default(req, res);
    const sessionController = new SessionController_1.default();
    // helper.sendResponseFromControllerMethod(sessionController.getCurrent, 'Get Current Session');
});
router.post('/set-data', (req, res) => {
    // ! -TOFIX: Kill session, send back the guest session default
    // const ftSessionMiddleware = new FTSessionMiddleware();
    // const sessionData = ftSessionMiddleware.createSession(req.body.data);
    // res.json(sessionData);
});
exports.default = router;
