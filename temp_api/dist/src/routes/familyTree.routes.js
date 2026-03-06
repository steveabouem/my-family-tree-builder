"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const helpers_1 = require("./helpers");
const familyTree_1 = require("../services/familyTree");
const middlewares_1 = require("./middlewares");
const router = (0, express_1.Router)();
router.get('/index', middlewares_1.authCheck, (req, res) => {
    (0, helpers_1.sendRouteHandlerResponse)(req.query.user, familyTree_1.getAllTrees, res, 'Get all trees');
});
router.get('/details', middlewares_1.authCheck, (req, res) => {
    (0, helpers_1.sendRouteHandlerResponse)(req.query.id, familyTree_1.getTreeById, res, 'Get tree details');
});
router.post('/create', middlewares_1.authCheck, (req, res) => {
    (0, helpers_1.sendRouteHandlerResponse)(req.body, familyTree_1.createTree, res, 'Create family tree');
});
router.post('/delete', middlewares_1.authCheck, (req, res) => {
    (0, helpers_1.sendRouteHandlerResponse)(req.body, familyTree_1.deleteTree, res, 'Delete tree');
});
// router.get('/members', authCheck, (req: Request<{ }, {}, {}, {id: string}>, res: Response) => {
//   const treeId = parseInt(req.query.id);
//   sendRouteHandlerResponse<number, FamilyMemberData[] | null>(treeId, getAllRelativesData, res, 'Get members');
// });
router.put('/members', middlewares_1.authCheck, (req, res) => {
    (0, helpers_1.sendRouteHandlerResponse)(req.body, familyTree_1.updateTree, res, 'Update family tree');
});
router.post('/members/remove', middlewares_1.authCheck, (req, res) => {
    (0, helpers_1.sendRouteHandlerResponse)(req.body, familyTree_1.deleteTreeMember, res, 'Update family tree');
});
router.post('/members/positions', middlewares_1.authCheck, (req, res) => {
    (0, helpers_1.sendRouteHandlerResponse)(req.body, familyTree_1.updateMemberPositions, res, 'Update family tree');
});
exports.default = router;
