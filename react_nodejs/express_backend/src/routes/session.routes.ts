import { Router, Request, Response, NextFunction } from "express";
import AuthMiddleware from "../middleware-classes/auth/auth.middleware";
import cookieParser from "cookie-parser";
import winston from "winston";
import SessionController from "../controllers/session/SessionController";

const router = Router();
router.use(cookieParser());
router.use((req: Request, res: Response, next: NextFunction) => {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const authMiddleware = new AuthMiddleware();

  authMiddleware.verifyIp(ip)
    .then((valid: boolean) => {
      if (!valid) {
        res.status(400);
        res.json({ ipIsValid: false });
      }
    })
    .catch((e: unknown) => {
      winston.log('error', e);
      // ! -TOFIX: catch return false doesnt actually catch falty logic, 
      // just wrong syntax and maybe wrong typing. FIX
      res.status(400);
      res.json({ ipIsValid: false, message: e });
      return;
    });
  next();
});

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