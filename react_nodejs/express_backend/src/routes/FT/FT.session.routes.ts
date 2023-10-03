import { Router, Request, Response, NextFunction } from "express";
import FTSessionMiddleware from "../../middleware-classes/FT/session/FT.session.middleware";
import { DSessionUser } from "../definitions";
import FTAuthMiddleware from "../../middleware-classes/FT/auth/FT.auth.middleware";
import cookieParser from "cookie-parser";

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
    .catch(e => {
      // TODO: catch return false doesnt actually catch falty logic, 
      // just wrong syntax and maybe wrong typing. FIX
      res.status(400);
      res.json({ ipIsValid: false, message: e });
    });


  next();
});

// TODO: req, res typing
router.post('/get-data', (req: Request, res: Response) => {
  const ftSessionMiddleware = new FTSessionMiddleware();
  const sessionData = ftSessionMiddleware.getSessionData(req.body.data);
  res.json(sessionData);
});

router.post('/set-data', (req: Request, res: Response) => {
  // TODO: Kill session, send back the guest session default
  const ftSessionMiddleware = new FTSessionMiddleware();
  const sessionData = ftSessionMiddleware.setSession(req.body.data);
  res.json(sessionData);
});

export default router;