"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
// import { sendRouteHandlerResponse } from "./helpers";
// import { APIGetSessionResponse } from "../services/types";
// import { getCurrentSession } from "../services/session";
const router = (0, express_1.Router)();
router.get('/', (req, res) => {
    // sendRouteHandlerResponse<Request, APIGetSessionResponse>(req, getCurrentSession, res, 'Get Current Session');
});
exports.default = router;
