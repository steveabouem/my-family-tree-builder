"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const FT_session_service_1 = __importDefault(require("../../services/FT/session/FT.session.service"));
const FT_auth_service_1 = __importDefault(require("../../services/FT/auth/FT.auth.service"));
const FT_user_service_1 = require("../../services/FT/user/FT.user.service");
const router = (0, express_1.Router)();
router.use((p_req, p_res, p_next) => {
    const ip = p_req.headers['x-forwarded-for'] || p_req.socket.remoteAddress;
    const authService = new FT_auth_service_1.default();
    const sessionService = new FT_session_service_1.default(p_req.cookies.FT);
    authService.verifyIp(ip)
        .then((valid) => {
        if (!valid) {
            p_res.status(400);
            p_res.json('IP is not approved');
        }
    })
        .catch(e => {
        // TODO: catch return false doesnt actually catch falty logic, 
        // just wrong syntax and maybe wrong typing. FIX
        p_res.status(500);
        p_res.json('Error: ' + e);
    });
    p_next();
});
router.get('/:id', (p_req, p_res) => {
    const id = parseInt(p_req.params.id);
    // Not sure what to do with this yet
    const ftUserService = new FT_user_service_1.FTUserService;
    ftUserService.getUserData(id)
        .then((user) => {
        console.log('DONE');
        p_res.json(user);
    })
        .catch(e => {
        console.log('ERRORRRR: ', e);
        p_res.status(500);
        p_res.json('failed');
    });
});
router.get('/:id/families', (p_req, p_res) => {
    const ftUserService = new FT_user_service_1.FTUserService;
    ftUserService.getRelatedFamilies(parseInt(p_req.params.id))
        .then((fams) => {
        console.log('DONE');
        p_res.json({ "relatedFamilies": fams });
    })
        .catch(e => {
        console.log('ERRORRRR: ', e);
        p_res.status(500);
        p_res.json('failed');
    });
});
router.get('/:id/extended-families', (p_req, p_res) => {
    const ftUserService = new FT_user_service_1.FTUserService;
    ftUserService.getExtendedFamiliesDetails(parseInt(p_req.params.id))
        .then((fams) => {
        console.log('DONE');
        p_res.json({ "relatedFamilies": fams });
    })
        .catch(e => {
        console.log('ERRORRRR: ', e);
        p_res.status(500);
        p_res.json('failed');
    });
});
exports.default = router;
