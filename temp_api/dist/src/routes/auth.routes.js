"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../services/auth");
const user_1 = require("../services/user");
const helpers_1 = require("./helpers");
const router = (0, express_1.Router)();
router.post('/register', (req, res) => {
    (0, helpers_1.sendRouteHandlerResponse)(req.body, auth_1.register, res, 'Register', req);
});
router.get('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    (0, helpers_1.sendRouteHandlerResponse)(id, user_1.getProfileDetailsByUserId, res, 'Get user');
});
router.post('/login', (req, res) => {
    (0, helpers_1.sendRouteHandlerResponse)(req.body, auth_1.login, res, 'Login', req);
});
router.post('/logout', (req, res, next) => {
    try {
        req.session.destroy((err) => {
            if (err) {
                return res.status(500).json({ error: "Failed to destroy session", err });
            }
            res.clearCookie(process.env.COOKIE_NAME, {
                httpOnly: true,
                secure: true,
                sameSite: "lax",
            });
            return res.status(200).json({ message: "Logged out successfully" });
        });
    }
    catch (e) {
        res.status(500);
        res.json('failed');
    }
});
router.post('/user/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    (0, helpers_1.sendRouteHandlerResponse)(Object.assign(Object.assign({}, req.body), { userId }), auth_1.updateUser, res, 'update user');
});
exports.default = router;
