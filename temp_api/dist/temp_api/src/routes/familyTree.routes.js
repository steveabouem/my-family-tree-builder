"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const helpers_1 = require("./helpers");
const familyTree_1 = require("../services/familyTree");
const router = (0, express_1.Router)();
router.get('/index', (req, res) => {
    (0, helpers_1.sendRouteHandlerResponse)(req.query.member, familyTree_1.getAllTrees, res, 'Get all trees');
});
router.get('/details', (req, res) => {
    (0, helpers_1.sendRouteHandlerResponse)(req.query.id, familyTree_1.getTreeById, res, 'Get tree details');
});
router.post('/create', (req, res) => {
    (0, helpers_1.sendRouteHandlerResponse)(req.body, familyTree_1.createTree, res, 'Create family tree');
});
router.post('/delete', (req, res) => {
    const treeId = parseInt(req.params.id);
    (0, helpers_1.sendRouteHandlerResponse)(treeId, familyTree_1.deleteTree, res, 'Delete tree');
});
router.get('/members', (req, res) => {
    const treeId = parseInt(req.params.id);
    (0, helpers_1.sendRouteHandlerResponse)(treeId, familyTree_1.deleteTree, res, 'Delete tree');
});
router.put('/members', (req, res) => {
    (0, helpers_1.sendRouteHandlerResponse)(req.body, familyTree_1.updateTree, res, 'Create family tree');
});
exports.default = router;
