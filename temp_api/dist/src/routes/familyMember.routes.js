"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const middlewares_1 = require("./middlewares");
const helpers_1 = require("./helpers");
const familyMember_1 = require("../services/familyMember");
const router = (0, express_1.Router)();
router.get("/:id", middlewares_1.authCheck, (req, res) => {
    const id = parseInt(req.params.id);
    const sessionUser = (0, helpers_1.getSessionUser)(req);
    const userId = sessionUser === null || sessionUser === void 0 ? void 0 : sessionUser.userId;
    (0, helpers_1.sendRouteHandlerResponse)({ memberId: id, userId }, familyMember_1.getMemberByNodeId, res, "getMember", req);
});
exports.default = router;
