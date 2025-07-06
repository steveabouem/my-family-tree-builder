"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const winston_1 = __importDefault(require("winston"));
const auth_middleware_1 = __importDefault(require("../middleware-classes/auth/auth.middleware"));
const user_middleware_1 = require("../middleware-classes/user/user.middleware");
const UserController_1 = __importDefault(require("../controllers/user/UserController"));
const router = (0, express_1.Router)();
router.use((req, res, next) => {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const authMiddleware = new auth_middleware_1.default();
    // const sessionMiddleware = new FTSessionMiddleware();
    authMiddleware.verifyIp(ip)
        .then((valid) => {
        if (!valid) {
            res.status(400);
            res.json('IP is not approved');
        }
    })
        .catch((e) => {
        // ! -TOFIX: catch return false doesnt actually catch falty logic, 
        // just wrong syntax and maybe wrong typing. FIX
        res.status(500);
        res.json('Error: ' + e);
    });
    next();
});
router.get('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    // Not sure what to do with this yet
    const userMiddleware = new user_middleware_1.UserMiddleware;
    userMiddleware.getUserData(id)
        .then((user) => {
        console.log('DONE');
        res.json(user);
    })
        .catch((e) => {
        winston_1.default.log('error', e); //TODO: logging and error handling
        console.log('ERRORRRR: ', e);
        res.status(500);
        res.json('failed');
    });
});
router.get('/:id/families', (req, res) => {
    const userMiddleware = new user_middleware_1.UserMiddleware;
    userMiddleware.getRelatedFamilies(parseInt(req.params.id))
        .then((fams) => {
        console.log('DONE');
        res.json({ "relatedFamilies": fams });
    })
        .catch((e) => {
        winston_1.default.log('error', e); //TODO: logging and error handling
        console.log('ERRORRRR: ', e);
        res.status(500);
        res.json('failed');
    });
});
router.get('/:id/extended-families', (req, res) => {
    const userMiddleware = new user_middleware_1.UserMiddleware;
    userMiddleware.getExtendedFamiliesDetails(parseInt(req.params.id))
        .then((fams) => {
        console.log('DONE');
        res.json({ "relatedFamilies": fams });
    })
        .catch((e) => {
        winston_1.default.log('error', e); //TODO: logging and error handling
        console.log('ERRORRRR: ', e);
        res.status(500);
        res.json('failed');
    });
});
router.post('/create', (req, res) => {
    const userController = new UserController_1.default();
    const ip = '';
    const newUserFieldValues = Object.assign(Object.assign({}, req.body), { authorizedIps: [ip], roles: '[1]' });
    res.send('ok');
});
exports.default = router;
