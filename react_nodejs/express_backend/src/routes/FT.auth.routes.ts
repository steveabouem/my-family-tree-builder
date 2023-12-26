import { Router, Request, Response, NextFunction } from "express";
import dayjs from 'dayjs';
import FTSessionMiddleware from "../middleware-classes/session/FT.session.middleware";
import FTAuthMiddleware from "../middleware-classes/auth/FT.auth.middleware";
import { FTUserMiddleware } from "../middleware-classes/user/FT.user.middleware";
import logger from "../utils/logger";
import { DEndpointResponse, DHelperResponse } from "./definitions";
import AuthController from "../controllers/auth/AuthController";


const router = Router();

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
      console.log('error', e);
      res.status(400);
      res.json({ ipIsValid: false, message: e });
    });
  next();
});

// TODO: typing of req body for 
router.post('/register', (req: Request, res: Response, next: NextFunction) => {
  const authController = new AuthController();
  authController.register(req, res);
});

// TODO: req, res typing
router.post('/login', (req: Request, res: Response) => {
  // processLogin(req)
  //   .then((sessionData: DSessionUser | null) => {
  //     res.set('Set-Cookie', `${sessionData?.token}`);
  //     res.set('httpOnly', 'true');
  //     res.status(200);
  //     res.json({ session: sessionData });
  //   });
});

router.post('/logout', (req: Request, res: Response) => {
  // TODO: Kill session, send back the guest session default
  res.set('Set-Cookie', 'FT=;');
  res.set('httpOnly', 'true');
  res.status(200);
  res.json({ session: undefined });
});

export default router;

// HELPERS

// const processLogin = async (req: Request): Promise<DSessionUser | null> => {
//   const ftAuthMiddleware = new FTAuthMiddleware();
//   const verifiedUser = await ftAuthMiddleware.verifyUser(req.body)
//     .catch((e: unknown) => {
//       winston.log('error', e);
//       console.log('Error checking user'); //TODO: notify, and proper logging
//     });

//   if (verifiedUser) {
//     console.log('User was verified succesfuly');

//     const ftSessionMiddleware = new FTSessionMiddleware();
//     const sessionToken = await ftSessionMiddleware.createSession(verifiedUser);
//     console.log('GOT TOKEN ', sessionToken);
//     const currentSession = await ftSessionMiddleware.getSessionData(sessionToken || '', ['id', 'email', 'first_name', 'last_name', 'gender']);

//     return { ...currentSession, id: 1, type: 'user', token: sessionToken };
//   } else {
//     return null;
//   }
// }