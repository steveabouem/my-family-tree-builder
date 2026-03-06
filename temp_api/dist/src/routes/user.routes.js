"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_1 = require("../services/user");
const helpers_1 = require("./helpers");
const middlewares_1 = require("./middlewares");
const router = (0, express_1.Router)();
router.get('/:id', middlewares_1.authCheck, (req, res, next) => {
    const userId = Number(req.params.id);
    (0, helpers_1.sendRouteHandlerResponse)(userId, user_1.getProfileDetailsByUserId, res, 'Get user', req);
});
exports.default = router;
