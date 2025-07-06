"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = __importDefault(require("../middleware-classes/auth/auth.middleware"));
const logger_1 = __importDefault(require("../utils/logger"));
const RequestHelper_1 = __importDefault(require("./RequestHelper"));
const AuthController_1 = __importDefault(require("../controllers/auth/AuthController"));
const router = (0, express_1.Router)();
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
        logger_1.default.error('Unable to use auth middleware ', e);
        res.status(400);
        res.json({ ipIsValid: false, message: e });
    });
    next();
});
router.post('/register', (req, res, next) => {
    const authController = new AuthController_1.default();
    const helper = new RequestHelper_1.default(req, res);
    helper.sendResponseFromControllerMethod(authController.register, 'Register');
});
router.post('/login', (req, res) => {
    const authController = new AuthController_1.default();
    const helper = new RequestHelper_1.default(req, res);
    // helper.sendResponseFromControllerMethod(authController.login, 'Login');
});
router.post('/logout', (req, res) => {
    const authController = new AuthController_1.default();
    const helper = new RequestHelper_1.default(req, res);
    // helper.sendResponseFromControllerMethod(authController.logout, 'Logout');
});
router.post('/password/change', (req, res) => {
    const authController = new AuthController_1.default();
    const helper = new RequestHelper_1.default(req, res);
    // helper.sendResponseFromControllerMethod(authController.changePassword, 'Update Pwd');
});
exports.default = router;
