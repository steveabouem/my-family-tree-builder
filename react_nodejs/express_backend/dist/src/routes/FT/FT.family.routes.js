"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const FT_auth_service_1 = __importDefault(require("../../services/FT/auth/FT.auth.service"));
const FT_family_service_1 = require("../../services/FT/family/FT.family.service");
const router = (0, express_1.Router)();
router.use((p_req, p_res, p_next) => {
    const ip = p_req.headers['x-forwarded-for'] || p_req.socket.remoteAddress;
    const ftAuthService = new FT_auth_service_1.default();
    ftAuthService.verifyIp(ip)
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
// TODO: override Request type with something more precise 
// Ideally make a base route handlers class that will accept generics in request 
// and return appropriate types...maybe generics as well ?
router.get('/index', (p_req, p_res) => {
    const ftFamService = new FT_family_service_1.FTFamilyService();
    const idList = `${p_req.query.ids}`;
    ftFamService.getBulkData(idList)
        .then((data) => {
        p_res.status(200);
        p_res.json(data);
    })
        .catch(e => {
        console.log('Error getting tree', e); // TODO: LOGGING AND SEND BACK TO FRONT IF NECESSARY
        p_res.status(500);
        p_res.json(undefined);
    });
});
router.post('/create', (p_req, p_res) => {
    const ftFamService = new FT_family_service_1.FTFamilyService;
    ftFamService.create(p_req.body)
        .then((success) => {
        if (success) {
            p_res.status(201);
            p_res.json(true);
        }
        else {
            p_res.status(400);
            p_res.json(false);
        }
    })
        .catch(e => {
        // TODO: LOGGING AND SEND BACK TO FRONT IF NECESSARY
        p_res.status(500);
        p_res.json(e);
    });
});
router.get('/:id', (p_req, p_res) => {
    const ftFamService = new FT_family_service_1.FTFamilyService;
    ftFamService.getFamily(parseInt(p_req.params.id))
        .then((r) => {
        p_res.status(200);
        p_res.json(r);
    })
        .catch(e => {
        p_res.status(500);
        p_res.json(e);
    });
});
router.put('/:id', (p_req, p_res) => {
    const ftFamService = new FT_family_service_1.FTFamilyService;
    console.log('RUNNING');
    ftFamService.update(p_req.body, parseInt(p_req.params.id))
        .then((success) => {
        if (success) {
            p_res.status(201);
            p_res.json(true);
        }
        else {
            p_res.status(400);
            p_res.json(false);
        }
    })
        .catch(e => {
        console.log(e); //TODO: LOGGING
        p_res.status(500);
        p_res.json(e);
    });
});
router.post('/:id/tree', (p_req, p_res) => {
    const ftFamService = new FT_family_service_1.FTFamilyService;
    ftFamService.linkToTree(parseInt(p_req.params.id), p_req.body.id)
        .then((success) => {
        if (success) {
            p_res.status(201);
            p_res.json(true);
        }
        else {
            p_res.status(400);
            p_res.json(false);
        }
    })
        .catch(e => {
        console.log('Error linking tree', e); // TODO: LOGGING AND SEND BACK TO FRONT IF NECESSARY
        p_res.status(500);
        p_res.json(false);
    });
});
router.get('/:id/tree', (p_req, p_res) => {
    const ftFamService = new FT_family_service_1.FTFamilyService;
    ftFamService.getTree(parseInt(p_req.params.id))
        .then((tree) => {
        if (tree) {
            p_res.status(200);
            p_res.json(tree);
        }
        else {
            p_res.status(400);
            p_res.json(null);
        }
    })
        .catch(e => {
        console.log('Error getting tree', e); // TODO: LOGGING AND SEND BACK TO FRONT IF NECESSARY
        p_res.status(500);
        p_res.json(undefined);
    });
});
exports.default = router;
