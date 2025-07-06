"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const winston_1 = __importDefault(require("winston"));
const auth_middleware_1 = __importDefault(require("../middleware-classes/auth/auth.middleware"));
const FamilyMemberController_1 = __importDefault(require("../controllers/familyMember/FamilyMemberController"));
const router = (0, express_1.Router)();
router.use((req, res, next) => {
    var _a, _b, _c;
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const ftAuthMiddleware = new auth_middleware_1.default();
    const maxAge = ((_c = (_b = (_a = req === null || req === void 0 ? void 0 : req.session) === null || _a === void 0 ? void 0 : _a.cookie) === null || _b === void 0 ? void 0 : _b.expires) === null || _c === void 0 ? void 0 : _c.getTime()) || 0;
    const now = new Date().getTime();
    const canProceed = maxAge > now;
    if (canProceed) {
        ftAuthMiddleware.verifyIp(ip)
            .then((valid) => {
            if (!valid) {
                res.status(400);
                res.json('IP is not approved');
            }
        })
            .catch((e) => {
            winston_1.default.log('error', e);
            // ! -TOFIX: catch return false doesnt actually catch falty logic, 
            // just wrong syntax and maybe wrong typing. FIX
            res.status(500);
            res.json('Error: ' + e);
        });
    }
    else {
        res.status(403);
        res.json('Session expired');
    }
    next();
});
// ! -TOFIX: override Request type with something more precise 
// Ideally make a base route handlers class that will accept generics in request 
// and return appropriate types...maybe generics as well ?
router.get('/index', (req, res) => {
    const familyMember = new FamilyMemberController_1.default();
    return true;
});
router.post('/create', (req, res) => {
    const familyMember = new FamilyMemberController_1.default();
    return true;
});
exports.default = router;
