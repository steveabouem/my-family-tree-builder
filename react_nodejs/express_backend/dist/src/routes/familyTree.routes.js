"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = __importDefault(require("../middleware-classes/auth/auth.middleware"));
const FamilyTreeController_1 = __importDefault(require("../controllers/familyTree/FamilyTreeController"));
const logger_1 = __importDefault(require("../utils/logger"));
const RequestHelper_1 = __importDefault(require("./RequestHelper"));
const router = (0, express_1.Router)();
router.use((req, res, next) => {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const ftAuthMiddleware = new auth_middleware_1.default();
    ftAuthMiddleware.verifyIp(ip)
        .then((valid) => {
        if (!valid) {
            res.status(403);
            res.json('Forbidden. IP is not approved');
        }
    })
        .catch((e) => {
        logger_1.default.error('! Family Tree middleware !', e);
        res.status(403);
        res.json('Unable to validate IP.');
    });
    next();
});
router.get('/index', (req, res) => {
    const familyTreeController = new FamilyTreeController_1.default();
    const helper = new RequestHelper_1.default(req, res);
    helper.sendResponseFromControllerMethod(familyTreeController.getAll, 'Get trees index');
});
router.get('/details', (req, res) => {
    const familyTreeController = new FamilyTreeController_1.default();
    const helper = new RequestHelper_1.default(req, res);
    helper.sendResponseFromControllerMethod(familyTreeController.getOne, 'Get tree details');
});
router.post('/create', (req, res) => {
    const familyTreeController = new FamilyTreeController_1.default();
    const helper = new RequestHelper_1.default(req, res);
    helper.sendResponseFromControllerMethod(familyTreeController.create, 'Create family tree');
});
router.post('/delete', (req, res) => {
    const familyTreeController = new FamilyTreeController_1.default();
    const helper = new RequestHelper_1.default(req, res);
    helper.sendResponseFromControllerMethod(familyTreeController.delete, 'Delete tree');
});
router.get('/members', (req, res) => {
    const familyTreeController = new FamilyTreeController_1.default();
    const helper = new RequestHelper_1.default(req, res);
    helper.sendResponseFromControllerMethod(familyTreeController.getMembers, 'Get tree members');
});
router.put('/members', (req, res) => {
    const familyTreeController = new FamilyTreeController_1.default();
    const helper = new RequestHelper_1.default(req, res);
    helper.sendResponseFromControllerMethod(familyTreeController.update, 'Update tree records');
});
exports.default = router;
