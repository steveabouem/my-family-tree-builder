"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const FT_auth_service_1 = __importDefault(require("../../services/FT/auth/FT.auth.service"));
const FT_family_service_1 = require("../../services/FT/family/FT.family.service");
const router = (0, express_1.Router)();
router.use((req, res, next) => {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const ftAuthService = new FT_auth_service_1.default();
    ftAuthService.verifyIp(ip)
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
// TODO: override Request type with something more precise 
// Ideally make a base route handlers class that will accept generics in request 
// and return appropriate types...maybe generics as well ?
router.get('/index', (req, res) => {
    const ftFamService = new FT_family_service_1.FTFamilyService();
    const idList = `${req.query.ids}`;
    ftFamService.getBulkData(idList)
        .then((data) => {
        res.status(200);
        res.json(data);
    })
        .catch(e => {
        console.log('Error getting tree', e); // TODO: LOGGING AND SEND BACK TO FRONT IF NECESSARY
        res.status(500);
        res.json(undefined);
    });
});
router.post('/create', (req, res) => {
    const ftFamService = new FT_family_service_1.FTFamilyService;
    ftFamService.create(req.body)
        .then((success) => {
        if (success) {
            res.status(201);
            res.json(true);
        }
        else {
            res.status(400);
            res.json(false);
        }
    })
        .catch(e => {
        // TODO: LOGGING AND SEND BACK TO FRONT IF NECESSARY
        res.status(500);
        res.json(e);
    });
});
router.get('/:id', (req, res) => {
    const ftFamService = new FT_family_service_1.FTFamilyService;
    ftFamService.getFamily(parseInt(req.params.id))
        .then((r) => {
        res.status(200);
        res.json(r);
    })
        .catch(e => {
        res.status(500);
        res.json(e);
    });
});
router.put('/:id', (req, res) => {
    const ftFamService = new FT_family_service_1.FTFamilyService;
    console.log('RUNNING');
    ftFamService.update(req.body, parseInt(req.params.id))
        .then((success) => {
        if (success) {
            res.status(201);
            res.json(true);
        }
        else {
            res.status(400);
            res.json(false);
        }
    })
        .catch(e => {
        console.log(e); //TODO: LOGGING
        res.status(500);
        res.json(e);
    });
});
router.post('/:id/tree', (req, res) => {
    const ftFamService = new FT_family_service_1.FTFamilyService;
    ftFamService.linkToTree(parseInt(req.params.id), req.body.id)
        .then((success) => {
        if (success) {
            res.status(201);
            res.json(true);
        }
        else {
            res.status(400);
            res.json(false);
        }
    })
        .catch(e => {
        console.log('Error linking tree', e); // TODO: LOGGING AND SEND BACK TO FRONT IF NECESSARY
        res.status(500);
        res.json(false);
    });
});
router.get('/:id/tree', (req, res) => {
    const ftFamService = new FT_family_service_1.FTFamilyService;
    ftFamService.getTree(parseInt(req.params.id))
        .then((tree) => {
        if (tree) {
            res.status(200);
            res.json(tree);
        }
        else {
            res.status(400);
            res.json(null);
        }
    })
        .catch(e => {
        console.log('Error getting tree', e); // TODO: LOGGING AND SEND BACK TO FRONT IF NECESSARY
        res.status(500);
        res.json(undefined);
    });
});
exports.default = router;
