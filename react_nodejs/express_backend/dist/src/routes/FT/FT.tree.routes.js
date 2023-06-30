"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const FT_auth_service_1 = __importDefault(require("../../services/FT/auth/FT.auth.service"));
const FT_tree_service_1 = require("../../services/FT/tree/FT.tree.service");
const router = (0, express_1.Router)();
router.use((p_req, p_res, p_next) => {
    const ip = p_req.headers['x-forwarded-for'] || p_req.socket.remoteAddress;
    const authService = new FT_auth_service_1.default();
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
        p_res.status(400);
        p_res.json('Error: ' + e);
    });
    p_next();
});
router.post('/create', (p_req, p_res) => {
    const ftTreeService = new FT_tree_service_1.FTTreeService;
    // TODO: there's definitely to add the create function to the base service instead
    ftTreeService.create(p_req.body)
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
        console.log('ERROR: ', e);
        // TODO: LOGGING AND SEND BACK TO FRONT IF NECESSARY
        p_res.status(500);
        p_res.json(e);
    });
});
router.get('/:id', (p_req, p_res) => {
    const ftTreeService = new FT_tree_service_1.FTTreeService;
    ftTreeService.getTree(parseInt(p_req.params.id))
        .then((r) => {
        p_res.status(200);
        p_res.json(r);
    })
        .catch(e => {
        p_res.status(500);
        p_res.json(e);
    });
});
router.get('/:id/families', (p_req, p_res) => {
    const ftTreeService = new FT_tree_service_1.FTTreeService;
    // TODO: there's definitely to add the create function to the base service instead
    ftTreeService.getFamilies(parseInt(p_req.params.id))
        .then((families) => {
        if (families) {
            p_res.status(201);
            p_res.json(families);
        }
        else {
            p_res.status(400);
            p_res.json(null);
        }
    })
        .catch(e => {
        // TODO: LOGGING AND SEND BACK TO FRONT IF NECESSARY
        console.log('ERROR: ', e);
        p_res.status(500);
        p_res.json(e);
    });
});
router.put('/:id', (p_req, p_res) => {
    const ftTreeService = new FT_tree_service_1.FTTreeService;
    const values = Object.assign({}, p_req.body);
    // TODO: there's definitely to add the create function to the base service instead
    ftTreeService.update(values, parseInt(p_req.params.id))
        .then((success) => {
        if (success) {
            p_res.status(201);
            p_res.json(success);
        }
        else {
            p_res.status(400);
            p_res.json(null);
        }
    })
        .catch(e => {
        // TODO: LOGGING AND SEND BACK TO FRONT IF NECESSARY
        console.log('ERROR: ', e);
        p_res.status(500);
        p_res.json(e);
    });
});
router.put('/:id/families', (p_req, p_res) => {
    const ftTreeService = new FT_tree_service_1.FTTreeService;
    // TODO: there's definitely to add the create function to the base service instead
    ftTreeService.addFamily(parseInt(p_req.params.id), p_req.body.id)
        .then((success) => {
        if (success) {
            p_res.status(201);
            p_res.json(success);
        }
        else {
            p_res.status(400);
            p_res.json(null);
        }
    })
        .catch(e => {
        // TODO: LOGGING AND SEND BACK TO FRONT IF NECESSARY
        console.log('ERROR: ', e);
        p_res.status(500);
        p_res.json(e);
    });
});
router.put('/:id/families/remove', (p_req, p_res) => {
    const ftTreeService = new FT_tree_service_1.FTTreeService;
    // TODO: there's definitely to add the create function to the base service instead
    ftTreeService.removeFamily(parseInt(p_req.params.id), p_req.body.id)
        .then((success) => {
        if (success) {
            p_res.status(201);
            p_res.json(success);
        }
        else {
            p_res.status(400);
            p_res.json(null);
        }
    })
        .catch(e => {
        // TODO: LOGGING AND SEND BACK TO FRONT IF NECESSARY
        console.log('ERROR: ', e);
        p_res.status(500);
        p_res.json(e);
    });
});
exports.default = router;
