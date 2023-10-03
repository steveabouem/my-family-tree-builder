"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const FT_auth_service_1 = __importDefault(require("../../services/FT/auth/FT.auth.service"));
const FT_user_service_1 = require("../../services/FT/user/FT.user.service");
const router = (0, express_1.Router)();
router.use((req, res, next) => {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const authService = new FT_auth_service_1.default();
    // const sessionService = new FTSessionService();
    authService.verifyIp(ip)
        .then((valid) => {
        if (!valid) {
            res.status(400);
            res.json('IP is not approved');
        }
    })
        .catch(e => {
        // TODO: catch return false doesnt actually catch falty logic, 
        // just wrong syntax and maybe wrong typing. FIX
        res.status(500);
        res.json('Error: ' + e);
    });
    next();
});
router.get('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    // Not sure what to do with this yet
    const ftUserService = new FT_user_service_1.FTUserService;
    ftUserService.getUserData(id)
        .then((user) => {
        console.log('DONE');
        res.json(user);
    })
        .catch(e => {
        console.log('ERRORRRR: ', e);
        res.status(500);
        res.json('failed');
    });
});
router.get('/:id/families', (req, res) => {
    const ftUserService = new FT_user_service_1.FTUserService;
    ftUserService.getRelatedFamilies(parseInt(req.params.id))
        .then((fams) => {
        console.log('DONE');
        res.json({ "relatedFamilies": fams });
    })
        .catch(e => {
        console.log('ERRORRRR: ', e);
        res.status(500);
        res.json('failed');
    });
});
router.get('/:id/extended-families', (req, res) => {
    const ftUserService = new FT_user_service_1.FTUserService;
    ftUserService.getExtendedFamiliesDetails(parseInt(req.params.id))
        .then((fams) => {
        console.log('DONE');
        res.json({ "relatedFamilies": fams });
    })
        .catch(e => {
        console.log('ERRORRRR: ', e);
        res.status(500);
        res.json('failed');
    });
});
exports.default = router;
