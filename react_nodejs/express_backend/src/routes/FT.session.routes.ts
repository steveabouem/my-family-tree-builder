import { Router, Request, Response, NextFunction } from "express";
import FTAuthMiddleware from "../middleware-classes/auth/auth.middleware";
import cookieParser from "cookie-parser";
import winston from "winston";
import SessionController from "../controllers/session/SessionController";

const router = Router();
router.use(cookieParser());
router.use((req: Request, res: Response, next: NextFunction) => {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const authMiddleware = new FTAuthMiddleware();

  authMiddleware.verifyIp(ip)
    .then((valid: boolean) => {
      if (!valid) {
        res.status(400);
        res.json({ ipIsValid: false });
      }
    })
    .catch((e: unknown) => {
    winston.log('error' ,  e);
      // TODO: catch return false doesnt actually catch falty logic, 
      // just wrong syntax and maybe wrong typing. FIX
      res.status(400);
      res.json({ ipIsValid: false, message: e });
    });
  next();
});

// TODO: req, res typing
router.get('/get-data', (req: Request, res: Response) => {
  const sessionController = new SessionController();
  sessionController.getCurrent(req, res);
});

router.post('/set-data', (req: Request, res: Response) => {
  // TODO: Kill session, send back the guest session default
  // const ftSessionMiddleware = new FTSessionMiddleware();
  // const sessionData = ftSessionMiddleware.createSession(req.body.data);
  // res.json(sessionData);
});

export default router;