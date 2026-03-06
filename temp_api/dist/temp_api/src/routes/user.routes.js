"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const logger_1 = __importDefault(require("../utils/logger"));
const user_1 = require("../services/user");
const router = (0, express_1.Router)();
router.get('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    (0, user_1.getUserById)(id)
        .then((data) => {
        res.json(data);
    })
        .catch((e) => {
        logger_1.default.error('error', e);
        res.status(500);
        res.json('failed');
    });
});
// router.get('/:id/families', (req: Request, res: Response) => {
//   userService.getRelatedFamilies(parseInt(req.params.id))
//     .then((fams: any) => {
//       console.log('DONE');
//       res.json({ "relatedFamilies": fams });
//     })
//     .catch((e: unknown) => {
//       winston.log('error', e); //TODO: logging and error handling
//       console.log('ERRORRRR: ', e);
//       res.status(500);
//       res.json('failed');
//     });
// });
// router.get('/:id/extended-families', (req: Request, res: Response) => {
//   userService.getExtendedFamiliesDetails(parseInt(req.params.id))
//     .then((fams: any) => {
//       console.log('DONE');
//       res.json({ "relatedFamilies": fams });
//     })
//     .catch((e: unknown) => {
//       winston.log('error', e); //TODO: logging and error handling
//       console.log('ERRORRRR: ', e);
//       res.status(500);
//       res.json('failed');
//     });
// });
exports.default = router;
