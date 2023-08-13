"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const User_controller_1 = __importDefault(require("../../controllers/tracker/User/User.controller"));
const router = (0, express_1.Router)();
router.use((req, res, next) => {
    next();
});
router.get('/index', (req, res) => {
    const userController = new User_controller_1.default();
    // TODO: typing of returned json for line 11 and the result below
    userController.getList(undefined, undefined, undefined, 20).then((result) => {
        res.json(result[0]);
    })
        .catch(() => res.status(400).send());
});
router.post('/create', (req, res) => {
    const userController = new User_controller_1.default();
    const ip = '';
    const newUserFieldValues = Object.assign(Object.assign({}, req.body), { authorizedIps: [ip], roles: '[1]' });
    res.send('ok');
    // userController.create(newUserFieldValues)
    //     .then((r: boolean) => {
    //         res.json(r);
    //     })
    //     .catch(() => {
    //         res.status(400).send();
    //     });
});
exports.default = router;
