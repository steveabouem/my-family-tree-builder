import { Router, Request, Response, NextFunction } from "express";
import cookieParser from "cookie-parser";
import winston from "winston";

const router = Router();
router.use(cookieParser());

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

export default router;