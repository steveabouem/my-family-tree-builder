"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const router = (0, express_1.Router)();
router.use((0, cookie_parser_1.default)());
// // ! -TOFIX: req, res typing
// router.get('/', (req: Request, res: Response) => {
//   const helper = new RequestHelper(req, res);
//   const sessionController = new SessionController();
//   // helper.sendResponseFromControllerMethod(sessionController.getCurrent, 'Get Current Session');
// });
// router.post('/set-data', (req: Request, res: Response) => {
//   // ! -TOFIX: Kill session, send back the guest session default
//   // const ftSessionMiddleware = new FTSessionMiddleware();
//   // const sessionData = ftSessionMiddleware.createSession(req.body.data);
//   // res.json(sessionData);
// });
exports.default = router;
