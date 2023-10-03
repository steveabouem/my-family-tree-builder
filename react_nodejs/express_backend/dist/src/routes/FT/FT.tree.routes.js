"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const FT_auth_service_1 = __importDefault(require("../../services/FT/auth/FT.auth.service"));
const FT_tree_service_1 = require("../../services/FT/tree/FT.tree.service");
const router = (0, express_1.Router)();
router.use((req, res, next) => {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const authService = new FT_auth_service_1.default();
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
        res.status(400);
        res.json('Error: ' + e);
    });
    next();
});
router.post('/create', (req, res) => {
    const ftTreeService = new FT_tree_service_1.FTTreeService;
    // TODO: there's definitely to add the create function to the base service instead
    ftTreeService.create(req.body)
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
        console.log('ERROR: ', e);
        // TODO: LOGGING AND SEND BACK TO FRONT IF NECESSARY
        res.status(500);
        res.json(e);
    });
});
router.get('/:id', (req, res) => {
    const ftTreeService = new FT_tree_service_1.FTTreeService;
    ftTreeService.getTree(parseInt(req.params.id))
        .then((r) => {
        res.status(200);
        res.json(r);
    })
        .catch(e => {
        res.status(500);
        res.json(e);
    });
});
router.get('/:id/families', (req, res) => {
    const ftTreeService = new FT_tree_service_1.FTTreeService;
    // TODO: there's definitely to add the create function to the base service instead
    ftTreeService.getFamilies(parseInt(req.params.id))
        .then((families) => {
        if (families) {
            res.status(201);
            res.json(families);
        }
        else {
            res.status(400);
            res.json(null);
        }
    })
        .catch(e => {
        // TODO: LOGGING AND SEND BACK TO FRONT IF NECESSARY
        console.log('ERROR: ', e);
        res.status(500);
        res.json(e);
    });
});
router.put('/:id', (req, res) => {
    const ftTreeService = new FT_tree_service_1.FTTreeService;
    const values = Object.assign({}, req.body);
    // TODO: there's definitely to add the create function to the base service instead
    ftTreeService.update(values, parseInt(req.params.id))
        .then((success) => {
        if (success) {
            res.status(201);
            res.json(success);
        }
        else {
            res.status(400);
            res.json(null);
        }
    })
        .catch(e => {
        // TODO: LOGGING AND SEND BACK TO FRONT IF NECESSARY
        console.log('ERROR: ', e);
        res.status(500);
        res.json(e);
    });
});
router.put('/:id/families', (req, res) => {
    const ftTreeService = new FT_tree_service_1.FTTreeService;
    // TODO: there's definitely to add the create function to the base service instead
    ftTreeService.addFamily(parseInt(req.params.id), req.body.id)
        .then((success) => {
        if (success) {
            res.status(201);
            res.json(success);
        }
        else {
            res.status(400);
            res.json(null);
        }
    })
        .catch(e => {
        // TODO: LOGGING AND SEND BACK TO FRONT IF NECESSARY
        console.log('ERROR: ', e);
        res.status(500);
        res.json(e);
    });
});
router.put('/:id/families/remove', (req, res) => {
    const ftTreeService = new FT_tree_service_1.FTTreeService;
    // TODO: there's definitely to add the create function to the base service instead
    ftTreeService.removeFamily(parseInt(req.params.id), req.body.id)
        .then((success) => {
        if (success) {
            res.status(201);
            res.json(success);
        }
        else {
            res.status(400);
            res.json(null);
        }
    })
        .catch(e => {
        // TODO: LOGGING AND SEND BACK TO FRONT IF NECESSARY
        console.log('ERROR: ', e);
        res.status(500);
        res.json(e);
    });
});
exports.default = router;
