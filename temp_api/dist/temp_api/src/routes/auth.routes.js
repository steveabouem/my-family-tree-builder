"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../services/auth");
const user_1 = require("../services/user");
const helpers_1 = require("./helpers");
const router = (0, express_1.Router)();
router.post('/register', (req, res) => {
    (0, helpers_1.sendRouteHandlerResponse)(req.body, auth_1.register, res, 'Register');
});
router.get('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    (0, helpers_1.sendRouteHandlerResponse)(id, user_1.getUserById, res, 'Register');
});
router.post('/login', (req, res) => {
    (0, helpers_1.sendRouteHandlerResponse)(req.body, auth_1.login, res, 'Login');
});
router.post('/logout', (req, res) => {
    (0, helpers_1.sendRouteHandlerResponse)(undefined, auth_1.logout, res, 'Login');
});
router.post('/password/change', (req, res) => {
    (0, helpers_1.sendRouteHandlerResponse)(req.body, auth_1.changePassword, res, 'Login');
});
exports.default = router;
